import Logo from "@/assets/cote-logo.svg?react";
import { ArrowUpRight, LockKeyhole, Zap } from "lucide-react";
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
            <Zap stroke="1.5" className="size-3.5" />
            Better work, together
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
        <div className="cote-auth-ambient" aria-hidden="true">
          <span className="cote-auth-ambient-orb cote-auth-ambient-orb-one" />
          <span className="cote-auth-ambient-orb cote-auth-ambient-orb-two" />
          <span className="cote-auth-ambient-line" />
        </div>

        <div className="cote-auth-card">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <div className="cote-logo-tile">
              <Logo />
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight">
              cote<span className="text-primary">.</span>
            </span>
          </div>

          <div className="cote-auth-intro">
            <div className="cote-auth-kicker">
              <span className="cote-auth-kicker-dot" />
              YOUR WORKSPACE AWAITS
            </div>
            <h2 className="cote-auth-heading">
              Welcome back<span>.</span>
            </h2>
            <p className="cote-auth-description">
              Pick up where your team left off. Your conversations are just one step away.
            </p>
          </div>

          <LoginForm onGoogleLogin={handleGoogleLogin} />

          <div className="cote-auth-assurance">
            <span className="cote-auth-assurance-icon">
              <LockKeyhole className="size-4" />
            </span>
            <div>
              <p className="cote-auth-assurance-title">Secure sign-in</p>
              <p className="cote-auth-assurance-copy">Authentication handled safely by Google</p>
            </div>
          </div>

          <div className="cote-auth-footer">
            <span>New to Cote?</span>
            <span className="cote-auth-footer-copy">
              Continue with Google to get started.
            </span>
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;