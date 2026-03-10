---
title: "How to Solve Possible Bipartition — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Possible Bipartition. Medium difficulty, 52.4% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Union-Find, Graph Theory."
date: "2028-04-11"
category: "dsa-patterns"
tags: ["possible-bipartition", "depth-first-search", "breadth-first-search", "union-find", "medium"]
---

# How to Solve Possible Bipartition

This problem asks us to determine whether we can split `n` people into two groups such that no two people who dislike each other end up in the same group. What makes this interesting is that it's essentially a graph coloring problem in disguise — each person is a node, each dislike is an edge, and we need to check if the graph is bipartite (can be colored with two colors).

## Visual Walkthrough

Let's walk through an example: `n = 4`, `dislikes = [[1,2],[1,3],[2,4]]`

We have 4 people (1-4) with these dislikes:

- Person 1 dislikes 2 and 3
- Person 2 dislikes 1 and 4
- Person 3 dislikes 1
- Person 4 dislikes 2

**Step 1:** Start with person 1. Assign them to group A (color 0).

**Step 2:** Process person 1's dislikes:

- Person 2 must go to group B (color 1)
- Person 3 must go to group B (color 1)

**Step 3:** Process person 2's dislikes:

- Person 1 is already in group A ✓ (no conflict)
- Person 4 must go to group A (color 0)

**Step 4:** Process person 3's dislikes:

- Person 1 is already in group A ✓ (no conflict)

**Step 5:** Process person 4's dislikes:

- Person 2 is already in group B ✓ (no conflict)

All assignments are consistent, so we can split them! Person 1 and 4 in group A, persons 2 and 3 in group B.

Now consider a counterexample: `n = 3`, `dislikes = [[1,2],[2,3],[1,3]]`

- Person 1 → group A
- Person 2 → group B (dislikes 1)
- Person 3 → group A (dislikes 2) but wait! Person 3 also dislikes person 1 who's already in group A → CONFLICT!

This shows we need to systematically check for contradictions.

## Brute Force Approach

A naive approach might try all possible group assignments. For each person, we could try putting them in group A or group B, then check if any dislikes are violated. This would require checking 2^n possible assignments, which is exponential time — completely impractical for n up to 2000.

Even a slightly better brute force would try to assign groups greedily but might get stuck with contradictions that could be resolved by backtracking. However, any backtracking approach would still be exponential in the worst case.

The key insight is that this is exactly the bipartite graph checking problem, which has well-known polynomial-time solutions.

## Optimized Approach

The problem reduces to checking if the graph formed by `n` nodes (people) and `dislikes` edges is **bipartite**. A graph is bipartite if and only if we can color all nodes using only two colors such that no two adjacent nodes share the same color.

We can solve this using either:

1. **DFS/BFS with coloring** - Traverse the graph, assigning alternating colors to neighbors. If we ever try to assign a color to a node that already has the opposite color, we have a contradiction.
2. **Union-Find (Disjoint Set Union)** - For each dislike (u,v), we know they must be in different groups. We can union u with all of v's "enemies" and v with all of u's "enemies". If u and v are ever in the same set, we have a contradiction.

The DFS/BFS approach is more intuitive for this problem. Here's the step-by-step reasoning:

1. Build an adjacency list from the dislikes array
2. Initialize a color array where `color[i]` represents which group person i belongs to (0 = unassigned, 1 = group A, -1 = group B)
3. For each person from 1 to n:
   - If they haven't been colored yet, start a BFS/DFS from them
   - Assign them an initial color (say 1)
   - For each neighbor (person they dislike), assign the opposite color
   - If a neighbor already has the same color as the current node, return false
4. If we complete the traversal without conflicts, return true

## Optimal Solution

Here's the complete solution using BFS (which avoids recursion depth issues for large n):

<div class="code-group">

```python
# Time: O(n + e) where e = len(dislikes) | Space: O(n + e)
def possibleBipartition(n, dislikes):
    """
    Check if we can split n people into two groups where disliking pairs are separated.

    Approach: Treat as bipartite graph checking problem.
    Build adjacency list, then BFS with alternating colors.
    """
    # Step 1: Build adjacency list for the graph
    # People are labeled 1..n, so we use n+1 size for 1-based indexing
    graph = [[] for _ in range(n + 1)]
    for a, b in dislikes:
        graph[a].append(b)
        graph[b].append(a)  # Undirected graph

    # Step 2: Initialize color array (0 = uncolored, 1 = group A, -1 = group B)
    colors = [0] * (n + 1)

    # Step 3: Try to color each connected component
    for person in range(1, n + 1):
        # If person not colored yet, start BFS from them
        if colors[person] == 0:
            # Initialize queue with current person
            queue = [person]
            colors[person] = 1  # Assign initial color

            while queue:
                current = queue.pop(0)

                # Check all neighbors (people current dislikes)
                for neighbor in graph[current]:
                    # If neighbor has same color as current, conflict!
                    if colors[neighbor] == colors[current]:
                        return False

                    # If neighbor not colored yet, assign opposite color and enqueue
                    if colors[neighbor] == 0:
                        colors[neighbor] = -colors[current]
                        queue.append(neighbor)

    # Step 4: If we colored everyone without conflicts, bipartition is possible
    return True
```

```javascript
// Time: O(n + e) where e = dislikes.length | Space: O(n + e)
function possibleBipartition(n, dislikes) {
  /**
   * Check if we can split n people into two groups where disliking pairs are separated.
   *
   * Approach: Treat as bipartite graph checking problem.
   * Build adjacency list, then BFS with alternating colors.
   */

  // Step 1: Build adjacency list for the graph
  // People are labeled 1..n, so we use n+1 size for 1-based indexing
  const graph = new Array(n + 1).fill(0).map(() => []);
  for (const [a, b] of dislikes) {
    graph[a].push(b);
    graph[b].push(a); // Undirected graph
  }

  // Step 2: Initialize color array (0 = uncolored, 1 = group A, -1 = group B)
  const colors = new Array(n + 1).fill(0);

  // Step 3: Try to color each connected component
  for (let person = 1; person <= n; person++) {
    // If person not colored yet, start BFS from them
    if (colors[person] === 0) {
      const queue = [person];
      colors[person] = 1; // Assign initial color

      while (queue.length > 0) {
        const current = queue.shift();

        // Check all neighbors (people current dislikes)
        for (const neighbor of graph[current]) {
          // If neighbor has same color as current, conflict!
          if (colors[neighbor] === colors[current]) {
            return false;
          }

          // If neighbor not colored yet, assign opposite color and enqueue
          if (colors[neighbor] === 0) {
            colors[neighbor] = -colors[current];
            queue.push(neighbor);
          }
        }
      }
    }
  }

  // Step 4: If we colored everyone without conflicts, bipartition is possible
  return true;
}
```

```java
// Time: O(n + e) where e = dislikes.length | Space: O(n + e)
class Solution {
    public boolean possibleBipartition(int n, int[][] dislikes) {
        /**
         * Check if we can split n people into two groups where disliking pairs are separated.
         *
         * Approach: Treat as bipartite graph checking problem.
         * Build adjacency list, then BFS with alternating colors.
         */

        // Step 1: Build adjacency list for the graph
        // People are labeled 1..n, so we use n+1 size for 1-based indexing
        List<Integer>[] graph = new ArrayList[n + 1];
        for (int i = 1; i <= n; i++) {
            graph[i] = new ArrayList<>();
        }

        for (int[] dislike : dislikes) {
            int a = dislike[0];
            int b = dislike[1];
            graph[a].add(b);
            graph[b].add(a);  // Undirected graph
        }

        // Step 2: Initialize color array (0 = uncolored, 1 = group A, -1 = group B)
        int[] colors = new int[n + 1];

        // Step 3: Try to color each connected component
        for (int person = 1; person <= n; person++) {
            // If person not colored yet, start BFS from them
            if (colors[person] == 0) {
                Queue<Integer> queue = new LinkedList<>();
                queue.offer(person);
                colors[person] = 1;  // Assign initial color

                while (!queue.isEmpty()) {
                    int current = queue.poll();

                    // Check all neighbors (people current dislikes)
                    for (int neighbor : graph[current]) {
                        // If neighbor has same color as current, conflict!
                        if (colors[neighbor] == colors[current]) {
                            return false;
                        }

                        // If neighbor not colored yet, assign opposite color and enqueue
                        if (colors[neighbor] == 0) {
                            colors[neighbor] = -colors[current];
                            queue.offer(neighbor);
                        }
                    }
                }
            }
        }

        // Step 4: If we colored everyone without conflicts, bipartition is possible
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + e) where n is the number of people and e is the number of dislike pairs (edges in the graph). We visit each person once and traverse each edge once during the BFS/DFS.

**Space Complexity:** O(n + e) for:

- The adjacency list graph: O(n + e)
- The colors array: O(n)
- The BFS queue: O(n) in worst case

The space is dominated by the adjacency list which stores all edges.

## Common Mistakes

1. **Forgetting the graph is undirected**: If person A dislikes B, then B also dislikes A for grouping purposes. You must add edges in both directions to the adjacency list.

2. **Not handling disconnected components**: The graph might have multiple connected components (groups of people who only dislike within their group). You need to check each component starting from any uncolored person.

3. **1-based indexing errors**: People are labeled 1..n, but arrays are 0-indexed. Using `n` instead of `n+1` for array sizes will cause index out of bounds errors.

4. **Infinite loop in BFS/DFS**: Forgetting to mark nodes as visited (colored) before adding them to the queue can cause infinite loops. Always assign the color before enqueuing.

5. **Using DFS recursion without considering recursion depth**: For n=2000, a deep recursion could cause stack overflow. BFS with a queue is safer for large inputs.

## When You'll See This Pattern

This bipartite graph checking pattern appears in several problems:

1. **Is Graph Bipartite? (LeetCode 785)** - The exact same problem but with a standard adjacency matrix input instead of dislike pairs.

2. **Flower Planting With No Adjacent (LeetCode 1042)** - Similar coloring problem but with 4 colors instead of 2.

3. **Course Schedule (LeetCode 207)** - While this is about cycle detection in directed graphs, the graph traversal and coloring approach is similar.

4. **Alien Dictionary (LeetCode 269)** - Uses topological sort which also involves graph traversal and ordering constraints.

The key pattern to recognize: whenever you need to partition items into two groups with constraints about what can't be together, think "bipartite graph."

## Key Takeaways

1. **Many grouping/partitioning problems are graph problems in disguise** - When you see "split into two groups with constraints," immediately consider bipartite graph checking.

2. **BFS/DFS with alternating colors is the standard approach** - Assign colors (0, 1, -1) and ensure neighbors have opposite colors. If you find a conflict, the graph isn't bipartite.

3. **Always handle disconnected components** - Don't assume the graph is connected. Iterate through all nodes and start a new traversal whenever you find an uncolored node.

Remember: A graph is bipartite if and only if it contains no odd-length cycles. The coloring approach implicitly checks for this property.

[Practice this problem on CodeJeet](/problem/possible-bipartition)
