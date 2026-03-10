---
title: "How to Solve Maximum Height by Stacking Cuboids  — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Height by Stacking Cuboids . Hard difficulty, 61.7% acceptance rate. Topics: Array, Dynamic Programming, Sorting."
date: "2028-09-26"
category: "dsa-patterns"
tags: ["maximum-height-by-stacking-cuboids", "array", "dynamic-programming", "sorting", "hard"]
---

# How to Solve Maximum Height by Stacking Cuboids

You are given `n` cuboids with dimensions `[width, length, height]`. You need to find the maximum possible height of a stack of cuboids where each cuboid must have dimensions less than or equal to the one below it in all three dimensions. The challenge is that you can rotate cuboids—meaning any dimension can serve as height—and you need to select a subset of cuboids to maximize total height.

What makes this problem tricky is the combination of three constraints: 1) You can rotate cuboids, so each cuboid has 6 possible orientations, 2) You need to satisfy three-dimensional ordering constraints, and 3) You want to maximize height, not just count cuboids. This is essentially a 3D version of the classic "box stacking" problem with rotation allowed.

## Visual Walkthrough

Let's trace through a small example: `cuboids = [[50,45,20],[95,37,53],[45,23,12]]`

**Step 1: Sort dimensions of each cuboid**
For each cuboid, we sort its dimensions so the largest dimension is last (will serve as candidate height):

- `[20,45,50]` → sorted: `[20,45,50]`
- `[37,53,95]` → sorted: `[37,53,95]`
- `[12,23,45]` → sorted: `[12,23,45]`

**Step 2: Sort all cuboids**
We sort all cuboids by all three dimensions (width, length, height):
Sorted cuboids: `[[12,23,45],[20,45,50],[37,53,95]]`

**Step 3: Dynamic Programming to find maximum height**
We create a DP array where `dp[i]` = max height with cuboid `i` at the top:

- `dp[0] = 45` (just cuboid 0)
- `dp[1] = 50` (check if cuboid 1 can go on cuboid 0: 20≤12? No, so just cuboid 1)
- `dp[2] = 95` (check if cuboid 2 can go on cuboid 0: 37≤12? No; on cuboid 1: 37≤20? No)

Maximum height = 95 (just the tallest cuboid).

Let's try another example: `[[38,25,45],[76,35,3]]`

**Step 1: Sort dimensions:**

- `[25,38,45]`
- `[3,35,76]`

**Step 2: Sort cuboids:**
`[[25,38,45],[3,35,76]]`

**Step 3: DP:**

- `dp[0] = 45`
- `dp[1] = 76` (check if cuboid 1 can go on cuboid 0: 3≤25 and 35≤38 and 76≤45? No)
  Maximum = 76

But wait! What if we rotate the second cuboid differently? Actually, we already considered all rotations when we sorted each cuboid's dimensions. The key insight is that for stacking, we want the largest dimension as height to maximize height, and we sort dimensions so we can compare them consistently.

## Brute Force Approach

A naive brute force approach would:

1. Generate all 6 possible orientations for each cuboid (3! = 6 permutations of dimensions)
2. Consider all subsets of cuboids (2^n subsets)
3. For each subset, try all permutations to find a valid stacking order
4. Calculate the height for valid stacks and track the maximum

This approach has complexity O(6^n \* n!) which is astronomically large even for small n. The brute force is clearly infeasible because:

- With n=10, we'd have 60^10 \* 10! ≈ 3.6e19 operations
- The problem constraints go up to n=100

The key issues with brute force are:

1. Exponential number of subsets (2^n)
2. Factorial number of permutations (n!)
3. Multiple orientations per cuboid (6^n)

We need a smarter approach that avoids exploring all these possibilities.

## Optimized Approach

The optimized approach uses dynamic programming with careful sorting. Here's the step-by-step reasoning:

**Key Insight 1: Sorting dimensions within each cuboid**
Since we can rotate cuboids, any dimension can serve as height. To maximize height in a stack, we want to use the largest dimension as the "height" dimension when placing a cuboid. So for each cuboid, we sort its dimensions so that `width ≤ length ≤ height`. This ensures:

- The height dimension is the largest (maximizing contribution to stack height)
- We have a canonical representation for comparison

**Key Insight 2: Sorting all cuboids**
After sorting each cuboid's dimensions, we sort all cuboids by (width, length, height). This sorting ensures that if cuboid i comes before cuboid j in the sorted order, then it's possible (but not guaranteed) that i could be placed below j. The sorting creates a partial order that makes the problem similar to finding the longest increasing subsequence in 3D.

**Key Insight 3: Dynamic Programming formulation**
We define `dp[i]` as the maximum height achievable with cuboid i at the top of the stack. For each cuboid i, we check all previous cuboids j (j < i) and if cuboid j can be placed below cuboid i (i.e., `cuboids[j][0] <= cuboids[i][0]` and `cuboids[j][1] <= cuboids[i][1]` and `cuboids[j][2] <= cuboids[i][2]`), then we can extend the stack: `dp[i] = max(dp[i], dp[j] + height_i)`.

**Why this works:**

1. Sorting dimensions ensures we use the maximum possible height from each cuboid
2. Sorting cuboids ensures we only need to check previous cuboids (similar to LIS)
3. The DP finds the optimal stacking order without needing to try all permutations

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n)
def maxHeight(cuboids):
    """
    Calculate maximum height by stacking cuboids with rotation allowed.

    Steps:
    1. Sort dimensions of each cuboid (width <= length <= height)
    2. Sort all cuboids by all three dimensions
    3. Use DP similar to longest increasing subsequence in 3D
    """
    n = len(cuboids)

    # Step 1: Sort dimensions within each cuboid
    # This ensures height is the largest dimension (maximizes stack height)
    for i in range(n):
        cuboids[i].sort()

    # Step 2: Sort all cuboids by (width, length, height)
    # This creates an ordering where if i < j, cuboid i MIGHT fit under cuboid j
    cuboids.sort()

    # Step 3: DP array where dp[i] = max height with cuboid i at top
    dp = [0] * n

    # Initialize dp with each cuboid's height (stack with just that cuboid)
    for i in range(n):
        dp[i] = cuboids[i][2]  # height is the third (largest) dimension

    # Step 4: For each cuboid, check all previous cuboids
    for i in range(n):
        # Get dimensions of current cuboid
        w_i, l_i, h_i = cuboids[i]

        # Check all cuboids that come before i in sorted order
        for j in range(i):
            # Get dimensions of previous cuboid
            w_j, l_j, h_j = cuboids[j]

            # Check if cuboid j can be placed below cuboid i
            # All dimensions of j must be <= corresponding dimensions of i
            if w_j <= w_i and l_j <= l_i and h_j <= h_i:
                # If j can go below i, update dp[i] to include j's stack
                dp[i] = max(dp[i], dp[j] + h_i)

    # The answer is the maximum value in dp array
    return max(dp)
```

```javascript
// Time: O(n^2) | Space: O(n)
function maxHeight(cuboids) {
  /**
   * Calculate maximum height by stacking cuboids with rotation allowed.
   *
   * Steps:
   * 1. Sort dimensions of each cuboid (width <= length <= height)
   * 2. Sort all cuboids by all three dimensions
   * 3. Use DP similar to longest increasing subsequence in 3D
   */
  const n = cuboids.length;

  // Step 1: Sort dimensions within each cuboid
  // This ensures height is the largest dimension (maximizes stack height)
  for (let i = 0; i < n; i++) {
    cuboids[i].sort((a, b) => a - b);
  }

  // Step 2: Sort all cuboids by (width, length, height)
  // This creates an ordering where if i < j, cuboid i MIGHT fit under cuboid j
  cuboids.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[2] - b[2];
  });

  // Step 3: DP array where dp[i] = max height with cuboid i at top
  const dp = new Array(n).fill(0);

  // Initialize dp with each cuboid's height (stack with just that cuboid)
  for (let i = 0; i < n; i++) {
    dp[i] = cuboids[i][2]; // height is the third (largest) dimension
  }

  // Step 4: For each cuboid, check all previous cuboids
  for (let i = 0; i < n; i++) {
    // Get dimensions of current cuboid
    const [w_i, l_i, h_i] = cuboids[i];

    // Check all cuboids that come before i in sorted order
    for (let j = 0; j < i; j++) {
      // Get dimensions of previous cuboid
      const [w_j, l_j, h_j] = cuboids[j];

      // Check if cuboid j can be placed below cuboid i
      // All dimensions of j must be <= corresponding dimensions of i
      if (w_j <= w_i && l_j <= l_i && h_j <= h_i) {
        // If j can go below i, update dp[i] to include j's stack
        dp[i] = Math.max(dp[i], dp[j] + h_i);
      }
    }
  }

  // The answer is the maximum value in dp array
  return Math.max(...dp);
}
```

```java
// Time: O(n^2) | Space: O(n)
import java.util.Arrays;

class Solution {
    public int maxHeight(int[][] cuboids) {
        /**
         * Calculate maximum height by stacking cuboids with rotation allowed.
         *
         * Steps:
         * 1. Sort dimensions of each cuboid (width <= length <= height)
         * 2. Sort all cuboids by all three dimensions
         * 3. Use DP similar to longest increasing subsequence in 3D
         */
        int n = cuboids.length;

        // Step 1: Sort dimensions within each cuboid
        // This ensures height is the largest dimension (maximizes stack height)
        for (int i = 0; i < n; i++) {
            Arrays.sort(cuboids[i]);
        }

        // Step 2: Sort all cuboids by (width, length, height)
        // This creates an ordering where if i < j, cuboid i MIGHT fit under cuboid j
        Arrays.sort(cuboids, (a, b) -> {
            if (a[0] != b[0]) return a[0] - b[0];
            if (a[1] != b[1]) return a[1] - b[1];
            return a[2] - b[2];
        });

        // Step 3: DP array where dp[i] = max height with cuboid i at top
        int[] dp = new int[n];

        // Initialize dp with each cuboid's height (stack with just that cuboid)
        for (int i = 0; i < n; i++) {
            dp[i] = cuboids[i][2];  // height is the third (largest) dimension
        }

        // Step 4: For each cuboid, check all previous cuboids
        for (int i = 0; i < n; i++) {
            // Get dimensions of current cuboid
            int w_i = cuboids[i][0];
            int l_i = cuboids[i][1];
            int h_i = cuboids[i][2];

            // Check all cuboids that come before i in sorted order
            for (int j = 0; j < i; j++) {
                // Get dimensions of previous cuboid
                int w_j = cuboids[j][0];
                int l_j = cuboids[j][1];
                int h_j = cuboids[j][2];

                // Check if cuboid j can be placed below cuboid i
                // All dimensions of j must be <= corresponding dimensions of i
                if (w_j <= w_i && l_j <= l_i && h_j <= h_i) {
                    // If j can go below i, update dp[i] to include j's stack
                    dp[i] = Math.max(dp[i], dp[j] + h_i);
                }
            }
        }

        // The answer is the maximum value in dp array
        int maxHeight = 0;
        for (int height : dp) {
            maxHeight = Math.max(maxHeight, height);
        }
        return maxHeight;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Sorting each cuboid's dimensions: O(n \* 3 log 3) = O(n)
- Sorting all cuboids: O(n log n)
- Dynamic Programming: O(n²) (nested loops where for each i, we check all j < i)
- Dominated by the O(n²) DP step

**Space Complexity: O(n)**

- We store the DP array of size n
- Sorting is done in-place (except for recursion stack in some sort implementations)
- No additional data structures needed

The O(n²) time complexity is acceptable for n ≤ 100 (constraints in the problem). For larger n, we could optimize further using binary search (like patience sorting for LIS), but that's more complex in 3D.

## Common Mistakes

1. **Forgetting to sort dimensions within each cuboid**: This is crucial because we need to use the largest dimension as height to maximize stack height. Without this step, you might use a suboptimal dimension as height.

2. **Incorrect sorting order for cuboids**: When sorting cuboids, you must sort by all three dimensions (width, then length, then height). Sorting by just one dimension or just the height won't guarantee the correct partial order needed for the DP to work.

3. **Not checking all three dimensions in the placement condition**: The condition `if w_j <= w_i and l_j <= l_i and h_j <= h_i` must check ALL THREE dimensions. Missing any one can lead to invalid stacks where a cuboid doesn't actually fit on top of another.

4. **Initializing DP array incorrectly**: Each `dp[i]` should be initialized to `cuboids[i][2]` (the height of that cuboid alone), not 0. A stack must have at least one cuboid, so the minimum height for position i is the height of cuboid i itself.

## When You'll See This Pattern

This problem uses a **sorting + longest increasing subsequence (LIS)** pattern in multiple dimensions. You'll see similar patterns in:

1. **Russian Doll Envelopes (LeetCode 354)**: Similar 2D version where you need to fit envelopes inside each other. The solution involves sorting by one dimension and finding LIS on the other.

2. **The Number of Weak Characters in the Game (LeetCode 1996)**: Sort characters by attack descending, defense ascending, then count weak characters. Uses similar multi-dimensional sorting strategy.

3. **Maximum Profit in Job Scheduling (LeetCode 1235)**: Sort jobs by end time, then use DP to find non-overlapping sequence with maximum profit. The "compatibility check" (job j ends before job i starts) is similar to our dimension check.

The core pattern is: when you need to find a sequence/subset satisfying ordering constraints in multiple dimensions, sort to create a partial order, then use DP (often LIS-like) to find the optimal sequence.

## Key Takeaways

1. **Multi-dimensional problems often reduce to sorting + LIS**: When you have ordering constraints in multiple dimensions, sort the elements to create a canonical order, then apply dynamic programming similar to finding the longest increasing subsequence.

2. **Preprocessing is key**: Sorting dimensions within each element (cuboid) and then sorting all elements creates the structure needed for an efficient DP solution. This preprocessing transforms the problem into a more manageable form.

3. **Think about what dimension represents "value"**: In stacking problems, height contributes to the objective function. By sorting each cuboid's dimensions, we ensure we use the maximum possible value (height) from each element when it's included in the solution.

Related problems: [The Number of Weak Characters in the Game](/problem/the-number-of-weak-characters-in-the-game), [Maximum Number of Groups Entering a Competition](/problem/maximum-number-of-groups-entering-a-competition)
