const DEFAULT_TIMEOUT_MS = 15_000;

export class HttpError extends Error {
  readonly status: number;
  readonly body?: string;

  constructor(status: number, message: string, body?: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

function resolveSignal(
  signal: AbortSignal | null | undefined,
  timeoutMs: number,
): AbortSignal {
  if (signal) return signal;
  return AbortSignal.timeout(timeoutMs);
}

async function assertOk(response: Response): Promise<void> {
  if (response.ok) return;

  const body = await response.text().catch(() => "");
  throw new HttpError(
    response.status,
    response.statusText || `Request failed with ${response.status}`,
    body,
  );
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    signal: resolveSignal(init.signal, timeoutMs),
  });

  await assertOk(response);
  return (await response.json()) as T;
}

export async function fetchArrayBuffer(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ArrayBuffer> {
  const response = await fetch(input, {
    ...init,
    signal: resolveSignal(init.signal, timeoutMs),
  });

  await assertOk(response);
  return response.arrayBuffer();
}

export async function fetchBlob(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Blob> {
  const response = await fetch(input, {
    ...init,
    signal: resolveSignal(init.signal, timeoutMs),
  });

  await assertOk(response);
  return response.blob();
}
