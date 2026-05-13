import { GlassPanel } from "@/components/ui/glass-panel";
import { LoginForm } from "@/components/auth/login-form";

export function LoginCard() {
  return (
    <GlassPanel className="p-10">
      <LoginForm />
    </GlassPanel>
  );
}
