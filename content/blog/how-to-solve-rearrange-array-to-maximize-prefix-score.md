---
title: "How to Solve Rearrange Array to Maximize Prefix Score — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rearrange Array to Maximize Prefix Score. Medium difficulty, 42.5% acceptance rate. Topics: Array, Greedy, Sorting, Prefix Sum."
date: "2028-11-30"
category: "dsa-patterns"
tags: ["rearrange-array-to-maximize-prefix-score", "array", "greedy", "sorting", "medium"]
---

# How to Solve Rearrange Array to Maximize Prefix Score

You’re given an array of integers and can rearrange them in any order. The _prefix score_ is the number of positive prefix sums after rearrangement. Your goal is to rearrange the array to maximize this count. The challenge lies in recognizing that the order of elements directly determines how many prefixes stay positive, and a greedy sorting strategy yields the optimal arrangement.

## Visual Walkthrough

Let’s walk through an example: `nums = [3, -2, 1, -1, 4]`.

If we keep the original order, the prefix sums are:

- Index 0: 3 → positive (count = 1)
- Index 1: 3 + (-2) = 1 → positive (count = 2)
- Index 2: 1 + 1 = 2 → positive (count = 3)
- Index 3: 2 + (-1) = 1 → positive (count = 4)
- Index 4: 1 + 4 = 5 → positive (count = 5)

All prefixes are positive here, but that’s not always the case. What if we had `[-5, 4, -2, 3]`?  
Original order gives prefix sums: -5 (negative), -1 (negative), -3 (negative), 0 (not positive). Score = 0.

Now think: to keep prefixes positive, we want to start with the largest positive numbers to build a strong base, then carefully add smaller positives and negatives. A good rule of thumb: **sort in descending order**. Let’s test:

Sorted descending: `[4, 3, -2, -5]`  
Prefix sums: 4 (positive), 7 (positive), 5 (positive), 0 (not positive). Score = 3.

But wait — could we do better? What if we put the -2 before -5? That’s still descending for negatives. Actually, let’s think deeper: once we include a negative, it reduces the prefix sum. To delay that reduction as much as possible, we should place negatives in ascending order (largest negatives last). So the optimal arrangement is: **all positive numbers in any order (since addition is commutative), followed by all negatives sorted in ascending order (least negative to most negative)**.

Let’s test this on `[-5, 4, -2, 3]`:

1. Positives: `[4, 3]`
2. Negatives sorted ascending: `[-2, -5]`
3. Combined: `[4, 3, -2, -5]` (same as above) → score 3.

This is indeed optimal. The key insight: positives first (order doesn’t matter among them), then negatives in ascending order.

## Brute Force Approach

A brute force solution would try all permutations of the array, compute the prefix sums for each, and count how many are positive. The maximum count across all permutations is the answer.

Why this fails:  
For an array of length n, there are n! permutations. Even for n = 10, that’s 3.6 million permutations. The time complexity is O(n! \* n) — completely infeasible for typical constraints (n up to 10^5). We need a smarter approach.

## Optimized Approach

The problem reduces to: in what order should we place elements so that as many prefix sums as possible remain positive?

Think step-by-step:

1. **Positives are always helpful** — they increase the running sum. We should take them as early as possible to build a large positive base.
2. **Negatives are harmful** — they decrease the sum. We should take them only after we’ve accumulated enough positive sum to absorb the hit.
3. **Among negatives**, which should come first? If we have to include a negative, we should take the _least damaging_ one first — i.e., the one with the largest value (closest to zero). This preserves the sum as high as possible for longer.

Thus, the optimal arrangement is:

- Take all positive numbers first (order among them doesn’t matter).
- Then take all negative numbers sorted in **descending order** (largest to smallest).

Wait — careful: “largest negative” means closest to zero. For example, -2 is larger than -5. So we sort negatives in **descending order** (e.g., -2, -5). But since we’re appending after positives, we can just sort the entire array in descending order! Let’s verify:

Example: `[3, -2, 1, -1, 4]`  
Sorted descending: `[4, 3, 1, -1, -2]`  
Prefix sums: 4, 7, 8, 7, 5 → all positive → score = 5.

Yes, sorting the entire array in descending order works. Why? Because it ensures:

- All positives come before all negatives (since positives > 0 > negatives).
- Among negatives, they’re in descending order (largest first).

This matches our optimal arrangement.

Algorithm:

1. Sort `nums` in descending order.
2. Compute prefix sums.
3. Count how many prefix sums are positive.

Edge case: zero? Zero is neither positive nor negative. Adding zero doesn’t change the sum, so it doesn’t help or hurt. We can place zeros anywhere — putting them after positives but before negatives is fine, since they don’t affect the sum. Sorting descending places zeros between positives and negatives (since 0 > negatives but < positives).

## Optimal Solution

We implement the greedy sorting approach. After sorting descending, we iterate through the array, maintaining a running prefix sum. We count each index where the prefix sum is positive.

<div class="code-group">

```python
# Time: O(n log n) due to sorting | Space: O(1) if we sort in-place, O(n) if we count sort space
def maxScore(self, nums):
    """
    Rearrange array to maximize number of positive prefix sums.
    Strategy: Sort in descending order, then count how many prefix sums are > 0.
    """
    # Step 1: Sort in descending order
    # This ensures positives come first, then zeros, then negatives (largest negatives first)
    nums.sort(reverse=True)

    prefix_sum = 0
    count = 0

    # Step 2: Iterate through sorted array
    for num in nums:
        prefix_sum += num
        # If current prefix sum is positive, increment count
        if prefix_sum > 0:
            count += 1
        else:
            # Once prefix sum becomes non-positive, all subsequent sums will be
            # non-positive too (since we're adding decreasing numbers).
            # We can break early for efficiency.
            break

    return count
```

```javascript
// Time: O(n log n) due to sorting | Space: O(1) if sort in-place, O(n) for sort space
/**
 * Rearrange array to maximize number of positive prefix sums.
 * Strategy: Sort in descending order, then count how many prefix sums are > 0.
 */
function maxScore(nums) {
  // Step 1: Sort in descending order
  // This ensures positives come first, then zeros, then negatives (largest negatives first)
  nums.sort((a, b) => b - a);

  let prefixSum = 0;
  let count = 0;

  // Step 2: Iterate through sorted array
  for (let num of nums) {
    prefixSum += num;
    // If current prefix sum is positive, increment count
    if (prefixSum > 0) {
      count++;
    } else {
      // Once prefix sum becomes non-positive, all subsequent sums will be
      // non-positive too (since we're adding decreasing numbers).
      // We can break early for efficiency.
      break;
    }
  }

  return count;
}
```

```java
// Time: O(n log n) due to sorting | Space: O(1) if sort in-place, O(n) for sort space
class Solution {
    /**
     * Rearrange array to maximize number of positive prefix sums.
     * Strategy: Sort in descending order, then count how many prefix sums are > 0.
     */
    public int maxScore(int[] nums) {
        // Step 1: Sort in descending order
        // This ensures positives come first, then zeros, then negatives (largest negatives first)
        // Using Integer[] to sort with custom comparator for descending order
        Integer[] arr = new Integer[nums.length];
        for (int i = 0; i < nums.length; i++) {
            arr[i] = nums[i];
        }
        Arrays.sort(arr, (a, b) -> b - a);

        long prefixSum = 0;  // Use long to avoid integer overflow
        int count = 0;

        // Step 2: Iterate through sorted array
        for (int num : arr) {
            prefixSum += num;
            // If current prefix sum is positive, increment count
            if (prefixSum > 0) {
                count++;
            } else {
                // Once prefix sum becomes non-positive, all subsequent sums will be
                // non-positive too (since we're adding decreasing numbers).
                // We can break early for efficiency.
                break;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

- **Time complexity:** O(n log n) due to sorting. The iteration after sorting is O(n), but sorting dominates.
- **Space complexity:** O(1) if we sort in-place (Python, JavaScript) or O(n) if we need extra space for sorting (Java with Integer array). Some sorting algorithms (like Timsort) use O(n) space in worst case, but typically it's O(log n) for the recursion stack.

Why sorting is necessary: We must reorder elements to maximize positive prefixes. The greedy sorting gives the optimal order. Proving optimality: Suppose we have an optimal arrangement that differs from our sorted order. We can always swap elements to match the sorted order without decreasing the prefix score, confirming sorted descending is optimal.

## Common Mistakes

1. **Not sorting correctly:** Sorting ascending instead of descending gives worst arrangement (negatives first). Always sort descending.
2. **Counting zero as positive:** The problem asks for _positive_ prefix sums, not non-negative. Prefix sum must be > 0, not ≥ 0. If prefix sum equals zero, it doesn’t count.
3. **Integer overflow:** When numbers are large (up to 10^6) and n is large (10^5), prefix sum can exceed 32-bit integer range. Use 64-bit integer (long in Java, normal int in Python handles big integers).
4. **Not breaking early:** Once prefix sum becomes non-positive, adding more (non-increasing) numbers keeps it non-positive. Breaking early saves time but doesn’t affect correctness.

## When You’ll See This Pattern

This greedy sorting pattern appears in problems where order affects cumulative outcomes:

1. **Two City Scheduling (LeetCode 1029)** — Sort by cost difference to minimize total cost when splitting into two groups.
2. **Maximum Subarray (LeetCode 53)** — While not exactly sorting, it involves tracking running sum and resetting when it becomes negative (Kadane’s algorithm).
3. **Task Scheduler (LeetCode 621)** — Sort tasks by frequency to arrange with cooldown periods.

The core idea: when order matters for cumulative metrics, sorting by some criterion (often value or cost difference) yields optimal arrangement.

## Key Takeaways

- **Greedy sorting by value** often works when you want to maximize/minimize cumulative sums. Here, sorting descending maximizes positive prefixes.
- **Break early optimization:** Once the prefix sum becomes non-positive, adding more decreasing numbers won’t make it positive again.
- **Think about element contribution:** Positives help immediately, negatives hurt but can be delayed. Arrange to delay damage as much as possible.

Related problems: [Two City Scheduling](/problem/two-city-scheduling)
