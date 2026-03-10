---
title: "How to Solve Plus One — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Plus One. Easy difficulty, 49.6% acceptance rate. Topics: Array, Math."
date: "2026-03-13"
category: "dsa-patterns"
tags: ["plus-one", "array", "math", "easy"]
---

# How to Solve Plus One

You're given an array of digits representing a large integer, where each element is a single digit from 0-9. The digits are ordered from most significant (leftmost) to least significant (rightmost). Your task is to increment this large integer by one and return the resulting array of digits.

What makes this problem interesting is that it appears deceptively simple but has a subtle edge case: when you increment a number like 999, you get 1000, which requires adding an extra digit at the beginning. This is a classic "carry propagation" problem that tests your attention to detail with array manipulation and edge cases.

## Visual Walkthrough

Let's trace through a few examples to build intuition:

**Example 1: [1, 2, 3]**

- Start from the least significant digit (rightmost): 3
- Add 1: 3 + 1 = 4 (no carry needed)
- Result: [1, 2, 4]

**Example 2: [4, 3, 9]**

- Start from rightmost: 9
- Add 1: 9 + 1 = 10 → digit becomes 0, carry = 1
- Move left: 3 + carry(1) = 4 (no further carry)
- Result: [4, 4, 0]

**Example 3: [9, 9, 9]**

- Start from rightmost: 9
- Add 1: 9 + 1 = 10 → digit becomes 0, carry = 1
- Move left: 9 + carry(1) = 10 → digit becomes 0, carry = 1
- Move left: 9 + carry(1) = 10 → digit becomes 0, carry = 1
- All digits processed but still have carry = 1
- Need to add new digit at beginning: [1, 0, 0, 0]

The key insight: we process digits from right to left, handling carries as we go. If we finish processing all digits and still have a carry, we need to insert a new digit '1' at the beginning.

## Brute Force Approach

A naive approach might try to convert the array to an integer, add one, then convert back to an array:

1. Convert array to integer: `int("".join(map(str, digits)))`
2. Add 1 to the integer
3. Convert back to array: `list(map(int, str(result)))`

However, this approach fails for very large integers that exceed the maximum integer size in programming languages (typically 2³¹ - 1 or 2⁶³ - 1). The problem states it's a "large integer," which implies it could have hundreds or thousands of digits, far beyond what standard integer types can handle.

Even if we could use arbitrary-precision integers (like Python's `int`), this approach is inefficient because:

- Converting to string and back has O(n) time and space complexity
- It doesn't demonstrate understanding of the carry propagation logic
- In languages like Java or JavaScript, it would fail for truly large numbers

The optimal solution works directly with the array, handling carries digit by digit.

## Optimal Solution

The optimal approach processes the array from right to left, simulating the addition with carry. We iterate through the digits, adding 1 to the least significant digit and propagating any carry to the left. If we reach the most significant digit and still have a carry, we need to insert a new digit '1' at the beginning.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) average, O(n) worst case (when we need new digit)
def plusOne(digits):
    """
    Increment a large integer represented as an array of digits.

    Args:
        digits: List[int] - array where each element is a digit 0-9

    Returns:
        List[int] - incremented number as array of digits
    """
    # Start from the least significant digit (rightmost)
    for i in range(len(digits) - 1, -1, -1):
        # If current digit is less than 9, we can simply add 1 and return
        if digits[i] < 9:
            digits[i] += 1
            return digits
        # Current digit is 9, adding 1 makes it 0 with carry 1
        digits[i] = 0

    # If we exit the loop, all digits were 9 (e.g., 999 -> 1000)
    # We need to add a new most significant digit '1' at the beginning
    return [1] + digits
```

```javascript
// Time: O(n) | Space: O(1) average, O(n) worst case (when we need new digit)
function plusOne(digits) {
  /**
   * Increment a large integer represented as an array of digits.
   *
   * @param {number[]} digits - array where each element is a digit 0-9
   * @return {number[]} - incremented number as array of digits
   */

  // Start from the least significant digit (rightmost)
  for (let i = digits.length - 1; i >= 0; i--) {
    // If current digit is less than 9, we can simply add 1 and return
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    // Current digit is 9, adding 1 makes it 0 with carry 1
    digits[i] = 0;
  }

  // If we exit the loop, all digits were 9 (e.g., 999 -> 1000)
  // We need to add a new most significant digit '1' at the beginning
  return [1, ...digits];
}
```

```java
// Time: O(n) | Space: O(1) average, O(n) worst case (when we need new digit)
class Solution {
    public int[] plusOne(int[] digits) {
        /**
         * Increment a large integer represented as an array of digits.
         *
         * @param digits - array where each element is a digit 0-9
         * @return incremented number as array of digits
         */

        // Start from the least significant digit (rightmost)
        for (int i = digits.length - 1; i >= 0; i--) {
            // If current digit is less than 9, we can simply add 1 and return
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            // Current digit is 9, adding 1 makes it 0 with carry 1
            digits[i] = 0;
        }

        // If we exit the loop, all digits were 9 (e.g., 999 -> 1000)
        // We need to create a new array with length + 1
        int[] result = new int[digits.length + 1];
        result[0] = 1;  // Most significant digit is 1, rest are 0
        return result;
    }
}
```

</div>

**Key implementation details:**

1. **Right-to-left iteration**: We process from the least significant digit (index `n-1`) to the most significant (index `0`). This mimics how we do addition by hand.

2. **Early return optimization**: When we find a digit less than 9, we can add 1 to it and return immediately. This works because adding 1 to a digit less than 9 doesn't create a carry.

3. **Handling the all-9s case**: If we complete the loop without returning, it means every digit was 9. We need to create a new array with a leading 1 followed by all zeros.

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case (all digits are 9), we iterate through all `n` digits once
- In the average case, we stop early when we find a digit less than 9
- The loop runs at most `n` iterations

**Space Complexity: O(1) average, O(n) worst case**

- Average case: We modify the input array in-place, using only constant extra space
- Worst case (all digits are 9): We need to create a new array of size `n+1`, using O(n) space
- Note: In Python and JavaScript, `[1] + digits` or `[1, ...digits]` creates a new array, but this is only in the worst case

## Common Mistakes

1. **Processing left-to-right instead of right-to-left**: Beginners sometimes try to process from the most significant digit first, which doesn't work because carries propagate from least to most significant digit.

2. **Forgetting the all-9s edge case**: The most common mistake is not handling numbers like 99, 999, etc., which require adding a new digit. Always test with `[9]`, `[9,9]`, `[9,9,9]`.

3. **Incorrect carry handling**: Some candidates use a separate carry variable and complex logic. The cleaner approach shown above checks if a digit is 9 and sets it to 0, otherwise increments and returns.

4. **Modifying the array while iterating in the wrong direction**: If you use a forward loop and need to insert a new digit, you'll have index issues. Always iterate backward for this type of problem.

5. **Returning the wrong data type**: Make sure to return an array/list, not a single integer or string.

## When You'll See This Pattern

The "carry propagation" pattern appears in many problems involving digit-by-digit arithmetic:

1. **Add Binary (Easy)**: Similar to Plus One but with binary digits (0 and 1) and two inputs instead of one. You still process from right to left with carry propagation.

2. **Multiply Strings (Medium)**: A more complex version where you multiply two numbers represented as strings. You use nested loops and manage carries for each digit position.

3. **Add Two Numbers (Medium)**: The linked list version where each node contains a digit, and you add two numbers while handling carries.

4. **Add Strings (Easy)**: Exactly like Add Binary but with decimal digits instead of binary.

The core technique is always the same: process digits from least significant to most significant, handle carries, and be prepared for the result to have more digits than the inputs.

## Key Takeaways

1. **Right-to-left processing is key for digit arithmetic**: When adding or manipulating numbers digit by digit, always start from the least significant digit (rightmost) because carries propagate in that direction.

2. **Early optimization with conditional returns**: By checking if a digit is less than 9, we can often return early without processing all digits, improving average-case performance.

3. **The all-9s edge case is critical**: Whenever you're incrementing or adding digits, numbers consisting entirely of 9s will require adding a new most significant digit. This is a common interview trap.

4. **In-place modification when possible**: The solution modifies the input array when it can, only creating a new array when necessary (all-9s case). This demonstrates good space awareness.

Related problems: [Multiply Strings](/problem/multiply-strings), [Add Binary](/problem/add-binary), [Plus One Linked List](/problem/plus-one-linked-list)
