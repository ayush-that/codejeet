---
title: "How to Solve Longest Ideal Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Ideal Subsequence. Medium difficulty, 46.6% acceptance rate. Topics: Hash Table, String, Dynamic Programming."
date: "2027-01-22"
category: "dsa-patterns"
tags: ["longest-ideal-subsequence", "hash-table", "string", "dynamic-programming", "medium"]
---

# How to Solve Longest Ideal Subsequence

This problem asks us to find the longest subsequence of a string where adjacent characters have alphabet positions within `k` of each other. The challenge lies in efficiently tracking subsequence possibilities without checking every possible subsequence, which would be exponential. This is essentially a variation of the longest increasing subsequence problem with a constraint on adjacent elements.

## Visual Walkthrough

Let's trace through `s = "acfgbd"` with `k = 2`:

1. Start with `'a'` (position 1): Longest ideal subsequence ending with `'a'` is 1.
2. Next `'c'` (position 3): Check characters within ±2 of `'c'` (positions 1-5: `'a'`, `'b'`, `'c'`, `'d'`, `'e'`). The best we have is ending with `'a'` (length 1), so `'c'` can extend to length 2.
3. Next `'f'` (position 6): Check positions 4-8 (`'d'` through `'h'`). The best we have is ending with `'c'` (length 2), so `'f'` extends to length 3.
4. Next `'g'` (position 7): Check positions 5-9 (`'e'` through `'i'`). The best is ending with `'f'` (length 3), so `'g'` extends to length 4.
5. Next `'b'` (position 2): Check positions 1-4 (`'a'` through `'d'`). The best is ending with `'a'` (length 1), so `'b'` extends to length 2 (not better than existing `'b'` length).
6. Next `'d'` (position 4): Check positions 2-6 (`'b'` through `'f'`). The best is ending with `'b'` (length 2) or `'c'` (length 2), so `'d'` extends to length 3.

The maximum length we see is 4 (ending with `'g'`). The subsequence would be `"acfg"`.

## Brute Force Approach

A brute force approach would generate all possible subsequences of `s` (2^n possibilities), check if each is "ideal" (adjacent characters within `k`), and track the longest. This is clearly infeasible for any reasonable `n`.

Even a smarter brute force using recursion would have exponential time complexity. For each character, we could either include it or not, but we'd need to track the last character included to check the `k` constraint. This leads to O(2^n) time complexity.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem similar to Longest Increasing Subsequence (LIS), but with an important optimization. Instead of checking all previous characters for each new character (which would be O(n²)), we can maintain an array `dp` where `dp[char]` stores the longest ideal subsequence ending with that character.

For each character in `s`:

1. Calculate its alphabet position (0-25 for 'a'-'z')
2. Look at all characters within `k` positions of this character
3. The best ending with current character is 1 + the maximum `dp` value among those nearby characters
4. Update `dp[current_char]` with this value if it's better
5. Track the overall maximum

This works because any ideal subsequence ending with a character must have come from a previous character within `k` alphabet positions. By tracking the best for each ending character, we avoid recomputing.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * k) | Space: O(1) since dp array is fixed size 26
def longestIdealString(s: str, k: int) -> int:
    # dp array to store longest ideal subsequence ending with each character
    # Index 0 represents 'a', 1 represents 'b', etc.
    dp = [0] * 26

    # Track the overall maximum length found
    max_length = 0

    # Process each character in the string
    for char in s:
        # Convert character to its alphabet position (0-25)
        curr_idx = ord(char) - ord('a')

        # Start with length 1 (the subsequence containing just this character)
        best_ending_here = 1

        # Check all possible previous characters within k alphabet positions
        # We need to check from max(0, curr_idx - k) to min(25, curr_idx + k)
        # to avoid going out of bounds
        start = max(0, curr_idx - k)
        end = min(25, curr_idx + k)

        for prev_idx in range(start, end + 1):
            # The best we can do ending with current character is
            # 1 + best subsequence ending with any valid previous character
            best_ending_here = max(best_ending_here, dp[prev_idx] + 1)

        # Update dp for current character
        dp[curr_idx] = max(dp[curr_idx], best_ending_here)

        # Update overall maximum
        max_length = max(max_length, dp[curr_idx])

    return max_length
```

```javascript
// Time: O(n * k) | Space: O(1) since dp array is fixed size 26
function longestIdealString(s, k) {
  // dp array to store longest ideal subsequence ending with each character
  // Index 0 represents 'a', 1 represents 'b', etc.
  const dp = new Array(26).fill(0);

  // Track the overall maximum length found
  let maxLength = 0;

  // Process each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    // Convert character to its alphabet position (0-25)
    const currIdx = char.charCodeAt(0) - "a".charCodeAt(0);

    // Start with length 1 (the subsequence containing just this character)
    let bestEndingHere = 1;

    // Check all possible previous characters within k alphabet positions
    // We need to check from max(0, currIdx - k) to min(25, currIdx + k)
    // to avoid going out of bounds
    const start = Math.max(0, currIdx - k);
    const end = Math.min(25, currIdx + k);

    for (let prevIdx = start; prevIdx <= end; prevIdx++) {
      // The best we can do ending with current character is
      // 1 + best subsequence ending with any valid previous character
      bestEndingHere = Math.max(bestEndingHere, dp[prevIdx] + 1);
    }

    // Update dp for current character
    dp[currIdx] = Math.max(dp[currIdx], bestEndingHere);

    // Update overall maximum
    maxLength = Math.max(maxLength, dp[currIdx]);
  }

  return maxLength;
}
```

```java
// Time: O(n * k) | Space: O(1) since dp array is fixed size 26
class Solution {
    public int longestIdealString(String s, int k) {
        // dp array to store longest ideal subsequence ending with each character
        // Index 0 represents 'a', 1 represents 'b', etc.
        int[] dp = new int[26];

        // Track the overall maximum length found
        int maxLength = 0;

        // Process each character in the string
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            // Convert character to its alphabet position (0-25)
            int currIdx = c - 'a';

            // Start with length 1 (the subsequence containing just this character)
            int bestEndingHere = 1;

            // Check all possible previous characters within k alphabet positions
            // We need to check from max(0, currIdx - k) to min(25, currIdx + k)
            // to avoid going out of bounds
            int start = Math.max(0, currIdx - k);
            int end = Math.min(25, currIdx + k);

            for (int prevIdx = start; prevIdx <= end; prevIdx++) {
                // The best we can do ending with current character is
                // 1 + best subsequence ending with any valid previous character
                bestEndingHere = Math.max(bestEndingHere, dp[prevIdx] + 1);
            }

            // Update dp for current character
            dp[currIdx] = Math.max(dp[currIdx], bestEndingHere);

            // Update overall maximum
            maxLength = Math.max(maxLength, dp[currIdx]);
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k) where n is the length of the string and k is the given parameter. For each of the n characters, we check up to 2k+1 previous characters (but bounded by 26). Since k ≤ 25, this is effectively O(26n) = O(n).

**Space Complexity:** O(1) because we use a fixed-size array of 26 integers regardless of input size. The dp array doesn't grow with n.

## Common Mistakes

1. **Forgetting to handle character bounds:** When checking characters within ±k positions, you must ensure you don't go below 0 or above 25. Using `max(0, curr_idx - k)` and `min(25, curr_idx + k)` is crucial.

2. **Not updating dp[current_char] correctly:** Some candidates update dp[current_char] with the new value without checking if it's better than the existing value. Since we process characters left to right, we might see the same character multiple times, and we should always keep the maximum value.

3. **Confusing subsequence with substring:** Remember a subsequence doesn't need to be contiguous. The characters can be non-adjacent in the original string as long as they appear in order.

4. **Overcomplicating with 2D DP:** Some candidates try to use a 2D dp[i][j] approach similar to LIS, which would be O(n²). The key optimization is recognizing we only need to track by ending character, not by position.

## When You'll See This Pattern

This pattern of tracking DP state by value rather than position appears in several problems:

1. **Longest Increasing Subsequence (LIS)** - The classic O(n²) solution can be optimized to O(n log n) using binary search, but the basic DP approach is similar.

2. **Longest Arithmetic Subsequence** - LeetCode #1027 uses a similar idea of tracking subsequences by their difference value.

3. **Longest String Chain** - LeetCode #1048 where you build chains of words where each word is the previous word plus one letter.

The common theme is optimizing subsequence problems by tracking state by some property (ending value, difference, etc.) rather than by position in the input.

## Key Takeaways

1. **DP with state compression:** When dealing with subsequence problems with constraints on adjacent elements, consider tracking DP state by the ending element's value rather than its position.

2. **Fixed-size state space:** When the possible values are limited (like 26 letters), you can often achieve O(n) time complexity even for what seems like an O(n²) problem.

3. **Character to index conversion:** Remember the pattern `ord(char) - ord('a')` in Python or `char - 'a'` in Java/JavaScript for converting lowercase letters to 0-25 indices.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence)
