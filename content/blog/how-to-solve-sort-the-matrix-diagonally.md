---
title: "How to Solve Sort the Matrix Diagonally — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sort the Matrix Diagonally. Medium difficulty, 83.2% acceptance rate. Topics: Array, Sorting, Matrix."
date: "2026-02-08"
category: "dsa-patterns"
tags: ["sort-the-matrix-diagonally", "array", "sorting", "matrix", "medium"]
---

# How to Solve Sort the Matrix Diagonally

This problem asks us to sort each diagonal of a matrix independently in ascending order. A diagonal is defined as all cells where the difference between row and column indices is constant. The challenge lies in efficiently collecting and sorting elements along each diagonal without mixing them up, then placing them back in sorted order while maintaining the original matrix structure.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this 3×4 matrix:

```
Input:
[ [3, 3, 1, 1],
  [2, 2, 1, 2],
  [1, 1, 1, 2] ]
```

We need to identify all diagonals. Diagonals are defined by cells where `row - col` is constant. Let's find all unique diagonal identifiers:

- Top-left to bottom-right diagonals have constant `row - col`
- For a 3×4 matrix, `row - col` ranges from `-(cols-1)` to `(rows-1)`, or `-3` to `2`

Let's manually sort one diagonal to see the process. Take the diagonal starting at `mat[0][0]` (value 3). This diagonal has `row - col = 0`. It includes:

- `mat[0][0]` = 3
- `mat[1][1]` = 2
- `mat[2][2]` = 1

After sorting: [1, 2, 3]. We place them back:

- `mat[0][0]` ← 1
- `mat[1][1]` ← 2
- `mat[2][2]` ← 3

Another example: diagonal starting at `mat[0][1]` (value 3). `row - col = -1`. Includes:

- `mat[0][1]` = 3
- `mat[1][2]` = 1
- `mat[2][3]` = 2

After sorting: [1, 2, 3]. Place back:

- `mat[0][1]` ← 1
- `mat[1][2]` ← 2
- `mat[2][3]` ← 3

The final sorted matrix should be:

```
[ [1, 1, 1, 1],
  [1, 2, 2, 2],
  [1, 2, 3, 2] ]
```

## Brute Force Approach

A naive approach would be to extract each diagonal individually, sort it, then put it back. For an `m × n` matrix:

1. For each starting cell in the first row and first column
2. Extract all elements along that diagonal
3. Sort the extracted elements
4. Place them back along the same diagonal

The problem with this approach is efficiency. We'd need to:

- Iterate through `m + n - 1` diagonals
- For each diagonal, collect up to `min(m, n)` elements
- Sort each diagonal separately: `O(k log k)` where `k` is diagonal length
- Overall complexity: `O((m+n) × min(m,n) log(min(m,n)))`

While this might work for small matrices, it's inefficient because we're repeatedly traversing the matrix and creating many small sorting operations. More importantly, this approach doesn't leverage the key insight that all elements with the same `row - col` difference belong to the same diagonal.

## Optimized Approach

The key insight is that **all cells on the same diagonal share the same `row - col` value**. This gives us a natural way to group diagonal elements:

1. Use a dictionary/hash map where keys are `row - col` differences
2. Values are lists containing all elements from that diagonal
3. Traverse the entire matrix once, adding each element to its corresponding diagonal list
4. Sort each list in ascending order
5. Traverse the matrix again, popping elements from the sorted lists back into the matrix

Why this works efficiently:

- Single pass to collect all elements: `O(m × n)`
- Sorting: We sort `m + n - 1` lists, with total elements `m × n`
- Total sorting cost: `O(m × n log(min(m,n)))` in worst case
- Second pass to reconstruct: `O(m × n)`

The critical realization is that `row - col` uniquely identifies diagonals. Positive differences correspond to diagonals starting in the first column, negative differences to diagonals starting in the first row, and zero is the main diagonal.

## Optimal Solution

Here's the complete implementation using the diagonal grouping approach:

<div class="code-group">

```python
# Time: O(m × n log(min(m,n))) | Space: O(m × n)
def diagonalSort(mat):
    """
    Sort each diagonal of the matrix independently in ascending order.

    Approach:
    1. Group elements by their diagonal identifier (row - col)
    2. Sort each group
    3. Place sorted elements back into the matrix
    """
    m, n = len(mat), len(mat[0])

    # Dictionary to store elements of each diagonal
    # Key: diagonal identifier (row - col)
    # Value: list of elements on that diagonal
    diagonals = {}

    # Step 1: Collect all elements by their diagonal
    for i in range(m):
        for j in range(n):
            # Calculate diagonal identifier
            diag_id = i - j

            # Initialize list for this diagonal if not exists
            if diag_id not in diagonals:
                diagonals[diag_id] = []

            # Add current element to its diagonal group
            diagonals[diag_id].append(mat[i][j])

    # Step 2: Sort each diagonal's elements in descending order
    # We sort in descending order because we'll use pop() to get elements
    # This ensures we get the smallest element first when popping from the end
    for diag_id in diagonals:
        diagonals[diag_id].sort(reverse=True)

    # Step 3: Place sorted elements back into the matrix
    for i in range(m):
        for j in range(n):
            diag_id = i - j

            # Pop the smallest remaining element from this diagonal's list
            # Since we sorted in descending order, pop() gives us smallest to largest
            mat[i][j] = diagonals[diag_id].pop()

    return mat
```

```javascript
// Time: O(m × n log(min(m,n))) | Space: O(m × n)
function diagonalSort(mat) {
  /**
   * Sort each diagonal of the matrix independently in ascending order.
   *
   * Approach:
   * 1. Group elements by their diagonal identifier (row - col)
   * 2. Sort each group
   * 3. Place sorted elements back into the matrix
   */
  const m = mat.length;
  const n = mat[0].length;

  // Map to store elements of each diagonal
  // Key: diagonal identifier (row - col)
  // Value: array of elements on that diagonal
  const diagonals = new Map();

  // Step 1: Collect all elements by their diagonal
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Calculate diagonal identifier
      const diagId = i - j;

      // Initialize array for this diagonal if not exists
      if (!diagonals.has(diagId)) {
        diagonals.set(diagId, []);
      }

      // Add current element to its diagonal group
      diagonals.get(diagId).push(mat[i][j]);
    }
  }

  // Step 2: Sort each diagonal's elements in descending order
  // We sort in descending order because we'll use pop() to get elements
  // This ensures we get the smallest element first when popping from the end
  for (const [diagId, elements] of diagonals) {
    elements.sort((a, b) => b - a); // Sort in descending order
  }

  // Step 3: Place sorted elements back into the matrix
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const diagId = i - j;

      // Pop the smallest remaining element from this diagonal's array
      // Since we sorted in descending order, pop() gives us smallest to largest
      mat[i][j] = diagonals.get(diagId).pop();
    }
  }

  return mat;
}
```

```java
// Time: O(m × n log(min(m,n))) | Space: O(m × n)
class Solution {
    public int[][] diagonalSort(int[][] mat) {
        /**
         * Sort each diagonal of the matrix independently in ascending order.
         *
         * Approach:
         * 1. Group elements by their diagonal identifier (row - col)
         * 2. Sort each group
         * 3. Place sorted elements back into the matrix
         */
        int m = mat.length;
        int n = mat[0].length;

        // Map to store elements of each diagonal
        // Key: diagonal identifier (row - col)
        // Value: list of elements on that diagonal
        Map<Integer, List<Integer>> diagonals = new HashMap<>();

        // Step 1: Collect all elements by their diagonal
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                // Calculate diagonal identifier
                int diagId = i - j;

                // Initialize list for this diagonal if not exists
                diagonals.putIfAbsent(diagId, new ArrayList<>());

                // Add current element to its diagonal group
                diagonals.get(diagId).add(mat[i][j]);
            }
        }

        // Step 2: Sort each diagonal's elements in descending order
        // We sort in descending order because we'll remove from the end
        // This ensures we get the smallest element first
        for (int diagId : diagonals.keySet()) {
            List<Integer> diagList = diagonals.get(diagId);
            Collections.sort(diagList, Collections.reverseOrder());
        }

        // Step 3: Place sorted elements back into the matrix
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int diagId = i - j;
                List<Integer> diagList = diagonals.get(diagId);

                // Remove the smallest remaining element from this diagonal's list
                // Since we sorted in descending order, removing from the end gives smallest first
                mat[i][j] = diagList.remove(diagList.size() - 1);
            }
        }

        return mat;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m × n log(min(m,n)))`

- We traverse the entire matrix twice: `O(2 × m × n)` = `O(m × n)`
- We sort `m + n - 1` diagonal lists
- The total number of elements across all diagonals is `m × n`
- In the worst case, all elements could be in one diagonal (when `m = 1` or `n = 1`), giving `O(m × n log(m × n))`
- More typically, the largest diagonal has `min(m, n)` elements, so sorting it costs `O(min(m,n) log(min(m,n)))`
- Since we have `m + n - 1` diagonals, total sorting is `O((m+n) × min(m,n) log(min(m,n)))` which simplifies to `O(m × n log(min(m,n)))`

**Space Complexity:** `O(m × n)`

- We store all matrix elements in the dictionary: `O(m × n)`
- The output matrix is usually not counted toward space complexity as it's the required output
- Additional space for sorting (in-place sort uses `O(log k)` for lists of length `k`)

## Common Mistakes

1. **Incorrect diagonal identification**: Using `row + col` instead of `row - col`. Remember: diagonals going bottom-right have constant `row - col`, while diagonals going bottom-left have constant `row + col`.

2. **Forgetting to sort in correct order before popping**: If you sort in ascending order and use `pop()`, you'll get the largest element first instead of the smallest. Either sort ascending and use `pop(0)` (which is O(n) in Python) or sort descending and use `pop()` (O(1)).

3. **Not handling empty or single-row/column matrices**: Always check edge cases. The solution works for all cases, but candidates sometimes overcomplicate by special-casing 1×1 or 1×n matrices.

4. **Modifying the matrix while iterating**: If you try to sort and place in one pass, you might overwrite values needed later. Always use two passes: one to collect, one to place back.

## When You'll See This Pattern

This diagonal grouping pattern appears in several matrix problems:

1. **Diagonal Traverse (LeetCode 498)**: Similar concept of grouping by `row + col` (for opposite diagonals) or `row - col`.

2. **Toeplitz Matrix (LeetCode 766)**: Checks if all diagonals have constant values, using the same `mat[i][j] == mat[i-1][j-1]` property.

3. **Matrix Diagonal Sum (LeetCode 1572)**: Sums elements on primary and secondary diagonals, which are special cases of diagonal traversal.

The core pattern is recognizing that certain matrix properties are preserved along diagonals, and using `row ± col` as a key to group related elements.

## Key Takeaways

1. **Diagonal identification**: In a matrix, cells on the same bottom-right diagonal have constant `row - col`. This is the key to grouping diagonal elements efficiently.

2. **Two-pass approach**: When you need to rearrange elements based on some grouping, it's often cleaner to collect all elements first (pass 1), process them, then place them back (pass 2) rather than trying to do everything in-place in one pass.

3. **Trade-offs in data structures**: Using a dictionary with diagonal IDs as keys gives us O(1) access to each diagonal's elements. Sorting each diagonal list separately is more efficient than trying to sort the entire matrix with diagonal constraints.

Related problems: [Sort Matrix by Diagonals](/problem/sort-matrix-by-diagonals)
