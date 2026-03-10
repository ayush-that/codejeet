---
title: "How to Solve Sort Matrix by Diagonals — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sort Matrix by Diagonals. Medium difficulty, 84.7% acceptance rate. Topics: Array, Sorting, Matrix."
date: "2026-12-02"
category: "dsa-patterns"
tags: ["sort-matrix-by-diagonals", "array", "sorting", "matrix", "medium"]
---

# How to Solve Sort Matrix by Diagonals

You're given an n×n matrix and need to sort each diagonal differently: diagonals in the bottom-left triangle (including the main diagonal) in non-increasing order, and diagonals in the top-right triangle in non-decreasing order. What makes this problem interesting is that you need to handle two different sorting directions based on which "triangle" the diagonal belongs to, and you must extract and sort elements along each diagonal without mixing them up.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this 4×4 matrix:

```
Input:
[3, 1, 4, 1]
[5, 9, 2, 6]
[5, 3, 5, 8]
[9, 7, 9, 3]
```

We need to identify all diagonals. In an n×n matrix, there are (2n-1) diagonals. For our 4×4 matrix, that's 7 diagonals.

**Key insight**: Diagonals can be identified by the difference (col - row) for top-right diagonals or (row - col) for bottom-left diagonals, but here we need to think differently. Actually, all diagonals that go from top-left to bottom-right have the property that (row - col) is constant for each diagonal.

Let's label each diagonal by its (row - col) value:

```
Diagonal indices (row - col):
[-3] [ 1, 4, 1]  # Top-right triangle (non-decreasing sort)
[-2] [ 3, 2, 6]  # Top-right triangle
[-1] [ 5, 5, 8]  # Top-right triangle
[ 0] [ 3, 9, 5, 3]  # Main diagonal (bottom-left triangle, non-increasing)
[ 1] [ 5, 3, 9]  # Bottom-left triangle
[ 2] [ 9, 7]     # Bottom-left triangle
[ 3] [ 9]        # Bottom-left triangle
```

Wait, that's not quite right. Let me show the actual diagonals:

1. Diagonal with (row-col) = -3: Just the top-right corner [1]
2. Diagonal with (row-col) = -2: [4, 6]
3. Diagonal with (row-col) = -1: [1, 2, 8]
4. Diagonal with (row-col) = 0: [3, 9, 5, 3] (main diagonal)
5. Diagonal with (row-col) = 1: [5, 3, 9]
6. Diagonal with (row-col) = 2: [5, 7]
7. Diagonal with (row-col) = 3: [9]

Now, the rule is:

- If (row-col) ≥ 0: The diagonal is in the bottom-left triangle (including main diagonal). Sort in non-increasing order.
- If (row-col) < 0: The diagonal is in the top-right triangle. Sort in non-decreasing order.

After sorting:

- Diagonal -3 ([1]) → [1] (already sorted non-decreasing)
- Diagonal -2 ([4, 6]) → [4, 6] (already non-decreasing)
- Diagonal -1 ([1, 2, 8]) → [1, 2, 8] (already non-decreasing)
- Diagonal 0 ([3, 9, 5, 3]) → [9, 5, 3, 3] (sorted non-increasing)
- Diagonal 1 ([5, 3, 9]) → [9, 5, 3] (sorted non-increasing)
- Diagonal 2 ([5, 7]) → [7, 5] (sorted non-increasing)
- Diagonal 3 ([9]) → [9] (already non-increasing)

Putting them back:

```
Output:
[3, 1, 4, 1]  # Wait, we need to reconstruct...
```

Actually, let me show the final reconstructed matrix:

```
[9, 1, 4, 1]
[5, 5, 2, 6]
[5, 3, 3, 8]
[9, 7, 9, 3]
```

That's not right either. Let's think systematically: We need to extract each diagonal, sort it according to the rule, then put it back.

## Brute Force Approach

A naive approach would be:

1. For each diagonal (identified by starting position)
2. Extract all elements along that diagonal into a list
3. Sort the list based on which triangle it belongs to
4. Put the sorted elements back into the diagonal

The challenge is identifying all diagonals correctly. For an n×n matrix:

- There are n diagonals starting from the first column (row = 0 to n-1, col = 0)
- There are n-1 diagonals starting from the first row (row = 0, col = 1 to n-1)

But this gets messy with indexing. A cleaner brute force would be:

1. Create a dictionary mapping (row-col) to lists of values
2. For each cell (i, j), add grid[i][j] to the list for key (i-j)
3. Sort each list: non-increasing if (i-j) ≥ 0, non-decreasing otherwise
4. Put the sorted values back

This brute force is actually optimal in terms of time complexity! The "brute force" aspect here isn't about inefficiency but about not recognizing the pattern immediately. A truly naive approach might try to sort the entire matrix or handle each diagonal with nested loops in a confusing way.

## Optimized Approach

The key insight is that all cells on the same diagonal have the same (row - col) value. This gives us a straightforward way to group diagonal elements:

1. **Grouping**: Use a dictionary/hash map where keys are (row - col) differences. Each key maps to a list of values on that diagonal.
2. **Sorting Direction**: The sign of (row - col) tells us which triangle we're in:
   - If (row - col) ≥ 0: bottom-left triangle (including main diagonal) → sort in non-increasing order
   - If (row - col) < 0: top-right triangle → sort in non-decreasing order
3. **Reconstruction**: After sorting, we need to put elements back. Since we collected elements in the order we traversed the matrix, and we'll traverse in the same order when putting them back, the sorted lists will align correctly.

The algorithm has these steps:

1. Create a dictionary to store lists of values for each diagonal (key = row - col)
2. Traverse the matrix row by row, adding each element to the appropriate diagonal list
3. Sort each diagonal list according to the rule based on its key
4. Traverse the matrix again, popping elements from the sorted lists back into the matrix

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n² log n) - We sort each diagonal, and in worst case main diagonal has n elements
# Space: O(n²) - We store all elements in the dictionary
def sortMatrix(grid):
    n = len(grid)
    diagonals = {}

    # Step 1: Group elements by their diagonal (row - col)
    for i in range(n):
        for j in range(n):
            key = i - j  # Unique identifier for each diagonal
            if key not in diagonals:
                diagonals[key] = []
            diagonals[key].append(grid[i][j])

    # Step 2: Sort each diagonal according to the rule
    for key in diagonals:
        if key >= 0:
            # Bottom-left triangle (including main diagonal): non-increasing
            diagonals[key].sort(reverse=True)
        else:
            # Top-right triangle: non-decreasing
            diagonals[key].sort()

    # Step 3: Put sorted elements back into the matrix
    # We traverse in the same order and pop from the sorted lists
    for i in range(n):
        for j in range(n):
            key = i - j
            # Pop from the front of the list (or we could use an index)
            grid[i][j] = diagonals[key].pop(0)

    return grid
```

```javascript
// Time: O(n² log n) - Sorting each diagonal
// Space: O(n²) - Storing all elements in the map
function sortMatrix(grid) {
  const n = grid.length;
  const diagonals = new Map();

  // Step 1: Group elements by their diagonal (row - col)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const key = i - j; // Unique identifier for each diagonal
      if (!diagonals.has(key)) {
        diagonals.set(key, []);
      }
      diagonals.get(key).push(grid[i][j]);
    }
  }

  // Step 2: Sort each diagonal according to the rule
  for (const [key, arr] of diagonals) {
    if (key >= 0) {
      // Bottom-left triangle (including main diagonal): non-increasing
      arr.sort((a, b) => b - a);
    } else {
      // Top-right triangle: non-decreasing
      arr.sort((a, b) => a - b);
    }
  }

  // Step 3: Put sorted elements back into the matrix
  // We need to track indices since we can't efficiently pop from front in JavaScript arrays
  const indices = new Map();
  for (const key of diagonals.keys()) {
    indices.set(key, 0);
  }

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const key = i - j;
      const arr = diagonals.get(key);
      const idx = indices.get(key);
      grid[i][j] = arr[idx];
      indices.set(key, idx + 1);
    }
  }

  return grid;
}
```

```java
// Time: O(n² log n) - Sorting each diagonal
// Space: O(n²) - Storing all elements in the map
import java.util.*;

public class Solution {
    public int[][] sortMatrix(int[][] grid) {
        int n = grid.length;
        Map<Integer, List<Integer>> diagonals = new HashMap<>();

        // Step 1: Group elements by their diagonal (row - col)
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int key = i - j;  // Unique identifier for each diagonal
                diagonals.putIfAbsent(key, new ArrayList<>());
                diagonals.get(key).add(grid[i][j]);
            }
        }

        // Step 2: Sort each diagonal according to the rule
        for (Map.Entry<Integer, List<Integer>> entry : diagonals.entrySet()) {
            int key = entry.getKey();
            List<Integer> list = entry.getValue();
            if (key >= 0) {
                // Bottom-left triangle (including main diagonal): non-increasing
                Collections.sort(list, Collections.reverseOrder());
            } else {
                // Top-right triangle: non-decreasing
                Collections.sort(list);
            }
        }

        // Step 3: Put sorted elements back into the matrix
        // We need to track indices since we modified the lists in place
        Map<Integer, Integer> indices = new HashMap<>();
        for (int key : diagonals.keySet()) {
            indices.put(key, 0);
        }

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int key = i - j;
                List<Integer> list = diagonals.get(key);
                int idx = indices.get(key);
                grid[i][j] = list.get(idx);
                indices.put(key, idx + 1);
            }
        }

        return grid;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n² log n)

- We traverse all n² elements to group them: O(n²)
- We sort each diagonal. In the worst case (main diagonal), we're sorting n elements, which takes O(n log n). Since there are (2n-1) diagonals, and sorting all of them would be O(n² log n) in total.
- We traverse again to reconstruct: O(n²)
- Dominated by O(n² log n)

**Space Complexity**: O(n²)

- We store all n² elements in the dictionary/lists
- The sorting itself may use additional O(n) space for the largest diagonal, but that's included in O(n²)

## Common Mistakes

1. **Wrong diagonal identification**: Using (row + col) instead of (row - col). The sum (row + col) identifies anti-diagonals (top-right to bottom-left), not the main diagonals (top-left to bottom-right) that we need here.

2. **Incorrect sorting direction**: Forgetting that the main diagonal (where row = col, so row-col = 0) belongs to the bottom-left triangle and should be sorted non-increasing. Some candidates might think it belongs to neither triangle or should be handled separately.

3. **Inefficient reconstruction**: Using `pop(0)` in Python (which is O(n) for lists) or similar inefficient operations. Better to track indices as shown in the JavaScript and Java solutions.

4. **Not handling empty or 1x1 matrices**: While the problem guarantees n×n with n ≥ 1, it's good practice to mention that 1x1 matrices are already sorted (a single element is both non-increasing and non-decreasing).

## When You'll See This Pattern

This problem uses the **"group by diagonal"** pattern, which appears in several matrix problems:

1. **Sort the Matrix Diagonally (LeetCode 1329)**: Very similar but sorts all diagonals in non-decreasing order. The grouping technique is identical.

2. **Diagonal Traverse (LeetCode 498)**: Requires traversing the matrix in diagonal order, which also uses the (row + col) or (row - col) property to identify diagonals.

3. **Toeplitz Matrix (LeetCode 766)**: Checks if every diagonal from top-left to bottom-right has the same elements, which also relies on the (row - col) property.

The core insight is that cells on the same diagonal have a constant difference (or sum) between their row and column indices. Once you recognize this, you can group, process, and reconstruct efficiently.

## Key Takeaways

1. **Diagonal identification**: In a matrix, cells on the same top-left to bottom-right diagonal have constant (row - col). Cells on the same top-right to bottom-left diagonal have constant (row + col).

2. **Group-then-process pattern**: When you need to process elements based on some grouping property (like which diagonal they're on), it's often efficient to first group them (using a dictionary/hash map), then process each group, then reconstruct.

3. **Attention to sorting direction**: Always double-check whether you need ascending or descending order, especially when the rule changes based on some condition (like which triangle of the matrix).

Related problems: [Sort the Matrix Diagonally](/problem/sort-the-matrix-diagonally)
