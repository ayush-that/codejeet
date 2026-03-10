---
title: "Breadth-First Search Questions at Amazon: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Amazon — patterns, difficulty breakdown, and study tips."
date: "2027-02-27"
category: "dsa-patterns"
tags: ["amazon", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Amazon: What to Expect

Amazon has 147 Breadth-First Search questions in their interview question bank out of 1938 total. That's about 7.6% of all questions, which might not sound huge, but here's the reality: BFS is one of Amazon's most frequently tested algorithmic concepts in live interviews. Why? Because Amazon's business is built on graphs — from product recommendation networks and delivery route optimization to AWS infrastructure and organizational hierarchies. BFS isn't just an academic exercise for them; it's a practical tool they use daily.

In my experience conducting and passing Amazon interviews, I'd estimate about 1 in 3 onsite interviews includes some form of BFS question. They don't always present it as "implement BFS" — often it's disguised as a shortest path problem, level-order traversal, or connectivity check. The key insight is that Amazon values BFS for its ability to find shortest paths in unweighted graphs, which maps directly to problems like finding the minimum steps between warehouse locations, the fewest clicks between product pages, or the shortest chain between employees in an org chart.

## Specific Patterns Amazon Favors

Amazon's BFS questions tend to cluster around three specific patterns:

1. **Shortest Path in Unweighted Grids** — This is their absolute favorite. Think "robot in a warehouse" or "delivery driver navigation" scenarios. They love giving you a 2D grid with obstacles (0s and 1s) and asking for the shortest path from point A to point B. The twist is usually in the movement rules — can you move diagonally? Can you break obstacles? Do you need to collect keys first?

2. **Level-Order Traversal Variations** — While basic level-order traversal of trees appears, Amazon prefers problems where you need to track something per level. For example, finding the largest value on each level (LeetCode #515), or connecting nodes at the same level (LeetCode #116).

3. **Multi-Source BFS** — This is an advanced pattern that appears more at Amazon than at other companies. Instead of starting BFS from one point, you start from multiple points simultaneously. This is perfect for problems like "rotting oranges" (LeetCode #994) or "walls and gates" (LeetCode #286) where you need to find the distance from the nearest source.

Here's the classic multi-source BFS pattern for "Rotting Oranges":

<div class="code-group">

```python
from collections import deque
from typing import List

def orangesRotting(grid: List[List[int]]) -> int:
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes = 0

    # Multi-source initialization: add all rotten oranges to queue
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # If no fresh oranges initially
    if fresh_count == 0:
        return 0

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    # BFS with level tracking
    while queue and fresh_count > 0:
        minutes += 1
        level_size = len(queue)

        for _ in range(level_size):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh_count -= 1
                    queue.append((nr, nc))

    return minutes if fresh_count == 0 else -1

# Time: O(rows * cols) | Space: O(rows * cols)
# We visit each cell at most once, and the queue can hold all cells
```

```javascript
function orangesRotting(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Multi-source initialization
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        freshCount++;
      }
    }
  }

  if (freshCount === 0) return 0;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // BFS with level tracking
  while (queue.length > 0 && freshCount > 0) {
    minutes++;
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          freshCount--;
          queue.push([nr, nc]);
        }
      }
    }
  }

  return freshCount === 0 ? minutes : -1;
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

```java
import java.util.LinkedList;
import java.util.Queue;

public int orangesRotting(int[][] grid) {
    if (grid == null || grid.length == 0) return 0;

    int rows = grid.length;
    int cols = grid[0].length;
    Queue<int[]> queue = new LinkedList<>();
    int freshCount = 0;
    int minutes = 0;

    // Multi-source initialization
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) {
                queue.offer(new int[]{r, c});
            } else if (grid[r][c] == 1) {
                freshCount++;
            }
        }
    }

    if (freshCount == 0) return 0;

    int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

    // BFS with level tracking
    while (!queue.isEmpty() && freshCount > 0) {
        minutes++;
        int levelSize = queue.size();

        for (int i = 0; i < levelSize; i++) {
            int[] current = queue.poll();
            int r = current[0];
            int c = current[1];

            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;
                    freshCount--;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }
    }

    return freshCount == 0 ? minutes : -1;
}

// Time: O(rows * cols) | Space: O(rows * cols)
```

</div>

## How to Prepare

The biggest mistake I see candidates make with Amazon BFS questions is not recognizing when to use BFS vs DFS. Here's the rule: **If the question asks for "shortest" or "minimum" in an unweighted graph, it's almost always BFS.** DFS can't guarantee shortest path without exploring all possibilities.

When implementing BFS for Amazon interviews, always include these elements:

1. A queue (deque in Python, Array in JavaScript, LinkedList in Java)
2. A visited set or mechanism to avoid revisiting nodes
3. Level tracking when you need to count steps or process by level
4. Boundary checks for grid problems

Here's the template for shortest path in a grid:

<div class="code-group">

```python
from collections import deque
from typing import List

def shortestPathBinaryMatrix(grid: List[List[int]]) -> int:
    if not grid or grid[0][0] == 1:
        return -1

    n = len(grid)
    if n == 1:
        return 1 if grid[0][0] == 0 else -1

    queue = deque([(0, 0)])
    grid[0][0] = 1  # Mark as visited by changing value
    distance = 1

    # 8 directions for diagonal movement
    directions = [(-1, -1), (-1, 0), (-1, 1),
                  (0, -1),          (0, 1),
                  (1, -1),  (1, 0), (1, 1)]

    while queue:
        level_size = len(queue)

        for _ in range(level_size):
            r, c = queue.popleft()

            # Check if reached destination
            if r == n - 1 and c == n - 1:
                return distance

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:
                    grid[nr][nc] = 1  # Mark as visited
                    queue.append((nr, nc))

        distance += 1

    return -1

# Time: O(n²) | Space: O(n²) in worst case when queue holds all cells
```

```javascript
function shortestPathBinaryMatrix(grid) {
  if (!grid || grid[0][0] === 1) return -1;

  const n = grid.length;
  if (n === 1) return grid[0][0] === 0 ? 1 : -1;

  const queue = [[0, 0]];
  grid[0][0] = 1; // Mark as visited
  let distance = 1;

  // 8 directions including diagonals
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      if (r === n - 1 && c === n - 1) {
        return distance;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
          grid[nr][nc] = 1;
          queue.push([nr, nc]);
        }
      }
    }

    distance++;
  }

  return -1;
}

// Time: O(n²) | Space: O(n²)
```

```java
import java.util.LinkedList;
import java.util.Queue;

public int shortestPathBinaryMatrix(int[][] grid) {
    if (grid == null || grid[0][0] == 1) return -1;

    int n = grid.length;
    if (n == 1) return grid[0][0] == 0 ? 1 : -1;

    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{0, 0});
    grid[0][0] = 1;  // Mark as visited
    int distance = 1;

    int[][] directions = {
        {-1, -1}, {-1, 0}, {-1, 1},
        {0, -1},           {0, 1},
        {1, -1},  {1, 0},  {1, 1}
    };

    while (!queue.isEmpty()) {
        int levelSize = queue.size();

        for (int i = 0; i < levelSize; i++) {
            int[] current = queue.poll();
            int r = current[0];
            int c = current[1];

            if (r == n - 1 && c == n - 1) {
                return distance;
            }

            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];

                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {
                    grid[nr][nc] = 1;
                    queue.offer(new int[]{nr, nc});
                }
            }
        }

        distance++;
    }

    return -1;
}

// Time: O(n²) | Space: O(n²)
```

</div>

## How Amazon Tests Breadth-First Search vs Other Companies

Amazon's BFS questions have a distinct flavor compared to other FAANG companies:

**vs Google**: Google tends toward more theoretical graph problems with cleaner mathematical properties. Amazon's problems are messier, more practical, and often involve business scenarios (warehouses, deliveries, networks).

**vs Facebook/Meta**: Meta loves tree BFS (level-order traversal) for their UI component hierarchy problems. Amazon focuses more on grid BFS for logistics and pathfinding.

**vs Microsoft**: Microsoft mixes BFS with other concepts (like union-find or backtracking). Amazon's BFS questions are more "pure" — they want to see if you understand the algorithm deeply enough to apply it to a novel scenario.

The unique Amazon twist is the **constraint variation**. They might start with a simple grid problem, then add constraints like:

- "What if you need to collect a key before opening a door?"
- "What if some cells have different movement costs?"
- "What if multiple agents need to coordinate?"

This tests whether you truly understand BFS or just memorized a template.

## Study Order

1. **Basic BFS on Trees** — Start with level-order traversal (LeetCode #102) to understand the queue mechanism and level tracking.

2. **BFS on Simple Graphs** — Practice on adjacency list representations (LeetCode #133 Clone Graph) to understand visited sets for cyclic graphs.

3. **Grid BFS with Obstacles** — This is where Amazon-specific prep begins. Practice LeetCode #1091 Shortest Path in Binary Matrix to get comfortable with 2D grids.

4. **Multi-Source BFS** — Critical for Amazon. Master LeetCode #994 Rotting Oranges and #286 Walls and Gates.

5. **BFS with State** — Advanced Amazon pattern. Problems like LeetCode #864 Shortest Path to Get All Keys where you need to track additional state (keys collected, doors opened).

6. **Bidirectional BFS** — Optimization for some Amazon problems. Useful when you know both start and end points.

## Recommended Practice Order

1. LeetCode #102 Binary Tree Level Order Traversal (warm-up)
2. LeetCode #200 Number of Islands (BFS/DFS choice point)
3. LeetCode #1091 Shortest Path in Binary Matrix (core Amazon pattern)
4. LeetCode #994 Rotting Oranges (multi-source BFS)
5. LeetCode #286 Walls and Gates (another multi-source)
6. LeetCode #127 Word Ladder (graph construction + BFS)
7. LeetCode #542 01 Matrix (multi-source BFS variation)
8. LeetCode #864 Shortest Path to Get All Keys (BFS with state)
9. LeetCode #1293 Shortest Path in a Grid with Obstacles Elimination (hard Amazon-style)

The progression moves from recognizing when to use BFS, to implementing it correctly, to handling Amazon's favorite variations. Notice that half these problems involve grids — that's no accident.

Remember: Amazon interviewers care about clean code, correct complexity analysis, and the ability to handle follow-up questions. Always verbalize your thought process, and be prepared to optimize your solution if asked.

[Practice Breadth-First Search at Amazon](/company/amazon/breadth-first-search)
