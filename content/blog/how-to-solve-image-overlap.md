---
title: "How to Solve Image Overlap — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Image Overlap. Medium difficulty, 64.0% acceptance rate. Topics: Array, Matrix."
date: "2027-05-15"
category: "dsa-patterns"
tags: ["image-overlap", "array", "matrix", "medium"]
---

# How to Solve Image Overlap

You're given two binary square matrices (images) and need to find the maximum possible overlap after translating one image in any direction. The challenge is that you can shift the entire matrix left/right/up/down, and you need to count how many `1`s align between the two images in each possible shifted position. What makes this tricky is efficiently exploring all possible translations without brute-force checking every pixel alignment for every shift, which would be too slow for larger matrices.

## Visual Walkthrough

Let's build intuition with a concrete example:

```
img1 = [[1,1,0],
        [0,1,0],
        [0,1,0]]

img2 = [[0,0,0],
        [0,1,1],
        [0,0,1]]
```

We want to slide `img1` over `img2` and count aligned `1`s. Consider shifting `img1` down by 1 row and right by 1 column:

```
img1 shifted down 1, right 1:
[0,0,0]
[0,1,1]
[0,0,1]

img2 (original):
[0,0,0]
[0,1,1]
[0,0,1]

Aligned 1s: 3 (all three 1s match)
```

But how do we systematically check all possible shifts? A shift can be represented by `(dx, dy)` where:

- `dx` = horizontal shift (negative = left, positive = right)
- `dy` = vertical shift (negative = up, positive = down)

For `n x n` matrices, valid shifts range from `-(n-1)` to `(n-1)` in both directions. That's `(2n-1) × (2n-1) = O(n²)` possible shifts.

## Brute Force Approach

The most straightforward approach is to try every possible shift and count the overlapping `1`s:

1. For each possible `dx` from `-(n-1)` to `(n-1)`
2. For each possible `dy` from `-(n-1)` to `(n-1)`
3. For each cell `(i, j)` in `img1`
4. Calculate the corresponding position in `img2`: `(i + dy, j + dx)`
5. If both positions are within bounds and both have `1`s, increment the count
6. Track the maximum count across all shifts

This approach has a major problem: for each of the `O(n²)` shifts, we check `O(n²)` cells, giving us `O(n⁴)` time complexity. For `n = 30`, that's `30⁴ = 810,000` operations, which might be acceptable, but for `n = 100`, it's `100⁴ = 100,000,000` operations - too slow.

## Optimized Approach

The key insight is that we don't need to check every cell for every shift. Instead, we can:

1. Record the positions of all `1`s in both images
2. For each pair of `1`s (one from `img1`, one from `img2`), calculate the vector (shift) needed to align them
3. Count how many `1` pairs produce the same shift vector
4. The shift with the highest count gives us the maximum overlap

Why does this work? If two `1`s from different images align after a shift `(dx, dy)`, then the relative position between them is exactly `(dx, dy)`. By counting how many `1` pairs have the same relative position, we're effectively counting how many `1`s would align if we applied that shift.

This transforms the problem from checking `O(n⁴)` alignments to:

- Finding `O(k²)` pairs where `k` is the number of `1`s (worst case `O(n⁴)` if all cells are `1`s, but typically much less)
- Using a hash map to count shift frequencies

## Optimal Solution

The optimal solution uses the vector counting approach. Here's the step-by-step reasoning:

1. **Collect positions of 1s**: First, we find all coordinates where `img1` and `img2` have `1`s.
2. **Calculate shift vectors**: For each `1` in `img1` and each `1` in `img2`, compute `(dx, dy) = (j2 - j1, i2 - i1)` where `(i1, j1)` is from `img1` and `(i2, j2)` is from `img2`.
3. **Count frequency**: Use a hash map to count how many pairs produce each shift vector.
4. **Find maximum**: The shift with the highest count is our maximum overlap.

<div class="code-group">

```python
# Time: O(n^4) worst case, but O(k^2) where k = number of 1s | Space: O(n^2)
def largestOverlap(img1, img2):
    """
    Find maximum overlap between two binary matrices after translation.

    Args:
        img1: List[List[int]] - first binary matrix
        img2: List[List[int]] - second binary matrix

    Returns:
        int - maximum number of overlapping 1s
    """
    n = len(img1)

    # Step 1: Collect positions of all 1s in both images
    ones1 = []
    ones2 = []

    for i in range(n):
        for j in range(n):
            if img1[i][j] == 1:
                ones1.append((i, j))
            if img2[i][j] == 1:
                ones2.append((i, j))

    # Step 2: Use dictionary to count shift vectors
    shift_counts = {}
    max_overlap = 0

    # Step 3: For each pair of 1s, calculate the shift vector
    for i1, j1 in ones1:
        for i2, j2 in ones2:
            # Calculate shift needed to align (i1, j1) with (i2, j2)
            dx = j2 - j1  # horizontal shift
            dy = i2 - i1  # vertical shift

            # Create a unique key for this shift vector
            shift = (dx, dy)

            # Increment count for this shift
            shift_counts[shift] = shift_counts.get(shift, 0) + 1

            # Update maximum overlap
            max_overlap = max(max_overlap, shift_counts[shift])

    return max_overlap
```

```javascript
// Time: O(n^4) worst case, but O(k^2) where k = number of 1s | Space: O(n^2)
function largestOverlap(img1, img2) {
  /**
   * Find maximum overlap between two binary matrices after translation.
   *
   * @param {number[][]} img1 - first binary matrix
   * @param {number[][]} img2 - second binary matrix
   * @return {number} - maximum number of overlapping 1s
   */
  const n = img1.length;

  // Step 1: Collect positions of all 1s in both images
  const ones1 = [];
  const ones2 = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (img1[i][j] === 1) {
        ones1.push([i, j]);
      }
      if (img2[i][j] === 1) {
        ones2.push([i, j]);
      }
    }
  }

  // Step 2: Use map to count shift vectors
  const shiftCounts = new Map();
  let maxOverlap = 0;

  // Step 3: For each pair of 1s, calculate the shift vector
  for (const [i1, j1] of ones1) {
    for (const [i2, j2] of ones2) {
      // Calculate shift needed to align (i1, j1) with (i2, j2)
      const dx = j2 - j1; // horizontal shift
      const dy = i2 - i1; // vertical shift

      // Create a unique key for this shift vector
      const shiftKey = `${dx},${dy}`;

      // Increment count for this shift
      const currentCount = shiftCounts.get(shiftKey) || 0;
      const newCount = currentCount + 1;
      shiftCounts.set(shiftKey, newCount);

      // Update maximum overlap
      maxOverlap = Math.max(maxOverlap, newCount);
    }
  }

  return maxOverlap;
}
```

```java
// Time: O(n^4) worst case, but O(k^2) where k = number of 1s | Space: O(n^2)
import java.util.*;

class Solution {
    public int largestOverlap(int[][] img1, int[][] img2) {
        /**
         * Find maximum overlap between two binary matrices after translation.
         *
         * @param img1 - first binary matrix
         * @param img2 - second binary matrix
         * @return maximum number of overlapping 1s
         */
        int n = img1.length;

        // Step 1: Collect positions of all 1s in both images
        List<int[]> ones1 = new ArrayList<>();
        List<int[]> ones2 = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (img1[i][j] == 1) {
                    ones1.add(new int[]{i, j});
                }
                if (img2[i][j] == 1) {
                    ones2.add(new int[]{i, j});
                }
            }
        }

        // Step 2: Use map to count shift vectors
        Map<String, Integer> shiftCounts = new HashMap<>();
        int maxOverlap = 0;

        // Step 3: For each pair of 1s, calculate the shift vector
        for (int[] pos1 : ones1) {
            int i1 = pos1[0], j1 = pos1[1];

            for (int[] pos2 : ones2) {
                int i2 = pos2[0], j2 = pos2[1];

                // Calculate shift needed to align (i1, j1) with (i2, j2)
                int dx = j2 - j1;  // horizontal shift
                int dy = i2 - i1;  // vertical shift

                // Create a unique key for this shift vector
                String shiftKey = dx + "," + dy;

                // Increment count for this shift
                int count = shiftCounts.getOrDefault(shiftKey, 0) + 1;
                shiftCounts.put(shiftKey, count);

                // Update maximum overlap
                maxOverlap = Math.max(maxOverlap, count);
            }
        }

        return maxOverlap;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- Worst case: `O(n⁴)` when both matrices are all `1`s, because we have `n²` ones in each image, creating `n² × n² = n⁴` pairs.
- Typical case: `O(k²)` where `k` is the number of `1`s in the images. Since `k ≤ n²`, this is often much better than the brute force `O(n⁴)`.
- In practice, binary images are sparse (few `1`s), so this is efficient.

**Space Complexity**:

- `O(n²)` to store the positions of `1`s in worst case (all cells are `1`).
- `O(k²)` for the hash map in worst case, but typically much less since many pairs will produce the same shift vectors.

## Common Mistakes

1. **Incorrect shift bounds**: Candidates might try shifts from `-n` to `n` instead of `-(n-1)` to `(n-1)`. Remember, you can't shift so much that no cells overlap at all.

2. **Forgetting to handle empty images**: If either image has no `1`s, the maximum overlap is 0. The code handles this naturally since the loops won't execute.

3. **Using wrong coordinate order**: Mixing up `(row, col)` vs `(col, row)` when calculating shifts. Always be consistent: `(i, j)` where `i` is row (vertical) and `j` is column (horizontal).

4. **Not considering negative shifts**: Shifts can be negative (left/up), so using an array instead of a hash map won't work without offset indexing.

## When You'll See This Pattern

This "vector counting" pattern appears in several problems where you need to find alignments or common transformations:

1. **Number of Boomerangs (LeetCode 447)**: Count pairs of points that are equidistant from a third point. Similar to counting distance vectors between points.

2. **Line Reflection (LeetCode 356)**: Find if points are symmetric about a line. Involves calculating transformed positions and checking for matches.

3. **Group Anagrams (LeetCode 49)**: While not about spatial vectors, it uses the same pattern of creating a signature (sorted string) to group related items.

The core idea is to transform each element into a "signature" or "key" that captures the relationship you care about, then use a hash map to count frequencies of these signatures.

## Key Takeaways

1. **Transform and conquer**: When checking all pairwise alignments is expensive, transform the problem into counting signature frequencies. This often turns `O(n²)` pairwise checks into `O(n)` with hash maps.

2. **Sparse data optimization**: When working with sparse matrices (mostly zeros), store only the non-zero elements to avoid unnecessary iterations.

3. **Vector representation**: Spatial relationships can often be encoded as vectors (dx, dy), which serve as perfect hash keys for counting alignments.

[Practice this problem on CodeJeet](/problem/image-overlap)
