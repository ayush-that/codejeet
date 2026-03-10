---
title: "How to Solve Frog Position After T Seconds — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Frog Position After T Seconds. Hard difficulty, 37.9% acceptance rate. Topics: Tree, Depth-First Search, Breadth-First Search, Graph Theory."
date: "2028-10-26"
category: "dsa-patterns"
tags:
  ["frog-position-after-t-seconds", "tree", "depth-first-search", "breadth-first-search", "hard"]
---

# How to Solve Frog Position After T Seconds

You're given an undirected tree with `n` vertices numbered from 1 to `n`. A frog starts at vertex 1 and jumps to unvisited connected vertices each second. If the frog can't jump (all neighbors visited), it stays in place. The question: what's the probability the frog is at vertex `target` after exactly `t` seconds? This problem is tricky because the frog's movement depends on available unvisited vertices, making the probability calculation non-trivial.

## Visual Walkthrough

Let's trace through a small example: `n = 7`, `edges = [[1,2],[1,3],[1,7],[2,4],[2,6],[3,5]]`, `t = 2`, `target = 4`.

The tree structure:

```
      1
     /|\
    2 3 7
   / \ \
  4   6 5
```

**Second 0:** Frog starts at vertex 1 (probability = 1.0)

**Second 1:** From vertex 1, the frog can jump to 2, 3, or 7 (3 unvisited neighbors). Each gets probability 1/3.

**Second 2:**

- If frog at vertex 2 (prob 1/3): From vertex 2, unvisited neighbors are 4 and 6 (2 options). Each gets (1/3) × (1/2) = 1/6.
- If frog at vertex 3 (prob 1/3): From vertex 3, only unvisited neighbor is 5. Gets (1/3) × 1 = 1/3.
- If frog at vertex 7 (prob 1/3): No unvisited neighbors, stays at 7 with probability 1/3.

After 2 seconds, probability at vertex 4 = 1/6 ≈ 0.16667.

## Brute Force Approach

A naive approach would simulate all possible paths the frog could take. For each vertex, track all reachable vertices at each time step with their probabilities. This requires exploring the entire state space.

The brute force would work like this:

1. Start with probability 1.0 at vertex 1 at time 0
2. For each second up to `t`:
   - For each vertex with probability > 0:
     - Count its unvisited neighbors
     - Distribute probability equally among them
3. Return probability at `target` after `t` seconds

**Why this fails:** The state space grows exponentially! Each vertex can have multiple neighbors, and we need to track visited states. With `n` up to 100 and `t` up to 50, this becomes computationally infeasible.

## Optimized Approach

The key insight: **This is a tree, not a general graph.** Trees have no cycles, so each vertex (except the root) has exactly one parent. When the frog jumps from a parent to a child, it can never return to the parent because the parent is now visited.

This means the frog's path is essentially a depth-first traversal! The probability calculation simplifies:

1. Perform DFS from vertex 1
2. Track:
   - Current vertex
   - Current probability
   - Current time
   - Whether we found the target
3. When reaching a vertex:
   - If time equals `t` and vertex equals `target`: return current probability
   - If time exceeds `t`: return 0 (can't reach target in time)
   - Count unvisited children (neighbors except parent)
   - If no children: frog stays here (return probability if this is target at time `t`)
   - Distribute probability equally among children and continue DFS

**Critical observation:** The frog's movement is deterministic in terms of probability distribution. We don't need to track all paths—just multiply probabilities along the single path to the target.

## Optimal Solution

We use DFS to find the path from root to target, calculating probability along the way. The algorithm:

1. Build adjacency list from edges
2. Perform DFS from vertex 1 with probability 1.0, time 0
3. At each step:
   - If time > t: return 0 (too late)
   - If vertex == target:
     - If time == t: return probability
     - If time < t: check if frog can stay (no unvisited children)
4. Count unvisited children (excluding parent)
5. If no children: return probability if vertex == target else 0
6. For each child: recursively explore with probability/(child count)

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def frogPosition(n, edges, t, target):
    """
    Calculate probability frog is at target after exactly t seconds.

    Args:
        n: number of vertices
        edges: list of [u, v] connections
        t: time in seconds
        target: target vertex

    Returns:
        Probability as float
    """
    # Step 1: Build adjacency list for the tree
    graph = [[] for _ in range(n + 1)]  # 1-indexed vertices
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    # Step 2: DFS with visited tracking
    visited = [False] * (n + 1)

    def dfs(vertex, time, prob):
        """
        DFS helper to calculate probability.

        Args:
            vertex: current vertex
            time: current time elapsed
            prob: current probability

        Returns:
            Probability of reaching target at exact time t
        """
        # Mark current vertex as visited
        visited[vertex] = True

        # Count unvisited children (neighbors except parent)
        unvisited_children = 0
        for neighbor in graph[vertex]:
            if not visited[neighbor]:
                unvisited_children += 1

        # Base cases
        if time > t:
            # We've exceeded allowed time
            return 0.0

        if vertex == target:
            if time == t:
                # Reached target exactly at time t
                return prob
            elif time < t and unvisited_children == 0:
                # At target before time t but no place to go
                # Frog stays at target until time t
                return prob
            else:
                # At target but still time left and can move away
                return 0.0

        # If no children to jump to, we're stuck (not at target)
        if unvisited_children == 0:
            return 0.0

        # Recursively explore children with distributed probability
        for neighbor in graph[vertex]:
            if not visited[neighbor]:
                # Probability splits equally among children
                result = dfs(neighbor, time + 1, prob / unvisited_children)
                if result > 0:
                    return result

        return 0.0

    # Start DFS from vertex 1 with probability 1.0 at time 0
    return dfs(1, 0, 1.0)
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Calculate probability frog is at target after exactly t seconds.
 *
 * @param {number} n - number of vertices
 * @param {number[][]} edges - list of [u, v] connections
 * @param {number} t - time in seconds
 * @param {number} target - target vertex
 * @return {number} Probability as float
 */
function frogPosition(n, edges, t, target) {
  // Step 1: Build adjacency list for the tree
  const graph = Array.from({ length: n + 1 }, () => []); // 1-indexed vertices
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: DFS with visited tracking
  const visited = new Array(n + 1).fill(false);

  /**
   * DFS helper to calculate probability.
   *
   * @param {number} vertex - current vertex
   * @param {number} time - current time elapsed
   * @param {number} prob - current probability
   * @return {number} Probability of reaching target at exact time t
   */
  function dfs(vertex, time, prob) {
    // Mark current vertex as visited
    visited[vertex] = true;

    // Count unvisited children (neighbors except parent)
    let unvisitedChildren = 0;
    for (const neighbor of graph[vertex]) {
      if (!visited[neighbor]) {
        unvisitedChildren++;
      }
    }

    // Base cases
    if (time > t) {
      // We've exceeded allowed time
      return 0.0;
    }

    if (vertex === target) {
      if (time === t) {
        // Reached target exactly at time t
        return prob;
      } else if (time < t && unvisitedChildren === 0) {
        // At target before time t but no place to go
        // Frog stays at target until time t
        return prob;
      } else {
        // At target but still time left and can move away
        return 0.0;
      }
    }

    // If no children to jump to, we're stuck (not at target)
    if (unvisitedChildren === 0) {
      return 0.0;
    }

    // Recursively explore children with distributed probability
    for (const neighbor of graph[vertex]) {
      if (!visited[neighbor]) {
        // Probability splits equally among children
        const result = dfs(neighbor, time + 1, prob / unvisitedChildren);
        if (result > 0) {
          return result;
        }
      }
    }

    return 0.0;
  }

  // Start DFS from vertex 1 with probability 1.0 at time 0
  return dfs(1, 0, 1.0);
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Calculate probability frog is at target after exactly t seconds.
     *
     * @param n number of vertices
     * @param edges list of [u, v] connections
     * @param t time in seconds
     * @param target target vertex
     * @return Probability as double
     */
    public double frogPosition(int n, int[][] edges, int t, int target) {
        // Step 1: Build adjacency list for the tree
        List<Integer>[] graph = new ArrayList[n + 1]; // 1-indexed vertices
        for (int i = 1; i <= n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 2: DFS with visited tracking
        boolean[] visited = new boolean[n + 1];

        // Start DFS from vertex 1 with probability 1.0 at time 0
        return dfs(1, 0, 1.0, t, target, graph, visited);
    }

    /**
     * DFS helper to calculate probability.
     *
     * @param vertex current vertex
     * @param time current time elapsed
     * @param prob current probability
     * @param t maximum time allowed
     * @param target target vertex
     * @param graph adjacency list
     * @param visited visited array
     * @return Probability of reaching target at exact time t
     */
    private double dfs(int vertex, int time, double prob, int t, int target,
                      List<Integer>[] graph, boolean[] visited) {
        // Mark current vertex as visited
        visited[vertex] = true;

        // Count unvisited children (neighbors except parent)
        int unvisitedChildren = 0;
        for (int neighbor : graph[vertex]) {
            if (!visited[neighbor]) {
                unvisitedChildren++;
            }
        }

        // Base cases
        if (time > t) {
            // We've exceeded allowed time
            return 0.0;
        }

        if (vertex == target) {
            if (time == t) {
                // Reached target exactly at time t
                return prob;
            } else if (time < t && unvisitedChildren == 0) {
                // At target before time t but no place to go
                // Frog stays at target until time t
                return prob;
            } else {
                // At target but still time left and can move away
                return 0.0;
            }
        }

        // If no children to jump to, we're stuck (not at target)
        if (unvisitedChildren == 0) {
            return 0.0;
        }

        // Recursively explore children with distributed probability
        for (int neighbor : graph[vertex]) {
            if (!visited[neighbor]) {
                // Probability splits equally among children
                double result = dfs(neighbor, time + 1, prob / unvisitedChildren,
                                   t, target, graph, visited);
                if (result > 0) {
                    return result;
                }
            }
        }

        return 0.0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We build the adjacency list in O(E) time, where E = n-1 for a tree
- DFS visits each vertex at most once: O(n)
- Total: O(n) since n-1 edges in a tree

**Space Complexity:** O(n)

- Adjacency list: O(n) for n vertices
- Visited array: O(n)
- Recursion stack: O(h) where h is tree height, worst case O(n) for a skewed tree
- Total: O(n)

## Common Mistakes

1. **Forgetting the frog stays in place when no unvisited vertices**: This is crucial! If the frog reaches a leaf vertex (including the target) before time `t` runs out, it stays there. Many candidates return 0 in this case.

2. **Not handling the exact time requirement**: The problem asks for probability at exactly `t` seconds. If the frog reaches target earlier but has unvisited children, it might jump away. Only return probability if either: (a) time == t, or (b) time < t but no children to jump to.

3. **Treating as general graph instead of tree**: In a general graph with cycles, the probability calculation would be more complex. But since it's a tree, once you leave a vertex you can't return, simplifying the DFS.

4. **Incorrect probability distribution**: When a vertex has `k` unvisited children, probability splits as 1/k, not 1/(total neighbors). Remember to exclude the parent (already visited) from the count.

## When You'll See This Pattern

This DFS-with-probability pattern appears in problems involving:

- **Tree traversal with state** (probability, time, visited nodes)
- **Random walk on trees** where movement depends on available options
- **Probability propagation** in hierarchical structures

Related problems:

1. **All Nodes Distance K in Binary Tree** (LeetCode 863): Similar tree traversal with distance tracking
2. **Sum of Distances in Tree** (LeetCode 834): Tree DFS with cumulative calculations
3. **Probability of a Two Boxes Having The Same Number of Distinct Balls** (LeetCode 1467): Probability calculation in state space

## Key Takeaways

1. **Trees simplify probability calculations**: No cycles mean once you leave a vertex, you can't return. This makes DFS sufficient without needing to track complex state.

2. **Exact timing matters in probability problems**: Pay close attention to whether you need probability "at time t" vs "by time t". The difference changes the base cases significantly.

3. **DFS with parameters is powerful for tree problems**: Passing time, probability, and other state through recursion handles complex constraints elegantly.

Related problems: [Longest Special Path](/problem/longest-special-path)
