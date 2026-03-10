---
title: "How to Solve Harshad Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Harshad Number. Easy difficulty, 83.4% acceptance rate. Topics: Math."
date: "2027-05-05"
category: "dsa-patterns"
tags: ["harshad-number", "math", "easy"]
---

# How to Solve Harshad Number

This problem asks us to determine if an integer is a Harshad number — a number divisible by the sum of its digits. If it is, we return that digit sum; otherwise, we return -1. While the concept is straightforward, the challenge lies in correctly extracting digits from a number and handling edge cases like negative numbers (though the problem typically assumes non-negative inputs) and the number 0.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we're given `x = 18`.

**Step 1: Calculate the sum of digits**

- 18 has digits 1 and 8
- Sum = 1 + 8 = 9

**Step 2: Check divisibility**

- We need to check if 18 is divisible by 9
- 18 ÷ 9 = 2 with remainder 0
- Since remainder is 0, 18 is divisible by 9

**Step 3: Return appropriate value**

- Since 18 is a Harshad number, we return the digit sum: 9

Now let's try `x = 19`:

- Digits: 1 and 9 → sum = 10
- 19 ÷ 10 = 1 with remainder 9
- Not divisible, so return -1

The key insight is that we need to:

1. Calculate the sum of digits (even for single-digit numbers)
2. Check if the original number is divisible by this sum
3. Return the sum if divisible, -1 otherwise

## Brute Force Approach

For this problem, there's essentially only one reasonable approach since the operations are inherently linear in the number of digits. However, a "brute force" way to think about it would be to convert the number to a string and process each character:

1. Convert the integer to a string
2. Iterate through each character
3. Convert each character back to integer and sum them
4. Check divisibility

While this isn't truly "brute force" in the sense of being inefficient (it's actually optimal), some candidates might overcomplicate it by:

- Using string manipulation when direct mathematical operations would suffice
- Creating unnecessary data structures
- Not handling edge cases like 0 properly

The mathematical approach using modulo and division is cleaner and avoids string conversion overhead.

## Optimal Solution

The optimal solution uses mathematical operations to extract digits one by one while calculating their sum. We preserve the original number to check divisibility, then use the digit sum to determine if it's a Harshad number.

<div class="code-group">

```python
# Time: O(d) where d is number of digits in x | Space: O(1)
def sumOfTheDigitsOfHarshadNumber(x: int) -> int:
    """
    Determines if x is a Harshad number and returns the digit sum if true, -1 otherwise.

    A Harshad number is divisible by the sum of its digits.
    """
    original = x  # Store original value since we'll modify x
    digit_sum = 0

    # Calculate sum of digits
    # We use absolute value to handle negative numbers gracefully
    # (though problem typically assumes non-negative)
    temp = abs(x)
    while temp > 0:
        # Extract last digit using modulo 10
        last_digit = temp % 10
        # Add to running sum
        digit_sum += last_digit
        # Remove last digit using integer division
        temp //= 10

    # Special case: x = 0
    # 0 is divisible by any number except 0 itself
    # By definition, 0 is considered a Harshad number
    if original == 0:
        return 0

    # Check if original number is divisible by digit sum
    # Important: digit_sum cannot be 0 (except when x=0, which we handled)
    if digit_sum > 0 and original % digit_sum == 0:
        return digit_sum
    else:
        return -1
```

```javascript
// Time: O(d) where d is number of digits in x | Space: O(1)
/**
 * Determines if x is a Harshad number and returns the digit sum if true, -1 otherwise.
 * A Harshad number is divisible by the sum of its digits.
 * @param {number} x - The number to check
 * @return {number} - Digit sum if Harshad, -1 otherwise
 */
function sumOfTheDigitsOfHarshadNumber(x) {
  let original = x; // Store original value since we'll modify x
  let digitSum = 0;

  // Calculate sum of digits
  // Use absolute value to handle negative numbers gracefully
  let temp = Math.abs(x);
  while (temp > 0) {
    // Extract last digit using modulo 10
    const lastDigit = temp % 10;
    // Add to running sum
    digitSum += lastDigit;
    // Remove last digit using integer division
    temp = Math.floor(temp / 10);
  }

  // Special case: x = 0
  // 0 is divisible by any number except 0 itself
  // By definition, 0 is considered a Harshad number
  if (original === 0) {
    return 0;
  }

  // Check if original number is divisible by digit sum
  // Important: digitSum cannot be 0 (except when x=0, which we handled)
  if (digitSum > 0 && original % digitSum === 0) {
    return digitSum;
  } else {
    return -1;
  }
}
```

```java
// Time: O(d) where d is number of digits in x | Space: O(1)
class Solution {
    /**
     * Determines if x is a Harshad number and returns the digit sum if true, -1 otherwise.
     * A Harshad number is divisible by the sum of its digits.
     * @param x - The number to check
     * @return Digit sum if Harshad, -1 otherwise
     */
    public int sumOfTheDigitsOfHarshadNumber(int x) {
        int original = x;  // Store original value since we'll modify x
        int digitSum = 0;

        // Calculate sum of digits
        // Use absolute value to handle negative numbers gracefully
        int temp = Math.abs(x);
        while (temp > 0) {
            // Extract last digit using modulo 10
            int lastDigit = temp % 10;
            // Add to running sum
            digitSum += lastDigit;
            // Remove last digit using integer division
            temp /= 10;
        }

        // Special case: x = 0
        // 0 is divisible by any number except 0 itself
        // By definition, 0 is considered a Harshad number
        if (original == 0) {
            return 0;
        }

        // Check if original number is divisible by digit sum
        // Important: digitSum cannot be 0 (except when x=0, which we handled)
        if (digitSum > 0 && original % digitSum == 0) {
            return digitSum;
        } else {
            return -1;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(d)**

- Where `d` is the number of digits in the input number `x`
- We process each digit exactly once in the while loop
- In terms of `x` itself, this is O(log₁₀ x) since a number with `d` digits satisfies 10^(d-1) ≤ x < 10^d

**Space Complexity: O(1)**

- We use only a constant amount of extra space regardless of input size
- Variables: `original`, `digit_sum`, `temp`, `last_digit` (or equivalents in other languages)
- No data structures that grow with input size

## Common Mistakes

1. **Not handling the number 0 correctly**: 0 is a special case because the sum of its digits is 0, and division by 0 is undefined. By mathematical convention, 0 is considered a Harshad number, and we should return 0. Many candidates forget this edge case.

2. **Modifying the original number without saving it**: If you calculate the digit sum by modifying `x` directly (using `x //= 10` or similar), you lose the original value needed for the divisibility check. Always store the original in a separate variable.

3. **Incorrect digit extraction for negative numbers**: While the problem likely assumes non-negative inputs, robust code should handle negatives gracefully. Using `abs(x)` when calculating digit sum avoids issues with negative modulo operations in some languages.

4. **Using string conversion unnecessarily**: While converting to string and summing characters works, it's less efficient and shows weaker mathematical reasoning. Interviewers prefer the mathematical approach using `% 10` and `// 10` (or `/ 10` with floor in JavaScript).

## When You'll See This Pattern

The digit extraction pattern (`n % 10` to get last digit, `n // 10` to remove it) appears in many number manipulation problems:

1. **Palindrome Number (LeetCode 9)**: Check if a number reads the same forwards and backwards by reversing its digits using the same extraction technique.

2. **Reverse Integer (LeetCode 7)**: Reverse the digits of an integer using digit extraction and reconstruction.

3. **Add Digits (LeetCode 258)**: Repeatedly sum digits until a single digit remains, using the same digit extraction approach.

4. **Self Dividing Numbers (LeetCode 728)**: Check if a number is divisible by each of its digits, requiring similar digit extraction logic.

These problems all require breaking a number down into its constituent digits to perform operations on them.

## Key Takeaways

1. **Digit extraction is a fundamental skill**: The pattern `digit = n % 10` followed by `n = n // 10` (or integer division equivalent) is essential for many number-based problems. Practice it until it's automatic.

2. **Always preserve original values**: When you need to modify a variable but also need its original value later, store it in a separate variable before making changes.

3. **Consider edge cases early**: For number problems, always think about 0, negative numbers, large numbers, and boundary conditions. These often reveal themselves during the walkthrough phase if you're systematic.

4. **Mathematical approaches often beat string conversion**: While string manipulation can be more readable, mathematical operations are usually more efficient and demonstrate stronger algorithmic thinking.

[Practice this problem on CodeJeet](/problem/harshad-number)
