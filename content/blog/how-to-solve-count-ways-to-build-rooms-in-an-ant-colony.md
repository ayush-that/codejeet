---
title: "How to Solve Count Ways to Build Rooms in an Ant Colony — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Ways to Build Rooms in an Ant Colony. Hard difficulty, 51.1% acceptance rate. Topics: Array, Math, Dynamic Programming, Tree, Depth-First Search."
date: "2026-05-10"
category: "dsa-patterns"
tags: ["count-ways-to-build-rooms-in-an-ant-colony", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Count Ways to Build Rooms in an Ant Colony

You're given a dependency graph where each room must be built after its parent room, and you need to count the number of valid build orders. The twist is that rooms at the same level can be built in any order, making this a combinatorial problem on a tree structure. What makes this problem tricky is that you need to combine tree traversal with combinatorial mathematics to count permutations while respecting dependencies.

## Visual Walkthrough

Let's walk through a small example: `prevRoom = [-1, 0, 0, 1, 1]`

This represents a tree where:

- Room 0 has no parent (root)
- Rooms 1 and 2 are children of room 0
- Rooms 3 and 4 are children of room 1

Visually:

```
    0
   / \
  1   2
 / \
3   4
```

We need to count valid build orders. The key insight: when building a subtree, the root must come first, but the subtrees of different children can be interleaved in any valid way.

For node 0's subtree:

- Node 0 must be built first
- Then we need to interleave the builds of subtree rooted at 1 and subtree rooted at 2
- Subtree at 1 has size 3 (nodes 1, 3, 4)
- Subtree at 2 has size 1 (node 2)

The number of ways to interleave these sequences is given by the multinomial coefficient: `(total_size)! / (size1! * size2! * ...)`

So for node 0: `(1+3+1)! / (3! * 1!) = 5! / (6 * 1) = 120 / 6 = 20` ways

But wait! We also need to multiply by the number of valid orders within each subtree. This is where recursion comes in.

## Brute Force Approach

A naive approach would be to generate all possible permutations of n rooms and check if each permutation satisfies the dependency constraints. For each permutation, we could verify that for every room i, its parent `prevRoom[i]` appears before i in the sequence.

The problem with this approach is obvious: there are n! permutations to check. For n = 10^5 (the problem constraints), this is astronomically large. Even for n = 20, 20! ≈ 2.4×10¹⁸, which is completely infeasible.

The brute force teaches us that we need a smarter way to count without enumerating all possibilities. We need to use combinatorial mathematics to calculate the count directly.

## Optimized Approach

The key insight is that the dependency structure forms a tree (since each node has exactly one parent, and there are no cycles because we can't have circular dependencies in a valid build order).

Here's the step-by-step reasoning:

1. **Tree Structure**: The `prevRoom` array defines a tree where `prevRoom[i]` is the parent of node i (except for the root where `prevRoom[0] = -1`).

2. **Recursive Counting**: For any node, the number of valid build orders for its subtree equals:
   - The product of valid orders for each child's subtree
   - Multiplied by the number of ways to interleave those sequences

3. **Interleaving Formula**: If a node has children with subtree sizes s₁, s₂, ..., sₖ, and the node itself contributes 1 to the total, then the number of ways to interleave these sequences is:

   ```
   (s₁ + s₂ + ... + sₖ)! / (s₁! × s₂! × ... × sₖ!)
   ```

   This is a multinomial coefficient.

4. **Modular Arithmetic**: Since the result can be huge, we need to compute modulo 10^9+7. This requires modular inverses for division.

5. **Post-order DFS**: We need to process children before parents, so we use post-order traversal (depth-first search).

6. **Precompute Factorials**: To efficiently compute combinations, we precompute factorials and inverse factorials up to n.

## Optimal Solution

The solution uses DFS with combinatorial mathematics. We build the tree, then perform post-order traversal to compute subtree sizes and counts.

<div class="code-group">

```python
MOD = 10**9 + 7

class Solution:
    def waysToBuildRooms(self, prevRoom: List[int]) -> int:
        n = len(prevRoom)

        # Step 1: Build the tree adjacency list
        graph = [[] for _ in range(n)]
        for i in range(1, n):  # Skip root (0) since it has no parent
            graph[prevRoom[i]].append(i)

        # Step 2: Precompute factorials and inverse factorials up to n
        fact = [1] * (n + 1)
        inv_fact = [1] * (n + 1)

        for i in range(2, n + 1):
            fact[i] = fact[i-1] * i % MOD

        # Fermat's little theorem for modular inverse: a^(MOD-2) ≡ a^(-1) mod MOD
        inv_fact[n] = pow(fact[n], MOD-2, MOD)
        for i in range(n-1, -1, -1):
            inv_fact[i] = inv_fact[i+1] * (i+1) % MOD

        # Step 3: DFS to compute subtree sizes and counts
        def dfs(node):
            # total_size includes current node
            total_size = 1
            # total_ways is the number of valid orders for this subtree
            total_ways = 1

            # Process all children
            for child in graph[node]:
                child_size, child_ways = dfs(child)
                total_size += child_size

                # Multiply by child's ways and by the combination factor
                # C(total_size-1, child_size) = fact[total_size-1] / (fact[child_size] * fact[total_size-1-child_size])
                # But we accumulate, so we use the incremental formula
                total_ways = total_ways * child_ways % MOD
                total_ways = total_ways * fact[total_size-1] % MOD
                total_ways = total_ways * inv_fact[child_size] % MOD
                total_ways = total_ways * inv_fact[total_size-1-child_size] % MOD

            return total_size, total_ways

        # Start DFS from root (node 0)
        _, result = dfs(0)
        return result % MOD
```

```javascript
const MOD = 10 ** 9 + 7;

/**
 * @param {number[]} prevRoom
 * @return {number}
 */
var waysToBuildRooms = function (prevRoom) {
  const n = prevRoom.length;

  // Step 1: Build the tree adjacency list
  const graph = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    // Skip root (0)
    graph[prevRoom[i]].push(i);
  }

  // Step 2: Precompute factorials and inverse factorials
  const fact = new Array(n + 1).fill(1);
  const invFact = new Array(n + 1).fill(1);

  for (let i = 2; i <= n; i++) {
    fact[i] = (fact[i - 1] * i) % MOD;
  }

  // Modular exponentiation helper
  const modPow = (a, b) => {
    let result = 1;
    a %= MOD;
    while (b > 0) {
      if (b & 1) result = (result * a) % MOD;
      a = (a * a) % MOD;
      b >>= 1;
    }
    return result;
  };

  // Fermat's little theorem for modular inverse
  invFact[n] = modPow(fact[n], MOD - 2);
  for (let i = n - 1; i >= 0; i--) {
    invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;
  }

  // Step 3: DFS to compute subtree sizes and counts
  const dfs = (node) => {
    let totalSize = 1; // Includes current node
    let totalWays = 1;

    for (const child of graph[node]) {
      const [childSize, childWays] = dfs(child);

      // Update total size with this child's subtree
      const oldSize = totalSize - 1;
      totalSize += childSize;

      // Multiply by child's ways
      totalWays = (totalWays * childWays) % MOD;

      // Multiply by combination factor: C(totalSize-1, childSize)
      // = fact[totalSize-1] / (fact[childSize] * fact[totalSize-1-childSize])
      totalWays = (totalWays * fact[totalSize - 1]) % MOD;
      totalWays = (totalWays * invFact[childSize]) % MOD;
      totalWays = (totalWays * invFact[totalSize - 1 - childSize]) % MOD;
    }

    return [totalSize, totalWays];
  };

  const [_, result] = dfs(0);
  return result % MOD;
};
```

```java
class Solution {
    private static final int MOD = 1_000_000_007;
    private List<Integer>[] graph;
    private long[] fact;
    private long[] invFact;

    public int waysToBuildRooms(int[] prevRoom) {
        int n = prevRoom.length;

        // Step 1: Build the tree adjacency list
        graph = new List[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        for (int i = 1; i < n; i++) {  // Skip root (0)
            graph[prevRoom[i]].add(i);
        }

        // Step 2: Precompute factorials and inverse factorials
        fact = new long[n + 1];
        invFact = new long[n + 1];
        fact[0] = 1;
        fact[1] = 1;

        for (int i = 2; i <= n; i++) {
            fact[i] = (fact[i-1] * i) % MOD;
        }

        // Modular exponentiation helper
        invFact[n] = modPow(fact[n], MOD - 2);
        for (int i = n - 1; i >= 0; i--) {
            invFact[i] = (invFact[i+1] * (i+1)) % MOD;
        }

        // Step 3: DFS to compute subtree sizes and counts
        long[] result = dfs(0);
        return (int)(result[1] % MOD);
    }

    private long[] dfs(int node) {
        long totalSize = 1;  // Includes current node
        long totalWays = 1;

        for (int child : graph[node]) {
            long[] childResult = dfs(child);
            long childSize = childResult[0];
            long childWays = childResult[1];

            // Update total size with this child's subtree
            totalSize += childSize;

            // Multiply by child's ways
            totalWays = (totalWays * childWays) % MOD;

            // Multiply by combination factor: C(totalSize-1, childSize)
            // = fact[totalSize-1] / (fact[childSize] * fact[totalSize-1-childSize])
            totalWays = (totalWays * fact[(int)totalSize - 1]) % MOD;
            totalWays = (totalWays * invFact[(int)childSize]) % MOD;
            totalWays = (totalWays * invFact[(int)(totalSize - 1 - childSize)]) % MOD;
        }

        return new long[]{totalSize, totalWays};
    }

    private long modPow(long a, long b) {
        long result = 1;
        a %= MOD;
        while (b > 0) {
            if ((b & 1) == 1) {
                result = (result * a) % MOD;
            }
            a = (a * a) % MOD;
            b >>= 1;
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- Building the graph: O(n)
- Precomputing factorials: O(n)
- Computing inverse factorials: O(n) using the efficient method
- DFS traversal: O(n) since we visit each node once
- Total: O(n)

**Space Complexity:** O(n)

- Graph adjacency list: O(n)
- Factorial arrays: O(n)
- DFS recursion stack: O(n) in worst case (linear tree)
- Total: O(n)

The key to the linear time complexity is that we precompute all factorials and their modular inverses, allowing O(1) computation of combination values during DFS.

## Common Mistakes

1. **Forgetting modular arithmetic for division**: When computing combinations modulo MOD, you can't just divide. You need to multiply by modular inverses. This is why we precompute `inv_fact`.

2. **Incorrect combination formula**: A common error is using `C(total_size, child_size)` instead of `C(total_size-1, child_size)`. Remember: when interleaving sequences, we're arranging `total_size-1` items (all except the current node which must come first) into positions for the child subtrees.

3. **Not handling large n recursively**: With n up to 10^5, a deep recursion could cause stack overflow in some languages. While the problem constraints usually allow it, in an interview you might want to mention iterative DFS as an alternative.

4. **Integer overflow before modulo**: When computing factorials for large n, intermediate values can exceed 64-bit integers. Always apply modulo after each multiplication to keep numbers manageable.

## When You'll See This Pattern

This problem combines tree DP with combinatorial counting, a pattern that appears in several advanced problems:

1. **Count Anagrams (Hard)**: Similar combinatorial counting of permutations with constraints, though not on a tree structure.

2. **Count the Number of Good Subsequences (Medium)**: Also involves counting valid sequences with combinatorial formulas.

3. **Number of Ways to Reorder Array to Get Same BST (Hard)**: Almost identical pattern - count valid insertion orders that produce the same BST, which involves combinatorial interleaving of left and right subtrees.

4. **Unique Binary Search Trees II (Medium)**: While focused on generating trees rather than counting, it uses similar recursive combinatorial thinking.

The core pattern is: when you need to count arrangements/orders where elements have dependency constraints forming a tree, think "post-order DFS + combinatorial interleaving".

## Key Takeaways

1. **Tree + Combinatorics**: When dependencies form a tree and you need to count valid orders, combine DFS with combinatorial formulas for interleaving sequences.

2. **Multinomial Coefficients**: The formula `(total)!/(size1!×size2!×...)` counts ways to interleave sequences of given sizes. This appears whenever you can arbitrarily mix independent subsequences.

3. **Modular Arithmetic with Division**: In counting problems modulo a prime, use Fermat's Little Theorem (`a^(p-2) ≡ a^(-1) mod p`) to compute modular inverses for division operations.

Related problems: [Count Anagrams](/problem/count-anagrams), [Count the Number of Good Subsequences](/problem/count-the-number-of-good-subsequences)
