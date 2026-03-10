---
title: "How to Solve Find the Occurrence of First Almost Equal Substring — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Occurrence of First Almost Equal Substring. Hard difficulty, 15.3% acceptance rate. Topics: String, String Matching."
date: "2026-08-24"
category: "dsa-patterns"
tags: ["find-the-occurrence-of-first-almost-equal-substring", "string", "string-matching", "hard"]
---

# How to Solve Find the Occurrence of First Almost Equal Substring

This problem asks us to find the smallest starting index in string `s` where a substring of length equal to `pattern` is "almost equal" — meaning we can change at most one character to make it identical to `pattern`. The challenge lies in efficiently checking all possible substrings without resorting to O(n·m) character-by-character comparisons, where n = |s| and m = |pattern|.

## Visual Walkthrough

Let's trace through an example: `s = "abcde"`, `pattern = "bcd"`.

We need to check every substring of length 3 in `s`:

- Starting index 0: `"abc"` vs `"bcd"` → mismatches at positions 0,1,2 (3 mismatches) ❌
- Starting index 1: `"bcd"` vs `"bcd"` → 0 mismatches (perfect match) ✅
- Starting index 2: `"cde"` vs `"bcd"` → mismatches at positions 0,2 (2 mismatches) ❌

Since we found a perfect match at index 1, we return 1. But what if we had `s = "axcde"`, `pattern = "bcd"`?

- Index 0: `"axc"` vs `"bcd"` → mismatches at 0,1 (2 mismatches) ❌
- Index 1: `"xcd"` vs `"bcd"` → mismatch at 0 only (1 mismatch) ✅
- Index 2: `"cde"` vs `"bcd"` → mismatches at 0,2 (2 mismatches) ❌

Here we return 1 because `"xcd"` can become `"bcd"` by changing 'x' to 'b'.

The key insight: we need to count mismatches efficiently for each sliding window.

## Brute Force Approach

The most straightforward solution is to check every possible starting index i from 0 to n-m, and for each, compare the substring s[i:i+m] with pattern character by character:

1. For each starting index i (0 ≤ i ≤ n-m):
2. Initialize mismatch_count = 0
3. For j from 0 to m-1:
   - If s[i+j] != pattern[j]: mismatch_count += 1
   - If mismatch_count > 1: break early (no need to continue checking)
4. If mismatch_count ≤ 1: return i (first valid index)
5. If no valid index found, return -1

This approach has O(n·m) time complexity, which is too slow for large inputs (n and m up to 10^5 would give 10^10 operations).

## Optimized Approach

We need to reduce the O(m) comparison time for each window. The key insight is that when we slide the window from position i to i+1, most of the comparison results stay the same — only the character leaving the window and the new character entering need to be reconsidered.

However, there's an even better approach using **rolling hash** or **sliding window with mismatch tracking**. Since we only care whether mismatch_count ≤ 1, we can track mismatches efficiently:

1. Precompute the initial mismatch count for the first window
2. As we slide the window:
   - Remove the leftmost character's contribution to mismatch count
   - Add the new rightmost character's contribution
   - Update mismatch count accordingly

But there's a catch: when characters at the same relative position match/don't match, we need to track this precisely. A simpler approach is to use **prefix sums of mismatches**:

1. Create a boolean array where match[i] = (s[i] == pattern[i % m])? This doesn't work directly because pattern has fixed length m, not matching s's length.

Actually, the cleanest approach is to use a **sliding window with a mismatch counter** that we update incrementally. For window starting at i:

- When moving to window starting at i+1:
  - If s[i] != pattern[0]: mismatch_count-- (left character leaving was a mismatch)
  - If s[i+m] != pattern[m-1]: mismatch_count++ (new character entering at the end)

Wait, this doesn't work because the pattern alignment shifts! When we slide the window, we're comparing s[i+1:i+1+m] with pattern[0:m], not with a shifted pattern.

The correct incremental approach: For window at position i, we compare s[i+j] with pattern[j]. When we move to i+1, we compare s[i+1+j] with pattern[j]. So the character s[i] was compared with pattern[0], and s[i+m] is compared with pattern[m-1] in the new window.

Thus:

- Leaving: s[i] was compared with pattern[0]
- Entering: s[i+m] is compared with pattern[m-1]

But this only works if we track which positions are mismatches. We need to maintain an array or counter that we can update efficiently.

Actually, there's an elegant solution: **Use a queue or sliding window to track the current mismatches**. Initialize with the first window's mismatches, then for each slide:

1. If the leftmost character (leaving) was a mismatch, decrement counter
2. If the new character (entering) is a mismatch with its corresponding pattern position, increment counter

The corresponding pattern position for s[i+m] in the new window is pattern[m-1], and for s[i] in the old window was pattern[0].

## Optimal Solution

We can implement this with O(n) time and O(1) extra space by maintaining a running count of mismatches as we slide the window across s.

<div class="code-group">

```python
# Time: O(n) where n = len(s) | Space: O(1)
def findOccurrence(s: str, pattern: str) -> int:
    """
    Find the smallest starting index of a substring in s that is almost equal to pattern.
    Almost equal means at most one character difference.
    """
    n, m = len(s), len(pattern)

    # If pattern is longer than s, no possible substring
    if m > n:
        return -1

    # Count mismatches in the first window
    mismatches = 0
    for i in range(m):
        if s[i] != pattern[i]:
            mismatches += 1

    # Check first window
    if mismatches <= 1:
        return 0

    # Slide the window across s
    for i in range(1, n - m + 1):
        # Character leaving the window (left end of previous window)
        if s[i - 1] != pattern[0]:
            mismatches -= 1

        # Character entering the window (right end of new window)
        if s[i + m - 1] != pattern[m - 1]:
            mismatches += 1

        # Check if current window is almost equal
        if mismatches <= 1:
            return i

    # No almost-equal substring found
    return -1
```

```javascript
// Time: O(n) where n = s.length | Space: O(1)
function findOccurrence(s, pattern) {
  /**
   * Find the smallest starting index of a substring in s that is almost equal to pattern.
   * Almost equal means at most one character difference.
   */
  const n = s.length,
    m = pattern.length;

  // If pattern is longer than s, no possible substring
  if (m > n) return -1;

  // Count mismatches in the first window
  let mismatches = 0;
  for (let i = 0; i < m; i++) {
    if (s[i] !== pattern[i]) {
      mismatches++;
    }
  }

  // Check first window
  if (mismatches <= 1) return 0;

  // Slide the window across s
  for (let i = 1; i <= n - m; i++) {
    // Character leaving the window (left end of previous window)
    if (s[i - 1] !== pattern[0]) {
      mismatches--;
    }

    // Character entering the window (right end of new window)
    if (s[i + m - 1] !== pattern[m - 1]) {
      mismatches++;
    }

    // Check if current window is almost equal
    if (mismatches <= 1) return i;
  }

  // No almost-equal substring found
  return -1;
}
```

```java
// Time: O(n) where n = s.length() | Space: O(1)
class Solution {
    public int findOccurrence(String s, String pattern) {
        /**
         * Find the smallest starting index of a substring in s that is almost equal to pattern.
         * Almost equal means at most one character difference.
         */
        int n = s.length(), m = pattern.length();

        // If pattern is longer than s, no possible substring
        if (m > n) return -1;

        // Count mismatches in the first window
        int mismatches = 0;
        for (int i = 0; i < m; i++) {
            if (s.charAt(i) != pattern.charAt(i)) {
                mismatches++;
            }
        }

        // Check first window
        if (mismatches <= 1) return 0;

        // Slide the window across s
        for (int i = 1; i <= n - m; i++) {
            // Character leaving the window (left end of previous window)
            if (s.charAt(i - 1) != pattern.charAt(0)) {
                mismatches--;
            }

            // Character entering the window (right end of new window)
            if (s.charAt(i + m - 1) != pattern.charAt(m - 1)) {
                mismatches++;
            }

            // Check if current window is almost equal
            if (mismatches <= 1) return i;
        }

        // No almost-equal substring found
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of string `s`

- We process the first window in O(m) time
- Each subsequent window update takes O(1) time
- We process at most n-m+1 windows, so total O(n) time

**Space Complexity:** O(1)

- We only use a few integer variables (n, m, mismatches, loop counters)
- No additional data structures that scale with input size

## Common Mistakes

1. **Off-by-one errors in window boundaries**: When sliding the window, it's easy to mis-calculate which characters are leaving/entering. Remember: window at position i covers s[i:i+m]. When moving from i to i+1, s[i] leaves and s[i+m] enters.

2. **Forgetting the early exit condition**: If m > n, there can't be any valid substring. Always check this first to avoid index out of bounds errors.

3. **Incorrect mismatch tracking for non-adjacent positions**: Some candidates try to optimize by only tracking whether the first and last characters match, but we need to track ALL mismatches in the window. Our solution correctly maintains a running total.

4. **Not handling the first window separately**: The sliding window update logic assumes we have a previous window to update from. We must initialize the mismatch count for the first window before starting the slide.

## When You'll See This Pattern

This sliding window with incremental update pattern appears in many string matching problems:

1. **Find All Anagrams in a String (LeetCode 438)**: Similar sliding window with character frequency counts that update incrementally.

2. **Permutation in String (LeetCode 567)**: Check if one string contains a permutation of another using sliding window with character counts.

3. **Maximum Average Subarray I (LeetCode 643)**: Find a contiguous subarray of fixed length with maximum average using sliding window sum.

The core idea is always the same: when moving a fixed-size window, most of the computation from the previous window can be reused, with only O(1) updates needed.

## Key Takeaways

1. **Sliding window with incremental updates** is powerful for fixed-length substring problems. Instead of recomputing everything for each window, update only what changes.

2. **Think about what stays the same** when sliding. In this problem, the middle m-2 comparisons between consecutive windows are actually comparing different characters, but we can still maintain a mismatch counter efficiently.

3. **Always initialize carefully**. Sliding window algorithms typically need special handling for the first window before the main loop begins.

Related problems: [Check Whether Two Strings are Almost Equivalent](/problem/check-whether-two-strings-are-almost-equivalent), [Count Almost Equal Pairs II](/problem/count-almost-equal-pairs-ii)
