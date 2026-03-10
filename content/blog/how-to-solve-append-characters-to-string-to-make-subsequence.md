---
title: "How to Solve Append Characters to String to Make Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Append Characters to String to Make Subsequence. Medium difficulty, 73.0% acceptance rate. Topics: Two Pointers, String, Greedy."
date: "2028-07-24"
category: "dsa-patterns"
tags:
  ["append-characters-to-string-to-make-subsequence", "two-pointers", "string", "greedy", "medium"]
---

# How to Solve Append Characters to String to Make Subsequence

This problem asks us to find how many characters we need to append to the end of string `s` so that string `t` becomes a subsequence of the modified `s`. A subsequence means `t` can be formed from `s` by deleting characters (without changing order), but we're only allowed to append to `s`, not delete from it. The tricky part is that we need to find the longest prefix of `t` that's already a subsequence of `s`, then append whatever remains.

## Visual Walkthrough

Let's trace through an example: `s = "coaching"`, `t = "coding"`

We want to find how much of `t` we can match as a subsequence within `s`:

1. Look for 'c' in `s`: Found at position 0 ✓
2. Look for 'o' in `s` after position 0: Found at position 1 ✓
3. Look for 'd' in `s` after position 1: Not found in positions 2-7
4. We've matched "co" from `t` (2 characters)
5. Remaining characters in `t`: "ding" (4 characters)
6. We need to append these 4 characters to `s`

Another example: `s = "abcde"`, `t = "ace"`

1. Look for 'a' in `s`: Found at position 0 ✓
2. Look for 'c' in `s` after position 0: Found at position 2 ✓
3. Look for 'e' in `s` after position 2: Found at position 4 ✓
4. We've matched all of `t` (3 characters)
5. Remaining characters: 0
6. Append 0 characters

The pattern is clear: we need to find how many characters from `t` we can match in order within `s`, then append whatever's left.

## Brute Force Approach

A naive approach might try to append characters one by one and check if `t` is now a subsequence, but this would be extremely inefficient. Another brute force would be to generate all possible subsequences of `s` and see which ones match prefixes of `t`, but that's exponential time.

What a candidate might initially try: check if `t` is already a subsequence of `s`. If not, try appending one character from `t` to `s` and check again, repeating until `t` becomes a subsequence. This would be O(n × m²) where n = |s|, m = |t|, which is far too slow for the constraints (strings up to 10⁵ characters).

The key insight is that we don't need to actually modify `s` or try different append combinations. We just need to find the longest prefix of `t` that's already a subsequence of `s`.

## Optimized Approach

The optimal solution uses a **two-pointer greedy approach**:

1. Use pointer `i` for `s` and pointer `j` for `t`
2. Move through `s` looking for characters that match `t[j]`
3. When we find a match, advance both pointers
4. When we don't find a match, only advance `i` (keep looking in `s`)
5. Stop when we reach the end of `s`
6. The number of unmatched characters in `t` is `len(t) - j`

Why does this greedy approach work? Because we're trying to match `t` as early as possible in `s`. If we skip a matching character in `s`, we might miss our chance to match more of `t` later. The greedy approach of matching the first occurrence of each character from `t` in `s` gives us the longest possible prefix match.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = len(s), m = len(t)
# Space: O(1) - only using pointers
def appendCharacters(s: str, t: str) -> int:
    """
    Returns the minimum number of characters to append to s
    so that t becomes a subsequence of the modified s.
    """
    i, j = 0, 0  # i for s, j for t

    # Traverse both strings with two pointers
    while i < len(s) and j < len(t):
        # If current characters match, move to next character in t
        if s[i] == t[j]:
            j += 1
        # Always move to next character in s
        i += 1

    # j now represents how many characters from t we matched
    # Remaining characters in t that need to be appended: len(t) - j
    return len(t) - j
```

```javascript
// Time: O(n + m) where n = s.length, m = t.length
// Space: O(1) - only using pointers
function appendCharacters(s, t) {
  let i = 0,
    j = 0; // i for s, j for t

  // Traverse both strings with two pointers
  while (i < s.length && j < t.length) {
    // If current characters match, move to next character in t
    if (s[i] === t[j]) {
      j++;
    }
    // Always move to next character in s
    i++;
  }

  // j now represents how many characters from t we matched
  // Remaining characters in t that need to be appended: t.length - j
  return t.length - j;
}
```

```java
// Time: O(n + m) where n = s.length(), m = t.length()
// Space: O(1) - only using pointers
class Solution {
    public int appendCharacters(String s, String t) {
        int i = 0, j = 0;  // i for s, j for t

        // Traverse both strings with two pointers
        while (i < s.length() && j < t.length()) {
            // If current characters match, move to next character in t
            if (s.charAt(i) == t.charAt(j)) {
                j++;
            }
            // Always move to next character in s
            i++;
        }

        // j now represents how many characters from t we matched
        // Remaining characters in t that need to be appended: t.length() - j
        return t.length() - j;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)** where n = |s| and m = |t|

- We traverse each string at most once with our two pointers
- In the worst case, we go through all of `s` (n iterations) and all of `t` (m iterations)
- Each iteration does constant work (comparison and pointer increment)

**Space Complexity: O(1)**

- We only use a few integer variables for pointers
- No additional data structures are needed
- The input strings are not modified

## Common Mistakes

1. **Forgetting to always increment `i`**: Some candidates only increment `i` when there's a match, but we need to keep searching through `s` even when characters don't match. The correct pattern is: if match, increment both; if no match, increment only `i`.

2. **Using nested loops instead of two pointers**: A less efficient approach would use nested loops (for each char in `t`, search for it in `s` starting from last position). This is O(n × m) and fails on large inputs.

3. **Misunderstanding subsequence vs substring**: Remember that subsequences don't need to be contiguous, while substrings do. We're looking for characters in order, but not necessarily adjacent.

4. **Off-by-one errors with string indices**: When using languages like Java with `.charAt(i)`, remember indices go from 0 to length-1. The while condition `i < s.length()` is correct, not `i <= s.length()`.

## When You'll See This Pattern

The two-pointer subsequence matching pattern appears in several problems:

1. **Is Subsequence (LeetCode 392)**: Almost identical to this problem - check if `t` is a subsequence of `s` using the same two-pointer approach.

2. **Longest Word in Dictionary through Deleting (LeetCode 524)**: Find the longest word in dictionary that's a subsequence of `s` - uses the same core matching logic.

3. **Number of Matching Subsequences (LeetCode 792)**: Count how many words from a list are subsequences of `s` - extends the pattern to multiple target strings.

The key insight across these problems is that checking if one string is a subsequence of another can be done efficiently with two pointers, and many subsequence problems build on this foundation.

## Key Takeaways

1. **Two-pointer greedy matching** is the optimal approach for subsequence checking problems. Match characters in order as early as possible in the source string.

2. **The longest prefix match** technique: Instead of checking all possibilities, find how much of the target you can match, then handle the remainder. This often leads to O(n + m) solutions.

3. **Recognize when order matters**: Subsequence problems care about maintaining order but not contiguity. This allows for greedy matching since we never need to backtrack - if we skip a matching character, we can't use it later for an earlier position in the target.

Related problems: [Is Subsequence](/problem/is-subsequence), [Minimum Operations to Make a Subsequence](/problem/minimum-operations-to-make-a-subsequence)
