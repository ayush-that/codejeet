---
title: "How to Solve Delete Columns to Make Sorted — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Delete Columns to Make Sorted. Easy difficulty, 78.1% acceptance rate. Topics: Array, String."
date: "2027-12-04"
category: "dsa-patterns"
tags: ["delete-columns-to-make-sorted", "array", "string", "easy"]
---

# How to Solve Delete Columns to Make Sorted

This problem asks us to count how many columns in a grid of equal-length strings are not sorted lexicographically. While the problem statement is straightforward, what makes it interesting is recognizing that we're essentially working with columns of characters rather than rows, and we need to compare characters vertically across strings. The core challenge is efficiently checking if each column is sorted in non-decreasing order.

## Visual Walkthrough

Let's trace through the example `strs = ["abc", "bce", "cae"]`:

We can visualize the grid as:

```
Column 0: a, b, c
Column 1: b, c, a
Column 2: c, e, e
```

Now let's check each column:

- **Column 0**: Characters are 'a', 'b', 'c'. This is sorted in ascending order ('a' ≤ 'b' ≤ 'c'), so we don't need to delete it.
- **Column 1**: Characters are 'b', 'c', 'a'. This is NOT sorted because 'c' > 'a' (going from row 1 to row 2). We need to delete this column.
- **Column 2**: Characters are 'c', 'e', 'e'. This is sorted ('c' ≤ 'e' ≤ 'e'), so we keep it.

We need to delete 1 column (column 1). The answer is 1.

Another example: `strs = ["cba", "daf", "ghi"]`

```
Column 0: c, d, g  → sorted (c ≤ d ≤ g) ✓
Column 1: b, a, h  → NOT sorted (b > a) ✗
Column 2: a, f, i  → sorted (a ≤ f ≤ i) ✓
```

We need to delete 1 column (column 1).

## Brute Force Approach

A naive approach would be to:

1. Transpose the grid (convert rows to columns)
2. For each column, check if it's sorted
3. Count the unsorted columns

While this approach is conceptually simple, it requires creating a new data structure (the transposed grid), which uses extra memory. The time complexity would be O(m × n) where m is the number of strings and n is their length, which is actually the same as the optimal solution, but the space complexity would be O(m × n) instead of O(1).

However, there's an even more naive approach some candidates might try: converting each column to a string and checking if the string equals its sorted version. This would be O(m × n log m) time due to sorting each column, which is less efficient than the optimal O(m × n) solution.

## Optimal Solution

The optimal approach checks each column directly without transposing the entire grid. We iterate through each column index, and for each column, we check if all characters in that column are in non-decreasing order from top to bottom.

<div class="code-group">

```python
# Time: O(m × n) where m = len(strs), n = len(strs[0])
# Space: O(1) - we only use a counter and loop variables
def minDeletionSize(strs):
    """
    Counts columns that are not sorted in non-decreasing order.

    Args:
        strs: List of strings, all of the same length

    Returns:
        Number of columns to delete
    """
    # If there are no strings or empty strings, no columns to delete
    if not strs or len(strs[0]) == 0:
        return 0

    # Get dimensions: m rows, n columns
    m = len(strs)      # number of strings (rows)
    n = len(strs[0])   # length of each string (columns)

    # Counter for unsorted columns
    delete_count = 0

    # Check each column
    for col in range(n):
        # Check if this column is sorted
        # Compare each character with the one below it
        for row in range(1, m):
            # If current character > next character in same column
            if strs[row][col] < strs[row - 1][col]:
                # Column is not sorted, increment counter
                delete_count += 1
                # No need to check rest of this column
                break

    return delete_count
```

```javascript
// Time: O(m × n) where m = strs.length, n = strs[0].length
// Space: O(1) - only using a counter and loop variables
function minDeletionSize(strs) {
  /**
   * Counts columns that are not sorted in non-decreasing order.
   *
   * @param {string[]} strs - Array of strings, all of the same length
   * @return {number} Number of columns to delete
   */
  // If there are no strings or empty strings, no columns to delete
  if (!strs || strs.length === 0 || strs[0].length === 0) {
    return 0;
  }

  // Get dimensions: m rows, n columns
  const m = strs.length; // number of strings (rows)
  const n = strs[0].length; // length of each string (columns)

  // Counter for unsorted columns
  let deleteCount = 0;

  // Check each column
  for (let col = 0; col < n; col++) {
    // Check if this column is sorted
    // Compare each character with the one below it
    for (let row = 1; row < m; row++) {
      // If current character < previous character in same column
      if (strs[row][col] < strs[row - 1][col]) {
        // Column is not sorted, increment counter
        deleteCount++;
        // No need to check rest of this column
        break;
      }
    }
  }

  return deleteCount;
}
```

```java
// Time: O(m × n) where m = strs.length, n = strs[0].length()
// Space: O(1) - only using a counter and loop variables
class Solution {
    public int minDeletionSize(String[] strs) {
        /**
         * Counts columns that are not sorted in non-decreasing order.
         *
         * @param strs Array of strings, all of the same length
         * @return Number of columns to delete
         */
        // If there are no strings or empty strings, no columns to delete
        if (strs == null || strs.length == 0 || strs[0].length() == 0) {
            return 0;
        }

        // Get dimensions: m rows, n columns
        int m = strs.length;      // number of strings (rows)
        int n = strs[0].length(); // length of each string (columns)

        // Counter for unsorted columns
        int deleteCount = 0;

        // Check each column
        for (int col = 0; col < n; col++) {
            // Check if this column is sorted
            // Compare each character with the one below it
            for (int row = 1; row < m; row++) {
                // If current character < previous character in same column
                if (strs[row].charAt(col) < strs[row - 1].charAt(col)) {
                    // Column is not sorted, increment counter
                    deleteCount++;
                    // No need to check rest of this column
                    break;
                }
            }
        }

        return deleteCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We iterate through each column (n iterations)
- For each column, in the worst case we check all rows (m iterations)
- This gives us O(m × n) total operations
- The `break` statement helps in practice but doesn't change worst-case complexity

**Space Complexity: O(1)**

- We only use a few integer variables (m, n, delete_count, and loop counters)
- No additional data structures are created
- The input is not modified

## Common Mistakes

1. **Incorrect comparison direction**: Some candidates compare `strs[row][col] > strs[row+1][col]` instead of `strs[row][col] < strs[row-1][col]`. Remember we want non-decreasing order, so we check if any character is smaller than the one above it.

2. **Forgetting to break after finding an unsorted column**: Once we find that a column is unsorted, we should immediately break out of the inner loop to avoid counting it multiple times or wasting time checking the rest of the column.

3. **Not handling edge cases**:
   - Empty input array (`[]`)
   - Array with empty strings (`[""]`)
   - Single string array (`["abc"]`) - all columns are trivially sorted
     Always check for these at the beginning of your solution.

4. **Confusing rows and columns**: Remember that we're checking columns (vertical), not rows (horizontal). The outer loop should iterate over column indices, not row indices.

## When You'll See This Pattern

This problem uses a **grid traversal pattern** where we need to access elements in a different orientation than they're stored. Similar patterns appear in:

1. **Rotate Image (LeetCode 48)** - Requires thinking about matrix indices in rotated positions
2. **Valid Sudoku (LeetCode 36)** - Involves checking rows, columns, and subgrids of a 9×9 board
3. **Transpose Matrix (LeetCode 867)** - Directly asks to convert rows to columns
4. **Set Matrix Zeroes (LeetCode 73)** - Requires tracking which rows and columns need to be zeroed

The key insight in all these problems is recognizing when you need to access data "against the grain" of how it's stored, and developing efficient ways to do so without unnecessary memory usage.

## Key Takeaways

1. **Think in terms of access patterns**: When working with 2D data, consider whether you need row-major or column-major access. This problem requires column-major access on row-major stored data.

2. **Early termination is your friend**: The `break` statement when we find an unsorted column optimizes the average case without complicating the code.

3. **Edge cases matter**: Always consider empty inputs, single element cases, and boundary conditions. These often reveal bugs in your logic.

4. **Space optimization**: We solved this in O(1) extra space by accessing columns directly instead of transposing the entire grid. This is often preferred in interview settings.

[Practice this problem on CodeJeet](/problem/delete-columns-to-make-sorted)
