---
title: "How to Solve Base 7 — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Base 7. Easy difficulty, 53.8% acceptance rate. Topics: Math, String."
date: "2028-10-18"
category: "dsa-patterns"
tags: ["base-7", "math", "string", "easy"]
---

# How to Solve Base 7

Converting numbers between different bases is a fundamental computer science concept that appears in everything from low-level systems programming to interview problems. While this problem asks specifically for base 7, the technique you'll learn applies to converting between any two bases. What makes this problem interesting is that it tests your understanding of both mathematical operations and string manipulation, while also requiring careful handling of edge cases like negative numbers and zero.

## Visual Walkthrough

Let's trace through converting the number 100 to base 7 step by step:

**Step 1:** Start with num = 100

- 100 ÷ 7 = 14 remainder 2 → digit = "2"
- Update num = 14

**Step 2:** num = 14

- 14 ÷ 7 = 2 remainder 0 → digit = "0"
- Update num = 2

**Step 3:** num = 2

- 2 ÷ 7 = 0 remainder 2 → digit = "2"
- Update num = 0

**Step 4:** num = 0 → stop

Now we have digits: "2", "0", "2" (in reverse order of calculation)
Reverse them: "2", "0", "2" → "202"

Let's verify: 2×7² + 0×7¹ + 2×7⁰ = 2×49 + 0×7 + 2×1 = 98 + 0 + 2 = 100 ✓

For negative numbers like -7:

1. Remember it's negative
2. Convert absolute value (7) to base 7: "10"
3. Add negative sign: "-10"

For zero: The answer is simply "0" (not an empty string).

## Brute Force Approach

There isn't really a "brute force" approach that's fundamentally different from the optimal solution for this problem, but a common naive mistake is to try to build the result by repeatedly subtracting powers of 7:

1. Find the largest power of 7 less than or equal to the number
2. Count how many times that power fits into the number
3. Subtract and repeat with the remainder

While this approach would technically work, it's more complex than necessary and requires additional steps to find the largest power. The division-with-remainder method is simpler and more efficient.

Another naive approach would be to convert to base 10 first (which is already the input) or to use string manipulation without understanding the mathematical basis. These approaches miss the core algorithmic insight.

## Optimal Solution

The optimal solution uses the standard base conversion algorithm: repeatedly divide the number by 7, collecting remainders as digits, then reverse the result. We need to handle:

1. Negative numbers (store the sign, work with absolute value)
2. Zero (special case)
3. The reverse order of digits (remainders come in least-significant to most-significant order)

<div class="code-group">

```python
# Time: O(log₇(n)) | Space: O(log₇(n))
def convertToBase7(num: int) -> str:
    # Handle the special case of zero immediately
    if num == 0:
        return "0"

    # Store whether the original number was negative
    # We'll work with the absolute value for conversion
    is_negative = num < 0
    num = abs(num)

    # List to store digits in reverse order (least significant first)
    digits = []

    # Continue dividing until we reach zero
    while num > 0:
        # Get the remainder when dividing by 7 - this is our next digit
        remainder = num % 7
        # Convert the remainder to a character and add to our list
        digits.append(str(remainder))
        # Integer division to get the next number to process
        num //= 7

    # Reverse the digits because we collected them from least to most significant
    # Join them into a single string
    result = ''.join(reversed(digits))

    # Add the negative sign back if the original number was negative
    if is_negative:
        result = '-' + result

    return result
```

```javascript
// Time: O(log₇(n)) | Space: O(log₇(n))
function convertToBase7(num) {
  // Handle the special case of zero immediately
  if (num === 0) {
    return "0";
  }

  // Store whether the original number was negative
  // We'll work with the absolute value for conversion
  const isNegative = num < 0;
  num = Math.abs(num);

  // Array to store digits in reverse order (least significant first)
  const digits = [];

  // Continue dividing until we reach zero
  while (num > 0) {
    // Get the remainder when dividing by 7 - this is our next digit
    const remainder = num % 7;
    // Convert the remainder to a string and add to our array
    digits.push(remainder.toString());
    // Integer division to get the next number to process
    num = Math.floor(num / 7);
  }

  // Reverse the digits because we collected them from least to most significant
  // Join them into a single string
  let result = digits.reverse().join("");

  // Add the negative sign back if the original number was negative
  if (isNegative) {
    result = "-" + result;
  }

  return result;
}
```

```java
// Time: O(log₇(n)) | Space: O(log₇(n))
public String convertToBase7(int num) {
    // Handle the special case of zero immediately
    if (num == 0) {
        return "0";
    }

    // Store whether the original number was negative
    // We'll work with the absolute value for conversion
    boolean isNegative = num < 0;
    // Use long to handle the edge case of Integer.MIN_VALUE
    // Math.abs(Integer.MIN_VALUE) would overflow
    long n = Math.abs((long)num);

    // StringBuilder to store digits in reverse order (least significant first)
    StringBuilder digits = new StringBuilder();

    // Continue dividing until we reach zero
    while (n > 0) {
        // Get the remainder when dividing by 7 - this is our next digit
        long remainder = n % 7;
        // Convert the remainder to a character and add to our StringBuilder
        digits.append(remainder);
        // Integer division to get the next number to process
        n /= 7;
    }

    // Reverse the digits because we collected them from least to most significant
    String result = digits.reverse().toString();

    // Add the negative sign back if the original number was negative
    if (isNegative) {
        result = "-" + result;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log₇(n)) or O(log n)

- Each iteration of the while loop divides the number by 7
- The number of iterations equals the number of digits in base 7 representation
- For a number n, this is approximately log₇(n)
- In big O notation, we can write this as O(log n) since log bases differ by a constant factor

**Space Complexity:** O(log₇(n)) or O(log n)

- We need to store all the digits before reversing them
- The number of digits is log₇(n)
- The string result itself also takes O(log₇(n)) space

## Common Mistakes

1. **Forgetting to handle zero as a special case**: If you don't handle num == 0, the while loop never executes and you return an empty string instead of "0". Always test with 0!

2. **Not handling negative numbers correctly**: Simply using `num = -num` for negative numbers can fail with Integer.MIN_VALUE in languages like Java (overflow). Use `Math.abs()` on a long or handle the sign separately.

3. **Forgetting to reverse the digits**: The remainders come out in reverse order (least significant digit first). If you don't reverse, you'll get the base 7 representation backwards.

4. **Using string concatenation in a loop**: In languages like Java, using `result = digit + result` in a loop gives O(n²) time complexity due to string immutability. Always use StringBuilder for building strings in loops.

5. **Incorrect integer division**: In JavaScript, `num / 7` returns a float even if the result is a whole number. You must use `Math.floor(num / 7)` for integer division.

## When You'll See This Pattern

This base conversion pattern appears in many problems:

1. **504. Base 7** (this problem) - Direct application
2. **405. Convert a Number to Hexadecimal** - Same pattern but with base 16 and hexadecimal digits A-F
3. **168. Excel Sheet Column Title** - Similar to base 26 conversion but with 1-based indexing (A=1, not A=0)
4. **171. Excel Sheet Column Number** - The inverse of problem 168, converting from base 26-like representation to decimal

The core insight is recognizing that any integer can be represented in any base by repeatedly dividing by that base and collecting remainders. This is essentially the same algorithm computers use internally to convert between binary, decimal, and hexadecimal representations.

## Key Takeaways

1. **Base conversion follows a standard algorithm**: Repeated division by the target base, collecting remainders as digits (from least to most significant), then reversing.

2. **Always handle edge cases first**: Zero and negative numbers require special handling. Test with 0, 1, -1, and the maximum/minimum possible inputs.

3. **The pattern extends to any base**: Once you understand base 7 conversion, you can convert to base 2 (binary), base 8 (octal), base 16 (hexadecimal), or any other base using the same algorithm.

4. **Mind your language's quirks**: Different languages handle integer division and negative numbers differently. Know whether your language's `%` operator returns negative remainders for negative dividends.

[Practice this problem on CodeJeet](/problem/base-7)
