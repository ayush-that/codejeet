---
title: "How to Solve Pascal's Triangle — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Pascal's Triangle. Easy difficulty, 78.7% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-04-18"
category: "dsa-patterns"
tags: ["pascals-triangle", "array", "dynamic-programming", "easy"]
---

# How to Solve Pascal's Triangle

Pascal's Triangle is a classic mathematical pattern where each number is the sum of the two numbers directly above it. Given an integer `numRows`, we need to generate the first `numRows` of this triangle. While the concept is straightforward, implementing it efficiently requires understanding how to build each row based on the previous one—a perfect introduction to dynamic programming thinking.

## Visual Walkthrough

Let's trace through generating the first 5 rows of Pascal's Triangle:

**Row 1:** Always starts with `[1]`

**Row 2:** Each row starts and ends with 1. The middle elements come from summing pairs above:

- `[1, 1]` (only start and end elements since row has only 2 elements)

**Row 3:** Build from row 2:

- Start with `1`
- Middle element: `row2[0] + row2[1] = 1 + 1 = 2`
- End with `1`
- Result: `[1, 2, 1]`

**Row 4:** Build from row 3:

- Start: `1`
- Element 2: `row3[0] + row3[1] = 1 + 2 = 3`
- Element 3: `row3[1] + row3[2] = 2 + 1 = 3`
- End: `1`
- Result: `[1, 3, 3, 1]`

**Row 5:** Build from row 4:

- Start: `1`
- Element 2: `row4[0] + row4[1] = 1 + 3 = 4`
- Element 3: `row4[1] + row4[2] = 3 + 3 = 6`
- Element 4: `row4[2] + row4[3] = 3 + 1 = 4`
- End: `1`
- Result: `[1, 4, 6, 4, 1]`

The pattern is clear: each row `i` has `i` elements, always starts and ends with 1, and the middle elements are sums of adjacent elements from the previous row.

## Brute Force Approach

There isn't really a "brute force" approach for Pascal's Triangle since the mathematical definition gives us a direct way to compute it. However, a naive approach might try to compute each element independently using the binomial coefficient formula:

Each element at position `(row, col)` can be calculated as `C(row, col) = row! / (col! * (row-col)!)`.

While mathematically correct, this approach is inefficient because:

1. We're recomputing factorials repeatedly
2. Factorials grow extremely fast and can cause integer overflow
3. Time complexity would be O(numRows³) if we compute factorials naively

The better approach recognizes that we can build each row from the previous one, which is essentially a dynamic programming solution.

## Optimal Solution

The optimal solution uses dynamic programming: we build each row based on the previous row. Each row `i` has `i+1` elements (since we use 0-based indexing for rows). The first and last elements are always 1, and the middle elements are sums of adjacent elements from the previous row.

<div class="code-group">

```python
# Time: O(numRows^2) | Space: O(numRows^2) for the output
def generate(numRows):
    """
    Generate Pascal's Triangle with the given number of rows.

    Args:
        numRows: Integer representing the number of rows to generate

    Returns:
        List of lists representing Pascal's Triangle
    """
    # Handle edge case: if numRows is 0, return empty list
    if numRows == 0:
        return []

    # Initialize triangle with the first row
    triangle = [[1]]

    # Generate remaining rows
    for i in range(1, numRows):
        # Get the previous row to build current row
        prev_row = triangle[i-1]

        # Current row always starts with 1
        current_row = [1]

        # Generate middle elements by summing adjacent elements from previous row
        # For row i, we need i-1 middle elements (since row has i+1 total elements)
        for j in range(1, i):
            # Each element is sum of two elements above it
            current_row.append(prev_row[j-1] + prev_row[j])

        # Current row always ends with 1
        current_row.append(1)

        # Add completed row to triangle
        triangle.append(current_row)

    return triangle
```

```javascript
// Time: O(numRows^2) | Space: O(numRows^2) for the output
function generate(numRows) {
  /**
   * Generate Pascal's Triangle with the given number of rows.
   *
   * @param {number} numRows - Number of rows to generate
   * @return {number[][]} Pascal's Triangle
   */

  // Handle edge case: if numRows is 0, return empty array
  if (numRows === 0) {
    return [];
  }

  // Initialize triangle with the first row
  const triangle = [[1]];

  // Generate remaining rows
  for (let i = 1; i < numRows; i++) {
    // Get the previous row to build current row
    const prevRow = triangle[i - 1];

    // Current row always starts with 1
    const currentRow = [1];

    // Generate middle elements by summing adjacent elements from previous row
    // For row i, we need i-1 middle elements (since row has i+1 total elements)
    for (let j = 1; j < i; j++) {
      // Each element is sum of two elements above it
      currentRow.push(prevRow[j - 1] + prevRow[j]);
    }

    // Current row always ends with 1
    currentRow.push(1);

    // Add completed row to triangle
    triangle.push(currentRow);
  }

  return triangle;
}
```

```java
// Time: O(numRows^2) | Space: O(numRows^2) for the output
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<List<Integer>> generate(int numRows) {
        /**
         * Generate Pascal's Triangle with the given number of rows.
         *
         * @param numRows Number of rows to generate
         * @return Pascal's Triangle as a list of lists
         */

        // Initialize result list
        List<List<Integer>> triangle = new ArrayList<>();

        // Handle edge case: if numRows is 0, return empty list
        if (numRows == 0) {
            return triangle;
        }

        // Add first row
        List<Integer> firstRow = new ArrayList<>();
        firstRow.add(1);
        triangle.add(firstRow);

        // Generate remaining rows
        for (int i = 1; i < numRows; i++) {
            // Get the previous row to build current row
            List<Integer> prevRow = triangle.get(i - 1);

            // Current row always starts with 1
            List<Integer> currentRow = new ArrayList<>();
            currentRow.add(1);

            // Generate middle elements by summing adjacent elements from previous row
            // For row i, we need i-1 middle elements (since row has i+1 total elements)
            for (int j = 1; j < i; j++) {
                // Each element is sum of two elements above it
                currentRow.add(prevRow.get(j - 1) + prevRow.get(j));
            }

            // Current row always ends with 1
            currentRow.add(1);

            // Add completed row to triangle
            triangle.add(currentRow);
        }

        return triangle;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(numRows²)

- We generate `numRows` rows
- Row `i` has `i+1` elements, so total elements = 1 + 2 + 3 + ... + numRows = numRows(numRows+1)/2
- This simplifies to O(numRows²)

**Space Complexity:** O(numRows²) for the output

- We store all elements of the triangle
- The triangle itself takes numRows(numRows+1)/2 elements
- If we only consider auxiliary space (excluding output), it's O(1) since we only use a few variables

## Common Mistakes

1. **Off-by-one errors with row indices:** The most common mistake is confusing 0-based vs 1-based indexing. Remember that row `i` (0-indexed) has `i+1` elements. When accessing `prev_row[j-1] + prev_row[j]`, ensure `j` ranges from 1 to `i-1` (exclusive).

2. **Forgetting to handle edge cases:** Always check for `numRows = 0` (should return empty list) and `numRows = 1` (should return `[[1]]`). Some implementations fail on these simple cases.

3. **Incorrect loop boundaries:** When generating middle elements, the loop should run from `j = 1` to `j < i` (not `j <= i`). This ensures we only generate middle elements, not the first and last which are always 1.

4. **Modifying the previous row accidentally:** Be careful not to modify the previous row when building the current row. In some languages, if you use reference assignment incorrectly, you might accidentally change previous rows.

## When You'll See This Pattern

The "build current from previous" pattern appears in many dynamic programming problems:

1. **Pascal's Triangle II (LeetCode 119):** A direct follow-up where you only need to return the nth row instead of the entire triangle. The same row-building logic applies, but you can optimize space to O(n) instead of O(n²).

2. **Unique Paths (LeetCode 62):** The number of unique paths to reach bottom-right from top-left in a grid follows a similar pattern to Pascal's Triangle. The solution uses dynamic programming where each cell's value depends on the cell above and to the left.

3. **Climbing Stairs (LeetCode 70):** While simpler, it uses the same Fibonacci-like recurrence relation where the current state depends on previous states.

4. **Triangle (LeetCode 120):** Given a triangle array, find the minimum path sum from top to bottom. The solution builds up minimum sums from bottom to top, similar to how we build Pascal's Triangle.

## Key Takeaways

1. **Dynamic Programming Recognition:** Pascal's Triangle is a perfect example of a problem where the solution to the current subproblem (a row) depends entirely on the solution to previous subproblems (previous rows). This is the hallmark of dynamic programming.

2. **Pattern Identification:** The "each element is the sum of two elements above it" pattern appears in many combinatorial problems. Recognizing this can help you solve related problems faster.

3. **Edge Case Management:** Always test with small inputs (0, 1, 2 rows) to catch off-by-one errors early. These simple tests often reveal implementation flaws.

Related problems: [Pascal's Triangle II](/problem/pascals-triangle-ii), [Check If Digits Are Equal in String After Operations II](/problem/check-if-digits-are-equal-in-string-after-operations-ii)
