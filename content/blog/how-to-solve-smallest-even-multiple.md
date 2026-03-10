---
title: "How to Solve Smallest Even Multiple — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Smallest Even Multiple. Easy difficulty, 88.3% acceptance rate. Topics: Math, Number Theory."
date: "2028-02-15"
category: "dsa-patterns"
tags: ["smallest-even-multiple", "math", "number-theory", "easy"]
---

# How to Solve Smallest Even Multiple

You're given a positive integer `n` and need to find the smallest positive integer that is divisible by both 2 and `n`. While this seems straightforward, the trick lies in recognizing the mathematical relationship between the numbers rather than brute-forcing through possibilities. This problem tests your ability to identify patterns and apply basic number theory concepts efficiently.

## Visual Walkthrough

Let's trace through a few examples to build intuition:

**Example 1: n = 5**

- We need a number divisible by both 2 and 5
- Check multiples of 5: 5, 10, 15, 20...
- 5 ÷ 2 = 2.5 ❌ (not divisible by 2)
- 10 ÷ 2 = 5 ✅ (divisible by 2)
- Smallest positive integer divisible by both 2 and 5 is 10

**Example 2: n = 6**

- Check multiples of 6: 6, 12, 18, 24...
- 6 ÷ 2 = 3 ✅ (divisible by 2)
- Smallest positive integer divisible by both 2 and 6 is 6

**Example 3: n = 7**

- Check multiples of 7: 7, 14, 21, 28...
- 7 ÷ 2 = 3.5 ❌
- 14 ÷ 2 = 7 ✅
- Smallest positive integer divisible by both 2 and 7 is 14

Notice a pattern: When `n` is even, the answer is `n` itself. When `n` is odd, the answer is `n × 2`. This is because:

- If `n` is even, it's already divisible by 2, so the smallest common multiple is `n`
- If `n` is odd, we need to multiply by 2 to make it even, giving us `n × 2`

## Brute Force Approach

A naive approach would be to start checking numbers from 1 upward until we find one divisible by both 2 and `n`:

1. Start with `i = 1`
2. Check if `i` is divisible by 2 (`i % 2 == 0`) and divisible by `n` (`i % n == 0`)
3. If yes, return `i`
4. Otherwise, increment `i` and repeat

While this approach works, it's inefficient because:

- It checks many unnecessary numbers
- For odd `n`, it would check `n/2` numbers before finding the answer
- The time complexity is O(n) in the worst case, which is unnecessary for such a simple mathematical relationship

The brute force solution fails to recognize the mathematical insight that allows us to solve this in O(1) time and space.

## Optimal Solution

The optimal solution uses a simple mathematical observation: The smallest number divisible by both 2 and `n` is either `n` (if `n` is even) or `2 × n` (if `n` is odd). We can express this concisely using the modulo operator or bit manipulation.

Here's the reasoning:

1. If `n` is divisible by 2 (`n % 2 == 0`), then `n` itself is divisible by both 2 and `n`
2. If `n` is not divisible by 2 (`n % 2 == 1`), then we need to multiply by 2 to make it even, giving us `2 × n`

An even more concise approach uses the least common multiple (LCM) formula: `LCM(a, b) = (a × b) / GCD(a, b)`. For `a = 2` and `b = n`, this becomes `(2 × n) / GCD(2, n)`. Since GCD(2, n) is 1 when `n` is odd and 2 when `n` is even, this formula gives us the same result.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def smallestEvenMultiple(n: int) -> int:
    """
    Returns the smallest positive integer that is a multiple of both 2 and n.

    Approach: If n is even, n itself is divisible by 2. If n is odd,
    we need to multiply by 2 to make it even.

    Args:
        n: A positive integer

    Returns:
        The smallest positive integer divisible by both 2 and n
    """
    # Check if n is even using modulo operator
    if n % 2 == 0:
        # n is already even, so it's divisible by 2
        return n
    else:
        # n is odd, multiply by 2 to make it even
        return n * 2

# Alternative one-liner using LCM formula:
# def smallestEvenMultiple(n: int) -> int:
#     return (2 * n) // math.gcd(2, n)
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Returns the smallest positive integer that is a multiple of both 2 and n.
 *
 * Approach: If n is even, n itself is divisible by 2. If n is odd,
 * we need to multiply by 2 to make it even.
 *
 * @param {number} n - A positive integer
 * @return {number} The smallest positive integer divisible by both 2 and n
 */
function smallestEvenMultiple(n) {
  // Check if n is even using modulo operator
  if (n % 2 === 0) {
    // n is already even, so it's divisible by 2
    return n;
  } else {
    // n is odd, multiply by 2 to make it even
    return n * 2;
  }
}

// Alternative one-liner using bit manipulation (even faster):
// function smallestEvenMultiple(n) {
//     // If last bit is 0, n is even; if last bit is 1, n is odd
//     return (n & 1) ? n * 2 : n;
// }
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Returns the smallest positive integer that is a multiple of both 2 and n.
     *
     * Approach: If n is even, n itself is divisible by 2. If n is odd,
     * we need to multiply by 2 to make it even.
     *
     * @param n A positive integer
     * @return The smallest positive integer divisible by both 2 and n
     */
    public int smallestEvenMultiple(int n) {
        // Check if n is even using modulo operator
        if (n % 2 == 0) {
            // n is already even, so it's divisible by 2
            return n;
        } else {
            // n is odd, multiply by 2 to make it even
            return n * 2;
        }
    }

    // Alternative using bit manipulation:
    // public int smallestEvenMultiple(int n) {
    //     // If last bit is 0, n is even; if last bit is 1, n is odd
    //     return (n & 1) == 1 ? n * 2 : n;
    // }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- The solution performs a constant number of operations: one modulo check and possibly one multiplication
- No loops or recursion, so execution time doesn't scale with input size

**Space Complexity: O(1)**

- Only uses a constant amount of extra space for the input parameter and return value
- No additional data structures that grow with input size

## Common Mistakes

1. **Overcomplicating with loops**: Many candidates start with a brute force loop from 1 upward, checking each number. While this works, it's inefficient and shows a lack of mathematical insight. Always look for patterns before coding.

2. **Incorrect handling of edge cases**:
   - Forgetting that `n` is guaranteed to be positive (no need to handle negative numbers)
   - Not considering `n = 1` (should return 2, since 1 is odd)
   - Not considering large `n` values (the solution should still work efficiently)

3. **Misunderstanding the problem requirements**: Some candidates think they need to find the smallest number divisible by 2 OR `n`, not AND. The problem clearly states "multiple of both 2 and n," meaning it must be divisible by both.

4. **Inefficient modulo operations**: Using `n % 2 == 0` is perfectly fine, but some candidates try to optimize prematurely with bit operations (`n & 1 == 0`) without understanding why it works. While bit operations are slightly faster, clarity is more important in interviews unless performance is critical.

## When You'll See This Pattern

This problem introduces the concept of **least common multiple (LCM)** in disguise. The pattern of finding common multiples or divisors appears frequently in coding problems:

1. **Greatest Common Divisor of Strings (Easy)**: While about strings, it uses the same mathematical concept of finding common divisors. The solution involves finding the GCD of string lengths.

2. **Find Greatest Common Divisor of Array (Easy)**: Directly applies the GCD concept to find the greatest common divisor of all elements in an array.

3. **Water and Jug Problem (Medium)**: Uses number theory and the concept of GCD to determine if a target volume can be measured.

4. **Fraction Addition and Subtraction (Medium)**: Requires finding common denominators, which involves LCM calculations.

The key insight is recognizing when a problem can be reduced to basic number theory concepts like divisibility, GCD, or LCM rather than brute-forcing through possibilities.

## Key Takeaways

1. **Look for mathematical patterns first**: Before writing any code, test small examples manually to identify patterns. Many "easy" problems have O(1) mathematical solutions that are much more efficient than brute force approaches.

2. **Understand divisibility rules**: Knowing that even numbers are divisible by 2 (last digit is even or `n % 2 == 0`) is fundamental. This problem is essentially asking: "Is n even? If yes, return n; if no, return 2n."

3. **Recognize LCM/GCD patterns**: When a problem involves finding common multiples or divisors, think about the relationship between LCM and GCD: `LCM(a, b) = (a × b) / GCD(a, b)`. This formula often provides the most elegant solution.

Related problems: [Greatest Common Divisor of Strings](/problem/greatest-common-divisor-of-strings), [Three Divisors](/problem/three-divisors), [Find Greatest Common Divisor of Array](/problem/find-greatest-common-divisor-of-array)
