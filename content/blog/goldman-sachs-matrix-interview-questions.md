---
title: "Matrix Questions at Goldman Sachs: What to Expect"
description: "Prepare for Matrix interview questions at Goldman Sachs — patterns, difficulty breakdown, and study tips."
date: "2027-08-10"
category: "dsa-patterns"
tags: ["goldman-sachs", "matrix", "interview prep"]
---

Matrix problems appear in roughly 10% of Goldman Sachs' technical interview question pool. For a firm that builds high-frequency trading systems, risk models, and large-scale financial simulations, the ability to efficiently manipulate two-dimensional data is non-negotiable. Matrix questions test your grasp of nested iterations, spatial reasoning, and optimization—skills directly applicable to processing market data grids, portfolio matrices, or adjacency matrices for financial networks. Doing well here signals you can handle the structured, data-intensive computations that are core to the bank's engineering and quant roles.

## What to Expect — Types of Problems

Goldman Sachs matrix questions typically fall into three categories. First, **traversal and pathfinding**: spirally traversing a matrix, finding the shortest path in a grid (often with obstacles), or calculating minimum path sums. These test your ability to manage indices and directions systematically.

Second, **search and modification**: problems like searching in a row-wise and column-wise sorted matrix, or modifying a matrix in-place (e.g., rotating an image, setting matrix zeroes). These assess your understanding of matrix properties and memory efficiency.

Third, **dynamic programming on grids**: classic problems like unique paths, maximal squares, or calculating the size of the largest island. These evaluate your ability to break down complex spatial problems into overlapping subproblems, a key skill for optimizing financial models.

Expect constraints on time and space complexity. A brute-force solution is rarely sufficient; you'll need to demonstrate an optimized approach, often involving careful boundary checks and avoiding redundant passes.

## How to Prepare — Study Tips with One Code Example

Focus on pattern recognition, not memorization. Start by mastering the fundamentals: writing bug-free nested loops to traverse a matrix in all directions (right, down, left, up). Practice common operations like transposition and reflection. Then, map problems to core algorithms: BFS/DFS for islands, dynamic programming for path sums, and binary search for sorted matrix searches.

Always analyze the time and space complexity of your solution. For in-place modifications, confirm you're not using extra data structures unnecessarily. A key pattern to internalize is using the matrix itself to store state, such as using a special marker value instead of an auxiliary visited set.

A critical pattern is **searching in a sorted matrix**. Given a matrix where each row and each column is sorted in ascending order, an efficient solution starts from the top-right corner (or bottom-left), eliminating an entire row or column with each comparison.

<div class="code-group">

```python
def search_sorted_matrix(matrix, target):
    if not matrix:
        return False
    rows, cols = len(matrix), len(matrix[0])
    # Start from top-right corner
    r, c = 0, cols - 1
    while r < rows and c >= 0:
        if matrix[r][c] == target:
            return True
        elif matrix[r][c] > target:
            c -= 1  # Eliminate current column
        else:
            r += 1  # Eliminate current row
    return False
```

```javascript
function searchSortedMatrix(matrix, target) {
  if (!matrix.length) return false;
  let rows = matrix.length,
    cols = matrix[0].length;
  // Start from top-right corner
  let r = 0,
    c = cols - 1;
  while (r < rows && c >= 0) {
    if (matrix[r][c] === target) {
      return true;
    } else if (matrix[r][c] > target) {
      c--; // Eliminate current column
    } else {
      r++; // Eliminate current row
    }
  }
  return false;
}
```

```java
public boolean searchSortedMatrix(int[][] matrix, int target) {
    if (matrix == null || matrix.length == 0) return false;
    int rows = matrix.length, cols = matrix[0].length;
    // Start from top-right corner
    int r = 0, c = cols - 1;
    while (r < rows && c >= 0) {
        if (matrix[r][c] == target) {
            return true;
        } else if (matrix[r][c] > target) {
            c--; // Eliminate current column
        } else {
            r++; // Eliminate current row
        }
    }
    return false;
}
```

</div>

This algorithm runs in O(m + n) time and O(1) space, a significant improvement over a naive O(m \* n) check.

## Recommended Practice Order

1.  **Basic Traversal:** Practice row-wise, column-wise, and diagonal traversal. Implement a spiral order traversal.
2.  **In-place Operations:** Solve matrix rotation (90 degrees), set matrix zeroes, and transpose problems.
3.  **Search Problems:** Master searching in sorted matrices and simple BFS/DFS for "island" count problems.
4.  **Dynamic Programming:** Solve minimum path sum, unique paths, and maximal square problems.
5.  **Complex Pathfinding:** Tackle problems like shortest path in a binary matrix or where dynamic state is involved.

Time yourself. Aim to solve a medium-difficulty matrix problem in under 20 minutes, including discussing complexity and edge cases.

[Practice Matrix at Goldman Sachs](/company/goldman-sachs/matrix)
