---
title: "How to Solve Find and Replace Pattern — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find and Replace Pattern. Medium difficulty, 77.0% acceptance rate. Topics: Array, Hash Table, String."
date: "2028-08-21"
category: "dsa-patterns"
tags: ["find-and-replace-pattern", "array", "hash-table", "string", "medium"]
---

# How to Solve Find and Replace Pattern

This problem asks us to filter a list of words, returning only those that match a given pattern. A word matches if we can establish a consistent one-to-one mapping between letters in the pattern and letters in the word. What makes this interesting is that the mapping must work in both directions: each pattern letter maps to exactly one word letter, and each word letter maps back to exactly one pattern letter. This is essentially checking if two strings are isomorphic, but applied across multiple words.

## Visual Walkthrough

Let's trace through a concrete example:  
`words = ["abc","deq","mee","aqq","dkd","ccc"]`, `pattern = "abb"`

We need to check each word to see if it follows the same letter pattern as "abb":

- **"abc"**: Pattern "a"→"a", "b"→"b", "b"→"c"? Wait, the second "b" in pattern would map to "c", but "b" already maps to "b". This breaks the one-to-one mapping. Also, "a" and "b" in pattern map to different letters ("a" and "b"), but "b" in word would need to map back to both "b" and "a" in pattern. So "abc" doesn't match.

- **"deq"**: "a"→"d", "b"→"e", "b"→"q"? Again, second "b" tries to map to "q" but "b" already maps to "e". Doesn't match.

- **"mee"**: "a"→"m", "b"→"e", "b"→"e". This works! Each "b" maps to the same letter "e", and no two different pattern letters map to the same word letter. "mee" matches.

- **"aqq"**: "a"→"a", "b"→"q", "b"→"q". Works similarly. "aqq" matches.

- **"dkd"**: "a"→"d", "b"→"k", "b"→"d"? Here's the issue: "b" tries to map to "d", but "a" already maps to "d". This violates the one-to-one mapping (two different pattern letters can't map to the same word letter). Doesn't match.

- **"ccc"**: "a"→"c", "b"→"c", "b"→"c". Fails for the same reason: "a" and "b" both map to "c". Doesn't match.

So our output should be `["mee","aqq"]`.

## Brute Force Approach

A naive approach might try to generate all possible permutations of letter mappings, but that's extremely inefficient (26! possibilities). Another brute force would be to check each word by trying to build the mapping as we go, but without proper tracking of the reverse mapping.

What some candidates might try is checking only the forward mapping: for each word, map pattern letters to word letters. But this misses cases where two different pattern letters map to the same word letter (like "a"→"c" and "b"→"c" in the "ccc" example above).

A correct brute force would need to:

1. For each word, create a forward mapping dictionary (pattern char → word char)
2. Also create a reverse mapping dictionary (word char → pattern char)
3. Check each character pair to ensure both mappings are consistent

This approach would work but is somewhat redundant. We can optimize by building both checks into a single pass.

## Optimized Approach

The key insight is that two strings follow the same pattern if and only if they are **isomorphic**. This problem is essentially applying the "Isomorphic Strings" check to each word against the pattern.

We need to verify two conditions:

1. **Forward uniqueness**: Each character in pattern maps to exactly one character in the word
2. **Backward uniqueness**: Each character in word maps to exactly one character in pattern

We can check this efficiently in O(n) time per word using two dictionaries (or arrays for fixed character sets). The algorithm:

- Create two dictionaries: `pattern_to_word` and `word_to_pattern`
- For each position i, get current pattern char `p` and word char `w`
- Check if `p` already maps to a different char than `w` in `pattern_to_word`
- Check if `w` already maps to a different char than `p` in `word_to_pattern`
- If either check fails, the word doesn't match
- If we process all characters without conflicts, the word matches

Alternatively, we can use a normalization technique: convert both strings to a canonical form where the first occurrence of each character gets replaced with an incrementing number. If both strings normalize to the same sequence, they're isomorphic.

## Optimal Solution

Here's the implementation using the two-dictionary approach:

<div class="code-group">

```python
# Time: O(n * k) where n = number of words, k = length of pattern
# Space: O(k) for the dictionaries (or O(1) since alphabet size is fixed)
def findAndReplacePattern(words, pattern):
    def matches(word):
        # Two dictionaries to track bidirectional mapping
        pattern_to_word = {}
        word_to_pattern = {}

        # Check each character pair
        for p_char, w_char in zip(pattern, word):
            # Check forward mapping consistency
            if p_char in pattern_to_word:
                if pattern_to_word[p_char] != w_char:
                    return False
            else:
                pattern_to_word[p_char] = w_char

            # Check backward mapping consistency
            if w_char in word_to_pattern:
                if word_to_pattern[w_char] != p_char:
                    return False
            else:
                word_to_pattern[w_char] = p_char

        return True

    # Filter words that match the pattern
    return [word for word in words if matches(word)]
```

```javascript
// Time: O(n * k) where n = number of words, k = length of pattern
// Space: O(k) for the maps (or O(1) since alphabet size is fixed)
function findAndReplacePattern(words, pattern) {
  // Helper function to check if a single word matches the pattern
  const matches = (word) => {
    // Two maps for bidirectional mapping tracking
    const patternToWord = new Map();
    const wordToPattern = new Map();

    // Compare character by character
    for (let i = 0; i < pattern.length; i++) {
      const pChar = pattern[i];
      const wChar = word[i];

      // Check forward mapping: pattern char -> word char
      if (patternToWord.has(pChar)) {
        if (patternToWord.get(pChar) !== wChar) {
          return false;
        }
      } else {
        patternToWord.set(pChar, wChar);
      }

      // Check backward mapping: word char -> pattern char
      if (wordToPattern.has(wChar)) {
        if (wordToPattern.get(wChar) !== pChar) {
          return false;
        }
      } else {
        wordToPattern.set(wChar, pChar);
      }
    }

    return true;
  };

  // Filter words that match the pattern
  return words.filter((word) => matches(word));
}
```

```java
// Time: O(n * k) where n = number of words, k = length of pattern
// Space: O(k) for the maps (or O(1) since alphabet size is fixed)
import java.util.*;

class Solution {
    public List<String> findAndReplacePattern(String[] words, String pattern) {
        List<String> result = new ArrayList<>();

        for (String word : words) {
            if (matchesPattern(word, pattern)) {
                result.add(word);
            }
        }

        return result;
    }

    private boolean matchesPattern(String word, String pattern) {
        // Early exit if lengths differ
        if (word.length() != pattern.length()) {
            return false;
        }

        // Two maps for bidirectional mapping
        Map<Character, Character> patternToWord = new HashMap<>();
        Map<Character, Character> wordToPattern = new HashMap<>();

        for (int i = 0; i < pattern.length(); i++) {
            char pChar = pattern.charAt(i);
            char wChar = word.charAt(i);

            // Check forward mapping: pattern char -> word char
            if (patternToWord.containsKey(pChar)) {
                if (patternToWord.get(pChar) != wChar) {
                    return false;
                }
            } else {
                patternToWord.put(pChar, wChar);
            }

            // Check backward mapping: word char -> pattern char
            if (wordToPattern.containsKey(wChar)) {
                if (wordToPattern.get(wChar) != pChar) {
                    return false;
                }
            } else {
                wordToPattern.put(wChar, pChar);
            }
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × k), where n is the number of words and k is the length of the pattern (and each word). We process each character of each word exactly once.

**Space Complexity**: O(k) for the dictionaries/maps in the matching function, since we store at most k mappings. However, since we're only using lowercase English letters, we could argue it's O(1) or O(26). The output list uses O(m) space where m is the number of matching words.

## Common Mistakes

1. **Only checking forward mapping**: This is the most common mistake. Candidates check that each pattern letter maps consistently to word letters but forget to check that each word letter maps back consistently to pattern letters. Example: pattern "ab" and word "aa" would incorrectly pass with only forward checking.

2. **Assuming equal lengths**: While the problem constraints might guarantee equal lengths, it's good practice to add an early length check. If lengths differ, the strings can't possibly match the pattern.

3. **Using arrays without considering character set**: Some solutions use arrays of size 26 for lowercase letters, but the problem doesn't specify the character set. A dictionary/map approach is more general and handles any character set.

4. **Not resetting mappings between words**: Forgetting to clear the dictionaries when checking a new word will cause incorrect results. Each word needs a fresh mapping check.

## When You'll See This Pattern

This isomorphic strings pattern appears in several problems:

1. **Isomorphic Strings (Easy)**: The core of this problem - checking if two strings are isomorphic using bidirectional mapping.

2. **Word Pattern (Easy)**: Similar concept but with words instead of characters, and pattern uses letters to represent word positions.

3. **Group Shifted Strings (Medium)**: Uses a similar normalization technique where strings are converted to a canonical form based on character differences.

The pattern teaches you to recognize when you need to establish and verify one-to-one relationships between elements of two sequences.

## Key Takeaways

1. **Bidirectional mapping checks are crucial**: When establishing relationships between two sets, always verify both directions to ensure one-to-one correspondence.

2. **Normalization is a powerful technique**: Converting strings to a canonical form (like mapping first occurrences to incrementing numbers) can simplify isomorphic checks.

3. **Early optimization with length checks**: Simple checks like comparing lengths can save unnecessary processing and make your code more robust.

Related problems: [Isomorphic Strings](/problem/isomorphic-strings), [Word Pattern](/problem/word-pattern)
