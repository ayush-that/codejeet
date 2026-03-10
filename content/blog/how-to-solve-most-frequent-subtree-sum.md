---
title: "How to Solve Most Frequent Subtree Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Most Frequent Subtree Sum. Medium difficulty, 68.9% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Binary Tree."
date: "2026-05-12"
category: "dsa-patterns"
tags: ["most-frequent-subtree-sum", "hash-table", "tree", "depth-first-search", "medium"]
---

# How to Solve Most Frequent Subtree Sum

This problem asks us to find the most frequent subtree sum in a binary tree. A subtree sum is the total of all node values in the subtree rooted at a given node (including the node itself). The challenge is that we need to compute sums for every node in the tree efficiently, track their frequencies, and return all sums with the highest frequency. What makes this interesting is that we need to compute each subtree sum exactly once while building a frequency map—this naturally leads to a post-order traversal approach.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider this tree:

```
      5
     / \
    2   -3
```

**Step 1: Process leaf nodes first (post-order)**

- Node `2`: Its subtree sum is just `2` (no children). Frequency map becomes `{2: 1}`
- Node `-3`: Subtree sum is `-3`. Frequency map becomes `{2: 1, -3: 1}`

**Step 2: Process internal nodes**

- Node `5`: Subtree sum = `5 + 2 + (-3) = 4`. Frequency map becomes `{2: 1, -3: 1, 4: 1}`

**Step 3: Find most frequent sums**
All sums appear once, so all three values `[2, -3, 4]` have the highest frequency (1). We can return them in any order.

Now consider a tree with ties:

```
      5
     / \
    2   -5
```

**Step 1:** Node `2` → sum = `2`, map = `{2: 1}`
**Step 2:** Node `-5` → sum = `-5`, map = `{2: 1, -5: 1}`
**Step 3:** Node `5` → sum = `5 + 2 + (-5) = 2`, map = `{2: 2, -5: 1}`

Most frequent sum is `2` (appears twice), so we return `[2]`.

The key insight: We need to compute each subtree sum exactly once. Since a node's subtree sum depends on its children's sums, a post-order traversal (children before parent) is perfect.

## Brute Force Approach

A naive approach would be to compute each subtree sum independently by traversing the entire subtree for each node. For each node:

1. Perform a DFS to sum all values in its subtree
2. Update frequency count for that sum
3. Repeat for all nodes

This leads to O(n²) time complexity in the worst case (a skewed tree), as we're essentially traversing O(n) nodes for each of the n nodes. The space complexity would be O(n) for the recursion stack and frequency map.

While this would technically work for small trees, it's inefficient for larger ones. The redundancy comes from repeatedly traversing the same nodes—the subtree of a parent node contains the subtrees of its children, so we're doing the same work multiple times.

## Optimized Approach

The optimal solution uses a single post-order traversal with memoization. Here's the key insight:

1. **Post-order traversal ensures children are processed before parents**  
   When we visit a node, we already know the sums of its left and right subtrees.

2. **Compute each subtree sum exactly once**  
   The subtree sum for a node = `node.val + left_sum + right_sum`. We compute this and store it.

3. **Build frequency map during traversal**  
   As we compute each subtree sum, we update its count in a hash map.

4. **Track maximum frequency**  
   While building the map, we keep track of the highest frequency we've seen.

5. **Collect results**  
   After traversal, we iterate through the frequency map to collect all sums with the maximum frequency.

This approach visits each node exactly once, giving us O(n) time complexity. The space complexity is O(n) for the recursion stack and frequency map.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes in tree
# Space: O(n) for recursion stack and frequency map
class Solution:
    def findFrequentTreeSum(self, root: Optional[TreeNode]) -> List[int]:
        if not root:
            return []

        # Dictionary to store frequency of each subtree sum
        freq_map = {}
        # Track the maximum frequency encountered
        max_freq = 0

        def dfs(node):
            nonlocal max_freq

            if not node:
                return 0

            # Post-order traversal: process children first
            left_sum = dfs(node.left)
            right_sum = dfs(node.right)

            # Current subtree sum = node value + left subtree sum + right subtree sum
            subtree_sum = node.val + left_sum + right_sum

            # Update frequency map
            freq_map[subtree_sum] = freq_map.get(subtree_sum, 0) + 1

            # Update max frequency if needed
            max_freq = max(max_freq, freq_map[subtree_sum])

            # Return subtree sum to parent
            return subtree_sum

        # Start DFS from root
        dfs(root)

        # Collect all sums with maximum frequency
        result = []
        for sum_val, freq in freq_map.items():
            if freq == max_freq:
                result.append(sum_val)

        return result
```

```javascript
// Time: O(n) where n is number of nodes in tree
// Space: O(n) for recursion stack and frequency map
function findFrequentTreeSum(root) {
  if (!root) return [];

  // Map to store frequency of each subtree sum
  const freqMap = new Map();
  let maxFreq = 0;

  // Helper function for DFS post-order traversal
  function dfs(node) {
    if (!node) return 0;

    // Process left and right subtrees first
    const leftSum = dfs(node.left);
    const rightSum = dfs(node.right);

    // Calculate current subtree sum
    const subtreeSum = node.val + leftSum + rightSum;

    // Update frequency in map
    const newFreq = (freqMap.get(subtreeSum) || 0) + 1;
    freqMap.set(subtreeSum, newFreq);

    // Update maximum frequency if needed
    maxFreq = Math.max(maxFreq, newFreq);

    // Return sum to parent
    return subtreeSum;
  }

  // Start DFS traversal
  dfs(root);

  // Collect results with maximum frequency
  const result = [];
  for (const [sumVal, freq] of freqMap) {
    if (freq === maxFreq) {
      result.push(sumVal);
    }
  }

  return result;
}
```

```java
// Time: O(n) where n is number of nodes in tree
// Space: O(n) for recursion stack and frequency map
class Solution {
    private Map<Integer, Integer> freqMap;
    private int maxFreq;

    public int[] findFrequentTreeSum(TreeNode root) {
        if (root == null) return new int[0];

        freqMap = new HashMap<>();
        maxFreq = 0;

        // Perform DFS to compute all subtree sums
        dfs(root);

        // Collect results with maximum frequency
        List<Integer> resultList = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
            if (entry.getValue() == maxFreq) {
                resultList.add(entry.getKey());
            }
        }

        // Convert List to array
        int[] result = new int[resultList.size()];
        for (int i = 0; i < resultList.size(); i++) {
            result[i] = resultList.get(i);
        }

        return result;
    }

    private int dfs(TreeNode node) {
        if (node == null) return 0;

        // Post-order traversal: children first
        int leftSum = dfs(node.left);
        int rightSum = dfs(node.right);

        // Current subtree sum
        int subtreeSum = node.val + leftSum + rightSum;

        // Update frequency map
        int newFreq = freqMap.getOrDefault(subtreeSum, 0) + 1;
        freqMap.put(subtreeSum, newFreq);

        // Update maximum frequency
        maxFreq = Math.max(maxFreq, newFreq);

        return subtreeSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
We perform a single DFS traversal visiting each node exactly once. For each node, we do constant-time operations: computing the sum, updating the hash map, and updating the max frequency. The final pass through the frequency map is also O(n) in the worst case (if all subtree sums are unique).

**Space Complexity: O(n)**

- The recursion stack can go as deep as the height of the tree. In the worst case (skewed tree), this is O(n). In a balanced tree, it's O(log n).
- The frequency map stores at most n entries (one per node), so O(n).
- The result list can be up to n elements in the worst case (if all frequencies are equal).

## Common Mistakes

1. **Forgetting to handle the empty tree case**  
   If the root is null, we should return an empty array/list. This is an easy edge case to miss during interviews.

2. **Using pre-order or in-order traversal instead of post-order**  
   With pre-order, we process the parent before children, so we don't have the children's sums available yet. Post-order is essential because we need children's sums to compute the parent's subtree sum.

3. **Not tracking max frequency during traversal**  
   Some candidates build the frequency map first, then find the max frequency in a second pass. While this works, it's slightly less efficient. More importantly, tracking max frequency during traversal shows better algorithmic thinking.

4. **Incorrectly computing subtree sums**  
   Remember: subtree sum = `node.val + left_sum + right_sum`. A common mistake is to include the node's value twice or forget to include it at all.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Tree traversal with memoization** - Computing values bottom-up and reusing them. Similar problems:
   - **Diameter of Binary Tree** - Compute heights of subtrees and track max diameter
   - **Binary Tree Maximum Path Sum** - Compute maximum path sums through each node

2. **Frequency counting with hash maps** - Tracking occurrences and finding max frequency. Similar problems:
   - **Top K Frequent Elements** - Count frequencies and return top k
   - **Find Mode in Binary Search Tree** - Find most frequent values in BST

3. **Post-order traversal for aggregation** - When a node's value depends on its children's values. Similar problems:
   - **Maximum Depth of Binary Tree** - Depth = 1 + max(left_depth, right_depth)
   - **Balanced Binary Tree** - Check height balance at each node

## Key Takeaways

1. **Post-order traversal is ideal for bottom-up computation** - When you need to compute something for each node that depends on its children's results, think post-order DFS.

2. **Hash maps are perfect for frequency tracking** - When you need to count occurrences and find max/min frequency, a hash map with O(1) updates is the right tool.

3. **Compute once, reuse everywhere** - The memoization pattern (storing computed results to avoid redundant work) is fundamental to many tree problems. Always ask: "Am I computing this more than once?"

Related problems: [Subtree of Another Tree](/problem/subtree-of-another-tree), [Count Nodes Equal to Sum of Descendants](/problem/count-nodes-equal-to-sum-of-descendants)
