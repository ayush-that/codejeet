---
title: "How to Solve Count Paths That Can Form a Palindrome in a Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Paths That Can Form a Palindrome in a Tree. Hard difficulty, 48.4% acceptance rate. Topics: Dynamic Programming, Bit Manipulation, Tree, Depth-First Search, Bitmask."
date: "2026-05-17"
category: "dsa-patterns"
tags:
  [
    "count-paths-that-can-form-a-palindrome-in-a-tree",
    "dynamic-programming",
    "bit-manipulation",
    "tree",
    "hard",
  ]
---

# How to Solve Count Paths That Can Form a Palindrome in a Tree

This problem asks us to count the number of paths in a tree where the characters along the path can be rearranged to form a palindrome. The tricky part is that we need to efficiently check all possible paths between any two nodes in the tree, which would be O(n²) if done naively. The interesting insight is that we can use bitmasking to represent character parity and leverage the tree structure to compute path information efficiently.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider a tree with 4 nodes and the string `s = "abac"`:

```
parent = [-1, 0, 0, 1]  (node 0 is root)
s = "abac"
```

Tree structure:

- Node 0: character 'a', parent is -1 (root)
- Node 1: character 'b', parent is 0
- Node 2: character 'a', parent is 0
- Node 3: character 'c', parent is 1

Now let's check some paths:

**Path from node 0 to node 1**: "ab" → characters: 'a', 'b'

- Can we form a palindrome? We need at most one character with odd count.
- 'a' appears once (odd), 'b' appears once (odd) → two odd counts → NOT a palindrome

**Path from node 1 to node 2**: "bac" → characters: 'b', 'a', 'a'

- 'b' appears once (odd), 'a' appears twice (even)
- Only one odd count → CAN form a palindrome (e.g., "aba")

**Path from node 0 to node 3**: "abc" → characters: 'a', 'b', 'c'

- 'a' appears once (odd), 'b' appears once (odd), 'c' appears once (odd)
- Three odd counts → NOT a palindrome

The key insight: A string can be rearranged into a palindrome if and only if at most one character has an odd frequency. Instead of counting frequencies, we can track **parity** (odd/even) using bitmasks.

## Brute Force Approach

The brute force approach would be to:

1. For each pair of nodes (i, j) where i ≤ j
2. Find the path from i to j by walking up to their LCA (lowest common ancestor)
3. Collect all characters along the path
4. Check if they can form a palindrome by counting character frequencies

```python
def brute_force(parent, s):
    n = len(parent)
    count = 0

    # Build adjacency list for the tree
    adj = [[] for _ in range(n)]
    for i in range(1, n):
        adj[parent[i]].append(i)
        adj[i].append(parent[i])

    # For each pair of nodes
    for i in range(n):
        for j in range(i, n):
            # Find path from i to j
            path = []
            # This would require BFS/DFS to find the path
            # Then check palindrome condition

            # Simplified: This approach is O(n³) and too slow
    return count
```

**Why it's too slow:**

- There are O(n²) pairs of nodes
- Finding the path between two nodes in a tree takes O(n) worst case
- Checking palindrome condition takes O(26) = O(1) but doesn't help enough
- Total: O(n³) → far too slow for n up to 10⁵

## Optimized Approach

The key insights for optimization:

1. **Bitmask representation**: Use a 26-bit integer to represent character parity. Bit i is 1 if character 'a'+i appears an odd number of times along the path from root to current node.

2. **Path XOR property**: The parity mask for path u→v equals `mask[u] XOR mask[v] XOR char_mask(lca)`, where char_mask(lca) is the mask for the LCA's character. Actually simpler: `path_mask = mask[u] ^ mask[v] ^ char_mask(node_u) ^ char_mask(node_v)` but we need to be careful about double-counting.

3. **Better approach**: For path from u to v, the mask is `mask[u] ^ mask[v]`. Wait, why? Because when we XOR two root-to-node masks, characters that appear an even number of times in the combined path cancel out, leaving only characters that appear an odd number of times in the u→v path.

4. **Palindrome check**: A path can form a palindrome if `path_mask` has at most 1 bit set (i.e., `path_mask & (path_mask - 1) == 0`).

5. **Counting trick**: For each node, we want to count how many previous nodes have masks that when XORed with current mask produce a result with ≤1 bit set. We can use a frequency map to store counts of masks we've seen so far.

The algorithm:

1. DFS from root to compute `mask[node]` = XOR of all characters from root to node
2. For each node, check all masks that differ by 0 or 1 bit from current mask
3. Add to answer the count of such masks seen so far
4. Update frequency map with current mask

## Optimal Solution

<div class="code-group">

```python
# Time: O(26n) = O(n) | Space: O(n)
class Solution:
    def countPalindromePaths(self, parent: List[int], s: str) -> int:
        n = len(parent)

        # Build adjacency list for the tree
        adj = [[] for _ in range(n)]
        for i in range(1, n):
            adj[parent[i]].append(i)

        # mask[node] stores the bitmask from root to node
        # Bit i is 1 if character 'a'+i appears odd times on the path
        mask = [0] * n

        # DFS to compute masks for all nodes
        def dfs(node, current_mask):
            # XOR current mask with current node's character
            char_index = ord(s[node]) - ord('a')
            mask[node] = current_mask ^ (1 << char_index)

            # Continue DFS to children
            for child in adj[node]:
                dfs(child, mask[node])

        # Start DFS from root (node 0) with initial mask 0
        dfs(0, 0)

        # freq stores how many times we've seen each mask
        freq = {}
        result = 0

        # Process nodes in DFS order (any order works as long as parent before child)
        for node in range(n):
            current_mask = mask[node]

            # Check masks that differ by 0 bits (same mask)
            # These paths end at current node and start at some previous node
            # with the same mask -> path has all characters with even counts
            result += freq.get(current_mask, 0)

            # Check masks that differ by exactly 1 bit
            # These correspond to paths with exactly one character having odd count
            for i in range(26):
                # Flip the i-th bit and check if we've seen this mask before
                mask_with_one_diff = current_mask ^ (1 << i)
                result += freq.get(mask_with_one_diff, 0)

            # Update frequency map for current mask
            freq[current_mask] = freq.get(current_mask, 0) + 1

        return result
```

```javascript
// Time: O(26n) = O(n) | Space: O(n)
/**
 * @param {number[]} parent
 * @param {string} s
 * @return {number}
 */
var countPalindromePaths = function (parent, s) {
  const n = parent.length;

  // Build adjacency list for the tree
  const adj = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    adj[parent[i]].push(i);
  }

  // mask[node] stores the bitmask from root to node
  const mask = new Array(n).fill(0);

  // DFS to compute masks for all nodes
  function dfs(node, currentMask) {
    // XOR current mask with current node's character
    const charIndex = s.charCodeAt(node) - 97;
    mask[node] = currentMask ^ (1 << charIndex);

    // Continue DFS to children
    for (const child of adj[node]) {
      dfs(child, mask[node]);
    }
  }

  // Start DFS from root (node 0) with initial mask 0
  dfs(0, 0);

  // freq stores how many times we've seen each mask
  const freq = new Map();
  let result = 0;

  // Process all nodes
  for (let node = 0; node < n; node++) {
    const currentMask = mask[node];

    // Check masks that differ by 0 bits (same mask)
    result += freq.get(currentMask) || 0;

    // Check masks that differ by exactly 1 bit
    for (let i = 0; i < 26; i++) {
      const maskWithOneDiff = currentMask ^ (1 << i);
      result += freq.get(maskWithOneDiff) || 0;
    }

    // Update frequency map for current mask
    freq.set(currentMask, (freq.get(currentMask) || 0) + 1);
  }

  return result;
};
```

```java
// Time: O(26n) = O(n) | Space: O(n)
class Solution {
    public long countPalindromePaths(List<Integer> parent, String s) {
        int n = parent.size();

        // Build adjacency list for the tree
        List<Integer>[] adj = new List[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }
        for (int i = 1; i < n; i++) {
            adj[parent.get(i)].add(i);
        }

        // mask[node] stores the bitmask from root to node
        int[] mask = new int[n];

        // DFS to compute masks for all nodes
        dfs(0, 0, adj, s, mask);

        // freq stores how many times we've seen each mask
        Map<Integer, Integer> freq = new HashMap<>();
        long result = 0;

        // Process all nodes
        for (int node = 0; node < n; node++) {
            int currentMask = mask[node];

            // Check masks that differ by 0 bits (same mask)
            result += freq.getOrDefault(currentMask, 0);

            // Check masks that differ by exactly 1 bit
            for (int i = 0; i < 26; i++) {
                int maskWithOneDiff = currentMask ^ (1 << i);
                result += freq.getOrDefault(maskWithOneDiff, 0);
            }

            // Update frequency map for current mask
            freq.put(currentMask, freq.getOrDefault(currentMask, 0) + 1);
        }

        return result;
    }

    private void dfs(int node, int currentMask, List<Integer>[] adj, String s, int[] mask) {
        // XOR current mask with current node's character
        int charIndex = s.charAt(node) - 'a';
        mask[node] = currentMask ^ (1 << charIndex);

        // Continue DFS to children
        for (int child : adj[node]) {
            dfs(child, mask[node], adj, s, mask);
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(26n) = O(n)**

- Building adjacency list: O(n)
- DFS to compute masks: O(n) - each edge visited once
- Processing each node and checking 27 masks (same + 26 one-bit differences): O(27n) = O(n)
- Total: O(n)

**Space Complexity: O(n)**

- Adjacency list: O(n)
- Mask array: O(n)
- Frequency map: O(n) in worst case (all masks distinct)
- DFS recursion stack: O(n) in worst case (skewed tree)

## Common Mistakes

1. **Not understanding the XOR property**: The most common mistake is not realizing that `mask[u] ^ mask[v]` gives the parity mask for path u→v. Remember: XOR cancels out characters that appear an even number of times in the combined path.

2. **Forgetting to check the same mask**: Candidates often only check masks that differ by 1 bit, forgetting that a palindrome can also have all character counts even (mask with 0 bits set in the path).

3. **Incorrect bit manipulation**: When checking masks that differ by 1 bit, some candidates try to count bits instead of flipping each bit individually. The efficient way is to iterate through 26 bits and flip each one.

4. **Using wrong data structure for frequency**: Using an array of size 2²⁶ (67 million) is wasteful. A hash map is more efficient since we only encounter O(n) distinct masks.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Bitmasking for character parity**: Similar to "Find Longest Awesome Substring" (LeetCode 1542) which also uses bitmasking to track character parity in substrings.

2. **Tree path aggregation**: Like "Count Valid Paths in a Tree" (LeetCode 2867) which also requires aggregating information along tree paths.

3. **XOR properties in trees**: Seen in problems like "Maximum XOR of Two Numbers in an Array" (LeetCode 421) which uses similar XOR properties but in arrays rather than trees.

The core pattern is: when you need to track parity or modular counts along paths, consider using bitmasking and leveraging XOR properties to combine path information efficiently.

## Key Takeaways

1. **Bitmasking is powerful for parity problems**: When you need to track whether counts are odd/even (not the actual counts), a bitmask is often the right tool. Each bit represents the parity for one element.

2. **XOR cancels duplicates**: In path problems, XORing masks from root to two nodes gives the mask for the path between them because characters that appear an even number of times cancel out.

3. **Palindrome condition as bitmask check**: A string can be rearranged into a palindrome if its character parity mask has at most 1 bit set. This transforms a string problem into a simple bit operation.

Related problems: [Count Valid Paths in a Tree](/problem/count-valid-paths-in-a-tree)
