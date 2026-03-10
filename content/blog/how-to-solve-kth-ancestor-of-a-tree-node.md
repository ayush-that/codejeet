---
title: "How to Solve Kth Ancestor of a Tree Node — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Kth Ancestor of a Tree Node. Hard difficulty, 37.2% acceptance rate. Topics: Binary Search, Dynamic Programming, Bit Manipulation, Tree, Depth-First Search."
date: "2028-07-17"
category: "dsa-patterns"
tags:
  [
    "kth-ancestor-of-a-tree-node",
    "binary-search",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Kth Ancestor of a Tree Node

You're given a tree represented as a parent array, where `parent[i]` is the parent of node `i`. You need to answer multiple queries asking for the `k`th ancestor of a given node. The challenge is that queries need to be answered efficiently—naively climbing the tree `k` steps would be too slow for large `k` values and many queries.

What makes this problem interesting is that it's a classic application of **binary lifting**, a technique that precomputes ancestors at powers of two to answer queries in logarithmic time. This pattern appears in many tree problems where you need to efficiently navigate upward in a tree.

## Visual Walkthrough

Let's walk through an example to build intuition. Consider this tree:

```
parent = [-1, 0, 0, 1, 1, 2, 2]
Tree structure:
      0
     / \
    1   2
   / \ / \
  3  4 5  6
```

We'll implement binary lifting with `maxPower = 3` (since 2³ = 8 > 7 nodes). Our `up` table will store ancestors at powers of two:

- `up[node][0]` = parent[node] (2⁰ = 1 step up)
- `up[node][1]` = ancestor 2 steps up = `up[up[node][0]][0]`
- `up[node][2]` = ancestor 4 steps up = `up[up[node][1]][1]`

Let's trace finding the 3rd ancestor of node 6:

1. Start at node 6
2. k = 3 in binary: 011 (3 = 2 + 1)
3. First bit (2¹): k ≥ 2, so jump 2 steps: 6 → up[6][1] = up[2][0] = 0
4. Remaining k = 1 (3 - 2 = 1)
5. Next bit (2⁰): k ≥ 1, so jump 1 step: 0 → up[0][0] = -1
6. Result is -1 (no ancestor exists)

For the 2nd ancestor of node 5:

1. Start at node 5
2. k = 2 in binary: 010 (2 = 2)
3. First bit (2¹): k ≥ 2, so jump 2 steps: 5 → up[5][1] = up[2][0] = 0
4. Result is 0

## Brute Force Approach

The most straightforward approach is to simply climb the tree `k` times:

```python
def getKthAncestor(node, k):
    for _ in range(k):
        if node == -1:
            return -1
        node = parent[node]
    return node
```

**Why this fails:**

- **Time complexity:** O(k) per query
- With `k` up to 5×10⁴ and many queries, this becomes O(n×k) which is far too slow
- Each query might need to traverse nearly the entire height of the tree

The brute force approach doesn't scale because it processes each step individually. We need a way to make larger jumps efficiently.

## Optimized Approach

The key insight is **binary lifting**: precompute ancestors at powers of two so we can make exponential jumps.

**Step-by-step reasoning:**

1. **Observation:** Any integer `k` can be expressed as a sum of powers of two (its binary representation)
2. **Idea:** If we know for each node its ancestor at distance 2⁰, 2¹, 2², ..., we can combine these to reach any distance `k`
3. **Precomputation:** Build a table `up[node][i]` = the 2ⁱ-th ancestor of `node`
   - Base case: `up[node][0]` = parent[node] (1 step)
   - Recurrence: `up[node][i]` = `up[up[node][i-1]][i-1]` (2ⁱ = 2ⁱ⁻¹ + 2ⁱ⁻¹)
4. **Query:** To find k-th ancestor:
   - Express `k` in binary
   - For each set bit at position `i`, jump 2ⁱ steps using `up[node][i]`
   - If we ever reach -1, return -1 (no ancestor exists)

**Why this works:**

- Preprocessing takes O(n log n) time and space
- Each query takes O(log k) time instead of O(k)
- This is a classic space-time tradeoff that's essential for handling many queries efficiently

## Optimal Solution

Here's the complete binary lifting solution with detailed comments:

<div class="code-group">

```python
class TreeAncestor:
    # Time: O(n log n) for initialization, O(log k) per query
    # Space: O(n log n) for the up table

    def __init__(self, n: int, parent: List[int]):
        # maxPower is the maximum power of 2 we need to consider
        # We need 2^maxPower >= n, so maxPower = ceil(log2(n))
        self.maxPower = (n).bit_length()  # Number of bits needed to represent n

        # up[node][i] stores the (2^i)-th ancestor of node
        # Initialize with -1 (no ancestor)
        self.up = [[-1] * self.maxPower for _ in range(n)]

        # Fill the first column (2^0 = 1 step ancestors)
        for node in range(n):
            self.up[node][0] = parent[node]

        # Fill the rest of the table using dynamic programming
        # up[node][i] = up[up[node][i-1]][i-1] if up[node][i-1] != -1
        for power in range(1, self.maxPower):
            for node in range(n):
                # Get the (2^(power-1))-th ancestor
                mid = self.up[node][power - 1]
                if mid != -1:
                    # From there, take another (2^(power-1)) steps
                    self.up[node][power] = self.up[mid][power - 1]

    def getKthAncestor(self, node: int, k: int) -> int:
        # If k is 0, the node is its own 0-th ancestor
        if k == 0:
            return node

        # If k is too large (>= 2^maxPower), no ancestor exists
        if k >= (1 << self.maxPower):
            return -1

        # Process k bit by bit
        for power in range(self.maxPower):
            # Check if the power-th bit is set in k
            if k & (1 << power):
                # Jump 2^power steps
                node = self.up[node][power]
                # If we reach -1, no ancestor exists
                if node == -1:
                    return -1
        return node
```

```javascript
class TreeAncestor {
  // Time: O(n log n) for initialization, O(log k) per query
  // Space: O(n log n) for the up table

  constructor(n, parent) {
    // Calculate maxPower: we need 2^maxPower >= n
    this.maxPower = Math.ceil(Math.log2(n));

    // Initialize up table with -1
    this.up = Array.from({ length: n }, () => Array(this.maxPower).fill(-1));

    // Fill first column with direct parents
    for (let node = 0; node < n; node++) {
      this.up[node][0] = parent[node];
    }

    // Fill the rest using dynamic programming
    for (let power = 1; power < this.maxPower; power++) {
      for (let node = 0; node < n; node++) {
        const mid = this.up[node][power - 1];
        if (mid !== -1) {
          this.up[node][power] = this.up[mid][power - 1];
        }
      }
    }
  }

  getKthAncestor(node, k) {
    // Handle k = 0 case
    if (k === 0) return node;

    // If k is too large, no ancestor exists
    if (k >= 1 << this.maxPower) return -1;

    // Process each bit of k
    for (let power = 0; power < this.maxPower; power++) {
      // Check if the power-th bit is set
      if (k & (1 << power)) {
        node = this.up[node][power];
        if (node === -1) return -1;
      }
    }
    return node;
  }
}
```

```java
class TreeAncestor {
    // Time: O(n log n) for initialization, O(log k) per query
    // Space: O(n log n) for the up table

    private int maxPower;
    private int[][] up;

    public TreeAncestor(int n, int[] parent) {
        // Calculate the maximum power needed: ceil(log2(n))
        this.maxPower = (int) Math.ceil(Math.log(n) / Math.log(2));

        // Initialize up table with -1
        this.up = new int[n][maxPower];
        for (int i = 0; i < n; i++) {
            Arrays.fill(up[i], -1);
        }

        // Fill first column with direct parents
        for (int node = 0; node < n; node++) {
            up[node][0] = parent[node];
        }

        // Fill the rest using dynamic programming
        for (int power = 1; power < maxPower; power++) {
            for (int node = 0; node < n; node++) {
                int mid = up[node][power - 1];
                if (mid != -1) {
                    up[node][power] = up[mid][power - 1];
                }
            }
        }
    }

    public int getKthAncestor(int node, int k) {
        // Handle k = 0 case
        if (k == 0) return node;

        // If k is too large, no ancestor exists
        if (k >= (1 << maxPower)) return -1;

        // Process each bit of k
        for (int power = 0; power < maxPower; power++) {
            // Check if the power-th bit is set
            if ((k & (1 << power)) != 0) {
                node = up[node][power];
                if (node == -1) return -1;
            }
        }
        return node;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Preprocessing (constructor):** O(n log n)
  - We have two nested loops: outer runs log n times, inner runs n times
  - Each iteration does constant work
- **Query:** O(log k) per query
  - We process at most log k bits of k (since maxPower = O(log n))
  - Each bit check and jump is O(1)

**Space Complexity:** O(n log n)

- We store an n × log n table of ancestors
- Each cell stores one integer

**Why this is optimal:**

- For answering Q queries, total time is O(n log n + Q log k)
- Any solution must at least read the parent array (O(n)) and process each query
- Binary lifting achieves the best known theoretical bounds for this problem

## Common Mistakes

1. **Not handling the root node properly:** The root's parent is typically -1. If you don't check for -1 when building the `up` table, you'll get array index errors.
   - **Fix:** Always check if `mid != -1` before accessing `up[mid][power-1]`

2. **Incorrect maxPower calculation:** Using `log2(n)` without ceiling or using `n` directly instead of bit length.
   - **Fix:** Use `Math.ceil(Math.log2(n))` or `(n).bit_length()` to ensure 2^maxPower ≥ n

3. **Off-by-one errors in bit processing:** Starting power from 1 instead of 0, or using wrong bit masks.
   - **Fix:** Remember that `(1 << power)` tests the `power`-th bit (0-indexed from LSB)

4. **Not checking if k is too large:** If k ≥ 2^maxPower, we know immediately no ancestor exists.
   - **Fix:** Add early return: `if k >= (1 << maxPower): return -1`

5. **Forgetting to handle k = 0:** The 0-th ancestor is the node itself.
   - **Fix:** Add special case at the beginning of `getKthAncestor`

## When You'll See This Pattern

Binary lifting is a fundamental technique for tree problems involving ancestor queries:

1. **Lowest Common Ancestor (LCA):** [Problem 1483](https://leetcode.com/problems/kth-ancestor-of-a-tree-node/) itself, and [Problem 236](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) (though for binary trees, other approaches exist)
   - LCA can be found by binary lifting to bring nodes to same depth, then binary search for LCA

2. **Path queries on trees:** [Problem 2846](https://leetcode.com/problems/minimum-edge-weight-equilibrium-queries-in-a-tree/) (mentioned in the problem statement)
   - Combine binary lifting with additional information (like edge weights) stored at powers of two

3. **Jump games on trees:** Problems where you need to find where you land after k jumps
   - The same binary lifting technique applies directly

4. **Tree distance queries:** Finding distance between two nodes = depth[u] + depth[v] - 2×depth[LCA(u,v)]
   - Binary lifting helps find LCA efficiently

## Key Takeaways

1. **Binary lifting transforms O(k) queries into O(log k):** By precomputing ancestors at powers of two, we can make exponential jumps up the tree. This is a classic space-time tradeoff.

2. **Recognize when to use binary lifting:** When you have a tree structure and need to answer many ancestor/jump queries efficiently. The preprocessing cost is justified by multiple queries.

3. **The recurrence is key:** `up[node][i] = up[up[node][i-1]][i-1]` builds the table efficiently using previously computed values. This is dynamic programming on trees.

4. **Bit manipulation is your friend:** Processing k bit-by-bit lets you combine precomputed jumps to reach any distance.

Related problems: [Minimum Edge Weight Equilibrium Queries in a Tree](/problem/minimum-edge-weight-equilibrium-queries-in-a-tree)
