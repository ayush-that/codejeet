---
title: "How to Solve Complex Number Multiplication — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Complex Number Multiplication. Medium difficulty, 73.2% acceptance rate. Topics: Math, String, Simulation."
date: "2027-03-31"
category: "dsa-patterns"
tags: ["complex-number-multiplication", "math", "string", "simulation", "medium"]
---

# How to Solve Complex Number Multiplication

This problem asks us to multiply two complex numbers given as strings in the format `"a+bi"` and return the result in the same format. While the math is straightforward, the challenge lies in parsing the strings correctly—handling negative numbers, extracting both real and imaginary parts, and dealing with the `"i"` suffix. Many candidates stumble on the parsing logic, especially with edge cases like negative imaginary parts.

## Visual Walkthrough

Let's trace through an example: `"1+1i"` × `"1+1i"`

1. **Parse the first complex number:**
   - Real part: `1`
   - Imaginary part: `1`

2. **Parse the second complex number:**
   - Real part: `1`
   - Imaginary part: `1`

3. **Apply complex multiplication formula:**
   For two complex numbers `(a + bi)` and `(c + di)`:
   - Real part = `(a * c) - (b * d)`
   - Imaginary part = `(a * d) + (b * c)`

   Plugging in our values:
   - Real = `(1 * 1) - (1 * 1) = 1 - 1 = 0`
   - Imaginary = `(1 * 1) + (1 * 1) = 1 + 1 = 2`

4. **Format the result:**
   - Combine as `"0+2i"`

Now let's try a trickier example: `"1+-1i"` × `"1+-1i"`

1. **Parse first number:**
   - Real: `1`
   - Imaginary: `-1` (note the negative sign)

2. **Parse second number:**
   - Real: `1`
   - Imaginary: `-1`

3. **Calculate:**
   - Real = `(1 * 1) - (-1 * -1) = 1 - 1 = 0`
   - Imaginary = `(1 * -1) + (-1 * 1) = -1 + -1 = -2`

4. **Result:** `"0+-2i"`

## Brute Force Approach

There's no traditional "brute force" for this problem since we're not searching or iterating. However, a naive approach would be to manually parse the strings with complex string manipulation—splitting on `"+"`, then handling the `"i"`, then dealing with negative signs. This often leads to messy code with many edge cases.

What makes this approach problematic is that it's error-prone. Consider these edge cases:

- `"1+1i"` (simple case)
- `"1+-1i"` (negative imaginary part)
- `"-1+1i"` (negative real part)
- `"-1+-1i"` (both parts negative)
- `"0+0i"` (zero values)

A naive parser might incorrectly handle the `"+-"` sequence or fail to remove the `"i"` properly. While this approach would technically work if implemented correctly, it's fragile and hard to debug.

## Optimized Approach

The key insight is that we can use the `split()` method with the `"+"` delimiter, but we need to be careful because the imaginary part might have a `"-"` sign. Actually, there's an even cleaner approach: split on `"+"` but keep the `"-"` attached to the numbers.

Better yet, we can use a regular expression or simple observation: every string has exactly one `"+"` separating real and imaginary parts. The imaginary part always ends with `"i"`. So we can:

1. Find the `"+"` index
2. Extract real part as substring from start to `"+"`
3. Extract imaginary part as substring from `"+"` to end, excluding the final `"i"`

But wait—what about `"+-"`? Actually, the format guarantees exactly one `"+"` between real and imaginary parts, even if imaginary is negative. So `"1+-1i"` has `"+"` at index 1, and the imaginary part is `"-1i"`.

Once parsed, we apply the complex multiplication formula:

- Result real = `(a * c) - (b * d)`
- Result imaginary = `(a * d) + (b * c)`

Then format as `"real+imaginaryi"`.

## Optimal Solution

Here's the clean implementation that handles all cases correctly:

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def complexNumberMultiply(num1: str, num2: str) -> str:
    """
    Multiply two complex numbers given as strings in "a+bi" format.

    Steps:
    1. Parse real and imaginary parts from both numbers
    2. Apply complex multiplication formula
    3. Format and return result
    """

    # Step 1: Parse the first complex number
    # Find the '+' index - it separates real and imaginary parts
    plus_index1 = num1.index('+')
    # Real part is everything before '+'
    a = int(num1[:plus_index1])
    # Imaginary part is everything between '+' and 'i' (excluding 'i')
    b = int(num1[plus_index1 + 1:-1])

    # Step 2: Parse the second complex number
    plus_index2 = num2.index('+')
    c = int(num2[:plus_index2])
    d = int(num2[plus_index2 + 1:-1])

    # Step 3: Apply complex multiplication formula
    # (a + bi) * (c + di) = (ac - bd) + (ad + bc)i
    real_part = (a * c) - (b * d)
    imag_part = (a * d) + (b * c)

    # Step 4: Format the result as "real+imaginaryi"
    return f"{real_part}+{imag_part}i"
```

```javascript
// Time: O(1) | Space: O(1)
function complexNumberMultiply(num1, num2) {
  /**
   * Multiply two complex numbers given as strings in "a+bi" format.
   *
   * Steps:
   * 1. Parse real and imaginary parts from both numbers
   * 2. Apply complex multiplication formula
   * 3. Format and return result
   */

  // Step 1: Parse the first complex number
  // Find the '+' index - it separates real and imaginary parts
  const plusIndex1 = num1.indexOf("+");
  // Real part is everything before '+'
  const a = parseInt(num1.substring(0, plusIndex1));
  // Imaginary part is everything between '+' and 'i' (excluding 'i')
  const b = parseInt(num1.substring(plusIndex1 + 1, num1.length - 1));

  // Step 2: Parse the second complex number
  const plusIndex2 = num2.indexOf("+");
  const c = parseInt(num2.substring(0, plusIndex2));
  const d = parseInt(num2.substring(plusIndex2 + 1, num2.length - 1));

  // Step 3: Apply complex multiplication formula
  // (a + bi) * (c + di) = (ac - bd) + (ad + bc)i
  const realPart = a * c - b * d;
  const imagPart = a * d + b * c;

  // Step 4: Format the result as "real+imaginaryi"
  return `${realPart}+${imagPart}i`;
}
```

```java
// Time: O(1) | Space: O(1)
public String complexNumberMultiply(String num1, String num2) {
    /**
     * Multiply two complex numbers given as strings in "a+bi" format.
     *
     * Steps:
     * 1. Parse real and imaginary parts from both numbers
     * 2. Apply complex multiplication formula
     * 3. Format and return result
     */

    // Step 1: Parse the first complex number
    // Find the '+' index - it separates real and imaginary parts
    int plusIndex1 = num1.indexOf('+');
    // Real part is everything before '+'
    int a = Integer.parseInt(num1.substring(0, plusIndex1));
    // Imaginary part is everything between '+' and 'i' (excluding 'i')
    int b = Integer.parseInt(num1.substring(plusIndex1 + 1, num1.length() - 1));

    // Step 2: Parse the second complex number
    int plusIndex2 = num2.indexOf('+');
    int c = Integer.parseInt(num2.substring(0, plusIndex2));
    int d = Integer.parseInt(num2.substring(plusIndex2 + 1, num2.length() - 1));

    // Step 3: Apply complex multiplication formula
    // (a + bi) * (c + di) = (ac - bd) + (ad + bc)i
    int realPart = (a * c) - (b * d);
    int imagPart = (a * d) + (b * c);

    // Step 4: Format the result as "real+imaginaryi"
    return realPart + "+" + imagPart + "i";
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We perform a constant number of operations: finding the `'+'` index (O(n) but n ≤ 7 since numbers are in range [-100, 100]), parsing integers, arithmetic operations, and string concatenation.
- Since the input strings have maximum length of about 7 characters (e.g., "-100+-100i"), all operations are effectively constant time.

**Space Complexity:** O(1)

- We only store a few integer variables (a, b, c, d, realPart, imagPart) and the result string.
- No additional data structures that grow with input size.

## Common Mistakes

1. **Forgetting to remove the 'i' when parsing:** Some candidates extract the imaginary part as `"-1i"` instead of `"-1"`, then try to convert to integer, causing a NumberFormatException. Always remember to exclude the last character when parsing the imaginary part.

2. **Incorrect index manipulation:** When using `substring()` or slicing, off-by-one errors are common. For the imaginary part, we need `num1[plusIndex1 + 1:-1]` (Python) or `num1.substring(plusIndex1 + 1, num1.length() - 1)` (Java/JS) to exclude both the `'+'` and the `'i'`.

3. **Wrong multiplication formula:** Some candidates mistakenly calculate `(a * c) + (b * d)` for the real part or `(a * d) - (b * c)` for the imaginary part. Remember: `(a+bi)(c+di) = ac + adi + bci + bdi² = (ac - bd) + (ad + bc)i` (since i² = -1).

4. **Not handling negative numbers in parsing:** The `parseInt()` or `Integer.parseInt()` functions handle negative signs automatically, so `"-1"` parses to `-1`. Some candidates try to manually handle the sign, which adds unnecessary complexity.

## When You'll See This Pattern

This problem combines string parsing with mathematical computation—a common pattern in interview questions:

1. **String to Integer (atoi)** - Similar parsing challenges with signs and boundary checking
2. **Fraction Addition and Subtraction** - Requires parsing fractions (e.g., `"1/2"`), performing arithmetic, and simplifying results
3. **Solve the Equation** - Involves parsing algebraic expressions and solving for variables

The core technique of "parse, compute, format" appears in many problems where input comes as formatted strings that need to be interpreted, processed, and output in a specific format.

## Key Takeaways

1. **Break complex problems into clear steps:** Parsing → Computation → Formatting. This modular approach makes the solution easier to reason about and debug.

2. **Leverage built-in functions:** Use `indexOf()`, `substring()`, and `parseInt()` instead of manual character-by-character parsing. They're less error-prone and more readable.

3. **Test edge cases systematically:** For string parsing problems, always test with negative numbers, zero values, and minimum/maximum inputs. A small set of well-chosen test cases can catch most common bugs.

[Practice this problem on CodeJeet](/problem/complex-number-multiplication)
