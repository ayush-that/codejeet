---
title: "How to Solve Maximum Good Subtree Score — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Good Subtree Score. Hard difficulty, 45.5% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Tree, Depth-First Search."
date: "2026-09-01"
category: "dsa-patterns"
tags: ["maximum-good-subtree-score", "array", "dynamic-programming", "bit-manipulation", "hard"]
---

# How to Solve Maximum Good Subtree Score

This problem asks us to find the maximum "good subtree score" in a tree, where a "good" subset of nodes within a subtree must satisfy a digit frequency constraint. The tricky part is that we need to track digit occurrences across all possible subsets within each subtree while efficiently computing scores. This requires combining tree traversal with bitmask-based dynamic programming to track digit frequencies.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider a tree with 4 nodes:

```
vals = [123, 456, 789, 101]
par = [-1, 0, 0, 1]  # Node 0 is root, node 1's parent is 0, etc.
```

Node values: 0=123, 1=456, 2=789, 3=101

Tree structure:

```
      0 (123)
     / \
    1   2 (789)
   (456)
    |
    3 (101)
```

**Step 1: Understanding the digit constraint**

- A "good" subset means: for digits 0-9, each digit appears at most once across ALL node values in the subset
- Example: Node 0 has digits {1,2,3}, Node 1 has digits {4,5,6}, Node 3 has digits {1,0,1} = {0,1}
- Subset {0,1} has digits {1,2,3,4,5,6} - all digits appear ≤1 time ✓ (good)
- Subset {0,3} has digits {1,2,3,0,1} - digit '1' appears twice ✗ (not good)

**Step 2: Understanding the score**

- Score = (sum of values in subset) × (size of subset)
- For subset {0,1}: sum = 123+456=579, size=2, score=579×2=1158
- For subset {0}: sum=123, size=1, score=123

**Step 3: Key insight**
We need to find, for each subtree rooted at node u, the maximum score achievable using any "good" subset within that subtree. This suggests a bottom-up DFS approach where each node returns information about what's possible in its subtree.

## Brute Force Approach

A naive approach would be to:

1. Generate all possible subsets of nodes in the entire tree (2^n subsets)
2. For each subset, check if it's "good" by counting digit frequencies
3. Calculate the score for good subsets and track the maximum

This approach has exponential time complexity O(2^n × n) which is infeasible for n up to 10^4. Even checking all subsets within each subtree would be too slow.

What makes this particularly challenging is that we can't just take the entire subtree if it violates the digit constraint - we need to find the optimal subset within each subtree.

## Optimized Approach

The key insight is to use **DFS with bitmask DP**. Here's the step-by-step reasoning:

1. **Digit representation as bitmask**:
   - Each digit 0-9 can be represented by a bit in a 10-bit integer
   - If a digit appears in a node's value, we set that bit
   - Example: value 123 has digits {1,2,3} → bits 1,2,3 set → mask = 2^1 + 2^2 + 2^3 = 14

2. **Subset representation**:
   - When combining subsets, we need to ensure no digit appears more than once
   - This is equivalent to checking that bitmasks don't overlap (bitwise AND == 0)
   - If masks A and B have no overlapping bits (A & B == 0), we can combine them

3. **DP state for each node**:
   - For each node, we maintain a dictionary/map: mask → (max_sum, max_size)
   - This represents: "In this subtree, using exactly these digits (mask), the maximum sum and corresponding size we can achieve"
   - We need to track multiple masks because different digit combinations might lead to different scores

4. **DFS merging logic**:
   - Process children first (post-order traversal)
   - Start with the current node's mask (using just this node)
   - For each child's DP results, try to merge with current results
   - When merging mask1 from current with mask2 from child:
     - Check if masks overlap (mask1 & mask2 != 0) → can't merge
     - If no overlap: new_mask = mask1 | mask2, new_sum = sum1 + sum2, new_size = size1 + size2
   - Keep the best (max sum) for each mask

5. **Score calculation**:
   - For each mask in node's DP, score = sum × size
   - Track maximum score across all nodes and masks

This approach works because we're exploring all valid combinations of digit usage in a subtree while pruning invalid ones early (when masks overlap).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * 2^10 * 10) ≈ O(n * 10240) - manageable for n=10^4
# Space: O(n * 2^10) for DP storage
class Solution:
    def maximumGoodSubtreeScore(self, vals: List[int], par: List[int]) -> int:
        n = len(vals)

        # Build adjacency list for the tree
        adj = [[] for _ in range(n)]
        for i in range(1, n):  # Skip root (parent = -1)
            adj[par[i]].append(i)

        # Helper to get digit mask for a value
        def get_mask(val: int) -> int:
            mask = 0
            # Handle negative values
            num = abs(val)
            # Special case: 0 needs to set bit 0
            if num == 0:
                mask |= 1 << 0
            while num > 0:
                digit = num % 10
                mask |= 1 << digit
                num //= 10
            return mask

        max_score = float('-inf')

        def dfs(u: int):
            nonlocal max_score

            # Get mask for current node's value
            node_mask = get_mask(vals[u])
            node_sum = vals[u]

            # DP for this subtree: mask -> (max_sum, size)
            # Start with just the current node
            dp = {node_mask: (node_sum, 1)}

            # Update max_score with current node alone
            max_score = max(max_score, node_sum * 1)

            # Process children
            for v in adj[u]:
                child_dp = dfs(v)

                # Merge child's DP into current DP
                new_dp = dp.copy()  # Start with existing combinations

                # Try to merge each combination from current with each from child
                for mask1, (sum1, size1) in dp.items():
                    for mask2, (sum2, size2) in child_dp.items():
                        # Check if masks can be combined (no overlapping digits)
                        if mask1 & mask2 == 0:
                            new_mask = mask1 | mask2
                            new_sum = sum1 + sum2
                            new_size = size1 + size2

                            # Keep the best sum for this mask
                            if new_mask not in new_dp or new_sum > new_dp[new_mask][0]:
                                new_dp[new_mask] = (new_sum, new_size)

                # Also include child's combinations alone
                for mask2, (sum2, size2) in child_dp.items():
                    if mask2 not in new_dp or sum2 > new_dp[mask2][0]:
                        new_dp[mask2] = (sum2, size2)

                dp = new_dp

            # Update max_score with all combinations from this subtree
            for mask, (sum_val, size) in dp.items():
                max_score = max(max_score, sum_val * size)

            return dp

        dfs(0)
        return max_score
```

```javascript
// Time: O(n * 2^10 * 10) ≈ O(n * 10240)
// Space: O(n * 2^10) for DP storage
function maximumGoodSubtreeScore(vals, par) {
  const n = vals.length;

  // Build adjacency list for the tree
  const adj = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    // Skip root (parent = -1)
    adj[par[i]].push(i);
  }

  // Helper to get digit mask for a value
  function getMask(val) {
    let mask = 0;
    // Handle negative values
    let num = Math.abs(val);
    // Special case: 0 needs to set bit 0
    if (num === 0) {
      mask |= 1 << 0;
    }
    while (num > 0) {
      const digit = num % 10;
      mask |= 1 << digit;
      num = Math.floor(num / 10);
    }
    return mask;
  }

  let maxScore = -Infinity;

  function dfs(u) {
    // Get mask for current node's value
    const nodeMask = getMask(vals[u]);
    const nodeSum = vals[u];

    // DP for this subtree: mask -> [max_sum, size]
    // Start with just the current node
    let dp = new Map();
    dp.set(nodeMask, [nodeSum, 1]);

    // Update maxScore with current node alone
    maxScore = Math.max(maxScore, nodeSum * 1);

    // Process children
    for (const v of adj[u]) {
      const childDp = dfs(v);

      // Merge child's DP into current DP
      const newDp = new Map(dp); // Start with existing combinations

      // Try to merge each combination from current with each from child
      for (const [mask1, [sum1, size1]] of dp) {
        for (const [mask2, [sum2, size2]] of childDp) {
          // Check if masks can be combined (no overlapping digits)
          if ((mask1 & mask2) === 0) {
            const newMask = mask1 | mask2;
            const newSum = sum1 + sum2;
            const newSize = size1 + size2;

            // Keep the best sum for this mask
            if (!newDp.has(newMask) || newSum > newDp.get(newMask)[0]) {
              newDp.set(newMask, [newSum, newSize]);
            }
          }
        }
      }

      // Also include child's combinations alone
      for (const [mask2, [sum2, size2]] of childDp) {
        if (!newDp.has(mask2) || sum2 > newDp.get(mask2)[0]) {
          newDp.set(mask2, [sum2, size2]);
        }
      }

      dp = newDp;
    }

    // Update maxScore with all combinations from this subtree
    for (const [mask, [sumVal, size]] of dp) {
      maxScore = Math.max(maxScore, sumVal * size);
    }

    return dp;
  }

  dfs(0);
  return maxScore;
}
```

```java
// Time: O(n * 2^10 * 10) ≈ O(n * 10240)
// Space: O(n * 2^10) for DP storage
class Solution {
    private List<Integer>[] adj;
    private int[] vals;
    private long maxScore;

    public long maximumGoodSubtreeScore(int[] vals, int[] par) {
        int n = vals.length;
        this.vals = vals;
        this.maxScore = Long.MIN_VALUE;

        // Build adjacency list for the tree
        adj = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }
        for (int i = 1; i < n; i++) {  // Skip root (parent = -1)
            adj[par[i]].add(i);
        }

        dfs(0);
        return maxScore;
    }

    // Helper to get digit mask for a value
    private int getMask(int val) {
        int mask = 0;
        // Handle negative values
        int num = Math.abs(val);
        // Special case: 0 needs to set bit 0
        if (num == 0) {
            mask |= 1 << 0;
        }
        while (num > 0) {
            int digit = num % 10;
            mask |= 1 << digit;
            num /= 10;
        }
        return mask;
    }

    private Map<Integer, long[]> dfs(int u) {
        // Get mask for current node's value
        int nodeMask = getMask(vals[u]);
        long nodeSum = vals[u];

        // DP for this subtree: mask -> [max_sum, size]
        // Start with just the current node
        Map<Integer, long[]> dp = new HashMap<>();
        dp.put(nodeMask, new long[]{nodeSum, 1});

        // Update maxScore with current node alone
        maxScore = Math.max(maxScore, nodeSum * 1);

        // Process children
        for (int v : adj[u]) {
            Map<Integer, long[]> childDp = dfs(v);

            // Merge child's DP into current DP
            Map<Integer, long[]> newDp = new HashMap<>(dp);  // Start with existing combinations

            // Try to merge each combination from current with each from child
            for (Map.Entry<Integer, long[]> entry1 : dp.entrySet()) {
                int mask1 = entry1.getKey();
                long sum1 = entry1.getValue()[0];
                long size1 = entry1.getValue()[1];

                for (Map.Entry<Integer, long[]> entry2 : childDp.entrySet()) {
                    int mask2 = entry2.getKey();
                    long sum2 = entry2.getValue()[0];
                    long size2 = entry2.getValue()[1];

                    // Check if masks can be combined (no overlapping digits)
                    if ((mask1 & mask2) == 0) {
                        int newMask = mask1 | mask2;
                        long newSum = sum1 + sum2;
                        long newSize = size1 + size2;

                        // Keep the best sum for this mask
                        if (!newDp.containsKey(newMask) || newSum > newDp.get(newMask)[0]) {
                            newDp.put(newMask, new long[]{newSum, newSize});
                        }
                    }
                }
            }

            // Also include child's combinations alone
            for (Map.Entry<Integer, long[]> entry2 : childDp.entrySet()) {
                int mask2 = entry2.getKey();
                long sum2 = entry2.getValue()[0];
                long size2 = entry2.getValue()[1];

                if (!newDp.containsKey(mask2) || sum2 > newDp.get(mask2)[0]) {
                    newDp.put(mask2, new long[]{sum2, size2});
                }
            }

            dp = newDp;
        }

        // Update maxScore with all combinations from this subtree
        for (Map.Entry<Integer, long[]> entry : dp.entrySet()) {
            long sumVal = entry.getValue()[0];
            long size = entry.getValue()[1];
            maxScore = Math.max(maxScore, sumVal * size);
        }

        return dp;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × 2^D × C)**

- `n`: Number of nodes (up to 10^4)
- `2^D`: Number of possible masks, where D=10 digits → 2^10 = 1024
- `C`: Average number of children (in worst case, tree could be a chain, but each node processes all masks from its children)

In practice, the constant is manageable: n × 1024 × (small constant) ≈ 10^7 operations.

**Space Complexity: O(n × 2^D)**

- Each node stores a DP map with up to 1024 entries
- Recursion stack uses O(n) space for the tree traversal
- Total: O(n × 1024) in worst case

## Common Mistakes

1. **Forgetting to handle digit 0 in values**: When a value is 0 or contains digit 0, you must set bit 0 in the mask. Many candidates miss the special case of `val == 0`.

2. **Not considering negative values**: The problem doesn't specify positive values only. You need to use `abs(val)` when extracting digits from negative numbers.

3. **Incorrect merging logic**: When merging DP states from children, you must:
   - Check for mask overlap (bitwise AND != 0)
   - Keep the best sum for each mask (not just any sum)
   - Include child's combinations independently (not just merged ones)

4. **Integer overflow with score calculation**: The sum of values can be large (n × max_val = 10^4 × 10^4 = 10^8), and multiplied by size gives up to 10^12. Use 64-bit integers (long in Java/JS, int is insufficient).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Tree DP with bitmask state**: Similar to:
   - "Number of Ways to Wear Different Hats to Each Other" (LeetCode 1434) - uses bitmask to represent which hats are used
   - "Maximum Product of the Length of Two Palindromic Subsequences" (LeetCode 2002) - uses bitmask to represent character selections

2. **Subset DP on trees**: Similar to:
   - "Binary Tree Cameras" (LeetCode 968) - DP states depend on child states
   - "House Robber III" (LeetCode 337) - optimal subset selection in a tree

3. **Digit/count constraints with bitmask**: Similar to:
   - "Find the Longest Substring Containing Vowels in Even Counts" (LeetCode 1371) - uses bitmask to track parity
   - "Maximum XOR of Two Numbers in an Array" (LeetCode 421) - uses bitwise operations for constraints

## Key Takeaways

1. **Bitmask for frequency constraints**: When you need to track whether items (digits, characters, etc.) have been used 0 or 1 times, bitmasks are efficient. Each bit represents the presence/absence of an item.

2. **Bottom-up tree DP**: For subtree problems, post-order DFS (children first) lets each node compute its answer based on children's answers. The return value should encapsulate all necessary information from the subtree.

3. **DP state design**: When multiple constraints interact (digit usage + sum maximization), your DP state needs to track all relevant information. Here: mask → (max_sum, size) captures everything needed to compute scores and merge with parent.

[Practice this problem on CodeJeet](/problem/maximum-good-subtree-score)
