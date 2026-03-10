---
title: "Depth-First Search Questions at Capital One: What to Expect"
description: "Prepare for Depth-First Search interview questions at Capital One — patterns, difficulty breakdown, and study tips."
date: "2029-04-03"
category: "dsa-patterns"
tags: ["capital-one", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at Capital One: What to Expect

Capital One’s technical interviews are known for their practical, business‑focused coding problems. With 5 out of 57 total questions tagged as Depth‑First Search (DFS), DFS isn’t the most frequent topic, but it’s a consistent one that appears in about 8–10% of their coding rounds. Why does it show up? Because DFS is the natural tool for exploring hierarchical data—think directory structures, organizational charts, decision trees, or nested financial products—all of which are core to a financial institution’s data modeling. At Capital One, DFS questions rarely appear as pure algorithm puzzles; they’re almost always disguised as real‑world problems about traversing or validating tree‑ or graph‑like relationships. If you’re interviewing here, you need to be comfortable recognizing when to reach for DFS and how to implement it cleanly under pressure.

## Specific Patterns Capital One Favors

Capital One’s DFS problems tend to cluster around three patterns:

1. **Tree Path Problems** – These are the most common. You’re given a tree (often a binary tree) and asked to find paths that satisfy certain conditions, like a target sum or a specific sequence. The twist is usually in the path definition: it might need to start at the root, end at a leaf, or be any downward path. LeetCode 112 (Path Sum) and 113 (Path Sum II) are classic examples of the root‑to‑leaf variant.

2. **Nested Structure Traversal** – This is where Capital One’s business context shines. You might be given a nested list, a JSON‑like object, or a directory tree and asked to aggregate values, validate formatting, or flatten the structure. Think LeetCode 339 (Nested List Weight Sum) or 341 (Flatten Nested List Iterator). These problems test your ability to adapt DFS to irregular, real‑world data.

3. **Cycle Detection in Directed Graphs** – Less frequent but important. Capital One sometimes asks about dependency resolution or workflow validation, which maps directly to detecting cycles in a directed graph (LeetCode 207 – Course Schedule). The implementation is usually standard DFS with a visiting‑state array.

Notably, Capital One rarely asks for pure graph traversal on an adjacency list. Their problems are almost always on explicit trees or nested structures. They also show a slight preference for **recursive DFS** over iterative, because it’s more intuitive for problems that need to backtrack or accumulate path results.

## How to Prepare

The key is to master the recursive DFS template and then learn how to extend it for path‑tracking and aggregation. Let’s look at the most common variation: finding all root‑to‑leaf paths in a binary tree that sum to a target.

<div class="code-group">

```python
# Time: O(n) – we visit each node once
# Space: O(h) for recursion stack, where h is tree height. O(n) in worst case (skewed tree).
def path_sum(root, target):
    def dfs(node, current_sum, path, result):
        if not node:
            return
        # Update path and sum
        path.append(node.val)
        current_sum += node.val
        # Check leaf condition
        if not node.left and not node.right and current_sum == target:
            result.append(list(path))  # Append a copy
        # Recurse left and right
        dfs(node.left, current_sum, path, result)
        dfs(node.right, current_sum, path, result)
        # Backtrack: remove current node from path
        path.pop()

    result = []
    dfs(root, 0, [], result)
    return result
```

```javascript
// Time: O(n) | Space: O(h) for recursion stack
function pathSum(root, target) {
  const result = [];

  function dfs(node, currentSum, path) {
    if (!node) return;
    path.push(node.val);
    currentSum += node.val;
    if (!node.left && !node.right && currentSum === target) {
      result.push([...path]); // Push a copy
    }
    dfs(node.left, currentSum, path);
    dfs(node.right, currentSum, path);
    path.pop(); // Backtrack
  }

  dfs(root, 0, []);
  return result;
}
```

```java
// Time: O(n) | Space: O(h) for recursion stack
public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
    List<List<Integer>> result = new ArrayList<>();
    dfs(root, targetSum, new ArrayList<>(), result);
    return result;
}

private void dfs(TreeNode node, int remaining, List<Integer> path, List<List<Integer>> result) {
    if (node == null) return;
    path.add(node.val);
    remaining -= node.val;
    if (node.left == null && node.right == null && remaining == 0) {
        result.add(new ArrayList<>(path)); // Add a copy
    }
    dfs(node.left, remaining, path, result);
    dfs(node.right, remaining, path, result);
    path.remove(path.size() - 1); // Backtrack
}
```

</div>

Notice the pattern: we pass the current path and sum down the recursion, modify them before the recursive calls, and **backtrack** after the calls. Backtracking is essential because the `path` list is reused across calls. Forgetting to backtrack (or to copy the path when saving a result) is the most common mistake in these interviews.

For nested structures, the template changes slightly—you’re often iterating over children rather than branching left/right. Here’s a generic DFS for a nested integer list (like LeetCode 339):

<div class="code-group">

```python
# Time: O(n) where n is total number of nested integers
# Space: O(d) for recursion depth, where d is maximum nesting level
def depth_sum(nested_list):
    def dfs(item, depth):
        if item.isInteger():
            return item.getInteger() * depth
        total = 0
        for child in item.getList():
            total += dfs(child, depth + 1)
        return total
    return dfs(nested_list, 1)
```

```javascript
// Time: O(n) | Space: O(d)
function depthSum(nestedList) {
  function dfs(list, depth) {
    let sum = 0;
    for (const item of list) {
      if (item.isInteger()) {
        sum += item.getInteger() * depth;
      } else {
        sum += dfs(item.getList(), depth + 1);
      }
    }
    return sum;
  }
  return dfs(nestedList, 1);
}
```

```java
// Time: O(n) | Space: O(d)
public int depthSum(List<NestedInteger> nestedList) {
    return dfs(nestedList, 1);
}

private int dfs(List<NestedInteger> list, int depth) {
    int sum = 0;
    for (NestedInteger item : list) {
        if (item.isInteger()) {
            sum += item.getInteger() * depth;
        } else {
            sum += dfs(item.getList(), depth + 1);
        }
    }
    return sum;
}
```

</div>

The core idea remains the same: traverse recursively, carrying state (here, depth) down the call stack.

## How Capital One Tests Depth-First Search vs Other Companies

At companies like Google or Meta, DFS problems often lean toward advanced graph theory (e.g., finding strongly connected components, topological sorting with twists) or complex backtracking (e.g., N‑Queens, generating permutations). The difficulty is in the algorithm itself.

At Capital One, the DFS algorithm is usually straightforward; the challenge is in **problem recognition** and **clean implementation**. They might describe a scenario like “validating a customer offer hierarchy” or “calculating total risk from a nested rule set.” Your job is to see the tree/graph underneath and apply DFS without getting tangled in the domain details. They also care more about readable, maintainable code—so avoid clever one‑liners and write clear variable names. I’ve seen interviewers here explicitly comment on code clarity when evaluating DFS solutions.

Another differentiator: Capital One sometimes combines DFS with simple object‑oriented design. You might be given a class definition for a tree node or nested element and asked to implement a method that uses DFS. This tests whether you can work within existing code structures, not just solve isolated algorithm problems.

## Study Order

1. **Basic Tree Traversals** – Start with pre‑order, in‑order, and post‑order recursion on binary trees. This builds your intuition for the call stack and visitation order.
2. **Path‑Based Problems** – Move to problems where you need to track the path from root to current node (like Path Sum). Practice backtracking until it’s automatic.
3. **Nested List/JSON Traversal** – Learn to adapt DFS to structures where each node has a variable number of children. This is where you’ll see the most Capital One‑style scenarios.
4. **Cycle Detection in Directed Graphs** – Study the three‑state DFS approach (unvisited, visiting, visited) for problems like course scheduling. This is a pattern you either know or don’t.
5. **Combined DFS + Design** – Finally, look at problems where DFS is part of a larger class, like an iterator (LeetCode 341) or a serialization method. This bridges pure algorithms and practical implementation.

This order works because it starts with the fundamental recursion pattern, adds complexity (path tracking), then applies it to different data shapes, and finally integrates it into a design context—matching the progression of difficulty in actual interviews.

## Recommended Practice Order

1. LeetCode 112 – Path Sum (basic root‑to‑leaf sum check)
2. LeetCode 113 – Path Sum II (collect all matching paths)
3. LeetCode 257 – Binary Tree Paths (all root‑to‑leaf paths, simpler)
4. LeetCode 339 – Nested List Weight Sum (classic nested traversal)
5. LeetCode 341 – Flatten Nested List Iterator (DFS + design)
6. LeetCode 207 – Course Schedule (cycle detection in directed graph)
7. LeetCode 690 – Employee Importance (tree‑like traversal on employee objects—very Capital One‑relevant)

If you can solve these seven problems fluently, you’ll cover 90% of the DFS patterns Capital One uses. Focus on writing clean, bug‑free code on your first try—that’s what they’re really evaluating.

[Practice Depth-First Search at Capital One](/company/capital-one/depth-first-search)
