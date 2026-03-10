---
title: "How to Solve Predict the Winner — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Predict the Winner. Medium difficulty, 56.1% acceptance rate. Topics: Array, Math, Dynamic Programming, Recursion, Game Theory."
date: "2028-02-06"
category: "dsa-patterns"
tags: ["predict-the-winner", "array", "math", "dynamic-programming", "medium"]
---

# How to Solve Predict the Winner

This problem presents a two-player game where players alternately pick numbers from either end of an array, trying to maximize their total score. The twist: you need to determine if the first player can guarantee a win or tie assuming both play optimally. What makes this tricky is that you're not just simulating the game—you need to prove whether a winning strategy exists against a perfect opponent. This requires thinking about optimal play from both perspectives, which naturally leads to recursive exploration or dynamic programming.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 5, 2]`

**Game progression:**

1. Player 1's turn: Can choose from left (1) or right (2)
   - If Player 1 picks left (1): Remaining array = [5, 2]
     - Player 2's turn: Can choose 5 or 2
       - If Player 2 picks 5: Remaining = [2], Player 1 gets 2
         Scores: P1 = 1 + 2 = 3, P2 = 5 → P2 wins
       - If Player 2 picks 2: Remaining = [5], Player 1 gets 5
         Scores: P1 = 1 + 5 = 6, P2 = 2 → P1 wins
     - Player 2 will choose optimally (5), so P1 gets 2
   - If Player 1 picks right (2): Remaining array = [1, 5]
     - Player 2's turn: Can choose 1 or 5
       - If Player 2 picks 1: Remaining = [5], Player 1 gets 5
         Scores: P1 = 2 + 5 = 7, P2 = 1 → P1 wins
       - If Player 2 picks 5: Remaining = [1], Player 1 gets 1
         Scores: P1 = 2 + 1 = 3, P2 = 5 → P2 wins
     - Player 2 will choose optimally (5), so P1 gets 1

Comparing both options: Picking 1 gives P1 total 3, picking 2 gives P1 total 3. With optimal play from both sides, the game ends in a tie (3-3). So Player 1 cannot guarantee a win.

This walkthrough reveals the core challenge: at each decision point, the current player must consider what the opponent will do next, who will also play optimally. This recursive "what will they do if I do this?" thinking is key.

## Brute Force Approach

The most straightforward approach is to simulate all possible game sequences using recursion. At each turn, the current player can:

1. Take the leftmost number, then recursively play the remaining subarray
2. Take the rightmost number, then recursively play the remaining subarray

Since both players play optimally, the current player will choose the move that maximizes their final score, while the opponent will do the same on their turn.

**Why this is insufficient:**
For an array of length `n`, there are approximately `2^n` possible game sequences (each turn has 2 choices, and there are `n` turns). This exponential time complexity makes the brute force approach impractical for arrays larger than about 20-25 elements. We need to avoid recomputing the same subproblems repeatedly.

## Optimized Approach

The key insight is that many subproblems overlap. When we compute the optimal score difference for subarray `nums[i:j]`, we might need this result when computing `nums[i-1:j]` or `nums[i:j+1]`. This is a classic dynamic programming opportunity.

We can define `dp[i][j]` as the maximum score difference the current player can achieve when playing on subarray `nums[i:j]` (inclusive). A positive difference means the current player is ahead.

**Recurrence relation:**

- If it's the current player's turn on `nums[i:j]`, they can:
  1. Take `nums[i]`: Then the opponent plays on `nums[i+1:j]`. The net difference for current player = `nums[i] - dp[i+1][j]`
  2. Take `nums[j]`: Then the opponent plays on `nums[i:j-1]`. The net difference = `nums[j] - dp[i][j-1]`
- The current player will choose the better option: `dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1])`

**Base case:** When `i == j`, there's only one number, so `dp[i][i] = nums[i]` (the current player takes it).

We fill the DP table diagonally, starting from single-element subarrays and building up to the full array. The answer is whether `dp[0][n-1] >= 0` (Player 1 can win or tie).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
def predictTheWinner(nums):
    """
    Determines if Player 1 can guarantee a win or tie.

    Approach: Dynamic programming where dp[i][j] represents the maximum
    score difference (current player - opponent) for subarray nums[i:j].
    """
    n = len(nums)
    if n == 0:
        return True  # No numbers to pick, it's a tie

    # Create DP table: dp[i][j] = max score diff for subarray nums[i:j]
    dp = [[0] * n for _ in range(n)]

    # Base case: single element subarrays
    # When i == j, only one number, current player takes it
    for i in range(n):
        dp[i][i] = nums[i]

    # Fill the DP table diagonally
    # We need to process subarrays of increasing length
    for length in range(2, n + 1):  # length of subarray
        for i in range(n - length + 1):  # starting index
            j = i + length - 1  # ending index

            # Current player can take nums[i] or nums[j]
            # If they take nums[i], opponent plays on nums[i+1:j]
            # Net difference = nums[i] - dp[i+1][j]
            take_left = nums[i] - dp[i + 1][j]

            # If they take nums[j], opponent plays on nums[i:j-1]
            # Net difference = nums[j] - dp[i][j-1]
            take_right = nums[j] - dp[i][j - 1]

            # Current player chooses the better option
            dp[i][j] = max(take_left, take_right)

    # dp[0][n-1] is Player 1's score difference for the entire array
    # If >= 0, Player 1 can win or tie
    return dp[0][n - 1] >= 0
```

```javascript
// Time: O(n^2) | Space: O(n^2)
function predictTheWinner(nums) {
  /**
   * Determines if Player 1 can guarantee a win or tie.
   *
   * Approach: Dynamic programming where dp[i][j] represents the maximum
   * score difference (current player - opponent) for subarray nums[i:j].
   */
  const n = nums.length;
  if (n === 0) return true; // No numbers to pick, it's a tie

  // Create DP table: dp[i][j] = max score diff for subarray nums[i:j]
  const dp = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Base case: single element subarrays
  // When i == j, only one number, current player takes it
  for (let i = 0; i < n; i++) {
    dp[i][i] = nums[i];
  }

  // Fill the DP table diagonally
  // We need to process subarrays of increasing length
  for (let length = 2; length <= n; length++) {
    // length of subarray
    for (let i = 0; i <= n - length; i++) {
      // starting index
      const j = i + length - 1; // ending index

      // Current player can take nums[i] or nums[j]
      // If they take nums[i], opponent plays on nums[i+1:j]
      // Net difference = nums[i] - dp[i+1][j]
      const takeLeft = nums[i] - dp[i + 1][j];

      // If they take nums[j], opponent plays on nums[i:j-1]
      // Net difference = nums[j] - dp[i][j-1]
      const takeRight = nums[j] - dp[i][j - 1];

      // Current player chooses the better option
      dp[i][j] = Math.max(takeLeft, takeRight);
    }
  }

  // dp[0][n-1] is Player 1's score difference for the entire array
  // If >= 0, Player 1 can win or tie
  return dp[0][n - 1] >= 0;
}
```

```java
// Time: O(n^2) | Space: O(n^2)
class Solution {
    public boolean predictTheWinner(int[] nums) {
        /**
         * Determines if Player 1 can guarantee a win or tie.
         *
         * Approach: Dynamic programming where dp[i][j] represents the maximum
         * score difference (current player - opponent) for subarray nums[i:j].
         */
        int n = nums.length;
        if (n == 0) return true; // No numbers to pick, it's a tie

        // Create DP table: dp[i][j] = max score diff for subarray nums[i:j]
        int[][] dp = new int[n][n];

        // Base case: single element subarrays
        // When i == j, only one number, current player takes it
        for (int i = 0; i < n; i++) {
            dp[i][i] = nums[i];
        }

        // Fill the DP table diagonally
        // We need to process subarrays of increasing length
        for (int length = 2; length <= n; length++) { // length of subarray
            for (int i = 0; i <= n - length; i++) { // starting index
                int j = i + length - 1; // ending index

                // Current player can take nums[i] or nums[j]
                // If they take nums[i], opponent plays on nums[i+1:j]
                // Net difference = nums[i] - dp[i+1][j]
                int takeLeft = nums[i] - dp[i + 1][j];

                // If they take nums[j], opponent plays on nums[i:j-1]
                // Net difference = nums[j] - dp[i][j-1]
                int takeRight = nums[j] - dp[i][j - 1];

                // Current player chooses the better option
                dp[i][j] = Math.max(takeLeft, takeRight);
            }
        }

        // dp[0][n-1] is Player 1's score difference for the entire array
        // If >= 0, Player 1 can win or tie
        return dp[0][n - 1] >= 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- We have a nested loop structure: the outer loop runs `n` times (for each possible subarray length), and the inner loop runs up to `n` times (for each starting position).
- More precisely: Σ\_{length=1 to n} (n - length + 1) = n(n+1)/2 = O(n²) operations.

**Space Complexity:** O(n²)

- We store a 2D DP table of size n × n.
- We could optimize to O(n) space by noticing that we only need the previous diagonal, but the O(n²) solution is clearer and acceptable for interviews.

## Common Mistakes

1. **Forgetting that the opponent also plays optimally**: Some candidates write recursive solutions where they assume the opponent will make suboptimal moves. Remember: in game theory problems, you must assume both players play perfectly.

2. **Incorrect DP state definition**: Defining `dp[i][j]` as the maximum score for Player 1 (rather than score difference) makes the recurrence much more complex because you need to track whose turn it is separately.

3. **Wrong filling order**: The DP table must be filled diagonally (by increasing subarray length), not row-by-row or column-by-column. Filling incorrectly means you might use uncomputed values.

4. **Off-by-one errors in indices**: When `j = i + length - 1`, ensure `j < n`. Also, when accessing `dp[i+1][j]` and `dp[i][j-1]`, verify these indices are valid (they are when `length ≥ 2`).

## When You'll See This Pattern

This "optimal game play" pattern appears in several LeetCode problems:

1. **Stone Game (LeetCode 877)**: Almost identical to this problem but with the constraint that the array length is even and total sum is odd, guaranteeing Player 1 can win.

2. **Can I Win (LeetCode 464)**: Another two-player game where players choose numbers from a pool. While the state representation differs (bitmask instead of array indices), the core recursive/minimax approach is similar.

3. **Optimal Strategy for a Game (GeeksforGeeks)**: Exactly the same problem formulation.

The pattern to recognize: when you have a two-player turn-based game with perfect information (both players know everything), and you need to determine if the first player can force a win, think about recursive exploration with memoization or DP.

## Key Takeaways

1. **Game theory problems often use minimax thinking**: The current player maximizes their outcome while the opponent minimizes it (or maximizes their own). This leads to the "score difference" formulation.

2. **DP with subarray states is natural for array games**: When players can only take from ends, the game state is fully described by the current subarray boundaries `[i, j]`.

3. **Think in terms of score difference, not absolute scores**: Tracking the difference (current player - opponent) simplifies the recurrence because you don't need to track whose turn it is explicitly—it's baked into the sign of the difference.

Related problems: [Can I Win](/problem/can-i-win), [Find the Winning Player in Coin Game](/problem/find-the-winning-player-in-coin-game), [Find the Number of Winning Players](/problem/find-the-number-of-winning-players)
