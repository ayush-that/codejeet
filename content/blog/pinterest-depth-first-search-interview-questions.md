---
title: "Depth-First Search Questions at Pinterest: What to Expect"
description: "Prepare for Depth-First Search interview questions at Pinterest — patterns, difficulty breakdown, and study tips."
date: "2029-08-27"
category: "dsa-patterns"
tags: ["pinterest", "depth-first-search", "interview prep"]
---

If you're preparing for a Pinterest interview, you'll likely face a Depth-First Search (DFS) question. With 6 out of their 48 cataloged problems being DFS-based, it's a significant but not overwhelming focus area—roughly 12.5% of their known question pool. In practice, this means you have about a 1 in 4 chance of encountering a DFS problem in a typical 2-round coding interview loop. The reason is structural: Pinterest's core product—a visual discovery engine of interconnected pins, boards, and users—is fundamentally a graph. Whether it's traversing a user's board hierarchy, exploring related pins, or analyzing the connected components of a social network, DFS provides the intuitive, recursive "drill-down" logic that mirrors how users explore the platform. It's not just an algorithmic checkbox; it's a direct reflection of their engineering domain.

## Specific Patterns Pinterest Favors

Pinterest's DFS questions tend to cluster around two specific, practical patterns rather than abstract graph theory. They favor **iterative traversal on implicit 2D grids** and **recursive backtracking for pathfinding/permutation problems**.

1.  **Implicit Graph Traversal on Matrices:** This is their most common pattern. You're given a 2D array (like a map of pixels, a character grid, or a board state), and you must traverse connected cells meeting a condition. Think "island" problems. They love these because they mirror image processing and content region detection—core to a visual platform. A quintessential example is **LeetCode 200: Number of Islands**. You'll also see variants like **LeetCode 695: Max Area of Island**, which adds a simple aggregation step during the DFS.

2.  **Backtracking for State Exploration:** The second pattern involves exploring all possible states or paths, pruning invalid ones early. This models features like pin recommendation sequencing or exploring possible board arrangements. **LeetCode 79: Word Search** is a classic here, combining the 2D grid with path backtracking. Another is **LeetCode 46: Permutations**, which tests your understanding of recursively building a set of possibilities while managing a "visited" state.

You'll notice they generally avoid complex recursive dynamic programming (like DFS on DAGs for longest path) and highly abstract graph theory (like topological sort via DFS). Their problems are concrete, often with a clear visual or spatial analogy.

## How to Prepare

Master the two patterns above. The key is to write the DFS skeleton from memory so you can focus on the problem-specific logic during the interview.

For **implicit grid DFS**, you must be fluent in both the recursive and iterative (stack) approaches. The recursive approach is often cleaner for counting or aggregation.

<div class="code-group">

```python
# Pattern: DFS on a 2D Grid (Recursive)
# Time: O(R * C) | Space: O(R * C) in worst-case recursion depth
def dfs_grid_recursive(grid, r, c):
    # 1. Boundary check & "water" check (problem-specific condition)
    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] == 0:
        return 0

    # 2. Mark as visited to prevent cycles. Use mutation or a separate `visited` set.
    grid[r][c] = 0

    # 3. Initialize result (for problems like Max Area of Island)
    area = 1

    # 4. Explore 4 (or 8) directions
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    for dr, dc in directions:
        area += dfs_grid_recursive(grid, r + dr, c + dc)

    return area

# Example entry point for LeetCode 695:
def maxAreaOfIsland(grid):
    max_area = 0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == 1:
                max_area = max(max_area, dfs_grid_recursive(grid, r, c))
    return max_area
```

```javascript
// Pattern: DFS on a 2D Grid (Recursive)
// Time: O(R * C) | Space: O(R * C) in worst-case recursion depth
function dfsGridRecursive(grid, r, c) {
  // 1. Boundary check & "water" check
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] === 0) {
    return 0;
  }
  // 2. Mark as visited
  grid[r][c] = 0;
  // 3. Initialize result
  let area = 1;
  // 4. Explore 4 directions
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (const [dr, dc] of directions) {
    area += dfsGridRecursive(grid, r + dr, c + dc);
  }
  return area;
}

// Example entry point for LeetCode 695:
function maxAreaOfIsland(grid) {
  let maxArea = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 1) {
        maxArea = Math.max(maxArea, dfsGridRecursive(grid, r, c));
      }
    }
  }
  return maxArea;
}
```

```java
// Pattern: DFS on a 2D Grid (Recursive)
// Time: O(R * C) | Space: O(R * C) in worst-case recursion depth
public class Solution {
    private int dfsGridRecursive(int[][] grid, int r, int c) {
        // 1. Boundary check & "water" check
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] == 0) {
            return 0;
        }
        // 2. Mark as visited
        grid[r][c] = 0;
        // 3. Initialize result
        int area = 1;
        // 4. Explore 4 directions
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
        for (int[] dir : directions) {
            area += dfsGridRecursive(grid, r + dir[0], c + dir[1]);
        }
        return area;
    }

    public int maxAreaOfIsland(int[][] grid) {
        int maxArea = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == 1) {
                    maxArea = Math.max(maxArea, dfsGridRecursive(grid, r, c));
                }
            }
        }
        return maxArea;
    }
}
```

</div>

For **backtracking**, the pattern involves adding a choice, recursing, then undoing the choice (backtracking). Here's the skeleton for a permutation problem.

<div class="code-group">

```python
# Pattern: Backtracking for Permutations
# Time: O(N * N!) | Space: O(N!) for output, O(N) recursion depth
def backtrack_permute(path, used, nums, results):
    # 1. Base case: path is complete
    if len(path) == len(nums):
        results.append(path[:]) # append a copy
        return

    # 2. Iterate through candidate choices
    for i in range(len(nums)):
        # 3. Prune invalid choices (skip used numbers)
        if used[i]:
            continue
        # 4. Make a choice
        used[i] = True
        path.append(nums[i])
        # 5. Recurse
        backtrack_permute(path, used, nums, results)
        # 6. Undo the choice (backtrack)
        path.pop()
        used[i] = False

def permute(nums):
    results = []
    backtrack_permute([], [False]*len(nums), nums, results)
    return results
```

```javascript
// Pattern: Backtracking for Permutations
// Time: O(N * N!) | Space: O(N!) for output, O(N) recursion depth
function backtrackPermute(path, used, nums, results) {
  // 1. Base case
  if (path.length === nums.length) {
    results.push([...path]); // append a copy
    return;
  }
  // 2. Iterate through candidates
  for (let i = 0; i < nums.length; i++) {
    // 3. Prune invalid choices
    if (used[i]) continue;
    // 4. Make a choice
    used[i] = true;
    path.push(nums[i]);
    // 5. Recurse
    backtrackPermute(path, used, nums, results);
    // 6. Undo the choice
    path.pop();
    used[i] = false;
  }
}

function permute(nums) {
  const results = [];
  backtrackPermute([], new Array(nums.length).fill(false), nums, results);
  return results;
}
```

```java
// Pattern: Backtracking for Permutations
// Time: O(N * N!) | Space: O(N!) for output, O(N) recursion depth
public class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> results = new ArrayList<>();
        backtrack(results, new ArrayList<>(), nums, new boolean[nums.length]);
        return results;
    }

    private void backtrack(List<List<Integer>> results, List<Integer> path, int[] nums, boolean[] used) {
        // 1. Base case
        if (path.size() == nums.length) {
            results.add(new ArrayList<>(path)); // append a copy
            return;
        }
        // 2. Iterate through candidates
        for (int i = 0; i < nums.length; i++) {
            // 3. Prune invalid choices
            if (used[i]) continue;
            // 4. Make a choice
            used[i] = true;
            path.add(nums[i]);
            // 5. Recurse
            backtrack(results, path, nums, used);
            // 6. Undo the choice
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}
```

</div>

## How Pinterest Tests Depth-First Search vs Other Companies

Pinterest's DFS questions are typically **medium difficulty** with a strong emphasis on **clean implementation and edge-case handling**. Compared to other companies:

- **vs. Google:** Google often adds a twist that requires combining DFS with another concept (e.g., memoization, bitmasking). Pinterest's twists are usually simpler, like tracking a maximum count or a simple path condition.
- **vs. Meta:** Meta leans heavily into explicit graph traversal (trees, social networks). Pinterest leans into _implicit_ graphs (grids).
- **vs. Startups/Unicorns:** Startups might ask more abstract, open-ended graph problems. Pinterest's problems feel more "applied"—you can often visualize the grid as an image or a board.

The unique aspect is the **product context**. Interviewers may subtly hint that the grid represents pin positions or image segments. This doesn't change the algorithm, but it shows they value engineers who can map real-world problems to computational solutions.

## Study Order

Tackle these sub-topics in this order to build a solid foundation:

1.  **Basic Tree DFS (Pre/In/Post-order):** Before graphs, master DFS on trees. It's simpler (no cycles) and teaches you the recursive mindset. Understand both traversal and search (finding a node).
2.  **DFS on Implicit 2D Grids:** This is Pinterest's bread and butter. Start with the simplest "flood fill" (**LeetCode 733**) to learn the marking pattern, then move to island counting (**200**) and area calculation (**695**).
3.  **Backtracking Fundamentals:** Learn to generate all permutations (**46**) and subsets (**78**). This teaches you the choose-explore-unchoose pattern critical for pathfinding.
4.  **Combined Grid Backtracking:** Apply backtracking to grids with **Word Search (79)**. This combines patterns 2 and 3.
5.  **Cycle Detection & Graph Basics:** Finally, touch on DFS for cycle detection in directed graphs. It's less common at Pinterest but rounds out your knowledge.

This order works because it moves from simple structures (trees) to more complex but common patterns (grids), then to stateful exploration (backtracking), before finally covering less frequent but important graph theory.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous.

1.  **LeetCode 733: Flood Fill** - The simplest grid DFS. Practice both recursive and iterative.
2.  **LeetCode 200: Number of Islands** - The absolute must-solve. Get your code to under 5 minutes.
3.  **LeetCode 695: Max Area of Island** - Adds one line of logic to the island counter. Tests if you truly understand the recursion's return value.
4.  **LeetCode 46: Permutations** - Master the backtracking skeleton.
5.  **LeetCode 79: Word Search** - The classic Pinterest-style combo problem. If you can solve this cleanly, you're in good shape.
6.  **(Optional) LeetCode 207: Course Schedule** - For graph DFS cycle detection. Lower priority but good for completeness.

After this core set, if you have time, practice **LeetCode 130: Surrounded Regions** and **LeetCode 694: Number of Distinct Islands** for additional grid variations.

[Practice Depth-First Search at Pinterest](/company/pinterest/depth-first-search)
