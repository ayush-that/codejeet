---
title: "How to Solve Average Value of Even Numbers That Are Divisible by Three — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Average Value of Even Numbers That Are Divisible by Three. Easy difficulty, 62.9% acceptance rate. Topics: Array, Math."
date: "2027-08-04"
category: "dsa-patterns"
tags: ["average-value-of-even-numbers-that-are-divisible-by-three", "array", "math", "easy"]
---

# How to Solve Average Value of Even Numbers That Are Divisible by Three

This problem asks us to find the average of all even integers in an array that are also divisible by 3, then round down to the nearest integer. While conceptually straightforward, it tests attention to detail with multiple conditions and proper handling of edge cases. The interesting part is that we need to check **two divisibility conditions simultaneously** - a number must be even (divisible by 2) AND divisible by 3, which is equivalent to being divisible by 6.

## Visual Walkthrough

Let's trace through an example: `nums = [12, 6, 9, 4, 15, 18, 21]`

We need to find numbers that are:

1. Even (divisible by 2)
2. Divisible by 3

**Step-by-step filtering:**

1. **12**: Even ✓, Divisible by 3 ✓ (12 ÷ 3 = 4) → Include
2. **6**: Even ✓, Divisible by 3 ✓ (6 ÷ 3 = 2) → Include
3. **9**: Even ✗ (9 ÷ 2 = 4.5) → Exclude
4. **4**: Even ✓, Divisible by 3 ✗ (4 ÷ 3 ≈ 1.33) → Exclude
5. **15**: Even ✗ → Exclude
6. **18**: Even ✓, Divisible by 3 ✓ (18 ÷ 3 = 6) → Include
7. **21**: Even ✗ → Exclude

**Numbers included**: [12, 6, 18]

**Calculate average**:

- Sum = 12 + 6 + 18 = 36
- Count = 3
- Average = 36 ÷ 3 = 12
- Rounded down = 12 (already an integer)

**Result**: 12

Notice that we could optimize by checking divisibility by 6 directly, since a number divisible by both 2 and 3 must be divisible by 6 (LCM of 2 and 3).

## Brute Force Approach

The brute force approach is exactly what we did in the visual walkthrough: iterate through each number, check both conditions, collect valid numbers, then compute the average.

While this approach is technically correct and works for this problem (which has an easy difficulty rating), let's think about what a truly naive approach might look like and why we might want to optimize:

1. Store all qualifying numbers in a list
2. Sum them separately
3. Count them separately
4. Compute average

The issue isn't time complexity (O(n) is optimal), but rather unnecessary space usage. We don't need to store all qualifying numbers - we can just track the running sum and count.

## Optimal Solution

The optimal solution uses a single pass through the array while maintaining:

- `total_sum`: sum of all numbers meeting the criteria
- `count`: how many numbers meet the criteria

We check if each number is divisible by 6 (equivalent to being even AND divisible by 3). If it is, we add it to the sum and increment the count. At the end, if count is 0, we return 0 (to avoid division by zero), otherwise we return `total_sum // count` (integer division automatically rounds down).

<div class="code-group">

```python
# Time: O(n) - we iterate through the array once
# Space: O(1) - we only use constant extra space
def averageValue(nums):
    """
    Calculate the average of numbers divisible by both 2 and 3.

    Args:
        nums: List of positive integers

    Returns:
        Integer average (rounded down) of qualifying numbers
    """
    total_sum = 0  # Track sum of qualifying numbers
    count = 0      # Track count of qualifying numbers

    # Iterate through each number in the array
    for num in nums:
        # Check if number is divisible by 6
        # (divisible by 2 AND 3 means divisible by LCM(2,3)=6)
        if num % 6 == 0:
            total_sum += num  # Add to running sum
            count += 1        # Increment count

    # Handle edge case: no qualifying numbers
    if count == 0:
        return 0

    # Integer division automatically rounds down
    return total_sum // count
```

```javascript
// Time: O(n) - we iterate through the array once
// Space: O(1) - we only use constant extra space
function averageValue(nums) {
  /**
   * Calculate the average of numbers divisible by both 2 and 3.
   *
   * @param {number[]} nums - Array of positive integers
   * @return {number} Integer average (rounded down) of qualifying numbers
   */
  let totalSum = 0; // Track sum of qualifying numbers
  let count = 0; // Track count of qualifying numbers

  // Iterate through each number in the array
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // Check if number is divisible by 6
    // (divisible by 2 AND 3 means divisible by LCM(2,3)=6)
    if (num % 6 === 0) {
      totalSum += num; // Add to running sum
      count++; // Increment count
    }
  }

  // Handle edge case: no qualifying numbers
  if (count === 0) {
    return 0;
  }

  // Math.floor ensures we round down (though integer division would too)
  return Math.floor(totalSum / count);
}
```

```java
// Time: O(n) - we iterate through the array once
// Space: O(1) - we only use constant extra space
class Solution {
    public int averageValue(int[] nums) {
        /**
         * Calculate the average of numbers divisible by both 2 and 3.
         *
         * @param nums Array of positive integers
         * @return Integer average (rounded down) of qualifying numbers
         */
        int totalSum = 0;  // Track sum of qualifying numbers
        int count = 0;     // Track count of qualifying numbers

        // Iterate through each number in the array
        for (int num : nums) {
            // Check if number is divisible by 6
            // (divisible by 2 AND 3 means divisible by LCM(2,3)=6)
            if (num % 6 == 0) {
                totalSum += num;  // Add to running sum
                count++;          // Increment count
            }
        }

        // Handle edge case: no qualifying numbers
        if (count == 0) {
            return 0;
        }

        // Integer division automatically rounds down
        return totalSum / count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations (modulo check, addition, increment) for each element.
- The number of operations grows linearly with input size n.

**Space Complexity: O(1)**

- We only use a fixed amount of extra space regardless of input size: two integer variables (`total_sum` and `count`).
- We don't create any data structures that grow with input size.

## Common Mistakes

1. **Forgetting the "no qualifying numbers" edge case**: If no numbers meet the criteria, `count` will be 0, and dividing by 0 will crash the program. Always check if `count > 0` before dividing.

2. **Using floating-point division instead of integer division**: The problem specifies rounding down, which integer division (`//` in Python, `/` with integers in Java, `Math.floor()` in JavaScript) handles automatically. Using float division then rounding can introduce precision issues with large numbers.

3. **Checking conditions separately instead of using divisibility by 6**: While checking `num % 2 == 0 and num % 3 == 0` is correct, it's less efficient than checking `num % 6 == 0`. More importantly, some candidates might check the conditions in the wrong order or with incorrect logic operators.

4. **Storing qualifying numbers in an array**: This wastes O(k) space where k is the number of qualifying numbers. We only need the sum and count, not the actual numbers.

## When You'll See This Pattern

This problem demonstrates the **filter-and-aggregate** pattern, which appears in many array processing problems:

1. **Binary Prefix Divisible By 5 (Easy)**: Similar filtering logic but with binary numbers and modulo 5. Instead of checking divisibility by 6, you check if the binary prefix (converted to decimal) is divisible by 5.

2. **Find Numbers with Even Number of Digits (Easy)**: Filter numbers based on digit count parity, then count them - same filter-and-count pattern.

3. **Count Negative Numbers in a Sorted Matrix (Easy)**: Filter negative numbers from a 2D array and count them.

The core pattern is: iterate through data, apply a filter condition, and aggregate results (sum, count, average, etc.) without storing all filtered items.

## Key Takeaways

1. **Combine multiple conditions efficiently**: When checking for divisibility by multiple numbers, check for divisibility by their LCM (Least Common Multiple). For "divisible by 2 AND 3", check divisibility by 6.

2. **Aggregate without storing**: Many problems only need aggregated results (sum, count, average) rather than the actual filtered items. You can compute these on the fly without using extra storage.

3. **Always handle edge cases**: Empty results (count = 0), single element arrays, and boundary values should be considered. For averaging problems, division by zero is a critical edge case.

Related problems: [Binary Prefix Divisible By 5](/problem/binary-prefix-divisible-by-5)
