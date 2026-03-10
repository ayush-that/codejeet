---
title: "How to Solve Maximum Product of Splitted Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Product of Splitted Binary Tree. Medium difficulty, 55.5% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2028-04-28"
category: "dsa-patterns"
tags:
  ["maximum-product-of-splitted-binary-tree", "tree", "depth-first-search", "binary-tree", "medium"]
---

# How to Solve Maximum Product of Splitted Binary Tree

This problem asks us to split a binary tree into two subtrees by removing exactly one edge, then maximize the product of the sums of the resulting subtrees. The challenge is that we need to efficiently compute subtree sums for every possible split point without recalculating sums repeatedly. The modulo requirement adds another layer of complexity to handle large numbers properly.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider this binary tree:

```
       1
      / \
     2   3
    / \
   4   5
```

**Step 1: Calculate total sum**
First, we need the total sum of all nodes: 1 + 2 + 3 + 4 + 5 = 15

**Step 2: Consider each possible split**
We can remove any edge to split the tree. Let's examine each:

1. Remove edge between 1 and 2:
   - Left subtree (rooted at 2): sum = 2 + 4 + 5 = 11
   - Right subtree: sum = total - 11 = 15 - 11 = 4
   - Product = 11 × 4 = 44

2. Remove edge between 1 and 3:
   - Right subtree (rooted at 3): sum = 3
   - Left subtree: sum = total - 3 = 15 - 3 = 12
   - Product = 12 × 3 = 36

3. Remove edge between 2 and 4:
   - Left subtree (rooted at 4): sum = 4
   - Rest of tree: sum = total - 4 = 15 - 4 = 11
   - Product = 4 × 11 = 44

4. Remove edge between 2 and 5:
   - Right subtree (rooted at 5): sum = 5
   - Rest of tree: sum = total - 5 = 15 - 5 = 10
   - Product = 5 × 10 = 50

**Step 3: Find maximum**
The maximum product is 50 (from removing edge between 2 and 5).

The key insight: For any split, if we know the sum of one subtree (call it `subtree_sum`), the other subtree's sum is `total_sum - subtree_sum`. The product is `subtree_sum × (total_sum - subtree_sum)`. We need to find the maximum of this expression across all possible splits.

## Brute Force Approach

A naive approach would be to:

1. For each node (except the root), consider removing the edge between it and its parent
2. Calculate the sum of the subtree rooted at that node
3. Calculate the sum of the rest of the tree as `total_sum - subtree_sum`
4. Compute the product and track the maximum

The problem with this approach is efficiency. If we recalculate subtree sums from scratch for each possible split, we're doing redundant work. For example, to calculate the sum of the subtree rooted at node 2, we need to visit nodes 4 and 5. Then to calculate the sum for node 4, we'd visit the same nodes again. This leads to O(n²) time complexity in the worst case (for a skewed tree).

Even with memoization, we'd still need to traverse the tree multiple times. The brute force approach doesn't scale well for trees with up to 5×10⁴ nodes (as per the problem constraints).

## Optimized Approach

The optimal solution uses a **two-pass DFS** approach:

**Key Insight**: We can compute all subtree sums in a single traversal, then use these precomputed sums to evaluate all possible splits efficiently.

**Step-by-step reasoning**:

1. **First DFS (post-order traversal)**: Calculate the total sum of the entire tree and store subtree sums for each node. This gives us O(n) time to compute all necessary sums.

2. **Second DFS (any traversal)**: For each node (except the root), compute the product:
   - `subtree_sum = sum of subtree rooted at current node`
   - `remaining_sum = total_sum - subtree_sum`
   - `product = subtree_sum × remaining_sum`

   Track the maximum product.

3. **Modulo handling**: Since products can be huge, we compute modulo 10⁹+7 at each step. However, we must be careful: we should compute the product using 64-bit integers (Python handles this automatically, but in Java/JavaScript we need to use `long`/`BigInt`) before applying the modulo operation.

4. **Why this works**: Every edge removal corresponds to splitting off a subtree rooted at some node (except the root). By precomputing all subtree sums, we can evaluate all n-1 possible splits in O(n) time after the initial O(n) computation.

## Optimal Solution

<div class="code-group">

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxProduct(self, root: Optional[TreeNode]) -> int:
        MOD = 10**9 + 7

        # Step 1: Calculate total sum of the tree
        def calculate_total(node):
            if not node:
                return 0
            # Post-order traversal: left, right, then process current node
            left_sum = calculate_total(node.left)
            right_sum = calculate_total(node.right)
            # Store subtree sum at current node for later use
            node.subtree_sum = node.val + left_sum + right_sum
            return node.subtree_sum

        total_sum = calculate_total(root)

        # Step 2: Find maximum product by trying each possible split
        self.max_product = 0

        def find_max_product(node):
            if not node:
                return

            # For each node (except root), consider removing edge to its parent
            # This splits the tree into: subtree rooted at node, and the rest
            if node != root:  # Root has no parent edge to remove
                subtree_sum = node.subtree_sum
                remaining_sum = total_sum - subtree_sum
                # Update maximum product (use Python's arbitrary precision integers)
                product = subtree_sum * remaining_sum
                if product > self.max_product:
                    self.max_product = product

            # Recursively check children
            find_max_product(node.left)
            find_max_product(node.right)

        find_max_product(root)

        # Return result modulo 10^9 + 7
        return self.max_product % MOD
```

```javascript
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
 * @return {number}
 */
var maxProduct = function (root) {
  const MOD = 1000000007n; // Use BigInt for modulo operations

  // Step 1: Calculate total sum of the tree using DFS
  let totalSum = 0n;

  function calculateTotal(node) {
    if (!node) return 0n;

    // Convert node value to BigInt
    const val = BigInt(node.val);

    // Recursively calculate sums of left and right subtrees
    const leftSum = calculateTotal(node.left);
    const rightSum = calculateTotal(node.right);

    // Calculate and store subtree sum at current node
    const subtreeSum = val + leftSum + rightSum;
    node.subtreeSum = subtreeSum;

    return subtreeSum;
  }

  totalSum = calculateTotal(root);

  // Step 2: Find maximum product by trying each possible split
  let maxProduct = 0n;

  function findMaxProduct(node) {
    if (!node) return;

    // For each node (except root), consider removing edge to its parent
    if (node !== root) {
      const subtreeSum = node.subtreeSum;
      const remainingSum = totalSum - subtreeSum;

      // Calculate product and update maximum
      const product = subtreeSum * remainingSum;
      if (product > maxProduct) {
        maxProduct = product;
      }
    }

    // Recursively check children
    findMaxProduct(node.left);
    findMaxProduct(node.right);
  }

  findMaxProduct(root);

  // Convert BigInt back to Number for return (modulo ensures it fits in 32-bit)
  return Number(maxProduct % MOD);
};
```

```java
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
    private long maxProduct = 0;
    private long totalSum = 0;
    private final int MOD = 1000000007;

    public int maxProduct(TreeNode root) {
        // Step 1: Calculate total sum of the tree
        totalSum = dfsSum(root);

        // Step 2: Find maximum product
        dfsProduct(root);

        // Return result modulo 10^9 + 7
        return (int)(maxProduct % MOD);
    }

    // First DFS: Calculate subtree sums and total sum
    private long dfsSum(TreeNode node) {
        if (node == null) return 0;

        // Post-order traversal to calculate subtree sums
        long leftSum = dfsSum(node.left);
        long rightSum = dfsSum(node.right);

        // Current subtree sum = node value + left subtree + right subtree
        long subtreeSum = node.val + leftSum + rightSum;

        // Store the subtree sum (we'll use it in the second DFS)
        // Since we can't modify TreeNode class, we'll calculate product during traversal

        return subtreeSum;
    }

    // Second DFS: Calculate maximum product
    private long dfsProduct(TreeNode node) {
        if (node == null) return 0;

        // Calculate current subtree sum
        long leftSum = dfsProduct(node.left);
        long rightSum = dfsProduct(node.right);
        long subtreeSum = node.val + leftSum + rightSum;

        // For each node (except when it's the entire tree), calculate product
        if (subtreeSum != totalSum) { // Equivalent to checking if node != root
            long remainingSum = totalSum - subtreeSum;
            long product = subtreeSum * remainingSum;
            if (product > maxProduct) {
                maxProduct = product;
            }
        }

        return subtreeSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We perform two depth-first traversals of the tree
- Each traversal visits each node exactly once
- Each node operation is O(1) (addition, multiplication, comparison)
- Total: O(n) + O(n) = O(n)

**Space Complexity**: O(h) where h is the height of the tree

- The space is used by the recursion call stack
- In the worst case (skewed tree), h = n, so O(n)
- In the best case (balanced tree), h = log n, so O(log n)
- The Python/JavaScript solutions store additional O(n) space for subtree sums on nodes, but this could be optimized to O(1) extra space by calculating products during the second traversal (as shown in the Java solution)

## Common Mistakes

1. **Forgetting modulo operation**: The problem explicitly states to return the result modulo 10⁹+7. Candidates might compute the correct product but forget to apply the modulo at the end, or apply it incorrectly during intermediate calculations.

2. **Integer overflow**: In languages with fixed-size integers (like Java), multiplying two large sums can overflow even 32-bit integers. Candidates should use 64-bit `long` for intermediate calculations. In JavaScript, using `BigInt` is necessary for large numbers.

3. **Incorrect edge case handling**: The root node has no parent edge to remove, so we shouldn't consider splitting at the root. Some candidates might include the root in their product calculations, which would give an incorrect result.

4. **Double counting or missing splits**: Each edge corresponds to exactly one split opportunity. Candidates might accidentally consider the same split multiple times or miss some edges, especially when dealing with null children.

## When You'll See This Pattern

This problem uses a **subtree sum precomputation** pattern combined with **tree traversal optimization**. You'll see similar patterns in:

1. **Count Nodes With the Highest Score** (LeetCode 2049): This problem also involves computing subtree products/scores by removing edges. The core technique of precomputing subtree sizes/sums is identical.

2. **Maximum Average Subtree** (LeetCode 1120): Requires computing subtree sums and counts to calculate averages, using similar post-order traversal.

3. **Binary Tree Maximum Path Sum** (LeetCode 124): While not about splitting, it uses similar tree traversal techniques to compute optimal paths through the tree.

The pattern is: when you need to compute some metric for all subtrees (sums, sizes, averages, etc.), use a post-order DFS to compute bottom-up, storing results to avoid redundant calculations.

## Key Takeaways

1. **Precompute subtree information**: When a problem requires evaluating all subtrees or splits, compute subtree sums/sizes in a single pass and reuse the results.

2. **Two-pass tree traversal is powerful**: First pass to gather global information (like total sum), second pass to evaluate each candidate using the precomputed information.

3. **Edge removal = subtree separation**: Removing an edge between a node and its parent creates two components: the subtree rooted at that node, and everything else. This simplifies the problem from "find two subtrees" to "find one subtree and compute the rest as total minus subtree."

Related problems: [Count Nodes With the Highest Score](/problem/count-nodes-with-the-highest-score)
