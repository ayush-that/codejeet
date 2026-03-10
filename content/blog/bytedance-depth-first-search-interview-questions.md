---
title: "Depth-First Search Questions at ByteDance: What to Expect"
description: "Prepare for Depth-First Search interview questions at ByteDance — patterns, difficulty breakdown, and study tips."
date: "2029-01-15"
category: "dsa-patterns"
tags: ["bytedance", "depth-first-search", "interview prep"]
---

# Depth-First Search Questions at ByteDance: What to Expect

ByteDance's technical interviews have a distinctive flavor. With 7 Depth-First Search (DFS) questions out of their 64 total tagged problems on LeetCode, DFS represents about 11% of their algorithmic focus. But raw numbers don't tell the full story. In actual interviews, DFS appears even more frequently because it's not just a standalone topic—it's a fundamental building block for tree/graph problems, backtracking, and even some dynamic programming scenarios.

Here's what you need to know: ByteDance doesn't just test whether you can implement DFS. They test whether you can _adapt_ DFS to solve complex, real-world adjacent problems. Their questions often involve multiple transformations: converting a problem into a graph representation, then applying DFS with additional state tracking, then optimizing for performance constraints. This reflects their engineering culture—building scalable systems that handle graph-like data structures (social networks, recommendation graphs, content trees) efficiently.

## Specific Patterns ByteDance Favors

ByteDance's DFS problems cluster around three distinct patterns:

1. **Graph Traversal with State Tracking** - Not just "visit all nodes," but "visit nodes while tracking path-specific state." Problems like **Number of Islands (#200)** appear in their simplest form, but ByteDance extends this pattern to track visited states, path conditions, or multiple simultaneous traversals.

2. **Backtracking with Pruning** - Their problems frequently involve exploring all possibilities but with intelligent early termination. **Word Search (#79)** is a classic example, but ByteDance variations add constraints like "must use exactly k cells" or "cannot revisit cells with certain properties."

3. **Tree DFS with Return Values** - They love tree problems where each recursive call returns structured information that parent nodes combine. This pattern appears in **Binary Tree Maximum Path Sum (#124)** and similar problems where you need to compute something that might span across subtrees.

What's notably _absent_ is pure theoretical graph algorithm implementation. You won't be asked to implement Tarjan's algorithm from scratch. Instead, they test applied DFS on problems that feel like real engineering challenges.

## How to Prepare

The key insight for ByteDance DFS preparation is mastering state management within the recursion. Let's examine the most critical pattern: DFS with multiple return values.

<div class="code-group">

```python
# Pattern: Tree DFS returning multiple values
# Problem type: Find maximum path sum where path doesn't need to go through root
# Time: O(n) | Space: O(h) where h is tree height

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def max_path_sum(root):
    """
    Returns the maximum path sum where path can start and end anywhere
    """
    max_sum = float('-inf')

    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0

        # Post-order traversal: process children first
        left_gain = max(dfs(node.left), 0)  # Ignore negative contributions
        right_gain = max(dfs(node.right), 0)

        # Current path sum if we use this node as "root" of the path
        current_path_sum = node.val + left_gain + right_gain

        # Update global maximum
        max_sum = max(max_sum, current_path_sum)

        # Return the maximum gain if we continue the path upward
        return node.val + max(left_gain, right_gain)

    dfs(root)
    return max_sum
```

```javascript
// Pattern: Tree DFS returning multiple values
// Time: O(n) | Space: O(h) where h is tree height

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

    // Path sum with current node as "root"
    const currentPathSum = node.val + leftGain + rightGain;

    // Update global maximum
    maxSum = Math.max(maxSum, currentPathSum);

    // Return maximum gain for continuing path upward
    return node.val + Math.max(leftGain, rightGain);
  }

  dfs(root);
  return maxSum;
}
```

```java
// Pattern: Tree DFS returning multiple values
// Time: O(n) | Space: O(h) where h is tree height

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
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

        // Path sum with current node as "root"
        int currentPathSum = node.val + leftGain + rightGain;

        // Update global maximum
        maxSum = Math.max(maxSum, currentPathSum);

        // Return maximum gain for continuing path upward
        return node.val + Math.max(leftGain, rightGain);
    }
}
```

</div>

The pattern above demonstrates ByteDance's favorite twist: the recursive function returns one value (maximum gain for continuing the path), but also updates a global/mutable state (the overall maximum path sum). This pattern appears in at least 3 of their tagged DFS problems.

Another essential pattern is iterative DFS with explicit stack for when recursion depth might be an issue:

<div class="code-group">

```python
# Pattern: Iterative DFS with explicit stack
# Useful for problems with deep recursion or when you need more control
# Time: O(n) | Space: O(n)

def iterative_dfs(root):
    if not root:
        return []

    result = []
    stack = [(root, False)]  # (node, visited) tuple

    while stack:
        node, visited = stack.pop()

        if visited:
            result.append(node.val)  # Process after children (post-order)
        else:
            # Reverse order for pre-order: right then left
            stack.append((node, True))  # Mark for processing

            if node.right:
                stack.append((node.right, False))
            if node.left:
                stack.append((node.left, False))

    return result
```

```javascript
// Pattern: Iterative DFS with explicit stack
// Time: O(n) | Space: O(n)

function iterativeDFS(root) {
  if (!root) return [];

  const result = [];
  const stack = [[root, false]]; // [node, visited] array

  while (stack.length > 0) {
    const [node, visited] = stack.pop();

    if (visited) {
      result.push(node.val); // Post-order processing
    } else {
      // Mark for processing after children
      stack.push([node, true]);

      // Add children (right first for pre-order)
      if (node.right) stack.push([node.right, false]);
      if (node.left) stack.push([node.left, false]);
    }
  }

  return result;
}
```

```java
// Pattern: Iterative DFS with explicit stack
// Time: O(n) | Space: O(n)

public List<Integer> iterativeDFS(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;

    Deque<Object[]> stack = new ArrayDeque<>();
    stack.push(new Object[]{root, false});

    while (!stack.isEmpty()) {
        Object[] item = stack.pop();
        TreeNode node = (TreeNode) item[0];
        boolean visited = (boolean) item[1];

        if (visited) {
            result.add(node.val);  // Post-order processing
        } else {
            // Mark for processing
            stack.push(new Object[]{node, true});

            // Add children
            if (node.right != null) {
                stack.push(new Object[]{node.right, false});
            }
            if (node.left != null) {
                stack.push(new Object[]{node.left, false});
            }
        }
    }

    return result;
}
```

</div>

## How ByteDance Tests Depth-First Search vs Other Companies

ByteDance's DFS questions differ from other companies in three key ways:

1. **Integration with Real Data Structures** - While Google might ask pure algorithmic DFS, ByteDance often embeds DFS within problems involving nested lists, serialized trees, or adjacency lists that represent actual product data structures.

2. **Performance Constraints Matter Earlier** - At Facebook, you might get away with a brute-force DFS solution initially. ByteDance interviewers often push for optimization from the start, asking about time/space complexity before you even start coding.

3. **Follow-up Questions Change the Problem** - A common ByteDance pattern: solve a DFS problem, then "now what if the graph is too large for memory?" or "how would this work in a distributed system?" They test whether you understand the _implications_ of DFS, not just the implementation.

Compared to Amazon (which favors BFS for shortest path problems) or Microsoft (which mixes DFS with more theoretical graph questions), ByteDance sits in the middle—practical but with algorithmic depth.

## Study Order

Master DFS for ByteDance by following this progression:

1. **Basic Tree Traversals** - Pre-order, in-order, post-order. Understand recursion vs iteration. This is foundational—you can't build complex DFS without this.
2. **Simple Graph Traversal** - Number of Islands (#200) and Flood Fill (#733). Learn to mark visited nodes and handle boundaries.

3. **Backtracking Fundamentals** - Subsets (#78), Permutations (#46). Understand the "choose-explore-unchoose" pattern.

4. **Path Problems in Trees** - Binary Tree Maximum Path Sum (#124), Path Sum (#112). Learn to pass information up and down the recursion.

5. **Graph DFS with Cycle Detection** - Course Schedule (#207). Understand white-gray-black marking or visited/visiting states.

6. **Complex Backtracking with Pruning** - N-Queens (#51), Word Search (#79). Learn to eliminate branches early.

7. **DFS in Disguise** - Problems that don't look like DFS but are: Decode String (#394), Remove Invalid Parentheses (#301).

This order works because each step builds on the previous one. You can't optimize backtracking with pruning if you don't understand basic backtracking. You can't solve complex tree path problems if you're still shaky on tree traversals.

## Recommended Practice Order

Solve these problems in sequence for ByteDance preparation:

1. **Maximum Depth of Binary Tree (#104)** - The simplest possible DFS. Get comfortable with the recursive pattern.
2. **Number of Islands (#200)** - Transition from trees to graphs. Learn grid traversal.

3. **Binary Tree Maximum Path Sum (#124)** - Critical ByteDance pattern. Master returning values while tracking global state.

4. **Word Search (#79)** - Backtracking with pruning. Learn to mark visited cells temporarily.

5. **Course Schedule (#207)** - DFS with cycle detection. Understand state tracking beyond simple visited sets.

6. **Remove Invalid Parentheses (#301)** - Advanced backtracking with pruning. This appears in ByteDance interviews.

7. **Decode String (#394)** - DFS on a serialized structure. Shows how DFS applies to non-graph problems.

After these seven, you'll have covered every DFS pattern ByteDance tests. The key is not just solving them, but understanding _why_ DFS works for each problem and how you'd explain the tradeoffs versus BFS or other approaches.

[Practice Depth-First Search at ByteDance](/company/bytedance/depth-first-search)
