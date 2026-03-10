---
title: "How to Solve Stone Game II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Stone Game II. Medium difficulty, 72.9% acceptance rate. Topics: Array, Math, Dynamic Programming, Prefix Sum, Game Theory."
date: "2026-02-06"
category: "dsa-patterns"
tags: ["stone-game-ii", "array", "math", "dynamic-programming", "medium"]
---

# How to Solve Stone Game II

Stone Game II is a two-player game where Alice and Bob take turns removing stones from piles arranged in a row. The twist is that on each turn, a player can take **1 to 2M** piles from the front, where M starts at 1 and doubles each time a player takes the maximum allowed. The objective is to maximize your total stones. What makes this tricky is that both players play optimally—you can't assume your opponent makes mistakes—and the doubling M creates a state that depends on previous moves.

## Visual Walkthrough

Let's trace through a small example: `piles = [2,7,11,15]` with Alice starting first (M = 1 initially).

**Turn 1 (Alice, M = 1):**

- Alice can take 1 pile (2 stones) or 2 piles (2+7=9 stones)
- If she takes 1 pile: Remaining = [7,11,15], M becomes max(1,1)=1
- If she takes 2 piles: Remaining = [11,15], M becomes max(1,2)=2
- She'll choose the option that maximizes her final score considering Bob's optimal response

**Turn 2 (Bob):**

- Scenario 1: Remaining [7,11,15], M=1 → Bob can take 1 or 2 piles
- Scenario 2: Remaining [11,15], M=2 → Bob can take 1-4 piles (but only 2 available)

The key insight: We need to think **backwards** from the end. When few piles remain, the current player can take all remaining piles. Working backwards, we can calculate the maximum stones each player can get from any position with any M value.

## Brute Force Approach

A naive solution would explore all possible moves recursively:

1. At position `i` with current `M`, the player can take `x` piles where `1 ≤ x ≤ 2M` and `i + x ≤ n`
2. After taking `x` piles, the opponent plays optimally from position `i+x` with `M' = max(M, x)`
3. The current player's score is the sum of taken piles plus what remains after opponent's optimal play

The brute force would look like this:

<div class="code-group">

```python
def stoneGameII(piles):
    n = len(piles)

    def dfs(i, M, is_alice):
        if i >= n:
            return 0

        best = 0 if is_alice else float('inf')
        total = 0

        for x in range(1, min(2*M, n-i) + 1):
            total += piles[i + x - 1]
            if is_alice:
                best = max(best, total + dfs(i + x, max(M, x), False))
            else:
                # For Bob, we want to minimize Alice's score
                best = min(best, dfs(i + x, max(M, x), True))

        return best

    return dfs(0, 1, True)
```

```javascript
function stoneGameII(piles) {
  const n = piles.length;

  function dfs(i, M, isAlice) {
    if (i >= n) return 0;

    let best = isAlice ? 0 : Infinity;
    let total = 0;

    for (let x = 1; x <= Math.min(2 * M, n - i); x++) {
      total += piles[i + x - 1];
      if (isAlice) {
        best = Math.max(best, total + dfs(i + x, Math.max(M, x), false));
      } else {
        best = Math.min(best, dfs(i + x, Math.max(M, x), true));
      }
    }

    return best;
  }

  return dfs(0, 1, true);
}
```

```java
public int stoneGameII(int[] piles) {
    return dfs(0, 1, true, piles);
}

private int dfs(int i, int M, boolean isAlice, int[] piles) {
    if (i >= piles.length) return 0;

    int best = isAlice ? 0 : Integer.MAX_VALUE;
    int total = 0;

    for (int x = 1; x <= Math.min(2 * M, piles.length - i); x++) {
        total += piles[i + x - 1];
        if (isAlice) {
            best = Math.max(best, total + dfs(i + x, Math.max(M, x), false, piles));
        } else {
            best = Math.min(best, dfs(i + x, Math.max(M, x), true, piles));
        }
    }

    return best;
}
```

</div>

**Why this is too slow:** This has exponential time complexity O(2^n) because at each step we explore up to 2M possibilities, and M can grow up to n. For n=100 (the problem constraint), this is completely infeasible.

## Optimized Approach

The key insight is that we can use **dynamic programming with memoization** to avoid recomputing states. Notice that the game state is defined by:

- Current position `i` (which piles remain)
- Current `M` value
- Whose turn it is

However, we can simplify further: Instead of tracking whose turn it is separately, we can define `dp[i][M]` as the **maximum stones the current player can get** starting from position `i` with M value `M`.

The recurrence relation becomes:

1. If the current player can take all remaining piles (`i + 2M ≥ n`), take everything
2. Otherwise, try all possible `x` from 1 to 2M:
   - Take `x` piles (sum = `piles[i] + ... + piles[i+x-1]`)
   - Opponent gets `dp[i+x][max(M, x)]`
   - Remaining total stones from position `i` is fixed
   - So current player gets: `(total stones from i to end) - (opponent's best score)`

We need prefix sums to quickly calculate the sum of taken piles.

## Optimal Solution

Here's the complete DP solution with memoization:

<div class="code-group">

```python
def stoneGameII(piles):
    n = len(piles)

    # Prefix sums: prefix[i] = sum of piles[0] to piles[i-1]
    # So sum from i to j-1 = prefix[j] - prefix[i]
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + piles[i]

    # Memoization dictionary
    memo = {}

    def dfs(i, M):
        # If we can take all remaining piles, do so
        if i + 2 * M >= n:
            return prefix[n] - prefix[i]

        # Check if we've computed this state before
        if (i, M) in memo:
            return memo[(i, M)]

        best = 0
        # Try taking 1 to 2M piles
        for x in range(1, 2 * M + 1):
            # New position after taking x piles
            next_i = i + x
            if next_i > n:
                break

            # Stones taken in this move
            taken = prefix[next_i] - prefix[i]

            # Remaining stones after opponent plays optimally
            remaining_total = prefix[n] - prefix[next_i]
            opponent_best = dfs(next_i, max(M, x))

            # Current player gets: taken + (remaining - opponent_best)
            current_score = taken + (remaining_total - opponent_best)
            best = max(best, current_score)

        memo[(i, M)] = best
        return best

    return dfs(0, 1)
```

```javascript
function stoneGameII(piles) {
  const n = piles.length;

  // Prefix sums: prefix[i] = sum of piles[0] to piles[i-1]
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + piles[i];
  }

  // Memoization cache
  const memo = new Map();

  function dfs(i, M) {
    // If we can take all remaining piles, do so
    if (i + 2 * M >= n) {
      return prefix[n] - prefix[i];
    }

    // Check memoization
    const key = `${i},${M}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    let best = 0;
    // Try taking 1 to 2M piles
    for (let x = 1; x <= 2 * M; x++) {
      const next_i = i + x;
      if (next_i > n) break;

      // Stones taken in this move
      const taken = prefix[next_i] - prefix[i];

      // Remaining stones after opponent plays optimally
      const remainingTotal = prefix[n] - prefix[next_i];
      const opponentBest = dfs(next_i, Math.max(M, x));

      // Current player gets: taken + (remaining - opponent_best)
      const currentScore = taken + (remainingTotal - opponentBest);
      best = Math.max(best, currentScore);
    }

    memo.set(key, best);
    return best;
  }

  return dfs(0, 1);
}
```

```java
public int stoneGameII(int[] piles) {
    int n = piles.length;

    // Prefix sums: prefix[i] = sum of piles[0] to piles[i-1]
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + piles[i];
    }

    // Memoization: dp[i][M] = max stones from position i with M
    // M can be at most n, but we use n+1 for safety
    int[][] dp = new int[n + 1][n + 1];

    return dfs(0, 1, prefix, dp, n);
}

private int dfs(int i, int M, int[] prefix, int[][] dp, int n) {
    // If we can take all remaining piles, do so
    if (i + 2 * M >= n) {
        return prefix[n] - prefix[i];
    }

    // Check if already computed
    if (dp[i][M] != 0) {
        return dp[i][M];
    }

    int best = 0;
    // Try taking 1 to 2M piles
    for (int x = 1; x <= 2 * M; x++) {
        int next_i = i + x;
        if (next_i > n) break;

        // Stones taken in this move
        int taken = prefix[next_i] - prefix[i];

        // Remaining stones after opponent plays optimally
        int remainingTotal = prefix[n] - prefix[next_i];
        int opponentBest = dfs(next_i, Math.max(M, x), prefix, dp, n);

        // Current player gets: taken + (remaining - opponent_best)
        int currentScore = taken + (remainingTotal - opponentBest);
        best = Math.max(best, currentScore);
    }

    dp[i][M] = best;
    return best;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n³) in the worst case, but typically much better in practice. We have n positions × n possible M values = O(n²) states. For each state, we try up to 2M moves, and M can be up to n, so O(n) moves per state. However, with memoization and the early termination when `i + 2M ≥ n`, the actual runtime is much better.

**Space Complexity:** O(n²) for the memoization table/dictionary. The prefix sum array uses O(n) additional space.

## Common Mistakes

1. **Forgetting that both players play optimally:** Some candidates write code where the opponent always takes the minimum or makes suboptimal moves. Remember: In game theory DP, you must assume your opponent plays as well as possible.

2. **Incorrect state definition:** Defining state as `(i, M, player)` is correct but leads to O(2n²) states. The optimized version uses `(i, M)` and calculates scores relative to the current player, which is more efficient.

3. **Not using prefix sums:** Calculating pile sums repeatedly with loops inside the DP leads to O(n⁴) complexity. Prefix sums are essential for O(1) range sum queries.

4. **Base case errors:** The condition `if i + 2*M >= n` means "if we can take ALL remaining piles," not "if we can take some piles." This is a subtle but important distinction.

## When You'll See This Pattern

This **minimax game theory DP** pattern appears in many two-player game problems:

1. **Stone Game variants** (I, III, IV, V, VI, VII): All involve optimal play with piles of stones, though the rules differ.

2. **Predict the Winner (LeetCode 486)**: Similar minimax DP where players take from ends of an array.

3. **Can I Win (LeetCode 464)**: Bitmask DP for a different type of two-player game.

The core pattern: Define game states, use memoization to avoid recomputation, and assume optimal play from both players. The recurrence usually has the form: `dp[state] = max over moves (current_gain + (total_remaining - dp[next_state]))`.

## Key Takeaways

1. **Game theory DP often uses "current player's perspective"**: Instead of tracking absolute scores for both players, track the maximum score the **current player** can achieve from a given state.

2. **Prefix sums are your friend**: When you need frequent range sum queries in an array, prefix sums provide O(1) lookups after O(n) preprocessing.

3. **Think backwards from winning positions**: In many game problems, it's easier to reason from the end state backward to the beginning, which naturally leads to a DP solution.

Related problems: [Stone Game V](/problem/stone-game-v), [Stone Game VI](/problem/stone-game-vi), [Stone Game VII](/problem/stone-game-vii)
