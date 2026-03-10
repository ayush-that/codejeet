---
title: "How to Solve Minimum Operations to Make Array Equal II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make Array Equal II. Medium difficulty, 33.0% acceptance rate. Topics: Array, Math, Greedy."
date: "2029-06-15"
category: "dsa-patterns"
tags: ["minimum-operations-to-make-array-equal-ii", "array", "math", "greedy", "medium"]
---

# How to Solve Minimum Operations to Make Array Equal II

You’re given two arrays of equal length and an integer `k`. You can only adjust values in the first array by adding `k` to one element and subtracting `k` from another in a single operation. The goal is to make `nums1` equal to `nums2` using the minimum number of operations, or determine if it’s impossible. What makes this tricky is that operations are coupled—you can’t just independently adjust each element—and the value of `k` imposes divisibility constraints that determine feasibility.

## Visual Walkthrough

Let’s walk through an example to build intuition:

**Example:**  
`nums1 = [4, 3, 1, 4]`  
`nums2 = [1, 3, 5, 1]`  
`k = 3`

First, we calculate the difference for each position:  
`diff = nums1[i] - nums2[i] = [3, 0, -4, 3]`

We need to make all differences equal to 0. Each operation adds `k` to one element (decreasing its difference by `k`) and subtracts `k` from another (increasing its difference by `k`). Notice that:

- The total sum of differences must be 0 for a solution to exist (since operations preserve the sum)
- Each individual difference must be divisible by `k` (since we can only change values by multiples of `k`)

Check feasibility:

1. Sum of differences: `3 + 0 + (-4) + 3 = 2` → Not zero! This means it's impossible right away.
2. Even if the sum were 0, we'd also need each difference divisible by `k=3`:  
   `3 % 3 = 0` ✓  
   `0 % 3 = 0` ✓  
   `-4 % 3 = -1` ✗ (not divisible)  
   So this would also fail.

Let's try a solvable example:  
`nums1 = [2, 8, 5]`  
`nums2 = [5, 2, 8]`  
`k = 3`

Differences: `[-3, 6, -3]`  
Sum: `-3 + 6 + (-3) = 0` ✓  
Divisibility: all divisible by 3 ✓

Now we need the minimum operations. Think of positive differences as "surplus" (need to give away `k` units) and negative differences as "deficit" (need to receive `k` units). Each operation transfers `k` units from a surplus position to a deficit position.

Our differences: `[-3, 6, -3]`  
Divide by `k=3`: `[-1, 2, -1]`  
We have total surplus = 2, total deficit = 2 (in absolute terms).

Each operation fixes one surplus unit and one deficit unit. So minimum operations = max(total surplus, total deficit) / 1 = 2 operations.

We can verify:  
Operation 1: Transfer from index 1 (surplus 2) to index 0 (deficit 1)  
Operation 2: Transfer from index 1 (surplus 1) to index 2 (deficit 1)

## Brute Force Approach

A naive approach might try to simulate all possible sequences of operations using BFS or DFS, but this explodes combinatorially. Even for small arrays, the state space is enormous because at each step you can choose any pair of indices.

Another brute force idea: try to match each element independently by finding complementary adjustments elsewhere. This leads to trying all permutations of pairings between surplus and deficit positions, which is O(n!) and completely infeasible.

The key realization is that we don't need to track which specific indices get paired—we only need the total amount of surplus and deficit, since `k` units are transferred in each operation regardless of which indices are involved.

## Optimized Approach

The optimal solution uses a greedy mathematical approach:

1. **Check basic feasibility:**
   - If `k == 0`, the arrays must already be equal
   - Each difference `(nums1[i] - nums2[i])` must be divisible by `k`
   - The sum of all differences must be 0 (operations conserve total sum)

2. **Calculate adjusted differences:**
   - Divide each difference by `k` to get how many "transfer units" each position needs
   - Positive values = surplus units to give away
   - Negative values = deficit units to receive

3. **Count operations:**
   - Each operation transfers 1 unit from surplus to deficit
   - Minimum operations = total surplus (which equals total deficit in absolute value)
   - We can simply sum all positive adjusted differences

Why does this work? Each operation fixes exactly one surplus unit and one deficit unit. We don't care which specific indices are paired because all transfers are equivalent when measured in units of `k`. The greedy approach of always transferring from any surplus to any deficit is optimal.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minOperations(self, nums1, nums2, k):
    """
    Calculate minimum operations to make nums1 equal to nums2.
    Each operation adds k to one element and subtracts k from another.
    """
    n = len(nums1)

    # Edge case: if k is 0, arrays must already be identical
    if k == 0:
        return 0 if nums1 == nums2 else -1

    total_surplus = 0  # Sum of positive differences (in units of k)
    total_diff = 0     # Sum of all differences (must be 0 for solution to exist)

    for i in range(n):
        diff = nums1[i] - nums2[i]

        # Check divisibility: each difference must be multiple of k
        if diff % k != 0:
            return -1

        # Convert to number of k-unit transfers needed
        transfers = diff // k

        # Update totals
        total_diff += transfers
        if transfers > 0:
            total_surplus += transfers

    # Total sum of adjusted differences must be 0
    # (positive and negative transfers must balance)
    if total_diff != 0:
        return -1

    # Each operation fixes one positive transfer unit
    return total_surplus
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k
 * @return {number}
 */
var minOperations = function (nums1, nums2, k) {
  const n = nums1.length;

  // Edge case: k === 0 means arrays must already match
  if (k === 0) {
    for (let i = 0; i < n; i++) {
      if (nums1[i] !== nums2[i]) return -1;
    }
    return 0;
  }

  let totalSurplus = 0; // Sum of positive transfer units
  let totalDiff = 0; // Sum of all transfer units (must be 0)

  for (let i = 0; i < n; i++) {
    const diff = nums1[i] - nums2[i];

    // Each difference must be divisible by k
    if (diff % k !== 0) {
      return -1;
    }

    // Convert to number of k-unit transfers
    const transfers = diff / k;

    totalDiff += transfers;
    if (transfers > 0) {
      totalSurplus += transfers;
    }
  }

  // Positive and negative transfers must balance
  if (totalDiff !== 0) {
    return -1;
  }

  // Each operation handles one positive transfer unit
  return totalSurplus;
};
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public long minOperations(int[] nums1, int[] nums2, int k) {
        int n = nums1.length;

        // Edge case: k == 0 requires arrays to be identical
        if (k == 0) {
            for (int i = 0; i < n; i++) {
                if (nums1[i] != nums2[i]) return -1;
            }
            return 0;
        }

        long totalSurplus = 0;  // Use long to avoid overflow
        long totalDiff = 0;

        for (int i = 0; i < n; i++) {
            long diff = (long) nums1[i] - nums2[i];

            // Check divisibility
            if (diff % k != 0) {
                return -1;
            }

            long transfers = diff / k;
            totalDiff += transfers;
            if (transfers > 0) {
                totalSurplus += transfers;
            }
        }

        // Sum of all transfers must be zero
        if (totalDiff != 0) {
            return -1;
        }

        return totalSurplus;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We make a single pass through the arrays to compute differences and check conditions. Each iteration does constant work (arithmetic operations and comparisons).

**Space Complexity:** O(1)  
We only use a few variables to track totals, regardless of input size. No additional data structures are needed.

## Common Mistakes

1. **Forgetting the k = 0 edge case:** When k = 0, no operations are possible, so the arrays must already be equal. Many candidates return 0 without checking, which fails for cases like `nums1 = [1,2], nums2 = [1,3], k = 0`.

2. **Not checking divisibility properly:** The condition `diff % k != 0` must be checked for each element. Some candidates only check `(nums1[i] - nums2[i]) % k` but forget that negative differences need special handling in some languages (Python handles it correctly, but Java/JavaScript require careful checking).

3. **Integer overflow:** When n is large (up to 10^5) and values are large (up to 10^9), the sum of transfers can exceed 32-bit integer range. Always use 64-bit integers (long in Java, BigInt in JavaScript if needed, Python handles arbitrarily large integers).

4. **Confusing surplus count with operation count:** The minimum operations equals the total surplus (positive transfers), not half of it. Each operation transfers one unit from surplus to deficit, so if total surplus = S, we need exactly S operations.

## When You'll See This Pattern

This problem uses a **balance counting** pattern combined with **divisibility constraints**. You'll see similar patterns in:

1. **Minimum Operations to Make Array Equal** (LeetCode 1551): Similar concept of balancing values with fixed increments, though operations are independent rather than coupled.

2. **Minimum Number of Operations to Make Arrays Similar** (LeetCode 2449): Almost identical structure but with parity constraints instead of divisibility by k.

3. **Minimum Moves to Equal Array Elements II** (LeetCode 462): Uses median finding to minimize total absolute differences—different approach but similar "make arrays equal" goal.

The core pattern: when operations transfer fixed amounts between elements, look for conservation laws (total sum preserved) and divisibility requirements, then count imbalances.

## Key Takeaways

1. **Look for conserved quantities:** In transfer operations, the total sum is often preserved. This gives you a quick feasibility check (sum of differences must be 0).

2. **Normalize by the operation increment:** Divide differences by k to work in "operation units"—this simplifies counting and reveals the greedy pairing strategy.

3. **Balance counting beats explicit pairing:** When transfers are uniform, you don't need to track specific pairings—just count total surplus/deficit. This reduces O(n²) pairing problems to O(n) counting problems.

Related problems: [Minimum Operations to Make Array Equal](/problem/minimum-operations-to-make-array-equal), [Minimum Number of Operations to Make Arrays Similar](/problem/minimum-number-of-operations-to-make-arrays-similar)
