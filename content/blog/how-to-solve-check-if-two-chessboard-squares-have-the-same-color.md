---
title: "How to Solve Check if Two Chessboard Squares Have the Same Color — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if Two Chessboard Squares Have the Same Color. Easy difficulty, 72.2% acceptance rate. Topics: Math, String."
date: "2028-01-31"
category: "dsa-patterns"
tags: ["check-if-two-chessboard-squares-have-the-same-color", "math", "string", "easy"]
---

# How to Solve "Check if Two Chessboard Squares Have the Same Color"

This problem asks you to determine whether two given chessboard squares (like "a1" or "h8") share the same color on a standard 8×8 chessboard. While conceptually simple, it's interesting because it requires translating chess notation into a mathematical pattern that reveals the board's alternating color scheme. The tricky part is recognizing that the chessboard's color pattern follows a consistent parity rule that can be computed without visualizing the board.

## Visual Walkthrough

Let's trace through an example: `coordinate1 = "a1"` and `coordinate2 = "h8"`.

On a chessboard:

- "a1" is the bottom-left square. In the image, this square is dark.
- "h8" is the top-right square. This is also dark.

But how do we determine this programmatically?

Chess notation uses a letter (a-h) for the column and a number (1-8) for the row. Notice:

- Columns: a=1, b=2, c=3, d=4, e=5, f=6, g=7, h=8
- Rows: 1-8 as given

The key insight: **A square's color depends on whether the sum of its column index and row index is even or odd.**

Let's calculate:

- "a1": column 'a' → 1, row '1' → 1. Sum = 1 + 1 = 2 (even) → dark square
- "h8": column 'h' → 8, row '8' → 8. Sum = 8 + 8 = 16 (even) → dark square

Since both sums are even, both squares are dark, so they have the same color. The function should return `true`.

## Brute Force Approach

A naive approach might try to build the entire chessboard in memory as a 2D array, populate it with colors, then look up the coordinates. This would work but is unnecessarily complex:

1. Create an 8×8 array
2. Fill it with alternating colors starting from (0,0) as dark
3. Convert coordinates to array indices
4. Compare the colors at those positions

This approach uses O(64) = O(1) space and O(1) time, but it's overcomplicated. The main issue isn't performance—it's unnecessary complexity. Interviewers would expect you to recognize the mathematical pattern rather than brute-force building the board.

## Optimal Solution

The optimal solution uses the parity observation: two squares have the same color if and only if the parity (even/odd) of (column + row) is the same for both squares.

We can compute this by:

1. Extracting the column letter and row number from each coordinate string
2. Converting the column letter to a number (a=1, b=2, etc.)
3. Calculating (column_number + row_number) % 2 for each square
4. Comparing the results

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def checkTwoChessboards(coordinate1, coordinate2):
    """
    Returns True if two chessboard squares have the same color.

    The key insight: On a chessboard, square color alternates.
    A square is dark if (column_index + row_index) is even.
    Two squares have the same color if this parity matches.
    """

    def get_color_parity(coord):
        """Helper function to compute color parity for a single square."""
        # Extract column letter and row number from string like "a1"
        col_letter = coord[0]  # First character is column letter
        row_digit = coord[1]   # Second character is row number

        # Convert column letter to number: 'a' -> 1, 'b' -> 2, etc.
        # ord('a') = 97, so ord(col_letter) - ord('a') + 1 gives 1 for 'a'
        col_number = ord(col_letter) - ord('a') + 1

        # Convert row digit from string to integer
        row_number = int(row_digit)

        # Return parity: 0 for even (dark), 1 for odd (light)
        # Using modulo 2 gives us 0 for even sums, 1 for odd sums
        return (col_number + row_number) % 2

    # Compare parities: same parity means same color
    return get_color_parity(coordinate1) == get_color_parity(coordinate2)
```

```javascript
// Time: O(1) | Space: O(1)
function checkTwoChessboards(coordinate1, coordinate2) {
  /**
   * Returns true if two chessboard squares have the same color.
   *
   * The key insight: On a chessboard, square color alternates.
   * A square is dark if (column_index + row_index) is even.
   * Two squares have the same color if this parity matches.
   */

  function getColorParity(coord) {
    // Extract column letter and row number from string like "a1"
    const colLetter = coord[0]; // First character is column letter
    const rowDigit = coord[1]; // Second character is row number

    // Convert column letter to number: 'a' -> 1, 'b' -> 2, etc.
    // 'a'.charCodeAt(0) = 97, so charCodeAt(0) - 97 + 1 gives 1 for 'a'
    const colNumber = colLetter.charCodeAt(0) - "a".charCodeAt(0) + 1;

    // Convert row digit from string to integer
    // Using parseInt or unary plus operator
    const rowNumber = parseInt(rowDigit, 10);

    // Return parity: 0 for even (dark), 1 for odd (light)
    // Using modulo 2 gives us 0 for even sums, 1 for odd sums
    return (colNumber + rowNumber) % 2;
  }

  // Compare parities: same parity means same color
  return getColorParity(coordinate1) === getColorParity(coordinate2);
}
```

```java
// Time: O(1) | Space: O(1)
public class Solution {
    public boolean checkTwoChessboards(String coordinate1, String coordinate2) {
        /**
         * Returns true if two chessboard squares have the same color.
         *
         * The key insight: On a chessboard, square color alternates.
         * A square is dark if (column_index + row_index) is even.
         * Two squares have the same color if this parity matches.
         */

        // Helper function to compute color parity for a single square
        int parity1 = getColorParity(coordinate1);
        int parity2 = getColorParity(coordinate2);

        // Compare parities: same parity means same color
        return parity1 == parity2;
    }

    private int getColorParity(String coord) {
        // Extract column letter and row number from string like "a1"
        char colLetter = coord.charAt(0);  // First character is column letter
        char rowDigit = coord.charAt(1);   // Second character is row number

        // Convert column letter to number: 'a' -> 1, 'b' -> 2, etc.
        // 'a' has ASCII value 97, so (colLetter - 'a' + 1) gives 1 for 'a'
        int colNumber = colLetter - 'a' + 1;

        // Convert row digit from char to integer
        // Character.getNumericValue() converts '1' to 1, etc.
        int rowNumber = Character.getNumericValue(rowDigit);

        // Return parity: 0 for even (dark), 1 for odd (light)
        // Using modulo 2 gives us 0 for even sums, 1 for odd sums
        return (colNumber + rowNumber) % 2;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We perform a constant number of operations: extracting characters, converting letters to numbers, adding, and comparing.
- The input size is always exactly 2 characters per coordinate, so operations don't scale with input size.

**Space Complexity:** O(1)

- We use only a few integer variables to store intermediate results.
- No data structures that grow with input size.

## Common Mistakes

1. **Off-by-one errors in column conversion**: Forgetting that 'a' should map to 1, not 0. If you use `ord(col_letter) - ord('a')` without adding 1, 'a1' would give 0+1=1 (odd, light) instead of 1+1=2 (even, dark). Always verify with test cases like "a1" (dark) and "a2" (light).

2. **Incorrect parity calculation**: Some candidates calculate `(col_number % 2) == (row_number % 2)` instead of `(col_number + row_number) % 2`. While mathematically equivalent for checking if both are even or both are odd, the sum approach is more intuitive and directly matches the chessboard pattern.

3. **Assuming the board starts with a light square**: The standard chessboard has a dark square at a1 (bottom-left). If you assume a1 is light, all your calculations will be inverted. Always clarify or test with known examples.

4. **Not handling coordinates with two-digit row numbers**: The problem guarantees 8×8 board with rows 1-8, so rows are always single digits. But in a variation, you'd need to handle "a10" by taking `coord[1:]` instead of `coord[1]`.

## When You'll See This Pattern

This parity/alternating pattern appears in several types of problems:

1. **Grid coloring problems**: Any problem involving checkerboard patterns, like [Determine Color of a Chessboard Square](https://leetcode.com/problems/determine-color-of-a-chessboard-square/) (the single-square version of this problem).

2. **Matrix traversal with alternating rules**: Problems where you move differently depending on whether you're on an "even" or "odd" cell, like some knight move problems or games on checkerboards.

3. **Coordinate transformation problems**: Any problem requiring conversion between different coordinate systems, like converting chess notation to matrix indices or vice versa.

The core technique is recognizing that alternating patterns often reduce to parity checks on indices. When you see "checkerboard", "alternating", or "chessboard" in a problem description, immediately think about whether `(row + column) % 2` or similar parity checks apply.

## Key Takeaways

1. **Chessboard color follows a simple parity rule**: A square at (col, row) is dark if (col + row) is even, light if odd. This works because the board alternates in both directions.

2. **Convert letters to numbers systematically**: Use `ord(letter) - ord('a') + 1` to convert 'a'=1, 'b'=2, etc. This pattern works for any letter-based coordinate system.

3. **Simple math beats complex simulation**: Instead of building the board, recognize the underlying mathematical pattern. This is a common theme in coding interviews—look for the formula before writing lots of code.

Related problems: [Determine Color of a Chessboard Square](/problem/determine-color-of-a-chessboard-square)
