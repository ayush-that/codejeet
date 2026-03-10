---
title: "Depth-First Search Questions at Salesforce: What to Expect"
description: "Prepare for Depth-First Search interview questions at Salesforce — patterns, difficulty breakdown, and study tips."
date: "2027-09-27"
category: "dsa-patterns"
tags: ["salesforce", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Salesforce: What to Expect

Salesforce has 21 Depth-First Search questions in their tagged LeetCode problems out of 189 total. That's roughly 11% of their problem set, which is significant but not overwhelming. In real interviews, DFS appears frequently but selectively—it's rarely the _only_ concept being tested. Instead, Salesforce interviewers often combine DFS with other patterns like tree manipulation, backtracking, or graph theory to create multi-layered problems that assess both algorithmic thinking and clean implementation.

What's interesting about Salesforce's DFS questions is their practical tilt. While companies like Google might ask abstract graph theory puzzles, Salesforce tends to embed DFS in problems that feel like real platform scenarios: hierarchical data traversal (think account hierarchies in CRM), permission validation, or dependency resolution. You're less likely to get pure "traverse this arbitrary graph" problems and more likely to encounter DFS as a tool within a larger business logic context.

## Specific Patterns Salesforce Favors

Salesforce's DFS problems cluster around three main patterns:

1. **Tree Traversal with State Tracking**: Problems where you traverse a tree (often binary) while maintaining some cumulative state—path sums, node counts, or validation flags. LeetCode 124 (Binary Tree Maximum Path Sum) is a classic example they've used.

2. **Backtracking on Implicit Graphs**: These are problems where the "graph" isn't explicitly given but emerges from decision spaces. Think generating combinations, permutations, or valid placements. LeetCode 79 (Word Search) appears in their list—a perfect example of DFS backtracking on a grid.

3. **Connected Components in Grids**: Problems involving islands, regions, or territories on a 2D grid. LeetCode 200 (Number of Islands) is the foundational problem here, but Salesforce variations often add constraints like "only count islands larger than X cells" or "find the shortest bridge between islands."

What's notably _absent_ is heavy graph theory (like Eulerian paths or network flow). Salesforce stays practical. They also show a preference for iterative DFS implementations over recursive ones in their official solutions—likely because stack overflow concerns with large CRM datasets are real.

## How to Prepare

Master the iterative DFS pattern with an explicit stack. While recursive DFS is cleaner for interviews, showing you can implement it iteratively demonstrates deeper understanding and practical caution. Here's the core pattern for grid DFS:

<div class="code-group">

```python
def num_islands(grid):
    """LeetCode 200: Number of Islands - Iterative DFS approach"""
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    islands = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                # Start DFS from this cell
                stack = [(r, c)]
                grid[r][c] = '0'  # Mark as visited

                while stack:
                    row, col = stack.pop()
                    # Check all four directions
                    for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                        nr, nc = row + dr, col + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            stack.append((nr, nc))
                            grid[nr][nc] = '0'  # Mark as visited

    return islands

# Time: O(rows * cols) - we visit each cell at most once
# Space: O(min(rows, cols)) - stack size in worst case (diagonal traversal)
```

```javascript
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let islands = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        islands++;
        const stack = [[r, c]];
        grid[r][c] = "0";

        while (stack.length > 0) {
          const [row, col] = stack.pop();
          const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ];

          for (const [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === "1") {
              stack.push([nr, nc]);
              grid[nr][nc] = "0";
            }
          }
        }
      }
    }
  }

  return islands;
}

// Time: O(rows * cols) | Space: O(min(rows, cols))
```

```java
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;

    int rows = grid.length;
    int cols = grid[0].length;
    int islands = 0;

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                islands++;
                Deque<int[]> stack = new ArrayDeque<>();
                stack.push(new int[]{r, c});
                grid[r][c] = '0';

                while (!stack.isEmpty()) {
                    int[] cell = stack.pop();
                    int row = cell[0];
                    int col = cell[1];

                    int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
                    for (int[] dir : directions) {
                        int nr = row + dir[0];
                        int nc = col + dir[1];

                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1') {
                            stack.push(new int[]{nr, nc});
                            grid[nr][nc] = '0';
                        }
                    }
                }
            }
        }
    }

    return islands;
}

// Time: O(rows * cols) | Space: O(min(rows, cols))
```

</div>

For tree problems, master the "DFS with return value" pattern. Here's the template for maximum path sum:

<div class="code-group">

```python
def max_path_sum(root):
    """LeetCode 124: Binary Tree Maximum Path Sum pattern"""
    max_sum = float('-inf')

    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0

        # Post-order traversal: process children first
        left_gain = max(dfs(node.left), 0)  # Ignore negative paths
        right_gain = max(dfs(node.right), 0)

        # Current path sum if this node is the "root" of the path
        current_path_sum = node.val + left_gain + right_gain
        max_sum = max(max_sum, current_path_sum)

        # Return the maximum gain if continuing the path upward
        return node.val + max(left_gain, right_gain)

    dfs(root)
    return max_sum

# Time: O(n) where n is number of nodes
# Space: O(h) where h is tree height (recursion stack)
```

```javascript
function maxPathSum(root) {
  let maxSum = -Infinity;

  function dfs(node) {
    if (!node) return 0;

    const leftGain = Math.max(dfs(node.left), 0);
    const rightGain = Math.max(dfs(node.right), 0);

    const currentPathSum = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, currentPathSum);

    return node.val + Math.max(leftGain, rightGain);
  }

  dfs(root);
  return maxSum;
}

// Time: O(n) | Space: O(h)
```

```java
class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return maxSum;
    }

    private int dfs(TreeNode node) {
        if (node == null) return 0;

        int leftGain = Math.max(dfs(node.left), 0);
        int rightGain = Math.max(dfs(node.right), 0);

        int currentPathSum = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currentPathSum);

        return node.val + Math.max(leftGain, rightGain);
    }
}

// Time: O(n) | Space: O(h)
```

</div>

## How Salesforce Tests Depth-First Search vs Other Companies

Salesforce's DFS questions differ from other companies in three key ways:

**Difficulty Gradient**: While Google might throw a hard DFS problem early, Salesforce typically starts with medium difficulty and adds complexity through business logic rather than algorithmic trickery. Their "hard" problems are often medium DFS with additional constraints.

**Context Matters**: At Facebook (Meta), DFS problems often relate to social graphs. At Amazon, they might relate to warehouse navigation. At Salesforce, think about CRM entities: account hierarchies (trees), permission cascades (graph traversal), or data validation across related records.

**Implementation Quality**: Salesforce interviewers pay closer attention to clean, maintainable code than some other companies. They want to see you handle edge cases (null inputs, empty structures) and write code that would work in production. Commenting your approach is more valued here than at companies that prioritize raw speed.

## Study Order

1. **Basic Tree Traversals** (Pre-order, In-order, Post-order) - Foundation for all tree DFS
2. **Grid DFS** (Number of Islands pattern) - Learn to handle 2D boundaries and visited tracking
3. **Backtracking** (Combinations, Permutations) - Understand state management and pruning
4. **Path Problems** (Maximum Path Sum, Path with Target Sum) - Master returning values from DFS
5. **Graph Connectivity** (Connected Components, Union-Find alternative) - Recognize when DFS is appropriate vs BFS
6. **Advanced State Tracking** (DFS with Bitmasking or Memoization) - For optimization problems

This order works because each concept builds on the previous. Tree traversals teach you the recursion/stack mechanics. Grid DFS adds spatial reasoning. Backtracking introduces decision spaces. Path problems teach you to propagate information. Graph connectivity shows application domains. Advanced state tracking combines everything.

## Recommended Practice Order

1. LeetCode 104 (Maximum Depth of Binary Tree) - Basic tree DFS
2. LeetCode 200 (Number of Islands) - Grid DFS foundation
3. LeetCode 79 (Word Search) - Backtracking on grid
4. LeetCode 124 (Binary Tree Maximum Path Sum) - Path value propagation
5. LeetCode 207 (Course Schedule) - Graph DFS for cycle detection
6. LeetCode 695 (Max Area of Island) - Salesforce variation: counting with constraints
7. LeetCode 130 (Surrounded Regions) - Boundary-aware DFS
8. LeetCode 337 (House Robber III) - Tree DFS with decision making
9. LeetCode 490 (The Maze) - DFS with stop conditions (if you have premium)
10. LeetCode 472 (Concatenated Words) - Hard DFS with memoization (Salesforce favorite)

After these, tackle Salesforce's specific tagged problems. Notice how the sequence moves from pure algorithms to problems that could map to business scenarios—this mirrors how Salesforce interviews progress.

[Practice Depth-First Search at Salesforce](/company/salesforce/depth-first-search)
