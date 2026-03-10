---
title: "How to Solve Compute Decimal Representation — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Compute Decimal Representation. Easy difficulty, 64.6% acceptance rate. Topics: Array, Math."
date: "2028-04-20"
category: "dsa-patterns"
tags: ["compute-decimal-representation", "array", "math", "easy"]
---

# How to Solve Compute Decimal Representation

This problem asks us to express any positive integer `n` as a sum of "base-10 components" — numbers like 500, 30, or 7 that are formed by multiplying a digit (1-9) by a power of 10. What makes this interesting is that it's essentially asking us to break down a number into its place value representation, but with a twist: we can only use components where the digit is non-zero. This is actually the standard way we write numbers in decimal form!

## Visual Walkthrough

Let's trace through `n = 537` step by step:

1. **Start with the ones place**: 537 ÷ 10⁰ = 537, remainder 0
   - The digit in ones place is 7 (537 % 10 = 7)
   - Since 7 ≠ 0, we create component: 7 × 10⁰ = 7
   - Remove this from consideration: 537 - 7 = 530

2. **Move to tens place**: 530 ÷ 10¹ = 53, remainder 0
   - The digit in tens place is 3 (53 % 10 = 3)
   - Since 3 ≠ 0, we create component: 3 × 10¹ = 30
   - Remove: 530 - 30 = 500

3. **Move to hundreds place**: 500 ÷ 10² = 5, remainder 0
   - The digit in hundreds place is 5 (5 % 10 = 5)
   - Since 5 ≠ 0, we create component: 5 × 10² = 500
   - Remove: 500 - 500 = 0

4. **We're done!** The components are [500, 30, 7]

Notice that we're essentially extracting digits from right to left (least significant to most significant), and whenever we find a non-zero digit `d` at position `p` (where position 0 is ones, 1 is tens, etc.), we add `d × 10^p` to our result.

## Brute Force Approach

A naive approach might try to generate all possible base-10 components and check combinations that sum to `n`. However, this would be extremely inefficient:

1. Generate all base-10 components less than or equal to `n`
2. Try all combinations of these components
3. Check if any combination sums to `n`

The problem with this approach is that the number of combinations grows exponentially with the number of digits in `n`. For a number with `d` digits, there could be up to `9 × d` possible components (digit 1-9 at each position), leading to `2^(9d)` possible combinations to check. This is clearly infeasible for even moderately sized numbers.

The key insight is that there's exactly one valid decomposition for any given `n` — it's just the standard decimal representation! We don't need to search for combinations; we can construct the answer directly.

## Optimal Solution

The optimal solution extracts digits from right to left (least significant to most significant). For each position, we check if the current digit is non-zero, and if so, we add the corresponding component to our result list.

<div class="code-group">

```python
# Time: O(d) where d is number of digits in n | Space: O(d) for output list
def decimalRepresentation(n):
    """
    Express n as a sum of base-10 components.

    A base-10 component is a number of the form d * 10^p where:
    - d is a digit from 1 to 9
    - p is a non-negative integer (power of 10)

    This is essentially the standard decimal representation.
    """
    result = []  # Will store our base-10 components
    power = 0    # Current power of 10 (10^0 = 1 for ones place)

    # Process n digit by digit from right to left
    while n > 0:
        # Get the current digit (ones place of remaining number)
        digit = n % 10

        # If digit is non-zero, it contributes a component
        if digit != 0:
            # Calculate the component: digit * 10^power
            component = digit * (10 ** power)
            result.append(component)

        # Remove the processed digit from n
        n //= 10

        # Move to next position (next power of 10)
        power += 1

    # The components are collected from least to most significant,
    # but typically we want them in descending order
    return result[::-1]  # Reverse to get most significant first
```

```javascript
// Time: O(d) where d is number of digits in n | Space: O(d) for output array
function decimalRepresentation(n) {
  /**
   * Express n as a sum of base-10 components.
   *
   * A base-10 component is a number of the form d * 10^p where:
   * - d is a digit from 1 to 9
   * - p is a non-negative integer (power of 10)
   *
   * This is essentially the standard decimal representation.
   */
  const result = []; // Will store our base-10 components
  let power = 0; // Current power of 10 (10^0 = 1 for ones place)

  // Process n digit by digit from right to left
  while (n > 0) {
    // Get the current digit (ones place of remaining number)
    const digit = n % 10;

    // If digit is non-zero, it contributes a component
    if (digit !== 0) {
      // Calculate the component: digit * 10^power
      const component = digit * Math.pow(10, power);
      result.push(component);
    }

    // Remove the processed digit from n
    n = Math.floor(n / 10);

    // Move to next position (next power of 10)
    power++;
  }

  // The components are collected from least to most significant,
  // but typically we want them in descending order
  return result.reverse(); // Reverse to get most significant first
}
```

```java
// Time: O(d) where d is number of digits in n | Space: O(d) for output list
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Solution {
    public List<Integer> decimalRepresentation(int n) {
        /**
         * Express n as a sum of base-10 components.
         *
         * A base-10 component is a number of the form d * 10^p where:
         * - d is a digit from 1 to 9
         * - p is a non-negative integer (power of 10)
         *
         * This is essentially the standard decimal representation.
         */
        List<Integer> result = new ArrayList<>();  // Will store our base-10 components
        int power = 0;  // Current power of 10 (10^0 = 1 for ones place)

        // Process n digit by digit from right to left
        while (n > 0) {
            // Get the current digit (ones place of remaining number)
            int digit = n % 10;

            // If digit is non-zero, it contributes a component
            if (digit != 0) {
                // Calculate the component: digit * 10^power
                int component = digit * (int)Math.pow(10, power);
                result.add(component);
            }

            // Remove the processed digit from n
            n /= 10;

            // Move to next position (next power of 10)
            power++;
        }

        // The components are collected from least to most significant,
        // but typically we want them in descending order
        Collections.reverse(result);  // Reverse to get most significant first
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(d)** where `d` is the number of digits in `n`.

- We process each digit exactly once in the while loop
- Each iteration does constant work: modulo, division, multiplication, and list append
- The reverse operation at the end is also O(d)

**Space Complexity: O(d)** for the output list

- In the worst case, every digit is non-zero, so we store `d` components
- The auxiliary space (excluding output) is O(1) since we only use a few variables

## Common Mistakes

1. **Forgetting to handle the digit 0**: The most common error is including components for zero digits. Remember: 0 × 10^p = 0, which is not a valid base-10 component (and wouldn't contribute to the sum anyway). Always check `if digit != 0` before creating a component.

2. **Wrong order of components**: The algorithm naturally collects components from least to most significant (ones place first). Many candidates forget to reverse the list at the end, resulting in output like `[7, 30, 500]` instead of `[500, 30, 7]`. While both are mathematically correct, the problem typically expects descending order.

3. **Infinite loop with n = 0**: The problem states `n` is positive, but some candidates might still write code that handles 0 incorrectly. If you accidentally write `while n >= 0` instead of `while n > 0`, you'll get an infinite loop when n reaches 0.

4. **Integer overflow with large powers**: When calculating `10^power`, be careful with very large numbers. In practice, since `n` is an integer input, `power` won't exceed about 10 (for 32-bit integers) or 19 (for 64-bit integers), so this isn't usually a problem. But it's good practice to use built-in power functions rather than manual multiplication in a loop.

## When You'll See This Pattern

This digit extraction pattern appears in many number manipulation problems:

1. **Palindrome Number (LeetCode 9)**: Check if a number reads the same forwards and backwards by reversing its digits using similar modulo/division operations.

2. **Reverse Integer (LeetCode 7)**: Reverse the digits of an integer using the same digit extraction technique.

3. **Add Digits (LeetCode 258)**: Repeatedly sum digits until getting a single digit, using digit extraction in a loop.

4. **Self Dividing Numbers (LeetCode 728)**: Check if a number is divisible by each of its digits, requiring digit extraction.

The core technique is always the same: use `n % 10` to get the last digit, then `n //= 10` to remove it, repeating until `n == 0`.

## Key Takeaways

1. **Digit extraction is a fundamental skill**: The pattern `digit = n % 10; n //= 10` is essential for many number manipulation problems. Practice it until it's automatic.

2. **Process numbers from least to most significant**: When working with decimal numbers, it's often easiest to start from the ones place and work upward. You can always reverse the results if needed.

3. **Zero digits are special cases**: In many digit-based problems, zero requires special handling. Always ask: "What should happen when a digit is zero?"

4. **This problem reveals the connection between algorithms and mathematical concepts**: The solution shows that the standard decimal representation is actually an algorithm for decomposing numbers into place values.

[Practice this problem on CodeJeet](/problem/compute-decimal-representation)
