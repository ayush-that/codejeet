---
title: "How to Solve Smallest Range I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Smallest Range I. Easy difficulty, 73.3% acceptance rate. Topics: Array, Math."
date: "2027-02-01"
category: "dsa-patterns"
tags: ["smallest-range-i", "array", "math", "easy"]
---

# How to Solve Smallest Range I

This problem asks us to minimize the difference between the largest and smallest values in an array after we can adjust each element by up to `±k`. The key insight is that we don't need to simulate all possible adjustments—we just need to understand how much we can reduce the gap between the extremes.

What makes this problem interesting is that it appears more complex than it actually is. At first glance, you might think about trying different combinations of adjustments, but the optimal solution requires just a simple mathematical observation about ranges and bounds.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `nums = [1, 3, 6]` and `k = 3`.

**Step 1: Find the current range**

- Current minimum: 1
- Current maximum: 6
- Current range: 6 - 1 = 5

**Step 2: Understand what adjustments we can make**

- Each number can be increased or decreased by up to 3
- We want to make the smallest number as large as possible and the largest number as small as possible
- Maximum we can raise the smallest number (1): 1 + 3 = 4
- Minimum we can lower the largest number (6): 6 - 3 = 3

**Step 3: Calculate the new possible range**

- New minimum will be at least: min(original_min + k, original_max - k) = min(4, 3) = 3
- New maximum will be at most: max(original_min + k, original_max - k) = max(4, 3) = 4
- But wait, the new minimum (3) is actually larger than the new maximum (4)! This tells us we can make all numbers equal.

**Step 4: The key insight**
The smallest possible range is either:

- `(max - k) - (min + k)` if this is positive, OR
- 0 if we can make all numbers meet in the middle

In our example: `(6 - 3) - (1 + 3) = 3 - 4 = -1`, which is negative, so the answer is 0.

Let's try another example: `nums = [0, 10]`, `k = 2`

- Current range: 10 - 0 = 10
- New minimum possible: 0 + 2 = 2
- New maximum possible: 10 - 2 = 8
- New range: 8 - 2 = 6
- Formula: `max(0, (10 - 2) - (0 + 2)) = max(0, 8 - 2) = max(0, 6) = 6`

## Brute Force Approach

A naive approach would be to try all possible adjustments for each element. For each of the `n` elements, we have `(2k + 1)` possible adjustments (from `-k` to `+k`). This gives us `(2k + 1)^n` possible configurations to check. Even for small `n` and `k`, this grows exponentially and is completely impractical.

What some candidates might incorrectly try is to only adjust the minimum and maximum elements. While this seems logical, it's not always optimal because adjusting intermediate elements might allow for a smaller range. However, the mathematical insight shows that we only need to consider the extremes.

## Optimal Solution

The optimal solution comes from realizing that:

1. We want to minimize `(max_value - min_value)`
2. The best we can do is increase the smallest element by `k` and decrease the largest element by `k`
3. If after these adjustments the new max is still greater than the new min, that's our minimum range
4. If the new max becomes less than the new min, we can make all numbers equal (range = 0)

<div class="code-group">

```python
# Time: O(n) - we need to find min and max in the array
# Space: O(1) - we only use constant extra space
def smallestRangeI(nums, k):
    """
    Calculate the minimum possible range after adjusting each element by ±k.

    Args:
        nums: List of integers
        k: Maximum adjustment allowed for each element

    Returns:
        Minimum possible difference between max and min after adjustments
    """
    # Step 1: Find the current minimum and maximum in the array
    # We need these to understand our starting range
    current_min = min(nums)
    current_max = max(nums)

    # Step 2: Calculate the best possible adjustments
    # We want to raise the minimum as much as possible (by +k)
    # and lower the maximum as much as possible (by -k)
    new_min = current_min + k
    new_max = current_max - k

    # Step 3: Calculate the potential new range
    # If new_max < new_min, we can make all numbers equal (range = 0)
    # Otherwise, the range is new_max - new_min
    potential_range = new_max - new_min

    # Step 4: Return the minimum possible range (can't be negative)
    # max(0, ...) ensures we don't return a negative range
    return max(0, potential_range)
```

```javascript
// Time: O(n) - we need to find min and max in the array
// Space: O(1) - we only use constant extra space
/**
 * Calculate the minimum possible range after adjusting each element by ±k.
 *
 * @param {number[]} nums - Array of integers
 * @param {number} k - Maximum adjustment allowed for each element
 * @return {number} Minimum possible difference between max and min after adjustments
 */
function smallestRangeI(nums, k) {
  // Step 1: Find the current minimum and maximum in the array
  // We need these to understand our starting range
  let currentMin = Math.min(...nums);
  let currentMax = Math.max(...nums);

  // Step 2: Calculate the best possible adjustments
  // We want to raise the minimum as much as possible (by +k)
  // and lower the maximum as much as possible (by -k)
  const newMin = currentMin + k;
  const newMax = currentMax - k;

  // Step 3: Calculate the potential new range
  // If newMax < newMin, we can make all numbers equal (range = 0)
  // Otherwise, the range is newMax - newMin
  const potentialRange = newMax - newMin;

  // Step 4: Return the minimum possible range (can't be negative)
  // Math.max(0, ...) ensures we don't return a negative range
  return Math.max(0, potentialRange);
}
```

```java
// Time: O(n) - we need to find min and max in the array
// Space: O(1) - we only use constant extra space
class Solution {
    /**
     * Calculate the minimum possible range after adjusting each element by ±k.
     *
     * @param nums Array of integers
     * @param k Maximum adjustment allowed for each element
     * @return Minimum possible difference between max and min after adjustments
     */
    public int smallestRangeI(int[] nums, int k) {
        // Step 1: Find the current minimum and maximum in the array
        // We need these to understand our starting range
        int currentMin = Integer.MAX_VALUE;
        int currentMax = Integer.MIN_VALUE;

        // Iterate through array to find actual min and max
        for (int num : nums) {
            if (num < currentMin) {
                currentMin = num;
            }
            if (num > currentMax) {
                currentMax = num;
            }
        }

        // Step 2: Calculate the best possible adjustments
        // We want to raise the minimum as much as possible (by +k)
        // and lower the maximum as much as possible (by -k)
        int newMin = currentMin + k;
        int newMax = currentMax - k;

        // Step 3: Calculate the potential new range
        // If newMax < newMin, we can make all numbers equal (range = 0)
        // Otherwise, the range is newMax - newMin
        int potentialRange = newMax - newMin;

        // Step 4: Return the minimum possible range (can't be negative)
        // Math.max(0, ...) ensures we don't return a negative range
        return Math.max(0, potentialRange);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We need to examine each element at least once to find the minimum and maximum values
- In Python/JavaScript, `min()` and `max()` functions iterate through the entire array
- In Java, our manual loop goes through the array once
- No nested loops or exponential operations

**Space Complexity: O(1)**

- We only use a constant amount of extra space regardless of input size
- We store just a few integer variables (current_min, current_max, new_min, new_max, potential_range)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle the case where range becomes negative**: Some candidates calculate `(max - k) - (min + k)` and return it directly, not realizing it can be negative. The range can never be negative, so we need `max(0, result)`.

2. **Overcomplicating with unnecessary simulations**: Candidates sometimes try to simulate adjusting each element or use sorting when it's not needed. The problem only requires the mathematical relationship between min, max, and k.

3. **Incorrectly assuming only min and max need adjustment**: While the solution only uses min and max, some candidates don't understand why this works. They might think intermediate elements could affect the range, but mathematically, adjusting any element between min+k and max-k doesn't change the possible range.

4. **Off-by-one errors with array bounds**: When manually finding min/max (especially in Java), candidates might initialize `currentMin` to 0 instead of `Integer.MAX_VALUE`, or vice versa for `currentMax`.

## When You'll See This Pattern

This problem teaches the **range compression** or **bounds analysis** pattern, where instead of simulating all possibilities, we analyze the mathematical bounds of what's achievable.

Related problems:

1. **Smallest Range II (LeetCode 910)**: A harder version where you can add either `+k` or `-k` to each element (not both). This requires more careful analysis and sorting.
2. **Minimum Moves to Equal Array Elements (LeetCode 453)**: Another problem where mathematical analysis of min/max leads to an O(n) solution instead of simulation.
3. **Maximum Product of Three Numbers (LeetCode 628)**: While different, it also involves analyzing extreme values (min/max) to find optimal solutions without checking all combinations.

## Key Takeaways

1. **Look for mathematical relationships before coding**: Many "array adjustment" problems have mathematical solutions that are much simpler than simulation approaches. Always ask: "Can I express this as a formula?"

2. **Extreme values often hold the key**: When trying to minimize or maximize a range or difference, the minimum and maximum values of the dataset are usually the most important factors.

3. **Consider best-case and worst-case bounds**: Instead of simulating all possibilities, think about the theoretical limits. What's the best we could possibly do? What constraints prevent us from achieving that?

[Practice this problem on CodeJeet](/problem/smallest-range-i)
