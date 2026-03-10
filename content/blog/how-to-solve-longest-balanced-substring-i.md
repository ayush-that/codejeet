---
title: "How to Solve Longest Balanced Substring I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Balanced Substring I. Medium difficulty, 69.7% acceptance rate. Topics: Hash Table, String, Counting, Enumeration."
date: "2026-12-15"
category: "dsa-patterns"
tags: ["longest-balanced-substring-i", "hash-table", "string", "counting", "medium"]
---

# How to Solve Longest Balanced Substring I

This problem asks us to find the longest substring where all distinct characters appear exactly the same number of times. For example, in "aabbcc", each character appears twice, so the entire string is balanced. What makes this problem interesting is that we need to track frequencies of multiple characters while ensuring they're all equal, but we don't know in advance which characters will be in the balanced substring or what the target frequency will be.

## Visual Walkthrough

Let's trace through `s = "aabbccd"` step by step:

1. **Substring "aa"**: Only 'a' appears (2 times). Balanced? Yes - only one distinct character appearing 2 times.
2. **Substring "aabb"**: 'a' appears 2 times, 'b' appears 2 times. Balanced? Yes - both appear 2 times.
3. **Substring "aabbc"**: 'a': 2, 'b': 2, 'c': 1. Not balanced (frequencies differ).
4. **Substring "bbcc"**: 'b': 2, 'c': 2. Balanced.
5. **Substring "aabbcc"**: 'a': 2, 'b': 2, 'c': 2. Balanced - this is our longest so far (length 6).
6. **Substring "aabbccd"**: 'a': 2, 'b': 2, 'c': 2, 'd': 1. Not balanced.

The key insight: a substring is balanced if either:

- All characters appear exactly once (frequency = 1 for all distinct chars)
- All characters appear exactly twice (frequency = 2 for all distinct chars)
- All characters appear exactly k times for some k

But we need to check all possible substrings efficiently.

## Brute Force Approach

The brute force solution checks every possible substring `(i, j)` where `0 ≤ i ≤ j < n`. For each substring:

1. Count frequencies of all characters
2. Check if all non-zero frequencies are equal
3. Track the maximum length where this condition holds

**Why this is too slow:**

- There are O(n²) possible substrings
- For each substring, we need O(n) time to count frequencies (or O(1) per character with 26 letters, but still O(n) for the substring length)
- Total time: O(n³) or O(26·n²) ≈ O(n²) which is too slow for n up to 50 (typical constraints)

Even with 26 letters, O(26·n²) might work for small n, but we can do better. The real issue is that we're recomputing frequencies from scratch for each substring.

## Optimized Approach

The key insight: **We can enumerate possible frequency targets and use a running count approach.**

Think about it this way: For a substring to be balanced, all characters must appear exactly `k` times. Since we only have 26 lowercase letters, `k` can't be too large - at most `n/1 = n` when there's only one character type.

But here's the smarter approach: Instead of fixing `k` first, we can use a **difference array** approach. For each character, we track its count relative to some baseline. The substring is balanced if all characters have either:

1. Count = 0 (not present in substring)
2. Count = some positive value `k` (present `k` times)

Actually, there's an even cleaner insight: **A substring is balanced if the maximum frequency equals the minimum frequency among characters that appear at least once.**

Here's the optimal strategy:

1. For each starting position `i`, maintain frequency counts as we expand to the right
2. For each ending position `j`, check if current substring is balanced
3. To check efficiently: track min and max frequencies among characters with count > 0

But we can optimize further by noticing that we only have 26 characters, so we can afford to track all their frequencies.

## Optimal Solution

The most efficient approach uses the fact that we have at most 26 distinct characters. We iterate through all possible starting positions, and for each start, we:

1. Reset frequency array
2. Expand to the right, updating frequencies
3. After each expansion, check if current substring is balanced
4. To check if balanced: find min and max frequencies among characters with count > 0, and verify they're equal

This gives us O(26·n²) time, which is acceptable for typical constraints (n ≤ 1000).

<div class="code-group">

```python
# Time: O(26 * n^2) | Space: O(1) - only 26 counters needed
def longestBalancedSubstring(s: str) -> int:
    n = len(s)
    max_len = 0

    # Try every possible starting position
    for i in range(n):
        # Frequency array for 26 lowercase letters
        freq = [0] * 26

        # Expand substring from i to j
        for j in range(i, n):
            # Update frequency of current character
            char_idx = ord(s[j]) - ord('a')
            freq[char_idx] += 1

            # Check if substring s[i:j+1] is balanced
            # Get min and max frequencies among characters that appear
            min_freq = float('inf')
            max_freq = 0

            for count in freq:
                if count > 0:  # Only consider characters that appear in substring
                    min_freq = min(min_freq, count)
                    max_freq = max(max_freq, count)

            # All appearing characters have same frequency if min == max
            if min_freq == max_freq:
                current_len = j - i + 1
                max_len = max(max_len, current_len)

    return max_len
```

```javascript
// Time: O(26 * n^2) | Space: O(1) - only 26 counters needed
function longestBalancedSubstring(s) {
  const n = s.length;
  let maxLen = 0;

  // Try every possible starting position
  for (let i = 0; i < n; i++) {
    // Frequency array for 26 lowercase letters
    const freq = new Array(26).fill(0);

    // Expand substring from i to j
    for (let j = i; j < n; j++) {
      // Update frequency of current character
      const charIdx = s.charCodeAt(j) - "a".charCodeAt(0);
      freq[charIdx]++;

      // Check if substring s[i:j+1] is balanced
      // Get min and max frequencies among characters that appear
      let minFreq = Infinity;
      let maxFreq = 0;

      for (let count of freq) {
        if (count > 0) {
          // Only consider characters that appear in substring
          minFreq = Math.min(minFreq, count);
          maxFreq = Math.max(maxFreq, count);
        }
      }

      // All appearing characters have same frequency if min == max
      if (minFreq === maxFreq) {
        const currentLen = j - i + 1;
        maxLen = Math.max(maxLen, currentLen);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(26 * n^2) | Space: O(1) - only 26 counters needed
class Solution {
    public int longestBalancedSubstring(String s) {
        int n = s.length();
        int maxLen = 0;

        // Try every possible starting position
        for (int i = 0; i < n; i++) {
            // Frequency array for 26 lowercase letters
            int[] freq = new int[26];

            // Expand substring from i to j
            for (int j = i; j < n; j++) {
                // Update frequency of current character
                char c = s.charAt(j);
                freq[c - 'a']++;

                // Check if substring s[i:j+1] is balanced
                // Get min and max frequencies among characters that appear
                int minFreq = Integer.MAX_VALUE;
                int maxFreq = 0;

                for (int count : freq) {
                    if (count > 0) {  // Only consider characters that appear in substring
                        minFreq = Math.min(minFreq, count);
                        maxFreq = Math.max(maxFreq, count);
                    }
                }

                // All appearing characters have same frequency if min == max
                if (minFreq == maxFreq) {
                    int currentLen = j - i + 1;
                    maxLen = Math.max(maxLen, currentLen);
                }
            }
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(26·n²)**

- Outer loop runs n times (all starting positions)
- Inner loop runs up to n times (all ending positions)
- Inside inner loop, we check 26 frequencies to find min/max
- Total: O(26·n²) = O(n²) since 26 is constant

**Space Complexity: O(1)**

- We only use a fixed-size array of 26 integers for frequency counting
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting to handle characters with zero frequency**: When checking if a substring is balanced, we should only consider characters that actually appear in the substring (count > 0). Comparing min/max without filtering zeros will give wrong results.

2. **Off-by-one errors in substring length**: Remember `j - i + 1` gives the length of substring from i to j inclusive. Using just `j - i` is off by one.

3. **Inefficient re-initialization**: Some candidates create a new frequency array for each starting position inside the inner loop, which adds unnecessary O(n) overhead. Initialize once per starting position, not per ending position.

4. **Missing the "all same character" case**: A substring with only one character type is balanced (e.g., "aaa" has all 'a' appearing 3 times). The min/max check handles this correctly since min_freq = max_freq = 3.

## When You'll See This Pattern

This frequency counting with fixed alphabet size pattern appears in many string problems:

1. **Longest Substring Without Repeating Characters (LeetCode 3)**: Uses frequency array to track character occurrences.
2. **Find All Anagrams in a String (LeetCode 438)**: Compares frequency arrays of fixed-size windows.
3. **Permutation in String (LeetCode 567)**: Similar frequency comparison between strings.
4. **Longest Repeating Character Replacement (LeetCode 424)**: Tracks character frequencies in sliding windows.

The key pattern: **When dealing with a fixed alphabet (especially lowercase English letters), use an array of size 26 for O(1) access to character frequencies.**

## Key Takeaways

1. **Fixed alphabet enables array-based counting**: With only 26 lowercase letters, we can use simple arrays instead of hash maps, giving us O(1) access and update times.

2. **Nested loops can be efficient with small constants**: O(n²) might seem slow, but with n ≤ 1000 and constant factor 26, it's perfectly acceptable (26M operations).

3. **Balance condition simplifies to min == max**: For a substring to have all characters with equal frequency, the minimum frequency among appearing characters must equal the maximum frequency.

[Practice this problem on CodeJeet](/problem/longest-balanced-substring-i)
