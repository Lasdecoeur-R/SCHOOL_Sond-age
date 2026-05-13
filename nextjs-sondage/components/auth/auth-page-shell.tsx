import { DecorativeImagePanel } from "@/components/auth/decorative-image-panel";

type AuthPageShellProps = {
  children: React.ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(circle at 20% 30%, #ffffff 0%, #f0f4ff 50%, #f8f9ff 100%)",
      }}
    >
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-surface-container-high/40 blur-[120px]" />
      {children}
      <DecorativeImagePanel />
    </div>
  );
}
