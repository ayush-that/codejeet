"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { learningData, type LocalProgress } from "@/lib/learning-data/facade";
import { SyncWorkerController } from "@/lib/learning-data/sync-client";
import {
  isIntentForActivation,
  shouldInvalidateForLifecycleBroadcast,
  shouldExposeLocalAccount,
} from "@/lib/learning-data/lifecycle-visibility";

export type LearningLifecycleState =
  | { kind: "public"; epoch: number }
  | { kind: "activating"; accountId: string; epoch: number }
  | { kind: "active"; accountId: string; epoch: number }
  | { kind: "temporary-auth-loss"; accountId: string; epoch: number };

type QueuedIntent =
  | { kind: "progress"; slug: string; completed: boolean; accountId: string | null; epoch: number }
  | { kind: "note-focus"; slug: string; accountId: string | null; epoch: number };

type LifecycleContextValue = {
  state: LearningLifecycleState;
  progress: LocalProgress;
  isLocallyActive: boolean;
  requestProgressToggle: (slug: string, completed: boolean) => void;
  requestNoteFocus: (slug: string) => void;
  noteFocusRequest: { slug: string; token: number } | null;
  signOut: () => void;
};

const noop = () => {};
const defaultLifecycle: LifecycleContextValue = {
  state: { kind: "public", epoch: 0 },
  progress: {},
  isLocallyActive: false,
  requestProgressToggle: noop,
  requestNoteFocus: noop,
  noteFocusRequest: null,
  signOut: noop,
};

const LearningLifecycleContext = createContext(defaultLifecycle);

export function useLearningDataLifecycle(): LifecycleContextValue {
  return useContext(LearningLifecycleContext);
}

export function LearningDataLifecycle({ children }: PropsWithChildren) {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const clerk = useClerk();
  const [state, setState] = useState<LearningLifecycleState>({ kind: "public", epoch: 0 });
  const [progress, setProgress] = useState<LocalProgress>(() => learningData.progress.readLocal());
  const [noteFocusRequest, setNoteFocusRequest] = useState<{
    slug: string;
    token: number;
  } | null>(null);
  const stateRef = useRef(state);
  const epochRef = useRef(0);
  const queuedIntentRef = useRef<QueuedIntent | null>(null);
  const explicitSignOutRef = useRef(false);
  const lifecycleChannelRef = useRef<BroadcastChannel | null>(null);
  const syncWorkerRef = useRef<SyncWorkerController | null>(null);

  useEffect(() => {
    syncWorkerRef.current = new SyncWorkerController();
    return () => {
      syncWorkerRef.current?.stop();
      syncWorkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const check = () => {
      void learningData.lifecycle.checkRevocations();
    };
    check();
    window.addEventListener("online", check);
    return () => window.removeEventListener("online", check);
  }, []);

  useEffect(() => {
    const active = state.kind === "active" && isSignedIn && userId;
    if (!active) {
      syncWorkerRef.current?.stop();
      return;
    }
    let cancelled = false;
    void getToken().then((token) => {
      if (!cancelled && token && state.kind === "active" && state.accountId === userId) {
        syncWorkerRef.current?.start({ accountId: userId, epoch: state.epoch, token });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [getToken, isSignedIn, state, userId]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => learningData.progress.subscribe(setProgress), []);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const channel = new BroadcastChannel("codejeet-learning-lifecycle");
    lifecycleChannelRef.current = channel;
    channel.onmessage = (event: MessageEvent<unknown>) => {
      const message = event.data as {
        kind?: unknown;
        accountId?: unknown;
        epoch?: unknown;
      };
      if (
        (message?.kind !== "lifecycle" && message?.kind !== "explicit-sign-out") ||
        typeof message.epoch !== "number"
      )
        return;
      const current = stateRef.current;
      const currentAccountId =
        current.kind === "active" ||
        current.kind === "activating" ||
        current.kind === "temporary-auth-loss"
          ? current.accountId
          : null;
      if (
        !shouldInvalidateForLifecycleBroadcast(
          currentAccountId,
          epochRef.current,
          typeof message.accountId === "string" ? message.accountId : null,
          message.epoch,
          message.kind === "explicit-sign-out"
        )
      ) {
        return;
      }
      if (typeof message.accountId !== "string") {
        epochRef.current = message.epoch;
        queuedIntentRef.current = null;
        setNoteFocusRequest(null);
        learningData.lifecycle.deactivate();
        setProgress({});
        setState({ kind: "public", epoch: message.epoch });
      } else {
        if (currentAccountId && currentAccountId !== message.accountId) {
          epochRef.current = message.epoch;
          queuedIntentRef.current = null;
          setNoteFocusRequest(null);
          learningData.lifecycle.deactivate();
          setProgress({});
          setState({ kind: "public", epoch: message.epoch });
        }
      }
    };
    return () => {
      channel.close();
      lifecycleChannelRef.current = null;
    };
  }, []);

  useEffect(() => {
    const accountId =
      state.kind === "active" || state.kind === "activating" || state.kind === "temporary-auth-loss"
        ? state.accountId
        : null;
    lifecycleChannelRef.current?.postMessage({
      kind: "lifecycle",
      accountId,
      epoch: state.epoch,
    });
  }, [state]);

  useEffect(() => {
    if (!isLoaded) {
      const current = stateRef.current;
      if (current.kind === "active" || current.kind === "temporary-auth-loss") {
        setState({ ...current, kind: "temporary-auth-loss" });
      }
      return;
    }

    if (!isSignedIn || !userId) {
      const current = stateRef.current;
      if (
        !explicitSignOutRef.current &&
        (current.kind === "active" || current.kind === "temporary-auth-loss")
      ) {
        setState({ ...current, kind: "temporary-auth-loss" });
        return;
      }
      epochRef.current += 1;
      queuedIntentRef.current = null;
      learningData.lifecycle.deactivate();
      setProgress({});
      setNoteFocusRequest(null);
      setState({ kind: "public", epoch: epochRef.current });
      explicitSignOutRef.current = false;
      return;
    }

    const current = stateRef.current;
    if (
      (current.kind === "active" || current.kind === "temporary-auth-loss") &&
      current.accountId === userId
    ) {
      if (current.kind === "temporary-auth-loss") {
        setState({ ...current, kind: "active" });
      }
      return;
    }

    const intentEpoch = epochRef.current;
    const activationEpoch = ++epochRef.current;
    let cancelled = false;
    // Clear the view before a switch so account A cannot be rendered or mutated
    // while account B is being validated.
    learningData.lifecycle.deactivate();
    setProgress({});
    setState({ kind: "activating", accountId: userId, epoch: activationEpoch });

    void learningData.lifecycle.activate(userId).then((result) => {
      if (
        cancelled ||
        activationEpoch !== epochRef.current ||
        !result.ok ||
        result.accountId !== userId
      ) {
        if (!cancelled && activationEpoch === epochRef.current) {
          setProgress({});
          setState({ kind: "public", epoch: activationEpoch });
        }
        return;
      }

      setProgress(result.progress);
      setState({ kind: "active", accountId: userId, epoch: activationEpoch });
      const intent = queuedIntentRef.current;
      if (intent && isIntentForActivation(intent, userId, activationEpoch, intentEpoch)) {
        queuedIntentRef.current = null;
        if (intent.kind === "progress") {
          void learningData.progress.commit(intent.slug, intent.completed).then(setProgress);
        } else {
          setNoteFocusRequest({ slug: intent.slug, token: activationEpoch });
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, userId]);

  const openSignIn = useCallback(() => {
    clerk.openSignIn();
  }, [clerk]);

  const requestProgressToggle = useCallback(
    (slug: string, completed: boolean) => {
      const current = stateRef.current;
      if (current.kind === "active" || current.kind === "temporary-auth-loss") {
        void learningData.progress.commit(slug, completed).then(setProgress);
        return;
      }
      queuedIntentRef.current = {
        kind: "progress",
        slug,
        completed,
        accountId: current.kind === "activating" ? current.accountId : null,
        epoch: epochRef.current,
      };
      if (!isSignedIn || !userId) openSignIn();
    },
    [isSignedIn, openSignIn, userId]
  );

  const requestNoteFocus = useCallback(
    (slug: string) => {
      const current = stateRef.current;
      if (current.kind === "active" || current.kind === "temporary-auth-loss") return;
      // Never capture the textarea value here. Only the intent to focus is safe
      // to carry through authentication.
      queuedIntentRef.current = {
        kind: "note-focus",
        slug,
        accountId: current.kind === "activating" ? current.accountId : null,
        epoch: epochRef.current,
      };
      if (!isSignedIn || !userId) openSignIn();
    },
    [isSignedIn, openSignIn, userId]
  );

  const signOut = useCallback(() => {
    explicitSignOutRef.current = true;
    epochRef.current += 1;
    queuedIntentRef.current = null;
    setNoteFocusRequest(null);
    learningData.lifecycle.deactivate();
    setProgress({});
    setState({ kind: "public", epoch: epochRef.current });
    lifecycleChannelRef.current?.postMessage({
      kind: "explicit-sign-out",
      accountId: null,
      epoch: epochRef.current,
    });
    void clerk.signOut(() => {});
  }, [clerk]);

  const value = useMemo<LifecycleContextValue>(() => {
    // Clerk identity changes arrive during render, before the effect can
    // deactivate the cache. Gate the exposed view immediately to avoid a
    // single render of the previous account.
    const isLocallyActive = shouldExposeLocalAccount(state, {
      isLoaded,
      isSignedIn: Boolean(isSignedIn),
      userId: userId ?? null,
    });
    return {
      state,
      progress: isLocallyActive ? progress : {},
      isLocallyActive,
      requestProgressToggle,
      requestNoteFocus,
      noteFocusRequest,
      signOut,
    };
  }, [
    state,
    progress,
    isLoaded,
    isSignedIn,
    userId,
    requestProgressToggle,
    requestNoteFocus,
    noteFocusRequest,
    signOut,
  ]);

  return (
    <LearningLifecycleContext.Provider value={value}>{children}</LearningLifecycleContext.Provider>
  );
}
