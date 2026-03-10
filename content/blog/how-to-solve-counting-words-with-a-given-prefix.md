---
title: "How to Solve Counting Words With a Given Prefix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Counting Words With a Given Prefix. Easy difficulty, 84.5% acceptance rate. Topics: Array, String, String Matching."
date: "2028-01-07"
category: "dsa-patterns"
tags: ["counting-words-with-a-given-prefix", "array", "string", "string-matching", "easy"]
---

# How to Solve Counting Words With a Given Prefix

This problem asks us to count how many strings in an array contain a given prefix. While conceptually straightforward, it tests your understanding of string operations, boundary conditions, and efficient iteration. The interesting part is recognizing that we need to check if the prefix appears at the **beginning** of each word, not anywhere within it.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
words = ["apple", "application", "apricot", "banana", "apartment"]
pref = "ap"
```

**Step-by-step process:**

1. Check "apple": Does "ap" appear at the beginning? Yes → count = 1
2. Check "application": Does "ap" appear at the beginning? Yes → count = 2
3. Check "apricot": Does "ap" appear at the beginning? Yes → count = 3
4. Check "banana": Does "ap" appear at the beginning? No → count remains 3
5. Check "apartment": Does "ap" appear at the beginning? Yes → count = 4

**Result:** 4

The key insight is that we need to check if `pref` matches the first `len(pref)` characters of each word. If the word is shorter than the prefix, it can't possibly contain the prefix.

## Brute Force Approach

The most straightforward approach is to iterate through each word and check if it starts with the given prefix. While this is actually the optimal approach for this problem, let's consider what a truly naive implementation might look like:

A naive candidate might try to check if the prefix appears **anywhere** in the word (not just at the beginning), or they might use substring operations inefficiently. The correct brute force approach is simply:

1. Initialize a counter to 0
2. For each word in the array:
   - If the word is shorter than the prefix, skip it
   - Compare the first `len(pref)` characters of the word with `pref`
   - If they match, increment the counter
3. Return the counter

This approach is already optimal because we must examine each word at least once, and string comparison is O(k) where k is the length of the prefix.

## Optimal Solution

The optimal solution uses a simple linear scan through the array. For each word, we check if it starts with the given prefix using built-in string methods or manual comparison. The time complexity is O(n \* k) where n is the number of words and k is the length of the prefix.

<div class="code-group">

```python
# Time: O(n * k) where n = len(words), k = len(pref)
# Space: O(1) - we only use a constant amount of extra space
def prefixCount(words, pref):
    """
    Counts how many words in the array start with the given prefix.

    Args:
    words: List of strings to check
    pref: The prefix to search for

    Returns:
    Integer count of words starting with the prefix
    """
    count = 0  # Initialize counter

    # Iterate through each word in the array
    for word in words:
        # Check if the word starts with the prefix
        # The startswith() method handles edge cases like word being shorter than pref
        if word.startswith(pref):
            count += 1  # Increment counter if prefix matches

    return count  # Return final count
```

```javascript
// Time: O(n * k) where n = words.length, k = pref.length
// Space: O(1) - constant extra space
function prefixCount(words, pref) {
  /**
   * Counts how many words in the array start with the given prefix.
   *
   * @param {string[]} words - Array of strings to check
   * @param {string} pref - The prefix to search for
   * @return {number} Count of words starting with the prefix
   */
  let count = 0; // Initialize counter

  // Iterate through each word in the array
  for (let word of words) {
    // Check if the word starts with the prefix
    // startsWith() returns true if word begins with pref
    if (word.startsWith(pref)) {
      count++; // Increment counter if prefix matches
    }
  }

  return count; // Return final count
}
```

```java
// Time: O(n * k) where n = words.length, k = pref.length
// Space: O(1) - constant extra space
class Solution {
    public int prefixCount(String[] words, String pref) {
        /**
         * Counts how many words in the array start with the given prefix.
         *
         * @param words Array of strings to check
         * @param pref The prefix to search for
         * @return Count of words starting with the prefix
         */
        int count = 0;  // Initialize counter

        // Iterate through each word in the array
        for (String word : words) {
            // Check if the word starts with the prefix
            // startsWith() returns true if word begins with pref
            if (word.startsWith(pref)) {
                count++;  // Increment counter if prefix matches
            }
        }

        return count;  // Return final count
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n \* k)

- We iterate through all n words in the array
- For each word, we compare up to k characters (where k is the length of the prefix)
- In the worst case, we examine k characters for each of n words

**Space Complexity:** O(1)

- We only use a constant amount of extra space (the counter variable)
- No additional data structures are created that scale with input size

**Why this is optimal:**

- We must examine each word at least once → Ω(n) lower bound
- We must compare characters to verify the prefix → Ω(k) per word in worst case
- Therefore, O(n \* k) is the best we can do for this problem

## Common Mistakes

1. **Checking if prefix appears anywhere in the word, not just at the beginning:**
   - Mistake: Using `if pref in word:` instead of `word.startswith(pref)`
   - Solution: Remember that a prefix must be at the beginning of the string

2. **Not handling words shorter than the prefix:**
   - Mistake: Trying to access characters beyond the word's length when doing manual comparison
   - Solution: Always check word length before comparison, or use built-in methods that handle this automatically

3. **Off-by-one errors in manual substring comparison:**
   - Mistake: `word.substring(0, pref.length())` when `pref.length()` might be greater than `word.length()`
   - Solution: Use built-in `startsWith()` method which handles edge cases, or add a length check first

4. **Case sensitivity issues:**
   - Mistake: Forgetting that string comparison is case-sensitive by default
   - Solution: Convert both strings to same case if case-insensitive matching is required (though not needed for this problem)

## When You'll See This Pattern

This pattern of checking prefixes appears in various string matching problems:

1. **Trie (Prefix Tree) Problems:** When you need to efficiently check prefixes for multiple queries, a Trie data structure becomes useful. Problems like [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/) build on this concept.

2. **Autocomplete Systems:** Problems involving search suggestions or autocomplete often use prefix matching as a core component.

3. **String Validation:** Checking if strings start with certain patterns is common in parsing and validation tasks.

4. **Related LeetCode Problems:**
   - [Check If a Word Occurs As a Prefix of Any Word in a Sentence](https://leetcode.com/problems/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence/) - Direct application of prefix checking
   - [Count Prefixes of a Given String](https://leetcode.com/problems/count-prefixes-of-a-given-string/) - Similar concept but reversed (checking if words are prefixes of a given string)

## Key Takeaways

1. **Understand the difference between prefix, suffix, and substring:** A prefix must appear at the beginning of a string. This distinction is crucial for string matching problems.

2. **Built-in string methods are your friends:** Methods like `startswith()` (Python), `startsWith()` (Java/JavaScript) handle edge cases like empty strings or words shorter than the prefix automatically.

3. **When to optimize:** For single-query prefix checking, linear scan is optimal. For multiple queries on the same word list, consider preprocessing with a Trie data structure to achieve O(k) per query instead of O(n \* k).

4. **Edge cases matter:** Always consider empty arrays, empty strings, words shorter than the prefix, and identical strings.

Related problems: [Check If a Word Occurs As a Prefix of Any Word in a Sentence](/problem/check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence), [Count Prefixes of a Given String](/problem/count-prefixes-of-a-given-string)
