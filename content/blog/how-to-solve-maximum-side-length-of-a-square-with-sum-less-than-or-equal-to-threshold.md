---
title: "How to Solve Maximum Side Length of a Square with Sum Less than or Equal to Threshold — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Side Length of a Square with Sum Less than or Equal to Threshold. Medium difficulty, 65.4% acceptance rate. Topics: Array, Binary Search, Matrix, Prefix Sum."
date: "2027-01-24"
category: "dsa-patterns"
tags:
  [
    "maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold",
    "array",
    "binary-search",
    "matrix",
    "medium",
  ]
---

# How to Solve Maximum Side Length of a Square with Sum Less than or Equal to Threshold

You're given a matrix of integers and a threshold value. Your task is to find the largest possible square (with side length `k`) where the sum of all elements inside that square is ≤ threshold. If no such square exists, return 0. The challenge here is that checking every possible square naively would be extremely slow for large matrices. The key insight is that we need an efficient way to calculate the sum of any square region in constant time.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
mat = [[1, 1, 3, 2, 4, 3, 2],
       [1, 1, 3, 2, 4, 3, 2],
       [1, 1, 3, 2, 4, 3, 2]]
threshold = 4
```

We want to find the largest square where the sum ≤ 4. Let's think about how we'd check this manually:

1. **Check side length 1**: Look at all 1×1 squares. The smallest value is 1, so side length 1 works.
2. **Check side length 2**: Look at 2×2 squares. For example, the top-left 2×2 square has sum = 1+1+1+1 = 4, which equals our threshold. So side length 2 works too.
3. **Check side length 3**: Look at 3×3 squares. The top-left 3×3 square has sum = 1+1+3+1+1+3+1+1+3 = 15, which exceeds threshold. All other 3×3 squares also exceed threshold.

The maximum side length is 2. The brute force approach would check every possible square for every possible side length, but that's O(m×n×min(m,n)) which is too slow. We need a smarter way to calculate square sums quickly.

## Brute Force Approach

The most straightforward solution is to try every possible square in the matrix:

1. For each possible side length `k` from 1 to min(m, n)
2. For each possible top-left corner (i, j) where i ≤ m-k and j ≤ n-k
3. Calculate the sum of the k×k square starting at (i, j)
4. If the sum ≤ threshold, update the maximum side length

The problem is the time complexity: O(m × n × min(m,n)³) because for each square we sum up to k² elements, and k can be as large as min(m,n). For a 100×100 matrix, this could mean billions of operations.

<div class="code-group">

```python
# Time: O(m * n * min(m,n)^3) | Space: O(1)
def maxSideLength_brute(mat, threshold):
    m, n = len(mat), len(mat[0])
    max_k = 0

    # Try all possible side lengths from largest to smallest
    for k in range(1, min(m, n) + 1):
        found = False
        # Try all possible top-left corners
        for i in range(m - k + 1):
            for j in range(n - k + 1):
                # Calculate sum of current k×k square
                square_sum = 0
                for x in range(i, i + k):
                    for y in range(j, j + k):
                        square_sum += mat[x][y]

                # Check if this square meets the threshold
                if square_sum <= threshold:
                    max_k = k
                    found = True
                    break
            if found:
                break
        if not found:
            break

    return max_k
```

```javascript
// Time: O(m * n * min(m,n)^3) | Space: O(1)
function maxSideLengthBrute(mat, threshold) {
  const m = mat.length,
    n = mat[0].length;
  let maxK = 0;

  // Try all possible side lengths from largest to smallest
  for (let k = 1; k <= Math.min(m, n); k++) {
    let found = false;
    // Try all possible top-left corners
    for (let i = 0; i <= m - k; i++) {
      for (let j = 0; j <= n - k; j++) {
        // Calculate sum of current k×k square
        let squareSum = 0;
        for (let x = i; x < i + k; x++) {
          for (let y = j; y < j + k; y++) {
            squareSum += mat[x][y];
          }
        }

        // Check if this square meets the threshold
        if (squareSum <= threshold) {
          maxK = k;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (!found) break;
  }

  return maxK;
}
```

```java
// Time: O(m * n * min(m,n)^3) | Space: O(1)
public int maxSideLengthBrute(int[][] mat, int threshold) {
    int m = mat.length, n = mat[0].length;
    int maxK = 0;

    // Try all possible side lengths from largest to smallest
    for (int k = 1; k <= Math.min(m, n); k++) {
        boolean found = false;
        // Try all possible top-left corners
        for (int i = 0; i <= m - k; i++) {
            for (int j = 0; j <= n - k; j++) {
                // Calculate sum of current k×k square
                int squareSum = 0;
                for (int x = i; x < i + k; x++) {
                    for (int y = j; y < j + k; y++) {
                        squareSum += mat[x][y];
                    }
                }

                // Check if this square meets the threshold
                if (squareSum <= threshold) {
                    maxK = k;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        if (!found) break;
    }

    return maxK;
}
```

</div>

This brute force approach is too slow because for each k×k square, we're doing O(k²) work to calculate the sum. We need a way to calculate square sums in constant time.

## Optimized Approach

The key insight is to use a **prefix sum matrix** (also called an integral image). This is a common technique in image processing and matrix problems where you need to quickly calculate the sum of any rectangular region.

Here's how it works:

1. **Build a prefix sum matrix** `prefix` where `prefix[i+1][j+1]` represents the sum of all elements in the rectangle from (0,0) to (i,j) inclusive.
2. **Calculate any rectangular sum in O(1) time** using the formula:
   ```
   sum = prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1]
   ```
   where (r1,c1) is top-left and (r2,c2) is bottom-right.
3. **Search for the maximum side length** efficiently. We can use binary search since if a square of side k exists, then squares of all smaller sides also exist (though not necessarily vice versa).

The algorithm:

1. Build the prefix sum matrix with an extra row and column of zeros for easier boundary handling.
2. Use binary search to find the maximum k where at least one k×k square has sum ≤ threshold.
3. For each candidate k in binary search, check all possible k×k squares using the prefix sum matrix.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m*n*log(min(m,n))) | Space: O(m*n)
def maxSideLength(mat, threshold):
    m, n = len(mat), len(mat[0])

    # Step 1: Build prefix sum matrix with extra row and column for easier calculations
    # prefix[i+1][j+1] = sum of mat[0..i][0..j]
    prefix = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m):
        for j in range(n):
            # Calculate prefix sum using inclusion-exclusion principle
            prefix[i + 1][j + 1] = (mat[i][j] +
                                   prefix[i][j + 1] +
                                   prefix[i + 1][j] -
                                   prefix[i][j])

    # Helper function to check if a square of side length k exists
    def can_form_square(k):
        # Check all possible k×k squares
        for i in range(m - k + 1):
            for j in range(n - k + 1):
                # Calculate sum of square with top-left at (i,j) and side length k
                # Using prefix sum formula: sum = bottom_right - top_right - bottom_left + top_left
                r1, c1 = i, j           # top-left
                r2, c2 = i + k, j + k   # bottom-right (exclusive in prefix indices)

                square_sum = (prefix[r2][c2] -
                             prefix[r1][c2] -
                             prefix[r2][c1] +
                             prefix[r1][c1])

                if square_sum <= threshold:
                    return True
        return False

    # Step 2: Binary search for the maximum side length
    left, right = 0, min(m, n)
    answer = 0

    while left <= right:
        mid = (left + right) // 2

        if can_form_square(mid):
            # If we can form a square of side mid, try larger
            answer = mid
            left = mid + 1
        else:
            # Otherwise, try smaller
            right = mid - 1

    return answer
```

```javascript
// Time: O(m*n*log(min(m,n))) | Space: O(m*n)
function maxSideLength(mat, threshold) {
  const m = mat.length,
    n = mat[0].length;

  // Step 1: Build prefix sum matrix with extra row and column for easier calculations
  // prefix[i+1][j+1] = sum of mat[0..i][0..j]
  const prefix = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // Calculate prefix sum using inclusion-exclusion principle
      prefix[i + 1][j + 1] = mat[i][j] + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j];
    }
  }

  // Helper function to check if a square of side length k exists
  const canFormSquare = (k) => {
    // Check all possible k×k squares
    for (let i = 0; i <= m - k; i++) {
      for (let j = 0; j <= n - k; j++) {
        // Calculate sum of square with top-left at (i,j) and side length k
        // Using prefix sum formula: sum = bottom_right - top_right - bottom_left + top_left
        const r1 = i,
          c1 = j; // top-left
        const r2 = i + k,
          c2 = j + k; // bottom-right (exclusive in prefix indices)

        const squareSum = prefix[r2][c2] - prefix[r1][c2] - prefix[r2][c1] + prefix[r1][c1];

        if (squareSum <= threshold) {
          return true;
        }
      }
    }
    return false;
  };

  // Step 2: Binary search for the maximum side length
  let left = 0,
    right = Math.min(m, n);
  let answer = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (canFormSquare(mid)) {
      // If we can form a square of side mid, try larger
      answer = mid;
      left = mid + 1;
    } else {
      // Otherwise, try smaller
      right = mid - 1;
    }
  }

  return answer;
}
```

```java
// Time: O(m*n*log(min(m,n))) | Space: O(m*n)
public int maxSideLength(int[][] mat, int threshold) {
    int m = mat.length, n = mat[0].length;

    // Step 1: Build prefix sum matrix with extra row and column for easier calculations
    // prefix[i+1][j+1] = sum of mat[0..i][0..j]
    int[][] prefix = new int[m + 1][n + 1];

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            // Calculate prefix sum using inclusion-exclusion principle
            prefix[i + 1][j + 1] = mat[i][j] +
                                  prefix[i][j + 1] +
                                  prefix[i + 1][j] -
                                  prefix[i][j];
        }
    }

    // Step 2: Binary search for the maximum side length
    int left = 0, right = Math.min(m, n);
    int answer = 0;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (canFormSquare(prefix, m, n, mid, threshold)) {
            // If we can form a square of side mid, try larger
            answer = mid;
            left = mid + 1;
        } else {
            // Otherwise, try smaller
            right = mid - 1;
        }
    }

    return answer;
}

// Helper function to check if a square of side length k exists
private boolean canFormSquare(int[][] prefix, int m, int n, int k, int threshold) {
    // Check all possible k×k squares
    for (int i = 0; i <= m - k; i++) {
        for (int j = 0; j <= n - k; j++) {
            // Calculate sum of square with top-left at (i,j) and side length k
            // Using prefix sum formula: sum = bottom_right - top_right - bottom_left + top_left
            int r1 = i, c1 = j;           // top-left
            int r2 = i + k, c2 = j + k;   // bottom-right (exclusive in prefix indices)

            int squareSum = prefix[r2][c2] -
                           prefix[r1][c2] -
                           prefix[r2][c1] +
                           prefix[r1][c1];

            if (squareSum <= threshold) {
                return true;
            }
        }
    }
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n × log(min(m, n)))**

- Building the prefix sum matrix takes O(m × n) time
- Binary search runs O(log(min(m, n))) iterations
- For each binary search iteration, we check O((m-k)×(n-k)) squares, which in the worst case is O(m × n)
- Total: O(m × n) + O(log(min(m, n)) × O(m × n)) = O(m × n × log(min(m, n)))

**Space Complexity: O(m × n)**

- We need to store the prefix sum matrix of size (m+1) × (n+1)

## Common Mistakes

1. **Off-by-one errors in prefix sum indices**: The most common mistake is getting the indices wrong when calculating rectangle sums from the prefix matrix. Remember that `prefix[i][j]` represents the sum from (0,0) to (i-1,j-1). Always include an extra row and column of zeros to simplify boundary cases.

2. **Forgetting to handle the k=0 case**: The problem states to return 0 if no square exists, but k=0 is always valid (an empty square has sum 0). Make sure your binary search starts from left=0, not left=1.

3. **Incorrect binary search condition**: When using binary search, remember that if a square of side k exists, then squares of all smaller sides also exist (though not necessarily with the same top-left corner). This monotonic property is what makes binary search valid.

4. **Not optimizing the square checking**: Some candidates check all squares for all k values without binary search, resulting in O(m² × n²) complexity. Always look for opportunities to use binary search when the answer space is monotonic.

## When You'll See This Pattern

The prefix sum matrix technique (also called 2D prefix sum or integral image) is useful whenever you need to repeatedly calculate sums of rectangular regions in a matrix. You'll see this pattern in:

1. **Range Sum Query 2D - Immutable (LeetCode 304)**: Direct application of 2D prefix sums to answer multiple rectangular sum queries.
2. **Number of Submatrices That Sum to Target (LeetCode 1074)**: Uses prefix sums to efficiently find submatrices with a specific sum.
3. **Max Sum of Rectangle No Larger Than K (LeetCode 363)**: Combines prefix sums with other techniques to find rectangles with sum close to a target.

The pattern to recognize: when a problem asks about sums of rectangular regions in a matrix and you need to answer many such queries or search for optimal regions, consider using a prefix sum matrix.

## Key Takeaways

1. **Prefix sums transform O(k²) operations into O(1)**: For problems involving sums of rectangular regions, building a prefix sum matrix upfront allows you to calculate any rectangular sum in constant time.

2. **Binary search on the answer space**: When you're looking for a maximum or minimum value and the feasibility function is monotonic (if X works, then anything ≤ X also works), binary search can dramatically reduce the search space from O(n) to O(log n).

3. **Think about dimension reduction**: This problem combines 1D prefix sum concepts with 2D arrays. Many 2D problems can be solved by extending techniques from their 1D counterparts.

[Practice this problem on CodeJeet](/problem/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold)
