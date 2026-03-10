---
title: "Breadth-First Search Questions at Google: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Google — patterns, difficulty breakdown, and study tips."
date: "2027-02-07"
category: "dsa-patterns"
tags: ["google", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Google: What to Expect

Google has 162 Breadth-First Search questions in their LeetCode catalog out of 2217 total — that's about 7.3% of their problem set. But raw numbers don't tell the full story. In actual interviews, BFS appears even more frequently than that percentage suggests because it's a fundamental tool for solving problems that Google actually cares about: shortest path finding, level-order traversal, web crawling simulations, and social network analysis.

Here's what you need to understand: BFS isn't just another algorithm at Google — it's a _thinking framework_. Interviewers use BFS problems to assess how you approach exploration problems, whether you understand when to use queues versus stacks, and if you can recognize that many "grid" and "tree" problems are actually graph problems in disguise. I've conducted interviews at Google where candidates who aced complex DP problems stumbled on what appeared to be simple BFS questions because they missed the graph representation.

## Specific Patterns Google Favors

Google's BFS questions tend to cluster around three specific patterns:

1. **Multi-source BFS**: Instead of starting from a single point, you begin with multiple sources in the queue. This pattern appears in problems like "rotting oranges" or "walls and gates" where multiple starting points simultaneously affect their neighbors. LeetCode 994 (Rotting Oranges) is a classic example.

2. **Bidirectional BFS**: When searching for the shortest path between two known points, you can search from both ends simultaneously. This cuts the search space dramatically — from O(b^d) to O(b^{d/2}) where b is branching factor and d is depth. Google loves this optimization for social network problems (find the shortest connection distance between two users).

3. **BFS with state tracking**: Many Google BFS problems require you to carry additional state through the traversal. This could be keys collected (LeetCode 864 - Shortest Path to Get All Keys), obstacles removed (LeetCode 1293 - Shortest Path in a Grid with Obstacles Elimination), or directions traveled. The state becomes part of the visited tracking.

Here's the multi-source BFS pattern that appears repeatedly:

<div class="code-group">

```python
from collections import deque
from typing import List

def orangesRotting(grid: List[List[int]]) -> int:
    """LeetCode 994: Rotting Oranges - Multi-source BFS"""
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0
    minutes = 0

    # Initialize: add all rotten oranges to queue (multi-source)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh_count += 1

    # If no fresh oranges initially
    if fresh_count == 0:
        return 0

    # Directions: up, down, left, right
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    # BFS with level tracking
    while queue and fresh_count > 0:
        # Process all oranges at current minute level
        for _ in range(len(queue)):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                # Check bounds and if orange is fresh
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    # Rot the fresh orange
                    grid[nr][nc] = 2
                    queue.append((nr, nc))
                    fresh_count -= 1

        minutes += 1

    return minutes if fresh_count == 0 else -1

# Time: O(rows * cols) - each cell visited at most once
# Space: O(rows * cols) - queue could hold all cells in worst case
```

```javascript
/**
 * LeetCode 994: Rotting Oranges - Multi-source BFS
 * Time: O(rows * cols) | Space: O(rows * cols)
 */
function orangesRotting(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;
  let minutes = 0;

  // Initialize: find all rotten oranges and count fresh ones
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

  while (queue.length > 0 && freshCount > 0) {
    // Process current level
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

class Solution {
    /**
     * LeetCode 994: Rotting Oranges - Multi-source BFS
     * Time: O(rows * cols) | Space: O(rows * cols)
     */
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;
        int minutes = 0;

        // Initialize queue with all rotten oranges
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

        while (!queue.isEmpty() && freshCount > 0) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0], c = current[1];

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
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

Most candidates prepare BFS by memorizing the queue pattern, but Google interviewers look for deeper understanding. Here's what actually matters:

1. **Recognize implicit graphs**: Many problems don't look like graphs initially. Word ladder (LeetCode 127) transforms words into nodes where edges connect words differing by one letter. The "state" in these problems often becomes the node itself.

2. **Know when BFS beats DFS**: BFS finds shortest paths in unweighted graphs. If a problem asks for "minimum steps," "shortest transformation," or "closest distance," BFS is usually correct. DFS would require exploring all paths.

3. **Master visited tracking with state**: The hardest BFS problems at Google require tracking (row, col, state) as visited, not just (row, col). Here's the pattern:

<div class="code-group">

```python
from collections import deque
from typing import List

def shortestPathAllKeys(grid: List[str]) -> int:
    """LeetCode 864: Shortest Path to Get All Keys - BFS with state"""
    rows, cols = len(grid), len(grid[0])

    # Find starting position and count keys
    start_r = start_c = total_keys = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '@':
                start_r, start_c = r, c
            elif grid[r][c].islower():
                total_keys += 1

    # State: (row, col, keys_bitmask)
    # Each key is represented by a bit in the bitmask
    start_state = (start_r, start_c, 0)
    queue = deque([start_state])
    visited = set([start_state])
    steps = 0

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    while queue:
        # Process level by level
        for _ in range(len(queue)):
            r, c, keys = queue.popleft()

            # Check if we've collected all keys
            if bin(keys).count('1') == total_keys:
                return steps

            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                new_keys = keys

                # Check bounds and walls
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != '#':
                    cell = grid[nr][nc]

                    # If it's a locked door and we don't have the key
                    if cell.isupper() and not (keys & (1 << (ord(cell) - ord('A')))):
                        continue

                    # If it's a key, pick it up
                    if cell.islower():
                        key_index = ord(cell) - ord('a')
                        new_keys = keys | (1 << key_index)

                    new_state = (nr, nc, new_keys)
                    if new_state not in visited:
                        visited.add(new_state)
                        queue.append(new_state)

        steps += 1

    return -1

# Time: O(rows * cols * 2^k) where k is number of keys
# Space: O(rows * cols * 2^k) for visited states
```

```javascript
/**
 * LeetCode 864: Shortest Path to Get All Keys - BFS with state
 * Time: O(rows * cols * 2^k) | Space: O(rows * cols * 2^k)
 */
function shortestPathAllKeys(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  let startR = 0,
    startC = 0,
    totalKeys = 0;

  // Find start position and count keys
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "@") {
        startR = r;
        startC = c;
      } else if (grid[r][c] >= "a" && grid[r][c] <= "f") {
        totalKeys++;
      }
    }
  }

  // State: [row, col, keysBitmask]
  const startState = [startR, startC, 0];
  const queue = [startState];
  const visited = new Set();
  visited.add(`${startR},${startC},0`);

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let steps = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const [r, c, keys] = queue.shift();

      // Check if we have all keys
      if (countBits(keys) === totalKeys) {
        return steps;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] !== "#") {
          const cell = grid[nr][nc];
          let newKeys = keys;

          // Check if it's a locked door without key
          if (cell >= "A" && cell <= "F") {
            const doorBit = 1 << (cell.charCodeAt(0) - "A".charCodeAt(0));
            if (!(keys & doorBit)) continue;
          }

          // If it's a key, pick it up
          if (cell >= "a" && cell <= "f") {
            const keyBit = 1 << (cell.charCodeAt(0) - "a".charCodeAt(0));
            newKeys = keys | keyBit;
          }

          const stateKey = `${nr},${nc},${newKeys}`;
          if (!visited.has(stateKey)) {
            visited.add(stateKey);
            queue.push([nr, nc, newKeys]);
          }
        }
      }
    }

    steps++;
  }

  return -1;
}

function countBits(n) {
  let count = 0;
  while (n) {
    count += n & 1;
    n >>= 1;
  }
  return count;
}
```

```java
import java.util.*;

class Solution {
    /**
     * LeetCode 864: Shortest Path to Get All Keys - BFS with state
     * Time: O(rows * cols * 2^k) | Space: O(rows * cols * 2^k)
     */
    public int shortestPathAllKeys(String[] grid) {
        int rows = grid.length;
        int cols = grid[0].length();

        int startR = 0, startC = 0, totalKeys = 0;

        // Find start position and count keys
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                char cell = grid[r].charAt(c);
                if (cell == '@') {
                    startR = r;
                    startC = c;
                } else if (cell >= 'a' && cell <= 'f') {
                    totalKeys = Math.max(totalKeys, cell - 'a' + 1);
                }
            }
        }

        // State: row, col, keys bitmask
        int[] startState = new int[]{startR, startC, 0};
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(startState);

        Set<String> visited = new HashSet<>();
        visited.add(startR + "," + startC + "," + 0);

        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        int steps = 0;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int[] current = queue.poll();
                int r = current[0], c = current[1], keys = current[2];

                // Check if we have all keys
                if (Integer.bitCount(keys) == totalKeys) {
                    return steps;
                }

                for (int[] dir : directions) {
                    int nr = r + dir[0];
                    int nc = c + dir[1];

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        char cell = grid[nr].charAt(nc);

                        if (cell == '#') continue;

                        int newKeys = keys;

                        // Check if it's a locked door
                        if (cell >= 'A' && cell <= 'F') {
                            int doorBit = 1 << (cell - 'A');
                            if ((keys & doorBit) == 0) continue;
                        }

                        // If it's a key, pick it up
                        if (cell >= 'a' && cell <= 'f') {
                            int keyBit = 1 << (cell - 'a');
                            newKeys = keys | keyBit;
                        }

                        String stateKey = nr + "," + nc + "," + newKeys;
                        if (!visited.contains(stateKey)) {
                            visited.add(stateKey);
                            queue.offer(new int[]{nr, nc, newKeys});
                        }
                    }
                }
            }

            steps++;
        }

        return -1;
    }
}
```

</div>

## How Google Tests Breadth-First Search vs Other Companies

Google's BFS questions differ from other companies in three key ways:

1. **Real-world mapping**: Facebook might ask about social network distance (still BFS), but Google often frames BFS as infrastructure problems — crawling web pages, distributing updates across servers, or navigating autonomous vehicles through grids with obstacles.

2. **State complexity**: Amazon's BFS questions tend to be more straightforward (level-order tree traversal). Google adds layers: keys to collect, obstacles to break, time constraints, or multiple agents. The BFS algorithm remains the same, but the state representation becomes the challenge.

3. **Follow-up optimization**: At Google, solving the basic BFS is often just the first step. Expect follow-ups: "Can you optimize memory?" (bidirectional BFS), "What if the grid is enormous?" (A\* with heuristics), or "How would this work with 1000 simultaneous agents?" (multi-source BFS with priority queues).

Microsoft and Apple tend to ask more tree-based BFS (level order traversal variations). Google leans heavily toward grid-based BFS with constraints.

## Study Order

Don't jump into complex BFS problems immediately. Build systematically:

1. **Basic BFS on explicit graphs** — Understand the queue pattern, visited sets, and level-by-level processing. Practice on LeetCode 200 (Number of Islands) to build confidence.

2. **Tree BFS variations** — Master level-order traversal (LeetCode 102), zigzag traversal (LeetCode 103), and right-side view (LeetCode 199). These teach you to process nodes in specific orders.

3. **Grid BFS with simple constraints** — Move to matrix problems like LeetCode 994 (Rotting Oranges) and LeetCode 286 (Walls and Gates). These introduce multi-source BFS.

4. **BFS with path reconstruction** — Learn to not just find the shortest path length, but reconstruct the actual path. This requires tracking parent pointers.

5. **BFS with state** — This is where Google interviews live. Practice LeetCode 864 (Shortest Path to Get All Keys) and LeetCode 1293 (Shortest Path with Obstacle Elimination).

6. **Optimization patterns** — Finally, learn bidirectional BFS (LeetCode 127 - Word Ladder) and when to use A\* instead of plain BFS.

## Recommended Practice Order

Solve these in sequence:

1. LeetCode 200 - Number of Islands (basic BFS)
2. LeetCode 102 - Binary Tree Level Order Traversal (tree BFS)
3. LeetCode 994 - Rotting Oranges (multi-source BFS)
4. LeetCode 127 - Word Ladder (bidirectional BFS optimization)
5. LeetCode 1293 - Shortest Path with Obstacle Elimination (BFS with state)
6. LeetCode 864 - Shortest Path to Get All Keys (complex state BFS)
7. LeetCode 815 - Bus Routes (BFS on abstract graph)
8. LeetCode 909 - Snakes and Ladders (BFS with board game logic)

The progression matters: each problem introduces one new concept while reinforcing the core BFS pattern. By the time you reach problem #864, you'll see it's just BFS with a more complex state — not a fundamentally different algorithm.

Remember: at Google, BFS isn't just about finding the right algorithm. It's about recognizing that a problem is fundamentally about exploration and shortest paths, then adapting the basic pattern to handle the specific constraints. The candidates who succeed are those who understand BFS as a framework, not just a memorized code snippet.

[Practice Breadth-First Search at Google](/company/google/breadth-first-search)
