---
title: "How to Solve Tree of Coprimes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Tree of Coprimes. Hard difficulty, 43.8% acceptance rate. Topics: Array, Math, Tree, Depth-First Search, Number Theory."
date: "2026-03-05"
category: "dsa-patterns"
tags: ["tree-of-coprimes", "array", "math", "tree", "hard"]
---

# How to Solve Tree of Coprimes

This problem asks us to find, for each node in a tree, the nearest ancestor whose value is coprime with the node's value. Two numbers are coprime if their greatest common divisor (GCD) is 1. The challenge is that we need to efficiently track ancestor values while traversing the tree, since checking all ancestors for each node would be too slow.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
nums = [2, 3, 6, 7, 10]
edges = [[0,1],[1,2],[1,3],[0,4]]
```

This tree looks like:

```
      0 (2)
     / \
   1(3) 4(10)
  / \
2(6) 3(7)
```

For node 2 (value 6):

- Check parent node 1 (value 3): gcd(6,3) = 3 ≠ 1 ❌
- Check grandparent node 0 (value 2): gcd(6,2) = 2 ≠ 1 ❌
- No coprime ancestor found → answer = -1

For node 3 (value 7):

- Check parent node 1 (value 3): gcd(7,3) = 1 ✓
- Found at depth 1 → answer = 1

For node 4 (value 10):

- Check parent node 0 (value 2): gcd(10,2) = 2 ≠ 1 ❌
- No other ancestors → answer = -1

The key insight: we need to track the _most recent_ (deepest) ancestor for each possible value that appears in the tree, since we're looking for the nearest coprime ancestor.

## Brute Force Approach

A naive solution would be, for each node, traverse up to the root checking all ancestors:

1. For each node, start from that node
2. Move to parent, check if gcd(node_value, ancestor_value) = 1
3. Continue until root is reached
4. Return the nearest ancestor where gcd = 1, or -1 if none found

This approach has O(n²) time complexity in the worst case (when the tree is a line). With n up to 10⁵, this is far too slow. We need a way to avoid checking every ancestor for every node.

## Optimized Approach

The key optimization comes from these observations:

1. **Limited value range**: Node values are between 1 and 50. This small range is crucial!
2. **Coprime checking is about GCD**: We need to know if gcd(a,b) = 1
3. **We only care about the nearest ancestor**: For each possible value, we only need to track the deepest node with that value

Here's the core strategy:

- During DFS traversal, maintain a dictionary `last` that maps each possible value (1-50) to the deepest node (and its depth) that has that value on the current path from root.
- For each node, check all values from 1 to 50 to find which ones are coprime with the current node's value.
- Among those coprime values, find the one with the deepest node in `last` - that's our answer!
- After processing children, backtrack by restoring the previous value in `last`.

Why does this work? Because `last[value]` always stores the deepest (nearest) node with that value on the current path from root. When we check all values coprime with current node, the deepest one among them gives us the nearest coprime ancestor.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * V) where V = 50 (max value) | Space: O(n + V)
class Solution:
    def getCoprimes(self, nums: List[int], edges: List[List[int]]) -> List[int]:
        n = len(nums)

        # Step 1: Build adjacency list for the tree
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # Step 2: Precompute coprime pairs for values 1-50
        # This avoids computing gcd repeatedly during DFS
        coprime_pairs = [[] for _ in range(51)]  # 0-50, but we use 1-50
        for i in range(1, 51):
            for j in range(1, 51):
                if math.gcd(i, j) == 1:
                    coprime_pairs[i].append(j)

        # Step 3: Initialize result array and tracking structures
        result = [-1] * n
        # last[value] = (node_index, depth) of deepest node with this value on current path
        last = [(-1, -1)] * 51  # 0-50

        # Step 4: DFS traversal
        def dfs(node: int, parent: int, depth: int):
            # For current node, find nearest coprime ancestor
            nearest_depth = -1
            nearest_node = -1

            # Check all values coprime with current node's value
            for coprime_val in coprime_pairs[nums[node]]:
                if last[coprime_val][0] != -1:  # This value exists on current path
                    candidate_node, candidate_depth = last[coprime_val]
                    # Choose the deepest (nearest) one
                    if candidate_depth > nearest_depth:
                        nearest_depth = candidate_depth
                        nearest_node = candidate_node

            result[node] = nearest_node

            # Step 5: Save current node's state before exploring children
            original_last = last[nums[node]]
            # Update last for current node's value
            last[nums[node]] = (node, depth)

            # Step 6: Recursively process children
            for neighbor in graph[node]:
                if neighbor != parent:  # Avoid going back to parent
                    dfs(neighbor, node, depth + 1)

            # Step 7: Backtrack - restore original value
            last[nums[node]] = original_last

        # Start DFS from root (node 0)
        dfs(0, -1, 0)
        return result
```

```javascript
// Time: O(n * V) where V = 50 (max value) | Space: O(n + V)
/**
 * @param {number[]} nums
 * @param {number[][]} edges
 * @return {number[]}
 */
var getCoprimes = function (nums, edges) {
  const n = nums.length;

  // Step 1: Build adjacency list for the tree
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Helper function to compute gcd
  const gcd = (a, b) => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };

  // Step 2: Precompute coprime pairs for values 1-50
  const coprimePairs = Array.from({ length: 51 }, () => []);
  for (let i = 1; i <= 50; i++) {
    for (let j = 1; j <= 50; j++) {
      if (gcd(i, j) === 1) {
        coprimePairs[i].push(j);
      }
    }
  }

  // Step 3: Initialize result array and tracking structures
  const result = new Array(n).fill(-1);
  // last[value] = {node, depth} of deepest node with this value on current path
  const last = Array.from({ length: 51 }, () => ({ node: -1, depth: -1 }));

  // Step 4: DFS traversal
  const dfs = (node, parent, depth) => {
    // For current node, find nearest coprime ancestor
    let nearestDepth = -1;
    let nearestNode = -1;

    // Check all values coprime with current node's value
    for (const coprimeVal of coprimePairs[nums[node]]) {
      if (last[coprimeVal].node !== -1) {
        // This value exists on current path
        const candidateNode = last[coprimeVal].node;
        const candidateDepth = last[coprimeVal].depth;
        // Choose the deepest (nearest) one
        if (candidateDepth > nearestDepth) {
          nearestDepth = candidateDepth;
          nearestNode = candidateNode;
        }
      }
    }

    result[node] = nearestNode;

    // Step 5: Save current node's state before exploring children
    const originalLast = { ...last[nums[node]] };
    // Update last for current node's value
    last[nums[node]] = { node, depth };

    // Step 6: Recursively process children
    for (const neighbor of graph[node]) {
      if (neighbor !== parent) {
        // Avoid going back to parent
        dfs(neighbor, node, depth + 1);
      }
    }

    // Step 7: Backtrack - restore original value
    last[nums[node]] = originalLast;
  };

  // Start DFS from root (node 0)
  dfs(0, -1, 0);
  return result;
};
```

```java
// Time: O(n * V) where V = 50 (max value) | Space: O(n + V)
class Solution {
    public int[] getCoprimes(int[] nums, int[][] edges) {
        int n = nums.length;

        // Step 1: Build adjacency list for the tree
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 2: Precompute coprime pairs for values 1-50
        List<Integer>[] coprimePairs = new ArrayList[51];
        for (int i = 1; i <= 50; i++) {
            coprimePairs[i] = new ArrayList<>();
            for (int j = 1; j <= 50; j++) {
                if (gcd(i, j) == 1) {
                    coprimePairs[i].add(j);
                }
            }
        }

        // Step 3: Initialize result array and tracking structures
        int[] result = new int[n];
        Arrays.fill(result, -1);
        // last[value] = new int[]{node, depth} of deepest node with this value
        int[][] last = new int[51][2];
        for (int i = 0; i <= 50; i++) {
            last[i][0] = -1;  // node
            last[i][1] = -1;  // depth
        }

        // Step 4: DFS traversal
        dfs(0, -1, 0, nums, graph, coprimePairs, last, result);

        return result;
    }

    private void dfs(int node, int parent, int depth, int[] nums, List<Integer>[] graph,
                    List<Integer>[] coprimePairs, int[][] last, int[] result) {
        // For current node, find nearest coprime ancestor
        int nearestDepth = -1;
        int nearestNode = -1;

        // Check all values coprime with current node's value
        for (int coprimeVal : coprimePairs[nums[node]]) {
            if (last[coprimeVal][0] != -1) {  // This value exists on current path
                int candidateNode = last[coprimeVal][0];
                int candidateDepth = last[coprimeVal][1];
                // Choose the deepest (nearest) one
                if (candidateDepth > nearestDepth) {
                    nearestDepth = candidateDepth;
                    nearestNode = candidateNode;
                }
            }
        }

        result[node] = nearestNode;

        // Step 5: Save current node's state before exploring children
        int[] originalLast = new int[]{last[nums[node]][0], last[nums[node]][1]};
        // Update last for current node's value
        last[nums[node]][0] = node;
        last[nums[node]][1] = depth;

        // Step 6: Recursively process children
        for (int neighbor : graph[node]) {
            if (neighbor != parent) {  // Avoid going back to parent
                dfs(neighbor, node, depth + 1, nums, graph, coprimePairs, last, result);
            }
        }

        // Step 7: Backtrack - restore original value
        last[nums[node]][0] = originalLast[0];
        last[nums[node]][1] = originalLast[1];
    }

    private int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × V)**

- Building the graph: O(n)
- Precomputing coprime pairs: O(V²) where V = 50, which is constant
- DFS traversal: O(n × V) - for each of n nodes, we check up to V coprime values
- Overall: O(n × 50) = O(n) in practice, but technically O(n × V)

**Space Complexity: O(n + V)**

- Graph adjacency list: O(n)
- Coprime pairs precomputation: O(V²) = O(2500) constant
- `last` array: O(V)
- Recursion stack: O(n) in worst case (when tree is a line)
- Result array: O(n)

The key factor is that V = 50 is small and constant, making this solution efficient.

## Common Mistakes

1. **Not noticing the value range constraint (1-50)**: This is crucial! Without this constraint, checking all possible values wouldn't be feasible. Some candidates try to track all unique values that appear, but that's still O(n²) in worst case.

2. **Forgetting to backtrack**: When we finish processing a node's children, we must restore the previous value in the `last` array. Otherwise, nodes from different branches will interfere with each other.

3. **Checking ancestors instead of values**: The natural approach is to check ancestors directly, but that's O(n²). The insight is to invert the problem: instead of "for this node, check all ancestors," we think "for this value, track the deepest node with it."

4. **Not tracking depth properly**: When comparing candidate ancestors, we need to choose the one with maximum depth (closest to current node). Just tracking the node isn't enough - we need depth to determine which is nearest.

## When You'll See This Pattern

This problem combines tree DFS with value tracking and number theory. Similar patterns appear in:

1. **"Sum of Distances in Tree" (LeetCode 834)**: Also uses DFS with careful state tracking and propagation of results.

2. **"All Nodes Distance K in Binary Tree" (LeetCode 863)**: Requires tracking ancestors/parents during tree traversal.

3. **"Binary Tree Cameras" (LeetCode 968)**: Uses post-order traversal with state tracking to make optimal decisions.

The core pattern is: **During tree DFS, maintain information about the path from root to current node, and use this to answer queries about ancestors or descendants.**

## Key Takeaways

1. **Invert the problem**: Instead of checking all ancestors for each node (O(n²)), track all possible values and find which ones have ancestors on the current path (O(n × V)).

2. **Look for constraints**: The small value range (1-50) is a hint that checking all values might be feasible. Always examine input constraints carefully.

3. **DFS with backtracking is powerful for tree problems**: Maintain state during traversal, update it when entering a node, and restore it when leaving. This lets you answer questions about the current path efficiently.

[Practice this problem on CodeJeet](/problem/tree-of-coprimes)
