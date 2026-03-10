---
title: "How to Solve Smallest Value of the Rearranged Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest Value of the Rearranged Number. Medium difficulty, 53.4% acceptance rate. Topics: Math, Sorting."
date: "2028-08-24"
category: "dsa-patterns"
tags: ["smallest-value-of-the-rearranged-number", "math", "sorting", "medium"]
---

# How to Solve Smallest Value of the Rearranged Number

You're given an integer `num` and must rearrange its digits to create the smallest possible number without leading zeros, while preserving the original sign. The challenge lies in handling both positive and negative numbers differently: for positives, we want the smallest digits first, but for negatives, we want the largest digits first (since -900 < -100). The "no leading zeros" constraint adds another layer of complexity.

## Visual Walkthrough

Let's trace through two examples to build intuition:

**Example 1: Positive number (310)**

- Digits: [3, 1, 0]
- Sort ascending: [0, 1, 3]
- But we can't have leading zeros! So we find the smallest non-zero digit (1) and move it to the front
- Result: [1, 0, 3] → 103

**Example 2: Negative number (-7605)**

- Digits: [7, 6, 0, 5] (ignore the negative sign for now)
- For negative numbers, we want the largest possible magnitude to make it more negative
- Sort descending: [7, 6, 5, 0]
- Apply negative sign: -7650
- Wait, that's actually -7650, which is smaller than -7605? Let's check: -7650 < -7605 ✓

The key insight: For positive numbers, we sort digits ascending but handle the leading zero case. For negative numbers, we sort digits descending (largest digits first) to make the number as negative as possible.

## Brute Force Approach

A naive approach would generate all permutations of the digits, filter out those with leading zeros, and find the minimum value. For a number with `n` digits:

1. Convert the number to a list of digits
2. Generate all permutations of the digits (n! possibilities)
3. For each permutation, check if it has no leading zero
4. Keep track of the minimum valid number

This approach has O(n! × n) time complexity, which is completely impractical for numbers with more than 10 digits. Even for moderate inputs like 123456789 (9 digits), we'd have 362,880 permutations to check.

The brute force fails because it doesn't leverage the mathematical properties of digit rearrangement. We need a smarter approach that works in O(n log n) time.

## Optimized Approach

The optimal solution uses these key insights:

1. **Separate positive and negative cases**: The strategy differs based on the sign
2. **Positive numbers**:
   - Sort digits in ascending order
   - If the smallest digit is 0, find the next smallest non-zero digit and swap it to the front
3. **Negative numbers**:
   - Sort digits in descending order (largest first)
   - No leading zero issue since negative numbers start with '-'
4. **Zero case**: If the number is 0, return 0

The reasoning: For positive numbers, we want the smallest possible value, so we put the smallest digits first. But we can't start with 0, so we find the smallest non-zero digit for the first position. For negative numbers, we want the most negative value (smallest), which means we want the largest possible magnitude, achieved by putting the largest digits first.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) where n is number of digits | Space: O(n)
def smallestNumber(self, num: int) -> int:
    # Handle the zero case immediately
    if num == 0:
        return 0

    # Separate positive and negative cases
    if num > 0:
        # Convert number to list of characters for easy manipulation
        digits = list(str(num))

        # Sort digits in ascending order for smallest number
        digits.sort()

        # Handle leading zero case
        if digits[0] == '0':
            # Find the first non-zero digit to swap with the leading zero
            for i in range(1, len(digits)):
                if digits[i] != '0':
                    # Swap the first non-zero digit with the leading zero
                    digits[0], digits[i] = digits[i], digits[0]
                    break

        # Convert back to integer
        return int(''.join(digits))

    else:  # num < 0
        # For negative numbers, remove the negative sign
        digits = list(str(num)[1:])  # Skip the '-' character

        # Sort digits in descending order to make number as negative as possible
        # (largest magnitude = most negative)
        digits.sort(reverse=True)

        # Convert back to integer and reapply negative sign
        return -int(''.join(digits))
```

```javascript
// Time: O(n log n) where n is number of digits | Space: O(n)
var smallestNumber = function (num) {
  // Handle the zero case immediately
  if (num === 0) return 0;

  // Separate positive and negative cases
  if (num > 0) {
    // Convert number to array of characters for easy manipulation
    const digits = num.toString().split("");

    // Sort digits in ascending order for smallest number
    digits.sort();

    // Handle leading zero case
    if (digits[0] === "0") {
      // Find the first non-zero digit to swap with the leading zero
      for (let i = 1; i < digits.length; i++) {
        if (digits[i] !== "0") {
          // Swap the first non-zero digit with the leading zero
          [digits[0], digits[i]] = [digits[i], digits[0]];
          break;
        }
      }
    }

    // Convert back to integer
    return parseInt(digits.join(""));
  } else {
    // num < 0
    // For negative numbers, remove the negative sign
    const digits = num.toString().slice(1).split("");

    // Sort digits in descending order to make number as negative as possible
    // (largest magnitude = most negative)
    digits.sort((a, b) => b.localeCompare(a));

    // Convert back to integer and reapply negative sign
    return -parseInt(digits.join(""));
  }
};
```

```java
// Time: O(n log n) where n is number of digits | Space: O(n)
class Solution {
    public long smallestNumber(long num) {
        // Handle the zero case immediately
        if (num == 0) return 0;

        // Separate positive and negative cases
        if (num > 0) {
            // Convert number to character array for easy manipulation
            char[] digits = Long.toString(num).toCharArray();

            // Sort digits in ascending order for smallest number
            Arrays.sort(digits);

            // Handle leading zero case
            if (digits[0] == '0') {
                // Find the first non-zero digit to swap with the leading zero
                for (int i = 1; i < digits.length; i++) {
                    if (digits[i] != '0') {
                        // Swap the first non-zero digit with the leading zero
                        char temp = digits[0];
                        digits[0] = digits[i];
                        digits[i] = temp;
                        break;
                    }
                }
            }

            // Convert back to long
            return Long.parseLong(new String(digits));
        } else {  // num < 0
            // For negative numbers, remove the negative sign
            String numStr = Long.toString(num).substring(1);  // Skip the '-' character
            char[] digits = numStr.toCharArray();

            // Sort digits in descending order to make number as negative as possible
            // (largest magnitude = most negative)
            Arrays.sort(digits);
            // Reverse the sorted array to get descending order
            for (int i = 0; i < digits.length / 2; i++) {
                char temp = digits[i];
                digits[i] = digits[digits.length - 1 - i];
                digits[digits.length - 1 - i] = temp;
            }

            // Convert back to long and reapply negative sign
            return -Long.parseLong(new String(digits));
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Converting the number to a string/list of digits: O(n)
- Sorting the digits: O(n log n) using standard comparison sort
- Finding and swapping the first non-zero digit (positive case): O(n) in worst case
- Overall dominated by the sorting step: O(n log n)

**Space Complexity: O(n)**

- Storing the digits as a list/array: O(n)
- Temporary variables: O(1)
- Total: O(n) for the digit array

Where `n` is the number of digits in the input number.

## Common Mistakes

1. **Forgetting the zero case**: When the input is 0, we should return 0 immediately. Some candidates try to process it and get errors or incorrect results.

2. **Incorrect handling of negative numbers**: The most common mistake is treating negative numbers the same as positive ones. Remember: for negative numbers, we want the largest digits first to make the number as negative as possible.

3. **Leading zero handling in positive numbers**: Simply sorting ascending and converting to integer doesn't work when the smallest digit is 0. You must find the smallest non-zero digit and move it to the front.

4. **Using integer division instead of string manipulation**: While you could extract digits using `num % 10` and `num // 10`, string manipulation is cleaner and handles edge cases better (like numbers with many digits that might overflow).

## When You'll See This Pattern

This problem combines sorting with special case handling, a pattern seen in many interview problems:

1. **Largest Number (LeetCode 179)**: Similar concept but for creating the largest number from an array of numbers. Requires custom comparator and handling of leading zeros.

2. **Maximum Swap (LeetCode 670)**: Also involves rearranging digits for optimal value, but with the constraint of only one swap allowed.

3. **Next Permutation (LeetCode 31)**: Finding the next lexicographically greater permutation of digits, which involves similar digit manipulation logic.

The core pattern is: when you need to rearrange elements (digits, numbers, strings) to optimize some property (min/max value, lexicographic order), sorting is often the first approach to consider, with special handling for edge cases.

## Key Takeaways

1. **Different strategies for different signs**: For minimization problems involving signed numbers, positive and negative cases often require opposite approaches. Positive → smallest digits first; negative → largest digits first.

2. **Leading zero constraint changes the game**: Simple sorting isn't enough when you have constraints like "no leading zeros." You need to handle the special case where the optimal position would violate the constraint.

3. **String manipulation is often cleaner for digit problems**: Converting numbers to strings makes digit extraction and rearrangement more straightforward than using modulo and division operations.

Related problems: [Largest Number](/problem/largest-number)
