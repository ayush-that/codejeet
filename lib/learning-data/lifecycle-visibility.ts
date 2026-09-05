export type LocalAccountLifecycleState =
  | { kind: "public"; epoch: number }
  | { kind: "activating"; accountId: string; epoch: number }
  | { kind: "active"; accountId: string; epoch: number }
  | { kind: "temporary-auth-loss"; accountId: string; epoch: number };

export type ClerkIdentityState = {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
};

export type LearningIntent = {
  accountId: string | null;
  epoch: number;
};

export function isIntentForActivation(
  intent: LearningIntent | null,
  accountId: string,
  activationEpoch: number,
  precedingEpoch: number
): boolean {
  if (!intent || (intent.accountId !== null && intent.accountId !== accountId)) return false;
  return intent.epoch === precedingEpoch || intent.epoch === activationEpoch;
}

export function shouldInvalidateForLifecycleBroadcast(
  currentAccountId: string | null,
  currentEpoch: number,
  messageAccountId: string | null,
  messageEpoch: number
): boolean {
  if (messageEpoch <= currentEpoch) return false;
  return (
    messageAccountId === null || currentAccountId === null || currentAccountId !== messageAccountId
  );
}

/** Keep a local account visible through auth loss, but never across identity changes. */
export function shouldExposeLocalAccount(
  lifecycle: LocalAccountLifecycleState,
  clerk: ClerkIdentityState
): boolean {
  if (lifecycle.kind !== "active" && lifecycle.kind !== "temporary-auth-loss") return false;
  return !(clerk.isSignedIn && clerk.userId && clerk.userId !== lifecycle.accountId);
}
