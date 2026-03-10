---
title: "How to Solve Stone Game VII — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Stone Game VII. Medium difficulty, 58.7% acceptance rate. Topics: Array, Math, Dynamic Programming, Game Theory."
date: "2028-10-11"
category: "dsa-patterns"
tags: ["stone-game-vii", "array", "math", "dynamic-programming", "medium"]
---

# How to Solve Stone Game VII

Stone Game VII is a classic game theory problem that combines dynamic programming with optimal play. The tricky part is that both players are trying to maximize their own score difference, not just accumulate points. This means you can't simply choose the move that gives you the most points on your turn — you need to think about how your choice affects your opponent's future moves.

## Visual Walkthrough

Let's trace through a small example: `stones = [5,3,1,4,2]` with Alice starting first.

**Initial state:** `[5,3,1,4,2]`, sum = 15

**Turn 1 (Alice):**

- Option 1: Remove leftmost (5) → remaining `[3,1,4,2]`, sum = 10, Alice gets 10 points
- Option 2: Remove rightmost (2) → remaining `[5,3,1,4]`, sum = 13, Alice gets 13 points

At first glance, removing the rightmost seems better (13 > 10). But Alice must consider Bob's optimal response!

If Alice removes rightmost (2):

- Bob faces `[5,3,1,4]`, sum = 13
- Bob can remove leftmost (5) → gets 8 points (sum of `[3,1,4]`)
- Or remove rightmost (4) → gets 9 points (sum of `[5,3,1]`)
- Bob chooses max(8,9) = 9 points

If Alice removes leftmost (5):

- Bob faces `[3,1,4,2]`, sum = 10
- Bob can remove leftmost (3) → gets 7 points (sum of `[1,4,2]`)
- Or remove rightmost (2) → gets 8 points (sum of `[3,1,4]`)
- Bob chooses max(7,8) = 8 points

So Alice should choose the move that minimizes Bob's advantage. This requires looking ahead multiple turns — exactly what dynamic programming helps us do efficiently.

## Brute Force Approach

A naive approach would explore all possible game sequences recursively. At each turn, we have two choices: remove leftmost or rightmost stone. We'd calculate the current player's score as:

```
current_score = sum(remaining_stones) + recursive_result
```

But wait — that's not quite right! The current player gets points equal to the sum of remaining stones AFTER removing one stone. So if we remove stone `i`, the player gets `sum(stones) - stones[i]` points.

The brute force recursion would look like:

```
function solve(left, right, isAliceTurn):
    if left > right: return 0

    total_sum = sum(stones[left:right+1])

    // Try removing leftmost
    remove_left = (total_sum - stones[left]) + solve(left+1, right, !isAliceTurn)

    // Try removing rightmost
    remove_right = (total_sum - stones[right]) + solve(left, right-1, !isAliceTurn)

    if isAliceTurn:
        return max(remove_left, remove_right)
    else:
        return min(remove_left, remove_right)
```

**Why this fails:** This has exponential time complexity O(2^n) because we're exploring all possible game sequences. For n=1000 (the problem constraint), this is completely infeasible. We need to memoize results and, more importantly, realize we're actually computing score differences, not absolute scores.

## Optimized Approach

The key insight is that we don't need to track Alice's and Bob's scores separately. We can track the **score difference** (Alice's score minus Bob's score). Both players play optimally, meaning:

- Alice wants to maximize the difference (her score - Bob's score)
- Bob wants to minimize the difference (which is equivalent to maximizing Bob's score - Alice's score)

This leads to a cleaner DP formulation. Let `dp[left][right]` = the maximum score difference the current player can achieve when playing with stones from index `left` to `right`.

When it's Alice's turn:

```
dp[left][right] = max(
    (sum - stones[left]) + dp[left+1][right],  // Remove left
    (sum - stones[right]) + dp[left][right-1]  // Remove right
)
```

Wait — that's not quite right either! The `dp` value already represents the difference. So if Alice removes left:

- She gets `sum - stones[left]` points immediately
- Then Bob plays with `stones[left+1:right]` and achieves difference `dp[left+1][right]`
- But from Alice's perspective, Bob's difference is negative (it's Bob's score minus Alice's score)
- So Alice's total difference = `(sum - stones[left]) - dp[left+1][right]`

Similarly for Bob's turn, but Bob wants to minimize the difference, which is equivalent to:

```
dp[left][right] = min(
    -(sum - stones[left]) + dp[left+1][right],
    -(sum - stones[right]) + dp[left][right-1]
)
```

Actually, we can simplify further by realizing that `dp` always represents the difference from the perspective of the player whose turn it is. So the recurrence becomes:

```
dp[left][right] = max(
    (sum - stones[left]) - dp[left+1][right],
    (sum - stones[right]) - dp[left][right-1]
)
```

Why subtract? Because after the current player takes their points, the next player will try to maximize their own difference, which is `dp[next_state]`. From the current player's perspective, that's negative.

We also need efficient prefix sums to calculate `sum` quickly. Let `prefix[i]` = sum of first i stones. Then sum from left to right = `prefix[right+1] - prefix[left]`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
def stoneGameVII(stones):
    """
    Calculate the maximum score difference Alice can achieve.
    Both players play optimally to maximize their own score.
    """
    n = len(stones)

    # Prefix sums for O(1) range sum queries
    # prefix[i] = sum of stones[0:i] (first i elements)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]

    # DP table: dp[left][right] = max score difference current player can achieve
    # with stones from index left to right (inclusive)
    dp = [[0] * n for _ in range(n)]

    # Fill DP table from smaller intervals to larger ones
    # We start with length 2 because for single stone (length 1),
    # removing it leaves empty array with sum 0, so dp = 0
    for length in range(2, n + 1):
        for left in range(n - length + 1):
            right = left + length - 1

            # Sum of stones in current interval
            total = prefix[right + 1] - prefix[left]

            # Option 1: Remove leftmost stone
            # Current player gets (total - stones[left]) points
            # Then next player plays on stones[left+1:right]
            # From current player's perspective, next player's advantage is dp[left+1][right]
            # So current player's net advantage = (total - stones[left]) - dp[left+1][right]
            remove_left = (total - stones[left]) - dp[left + 1][right]

            # Option 2: Remove rightmost stone
            remove_right = (total - stones[right]) - dp[left][right - 1]

            # Current player chooses the better option
            dp[left][right] = max(remove_left, remove_right)

    # dp[0][n-1] gives Alice's maximum score difference starting with all stones
    return dp[0][n - 1]
```

```javascript
// Time: O(n^2) | Space: O(n^2)
function stoneGameVII(stones) {
  const n = stones.length;

  // Prefix sums: prefix[i] = sum of stones[0..i-1]
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + stones[i];
  }

  // DP table: dp[left][right] = max score difference for current player
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));

  // Fill DP table bottom-up (smaller intervals first)
  for (let length = 2; length <= n; length++) {
    for (let left = 0; left <= n - length; left++) {
      const right = left + length - 1;

      // Sum of current interval using prefix sums
      const total = prefix[right + 1] - prefix[left];

      // Option 1: Remove leftmost stone
      const removeLeft = total - stones[left] - dp[left + 1][right];

      // Option 2: Remove rightmost stone
      const removeRight = total - stones[right] - dp[left][right - 1];

      // Current player chooses the better move
      dp[left][right] = Math.max(removeLeft, removeRight);
    }
  }

  return dp[0][n - 1];
}
```

```java
// Time: O(n^2) | Space: O(n^2)
class Solution {
    public int stoneGameVII(int[] stones) {
        int n = stones.length;

        // Prefix sums: prefix[i] = sum of stones[0..i-1]
        int[] prefix = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + stones[i];
        }

        // DP table: dp[left][right] = max score difference for current player
        int[][] dp = new int[n][n];

        // Fill DP table from smaller intervals to larger ones
        // We iterate by length because dp[left][right] depends on
        // dp[left+1][right] and dp[left][right-1] (shorter intervals)
        for (int length = 2; length <= n; length++) {
            for (int left = 0; left <= n - length; left++) {
                int right = left + length - 1;

                // Sum of stones in current interval [left, right]
                int total = prefix[right + 1] - prefix[left];

                // Option 1: Remove leftmost stone
                int removeLeft = (total - stones[left]) - dp[left + 1][right];

                // Option 2: Remove rightmost stone
                int removeRight = (total - stones[right]) - dp[left][right - 1];

                // Current player chooses the move that maximizes their advantage
                dp[left][right] = Math.max(removeLeft, removeRight);
            }
        }

        return dp[0][n - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We have O(n²) DP states (all possible `[left, right]` intervals)
- Computing each state takes O(1) time (just two options to compare)
- The nested loops iterate over all lengths from 2 to n, and for each length, over all starting positions

**Space Complexity:** O(n²)

- The DP table stores results for all n² intervals
- The prefix sum array uses O(n) space, which is dominated by the DP table
- We could optimize to O(n) space by only storing two rows at a time, but the code becomes harder to read and O(n²) space is acceptable for n ≤ 1000

## Common Mistakes

1. **Calculating absolute scores instead of differences:** Many candidates try to track Alice's and Bob's scores separately, which doubles the state space and complicates the recurrence. The key insight is that only the difference matters when both play optimally.

2. **Wrong recurrence relation:** A common error is using addition instead of subtraction:

   ```
   // WRONG: This assumes both players cooperate to maximize total score
   dp[left][right] = max((sum - stones[left]) + dp[left+1][right], ...)

   // CORRECT: Next player's advantage is subtracted from current player's
   dp[left][right] = max((sum - stones[left]) - dp[left+1][right], ...)
   ```

3. **Inefficient sum calculations:** Recalculating the sum of stones for each interval from scratch takes O(n) time, making the overall complexity O(n³). Using prefix sums reduces this to O(1) per state.

4. **Incorrect base case:** For a single stone (left == right), removing it gives 0 points (empty array sum = 0), so dp[left][left] = 0. Some candidates incorrectly set this to stones[left].

## When You'll See This Pattern

This "optimal play with intervals" pattern appears in several game theory DP problems:

1. **Stone Game (LeetCode 877)** - Similar but simpler: players take stones from ends and get the stone's value as points. Uses the same interval DP approach.

2. **Predict the Winner (LeetCode 486)** - Almost identical to Stone Game: players take from ends, and we predict if the first player can win.

3. **Burst Balloons (LeetCode 312)** - Different scoring but similar interval DP structure where you choose which element to remove from an interval.

The pattern to recognize: when you have a game where players make choices that affect a shrinking interval (usually from ends), and optimal play requires looking ahead, interval DP is often the solution.

## Key Takeaways

1. **Game theory + DP = track score differences:** When both players play optimally to maximize their own score, you can simplify by tracking the score difference from the current player's perspective. The recurrence becomes: `current_advantage = immediate_points - opponent's_future_advantage`.

2. **Interval DP for shrinking sequences:** When the game state is defined by a contiguous subarray (or substring), and moves remove elements from the ends, use a 2D DP table where `dp[left][right]` represents the optimal result for that interval.

3. **Prefix sums for efficient range queries:** When you need frequent sum calculations over subarrays, precompute prefix sums to get O(1) range sum queries instead of O(n).

Related problems: [Stone Game](/problem/stone-game), [Stone Game II](/problem/stone-game-ii), [Stone Game III](/problem/stone-game-iii)
