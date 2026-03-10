---
title: "How to Solve Guess Number Higher or Lower II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Guess Number Higher or Lower II. Medium difficulty, 52.5% acceptance rate. Topics: Math, Dynamic Programming, Game Theory."
date: "2026-08-05"
category: "dsa-patterns"
tags: ["guess-number-higher-or-lower-ii", "math", "dynamic-programming", "game-theory", "medium"]
---

# How to Solve Guess Number Higher or Lower II

You're playing a guessing game where you need to find a number between 1 and n. Each wrong guess costs you the guessed amount, and you want to minimize your worst-case cost. The twist: you're not just guessing randomly—you need a strategy that guarantees you won't lose too much money even if you're unlucky. This is a **minimax** problem: you want to minimize your maximum possible loss. The challenge is finding the optimal guessing sequence without actually knowing the secret number.

## Visual Walkthrough

Let's trace through a small example with n = 3 to build intuition.

**The game rules:**

- Secret number is between 1 and 3
- If you guess wrong, you pay the guessed amount
- You want to minimize your worst-case total cost

**Possible strategies:**

1. **Guess 1 first:**
   - Cost = 1
   - If correct: total cost = 1 ✓
   - If wrong (too low): number is 2 or 3
     - Guess 2 next: cost = 2
       - If correct: total cost = 1 + 2 = 3
       - If wrong (too high): must be 3, total cost = 1 + 2 + 3 = 6
   - If wrong (too high): number must be... wait, can't be too high if guessing 1
   - **Worst case:** 6

2. **Guess 2 first:**
   - Cost = 2
   - If correct: total cost = 2 ✓
   - If wrong (too low): must be 3
     - Guess 3: cost = 3, total cost = 2 + 3 = 5
   - If wrong (too high): must be 1
     - Guess 1: cost = 1, total cost = 2 + 1 = 3
   - **Worst case:** 5

3. **Guess 3 first:**
   - Cost = 3
   - If correct: total cost = 3 ✓
   - If wrong (too high): number is 1 or 2
     - Guess 1 next: cost = 1
       - If correct: total cost = 3 + 1 = 4
       - If wrong (too low): must be 2, total cost = 3 + 1 + 2 = 6
   - **Worst case:** 6

The optimal first guess is 2 with worst-case cost of 5. But wait—is this truly optimal? What if we think recursively?

For range [1,3]:

- If we guess 1: cost = 1 + max(0, cost of [2,3])
- If we guess 2: cost = 2 + max(cost of [1,1], cost of [3,3])
- If we guess 3: cost = 3 + max(cost of [1,2], 0)

We need to compute costs for subranges. This recursive thinking leads us to dynamic programming.

## Brute Force Approach

A naive approach would try all possible guessing sequences. For each number i in [1,n], we could:

1. Guess i (pay i)
2. If wrong, recursively solve the left [1,i-1] or right [i+1,n] subproblem
3. Take the maximum of left and right (worst case)
4. Add i to that maximum
5. Try all i and pick the minimum

This leads to exponential time complexity because we're recomputing the same subproblems repeatedly. For n=10, the recursion tree explodes.

Here's what the brute force recursion looks like:

```python
def getMoneyAmount(n):
    def cost(start, end):
        if start >= end:
            return 0
        min_cost = float('inf')
        for guess in range(start, end + 1):
            left = cost(start, guess - 1) if guess > start else 0
            right = cost(guess + 1, end) if guess < end else 0
            # Worst case: we guess wrong and go to the more expensive side
            worst = guess + max(left, right)
            min_cost = min(min_cost, worst)
        return min_cost
    return cost(1, n)
```

This is O(n!) in the worst case—completely impractical for n > 10.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems**—the hallmarks of dynamic programming.

**Optimal substructure:** The optimal cost for range [i,j] depends on optimal costs for smaller ranges [i,k-1] and [k+1,j].

**Overlapping subproblems:** When computing cost for [1,5], we might need cost for [2,4], which we'll also need when computing cost for [1,4] and [2,5].

**DP definition:**
Let `dp[i][j]` = minimum worst-case cost to guarantee finding the number in range [i,j]

**Transition:**
For each possible guess k in [i,j]:

- If we guess k:
  - Cost = k + max(dp[i][k-1], dp[k+1][j])
  - We add k because we pay that amount
  - We take max because we consider worst case (secret number could be in more expensive side)
- We want the minimum over all k: `dp[i][j] = min(k + max(dp[i][k-1], dp[k+1][j]))` for k in [i,j]

**Base cases:**

- `dp[i][j] = 0` when i ≥ j (empty or single-element range costs nothing to "guess")

**Computation order:**
We compute from smaller ranges to larger ones (bottom-up). For length L from 2 to n, for all starting points i, compute j = i + L - 1.

## Optimal Solution

Here's the complete DP solution with detailed comments:

<div class="code-group">

```python
# Time: O(n^3) | Space: O(n^2)
def getMoneyAmount(n):
    """
    Returns the minimum amount of money you need to guarantee a win
    in the guessing game with numbers from 1 to n.
    """
    # dp[i][j] = min worst-case cost to guess a number in range [i, j]
    # We use n+2 size to handle i+1 and j-1 without index errors
    dp = [[0] * (n + 2) for _ in range(n + 2)]

    # Process ranges by increasing length
    # We start with length 2 because length 1 costs 0 (you guess it right away)
    for length in range(2, n + 1):
        # For each starting point i
        for i in range(1, n - length + 2):
            j = i + length - 1  # Ending point
            dp[i][j] = float('inf')

            # Try every possible guess k in [i, j]
            for k in range(i, j + 1):
                # Cost if we guess k:
                # k (cost of this guess) + max of left and right subproblems
                # We use max because we consider worst case
                cost = k + max(dp[i][k - 1], dp[k + 1][j])
                # Take minimum over all possible k
                dp[i][j] = min(dp[i][j], cost)

    return dp[1][n]
```

```javascript
// Time: O(n^3) | Space: O(n^2)
function getMoneyAmount(n) {
  // dp[i][j] = min worst-case cost to guess a number in range [i, j]
  // We use n+2 size to handle i+1 and j-1 without index errors
  const dp = Array.from({ length: n + 2 }, () => new Array(n + 2).fill(0));

  // Process ranges by increasing length
  // We start with length 2 because length 1 costs 0 (you guess it right away)
  for (let length = 2; length <= n; length++) {
    // For each starting point i
    for (let i = 1; i <= n - length + 1; i++) {
      const j = i + length - 1; // Ending point
      dp[i][j] = Infinity;

      // Try every possible guess k in [i, j]
      for (let k = i; k <= j; k++) {
        // Cost if we guess k:
        // k (cost of this guess) + max of left and right subproblems
        // We use max because we consider worst case
        const cost = k + Math.max(dp[i][k - 1], dp[k + 1][j]);
        // Take minimum over all possible k
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }

  return dp[1][n];
}
```

```java
// Time: O(n^3) | Space: O(n^2)
class Solution {
    public int getMoneyAmount(int n) {
        // dp[i][j] = min worst-case cost to guess a number in range [i, j]
        // We use n+2 size to handle i+1 and j-1 without index errors
        int[][] dp = new int[n + 2][n + 2];

        // Process ranges by increasing length
        // We start with length 2 because length 1 costs 0 (you guess it right away)
        for (int length = 2; length <= n; length++) {
            // For each starting point i
            for (int i = 1; i <= n - length + 1; i++) {
                int j = i + length - 1;  // Ending point
                dp[i][j] = Integer.MAX_VALUE;

                // Try every possible guess k in [i, j]
                for (int k = i; k <= j; k++) {
                    // Cost if we guess k:
                    // k (cost of this guess) + max of left and right subproblems
                    // We use max because we consider worst case
                    int cost = k + Math.max(dp[i][k - 1], dp[k + 1][j]);
                    // Take minimum over all possible k
                    dp[i][j] = Math.min(dp[i][j], cost);
                }
            }
        }

        return dp[1][n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n³)**

- We have three nested loops:
  1. Outer loop over range lengths: O(n)
  2. Middle loop over starting positions: O(n)
  3. Inner loop over possible guesses: O(n)
- Total: O(n × n × n) = O(n³)

**Space Complexity: O(n²)**

- We store a 2D DP table of size (n+2) × (n+2)
- This is O(n²) space

**Why O(n³) is acceptable:**
For n ≤ 200 (typical constraint), n³ = 8,000,000 operations, which is manageable. There's an optimized O(n²) solution using Knuth optimization, but O(n³) is sufficient for interviews.

## Common Mistakes

1. **Forgetting the "worst-case" aspect:** Candidates sometimes use `min(left, right)` instead of `max(left, right)`. Remember: you're planning for the worst possible outcome, not the best.

2. **Incorrect base cases:**
   - `dp[i][i]` should be 0, not i (if there's only one number, you guess it correctly on first try)
   - Need to handle empty ranges (i > j) as cost 0

3. **Index out of bounds:** When k = i or k = j, accessing `dp[i][k-1]` or `dp[k+1][j]` can go out of bounds. Solution: initialize DP array with extra padding or add boundary checks.

4. **Wrong computation order:** Computing ranges in random order won't work because `dp[i][j]` depends on `dp[i][k-1]` and `dp[k+1][j]`, which must be computed first. Always compute smaller ranges before larger ones.

## When You'll See This Pattern

This **minimax DP** pattern appears in several game theory and optimization problems:

1. **Burst Balloons (LeetCode 312)** - Similar DP structure where you try all possible "last" balloons to burst, with cost depending on left and right subproblems.

2. **Stone Game (LeetCode 877)** - Another game theory DP where you consider optimal play for both players, often using minimax reasoning.

3. **Predict the Winner (LeetCode 486)** - Exactly the same minimax pattern: one player tries to maximize score difference, the other minimizes it.

The key signature: "guarantee a win" or "minimize maximum loss" language, combined with optimal decisions that split problems into independent subproblems.

## Key Takeaways

1. **Minimax problems often map to DP:** When you need to "guarantee" an outcome against an adversarial opponent or worst-case scenario, think about computing the minimum of maximum costs.

2. **Range DP pattern:** When the problem involves intervals/ranges and decisions that split them, consider 2D DP where `dp[i][j]` represents the optimal solution for range [i,j].

3. **Bottom-up computation order matters:** Always compute smaller subproblems first. For range DP, this usually means increasing lengths of intervals.

Related problems: [Flip Game II](/problem/flip-game-ii), [Guess Number Higher or Lower](/problem/guess-number-higher-or-lower), [Can I Win](/problem/can-i-win)
