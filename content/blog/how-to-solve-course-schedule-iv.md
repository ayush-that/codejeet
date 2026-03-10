---
title: "How to Solve Course Schedule IV — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Course Schedule IV. Medium difficulty, 59.7% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory, Topological Sort."
date: "2028-10-08"
category: "dsa-patterns"
tags: ["course-schedule-iv", "depth-first-search", "breadth-first-search", "graph-theory", "medium"]
---

# How to Solve Course Schedule IV

This problem extends the classic Course Schedule series by asking us to answer multiple queries about prerequisite relationships. Given a list of courses with prerequisites, we need to determine for each query `[u, v]` whether course `u` is a prerequisite of course `v` (either directly or indirectly). What makes this problem interesting is that we need to answer many queries efficiently after preprocessing the prerequisite graph.

## Visual Walkthrough

Let's trace through a concrete example:

- `numCourses = 3`
- `prerequisites = [[1,2],[0,2]]` (course 1 is prerequisite for 2, course 0 is prerequisite for 2)
- `queries = [[0,1],[1,2],[0,2],[2,0]]`

We can visualize this as a directed graph:

- 1 → 2
- 0 → 2

Now let's answer the queries:

1. `[0,1]`: Is course 0 a prerequisite for course 1? Looking at the graph, there's no path from 0 to 1. Answer: **False**
2. `[1,2]`: Is course 1 a prerequisite for course 2? Yes, directly. Answer: **True**
3. `[0,2]`: Is course 0 a prerequisite for course 2? Yes, directly. Answer: **True**
4. `[2,0]`: Is course 2 a prerequisite for course 0? No path exists. Answer: **False**

The challenge is that for large graphs with many queries, we need an efficient way to check if there's a path from `u` to `v` for each query.

## Brute Force Approach

A naive approach would be to perform a DFS or BFS from node `u` for each query to check if we can reach node `v`. This is straightforward but inefficient:

1. Build the adjacency list from prerequisites
2. For each query `[u, v]`:
   - Perform DFS/BFS starting from `u`
   - Check if we encounter `v` during traversal
   - Return `True` if found, `False` otherwise

The problem with this approach is its time complexity: O(Q × (N + E)) where Q is number of queries, N is number of courses, and E is number of prerequisites. With up to 100 courses and 5000 queries, this could be up to 500,000 operations, which might be acceptable but isn't optimal. More importantly, this doesn't scale well if we had more courses.

## Optimized Approach

The key insight is that we can precompute all reachability relationships once, then answer each query in O(1) time. This is a classic **transitive closure** problem.

We can use **Floyd-Warshall algorithm** adapted for this graph problem:

1. Create an N × N boolean matrix `reachable` where `reachable[i][j] = True` if course `i` is a prerequisite for course `j`
2. Initialize with direct prerequisites from the input
3. For each intermediate node `k`, update `reachable[i][j]` if `reachable[i][k]` and `reachable[k][j]` are both true
4. After preprocessing, answer each query by looking up `reachable[u][v]`

Alternatively, we can use **DFS with memoization** from each node to find all reachable nodes. This approach is often more efficient for sparse graphs.

## Optimal Solution

The most efficient solution uses DFS from each node to compute all nodes reachable from it. We'll use memoization to avoid redundant computations.

<div class="code-group">

```python
# Time: O(N^3) worst case but O(N^2 + N*E) typical for DFS approach | Space: O(N^2)
class Solution:
    def checkIfPrerequisite(self, numCourses: int, prerequisites: List[List[int]], queries: List[List[int]]) -> List[bool]:
        # Step 1: Build adjacency list for the graph
        # graph[u] contains all courses that have u as a direct prerequisite
        graph = [[] for _ in range(numCourses)]
        for prereq, course in prerequisites:
            graph[prereq].append(course)

        # Step 2: Initialize memoization table
        # reachable[u] will store all courses that have u as a prerequisite (direct or indirect)
        reachable = [set() for _ in range(numCourses)]

        # Step 3: DFS function with memoization
        def dfs(node):
            # If we've already computed reachable nodes from this node, return cached result
            if reachable[node]:
                return reachable[node]

            # Start with direct neighbors
            for neighbor in graph[node]:
                reachable[node].add(neighbor)
                # Recursively get all nodes reachable from neighbor
                reachable[node].update(dfs(neighbor))

            return reachable[node]

        # Step 4: Compute reachable sets for all nodes
        for course in range(numCourses):
            dfs(course)

        # Step 5: Answer all queries using precomputed reachable sets
        results = []
        for u, v in queries:
            results.append(v in reachable[u])

        return results
```

```javascript
// Time: O(N^3) worst case but O(N^2 + N*E) typical for DFS approach | Space: O(N^2)
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @param {number[][]} queries
 * @return {boolean[]}
 */
var checkIfPrerequisite = function (numCourses, prerequisites, queries) {
  // Step 1: Build adjacency list for the graph
  const graph = new Array(numCourses).fill(0).map(() => []);
  for (const [prereq, course] of prerequisites) {
    graph[prereq].push(course);
  }

  // Step 2: Initialize memoization table
  // reachable[u] will store all courses that have u as a prerequisite
  const reachable = new Array(numCourses).fill(0).map(() => new Set());

  // Step 3: DFS function with memoization
  const dfs = (node) => {
    // If we've already computed reachable nodes from this node, return cached result
    if (reachable[node].size > 0) {
      return reachable[node];
    }

    // Explore all direct neighbors
    for (const neighbor of graph[node]) {
      reachable[node].add(neighbor);
      // Recursively get all nodes reachable from neighbor
      const neighborReachable = dfs(neighbor);
      for (const course of neighborReachable) {
        reachable[node].add(course);
      }
    }

    return reachable[node];
  };

  // Step 4: Compute reachable sets for all nodes
  for (let course = 0; course < numCourses; course++) {
    dfs(course);
  }

  // Step 5: Answer all queries using precomputed reachable sets
  const results = [];
  for (const [u, v] of queries) {
    results.push(reachable[u].has(v));
  }

  return results;
};
```

```java
// Time: O(N^3) worst case but O(N^2 + N*E) typical for DFS approach | Space: O(N^2)
class Solution {
    public List<Boolean> checkIfPrerequisite(int numCourses, int[][] prerequisites, int[][] queries) {
        // Step 1: Build adjacency list for the graph
        List<Integer>[] graph = new ArrayList[numCourses];
        for (int i = 0; i < numCourses; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] prereq : prerequisites) {
            graph[prereq[0]].add(prereq[1]);
        }

        // Step 2: Initialize memoization table
        // reachable[u] will store all courses that have u as a prerequisite
        Set<Integer>[] reachable = new HashSet[numCourses];
        for (int i = 0; i < numCourses; i++) {
            reachable[i] = new HashSet<>();
        }

        // Step 3: DFS function with memoization
        boolean[] visited = new boolean[numCourses];
        for (int course = 0; course < numCourses; course++) {
            dfs(course, graph, reachable, visited);
            // Reset visited array for next DFS
            Arrays.fill(visited, false);
        }

        // Step 4: Answer all queries using precomputed reachable sets
        List<Boolean> results = new ArrayList<>();
        for (int[] query : queries) {
            results.add(reachable[query[0]].contains(query[1]));
        }

        return results;
    }

    private Set<Integer> dfs(int node, List<Integer>[] graph, Set<Integer>[] reachable, boolean[] visited) {
        // If we've already computed reachable nodes from this node, return cached result
        if (!reachable[node].isEmpty()) {
            return reachable[node];
        }

        // Mark node as visited to prevent cycles
        visited[node] = true;

        // Explore all direct neighbors
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                reachable[node].add(neighbor);
                // Recursively get all nodes reachable from neighbor
                Set<Integer> neighborReachable = dfs(neighbor, graph, reachable, visited);
                reachable[node].addAll(neighborReachable);
            }
        }

        return reachable[node];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Building the graph: O(E) where E is the number of prerequisites
- DFS from each node: In worst case, each DFS explores all nodes, so O(N × (N + E)) = O(N² + N×E)
- Answering queries: O(Q) where Q is the number of queries
- Total: O(N² + N×E + Q)

**Space Complexity:**

- Graph adjacency list: O(N + E)
- Reachable sets: O(N²) in worst case (each node can reach all other nodes)
- DFS recursion stack: O(N) in worst case
- Total: O(N² + E)

The O(N²) space for reachable sets is the bottleneck, but it enables O(1) query answering.

## Common Mistakes

1. **Forgetting about indirect prerequisites**: Only checking direct prerequisites in the adjacency list. Remember that if A → B and B → C, then A is a prerequisite for C even though not directly connected.

2. **Not handling cycles properly**: While the problem states the graph has no cycles (it's a DAG), some implementations might still need cycle detection. Always verify your DFS handles visited nodes correctly.

3. **Inefficient query answering**: Performing a new DFS/BFS for each query. This gives O(Q × (N + E)) time complexity which is too slow for large Q. The key optimization is precomputing all reachability relationships.

4. **Incorrect memoization**: Not caching DFS results leads to exponential time complexity. Each node's reachable set should be computed only once.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Graph reachability / transitive closure**: Similar to problems like:
   - [Course Schedule](https://leetcode.com/problems/course-schedule/) - Basic cycle detection in prerequisites
   - [Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) - Topological sort of prerequisites
   - [Find the Town Judge](https://leetcode.com/problems/find-the-town-judge/) - Directed graph relationships

2. **Precomputation for multiple queries**: When you need to answer many queries about the same data structure:
   - [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/) - Precompute prefix sums
   - [Word Search II](https://leetcode.com/problems/word-search-ii/) - Preprocess dictionary into trie

3. **DFS with memoization**: Caching results of expensive computations:
   - [Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/)
   - [Word Break](https://leetcode.com/problems/word-break/)

## Key Takeaways

1. **When you need to answer many queries about relationships in a graph**, precompute all reachability information. The O(N²) memory cost is often worth the O(1) query time.

2. **DFS with memoization is powerful for DAGs**. Since there are no cycles, we can safely cache results without worrying about infinite recursion or stale cache entries.

3. **Transitive closure problems often have multiple solutions**: Floyd-Warshall (O(N³)), DFS from each node (O(N² + N×E)), or topological sort with propagation. Choose based on graph density and constraints.

[Practice this problem on CodeJeet](/problem/course-schedule-iv)
