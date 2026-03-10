---
title: "How to Solve Hexadecimal and Hexatrigesimal Conversion — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Hexadecimal and Hexatrigesimal Conversion. Easy difficulty, 80.7% acceptance rate. Topics: Math, String."
date: "2029-04-30"
category: "dsa-patterns"
tags: ["hexadecimal-and-hexatrigesimal-conversion", "math", "string", "easy"]
---

# How to Solve Hexadecimal and Hexatrigesimal Conversion

This problem tests your understanding of base conversion algorithms. While it appears straightforward, it's interesting because it combines two different base systems (base-16 and base-36) and requires careful handling of number-to-string conversion. The tricky part isn't the mathematical complexity, but implementing clean, correct base conversion that handles edge cases properly.

## Visual Walkthrough

Let's trace through an example with `n = 42`:

**Step 1: Calculate n² and n³**

- n² = 42 × 42 = 1764
- n³ = 42 × 42 × 42 = 74088

**Step 2: Convert 1764 to hexadecimal (base-16)**
Hexadecimal uses digits 0-9 and letters A-F (where A=10, B=11, C=12, D=13, E=14, F=15).

We repeatedly divide by 16 and collect remainders:

- 1764 ÷ 16 = 110 remainder 4 → digit: '4'
- 110 ÷ 16 = 6 remainder 14 → digit: 'E' (since 14 = E)
- 6 ÷ 16 = 0 remainder 6 → digit: '6'

Reading remainders from last to first: '6E4'

**Step 3: Convert 74088 to hexatrigesimal (base-36)**
Hexatrigesimal uses digits 0-9 and letters A-Z (where A=10, B=11, ..., Z=35).

We repeatedly divide by 36 and collect remainders:

- 74088 ÷ 36 = 2058 remainder 0 → digit: '0'
- 2058 ÷ 36 = 57 remainder 6 → digit: '6'
- 57 ÷ 36 = 1 remainder 21 → digit: 'L' (since 21 = L)
- 1 ÷ 36 = 0 remainder 1 → digit: '1'

Reading remainders from last to first: '1L60'

**Step 4: Concatenate the results**
Hexadecimal: '6E4'
Hexatrigesimal: '1L60'
Result: '6E41L60'

## Brute Force Approach

There's no truly "brute force" approach for base conversion since we must perform the conversion somehow. However, a naive approach might involve:

1. Using built-in conversion functions without understanding how they work
2. Trying to implement conversion with incorrect digit mapping
3. Forgetting to handle the special case when n² or n³ equals 0

The problem with relying solely on built-in functions is that in an interview, you're expected to demonstrate understanding of the algorithm. While using `Integer.toString(n, radix)` in Java or similar functions in other languages is acceptable, you should be prepared to explain how base conversion works.

## Optimal Solution

The optimal solution uses the standard base conversion algorithm: repeatedly divide the number by the target base, collecting remainders as digits, then reverse the result. We need to handle two key details:

1. When the number is 0, we should return "0" (not an empty string)
2. We need to map remainders >9 to appropriate letters

<div class="code-group">

```python
# Time: O(log₁₆(n²) + log₃₆(n³)) = O(log n) | Space: O(log n)
def convertToHexAndHexatrigesimal(n: int) -> str:
    """
    Convert n² to hexadecimal and n³ to hexatrigesimal,
    then concatenate the results.
    """

    # Calculate n² and n³
    n_squared = n * n
    n_cubed = n * n * n

    # Helper function for base conversion
    def convert_to_base(num: int, base: int) -> str:
        """Convert a positive integer to a string in the given base."""
        if num == 0:
            return "0"

        digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        result = []

        # Repeatedly divide by base, collecting remainders
        while num > 0:
            remainder = num % base
            result.append(digits[remainder])  # Map remainder to digit/letter
            num //= base  # Integer division

        # Reverse result because we collected digits from least to most significant
        return ''.join(reversed(result))

    # Convert n² to hexadecimal (base 16)
    hex_part = convert_to_base(n_squared, 16)

    # Convert n³ to hexatrigesimal (base 36)
    hexatrigesimal_part = convert_to_base(n_cubed, 36)

    # Concatenate the results
    return hex_part + hexatrigesimal_part
```

```javascript
// Time: O(log₁₆(n²) + log₃₆(n³)) = O(log n) | Space: O(log n)
function convertToHexAndHexatrigesimal(n) {
  /**
   * Convert n² to hexadecimal and n³ to hexatrigesimal,
   * then concatenate the results.
   */

  // Calculate n² and n³
  const nSquared = n * n;
  const nCubed = n * n * n;

  // Helper function for base conversion
  function convertToBase(num, base) {
    /** Convert a positive integer to a string in the given base. */
    if (num === 0) {
      return "0";
    }

    const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const result = [];

    // Repeatedly divide by base, collecting remainders
    while (num > 0) {
      const remainder = num % base;
      result.push(digits[remainder]); // Map remainder to digit/letter
      num = Math.floor(num / base); // Integer division
    }

    // Reverse result because we collected digits from least to most significant
    return result.reverse().join("");
  }

  // Convert n² to hexadecimal (base 16)
  const hexPart = convertToBase(nSquared, 16);

  // Convert n³ to hexatrigesimal (base 36)
  const hexatrigesimalPart = convertToBase(nCubed, 36);

  // Concatenate the results
  return hexPart + hexatrigesimalPart;
}
```

```java
// Time: O(log₁₆(n²) + log₃₆(n³)) = O(log n) | Space: O(log n)
public class Solution {
    public String convertToHexAndHexatrigesimal(int n) {
        /**
         * Convert n² to hexadecimal and n³ to hexatrigesimal,
         * then concatenate the results.
         */

        // Calculate n² and n³
        long nSquared = (long) n * n;  // Use long to prevent overflow
        long nCubed = (long) n * n * n;

        // Convert n² to hexadecimal (base 16)
        String hexPart = convertToBase(nSquared, 16);

        // Convert n³ to hexatrigesimal (base 36)
        String hexatrigesimalPart = convertToBase(nCubed, 36);

        // Concatenate the results
        return hexPart + hexatrigesimalPart;
    }

    private String convertToBase(long num, int base) {
        /** Convert a positive integer to a string in the given base. */
        if (num == 0) {
            return "0";
        }

        // Digits for bases up to 36
        String digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder result = new StringBuilder();

        // Repeatedly divide by base, collecting remainders
        while (num > 0) {
            int remainder = (int) (num % base);  // Remainder will be 0-35
            result.append(digits.charAt(remainder));  // Map remainder to digit/letter
            num /= base;  // Integer division
        }

        // Reverse result because we collected digits from least to most significant
        return result.reverse().toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log₁₆(n²) + log₃₆(n³)) = O(log n)

- The number of iterations in our base conversion is proportional to the number of digits in the result
- For n² in base 16: log₁₆(n²) = 2 × log₁₆(n) = O(log n)
- For n³ in base 36: log₃₆(n³) = 3 × log₃₆(n) = O(log n)
- Combined: O(log n) + O(log n) = O(log n)

**Space Complexity:** O(log n)

- We store the string representation of each converted number
- The length of each string is proportional to the number of digits: O(log₁₆(n²)) + O(log₃₆(n³)) = O(log n)
- The recursion stack (if using recursion) or the result array uses O(log n) space

## Common Mistakes

1. **Forgetting the n=0 case**: When n=0, both n² and n³ are 0. The conversion should return "0" for each part, not an empty string. Always test edge cases!

2. **Incorrect digit mapping**: Using lowercase letters instead of uppercase, or having the wrong mapping (e.g., 'A'=1 instead of 'A'=10). The problem specifies uppercase letters.

3. **Integer overflow**: For large n values, n³ can exceed 32-bit integer limits. In Java, use `long` to prevent overflow. In Python and JavaScript, integers can handle arbitrarily large values, but it's still good to mention this consideration.

4. **Reversing incorrectly**: The remainders come out in reverse order (least significant digit first). Forgetting to reverse the result gives you the number backwards.

5. **Not handling negative numbers**: While the problem states we're given an integer n, and squaring/cubing will make negative numbers positive, it's worth noting that our algorithm assumes positive input for the conversion function.

## When You'll See This Pattern

Base conversion problems appear in various forms on coding interviews:

1. **Base Conversion Problems**:
   - LeetCode 504: "Base 7" - Convert decimal to base 7
   - LeetCode 168: "Excel Sheet Column Title" - Convert number to base-26 with A=1, B=2, etc.
   - LeetCode 171: "Excel Sheet Column Number" - Reverse of the above

2. **Number Theory Problems**:
   - Problems involving palindromes in different bases
   - Problems about number representation systems

3. **System Design Interviews**:
   - Designing URL shorteners (like TinyURL) often uses base conversion
   - Generating unique IDs in distributed systems

The core pattern is always the same: repeatedly divide by the base, collect remainders as digits, and reverse. The only variations are the base value and the digit mapping.

## Key Takeaways

1. **Base conversion algorithm**: Remember the pattern: while number > 0, take remainder = num % base, map to digit, num = num // base, then reverse the result.

2. **Edge cases matter**: Always test n=0, n=1, and large n values. Consider integer overflow in languages with fixed-width integers.

3. **Digit mapping is flexible**: The same algorithm works for any base from 2 to 36 by changing the digit string. For bases >36, you'd need to define additional symbols.

4. **Complexity is logarithmic**: The number of digits grows as O(logₐ n), where a is the base. This is much more efficient than linear or quadratic algorithms.

[Practice this problem on CodeJeet](/problem/hexadecimal-and-hexatrigesimal-conversion)
