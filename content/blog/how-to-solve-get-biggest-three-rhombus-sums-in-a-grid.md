---
title: "How to Solve Get Biggest Three Rhombus Sums in a Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Get Biggest Three Rhombus Sums in a Grid. Medium difficulty, 50.1% acceptance rate. Topics: Array, Math, Sorting, Heap (Priority Queue), Matrix."
date: "2029-11-02"
category: "dsa-patterns"
tags: ["get-biggest-three-rhombus-sums-in-a-grid", "array", "math", "sorting", "medium"]
---

# How to Solve Get Biggest Three Rhombus Sums in a Grid

This problem asks us to find the three largest distinct sums formed by the borders of rhombus shapes within a grid. A rhombus here is defined as a square rotated 45 degrees, with its corners centered on grid cells. The tricky part is efficiently enumerating all possible rhombus sizes at all possible center positions while calculating only their border sums (not the interior), then tracking the top three distinct values.

What makes this interesting: you need to visualize the geometric constraints, handle multiple sizes efficiently, and maintain a small collection of top values without sorting everything. It's a matrix traversal problem with a twist on neighborhood aggregation.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider this 3×3 grid:

```
1 2 3
4 5 6
7 8 9
```

A rhombus of size 1 is just a single cell - its border sum is just that cell's value. At position (1,1) (0-indexed), size 1 rhombus sum = 5.

A rhombus of size 2 has corners that form a diamond shape. For a rhombus centered at (1,1) with size 2:

- Top corner: (1,1) - up 0, left 0 = value 5
- Right corner: (1,1) - up 1, right 1 = position (0,2) = value 3
- Bottom corner: (1,1) - down 1, left 0 = position (2,1) = value 8
- Left corner: (1,1) - down 0, left 1 = position (1,0) = value 4
- Border sum = 5 + 3 + 8 + 4 = 20

But wait - we also need the edges between corners! For size 2, the edges have intermediate points:

- Top to right edge: (1,1) - up 0, right 1 = position (1,2) = value 6
- Right to bottom: (1,1) - down 1, right 0 = position (2,2) = value 9
- Bottom to left: (1,1) - down 0, left 1 = position (1,0) = value 4 (already counted as corner)
- Left to top: (1,1) - up 1, left 0 = position (0,1) = value 2

Actually, let's think systematically. For a rhombus centered at (r,c) with size k:

- It extends k-1 cells in each diagonal direction
- The border includes all cells where max(|dr|, |dc|) = k-1, where dr and dc are offsets from center
- More practically: we can trace the four edges separately

For the example above with center (1,1), size 2:

- Top to right edge: positions (1,2), (0,3) - but (0,3) is out of bounds
- This reveals the constraint: rhombus must stay within grid boundaries

The key insight: a rhombus of size k centered at (r,c) is valid if:

- r - (k-1) ≥ 0 (top corner within grid)
- r + (k-1) < m (bottom corner within grid)
- c - (k-1) ≥ 0 (left corner within grid)
- c + (k-1) < n (right corner within grid)

## Brute Force Approach

A naive approach would:

1. For every cell (r,c) as potential rhombus center
2. For every possible size k starting from 1 up to the maximum that fits
3. Calculate the border sum by iterating through all border positions
4. Collect all sums, sort, deduplicate, and take top 3

The border calculation for size k requires visiting O(k) cells (since border length grows linearly with k). With m×n grid and maximum size ≈ min(m,n), this gives O(m × n × min(m,n)²) time complexity - too slow for constraints where m,n ≤ 50 (worst-case ~50⁴ = 6.25M operations, which might be borderline but the O(k) border calculation per rhombus makes it O(m×n×min(m,n)³) actually).

The real issue: recalculating border sums from scratch for each rhombus is wasteful. When we increase rhombus size by 1, most of the border cells are the same except for the new outer layer.

## Optimized Approach

The key optimization: calculate border sums incrementally using prefix sums or by building from smaller rhombuses.

Think of a rhombus of size k as consisting of:

- The rhombus of size k-1 (one layer inward)
- Plus the new outer border

But we only want border sums, not full rhombus sums. Actually, for border sums:

- Border of size k = Border of size k-1 + (new outer corners and edges) - (inner layer that's no longer part of border)

Wait, that's getting complicated. Better approach: calculate each border directly but efficiently.

Observation: The border consists of 4 directional arms. For a rhombus centered at (r,c) with size k:

- Top to right arm: cells (r-i, c+i) for i=0 to k-1
- Right to bottom arm: cells (r+i, c+(k-1)-i) for i=0 to k-1
- Bottom to left arm: cells (r+(k-1)-i, c-i) for i=0 to k-1
- Left to top arm: cells (r-i, c-(k-1)+i) for i=0 to k-1

But this double-counts corners! Each corner appears in two arms.

Cleaner: Trace the border in order, avoiding duplicates:

1. Start at top corner (r-(k-1), c)
2. Move down-right to right corner (r, c+(k-1))
3. Move down-left to bottom corner (r+(k-1), c)
4. Move up-left to left corner (r, c-(k-1))
5. Move up-right back to top corner

Each step moves one cell along the border.

Even better insight: We can calculate border sum as:

- Sum of all cells in rhombus of size k
- Minus sum of all cells in rhombus of size k-1 (the interior)
- Plus the center cell (which gets subtracted twice)

But calculating full rhombus sums efficiently requires precomputing diagonal prefix sums.

Actually, the most straightforward efficient approach:

1. For each possible center (r,c)
2. For each possible size k starting from 1
3. If rhombus fits in grid, calculate its border sum by summing the four arms
4. Use a min-heap (priority queue) of size 3 to track top 3 distinct sums

The arm summing is O(k) per rhombus, but k ≤ min(m,n)/2, and with careful implementation this is acceptable for m,n ≤ 50.

## Optimal Solution

We'll implement the direct border calculation approach with a min-heap to track top 3 distinct sums. The algorithm:

1. Initialize a min-heap (priority queue) to track largest sums
2. For each cell as potential rhombus center
3. For each possible rhombus size
4. Check if rhombus fits in grid boundaries
5. Calculate border sum by tracing four edges
6. Add to heap if it's distinct and larger than current minimum
7. Extract and return top 3 from heap in descending order

<div class="code-group">

```python
# Time: O(m * n * min(m,n) * min(m,n)) = O(m * n * min(m,n)^2)
# Space: O(1) excluding output, O(k) for heap where k=3
def getBiggestThree(grid):
    m, n = len(grid), len(grid[0])
    # Min-heap to store top 3 distinct sums
    # We'll maintain it as min-heap but want max values,
    # so we store negatives or use min-heap with smallest at top
    heap = []

    # Helper to add value to top-3 heap
    def addToHeap(value):
        nonlocal heap
        if value in heap:  # Skip duplicates
            return
        if len(heap) < 3:
            heap.append(value)
            heap.sort()  # Keep sorted, smallest first
        elif value > heap[0]:  # Larger than smallest in top 3
            heap[0] = value
            heap.sort()

    # For each possible center
    for r in range(m):
        for c in range(n):
            # Rhombus size 1 is just the cell itself
            addToHeap(grid[r][c])

            # Try larger rhombus sizes
            # Maximum size limited by distance to edges
            maxSize = min(r + 1, m - r, c + 1, n - c)

            for size in range(2, maxSize + 1):
                # Calculate border sum for rhombus of this size
                border_sum = 0

                # Trace the border in four directions
                # Top to right edge (excluding final corner to avoid double count)
                for i in range(size - 1):
                    border_sum += grid[r - (size - 1) + i][c + i]

                # Right to bottom edge
                for i in range(size - 1):
                    border_sum += grid[r + i][c + (size - 1) - i]

                # Bottom to left edge
                for i in range(size - 1):
                    border_sum += grid[r + (size - 1) - i][c - i]

                # Left to top edge
                for i in range(size - 1):
                    border_sum += grid[r - i][c - (size - 1) + i]

                addToHeap(border_sum)

    # Return in descending order
    result = sorted(heap, reverse=True)
    return result
```

```javascript
// Time: O(m * n * min(m,n)^2) | Space: O(1) excluding output
function getBiggestThree(grid) {
  const m = grid.length,
    n = grid[0].length;
  // Use a Set to track top 3 distinct values
  // We'll maintain it as array of at most 3 elements, sorted ascending
  let topThree = new Set();

  // Helper to add value to top three
  function addToTopThree(value) {
    // Skip if already in set
    if (topThree.has(value)) return;

    // Add to set
    topThree.add(value);

    // If we have more than 3, remove the smallest
    if (topThree.size > 3) {
      const sorted = Array.from(topThree).sort((a, b) => a - b);
      topThree.delete(sorted[0]); // Remove smallest
    }
  }

  // For each possible center
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      // Size 1 rhombus (single cell)
      addToTopThree(grid[r][c]);

      // Calculate maximum possible rhombus size
      const maxSize = Math.min(r + 1, m - r, c + 1, n - c);

      // Try larger rhombus sizes
      for (let size = 2; size <= maxSize; size++) {
        let borderSum = 0;

        // Top to right edge
        for (let i = 0; i < size - 1; i++) {
          borderSum += grid[r - (size - 1) + i][c + i];
        }

        // Right to bottom edge
        for (let i = 0; i < size - 1; i++) {
          borderSum += grid[r + i][c + (size - 1) - i];
        }

        // Bottom to left edge
        for (let i = 0; i < size - 1; i++) {
          borderSum += grid[r + (size - 1) - i][c - i];
        }

        // Left to top edge
        for (let i = 0; i < size - 1; i++) {
          borderSum += grid[r - i][c - (size - 1) + i];
        }

        addToTopThree(borderSum);
      }
    }
  }

  // Convert to array, sort descending, and return
  return Array.from(topThree).sort((a, b) => b - a);
}
```

```java
// Time: O(m * n * min(m,n)^2) | Space: O(1) excluding output
import java.util.*;

class Solution {
    public int[] getBiggestThree(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        // Use TreeSet to maintain top 3 (sorted, no duplicates)
        // We'll keep it in ascending order and maintain size <= 3
        TreeSet<Integer> topThree = new TreeSet<>();

        // Helper to add value to top three
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                // Size 1 rhombus
                addToSet(topThree, grid[r][c]);

                // Maximum possible rhombus size for this center
                int maxSize = Math.min(Math.min(r + 1, m - r),
                                      Math.min(c + 1, n - c));

                // Try larger rhombus sizes
                for (int size = 2; size <= maxSize; size++) {
                    int borderSum = 0;

                    // Top to right edge
                    for (int i = 0; i < size - 1; i++) {
                        borderSum += grid[r - (size - 1) + i][c + i];
                    }

                    // Right to bottom edge
                    for (int i = 0; i < size - 1; i++) {
                        borderSum += grid[r + i][c + (size - 1) - i];
                    }

                    // Bottom to left edge
                    for (int i = 0; i < size - 1; i++) {
                        borderSum += grid[r + (size - 1) - i][c - i];
                    }

                    // Left to top edge
                    for (int i = 0; i < size - 1; i++) {
                        borderSum += grid[r - i][c - (size - 1) + i];
                    }

                    addToSet(topThree, borderSum);
                }
            }
        }

        // Convert to array in descending order
        int[] result = new int[topThree.size()];
        int idx = topThree.size() - 1;
        for (int num : topThree) {
            result[idx--] = num;
        }
        return result;
    }

    private void addToSet(TreeSet<Integer> set, int value) {
        set.add(value);
        if (set.size() > 3) {
            set.remove(set.first()); // Remove smallest
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × K²) where K = min(m,n)

- We iterate through all m×n cells as potential centers
- For each center, we try up to K possible rhombus sizes
- For each rhombus size k, we calculate border sum in O(k) time by tracing edges
- In worst case, k ranges from 1 to K, so total work per center is Σk=1..K O(k) = O(K²)
- Overall: O(m × n × K²)

For m,n ≤ 50, K ≤ 25, worst-case operations ≈ 50×50×25² = 1.56M, which is acceptable.

**Space Complexity:** O(1) excluding output

- We only store a constant amount of extra data: the top 3 sums (O(1))
- No additional data structures scaling with input size
- If counting output, it's O(1) since we return at most 3 values

## Common Mistakes

1. **Incorrect border calculation (double-counting corners):** When tracing the four edges, if you include all cells in each edge including the endpoints, corners get counted twice. Solution: trace each edge excluding the final corner, or use a visited set.

2. **Missing size 1 rhombuses:** Candidates sometimes start from size 2, forgetting that a single cell is a valid rhombus of size 1. Always include the base case.

3. **Not checking rhombus bounds properly:** A rhombus of size k centered at (r,c) requires k-1 cells in each diagonal direction. The checks should be: r-(k-1)≥0, r+(k-1)<m, c-(k-1)≥0, c+(k-1)<n. A common error is using k instead of k-1.

4. **Inefficient top-3 tracking:** Sorting all sums then taking top 3 is O(S log S) where S is number of sums (could be thousands). Better: maintain a min-heap of size 3 or a sorted set of size 3 for O(S log 3) = O(S) time.

## When You'll See This Pattern

This problem combines several patterns:

1. **Matrix traversal with geometric constraints** - Similar to problems like "Count Square Submatrices with All Ones" or "Largest Plus Sign"
2. **Maintaining top K elements** - Like "Kth Largest Element in a Stream" or "Top K Frequent Elements"
3. **Border/contour tracing** - Seen in "Spiral Matrix" or "Island Perimeter"

Specific related problems:

- **Count Fertile Pyramids in a Land (Hard)** - Also involves checking geometric shapes in grids, though with different constraints
- **Matrix Block Sum (Medium)** - Uses similar idea of summing regions but with rectangles instead of rhombuses
- **Max Sum of Rectangle No Larger Than K (Hard)** - Different but involves optimizing sums over subregions

## Key Takeaways

1. **Geometric constraints in grids** can often be handled by parameterizing shapes with a center and size, then checking boundary conditions systematically.

2. **When you need top K elements**, maintain a min-heap of size K (for largest) or max-heap (for smallest) to avoid sorting all elements.

3. **Border vs interior calculations** - For hollow shapes, calculate border directly rather than full shape minus interior unless you have efficient prefix sums.

4. **Always test small cases** - With geometric problems, work through a 3×3 example by hand to verify your indexing logic.

Related problems: [Count Fertile Pyramids in a Land](/problem/count-fertile-pyramids-in-a-land)
