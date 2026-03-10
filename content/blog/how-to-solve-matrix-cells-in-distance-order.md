---
title: "How to Solve Matrix Cells in Distance Order — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Matrix Cells in Distance Order. Easy difficulty, 73.9% acceptance rate. Topics: Array, Math, Geometry, Sorting, Matrix."
date: "2027-11-29"
category: "dsa-patterns"
tags: ["matrix-cells-in-distance-order", "array", "math", "geometry", "easy"]
---

# How to Solve Matrix Cells in Distance Order

You're given a matrix of size `rows × cols` and a starting cell `(rCenter, cCenter)`. Your task is to return all matrix coordinates sorted by their Manhattan distance from the center cell. The Manhattan distance between two points `(r1, c1)` and `(r2, c2)` is calculated as `|r1 - r2| + |c1 - c2|`.

What makes this problem interesting is that while it appears to be a sorting problem, there's actually a clever observation that lets us solve it without explicit sorting: we can generate cells in distance order directly by exploring outward from the center in "layers" of increasing distance.

## Visual Walkthrough

Let's trace through a small example: `rows = 3`, `cols = 4`, `rCenter = 1`, `cCenter = 2`.

Our matrix coordinates are:

```
(0,0) (0,1) (0,2) (0,3)
(1,0) (1,1) (1,2) (1,3)
(2,0) (2,1) (2,2) (2,3)
```

The center is at `(1,2)`. Let's calculate Manhattan distances:

- Distance 0: `(1,2)` only
- Distance 1: `(0,2)`, `(1,1)`, `(1,3)`, `(2,2)`
- Distance 2: `(0,1)`, `(0,3)`, `(1,0)`, `(2,1)`, `(2,3)`
- Distance 3: `(0,0)`, `(2,0)`

If we collect all these in distance order, we get:

```
[(1,2), (0,2), (1,1), (1,3), (2,2), (0,1), (0,3), (1,0), (2,1), (2,3), (0,0), (2,0)]
```

Notice the pattern: we're essentially doing a BFS (breadth-first search) starting from the center, exploring cells at increasing distances. However, we don't actually need BFS since we can generate these coordinates mathematically.

## Brute Force Approach

The most straightforward approach is:

1. Generate all coordinates in the matrix
2. Sort them by their Manhattan distance from the center
3. Return the sorted list

While this works, it's not optimal. For an `m × n` matrix, we have `m × n` coordinates. Sorting them takes `O(mn log(mn))` time. Since the problem constraints can be up to 100×100 (10,000 cells), this is acceptable but not optimal. More importantly, it misses the opportunity to demonstrate a deeper understanding of the problem structure.

However, let's see what the brute force code looks like:

<div class="code-group">

```python
# Time: O(mn log(mn)) | Space: O(mn)
def allCellsDistOrder(rows, cols, rCenter, cCenter):
    # Step 1: Generate all coordinates
    coordinates = []
    for r in range(rows):
        for c in range(cols):
            coordinates.append([r, c])

    # Step 2: Sort by Manhattan distance
    coordinates.sort(key=lambda coord: abs(coord[0] - rCenter) + abs(coord[1] - cCenter))

    return coordinates
```

```javascript
// Time: O(mn log(mn)) | Space: O(mn)
function allCellsDistOrder(rows, cols, rCenter, cCenter) {
  // Step 1: Generate all coordinates
  const coordinates = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      coordinates.push([r, c]);
    }
  }

  // Step 2: Sort by Manhattan distance
  coordinates.sort((a, b) => {
    const distA = Math.abs(a[0] - rCenter) + Math.abs(a[1] - cCenter);
    const distB = Math.abs(b[0] - rCenter) + Math.abs(b[1] - cCenter);
    return distA - distB;
  });

  return coordinates;
}
```

```java
// Time: O(mn log(mn)) | Space: O(mn)
public int[][] allCellsDistOrder(int rows, int cols, int rCenter, int cCenter) {
    // Step 1: Generate all coordinates
    int[][] coordinates = new int[rows * cols][2];
    int index = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            coordinates[index][0] = r;
            coordinates[index][1] = c;
            index++;
        }
    }

    // Step 2: Sort by Manhattan distance
    Arrays.sort(coordinates, (a, b) -> {
        int distA = Math.abs(a[0] - rCenter) + Math.abs(a[1] - cCenter);
        int distB = Math.abs(b[0] - rCenter) + Math.abs(b[1] - cCenter);
        return distA - distB;
    });

    return coordinates;
}
```

</div>

## Optimal Solution

The key insight is that we can generate coordinates in distance order without sorting. We can use a bucket sort approach where we group coordinates by their distance. Since the maximum possible distance in an `m × n` matrix is `(m-1) + (n-1)`, we can create buckets for each possible distance.

Here's the optimal approach:

1. Calculate the maximum possible distance
2. Create buckets (lists) for each distance from 0 to max distance
3. Iterate through all coordinates, calculate their distance, and add them to the appropriate bucket
4. Flatten the buckets into a single list

This approach runs in `O(mn)` time since we avoid the logarithmic factor from sorting.

<div class="code-group">

```python
# Time: O(mn) | Space: O(mn)
def allCellsDistOrder(rows, cols, rCenter, cCenter):
    # Step 1: Calculate maximum possible distance
    max_distance = (rows - 1) + (cols - 1)

    # Step 2: Create buckets for each possible distance
    # Each bucket will store coordinates at that distance
    buckets = [[] for _ in range(max_distance + 1)]

    # Step 3: Iterate through all coordinates and bucket them by distance
    for r in range(rows):
        for c in range(cols):
            # Calculate Manhattan distance from center
            distance = abs(r - rCenter) + abs(c - cCenter)
            # Add coordinate to the appropriate bucket
            buckets[distance].append([r, c])

    # Step 4: Flatten buckets into result list
    result = []
    for bucket in buckets:
        result.extend(bucket)  # Add all coordinates from this bucket

    return result
```

```javascript
// Time: O(mn) | Space: O(mn)
function allCellsDistOrder(rows, cols, rCenter, cCenter) {
  // Step 1: Calculate maximum possible distance
  const maxDistance = rows - 1 + (cols - 1);

  // Step 2: Create buckets for each possible distance
  // Each bucket will store coordinates at that distance
  const buckets = Array.from({ length: maxDistance + 1 }, () => []);

  // Step 3: Iterate through all coordinates and bucket them by distance
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Calculate Manhattan distance from center
      const distance = Math.abs(r - rCenter) + Math.abs(c - cCenter);
      // Add coordinate to the appropriate bucket
      buckets[distance].push([r, c]);
    }
  }

  // Step 4: Flatten buckets into result array
  const result = [];
  for (const bucket of buckets) {
    result.push(...bucket); // Spread operator adds all coordinates from this bucket
  }

  return result;
}
```

```java
// Time: O(mn) | Space: O(mn)
public int[][] allCellsDistOrder(int rows, int cols, int rCenter, int cCenter) {
    // Step 1: Calculate maximum possible distance
    int maxDistance = (rows - 1) + (cols - 1);

    // Step 2: Create buckets for each possible distance
    // We'll use a list of lists to store coordinates
    List<List<int[]>> buckets = new ArrayList<>(maxDistance + 1);
    for (int i = 0; i <= maxDistance; i++) {
        buckets.add(new ArrayList<>());
    }

    // Step 3: Iterate through all coordinates and bucket them by distance
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            // Calculate Manhattan distance from center
            int distance = Math.abs(r - rCenter) + Math.abs(c - cCenter);
            // Add coordinate to the appropriate bucket
            buckets.get(distance).add(new int[]{r, c});
        }
    }

    // Step 4: Flatten buckets into result array
    int[][] result = new int[rows * cols][2];
    int index = 0;
    for (List<int[]> bucket : buckets) {
        for (int[] coord : bucket) {
            result[index][0] = coord[0];
            result[index][1] = coord[1];
            index++;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(mn)` where `m = rows` and `n = cols`

- We iterate through all `m × n` cells once to calculate distances and add them to buckets: `O(mn)`
- We iterate through the buckets to flatten them: `O(mn)` total (since there are `mn` total elements across all buckets)
- Total: `O(mn) + O(mn) = O(mn)`

**Space Complexity:** `O(mn)`

- We store all `m × n` coordinates in the buckets: `O(mn)`
- The buckets themselves require `O(maxDistance)` additional space, but `maxDistance ≤ m + n`, which is `O(m + n)`
- Total: `O(mn) + O(m + n) = O(mn)` (since `mn` dominates for large matrices)

## Common Mistakes

1. **Forgetting that Manhattan distance uses absolute values**: Some candidates mistakenly calculate distance as `(r - rCenter) + (c - cCenter)` without absolute values, which gives negative distances for cells above or left of the center.

2. **Incorrect maximum distance calculation**: The maximum distance isn't `rows + cols` but `(rows - 1) + (cols - 1)` since indices are 0-based. Using `rows + cols` creates unnecessary empty buckets.

3. **Not handling edge cases properly**: When the center is at the edge of the matrix, some distances might have fewer cells. The bucket approach handles this naturally, but BFS approaches need to check bounds carefully.

4. **Using BFS without queue optimization**: A BFS approach works but requires careful queue management. Candidates might forget to mark visited cells or handle duplicates when multiple paths lead to the same cell.

## When You'll See This Pattern

This problem demonstrates **bucket sort** (also called counting sort for distances) and **BFS-like layer exploration**. You'll see similar patterns in:

1. **01 Matrix (LeetCode 542)**: Find the distance of each cell to the nearest 0. This uses BFS from multiple starting points.
2. **Rotting Oranges (LeetCode 994)**: Oranges rot in layers outward from initially rotten ones, similar to our distance layers.
3. **K Closest Points to Origin (LeetCode 973)**: Find k points closest to origin, which can use bucket sort by distance squared.

The key insight is recognizing when distances are integers within a limited range, making bucket sort more efficient than general sorting.

## Key Takeaways

1. **When distances are integers with a known maximum, consider bucket sort** instead of general sorting to achieve linear time complexity.

2. **Manhattan distance problems often have a BFS interpretation** - cells at distance d form a "diamond" shape around the center, which can be generated layer by layer.

3. **Always check if you can avoid sorting** by finding structural properties of the problem. Here, the limited range of distances (0 to m+n-2) enables linear-time bucket sort.

Related problems: [Cells in a Range on an Excel Sheet](/problem/cells-in-a-range-on-an-excel-sheet)
