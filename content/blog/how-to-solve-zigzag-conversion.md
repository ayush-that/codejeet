---
title: "How to Solve Zigzag Conversion — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Zigzag Conversion. Medium difficulty, 53.6% acceptance rate. Topics: String."
date: "2026-05-22"
category: "dsa-patterns"
tags: ["zigzag-conversion", "string", "medium"]
---

# How to Solve Zigzag Conversion

The Zigzag Conversion problem asks us to transform a string into a zigzag pattern across a specified number of rows, then read it row by row to produce the final output. What makes this problem interesting is that it's not about complex algorithms but rather careful pattern recognition and index manipulation. Many candidates struggle with the mathematical relationship between character positions in the original string and their placement in the zigzag structure.

## Visual Walkthrough

Let's trace through the example `"PAYPALISHIRING"` with `numRows = 3`:

```
Row 0: P   A   H   N
Row 1: A P L S I I G
Row 2: Y   I   R
```

If we write the indices of each character in the original string:

```
P(0)        A(4)        H(8)         N(12)
A(1) P(3)   L(5) S(7)   I(9) I(11)   G(13)
Y(2)        I(6)        R(10)
```

Reading row by row gives us: Row 0: `P(0) A(4) H(8) N(12)` → "PAHN"  
Row 1: `A(1) P(3) L(5) S(7) I(9) I(11) G(13)` → "APLSIIG"  
Row 2: `Y(2) I(6) R(10)` → "YIR"

Concatenating: `"PAHNAPLSIIGYIR"`

The key insight is noticing the pattern in how characters map to rows. Characters move down from row 0 to row (numRows-1), then back up to row 0, repeating this cycle.

## Brute Force Approach

A naive approach would be to actually build the zigzag pattern in a 2D array. We could:

1. Create a 2D grid with `numRows` rows and enough columns to hold all characters
2. Simulate writing characters in zigzag pattern
3. Read characters row by row

However, this approach is inefficient in both time and space. We'd need to determine how many columns are needed (which isn't trivial) and we'd waste space with empty cells. The time complexity would be O(n × numRows) in worst case, and space would be similar.

More importantly, this approach misses the mathematical pattern that allows us to solve the problem directly without simulating the entire grid.

## Optimized Approach

The optimal solution comes from recognizing that characters in each row follow a predictable pattern. For a given row `r`:

1. Characters in the "down" part of the cycle appear at indices: `r + 2 × (numRows - 1) × k` where k = 0, 1, 2...
2. Characters in the "up" part (except first and last rows) appear at indices: `(r + 2 × (numRows - 1) × k) + 2 × (numRows - 1 - r)`

The cycle length is `cycleLen = 2 × (numRows - 1)` when numRows > 1. For numRows = 1, the string remains unchanged.

We can think of it this way: Each "V" shape in the zigzag contains `2 × (numRows - 1)` characters (except when numRows = 1). Within each cycle, row 0 gets 1 character, rows 1 through numRows-2 get 2 characters, and row numRows-1 gets 1 character.

## Optimal Solution

Here's the implementation that directly calculates character positions without simulating the grid:

<div class="code-group">

```python
# Time: O(n) where n is length of string
# Space: O(n) for the result string
def convert(s: str, numRows: int) -> str:
    # Edge case: if only one row or string is shorter than numRows,
    # the string remains unchanged
    if numRows == 1 or numRows >= len(s):
        return s

    # Initialize result list for efficiency (string concatenation is O(n^2))
    result = []

    # Calculate cycle length: 2 * (numRows - 1)
    cycle_len = 2 * (numRows - 1)

    # Process each row
    for row in range(numRows):
        # For each row, we'll add characters that belong to this row
        # Start with the first character in this row
        i = row

        while i < len(s):
            # Add the character going down (always exists for valid i)
            result.append(s[i])

            # For middle rows (not first or last), we also have a character
            # going up in the zigzag pattern
            if row != 0 and row != numRows - 1:
                # Calculate index of character going up
                # It's cycle_len - (2 * row) positions ahead of i
                next_index = i + cycle_len - (2 * row)

                # Check if this index is within bounds
                if next_index < len(s):
                    result.append(s[next_index])

            # Move to next cycle
            i += cycle_len

    # Convert list to string
    return ''.join(result)
```

```javascript
// Time: O(n) where n is length of string
// Space: O(n) for the result string
function convert(s, numRows) {
  // Edge case: if only one row or string is shorter than numRows,
  // the string remains unchanged
  if (numRows === 1 || numRows >= s.length) {
    return s;
  }

  // Initialize result array for efficiency
  const result = [];

  // Calculate cycle length: 2 * (numRows - 1)
  const cycleLen = 2 * (numRows - 1);

  // Process each row
  for (let row = 0; row < numRows; row++) {
    // For each row, we'll add characters that belong to this row
    // Start with the first character in this row
    let i = row;

    while (i < s.length) {
      // Add the character going down (always exists for valid i)
      result.push(s[i]);

      // For middle rows (not first or last), we also have a character
      // going up in the zigzag pattern
      if (row !== 0 && row !== numRows - 1) {
        // Calculate index of character going up
        // It's cycleLen - (2 * row) positions ahead of i
        const nextIndex = i + cycleLen - 2 * row;

        // Check if this index is within bounds
        if (nextIndex < s.length) {
          result.push(s[nextIndex]);
        }
      }

      // Move to next cycle
      i += cycleLen;
    }
  }

  // Convert array to string
  return result.join("");
}
```

```java
// Time: O(n) where n is length of string
// Space: O(n) for the result string
class Solution {
    public String convert(String s, int numRows) {
        // Edge case: if only one row or string is shorter than numRows,
        // the string remains unchanged
        if (numRows == 1 || numRows >= s.length()) {
            return s;
        }

        // Use StringBuilder for efficient string concatenation
        StringBuilder result = new StringBuilder();

        // Calculate cycle length: 2 * (numRows - 1)
        int cycleLen = 2 * (numRows - 1);

        // Process each row
        for (int row = 0; row < numRows; row++) {
            // For each row, we'll add characters that belong to this row
            // Start with the first character in this row
            int i = row;

            while (i < s.length()) {
                // Add the character going down (always exists for valid i)
                result.append(s.charAt(i));

                // For middle rows (not first or last), we also have a character
                // going up in the zigzag pattern
                if (row != 0 && row != numRows - 1) {
                    // Calculate index of character going up
                    // It's cycleLen - (2 * row) positions ahead of i
                    int nextIndex = i + cycleLen - (2 * row);

                    // Check if this index is within bounds
                    if (nextIndex < s.length()) {
                        result.append(s.charAt(nextIndex));
                    }
                }

                // Move to next cycle
                i += cycleLen;
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
We visit each character exactly once. The outer loop runs `numRows` times, but the inner while loop ensures each character is processed only once. Even though we have nested loops, the total number of iterations is n (the length of the string).

**Space Complexity: O(n)**  
We need to store the result string, which has the same length as the input. The auxiliary space (excluding the output) is O(1) since we only use a few variables, but the output itself requires O(n) space.

## Common Mistakes

1. **Forgetting edge cases**: When `numRows = 1`, the cycle length formula `2 × (numRows - 1)` becomes 0, causing division by zero or infinite loops. Always handle `numRows = 1` as a special case where the output equals the input.

2. **Incorrect index calculation for middle rows**: The formula for the "upward" character in middle rows is `i + cycleLen - 2 × row`. A common mistake is using `i + 2 × (numRows - row)` or similar incorrect formulas. Test with small examples to verify.

3. **String concatenation inefficiency**: In languages like Java or Python, using `+=` for string concatenation in a loop creates a new string each time, making it O(n²). Use `StringBuilder` (Java), list join (Python), or array join (JavaScript) instead.

4. **Not checking bounds for the second character in middle rows**: After calculating the index for the upward character, always verify it's within the string length before accessing it.

## When You'll See This Pattern

This problem teaches pattern recognition and mathematical indexing, which appears in:

1. **Spiral Matrix (LeetCode 54)**: Similar concept of traversing a structure in a non-linear pattern and mapping indices.
2. **Diagonal Traverse (LeetCode 498)**: Requires similar index manipulation to traverse a matrix diagonally.
3. **Rotate Image (LeetCode 48)**: Involves mathematical transformations of indices in a 2D structure.

These problems all require you to find mathematical relationships between positions rather than simulating every step, which is more efficient and elegant.

## Key Takeaways

1. **Look for mathematical patterns instead of simulation**: When a problem involves regular patterns (zigzag, spiral, diagonal), there's often a formula that maps input indices to output positions without needing to build intermediate structures.

2. **Handle edge cases early**: Special cases like `numRows = 1` or strings shorter than `numRows` should be handled at the beginning to simplify the main logic.

3. **Test with small, concrete examples**: Tracing through examples with 3-4 rows helps reveal the pattern. Write down indices to see the mathematical relationship between positions.

[Practice this problem on CodeJeet](/problem/zigzag-conversion)
