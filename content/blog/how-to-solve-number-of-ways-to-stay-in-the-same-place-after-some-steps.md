---
title: "How to Solve Number of Ways to Stay in the Same Place After Some Steps — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Ways to Stay in the Same Place After Some Steps. Hard difficulty, 50.0% acceptance rate. Topics: Dynamic Programming."
date: "2027-06-05"
category: "dsa-patterns"
tags: ["number-of-ways-to-stay-in-the-same-place-after-some-steps", "dynamic-programming", "hard"]
---

# How to Solve Number of Ways to Stay in the Same Place After Some Steps

You're given an array of length `arrLen` and start at index 0. You have exactly `steps` moves where you can stay in place, move left, or move right, but you can never go outside the array bounds. Return the number of ways to end up back at index 0 after all moves, modulo 10^9+7. What makes this tricky is the massive state space—with up to 500 steps and 10^6 array length, a naive approach would explode exponentially. This is a classic dynamic programming problem where we need to recognize that many positions are unreachable and prune our state space intelligently.

## Visual Walkthrough

Let's trace through a small example: `steps = 3`, `arrLen = 2`.

We start at position 0 with 3 steps remaining:

**Step 1 (3 steps left):**

- From position 0, we can:
  - Stay: goes to position 0 (2 steps left)
  - Move right: goes to position 1 (2 steps left)
  - Can't move left (would go to -1)

**Step 2 (2 steps left):**
From position 0 with 2 steps left:

- Stay: position 0 (1 step left)
- Move right: position 1 (1 step left)

From position 1 with 2 steps left:

- Stay: position 1 (1 step left)
- Move left: position 0 (1 step left)
- Can't move right (would go to position 2, out of bounds)

**Step 3 (1 step left):**
We need to count ways to reach position 0 with 0 steps left:

From position 0 with 1 step left:

- Stay: position 0 (0 steps left) ✓ 1 way
- Move right: position 1 (0 steps left) ✗ not position 0

From position 1 with 1 step left:

- Stay: position 1 (0 steps left) ✗ not position 0
- Move left: position 0 (0 steps left) ✓ 1 way

Total ways: 1 (from stay at 0) + 1 (from move left from 1) = 2 ways.

So for `steps = 3`, `arrLen = 2`, the answer is 2.

## Brute Force Approach

The most straightforward approach is to explore all possible sequences of moves using recursion. At each step, we try all valid moves (stay, left, right) and recursively count the ways to reach position 0 with the remaining steps.

The brute force would look like this:

1. Define a recursive function `dfs(position, remainingSteps)`
2. Base case: if `remainingSteps == 0`, return 1 if `position == 0`, else 0
3. For each valid move (stay, left if `position > 0`, right if `position < arrLen-1`), make the move and sum the results
4. Return the total modulo 10^9+7

<div class="code-group">

```python
# Brute Force - Time: O(3^steps) | Space: O(steps) for recursion stack
def numWaysBruteForce(steps: int, arrLen: int) -> int:
    MOD = 10**9 + 7

    def dfs(pos, remaining):
        if remaining == 0:
            return 1 if pos == 0 else 0

        total = dfs(pos, remaining - 1)  # Stay

        if pos > 0:  # Move left
            total = (total + dfs(pos - 1, remaining - 1)) % MOD

        if pos < arrLen - 1:  # Move right
            total = (total + dfs(pos + 1, remaining - 1)) % MOD

        return total

    return dfs(0, steps)
```

```javascript
// Brute Force - Time: O(3^steps) | Space: O(steps) for recursion stack
function numWaysBruteForce(steps, arrLen) {
  const MOD = 10 ** 9 + 7;

  function dfs(pos, remaining) {
    if (remaining === 0) {
      return pos === 0 ? 1 : 0;
    }

    let total = dfs(pos, remaining - 1); // Stay

    if (pos > 0) {
      // Move left
      total = (total + dfs(pos - 1, remaining - 1)) % MOD;
    }

    if (pos < arrLen - 1) {
      // Move right
      total = (total + dfs(pos + 1, remaining - 1)) % MOD;
    }

    return total;
  }

  return dfs(0, steps);
}
```

```java
// Brute Force - Time: O(3^steps) | Space: O(steps) for recursion stack
public int numWaysBruteForce(int steps, int arrLen) {
    final int MOD = 1000000007;
    return dfs(0, steps, arrLen, MOD);
}

private int dfs(int pos, int remaining, int arrLen, int MOD) {
    if (remaining == 0) {
        return pos == 0 ? 1 : 0;
    }

    int total = dfs(pos, remaining - 1, arrLen, MOD);  // Stay

    if (pos > 0) {  // Move left
        total = (total + dfs(pos - 1, remaining - 1, arrLen, MOD)) % MOD;
    }

    if (pos < arrLen - 1) {  // Move right
        total = (total + dfs(pos + 1, remaining - 1, arrLen, MOD)) % MOD;
    }

    return total;
}
```

</div>

**Why this fails:** The time complexity is O(3^steps), which is astronomical for `steps` up to 500. Even with memoization, we'd have `steps × arrLen` states, and `arrLen` can be up to 10^6, giving us 500 × 10^6 = 5×10^8 states—still too large.

## Optimized Approach

The key insight is that we don't need to consider all `arrLen` positions. With only `steps` moves, we can never reach positions beyond `steps` from the start. Why? Because each move changes position by at most 1, so in `steps` moves, the farthest we can get from index 0 is `steps`. This dramatically reduces our state space from `steps × min(arrLen, steps + 1)`.

We use dynamic programming with two optimizations:

1. **State pruning**: Only consider positions up to `min(arrLen, steps + 1)`
2. **Space optimization**: We only need the previous step's DP array, not all steps

The recurrence relation is:

```
dp[step][pos] = dp[step-1][pos] +            // Stay in place
                dp[step-1][pos-1] +          // Came from left
                dp[step-1][pos+1]            // Came from right
```

Where `dp[step][pos]` = number of ways to reach position `pos` after exactly `step` moves.

We initialize `dp[0][0] = 1` (0 moves, at position 0), and all other `dp[0][pos] = 0`.

## Optimal Solution

Here's the optimized dynamic programming solution with space optimization:

<div class="code-group">

```python
# Optimal Solution - Time: O(steps × min(steps, arrLen)) | Space: O(min(steps, arrLen))
def numWays(steps: int, arrLen: int) -> int:
    MOD = 10**9 + 7

    # We can't go further than steps from position 0
    maxPos = min(steps, arrLen - 1)

    # dp[position] = ways to reach this position with current number of steps
    dp = [0] * (maxPos + 1)
    dp[0] = 1  # Start at position 0 with 0 steps taken

    for step in range(1, steps + 1):
        new_dp = [0] * (maxPos + 1)

        for pos in range(min(step, maxPos) + 1):
            # Stay in place
            ways = dp[pos]

            # Came from left (if position > 0)
            if pos > 0:
                ways = (ways + dp[pos - 1]) % MOD

            # Came from right (if position < maxPos)
            if pos < maxPos:
                ways = (ways + dp[pos + 1]) % MOD

            new_dp[pos] = ways

        dp = new_dp

    return dp[0] % MOD
```

```javascript
// Optimal Solution - Time: O(steps × min(steps, arrLen)) | Space: O(min(steps, arrLen))
function numWays(steps, arrLen) {
  const MOD = 10 ** 9 + 7;

  // We can't go further than steps from position 0
  const maxPos = Math.min(steps, arrLen - 1);

  // dp[position] = ways to reach this position with current number of steps
  let dp = new Array(maxPos + 1).fill(0);
  dp[0] = 1; // Start at position 0 with 0 steps taken

  for (let step = 1; step <= steps; step++) {
    const newDp = new Array(maxPos + 1).fill(0);

    // We can only reach positions up to current step number
    const maxReachable = Math.min(step, maxPos);

    for (let pos = 0; pos <= maxReachable; pos++) {
      // Stay in place
      let ways = dp[pos];

      // Came from left (if position > 0)
      if (pos > 0) {
        ways = (ways + dp[pos - 1]) % MOD;
      }

      // Came from right (if position < maxPos)
      if (pos < maxPos) {
        ways = (ways + dp[pos + 1]) % MOD;
      }

      newDp[pos] = ways;
    }

    dp = newDp;
  }

  return dp[0] % MOD;
}
```

```java
// Optimal Solution - Time: O(steps × min(steps, arrLen)) | Space: O(min(steps, arrLen))
public int numWays(int steps, int arrLen) {
    final int MOD = 1000000007;

    // We can't go further than steps from position 0
    int maxPos = Math.min(steps, arrLen - 1);

    // dp[position] = ways to reach this position with current number of steps
    int[] dp = new int[maxPos + 1];
    dp[0] = 1;  // Start at position 0 with 0 steps taken

    for (int step = 1; step <= steps; step++) {
        int[] newDp = new int[maxPos + 1];

        // We can only reach positions up to current step number
        int maxReachable = Math.min(step, maxPos);

        for (int pos = 0; pos <= maxReachable; pos++) {
            // Stay in place
            long ways = dp[pos];

            // Came from left (if position > 0)
            if (pos > 0) {
                ways = (ways + dp[pos - 1]) % MOD;
            }

            // Came from right (if position < maxPos)
            if (pos < maxPos) {
                ways = (ways + dp[pos + 1]) % MOD;
            }

            newDp[pos] = (int) ways;
        }

        dp = newDp;
    }

    return dp[0] % MOD;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(steps × min(steps, arrLen))

- We iterate through `steps` (outer loop)
- For each step, we iterate through at most `min(steps, arrLen)` positions
- The key optimization is recognizing we only need to consider positions up to `min(steps, arrLen-1)`

**Space Complexity:** O(min(steps, arrLen))

- We maintain two DP arrays of size `min(steps, arrLen) + 1`
- We could optimize further to use a single array with careful updating, but the two-array approach is clearer and has the same asymptotic complexity

## Common Mistakes

1. **Not pruning the position space:** Trying to create a DP array of size `arrLen` when `arrLen` can be 10^6. This causes memory limit exceeded errors. Always remember: with `steps` moves, you can't reach beyond position `steps`.

2. **Forgetting the modulo operation:** The number of ways grows exponentially, so intermediate results can overflow even 64-bit integers. Apply modulo at each addition, not just at the end.

3. **Incorrect boundary conditions:** When `arrLen = 1`, you can only stay in place. Make sure your code handles this edge case correctly (maxPos = min(steps, 0) = 0).

4. **Off-by-one errors in position limits:** Remember array indices are 0-based, so the last valid position is `arrLen - 1`, not `arrLen`. Also, when calculating `maxPos`, use `min(steps, arrLen - 1)` not `min(steps, arrLen)`.

## When You'll See This Pattern

This problem uses **bounded DP on a 1D grid with limited reachability**, a pattern seen in:

1. **Number of Ways to Reach a Position After Exactly k Steps (LeetCode 2400)** - Almost identical problem but without the array boundary constraint. The same DP approach works.

2. **Knight Probability in Chessboard (LeetCode 688)** - Similar DP where a knight moves on a chessboard, and we need probability after k moves. The state is 2D but uses the same "reachable positions" pruning.

3. **Out of Boundary Paths (LeetCode 576)** - Counting ways to move a ball out of grid boundaries in at most N moves. Uses similar DP with step counting.

The core pattern: when you have a moving object with limited moves, and you need to count ways to reach certain states, think DP with the number of moves as one dimension and position as another.

## Key Takeaways

1. **Prune unreachable states:** In move-counting problems, you often can't reach all positions. With `k` moves and unit steps, you can only reach positions within `k` of the start. This optimization is crucial for large bounds.

2. **Space-optimized DP:** When the recurrence only depends on the previous step, use rolling arrays to reduce space from O(k×n) to O(n).

3. **Modulo arithmetic with large counts:** When counting combinatorial ways that grow exponentially, apply modulo at each operation to prevent overflow.

Related problems: [Number of Ways to Reach a Position After Exactly k Steps](/problem/number-of-ways-to-reach-a-position-after-exactly-k-steps)
