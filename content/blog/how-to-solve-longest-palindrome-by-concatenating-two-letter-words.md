---
title: "How to Solve Longest Palindrome by Concatenating Two Letter Words — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Palindrome by Concatenating Two Letter Words. Medium difficulty, 53.5% acceptance rate. Topics: Array, Hash Table, String, Greedy, Counting."
date: "2028-05-26"
category: "dsa-patterns"
tags:
  [
    "longest-palindrome-by-concatenating-two-letter-words",
    "array",
    "hash-table",
    "string",
    "medium",
  ]
---

# How to Solve Longest Palindrome by Concatenating Two Letter Words

You're given an array of two-letter words and need to build the longest palindrome possible by concatenating selected words in any order. The catch is that each word can only be used once, and the palindrome must be formed by whole words, not individual letters. This problem is interesting because it combines palindrome logic with frequency counting and greedy selection—you need to recognize which word pairs can mirror each other and when a word can serve as the palindrome's center.

## Visual Walkthrough

Let's trace through an example: `words = ["ab", "ba", "cc", "dd", "ba", "aa"]`

**Step 1: Understanding word relationships**

- "ab" and "ba" are reverses of each other
- "cc" and "dd" are self-reversing (palindromes themselves)
- "aa" is also self-reversing

**Step 2: Building the palindrome**
We want to place mirroring pairs symmetrically around the center:

1. Find pairs of reverse words: We have "ab" and "ba" (two instances of "ba" available)
   - We can use one "ab" and one "ba" → adds 4 letters to palindrome
   - We have another "ba" left but no "ab" to pair with it
2. Find self-reversing words: "cc", "dd", "aa"
   - These can go in the center, but only one can be the true center
   - We can use all of them if we place one in center and others as pairs

**Step 3: Arranging the palindrome**

- Use "ab" + "ba" pair: "ab" on left, "ba" on right → "ab...ba"
- Use "cc" as center → "ab cc ba" (length 8)
- We still have "dd" and "aa" available
- Since they're self-reversing, we can use them as pairs: "dd" on left, "dd" on right (but we only have one "dd")
- Actually, self-reversing words can be paired with themselves! So we can use "dd" twice if we had two, but we only have one
- Wait, we can use "aa" as an additional center? No, only one center allowed
- But we can use "aa" as a pair if we had two "aa" - we only have one

**Step 4: The optimal arrangement**

- Pair "ab" with one "ba": adds 4 letters
- Use "cc" as center: adds 2 letters
- Use remaining "ba" has no "ab" to pair with
- Use "dd" as center? Can't have two centers
- Use "aa" as center? "cc" is already center

Actually, let's think systematically: We can use all self-reversing words by pairing them with themselves if we have even counts, and use one as center if we have an odd count.

Let's count properly:

- "ab": 1, "ba": 2 → we can make 1 pair (min(1,2)) = 1 pair → 4 letters
- "cc": 1 (self-reverse) → can be center
- "dd": 1 (self-reverse) → can be center if no other center
- "aa": 1 (self-reverse) → can be center if no other center

We can only have one center, so we pick one self-reverse word as center. The longest uses "cc", "dd", or "aa" as center (all give same length).

Final palindrome: "ab" + "cc" + "ba" = "abccba" (6 letters)

But wait, we could also do: "ba" + "cc" + "ab" = "baccab" (same length)

## Brute Force Approach

A naive approach would try all permutations of word selections, checking if each forms a palindrome. For each subset of words (2^n subsets), we'd need to check all permutations (k! for k selected words) and verify palindrome property. This is O(2^n _ n! _ n) - astronomically slow even for small inputs.

What a candidate might initially consider:

1. Try to sort words and pair them manually
2. Try to build palindrome by adding words to both ends
3. The challenge is tracking which words are used and ensuring we don't use duplicates

The brute force fails because:

- Exponential number of subsets to consider
- Need to track word usage efficiently
- No systematic way to find optimal arrangement

## Optimized Approach

The key insight is that we don't need to try all arrangements. We can use a greedy counting strategy:

**Core observations:**

1. Two-letter words can be of two types:
   - Type A: Words that are their own reverse ("aa", "bb", "cc", etc.)
   - Type B: Words that have a different reverse ("ab" and "ba" are reverses)
2. For Type B words (different reverse):
   - They must appear in mirror positions: if "ab" is on left, "ba" must be on right
   - Each "ab" can pair with a "ba" to add 4 letters total
   - We can use min(count["ab"], count["ba"]) pairs
3. For Type A words (self-reverse):
   - They can appear in the center of the palindrome
   - They can also appear in pairs: "aa" on left and "aa" on right
   - If we have even count of a self-reverse word, we can use all in pairs
   - If we have odd count, we can use count-1 in pairs and save one for center
4. The center position:
   - Only one word can be in the center (or none)
   - Any self-reverse word can serve as center
   - If no self-reverse words with odd count, we might still use one with even count as center? No, if count is even, we use all in pairs

**Algorithm steps:**

1. Count frequency of each word
2. Initialize answer = 0 and center_used = false
3. For each word:
   - If word is self-reverse:
     - If count is even: add all to answer (count \* 2 letters)
     - If count is odd: add (count-1) \* 2 letters, and if center not used, add 2 more for center
   - If word is not self-reverse:
     - Find its reverse
     - Use min(count[word], count[reverse]) pairs
     - Add pairs \* 4 letters
     - Mark both as used to avoid double counting
4. Return answer

Actually, there's a cleaner way: Process all words, counting pairs for non-self-reverse words, and track if we have any self-reverse word with odd count for the center.

## Optimal Solution

The clean optimal solution uses a hash map to count word frequencies and processes them systematically:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def longestPalindrome(words):
    """
    Builds the longest palindrome from two-letter words.

    Approach:
    1. Count frequency of each word
    2. For non-palindromic words (like "ab" and "ba"), each pair contributes 4 letters
    3. For palindromic words (like "aa"):
       - Even counts can all be used in pairs (each pair = 4 letters)
       - Odd counts: (count-1) can be used in pairs, and 1 can be center
    4. Only one word can be in the center

    Args:
        words: List of two-letter strings

    Returns:
        Length of longest possible palindrome
    """
    from collections import Counter

    # Step 1: Count frequency of each word
    word_count = Counter(words)

    length = 0          # Total length of palindrome
    center_used = False # Track if we've placed a word in center

    # Step 2: Process each unique word
    for word in list(word_count.keys()):
        # Skip if we've already used this word (when processing its reverse)
        if word_count[word] == 0:
            continue

        # Check if word is palindrome (same when reversed)
        if word[0] == word[1]:
            # Palindromic word like "aa"
            count = word_count[word]

            if count % 2 == 0:
                # Even count: use all in pairs
                length += count * 2
            else:
                # Odd count: use count-1 in pairs, save one for center
                length += (count - 1) * 2

                # If center not used, place one in center
                if not center_used:
                    length += 2
                    center_used = True

            # Mark as used
            word_count[word] = 0

        else:
            # Non-palindromic word like "ab"
            reverse = word[1] + word[0]

            if reverse in word_count:
                # Number of pairs we can form
                pairs = min(word_count[word], word_count[reverse])

                # Each pair contributes 4 letters (2 from word, 2 from reverse)
                length += pairs * 4

                # Mark both as used
                word_count[word] -= pairs
                word_count[reverse] -= pairs

    return length
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Builds the longest palindrome from two-letter words.
 *
 * Approach:
 * 1. Count frequency of each word
 * 2. For non-palindromic words (like "ab" and "ba"), each pair contributes 4 letters
 * 3. For palindromic words (like "aa"):
 *    - Even counts can all be used in pairs (each pair = 4 letters)
 *    - Odd counts: (count-1) can be used in pairs, and 1 can be center
 * 4. Only one word can be in the center
 *
 * @param {string[]} words - Array of two-letter strings
 * @return {number} Length of longest possible palindrome
 */
function longestPalindrome(words) {
  // Step 1: Count frequency of each word
  const wordCount = new Map();
  for (const word of words) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  }

  let length = 0; // Total length of palindrome
  let centerUsed = false; // Track if we've placed a word in center

  // Step 2: Process each unique word
  for (const [word, count] of wordCount.entries()) {
    // Skip if we've already used this word (when processing its reverse)
    if (count === 0) continue;

    // Check if word is palindrome (same when reversed)
    if (word[0] === word[1]) {
      // Palindromic word like "aa"
      if (count % 2 === 0) {
        // Even count: use all in pairs
        length += count * 2;
      } else {
        // Odd count: use count-1 in pairs, save one for center
        length += (count - 1) * 2;

        // If center not used, place one in center
        if (!centerUsed) {
          length += 2;
          centerUsed = true;
        }
      }

      // Mark as used
      wordCount.set(word, 0);
    } else {
      // Non-palindromic word like "ab"
      const reverse = word[1] + word[0];

      if (wordCount.has(reverse)) {
        const reverseCount = wordCount.get(reverse);
        // Number of pairs we can form
        const pairs = Math.min(count, reverseCount);

        // Each pair contributes 4 letters (2 from word, 2 from reverse)
        length += pairs * 4;

        // Mark both as used
        wordCount.set(word, count - pairs);
        wordCount.set(reverse, reverseCount - pairs);
      }
    }
  }

  return length;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    /**
     * Builds the longest palindrome from two-letter words.
     *
     * Approach:
     * 1. Count frequency of each word
     * 2. For non-palindromic words (like "ab" and "ba"), each pair contributes 4 letters
     * 3. For palindromic words (like "aa"):
     *    - Even counts can all be used in pairs (each pair = 4 letters)
     *    - Odd counts: (count-1) can be used in pairs, and 1 can be center
     * 4. Only one word can be in the center
     *
     * @param words Array of two-letter strings
     * @return Length of longest possible palindrome
     */
    public int longestPalindrome(String[] words) {
        // Step 1: Count frequency of each word
        Map<String, Integer> wordCount = new HashMap<>();
        for (String word : words) {
            wordCount.put(word, wordCount.getOrDefault(word, 0) + 1);
        }

        int length = 0;               // Total length of palindrome
        boolean centerUsed = false;   // Track if we've placed a word in center

        // Step 2: Process each unique word
        // Need to use array to avoid ConcurrentModificationException
        String[] keys = wordCount.keySet().toArray(new String[0]);

        for (String word : keys) {
            int count = wordCount.get(word);
            // Skip if we've already used this word (when processing its reverse)
            if (count == 0) continue;

            // Check if word is palindrome (same when reversed)
            if (word.charAt(0) == word.charAt(1)) {
                // Palindromic word like "aa"
                if (count % 2 == 0) {
                    // Even count: use all in pairs
                    length += count * 2;
                } else {
                    // Odd count: use count-1 in pairs, save one for center
                    length += (count - 1) * 2;

                    // If center not used, place one in center
                    if (!centerUsed) {
                        length += 2;
                        centerUsed = true;
                    }
                }

                // Mark as used
                wordCount.put(word, 0);

            } else {
                // Non-palindromic word like "ab"
                String reverse = "" + word.charAt(1) + word.charAt(0);

                if (wordCount.containsKey(reverse)) {
                    int reverseCount = wordCount.get(reverse);
                    // Number of pairs we can form
                    int pairs = Math.min(count, reverseCount);

                    // Each pair contributes 4 letters (2 from word, 2 from reverse)
                    length += pairs * 4;

                    // Mark both as used
                    wordCount.put(word, count - pairs);
                    wordCount.put(reverse, reverseCount - pairs);
                }
            }
        }

        return length;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting word frequencies: O(n) where n is number of words
- Processing each unique word: O(u) where u is number of unique words (u ≤ n, and u ≤ 26² = 676 since only two-letter words)
- Overall linear in n

**Space Complexity: O(n)**

- Hash map stores at most n entries (in worst case when all words are unique)
- In practice, since words are two-letter strings, maximum unique words is 26 × 26 = 676

## Common Mistakes

1. **Forgetting to track used words**: When processing "ab" and "ba", candidates might count pairs twice—once when processing "ab" and again when processing "ba". Solution: Mark words as used or skip when count reaches zero.

2. **Incorrect center handling**: Some candidates add all self-reverse words to the center, but only one word can be in the center. Others forget that self-reverse words with even counts should all be used in pairs, not as center. Solution: For odd counts, use count-1 in pairs and save one for center if center not already used.

3. **Not considering self-reverse word pairs**: Candidates might think self-reverse words can only go in center, but "aa" can appear as a pair: "aa" on left and "aa" on right. Solution: For self-reverse words with even count, use all in pairs; for odd count, use count-1 in pairs.

4. **Off-by-one in letter counting**: Each word contributes 2 letters, but candidates might count 1. When counting pairs of reverse words ("ab"+"ba"), it's 4 letters total, not 2. Solution: Carefully calculate: pairs × 4 for non-self-reverse words, count × 2 for self-reverse words in pairs.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Frequency counting with hash maps**: Like in "Longest Palindrome" (Easy) where you count character frequencies to build palindromes.

2. **Palindrome symmetry and pairing**: Similar to "Palindrome Pairs" (Hard) but simpler—here we only have two-letter words so reversal is trivial.

3. **Greedy selection with constraints**: Like in "Task Scheduler" (Medium) where you select tasks based on frequency, here you select word pairs based on availability of reverses.

**Related problems:**

- **Longest Palindrome (Easy)**: Build longest palindrome from individual characters—similar frequency counting approach.
- **Palindrome Pairs (Hard)**: Find all index pairs where words concatenate to form palindrome—more complex version of reverse pairing.
- **Maximum Product of Word Lengths (Medium)**: Uses bitmask to represent words and find non-overlapping pairs—similar pairing concept.

## Key Takeaways

1. **Palindrome building is about symmetry**: For every element on the left, you need its mirror on the right. For two-letter words, the mirror is the reversed word.

2. **Count first, arrange later**: Instead of trying to build the palindrome directly, count frequencies and calculate maximum length mathematically. This is often more efficient than constructive approaches.

3. **Handle special cases separately**: Self-palindromic elements (like "aa") have different rules than regular pairs—they can be both paired with themselves and placed in center.

**Related problems:** [Palindrome Pairs](/problem/palindrome-pairs), [Longest Palindrome](/problem/longest-palindrome)
