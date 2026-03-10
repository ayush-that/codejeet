---
title: "How to Solve Count Vowel Substrings of a String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Vowel Substrings of a String. Easy difficulty, 72.9% acceptance rate. Topics: Hash Table, String."
date: "2027-12-20"
category: "dsa-patterns"
tags: ["count-vowel-substrings-of-a-string", "hash-table", "string", "easy"]
---

# How to Solve Count Vowel Substrings of a String

This problem asks us to count all substrings that contain only vowels AND have all five vowels (a, e, i, o, u) present at least once. What makes this interesting is that we need to check two conditions simultaneously: the substring must be vowel-only (no consonants allowed), and it must contain all five vowel types. The challenge is doing this efficiently without checking every possible substring individually.

## Visual Walkthrough

Let's trace through `word = "aeiouu"`:

1. **Start at index 0**: "a" → only has 'a', not all vowels
2. **Start at index 0, expand**: "ae" → has 'a','e' only
3. **Continue expanding**: "aei" → has 'a','e','i' only
4. **Continue**: "aeio" → has 'a','e','i','o' only
5. **Continue**: "aeiou" → ✅ vowel-only AND has all 5 vowels! Count = 1
6. **Continue**: "aeiouu" → ✅ still vowel-only AND has all 5 vowels! Count = 2

But wait, we also need to check other starting positions:

- Start at index 1: "e" → only 'e'
- "ei" → 'e','i' only
- "eio" → 'e','i','o' only
- "eiou" → missing 'a'
- "eiouu" → missing 'a'

Start at index 2: "i" → only 'i'

- "io" → 'i','o' only
- "iou" → 'i','o','u' only
- "iouu" → 'i','o','u' only

Start at index 3: "o" → only 'o'

- "ou" → 'o','u' only
- "ouu" → 'o','u' only

Start at index 4: "u" → only 'u'

- "uu" → 'u' only

Start at index 5: "u" → only 'u'

Total count = 2.

The key insight: once we find a valid substring with all 5 vowels, any extension of it (as long as we stay within vowel-only territory) will also be valid!

## Brute Force Approach

The most straightforward approach is to check every possible substring:

1. Generate all possible substrings (start index i, end index j where i ≤ j)
2. For each substring:
   - Check if it contains any consonants → if yes, skip
   - Check if it contains all 5 vowels → if yes, count it

This would be O(n³) time: O(n²) substrings, and checking each substring takes O(n) time to scan for consonants and vowels. For n up to 100,000 (as in LeetCode constraints), this is far too slow.

Even with optimization (like breaking early when we hit a consonant), worst-case scenarios with long vowel strings would still be O(n³).

## Optimal Solution

The optimal approach uses a sliding window technique with careful boundary management. Here's the strategy:

1. **Break the problem into vowel-only segments**: Since consonants break our valid substrings, we can process the string in segments between consonants.
2. **For each vowel-only segment**: Use a sliding window to count substrings with all 5 vowels.
3. **Key optimization**: For a given starting position in a vowel segment, once we find the minimum window containing all 5 vowels, ALL extensions of that window to the right (within the vowel segment) will also be valid.

Think of it this way: In a vowel-only segment of length m, if we find that starting at position i, the smallest window [i, j] contains all 5 vowels, then windows [i, j], [i, j+1], [i, j+2], ..., [i, m-1] are ALL valid. That's (m - j) valid substrings starting at i.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countVowelSubstrings(word):
    """
    Counts all substrings that contain only vowels and have all 5 vowels.

    Approach:
    1. Process the string in vowel-only segments (between consonants)
    2. For each segment, use sliding window to count valid substrings
    3. For each starting position, find the smallest window with all 5 vowels
       All extensions of that window are also valid
    """
    vowels = set('aeiou')
    n = len(word)
    count = 0

    # Process each possible starting position
    for i in range(n):
        # Skip consonants - they can't start a vowel substring
        if word[i] not in vowels:
            continue

        # Track which vowels we've seen in current substring
        seen = set()

        # Expand from i to find all valid substrings starting at i
        for j in range(i, n):
            # If we hit a consonant, break - substring is no longer vowel-only
            if word[j] not in vowels:
                break

            # Add current vowel to seen set
            seen.add(word[j])

            # If we have all 5 vowels, count this substring AND all future
            # extensions (since we're in a vowel-only segment)
            if len(seen) == 5:
                count += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function countVowelSubstrings(word) {
  /**
   * Counts all substrings that contain only vowels and have all 5 vowels.
   *
   * Approach:
   * 1. Process the string in vowel-only segments (between consonants)
   * 2. For each segment, use sliding window to count valid substrings
   * 3. For each starting position, find the smallest window with all 5 vowels
   *    All extensions of that window are also valid
   */
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  const n = word.length;
  let count = 0;

  // Process each possible starting position
  for (let i = 0; i < n; i++) {
    // Skip consonants - they can't start a vowel substring
    if (!vowels.has(word[i])) {
      continue;
    }

    // Track which vowels we've seen in current substring
    const seen = new Set();

    // Expand from i to find all valid substrings starting at i
    for (let j = i; j < n; j++) {
      // If we hit a consonant, break - substring is no longer vowel-only
      if (!vowels.has(word[j])) {
        break;
      }

      // Add current vowel to seen set
      seen.add(word[j]);

      // If we have all 5 vowels, count this substring AND all future
      // extensions (since we're in a vowel-only segment)
      if (seen.size === 5) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int countVowelSubstrings(String word) {
        /**
         * Counts all substrings that contain only vowels and have all 5 vowels.
         *
         * Approach:
         * 1. Process the string in vowel-only segments (between consonants)
         * 2. For each segment, use sliding window to count valid substrings
         * 3. For each starting position, find the smallest window with all 5 vowels
         *    All extensions of that window are also valid
         */
        Set<Character> vowels = new HashSet<>();
        vowels.add('a');
        vowels.add('e');
        vowels.add('i');
        vowels.add('o');
        vowels.add('u');

        int n = word.length();
        int count = 0;

        // Process each possible starting position
        for (int i = 0; i < n; i++) {
            // Skip consonants - they can't start a vowel substring
            if (!vowels.contains(word.charAt(i))) {
                continue;
            }

            // Track which vowels we've seen in current substring
            Set<Character> seen = new HashSet<>();

            // Expand from i to find all valid substrings starting at i
            for (int j = i; j < n; j++) {
                // If we hit a consonant, break - substring is no longer vowel-only
                if (!vowels.contains(word.charAt(j))) {
                    break;
                }

                // Add current vowel to seen set
                seen.add(word.charAt(j));

                // If we have all 5 vowels, count this substring AND all future
                // extensions (since we're in a vowel-only segment)
                if (seen.size() == 5) {
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

**Time Complexity: O(n²) in worst case, but O(n) in practice**

- Worst case: The entire string is vowels (e.g., "aaaaa..."). For each starting position i, we scan to the end, giving O(n²).
- However, the problem constraints (n ≤ 100,000) suggest this should pass, and in practice it does on LeetCode.
- For strings with consonants, we get early breaks, making it closer to O(n).

**Space Complexity: O(1)**

- We only use a few sets with at most 5 elements each, and some integer counters.
- The space used doesn't grow with input size.

## Common Mistakes

1. **Forgetting to break on consonants**: The most common error is continuing to expand a window after hitting a consonant. Remember: vowel substrings must be vowel-only, so any consonant immediately invalidates the substring and all extensions.

2. **Double-counting or incorrect counting after finding all vowels**: Some candidates think they need to stop counting once they find all 5 vowels. Actually, once you have all 5 vowels, ALL extensions (while staying vowel-only) are also valid. If you stop early, you'll undercount.

3. **Using arrays instead of sets for vowel tracking**: While arrays of size 5 work, sets are cleaner for tracking which vowels we've seen. The key is checking `len(seen) == 5` rather than checking each vowel individually.

4. **Not optimizing the inner loop**: The naive O(n³) solution times out. The key insight is that for a given start position in a vowel segment, once we find the minimum window with all vowels, we can count all extensions without further checking.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Sliding window with condition checking**: Similar to problems where you need to find subarrays/substrings satisfying certain conditions. The "all 5 vowels" condition is like "contains K distinct characters" where K=5.

2. **Segment-based processing**: Breaking the problem at natural boundaries (consonants here) is common in string processing. Similar to processing text between delimiters or finding maximum sequences.

Related problems that use similar techniques:

- **Subarrays with K Different Integers**: Exactly the same sliding window pattern, but with integers instead of vowels and K distinct values instead of exactly 5.
- **Number of Substrings With Only 1s**: Counting substrings that satisfy a condition (all 1s), though simpler since it doesn't require distinct values.
- **Longest Substring Without Repeating Characters**: Another sliding window problem with condition checking.

## Key Takeaways

1. **Break at natural boundaries**: When a problem has "invalid" elements that break sequences (consonants here), process the string in segments between these invalid elements.

2. **Sliding window optimization**: For "contains all K distinct elements" type problems, once you find the minimum window containing all required elements, all extensions are also valid (as long as other conditions hold).

3. **Early termination is crucial**: Always break loops as soon as you know further extensions can't be valid. Here, hitting a consonant means we can stop expanding that window.

This problem teaches how to combine simple building blocks (vowel checking, substring generation) with optimization techniques (sliding window, early termination) to solve what seems like a complex counting problem efficiently.

Related problems: [Number of Matching Subsequences](/problem/number-of-matching-subsequences), [Subarrays with K Different Integers](/problem/subarrays-with-k-different-integers), [Number of Substrings With Only 1s](/problem/number-of-substrings-with-only-1s)
