---
title: "How to Solve Subsequence With the Minimum Score — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Subsequence With the Minimum Score. Hard difficulty, 33.2% acceptance rate. Topics: Two Pointers, String, Binary Search."
date: "2026-05-21"
category: "dsa-patterns"
tags: ["subsequence-with-the-minimum-score", "two-pointers", "string", "binary-search", "hard"]
---

# How to Solve Subsequence With the Minimum Score

This problem asks us to find the minimum possible score when removing characters from string `t` to make it a subsequence of string `s`. The score is defined as the distance between the leftmost and rightmost removed characters (or 0 if no characters are removed). What makes this problem tricky is that we need to find a balance: we want to remove as few characters as possible, but we also want those removals to be as close together as possible to minimize the score.

## Visual Walkthrough

Let's trace through an example: `s = "abacaba"`, `t = "bzaa"`

We need to remove characters from `t` to make it a subsequence of `s`. Let's think about what this means:

- A subsequence means we can find the characters of `t` (after removals) in `s` in the same order, but not necessarily contiguous
- The score is `right - left + 1` where `left` and `right` are indices in the original `t` of the removed characters

First, let's find if we can make `t` a subsequence of `s` without removing anything:

- `t[0] = 'b'` → found at `s[1]`
- `t[1] = 'z'` → not found in `s` after position 1
  So we need to remove at least one character.

Let's try removing just `'z'` at index 1:

- Remaining `t` = `"baa"`
- Check if `"baa"` is subsequence of `"abacaba"`:
  - `'b'` at `s[1]`
  - `'a'` at `s[2]`
  - `'a'` at `s[4]`
    ✓ Works! Score = `1 - 1 + 1 = 1`

But can we get a lower score? The minimum possible score is 0 (no removals), but that's not possible here. Let's think systematically: we want to find a contiguous segment of `t` to remove that makes the remaining string a subsequence of `s`. The smaller this segment, the lower the score.

## Brute Force Approach

The brute force approach would be to try all possible removal intervals `[left, right]` in `t`:

1. For each possible `left` from 0 to `len(t)-1`
2. For each possible `right` from `left` to `len(t)-1`
3. Remove characters from `left` to `right` in `t`
4. Check if the resulting string is a subsequence of `s`
5. Track the minimum `right - left + 1`

This is O(n³) time: O(n²) intervals × O(n) to check subsequence. For `n = 10^5` (typical constraint), this is far too slow.

Even checking all possible subsequences directly is exponential. We need a smarter approach.

## Optimized Approach

The key insight is that we can precompute for each position in `t`:

1. **Prefix matching**: For each prefix of `t`, find the earliest position in `s` where this prefix appears as a subsequence
2. **Suffix matching**: For each suffix of `t`, find the latest position in `s` where this suffix appears as a subsequence

With these two arrays, we can then find the minimum removal interval:

- Let `prefix[i]` = minimum index in `s` where `t[0..i-1]` is a subsequence
- Let `suffix[i]` = maximum index in `s` where `t[i..n-1]` is a subsequence

If `prefix[i] <= suffix[j]` for some `i <= j`, then we can keep `t[0..i-1]` and `t[j..n-1]` as subsequences of `s`, meaning we can remove `t[i..j-1]`. The score would be `(j-1) - i + 1 = j - i`.

We can use two pointers to find the minimum `j - i` efficiently:

1. Initialize `i = 0, j = 0`
2. While `j < n`:
   - If `prefix[i] <= suffix[j]`, we found a valid removal `[i, j-1]`
   - Update answer with `j - i`
   - Try to increase `i` to find smaller intervals
   - Otherwise, increase `j` to find valid intervals

This gives us O(n) time after the O(n) preprocessing.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = len(s), m = len(t)
# Space: O(m) for the prefix and suffix arrays
def minimumScore(s: str, t: str) -> int:
    n, m = len(s), len(t)

    # Step 1: Precompute prefix array
    # prefix[i] = minimum index in s where t[0..i-1] is a subsequence
    prefix = [float('inf')] * (m + 1)
    prefix[0] = -1  # Empty prefix matches before start of s

    i, j = 0, 0  # i in s, j in t
    while i < n and j < m:
        if s[i] == t[j]:
            prefix[j + 1] = i
            j += 1
        i += 1

    # Fill remaining positions with infinity (not possible)
    for k in range(j + 1, m + 1):
        prefix[k] = float('inf')

    # Step 2: Precompute suffix array
    # suffix[i] = maximum index in s where t[i..m-1] is a subsequence
    suffix = [float('-inf')] * (m + 1)
    suffix[m] = n  # Empty suffix matches after end of s

    i, j = n - 1, m - 1  # i in s, j in t
    while i >= 0 and j >= 0:
        if s[i] == t[j]:
            suffix[j] = i
            j -= 1
        i -= 1

    # Fill remaining positions with -infinity (not possible)
    for k in range(j, -1, -1):
        suffix[k] = float('-inf')

    # Step 3: Find minimum score using two pointers
    # We want to find i <= j such that prefix[i] <= suffix[j]
    # Then we can remove t[i..j-1] with score j - i
    ans = m  # Worst case: remove all characters

    j = 0
    for i in range(m + 1):
        # Move j forward until we find a valid position or reach end
        while j <= m and prefix[i] >= suffix[j]:
            j += 1

        # If we found a valid j, update answer
        if j <= m:
            ans = min(ans, j - i)

    return ans
```

```javascript
// Time: O(n + m) where n = s.length, m = t.length
// Space: O(m) for the prefix and suffix arrays
function minimumScore(s, t) {
  const n = s.length,
    m = t.length;

  // Step 1: Precompute prefix array
  // prefix[i] = minimum index in s where t[0..i-1] is a subsequence
  const prefix = new Array(m + 1).fill(Infinity);
  prefix[0] = -1; // Empty prefix matches before start of s

  let i = 0,
    j = 0; // i in s, j in t
  while (i < n && j < m) {
    if (s[i] === t[j]) {
      prefix[j + 1] = i;
      j++;
    }
    i++;
  }

  // Fill remaining positions with Infinity (not possible)
  for (let k = j + 1; k <= m; k++) {
    prefix[k] = Infinity;
  }

  // Step 2: Precompute suffix array
  // suffix[i] = maximum index in s where t[i..m-1] is a subsequence
  const suffix = new Array(m + 1).fill(-Infinity);
  suffix[m] = n; // Empty suffix matches after end of s

  ((i = n - 1), (j = m - 1)); // i in s, j in t
  while (i >= 0 && j >= 0) {
    if (s[i] === t[j]) {
      suffix[j] = i;
      j--;
    }
    i--;
  }

  // Fill remaining positions with -Infinity (not possible)
  for (let k = j; k >= 0; k--) {
    suffix[k] = -Infinity;
  }

  // Step 3: Find minimum score using two pointers
  // We want to find i <= j such that prefix[i] <= suffix[j]
  // Then we can remove t[i..j-1] with score j - i
  let ans = m; // Worst case: remove all characters

  j = 0;
  for (let i = 0; i <= m; i++) {
    // Move j forward until we find a valid position or reach end
    while (j <= m && prefix[i] >= suffix[j]) {
      j++;
    }

    // If we found a valid j, update answer
    if (j <= m) {
      ans = Math.min(ans, j - i);
    }
  }

  return ans;
}
```

```java
// Time: O(n + m) where n = s.length(), m = t.length()
// Space: O(m) for the prefix and suffix arrays
class Solution {
    public int minimumScore(String s, String t) {
        int n = s.length(), m = t.length();

        // Step 1: Precompute prefix array
        // prefix[i] = minimum index in s where t[0..i-1] is a subsequence
        int[] prefix = new int[m + 1];
        for (int i = 0; i <= m; i++) {
            prefix[i] = Integer.MAX_VALUE;
        }
        prefix[0] = -1;  // Empty prefix matches before start of s

        int i = 0, j = 0;  // i in s, j in t
        while (i < n && j < m) {
            if (s.charAt(i) == t.charAt(j)) {
                prefix[j + 1] = i;
                j++;
            }
            i++;
        }

        // Fill remaining positions with MAX_VALUE (not possible)
        for (int k = j + 1; k <= m; k++) {
            prefix[k] = Integer.MAX_VALUE;
        }

        // Step 2: Precompute suffix array
        // suffix[i] = maximum index in s where t[i..m-1] is a subsequence
        int[] suffix = new int[m + 1];
        for (int k = 0; k <= m; k++) {
            suffix[k] = Integer.MIN_VALUE;
        }
        suffix[m] = n;  // Empty suffix matches after end of s

        i = n - 1;
        j = m - 1;  // i in s, j in t
        while (i >= 0 && j >= 0) {
            if (s.charAt(i) == t.charAt(j)) {
                suffix[j] = i;
                j--;
            }
            i--;
        }

        // Fill remaining positions with MIN_VALUE (not possible)
        for (int k = j; k >= 0; k--) {
            suffix[k] = Integer.MIN_VALUE;
        }

        // Step 3: Find minimum score using two pointers
        // We want to find i <= j such that prefix[i] <= suffix[j]
        // Then we can remove t[i..j-1] with score j - i
        int ans = m;  // Worst case: remove all characters

        j = 0;
        for (i = 0; i <= m; i++) {
            // Move j forward until we find a valid position or reach end
            while (j <= m && prefix[i] >= suffix[j]) {
                j++;
            }

            // If we found a valid j, update answer
            if (j <= m) {
                ans = Math.min(ans, j - i);
            }
        }

        return ans;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m)

- Building the prefix array: O(n + m) - we traverse `s` once while matching `t`
- Building the suffix array: O(n + m) - we traverse `s` once while matching `t` in reverse
- Finding minimum score: O(m) - two pointers over arrays of size m+1
- Total: O(n + m)

**Space Complexity:** O(m)

- We store two arrays of size m+1: `prefix` and `suffix`
- No other significant space usage

## Common Mistakes

1. **Not handling the case where no removal is needed**: The algorithm correctly handles this because when `t` is already a subsequence of `s`, we'll have `prefix[m] <= n-1` and `suffix[0] >= 0`, giving us `j - i = 0` as a possible answer.

2. **Off-by-one errors in array indices**: The prefix array has size m+1 where `prefix[i]` corresponds to `t[0..i-1]`. Similarly, suffix array has `suffix[i]` correspond to `t[i..m-1]`. Getting these indices wrong is easy.

3. **Incorrect initialization of prefix/suffix arrays**: The empty prefix should be `-1` (before start of `s`) and empty suffix should be `n` (after end of `s`). Using `0` and `n-1` would be wrong.

4. **Forgetting to fill unused positions**: After the matching loops, we need to fill the remaining positions with infinity/-infinity to indicate those prefixes/suffixes are not possible.

## When You'll See This Pattern

This "prefix-suffix precomputation + two pointers" pattern appears in several string problems:

1. **Longest Common Subsequence variants**: While not identical, the idea of matching prefixes and suffixes efficiently is similar.
2. **Minimum Window Subsequence**: Finding the shortest substring of `s` that contains `t` as a subsequence uses similar matching techniques.
3. **Is Subsequence with deletions**: Problems where you need to check if you can make one string a subsequence of another by deleting characters often use similar preprocessing.

The core idea is to precompute matching information from both ends, then use that information to find optimal cut points efficiently.

## Key Takeaways

1. **When dealing with subsequence matching problems**, consider precomputing matching positions from both directions. This often turns an O(n²) or O(n³) problem into O(n).

2. **The two-pointer technique is powerful** for finding minimum/maximum intervals that satisfy some condition, especially when you have monotonic properties (if `prefix[i] <= suffix[j]` holds for some `j`, it will hold for all larger `j`).

3. **Think about what you're removing, not what you're keeping**: Instead of trying all possible subsequences to keep, think about the contiguous segment to remove. This perspective shift is often the key insight.

Related problems: [Longest Common Subsequence](/problem/longest-common-subsequence)
