---
title: "How to Solve Convert to Base -2 — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Convert to Base -2. Medium difficulty, 61.8% acceptance rate. Topics: Math."
date: "2029-01-10"
category: "dsa-patterns"
tags: ["convert-to-base-2", "math", "medium"]
---

# How to Solve Convert to Base -2

This problem asks us to convert a given integer `n` into its representation in base `-2`. Unlike regular binary (base 2) where digits are powers of 2, base `-2` uses powers of -2. The tricky part is that negative bases create alternating signs, making the conversion non-intuitive. You can't simply divide by -2 repeatedly like you would with positive bases because remainders must be non-negative.

## Visual Walkthrough

Let's trace through converting `n = 6` to base `-2` step by step:

**Step 1:** Start with n = 6. We need to find digits d₀, d₁, d₂, ... where:
6 = d₀ × (-2)⁰ + d₁ × (-2)¹ + d₂ × (-2)² + ...

**Step 2:** To find d₀ (least significant digit), we take n mod (-2). But remainder must be 0 or 1 (since base -2 uses digits 0 and 1). We compute:

- n mod (-2) = 6 mod (-2) = 0 (since 6 ÷ (-2) = -3 remainder 0)
- So d₀ = 0

**Step 3:** Update n for next digit: n = (n - d₀) ÷ (-2) = (6 - 0) ÷ (-2) = -3

**Step 4:** Now n = -3. Find d₁:

- n mod (-2) = -3 mod (-2). We need non-negative remainder: -3 = (-2) × 2 + 1, so remainder = 1
- So d₁ = 1

**Step 5:** Update n: n = (n - d₁) ÷ (-2) = (-3 - 1) ÷ (-2) = (-4) ÷ (-2) = 2

**Step 6:** n = 2. Find d₂:

- n mod (-2) = 2 mod (-2) = 0
- So d₂ = 0

**Step 7:** Update n: n = (2 - 0) ÷ (-2) = 2 ÷ (-2) = -1

**Step 8:** n = -1. Find d₃:

- n mod (-2) = -1 mod (-2). -1 = (-2) × 1 + 1, so remainder = 1
- So d₃ = 1

**Step 9:** Update n: n = (-1 - 1) ÷ (-2) = (-2) ÷ (-2) = 1

**Step 10:** n = 1. Find d₄:

- n mod (-2) = 1 mod (-2) = 1
- So d₄ = 1

**Step 11:** Update n: n = (1 - 1) ÷ (-2) = 0 ÷ (-2) = 0 (done!)

Digits from least to most significant: d₀=0, d₁=1, d₂=0, d₃=1, d₄=1
Reverse to get most significant first: "11010"

Check: 1×(-2)⁴ + 1×(-2)³ + 0×(-2)² + 1×(-2)¹ + 0×(-2)⁰ = 1×16 + 1×(-8) + 0×4 + 1×(-2) + 0×1 = 16 - 8 - 2 = 6 ✓

## Brute Force Approach

A naive approach might try to generate all possible base -2 strings and check which equals n. For n=6, we'd try:

- "0" = 0 (no)
- "1" = 1 (no)
- "10" = -2 (no)
- "11" = -1 (no)
- "100" = 4 (no)
- "101" = 5 (no)
- "110" = 2 (no)
- "111" = 3 (no)
- "1000" = -8 (no)
- ... and so on

This is exponential in the length of the output string. For n up to 10⁹, the string could be 30+ digits long, making 2³⁰ ≈ 1 billion possibilities. Clearly infeasible.

Another naive approach might try to mimic positive base conversion by repeatedly dividing by -2 and collecting remainders. But this fails because when n is negative and we divide by -2, we might get a negative remainder, which isn't allowed. We need to ensure remainders are always 0 or 1.

## Optimized Approach

The key insight is that we can adapt the division algorithm for negative bases by carefully handling the remainder. For any integer n, we can always write:
n = (-2) × q + r
where r is 0 or 1 (the valid digits for base -2).

The trick is: when n is negative and n mod (-2) would be negative, we adjust the quotient to make the remainder positive. Specifically:

- If n is even: n mod (-2) = 0, so r = 0
- If n is odd: n mod (-2) = -1, but we want r = 1. To fix this, we add 1 to n before dividing: (n - 1) ÷ (-2)

This gives us the algorithm:

1. If n == 0, return "0"
2. While n ≠ 0:
   - Compute remainder = n mod 2 (or n & 1)
   - Append remainder to result string
   - Update n = (n - remainder) ÷ (-2)

Why does this work? When n is odd, remainder = 1. Then n - remainder is even, so dividing by -2 gives integer result. When n is even, remainder = 0, and n ÷ (-2) is integer.

## Optimal Solution

<div class="code-group">

```python
# Time: O(log n) | Space: O(log n) for the output string
def baseNeg2(n: int) -> str:
    """
    Convert integer n to base -2 representation.

    The key insight: For base -2, digits must be 0 or 1.
    We repeatedly divide by -2, but adjust when remainder would be negative.
    """
    # Handle edge case: n = 0
    if n == 0:
        return "0"

    result = []

    # Continue until n becomes 0
    while n != 0:
        # Get the least significant bit (0 if even, 1 if odd)
        # This will be our digit in base -2
        remainder = n & 1  # Same as n % 2 but faster
        result.append(str(remainder))

        # Update n for next iteration
        # Subtract remainder to make n divisible by -2
        # Then divide by -2
        n = (n - remainder) // -2

    # We collected digits from least to most significant
    # Reverse to get correct order
    return ''.join(reversed(result))
```

```javascript
// Time: O(log n) | Space: O(log n) for the output string
function baseNeg2(n) {
  /**
   * Convert integer n to base -2 representation.
   *
   * The key insight: For base -2, digits must be 0 or 1.
   * We repeatedly divide by -2, but adjust when remainder would be negative.
   */

  // Handle edge case: n = 0
  if (n === 0) {
    return "0";
  }

  const result = [];

  // Continue until n becomes 0
  while (n !== 0) {
    // Get the least significant bit (0 if even, 1 if odd)
    // This will be our digit in base -2
    // Using bitwise AND with 1 is equivalent to n % 2
    const remainder = n & 1;
    result.push(remainder.toString());

    // Update n for next iteration
    // Subtract remainder to make n divisible by -2
    // Then divide by -2
    // Note: In JavaScript, we need Math.floor for negative division
    n = Math.floor((n - remainder) / -2);
  }

  // We collected digits from least to most significant
  // Reverse to get correct order
  return result.reverse().join("");
}
```

```java
// Time: O(log n) | Space: O(log n) for the output string
class Solution {
    public String baseNeg2(int n) {
        /**
         * Convert integer n to base -2 representation.
         *
         * The key insight: For base -2, digits must be 0 or 1.
         * We repeatedly divide by -2, but adjust when remainder would be negative.
         */

        // Handle edge case: n = 0
        if (n == 0) {
            return "0";
        }

        StringBuilder result = new StringBuilder();

        // Continue until n becomes 0
        while (n != 0) {
            // Get the least significant bit (0 if even, 1 if odd)
            // This will be our digit in base -2
            // Using bitwise AND with 1 is equivalent to n % 2
            int remainder = n & 1;
            result.append(remainder);

            // Update n for next iteration
            // Subtract remainder to make n divisible by -2
            // Then divide by -2
            n = (n - remainder) / -2;
        }

        // We collected digits from least to most significant
        // Reverse to get correct order
        return result.reverse().toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- Each iteration reduces n by a factor of approximately 2 (since we divide by -2)
- The number of iterations is proportional to the number of digits in the output
- For base -2, the number of digits is O(log n) since each digit represents a power of 2

**Space Complexity:** O(log n)

- We store the result string, which has O(log n) characters
- The auxiliary space (excluding output) is O(1) for variables

## Common Mistakes

1. **Forgetting the n = 0 edge case**: The problem states to return "0" for input 0. If you don't handle this, the while loop never executes and you return an empty string.

2. **Incorrect remainder calculation for negative n**: Simply doing `n % -2` in some languages gives negative remainders for negative n. You must ensure remainders are 0 or 1. Our solution uses `n & 1` which always gives 0 or 1 regardless of n's sign.

3. **Wrong update formula**: Using `n = n // -2` without subtracting remainder first fails for odd n. When n is odd, n - 1 must be divisible by -2, so we need `n = (n - remainder) // -2`.

4. **Forgetting to reverse the result**: We collect digits from least significant to most significant. Failing to reverse gives the binary string in wrong order (e.g., for n=6, you'd get "01011" instead of "11010").

## When You'll See This Pattern

This problem teaches the pattern of **base conversion with non-standard bases**. The core technique of repeated division with remainder adjustment appears in:

1. **Encode Number (LeetCode 1256)**: Convert to base -2 but with a twist - it's essentially the same problem with different framing.

2. **Convert to Base 7 (LeetCode 504)**: Same repeated division pattern but with positive base 7, which is simpler since remainders are always non-negative.

3. **Excel Sheet Column Title (LeetCode 168)**: Convert to base-26 where digits are A-Z. Similar adjustment needed because Excel columns are 1-indexed (A=1, not A=0).

The pattern is: For base b conversion, repeatedly divide by b, collect remainders as digits, and reverse. When b is negative or the digit system is 1-indexed, adjust the quotient/remainder calculation.

## Key Takeaways

1. **Negative base conversion requires remainder adjustment**: Unlike positive bases where n mod b is always non-negative, negative bases can produce negative remainders. The fix is to ensure remainder is in valid digit range (0 or 1 for base -2) by adjusting the quotient.

2. **Bit operations simplify parity checks**: Using `n & 1` instead of `n % 2` is cleaner and works correctly for negative numbers in most languages.

3. **Always handle the zero case separately**: Base conversion algorithms often fail for n=0 because the while loop doesn't execute. Check for zero at the start.

Related problems: [Encode Number](/problem/encode-number), [Convert Date to Binary](/problem/convert-date-to-binary)
