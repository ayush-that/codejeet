---
title: "How to Solve Decode the Slanted Ciphertext — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Decode the Slanted Ciphertext. Medium difficulty, 50.3% acceptance rate. Topics: String, Simulation."
date: "2029-11-28"
category: "dsa-patterns"
tags: ["decode-the-slanted-ciphertext", "string", "simulation", "medium"]
---

## How to Solve Decode the Slanted Ciphertext

This problem asks us to decode a string that was encoded using a slanted transposition cipher. The tricky part is understanding how the original text was placed in a matrix and then read diagonally to produce the encoded text. The core challenge is reversing this diagonal reading pattern to reconstruct the original text without actually building the full matrix.

---

## Visual Walkthrough

Let's walk through the example from the problem statement:

**Input:**

- `encodedText = "ch   ie   pr"`
- `rows = 3`

**Step 1 — Understanding the encoding process**
First, we need to understand how the original text was encoded. The original text is placed in a matrix row by row, then read diagonally from top-left to bottom-right.

If the original text was "cipher" with 3 rows:

```
Row 0: c i p
Row 1: h e r
Row 2:   (empty cells)
```

But wait — the actual encoding reads diagonally! Let's trace through the given example:

**Step 2 — Understanding the encoded text format**
The encoded text "ch ie pr" has spaces. These represent empty cells in the matrix. The encoded text is created by reading diagonally:

- Start at (0,0): 'c'
- Next diagonal: (0,1) and (1,0): 'h' then ' ' (space)
- Next: (0,2) and (1,1) and (2,0): 'i' then 'e' then ' '
- And so on...

**Step 3 — Reversing the process**
To decode, we need to:

1. Calculate the number of columns: `cols = ceil(len(encodedText) / rows)`
2. Map each position in the encoded text back to its original matrix position
3. Read the matrix row by row to reconstruct the original text

For our example:

- `encodedText = "ch   ie   pr"` (length = 12)
- `rows = 3`
- `cols = ceil(12 / 3) = 4`

The matrix would be 3×4. The key insight: when we read diagonally to encode, we're essentially traversing the matrix with a specific pattern. To decode, we need to reverse this pattern.

---

## Brute Force Approach

A naive approach would be to:

1. Build the full matrix by placing characters from the encoded text according to the diagonal reading pattern
2. Then read the matrix row by row to get the original text

However, this approach has several issues:

- We'd need to handle empty cells (spaces) correctly
- The matrix might be sparse (not all cells filled)
- We'd waste memory building the full matrix
- The diagonal traversal logic is complex to implement correctly

The brute force would involve:

- Creating a rows × cols matrix
- Simulating the diagonal reading pattern to fill the matrix
- Reading row by row to reconstruct the original

This is O(rows × cols) time and space, which for large inputs could be inefficient when we can solve it with direct mapping.

---

## Optimized Approach

The key insight is that we don't need to build the actual matrix. We can directly map each position in the original text to its corresponding position in the encoded text using a mathematical formula.

**Step-by-step reasoning:**

1. **Calculate columns:** `cols = ceil(len(encodedText) / rows)`
   - This tells us the width of the virtual matrix

2. **Understand the encoding pattern:**
   - The encoded text is created by reading diagonals
   - Each diagonal starts at the top row and goes down-left
   - The k-th diagonal starts at position (0, k) in the matrix

3. **Direct mapping formula:**
   - For a character at position (r, c) in the original matrix (row-major order)
   - Its position in the encoded text is: `encodedIndex = c * rows + r`
   - But wait — this gives us column-major order, not diagonal!

   Actually, the correct insight is simpler: The encoded text is just the original text placed in column-major order in a matrix of size `rows × cols`!

4. **Simpler approach:**
   - If we place the original text in the matrix row by row
   - Then read it column by column
   - We get the encoded text
   - So to decode: read the encoded text as if it were column-major order

5. **Final algorithm:**
   - Calculate `cols = ceil(len(encodedText) / rows)`
   - For each position (r, c) in the original matrix (going row by row)
   - Find its position in encoded text: `c * rows + r`
   - Append that character to result
   - Skip spaces (they represent empty cells)

---

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n = len(encodedText)
# Space: O(n) for the result string
def decodeCiphertext(encodedText: str, rows: int) -> str:
    # If encoded text is empty or rows is 1, return as is
    if not encodedText or rows == 1:
        return encodedText

    # Calculate number of columns in the virtual matrix
    # We use integer division with ceiling: (len + rows - 1) // rows
    cols = (len(encodedText) + rows - 1) // rows

    result = []

    # We'll traverse the virtual matrix column by column
    # For each column, we read down the diagonal
    for start_col in range(cols):
        # For each row in the current diagonal
        for row in range(rows):
            # Calculate the column for this position in the diagonal
            col = start_col + row

            # If column is out of bounds, skip
            if col >= cols:
                continue

            # Calculate index in encodedText
            # This is the key formula: position in encoded text for cell (row, col)
            # The encoded text was created by reading column by column
            idx = col * rows + row

            # If index is within bounds, add character to result
            if idx < len(encodedText):
                result.append(encodedText[idx])

    # Remove trailing spaces (from empty cells at the end)
    # We use rstrip() to remove only trailing spaces, not all spaces
    return ''.join(result).rstrip()
```

```javascript
// Time: O(n) where n = encodedText.length
// Space: O(n) for the result string
function decodeCiphertext(encodedText, rows) {
  // If encoded text is empty or rows is 1, return as is
  if (!encodedText || rows === 1) {
    return encodedText;
  }

  // Calculate number of columns in the virtual matrix
  // Ceiling division: Math.ceil(encodedText.length / rows)
  const cols = Math.ceil(encodedText.length / rows);

  const result = [];

  // Traverse the virtual matrix column by column
  // For each starting column, read down the diagonal
  for (let startCol = 0; startCol < cols; startCol++) {
    for (let row = 0; row < rows; row++) {
      // Calculate the column for this position in the diagonal
      const col = startCol + row;

      // If column is out of bounds, skip
      if (col >= cols) {
        continue;
      }

      // Calculate index in encodedText
      // Key formula: position in encoded text for cell (row, col)
      // Encoded text was created by reading column by column
      const idx = col * rows + row;

      // If index is within bounds, add character to result
      if (idx < encodedText.length) {
        result.push(encodedText[idx]);
      }
    }
  }

  // Remove trailing spaces (from empty cells at the end)
  // We only strip trailing spaces, not all spaces
  let resultStr = result.join("");
  let end = resultStr.length - 1;
  while (end >= 0 && resultStr[end] === " ") {
    end--;
  }
  return resultStr.substring(0, end + 1);
}
```

```java
// Time: O(n) where n = encodedText.length()
// Space: O(n) for the result string
class Solution {
    public String decodeCiphertext(String encodedText, int rows) {
        // If encoded text is empty or rows is 1, return as is
        if (encodedText.isEmpty() || rows == 1) {
            return encodedText;
        }

        // Calculate number of columns in the virtual matrix
        // Ceiling division: (len + rows - 1) / rows
        int cols = (encodedText.length() + rows - 1) / rows;

        StringBuilder result = new StringBuilder();

        // Traverse the virtual matrix column by column
        // For each starting column, read down the diagonal
        for (int startCol = 0; startCol < cols; startCol++) {
            for (int row = 0; row < rows; row++) {
                // Calculate the column for this position in the diagonal
                int col = startCol + row;

                // If column is out of bounds, skip
                if (col >= cols) {
                    continue;
                }

                // Calculate index in encodedText
                // Key formula: position in encoded text for cell (row, col)
                // Encoded text was created by reading column by column
                int idx = col * rows + row;

                // If index is within bounds, add character to result
                if (idx < encodedText.length()) {
                    result.append(encodedText.charAt(idx));
                }
            }
        }

        // Remove trailing spaces (from empty cells at the end)
        // We only strip trailing spaces, not all spaces
        String resultStr = result.toString();
        int end = resultStr.length() - 1;
        while (end >= 0 && resultStr.charAt(end) == ' ') {
            end--;
        }
        return resultStr.substring(0, end + 1);
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of `encodedText`

- We iterate through each cell in the virtual matrix once
- The nested loops visit O(rows × cols) cells, but rows × cols ≈ n
- Each cell operation is O(1)

**Space Complexity:** O(n) for the output string

- We build a result string of length up to n
- We don't store the full matrix, just the result
- The algorithm uses O(1) extra space besides the output

---

## Common Mistakes

1. **Forgetting to handle trailing spaces correctly:**
   - The problem specifies that trailing spaces should be removed
   - But NOT all spaces — only trailing ones
   - Using `.strip()` instead of `.rstrip()` would remove leading spaces too, which is wrong

2. **Incorrect column calculation:**
   - Using `len(encodedText) // rows` instead of ceiling division
   - This would give wrong column count when the matrix isn't perfectly filled
   - Correct formula: `(len + rows - 1) // rows` or `Math.ceil(len / rows)`

3. **Out-of-bounds access in the encoded text:**
   - Not checking `idx < len(encodedText)` before accessing
   - The last row of the matrix might not be completely filled
   - This would cause index out of range errors

4. **Misunderstanding the encoding pattern:**
   - Thinking it's row-major or simple column-major
   - It's actually diagonal traversal starting from each column in the first row
   - The key is recognizing it's equivalent to column-major reading

---

## When You'll See This Pattern

This problem uses **matrix traversal patterns** and **index mapping** techniques that appear in several other problems:

1. **Diagonal Traverse (LeetCode 498):**
   - Similar diagonal traversal pattern
   - Instead of decoding, you're traversing a matrix diagonally
   - Uses the same "row + col = constant" diagonal property

2. **Spiral Matrix (LeetCode 54):**
   - Another matrix traversal pattern problem
   - Requires careful index manipulation and boundary checking
   - Similar mental model of moving through a matrix in a non-standard order

3. **Rotate Image (LeetCode 48):**
   - Involves mapping positions in a matrix
   - Uses mathematical formulas to relate positions before and after transformation
   - Similar to our index mapping: `encodedIndex = col * rows + row`

These problems all require thinking about 2D coordinates and finding mathematical relationships between positions.

---

## Key Takeaways

1. **Matrix problems often have direct mathematical mappings:**
   - Instead of building the actual matrix, look for formulas that relate positions
   - This saves both time and space complexity

2. **Understand the pattern before coding:**
   - Draw small examples to visualize the traversal pattern
   - The "slanted" reading is just diagonal traversal starting from each column

3. **Edge cases matter:**
   - Empty strings
   - Single row (degenerate case)
   - Trailing spaces from unfilled matrix cells
   - Always test with the minimum and maximum possible inputs

---

Related problems: [Diagonal Traverse](/problem/diagonal-traverse)
