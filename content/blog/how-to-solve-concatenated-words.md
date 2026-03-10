---
title: "How to Solve Concatenated Words — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Concatenated Words. Hard difficulty, 49.7% acceptance rate. Topics: Array, String, Dynamic Programming, Depth-First Search, Trie."
date: "2028-03-28"
category: "dsa-patterns"
tags: ["concatenated-words", "array", "string", "dynamic-programming", "hard"]
---

# How to Solve Concatenated Words

This problem asks us to find all words in a given list that can be formed by concatenating two or more other words from the same list. What makes this problem particularly interesting is that we need to check each word against all possible combinations of other words, and the same word can appear multiple times in a concatenation. The challenge lies in doing this efficiently for potentially large inputs.

## Visual Walkthrough

Let's trace through a concrete example: `words = ["cat","cats","dog","catsdog","dogcat","dogcatfish"]`

We need to find which words can be built from other words in the list:

- "cat" - cannot be built from other words (it's the shortest)
- "cats" - can be built as "cat" + "s", but "s" isn't in our list
- "dog" - cannot be built from other words
- "catsdog" - can be built as "cats" + "dog" (both in our list)
- "dogcat" - can be built as "dog" + "cat" (both in our list)
- "dogcatfish" - can be built as "dog" + "cat" + "fish", but "fish" isn't in our list

So the concatenated words are: `["catsdog","dogcat"]`

The key insight is that checking if a word can be broken into other words is exactly the **Word Break** problem! For each word, we need to determine if it can be segmented into other words from our list.

## Brute Force Approach

A naive approach would be: for each word, try all possible ways to split it into substrings and check if all those substrings exist in our word list. We could use recursion to try every possible split point.

The problem with this brute force approach is the exponential time complexity. For a word of length `n`, there are `2^(n-1)` possible ways to split it (each position between characters can either be a split point or not). With `m` words, this becomes `O(m * 2^n)` which is far too slow for the constraints.

Even with memoization, we'd still be doing redundant work across different words. We need a more systematic approach.

## Optimized Approach

The key insight is that we can solve this using **dynamic programming** similar to the Word Break problem, but with an important optimization: we should process words in increasing order of length.

Here's the step-by-step reasoning:

1. **Sort words by length**: Shorter words can't be built from longer words, so if we process from shortest to longest, we can build a dictionary of valid words as we go.

2. **Use a set for fast lookup**: As we process each word, we check if it can be broken into words that we've already seen (and therefore added to our set).

3. **DP approach for word break**: For each candidate word, we use a DP array where `dp[i]` is `True` if the first `i` characters can be segmented into words from our set. We initialize `dp[0] = True` (empty string is always valid).

4. **Check for at least two words**: Since a concatenated word must be made of at least two shorter words, we need to ensure our DP check requires at least two segments.

The algorithm works like this:

- Sort the words by length
- Initialize an empty set to store valid words
- For each word in sorted order:
  - If the word can be broken into words from our set (using DP), add it to results
  - Always add the word to our set (for future checks)
- Return the results

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * L^2) where n is number of words, L is max word length
# Space: O(n) for the word set and results
def findAllConcatenatedWordsInADict(words):
    # Sort words by length so shorter words are processed first
    # This ensures we only check against words we've already seen
    words.sort(key=len)

    # Set to store words we've processed - these are potential building blocks
    word_set = set()

    # List to store our results
    result = []

    # Process each word in order of increasing length
    for word in words:
        # Skip empty strings (though problem guarantees non-empty)
        if not word:
            continue

        # DP array: dp[i] = True if first i characters can be segmented
        # Initialize with False, except dp[0] = True (empty string)
        n = len(word)
        dp = [False] * (n + 1)
        dp[0] = True

        # Check all possible segmentations
        for i in range(1, n + 1):
            # We need at least 2 segments for a concatenated word
            # The limit (i if i == n else i) ensures we don't count the word itself
            # as a single segment when checking
            for j in range(0 if i == n else 0, i):
                # If prefix up to j is valid and substring j:i is in our set
                if dp[j] and word[j:i] in word_set:
                    dp[i] = True
                    break  # No need to check other j values

        # If the entire word can be segmented (and it's not just itself)
        if dp[n] and n > 0:
            result.append(word)

        # Always add current word to set for future checks
        word_set.add(word)

    return result
```

```javascript
// Time: O(n * L^2) where n is number of words, L is max word length
// Space: O(n) for the word set and results
function findAllConcatenatedWordsInADict(words) {
  // Sort words by length so shorter words are processed first
  words.sort((a, b) => a.length - b.length);

  // Set to store words we've processed - these are potential building blocks
  const wordSet = new Set();

  // Array to store our results
  const result = [];

  // Process each word in order of increasing length
  for (const word of words) {
    // Skip empty strings (though problem guarantees non-empty)
    if (!word) continue;

    const n = word.length;
    // DP array: dp[i] = true if first i characters can be segmented
    // Initialize with false, except dp[0] = true (empty string)
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;

    // Check all possible segmentations
    for (let i = 1; i <= n; i++) {
      // We need at least 2 segments for a concatenated word
      // Start j from 0, but when i == n (checking entire word),
      // we need to ensure we don't count the word itself as a single segment
      const startJ = i === n ? 1 : 0;

      for (let j = startJ; j < i; j++) {
        // If prefix up to j is valid and substring j:i is in our set
        if (dp[j] && wordSet.has(word.substring(j, i))) {
          dp[i] = true;
          break; // No need to check other j values
        }
      }
    }

    // If the entire word can be segmented
    if (dp[n] && n > 0) {
      result.push(word);
    }

    // Always add current word to set for future checks
    wordSet.add(word);
  }

  return result;
}
```

```java
// Time: O(n * L^2) where n is number of words, L is max word length
// Space: O(n) for the word set and results
import java.util.*;

public List<String> findAllConcatenatedWordsInADict(String[] words) {
    // Sort words by length so shorter words are processed first
    Arrays.sort(words, (a, b) -> a.length() - b.length());

    // Set to store words we've processed - these are potential building blocks
    Set<String> wordSet = new HashSet<>();

    // List to store our results
    List<String> result = new ArrayList<>();

    // Process each word in order of increasing length
    for (String word : words) {
        // Skip empty strings (though problem guarantees non-empty)
        if (word.isEmpty()) continue;

        int n = word.length();
        // DP array: dp[i] = true if first i characters can be segmented
        // Initialize with false, except dp[0] = true (empty string)
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;

        // Check all possible segmentations
        for (int i = 1; i <= n; i++) {
            // We need at least 2 segments for a concatenated word
            // Start j from 0, but when i == n (checking entire word),
            // we need to ensure we don't count the word itself as a single segment
            int startJ = (i == n) ? 1 : 0;

            for (int j = startJ; j < i; j++) {
                // If prefix up to j is valid and substring j:i is in our set
                if (dp[j] && wordSet.contains(word.substring(j, i))) {
                    dp[i] = true;
                    break; // No need to check other j values
                }
            }
        }

        // If the entire word can be segmented
        if (dp[n] && n > 0) {
            result.add(word);
        }

        // Always add current word to set for future checks
        wordSet.add(word);
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n \* L²)**

- Sorting takes O(n log n) time
- For each of the n words, we run a DP check that takes O(L²) time in the worst case, where L is the length of the word
- The nested loops in DP: outer loop runs L times, inner loop runs up to L times
- Total: O(n log n + n _ L²) = O(n _ L²) since L² typically dominates log n

**Space Complexity: O(n)**

- We store all words in a set: O(n) space
- The DP array for each word: O(L) space, but this is temporary and doesn't accumulate
- Result list: O(k) where k is number of concatenated words (≤ n)
- Total: O(n) space

## Common Mistakes

1. **Not sorting by length**: If you don't process words from shortest to longest, you might incorrectly identify a word as concatenated when it's actually built from longer words that haven't been processed yet.

2. **Forgetting to require at least two segments**: The problem specifies "at least two shorter words." If you allow a word to match itself as a single segment, you'll get incorrect results. This is why we use `startJ = (i == n) ? 1 : 0` in the inner loop.

3. **Inefficient substring lookups**: Using list containment checks (O(n)) instead of set lookups (O(1)) for checking if a substring exists in our dictionary. This turns O(n _ L²) into O(n² _ L²).

4. **Not handling empty strings**: While the problem guarantees non-empty words, it's good practice to check. An empty string can't be a concatenated word.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Word Break DP Pattern**: The core DP approach for checking if a string can be segmented into dictionary words appears in:
   - **Word Break (LeetCode 139)**: Simpler version - just check if segmentation is possible
   - **Word Break II (LeetCode 140)**: Harder version - find all possible segmentations

2. **Build-up Pattern**: Processing items in sorted order and building a solution incrementally appears in:
   - **Longest Increasing Subsequence**: Build DP solution by considering elements in order
   - **Russian Doll Envelopes**: Sort first, then apply LIS-like logic

The key insight is recognizing that concatenated word checking is essentially multiple Word Break problems, optimized by processing in length order.

## Key Takeaways

1. **When you need to check if A can be built from B, C, D...**: Consider sorting by some criterion (length, size, etc.) so you only check against already-processed items.

2. **Word segmentation problems often use DP**: The `dp[i] = OR(dp[j] AND dict.contains(s[j:i]))` pattern is worth memorizing for string segmentation problems.

3. **Pay attention to "at least two" constraints**: These often require tweaking the base case or loop boundaries in your DP solution.

Related problems: [Word Break II](/problem/word-break-ii)
