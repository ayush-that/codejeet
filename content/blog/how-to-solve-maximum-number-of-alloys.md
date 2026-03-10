---
title: "How to Solve Maximum Number of Alloys — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Alloys. Medium difficulty, 40.3% acceptance rate. Topics: Array, Binary Search."
date: "2029-12-03"
category: "dsa-patterns"
tags: ["maximum-number-of-alloys", "array", "binary-search", "medium"]
---

## How to Solve Maximum Number of Alloys

You own a company that creates alloys using `n` types of metals. You have `k` machines, each requiring specific amounts of each metal to produce one alloy. You have limited stocks of each metal and can purchase additional metals at given prices. The goal is to determine the **maximum number of alloys** you can produce with any single machine while staying within your budget.

What makes this problem interesting is that it combines **resource allocation constraints** with **binary search optimization**. You need to find the maximum production capacity while considering both existing inventory and purchasing costs.

## Visual Walkthrough

Let's walk through a small example:

**Input:**

- `n = 2` (two metal types)
- `k = 2` (two machines)
- `budget = 10`
- `composition = [[1,1], [1,2]]` (machine requirements per alloy)
- `stock = [0,0]` (no starting inventory)
- `cost = [1,1]` (cost per unit of each metal)

**Step-by-step reasoning:**

We need to find the maximum alloys any single machine can produce. Let's test machine 0 first:

Machine 0 needs [1,1] of each metal per alloy.

- To produce 1 alloy: need 1 of metal 0 ($1) + 1 of metal 1 ($1) = $2 total
- To produce 2 alloys: need 2 of metal 0 ($2) + 2 of metal 1 ($2) = $4 total
- To produce 3 alloys: need 3 of each = $6 total
- To produce 4 alloys: need 4 of each = $8 total
- To produce 5 alloys: need 5 of each = $10 total (exactly budget)
- To produce 6 alloys: need 6 of each = $12 total (exceeds budget)

So machine 0 can produce at most 5 alloys.

Now machine 1 needs [1,2] per alloy:

- 1 alloy: 1×$1 + 2×$1 = $3
- 2 alloys: 2×$1 + 4×$1 = $6
- 3 alloys: 3×$1 + 6×$1 = $9
- 4 alloys: 4×$1 + 8×$1 = $12 (exceeds budget)

So machine 1 can produce at most 3 alloys.

The maximum across all machines is **5 alloys** from machine 0.

The key insight: For a given machine and target number of alloys, we can calculate the total cost and check if it fits within budget. Since we want the maximum possible alloys, we can use **binary search** to efficiently find this maximum.

## Brute Force Approach

A naive approach would be to try producing alloys one by one for each machine until we exceed the budget, then take the maximum across machines:

1. For each machine, start with target = 1 alloy
2. Calculate total cost for that target
3. If cost ≤ budget, increment target and repeat
4. When cost > budget, record target-1 as maximum for that machine
5. Return the maximum across all machines

**Why this fails:**
The number of alloys could be very large (up to 2×10⁸ in constraints). Checking each possible number sequentially would be O(k × max_alloys × n), which is far too slow. We need a more efficient way to find the maximum.

## Optimized Approach

The key insight is that **if a machine can produce X alloys, it can definitely produce X-1 alloys** (monotonic property). This allows us to use **binary search**:

1. For each machine, perform binary search to find the maximum alloys it can produce
2. The search range is [0, upper_bound] where upper_bound is a safe maximum
3. For each mid point in binary search:
   - Calculate total cost to produce `mid` alloys
   - If cost ≤ budget, we can try producing more (search right half)
   - If cost > budget, we need to produce fewer (search left half)
4. Track the maximum across all machines

**Why binary search works:**

- Cost increases monotonically with number of alloys
- There's a clear threshold where cost exceeds budget
- Binary search reduces O(n) linear search to O(log n)

**Upper bound calculation:**
A safe upper bound is `budget + max(stock)` because even with zero stock, the maximum alloys is limited by budget divided by cheapest metal cost, plus any existing stock.

## Optimal Solution

<div class="code-group">

```python
# Time: O(k * n * log(upper_bound)) where upper_bound ~ 2*10^8
# Space: O(1) - only using constant extra space
def maxNumberOfAlloys(n, k, budget, composition, stock, cost):
    """
    Calculate maximum number of alloys any single machine can produce.

    Args:
        n: number of metal types
        k: number of machines
        budget: available budget for purchasing metals
        composition: k x n matrix of metal requirements per alloy
        stock: available stock of each metal
        cost: price per unit of each metal

    Returns:
        Maximum alloys any machine can produce
    """
    max_alloys = 0

    # Try each machine to find which can produce the most
    for machine in range(k):
        # Binary search for maximum alloys this machine can produce
        left, right = 0, budget + max(stock) + 1  # Upper bound

        while left < right:
            mid = (left + right + 1) // 2  # Round up to avoid infinite loop

            # Calculate total cost to produce 'mid' alloys
            total_cost = 0
            for metal in range(n):
                # Metal needed = (required per alloy * alloys) - existing stock
                needed = composition[machine][metal] * mid - stock[metal]

                # If we need more than we have, calculate purchase cost
                if needed > 0:
                    total_cost += needed * cost[metal]

                # Early exit if already over budget
                if total_cost > budget:
                    break

            # Binary search decision
            if total_cost <= budget:
                left = mid  # We can produce at least 'mid' alloys
            else:
                right = mid - 1  # Too expensive, reduce target

        # Update global maximum
        max_alloys = max(max_alloys, left)

    return max_alloys
```

```javascript
// Time: O(k * n * log(upper_bound)) where upper_bound ~ 2*10^8
// Space: O(1) - only using constant extra space
function maxNumberOfAlloys(n, k, budget, composition, stock, cost) {
  /**
   * Calculate maximum number of alloys any single machine can produce.
   *
   * @param {number} n - number of metal types
   * @param {number} k - number of machines
   * @param {number} budget - available budget for purchasing metals
   * @param {number[][]} composition - k x n matrix of metal requirements
   * @param {number[]} stock - available stock of each metal
   * @param {number[]} cost - price per unit of each metal
   * @return {number} Maximum alloys any machine can produce
   */
  let maxAlloys = 0;

  // Try each machine to find which can produce the most
  for (let machine = 0; machine < k; machine++) {
    // Binary search for maximum alloys this machine can produce
    let left = 0;
    let right = budget + Math.max(...stock) + 1; // Upper bound

    while (left < right) {
      // Use Math.ceil to avoid infinite loop with left = mid
      const mid = Math.floor((left + right + 1) / 2);

      // Calculate total cost to produce 'mid' alloys
      let totalCost = 0;
      let overBudget = false;

      for (let metal = 0; metal < n; metal++) {
        // Metal needed = (required per alloy * alloys) - existing stock
        const needed = composition[machine][metal] * mid - stock[metal];

        // If we need more than we have, calculate purchase cost
        if (needed > 0) {
          totalCost += needed * cost[metal];
        }

        // Early exit if already over budget
        if (totalCost > budget) {
          overBudget = true;
          break;
        }
      }

      // Binary search decision
      if (!overBudget && totalCost <= budget) {
        left = mid; // We can produce at least 'mid' alloys
      } else {
        right = mid - 1; // Too expensive, reduce target
      }
    }

    // Update global maximum
    maxAlloys = Math.max(maxAlloys, left);
  }

  return maxAlloys;
}
```

```java
// Time: O(k * n * log(upper_bound)) where upper_bound ~ 2*10^8
// Space: O(1) - only using constant extra space
class Solution {
    public int maxNumberOfAlloys(int n, int k, int budget, List<List<Integer>> composition,
                                 List<Integer> stock, List<Integer> cost) {
        /**
         * Calculate maximum number of alloys any single machine can produce.
         *
         * @param n: number of metal types
         * @param k: number of machines
         * @param budget: available budget for purchasing metals
         * @param composition: k x n matrix of metal requirements per alloy
         * @param stock: available stock of each metal
         * @param cost: price per unit of each metal
         * @return Maximum alloys any machine can produce
         */
        int maxAlloys = 0;

        // Find maximum stock for upper bound calculation
        int maxStock = 0;
        for (int s : stock) {
            maxStock = Math.max(maxStock, s);
        }

        // Try each machine to find which can produce the most
        for (int machine = 0; machine < k; machine++) {
            // Binary search for maximum alloys this machine can produce
            long left = 0;
            long right = budget + maxStock + 1L;  // Use long to avoid overflow

            while (left < right) {
                // Use +1 and floor division to avoid infinite loop
                long mid = (left + right + 1) / 2;

                // Calculate total cost to produce 'mid' alloys
                long totalCost = 0;
                boolean overBudget = false;

                for (int metal = 0; metal < n; metal++) {
                    // Metal needed = (required per alloy * alloys) - existing stock
                    long needed = (long) composition.get(machine).get(metal) * mid - stock.get(metal);

                    // If we need more than we have, calculate purchase cost
                    if (needed > 0) {
                        totalCost += needed * cost.get(metal);
                    }

                    // Early exit if already over budget
                    if (totalCost > budget) {
                        overBudget = true;
                        break;
                    }
                }

                // Binary search decision
                if (!overBudget && totalCost <= budget) {
                    left = mid;  // We can produce at least 'mid' alloys
                } else {
                    right = mid - 1;  // Too expensive, reduce target
                }
            }

            // Update global maximum
            maxAlloys = Math.max(maxAlloys, (int) left);
        }

        return maxAlloys;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(k × n × log M)**

- `k`: Number of machines (outer loop)
- `n`: Number of metal types (inner loop for cost calculation)
- `log M`: Binary search iterations, where M is the upper bound (~2×10⁸)
- The log M factor comes from binary search cutting the search space in half each time

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No additional data structures proportional to input size
- Input parameters are not counted toward space complexity

## Common Mistakes

1. **Integer overflow**: When calculating `needed = requirement × mid`, the product can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, no issue in Python).
2. **Infinite binary search loop**: Using `mid = (left + right) // 2` with `left = mid` can cause infinite loops. The solution is to use `mid = (left + right + 1) // 2` when searching the right half.

3. **Forgetting early exit**: Not breaking early when `totalCost > budget` wastes computation. Always exit the metal loop as soon as budget is exceeded.

4. **Incorrect upper bound**: Setting the upper bound too low (e.g., just `budget`) can miss valid solutions. A safe bound is `budget + max(stock)` since stock reduces the metals you need to buy.

## When You'll See This Pattern

This "binary search on answer" pattern appears whenever:

1. You need to find a maximum/minimum value
2. There's a monotonic relationship (if X works, then X-1 also works)
3. Checking feasibility for a given value is easier than finding the value directly

**Related LeetCode problems:**

1. **Capacity To Ship Packages Within D Days (LeetCode 1011)** - Binary search for minimum ship capacity that can ship all packages within D days.
2. **Koko Eating Bananas (LeetCode 875)** - Binary search for minimum eating speed to finish bananas within H hours.
3. **Split Array Largest Sum (LeetCode 410)** - Binary search for minimum largest sum when splitting array into m subarrays.

## Key Takeaways

1. **When you need to maximize/minimize something and checking feasibility is easy, consider binary search on the answer.** The monotonic property is crucial.

2. **Always handle integer overflow in binary search problems** when dealing with large numbers. Use 64-bit integers for intermediate calculations.

3. **The upper bound in binary search should be conservative** - better to overshoot slightly than to miss valid solutions. You can often derive it from problem constraints.

[Practice this problem on CodeJeet](/problem/maximum-number-of-alloys)
