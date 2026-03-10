---
title: "How to Solve All Paths From Source to Target — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode All Paths From Source to Target. Medium difficulty, 83.5% acceptance rate. Topics: Backtracking, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2027-01-30"
category: "dsa-patterns"
tags:
  [
    "all-paths-from-source-to-target",
    "backtracking",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve All Paths From Source to Target

You're given a directed acyclic graph (DAG) where you need to find **all possible paths** from the starting node (0) to the ending node (n-1). The graph is represented as an adjacency list where `graph[i]` contains all nodes reachable from node i. What makes this problem interesting is that while finding one path is straightforward with DFS, finding **all** paths requires careful backtracking to explore every possible route without getting stuck in cycles (though the DAG guarantee prevents cycles).

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this graph:

```
graph = [[1,2],[3],[3],[]]
```

This represents 4 nodes (0, 1, 2, 3) where:

- From node 0: can go to nodes 1 and 2
- From node 1: can go to node 3
- From node 2: can go to node 3
- From node 3: no outgoing edges (dead end)

We need all paths from node 0 to node 3. Let's trace the exploration:

**Step 1:** Start at node 0, current path = [0]

- Explore neighbor 1 first: path becomes [0, 1]
- From node 1, explore neighbor 3: path becomes [0, 1, 3]
- Found a complete path! Add [0, 1, 3] to results
- Backtrack to node 1, then to node 0

**Step 2:** At node 0 again, path = [0]

- Explore neighbor 2: path becomes [0, 2]
- From node 2, explore neighbor 3: path becomes [0, 2, 3]
- Found another complete path! Add [0, 2, 3] to results

**Final result:** [[0, 1, 3], [0, 2, 3]]

The key insight is that we need to **explore all branches** from each node, and when we reach the target or a dead end, we backtrack to try other possibilities.

## Brute Force Approach

For this problem, there's essentially only one reasonable approach: depth-first search with backtracking. However, a "brute force" way to think about it would be to generate **all possible sequences** of nodes and check if they form valid paths from 0 to n-1.

Why this doesn't work:

1. **Exponential blowup**: In a complete graph, there could be n! possible sequences
2. **Inefficient validation**: Checking if each sequence is a valid path requires verifying each consecutive pair exists as an edge
3. **Redundant work**: The same subpaths would be checked repeatedly

Even with the DAG constraint, this approach is impractical for graphs with more than a few nodes. The better approach is to systematically explore the graph using DFS with backtracking, which naturally avoids invalid paths and reuses computation.

## Optimized Approach

The optimal solution uses **DFS with backtracking**. Here's the step-by-step reasoning:

1. **Why DFS?** We need to explore paths deeply until we either reach the target or hit a dead end. DFS naturally follows a path to its conclusion before backtracking.

2. **Why backtracking?** When we finish exploring one path, we need to "undo" our last step to try other branches. Without backtracking, we'd need to create new copies of the path at each step, which wastes memory.

3. **Key insight**: Since the graph is a DAG (no cycles), we don't need to track visited nodes to avoid infinite loops. This simplifies the implementation compared to general graphs.

4. **Algorithm outline**:
   - Start DFS from node 0 with an initial path containing just [0]
   - At each node, check if it's the target (n-1)
     - If yes, add the current path to results
     - If no, recursively explore all neighbors
   - After exploring all neighbors, backtrack by removing the current node from the path

5. **Optimization consideration**: We could use memoization to store paths from each node to the target, but since we need to return all paths (not just count them), and we need the actual paths, memoization doesn't save significant work here.

## Optimal Solution

Here's the complete implementation using DFS with backtracking:

<div class="code-group">

```python
# Time: O(2^n * n) - In worst case (complete DAG), there are 2^(n-2) paths,
# each of length O(n)
# Space: O(n) for recursion stack and current path (excluding output storage)
class Solution:
    def allPathsSourceTarget(self, graph: List[List[int]]) -> List[List[int]]:
        # Store the result list
        result = []
        n = len(graph)

        def dfs(node, path):
            """
            Depth-first search to find all paths from current node to target.

            Args:
                node: Current node we're exploring
                path: List representing the current path from source to 'node'
            """
            # Add current node to the path
            path.append(node)

            # If we've reached the target node (n-1), save the current path
            if node == n - 1:
                # Make a copy of the path since we'll be modifying it via backtracking
                result.append(path.copy())
            else:
                # Explore all neighbors of the current node
                for neighbor in graph[node]:
                    dfs(neighbor, path)

            # Backtrack: remove current node from path before returning
            # This allows the same path list to be reused for other branches
            path.pop()

        # Start DFS from node 0 with initial path
        dfs(0, [])
        return result
```

```javascript
// Time: O(2^n * n) - In worst case (complete DAG), there are 2^(n-2) paths,
// each of length O(n)
// Space: O(n) for recursion stack and current path (excluding output storage)
/**
 * @param {number[][]} graph
 * @return {number[][]}
 */
var allPathsSourceTarget = function (graph) {
  const result = [];
  const n = graph.length;

  /**
   * Depth-first search to find all paths from current node to target.
   *
   * @param {number} node - Current node we're exploring
   * @param {number[]} path - Array representing the current path from source to 'node'
   */
  function dfs(node, path) {
    // Add current node to the path
    path.push(node);

    // If we've reached the target node (n-1), save the current path
    if (node === n - 1) {
      // Make a copy of the path since we'll be modifying it via backtracking
      result.push([...path]);
    } else {
      // Explore all neighbors of the current node
      for (const neighbor of graph[node]) {
        dfs(neighbor, path);
      }
    }

    // Backtrack: remove current node from path before returning
    // This allows the same path array to be reused for other branches
    path.pop();
  }

  // Start DFS from node 0 with initial path
  dfs(0, []);
  return result;
};
```

```java
// Time: O(2^n * n) - In worst case (complete DAG), there are 2^(n-2) paths,
// each of length O(n)
// Space: O(n) for recursion stack and current path (excluding output storage)
class Solution {
    public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
        List<List<Integer>> result = new ArrayList<>();
        int n = graph.length;

        // Start DFS from node 0 with initial path
        dfs(graph, 0, new ArrayList<>(), result, n);
        return result;
    }

    /**
     * Depth-first search to find all paths from current node to target.
     *
     * @param graph The adjacency list representation of the graph
     * @param node Current node we're exploring
     * @param path List representing the current path from source to 'node'
     * @param result List to store all complete paths
     * @param n Total number of nodes in the graph
     */
    private void dfs(int[][] graph, int node, List<Integer> path,
                     List<List<Integer>> result, int n) {
        // Add current node to the path
        path.add(node);

        // If we've reached the target node (n-1), save the current path
        if (node == n - 1) {
            // Make a copy of the path since we'll be modifying it via backtracking
            result.add(new ArrayList<>(path));
        } else {
            // Explore all neighbors of the current node
            for (int neighbor : graph[node]) {
                dfs(graph, neighbor, path, result, n);
            }
        }

        // Backtrack: remove current node from path before returning
        // This allows the same path list to be reused for other branches
        path.remove(path.size() - 1);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(2^n \* n)**

- In the worst case (a complete DAG where each node connects to all higher-numbered nodes), there are 2^(n-2) possible paths from node 0 to node n-1. Each node (except first and last) can be either included or excluded in a path.
- For each path, we spend O(n) time to copy it to the result list when we reach the target.
- Thus, worst-case time is O(2^n \* n).

**Space Complexity: O(n)**

- The recursion depth is at most n (if we follow a path of length n).
- The `path` list stores at most n nodes.
- The output storage (all paths) is not counted in auxiliary space complexity, but if we did count it, it would be O(2^n \* n) to store all possible paths.
- So auxiliary space (excluding output) is O(n) for the recursion stack and current path.

## Common Mistakes

1. **Forgetting to backtrack**: The most common error is not removing the current node from the path after exploring its neighbors. This causes paths to keep growing incorrectly. Always remember: `path.append(node)` must be paired with `path.pop()`.

2. **Not copying the path when adding to results**: If you do `result.append(path)` instead of `result.append(path.copy())` (in Python), you're adding a reference to the same list that will keep changing. When backtracking modifies `path`, all previously added paths in `result` get corrupted.

3. **Assuming cycles exist**: While the problem states it's a DAG, some candidates add visited sets to avoid cycles anyway. This isn't wrong but adds unnecessary complexity. Read the problem constraints carefully.

4. **Missing the base case**: Forgetting to check `if node == n-1:` leads to infinite recursion or incorrect paths. Always identify your termination condition first.

5. **Using BFS instead of DFS**: BFS can also find all paths but requires storing multiple partial paths in the queue, which uses more memory. DFS with backtracking is more memory-efficient for this problem.

## When You'll See This Pattern

This DFS with backtracking pattern appears in many graph and tree problems:

1. **Path Sum II (LeetCode 113)**: Find all root-to-leaf paths where the sum equals a target. Same backtracking pattern on a binary tree.

2. **Permutations (LeetCode 46)**: Generate all permutations of a list. The backtracking structure is identical—explore all choices, recurse, then undo the choice.

3. **Subsets (LeetCode 78)**: Generate all subsets of a set. Similar decision-making at each element (include or exclude).

4. **Word Search II (LeetCode 212)**: Find all words in a board. Uses DFS with backtracking to explore all possible paths in a grid.

The key signature is when you need to **exhaustively explore all possible sequences/combinations** and return all valid ones, not just count them.

## Key Takeaways

1. **DFS + backtracking is the go-to for "find all paths" problems**: When you need to explore all possible routes and return the actual paths (not just counts), this pattern is almost always the right choice.

2. **Backtracking has a clear template**:
   - Make a choice (add to path)
   - Recurse to explore further
   - Undo the choice (remove from path)
     This three-step pattern appears in many combinatorial problems.

3. **DAGs simplify graph traversal**: Without cycles, you don't need visited sets, making the code cleaner. Always check if a graph is acyclic—it often enables simpler solutions.

4. **Copy paths when saving results**: This is a subtle but critical detail. The current path list gets modified during backtracking, so you must save copies of complete paths.

Related problems: [Number of Ways to Arrive at Destination](/problem/number-of-ways-to-arrive-at-destination), [Number of Increasing Paths in a Grid](/problem/number-of-increasing-paths-in-a-grid)
