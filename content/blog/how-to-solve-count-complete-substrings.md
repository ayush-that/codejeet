---
title: "How to Solve Count Complete Substrings — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Complete Substrings. Hard difficulty, 29.9% acceptance rate. Topics: Hash Table, String, Sliding Window."
date: "2026-05-09"
category: "dsa-patterns"
tags: ["count-complete-substrings", "hash-table", "string", "sliding-window", "hard"]
---

# How to Solve Count Complete Substrings

This problem asks us to count all substrings of a given string `word` that satisfy two conditions: 1) every character in the substring appears exactly `k` times, and 2) adjacent characters in the substring differ by at most 2 in their ASCII values. What makes this problem tricky is that we need to satisfy both constraints simultaneously—the frequency constraint requires careful counting, while the adjacency constraint restricts which substrings we can even consider.

## Visual Walkthrough

Let's trace through an example: `word = "aaabbbccc"`, `k = 3`.

First, let's understand the adjacency constraint: characters can only differ by at most 2. This means we can't have jumps like 'a' to 'd' (difference of 3). So valid substrings must consist of characters that are "close together" in the alphabet.

For our example "aaabbbccc":

- Characters are 'a', 'b', 'c' (differences: 'a'→'b' = 1, 'b'→'c' = 1)
- All adjacent pairs differ by 1, so the entire string satisfies the adjacency constraint

Now the frequency constraint: each character must appear exactly `k=3` times.

Let's check some substrings:

1. "aaa" → only 'a' appears 3 times ✓
2. "aaab" → 'a' appears 3 times, 'b' appears 1 time ✗
3. "aaabbb" → 'a' appears 3 times, 'b' appears 3 times ✓
4. "aaabbbc" → 'a'=3, 'b'=3, 'c'=1 ✗
5. "aaabbbccc" → 'a'=3, 'b'=3, 'c'=3 ✓

So for this example, we have 3 complete substrings: "aaa", "aaabbb", and "aaabbbccc".

But wait—what about "bbb", "ccc", "bbbccc"? These also satisfy both constraints! So the actual count is higher.

The key insight is that the adjacency constraint effectively breaks the string into segments where characters are "close" (difference ≤ 2). Within each segment, we need to count substrings where every character appears exactly k times.

## Brute Force Approach

A naive approach would check every possible substring:

1. Generate all substrings: O(n²) substrings
2. For each substring:
   - Check if adjacent characters differ by ≤ 2: O(m) where m is substring length
   - Count character frequencies: O(m)
   - Verify all counts equal k: O(26) since only lowercase letters

This gives O(n³) time complexity, which is far too slow for n up to 10⁴ (the problem constraints).

Even if we optimize the frequency checking with a sliding window, we still need to handle the adjacency constraint. A common mistake is to try checking all substrings and filtering by adjacency, but this misses the key insight: the adjacency constraint naturally partitions the problem.

## Optimized Approach

The breakthrough realization is that the adjacency constraint (difference ≤ 2 between adjacent characters) creates natural breakpoints in the string. Whenever we encounter a pair of characters with difference > 2, we can't include both in any valid substring. This means:

1. We can split the string into segments where all adjacent characters differ by ≤ 2
2. Within each segment, we can count valid substrings independently
3. The total answer is the sum across all segments

Now, how do we count valid substrings within a segment? We need substrings where every character appears exactly k times. This is similar to problems like "Substrings with exactly K distinct characters" but with an exact count requirement.

The clever approach: for each possible number of distinct characters (1 through 26), check if we can form a valid substring of length `distinct * k`. We use a sliding window with two frequency maps:

- One for the actual counts in the current window
- One to track which characters have reached exactly k counts

For a window to be valid:

1. All characters in the window must have count ≤ k (we reset if any exceeds k)
2. The window length must be `distinct * k`
3. All `distinct` characters must have count exactly k

When a character count exceeds k, we reset the window starting after the previous occurrence of that character.

## Optimal Solution

<div class="code-group">

```python
# Time: O(26 * n) = O(n) | Space: O(26) = O(1)
def countCompleteSubstrings(word: str, k: int) -> int:
    n = len(word)
    total = 0

    # Step 1: Split the string into segments where adjacent chars differ by ≤ 2
    start = 0
    for end in range(1, n + 1):
        # If we're at the end or found a breakpoint (difference > 2)
        if end == n or abs(ord(word[end]) - ord(word[end - 1])) > 2:
            # Process the segment from start to end-1
            segment = word[start:end]
            total += count_in_segment(segment, k)
            start = end

    return total

def count_in_segment(segment: str, k: int) -> int:
    """Count complete substrings within a segment where all adjacent chars differ ≤ 2."""
    count = 0
    n = len(segment)

    # Try all possible numbers of distinct characters (1 to 26)
    for distinct in range(1, 27):
        # Window length must be exactly distinct * k
        window_len = distinct * k
        if window_len > n:
            break  # No larger distinct values will work

        # Frequency map for current window
        freq = [0] * 26
        # Track how many chars have exactly k occurrences
        chars_with_k = 0

        left = 0
        for right in range(n):
            # Add current character to window
            char_idx = ord(segment[right]) - ord('a')
            freq[char_idx] += 1

            # Check if this char just reached exactly k
            if freq[char_idx] == k:
                chars_with_k += 1
            # Check if this char just exceeded k (need to reset)
            elif freq[char_idx] == k + 1:
                chars_with_k -= 1

            # If window is too large, shrink from left
            if right - left + 1 > window_len:
                left_char_idx = ord(segment[left]) - ord('a')
                # Before removing, check if it was at exactly k
                if freq[left_char_idx] == k:
                    chars_with_k -= 1
                elif freq[left_char_idx] == k + 1:
                    chars_with_k += 1
                freq[left_char_idx] -= 1
                left += 1

            # Check if current window is valid
            if right - left + 1 == window_len and chars_with_k == distinct:
                count += 1

    return count
```

```javascript
// Time: O(26 * n) = O(n) | Space: O(26) = O(1)
function countCompleteSubstrings(word, k) {
  const n = word.length;
  let total = 0;

  // Step 1: Split the string into segments where adjacent chars differ by ≤ 2
  let start = 0;
  for (let end = 1; end <= n; end++) {
    // If we're at the end or found a breakpoint (difference > 2)
    if (end === n || Math.abs(word.charCodeAt(end) - word.charCodeAt(end - 1)) > 2) {
      // Process the segment from start to end-1
      const segment = word.substring(start, end);
      total += countInSegment(segment, k);
      start = end;
    }
  }

  return total;
}

function countInSegment(segment, k) {
  /** Count complete substrings within a segment where all adjacent chars differ ≤ 2. */
  let count = 0;
  const n = segment.length;

  // Try all possible numbers of distinct characters (1 to 26)
  for (let distinct = 1; distinct <= 26; distinct++) {
    // Window length must be exactly distinct * k
    const windowLen = distinct * k;
    if (windowLen > n) {
      break; // No larger distinct values will work
    }

    // Frequency map for current window
    const freq = new Array(26).fill(0);
    // Track how many chars have exactly k occurrences
    let charsWithK = 0;

    let left = 0;
    for (let right = 0; right < n; right++) {
      // Add current character to window
      const charIdx = segment.charCodeAt(right) - 97; // 'a' = 97
      freq[charIdx]++;

      // Check if this char just reached exactly k
      if (freq[charIdx] === k) {
        charsWithK++;
      }
      // Check if this char just exceeded k (need to reset)
      else if (freq[charIdx] === k + 1) {
        charsWithK--;
      }

      // If window is too large, shrink from left
      if (right - left + 1 > windowLen) {
        const leftCharIdx = segment.charCodeAt(left) - 97;
        // Before removing, check if it was at exactly k
        if (freq[leftCharIdx] === k) {
          charsWithK--;
        } else if (freq[leftCharIdx] === k + 1) {
          charsWithK++;
        }
        freq[leftCharIdx]--;
        left++;
      }

      // Check if current window is valid
      if (right - left + 1 === windowLen && charsWithK === distinct) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(26 * n) = O(n) | Space: O(26) = O(1)
class Solution {
    public int countCompleteSubstrings(String word, int k) {
        int n = word.length();
        int total = 0;

        // Step 1: Split the string into segments where adjacent chars differ by ≤ 2
        int start = 0;
        for (int end = 1; end <= n; end++) {
            // If we're at the end or found a breakpoint (difference > 2)
            if (end == n || Math.abs(word.charAt(end) - word.charAt(end - 1)) > 2) {
                // Process the segment from start to end-1
                String segment = word.substring(start, end);
                total += countInSegment(segment, k);
                start = end;
            }
        }

        return total;
    }

    private int countInSegment(String segment, int k) {
        /** Count complete substrings within a segment where all adjacent chars differ ≤ 2. */
        int count = 0;
        int n = segment.length();

        // Try all possible numbers of distinct characters (1 to 26)
        for (int distinct = 1; distinct <= 26; distinct++) {
            // Window length must be exactly distinct * k
            int windowLen = distinct * k;
            if (windowLen > n) {
                break;  // No larger distinct values will work
            }

            // Frequency map for current window
            int[] freq = new int[26];
            // Track how many chars have exactly k occurrences
            int charsWithK = 0;

            int left = 0;
            for (int right = 0; right < n; right++) {
                // Add current character to window
                int charIdx = segment.charAt(right) - 'a';
                freq[charIdx]++;

                // Check if this char just reached exactly k
                if (freq[charIdx] == k) {
                    charsWithK++;
                }
                // Check if this char just exceeded k (need to reset)
                else if (freq[charIdx] == k + 1) {
                    charsWithK--;
                }

                // If window is too large, shrink from left
                if (right - left + 1 > windowLen) {
                    int leftCharIdx = segment.charAt(left) - 'a';
                    // Before removing, check if it was at exactly k
                    if (freq[leftCharIdx] == k) {
                        charsWithK--;
                    } else if (freq[leftCharIdx] == k + 1) {
                        charsWithK++;
                    }
                    freq[leftCharIdx]--;
                    left++;
                }

                // Check if current window is valid
                if (right - left + 1 == windowLen && charsWithK == distinct) {
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

**Time Complexity:** O(26 \* n) = O(n)

- We split the string into segments: O(n)
- For each segment, we try up to 26 distinct character counts
- For each distinct count, we do a single pass through the segment with sliding window: O(n)
- Total: O(26 \* n) = O(n) since 26 is constant

**Space Complexity:** O(1)

- We use fixed-size arrays of length 26 for frequency counting
- A few integer variables for pointers and counters
- No storage that grows with input size

## Common Mistakes

1. **Not handling the adjacency constraint properly**: Candidates often try to check adjacency for each substring, which is inefficient. The key is to recognize that adjacency constraints create natural breakpoints, allowing us to process segments independently.

2. **Forgetting to reset when a character count exceeds k**: When a character appears more than k times in the current window, we can't just shrink from the left—we need to move the left pointer past the previous occurrence of that character. Our solution handles this by resetting counts when we exceed k.

3. **Incorrect window validation**: A valid window must have exactly `distinct` characters, each appearing exactly k times. It's easy to mistakenly check for "at least k" or "at most k" instead of "exactly k".

4. **Not considering all possible distinct counts**: Some candidates only check for windows where all characters appear, but valid substrings can have any number of distinct characters (1-26), as long as each appears exactly k times.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Sliding Window with Frequency Constraints**: Similar to "Longest Substring with At Most K Distinct Characters" (LeetCode 340) but with exact frequency requirements. Other problems using this pattern:
   - "Subarrays with K Different Integers" (LeetCode 992)
   - "Minimum Window Substring" (LeetCode 76)

2. **Segmenting Based on Constraints**: When a constraint creates natural breakpoints (like the adjacency constraint here), it's often optimal to process segments independently. This appears in:
   - "Max Consecutive Ones III" (LeetCode 1004) - segments of zeros
   - "Partition Labels" (LeetCode 763) - segments based on last occurrences

## Key Takeaways

1. **Constraints can simplify problems**: The adjacency constraint seems like an extra complication, but it actually helps by breaking the problem into independent segments. Always look for constraints that might simplify rather than complicate.

2. **Exact frequency problems often need window resets**: When you need exactly k occurrences, you must reset the window when any character exceeds k. This is different from "at most k" problems where you can just shrink the window.

3. **Try all reasonable possibilities**: When dealing with limited character sets (26 lowercase letters), it's often efficient to try all possibilities (1-26 distinct characters) rather than searching for an optimal value.

Related problems: [Number of Substrings Containing All Three Characters](/problem/number-of-substrings-containing-all-three-characters), [Count Substrings Without Repeating Character](/problem/count-substrings-without-repeating-character)
