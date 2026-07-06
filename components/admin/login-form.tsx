"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/neon-button";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError("كلمة المرور غير صحيحة · Wrong password");
      }
    } catch {
      setError("حدث خطأ، حاولي مرة أخرى · Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-navy via-blue to-sky px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-extrabold">لوحة التحكم</h1>
          <p className="text-sm text-white/70">
            أدخلي كلمة المرور للوصول إلى لوحة التحكم
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور · Password"
          autoFocus
          className="mb-4 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition-colors focus:border-sky"
        />

        {error ? (
          <p className="mb-4 text-center text-sm text-red-300">{error}</p>
        ) : null}

        <Button
          type="submit"
          variant="solid"
          size="lg"
          disabled={loading}
          className="w-full font-semibold disabled:opacity-60"
        >
          {loading ? "..." : "دخول · Sign in"}
        </Button>
      </form>
    </div>
  );
}
