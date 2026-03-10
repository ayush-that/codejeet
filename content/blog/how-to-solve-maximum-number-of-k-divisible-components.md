---
title: "How to Solve Maximum Number of K-Divisible Components — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of K-Divisible Components. Hard difficulty, 74.1% acceptance rate. Topics: Tree, Depth-First Search."
date: "2026-10-05"
category: "dsa-patterns"
tags: ["maximum-number-of-k-divisible-components", "tree", "depth-first-search", "hard"]
---

# How to Solve Maximum Number of K-Divisible Components

You're given a tree with `n` nodes, each with a value, and need to split it into the maximum number of connected components where the sum of values in each component is divisible by `k`. The challenge is that you can only cut edges, and once cut, you can't reconnect them. This problem is tricky because it requires understanding how local decisions about cutting edges affect the global count of components while ensuring all component sums remain divisible by `k`.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- n = 5, k = 3
- values = [1, 2, 3, 4, 5]
- edges = [[0,1], [0,2], [1,3], [1,4]]

**Tree structure:**

```
      0(1)
     /     \
   1(2)    2(3)
  /   \
3(4)  4(5)
```

**Step-by-step reasoning:**

1. **Start from leaves and work upward:** This is a post-order DFS approach. We'll calculate subtree sums and decide when to cut.

2. **Process node 3 (leaf):** Subtree sum = 4. 4 % 3 = 1 (not divisible by 3). No cut possible.

3. **Process node 4 (leaf):** Subtree sum = 5. 5 % 3 = 2 (not divisible by 3). No cut possible.

4. **Process node 2 (leaf):** Subtree sum = 3. 3 % 3 = 0 (divisible!). We can cut the edge above node 2, creating a component with sum 3. Count = 1.

5. **Process node 1:** It has children 3 and 4. Their subtree sums are 4 and 5 respectively.
   - Total subtree sum for node 1 = value[1] + sum(child subtrees) = 2 + 4 + 5 = 11
   - 11 % 3 = 2 (not divisible)
   - We cannot cut above node 1 yet

6. **Process node 0:** It has children 1 and 2. Child 2's subtree was already cut off.
   - Total subtree sum for node 0 = value[0] + remaining subtree sum from child 1 = 1 + 11 = 12
   - 12 % 3 = 0 (divisible!)
   - We can cut above node 0, creating another component

**Result:** 2 components total (node 2's subtree and the rest).

The key insight: When a subtree's sum is divisible by `k`, we can cut it off from its parent, creating a valid component. The parent then continues with a sum of 0 for that child's contribution.

## Brute Force Approach

A naive approach would try all possible combinations of edge cuts. For a tree with `n-1` edges, there are 2^(n-1) possible subsets of edges to cut. For each subset:

1. Check if the resulting components are all connected
2. Verify each component's sum is divisible by `k`
3. Count the number of components

This is clearly exponential O(2^n) time complexity, which is infeasible for n up to 3×10^4 as in the constraints.

Even if we try to optimize by only considering cuts that create divisible sums, we'd still need to explore all combinations since cutting one edge affects what's possible elsewhere. The brute force teaches us that we need a greedy approach that makes locally optimal decisions.

## Optimized Approach

The key insight is a **post-order DFS with greedy cutting**:

1. **Tree properties:** A tree is a connected acyclic graph. Removing any edge creates exactly two components.

2. **Divisibility propagation:** If a subtree's sum is divisible by `k`, we can immediately cut it off. This is always optimal because:
   - It creates a valid component now
   - The parent continues with 0 contribution from that child
   - This doesn't prevent future cuts (the parent can still form valid components with its other children)

3. **DFS return value:** Each DFS call returns the remainder of the subtree sum modulo `k`. If the remainder is 0, we increment our component count.

4. **Why greedy works:** In tree problems, local optimal decisions often lead to global optimum when processing bottom-up. Once a subtree sum is divisible by `k`, keeping it connected to the parent won't help create more components later.

5. **Algorithm outline:**
   - Build adjacency list from edges
   - Perform DFS from node 0 (any root works in a tree)
   - For each node, calculate sum of its value plus DFS results from children
   - If total sum % k == 0, increment count and return 0 to parent
   - Otherwise, return sum % k to parent

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
class Solution:
    def maxKDivisibleComponents(self, n: int, edges: List[List[int]], values: List[int], k: int) -> int:
        # Step 1: Build adjacency list for the tree
        # We need to track neighbors for DFS traversal
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # Step 2: Initialize component count
        # We'll increment this whenever we find a divisible subtree
        self.components = 0

        # Step 3: DFS function with parent parameter to avoid cycles
        # Returns: remainder of subtree sum modulo k
        def dfs(node: int, parent: int) -> int:
            # Start with current node's value
            total = values[node]

            # Step 4: Process all neighbors except parent
            # This ensures we traverse the tree without cycles
            for neighbor in graph[node]:
                if neighbor == parent:
                    continue  # Skip the edge back to parent

                # Get remainder from child subtree
                child_remainder = dfs(neighbor, node)

                # Add child's contribution to current total
                total += child_remainder

            # Step 5: Check if current subtree sum is divisible by k
            remainder = total % k

            if remainder == 0:
                # We can cut above this node (or it's the root)
                # This creates a valid component
                self.components += 1
                return 0  # Parent gets 0 contribution from this subtree
            else:
                # Return remainder to parent
                # Parent will incorporate this into its sum
                return remainder

        # Step 6: Start DFS from node 0 (any node works as root)
        # The root has no parent, so we pass -1
        dfs(0, -1)

        # Step 7: Return total number of components
        return self.components
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number[]} values
 * @param {number} k
 * @return {number}
 */
var maxKDivisibleComponents = function (n, edges, values, k) {
  // Step 1: Build adjacency list for the tree
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: Initialize component count
  let components = 0;

  // Step 3: DFS function with parent parameter
  // Returns: remainder of subtree sum modulo k
  const dfs = (node, parent) => {
    // Start with current node's value
    let total = values[node];

    // Step 4: Process all neighbors except parent
    for (const neighbor of graph[node]) {
      if (neighbor === parent) {
        continue; // Skip the edge back to parent
      }

      // Get remainder from child subtree
      const childRemainder = dfs(neighbor, node);

      // Add child's contribution to current total
      total += childRemainder;
    }

    // Step 5: Check if current subtree sum is divisible by k
    const remainder = total % k;

    if (remainder === 0) {
      // We can cut above this node
      components++;
      return 0; // Parent gets 0 contribution from this subtree
    } else {
      // Return remainder to parent
      return remainder;
    }
  };

  // Step 6: Start DFS from node 0
  dfs(0, -1);

  // Step 7: Return total number of components
  return components;
};
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    private int components;
    private List<Integer>[] graph;
    private int[] values;
    private int k;

    public int maxKDivisibleComponents(int n, int[][] edges, int[] values, int k) {
        // Step 1: Initialize instance variables
        this.components = 0;
        this.values = values;
        this.k = k;

        // Step 2: Build adjacency list
        graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 3: Start DFS from node 0
        dfs(0, -1);

        // Step 4: Return total number of components
        return components;
    }

    // DFS returns remainder of subtree sum modulo k
    private int dfs(int node, int parent) {
        // Start with current node's value
        long total = values[node];  // Use long to prevent overflow

        // Step 4: Process all neighbors except parent
        for (int neighbor : graph[node]) {
            if (neighbor == parent) {
                continue;  // Skip the edge back to parent
            }

            // Get remainder from child subtree
            int childRemainder = dfs(neighbor, node);

            // Add child's contribution to current total
            total += childRemainder;
        }

        // Step 5: Check if current subtree sum is divisible by k
        int remainder = (int)(total % k);

        if (remainder == 0) {
            // We can cut above this node
            components++;
            return 0;  // Parent gets 0 contribution from this subtree
        } else {
            // Return remainder to parent
            return remainder;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building the adjacency list takes O(n) time since we process n-1 edges
- DFS visits each node exactly once, and at each node we process all its neighbors
- Each edge is traversed twice (once from each endpoint), so total DFS operations are O(n)

**Space Complexity: O(n)**

- Adjacency list uses O(n) space (2\*(n-1) entries for undirected edges)
- DFS recursion stack can go O(n) deep in worst case (linear chain tree)
- Other variables use O(1) additional space

The linear complexity makes this solution efficient for the constraints (n ≤ 3×10^4).

## Common Mistakes

1. **Forgetting to track parent in DFS:** Without tracking the parent node, DFS will revisit nodes in an undirected tree, causing infinite recursion or incorrect traversal. Always include a parent parameter in tree DFS.

2. **Not using modulo operation correctly:** Some candidates try to store actual sums instead of remainders, which can cause integer overflow with large values. Working with remainders modulo `k` keeps numbers small and prevents overflow.

3. **Incorrect component counting:** The component count should be incremented when `remainder == 0`, not when we return from DFS. Each time we return 0 to a parent, we've effectively created a component.

4. **Assuming root must be included:** Some candidates think the root must be part of a component, but the algorithm naturally handles this. If the entire tree sum is divisible by `k`, the root's DFS will return 0 and increment the count.

## When You'll See This Pattern

This **post-order DFS with greedy cutting** pattern appears in several tree partitioning problems:

1. **Create Components With Same Value (LeetCode 2440):** Very similar problem where you need to split a tree into components with equal sums. The same DFS approach works.

2. **Binary Tree Maximum Path Sum (LeetCode 124):** While not about cutting edges, it uses similar post-order DFS to compute local results and make decisions about including/excluding paths.

3. **Delete Tree Nodes (LeetCode 1273):** Another tree problem where you compute subtree sums and make decisions based on the sum values.

The pattern is: when you need to make decisions about tree edges/nodes based on subtree properties, post-order DFS (children before parent) is often the right approach.

## Key Takeaways

1. **Tree partitioning problems often have greedy solutions:** When you can make local decisions that don't affect future optimality, a bottom-up DFS approach usually works.

2. **Post-order DFS is powerful for subtree aggregation:** Computing subtree sums, counts, or other properties from leaves upward is a fundamental tree traversal pattern.

3. **Modulo arithmetic simplifies divisibility checks:** Instead of tracking large sums, track remainders modulo `k`. This prevents overflow and keeps the logic clean.

4. **Always track parent in undirected tree DFS:** This simple technique prevents cycles and ensures proper tree traversal.

Related problems: [Create Components With Same Value](/problem/create-components-with-same-value)
