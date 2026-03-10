---
title: "How to Solve Find the Maximum Sum of Node Values — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Maximum Sum of Node Values. Hard difficulty, 69.5% acceptance rate. Topics: Array, Dynamic Programming, Greedy, Bit Manipulation, Tree."
date: "2026-11-13"
category: "dsa-patterns"
tags: ["find-the-maximum-sum-of-node-values", "array", "dynamic-programming", "greedy", "hard"]
---

# How to Solve Find the Maximum Sum of Node Values

This problem asks us to maximize the sum of node values in an undirected tree where we can apply an operation to any node: XOR it with a given integer `k`. The challenge is that the operation can be applied multiple times, but each edge in the tree has a special constraint: if we apply the operation to both endpoints of an edge, the edge's contribution to the total sum gets subtracted twice. This creates a complex dependency between node choices that makes the problem interesting and non-trivial.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

- `nums = [1, 2, 1]`
- `k = 3`
- `edges = [[0,1], [1,2]]`

**Tree structure:**

```
   0 (1)
   |
   1 (2)
   |
   2 (1)
```

**Step 1: Calculate possible values for each node**
For each node, we can either keep its original value or XOR it with `k`:

- Node 0: 1 or (1 XOR 3 = 2)
- Node 1: 2 or (2 XOR 3 = 1)
- Node 2: 1 or (1 XOR 3 = 2)

**Step 2: Understand the edge penalty**
The key insight is that for each edge `(u, v)`, if we XOR **both** endpoints, we need to subtract `2 * k` from our total. Why? Because when we calculate the total sum, we're counting each node's value. If we XOR a node, we're effectively adding `(nums[i] XOR k) - nums[i]` to our total. But if we XOR both endpoints of an edge, we've double-counted the effect of `k` on that edge connection.

**Step 3: Calculate net gains**
For each node, compute the net gain if we XOR it:

- Node 0: 2 - 1 = 1 (positive gain)
- Node 1: 1 - 2 = -1 (negative gain)
- Node 2: 2 - 1 = 1 (positive gain)

**Step 4: Strategy for maximizing sum**
We want to apply the XOR operation to nodes where it gives us positive gain. However, if we apply it to both endpoints of any edge, we need to pay a penalty of `2 * k`. Since `k = 3`, the penalty is 6, which would wipe out any gains.

**Step 5: Optimal solution**
We can XOR nodes 0 and 2 (gain = 1 + 1 = 2) but not node 1 (which would give -1). Since nodes 0 and 2 are not directly connected by an edge, we don't incur any penalty. Total sum = (2 + 2 + 1) = 5.

This example shows we need to be strategic about which nodes to XOR, considering both their individual gains and the penalties from edges.

## Brute Force Approach

A brute force approach would try all possible subsets of nodes to XOR. For each subset, we would:

1. Calculate the new values for XORed nodes
2. Sum all node values
3. For each edge where both endpoints are XORed, subtract `2 * k`
4. Track the maximum sum found

The problem with this approach is that there are `2^n` possible subsets to check, where `n` can be up to 2 × 10^5. This is computationally impossible.

Even if we tried to use dynamic programming with tree DP (considering each node as XORed or not), we'd still face challenges because the penalty depends on pairs of nodes (edges), not just individual nodes. A naive DP would need to track too much state information.

## Optimized Approach

The key insight is that we can transform this problem into a simpler one. Notice that:

1. The total sum if we don't XOR any nodes is simply `sum(nums)`
2. XORing a node `i` changes its value from `nums[i]` to `nums[i] XOR k`
3. The net gain for XORing node `i` is `(nums[i] XOR k) - nums[i]`
4. If we XOR both endpoints of an edge, we need to subtract `2 * k` from our total

Here's the breakthrough realization: In a tree with `n` nodes and `n-1` edges, we can think about the XOR operations in terms of **pairing**. If we have an even number of XORed nodes, we can pair them up along edges without penalty. If we have an odd number, we'll have one "unpaired" XOR operation that forces us to leave some gain on the table.

The optimal strategy becomes:

1. Calculate the gain for each node if we XOR it
2. Sort the gains in descending order
3. Try to take gains in pairs (largest positive gains first)
4. If we have an odd number of positive gains, we might need to skip the smallest gain or include a negative gain to make pairing work

Actually, there's an even cleaner way: We can choose to XOR any set of nodes, and the penalty only applies when two XORed nodes are connected by an edge. In a tree, we can always avoid having adjacent XORed nodes (like a bipartite selection). This means we're essentially looking for the maximum sum where no two XORed nodes are adjacent.

But wait, there's an even better insight from the community solutions: The problem reduces to calculating the sum of all original values, then adding the maximum possible additional gain from XOR operations while ensuring we don't take both endpoints of any edge.

The most elegant solution: We can think of each XOR operation as toggling a node between two states. The constraint means we can't toggle both endpoints of any edge. This is equivalent to finding a maximum independent set in the tree with weighted gains. However, that's still NP-hard in general graphs, but trees have polynomial solutions.

The actual working solution is simpler: We calculate the sum of all original values, then add the gains from XOR operations, but we must ensure that for every edge, we don't add both endpoints' gains. We can do this with a greedy approach: sort gains and take them in descending order, but skip if taking both endpoints of any edge.

## Optimal Solution

The most efficient solution uses a greedy approach with a clever observation: We can always pair up nodes to avoid the penalty, so we should focus on positive gains. The algorithm:

1. Calculate the total sum of original values
2. For each node, calculate the gain if we XOR it
3. Count how many positive gains we have
4. If we have an even number of positive gains, we can take all of them
5. If we have an odd number, we need to either:
   - Skip the smallest positive gain, or
   - Take the largest negative gain (closest to zero) to make the count even
6. Choose the better option between these two

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumValueSum(nums, k, edges):
    """
    Calculate the maximum possible sum of node values after applying XOR operations.

    Args:
        nums: List of original node values
        k: Integer to XOR with
        edges: List of edges in the tree (unused in optimal solution due to key insight)

    Returns:
        Maximum possible sum
    """
    total_sum = 0
    positive_count = 0
    min_positive_gain = float('inf')
    max_negative_gain = float('-inf')

    # Calculate gains for each node
    for num in nums:
        original = num
        xored = num ^ k
        gain = xored - original

        # Add original value to total sum
        total_sum += original

        # Track positive and negative gains
        if gain > 0:
            total_sum += gain  # Tentatively add positive gains
            positive_count += 1
            min_positive_gain = min(min_positive_gain, gain)
        else:
            max_negative_gain = max(max_negative_gain, gain)

    # If we have an even number of positive gains, we're done
    if positive_count % 2 == 0:
        return total_sum

    # If odd number of positive gains, we need to adjust:
    # Option 1: Remove the smallest positive gain
    # Option 2: Add the largest negative gain (least negative)
    # Choose the option with smaller loss
    option1_loss = min_positive_gain
    option2_loss = -max_negative_gain  # Convert negative gain to positive loss

    # Subtract the smaller loss from total sum
    total_sum -= min(option1_loss, option2_loss)

    return total_sum
```

```javascript
// Time: O(n) | Space: O(1)
function maximumValueSum(nums, k, edges) {
  /**
   * Calculate the maximum possible sum of node values after applying XOR operations.
   *
   * @param {number[]} nums - Original node values
   * @param {number} k - Integer to XOR with
   * @param {number[][]} edges - Edges in the tree (unused due to key insight)
   * @return {number} Maximum possible sum
   */
  let totalSum = 0;
  let positiveCount = 0;
  let minPositiveGain = Infinity;
  let maxNegativeGain = -Infinity;

  // Calculate gains for each node
  for (let i = 0; i < nums.length; i++) {
    const original = nums[i];
    const xored = original ^ k;
    const gain = xored - original;

    // Add original value to total sum
    totalSum += original;

    // Track positive and negative gains
    if (gain > 0) {
      totalSum += gain; // Tentatively add positive gains
      positiveCount++;
      minPositiveGain = Math.min(minPositiveGain, gain);
    } else {
      maxNegativeGain = Math.max(maxNegativeGain, gain);
    }
  }

  // If we have an even number of positive gains, we're done
  if (positiveCount % 2 === 0) {
    return totalSum;
  }

  // If odd number of positive gains, we need to adjust
  // Option 1: Remove the smallest positive gain
  // Option 2: Add the largest negative gain (least negative)
  const option1Loss = minPositiveGain;
  const option2Loss = -maxNegativeGain; // Convert negative gain to positive loss

  // Subtract the smaller loss from total sum
  totalSum -= Math.min(option1Loss, option2Loss);

  return totalSum;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public long maximumValueSum(int[] nums, int k, int[][] edges) {
        /**
         * Calculate the maximum possible sum of node values after applying XOR operations.
         *
         * @param nums Original node values
         * @param k Integer to XOR with
         * @param edges Edges in the tree (unused due to key insight)
         * @return Maximum possible sum
         */
        long totalSum = 0;
        int positiveCount = 0;
        int minPositiveGain = Integer.MAX_VALUE;
        int maxNegativeGain = Integer.MIN_VALUE;

        // Calculate gains for each node
        for (int num : nums) {
            int original = num;
            int xored = original ^ k;
            int gain = xored - original;

            // Add original value to total sum
            totalSum += original;

            // Track positive and negative gains
            if (gain > 0) {
                totalSum += gain;  // Tentatively add positive gains
                positiveCount++;
                minPositiveGain = Math.min(minPositiveGain, gain);
            } else {
                maxNegativeGain = Math.max(maxNegativeGain, gain);
            }
        }

        // If we have an even number of positive gains, we're done
        if (positiveCount % 2 == 0) {
            return totalSum;
        }

        // If odd number of positive gains, we need to adjust
        // Option 1: Remove the smallest positive gain
        // Option 2: Add the largest negative gain (least negative)
        int option1Loss = minPositiveGain;
        int option2Loss = -maxNegativeGain;  // Convert negative gain to positive loss

        // Subtract the smaller loss from total sum
        totalSum -= Math.min(option1Loss, option2Loss);

        return totalSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through all `n` nodes once to calculate gains
- Each iteration performs constant-time operations (XOR, subtraction, comparisons)
- The edges array is not processed in the optimal solution due to the key insight

**Space Complexity:** O(1)

- We use only a constant amount of extra space regardless of input size
- Variables for tracking total sum, counts, min/max values use constant space
- No additional data structures are needed

The reason we achieve O(n) time and O(1) space is the crucial insight that the tree structure doesn't matter for the optimal solution. We only need to consider individual node gains and their parity (even/odd count of positive gains).

## Common Mistakes

1. **Overcomplicating with tree traversal:** Many candidates try to use DFS or BFS to traverse the tree and make decisions at each node. This leads to complex state management and often incorrect solutions. The key insight is that the tree structure doesn't constrain the solution as much as initially appears.

2. **Missing the parity insight:** The most common mistake is not realizing that we can always pair up XOR operations to avoid penalties, so we only care about whether we have an even or odd number of positive gains. This is the core insight that simplifies the problem.

3. **Incorrect gain calculation:** Some candidates calculate gain as `xored` value alone instead of `xored - original`. Remember, we're adding to the base sum of all original values, so the gain is the difference.

4. **Forgetting about negative gains in the odd case:** When we have an odd number of positive gains, we need to consider both removing a positive gain AND adding a negative gain. Some solutions only consider removing the smallest positive gain, which can miss better solutions when there's a negative gain very close to zero.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Greedy with parity constraints:** Similar to problems where you need to select elements with pairing constraints. The even/odd consideration appears in problems like:
   - "Minimum Operations to Make Array Sum Divisible by K" - dealing with remainder counts
   - "Split Array into Consecutive Subsequences" - managing counts of elements

2. **Tree problems with independent constraints:** While this specific problem doesn't use the tree structure in the optimal solution, similar tree problems with constraints on adjacent nodes include:
   - "House Robber III" - can't rob adjacent houses in a tree
   - "Binary Tree Cameras" - placing cameras with coverage constraints

3. **Bit manipulation with optimization:** Problems where XOR operations can be applied with constraints:
   - "Maximum XOR for Each Query" - applying XOR operations sequentially
   - "Find Unique Binary String" - avoiding certain XOR patterns

## Key Takeaways

1. **Look for simplifying insights:** The most elegant solutions often come from realizing that apparent constraints (like the tree structure) don't actually limit the solution space as much as they seem. Always ask: "Can this constraint be simplified or eliminated?"

2. **Parity matters:** When dealing with pairing constraints or operations that need to be applied in pairs, the even/odd count often becomes the critical factor. Track counts and consider both cases.

3. **Separate base value from incremental gains:** Many optimization problems become clearer when you separate the base case (doing nothing) from the incremental improvements. Calculate what you get for free, then optimize the additions.

Related problems: [Maximum Score After Applying Operations on a Tree](/problem/maximum-score-after-applying-operations-on-a-tree), [Find Number of Coins to Place in Tree Nodes](/problem/find-number-of-coins-to-place-in-tree-nodes)
