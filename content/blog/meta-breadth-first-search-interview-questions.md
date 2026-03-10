---
title: "Breadth-First Search Questions at Meta: What to Expect"
description: "Prepare for Breadth-First Search interview questions at Meta — patterns, difficulty breakdown, and study tips."
date: "2027-03-19"
category: "dsa-patterns"
tags: ["meta", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at Meta: What to Expect

Meta has 110 Breadth-First Search questions in their interview question bank out of 1387 total problems. That's nearly 8% of their entire catalog, making BFS one of the most frequently tested algorithmic patterns in their technical interviews. But what does this actually mean for your preparation?

First, let's address the obvious question: is BFS a core focus or secondary topic at Meta? The answer is unequivocally core. While Meta interviews cover a broad range of algorithmic concepts, BFS appears with remarkable consistency because it maps directly to real-world problems Meta engineers solve daily. Think about Facebook's social graph—finding mutual friends, calculating degrees of separation, recommending connections, or determining the shortest path between users in a network. These are all BFS problems in disguise.

In my experience conducting and participating in Meta interviews, you can expect at least one BFS-related question in virtually every onsite loop. Sometimes it's the main focus, other times it's a component of a more complex problem. The key insight: Meta doesn't just test BFS for the sake of testing algorithms—they test it because it's genuinely useful for the problems their engineers solve.

## Specific Patterns Meta Favors

Meta's BFS questions tend to cluster around several distinct patterns:

1. **Shortest Path in Unweighted Graphs**: This is their bread and butter. Meta loves problems where you need to find the minimum number of steps or transformations between two states. The classic example is Word Ladder (#127), which appears frequently in their interviews.

2. **Level-Order Traversal with Twists**: They'll give you what looks like a standard tree traversal problem, then add constraints that force you to track additional state. Binary Tree Right Side View (#199) is a perfect example—it's BFS with a simple twist that tests if you understand what "level" really means.

3. **Grid/Matrix Traversal with Obstacles**: Problems like Walls and Gates (#286) or Shortest Path in Binary Matrix (#1091) test your ability to adapt BFS to 2D spaces with constraints. These often appear in interviews for infrastructure or mapping-related roles.

4. **Multi-Source BFS**: This is where Meta separates candidates. Problems like Rotting Oranges (#994) or 01 Matrix (#542) require starting BFS from multiple points simultaneously. This pattern appears disproportionately in Meta interviews compared to other companies.

Here's the multi-source BFS pattern that consistently trips up candidates:

<div class="code-group">

```python
from collections import deque
from typing import List

def multi_source_bfs(grid: List[List[int]]) -> List[List[int]]:
    """
    Multi-source BFS pattern for problems like Rotting Oranges (#994)
    Time: O(m*n) | Space: O(m*n)
    """
    if not grid:
        return grid

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    # Step 1: Initialize queue with all starting points
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Starting condition
                queue.append((r, c, 0))  # (row, col, distance)

    # Step 2: Standard BFS but track distance
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    while queue:
        r, c, dist = queue.popleft()

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2  # Mark as visited/processed
                queue.append((nr, nc, dist + 1))

    return grid
```

```javascript
/**
 * Multi-source BFS pattern for problems like Rotting Oranges (#994)
 * Time: O(m*n) | Space: O(m*n)
 */
function multiSourceBFS(grid) {
  if (!grid || grid.length === 0) return grid;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];

  // Step 1: Initialize queue with all starting points
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) {
        // Starting condition
        queue.push([r, c, 0]); // [row, col, distance]
      }
    }
  }

  // Step 2: Standard BFS but track distance
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (queue.length > 0) {
    const [r, c, dist] = queue.shift();

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
        grid[nr][nc] = 2; // Mark as visited/processed
        queue.push([nr, nc, dist + 1]);
      }
    }
  }

  return grid;
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

public class MultiSourceBFS {
    /**
     * Multi-source BFS pattern for problems like Rotting Oranges (#994)
     * Time: O(m*n) | Space: O(m*n)
     */
    public int[][] multiSourceBFS(int[][] grid) {
        if (grid == null || grid.length == 0) return grid;

        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();

        // Step 1: Initialize queue with all starting points
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 2) {  // Starting condition
                    queue.offer(new int[]{r, c, 0});  // {row, col, distance}
                }
            }
        }

        // Step 2: Standard BFS but track distance
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int r = current[0], c = current[1], dist = current[2];

            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2;  // Mark as visited/processed
                    queue.offer(new int[]{nr, nc, dist + 1});
                }
            }
        }

        return grid;
    }
}
```

</div>

## How to Prepare

The biggest mistake candidates make is treating BFS as a single algorithm to memorize. At Meta, you need to understand BFS as a pattern that can be adapted. Here's my preparation strategy:

1. **Master the Queue Mechanics First**: Before tackling complex problems, ensure you can implement BFS flawlessly. Practice tracking visited nodes, handling cycles, and managing queue operations efficiently.

2. **Learn to Recognize State**: Meta's BFS problems often involve more than just node traversal. You might need to track additional state like remaining walls you can break (as in Shortest Path in a Grid with Obstacles Elimination (#1293)) or the number of steps taken.

3. **Practice the "Level-Aware" Variation**: Many Meta problems require processing nodes level by level. Here's the pattern:

<div class="code-group">

```python
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order_traversal(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Level-order BFS pattern for problems like Binary Tree Level Order Traversal (#102)
    Time: O(n) | Space: O(n)
    """
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
```

```javascript
function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

/**
 * Level-order BFS pattern for problems like Binary Tree Level Order Traversal (#102)
 * Time: O(n) | Space: O(n)
 */
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
```

```java
import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class LevelOrderTraversal {
    /**
     * Level-order BFS pattern for problems like Binary Tree Level Order Traversal (#102)
     * Time: O(n) | Space: O(n)
     */
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
}
```

</div>

## How Meta Tests Breadth-First Search vs Other Companies

Meta's BFS questions have a distinct flavor compared to other tech companies:

- **Google** tends to ask more theoretical graph problems with BFS as one possible solution among several. Their questions often have multiple valid approaches, and they want to discuss tradeoffs.

- **Amazon** frequently combines BFS with system design elements or real-world logistics problems (warehouse navigation, delivery routes).

- **Meta**, by contrast, focuses on **practical applications to social networks and content distribution**. Their problems often involve finding shortest paths in user networks, content propagation through feeds, or friend recommendation algorithms.

What's unique about Meta's approach is their emphasis on **optimization within BFS**. They'll give you a working BFS solution, then ask: "How can we make this faster?" or "What if the graph has billions of nodes?" This tests your understanding of algorithmic complexity and your ability to think about scale—a critical skill at Meta.

## Study Order

Follow this progression to build your BFS skills systematically:

1. **Basic BFS on Trees** - Start with simple level-order traversal to internalize the queue pattern without worrying about cycles or complex state.

2. **BFS on Graphs with Visited Tracking** - Learn to handle cycles using a visited set. Practice on adjacency list and matrix representations.

3. **Shortest Path in Unweighted Graphs** - This is where BFS shines. Understand why BFS gives the shortest path in unweighted graphs.

4. **Grid/Maze Problems** - Adapt BFS to 2D spaces with obstacles. Learn to convert grid coordinates to graph nodes.

5. **Multi-Source BFS** - The advanced pattern that appears frequently at Meta. Master starting from multiple points.

6. **BFS with Additional State** - Practice problems where you need to track extra information (remaining moves, keys collected, etc.).

7. **Bidirectional BFS** - For optimization questions. Know when and why it improves performance.

This order works because each step builds on the previous one. You can't effectively solve multi-source BFS problems if you're still shaky on basic visited tracking.

## Recommended Practice Order

Solve these problems in sequence:

1. **Binary Tree Level Order Traversal (#102)** - Basic tree BFS
2. **Number of Islands (#200)** - Grid BFS with visited tracking
3. **Rotting Oranges (#994)** - Multi-source BFS (classic Meta question)
4. **Word Ladder (#127)** - Shortest path with state transformation
5. **01 Matrix (#542)** - Multi-source BFS on grid
6. **Shortest Path in Binary Matrix (#1091)** - Grid BFS with early exit
7. **Walls and Gates (#286)** - Multi-source with distance tracking
8. **Shortest Path in a Grid with Obstacles Elimination (#1293)** - BFS with additional state
9. **Sliding Puzzle (#773)** - BFS on state space (advanced)

After completing this sequence, you'll have covered every major BFS pattern Meta tests. The key is not just solving the problems, but understanding why BFS is the right approach and how to adapt the pattern to each variation.

[Practice Breadth-First Search at Meta](/company/meta/breadth-first-search)
