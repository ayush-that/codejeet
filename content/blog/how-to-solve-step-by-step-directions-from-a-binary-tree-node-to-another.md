---
title: "How to Solve Step-By-Step Directions From a Binary Tree Node to Another — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Step-By-Step Directions From a Binary Tree Node to Another. Medium difficulty, 56.4% acceptance rate. Topics: String, Tree, Depth-First Search, Binary Tree."
date: "2028-06-09"
category: "dsa-patterns"
tags:
  [
    "step-by-step-directions-from-a-binary-tree-node-to-another",
    "string",
    "tree",
    "depth-first-search",
    "medium",
  ]
---

# How to Solve Step-By-Step Directions From a Binary Tree Node to Another

You're given a binary tree and two node values. You need to find the shortest path directions from the start node to the destination node, where "U" means move to the parent, "L" means move to the left child, and "R" means move to the right child. The tricky part is that you can't directly navigate between arbitrary nodes—you need to find their lowest common ancestor first, then build the path from start to ancestor to destination.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this tree:

```
       5
     /   \
    1     2
   / \   / \
  3   4 6   7
```

Start node: 3 (value = 3)  
Destination node: 6 (value = 6)

**Step 1: Find paths from root to each node**

- Path from root(5) to start(3): 5 → 1 → 3 (directions: "L" then "L")
- Path from root(5) to dest(6): 5 → 2 → 6 (directions: "R" then "L")

**Step 2: Find where paths diverge**
Both paths start at root(5). They diverge immediately:

- Start path goes left ("L")
- Dest path goes right ("R")

**Step 3: Build the final path**
From start(3) to root(5): We need to go up 2 levels → "UU"
From root(5) to dest(6): Follow dest's path from divergence point → "RL"

Final path: "UU" + "RL" = "UURL"

Let's verify: From node 3, go up to 1 ("U"), up to 5 ("U"), right to 2 ("R"), left to 6 ("L").

## Brute Force Approach

A naive approach would be to:

1. Find the path from root to start node
2. Find the path from root to dest node
3. Compare the two paths to find their lowest common ancestor
4. Build the result: (up moves from start to LCA) + (down moves from LCA to dest)

The brute force implementation would involve:

- Performing DFS twice to find both paths
- Comparing the paths character by character to find divergence point
- Concatenating "U"s for the upward portion and the remaining dest path for downward

While this approach is conceptually correct, it's inefficient because:

- We store entire paths as strings, which can be O(n) space
- We traverse the tree multiple times
- String concatenation can be expensive if done naively

However, the real issue isn't time complexity—it's that this approach requires careful handling of the path comparison and building. The time complexity would still be O(n) since we visit each node once, but the implementation can be cleaner and more efficient.

## Optimized Approach

The key insight is that we don't need to store full paths or traverse the tree multiple times. We can:

1. Find the lowest common ancestor (LCA) of the two nodes
2. Find the path from LCA to start node (this will be all "U" moves)
3. Find the path from LCA to dest node (this will be "L"/"R" moves)
4. Concatenate them

But there's an even cleaner approach:

1. Find path from root to start (as string of "L"/"R")
2. Find path from root to dest (as string of "L"/"R")
3. Remove the common prefix (this represents the path to their LCA)
4. Replace all characters in the remaining start path with "U" (going up from start to LCA)
5. Append the remaining dest path (going down from LCA to dest)

This works because:

- The common prefix represents the path from root to their LCA
- From start to LCA, we always go up ("U")
- From LCA to dest, we follow the remaining portion of dest's path

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is number of nodes - we traverse the tree twice
# Space: O(h) where h is tree height for recursion stack, O(n) in worst case for skewed tree
class Solution:
    def getDirections(self, root, startValue: int, destValue: int) -> str:
        # Helper function to find path from current node to target value
        def find_path(node, target, path):
            # Base case: node is None
            if not node:
                return False

            # If we found the target, return True
            if node.val == target:
                return True

            # Try going left
            path.append('L')
            if find_path(node.left, target, path):
                return True
            path.pop()  # Backtrack if not found in left subtree

            # Try going right
            path.append('R')
            if find_path(node.right, target, path):
                return True
            path.pop()  # Backtrack if not found in right subtree

            # Target not found in this subtree
            return False

        # Step 1: Find path from root to start node
        start_path = []
        find_path(root, startValue, start_path)

        # Step 2: Find path from root to dest node
        dest_path = []
        find_path(root, destValue, dest_path)

        # Step 3: Find common prefix length (path to LCA)
        i = 0
        # Compare characters until paths diverge or one ends
        while i < len(start_path) and i < len(dest_path) and start_path[i] == dest_path[i]:
            i += 1

        # Step 4: Build the result
        # From start to LCA: all "U" moves (one for each remaining character in start_path)
        # From LCA to dest: remaining portion of dest_path
        result = 'U' * (len(start_path) - i) + ''.join(dest_path[i:])

        return result
```

```javascript
// Time: O(n) where n is number of nodes - we traverse the tree twice
// Space: O(h) where h is tree height for recursion stack, O(n) in worst case for skewed tree
var getDirections = function (root, startValue, destValue) {
  // Helper function to find path from current node to target value
  const findPath = (node, target, path) => {
    // Base case: node is null
    if (!node) {
      return false;
    }

    // If we found the target, return true
    if (node.val === target) {
      return true;
    }

    // Try going left
    path.push("L");
    if (findPath(node.left, target, path)) {
      return true;
    }
    path.pop(); // Backtrack if not found in left subtree

    // Try going right
    path.push("R");
    if (findPath(node.right, target, path)) {
      return true;
    }
    path.pop(); // Backtrack if not found in right subtree

    // Target not found in this subtree
    return false;
  };

  // Step 1: Find path from root to start node
  const startPath = [];
  findPath(root, startValue, startPath);

  // Step 2: Find path from root to dest node
  const destPath = [];
  findPath(root, destValue, destPath);

  // Step 3: Find common prefix length (path to LCA)
  let i = 0;
  // Compare characters until paths diverge or one ends
  while (i < startPath.length && i < destPath.length && startPath[i] === destPath[i]) {
    i++;
  }

  // Step 4: Build the result
  // From start to LCA: all "U" moves (one for each remaining character in startPath)
  // From LCA to dest: remaining portion of destPath
  const upMoves = "U".repeat(startPath.length - i);
  const downPath = destPath.slice(i).join("");

  return upMoves + downPath;
};
```

```java
// Time: O(n) where n is number of nodes - we traverse the tree twice
// Space: O(h) where h is tree height for recursion stack, O(n) in worst case for skewed tree
class Solution {
    public String getDirections(TreeNode root, int startValue, int destValue) {
        // Step 1: Find path from root to start node
        StringBuilder startPath = new StringBuilder();
        findPath(root, startValue, startPath);

        // Step 2: Find path from root to dest node
        StringBuilder destPath = new StringBuilder();
        findPath(root, destValue, destPath);

        // Step 3: Find common prefix length (path to LCA)
        int i = 0;
        // Compare characters until paths diverge or one ends
        while (i < startPath.length() && i < destPath.length()
               && startPath.charAt(i) == destPath.charAt(i)) {
            i++;
        }

        // Step 4: Build the result
        // From start to LCA: all "U" moves (one for each remaining character in startPath)
        // From LCA to dest: remaining portion of destPath
        StringBuilder result = new StringBuilder();
        // Add "U" for each character remaining in startPath after common prefix
        for (int j = i; j < startPath.length(); j++) {
            result.append('U');
        }
        // Add remaining destPath after common prefix
        result.append(destPath.substring(i));

        return result.toString();
    }

    // Helper function to find path from current node to target value
    private boolean findPath(TreeNode node, int target, StringBuilder path) {
        // Base case: node is null
        if (node == null) {
            return false;
        }

        // If we found the target, return true
        if (node.val == target) {
            return true;
        }

        // Try going left
        path.append('L');
        if (findPath(node.left, target, path)) {
            return true;
        }
        path.deleteCharAt(path.length() - 1);  // Backtrack if not found in left subtree

        // Try going right
        path.append('R');
        if (findPath(node.right, target, path)) {
            return true;
        }
        path.deleteCharAt(path.length() - 1);  // Backtrack if not found in right subtree

        // Target not found in this subtree
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We perform two DFS traversals to find paths to start and destination nodes
- Each traversal visits each node at most once
- The path comparison takes O(min(path1_length, path2_length)) which is O(n) in worst case
- Overall linear time in number of nodes

**Space Complexity: O(h) for recursion stack, O(n) for paths in worst case**

- Recursion stack uses O(h) where h is tree height
- In balanced tree: O(log n)
- In skewed tree: O(n)
- We store two paths which could be O(n) each in worst case (skewed tree)
- Overall O(n) space in worst case

## Common Mistakes

1. **Forgetting to backtrack in DFS**: When searching for a path, if you don't pop/backtrack when a path doesn't lead to the target, you'll accumulate incorrect paths. Always clean up after exploring a subtree.

2. **Not handling the case where start is ancestor of dest (or vice versa)**: The algorithm handles this correctly because when one path is a prefix of the other, the result will be either all "U"s (if going from deeper node to shallower) or just the remaining path (if going from shallower to deeper).

3. **Using BFS instead of DFS for path finding**: While BFS finds shortest path from root to node, it doesn't preserve the actual path directions easily. DFS with backtracking is more natural for recording paths.

4. **Incorrect string building in Java**: Java's StringBuilder is mutable, so when passing it to recursive calls, modifications persist. This is correct for our use case, but candidates sometimes create new StringBuilders at each call, losing the path.

## When You'll See This Pattern

This problem combines several fundamental tree patterns:

1. **Path finding in trees** (similar to Binary Tree Paths): Finding all paths from root to leaves, or specific paths between nodes.

2. **Lowest Common Ancestor (LCA)** problems: The common prefix of two root-to-node paths gives you the path to their LCA. This is a clever way to find LCA without explicitly computing it.

3. **Tree traversal with state tracking**: The backtracking approach to record paths is used in many tree problems like Path Sum II, where you need to record all paths that sum to a target.

Related problems that use similar techniques:

- **Path Sum II**: Find all root-to-leaf paths where sum equals target (uses similar backtracking)
- **Lowest Common Ancestor of a Binary Tree**: Find the LCA of two nodes (directly related to finding common path prefix)
- **Binary Tree Paths**: Get all root-to-leaf paths as strings (similar path recording)

## Key Takeaways

1. **Path prefix reveals LCA**: The common prefix of two root-to-node paths is exactly the path to their lowest common ancestor. This is a powerful insight that avoids explicit LCA computation.

2. **Backtracking is natural for path recording**: When you need to record paths in trees, DFS with backtracking (push before recursion, pop after) is the cleanest approach.

3. **Transform the problem**: Instead of thinking about navigating directly between nodes, transform it into: go up from start to LCA, then down from LCA to dest. This decomposition makes the problem much simpler.

Related problems: [Path Sum II](/problem/path-sum-ii), [Lowest Common Ancestor of a Binary Tree](/problem/lowest-common-ancestor-of-a-binary-tree), [Binary Tree Paths](/problem/binary-tree-paths)
