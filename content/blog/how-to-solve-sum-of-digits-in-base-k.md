---
title: "How to Solve Sum of Digits in Base K — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sum of Digits in Base K. Easy difficulty, 78.5% acceptance rate. Topics: Math."
date: "2027-12-01"
category: "dsa-patterns"
tags: ["sum-of-digits-in-base-k", "math", "easy"]
---

# How to Solve Sum of Digits in Base K

This problem asks us to convert a base-10 integer `n` to base `k`, then sum its digits (treating each digit as a base-10 number), and return that sum in base 10. While the problem is mathematically straightforward, it tests your understanding of base conversion algorithms and careful implementation of digit extraction. The key insight is recognizing that we don't actually need to store the full converted number—we can compute the digit sum during the conversion process itself.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `n = 34` and `k = 6`.

**Step 1: Understanding base conversion**
We need to convert 34 from base 10 to base 6. The standard algorithm repeatedly divides by 6 and collects remainders:

- 34 ÷ 6 = 5 remainder 4 → least significant digit = 4
- 5 ÷ 6 = 0 remainder 5 → next digit = 5

So 34 in base 6 is "54" (which means 5×6¹ + 4×6⁰ = 30 + 4 = 34).

**Step 2: Summing the digits**
The digits are 5 and 4. Their sum is 5 + 4 = 9.

**Step 3: Observing the pattern**
Notice that during the conversion process, we naturally extract each digit as a remainder. Instead of storing these digits to form the full base-k representation, we can simply add each remainder to a running total as we compute it.

Let's trace the algorithm:

- Initialize `sum_digits = 0`
- First iteration: `34 ÷ 6 = 5 remainder 4` → `sum_digits += 4` (now 4)
- Second iteration: `5 ÷ 6 = 0 remainder 5` → `sum_digits += 5` (now 9)
- Since quotient is 0, we stop

This gives us the answer 9 without ever constructing the full base-6 representation.

## Brute Force Approach

A naive approach might involve:

1. Fully converting `n` to base `k` as a string or array
2. Iterating through each digit character
3. Converting each digit back to integer and summing

While this approach works correctly, it's unnecessarily complex. The main issue isn't time complexity (which remains O(logₖ n) for both approaches), but rather that it:

- Requires extra storage for the full base-k representation
- Involves unnecessary string/array operations
- Shows less understanding of the mathematical properties

However, in an interview, starting with this conceptual approach and then optimizing to the single-pass solution demonstrates good problem-solving skills.

## Optimal Solution

The optimal solution uses the standard base conversion algorithm but accumulates the sum of remainders instead of storing them. We repeatedly:

1. Get the remainder when dividing `n` by `k` (this is the current least significant digit)
2. Add that remainder to our running sum
3. Update `n` to be the quotient
4. Repeat until `n` becomes 0

<div class="code-group">

```python
# Time: O(logₖ n) | Space: O(1)
def sumBase(n: int, k: int) -> int:
    """
    Convert n from base 10 to base k and return sum of digits.

    Args:
        n: Base-10 integer to convert
        k: Target base for conversion

    Returns:
        Sum of digits after conversion to base k
    """
    digit_sum = 0

    # Continue until n becomes 0
    while n > 0:
        # Remainder when dividing by k gives the current least significant digit
        digit = n % k

        # Add this digit to our running sum
        digit_sum += digit

        # Remove the processed digit by integer division
        n //= k

    return digit_sum
```

```javascript
// Time: O(logₖ n) | Space: O(1)
/**
 * Convert n from base 10 to base k and return sum of digits.
 *
 * @param {number} n - Base-10 integer to convert
 * @param {number} k - Target base for conversion
 * @return {number} Sum of digits after conversion to base k
 */
function sumBase(n, k) {
  let digitSum = 0;

  // Continue until n becomes 0
  while (n > 0) {
    // Remainder when dividing by k gives the current least significant digit
    const digit = n % k;

    // Add this digit to our running sum
    digitSum += digit;

    // Remove the processed digit by integer division
    n = Math.floor(n / k);
  }

  return digitSum;
}
```

```java
// Time: O(logₖ n) | Space: O(1)
class Solution {
    /**
     * Convert n from base 10 to base k and return sum of digits.
     *
     * @param n Base-10 integer to convert
     * @param k Target base for conversion
     * @return Sum of digits after conversion to base k
     */
    public int sumBase(int n, int k) {
        int digitSum = 0;

        // Continue until n becomes 0
        while (n > 0) {
            // Remainder when dividing by k gives the current least significant digit
            int digit = n % k;

            // Add this digit to our running sum
            digitSum += digit;

            // Remove the processed digit by integer division
            n /= k;
        }

        return digitSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(logₖ n)**

- Each iteration of the while loop reduces `n` by a factor of `k` (since we do `n //= k`)
- The number of iterations equals the number of digits in the base-`k` representation of `n`, which is ⌊logₖ n⌋ + 1
- For example, if `n = 1000` and `k = 10`, we need 4 iterations (digits: 1, 0, 0, 0)

**Space Complexity: O(1)**

- We only use a constant amount of extra space: `digit_sum` and loop variables
- No additional data structures that grow with input size

## Common Mistakes

1. **Infinite loop with negative `n`**: The problem states `n` is an integer, but doesn't specify it's non-negative. However, in practice, `n` is given as non-negative. Still, some candidates add unnecessary handling for negative numbers. The correct approach: since base conversion for negative numbers is more complex and the problem implies `n ≥ 0`, we can assume `n ≥ 0`.

2. **Forgetting integer division**: Using regular division (`/`) instead of integer division (`//`, `Math.floor()`, or `/` in Java) will cause issues. In Python, `n / k` returns a float; in JavaScript, it returns a float unless you use `Math.floor()`; in Java, `/` with integers does integer division.

3. **Off-by-one with loop condition**: Using `while n >= k` instead of `while n > 0` will miss the final digit when `n < k`. For example, with `n = 5, k = 10`, we need to process the digit 5, but `while n >= k` would skip it entirely.

4. **Overcomplicating with string conversion**: Some candidates convert to string representation first, then sum digits. While this works, it's less efficient in terms of both time (extra conversions) and space (storing the string).

## When You'll See This Pattern

This problem uses the **digit extraction via division and modulus** pattern, which appears in many number theory and base conversion problems:

1. **Palindrome Number (LeetCode 9)**: To check if a number is a palindrome without converting to string, you extract digits using similar division/modulus operations and build the reversed number.

2. **Happy Number (LeetCode 202)**: You repeatedly sum the squares of digits, which requires extracting digits via `n % 10` and `n //= 10`.

3. **Add Digits (LeetCode 258)**: The digital root problem where you repeatedly sum digits until getting a single digit uses the same digit extraction technique.

4. **Base conversion problems**: Any problem involving converting between bases (like "Convert to Base -2" LeetCode 1017) uses this core algorithm.

The pattern is: when you need to process digits of a number, think about using `n % base` to get the current digit and `n //= base` to remove it, rather than converting to string.

## Key Takeaways

1. **Digit extraction without strings**: For numerical digit manipulation problems, using modulus and integer division is often cleaner and more efficient than converting to strings.

2. **Process during conversion**: When you need both a conversion and some computation on the result, see if you can compute during the conversion process rather than after. This often saves time and space.

3. **Base conversion fundamentals**: Remember that converting from base 10 to base k involves repeatedly dividing by k and collecting remainders in reverse order. The number of iterations equals the number of digits in the result.

4. **Edge case awareness**: Always consider what happens when `n = 0` (our loop won't execute, returning 0, which is correct since 0 in any base is just "0" with digit sum 0).

Related problems: [Count Symmetric Integers](/problem/count-symmetric-integers)
