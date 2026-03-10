---
title: "How to Solve Count Covered Buildings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Covered Buildings. Medium difficulty, 58.8% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2027-05-27"
category: "dsa-patterns"
tags: ["count-covered-buildings", "array", "hash-table", "sorting", "medium"]
---

# How to Solve Count Covered Buildings

You're given an `n x n` city grid and a list of building coordinates. A building is "covered" if there's at least one building in all four cardinal directions (north, south, east, west). The challenge is to count how many buildings meet this condition. What makes this problem interesting is that we need to efficiently check four different directions for each building without resorting to slow pairwise comparisons.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
n = 5
buildings = [[1,1], [1,3], [2,2], [3,1], [3,3]]
```

**Step-by-step reasoning:**

1. **Building at [1,1]**:
   - Left (x < 1): No building with x=0
   - Right (x > 1): Check x=2,3,4 at y=1 → No building
   - Down (y < 1): No building with y=0
   - Up (y > 1): Check y=2,3,4 at x=1 → Building at [1,3] ✓
   - **NOT COVERED** (missing left, right, down)

2. **Building at [1,3]**:
   - Left (x < 1): No building with x=0
   - Right (x > 1): Check x=2,3,4 at y=3 → Building at [3,3] ✓
   - Down (y < 3): Check y=2,1,0 at x=1 → Building at [1,1] ✓
   - Up (y > 3): Check y=4 at x=1 → No building
   - **NOT COVERED** (missing left, up)

3. **Building at [2,2]**:
   - Left (x < 2): Check x=1 at y=2 → No building
   - Right (x > 2): Check x=3,4 at y=2 → No building
   - Down (y < 2): Check y=1,0 at x=2 → No building
   - Up (y > 2): Check y=3,4 at x=2 → No building
   - **NOT COVERED** (missing all directions)

4. **Building at [3,1]**:
   - Left (x < 3): Check x=2,1,0 at y=1 → Building at [1,1] ✓
   - Right (x > 3): Check x=4 at y=1 → No building
   - Down (y < 1): No building with y=0
   - Up (y > 1): Check y=2,3,4 at x=3 → Building at [3,3] ✓
   - **NOT COVERED** (missing right, down)

5. **Building at [3,3]**:
   - Left (x < 3): Check x=2,1,0 at y=3 → Building at [1,3] ✓
   - Right (x > 3): Check x=4 at y=3 → No building
   - Down (y < 3): Check y=2,1,0 at x=3 → Building at [3,1] ✓
   - Up (y > 3): Check y=4 at x=3 → No building
   - **NOT COVERED** (missing right, up)

**Result:** 0 covered buildings

The key insight: For a building to be covered, we need to find the closest building in each direction, not just any building. This suggests we should organize buildings by rows and columns.

## Brute Force Approach

The most straightforward approach is to check every building against every other building:

For each building `[x, y]`:

1. Initialize four flags: `hasLeft`, `hasRight`, `hasDown`, `hasUp` = false
2. For every other building `[x2, y2]`:
   - If `y2 == y` (same row):
     - If `x2 < x`: `hasLeft = true`
     - If `x2 > x`: `hasRight = true`
   - If `x2 == x` (same column):
     - If `y2 < y`: `hasDown = true`
     - If `y2 > y`: `hasUp = true`
3. If all four flags are true, increment count

**Why this is inefficient:**

- Time complexity: O(m²) where m = number of buildings
- For m up to 10⁵ (common constraint), this becomes 10¹⁰ operations → too slow
- We're doing redundant checks and not leveraging any structure

## Optimized Approach

The key insight is that we don't need to compare every pair of buildings. Instead, we can organize buildings by their rows and columns:

1. **Group by rows**: For each row (y-coordinate), collect all x-coordinates of buildings in that row, then sort them.
2. **Group by columns**: For each column (x-coordinate), collect all y-coordinates of buildings in that column, then sort them.

Now, for each building `[x, y]`:

- **Left check**: Look in the sorted list for row `y`. If `x` is not the smallest element, there's a building to the left.
- **Right check**: If `x` is not the largest element in row `y`, there's a building to the right.
- **Down check**: Look in the sorted list for column `x`. If `y` is not the smallest element, there's a building below.
- **Up check**: If `y` is not the largest element in column `x`, there's a building above.

We can use binary search to efficiently check if a building has neighbors in each direction, but since we just need to know if there's ANY building in that direction (not the closest one), we can simply check if the current coordinate is at the boundary of the sorted list.

## Optimal Solution

Here's the complete implementation using hash maps to group buildings by rows and columns:

<div class="code-group">

```python
# Time: O(m log m) where m = number of buildings
# Space: O(m) for storing buildings grouped by rows and columns
def countCoveredBuildings(n, buildings):
    """
    Counts how many buildings have at least one building in all four directions.

    Args:
        n: Size of the city grid (n x n)
        buildings: List of [x, y] coordinates of buildings

    Returns:
        Number of covered buildings
    """
    from collections import defaultdict

    # Step 1: Group buildings by their rows (y-coordinate)
    # Each row will store a sorted list of x-coordinates in that row
    rows = defaultdict(list)

    # Step 2: Group buildings by their columns (x-coordinate)
    # Each column will store a sorted list of y-coordinates in that column
    cols = defaultdict(list)

    # Step 3: Populate the row and column maps
    for x, y in buildings:
        rows[y].append(x)
        cols[x].append(y)

    # Step 4: Sort all lists for efficient boundary checking
    # Sorting allows us to check if a building is at the boundary of its row/column
    for y in rows:
        rows[y].sort()

    for x in cols:
        cols[x].sort()

    # Step 5: Count covered buildings
    covered_count = 0

    for x, y in buildings:
        # Get the sorted lists for this building's row and column
        row_buildings = rows[y]
        col_buildings = cols[x]

        # Step 6: Check all four directions
        # For left: check if x is not the minimum x in this row
        has_left = row_buildings[0] < x

        # For right: check if x is not the maximum x in this row
        has_right = row_buildings[-1] > x

        # For down: check if y is not the minimum y in this column
        has_down = col_buildings[0] < y

        # For up: check if y is not the maximum y in this column
        has_up = col_buildings[-1] > y

        # Step 7: If all four directions have buildings, increment count
        if has_left and has_right and has_down and has_up:
            covered_count += 1

    return covered_count
```

```javascript
// Time: O(m log m) where m = number of buildings
// Space: O(m) for storing buildings grouped by rows and columns
function countCoveredBuildings(n, buildings) {
  /**
   * Counts how many buildings have at least one building in all four directions.
   *
   * @param {number} n - Size of the city grid (n x n)
   * @param {number[][]} buildings - Array of [x, y] coordinates of buildings
   * @return {number} - Number of covered buildings
   */

  // Step 1: Create maps to group buildings by rows and columns
  const rows = new Map(); // key: y-coordinate, value: array of x-coordinates
  const cols = new Map(); // key: x-coordinate, value: array of y-coordinates

  // Step 2: Populate the row and column maps
  for (const [x, y] of buildings) {
    // Add to row map
    if (!rows.has(y)) {
      rows.set(y, []);
    }
    rows.get(y).push(x);

    // Add to column map
    if (!cols.has(x)) {
      cols.set(x, []);
    }
    cols.get(x).push(y);
  }

  // Step 3: Sort all lists for efficient boundary checking
  // Sorting allows us to check if a building is at the boundary of its row/column
  for (const [y, xList] of rows) {
    xList.sort((a, b) => a - b);
  }

  for (const [x, yList] of cols) {
    yList.sort((a, b) => a - b);
  }

  // Step 4: Count covered buildings
  let coveredCount = 0;

  for (const [x, y] of buildings) {
    // Get the sorted lists for this building's row and column
    const rowBuildings = rows.get(y);
    const colBuildings = cols.get(x);

    // Step 5: Check all four directions
    // For left: check if x is not the minimum x in this row
    const hasLeft = rowBuildings[0] < x;

    // For right: check if x is not the maximum x in this row
    const hasRight = rowBuildings[rowBuildings.length - 1] > x;

    // For down: check if y is not the minimum y in this column
    const hasDown = colBuildings[0] < y;

    // For up: check if y is not the maximum y in this column
    const hasUp = colBuildings[colBuildings.length - 1] > y;

    // Step 6: If all four directions have buildings, increment count
    if (hasLeft && hasRight && hasDown && hasUp) {
      coveredCount++;
    }
  }

  return coveredCount;
}
```

```java
// Time: O(m log m) where m = number of buildings
// Space: O(m) for storing buildings grouped by rows and columns
import java.util.*;

class Solution {
    public int countCoveredBuildings(int n, int[][] buildings) {
        /**
         * Counts how many buildings have at least one building in all four directions.
         *
         * @param n - Size of the city grid (n x n)
         * @param buildings - Array of [x, y] coordinates of buildings
         * @return - Number of covered buildings
         */

        // Step 1: Create maps to group buildings by rows and columns
        // key: y-coordinate, value: list of x-coordinates in that row
        Map<Integer, List<Integer>> rows = new HashMap<>();

        // key: x-coordinate, value: list of y-coordinates in that column
        Map<Integer, List<Integer>> cols = new HashMap<>();

        // Step 2: Populate the row and column maps
        for (int[] building : buildings) {
            int x = building[0];
            int y = building[1];

            // Add to row map
            rows.computeIfAbsent(y, k -> new ArrayList<>()).add(x);

            // Add to column map
            cols.computeIfAbsent(x, k -> new ArrayList<>()).add(y);
        }

        // Step 3: Sort all lists for efficient boundary checking
        // Sorting allows us to check if a building is at the boundary of its row/column
        for (List<Integer> xList : rows.values()) {
            Collections.sort(xList);
        }

        for (List<Integer> yList : cols.values()) {
            Collections.sort(yList);
        }

        // Step 4: Count covered buildings
        int coveredCount = 0;

        for (int[] building : buildings) {
            int x = building[0];
            int y = building[1];

            // Get the sorted lists for this building's row and column
            List<Integer> rowBuildings = rows.get(y);
            List<Integer> colBuildings = cols.get(x);

            // Step 5: Check all four directions
            // For left: check if x is not the minimum x in this row
            boolean hasLeft = rowBuildings.get(0) < x;

            // For right: check if x is not the maximum x in this row
            boolean hasRight = rowBuildings.get(rowBuildings.size() - 1) > x;

            // For down: check if y is not the minimum y in this column
            boolean hasDown = colBuildings.get(0) < y;

            // For up: check if y is not the maximum y in this column
            boolean hasUp = colBuildings.get(colBuildings.size() - 1) > y;

            // Step 6: If all four directions have buildings, increment count
            if (hasLeft && hasRight && hasDown && hasUp) {
                coveredCount++;
            }
        }

        return coveredCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m log m)**

- Building the row and column maps: O(m) where m = number of buildings
- Sorting each row's x-coordinates: In total, we sort m elements across different lists. The total sorting cost is O(m log m) in the worst case when all buildings are in one row or column.
- Checking each building: O(1) per building, O(m) total
- Dominated by the sorting step: O(m log m)

**Space Complexity: O(m)**

- Row map stores all x-coordinates: O(m)
- Column map stores all y-coordinates: O(m)
- Total: O(m) additional space

## Common Mistakes

1. **Not handling empty rows/columns properly**: When a building is the only one in its row or column, it can't be covered. Make sure to check boundary conditions correctly.

2. **Using O(n²) space for the grid**: Some candidates try to create an n x n grid, which is inefficient when n is large (up to 10⁹) but buildings are sparse (m ≤ 10⁵). Always use hash maps for sparse data.

3. **Incorrect direction logic**: Mixing up x and y coordinates or confusing left/right with up/down. Remember: left/right = same y (row), up/down = same x (column).

4. **Forgetting to sort**: Without sorting, checking if a building is at the boundary requires scanning the entire list, making the solution O(m²) instead of O(m log m).

## When You'll See This Pattern

This problem uses **coordinate grouping and sorting** to optimize spatial queries. You'll see similar patterns in:

1. **LeetCode 149. Max Points on a Line** - Group points by slope to find lines with maximum points.
2. **LeetCode 939. Minimum Area Rectangle** - Group points by x-coordinate to efficiently find rectangles.
3. **LeetCode 356. Line Reflection** - Group points to check symmetry about a vertical line.

The core idea is always the same: when you need to check relationships between points (buildings, coordinates, etc.), group them by one dimension first to reduce the search space.

## Key Takeaways

1. **Group before you search**: When dealing with spatial relationships, group elements by one coordinate (row or column) to avoid comparing every pair.

2. **Sort for boundary checks**: If you only need to know if an element is at the boundary of a group (not the exact neighbors), sorting the group gives you O(1) boundary checks.

3. **Sparse data needs sparse structures**: When the grid is large but points are few, use hash maps instead of arrays to save memory.

[Practice this problem on CodeJeet](/problem/count-covered-buildings)
