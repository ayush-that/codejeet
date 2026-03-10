---
title: "How to Solve Minimum Score After Removals on a Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Score After Removals on a Tree. Hard difficulty, 76.2% acceptance rate. Topics: Array, Bit Manipulation, Tree, Depth-First Search."
date: "2028-02-03"
category: "dsa-patterns"
tags: ["minimum-score-after-removals-on-a-tree", "array", "bit-manipulation", "tree", "hard"]
---

# How to Solve Minimum Score After Removals on a Tree

You're given a tree with values on each node. After removing exactly two edges (which splits the tree into three connected components), you need to find the minimum possible difference between the maximum and minimum XOR values of these components. The challenge lies in efficiently exploring all possible edge removal pairs while computing XOR values without redundant calculations.

**What makes this tricky:** The tree structure means removing edges creates connected components, but we can't just try all O(n²) edge pairs naively—that would be O(n³) with XOR computations. The key insight is that tree DFS lets us precompute subtree XORs, turning this into finding three components whose XOR values have minimal range.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
nums = [1, 2, 3, 4, 5]
edges = [[0,1], [1,2], [1,3], [3,4]]

Tree structure:
    0(1)
    |
    1(2)
   / \
 2(3) 3(4)
       \
       4(5)
```

We need to remove two edges, creating three components. Let's consider removing edges (0-1) and (1-3):

1. Remove edge 0-1: Component A = node 0, XOR = 1
2. Remove edge 1-3:
   - Component B = nodes 2, XOR = 3
   - Component C = nodes 1,3,4, XOR = 2^4^5 = 3 (since 2^4=6, 6^5=3)

XOR values: [1, 3, 3] → max=3, min=1 → score=2

Now try removing edges (1-2) and (3-4):

1. Remove edge 1-2: Component A = node 2, XOR = 3
2. Remove edge 3-4:
   - Component B = node 4, XOR = 5
   - Component C = nodes 0,1,3, XOR = 1^2^4 = 7

XOR values: [3, 5, 7] → max=7, min=3 → score=4

We need to find the minimum score across all possible edge pairs.

## Brute Force Approach

A naive approach would:

1. Generate all pairs of edges to remove (O(n²) pairs)
2. For each pair, traverse the tree to compute XOR of each component (O(n) per traversal)
3. Calculate score = max(XORs) - min(XORs)
4. Track the minimum score

This gives O(n³) time complexity, which is far too slow for n up to 1000. The problem requires O(n²) or better.

**Why brute force fails:** With n=1000, O(n³) is ~1 billion operations, which will time out. We need to leverage tree properties to avoid recomputing XOR values from scratch for each edge pair.

## Optimized Approach

The key insight: **We can precompute XOR for every subtree using DFS**. Then, when considering edge removals, we can get component XORs in O(1) time.

**Step-by-step reasoning:**

1. **Precomputation phase:**
   - Build adjacency list from edges
   - Perform DFS to compute `subtreeXOR[node]` = XOR of all values in subtree rooted at `node`
   - Also compute `totalXOR` = XOR of all node values

2. **Understanding component XORs:**
   When we remove two edges, we get three components. There are two cases:
   - Case 1: One component is a subtree, another is a subtree within that subtree
   - Case 2: Two components are separate subtrees of a common parent

3. **Efficient enumeration:**
   For each node `u`, consider all its descendant nodes `v`:
   - Component A = subtree rooted at `v` (XOR = `subtreeXOR[v]`)
   - Component B = subtree rooted at `u` minus subtree `v` (XOR = `subtreeXOR[u] ^ subtreeXOR[v]`)
   - Component C = rest of tree (XOR = `totalXOR ^ subtreeXOR[u]`)

   This covers all possible partitions with O(n²) pairs instead of O(n³).

4. **Finding minimum score:**
   For each valid triple (A, B, C) where all are non-empty:
   - Compute score = max(A,B,C) - min(A,B,C)
   - Track minimum score

## Optimal Solution

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
class Solution:
    def minimumScore(self, nums: List[int], edges: List[List[int]]) -> int:
        n = len(nums)

        # Step 1: Build adjacency list for the tree
        graph = [[] for _ in range(n)]
        for u, v in edges:
            graph[u].append(v)
            graph[v].append(u)

        # Step 2: Precompute subtree XOR values using DFS
        subtree_xor = [0] * n
        parent = [-1] * n  # Track parent for DFS traversal
        entry_time = [0] * n  # For checking ancestor relationships
        exit_time = [0] * n
        timer = 0

        def dfs(node, par):
            nonlocal timer
            parent[node] = par
            entry_time[node] = timer
            timer += 1

            # Start with node's own value
            xor_val = nums[node]

            # Recursively compute XOR for all children
            for neighbor in graph[node]:
                if neighbor != par:
                    dfs(neighbor, node)
                    xor_val ^= subtree_xor[neighbor]

            subtree_xor[node] = xor_val
            exit_time[node] = timer
            timer += 1

        # Start DFS from node 0 (any node works since it's a tree)
        dfs(0, -1)

        # Helper: Check if a is ancestor of b
        def is_ancestor(a, b):
            return entry_time[a] <= entry_time[b] and exit_time[a] >= exit_time[b]

        total_xor = subtree_xor[0]  # XOR of entire tree
        min_score = float('inf')

        # Step 3: Try all pairs of nodes (u, v) where u is ancestor of v
        # This corresponds to removing edges (parent[u]-u) and (parent[v]-v)
        for u in range(n):
            for v in range(n):
                if u == v:
                    continue

                # We need u to be an ancestor of v for valid edge removal
                if not is_ancestor(u, v):
                    continue

                # Case 1: v is in u's subtree
                # Component A: subtree rooted at v
                xor_a = subtree_xor[v]

                # Component B: u's subtree minus v's subtree
                xor_b = subtree_xor[u] ^ subtree_xor[v]

                # Component C: rest of the tree
                xor_c = total_xor ^ subtree_xor[u]

                # All components must be non-empty
                # xor_b = 0 would mean empty component (when u's subtree equals v's subtree)
                if xor_b == 0:
                    continue

                # Calculate score for this configuration
                score = max(xor_a, xor_b, xor_c) - min(xor_a, xor_b, xor_c)
                min_score = min(min_score, score)

        return min_score
```

```javascript
// Time: O(n²) | Space: O(n)
/**
 * @param {number[]} nums
 * @param {number[][]} edges
 * @return {number}
 */
var minimumScore = function (nums, edges) {
  const n = nums.length;

  // Step 1: Build adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: Precompute subtree XOR values
  const subtreeXOR = new Array(n).fill(0);
  const parent = new Array(n).fill(-1);
  const entryTime = new Array(n).fill(0);
  const exitTime = new Array(n).fill(0);
  let timer = 0;

  // DFS to compute subtree XOR and track parent/child relationships
  function dfs(node, par) {
    parent[node] = par;
    entryTime[node] = timer++;

    let xorVal = nums[node];

    for (const neighbor of graph[node]) {
      if (neighbor !== par) {
        dfs(neighbor, node);
        xorVal ^= subtreeXOR[neighbor];
      }
    }

    subtreeXOR[node] = xorVal;
    exitTime[node] = timer++;
  }

  dfs(0, -1);

  // Helper: Check if a is ancestor of b
  function isAncestor(a, b) {
    return entryTime[a] <= entryTime[b] && exitTime[a] >= exitTime[b];
  }

  const totalXOR = subtreeXOR[0]; // XOR of entire tree
  let minScore = Infinity;

  // Step 3: Try all valid pairs (u, v) where u is ancestor of v
  for (let u = 0; u < n; u++) {
    for (let v = 0; v < n; v++) {
      if (u === v) continue;

      // v must be in u's subtree for valid edge removal
      if (!isAncestor(u, v)) continue;

      // Component A: subtree rooted at v
      const xorA = subtreeXOR[v];

      // Component B: u's subtree minus v's subtree
      const xorB = subtreeXOR[u] ^ subtreeXOR[v];

      // Component C: rest of the tree
      const xorC = totalXOR ^ subtreeXOR[u];

      // Skip if any component would be empty
      if (xorB === 0) continue;

      // Calculate score for this configuration
      const score = Math.max(xorA, xorB, xorC) - Math.min(xorA, xorB, xorC);
      minScore = Math.min(minScore, score);
    }
  }

  return minScore;
};
```

```java
// Time: O(n²) | Space: O(n)
class Solution {
    private List<Integer>[] graph;
    private int[] subtreeXOR;
    private int[] parent;
    private int[] entryTime;
    private int[] exitTime;
    private int timer;

    public int minimumScore(int[] nums, int[][] edges) {
        int n = nums.length;

        // Step 1: Build adjacency list
        graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].add(v);
            graph[v].add(u);
        }

        // Step 2: Initialize arrays for DFS
        subtreeXOR = new int[n];
        parent = new int[n];
        entryTime = new int[n];
        exitTime = new int[n];
        timer = 0;

        // DFS to compute subtree XOR
        dfs(0, -1, nums);

        // Helper to check ancestor relationship
        int totalXOR = subtreeXOR[0];
        int minScore = Integer.MAX_VALUE;

        // Step 3: Try all valid pairs (u, v) where u is ancestor of v
        for (int u = 0; u < n; u++) {
            for (int v = 0; v < n; v++) {
                if (u == v) continue;

                // Check if v is in u's subtree
                if (!isAncestor(u, v)) continue;

                // Component A: subtree rooted at v
                int xorA = subtreeXOR[v];

                // Component B: u's subtree minus v's subtree
                int xorB = subtreeXOR[u] ^ subtreeXOR[v];

                // Component C: rest of the tree
                int xorC = totalXOR ^ subtreeXOR[u];

                // Skip if component B would be empty
                if (xorB == 0) continue;

                // Calculate score
                int maxVal = Math.max(xorA, Math.max(xorB, xorC));
                int minVal = Math.min(xorA, Math.min(xorB, xorC));
                int score = maxVal - minVal;
                minScore = Math.min(minScore, score);
            }
        }

        return minScore;
    }

    private void dfs(int node, int par, int[] nums) {
        parent[node] = par;
        entryTime[node] = timer++;

        int xorVal = nums[node];

        for (int neighbor : graph[node]) {
            if (neighbor != par) {
                dfs(neighbor, node, nums);
                xorVal ^= subtreeXOR[neighbor];
            }
        }

        subtreeXOR[node] = xorVal;
        exitTime[node] = timer++;
    }

    private boolean isAncestor(int a, int b) {
        return entryTime[a] <= entryTime[b] && exitTime[a] >= exitTime[b];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- Building adjacency list: O(n)
- DFS to compute subtree XOR: O(n)
- Checking all pairs of nodes: O(n²)
- Ancestor check is O(1) with precomputed entry/exit times
- Total: O(n²) which is acceptable for n ≤ 1000

**Space Complexity: O(n)**

- Adjacency list: O(n)
- Arrays for subtree XOR, parent, entry/exit times: O(n)
- Recursion stack for DFS: O(n) in worst case (linear tree)

## Common Mistakes

1. **Not handling ancestor relationships correctly:** Simply trying all node pairs without checking if one is in the other's subtree can lead to invalid edge removals. Use entry/exit timestamps for O(1) ancestor checks.

2. **Forgetting to check for empty components:** When `subtreeXOR[u] ^ subtreeXOR[v] = 0`, it means the middle component is empty (u and v have the same subtree). Always validate all three components are non-empty.

3. **Incorrect XOR computation order:** When computing `subtreeXOR[u] ^ subtreeXOR[v]`, remember this gives XOR of u's subtree excluding v's subtree only if v is in u's subtree. The ancestor check is crucial.

4. **Using wrong total XOR:** The total XOR should be `subtreeXOR[root]` where root is your DFS starting point, not the sum of all `nums[i]`. XOR is associative and commutative, so DFS computation is correct.

## When You'll See This Pattern

This problem combines tree DFS with XOR properties and pairwise enumeration:

1. **Tree Diameter problems** (LC 543, 1245): Similar DFS approach for tree metrics
2. **Subtree XOR problems** (LC 2317, 2479): Using DFS to compute subtree aggregates
3. **Tree partitioning problems** (LC 1339, 1273): Dividing tree into components with certain properties

The pattern of "precompute subtree values + enumerate valid pairs" appears in many tree optimization problems where brute force is too expensive.

## Key Takeaways

1. **Tree problems often benefit from DFS precomputation:** When you need information about subtrees, compute it once with DFS rather than repeatedly with BFS/DFS.

2. **Ancestor checking with timestamps:** Entry/exit times from DFS let you check if node A is in node B's subtree in O(1) time—a crucial optimization for tree problems.

3. **XOR properties simplify calculations:** XOR is its own inverse (a ^ a = 0), which makes computing "subtree minus sub-subtree" as simple as `xor_u ^ xor_v`.

[Practice this problem on CodeJeet](/problem/minimum-score-after-removals-on-a-tree)
