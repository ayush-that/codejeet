---
title: "Depth-First Search Questions at Airbnb: What to Expect"
description: "Prepare for Depth-First Search interview questions at Airbnb — patterns, difficulty breakdown, and study tips."
date: "2028-12-26"
category: "dsa-patterns"
tags: ["airbnb", "depth-first-search", "interview prep"]
---

## Why Depth-First Search Matters at Airbnb

Airbnb’s engineering problems often model real‑world relationships: hosts and guests, listings and neighborhoods, calendars and availability windows. These relationships naturally form trees or graphs—exactly the domain where Depth‑First Search (DFS) shines. With 6 out of their 64 tagged LeetCode questions being DFS‑specific, it’s not their most frequent topic, but it’s a high‑signal one. When DFS appears in an Airbnb interview, it’s rarely a simple traversal; it’s almost always coupled with a secondary constraint—path counting, memoization, or backtracking—that tests whether you understand state management within the recursion. In my experience, an Airbnb interviewer who asks a DFS question is checking two things: can you cleanly navigate a recursive structure, and can you track the right information along the way to solve a business‑logic problem (like finding available booking windows or validating a listing hierarchy).

## Specific Patterns Airbnb Favors

Airbnb’s DFS questions lean heavily on **tree and graph traversal where you need to carry and return accumulated state**. You won’t see much pure graph theory (like network flow); instead, expect problems where the graph is implicit (like a word‑search board) or where the tree represents a hierarchical rule set. Two patterns stand out:

1. **Backtracking with pruning** – Problems where you explore all possible configurations but can cut off branches early. Airbnb likes to attach this to realistic scenarios, e.g., generating all possible itinerary arrangements given flight tickets.
2. **DFS with memoization** – Often appears in problems that could be solved with dynamic programming but are more intuitively expressed via DFS + memo. This tests your ability to recognize overlapping subproblems within a recursive exploration.

A classic example is **LeetCode 332 “Reconstruct Itinerary”** (which actually appears in Airbnb’s list). It’s a graph traversal where you must visit every edge exactly once, but the need to return the lexicographically smallest valid itinerary forces you to manage sorting and backtracking. Another is **LeetCode 124 “Binary Tree Maximum Path Sum”**, a tree DFS where each recursive call returns one piece of information (the maximum single‑branch sum) while a global variable tracks the best overall path—a pattern of splitting “local” vs. “global” state that Airbnb interviewers often probe.

## How to Prepare

Master the two key variations: **return‑carrying DFS** and **state‑tracking DFS**. Below are code templates for each. Notice how the function signature changes based on what you need to propagate.

<div class="code-group">

```python
# Pattern 1: DFS that returns a value (e.g., max depth, sum)
# Example: Find maximum depth of a binary tree (LeetCode 104)
# Time: O(n) | Space: O(h) for recursion stack, where h is tree height
def maxDepth(root):
    if not root:
        return 0
    left_depth = maxDepth(root.left)
    right_depth = maxDepth(root.right)
    return max(left_depth, right_depth) + 1

# Pattern 2: DFS that carries path state and possibly backtracks
# Example: Path Sum II (LeetCode 113) – find all root-to-leaf paths summing to target
# Time: O(n^2) in worst case due to path copying | Space: O(h) for recursion, O(n) for paths
def pathSum(root, targetSum):
    def dfs(node, current_sum, path, result):
        if not node:
            return
        current_sum += node.val
        path.append(node.val)
        if not node.left and not node.right and current_sum == targetSum:
            result.append(list(path))  # copy the path
        dfs(node.left, current_sum, path, result)
        dfs(node.right, current_sum, path, result)
        path.pop()  # backtrack

    result = []
    dfs(root, 0, [], result)
    return result
```

```javascript
// Pattern 1: Return-carrying DFS
// Time: O(n) | Space: O(h)
function maxDepth(root) {
  if (!root) return 0;
  const leftDepth = maxDepth(root.left);
  const rightDepth = maxDepth(root.right);
  return Math.max(leftDepth, rightDepth) + 1;
}

// Pattern 2: State-tracking DFS with backtracking
// Time: O(n^2) | Space: O(h) recursion, O(n) for paths
function pathSum(root, targetSum) {
  const result = [];
  function dfs(node, currentSum, path) {
    if (!node) return;
    currentSum += node.val;
    path.push(node.val);
    if (!node.left && !node.right && currentSum === targetSum) {
      result.push([...path]); // copy
    }
    dfs(node.left, currentSum, path);
    dfs(node.right, currentSum, path);
    path.pop(); // backtrack
  }
  dfs(root, 0, []);
  return result;
}
```

```java
// Pattern 1: Return-carrying DFS
// Time: O(n) | Space: O(h)
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    int leftDepth = maxDepth(root.left);
    int rightDepth = maxDepth(root.right);
    return Math.max(leftDepth, rightDepth) + 1;
}

// Pattern 2: State-tracking DFS with backtracking
// Time: O(n^2) | Space: O(h) recursion, O(n) for paths
public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
    List<List<Integer>> result = new ArrayList<>();
    dfs(root, targetSum, new ArrayList<>(), result);
    return result;
}

private void dfs(TreeNode node, int currentSum, List<Integer> path, List<List<Integer>> result) {
    if (node == null) return;
    currentSum -= node.val;  // subtract as we go
    path.add(node.val);
    if (node.left == null && node.right == null && currentSum == 0) {
        result.add(new ArrayList<>(path)); // copy
    }
    dfs(node.left, currentSum, path, result);
    dfs(node.right, currentSum, path, result);
    path.remove(path.size() - 1); // backtrack
}
```

</div>

## How Airbnb Tests Depth-First Search vs Other Companies

At companies like Google or Meta, DFS questions often test raw algorithmic prowess—think complex cycle detection or topological sorting in large graphs. Airbnb’s DFS problems feel more _applied_. The graph is usually smaller (a tree of listings, a 4x4 word board), but the complexity comes from the business rules layered on top. For example, you might traverse a calendar graph but need to enforce minimum‑stay policies or cleaning‑day constraints. This means Airbnb interviews test **DFS + constraint checking** more than pure algorithmic speed. Another differentiator: Airbnb often expects you to discuss trade‑offs between recursive and iterative (stack‑based) DFS implementations, because in their codebase both appear depending on context (deep recursion might blow the stack in some environments). Be ready to justify your choice.

## Study Order

1. **Basic Tree Traversals (Pre‑order, In‑order, Post‑order)** – Understand the recursion stack; this is the foundation. Without this, you can’t track state properly.
2. **Path‑Based Problems (e.g., Path Sum, All Paths)** – Learn to carry a mutable path and backtrack. This introduces the idea of propagating information downward and collecting results upward.
3. **DFS on Implicit Graphs (Word Search, Islands)** – Practice converting a 2D grid into an adjacency‑list‑like traversal. Airbnb often uses grids to represent maps or calendars.
4. **DFS with Memoization (e.g., Unique Paths, Word Break)** – Recognize when subproblems repeat. This bridges DFS to DP and is common in Airbnb problems where you explore states (like “remaining days” or “remaining budget”).
5. **Backtracking with Pruning (N‑Queens, Permutations with constraints)** – Master cutting off invalid branches early. Airbnb uses this for itinerary‑style problems where you sort candidates to ensure lexicographic order.

This order works because each step adds one new conceptual layer: first you learn to walk, then to carry a backpack, then to navigate a maze, then to remember where you’ve been, and finally to avoid dead ends intelligently.

## Recommended Practice Order

1. **Maximum Depth of Binary Tree (LeetCode 104)** – Pure return‑carrying DFS.
2. **Path Sum II (LeetCode 113)** – State‑tracking with backtracking.
3. **Number of Islands (LeetCode 200)** – DFS on an implicit graph.
4. **Word Search (LeetCode 79)** – DFS with early exit (pruning).
5. **Reconstruct Itinerary (LeetCode 332)** – DFS on a directed graph with lexical ordering and backtracking—this is the closest to a classic Airbnb problem.
6. **Unique Paths (LeetCode 62)** – Solve it first with DFS + memoization to understand the pattern, then with DP.

After these six, you’ll have covered the core patterns Airbnb tests. The key is to practice explaining _why_ you’re using DFS instead of BFS (usually you need to explore all the way to a leaf/end state before considering siblings) and how you manage state without creating subtle bugs.

[Practice Depth-First Search at Airbnb](/company/airbnb/depth-first-search)
