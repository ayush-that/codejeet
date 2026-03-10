---
title: "How to Solve Find the Key of the Numbers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Key of the Numbers. Easy difficulty, 76.5% acceptance rate. Topics: Math."
date: "2028-07-04"
category: "dsa-patterns"
tags: ["find-the-key-of-the-numbers", "math", "easy"]
---

# How to Solve "Find the Key of the Numbers"

This problem asks you to generate a four-digit "key" from three positive integers by examining each digit position across all three numbers and selecting the minimum digit for that position. The twist is that numbers with fewer than four digits must be padded with leading zeros before comparison. While conceptually straightforward, this problem tests your ability to handle digit manipulation, string formatting, and careful indexing—all common in interview problems involving numbers.

## Visual Walkthrough

Let's walk through an example step-by-step to build intuition. Suppose we have:

- `num1 = 987`
- `num2 = 6543`
- `num3 = 21`

**Step 1: Pad numbers to four digits**

- `num1 = 987` → becomes `"0987"` (padded with one leading zero)
- `num2 = 6543` → already four digits: `"6543"`
- `num3 = 21` → becomes `"0021"` (padded with two leading zeros)

**Step 2: Examine each digit position**
We'll look at each of the four positions (from left to right, or index 0 to 3):

- **Position 1 (index 0):** Compare `'0'` (from num1), `'6'` (from num2), `'0'` (from num3)
  - Minimum digit: `'0'`
- **Position 2 (index 1):** Compare `'9'`, `'5'`, `'0'`
  - Minimum digit: `'0'`
- **Position 3 (index 2):** Compare `'8'`, `'4'`, `'2'`
  - Minimum digit: `'2'`
- **Position 4 (index 3):** Compare `'7'`, `'3'`, `'1'`
  - Minimum digit: `'1'`

**Step 3: Build the key**
Concatenate the minimum digits: `'0'` + `'0'` + `'2'` + `'1'` = `"0021"`

**Step 4: Convert to integer**
`"0021"` as an integer is `21`

So the key for `(987, 6543, 21)` is `21`.

## Brute Force Approach

A brute force approach would involve:

1. Converting each number to a string
2. Manually padding with zeros by counting digits and adding `'0'` characters
3. For each of the four positions, comparing the three characters and finding the minimum
4. Building the result string and converting to integer

While this approach works, it's verbose and error-prone. The main inefficiency isn't runtime (the problem size is fixed at three numbers and four digits), but rather code complexity. A naive implementation might:

- Incorrectly handle padding (adding zeros to the wrong side)
- Mix up string and integer comparisons
- Forget to handle the conversion back to integer

Let's see what the optimal solution looks like instead.

## Optimal Solution

The optimal approach uses string formatting to handle padding cleanly and then iterates through the four positions to find minimum digits. Here's the step-by-step reasoning:

1. **Padding**: Use string formatting (like `zfill` in Python or `padStart` in JavaScript) to ensure each number string has exactly 4 characters with leading zeros.
2. **Digit comparison**: For each of the 4 positions (0 to 3), compare the character at that position across all three padded strings.
3. **Minimum selection**: Since we're comparing characters, and digit characters `'0'` through `'9'` have the same ordering as their numeric values in ASCII, we can use `min()` directly.
4. **Building result**: Collect the minimum character for each position into a string, then convert to integer.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
# Since we always process exactly 3 numbers and 4 digits, complexity is constant
def find_key(num1: int, num2: int, num3: int) -> int:
    # Step 1: Convert each number to a string and pad to 4 digits with leading zeros
    # Using zfill ensures we always have exactly 4 characters
    str1 = str(num1).zfill(4)
    str2 = str(num2).zfill(4)
    str3 = str(num3).zfill(4)

    # Step 2: Initialize an empty list to store the minimum digits
    key_digits = []

    # Step 3: Iterate through each of the 4 positions
    for i in range(4):
        # Get the character at position i from each padded string
        digit1 = str1[i]
        digit2 = str2[i]
        digit3 = str3[i]

        # Step 4: Find the minimum digit character at this position
        # Since '0' < '1' < ... < '9' in ASCII, min() works correctly
        min_digit = min(digit1, digit2, digit3)

        # Step 5: Add the minimum digit to our result list
        key_digits.append(min_digit)

    # Step 6: Join the digits into a single string
    key_str = ''.join(key_digits)

    # Step 7: Convert the string to integer (leading zeros are automatically removed)
    return int(key_str)
```

```javascript
// Time: O(1) | Space: O(1)
// Constant time/space since we process fixed 3 numbers × 4 digits
function findKey(num1, num2, num3) {
  // Step 1: Convert each number to string and pad to 4 digits with leading zeros
  // padStart ensures the string has length 4 by adding '0' at the beginning
  const str1 = num1.toString().padStart(4, "0");
  const str2 = num2.toString().padStart(4, "0");
  const str3 = num3.toString().padStart(4, "0");

  // Step 2: Initialize an array to store the minimum digits
  const keyDigits = [];

  // Step 3: Iterate through each of the 4 positions (0 to 3)
  for (let i = 0; i < 4; i++) {
    // Get the character at position i from each padded string
    const digit1 = str1[i];
    const digit2 = str2[i];
    const digit3 = str3[i];

    // Step 4: Find the minimum digit character at this position
    // Math.min won't work on characters, so we compare directly
    let minDigit = digit1;
    if (digit2 < minDigit) minDigit = digit2;
    if (digit3 < minDigit) minDigit = digit3;

    // Step 5: Add the minimum digit to our result array
    keyDigits.push(minDigit);
  }

  // Step 6: Join the digits into a single string
  const keyStr = keyDigits.join("");

  // Step 7: Convert the string to integer (leading zeros are automatically removed)
  return parseInt(keyStr, 10);
}
```

```java
// Time: O(1) | Space: O(1)
// Constant complexity: 3 numbers × 4 digits = fixed operations
public int findKey(int num1, int num2, int num3) {
    // Step 1: Convert each number to string and pad to 4 digits with leading zeros
    // String.format with %04d formats integer with width 4, zero-padded
    String str1 = String.format("%04d", num1);
    String str2 = String.format("%04d", num2);
    String str3 = String.format("%04d", num3);

    // Step 2: Use StringBuilder to efficiently build the result string
    StringBuilder keyBuilder = new StringBuilder();

    // Step 3: Iterate through each of the 4 positions (0 to 3)
    for (int i = 0; i < 4; i++) {
        // Get the character at position i from each padded string
        char digit1 = str1.charAt(i);
        char digit2 = str2.charAt(i);
        char digit3 = str3.charAt(i);

        // Step 4: Find the minimum digit character at this position
        // Characters can be compared directly since '0' < '1' < ... < '9'
        char minDigit = digit1;
        if (digit2 < minDigit) minDigit = digit2;
        if (digit3 < minDigit) minDigit = digit3;

        // Step 5: Append the minimum digit to our result
        keyBuilder.append(minDigit);
    }

    // Step 6: Convert the StringBuilder to String
    String keyStr = keyBuilder.toString();

    // Step 7: Convert the string to integer (leading zeros are automatically handled)
    return Integer.parseInt(keyStr);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- We always process exactly 3 numbers
- Each number is padded to exactly 4 digits
- We perform exactly 4 iterations (one per digit position)
- Each iteration involves a constant number of comparisons
- All operations are constant time regardless of input size

**Space Complexity: O(1)**

- We store 3 strings of length 4 each → 12 characters
- We store the result string of length 4
- No data structures grow with input size
- Even though we allocate memory for strings, it's a fixed amount independent of the input numbers' magnitude

The constant complexity might seem surprising since we're processing numbers that could be large, but note that:

1. We only ever look at the last 4 digits after padding
2. The padding operation itself is O(1) in practice for fixed width
3. The input size in terms of "elements to process" is fixed at 3 numbers × 4 digits = 12 pieces of data

## Common Mistakes

1. **Padding on the wrong side**: Adding zeros to the right (trailing zeros) instead of the left (leading zeros). This changes the number's value. For example, padding `21` to four digits should give `0021`, not `2100`.
   - **How to avoid**: Use built-in padding functions (`zfill`, `padStart`, `String.format`) which handle this correctly.

2. **Comparing digits as strings vs numbers**: When comparing digit characters, `'10' < '2'` evaluates to `True` in string comparison (because `'1'` < `'2'`), but numerically 10 > 2. However, in our case, since we're comparing single digits, string comparison works because `'0'` < `'1'` < ... < `'9'` in ASCII.
   - **How to avoid**: Understand that for single characters representing digits 0-9, character comparison matches numeric comparison.

3. **Forgetting to convert back to integer**: The problem expects an integer return value, not a string. Returning `"0021"` instead of `21` would be incorrect.
   - **How to avoid**: Always check the return type specified in the problem and include the final conversion step.

4. **Assuming numbers are exactly 4 digits**: The problem explicitly states numbers may have fewer than 4 digits and must be padded. Not handling 1-, 2-, or 3-digit numbers will fail test cases.
   - **How to avoid**: Always implement the padding step, even if your initial test cases use 4-digit numbers.

## When You'll See This Pattern

This problem combines several patterns common in coding interviews:

1. **Digit manipulation**: Extracting and comparing digits of numbers appears in problems like:
   - **Palindrome Number**: Check if a number reads the same forwards and backwards by comparing digits from both ends.
   - **Reverse Integer**: Reverse the digits of a number by extracting digits one by one.

2. **String padding/formatting**: Ensuring strings have consistent length appears in:
   - **Add Binary**: Pad shorter binary strings with leading zeros before adding.
   - **Compare Version Numbers**: Split version strings and compare components, often needing to handle different lengths.

3. **Element-wise operations across multiple sequences**: Applying the same operation to corresponding elements appears in:
   - **Add Strings**: Add two numbers represented as strings by processing digits from right to left.
   - **Multiply Strings**: Multiply large numbers digit by digit.

The core technique of processing corresponding positions across multiple sequences is fundamental to many array and string problems.

## Key Takeaways

1. **Padding is a common requirement** when working with fixed-width representations. Learn your language's built-in padding functions (`zfill` in Python, `padStart` in JavaScript, `String.format` in Java) as they're cleaner and less error-prone than manual padding.

2. **For digit manipulation, consider converting to string** when you need to access individual digits by position. This is often simpler than using modulo and division, especially when dealing with leading zeros.

3. **When processing multiple sequences in parallel**, iterate by position/index rather than by element. This pattern appears whenever you need to compare or combine corresponding elements from multiple arrays or strings.

Related problems: [Largest Number](/problem/largest-number)
