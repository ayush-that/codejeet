---
title: "How to Solve Diagonal Traverse II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Diagonal Traverse II. Medium difficulty, 58.3% acceptance rate. Topics: Array, Sorting, Heap (Priority Queue)."
date: "2026-04-21"
category: "dsa-patterns"
tags: ["diagonal-traverse-ii", "array", "sorting", "heap-(priority-queue)", "medium"]
---

# How to Solve Diagonal Traverse II

Diagonal Traverse II asks us to return all elements of a 2D integer array in diagonal order, but with a twist: the rows can have different lengths. This makes the problem more challenging than the standard diagonal traversal where all rows have equal length. The key insight is recognizing that elements on the same diagonal share the same sum of their row and column indices.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
nums = [
    [1, 2, 3],
    [4, 5],
    [6, 7, 8, 9]
]
```

Elements on the same diagonal have the same `(row + col)` sum. Let's calculate:

- Diagonal 0 (sum = 0): [1] at (0,0)
- Diagonal 1 (sum = 1): [2] at (0,1), [4] at (1,0)
- Diagonal 2 (sum = 2): [3] at (0,2), [5] at (1,1), [6] at (2,0)
- Diagonal 3 (sum = 3): [7] at (2,1) (note: (1,2) doesn't exist since row 1 has only 2 columns)
- Diagonal 4 (sum = 4): [8] at (2,2)
- Diagonal 5 (sum = 5): [9] at (2,3)

The output should be: `[1, 2, 4, 3, 5, 6, 7, 8, 9]`

Notice the pattern: within each diagonal, elements appear in order of increasing row index (which means decreasing column index). But across diagonals, we need to process them in increasing sum order.

## Brute Force Approach

A naive approach might try to simulate the diagonal traversal directly:

1. Start at (0,0)
2. Move down-left until hitting a boundary
3. Move to the next starting position

However, this gets messy with irregular row lengths. We'd need to constantly check if a position exists, and determining the next starting position isn't straightforward.

Another brute force approach would be to collect all elements with their `(row + col)` sums, then sort them. This is actually a valid approach, but we can do better than sorting.

## Optimized Approach

The key insight is that elements on the same diagonal share the same `(row + col)` sum. We can:

1. Iterate through all elements in the grid
2. Group them by their diagonal sum `(row + col)`
3. For each diagonal, elements should be ordered by increasing row index (since within a diagonal, higher rows come later in the traversal)
4. Output diagonals in order of increasing sum

The challenge is that we need to process diagonals in order, but we don't know the maximum sum in advance. We could:

- Use a dictionary to group by sum
- Track the maximum sum encountered
- Iterate from 0 to max_sum, collecting elements

But there's a subtlety: within each diagonal, elements with higher row indices should come later. Since we're iterating rows from top to bottom and columns from left to right, if we append elements to a list for each diagonal sum, they'll naturally be in the correct order (increasing row index).

## Optimal Solution

We'll use a dictionary to group elements by their diagonal sum. The clever part is that we need to process the rows in reverse order when building the result to avoid expensive insertions at the beginning of lists.

<div class="code-group">

```python
# Time: O(n) where n is total number of elements
# Space: O(n) for storing all elements in the dictionary
def findDiagonalOrder(nums):
    """
    Returns all elements of nums in diagonal order.

    The key insight is that elements on the same diagonal
    have the same (row + col) sum. We group elements by this
    sum, then output groups in order of increasing sum.
    """
    # Dictionary to store elements grouped by diagonal sum
    # key: diagonal sum (row + col)
    # value: list of elements on that diagonal
    groups = {}

    # Track maximum diagonal sum to know how many diagonals we have
    max_sum = 0

    # Iterate through all rows (from top to bottom)
    for row in range(len(nums)):
        # Iterate through all columns in this row
        for col in range(len(nums[row])):
            # Calculate which diagonal this element belongs to
            diagonal_sum = row + col

            # Update maximum diagonal sum
            max_sum = max(max_sum, diagonal_sum)

            # Add element to its diagonal group
            # If this diagonal doesn't exist yet, create it
            if diagonal_sum not in groups:
                groups[diagonal_sum] = []

            # Append current element to its diagonal group
            groups[diagonal_sum].append(nums[row][col])

    # Build the result by iterating through diagonals in order
    result = []

    # Process diagonals from 0 to max_sum
    for current_sum in range(max_sum + 1):
        # If this diagonal exists in our groups
        if current_sum in groups:
            # Add all elements from this diagonal to result
            # They're already in correct order (increasing row index)
            result.extend(groups[current_sum])

    return result
```

```javascript
// Time: O(n) where n is total number of elements
// Space: O(n) for storing all elements in the map
function findDiagonalOrder(nums) {
  /**
   * Returns all elements of nums in diagonal order.
   *
   * The key insight is that elements on the same diagonal
   * have the same (row + col) sum. We group elements by this
   * sum, then output groups in order of increasing sum.
   */

  // Map to store elements grouped by diagonal sum
  // key: diagonal sum (row + col)
  // value: array of elements on that diagonal
  const groups = new Map();

  // Track maximum diagonal sum to know how many diagonals we have
  let maxSum = 0;

  // Iterate through all rows (from top to bottom)
  for (let row = 0; row < nums.length; row++) {
    // Iterate through all columns in this row
    for (let col = 0; col < nums[row].length; col++) {
      // Calculate which diagonal this element belongs to
      const diagonalSum = row + col;

      // Update maximum diagonal sum
      maxSum = Math.max(maxSum, diagonalSum);

      // Add element to its diagonal group
      // If this diagonal doesn't exist yet, create it
      if (!groups.has(diagonalSum)) {
        groups.set(diagonalSum, []);
      }

      // Append current element to its diagonal group
      groups.get(diagonalSum).push(nums[row][col]);
    }
  }

  // Build the result by iterating through diagonals in order
  const result = [];

  // Process diagonals from 0 to maxSum
  for (let currentSum = 0; currentSum <= maxSum; currentSum++) {
    // If this diagonal exists in our groups
    if (groups.has(currentSum)) {
      // Add all elements from this diagonal to result
      // They're already in correct order (increasing row index)
      result.push(...groups.get(currentSum));
    }
  }

  return result;
}
```

```java
// Time: O(n) where n is total number of elements
// Space: O(n) for storing all elements in the map
import java.util.*;

class Solution {
    public int[] findDiagonalOrder(List<List<Integer>> nums) {
        /**
         * Returns all elements of nums in diagonal order.
         *
         * The key insight is that elements on the same diagonal
         * have the same (row + col) sum. We group elements by this
         * sum, then output groups in order of increasing sum.
         */

        // Map to store elements grouped by diagonal sum
        // key: diagonal sum (row + col)
        // value: list of elements on that diagonal
        Map<Integer, List<Integer>> groups = new HashMap<>();

        // Track maximum diagonal sum to know how many diagonals we have
        int maxSum = 0;

        // Track total number of elements for result array initialization
        int totalElements = 0;

        // Iterate through all rows (from top to bottom)
        for (int row = 0; row < nums.size(); row++) {
            // Iterate through all columns in this row
            for (int col = 0; col < nums.get(row).size(); col++) {
                // Calculate which diagonal this element belongs to
                int diagonalSum = row + col;

                // Update maximum diagonal sum
                maxSum = Math.max(maxSum, diagonalSum);

                // Add element to its diagonal group
                // If this diagonal doesn't exist yet, create it
                groups.putIfAbsent(diagonalSum, new ArrayList<>());

                // Append current element to its diagonal group
                groups.get(diagonalSum).add(nums.get(row).get(col));

                // Count total elements
                totalElements++;
            }
        }

        // Build the result by iterating through diagonals in order
        int[] result = new int[totalElements];
        int index = 0;

        // Process diagonals from 0 to maxSum
        for (int currentSum = 0; currentSum <= maxSum; currentSum++) {
            // If this diagonal exists in our groups
            if (groups.containsKey(currentSum)) {
                // Add all elements from this diagonal to result
                // They're already in correct order (increasing row index)
                for (int num : groups.get(currentSum)) {
                    result[index++] = num;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the total number of elements in the input. We iterate through each element exactly once to add it to the appropriate diagonal group, then iterate through the groups to build the result. The grouping by diagonal sum is O(1) per element using a hash map.

**Space Complexity: O(n)** for storing all elements in the dictionary/map. In the worst case, we might store each element in its own diagonal group, but the total storage is still proportional to n. The output array also takes O(n) space, but this is usually considered separate from the algorithm's space complexity.

## Common Mistakes

1. **Forgetting to handle variable row lengths**: The biggest pitfall is assuming all rows have the same length. Always use `len(nums[row])` or equivalent instead of a fixed column count.

2. **Incorrect diagonal ordering**: Within each diagonal, elements should be ordered by increasing row index (which we get automatically by iterating rows top-to-bottom). Some candidates mistakenly reverse this order.

3. **Inefficient result building**: Building the result by inserting at the beginning of a list for each diagonal would be O(n²) in the worst case. Always append and extend instead.

4. **Missing edge cases**: Empty input (`[]`), single row, single element, or rows with zero length. The solution should handle all these gracefully.

## When You'll See This Pattern

This diagonal grouping pattern appears in several problems:

1. **Diagonal Traverse (LeetCode 498)**: The simpler version where all rows have equal length. The same `(row + col)` sum insight applies.

2. **Sort the Matrix Diagonally (LeetCode 1329)**: Requires grouping by `(row - col)` difference instead of sum, but the grouping concept is identical.

3. **Matrix Diagonal Sum (LeetCode 1572)**: Another variation where you need to process primary and secondary diagonals.

The core technique of grouping elements by some function of their indices (sum, difference, etc.) is useful whenever you need to process matrix elements in a non-standard order.

## Key Takeaways

1. **Diagonal = Constant (row + col)**: Elements on the same diagonal share the same sum of their row and column indices. This is the fundamental insight for all diagonal traversal problems.

2. **Group then flatten**: When you need to process elements in a specific order based on some property, consider grouping by that property first, then processing the groups in the required order.

3. **Iteration order matters**: When building the groups, the order in which you iterate through elements determines their order within each group. Here, top-to-bottom, left-to-right iteration gives us the correct within-diagonal order.

[Practice this problem on CodeJeet](/problem/diagonal-traverse-ii)
