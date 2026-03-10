---
title: "How to Solve Divide Two Integers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Divide Two Integers. Medium difficulty, 19.4% acceptance rate. Topics: Math, Bit Manipulation."
date: "2026-09-19"
category: "dsa-patterns"
tags: ["divide-two-integers", "math", "bit-manipulation", "medium"]
---

# How to Solve Divide Two Integers

This problem asks us to divide two integers without using multiplication, division, or modulo operations, while handling integer overflow cases. The challenge lies in performing division efficiently (better than linear time) using only addition, subtraction, and bit manipulation, while correctly handling the tricky edge cases around 32-bit integer boundaries.

## Visual Walkthrough

Let's trace through an example: `dividend = 10`, `divisor = 3`. We want to compute `10 ÷ 3 = 3` (truncated toward zero).

**Step 1: Handle signs**

- Both numbers are positive, so result will be positive
- We'll work with absolute values: `10` and `3`

**Step 2: Exponential search approach**
Instead of subtracting 3 repeatedly (which would take 3 operations), we can use a smarter approach:

1. Can we subtract `3 × 1 = 3` from 10? Yes. `10 - 3 = 7`. Count = 1
2. Can we subtract `3 × 2 = 6` from 10? Yes. `10 - 6 = 4`. Count = 2
3. Can we subtract `3 × 4 = 12` from 10? No (12 > 10)

Now we have 4 remaining. Repeat the process:

1. Can we subtract `3 × 1 = 3` from 4? Yes. `4 - 3 = 1`. Count = 1
2. Can we subtract `3 × 2 = 6` from 4? No

Total count = 2 + 1 = 3

**Step 3: Apply sign**
Since both were positive, result remains `3`

**Key insight**: Instead of subtracting divisor repeatedly (O(n) time), we can subtract multiples of divisor that double each time (O(log n) time).

## Brute Force Approach

The most straightforward approach is to repeatedly subtract the divisor from the dividend until we can't subtract anymore:

1. Handle signs by tracking whether result should be negative
2. Convert both numbers to positive
3. While dividend ≥ divisor, subtract divisor and increment count
4. Apply the sign to the count

This approach has a critical flaw: **it's too slow**. Consider `dividend = 2³¹ - 1 = 2147483647` and `divisor = 1`. The algorithm would need to perform over 2 billion subtractions! That's O(n) time complexity where n is the quotient value, which is unacceptable.

<div class="code-group">

```python
# Time: O(n) where n = quotient (can be up to 2^31) - TOO SLOW!
# Space: O(1)
def divide_brute_force(dividend: int, divisor: int) -> int:
    # Handle division by zero
    if divisor == 0:
        return 2**31 - 1  # Max int as per problem constraints

    # Determine sign of result
    negative = (dividend < 0) != (divisor < 0)

    # Work with positive numbers
    a = abs(dividend)
    b = abs(divisor)

    # Count how many times we can subtract b from a
    count = 0
    while a >= b:
        a -= b
        count += 1

    # Apply sign
    if negative:
        count = -count

    # Handle 32-bit integer overflow
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31
    if count > INT_MAX:
        return INT_MAX
    if count < INT_MIN:
        return INT_MIN

    return count
```

```javascript
// Time: O(n) where n = quotient (can be up to 2^31) - TOO SLOW!
// Space: O(1)
function divideBruteForce(dividend, divisor) {
  // Handle division by zero
  if (divisor === 0) return Math.pow(2, 31) - 1;

  // Determine sign of result
  const negative = dividend < 0 !== divisor < 0;

  // Work with positive numbers
  let a = Math.abs(dividend);
  const b = Math.abs(divisor);

  // Count how many times we can subtract b from a
  let count = 0;
  while (a >= b) {
    a -= b;
    count++;
  }

  // Apply sign
  if (negative) count = -count;

  // Handle 32-bit integer overflow
  const INT_MAX = Math.pow(2, 31) - 1;
  const INT_MIN = -Math.pow(2, 31);

  if (count > INT_MAX) return INT_MAX;
  if (count < INT_MIN) return INT_MIN;

  return count;
}
```

```java
// Time: O(n) where n = quotient (can be up to 2^31) - TOO SLOW!
// Space: O(1)
public int divideBruteForce(int dividend, int divisor) {
    // Handle division by zero
    if (divisor == 0) return Integer.MAX_VALUE;

    // Determine sign of result
    boolean negative = (dividend < 0) != (divisor < 0);

    // Work with positive numbers (use long to avoid overflow)
    long a = Math.abs((long)dividend);
    long b = Math.abs((long)divisor);

    // Count how many times we can subtract b from a
    int count = 0;
    while (a >= b) {
        a -= b;
        count++;
    }

    // Apply sign
    if (negative) count = -count;

    // Handle 32-bit integer overflow
    if (count > Integer.MAX_VALUE) return Integer.MAX_VALUE;
    if (count < Integer.MIN_VALUE) return Integer.MIN_VALUE;

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we can use **bit manipulation** and **exponential search** to achieve O(log n) time complexity. Here's the thought process:

1. **Handle signs separately**: Track whether the result should be negative, then work with absolute values
2. **Use bit shifting for multiplication**: Instead of multiplying, we can use left shifts (`<<`) which multiply by powers of 2
3. **Exponential search**: Find the largest multiple of divisor that fits into the current remainder
   - Start with `multiple = divisor` and `count = 1`
   - Double both (`multiple <<= 1`, `count <<= 1`) until `multiple` exceeds the remainder
   - Subtract the largest fitting multiple and add corresponding count to result
   - Repeat until remainder < divisor

**Why this works**: Any number can be represented as a sum of powers of 2. We're essentially finding which powers of 2 times the divisor fit into the dividend.

**Example with 10 ÷ 3**:

- Largest power of 2 × 3 that fits in 10: 2 × 3 = 6 (count = 2)
- Remaining: 10 - 6 = 4
- Largest power of 2 × 3 that fits in 4: 1 × 3 = 3 (count = 1)
- Remaining: 4 - 3 = 1 (< 3, so stop)
- Total: 2 + 1 = 3

## Optimal Solution

Here's the complete optimal solution with detailed comments:

<div class="code-group">

```python
# Time: O(log n) where n = absolute value of quotient
# Space: O(1)
def divide(dividend: int, divisor: int) -> int:
    # Handle edge case: division by zero
    if divisor == 0:
        return 2**31 - 1  # Return max int as per problem constraints

    # Handle the special overflow case: -2^31 ÷ -1 = 2^31 which overflows 32-bit int
    if dividend == -2**31 and divisor == -1:
        return 2**31 - 1

    # Determine if result should be negative
    # XOR returns True if signs are different
    negative = (dividend < 0) != (divisor < 0)

    # Work with positive numbers to simplify logic
    # Use abs() and convert to positive to handle Python's negative number behavior
    a = abs(dividend)
    b = abs(divisor)

    result = 0  # This will accumulate our answer

    # Continue while we can still subtract b from a
    while a >= b:
        # Start with the divisor itself
        temp = b
        count = 1  # How many times we've multiplied b by 2

        # Double temp and count until temp would exceed a
        # temp << 1 is equivalent to temp * 2
        # We check (temp << 1) to ensure we don't overshoot
        while (temp << 1) <= a:
            temp <<= 1  # Double the value (multiply by 2)
            count <<= 1  # Double the count (multiply by 2)

        # Subtract the largest multiple we found from a
        a -= temp
        # Add the corresponding count to our result
        result += count

    # Apply the sign to our result
    if negative:
        result = -result

    # Clamp result to 32-bit signed integer range
    INT_MAX = 2**31 - 1
    INT_MIN = -2**31

    if result > INT_MAX:
        return INT_MAX
    if result < INT_MIN:
        return INT_MIN

    return result
```

```javascript
// Time: O(log n) where n = absolute value of quotient
// Space: O(1)
function divide(dividend, divisor) {
  // Handle edge case: division by zero
  if (divisor === 0) return Math.pow(2, 31) - 1;

  // Handle the special overflow case: -2^31 ÷ -1 = 2^31 which overflows 32-bit int
  if (dividend === -Math.pow(2, 31) && divisor === -1) {
    return Math.pow(2, 31) - 1;
  }

  // Determine if result should be negative
  // XOR: true if signs are different
  const negative = dividend < 0 !== divisor < 0;

  // Work with positive numbers
  // Use Math.abs and convert to Number to handle large numbers
  let a = Math.abs(dividend);
  const b = Math.abs(divisor);

  let result = 0;

  // Continue while we can still subtract b from a
  while (a >= b) {
    // Start with the divisor itself
    let temp = b;
    let count = 1;

    // Double temp and count until temp would exceed a
    // Check temp <= Number.MAX_SAFE_INTEGER / 2 to avoid overflow
    while (temp <= Number.MAX_SAFE_INTEGER >> 1 && temp << 1 <= a) {
      temp <<= 1; // Double the value
      count <<= 1; // Double the count
    }

    // Subtract the largest multiple we found from a
    a -= temp;
    // Add the corresponding count to our result
    result += count;
  }

  // Apply the sign
  if (negative) result = -result;

  // Clamp result to 32-bit signed integer range
  const INT_MAX = Math.pow(2, 31) - 1;
  const INT_MIN = -Math.pow(2, 31);

  if (result > INT_MAX) return INT_MAX;
  if (result < INT_MIN) return INT_MIN;

  return result;
}
```

```java
// Time: O(log n) where n = absolute value of quotient
// Space: O(1)
public int divide(int dividend, int divisor) {
    // Handle edge case: division by zero
    if (divisor == 0) return Integer.MAX_VALUE;

    // Handle the special overflow case: -2^31 ÷ -1 = 2^31 which overflows 32-bit int
    if (dividend == Integer.MIN_VALUE && divisor == -1) {
        return Integer.MAX_VALUE;
    }

    // Determine if result should be negative
    boolean negative = (dividend < 0) != (divisor < 0);

    // Work with positive numbers using long to avoid overflow
    // Convert to long to handle Integer.MIN_VALUE (which has no positive equivalent in int)
    long a = Math.abs((long)dividend);
    long b = Math.abs((long)divisor);

    int result = 0;

    // Continue while we can still subtract b from a
    while (a >= b) {
        // Start with the divisor itself
        long temp = b;
        int count = 1;

        // Double temp and count until temp would exceed a
        // We check (temp << 1) to ensure we don't overshoot
        // Using (temp << 1) <= a avoids multiplication
        while ((temp << 1) <= a) {
            temp <<= 1;  // Double the value
            count <<= 1; // Double the count
        }

        // Subtract the largest multiple we found from a
        a -= temp;
        // Add the corresponding count to our result
        result += count;
    }

    // Apply the sign
    if (negative) result = -result;

    // Result is already within int bounds due to our overflow check
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- Where n is the absolute value of the quotient (dividend/divisor)
- Each iteration of the outer loop reduces the dividend by at least half (we subtract the largest power of 2 multiple that fits)
- The inner while loop also runs in O(log n) time as it doubles the temp value
- Overall, we get logarithmic time complexity instead of linear

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables like `result`, `temp`, `count`, etc.
- No additional data structures are used

## Common Mistakes

1. **Not handling the overflow case `-2³¹ ÷ -1`**: This produces `2³¹` which exceeds the 32-bit signed integer maximum of `2³¹ - 1`. Always check for this specific case first.

2. **Using integer types that can't hold intermediate values**: When working with `Integer.MIN_VALUE` in Java or similar cases, taking absolute value can overflow if you use `int`. Always use `long` or similar larger types for intermediate calculations.

3. **Infinite loops with negative numbers**: If you don't convert to positive numbers first, the while loop condition `a >= b` might not behave as expected with negative numbers due to two's complement representation.

4. **Forgetting to handle division by zero**: While not explicitly mentioned in examples, it's good practice to handle this edge case, especially since the problem says "divide two integers."

5. **Incorrect sign handling**: The sign should be determined by whether the signs of dividend and divisor are different, not by checking each individually. Use XOR logic: `negative = (dividend < 0) != (divisor < 0)`.

## When You'll See This Pattern

This **exponential search with bit manipulation** pattern appears in several other problems:

1. **Pow(x, n) (LeetCode 50)**: Similar idea - instead of multiplying x by itself n times (O(n)), use exponentiation by squaring (O(log n)) by repeatedly squaring the base.

2. **Super Pow (LeetCode 372)**: Extends the power calculation to very large exponents using modular exponentiation with the same doubling technique.

3. **Integer Replacement (LeetCode 397)**: While not identical, it uses similar thinking about representing operations in terms of powers of 2.

4. **Any problem requiring division or multiplication without using \* or / operators**: This technique is the standard approach.

The core pattern is: **when you need to perform repeated operations, look for ways to combine them using powers of 2 (doubling/halving) to achieve logarithmic time complexity.**

## Key Takeaways

1. **Bit manipulation can replace multiplication/division**: Left shift (`<<`) multiplies by 2, right shift (`>>`) divides by 2. This is crucial when those operations are forbidden.

2. **Exponential search beats linear subtraction**: Instead of subtracting divisor one at a time (O(n)), subtract the largest power-of-2 multiple that fits (O(log n)).

3. **Handle edge cases first**: Always check for overflow cases (`-2³¹ ÷ -1`) and division by zero before starting the main logic. Work with absolute values and track the sign separately.

4. **Think in binary**: Any integer can be represented as a sum of powers of 2. This problem essentially asks "which powers of 2 times the divisor fit into the dividend?"

[Practice this problem on CodeJeet](/problem/divide-two-integers)
