"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" dir="ltr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#0f172a",
          color: "#f8fafc",
        }}
      >
        <main
          style={{
            width: "100%",
            maxWidth: "520px",
            border: "1px solid rgba(248, 250, 252, 0.15)",
            borderRadius: "16px",
            padding: "32px",
            textAlign: "center",
            background: "rgba(15, 23, 42, 0.95)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: "56px",
              height: "56px",
              margin: "0 auto 20px",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(248, 113, 113, 0.15)",
              color: "#f87171",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            !
          </div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Something went wrong</h1>
          <p
            style={{
              margin: "12px 0 0",
              color: "#cbd5e1",
              lineHeight: 1.6,
              fontSize: "14px",
            }}
          >
            The application could not start. Please try again. If the problem continues,
            reload the page.
          </p>
          <p
            style={{
              margin: "8px 0 0",
              color: "#94a3b8",
              lineHeight: 1.6,
              fontSize: "14px",
              direction: "rtl",
            }}
          >
            تعذّر تشغيل التطبيق. يرجى المحاولة مرة أخرى أو إعادة تحميل الصفحة.
          </p>
          {error.digest ? (
            <p style={{ margin: "12px 0 0", color: "#94a3b8", fontSize: "12px" }}>
              Error ID: <code>{error.digest}</code>
            </p>
          ) : null}
          <div
            style={{
              marginTop: "24px",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                borderRadius: "10px",
                padding: "10px 18px",
                cursor: "pointer",
                background: "#38bdf8",
                color: "#0f172a",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Try again
            </button>
            {/* A full page reload is intentional here: the router may be broken. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                borderRadius: "10px",
                padding: "10px 18px",
                border: "1px solid rgba(248, 250, 252, 0.25)",
                color: "#f8fafc",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Back to Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
