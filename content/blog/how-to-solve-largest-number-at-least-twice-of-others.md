---
title: "How to Solve Largest Number At Least Twice of Others — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Largest Number At Least Twice of Others. Easy difficulty, 52.1% acceptance rate. Topics: Array, Sorting."
date: "2027-11-05"
category: "dsa-patterns"
tags: ["largest-number-at-least-twice-of-others", "array", "sorting", "easy"]
---

# How to Solve Largest Number At Least Twice of Others

This problem asks us to find whether the largest number in an array is at least twice as large as every other number. If it is, we return its index; otherwise, we return -1. What makes this problem interesting is that while it appears simple, it requires careful handling of edge cases and an efficient approach to avoid unnecessary comparisons. The key insight is that we don't actually need to compare the largest element with every other element individually—we just need to ensure it's at least twice the second largest element.

## Visual Walkthrough

Let's walk through an example step by step. Consider the array `[3, 6, 1, 0]`:

1. First, we need to find the largest element. Scanning through the array:
   - Element 0: 3 (current max = 3, max index = 0)
   - Element 1: 6 > 3, so update max = 6, max index = 1
   - Element 2: 1 < 6, no change
   - Element 3: 0 < 6, no change

   Largest element = 6 at index 1.

2. Now we need to check if 6 is at least twice every other number. Instead of comparing with each element, we can find the second largest element (excluding the maximum itself) and check if the maximum is at least twice this value.

3. Finding the second largest:
   - Initialize second max = 0 (or negative infinity for negative numbers)
   - Element 0: 3 > 0 and 3 ≠ 6, so second max = 3
   - Element 2: 1 < 3, no change
   - Element 3: 0 < 3, no change

   Second largest = 3.

4. Check condition: Is 6 ≥ 2 × 3? 6 ≥ 6 → Yes.

5. Since the condition holds, return the index of the largest element: 1.

Now consider `[1, 2, 3, 4]`:

- Largest = 4 at index 3
- Second largest = 3
- Check: 4 ≥ 2 × 3? 4 ≥ 6 → No
- Return -1

This approach works because if the largest element is at least twice the second largest, it will automatically be at least twice all other elements (since they're smaller than or equal to the second largest).

## Brute Force Approach

A naive approach would compare the largest element with every other element individually:

1. Find the maximum element and its index
2. For each element in the array (except the maximum itself):
   - Check if `max_element < 2 × current_element`
   - If any element fails this check, return -1
3. If all checks pass, return the index of the maximum

While this approach is correct, it's inefficient because:

- We need to find the maximum first (O(n))
- Then we make another pass through the array (O(n))
- In the second pass, we're doing redundant comparisons

The time complexity is O(2n) = O(n), which is actually acceptable, but we can do better with a single pass. More importantly, the brute force doesn't leverage the key insight about the second largest element, which makes the code cleaner and more efficient in practice.

## Optimal Solution

The optimal solution finds both the largest and second largest elements in a single pass through the array. Here's the reasoning:

1. We track both the maximum value and the second maximum value as we iterate
2. If we find a new maximum, the old maximum becomes the new second maximum
3. If we find a number that's between the current second maximum and maximum, it becomes the new second maximum
4. After the loop, we check if the maximum is at least twice the second maximum
5. Special case: if there's only one element, it automatically satisfies the condition

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def dominantIndex(nums):
    """
    Returns the index of the largest element if it's at least twice
    as large as every other element, otherwise returns -1.
    """
    # Edge case: empty array
    if not nums:
        return -1

    # Initialize max and second_max with the first element
    # We use -1 as initial second_max since all numbers are non-negative
    max_val = nums[0]
    max_idx = 0
    second_max = -1

    # Iterate through the array starting from the second element
    for i in range(1, len(nums)):
        current = nums[i]

        if current > max_val:
            # Found a new maximum, old maximum becomes second maximum
            second_max = max_val
            max_val = current
            max_idx = i
        elif current > second_max:
            # Current is between second_max and max_val
            # Update second_max (but it's not the new maximum)
            second_max = current

    # Check if the maximum is at least twice the second maximum
    # If second_max is still -1, it means there's only one element
    # (or all other elements are 0), which satisfies the condition
    if max_val >= 2 * second_max:
        return max_idx
    else:
        return -1
```

```javascript
// Time: O(n) | Space: O(1)
function dominantIndex(nums) {
  /**
   * Returns the index of the largest element if it's at least twice
   * as large as every other element, otherwise returns -1.
   */
  // Edge case: empty array
  if (nums.length === 0) {
    return -1;
  }

  // Initialize max and second_max with the first element
  let maxVal = nums[0];
  let maxIdx = 0;
  let secondMax = -1;

  // Iterate through the array starting from the second element
  for (let i = 1; i < nums.length; i++) {
    const current = nums[i];

    if (current > maxVal) {
      // Found a new maximum, old maximum becomes second maximum
      secondMax = maxVal;
      maxVal = current;
      maxIdx = i;
    } else if (current > secondMax) {
      // Current is between secondMax and maxVal
      // Update secondMax (but it's not the new maximum)
      secondMax = current;
    }
  }

  // Check if the maximum is at least twice the second maximum
  // If secondMax is still -1, it means there's only one element
  // (or all other elements are 0), which satisfies the condition
  if (maxVal >= 2 * secondMax) {
    return maxIdx;
  } else {
    return -1;
  }
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int dominantIndex(int[] nums) {
        /**
         * Returns the index of the largest element if it's at least twice
         * as large as every other element, otherwise returns -1.
         */
        // Edge case: empty array
        if (nums.length == 0) {
            return -1;
        }

        // Initialize max and second_max with the first element
        int maxVal = nums[0];
        int maxIdx = 0;
        int secondMax = -1;

        // Iterate through the array starting from the second element
        for (int i = 1; i < nums.length; i++) {
            int current = nums[i];

            if (current > maxVal) {
                // Found a new maximum, old maximum becomes second maximum
                secondMax = maxVal;
                maxVal = current;
                maxIdx = i;
            } else if (current > secondMax) {
                // Current is between secondMax and maxVal
                // Update secondMax (but it's not the new maximum)
                secondMax = current;
            }
        }

        // Check if the maximum is at least twice the second maximum
        // If secondMax is still -1, it means there's only one element
        // (or all other elements are 0), which satisfies the condition
        if (maxVal >= 2 * secondMax) {
            return maxIdx;
        } else {
            return -1;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array with n elements
- Each iteration performs constant-time operations (comparisons and assignments)
- No nested loops or recursive calls

**Space Complexity: O(1)**

- We only use a fixed number of variables (max_val, max_idx, second_max, loop counter)
- The space used does not grow with the input size
- We don't create any additional data structures

The algorithm is optimal because we must examine each element at least once to find the maximum, giving us a lower bound of Ω(n). Our solution achieves this lower bound.

## Common Mistakes

1. **Forgetting to handle the single-element case**: When the array has only one element, it trivially satisfies the condition (the largest element is at least twice all other elements since there are no other elements). Some implementations might return -1 incorrectly because second_max remains at its initial value.

2. **Incorrect initialization of second_max**: If you initialize second_max to 0, you'll have problems with arrays containing only negative numbers or when 0 is actually in the array. Using -∞ (or Integer.MIN_VALUE in Java) is safer, but in this problem we can use -1 since the problem states numbers are non-negative.

3. **Not updating second_max correctly when finding a new max**: When you find a new maximum, the old maximum should become the new second maximum. A common mistake is to only update the maximum without preserving the old value for second_max.

4. **Comparing with the wrong value**: Some candidates compare the maximum with 2 × second_max but use strict inequality (`>` instead of `>=`). The problem says "at least twice", which means `max ≥ 2 × other`, not `max > 2 × other`.

## When You'll See This Pattern

This "track two extremes" pattern appears in several other problems:

1. **Find the Second Largest/Smallest Element**: Similar logic of tracking both max and second max while iterating once.

2. **Third Maximum Number (LeetCode 414)**: Extends this pattern to track the top three distinct numbers.

3. **Maximum Product of Three Numbers (LeetCode 628)**: Requires tracking both the three largest numbers and the two smallest numbers (for negative numbers).

4. **Find Peak Element (LeetCode 162)**: While not identical, it also involves comparing elements with their neighbors in a single pass.

The core idea is that by tracking relevant extreme values (maximum, minimum, second maximum, etc.), you can often solve problems in O(n) time without sorting or using additional data structures.

## Key Takeaways

1. **Single-pass solutions are often possible**: Many array problems that seem to require multiple passes can be solved in one pass by tracking the right information as you go.

2. **Think about what information you really need**: For this problem, you don't need to compare the maximum with every element—you only need to know if it's at least twice the second largest element.

3. **Initialize variables carefully**: Choose initial values that work for edge cases (empty arrays, single-element arrays, arrays with duplicate values).

4. **Update tracking variables in the right order**: When you find a new maximum, remember to update second_max before updating max_val to avoid losing the old maximum value.

Related problems: [Keep Multiplying Found Values by Two](/problem/keep-multiplying-found-values-by-two), [Largest Number After Digit Swaps by Parity](/problem/largest-number-after-digit-swaps-by-parity)
