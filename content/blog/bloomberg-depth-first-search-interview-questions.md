---
title: "Depth-First Search Questions at Bloomberg: What to Expect"
description: "Prepare for Depth-First Search interview questions at Bloomberg — patterns, difficulty breakdown, and study tips."
date: "2027-04-26"
category: "dsa-patterns"
tags: ["bloomberg", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Bloomberg: What to Expect

Bloomberg has 104 Depth-First Search (DFS) questions in their tagged LeetCode problems, representing nearly 9% of their total question bank. This isn't a coincidence—it reflects their interview reality. While Bloomberg interviews cover a broad range of topics, DFS appears with surprising frequency, especially for roles involving financial data processing, market data systems, or any position dealing with hierarchical or graph-based data structures.

The reason is practical: Bloomberg's systems often model complex relationships—financial instruments linked to markets, news articles connected to tickers, organizational hierarchies, or dependency graphs in their terminal software. DFS provides the fundamental traversal mechanism for exploring these connections. In my experience conducting mock interviews with former Bloomberg engineers, I've found they don't just test DFS as an academic exercise; they test whether you can recognize when DFS is the right tool and implement it cleanly under pressure.

## Specific Patterns Bloomberg Favors

Bloomberg's DFS questions tend to cluster around three specific patterns that mirror real-world financial data problems:

1. **Tree Serialization/Deserialization** - Critical for their distributed systems where tree structures (like organizational charts or category hierarchies) need transmission between services. Problems like **Serialize and Deserialize Binary Tree (#297)** appear frequently.

2. **Path Finding in Grids** - Not just simple island counting, but variations with constraints that model trading restrictions or access permissions. **Number of Islands (#200)** is the foundation, but expect twists like "Number of Distinct Islands (#694)" or "Walls and Gates (#286)."

3. **Graph Cycle Detection and Topological Sorting** - Essential for dependency resolution in their financial calculation engines. **Course Schedule (#207)** and **Alien Dictionary (#269)** are classic examples that test whether you understand DFS's role in detecting cycles and establishing order.

What's distinctive is Bloomberg's preference for **iterative DFS implementations** over recursive ones in production code. While they'll accept recursive solutions, interviewers often probe whether you understand the stack implications and can convert to iterative approaches—especially important for their high-performance systems.

<div class="code-group">

```python
# Iterative DFS for binary tree traversal (Bloomberg-style implementation)
# Time: O(n) | Space: O(h) where h is tree height
def iterative_inorder_traversal(root):
    """Returns inorder traversal without recursion."""
    result = []
    stack = []
    current = root

    while current or stack:
        # Reach the leftmost node of the current node
        while current:
            stack.append(current)
            current = current.left

        # Current must be None at this point
        current = stack.pop()
        result.append(current.val)

        # Visit the right subtree
        current = current.right

    return result
```

```javascript
// Iterative DFS for binary tree traversal (Bloomberg-style implementation)
// Time: O(n) | Space: O(h) where h is tree height
function iterativeInorderTraversal(root) {
  const result = [];
  const stack = [];
  let current = root;

  while (current || stack.length > 0) {
    // Reach the leftmost node of the current node
    while (current) {
      stack.push(current);
      current = current.left;
    }

    // Current must be null at this point
    current = stack.pop();
    result.push(current.val);

    // Visit the right subtree
    current = current.right;
  }

  return result;
}
```

```java
// Iterative DFS for binary tree traversal (Bloomberg-style implementation)
// Time: O(n) | Space: O(h) where h is tree height
public List<Integer> iterativeInorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode current = root;

    while (current != null || !stack.isEmpty()) {
        // Reach the leftmost node of the current node
        while (current != null) {
            stack.push(current);
            current = current.left;
        }

        // Current must be null at this point
        current = stack.pop();
        result.add(current.val);

        // Visit the right subtree
        current = current.right;
    }

    return result;
}
```

</div>

## How to Prepare

Master DFS for Bloomberg by focusing on implementation clarity and space complexity awareness. Here's my recommended approach:

**First, internalize the three DFS "modes":**

1. Pre-order (node, left, right) - for copying trees or serialization
2. In-order (left, node, right) - for BST validation or sorted output
3. Post-order (left, right, node) - for deletion or bottom-up computation

**Second, practice converting between recursive and iterative implementations.** Bloomberg interviewers often ask: "Can you write that iteratively?" or "What are the stack limitations of your recursive approach?"

**Third, memorize the adjacency list DFS pattern**—it's more common than matrix DFS in their interviews because it maps better to financial relationship graphs.

<div class="code-group">

```python
# Adjacency list DFS with cycle detection (for dependency graphs)
# Time: O(V + E) | Space: O(V)
def has_cycle_adjacency_list(n, edges):
    """Returns True if directed graph has cycle."""
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)

    visited = [0] * n  # 0=unvisited, 1=visiting, 2=visited

    def dfs(node):
        if visited[node] == 1:  # Found a cycle
            return True
        if visited[node] == 2:  # Already processed
            return False

        visited[node] = 1  # Mark as visiting

        for neighbor in graph[node]:
            if dfs(neighbor):
                return True

        visited[node] = 2  # Mark as fully visited
        return False

    # Check all nodes (graph might be disconnected)
    for i in range(n):
        if visited[i] == 0:
            if dfs(i):
                return True

    return False
```

```javascript
// Adjacency list DFS with cycle detection (for dependency graphs)
// Time: O(V + E) | Space: O(V)
function hasCycleAdjacencyList(n, edges) {
  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
  }

  const visited = new Array(n).fill(0); // 0=unvisited, 1=visiting, 2=visited

  function dfs(node) {
    if (visited[node] === 1) return true; // Found cycle
    if (visited[node] === 2) return false; // Already processed

    visited[node] = 1; // Mark as visiting

    for (const neighbor of graph[node]) {
      if (dfs(neighbor)) return true;
    }

    visited[node] = 2; // Mark as fully visited
    return false;
  }

  // Check all nodes (graph might be disconnected)
  for (let i = 0; i < n; i++) {
    if (visited[i] === 0) {
      if (dfs(i)) return true;
    }
  }

  return false;
}
```

```java
// Adjacency list DFS with cycle detection (for dependency graphs)
// Time: O(V + E) | Space: O(V)
public boolean hasCycleAdjacencyList(int n, int[][] edges) {
    // Build adjacency list
    List<Integer>[] graph = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new ArrayList<>();
    }
    for (int[] edge : edges) {
        graph[edge[0]].add(edge[1]);
    }

    int[] visited = new int[n]; // 0=unvisited, 1=visiting, 2=visited

    for (int i = 0; i < n; i++) {
        if (visited[i] == 0) {
            if (dfsCycle(i, graph, visited)) return true;
        }
    }
    return false;
}

private boolean dfsCycle(int node, List<Integer>[] graph, int[] visited) {
    if (visited[node] == 1) return true;  // Found cycle
    if (visited[node] == 2) return false; // Already processed

    visited[node] = 1;  // Mark as visiting

    for (int neighbor : graph[node]) {
        if (dfsCycle(neighbor, graph, visited)) return true;
    }

    visited[node] = 2;  // Mark as fully visited
    return false;
}
```

</div>

## How Bloomberg Tests Depth-First Search vs Other Companies

Bloomberg's DFS questions differ from FAANG companies in subtle but important ways:

**Compared to Google:** Google often tests DFS in combination with other algorithms (like Dijkstra or A\*). Bloomberg tests DFS in isolation but with more real-world constraints—think "maximum path sum with trading fees" rather than "maximum path sum."

**Compared to Facebook/Meta:** Meta leans heavily into tree variations (clone graph, binary tree right-side view). Bloomberg balances trees with directed graph problems that model financial dependencies.

**Compared to Amazon:** Amazon's DFS questions often involve matrix traversal for robotics or warehouse problems. Bloomberg's matrix problems are smaller but with more complex rules (like "can only move in certain directions based on financial regulations").

The unique Bloomberg signature: they often add **memoization requirements** to DFS problems. You might solve a path counting problem, then they'll ask: "Now what if we need to compute this for 10,000 different starting points?" This tests whether you recognize when DFS becomes DP.

## Study Order

Follow this progression to build DFS mastery systematically:

1. **Binary Tree Traversals** - Start with the fundamentals: pre-order, in-order, post-order. Understand why each traversal order matters for different operations.
2. **Simple Recursive Applications** - Practice problems like **Maximum Depth of Binary Tree (#104)** and **Path Sum (#112)** to build recursive intuition.
3. **Iterative Implementations** - Convert all the above to iterative versions using explicit stacks. This is where Bloomberg interviews often dig deeper.
4. **Graph DFS on Adjacency Lists** - Move from trees to general graphs with **Clone Graph (#133)** and **Number of Connected Components (#323)**.
5. **Cycle Detection and Topological Sort** - Master the three-color algorithm shown above, then apply it to **Course Schedule (#207)**.
6. **Backtracking Problems** - These are DFS with pruning. Practice **Subsets (#78)** and **Permutations (#46)** to recognize the pattern.
7. **Memoized DFS (DFS + DP)** - Problems like **Word Break (#139)** or **Longest Increasing Path in a Matrix (#329)** where pure DFS times out without memoization.

This order works because each step builds on the previous one while introducing new complexity gradually. You'll notice that steps 4-7 are where Bloomberg spends most of their interview time.

## Recommended Practice Order

Solve these problems in sequence to build Bloomberg-specific DFS skills:

1. **Maximum Depth of Binary Tree (#104)** - The absolute foundation
2. **Same Tree (#100)** - Practice comparing tree structures
3. **Binary Tree Inorder Traversal (#94)** - Implement both recursively and iteratively
4. **Number of Islands (#200)** - Grid DFS foundation
5. **Clone Graph (#133)** - Graph DFS with hash maps
6. **Course Schedule (#207)** - Cycle detection and topological sort
7. **Serialize and Deserialize Binary Tree (#297)** - Bloomberg favorite
8. **Alien Dictionary (#269)** - Advanced topological sort
9. **Longest Increasing Path in a Matrix (#329)** - DFS with memoization
10. **Number of Distinct Islands (#694)** - Pattern recognition in DFS

After completing these, focus on Bloomberg's tagged DFS problems. Pay special attention to any problem involving "serialize," "deserialize," "dependency," or "order"—these are their bread and butter.

Remember: at Bloomberg, clean implementation matters more than clever tricks. They want to see you write maintainable DFS code that their engineers could understand and modify six months later. Practice writing DFS with clear variable names, proper base cases, and thoughtful comments about time/space complexity.

[Practice Depth-First Search at Bloomberg](/company/bloomberg/depth-first-search)
