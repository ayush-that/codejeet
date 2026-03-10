---
title: "Depth-First Search Questions at Yahoo: What to Expect"
description: "Prepare for Depth-First Search interview questions at Yahoo — patterns, difficulty breakdown, and study tips."
date: "2029-02-02"
category: "dsa-patterns"
tags: ["yahoo", "depth-first-search", "interview prep"]
---

## Depth-First Search Questions at Yahoo: What to Expect

If you're preparing for Yahoo interviews, you might have noticed they have 7 Depth-First Search (DFS) questions in their tagged LeetCode problems. That's about 11% of their total tagged questions — not the largest category, but significant enough that you'll almost certainly encounter at least one DFS problem in your interview loop. What's interesting is how Yahoo uses DFS: they don't just ask it as a standalone algorithm, but as a fundamental building block for more complex problems involving trees, graphs, backtracking, and even system design scenarios.

From my experience and conversations with engineers who've interviewed there, Yahoo's DFS questions tend to be practical rather than purely academic. They're testing whether you can recognize when DFS is the right tool, implement it cleanly, and adapt it to solve real-world problems like directory traversal, dependency resolution, or configuration validation.

## Specific Patterns Yahoo Favors

Yahoo's DFS problems cluster around three main patterns:

1. **Tree Traversal with State Tracking** — They love problems where you need to traverse a tree while maintaining some state (like path sum, node counts, or validation flags). These test your ability to manage recursion parameters cleanly.

2. **Backtracking on Implicit Graphs** — Problems like generating combinations or permutations where the "graph" is the decision space of your choices. Yahoo often uses these to assess how you think about constraints and pruning.

3. **Graph Connectivity with Modifications** — Not just "find connected components," but variations like "find connected components with a twist" — maybe counting special nodes or transforming the graph as you traverse.

A classic example is **LeetCode 124: Binary Tree Maximum Path Sum**, which appears in Yahoo's list. This isn't just basic DFS — it requires understanding both downward and upward propagation of values, a pattern that comes up in distributed systems scenarios. Another favorite is **LeetCode 133: Clone Graph**, which tests both traversal and object mapping in a practical data copying scenario.

What's notable is what Yahoo _doesn't_ emphasize: pure grid traversal (like number of islands) or simple recursive DP. Their problems tend to have an extra layer of complexity, often involving object relationships rather than simple arrays.

## How to Prepare

The key to Yahoo's DFS questions is writing clean, maintainable recursive code with proper state management. Let's look at the core pattern for tree DFS with state tracking:

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is tree height (recursion stack)
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_path_sum(root):
    """
    LeetCode 124 pattern: Returns maximum path sum where path can start/end anywhere
    """
    max_sum = float('-inf')

    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0

        # Post-order traversal: process children first
        left_gain = max(dfs(node.left), 0)  # Ignore negative contributions
        right_gain = max(dfs(node.right), 0)

        # Path through current node as "root" of path
        current_path = node.val + left_gain + right_gain
        max_sum = max(max_sum, current_path)

        # Return maximum gain if continuing path upward
        return node.val + max(left_gain, right_gain)

    dfs(root)
    return max_sum
```

```javascript
// Time: O(n) | Space: O(h) where h is tree height (recursion stack)
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function maxPathSum(root) {
  let maxSum = -Infinity;

  function dfs(node) {
    if (!node) return 0;

    // Post-order traversal
    const leftGain = Math.max(dfs(node.left), 0);
    const rightGain = Math.max(dfs(node.right), 0);

    // Path through current node
    const currentPath = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, currentPath);

    // Continue path upward
    return node.val + Math.max(leftGain, rightGain);
  }

  dfs(root);
  return maxSum;
}
```

```java
// Time: O(n) | Space: O(h) where h is tree height (recursion stack)
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

class Solution {
    private int maxSum = Integer.MIN_VALUE;

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return maxSum;
    }

    private int dfs(TreeNode node) {
        if (node == null) return 0;

        // Post-order traversal
        int leftGain = Math.max(dfs(node.left), 0);
        int rightGain = Math.max(dfs(node.right), 0);

        // Path through current node
        int currentPath = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currentPath);

        // Continue path upward
        return node.val + Math.max(leftGain, rightGain);
    }
}
```

</div>

Notice the pattern: we use a closure (or class variable) to track global state (`maxSum`) while the recursive function returns local state (the best continuation upward). This separation of concerns is crucial for clean DFS implementations.

For backtracking problems, Yahoo expects you to understand pruning. Here's the template:

<div class="code-group">

```python
# Time: O(n * 2^n) | Space: O(n) for recursion stack and path storage
def subsets(nums):
    """
    LeetCode 78 pattern: Generate all subsets using backtracking
    """
    result = []

    def backtrack(start, path):
        # Add current subset
        result.append(path.copy())

        # Explore further elements
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)  # Note: i+1, not start+1
            path.pop()  # Backtrack

    backtrack(0, [])
    return result
```

```javascript
// Time: O(n * 2^n) | Space: O(n) for recursion stack and path storage
function subsets(nums) {
  const result = [];

  function backtrack(start, path) {
    // Add current subset
    result.push([...path]);

    // Explore further elements
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1, path); // Note: i+1, not start+1
      path.pop(); // Backtrack
    }
  }

  backtrack(0, []);
  return result;
}
```

```java
// Time: O(n * 2^n) | Space: O(n) for recursion stack and path storage
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> path,
                          List<List<Integer>> result) {
        // Add current subset
        result.add(new ArrayList<>(path));

        // Explore further elements
        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);
            backtrack(nums, i + 1, path, result);  // Note: i+1, not start+1
            path.remove(path.size() - 1);  // Backtrack
        }
    }
}
```

</div>

The critical insight here is the `i + 1` parameter — it ensures we don't reuse elements and generate combinations instead of permutations. Yahoo interviewers will specifically check for this detail.

## How Yahoo Tests Depth-First Search vs Other Companies

Compared to other companies, Yahoo's DFS questions have distinct characteristics:

- **More object-oriented**: While Google might give you a 2D array grid, Yahoo often uses tree or graph node objects. This reflects their codebase structure.
- **Moderate difficulty**: Facebook and Google sometimes go for "trick" DFS problems with clever optimizations. Yahoo's problems are more straightforward but require careful implementation.
- **Practical applications**: You might get a problem framed as "traverse a directory structure" or "validate a configuration tree" rather than abstract graph theory.
- **Follow-up questions**: They often ask about iterative implementations or memory optimizations after you solve the recursive version.

The unique aspect is how they connect DFS to system design concepts. I've seen candidates get asked to extend a DFS solution to handle distributed systems constraints or discuss how it would work with very deep recursion stacks.

## Study Order

1. **Basic Tree Traversals** — Pre-order, in-order, post-order. Understand when each is appropriate. Start here because trees are simpler than general graphs and build recursion intuition.

2. **Path Problems in Trees** — Maximum depth, path sum, diameter. These introduce state management in DFS, which is fundamental for Yahoo's style.

3. **Backtracking Fundamentals** — Subsets, permutations, combination sum. Learn the template and when to use `start` vs `visited` arrays.

4. **Graph Traversal Basics** — Adjacency list vs matrix, visited sets, cycle detection. Graphs add the complexity of cycles, which trees don't have.

5. **Connected Components** — Number of islands, friend circles. This is where DFS shows its power for connectivity problems.

6. **Advanced State Tracking** — Problems like "Binary Tree Maximum Path Sum" or "Clone Graph" where you need to track multiple pieces of state or map between structures.

This order works because it builds complexity gradually. Each step introduces exactly one new concept while reinforcing previous ones.

## Recommended Practice Order

1. **LeetCode 104: Maximum Depth of Binary Tree** — Simplest DFS, establishes the pattern
2. **LeetCode 112: Path Sum** — Adds path tracking
3. **LeetCode 78: Subsets** — Introduces backtracking template
4. **LeetCode 200: Number of Islands** — Graph DFS on a grid
5. **LeetCode 133: Clone Graph** — Object mapping during traversal
6. **LeetCode 124: Binary Tree Maximum Path Sum** — Complex state management
7. **LeetCode 329: Longest Increasing Path in a Matrix** — DFS with memoization (bonus if you have time)

Solve these in sequence, and you'll cover 90% of the patterns Yahoo tests. For each problem, practice both recursive and iterative implementations, as Yahoo sometimes asks for iterative solutions to discuss stack overflow concerns.

Remember: Yahoo isn't testing whether you've memorized DFS. They're testing whether you understand when to use it, how to implement it cleanly, and how to adapt it to their practical problems. Focus on writing readable, well-structured code with clear variable names and comments about your approach.

[Practice Depth-First Search at Yahoo](/company/yahoo/depth-first-search)
