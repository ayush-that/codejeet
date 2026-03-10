---
title: "How to Solve Lexicographically Smallest Equivalent String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest Equivalent String. Medium difficulty, 81.1% acceptance rate. Topics: String, Union-Find."
date: "2026-04-13"
category: "dsa-patterns"
tags: ["lexicographically-smallest-equivalent-string", "string", "union-find", "medium"]
---

# How to Solve Lexicographically Smallest Equivalent String

This problem asks us to find the lexicographically smallest string equivalent to a given `baseStr` based on equivalence relationships between characters defined by two strings `s1` and `s2`. The tricky part is that equivalence is transitive: if `'a' == 'b'` and `'b' == 'c'`, then `'a' == 'c'`, and all three characters should map to the smallest character in their equivalence group.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
s1 = "parker"
s2 = "morris"
baseStr = "parser"
```

**Step-by-step equivalence relationships:**

1. `s1[0]='p'` ↔ `s2[0]='m'` → `'p' == 'm'`
2. `s1[1]='a'` ↔ `s2[1]='o'` → `'a' == 'o'`
3. `s1[2]='r'` ↔ `s2[2]='r'` → `'r' == 'r'` (trivial)
4. `s1[3]='k'` ↔ `s2[3]='r'` → `'k' == 'r'`
5. `s1[4]='e'` ↔ `s2[4]='i'` → `'e' == 'i'`
6. `s1[5]='r'` ↔ `s2[5]='s'` → `'r' == 's'`

Now let's find the transitive closures:

- From `'p' == 'm'` → group: `{'p', 'm'}`, smallest: `'m'`
- From `'a' == 'o'` → group: `{'a', 'o'}`, smallest: `'a'`
- From `'r' == 'r'`, `'k' == 'r'`, `'r' == 's'` → group: `{'r', 'k', 's'}`, smallest: `'k'`
- From `'e' == 'i'` → group: `{'e', 'i'}`, smallest: `'e'`

Now transform `baseStr = "parser"`:

- `'p'` → smallest in `{'p', 'm'}` is `'m'`
- `'a'` → smallest in `{'a', 'o'}` is `'a'`
- `'r'` → smallest in `{'r', 'k', 's'}` is `'k'`
- `'s'` → smallest in `{'r', 'k', 's'}` is `'k'`
- `'e'` → smallest in `{'e', 'i'}` is `'e'`
- `'r'` → smallest in `{'r', 'k', 's'}` is `'k'`

**Result:** `"makkek"`

## Brute Force Approach

A naive approach would be to:

1. Build all equivalence groups by iterating through `s1` and `s2`
2. For each new pair `(s1[i], s2[i])`, check if either character exists in any existing group
3. If found, merge groups; otherwise create a new group
4. For each character in `baseStr`, search through all groups to find which one contains it, then find the smallest character in that group

The problem with this approach is efficiency. With 26 possible lowercase letters, we could have up to 26 groups. Searching through groups for each character in `baseStr` would be O(26 × n) where n is the length of `baseStr`, which isn't terrible. However, the real issue is managing group merges efficiently. When we merge groups, we need to update all members' group references, which could be O(n) per merge.

More importantly, this approach doesn't scale well conceptually. The brute force code would be messy with nested loops checking group membership and handling merges. Let's see why we need a better data structure.

## Optimized Approach

The key insight is that this is a **union-find** (disjoint set union) problem. Each character is a node, and equivalence relationships are edges connecting them. We need to:

1. Union characters that are equivalent
2. For each equivalence group, track the smallest character
3. Transform `baseStr` by replacing each character with the smallest character in its group

**Why union-find works perfectly:**

- It efficiently handles transitive relationships through path compression
- We can modify the standard union-find to always make the smaller character the parent
- This ensures each root represents the smallest character in its equivalence group

**Step-by-step reasoning:**

1. Initialize a parent array for 26 letters (a-z), where each letter initially points to itself
2. For each pair `(s1[i], s2[i])`, union them with a preference for the smaller character as parent
3. After processing all pairs, each character's root will be the smallest character in its equivalence group
4. Transform `baseStr` by replacing each character with its root

The clever part is in the union operation: when merging two groups, we always set the parent of the larger root to the smaller root. This guarantees that the root of any connected component is the lexicographically smallest character in that component.

## Optimal Solution

Here's the complete solution using union-find:

<div class="code-group">

```python
# Time: O((n + m) * α(26)) ≈ O(n + m) where n = len(s1), m = len(baseStr)
# Space: O(1) for parent array of fixed size 26
class Solution:
    def smallestEquivalentString(self, s1: str, s2: str, baseStr: str) -> str:
        # Initialize parent array: each character points to itself
        parent = [i for i in range(26)]

        def find(x: int) -> int:
            """Find root of x with path compression."""
            if parent[x] != x:
                parent[x] = find(parent[x])  # Path compression
            return parent[x]

        def union(a: int, b: int) -> None:
            """Union two sets, always making smaller character the root."""
            root_a = find(a)
            root_b = find(b)

            # Always set the parent of the larger root to the smaller root
            if root_a < root_b:
                parent[root_b] = root_a
            elif root_a > root_b:
                parent[root_a] = root_b
            # If roots are equal, they're already in the same set

        # Process all equivalence relationships
        for c1, c2 in zip(s1, s2):
            # Convert characters to indices (0-25)
            idx1 = ord(c1) - ord('a')
            idx2 = ord(c2) - ord('a')
            union(idx1, idx2)

        # Build the result string
        result = []
        for char in baseStr:
            idx = ord(char) - ord('a')
            # Find the smallest character in this equivalence group
            root_idx = find(idx)
            # Convert back to character
            smallest_char = chr(root_idx + ord('a'))
            result.append(smallest_char)

        return ''.join(result)
```

```javascript
// Time: O((n + m) * α(26)) ≈ O(n + m) where n = s1.length, m = baseStr.length
// Space: O(1) for parent array of fixed size 26
/**
 * @param {string} s1
 * @param {string} s2
 * @param {string} baseStr
 * @return {string}
 */
var smallestEquivalentString = function (s1, s2, baseStr) {
  // Initialize parent array: each character points to itself
  const parent = new Array(26);
  for (let i = 0; i < 26; i++) {
    parent[i] = i;
  }

  // Find with path compression
  const find = (x) => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // Path compression
    }
    return parent[x];
  };

  // Union operation that always makes smaller character the root
  const union = (a, b) => {
    const rootA = find(a);
    const rootB = find(b);

    // Always set parent of larger root to smaller root
    if (rootA < rootB) {
      parent[rootB] = rootA;
    } else if (rootA > rootB) {
      parent[rootA] = rootB;
    }
    // If equal, they're already in the same set
  };

  // Process all equivalence relationships
  for (let i = 0; i < s1.length; i++) {
    const idx1 = s1.charCodeAt(i) - 97; // 'a' = 97
    const idx2 = s2.charCodeAt(i) - 97;
    union(idx1, idx2);
  }

  // Build the result string
  let result = "";
  for (let i = 0; i < baseStr.length; i++) {
    const idx = baseStr.charCodeAt(i) - 97;
    const rootIdx = find(idx);
    result += String.fromCharCode(rootIdx + 97);
  }

  return result;
};
```

```java
// Time: O((n + m) * α(26)) ≈ O(n + m) where n = s1.length(), m = baseStr.length()
// Space: O(1) for parent array of fixed size 26
class Solution {
    public String smallestEquivalentString(String s1, String s2, String baseStr) {
        // Initialize parent array: each character points to itself
        int[] parent = new int[26];
        for (int i = 0; i < 26; i++) {
            parent[i] = i;
        }

        // Process all equivalence relationships
        for (int i = 0; i < s1.length(); i++) {
            int idx1 = s1.charAt(i) - 'a';
            int idx2 = s2.charAt(i) - 'a';
            union(parent, idx1, idx2);
        }

        // Build the result string
        StringBuilder result = new StringBuilder();
        for (char c : baseStr.toCharArray()) {
            int idx = c - 'a';
            int rootIdx = find(parent, idx);
            result.append((char) (rootIdx + 'a'));
        }

        return result.toString();
    }

    private int find(int[] parent, int x) {
        // Find with path compression
        if (parent[x] != x) {
            parent[x] = find(parent, parent[x]);  // Path compression
        }
        return parent[x];
    }

    private void union(int[] parent, int a, int b) {
        int rootA = find(parent, a);
        int rootB = find(parent, b);

        // Always set parent of larger root to smaller root
        if (rootA < rootB) {
            parent[rootB] = rootA;
        } else if (rootA > rootB) {
            parent[rootA] = rootB;
        }
        // If equal, they're already in the same set
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + m) × α(26)) ≈ O(n + m)

- `n` is the length of `s1` (same as `s2`)
- `m` is the length of `baseStr`
- α(26) is the inverse Ackermann function, which is essentially constant (≤ 4) for any practical input size
- We perform `n` union operations and `m` find operations, each taking amortized O(α(26)) time

**Space Complexity:** O(1)

- We use a fixed-size parent array of 26 integers (one for each lowercase letter)
- The output string requires O(m) space, but this is not counted as extra space in most interview contexts

## Common Mistakes

1. **Forgetting about transitivity**: Candidates sometimes create direct mappings without considering that if `'a' == 'b'` and `'b' == 'c'`, then `'a' == 'c'`. This leads to incorrect results when equivalence chains exist.

2. **Not making the smallest character the root**: In the union operation, if you don't consistently make the smaller character the parent, you'll need additional data structures to track the minimum in each group, complicating the solution.

3. **Missing path compression**: Without path compression, the find operation can degrade to O(n) in the worst case. While with only 26 nodes this isn't catastrophic, it's still poor form and shows lack of understanding of union-find optimizations.

4. **Incorrect character to index conversion**: Off-by-one errors when converting between characters ('a'-'z') and indices (0-25). Always use `ord(char) - ord('a')` in Python, `charCodeAt(i) - 97` in JavaScript, or `c - 'a'` in Java.

## When You'll See This Pattern

Union-find appears in problems involving:

- Connectivity in graphs (connected components)
- Equivalence relationships (like this problem)
- Merging sets with some optimization criteria

**Related LeetCode problems:**

1. **Number of Provinces (LeetCode 547)** - Find connected components in an undirected graph
2. **Redundant Connection (LeetCode 684)** - Find an edge that creates a cycle in an undirected graph
3. **Accounts Merge (LeetCode 721)** - Merge accounts based on shared emails, similar to merging equivalence groups
4. **Satisfiability of Equality Equations (LeetCode 990)** - Very similar to this problem but with inequality constraints too

## Key Takeaways

1. **Recognize equivalence relationships as union-find**: When you see "A is equivalent to B" and equivalence is transitive, think union-find. The problem is essentially asking for connected components in a graph where edges represent equivalence.

2. **Modify union-find for specific needs**: Standard union-find can be adapted. Here we modified the union operation to always make the smaller character the root, eliminating the need for separate tracking of minimum values.

3. **Fixed small alphabet means constant space**: With only 26 lowercase letters, we get O(1) space complexity. This simplifies the problem compared to general union-find with arbitrary nodes.

Related problems: [Lexicographically Smallest Generated String](/problem/lexicographically-smallest-generated-string)
