---
title: "How to Solve Binary Tree Cameras — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Binary Tree Cameras. Hard difficulty, 47.6% acceptance rate. Topics: Dynamic Programming, Tree, Depth-First Search, Binary Tree."
date: "2026-03-22"
category: "dsa-patterns"
tags: ["binary-tree-cameras", "dynamic-programming", "tree", "depth-first-search", "hard"]
---

# How to Solve Binary Tree Cameras

You need to place cameras on nodes of a binary tree where each camera covers the node itself, its parent, and its children. The goal is to find the minimum number of cameras needed to cover all nodes. What makes this problem tricky is that cameras have overlapping coverage, and placing them requires careful consideration of parent-child relationships to avoid waste.

## Visual Walkthrough

Let's trace through a small example: `[0,0,null,0,0]` (a root with two children, both of which have no children).

```
    0
   / \
  0   0
```

**Step 1:** Start from the leaves. A camera at a leaf only covers itself and its parent. Better to place the camera at the leaf's parent to cover more nodes.

**Step 2:** The left child (0) is a leaf. Its parent (root) would be a good camera location.

**Step 3:** If we place a camera at the root, it covers: root, left child, and right child. All nodes are covered with just 1 camera.

**Step 4:** Check: Could we do better with 0 cameras? No, nodes must be covered. Could we do worse with 2 cameras? Yes, but we want minimum.

Thus, the answer is 1 camera.

Now consider `[0,0,null,0,null,0,null,null,0]`:

```
    0
   /
  0
 /
0
 \
  0
```

**Step 1:** The bottom-most node (0) is a leaf. Its parent (the 0 above it) should get a camera.

**Step 2:** That camera covers: itself, its parent (the 0 above), and its child (the leaf). Now the leaf and its parent are covered.

**Step 3:** Move up: The grandparent now has one child covered by camera below. It still needs coverage for itself.

**Step 4:** Continue this reasoning upward, placing cameras only when necessary to cover uncovered children or when forced by the root.

This "bottom-up" reasoning is key: we need to decide camera placement based on children's states.

## Brute Force Approach

A naive brute force would try all possible subsets of nodes to place cameras, check if each placement covers all nodes, and track the minimum. For a tree with n nodes, there are 2^n possible subsets. For each subset, we'd need to traverse the tree to verify coverage, taking O(n) time. This gives O(n \* 2^n) time complexity, which is infeasible for n > 20.

Even with optimization like pruning invalid placements early, the state space is too large. The problem's structure suggests a more efficient approach: since camera coverage depends on parent-child relationships, we can use tree traversal with state tracking.

## Optimized Approach

The key insight is to use **post-order DFS** with state management. Each node can be in one of three states:

1. **0: UNCOVERED** - Node needs a camera (not covered by child or parent)
2. **1: COVERED** - Node is covered by a child's camera (no camera here)
3. **2: HAS_CAMERA** - Node has a camera

We traverse from leaves to root (post-order). For each node:

- If any child is UNCOVERED (0), this node MUST have a camera (state 2)
- Else if any child HAS_CAMERA (2), this node is COVERED (state 1)
- Else this node is UNCOVERED (0) and will need coverage from its parent

Special case: The root may end up UNCOVERED, requiring an extra camera.

This greedy approach works because:

1. Cameras at higher levels cover more nodes (parent + children)
2. We only place cameras when forced by uncovered children
3. Post-order ensures we know children's states before deciding parent's state

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - We visit each node once
# Space: O(h) - Recursion stack height, where h is tree height
class Solution:
    def minCameraCover(self, root):
        # Define the three states as constants for clarity
        UNCOVERED = 0    # Node needs coverage
        COVERED = 1      # Node is covered by child's camera
        HAS_CAMERA = 2   # Node has a camera

        self.cameras = 0  # Track total cameras placed

        def dfs(node):
            # Base case: null nodes are considered "covered"
            # This simplifies logic for leaf nodes
            if not node:
                return COVERED

            # Post-order traversal: process children first
            left_state = dfs(node.left)
            right_state = dfs(node.right)

            # If any child is UNCOVERED, we MUST place a camera here
            # This is the greedy choice: cover the child from parent
            if left_state == UNCOVERED or right_state == UNCOVERED:
                self.cameras += 1
                return HAS_CAMERA

            # If any child HAS_CAMERA, this node is covered by it
            # No need to place camera here
            if left_state == HAS_CAMERA or right_state == HAS_CAMERA:
                return COVERED

            # Otherwise, this node is UNCOVERED
            # Its parent will need to cover it (or it'll be root case)
            return UNCOVERED

        # Start DFS from root
        root_state = dfs(root)

        # If root ends up UNCOVERED, it needs its own camera
        if root_state == UNCOVERED:
            self.cameras += 1

        return self.cameras
```

```javascript
// Time: O(n) - We visit each node once
// Space: O(h) - Recursion stack height, where h is tree height
var minCameraCover = function (root) {
  // Define state constants
  const UNCOVERED = 0; // Node needs coverage
  const COVERED = 1; // Node is covered by child's camera
  const HAS_CAMERA = 2; // Node has a camera

  let cameras = 0; // Track total cameras placed

  const dfs = (node) => {
    // Base case: null nodes are considered "covered"
    if (!node) {
      return COVERED;
    }

    // Post-order traversal: process children first
    const leftState = dfs(node.left);
    const rightState = dfs(node.right);

    // If any child is UNCOVERED, we MUST place a camera here
    // This covers the child from its parent
    if (leftState === UNCOVERED || rightState === UNCOVERED) {
      cameras++;
      return HAS_CAMERA;
    }

    // If any child HAS_CAMERA, this node is covered by it
    // No need to place camera here
    if (leftState === HAS_CAMERA || rightState === HAS_CAMERA) {
      return COVERED;
    }

    // Otherwise, this node is UNCOVERED
    // Its parent will need to cover it
    return UNCOVERED;
  };

  // Start DFS from root
  const rootState = dfs(root);

  // If root ends up UNCOVERED, it needs its own camera
  if (rootState === UNCOVERED) {
    cameras++;
  }

  return cameras;
};
```

```java
// Time: O(n) - We visit each node once
// Space: O(h) - Recursion stack height, where h is tree height
class Solution {
    private int cameras = 0;

    // Define state constants
    private static final int UNCOVERED = 0;    // Node needs coverage
    private static final int COVERED = 1;      // Node is covered by child's camera
    private static final int HAS_CAMERA = 2;   // Node has a camera

    public int minCameraCover(TreeNode root) {
        // Start DFS from root
        int rootState = dfs(root);

        // If root ends up UNCOVERED, it needs its own camera
        if (rootState == UNCOVERED) {
            cameras++;
        }

        return cameras;
    }

    private int dfs(TreeNode node) {
        // Base case: null nodes are considered "covered"
        if (node == null) {
            return COVERED;
        }

        // Post-order traversal: process children first
        int leftState = dfs(node.left);
        int rightState = dfs(node.right);

        // If any child is UNCOVERED, we MUST place a camera here
        // This covers the child from its parent
        if (leftState == UNCOVERED || rightState == UNCOVERED) {
            cameras++;
            return HAS_CAMERA;
        }

        // If any child HAS_CAMERA, this node is covered by it
        // No need to place camera here
        if (leftState == HAS_CAMERA || rightState == HAS_CAMERA) {
            return COVERED;
        }

        // Otherwise, this node is UNCOVERED
        // Its parent will need to cover it
        return UNCOVERED;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of nodes. We perform a single post-order traversal, visiting each node exactly once.

**Space Complexity:** O(h) where h is the height of the tree. This is the recursion stack space. In the worst case (skewed tree), h = n, giving O(n). In a balanced tree, h = log n.

The space complexity could be reduced to O(1) using Morris traversal or iterative DFS with explicit stack, but the recursive solution is clearer for interviews.

## Common Mistakes

1. **Placing cameras at leaves instead of their parents**: A camera at a leaf only covers itself and its parent. A camera at the leaf's parent covers the parent, the leaf, and the parent's other child (if any). Always prefer higher placement when possible.

2. **Forgetting the root edge case**: If the root ends up UNCOVERED after DFS, it needs its own camera. Candidates often miss this final check.

3. **Incorrect state definitions**: Using binary states (covered/not covered) isn't enough. We need three states to distinguish between "covered by child" and "has camera". The HAS_CAMERA state is crucial because it affects the parent's coverage.

4. **Wrong traversal order**: Using pre-order or in-order won't work because we need children's states before deciding on parent. Post-order (children first) is essential.

## When You'll See This Pattern

This "tree DP with state machine" pattern appears in many tree optimization problems:

1. **House Robber III** (LeetCode 337): Similar state decisions (rob/don't rob) with parent-child constraints.

2. **Distribute Coins in Binary Tree** (LeetCode 979): Uses post-order traversal to balance coins, tracking excess/deficit at each node.

3. **Binary Tree Maximum Path Sum** (LeetCode 124): Combines local and global states during tree traversal.

The common theme: problems where each node's optimal decision depends on its children's states, and we need to propagate information upward.

## Key Takeaways

1. **Post-order traversal is key for bottom-up decisions**: When a node's optimal state depends on its children's states, process children first (post-order).

2. **Define clear states**: For tree DP problems, explicitly define what each state means. Here, three states were needed to capture all possibilities.

3. **Greedy can work with proper ordering**: This solution is greedy (place camera only when forced), but it's correct because of the bottom-up approach. The "force" comes from uncovered children.

Related problems: [Distribute Coins in Binary Tree](/problem/distribute-coins-in-binary-tree), [Choose Edges to Maximize Score in a Tree](/problem/choose-edges-to-maximize-score-in-a-tree)
