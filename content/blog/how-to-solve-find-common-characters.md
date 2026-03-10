---
title: "How to Solve Find Common Characters — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Common Characters. Easy difficulty, 74.7% acceptance rate. Topics: Array, Hash Table, String."
date: "2027-07-12"
category: "dsa-patterns"
tags: ["find-common-characters", "array", "hash-table", "string", "easy"]
---

# How to Solve Find Common Characters

This problem asks us to find all characters that appear in every string of an array, including duplicates. For example, if "a" appears twice in every string, we need to include "a" twice in our result. The challenge is efficiently tracking character frequencies across multiple strings while accounting for minimum counts.

## Visual Walkthrough

Let's trace through `words = ["bella", "label", "roller"]`:

1. **First string "bella"**: Count frequencies: b:1, e:1, l:2, a:1
2. **Second string "label"**: Count frequencies: l:2, a:1, b:1, e:1  
   For each character, we take the minimum between current count and new count:
   - b: min(1,1) = 1
   - e: min(1,1) = 1
   - l: min(2,2) = 2
   - a: min(1,1) = 1
3. **Third string "roller"**: Count frequencies: r:2, o:1, l:2, e:1
   Update minimums:
   - b: min(1,0) = 0 (b doesn't appear in "roller")
   - e: min(1,1) = 1
   - l: min(2,2) = 2
   - a: min(1,0) = 0
   - r: min(0,2) = 0 (r wasn't in our running minimums)
   - o: min(0,1) = 0

Our final minimum counts: e:1, l:2

4. **Build result**: Convert counts to characters: ["e","l","l"]

The key insight: we track the **minimum frequency** of each character across all strings. A character must appear at least that many times in every string to be included.

## Brute Force Approach

A naive approach would be to:

1. For each character in the first string
2. Check how many times it appears in every other string
3. Take the minimum count across all strings
4. Add that character to the result that many times

This is inefficient because:

- We repeatedly count characters in each string
- We process characters that might not even exist in all strings
- Time complexity would be O(n _ m _ k) where n is number of strings, m is average length, and k is unique characters in first string

The brute force misses the opportunity to track frequencies efficiently with hash maps.

## Optimal Solution

We use frequency counting with hash maps (or arrays for fixed character sets). Since we're dealing with lowercase English letters, we can use a 26-element array for efficiency.

**Algorithm:**

1. Initialize a `minFreq` array with maximum possible counts (or use the first word's counts)
2. For each subsequent word:
   - Count character frequencies in current word
   - Update `minFreq` by taking element-wise minimum with current word's counts
3. Convert `minFreq` to result list, repeating characters based on their counts

<div class="code-group">

```python
# Time: O(n * m) where n = len(words), m = avg word length
# Space: O(1) - we use fixed-size arrays (26 elements)
def commonChars(words):
    # Step 1: Initialize min frequency array with counts from first word
    # We use a 26-element array for lowercase English letters
    min_freq = [0] * 26

    # Count characters in first word to initialize our baseline
    for char in words[0]:
        min_freq[ord(char) - ord('a')] += 1

    # Step 2: Process each subsequent word
    for word in words[1:]:
        # Count frequencies in current word
        curr_freq = [0] * 26
        for char in word:
            curr_freq[ord(char) - ord('a')] += 1

        # Update min_freq by taking element-wise minimum
        # This ensures we only keep characters that appear in ALL words
        for i in range(26):
            min_freq[i] = min(min_freq[i], curr_freq[i])

    # Step 3: Build result list from min_freq
    result = []
    for i in range(26):
        # Append character 'a' + i, repeated min_freq[i] times
        result.extend([chr(i + ord('a'))] * min_freq[i])

    return result
```

```javascript
// Time: O(n * m) where n = words.length, m = avg word length
// Space: O(1) - fixed-size array (26 elements)
function commonChars(words) {
  // Step 1: Initialize min frequency array with counts from first word
  const minFreq = new Array(26).fill(0);

  // Count characters in first word
  for (const char of words[0]) {
    minFreq[char.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Step 2: Process each subsequent word
  for (let i = 1; i < words.length; i++) {
    // Count frequencies in current word
    const currFreq = new Array(26).fill(0);
    for (const char of words[i]) {
      currFreq[char.charCodeAt(0) - "a".charCodeAt(0)]++;
    }

    // Update minFreq by taking element-wise minimum
    // This ensures we only keep characters that appear in ALL words
    for (let j = 0; j < 26; j++) {
      minFreq[j] = Math.min(minFreq[j], currFreq[j]);
    }
  }

  // Step 3: Build result array from minFreq
  const result = [];
  for (let i = 0; i < 26; i++) {
    // Add character String.fromCharCode('a'.charCodeAt(0) + i) minFreq[i] times
    const char = String.fromCharCode("a".charCodeAt(0) + i);
    for (let j = 0; j < minFreq[i]; j++) {
      result.push(char);
    }
  }

  return result;
}
```

```java
// Time: O(n * m) where n = words.length, m = avg word length
// Space: O(1) - fixed-size array (26 elements)
public List<String> commonChars(String[] words) {
    // Step 1: Initialize min frequency array with counts from first word
    int[] minFreq = new int[26];

    // Count characters in first word
    for (char c : words[0].toCharArray()) {
        minFreq[c - 'a']++;
    }

    // Step 2: Process each subsequent word
    for (int i = 1; i < words.length; i++) {
        // Count frequencies in current word
        int[] currFreq = new int[26];
        for (char c : words[i].toCharArray()) {
            currFreq[c - 'a']++;
        }

        // Update minFreq by taking element-wise minimum
        // This ensures we only keep characters that appear in ALL words
        for (int j = 0; j < 26; j++) {
            minFreq[j] = Math.min(minFreq[j], currFreq[j]);
        }
    }

    // Step 3: Build result list from minFreq
    List<String> result = new ArrayList<>();
    for (int i = 0; i < 26; i++) {
        // Add character (char)('a' + i) minFreq[i] times
        for (int j = 0; j < minFreq[i]; j++) {
            result.add(String.valueOf((char)('a' + i)));
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m)**

- `n` = number of strings in `words`
- `m` = average length of each string
- We process each character in each string exactly once when counting frequencies
- The element-wise minimum operation on 26 elements is O(1) constant time

**Space Complexity: O(1)**

- We use fixed-size arrays of length 26 for frequency counts
- The output list size depends on input, but this is not counted in auxiliary space complexity
- Even with many strings, our frequency arrays remain constant size (26 elements)

## Common Mistakes

1. **Forgetting to handle empty input**: Always check if `words` is empty. Our solution assumes at least one word exists. In an interview, mention this edge case.

2. **Not using minimum frequency correctly**: Some candidates try to intersect sets instead of tracking counts. Remember: `["aa", "a"]` should return `["a"]`, not `["a", "a"]`. The character "a" appears twice in first word but only once in second, so minimum is 1.

3. **Incorrect array indexing**: When using `ord(char) - ord('a')`, ensure you're working with lowercase letters. The problem doesn't specify case, but examples use lowercase. Always clarify assumptions with the interviewer.

4. **Building result inefficiently**: Avoid nested loops that make result building O(26 × max_count). Use `extend()` in Python or equivalent in other languages for linear construction.

## When You'll See This Pattern

This "minimum frequency intersection" pattern appears in several problems:

1. **Intersection of Two Arrays II (LeetCode 350)**: Similar concept but for two arrays instead of multiple strings. You track frequencies and take minimums.

2. **Find the Difference (LeetCode 389)**: Uses frequency counting to find the extra character.

3. **Valid Anagram (LeetCode 242)**: Compares frequency counts of two strings.

4. **Group Anagrams (LeetCode 49)**: Uses character frequency patterns as keys for grouping.

The core technique is **frequency counting with element-wise operations** (minimum, maximum, comparison). Whenever you need to find common elements with multiplicity, think of tracking counts and taking minimums across all collections.

## Key Takeaways

1. **Minimum frequency intersection**: When finding common elements with duplicates, track the minimum count across all collections. A character must appear at least that many times in every string.

2. **Fixed-size arrays for bounded character sets**: For lowercase English letters (26 characters), use arrays instead of hash maps for better performance and simpler code.

3. **Process incrementally**: Start with the first word's counts, then refine with each subsequent word. This is more efficient than comparing all pairs.

Remember: The element-wise minimum operation ensures that if a character disappears in any subsequent word (count = 0), it gets eliminated from the final result.

Related problems: [Intersection of Two Arrays II](/problem/intersection-of-two-arrays-ii)
