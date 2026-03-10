---
title: "How to Solve Number of Good Leaf Nodes Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Good Leaf Nodes Pairs. Medium difficulty, 71.8% acceptance rate. Topics: Tree, Depth-First Search, Binary Tree."
date: "2026-07-16"
category: "dsa-patterns"
tags: ["number-of-good-leaf-nodes-pairs", "tree", "depth-first-search", "binary-tree", "medium"]
---

## How to Solve Number of Good Leaf Nodes Pairs

This problem asks us to count pairs of leaf nodes in a binary tree whose shortest path distance is ≤ a given `distance`. The challenge lies in efficiently computing distances between leaves without checking every possible pair, which would be too slow for larger trees. The key insight is that we can compute distances bottom-up while tracking leaf distances from each node.

---

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
Tree:       1
           / \
          2   3
         / \   \
        4   5   6
       / \       \
      7   8       9
Leaves: 7, 8, 5, 9
distance = 3
```

We need to count leaf pairs where the shortest path between them ≤ 3.

**Step-by-step reasoning:**

1. At leaf node 7: It's a leaf, so from its perspective, it has distance 0 to itself.
2. At leaf node 8: Distance 0 to itself.
3. At node 4: It has two children (7 and 8).
   - From node 4, leaf 7 is at distance 1 (4→7)
   - From node 4, leaf 8 is at distance 1 (4→8)
   - Check pairs within its subtree: leaf 7 and leaf 8 are distance 2 apart (7→4→8), which is ≤ 3 → count 1 pair.
4. At leaf node 5: Distance 0 to itself.
5. At node 2: It has children 4 and 5.
   - From node 2, leaves from left child (4):
     - Leaf 7 is at distance 2 (2→4→7)
     - Leaf 8 is at distance 2 (2→4→8)
   - From node 2, leaves from right child (5):
     - Leaf 5 is at distance 1 (2→5)
   - Check cross-pairs between leaves from different children:
     - (7,5): distance = 2 + 1 = 3 ≤ 3 → count 1
     - (8,5): distance = 2 + 1 = 3 ≤ 3 → count 1
6. Continue this process up the tree, counting valid pairs at each node.

The final count would be 3 good pairs: (7,8), (7,5), (8,5).

---

## Brute Force Approach

A naive approach would be:

1. Find all leaf nodes (O(n))
2. For each pair of leaves (O(L²) where L = number of leaves):
   - Find the shortest path between them by finding their Lowest Common Ancestor (LCA)
   - Calculate distance = dist(leaf1, LCA) + dist(leaf2, LCA)
   - If distance ≤ given distance, count it

**Why this fails:**

- In the worst case, a tree can have O(n) leaves (e.g., a perfect binary tree)
- Checking O(n²) pairs with LCA computation for each would be O(n³)
- Even with O(1) LCA queries after preprocessing, O(n²) pairs is too slow for n up to 2^10

**What candidates might try:**

- Storing all leaf nodes and checking all pairs → O(n²) time, acceptable for small n but not optimal
- Trying to use BFS from each leaf → O(n²) time and space

The brute force helps us understand the problem but isn't efficient enough for the constraints.

---

## Optimized Approach

The key insight is to use **post-order DFS** to propagate information upward:

**Core idea:** For each node, maintain a list of distances from that node to all leaves in its subtree. Since we only care about distances ≤ `distance`, we can truncate the list.

**Step-by-step reasoning:**

1. **Base case (leaf node):** Return `[0]` (distance 0 to itself)
2. **Internal node:**
   - Get distance lists from left and right children
   - Add 1 to each distance (since we're moving up one level to the current node)
   - Filter to keep only distances ≤ `distance` (optimization)
3. **Count pairs at current node:**
   - For each distance `d1` from left subtree and `d2` from right subtree
   - If `d1 + d2 ≤ distance`, that's a valid leaf pair
   - Count all such cross-pairs
4. **Combine lists:** Merge left and right distance lists (after adding 1) to return to parent
5. **Propagate counts upward:** Return both the count and distance list

**Why this works:**

- We only compare leaves from different subtrees at their LCA
- Each leaf pair is counted exactly once (at their LCA)
- By truncating lists to distances ≤ `distance`, we bound the work at each node

**Optimization:** Instead of storing full lists, we can use arrays/counters since distances are bounded by `distance`.

---

## Optimal Solution

Here's the complete implementation using post-order DFS with distance counting:

<div class="code-group">

```python
# Time: O(n * d^2) where d = distance, but typically O(n) since d ≤ 10
# Space: O(n) for recursion stack
class Solution:
    def countPairs(self, root: TreeNode, distance: int) -> int:
        self.result = 0

        def dfs(node):
            """Return list of distances from node to leaves in its subtree"""
            if not node:
                return []

            # Leaf node: distance 0 to itself
            if not node.left and not node.right:
                return [0]

            # Get distances from children
            left_dist = dfs(node.left)
            right_dist = dfs(node.right)

            # Count valid pairs between leaves from different subtrees
            for d1 in left_dist:
                for d2 in right_dist:
                    # +2 because: d1 is distance from left child to its leaf,
                    # d2 is distance from right child to its leaf,
                    # and we need to add the edges from current node to each child
                    if d1 + d2 + 2 <= distance:
                        self.result += 1

            # Combine distances, add 1 for the edge to parent
            # Filter distances > distance since they can't form valid pairs
            combined = []
            for d in left_dist + right_dist:
                if d + 1 <= distance:
                    combined.append(d + 1)

            return combined

        dfs(root)
        return self.result
```

```javascript
// Time: O(n * d^2) where d = distance
// Space: O(n) for recursion stack
var countPairs = function (root, distance) {
  let result = 0;

  const dfs = (node) => {
    if (!node) return [];

    // Leaf node
    if (!node.left && !node.right) {
      return [0];
    }

    // Get distances from children
    const leftDist = dfs(node.left);
    const rightDist = dfs(node.right);

    // Count pairs between leaves from different subtrees
    for (const d1 of leftDist) {
      for (const d2 of rightDist) {
        // +2 for edges from current node to each child
        if (d1 + d2 + 2 <= distance) {
          result++;
        }
      }
    }

    // Combine and increment distances for parent
    const combined = [];
    for (const d of [...leftDist, ...rightDist]) {
      if (d + 1 <= distance) {
        combined.push(d + 1);
      }
    }

    return combined;
  };

  dfs(root);
  return result;
};
```

```java
// Time: O(n * d^2) where d = distance
// Space: O(n) for recursion stack
class Solution {
    private int result = 0;

    public int countPairs(TreeNode root, int distance) {
        dfs(root, distance);
        return result;
    }

    private List<Integer> dfs(TreeNode node, int distance) {
        if (node == null) {
            return new ArrayList<>();
        }

        // Leaf node
        if (node.left == null && node.right == null) {
            List<Integer> distances = new ArrayList<>();
            distances.add(0);
            return distances;
        }

        // Get distances from children
        List<Integer> leftDist = dfs(node.left, distance);
        List<Integer> rightDist = dfs(node.right, distance);

        // Count valid pairs between subtrees
        for (int d1 : leftDist) {
            for (int d2 : rightDist) {
                if (d1 + d2 + 2 <= distance) {
                    result++;
                }
            }
        }

        // Combine and increment distances for parent
        List<Integer> combined = new ArrayList<>();
        for (int d : leftDist) {
            if (d + 1 <= distance) {
                combined.add(d + 1);
            }
        }
        for (int d : rightDist) {
            if (d + 1 <= distance) {
                combined.add(d + 1);
            }
        }

        return combined;
    }
}
```

</div>

**Optimized version using arrays (since distance ≤ 10):**

<div class="code-group">

```python
# Time: O(n) since distance ≤ 10
# Space: O(n) for recursion stack
class Solution:
    def countPairs(self, root: TreeNode, distance: int) -> int:
        self.result = 0

        def dfs(node):
            """Return array where arr[i] = count of leaves at distance i from node"""
            if not node:
                return [0] * (distance + 1)

            # Leaf node
            if not node.left and not node.right:
                arr = [0] * (distance + 1)
                arr[0] = 1  # distance 0 has 1 leaf
                return arr

            left_arr = dfs(node.left)
            right_arr = dfs(node.right)

            # Count pairs: left distance i, right distance j
            # They meet at current node, so total distance = i + j + 2
            for i in range(distance + 1):
                for j in range(distance + 1):
                    if i + j + 2 <= distance:
                        self.result += left_arr[i] * right_arr[j]

            # Combine arrays for parent
            combined = [0] * (distance + 1)
            for i in range(distance):
                combined[i + 1] = left_arr[i] + right_arr[i]

            return combined

        dfs(root)
        return self.result
```

</div>

---

## Complexity Analysis

**Time Complexity:**

- Basic approach: O(n \* d²) where d = distance
- Optimized array approach: O(n) since d ≤ 10 (problem constraint)
- Each node is visited once, and at each node we do O(d²) work to count pairs

**Space Complexity:**

- O(n) for recursion stack in worst case (skewed tree)
- O(d) for distance arrays at each recursion level
- Total: O(n + d) ≈ O(n) since d ≤ 10

---

## Common Mistakes

1. **Counting pairs multiple times:** Candidates might count the same leaf pair at multiple ancestors. Remember: each leaf pair has exactly one LCA where it should be counted.

2. **Forgetting to add 2 when counting cross-pairs:** When leaves are in different subtrees, you need to add the edges from the current node to each child (+1 +1 = +2).

3. **Not filtering distances > `distance`:** If you propagate all distances upward, arrays grow unnecessarily. Always truncate at `distance`.

4. **Handling single child nodes incorrectly:** When a node has only one child, you should still propagate distances upward but won't count any pairs at that node (no cross-subtree pairs).

5. **Base case confusion:** A leaf node should return distance 0, not an empty list. An empty list would mean "no leaves in this subtree," which is incorrect for a leaf node.

---

## When You'll See This Pattern

This **bottom-up distance propagation** pattern appears in several tree problems:

1. **Binary Tree Cameras (LeetCode 968):** Similar bottom-up approach where nodes report their state to parents.

2. **All Nodes Distance K in Binary Tree (LeetCode 863):** Propagating distances/target nodes upward and downward.

3. **Sum of Distances in Tree (LeetCode 834):** Computing distances by propagating counts and sums upward.

4. **Most Frequent Subtree Sum (LeetCode 508):** Bottom-up computation of subtree properties.

The core idea is always: compute something in the subtree, combine results at the current node, and propagate upward to the parent.

---

## Key Takeaways

1. **Bottom-up DFS is powerful for subtree aggregation problems:** When you need to compute something based on relationships between nodes in different subtrees, post-order traversal lets you combine information from children before processing the parent.

2. **Count pairs at LCA:** For problems involving pairs of nodes, counting them at their Lowest Common Ancestor ensures each pair is counted exactly once.

3. **Constraint-based optimization matters:** When a parameter is bounded (like `distance ≤ 10`), you can use arrays instead of lists for O(1) access and bounded work per node.

4. **Tree problems often have O(n) solutions:** If you find yourself needing O(n²) for a tree problem, there's usually a more efficient bottom-up or top-down approach.

---

[Practice this problem on CodeJeet](/problem/number-of-good-leaf-nodes-pairs)
