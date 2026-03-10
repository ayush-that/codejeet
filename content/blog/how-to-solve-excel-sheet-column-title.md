---
title: "How to Solve Excel Sheet Column Title — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Excel Sheet Column Title. Easy difficulty, 45.8% acceptance rate. Topics: Math, String."
date: "2027-01-11"
category: "dsa-patterns"
tags: ["excel-sheet-column-title", "math", "string", "easy"]
---

# How to Solve Excel Sheet Column Title

This problem asks us to convert a given integer column number into its corresponding Excel column title. While it appears simple, the tricky part is that Excel's column numbering system is **1-indexed** and uses base-26 with letters A-Z, but it's not a standard base conversion because there's no digit representing zero. This subtle difference trips up many candidates who try to apply standard base conversion algorithms directly.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we need to convert `columnNumber = 28` to an Excel column title.

**Step 1:** In Excel, columns go A=1, B=2, ..., Z=26, then AA=27, AB=28, etc. So 28 should become "AB".

**Step 2:** The key insight is that we need to work from right to left (least significant "digit" to most significant). For 28:

- First, we find the rightmost character: `28 % 26 = 2`. But wait, 2 corresponds to 'B', not 'A'! And if we had 26, `26 % 26 = 0`, which doesn't correspond to any letter.
- The issue is that our system is 1-indexed, not 0-indexed. We need to adjust by subtracting 1 before the modulo operation: `(28 - 1) % 26 = 27 % 26 = 1`. Now 1 corresponds to 'A'.
- We add 'A' to our result (building it in reverse order).
- Update column number: `(28 - 1) // 26 = 27 // 26 = 1`.

**Step 3:** Now columnNumber = 1:

- `(1 - 1) % 26 = 0 % 26 = 0` → 'A'
- Add 'A' to result (now we have "AA" in reverse, which is "AA")
- Update: `(1 - 1) // 26 = 0 // 26 = 0` → we're done

**Step 4:** Reverse the result "AA" → "AA". But 28 should be "AB", not "AA"! What went wrong?

Let's trace more carefully:

For 28:

- `(28 - 1) % 26 = 1` → 'B' (since 0='A', 1='B')
- Add 'B' to result
- Update: `(28 - 1) // 26 = 1`
- Now columnNumber = 1:
  - `(1 - 1) % 26 = 0` → 'A'
  - Add 'A' to result (now we have "BA")
  - Update: `(1 - 1) // 26 = 0` → done
- Reverse "BA" → "AB" ✓

The key is remembering that after subtracting 1, 0 maps to 'A', 1 to 'B', ..., 25 to 'Z'.

## Brute Force Approach

There's no true "brute force" for this mathematical conversion problem, but candidates often try these incorrect approaches:

1. **Direct base-26 conversion**: Trying to use standard base conversion without adjusting for the 1-indexed system. This fails because Excel has no zero digit.
2. **Precomputed mapping**: Building a dictionary for all possible column numbers. This is impossible since column numbers can be up to 2³¹ - 1.
3. **Recursive guessing**: Trying to find the largest power of 26 that fits, then recursively solve. This becomes messy with the off-by-one adjustments.

The common failed attempt looks like this (incorrect):

```python
def convertToTitle(columnNumber):
    result = ""
    while columnNumber > 0:
        remainder = columnNumber % 26
        result = chr(remainder - 1 + ord('A')) + result
        columnNumber //= 26
    return result
```

This fails for columnNumber = 26 (should be "Z" but gives "A@") and for columnNumber = 52 (should be "AZ" but gives "B@"). The issue is that when remainder = 0, we're trying to get chr(-1 + ord('A')).

## Optimal Solution

The correct approach handles the 1-indexed system by subtracting 1 before each operation. This adjustment maps the range 1-26 to 0-25, which works correctly with modulo and integer division.

<div class="code-group">

```python
# Time: O(log₂₆(n)) | Space: O(log₂₆(n))
def convertToTitle(columnNumber: int) -> str:
    """
    Convert an integer column number to Excel column title.

    The key insight: Excel columns are 1-indexed (A=1, B=2, ..., Z=26),
    but modulo arithmetic works best with 0-indexed systems.
    We adjust by subtracting 1 before each operation.

    Args:
        columnNumber: The column number to convert (1-indexed)

    Returns:
        The corresponding Excel column title as a string
    """
    result = []

    # Process digits from right to left (least to most significant)
    while columnNumber > 0:
        # Subtract 1 to convert from 1-indexed to 0-indexed
        # Now 0 maps to 'A', 1 to 'B', ..., 25 to 'Z'
        columnNumber -= 1

        # Get the current digit (0-25) which corresponds to A-Z
        remainder = columnNumber % 26

        # Convert remainder to corresponding character
        # ord('A') gives 65, so 0 + 65 = 65 = 'A'
        char = chr(remainder + ord('A'))

        # Build result in reverse order (we'll reverse at the end)
        result.append(char)

        # Move to next more significant digit
        columnNumber //= 26

    # Reverse the result since we built it from least to most significant digit
    # Join into a single string
    return ''.join(reversed(result))
```

```javascript
// Time: O(log₂₆(n)) | Space: O(log₂₆(n))
/**
 * Convert an integer column number to Excel column title.
 *
 * The key insight: Excel columns are 1-indexed (A=1, B=2, ..., Z=26),
 * but modulo arithmetic works best with 0-indexed systems.
 * We adjust by subtracting 1 before each operation.
 *
 * @param {number} columnNumber - The column number to convert (1-indexed)
 * @return {string} The corresponding Excel column title
 */
function convertToTitle(columnNumber) {
  let result = [];

  // Process digits from right to left (least to most significant)
  while (columnNumber > 0) {
    // Subtract 1 to convert from 1-indexed to 0-indexed
    // Now 0 maps to 'A', 1 to 'B', ..., 25 to 'Z'
    columnNumber--;

    // Get the current digit (0-25) which corresponds to A-Z
    const remainder = columnNumber % 26;

    // Convert remainder to corresponding character
    // 'A'.charCodeAt(0) gives 65, so 0 + 65 = 65 = 'A'
    const char = String.fromCharCode(remainder + "A".charCodeAt(0));

    // Build result in reverse order (we'll reverse at the end)
    result.push(char);

    // Move to next more significant digit
    columnNumber = Math.floor(columnNumber / 26);
  }

  // Reverse the result since we built it from least to most significant digit
  // Join into a single string
  return result.reverse().join("");
}
```

```java
// Time: O(log₂₆(n)) | Space: O(log₂₆(n))
class Solution {
    /**
     * Convert an integer column number to Excel column title.
     *
     * The key insight: Excel columns are 1-indexed (A=1, B=2, ..., Z=26),
     * but modulo arithmetic works best with 0-indexed systems.
     * We adjust by subtracting 1 before each operation.
     *
     * @param columnNumber The column number to convert (1-indexed)
     * @return The corresponding Excel column title
     */
    public String convertToTitle(int columnNumber) {
        StringBuilder result = new StringBuilder();

        // Process digits from right to left (least to most significant)
        while (columnNumber > 0) {
            // Subtract 1 to convert from 1-indexed to 0-indexed
            // Now 0 maps to 'A', 1 to 'B', ..., 25 to 'Z'
            columnNumber--;

            // Get the current digit (0-25) which corresponds to A-Z
            int remainder = columnNumber % 26;

            // Convert remainder to corresponding character
            // 'A' has ASCII value 65, so 0 + 65 = 65 = 'A'
            char currentChar = (char) (remainder + 'A');

            // Build result in reverse order (we'll reverse at the end)
            result.append(currentChar);

            // Move to next more significant digit
            columnNumber /= 26;
        }

        // Reverse the result since we built it from least to most significant digit
        return result.reverse().toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log₂₆(n))

- Each iteration reduces the column number by a factor of 26 (columnNumber //= 26)
- The number of iterations equals the number of digits in the base-26 representation
- For columnNumber = n, this is log₂₆(n) iterations

**Space Complexity:** O(log₂₆(n))

- We store one character per digit in the result
- The StringBuilder/array stores log₂₆(n) characters
- This is the minimum required space to store the output

## Common Mistakes

1. **Forgetting to subtract 1 before modulo operation**: This is the most common error. Without subtracting 1, when columnNumber = 26, you get remainder = 0, which doesn't map to any letter. The correct approach: always subtract 1 first.

2. **Incorrect character mapping**: Using `chr(remainder + ord('A') - 1)` instead of `chr(remainder + ord('A'))`. Remember: after subtracting 1 from columnNumber, remainder is 0-25, which maps directly to A-Z with + ord('A').

3. **Wrong loop condition**: Using `while columnNumber >= 26` instead of `while columnNumber > 0`. This misses single-letter columns when columnNumber < 26.

4. **Building result in wrong order**: Forgetting to reverse the result at the end. Since we process from least significant to most significant digit, we need to reverse the final string.

5. **Integer division errors in JavaScript**: Using `columnNumber / 26` without `Math.floor()` in JavaScript. JavaScript doesn't have integer division by default, so you must use `Math.floor()`.

## When You'll See This Pattern

This "1-indexed base conversion" pattern appears in several problems:

1. **Excel Sheet Column Number (LeetCode 171)**: The inverse of this problem - converting column title back to number. Uses the same 1-indexed base-26 system but in reverse.

2. **Convert to Base -2 (LeetCode 1017)**: While not exactly the same, it involves non-standard base conversion with careful handling of remainders.

3. **Integer to Roman (LeetCode 12)**: Similar concept of converting a number to a special numeral system with specific symbols and rules.

4. **Any problem involving custom numeral systems**: Whenever you need to convert between numbers and representations with special rules (like Excel columns, Roman numerals, or custom base systems), think about adjusted modulo arithmetic.

## Key Takeaways

1. **1-indexed systems require adjustment**: When dealing with 1-indexed numbering (like Excel columns where A=1), subtract 1 before modulo/division operations to work in a 0-indexed space where standard arithmetic works cleanly.

2. **Process from least to most significant**: For base conversion problems, always work from the rightmost digit (least significant) to the leftmost (most significant), then reverse the result.

3. **Test edge cases**: Always test columnNumber = 1 (A), 26 (Z), 27 (AA), 52 (AZ), 701 (ZY). These reveal off-by-one errors in the modulo logic.

4. **Recognize the pattern**: Any time you see a problem about converting between numbers and letter sequences with A=1, B=2, etc., immediately think: "This is base-26 but 1-indexed, so I need to subtract 1."

Related problems: [Excel Sheet Column Number](/problem/excel-sheet-column-number), [Cells in a Range on an Excel Sheet](/problem/cells-in-a-range-on-an-excel-sheet), [Design Spreadsheet](/problem/design-spreadsheet)
