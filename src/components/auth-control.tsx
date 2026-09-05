import { Show, createSignal, onMount } from "solid-js";

export function AuthControl() {
  const [available, setAvailable] = createSignal(false);
  const [signedIn, setSignedIn] = createSignal(false);

  onMount(() => {
    void import("../lib/clerk").then(async ({ getClerk }) => {
      const clerk = await getClerk();
      if (!clerk) return;
      setAvailable(true);
      setSignedIn(Boolean(clerk.session));
    });
  });

  const signIn = async () => {
    const { getClerk } = await import("../lib/clerk");
    const clerk = await getClerk();
    if (!clerk) return;
    await clerk.openSignIn();
    setSignedIn(Boolean(clerk.session));
  };

  return (
    <Show when={available()}>
      <Show
        when={signedIn()}
        fallback={
          <button
            class="text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={() => void signIn()}
            type="button"
          >
            Sign in
          </button>
        }
      >
        <span class="text-sm text-muted-foreground">Signed in</span>
      </Show>
    </Show>
  );
}
