---
title: "Breadth-First Search Questions at PhonePe: What to Expect"
description: "Prepare for Breadth-First Search interview questions at PhonePe — patterns, difficulty breakdown, and study tips."
date: "2028-06-23"
category: "dsa-patterns"
tags: ["phonepe", "breadth-first-search", "interview prep"]
---

# Breadth-First Search Questions at PhonePe: What to Expect

PhonePe's interview process has a distinct flavor when it comes to Breadth-First Search (BFS). With 18 BFS questions out of their 102 total coding problems (about 18% of their technical question bank), BFS isn't just another topic—it's a core competency they actively test. In real interviews, you're likely to encounter at least one BFS problem, often in the first or second technical round. This makes sense given PhonePe's domain: digital payments involve transaction networks, user graphs, recommendation systems, and fraud detection—all areas where graph traversal and shortest-path algorithms are practically useful.

What's interesting is how PhonePe uses BFS questions. They're not just testing whether you can implement a queue. They're assessing your ability to model real-world problems as graphs, handle edge cases in traversal, and optimize for both time and space. I've spoken with engineers who've interviewed there, and the consensus is clear: if you're preparing for PhonePe, BFS should be in your top three algorithm categories to master.

## Specific Patterns PhonePe Favors

PhonePe's BFS problems tend to cluster around three specific patterns:

1. **Shortest Path in Unweighted Graphs** - This is their bread and butter. They love problems where you need to find the minimum number of steps or transformations. Think "Word Ladder" style problems where each step changes one element.

2. **Level-Order Traversal with Twists** - They frequently modify standard BFS to require tracking levels, collecting level-specific data, or processing nodes in zigzag patterns.

3. **Multi-Source BFS** - Problems where you start BFS from multiple points simultaneously. This pattern appears in their matrix-based questions frequently.

Here's a concrete example: PhonePe has several variations of the "rotting oranges" problem (LeetCode #994). They might present it as "contaminated transactions spreading through a network" or "feature adoption across user groups." The core remains multi-source BFS.

<div class="code-group">

```python
# Multi-source BFS pattern (Rotting Oranges style)
# Time: O(m*n) | Space: O(m*n)
from collections import deque

def multi_source_bfs(grid):
    if not grid:
        return -1

    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    # Initialize with all sources
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:  # Source nodes
                queue.append((r, c))
            elif grid[r][c] == 1:  # Nodes to be processed
                fresh_count += 1

    if fresh_count == 0:
        return 0

    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    minutes = 0

    while queue and fresh_count > 0:
        # Process all nodes at current level
        level_size = len(queue)

        for _ in range(level_size):
            r, c = queue.popleft()

            for dr, dc in directions:
                nr, nc = r + dr, c + dc

                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    queue.append((nr, nc))
                    fresh_count -= 1

        minutes += 1

    return minutes if fresh_count == 0 else -1
```

```javascript
// Multi-source BFS pattern
// Time: O(m*n) | Space: O(m*n)
function multiSourceBFS(grid) {
  if (!grid || grid.length === 0) return -1;

  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let freshCount = 0;

  // Initialize with all sources
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
// Multi-source BFS pattern
// Time: O(m*n) | Space: O(m*n)
import java.util.LinkedList;
import java.util.Queue;

public class MultiSourceBFS {
    public int orangesRotting(int[][] grid) {
        if (grid == null || grid.length == 0) return -1;

        int rows = grid.length;
        int cols = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int freshCount = 0;

        // Initialize with all sources
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
                int[] current = queue.poll();
                int r = current[0];
                int c = current[1];

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

The key to acing PhonePe's BFS questions is pattern recognition and implementation speed. You need to be able to look at a problem and immediately identify which BFS variant it requires. Here's my recommended approach:

1. **Master the BFS template** - Have a mental template you can adapt. The core is always: queue, visited set, while queue not empty, process level.

2. **Practice state representation** - PhonePe problems often require creative state encoding. For example, in "Sliding Puzzle" (LeetCode #773), your state is the board configuration. You need to serialize this efficiently.

3. **Optimize visited checks** - Use appropriate data structures. For grid positions, a boolean matrix. For string states, a HashSet. For numeric states, sometimes an array works.

Here's the level-order traversal with a twist that PhonePe loves:

<div class="code-group">

```python
# Zigzag level order traversal (LeetCode #103)
# Time: O(n) | Space: O(n)
from collections import deque

def zigzag_level_order(root):
    if not root:
        return []

    result = []
    queue = deque([root])
    left_to_right = True

    while queue:
        level_size = len(queue)
        level_nodes = [0] * level_size

        for i in range(level_size):
            node = queue.popleft()

            # Determine position based on direction
            index = i if left_to_right else level_size - 1 - i
            level_nodes[index] = node.val

            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(level_nodes)
        left_to_right = not left_to_right

    return result
```

```javascript
// Zigzag level order traversal
// Time: O(n) | Space: O(n)
function zigzagLevelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];
  let leftToRight = true;

  while (queue.length > 0) {
    const levelSize = queue.length;
    const levelNodes = new Array(levelSize);

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();

      // Determine position based on direction
      const index = leftToRight ? i : levelSize - 1 - i;
      levelNodes[index] = node.val;

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(levelNodes);
    leftToRight = !leftToRight;
  }

  return result;
}
```

```java
// Zigzag level order traversal
// Time: O(n) | Space: O(n)
import java.util.*;

public class ZigzagTraversal {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        boolean leftToRight = true;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> levelNodes = new ArrayList<>(Collections.nCopies(levelSize, 0));

            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();

                // Determine position based on direction
                int index = leftToRight ? i : levelSize - 1 - i;
                levelNodes.set(index, node.val);

                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }

            result.add(levelNodes);
            leftToRight = !leftToRight;
        }

        return result;
    }
}
```

</div>

## How PhonePe Tests Breadth-First Search vs Other Companies

PhonePe's BFS questions differ from other companies in subtle but important ways:

**Compared to FAANG:** PhonePe problems are more applied. While Google might ask abstract graph theory, PhonePe wraps BFS in business contexts—transaction networks, user connections, feature rollouts. The algorithms are the same, but the problem statements feel more "real."

**Difficulty level:** PhonePe's BFS questions tend to be medium difficulty, but with clever constraints. They might give you a large graph and ask you to optimize memory, or provide a problem that looks like DFS but is actually BFS.

**Follow-up questions:** Expect optimization follow-ups. After you solve the basic BFS, they'll ask: "Can you do it with O(1) extra space?" or "What if the graph is too large to fit in memory?"

**Unique aspect:** PhonePe interviewers often care about code readability and maintainability more than some other companies. They're evaluating you as a potential colleague who will write production code.

## Study Order

1. **Basic BFS on Trees** - Start with simple level-order traversal. Understand queue mechanics without the complexity of graphs.
   _Why:_ Trees have no cycles, so you don't need visited sets. This isolates the core BFS pattern.

2. **BFS on Grids/Matrices** - Practice problems like "Number of Islands" (LeetCode #200) but solved with BFS instead of DFS.
   _Why:_ Grids introduce movement in 4 directions and boundary checking.

3. **Shortest Path in Unweighted Graphs** - Master the classic BFS application. Practice "Word Ladder" (LeetCode #127).
   _Why:_ This is PhonePe's favorite pattern—you must recognize when BFS gives shortest path.

4. **Multi-Source BFS** - Learn to initialize the queue with multiple starting points.
   _Why:_ Critical for PhonePe's network/spread problems.

5. **BFS with State** - Problems where your queue stores more than just position, like "Sliding Puzzle" (LeetCode #773).
   _Why:_ PhonePe tests your ability to model complex states.

6. **Bidirectional BFS** - Advanced optimization for meeting in the middle.
   _Why:_ Sometimes asked as a follow-up to optimize standard BFS.

## Recommended Practice Order

Solve these in sequence:

1. **Binary Tree Level Order Traversal** (LeetCode #102) - Basic template
2. **Rotting Oranges** (LeetCode #994) - Multi-source BFS
3. **Word Ladder** (LeetCode #127) - Shortest path with string states
4. **01 Matrix** (LeetCode #542) - Multi-source BFS on grid
5. **Sliding Puzzle** (LeetCode #773) - BFS with complex state
6. **Shortest Path in Binary Matrix** (LeetCode #1091) - Grid BFS with obstacles
7. **Open the Lock** (LeetCode #752) - PhonePe-style problem (think combination locks)
8. **Minimum Knight Moves** (LeetCode #1197) - BFS with symmetric moves

After these eight, you'll have covered 90% of PhonePe's BFS patterns. The remaining 10% are variations that combine BFS with other concepts like union-find or dynamic programming.

Remember: PhonePe isn't testing if you memorized algorithms. They're testing if you can recognize which algorithm applies to a novel problem and implement it cleanly. Practice explaining your thought process as you solve—this is often more important than the code itself.

[Practice Breadth-First Search at PhonePe](/company/phonepe/breadth-first-search)
