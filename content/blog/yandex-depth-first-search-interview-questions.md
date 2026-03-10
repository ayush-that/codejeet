---
title: "Depth-First Search Questions at Yandex: What to Expect"
description: "Prepare for Depth-First Search interview questions at Yandex — patterns, difficulty breakdown, and study tips."
date: "2028-02-26"
category: "dsa-patterns"
tags: ["yandex", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Yandex: What to Expect

If you're preparing for Yandex interviews, you've likely noticed their significant emphasis on Depth-First Search (DFS). With 12 DFS questions out of their 134 total problems (nearly 9% of their problem bank), DFS isn't just another algorithm—it's a core assessment area that appears in real interviews with surprising frequency. Yandex engineers frequently use DFS in their production systems for tasks ranging from web crawling to dependency resolution, so they're not just testing academic knowledge—they're evaluating your ability to apply this fundamental graph algorithm to real-world scenarios.

What makes Yandex's DFS questions particularly interesting is how they blend classic algorithmic patterns with practical implementation challenges. While other companies might test DFS in isolation, Yandex often integrates it with other concepts, creating multi-layered problems that reveal both your algorithmic thinking and your coding craftsmanship.

## Specific Patterns Yandex Favors

Yandex's DFS problems tend to cluster around three distinct patterns, each with its own twist:

**1. Tree Traversal with State Tracking**
Yandex loves problems where you need to traverse a tree while maintaining additional state. These aren't simple "print all nodes" exercises—they require tracking paths, sums, or other properties as you navigate the tree. For example, problems like "Path Sum" variations (LeetCode #112) appear frequently, but with added complexity like finding all paths that sum to a target or handling special node constraints.

**2. Graph Connectivity with Modifications**
Instead of straightforward "find connected components" questions, Yandex often presents graphs where you need to modify the traversal based on edge properties or node states. Think "Number of Islands" (LeetCode #200) but with additional rules about island shapes, adjacency conditions, or dynamic changes to the grid.

**3. Backtracking with Pruning**
This is where Yandex really distinguishes itself. They frequently combine DFS with backtracking to solve constraint satisfaction problems, but with clever pruning opportunities that separate optimal from naive solutions. Problems like "Word Search" (LeetCode #79) are common starting points, but Yandex versions often include multiple search words, wildcards, or directional constraints.

Here's a classic Yandex-style pattern: DFS with path reconstruction and memoization:

<div class="code-group">

```python
# Time: O(n * 2^n) | Space: O(n * 2^n) for storing all paths
# Pattern: DFS with path tracking and result collection
def find_all_paths(root, target_sum):
    def dfs(node, current_path, current_sum, result):
        if not node:
            return

        current_path.append(node.val)
        current_sum += node.val

        # Check if we found a valid path ending at this node
        if current_sum == target_sum:
            result.append(list(current_path))

        # Continue DFS to children
        dfs(node.left, current_path, current_sum, result)
        dfs(node.right, current_path, current_sum, result)

        # Backtrack: remove current node before returning to parent
        current_path.pop()

    result = []
    dfs(root, [], 0, result)
    return result
```

```javascript
// Time: O(n * 2^n) | Space: O(n * 2^n) for storing all paths
// Pattern: DFS with path tracking and result collection
function findAllPaths(root, targetSum) {
  const result = [];

  function dfs(node, currentPath, currentSum) {
    if (!node) return;

    currentPath.push(node.val);
    currentSum += node.val;

    // Check if we found a valid path ending at this node
    if (currentSum === targetSum) {
      result.push([...currentPath]);
    }

    // Continue DFS to children
    dfs(node.left, currentPath, currentSum);
    dfs(node.right, currentPath, currentSum);

    // Backtrack: remove current node before returning to parent
    currentPath.pop();
  }

  dfs(root, [], 0);
  return result;
}
```

```java
// Time: O(n * 2^n) | Space: O(n * 2^n) for storing all paths
// Pattern: DFS with path tracking and result collection
public List<List<Integer>> findAllPaths(TreeNode root, int targetSum) {
    List<List<Integer>> result = new ArrayList<>();
    dfs(root, new ArrayList<>(), 0, targetSum, result);
    return result;
}

private void dfs(TreeNode node, List<Integer> currentPath,
                 int currentSum, int targetSum,
                 List<List<Integer>> result) {
    if (node == null) return;

    currentPath.add(node.val);
    currentSum += node.val;

    // Check if we found a valid path ending at this node
    if (currentSum == targetSum) {
        result.add(new ArrayList<>(currentPath));
    }

    // Continue DFS to children
    dfs(node.left, currentPath, currentSum, targetSum, result);
    dfs(node.right, currentPath, currentSum, targetSum, result);

    // Backtrack: remove current node before returning to parent
    currentPath.remove(currentPath.size() - 1);
}
```

</div>

## How to Prepare

When preparing for Yandex's DFS questions, focus on these three key areas:

**Master Both Recursive and Iterative Implementations**
Yandex interviewers often ask follow-up questions about space complexity, and they appreciate candidates who can discuss when to use recursive vs iterative DFS. Recursive is cleaner for tree problems, but iterative with an explicit stack is essential for deep graphs to avoid stack overflow.

**Practice State Management**
The hardest part of Yandex's DFS problems isn't the traversal itself—it's managing the additional state. Practice problems where you need to track:

- The current path (for reconstruction)
- Visited nodes (with different visitation rules)
- Accumulated values (sums, products, etc.)
- Parent references (for certain tree operations)

**Learn to Recognize When DFS is the Wrong Tool**
Interestingly, Yandex sometimes presents problems where BFS would be more appropriate, just to see if you can justify your algorithm choice. Be prepared to discuss trade-offs between DFS and BFS for specific problem constraints.

Here's a more advanced pattern that combines DFS with cycle detection—a common Yandex variation:

<div class="code-group">

```python
# Time: O(V + E) | Space: O(V)
# Pattern: DFS with cycle detection and state tracking
def has_cycle_dfs(graph):
    # Three states: 0 = unvisited, 1 = visiting, 2 = visited
    state = {node: 0 for node in graph}

    def dfs(node):
        if state[node] == 1:  # Found a cycle
            return True
        if state[node] == 2:  # Already fully processed
            return False

        state[node] = 1  # Mark as visiting

        for neighbor in graph.get(node, []):
            if dfs(neighbor):
                return True

        state[node] = 2  # Mark as visited
        return False

    for node in graph:
        if state[node] == 0:
            if dfs(node):
                return True
    return False
```

```javascript
// Time: O(V + E) | Space: O(V)
// Pattern: DFS with cycle detection and state tracking
function hasCycleDFS(graph) {
  // Three states: 0 = unvisited, 1 = visiting, 2 = visited
  const state = new Map();
  for (const node in graph) {
    state.set(node, 0);
  }

  function dfs(node) {
    if (state.get(node) === 1) return true; // Found cycle
    if (state.get(node) === 2) return false; // Already processed

    state.set(node, 1); // Mark as visiting

    for (const neighbor of graph[node] || []) {
      if (dfs(neighbor)) return true;
    }

    state.set(node, 2); // Mark as visited
    return false;
  }

  for (const node in graph) {
    if (state.get(node) === 0) {
      if (dfs(node)) return true;
    }
  }
  return false;
}
```

```java
// Time: O(V + E) | Space: O(V)
// Pattern: DFS with cycle detection and state tracking
public boolean hasCycleDFS(Map<Integer, List<Integer>> graph) {
    // Three states: 0 = unvisited, 1 = visiting, 2 = visited
    Map<Integer, Integer> state = new HashMap<>();
    for (Integer node : graph.keySet()) {
        state.put(node, 0);
    }

    for (Integer node : graph.keySet()) {
        if (state.get(node) == 0) {
            if (dfs(node, graph, state)) return true;
        }
    }
    return false;
}

private boolean dfs(Integer node, Map<Integer, List<Integer>> graph,
                    Map<Integer, Integer> state) {
    if (state.get(node) == 1) return true;  // Found cycle
    if (state.get(node) == 2) return false; // Already processed

    state.put(node, 1);  // Mark as visiting

    for (Integer neighbor : graph.getOrDefault(node, new ArrayList<>())) {
        if (dfs(neighbor, graph, state)) return true;
    }

    state.put(node, 2);  // Mark as visited
    return false;
}
```

</div>

## How Yandex Tests Depth-First Search vs Other Companies

Yandex's approach to DFS questions differs from other major tech companies in several key ways:

**Compared to Google:** Google tends to focus more on algorithmic elegance and mathematical foundations. Their DFS problems often have cleaner, more theoretical formulations. Yandex, in contrast, presents messier, more practical problems that mirror real engineering challenges—like traversing directory structures or processing nested data formats.

**Compared to Facebook/Meta:** Facebook emphasizes speed and communication. Their DFS problems are often straightforward implementations where the main challenge is coding quickly and explaining clearly. Yandex problems frequently include additional constraints or optimizations that require deeper algorithmic thinking.

**Compared to Amazon:** Amazon's DFS problems often relate directly to their business domains (recommendation systems, warehouse paths). Yandex's problems are more general but with Russian computing context—you might see problems involving Cyrillic text processing or geographic data traversal.

**The Yandex Difference:** What truly sets Yandex apart is their focus on _implementation details_. They care about:

- Memory usage patterns (stack vs heap allocations)
- Edge case handling (null inputs, empty graphs, cycles)
- Code readability and maintainability
- Ability to extend the solution (e.g., "How would you modify this if nodes had weights?")

## Study Order

Follow this progression to build your DFS skills systematically:

1. **Basic Tree Traversal** - Start with preorder, inorder, and postorder traversals on binary trees. Master both recursive and iterative implementations. This builds muscle memory for the fundamental DFS pattern.

2. **Simple Graph Traversal** - Move to adjacency list representations and learn to handle cycles with visited sets. Practice on grid problems (like Number of Islands) to understand 2D traversal.

3. **Path Tracking** - Learn to reconstruct paths by storing parent references or maintaining a path stack. This is crucial for Yandex's preference for path-based problems.

4. **Backtracking** - Practice problems where you need to explore all possibilities and undo choices (like permutations, subsets). This teaches you to manage state across recursive calls.

5. **Memoization Integration** - Combine DFS with caching to avoid redundant computations. This is essential for optimization problems and shows you understand time-space tradeoffs.

6. **Advanced State Management** - Tackle problems requiring multiple states per node (like the cycle detection example above) or complex constraint tracking.

7. **Hybrid Problems** - Finally, practice problems that combine DFS with other algorithms (like Dijkstra's or Union-Find) to handle Yandex's multi-concept challenges.

## Recommended Practice Order

Solve these problems in sequence to build up to Yandex-level DFS proficiency:

1. **Binary Tree Inorder Traversal (LeetCode #94)** - Master basic tree DFS
2. **Maximum Depth of Binary Tree (LeetCode #104)** - Simple recursive practice
3. **Path Sum (LeetCode #112)** - Introduction to path tracking
4. **Number of Islands (LeetCode #200)** - Grid-based DFS fundamentals
5. **Course Schedule (LeetCode #207)** - DFS with cycle detection
6. **Word Search (LeetCode #79)** - Backtracking with DFS
7. **All Paths From Source to Target (LeetCode #797)** - Multiple path finding
8. **Longest Increasing Path in a Matrix (LeetCode #329)** - DFS with memoization
9. **Reconstruct Itinerary (LeetCode #332)** - Complex graph traversal with ordering
10. **Robot Room Cleaner (LeetCode #489)** - Advanced backtracking with state

After completing this sequence, you'll have encountered most of the DFS patterns Yandex uses in their interviews. Remember that Yandex values clean, well-commented code almost as much as correct algorithms, so practice writing solutions that are both efficient and readable.

[Practice Depth-First Search at Yandex](/company/yandex/depth-first-search)
