---
title: "How to Solve Count Pairs Of Similar Strings — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Pairs Of Similar Strings. Easy difficulty, 73.6% acceptance rate. Topics: Array, Hash Table, String, Bit Manipulation, Counting."
date: "2028-01-24"
category: "dsa-patterns"
tags: ["count-pairs-of-similar-strings", "array", "hash-table", "string", "easy"]
---

# How to Solve Count Pairs Of Similar Strings

This problem asks us to count pairs of strings that are "similar" — meaning they contain exactly the same set of characters, regardless of frequency or order. The tricky part is efficiently comparing character sets across many strings without expensive pairwise comparisons. What makes this interesting is that we need to transform each string into a canonical representation of its character set, then count how many strings share each representation.

## Visual Walkthrough

Let's trace through a concrete example: `words = ["aba", "aabb", "abcd", "bac", "aabc"]`

**Step 1: Transform each string to its character set representation**

- "aba" → characters: {'a', 'b'} → sorted: "ab"
- "aabb" → characters: {'a', 'b'} → sorted: "ab"
- "abcd" → characters: {'a', 'b', 'c', 'd'} → sorted: "abcd"
- "bac" → characters: {'a', 'b', 'c'} → sorted: "abc"
- "aabc" → characters: {'a', 'b', 'c'} → sorted: "abc"

**Step 2: Count frequencies of each representation**

- "ab": appears 2 times
- "abcd": appears 1 time
- "abc": appears 2 times

**Step 3: Calculate pairs from frequencies**
For each representation with count `n`:

- Number of pairs = `n * (n-1) / 2`
- "ab": 2 strings → `2 * 1 / 2 = 1` pair
- "abc": 2 strings → `2 * 1 / 2 = 1` pair
- "abcd": 1 string → `1 * 0 / 2 = 0` pairs

**Total pairs**: 1 + 1 + 0 = 2

The pairs are: ("aba", "aabb") and ("bac", "aabc")

## Brute Force Approach

The most straightforward approach is to compare every pair of strings directly:

1. For each string `i` from 0 to n-1
2. For each string `j` from i+1 to n-1
3. Check if the two strings have the same character set
4. If yes, increment the count

The character set comparison can be done by converting each string to a set of characters and checking if the sets are equal.

**Why this is inefficient:**

- Time complexity: O(n² \* m) where n is number of strings and m is average string length
- For n=1000 strings, that's ~500,000 comparisons
- Each comparison involves building sets (O(m)) and comparing them
- This quickly becomes impractical for larger inputs

## Optimal Solution

The key insight is that we don't need to compare strings pairwise. Instead, we can transform each string into a canonical representation of its character set, then count how many strings share each representation. Strings with the same representation are similar to each other.

We have several options for the canonical representation:

1. **Sorted unique characters**: Convert to set, sort, join to string
2. **Bitmask**: For lowercase English letters only, use a 26-bit integer
3. **Frozenset**: Use the set itself as a hashable key

The bitmask approach is most efficient for this problem since we're told strings contain only lowercase English letters.

<div class="code-group">

```python
# Time: O(n * m) where n = len(words), m = avg word length
# Space: O(n) for the frequency dictionary
def similarPairs(words):
    """
    Count pairs of strings that contain exactly the same characters.

    Approach:
    1. For each word, create a bitmask representing which letters it contains
    2. Count how many words have each bitmask
    3. For each bitmask with count n, add n*(n-1)/2 to total pairs

    Example:
    words = ["aba", "aabb", "abcd", "bac", "aabc"]
    Bitmasks: "ab"=3, "ab"=3, "abcd"=15, "abc"=7, "abc"=7
    Frequencies: {3:2, 15:1, 7:2}
    Pairs: 2C2 + 1C2 + 2C2 = 1 + 0 + 1 = 2
    """
    from collections import defaultdict

    # Dictionary to count frequencies of each bitmask
    freq = defaultdict(int)

    for word in words:
        # Initialize bitmask to 0 (no letters)
        bitmask = 0

        # For each character in the word, set the corresponding bit
        for ch in word:
            # Calculate bit position: 'a' -> 0, 'b' -> 1, ..., 'z' -> 25
            bit_position = ord(ch) - ord('a')
            # Set the bit at this position using bitwise OR
            bitmask |= (1 << bit_position)

        # Increment count for this bitmask
        freq[bitmask] += 1

    # Count pairs: for n strings with same bitmask, we have n*(n-1)/2 pairs
    total_pairs = 0
    for count in freq.values():
        # Combination formula: n choose 2 = n*(n-1)/2
        total_pairs += count * (count - 1) // 2

    return total_pairs
```

```javascript
// Time: O(n * m) where n = words.length, m = avg word length
// Space: O(n) for the frequency map
function similarPairs(words) {
  /**
   * Count pairs of strings that contain exactly the same characters.
   *
   * Approach:
   * 1. For each word, create a bitmask representing which letters it contains
   * 2. Count how many words have each bitmask
   * 3. For each bitmask with count n, add n*(n-1)/2 to total pairs
   */

  // Map to store frequency of each bitmask
  const freq = new Map();

  for (const word of words) {
    // Initialize bitmask to 0 (no letters)
    let bitmask = 0;

    // For each character, set the corresponding bit
    for (const ch of word) {
      // Calculate bit position: 'a' -> 0, 'b' -> 1, ..., 'z' -> 25
      const bitPosition = ch.charCodeAt(0) - "a".charCodeAt(0);
      // Set the bit at this position using bitwise OR
      bitmask |= 1 << bitPosition;
    }

    // Update frequency for this bitmask
    freq.set(bitmask, (freq.get(bitmask) || 0) + 1);
  }

  // Calculate total pairs using combination formula
  let totalPairs = 0;
  for (const count of freq.values()) {
    // n choose 2 = n*(n-1)/2
    totalPairs += (count * (count - 1)) / 2;
  }

  return totalPairs;
}
```

```java
// Time: O(n * m) where n = words.length, m = avg word length
// Space: O(n) for the frequency map
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int similarPairs(String[] words) {
        /**
         * Count pairs of strings that contain exactly the same characters.
         *
         * Approach:
         * 1. For each word, create a bitmask representing which letters it contains
         * 2. Count how many words have each bitmask
         * 3. For each bitmask with count n, add n*(n-1)/2 to total pairs
         */

        // Map to store frequency of each bitmask
        Map<Integer, Integer> freq = new HashMap<>();

        for (String word : words) {
            // Initialize bitmask to 0 (no letters)
            int bitmask = 0;

            // For each character, set the corresponding bit
            for (int i = 0; i < word.length(); i++) {
                char ch = word.charAt(i);
                // Calculate bit position: 'a' -> 0, 'b' -> 1, ..., 'z' -> 25
                int bitPosition = ch - 'a';
                // Set the bit at this position using bitwise OR
                bitmask |= (1 << bitPosition);
            }

            // Update frequency for this bitmask
            freq.put(bitmask, freq.getOrDefault(bitmask, 0) + 1);
        }

        // Calculate total pairs using combination formula
        int totalPairs = 0;
        for (int count : freq.values()) {
            // n choose 2 = n*(n-1)/2
            totalPairs += count * (count - 1) / 2;
        }

        return totalPairs;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m)**

- `n`: number of strings in the input array
- `m`: average length of each string
- We process each character of each string once to build the bitmask: O(n × m)
- We then iterate through the frequency map: O(n) in worst case
- Total: O(n × m + n) = O(n × m)

**Space Complexity: O(n)**

- We store a frequency map with at most `n` entries (one for each unique bitmask)
- In worst case, all strings have different character sets, so we store `n` entries
- The bitmask itself is just an integer (constant space per word during processing)

## Common Mistakes

1. **Forgetting that order doesn't matter**: Some candidates try to compare strings directly or sort the entire string. Remember: "aba" and "aab" are similar because they have the same characters {'a', 'b'}, even though they're different strings.

2. **Incorrect pair counting**: The formula for counting pairs from `n` items is `n × (n-1) / 2`, not `n × n` or `n × (n+1) / 2`. For example, if 3 strings share the same character set, they form 3 pairs: (1,2), (1,3), (2,3).

3. **Not handling duplicate characters within a string**: "aaabbb" and "ab" should be similar because they contain the same characters {'a', 'b'}. Using a set or bitmask automatically handles duplicates.

4. **Assuming only lowercase letters without checking**: The problem states strings consist of lowercase English letters, so the 26-bit mask approach works. In a more general case (any Unicode), you'd need to use a set or sorted string representation.

## When You'll See This Pattern

This problem uses the **"canonical representation"** pattern, where you transform data into a standard form that makes comparison trivial. You'll see this pattern in:

1. **Group Anagrams (LeetCode 49)**: Transform each string to a sorted version or character count array to group anagrams together.

2. **Find Duplicate Subtrees (LeetCode 652)**: Serialize each subtree to a string representation to identify duplicates.

3. **Valid Anagram (LeetCode 242)**: Compare character frequency arrays or sorted strings to check if two strings are anagrams.

The core idea is always the same: instead of comparing complex objects directly (which can be expensive), create a hashable representation that captures the essential properties for comparison.

## Key Takeaways

1. **Canonical representations simplify comparisons**: When you need to compare objects based on some property (character sets, anagrams, etc.), transform them to a standard form first. This turns O(n²) pairwise comparisons into O(n) grouping.

2. **Bitmasks are powerful for small domains**: When dealing with limited character sets (like 26 lowercase letters), bitmasks provide O(1) character set operations and comparisons.

3. **Combinatorics for pair counting**: When counting pairs from groups, remember the formula `n × (n-1) / 2`. This comes up frequently in problems involving similarity, collisions, or relationships between items in the same group.

Related problems: [Sort Characters By Frequency](/problem/sort-characters-by-frequency), [Count the Number of Consistent Strings](/problem/count-the-number-of-consistent-strings), [Number of Good Paths](/problem/number-of-good-paths)
