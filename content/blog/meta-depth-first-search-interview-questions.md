---
title: "Depth-First Search Questions at Meta: What to Expect"
description: "Prepare for Depth-First Search interview questions at Meta — patterns, difficulty breakdown, and study tips."
date: "2027-03-17"
category: "dsa-patterns"
tags: ["meta", "depth-first-search", "interview prep"]
---

Meta has 138 Depth-First Search questions out of 1387 total. That's exactly 10%. This isn't a coincidence. While Meta's interview process is famously dynamic, DFS is a cornerstone topic that appears with remarkable consistency, especially in the technical phone screen and onsite coding rounds. It's not just a "nice to know" algorithm; it's a fundamental tool for reasoning about hierarchical data, exploring state spaces, and solving backtracking problems—all of which are directly relevant to Meta's work on social graphs, UI component trees, and recommendation systems. You will almost certainly encounter at least one problem that can be elegantly solved with DFS or its close cousin, backtracking. The key is not just knowing the algorithm, but recognizing the specific patterns Meta prefers and executing them flawlessly under pressure.

## Specific Patterns Meta Favors

Meta's DFS questions rarely ask you to implement a simple traversal on a provided graph. Instead, they embed DFS within problems that test your ability to model a real-world scenario as a graph and then explore it. Three patterns dominate:

1.  **Backtracking on Implicit State Spaces:** This is the most common pattern. The "graph" isn't given as an adjacency list; it's defined by the rules of the problem. Your task is to perform a DFS over all possible states (e.g., all valid permutations, all possible palindrome partitions) to find those that meet a condition. Problems like **Palindrome Partitioning (#131)** and **Subsets (#78)** are classic examples. You're building the path as you go and pruning invalid branches.
2.  **DFS on Trees with State Passing:** Meta loves binary tree problems where you need to pass information up and down the recursion stack. It's not enough to just visit nodes; you must calculate something that depends on the left and right subtrees, often requiring a helper function that returns multiple values or uses a mutable reference. **Binary Tree Maximum Path Sum (#124)** is the quintessential hard problem in this category. **Lowest Common Ancestor of a Binary Tree (#236)** is another favorite that tests this pattern at a medium level.
3.  **DFS for Connected Components on a Grid:** While less frequent than the first two, problems like **Number of Islands (#200)** and its many variants (e.g., **Max Area of Island (#695)**) are staples. They test your ability to perform a flood fill, modifying the grid in-place to mark visited nodes—a very practical skill.

You'll notice a strong preference for **recursive implementations**. Meta interviewers expect clean, recursive DFS because it's more declarative and easier to reason about for these types of problems. Iterative DFS using a stack is acceptable but often more verbose for backtracking.

<div class="code-group">

```python
# Pattern: Backtracking on Implicit State Space (Subsets #78)
# Time: O(N * 2^N) | Space: O(N) for recursion depth and path
def subsets(nums):
    def backtrack(start, path):
        # Every node in the recursion tree is a valid subset
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])          # Make choice
            backtrack(i + 1, path)        # Explore
            path.pop()                    # Undo choice (backtrack)

    result = []
    backtrack(0, [])
    return result
```

```javascript
// Pattern: Backtracking on Implicit State Space (Subsets #78)
// Time: O(N * 2^N) | Space: O(N) for recursion depth and path
function subsets(nums) {
  const result = [];

  function backtrack(start, path) {
    // Every node in the recursion tree is a valid subset
    result.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]); // Make choice
      backtrack(i + 1, path); // Explore
      path.pop(); // Undo choice (backtrack)
    }
  }

  backtrack(0, []);
  return result;
}
```

```java
// Pattern: Backtracking on Implicit State Space (Subsets #78)
// Time: O(N * 2^N) | Space: O(N) for recursion depth and path
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
    // Every node in the recursion tree is a valid subset
    result.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);                // Make choice
        backtrack(nums, i + 1, path, result); // Explore
        path.remove(path.size() - 1);     // Undo choice (backtrack)
    }
}
```

</div>

## How to Prepare

Don't just memorize the algorithm. Internalize the framework. For any DFS problem, your mental checklist should be:

1.  **What is the node/state in my graph?** (e.g., a position in a string, a tree node, a cell in a grid).
2.  **What are the edges/choices?** (e.g., which character to take next, go left/right, move to 4 neighbors).
3.  **What is my base case?** (When have I reached a leaf node or invalid state?).
4.  **Do I need to prune?** (Add an `if` condition to stop exploring a futile branch).
5.  **What state am I passing?** (Am I using a mutable `path` list, or returning a value up the stack?).

Practice writing the backtracking template from scratch until it's muscle memory. Then, focus on the tree DFS pattern where you need to aggregate information. The key insight here is often to use a post-order traversal (process children first) and let the recursive function return a value.

<div class="code-group">

```python
# Pattern: DFS on Trees with State Passing (Max Path Sum #124)
# Time: O(N) | Space: O(H) for recursion depth, where H is tree height
def maxPathSum(root):
    max_sum = float('-inf')

    def gain_from_subtree(node):
        nonlocal max_sum
        if not node:
            return 0

        # Gain from left and right subtrees. If negative, take 0 (ignore that branch).
        left_gain = max(gain_from_subtree(node.left), 0)
        right_gain = max(gain_from_subtree(node.right), 0)

        # Current path sum if we use this node as the "root" of the path.
        price_newpath = node.val + left_gain + right_gain
        max_sum = max(max_sum, price_newpath)

        # Return the maximum gain if we continue the same path upward.
        return node.val + max(left_gain, right_gain)

    gain_from_subtree(root)
    return max_sum
```

```javascript
// Pattern: DFS on Trees with State Passing (Max Path Sum #124)
// Time: O(N) | Space: O(H) for recursion depth, where H is tree height
function maxPathSum(root) {
  let maxSum = -Infinity;

  function gainFromSubtree(node) {
    if (!node) return 0;

    // Gain from left and right subtrees. If negative, take 0.
    const leftGain = Math.max(gainFromSubtree(node.left), 0);
    const rightGain = Math.max(gainFromSubtree(node.right), 0);

    // Current path sum if we use this node as the "root".
    const priceNewPath = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, priceNewPath);

    // Return the maximum gain if we continue the same path upward.
    return node.val + Math.max(leftGain, rightGain);
  }

  gainFromSubtree(root);
  return maxSum;
}
```

```java
// Pattern: DFS on Trees with State Passing (Max Path Sum #124)
// Time: O(N) | Space: O(H) for recursion depth, where H is tree height
class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        gainFromSubtree(root);
        return maxSum;
    }

    private int gainFromSubtree(TreeNode node) {
        if (node == null) return 0;

        // Gain from left and right subtrees. If negative, take 0.
        int leftGain = Math.max(gainFromSubtree(node.left), 0);
        int rightGain = Math.max(gainFromSubtree(node.right), 0);

        // Current path sum if we use this node as the "root".
        int priceNewPath = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, priceNewPath);

        // Return the maximum gain if we continue the same path upward.
        return node.val + Math.max(leftGain, rightGain);
    }
}
```

</div>

## How Meta Tests Depth-First Search vs Other Companies

At companies like Google, DFS problems often lean toward advanced graph theory (e.g., Eulerian paths, strongly connected components). At Amazon, they might be wrapped in a more concrete system design context. **Meta's approach is distinct in its focus on applied recursion and clean state management.**

The problems feel like pure coding challenges, but they're testing your ability to think recursively—a skill vital for working with React's component trees or Haxl's data fetching. The interviewer will watch how you define your recursive function's signature and how you manage mutable state (like the `path` list in backtracking). A common pitfall they look for is forgetting to backtrack (the `path.pop()` step) or incorrectly passing state by reference. They also expect a clear explanation of the time/space complexity derived from the recursion tree's branching factor and depth.

## Study Order

Tackle these sub-topics in sequence. Each builds on the previous one.

1.  **Basic Tree Traversals (Pre, In, Post-order):** Understand the recursion flow. This is non-negotiable.
2.  **Simple Recursive Tree Problems:** Problems like **Maximum Depth of Binary Tree (#104)** and **Invert Binary Tree (#226)**. Get comfortable with functions that return a value.
3.  **Classic Backtracking Template:** Learn the "choose-explore-unchoose" pattern on a simple problem like **Subsets (#78)**. This is your foundational template.
4.  **Variations on Backtracking:** Apply the template to permutations (**Permutations #46**), combination sum problems, and palindrome partitioning. Learn to add pruning conditions.
5.  **DFS on Grids:** Practice the flood fill pattern. This teaches you to modify the input as a visited map.
6.  **Complex Tree DFS with State:** This is the peak. Tackle problems where you need to pass multiple pieces of information up the tree, like **Binary Tree Maximum Path Sum (#124)** and **Lowest Common Ancestor (#236)**.

## Recommended Practice Order

Solve these problems in this order. Don't jump to the hard ones until you've mastered the patterns in the mediums.

1.  **Maximum Depth of Binary Tree (#104)** - Warm-up.
2.  **Subsets (#78)** - Learn the core backtracking template.
3.  **Permutations (#46)** - Adapt the template for a different constraint.
4.  **Number of Islands (#200)** - Master grid DFS.
5.  **Lowest Common Ancestor of a Binary Tree (#236)** - Learn to return values and find nodes.
6.  **Palindrome Partitioning (#131)** - A classic Meta-style backtracking problem.
7.  **Binary Tree Maximum Path Sum (#124)** - The ultimate test of tree DFS understanding.

If you can solve #124 clearly and derive its complexity correctly, you are in excellent shape for Meta's DFS questions.

[Practice Depth-First Search at Meta](/company/meta/depth-first-search)
