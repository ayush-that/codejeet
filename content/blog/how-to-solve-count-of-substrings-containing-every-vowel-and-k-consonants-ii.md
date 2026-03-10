---
title: "How to Solve Count of Substrings Containing Every Vowel and K Consonants II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count of Substrings Containing Every Vowel and K Consonants II. Medium difficulty, 40.6% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2027-03-17"
category: "dsa-patterns"
tags:
  [
    "count-of-substrings-containing-every-vowel-and-k-consonants-ii",
    "hash-table",
    "string",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Count of Substrings Containing Every Vowel and K Consonants II

This problem asks us to count all substrings of a given string that contain all five vowels (a, e, i, o, u) at least once and exactly k consonants. What makes this problem interesting is that we need to track two different constraints simultaneously: vowel coverage and consonant count. The "at least once" requirement for vowels means we need to ensure all five vowels are present, while the "exactly k" requirement for consonants is a precise count constraint.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `word = "aeiouc"` and `k = 1`.

We need to find all substrings containing all vowels (a, e, i, o, u) at least once and exactly 1 consonant.

Let's examine some candidate substrings:

- `"aeiou"` - contains all vowels, 0 consonants (not valid, needs exactly 1)
- `"aeiouc"` - contains all vowels, 1 consonant 'c' (VALID!)
- `"eiouc"` - missing 'a' (not valid)
- `"aeiouc"` is the only valid substring here, so answer = 1.

Now let's think about how to systematically find all such substrings. The key insight is that for any valid substring, if we extend it to the right while maintaining all vowels, we'll get more consonants. But we need exactly k consonants, not at least k. This suggests we need a way to count substrings with at most k consonants and subtract those with at most k-1 consonants.

## Brute Force Approach

The most straightforward approach would be to check every possible substring. For a string of length n, there are O(n²) substrings. For each substring, we would:

1. Count the vowels to ensure all five are present at least once
2. Count the consonants to ensure there are exactly k

This gives us O(n³) time complexity in the worst case (O(n²) substrings × O(n) to check each one). Even with optimization, checking each substring independently would be O(n²), which is too slow for n up to 10⁵ (as typical in LeetCode constraints).

The brute force approach fails because:

- It doesn't reuse computation between overlapping substrings
- It checks many substrings that can't possibly be valid (missing vowels)
- The O(n²) time complexity is too slow for large inputs

## Optimized Approach

The key insight is to use a **sliding window with two pointers** approach, but with a twist. Since we need exactly k consonants, we can use a common trick: count substrings with at most k consonants and subtract those with at most k-1 consonants.

Here's the step-by-step reasoning:

1. **Problem Transformation**: Instead of counting substrings with exactly k consonants, count substrings with at most k consonants (and all vowels present), then subtract those with at most k-1 consonants.

2. **Sliding Window for "at most k consonants"**: We can maintain a window [left, right] that expands to the right. As we expand:
   - Track vowel counts in a hash map or array
   - Track consonant count
   - When consonant count exceeds k, shrink from the left until it's ≤ k

3. **Counting Valid Substrings**: For each position `right`, once we have a valid window (all vowels present, consonants ≤ k), how many substrings end at `right` and are valid? The answer is: all substrings starting from any `left'` between the current `left` and the minimum left that keeps all vowels present.

4. **Tracking Minimum Left for Vowels**: We need to know, for the current window, what's the smallest left index that still contains all vowels. This is tricky because as we shrink from the left, we might lose some vowels.

5. **Efficient Vowel Tracking**: We can maintain the last seen position of each vowel. The maximum of these last seen positions gives us the minimum left index that still contains all vowels.

The algorithm becomes:

1. Define a helper function `countAtMostK(word, k)` that counts substrings with all vowels and at most k consonants
2. The answer is `countAtMostK(word, k) - countAtMostK(word, k-1)`
3. In `countAtMostK`, use sliding window with:
   - Vowel counts to ensure all are present
   - Consonant count to ensure ≤ k
   - Last seen positions of vowels to find the minimum valid left

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countOfSubstrings(word, k):
    """
    Count substrings containing all vowels at least once and exactly k consonants.
    Uses sliding window with transformation: exactly k = at most k - at most (k-1)
    """
    def count_at_most_k(k_val):
        """Count substrings with all vowels and at most k_val consonants."""
        n = len(word)
        vowel_count = {'a': 0, 'e': 0, 'i': 0, 'o': 0, 'u': 0}
        last_seen = {'a': -1, 'e': -1, 'i': -1, 'o': -1, 'u': -1}
        consonant_count = 0
        left = 0
        result = 0

        for right in range(n):
            char = word[right]

            # Update counts based on current character
            if char in vowel_count:
                vowel_count[char] += 1
                last_seen[char] = right
            else:
                consonant_count += 1

            # Shrink window if we have too many consonants
            while consonant_count > k_val:
                left_char = word[left]
                if left_char in vowel_count:
                    vowel_count[left_char] -= 1
                    # If we're removing the last occurrence of a vowel, update last_seen
                    if vowel_count[left_char] == 0:
                        last_seen[left_char] = -1
                else:
                    consonant_count -= 1
                left += 1

            # Check if we have all vowels
            has_all_vowels = all(vowel_count[v] > 0 for v in vowel_count)

            if has_all_vowels:
                # Find the minimum left index that still contains all vowels
                # This is the maximum of the last seen positions of each vowel
                min_left = max(last_seen.values())
                # All substrings starting from left to min_left (inclusive) and ending at right are valid
                result += (min_left - left + 1)

        return result

    # Handle edge case: k could be 0, so k-1 would be -1
    if k == 0:
        return count_at_most_k(0)
    else:
        return count_at_most_k(k) - count_at_most_k(k - 1)
```

```javascript
// Time: O(n) | Space: O(1)
function countOfSubstrings(word, k) {
  /**
   * Count substrings containing all vowels at least once and exactly k consonants.
   * Uses sliding window with transformation: exactly k = at most k - at most (k-1)
   */
  function countAtMostK(kVal) {
    // Count substrings with all vowels and at most kVal consonants
    const n = word.length;
    const vowelCount = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    const lastSeen = { a: -1, e: -1, i: -1, o: -1, u: -1 };
    let consonantCount = 0;
    let left = 0;
    let result = 0;

    for (let right = 0; right < n; right++) {
      const char = word[right];

      // Update counts based on current character
      if (vowelCount.hasOwnProperty(char)) {
        vowelCount[char]++;
        lastSeen[char] = right;
      } else {
        consonantCount++;
      }

      // Shrink window if we have too many consonants
      while (consonantCount > kVal) {
        const leftChar = word[left];
        if (vowelCount.hasOwnProperty(leftChar)) {
          vowelCount[leftChar]--;
          // If we're removing the last occurrence of a vowel, update lastSeen
          if (vowelCount[leftChar] === 0) {
            lastSeen[leftChar] = -1;
          }
        } else {
          consonantCount--;
        }
        left++;
      }

      // Check if we have all vowels
      const hasAllVowels = Object.values(vowelCount).every((count) => count > 0);

      if (hasAllVowels) {
        // Find the minimum left index that still contains all vowels
        // This is the maximum of the last seen positions of each vowel
        const minLeft = Math.max(...Object.values(lastSeen));
        // All substrings starting from left to minLeft (inclusive) and ending at right are valid
        result += minLeft - left + 1;
      }
    }

    return result;
  }

  // Handle edge case: k could be 0, so k-1 would be -1
  if (k === 0) {
    return countAtMostK(0);
  } else {
    return countAtMostK(k) - countAtMostK(k - 1);
  }
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public long countOfSubstrings(String word, int k) {
        /**
         * Count substrings containing all vowels at least once and exactly k consonants.
         * Uses sliding window with transformation: exactly k = at most k - at most (k-1)
         */
        if (k == 0) {
            return countAtMostK(word, 0);
        } else {
            return countAtMostK(word, k) - countAtMostK(word, k - 1);
        }
    }

    private long countAtMostK(String word, int k) {
        // Count substrings with all vowels and at most k consonants
        int n = word.length();
        int[] vowelCount = new int[26];
        int[] lastSeen = new int[26];
        Arrays.fill(lastSeen, -1);

        // Map vowels to indices
        int aIdx = 'a' - 'a';
        int eIdx = 'e' - 'a';
        int iIdx = 'i' - 'a';
        int oIdx = 'o' - 'a';
        int uIdx = 'u' - 'a';

        int consonantCount = 0;
        int left = 0;
        long result = 0;

        for (int right = 0; right < n; right++) {
            char c = word.charAt(right);
            int idx = c - 'a';

            // Update counts based on current character
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                vowelCount[idx]++;
                lastSeen[idx] = right;
            } else {
                consonantCount++;
            }

            // Shrink window if we have too many consonants
            while (consonantCount > k) {
                char leftChar = word.charAt(left);
                int leftIdx = leftChar - 'a';

                if (leftChar == 'a' || leftChar == 'e' || leftChar == 'i' ||
                    leftChar == 'o' || leftChar == 'u') {
                    vowelCount[leftIdx]--;
                    // If we're removing the last occurrence of a vowel, update lastSeen
                    if (vowelCount[leftIdx] == 0) {
                        lastSeen[leftIdx] = -1;
                    }
                } else {
                    consonantCount--;
                }
                left++;
            }

            // Check if we have all vowels
            boolean hasAllVowels = (vowelCount[aIdx] > 0 && vowelCount[eIdx] > 0 &&
                                   vowelCount[iIdx] > 0 && vowelCount[oIdx] > 0 &&
                                   vowelCount[uIdx] > 0);

            if (hasAllVowels) {
                // Find the minimum left index that still contains all vowels
                // This is the maximum of the last seen positions of each vowel
                int minLeft = Math.max(
                    Math.max(lastSeen[aIdx], lastSeen[eIdx]),
                    Math.max(Math.max(lastSeen[iIdx], lastSeen[oIdx]), lastSeen[uIdx])
                );
                // All substrings starting from left to minLeft (inclusive) and ending at right are valid
                result += (minLeft - left + 1);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the string: one for `countAtMostK(k)` and one for `countAtMostK(k-1)`
- Each pass uses a sliding window where each character is processed at most twice (once when added to the window, once when removed)
- All operations inside the loop are O(1) (hash map/array operations, comparisons)

**Space Complexity: O(1)**

- We use fixed-size data structures: vowel counts (5 entries), last seen positions (5 entries)
- No additional space that grows with input size
- Even with hash maps, the size is constant (5 vowels)

## Common Mistakes

1. **Forgetting to handle k = 0 case**: When k = 0, `countAtMostK(k-1)` would be `countAtMostK(-1)`, which doesn't make sense. Always check for this edge case.

2. **Incorrect substring counting**: When we have a valid window, candidates might think to add `(right - left + 1)` substrings. But actually, we can only start from positions where all vowels are still present. We need to find the minimum left index that maintains all vowels.

3. **Not properly updating last seen positions**: When shrinking the window and removing a vowel occurrence, if it was the last occurrence of that vowel, we need to update `last_seen` to -1 (or some sentinel value). Otherwise, our calculation of `min_left` will be incorrect.

4. **Using integer instead of long for result**: The number of valid substrings can be large (up to ~n²/2 for n=10⁵, which is ~5×10⁹). This exceeds 32-bit integer range, so use 64-bit integers (long in Java/JavaScript, Python handles big integers automatically).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Sliding Window with Multiple Constraints**: Similar to problems like "Longest Substring with At Most K Distinct Characters" or "Minimum Window Substring", but with the twist of needing both "at least" and "exactly" constraints.

2. **Transformation from "Exactly K" to "At Most K"**: This is a common trick seen in problems like:
   - "Subarrays with K Different Integers" (LeetCode 992)
   - "Binary Subarrays With Sum" (LeetCode 930)
   - The pattern is: count(exactly K) = count(at most K) - count(at most K-1)

3. **Tracking Last Seen Positions**: Similar to problems where you need to find the minimum window containing certain elements, like "Minimum Window Substring" (LeetCode 76).

## Key Takeaways

1. **Transform "exactly K" to "at most K"**: When you need to count subarrays/substrings with exactly K of something, consider counting those with at most K and subtracting those with at most K-1.

2. **Sliding window with two types of constraints**: When a problem has both "at least" (for some elements) and "at most" (for others) constraints, sliding window can often solve it efficiently by maintaining counts and shrinking when constraints are violated.

3. **Track last positions for "at least" constraints**: For "at least once" requirements, tracking the last seen position of each required element helps determine the minimum valid starting point for substrings ending at the current position.

Related problems: [Longest Substring Of All Vowels in Order](/problem/longest-substring-of-all-vowels-in-order), [Count Vowel Substrings of a String](/problem/count-vowel-substrings-of-a-string)
