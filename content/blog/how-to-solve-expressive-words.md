---
title: "How to Solve Expressive Words — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Expressive Words. Medium difficulty, 46.7% acceptance rate. Topics: Array, Two Pointers, String."
date: "2026-11-23"
category: "dsa-patterns"
tags: ["expressive-words", "array", "two-pointers", "string", "medium"]
---

# How to Solve Expressive Words

This problem asks us to determine which words from a given list can be stretched to match a target string `s` by repeating characters. The tricky part is understanding the stretching rules: we can only stretch groups of identical characters, and we must stretch them to at least 3 characters if we stretch them at all. This isn't a simple character-by-character comparison—it requires tracking groups of identical characters and applying specific transformation rules.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose:

- `s = "heeellooo"`
- `words = ["hello", "hi", "helo"]`

We need to check each word against `s`:

**Checking "hello" against "heeellooo":**

1. Both strings have groups: `s` groups = `"h"`, `"eee"`, `"ll"`, `"ooo"`; "hello" groups = `"h"`, `"e"`, `"ll"`, `"o"`
2. Compare groups one by one:
   - Group 1: `"h"` (length 1) vs `"h"` (length 1) → valid (equal lengths)
   - Group 2: `"eee"` (length 3) vs `"e"` (length 1) → valid (s group ≥ 3, so stretching allowed)
   - Group 3: `"ll"` (length 2) vs `"ll"` (length 2) → valid (equal lengths)
   - Group 4: `"ooo"` (length 3) vs `"o"` (length 1) → valid (s group ≥ 3, so stretching allowed)
3. All groups match → "hello" is expressive.

**Checking "hi" against "heeellooo":**

1. "hi" groups = `"h"`, `"i"`
2. Compare first groups: `"h"` vs `"h"` → valid
3. Compare second groups: `"i"` vs `"eee"` → invalid (different characters)
4. Mismatch → "hi" is not expressive.

**Checking "helo" against "heeellooo":**

1. "helo" groups = `"h"`, `"e"`, `"l"`, `"o"`
2. Compare groups:
   - `"h"` vs `"h"` → valid
   - `"e"` vs `"eee"` → valid (stretching allowed)
   - `"l"` vs `"ll"` → invalid (s group length = 2 < 3, so no stretching allowed, but lengths differ)
3. Mismatch → "helo" is not expressive.

This walkthrough reveals the core challenge: we need to compare groups of identical characters, not individual characters, and apply specific rules about when stretching is allowed.

## Brute Force Approach

A naive approach might try to simulate all possible stretchings of each word. For each word, we could try to match it against `s` by:

1. Iterating through both strings character by character
2. When characters match, continue
3. When they don't match, check if we're in a stretchable situation

However, this gets messy because we need to track group boundaries and lengths. A cleaner brute force would be:

1. For each word, generate all possible stretchings by repeating each character 1, 2, or 3+ times
2. Check if any stretching equals `s`

The problem with this approach is combinatorial explosion. If a word has length `n`, each character can be repeated multiple ways, leading to exponential possibilities. Even for modest `n`, this becomes infeasible.

## Optimized Approach

The key insight is that we don't need to generate all stretchings—we just need to check if stretching is _possible_ according to the rules. We can do this by:

1. Compressing both strings into runs (groups) of identical characters
2. Comparing the runs pairwise with these rules:
   - The character in each run must match
   - If the run length in `s` is less than 3:
     - The run lengths must be equal (no stretching allowed)
   - If the run length in `s` is 3 or more:
     - The run length in the word must be ≤ the run length in `s` (stretching allowed, but not shrinking)

This approach uses **two-pointer technique** to traverse both strings simultaneously while tracking group boundaries and lengths. We maintain pointers for both strings and advance them through each group, counting the length of each group as we go.

## Optimal Solution

Here's the complete solution using the two-pointer approach with detailed comments:

<div class="code-group">

```python
# Time: O(n * m) where n = len(words), m = max(len(s), max word length)
# Space: O(1) excluding input storage
class Solution:
    def expressiveWords(self, s: str, words: List[str]) -> int:
        def is_stretchy(word: str) -> bool:
            """Check if word can be stretched to match s."""
            i, j = 0, 0  # Pointers for s and word respectively
            m, n = len(s), len(word)

            while i < m and j < n:
                # Characters must match at the start of each group
                if s[i] != word[j]:
                    return False

                # Count length of current group in s
                len_s_group = 0
                char_s = s[i]
                while i < m and s[i] == char_s:
                    i += 1
                    len_s_group += 1

                # Count length of current group in word
                len_word_group = 0
                char_word = word[j]
                while j < n and word[j] == char_word:
                    j += 1
                    len_word_group += 1

                # Check stretch rules:
                # 1. If s group length < 3: lengths must be equal (no stretching)
                # 2. If s group length >= 3: word group length must be <= s group length
                #    (can stretch word to match s, but not shrink)
                if len_s_group < 3 and len_s_group != len_word_group:
                    return False
                if len_s_group >= 3 and len_word_group > len_s_group:
                    return False

            # Both pointers must reach the end for a valid match
            return i == m and j == n

        # Count how many words are stretchy
        count = 0
        for word in words:
            if is_stretchy(word):
                count += 1
        return count
```

```javascript
// Time: O(n * m) where n = words.length, m = max(s.length, max word length)
// Space: O(1) excluding input storage
/**
 * @param {string} s
 * @param {string[]} words
 * @return {number}
 */
var expressiveWords = function (s, words) {
  /**
   * Check if a word can be stretched to match s
   * @param {string} word - The word to check
   * @return {boolean} - True if stretchy, false otherwise
   */
  const isStretchy = (word) => {
    let i = 0,
      j = 0; // Pointers for s and word
    const m = s.length,
      n = word.length;

    while (i < m && j < n) {
      // Characters must match at group start
      if (s[i] !== word[j]) {
        return false;
      }

      // Count length of current group in s
      const charS = s[i];
      let lenSGroup = 0;
      while (i < m && s[i] === charS) {
        i++;
        lenSGroup++;
      }

      // Count length of current group in word
      const charWord = word[j];
      let lenWordGroup = 0;
      while (j < n && word[j] === charWord) {
        j++;
        lenWordGroup++;
      }

      // Apply stretch rules:
      // 1. If s group < 3: lengths must be equal
      // 2. If s group >= 3: word length must be <= s length
      if (lenSGroup < 3 && lenSGroup !== lenWordGroup) {
        return false;
      }
      if (lenSGroup >= 3 && lenWordGroup > lenSGroup) {
        return false;
      }
    }

    // Both strings must be fully consumed
    return i === m && j === n;
  };

  // Count stretchy words
  let count = 0;
  for (const word of words) {
    if (isStretchy(word)) {
      count++;
    }
  }
  return count;
};
```

```java
// Time: O(n * m) where n = words.length, m = max(s.length(), max word length)
// Space: O(1) excluding input storage
class Solution {
    public int expressiveWords(String s, String[] words) {
        int count = 0;
        for (String word : words) {
            if (isStretchy(s, word)) {
                count++;
            }
        }
        return count;
    }

    /**
     * Check if word can be stretched to match s
     * @param s - The target string
     * @param word - The word to check
     * @return true if stretchy, false otherwise
     */
    private boolean isStretchy(String s, String word) {
        int i = 0, j = 0;  // Pointers for s and word
        int m = s.length(), n = word.length();

        while (i < m && j < n) {
            // Characters must match at the start of each group
            if (s.charAt(i) != word.charAt(j)) {
                return false;
            }

            // Count length of current group in s
            char charS = s.charAt(i);
            int lenSGroup = 0;
            while (i < m && s.charAt(i) == charS) {
                i++;
                lenSGroup++;
            }

            // Count length of current group in word
            char charWord = word.charAt(j);
            int lenWordGroup = 0;
            while (j < n && word.charAt(j) == charWord) {
                j++;
                lenWordGroup++;
            }

            // Apply stretch rules:
            // 1. If s group length < 3: lengths must be equal
            // 2. If s group length >= 3: word length must be <= s length
            if (lenSGroup < 3 && lenSGroup != lenWordGroup) {
                return false;
            }
            if (lenSGroup >= 3 && lenWordGroup > lenSGroup) {
                return false;
            }
        }

        // Both strings must be fully consumed
        return i == m && j == n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m), where:

- `n` is the number of words
- `m` is the maximum length between `s` and the longest word

We process each word once, and for each word, we traverse both strings simultaneously. Each character is visited at most once per word check.

**Space Complexity:** O(1) excluding the input storage. We only use a constant amount of extra space for pointers and counters. The algorithm operates in-place without additional data structures.

## Common Mistakes

1. **Forgetting to check character equality:** Some candidates focus only on length comparisons but forget that the characters in corresponding groups must match. Always check `s[i] == word[j]` at the start of each group.

2. **Incorrect stretch rule application:** The most common error is misunderstanding when stretching is allowed. Remember:
   - If `s` group length < 3: NO stretching allowed → lengths must be equal
   - If `s` group length ≥ 3: stretching allowed → word length must be ≤ `s` length
     A common mistake is allowing stretching when `s` group length = 2.

3. **Not handling different numbers of groups:** If `s` and a word have different numbers of character groups (e.g., "hello" vs "helo"), the pointers won't reach the end simultaneously. Always check `i == m && j == n` at the end.

4. **Off-by-one errors in group counting:** When counting group lengths, ensure you increment pointers correctly. A good pattern is:
   ```python
   char = s[i]
   count = 0
   while i < len(s) and s[i] == char:
       i += 1
       count += 1
   ```
   This counts the current group and advances the pointer to the next group.

## When You'll See This Pattern

The two-pointer technique for comparing runs/sequences appears in several problems:

1. **String Compression (LeetCode 443)** - Similar run-length encoding where you compress strings in-place by counting consecutive characters.

2. **Long Pressed Name (LeetCode 925)** - Almost identical pattern: checking if a name matches a typed version where characters might be repeated.

3. **Group Anagrams (LeetCode 49)** - While not identical, it shares the concept of grouping similar elements (here by character runs, there by sorted strings).

The core pattern is: when you need to compare sequences with potential repetitions, consider compressing them into runs and comparing the runs with specific rules.

## Key Takeaways

1. **Two-pointer run comparison:** When dealing with sequences of repeated elements, use two pointers to traverse both sequences while counting group lengths. This is more efficient than character-by-character comparison with complex state tracking.

2. **Separate validation rules:** Break down complex matching rules into clear conditions. Here we have two distinct cases based on the `s` group length. Writing these as separate `if` statements makes the logic clearer and less error-prone.

3. **Complete consumption check:** Always verify that both sequences are fully consumed (pointers at the end). This catches cases where sequences have different numbers of groups.

[Practice this problem on CodeJeet](/problem/expressive-words)
