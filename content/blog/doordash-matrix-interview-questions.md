---
title: "Matrix Questions at DoorDash: What to Expect"
description: "Prepare for Matrix interview questions at DoorDash — patterns, difficulty breakdown, and study tips."
date: "2028-08-18"
category: "dsa-patterns"
tags: ["doordash", "matrix", "interview prep"]
---

# Matrix Questions at DoorDash: What to Expect

If you're preparing for a DoorDash interview, you've probably noticed their problem list includes 12 Matrix questions out of 87 total. That's about 14% — a significant chunk that demands focused preparation. But here's what most candidates miss: at DoorDash, matrix problems aren't just academic exercises. They're practical representations of real-world mapping, logistics, and delivery optimization problems. When you're asked to traverse a grid or find the shortest path, you're essentially solving a scaled-down version of routing deliveries through city blocks with various constraints.

The key insight? DoorDash uses matrix problems to test your ability to think about spatial relationships and constraints — exactly what their engineers do when optimizing delivery routes, warehouse layouts, or mapping algorithms. While not as dominant as array or string questions, matrix problems appear frequently enough that you'll almost certainly encounter at least one in your interview loop, particularly in the technical phone screen or onsite coding rounds.

## Specific Patterns DoorDash Favors

DoorDash's matrix questions tend to cluster around three specific patterns that mirror their business needs:

1. **Grid traversal with constraints** — These are your classic BFS/DFS problems, but with DoorDash-specific twists like delivery time windows (represented as values), obstacles (restaurants that can't be accessed), or multiple agents (multiple delivery drivers). Problems like "Number of Islands" (#200) appear, but often with modifications like counting delivery zones instead of islands.

2. **Shortest path in weighted grids** — This is where DoorDash really leans into their domain. Instead of simple empty/blocked cells, you'll encounter grids where each cell has a "cost" (delivery time, traffic difficulty, or elevation). LeetCode #505 "The Maze II" is a perfect example — it's essentially finding the optimal path through a city with different terrain types.

3. **Dynamic programming on grids** — While less common than traversal problems, DP on matrices does appear, particularly for optimization problems. Think "Minimum Path Sum" (#64) but framed as minimizing delivery time or fuel consumption across a grid.

What's notably absent? Pure mathematical matrix operations (rotations, spirals) appear less frequently. DoorDash cares more about the grid-as-graph representation than matrix manipulation for its own sake.

<div class="code-group">

```python
# Pattern: BFS for shortest path in unweighted grid (DoorDash variation)
# Time: O(m*n) | Space: O(m*n)
from collections import deque

def shortest_delivery_path(grid, start, end):
    """
    grid: 0 = traversable road, 1 = obstacle (building)
    start/end: (row, col) tuples
    Returns: minimum steps or -1 if unreachable
    """
    if not grid or grid[start[0]][start[1]] == 1:
        return -1

    rows, cols = len(grid), len(grid[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    queue = deque([(start[0], start[1], 0)])  # (row, col, distance)
    visited = set([(start[0], start[1])])

    while queue:
        r, c, dist = queue.popleft()

        if (r, c) == end:
            return dist

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and
                grid[nr][nc] == 0 and (nr, nc) not in visited):
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))

    return -1  # No path exists
```

```javascript
// Pattern: BFS for shortest path in unweighted grid (DoorDash variation)
// Time: O(m*n) | Space: O(m*n)
function shortestDeliveryPath(grid, start, end) {
  // grid: 0 = traversable road, 1 = obstacle (building)
  // start/end: [row, col] arrays
  // Returns: minimum steps or -1 if unreachable
  if (!grid || grid[start[0]][start[1]] === 1) return -1;

  const rows = grid.length,
    cols = grid[0].length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const queue = [[start[0], start[1], 0]]; // [row, col, distance]
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift();

    if (r === end[0] && c === end[1]) return dist;

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      const key = `${nr},${nc}`;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0 && !visited.has(key)) {
        visited.add(key);
        queue.push([nr, nc, dist + 1]);
      }
    }
  }

  return -1; // No path exists
}
```

```java
// Pattern: BFS for shortest path in unweighted grid (DoorDash variation)
// Time: O(m*n) | Space: O(m*n)
import java.util.*;

public class DoorDashMatrix {
    public int shortestDeliveryPath(int[][] grid, int[] start, int[] end) {
        // grid: 0 = traversable road, 1 = obstacle (building)
        // start/end: [row, col] arrays
        // Returns: minimum steps or -1 if unreachable
        if (grid == null || grid.length == 0 || grid[start[0]][start[1]] == 1) {
            return -1;
        }

        int rows = grid.length, cols = grid[0].length;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start[0], start[1], 0});
        boolean[][] visited = new boolean[rows][cols];
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int r = current[0], c = current[1], dist = current[2];

            if (r == end[0] && c == end[1]) return dist;

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                    grid[nr][nc] == 0 && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    queue.offer(new int[]{nr, nc, dist + 1});
                }
            }
        }

        return -1;  // No path exists
    }
}
```

</div>

## How to Prepare

Most candidates make the mistake of practicing matrix problems in isolation. The DoorDash-specific approach requires you to think about the grid as a real-world map. When you practice, add these mental constraints:

1. **Always consider edge cases** — What if the start or end is blocked? What if the grid is 1x1? What if there are multiple optimal paths?
2. **Practice verbalizing your BFS/DFS choices** — Interviewers want to hear why you're using a queue vs stack, why you're marking visited at insertion vs retrieval.
3. **Memorize the direction arrays** — This seems trivial, but in interview pressure, having `directions = [(1,0), (-1,0), (0,1), (0,-1)]` at muscle memory level saves mental energy.

For weighted grid problems (like delivery time optimization), practice Dijkstra's algorithm on grids. The pattern is similar to BFS but with a priority queue:

<div class="code-group">

```python
# Pattern: Dijkstra's algorithm for weighted grid (delivery time optimization)
# Time: O(m*n*log(m*n)) | Space: O(m*n)
import heapq

def min_delivery_time(grid, start, end):
    """
    grid: positive integers representing traversal time per cell
    Returns: minimum total time to reach end
    """
    rows, cols = len(grid), len(grid[0])
    min_time = [[float('inf')] * cols for _ in range(rows)]
    min_time[start[0]][start[1]] = grid[start[0]][start[1]]

    # (total_time, row, col)
    heap = [(grid[start[0]][start[1]], start[0], start[1])]
    directions = [(1,0), (-1,0), (0,1), (0,-1)]

    while heap:
        time, r, c = heapq.heappop(heap)

        if (r, c) == end:
            return time

        if time > min_time[r][c]:
            continue

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                new_time = time + grid[nr][nc]
                if new_time < min_time[nr][nc]:
                    min_time[nr][nc] = new_time
                    heapq.heappush(heap, (new_time, nr, nc))

    return -1  # Unreachable
```

```javascript
// Pattern: Dijkstra's algorithm for weighted grid (delivery time optimization)
// Time: O(m*n*log(m*n)) | Space: O(m*n)
function minDeliveryTime(grid, start, end) {
  // grid: positive integers representing traversal time per cell
  // Returns: minimum total time to reach end
  const rows = grid.length,
    cols = grid[0].length;
  const minTime = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  minTime[start[0]][start[1]] = grid[start[0]][start[1]];

  // [total_time, row, col]
  const heap = new MinHeap((a, b) => a[0] - b[0]);
  heap.insert([grid[start[0]][start[1]], start[0], start[1]]);
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (!heap.isEmpty()) {
    const [time, r, c] = heap.extractMin();

    if (r === end[0] && c === end[1]) return time;

    if (time > minTime[r][c]) continue;

    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const newTime = time + grid[nr][nc];
        if (newTime < minTime[nr][nc]) {
          minTime[nr][nc] = newTime;
          heap.insert([newTime, nr, nc]);
        }
      }
    }
  }

  return -1; // Unreachable
}

// MinHeap implementation omitted for brevity
```

```java
// Pattern: Dijkstra's algorithm for weighted grid (delivery time optimization)
// Time: O(m*n*log(m*n)) | Space: O(m*n)
import java.util.*;

public class DeliveryOptimization {
    public int minDeliveryTime(int[][] grid, int[] start, int[] end) {
        // grid: positive integers representing traversal time per cell
        // Returns: minimum total time to reach end
        int rows = grid.length, cols = grid[0].length;
        int[][] minTime = new int[rows][cols];
        for (int[] row : minTime) Arrays.fill(row, Integer.MAX_VALUE);
        minTime[start[0]][start[1]] = grid[start[0]][start[1]];

        // [total_time, row, col]
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.offer(new int[]{grid[start[0]][start[1]], start[0], start[1]});
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

        while (!heap.isEmpty()) {
            int[] current = heap.poll();
            int time = current[0], r = current[1], c = current[2];

            if (r == end[0] && c == end[1]) return time;

            if (time > minTime[r][c]) continue;

            for (int[] dir : directions) {
                int nr = r + dir[0], nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    int newTime = time + grid[nr][nc];
                    if (newTime < minTime[nr][nc]) {
                        minTime[nr][nc] = newTime;
                        heap.offer(new int[]{newTime, nr, nc});
                    }
                }
            }
        }

        return -1;  // Unreachable
    }
}
```

</div>

## How DoorDash Tests Matrix vs Other Companies

DoorDash's matrix questions differ from other companies in subtle but important ways:

**Compared to Google**: Google might ask more mathematically elegant matrix problems (rotations, spirals, linear algebra applications). DoorDash focuses on practical traversal with business-logic constraints.

**Compared to Facebook/Meta**: Facebook often uses matrices to represent social networks (adjacency matrices). DoorDash almost always uses them as literal grids/maps.

**Compared to Amazon**: Amazon's matrix problems sometimes involve storage optimization (2D packing problems). DoorDash's are exclusively about movement through space.

The unique DoorDash signature: they love to add "multiple points of interest" — think delivering to several restaurants before reaching the customer. This turns a simple BFS into a traveling salesman problem on a grid, which is significantly more challenging.

## Study Order

Don't jump straight into complex matrix problems. Follow this progression:

1. **Basic traversal (DFS/BFS)** — Master moving through empty grids before adding constraints. Understand when to use DFS (exploring all paths) vs BFS (shortest path).
2. **Connected components** — Problems like "Number of Islands" (#200) teach you to modify grids in-place and track visited cells efficiently.
3. **Shortest path in unweighted grids** — This is where BFS shines. Practice until you can write it flawlessly in 3 minutes.
4. **Path with obstacles** — Now add constraints like walls or restricted areas. LeetCode #490 "The Maze" is perfect.
5. **Weighted grids (Dijkstra)** — Learn to use priority queues for variable costs per cell.
6. **Multiple targets/waypoints** — The DoorDash specialty. Practice problems where you need to visit intermediate points.
7. **Dynamic programming on grids** — Save this for last, as it's less frequent but still appears.

## Recommended Practice Order

Solve these in sequence to build up your DoorDash matrix skills:

1. **Number of Islands (#200)** — Master DFS/BFS and component counting
2. **Rotting Oranges (#994)** — Multi-source BFS, great for simultaneous deliveries
3. **The Maze (#490)** — BFS with obstacles (basic DoorDash scenario)
4. **The Maze II (#505)** — Weighted version, introduces Dijkstra on grids
5. **Shortest Path in Binary Matrix (#1091)** — Pure BFS shortest path
6. **Minimum Path Sum (#64)** — DP on grids, optimization thinking
7. **Unique Paths II (#63)** — DP with obstacles
8. **Walls and Gates (#286)** — Multi-source BFS with distance recording
9. **01 Matrix (#542)** — Another multi-source BFS variation
10. **As Far from Land as Possible (#1162)** — Advanced BFS pattern

After these, search for "DoorDash tagged" matrix problems on LeetCode to see their actual interview questions.

The key to DoorDash matrix success isn't just knowing algorithms — it's framing every problem as a delivery logistics challenge. When you look at a grid, see city blocks. When you see different cell values, see delivery times or traffic conditions. This mindset shift is what separates candidates who solve the problem from those who impress the interviewer.

[Practice Matrix at DoorDash](/company/doordash/matrix)
