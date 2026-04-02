import { CircleDecoration } from "@/utils/decorations";

export default function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <CircleDecoration className="top-0 left-1/4 w-[600px] h-[600px] bg-primary/5" />
      <CircleDecoration className="bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10" />
      <CircleDecoration className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5" />
    </div>
  );
}
