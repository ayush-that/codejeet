---
title: "How to Solve All Nodes Distance K in Binary Tree — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode All Nodes Distance K in Binary Tree. Medium difficulty, 67.4% acceptance rate. Topics: Hash Table, Tree, Depth-First Search, Breadth-First Search, Binary Tree."
date: "2027-01-31"
category: "dsa-patterns"
tags: ["all-nodes-distance-k-in-binary-tree", "hash-table", "tree", "depth-first-search", "medium"]
---

# How to Solve All Nodes Distance K in Binary Tree

You're given a binary tree, a target node, and an integer `k`. Your task is to find all nodes that are exactly distance `k` away from the target node. The tricky part is that distance in a tree isn't just measured downward through parent-child relationships—nodes can be located in different subtrees or even above the target node. This means you need to consider the entire tree structure, not just the subtree rooted at the target.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Tree:
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4

Target: node with value 5
k = 2
```

We need all nodes exactly 2 edges away from node 5.

**Step 1: Identify the target node** - Node 5

**Step 2: Look downward from target** - Nodes at distance 2 in the subtree rooted at 5:

- From 5 → 6 (distance 1) → no children (distance 2 doesn't exist)
- From 5 → 2 (distance 1) → 7 (distance 2) and 4 (distance 2)
  So downward we find: 7 and 4

**Step 3: Look upward/through parent** - We need to consider nodes reachable through parent 3:

- From 5 → 3 (distance 1) → 1 (distance 2)
- From 5 → 3 (distance 1) → 1 → 0 (distance 3, too far)
- From 5 → 3 (distance 1) → 1 → 8 (distance 3, too far)

**Step 4: Combine results** - Nodes at distance 2: 7, 4, and 1

The key insight: we need to treat the tree as an undirected graph where we can move both down (to children) and up (to parent). This is why we need to track parent relationships.

## Brute Force Approach

A naive approach might try to find all nodes at distance `k` by only exploring downward from the target. This fails because it misses nodes in other branches or above the target.

What a candidate might try:

1. Find the target node using DFS
2. From the target, do BFS to find nodes at distance `k` in its subtree
3. Realize this misses nodes reachable through parents

The problem with this approach is it treats the tree as directed (parent → child only), but distance in trees is measured in an undirected way. We need to be able to traverse both to children AND to parents.

## Optimized Approach

The key insight is to **transform the tree into an undirected graph** by adding parent pointers, then perform BFS from the target node.

**Step-by-step reasoning:**

1. **Why BFS?** - BFS naturally explores nodes in increasing distance order. When we reach distance `k`, we can collect all nodes at that level.
2. **Why track parents?** - In a binary tree, nodes only have references to children. To move "upward," we need to know each node's parent.
3. **How to build parent map?** - Do a DFS traversal, storing each node's parent in a hash map.
4. **How to avoid revisiting nodes?** - Use a visited set during BFS since the graph now has cycles (child ↔ parent).
5. **When to stop?** - BFS level by level until we reach distance `k`, then collect all nodes at that level.

This approach works because:

- Parent map gives us O(1) access to move upward
- BFS ensures we explore all nodes at distance `d` before distance `d+1`
- Visited set prevents infinite loops between parent and child

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(n) for parent map, visited set, and queue
class Solution:
    def distanceK(self, root: TreeNode, target: TreeNode, k: int) -> List[int]:
        # Step 1: Build parent map using DFS
        parent_map = {}

        def build_parent_map(node, parent):
            if not node:
                return
            parent_map[node] = parent
            build_parent_map(node.left, node)
            build_parent_map(node.right, node)

        build_parent_map(root, None)

        # Step 2: BFS from target to find nodes at distance k
        from collections import deque

        queue = deque([(target, 0)])  # (node, distance from target)
        visited = set([target])
        result = []

        while queue:
            node, distance = queue.popleft()

            # If we've reached distance k, add to result
            if distance == k:
                result.append(node.val)
                # Don't continue BFS from here - nodes further will be > k
                continue

            # Explore three directions: left child, right child, and parent
            neighbors = [node.left, node.right, parent_map.get(node)]

            for neighbor in neighbors:
                if neighbor and neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, distance + 1))

        return result
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(n) for parent map, visited set, and queue
var distanceK = function (root, target, k) {
  // Step 1: Build parent map using DFS
  const parentMap = new Map();

  function buildParentMap(node, parent) {
    if (!node) return;
    parentMap.set(node, parent);
    buildParentMap(node.left, node);
    buildParentMap(node.right, node);
  }

  buildParentMap(root, null);

  // Step 2: BFS from target to find nodes at distance k
  const queue = [[target, 0]]; // [node, distance from target]
  const visited = new Set([target]);
  const result = [];

  while (queue.length > 0) {
    const [node, distance] = queue.shift();

    // If we've reached distance k, add to result
    if (distance === k) {
      result.push(node.val);
      // Don't continue BFS from here - nodes further will be > k
      continue;
    }

    // Explore three directions: left child, right child, and parent
    const neighbors = [node.left, node.right, parentMap.get(node)];

    for (const neighbor of neighbors) {
      if (neighbor && !visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, distance + 1]);
      }
    }
  }

  return result;
};
```

```java
// Time: O(n) where n is number of nodes
// Space: O(n) for parent map, visited set, and queue
class Solution {
    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        // Step 1: Build parent map using DFS
        Map<TreeNode, TreeNode> parentMap = new HashMap<>();
        buildParentMap(root, null, parentMap);

        // Step 2: BFS from target to find nodes at distance k
        Queue<Pair<TreeNode, Integer>> queue = new LinkedList<>();
        Set<TreeNode> visited = new HashSet<>();
        List<Integer> result = new ArrayList<>();

        queue.offer(new Pair<>(target, 0));
        visited.add(target);

        while (!queue.isEmpty()) {
            Pair<TreeNode, Integer> current = queue.poll();
            TreeNode node = current.getKey();
            int distance = current.getValue();

            // If we've reached distance k, add to result
            if (distance == k) {
                result.add(node.val);
                // Don't continue BFS from here - nodes further will be > k
                continue;
            }

            // Explore three directions: left child, right child, and parent
            TreeNode[] neighbors = {node.left, node.right, parentMap.get(node)};

            for (TreeNode neighbor : neighbors) {
                if (neighbor != null && !visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(new Pair<>(neighbor, distance + 1));
                }
            }
        }

        return result;
    }

    private void buildParentMap(TreeNode node, TreeNode parent,
                                Map<TreeNode, TreeNode> parentMap) {
        if (node == null) return;
        parentMap.put(node, parent);
        buildParentMap(node.left, node, parentMap);
        buildParentMap(node.right, node, parentMap);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the parent map: O(n) - we visit every node once
- BFS traversal: O(n) - in worst case, we might visit all nodes
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Parent map: O(n) - stores parent for each node
- Visited set: O(n) - in worst case stores all nodes
- BFS queue: O(n) - in worst case stores all nodes at a level
- Recursion stack for DFS: O(h) where h is tree height, but O(n) in worst case (skewed tree)
- Total: O(n)

## Common Mistakes

1. **Forgetting to handle the `continue` when distance equals k** - If you don't skip further exploration when `distance == k`, you'll keep exploring nodes at distance > k, which is unnecessary and could cause issues if `k = 0`.

2. **Not using a visited set** - Without tracking visited nodes, you'll create infinite loops between parent and child. The parent map creates a cycle: parent ↔ child.

3. **Assuming target is always the root** - The target can be anywhere in the tree. Some candidates start BFS from root instead of from the actual target node.

4. **Mishandling null values in neighbor checking** - When checking `node.left`, `node.right`, and `parentMap.get(node)`, you must verify each is not null before adding to queue. Missing this check causes NullPointerExceptions.

## When You'll See This Pattern

This "tree as undirected graph" pattern appears in several tree problems:

1. **Amount of Time for Binary Tree to Be Infected (LeetCode 2385)** - Almost identical problem! Instead of finding nodes at distance k, you find the maximum distance from an infected node. The solution uses the same parent map + BFS approach.

2. **Find Nodes Distance K in Binary Tree (this problem)** - The exact same pattern.

3. **All Nodes Distance K in Binary Tree (variations)** - Any problem asking for distances in trees where you need to move both up and down.

4. **Clone Graph (LeetCode 133)** - While not a tree problem, it uses similar BFS with hash map to track relationships between original and cloned nodes.

The core pattern: when you need to traverse a tree in non-root-to-leaf directions, consider building auxiliary data structures (like parent maps) to enable movement in all directions.

## Key Takeaways

1. **Trees can be treated as graphs** - When distance matters and you need to move both up and down, add parent pointers to make the tree traversable in all directions.

2. **BFS is natural for distance-based problems** - BFS explores nodes in increasing distance order, making it perfect for finding nodes at specific distances.

3. **Parent maps are a useful technique** - Storing parent references in a hash map gives O(1) access to move upward in a tree, transforming tree problems into graph traversal problems.

Related problems: [Amount of Time for Binary Tree to Be Infected](/problem/amount-of-time-for-binary-tree-to-be-infected)
