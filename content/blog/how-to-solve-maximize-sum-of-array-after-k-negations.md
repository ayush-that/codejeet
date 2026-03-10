---
title: "How to Solve Maximize Sum Of Array After K Negations — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximize Sum Of Array After K Negations. Easy difficulty, 53.6% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2026-11-20"
category: "dsa-patterns"
tags: ["maximize-sum-of-array-after-k-negations", "array", "greedy", "sorting", "easy"]
---

# How to Solve Maximize Sum Of Array After K Negations

You're given an array of integers and a number `k`. You must flip the sign of elements exactly `k` times (you can flip the same element multiple times), and you want to maximize the final sum of the array. What makes this problem interesting is that while it seems straightforward, the optimal strategy requires careful consideration of when to flip negative numbers versus positive numbers, and how to handle leftover flips.

## Visual Walkthrough

Let's walk through an example: `nums = [3, -1, 0, 2]`, `k = 6`

**Step 1: Sort the array**
Sorted: `[-1, 0, 2, 3]`

**Step 2: Flip negative numbers first**
We have 6 flips available. The most beneficial use is to flip negative numbers to positive:

- Flip -1 → 1 (k becomes 5, sum increases by 2)
  Array: `[1, 0, 2, 3]`

**Step 3: Handle leftover flips**
We still have 5 flips left. Now all numbers are non-negative. Flipping any positive number reduces the sum, so we want to minimize the damage.

**Key insight:** If we have an even number of leftover flips, we can flip the same element twice (net zero change). If we have an odd number, we must flip once, so we should flip the smallest absolute value.

Our smallest absolute value is 0. Flipping 0 doesn't change anything! So:

- Flip 0 → 0 (k becomes 4)
- Flip 0 → 0 (k becomes 3)
- Flip 0 → 0 (k becomes 2)
- Flip 0 → 0 (k becomes 1)
- Flip 0 → 0 (k becomes 0)

Final array: `[1, 0, 2, 3]`, sum = 6

But what if we didn't have 0? Let's try `nums = [2, -3, -1, 5, -4]`, `k = 4`

**Step 1: Sort:** `[-4, -3, -1, 2, 5]`

**Step 2: Flip negatives:**

- Flip -4 → 4 (k=3)
- Flip -3 → 3 (k=2)
- Flip -1 → 1 (k=1)
  Array: `[4, 3, 1, 2, 5]`

**Step 3: Handle leftover flips**
We have 1 flip left (odd). Find smallest absolute value: 1

- Flip 1 → -1 (k=0)
  Final array: `[4, 3, -1, 2, 5]`, sum = 13

Without the optimal strategy, we might have wasted flips or chosen poorly.

## Brute Force Approach

A naive approach would be to try all possible sequences of flips. For each of k operations, we could choose any of n indices. This gives us n^k possibilities to check - exponential time complexity that's completely impractical even for small inputs.

A slightly better but still suboptimal approach would be to always flip the smallest element (most negative) at each step. While this seems reasonable, it fails to consider that after flipping all negatives, we need to handle leftover flips optimally. The brute force version of this greedy approach would be O(k \* n) if we scan for the minimum each time, which is O(kn) time - better than exponential but still not optimal when k is large.

## Optimal Solution

The optimal solution uses sorting and careful handling of leftover flips. Here's the strategy:

1. Sort the array so negatives come first
2. Flip all negative numbers while we have flips left
3. If we have leftover flips:
   - If k is even: we can flip any element twice (net zero change)
   - If k is odd: flip the element with smallest absolute value once
4. Calculate and return the sum

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def largestSumAfterKNegations(nums, k):
    """
    Maximize array sum after exactly k sign flips.

    Strategy:
    1. Sort to bring negatives to the front
    2. Flip negatives first (most beneficial)
    3. Handle leftover flips optimally
    """
    # Step 1: Sort the array
    # This brings all negative numbers to the front
    nums.sort()

    # Step 2: Flip negative numbers while we have flips
    # Each negative flipped to positive increases the sum maximally
    for i in range(len(nums)):
        if k > 0 and nums[i] < 0:
            nums[i] = -nums[i]  # Flip negative to positive
            k -= 1

    # Step 3: Handle any leftover flips
    # If k is 0, we're done. If k > 0, we need to minimize damage
    if k > 0:
        # If k is even, we can flip any element twice (net zero change)
        # If k is odd, we must flip once - choose smallest absolute value
        if k % 2 == 1:
            # Find the element with smallest absolute value
            # After sorting and flipping negatives, this is simply min(nums)
            min_index = nums.index(min(nums))
            nums[min_index] = -nums[min_index]

    # Step 4: Return the sum
    return sum(nums)
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function largestSumAfterKNegations(nums, k) {
  /**
   * Maximize array sum after exactly k sign flips.
   *
   * Strategy:
   * 1. Sort to bring negatives to the front
   * 2. Flip negatives first (most beneficial)
   * 3. Handle leftover flips optimally
   */

  // Step 1: Sort the array
  // This brings all negative numbers to the front
  nums.sort((a, b) => a - b);

  // Step 2: Flip negative numbers while we have flips
  // Each negative flipped to positive increases the sum maximally
  for (let i = 0; i < nums.length && k > 0; i++) {
    if (nums[i] < 0) {
      nums[i] = -nums[i]; // Flip negative to positive
      k--;
    }
  }

  // Step 3: Handle any leftover flips
  // If k is 0, we're done. If k > 0, we need to minimize damage
  if (k > 0) {
    // If k is even, we can flip any element twice (net zero change)
    // If k is odd, we must flip once - choose smallest absolute value
    if (k % 2 === 1) {
      // Find the element with smallest absolute value
      // After sorting and flipping negatives, this is simply min(nums)
      let minIndex = 0;
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] < nums[minIndex]) {
          minIndex = i;
        }
      }
      nums[minIndex] = -nums[minIndex];
    }
  }

  // Step 4: Return the sum
  return nums.reduce((sum, num) => sum + num, 0);
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
import java.util.Arrays;

class Solution {
    public int largestSumAfterKNegations(int[] nums, int k) {
        /**
         * Maximize array sum after exactly k sign flips.
         *
         * Strategy:
         * 1. Sort to bring negatives to the front
         * 2. Flip negatives first (most beneficial)
         * 3. Handle leftover flips optimally
         */

        // Step 1: Sort the array
        // This brings all negative numbers to the front
        Arrays.sort(nums);

        // Step 2: Flip negative numbers while we have flips
        // Each negative flipped to positive increases the sum maximally
        for (int i = 0; i < nums.length && k > 0; i++) {
            if (nums[i] < 0) {
                nums[i] = -nums[i];  // Flip negative to positive
                k--;
            }
        }

        // Step 3: Handle any leftover flips
        // If k is 0, we're done. If k > 0, we need to minimize damage
        if (k > 0) {
            // If k is even, we can flip any element twice (net zero change)
            // If k is odd, we must flip once - choose smallest absolute value
            if (k % 2 == 1) {
                // Find the element with smallest absolute value
                // After sorting and flipping negatives, this is simply min(nums)
                int minIndex = 0;
                for (int i = 1; i < nums.length; i++) {
                    if (nums[i] < nums[minIndex]) {
                        minIndex = i;
                    }
                }
                nums[minIndex] = -nums[minIndex];
            }
        }

        // Step 4: Calculate and return the sum
        int sum = 0;
        for (int num : nums) {
            sum += num;
        }
        return sum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the array takes O(n log n) time
- The first pass through the array to flip negatives takes O(n)
- Finding the minimum element for leftover flips takes O(n)
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity:** O(1) or O(n) depending on language/sort implementation

- In-place sorting algorithms use O(1) extra space
- Some language implementations may use O(n) for sorting
- We only use a few extra variables (k counter, min index)

## Common Mistakes

1. **Not sorting the array first:** Some candidates try to find the minimum element at each step without sorting. This leads to O(kn) time complexity which is inefficient when k is large.

2. **Forgetting to handle leftover flips after processing negatives:** After flipping all negatives, if k is still positive, you need to handle it. The optimal strategy depends on whether k is even or odd.

3. **Incorrectly handling the case when k > number of negatives:** When you have more flips than negative numbers, you must consider the parity (even/odd) of the remaining flips. Flipping the same element twice cancels out.

4. **Using absolute value incorrectly when finding the element to flip:** After flipping negatives, all numbers are non-negative. The element with smallest absolute value is simply the smallest number in the array, not necessarily the one that started with smallest absolute value.

## When You'll See This Pattern

This problem uses a **greedy approach with sorting** - a common pattern where you sort elements to process them in a specific order that leads to an optimal solution.

Related problems:

1. **Minimum Sum of Four Digit Number After Splitting Digits (LeetCode 2160)** - Sort digits to minimize sum
2. **Array Partition I (LeetCode 561)** - Sort array to maximize sum of min pairs
3. **Assign Cookies (LeetCode 455)** - Sort both arrays to maximize assignments

The core idea is that sorting often reveals structure that makes greedy choices obvious. When you need to maximize or minimize a sum by making local optimal choices, consider if sorting can help.

## Key Takeaways

1. **Sorting enables greedy strategies:** When you need to process elements in a specific order (like flipping the most negative numbers first), sorting is often the key.

2. **Parity matters with repeated operations:** When you can perform an operation multiple times on the same element, consider whether even numbers of operations cancel out. This is common in "flip" or "toggle" problems.

3. **Think about leftover operations:** After applying the obvious greedy moves, always consider what to do with any remaining operations. The optimal handling often depends on simple properties like even/odd counts.

Related problems: [Find Subsequence of Length K With the Largest Sum](/problem/find-subsequence-of-length-k-with-the-largest-sum)
