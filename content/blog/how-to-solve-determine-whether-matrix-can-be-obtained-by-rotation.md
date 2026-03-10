---
title: "How to Solve Determine Whether Matrix Can Be Obtained By Rotation — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Determine Whether Matrix Can Be Obtained By Rotation. Easy difficulty, 59.3% acceptance rate. Topics: Array, Matrix."
date: "2027-07-14"
category: "dsa-patterns"
tags: ["determine-whether-matrix-can-be-obtained-by-rotation", "array", "matrix", "easy"]
---

# How to Solve "Determine Whether Matrix Can Be Obtained By Rotation"

This problem asks us to check if we can transform one `n x n` binary matrix into another by rotating it 0°, 90°, 180°, or 270° clockwise. What makes this interesting is that we need to check multiple possible transformations efficiently, not just perform a single rotation. The challenge lies in implementing rotation correctly and avoiding unnecessary computations.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
mat = [[0,1],    target = [[1,0],
        [1,0]]             [0,1]]
```

We need to check if rotating `mat` can make it equal to `target`. Let's check all possible rotations:

1. **0° rotation (no change):**

   ```
   mat = [[0,1],
          [1,0]]
   ```

   Not equal to target.

2. **90° clockwise rotation:**
   - Element (0,0) = 0 moves to (0,1)
   - Element (0,1) = 1 moves to (1,1)
   - Element (1,0) = 1 moves to (0,0)
   - Element (1,1) = 0 moves to (1,0)
   ```
   Result: [[1,0],
            [0,1]]
   ```
   This matches `target` exactly! So we return `true`.

If we continued checking:

- **180° rotation** gives `[[0,1],[1,0]]` (same as original)
- **270° rotation** gives `[[1,0],[0,1]]` (same as 90° rotation for 2x2)

The key insight: we only need to check up to 3 rotations (90°, 180°, 270°) since 0° is just comparing the original matrices.

## Brute Force Approach

A naive approach would be to:

1. Generate all possible rotations of `mat`
2. Compare each rotated version with `target`
3. Return `true` if any match, `false` otherwise

The problem with this approach isn't efficiency (it's actually optimal in time complexity), but implementation complexity. A truly naive implementation might:

- Create separate functions for 90°, 180°, and 270° rotations
- Hardcode rotation logic without recognizing the pattern
- Compare matrices after each rotation without early termination

While this would work, it's error-prone and doesn't demonstrate understanding of the mathematical relationship between rotations. The "brute force" here is more about implementation approach than algorithmic complexity.

## Optimal Solution

The optimal solution rotates the matrix up to 3 times and checks for equality after each rotation. We can implement a single `rotate90` function and apply it repeatedly. The mathematical relationship for 90° clockwise rotation is: `new_matrix[i][j] = old_matrix[n-1-j][i]`.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²) for the rotated matrix copy
def findRotation(mat, target):
    """
    Check if mat can be rotated to match target.
    We check 0°, 90°, 180°, and 270° clockwise rotations.
    """
    n = len(mat)

    # Helper function to rotate a matrix 90° clockwise
    def rotate90(matrix):
        """Return a new matrix rotated 90° clockwise."""
        rotated = [[0] * n for _ in range(n)]
        for i in range(n):
            for j in range(n):
                # Key rotation formula: element at (i,j) comes from (n-1-j,i)
                rotated[i][j] = matrix[n - 1 - j][i]
        return rotated

    # Check all 4 possible rotations (0°, 90°, 180°, 270°)
    current = mat
    for _ in range(4):  # 0°, 90°, 180°, 270°
        if current == target:
            return True
        # Rotate for next check
        current = rotate90(current)

    return False
```

```javascript
// Time: O(n²) | Space: O(n²) for the rotated matrix copy
function findRotation(mat, target) {
  const n = mat.length;

  // Helper function to rotate a matrix 90° clockwise
  function rotate90(matrix) {
    const rotated = Array(n)
      .fill()
      .map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        // Key rotation formula: element at (i,j) comes from (n-1-j,i)
        rotated[i][j] = matrix[n - 1 - j][i];
      }
    }
    return rotated;
  }

  // Check all 4 possible rotations (0°, 90°, 180°, 270°)
  let current = mat;
  for (let rotation = 0; rotation < 4; rotation++) {
    // Check if current rotation matches target
    let match = true;
    for (let i = 0; i < n && match; i++) {
      for (let j = 0; j < n && match; j++) {
        if (current[i][j] !== target[i][j]) {
          match = false;
        }
      }
    }
    if (match) return true;

    // Rotate for next check
    current = rotate90(current);
  }

  return false;
}
```

```java
// Time: O(n²) | Space: O(n²) for the rotated matrix copy
class Solution {
    public boolean findRotation(int[][] mat, int[][] target) {
        int n = mat.length;

        // Check all 4 possible rotations (0°, 90°, 180°, 270°)
        int[][] current = mat;
        for (int rotation = 0; rotation < 4; rotation++) {
            if (matricesEqual(current, target)) {
                return true;
            }
            current = rotate90(current);
        }

        return false;
    }

    // Helper function to rotate a matrix 90° clockwise
    private int[][] rotate90(int[][] matrix) {
        int n = matrix.length;
        int[][] rotated = new int[n][n];

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                // Key rotation formula: element at (i,j) comes from (n-1-j,i)
                rotated[i][j] = matrix[n - 1 - j][i];
            }
        }

        return rotated;
    }

    // Helper function to compare two matrices
    private boolean matricesEqual(int[][] a, int[][] b) {
        int n = a.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (a[i][j] != b[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
}
```

</div>

**Key implementation details:**

1. **Rotation formula**: `rotated[i][j] = matrix[n-1-j][i]` is the core of the solution. This comes from observing that after 90° clockwise rotation:
   - Row `i` in the new matrix comes from column `i` in the old matrix
   - Column `j` in the new matrix comes from row `n-1-j` in the old matrix

2. **Early termination**: We return `true` as soon as we find a match, avoiding unnecessary rotations.

3. **Four rotations maximum**: We check 0°, 90°, 180°, and 270° rotations. After 360°, we're back to the original orientation.

## Complexity Analysis

**Time Complexity: O(n²)**

- We perform up to 4 rotations
- Each rotation requires visiting all n² elements: O(n²)
- Each comparison requires visiting all n² elements: O(n²)
- Total: O(4 \* n²) = O(n²)

**Space Complexity: O(n²)**

- We create a new n x n matrix for each rotation
- In the worst case (no match), we create 3 rotated matrices
- Each matrix requires O(n²) space
- Total: O(n²) (not O(3n²) since we can garbage collect previous rotations)

**Optimization note**: We could reduce space to O(1) by rotating in-place and then rotating back, but this adds complexity and the O(n²) space is acceptable for an "Easy" problem.

## Common Mistakes

1. **Incorrect rotation formula**: The most common error is getting the indices wrong. Candidates often write `rotated[i][j] = matrix[j][i]` (transpose) or `rotated[i][j] = matrix[j][n-1-i]` (90° counter-clockwise). Always test with a small example.

2. **Forgetting to check 0° rotation**: Some candidates only check 90°, 180°, and 270° rotations, forgetting that the matrices might already be equal without any rotation.

3. **Modifying the original matrix**: If you rotate in-place, you lose the original matrix for future comparisons. Always either:
   - Work on a copy
   - Rotate back after checking
   - Create new matrices for each rotation

4. **Inefficient comparison**: Comparing matrices element-by-element with early exit (as shown in JavaScript) is more efficient than using `==` on arrays (which compares references, not contents in some languages).

## When You'll See This Pattern

This matrix rotation pattern appears in several common interview problems:

1. **Rotate Image (LeetCode 48)**: The exact same rotation logic is used, but you rotate the matrix in-place instead of checking equality.

2. **Spiral Matrix (LeetCode 54)**: While not about rotation per se, it requires similar index manipulation skills to traverse matrices in different directions.

3. **Toeplitz Matrix (LeetCode 766)**: Checks matrix properties along diagonals, which requires understanding how indices relate to matrix structure.

The core skill here is **mapping between coordinate systems** - understanding how positions transform under operations like rotation, reflection, or translation.

## Key Takeaways

1. **90° clockwise rotation formula**: `new[i][j] = old[n-1-j][i]`. Memorize this or understand how to derive it by tracing elements through a small example.

2. **Check all possibilities systematically**: When a problem asks about transformations (rotations, reflections), check all possible transformations up to symmetry. For rotation, that's 0°, 90°, 180°, and 270°.

3. **Matrix problems often have O(n²) solutions**: When you need to examine or transform every element in an n x n matrix, O(n²) is usually optimal since there are n² elements.

Related problems: [Rotate Image](/problem/rotate-image)
