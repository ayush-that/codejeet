---
title: "How to Solve Count Caesar Cipher Pairs — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Caesar Cipher Pairs. Medium difficulty, 50.8% acceptance rate. Topics: Array, Hash Table, Math, String, Counting."
date: "2029-08-08"
category: "dsa-patterns"
tags: ["count-caesar-cipher-pairs", "array", "hash-table", "math", "medium"]
---

# How to Solve Count Caesar Cipher Pairs

This problem asks us to count pairs of strings that are "similar" under a specific transformation rule. Two strings are similar if we can make them equal by repeatedly shifting all characters in one string forward or backward by the same amount (wrapping around from 'z' to 'a' or vice versa). The challenge is recognizing that this is essentially checking if two strings have the same "relative pattern" of characters, which can be encoded in a clever way to enable efficient comparison.

## Visual Walkthrough

Let's walk through a concrete example: `words = ["abc", "bcd", "ace", "xyz", "abd"]`

**Step 1: Understanding the similarity rule**

- "abc" and "bcd" are similar because we can shift "abc" forward by 1 to get "bcd"
- "abc" and "ace" are NOT similar because no single shift can transform "abc" to "ace"
- "abc" and "xyz" are similar because we can shift "abc" forward by 23 (or backward by 3) to get "xyz"

**Step 2: Encoding the pattern**
The key insight is that for two strings to be similar, the _differences_ between consecutive characters must be the same. Let's encode each string by its pattern of differences:

- "abc" → differences: (b-a, c-b) = (1, 1) → pattern: "1,1"
- "bcd" → differences: (c-b, d-c) = (1, 1) → pattern: "1,1"
- "ace" → differences: (c-a, e-c) = (2, 2) → pattern: "2,2"
- "xyz" → differences: (y-x, z-y) = (1, 1) → pattern: "1,1"
- "abd" → differences: (b-a, d-b) = (1, 2) → pattern: "1,2"

**Step 3: Counting pairs**
Strings with the same pattern can be paired together:

- Pattern "1,1": ["abc", "bcd", "xyz"] → 3 strings → pairs = 3 choose 2 = 3
- Pattern "2,2": ["ace"] → 1 string → pairs = 0
- Pattern "1,2": ["abd"] → 1 string → pairs = 0

Total pairs = 3

## Brute Force Approach

A naive approach would compare every pair of strings directly:

1. For each pair (i, j) where i < j
2. Check if they're similar by testing all 26 possible shifts
3. Count the valid pairs

This would require O(n² × m × 26) time, which is far too slow for the constraints (n up to 10⁵, m up to 10). The n² factor alone makes this impossible.

Even a slightly better brute force would still be O(n² × m): for each pair, compare character by character to see if they maintain the same difference throughout. This is still quadratic and won't pass.

## Optimized Approach

The key insight is that we don't need to compare strings pairwise. Instead, we can transform each string into a **canonical representation** that captures its "shift-invariant" pattern. Strings with the same canonical representation are similar.

**Step-by-step reasoning:**

1. **What makes strings similar?**
   Two strings s and t are similar if for all positions i: `(t[i] - s[i]) mod 26` is constant.
   Equivalently: `(s[i] - s[0]) mod 26 = (t[i] - t[0]) mod 26` for all i.

2. **Creating a canonical key:**
   For each string, compute the difference between each character and the first character, modulo 26.
   Convert these differences to a string or tuple that serves as a hash key.

3. **Why modulo 26?**
   Because we're dealing with circular shifts: 'z' shifted forward by 1 becomes 'a', which corresponds to (25 + 1) mod 26 = 0.

4. **Counting pairs efficiently:**
   Once we have all strings grouped by their canonical key, if a group has k strings, it contributes C(k, 2) = k(k-1)/2 pairs.

5. **Alternative approach:**
   Instead of using differences from the first character, we could normalize each string by shifting it so its first character becomes 'a'. This gives the same grouping but might be more intuitive.

## Optimal Solution

The optimal solution computes a hashable key for each string based on the relative differences between characters, then groups strings by these keys using a hash map. The number of pairs from each group is calculated using the combination formula.

<div class="code-group">

```python
# Time: O(n * m) | Space: O(n * m)
def count_similar_pairs(words):
    """
    Count pairs of similar strings where two strings are similar
    if one can be shifted uniformly to match the other.
    """
    from collections import defaultdict

    # Dictionary to count occurrences of each pattern
    pattern_count = defaultdict(int)

    for word in words:
        # Skip empty strings (though constraints say all have length m > 0)
        if not word:
            continue

        # Build the pattern key based on differences between characters
        # We'll use differences from the first character
        pattern_parts = []
        first_char_val = ord(word[0])

        for ch in word:
            # Calculate circular difference: (current - first) mod 26
            diff = (ord(ch) - first_char_val) % 26
            # Convert to string for hashing, pad to ensure consistent keys
            pattern_parts.append(str(diff))

        # Join differences to form a unique key for this pattern
        pattern_key = ','.join(pattern_parts)

        # Count how many strings have this pattern
        pattern_count[pattern_key] += 1

    # Calculate total pairs: for each pattern with k occurrences,
    # we have C(k, 2) = k*(k-1)/2 pairs
    total_pairs = 0
    for count in pattern_count.values():
        total_pairs += count * (count - 1) // 2

    return total_pairs
```

```javascript
// Time: O(n * m) | Space: O(n * m)
function countSimilarPairs(words) {
  /**
   * Count pairs of similar strings where two strings are similar
   * if one can be shifted uniformly to match the other.
   */
  const patternCount = new Map();

  for (const word of words) {
    // Skip empty strings (though constraints say all have length m > 0)
    if (!word) continue;

    // Build the pattern key based on differences between characters
    const firstCharCode = word.charCodeAt(0);
    const patternParts = [];

    for (let i = 0; i < word.length; i++) {
      // Calculate circular difference: (current - first) mod 26
      // JavaScript's % operator can return negative, so we add 26 and mod again
      let diff = (word.charCodeAt(i) - firstCharCode) % 26;
      if (diff < 0) diff += 26;

      // Convert to string for the key
      patternParts.push(diff.toString());
    }

    // Join differences to form a unique key for this pattern
    const patternKey = patternParts.join(",");

    // Count how many strings have this pattern
    patternCount.set(patternKey, (patternCount.get(patternKey) || 0) + 1);
  }

  // Calculate total pairs: for each pattern with k occurrences,
  // we have C(k, 2) = k*(k-1)/2 pairs
  let totalPairs = 0;
  for (const count of patternCount.values()) {
    totalPairs += (count * (count - 1)) / 2;
  }

  return totalPairs;
}
```

```java
// Time: O(n * m) | Space: O(n * m)
import java.util.*;

public class Solution {
    public int countSimilarPairs(String[] words) {
        /**
         * Count pairs of similar strings where two strings are similar
         * if one can be shifted uniformly to match the other.
         */
        Map<String, Integer> patternCount = new HashMap<>();

        for (String word : words) {
            // Skip empty strings (though constraints say all have length m > 0)
            if (word.isEmpty()) continue;

            // Build the pattern key based on differences between characters
            char firstChar = word.charAt(0);
            StringBuilder patternBuilder = new StringBuilder();

            for (int i = 0; i < word.length(); i++) {
                // Calculate circular difference: (current - first) mod 26
                // Java's % can return negative, so we add 26 and mod again
                int diff = (word.charAt(i) - firstChar) % 26;
                if (diff < 0) diff += 26;

                // Append to pattern, separated by commas
                if (i > 0) patternBuilder.append(',');
                patternBuilder.append(diff);
            }

            String patternKey = patternBuilder.toString();

            // Count how many strings have this pattern
            patternCount.put(patternKey, patternCount.getOrDefault(patternKey, 0) + 1);
        }

        // Calculate total pairs: for each pattern with k occurrences,
        // we have C(k, 2) = k*(k-1)/2 pairs
        int totalPairs = 0;
        for (int count : patternCount.values()) {
            totalPairs += count * (count - 1) / 2;
        }

        return totalPairs;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m)**

- We process each of the n strings once
- For each string of length m, we compute differences for all m characters
- Building the pattern key takes O(m) time per string
- The hash map operations (insert and lookup) are O(1) on average

**Space Complexity: O(n × m)**

- We store a pattern key for each string, each of length O(m)
- In the worst case, all strings have different patterns, so we store n keys
- The hash map itself has overhead proportional to the number of keys

## Common Mistakes

1. **Forgetting to handle negative modulo results**: In Java and JavaScript, `-1 % 26` returns `-1`, not `25`. Always normalize: `((diff % 26) + 26) % 26` or equivalent.

2. **Using the wrong base for differences**: Some candidates compare each character to 'a' instead of the first character. This doesn't capture the relative pattern correctly. The key insight is that similarity depends on _relative_ differences within the string, not absolute positions.

3. **Inefficient key construction**: Building strings with `+=` in a loop can be O(m²) due to string copying. Use list/array joining or StringBuilder for O(m) construction.

4. **Missing the combination formula**: After counting occurrences, remember that k strings yield C(k, 2) = k(k-1)/2 pairs, not k² or other formulas.

## When You'll See This Pattern

This problem uses the **"canonical representation"** pattern, where we transform data into a normalized form that captures equivalence under some transformation. Similar problems include:

1. **Group Anagrams (LeetCode 49)**: Transform each string by sorting its characters to create a key that groups anagrams together.

2. **Isomorphic Strings (LeetCode 205)**: Encode strings based on the first occurrence position of each character to check if they have the same pattern.

3. **Find and Replace Pattern (LeetCode 890)**: Similar to isomorphic strings but applied to multiple words.

The core idea is always the same: find an invariant representation that's easy to compute and compare, then use hashing to group equivalent items.

## Key Takeaways

1. **Look for invariants**: When a problem involves equivalence under transformation (shifts, rotations, permutations), identify what properties remain unchanged. Here, the pattern of relative differences is invariant under circular shifts.

2. **Hashing enables O(1) comparison**: By converting each item to a hashable key that captures the invariant, we can group similar items without pairwise comparisons, turning O(n²) into O(n).

3. **Modulo arithmetic for circular structures**: When dealing with circular/wrapping behavior (like 'z' to 'a'), modulo arithmetic is your friend. Remember to handle negative results properly in languages where `%` isn't always positive.

[Practice this problem on CodeJeet](/problem/count-caesar-cipher-pairs)
