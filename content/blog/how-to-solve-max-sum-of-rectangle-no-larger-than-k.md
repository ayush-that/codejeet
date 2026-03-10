---
title: "How to Solve Max Sum of Rectangle No Larger Than K — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Max Sum of Rectangle No Larger Than K. Hard difficulty, 45.3% acceptance rate. Topics: Array, Binary Search, Matrix, Prefix Sum, Ordered Set."
date: "2026-10-19"
category: "dsa-patterns"
tags: ["max-sum-of-rectangle-no-larger-than-k", "array", "binary-search", "matrix", "hard"]
---

# How to Solve Max Sum of Rectangle No Larger Than K

This problem asks us to find the maximum sum of any rectangular submatrix where the sum does not exceed a given integer `k`. What makes this problem particularly challenging is that we need to consider _all possible rectangles_ in a 2D matrix while efficiently checking sums against a constraint. The brute force approach would be prohibitively slow, requiring us to think creatively about reducing the problem to a 1D search problem we can solve efficiently.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider this 3×3 matrix with `k = 2`:

```
[1, 0, 1]
[0, -2, 3]
[0, 1, 0]
```

We need to find the rectangle with maximum sum ≤ 2. Let's think about how we might approach this systematically:

1. **First insight**: Any rectangle can be defined by its top and bottom rows, and its left and right columns. If we fix the top and bottom rows, we're essentially working with a 1D array where each element represents the sum of that column between those rows.

2. **Second insight**: Once we have this 1D array, we need to find the maximum subarray sum ≤ k. This is similar to the "maximum subarray sum" problem but with a constraint.

For example, if we fix top row = 0 and bottom row = 1:

- Column sums: [1+0=1, 0+(-2)=-2, 1+3=4] → [1, -2, 4]
- Now we need to find the maximum contiguous sum in [1, -2, 4] that's ≤ 2.

3. **Third insight**: We can use prefix sums and binary search. For the array [1, -2, 4]:
   - Prefix sums: [0, 1, -1, 3] (starting with 0)
   - For any subarray sum from i to j: sum = prefix[j] - prefix[i]
   - We want prefix[j] - prefix[i] ≤ k, which means prefix[i] ≥ prefix[j] - k
   - So for each prefix[j], we need to find the smallest prefix[i] that's ≥ (prefix[j] - k)

This transformation is the key to solving the problem efficiently.

## Brute Force Approach

The most straightforward approach would be to consider all possible rectangles:

1. For every possible top row (m choices)
2. For every possible bottom row (m choices, starting from top)
3. For every possible left column (n choices)
4. For every possible right column (n choices, starting from left)
5. Calculate the sum of that rectangle and check if it's ≤ k

This gives us O(m²n²) time complexity, which is O(m²n²) = O((mn)²). For a typical 100×100 matrix, that's 100 million operations just for the loops, plus the sum calculation. Even with prefix sum precomputation to calculate rectangle sums in O(1), we still have O(m²n²) operations.

The brute force is clearly too slow for the constraints (m, n up to 100 in typical test cases, making O(m²n²) potentially 100 million operations).

## Optimized Approach

The key insight is to reduce the 2D problem to a 1D problem:

1. **Fix top and bottom rows**: For each pair of top and bottom rows, we compress the matrix into a 1D array where each element is the sum of that column between those rows.

2. **Solve 1D version**: Now we need to find the maximum subarray sum ≤ k in this 1D array. We can't use Kadane's algorithm directly because of the "≤ k" constraint.

3. **Prefix sums with binary search**: For the 1D array, we compute prefix sums. For each ending position `j`, we want to find the smallest prefix sum at position `i` (where i < j) such that:

   ```
   prefix[j] - prefix[i] ≤ k
   ```

   Rearranging: `prefix[i] ≥ prefix[j] - k`

   So we need to find the smallest prefix[i] that's ≥ (prefix[j] - k). This is a perfect job for a balanced binary search tree or sorted data structure.

4. **Use TreeSet/Ordered Set**: We maintain a sorted set of prefix sums we've seen so far. For each new prefix sum, we search for the smallest value in the set that's ≥ (current_prefix - k). If we find it, we have a candidate rectangle sum.

This approach gives us O(m² \* n log n) time complexity, which is much better than O(m²n²).

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m^2 * n log n) where m = rows, n = cols
# Space: O(n) for the prefix sums array and sorted list
def maxSumSubmatrix(matrix, k):
    """
    Find the maximum sum of any rectangular submatrix with sum ≤ k.

    The key insight is to fix top and bottom rows, then solve the 1D problem
    of finding maximum subarray sum ≤ k using prefix sums and binary search.
    """
    import bisect

    rows, cols = len(matrix), len(matrix[0])
    max_sum = float('-inf')

    # Try every possible top row
    for top in range(rows):
        # Initialize column sums for current top row
        col_sums = [0] * cols

        # Try every possible bottom row starting from top
        for bottom in range(top, rows):
            # Update column sums to include current bottom row
            for col in range(cols):
                col_sums[col] += matrix[bottom][col]

            # Now we have a 1D array col_sums
            # Find maximum subarray sum ≤ k in this array

            # Use prefix sums and binary search
            prefix_sums = [0]  # Start with 0 for empty subarray
            current_prefix = 0

            for col_sum in col_sums:
                # Update running prefix sum
                current_prefix += col_sum

                # We want: current_prefix - some_previous_prefix ≤ k
                # Which means: some_previous_prefix ≥ current_prefix - k
                # So we need to find the smallest prefix ≥ (current_prefix - k)

                # Binary search in sorted prefix_sums
                target = current_prefix - k
                idx = bisect.bisect_left(prefix_sums, target)

                # If we found a valid prefix sum
                if idx < len(prefix_sums):
                    # Calculate the rectangle sum
                    rect_sum = current_prefix - prefix_sums[idx]
                    max_sum = max(max_sum, rect_sum)

                # Insert current prefix sum into sorted list
                bisect.insort(prefix_sums, current_prefix)

    return max_sum
```

```javascript
// Time: O(m^2 * n log n) where m = rows, n = cols
// Space: O(n) for the prefix sums array and sorted list
function maxSumSubmatrix(matrix, k) {
  /**
   * Find the maximum sum of any rectangular submatrix with sum ≤ k.
   *
   * The key insight is to fix top and bottom rows, then solve the 1D problem
   * of finding maximum subarray sum ≤ k using prefix sums and binary search.
   */
  const rows = matrix.length;
  const cols = matrix[0].length;
  let maxSum = -Infinity;

  // Try every possible top row
  for (let top = 0; top < rows; top++) {
    // Initialize column sums for current top row
    const colSums = new Array(cols).fill(0);

    // Try every possible bottom row starting from top
    for (let bottom = top; bottom < rows; bottom++) {
      // Update column sums to include current bottom row
      for (let col = 0; col < cols; col++) {
        colSums[col] += matrix[bottom][col];
      }

      // Now we have a 1D array colSums
      // Find maximum subarray sum ≤ k in this array

      // Use prefix sums and binary search
      const prefixSums = [0]; // Start with 0 for empty subarray
      let currentPrefix = 0;

      for (const colSum of colSums) {
        // Update running prefix sum
        currentPrefix += colSum;

        // We want: currentPrefix - somePreviousPrefix ≤ k
        // Which means: somePreviousPrefix ≥ currentPrefix - k
        // So we need to find the smallest prefix ≥ (currentPrefix - k)

        // Binary search in sorted prefixSums
        const target = currentPrefix - k;

        // Manual binary search since JavaScript doesn't have bisect
        let left = 0,
          right = prefixSums.length;
        while (left < right) {
          const mid = Math.floor((left + right) / 2);
          if (prefixSums[mid] < target) {
            left = mid + 1;
          } else {
            right = mid;
          }
        }

        // If we found a valid prefix sum
        if (left < prefixSums.length) {
          // Calculate the rectangle sum
          const rectSum = currentPrefix - prefixSums[left];
          maxSum = Math.max(maxSum, rectSum);
        }

        // Insert current prefix sum into sorted list
        // Find insertion position
        let insertPos = 0;
        while (insertPos < prefixSums.length && prefixSums[insertPos] < currentPrefix) {
          insertPos++;
        }
        prefixSums.splice(insertPos, 0, currentPrefix);
      }
    }
  }

  return maxSum;
}
```

```java
// Time: O(m^2 * n log n) where m = rows, n = cols
// Space: O(n) for the prefix sums array and TreeSet
import java.util.TreeSet;

class Solution {
    public int maxSumSubmatrix(int[][] matrix, int k) {
        /**
         * Find the maximum sum of any rectangular submatrix with sum ≤ k.
         *
         * The key insight is to fix top and bottom rows, then solve the 1D problem
         * of finding maximum subarray sum ≤ k using prefix sums and TreeSet.
         */
        int rows = matrix.length;
        int cols = matrix[0].length;
        int maxSum = Integer.MIN_VALUE;

        // Try every possible top row
        for (int top = 0; top < rows; top++) {
            // Initialize column sums for current top row
            int[] colSums = new int[cols];

            // Try every possible bottom row starting from top
            for (int bottom = top; bottom < rows; bottom++) {
                // Update column sums to include current bottom row
                for (int col = 0; col < cols; col++) {
                    colSums[col] += matrix[bottom][col];
                }

                // Now we have a 1D array colSums
                // Find maximum subarray sum ≤ k in this array

                // Use prefix sums and TreeSet for efficient ceiling() operation
                TreeSet<Integer> prefixSet = new TreeSet<>();
                prefixSet.add(0);  // Start with 0 for empty subarray
                int currentPrefix = 0;

                for (int colSum : colSums) {
                    // Update running prefix sum
                    currentPrefix += colSum;

                    // We want: currentPrefix - somePreviousPrefix ≤ k
                    // Which means: somePreviousPrefix ≥ currentPrefix - k
                    // So we need to find the smallest prefix ≥ (currentPrefix - k)

                    // TreeSet.ceiling() gives us the smallest element ≥ given value
                    Integer targetPrefix = prefixSet.ceiling(currentPrefix - k);

                    // If we found a valid prefix sum
                    if (targetPrefix != null) {
                        // Calculate the rectangle sum
                        int rectSum = currentPrefix - targetPrefix;
                        maxSum = Math.max(maxSum, rectSum);
                    }

                    // Insert current prefix sum into TreeSet
                    prefixSet.add(currentPrefix);
                }
            }
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m² \* n log n) where m is the number of rows and n is the number of columns.

- Outer loops: O(m²) for trying all pairs of top and bottom rows
- For each pair: O(n) to update column sums
- For the 1D subarray problem: O(n log n) using binary search/TreeSet
- Total: O(m² \* n log n)

**Space Complexity**: O(n)

- We need O(n) to store column sums
- We need O(n) to store prefix sums in the sorted data structure
- Total: O(n)

**Why this is optimal**: In the worst case where m ≈ n, this is O(n³ log n), which is much better than the brute force O(n⁴). For rectangular matrices, we should choose the smaller dimension to iterate over in the outer loops to get better performance.

## Common Mistakes

1. **Forgetting the empty subarray case**: Always start with prefix sum 0 in your sorted set. This represents the empty subarray before the first element. Without it, you'll miss rectangles that start at the beginning.

2. **Using the wrong inequality direction**: Remember we need `prefix[i] ≥ prefix[j] - k`, not `prefix[i] ≤ prefix[j] - k`. The inequality flips because we're subtracting.

3. **Not handling negative numbers correctly**: The problem statement doesn't restrict to positive numbers. Your solution must handle negative values in the matrix, which means:
   - The maximum sum ≤ k might be negative
   - You can't early exit when current sum exceeds k
   - TreeSet/bisect operations still work with negatives

4. **Inefficient insertion in JavaScript**: In JavaScript, inserting into a sorted array takes O(n) time. While the overall complexity remains the same asymptotically, in practice it's slower than Python's `bisect.insort` or Java's `TreeSet`. For interviews, mentioning this trade-off shows deep understanding.

## When You'll See This Pattern

This problem combines several important patterns:

1. **2D to 1D reduction with fixed boundaries**: Similar to "Maximum Sum Rectangle in a 2D Matrix" (Kadane's 2D), but with an additional constraint.

2. **Maximum subarray sum with constraint**: The core 1D subproblem appears in:
   - "Maximum Sum of Subarray Close to K" (similar but not exactly the same)
   - Problems where you need to find subarrays with sums satisfying some condition

3. **Prefix sums with binary search**: This technique appears in:
   - "Subarray Sum Equals K" (though that uses hash maps instead of binary search)
   - "Continuous Subarray Sum"
   - Any problem where you need to find subarrays with sums in a range

## Key Takeaways

1. **Reduce dimensionality**: When dealing with 2D subarray problems, consider fixing one dimension (like top/bottom rows) to reduce it to a 1D problem that's easier to solve.

2. **Prefix sums + binary search for constrained sums**: When you need to find subarray sums satisfying `sum ≤ k` or similar constraints, transform it to `prefix[j] - prefix[i] ≤ k` and use a sorted data structure to efficiently find the appropriate prefix[i].

3. **Choose the smaller dimension for outer loops**: For rectangular matrices, always iterate over the smaller dimension in the outer loops to minimize time complexity. If cols < rows, you should fix left/right columns instead of top/bottom rows.

[Practice this problem on CodeJeet](/problem/max-sum-of-rectangle-no-larger-than-k)
