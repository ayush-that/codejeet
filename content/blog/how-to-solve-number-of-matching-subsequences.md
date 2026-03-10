---
title: "How to Solve Number of Matching Subsequences — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Matching Subsequences. Medium difficulty, 50.6% acceptance rate. Topics: Array, Hash Table, String, Binary Search, Dynamic Programming."
date: "2028-03-10"
category: "dsa-patterns"
tags: ["number-of-matching-subsequences", "array", "hash-table", "string", "medium"]
---

# How to Solve Number of Matching Subsequences

This problem asks: given a string `s` and an array of strings `words`, count how many words in the array are subsequences of `s`. A subsequence is formed by deleting some characters (possibly none) from the original string while maintaining the relative order of the remaining characters.

What makes this problem interesting is that while checking if a single word is a subsequence of `s` is straightforward (two-pointer approach, O(n) time), doing this for all words naively would be O(n × m) where n is length of `s` and m is total characters across all words. With `s` up to 5×10⁴ and `words` up to 5000 words of length up to 50, this could be up to 2.5×10⁶ operations, which might be acceptable but can be optimized further. The real challenge is when `s` is very long and we need to check many words against it repeatedly.

## Visual Walkthrough

Let's trace through an example to build intuition:

```
s = "abcde"
words = ["a", "bb", "acd", "ace"]
```

We need to check each word in `words` to see if it's a subsequence of `s`:

1. **"a"**: Check if "a" exists in "abcde" in order. We find 'a' at index 0. ✓
2. **"bb"**: Check if we can find two 'b's in order. We find first 'b' at index 1, but there's no second 'b' after index 1. ✗
3. **"acd"**: Find 'a' at index 0, then 'c' at index 2, then 'd' at index 3. All found in order. ✓
4. **"ace"**: Find 'a' at index 0, 'c' at index 2, 'e' at index 4. ✓

So the answer is 3.

The naive approach would check each word independently using two pointers. For "acd", we'd start with pointer `i` at word and `j` at s:

- Compare 'a' with s[0] = 'a': match, advance both pointers
- Compare 'c' with s[1] = 'b': no match, advance only s pointer
- Compare 'c' with s[2] = 'c': match, advance both
- Compare 'd' with s[3] = 'd': match, word fully matched

This works, but we're re-scanning `s` for each word. The key insight: since we're checking many words against the same `s`, we can preprocess `s` to make subsequence checks faster.

## Brute Force Approach

The most straightforward solution is to check each word individually using the standard two-pointer subsequence check:

1. For each word in `words`:
   - Initialize two pointers: `i` for the word, `j` for `s`
   - While both pointers are within bounds:
     - If characters match, advance both pointers
     - Otherwise, advance only the `s` pointer
   - If we reached the end of the word, it's a subsequence

This approach is simple and correct, but inefficient when we have many words. For each word of length `k`, we might scan all of `s` (length `n`), giving us O(n × total_chars_in_words) time complexity.

<div class="code-group">

```python
# Brute Force Solution
# Time: O(n × total_chars_in_words) where n = len(s)
# Space: O(1) excluding input storage
def numMatchingSubseq_brute(s, words):
    def is_subsequence(word, s):
        i, j = 0, 0
        while i < len(word) and j < len(s):
            if word[i] == s[j]:
                i += 1
            j += 1
        return i == len(word)

    count = 0
    for word in words:
        if is_subsequence(word, s):
            count += 1
    return count
```

```javascript
// Brute Force Solution
// Time: O(n × total_chars_in_words) where n = s.length
// Space: O(1) excluding input storage
function numMatchingSubseqBrute(s, words) {
  function isSubsequence(word, s) {
    let i = 0,
      j = 0;
    while (i < word.length && j < s.length) {
      if (word[i] === s[j]) {
        i++;
      }
      j++;
    }
    return i === word.length;
  }

  let count = 0;
  for (const word of words) {
    if (isSubsequence(word, s)) {
      count++;
    }
  }
  return count;
}
```

```java
// Brute Force Solution
// Time: O(n × total_chars_in_words) where n = s.length()
// Space: O(1) excluding input storage
public int numMatchingSubseqBrute(String s, String[] words) {
    int count = 0;
    for (String word : words) {
        if (isSubsequence(word, s)) {
            count++;
        }
    }
    return count;
}

private boolean isSubsequence(String word, String s) {
    int i = 0, j = 0;
    while (i < word.length() && j < s.length()) {
        if (word.charAt(i) == s.charAt(j)) {
            i++;
        }
        j++;
    }
    return i == word.length();
}
```

</div>

The problem with this approach is that we're repeatedly scanning `s` for each word. If `s` is long (up to 50,000 characters) and we have many words (up to 5000), this could mean up to 250 million character comparisons in the worst case.

## Optimized Approach

The key insight is that we don't need to rescan `s` from the beginning for each character of each word. Instead, we can:

1. **Preprocess `s`**: For each character 'a' to 'z', store a list of indices where that character appears in `s`, in sorted order.
2. **Check words efficiently**: For each word, instead of scanning `s` linearly, we can binary search in these index lists to find the next occurrence of each character after our current position in `s`.

Here's the step-by-step reasoning:

1. **Why binary search?** When checking if a word is a subsequence, we need to find each character of the word in `s` in order. If we know all positions where each character appears, we can quickly find the smallest position greater than our current position.

2. **Data structure choice**: We need a map from character to sorted list of indices. Since there are only 26 possible lowercase letters, we can use an array of lists.

3. **Checking a word**: Start with `current_pos = -1` (meaning we haven't found any character yet). For each character in the word:
   - Look up the list of indices for that character
   - Binary search for the smallest index > current_pos
   - If found, update current_pos to that index
   - If not found, the word is not a subsequence

4. **Optimization for repeated words**: Since words can repeat in the input, we can memoize results to avoid recomputation.

This approach transforms the problem from O(n × m) to O((n + m) × log n) where m is total characters in all words.

## Optimal Solution

Here's the complete solution using binary search on preprocessed character indices:

<div class="code-group">

```python
# Optimal Solution using Binary Search
# Time: O(n + m log n) where n = len(s), m = total chars in words
# Space: O(n) for storing indices
def numMatchingSubseq(s, words):
    # Step 1: Preprocess s - create a map from character to sorted list of indices
    # We'll use a dictionary with lists
    char_indices = {chr(i): [] for i in range(ord('a'), ord('z') + 1)}

    # Store each character's positions in s
    for i, char in enumerate(s):
        char_indices[char].append(i)

    # Helper function to check if a word is a subsequence using binary search
    def is_subsequence(word):
        current_pos = -1  # Position in s of last found character

        for char in word:
            # Get the list of indices where this character appears
            indices = char_indices[char]

            # Binary search for the smallest index > current_pos
            left, right = 0, len(indices) - 1
            next_pos = -1

            while left <= right:
                mid = left + (right - left) // 2
                if indices[mid] > current_pos:
                    next_pos = indices[mid]
                    right = mid - 1  # Look for an earlier valid position
                else:
                    left = mid + 1

            # If no valid position found, word is not a subsequence
            if next_pos == -1:
                return False

            # Update current position for next character
            current_pos = next_pos

        return True

    # Step 2: Check each word and count subsequences
    count = 0
    memo = {}  # Cache results for repeated words

    for word in words:
        if word in memo:
            if memo[word]:
                count += 1
        else:
            is_sub = is_subsequence(word)
            memo[word] = is_sub
            if is_sub:
                count += 1

    return count
```

```javascript
// Optimal Solution using Binary Search
// Time: O(n + m log n) where n = s.length, m = total chars in words
// Space: O(n) for storing indices
function numMatchingSubseq(s, words) {
  // Step 1: Preprocess s - create a map from character to sorted list of indices
  const charIndices = new Map();

  // Initialize map for all lowercase letters
  for (let i = 0; i < 26; i++) {
    charIndices.set(String.fromCharCode(97 + i), []);
  }

  // Store each character's positions in s
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    charIndices.get(char).push(i);
  }

  // Helper function to check if a word is a subsequence using binary search
  function isSubsequence(word) {
    let currentPos = -1; // Position in s of last found character

    for (const char of word) {
      // Get the list of indices where this character appears
      const indices = charIndices.get(char);
      if (!indices || indices.length === 0) {
        return false; // Character doesn't exist in s at all
      }

      // Binary search for the smallest index > currentPos
      let left = 0,
        right = indices.length - 1;
      let nextPos = -1;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (indices[mid] > currentPos) {
          nextPos = indices[mid];
          right = mid - 1; // Look for an earlier valid position
        } else {
          left = mid + 1;
        }
      }

      // If no valid position found, word is not a subsequence
      if (nextPos === -1) {
        return false;
      }

      // Update current position for next character
      currentPos = nextPos;
    }

    return true;
  }

  // Step 2: Check each word and count subsequences
  let count = 0;
  const memo = new Map(); // Cache results for repeated words

  for (const word of words) {
    if (memo.has(word)) {
      if (memo.get(word)) {
        count++;
      }
    } else {
      const isSub = isSubsequence(word);
      memo.set(word, isSub);
      if (isSub) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Optimal Solution using Binary Search
// Time: O(n + m log n) where n = s.length(), m = total chars in words
// Space: O(n) for storing indices
import java.util.*;

public class Solution {
    public int numMatchingSubseq(String s, String[] words) {
        // Step 1: Preprocess s - create a map from character to sorted list of indices
        List<Integer>[] charIndices = new ArrayList[26];
        for (int i = 0; i < 26; i++) {
            charIndices[i] = new ArrayList<>();
        }

        // Store each character's positions in s
        for (int i = 0; i < s.length(); i++) {
            charIndices[s.charAt(i) - 'a'].add(i);
        }

        // Step 2: Check each word and count subsequences
        int count = 0;
        Map<String, Boolean> memo = new HashMap<>();  // Cache results for repeated words

        for (String word : words) {
            if (memo.containsKey(word)) {
                if (memo.get(word)) {
                    count++;
                }
            } else {
                boolean isSub = isSubsequence(word, charIndices);
                memo.put(word, isSub);
                if (isSub) {
                    count++;
                }
            }
        }

        return count;
    }

    private boolean isSubsequence(String word, List<Integer>[] charIndices) {
        int currentPos = -1;  // Position in s of last found character

        for (int i = 0; i < word.length(); i++) {
            char c = word.charAt(i);
            List<Integer> indices = charIndices[c - 'a'];

            // Binary search for the smallest index > currentPos
            int left = 0, right = indices.size() - 1;
            int nextPos = -1;

            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (indices.get(mid) > currentPos) {
                    nextPos = indices.get(mid);
                    right = mid - 1;  // Look for an earlier valid position
                } else {
                    left = mid + 1;
                }
            }

            // If no valid position found, word is not a subsequence
            if (nextPos == -1) {
                return false;
            }

            // Update current position for next character
            currentPos = nextPos;
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Preprocessing `s`: O(n) where n is length of `s`. We iterate through `s` once to build the character index map.
- Checking each word: For a word of length k, we perform k binary searches, each taking O(log n) time. With m total characters across all words, this is O(m log n).
- Total: O(n + m log n)

**Space Complexity:**

- Storing character indices: O(n) in the worst case (if all characters are the same, we store n indices for that character).
- Memoization cache: O(w) where w is number of unique words (at most 5000).
- Total: O(n + w)

This is significantly better than the brute force O(n × m) when n is large and we have many words.

## Common Mistakes

1. **Forgetting to handle characters not in `s`**: If a word contains a character that doesn't exist in `s` at all, we should immediately return false. The binary search approach handles this naturally since the indices list will be empty.

2. **Off-by-one errors in binary search**: The key is finding the smallest index **greater than** current position, not greater than or equal to. If we find an index equal to current position, we need to look further since we can't use the same character position twice.

3. **Not memoizing results for repeated words**: The problem statement doesn't guarantee words are unique. Without memoization, we might do unnecessary recomputation. In the worst case with all words being the same, this could make our solution O(w × k log n) instead of O(k log n + w).

4. **Using linear search instead of binary search**: After preprocessing, some candidates might still use linear search through the indices list. This would give us O(n + m × n) in the worst case, which is even worse than the brute force!

## When You'll See This Pattern

This "preprocess and binary search" pattern appears in several string matching problems:

1. **Is Subsequence (LeetCode 392)**: The simpler version of this problem, checking if a single string is a subsequence of another. The optimal solution for the single case is the two-pointer approach, but if you needed to check many strings against the same target, you'd use this pattern.

2. **Shortest Way to Form String (LeetCode 1055)**: Given two strings `source` and `target`, find the minimum number of subsequences of `source` needed to form `target`. The efficient solution uses binary search on preprocessed character indices from `source`.

3. **Number of Subsequences That Satisfy Given Sum Condition (LeetCode 1498)**: While not exactly the same, it also uses preprocessing and binary search to efficiently count valid subsequences.

The core pattern is: when you need to repeatedly query a large static dataset (like string `s`) to find elements in order, preprocess the dataset into an index structure that supports efficient "next greater element" queries.

## Key Takeaways

1. **Preprocess static data for repeated queries**: When you have a fixed string `s` and many queries (words to check), invest O(n) time upfront to build an index that makes each query faster.

2. **Binary search on indices for ordered matching**: For subsequence problems, you're essentially looking for the next occurrence of each character in order. Binary search on precomputed indices is perfect for this.

3. **Memoize repeated computations**: Even with an optimal algorithm, don't forget basic optimizations like caching results for identical inputs. This is especially important in interview settings where you're expected to think about all aspects of performance.

Related problems: [Is Subsequence](/problem/is-subsequence), [Shortest Way to Form String](/problem/shortest-way-to-form-string), [Count Vowel Substrings of a String](/problem/count-vowel-substrings-of-a-string)
