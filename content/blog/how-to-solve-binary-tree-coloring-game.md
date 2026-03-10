---
title: "How to Solve Binary Tree Coloring Game — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Binary Tree Coloring Game. Medium difficulty, 52.9% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-06-04"
category: "dsa-patterns"
tags: ["binary-tree-coloring-game", "tree", "depth-first-search", "binary-tree", "medium"]
---

# How to Solve Binary Tree Coloring Game

This problem presents a two-player game on a binary tree where players take turns coloring nodes. The first player colors a node red, then the second player colors a node blue, and they alternate turns. The winner is the player who colors more nodes in their color. The twist is that after the first player chooses their initial node, the second player must choose a node adjacent to an already colored node. This creates a strategic constraint that makes the problem interesting: the second player's choice essentially partitions the tree into three regions, and they can only claim one of them.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this tree with n=7 (odd):

```
        1
       / \
      2   3
     / \ / \
    4  5 6  7
```

Suppose the first player (red) chooses node 5 (x=5). Now the second player (blue) must choose a node adjacent to a colored node. The adjacent nodes to 5 are node 2 (its parent) and nodes 4 and 6 (its children, though 6 isn't directly connected to 5 in this tree - actually 5 only has parent 2, no children in this structure).

Actually, let me correct: In this tree structure, node 5 is a leaf with parent 2. So the adjacent nodes are just node 2.

After red chooses node 5, blue can choose:

- Node 2 (parent of 5)
- Any child of 5 (but 5 has no children)

Now here's the key insight: When blue chooses a node, they claim the entire connected component of uncolored nodes that contains their chosen node, separated from red's node by the edge between them. The tree gets partitioned into three regions relative to red's node x:

1. The left subtree of x
2. The right subtree of x
3. The rest of the tree (nodes above x)

Blue can choose to claim any one of these three regions by picking a node adjacent to x in that region. Once blue picks a node in a region, they get all nodes in that region because:

- All moves must be adjacent to already colored nodes
- After blue colors their first node in a region, red cannot enter that region because it's not adjacent to any red node
- Blue can then color all remaining nodes in that region on subsequent turns

So for our example with x=5:

- Region 1 (left subtree of 5): empty (5 has no left child)
- Region 2 (right subtree of 5): empty (5 has no right child)
- Region 3 (rest of tree): nodes 1, 2, 3, 4, 6, 7 (6 nodes)

If blue chooses node 2 (in region 3), blue gets all 6 nodes in region 3. Red only gets node 5. Blue wins 6-1.

The second player wins if they can claim a region with more than n/2 nodes. Since n is odd, "more than n/2" means at least (n+1)/2 nodes.

## Brute Force Approach

A naive approach might try to simulate the game for every possible first move by red and every possible response by blue. For each x (red's choice), we would:

1. Consider each of the three regions around x
2. For each region, check if blue choosing a node in that region would give blue more than n/2 nodes
3. If for some x, blue cannot win from any region, then red can win by choosing that x

The brute force simulation would be extremely inefficient. For each of n possible x values, we'd need to:

- Traverse the tree to find x (O(n))
- Calculate sizes of three regions (O(n) each)
- Check all possible blue moves within each region

This could lead to O(n³) complexity in worst case, which is far too slow for n up to 100 (and potentially more in interviews).

What makes the brute force insufficient is that it doesn't leverage the key insight: blue's best move is always to take the largest of the three regions. We don't need to check all possible blue moves within a region - if blue chooses any node in a region, they get the entire region. So for each x, we only need to check if the largest region has more than n/2 nodes.

## Optimized Approach

The key insight is that this is not really a game theory problem requiring simulation. It's a combinatorial problem about tree partitioning:

1. **Red chooses node x** - This is fixed as input to our problem
2. **Blue responds** - Blue must choose a node adjacent to a colored node. The only colored node is x, so blue must choose a neighbor of x
3. **Tree partitioning** - When blue chooses a neighbor y of x, the edge x-y is "cut". This partitions the tree into two components:
   - The component containing y (which blue claims)
   - The rest of the tree (which red claims, except for x's other regions that blue could still claim later)

   Actually, more precisely: x has at most 3 neighbors (parent, left child, right child). Each neighbor defines a region. When blue picks a neighbor, they claim the entire connected component reachable from that neighbor without passing through x.

4. **Blue's optimal strategy** - Blue will always choose the largest of the three regions. There's no reason to choose a smaller region.

5. **Winning condition** - Blue wins if the largest region has more than n/2 nodes. Otherwise, red wins.

So our algorithm reduces to:

1. Find node x in the tree
2. Calculate sizes of the three regions (left subtree, right subtree, and rest of tree)
3. Find the maximum region size
4. Check if max_region_size > n/2

The "rest of tree" region size = n - 1 - left_size - right_size (subtract x itself and its two subtrees).

## Optimal Solution

The solution involves two DFS traversals:

1. First DFS to find node x and calculate subtree sizes
2. Second DFS (or continuation of first) to compute the answer

Actually, we can do it in one DFS with careful tracking. We need to:

- Find the node with value x
- Calculate the size of its left and right subtrees
- The parent region size is n - 1 - left_size - right_size

<div class="code-group">

```python
# Time: O(n) | Space: O(h) where h is tree height (recursion stack)
class Solution:
    def btreeGameWinningMove(self, root, n, x):
        """
        Determine if the second player can force a win when the first player chooses node x.

        Args:
            root: TreeNode - root of the binary tree
            n: int - total number of nodes (odd)
            x: int - value of node chosen by first player

        Returns:
            bool - True if second player can win, False otherwise
        """
        # We'll store the sizes of left and right subtrees of node x
        left_size = 0
        right_size = 0

        def dfs(node):
            """
            DFS traversal that returns the size of subtree rooted at 'node'.
            Also updates left_size and right_size if node is x.

            Returns:
                int - size of subtree rooted at 'node'
            """
            nonlocal left_size, right_size

            if not node:
                return 0

            # Recursively get sizes of left and right subtrees
            left_subtree = dfs(node.left)
            right_subtree = dfs(node.right)

            # If current node is x, record the sizes of its subtrees
            if node.val == x:
                left_size = left_subtree
                right_size = right_subtree

            # Return total size of subtree rooted at current node
            return left_subtree + right_subtree + 1

        # Perform DFS to calculate subtree sizes and find node x
        dfs(root)

        # Calculate size of parent region (nodes not in x's subtrees, excluding x itself)
        parent_size = n - 1 - left_size - right_size

        # Blue can choose the largest of the three regions
        # The regions are: left subtree, right subtree, and parent region
        max_region = max(left_size, right_size, parent_size)

        # Blue wins if they can claim more than half of the nodes
        # Since n is odd, "more than half" means > n/2
        return max_region > n // 2
```

```javascript
// Time: O(n) | Space: O(h) where h is tree height (recursion stack)
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @param {number} n
 * @param {number} x
 * @return {boolean}
 */
var btreeGameWinningMove = function (root, n, x) {
  // Variables to store sizes of left and right subtrees of node x
  let leftSize = 0;
  let rightSize = 0;

  /**
   * DFS traversal to calculate subtree sizes and find node x
   * @param {TreeNode} node - Current node in traversal
   * @return {number} Size of subtree rooted at 'node'
   */
  function dfs(node) {
    if (!node) {
      return 0;
    }

    // Recursively calculate sizes of left and right subtrees
    const leftSubtree = dfs(node.left);
    const rightSubtree = dfs(node.right);

    // If current node is x, record its subtree sizes
    if (node.val === x) {
      leftSize = leftSubtree;
      rightSize = rightSubtree;
    }

    // Return total size of subtree rooted at current node
    return leftSubtree + rightSubtree + 1;
  }

  // Perform DFS traversal starting from root
  dfs(root);

  // Calculate size of parent region (nodes not in x's subtrees, excluding x itself)
  const parentSize = n - 1 - leftSize - rightSize;

  // Blue chooses the largest of the three regions
  const maxRegion = Math.max(leftSize, rightSize, parentSize);

  // Blue wins if they can claim more than half the nodes
  // Since n is odd, "more than half" means > n/2
  return maxRegion > Math.floor(n / 2);
};
```

```java
// Time: O(n) | Space: O(h) where h is tree height (recursion stack)

/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    // Class variables to store sizes of left and right subtrees of node x
    private int leftSize = 0;
    private int rightSize = 0;

    public boolean btreeGameWinningMove(TreeNode root, int n, int x) {
        // Perform DFS to calculate subtree sizes and find node x
        dfs(root, x);

        // Calculate size of parent region (nodes not in x's subtrees, excluding x itself)
        int parentSize = n - 1 - leftSize - rightSize;

        // Blue chooses the largest of the three regions
        int maxRegion = Math.max(leftSize, Math.max(rightSize, parentSize));

        // Blue wins if they can claim more than half the nodes
        // Since n is odd, "more than half" means > n/2
        return maxRegion > n / 2;
    }

    /**
     * DFS traversal to calculate subtree sizes and find node x
     * @param node Current node in traversal
     * @param x Value of the node chosen by first player
     * @return Size of subtree rooted at 'node'
     */
    private int dfs(TreeNode node, int x) {
        if (node == null) {
            return 0;
        }

        // Recursively calculate sizes of left and right subtrees
        int leftSubtree = dfs(node.left, x);
        int rightSubtree = dfs(node.right, x);

        // If current node is x, record its subtree sizes
        if (node.val == x) {
            leftSize = leftSubtree;
            rightSize = rightSubtree;
        }

        // Return total size of subtree rooted at current node
        return leftSubtree + rightSubtree + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We perform a single DFS traversal of the entire tree
- Each node is visited exactly once
- At each node, we do constant work (comparisons, arithmetic)

**Space Complexity: O(h)** where h is the height of the tree

- This is the recursion stack space
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- The algorithm only uses a few extra integer variables beyond the recursion stack

## Common Mistakes

1. **Forgetting that n is odd**: The problem states n is odd, which means n/2 is not an integer. Blue needs **more than** n/2 nodes, not at least n/2. Using `>= n/2` instead of `> n/2` is incorrect.

2. **Miscalculating the parent region size**: A common error is to calculate parent size as `n - left_size - right_size` (forgetting to subtract the node x itself). The correct formula is `n - 1 - left_size - right_size`.

3. **Assuming blue can choose any node**: Blue's first move must be adjacent to red's node x. Some solutions incorrectly allow blue to choose any uncolored node, which changes the problem entirely.

4. **Overcomplicating with game simulation**: Candidates sometimes try to simulate the entire game or use minimax algorithms. This misses the key combinatorial insight that blue simply takes the largest region.

5. **Not handling the case where x has no left/right child**: When x is a leaf or has only one child, the corresponding region size is 0. The code should handle this naturally (DFS returns 0 for null children).

## When You'll See This Pattern

This problem uses **tree partitioning via DFS with subtree size calculation**, a pattern that appears in several tree problems:

1. **Count Complete Tree Nodes (LeetCode 222)**: Uses similar DFS with subtree size calculation to efficiently count nodes in a complete binary tree.

2. **Binary Tree Maximum Path Sum (LeetCode 124)**: Uses DFS to calculate subtree contributions while tracking a global maximum, similar to how we track subtree sizes here.

3. **Most Stones Removed with Same Row or Column (LeetCode 947)**: While not a tree problem, it uses connected components thinking similar to the region partitioning in this problem.

4. **Tree Diameter (LeetCode 543)**: Uses DFS to calculate subtree heights and update a global maximum, similar pattern of DFS with side effect tracking.

The core pattern is: **DFS traversal that computes subtree properties while also tracking some global information or checking conditions at specific nodes**.

## Key Takeaways

1. **Game problems can often be reduced to combinatorial analysis**: Instead of simulating gameplay, look for structural properties that determine the outcome. Here, the tree partition sizes alone determine who wins.

2. **Tree partitioning via critical nodes**: When you remove a node (or edge), the tree breaks into components. Calculating component sizes via DFS is a fundamental tree algorithm pattern.

3. **The power of the first move constraint**: Blue's constraint (must choose adjacent to red) actually simplifies the problem by limiting their options to just three regions. Constraints in game problems often reveal the solution structure.

4. **DFS with side effects**: The DFS not only computes subtree sizes but also records information when it finds the target node x. This "two-in-one" traversal is efficient and elegant.

[Practice this problem on CodeJeet](/problem/binary-tree-coloring-game)
