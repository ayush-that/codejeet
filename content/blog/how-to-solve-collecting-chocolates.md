---
title: "How to Solve Collecting Chocolates — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Collecting Chocolates. Medium difficulty, 34.7% acceptance rate. Topics: Array, Enumeration."
date: "2030-03-10"
category: "dsa-patterns"
tags: ["collecting-chocolates", "array", "enumeration", "medium"]
---

# How to Solve Collecting Chocolates

You're given an array `nums` where each element represents the cost of collecting a chocolate of a unique type. The twist is that you can perform operations to "rotate" the chocolate types, potentially reducing collection costs. This problem is tricky because it combines cost minimization with circular array operations, requiring careful enumeration of all possible rotation strategies.

## Visual Walkthrough

Let's trace through a small example: `nums = [20, 1, 15]` with `x = 5` (cost to rotate).

**Understanding the operation**: When we rotate, each chocolate's type shifts to the next position, and we can collect any chocolate at its current type's cost OR at the cost of any type it has been before.

**Step-by-step for k = 0 rotations**:

- Type 0: Cost = min(20) = 20
- Type 1: Cost = min(1) = 1
- Type 2: Cost = min(15) = 15
- Total = 20 + 1 + 15 = 36

**For k = 1 rotation**:
First rotation costs 5. Now types have shifted:

- Type 0 was type 2 before: min(15, 20) = 15
- Type 1 was type 0 before: min(20, 1) = 1
- Type 2 was type 1 before: min(1, 15) = 1
- Total = 15 + 1 + 1 + 5 = 22

**For k = 2 rotations**:
Second rotation costs another 5. Types have shifted again:

- Type 0 was types 2,1 before: min(15, 20, 1) = 1
- Type 1 was types 0,2 before: min(20, 1, 15) = 1
- Type 2 was types 1,0 before: min(1, 15, 20) = 1
- Total = 1 + 1 + 1 + 10 = 13

The minimum is 13 with k = 2 rotations. This shows how rotating can reduce costs by letting us collect chocolates at their historical minimum prices.

## Brute Force Approach

A naive approach would be to simulate all possible rotation counts (0 to n-1) and for each:

1. Track the minimum cost seen for each chocolate type
2. Calculate total cost = sum of minimums + k × x
3. Keep the global minimum

The simulation for each k would require tracking n chocolates across k+1 positions, leading to O(n²) time complexity. For n up to 1000, this becomes 1,000,000 operations which might be acceptable, but we can do better by avoiding redundant calculations.

## Optimized Approach

The key insight is that for a chocolate at position i:

- After 0 rotations: it can be collected at cost nums[i]
- After 1 rotation: it can be collected at min(nums[i], nums[(i-1) mod n])
- After k rotations: it can be collected at min(nums[i], nums[(i-1) mod n], ..., nums[(i-k) mod n])

We can precompute for each chocolate the minimum cost achievable after each possible number of rotations using dynamic programming:

- `minCost[i][k]` = minimum cost to collect chocolate i after k rotations
- `minCost[i][k] = min(minCost[i][k-1], nums[(i-k) mod n])`

This gives us O(n²) preprocessing, then O(n) per k to calculate totals. But we can optimize further: instead of storing all minCost values, we can compute running minimums as we iterate through k values.

## Optimal Solution

The most efficient approach recognizes that for each chocolate at position i, as k increases, we're taking the minimum over a sliding window of the circular array. We can compute for each chocolate:

- Start with current minimum = nums[i]
- For each rotation count k, update minimum = min(minimum, nums[(i-k) mod n])
- Add this minimum to the total for that k

This gives us O(n²) time overall, which is optimal since we need to consider O(n) rotation counts and O(n) chocolates.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def minCost(nums, x):
    """
    Calculate minimum cost to collect all chocolates with rotation cost x.

    Args:
        nums: List of chocolate collection costs
        x: Cost to perform one rotation operation

    Returns:
        Minimum total cost to collect all chocolates
    """
    n = len(nums)
    # Initialize answer with a large value
    min_total = float('inf')

    # Try all possible numbers of rotations (0 to n-1)
    for k in range(n):
        total_cost = 0

        # For each chocolate position
        for i in range(n):
            # Minimum cost for chocolate at position i after k rotations
            # We look back k positions in the circular array
            min_cost = nums[i]

            # Check all historical positions this chocolate has been at
            for r in range(1, k + 1):
                # Circular index: (i - r) mod n
                historical_idx = (i - r) % n
                min_cost = min(min_cost, nums[historical_idx])

            # Add the minimum cost for this chocolate
            total_cost += min_cost

        # Add the rotation operations cost: k rotations * x cost per rotation
        total_cost += k * x

        # Update global minimum
        min_total = min(min_total, total_cost)

    return min_total
```

```javascript
// Time: O(n²) | Space: O(1)
/**
 * Calculate minimum cost to collect all chocolates with rotation cost x.
 *
 * @param {number[]} nums - Array of chocolate collection costs
 * @param {number} x - Cost to perform one rotation operation
 * @return {number} Minimum total cost to collect all chocolates
 */
function minCost(nums, x) {
  const n = nums.length;
  // Initialize answer with a large value
  let minTotal = Infinity;

  // Try all possible numbers of rotations (0 to n-1)
  for (let k = 0; k < n; k++) {
    let totalCost = 0;

    // For each chocolate position
    for (let i = 0; i < n; i++) {
      // Minimum cost for chocolate at position i after k rotations
      // Start with current cost
      let minCost = nums[i];

      // Check all historical positions this chocolate has been at
      for (let r = 1; r <= k; r++) {
        // Circular index: (i - r) mod n
        // Adding n before modulo handles negative indices
        const historicalIdx = (((i - r) % n) + n) % n;
        minCost = Math.min(minCost, nums[historicalIdx]);
      }

      // Add the minimum cost for this chocolate
      totalCost += minCost;
    }

    // Add the rotation operations cost: k rotations * x cost per rotation
    totalCost += k * x;

    // Update global minimum
    minTotal = Math.min(minTotal, totalCost);
  }

  return minTotal;
}
```

```java
// Time: O(n²) | Space: O(1)
class Solution {
    /**
     * Calculate minimum cost to collect all chocolates with rotation cost x.
     *
     * @param nums Array of chocolate collection costs
     * @param x Cost to perform one rotation operation
     * @return Minimum total cost to collect all chocolates
     */
    public long minCost(int[] nums, int x) {
        int n = nums.length;
        // Initialize answer with a large value
        long minTotal = Long.MAX_VALUE;

        // Try all possible numbers of rotations (0 to n-1)
        for (int k = 0; k < n; k++) {
            long totalCost = 0;

            // For each chocolate position
            for (int i = 0; i < n; i++) {
                // Minimum cost for chocolate at position i after k rotations
                // Start with current cost
                int minCost = nums[i];

                // Check all historical positions this chocolate has been at
                for (int r = 1; r <= k; r++) {
                    // Circular index: (i - r) mod n
                    // Adding n before modulo handles negative indices
                    int historicalIdx = ((i - r) % n + n) % n;
                    minCost = Math.min(minCost, nums[historicalIdx]);
                }

                // Add the minimum cost for this chocolate
                totalCost += minCost;
            }

            // Add the rotation operations cost: k rotations * x cost per rotation
            totalCost += (long)k * x;

            // Update global minimum
            minTotal = Math.min(minTotal, totalCost);
        }

        return minTotal;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²) where n is the length of nums. We have two nested loops: the outer loop runs n times (for k = 0 to n-1), and the inner loop runs n times (for each chocolate position). Within the inner loop, we have another loop that runs up to k times, but this doesn't change the overall O(n²) complexity since k ≤ n.

**Space Complexity**: O(1) extra space. We only use a few variables to track minimum costs and totals, regardless of input size. The input array itself is not counted toward space complexity.

## Common Mistakes

1. **Forgetting circular indexing**: When accessing `nums[(i-k) % n]`, candidates often forget to handle negative indices properly. In Python, `%` handles negatives correctly, but in Java/JavaScript, `(i - k) % n` can be negative. The fix: `((i - k) % n + n) % n`.

2. **Not considering all rotation counts**: Some candidates stop at k = n/2 or make incorrect assumptions about when to stop rotating. You must check k from 0 to n-1 inclusive, as sometimes more rotations yield better results (like in our example).

3. **Integer overflow with large n and x**: When n = 1000 and x = 10⁹, k × x can exceed 32-bit integer limits. Always use 64-bit integers (long in Java, BigInt in JavaScript if needed, Python handles arbitrarily large integers).

4. **Incorrect minimum calculation**: Some try to track global minimums instead of per-chocolate minimums. Each chocolate maintains its own historical minimum, not a shared one across all chocolates.

## When You'll See This Pattern

This problem combines **enumeration** with **circular array processing** and **sliding minimum** concepts. You'll see similar patterns in:

1. **Minimum Rotations to Equal Array** (LeetCode 189, 796) - Circular array manipulation
2. **Sliding Window Maximum/Minimum** (LeetCode 239) - Maintaining extremums over sliding windows
3. **Minimum Operations to Reduce Array** problems - Cost-benefit analysis of operations

The core technique of enumerating all possible operation counts and calculating optimal outcomes appears in many optimization problems where operations have both immediate costs and long-term benefits.

## Key Takeaways

1. **When operations have cumulative benefits**, enumerate all possible operation counts. The optimal solution often lies at some intermediate point, not necessarily at the extremes.

2. **Circular arrays require careful indexing**. Always test your modulo arithmetic with negative indices, as different languages handle this differently.

3. **Break complex operations into per-element analysis**. Instead of tracking the entire array state after each operation, analyze how each element's value evolves independently.

[Practice this problem on CodeJeet](/problem/collecting-chocolates)
