---
title: "How to Solve Word Pattern — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Word Pattern. Easy difficulty, 43.8% acceptance rate. Topics: Hash Table, String."
date: "2026-09-27"
category: "dsa-patterns"
tags: ["word-pattern", "hash-table", "string", "easy"]
---

## How to Solve Word Pattern

This problem asks whether a given pattern string and a space-separated word string follow the same mapping relationship. The tricky part is that the mapping must be **bijective** — each pattern character maps to exactly one unique word, and each word maps back to exactly one pattern character. This two-way uniqueness requirement is what makes this more than a simple dictionary lookup.

## Visual Walkthrough

Let's trace through an example step by step:

**Input:** `pattern = "abba"`, `s = "dog cat cat dog"`

**Step 1:** Split `s` into words: `["dog", "cat", "cat", "dog"]`

**Step 2:** Check if lengths match: pattern length = 4, words length = 4 ✓

**Step 3:** Build the mapping as we iterate:

- `i = 0`: pattern[0] = 'a', words[0] = 'dog'
  - Check forward mapping: 'a' not in map → map 'a' → 'dog'
  - Check reverse mapping: 'dog' not in reverse map → map 'dog' → 'a'

- `i = 1`: pattern[1] = 'b', words[1] = 'cat'
  - Forward: 'b' not in map → map 'b' → 'cat'
  - Reverse: 'cat' not in reverse map → map 'cat' → 'b'

- `i = 2`: pattern[2] = 'b', words[2] = 'cat'
  - Forward: 'b' maps to 'cat' (matches current word 'cat') ✓
  - Reverse: 'cat' maps to 'b' (matches current pattern 'b') ✓

- `i = 3`: pattern[3] = 'a', words[3] = 'dog'
  - Forward: 'a' maps to 'dog' (matches current word 'dog') ✓
  - Reverse: 'dog' maps to 'a' (matches current pattern 'a') ✓

All checks pass, so this follows the pattern.

**Counterexample:** `pattern = "abba"`, `s = "dog cat cat fish"`

- At `i = 3`: pattern[3] = 'a' should map to 'dog', but words[3] = 'fish' → fails.

## Brute Force Approach

A naive approach would be to try all possible mappings. For each pattern character, we could:

1. Check all previous occurrences of that character
2. Verify they map to the same word
3. Check that no other character maps to that word

This would require O(n²) comparisons where n is the pattern length, as we'd compare each element with all previous ones. While this would technically work for small inputs, it's inefficient and doesn't scale well. More importantly, it's error-prone to implement correctly with all the edge cases.

## Optimal Solution

The optimal solution uses two hash maps (dictionaries) to track both directions of the mapping. We need to ensure:

1. Each pattern character always maps to the same word (forward mapping)
2. Each word always maps back to the same pattern character (reverse mapping)

<div class="code-group">

```python
# Time: O(n) where n is number of words/pattern length
# Space: O(m) where m is number of unique pattern characters/words
def wordPattern(pattern: str, s: str) -> bool:
    # Split the string into words
    words = s.split()

    # If lengths don't match, pattern can't possibly match
    if len(pattern) != len(words):
        return False

    # Two dictionaries for bidirectional mapping
    char_to_word = {}  # Maps pattern character -> word
    word_to_char = {}  # Maps word -> pattern character

    # Iterate through pattern and words simultaneously
    for char, word in zip(pattern, words):
        # Check forward mapping: char should map to this exact word
        if char in char_to_word:
            if char_to_word[char] != word:
                return False  # Same char maps to different word
        else:
            char_to_word[char] = word  # Create new mapping

        # Check reverse mapping: word should map back to this exact char
        if word in word_to_char:
            if word_to_char[word] != char:
                return False  # Same word maps to different char
        else:
            word_to_char[word] = char  # Create reverse mapping

    return True  # All checks passed
```

```javascript
// Time: O(n) where n is number of words/pattern length
// Space: O(m) where m is number of unique pattern characters/words
function wordPattern(pattern, s) {
  // Split the string into words
  const words = s.split(" ");

  // If lengths don't match, pattern can't possibly match
  if (pattern.length !== words.length) {
    return false;
  }

  // Two maps for bidirectional mapping
  const charToWord = new Map(); // Maps pattern character -> word
  const wordToChar = new Map(); // Maps word -> pattern character

  // Iterate through pattern and words simultaneously
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    const word = words[i];

    // Check forward mapping: char should map to this exact word
    if (charToWord.has(char)) {
      if (charToWord.get(char) !== word) {
        return false; // Same char maps to different word
      }
    } else {
      charToWord.set(char, word); // Create new mapping
    }

    // Check reverse mapping: word should map back to this exact char
    if (wordToChar.has(word)) {
      if (wordToChar.get(word) !== char) {
        return false; // Same word maps to different char
      }
    } else {
      wordToChar.set(word, char); // Create reverse mapping
    }
  }

  return true; // All checks passed
}
```

```java
// Time: O(n) where n is number of words/pattern length
// Space: O(m) where m is number of unique pattern characters/words
public boolean wordPattern(String pattern, String s) {
    // Split the string into words
    String[] words = s.split(" ");

    // If lengths don't match, pattern can't possibly match
    if (pattern.length() != words.length) {
        return false;
    }

    // Two maps for bidirectional mapping
    Map<Character, String> charToWord = new HashMap<>();
    Map<String, Character> wordToChar = new HashMap<>();

    // Iterate through pattern and words simultaneously
    for (int i = 0; i < pattern.length(); i++) {
        char c = pattern.charAt(i);
        String word = words[i];

        // Check forward mapping: char should map to this exact word
        if (charToWord.containsKey(c)) {
            if (!charToWord.get(c).equals(word)) {
                return false;  // Same char maps to different word
            }
        } else {
            charToWord.put(c, word);  // Create new mapping
        }

        // Check reverse mapping: word should map back to this exact char
        if (wordToChar.containsKey(word)) {
            if (wordToChar.get(word) != c) {
                return false;  // Same word maps to different char
            }
        } else {
            wordToChar.put(word, c);  // Create reverse mapping
        }
    }

    return true;  // All checks passed
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the pattern (or number of words). We make a single pass through both the pattern and words array, performing constant-time operations (hash map lookups/insertions) at each step.

**Space Complexity:** O(m) where m is the number of unique pattern characters (which equals the number of unique words in a valid mapping). In the worst case where all characters are unique, m = n. We use two hash maps, each storing at most m entries.

## Common Mistakes

1. **Forgetting to check length mismatch first**: If pattern has 3 characters but s has 4 words (or vice versa), they can't possibly match. Check this immediately after splitting.

2. **Using only one hash map**: This is the most common mistake. With only a forward mapping (char → word), you might miss cases where different characters map to the same word. Example: `"abba"` and `"dog dog dog dog"` would incorrectly return true with only one map.

3. **Not handling the reverse mapping properly**: Some candidates try to check if a word exists in the forward map's values, but this is O(n) per check. Using a second hash map gives O(1) lookups.

4. **Incorrect string splitting**: Forgetting that `split()` with no arguments behaves differently than `split(" ")`. Use `split(" ")` to ensure consecutive spaces don't create empty strings.

## When You'll See This Pattern

This bidirectional mapping pattern appears in several related problems:

1. **Isomorphic Strings (Easy)**: Exactly the same concept but with characters mapping to characters instead of characters to words. The solution is identical — just use two maps.

2. **Find and Replace Pattern (Medium)**: Extends this concept to multiple strings. You need to check which words in a list follow a given pattern.

3. **Word Pattern II (Medium)**: A harder version where words aren't pre-split — you need to determine if any splitting of s matches the pattern.

The core technique of using two hash maps for bidirectional validation is useful whenever you need to ensure a one-to-one correspondence between two sets of items.

## Key Takeaways

1. **Bijective mappings require two checks**: When you need each element in set A to map uniquely to an element in set B (and vice versa), you need two hash maps — one for each direction.

2. **Length check is a quick early exit**: Before doing any mapping logic, check if the two sequences have the same length. If not, return false immediately.

3. **This is isomorphic strings in disguise**: Recognizing that this is essentially the same problem as Isomorphic Strings helps you apply known solutions to new variations.

Related problems: [Isomorphic Strings](/problem/isomorphic-strings), [Word Pattern II](/problem/word-pattern-ii), [Find and Replace Pattern](/problem/find-and-replace-pattern)
