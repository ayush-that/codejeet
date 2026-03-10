---
title: "How to Solve Groups of Strings — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Groups of Strings. Hard difficulty, 27.5% acceptance rate. Topics: Array, Hash Table, String, Bit Manipulation, Union-Find."
date: "2026-04-16"
category: "dsa-patterns"
tags: ["groups-of-strings", "array", "hash-table", "string", "hard"]
---

# How to Solve Groups of Strings

This problem asks us to group strings based on shared letters. Given an array of strings where each string contains unique lowercase letters, two strings are connected if one string's letter set can be obtained from the other's by adding or removing exactly one letter. Strings can be connected directly or indirectly through other strings. We need to return the size of the largest connected group and the total number of groups.

What makes this problem tricky is that connections can be indirect: if string A connects to B, and B connects to C, then A, B, and C are all in the same group even if A and C don't directly connect. This transitive relationship means we need to track connectivity across the entire dataset, which is a classic use case for union-find (disjoint set union).

## Visual Walkthrough

Let's trace through a small example: `words = ["a", "b", "ab", "abc"]`

**Step 1: Represent each string as a bitmask**

- "a" → only letter 'a' → bitmask: `000...001` (1 in decimal)
- "b" → only letter 'b' → bitmask: `000...010` (2 in decimal)
- "ab" → letters 'a' and 'b' → bitmask: `000...011` (3 in decimal)
- "abc" → letters 'a', 'b', 'c' → bitmask: `000...111` (7 in decimal)

**Step 2: Check direct connections**

- "a" connects to "ab" because we can add 'b' to "a" to get "ab"
- "b" connects to "ab" because we can add 'a' to "b" to get "ab"
- "ab" connects to "abc" because we can add 'c' to "ab" to get "abc"

**Step 3: Build groups via union-find**

- Union "a" and "ab"
- Union "b" and "ab" (this connects "b" to "a" indirectly)
- Union "ab" and "abc"

**Result**: All strings are in one group: `{"a", "b", "ab", "abc"}`

- Largest group size: 4
- Number of groups: 1

## Brute Force Approach

A naive approach would be to compare every pair of strings to check if they're connected, then build the groups. For each pair (i, j), we'd need to:

1. Check if the strings differ by exactly one letter (either by adding or removing)
2. If connected, mark them as in the same group

The comparison itself is O(L) where L is string length (max 26). With n strings, we have O(n²) pairs, giving O(n²L) time complexity. For n up to 2×10⁴, this is far too slow (~4×10⁸ operations minimum).

Even worse, after finding connections, we'd need to build the groups. We could use DFS/BFS starting from each unvisited string, but that's still O(n²) in the worst case when all strings are connected.

## Optimized Approach

The key insight is that we can represent each string as a 26-bit integer (bitmask), where bit i is 1 if the i-th letter ('a' = bit 0, 'b' = bit 1, etc.) is present. This compact representation allows O(1) set operations.

**Core optimization**: Instead of comparing every pair, for each string's bitmask, we can generate all possible masks that would be connected to it:

1. **Remove one letter**: For each set bit, clear it (mask ^ (1 << bit))
2. **Add one letter**: For each unset bit (only among first 26), set it (mask | (1 << bit))

This gives us at most 26 + 26 = 52 possible connected masks per string.

**Union-Find pattern**: Since connections are transitive, we use union-find to efficiently merge groups. For each string:

1. Convert to bitmask
2. Union this string with any previously seen string that has a connected mask
3. Also union with the mask itself (so different strings with same mask are grouped)

**Why this works**: If mask A connects to mask B, and mask B connects to mask C, then by unioning A with B and B with C, union-find ensures A, B, and C are in the same set.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * L) where n = len(words), L = 26 (max letters per word)
# Space: O(n) for union-find and mask storage
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.count = n  # number of distinct groups

    def find(self, x):
        # Path compression: make parent point to root
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)

        # Already in same group
        if root_x == root_y:
            return

        # Union by size: attach smaller tree to larger tree
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x

        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.count -= 1

class Solution:
    def groupStrings(self, words):
        n = len(words)
        uf = UnionFind(n)

        # Map from bitmask to first word index with that mask
        mask_to_index = {}

        for i, word in enumerate(words):
            # Convert word to bitmask
            mask = 0
            for ch in word:
                bit = ord(ch) - ord('a')
                mask |= (1 << bit)

            # Check if this exact mask already seen
            if mask in mask_to_index:
                # Union current word with previous word having same mask
                uf.union(i, mask_to_index[mask])
            else:
                mask_to_index[mask] = i

            # Try removing one letter (for connection by removal)
            for bit in range(26):
                if mask & (1 << bit):
                    new_mask = mask ^ (1 << bit)  # Clear the bit

                    if new_mask in mask_to_index:
                        uf.union(i, mask_to_index[new_mask])

            # Try adding one letter (for connection by addition)
            for bit in range(26):
                if not (mask & (1 << bit)):
                    new_mask = mask | (1 << bit)  # Set the bit

                    if new_mask in mask_to_index:
                        uf.union(i, mask_to_index[new_mask])

        # Find largest group size
        max_group_size = max(uf.size)

        return [uf.count, max_group_size]
```

```javascript
// Time: O(n * L) where n = words.length, L = 26
// Space: O(n) for union-find and mask storage
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = Array(n).fill(1);
    this.count = n; // number of distinct groups
  }

  find(x) {
    // Path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    // Already in same group
    if (rootX === rootY) return;

    // Union by size
    if (this.size[rootX] < this.size[rootY]) {
      [rootX, rootY] = [rootY, rootX];
    }

    this.parent[rootY] = rootX;
    this.size[rootX] += this.size[rootY];
    this.count--;
  }
}

var groupStrings = function (words) {
  const n = words.length;
  const uf = new UnionFind(n);

  // Map from bitmask to first word index with that mask
  const maskToIndex = new Map();

  for (let i = 0; i < n; i++) {
    const word = words[i];

    // Convert word to bitmask
    let mask = 0;
    for (const ch of word) {
      const bit = ch.charCodeAt(0) - "a".charCodeAt(0);
      mask |= 1 << bit;
    }

    // Check if this exact mask already seen
    if (maskToIndex.has(mask)) {
      // Union current word with previous word having same mask
      uf.union(i, maskToIndex.get(mask));
    } else {
      maskToIndex.set(mask, i);
    }

    // Try removing one letter
    for (let bit = 0; bit < 26; bit++) {
      if (mask & (1 << bit)) {
        const newMask = mask ^ (1 << bit); // Clear the bit

        if (maskToIndex.has(newMask)) {
          uf.union(i, maskToIndex.get(newMask));
        }
      }
    }

    // Try adding one letter
    for (let bit = 0; bit < 26; bit++) {
      if (!(mask & (1 << bit))) {
        const newMask = mask | (1 << bit); // Set the bit

        if (maskToIndex.has(newMask)) {
          uf.union(i, maskToIndex.get(newMask));
        }
      }
    }
  }

  // Find largest group size
  const maxGroupSize = Math.max(...uf.size);

  return [uf.count, maxGroupSize];
};
```

```java
// Time: O(n * L) where n = words.length, L = 26
// Space: O(n) for union-find and mask storage
class UnionFind {
    int[] parent;
    int[] size;
    int count;

    public UnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        count = n;

        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    public int find(int x) {
        // Path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);

        // Already in same group
        if (rootX == rootY) return;

        // Union by size
        if (size[rootX] < size[rootY]) {
            int temp = rootX;
            rootX = rootY;
            rootY = temp;
        }

        parent[rootY] = rootX;
        size[rootX] += size[rootY];
        count--;
    }
}

class Solution {
    public int[] groupStrings(String[] words) {
        int n = words.length;
        UnionFind uf = new UnionFind(n);

        // Map from bitmask to first word index with that mask
        Map<Integer, Integer> maskToIndex = new HashMap<>();

        for (int i = 0; i < n; i++) {
            String word = words[i];

            // Convert word to bitmask
            int mask = 0;
            for (char ch : word.toCharArray()) {
                int bit = ch - 'a';
                mask |= (1 << bit);
            }

            // Check if this exact mask already seen
            if (maskToIndex.containsKey(mask)) {
                // Union current word with previous word having same mask
                uf.union(i, maskToIndex.get(mask));
            } else {
                maskToIndex.put(mask, i);
            }

            // Try removing one letter
            for (int bit = 0; bit < 26; bit++) {
                if ((mask & (1 << bit)) != 0) {
                    int newMask = mask ^ (1 << bit);  // Clear the bit

                    if (maskToIndex.containsKey(newMask)) {
                        uf.union(i, maskToIndex.get(newMask));
                    }
                }
            }

            // Try adding one letter
            for (int bit = 0; bit < 26; bit++) {
                if ((mask & (1 << bit)) == 0) {
                    int newMask = mask | (1 << bit);  // Set the bit

                    if (maskToIndex.containsKey(newMask)) {
                        uf.union(i, maskToIndex.get(newMask));
                    }
                }
            }
        }

        // Find largest group size
        int maxGroupSize = 0;
        for (int s : uf.size) {
            maxGroupSize = Math.max(maxGroupSize, s);
        }

        return new int[]{uf.count, maxGroupSize};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × L) where n is the number of words and L = 26 (the alphabet size).

- Converting each word to bitmask: O(n × word_length) but word_length ≤ 26, so O(n × L)
- For each word, we check 52 possible connected masks (26 removals + 26 additions): O(n × L)
- Union-find operations are amortized O(α(n)) where α is the inverse Ackermann function (effectively constant)
- Total: O(n × L) = O(26n) = O(n)

**Space Complexity**: O(n)

- Union-find arrays: O(n)
- mask_to_index map: O(n) in worst case (all masks distinct)
- Total: O(n)

## Common Mistakes

1. **Forgetting to union strings with identical masks**: Two different strings can have the exact same set of letters (e.g., "ab" and "ba" when letters are unique). These should be in the same group but aren't connected by adding/removing a letter.

2. **Only checking one direction of connection**: A string can connect to another by either adding OR removing a letter. Some candidates only check removal (thinking of it as "differ by one letter") but miss the addition case.

3. **Inefficient connection checking**: Comparing every pair of strings is O(n²L), which times out for n = 2×10⁴. The key optimization is generating possible connected masks from each mask rather than comparing masks.

4. **Not using union-find for transitive connections**: Trying to build groups with DFS/BFS without union-find leads to repeated work. Union-find elegantly handles the "if A connects to B and B connects to C, then A connects to C" requirement.

## When You'll See This Pattern

This problem combines **bitmask representation** with **union-find for connectivity**, a pattern that appears in several LeetCode hard problems:

1. **Similar String Groups (Hard)**: Group strings where each pair differs by at most two character swaps. Uses union-find to group connected strings.

2. **Largest Component Size by Common Factor (Hard)**: Group numbers that share common factors > 1. Uses union-find to connect numbers through their prime factors.

3. **Number of Provinces (Medium)**: Find connected components in an adjacency matrix. Simpler version of the union-find pattern.

The core pattern is: when you need to group items based on some relationship that's transitive (if A relates to B and B relates to C, then A relates to C), union-find is often the right tool.

## Key Takeaways

1. **Bitmasks efficiently represent sets** when the universe is small (≤ 32 or 64 elements). Here, 26 letters fit perfectly in a 32-bit integer, enabling O(1) set operations.

2. **Union-find solves transitive grouping problems** efficiently. When connections can be indirect through other elements, union-find's O(α(n)) operations beat DFS/BFS for dynamic connectivity.

3. **Generate neighbors, don't compare all pairs**. For each element, generate all possible connected elements (52 in this case) and check if they exist. This O(n × L) approach beats O(n²) pairwise comparison.

Related problems: [Word Ladder II](/problem/word-ladder-ii), [Similar String Groups](/problem/similar-string-groups), [Largest Component Size by Common Factor](/problem/largest-component-size-by-common-factor)
