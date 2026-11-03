import Logo from "@/assets/cote-logo.svg?react";
import { ArrowUpRight, LockKeyhole, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/login-form.tsx";
import { API_BASE_URL } from "@/config/api.ts";

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.assign(API_BASE_URL + "/auth/google");
  };

  return (
    <main className="cote-auth-page">
      <section className="cote-auth-aside">
        <div className="relative z-10 cote-brand-lockup">
          <div className="cote-logo-tile">
            <Logo />
          </div>
          <span className="font-heading text-[20px] font-semibold tracking-tight text-white">
            cote.
          </span>
        </div>

        <div className="relative z-10 max-w-xl py-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
            <Sparkles className="size-3.5" /> Better work, together
          </div>
          <h1 className="font-heading text-5xl font-semibold leading-[1.04] tracking-tight lg:text-[64px]">
            Make room for <span className="text-[#c8caff]">good work.</span>
          </h1>
          <p className="mt-6 max-w-md text-[14px] leading-7 text-white/70">
            A thoughtful space for your team’s conversations, ideas, and everyday progress.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white/55">
          <span className="size-1.5 rounded-full bg-emerald-300" />
          Made for teams that move things forward
        </div>
      </section>

      <section className="cote-auth-content">
        <div className="cote-auth-card">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div className="cote-logo-tile">
              <Logo />
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight">
              cote<span className="text-primary">.</span>
            </span>
          </div>
          <div className="mb-8">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Welcome back
            </p>
            <h2 className="font-heading text-[34px] font-semibold tracking-tight text-foreground">
              Your team is here.
            </h2>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
              Sign in to continue where the conversation left off.
            </p>
          </div>
          <LoginForm onGoogleLogin={handleGoogleLogin} />
          <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-muted-foreground/75">
            <LockKeyhole className="size-3.5" />
            Secure sign-in powered by Google
          </div>
          <div className="mt-12 flex items-center justify-center gap-1 text-[10px] text-muted-foreground/55">
            <span>New to Cote?</span>
            <span>Sign in with your Google account to get started.</span>
            <ArrowUpRight className="size-3" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;