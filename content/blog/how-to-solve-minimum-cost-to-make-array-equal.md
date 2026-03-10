---
title: "How to Solve Minimum Cost to Make Array Equal — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Make Array Equal. Hard difficulty, 46.7% acceptance rate. Topics: Array, Binary Search, Greedy, Sorting, Prefix Sum."
date: "2027-12-03"
category: "dsa-patterns"
tags: ["minimum-cost-to-make-array-equal", "array", "binary-search", "greedy", "hard"]
---

# How to Solve Minimum Cost to Make Array Equal

You're given two arrays `nums` and `cost` of length `n`, where `cost[i]` represents the price to change `nums[i]` by 1. Your goal is to find the minimum total cost to make all elements in `nums` equal by repeatedly incrementing or decrementing elements. What makes this problem interesting is that each element has a different "weight" (cost per unit change), so the optimal target value isn't simply the median or mean—it's a weighted balance point that minimizes total weighted distance.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 3, 5]`, `cost = [2, 1, 3]`.

We need to find a target value `T` where all elements will end up. For any candidate `T`, the total cost is:

```
Total cost = Σ cost[i] * |nums[i] - T|
```

Let's calculate costs for different possible targets:

- **T = 1**: Cost = 2×|1-1| + 1×|3-1| + 3×|5-1| = 0 + 2 + 12 = 14
- **T = 2**: Cost = 2×|1-2| + 1×|3-2| + 3×|5-2| = 2 + 1 + 9 = 12
- **T = 3**: Cost = 2×|1-3| + 1×|3-3| + 3×|5-3| = 4 + 0 + 6 = 10
- **T = 4**: Cost = 2×|1-4| + 1×|3-4| + 3×|5-4| = 6 + 1 + 3 = 10
- **T = 5**: Cost = 2×|1-5| + 1×|3-5| + 3×|5-5| = 8 + 2 + 0 = 10

Wait, that's interesting—we get the same cost for T=3, T=4, and T=5? Let me recalculate T=4 carefully:

- Element 1: |1-4| = 3, cost = 2×3 = 6
- Element 3: |3-4| = 1, cost = 1×1 = 1
- Element 5: |5-4| = 1, cost = 3×1 = 3
  Total = 6 + 1 + 3 = 10 ✓

And T=5:

- Element 1: |1-5| = 4, cost = 2×4 = 8
- Element 3: |3-5| = 2, cost = 1×2 = 2
- Element 5: |5-5| = 0, cost = 3×0 = 0
  Total = 8 + 2 + 0 = 10 ✓

Actually, the minimum appears to be 10 at T=3, 4, or 5. But is that really the minimum? Let's check T=3.5:

- Element 1: |1-3.5| = 2.5, cost = 2×2.5 = 5
- Element 3: |3-3.5| = 0.5, cost = 1×0.5 = 0.5
- Element 5: |5-3.5| = 1.5, cost = 3×1.5 = 4.5
  Total = 5 + 0.5 + 4.5 = 10 ✓

So the cost function appears to be flat between 3 and 5. The key insight: the total cost as a function of T is a **convex piecewise linear function**—it decreases, reaches a minimum plateau, then increases. Our job is to find where this minimum occurs.

## Brute Force Approach

A naive approach would be to try every possible target value between the minimum and maximum of `nums`. For each candidate target, we'd calculate the total cost by iterating through all elements:

```
min_val = min(nums)
max_val = max(nums)
min_cost = infinity

for target in range(min_val, max_val + 1):
    total = 0
    for i in range(n):
        total += cost[i] * abs(nums[i] - target)
    min_cost = min(min_cost, total)
```

**Why this fails:** If `nums` ranges from 1 to 10^6 (as constraints allow), we'd have up to 1 million targets to check. For each target, we iterate through all n elements (up to 10^5). That's 10^11 operations—far too slow. We need a smarter way to find the optimal target without checking every possible value.

## Optimized Approach

The key insight comes from analyzing the cost function mathematically. Let's define:

```
f(T) = Σ cost[i] * |nums[i] - T|
```

This is a weighted sum of absolute distances. For such functions:

1. **f(T) is convex** (U-shaped or V-shaped)
2. **The minimum occurs where the derivative changes sign** from negative to positive

But we're dealing with discrete values, so let's think about the "weighted median" concept. If we sort the elements by their `nums` values and look at cumulative costs:

Imagine we start with T at the minimum value and move it to the right:

- For elements to the left of T, distance increases → cost increases
- For elements to the right of T, distance decreases → cost decreases

The net change in cost when moving T by 1 is:

```
Δ = (total cost of elements left of T) - (total cost of elements right of T)
```

When Δ changes from negative to positive, we've found the minimum. In other words:

- If left cumulative cost < right cumulative cost, moving right reduces total cost
- If left cumulative cost > right cumulative cost, moving right increases total cost
- The minimum occurs when these are as balanced as possible

This leads to the **weighted median** solution: sort pairs `(nums[i], cost[i])` by `nums[i]`, then find where cumulative cost reaches at least half of total cost.

## Optimal Solution

We'll implement the weighted median approach:

1. Pair each `nums[i]` with its `cost[i]` and sort by `nums[i]`
2. Calculate total cost sum
3. Find the first element where cumulative cost reaches at least half of total
4. Use that element's `nums` value as our target
5. Calculate the total cost for that target

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(n) for storing pairs
def minCost(nums, cost):
    n = len(nums)

    # Step 1: Create pairs of (num, cost) and sort by num
    pairs = [(nums[i], cost[i]) for i in range(n)]
    pairs.sort(key=lambda x: x[0])  # Sort by nums value

    # Step 2: Calculate total cost
    total_cost = sum(cost)

    # Step 3: Find weighted median
    cumulative = 0
    target = 0

    for num, c in pairs:
        cumulative += c
        # When cumulative cost reaches at least half of total,
        # this num is our weighted median
        if cumulative * 2 >= total_cost:
            target = num
            break

    # Step 4: Calculate total cost for this target
    result = 0
    for i in range(n):
        result += cost[i] * abs(nums[i] - target)

    return result
```

```javascript
// Time: O(n log n) for sorting | Space: O(n) for storing pairs
function minCost(nums, cost) {
  const n = nums.length;

  // Step 1: Create pairs of [num, cost] and sort by num
  const pairs = [];
  for (let i = 0; i < n; i++) {
    pairs.push([nums[i], cost[i]]);
  }
  pairs.sort((a, b) => a[0] - b[0]); // Sort by nums value

  // Step 2: Calculate total cost
  let totalCost = 0;
  for (let i = 0; i < n; i++) {
    totalCost += cost[i];
  }

  // Step 3: Find weighted median
  let cumulative = 0;
  let target = 0;

  for (const [num, c] of pairs) {
    cumulative += c;
    // When cumulative cost reaches at least half of total,
    // this num is our weighted median
    if (cumulative * 2 >= totalCost) {
      target = num;
      break;
    }
  }

  // Step 4: Calculate total cost for this target
  let result = 0;
  for (let i = 0; i < n; i++) {
    result += cost[i] * Math.abs(nums[i] - target);
  }

  return result;
}
```

```java
// Time: O(n log n) for sorting | Space: O(n) for storing pairs
import java.util.*;

class Solution {
    public long minCost(int[] nums, int[] cost) {
        int n = nums.length;

        // Step 1: Create pairs and sort by nums value
        int[][] pairs = new int[n][2];
        for (int i = 0; i < n; i++) {
            pairs[i][0] = nums[i];
            pairs[i][1] = cost[i];
        }

        // Sort by the first element (nums value)
        Arrays.sort(pairs, (a, b) -> Integer.compare(a[0], b[0]));

        // Step 2: Calculate total cost
        long totalCost = 0;
        for (int c : cost) {
            totalCost += c;
        }

        // Step 3: Find weighted median
        long cumulative = 0;
        long target = 0;

        for (int[] pair : pairs) {
            int num = pair[0];
            int c = pair[1];
            cumulative += c;

            // When cumulative cost reaches at least half of total,
            // this num is our weighted median
            if (cumulative * 2 >= totalCost) {
                target = num;
                break;
            }
        }

        // Step 4: Calculate total cost for this target
        long result = 0;
        for (int i = 0; i < n; i++) {
            result += (long) cost[i] * Math.abs(nums[i] - target);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the pairs takes O(n log n) time
- Calculating total cost takes O(n)
- Finding the weighted median takes O(n)
- Calculating the final result takes O(n)
- Dominated by the sorting step

**Space Complexity:** O(n)

- We store `n` pairs of (num, cost)
- Sorting may require O(log n) to O(n) additional space depending on the algorithm, but we count the pairs array as O(n)

## Common Mistakes

1. **Using arithmetic mean instead of weighted median:** Candidates might try to use the average of `nums`, but this doesn't account for different costs. The optimal target is the weighted median, not the mean.

2. **Forgetting about integer overflow:** When `n` and values are large (up to 10^5 and 10^6), the total cost can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C).

3. **Incorrect cumulative check:** The condition `cumulative * 2 >= totalCost` finds the first element where cumulative cost reaches at least half. Some candidates use `> totalCost/2`, which fails for odd totals due to integer division.

4. **Not handling multiple elements with same value:** If multiple `nums` have the same value, we should group their costs. Our solution handles this correctly because we sort and accumulate—elements with the same value will be grouped together naturally.

## When You'll See This Pattern

This weighted median pattern appears in optimization problems where you need to minimize the sum of weighted distances:

1. **Minimum Moves to Equal Array Elements II (LeetCode 462):** Similar but without weights (all costs equal to 1). The solution is simply the median of the array.

2. **Best Meeting Point (LeetCode 296):** Find a meeting point on a grid that minimizes total Manhattan distance. The x and y coordinates can be optimized independently using medians.

3. **Minimum Total Distance Traveled (LeetCode 2463):** Robots and factories problem that extends this concept with additional constraints.

The core pattern: when minimizing Σ w_i \* |x_i - T|, the optimal T is the weighted median of x_i with weights w_i.

## Key Takeaways

1. **Weighted median solves weighted absolute distance minimization:** When costs are linear in distance (cost = weight × distance), the optimal target is the weighted median, not the mean.

2. **Convex functions have single minima:** The cost function f(T) = Σ w_i|xi - T| is convex, so we can find the minimum by finding where the "balance point" is.

3. **Sort and accumulate to find weighted median:** Sort elements by value, accumulate weights, and find where cumulative weight reaches half of total weight.

**Related problems:** [Minimum Moves to Equal Array Elements II](/problem/minimum-moves-to-equal-array-elements-ii), [Maximum Product of the Length of Two Palindromic Substrings](/problem/maximum-product-of-the-length-of-two-palindromic-substrings), [Minimum Amount of Time to Fill Cups](/problem/minimum-amount-of-time-to-fill-cups)
