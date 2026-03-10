---
title: "How to Solve Count Prefix and Suffix Pairs II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Prefix and Suffix Pairs II. Hard difficulty, 28.1% acceptance rate. Topics: Array, String, Trie, Rolling Hash, String Matching."
date: "2030-01-28"
category: "dsa-patterns"
tags: ["count-prefix-and-suffix-pairs-ii", "array", "string", "trie", "hard"]
---

# How to Solve Count Prefix and Suffix Pairs II

You're given an array of strings and need to count all index pairs `(i, j)` where `i < j` and the first string is both a prefix AND suffix of the second string. The challenge is doing this efficiently when the array can contain up to 10⁵ strings, making O(n²) comparisons impossible. This problem tests your ability to recognize string relationships and use efficient data structures to avoid redundant checks.

## Visual Walkthrough

Let's trace through a small example: `words = ["a", "aba", "ababa", "ba"]`

We need to count all pairs `(i, j)` where `i < j` and `words[i]` is both prefix and suffix of `words[j]`:

1. **Check (0, 1)**: "a" vs "aba"
   - Is "a" a prefix of "aba"? Yes ("a"ba)
   - Is "a" a suffix of "aba"? Yes (ab"a")
   - ✅ Count = 1

2. **Check (0, 2)**: "a" vs "ababa"
   - Prefix? Yes ("a"baba)
   - Suffix? Yes (abab"a")
   - ✅ Count = 2

3. **Check (0, 3)**: "a" vs "ba"
   - Prefix? No (starts with "b")
   - ❌ Not counted

4. **Check (1, 2)**: "aba" vs "ababa"
   - Prefix? Yes ("aba"ba)
   - Suffix? Yes (ab"aba")
   - ✅ Count = 3

5. **Check (1, 3)**: "aba" vs "ba"
   - Prefix? No
   - ❌ Not counted

6. **Check (2, 3)**: "ababa" vs "ba"
   - Prefix? No
   - ❌ Not counted

**Final count: 3**

The brute force approach would check all O(n²) pairs, but with n up to 10⁵, that's 10¹⁰ operations - far too slow. We need a smarter approach.

## Brute Force Approach

The straightforward solution checks every pair `(i, j)` where `i < j`:

<div class="code-group">

```python
# Time: O(n² * L) where L is average string length | Space: O(1)
def countPrefixSuffixPairs(words):
    n = len(words)
    count = 0

    for i in range(n):
        for j in range(i + 1, n):
            word_i = words[i]
            word_j = words[j]

            # Check if word_i is both prefix and suffix of word_j
            if (len(word_i) <= len(word_j) and
                word_j.startswith(word_i) and
                word_j.endswith(word_i)):
                count += 1

    return count
```

```javascript
// Time: O(n² * L) where L is average string length | Space: O(1)
function countPrefixSuffixPairs(words) {
  let count = 0;
  const n = words.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const wordI = words[i];
      const wordJ = words[j];

      // Check if wordI is both prefix and suffix of wordJ
      if (wordI.length <= wordJ.length && wordJ.startsWith(wordI) && wordJ.endsWith(wordI)) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n² * L) where L is average string length | Space: O(1)
public long countPrefixSuffixPairs(String[] words) {
    long count = 0;
    int n = words.length;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            String wordI = words[i];
            String wordJ = words[j];

            // Check if wordI is both prefix and suffix of wordJ
            if (wordI.length() <= wordJ.length() &&
                wordJ.startsWith(wordI) &&
                wordJ.endsWith(wordI)) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With n up to 10⁵, we have ~5×10⁹ pairs to check. Even if each check were O(1), this would be too slow. But each check requires O(L) time for string comparisons, making it completely infeasible.

## Optimized Approach

The key insight is that we need to count relationships efficiently without checking all pairs. Think about it this way: for each string `words[j]`, we want to know how many previous strings `words[i]` (with `i < j`) are both prefix and suffix of `words[j]`.

**Observation 1:** If `str1` is both prefix and suffix of `str2`, then `str1` must appear at the beginning AND end of `str2`. This means `str1` is a **border** of `str2` (a term from string algorithms meaning a substring that's both prefix and suffix).

**Observation 2:** We can use a **trie** (prefix tree) to efficiently check prefixes, but we also need to check suffixes. The trick is to represent each string in a way that captures both prefix and suffix information.

**Key Idea:** For each string, generate all its borders (prefixes that are also suffixes). Then use a hash map to count how many times we've seen each border among previous strings.

**Algorithm:**

1. For each string `s` in order:
   - Generate all borders of `s` (all prefixes that are also suffixes)
   - For each border, add its count from our hash map to the answer
   - Add `s` itself to the hash map (since future strings might have `s` as a border)

**Border Generation:** We can find all borders efficiently using the **KMP failure function** (also called LPS - Longest Prefix Suffix array). The failure function `f[i]` tells us the length of the longest proper prefix of `s[0..i]` that's also a suffix. By following the failure links, we can find all border lengths.

**Example:** For "ababa", borders are "a" (length 1) and "aba" (length 3). Note that "ababa" itself is not a proper border (we need `i < j`, so `words[i]` must be shorter than `words[j]`).

## Optimal Solution

We'll implement the solution using the KMP failure function to efficiently find all borders of each string:

<div class="code-group">

```python
# Time: O(n * L) where L is average string length | Space: O(n * L) for the hash map
def countPrefixSuffixPairs(words):
    from collections import defaultdict

    def get_borders(s):
        """Return all borders (prefixes that are also suffixes) of string s."""
        n = len(s)
        if n == 0:
            return []

        # Build KMP failure function (LPS array)
        lps = [0] * n
        length = 0  # length of previous longest prefix suffix
        i = 1

        while i < n:
            if s[i] == s[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                if length != 0:
                    # Fall back to previous prefix
                    length = lps[length - 1]
                else:
                    lps[i] = 0
                    i += 1

        # Collect all border lengths by following failure links
        borders = []
        length = lps[n - 1]  # Start with longest border

        while length > 0:
            borders.append(s[:length])  # Add the border string
            length = lps[length - 1]    # Move to next shorter border

        return borders

    count = 0
    freq = defaultdict(int)  # Count occurrences of each string seen so far

    for word in words:
        # Get all borders of current word
        borders = get_borders(word)

        # For each border, add how many times we've seen it before
        for border in borders:
            count += freq[border]

        # Also check if the word itself is a border for future words
        # (Add it to frequency after checking to maintain i < j condition)
        freq[word] += 1

    return count
```

```javascript
// Time: O(n * L) where L is average string length | Space: O(n * L) for the hash map
function countPrefixSuffixPairs(words) {
  // Helper function to compute all borders of a string using KMP LPS array
  function getBorders(s) {
    const n = s.length;
    if (n === 0) return [];

    // Build LPS (Longest Prefix Suffix) array
    const lps = new Array(n).fill(0);
    let len = 0; // length of previous longest prefix suffix
    let i = 1;

    while (i < n) {
      if (s[i] === s[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          // Fall back to previous prefix
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }

    // Collect all border strings by following LPS links
    const borders = [];
    len = lps[n - 1]; // Start with longest border

    while (len > 0) {
      borders.push(s.substring(0, len));
      len = lps[len - 1]; // Move to next shorter border
    }

    return borders;
  }

  let count = 0;
  const freq = new Map(); // Track frequency of strings seen so far

  for (const word of words) {
    // Get all borders of current word
    const borders = getBorders(word);

    // For each border, add how many times we've seen it before
    for (const border of borders) {
      count += freq.get(border) || 0;
    }

    // Add current word to frequency map for future comparisons
    // (Do this after checking to maintain i < j condition)
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  return count;
}
```

```java
// Time: O(n * L) where L is average string length | Space: O(n * L) for the hash map
import java.util.*;

public long countPrefixSuffixPairs(String[] words) {
    // Helper function to compute all borders of a string using KMP LPS array
    private List<String> getBorders(String s) {
        int n = s.length();
        List<String> borders = new ArrayList<>();
        if (n == 0) return borders;

        // Build LPS (Longest Prefix Suffix) array
        int[] lps = new int[n];
        int len = 0;  // length of previous longest prefix suffix
        int i = 1;

        while (i < n) {
            if (s.charAt(i) == s.charAt(len)) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    // Fall back to previous prefix
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }

        // Collect all border strings by following LPS links
        len = lps[n - 1];  // Start with longest border

        while (len > 0) {
            borders.add(s.substring(0, len));
            len = lps[len - 1];  // Move to next shorter border
        }

        return borders;
    }

    long count = 0;
    Map<String, Integer> freq = new HashMap<>();  // Track frequency of strings seen so far

    for (String word : words) {
        // Get all borders of current word
        List<String> borders = getBorders(word);

        // For each border, add how many times we've seen it before
        for (String border : borders) {
            count += freq.getOrDefault(border, 0);
        }

        // Add current word to frequency map for future comparisons
        // (Do this after checking to maintain i < j condition)
        freq.put(word, freq.getOrDefault(word, 0) + 1);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × L) where n is the number of strings and L is the average string length.

- For each string, we build the LPS array in O(L) time
- We collect borders by following LPS links, which takes O(L) total (each position visited at most once)
- Hash map operations (insert and lookup) are O(L) for string keys
- Total: O(n × L)

**Space Complexity:** O(n × L) in the worst case

- The hash map stores up to n strings, each of length up to L
- The LPS array uses O(L) temporary space per string
- In practice, it's O(n × L) for the hash map since we store all strings

## Common Mistakes

1. **Forgetting that i < j**: When adding the current word to the frequency map, you must do it AFTER checking its borders against previous words. If you add it first, you'll incorrectly count pairs where i = j.

2. **Not handling all borders**: Some solutions only check the longest border. But we need ALL borders. For example, "ababa" has borders "a" and "aba" - both need to be counted.

3. **Inefficient border generation**: Generating all prefixes and checking if they're suffixes takes O(L²) per string. Using the KMP failure function reduces this to O(L).

4. **Confusing prefix/suffix with substring**: Remember that `str1` must be exactly at the beginning AND end of `str2`, not just anywhere in `str2`. "ab" is NOT a border of "aab" even though it appears at the end.

## When You'll See This Pattern

This problem combines several important patterns:

1. **KMP/LPS for border finding**: Used in string matching problems like:
   - [Implement strStr()](https://leetcode.com/problems/implement-strstr/) - Pattern matching
   - [Repeated Substring Pattern](https://leetcode.com/problems/repeated-substring-pattern/) - Checking if a string can be built from repeats of a substring

2. **Trie-like prefix tracking**: While we used a hash map here, tries are the go-to for prefix-related problems:
   - [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/) - Basic trie implementation
   - [Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/) - Trie with wildcard support

3. **Counting pairs efficiently**: Instead of checking all O(n²) pairs, we process elements sequentially and use a data structure to track what we've seen:
   - [Count Number of Pairs With Absolute Difference K](https://leetcode.com/problems/count-number-of-pairs-with-absolute-difference-k/) - Similar pattern with hash map
   - [Two Sum](https://leetcode.com/problems/two-sum/) - The classic example of this pattern

## Key Takeaways

1. **When you need to count relationships between all pairs, think about processing sequentially**: Instead of checking all pairs (O(n²)), process elements one by one and use a data structure to efficiently query relationships with previous elements.

2. **KMP's failure function finds all borders efficiently**: The LPS array doesn't just give you the longest border - by following the failure links, you can find all borders in O(L) time.

3. **String problems often have hidden relationships**: Recognizing that "prefix and suffix" means "border" transforms the problem from string comparison to border finding, which has known efficient algorithms.

Related problems: [Implement Trie (Prefix Tree)](/problem/implement-trie-prefix-tree), [Design Add and Search Words Data Structure](/problem/design-add-and-search-words-data-structure)
