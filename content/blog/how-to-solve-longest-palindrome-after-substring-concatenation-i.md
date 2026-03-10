---
title: "How to Solve Longest Palindrome After Substring Concatenation I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Palindrome After Substring Concatenation I. Medium difficulty, 43.8% acceptance rate. Topics: Two Pointers, String, Dynamic Programming, Enumeration."
date: "2029-10-04"
category: "dsa-patterns"
tags:
  [
    "longest-palindrome-after-substring-concatenation-i",
    "two-pointers",
    "string",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Longest Palindrome After Substring Concatenation I

You're given two strings `s` and `t`, and you need to find the longest palindrome you can create by concatenating any substring from `s` (possibly empty) with any substring from `t` (also possibly empty). The tricky part is that you can't rearrange characters—you must take contiguous substrings from each string and concatenate them in order (s-substring first, then t-substring). This problem combines substring selection with palindrome checking, requiring careful consideration of all possible concatenations.

## Visual Walkthrough

Let's trace through an example: `s = "abca"`, `t = "ded"`

We need to consider all possible substrings from `s` and `t`, concatenate them, and check if the result is a palindrome.

**Step 1: Understanding the possibilities**

- From `s`, we can take: `""`, `"a"`, `"ab"`, `"abc"`, `"abca"`, `"b"`, `"bc"`, `"bca"`, `"c"`, `"ca"`, `"a"`
- From `t`, we can take: `""`, `"d"`, `"de"`, `"ded"`, `"e"`, `"ed"`, `"d"`

**Step 2: Checking some concatenations**

- `"ab" + "ded" = "abded"` → Not a palindrome
- `"a" + "ded" = "aded"` → Not a palindrome
- `"abc" + "d" = "abcd"` → Not a palindrome
- `"bc" + "ed" = "bced"` → Not a palindrome
- `"a" + "d" = "ad"` → Not a palindrome
- `"" + "ded" = "ded"` → Palindrome! Length = 3
- `"a" + "" = "a"` → Palindrome! Length = 1
- `"abca" + "" = "abca"` → Not a palindrome
- `"" + "" = ""` → Palindrome! Length = 0

**Step 3: Finding the longest**
The longest palindrome we found is `"ded"` with length 3. But wait—can we do better?

Let's try `"a" + "ded" = "aded"` → Not a palindrome, but what if we check `"bc" + "d" = "bcd"`? Not a palindrome either.

Actually, let's think systematically: The longest palindrome might come from:

1. A palindrome entirely from `s` (concatenated with empty `t`)
2. A palindrome entirely from `t` (concatenated with empty `s`)
3. A combination where part comes from `s` and part from `t`

For `"abca" + "ded"`, the longest palindrome in `s` alone is `"a"` or `"b"` or `"c"` (length 1). The longest in `t` alone is `"ded"` (length 3). But what about combinations?

Consider `"a" + "d" = "ad"` → Not a palindrome. What about `"a" + "ded" = "aded"`? Check: `"aded"` reversed is `"deda"`, not equal.

But wait! What if we take `"bc"` from `s` and `"d"` from `t`? `"bcd"` is not a palindrome.

The key insight: For a concatenated string to be a palindrome, the beginning must match the end in reverse order. This means we need to find matching prefixes and suffixes between the two strings.

## Brute Force Approach

The brute force approach would be:

1. Generate all possible substrings from `s` (including empty)
2. Generate all possible substrings from `t` (including empty)
3. For each pair, concatenate them
4. Check if the concatenated string is a palindrome
5. Track the maximum length

This approach has O(n² × m² × (n+m)) time complexity where n = |s|, m = |t|:

- O(n²) substrings from `s`
- O(m²) substrings from `t`
- O(n+m) to check if each concatenation is a palindrome

For strings of length 1000, this is 1000² × 1000² × 2000 = 2×10¹⁵ operations—far too slow.

## Optimized Approach

The key insight is that we don't need to check every possible concatenation. Instead, we can think about what makes a concatenated string `s_sub + t_sub` a palindrome:

1. The entire string must read the same forwards and backwards
2. This means the beginning (from `s_sub`) must match the ending (from `t_sub` reversed)

We can approach this by:

1. Finding all palindromic substrings within `s` and `t` individually
2. Finding matching prefixes/suffixes between `s` and `t`

But there's an even better approach: For each possible center in the combined string, expand outward to find the longest palindrome. Since we're concatenating `s` and `t`, we need to consider centers that might span both strings.

The optimal strategy:

1. Treat the concatenation as `s + t` but remember where the boundary is
2. For each possible center (including between characters), expand outward
3. When expanding, ensure we're taking valid substrings from each string
4. Track the maximum length found

However, there's a cleaner approach: Precompute the longest palindrome starting/ending at each position in each string, then combine them intelligently.

## Optimal Solution

The most efficient solution uses dynamic programming to precompute palindrome information, then combines results from both strings. Here's the step-by-step approach:

1. For each string, compute the longest palindrome starting at each position (going right) and ending at each position (going left)
2. Then, for each possible split point between `s` and `t`, combine:
   - A palindrome suffix from `s` (ending at some position)
   - A palindrome prefix from `t` (starting at some position)
   - Where the suffix of `s` matches the reverse of the prefix of `t`

But there's an even more optimized version: We can expand from each possible center while tracking whether we're in `s`, in `t`, or crossing the boundary.

<div class="code-group">

```python
# Time: O((n+m) * min(n,m)) | Space: O(1)
def longestPalindrome(s: str, t: str) -> int:
    """
    Find the longest palindrome that can be formed by concatenating
    a substring from s and a substring from t.
    """
    n, m = len(s), len(t)
    max_len = 0

    # Helper function to expand around a center
    def expand(left: int, right: int, in_s: bool, in_t: bool) -> int:
        """
        Expand from center (left, right) and return palindrome length.
        in_s: True if left pointer is in string s
        in_t: True if right pointer is in string t
        """
        length = 0
        l, r = left, right

        while l >= 0 and r < n + m:
            # Get characters based on which string we're in
            char_l = s[l] if in_s else t[l - n] if l >= n else s[l]
            char_r = s[r] if r < n else t[r - n]

            if char_l == char_r:
                # Add 2 to length if different positions, 1 if same position
                length += 2 if l != r else 1
                l -= 1
                r += 1

                # Update which string we're in
                if l < 0:
                    in_s = False
                if r >= n:
                    in_t = True
            else:
                break

        return length

    # Case 1: Palindromes entirely within s
    for i in range(n):
        # Odd length palindromes in s
        max_len = max(max_len, expand(i, i, True, False))
        # Even length palindromes in s
        if i + 1 < n:
            max_len = max(max_len, expand(i, i + 1, True, False))

    # Case 2: Palindromes entirely within t
    for i in range(m):
        # Odd length palindromes in t
        max_len = max(max_len, expand(n + i, n + i, False, True))
        # Even length palindromes in t
        if i + 1 < m:
            max_len = max(max_len, expand(n + i, n + i + 1, False, True))

    # Case 3: Palindromes that cross from s to t
    # We need centers at the boundary between s and t
    # Odd length: center is last char of s or first char of t
    for i in range(n):
        max_len = max(max_len, expand(i, n, True, True))

    for i in range(m):
        max_len = max(max_len, expand(n - 1, n + i, True, True))

    # Even length: center is between last char of s and first char of t
    if n > 0 and m > 0:
        max_len = max(max_len, expand(n - 1, n, True, True))

    return max_len
```

```javascript
// Time: O((n+m) * min(n,m)) | Space: O(1)
function longestPalindrome(s, t) {
  const n = s.length,
    m = t.length;
  let maxLen = 0;

  // Helper function to expand around a center
  function expand(left, right, inS, inT) {
    let length = 0;
    let l = left,
      r = right;
    let currentInS = inS,
      currentInT = inT;

    while (l >= 0 && r < n + m) {
      // Get characters based on which string we're in
      let charL, charR;

      if (currentInS) {
        charL = s[l];
      } else {
        // l is in t, adjust index
        charL = t[l - n];
      }

      if (r < n) {
        charR = s[r];
      } else {
        charR = t[r - n];
      }

      if (charL === charR) {
        // Add 2 to length if different positions, 1 if same position
        length += l !== r ? 2 : 1;
        l--;
        r++;

        // Update which string we're in
        if (l < 0) currentInS = false;
        if (r >= n) currentInT = true;
      } else {
        break;
      }
    }

    return length;
  }

  // Case 1: Palindromes entirely within s
  for (let i = 0; i < n; i++) {
    // Odd length palindromes in s
    maxLen = Math.max(maxLen, expand(i, i, true, false));
    // Even length palindromes in s
    if (i + 1 < n) {
      maxLen = Math.max(maxLen, expand(i, i + 1, true, false));
    }
  }

  // Case 2: Palindromes entirely within t
  for (let i = 0; i < m; i++) {
    // Odd length palindromes in t
    maxLen = Math.max(maxLen, expand(n + i, n + i, false, true));
    // Even length palindromes in t
    if (i + 1 < m) {
      maxLen = Math.max(maxLen, expand(n + i, n + i + 1, false, true));
    }
  }

  // Case 3: Palindromes that cross from s to t
  // Odd length: center is last char of s or first char of t
  for (let i = 0; i < n; i++) {
    maxLen = Math.max(maxLen, expand(i, n, true, true));
  }

  for (let i = 0; i < m; i++) {
    maxLen = Math.max(maxLen, expand(n - 1, n + i, true, true));
  }

  // Even length: center is between last char of s and first char of t
  if (n > 0 && m > 0) {
    maxLen = Math.max(maxLen, expand(n - 1, n, true, true));
  }

  return maxLen;
}
```

```java
// Time: O((n+m) * min(n,m)) | Space: O(1)
class Solution {
    public int longestPalindrome(String s, String t) {
        int n = s.length(), m = t.length();
        int maxLen = 0;

        // Case 1: Palindromes entirely within s
        for (int i = 0; i < n; i++) {
            // Odd length palindromes
            maxLen = Math.max(maxLen, expand(s, t, i, i));
            // Even length palindromes
            if (i + 1 < n) {
                maxLen = Math.max(maxLen, expand(s, t, i, i + 1));
            }
        }

        // Case 2: Palindromes entirely within t
        for (int i = 0; i < m; i++) {
            // Odd length palindromes (adjust indices for t)
            maxLen = Math.max(maxLen, expand(s, t, n + i, n + i));
            // Even length palindromes
            if (i + 1 < m) {
                maxLen = Math.max(maxLen, expand(s, t, n + i, n + i + 1));
            }
        }

        // Case 3: Palindromes that cross from s to t
        // We need to check centers that could span both strings
        // Check all possible centers in s that could expand into t
        for (int i = 0; i < n; i++) {
            maxLen = Math.max(maxLen, expandCross(s, t, i, n));
        }

        // Check all possible centers in t that could expand into s
        for (int i = 0; i < m; i++) {
            maxLen = Math.max(maxLen, expandCross(t, s, i, 0));
        }

        return maxLen;
    }

    // Expand for palindromes within a single string
    private int expand(String s, String t, int left, int right) {
        int n = s.length(), m = t.length();
        int l = left, r = right;
        int length = 0;

        while (l >= 0 && r < n + m) {
            char charL, charR;

            // Get left character
            if (l < n) {
                charL = s.charAt(l);
            } else {
                charL = t.charAt(l - n);
            }

            // Get right character
            if (r < n) {
                charR = s.charAt(r);
            } else {
                charR = t.charAt(r - n);
            }

            if (charL == charR) {
                length += (l != r) ? 2 : 1;
                l--;
                r++;
            } else {
                break;
            }
        }

        return length;
    }

    // Expand for palindromes crossing from first string to second
    private int expandCross(String first, String second, int center, int boundary) {
        int l = center, r = boundary;
        int length = 0;
        boolean expanded = false;

        while (l >= 0 && r < second.length()) {
            if (first.charAt(l) == second.charAt(r)) {
                length += 2;
                l--;
                r++;
                expanded = true;
            } else {
                break;
            }
        }

        // If we never expanded, this isn't a valid cross palindrome
        return expanded ? length : 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n+m) × min(n,m))

- We consider O(n+m) possible centers (each position in s and t, plus positions between characters)
- For each center, we expand outward up to min(n,m) steps in the worst case (when strings are all the same character)
- The expansion stops when we hit the beginning of s or end of t, or when characters don't match

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables
- No additional data structures are needed

## Common Mistakes

1. **Forgetting empty substrings:** The problem allows empty substrings from either string. Candidates often miss that the longest palindrome might come from just one string (with empty substring from the other).

2. **Incorrect boundary handling:** When expanding from a center that crosses from s to t, it's easy to get indices wrong. Remember that when we're in t, indices need to be adjusted by n (length of s).

3. **Only checking palindromes within individual strings:** Some candidates find the longest palindrome in s and the longest in t, then take the maximum. This misses palindromes formed by combining parts of both strings.

4. **Not considering even-length palindromes:** The center expansion approach needs to handle both odd-length (center on a character) and even-length (center between characters) palindromes.

## When You'll See This Pattern

This problem combines two fundamental patterns:

1. **Center Expansion for Palindromes** (like LeetCode #5 Longest Palindromic Substring)
   - The technique of expanding from centers to find palindromes
   - Difference: Here we have two strings and need to handle the boundary

2. **String Concatenation Problems** (like LeetCode #1763 Longest Nice Substring)
   - Problems where you combine substrings from different sources
   - Often require considering all possible split points

3. **Two-String Matching Problems** (like LeetCode #1092 Shortest Common Supersequence)
   - Problems involving finding patterns across two strings
   - Often use dynamic programming or two-pointer techniques

## Key Takeaways

1. **Center expansion is powerful for palindrome problems:** Instead of checking every substring, expand from centers to efficiently find palindromes.

2. **Handle boundaries carefully in multi-string problems:** When working with concatenated strings, track which string each pointer is in and adjust indices accordingly.

3. **Consider all cases systematically:** Break the problem into cases—palindromes entirely in s, entirely in t, and crossing the boundary—to ensure you don't miss any possibilities.

[Practice this problem on CodeJeet](/problem/longest-palindrome-after-substring-concatenation-i)
