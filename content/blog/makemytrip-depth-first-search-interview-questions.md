---
title: "Depth-First Search Questions at MakeMyTrip: What to Expect"
description: "Prepare for Depth-First Search interview questions at MakeMyTrip — patterns, difficulty breakdown, and study tips."
date: "2031-04-17"
category: "dsa-patterns"
tags: ["makemytrip", "depth-first-search", "interview prep"]
---

Depth-First Search (DFS) is a core algorithmic technique for navigating graphs and trees, and its prevalence in MakeMyTrip's technical interviews signals what the company values. As a leading online travel platform, MakeMyTrip's systems handle complex, interconnected data: flight route networks, hotel and destination hierarchies, and user relationship graphs. DFS provides the fundamental logic for exploring these structures—whether finding available travel paths, validating itinerary sequences, or searching through categorical menus. Mastering DFS demonstrates you can think recursively and handle the nested, branching problems inherent in travel logistics and platform architecture.

## What to Expect — Types of Problems

MakeMyTrip's DFS questions typically fall into two categories. First are **tree-based problems**, often involving binary trees. You might be asked to find paths, calculate sums along specific branches, or validate properties. These questions test your understanding of recursion and tree traversal. The second category involves **graph traversal and pathfinding**. This is more directly applicable to travel systems, such as checking connectivity between cities (nodes) via flights (edges), finding all possible routes within a certain stop limit, or detecting cycles in dependency graphs. Expect the problems to have a slight twist that requires careful state management during the DFS, rather than just a standard traversal.

## How to Prepare — Study Tips with One Code Example

Focus on the recursive template for DFS and understand how to manage visited state to avoid infinite loops in graphs. Practice converting recursive solutions to iterative ones using a stack. Always articulate the time and space complexity of your solution, as interviewers will expect that analysis.

A key pattern is **Path Sum in a Binary Tree**, where you check for a root-to-leaf path that sums to a target. This combines traversal with state accumulation.

<div class="code-group">

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def hasPathSum(root, targetSum):
    if not root:
        return False
    # If at a leaf node, check if the remaining sum equals the node's value.
    if not root.left and not root.right:
        return targetSum == root.val
    # Otherwise, recursively check left and right subtrees with the updated target.
    remaining = targetSum - root.val
    return (hasPathSum(root.left, remaining) or
            hasPathSum(root.right, remaining))
```

```javascript
function hasPathSum(root, targetSum) {
  if (root === null) return false;
  // Leaf node check
  if (root.left === null && root.right === null) {
    return targetSum === root.val;
  }
  const remaining = targetSum - root.val;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}
```

```java
public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
}

public boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    // Check if it's a leaf node
    if (root.left == null && root.right == null) {
        return targetSum == root.val;
    }
    int remaining = targetSum - root.val;
    return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}
```

</div>

## Recommended Practice Order

Build your competency systematically. Start with **basic tree traversals** (pre-order, in-order, post-order) to internalize the recursive flow. Move to **fundamental tree problems** like finding maximum depth, checking for symmetry, and the path sum example above. Next, tackle **graph DFS** on adjacency lists, practicing cycle detection and counting connected components. Finally, solve **applied MakeMyTrip-style problems**, such as finding all itineraries from a source city or navigating a grid representing a destination map. This progression solidifies the pattern before you handle the nuanced versions likely in the interview.

[Practice Depth-First Search at MakeMyTrip](/company/makemytrip/depth-first-search)
