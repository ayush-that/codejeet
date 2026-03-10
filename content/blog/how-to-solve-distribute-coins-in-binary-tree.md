---
title: "How to Solve Distribute Coins in Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Distribute Coins in Binary Tree. Medium difficulty, 77.3% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-07-14"
category: "dsa-patterns"
tags: ["distribute-coins-in-binary-tree", "tree", "depth-first-search", "binary-tree", "medium"]
---

# How to Solve Distribute Coins in Binary Tree

You're given a binary tree where each node has some number of coins, with exactly as many coins as there are nodes in total. You need to determine the minimum number of moves required to make every node have exactly one coin, where each move transfers one coin between adjacent nodes. The challenge lies in recognizing that this isn't about tracking individual coin movements, but rather calculating the net flow of coins through each subtree.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this tree:

```
       3
      / \
     0   0
```

Here we have 3 nodes total and 3 coins (all at the root). Each node needs exactly 1 coin. Let's think about what needs to happen:

1. **Root node (3 coins)**: Needs only 1 coin, so it has 2 excess coins to distribute
2. **Left child (0 coins)**: Needs 1 coin, so it has a deficit of 1 coin
3. **Right child (0 coins)**: Needs 1 coin, so it has a deficit of 1 coin

The root needs to give 1 coin to each child. Each transfer counts as 1 move, so:

- Root → Left child: 1 move
- Root → Right child: 1 move

Total moves = 2

Now let's try a more complex example:

```
       0
      / \
     3   0
    / \
   0   0
```

Breaking this down:

1. **Left subtree (node with value 3 and two children with 0)**:
   - The node with 3 coins needs only 1, so it has 2 excess coins
   - Its two children each need 1 coin (deficit of 1 each)
   - Within this subtree: 2 moves needed (one to each child)

2. **Root (0 coins)**: Needs 1 coin (deficit of 1)
3. **Right child (0 coins)**: Needs 1 coin (deficit of 1)

After the left subtree distributes its coins internally, the left child of the root ends up with exactly 1 coin. But wait — we need to think about this differently. The key insight is to consider the net flow through each edge.

Let's calculate properly:

- Left subtree has 3 nodes and 3 coins, so it's balanced internally
- But the root needs 1 coin from somewhere
- The right child needs 1 coin from somewhere

Actually, let me show you the correct calculation approach that leads to our solution...

## Brute Force Approach

A naive approach might try to simulate the actual movement of coins. You could:

1. Find all nodes with excess coins (> 1)
2. Find all nodes with deficits (0 coins)
3. Try to match excess nodes with deficit nodes
4. Calculate the distance between them in the tree
5. Sum all these distances

The problem with this approach is complexity. For each excess coin, you need to find the closest deficit, which requires traversing the tree multiple times. Even with optimization, you'd need to consider all possible pairings. This quickly becomes O(n²) or worse.

More fundamentally, this approach misses the key insight: we don't need to track individual coins or find specific pairings. The minimum moves can be calculated by looking at the net flow through each edge.

## Optimized Approach

The key insight is to think in terms of **balance** and **flow**:

1. For any node, calculate: `balance = node.val - 1`
   - Positive balance means excess coins to send upward
   - Negative balance means deficit coins to request from parent
   - Zero balance means exactly the right number of coins

2. For the entire subtree rooted at a node, calculate: `total_balance = sum of all balances in the subtree`

3. The absolute value of `total_balance` represents the number of coins that must pass through the edge connecting this subtree to its parent

4. The total moves equals the sum of absolute values of all these subtree balances

Why does this work? Consider an edge between a parent and child:

- If the child's subtree has a total balance of +2, it means this subtree has 2 extra coins that must move up through this edge
- If the child's subtree has a total balance of -3, it means this subtree needs 3 coins that must come down through this edge
- In either case, `|balance|` coins must cross this edge, and each coin crossing counts as 1 move

This approach transforms the problem from tracking individual coins to calculating simple subtree sums.

## Optimal Solution

We perform a post-order traversal (children before parent) to calculate the balance of each subtree. As we traverse, we accumulate the total moves needed.

<div class="code-group">

```python
# Time: O(n) where n is number of nodes | Space: O(h) where h is tree height (recursion stack)
class Solution:
    def distributeCoins(self, root):
        """
        Distribute coins so each node has exactly 1 coin.
        Returns minimum number of moves required.
        """
        self.moves = 0  # Track total moves

        def dfs(node):
            """
            Post-order traversal that returns the balance of the subtree.
            Balance = (coins in subtree) - (nodes in subtree)
            """
            if not node:
                return 0

            # Get balances from left and right subtrees
            left_balance = dfs(node.left)
            right_balance = dfs(node.right)

            # Current node's contribution to balance
            # node.val - 1 because node needs exactly 1 coin for itself
            current_balance = node.val - 1

            # Total balance for this subtree
            total_balance = left_balance + right_balance + current_balance

            # The absolute value of total_balance represents coins
            # that must pass through the edge to/from parent
            self.moves += abs(total_balance)

            # Return the balance to parent
            return total_balance

        dfs(root)
        return self.moves
```

```javascript
// Time: O(n) where n is number of nodes | Space: O(h) where h is tree height (recursion stack)
var distributeCoins = function (root) {
  let moves = 0; // Track total moves

  /**
   * Post-order traversal that returns the balance of the subtree.
   * Balance = (coins in subtree) - (nodes in subtree)
   * @param {TreeNode} node - Current node
   * @return {number} Balance of subtree rooted at node
   */
  function dfs(node) {
    if (!node) return 0;

    // Get balances from left and right subtrees
    const leftBalance = dfs(node.left);
    const rightBalance = dfs(node.right);

    // Current node's contribution to balance
    // node.val - 1 because node needs exactly 1 coin for itself
    const currentBalance = node.val - 1;

    // Total balance for this subtree
    const totalBalance = leftBalance + rightBalance + currentBalance;

    // The absolute value of totalBalance represents coins
    // that must pass through the edge to/from parent
    moves += Math.abs(totalBalance);

    // Return the balance to parent
    return totalBalance;
  }

  dfs(root);
  return moves;
};
```

```java
// Time: O(n) where n is number of nodes | Space: O(h) where h is tree height (recursion stack)
class Solution {
    private int moves = 0;  // Track total moves

    public int distributeCoins(TreeNode root) {
        dfs(root);
        return moves;
    }

    /**
     * Post-order traversal that returns the balance of the subtree.
     * Balance = (coins in subtree) - (nodes in subtree)
     * @param node Current node
     * @return Balance of subtree rooted at node
     */
    private int dfs(TreeNode node) {
        if (node == null) return 0;

        // Get balances from left and right subtrees
        int leftBalance = dfs(node.left);
        int rightBalance = dfs(node.right);

        // Current node's contribution to balance
        // node.val - 1 because node needs exactly 1 coin for itself
        int currentBalance = node.val - 1;

        // Total balance for this subtree
        int totalBalance = leftBalance + rightBalance + currentBalance;

        // The absolute value of totalBalance represents coins
        // that must pass through the edge to/from parent
        moves += Math.abs(totalBalance);

        // Return the balance to parent
        return totalBalance;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We visit each node exactly once during the post-order traversal
- At each node, we perform O(1) operations (addition, subtraction, absolute value)

**Space Complexity: O(h)** where h is the height of the tree

- This is the recursion stack space
- For a balanced tree: O(log n)
- For a skewed tree: O(n)
- If we used an iterative approach with an explicit stack, the space complexity would be the same

The O(n) time is optimal because we must examine every node at least once to know how many coins it has.

## Common Mistakes

1. **Trying to simulate actual coin movements**: This leads to overly complex solutions. Candidates often try to match excess nodes with deficit nodes directly, which requires considering distances in the tree and becomes computationally expensive.

2. **Forgetting to take absolute value**: The balance can be positive (excess) or negative (deficit). Both cases require coins to move through the edge, so we need `abs(balance)`.

3. **Incorrect base case in recursion**: When `node is null`, we must return 0, not None/undefined/null. This represents an empty subtree with 0 nodes and 0 coins, hence 0 balance.

4. **Mixing up node count with coin count**: Remember the formula is `balance = coins - nodes`, not `coins - 1` for the entire subtree. Each node in the subtree needs 1 coin, hence we subtract the number of nodes.

5. **Not understanding why post-order works**: You must process children before parent because a parent's balance depends on its children's balances. Pre-order or in-order won't give you the complete subtree information.

## When You'll See This Pattern

This problem uses a **post-order traversal with subtree aggregation**, a pattern common in tree problems where you need to compute something about entire subtrees. Similar problems include:

1. **Binary Tree Cameras (Hard)**: Place cameras to monitor all nodes. Like distributing coins, you need to make decisions based on subtree states (monitored/unmonitored, has camera/doesn't have camera).

2. **Sum of Distances in Tree (Hard)**: Compute sum of distances from each node to all others. Uses similar subtree aggregation to compute partial sums and propagate them.

3. **Diameter of Binary Tree (Easy)**: Find longest path between any two nodes. Uses post-order traversal to compute subtree heights and update the global maximum.

The pattern is: when you need to compute a global property based on local subtree information, consider post-order traversal with return values that aggregate subtree states.

## Key Takeaways

1. **Think in terms of flow, not individual items**: When dealing with distribution problems in trees, consider the net flow across edges rather than tracking individual elements. This often simplifies the problem dramatically.

2. **Post-order enables bottom-up computation**: If a parent's state depends on its children's states, post-order traversal (children before parent) is usually the right approach.

3. **Absolute values track movement in both directions**: Whether coins need to move up or down the tree, each coin that crosses an edge contributes 1 to the move count. Taking the absolute value of net flow captures both directions.

4. **Balance = Have - Need**: A useful framework for distribution problems. Calculate what each subtree has versus what it needs, and the difference tells you what must flow through the connecting edge.

Related problems: [Sum of Distances in Tree](/problem/sum-of-distances-in-tree), [Binary Tree Cameras](/problem/binary-tree-cameras)
