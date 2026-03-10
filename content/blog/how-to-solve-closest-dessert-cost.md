---
title: "How to Solve Closest Dessert Cost — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Closest Dessert Cost. Medium difficulty, 48.4% acceptance rate. Topics: Array, Dynamic Programming, Backtracking."
date: "2028-12-17"
category: "dsa-patterns"
tags: ["closest-dessert-cost", "array", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Closest Dessert Cost

You need to create a dessert with exactly one ice cream base and one or more toppings (each topping can be used multiple times). Given arrays of base costs and topping costs, find the dessert cost closest to a target price. If there's a tie, return the lower cost. This problem is tricky because you must consider all combinations of toppings (including multiple uses of each) while efficiently searching for the closest match to a target.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- Base costs: `[1, 7]`
- Topping costs: `[3, 4]`
- Target: `10`

**Step 1:** Start with each base cost

- Base 1: Starting cost = 1
- Base 7: Starting cost = 7

**Step 2:** For each base, explore all topping combinations
For base 1:

- Add 0 toppings: 1
- Add topping 3 (0, 1, or 2 times): 1, 4, 7
- Add topping 4 (0, 1, or 2 times) to each of the above:
  - From 1: 1, 5, 9
  - From 4: 4, 8, 12
  - From 7: 7, 11, 15

For base 7:

- Add 0 toppings: 7
- Add topping 3: 7, 10, 13
- Add topping 4 to each:
  - From 7: 7, 11, 15
  - From 10: 10, 14, 18
  - From 13: 13, 17, 21

**Step 3:** Compare all costs to target 10
Possible costs: 1, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 21
Closest to 10: 10 (exact match from base 7 + one topping 3)

The challenge is doing this efficiently without generating all combinations explicitly.

## Brute Force Approach

A naive solution would generate all possible dessert costs by trying:

1. Every base (n choices)
2. Every combination of toppings where each topping can be used 0, 1, or 2 times (3^m combinations per base)

This gives us n × 3^m total combinations to check. For each combination, we calculate the total cost and track the one closest to target.

**Why this is too slow:**
If m = 10 (a reasonable input size), 3^10 = 59,049 combinations per base. With n = 10 bases, that's 590,490 total combinations. While this might pass for very small inputs, it's exponential and will time out for larger constraints.

## Optimized Approach

The key insight is that we don't need to generate all topping combinations upfront. Instead, we can use **dynamic programming** to track achievable costs up to a certain limit.

**Step-by-step reasoning:**

1. The maximum possible cost is: max(base) + 2 × sum(toppings) (since each topping can be used at most twice)
2. We can create a DP array where `dp[i] = true` if cost `i` is achievable using toppings
3. Start with just the base cost, then for each topping, update which costs are achievable by adding 0, 1, or 2 of that topping
4. After processing all toppings, check all achievable costs to find the one closest to target

**Why this is better:**
Instead of 3^m combinations, we have O(n × M × m) where M is the maximum cost we consider. Since costs are limited (≤ 10^4), this is much more efficient.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * M * m) where M = max(target, max_base + 2*sum(toppings))
# Space: O(M) for the DP array
def closestCost(baseCosts, toppingCosts, target):
    """
    Find the dessert cost closest to target.

    Args:
        baseCosts: List of ice cream base costs
        toppingCosts: List of topping costs (each can be used 0-2 times)
        target: The desired cost

    Returns:
        The cost closest to target (lower cost if tie)
    """
    # Maximum cost we need to consider
    max_cost = max(target, max(baseCosts)) + 2 * sum(toppingCosts)

    # Initialize DP array: dp[i] = True if cost i is achievable
    dp = [False] * (max_cost + 1)

    # Start with base costs (each base alone is achievable)
    for base in baseCosts:
        if base <= max_cost:
            dp[base] = True

    # Process each topping
    for topping in toppingCosts:
        # Process in reverse to avoid reusing the same topping multiple times
        # in a single iteration (standard knapsack technique)
        for cost in range(max_cost, -1, -1):
            if dp[cost]:
                # Add 1 topping
                if cost + topping <= max_cost:
                    dp[cost + topping] = True
                # Add 2 toppings
                if cost + 2 * topping <= max_cost:
                    dp[cost + 2 * topping] = True

    # Find the cost closest to target
    min_diff = float('inf')
    result = float('inf')

    # Check all achievable costs
    for cost in range(max_cost + 1):
        if dp[cost]:
            diff = abs(cost - target)
            # If this cost is closer, or equally close but cheaper
            if diff < min_diff or (diff == min_diff and cost < result):
                min_diff = diff
                result = cost

    return result
```

```javascript
// Time: O(n * M * m) where M = max(target, max_base + 2*sum(toppings))
// Space: O(M) for the DP array
function closestCost(baseCosts, toppingCosts, target) {
  /**
   * Find the dessert cost closest to target.
   *
   * @param {number[]} baseCosts - Ice cream base costs
   * @param {number[]} toppingCosts - Topping costs (each can be used 0-2 times)
   * @param {number} target - The desired cost
   * @return {number} - The cost closest to target (lower cost if tie)
   */

  // Calculate maximum cost we need to consider
  const maxBase = Math.max(...baseCosts);
  const sumToppings = toppingCosts.reduce((sum, cost) => sum + cost, 0);
  const maxCost = Math.max(target, maxBase) + 2 * sumToppings;

  // DP array: dp[i] = true if cost i is achievable
  const dp = new Array(maxCost + 1).fill(false);

  // Initialize with base costs
  for (const base of baseCosts) {
    if (base <= maxCost) {
      dp[base] = true;
    }
  }

  // Process each topping
  for (const topping of toppingCosts) {
    // Process in reverse to avoid reusing same topping multiple times
    for (let cost = maxCost; cost >= 0; cost--) {
      if (dp[cost]) {
        // Add 1 topping
        if (cost + topping <= maxCost) {
          dp[cost + topping] = true;
        }
        // Add 2 toppings
        if (cost + 2 * topping <= maxCost) {
          dp[cost + 2 * topping] = true;
        }
      }
    }
  }

  // Find the cost closest to target
  let minDiff = Infinity;
  let result = Infinity;

  for (let cost = 0; cost <= maxCost; cost++) {
    if (dp[cost]) {
      const diff = Math.abs(cost - target);
      // Update if closer, or equally close but cheaper
      if (diff < minDiff || (diff === minDiff && cost < result)) {
        minDiff = diff;
        result = cost;
      }
    }
  }

  return result;
}
```

```java
// Time: O(n * M * m) where M = max(target, max_base + 2*sum(toppings))
// Space: O(M) for the DP array
class Solution {
    public int closestCost(int[] baseCosts, int[] toppingCosts, int target) {
        /**
         * Find the dessert cost closest to target.
         *
         * @param baseCosts: Ice cream base costs
         * @param toppingCosts: Topping costs (each can be used 0-2 times)
         * @param target: The desired cost
         * @return: The cost closest to target (lower cost if tie)
         */

        // Calculate maximum cost to consider
        int maxBase = 0;
        for (int base : baseCosts) {
            maxBase = Math.max(maxBase, base);
        }

        int sumToppings = 0;
        for (int topping : toppingCosts) {
            sumToppings += topping;
        }

        int maxCost = Math.max(target, maxBase) + 2 * sumToppings;

        // DP array: dp[i] = true if cost i is achievable
        boolean[] dp = new boolean[maxCost + 1];

        // Initialize with base costs
        for (int base : baseCosts) {
            if (base <= maxCost) {
                dp[base] = true;
            }
        }

        // Process each topping
        for (int topping : toppingCosts) {
            // Process in reverse to avoid reusing same topping multiple times
            for (int cost = maxCost; cost >= 0; cost--) {
                if (dp[cost]) {
                    // Add 1 topping
                    if (cost + topping <= maxCost) {
                        dp[cost + topping] = true;
                    }
                    // Add 2 toppings
                    if (cost + 2 * topping <= maxCost) {
                        dp[cost + 2 * topping] = true;
                    }
                }
            }
        }

        // Find the cost closest to target
        int minDiff = Integer.MAX_VALUE;
        int result = Integer.MAX_VALUE;

        for (int cost = 0; cost <= maxCost; cost++) {
            if (dp[cost]) {
                int diff = Math.abs(cost - target);
                // Update if closer, or equally close but cheaper
                if (diff < minDiff || (diff == minDiff && cost < result)) {
                    minDiff = diff;
                    result = cost;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × M × m)**

- `n`: Number of base costs (initialization loop)
- `m`: Number of toppings (outer loop in DP)
- `M`: Maximum cost we consider, which is `max(target, max_base) + 2 × sum(toppings)`
- The triple nested loops come from: for each topping (m), we iterate through all costs up to M, and for each base we initialize the DP array

**Space Complexity: O(M)**

- We need a DP array of size M+1 to track achievable costs
- The space doesn't depend on n or m directly, only on the maximum cost we consider

**Why this is acceptable:**
Constraints ensure costs are reasonable (≤ 10^4), so M is at most ~20,000. With n, m ≤ 10, this gives about 10 × 20,000 × 10 = 2,000,000 operations, which is efficient.

## Common Mistakes

1. **Not processing DP array in reverse:** When updating achievable costs for each topping, if you process from low to high, you might reuse the same topping multiple times in unintended ways (e.g., adding topping A twice when you only meant to add it once). Always process from high to low for knapsack-style DP.

2. **Forgetting the "at most 2" constraint:** Each topping can be used 0, 1, or 2 times. Some candidates implement it as 0 or 1 time, or unlimited times. The problem clearly states "at most two" of each type.

3. **Incorrect tie-breaking:** When two costs are equally close to target, you must return the lower cost. This is easy to miss in the final comparison logic.

4. **Not considering costs above target:** The closest cost might be higher than the target. Some candidates only search up to the target, but we need to consider costs above target as well.

## When You'll See This Pattern

This problem uses a **bounded knapsack DP** pattern where each item (topping) has limited uses (0-2). Similar problems include:

1. **Coin Change II (LeetCode 518)** - Unlimited coin usage to make change
2. **Partition Equal Subset Sum (LeetCode 416)** - Subset sum problem, a classic DP application
3. **Target Sum (LeetCode 494)** - Assign +/- to numbers to reach target

The key similarity is using a boolean DP array to track achievable sums/values, then iteratively updating it with each available option.

## Key Takeaways

1. **Bounded knapsack problems** can often be solved with DP where `dp[i]` represents whether value `i` is achievable. Process items in reverse to respect quantity limits.

2. **When search space is limited**, sometimes a DP approach is more efficient than brute force enumeration, even if the DP array size seems large. Constraints matter!

3. **Always check tie-breaking rules** carefully. Problems often have specific rules for ties (lower/higher value, lexicographic order, etc.) that are easy to miss.

[Practice this problem on CodeJeet](/problem/closest-dessert-cost)
