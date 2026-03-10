---
title: "How to Solve Nearest Exit from Entrance in Maze — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Nearest Exit from Entrance in Maze. Medium difficulty, 48.3% acceptance rate. Topics: Array, Breadth-First Search, Matrix."
date: "2028-03-13"
category: "dsa-patterns"
tags: ["nearest-exit-from-entrance-in-maze", "array", "breadth-first-search", "matrix", "medium"]
---

# How to Solve Nearest Exit from Entrance in Maze

You're given a maze represented as a grid with empty cells ('.') and walls ('+'), along with an entrance cell. You need to find the shortest path from the entrance to any exit cell, where an exit is defined as any empty cell on the border of the maze that is not the entrance itself. The challenge lies in efficiently finding the shortest path in what is essentially an unweighted grid, where each move has equal cost.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Maze:
+ . + + + + +
+ . + . . . +
+ . + . + . +
+ . . . + . +
+ + + + + . +
Entrance: [3,2] (0-indexed, row 3, column 2)
```

**Step 1:** The entrance at (3,2) is not on the border, so it's not an exit. We mark it as visited.

**Step 2:** From (3,2), we can move to:

- (2,2) - up (valid, empty, not visited)
- (4,2) - down (valid, empty, not visited)
- (3,1) - left (valid, empty, not visited)
- (3,3) - right (valid, empty, not visited)

All are at distance 1 from entrance.

**Step 3:** Process (2,2): Not on border. Explore neighbors:

- (1,2) - up (valid, empty)
- (3,2) - down (already visited)
- (2,1) - left (wall '+')
- (2,3) - right (wall '+')

**Step 4:** Process (4,2): On border! But wait - it's row 4, which is the last row (m-1 = 4). However, we need to check: is it the entrance? No. Is it empty? Yes. This is an exit at distance 1!

But actually, looking at the maze, (4,2) is a wall ('+'), so it's not a valid move. Let me correct: (4,2) is actually a wall in our example, so we wouldn't go there.

**Step 5:** Process (3,1): Not on border. Explore neighbors...

**Step 6:** Process (3,3): Not on border. Explore neighbors...

**Step 7:** Continue this BFS process. The first border cell we reach that's not the entrance will be our answer. In this maze, the shortest path is 7 steps to reach border cell (0,1).

The key insight: We need to explore level by level (BFS) because the first time we reach any border cell (that's not the entrance), we've found the shortest path to an exit.

## Brute Force Approach

A naive approach might try DFS (depth-first search) to explore all possible paths and track the minimum distance. Here's what that would look like:

1. From the entrance, recursively explore all four directions
2. Keep track of visited cells to avoid cycles
3. When reaching any border cell (that's not the entrance), update the minimum distance
4. Return the minimum distance found

The problem with DFS is that it explores paths in a depth-first manner, which means it might take a very long, winding path before finding an exit, even if a shorter path exists. In the worst case, DFS would explore all possible paths, which is O(4^(m\*n)) in a grid where every cell is empty - exponentially slow!

Even with memoization (caching the shortest distance from each cell to an exit), we'd still need to explore the entire grid in worst case, but more importantly, DFS doesn't guarantee we find the shortest path first - we'd need to explore ALL paths to find the minimum.

## Optimized Approach

The key insight is that this is essentially finding the shortest path in an **unweighted grid**, which is a classic BFS (breadth-first search) problem. BFS explores all cells at distance 1, then all cells at distance 2, and so on. The first time we encounter a valid exit (border cell that's not the entrance), we know we've found the shortest path.

**Why BFS works for shortest path in unweighted graphs:**

- In unweighted graphs, all edges have equal cost (1 move = 1 step)
- BFS explores nodes in order of their distance from the start
- The first time we reach a destination, it must be via the shortest path

**Algorithm steps:**

1. Use a queue for BFS, initialized with the entrance cell and distance 0
2. Mark the entrance as visited immediately
3. While queue is not empty:
   - Dequeue a cell and its distance
   - If this cell is on the border AND it's not the entrance, return the distance
   - Otherwise, explore all four neighbors (up, down, left, right)
   - For each valid neighbor (within bounds, empty, not visited), add to queue with distance+1
4. If queue empties without finding an exit, return -1

**Important nuance:** We need to check if a cell is an exit **when we process it from the queue**, not when we add it to the queue. This ensures we don't accidentally return the entrance as an exit.

## Optimal Solution

Here's the complete BFS solution with detailed comments:

<div class="code-group">

```python
# Time: O(m * n) - in worst case, we visit every cell once
# Space: O(m * n) - for the visited set and queue in worst case
from collections import deque

def nearestExit(maze, entrance):
    m, n = len(maze), len(maze[0])

    # Directions: up, down, left, right
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    # Queue for BFS: stores (row, col, distance)
    queue = deque()
    queue.append((entrance[0], entrance[1], 0))

    # Mark entrance as visited immediately
    # We can use a set or modify the maze in-place
    visited = [[False] * n for _ in range(m)]
    visited[entrance[0]][entrance[1]] = True

    while queue:
        row, col, dist = queue.popleft()

        # Check if current cell is an exit
        # Exit conditions: on border AND not the entrance
        # Note: We check when popping, not when adding to queue
        if (row == 0 or row == m - 1 or col == 0 or col == n - 1):
            if not (row == entrance[0] and col == entrance[1]):
                return dist

        # Explore all four neighbors
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check if neighbor is valid:
            # 1. Within bounds
            # 2. Is empty cell ('.')
            # 3. Not visited yet
            if (0 <= new_row < m and 0 <= new_col < n and
                maze[new_row][new_col] == '.' and
                not visited[new_row][new_col]):

                # Mark as visited and add to queue
                visited[new_row][new_col] = True
                queue.append((new_row, new_col, dist + 1))

    # If we exhaust the queue without finding an exit
    return -1
```

```javascript
// Time: O(m * n) - in worst case, we visit every cell once
// Space: O(m * n) - for the visited array and queue in worst case
function nearestExit(maze, entrance) {
  const m = maze.length;
  const n = maze[0].length;

  // Directions: up, down, left, right
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Queue for BFS: stores [row, col, distance]
  const queue = [];
  queue.push([entrance[0], entrance[1], 0]);

  // Mark entrance as visited immediately
  const visited = Array(m)
    .fill()
    .map(() => Array(n).fill(false));
  visited[entrance[0]][entrance[1]] = true;

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();

    // Check if current cell is an exit
    // Exit conditions: on border AND not the entrance
    // Note: We check when dequeuing, not when enqueuing
    if (row === 0 || row === m - 1 || col === 0 || col === n - 1) {
      if (!(row === entrance[0] && col === entrance[1])) {
        return dist;
      }
    }

    // Explore all four neighbors
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if neighbor is valid:
      // 1. Within bounds
      // 2. Is empty cell ('.')
      // 3. Not visited yet
      if (
        newRow >= 0 &&
        newRow < m &&
        newCol >= 0 &&
        newCol < n &&
        maze[newRow][newCol] === "." &&
        !visited[newRow][newCol]
      ) {
        // Mark as visited and add to queue
        visited[newRow][newCol] = true;
        queue.push([newRow, newCol, dist + 1]);
      }
    }
  }

  // If we exhaust the queue without finding an exit
  return -1;
}
```

```java
// Time: O(m * n) - in worst case, we visit every cell once
// Space: O(m * n) - for the visited array and queue in worst case
import java.util.LinkedList;
import java.util.Queue;

public int nearestExit(char[][] maze, int[] entrance) {
    int m = maze.length;
    int n = maze[0].length;

    // Directions: up, down, left, right
    int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    // Queue for BFS: stores row, col, and distance
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{entrance[0], entrance[1], 0});

    // Mark entrance as visited immediately
    boolean[][] visited = new boolean[m][n];
    visited[entrance[0]][entrance[1]] = true;

    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int row = current[0];
        int col = current[1];
        int dist = current[2];

        // Check if current cell is an exit
        // Exit conditions: on border AND not the entrance
        // Note: We check when polling, not when offering
        if (row == 0 || row == m - 1 || col == 0 || col == n - 1) {
            if (!(row == entrance[0] && col == entrance[1])) {
                return dist;
            }
        }

        // Explore all four neighbors
        for (int[] dir : directions) {
            int newRow = row + dir[0];
            int newCol = col + dir[1];

            // Check if neighbor is valid:
            // 1. Within bounds
            // 2. Is empty cell ('.')
            // 3. Not visited yet
            if (newRow >= 0 && newRow < m &&
                newCol >= 0 && newCol < n &&
                maze[newRow][newCol] == '.' &&
                !visited[newRow][newCol]) {

                // Mark as visited and add to queue
                visited[newRow][newCol] = true;
                queue.offer(new int[]{newRow, newCol, dist + 1});
            }
        }
    }

    // If we exhaust the queue without finding an exit
    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- In the worst case, we might need to visit every cell in the maze once
- Each cell is processed exactly once when dequeued
- Each cell's neighbors are checked (constant 4 operations) when processed
- Total operations proportional to number of cells: m × n

**Space Complexity: O(m × n)**

- The `visited` array requires O(m × n) space
- The queue in BFS could contain up to O(m × n) elements in worst case (e.g., when maze is all empty cells and we process them level by level)
- In practice, the queue size is at most the perimeter of the current BFS frontier, but worst-case analysis considers maximum possible usage

## Common Mistakes

1. **Not marking the entrance as visited immediately**: If you forget to mark the entrance visited before starting BFS, you might accidentally "exit" through the entrance if it happens to be on a border. The problem specifically says exits cannot be the entrance.

2. **Checking for exit when enqueuing instead of dequeuing**: If you check if a cell is an exit when adding it to the queue, you might return the entrance itself as an exit (distance 0). The correct approach is to check when processing a cell from the queue.

3. **Forgetting that walls are impassable**: Some candidates check `maze[newRow][newCol] != '+'` instead of explicitly checking for `'.'`. While this often works, it's clearer to check for empty cells explicitly.

4. **Using DFS instead of BFS**: This is the most critical mistake. DFS doesn't guarantee shortest path in unweighted graphs. BFS explores nodes in order of distance, so the first exit found is the closest one.

5. **Not handling the case where no exit exists**: Always remember to return -1 if the BFS completes without finding an exit. Some candidates forget this edge case.

## When You'll See This Pattern

This problem uses **BFS on a grid**, a pattern that appears in many LeetCode problems:

1. **Number of Islands (LeetCode 200)**: Uses BFS/DFS to explore connected components in a grid.
2. **Rotting Oranges (LeetCode 994)**: Multi-source BFS on a grid where oranges rot neighboring oranges.
3. **Walls and Gates (LeetCode 286)**: BFS from multiple starting points to find shortest distances.
4. **Shortest Path in Binary Matrix (LeetCode 1091)**: Almost identical to this problem but with 8-direction movement.

The core pattern: When you need the **shortest path in an unweighted grid** or need to **explore cells level by level**, BFS is almost always the right choice. The grid structure with movement in 4 directions (sometimes 8) is a common constraint.

## Key Takeaways

1. **BFS finds shortest paths in unweighted graphs**: When all moves have equal cost (like moving one cell in a grid), BFS explores nodes in order of distance from the start. The first time you reach a target, you've found the shortest path.

2. **Grid BFS follows a template**: Initialize queue with start, mark visited, while queue not empty: process current, check neighbors, add valid ones. The directions array `[(-1,0),(1,0),(0,-1),(0,1)]` is standard for 4-direction movement.

3. **Check conditions at the right time**: For this problem, checking exit conditions when dequeuing (not enqueuing) is crucial to avoid incorrectly returning the entrance as an exit.

[Practice this problem on CodeJeet](/problem/nearest-exit-from-entrance-in-maze)
