---
title: "How to Solve Excel Sheet Column Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Excel Sheet Column Number. Easy difficulty, 67.3% acceptance rate. Topics: Math, String."
date: "2026-11-15"
category: "dsa-patterns"
tags: ["excel-sheet-column-number", "math", "string", "easy"]
---

# How to Solve Excel Sheet Column Number

This problem asks us to convert an Excel column title (like "AB") into its corresponding column number (28). What makes this interesting is that Excel columns use a base-26 numbering system, but with a twist: there's no zero digit. Instead of 0-25, we have 1-26, which affects how we calculate the positional values.

## Visual Walkthrough

Let's trace through the example "AB" to understand the conversion process:

**Step-by-step for "AB":**

1. Start with result = 0
2. Process first character 'A':
   - 'A' has value 1 (A=1, B=2, ..., Z=26)
   - result = 0 × 26 + 1 = 1
3. Process second character 'B':
   - 'B' has value 2
   - result = 1 × 26 + 2 = 28
4. Final answer: 28

**Another example "ZY":**

1. Start with result = 0
2. Process 'Z':
   - 'Z' has value 26
   - result = 0 × 26 + 26 = 26
3. Process 'Y':
   - 'Y' has value 25
   - result = 26 × 26 + 25 = 676 + 25 = 701
4. Final answer: 701

Think of this as a base-26 number system where each position represents a power of 26, but starting from the rightmost position as 26⁰. For "AB": A×26¹ + B×26⁰ = 1×26 + 2×1 = 28.

## Brute Force Approach

There's no true "brute force" alternative for this problem since any solution must process each character. However, a common naive approach would be to:

1. Generate all column titles up to the given one
2. Count how many titles were generated

This would be extremely inefficient (exponential time) because you'd need to generate all combinations. For example, to reach "ZZZ", you'd need to generate 26³ = 17,576 combinations!

The key insight is that we don't need to generate anything - we can compute the result directly using the mathematical relationship between the characters and their positions.

## Optimal Solution

The optimal solution treats the column title as a base-26 number, but with digits 1-26 instead of 0-25. We process from left to right, multiplying the current result by 26 and adding the value of the current character.

<div class="code-group">

```python
# Time: O(n) where n is length of columnTitle
# Space: O(1) - we only use a few variables
def titleToNumber(columnTitle: str) -> int:
    """
    Convert Excel column title to column number.

    Approach: Process each character from left to right,
    treating the string as a base-26 number where A=1, B=2, ..., Z=26.

    For each character:
    1. Convert character to its numeric value (A=1, B=2, ..., Z=26)
    2. Multiply current result by 26 (shifting left in base-26)
    3. Add the character's value

    Example: "AB" -> (1 * 26) + 2 = 28
    """
    result = 0  # Initialize result to 0

    # Process each character in the string
    for char in columnTitle:
        # Convert character to its numeric value
        # ord('A') = 65, so ord(char) - ord('A') gives 0 for A, 1 for B, etc.
        # Add 1 because Excel columns start at 1, not 0
        char_value = ord(char) - ord('A') + 1

        # Multiply current result by 26 (base) and add new character value
        # This is like building a number digit by digit in base-26
        result = result * 26 + char_value

    return result
```

```javascript
// Time: O(n) where n is length of columnTitle
// Space: O(1) - we only use a few variables
function titleToNumber(columnTitle) {
  /**
   * Convert Excel column title to column number.
   *
   * Approach: Process each character from left to right,
   * treating the string as a base-26 number where A=1, B=2, ..., Z=26.
   *
   * For each character:
   * 1. Convert character to its numeric value (A=1, B=2, ..., Z=26)
   * 2. Multiply current result by 26 (shifting left in base-26)
   * 3. Add the character's value
   *
   * Example: "AB" -> (1 * 26) + 2 = 28
   */
  let result = 0; // Initialize result to 0

  // Process each character in the string
  for (let i = 0; i < columnTitle.length; i++) {
    const char = columnTitle[i];

    // Convert character to its numeric value
    // 'A'.charCodeAt(0) = 65, so charCode - 'A'.charCodeAt(0) gives 0 for A, 1 for B, etc.
    // Add 1 because Excel columns start at 1, not 0
    const charValue = char.charCodeAt(0) - "A".charCodeAt(0) + 1;

    // Multiply current result by 26 (base) and add new character value
    // This is like building a number digit by digit in base-26
    result = result * 26 + charValue;
  }

  return result;
}
```

```java
// Time: O(n) where n is length of columnTitle
// Space: O(1) - we only use a few variables
public int titleToNumber(String columnTitle) {
    /**
     * Convert Excel column title to column number.
     *
     * Approach: Process each character from left to right,
     * treating the string as a base-26 number where A=1, B=2, ..., Z=26.
     *
     * For each character:
     * 1. Convert character to its numeric value (A=1, B=2, ..., Z=26)
     * 2. Multiply current result by 26 (shifting left in base-26)
     * 3. Add the character's value
     *
     * Example: "AB" -> (1 * 26) + 2 = 28
     */
    int result = 0;  // Initialize result to 0

    // Process each character in the string
    for (int i = 0; i < columnTitle.length(); i++) {
        char currentChar = columnTitle.charAt(i);

        // Convert character to its numeric value
        // 'A' has ASCII value 65, so currentChar - 'A' gives 0 for A, 1 for B, etc.
        // Add 1 because Excel columns start at 1, not 0
        int charValue = currentChar - 'A' + 1;

        // Multiply current result by 26 (base) and add new character value
        // This is like building a number digit by digit in base-26
        result = result * 26 + charValue;
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character in the input string exactly once
- `n` is the length of the `columnTitle` string
- Each operation (character conversion, multiplication, addition) is O(1)

**Space Complexity: O(1)**

- We only use a constant amount of extra space:
  - `result` variable to store the running total
  - `char_value` variable for the current character's numeric value
  - Loop counter/index variable
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to add 1 when converting characters**: The most common error is using `ord(char) - ord('A')` without the `+ 1`. Remember: A=1, not A=0. Excel columns start at 1, not 0.

2. **Processing from right to left instead of left to right**: While mathematically equivalent, processing left-to-right is simpler and more intuitive. If you process right-to-left, you need to track powers of 26, which adds complexity.

3. **Integer overflow for very long column titles**: While not a concern for typical Excel columns (max "XFD" = 16384), in theory, very long strings could overflow 32-bit integers. In interviews, mention that Python handles big integers automatically, but in Java/C++ you might need to use `long` or `BigInteger`.

4. **Not handling empty string**: While the problem guarantees non-empty input, in real interviews you might be asked about edge cases. Always check if the input could be empty and handle it appropriately.

## When You'll See This Pattern

This "positional number system conversion" pattern appears in several problems:

1. **Excel Sheet Column Title (LeetCode 168)**: The inverse problem - converting a number back to column title. Uses the same base-26 concept but with modulo and division operations.

2. **Base Conversion Problems**: Any problem involving converting between different bases (binary, decimal, hexadecimal) uses similar logic of multiplying by the base and adding digit values.

3. **String to Integer (atoi) (LeetCode 8)**: Converting a numeric string to an integer uses the same pattern: `result = result * 10 + digit`.

4. **Add Strings (LeetCode 415)**: Adding numbers represented as strings uses similar digit-by-digit processing with carry handling.

The core pattern is: **When processing positional number representations, iterate through digits from most significant to least significant, multiplying the current result by the base and adding the new digit's value.**

## Key Takeaways

1. **Recognize base conversion problems**: When you see problems involving letter-number conversions or different numbering systems, think about treating them as numbers in a different base.

2. **Left-to-right processing is often simplest**: For building numbers from strings, processing from left (most significant digit) to right is usually cleaner than the reverse.

3. **Watch for off-by-one adjustments**: Many real-world systems (like Excel columns) don't start at zero. Always verify the mapping between symbols and their numeric values.

4. **The multiply-and-add pattern**: `result = result * base + digit_value` is a fundamental pattern for building numbers from digit sequences.

Related problems: [Excel Sheet Column Title](/problem/excel-sheet-column-title), [Cells in a Range on an Excel Sheet](/problem/cells-in-a-range-on-an-excel-sheet)
