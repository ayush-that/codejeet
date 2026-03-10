---
title: "How to Solve Similar String Groups — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Similar String Groups. Hard difficulty, 56.1% acceptance rate. Topics: Array, Hash Table, String, Depth-First Search, Breadth-First Search."
date: "2026-10-27"
category: "dsa-patterns"
tags: ["similar-string-groups", "array", "hash-table", "string", "hard"]
---

# How to Solve Similar String Groups

This problem asks us to group strings into connected components where each string is connected to others if they're "similar" — meaning they're either identical or differ by at most two character swaps. The tricky part is that we need to find all groups, not just check if two specific strings are similar. This becomes a graph connectivity problem where strings are nodes and similarity defines edges, but checking all pairs would be too slow for large inputs.

## Visual Walkthrough

Let's trace through a small example: `["tars","rats","arts","star"]`

**Step 1: Understanding similarity**

- "tars" and "rats": Compare characters at each position:
  - t vs r ❌
  - a vs a ✅
  - r vs t ❌
  - s vs s ✅
    We have 2 mismatches (positions 0 and 2). Can we swap to fix? Yes, swapping positions 0 and 2 in "tars" gives "rats". So they're similar.

**Step 2: Building connections**

- "rats" and "arts": Compare:
  - r vs a ❌
  - a vs r ❌
  - t vs t ✅
  - s vs s ✅
    2 mismatches (positions 0 and 1). Swapping these positions in "rats" gives "arts". So they're similar.

**Step 3: Finding groups**
We now have a chain: "tars" ↔ "rats" ↔ "arts"

- "star" compared to "tars": 4 mismatches ❌
- "star" compared to "rats": 4 mismatches ❌
- "star" compared to "arts": 4 mismatches ❌
  So "star" is isolated.

**Result:** 2 groups: {"tars","rats","arts"} and {"star"}

## Brute Force Approach

A naive solution would:

1. Compare every pair of strings (i,j)
2. For each pair, check if they're similar by comparing characters
3. Build a graph and find connected components

The similarity check for two strings of length L takes O(L) time. With N strings, we have O(N²) pairs, giving O(N²L) total time. For N=1000 and L=20, that's ~400 million operations — too slow.

Even worse, if we build the full graph explicitly, we'd need O(N²) space for edges.

<div class="code-group">

```python
# Brute force - too slow for large N
def numSimilarGroups(strs):
    n = len(strs)
    if n == 0:
        return 0

    # Build adjacency list
    graph = [[] for _ in range(n)]

    # Compare all pairs - O(N²L)
    for i in range(n):
        for j in range(i+1, n):
            if areSimilar(strs[i], strs[j]):
                graph[i].append(j)
                graph[j].append(i)

    # DFS to find connected components
    visited = [False] * n
    groups = 0

    def dfs(node):
        visited[node] = True
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)

    for i in range(n):
        if not visited[i]:
            groups += 1
            dfs(i)

    return groups

def areSimilar(s1, s2):
    if s1 == s2:
        return True

    diff = []
    for i in range(len(s1)):
        if s1[i] != s2[i]:
            diff.append(i)
            if len(diff) > 2:
                return False

    return len(diff) == 2 and s1[diff[0]] == s2[diff[1]] and s1[diff[1]] == s2[diff[0]]
```

```javascript
// Brute force - too slow for large N
function numSimilarGroups(strs) {
  const n = strs.length;
  if (n === 0) return 0;

  // Build adjacency list
  const graph = Array(n)
    .fill()
    .map(() => []);

  // Compare all pairs - O(N²L)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (areSimilar(strs[i], strs[j])) {
        graph[i].push(j);
        graph[j].push(i);
      }
    }
  }

  // DFS to find connected components
  const visited = Array(n).fill(false);
  let groups = 0;

  function dfs(node) {
    visited[node] = true;
    for (const neighbor of graph[node]) {
      if (!visited[neighbor]) {
        dfs(neighbor);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      groups++;
      dfs(i);
    }
  }

  return groups;
}

function areSimilar(s1, s2) {
  if (s1 === s2) return true;

  const diff = [];
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      diff.push(i);
      if (diff.length > 2) return false;
    }
  }

  return diff.length === 2 && s1[diff[0]] === s2[diff[1]] && s1[diff[1]] === s2[diff[0]];
}
```

```java
// Brute force - too slow for large N
class Solution {
    public int numSimilarGroups(String[] strs) {
        int n = strs.length;
        if (n == 0) return 0;

        // Build adjacency list
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }

        // Compare all pairs - O(N²L)
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (areSimilar(strs[i], strs[j])) {
                    graph[i].add(j);
                    graph[j].add(i);
                }
            }
        }

        // DFS to find connected components
        boolean[] visited = new boolean[n];
        int groups = 0;

        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                groups++;
                dfs(i, graph, visited);
            }
        }

        return groups;
    }

    private void dfs(int node, List<Integer>[] graph, boolean[] visited) {
        visited[node] = true;
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor, graph, visited);
            }
        }
    }

    private boolean areSimilar(String s1, String s2) {
        if (s1.equals(s2)) return true;

        List<Integer> diff = new ArrayList<>();
        for (int i = 0; i < s1.length(); i++) {
            if (s1.charAt(i) != s2.charAt(i)) {
                diff.add(i);
                if (diff.size() > 2) return false;
            }
        }

        return diff.size() == 2 &&
               s1.charAt(diff.get(0)) == s2.charAt(diff.get(1)) &&
               s1.charAt(diff.get(1)) == s2.charAt(diff.get(0));
    }
}
```

</div>

## Optimized Approach

The key insight: We don't need to compare all pairs! Instead, for each string, we can generate all possible strings that would be similar to it by swapping characters, and check if those generated strings exist in our input.

Why this works:

1. Strings have limited length (≤ 20 in constraints)
2. Generating all similar strings for a given string takes O(L²) where L is string length
3. We can use a hash set for O(1) lookups
4. We still use DFS/BFS to traverse connected components

The optimization comes from avoiding the O(N²) pair comparisons. Instead of comparing each string to every other string, we only compare each string to a limited set of candidates that could possibly be similar.

## Optimal Solution

We use DFS with early pruning:

1. Store all strings in a hash set for O(1) lookups
2. For each unvisited string, start DFS
3. In DFS, generate all possible similar strings by swapping character pairs
4. If a generated string exists in our set, continue DFS from it
5. Count each DFS traversal as one group

<div class="code-group">

```python
# Time: O(N * L³) but practically much faster than O(N²L) for typical inputs
# Space: O(N * L) for the visited set and recursion stack
class Solution:
    def numSimilarGroups(self, strs: List[str]) -> int:
        # Store all strings in a set for O(1) lookups
        str_set = set(strs)
        visited = set()
        groups = 0

        def dfs(s):
            """Depth-first search to find all strings in the same group"""
            visited.add(s)

            # Convert string to list for character manipulation
            chars = list(s)
            L = len(chars)

            # Generate all strings that could be similar to s
            # by swapping any two different characters
            for i in range(L):
                for j in range(i + 1, L):
                    # Skip if characters are the same (swap wouldn't change anything)
                    if chars[i] == chars[j]:
                        continue

                    # Swap characters at positions i and j
                    chars[i], chars[j] = chars[j], chars[i]
                    new_str = ''.join(chars)

                    # If this new string exists in our input and hasn't been visited
                    if new_str in str_set and new_str not in visited:
                        dfs(new_str)

                    # Swap back to original for next iteration
                    chars[i], chars[j] = chars[j], chars[i]

        # Iterate through all strings
        for s in strs:
            if s not in visited:
                groups += 1
                dfs(s)

        return groups
```

```javascript
// Time: O(N * L³) but practically much faster than O(N²L) for typical inputs
// Space: O(N * L) for the visited set and recursion stack
function numSimilarGroups(strs) {
  // Store all strings in a Set for O(1) lookups
  const strSet = new Set(strs);
  const visited = new Set();
  let groups = 0;

  function dfs(s) {
    // Mark current string as visited
    visited.add(s);

    // Convert string to array for character manipulation
    const chars = s.split("");
    const L = chars.length;

    // Generate all strings that could be similar to s
    // by swapping any two different characters
    for (let i = 0; i < L; i++) {
      for (let j = i + 1; j < L; j++) {
        // Skip if characters are the same
        if (chars[i] === chars[j]) continue;

        // Swap characters at positions i and j
        [chars[i], chars[j]] = [chars[j], chars[i]];
        const newStr = chars.join("");

        // If this new string exists and hasn't been visited
        if (strSet.has(newStr) && !visited.has(newStr)) {
          dfs(newStr);
        }

        // Swap back to original for next iteration
        [chars[i], chars[j]] = [chars[j], chars[i]];
      }
    }
  }

  // Iterate through all strings
  for (const s of strs) {
    if (!visited.has(s)) {
      groups++;
      dfs(s);
    }
  }

  return groups;
}
```

```java
// Time: O(N * L³) but practically much faster than O(N²L) for typical inputs
// Space: O(N * L) for the visited set and recursion stack
class Solution {
    public int numSimilarGroups(String[] strs) {
        // Store all strings in a HashSet for O(1) lookups
        Set<String> strSet = new HashSet<>();
        for (String s : strs) {
            strSet.add(s);
        }

        Set<String> visited = new HashSet<>();
        int groups = 0;

        // Iterate through all strings
        for (String s : strs) {
            if (!visited.contains(s)) {
                groups++;
                dfs(s, strSet, visited);
            }
        }

        return groups;
    }

    private void dfs(String s, Set<String> strSet, Set<String> visited) {
        // Mark current string as visited
        visited.add(s);

        // Convert string to char array for manipulation
        char[] chars = s.toCharArray();
        int L = chars.length;

        // Generate all strings that could be similar to s
        // by swapping any two different characters
        for (int i = 0; i < L; i++) {
            for (int j = i + 1; j < L; j++) {
                // Skip if characters are the same
                if (chars[i] == chars[j]) continue;

                // Swap characters at positions i and j
                swap(chars, i, j);
                String newStr = new String(chars);

                // If this new string exists and hasn't been visited
                if (strSet.contains(newStr) && !visited.contains(newStr)) {
                    dfs(newStr, strSet, visited);
                }

                // Swap back to original for next iteration
                swap(chars, i, j);
            }
        }
    }

    private void swap(char[] arr, int i, int j) {
        char temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Worst case: O(N \* L³) where N is number of strings and L is string length
  - We visit each string once: O(N)
  - For each string, we generate O(L²) candidate strings by swapping pairs
  - For each candidate, we do O(L) work to create the new string
- However, in practice this is much faster than O(N²L) because:
  - Most generated strings won't exist in our input
  - We only explore actual connections, not all possible pairs
  - The L³ factor has small constants (L ≤ 20)

**Space Complexity:**

- O(N \* L) for storing strings in hash sets
- O(N \* L) for recursion stack in worst case (deep chain of similar strings)
- Total: O(N \* L)

## Common Mistakes

1. **Forgetting that identical strings are similar**: The problem states strings are similar if they're identical OR differ by at most two swaps. Some candidates only check the swap condition.

2. **Incorrect swap logic in similarity check**: When checking if two strings are similar via swaps, you must verify that the mismatched characters are actually swappable. For positions i and j where s1[i] ≠ s2[i] and s1[j] ≠ s2[j], we need s1[i] = s2[j] AND s1[j] = s2[i].

3. **Not using a visited set**: Without tracking visited nodes, you'll get infinite recursion when there are cycles in the similarity graph (which there often are).

4. **Generating duplicate candidates**: When generating similar strings by swapping, if you don't skip swaps where characters are identical, you'll create duplicate strings (the original string), wasting time.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Graph connectivity with implicit edges**: Like [Number of Provinces](https://leetcode.com/problems/number-of-provinces/), where connections aren't given explicitly but defined by a rule.

2. **BFS/DFS on generated neighbors**: Similar to [Word Ladder](https://leetcode.com/problems/word-ladder/), where you generate possible next steps from current state.

3. **Union-Find applications**: This problem can also be solved with Union-Find (Disjoint Set Union), which is efficient for connectivity problems. The pattern appears in [Accounts Merge](https://leetcode.com/problems/accounts-merge/).

## Key Takeaways

1. **When faced with "group similar items" problems, think graph connectivity**: Each item is a node, and the similarity rule defines edges between nodes. Finding groups means finding connected components.

2. **Avoid comparing all pairs when you can generate candidates**: Instead of O(N²) pair comparisons, generate possible neighbors and check if they exist. This is especially effective when the search space per item is limited.

3. **Hash sets are your friend for existence checks**: When you need to quickly check if a generated candidate exists in your input, use a hash set for O(1) lookups.

Related problems: [Groups of Strings](/problem/groups-of-strings)
