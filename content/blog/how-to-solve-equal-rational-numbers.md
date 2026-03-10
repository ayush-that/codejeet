---
title: "How to Solve Equal Rational Numbers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Equal Rational Numbers. Hard difficulty, 45.9% acceptance rate. Topics: Math, String."
date: "2026-05-31"
category: "dsa-patterns"
tags: ["equal-rational-numbers", "math", "string", "hard"]
---

# How to Solve Equal Rational Numbers

This problem asks us to determine if two string representations of rational numbers are equal, where strings may contain parentheses to denote repeating decimal parts. The challenge lies in handling the repeating notation correctly and comparing potentially infinite decimal expansions without floating-point precision issues.

**What makes this tricky:** The parentheses notation creates repeating decimals that can be tricky to parse and compare. For example, `"0.(52)"` represents `0.525252...` while `"0.5(25)"` represents `0.525252...` — these are actually the same number! We need to convert both to a common representation for comparison.

## Visual Walkthrough

Let's trace through comparing `s = "0.(52)"` and `t = "0.5(25)"`:

1. **Parse each string into components:**
   - `"0.(52)"` → integer part: `"0"`, non-repeating decimal: `""`, repeating decimal: `"52"`
   - `"0.5(25)"` → integer part: `"0"`, non-repeating decimal: `"5"`, repeating decimal: `"25"`

2. **Convert to fractional representation:**
   - For `"0.(52)"`: The repeating part `"52"` has length 2, so we create the fraction `52/99`. Since it's in the hundredths place, we get `52/99`.
   - For `"0.5(25)"`: We have `0.5` = `5/10` = `1/2`. The repeating part `"25"` starts at the thousandths place, so we get `25/990`. Combined: `1/2 + 25/990 = 495/990 + 25/990 = 520/990 = 52/99`.

3. **Compare the fractions:** Both equal `52/99`, so they represent the same rational number.

The key insight is that any rational number with repeating decimals can be converted to an exact fraction using the formula for geometric series.

## Brute Force Approach

A naive approach might try to:

1. Parse the strings to extract components
2. Generate a long decimal expansion (say, 100 digits) for each number
3. Compare the expansions

**Why this fails:**

- Some repeating patterns require many digits to reveal equality (e.g., `0.(142857)` and `0.142857(142857)`)
- Floating-point precision issues with double/float types
- Determining how many digits to generate is arbitrary
- The problem requires exact equality, not approximate

**What a naive candidate might try:**

```python
def isRationalEqual(s, t):
    # Try to parse as float - WRONG!
    return float(s) == float(t)
```

This fails because:

1. Parentheses aren't valid float syntax
2. Even if we remove parentheses, floating-point can't represent repeating decimals exactly
3. `0.1 + 0.2 != 0.3` in floating-point due to binary representation issues

## Optimized Approach

The optimal approach converts each rational number to an exact fraction `numerator/denominator` and compares these fractions.

**Key insight:** A repeating decimal `0.abc(def)` can be converted to a fraction using the geometric series formula:

- If the repeating part has length `k`, the denominator is `10^k - 1`
- The repeating part needs to be positioned correctly based on where it starts

**Step-by-step reasoning:**

1. **Parse the string** into three parts:
   - Integer part (before decimal)
   - Non-repeating decimal part (after decimal but before parentheses)
   - Repeating decimal part (inside parentheses)

2. **Convert to fraction:**
   - Integer part: `int(integer_str)`
   - Non-repeating part: `int(non_repeating_str) / 10^len(non_repeating_str)`
   - Repeating part: `int(repeating_str) / (10^len(repeating_str) - 1) / 10^len(non_repeating_str)`

3. **Combine parts** into a single fraction `a/b`

4. **Compare fractions** by cross-multiplying: `a1/b1 == a2/b2` iff `a1 * b2 == a2 * b1`

**Why this works:** Every rational number has either a terminating or repeating decimal expansion, and both can be represented exactly as fractions. By converting both inputs to fractions in lowest terms (or comparing via cross-multiplication), we avoid precision issues entirely.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is length of the strings | Space: O(1)
def isRationalEqual(s: str, t: str) -> bool:
    """
    Convert both rational numbers to fractions and compare them.
    Each rational number can be represented as: integer.non_repeating(repeating)
    """

    def to_fraction(num_str: str):
        """Convert a rational number string to a fraction (numerator, denominator)."""

        # Find the decimal point
        dot_index = num_str.find('.')

        if dot_index == -1:
            # No decimal point, it's just an integer
            return int(num_str), 1

        # Parse integer part (before decimal)
        int_part = int(num_str[:dot_index]) if dot_index > 0 else 0

        # Parse the decimal part
        decimal_part = num_str[dot_index + 1:]

        # Check if there's a repeating part in parentheses
        paren_index = decimal_part.find('(')

        if paren_index == -1:
            # No repeating part - it's a terminating decimal
            # Example: "0.5" -> 5/10 = 1/2
            if decimal_part == "":
                # No decimal digits at all
                non_repeating = 0
                non_repeating_len = 0
            else:
                non_repeating = int(decimal_part)
                non_repeating_len = len(decimal_part)

            # Fraction = int_part + non_repeating/10^non_repeating_len
            numerator = int_part * (10 ** non_repeating_len) + non_repeating
            denominator = 10 ** non_repeating_len

            return numerator, denominator

        else:
            # Has repeating part
            # Example: "0.5(25)" -> 0.5 + 0.0252525...
            non_repeating_str = decimal_part[:paren_index]
            repeating_str = decimal_part[paren_index + 1:-1]  # Remove closing ')'

            # Handle case where non-repeating part might be empty
            non_repeating = int(non_repeating_str) if non_repeating_str else 0
            non_repeating_len = len(non_repeating_str)

            # Handle case where repeating part might be empty (though problem guarantees it's not)
            repeating = int(repeating_str) if repeating_str else 0
            repeating_len = len(repeating_str)

            # Calculate the fraction using the formula:
            # value = int_part + non_repeating/10^n + repeating/((10^r - 1) * 10^n)
            # where n = len(non_repeating), r = len(repeating)

            # First part: integer + non-repeating decimal
            # numerator1/denominator1 = int_part + non_repeating/10^n
            numerator1 = int_part * (10 ** non_repeating_len) + non_repeating
            denominator1 = 10 ** non_repeating_len

            # Second part: repeating decimal
            # numerator2/denominator2 = repeating/((10^r - 1) * 10^n)
            numerator2 = repeating
            denominator2 = (10 ** repeating_len - 1) * (10 ** non_repeating_len)

            # Combine: numerator1/denominator1 + numerator2/denominator2
            # = (numerator1*denominator2 + numerator2*denominator1) / (denominator1*denominator2)
            numerator = numerator1 * denominator2 + numerator2 * denominator1
            denominator = denominator1 * denominator2

            return numerator, denominator

    # Convert both strings to fractions
    num1, den1 = to_fraction(s)
    num2, den2 = to_fraction(t)

    # Compare by cross-multiplication to avoid reducing fractions
    # a/b == c/d iff a*d == c*b
    return num1 * den2 == num2 * den1
```

```javascript
// Time: O(n) where n is length of the strings | Space: O(1)
function isRationalEqual(s, t) {
  /**
   * Convert a rational number string to a fraction [numerator, denominator].
   * Each rational number can be represented as: integer.non_repeating(repeating)
   */
  function toFraction(numStr) {
    // Find the decimal point
    const dotIndex = numStr.indexOf(".");

    if (dotIndex === -1) {
      // No decimal point, it's just an integer
      return [parseInt(numStr, 10), 1];
    }

    // Parse integer part (before decimal)
    const intPart = dotIndex > 0 ? parseInt(numStr.substring(0, dotIndex), 10) : 0;

    // Parse the decimal part
    const decimalPart = numStr.substring(dotIndex + 1);

    // Check if there's a repeating part in parentheses
    const parenIndex = decimalPart.indexOf("(");

    if (parenIndex === -1) {
      // No repeating part - it's a terminating decimal
      // Example: "0.5" -> 5/10 = 1/2
      let nonRepeating = 0;
      let nonRepeatingLen = 0;

      if (decimalPart.length > 0) {
        nonRepeating = parseInt(decimalPart, 10);
        nonRepeatingLen = decimalPart.length;
      }

      // Fraction = intPart + nonRepeating/10^nonRepeatingLen
      const numerator = intPart * Math.pow(10, nonRepeatingLen) + nonRepeating;
      const denominator = Math.pow(10, nonRepeatingLen);

      return [numerator, denominator];
    } else {
      // Has repeating part
      // Example: "0.5(25)" -> 0.5 + 0.0252525...
      const nonRepeatingStr = decimalPart.substring(0, parenIndex);
      const repeatingStr = decimalPart.substring(parenIndex + 1, decimalPart.length - 1); // Remove closing ')'

      // Handle case where non-repeating part might be empty
      const nonRepeating = nonRepeatingStr.length > 0 ? parseInt(nonRepeatingStr, 10) : 0;
      const nonRepeatingLen = nonRepeatingStr.length;

      // Handle case where repeating part might be empty
      const repeating = repeatingStr.length > 0 ? parseInt(repeatingStr, 10) : 0;
      const repeatingLen = repeatingStr.length;

      // Calculate the fraction using the formula:
      // value = intPart + nonRepeating/10^n + repeating/((10^r - 1) * 10^n)
      // where n = len(nonRepeating), r = len(repeating)

      // First part: integer + non-repeating decimal
      const numerator1 = intPart * Math.pow(10, nonRepeatingLen) + nonRepeating;
      const denominator1 = Math.pow(10, nonRepeatingLen);

      // Second part: repeating decimal
      const numerator2 = repeating;
      const denominator2 = (Math.pow(10, repeatingLen) - 1) * Math.pow(10, nonRepeatingLen);

      // Combine: numerator1/denominator1 + numerator2/denominator2
      const numerator = numerator1 * denominator2 + numerator2 * denominator1;
      const denominator = denominator1 * denominator2;

      return [numerator, denominator];
    }
  }

  // Convert both strings to fractions
  const [num1, den1] = toFraction(s);
  const [num2, den2] = toFraction(t);

  // Compare by cross-multiplication to avoid reducing fractions
  // a/b == c/d iff a*d == c*b
  return num1 * den2 === num2 * den1;
}
```

```java
// Time: O(n) where n is length of the strings | Space: O(1)
class Solution {
    public boolean isRationalEqual(String s, String t) {
        /**
         * Convert a rational number string to a fraction {numerator, denominator}.
         * Each rational number can be represented as: integer.non_repeating(repeating)
         */
        long[] fractionS = toFraction(s);
        long[] fractionT = toFraction(t);

        // Compare by cross-multiplication: a/b == c/d iff a*d == c*b
        return fractionS[0] * fractionT[1] == fractionT[0] * fractionS[1];
    }

    private long[] toFraction(String numStr) {
        // Find the decimal point
        int dotIndex = numStr.indexOf('.');

        if (dotIndex == -1) {
            // No decimal point, it's just an integer
            return new long[]{Long.parseLong(numStr), 1};
        }

        // Parse integer part (before decimal)
        long intPart = dotIndex > 0 ? Long.parseLong(numStr.substring(0, dotIndex)) : 0;

        // Parse the decimal part
        String decimalPart = numStr.substring(dotIndex + 1);

        // Check if there's a repeating part in parentheses
        int parenIndex = decimalPart.indexOf('(');

        if (parenIndex == -1) {
            // No repeating part - it's a terminating decimal
            // Example: "0.5" -> 5/10 = 1/2
            long nonRepeating = 0;
            int nonRepeatingLen = 0;

            if (!decimalPart.isEmpty()) {
                nonRepeating = Long.parseLong(decimalPart);
                nonRepeatingLen = decimalPart.length();
            }

            // Fraction = intPart + nonRepeating/10^nonRepeatingLen
            long numerator = intPart * (long)Math.pow(10, nonRepeatingLen) + nonRepeating;
            long denominator = (long)Math.pow(10, nonRepeatingLen);

            return new long[]{numerator, denominator};
        } else {
            // Has repeating part
            // Example: "0.5(25)" -> 0.5 + 0.0252525...
            String nonRepeatingStr = decimalPart.substring(0, parenIndex);
            String repeatingStr = decimalPart.substring(parenIndex + 1, decimalPart.length() - 1); // Remove closing ')'

            // Handle case where non-repeating part might be empty
            long nonRepeating = nonRepeatingStr.isEmpty() ? 0 : Long.parseLong(nonRepeatingStr);
            int nonRepeatingLen = nonRepeatingStr.length();

            // Handle case where repeating part might be empty
            long repeating = repeatingStr.isEmpty() ? 0 : Long.parseLong(repeatingStr);
            int repeatingLen = repeatingStr.length();

            // Calculate the fraction using the formula:
            // value = intPart + nonRepeating/10^n + repeating/((10^r - 1) * 10^n)
            // where n = len(nonRepeating), r = len(repeating)

            // First part: integer + non-repeating decimal
            long numerator1 = intPart * (long)Math.pow(10, nonRepeatingLen) + nonRepeating;
            long denominator1 = (long)Math.pow(10, nonRepeatingLen);

            // Second part: repeating decimal
            long numerator2 = repeating;
            long denominator2 = ((long)Math.pow(10, repeatingLen) - 1) * (long)Math.pow(10, nonRepeatingLen);

            // Combine: numerator1/denominator1 + numerator2/denominator2
            long numerator = numerator1 * denominator2 + numerator2 * denominator1;
            long denominator = denominator1 * denominator2;

            return new long[]{numerator, denominator};
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the input strings

- We parse each string once to extract components
- Mathematical operations (pow, multiplication) are O(1) for the sizes involved
- Cross-multiplication comparison is O(1)

**Space Complexity:** O(1)

- We only store a few variables: numerators, denominators, and parsed components
- No additional data structures that scale with input size
- The recursion stack is constant depth

## Common Mistakes

1. **Using floating-point arithmetic:** Attempting to parse as float/double will fail due to:
   - Parentheses not being valid syntax
   - Binary floating-point cannot exactly represent decimal fractions like 0.1
   - Precision loss when comparing nearly-equal numbers

2. **Incorrect handling of edge cases:**
   - Empty non-repeating part (`"0.(52)"` vs `"0.(52)"`)
   - Integer-only inputs (`"5"` vs `"5.0"`)
   - Multiple decimal points (invalid input, but should handle gracefully)
   - Very long repeating patterns causing overflow (use long integers)

3. **Wrong formula for repeating decimals:** Forgetting to divide the repeating part by `10^n` where n is the length of the non-repeating part. The repeating part starts AFTER the non-repeating part, so it's in a different decimal place.

4. **Not using cross-multiplication:** Attempting to reduce fractions by finding GCD can be computationally expensive and prone to overflow. Cross-multiplication (`a/b == c/d` iff `a*d == c*b`) is simpler and avoids division.

## When You'll See This Pattern

This problem combines **string parsing** with **mathematical conversion** patterns:

1. **String to Number Conversion Problems:**
   - **LeetCode 8: String to Integer (atoi)** - Parsing strings with various formats to numbers
   - **LeetCode 65: Valid Number** - Determining if a string represents a valid number
   - Both require careful parsing of different number formats

2. **Fraction/Rational Number Problems:**
   - **LeetCode 166: Fraction to Recurring Decimal** - The inverse of this problem
   - **LeetCode 592: Fraction Addition and Subtraction** - Working with fractions
   - These problems require understanding how to convert between decimal and fractional representations

3. **Problems Requiring Exact Arithmetic:**
   - **LeetCode 483: Smallest Good Base** - Requires precise integer arithmetic
   - Any problem where floating-point would lose precision

## Key Takeaways

1. **Convert to a common representation:** When comparing numbers in different formats, convert both to a canonical form (like fractions) for exact comparison.

2. **Understand the mathematics:** The formula for converting repeating decimals to fractions comes from the geometric series: `0.(abc) = abc/(999)` where the denominator has as many 9's as the repeating part has digits.

3. **Parse carefully, handle edge cases:** String parsing problems often have many edge cases (empty parts, no decimal, no repeating part). Write helper functions and test each component separately.

[Practice this problem on CodeJeet](/problem/equal-rational-numbers)
