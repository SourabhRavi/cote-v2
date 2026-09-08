import Logo from "@/assets/cote-logo.svg?react";

export const AuthLoading = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <div className="flex shrink-0 items-center justify-center mb-4 rounded-full overflow-hidden">
          <Logo className="size-20 text-foreground animate-pulse animation-duration-[0.5s]" />
        </div>

        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Cote<span className="text-primary">.</span>
        </h1>

        <p className="mt-2 font-heading text-sm text-muted-foreground">Collaborate. Communicate.</p>
      </div>
    </main>
  );
};
