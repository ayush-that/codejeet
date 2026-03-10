---
title: "Breadth-First Search Questions at Zomato: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Zomato — patterns, difficulty breakdown, and study tips."
date: "2030-11-14"
category: "dsa-patterns"
tags: ["zomato", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Zomato: What to Expect

If you're preparing for a software engineering interview at Zomato, you've likely noticed their question breakdown: 5 out of 29 total questions are tagged with Breadth-First Search (BFS). That's roughly 17% of their problem pool—a significant chunk that demands your attention. But what does this actually mean for your interview? Is BFS a core focus or just another topic in the mix?

The answer lies in Zomato's domain. As a food delivery and restaurant discovery platform, Zomato deals extensively with spatial data, mapping, routing, and network effects. Think about it: finding the shortest delivery route, discovering restaurants within a certain radius, calculating delivery times across a city grid, or modeling social connections between users and restaurants. These are fundamentally graph problems where BFS excels at finding shortest paths in unweighted graphs and exploring levels systematically. While not every engineer at Zomato works directly on mapping algorithms, understanding BFS demonstrates you can think about problems in terms of relationships and distances—a valuable mindset for their business.

In real interviews, you're likely to encounter at least one BFS problem, often in the second technical round. The difficulty typically ranges from medium to hard, with a focus on practical applications rather than abstract graph theory.

## Specific Patterns Zomato Favors

Zomato's BFS questions tend to cluster around three specific patterns:

1. **Grid-based shortest path problems** - These mimic delivery routing scenarios. You're given a 2D grid (representing a city map) with obstacles (buildings, closed roads) and need to find the shortest path from point A to B. Variations include multi-source BFS (multiple delivery drivers starting from different locations) and BFS with state (tracking keys, or whether a scooter has been used).

2. **Level-order traversal with a twist** - While tree level-order traversal is fundamental, Zomato often adds constraints like connecting nodes at each level (LeetCode #117: Populating Next Right Pointers in Each Node II) or finding the largest value at each level. This tests your ability to modify standard BFS to track level boundaries.

3. **Word ladder problems** - These model transformation sequences, like converting one restaurant menu item to another through valid intermediate steps (LeetCode #127: Word Ladder). The connection to their business might seem abstract, but it tests graph construction from implicit relationships—a skill useful for recommendation systems.

Notice what's missing: pure graph theory problems about cycles, connectivity, or topological sorting. Zomato prefers BFS applied to concrete structures (grids, trees, word graphs) rather than abstract graph representations.

## How to Prepare

The most common mistake candidates make is memorizing BFS template code without understanding when to use it. BFS is optimal for finding shortest paths in unweighted graphs because it explores all nodes at distance k before moving to distance k+1. DFS would potentially take a much longer route first.

Here's the core pattern you must master—grid-based BFS with obstacle handling:

<div class="code-group">

```python
from collections import deque

def shortest_path(grid, start, end):
    """
    Find shortest path in a grid with obstacles.
    grid: 2D list where 0 = empty, 1 = obstacle
    start: (row, col) tuple
    end: (row, col) tuple
    Returns: minimum steps or -1 if unreachable
    """
    if not grid or grid[start[0]][start[1]] == 1:
        return -1

    rows, cols = len(grid), len(grid[0])
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    queue = deque([(start[0], start[1], 0)])  # (row, col, distance)
    visited = set([(start[0], start[1])])

    while queue:
        row, col, dist = queue.popleft()

        # Check if we reached destination
        if (row, col) == end:
            return dist

        # Explore neighbors
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc

            # Check bounds and obstacles
            if (0 <= new_row < rows and 0 <= new_col < cols and
                grid[new_row][new_col] == 0 and
                (new_row, new_col) not in visited):

                visited.add((new_row, new_col))
                queue.append((new_row, new_col, dist + 1))

    return -1  # Destination not reachable

# Time: O(rows * cols) - each cell visited at most once
# Space: O(rows * cols) - for the queue and visited set in worst case
```

```javascript
function shortestPath(grid, start, end) {
  // grid: 2D array where 0 = empty, 1 = obstacle
  // start: [row, col] array
  // end: [row, col] array
  // Returns: minimum steps or -1 if unreachable

  if (!grid || grid[start[0]][start[1]] === 1) {
    return -1;
  }

  const rows = grid.length;
  const cols = grid[0].length;
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
    const [row, col, dist] = queue.shift();

    // Check if we reached destination
    if (row === end[0] && col === end[1]) {
      return dist;
    }

    // Explore neighbors
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check bounds and obstacles
      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        grid[newRow][newCol] === 0 &&
        !visited.has(`${newRow},${newCol}`)
      ) {
        visited.add(`${newRow},${newCol}`);
        queue.push([newRow, newCol, dist + 1]);
      }
    }
  }

  return -1; // Destination not reachable
}

// Time: O(rows * cols) - each cell visited at most once
// Space: O(rows * cols) - for the queue and visited set in worst case
```

```java
import java.util.*;

public class GridBFS {
    public int shortestPath(int[][] grid, int[] start, int[] end) {
        // grid: 2D array where 0 = empty, 1 = obstacle
        // start: [row, col] array
        // end: [row, col] array
        // Returns: minimum steps or -1 if unreachable

        if (grid == null || grid.length == 0 || grid[start[0]][start[1]] == 1) {
            return -1;
        }

        int rows = grid.length;
        int cols = grid[0].length;
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start[0], start[1], 0});  // [row, col, distance]
        boolean[][] visited = new boolean[rows][cols];
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int dist = current[2];

            // Check if we reached destination
            if (row == end[0] && col == end[1]) {
                return dist;
            }

            // Explore neighbors
            for (int[] dir : directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];

                // Check bounds and obstacles
                if (newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols &&
                    grid[newRow][newCol] == 0 &&
                    !visited[newRow][newCol]) {

                    visited[newRow][newCol] = true;
                    queue.offer(new int[]{newRow, newCol, dist + 1});
                }
            }
        }

        return -1;  // Destination not reachable
    }
}

// Time: O(rows * cols) - each cell visited at most once
// Space: O(rows * cols) - for the queue and visited array
```

</div>

For level-order traversal problems, you need to track level boundaries. Here's the pattern:

<div class="code-group">

```python
from collections import deque

def level_order_traversal(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        current_level = []

        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(current_level)

    return result

# Time: O(n) - each node visited once
# Space: O(n) - queue can hold all nodes at the widest level
```

```javascript
function levelOrderTraversal(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.val);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}

// Time: O(n) - each node visited once
// Space: O(n) - queue can hold all nodes at the widest level
```

```java
public List<List<Integer>> levelOrderTraversal(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> currentLevel = new ArrayList<>();

        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            currentLevel.add(node.val);

            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }

        result.add(currentLevel);
    }

    return result;
}

// Time: O(n) - each node visited once
// Space: O(n) - queue can hold all nodes at the widest level
```

</div>

## How Zomato Tests Breadth-First Search vs Other Companies

Zomato's BFS questions differ from other companies in subtle but important ways:

- **Compared to FAANG**: Google and Facebook often ask BFS in combination with other algorithms (like Dijkstra's for weighted graphs) or with complex state tracking. Zomato keeps it more focused—you're less likely to see BFS combined with bitmasking or other advanced techniques. Their questions are challenging but more self-contained.

- **Compared to Uber/Ola**: While Uber emphasizes shortest path algorithms heavily (for obvious ride-hailing reasons), they often include real-world constraints like traffic patterns or multiple vehicle types. Zomato's problems are slightly more abstracted from real-world logistics.

- **Unique Zomato angle**: They frequently incorporate "multi-agent" scenarios—multiple starting points (like several delivery drivers) or multiple targets (multiple orders to deliver). This tests your understanding of multi-source BFS, where you initialize the queue with all starting points.

The difficulty curve is also distinctive. Zomato often starts with a straightforward BFS problem, then adds exactly one clever twist in the follow-up. For example: "Now what if the delivery person can go through up to k obstacles?" This tests whether you truly understand BFS or just memorized the template.

## Study Order

Don't jump straight into Zomato's hardest BFS problems. Build up systematically:

1. **Basic BFS on trees** - Start with level-order traversal (LeetCode #102) to understand the queue mechanics without distractions.
2. **BFS on simple graphs** - Practice on adjacency list representations (LeetCode #133: Clone Graph) to separate BFS logic from grid complexities.
3. **Grid-based BFS** - Learn to navigate 2D arrays with obstacles (LeetCode #200: Number of Islands is a good start, though it uses both BFS and DFS).
4. **Shortest path in unweighted graphs** - This is BFS's superpower. Practice on grids first, then abstract graphs.
5. **Multi-source BFS** - Initialize the queue with multiple starting points (LeetCode #542: 01 Matrix).
6. **BFS with state tracking** - The hardest category. Track additional information like keys collected or obstacles broken (LeetCode #1293: Shortest Path in a Grid with Obstacles Elimination).

This order works because each step builds on the previous one. You solidify the core algorithm before adding complexity layers.

## Recommended Practice Order

Solve these problems in sequence:

1. **LeetCode #102: Binary Tree Level Order Traversal** - Master the basic pattern
2. **LeetCode #117: Populating Next Right Pointers in Each Node II** - Level-order with a twist
3. **LeetCode #200: Number of Islands** - Grid BFS fundamentals
4. **LeetCode #542: 01 Matrix** - Multi-source BFS
5. **LeetCode #127: Word Ladder** - BFS on implicit graphs
6. **LeetCode #1293: Shortest Path in a Grid with Obstacles Elimination** - BFS with state

If you have time, add **LeetCode #815: Bus Routes** - it's not tagged as BFS but uses the pattern creatively, similar to how Zomato might think about transportation networks.

Remember: At Zomato, they're not just testing whether you can implement BFS. They're testing whether you recognize when BFS is the right tool and can adapt it to their domain problems. Always ask yourself: "Is this about finding shortest paths or exploring levels?" If yes, BFS is likely your answer.

[Practice Breadth-First Search at Zomato](/company/zomato/breadth-first-search)
