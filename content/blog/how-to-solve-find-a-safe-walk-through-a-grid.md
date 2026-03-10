---
title: "How to Solve Find a Safe Walk Through a Grid — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find a Safe Walk Through a Grid. Medium difficulty, 32.7% acceptance rate. Topics: Array, Breadth-First Search, Graph Theory, Heap (Priority Queue), Matrix."
date: "2029-01-30"
category: "dsa-patterns"
tags: ["find-a-safe-walk-through-a-grid", "array", "breadth-first-search", "graph-theory", "medium"]
---

# How to Solve Find a Safe Walk Through a Grid

You need to find if you can travel from the top-left to bottom-right corner of a binary grid while maintaining positive health. Each cell with a `1` costs 1 health point to enter, while `0` cells are free. You start with a given `health` value. The tricky part is that you can't just find any path—you need a path where your health never drops to zero or below at any point. This is essentially a pathfinding problem with a resource constraint, similar to finding a path with minimum cost but with a strict requirement that the resource never depletes completely.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
grid = [
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 0]
]
health = 3
```

We start at `(0,0)` with health = 3. The cell is `0`, so health remains 3.

**Step 1:** From `(0,0)`, we can go right to `(0,1)` or down to `(1,0)`:

- Right to `(0,1)`: This cell is `1`, so health becomes 2
- Down to `(1,0)`: This cell is `1`, so health becomes 2

**Step 2:** Let's trace the right path first. From `(0,1)` with health=2:

- We could go right to `(0,2)` (0 cell, health=2)
- Or down to `(1,1)` (1 cell, health=1)

If we go right to `(0,2)` with health=2, then down to `(1,2)` (0 cell, health=2), then down to `(2,2)` (0 cell, health=2) — we reach the destination with health=2! This is a valid path.

But what if we had taken a different route? The key insight is that we need to track the **maximum remaining health** we can have at each cell when arriving from different paths. For example, arriving at `(1,1)` with health=1 might not be as good as arriving with health=2 from a different path, even if both paths reach the same cell.

## Brute Force Approach

A naive approach would be to explore all possible paths from start to end using DFS or BFS, tracking current health along each path. We'd return `true` if any path reaches the destination with health > 0.

The problem with this approach is the exponential time complexity. For an `m × n` grid, there could be `O(2^(m+n))` paths to explore in the worst case. Even with pruning (stopping when health ≤ 0), the search space is still enormous for typical grid sizes (up to 100×100 in LeetCode constraints).

Here's what the brute force DFS might look like:

<div class="code-group">

```python
# Brute Force DFS - Too slow for large grids
def hasSafePath(grid, health):
    m, n = len(grid), len(grid[0])

    def dfs(r, c, current_health):
        # If health drops to 0 or below, this path is invalid
        if current_health <= 0:
            return False

        # If we reached the destination
        if r == m - 1 and c == n - 1:
            return True

        # Try all four directions
        for dr, dc in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                new_health = current_health - grid[nr][nc]
                if dfs(nr, nc, new_health):
                    return True

        return False

    # Start with initial health minus cost of starting cell
    start_health = health - grid[0][0]
    return dfs(0, 0, start_health)
```

```javascript
// Brute Force DFS - Too slow for large grids
function hasSafePath(grid, health) {
  const m = grid.length,
    n = grid[0].length;

  function dfs(r, c, currentHealth) {
    // If health drops to 0 or below, this path is invalid
    if (currentHealth <= 0) return false;

    // If we reached the destination
    if (r === m - 1 && c === n - 1) return true;

    // Try all four directions
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        const newHealth = currentHealth - grid[nr][nc];
        if (dfs(nr, nc, newHealth)) return true;
      }
    }

    return false;
  }

  // Start with initial health minus cost of starting cell
  const startHealth = health - grid[0][0];
  return dfs(0, 0, startHealth);
}
```

```java
// Brute Force DFS - Too slow for large grids
public boolean hasSafePath(int[][] grid, int health) {
    int m = grid.length, n = grid[0].length;
    return dfs(0, 0, health - grid[0][0], grid, m, n);
}

private boolean dfs(int r, int c, int currentHealth, int[][] grid, int m, int n) {
    // If health drops to 0 or below, this path is invalid
    if (currentHealth <= 0) return false;

    // If we reached the destination
    if (r == m - 1 && c == n - 1) return true;

    // Try all four directions
    int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
    for (int[] dir : directions) {
        int nr = r + dir[0], nc = c + dir[1];
        if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
            int newHealth = currentHealth - grid[nr][nc];
            if (dfs(nr, nc, newHealth, grid, m, n)) return true;
        }
    }

    return false;
}
```

</div>

This brute force approach will time out on larger grids because it explores too many redundant paths.

## Optimized Approach

The key insight is that we need to track the **maximum remaining health** we can have when reaching each cell. This is a classic Dijkstra-like approach but with a twist: instead of minimizing total cost, we want to maximize remaining health.

Think of it this way:

- Each cell with `1` reduces health by 1
- We want to ensure health stays positive throughout the journey
- At each cell, we care about the path that gives us the **maximum remaining health** when we get there

We can use a max-heap (priority queue) to always explore from the cell where we have the most health remaining. This is similar to Dijkstra's algorithm but with a max-heap instead of a min-heap because we want to maximize health, not minimize distance.

**Why this works:**

1. If we reach a cell with higher health than we've seen before, that's better because it gives us more buffer for future `1` cells
2. By always processing the cell with maximum current health first, we ensure we find the best possible path to each cell early
3. If we can reach the destination with any positive health, we succeed

**Step-by-step reasoning:**

1. Start at `(0,0)` with initial health (minus cost of starting cell)
2. Use a max-heap to store `(health, row, col)` tuples
3. Keep track of the best health we've seen for each cell
4. For each neighbor, calculate new health = current health - grid[neighbor]
5. If new health > best health for that neighbor, update and push to heap
6. Stop when we reach destination or heap is empty

## Optimal Solution

Here's the complete solution using a max-heap (priority queue) approach:

<div class="code-group">

```python
# Time: O(m*n*log(m*n)) | Space: O(m*n)
def hasSafePath(grid, health):
    m, n = len(grid), len(grid[0])

    # Max-heap (using negative values since Python has min-heap)
    # Each element is (-health, row, col) - we negate health to get max-heap behavior
    heap = []

    # Track the maximum health we've seen at each cell
    # Initialize with -inf since we want to maximize health
    max_health_at = [[float('-inf')] * n for _ in range(m)]

    # Start at (0,0) with initial health
    start_health = health - grid[0][0]
    if start_health <= 0:
        return False  # Can't even start

    # Push starting position to heap
    heapq.heappush(heap, (-start_health, 0, 0))
    max_health_at[0][0] = start_health

    # Four possible directions: right, down, left, up
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    while heap:
        # Get the cell with maximum current health
        neg_health, r, c = heapq.heappop(heap)
        current_health = -neg_health

        # If we reached the destination
        if r == m - 1 and c == n - 1:
            return True

        # Explore all four neighbors
        for dr, dc in directions:
            nr, nc = r + dr, c + dc

            # Check if neighbor is within bounds
            if 0 <= nr < m and 0 <= nc < n:
                # Calculate health after moving to neighbor
                new_health = current_health - grid[nr][nc]

                # We only care if this gives us BETTER health at this cell
                # Also, health must remain positive
                if new_health > 0 and new_health > max_health_at[nr][nc]:
                    # Update best health for this cell
                    max_health_at[nr][nc] = new_health
                    # Push to heap (negate for max-heap behavior)
                    heapq.heappush(heap, (-new_health, nr, nc))

    # If we exhaust all possibilities without reaching destination
    return False
```

```javascript
// Time: O(m*n*log(m*n)) | Space: O(m*n)
function hasSafePath(grid, health) {
  const m = grid.length,
    n = grid[0].length;

  // Max-heap using a priority queue (simulated with array and sorting)
  // In a real interview, you might implement a proper heap class
  const heap = new MaxHeap();

  // Track the maximum health we've seen at each cell
  const maxHealthAt = Array(m)
    .fill()
    .map(() => Array(n).fill(-Infinity));

  // Start at (0,0) with initial health
  const startHealth = health - grid[0][0];
  if (startHealth <= 0) return false; // Can't even start

  // Push starting position to heap
  heap.push([startHealth, 0, 0]);
  maxHealthAt[0][0] = startHealth;

  // Four possible directions: right, down, left, up
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  while (!heap.isEmpty()) {
    // Get the cell with maximum current health
    const [currentHealth, r, c] = heap.pop();

    // If we reached the destination
    if (r === m - 1 && c === n - 1) return true;

    // Explore all four neighbors
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;

      // Check if neighbor is within bounds
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        // Calculate health after moving to neighbor
        const newHealth = currentHealth - grid[nr][nc];

        // We only care if this gives us BETTER health at this cell
        // Also, health must remain positive
        if (newHealth > 0 && newHealth > maxHealthAt[nr][nc]) {
          // Update best health for this cell
          maxHealthAt[nr][nc] = newHealth;
          // Push to heap
          heap.push([newHealth, nr, nc]);
        }
      }
    }
  }

  // If we exhaust all possibilities without reaching destination
  return false;
}

// Simple MaxHeap implementation for demonstration
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this.heap.sort((a, b) => b[0] - a[0]); // Sort by health descending
  }

  pop() {
    return this.heap.shift();
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}
```

```java
// Time: O(m*n*log(m*n)) | Space: O(m*n)
public boolean hasSafePath(int[][] grid, int health) {
    int m = grid.length, n = grid[0].length;

    // Max-heap using PriorityQueue with custom comparator
    // We store [health, row, col] and sort by health descending
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[0] - a[0]);

    // Track the maximum health we've seen at each cell
    int[][] maxHealthAt = new int[m][n];
    for (int i = 0; i < m; i++) {
        Arrays.fill(maxHealthAt[i], Integer.MIN_VALUE);
    }

    // Start at (0,0) with initial health
    int startHealth = health - grid[0][0];
    if (startHealth <= 0) return false;  // Can't even start

    // Push starting position to heap
    heap.offer(new int[]{startHealth, 0, 0});
    maxHealthAt[0][0] = startHealth;

    // Four possible directions: right, down, left, up
    int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    while (!heap.isEmpty()) {
        // Get the cell with maximum current health
        int[] current = heap.poll();
        int currentHealth = current[0];
        int r = current[1];
        int c = current[2];

        // If we reached the destination
        if (r == m - 1 && c == n - 1) return true;

        // Explore all four neighbors
        for (int[] dir : directions) {
            int nr = r + dir[0];
            int nc = c + dir[1];

            // Check if neighbor is within bounds
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                // Calculate health after moving to neighbor
                int newHealth = currentHealth - grid[nr][nc];

                // We only care if this gives us BETTER health at this cell
                // Also, health must remain positive
                if (newHealth > 0 && newHealth > maxHealthAt[nr][nc]) {
                    // Update best health for this cell
                    maxHealthAt[nr][nc] = newHealth;
                    // Push to heap
                    heap.offer(new int[]{newHealth, nr, nc});
                }
            }
        }
    }

    // If we exhaust all possibilities without reaching destination
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m × n × log(m × n))`

- We might visit each cell multiple times, but we only process a cell when we find a better path to it
- In the worst case, each cell could be updated `O(m × n)` times, but with the heap optimization, it's much better
- Each heap operation takes `O(log(k))` where `k` is the heap size (at most `m × n`)
- Overall, we get `O(m × n × log(m × n))`

**Space Complexity:** `O(m × n)`

- We store the `max_health_at` matrix: `O(m × n)`
- The heap can contain up to `O(m × n)` elements in worst case
- Total space: `O(m × n)`

## Common Mistakes

1. **Not checking the starting cell**: The starting cell `(0,0)` might contain a `1`, which costs health immediately. Forgetting to subtract this cost before checking if health > 0 is a common oversight.

2. **Using DFS/BFS without tracking best health per cell**: Candidates often try simple BFS/DFS and get Time Limit Exceeded. The key is to realize that reaching a cell with higher health is always better, so we should track the maximum health for each cell.

3. **Wrong heap ordering**: Using a min-heap instead of max-heap (or forgetting to negate values in Python's min-heap). We want to explore from the cell with maximum remaining health first.

4. **Not checking health positivity before pushing to heap**: If health drops to 0 or below, we shouldn't explore further from that path. Check `new_health > 0` before adding to heap.

## When You'll See This Pattern

This problem uses a **modified Dijkstra's algorithm** with a **max-heap** instead of min-heap. You'll see similar patterns in:

1. **Shortest Path in a Grid with Obstacles Elimination (LeetCode 1293)**: Very similar concept but with obstacle elimination count instead of health. Uses BFS with state `(row, col, k)` where k is obstacles removed.

2. **Path With Minimum Effort (LeetCode 1631)**: Find path that minimizes maximum absolute difference in heights. Uses Dijkstra-like approach with min-heap.

3. **Cheapest Flights Within K Stops (LeetCode 787)**: Dijkstra with constraint on number of stops. Similar state tracking approach.

The core pattern is: **When you need to find a path with resource constraints (health, stops, obstacle removals), use Dijkstra/BFS with state tracking and prioritize exploring the most promising states first.**

## Key Takeaways

1. **Max-heap for maximizing resources**: When you need to maximize something (like remaining health) along a path, use a max-heap to always explore from the most promising state.

2. **State tracking is crucial**: Store the best value (max health, min cost, etc.) you've seen for each cell/state to avoid redundant exploration.

3. **Dijkstra adapts to various constraints**: The classic shortest-path algorithm can be modified for different optimization goals (maximizing health instead of minimizing distance) by changing the heap ordering and state representation.

Related problems: [Shortest Path in a Grid with Obstacles Elimination](/problem/shortest-path-in-a-grid-with-obstacles-elimination)
