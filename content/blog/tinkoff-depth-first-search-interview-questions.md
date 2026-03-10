---
title: "Depth-First Search Questions at Tinkoff: What to Expect"
description: "Prepare for Depth-First Search interview questions at Tinkoff — patterns, difficulty breakdown, and study tips."
date: "2030-12-20"
category: "dsa-patterns"
tags: ["tinkoff", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Tinkoff: What to Expect

If you're preparing for Tinkoff interviews, you've probably noticed their coding assessment includes three Depth-First Search (DFS) questions out of twenty-seven total. That's about 11% of their problem bank dedicated to this single algorithm. But what does this actually mean for your interview preparation? Is DFS a core focus or just another topic in the mix?

The reality is more nuanced than the numbers suggest. While three dedicated DFS problems might seem modest, DFS appears as a component in many other graph, tree, and backtracking problems. At Tinkoff, DFS isn't just about tree traversal—it's a fundamental building block for solving complex problems involving dependency resolution, path finding, and state exploration. In real interviews, you're likely to encounter at least one problem where DFS (or its close cousin, backtracking) is the optimal approach. The company's focus on financial technology means they frequently test problems involving hierarchical data structures, dependency graphs, and combinatorial search—all domains where DFS shines.

## Specific Patterns Tinkoff Favors

Tinkoff's DFS questions tend to cluster around three specific patterns that reflect their business domain:

1. **Pathfinding with constraints** — Unlike simple "find any path" problems, Tinkoff often adds financial or logical constraints. Think "maximum profit path" or "path with specific resource limitations." These problems test whether you can modify standard DFS to track additional state.

2. **Cycle detection in dependency graphs** — Given Tinkoff's work with transaction systems and financial dependencies, they frequently test your ability to detect cycles in directed graphs. This isn't academic graph theory; it's practical dependency resolution.

3. **Backtracking with pruning** — Their problems often involve searching through possibilities but require intelligent pruning to avoid exponential blowups. You'll need to recognize when to abandon search branches early.

A classic example that combines several of these elements is **Course Schedule II (#210)**, which requires both cycle detection and topological ordering using DFS. Another relevant pattern appears in **Number of Islands (#200)**, but Tinkoff often adds twists like "count islands with treasure" or "find the largest valuable island."

<div class="code-group">

```python
# Time: O(V + E) | Space: O(V)
# Cycle detection in directed graph (Course Schedule pattern)
def has_cycle(n, prerequisites):
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for dest, src in prerequisites:
        graph[src].append(dest)

    # 0 = unvisited, 1 = visiting, 2 = visited
    state = [0] * n

    def dfs(node):
        if state[node] == 1:  # Found a cycle
            return True
        if state[node] == 2:  # Already processed
            return False

        state[node] = 1  # Mark as visiting
        for neighbor in graph[node]:
            if dfs(neighbor):
                return True
        state[node] = 2  # Mark as visited
        return False

    # Check all nodes
    for i in range(n):
        if state[i] == 0:
            if dfs(i):
                return True
    return False
```

```javascript
// Time: O(V + E) | Space: O(V)
// Cycle detection in directed graph (Course Schedule pattern)
function hasCycle(n, prerequisites) {
  // Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [dest, src] of prerequisites) {
    graph[src].push(dest);
  }

  // 0 = unvisited, 1 = visiting, 2 = visited
  const state = new Array(n).fill(0);

  function dfs(node) {
    if (state[node] === 1) return true; // Found cycle
    if (state[node] === 2) return false; // Already processed

    state[node] = 1; // Mark as visiting
    for (const neighbor of graph[node]) {
      if (dfs(neighbor)) return true;
    }
    state[node] = 2; // Mark as visited
    return false;
  }

  // Check all nodes
  for (let i = 0; i < n; i++) {
    if (state[i] === 0) {
      if (dfs(i)) return true;
    }
  }
  return false;
}
```

```java
// Time: O(V + E) | Space: O(V)
// Cycle detection in directed graph (Course Schedule pattern)
public boolean hasCycle(int n, int[][] prerequisites) {
    // Build adjacency list
    List<Integer>[] graph = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new ArrayList<>();
    }
    for (int[] edge : prerequisites) {
        graph[edge[1]].add(edge[0]);
    }

    // 0 = unvisited, 1 = visiting, 2 = visited
    int[] state = new int[n];

    for (int i = 0; i < n; i++) {
        if (state[i] == 0) {
            if (dfs(i, graph, state)) {
                return true;
            }
        }
    }
    return false;
}

private boolean dfs(int node, List<Integer>[] graph, int[] state) {
    if (state[node] == 1) return true;  // Found cycle
    if (state[node] == 2) return false; // Already processed

    state[node] = 1;  // Mark as visiting
    for (int neighbor : graph[node]) {
        if (dfs(neighbor, graph, state)) {
            return true;
        }
    }
    state[node] = 2;  // Mark as visited
    return false;
}
```

</div>

## How to Prepare

The key to mastering DFS for Tinkoff is practicing the state management patterns they favor. Here's what to focus on:

1. **Memorize the three-state cycle detection algorithm** shown above. This pattern appears constantly.
2. **Practice iterative DFS** alongside recursive. Some interviewers prefer iterative solutions to avoid stack overflow concerns.
3. **Learn to pass multiple parameters** in your DFS function—not just the node, but also accumulated state like current path, visited set, or resource counts.

When implementing DFS, always consider:

- What state needs to be tracked?
- When should we prune the search?
- How do we avoid revisiting nodes (cycle prevention)?
- What's our base case for termination?

<div class="code-group">

```python
# Time: O(N * 2^N) | Space: O(N)
# Backtracking with pruning (Subsets pattern)
def subsets_with_duplicates(nums):
    nums.sort()  # Sort to handle duplicates
    result = []

    def backtrack(start, current):
        result.append(current.copy())

        for i in range(start, len(nums)):
            # Skip duplicates (pruning)
            if i > start and nums[i] == nums[i-1]:
                continue
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()  # Backtrack

    backtrack(0, [])
    return result
```

```javascript
// Time: O(N * 2^N) | Space: O(N)
// Backtracking with pruning (Subsets pattern)
function subsetsWithDuplicates(nums) {
  nums.sort(); // Sort to handle duplicates
  const result = [];

  function backtrack(start, current) {
    result.push([...current]);

    for (let i = start; i < nums.length; i++) {
      // Skip duplicates (pruning)
      if (i > start && nums[i] === nums[i - 1]) continue;
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop(); // Backtrack
    }
  }

  backtrack(0, []);
  return result;
}
```

```java
// Time: O(N * 2^N) | Space: O(N)
// Backtracking with pruning (Subsets pattern)
public List<List<Integer>> subsetsWithDuplicates(int[] nums) {
    Arrays.sort(nums);  // Sort to handle duplicates
    List<List<Integer>> result = new ArrayList<>();

    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] nums, int start, List<Integer> current,
                       List<List<Integer>> result) {
    result.add(new ArrayList<>(current));

    for (int i = start; i < nums.length; i++) {
        // Skip duplicates (pruning)
        if (i > start && nums[i] == nums[i-1]) continue;
        current.add(nums[i]);
        backtrack(nums, i + 1, current, result);
        current.remove(current.size() - 1);  // Backtrack
    }
}
```

</div>

## How Tinkoff Tests Depth-First Search vs Other Companies

Tinkoff's DFS questions differ from other companies in several important ways:

**Compared to FAANG:** While Google might ask purely algorithmic graph problems, Tinkoff often wraps DFS in domain-specific scenarios. You might be finding transaction chains instead of simple paths, or detecting circular dependencies in financial instruments rather than generic graphs. The difficulty is similar to mid-level FAANG questions, but with more practical context.

**Compared to other fintech companies:** Tinkoff tends to favor cleaner, more academic DFS implementations over heavily engineered solutions. They want to see you understand the algorithm fundamentals, not just hack together a working solution. Their interviews often have tighter time constraints, so efficiency in both runtime and coding speed matters.

**Unique aspects:** Tinkoff frequently combines DFS with other concepts—particularly dynamic programming (DFS with memoization) and bitmasking. Be prepared for hybrid problems. They also tend to test both recursive and iterative implementations, so practice both.

## Study Order

Follow this progression to build your DFS skills systematically:

1. **Basic tree traversal** — Start with binary tree DFS (preorder, inorder, postorder). This builds intuition for recursion and stack usage.
2. **Graph traversal** — Move to adjacency list representations. Practice both recursive and iterative implementations.
3. **Cycle detection** — Learn the three-state algorithm for directed graphs. This is crucial for Tinkoff.
4. **Backtracking** — Practice generating combinations, permutations, and subsets. Focus on pruning techniques.
5. **DFS with memoization** — Combine DFS with DP for problems like unique paths or word break.
6. **Complex state management** — Practice problems where you need to track multiple variables through the recursion.

This order works because each step builds on the previous one. You can't effectively implement cycle detection without understanding basic graph traversal, and you can't handle complex backtracking without mastering simple recursion first.

## Recommended Practice Order

Solve these problems in sequence to build the specific skills Tinkoff tests:

1. **Binary Tree Inorder Traversal (#94)** — Basic tree DFS
2. **Number of Islands (#200)** — Grid DFS, component counting
3. **Course Schedule (#207)** — Cycle detection in directed graphs
4. **Subsets II (#90)** — Backtracking with duplicate handling
5. **Target Sum (#494)** — DFS with memoization (DP)
6. **Word Search II (#212)** — Complex backtracking with pruning
7. **Longest Increasing Path in a Matrix (#329)** — DFS with memoization in grid
8. **Reconstruct Itinerary (#332)** — Eulerian path with DFS

After completing these, look for Tinkoff-specific practice problems that combine these patterns. Pay special attention to problems involving financial scenarios or dependency resolution.

[Practice Depth-First Search at Tinkoff](/company/tinkoff/depth-first-search)
