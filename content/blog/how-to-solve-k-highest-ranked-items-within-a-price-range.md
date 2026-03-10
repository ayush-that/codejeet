---
title: "How to Solve K Highest Ranked Items Within a Price Range — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode K Highest Ranked Items Within a Price Range. Medium difficulty, 46.4% acceptance rate. Topics: Array, Breadth-First Search, Sorting, Heap (Priority Queue), Matrix."
date: "2029-10-16"
category: "dsa-patterns"
tags:
  [
    "k-highest-ranked-items-within-a-price-range",
    "array",
    "breadth-first-search",
    "sorting",
    "medium",
  ]
---

# How to Solve K Highest Ranked Items Within a Price Range

This problem asks us to find the top k items in a shop grid that are within a given price range, where items are ranked by distance from the starting point, price, row, and column in that order. What makes this tricky is that we need to explore the grid systematically (since we can only move through empty cells), collect items meeting price criteria, and sort them by multiple criteria. It's essentially a BFS problem with custom sorting, but the ranking rules require careful implementation.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
grid = [[1,2,0,1],[1,3,3,1],[0,2,5,1]]
pricing = [2,3]
start = [0,0]
k = 2
```

We start at (0,0). The rules say:

1. Distance from start (BFS level)
2. Price (lower is better)
3. Row (lower is better)
4. Column (lower is better)

**Step 1:** Start BFS from (0,0)

- Level 0: Check (0,0) = 1 → Not in price range [2,3]
- Level 1: Check neighbors (0,1)=2 and (1,0)=1
  - (0,1)=2 → In range! Distance=1, price=2, row=0, col=1
  - (1,0)=1 → Not in range

**Step 2:** Continue BFS

- Level 2: From (0,1) check (0,2)=0 (wall) and (1,1)=3
  - (1,1)=3 → In range! Distance=2, price=3, row=1, col=1
- We now have 2 items: [(1,2,0,1), (2,3,1,1)]

**Step 3:** Sort by ranking rules

1. Compare distances: 1 vs 2 → (1,2,0,1) wins
2. If distances equal, compare prices: 2 vs 3 → 2 wins
3. If prices equal, compare rows
4. If rows equal, compare columns

**Result:** Return coordinates [(0,1), (1,1)]

## Brute Force Approach

A naive approach might be:

1. Perform BFS from start to find all reachable cells
2. Filter cells where value is in price range
3. Sort all filtered items by the 4 criteria
4. Return first k items

The problem with this brute force is efficiency. If we collect ALL reachable items first, we might be storing many items we don't need (especially if k is small). However, the real issue isn't storage but the BFS itself - we must explore the grid to find items, so we can't avoid visiting cells. The actual "brute force" inefficiency would be in the sorting: we could sort all items when we only need the top k.

A truly naive candidate might try DFS instead of BFS, which would be incorrect because DFS doesn't guarantee we find items in increasing distance order. Or they might try to compute distances mathematically without BFS, which fails because walls block movement.

## Optimized Approach

The key insight is that BFS naturally explores cells in increasing distance from the start. This gives us our primary sorting criterion for free! As we BFS, we can:

1. Collect items that are within the price range
2. Since BFS processes cells level by level, all items at distance d are discovered before items at distance d+1
3. We can sort items within each distance level by the remaining criteria (price, row, column)

This leads to an efficient approach:

- Use BFS queue to explore the grid
- Track visited cells to avoid revisiting
- For each cell, check if it's within price range
- Group items by distance (BFS level)
- Sort items within each distance level
- Collect items until we have k items

The BFS ensures distance ordering, and we only need to sort within each level, not across the entire grid.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m*n + VlogV) where V is number of valid items, worst case O(m*n log(m*n))
# Space: O(m*n) for visited matrix and BFS queue
class Solution:
    def highestRankedKItems(self, grid, pricing, start, k):
        m, n = len(grid), len(grid[0])
        low, high = pricing

        # Result list
        result = []

        # BFS initialization
        queue = deque([(start[0], start[1])])
        visited = [[False] * n for _ in range(m)]
        visited[start[0]][start[1]] = True

        # Directions: up, down, left, right
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

        # Process BFS level by level
        while queue and len(result) < k:
            level_size = len(queue)
            level_items = []  # Items found at current distance

            # Process all cells at current distance level
            for _ in range(level_size):
                x, y = queue.popleft()

                # Check if current cell has an item within price range
                if low <= grid[x][y] <= high:
                    level_items.append((grid[x][y], x, y))

                # Explore neighbors
                for dx, dy in directions:
                    nx, ny = x + dx, y + dy

                    # Check bounds, not visited, and not a wall
                    if 0 <= nx < m and 0 <= ny < n and not visited[nx][ny] and grid[nx][ny] != 0:
                        visited[nx][ny] = True
                        queue.append((nx, ny))

            # Sort items in current level by price, then row, then column
            level_items.sort(key=lambda x: (x[0], x[1], x[2]))

            # Add items from current level to result (but don't exceed k)
            for _, x, y in level_items:
                if len(result) < k:
                    result.append([x, y])
                else:
                    break

        return result
```

```javascript
// Time: O(m*n + VlogV) where V is number of valid items
// Space: O(m*n) for visited matrix and BFS queue
var highestRankedKItems = function (grid, pricing, start, k) {
  const m = grid.length,
    n = grid[0].length;
  const [low, high] = pricing;

  // Result array
  const result = [];

  // BFS initialization
  const queue = [[start[0], start[1]]];
  const visited = Array.from({ length: m }, () => new Array(n).fill(false));
  visited[start[0]][start[1]] = true;

  // Directions: up, down, left, right
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // Process BFS level by level
  while (queue.length > 0 && result.length < k) {
    const levelSize = queue.length;
    const levelItems = []; // Items found at current distance

    // Process all cells at current distance level
    for (let i = 0; i < levelSize; i++) {
      const [x, y] = queue.shift();

      // Check if current cell has an item within price range
      if (grid[x][y] >= low && grid[x][y] <= high) {
        levelItems.push([grid[x][y], x, y]);
      }

      // Explore neighbors
      for (const [dx, dy] of directions) {
        const nx = x + dx,
          ny = y + dy;

        // Check bounds, not visited, and not a wall
        if (nx >= 0 && nx < m && ny >= 0 && ny < n && !visited[nx][ny] && grid[nx][ny] !== 0) {
          visited[nx][ny] = true;
          queue.push([nx, ny]);
        }
      }
    }

    // Sort items in current level by price, then row, then column
    levelItems.sort((a, b) => {
      if (a[0] !== b[0]) return a[0] - b[0]; // Price
      if (a[1] !== b[1]) return a[1] - b[1]; // Row
      return a[2] - b[2]; // Column
    });

    // Add items from current level to result (but don't exceed k)
    for (const [_, x, y] of levelItems) {
      if (result.length < k) {
        result.push([x, y]);
      } else {
        break;
      }
    }
  }

  return result;
};
```

```java
// Time: O(m*n + VlogV) where V is number of valid items
// Space: O(m*n) for visited matrix and BFS queue
class Solution {
    public List<List<Integer>> highestRankedKItems(int[][] grid, int[] pricing, int[] start, int k) {
        int m = grid.length, n = grid[0].length;
        int low = pricing[0], high = pricing[1];

        // Result list
        List<List<Integer>> result = new ArrayList<>();

        // BFS initialization
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start[0], start[1]});
        boolean[][] visited = new boolean[m][n];
        visited[start[0]][start[1]] = true;

        // Directions: up, down, left, right
        int[][] directions = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};

        // Process BFS level by level
        while (!queue.isEmpty() && result.size() < k) {
            int levelSize = queue.size();
            List<int[]> levelItems = new ArrayList<>();  // Items found at current distance

            // Process all cells at current distance level
            for (int i = 0; i < levelSize; i++) {
                int[] cell = queue.poll();
                int x = cell[0], y = cell[1];

                // Check if current cell has an item within price range
                if (grid[x][y] >= low && grid[x][y] <= high) {
                    levelItems.add(new int[]{grid[x][y], x, y});
                }

                // Explore neighbors
                for (int[] dir : directions) {
                    int nx = x + dir[0], ny = y + dir[1];

                    // Check bounds, not visited, and not a wall
                    if (nx >= 0 && nx < m && ny >= 0 && ny < n &&
                        !visited[nx][ny] && grid[nx][ny] != 0) {
                        visited[nx][ny] = true;
                        queue.offer(new int[]{nx, ny});
                    }
                }
            }

            // Sort items in current level by price, then row, then column
            levelItems.sort((a, b) -> {
                if (a[0] != b[0]) return a[0] - b[0];  // Price
                if (a[1] != b[1]) return a[1] - b[1];  // Row
                return a[2] - b[2];                     // Column
            });

            // Add items from current level to result (but don't exceed k)
            for (int[] item : levelItems) {
                if (result.size() < k) {
                    result.add(Arrays.asList(item[1], item[2]));
                } else {
                    break;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n + V log V) where V is the number of valid items (within price range)

- We visit each cell at most once: O(m × n)
- For each BFS level, we sort the valid items found at that level. In worst case, all cells could be valid items, so V = m × n, giving O(m × n log(m × n))
- However, in practice V is usually much smaller than m × n

**Space Complexity:** O(m × n)

- Visited matrix: O(m × n)
- BFS queue: O(m × n) in worst case (when most cells are reachable)
- Result list: O(k) which is O(m × n) in worst case

## Common Mistakes

1. **Using DFS instead of BFS:** DFS doesn't guarantee exploring cells in increasing distance order. The distance criterion is primary, so we need BFS to process levels.

2. **Forgetting to handle walls (0 values):** The problem states 0 represents walls you cannot pass through. You must check `grid[nx][ny] != 0` when exploring neighbors.

3. **Incorrect sorting order:** The ranking criteria are: distance (primary), then price, then row, then column. Since BFS gives us distance ordering, we only need to sort by the remaining three criteria within each level.

4. **Not checking the starting cell:** Candidates often forget to check if the starting cell itself contains a valid item. The starting cell should be included if it's within the price range.

5. **Continuing BFS after finding k items:** Once we have k items, we can stop the BFS. There's no need to explore the entire grid if we already have enough items.

## When You'll See This Pattern

This problem combines BFS grid exploration with custom sorting, a pattern seen in several LeetCode problems:

1. **"As Far from Land as Possible" (Medium):** Uses BFS from multiple starting points to find maximum distance to land. Similar grid exploration but with different goal.

2. **"Shortest Path in Binary Matrix" (Medium):** BFS on grid with obstacles, finding shortest path. The BFS pattern is identical, just with different termination condition.

3. **"The Maze" series (Medium):** BFS/DFS in grid with walls, finding if a path exists or shortest path length.

The key pattern is: when you need to find shortest paths or explore in order of increasing distance in a grid with obstacles, BFS is almost always the right approach.

## Key Takeaways

1. **BFS gives distance ordering for free:** When you need to process cells in order of their distance from a starting point, BFS is the natural choice because it explores level by level.

2. **Combine BFS with other operations:** You can perform additional processing (like filtering and sorting) on each BFS level. This is more efficient than collecting everything first and then sorting.

3. **Multi-criteria sorting:** When sorting by multiple criteria, implement comparators carefully. Remember that earlier criteria dominate later ones.

4. **Early termination optimization:** If you only need top k items, stop BFS once you have enough items. Don't explore the entire grid unnecessarily.

Related problems: [Kth Largest Element in an Array](/problem/kth-largest-element-in-an-array), [As Far from Land as Possible](/problem/as-far-from-land-as-possible), [Reward Top K Students](/problem/reward-top-k-students)
