---
title: "How to Solve Number Of Ways To Reconstruct A Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number Of Ways To Reconstruct A Tree. Hard difficulty, 45.5% acceptance rate. Topics: Array, Hash Table, Tree, Graph Theory, Simulation."
date: "2026-08-02"
category: "dsa-patterns"
tags: ["number-of-ways-to-reconstruct-a-tree", "array", "hash-table", "tree", "hard"]
---

# How to Solve Number Of Ways To Reconstruct A Tree

This problem asks us to determine how many valid rooted trees can be constructed from a set of ancestor-descendant relationships. Given pairs `[xi, yi]` where `xi` is an ancestor of `yi`, we need to count all possible rooted trees that satisfy all given relationships. The challenge lies in determining when multiple valid trees are possible and when the relationships are inconsistent.

What makes this problem tricky is that we're not just building one tree - we're counting all possible valid trees. This requires understanding the structural constraints that make a tree uniquely determined versus when multiple arrangements are possible.

## Visual Walkthrough

Let's trace through a concrete example: `pairs = [[1,2],[2,3],[1,3]]`

This tells us:

- 1 is ancestor of 2
- 2 is ancestor of 3
- 1 is ancestor of 3

**Step 1: Understanding the relationships**
From these pairs, we can deduce that 1 must be the root (it has no ancestors). 2 is a child of 1, and 3 could be either:

- A child of 2 (making the chain 1→2→3)
- A child of 1 (making 2 and 3 siblings under 1)

**Step 2: Checking constraints**
The key insight: If 3 were a child of 1, then the pair `[2,3]` would mean 2 is an ancestor of 3. But if they're siblings (both children of 1), 2 cannot be an ancestor of 3! This violates the given relationship.

**Step 3: Determining uniqueness**
Therefore, 3 must be a child of 2 to satisfy `[2,3]`. This gives us exactly one valid tree: 1→2→3.

**Step 4: Another example with multiple ways**
Consider `pairs = [[1,2],[1,3]]`

- 1 is ancestor of 2
- 1 is ancestor of 3

Here, 2 and 3 could be:

- Both direct children of 1 (siblings)
- 2 as child of 1, and 3 as child of 2 (but then 1 would also be ancestor of 3, which is true)
- 3 as child of 1, and 2 as child of 3 (similar logic)

Actually, let's think carefully: If we make 3 a child of 2, then `[1,3]` is still satisfied (1 is ancestor of 3 through 2). But wait - we don't have `[2,3]` in our pairs, so 2 doesn't have to be an ancestor of 3. The absence of `[2,3]` means 2 and 3 could be in any order!

**Step 5: The key insight**
The number of ways depends on whether we can determine parent-child relationships uniquely. If for two nodes A and B where A is ancestor of B, and every ancestor of B is also an ancestor of A, then A must be the direct parent of B. Otherwise, there are multiple possibilities.

## Brute Force Approach

A naive approach would try to generate all possible trees with the given nodes and check each one against all pairs. For n nodes, there are Catalan(n) possible binary tree structures (exponential growth), and for each tree we'd need to verify O(n²) ancestor relationships.

Even for small n, this becomes intractable. For example, with just 10 nodes, there are over 16,000 possible binary trees, and we'd need to check 100 relationships for each.

The brute force would look something like:

1. Generate all possible rooted trees with the given nodes
2. For each tree, verify all ancestor relationships in pairs
3. Count valid trees

This is clearly infeasible for the problem constraints (up to 1000 pairs).

## Optimized Approach

The key insight comes from understanding how ancestor relationships constrain tree structure:

1. **Root identification**: The root must be a node that appears in pairs with every other node (since it's ancestor to all).
2. **Parent-child determination**: For any node B, its parent must be the node A such that:
   - A is an ancestor of B (pair [A,B] exists)
   - Every ancestor of B is also an ancestor of A
   - A has the maximum number of ancestors among nodes satisfying the first condition
3. **Multiple ways**: If for node B, there are multiple candidates for parent that satisfy these conditions, then we have multiple possible trees.

**Step-by-step reasoning:**

1. Build an adjacency list of ancestors for each node
2. Sort nodes by number of ancestors (descending) - this ensures we process from root downward
3. For each node, find its possible parents
4. If no valid parent exists and the node isn't the root → invalid (0 ways)
5. If multiple valid parents exist → multiple trees possible
6. Track the count: start with 1 way, multiply by 2 for each node with multiple valid parents

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2) where n is number of nodes | Space: O(n^2)
def checkWays(pairs):
    """
    Counts the number of valid rooted trees that satisfy all given ancestor relationships.

    The key insight: For each node, its parent must be the node that:
    1. Is an ancestor of it (pair exists)
    2. Has all the same ancestors as it (plus itself)
    3. Has the maximum number of ancestors among such candidates

    If multiple nodes satisfy these conditions for a given node, then there are
    multiple possible trees.
    """
    if not pairs:
        return 0

    # Step 1: Build adjacency list and node set
    adj = {}
    nodes = set()

    for x, y in pairs:
        # Ensure xi < yi as given in problem
        if x > y:
            x, y = y, x

        # Add to adjacency lists (undirected for ancestor relationships)
        adj.setdefault(x, set()).add(y)
        adj.setdefault(y, set()).add(x)
        nodes.add(x)
        nodes.add(y)

    # Step 2: Sort nodes by number of connections (descending)
    # More connections = more descendants = closer to root
    sorted_nodes = sorted(nodes, key=lambda x: -len(adj.get(x, set())))

    # Check if root exists (must be connected to all other nodes)
    root_candidate = sorted_nodes[0]
    if len(adj.get(root_candidate, set())) != len(nodes) - 1:
        return 0  # No valid root

    # Step 3: Initialize parent array and ways counter
    parent = {}
    ways = 1

    # Step 4: Process each node to find its parent
    for i, node in enumerate(sorted_nodes):
        # Find potential parents (nodes that come before in sorted order
        # and are connected to current node)
        potential_parents = []

        for j in range(i):
            ancestor = sorted_nodes[j]
            if ancestor in adj.get(node, set()):
                potential_parents.append(ancestor)

        # If this is not the root, it must have at least one parent
        if i > 0 and not potential_parents:
            return 0  # Invalid: node has no ancestor

        # Find the actual parent among potential parents
        # The parent must be connected to ALL nodes that current node is connected to
        # (except the parent itself and nodes that come after in sorted order)
        actual_parent = None
        multiple_parents = False

        for candidate in potential_parents:
            # Check if candidate's connections include all of node's connections
            # (that come before in sorted order)
            valid = True
            for k in range(i):
                other = sorted_nodes[k]
                if other == candidate:
                    continue
                if other in adj.get(node, set()) and other not in adj.get(candidate, set()):
                    valid = False
                    break

            if valid:
                if actual_parent is None:
                    actual_parent = candidate
                else:
                    # Multiple valid parents found
                    multiple_parents = True

        # If no valid parent found (and this isn't the root), invalid
        if i > 0 and actual_parent is None:
            return 0

        # Record parent and update ways count
        if actual_parent is not None:
            parent[node] = actual_parent

        if multiple_parents:
            ways = 2  # Can double for each node with multiple parents

    return ways
```

```javascript
// Time: O(n^2) where n is number of nodes | Space: O(n^2)
function checkWays(pairs) {
  /**
   * Counts the number of valid rooted trees that satisfy all given ancestor relationships.
   *
   * The key insight: For each node, its parent must be the node that:
   * 1. Is an ancestor of it (pair exists)
   * 2. Has all the same ancestors as it (plus itself)
   * 3. Has the maximum number of ancestors among such candidates
   *
   * If multiple nodes satisfy these conditions for a given node, then there are
   * multiple possible trees.
   */
  if (!pairs || pairs.length === 0) {
    return 0;
  }

  // Step 1: Build adjacency list and node set
  const adj = new Map();
  const nodes = new Set();

  for (const [x, y] of pairs) {
    let a = x,
      b = y;
    // Ensure xi < yi as given in problem
    if (a > b) {
      [a, b] = [b, a];
    }

    // Add to adjacency lists (undirected for ancestor relationships)
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());

    adj.get(a).add(b);
    adj.get(b).add(a);

    nodes.add(a);
    nodes.add(b);
  }

  // Step 2: Sort nodes by number of connections (descending)
  // More connections = more descendants = closer to root
  const sortedNodes = Array.from(nodes).sort((a, b) => {
    const sizeA = adj.get(a) ? adj.get(a).size : 0;
    const sizeB = adj.get(b) ? adj.get(b).size : 0;
    return sizeB - sizeA; // Descending order
  });

  // Check if root exists (must be connected to all other nodes)
  const rootCandidate = sortedNodes[0];
  if (!adj.get(rootCandidate) || adj.get(rootCandidate).size !== nodes.size - 1) {
    return 0; // No valid root
  }

  // Step 3: Initialize parent map and ways counter
  const parent = new Map();
  let ways = 1;

  // Step 4: Process each node to find its parent
  for (let i = 0; i < sortedNodes.length; i++) {
    const node = sortedNodes[i];

    // Find potential parents (nodes that come before in sorted order
    // and are connected to current node)
    const potentialParents = [];

    for (let j = 0; j < i; j++) {
      const ancestor = sortedNodes[j];
      if (adj.get(node) && adj.get(node).has(ancestor)) {
        potentialParents.push(ancestor);
      }
    }

    // If this is not the root, it must have at least one parent
    if (i > 0 && potentialParents.length === 0) {
      return 0; // Invalid: node has no ancestor
    }

    // Find the actual parent among potential parents
    // The parent must be connected to ALL nodes that current node is connected to
    // (except the parent itself and nodes that come after in sorted order)
    let actualParent = null;
    let multipleParents = false;

    for (const candidate of potentialParents) {
      // Check if candidate's connections include all of node's connections
      // (that come before in sorted order)
      let valid = true;

      for (let k = 0; k < i; k++) {
        const other = sortedNodes[k];
        if (other === candidate) continue;

        if (
          adj.get(node) &&
          adj.get(node).has(other) &&
          (!adj.get(candidate) || !adj.get(candidate).has(other))
        ) {
          valid = false;
          break;
        }
      }

      if (valid) {
        if (actualParent === null) {
          actualParent = candidate;
        } else {
          // Multiple valid parents found
          multipleParents = true;
        }
      }
    }

    // If no valid parent found (and this isn't the root), invalid
    if (i > 0 && actualParent === null) {
      return 0;
    }

    // Record parent and update ways count
    if (actualParent !== null) {
      parent.set(node, actualParent);
    }

    if (multipleParents) {
      ways = 2; // Can double for each node with multiple parents
    }
  }

  return ways;
}
```

```java
// Time: O(n^2) where n is number of nodes | Space: O(n^2)
import java.util.*;

class Solution {
    public int checkWays(int[][] pairs) {
        /**
         * Counts the number of valid rooted trees that satisfy all given ancestor relationships.
         *
         * The key insight: For each node, its parent must be the node that:
         * 1. Is an ancestor of it (pair exists)
         * 2. Has all the same ancestors as it (plus itself)
         * 3. Has the maximum number of ancestors among such candidates
         *
         * If multiple nodes satisfy these conditions for a given node, then there are
         * multiple possible trees.
         */
        if (pairs == null || pairs.length == 0) {
            return 0;
        }

        // Step 1: Build adjacency list and node set
        Map<Integer, Set<Integer>> adj = new HashMap<>();
        Set<Integer> nodes = new HashSet<>();

        for (int[] pair : pairs) {
            int x = pair[0], y = pair[1];
            // Ensure xi < yi as given in problem
            if (x > y) {
                int temp = x;
                x = y;
                y = temp;
            }

            // Add to adjacency lists (undirected for ancestor relationships)
            adj.putIfAbsent(x, new HashSet<>());
            adj.putIfAbsent(y, new HashSet<>());

            adj.get(x).add(y);
            adj.get(y).add(x);

            nodes.add(x);
            nodes.add(y);
        }

        // Step 2: Sort nodes by number of connections (descending)
        // More connections = more descendants = closer to root
        List<Integer> sortedNodes = new ArrayList<>(nodes);
        sortedNodes.sort((a, b) -> {
            int sizeA = adj.getOrDefault(a, new HashSet<>()).size();
            int sizeB = adj.getOrDefault(b, new HashSet<>()).size();
            return Integer.compare(sizeB, sizeA); // Descending order
        });

        // Check if root exists (must be connected to all other nodes)
        int rootCandidate = sortedNodes.get(0);
        if (adj.getOrDefault(rootCandidate, new HashSet<>()).size() != nodes.size() - 1) {
            return 0; // No valid root
        }

        // Step 3: Initialize parent map and ways counter
        Map<Integer, Integer> parent = new HashMap<>();
        int ways = 1;

        // Step 4: Process each node to find its parent
        for (int i = 0; i < sortedNodes.size(); i++) {
            int node = sortedNodes.get(i);

            // Find potential parents (nodes that come before in sorted order
            // and are connected to current node)
            List<Integer> potentialParents = new ArrayList<>();

            for (int j = 0; j < i; j++) {
                int ancestor = sortedNodes.get(j);
                if (adj.getOrDefault(node, new HashSet<>()).contains(ancestor)) {
                    potentialParents.add(ancestor);
                }
            }

            // If this is not the root, it must have at least one parent
            if (i > 0 && potentialParents.isEmpty()) {
                return 0; // Invalid: node has no ancestor
            }

            // Find the actual parent among potential parents
            // The parent must be connected to ALL nodes that current node is connected to
            // (except the parent itself and nodes that come after in sorted order)
            Integer actualParent = null;
            boolean multipleParents = false;

            for (int candidate : potentialParents) {
                // Check if candidate's connections include all of node's connections
                // (that come before in sorted order)
                boolean valid = true;

                for (int k = 0; k < i; k++) {
                    int other = sortedNodes.get(k);
                    if (other == candidate) continue;

                    if (adj.getOrDefault(node, new HashSet<>()).contains(other) &&
                        !adj.getOrDefault(candidate, new HashSet<>()).contains(other)) {
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    if (actualParent == null) {
                        actualParent = candidate;
                    } else {
                        // Multiple valid parents found
                        multipleParents = true;
                    }
                }
            }

            // If no valid parent found (and this isn't the root), invalid
            if (i > 0 && actualParent == null) {
                return 0;
            }

            // Record parent and update ways count
            if (actualParent != null) {
                parent.put(node, actualParent);
            }

            if (multipleParents) {
                ways = 2; // Can double for each node with multiple parents
            }
        }

        return ways;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Building adjacency list: O(p) where p is number of pairs
- Sorting nodes: O(n log n) where n is number of unique nodes
- Main processing: O(n²) - for each node, we compare against all previous nodes
- Overall: O(n²) dominates since in worst case p = O(n²)

**Space Complexity: O(n²)**

- Adjacency list stores up to O(n²) relationships in worst case (complete graph)
- Node sets and sorted lists: O(n)
- Parent mapping: O(n)

## Common Mistakes

1. **Not checking for a valid root**: The root must be connected to every other node. Candidates often forget to verify this, leading to incorrect counts for invalid inputs.

2. **Incorrect parent selection logic**: The most subtle part is checking that a parent candidate is connected to ALL of the node's ancestors. A common mistake is to only check that they're connected, without verifying the "subset" relationship.

3. **Handling multiple parents incorrectly**: When a node has multiple valid parents, the number of ways should account for all combinations. Some candidates return 2 immediately without considering that multiple nodes might have multiple parents (which would give more than 2 ways).

4. **Forgetting to handle the xi < yi constraint**: While the problem states xi < yi, it's good practice to normalize pairs to ensure consistent processing.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Graph to Tree Conversion**: Similar to "Create Binary Tree From Descriptions" where you build a tree from relationship pairs. The key difference is here we're counting possibilities rather than constructing one tree.

2. **Topological Sorting with Constraints**: Like "Course Schedule" problems, but with hierarchical rather than just dependency constraints.

3. **Subset Verification**: The core operation of checking if one node's connections are a subset of another's appears in problems like "Maximum Star Sum of a Graph" where you need to find nodes with certain connection patterns.

## Key Takeaways

1. **Ancestor relationships define partial order**: The pairs create a partial ordering of nodes. Building a tree means extending this to a total order (a hierarchy) that respects all given relationships.

2. **Parent uniqueness test**: A node's parent is uniquely determined if and only if there's exactly one ancestor that shares exactly the same set of ancestors (plus itself).

3. **Root identification via connectivity**: In a valid tree, the root is the node with maximum connectivity (ancestors of all other nodes).

Related problems: [Create Binary Tree From Descriptions](/problem/create-binary-tree-from-descriptions), [Maximum Star Sum of a Graph](/problem/maximum-star-sum-of-a-graph)
