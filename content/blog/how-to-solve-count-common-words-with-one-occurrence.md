---
title: "How to Solve Count Common Words With One Occurrence — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Common Words With One Occurrence. Easy difficulty, 73.2% acceptance rate. Topics: Array, Hash Table, String, Counting."
date: "2027-04-18"
category: "dsa-patterns"
tags: ["count-common-words-with-one-occurrence", "array", "hash-table", "string", "easy"]
---

# How to Solve Count Common Words With One Occurrence

You're given two arrays of strings, `words1` and `words2`. Your task is to count how many strings appear exactly once in **both** arrays. This problem looks simple at first glance, but it's a great exercise in careful counting and hash table usage. The tricky part is ensuring we count words that are unique in **each** array, not just words that appear in both arrays.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
words1 = ["apple", "banana", "apple", "cherry"]
words2 = ["banana", "cherry", "date", "cherry"]
```

**Step-by-step reasoning:**

1. First, we need to count occurrences in each array separately:
   - `words1`: {"apple": 2, "banana": 1, "cherry": 1}
   - `words2`: {"banana": 1, "cherry": 2, "date": 1}

2. Now we look for words that appear exactly once in **both** arrays:
   - "apple": Appears twice in `words1` → ❌ (not exactly once in first array)
   - "banana": Appears once in `words1` ✅ and once in `words2` ✅ → Count it!
   - "cherry": Appears once in `words1` ✅ but twice in `words2` ❌ → Don't count
   - "date": Doesn't appear in `words1` ❌ → Don't count

3. Final count: Only "banana" meets both conditions, so answer = 1.

The key insight: We need to track frequency in each array separately, then find words where both frequencies equal 1.

## Brute Force Approach

A naive approach would be to check each word in `words1` against all words in `words2`:

1. For each word in `words1`, count its occurrences in `words1`
2. For each word in `words2`, count its occurrences in `words2`
3. For each word that appears in both arrays, check if both counts equal 1

The problem with this approach is efficiency. Counting occurrences by scanning arrays repeatedly gives us O(n²) time complexity where n is the total number of words. If each array has 1000 words, we'd need to make millions of comparisons.

Even if we only check words that appear in both arrays, we still need efficient frequency counting. The brute force teaches us that we need a data structure to track frequencies efficiently.

## Optimal Solution

The optimal solution uses hash tables (dictionaries/maps) to count frequencies in O(n) time. Here's the step-by-step approach:

1. Count frequency of each word in `words1` using a hash table
2. Count frequency of each word in `words2` using another hash table
3. Iterate through one hash table (preferably the smaller one for efficiency)
4. For each word, check if it appears exactly once in both hash tables
5. Count all words that satisfy this condition

<div class="code-group">

```python
# Time: O(n + m) where n = len(words1), m = len(words2)
# Space: O(n + m) for storing frequency counts
def countWords(words1, words2):
    """
    Count words that appear exactly once in both arrays.

    Args:
        words1: List of strings
        words2: List of strings

    Returns:
        Integer count of words meeting the criteria
    """
    # Step 1: Count frequencies in first array
    freq1 = {}
    for word in words1:
        freq1[word] = freq1.get(word, 0) + 1

    # Step 2: Count frequencies in second array
    freq2 = {}
    for word in words2:
        freq2[word] = freq2.get(word, 0) + 1

    # Step 3: Initialize counter for valid words
    count = 0

    # Step 4: Check words from first array (could also check from second)
    for word, count1 in freq1.items():
        # Word must appear exactly once in first array
        if count1 == 1:
            # Check if it also appears exactly once in second array
            # Using get() with default 0 handles case where word isn't in freq2
            if freq2.get(word, 0) == 1:
                count += 1

    return count
```

```javascript
// Time: O(n + m) where n = words1.length, m = words2.length
// Space: O(n + m) for storing frequency counts
function countWords(words1, words2) {
  /**
   * Count words that appear exactly once in both arrays.
   *
   * @param {string[]} words1 - First array of words
   * @param {string[]} words2 - Second array of words
   * @return {number} Count of words meeting the criteria
   */

  // Step 1: Count frequencies in first array
  const freq1 = new Map();
  for (const word of words1) {
    freq1.set(word, (freq1.get(word) || 0) + 1);
  }

  // Step 2: Count frequencies in second array
  const freq2 = new Map();
  for (const word of words2) {
    freq2.set(word, (freq2.get(word) || 0) + 1);
  }

  // Step 3: Initialize counter for valid words
  let count = 0;

  // Step 4: Check words from first array
  for (const [word, count1] of freq1) {
    // Word must appear exactly once in first array
    if (count1 === 1) {
      // Check if it also appears exactly once in second array
      // Using get() with undefined check handles missing words
      if (freq2.get(word) === 1) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n + m) where n = words1.length, m = words2.length
// Space: O(n + m) for storing frequency counts
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int countWords(String[] words1, String[] words2) {
        /**
         * Count words that appear exactly once in both arrays.
         *
         * @param words1 First array of words
         * @param words2 Second array of words
         * @return Count of words meeting the criteria
         */

        // Step 1: Count frequencies in first array
        Map<String, Integer> freq1 = new HashMap<>();
        for (String word : words1) {
            freq1.put(word, freq1.getOrDefault(word, 0) + 1);
        }

        // Step 2: Count frequencies in second array
        Map<String, Integer> freq2 = new HashMap<>();
        for (String word : words2) {
            freq2.put(word, freq2.getOrDefault(word, 0) + 1);
        }

        // Step 3: Initialize counter for valid words
        int count = 0;

        // Step 4: Check words from first array
        for (Map.Entry<String, Integer> entry : freq1.entrySet()) {
            String word = entry.getKey();
            int count1 = entry.getValue();

            // Word must appear exactly once in first array
            if (count1 == 1) {
                // Check if it also appears exactly once in second array
                // getOrDefault handles case where word isn't in freq2
                if (freq2.getOrDefault(word, 0) == 1) {
                    count++;
                }
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- We make one pass through `words1` to build `freq1`: O(n)
- We make one pass through `words2` to build `freq2`: O(m)
- We iterate through one frequency map (worst case O(n) or O(m)): O(min(n, m))
- Total: O(n + m + min(n, m)) = O(n + m)

**Space Complexity: O(n + m)**

- `freq1` stores at most n entries (if all words are unique)
- `freq2` stores at most m entries (if all words are unique)
- In the worst case, no words are repeated, so we store all words from both arrays

## Common Mistakes

1. **Checking only intersection, not uniqueness in both arrays**: Some candidates find words that appear in both arrays, then check if they appear once total. But the problem requires the word to appear exactly once in **each** array. A word could appear once in `words1` and twice in `words2` - this shouldn't be counted.

2. **Using sets instead of frequency counters**: Sets only tell you if a word exists, not how many times it appears. You might think to find the intersection of two sets, but this misses the "exactly once" requirement.

3. **Not handling missing words properly**: When checking a word from `freq1` in `freq2`, you must handle the case where the word doesn't exist in `freq2`. Using direct access like `freq2[word]` in Python or `freq2.get(word)` without a default in JavaScript/Java can cause errors or incorrect comparisons.

4. **Double counting when iterating through both maps**: If you iterate through both `freq1` and `freq2` and add to count in both loops, you'll double count words. Only iterate through one map to avoid this.

## When You'll See This Pattern

This frequency counting pattern appears in many string and array problems:

1. **Intersection of Two Arrays (LeetCode 349)**: Find common elements between two arrays. Similar to our problem but doesn't require uniqueness counts.

2. **Uncommon Words from Two Sentences (LeetCode 884)**: Find words that appear exactly once across two sentences. Very similar pattern - count frequencies and find words with count = 1.

3. **Kth Distinct String in an Array (LeetCode 2053)**: Find the kth distinct string in an array. Uses the same frequency counting technique to identify unique elements.

4. **First Unique Character in a String (LeetCode 387)**: Find the first non-repeating character. Again, count frequencies first, then scan for count = 1.

The core pattern is: **When you need to track occurrences or uniqueness, reach for a hash table to count frequencies efficiently.**

## Key Takeaways

1. **Hash tables are your go-to for counting problems**: Whenever you need to track how many times something appears, a hash table (dictionary/map) is usually the right tool. It gives you O(1) access to check and update counts.

2. **Read requirements carefully**: "Exactly once in each array" is different from "appears in both arrays" or "appears once total." Always verify you're checking the right condition before coding.

3. **Consider which map to iterate**: For efficiency, iterate through the smaller frequency map. In our solution, we could check `if len(freq1) < len(freq2)` and iterate through the smaller one, though with O(n + m) complexity it doesn't change the big-O.

Related problems: [Intersection of Two Arrays](/problem/intersection-of-two-arrays), [Uncommon Words from Two Sentences](/problem/uncommon-words-from-two-sentences), [Kth Distinct String in an Array](/problem/kth-distinct-string-in-an-array)
