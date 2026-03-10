---
title: "How to Solve Create Components With Same Value — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Create Components With Same Value. Hard difficulty, 53.3% acceptance rate. Topics: Array, Math, Tree, Depth-First Search, Enumeration."
date: "2026-05-08"
category: "dsa-patterns"
tags: ["create-components-with-same-value", "array", "math", "tree", "hard"]
---

# How to Solve "Create Components With Same Value"

You're given a tree where each node has a value, and you need to find the maximum number of connected components you can create by removing edges, such that every component has the same total value. The tricky part is that you don't know what that target component value should be — it must be a divisor of the total sum, and you need to verify if the tree can actually be partitioned that way.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
nums = [6, 2, 2, 2, 2, 2]
edges = [[0,1],[1,2],[1,3],[0,4],[4,5]]
```

Total sum = 6 + 2 + 2 + 2 + 2 + 2 = 16

We can visualize the tree:

```
      0(6)
     /     \
   1(2)    4(2)
   / \       \
 2(2)3(2)    5(2)
```

Now, what target component values could work? They must divide 16: 1, 2, 4, 8, 16.

- **Target = 16**: This means no cuts at all (1 component). Always works.
- **Target = 8**: Can we get components each summing to 8? We'd need exactly 2 components. Looking at the tree, if we cut edge (0,1), we get:
  - Left subtree: 2 + 2 + 2 = 6 (not 8)
  - Right subtree: 6 + 2 + 2 = 10 (not 8)
    This doesn't work.
- **Target = 4**: Can we get components each summing to 4? We'd need 4 components total. Let's try:
  1. Cut edge (1,2): subtree with node 2 has value 2 (not 4 yet)
  2. Cut edge (1,3): subtree with node 3 has value 2 (not 4 yet)
  3. Cut edge (4,5): subtree with node 5 has value 2 (not 4 yet)
     We can't get components summing to 4 because the leaf nodes are only worth 2 each.
- **Target = 2**: Can we get components each summing to 2? We'd need 8 components, but we only have 6 nodes. Impossible.
- **Target = 1**: Can't work since all values are ≥2.

Wait — let's think differently. For target = 4, maybe we can group nodes:

- Nodes 2 and 3 together sum to 4
- Node 5 and part of the right branch sum to 4
- But we need to check if the tree structure allows this grouping.

This shows we need a systematic way to check each possible target value.

## Brute Force Approach

A naive approach would be to try every possible subset of edges to remove, then check if all resulting components have equal sums. For a tree with `n` nodes, there are `n-1` edges, so there are `2^(n-1)` possible subsets of edges to remove. For each subset, we'd need to:

1. Remove those edges to create components
2. Calculate the sum of each component (requires DFS/BFS)
3. Check if all sums are equal

This gives us `O(2^(n-1) * n)` time complexity, which is exponential and completely impractical for `n` up to 2×10^4 as in the constraints.

Even if we're smarter about it and only try divisors of the total sum, we still need an efficient way to check if a particular target value works. The brute force teaches us that we need:

1. A way to limit candidate targets (only divisors of total sum)
2. An efficient `O(n)` check for each candidate

## Optimized Approach

The key insight is that for a given target component value `target`, we can perform a DFS from the leaves upward, greedily grouping subtrees:

1. **Candidate targets**: Only divisors of the total sum can work. If total sum is `S`, then `target` must satisfy `S % target == 0` and `target ≥ max(nums)` (since each component must contain at least one node).

2. **DFS checking**: For a given `target`, perform DFS. When we process a node:
   - Recursively process all children
   - Sum up the values of the current node plus all child subtrees
   - If a child subtree's sum equals `target`, we can cut that edge and count it as a complete component
   - If a child subtree's sum is less than `target`, we merge it with the current node
   - If a child subtree's sum is greater than `target`, the target is impossible
   - At the end, if the root's remaining sum equals `target`, we have one more component

3. **Counting components**: If we can achieve `k` components each with sum `target`, then `k = S / target`. We want to maximize `k`, which means minimizing valid `target`.

4. **Optimization**: We check targets in increasing order, and return the maximum `k` found. Since we want maximum components (minimum target that works), we could check from smallest to largest divisor.

The clever part is that we don't need to actually cut edges — we just simulate the process bottom-up. If a subtree sums to exactly `target`, we count it and return 0 to its parent (meaning it's been "cut off"). Otherwise, we return the accumulated sum to be merged with the parent.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * d) where d is number of divisors of total sum
# Space: O(n) for adjacency list and recursion stack
class Solution:
    def componentValue(self, nums: List[int], edges: List[List[int]]) -> int:
        n = len(nums)
        total = sum(nums)

        # Build adjacency list for the tree
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        # DFS function that returns the sum of the current subtree
        # after cutting complete components of size 'target'
        def dfs(node, parent, target):
            # Start with the node's own value
            current_sum = nums[node]

            # Process all neighbors except parent
            for neighbor in adj[node]:
                if neighbor == parent:
                    continue

                # Get the sum from child subtree
                child_sum = dfs(neighbor, node, target)

                if child_sum == -1:  # Invalid target found in subtree
                    return -1

                if child_sum == target:
                    # This child forms a complete component, cut the edge
                    # Don't add it to current_sum (it's separate now)
                    pass
                elif child_sum < target:
                    # Merge child with current node
                    current_sum += child_sum
                else:
                    # Child sum > target: impossible to form components
                    return -1

            # If current_sum equals target, we can cut this as a component
            # Return 0 to parent to indicate it's been cut off
            if current_sum == target:
                return 0

            # Otherwise return the accumulated sum for parent to handle
            return current_sum

        # Try all possible target values (divisors of total sum)
        # We want maximum components = minimum valid target
        max_val = max(nums)

        # Check divisors from largest to smallest to find maximum k
        # k = total / target, so larger k means smaller target
        # But we need target >= max_val (each component must contain at least one node)
        for target in range(max_val, total + 1):
            if total % target != 0:
                continue

            # Check if we can partition tree with this target
            # dfs returns 0 if successful, -1 if failed
            if dfs(0, -1, target) == 0:
                # Number of components = total / target
                # We want maximum components = maximum cuts
                # Cuts = components - 1
                return total // target - 1

        return 0  # Should never reach here for valid inputs
```

```javascript
// Time: O(n * d) where d is number of divisors of total sum
// Space: O(n) for adjacency list and recursion stack
var componentValue = function (nums, edges) {
  const n = nums.length;
  const total = nums.reduce((sum, val) => sum + val, 0);

  // Build adjacency list
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  // DFS to check if target works
  const dfs = (node, parent, target) => {
    let currentSum = nums[node];

    for (const neighbor of adj[node]) {
      if (neighbor === parent) continue;

      const childSum = dfs(neighbor, node, target);

      if (childSum === -1) return -1; // Invalid target

      if (childSum === target) {
        // Child forms complete component, cut edge
        // Don't add to currentSum
      } else if (childSum < target) {
        // Merge child with current node
        currentSum += childSum;
      } else {
        // Child sum > target: impossible
        return -1;
      }
    }

    // If we've formed a complete component at this node
    if (currentSum === target) {
      return 0; // Signal to parent that we're cut off
    }

    return currentSum; // Return accumulated sum to parent
  };

  const maxVal = Math.max(...nums);

  // Try possible targets (must be divisor of total and >= maxVal)
  // We check from largest to smallest to find maximum k
  for (let target = maxVal; target <= total; target++) {
    if (total % target !== 0) continue;

    if (dfs(0, -1, target) === 0) {
      // Number of components = total / target
      // Cuts = components - 1
      return total / target - 1;
    }
  }

  return 0; // Should never reach here
};
```

```java
// Time: O(n * d) where d is number of divisors of total sum
// Space: O(n) for adjacency list and recursion stack
class Solution {
    public int componentValue(int[] nums, int[][] edges) {
        int n = nums.length;
        int total = 0;
        int maxVal = 0;

        // Calculate total sum and maximum value
        for (int num : nums) {
            total += num;
            maxVal = Math.max(maxVal, num);
        }

        // Build adjacency list
        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            adj[u].add(v);
            adj[v].add(u);
        }

        // DFS to check if a target works
        // Returns -1 if impossible, 0 if forms complete component,
        // or accumulated sum otherwise
        java.util.function.BiFunction<Integer, Integer, Integer> dfs =
            new java.util.function.BiFunction<Integer, Integer, Integer>() {
            public Integer apply(Integer node, Integer parent) {
                int currentSum = nums[node];

                for (int neighbor : adj[node]) {
                    if (neighbor == parent) continue;

                    int childSum = this.apply(neighbor, node);
                    if (childSum == -1) return -1;

                    if (childSum == target) {
                        // Child forms complete component
                        // Don't add to current sum
                    } else if (childSum < target) {
                        // Merge with current node
                        currentSum += childSum;
                    } else {
                        // Child sum > target: impossible
                        return -1;
                    }
                }

                if (currentSum == target) {
                    return 0;  // Forms complete component
                }
                return currentSum;  // Return accumulated sum
            }
        };

        // Try all possible targets
        // We want maximum components = minimum valid target
        for (int t = maxVal; t <= total; t++) {
            if (total % t != 0) continue;

            target = t;  // Set target for DFS
            if (dfs.apply(0, -1) == 0) {
                // Number of components = total / target
                // Cuts = components - 1
                return total / t - 1;
            }
        }

        return 0;  // Should never reach here
    }

    private int target;  // Target value for current DFS check
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(n * d)` where:

- `n` is the number of nodes
- `d` is the number of divisors of the total sum `S`

For each divisor (candidate target), we perform a DFS that visits each node once, giving `O(n)` per check. In the worst case, `S` could have up to `O(√S)` divisors, but in practice it's much smaller. Since `n ≤ 2×10^4` and values are up to `50`, the total sum is at most `10^6`, which has at most `240` divisors.

**Space Complexity**: `O(n)` for:

- Adjacency list storage: `O(n)` edges
- Recursion stack depth: `O(n)` in worst case (linear tree)
- No additional significant storage

## Common Mistakes

1. **Not checking `target ≥ max(nums)`**: Each component must contain at least one node, so the target cannot be smaller than any individual node value. If you try `target = 3` but a node has value `5`, it's immediately impossible.

2. **Incorrect DFS return value handling**: The trickiest part is what to return from DFS. You must return:
   - `0` if the subtree forms a complete component (cut off from parent)
   - Accumulated sum if it's merged with parent
   - `-1` (or sentinel) if impossible
     Mixing these up leads to incorrect counts.

3. **Forgetting that root can form a component**: After processing all children, if the root's accumulated sum equals `target`, it forms the final component. Some implementations forget to check this.

4. **Inefficient target checking**: Checking every integer from 1 to total sum is `O(S)` which could be large. Only checking divisors reduces this significantly.

5. **Not handling the sentinel value properly**: When a child returns `-1` (impossible), you must propagate it immediately. Continuing to process other children wastes time.

## When You'll See This Pattern

This "tree partitioning with equal sums" pattern appears in several tree problems:

1. **Equal Tree Partition (LeetCode 663)**: Check if a binary tree can be partitioned by removing one edge into two subtrees with equal sums. This is a simpler version with exactly 2 components.

2. **Maximum Number of K-Divisible Components (LeetCode 3396)**: Similar structure but with a divisibility condition instead of exact equality.

3. **Split BST (LeetCode 776)**: While not exactly the same, it involves partitioning a BST based on node values.

The core technique is **post-order DFS with greedy merging/cutting**. You process children first, then decide at each node whether to merge with parent or cut as a separate component. This bottom-up approach is efficient because each decision is local.

## Key Takeaways

1. **Tree partitioning problems often use post-order DFS**: Process children before parent to make local decisions about whether to merge or cut subtrees.

2. **Limit candidate solutions using mathematical constraints**: Here, the target must be a divisor of the total sum and ≥ max node value. Always look for such constraints to reduce search space.

3. **Greedy merging works for equal-sum partitioning**: If a subtree sum < target, merge it with parent. If = target, cut it. If > target, it's impossible. This greedy approach works because we're trying to form exact multiples of the target.

4. **Return sentinel values for failure propagation**: When DFS detects an impossible configuration, return a special value (-1) immediately to avoid unnecessary computation.

Related problems: [Equal Tree Partition](/problem/equal-tree-partition), [Maximum Number of K-Divisible Components](/problem/maximum-number-of-k-divisible-components)
