import Logo from "@/assets/cote-logo.svg?react";

export const AuthLoading = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-page">
      <div className="flex flex-col items-center">
        <div className="cote-logo-tile mb-5 size-20 rounded-[22px]">
          <Logo />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          cote<span className="text-primary">.</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">A better space to work together.</p>
      </div>
    </main>
  );
};