---
title: "How to Solve Maximize Palindrome Length From Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize Palindrome Length From Subsequences. Hard difficulty, 38.2% acceptance rate. Topics: String, Dynamic Programming."
date: "2026-02-10"
category: "dsa-patterns"
tags: ["maximize-palindrome-length-from-subsequences", "string", "dynamic-programming", "hard"]
---

# How to Solve Maximize Palindrome Length From Subsequences

This problem asks us to find the longest palindrome we can create by taking a non-empty subsequence from each of two given strings and concatenating them. The challenge is that we need to find palindromes that span across both strings—the palindrome's first half can come from `word1` and the second half from `word2`, or vice versa. This makes it more complex than finding a palindrome within a single string.

**What makes this tricky:** We can't simply find the longest palindrome in each string and combine them, because the palindrome must be formed by characters that appear in the same relative order across both strings. The palindrome's center might be entirely within one string or might bridge across both strings.

## Visual Walkthrough

Let's walk through an example: `word1 = "cacb"`, `word2 = "cbba"`

We want to build the longest possible palindrome by taking:

1. A non-empty subsequence from `word1`
2. A non-empty subsequence from `word2`
3. Concatenating them

Let's think about possible palindromes:

- If we take `"c"` from `word1` and `"c"` from `word2`, we get `"cc"` (length 2)
- If we take `"a"` from `word1` and `"a"` from `word2`, we get `"aa"` (length 2)
- If we take `"cac"` from `word1` and `"c"` from `word2`, we get `"cacc"` (not a palindrome)
- If we take `"c"` from `word1` and `"bcb"` from `word2`, we get `"cbcb"` (not a palindrome)

The key insight: The longest palindrome here is `"abcba"` (length 5). How do we form it?

- Take `"ab"` from `word1` (indices 1 and 3: `"a"` and `"b"`)
- Take `"cba"` from `word2` (indices 0, 1, and 3: `"c"`, `"b"`, `"a"`)
- Concatenate: `"ab" + "cba" = "abcba"`

Notice this is a palindrome: first char `'a'` matches last char `'a'`, second char `'b'` matches second-last char `'b'`, and middle char `'c'` is the center.

The palindrome structure: `a b c b a`

- First `'a'` comes from `word1`
- First `'b'` comes from `word1`
- `'c'` comes from `word2`
- Second `'b'` comes from `word2`
- Second `'a'` comes from `word2`

This shows the palindrome can have characters from both strings interleaved in the palindrome structure.

## Brute Force Approach

A brute force approach would:

1. Generate all non-empty subsequences of `word1`
2. Generate all non-empty subsequences of `word2`
3. For each pair of subsequences, concatenate them and check if the result is a palindrome
4. Track the maximum palindrome length found

The problem with this approach is the exponential time complexity. If `word1` has length `n` and `word2` has length `m`, there are `2^n - 1` subsequences of `word1` and `2^m - 1` subsequences of `word2`. Checking all pairs would take `O((2^n + 2^m) × (n+m))` time, which is completely impractical for the constraints (strings up to length 1000).

Even for moderate string lengths, this approach is infeasible. We need a smarter approach that doesn't explicitly generate all subsequences.

## Optimized Approach

The key insight is that this problem is closely related to the **Longest Palindromic Subsequence (LPS)** problem. In LPS, we find the longest palindrome that can be formed from a single string by deleting characters (taking a subsequence).

For our problem, we can think of concatenating `word1` and `word2` into a single string `s = word1 + word2`, then finding palindromic subsequences where:

1. The first character comes from `word1`
2. The last character comes from `word2`
3. All characters maintain their relative order from the original strings

However, we can't just find the LPS of `s` because that might use characters only from one string or might not satisfy the "first from word1, last from word2" constraint.

**Better approach:** Use dynamic programming similar to LPS, but with additional constraints:

- Let `dp[i][j]` = length of longest palindromic subsequence between `word1[i:]` and `word2[:j]`
- But we need to track whether we've taken at least one character from each string

**Optimal strategy:** Consider all possible "split points" where the palindrome transitions from `word1` to `word2`:

1. The entire palindrome comes from `word1` (not allowed since we need non-empty from both)
2. The entire palindrome comes from `word2` (not allowed since we need non-empty from both)
3. The palindrome starts in `word1` and ends in `word2` (this is what we want)
4. The palindrome could also have a center that's entirely within one string

The cleanest approach: Create a combined string `s = word1 + word2` of length `n + m`, then use standard LPS DP to find the longest palindrome where:

- The first character's index < `n` (comes from `word1`)
- The last character's index ≥ `n` (comes from `word2`)

We'll use a 2D DP array where `dp[i][j]` represents the length of the longest palindromic subsequence in the substring `s[i:j+1]`.

## Optimal Solution

The solution uses dynamic programming similar to finding the longest palindromic subsequence, but with constraints to ensure we use characters from both strings.

<div class="code-group">

```python
# Time: O((n+m)^2) | Space: O((n+m)^2)
def longestPalindrome(word1: str, word2: str) -> int:
    # Combine the two strings
    s = word1 + word2
    n, m = len(word1), len(word2)
    total_len = n + m

    # dp[i][j] = length of longest palindromic subsequence in s[i:j+1]
    dp = [[0] * total_len for _ in range(total_len)]

    # Base case: single characters are palindromes of length 1
    for i in range(total_len):
        dp[i][i] = 1

    # Fill the DP table
    # We iterate over substring lengths from 2 to total_len
    for length in range(2, total_len + 1):
        for i in range(total_len - length + 1):
            j = i + length - 1

            if s[i] == s[j]:
                # If characters match, they can form a palindrome
                # Add 2 to the palindrome formed by the inner substring
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                # If characters don't match, take the maximum of
                # excluding s[i] or excluding s[j]
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])

    # Now find the maximum palindrome length where:
    # - First character is from word1 (index < n)
    # - Last character is from word2 (index >= n)
    max_len = 0
    for i in range(n):
        for j in range(n, total_len):
            if s[i] == s[j]:
                # The palindrome starts at i (in word1) and ends at j (in word2)
                # The length is dp[i][j], which includes both endpoints
                max_len = max(max_len, dp[i][j])

    return max_len
```

```javascript
// Time: O((n+m)^2) | Space: O((n+m)^2)
function longestPalindrome(word1, word2) {
  // Combine the two strings
  const s = word1 + word2;
  const n = word1.length,
    m = word2.length;
  const totalLen = n + m;

  // dp[i][j] = length of longest palindromic subsequence in s[i:j+1]
  const dp = Array(totalLen)
    .fill()
    .map(() => Array(totalLen).fill(0));

  // Base case: single characters are palindromes of length 1
  for (let i = 0; i < totalLen; i++) {
    dp[i][i] = 1;
  }

  // Fill the DP table
  // We iterate over substring lengths from 2 to totalLen
  for (let length = 2; length <= totalLen; length++) {
    for (let i = 0; i <= totalLen - length; i++) {
      const j = i + length - 1;

      if (s[i] === s[j]) {
        // If characters match, they can form a palindrome
        // Add 2 to the palindrome formed by the inner substring
        dp[i][j] = dp[i + 1][j - 1] + 2;
      } else {
        // If characters don't match, take the maximum of
        // excluding s[i] or excluding s[j]
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  // Now find the maximum palindrome length where:
  // - First character is from word1 (index < n)
  // - Last character is from word2 (index >= n)
  let maxLen = 0;
  for (let i = 0; i < n; i++) {
    for (let j = n; j < totalLen; j++) {
      if (s[i] === s[j]) {
        // The palindrome starts at i (in word1) and ends at j (in word2)
        // The length is dp[i][j], which includes both endpoints
        maxLen = Math.max(maxLen, dp[i][j]);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O((n+m)^2) | Space: O((n+m)^2)
class Solution {
    public int longestPalindrome(String word1, String word2) {
        // Combine the two strings
        String s = word1 + word2;
        int n = word1.length(), m = word2.length();
        int totalLen = n + m;

        // dp[i][j] = length of longest palindromic subsequence in s[i:j+1]
        int[][] dp = new int[totalLen][totalLen];

        // Base case: single characters are palindromes of length 1
        for (int i = 0; i < totalLen; i++) {
            dp[i][i] = 1;
        }

        // Fill the DP table
        // We iterate over substring lengths from 2 to totalLen
        for (int length = 2; length <= totalLen; length++) {
            for (int i = 0; i <= totalLen - length; i++) {
                int j = i + length - 1;

                if (s.charAt(i) == s.charAt(j)) {
                    // If characters match, they can form a palindrome
                    // Add 2 to the palindrome formed by the inner substring
                    dp[i][j] = dp[i+1][j-1] + 2;
                } else {
                    // If characters don't match, take the maximum of
                    // excluding s[i] or excluding s[j]
                    dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1]);
                }
            }
        }

        // Now find the maximum palindrome length where:
        // - First character is from word1 (index < n)
        // - Last character is from word2 (index >= n)
        int maxLen = 0;
        for (int i = 0; i < n; i++) {
            for (int j = n; j < totalLen; j++) {
                if (s.charAt(i) == s.charAt(j)) {
                    // The palindrome starts at i (in word1) and ends at j (in word2)
                    // The length is dp[i][j], which includes both endpoints
                    maxLen = Math.max(maxLen, dp[i][j]);
                }
            }
        }

        return maxLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O((n+m)²)` where `n` is the length of `word1` and `m` is the length of `word2`. This comes from:

- Building the DP table for the combined string of length `n+m`
- The DP table has `(n+m)²` cells, and each cell takes `O(1)` time to compute
- The final search for valid palindromes takes `O(n×m)` time, which is dominated by `O((n+m)²)`

**Space Complexity:** `O((n+m)²)` for the DP table. We could optimize to `O(n+m)` by only keeping two rows of the DP table at a time, but the code is clearer with the full table and the constraints allow for this space usage.

## Common Mistakes

1. **Forgetting to ensure non-empty subsequences from both strings:** The problem requires taking a non-empty subsequence from EACH string. Some solutions might return palindromes formed entirely from one string.

2. **Incorrect DP initialization:** Forgetting to initialize the diagonal (single character palindromes) to 1 is a common oversight that leads to incorrect results.

3. **Wrong indices in the final search:** When searching for palindromes that start in `word1` and end in `word2`, it's crucial to ensure `i < n` (from `word1`) and `j ≥ n` (from `word2`). Mixing up these bounds is a common off-by-one error.

4. **Not checking character equality in final search:** In the final loop, we need `s[i] == s[j]` because the palindrome must start and end with the same character. Without this check, we might count invalid palindromes.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Longest Palindromic Subsequence (LPS):** The core DP approach is identical to LeetCode 516 (Longest Palindromic Subsequence). If you understand LPS, this problem becomes much easier.

2. **String concatenation with constraints:** Similar problems include:
   - **"Shortest Common Supersequence"** (LeetCode 1092): Also uses DP on two strings
   - **"Interleaving String"** (LeetCode 97): Checks if a string can be formed by interleaving two other strings
   - **"Edit Distance"** (LeetCode 72): Another classic DP problem on two strings

The pattern of creating a combined string and applying standard algorithms with additional constraints appears in several string manipulation problems.

## Key Takeaways

1. **Reduction to known problems:** This problem seems complex but reduces to Longest Palindromic Subsequence with additional constraints. Always look for ways to transform new problems into problems you already know how to solve.

2. **DP for palindrome problems:** When you see "longest palindrome" and "subsequence" together, dynamic programming is almost always the solution. The standard LPS DP has time complexity `O(n²)` and space complexity `O(n²)`.

3. **Constraint handling:** The main challenge here isn't the DP itself, but correctly applying the constraints (non-empty from both strings, first from word1, last from word2). Always carefully translate problem constraints into code conditions.

Related problems: [Longest Palindromic Subsequence](/problem/longest-palindromic-subsequence)
