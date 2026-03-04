---
title: "Depth-First Search Questions at Google: What to Expect"
description: "Prepare for Depth-First Search interview questions at Google — patterns, difficulty breakdown, and study tips."
date: "2027-02-13"
category: "dsa-patterns"
tags: ["google", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a fundamental algorithm for exploring graphs and trees, making it a critical tool for solving problems involving hierarchical data, connected components, pathfinding, and permutations. At Google, where systems are built on vast, interconnected graphs—from web indexing and social networks to file systems and dependency trees—the ability to traverse these structures efficiently is non-negotiable. With 196 specific DFS questions in their problem bank, Google interviewers use it to assess a candidate's comfort with recursion, backtracking, and systematic problem decomposition. Mastering DFS demonstrates you can think recursively and handle state management, both essential for software roles.

## What to Expect — Types of Problems

Google's DFS questions typically fall into a few core categories. You won't just implement basic traversal; you'll apply the pattern to solve concrete problems.

**Tree and Graph Traversal:** Foundational questions where you must navigate a structure to find a node, compute a property (like maximum depth), or serialize data. Expect binary trees and n-ary trees.

**Pathfinding and Backtracking:** These problems ask you to find _all_ valid paths or a specific path under constraints. Classic examples include finding all paths in a grid from start to end, generating permutations, or solving puzzles like Word Search. The key is exploring choices and undoing them (backtracking).

**Connected Components and Flood Fill:** Applied to matrices (2D grids) or networks, these problems involve grouping adjacent or reachable elements. Think number of islands, count connected components in a graph, or region coloring.

**Cycle Detection and Topological Sorting:** For dependency resolution and deadlock detection, you'll need to detect cycles in directed graphs or produce a linear ordering of nodes (topological sort) using DFS.

**Memoization and DFS with State:** Advanced problems combine DFS with caching (memoization) to avoid recomputation, often seen in game theory or complex combinatorial problems.

## How to Prepare — Study Tips with One Code Example

Start by internalizing the two primary DFS implementations: **recursive** (implicit call stack) for trees and simpler graphs, and **iterative** (explicit stack) for deeper graphs or to avoid recursion limits. Always clarify the graph structure (acyclic? directed?) and watch for visited nodes to avoid infinite loops.

The most critical pattern is **Backtracking DFS**. It follows a template: make a choice, recurse, then undo the choice to explore other options. Here is that pattern applied to a classic problem: generating all permutations of an array.

<div class="code-group">

```python
def permute(nums):
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])  # Take a copy
            return
        for i in range(len(nums)):
            if not used[i]:
                used[i] = True
                path.append(nums[i])
                backtrack(path, used)
                path.pop()          # Undo choice (backtrack)
                used[i] = False     # Undo state

    result = []
    backtrack([], [False] * len(nums))
    return result
```

```javascript
function permute(nums) {
  const result = [];
  const used = new Array(nums.length).fill(false);

  function backtrack(path) {
    if (path.length === nums.length) {
      result.push([...path]); // Take a copy
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (!used[i]) {
        used[i] = true;
        path.push(nums[i]);
        backtrack(path);
        path.pop(); // Undo choice (backtrack)
        used[i] = false; // Undo state
      }
    }
  }
  backtrack([]);
  return result;
}
```

```java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrack(nums, new ArrayList<>(), used, result);
    return result;
}

private void backtrack(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> result) {
    if (path.size() == nums.length) {
        result.add(new ArrayList<>(path)); // Take a copy
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (!used[i]) {
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums, path, used, result);
            path.remove(path.size() - 1); // Undo choice (backtrack)
            used[i] = false;              // Undo state
        }
    }
}
```

</div>

## Recommended Practice Order

Build competence progressively. First, master simple recursive tree traversals (pre-order, in-order). Second, practice basic graph DFS on adjacency lists, ensuring you handle visited sets. Third, drill into backtracking templates with problems like subsets and permutations. Fourth, tackle matrix-based DFS (flood fill, islands). Finally, combine DFS with other techniques like memoization or topological sort. Solve each problem from scratch, then analyze time/space complexity. Verbalize your reasoning; interviewers want to see the thought process behind the code.

[Practice Depth-First Search at Google](/company/google/depth-first-search)
