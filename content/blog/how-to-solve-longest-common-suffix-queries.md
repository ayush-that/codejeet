---
title: "How to Solve Longest Common Suffix Queries — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Longest Common Suffix Queries. Hard difficulty, 35.9% acceptance rate. Topics: Array, String, Trie."
date: "2026-02-18"
category: "dsa-patterns"
tags: ["longest-common-suffix-queries", "array", "string", "trie", "hard"]
---

# How to Solve Longest Common Suffix Queries

You're given two arrays of strings: `wordsContainer` and `wordsQuery`. For each query string, you need to find the string in the container that shares the longest common suffix with it. If multiple container strings share the same longest suffix length, you must return the one with the smallest length, and if there's still a tie, the one with the smallest index. This problem is tricky because comparing suffixes efficiently isn't as straightforward as comparing prefixes—you need to think backwards, and the tie-breaking rules add complexity.

## Visual Walkthrough

Let's walk through a small example to build intuition:

```
wordsContainer = ["abcd", "bcd", "cd", "d"]
wordsQuery = ["abc", "bcd", "cdd"]
```

For the first query "abc":

- Compare with "abcd": suffix "bc" vs "bcd" → common suffix "bc" (length 2)
- Compare with "bcd": suffix "bc" vs "bcd" → common suffix "bc" (length 2)
- Compare with "cd": suffix "c" vs "cd" → common suffix "c" (length 1)
- Compare with "d": suffix "c" vs "d" → no common suffix (length 0)

We have two matches with length 2: "abcd" (length 4) and "bcd" (length 3). According to tie-breaking rules, we choose the shorter string "bcd" (index 1).

For the second query "bcd":

- Compare with "abcd": suffix "bcd" vs "bcd" → common suffix "bcd" (length 3)
- Compare with "bcd": exact match → common suffix "bcd" (length 3)
- Compare with "cd": suffix "cd" vs "cd" → common suffix "cd" (length 2)
- Compare with "d": suffix "d" vs "d" → common suffix "d" (length 1)

Two matches with length 3: "abcd" (length 4) and "bcd" (length 3). Choose the shorter "bcd" (index 1).

For the third query "cdd":

- Compare with "abcd": suffix "dd" vs "bcd" → no common suffix (length 0)
- Compare with "bcd": suffix "dd" vs "bcd" → no common suffix (length 0)
- Compare with "cd": suffix "dd" vs "cd" → common suffix "d" (length 1)
- Compare with "d": suffix "dd" vs "d" → common suffix "d" (length 1)

Two matches with length 1: "cd" (length 2) and "d" (length 1). Choose the shorter "d" (index 3).

Final answer: [1, 1, 3]

## Brute Force Approach

The brute force approach is straightforward: for each query string, compare it with every container string by checking their suffixes from the end. We track the best match according to the problem's rules.

Why this is inefficient:

- For each of `n` queries, we compare with each of `m` container strings
- Each comparison takes up to `O(L)` time where `L` is the length of the strings
- Total time complexity: `O(n * m * L)` which is too slow for large inputs
- With constraints where `n` and `m` can be up to 10^4 and strings up to 1000 characters, this could mean 10^11 operations

<div class="code-group">

```python
# Time: O(n * m * L) | Space: O(1) excluding output
def brute_force(wordsContainer, wordsQuery):
    result = []

    for query in wordsQuery:
        best_idx = 0
        best_len = 0

        for i, container in enumerate(wordsContainer):
            # Find longest common suffix
            q_ptr = len(query) - 1
            c_ptr = len(container) - 1
            common_len = 0

            while q_ptr >= 0 and c_ptr >= 0 and query[q_ptr] == container[c_ptr]:
                common_len += 1
                q_ptr -= 1
                c_ptr -= 1

            # Apply tie-breaking rules
            if common_len > best_len:
                best_len = common_len
                best_idx = i
            elif common_len == best_len:
                # Choose shorter string
                if len(container) < len(wordsContainer[best_idx]):
                    best_idx = i
                # If same length, keep smaller index
                elif len(container) == len(wordsContainer[best_idx]) and i < best_idx:
                    best_idx = i

        result.append(best_idx)

    return result
```

```javascript
// Time: O(n * m * L) | Space: O(1) excluding output
function bruteForce(wordsContainer, wordsQuery) {
  const result = [];

  for (const query of wordsQuery) {
    let bestIdx = 0;
    let bestLen = 0;

    for (let i = 0; i < wordsContainer.length; i++) {
      const container = wordsContainer[i];
      // Find longest common suffix
      let qPtr = query.length - 1;
      let cPtr = container.length - 1;
      let commonLen = 0;

      while (qPtr >= 0 && cPtr >= 0 && query[qPtr] === container[cPtr]) {
        commonLen++;
        qPtr--;
        cPtr--;
      }

      // Apply tie-breaking rules
      if (commonLen > bestLen) {
        bestLen = commonLen;
        bestIdx = i;
      } else if (commonLen === bestLen) {
        // Choose shorter string
        if (container.length < wordsContainer[bestIdx].length) {
          bestIdx = i;
        }
        // If same length, keep smaller index
        else if (container.length === wordsContainer[bestIdx].length && i < bestIdx) {
          bestIdx = i;
        }
      }
    }

    result.push(bestIdx);
  }

  return result;
}
```

```java
// Time: O(n * m * L) | Space: O(1) excluding output
public int[] bruteForce(String[] wordsContainer, String[] wordsQuery) {
    int[] result = new int[wordsQuery.length];

    for (int q = 0; q < wordsQuery.length; q++) {
        String query = wordsQuery[q];
        int bestIdx = 0;
        int bestLen = 0;

        for (int i = 0; i < wordsContainer.length; i++) {
            String container = wordsContainer[i];
            // Find longest common suffix
            int qPtr = query.length() - 1;
            int cPtr = container.length() - 1;
            int commonLen = 0;

            while (qPtr >= 0 && cPtr >= 0 &&
                   query.charAt(qPtr) == container.charAt(cPtr)) {
                commonLen++;
                qPtr--;
                cPtr--;
            }

            // Apply tie-breaking rules
            if (commonLen > bestLen) {
                bestLen = commonLen;
                bestIdx = i;
            } else if (commonLen == bestLen) {
                // Choose shorter string
                if (container.length() < wordsContainer[bestIdx].length()) {
                    bestIdx = i;
                }
                // If same length, keep smaller index
                else if (container.length() == wordsContainer[bestIdx].length() && i < bestIdx) {
                    bestIdx = i;
                }
            }
        }

        result[q] = bestIdx;
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that we need to efficiently match **suffixes**, not prefixes. A standard trie works well for prefixes, but for suffixes we have two options:

1. **Reverse the strings and use a prefix trie**: By reversing all strings, the suffix problem becomes a prefix problem. "Longest common suffix" between two strings becomes "longest common prefix" between their reversed versions.

2. **Use a suffix trie**: Build a trie where we insert each string from the end, but this is essentially the same as option 1.

The optimal approach:

- Reverse all container strings and insert them into a trie
- For each node in the trie, store the index of the "best" container string that passes through that node (according to the tie-breaking rules)
- For each query, reverse it and traverse the trie as far as possible
- The last node we reach gives us the best match

Why this works:

- When we reverse strings, suffixes become prefixes
- The trie naturally finds the longest common prefix (which corresponds to longest common suffix in original strings)
- By storing the best index at each node during insertion, we handle tie-breaking automatically

## Optimal Solution

Here's the complete solution using a reversed-string trie approach:

<div class="code-group">

```python
# Time: O((N + M) * L) where N = total chars in container, M = total chars in queries
# Space: O(N) for the trie
class TrieNode:
    def __init__(self):
        self.children = {}  # Map character to child node
        self.best_idx = -1  # Best container index for strings passing through this node
        self.best_len = float('inf')  # Length of best container string

class Solution:
    def stringIndices(self, wordsContainer, wordsQuery):
        # Step 1: Build the trie with reversed container strings
        root = TrieNode()

        for idx, word in enumerate(wordsContainer):
            # Reverse the word to convert suffix problem to prefix problem
            reversed_word = word[::-1]
            node = root

            # Update root node if this word is better than current best
            if root.best_idx == -1 or len(word) < root.best_len:
                root.best_idx = idx
                root.best_len = len(word)
            elif len(word) == root.best_len and idx < root.best_idx:
                root.best_idx = idx

            # Insert reversed word into trie
            for char in reversed_word:
                if char not in node.children:
                    node.children[char] = TrieNode()
                node = node.children[char]

                # Update this node with best container string so far
                # According to tie-breaking: shorter length wins, then smaller index
                if node.best_idx == -1 or len(word) < node.best_len:
                    node.best_idx = idx
                    node.best_len = len(word)
                elif len(word) == node.best_len and idx < node.best_idx:
                    node.best_idx = idx

        # Step 2: Process each query
        result = []
        for query in wordsQuery:
            # Reverse the query to match against reversed container strings
            reversed_query = query[::-1]
            node = root

            # Traverse as far as possible in the trie
            for char in reversed_query:
                if char not in node.children:
                    break
                node = node.children[char]

            # The node we end at has the best match
            result.append(node.best_idx)

        return result
```

```javascript
// Time: O((N + M) * L) where N = total chars in container, M = total chars in queries
// Space: O(N) for the trie
class TrieNode {
  constructor() {
    this.children = new Map(); // Map character to child node
    this.bestIdx = -1; // Best container index for strings passing through this node
    this.bestLen = Infinity; // Length of best container string
  }
}

function stringIndices(wordsContainer, wordsQuery) {
  // Step 1: Build the trie with reversed container strings
  const root = new TrieNode();

  for (let idx = 0; idx < wordsContainer.length; idx++) {
    const word = wordsContainer[idx];
    // Reverse the word to convert suffix problem to prefix problem
    const reversedWord = word.split("").reverse().join("");
    let node = root;

    // Update root node if this word is better than current best
    if (root.bestIdx === -1 || word.length < root.bestLen) {
      root.bestIdx = idx;
      root.bestLen = word.length;
    } else if (word.length === root.bestLen && idx < root.bestIdx) {
      root.bestIdx = idx;
    }

    // Insert reversed word into trie
    for (const char of reversedWord) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);

      // Update this node with best container string so far
      // According to tie-breaking: shorter length wins, then smaller index
      if (node.bestIdx === -1 || word.length < node.bestLen) {
        node.bestIdx = idx;
        node.bestLen = word.length;
      } else if (word.length === node.bestLen && idx < node.bestIdx) {
        node.bestIdx = idx;
      }
    }
  }

  // Step 2: Process each query
  const result = [];
  for (const query of wordsQuery) {
    // Reverse the query to match against reversed container strings
    const reversedQuery = query.split("").reverse().join("");
    let node = root;

    // Traverse as far as possible in the trie
    for (const char of reversedQuery) {
      if (!node.children.has(char)) {
        break;
      }
      node = node.children.get(char);
    }

    // The node we end at has the best match
    result.push(node.bestIdx);
  }

  return result;
}
```

```java
// Time: O((N + M) * L) where N = total chars in container, M = total chars in queries
// Space: O(N) for the trie
class TrieNode {
    Map<Character, TrieNode> children;
    int bestIdx;
    int bestLen;

    public TrieNode() {
        children = new HashMap<>();
        bestIdx = -1;
        bestLen = Integer.MAX_VALUE;
    }
}

class Solution {
    public int[] stringIndices(String[] wordsContainer, String[] wordsQuery) {
        // Step 1: Build the trie with reversed container strings
        TrieNode root = new TrieNode();

        for (int idx = 0; idx < wordsContainer.length; idx++) {
            String word = wordsContainer[idx];
            // Reverse the word to convert suffix problem to prefix problem
            String reversedWord = new StringBuilder(word).reverse().toString();
            TrieNode node = root;

            // Update root node if this word is better than current best
            if (root.bestIdx == -1 || word.length() < root.bestLen) {
                root.bestIdx = idx;
                root.bestLen = word.length();
            } else if (word.length() == root.bestLen && idx < root.bestIdx) {
                root.bestIdx = idx;
            }

            // Insert reversed word into trie
            for (char c : reversedWord.toCharArray()) {
                node.children.putIfAbsent(c, new TrieNode());
                node = node.children.get(c);

                // Update this node with best container string so far
                // According to tie-breaking: shorter length wins, then smaller index
                if (node.bestIdx == -1 || word.length() < node.bestLen) {
                    node.bestIdx = idx;
                    node.bestLen = word.length();
                } else if (word.length() == node.bestLen && idx < node.bestIdx) {
                    node.bestIdx = idx;
                }
            }
        }

        // Step 2: Process each query
        int[] result = new int[wordsQuery.length];
        for (int i = 0; i < wordsQuery.length; i++) {
            String query = wordsQuery[i];
            // Reverse the query to match against reversed container strings
            String reversedQuery = new StringBuilder(query).reverse().toString();
            TrieNode node = root;

            // Traverse as far as possible in the trie
            for (char c : reversedQuery.toCharArray()) {
                if (!node.children.containsKey(c)) {
                    break;
                }
                node = node.children.get(c);
            }

            // The node we end at has the best match
            result[i] = node.bestIdx;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Building the trie: `O(N)` where `N` is the total number of characters across all container strings. Each character is processed once during insertion.
- Processing queries: `O(M)` where `M` is the total number of characters across all query strings. Each query character is processed once during traversal.
- Total: `O(N + M)`, which is linear in the total input size.

**Space Complexity:**

- Trie storage: `O(N)` in the worst case where few strings share prefixes (after reversal). Each character might need its own node.
- Additional space: `O(1)` for variables, plus `O(k)` for output where `k` is the number of queries.
- Total: `O(N + k)`, dominated by the trie.

## Common Mistakes

1. **Forgetting to handle the empty suffix case**: When a query has no common suffix with any container string, you must return the shortest container string (or the one with smallest index if tied). The root node in our trie stores exactly this information.

2. **Incorrect tie-breaking order**: The problem specifies: first by longest common suffix, then by shortest container string length, then by smallest index. Candidates often implement these in the wrong order or miss one condition.

3. **Not reversing strings properly**: When reversing strings for the trie, it's easy to make off-by-one errors or forget that we're now dealing with prefixes instead of suffixes. Always test with simple cases like single-character strings.

4. **Inefficient suffix comparison**: Some candidates try to build a suffix array or use dynamic programming for each query, which can be `O(L^2)` per comparison. The trie approach is optimal for this problem structure.

## When You'll See This Pattern

This "reverse and use trie" pattern appears in several string matching problems:

1. **Longest Common Prefix (LeetCode 14)**: Direct prefix matching, simpler version without reversal.
2. **Prefix and Suffix Search (LeetCode 745)**: Combines both prefix and suffix matching using two tries or a paired-key approach.
3. **Implement Trie (LeetCode 208)**: The fundamental data structure used here.
4. **Search Suggestions System (LeetCode 1268)**: Uses trie for prefix-based autocomplete.

The core insight is recognizing when a suffix problem can be transformed into a prefix problem by reversal. This technique also appears in palindrome problems where you might reverse strings to find matches.

## Key Takeaways

1. **Suffix problems are often prefix problems in disguise**: When you need to match suffixes efficiently, consider reversing the strings and using a prefix-oriented data structure like a trie.

2. **Tries excel at prefix/suffix matching**: For problems involving multiple strings and prefix/suffix queries, tries often provide the optimal `O(L)` query time after `O(N)` preprocessing.

3. **Store metadata in trie nodes**: You can augment trie nodes with additional information (like best match indices) to answer complex queries efficiently during traversal.

Related problems: [Longest Common Prefix](/problem/longest-common-prefix), [Find the Length of the Longest Common Prefix](/problem/find-the-length-of-the-longest-common-prefix)
