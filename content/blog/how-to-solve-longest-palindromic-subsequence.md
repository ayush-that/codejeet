---
title: "How to Solve Longest Palindromic Subsequence — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Palindromic Subsequence. Medium difficulty, 65.1% acceptance rate. Topics: String, Dynamic Programming."
date: "2027-01-06"
category: "dsa-patterns"
tags: ["longest-palindromic-subsequence", "string", "dynamic-programming", "medium"]
---

# How to Solve Longest Palindromic Subsequence

Finding the longest palindromic subsequence (LPS) is a classic dynamic programming problem that tests your ability to recognize patterns in strings and apply memoization techniques. What makes this problem interesting is that it looks similar to finding the longest palindromic substring, but subsequences allow characters to be non-contiguous, which requires a different approach. The key insight is that this problem can be reduced to finding the longest common subsequence between the string and its reverse.

## Visual Walkthrough

Let's trace through the example `s = "bbbab"` to build intuition:

1. **Understanding subsequences**: A subsequence doesn't need to be contiguous. For `"bbbab"`, some subsequences are `"bb"`, `"bbb"`, `"bab"`, `"bbbb"`, etc.

2. **Finding palindromic subsequences**:
   - `"bbb"` is a palindrome (reads same forward/backward)
   - `"bab"` is a palindrome
   - `"bbbb"` is a palindrome (using positions 0,1,2,3)

3. **Key observation**: The longest palindromic subsequence here is `"bbbb"` with length 4.

4. **Dynamic programming approach**: We can build a 2D table where `dp[i][j]` represents the length of the longest palindromic subsequence in the substring `s[i:j+1]`:
   - Base case: Single characters are palindromes of length 1
   - If `s[i] == s[j]`, we can extend the palindrome: `dp[i][j] = dp[i+1][j-1] + 2`
   - If `s[i] != s[j]`, we take the maximum of excluding either end: `dp[i][j] = max(dp[i+1][j], dp[i][j-1])`

For `"bbbab"`, the DP table fills from the diagonal outward:

- `dp[0][4]` = max(`dp[1][4]`, `dp[0][3]`) = max(3, 3) = 3? Wait, let's trace carefully...

Actually, the correct answer is 4. Let me trace the actual computation:

- `dp[0][0]` through `dp[4][4]` = 1 (single characters)
- `dp[0][1]`: `s[0]=b`, `s[1]=b` → `dp[0][1] = dp[1][0] + 2 = 0 + 2 = 2`
- Continue filling until `dp[0][4]` gives us 4

## Brute Force Approach

The brute force approach would be to generate all possible subsequences of the string and check if each one is a palindrome. For a string of length `n`, there are `2^n` possible subsequences (each character can either be included or excluded). Checking if a subsequence is a palindrome takes `O(k)` time where `k` is the length of the subsequence.

This approach has exponential time complexity `O(n * 2^n)`, which is completely impractical for any reasonable input size (even `n=30` would require checking over 1 billion subsequences).

<div class="code-group">

```python
# Brute Force - DO NOT USE IN INTERVIEWS (exponential time)
def longest_palindromic_subsequence_brute(s):
    n = len(s)
    max_len = 0

    # Generate all subsequences using bitmask
    for mask in range(1 << n):  # 2^n possibilities
        subsequence = []
        for i in range(n):
            if mask & (1 << i):  # Check if i-th bit is set
                subsequence.append(s[i])

        # Check if subsequence is palindrome
        if subsequence == subsequence[::-1]:
            max_len = max(max_len, len(subsequence))

    return max_len
```

```javascript
// Brute Force - DO NOT USE IN INTERVIEWS (exponential time)
function longestPalindromicSubsequenceBrute(s) {
  const n = s.length;
  let maxLen = 0;

  // Generate all subsequences using bitmask
  for (let mask = 0; mask < 1 << n; mask++) {
    const subsequence = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        // Check if i-th bit is set
        subsequence.push(s[i]);
      }
    }

    // Check if subsequence is palindrome
    const reversed = [...subsequence].reverse();
    if (subsequence.join("") === reversed.join("")) {
      maxLen = Math.max(maxLen, subsequence.length);
    }
  }

  return maxLen;
}
```

```java
// Brute Force - DO NOT USE IN INTERVIEWS (exponential time)
public int longestPalindromicSubsequenceBrute(String s) {
    int n = s.length();
    int maxLen = 0;

    // Generate all subsequences using bitmask
    for (int mask = 0; mask < (1 << n); mask++) {
        StringBuilder subsequence = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {  // Check if i-th bit is set
                subsequence.append(s.charAt(i));
            }
        }

        // Check if subsequence is palindrome
        String subStr = subsequence.toString();
        String reversed = new StringBuilder(subStr).reverse().toString();
        if (subStr.equals(reversed)) {
            maxLen = Math.max(maxLen, subStr.length());
        }
    }

    return maxLen;
}
```

</div>

## Optimized Approach

The key insight for the optimized solution is that **the longest palindromic subsequence of a string is equivalent to the longest common subsequence (LCS) between the string and its reverse**. This is because a palindrome reads the same forward and backward, so the longest palindromic subsequence must appear in both the original string and its reverse.

**Step-by-step reasoning:**

1. Let `s` be our original string and `rev_s` be its reverse.
2. Any palindromic subsequence in `s` will appear as a subsequence in both `s` and `rev_s`.
3. The longest such common subsequence gives us the longest palindromic subsequence.
4. We can solve LCS using dynamic programming with `O(n^2)` time and `O(n^2)` space.

**Alternative direct DP approach:**
We can also solve this directly without reversing the string:

- Define `dp[i][j]` as the length of LPS in substring `s[i:j+1]`
- Base cases: `dp[i][i] = 1` (single character is a palindrome)
- Recurrence relation:
  - If `s[i] == s[j]`: `dp[i][j] = dp[i+1][j-1] + 2`
  - If `s[i] != s[j]`: `dp[i][j] = max(dp[i+1][j], dp[i][j-1])`
- Fill the table in increasing order of substring length

## Optimal Solution

Here's the complete solution using dynamic programming. We'll implement the direct DP approach which is more intuitive for this specific problem.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
def longest_palindromic_subsequence(s):
    n = len(s)
    if n == 0:
        return 0

    # Create a 2D DP table where dp[i][j] represents the length of LPS
    # in substring s[i:j+1]
    dp = [[0] * n for _ in range(n)]

    # Base case: single characters are palindromes of length 1
    for i in range(n):
        dp[i][i] = 1

    # Fill the DP table in increasing order of substring length
    # We start with length 2 substrings and go up to length n
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1  # End index of current substring

            if s[i] == s[j]:
                # If ends match, we can extend the palindrome
                # For length 2 substrings, there's no middle part, so base length is 2
                if length == 2:
                    dp[i][j] = 2
                else:
                    dp[i][j] = dp[i + 1][j - 1] + 2
            else:
                # If ends don't match, take the best of excluding either end
                dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])

    # The answer is in dp[0][n-1] (LPS for the entire string)
    return dp[0][n - 1]
```

```javascript
// Time: O(n^2) | Space: O(n^2)
function longestPalindromeSubseq(s) {
  const n = s.length;
  if (n === 0) return 0;

  // Create a 2D DP table where dp[i][j] represents the length of LPS
  // in substring s[i:j+1]
  const dp = Array(n)
    .fill()
    .map(() => Array(n).fill(0));

  // Base case: single characters are palindromes of length 1
  for (let i = 0; i < n; i++) {
    dp[i][i] = 1;
  }

  // Fill the DP table in increasing order of substring length
  // We start with length 2 substrings and go up to length n
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1; // End index of current substring

      if (s[i] === s[j]) {
        // If ends match, we can extend the palindrome
        // For length 2 substrings, there's no middle part, so base length is 2
        if (length === 2) {
          dp[i][j] = 2;
        } else {
          dp[i][j] = dp[i + 1][j - 1] + 2;
        }
      } else {
        // If ends don't match, take the best of excluding either end
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  // The answer is in dp[0][n-1] (LPS for the entire string)
  return dp[0][n - 1];
}
```

```java
// Time: O(n^2) | Space: O(n^2)
public int longestPalindromeSubseq(String s) {
    int n = s.length();
    if (n == 0) return 0;

    // Create a 2D DP table where dp[i][j] represents the length of LPS
    // in substring s[i:j+1]
    int[][] dp = new int[n][n];

    // Base case: single characters are palindromes of length 1
    for (int i = 0; i < n; i++) {
        dp[i][i] = 1;
    }

    // Fill the DP table in increasing order of substring length
    // We start with length 2 substrings and go up to length n
    for (int length = 2; length <= n; length++) {
        for (int i = 0; i <= n - length; i++) {
            int j = i + length - 1;  // End index of current substring

            if (s.charAt(i) == s.charAt(j)) {
                // If ends match, we can extend the palindrome
                // For length 2 substrings, there's no middle part, so base length is 2
                if (length == 2) {
                    dp[i][j] = 2;
                } else {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                }
            } else {
                // If ends don't match, take the best of excluding either end
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }

    // The answer is in dp[0][n-1] (LPS for the entire string)
    return dp[0][n - 1];
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n^2)` where `n` is the length of the input string. We need to fill an `n x n` DP table, and each cell takes `O(1)` time to compute.

**Space Complexity:** `O(n^2)` for the DP table. We can optimize this to `O(n)` by noticing that we only need the previous row and current row to compute the next row, but the `O(n^2)` solution is usually acceptable in interviews and is easier to explain.

## Common Mistakes

1. **Confusing subsequence with substring**: This is the most common mistake. Remember that subsequences don't need to be contiguous, while substrings do. The solution for longest palindromic substring (which uses expanding centers) won't work here.

2. **Incorrect base case handling for length 2**: When `s[i] == s[j]` and `length == 2`, we should return 2, not `dp[i+1][j-1] + 2` (which would be `dp[j][i] + 2`, accessing invalid indices since `i+1 > j-1`).

3. **Wrong iteration order**: The DP table must be filled in increasing order of substring length, not simply row by row or column by column. Filling `dp[i][j]` requires `dp[i+1][j-1]`, `dp[i+1][j]`, and `dp[i][j-1]`, which are all for shorter substrings.

4. **Forgetting empty string case**: Always check for edge cases like empty strings. An empty string has LPS length 0.

## When You'll See This Pattern

This problem uses a classic dynamic programming pattern for sequence alignment problems. You'll see similar patterns in:

1. **Longest Common Subsequence (LeetCode 1143)**: The direct precursor to this problem. The LPS problem can be reduced to LCS between a string and its reverse.

2. **Edit Distance (LeetCode 72)**: Uses a similar 2D DP table to find minimum operations to transform one string to another.

3. **Maximum Length of Repeated Subarray (LeetCode 718)**: Another sequence alignment problem with a 2D DP approach.

4. **Palindromic Substrings (LeetCode 647)**: While solved differently (expanding centers), it's conceptually related and often appears alongside LPS in interviews.

## Key Takeaways

1. **Reduction to known problems**: Many string DP problems can be reduced to or are variations of the Longest Common Subsequence problem. Recognizing this pattern is crucial.

2. **DP state definition matters**: Defining `dp[i][j]` as "LPS in substring s[i:j+1]" creates a clean recurrence relation. The indices `i` and `j` should represent the boundaries of the substring being considered.

3. **Fill order is critical**: In 2D DP problems, you must fill the table in an order that ensures all required subproblems are already solved. For LPS, filling by increasing substring length works perfectly.

Related problems: [Longest Palindromic Substring](/problem/longest-palindromic-substring), [Palindromic Substrings](/problem/palindromic-substrings), [Count Different Palindromic Subsequences](/problem/count-different-palindromic-subsequences)
