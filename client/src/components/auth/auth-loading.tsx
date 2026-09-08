export const AuthLoading = () => {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Replace this with your actual Cote logo / graphic */}
        <img src="/cote-logo.svg" alt="Cote" className="h-12 w-auto" />

        <p className="text-sm text-muted-foreground">Getting things ready...</p>
      </div>
    </main>
  );
};
