---
title: "Depth-First Search Questions at Citadel: What to Expect"
description: "Prepare for Depth-First Search interview questions at Citadel — patterns, difficulty breakdown, and study tips."
date: "2028-07-31"
category: "dsa-patterns"
tags: ["citadel", "depth-first-search", "interview prep"]
---

If you're preparing for a Citadel interview, you've likely seen the statistic: they have 12 Depth-First Search (DFS) questions in their tagged problem list. That's one in every eight of their problems. But what does that _actually_ mean for your interview? It's not that they're obsessed with a single algorithm; it's that DFS is the Swiss Army knife for solving a critical class of problems Citadel cares deeply about: modeling complex, branching states and exploring decision spaces. This is fundamental to finance, whether you're backtesting a trading strategy across millions of market scenarios, evaluating risk exposure through a dependency graph, or simply traversing a directory of financial data. DFS isn't just an algorithm question; it's a systems modeling question.

## Specific Patterns Citadel Favors

Citadel's DFS problems skew heavily toward **applied graph traversal on implicit graphs** and **backtracking for combinatorial generation**. You won't often get a simple "traverse this adjacency list." Instead, you'll get a problem where the graph isn't given—you have to model the state space yourself.

The two most common patterns are:

1.  **Backtracking for Path Enumeration:** Problems where you must generate all valid combinations or permutations under constraints, mirroring the exploration of all possible trade sequences or portfolio allocations. Think **LeetCode #39 (Combination Sum)** or **#131 (Palindrome Partitioning)**. The state is your current combination and position in the input.
2.  **DFS on a Grid or Matrix:** This is about exploring contiguous regions, often with a twist. **LeetCode #200 (Number of Islands)** is the classic, but Citadel's versions frequently involve modifying the grid in-place to track visited states (a space optimization they appreciate) or counting unique paths with constraints, akin to evaluating paths through a risk matrix.

They slightly prefer **iterative DFS using an explicit stack** for traversal problems, as it avoids recursion limits on large inputs and demonstrates explicit control over state. However, for backtracking, recursive solutions are often cleaner and equally acceptable.

<div class="code-group">

```python
# Pattern: Iterative DFS for Grid Traversal (Number of Islands)
# Time: O(R * C) | Space: O(min(R, C)) in worst-case for stack, but O(R*C) if grid modified in-place.
def numIslands(grid):
    if not grid:
        return 0

    rows, cols = len(grid), len(grid[0])
    count = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                # Start iterative DFS
                stack = [(r, c)]
                grid[r][c] = '0'  # Mark as visited by sinking the island
                while stack:
                    cr, cc = stack.pop()
                    # Explore neighbors
                    for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
                        nr, nc = cr + dr, cc + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            stack.append((nr, nc))
                            grid[nr][nc] = '0'  # Mark visited
    return count
```

```javascript
// Pattern: Iterative DFS for Grid Traversal (Number of Islands)
// Time: O(R * C) | Space: O(min(R, C)) for stack, but O(1) extra if grid modified in-place.
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
        grid[r][c] = "0";

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
// Pattern: Iterative DFS for Grid Traversal (Number of Islands)
// Time: O(R * C) | Space: O(min(R, C)) for stack, but O(1) extra if grid modified in-place.
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
                grid[r][c] = '0';

                while (!stack.isEmpty()) {
                    int[] curr = stack.pop();
                    int cr = curr[0], cc = curr[1];
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

## How to Prepare

Master the two core implementations: recursive (for backtracking) and iterative (for pure traversal). Then, practice identifying the "state" in a problem. Ask yourself: What constitutes a node in my implicit graph? For combination sum, it's `(current_index, current_sum, current_path)`. For a maze solver, it's `(row, col)`.

Always discuss space complexity trade-offs. Using a separate `visited` set is clear, but modifying the input grid/array in-place is often more efficient and shows practical optimization thinking—just be sure to ask the interviewer if modification is allowed.

<div class="code-group">

```python
# Pattern: Recursive Backtracking (Combination Sum)
# Time: O(N^(T/M)) where N = candidates, T = target, M = min(candidate).
# Space: O(T/M) for recursion depth and path storage.
def combinationSum(candidates, target):
    def backtrack(start, path, remaining):
        if remaining == 0:
            result.append(path[:])  # Take a copy of the path
            return
        if remaining < 0:
            return

        for i in range(start, len(candidates)):
            path.append(candidates[i])
            # Note: we pass `i` (not i+1) to allow reuse of same element
            backtrack(i, path, remaining - candidates[i])
            path.pop()  # Backtrack

    result = []
    candidates.sort()  # Optional optimization for early termination
    backtrack(0, [], target)
    return result
```

```javascript
// Pattern: Recursive Backtracking (Combination Sum)
// Time: O(N^(T/M)) | Space: O(T/M) for recursion depth.
function combinationSum(candidates, target) {
  const result = [];

  function backtrack(start, path, remaining) {
    if (remaining === 0) {
      result.push([...path]); // Copy the path
      return;
    }
    if (remaining < 0) return;

    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      backtrack(i, path, remaining - candidates[i]); // Pass `i`, not i+1
      path.pop(); // Backtrack
    }
  }

  candidates.sort((a, b) => a - b); // Optional
  backtrack(0, [], target);
  return result;
}
```

```java
// Pattern: Recursive Backtracking (Combination Sum)
// Time: O(N^(T/M)) | Space: O(T/M) for recursion depth.
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> result = new ArrayList<>();
    Arrays.sort(candidates); // Optional
    backtrack(result, new ArrayList<>(), candidates, target, 0);
    return result;
}

private void backtrack(List<List<Integer>> result, List<Integer> temp, int[] candidates, int remain, int start) {
    if (remain < 0) return;
    if (remain == 0) {
        result.add(new ArrayList<>(temp)); // Copy the list
        return;
    }
    for (int i = start; i < candidates.length; i++) {
        temp.add(candidates[i]);
        backtrack(result, temp, candidates, remain - candidates[i], i); // Note `i`, not i+1
        temp.remove(temp.size() - 1); // Backtrack
    }
}
```

</div>

## How Citadel Tests Depth-First Search vs Other Companies

At large tech companies (FAANG), DFS is often a component in a larger system design or a step in a more complex algorithm (e.g., finding strongly connected components). The focus is on algorithmic purity and scalability.

At Citadel, the context is different. The DFS problem is frequently a **self-contained simulation**. They want to see if you can take a business rule (e.g., "a valid trade sequence cannot exceed risk limit X") and translate it into a correct state exploration. The difficulty is in the modeling, not the algorithm itself. They also place a higher premium on **optimal space usage** because of the memory constraints in high-frequency trading systems. An O(N) extra space solution might be acceptable at a FAANG interview, but at Citadel, you'll be pushed to find the O(1) in-place modification if it exists.

## Study Order

1.  **Basic Tree/Graph Traversal:** Internalize the difference between pre-order, in-order, and post-order. This is non-negotiable foundational knowledge.
2.  **DFS on Grids:** Practice the "sink the island" pattern. This teaches you to model a 2D array as a graph and handle visited states.
3.  **Backtracking Templates:** Memorize the recursive template with `path.append()`, recurse, `path.pop()`. This pattern is universal.
4.  **Pathfinding Variations:** Learn to adapt DFS to find _a_ path (using early return) vs _all_ paths (exhaustive search). Citadel asks both.
5.  **Cycle Detection & Topological Sort:** Understand how DFS with a "visiting" state set can detect cycles in directed graphs—critical for dependency resolution.
6.  **Memoization Integration:** Learn when to add a memoization dictionary (`@lru_cache` in Python) to your DFS to avoid repeated subproblem computation, turning it into a DP solution.

## Recommended Practice Order

Solve these in sequence to build complexity:

1.  **LeetCode #94 (Binary Tree Inorder Traversal)** - Basic recursive and iterative traversal.
2.  **LeetCode #200 (Number of Islands)** - Foundational grid DFS.
3.  **LeetCode #79 (Word Search)** - Backtracking on a grid, a classic Citadel-style problem.
4.  **LeetCode #39 (Combination Sum)** - Master the backtracking template for combinations.
5.  **LeetCode #131 (Palindrome Partitioning)** - A harder backtracking problem that requires checking subproblem validity at each step.
6.  **LeetCode #207 (Course Schedule)** - DFS for cycle detection and topological sorting.
7.  **LeetCode #329 (Longest Increasing Path in a Matrix)** - DFS with memoization (DP), a favorite for combining traversal with optimization.

The throughline in all these problems is **state exploration**. At Citadel, your ability to cleanly define what a "state" is, track it, and explore its neighbors under constraints is what they're evaluating. It's less about knowing DFS and more about wielding it as a precise tool for state-space analysis.

[Practice Depth-First Search at Citadel](/company/citadel/depth-first-search)
