---
title: "Breadth-First Search Questions at TikTok: What to Expect"
description: "Prepare for Breadth-First Search interview questions at TikTok — patterns, difficulty breakdown, and study tips."
date: "2027-05-16"
category: "dsa-patterns"
tags: ["tiktok", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at TikTok: What to Expect

TikTok's interview process has a distinct flavor when it comes to algorithmic questions. With 43 Breadth-First Search (BFS) questions out of their 383 total problems, BFS represents over 11% of their question bank — a significant concentration that tells you something important. This isn't a random distribution. BFS appears frequently because it's fundamental to problems involving social networks, recommendation systems, and content propagation — all core to TikTok's product. In real interviews, you're likely to encounter at least one BFS problem, often disguised as something else. The key insight? TikTok doesn't just test whether you know BFS; they test whether you recognize when to use it and how to adapt it to non-obvious scenarios.

## Specific Patterns TikTok Favors

TikTok's BFS problems cluster around three specific patterns that mirror their engineering challenges:

1. **Shortest Path in Unweighted Graphs** — This is their bread and butter. Think about friend connections, content reach, or minimum steps in a game. They love problems where you need to find the shortest distance between two points in a grid or graph. LeetCode #1091 ("Shortest Path in Binary Matrix") is a classic example that appears frequently.

2. **Level-Order Traversal with a Twist** — Standard binary tree level-order is too basic. They'll add constraints like alternating direction, connecting nodes at the same level, or finding the largest value at each level. These test your ability to modify the standard BFS template.

3. **Multi-Source BFS** — This is where TikTok separates candidates. Instead of starting BFS from a single point, you start from multiple sources simultaneously. This pattern is perfect for modeling viral content spread or finding the nearest server/data center. LeetCode #994 ("Rotting Oranges") demonstrates this perfectly — you start BFS from all rotten oranges at once.

Here's the multi-source BFS pattern that appears repeatedly:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]]) -> int:
    """
    Multi-source BFS template for problems like Rotting Oranges (#994)
    Time: O(m*n) where m,n are grid dimensions
    Space: O(m*n) for the queue in worst case
    """
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    # Initialize: add all sources to queue
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Source nodes
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    if fresh_count == 0:
        return 0

    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    minutes = 0

    # BFS from all sources simultaneously
    while queue and fresh_count > 0:
        # Process all nodes at current distance level
        for _ in range(len(queue)):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if (0 <= nr < rows and 0 <= nc < cols and
                    grid[nr][nc] == 1):  # Unvisited/affected node
                    grid[nr][nc] = 2
                    queue.append((nr, nc))
                    fresh_count -= 1

        minutes += 1

    return minutes if fresh_count == 0 else -1
```

```javascript
/**
 * Multi-source BFS template
 * Time: O(m*n) | Space: O(m*n)
 */
function multiSourceBFS(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Initialize all sources
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
  let minutes = 0;

  while (queue.length > 0 && freshCount > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          queue.push([nr, nc]);
          freshCount--;
        }
      }
    }

    minutes++;
  }

  return freshCount === 0 ? minutes : -1;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class MultiSourceBFS {
    /**
     * Multi-source BFS template
     * Time: O(m*n) | Space: O(m*n)
     */
    public int orangesRotting(int[][] grid) {
        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;

        // Initialize all sources
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

        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        int minutes = 0;

        while (!queue.isEmpty() && freshCount > 0) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] cell = queue.poll();
                int r = cell[0], c = cell[1];

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                        grid[nr][nc] == 1) {
                        grid[nr][nc] = 2;
                        queue.offer(new int[]{nr, nc});
                        freshCount--;
                    }
                }
            }

            minutes++;
        }

        return freshCount == 0 ? minutes : -1;
    }
}
```

</div>

## How to Prepare

Master the BFS template first, then learn to recognize these TikTok-specific variations:

1. **Always track distance/level** — Use the `for _ in range(len(queue))` pattern to process nodes level by level. This is crucial for shortest path problems.

2. **Look for "minimum steps" or "shortest path" keywords** — These almost always mean BFS for unweighted graphs.

3. **When you see multiple starting points, think multi-source BFS** — Initialize your queue with all sources.

4. **Use visited sets for graphs, not just grids** — For social network problems, you'll need to track visited users/nodes.

Here's the standard BFS template you should have memorized:

<div class="code-group">

```python
from collections import deque
from typing import List

def standard_bfs(start, target):
    """
    Standard BFS template for shortest path in unweighted graph
    Time: O(V + E) where V=vertices, E=edges
    Space: O(V) for queue and visited set
    """
    queue = deque([start])
    visited = set([start])
    distance = 0

    while queue:
        # Process all nodes at current distance
        for _ in range(len(queue)):
            node = queue.popleft()

            if node == target:
                return distance

            # Explore neighbors
            for neighbor in get_neighbors(node):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)

        distance += 1

    return -1  # Target not reachable
```

```javascript
function standardBFS(start, target) {
  /**
   * Standard BFS template
   * Time: O(V + E) | Space: O(V)
   */
  const queue = [start];
  const visited = new Set([start]);
  let distance = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();

      if (node === target) return distance;

      // Explore neighbors
      for (const neighbor of getNeighbors(node)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    distance++;
  }

  return -1; // Target not reachable
}
```

```java
import java.util.*;

public class StandardBFS {
    public int bfs(Node start, Node target) {
        /**
         * Standard BFS template
         * Time: O(V + E) | Space: O(V)
         */
        Queue<Node> queue = new LinkedList<>();
        Set<Node> visited = new HashSet<>();
        queue.offer(start);
        visited.add(start);
        int distance = 0;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                Node node = queue.poll();

                if (node == target) return distance;

                // Explore neighbors
                for (Node neighbor : getNeighbors(node)) {
                    if (!visited.contains(neighbor)) {
                        visited.add(neighbor);
                        queue.offer(neighbor);
                    }
                }
            }

            distance++;
        }

        return -1;  // Target not reachable
    }
}
```

</div>

## How TikTok Tests Breadth-First Search vs Other Companies

TikTok's BFS questions differ from other companies in three key ways:

**Compared to Google**: Google's BFS problems tend to be more theoretical and abstract. TikTok's are more applied — you'll often get a problem statement that maps directly to a real product feature (like "find the minimum number of friend recommendations needed to connect two users").

**Compared to Facebook/Meta**: Facebook also loves graph problems, but they focus more on social graph traversal. TikTok emphasizes grid-based BFS (for content layout) and multi-source BFS (for viral spread modeling).

**Compared to Amazon**: Amazon's BFS problems often involve trees and hierarchical data. TikTok's are predominantly grid/graph based with equal emphasis on both.

What's unique about TikTok is the **constraint modification**. They'll give you a standard BFS problem, then add a constraint mid-interview: "Now what if some cells are blocked only at certain times?" or "What if you can break through one wall?" This tests your ability to adapt the algorithm, not just regurgitate it.

## Study Order

Follow this progression to build your BFS skills systematically:

1. **Basic BFS on Trees** — Start with level-order traversal (LeetCode #102) to understand the queue-based approach without worrying about cycles.

2. **BFS on Grids** — Move to matrix/grid problems (LeetCode #200 "Number of Islands") to learn coordinate-based neighbor exploration.

3. **Shortest Path in Unweighted Graphs** — Practice the classic applications (LeetCode #1091) where BFS shines over DFS.

4. **Multi-Source BFS** — This is the TikTok specialty. Master starting from multiple points simultaneously.

5. **BFS with State** — Learn to track additional information in your BFS state, like keys collected or walls broken.

6. **Bidirectional BFS** — For advanced preparation, learn to search from both start and end simultaneously.

The logic behind this order: You need to understand the basic mechanics before adding complexity. Multi-source BFS builds directly on standard BFS — it's the same algorithm with different initialization. State-based BFS requires you to modify the visited tracking, which is easier once you're comfortable with the core algorithm.

## Recommended Practice Order

Solve these problems in sequence:

1. **Binary Tree Level Order Traversal** (#102) — Master the basic template
2. **Number of Islands** (#200) — BFS on grids
3. **Rotting Oranges** (#994) — Multi-source BFS (TikTok favorite)
4. **Shortest Path in Binary Matrix** (#1091) — Classic shortest path
5. **Walls and Gates** (#286) — Another multi-source variation
6. **01 Matrix** (#542) — Multi-source BFS from zeros
7. **Snakes and Ladders** (#909) — BFS with board game constraints
8. **Shortest Path to Get All Keys** (#864) — BFS with state (advanced)

After completing these, you'll have covered every BFS pattern TikTok uses. The key is to notice that #3, #5, and #6 are all multi-source variations — that's the pattern TikTok loves most.

[Practice Breadth-First Search at TikTok](/company/tiktok/breadth-first-search)
