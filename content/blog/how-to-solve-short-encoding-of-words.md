---
title: "How to Solve Short Encoding of Words — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Short Encoding of Words. Medium difficulty, 60.8% acceptance rate. Topics: Array, Hash Table, String, Trie."
date: "2027-05-11"
category: "dsa-patterns"
tags: ["short-encoding-of-words", "array", "hash-table", "string", "medium"]
---

# How to Solve Short Encoding of Words

This problem asks us to find the shortest possible reference string that can encode all given words, where each word appears as a substring ending at the `#` character. The tricky part is that if one word is a suffix of another, we can encode them together using the longer word. For example, "time" and "me" can both be encoded in "time#" since "me" is a suffix of "time". This suffix relationship is the key insight needed for an efficient solution.

## Visual Walkthrough

Let's trace through an example: `words = ["time", "me", "bell"]`

**Step 1:** We need to find which words are suffixes of other words

- "me" is a suffix of "time" (time ends with "me")
- "time" is NOT a suffix of "me" (me is shorter)
- "bell" is not a suffix of any other word, and no other word is its suffix

**Step 2:** Remove words that are suffixes of other words

- Since "me" is a suffix of "time", we can remove "me"
- We're left with "time" and "bell"

**Step 3:** Calculate the minimum encoding length

- Each remaining word needs its own `#` marker
- "time" → "time#" (length 5)
- "bell" → "bell#" (length 5)
- Total: 5 + 5 = 10

**Step 4:** Verify the encoding works

- Reference string: "time#bell#"
- "time" starts at index 0
- "me" starts at index 2 (and is contained within "time")
- "bell" starts at index 5
- All words are properly encoded

The key insight: **A word can be removed from our count if it's a suffix of another word in the list.**

## Brute Force Approach

A naive approach would be to check every pair of words to see if one is a suffix of another:

1. For each word in the list
2. For every other word in the list
3. Check if the current word ends with the other word (or vice versa)
4. Keep track of which words are suffixes of others
5. Sum the lengths of non-suffix words plus 1 for each (for the `#`)

The problem with this approach is its time complexity: O(n² × L) where n is the number of words and L is the average word length. For large inputs (up to 2000 words of length up to 7), this could be up to 2000² × 7 ≈ 28 million operations, which might be borderline acceptable but not optimal.

More importantly, this approach has a subtle flaw: we need to be careful about the order of checking. If word A is a suffix of word B, and word B is a suffix of word C, we need to ensure we only count word C. The brute force approach requires careful bookkeeping to handle these chain relationships.

## Optimized Approach

The key insight for optimization is that **suffix checking is easier if we reverse the words**. When we reverse "time" and "me", we get "emit" and "em". Now instead of checking if one string ends with another, we check if one string starts with another - which is exactly what a trie (prefix tree) is designed for!

Here's the step-by-step reasoning:

1. **Reverse all words** - This transforms suffix relationships into prefix relationships
2. **Sort the reversed words** - This ensures that if word A is a prefix of word B, A will come before B when sorted alphabetically
3. **Build the answer incrementally** - Process words in sorted order, adding the full length of a word only if it's not a prefix of the previous word

Why does sorting help? When words are sorted:

- If "em" (reversed "me") comes before "emit" (reversed "time") in sorted order
- And "emit" starts with "em"
- Then we know "me" is a suffix of "time" and shouldn't be counted separately

Alternative approach using a set:

1. Add all words to a set
2. Remove all words that have suffixes in the set
3. Sum the lengths of remaining words + 1 for each

The set approach is simpler to implement and has good performance characteristics.

## Optimal Solution

Here's the optimal solution using a hash set to efficiently remove words that are suffixes of other words:

<div class="code-group">

```python
# Time: O(n * L) where n = number of words, L = max word length
# Space: O(n * L) for storing all words in the set
def minimumLengthEncoding(words):
    # Step 1: Convert to set to remove duplicates and enable O(1) lookups
    word_set = set(words)

    # Step 2: For each word, remove all its suffixes from the set
    # We check every possible suffix of each word (excluding the full word itself)
    for word in list(word_set):  # Use list() to avoid modifying set while iterating
        # Check all suffixes of this word
        # Start from index 1 to exclude the full word itself
        for i in range(1, len(word)):
            suffix = word[i:]  # Get suffix starting at position i
            if suffix in word_set:
                word_set.remove(suffix)  # Remove the suffix since it's covered

    # Step 3: Calculate total length
    # Each remaining word needs its own '#' character
    total_length = 0
    for word in word_set:
        total_length += len(word) + 1  # +1 for the '#' character

    return total_length
```

```javascript
// Time: O(n * L) where n = number of words, L = max word length
// Space: O(n * L) for storing all words in the set
function minimumLengthEncoding(words) {
  // Step 1: Convert to set to remove duplicates and enable O(1) lookups
  const wordSet = new Set(words);

  // Step 2: For each word, remove all its suffixes from the set
  // We need to convert to array first to avoid modifying set while iterating
  const wordsArray = Array.from(wordSet);

  for (const word of wordsArray) {
    // Check all suffixes of this word
    // Start from index 1 to exclude the full word itself
    for (let i = 1; i < word.length; i++) {
      const suffix = word.substring(i); // Get suffix starting at position i
      if (wordSet.has(suffix)) {
        wordSet.delete(suffix); // Remove the suffix since it's covered
      }
    }
  }

  // Step 3: Calculate total length
  // Each remaining word needs its own '#' character
  let totalLength = 0;
  for (const word of wordSet) {
    totalLength += word.length + 1; // +1 for the '#' character
  }

  return totalLength;
}
```

```java
// Time: O(n * L) where n = number of words, L = max word length
// Space: O(n * L) for storing all words in the set
class Solution {
    public int minimumLengthEncoding(String[] words) {
        // Step 1: Convert to set to remove duplicates and enable O(1) lookups
        Set<String> wordSet = new HashSet<>(Arrays.asList(words));

        // Step 2: For each word, remove all its suffixes from the set
        // Create a list to avoid ConcurrentModificationException
        List<String> wordList = new ArrayList<>(wordSet);

        for (String word : wordList) {
            // Check all suffixes of this word
            // Start from index 1 to exclude the full word itself
            for (int i = 1; i < word.length(); i++) {
                String suffix = word.substring(i);  // Get suffix starting at position i
                wordSet.remove(suffix);  // Remove if present (remove() is safe if not present)
            }
        }

        // Step 3: Calculate total length
        // Each remaining word needs its own '#' character
        int totalLength = 0;
        for (String word : wordSet) {
            totalLength += word.length() + 1;  // +1 for the '#' character
        }

        return totalLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × L)**

- `n` is the number of words
- `L` is the maximum length of any word
- We iterate through all words (n iterations)
- For each word, we check up to L-1 suffixes (in the worst case)
- Each set lookup/removal is O(1) on average
- Total: O(n × L)

**Space Complexity: O(n × L)**

- We store all words in a hash set
- In the worst case, all words are unique and not suffixes of each other
- Each word of length L takes O(L) space
- Total: O(n × L)

This is optimal since we need to at least examine each character of each word once to determine suffix relationships.

## Common Mistakes

1. **Not handling duplicate words correctly**: The problem doesn't explicitly say words are unique. Always deduplicate first, either by using a set or checking for duplicates. Our solution handles this automatically by using a set.

2. **Modifying a collection while iterating over it**: This causes runtime errors in most languages. Always create a copy (like `list(word_set)` in Python or `Array.from(wordSet)` in JavaScript) before iterating if you plan to modify the collection.

3. **Forgetting to add 1 for the '#' character**: Each encoded word needs the `#` character appended. A common mistake is to just sum word lengths without adding 1 for each word.

4. **Incorrect suffix checking order**: When checking if word A is a suffix of word B, you must check all possible starting positions. Some candidates only check if one word ends with another, forgetting that the suffix could start at any position (not just length difference).

5. **Not considering chain relationships**: If A is a suffix of B, and B is a suffix of C, we should only count C. The set approach naturally handles this because when we process C, we remove both A and B as suffixes.

## When You'll See This Pattern

This problem uses **suffix/prefix relationships** and **set-based filtering**, patterns that appear in several other problems:

1. **Longest Word in Dictionary (LeetCode 720)**: Find the longest word that can be built one letter at a time from other words in the dictionary. Similar prefix-checking logic using sets or tries.

2. **Replace Words (LeetCode 648)**: Replace words with their shortest root from a dictionary. Uses prefix checking with tries or hash sets.

3. **Word Search II (LeetCode 212)**: Find all words from a dictionary in a board. Uses trie for efficient prefix matching during DFS traversal.

4. **Implement Trie (Prefix Tree) (LeetCode 208)**: The fundamental data structure for efficient prefix/suffix operations.

The key pattern is: when you need to check if one string is contained within another (especially as prefix or suffix), consider reversing strings, using tries, or using hash sets with substring checking.

## Key Takeaways

1. **Transform the problem**: When dealing with suffix relationships, reversing strings converts them to prefix relationships, which are often easier to work with using standard data structures like tries.

2. **Use the right data structure for membership testing**: Hash sets provide O(1) lookups, making them ideal for checking if a substring exists in our collection. Tries are better when we need to check many prefix relationships.

3. **Watch for nested relationships**: When A is contained in B, and B is contained in C, we need algorithms that handle these transitive relationships correctly. Processing from longest to shortest or using elimination approaches (like our set removal) handles this well.

4. **Always consider edge cases**: Empty words, single-character words, duplicate words, and words that are prefixes/suffixes of themselves (like "a" in "abca") need special consideration.

[Practice this problem on CodeJeet](/problem/short-encoding-of-words)
