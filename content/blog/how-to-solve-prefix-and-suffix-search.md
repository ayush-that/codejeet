---
title: "How to Solve Prefix and Suffix Search — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Prefix and Suffix Search. Hard difficulty, 40.8% acceptance rate. Topics: Array, Hash Table, String, Design, Trie."
date: "2027-04-15"
category: "dsa-patterns"
tags: ["prefix-and-suffix-search", "array", "hash-table", "string", "hard"]
---

# How to Solve Prefix and Suffix Search

You need to design a dictionary that can find words matching both a prefix AND a suffix. The challenge is that you can't just check prefixes or suffixes separately—you need to efficiently find words that satisfy both conditions simultaneously. This problem is tricky because standard prefix tries don't help with suffix matching, and checking every word would be too slow for large dictionaries.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose our dictionary is `["apple", "appetite", "banana", "application"]`.

**Initialization:** We store these words with their indices (0, 1, 2, 3 respectively).

**Query 1:** `f("app", "e")` → We need words starting with "app" AND ending with "e":

- "apple": starts with "app" ✓, ends with "e" ✓ → valid
- "appetite": starts with "app" ✓, ends with "e" ✓ → valid
- "application": starts with "app" ✓, ends with "n" ✗ → invalid
- "banana": starts with "ban" ✗ → invalid

We return the highest index among valid words: max(0, 1) = 1

**Query 2:** `f("ba", "na")` → Words starting with "ba" AND ending with "na":

- "banana": starts with "ba" ✓, ends with "na" ✓ → valid
  Return index 2

The naive approach would check every word for each query, which is O(n × (p + s)) where n is number of words, p is prefix length, s is suffix length. With many queries, this becomes inefficient.

## Brute Force Approach

The simplest solution stores all words and their indices, then for each query scans through every word checking if it starts with the prefix and ends with the suffix:

<div class="code-group">

```python
class WordFilter:
    def __init__(self, words):
        # Store words with their indices
        self.words = words

    def f(self, pref, suff):
        # Check each word from last to first (to find highest index)
        for i in range(len(self.words)-1, -1, -1):
            word = self.words[i]
            # Check prefix and suffix match
            if word.startswith(pref) and word.endswith(suff):
                return i
        return -1
```

```javascript
class WordFilter {
  constructor(words) {
    this.words = words;
  }

  f(pref, suff) {
    // Check each word from last to first
    for (let i = this.words.length - 1; i >= 0; i--) {
      const word = this.words[i];
      // Check prefix and suffix match
      if (word.startsWith(pref) && word.endsWith(suff)) {
        return i;
      }
    }
    return -1;
  }
}
```

```java
class WordFilter {
    private String[] words;

    public WordFilter(String[] words) {
        this.words = words;
    }

    public int f(String pref, String suff) {
        // Check each word from last to first
        for (int i = words.length - 1; i >= 0; i--) {
            String word = words[i];
            // Check prefix and suffix match
            if (word.startsWith(pref) && word.endsWith(suff)) {
                return i;
            }
        }
        return -1;
    }
}
```

</div>

**Why this is insufficient:** Each query takes O(n × (p + s)) time. With n up to 10⁴ and many queries, this becomes O(10⁸) operations, which is too slow. We need a way to answer queries faster than linear time.

## Optimized Approach

The key insight is that we need to check both prefix AND suffix simultaneously. One clever approach is to preprocess all possible prefix-suffix combinations for each word.

**Main idea:** For each word, generate all possible suffix + "|" + prefix combinations, where "|" is a separator character not found in words. For example, for word "apple" with index 0:

- Generate: "e|apple", "le|apple", "ple|apple", "pple|apple", "apple|apple"
- Also generate: "|apple" (empty suffix case)
- For each combination, store the word's index in a hash map

**Why this works:** When we query for prefix "app" and suffix "e", we look up "e|app" in our hash map. This matches exactly the words that end with "e" and start with "app".

**Step-by-step reasoning:**

1. For each word at index i, generate all possible suffixes
2. For each suffix, create key = suffix + "|" + prefix (where prefix is the full word)
3. Store the maximum index for each key (since we want highest index)
4. To query, simply look up suff + "|" + pref in the hash map

**Space-time tradeoff:** We're using O(n × L²) space where L is maximum word length, but queries become O(1) time. Since L ≤ 10 and n ≤ 10⁴, O(n × L²) = O(10⁴ × 100) = O(10⁶) is acceptable.

## Optimal Solution

Here's the complete implementation using the suffix+prefix combination approach:

<div class="code-group">

```python
class WordFilter:
    # Time: O(N * L^2) for initialization, O(1) for queries
    # Space: O(N * L^2) where N = number of words, L = max word length
    def __init__(self, words):
        """
        Initialize the WordFilter with given words.
        Preprocess all possible suffix+prefix combinations.
        """
        self.lookup = {}

        # Process each word with its index
        for idx, word in enumerate(words):
            length = len(word)

            # Generate all possible suffixes (including empty suffix)
            for suffix_end in range(length + 1):
                suffix = word[suffix_end:]  # Get suffix from suffix_end to end

                # Generate all possible prefixes (including empty prefix)
                for prefix_start in range(length + 1):
                    prefix = word[:prefix_start]  # Get prefix from start to prefix_start

                    # Create key: suffix + "|" + prefix
                    key = f"{suffix}|{prefix}"

                    # Store the highest index for this key
                    self.lookup[key] = idx

    def f(self, pref, suff):
        """
        Return the index of word with given prefix and suffix.
        Returns -1 if no such word exists.
        """
        # Create the lookup key
        key = f"{suff}|{pref}"

        # Return the index or -1 if not found
        return self.lookup.get(key, -1)
```

```javascript
class WordFilter {
  // Time: O(N * L^2) for initialization, O(1) for queries
  // Space: O(N * L^2) where N = number of words, L = max word length
  constructor(words) {
    /**
     * Initialize the WordFilter with given words.
     * Preprocess all possible suffix+prefix combinations.
     */
    this.lookup = new Map();

    // Process each word with its index
    for (let idx = 0; idx < words.length; idx++) {
      const word = words[idx];
      const length = word.length;

      // Generate all possible suffixes (including empty suffix)
      for (let suffixEnd = 0; suffixEnd <= length; suffixEnd++) {
        const suffix = word.substring(suffixEnd); // Get suffix from suffixEnd to end

        // Generate all possible prefixes (including empty prefix)
        for (let prefixStart = 0; prefixStart <= length; prefixStart++) {
          const prefix = word.substring(0, prefixStart); // Get prefix from start to prefixStart

          // Create key: suffix + "|" + prefix
          const key = `${suffix}|${prefix}`;

          // Store the highest index for this key (later words have higher indices)
          this.lookup.set(key, idx);
        }
      }
    }
  }

  f(pref, suff) {
    /**
     * Return the index of word with given prefix and suffix.
     * Returns -1 if no such word exists.
     */
    // Create the lookup key
    const key = `${suff}|${pref}`;

    // Return the index or -1 if not found
    return this.lookup.get(key) ?? -1;
  }
}
```

```java
class WordFilter {
    // Time: O(N * L^2) for initialization, O(1) for queries
    // Space: O(N * L^2) where N = number of words, L = max word length
    private Map<String, Integer> lookup;

    public WordFilter(String[] words) {
        /**
         * Initialize the WordFilter with given words.
         * Preprocess all possible suffix+prefix combinations.
         */
        lookup = new HashMap<>();

        // Process each word with its index
        for (int idx = 0; idx < words.length; idx++) {
            String word = words[idx];
            int length = word.length();

            // Generate all possible suffixes (including empty suffix)
            for (int suffixEnd = 0; suffixEnd <= length; suffixEnd++) {
                String suffix = word.substring(suffixEnd);  // Get suffix from suffixEnd to end

                // Generate all possible prefixes (including empty prefix)
                for (int prefixStart = 0; prefixStart <= length; prefixStart++) {
                    String prefix = word.substring(0, prefixStart);  // Get prefix from start to prefixStart

                    // Create key: suffix + "|" + prefix
                    String key = suffix + "|" + prefix;

                    // Store the highest index for this key
                    lookup.put(key, idx);
                }
            }
        }
    }

    public int f(String pref, String suff) {
        /**
         * Return the index of word with given prefix and suffix.
         * Returns -1 if no such word exists.
         */
        // Create the lookup key
        String key = suff + "|" + pref;

        // Return the index or -1 if not found
        return lookup.getOrDefault(key, -1);
    }
}
```

</div>

## Complexity Analysis

**Initialization Time:** O(N × L²) where N is number of words and L is maximum word length. For each word, we generate O(L²) combinations (all possible suffix × prefix pairs).

**Query Time:** O(1) for hash map lookup. We just construct the key and look it up.

**Space Complexity:** O(N × L²) to store all possible combinations in the hash map. Each word generates (L+1) × (L+1) = O(L²) keys.

**Why this is acceptable:** Constraints say words have at most 10 characters, so L ≤ 10. With N ≤ 10⁴, worst-case space is 10⁴ × 10² = 10⁶ entries, which is manageable.

## Common Mistakes

1. **Forgetting to include empty prefix/suffix:** The problem doesn't specify that prefix or suffix must be non-empty. You must handle cases like `f("", "ing")` or `f("pre", "")`. Our solution handles this by generating prefixes/suffixes from length 0 to L inclusive.

2. **Not storing the highest index:** If multiple words have the same prefix-suffix combination, we need the word with highest index. Our solution automatically handles this by processing words in order and overwriting with later (higher) indices.

3. **Using the wrong separator:** If you use a separator that could appear in words (like a letter), you might get false matches. Using "|" is safe since it's not a valid character in the input words.

4. **Inefficient trie approach:** Some candidates try to build two tries (one forward, one backward) and intersect results. This requires comparing all words from both tries, which can be O(N²) in worst case when many words match the prefix or suffix.

## When You'll See This Pattern

This "precompute all combinations" pattern appears in problems where:

1. Queries need to check multiple conditions simultaneously
2. The search space for precomputation is manageable
3. You need faster than linear query time

**Related problems:**

- **Design Add and Search Words Data Structure (LeetCode 211):** Also uses preprocessing (trie) to enable efficient word searches with wildcards.
- **Two Sum (LeetCode 1):** Uses hash map precomputation to answer "find pair summing to target" queries in O(1) time.
- **Maximum XOR of Two Numbers in an Array (LeetCode 421):** Preprocesses numbers into a trie to answer maximum XOR queries efficiently.

## Key Takeaways

1. **When O(1) queries are needed, consider precomputing all possible queries** if the search space is reasonable. The tradeoff between initialization time and query time is crucial.

2. **Combining multiple search criteria into a single key** is a powerful technique. By creating composite keys (like "suffix|prefix"), you can use simple hash maps for complex queries.

3. **Always check constraints** to determine what's feasible. Here, L ≤ 10 made O(N × L²) preprocessing acceptable. With longer words, a different approach would be needed.

Related problems: [Design Add and Search Words Data Structure](/problem/design-add-and-search-words-data-structure)
