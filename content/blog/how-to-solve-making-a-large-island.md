---
title: "How to Solve Making A Large Island — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Making A Large Island. Hard difficulty, 56.3% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Union-Find, Matrix."
date: "2027-07-19"
category: "dsa-patterns"
tags: ["making-a-large-island", "array", "depth-first-search", "breadth-first-search", "hard"]
---

# How to Solve Making A Large Island

This problem asks us to find the largest possible island after converting at most one `0` to a `1` in a binary matrix. The tricky part is that islands are connected 4-directionally, and flipping a single `0` can potentially merge multiple existing islands into one massive island. The challenge lies in efficiently calculating the potential size gain from each possible flip without recomputing islands from scratch for every candidate.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [
    [1, 0, 1],
    [0, 0, 0],
    [1, 0, 1]
]
```

**Step 1: Identify existing islands**

- Top-left `1` at (0,0) is an island of size 1
- Top-right `1` at (0,2) is an island of size 1
- Bottom-left `1` at (2,0) is an island of size 1
- Bottom-right `1` at (2,2) is an island of size 1

**Step 2: Evaluate flipping the center `0` at (1,1)**
If we flip (1,1) to `1`, it connects to all four islands:

- Up: (0,1) is `0`, so no connection upward
- Down: (2,1) is `0`, so no connection downward
- Left: (1,0) is `0`, so no connection left
- Right: (1,2) is `0`, so no connection right

Wait, that's not right! Let me reconsider - the center (1,1) doesn't directly touch any `1`s. But what about diagonal? No, islands are 4-directionally connected, not 8-directionally. So flipping (1,1) creates a new island of size 1.

**Step 3: Let's try a better example:**

```
grid = [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1]
]
```

Now (1,1) is already `1`, so we can't flip it. Let's evaluate flipping (0,1):

- Left: (0,0) is `1` (island A, size 1)
- Right: (0,2) is `1` (island B, size 1)
- Down: (1,1) is `1` (island C, size 1)

If we flip (0,1), we connect islands A, B, and C. Total size = 1 + 1 + 1 + 1 (the flipped cell itself) = 4.

**Key insight**: To maximize island size, we want to flip a `0` that touches as many _different_ islands as possible. But we must be careful not to double-count islands that are actually the same island connected through other paths.

## Brute Force Approach

The brute force approach would be:

1. For each `0` in the grid
2. Temporarily flip it to `1`
3. Run DFS/BFS to find the largest island in the entire modified grid
4. Track the maximum size found

This approach is straightforward but extremely inefficient. For an `n x n` grid:

- There are up to `n²` zeros to check
- For each flip, we need to traverse the entire grid to find all islands
- This gives us O(n⁴) time complexity, which is far too slow for typical constraints (n up to 500).

The main problem with brute force is that we're recomputing island connectivity from scratch for every possible flip, even though most of the grid remains unchanged.

## Optimized Approach

The key insight is to **precompute island sizes first**, then evaluate each `0` by looking at its neighbors. Here's the step-by-step reasoning:

1. **Island Identification Phase**: Traverse the grid and assign each `1` a unique island ID. Store the size of each island in a dictionary. This is similar to "connected components" in graph theory.

2. **Zero Evaluation Phase**: For each `0`:
   - Look at its 4-directional neighbors
   - Collect the unique island IDs of neighboring `1`s
   - Sum their sizes, plus 1 for the flipped cell itself
   - Track the maximum such sum

3. **Edge Case**: What if there are no zeros? Then we can't flip anything, so the answer is just the size of the largest existing island.

4. **Important Detail**: We need to handle the case where a `0` touches the same island from multiple directions (e.g., a `0` completely surrounded by the same island). We must use a set to collect unique island IDs to avoid double-counting.

The clever part is that by precomputing island sizes once, we can evaluate each `0` in constant time (just checking up to 4 neighbors).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(n²) where n is grid dimension
class Solution:
    def largestIsland(self, grid: List[List[int]]) -> int:
        n = len(grid)

        # Step 1: Assign unique IDs to each island and store their sizes
        island_id = 2  # Start from 2 since 0 and 1 are already used in grid
        island_sizes = {}  # Map island_id -> size

        # Directions for 4-way movement: up, down, left, right
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

        # DFS to mark all cells of an island with the same ID
        def dfs(r, c, current_id):
            if r < 0 or r >= n or c < 0 or c >= n or grid[r][c] != 1:
                return 0

            # Mark cell with current island ID
            grid[r][c] = current_id

            # Initialize size with current cell
            size = 1

            # Explore all 4 neighbors
            for dr, dc in directions:
                size += dfs(r + dr, c + dc, current_id)

            return size

        # First pass: identify all islands and their sizes
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 1:  # Found an unvisited island
                    size = dfs(r, c, island_id)
                    island_sizes[island_id] = size
                    island_id += 1

        # Step 2: If there are no islands (all zeros), flipping any cell gives size 1
        if not island_sizes:
            return 1

        # Step 3: If there are no zeros, return the largest existing island
        # (We check this by seeing if max possible island size equals n*n)
        max_size = max(island_sizes.values())

        # Step 4: Evaluate each zero cell
        for r in range(n):
            for c in range(n):
                if grid[r][c] == 0:
                    # Use a set to avoid counting the same island multiple times
                    neighbor_islands = set()

                    # Check all 4 neighbors
                    for dr, dc in directions:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] > 1:
                            neighbor_islands.add(grid[nr][nc])

                    # Start with 1 for the flipped cell itself
                    potential_size = 1

                    # Add sizes of all unique neighboring islands
                    for island in neighbor_islands:
                        potential_size += island_sizes[island]

                    # Update maximum size found
                    max_size = max(max_size, potential_size)

        return max_size
```

```javascript
// Time: O(n²) | Space: O(n²) where n is grid dimension
/**
 * @param {number[][]} grid
 * @return {number}
 */
var largestIsland = function (grid) {
  const n = grid.length;

  // Step 1: Assign unique IDs to each island and store their sizes
  let islandId = 2; // Start from 2 since 0 and 1 are already used
  const islandSizes = new Map(); // Map islandId -> size

  // Directions for 4-way movement
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // DFS to mark all cells of an island with the same ID
  const dfs = (r, c, currentId) => {
    // Check bounds and if cell is part of an unvisited island
    if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] !== 1) {
      return 0;
    }

    // Mark cell with current island ID
    grid[r][c] = currentId;

    // Initialize size with current cell
    let size = 1;

    // Explore all 4 neighbors
    for (const [dr, dc] of directions) {
      size += dfs(r + dr, c + dc, currentId);
    }

    return size;
  };

  // First pass: identify all islands and their sizes
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1) {
        // Found an unvisited island
        const size = dfs(r, c, islandId);
        islandSizes.set(islandId, size);
        islandId++;
      }
    }
  }

  // Step 2: If there are no islands (all zeros), flipping any cell gives size 1
  if (islandSizes.size === 0) {
    return 1;
  }

  // Step 3: Initialize maxSize with largest existing island
  let maxSize = Math.max(...islandSizes.values());

  // Step 4: Evaluate each zero cell
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 0) {
        // Use a Set to avoid counting the same island multiple times
        const neighborIslands = new Set();

        // Check all 4 neighbors
        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;

          if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] > 1) {
            neighborIslands.add(grid[nr][nc]);
          }
        }

        // Start with 1 for the flipped cell itself
        let potentialSize = 1;

        // Add sizes of all unique neighboring islands
        for (const island of neighborIslands) {
          potentialSize += islandSizes.get(island);
        }

        // Update maximum size found
        maxSize = Math.max(maxSize, potentialSize);
      }
    }
  }

  return maxSize;
};
```

```java
// Time: O(n²) | Space: O(n²) where n is grid dimension
class Solution {
    // Directions for 4-way movement: up, down, left, right
    private static final int[][] DIRECTIONS = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

    public int largestIsland(int[][] grid) {
        int n = grid.length;

        // Step 1: Assign unique IDs to each island and store their sizes
        int islandId = 2; // Start from 2 since 0 and 1 are already used
        Map<Integer, Integer> islandSizes = new HashMap<>();

        // First pass: identify all islands and their sizes
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 1) { // Found an unvisited island
                    int size = dfs(grid, r, c, islandId, n);
                    islandSizes.put(islandId, size);
                    islandId++;
                }
            }
        }

        // Step 2: If there are no islands (all zeros), flipping any cell gives size 1
        if (islandSizes.isEmpty()) {
            return 1;
        }

        // Step 3: Initialize maxSize with largest existing island
        int maxSize = 0;
        for (int size : islandSizes.values()) {
            maxSize = Math.max(maxSize, size);
        }

        // Step 4: Evaluate each zero cell
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 0) {
                    // Use a Set to avoid counting the same island multiple times
                    Set<Integer> neighborIslands = new HashSet<>();

                    // Check all 4 neighbors
                    for (int[] dir : DIRECTIONS) {
                        int nr = r + dir[0];
                        int nc = c + dir[1];

                        if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] > 1) {
                            neighborIslands.add(grid[nr][nc]);
                        }
                    }

                    // Start with 1 for the flipped cell itself
                    int potentialSize = 1;

                    // Add sizes of all unique neighboring islands
                    for (int island : neighborIslands) {
                        potentialSize += islandSizes.get(island);
                    }

                    // Update maximum size found
                    maxSize = Math.max(maxSize, potentialSize);
                }
            }
        }

        return maxSize;
    }

    // DFS to mark all cells of an island with the same ID
    private int dfs(int[][] grid, int r, int c, int currentId, int n) {
        // Check bounds and if cell is part of an unvisited island
        if (r < 0 || r >= n || c < 0 || c >= n || grid[r][c] != 1) {
            return 0;
        }

        // Mark cell with current island ID
        grid[r][c] = currentId;

        // Initialize size with current cell
        int size = 1;

        // Explore all 4 neighbors
        for (int[] dir : DIRECTIONS) {
            size += dfs(grid, r + dir[0], c + dir[1], currentId, n);
        }

        return size;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We traverse the entire grid twice: once for island identification (DFS/BFS) and once for evaluating zeros
- Each cell is visited a constant number of times
- DFS/BFS visits each `1` exactly once during island identification

**Space Complexity: O(n²)**

- In the worst case, the recursion stack for DFS could be O(n²) if the entire grid is one big island
- The `island_sizes` dictionary stores at most O(n²) entries (if every cell is its own island)
- We modify the input grid in-place to store island IDs, so no additional O(n²) storage needed beyond that

## Common Mistakes

1. **Forgetting to handle the "no zeros" case**: If the grid has no zeros, we can't flip anything. The answer should be the size of the largest existing island, not n².

2. **Double-counting the same island**: When a `0` touches the same island from multiple directions (e.g., a `0` in a U-shaped island), candidates might sum the same island multiple times. Always use a set to collect unique island IDs from neighbors.

3. **Not starting island IDs from 2**: Since 0 and 1 are already used in the grid (0 for water, 1 for unvisited land), we need to start island IDs from 2 or use negative numbers. Otherwise, we can't distinguish between "water" and "island ID 0".

4. **Missing the edge case of all zeros**: If the entire grid is zeros, flipping any cell gives an island of size 1. Some implementations might return 0 incorrectly.

## When You'll See This Pattern

This "connected components with labeling" pattern appears in many grid problems:

1. **Number of Islands (LeetCode 200)**: The foundational problem for connected components in grids. This problem builds on that by adding the "what if we could change one cell" twist.

2. **Max Area of Island (LeetCode 695)**: Very similar to the island identification phase of our solution - finding and measuring connected components.

3. **Surrounded Regions (LeetCode 130)**: Uses DFS/BFS to identify and mark connected components, though with a different goal (flipping 'O's to 'X's).

The core technique is: first label/identify connected components, then use those labels for efficient computation later. This avoids recomputing connectivity multiple times.

## Key Takeaways

1. **Two-phase approach is powerful**: When a problem involves evaluating "what if" scenarios (changing one element), consider first computing baseline information (island sizes), then efficiently evaluating each change using that precomputed data.

2. **In-place labeling saves space**: By reusing the input grid to store island IDs (using values beyond the original range), we avoid allocating a separate visited matrix while still tracking which cells belong to which islands.

3. **Sets prevent double-counting**: When collecting information from multiple neighbors (in this case, island IDs), using a set to ensure uniqueness is often crucial for correct summation.

[Practice this problem on CodeJeet](/problem/making-a-large-island)
