---
title: "How to Solve Lowest Common Ancestor of a Binary Search Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lowest Common Ancestor of a Binary Search Tree. Medium difficulty, 70.1% acceptance rate. Topics: Tree, Depth-First Search, Binary Search Tree, Binary Tree."
date: "2026-05-14"
category: "dsa-patterns"
tags:
  [
    "lowest-common-ancestor-of-a-binary-search-tree",
    "tree",
    "depth-first-search",
    "binary-search-tree",
    "medium",
  ]
---

# How to Solve Lowest Common Ancestor of a Binary Search Tree

Finding the lowest common ancestor in a binary search tree might seem straightforward, but it's a perfect example of how understanding data structure properties can transform a complex problem into an elegant solution. The tricky part is recognizing that a BST's ordered nature gives us a shortcut that doesn't exist in regular binary trees.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this BST:

```
        6
       / \
      2   8
     / \ / \
    0  4 7  9
      / \
     3   5
```

We want to find the LCA of nodes with values 2 and 8.

**Step 1:** Start at the root (6). Compare 6 with both target values:

- 2 < 6 and 8 > 6 → The targets are on opposite sides of 6
- When targets are on opposite sides, the current node is their LCA
- **Result:** LCA is 6

Now let's find the LCA of nodes 2 and 4:

**Step 1:** Start at root (6). Compare:

- 2 < 6 and 4 < 6 → Both are in the left subtree
- Move to left child (2)

**Step 2:** At node 2. Compare:

- 2 = 2 and 4 > 2 → One is the current node, one is in its right subtree
- When one node is the current node, it's the LCA
- **Result:** LCA is 2

Finally, let's find the LCA of nodes 3 and 5:

**Step 1:** Start at root (6). Compare:

- 3 < 6 and 5 < 6 → Both in left subtree
- Move to left child (2)

**Step 2:** At node 2. Compare:

- 3 > 2 and 5 > 2 → Both in right subtree
- Move to right child (4)

**Step 3:** At node 4. Compare:

- 3 < 4 and 5 > 4 → Targets are on opposite sides
- **Result:** LCA is 4

The pattern emerges: we traverse from root downward, and the first node where p and q diverge into different subtrees (or one equals the current node) is their LCA.

## Brute Force Approach

A naive approach would be to find paths from root to both nodes, then compare the paths to find their last common node. Here's how that works:

1. Find the path from root to node p
2. Find the path from root to node q
3. Compare both paths element by element
4. The last common node in both paths is the LCA

While this approach works (and is actually optimal for regular binary trees), it's unnecessarily complex for BSTs. We need to store both paths, which requires O(h) space where h is the tree height. More importantly, we're not leveraging the BST property that could give us a more elegant O(1) space solution.

The brute force would look like this:

<div class="code-group">

```python
# Time: O(h) | Space: O(h) - where h is tree height
def lowestCommonAncestorBruteForce(root, p, q):
    # Helper to find path from root to target
    def find_path(node, target):
        path = []
        while node:
            path.append(node)
            if target.val < node.val:
                node = node.left
            elif target.val > node.val:
                node = node.right
            else:
                break
        return path

    # Get paths to both nodes
    path_p = find_path(root, p)
    path_q = find_path(root, q)

    # Find last common node in both paths
    lca = None
    for i in range(min(len(path_p), len(path_q))):
        if path_p[i] == path_q[i]:
            lca = path_p[i]
        else:
            break

    return lca
```

```javascript
// Time: O(h) | Space: O(h) - where h is tree height
function lowestCommonAncestorBruteForce(root, p, q) {
  // Helper to find path from root to target
  function findPath(node, target) {
    const path = [];
    while (node) {
      path.push(node);
      if (target.val < node.val) {
        node = node.left;
      } else if (target.val > node.val) {
        node = node.right;
      } else {
        break;
      }
    }
    return path;
  }

  // Get paths to both nodes
  const pathP = findPath(root, p);
  const pathQ = findPath(root, q);

  // Find last common node in both paths
  let lca = null;
  for (let i = 0; i < Math.min(pathP.length, pathQ.length); i++) {
    if (pathP[i] === pathQ[i]) {
      lca = pathP[i];
    } else {
      break;
    }
  }

  return lca;
}
```

```java
// Time: O(h) | Space: O(h) - where h is tree height
public TreeNode lowestCommonAncestorBruteForce(TreeNode root, TreeNode p, TreeNode q) {
    // Helper to find path from root to target
    List<TreeNode> findPath(TreeNode node, TreeNode target) {
        List<TreeNode> path = new ArrayList<>();
        while (node != null) {
            path.add(node);
            if (target.val < node.val) {
                node = node.left;
            } else if (target.val > node.val) {
                node = node.right;
            } else {
                break;
            }
        }
        return path;
    }

    // Get paths to both nodes
    List<TreeNode> pathP = findPath(root, p);
    List<TreeNode> pathQ = findPath(root, q);

    // Find last common node in both paths
    TreeNode lca = null;
    int minLength = Math.min(pathP.size(), pathQ.size());
    for (int i = 0; i < minLength; i++) {
        if (pathP.get(i) == pathQ.get(i)) {
            lca = pathP.get(i);
        } else {
            break;
        }
    }

    return lca;
}
```

</div>

This works, but we can do better by recognizing the BST property.

## Optimized Approach

The key insight comes from understanding BST properties: for any node, all values in its left subtree are smaller, and all values in its right subtree are larger. This ordering gives us a powerful way to find the LCA without storing paths.

**The Core Insight:** The LCA of two nodes in a BST is the first node where the two target values diverge into different subtrees. More formally:

- If both p and q are less than current node → LCA is in left subtree
- If both p and q are greater than current node → LCA is in right subtree
- Otherwise (one is ≤ current node and the other is ≥ current node) → current node is LCA

This works because:

1. If both nodes are on the same side of current node, their LCA must be deeper in that subtree
2. If they're on opposite sides (or one equals current node), they can't have a common ancestor deeper than current node

We can implement this with a simple iterative traversal from root downward, making decisions at each step based on the values.

## Optimal Solution

Here's the optimal solution that leverages BST properties for O(1) space (excluding recursion stack if using recursion):

<div class="code-group">

```python
# Time: O(h) | Space: O(1) for iterative, O(h) for recursive call stack
# where h is the height of the tree (O(log n) for balanced BST, O(n) for skewed)
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # Start from the root node
        current = root

        # Traverse the tree until we find the LCA
        while current:
            # If both p and q are greater than current node,
            # LCA must be in the right subtree
            if p.val > current.val and q.val > current.val:
                current = current.right

            # If both p and q are less than current node,
            # LCA must be in the left subtree
            elif p.val < current.val and q.val < current.val:
                current = current.left

            # Otherwise, we've found the split point or one of the nodes
            # This means current is the LCA
            else:
                return current

        # This line should never be reached if p and q exist in the tree
        return None

# Recursive alternative (same time complexity, O(h) space for call stack)
def lowestCommonAncestorRecursive(root, p, q):
    # Base case: if root is None, return None
    if not root:
        return None

    # If both nodes are in right subtree, search right
    if p.val > root.val and q.val > root.val:
        return lowestCommonAncestorRecursive(root.right, p, q)

    # If both nodes are in left subtree, search left
    if p.val < root.val and q.val < root.val:
        return lowestCommonAncestorRecursive(root.left, p, q)

    # Otherwise, current node is the LCA
    # This covers three cases:
    # 1. p and q are on opposite sides of root
    # 2. root is equal to p
    # 3. root is equal to q
    return root
```

```javascript
// Time: O(h) | Space: O(1) for iterative, O(h) for recursive call stack
// where h is the height of the tree (O(log n) for balanced BST, O(n) for skewed)
var lowestCommonAncestor = function (root, p, q) {
  // Start from the root node
  let current = root;

  // Traverse the tree until we find the LCA
  while (current !== null) {
    // If both p and q are greater than current node,
    // LCA must be in the right subtree
    if (p.val > current.val && q.val > current.val) {
      current = current.right;
    }
    // If both p and q are less than current node,
    // LCA must be in the left subtree
    else if (p.val < current.val && q.val < current.val) {
      current = current.left;
    }
    // Otherwise, we've found the split point or one of the nodes
    // This means current is the LCA
    else {
      return current;
    }
  }

  // This line should never be reached if p and q exist in the tree
  return null;
};

// Recursive alternative (same time complexity, O(h) space for call stack)
function lowestCommonAncestorRecursive(root, p, q) {
  // Base case: if root is null, return null
  if (root === null) {
    return null;
  }

  // If both nodes are in right subtree, search right
  if (p.val > root.val && q.val > root.val) {
    return lowestCommonAncestorRecursive(root.right, p, q);
  }

  // If both nodes are in left subtree, search left
  if (p.val < root.val && q.val < root.val) {
    return lowestCommonAncestorRecursive(root.left, p, q);
  }

  // Otherwise, current node is the LCA
  // This covers three cases:
  // 1. p and q are on opposite sides of root
  // 2. root is equal to p
  // 3. root is equal to q
  return root;
}
```

```java
// Time: O(h) | Space: O(1) for iterative, O(h) for recursive call stack
// where h is the height of the tree (O(log n) for balanced BST, O(n) for skewed)
class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Start from the root node
        TreeNode current = root;

        // Traverse the tree until we find the LCA
        while (current != null) {
            // If both p and q are greater than current node,
            // LCA must be in the right subtree
            if (p.val > current.val && q.val > current.val) {
                current = current.right;
            }
            // If both p and q are less than current node,
            // LCA must be in the left subtree
            else if (p.val < current.val && q.val < current.val) {
                current = current.left;
            }
            // Otherwise, we've found the split point or one of the nodes
            // This means current is the LCA
            else {
                return current;
            }
        }

        // This line should never be reached if p and q exist in the tree
        return null;
    }
}

// Recursive alternative (same time complexity, O(h) space for call stack)
class SolutionRecursive {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Base case: if root is null, return null
        if (root == null) {
            return null;
        }

        // If both nodes are in right subtree, search right
        if (p.val > root.val && q.val > root.val) {
            return lowestCommonAncestor(root.right, p, q);
        }

        // If both nodes are in left subtree, search left
        if (p.val < root.val && q.val < root.val) {
            return lowestCommonAncestor(root.left, p, q);
        }

        // Otherwise, current node is the LCA
        // This covers three cases:
        // 1. p and q are on opposite sides of root
        // 2. root is equal to p
        // 3. root is equal to q
        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(h), where h is the height of the tree

- In a balanced BST: h = O(log n), so time is O(log n)
- In a skewed BST (worst case): h = O(n), so time is O(n)
- We traverse from root to LCA, which takes at most h steps

**Space Complexity:**

- Iterative solution: O(1) - we only use a constant amount of extra space
- Recursive solution: O(h) - for the recursion call stack depth

The key advantage over the brute force path-finding approach is the O(1) space for the iterative version, which is possible because we leverage the BST ordering property to make decisions without storing paths.

## Common Mistakes

1. **Forgetting that p or q could be the LCA:** Some candidates only check for the "split point" case and miss that if current equals p or q, it's automatically the LCA. Our solution handles this because the "else" case catches it.

2. **Using the wrong comparison operators:** Using ≤ or ≥ instead of < and > can cause infinite loops or incorrect results. For example, if you use `p.val >= current.val`, you might not move to a child when you should.

3. **Assuming the tree is balanced:** Candidates sometimes say "O(log n) time" without qualifying that it's only for balanced BSTs. Always mention both best and worst cases.

4. **Not handling null/edge cases properly:** While the problem guarantees p and q exist in the tree, in interviews you should mention how you'd handle cases where they might not exist (return null or throw exception).

5. **Overcomplicating with parent pointers or path storage:** Some candidates try to use techniques from the regular binary tree LCA problem (like storing paths or using parent pointers), not realizing the BST property gives a simpler solution.

## When You'll See This Pattern

This "BST property traversal" pattern appears in many tree problems where you can make decisions at each node based on values:

1. **Search in a BST (LeetCode 700)** - Similar decision process: go left if target < current, right if target > current
2. **Insert into a BST (LeetCode 701)** - Find the correct position using the same value comparisons
3. **Delete Node in a BST (LeetCode 450)** - Find the node first using BST traversal, then handle deletion
4. **Closest Binary Search Tree Value (LeetCode 270)** - Traverse while keeping track of closest value

The core idea is leveraging the BST property (left < node < right) to eliminate half the search space at each step, similar to binary search in arrays.

## Key Takeaways

1. **Always check data structure properties first:** The BST's ordered nature is what makes this problem simpler than its binary tree counterpart. Recognizing this early saves time and leads to better solutions.

2. **The LCA in a BST is the first node where targets diverge:** This simple rule (both less → go left, both greater → go right, otherwise → found LCA) is the key insight.

3. **Iterative vs recursive trade-offs:** The iterative solution gives O(1) space, while recursive is more elegant but uses O(h) stack space. In interviews, mention both and explain your choice.

4. **This is essentially binary search on a tree:** The algorithm works because at each node, we can determine which subtree contains the answer, cutting the search space in half (in balanced trees).

Related problems: [Lowest Common Ancestor of a Binary Tree](/problem/lowest-common-ancestor-of-a-binary-tree), [Smallest Common Region](/problem/smallest-common-region), [Lowest Common Ancestor of a Binary Tree II](/problem/lowest-common-ancestor-of-a-binary-tree-ii)
