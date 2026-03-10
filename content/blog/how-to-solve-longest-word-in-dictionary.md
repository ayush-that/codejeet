---
title: "How to Solve Longest Word in Dictionary — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Word in Dictionary. Medium difficulty, 54.5% acceptance rate. Topics: Array, Hash Table, String, Trie, Sorting."
date: "2026-02-26"
category: "dsa-patterns"
tags: ["longest-word-in-dictionary", "array", "hash-table", "string", "medium"]
---

# How to Solve Longest Word in Dictionary

This problem asks us to find the longest word in a dictionary that can be built one character at a time using other words from the same dictionary. For example, if we have "app" and "apple", then "apple" qualifies because we can build it as: "a" → "ap" → "app" → "appl" → "apple", provided all those prefixes exist in the dictionary. The tricky part is that we need to check every prefix of a candidate word, not just the immediate predecessor, and we must handle tie-breakers where multiple words have the same maximum length.

## Visual Walkthrough

Let's trace through an example: `words = ["a", "banana", "app", "appl", "ap", "apply", "apple"]`

We need to find words where every prefix exists in the dictionary:

- "a": Prefix "a" exists? Yes (the word itself). Valid.
- "ap": Prefixes "a" and "ap" must exist. "a" exists, "ap" exists. Valid.
- "app": Prefixes "a", "ap", "app" all exist. Valid.
- "appl": Prefixes "a", "ap", "app", "appl" all exist. Valid.
- "apple": Prefixes "a", "ap", "app", "appl", "apple" all exist. Valid.
- "apply": Prefixes "a", "ap", "app", "appl", "apply" all exist. Valid.
- "banana": Prefixes "b", "ba", "ban", "bana", "banan", "banana". "b" doesn't exist. Invalid.

Now we have valid words: "a", "ap", "app", "appl", "apple", "apply". The longest are "apple" and "apply" (both length 5). Since there's a tie, we return the lexicographically smallest: "apple".

The key insight: We need an efficient way to check if all prefixes of a word exist. A brute force approach would check each prefix individually for each word, but we can do better by sorting and using a set or building a trie.

## Brute Force Approach

A naive approach would be:

1. For each word in the dictionary
2. For each prefix of that word (from length 1 to len(word)-1)
3. Check if that prefix exists in the dictionary
4. If all prefixes exist, track it as a candidate
5. Finally, pick the longest candidate with smallest lex order

This approach is O(N _ L²) where N is number of words and L is average length, because for each word of length L, we check up to L prefixes, and each prefix check could be O(L) if we use string comparison. Even with a hash set for O(1) lookups, it's still O(N _ L) for the prefix checks.

The main inefficiency is that we're doing redundant work. If we process words in increasing length order, once we know "app" is valid, we don't need to re-check all its prefixes when evaluating "apple" - we just need to check if "appl" exists and if "app" was already marked valid.

## Optimized Approach

The optimal insight: **Process words in order of increasing length, and only consider words whose immediate prefix (word without last character) is already valid.**

Here's the step-by-step reasoning:

1. Sort the words by length, then by lexicographical order (for tie-breaking)
2. Use a set to track valid words we've found so far
3. Start by adding the empty string "" to the valid set (base case)
4. For each word in sorted order:
   - Check if its prefix (word without last character) exists in the valid set
   - If yes, add this word to the valid set and track it as a candidate answer
5. Keep updating the answer as we find longer valid words

Why does this work? By processing in increasing length order and checking only the immediate prefix, we ensure all shorter prefixes have already been validated. If "apple" is built from "appl", and "appl" is in the valid set, then we know all prefixes of "appl" were already validated when we added it.

Alternative approach: Use a **trie** data structure. Insert all words into a trie, then DFS through the trie to find the deepest node where every node from root to that node represents a complete word. This is more complex but has the same time complexity.

## Optimal Solution

Here's the sorting + set approach, which is cleaner for this problem:

<div class="code-group">

```python
# Time: O(N * L log N) for sorting + O(N * L) for processing = O(N * L log N)
# Space: O(N * L) for the set storing all words
def longestWord(words):
    # Sort words: first by length (ascending), then lexicographically (ascending)
    # This ensures we process shorter words first and handle tie-breakers correctly
    words.sort(key=lambda x: (-len(x), x))

    # Create a set of valid words we can build
    valid = set()
    # Add empty string as base case - any single character word can be built from it
    valid.add("")

    # Track the best answer found so far
    answer = ""

    # Process each word
    for word in words:
        # Check if the prefix (word without last character) is already valid
        if word[:-1] in valid:
            # All prefixes are valid, so this word is valid
            valid.add(word)
            # Update answer if this word is longer OR same length but lexicographically smaller
            if len(word) > len(answer) or (len(word) == len(answer) and word < answer):
                answer = word

    return answer
```

```javascript
// Time: O(N * L log N) for sorting + O(N * L) for processing = O(N * L log N)
// Space: O(N * L) for the set storing all words
function longestWord(words) {
  // Sort words: first by length (descending), then lexicographically (ascending)
  // We sort descending so we can process longer words first and break early
  words.sort((a, b) => {
    if (a.length !== b.length) {
      return b.length - a.length; // Longer words first
    }
    return a.localeCompare(b); // Lexicographically ascending
  });

  // Create a set of valid words we can build
  const valid = new Set();
  // Add empty string as base case
  valid.add("");

  // Track the best answer found so far
  let answer = "";

  // Process each word
  for (const word of words) {
    // Check if the prefix (word without last character) is already valid
    const prefix = word.slice(0, -1);
    if (valid.has(prefix)) {
      // All prefixes are valid, so this word is valid
      valid.add(word);
      // Update answer if this word is longer OR same length but lexicographically smaller
      if (word.length > answer.length || (word.length === answer.length && word < answer)) {
        answer = word;
      }
    }
  }

  return answer;
}
```

```java
// Time: O(N * L log N) for sorting + O(N * L) for processing = O(N * L log N)
// Space: O(N * L) for the set storing all words
import java.util.*;

class Solution {
    public String longestWord(String[] words) {
        // Sort words: first by length (descending), then lexicographically (ascending)
        Arrays.sort(words, (a, b) -> {
            if (a.length() != b.length()) {
                return b.length() - a.length(); // Longer words first
            }
            return a.compareTo(b); // Lexicographically ascending
        });

        // Create a set of valid words we can build
        Set<String> valid = new HashSet<>();
        // Add empty string as base case
        valid.add("");

        // Track the best answer found so far
        String answer = "";

        // Process each word
        for (String word : words) {
            // Check if the prefix (word without last character) is already valid
            String prefix = word.substring(0, word.length() - 1);
            if (valid.contains(prefix)) {
                // All prefixes are valid, so this word is valid
                valid.add(word);
                // Update answer if this word is longer OR same length but lexicographically smaller
                if (word.length() > answer.length() ||
                    (word.length() == answer.length() && word.compareTo(answer) < 0)) {
                    answer = word;
                }
            }
        }

        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(N _ L log N) where N is the number of words and L is the average word length. The dominant factor is sorting the words, which takes O(N log N) comparisons, and each comparison takes O(L) time for string comparison. The processing phase takes O(N _ L) since we check each word's prefix (O(L) operation) and perform set operations (O(1) average case).

**Space Complexity:** O(N \* L) for storing all words in the hash set. In the worst case, all words might be valid and stored in the set.

## Common Mistakes

1. **Not sorting correctly for tie-breaking**: If you only sort by length, you might return "apply" instead of "apple" when both are valid. Always include lexicographical order in your sort or in your answer selection logic.

2. **Forgetting the base case**: Without adding the empty string to the valid set, single-character words won't be recognized as valid because they have no prefix (other than "").

3. **Checking all prefixes instead of just the immediate one**: Some candidates check every prefix of each word, which is O(L²) per word. The optimization comes from realizing that if the immediate prefix is valid, then all shorter prefixes were already validated when that prefix was added.

4. **Processing words in random order**: If you don't process words in increasing length order, you might miss valid words. For example, if "apple" comes before "app" in the input, you won't recognize "apple" as valid because "app" isn't in the valid set yet.

## When You'll See This Pattern

This problem uses **progressive validation with a set/trie** - building up solutions from smaller valid pieces. You'll see similar patterns in:

1. **Word Break (LeetCode 139)**: Check if a string can be segmented into dictionary words. The DP solution builds up validity from prefixes.

2. **Longest Increasing Subsequence (LeetCode 300)**: Build the longest sequence where each element is larger than the previous.

3. **Longest Word With All Prefixes (LeetCode 1858)**: Almost identical problem - find the longest word where every prefix exists in the dictionary.

The core idea is to use previously computed results (memoization) to avoid redundant work, often implemented with dynamic programming or incremental validation.

## Key Takeaways

1. **When a problem involves building something step-by-step where each step must be valid**, consider sorting by size/length and building up incrementally.

2. **For dictionary/prefix problems**, always consider a trie or hash set. A hash set is simpler for existence checks; a trie is better when you need to traverse prefixes.

3. **Always handle tie-breakers explicitly** - don't assume the first answer you find is correct when multiple answers meet the primary criteria.

Related problems: [Longest Word in Dictionary through Deleting](/problem/longest-word-in-dictionary-through-deleting), [Implement Magic Dictionary](/problem/implement-magic-dictionary), [Longest Word With All Prefixes](/problem/longest-word-with-all-prefixes)
