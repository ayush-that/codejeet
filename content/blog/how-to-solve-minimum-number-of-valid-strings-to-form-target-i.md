---
title: "How to Solve Minimum Number of Valid Strings to Form Target I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of Valid Strings to Form Target I. Medium difficulty, 21.7% acceptance rate. Topics: Array, String, Binary Search, Dynamic Programming, Trie."
date: "2026-02-03"
category: "dsa-patterns"
tags:
  ["minimum-number-of-valid-strings-to-form-target-i", "array", "string", "binary-search", "medium"]
---

# How to Solve Minimum Number of Valid Strings to Form Target I

You need to form a target string by concatenating valid strings, where a valid string is any prefix of any word in a given list. The challenge is finding the minimum number of such valid strings needed, or determining it's impossible. This problem is tricky because you can't just greedily take the longest valid prefix—that might lead to dead ends, requiring dynamic programming to find the optimal breakdown.

## Visual Walkthrough

Let's walk through an example:  
`words = ["abc", "ab", "bc", "c"]`, `target = "abcbc"`

We need to form "abcbc" using prefixes from the words. Valid prefixes are:

- From "abc": "a", "ab", "abc"
- From "ab": "a", "ab"
- From "bc": "b", "bc"
- From "c": "c"

We want the minimum number of valid strings to build "abcbc". Let's think step-by-step:

1. Starting at position 0 of target: possible valid prefixes are "a", "ab", "abc"
2. If we take "a" (length 1), we're left with "bcbc" to form
3. If we take "ab" (length 2), we're left with "cbc" to form
4. If we take "abc" (length 3), we're left with "bc" to form

We need to explore all possibilities and find the minimum. Let's trace one path:

- Start: "abcbc"
- Take "abc" → remaining: "bc"
- From "bc", take "bc" → remaining: "" (done!)
  That's 2 valid strings: ["abc", "bc"]

But is this minimal? Let's check another path:

- Start: "abcbc"
- Take "ab" → remaining: "cbc"
- From "cbc", take "c" → remaining: "bc"
- From "bc", take "bc" → remaining: "" (done)
  That's 3 valid strings: ["ab", "c", "bc"]

So the minimum is 2. The key insight: we need to check ALL possible valid prefixes at each position and choose the combination that gives us the minimum overall.

## Brute Force Approach

A naive approach would be to try all possible ways to break the target into valid strings. At each position `i` in the target, we could:

1. Check all possible valid prefixes starting at position `i`
2. For each valid prefix of length `L`, recursively solve for the remaining substring starting at position `i+L`
3. Take the minimum result from all these options

The problem with this brute force recursion is exponential time complexity. For each position, we might have up to `O(n*m)` valid prefixes to check (where `n` is number of words and `m` is max word length), leading to `O((n*m)^k)` where `k` is the number of segments needed.

Even with memoization, checking all possible prefixes at each position by scanning through all words is inefficient. We need a faster way to find all valid prefixes starting at a given position.

## Optimized Approach

The key insight is that we need to efficiently find **all valid prefixes** of the target starting at each position. A Trie (prefix tree) is perfect for this!

Here's the optimized approach:

1. **Build a Trie** from all words. This lets us quickly find all prefixes that match the target starting at any position.

2. **Use Dynamic Programming** with memoization:
   - `dp[i]` = minimum number of valid strings needed to form `target[i:]` (substring starting at index `i`)
   - Base case: `dp[target.length] = 0` (empty string needs 0 valid strings)
   - For position `i`, traverse the Trie while matching characters from `target[i:]`
   - For each node we reach that represents a complete prefix (end of a word), we have a valid string
   - Recurrence: `dp[i] = min(1 + dp[i + L])` for all valid prefixes of length `L` starting at `i`

3. **Optimization**: Instead of storing just whether a node is an end of word, we can store the minimum length of words ending at that node (or all lengths). This helps us quickly know what valid prefixes exist.

The Trie helps us avoid repeatedly scanning through all words. For each starting position `i`, we traverse the Trie once, collecting all valid prefix lengths in `O(m)` time where `m` is the length of the longest word.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * m + t * m) where n = len(words), m = max word length, t = len(target)
# Space: O(n * m + t) for Trie and DP array
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
        # Store lengths of valid prefixes ending at this node
        self.prefix_lengths = []

class Solution:
    def minValidStrings(self, words, target):
        # Step 1: Build Trie from all words
        root = TrieNode()
        for word in words:
            node = root
            for i, ch in enumerate(word):
                if ch not in node.children:
                    node.children[ch] = TrieNode()
                node = node.children[ch]
                # Every prefix is valid, so mark all prefixes
                node.prefix_lengths.append(i + 1)  # +1 because i is 0-indexed
            node.is_end = True

        n = len(target)
        # Step 2: DP array, dp[i] = min valid strings to form target[i:]
        # Initialize with infinity (impossible)
        dp = [float('inf')] * (n + 1)
        dp[n] = 0  # Empty string needs 0 valid strings

        # Step 3: Process from end to beginning
        for i in range(n - 1, -1, -1):
            # Traverse Trie from current position
            node = root
            for j in range(i, n):
                ch = target[j]
                if ch not in node.children:
                    break  # No more valid prefixes starting at i

                node = node.children[ch]
                # For each valid prefix length found
                for length in node.prefix_lengths:
                    next_pos = i + length
                    if next_pos <= n and dp[next_pos] != float('inf'):
                        dp[i] = min(dp[i], 1 + dp[next_pos])

        return dp[0] if dp[0] != float('inf') else -1
```

```javascript
// Time: O(n * m + t * m) where n = words.length, m = max word length, t = target.length
// Space: O(n * m + t) for Trie and DP array
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
    // Store lengths of valid prefixes ending at this node
    this.prefixLengths = [];
  }
}

var minValidStrings = function (words, target) {
  // Step 1: Build Trie from all words
  const root = new TrieNode();
  for (const word of words) {
    let node = root;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch);
      // Every prefix is valid, so mark all prefixes
      node.prefixLengths.push(i + 1); // +1 because i is 0-indexed
    }
    node.isEnd = true;
  }

  const n = target.length;
  // Step 2: DP array, dp[i] = min valid strings to form target[i:]
  // Initialize with Infinity (impossible)
  const dp = new Array(n + 1).fill(Infinity);
  dp[n] = 0; // Empty string needs 0 valid strings

  // Step 3: Process from end to beginning
  for (let i = n - 1; i >= 0; i--) {
    // Traverse Trie from current position
    let node = root;
    for (let j = i; j < n; j++) {
      const ch = target[j];
      if (!node.children.has(ch)) {
        break; // No more valid prefixes starting at i
      }

      node = node.children.get(ch);
      // For each valid prefix length found
      for (const length of node.prefixLengths) {
        const nextPos = i + length;
        if (nextPos <= n && dp[nextPos] !== Infinity) {
          dp[i] = Math.min(dp[i], 1 + dp[nextPos]);
        }
      }
    }
  }

  return dp[0] !== Infinity ? dp[0] : -1;
};
```

```java
// Time: O(n * m + t * m) where n = words.length, m = max word length, t = target.length
// Space: O(n * m + t) for Trie and DP array
class TrieNode {
    Map<Character, TrieNode> children;
    boolean isEnd;
    List<Integer> prefixLengths;  // Lengths of valid prefixes ending at this node

    TrieNode() {
        children = new HashMap<>();
        isEnd = false;
        prefixLengths = new ArrayList<>();
    }
}

class Solution {
    public int minValidStrings(String[] words, String target) {
        // Step 1: Build Trie from all words
        TrieNode root = new TrieNode();
        for (String word : words) {
            TrieNode node = root;
            for (int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                node.children.putIfAbsent(ch, new TrieNode());
                node = node.children.get(ch);
                // Every prefix is valid, so mark all prefixes
                node.prefixLengths.add(i + 1);  // +1 because i is 0-indexed
            }
            node.isEnd = true;
        }

        int n = target.length();
        // Step 2: DP array, dp[i] = min valid strings to form target[i:]
        // Initialize with max value (impossible)
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[n] = 0;  // Empty string needs 0 valid strings

        // Step 3: Process from end to beginning
        for (int i = n - 1; i >= 0; i--) {
            // Traverse Trie from current position
            TrieNode node = root;
            for (int j = i; j < n; j++) {
                char ch = target.charAt(j);
                if (!node.children.containsKey(ch)) {
                    break;  // No more valid prefixes starting at i
                }

                node = node.children.get(ch);
                // For each valid prefix length found
                for (int length : node.prefixLengths) {
                    int nextPos = i + length;
                    if (nextPos <= n && dp[nextPos] != Integer.MAX_VALUE) {
                        dp[i] = Math.min(dp[i], 1 + dp[nextPos]);
                    }
                }
            }
        }

        return dp[0] != Integer.MAX_VALUE ? dp[0] : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * m + t * m)` where:

- `n` = number of words
- `m` = maximum length of any word
- `t` = length of target string

Breaking it down:

- Building the Trie: `O(n * m)` — we process each character of each word
- DP computation: `O(t * m)` — for each position in target (t), we might traverse up to m characters in the Trie

**Space Complexity:** `O(n * m + t)` where:

- `O(n * m)` for the Trie (in worst case, all characters are distinct)
- `O(t)` for the DP array

## Common Mistakes

1. **Greedy approach fails**: Trying to always take the longest valid prefix doesn't work. Example: `words = ["ab", "a", "b"]`, `target = "ab"`. Longest valid prefix at start is "ab" (good), but for `target = "aab"`, taking longest "a" first leaves "ab" which needs 2 more strings, while taking shorter "a" first allows "a"+"ab".

2. **Forgetting all prefixes are valid**: Some candidates only mark complete words in the Trie, but the problem says ANY prefix of any word is valid. We need to mark every node as representing a valid prefix.

3. **Incorrect DP initialization**: Setting `dp[0] = 0` instead of `dp[n] = 0`. We're working backwards, so the base case is the end of the string.

4. **Not handling impossible cases**: Forgetting to return -1 when `dp[0]` remains at its initial "impossible" value. Always check if a solution exists.

## When You'll See This Pattern

This "Trie + DP" pattern appears in problems where you need to break a string into pieces from a dictionary, especially when:

1. The dictionary contains prefixes (not just whole words)
2. You need the minimum number of pieces
3. The dictionary is large, so efficient prefix lookup is crucial

Related problems:

- **Word Break** (LeetCode 139): Similar but returns boolean instead of minimum count
- **Word Break II** (LeetCode 140): Returns all possible breakdowns
- **Concatenated Words** (LeetCode 472): Find words that can be formed by concatenating other words

## Key Takeaways

1. **Trie + DP is powerful for string segmentation problems**: When you need to break a string into pieces from a dictionary and optimize something (min count, max score, etc.), this combination is often the solution.

2. **Work backwards in DP for string segmentation**: It's often easier to define `dp[i]` as the solution for suffix `target[i:]` rather than prefix `target[:i]`.

3. **Mark all prefixes in Trie when needed**: Don't assume only complete words matter—read the problem carefully to understand what constitutes a valid piece.

Related problems: [Minimum Cost to Convert String II](/problem/minimum-cost-to-convert-string-ii), [Construct String with Minimum Cost](/problem/construct-string-with-minimum-cost)
