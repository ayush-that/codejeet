---
title: "How to Solve Minimum Cost to Equalize Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Equalize Array. Hard difficulty, 18.7% acceptance rate. Topics: Array, Greedy, Enumeration."
date: "2026-08-12"
category: "dsa-patterns"
tags: ["minimum-cost-to-equalize-array", "array", "greedy", "enumeration", "hard"]
---

# How to Solve Minimum Cost to Equalize Array

This problem asks us to find the minimum cost to make all elements in an array equal by performing two types of operations: incrementing a single element by 1 (cost1) or incrementing two different elements by 1 (cost2). The challenge lies in determining when to use the cheaper "two-element" operation versus the single-element operation, and what target value we should equalize all elements to.

What makes this problem interesting is that the optimal target isn't necessarily the maximum element or any existing element in the array. We need to consider targets up to a certain bound, and the cost calculation involves careful pairing of elements to maximize the use of the cheaper cost2 operation.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 5, 3]`, `cost1 = 2`, `cost2 = 3`.

**Step 1: Understanding the operations**

- Operation 1: Pick one index, increment by 1, cost = cost1 = 2
- Operation 2: Pick two different indices, increment both by 1, cost = cost2 = 3

Notice that operation 2 is more efficient when we need to increment two elements - it costs 3 instead of 2×2=4.

**Step 2: Finding the maximum element**
The maximum element in our array is 5. Let's first consider equalizing to this value:

- Element 1 needs +4 increments
- Element 3 needs +2 increments
- Element 5 needs +0 increments

Total increments needed = 4 + 2 + 0 = 6

**Step 3: Calculating cost for target = 5**
We want to use as many cost2 operations as possible. Think of it this way: each cost2 operation handles 2 increments, so we can pair up increments. The maximum number of cost2 operations we can use is limited by:

1. The total number of increments (6)
2. The fact that we can't use cost2 if we only have one element left to increment

Let `total` = total increments needed = 6
Let `max_diff` = maximum increment needed by any element = 4

If `max_diff > total - max_diff`, we can't pair all increments using cost2 because the largest element needs too many increments. In this case:

- `max_diff = 4`, `total - max_diff = 2`
- Since 4 > 2, we have `excess = max_diff - (total - max_diff) = 4 - 2 = 2` increments that must use cost1
- The remaining `total - excess = 6 - 2 = 4` increments can be paired into 2 cost2 operations

Cost = `excess × cost1 + ((total - excess) // 2) × cost2`
= `2 × 2 + (4 ÷ 2) × 3 = 4 + 6 = 10`

**Step 4: Trying a higher target**
What if we equalize to 6 instead of 5?

- Element 1 needs +5 increments
- Element 3 needs +3 increments
- Element 5 needs +1 increment

Total = 5 + 3 + 1 = 9
max_diff = 5

Since 5 > (9 - 5 = 4), excess = 5 - 4 = 1
Cost = 1×2 + ((9-1)÷2)×3 = 2 + 12 = 14 (worse than 10)

**Step 5: The key insight**
The optimal target might be higher than the maximum element because:

1. Adding more increments gives us more opportunities to pair elements
2. But each additional increment adds cost1 to every element (or cost2 if paired)

We need to check targets from max(nums) up to some reasonable upper bound.

## Brute Force Approach

A naive approach would be to try every possible target value and calculate the cost for each. The problem is: what's the upper bound? We could keep increasing the target indefinitely, but costs would keep increasing.

A brute force candidate might:

1. Find the maximum element M
2. Try targets from M to some arbitrary large number (like M + 1000)
3. For each target, calculate the cost as shown above
4. Return the minimum cost

The issue is determining when to stop. If cost2 is much cheaper than cost1, we might need to go very high to find the minimum. Without a proper bound, this approach either misses the optimal solution or runs indefinitely.

## Optimized Approach

The key insight is that we only need to check targets up to `2 * max(nums)`. Here's why:

Let M = max(nums). Consider any target T > 2M:

- The element that was originally M needs (T - M) increments
- The total increments needed is at least n × (T - M) where n is array length
- If we instead choose target = 2M:
  - The element that was M needs M increments
  - Total increments is less than n × M
- Since T > 2M, (T - M) > M, so target T requires strictly more increments than target 2M

Thus, the optimal target must be ≤ 2M. We can prove this formally, but intuitively: going beyond 2M just adds unnecessary increments without benefit.

**Step-by-step reasoning:**

1. Find the maximum element M and minimum element m
2. Calculate base cost if we equalize to M
3. For targets from M+1 to 2M:
   - Calculate total increments needed
   - Calculate max_diff (largest increment needed)
   - If max_diff > total - max_diff:
     - excess = 2×max_diff - total
     - cost = excess × cost1 + (total - excess) ÷ 2 × cost2
   - Else:
     - If total is even: all increments can be paired, cost = (total ÷ 2) × cost2
     - If total is odd: one increment must use cost1, cost = cost1 + ((total-1) ÷ 2) × cost2
4. Track minimum cost across all targets

**Special case:** If cost1 × 2 ≤ cost2, it's never beneficial to use cost2, so we just use cost1 for all increments to reach the maximum element.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + M) where M = max(nums), Space: O(1)
def minCostToEqualizeArray(nums, cost1, cost2):
    MOD = 10**9 + 7
    n = len(nums)

    # Find maximum and minimum elements
    max_val = max(nums)
    min_val = min(nums)

    # Special case: if cost1 * 2 <= cost2, always use cost1
    # Because it's cheaper to increment individually than in pairs
    if cost1 * 2 <= cost2:
        total = sum(max_val - x for x in nums)
        return (total * cost1) % MOD

    # Calculate increments needed to reach max_val
    diffs = [max_val - x for x in nums]
    total = sum(diffs)
    max_diff = max(diffs)

    # Helper function to calculate cost for a given total and max_diff
    def calculate_cost(total, max_diff):
        if max_diff > total - max_diff:
            # Can't pair all increments, some must use cost1
            excess = 2 * max_diff - total
            return excess * cost1 + (total - excess) // 2 * cost2
        else:
            # Can pair all increments
            if total % 2 == 0:
                return total // 2 * cost2
            else:
                return cost1 + (total - 1) // 2 * cost2

    # Initial cost for target = max_val
    min_cost = calculate_cost(total, max_diff)

    # Try targets from max_val + 1 to 2 * max_val
    # We need to consider up to 2*max_val based on the proof
    for target in range(max_val + 1, 2 * max_val + 1):
        # Update total and max_diff for new target
        # Each element needs one more increment than before
        total += n
        max_diff += 1

        cost = calculate_cost(total, max_diff)
        min_cost = min(min_cost, cost)

    return min_cost % MOD
```

```javascript
// Time: O(n + M) where M = max(nums), Space: O(1)
function minCostToEqualizeArray(nums, cost1, cost2) {
  const MOD = 10 ** 9 + 7;
  const n = nums.length;

  // Find maximum and minimum elements
  let maxVal = Math.max(...nums);
  let minVal = Math.min(...nums);

  // Special case: if cost1 * 2 <= cost2, always use cost1
  if (cost1 * 2 <= cost2) {
    let total = 0;
    for (let num of nums) {
      total += maxVal - num;
    }
    return (total * cost1) % MOD;
  }

  // Calculate increments needed to reach maxVal
  let diffs = nums.map((x) => maxVal - x);
  let total = diffs.reduce((sum, val) => sum + val, 0);
  let maxDiff = Math.max(...diffs);

  // Helper function to calculate cost
  function calculateCost(total, maxDiff) {
    if (maxDiff > total - maxDiff) {
      // Can't pair all increments
      const excess = 2 * maxDiff - total;
      return excess * cost1 + Math.floor((total - excess) / 2) * cost2;
    } else {
      // Can pair all increments
      if (total % 2 === 0) {
        return Math.floor(total / 2) * cost2;
      } else {
        return cost1 + Math.floor((total - 1) / 2) * cost2;
      }
    }
  }

  // Initial cost for target = maxVal
  let minCost = calculateCost(total, maxDiff);

  // Try targets from maxVal + 1 to 2 * maxVal
  for (let target = maxVal + 1; target <= 2 * maxVal; target++) {
    total += n;
    maxDiff += 1;

    const cost = calculateCost(total, maxDiff);
    minCost = Math.min(minCost, cost);
  }

  return minCost % MOD;
}
```

```java
// Time: O(n + M) where M = max(nums), Space: O(1)
class Solution {
    public int minCostToEqualizeArray(int[] nums, int cost1, int cost2) {
        final int MOD = 1_000_000_007;
        int n = nums.length;

        // Find maximum and minimum elements
        int maxVal = nums[0];
        int minVal = nums[0];
        for (int num : nums) {
            maxVal = Math.max(maxVal, num);
            minVal = Math.min(minVal, num);
        }

        // Special case: if cost1 * 2 <= cost2, always use cost1
        if (cost1 * 2 <= cost2) {
            long total = 0;
            for (int num : nums) {
                total += maxVal - num;
            }
            return (int)((total * cost1) % MOD);
        }

        // Calculate increments needed to reach maxVal
        long total = 0;
        int maxDiff = 0;
        for (int num : nums) {
            int diff = maxVal - num;
            total += diff;
            maxDiff = Math.max(maxDiff, diff);
        }

        // Helper function to calculate cost
        long calculateCost(long total, long maxDiff) {
            if (maxDiff > total - maxDiff) {
                // Can't pair all increments
                long excess = 2 * maxDiff - total;
                return excess * cost1 + (total - excess) / 2 * cost2;
            } else {
                // Can pair all increments
                if (total % 2 == 0) {
                    return total / 2 * cost2;
                } else {
                    return cost1 + (total - 1) / 2 * cost2;
                }
            }
        }

        // Initial cost for target = maxVal
        long minCost = calculateCost(total, maxDiff);

        // Try targets from maxVal + 1 to 2 * maxVal
        for (int target = maxVal + 1; target <= 2 * maxVal; target++) {
            total += n;
            maxDiff += 1;

            long cost = calculateCost(total, maxDiff);
            minCost = Math.min(minCost, cost);
        }

        return (int)(minCost % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + M) where n is the length of nums and M = max(nums)

- Finding max/min: O(n)
- Calculating initial diffs: O(n)
- Looping from max_val to 2×max_val: O(M) iterations
- Each iteration does O(1) work

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- In Python/JavaScript we create a diffs array (O(n)), but this can be avoided by calculating during the initial pass

The O(M) term might seem concerning if M is large, but note that in the worst case M could be up to 10^6 (based on typical constraints), making this approach feasible. There's a more advanced O(n log n) solution using mathematical optimization, but this O(n + M) solution is more intuitive and acceptable for interview settings.

## Common Mistakes

1. **Not handling the cost1×2 ≤ cost2 special case**: When individual increments are cheaper or equal to half the pair increment cost, we should never use the pair operation. Missing this leads to incorrect higher costs.

2. **Incorrect excess calculation**: The formula `excess = 2×max_diff - total` is non-obvious. A common mistake is `excess = max_diff - (total - max_diff)`, which is correct mathematically but needs to be multiplied by cost1 in the cost calculation.

3. **Wrong upper bound for targets**: Some candidates try targets up to max_val + total or some other arbitrary bound. The proof that we only need to check up to 2×max_val is crucial for efficiency.

4. **Forgetting modulo operations**: The problem requires returning result modulo 10^9+7. Costs can be large (up to 10^6 operations × 10^6 cost = 10^12), so we need to apply modulo during calculations to avoid integer overflow.

5. **Not considering odd/even totals when all increments can be paired**: When max_diff ≤ total - max_diff, if total is odd, we still need one cost1 operation. This edge case is easy to miss.

## When You'll See This Pattern

This problem combines greedy pairing with target enumeration, a pattern seen in several optimization problems:

1. **Minimum Moves to Equal Array Elements II** (LeetCode 462): Find the minimum moves to make all array elements equal, where a move is incrementing or decrementing an element by 1. The optimal target is the median.

2. **Minimum Cost to Move Chips to The Same Position** (LeetCode 1217): Similar pairing concept where moving two chips costs less than moving one.

3. **Maximum Performance of a Team** (LeetCode 1383): Combines sorting with greedy selection, similar to how we optimize operation selection here.

The core pattern is: when you have operations with different efficiencies for handling multiple elements, you often need to:

1. Determine when to use each operation
2. Find the optimal target through bounded enumeration or mathematical derivation
3. Use greedy pairing to maximize efficient operation usage

## Key Takeaways

1. **Operation efficiency analysis**: When you have operations with different costs per element (like cost1 per element vs cost2 for 2 elements), analyze the break-even point. Here, cost2 is better when cost1×2 > cost2.

2. **Bounded enumeration**: Instead of trying all possible targets, use mathematical reasoning to bound the search space. Proving that the optimal target ≤ 2×max(nums) is the key insight.

3. **Greedy pairing strategy**: When you can perform operations on pairs, always try to pair elements to use the more efficient operation. The limitation is when one element needs too many increments compared to others.

Remember: interviewers care more about your reasoning process than just the final code. Walk through the visual example, explain why the bound is 2×max(nums), and discuss the special cases before jumping to implementation.

[Practice this problem on CodeJeet](/problem/minimum-cost-to-equalize-array)
