---
title: "How to Solve Reverse Integer — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reverse Integer. Medium difficulty, 31.5% acceptance rate. Topics: Math."
date: "2026-02-23"
category: "dsa-patterns"
tags: ["reverse-integer", "math", "medium"]
---

# How to Solve Reverse Integer

The problem asks us to reverse the digits of a signed 32-bit integer, returning 0 if the reversed value falls outside the 32-bit integer range. The twist is that we cannot use 64-bit integers to handle overflow—we must detect it while building the reversed number. This constraint makes the problem interesting because we need to check for overflow before it actually happens.

## Visual Walkthrough

Let's trace through reversing `123` step by step:

**Step 1:** Initialize `reversed = 0`
**Step 2:** Get last digit of 123: `123 % 10 = 3`
**Step 3:** Remove last digit from original: `123 // 10 = 12`
**Step 4:** Update reversed: `reversed = 0 * 10 + 3 = 3`

**Step 5:** Get last digit of 12: `12 % 10 = 2`
**Step 6:** Remove last digit: `12 // 10 = 1`
**Step 7:** Update reversed: `reversed = 3 * 10 + 2 = 32`

**Step 8:** Get last digit of 1: `1 % 10 = 1`
**Step 9:** Remove last digit: `1 // 10 = 0`
**Step 10:** Update reversed: `reversed = 32 * 10 + 1 = 321`

The process stops when the original number becomes 0. For negative numbers like `-123`, we handle the sign separately and work with the absolute value, then reapply the sign at the end.

## Brute Force Approach

A naive approach might convert the integer to a string, reverse the string, convert back to integer, and handle overflow. However, this approach has issues:

1. **String conversion overhead**: Converting to/from strings is computationally expensive
2. **Direct overflow handling**: When converting back from string to integer, overflow might occur before we can check it
3. **Extra space**: Strings create additional memory overhead

While this approach might work in some environments, it doesn't teach us the mathematical principles behind the problem, and in some interview settings, the interviewer might specifically want to see the mathematical solution.

## Optimized Approach

The key insight is that we can reverse digits mathematically using modulo and integer division operations. We repeatedly:

1. Extract the last digit using `x % 10`
2. Remove it from `x` using `x // 10` (or `Math.floor(x / 10)` in JavaScript)
3. Build the reversed number: `reversed = reversed * 10 + digit`

The critical challenge is detecting overflow _before_ it happens. Since we can't use 64-bit integers, we must check if `reversed * 10 + digit` would overflow _before_ performing the operation.

For positive numbers, overflow occurs when:

- `reversed > Integer.MAX_VALUE / 10` OR
- `reversed == Integer.MAX_VALUE / 10` AND `digit > Integer.MAX_VALUE % 10`

For negative numbers, underflow occurs when:

- `reversed < Integer.MIN_VALUE / 10` OR
- `reversed == Integer.MIN_VALUE / 10` AND `digit < Integer.MIN_VALUE % 10`

We check these conditions before updating `reversed` to prevent actual overflow.

## Optimal Solution

<div class="code-group">

```python
# Time: O(log₁₀(n)) | Space: O(1)
def reverse(x: int) -> int:
    # Handle sign separately - work with positive numbers
    sign = 1 if x >= 0 else -1
    x = abs(x)

    reversed_num = 0
    # Python's integer max and min values for 32-bit integers
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31

    while x != 0:
        # Get the last digit
        digit = x % 10

        # Check for overflow before updating reversed_num
        # For positive overflow check (when sign is positive)
        if sign == 1:
            # Check if reversed_num * 10 + digit would exceed INT_MAX
            if reversed_num > INT_MAX // 10:
                return 0
            if reversed_num == INT_MAX // 10 and digit > INT_MAX % 10:
                return 0

        # For negative overflow check (when sign is negative)
        else:
            # Check if reversed_num * 10 + digit would go below INT_MIN
            # Since we're working with positive numbers, we check against
            # the positive equivalent of the negative bound
            if reversed_num > abs(INT_MIN) // 10:
                return 0
            if reversed_num == abs(INT_MIN) // 10 and digit > abs(INT_MIN) % 10:
                return 0

        # Update reversed number
        reversed_num = reversed_num * 10 + digit

        # Remove last digit from original number
        x //= 10

    # Apply the original sign
    return sign * reversed_num
```

```javascript
// Time: O(log₁₀(n)) | Space: O(1)
function reverse(x) {
  // Handle sign separately
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  let reversed = 0;
  // 32-bit integer limits
  const INT_MAX = Math.pow(2, 31) - 1;
  const INT_MIN = -Math.pow(2, 31);

  while (x !== 0) {
    // Get the last digit
    const digit = x % 10;

    // Check for overflow before updating reversed
    if (sign === 1) {
      // Positive overflow check
      if (reversed > Math.floor(INT_MAX / 10)) {
        return 0;
      }
      if (reversed === Math.floor(INT_MAX / 10) && digit > INT_MAX % 10) {
        return 0;
      }
    } else {
      // Negative overflow check
      // For negative numbers, we need to check if we'd go below INT_MIN
      // Since we're working with positive numbers, check against positive bound
      const positiveBound = Math.abs(INT_MIN);
      if (reversed > Math.floor(positiveBound / 10)) {
        return 0;
      }
      if (reversed === Math.floor(positiveBound / 10) && digit > positiveBound % 10) {
        return 0;
      }
    }

    // Update reversed number
    reversed = reversed * 10 + digit;

    // Remove last digit from original number
    x = Math.floor(x / 10);
  }

  // Apply the original sign
  return sign * reversed;
}
```

```java
// Time: O(log₁₀(n)) | Space: O(1)
class Solution {
    public int reverse(int x) {
        int reversed = 0;

        while (x != 0) {
            // Get the last digit
            int digit = x % 10;

            // Check for overflow before updating reversed
            // For positive overflow
            if (reversed > Integer.MAX_VALUE / 10) {
                return 0;
            }
            if (reversed == Integer.MAX_VALUE / 10 && digit > Integer.MAX_VALUE % 10) {
                return 0;
            }

            // For negative overflow
            if (reversed < Integer.MIN_VALUE / 10) {
                return 0;
            }
            if (reversed == Integer.MIN_VALUE / 10 && digit < Integer.MIN_VALUE % 10) {
                return 0;
            }

            // Update reversed number
            reversed = reversed * 10 + digit;

            // Remove last digit from original number
            x /= 10;
        }

        return reversed;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log₁₀(n))  
We process each digit of the input number exactly once. The number of digits in a base-10 number n is ⌊log₁₀(n)⌋ + 1, which gives us logarithmic time complexity.

**Space Complexity:** O(1)  
We use only a constant amount of extra space regardless of the input size. We store a few variables (reversed number, digit, sign) but no data structures that grow with input size.

## Common Mistakes

1. **Not handling overflow correctly**: The most common mistake is to reverse the number first and then check for overflow. By then, it's too late—the overflow has already occurred. Always check _before_ performing the operation that could cause overflow.

2. **Incorrect sign handling**: Forgetting to handle negative numbers properly, either by not preserving the sign or by incorrectly applying it to intermediate calculations. Work with absolute values and apply the sign at the end.

3. **Integer division quirks**: Different languages handle negative integer division differently. In Python, `-123 // 10 = -13` (floor division), while in Java and JavaScript, `-123 / 10 = -12` (truncation toward zero). This is why the Java solution handles signs differently than Python/JavaScript.

4. **Edge case with zero**: Forgetting that the loop condition `while (x != 0)` handles the case where x is 0 correctly, but some implementations might need special handling if they use do-while loops.

## When You'll See This Pattern

This digit manipulation pattern appears in several other problems:

1. **String to Integer (atoi)**: Similar overflow checking is required when converting strings to integers. You need to check before multiplying by 10 and adding the next digit.

2. **Palindrome Number**: To check if a number is a palindrome without converting to string, you can reverse half the digits and compare with the other half, using similar digit extraction techniques.

3. **Reverse Bits**: While working with bits instead of decimal digits, the concept of reversing by extracting the least significant "digit" (bit) and building the reversed result is identical.

## Key Takeaways

1. **Digit extraction pattern**: Use `x % 10` to get the last digit and `x // 10` (or equivalent) to remove it. This pattern works for any base (binary, decimal, hexadecimal).

2. **Preemptive overflow checking**: When working with fixed-width integers, always check if an operation would cause overflow _before_ performing it, not after.

3. **Separate concerns**: Handle sign, overflow, and digit reversal as separate concerns in your algorithm. This makes the logic clearer and easier to debug.

Related problems: [String to Integer (atoi)](/problem/string-to-integer-atoi), [Reverse Bits](/problem/reverse-bits), [A Number After a Double Reversal](/problem/a-number-after-a-double-reversal)
