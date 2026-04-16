import { LoginButton } from "@/components/LoginButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-md">
        <h1 className="mb-2 text-center text-2xl font-semibold text-gray-900">
          Microsoft SSO
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Sign in with your Microsoft account to continue
        </p>
        <LoginButton />
      </div>
    </main>
  );
}

