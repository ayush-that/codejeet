---
title: "Depth-First Search Questions at Snapchat: What to Expect"
description: "Prepare for Depth-First Search interview questions at Snapchat — patterns, difficulty breakdown, and study tips."
date: "2028-07-09"
category: "dsa-patterns"
tags: ["snapchat", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Snapchat: What to Expect

Snapchat’s interview process is known for being algorithm-heavy, with a clear emphasis on graph and tree problems. Out of their 99 total tagged problems on LeetCode, 15 are explicitly labeled as Depth-First Search (DFS). That’s over 15% of their problem set, making it one of the most prominent single topics. In real interviews, you are very likely to encounter at least one problem that requires DFS thinking, often in the second technical round. It’s not just a secondary topic—it’s a core assessment of your ability to handle recursive thinking, backtracking, and implicit graph traversal, which are fundamental to features like Snap Map’s geospatial logic, story recommendation graphs, and UI view hierarchies.

## Specific Patterns Snapchat Favors

Snapchat’s DFS problems tend to cluster around two main themes: **pathfinding in matrices** and **backtracking for generation/permutation**. They lean heavily on iterative applications of DFS rather than pure graph theory.

1.  **Matrix Traversal (Flood Fill / Island Problems):** This is their most frequent pattern. Problems involve navigating a 2D grid (like an image map or a game board) to find connected components. The DFS is used to "sink" or mark visited cells.
    - **LeetCode 200: Number of Islands** is the quintessential example. You must count groups of connected `'1'`s.
    - **LeetCode 694: Number of Distinct Islands** is a Snapchat favorite variation. It adds the twist of hashing the _shape_ of the island, which requires encoding the DFS traversal path.

2.  **Backtracking for State Exploration:** These problems ask you to generate all possible states or configurations, which maps to features like sticker combinations or filter effect sequences.
    - **LeetCode 78: Subsets** and **LeetCode 90: Subsets II** are classic. You build the power set by, at each step, choosing to include or exclude an element, which is a depth-first exploration of a decision tree.
    - **LeetCode 79: Word Search** is a hybrid—it uses DFS for pathfinding in a matrix _combined_ with backtracking (you must unmark cells as you retreat).

You'll notice a distinct lack of purely recursive dynamic programming problems tagged under DFS. Snapchat's questions are more about _applied traversal_.

<div class="code-group">

```python
# LeetCode 200: Number of Islands - DFS Template
# Time: O(M * N) where M=rows, N=cols. We visit each cell at most once.
# Space: O(M * N) in worst case for recursion stack (when grid is all land).
def numIslands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    island_count = 0

    def dfs(r, c):
        # Base case: out of bounds or not land
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        # Sink the land so we don't revisit
        grid[r][c] = '0'
        # Explore all 4 directions
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            # If we find land, we've found a new island
            if grid[r][c] == '1':
                island_count += 1
                dfs(r, c) # Sink the entire connected component
    return island_count
```

```javascript
// LeetCode 200: Number of Islands - DFS Template
// Time: O(M * N) | Space: O(M * N) worst-case recursion depth
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let islandCount = 0;

  const dfs = (r, c) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== "1") {
      return;
    }
    grid[r][c] = "0"; // mark as visited
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        islandCount++;
        dfs(r, c);
      }
    }
  }
  return islandCount;
}
```

```java
// LeetCode 200: Number of Islands - DFS Template
// Time: O(M * N) | Space: O(M * N) worst-case recursion stack
public class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;

        int rows = grid.length;
        int cols = grid[0].length;
        int islandCount = 0;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    islandCount++;
                    dfs(grid, r, c);
                }
            }
        }
        return islandCount;
    }

    private void dfs(char[][] grid, int r, int c) {
        int rows = grid.length;
        int cols = grid[0].length;

        if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1') {
            return;
        }
        grid[r][c] = '0'; // mark as visited
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}
```

</div>

## How to Prepare

Master the two patterns above by internalizing their templates. For matrix DFS, the key is modifying the input to track visited states (often called "sinking"). For backtracking, the pattern is: make a choice, recurse, then undo the choice (backtrack).

Always discuss the trade-off between DFS (simpler, risk of stack overflow on large grids) and BFS (uses a queue, better for shortest path). For Snapchat, knowing when to use an iterative stack DFS vs recursion is a plus—mention that an explicit stack can avoid recursion limits for very large inputs.

<div class="code-group">

```python
# LeetCode 78: Subsets - Backtracking Template
# Time: O(N * 2^N) to generate all subsets and copy them.
# Space: O(N) for recursion stack and current path.
def subsets(nums):
    res = []

    def backtrack(start, path):
        # Append a copy of the current path (a subset)
        res.append(path[:])
        # Explore further elements
        for i in range(start, len(nums)):
            path.append(nums[i])      # make choice
            backtrack(i + 1, path)    # recurse
            path.pop()                # undo choice (backtrack)

    backtrack(0, [])
    return res
```

```javascript
// LeetCode 78: Subsets - Backtracking Template
// Time: O(N * 2^N) | Space: O(N) for recursion
function subsets(nums) {
  const res = [];

  const backtrack = (start, path) => {
    res.push([...path]); // push a copy
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]); // choose
      backtrack(i + 1, path); // explore
      path.pop(); // unchoose (backtrack)
    }
  };

  backtrack(0, []);
  return res;
}
```

```java
// LeetCode 78: Subsets - Backtracking Template
// Time: O(N * 2^N) | Space: O(N) for recursion
public class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(res, new ArrayList<>(), nums, 0);
        return res;
    }

    private void backtrack(List<List<Integer>> res, List<Integer> temp, int[] nums, int start) {
        res.add(new ArrayList<>(temp)); // add a copy
        for (int i = start; i < nums.length; i++) {
            temp.add(nums[i]);               // choose
            backtrack(res, temp, nums, i + 1); // explore
            temp.remove(temp.size() - 1);    // unchoose (backtrack)
        }
    }
}
```

</div>

## How Snapchat Tests Depth-First Search vs Other Companies

Compared to other companies, Snapchat's DFS questions are **applied and feature-adjacent**. At Google, you might get a more abstract graph theory problem (e.g., finding articulation points). At Meta, DFS is often wrapped in a tree serialization problem for their data structures. Snapchat, however, frequently frames DFS in the context of a _visual product_: an image (matrix), a map, or a set of user-generated content (backtracking through combinations).

The difficulty is typically **Medium**, but the twist is often in the _follow-up_. For "Number of Distinct Islands," the initial solve might be straightforward DFS, but the follow-up ("now make it work for rotated islands") tests your ability to adapt the core pattern. They are less interested in you knowing the most obscure algorithm and more interested in seeing you cleanly implement a standard pattern and then logically extend it.

## Study Order

1.  **Basic Tree DFS:** Start with binary tree traversals (pre-order, in-order). This builds intuition for recursion and visiting nodes. (LeetCode 94, 144).
2.  **Matrix DFS (Flood Fill):** Learn the "sinking" pattern for connected components in a 2D grid. This is Snapchat's bread and butter. (LeetCode 200, 733).
3.  **Backtracking Fundamentals:** Understand the choose-explore-unchoose loop for generating combinations and permutations. (LeetCode 78, 46).
4.  **Hybrid Problems:** Combine matrix traversal with backtracking, where you must unmark visited states. (LeetCode 79).
5.  **Advanced Variations:** Tackle problems that require encoding the DFS path or handling unique constraints, which are common Snapchat follow-ups. (LeetCode 694, 490).

This order works because it builds from simple recursion (trees) to constrained state exploration (matrices), then to explicit state manipulation (backtracking), finally combining them. You solidify the foundational pattern before adding complexity.

## Recommended Practice Order

Solve these problems in sequence to build the specific competency Snapchat looks for:

1.  **LeetCode 200: Number of Islands** - The absolute must-know.
2.  **LeetCode 733: Flood Fill** - A simpler variant to cement the pattern.
3.  **LeetCode 78: Subsets** - Master the backtracking template.
4.  **LeetCode 46: Permutations** - Adapt the template for a different constraint.
5.  **LeetCode 79: Word Search** - Combine matrix DFS and backtracking.
6.  **LeetCode 694: Number of Distinct Islands** - The classic Snapchat follow-up challenge.
7.  **LeetCode 490: The Maze** - Tests DFS vs BFS intuition on a pathfinding problem.

Focus on writing clean, bug-free code for the first five. For the last two, prioritize discussing the _extension_ of the core pattern clearly. Your ability to articulate how you'd modify your solution for a new constraint often matters more than a perfect first implementation.

[Practice Depth-First Search at Snapchat](/company/snapchat/depth-first-search)
