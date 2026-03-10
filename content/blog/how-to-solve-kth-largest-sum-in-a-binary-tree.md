---
title: "How to Solve Kth Largest Sum in a Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Kth Largest Sum in a Binary Tree. Medium difficulty, 59.0% acceptance rate. Topics: Tree, Breadth-First Search, Sorting, Binary Tree."
date: "2026-04-11"
category: "dsa-patterns"
tags: ["kth-largest-sum-in-a-binary-tree", "tree", "breadth-first-search", "sorting", "medium"]
---

# How to Solve Kth Largest Sum in a Binary Tree

This problem asks us to find the k-th largest sum among all levels in a binary tree. While it sounds straightforward, it combines three fundamental concepts: tree traversal (BFS), level-wise aggregation, and selection algorithms. The tricky part is efficiently handling the case where k might be larger than the number of levels, and making sure we extract the k-th largest value from potentially many level sums without unnecessary overhead.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Consider this binary tree:

```
        5
       / \
      8   9
     / \   \
    2   1   7
   /
  4
```

And let's say k = 2 (we want the 2nd largest level sum).

**Step 1: Calculate level sums**

- Level 0: Only node 5 → sum = 5
- Level 1: Nodes 8 and 9 → sum = 8 + 9 = 17
- Level 2: Nodes 2, 1, and 7 → sum = 2 + 1 + 7 = 10
- Level 3: Only node 4 → sum = 4

**Step 2: Collect all level sums**
We have: [5, 17, 10, 4]

**Step 3: Sort in descending order**
Sorted: [17, 10, 5, 4]

**Step 4: Find the k-th largest (k=2)**
The 2nd largest is 10 (at index 1 in 0-based indexing, or index 2 in 1-based).

**Edge case check:** We have 4 levels and k=2, so k ≤ number of levels. If k were 5, we'd return -1 as specified.

This walkthrough reveals our core tasks: traverse the tree level by level, sum each level, then find the k-th largest among those sums.

## Brute Force Approach

The most straightforward approach follows exactly what we did in the visual walkthrough:

1. Perform BFS (level-order traversal) to collect all level sums
2. Sort all level sums in descending order
3. Check if k ≤ number of levels
4. Return the (k-1)-th element (0-based indexing) or -1 if k is too large

While this approach is conceptually simple and works correctly, it's inefficient for large trees because we're sorting all level sums when we only need the k-th largest. If we have L levels, sorting takes O(L log L) time. For a balanced binary tree with n nodes, L ≈ log₂(n), so O(log n · log log n) isn't terrible, but we can do better.

What some candidates might try (and fail with):

- Trying to use DFS without tracking levels properly
- Attempting to find k-th largest during traversal (which doesn't work because we don't know all sums yet)
- Forgetting to handle the case where k > number of levels

## Optimized Approach

The key insight is that we don't need to fully sort all level sums—we only need the k-th largest. This suggests two optimization paths:

1. **Use a min-heap of size k**: As we compute level sums, maintain a min-heap with the k largest sums seen so far. When the heap size exceeds k, remove the smallest (which is at the root of a min-heap). At the end, if we have k elements, the root is the k-th largest.

2. **Quickselect algorithm**: After collecting all sums, use quickselect (O(L) average time) instead of full sort (O(L log L)).

For this problem, the heap approach is particularly elegant because:

- We process sums as we compute them
- The heap never exceeds size k, keeping memory usage low
- It naturally handles the case where we have fewer than k levels (heap won't reach size k)

However, there's a catch: if k is large (close to L), maintaining a min-heap of size k isn't much better than sorting. But in practice, and for interview settings, the heap solution demonstrates good algorithmic thinking.

The step-by-step reasoning:

1. If the tree is empty, return -1 (no levels)
2. Initialize a min-heap (priority queue where smallest element is at top)
3. Perform BFS level by level
4. For each level, compute the sum
5. Push the sum to the heap
6. If heap size > k, pop the smallest (maintaining only k largest)
7. After BFS, if heap size < k, return -1 (not enough levels)
8. Otherwise, the root of the heap is the k-th largest

## Optimal Solution

Here's the complete solution using BFS with a min-heap to track the k largest level sums:

<div class="code-group">

```python
# Time: O(n + L log k) where n = number of nodes, L = number of levels
# Space: O(max(width, k)) where width = maximum nodes at any level
from collections import deque
import heapq

def kthLargestLevelSum(root, k):
    """
    Find the k-th largest level sum in a binary tree.

    Args:
        root: TreeNode - root of the binary tree
        k: int - which largest sum to find (1-indexed)

    Returns:
        int - k-th largest level sum, or -1 if fewer than k levels
    """
    # Edge case: empty tree has no levels
    if not root:
        return -1

    # Min-heap to maintain k largest level sums
    # We'll use negative values trick or maintain as min-heap
    min_heap = []

    # BFS queue initialization
    queue = deque([root])

    # Process tree level by level
    while queue:
        level_size = len(queue)
        level_sum = 0

        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val

            # Add children to queue for next level
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        # Add current level sum to min-heap
        heapq.heappush(min_heap, level_sum)

        # If we have more than k elements, remove the smallest
        # This keeps only the k largest sums in the heap
        if len(min_heap) > k:
            heapq.heappop(min_heap)

    # If we have fewer than k levels, return -1
    if len(min_heap) < k:
        return -1

    # The root of min-heap (smallest among k largest) is k-th largest
    return min_heap[0]
```

```javascript
// Time: O(n + L log k) where n = number of nodes, L = number of levels
// Space: O(max(width, k)) where width = maximum nodes at any level

/**
 * Find the k-th largest level sum in a binary tree.
 * @param {TreeNode} root - root of the binary tree
 * @param {number} k - which largest sum to find (1-indexed)
 * @return {number} k-th largest level sum, or -1 if fewer than k levels
 */
function kthLargestLevelSum(root, k) {
  // Edge case: empty tree has no levels
  if (!root) return -1;

  // Min-heap (priority queue) to maintain k largest level sums
  // JavaScript doesn't have built-in heap, so we'll use array and sort
  // For interview, you can implement heap or mention library
  const levelSums = [];
  const queue = [root];

  // Process tree level by level using BFS
  while (queue.length > 0) {
    const levelSize = queue.length;
    let levelSum = 0;

    // Process all nodes at current level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      levelSum += node.val;

      // Add children to queue for next level
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    // Add current level sum to our collection
    levelSums.push(levelSum);
  }

  // If we have fewer than k levels, return -1
  if (levelSums.length < k) return -1;

  // Sort in descending order and get k-th largest
  levelSums.sort((a, b) => b - a);
  return levelSums[k - 1];
}

// Note: For true heap implementation in JavaScript, you would:
// 1. Use a MinPriorityQueue from a library, or
// 2. Implement your own heap class
// The array+sort approach is acceptable for interviews when k is small
// or when you explain you'd use a heap in production
```

```java
// Time: O(n + L log k) where n = number of nodes, L = number of levels
// Space: O(max(width, k)) where width = maximum nodes at any level

import java.util.*;

class Solution {
    public long kthLargestLevelSum(TreeNode root, int k) {
        // Edge case: empty tree has no levels
        if (root == null) return -1;

        // Min-heap to maintain k largest level sums
        PriorityQueue<Long> minHeap = new PriorityQueue<>();

        // Queue for BFS level-order traversal
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        // Process tree level by level
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            long levelSum = 0;

            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                levelSum += node.val;

                // Add children to queue for next level
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }

            // Add current level sum to min-heap
            minHeap.offer(levelSum);

            // If we have more than k elements, remove the smallest
            // This keeps only the k largest sums in the heap
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }

        // If we have fewer than k levels, return -1
        if (minHeap.size() < k) return -1;

        // The root of min-heap (smallest among k largest) is k-th largest
        return minHeap.peek();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- BFS traversal: O(n) where n is the number of nodes (we visit each node once)
- Heap operations: For each of L levels, we do O(log k) heap operations
- Total: O(n + L log k)

**Space Complexity:**

- BFS queue: O(w) where w is the maximum width of the tree (maximum nodes at any level)
- Heap: O(k) to store k largest level sums
- Total: O(max(w, k))

For a balanced binary tree:

- n nodes, L ≈ log₂n levels, w ≈ n/2 at the last level
- Time: O(n + log n · log k) ≈ O(n) for large n
- Space: O(max(n/2, k)) ≈ O(n) in worst case

The heap optimization is most valuable when k is small compared to L. If k ≈ L, we're essentially sorting, and the heap approach offers little benefit over sorting the level sums array directly.

## Common Mistakes

1. **Forgetting to handle k > number of levels**: This is the most common oversight. Always check if heap size < k at the end and return -1 as specified.

2. **Using DFS without proper level tracking**: DFS can work if you track levels carefully (using recursion depth or explicit level parameter), but BFS is more natural for level-wise operations. With DFS, you might need to store sums in a dictionary keyed by level.

3. **Off-by-one errors with k**: Remember k is 1-indexed (1st largest, 2nd largest, etc.). When using a min-heap of size k, the root is the k-th largest. When sorting, you need index k-1.

4. **Integer overflow with large sums**: Use long integers (64-bit) in languages like Java to avoid overflow when summing many large values. The tree values can be up to 10⁵, and a level could have many nodes.

5. **Inefficient heap usage**: Pushing and then popping if size > k is correct. Some candidates try to maintain heap size exactly k by checking before pushing, but then they might miss a sum that should replace a smaller one in the heap.

## When You'll See This Pattern

This problem combines several patterns that appear frequently:

1. **Level-order traversal (BFS)**: Used in problems like:
   - "Binary Tree Level Order Traversal" (LeetCode 102) - basic BFS
   - "Maximum Level Sum of a Binary Tree" (LeetCode 1161) - very similar but finds max instead of k-th largest
   - "Find Largest Value in Each Tree Row" (LeetCode 515) - similar level-wise aggregation

2. **K-th largest/smallest element**: The heap approach for finding k-th largest appears in:
   - "Kth Largest Element in an Array" (LeetCode 215) - same core concept
   - "Top K Frequent Elements" (LeetCode 347) - similar heap usage
   - "Find K Closest Elements" (LeetCode 658) - uses heap or two pointers

3. **Tree aggregation problems**: Where you need to compute statistics across tree levels or subtrees.

## Key Takeaways

1. **BFS is natural for level-wise operations**: When a problem mentions "level" in a tree, think BFS first. The queue-based level-order traversal pattern is worth memorizing.

2. **Use heaps for k-th largest/smallest problems**: Maintaining a min-heap of size k for k-th largest (or max-heap for k-th smallest) is a powerful pattern that avoids full sorting.

3. **Consider trade-offs**: The heap approach is O(L log k) for heap operations vs O(L log L) for sorting. When k is small, heap wins. When k ≈ L, sorting might be simpler. In interviews, explain you know both and choose based on constraints.

4. **Always check edge cases**: Empty tree, k larger than levels, single node trees, and skewed trees (which become linked lists) are all important test cases.

This problem beautifully combines tree traversal with selection algorithms, testing both your data structure knowledge and your ability to optimize for specific constraints.

---

**Related problems:**

- [Binary Tree Preorder Traversal](/problem/binary-tree-preorder-traversal)
- [Maximum Level Sum of a Binary Tree](/problem/maximum-level-sum-of-a-binary-tree)
- [Find the Level of Tree with Minimum Sum](/problem/find-the-level-of-tree-with-minimum-sum)
