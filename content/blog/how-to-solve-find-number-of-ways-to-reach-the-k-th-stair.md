---
title: "How to Solve Find Number of Ways to Reach the K-th Stair — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Number of Ways to Reach the K-th Stair. Hard difficulty, 37.5% acceptance rate. Topics: Math, Dynamic Programming, Bit Manipulation, Memoization, Combinatorics."
date: "2030-02-22"
category: "dsa-patterns"
tags:
  [
    "find-number-of-ways-to-reach-the-k-th-stair",
    "math",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Find Number of Ways to Reach the K-th Stair

This problem asks us to count the number of distinct sequences of operations that allow Alice to reach stair `k` starting from stair 1. The tricky part is that Alice has two types of moves: she can either jump forward by her current `jump` value (which increases by 1 after each jump), or she can move back 1 stair (which doesn't change her `jump` value). This creates a branching decision tree where we need to track both position and jump value, making it more complex than standard climbing stairs problems.

## Visual Walkthrough

Let's trace through `k = 2` to build intuition:

**Initial state**: Alice starts at stair 1 with `jump = 0`

**Operation 1**: She can only move back (since `jump = 0` means jumping forward 0 stairs)

- Move back: position = 0, jump = 0 (unchanged)

**From position 0, jump = 0**:

- Move back: position = -1 (invalid, can't go below 0)
- Jump forward: position = 0 + 0 = 0, jump = 1

**From position 0, jump = 1**:

- Move back: position = -1 (invalid)
- Jump forward: position = 0 + 1 = 1, jump = 2

**From position 1, jump = 2**:

- Move back: position = 0, jump = 2
- Jump forward: position = 1 + 2 = 3 (past k=2)

**From position 0, jump = 2**:

- Move back: position = -1 (invalid)
- Jump forward: position = 0 + 2 = 2 (reached k!)

This gives us one valid sequence: Start(1,0) → Back(0,0) → Jump(0,1) → Jump(1,2) → Back(0,2) → Jump(2,3)

Let's also try a direct path from the initial state:
**From start (1,0)**:

- Jump forward: position = 1 + 0 = 1, jump = 1
- From (1,1): Jump forward: position = 1 + 1 = 2 (reached k!)

So we have at least 2 distinct sequences for k=2.

## Brute Force Approach

The brute force approach uses DFS/backtracking to explore all possible sequences. At each state (position, jump), we have two choices:

1. Move back 1 stair (if position > 0)
2. Jump forward by `jump` stairs

We continue until we either:

- Reach exactly stair `k` (count this as a valid sequence)
- Go below stair 0 (invalid)
- Go past stair `k` (can't reach k from here since we can only increase position by jumping forward)

Here's what the brute force looks like:

<div class="code-group">

```python
def waysToReachStair(k: int) -> int:
    def dfs(position, jump):
        # Base cases
        if position < 0:
            return 0  # Invalid - below ground floor
        if position > k:
            return 0  # Can't reach k from beyond it

        # Count if we've reached k
        count = 1 if position == k else 0

        # Option 1: Move back 1 stair (if possible)
        if position > 0:
            count += dfs(position - 1, jump)

        # Option 2: Jump forward
        count += dfs(position + jump, jump + 1)

        return count

    return dfs(1, 0)
```

```javascript
function waysToReachStair(k) {
  function dfs(position, jump) {
    // Base cases
    if (position < 0) return 0; // Invalid - below ground floor
    if (position > k) return 0; // Can't reach k from beyond it

    // Count if we've reached k
    let count = position === k ? 1 : 0;

    // Option 1: Move back 1 stair (if possible)
    if (position > 0) {
      count += dfs(position - 1, jump);
    }

    // Option 2: Jump forward
    count += dfs(position + jump, jump + 1);

    return count;
  }

  return dfs(1, 0);
}
```

```java
public int waysToReachStair(int k) {
    return dfs(1, 0, k);
}

private int dfs(int position, int jump, int k) {
    // Base cases
    if (position < 0) return 0;  // Invalid - below ground floor
    if (position > k) return 0;  // Can't reach k from beyond it

    // Count if we've reached k
    int count = position == k ? 1 : 0;

    // Option 1: Move back 1 stair (if possible)
    if (position > 0) {
        count += dfs(position - 1, jump, k);
    }

    // Option 2: Jump forward
    count += dfs(position + jump, jump + 1, k);

    return count;
}
```

</div>

**Why this is too slow**: The branching factor is 2 at each step, and the depth can be up to `k` (or more due to backtracking). This gives us exponential time complexity O(2^k), which is infeasible for even moderately large k. We need to optimize using memoization.

## Optimized Approach

The key insight is that many states (position, jump) are visited multiple times through different paths. For example, we might reach position 3 with jump=2 through multiple sequences. We can memoize results using dynamic programming.

However, there's another important observation: Alice's jump value increases by 1 each time she jumps forward. This means after `j` jumps forward, her jump value will be exactly `j`. So we can think in terms of:

- How many forward jumps have been made (determines current jump value)
- Current position (which depends on the sequence of forward jumps and backward moves)

We can use DP where `dp[i][j]` represents the number of ways to reach position `i` after making `j` forward jumps. The recurrence relation:

1. To reach position `i` with `j` jumps, we could have:
   - Come from position `i+1` with `j` jumps (by moving back from i+1)
   - Come from position `i-j` with `j-1` jumps (by jumping forward j-1 stairs)

But we need to be careful: when we move back, we don't increase the jump count, so the jump count stays the same.

Actually, a cleaner approach is BFS/DP with memoization on (position, jump). Since jump can be large (up to ~√k), we need to bound our search space.

**Critical observation**:

- Maximum useful jump value is when 1 + 2 + 3 + ... + jump ≥ k (triangular number)
- This gives us jump_max ≈ √(2k)
- Also, position can't be negative or too far above k

So we can use memoization with bounds: position in [0, k+1] and jump in [0, jump_max+1]

## Optimal Solution

We'll use memoization with DFS. The state is (position, jump), and we memoize results to avoid recomputation. We also add pruning: if position > k+1, we can't reach k (since we can only increase position by jumping forward, and the smallest forward jump is at least the current jump value).

<div class="code-group">

```python
# Time: O(k * sqrt(k)) | Space: O(k * sqrt(k))
def waysToReachStair(k: int) -> int:
    from functools import lru_cache

    @lru_cache(None)
    def dfs(position: int, jump: int) -> int:
        """
        Returns number of ways to reach stair k from current position and jump value.

        Args:
            position: Current stair position (0-indexed)
            jump: Current jump value (increases by 1 after each forward jump)

        Returns:
            Number of valid sequences to reach k from this state
        """
        # If we're too far above k, we can't reach it (can only increase position)
        # The +1 is because we might overshoot slightly but could move back
        if position > k + 1:
            return 0

        # Count if we're already at k
        count = 1 if position == k else 0

        # Option 1: Move back 1 stair if possible
        # We can move back if we're above stair 0
        if position > 0:
            count += dfs(position - 1, jump)

        # Option 2: Jump forward
        # Jump value increases by 1 after jumping
        count += dfs(position + jump, jump + 1)

        return count

    # Start from stair 1 with jump value 0
    return dfs(1, 0)
```

```javascript
// Time: O(k * sqrt(k)) | Space: O(k * sqrt(k))
function waysToReachStair(k) {
  // Memoization cache: dp[position][jump] = ways
  const memo = new Map();

  function dfs(position, jump) {
    /**
     * Returns number of ways to reach stair k from current position and jump value.
     *
     * @param {number} position - Current stair position (0-indexed)
     * @param {number} jump - Current jump value (increases by 1 after each forward jump)
     * @returns {number} Number of valid sequences to reach k from this state
     */

    // Create a unique key for memoization
    const key = `${position},${jump}`;

    // Check if we've already computed this state
    if (memo.has(key)) {
      return memo.get(key);
    }

    // If we're too far above k, we can't reach it (can only increase position)
    // The +1 is because we might overshoot slightly but could move back
    if (position > k + 1) {
      memo.set(key, 0);
      return 0;
    }

    // Count if we're already at k
    let count = position === k ? 1 : 0;

    // Option 1: Move back 1 stair if possible
    // We can move back if we're above stair 0
    if (position > 0) {
      count += dfs(position - 1, jump);
    }

    // Option 2: Jump forward
    // Jump value increases by 1 after jumping
    count += dfs(position + jump, jump + 1);

    // Memoize and return the result
    memo.set(key, count);
    return count;
  }

  // Start from stair 1 with jump value 0
  return dfs(1, 0);
}
```

```java
// Time: O(k * sqrt(k)) | Space: O(k * sqrt(k))
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int waysToReachStair(int k) {
        // Memoization cache
        Map<String, Integer> memo = new HashMap<>();
        return dfs(1, 0, k, memo);
    }

    private int dfs(int position, int jump, int k, Map<String, Integer> memo) {
        /**
         * Returns number of ways to reach stair k from current position and jump value.
         *
         * @param position Current stair position (0-indexed)
         * @param jump Current jump value (increases by 1 after each forward jump)
         * @param k Target stair
         * @param memo Memoization cache
         * @return Number of valid sequences to reach k from this state
         */

        // Create a unique key for memoization
        String key = position + "," + jump;

        // Check if we've already computed this state
        if (memo.containsKey(key)) {
            return memo.get(key);
        }

        // If we're too far above k, we can't reach it (can only increase position)
        // The +1 is because we might overshoot slightly but could move back
        if (position > k + 1) {
            memo.put(key, 0);
            return 0;
        }

        // Count if we're already at k
        int count = position == k ? 1 : 0;

        // Option 1: Move back 1 stair if possible
        // We can move back if we're above stair 0
        if (position > 0) {
            count += dfs(position - 1, jump, k, memo);
        }

        // Option 2: Jump forward
        // Jump value increases by 1 after jumping
        count += dfs(position + jump, jump + 1, k, memo);

        // Memoize and return the result
        memo.put(key, count);
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(k × √k)

- The position ranges from 0 to k+1: O(k) possibilities
- The jump value ranges from 0 to approximately √(2k): O(√k) possibilities  
  (This is because after j jumps, the maximum distance covered is j(j+1)/2, which needs to be at least k)
- Each state computes its result in O(1) time using memoized results
- Total states: O(k × √k)

**Space Complexity**: O(k × √k)

- We need to store results for all (position, jump) pairs in the memoization cache
- The recursion depth is O(k) in the worst case, but this is dominated by the memoization storage

## Common Mistakes

1. **Forgetting to handle the "already at k" case**: When position == k, we should count this as a valid sequence (1 way), but we can also continue exploring to find other sequences that pass through k and return to it. Many candidates only count terminal states.

2. **Incorrect pruning condition**: Using `position > k` instead of `position > k + 1`. If we're at position k+1, we can still move back to k, so we shouldn't prune this state. The correct condition is `position > k + 1`.

3. **Not memoizing by both position AND jump**: The state depends on both variables. Memoizing by position alone is incorrect because different jump values lead to different future possibilities.

4. **Infinite recursion without proper bounds**: Without the `position > k + 1` check, the recursion could continue indefinitely as jump values increase and positions could potentially grow without bound.

## When You'll See This Pattern

This problem combines several important patterns:

1. **DFS with memoization (Top-down DP)**: Similar to problems like "Climbing Stairs" and "Coin Change", but with a 2D state space.

2. **State-space search with constraints**: Like "Word Ladder" or "Knight Probability in Chessboard", where you explore possible moves from each state.

3. **Combinatorial counting with backtracking**: Similar to "Unique Paths" problems, but with more complex move rules.

Specific related problems:

- **Climbing Stairs**: Simpler version with only forward moves
- **Minimum Path Sum**: Another 2D DP problem with movement constraints
- **Out of Boundary Paths**: Counting paths with bounds and different move types

## Key Takeaways

1. **When you have multiple decisions at each step and need to count all valid sequences, think DFS/backtracking with memoization**. The key is identifying what defines a unique state.

2. **For problems with increasing step sizes, the maximum relevant value is often O(√n)**. This comes from the triangular number formula 1+2+...+n = n(n+1)/2.

3. **Always consider what makes states unique for memoization**. Here, both position AND jump value are needed because they both affect future possibilities.

Related problems: [Climbing Stairs](/problem/climbing-stairs), [Min Cost Climbing Stairs](/problem/min-cost-climbing-stairs)
