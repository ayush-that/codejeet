---
title: "How to Solve Sum of Prefix Scores of Strings — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sum of Prefix Scores of Strings. Hard difficulty, 60.8% acceptance rate. Topics: Array, String, Trie, Counting."
date: "2027-02-08"
category: "dsa-patterns"
tags: ["sum-of-prefix-scores-of-strings", "array", "string", "trie", "hard"]
---

# How to Solve Sum of Prefix Scores of Strings

This problem asks us to compute, for each string in an array, the sum of scores of all its prefixes, where a prefix's score is how many strings in the array have that prefix. The challenge is doing this efficiently when strings can be long and the array large—a brute force check of every prefix against every string would be far too slow. The key insight is recognizing that prefix relationships naturally map to a **trie** data structure, where we can store counts at each node to answer queries quickly.

## Visual Walkthrough

Let's trace through a small example: `words = ["abc", "ab", "bc", "b"]`

We need to compute for each word:

- `"abc"`: prefixes `"a"`, `"ab"`, `"abc"`
- `"ab"`: prefixes `"a"`, `"ab"`
- `"bc"`: prefixes `"b"`, `"bc"`
- `"b"`: prefix `"b"`

First, let's build intuition about prefix counts. The prefix `"a"` appears in `"abc"` and `"ab"` → score 2.  
`"ab"` appears in `"abc"` and `"ab"` → score 2.  
`"abc"` appears only in `"abc"` → score 1.  
`"b"` appears in `"abc"`? No, `"abc"` doesn't start with `"b"`. Wait—careful! A prefix must match from the **beginning** of the string. So `"b"` appears in `"ab"`? No, `"ab"` starts with `"a"`. Actually `"b"` appears in `"bc"` and `"b"` → score 2.  
`"bc"` appears only in `"bc"` → score 1.

Now the sum for each word:

- `"abc"`: `"a"`(2) + `"ab"`(2) + `"abc"`(1) = 5
- `"ab"`: `"a"`(2) + `"ab"`(2) = 4
- `"bc"`: `"b"`(2) + `"bc"`(1) = 3
- `"b"`: `"b"`(2) = 2

The brute force approach would check each prefix of each word against all words, giving O(n² × L²) time where L is string length. With n up to 1000 and strings up to 1000 characters, that's up to 10⁹ operations—far too slow.

## Brute Force Approach

A naive solution would be: for each word, generate all its prefixes, then for each prefix, scan through all words to count how many start with that prefix.

<div class="code-group">

```python
# Time: O(n² * L²) where n = len(words), L = max word length
# Space: O(L) for storing prefixes
def sumPrefixScores_brute(words):
    n = len(words)
    result = []

    for i in range(n):
        total = 0
        word = words[i]
        # Generate all prefixes of current word
        for end in range(1, len(word) + 1):
            prefix = word[:end]
            count = 0
            # Count how many words have this prefix
            for j in range(n):
                if words[j].startswith(prefix):
                    count += 1
            total += count
        result.append(total)

    return result
```

```javascript
// Time: O(n² * L²) where n = words.length, L = max word length
// Space: O(L)
function sumPrefixScoresBrute(words) {
  const n = words.length;
  const result = [];

  for (let i = 0; i < n; i++) {
    let total = 0;
    const word = words[i];
    // Generate all prefixes
    for (let end = 1; end <= word.length; end++) {
      const prefix = word.substring(0, end);
      let count = 0;
      // Count words with this prefix
      for (let j = 0; j < n; j++) {
        if (words[j].startsWith(prefix)) {
          count++;
        }
      }
      total += count;
    }
    result.push(total);
  }

  return result;
}
```

```java
// Time: O(n² * L²) where n = words.length, L = max word length
// Space: O(L)
public int[] sumPrefixScoresBrute(String[] words) {
    int n = words.length;
    int[] result = new int[n];

    for (int i = 0; i < n; i++) {
        int total = 0;
        String word = words[i];
        // Check each prefix
        for (int end = 1; end <= word.length(); end++) {
            String prefix = word.substring(0, end);
            int count = 0;
            // Count occurrences
            for (int j = 0; j < n; j++) {
                if (words[j].startsWith(prefix)) {
                    count++;
                }
            }
            total += count;
        }
        result[i] = total;
    }

    return result;
}
```

</div>

Why this fails: With n up to 1000 and L up to 1000, worst case is ~10⁹ operations (1000 × 1000 × 1000). In practice, constraints make this too slow. We need to avoid repeatedly counting the same prefixes.

## Optimized Approach

The key insight: **A trie (prefix tree) can store prefix counts efficiently**.

Here's the step-by-step reasoning:

1. **Build a trie from all words**: Each node represents a character, and we store a `count` at each node showing how many words pass through it (i.e., have that prefix).

2. **Why a trie works**:
   - Insertion: For each word, follow/create nodes for each character, incrementing counts along the way.
   - Query: For a word, traverse it in the trie, summing the counts at each node. Each node's count tells us how many words have the prefix ending at that node.

3. **Two-pass algorithm**:
   - First pass: Insert all words into trie, building prefix counts.
   - Second pass: For each word, traverse the trie and sum counts along its path.

4. **Complexity advantage**:
   - Building: O(total characters across all words) = O(n × L)
   - Querying: O(L) per word, O(n × L) total
   - Total: O(n × L) instead of O(n² × L²)

The trie collapses redundant work—instead of counting each prefix separately, we compute all prefix counts simultaneously during insertion.

## Optimal Solution

We implement a trie where each node has:

- `children`: map/dictionary from character to child node
- `count`: how many words have the prefix ending at this node

<div class="code-group">

```python
# Time: O(n * L) where n = len(words), L = avg word length
# Space: O(n * L) for the trie
class TrieNode:
    def __init__(self):
        self.children = {}  # char -> TrieNode
        self.count = 0      # how many words pass through this node

class Solution:
    def sumPrefixScores(self, words):
        # Step 1: Build the trie with count information
        root = TrieNode()

        for word in words:
            node = root
            for ch in word:
                if ch not in node.children:
                    node.children[ch] = TrieNode()
                node = node.children[ch]
                node.count += 1  # Increment for each prefix

        # Step 2: For each word, traverse trie and sum counts
        result = []
        for word in words:
            total = 0
            node = root
            for ch in word:
                node = node.children[ch]  # Guaranteed to exist since we inserted all words
                total += node.count       # Add count for current prefix
            result.append(total)

        return result
```

```javascript
// Time: O(n * L) where n = words.length, L = avg word length
// Space: O(n * L) for the trie
class TrieNode {
  constructor() {
    this.children = new Map(); // char -> TrieNode
    this.count = 0; // number of words with this prefix
  }
}

function sumPrefixScores(words) {
  // Step 1: Build trie with counts
  const root = new TrieNode();

  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch);
      node.count++; // Increment for each character (prefix)
    }
  }

  // Step 2: Query each word's prefix scores
  const result = [];
  for (const word of words) {
    let total = 0;
    let node = root;
    for (const ch of word) {
      node = node.children.get(ch); // Will exist since we inserted all words
      total += node.count; // Add count for current prefix
    }
    result.push(total);
  }

  return result;
}
```

```java
// Time: O(n * L) where n = words.length, L = avg word length
// Space: O(n * L) for the trie
class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    int count = 0;  // number of words passing through this node
}

class Solution {
    public int[] sumPrefixScores(String[] words) {
        // Step 1: Build the trie
        TrieNode root = new TrieNode();

        for (String word : words) {
            TrieNode node = root;
            for (char ch : word.toCharArray()) {
                node.children.putIfAbsent(ch, new TrieNode());
                node = node.children.get(ch);
                node.count++;  // Increment count for this prefix
            }
        }

        // Step 2: Calculate scores for each word
        int[] result = new int[words.length];
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            int total = 0;
            TrieNode node = root;
            for (char ch : word.toCharArray()) {
                node = node.children.get(ch);  // Guaranteed to exist
                total += node.count;           // Add prefix count
            }
            result[i] = total;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × L) where n is number of words and L is average word length.

- Building the trie: We process each character of each word once → O(total characters) = O(n × L)
- Querying: For each word, we traverse L nodes → O(n × L)
- Total: O(n × L) + O(n × L) = O(n × L)

**Space Complexity**: O(n × L) for the trie in worst case.

- In the worst case (no common prefixes), each character gets its own node → total nodes = total characters = O(n × L)
- Each node stores a map/dictionary and an integer count

This is optimal—we must at least read all input characters, giving Ω(n × L) lower bound.

## Common Mistakes

1. **Forgetting to increment count at each node during insertion**: Some candidates only increment at the end node (complete word), but we need counts for **all prefixes**, not just complete words. Each character position represents a prefix that needs counting.

2. **Using array instead of map for children**: While an array of size 26 works for lowercase English letters (as in the problem constraints), using a map is more general and clearer. However, if using array, remember to convert `char - 'a'` for indexing.

3. **Not handling the query traversal correctly**: During querying, you must follow the exact path of the word and sum counts. A common error is to start summing from the root's children instead of from the first character node. The root itself has no count (or count = n), but we don't include it since empty prefix isn't considered.

4. **Assuming words are unique**: The problem doesn't say words are distinct. If duplicates exist, our solution still works because we increment count for each occurrence during insertion.

## When You'll See This Pattern

The "trie with counts" pattern appears in problems involving:

- **Prefix frequency counting**: Like this problem, or "Map Sum Pairs" (LeetCode 677) where you sum values of keys with a given prefix.
- **Prefix search/autocomplete**: "Design Add and Search Words Data Structure" (LeetCode 211) uses trie for word search with wildcards.
- **Bitwise prefix problems**: "Maximum XOR of Two Numbers in an Array" (LeetCode 421) uses a binary trie to find maximum XOR by comparing prefix bits.

The core idea: When you need to answer queries about prefixes (or suffixes, with a reversed trie) across many strings, a trie with additional metadata (counts, flags, values) at nodes is often the right approach.

## Key Takeaways

1. **Trie for prefix problems**: When a problem involves prefixes of strings and you need to answer queries about them, think trie. It compresses common prefixes and allows O(L) query time after O(n×L) build time.

2. **Store metadata at nodes**: Don't just use trie for existence checking. You can store counts (like here), values, or other information to answer complex queries efficiently.

3. **Two-phase processing common**: Many trie solutions follow this pattern: (1) Build trie from all input, (2) Query trie for each input. This separates preprocessing from answering.

Related problems: [Design Add and Search Words Data Structure](/problem/design-add-and-search-words-data-structure), [Maximum XOR of Two Numbers in an Array](/problem/maximum-xor-of-two-numbers-in-an-array), [Map Sum Pairs](/problem/map-sum-pairs)
