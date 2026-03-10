---
title: "How to Solve Stone Game IV — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Stone Game IV. Hard difficulty, 59.6% acceptance rate. Topics: Math, Dynamic Programming, Game Theory."
date: "2027-10-23"
category: "dsa-patterns"
tags: ["stone-game-iv", "math", "dynamic-programming", "game-theory", "hard"]
---

# How to Solve Stone Game IV

Stone Game IV is a classic game theory problem where two players take turns removing square numbers of stones from a pile. The player who cannot make a move loses. What makes this problem interesting is that it's not about finding the optimal number of stones to remove, but rather determining whether the starting player (Alice) can force a win given perfect play from both sides. This requires thinking about game states and how current decisions affect future turns.

## Visual Walkthrough

Let's trace through a small example with `n = 4` stones:

**Initial state:** 4 stones, Alice's turn

**Alice's options:** She can remove 1 stone (1²) or 4 stones (2²)

- If she removes 4 stones: Pile becomes 0 → Bob has no moves → Alice wins immediately
- If she removes 1 stone: Pile becomes 3 → Bob's turn

**Bob's turn (3 stones):** Bob can only remove 1 stone (1²)

- Bob removes 1 stone: Pile becomes 2 → Alice's turn

**Alice's turn (2 stones):** Alice can only remove 1 stone (1²)

- Alice removes 1 stone: Pile becomes 1 → Bob's turn

**Bob's turn (1 stone):** Bob can remove 1 stone (1²)

- Bob removes 1 stone: Pile becomes 0 → Alice's turn with no stones → Alice loses

So with `n = 4`, Alice can win by removing all 4 stones immediately. But what about `n = 3`?

**Initial state:** 3 stones, Alice's turn

**Alice's options:** She can only remove 1 stone (1²)

- Alice removes 1 stone: Pile becomes 2 → Bob's turn

**Bob's turn (2 stones):** Bob can only remove 1 stone (1²)

- Bob removes 1 stone: Pile becomes 1 → Alice's turn

**Alice's turn (1 stone):** Alice can remove 1 stone (1²)

- Alice removes 1 stone: Pile becomes 0 → Bob's turn with no stones → Bob loses, Alice wins

Wait, that means Alice wins with `n = 3` too! Let's check `n = 2`:

**Initial state:** 2 stones, Alice's turn

**Alice's options:** She can only remove 1 stone (1²)

- Alice removes 1 stone: Pile becomes 1 → Bob's turn

**Bob's turn (1 stone):** Bob can remove 1 stone (1²)

- Bob removes 1 stone: Pile becomes 0 → Alice's turn with no stones → Alice loses

So `n = 2` is a losing position for the player whose turn it is.

This pattern reveals the key insight: A position is winning if there exists at least one move that leaves the opponent in a losing position. A position is losing if ALL possible moves leave the opponent in a winning position.

## Brute Force Approach

The brute force approach would be to recursively explore all possible game states. For a given number of stones `n`, we would:

1. Generate all square numbers ≤ n
2. For each square number, recursively check if `n - square` is a losing position for the opponent
3. If ANY move leads to a losing position for the opponent, then `n` is a winning position
4. If NO move leads to a losing position for the opponent, then `n` is a losing position

The base case is `n = 0`, which is a losing position (the player whose turn it is has no moves).

However, this approach has exponential time complexity because we're recomputing the same subproblems many times. For example, when computing `n = 10`, we might compute `n = 6` multiple times through different sequences of moves.

## Optimized Approach

The key insight is that this is a perfect information game with no randomness, and the outcome depends only on the current number of stones. This makes it ideal for dynamic programming.

We can use memoization (top-down DP) or tabulation (bottom-up DP) to store whether a given number of stones represents a winning or losing position for the player whose turn it is.

**DP State:** `dp[i] = true` if a player facing `i` stones can force a win, `false` otherwise.

**DP Transition:**

- `dp[0] = false` (no stones means you lose)
- For `i > 0`: `dp[i] = true` if there exists a square number `k² ≤ i` such that `dp[i - k²] = false`
- This means: if you can make a move that leaves the opponent in a losing position, you win

**Why this works:** In game theory terms, we're classifying positions as "N-positions" (Next player wins) and "P-positions" (Previous player wins, meaning the player about to move loses with perfect play).

## Optimal Solution

Here's the complete solution using dynamic programming:

<div class="code-group">

```python
# Time: O(n * sqrt(n)) | Space: O(n)
def winnerSquareGame(n):
    """
    Determines if Alice (first player) can win the stone game.

    Args:
        n: Number of stones in the pile

    Returns:
        True if Alice can win, False otherwise
    """
    # dp[i] represents whether the player facing i stones can force a win
    dp = [False] * (n + 1)

    # Base case: 0 stones means the player whose turn it is loses
    dp[0] = False

    # Fill the dp array from 1 to n
    for i in range(1, n + 1):
        # Check all possible square moves
        k = 1
        while k * k <= i:
            # If there's any move that leaves opponent in losing position,
            # then current position is winning
            if not dp[i - k * k]:
                dp[i] = True
                break  # No need to check other moves if we found a winning one
            k += 1
        # If we checked all moves and none leave opponent in losing position,
        # then current position is losing (dp[i] remains False)

    return dp[n]
```

```javascript
// Time: O(n * sqrt(n)) | Space: O(n)
/**
 * Determines if Alice (first player) can win the stone game.
 * @param {number} n - Number of stones in the pile
 * @return {boolean} True if Alice can win, False otherwise
 */
function winnerSquareGame(n) {
  // dp[i] represents whether the player facing i stones can force a win
  const dp = new Array(n + 1).fill(false);

  // Base case: 0 stones means the player whose turn it is loses
  dp[0] = false;

  // Fill the dp array from 1 to n
  for (let i = 1; i <= n; i++) {
    // Check all possible square moves
    for (let k = 1; k * k <= i; k++) {
      // If there's any move that leaves opponent in losing position,
      // then current position is winning
      if (!dp[i - k * k]) {
        dp[i] = true;
        break; // No need to check other moves if we found a winning one
      }
    }
    // If we checked all moves and none leave opponent in losing position,
    // then current position is losing (dp[i] remains false)
  }

  return dp[n];
}
```

```java
// Time: O(n * sqrt(n)) | Space: O(n)
class Solution {
    /**
     * Determines if Alice (first player) can win the stone game.
     * @param n Number of stones in the pile
     * @return True if Alice can win, False otherwise
     */
    public boolean winnerSquareGame(int n) {
        // dp[i] represents whether the player facing i stones can force a win
        boolean[] dp = new boolean[n + 1];

        // Base case: 0 stones means the player whose turn it is loses
        dp[0] = false;

        // Fill the dp array from 1 to n
        for (int i = 1; i <= n; i++) {
            // Check all possible square moves
            for (int k = 1; k * k <= i; k++) {
                // If there's any move that leaves opponent in losing position,
                // then current position is winning
                if (!dp[i - k * k]) {
                    dp[i] = true;
                    break;  // No need to check other moves if we found a winning one
                }
            }
            // If we checked all moves and none leave opponent in losing position,
            // then current position is losing (dp[i] remains false)
        }

        return dp[n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n√n)

- We iterate through all values from 1 to n: O(n)
- For each value i, we check up to √i possible square moves
- In the worst case, this gives us O(n√n) operations

**Space Complexity:** O(n)

- We store a boolean array of size n+1
- No additional significant space is used

The √n factor comes from checking all square numbers ≤ i. Since the largest square number ≤ i is at most √i, we check at most √i moves for position i.

## Common Mistakes

1. **Forgetting the base case:** Some candidates forget that `dp[0] = false` (losing position). If you initialize it incorrectly, the entire DP table will be wrong.

2. **Not breaking early:** Once you find a winning move for position i, you should break out of the inner loop. Continuing to check other moves wastes time.

3. **Incorrect square number generation:** Some candidates generate square numbers incorrectly. Remember: square numbers are 1², 2², 3², ... which means 1, 4, 9, 16, etc. The condition is `k * k <= i`, not `k <= sqrt(i)` (though mathematically equivalent, the former is cleaner).

4. **Confusing player perspective:** Remember that `dp[i]` represents whether the player whose turn it is (facing i stones) can force a win. When we check `dp[i - k*k]`, we're checking if the opponent (who will face i-k\*k stones) is in a losing position.

## When You'll See This Pattern

This "game theory DP" pattern appears in many turn-based perfect information games:

1. **Nim Game (LeetCode 292):** Similar concept but with different move rules (remove 1-3 stones). The pattern is identical: a position is winning if there's a move to a losing position.

2. **Can I Win (LeetCode 464):** Another game theory DP problem where players pick numbers. The state representation is more complex (bitmask), but the core idea is the same.

3. **Predict the Winner (LeetCode 486):** Players take from ends of an array. While not exactly the same, it uses similar minimax thinking with DP.

The key signature is: two-player turn-based game, perfect information, no randomness, and the outcome depends only on the current state (not on the path taken to reach it).

## Key Takeaways

1. **Game theory DP pattern:** For turn-based perfect information games, you can often use DP where `dp[state]` represents whether the player to move can force a win from that state.

2. **Winning/Losing position definition:** A position is winning if there exists at least one move to a losing position. A position is losing if ALL moves lead to winning positions for the opponent.

3. **State representation:** The challenge is often finding the right state representation. In Stone Game IV, the state is simply the number of stones. In more complex games, you might need bitmasks or other encodings.

Remember: When you see a game theory problem with no randomness and perfect information, think about classifying positions as winning/losing and using DP to avoid recomputation.

Related problems: [Stone Game V](/problem/stone-game-v), [Stone Game VI](/problem/stone-game-vi), [Stone Game VII](/problem/stone-game-vii)
