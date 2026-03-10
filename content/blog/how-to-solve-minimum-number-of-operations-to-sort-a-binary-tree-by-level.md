---
title: "How to Solve Minimum Number of Operations to Sort a Binary Tree by Level — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Operations to Sort a Binary Tree by Level. Medium difficulty, 74.2% acceptance rate. Topics: Tree, Breadth-First Search, Binary Tree."
date: "2027-03-19"
category: "dsa-patterns"
tags:
  [
    "minimum-number-of-operations-to-sort-a-binary-tree-by-level",
    "tree",
    "breadth-first-search",
    "binary-tree",
    "medium",
  ]
---

# How to Solve Minimum Number of Operations to Sort a Binary Tree by Level

This problem asks us to find the minimum number of swaps needed to make each level of a binary tree sorted in strictly increasing order, where we can only swap values between nodes at the same level. The tricky part is that we need to determine the minimum swaps for each level independently, and these swaps don't physically move nodes—only their values. This means we're essentially solving a "minimum swaps to sort an array" problem for each level of the tree.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Tree:
        5
       / \
      3   8
     / \   \
    1   6   4

Level 0: [5]
Level 1: [3, 8]
Level 2: [1, 6, 4]
```

**Level 0:** Only has one element [5], which is already sorted. Swaps needed: 0

**Level 1:** Has [3, 8]. This is already sorted (3 < 8). Swaps needed: 0

**Level 2:** Has [1, 6, 4]. We need to sort this to [1, 4, 6]. Let's find the minimum swaps:

1. Current: [1, 6, 4], Target: [1, 4, 6]
2. We can think of this as a graph problem: Each element needs to go to its correct position
3. Element 1 is already in position 0 (correct)
4. Element 6 should be at position 2, but it's at position 1
5. Element 4 should be at position 1, but it's at position 2
6. This forms a cycle: 6 → position 2 → 4 → position 1 → 6
7. For a cycle of length k, we need k-1 swaps to fix it
8. Here k=2 (positions 1 and 2 form a cycle), so we need 1 swap

Total swaps: 0 + 0 + 1 = 1

The key insight is that for each level, we need to compute the minimum swaps to sort that level's values, which is equivalent to finding the number of cycles in the permutation from current positions to sorted positions.

## Brute Force Approach

A naive approach might try to simulate all possible swap sequences and find the minimum. For a level with n elements, there are n! possible permutations, and checking all of them would be O(n!) time—completely infeasible even for moderate n.

Another brute force approach might try bubble sort or selection sort, which would require O(n²) swaps for each level. While this would work for small trees, it's not optimal. The problem with these approaches is they don't find the _minimum_ swaps—they just find _some_ sequence of swaps that sorts the array.

For example, using bubble sort on [3, 2, 1]:

- Bubble sort would swap (3,2) → [2,3,1], then swap (3,1) → [2,1,3], then swap (2,1) → [1,2,3]: 3 swaps
- But the minimum is actually 2 swaps: swap (3,1) → [1,2,3] directly

So we need a smarter approach that finds the true minimum.

## Optimized Approach

The key insight comes from recognizing that finding the minimum swaps to sort an array is a well-known problem with an O(n log n) solution. Here's the step-by-step reasoning:

1. **Level Order Traversal**: First, we need to collect all values at each level. We can use BFS (breadth-first search) since it naturally processes nodes level by level.

2. **Minimum Swaps Calculation**: For each level's array, we need to compute the minimum swaps to sort it. The optimal approach uses cycle detection:
   - Create a sorted copy of the array
   - Map each value to its target position in the sorted array
   - Treat this as a permutation problem: each element needs to move to its correct position
   - Find cycles in this permutation
   - For each cycle of length k, we need k-1 swaps to fix it
   - Sum (k-1) for all cycles to get the total minimum swaps

3. **Why Cycle Detection Works**: When we swap two elements, we're essentially moving elements along cycles. Each swap can fix at most one element's position. In a cycle of k elements, we can fix all k positions with k-1 swaps by "rotating" the cycle.

Let's walk through the cycle detection for [1, 6, 4] from our example:

- Sorted: [1, 4, 6]
- Position mapping: value 1 → position 0, value 4 → position 1, value 6 → position 2
- Current array indices with their values: [0:1, 1:6, 2:4]
- Follow the permutation:
  - Index 0 has value 1, which should be at position 0 ✓ (self-cycle, length 1)
  - Index 1 has value 6, which should be at position 2
  - Index 2 has value 4, which should be at position 1
  - This forms a cycle: 1 → 2 → 1 (length 2)
- Swaps needed: (1-1) + (2-1) = 0 + 1 = 1

## Optimal Solution

Here's the complete solution implementing the optimized approach:

<div class="code-group">

```python
# Time: O(n log n) where n is total nodes (due to sorting each level)
# Space: O(n) for storing level values and BFS queue
from collections import deque
from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def minimumOperations(self, root: Optional[TreeNode]) -> int:
        if not root:
            return 0

        total_swaps = 0
        queue = deque([root])

        # BFS for level order traversal
        while queue:
            level_size = len(queue)
            level_values = []

            # Collect all values at current level
            for _ in range(level_size):
                node = queue.popleft()
                level_values.append(node.val)

                # Add children to queue for next level
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            # Calculate minimum swaps for this level
            total_swaps += self.min_swaps_to_sort(level_values)

        return total_swaps

    def min_swaps_to_sort(self, arr):
        """Calculate minimum swaps to sort array using cycle detection."""
        n = len(arr)

        # Create a list of (value, original_index) pairs
        indexed_arr = list(enumerate(arr))

        # Sort by value to get target positions
        indexed_arr.sort(key=lambda x: x[1])

        # visited array to track processed indices
        visited = [False] * n
        swaps = 0

        # Find cycles in the permutation
        for i in range(n):
            # Skip if already visited or element is already in correct position
            if visited[i] or indexed_arr[i][0] == i:
                continue

            # Start a new cycle
            cycle_size = 0
            j = i

            # Traverse the cycle
            while not visited[j]:
                visited[j] = True
                # Move to the position where the current element should go
                j = indexed_arr[j][0]
                cycle_size += 1

            # Add swaps needed for this cycle
            if cycle_size > 1:
                swaps += (cycle_size - 1)

        return swaps
```

```javascript
// Time: O(n log n) where n is total nodes (due to sorting each level)
// Space: O(n) for storing level values and BFS queue
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
var minimumOperations = function (root) {
  if (!root) return 0;

  let totalSwaps = 0;
  const queue = [root];

  // BFS for level order traversal
  while (queue.length > 0) {
    const levelSize = queue.length;
    const levelValues = [];

    // Collect all values at current level
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      levelValues.push(node.val);

      // Add children to queue for next level
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    // Calculate minimum swaps for this level
    totalSwaps += minSwapsToSort(levelValues);
  }

  return totalSwaps;
};

/**
 * Calculate minimum swaps to sort array using cycle detection
 * @param {number[]} arr - The array to sort
 * @return {number} Minimum swaps needed
 */
function minSwapsToSort(arr) {
  const n = arr.length;

  // Create array of [original_index, value] pairs
  const indexedArr = arr.map((value, index) => [index, value]);

  // Sort by value to get target positions
  indexedArr.sort((a, b) => a[1] - b[1]);

  // visited array to track processed indices
  const visited = new Array(n).fill(false);
  let swaps = 0;

  // Find cycles in the permutation
  for (let i = 0; i < n; i++) {
    // Skip if already visited or element is already in correct position
    if (visited[i] || indexedArr[i][0] === i) {
      continue;
    }

    // Start a new cycle
    let cycleSize = 0;
    let j = i;

    // Traverse the cycle
    while (!visited[j]) {
      visited[j] = true;
      // Move to the position where the current element should go
      j = indexedArr[j][0];
      cycleSize++;
    }

    // Add swaps needed for this cycle
    if (cycleSize > 1) {
      swaps += cycleSize - 1;
    }
  }

  return swaps;
}
```

```java
// Time: O(n log n) where n is total nodes (due to sorting each level)
// Space: O(n) for storing level values and BFS queue
import java.util.*;

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
    public int minimumOperations(TreeNode root) {
        if (root == null) return 0;

        int totalSwaps = 0;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        // BFS for level order traversal
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> levelValues = new ArrayList<>();

            // Collect all values at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                levelValues.add(node.val);

                // Add children to queue for next level
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }

            // Calculate minimum swaps for this level
            totalSwaps += minSwapsToSort(levelValues);
        }

        return totalSwaps;
    }

    private int minSwapsToSort(List<Integer> arr) {
        int n = arr.size();

        // Create list of pairs [original_index, value]
        List<int[]> indexedArr = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            indexedArr.add(new int[]{i, arr.get(i)});
        }

        // Sort by value to get target positions
        indexedArr.sort((a, b) -> Integer.compare(a[1], b[1]));

        // visited array to track processed indices
        boolean[] visited = new boolean[n];
        int swaps = 0;

        // Find cycles in the permutation
        for (int i = 0; i < n; i++) {
            // Skip if already visited or element is already in correct position
            if (visited[i] || indexedArr.get(i)[0] == i) {
                continue;
            }

            // Start a new cycle
            int cycleSize = 0;
            int j = i;

            // Traverse the cycle
            while (!visited[j]) {
                visited[j] = true;
                // Move to the position where the current element should go
                j = indexedArr.get(j)[0];
                cycleSize++;
            }

            // Add swaps needed for this cycle
            if (cycleSize > 1) {
                swaps += (cycleSize - 1);
            }
        }

        return swaps;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- BFS traversal takes O(n) time where n is the number of nodes
- For each level with k elements, we sort to create the target permutation: O(k log k)
- In the worst case, if all nodes are at one level, this becomes O(n log n)
- The cycle detection for each level is O(k) since we visit each element once
- Total: O(n) + Σ O(k log k) ≤ O(n log n)

**Space Complexity: O(n)**

- BFS queue can hold up to O(n) nodes in the worst case (complete binary tree's last level)
- We store level values: O(n) total across all levels
- Additional O(k) for the cycle detection algorithm per level
- Total: O(n)

## Common Mistakes

1. **Forgetting that values are unique**: The problem states values are unique, which is crucial for the cycle detection approach. If values weren't unique, we'd need a different approach since multiple elements could have the same target position.

2. **Using the wrong swap counting method**: Some candidates try to use bubble sort or count inversions. While counting inversions gives the minimum adjacent swaps, we need minimum arbitrary swaps (any two positions can be swapped). These are different problems with different solutions.

3. **Not handling single-element levels correctly**: A level with one element needs 0 swaps. The cycle detection handles this automatically (cycle size 1 contributes 0 swaps), but some implementations might add unnecessary swaps.

4. **Confusing node positions with values**: Remember we're swapping values, not nodes. The tree structure remains unchanged. This is important because we only care about the values at each level, not their positions in the tree structure.

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **Level Order Traversal (BFS)**: Used in many tree problems like:
   - Binary Tree Level Order Traversal (LeetCode 102) - directly collects level values
   - Binary Tree Zigzag Level Order Traversal (LeetCode 103) - BFS with direction alternation
   - Find Largest Value in Each Tree Row (LeetCode 515) - process each level independently

2. **Minimum Swaps to Sort Array**: The cycle detection technique appears in:
   - Minimum Swaps to Arrange a Binary Grid (LeetCode 1536) - similar cycle counting
   - Minimum Number of Operations to Make Array Continuous (LeetCode 2009) - involves sorting and position mapping
   - The core technique is useful anytime you need to find the minimum swaps to achieve a target permutation

## Key Takeaways

1. **Break complex problems into subproblems**: This problem combines tree traversal with array sorting. Recognizing that each level can be processed independently is key.

2. **Cycle detection for minimum swaps**: When you need to find the minimum swaps to sort an array (not just adjacent swaps), think about finding cycles in the permutation from current to target positions.

3. **BFS for level-based tree problems**: Whenever a problem mentions "level" in a tree, BFS is usually the right approach since it naturally processes nodes level by level.

Related problems: [Binary Tree Level Order Traversal](/problem/binary-tree-level-order-traversal), [Longest Cycle in a Graph](/problem/longest-cycle-in-a-graph)
