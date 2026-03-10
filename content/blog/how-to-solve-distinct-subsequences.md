---
title: "How to Solve Distinct Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Distinct Subsequences. Hard difficulty, 51.5% acceptance rate. Topics: String, Dynamic Programming."
date: "2027-02-04"
category: "dsa-patterns"
tags: ["distinct-subsequences", "string", "dynamic-programming", "hard"]
---

# How to Solve Distinct Subsequences

This problem asks: given two strings `s` and `t`, count how many distinct subsequences of `s` equal `t`. A subsequence is formed by deleting some characters (possibly zero) without changing the order of the remaining characters. What makes this problem tricky is that we're not just checking if `t` appears as a subsequence—we need to count **all possible ways** to match `t` within `s`. This requires careful counting to avoid double-counting or missing valid matches.

## Visual Walkthrough

Let's trace through a small example: `s = "rabbbit"`, `t = "rabbit"`.

We want to count how many ways we can form `"rabbit"` from `s` by deleting characters. Let's manually find matches:

1. Use characters at indices 0,1,2,3,4,5: `r a b b b i t` → `r a b b i t` ✓
2. Use indices 0,1,2,3,4,6: `r a b b b i t` → `r a b b i t` ✓
3. Use indices 0,1,2,3,5,6: `r a b b b i t` → `r a b b i t` ✓

These are the only three ways. Notice the challenge: we have three `b`s in `s` but only need two `b`s in `t`. We need to count all combinations of choosing which two of the three `b`s to use.

The key insight: when characters match, we have two choices:

1. Use the current match (consume characters from both strings)
2. Skip this match (look for other occurrences later in `s`)

This overlapping decision structure suggests dynamic programming.

## Brute Force Approach

A naive solution would try all possible subsequences of `s` and count those equal to `t`. We could use recursion: at each position, decide whether to include the current character of `s` in our subsequence if it matches the current character of `t`.

The brute force recursion would look like:

- If we've matched all characters of `t`, count this as 1 valid subsequence
- If we've exhausted `s` but not `t`, this path fails (count 0)
- At each step, if current characters match, we can either:
  - Use the match (move both pointers forward)
  - Skip it (move only `s` pointer forward)
- If they don't match, we must skip (move only `s` pointer)

This approach has exponential time complexity O(2^n) in the worst case, where n = len(s). With s up to 1000 characters, this is completely infeasible. The problem requires a more efficient approach.

## Optimized Approach

The key insight is that this is a **counting problem with overlapping subproblems**, making it perfect for dynamic programming. We can define:

`dp[i][j]` = number of ways to form `t[0:j]` (first j characters of t) from `s[0:i]` (first i characters of s)

We build this table with the following recurrence relation:

1. **Base case**: `dp[i][0] = 1` for all i
   - Empty string `t` can be formed from any prefix of `s` in exactly 1 way (by deleting all characters)

2. **Recurrence**: For `i > 0` and `j > 0`:
   - If `s[i-1] == t[j-1]`:
     - We have two options:
       1. Use this match: count ways to form `t[0:j-1]` from `s[0:i-1]` = `dp[i-1][j-1]`
       2. Skip this match: count ways to form `t[0:j]` from `s[0:i-1]` = `dp[i-1][j]`
     - Total: `dp[i][j] = dp[i-1][j-1] + dp[i-1][j]`
   - If `s[i-1] != t[j-1]`:
     - We can only skip: `dp[i][j] = dp[i-1][j]`

3. **Answer**: `dp[len(s)][len(t)]`

This approach has O(m×n) time and space complexity, which is efficient enough for the constraints.

## Optimal Solution

Here's the complete DP solution with detailed comments:

<div class="code-group">

```python
# Time: O(m×n) where m = len(s), n = len(t)
# Space: O(m×n) for the DP table
def numDistinct(s: str, t: str) -> int:
    m, n = len(s), len(t)

    # dp[i][j] = number of ways to form t[0:j] from s[0:i]
    # We use (m+1)×(n+1) to handle empty strings
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base case: empty t can be formed from any prefix of s in 1 way
    for i in range(m + 1):
        dp[i][0] = 1

    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i - 1] == t[j - 1]:
                # Characters match: we can either use this match or skip it
                # 1. Use match: count ways without these characters = dp[i-1][j-1]
                # 2. Skip match: count ways without s[i-1] = dp[i-1][j]
                dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j]
            else:
                # Characters don't match: must skip s[i-1]
                dp[i][j] = dp[i - 1][j]

    return dp[m][n]
```

```javascript
// Time: O(m×n) where m = s.length, n = t.length
// Space: O(m×n) for the DP table
function numDistinct(s, t) {
  const m = s.length,
    n = t.length;

  // dp[i][j] = number of ways to form t[0:j] from s[0:i]
  // We use (m+1)×(n+1) to handle empty strings
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Base case: empty t can be formed from any prefix of s in 1 way
  for (let i = 0; i <= m; i++) {
    dp[i][0] = 1;
  }

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === t[j - 1]) {
        // Characters match: we can either use this match or skip it
        // 1. Use match: count ways without these characters = dp[i-1][j-1]
        // 2. Skip match: count ways without s[i-1] = dp[i-1][j]
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      } else {
        // Characters don't match: must skip s[i-1]
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  return dp[m][n];
}
```

```java
// Time: O(m×n) where m = s.length(), n = t.length()
// Space: O(m×n) for the DP table
public int numDistinct(String s, String t) {
    int m = s.length(), n = t.length();

    // dp[i][j] = number of ways to form t[0:j] from s[0:i]
    // We use (m+1)×(n+1) to handle empty strings
    int[][] dp = new int[m + 1][n + 1];

    // Base case: empty t can be formed from any prefix of s in 1 way
    for (int i = 0; i <= m; i++) {
        dp[i][0] = 1;
    }

    // Fill the DP table
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s.charAt(i - 1) == t.charAt(j - 1)) {
                // Characters match: we can either use this match or skip it
                // 1. Use match: count ways without these characters = dp[i-1][j-1]
                // 2. Skip match: count ways without s[i-1] = dp[i-1][j]
                dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
            } else {
                // Characters don't match: must skip s[i-1]
                dp[i][j] = dp[i - 1][j];
            }
        }
    }

    return dp[m][n];
}
```

</div>

## Space Optimization

We can optimize space to O(n) by noticing that we only need the previous row:

<div class="code-group">

```python
# Time: O(m×n) where m = len(s), n = len(t)
# Space: O(n) using only previous row
def numDistinct(s: str, t: str) -> int:
    m, n = len(s), len(t)

    # dp[j] = number of ways to form t[0:j] from current prefix of s
    dp = [0] * (n + 1)
    dp[0] = 1  # Empty t can be formed in 1 way

    for i in range(1, m + 1):
        # Process backwards to avoid overwriting needed values
        prev = dp[0]  # dp[0] is always 1 for any prefix of s
        for j in range(1, n + 1):
            temp = dp[j]  # Store current value before modification
            if s[i - 1] == t[j - 1]:
                # Current dp[j] becomes: previous row's dp[j] + previous row's dp[j-1]
                dp[j] = dp[j] + prev
            # If characters don't match, dp[j] stays the same (from previous row)
            prev = temp  # Update prev for next iteration

    return dp[n]
```

```javascript
// Time: O(m×n) where m = s.length, n = t.length
// Space: O(n) using only previous row
function numDistinct(s, t) {
  const m = s.length,
    n = t.length;

  // dp[j] = number of ways to form t[0:j] from current prefix of s
  const dp = Array(n + 1).fill(0);
  dp[0] = 1; // Empty t can be formed in 1 way

  for (let i = 1; i <= m; i++) {
    // Process backwards to avoid overwriting needed values
    let prev = dp[0]; // dp[0] is always 1 for any prefix of s
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]; // Store current value before modification
      if (s[i - 1] === t[j - 1]) {
        // Current dp[j] becomes: previous row's dp[j] + previous row's dp[j-1]
        dp[j] = dp[j] + prev;
      }
      // If characters don't match, dp[j] stays the same (from previous row)
      prev = temp; // Update prev for next iteration
    }
  }

  return dp[n];
}
```

```java
// Time: O(m×n) where m = s.length(), n = t.length()
// Space: O(n) using only previous row
public int numDistinct(String s, String t) {
    int m = s.length(), n = t.length();

    // dp[j] = number of ways to form t[0:j] from current prefix of s
    int[] dp = new int[n + 1];
    dp[0] = 1;  // Empty t can be formed in 1 way

    for (int i = 1; i <= m; i++) {
        // Process backwards to avoid overwriting needed values
        int prev = dp[0];  // dp[0] is always 1 for any prefix of s
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];  // Store current value before modification
            if (s.charAt(i - 1) == t.charAt(j - 1)) {
                // Current dp[j] becomes: previous row's dp[j] + previous row's dp[j-1]
                dp[j] = dp[j] + prev;
            }
            // If characters don't match, dp[j] stays the same (from previous row)
            prev = temp;  // Update prev for next iteration
        }
    }

    return dp[n];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m×n) where m = len(s) and n = len(t). We fill a table of size (m+1)×(n+1) in the 2D DP approach, or perform m×n operations in the space-optimized version.

**Space Complexity:**

- 2D DP: O(m×n) for the full table
- Optimized: O(n) by only storing the current and previous row (or O(n) with backward iteration)

The O(m×n) time is efficient for the constraints (s and t up to 1000 characters).

## Common Mistakes

1. **Incorrect base case initialization**: Forgetting that empty `t` can be formed from any prefix of `s` in exactly 1 way (by deleting all characters). This means `dp[i][0] = 1` for all i, not 0.

2. **Off-by-one errors in indices**: The DP table has dimensions (m+1)×(n+1) to handle empty strings. When accessing `s[i-1]` and `t[j-1]`, it's easy to mistakenly use `s[i]` and `t[j]`.

3. **Integer overflow**: The problem states the answer fits in a 32-bit signed integer, but intermediate calculations might overflow in some languages. Use appropriate data types (long in Java/C++).

4. **Wrong recurrence when characters match**: When `s[i-1] == t[j-1]`, candidates sometimes only add `dp[i-1][j-1]` and forget to include `dp[i-1][j]` (the "skip" option). Both possibilities must be counted.

## When You'll See This Pattern

This "distinct subsequences" pattern appears in counting problems where you need to find all ways to match one sequence within another while maintaining order. Similar problems include:

1. **Edit Distance (LeetCode 72)**: Also uses a 2D DP table where dp[i][j] represents the minimum operations to convert one string to another. The recurrence involves similar "match or skip" decisions.

2. **Longest Common Subsequence (LeetCode 1143)**: Uses almost identical DP structure where dp[i][j] represents the LCS length of prefixes. The recurrence is similar but uses max instead of sum.

3. **Interleaving String (LeetCode 97)**: Another 2D DP problem checking if a string can be formed by interleaving two others, with similar "use or skip" decisions.

## Key Takeaways

1. **Counting subsequences often requires DP**: When you need to count all ways to match sequences (not just check existence), dynamic programming is usually the right approach.

2. **The recurrence often involves "use or skip" decisions**: When characters match, you typically have the option to use the match or look for other matches later. Both possibilities must be counted.

3. **Space optimization is often possible**: Many 2D string DP problems can be optimized to 1D by noticing you only need the previous row. Process backwards to avoid overwriting values you still need.

Related problems: [Number of Unique Good Subsequences](/problem/number-of-unique-good-subsequences)
