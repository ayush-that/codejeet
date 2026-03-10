---
title: "How to Solve Word Subsets — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Word Subsets. Medium difficulty, 55.9% acceptance rate. Topics: Array, Hash Table, String."
date: "2028-03-29"
category: "dsa-patterns"
tags: ["word-subsets", "array", "hash-table", "string", "medium"]
---

# How to Solve Word Subsets

This problem asks us to find all strings in `words1` that are "universal"—meaning each string contains every string in `words2` as a subset. A string `b` is a subset of string `a` if every character in `b` appears at least as many times in `a`. The challenge is efficiently checking multiple subset requirements simultaneously without repeatedly scanning each word.

## Visual Walkthrough

Let's trace through a concrete example:

```
words1 = ["amazon", "apple", "facebook", "google", "leetcode"]
words2 = ["e", "oo"]
```

We need to check each word in `words1` against all words in `words2`:

- **"amazon"**: Has 'e'? No → not universal
- **"apple"**: Has 'e'? Yes. Has 'oo'? No (only one 'o') → not universal
- **"facebook"**: Has 'e'? Yes. Has 'oo'? Yes (contains "oo") → universal
- **"google"**: Has 'e'? Yes. Has 'oo'? No (only one 'o') → not universal
- **"leetcode"**: Has 'e'? Yes. Has 'oo'? No → not universal

Result: `["facebook"]`

The key insight: Instead of checking each `words2` string separately against each `words1` string, we can combine all requirements from `words2` into a single "maximum frequency" requirement. For example, if `words2 = ["ab", "aac"]`, we need at least 1 'b' (from "ab") and at least 2 'a's (from "aac", not "ab").

## Brute Force Approach

The most straightforward approach is to check each word in `words1` against every word in `words2`:

1. For each word `a` in `words1`:
   - Count character frequencies in `a`
   - For each word `b` in `words2`:
     - Count character frequencies in `b`
     - Check if every character in `b` appears at least as many times in `a`
   - If all checks pass, add `a` to results

This approach is simple but inefficient. If `words1` has `n` words of average length `L1`, and `words2` has `m` words of average length `L2`, we're doing `O(n × m × (L1 + L2))` operations. For large inputs, this becomes too slow.

## Optimized Approach

The optimization comes from realizing we don't need to check each `words2` string separately. Instead, we can create a **combined requirement**:

1. For each character from 'a' to 'z', find the **maximum frequency** required across all strings in `words2`
2. For each word in `words1`, check if it satisfies this combined requirement

Why does this work? If a word satisfies the maximum frequency requirement for each character, it automatically satisfies every individual string in `words2`. Conversely, if it fails any character's maximum requirement, at least one `words2` string won't be a subset.

Example: `words2 = ["ab", "aac"]`

- Character requirements: 'a': max(1, 2) = 2, 'b': max(1, 0) = 1, 'c': max(0, 1) = 1
- A word needs at least 2 'a's, 1 'b', and 1 'c' to be universal

## Optimal Solution

We implement this by:

1. Building a `maxFreq` array of size 26 (for 'a'-'z') with maximum frequencies from `words2`
2. For each word in `words1`, count its character frequencies and check if all are ≥ corresponding `maxFreq` values
3. Collect words that pass the check

<div class="code-group">

```python
# Time: O(n * L1 + m * L2) where n = len(words1), m = len(words2),
#       L1 = avg length in words1, L2 = avg length in words2
# Space: O(1) for frequency arrays (fixed size 26)
def wordSubsets(words1, words2):
    # Step 1: Build combined requirement from all words in words2
    # max_freq stores the maximum frequency needed for each character
    max_freq = [0] * 26

    for word in words2:
        # Count frequencies in current word
        curr_freq = [0] * 26
        for ch in word:
            curr_freq[ord(ch) - ord('a')] += 1

        # Update max_freq with the maximum needed for each character
        for i in range(26):
            max_freq[i] = max(max_freq[i], curr_freq[i])

    # Step 2: Check each word in words1 against the combined requirement
    result = []

    for word in words1:
        # Count frequencies in current word from words1
        word_freq = [0] * 26
        for ch in word:
            word_freq[ord(ch) - ord('a')] += 1

        # Check if this word satisfies all character requirements
        is_universal = True
        for i in range(26):
            if word_freq[i] < max_freq[i]:
                is_universal = False
                break

        if is_universal:
            result.append(word)

    return result
```

```javascript
// Time: O(n * L1 + m * L2) where n = words1.length, m = words2.length,
//       L1 = avg length in words1, L2 = avg length in words2
// Space: O(1) for frequency arrays (fixed size 26)
function wordSubsets(words1, words2) {
  // Step 1: Build combined requirement from all words in words2
  // maxFreq stores the maximum frequency needed for each character
  const maxFreq = new Array(26).fill(0);

  for (const word of words2) {
    // Count frequencies in current word
    const currFreq = new Array(26).fill(0);
    for (const ch of word) {
      currFreq[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
    }

    // Update maxFreq with the maximum needed for each character
    for (let i = 0; i < 26; i++) {
      maxFreq[i] = Math.max(maxFreq[i], currFreq[i]);
    }
  }

  // Step 2: Check each word in words1 against the combined requirement
  const result = [];

  for (const word of words1) {
    // Count frequencies in current word from words1
    const wordFreq = new Array(26).fill(0);
    for (const ch of word) {
      wordFreq[ch.charCodeAt(0) - "a".charCodeAt(0)]++;
    }

    // Check if this word satisfies all character requirements
    let isUniversal = true;
    for (let i = 0; i < 26; i++) {
      if (wordFreq[i] < maxFreq[i]) {
        isUniversal = false;
        break;
      }
    }

    if (isUniversal) {
      result.push(word);
    }
  }

  return result;
}
```

```java
// Time: O(n * L1 + m * L2) where n = words1.length, m = words2.length,
//       L1 = avg length in words1, L2 = avg length in words2
// Space: O(1) for frequency arrays (fixed size 26)
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> wordSubsets(String[] words1, String[] words2) {
        // Step 1: Build combined requirement from all words in words2
        // maxFreq stores the maximum frequency needed for each character
        int[] maxFreq = new int[26];

        for (String word : words2) {
            // Count frequencies in current word
            int[] currFreq = new int[26];
            for (char ch : word.toCharArray()) {
                currFreq[ch - 'a']++;
            }

            // Update maxFreq with the maximum needed for each character
            for (int i = 0; i < 26; i++) {
                maxFreq[i] = Math.max(maxFreq[i], currFreq[i]);
            }
        }

        // Step 2: Check each word in words1 against the combined requirement
        List<String> result = new ArrayList<>();

        for (String word : words1) {
            // Count frequencies in current word from words1
            int[] wordFreq = new int[26];
            for (char ch : word.toCharArray()) {
                wordFreq[ch - 'a']++;
            }

            // Check if this word satisfies all character requirements
            boolean isUniversal = true;
            for (int i = 0; i < 26; i++) {
                if (wordFreq[i] < maxFreq[i]) {
                    isUniversal = false;
                    break;
                }
            }

            if (isUniversal) {
                result.add(word);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n × L1 + m × L2)` where:

- `n` = number of words in `words1`
- `L1` = average length of words in `words1`
- `m` = number of words in `words2`
- `L2` = average length of words in `words2`

We process each character in `words2` once to build the combined requirement (`m × L2`), then process each character in `words1` once to check against that requirement (`n × L1`).

**Space Complexity:** `O(1)` for the frequency arrays, which are fixed size (26 elements) regardless of input size. The output list is not counted in auxiliary space complexity.

## Common Mistakes

1. **Not combining requirements from `words2`**: Checking each `words1` word against each `words2` word separately leads to `O(n × m × (L1 + L2))` time, which times out for large inputs.

2. **Incorrect frequency comparison**: When building the combined requirement, you must take the **maximum** frequency for each character across all `words2` strings, not the sum. Summing would overcount (e.g., `["a", "a"]` would require 2 'a's instead of 1).

3. **Forgetting to break early**: When checking a `words1` word against requirements, break as soon as you find a character where the word's frequency is less than required. Continuing to check other characters wastes time.

4. **Off-by-one with character indexing**: When converting characters to array indices, remember `'a' - 'a' = 0`, `'b' - 'a' = 1`, etc. Using ASCII values directly without subtracting `'a'` will cause index out of bounds errors.

## When You'll See This Pattern

This "combined requirement" or "maximum constraint" pattern appears in problems where you need to satisfy multiple conditions simultaneously:

1. **Find Common Characters (LeetCode 1002)**: Find characters common to all strings in an array, considering multiplicity. Similar frequency counting and taking minimums across strings.

2. **Custom Sort String (LeetCode 791)**: Sort a string based on a custom order, requiring tracking character frequencies and custom ordering.

3. **Minimum Window Substring (LeetCode 76)**: Find the minimum window in a string containing all characters of another string with required frequencies—uses similar frequency counting but with sliding window optimization.

The core technique is using fixed-size frequency arrays (or hash maps) to track character counts, then combining requirements through max/min operations.

## Key Takeaways

1. **Combine multiple constraints**: When checking against multiple requirements, look for ways to combine them into a single check. Taking maximums (for "at least" constraints) or minimums (for "at most" constraints) is often the key.

2. **Fixed-size arrays for bounded character sets**: For lowercase English letters (26 characters), a size-26 array is more efficient than a hash map. Know when to use arrays (bounded, dense) vs. hash maps (unbounded, sparse).

3. **Early termination optimization**: When checking if a word meets requirements, break as soon as you find a failing condition rather than checking all characters.

[Practice this problem on CodeJeet](/problem/word-subsets)
