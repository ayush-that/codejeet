---
title: "How to Solve Minimum Cost to Connect Two Groups of Points — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Connect Two Groups of Points. Hard difficulty, 49.6% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Matrix, Bitmask."
date: "2026-04-14"
category: "dsa-patterns"
tags:
  [
    "minimum-cost-to-connect-two-groups-of-points",
    "array",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Minimum Cost to Connect Two Groups of Points

This problem asks us to connect two groups of points with minimum total cost, where each point in the first group must connect to at least one point in the second group, and each point in the second group must connect to at least one point in the first group. The challenge lies in the combinatorial nature of the problem—we need to consider all possible connection patterns while ensuring both constraints are satisfied, making this a classic bitmask dynamic programming problem.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

- size1 = 3, size2 = 2
- cost matrix:
  ```
  [1, 2]  # cost[0][0]=1, cost[0][1]=2
  [3, 4]  # cost[1][0]=3, cost[1][1]=4
  [5, 6]  # cost[2][0]=5, cost[2][1]=6
  ```

**Step-by-step reasoning:**

1. We have 3 points in group1 (A0, A1, A2) and 2 points in group2 (B0, B1)
2. Each A point must connect to at least one B point
3. Each B point must connect to at least one A point
4. We need to find the minimum total cost

Let's think about possible connections:

- If we connect A0→B0 (cost 1), A1→B0 (cost 3), A2→B1 (cost 6), then B0 has 2 connections and B1 has 1 connection. Total cost = 1+3+6 = 10
- If we connect A0→B1 (cost 2), A1→B0 (cost 3), A2→B0 (cost 5), then B0 has 2 connections and B1 has 1 connection. Total cost = 2+3+5 = 10
- But what if we connect A0→B0 (cost 1), A1→B1 (cost 4), A2→B0 (cost 5)? Then B0 has 2 connections and B1 has 1 connection. Total cost = 1+4+5 = 10

Wait, all these give 10. But can we do better? Let's try:

- Connect A0→B0 (cost 1), A1→B0 (cost 3), A2→B0 (cost 5) = 9. But B1 has no connections! This violates the constraint that each B point must connect to at least one A point.

The optimal solution here is actually 10. But how do we systematically find this? We need to track which B points have been connected as we process each A point.

## Brute Force Approach

The brute force approach would try all possible connection patterns:

1. For each A point, choose at least one B point to connect to
2. Ensure every B point is chosen by at least one A point
3. Calculate the total cost for each valid pattern
4. Return the minimum cost

The number of possibilities is enormous: each A point can connect to any non-empty subset of B points. With size1=12 and size2=12 (maximum constraints), this would be (2^12 - 1)^12 possibilities, which is completely infeasible.

Even if we try to be smarter by connecting each A point to exactly one B point (which doesn't satisfy the "at least one" constraint), we'd have size2^size1 possibilities. For size1=12, size2=12, that's 12^12 ≈ 8.9×10^12 possibilities—still impossible.

## Optimized Approach

The key insight is that we can use **bitmask dynamic programming** to represent which B points have been connected so far. Since size2 ≤ 12 (from constraints), we can represent the connection status of B points with a bitmask of size2 bits.

**DP State Definition:**
Let `dp[i][mask]` = minimum cost to connect the first i points from group1 (0-indexed) such that the B points connected so far are represented by bitmask `mask`.

**Transition:**
When we process A point i, we need to connect it to at least one B point. For each possible subset of B points that A point i can connect to (non-empty), we update the DP state:

```
dp[i+1][mask | subset_mask] = min(
    dp[i+1][mask | subset_mask],
    dp[i][mask] + cost_of_connecting_Ai_to_subset(subset_mask)
)
```

**Final Step:**
After processing all A points, we need to ensure all B points are connected. For any mask that doesn't cover all B points (mask != (1<<size2)-1), we need to add the minimum additional cost to connect the remaining B points. Each unconnected B point j must be connected to at least one A point, so we find the minimum cost among all A points to connect to that B point.

**Optimization:**
We can precompute for each B point j the minimum cost to connect it from any A point. This helps us efficiently calculate the cost to connect remaining B points at the end.

## Optimal Solution

Here's the complete solution using bitmask DP with detailed comments:

<div class="code-group">

```python
# Time: O(size1 * 3^size2) - For each A point, we iterate over all masks and all subsets
# Space: O(size1 * 2^size2) - DP table size
class Solution:
    def connectTwoGroups(self, cost: List[List[int]]) -> int:
        size1, size2 = len(cost), len(cost[0])

        # Precompute min cost to connect each B point from any A point
        # This helps us efficiently add costs for unconnected B points at the end
        min_cost_to_B = [float('inf')] * size2
        for j in range(size2):
            for i in range(size1):
                min_cost_to_B[j] = min(min_cost_to_B[j], cost[i][j])

        # DP table: dp[i][mask] = min cost to connect first i A points
        # such that B points in mask are connected
        # We use 2 rows to save space (current and previous)
        dp = [[float('inf')] * (1 << size2) for _ in range(2)]
        dp[0][0] = 0  # Base case: 0 A points processed, no B points connected

        # Process each A point
        for i in range(size1):
            current = i % 2
            next_row = (i + 1) % 2

            # Reset next row to infinity
            for mask in range(1 << size2):
                dp[next_row][mask] = float('inf')

            # For each mask representing which B points are already connected
            for mask in range(1 << size2):
                if dp[current][mask] == float('inf'):
                    continue

                # A point i must connect to at least one B point
                # Try all non-empty subsets of B points to connect to
                # We iterate over all possible subset masks
                for subset in range(1, 1 << size2):
                    # Calculate cost to connect A point i to this subset of B points
                    subset_cost = 0
                    new_mask = mask

                    # Add cost for each B point in the subset
                    for j in range(size2):
                        if subset & (1 << j):
                            subset_cost += cost[i][j]
                            new_mask |= (1 << j)

                    # Update DP state
                    dp[next_row][new_mask] = min(
                        dp[next_row][new_mask],
                        dp[current][mask] + subset_cost
                    )

        # After processing all A points, we need to ensure all B points are connected
        final_mask = (1 << size2) - 1  # Mask with all bits set
        result = float('inf')

        # Check all masks in the last row
        for mask in range(1 << size2):
            if dp[size1 % 2][mask] == float('inf'):
                continue

            # Calculate additional cost to connect any unconnected B points
            additional_cost = 0
            for j in range(size2):
                if not (mask & (1 << j)):
                    additional_cost += min_cost_to_B[j]

            result = min(result, dp[size1 % 2][mask] + additional_cost)

        return result
```

```javascript
// Time: O(size1 * 3^size2) - For each A point, we iterate over all masks and all subsets
// Space: O(size1 * 2^size2) - DP table size
/**
 * @param {number[][]} cost
 * @return {number}
 */
var connectTwoGroups = function (cost) {
  const size1 = cost.length;
  const size2 = cost[0].length;

  // Precompute min cost to connect each B point from any A point
  const minCostToB = new Array(size2).fill(Infinity);
  for (let j = 0; j < size2; j++) {
    for (let i = 0; i < size1; i++) {
      minCostToB[j] = Math.min(minCostToB[j], cost[i][j]);
    }
  }

  // DP table with 2 rows for space optimization
  const dp = Array.from({ length: 2 }, () => new Array(1 << size2).fill(Infinity));
  dp[0][0] = 0; // Base case

  // Process each A point
  for (let i = 0; i < size1; i++) {
    const current = i % 2;
    const nextRow = (i + 1) % 2;

    // Reset next row
    for (let mask = 0; mask < 1 << size2; mask++) {
      dp[nextRow][mask] = Infinity;
    }

    // For each mask representing connected B points
    for (let mask = 0; mask < 1 << size2; mask++) {
      if (dp[current][mask] === Infinity) continue;

      // Try all non-empty subsets of B points for A point i to connect to
      for (let subset = 1; subset < 1 << size2; subset++) {
        let subsetCost = 0;
        let newMask = mask;

        // Calculate cost for this subset
        for (let j = 0; j < size2; j++) {
          if (subset & (1 << j)) {
            subsetCost += cost[i][j];
            newMask |= 1 << j;
          }
        }

        // Update DP state
        dp[nextRow][newMask] = Math.min(dp[nextRow][newMask], dp[current][mask] + subsetCost);
      }
    }
  }

  // Ensure all B points are connected
  const finalMask = (1 << size2) - 1;
  let result = Infinity;
  const lastRow = size1 % 2;

  for (let mask = 0; mask < 1 << size2; mask++) {
    if (dp[lastRow][mask] === Infinity) continue;

    // Add cost for any unconnected B points
    let additionalCost = 0;
    for (let j = 0; j < size2; j++) {
      if (!(mask & (1 << j))) {
        additionalCost += minCostToB[j];
      }
    }

    result = Math.min(result, dp[lastRow][mask] + additionalCost);
  }

  return result;
};
```

```java
// Time: O(size1 * 3^size2) - For each A point, we iterate over all masks and all subsets
// Space: O(size1 * 2^size2) - DP table size
class Solution {
    public int connectTwoGroups(List<List<Integer>> cost) {
        int size1 = cost.size();
        int size2 = cost.get(0).size();

        // Precompute min cost to connect each B point from any A point
        int[] minCostToB = new int[size2];
        Arrays.fill(minCostToB, Integer.MAX_VALUE);
        for (int j = 0; j < size2; j++) {
            for (int i = 0; i < size1; i++) {
                minCostToB[j] = Math.min(minCostToB[j], cost.get(i).get(j));
            }
        }

        // DP table with 2 rows for space optimization
        int[][] dp = new int[2][1 << size2];
        for (int i = 0; i < 2; i++) {
            Arrays.fill(dp[i], Integer.MAX_VALUE);
        }
        dp[0][0] = 0;  // Base case

        // Process each A point
        for (int i = 0; i < size1; i++) {
            int current = i % 2;
            int nextRow = (i + 1) % 2;

            // Reset next row
            Arrays.fill(dp[nextRow], Integer.MAX_VALUE);

            // For each mask representing connected B points
            for (int mask = 0; mask < (1 << size2); mask++) {
                if (dp[current][mask] == Integer.MAX_VALUE) continue;

                // Try all non-empty subsets of B points for A point i to connect to
                for (int subset = 1; subset < (1 << size2); subset++) {
                    int subsetCost = 0;
                    int newMask = mask;

                    // Calculate cost for this subset
                    for (int j = 0; j < size2; j++) {
                        if ((subset & (1 << j)) != 0) {
                            subsetCost += cost.get(i).get(j);
                            newMask |= (1 << j);
                        }
                    }

                    // Update DP state
                    if (dp[current][mask] + subsetCost < dp[nextRow][newMask]) {
                        dp[nextRow][newMask] = dp[current][mask] + subsetCost;
                    }
                }
            }
        }

        // Ensure all B points are connected
        int finalMask = (1 << size2) - 1;
        int result = Integer.MAX_VALUE;
        int lastRow = size1 % 2;

        for (int mask = 0; mask < (1 << size2); mask++) {
            if (dp[lastRow][mask] == Integer.MAX_VALUE) continue;

            // Add cost for any unconnected B points
            int additionalCost = 0;
            for (int j = 0; j < size2; j++) {
                if ((mask & (1 << j)) == 0) {
                    additionalCost += minCostToB[j];
                }
            }

            result = Math.min(result, dp[lastRow][mask] + additionalCost);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(size1 × 3^size2)

- We have size1 A points to process
- For each A point, we iterate over all masks (2^size2 possibilities)
- For each mask, we try all subsets of B points (2^size2 possibilities)
- However, the inner loop over subsets for each mask gives us O(3^size2) total for each A point, not O(2^size2 × 2^size2) = O(4^size2). This is because when we iterate over all masks and all subsets, each pair (mask, subset) is considered exactly once, and there are 3^size2 such pairs (each B point can be: not in mask and not in subset, in mask but not in subset, or in subset).

**Space Complexity:** O(size1 × 2^size2) for the full DP table, but we optimize to O(2^size2) by using only 2 rows.

## Common Mistakes

1. **Forgetting that A points must connect to at least one B point:** Some candidates might allow A points to connect to 0 B points, which violates the problem constraints. Always ensure each A point connects to a non-empty subset of B points.

2. **Not handling the "each B point must connect to at least one A point" constraint properly:** It's easy to focus only on connecting A points and forget that at the end, we need to ensure all B points are covered. The final step of adding minimum costs for unconnected B points is crucial.

3. **Using the wrong bitmask size:** Since size1 ≥ size2, candidates might try to use a bitmask of size size1, but this would be inefficient. We should use a bitmask for the smaller group (size2) to keep the state space manageable.

4. **Not optimizing the subset iteration:** The naive approach of iterating over all subsets for each mask gives O(4^size2) complexity. While our solution has O(3^size2) complexity, in practice with size2 ≤ 12, both are acceptable, but understanding the difference shows deeper algorithmic knowledge.

## When You'll See This Pattern

This bitmask DP pattern appears in problems where you need to track the state of multiple items and the state space is small enough to represent with bits (typically ≤ 20-25 bits total).

Related LeetCode problems:

1. **Minimum Cost to Hire K Workers (LeetCode 857)** - Uses bitmask-like state tracking for worker combinations
2. **Maximum Students Taking Exam (LeetCode 1349)** - Uses bitmask DP to represent seating arrangements
3. **Number of Ways to Wear Different Hats to Each Other (LeetCode 1434)** - Similar bitmask DP where hats are assigned to people
4. **Partition to K Equal Sum Subsets (LeetCode 698)** - Uses bitmask to track which elements are used

The key similarity is using bitmasks to represent subsets or states, then using DP to build up the solution incrementally.

## Key Takeaways

1. **Bitmask DP is powerful for subset problems:** When you need to track which elements from a small set (≤ 20) have been used/selected, bitmask DP is often the right approach.

2. **Think about which group to track:** In problems with two groups, track the state of the smaller group to minimize the state space. Here we track which B points are connected because size2 ≤ size1.

3. **Precomputation helps:** Precomputing values like `min_cost_to_B` can simplify the final step and make the solution cleaner and more efficient.

4. **Space optimization matters:** Using only 2 rows in the DP table instead of size1 rows reduces space complexity from O(size1 × 2^size2) to O(2^size2).

[Practice this problem on CodeJeet](/problem/minimum-cost-to-connect-two-groups-of-points)
