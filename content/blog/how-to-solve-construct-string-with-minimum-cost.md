---
title: "How to Solve Construct String with Minimum Cost — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Construct String with Minimum Cost. Hard difficulty, 19.0% acceptance rate. Topics: Array, String, Dynamic Programming, Suffix Array."
date: "2026-03-20"
category: "dsa-patterns"
tags: ["construct-string-with-minimum-cost", "array", "string", "dynamic-programming", "hard"]
---

# How to Solve Construct String with Minimum Cost

You're given a target string and a list of words with associated costs. You can append any word to your current string as many times as you want, paying its cost each time. The goal is to construct the target string with the minimum total cost. What makes this problem tricky is that words can overlap in complex ways—you might use parts of words to build the target efficiently, and the optimal solution requires careful planning about which words to use and where.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

- `target = "abcde"`
- `words = ["ab", "bc", "cde", "de"]`
- `costs = [1, 2, 3, 1]`

We start with an empty string `s = ""` and want to build `"abcde"`.

**Step-by-step thinking:**

1. We need to cover position 0 of target (`'a'`). Only `"ab"` starts with `'a'`, so we could use it at cost 1, covering positions 0-1.
2. Now we're at position 2 (`'c'`). Options:
   - Use `"bc"` (cost 2) covering positions 1-2, but position 1 is already covered by `"ab"`—this would waste the `'b'`.
   - Use `"cde"` (cost 3) covering positions 2-4, completing the string.
3. Total cost: `"ab"` (1) + `"cde"` (3) = 4.

But wait—is there a better way? What if we:

- Use `"ab"` (cost 1) covering 0-1
- Use `"de"` (cost 1) covering 3-4
- We still need position 2 (`'c'`). We could use `"bc"` (cost 2) but it would cover 1-2, overlapping with `"ab"` at position 1.

This reveals the core challenge: we need to find the cheapest way to cover every position in the target, allowing words to overlap, but we pay for each word we use regardless of overlap.

The optimal solution for this example is indeed `"ab"` + `"cde"` = cost 4. Let's see why dynamic programming helps us find this systematically.

## Brute Force Approach

A naive approach would try all possible sequences of words that could form the target. For each position in the target, we could try every word that matches starting at that position, then recursively solve for the remaining suffix.

**Why this fails:**

- If the target has length `n` and there are `m` words, in the worst case we might try `m` choices at each of `n` positions.
- This leads to `O(m^n)` time complexity—completely infeasible even for moderate `n`.
- We're doing lots of redundant work: the cost to build suffix `target[i:]` doesn't depend on how we got there, only on the index `i`.

**What candidates might try:**
Some might try greedy approaches—always pick the cheapest word that matches at the current position, or the longest word to cover more ground. Both fail on counterexamples:

- Cheapest-first: In our example, `"de"` (cost 1) is cheaper than `"cde"` (cost 3), but using it leaves us needing to cover `'c'` separately, which might be more expensive overall.
- Longest-first: `"cde"` covers 3 characters vs `"ab"` covering 2, but maybe a combination of shorter words is cheaper.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem similar to "word break" or "minimum cost to reach position." We define:

`dp[i]` = minimum cost to build the prefix `target[0:i]` (first `i` characters)

**Base case:** `dp[0] = 0` (empty string costs nothing)

**Transition:** For each position `i`, for each word `words[j]` that matches `target[i:i+len(word)]`, we can extend from a previous position:

```
dp[i + len(word)] = min(dp[i + len(word)], dp[i] + costs[j])
```

But checking every word at every position is still `O(n * m * L)` where `L` is average word length. We need to optimize the matching check.

**Critical optimization:**
We can preprocess all words into a **trie** (prefix tree) or use **string hashing** for fast substring matching. For each position `i` in target, we want to quickly find all words that match starting at `i`. A trie lets us traverse from `i` and collect all matching words in `O(L)` time per position.

**Step-by-step reasoning:**

1. Build a trie from all words, storing at each node the minimum cost among all words ending there.
2. Initialize `dp` array of size `n+1` with `infinity`, `dp[0] = 0`.
3. For each position `i` from 0 to `n-1`:
   - If `dp[i]` is not reachable (still infinity), skip.
   - Traverse the trie starting from `target[i]`, following characters.
   - For each node representing a complete word (ending at length `k`), update:
     `dp[i + k] = min(dp[i + k], dp[i] + node.cost)`
4. Answer is `dp[n]` if finite, else `-1`.

This reduces the time to `O(n * L + total_characters_in_words)` which is efficient.

## Optimal Solution

Here's the complete implementation using a trie for fast matching:

<div class="code-group">

```python
# Time: O(n * L + T) where n = len(target), L = max word length,
#       T = total characters in words
# Space: O(T + n) for trie and dp array
class TrieNode:
    def __init__(self):
        self.children = {}
        self.min_cost = float('inf')  # min cost of words ending here

class Solution:
    def minCost(self, target: str, words: List[str], costs: List[int]) -> int:
        # Build trie from words
        root = TrieNode()
        for word, cost in zip(words, costs):
            node = root
            for ch in word:
                if ch not in node.children:
                    node.children[ch] = TrieNode()
                node = node.children[ch]
            # Store minimum cost for words ending at this node
            node.min_cost = min(node.min_cost, cost)

        n = len(target)
        dp = [float('inf')] * (n + 1)
        dp[0] = 0  # empty string costs 0

        # Process each position in target
        for i in range(n):
            if dp[i] == float('inf'):
                continue  # can't reach this position

            # Traverse trie from current position
            node = root
            j = i
            while j < n and target[j] in node.children:
                node = node.children[target[j]]
                j += 1

                # If we've reached a complete word, update dp
                if node.min_cost != float('inf'):
                    dp[j] = min(dp[j], dp[i] + node.min_cost)

        return dp[n] if dp[n] != float('inf') else -1
```

```javascript
// Time: O(n * L + T) where n = target.length, L = max word length,
//       T = total characters in words
// Space: O(T + n) for trie and dp array
class TrieNode {
  constructor() {
    this.children = new Map();
    this.minCost = Infinity; // minimum cost of words ending here
  }
}

function minCost(target, words, costs) {
  // Build trie from words
  const root = new TrieNode();
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const cost = costs[i];
    let node = root;

    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch);
    }
    // Store minimum cost for words ending at this node
    node.minCost = Math.min(node.minCost, cost);
  }

  const n = target.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0; // empty string costs 0

  // Process each position in target
  for (let i = 0; i < n; i++) {
    if (dp[i] === Infinity) {
      continue; // can't reach this position
    }

    // Traverse trie from current position
    let node = root;
    let j = i;
    while (j < n && node.children.has(target[j])) {
      node = node.children.get(target[j]);
      j++;

      // If we've reached a complete word, update dp
      if (node.minCost !== Infinity) {
        dp[j] = Math.min(dp[j], dp[i] + node.minCost);
      }
    }
  }

  return dp[n] !== Infinity ? dp[n] : -1;
}
```

```java
// Time: O(n * L + T) where n = target.length(), L = max word length,
//       T = total characters in words
// Space: O(T + n) for trie and dp array
class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    int minCost = Integer.MAX_VALUE;  // minimum cost of words ending here
}

class Solution {
    public int minCost(String target, String[] words, int[] costs) {
        // Build trie from words
        TrieNode root = new TrieNode();
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            int cost = costs[i];
            TrieNode node = root;

            for (char ch : word.toCharArray()) {
                node.children.putIfAbsent(ch, new TrieNode());
                node = node.children.get(ch);
            }
            // Store minimum cost for words ending at this node
            node.minCost = Math.min(node.minCost, cost);
        }

        int n = target.length();
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;  // empty string costs 0

        // Process each position in target
        for (int i = 0; i < n; i++) {
            if (dp[i] == Integer.MAX_VALUE) {
                continue;  // can't reach this position
            }

            // Traverse trie from current position
            TrieNode node = root;
            int j = i;
            while (j < n && node.children.containsKey(target.charAt(j))) {
                node = node.children.get(target.charAt(j));
                j++;

                // If we've reached a complete word, update dp
                if (node.minCost != Integer.MAX_VALUE) {
                    if (dp[i] + node.minCost < dp[j]) {
                        dp[j] = dp[i] + node.minCost;
                    }
                }
            }
        }

        return dp[n] != Integer.MAX_VALUE ? dp[n] : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * L + T)` where:

- `n` is the length of `target`
- `L` is the maximum length of any word
- `T` is the total number of characters across all words

**Why:** We process each position in `target` (n iterations). For each position, we traverse the trie for at most `L` steps (maximum word length). Building the trie takes `O(T)` time. In practice, `L` is usually much smaller than `n`, making this efficient.

**Space Complexity:** `O(T + n)` where:

- `T` is for the trie storing all characters from all words
- `n` is for the `dp` array

The trie space is proportional to the total characters in all words, which is reasonable given the constraints.

## Common Mistakes

1. **Forgetting to handle unreachable states:** If `dp[n]` remains infinity, we must return `-1`. Candidates often return `dp[n]` without checking, which could return an incorrect large value.

2. **Not storing minimum cost per word ending:** Multiple words might end at the same trie node (different words with same content). We must store the minimum cost among them, not just any cost. The code uses `node.minCost = min(node.minCost, cost)` for this.

3. **Incorrect dp indices:** The dp array has size `n+1` where `dp[i]` represents cost for first `i` characters. When we use a word of length `k` starting at `i`, we update `dp[i+k]`, not `dp[i+k-1]`. Off-by-one errors here are common.

4. **Skipping positions incorrectly:** We should only process from position `i` if `dp[i]` is reachable (not infinity). Otherwise, we'd be trying to extend from an unreachable state, potentially causing overflow if we add costs to infinity.

## When You'll See This Pattern

This **DP + trie for substring matching** pattern appears in several string construction problems:

1. **Word Break (LeetCode 139)** - Simpler version without costs, just checking if segmentation is possible.
2. **Concatenated Words (LeetCode 472)** - Finding words that can be formed by concatenating other words from the same list.
3. **Minimum Number of Valid Strings to Form Target I/II** - Almost identical problems with slight variations in constraints.

The core pattern is: when you need to check many possible "segments" or "pieces" at each position of a string, and make optimal decisions, consider DP with position as state. If matching segments against the string is expensive, use a trie or hashing to accelerate it.

## Key Takeaways

1. **DP on string positions** is natural when building a string piece by piece. The state represents "how much of the target we've built so far."

2. **Trie accelerates substring matching** when you have a fixed dictionary of words to match against a string. It's better than checking each word separately when words share prefixes.

3. **Overlap is allowed but paid for**—this is different from some segmentation problems where pieces can't overlap. Here, overlapping just means we're paying for redundant coverage, which might still be optimal if a word is cheap enough.

Related problems: [Minimum Number of Valid Strings to Form Target II](/problem/minimum-number-of-valid-strings-to-form-target-ii), [Minimum Number of Valid Strings to Form Target I](/problem/minimum-number-of-valid-strings-to-form-target-i)
