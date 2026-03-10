---
title: "How to Solve Substring with Concatenation of All Words — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Substring with Concatenation of All Words. Hard difficulty, 34.0% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2027-01-26"
category: "dsa-patterns"
tags:
  ["substring-with-concatenation-of-all-words", "hash-table", "string", "sliding-window", "hard"]
---

# How to Solve Substring with Concatenation of All Words

This problem asks us to find all starting indices in string `s` where a substring exists that is a concatenation of every word in `words` exactly once, in any order. The tricky part is that `words` can have duplicates, all words have the same length, and we need to find _all_ valid starting positions—not just one. This combines the challenges of substring search with permutation matching, making it significantly harder than simple pattern matching.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `s = "barfoothefoobarman"`, `words = ["foo", "bar"]`

**Step 1: Understand the parameters**

- Each word has length 3 (all words same length)
- We need to find substrings of length `3 * 2 = 6` (word length × number of words)
- The concatenation could be `"foobar"` or `"barfoo"`

**Step 2: Check starting at index 0**

- Substring `s[0:6] = "barfoo"`
- Split into chunks of size 3: `"bar"`, `"foo"`
- Check if these match our words: `{"bar", "foo"}` matches `{"foo", "bar"}`
- ✅ Index 0 is valid

**Step 3: Check starting at index 1**

- Substring `s[1:7] = "arfoot"`
- Chunks: `"arf"`, `"oot"` → neither matches `"foo"` or `"bar"`
- ❌ Not valid

**Step 4: Check starting at index 3**

- Substring `s[3:9] = "foothe"`
- Chunks: `"foo"`, `"the"` → `"the"` doesn't match
- ❌ Not valid

**Step 5: Check starting at index 9**

- Substring `s[9:15] = "foobar"`
- Chunks: `"foo"`, `"bar"` → matches our words
- ✅ Index 9 is valid

**Result:** `[0, 9]`

The naive approach would check every starting index, but we can optimize this significantly.

## Brute Force Approach

The most straightforward solution is to:

1. For each starting index `i` in `s` where `i + total_length <= len(s)`
2. Extract the substring of length `total_length`
3. Split it into chunks of size `word_length`
4. Check if the multiset of chunks equals the multiset of `words`

This works but is extremely inefficient. For each of `n` starting positions, we:

- Create a substring (O(k) where k = total_length)
- Split it into m chunks (O(m))
- Compare two multisets (O(m log m) if sorted, O(m) with hash maps but with overhead)

The total time would be O(n × m × word_length), which is O(n²) in worst case. With `n` up to 10⁴ and `m` up to 5000, this is far too slow.

<div class="code-group">

```python
# Time: O(n * m * word_len) | Space: O(m)
def findSubstring_brute(s, words):
    if not s or not words:
        return []

    word_len = len(words[0])
    total_len = word_len * len(words)
    result = []

    # Create frequency map of words
    from collections import Counter
    word_count = Counter(words)

    # Check every possible starting position
    for i in range(len(s) - total_len + 1):
        # Extract and split the substring
        substring = s[i:i + total_len]
        chunks = [substring[j:j + word_len] for j in range(0, total_len, word_len)]

        # Check if chunks match words
        chunk_count = Counter(chunks)
        if chunk_count == word_count:
            result.append(i)

    return result
```

```javascript
// Time: O(n * m * word_len) | Space: O(m)
function findSubstringBrute(s, words) {
  if (!s || !words || words.length === 0) return [];

  const wordLen = words[0].length;
  const totalLen = wordLen * words.length;
  const result = [];

  // Create frequency map of words
  const wordCount = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Check every possible starting position
  for (let i = 0; i <= s.length - totalLen; i++) {
    // Extract and split the substring
    const substring = s.substring(i, i + totalLen);
    const chunks = [];
    for (let j = 0; j < totalLen; j += wordLen) {
      chunks.push(substring.substring(j, j + wordLen));
    }

    // Check if chunks match words
    const chunkCount = {};
    let valid = true;
    chunks.forEach((chunk) => {
      chunkCount[chunk] = (chunkCount[chunk] || 0) + 1;
    });

    // Compare frequency maps
    for (const word in wordCount) {
      if (wordCount[word] !== chunkCount[word]) {
        valid = false;
        break;
      }
    }

    if (valid) {
      // Also check for extra words in chunks not in words
      for (const chunk in chunkCount) {
        if (!wordCount[chunk]) {
          valid = false;
          break;
        }
      }
    }

    if (valid) result.push(i);
  }

  return result;
}
```

```java
// Time: O(n * m * word_len) | Space: O(m)
import java.util.*;

public List<Integer> findSubstringBrute(String s, String[] words) {
    List<Integer> result = new ArrayList<>();
    if (s == null || s.length() == 0 || words == null || words.length == 0) {
        return result;
    }

    int wordLen = words[0].length();
    int totalLen = wordLen * words.length;

    // Create frequency map of words
    Map<String, Integer> wordCount = new HashMap<>();
    for (String word : words) {
        wordCount.put(word, wordCount.getOrDefault(word, 0) + 1);
    }

    // Check every possible starting position
    for (int i = 0; i <= s.length() - totalLen; i++) {
        // Extract and split the substring
        String substring = s.substring(i, i + totalLen);
        Map<String, Integer> chunkCount = new HashMap<>();

        // Count chunks
        for (int j = 0; j < totalLen; j += wordLen) {
            String chunk = substring.substring(j, j + wordLen);
            chunkCount.put(chunk, chunkCount.getOrDefault(chunk, 0) + 1);
        }

        // Check if frequency maps match
        if (chunkCount.equals(wordCount)) {
            result.add(i);
        }
    }

    return result;
}
```

</div>

## Optimized Approach

The key insight is that we can use a **sliding window** approach, but with a twist. Since all words have the same length, we can think of `s` as having `word_len` different "starting alignments". For example, if word length is 3:

- Alignment 0: indices 0, 3, 6, 9, ...
- Alignment 1: indices 1, 4, 7, 10, ...
- Alignment 2: indices 2, 5, 8, 11, ...

For each alignment, we can slide a window across `s` and maintain counts of words seen. The algorithm:

1. For each starting alignment (0 to word_len-1)
2. Use a sliding window that expands and contracts
3. Maintain a hash map of words in the current window
4. When we have exactly the right count of all words, record the starting index
5. Slide the window forward one word at a time

This reduces the time complexity because we process each character only a constant number of times rather than re-examining entire substrings repeatedly.

## Optimal Solution

Here's the optimized solution using the sliding window technique:

<div class="code-group">

```python
# Time: O(n * word_len) | Space: O(m)
def findSubstring(s, words):
    if not s or not words:
        return []

    word_len = len(words[0])
    num_words = len(words)
    total_len = word_len * num_words
    result = []

    # Create frequency map of words
    from collections import Counter
    word_count = Counter(words)

    # We need to check each possible alignment (0 to word_len-1)
    for start in range(word_len):
        left = start  # Left boundary of sliding window
        right = start  # Right boundary (exclusive)
        current_count = Counter()  # Words in current window

        # Slide the window
        while right + word_len <= len(s):
            # Get the current word
            word = s[right:right + word_len]
            right += word_len

            # If this is a valid word, add it to current window
            if word in word_count:
                current_count[word] += 1

                # If we have too many of this word, shrink window from left
                while current_count[word] > word_count[word]:
                    left_word = s[left:left + word_len]
                    current_count[left_word] -= 1
                    left += word_len

                # Check if we have a valid window
                if right - left == total_len:
                    result.append(left)

                    # Move left boundary one word to the right
                    left_word = s[left:left + word_len]
                    current_count[left_word] -= 1
                    left += word_len
            else:
                # Invalid word found, reset window
                current_count.clear()
                left = right

    return result
```

```javascript
// Time: O(n * word_len) | Space: O(m)
function findSubstring(s, words) {
  if (!s || !words || words.length === 0) return [];

  const wordLen = words[0].length;
  const numWords = words.length;
  const totalLen = wordLen * numWords;
  const result = [];

  // Create frequency map of words
  const wordCount = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Check each possible alignment
  for (let start = 0; start < wordLen; start++) {
    let left = start;
    let right = start;
    const currentCount = {};
    let wordsFound = 0;

    while (right + wordLen <= s.length) {
      // Get the current word
      const word = s.substring(right, right + wordLen);
      right += wordLen;

      // If this is a valid word
      if (wordCount[word]) {
        currentCount[word] = (currentCount[word] || 0) + 1;
        wordsFound++;

        // Shrink window if we have too many of this word
        while (currentCount[word] > wordCount[word]) {
          const leftWord = s.substring(left, left + wordLen);
          currentCount[leftWord]--;
          wordsFound--;
          left += wordLen;
        }

        // Check if we have a valid window
        if (wordsFound === numWords) {
          result.push(left);

          // Move left boundary one word to the right
          const leftWord = s.substring(left, left + wordLen);
          currentCount[leftWord]--;
          wordsFound--;
          left += wordLen;
        }
      } else {
        // Invalid word found, reset window
        Object.keys(currentCount).forEach((key) => delete currentCount[key]);
        wordsFound = 0;
        left = right;
      }
    }
  }

  return result;
}
```

```java
// Time: O(n * word_len) | Space: O(m)
import java.util.*;

public List<Integer> findSubstring(String s, String[] words) {
    List<Integer> result = new ArrayList<>();
    if (s == null || s.length() == 0 || words == null || words.length == 0) {
        return result;
    }

    int wordLen = words[0].length();
    int numWords = words.length;
    int totalLen = wordLen * numWords;

    // Create frequency map of words
    Map<String, Integer> wordCount = new HashMap<>();
    for (String word : words) {
        wordCount.put(word, wordCount.getOrDefault(word, 0) + 1);
    }

    // Check each possible alignment
    for (int start = 0; start < wordLen; start++) {
        int left = start;
        int right = start;
        Map<String, Integer> currentCount = new HashMap<>();
        int wordsFound = 0;

        while (right + wordLen <= s.length()) {
            // Get the current word
            String word = s.substring(right, right + wordLen);
            right += wordLen;

            // If this is a valid word
            if (wordCount.containsKey(word)) {
                currentCount.put(word, currentCount.getOrDefault(word, 0) + 1);
                wordsFound++;

                // Shrink window if we have too many of this word
                while (currentCount.get(word) > wordCount.get(word)) {
                    String leftWord = s.substring(left, left + wordLen);
                    currentCount.put(leftWord, currentCount.get(leftWord) - 1);
                    wordsFound--;
                    left += wordLen;
                }

                // Check if we have a valid window
                if (wordsFound == numWords) {
                    result.add(left);

                    // Move left boundary one word to the right
                    String leftWord = s.substring(left, left + wordLen);
                    currentCount.put(leftWord, currentCount.get(leftWord) - 1);
                    wordsFound--;
                    left += wordLen;
                }
            } else {
                // Invalid word found, reset window
                currentCount.clear();
                wordsFound = 0;
                left = right;
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × word_len)

- We process each alignment (word_len iterations)
- For each alignment, we slide through the string with O(n/word_len) steps
- Each step processes one word of length word_len
- Total: O(word_len × (n/word_len) × word_len) = O(n × word_len)

**Space Complexity:** O(m)

- We store frequency maps for the words
- The word_count map uses O(m) space
- The current_count map uses at most O(m) space
- Where m is the number of unique words

## Common Mistakes

1. **Not handling duplicate words in `words` array**: Candidates often use sets instead of frequency maps, forgetting that `words` can contain duplicates. Always check the problem constraints carefully.

2. **Incorrect window resets**: When an invalid word is encountered, you must completely reset the window, not just move the left pointer. The invalid word breaks any possible concatenation.

3. **Off-by-one errors with string indices**: Remember that `s.substring(i, j)` in most languages includes `i` but excludes `j`. Also, when checking `right + word_len <= len(s)`, the `<=` is crucial.

4. **Forgetting to check all alignments**: The optimization requires checking each possible starting alignment (0 to word_len-1). Missing this gives incorrect results for some test cases.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Sliding Window with Frequency Counts**: Similar to "Minimum Window Substring" (Hard), but here the window contains discrete units (words) rather than characters. The core idea of maintaining counts and shrinking/expanding the window is the same.

2. **Fixed-Length Pattern Matching**: Problems like "Repeated DNA Sequences" (Medium) also use the idea of breaking strings into fixed-length chunks and tracking them with hash maps.

3. **Permutation in String**: "Permutation in String" (Medium) is a simpler version where you check if one string contains a permutation of another. This problem extends that to multiple words.

## Key Takeaways

1. **When words have fixed length, consider alignments**: The key optimization comes from realizing you only need to check `word_len` different starting positions, not every index in `s`.

2. **Sliding window works with discrete units**: You can adapt the sliding window technique to work with words instead of characters by treating each word as a unit.

3. **Frequency maps handle duplicates elegantly**: Always use frequency maps (not sets) when dealing with problems that might have duplicate elements to match.

Related problems: [Minimum Window Substring](/problem/minimum-window-substring)
