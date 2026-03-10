---
title: "How to Solve Knight Dialer — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Knight Dialer. Medium difficulty, 61.7% acceptance rate. Topics: Dynamic Programming."
date: "2028-10-12"
category: "dsa-patterns"
tags: ["knight-dialer", "dynamic-programming", "medium"]
---

# How to Solve Knight Dialer

The Knight Dialer problem asks: given a chess knight placed on a phone keypad (like the old 3×4 layout with numbers 0-9), how many distinct phone numbers of length `n` can the knight dial by making exactly `n-1` moves? The knight moves in its characteristic L-shape, and each hop lands on a new digit. What makes this problem interesting is that it combines graph traversal with dynamic programming—the knight's movement creates a graph of valid transitions, and we need to count all possible paths of a given length.

## Visual Walkthrough

Let's build intuition with a small example. Consider the standard phone keypad:

```
1 2 3
4 5 6
7 8 9
  0
```

The knight moves in "L" shapes: two squares in one direction, then one perpendicular. From digit 1, the knight can move to 6 or 8. From digit 0, it can only move to 4 or 6.

Now suppose `n = 2`. We want all possible 2-digit numbers the knight can dial starting from any digit. Let's trace a few:

- Start at 1: can go to 6 or 8 → numbers 16, 18
- Start at 2: can go to 7 or 9 → numbers 27, 29
- Start at 0: can go to 4 or 6 → numbers 04, 06

We'd continue for all 10 starting digits. For `n = 2`, we can manually count all possibilities. But for `n = 1000`, we need a systematic approach. Notice that the number of ways to reach a digit in `k` moves depends only on how many ways we could reach its neighbors in `k-1` moves. This overlapping subproblem structure screams dynamic programming.

## Brute Force Approach

A naive solution would use DFS/backtracking: from each starting digit, recursively explore all possible knight moves until we've made `n-1` moves, counting each complete path.

<div class="code-group">

```python
def knightDialer_brute(n):
    # Knight move transitions from each digit
    moves = {
        0: [4, 6],
        1: [6, 8],
        2: [7, 9],
        3: [4, 8],
        4: [0, 3, 9],
        5: [],  # 5 has no valid knight moves
        6: [0, 1, 7],
        7: [2, 6],
        8: [1, 3],
        9: [2, 4]
    }

    def dfs(position, steps_left):
        if steps_left == 0:
            return 1
        total = 0
        for next_pos in moves[position]:
            total += dfs(next_pos, steps_left - 1)
        return total

    total_numbers = 0
    for start in range(10):
        total_numbers += dfs(start, n - 1)

    return total_numbers % (10**9 + 7)
```

```javascript
function knightDialerBrute(n) {
  const moves = {
    0: [4, 6],
    1: [6, 8],
    2: [7, 9],
    3: [4, 8],
    4: [0, 3, 9],
    5: [],
    6: [0, 1, 7],
    7: [2, 6],
    8: [1, 3],
    9: [2, 4],
  };

  function dfs(position, stepsLeft) {
    if (stepsLeft === 0) return 1;
    let total = 0;
    for (const nextPos of moves[position]) {
      total += dfs(nextPos, stepsLeft - 1);
    }
    return total;
  }

  let totalNumbers = 0;
  for (let start = 0; start < 10; start++) {
    totalNumbers += dfs(start, n - 1);
  }

  return totalNumbers % (10 ** 9 + 7);
}
```

```java
public class KnightDialerBrute {
    private static final int MOD = 1_000_000_007;
    private static final int[][] MOVES = {
        {4, 6},        // 0
        {6, 8},        // 1
        {7, 9},        // 2
        {4, 8},        // 3
        {0, 3, 9},     // 4
        {},            // 5
        {0, 1, 7},     // 6
        {2, 6},        // 7
        {1, 3},        // 8
        {2, 4}         // 9
    };

    public int knightDialer(int n) {
        int total = 0;
        for (int start = 0; start < 10; start++) {
            total = (total + dfs(start, n - 1)) % MOD;
        }
        return total;
    }

    private int dfs(int position, int stepsLeft) {
        if (stepsLeft == 0) return 1;
        int total = 0;
        for (int nextPos : MOVES[position]) {
            total = (total + dfs(nextPos, stepsLeft - 1)) % MOD;
        }
        return total;
    }
}
```

</div>

**Why this fails:** The brute force approach has exponential time complexity O(10 × 3^(n-1)) since from most positions we have 2-3 choices at each step. For `n = 1000`, this is astronomically slow. We're also recomputing the same subproblems repeatedly—for example, the number of ways to reach digit 6 in `k` moves will be computed many times from different starting paths.

## Optimized Approach

The key insight is dynamic programming. Let `dp[step][digit]` = number of ways to reach `digit` after exactly `step` moves. Then:

```
dp[step][digit] = sum(dp[step-1][neighbor]) for all neighbors that can jump to digit
```

Base case: `dp[0][digit] = 1` for all digits (0 moves, we're already on that digit).

We build this table from `step = 1` to `n-1`. The answer is the sum of `dp[n-1][digit]` for all digits.

This reduces the complexity to O(n × 10) time and O(10) space (since we only need the previous step). We can further optimize space by only keeping two arrays: current and previous step.

## Optimal Solution

Here's the efficient DP solution with space optimization:

<div class="code-group">

```python
def knightDialer(n):
    """
    DP solution with space optimization.
    Time: O(n) - we compute n steps, each step processes 10 digits
    Space: O(1) - we only store current and previous step arrays (size 10 each)
    """
    MOD = 10**9 + 7

    # Define knight move transitions FROM each digit
    moves = {
        0: [4, 6],
        1: [6, 8],
        2: [7, 9],
        3: [4, 8],
        4: [0, 3, 9],
        5: [],  # 5 is isolated - no valid knight moves
        6: [0, 1, 7],
        7: [2, 6],
        8: [1, 3],
        9: [2, 4]
    }

    # Base case: for n=1, we have 1 way to be on each digit (just start there)
    if n == 1:
        return 10

    # Initialize: after 0 moves (step 0), we have 1 way to be on each digit
    prev_dp = [1] * 10  # dp for previous step
    curr_dp = [0] * 10  # dp for current step

    # For each additional move from step 1 to n-1
    for step in range(1, n):
        # Reset current step counts
        curr_dp = [0] * 10

        # For each digit, calculate ways to reach it in current step
        for digit in range(10):
            # Sum ways from all neighbors that can jump to this digit
            for neighbor in moves[digit]:
                curr_dp[digit] = (curr_dp[digit] + prev_dp[neighbor]) % MOD

        # Move to next step: current becomes previous
        prev_dp = curr_dp

    # Sum all ways to be on any digit after n-1 moves
    total = sum(curr_dp) % MOD
    return total
```

```javascript
function knightDialer(n) {
  /**
   * DP solution with space optimization.
   * Time: O(n) - n steps, each processing 10 digits
   * Space: O(1) - only two arrays of size 10
   */
  const MOD = 1_000_000_007;

  // Knight move transitions FROM each digit
  const moves = {
    0: [4, 6],
    1: [6, 8],
    2: [7, 9],
    3: [4, 8],
    4: [0, 3, 9],
    5: [], // 5 has no valid knight moves
    6: [0, 1, 7],
    7: [2, 6],
    8: [1, 3],
    9: [2, 4],
  };

  // Base case: n=1 means 0 moves, 1 way to be on each of 10 digits
  if (n === 1) return 10;

  // Initialize DP arrays
  let prevDP = new Array(10).fill(1); // step 0: 1 way to be on each digit
  let currDP = new Array(10).fill(0);

  // Process each move from step 1 to n-1
  for (let step = 1; step < n; step++) {
    currDP = new Array(10).fill(0);

    // For each target digit, sum ways from all source neighbors
    for (let digit = 0; digit < 10; digit++) {
      for (const neighbor of moves[digit]) {
        currDP[digit] = (currDP[digit] + prevDP[neighbor]) % MOD;
      }
    }

    // Prepare for next iteration
    prevDP = currDP;
  }

  // Sum all ways to end on any digit after n-1 moves
  let total = 0;
  for (let count of currDP) {
    total = (total + count) % MOD;
  }

  return total;
}
```

```java
class Solution {
    public int knightDialer(int n) {
        /**
         * DP solution with space optimization.
         * Time: O(n) - n steps, each processing 10 digits
         * Space: O(1) - only two arrays of size 10
         */
        final int MOD = 1_000_000_007;

        // Knight move transitions FROM each digit
        int[][] moves = {
            {4, 6},        // 0
            {6, 8},        // 1
            {7, 9},        // 2
            {4, 8},        // 3
            {0, 3, 9},     // 4
            {},            // 5
            {0, 1, 7},     // 6
            {2, 6},        // 7
            {1, 3},        // 8
            {2, 4}         // 9
        };

        // Base case: n=1 means 0 moves, 1 way to be on each digit
        if (n == 1) return 10;

        // Initialize DP arrays
        long[] prevDP = new long[10];  // step 0
        long[] currDP = new long[10];  // current step

        // After 0 moves: 1 way to be on each digit
        for (int i = 0; i < 10; i++) {
            prevDP[i] = 1;
        }

        // Process each move from step 1 to n-1
        for (int step = 1; step < n; step++) {
            // Reset current step
            currDP = new long[10];

            // For each target digit, sum ways from all source neighbors
            for (int digit = 0; digit < 10; digit++) {
                for (int neighbor : moves[digit]) {
                    currDP[digit] = (currDP[digit] + prevDP[neighbor]) % MOD;
                }
            }

            // Prepare for next iteration
            prevDP = currDP;
        }

        // Sum all ways to end on any digit after n-1 moves
        long total = 0;
        for (long count : currDP) {
            total = (total + count) % MOD;
        }

        return (int) total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate `n-1` times (for moves from step 1 to n-1)
- Each iteration processes all 10 digits, and for each digit we iterate through its neighbors (at most 3)
- So total operations ≈ 10 × 3 × (n-1) = O(n)

**Space Complexity:** O(1)

- We only maintain two arrays of size 10 (previous step and current step)
- This is constant space regardless of input size `n`

## Common Mistakes

1. **Incorrect move mapping:** The most common error is defining moves TO each digit instead of FROM each digit, or vice versa. In our DP, we need moves FROM each digit because we're asking "where can we come from to reach this digit?" Double-check the knight's valid moves on the keypad.

2. **Forgetting modulo operations:** The result grows exponentially with `n`, so we must apply modulo `10^9+7` at each addition to prevent integer overflow. Don't wait until the final sum—apply modulo during intermediate calculations.

3. **Base case handling:** For `n=1`, we have 10 possible numbers (each single digit). Some implementations incorrectly return 0 or 1. Always test small cases.

4. **Not handling digit 5 correctly:** Digit 5 has no valid knight moves. If you start on 5 with `n>1`, you can't make any numbers. Ensure your move mapping reflects this.

## When You'll See This Pattern

This problem exemplifies **count paths in a graph with fixed length**, a classic DP-on-graphs pattern:

1. **Unique Paths II (LeetCode 63)** - Count paths in a grid with obstacles, similar DP state transition
2. **Out of Boundary Paths (LeetCode 576)** - Count paths that exit a grid within N moves, same "steps remaining" DP structure
3. **Number of Dice Rolls With Target Sum (LeetCode 1155)** - Count ways to get target sum with n dice, similar overlapping subproblems

The pattern: when you need to count sequences/paths of fixed length in a state machine/graph, and the count for state `(step, position)` depends only on counts from `(step-1, neighbor positions)`, DP is your tool.

## Key Takeaways

1. **DP on graphs:** When a problem involves counting sequences of transitions in a graph with a length constraint, think DP where `dp[step][node]` counts ways to reach that node in exactly `step` moves.

2. **Space optimization:** If the recurrence only depends on the previous step, you can reduce space from O(n×states) to O(states) by keeping only current and previous arrays.

3. **Direction matters:** In transition DP, carefully define whether your recurrence looks forward ("where can I go from here?") or backward ("where could I have come from?"). For Knight Dialer, backward is cleaner.

[Practice this problem on CodeJeet](/problem/knight-dialer)
