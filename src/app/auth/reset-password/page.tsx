import { ResetPasswordForm } from "@/components/auth/reset-password";

interface ResetPasswordPageProps {
  searchParams: { token?: string };
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  return (
    <div className="container  mx-auto flex h-screen w-screen flex-col items-center justify-center">
      <ResetPasswordForm token={searchParams.token} />
    </div>
  );
}
