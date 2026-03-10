---
title: "How to Solve Minimum Cost to Convert String II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Cost to Convert String II. Hard difficulty, 59.7% acceptance rate. Topics: Array, String, Dynamic Programming, Graph Theory, Trie."
date: "2028-03-19"
category: "dsa-patterns"
tags: ["minimum-cost-to-convert-string-ii", "array", "string", "dynamic-programming", "hard"]
---

# How to Solve Minimum Cost to Convert String II

You're given two strings `source` and `target` of equal length, along with transformation rules: you can replace any substring `original[i]` with `changed[i]` at cost `cost[i]`. The goal is to find the minimum total cost to transform `source` into `target`, or return -1 if impossible. What makes this problem tricky is that substring replacements can overlap and chain together, creating a complex optimization problem where you need to find the cheapest sequence of transformations.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
source = "abcd"
target = "acbe"
original = ["a","b","cd","d","abc"]
changed = ["b","c","e","e","bcd"]
cost = [1,2,5,4,3]
```

We need to transform "abcd" → "acbe". Let's think step by step:

1. **Direct character replacements:**
   - Position 0: 'a' → 'a' (no cost, already matches)
   - Position 1: 'b' → 'c' (cost 2 via rule "b"→"c")
   - Position 2: 'c' → 'b' (no direct rule)
   - Position 3: 'd' → 'e' (cost 4 via rule "d"→"e")
     Total: 2 + 4 = 6

2. **Using substring replacements:**
   - "abc" → "bcd" (cost 3, but then we'd have "bcdd" not "acbe")
   - "cd" → "e" (cost 5, would give "abe" but we need "acbe")

3. **Better approach:**
   - Position 0-1: "ab" → ? No direct rule
   - Position 2-3: "cd" → "e" (cost 5) gives "abe"
   - Then position 1: 'b' → 'c' (cost 2) gives "ace"
   - Still not matching "acbe"

4. **Optimal solution:**
   - Position 0: 'a' → 'a' (0)
   - Position 1: 'b' → 'c' (2)
   - Position 2-3: "cd" → "e" (5)
     Total: 7

Wait, that's worse than our first attempt (6). Let's check if we can do better:

- What if we use "d" → "e" (4) instead of "cd" → "e" (5)?
- Then we have: 'a'(0) + 'b'→'c'(2) + 'c'→'b'(?) + 'd'→'e'(4)
- But 'c'→'b' has no rule, so impossible.

Actually, our first approach (cost 6) seems optimal. This shows we need to systematically consider all possible substring transformations, not just individual characters.

## Brute Force Approach

A naive approach would be to try all possible sequences of transformations:

1. For each position in `source`, try every possible substring starting at that position
2. For each substring, check if it matches any `original[i]`
3. If it does, recursively try transforming the rest of the string
4. Track the minimum cost across all possibilities

The problem? This leads to exponential time complexity. With strings up to length 2000 and up to 100 transformation rules, we could have billions of possibilities. Even memoization wouldn't help enough because we'd need to store results for every substring combination.

What makes this particularly challenging is that transformations can have different lengths, and we need to find the optimal way to cover the entire string with possibly overlapping transformations.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem combined with **graph shortest path**:

1. **Graph Representation:** Create a graph where nodes are strings (from `original` and `changed`), and edges represent transformations with costs. We need to find the shortest path (minimum cost) between any two strings that appear in our rules.

2. **All-Pairs Shortest Path:** Since strings can transform through intermediate strings (e.g., A→B→C), we need the minimum cost between ALL pairs of strings in our transformation graph. Floyd-Warshall algorithm is perfect for this.

3. **Dynamic Programming on the String:** Once we have minimum costs between all string pairs, we can use DP:
   - `dp[i]` = minimum cost to transform `source[0:i]` to `target[0:i]`
   - Transition: For each possible substring ending at position `i`, if we can transform `source[j:i]` to `target[j:i]`, then `dp[i] = min(dp[i], dp[j] + cost(source[j:i] → target[j:i]))`

4. **Trie Optimization:** To efficiently check all substrings, we can use tries (prefix trees) to store all `original` and `target` substrings we might need to check.

The core algorithm:

1. Build a graph of all unique strings from `original` and `changed`
2. Compute all-pairs shortest path using Floyd-Warshall
3. Build tries for efficient substring matching
4. Use DP to find minimum transformation cost

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2 + m^3 + L) where n = len(source), m = number of unique strings, L = total length of all strings
# Space: O(m^2 + n + L) for the graph, DP array, and tries
class Solution:
    def minimumCost(self, source: str, target: str, original: List[str], changed: List[str], cost: List[int]) -> int:
        # Step 1: Collect all unique strings that appear in transformations
        all_strings = set(original + changed)

        # Map each string to an index for graph representation
        string_to_idx = {s: i for i, s in enumerate(all_strings)}
        m = len(all_strings)  # Number of unique strings

        # Step 2: Initialize graph with infinity (no path)
        INF = 10**18
        dist = [[INF] * m for _ in range(m)]

        # Each string can transform to itself with cost 0
        for i in range(m):
            dist[i][i] = 0

        # Add direct transformation edges
        for o, c, co in zip(original, changed, cost):
            u = string_to_idx[o]
            v = string_to_idx[c]
            # Keep minimum cost if multiple transformations exist
            dist[u][v] = min(dist[u][v], co)

        # Step 3: Floyd-Warshall to find shortest paths between all pairs
        for k in range(m):
            for i in range(m):
                if dist[i][k] == INF:
                    continue
                for j in range(m):
                    if dist[k][j] == INF:
                        continue
                    # Relax the distance
                    if dist[i][j] > dist[i][k] + dist[k][j]:
                        dist[i][j] = dist[i][k] + dist[k][j]

        # Step 4: Build tries for efficient substring matching
        # We need to quickly check if a substring exists in our string set
        # and get its index in the graph

        # Build forward trie for original strings
        forward_trie = {}
        for s in original:
            node = forward_trie
            for ch in s:
                if ch not in node:
                    node[ch] = {}
                node = node[ch]
            # Store the string index at the end node
            if 'idx' not in node:
                node['idx'] = []
            node['idx'].append(string_to_idx[s])

        # Build backward trie for target strings
        backward_trie = {}
        for s in changed:
            node = backward_trie
            for ch in s:
                if ch not in node:
                    node[ch] = {}
                node = node[ch]
            if 'idx' not in node:
                node['idx'] = []
            node['idx'].append(string_to_idx[s])

        n = len(source)

        # Step 5: Dynamic Programming
        # dp[i] = min cost to transform source[0:i] to target[0:i]
        dp = [INF] * (n + 1)
        dp[0] = 0  # Empty strings match with cost 0

        for i in range(n):
            if dp[i] == INF:
                continue

            # If characters match, we can just copy with cost 0
            if source[i] == target[i]:
                dp[i + 1] = min(dp[i + 1], dp[i])

            # Try all possible substrings starting at i
            forward_node = forward_trie
            backward_node = backward_trie

            j = i
            while j < n:
                # Traverse both tries simultaneously
                if source[j] not in forward_node or target[j] not in backward_node:
                    break

                forward_node = forward_node[source[j]]
                backward_node = backward_node[target[j]]
                j += 1

                # Check if we have complete strings in both tries
                if 'idx' in forward_node and 'idx' in backward_node:
                    # For each pair of strings that match these prefixes
                    for u in forward_node['idx']:
                        for v in backward_node['idx']:
                            if dist[u][v] < INF:  # If transformation is possible
                                dp[j] = min(dp[j], dp[i] + dist[u][v])

        return dp[n] if dp[n] < INF else -1
```

```javascript
// Time: O(n^2 + m^3 + L) where n = len(source), m = number of unique strings, L = total length of all strings
// Space: O(m^2 + n + L) for the graph, DP array, and tries
function minimumCost(source, target, original, changed, cost) {
  // Step 1: Collect all unique strings
  const allStrings = new Set([...original, ...changed]);

  // Map strings to indices
  const stringToIdx = new Map();
  let idx = 0;
  for (const s of allStrings) {
    stringToIdx.set(s, idx++);
  }
  const m = allStrings.size;

  // Step 2: Initialize graph
  const INF = Number.MAX_SAFE_INTEGER;
  const dist = Array(m)
    .fill()
    .map(() => Array(m).fill(INF));

  // Each string transforms to itself with cost 0
  for (let i = 0; i < m; i++) {
    dist[i][i] = 0;
  }

  // Add direct transformation edges
  for (let i = 0; i < original.length; i++) {
    const u = stringToIdx.get(original[i]);
    const v = stringToIdx.get(changed[i]);
    dist[u][v] = Math.min(dist[u][v], cost[i]);
  }

  // Step 3: Floyd-Warshall for all-pairs shortest path
  for (let k = 0; k < m; k++) {
    for (let i = 0; i < m; i++) {
      if (dist[i][k] === INF) continue;
      for (let j = 0; j < m; j++) {
        if (dist[k][j] === INF) continue;
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  // Step 4: Build tries
  const buildTrie = (strings) => {
    const root = {};
    for (const s of strings) {
      let node = root;
      for (const ch of s) {
        if (!node[ch]) {
          node[ch] = {};
        }
        node = node[ch];
      }
      if (!node.idx) {
        node.idx = [];
      }
      node.idx.push(stringToIdx.get(s));
    }
    return root;
  };

  const forwardTrie = buildTrie(original);
  const backwardTrie = buildTrie(changed);

  const n = source.length;

  // Step 5: Dynamic Programming
  const dp = Array(n + 1).fill(INF);
  dp[0] = 0;

  for (let i = 0; i < n; i++) {
    if (dp[i] === INF) continue;

    // If characters match, copy with cost 0
    if (source[i] === target[i]) {
      dp[i + 1] = Math.min(dp[i + 1], dp[i]);
    }

    // Try all substrings starting at i
    let forwardNode = forwardTrie;
    let backwardNode = backwardTrie;

    let j = i;
    while (j < n) {
      if (!forwardNode[source[j]] || !backwardNode[target[j]]) {
        break;
      }

      forwardNode = forwardNode[source[j]];
      backwardNode = backwardNode[target[j]];
      j++;

      if (forwardNode.idx && backwardNode.idx) {
        for (const u of forwardNode.idx) {
          for (const v of backwardNode.idx) {
            if (dist[u][v] < INF) {
              dp[j] = Math.min(dp[j], dp[i] + dist[u][v]);
            }
          }
        }
      }
    }
  }

  return dp[n] < INF ? dp[n] : -1;
}
```

```java
// Time: O(n^2 + m^3 + L) where n = len(source), m = number of unique strings, L = total length of all strings
// Space: O(m^2 + n + L) for the graph, DP array, and tries
class Solution {
    public long minimumCost(String source, String target, String[] original, String[] changed, int[] cost) {
        // Step 1: Collect all unique strings
        Set<String> allStrings = new HashSet<>();
        for (String s : original) allStrings.add(s);
        for (String s : changed) allStrings.add(s);

        // Map strings to indices
        Map<String, Integer> stringToIdx = new HashMap<>();
        int idx = 0;
        for (String s : allStrings) {
            stringToIdx.put(s, idx++);
        }
        int m = allStrings.size();

        // Step 2: Initialize graph
        long INF = Long.MAX_VALUE / 2;
        long[][] dist = new long[m][m];
        for (int i = 0; i < m; i++) {
            Arrays.fill(dist[i], INF);
            dist[i][i] = 0;
        }

        // Add direct transformation edges
        for (int i = 0; i < original.length; i++) {
            int u = stringToIdx.get(original[i]);
            int v = stringToIdx.get(changed[i]);
            dist[u][v] = Math.min(dist[u][v], cost[i]);
        }

        // Step 3: Floyd-Warshall
        for (int k = 0; k < m; k++) {
            for (int i = 0; i < m; i++) {
                if (dist[i][k] == INF) continue;
                for (int j = 0; j < m; j++) {
                    if (dist[k][j] == INF) continue;
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }

        // Step 4: Build tries
        TrieNode forwardTrie = buildTrie(original, stringToIdx);
        TrieNode backwardTrie = buildTrie(changed, stringToIdx);

        int n = source.length();

        // Step 5: Dynamic Programming
        long[] dp = new long[n + 1];
        Arrays.fill(dp, INF);
        dp[0] = 0;

        for (int i = 0; i < n; i++) {
            if (dp[i] == INF) continue;

            // If characters match, copy with cost 0
            if (source.charAt(i) == target.charAt(i)) {
                dp[i + 1] = Math.min(dp[i + 1], dp[i]);
            }

            // Try all substrings starting at i
            TrieNode forwardNode = forwardTrie;
            TrieNode backwardNode = backwardTrie;

            int j = i;
            while (j < n) {
                char srcChar = source.charAt(j);
                char tgtChar = target.charAt(j);

                if (!forwardNode.children.containsKey(srcChar) ||
                    !backwardNode.children.containsKey(tgtChar)) {
                    break;
                }

                forwardNode = forwardNode.children.get(srcChar);
                backwardNode = backwardNode.children.get(tgtChar);
                j++;

                if (forwardNode.indices != null && backwardNode.indices != null) {
                    for (int u : forwardNode.indices) {
                        for (int v : backwardNode.indices) {
                            if (dist[u][v] < INF) {
                                dp[j] = Math.min(dp[j], dp[i] + dist[u][v]);
                            }
                        }
                    }
                }
            }
        }

        return dp[n] < INF ? dp[n] : -1;
    }

    class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        List<Integer> indices = null;
    }

    private TrieNode buildTrie(String[] strings, Map<String, Integer> stringToIdx) {
        TrieNode root = new TrieNode();
        for (String s : strings) {
            TrieNode node = root;
            for (char ch : s.toCharArray()) {
                node.children.putIfAbsent(ch, new TrieNode());
                node = node.children.get(ch);
            }
            if (node.indices == null) {
                node.indices = new ArrayList<>();
            }
            node.indices.add(stringToIdx.get(s));
        }
        return root;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

1. **Graph construction:** O(k) where k is the number of transformation rules
2. **Floyd-Warshall:** O(m³) where m is the number of unique strings (≤ 200 since original/changed have ≤ 100 elements each)
3. **Trie construction:** O(L) where L is the total length of all strings in original and changed
4. **DP computation:** O(n²) in worst case where we check all substrings at each position

Overall: O(n² + m³ + L), which is feasible for the constraints (n ≤ 2000, m ≤ 200).

**Space Complexity:**

1. **Graph:** O(m²) for the distance matrix
2. **Tries:** O(L) for storing all strings
3. **DP array:** O(n)

Overall: O(m² + n + L)

## Common Mistakes

1. **Forgetting about indirect transformations:** Candidates often only consider direct transformations from `original[i]` to `changed[i]`, but strings can transform through intermediate strings (A→B→C). This is why we need Floyd-Warshall.

2. **Not handling multiple rules for the same transformation:** If there are multiple ways to transform A→B with different costs, we must take the minimum. The graph initialization must use `min()` when adding edges.

3. **Inefficient substring checking:** Checking every substring against every transformation rule would be O(n² × k), which is too slow. Using tries reduces this to O(n²) in practice.

4. **Integer overflow with large costs:** With up to 10⁵ transformations and costs up to 10⁶, the total cost can exceed 32-bit integer range. Use 64-bit integers (long in Java/JavaScript, int with large values in Python).

## When You'll See This Pattern

This problem combines several important patterns:

1. **All-Pairs Shortest Path (Floyd-Warshall):** Used in problems like "Network Delay Time" (LeetCode 743) and "Find the City With the Smallest Number of Neighbors" (LeetCode 1334) where you need distances between all pairs.

2. **String DP with Substring Matching:** Similar to "Word Break" (LeetCode 139) where you need to check if a string can be segmented into dictionary words, but with transformation costs.

3. **Trie for Efficient String Operations:** Used in "Implement Trie" (LeetCode 208), "Word Search II" (LeetCode 212), and other problems requiring fast prefix/suffix matching.

## Key Takeaways

1. **Recognize transformation chains as graph problems:** When you can transform between states with costs, think of it as a graph where you need shortest paths. If transformations can chain (A→B→C), you need all-pairs shortest paths.

2. **Combine DP with specialized data structures:** For string problems with substring operations, DP often needs help from tries, suffix arrays, or rolling hashes to efficiently check matches.

3. **Break complex problems into independent subproblems:** This solution has three clear phases: (1) build transformation graph, (2) compute shortest paths, (3) use DP with tries. Solving each part independently makes the problem manageable.

Related problems: [Can Convert String in K Moves](/problem/can-convert-string-in-k-moves), [Minimum Moves to Convert String](/problem/minimum-moves-to-convert-string), [Minimum Number of Valid Strings to Form Target II](/problem/minimum-number-of-valid-strings-to-form-target-ii)
