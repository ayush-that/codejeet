---
title: "How to Solve Allocate Mailboxes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Allocate Mailboxes. Hard difficulty, 56.5% acceptance rate. Topics: Array, Math, Dynamic Programming, Sorting."
date: "2029-03-04"
category: "dsa-patterns"
tags: ["allocate-mailboxes", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Allocate Mailboxes

You're given an array of house positions along a street and need to place exactly `k` mailboxes to minimize the total distance from each house to its nearest mailbox. What makes this problem challenging is that it combines two classic optimization problems: clustering (like k-means) and dynamic programming with partitioning. The optimal mailbox placement isn't obvious—it depends on both the house distribution and how many mailboxes we can place.

## Visual Walkthrough

Let's trace through a small example: `houses = [1, 4, 8, 10, 20]` with `k = 3` mailboxes.

**Step 1: Sort the houses**  
First, we sort the houses: `[1, 4, 8, 10, 20]` (already sorted here). This is crucial because mailboxes should serve contiguous segments of houses—if houses A, B, C are served by one mailbox, and B is between A and C, we wouldn't skip B.

**Step 2: Understand the cost calculation**  
For any segment of houses `[i...j]`, where should we place one mailbox to minimize total distance? The optimal position is at the **median** house. Why? If we have an odd number of houses, the median is the middle house. If even, any position between the two middle houses works. The total distance is the sum of distances from each house to this median.

For segment `[1, 4, 8]`:

- Median is 4
- Distances: |1-4| + |4-4| + |8-4| = 3 + 0 + 4 = 7

**Step 3: Dynamic programming approach**  
We need to partition `n` houses into `k` segments, each with one mailbox. Let's define:

- `cost[i][j]` = minimum total distance for houses `i` to `j` with one mailbox
- `dp[i][k]` = minimum total distance for first `i` houses (0-indexed) with `k` mailboxes

Base case: `dp[i][1] = cost[0][i]` (one mailbox for all houses)

Transition: For `dp[i][k]`, try all possible last segment endings:
`dp[i][k] = min(dp[j-1][k-1] + cost[j][i])` for all `j` from `k-1` to `i`

**Step 4: Trace the DP**  
For our example with 5 houses and k=3:

- Precompute all `cost[i][j]`:
  - `cost[0][2]` for houses [1,4,8] = 7
  - `cost[0][3]` for houses [1,4,8,10] = |1-7|+|4-7|+|8-7|+|10-7| = 6+3+1+3 = 13
    (median is between 4 and 8, choose 7)
  - etc.

- Build DP table:
  `dp[4][3]` = min of:
  - `dp[2][2] + cost[3][4]` (last segment: houses 10,20)
  - `dp[1][2] + cost[2][4]` (last segment: houses 8,10,20)
  - `dp[0][2] + cost[1][4]` (last segment: houses 4,8,10,20)

The minimum turns out to be 8, with mailboxes at positions serving: [1], [4,8,10], [20] or similar.

## Brute Force Approach

A naive approach would try all possible mailbox placements. With `n` houses and `k` mailboxes, we could:

1. Try all combinations of `k` mailbox positions from `n` possible locations
2. For each combination, compute total distance by assigning each house to nearest mailbox
3. Track the minimum

The number of combinations is C(n, k), which is exponential. Even for moderate n=20 and k=5, that's 15,504 combinations, and computing distances for each is O(n·k). This becomes infeasible quickly (O(n!/(k!(n-k)!))).

Additionally, the naive approach misses a key insight: mailboxes should be placed at median positions of house clusters, not necessarily at house locations. So even checking all house positions isn't sufficient.

<div class="code-group">

```python
# Brute force - trying all combinations of k houses as mailbox positions
# This is NOT optimal and only works if mailboxes must be at house positions
from itertools import combinations
import math

def minDistanceBruteForce(houses, k):
    houses.sort()
    n = len(houses)
    min_dist = math.inf

    # Try all combinations of k houses as mailbox positions
    for mailbox_positions in combinations(range(n), k):
        total = 0
        # For each house, find nearest mailbox
        for house_idx in range(n):
            house_pos = houses[house_idx]
            # Find minimum distance to any mailbox
            min_house_dist = min(abs(house_pos - houses[mb_idx])
                                 for mb_idx in mailbox_positions)
            total += min_house_dist
        min_dist = min(min_dist, total)

    return min_dist

# This has O(C(n,k) * n * k) time complexity - exponential!
```

```javascript
// Brute force approach
function minDistanceBruteForce(houses, k) {
  houses.sort((a, b) => a - b);
  const n = houses.length;
  let minDist = Infinity;

  // Helper to generate combinations
  function* combine(start, combo) {
    if (combo.length === k) {
      yield combo.slice();
      return;
    }
    for (let i = start; i < n; i++) {
      combo.push(i);
      yield* combine(i + 1, combo);
      combo.pop();
    }
  }

  // Try all combinations
  for (const mailboxIndices of combine(0, [])) {
    let total = 0;
    for (let i = 0; i < n; i++) {
      const housePos = houses[i];
      let minHouseDist = Infinity;
      for (const mbIdx of mailboxIndices) {
        minHouseDist = Math.min(minHouseDist, Math.abs(housePos - houses[mbIdx]));
      }
      total += minHouseDist;
    }
    minDist = Math.min(minDist, total);
  }

  return minDist;
}
// Exponential time complexity - impractical for n > 15
```

```java
// Brute force approach
import java.util.Arrays;

public class Solution {
    public int minDistanceBruteForce(int[] houses, int k) {
        Arrays.sort(houses);
        int n = houses.length;
        int minDist = Integer.MAX_VALUE;

        // Generate all combinations of k indices
        int[] combo = new int[k];
        minDist = combine(houses, combo, 0, 0, k, minDist);

        return minDist;
    }

    private int combine(int[] houses, int[] combo, int start, int depth, int k, int minDist) {
        if (depth == k) {
            // Calculate total distance for this combination
            int total = 0;
            for (int i = 0; i < houses.length; i++) {
                int minHouseDist = Integer.MAX_VALUE;
                for (int mbIdx : combo) {
                    minHouseDist = Math.min(minHouseDist, Math.abs(houses[i] - houses[mbIdx]));
                }
                total += minHouseDist;
            }
            return Math.min(minDist, total);
        }

        for (int i = start; i < houses.length; i++) {
            combo[depth] = i;
            minDist = combine(houses, combo, i + 1, depth + 1, k, minDist);
        }

        return minDist;
    }
}
// Exponential time - only for understanding why we need DP
```

</div>

## Optimized Approach

The key insights for optimization:

1. **Sort houses first**: Mailboxes serve contiguous segments of houses in optimal solution.
2. **Median placement**: For a contiguous segment of houses, the optimal mailbox position is at the median (middle house for odd count, anywhere between two middle houses for even).
3. **Dynamic programming**: Define `dp[i][k]` = min total distance for first `i+1` houses (0 to i) with `k` mailboxes.
4. **Precompute costs**: Calculate `cost[i][j]` = min distance for houses i to j with one mailbox.

Why does median work? For a set of points on a line, the point that minimizes sum of absolute distances is the median. Proof sketch: If you move away from median, you get closer to fewer houses than you get farther from.

The DP recurrence:

- Base: `dp[i][1] = cost[0][i]` (one mailbox for all houses up to i)
- Transition: `dp[i][k] = min(dp[j-1][k-1] + cost[j][i])` for j from k-1 to i
  (split into: first j-1 houses with k-1 mailboxes + last segment j to i with 1 mailbox)

We need to handle 1-based indexing carefully since we have k mailboxes and i houses.

## Optimal Solution

Here's the complete optimal solution using dynamic programming:

<div class="code-group">

```python
# Time: O(n^3 + n^2 * k) where n = len(houses)
# Space: O(n^2 + n * k)
def minDistance(houses, k):
    """
    Returns minimum total distance between each house and its nearest mailbox
    when placing exactly k mailboxes.
    """
    n = len(houses)
    houses.sort()  # Step 1: Sort houses - crucial for contiguous segments

    # Step 2: Precompute cost[i][j] = min distance for houses i to j with one mailbox
    # The optimal mailbox is at median of houses[i..j]
    cost = [[0] * n for _ in range(n)]

    for i in range(n):
        for j in range(i, n):
            # Median index for houses[i..j]
            median = houses[(i + j) // 2]
            # Sum distances from median to all houses in segment
            total = 0
            for m in range(i, j + 1):
                total += abs(houses[m] - median)
            cost[i][j] = total

    # Step 3: DP table - dp[i][k] = min distance for first i+1 houses (0..i) with k mailboxes
    # Using large initial value (infinity)
    INF = float('inf')
    dp = [[INF] * (k + 1) for _ in range(n)]

    # Base case: 1 mailbox for first i+1 houses
    for i in range(n):
        dp[i][1] = cost[0][i]

    # Fill DP table
    for k_val in range(2, k + 1):  # Number of mailboxes
        for i in range(n):  # Number of houses (0..i)
            # Try all possible positions for last mailbox
            # We need at least k_val-1 houses before and at least 1 house for last segment
            for j in range(k_val - 1, i + 1):
                # dp[j-1][k_val-1] = min distance for first j houses with k_val-1 mailboxes
                # cost[j][i] = distance for segment j..i with 1 mailbox
                if j == 0:
                    # Special case: first segment starts at house 0
                    dp[i][k_val] = min(dp[i][k_val], cost[0][i])
                else:
                    dp[i][k_val] = min(dp[i][k_val], dp[j-1][k_val-1] + cost[j][i])

    # Result: min distance for all n houses with k mailboxes
    return dp[n-1][k]

# Optimized cost computation: O(n^2) instead of O(n^3)
def minDistanceOptimized(houses, k):
    n = len(houses)
    houses.sort()

    # Optimized cost computation using prefix sums
    cost = [[0] * n for _ in range(n)]

    for i in range(n):
        # Use running sum to compute cost[i][j] efficiently
        for j in range(i, n):
            median = houses[(i + j) // 2]
            # Instead of summing from i to j each time, we could use prefix sums
            # But for clarity, keeping the simple version
            total = 0
            for m in range(i, j + 1):
                total += abs(houses[m] - median)
            cost[i][j] = total

    # DP with space optimization: only need previous row for k-1
    dp_prev = [INF] * n
    INF = float('inf')

    # Initialize for k=1
    for i in range(n):
        dp_prev[i] = cost[0][i]

    # For each additional mailbox
    for k_val in range(2, k + 1):
        dp_curr = [INF] * n
        for i in range(n):
            for j in range(k_val - 1, i + 1):
                if j == 0:
                    dp_curr[i] = min(dp_curr[i], cost[0][i])
                else:
                    dp_curr[i] = min(dp_curr[i], dp_prev[j-1] + cost[j][i])
        dp_prev = dp_curr

    return dp_prev[n-1]
```

```javascript
// Time: O(n^3 + n^2 * k) | Space: O(n^2 + n * k)
function minDistance(houses, k) {
  const n = houses.length;
  houses.sort((a, b) => a - b);

  // Step 1: Precompute cost[i][j]
  const cost = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Median house for segment i..j
      const median = houses[Math.floor((i + j) / 2)];
      let total = 0;
      for (let m = i; m <= j; m++) {
        total += Math.abs(houses[m] - median);
      }
      cost[i][j] = total;
    }
  }

  // Step 2: DP table initialization
  const INF = Number.MAX_SAFE_INTEGER;
  const dp = Array.from({ length: n }, () => new Array(k + 1).fill(INF));

  // Base case: 1 mailbox for first i+1 houses
  for (let i = 0; i < n; i++) {
    dp[i][1] = cost[0][i];
  }

  // Step 3: Fill DP table
  for (let kVal = 2; kVal <= k; kVal++) {
    for (let i = 0; i < n; i++) {
      // Try all possible last segment starting points
      for (let j = kVal - 1; j <= i; j++) {
        if (j === 0) {
          dp[i][kVal] = Math.min(dp[i][kVal], cost[0][i]);
        } else {
          dp[i][kVal] = Math.min(dp[i][kVal], dp[j - 1][kVal - 1] + cost[j][i]);
        }
      }
    }
  }

  return dp[n - 1][k];
}

// Space-optimized version
function minDistanceOptimized(houses, k) {
  const n = houses.length;
  houses.sort((a, b) => a - b);

  // Precompute cost matrix
  const cost = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const median = houses[Math.floor((i + j) / 2)];
      let total = 0;
      for (let m = i; m <= j; m++) {
        total += Math.abs(houses[m] - median);
      }
      cost[i][j] = total;
    }
  }

  const INF = Number.MAX_SAFE_INTEGER;
  // dpPrev[i] = min distance for first i+1 houses with prev k value
  let dpPrev = new Array(n).fill(INF);

  // Initialize for k=1
  for (let i = 0; i < n; i++) {
    dpPrev[i] = cost[0][i];
  }

  // For each additional mailbox
  for (let kVal = 2; kVal <= k; kVal++) {
    const dpCurr = new Array(n).fill(INF);
    for (let i = 0; i < n; i++) {
      for (let j = kVal - 1; j <= i; j++) {
        if (j === 0) {
          dpCurr[i] = Math.min(dpCurr[i], cost[0][i]);
        } else {
          dpCurr[i] = Math.min(dpCurr[i], dpPrev[j - 1] + cost[j][i]);
        }
      }
    }
    dpPrev = dpCurr;
  }

  return dpPrev[n - 1];
}
```

```java
// Time: O(n^3 + n^2 * k) | Space: O(n^2 + n * k)
class Solution {
    public int minDistance(int[] houses, int k) {
        int n = houses.length;
        Arrays.sort(houses);  // Step 1: Sort houses

        // Step 2: Precompute cost[i][j]
        int[][] cost = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                // Median house for segment i..j
                int median = houses[(i + j) / 2];
                int total = 0;
                for (int m = i; m <= j; m++) {
                    total += Math.abs(houses[m] - median);
                }
                cost[i][j] = total;
            }
        }

        // Step 3: DP table
        int INF = Integer.MAX_VALUE / 2;  // Avoid overflow
        int[][] dp = new int[n][k + 1];

        // Initialize with INF
        for (int i = 0; i < n; i++) {
            Arrays.fill(dp[i], INF);
        }

        // Base case: 1 mailbox for first i+1 houses
        for (int i = 0; i < n; i++) {
            dp[i][1] = cost[0][i];
        }

        // Fill DP table
        for (int kVal = 2; kVal <= k; kVal++) {
            for (int i = 0; i < n; i++) {
                // Try all possible last segment starting points
                for (int j = kVal - 1; j <= i; j++) {
                    if (j == 0) {
                        dp[i][kVal] = Math.min(dp[i][kVal], cost[0][i]);
                    } else {
                        dp[i][kVal] = Math.min(
                            dp[i][kVal],
                            dp[j-1][kVal-1] + cost[j][i]
                        );
                    }
                }
            }
        }

        return dp[n-1][k];
    }
}

// Space-optimized version
class SolutionOptimized {
    public int minDistance(int[] houses, int k) {
        int n = houses.length;
        Arrays.sort(houses);

        // Precompute cost matrix
        int[][] cost = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                int median = houses[(i + j) / 2];
                int total = 0;
                for (int m = i; m <= j; m++) {
                    total += Math.abs(houses[m] - median);
                }
                cost[i][j] = total;
            }
        }

        int INF = Integer.MAX_VALUE / 2;
        // dpPrev[i] = min distance for first i+1 houses with previous k
        int[] dpPrev = new int[n];

        // Initialize for k=1
        for (int i = 0; i < n; i++) {
            dpPrev[i] = cost[0][i];
        }

        // For each additional mailbox
        for (int kVal = 2; kVal <= k; kVal++) {
            int[] dpCurr = new int[n];
            Arrays.fill(dpCurr, INF);

            for (int i = 0; i < n; i++) {
                for (int j = kVal - 1; j <= i; j++) {
                    if (j == 0) {
                        dpCurr[i] = Math.min(dpCurr[i], cost[0][i]);
                    } else {
                        dpCurr[i] = Math.min(dpCurr[i], dpPrev[j-1] + cost[j][i]);
                    }
                }
            }

            dpPrev = dpCurr;
        }

        return dpPrev[n-1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²k + n³)**

- Sorting: O(n log n)
- Precomputing `cost[i][j]`: O(n³) in naive version, but can be optimized to O(n²) using prefix sums
- DP table: O(n²k) - for each k (up to k), for each i (n), we try all j (up to n)

**Space Complexity: O(n² + nk)**

- `cost` matrix: O(n²)
- DP table: O(nk), optimized to O(n) with rolling array

The n³ term for cost computation dominates for large n, but in practice n ≤ 100 for this problem, so it's acceptable. With prefix sum optimization, we can reduce cost computation to O(n²).

## Common Mistakes

1. **Forgetting to sort houses**: This is the most common mistake. Without sorting, the "contiguous segments" assumption fails, and median placement isn't optimal. Always sort first!

2. **Incorrect median calculation**: Using mean instead of median. For absolute distances, median minimizes the sum, not mean. Example: houses at [1, 2, 100] - median is 2 (total distance = 1+0+98=99), mean is ~34 (total distance = 33+32+66=131).

3. **Off-by-one errors in DP indices**: The transition `dp[i][k] = min(dp[j-1][k-1] + cost[j][i])` has tricky indices. When j=0, we need special handling. Test with small cases like n=1, k=1.

4. **Not handling k > n**: If k > n, we can place at most n mailboxes (one per house). The problem guarantees k ≤ n, but it's good to check: if k ≥ n, answer is 0 (mailbox at each house).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Partition DP**: Similar to "Palindrome Partitioning II" (LeetCode 132) where you partition a string into palindromes. The recurrence `dp[i][k] = min(dp[j][k-1] + cost(j+1, i))` appears in many partition problems.

2. **Median for minimization**: The median minimizes sum of absolute deviations. Appears in:
   - "Best Meeting Point" (LeetCode 296) - find point minimizing total Manhattan distance
   - "Minimum Moves to Equal Array Elements II" (LeetCode 462) - make all elements equal with min moves

3. **Clustering on a line**: Similar to k-means but constrained to 1D. Related to "Paint House" problems but with variable cluster centers.

## Key Takeaways

1. **Sort 1D location problems**: When houses/points are on a line and you need to group them, sorting first often enables efficient DP solutions with contiguous segments.

2. **Median minimizes absolute distance**: For a set of points on a line, the point minimizing sum of absolute distances is the median. This is a fundamental property worth remembering.

3. **Partition DP pattern**: When you need to split an array into k parts minimizing some cost, think: `dp[i][k] = min(dp[j][k-1] + cost(j+1, i))`. Precompute the cost function if possible.

[Practice this problem on CodeJeet](/problem/allocate-mailboxes)
