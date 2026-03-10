---
title: "How to Solve Check if DFS Strings Are Palindromes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Check if DFS Strings Are Palindromes. Hard difficulty, 20.1% acceptance rate. Topics: Array, Hash Table, String, Tree, Depth-First Search."
date: "2026-08-01"
category: "dsa-patterns"
tags: ["check-if-dfs-strings-are-palindromes", "array", "hash-table", "string", "hard"]
---

# How to Solve Check if DFS Strings Are Palindromes

This problem asks us to determine whether the string formed by concatenating node values along every root-to-leaf path in a tree results in a palindrome. The tricky part is that we need to check **all** root-to-leaf paths efficiently, not just one. A naive DFS that builds each path string would be O(n²) in the worst case, which is too slow for large trees. The key insight is that we can track character frequencies using bit manipulation to check palindrome conditions in O(1) time per node.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- `parent = [-1, 0, 0, 1, 1, 2, 2]` (7 nodes)
- `s = "racecar"`

**Tree structure:**

```
        0(r)
       / \
      1(a) 2(c)
     / \   / \
    3(c)4(e)5(a)6(r)
```

**Root-to-leaf paths:**

1. 0→1→3: "rac" → not a palindrome
2. 0→1→4: "rae" → not a palindrome
3. 0→2→5: "rca" → not a palindrome
4. 0→2→6: "rcr" → palindrome!

Since not all paths are palindromes, the answer should be `false`.

The challenge: We need to check **all** paths efficiently. Building each path as a string would require O(h) time per leaf (where h is height), leading to O(n²) worst-case for a skewed tree.

## Brute Force Approach

A naive solution would perform DFS from the root, building the string for each path, and checking if it's a palindrome when we reach a leaf:

1. Start DFS from root (node 0)
2. At each node, append its character to the current path string
3. When reaching a leaf, check if the path string is a palindrome
4. If any path is not a palindrome, return false

**Why this fails:**

- Building strings is expensive: O(h) per leaf node
- Checking palindromes is O(h) per leaf
- Worst-case time: O(n²) for a skewed tree (like a linked list)
- Space: O(n²) for storing all path strings

This approach times out for large trees (n up to 10⁵ in typical constraints).

## Optimized Approach

The key insight is that we don't need the actual string to check if it can form a palindrome. For a string to be rearrangeable into a palindrome, at most one character can have an odd frequency.

**Core idea:** Use bit manipulation to track character parity (odd/even counts):

- Represent each character (a-z) as a bit position (0-25)
- Toggle the bit for a character each time we encounter it (XOR operation)
- At leaf nodes, check if at most one bit is set (i.e., the bitmask has at most one 1-bit)

**Why this works:**

1. XOR toggles bits: 0→1 (odd count), 1→0 (even count)
2. A palindrome can have at most one character with odd frequency
3. Checking "at most one set bit" can be done efficiently: `(mask & (mask - 1)) == 0`

**DFS with bitmask:**

- Start with mask = 0 at root
- At each node: `mask ^= (1 << (s[node] - 'a'))`
- At leaf nodes: check if mask has at most one 1-bit
- If any leaf fails the check, return false immediately

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is number of nodes
# Space: O(h) where h is height of tree (recursion stack)
def canFormPalindromePaths(parent, s):
    n = len(parent)

    # Step 1: Build adjacency list for the tree
    # Since parent array is given, we need to build child relationships
    children = [[] for _ in range(n)]
    for i in range(1, n):  # Skip root (parent[0] == -1)
        children[parent[i]].append(i)

    # Step 2: DFS function that tracks character parity using bitmask
    def dfs(node, mask):
        # Toggle the bit for current node's character
        # ord(s[node]) - ord('a') gives 0-25 for 'a'-'z'
        mask ^= 1 << (ord(s[node]) - ord('a'))

        # Check if this is a leaf node (no children)
        if not children[node]:
            # For palindrome: at most one character can have odd frequency
            # This is true if mask has 0 or 1 bits set
            # mask & (mask - 1) == 0 checks if at most one bit is set
            return (mask & (mask - 1)) == 0

        # Not a leaf: check all child paths
        for child in children[node]:
            if not dfs(child, mask):
                return False
        return True

    # Step 3: Start DFS from root (node 0) with initial mask 0
    return dfs(0, 0)
```

```javascript
// Time: O(n) where n is number of nodes
// Space: O(h) where h is height of tree (recursion stack)
function canFormPalindromePaths(parent, s) {
  const n = parent.length;

  // Step 1: Build adjacency list for the tree
  const children = Array.from({ length: n }, () => []);
  for (let i = 1; i < n; i++) {
    // Skip root (parent[0] === -1)
    children[parent[i]].push(i);
  }

  // Step 2: DFS function that tracks character parity using bitmask
  const dfs = (node, mask) => {
    // Toggle the bit for current node's character
    // s.charCodeAt(node) - 97 gives 0-25 for 'a'-'z'
    mask ^= 1 << (s.charCodeAt(node) - 97);

    // Check if this is a leaf node (no children)
    if (children[node].length === 0) {
      // For palindrome: at most one character can have odd frequency
      // This is true if mask has 0 or 1 bits set
      // (mask & (mask - 1)) === 0 checks if at most one bit is set
      return (mask & (mask - 1)) === 0;
    }

    // Not a leaf: check all child paths
    for (const child of children[node]) {
      if (!dfs(child, mask)) {
        return false;
      }
    }
    return true;
  };

  // Step 3: Start DFS from root (node 0) with initial mask 0
  return dfs(0, 0);
}
```

```java
// Time: O(n) where n is number of nodes
// Space: O(h) where h is height of tree (recursion stack)
class Solution {
    public boolean canFormPalindromePaths(int[] parent, String s) {
        int n = parent.length;

        // Step 1: Build adjacency list for the tree
        List<Integer>[] children = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            children[i] = new ArrayList<>();
        }
        for (int i = 1; i < n; i++) {  // Skip root (parent[0] == -1)
            children[parent[i]].add(i);
        }

        // Step 2: Start DFS from root (node 0) with initial mask 0
        return dfs(0, 0, children, s);
    }

    private boolean dfs(int node, int mask, List<Integer>[] children, String s) {
        // Toggle the bit for current node's character
        // s.charAt(node) - 'a' gives 0-25 for 'a'-'z'
        mask ^= 1 << (s.charAt(node) - 'a');

        // Check if this is a leaf node (no children)
        if (children[node].isEmpty()) {
            // For palindrome: at most one character can have odd frequency
            // This is true if mask has 0 or 1 bits set
            // (mask & (mask - 1)) == 0 checks if at most one bit is set
            return (mask & (mask - 1)) == 0;
        }

        // Not a leaf: check all child paths
        for (int child : children[node]) {
            if (!dfs(child, mask, children, s)) {
                return false;
            }
        }
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Building adjacency list: O(n) to iterate through parent array
- DFS traversal: Each node visited exactly once, O(n) total
- Per-node operations: O(1) for bit manipulation and checks

**Space Complexity: O(n)**

- Adjacency list: O(n) to store child relationships
- Recursion stack: O(h) where h is tree height, worst-case O(n) for skewed tree
- Bitmask: O(1) additional space per recursive call

The O(n) time is optimal since we must examine every node at least once.

## Common Mistakes

1. **Forgetting to build the tree structure**: The input gives parent relationships, but DFS needs child relationships. Candidates often try to traverse using the parent array directly, which only works upward, not downward.

2. **Incorrect bit manipulation**: Using addition instead of XOR (`mask += 1 << bit` instead of `mask ^= 1 << bit`). Addition doesn't toggle parity - it just increases counts, losing the odd/even information.

3. **Wrong palindrome check at leaves**: Checking if the mask equals 0 (all even counts) instead of allowing one odd count. The correct check is `(mask & (mask - 1)) == 0`, which allows 0 or 1 set bits.

4. **Not handling early termination**: Continuing DFS after finding a non-palindromic path. Once any path fails, we can return false immediately to save time.

## When You'll See This Pattern

This problem combines tree DFS with bitmask parity tracking. You'll see similar patterns in:

1. **Find Unique Binary String (LeetCode 1980)**: Uses bit manipulation to track seen patterns
2. **Maximum XOR of Two Numbers in an Array (LeetCode 421)**: Uses bitwise Trie with XOR properties
3. **Count Pairs With XOR in a Range (LeetCode 1803)**: Combines tree traversal with bit counting
4. **Palindrome Permutation (LeetCode 266)**: The core palindrome check (at most one odd count) is identical

The key pattern is using bitmasks to efficiently track set membership or parity when dealing with combinatorial constraints.

## Key Takeaways

1. **Bitmasks for frequency parity**: When you need to track odd/even counts of limited alphabet (like 26 letters), bitmask with XOR is O(1) per update vs. O(26) for array updates.

2. **Tree path problems often need O(n) solutions**: If a problem asks about all root-to-leaf paths, look for ways to accumulate information during DFS without storing full paths.

3. **Palindrome rearrangability check**: A string can be rearranged into a palindrome if at most one character has odd frequency. This is a useful pattern for many palindrome problems.

[Practice this problem on CodeJeet](/problem/check-if-dfs-strings-are-palindromes)
