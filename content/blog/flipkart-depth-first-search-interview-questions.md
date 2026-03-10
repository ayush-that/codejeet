---
title: "Depth-First Search Questions at Flipkart: What to Expect"
description: "Prepare for Depth-First Search interview questions at Flipkart — patterns, difficulty breakdown, and study tips."
date: "2028-04-22"
category: "dsa-patterns"
tags: ["flipkart", "depth-first-search", "interview prep"]
---

If you're preparing for a Flipkart interview, you've likely seen the statistic: **20 out of their 117 tagged LeetCode problems involve Depth-First Search (DFS)**. That's roughly 17% of their problem bank, making it one of their most frequently tested algorithmic techniques. But raw numbers don't tell the whole story. In my experience conducting and analyzing interviews, DFS isn't just a random topic at Flipkart—it's a **core assessment tool** for evaluating a candidate's ability to handle recursive thinking, backtracking, and complex state management, which are essential for building scalable e-commerce systems like inventory management, recommendation graphs, and dependency resolution in their microservices architecture.

Unlike companies that might test DFS as a one-off traversal question, Flipkart interviewers often embed it within problems that have a **clear "real-system" smell**. You're not just traversing a binary tree; you're more likely to be finding all valid discount combinations, navigating a category hierarchy, or detecting circular dependencies in a service mesh. The frequency means you will almost certainly face at least one DFS-variant problem in your interview loop.

## Specific Patterns Flipkart Favors

Flipkart's DFS questions tend to cluster around three specific patterns, moving from fundamental to applied.

1.  **Backtracking on Implicit Graphs (Combinatorial Search):** This is their bread and butter. The problem presents a set of choices (like digits, characters, or items) and constraints (business rules), and you must find all valid combinations or permutations. It tests if you can prune invalid paths early—a direct analog to filtering invalid product combinations or promo codes.
    - **Example:** LeetCode 39 ("Combination Sum") and its variants. You're given a set of candidate numbers and a target, find all unique combinations that sum to the target. This mirrors finding bundles of products that fit a budget.

2.  **DFS on Trees with State Carrying:** They love tree problems where you need to carry information up or down the recursion. It's not enough to just traverse; you must compute something like a maximum path sum, a diameter, or validate a property, which requires reasoning about what each recursive call returns.
    - **Example:** LeetCode 124 ("Binary Tree Maximum Path Sum"). This is a classic that tests your ability to distinguish between the local path sum you can extend to a parent and the global best path you've found.

3.  **Cycle Detection & Topological Sorting on Directed Graphs:** Given Flipkart's distributed systems, questions about detecting cycles or finding valid orders (topological sort) are common. These are DFS applications on directed graphs to resolve dependencies—think ordering tasks or service startups.
    - **Example:** LeetCode 207 ("Course Schedule"). Can you finish all courses given prerequisites? This is essentially checking for cycles in a dependency graph.

The implementation style they expect is usually **recursive DFS** for clarity and conciseness, especially in backtracking. However, for topological sort, you should be prepared to discuss the iterative stack-based approach as well.

## How to Prepare

The key is to internalize the backtracking template. Let's look at the most critical pattern: generating all combinations via backtracking.

<div class="code-group">

```python
# Pattern: Backtracking to find all combinations (LeetCode 39)
# Time: O(N^(T/M)) where N = len(candidates), T = target, M = min(candidate)
# Space: O(T/M) for the recursion depth and path.
def combinationSum(candidates, target):
    def backtrack(start, path, remaining):
        # Base Case: Success
        if remaining == 0:
            result.append(path[:])  # Append a copy of the path
            return
        # Base Case: Failure (pruned by loop condition)
        for i in range(start, len(candidates)):
            num = candidates[i]
            # Pruning: if the candidate exceeds remaining, skip (assumes sorted list)
            if num > remaining:
                break  # or 'continue' if list isn't sorted
            # 1. Choose: Take this candidate into the path
            path.append(num)
            # 2. Explore: Recurse, allowing reuse of same element (i, not i+1)
            backtrack(i, path, remaining - num)
            # 3. Unchoose: Backtrack to try the next candidate
            path.pop()

    candidates.sort()  # Sorting enables efficient pruning
    result = []
    backtrack(0, [], target)
    return result
```

```javascript
// Pattern: Backtracking to find all combinations (LeetCode 39)
// Time: O(N^(T/M)) | Space: O(T/M)
function combinationSum(candidates, target) {
  const result = [];

  function backtrack(start, path, remaining) {
    if (remaining === 0) {
      result.push([...path]); // Append a shallow copy
      return;
    }
    for (let i = start; i < candidates.length; i++) {
      const num = candidates[i];
      if (num > remaining) break; // Pruning
      // Choose
      path.push(num);
      // Explore
      backtrack(i, path, remaining - num);
      // Unchoose
      path.pop();
    }
  }

  candidates.sort((a, b) => a - b); // Enable pruning
  backtrack(0, [], target);
  return result;
}
```

```java
// Pattern: Backtracking to find all combinations (LeetCode 39)
// Time: O(N^(T/M)) | Space: O(T/M) for recursion depth
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> result = new ArrayList<>();
    Arrays.sort(candidates); // Enable pruning
    backtrack(candidates, target, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] candidates, int remaining, int start,
                       List<Integer> path, List<List<Integer>> result) {
    if (remaining == 0) {
        result.add(new ArrayList<>(path)); // Crucial: create a new copy
        return;
    }
    for (int i = start; i < candidates.length; i++) {
        int num = candidates[i];
        if (num > remaining) break; // Prune
        // Choose
        path.add(num);
        // Explore
        backtrack(candidates, remaining - num, i, path, result);
        // Unchoose
        path.remove(path.size() - 1);
    }
}
```

</div>

The second pattern to master is the **post-order DFS on trees** for problems like finding the diameter or maximum path sum. The pattern involves each call returning a value to its parent, while potentially updating a global result.

<div class="code-group">

```python
# Pattern: DFS on Tree returning a value (LeetCode 124 - Max Path Sum)
# Time: O(N) | Space: O(H) for recursion depth, where H is tree height.
def maxPathSum(root):
    max_sum = float('-inf')

    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0
        # Post-order traversal: get info from children first
        left_gain = max(dfs(node.left), 0)   # Ignore negative paths
        right_gain = max(dfs(node.right), 0)

        # Current node as the "root" of a potential new path
        price_newpath = node.val + left_gain + right_gain
        max_sum = max(max_sum, price_newpath)

        # Return the maximum gain if we continue this path upward
        return node.val + max(left_gain, right_gain)

    dfs(root)
    return max_sum
```

```javascript
// Pattern: DFS on Tree returning a value (LeetCode 124)
// Time: O(N) | Space: O(H)
function maxPathSum(root) {
  let maxSum = -Infinity;

  function dfs(node) {
    if (!node) return 0;
    const leftGain = Math.max(dfs(node.left), 0);
    const rightGain = Math.max(dfs(node.right), 0);

    const priceNewPath = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, priceNewPath);

    return node.val + Math.max(leftGain, rightGain);
  }

  dfs(root);
  return maxSum;
}
```

```java
// Pattern: DFS on Tree returning a value (LeetCode 124)
// Time: O(N) | Space: O(H)
class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return maxSum;
    }

    private int dfs(TreeNode node) {
        if (node == null) return 0;
        int leftGain = Math.max(dfs(node.left), 0);
        int rightGain = Math.max(dfs(node.right), 0);

        int priceNewPath = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, priceNewPath);

        return node.val + Math.max(leftGain, rightGain);
    }
}
```

</div>

## How Flipkart Tests Depth-First Search vs Other Companies

At companies like Google or Meta, a DFS problem might be a clever component of a novel, heavily disguised problem. At Flipkart, the DFS application is often more **directly applicable to e-commerce domains**. The constraints feel like business logic. For example, instead of generating all parentheses combinations (LeetCode 22), you might be asked to generate all valid promo code strings given a set of rules.

The difficulty is typically **Medium**, but the challenge comes from correctly modeling the problem as a graph and applying the right pruning. They are less interested in you knowing the most obscure algorithm and more interested in seeing you write clean, recursive code that handles edge cases (like cycles or null nodes) and can be explained clearly. Expect follow-ups on optimization: "What if the candidate list is huge?" (Sorting and pruning). "How would you make this iterative?" (Discuss stack usage).

## Study Order

Don't jump straight into complex backtracking. Build your understanding sequentially:

1.  **Basic Tree Traversal (Pre, In, Post-order):** Internalize recursion on binary trees. This is the foundation. Practice on LeetCode 94, 144, 145.
2.  **Simple Recursive Computation on Trees:** Problems where each node returns a value (max depth, diameter). This teaches you to design recursive function signatures. Practice LeetCode 104, 543.
3.  **Backtracking Fundamentals:** Learn the choose-explore-unchoose pattern on simple combinatorial problems (subsets, permutations) without extra constraints. Practice LeetCode 78, 46.
4.  **Constrained Backtracking (Flipkart Core):** Add constraints (sum targets, reuse rules) and learn pruning. This is where Flipkart's common problems live. Practice LeetCode 39, 40, 216.
5.  **DFS on General Graphs & Cycle Detection:** Extend your mental model from trees to graphs with adjacency lists. Learn to track visited states to avoid cycles. Practice LeetCode 207, 133 (Clone Graph).
6.  **Complex State Management:** Finally, tackle problems where the path itself has complex rules or you need to carry multiple pieces of state. Practice LeetCode 124, 329 (Longest Increasing Path in a Matrix).

## Recommended Practice Order

Solve these in sequence to build the skills Flipkart tests:

1.  **LeetCode 104 ("Maximum Depth of Binary Tree")** - Warm-up recursion.
2.  **LeetCode 78 ("Subsets")** - Introduction to backtracking for generation.
3.  **LeetCode 39 ("Combination Sum")** - The essential Flipkart pattern. Master this.
4.  **LeetCode 46 ("Permutations")** - Adapt the template for ordering constraints.
5.  **LeetCode 207 ("Course Schedule")** - Apply DFS for cycle detection.
6.  **LeetCode 124 ("Binary Tree Maximum Path Sum")** - Master returning/comparing values in recursion.
7.  **LeetCode 200 ("Number of Islands")** - Classic grid DFS, good for follow-ups on input size.
8.  **LeetCode 79 ("Word Search")** - Backtracking on a grid with more complex state.

This progression takes you from the mechanics of recursion to the sophisticated state management and pruning that Flipkart interviewers look for. Remember, their goal is to see if you can translate a business rule set into a correct and efficient recursive exploration. Practice articulating your thought process out loud as you solve: "I'm treating each product choice as a node, and I'll backtrack when the cart total exceeds the budget..."

[Practice Depth-First Search at Flipkart](/company/flipkart/depth-first-search)
