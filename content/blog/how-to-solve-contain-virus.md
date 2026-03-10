---
title: "How to Solve Contain Virus — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Contain Virus. Hard difficulty, 54.4% acceptance rate. Topics: Array, Depth-First Search, Breadth-First Search, Matrix, Simulation."
date: "2029-12-28"
category: "dsa-patterns"
tags: ["contain-virus", "array", "depth-first-search", "breadth-first-search", "hard"]
---

# How to Solve "Contain Virus"

This problem simulates containing a spreading virus by strategically placing walls to minimize total infections. The world is an `m x n` grid where infected cells spread to adjacent uninfected cells daily unless blocked by walls. Each day, you can build walls around one infected region to completely contain it. The challenge is deciding **which region to contain each day** to minimize total infected cells over time. This is tricky because it requires simulating spread, evaluating threat levels, and making optimal containment decisions simultaneously.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Initial grid:
1 1 1
1 0 1
1 1 1
```

**Day 0:** All infected cells form one region. It threatens to infect the center cell (0). If we don't contain it, tomorrow all cells become infected. So we contain it immediately.

**Walls needed:** Count perimeter touching uninfected cells. Each infected cell has 4 sides. The 8 perimeter cells touch the center (uninfected) cell: 8 walls.

**Total walls:** 8

Now a more interesting example:

```
Initial grid:
0 1 0 0 0
0 1 0 0 0
0 0 0 0 0
0 0 0 1 0
```

**Day 0:** Two infected regions:

1. Left region (cells (0,1), (1,1)) - threatens 3 uninfected neighbors
2. Right region (cell (3,3)) - threatens 2 uninfected neighbors

We contain the left region first (bigger threat). Build walls around it.

**Day 1:** Right region spreads to 2 new cells. Now we contain it.

The key insight: each day, we must:

1. Identify all connected infected regions
2. For each region, calculate its "threat" (how many uninfected neighbors it would infect)
3. Contain the most threatening region
4. Let other regions spread
5. Repeat until no infected cells remain

## Brute Force Approach

A naive approach might try all possible containment sequences, but that's exponential. Another brute force might contain regions randomly or always contain the largest region. Let's think through what a candidate might try:

1. Each day, find all infected cells
2. For each infected cell, count its uninfected neighbors
3. Build walls around cells with most uninfected neighbors

This fails because:

- We need to contain **entire regions**, not individual cells
- The threat of a region isn't just the sum of individual threats
- We need to track which cells become infected after each day's spread

The brute force of trying all containment orders has complexity O(k!) where k is the number of regions - completely infeasible.

## Optimized Approach

The key insight is that this is a **greedy simulation** problem. Each day, we:

1. **Identify regions:** Use DFS/BFS to find connected infected components
2. **Evaluate threats:** For each region, find all unique uninfected neighbors it would infect
3. **Contain the biggest threat:** Build walls around the region with most threatened uninfected cells
4. **Spread other regions:** Let all other infected regions spread to their neighbors
5. **Repeat** until no infected cells remain

Why greedy works: Containing the region with maximum threatened cells minimizes total infections because:

- If we don't contain it today, those threatened cells become infected tomorrow
- Those newly infected cells can then spread further
- Containing the biggest threat gives us the most "bang for our buck" in terms of walls used vs infections prevented

The tricky parts:

- After containing a region, those cells become "quarantined" - they don't spread further
- We need to track which cells are already infected vs threatened
- Walls are built on the boundary between infected and uninfected cells

## Optimal Solution

Here's the step-by-step algorithm:

1. While there are infected cells:
   - Find all connected infected regions using DFS/BFS
   - For each region, calculate:
     - Set of threatened uninfected neighbors
     - Number of walls needed (perimeter touching uninfected cells)
   - Select region with largest threatened set
   - Add its wall count to answer
   - Mark its cells as contained (set to -1)
   - Spread other regions to their threatened neighbors
   - Repeat

<div class="code-group">

```python
# Time: O(m*n * days) where days ≤ m*n | Space: O(m*n)
class Solution:
    def containVirus(self, isInfected: List[List[int]]) -> int:
        m, n = len(isInfected), len(isInfected[0])
        walls = 0

        while True:
            # Step 1: Find all infected regions
            regions = []  # List of (threatened_cells, wall_count, infected_cells)
            visited = [[False] * n for _ in range(m)]

            for i in range(m):
                for j in range(n):
                    if isInfected[i][j] == 1 and not visited[i][j]:
                        # Found a new infected region
                        threatened = set()
                        infected_cells = []
                        wall_count = 0

                        # DFS to explore this region
                        stack = [(i, j)]
                        visited[i][j] = True

                        while stack:
                            x, y = stack.pop()
                            infected_cells.append((x, y))

                            # Check all 4 directions
                            for dx, dy in [(0,1), (0,-1), (1,0), (-1,0)]:
                                nx, ny = x + dx, y + dy

                                if 0 <= nx < m and 0 <= ny < n:
                                    if isInfected[nx][ny] == 0:
                                        # This side needs a wall
                                        wall_count += 1
                                        # Record threatened cell
                                        threatened.add((nx, ny))
                                    elif isInfected[nx][ny] == 1 and not visited[nx][ny]:
                                        # Another infected cell in same region
                                        visited[nx][ny] = True
                                        stack.append((nx, ny))

                        regions.append((threatened, wall_count, infected_cells))

            if not regions:
                break  # No more infected regions

            # Step 2: Find region with maximum threat
            max_threat_idx = 0
            for i in range(1, len(regions)):
                if len(regions[i][0]) > len(regions[max_threat_idx][0]):
                    max_threat_idx = i

            # Step 3: Contain the most threatening region
            threatened, wall_count, infected_cells = regions[max_threat_idx]
            walls += wall_count

            # Mark contained cells as -1 (quarantined)
            for x, y in infected_cells:
                isInfected[x][y] = -1

            # Step 4: Spread other regions
            for i, (threatened_set, _, infected_cells_list) in enumerate(regions):
                if i == max_threat_idx:
                    continue  # Skip contained region

                # Spread to all threatened cells
                for x, y in threatened_set:
                    isInfected[x][y] = 1

            # Remove contained region from list
            regions.pop(max_threat_idx)

            # If no regions left to spread, break
            if not regions:
                break

        return walls
```

```javascript
// Time: O(m*n * days) where days ≤ m*n | Space: O(m*n)
var containVirus = function (isInfected) {
  const m = isInfected.length;
  const n = isInfected[0].length;
  let walls = 0;

  while (true) {
    // Step 1: Find all infected regions
    const regions = []; // [{threatened, wallCount, infectedCells}]
    const visited = Array(m)
      .fill()
      .map(() => Array(n).fill(false));

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (isInfected[i][j] === 1 && !visited[i][j]) {
          // Found a new infected region
          const threatened = new Set();
          const infectedCells = [];
          let wallCount = 0;

          // DFS to explore this region
          const stack = [[i, j]];
          visited[i][j] = true;

          while (stack.length > 0) {
            const [x, y] = stack.pop();
            infectedCells.push([x, y]);

            // Check all 4 directions
            const directions = [
              [0, 1],
              [0, -1],
              [1, 0],
              [-1, 0],
            ];
            for (const [dx, dy] of directions) {
              const nx = x + dx;
              const ny = y + dy;

              if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                if (isInfected[nx][ny] === 0) {
                  // This side needs a wall
                  wallCount++;
                  // Record threatened cell
                  threatened.add(`${nx},${ny}`);
                } else if (isInfected[nx][ny] === 1 && !visited[nx][ny]) {
                  // Another infected cell in same region
                  visited[nx][ny] = true;
                  stack.push([nx, ny]);
                }
              }
            }
          }

          regions.push({
            threatened: threatened,
            wallCount: wallCount,
            infectedCells: infectedCells,
          });
        }
      }
    }

    if (regions.length === 0) {
      break; // No more infected regions
    }

    // Step 2: Find region with maximum threat
    let maxThreatIdx = 0;
    for (let i = 1; i < regions.length; i++) {
      if (regions[i].threatened.size > regions[maxThreatIdx].threatened.size) {
        maxThreatIdx = i;
      }
    }

    // Step 3: Contain the most threatening region
    const { threatened: maxThreatened, wallCount, infectedCells } = regions[maxThreatIdx];
    walls += wallCount;

    // Mark contained cells as -1 (quarantined)
    for (const [x, y] of infectedCells) {
      isInfected[x][y] = -1;
    }

    // Step 4: Spread other regions
    for (let i = 0; i < regions.length; i++) {
      if (i === maxThreatIdx) continue; // Skip contained region

      const { threatened } = regions[i];
      // Spread to all threatened cells
      for (const cellStr of threatened) {
        const [x, y] = cellStr.split(",").map(Number);
        isInfected[x][y] = 1;
      }
    }

    // Remove contained region from list
    regions.splice(maxThreatIdx, 1);

    // If no regions left to spread, break
    if (regions.length === 0) {
      break;
    }
  }

  return walls;
};
```

```java
// Time: O(m*n * days) where days ≤ m*n | Space: O(m*n)
class Solution {
    public int containVirus(int[][] isInfected) {
        int m = isInfected.length;
        int n = isInfected[0].length;
        int walls = 0;

        while (true) {
            // Step 1: Find all infected regions
            List<Region> regions = new ArrayList<>();
            boolean[][] visited = new boolean[m][n];

            for (int i = 0; i < m; i++) {
                for (int j = 0; j < n; j++) {
                    if (isInfected[i][j] == 1 && !visited[i][j]) {
                        // Found a new infected region
                        Region region = new Region();
                        // DFS to explore this region
                        dfs(isInfected, i, j, visited, region);
                        regions.add(region);
                    }
                }
            }

            if (regions.isEmpty()) {
                break; // No more infected regions
            }

            // Step 2: Find region with maximum threat
            int maxThreatIdx = 0;
            for (int i = 1; i < regions.size(); i++) {
                if (regions.get(i).threatened.size() > regions.get(maxThreatIdx).threatened.size()) {
                    maxThreatIdx = i;
                }
            }

            // Step 3: Contain the most threatening region
            Region maxRegion = regions.get(maxThreatIdx);
            walls += maxRegion.wallCount;

            // Mark contained cells as -1 (quarantined)
            for (int[] cell : maxRegion.infectedCells) {
                isInfected[cell[0]][cell[1]] = -1;
            }

            // Step 4: Spread other regions
            for (int i = 0; i < regions.size(); i++) {
                if (i == maxThreatIdx) continue; // Skip contained region

                Region region = regions.get(i);
                // Spread to all threatened cells
                for (int[] cell : region.threatened) {
                    isInfected[cell[0]][cell[1]] = 1;
                }
            }

            // Remove contained region from list
            regions.remove(maxThreatIdx);

            // If no regions left to spread, break
            if (regions.isEmpty()) {
                break;
            }
        }

        return walls;
    }

    private void dfs(int[][] grid, int i, int j, boolean[][] visited, Region region) {
        int m = grid.length;
        int n = grid[0].length;

        Stack<int[]> stack = new Stack<>();
        stack.push(new int[]{i, j});
        visited[i][j] = true;

        int[][] directions = {{0,1}, {0,-1}, {1,0}, {-1,0}};

        while (!stack.isEmpty()) {
            int[] cell = stack.pop();
            int x = cell[0];
            int y = cell[1];

            region.infectedCells.add(new int[]{x, y});

            for (int[] dir : directions) {
                int nx = x + dir[0];
                int ny = y + dir[1];

                if (nx >= 0 && nx < m && ny >= 0 && ny < n) {
                    if (grid[nx][ny] == 0) {
                        // This side needs a wall
                        region.wallCount++;
                        // Record threatened cell
                        region.threatened.add(new int[]{nx, ny});
                    } else if (grid[nx][ny] == 1 && !visited[nx][ny]) {
                        // Another infected cell in same region
                        visited[nx][ny] = true;
                        stack.push(new int[]{nx, ny});
                    }
                }
            }
        }
    }

    class Region {
        Set<int[]> threatened = new HashSet<int[]>() {
            @Override
            public boolean add(int[] cell) {
                for (int[] existing : this) {
                    if (existing[0] == cell[0] && existing[1] == cell[1]) {
                        return false;
                    }
                }
                return super.add(cell);
            }

            @Override
            public boolean contains(Object obj) {
                if (!(obj instanceof int[])) return false;
                int[] cell = (int[]) obj;
                for (int[] existing : this) {
                    if (existing[0] == cell[0] && existing[1] == cell[1]) {
                        return true;
                    }
                }
                return false;
            }
        };
        int wallCount = 0;
        List<int[]> infectedCells = new ArrayList<>();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n × days)

- Each day, we traverse the entire grid to find regions: O(m × n)
- We use DFS/BFS for each region, but each cell is visited at most once per day
- The number of days is bounded by m × n (worst case: contain one cell per day)
- Total: O((m × n)²) in worst case, but typically much less

**Space Complexity:** O(m × n)

- We store visited array: O(m × n)
- We store regions with their threatened cells and infected cells: O(m × n) total
- DFS/BFS stack: O(m × n) in worst case (when entire grid is one region)

## Common Mistakes

1. **Not using a Set for threatened cells:** Multiple infected cells can threaten the same uninfected cell. If you use a list or count duplicates, you'll overestimate the threat and build unnecessary walls.

2. **Forgetting to mark contained cells:** After building walls around a region, those cells should be marked (e.g., set to -1) so they don't get included in future region searches. Otherwise, you might try to contain them again.

3. **Incorrect wall counting:** Walls should only be counted where infected cells touch uninfected cells (value 0). Don't count walls between two infected cells or between infected and contained cells.

4. **Not handling the "no regions left" case:** After containing all regions, the loop should terminate. Failing to check this leads to infinite loops.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Grid BFS/DFS with state tracking** - Similar to "Number of Islands" but with more complex state transitions
2. **Greedy simulation with multiple agents** - Like "Rotting Oranges" but with strategic decision-making
3. **Multi-step process optimization** - Similar to "Campus Bikes II" where you make sequential assignments

Related problems:

- **"Rotting Oranges" (Medium)** - Also simulates spread through a grid, but with simpler rules
- **"Walls and Gates" (Medium)** - Involves calculating distances in a grid with obstacles
- **"Number of Islands" (Easy)** - Uses the same connected component finding technique

## Key Takeaways

1. **Greedy can work for simulation problems** - When you need to make sequential decisions, sometimes picking the locally optimal choice at each step gives the globally optimal solution.

2. **Track state carefully in simulation problems** - Use different values (-1, 0, 1) to represent different states (contained, uninfected, infected). Clear state management prevents bugs.

3. **Connected components + threat evaluation** - The pattern of finding connected components and evaluating their "danger" to neighbors appears in many grid simulation problems.

Related problems: [Count the Number of Infection Sequences](/problem/count-the-number-of-infection-sequences)
