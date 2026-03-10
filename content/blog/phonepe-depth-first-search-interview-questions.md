---
title: "Depth-First Search Questions at PhonePe: What to Expect"
description: "Prepare for Depth-First Search interview questions at PhonePe — patterns, difficulty breakdown, and study tips."
date: "2028-06-21"
category: "dsa-patterns"
tags: ["phonepe", "depth-first-search", "interview prep"]
---

If you're preparing for PhonePe interviews, you'll quickly notice a significant emphasis on Depth-First Search (DFS). With 14 out of their 102 cataloged problems being DFS-based, it's not just a common topic—it's a core competency they expect you to master. This isn't surprising for a fintech giant handling complex transaction graphs, user state trees in applications, and hierarchical data structures. At PhonePe, DFS isn't just about traversing a binary tree; it's a fundamental tool for solving problems related to pathfinding, state exploration, and combinatorial search within their systems. You can expect at least one, and often more, DFS-variant questions in their technical rounds.

## Specific Patterns PhonePe Favors

PhonePe's DFS problems tend to cluster around a few key patterns that mirror real-world engineering challenges. They heavily favor **iterative backtracking** and **graph traversal on implicit graphs** over simple recursive tree walks.

1.  **Backtracking for Combinatorial Generation:** Many problems involve generating all possible states, configurations, or paths, which maps to generating valid transaction sequences, UI states, or feature flag combinations. You'll see this in "find all" problems.
2.  **DFS on Grids (Implicit Graphs):** This is a major theme. Treating a 2D array as a graph where cells are nodes and adjacent moves are edges is a classic pattern for problems about islands, paths, or reachability—think mapping regions or validating board states.
3.  **Pathfinding with Modifiers:** They often add a twist to standard DFS, like tracking a secondary resource (e.g., number of obstacles you can remove, a remaining budget, or a special power-up). This tests your ability to incorporate state into your traversal.

For example, **LeetCode #79 (Word Search)** is a quintessential PhonePe-style problem: DFS on a grid with backtracking. **LeetCode #200 (Number of Islands)** is the foundational grid traversal problem. A more advanced example that fits their profile is **LeetCode #980 (Unique Paths III)**, which requires exploring all paths in a grid that visit every non-obstacle cell exactly once—a perfect blend of backtracking and pathfinding.

## How to Prepare

The key is to internalize the backtracking template and the grid DFS template. Let's look at the grid DFS pattern, which is non-negotiable.

The core idea is to avoid recursion stack overflow on large grids by using an iterative stack, and to always mark cells as visited _before_ pushing them to the stack to prevent duplicates.

<div class="code-group">

```python
def numIslands(grid):
    """
    LeetCode #200: Number of Islands
    Time: O(M * N) | Space: O(min(M, N)) in worst-case due to stack,
          but often simplified as O(M * N) for the visited space.
    """
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0
    # Iterative DFS using a stack of (r, c) tuples
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':  # Found a new island
                count += 1
                stack = [(r, c)]
                # Mark as visited immediately
                grid[r][c] = '0'

                while stack:
                    cr, cc = stack.pop()
                    # Explore 4-directionally
                    for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
                        nr, nc = cr + dr, cc + dc
                        # Check bounds and if it's land
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            stack.append((nr, nc))
                            grid[nr][nc] = '0'  # Mark visited
    return count
```

```javascript
/**
 * LeetCode #200: Number of Islands
 * Time: O(M * N) | Space: O(min(M, N)) for stack, O(M * N) for modified input.
 */
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        const stack = [[r, c]];
        grid[r][c] = "0"; // Mark visited

        while (stack.length > 0) {
          const [cr, cc] = stack.pop();
          for (const [dr, dc] of directions) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === "1") {
              stack.push([nr, nc]);
              grid[nr][nc] = "0";
            }
          }
        }
      }
    }
  }
  return count;
}
```

```java
/**
 * LeetCode #200: Number of Islands
 * Time: O(M * N) | Space: O(min(M, N)) for stack, O(M * N) for modified input.
 */
public int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;

    int rows = grid.length;
    int cols = grid[0].length;
    int count = 0;
    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};

    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                count++;
                Deque<int[]> stack = new ArrayDeque<>();
                stack.push(new int[]{r, c});
                grid[r][c] = '0'; // Mark visited

                while (!stack.isEmpty()) {
                    int[] cell = stack.pop();
                    int cr = cell[0];
                    int cc = cell[1];
                    for (int[] dir : directions) {
                        int nr = cr + dir[0];
                        int nc = cc + dir[1];
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1') {
                            stack.push(new int[]{nr, nc});
                            grid[nr][nc] = '0';
                        }
                    }
                }
            }
        }
    }
    return count;
}
```

</div>

For backtracking, the template involves making a choice, recursing, and then undoing the choice. Here's a snippet for a permutation problem:

<div class="code-group">

```python
def permute(nums):
    """
    LeetCode #46: Permutations
    Time: O(N * N!) | Space: O(N!) for output, O(N) for recursion depth.
    """
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:]) # Copy the path
            return
        for i in range(len(nums)):
            if not used[i]:
                # Make choice
                used[i] = True
                path.append(nums[i])
                # Recurse
                backtrack(path, used)
                # Undo choice (backtrack)
                path.pop()
                used[i] = False

    result = []
    backtrack([], [False]*len(nums))
    return result
```

```javascript
function permute(nums) {
  /**
   * LeetCode #46: Permutations
   * Time: O(N * N!) | Space: O(N!) for output, O(N) for recursion.
   */
  const result = [];

  function backtrack(path, used) {
    if (path.length === nums.length) {
      result.push([...path]); // Copy the path
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (!used[i]) {
        used[i] = true;
        path.push(nums[i]);
        backtrack(path, used);
        path.pop();
        used[i] = false;
      }
    }
  }

  backtrack([], new Array(nums.length).fill(false));
  return result;
}
```

```java
public List<List<Integer>> permute(int[] nums) {
    /**
     * LeetCode #46: Permutations
     * Time: O(N * N!) | Space: O(N!) for output, O(N) for recursion.
     */
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, new ArrayList<>(), new boolean[nums.length], result);
    return result;
}

private void backtrack(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> result) {
    if (path.size() == nums.length) {
        result.add(new ArrayList<>(path)); // Copy the path
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (!used[i]) {
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums, path, used, result);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
```

</div>

## How PhonePe Tests Depth-First Search vs Other Companies

Compared to FAANG companies, PhonePe's DFS questions often have a more "applied" feel. While Google might ask a highly abstract graph theory puzzle, and Meta might focus on sheer speed on a standard tree problem, PhonePe's questions frequently resemble a simplified version of a real system task. The difficulty is less about complex algorithm design (like dynamic programming on trees) and more about **robust implementation and state management** within a DFS framework.

For instance, they might present a problem where you need to traverse a representation of a payment flow (a directed graph) to find all possible error states, or validate if a user's navigation through a menu (a tree) is valid given certain rules. The unique aspect is the context—it often hints at scalability and correctness in stateful systems, which is critical for financial software.

## Study Order

Don't jump into advanced graph DFS. Build your skills sequentially:

1.  **Basic Tree Traversal (Pre/In/Post-order):** Understand recursion's flow. This is the foundation of the DFS "call stack" mental model.
2.  **DFS on Adjacency List Graphs:** Learn to traverse explicit graphs, handling cycles with visited sets. This introduces the concept of "state" during traversal.
3.  **DFS on Grids (Implicit Graphs):** Master the iterative stack pattern with boundary checks. This is where PhonePe's most common questions live.
4.  **Backtracking:** Learn the choose-explore-unchoose template. This is essential for "find all solutions" problems.
5.  **DFS with Memoization (Top-down DP on DAGs):** Understand how DFS can be used for dynamic programming on tree or graph structures (e.g., longest path in a DAG). This is a more advanced PhonePe topic.
6.  **DFS with Additional State:** Practice problems where you carry extra information in your DFS call (e.g., remaining steps, a path sum, a count of elements). This directly models their "pathfinding with modifiers" pattern.

This order works because each step uses and extends the core skill from the previous one, moving from simple recursion to complex stateful exploration.

## Recommended Practice Order

Solve these problems in sequence to build the specific competency PhonePe looks for:

1.  **#94 Binary Tree Inorder Traversal** (Basic recursion)
2.  **#200 Number of Islands** (Foundational grid DFS)
3.  **#79 Word Search** (Grid DFS + Backtracking)
4.  **#46 Permutations** (Classic backtracking template)
5.  **#130 Surrounded Regions** (Slightly trickier grid DFS application)
6.  **#417 Pacific Atlantic Water Flow** (Multi-source DFS on a grid, excellent for state)
7.  **#329 Longest Increasing Path in a Matrix** (DFS + Memoization on a grid)
8.  **#980 Unique Paths III** (Advanced: Backtracking on a grid with a complete path condition)

This progression takes you from the absolute basics to the complex, state-aware DFS problems that PhonePe is known to ask.

[Practice Depth-First Search at PhonePe](/company/phonepe/depth-first-search)
