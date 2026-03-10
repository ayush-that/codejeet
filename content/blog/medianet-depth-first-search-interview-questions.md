---
title: "Depth-First Search Questions at Media.net: What to Expect"
description: "Prepare for Depth-First Search interview questions at Media.net — patterns, difficulty breakdown, and study tips."
date: "2030-07-11"
category: "dsa-patterns"
tags: ["medianet", "depth-first-search", "interview prep"]
---

If you're preparing for a Media.net interview, you'll quickly notice a significant emphasis on graph traversal algorithms. With Depth-First Search (DFS) appearing in roughly 18% of their tagged problems (6 out of 33), it's not just a topic you might see—it's a core competency they actively test. This frequency suggests interviewers use DFS problems as a reliable filter to assess a candidate's comfort with recursion, systematic exploration of state spaces, and ability to model real-world adjacency problems. Unlike companies that might use DFS as a stepping stone to more complex graph theory, Media.net often presents it as the main event, requiring clean, bug-free implementation under pressure.

## Specific Patterns Media.net Favors

Media.net's DFS questions tend to cluster around two distinct patterns: **implicit graph traversal on matrices** and **exhaustive pathfinding on explicit graphs**. They rarely ask for a simple "traverse and print." Instead, they embed DFS within a problem that requires tracking additional state or making decisions at each node.

1.  **Matrix Traversal (Flood Fill / Connected Components):** This is their most common pattern. You're given a 2D grid (like a map of islands, rooms, or pixels) and must explore contiguous regions. The twist is usually in the condition for adjacency (4-direction vs. 8-direction) or the action taken upon visiting a cell (marking it, counting it, transforming it).
    - **Example:** LeetCode #200 "Number of Islands" is the archetype. Media.net problems often resemble this but add a layer, such as finding the _perimeter_ of the island or its _shape descriptor_.

2.  **Pathfinding with Constraints (Backtracking):** Here, you have an explicit graph or tree (or a structure that can be modeled as one, like a filesystem) and must find all paths or a specific path that meets certain criteria. This tests your ability to implement backtracking—adding a choice to the path, recursing, and then removing the choice to explore other possibilities.
    - **Example:** LeetCode #797 "All Paths From Source to Target." A Media.net variant might involve finding paths where the sum of node values meets a target or where nodes satisfy alternating properties.

Notably, they show a preference for **recursive implementations** over iterative ones. This makes sense: recursive DFS is more concise, and its call stack naturally mirrors the problem's exploration path, making it easier to explain and reason about during the interview. You must be prepared to discuss stack overflow concerns for deep graphs and know when an iterative approach with an explicit stack might be necessary.

## How to Prepare

Your preparation should focus on writing DFS that is both correct and adaptable. The core skeleton is small, but the devil is in the details: marking nodes as visited _before_ recursion to avoid cycles, defining the base case, and managing the explored path.

The most critical pattern is the **"visited" management for matrix traversal**. Here’s the robust template you should internalize:

<div class="code-group">

```python
def dfs_matrix(grid, r, c):
    """DFS on a 2D grid. Modifies input grid to mark cells as visited."""
    # 1. Check boundaries and validity (the "base case" for this call)
    if (r < 0 or r >= len(grid) or
        c < 0 or c >= len(grid[0]) or
        grid[r][c] != '1'):  # Or whatever condition signifies "unvisited land"
        return

    # 2. Process current cell (mark as visited IMMEDIATELY to prevent cycles)
    grid[r][c] = '#'  # Mark visited

    # 3. Recurse on all adjacent neighbors (4-directional)
    directions = [(1,0), (-1,0), (0,1), (0,-1)]
    for dr, dc in directions:
        dfs_matrix(grid, r + dr, c + dc)
    # For 8-directional, include diagonal moves.

# Time Complexity: O(M * N), where M and N are grid dimensions. We visit each cell at most once.
# Space Complexity: O(M * N) in the worst case for the recursion call stack (e.g., one giant island).
```

```javascript
function dfsMatrix(grid, r, c) {
  // 1. Check boundaries and validity
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== "1") {
    return;
  }

  // 2. Mark as visited
  grid[r][c] = "#";

  // 3. Recurse on neighbors
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (const [dr, dc] of directions) {
    dfsMatrix(grid, r + dr, c + dc);
  }
}

// Time Complexity: O(M * N)
// Space Complexity: O(M * N) for the call stack.
```

```java
public void dfsMatrix(char[][] grid, int r, int c) {
    // 1. Check boundaries and validity
    if (r < 0 || r >= grid.length ||
        c < 0 || c >= grid[0].length ||
        grid[r][c] != '1') {
        return;
    }

    // 2. Mark as visited
    grid[r][c] = '#';

    // 3. Recurse on neighbors
    int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}};
    for (int[] dir : directions) {
        dfsMatrix(grid, r + dir[0], c + dir[1]);
    }
}

// Time Complexity: O(M * N)
// Space Complexity: O(M * N) for the call stack.
```

</div>

For **backtracking pathfinding**, the pattern changes to managing a mutable path list:

<div class="code-group">

```python
def all_paths_source_target(graph):
    def dfs(node, path):
        # 1. Add current choice to path
        path.append(node)

        # 2. Check if goal state is reached
        if node == len(graph) - 1:
            results.append(path.copy())  # Save a *copy* of the path
        else:
            # 3. Recurse on all neighbors (next choices)
            for neighbor in graph[node]:
                dfs(neighbor, path)

        # 4. Backtrack: remove current choice before returning
        path.pop()

    results = []
    dfs(0, [])
    return results

# Time Complexity: O(2^N * N) in worst-case (every node connected to all later nodes).
# Space Complexity: O(N) for recursion depth and path storage.
```

```javascript
function allPathsSourceTarget(graph) {
  const results = [];

  function dfs(node, path) {
    // 1. Add current choice
    path.push(node);

    // 2. Check goal
    if (node === graph.length - 1) {
      results.push([...path]); // Save a copy
    } else {
      // 3. Recurse
      for (const neighbor of graph[node]) {
        dfs(neighbor, path);
      }
    }

    // 4. Backtrack
    path.pop();
  }

  dfs(0, []);
  return results;
}

// Time Complexity: O(2^N * N)
// Space Complexity: O(N)
```

```java
public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
    List<List<Integer>> results = new ArrayList<>();
    List<Integer> path = new ArrayList<>();
    dfs(graph, 0, path, results);
    return results;
}

private void dfs(int[][] graph, int node, List<Integer> path, List<List<Integer>> results) {
    // 1. Add current choice
    path.add(node);

    // 2. Check goal
    if (node == graph.length - 1) {
        results.add(new ArrayList<>(path)); // Save a copy
    } else {
        // 3. Recurse
        for (int neighbor : graph[node]) {
            dfs(graph, neighbor, path, results);
        }
    }

    // 4. Backtrack
    path.remove(path.size() - 1);
}

// Time Complexity: O(2^N * N)
// Space Complexity: O(N)
```

</div>

## How Media.net Tests Depth-First Search vs Other Companies

Compared to FAANG companies, Media.net's DFS questions often feel more "applied" and less "theoretical." At Google, you might get a DFS problem that's a clever reduction of a novel, complex system. At Amazon, DFS might be part of a larger object-oriented design for a warehouse robot. **Media.net's approach is more direct:** they present a problem that is _clearly_ a graph or matrix, but the complexity lies in the precise conditions for traversal and the state you need to accumulate.

The difficulty is typically in the **Medium** range on LeetCode. You won't often see the brutal "Hard" DFS problems that require advanced pruning or combine DFS with Union-Find or Dynamic Programming. Instead, they test for thoroughness: did you handle all edge cases (empty grid, single cell, all walls)? Did you avoid infinite recursion? Is your code clean and easy to follow? This aligns with a company that values robust, maintainable code for advertising technology systems.

## Study Order

Tackle DFS in this logical progression to build a solid foundation:

1.  **Basic Tree DFS:** Start with binary tree traversals (Pre-order, In-order, Post-order). This teaches you the recursion flow without the complexity of cycles. (LeetCode #144, #94).
2.  **Matrix/Grid DFS:** Learn to traverse 2D arrays. This introduces boundary checks and the concept of marking visited cells _in-place_. Master both 4-directional and 8-directional movement. (LeetCode #200, #463 Island Perimeter).
3.  **Backtracking on Explicit Graphs:** Practice finding _all_ paths in a Directed Acyclic Graph (DAG) or with small constraints. This is where you learn the crucial `path.append()` / `path.pop()` pattern. (LeetCode #797, #78 Subsets).
4.  **Cycle Detection & Topological Sort:** Understand how to modify DFS with a "visiting state" (white/gray/black) to detect cycles in directed graphs, which is a common follow-up question. (LeetCode #207 Course Schedule).
5.  **DFS with Memoization:** For problems involving repeated subproblems on graphs (like unique paths with obstacles), learn to add a cache to your DFS to avoid exponential re-computation, blending DFS with DP concepts.

## Recommended Practice Order

Solve these problems in sequence. Each builds on the previous one, introducing a new twist Media.net might employ.

1.  **LeetCode #200 "Number of Islands"**: The absolute fundamental. Write it until you can do it perfectly in 3 minutes.
2.  **LeetCode #695 "Max Area of Island"**: A direct extension of #200. Instead of counting islands, you now track the size of each component, teaching you to return values from your DFS.
3.  **LeetCode #463 "Island Perimeter"**: Another #200 variant. This tests if you can modify the DFS logic to reason about edges and neighbors differently.
4.  **LeetCode #797 "All Paths From Source to Target"**: The fundamental backtracking-on-a-graph problem. Master the path management pattern shown in the code above.
5.  **LeetCode #130 "Surrounded Regions"**: A more challenging matrix problem. The "twist" is that you start DFS from the border, not from every cell. This teaches you to think about _where_ to initiate traversal.
6.  **LeetCode #490 "The Maze" (Premium) / Similar**: This introduces the concept of traversing until you hit a boundary (a wall) before recursing, a common pattern in grid-based puzzle problems.

By following this progression, you'll move from simply understanding DFS to wielding it flexibly—exactly what a Media.net interviewer is looking for. Remember, their goal isn't to see if you've memorized an algorithm, but if you can _use_ it as a tool to dissect a problem.

[Practice Depth-First Search at Media.net](/company/medianet/depth-first-search)
