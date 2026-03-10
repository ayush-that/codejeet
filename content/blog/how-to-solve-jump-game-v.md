---
title: "How to Solve Jump Game V — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Jump Game V. Hard difficulty, 64.8% acceptance rate. Topics: Array, Dynamic Programming, Sorting."
date: "2028-10-30"
category: "dsa-patterns"
tags: ["jump-game-v", "array", "dynamic-programming", "sorting", "hard"]
---

# How to Solve Jump Game V

This problem asks us to find the maximum number of jumps we can make starting from any index in an array, where we can jump left or right up to `d` positions, but only to indices with strictly lower values. The challenge is that jumps can chain together (jump from i to j, then from j to k, etc.), and we need to find the longest possible chain starting from each position.

What makes this problem tricky is the directional constraints combined with the height restriction. Unlike simpler jump problems where you can jump anywhere within a range, here you can only jump to lower heights, which creates a dependency graph where the number of jumps from position i depends on the number of jumps from all reachable positions j.

## Visual Walkthrough

Let's trace through a small example: `arr = [6,4,14,6,8,13,9,7,10,6,12]` with `d = 2`

We want to find the maximum jumps starting from each position. Let's focus on index 2 (value 14):

From index 2, we can jump:

- Right: to index 3 (value 6) or 4 (value 8) since d=2
- Left: to index 1 (value 4) or 0 (value 6)

But we can only jump to positions with lower values than 14. All these positions have lower values, so we can jump to any of them.

Now, to find the maximum jumps from index 2, we need to consider:

1. Jump to index 3 (value 6), then from there we can make more jumps
2. Jump to index 4 (value 8), then from there we can make more jumps
3. Jump to index 1 (value 4), then from there we can make more jumps
4. Jump to index 0 (value 6), then from there we can make more jumps

The maximum jumps from index 2 = 1 + max(jumps from reachable positions)

This creates a recursive relationship: `dp[i] = 1 + max(dp[j])` for all valid j reachable from i.

For our example, the optimal solution would be:

- Start at index 2 (14) → jump to index 6 (9) → jump to index 7 (7) → jump to index 8 (10) → jump to index 10 (12)
  That's 5 jumps total.

## Brute Force Approach

A naive approach would be to try all possible jump sequences from each starting position. For each position i, we would:

1. Try jumping to all valid positions j within distance d
2. Recursively explore from each j
3. Track the maximum depth reached

The problem with this approach is exponential time complexity. In the worst case, from each position we could have up to 2d possible jumps (d left and d right), leading to O((2d)^n) time complexity, which is far too slow for n up to 1000.

Even with memoization (caching results for each position), the brute force would still be inefficient because we'd need to check all reachable positions for each i, and in the worst case (descending array), each position could reach many others.

## Optimized Approach

The key insight is that we should process positions in order of decreasing height. Why? Because if we process from highest to lowest, when we reach a position i, all positions j that are lower than i (and thus reachable from i) will already have their dp values computed.

Here's the step-by-step reasoning:

1. **Sort positions by height**: Create a list of indices sorted by their values in descending order. This ensures we process higher positions before lower ones.

2. **Dynamic Programming state**: `dp[i]` represents the maximum number of jumps starting from position i.

3. **Transition**: For each position i (processed in descending height order), look left and right up to distance d:
   - For each valid position j (within bounds and within distance d)
   - If `arr[i] > arr[j]`, then we can jump from i to j
   - Update `dp[i] = max(dp[i], 1 + dp[j])`
   - But stop looking further if we encounter a position with height >= arr[i] (can't jump over taller buildings)

4. **Why processing order matters**: When we process position i, all positions j with lower height have already been processed, so their dp values are available. This eliminates the need for recursion and ensures each position is processed only once.

5. **The "can't jump over taller buildings" rule**: This is subtle but important. From position i, you can only jump to positions j where all buildings between i and j are shorter than the building at i. This is because you're jumping from the top of building i - you can't jump through taller buildings.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + n*d) | Space: O(n)
def maxJumps(arr, d):
    """
    Find the maximum number of jumps starting from any index.

    Args:
        arr: List of integers representing building heights
        d: Maximum jump distance

    Returns:
        Maximum number of jumps possible from any starting position
    """
    n = len(arr)

    # Step 1: Create list of indices sorted by height in descending order
    # We store (height, index) pairs and sort by height descending
    indices = sorted(range(n), key=lambda i: -arr[i])

    # Step 2: Initialize DP array where dp[i] = max jumps starting from i
    # Each position can at least jump to itself (count as 1 jump)
    dp = [1] * n

    # Step 3: Process positions from highest to lowest
    for i in indices:
        # Check jumps to the right
        for j in range(i + 1, min(i + d + 1, n)):
            # If we encounter a building taller or equal, stop
            # Can't jump over taller buildings
            if arr[j] >= arr[i]:
                break
            # Update dp[i] if jumping to j gives more jumps
            dp[i] = max(dp[i], dp[j] + 1)

        # Check jumps to the left
        for j in range(i - 1, max(i - d - 1, -1), -1):
            # If we encounter a building taller or equal, stop
            if arr[j] >= arr[i]:
                break
            # Update dp[i] if jumping to j gives more jumps
            dp[i] = max(dp[i], dp[j] + 1)

    # Step 4: Return the maximum value in dp array
    return max(dp)
```

```javascript
// Time: O(n log n + n*d) | Space: O(n)
function maxJumps(arr, d) {
  /**
   * Find the maximum number of jumps starting from any index.
   *
   * @param {number[]} arr - Array of integers representing building heights
   * @param {number} d - Maximum jump distance
   * @return {number} Maximum number of jumps possible from any starting position
   */
  const n = arr.length;

  // Step 1: Create array of indices and sort by height in descending order
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => arr[b] - arr[a]); // Sort descending by height

  // Step 2: Initialize DP array where dp[i] = max jumps starting from i
  // Each position can at least jump to itself (count as 1 jump)
  const dp = new Array(n).fill(1);

  // Step 3: Process positions from highest to lowest
  for (const i of indices) {
    // Check jumps to the right
    for (let j = i + 1; j <= Math.min(i + d, n - 1); j++) {
      // If we encounter a building taller or equal, stop
      // Can't jump over taller buildings
      if (arr[j] >= arr[i]) break;
      // Update dp[i] if jumping to j gives more jumps
      dp[i] = Math.max(dp[i], dp[j] + 1);
    }

    // Check jumps to the left
    for (let j = i - 1; j >= Math.max(i - d, 0); j--) {
      // If we encounter a building taller or equal, stop
      if (arr[j] >= arr[i]) break;
      // Update dp[i] if jumping to j gives more jumps
      dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }

  // Step 4: Return the maximum value in dp array
  return Math.max(...dp);
}
```

```java
// Time: O(n log n + n*d) | Space: O(n)
class Solution {
    public int maxJumps(int[] arr, int d) {
        /**
         * Find the maximum number of jumps starting from any index.
         *
         * @param arr Array of integers representing building heights
         * @param d Maximum jump distance
         * @return Maximum number of jumps possible from any starting position
         */
        int n = arr.length;

        // Step 1: Create list of indices and sort by height in descending order
        Integer[] indices = new Integer[n];
        for (int i = 0; i < n; i++) indices[i] = i;
        Arrays.sort(indices, (a, b) -> arr[b] - arr[a]); // Sort descending by height

        // Step 2: Initialize DP array where dp[i] = max jumps starting from i
        // Each position can at least jump to itself (count as 1 jump)
        int[] dp = new int[n];
        Arrays.fill(dp, 1);

        // Step 3: Process positions from highest to lowest
        for (int idx : indices) {
            // Check jumps to the right
            for (int j = idx + 1; j <= Math.min(idx + d, n - 1); j++) {
                // If we encounter a building taller or equal, stop
                // Can't jump over taller buildings
                if (arr[j] >= arr[idx]) break;
                // Update dp[idx] if jumping to j gives more jumps
                dp[idx] = Math.max(dp[idx], dp[j] + 1);
            }

            // Check jumps to the left
            for (int j = idx - 1; j >= Math.max(idx - d, 0); j--) {
                // If we encounter a building taller or equal, stop
                if (arr[j] >= arr[idx]) break;
                // Update dp[idx] if jumping to j gives more jumps
                dp[idx] = Math.max(dp[idx], dp[j] + 1);
            }
        }

        // Step 4: Return the maximum value in dp array
        int maxJumps = 0;
        for (int jumps : dp) {
            maxJumps = Math.max(maxJumps, jumps);
        }
        return maxJumps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + n\*d)**

- `O(n log n)` for sorting the indices by height
- `O(n*d)` for the DP computation: for each of n positions, we check up to 2d neighbors (d left and d right)
- In the worst case where d ≈ n, this becomes O(n²), but typically d is much smaller than n

**Space Complexity: O(n)**

- `O(n)` for storing the sorted indices
- `O(n)` for the DP array
- Total: O(n) auxiliary space

## Common Mistakes

1. **Forgetting the "can't jump over taller buildings" rule**: Many candidates miss that you must stop checking further positions when you encounter a building with height >= current building. This is because you're jumping from the top of a building and can't jump through taller buildings.

2. **Processing positions in wrong order**: If you process positions left-to-right or randomly, you might try to use dp[j] values that haven't been computed yet. Always process from highest to lowest to ensure dependencies are resolved.

3. **Incorrect DP initialization**: Each position should be initialized to 1 (you can always "jump" to yourself), not 0. The problem counts the starting position as 1 jump.

4. **Off-by-one errors with bounds checking**: When checking positions `i ± x`, remember that x can be up to d, so the range is `[i-d, i+d]` inclusive, but excluding i itself. Also ensure you don't go outside array bounds `[0, n-1]`.

## When You'll See This Pattern

This problem combines **dynamic programming** with **topological ordering** (processing by height). You'll see similar patterns in:

1. **Longest Increasing Path in a Matrix** (LeetCode 329): Also uses DP with processing order based on values, where the path must be strictly increasing.

2. **Jump Game IV** (LeetCode 1345): Uses BFS for minimum jumps, but has similar constraints about jumping to positions with certain properties.

3. **Maximum Number of Points with Cost** (LeetCode 1937): Uses DP with careful consideration of left and right transitions, similar to how we check left and right jumps here.

The core pattern is: when you have dependencies where state A depends on states B, C, D that have some ordering property (like smaller values), process in that order to make all dependencies available.

## Key Takeaways

1. **Process dependencies in topological order**: When solving DP problems where state i depends on states with some property (like smaller values), sort by that property to ensure dependencies are computed first.

2. **DP with directional constraints**: When jumps/moves can go in multiple directions (left/right), handle each direction separately and watch for early termination conditions (like hitting taller buildings).

3. **Initialize base cases carefully**: In jump problems, the starting position typically counts as 1, not 0. Always verify what the problem considers as a "jump" or "step".

Related problems: [Jump Game VII](/problem/jump-game-vii), [Jump Game VIII](/problem/jump-game-viii)
