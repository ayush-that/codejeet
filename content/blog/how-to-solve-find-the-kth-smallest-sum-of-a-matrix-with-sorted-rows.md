---
title: "How to Solve Find the Kth Smallest Sum of a Matrix With Sorted Rows — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Kth Smallest Sum of a Matrix With Sorted Rows. Hard difficulty, 62.3% acceptance rate. Topics: Array, Binary Search, Heap (Priority Queue), Matrix."
date: "2028-10-16"
category: "dsa-patterns"
tags:
  [
    "find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows",
    "array",
    "binary-search",
    "heap-(priority-queue)",
    "hard",
  ]
---

# How to Solve Find the Kth Smallest Sum of a Matrix With Sorted Rows

You're given a matrix where each row is sorted, and you need to pick exactly one element from each row to form an array. The challenge is to find the kth smallest sum among all possible arrays. What makes this problem tricky is that the number of possible arrays grows exponentially (n^m), so we can't generate them all. We need a smarter way to explore the search space without brute force enumeration.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
mat = [[1, 3, 11],
       [2, 4, 6]]
k = 5
```

We have 2 rows with 3 elements each, so there are 3 × 3 = 9 possible arrays:

1. [1, 2] → sum = 3
2. [1, 4] → sum = 5
3. [1, 6] → sum = 7
4. [3, 2] → sum = 5
5. [3, 4] → sum = 7
6. [3, 6] → sum = 9
7. [11, 2] → sum = 13
8. [11, 4] → sum = 15
9. [11, 6] → sum = 17

Sorted sums: [3, 5, 5, 7, 7, 9, 13, 15, 17]

The 5th smallest sum is 7. But how do we find this without generating all 9 combinations?

The key insight: we can think of this as finding the kth smallest element in a sorted matrix of sums, where each row represents sums from one row of the original matrix. We can use a min-heap to explore sums in increasing order, similar to merging k sorted lists.

## Brute Force Approach

The most straightforward approach would be to generate all possible arrays, calculate their sums, sort them, and return the kth smallest. For an m×n matrix, there are n^m possible arrays. Generating and sorting them would take O(n^m × m × log(n^m)) time, which is exponential and completely impractical for any reasonable input size.

Even for a modest 10×10 matrix, that's 10^10 = 10 billion combinations! Clearly, we need a smarter approach.

## Optimized Approach

The optimal solution uses a combination of binary search and a counting technique. Here's the step-by-step reasoning:

1. **Binary Search on the Sum**: We know the smallest possible sum is the sum of the first element in each row. The largest possible sum is the sum of the last element in each row. We can binary search between these bounds to find the kth smallest sum.

2. **Counting Sums ≤ X**: For a candidate sum `mid` in our binary search, we need to count how many array sums are ≤ `mid`. If this count is ≥ k, then our answer is ≤ `mid`. Otherwise, it's > `mid`.

3. **DFS with Pruning to Count**: To count how many sums are ≤ `mid`, we use DFS with pruning. Starting from the first row, we try each element in the current row, subtract it from our remaining budget (`mid - current_sum`), and recursively move to the next row. The key optimization: since rows are sorted, once we find an element that's too large, we can stop checking further elements in that row.

4. **Why This Works**: The binary search reduces the problem from "find the kth smallest" to "count how many are ≤ X". The DFS with pruning efficiently counts without generating all combinations because:
   - Rows are sorted, so we can break early
   - We're counting, not storing all combinations
   - The search space is pruned aggressively

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m * log(max_sum - min_sum) * m * log(n)) ≈ O(m² * log(n) * log(max_sum))
# Space: O(m) for recursion depth
def kthSmallest(mat, k):
    """
    Find the kth smallest sum of arrays formed by taking exactly one element from each row.

    Args:
        mat: m x n matrix with sorted rows
        k: which smallest sum to find (1-indexed)

    Returns:
        The kth smallest sum
    """
    m, n = len(mat), len(mat[0])

    # Helper function: count how many sums are <= target_sum
    def count_sums_le_target(row_idx, current_sum, target_sum):
        """
        DFS with pruning to count arrays with sum <= target_sum.

        Args:
            row_idx: current row we're processing
            current_sum: sum of elements chosen so far
            target_sum: the maximum sum we're counting up to

        Returns:
            Number of arrays with sum <= target_sum starting from current state
        """
        # Base case: processed all rows
        if row_idx == m:
            return 1  # Found one valid array

        count = 0
        # Try each element in current row
        for j in range(n):
            new_sum = current_sum + mat[row_idx][j]
            # Since rows are sorted, if this element makes sum > target,
            # all later elements will also make sum > target
            if new_sum > target_sum:
                break
            # Recursively count from next row with updated sum
            count += count_sums_le_target(row_idx + 1, new_sum, target_sum)
            # Early stop if we already found k or more valid arrays
            if count >= k:
                break
        return count

    # Binary search bounds
    left = sum(row[0] for row in mat)  # Minimum possible sum
    right = sum(row[-1] for row in mat)  # Maximum possible sum

    # Binary search for the kth smallest sum
    while left < right:
        mid = left + (right - left) // 2
        # Count how many sums are <= mid
        count = count_sums_le_target(0, 0, mid)

        if count >= k:
            # Answer is <= mid
            right = mid
        else:
            # Answer is > mid
            left = mid + 1

    return left
```

```javascript
// Time: O(m * log(max_sum - min_sum) * m * log(n)) ≈ O(m² * log(n) * log(max_sum))
// Space: O(m) for recursion depth
function kthSmallest(mat, k) {
  const m = mat.length;
  const n = mat[0].length;

  /**
   * DFS with pruning to count arrays with sum <= targetSum.
   *
   * @param {number} rowIdx - Current row we're processing
   * @param {number} currentSum - Sum of elements chosen so far
   * @param {number} targetSum - Maximum sum we're counting up to
   * @returns {number} Number of arrays with sum <= targetSum
   */
  function countSumsLeTarget(rowIdx, currentSum, targetSum) {
    // Base case: processed all rows
    if (rowIdx === m) {
      return 1; // Found one valid array
    }

    let count = 0;
    // Try each element in current row
    for (let j = 0; j < n; j++) {
      const newSum = currentSum + mat[rowIdx][j];
      // Since rows are sorted, if this element makes sum > target,
      // all later elements will also make sum > target
      if (newSum > targetSum) {
        break;
      }
      // Recursively count from next row with updated sum
      count += countSumsLeTarget(rowIdx + 1, newSum, targetSum);
      // Early stop if we already found k or more valid arrays
      if (count >= k) {
        break;
      }
    }
    return count;
  }

  // Binary search bounds
  let left = 0;
  let right = 0;
  for (let i = 0; i < m; i++) {
    left += mat[i][0]; // Minimum possible sum
    right += mat[i][n - 1]; // Maximum possible sum
  }

  // Binary search for the kth smallest sum
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);
    // Count how many sums are <= mid
    const count = countSumsLeTarget(0, 0, mid);

    if (count >= k) {
      // Answer is <= mid
      right = mid;
    } else {
      // Answer is > mid
      left = mid + 1;
    }
  }

  return left;
}
```

```java
// Time: O(m * log(max_sum - min_sum) * m * log(n)) ≈ O(m² * log(n) * log(max_sum))
// Space: O(m) for recursion depth
class Solution {
    public int kthSmallest(int[][] mat, int k) {
        int m = mat.length;
        int n = mat[0].length;

        // Helper function to count sums <= target
        // Using instance method to avoid passing mat and k repeatedly
        return binarySearch(mat, k, m, n);
    }

    private int binarySearch(int[][] mat, int k, int m, int n) {
        // Calculate binary search bounds
        int left = 0, right = 0;
        for (int i = 0; i < m; i++) {
            left += mat[i][0];           // Minimum possible sum
            right += mat[i][n - 1];      // Maximum possible sum
        }

        // Binary search for the kth smallest sum
        while (left < right) {
            int mid = left + (right - left) / 2;
            // Count how many sums are <= mid
            int count = countSumsLeTarget(mat, 0, 0, mid, k, m, n);

            if (count >= k) {
                // Answer is <= mid
                right = mid;
            } else {
                // Answer is > mid
                left = mid + 1;
            }
        }

        return left;
    }

    /**
     * DFS with pruning to count arrays with sum <= targetSum.
     */
    private int countSumsLeTarget(int[][] mat, int rowIdx, int currentSum,
                                  int targetSum, int k, int m, int n) {
        // Base case: processed all rows
        if (rowIdx == m) {
            return 1;  // Found one valid array
        }

        int count = 0;
        // Try each element in current row
        for (int j = 0; j < n; j++) {
            int newSum = currentSum + mat[rowIdx][j];
            // Since rows are sorted, if this element makes sum > target,
            // all later elements will also make sum > target
            if (newSum > targetSum) {
                break;
            }
            // Recursively count from next row with updated sum
            count += countSumsLeTarget(mat, rowIdx + 1, newSum, targetSum, k, m, n);
            // Early stop if we already found k or more valid arrays
            if (count >= k) {
                break;
            }
        }
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m² × log(n) × log(max_sum - min_sum))

Let's break this down:

- Binary search runs O(log(max_sum - min_sum)) times
- For each binary search iteration, we call `count_sums_le_target`
- The DFS explores at most k paths (due to early stopping when count ≥ k)
- Each path goes through m rows and at each row, we might check up to n elements (but break early due to sorting)
- In practice, the DFS explores roughly O(m × min(k, n^(m))) paths, but with pruning it's much better

**Space Complexity:** O(m) for the recursion call stack depth. We don't store all combinations, just count them as we go.

## Common Mistakes

1. **Forgetting to break early in DFS**: Without the `break` when `new_sum > target_sum`, the algorithm would check all n elements in every row, making it O(n^m) instead of much faster. Remember: rows are sorted, so once an element is too large, all later ones are too.

2. **Not using early stopping when count ≥ k**: In the DFS, once we've found k valid arrays, we can stop searching. This is crucial for performance when k is small relative to the total number of combinations.

3. **Incorrect binary search bounds**: Using 0 and Integer.MAX_VALUE as bounds would work but be inefficient. Using the actual min and max possible sums (sum of first/last elements) makes the binary search much faster.

4. **Off-by-one in binary search**: The classic binary search pattern `while left < right` with `right = mid` and `left = mid + 1` ensures we find the smallest sum with count ≥ k. Getting this wrong could return a sum that doesn't have enough arrays ≤ it.

## When You'll See This Pattern

This "binary search on answer + counting valid combinations" pattern appears in several hard problems:

1. **Kth Smallest Element in a Sorted Matrix (LeetCode 378)**: Very similar pattern - binary search on value range and count how many elements are ≤ mid.

2. **Find K-th Smallest Pair Distance (LeetCode 719)**: Binary search on distance and count pairs with distance ≤ mid.

3. **Split Array Largest Sum (LeetCode 410)**: Binary search on the maximum subarray sum and count how many splits are needed.

The common theme: when asked for the kth smallest/largest of something, and direct computation is expensive, consider binary searching for the answer and implementing an efficient counting function.

## Key Takeaways

1. **Binary search isn't just for arrays**: You can binary search on the answer space when you have a monotonic condition (like "count of sums ≤ X increases with X").

2. **Counting can be easier than generating**: Instead of generating the kth smallest element directly, count how many are ≤ X. This transforms the problem into something more manageable.

3. **Prune aggressively with sorting**: When data is sorted, you can break early in searches. This turns exponential problems into tractable ones.

4. **Combine techniques for hard problems**: This solution combines binary search, DFS, and pruning. Hard problems often require layering multiple techniques.

[Practice this problem on CodeJeet](/problem/find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows)
