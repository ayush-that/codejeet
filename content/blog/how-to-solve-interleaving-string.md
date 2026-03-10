---
title: "How to Solve Interleaving String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Interleaving String. Medium difficulty, 43.5% acceptance rate. Topics: String, Dynamic Programming."
date: "2026-12-29"
category: "dsa-patterns"
tags: ["interleaving-string", "string", "dynamic-programming", "medium"]
---

# How to Solve Interleaving String

The Interleaving String problem asks whether a third string `s3` can be formed by interleaving characters from `s1` and `s2` while preserving the original order of characters from each string. What makes this problem tricky is that it's not simply about checking if `s3` contains all characters from both strings—the order must be maintained, and we need to consider all possible ways to mix the two strings together.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `s1 = "aabcc"`, `s2 = "dbbca"`, `s3 = "aadbbcbcac"`

We need to check if we can form `s3` by taking characters from `s1` and `s2` in order. Let's walk through one possible valid interleaving:

1. Take 'a' from `s1` → `s3[0] = 'a'` ✓ (s1 index: 1, s2 index: 0)
2. Take 'a' from `s1` → `s3[1] = 'a'` ✓ (s1 index: 2, s2 index: 0)
3. Take 'd' from `s2` → `s3[2] = 'd'` ✓ (s1 index: 2, s2 index: 1)
4. Take 'b' from `s2` → `s3[3] = 'b'` ✓ (s1 index: 2, s2 index: 2)
5. Take 'b' from `s1` → `s3[4] = 'b'` ✓ (s1 index: 3, s2 index: 2)
6. Take 'c' from `s1` → `s3[5] = 'c'` ✓ (s1 index: 4, s2 index: 2)
7. Take 'b' from `s2` → `s3[6] = 'b'` ✓ (s1 index: 4, s2 index: 3)
8. Take 'c' from `s2` → `s3[7] = 'c'` ✓ (s1 index: 4, s2 index: 4)
9. Take 'a' from `s1` → `s3[8] = 'a'` ✓ (s1 index: 5, s2 index: 4)
10. Take 'c' from `s2` → `s3[9] = 'c'` ✓ (s1 index: 5, s2 index: 5)

This is a valid interleaving! Notice that at each step, we could choose to take the next character from either `s1` or `s2`, as long as it matches the current character in `s3`. The challenge is that there are many possible paths to explore.

## Brute Force Approach

The brute force approach uses recursion to explore all possible interleavings. At each step, if the current character of `s3` matches the next character from `s1`, we try taking from `s1`. If it matches the next character from `s2`, we try taking from `s2`. We continue recursively until we either successfully build the entire `s3` or exhaust all possibilities.

The problem with this approach is its exponential time complexity. For each character in `s3`, we might have two choices (take from `s1` or `s2`), leading to O(2^(m+n)) time complexity where m and n are the lengths of `s1` and `s2`. This becomes infeasible even for moderately sized strings.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems**—the hallmarks of dynamic programming.

Consider what information we need to track: at any point, we need to know how many characters we've consumed from `s1` and how many from `s2`. Let `dp[i][j]` represent whether the first `i` characters of `s1` and the first `j` characters of `s2` can interleave to form the first `i+j` characters of `s3`.

The recurrence relation becomes:

- `dp[i][j] = true` if either:
  1. `dp[i-1][j]` is true AND `s1[i-1] == s3[i+j-1]` (we take from s1)
  2. `dp[i][j-1]` is true AND `s2[j-1] == s3[i+j-1]` (we take from s2)

We need to be careful with base cases:

- `dp[0][0] = true` (empty strings can form empty string)
- First row (`dp[0][j]`): can only take from s2
- First column (`dp[i][0]`): can only take from s1

This approach reduces the problem to filling an (m+1) × (n+1) DP table, giving us polynomial time complexity.

## Optimal Solution

Here's the complete dynamic programming solution with detailed comments:

<div class="code-group">

```python
# Time: O(m*n) where m = len(s1), n = len(s2)
# Space: O(m*n) for the DP table
def isInterleave(s1: str, s2: str, s3: str) -> bool:
    m, n = len(s1), len(s2)

    # Quick check: total length must match
    if m + n != len(s3):
        return False

    # dp[i][j] = True if first i chars of s1 and first j chars of s2
    # can interleave to form first i+j chars of s3
    dp = [[False] * (n + 1) for _ in range(m + 1)]

    # Base case: empty strings can form empty string
    dp[0][0] = True

    # Fill first column: using only s1 to form s3 prefix
    for i in range(1, m + 1):
        # Current char must match AND previous prefix must be valid
        dp[i][0] = dp[i-1][0] and s1[i-1] == s3[i-1]

    # Fill first row: using only s2 to form s3 prefix
    for j in range(1, n + 1):
        dp[0][j] = dp[0][j-1] and s2[j-1] == s3[j-1]

    # Fill the rest of the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # Index in s3 for current position
            k = i + j - 1

            # Option 1: Take current char from s1
            take_from_s1 = dp[i-1][j] and s1[i-1] == s3[k]

            # Option 2: Take current char from s2
            take_from_s2 = dp[i][j-1] and s2[j-1] == s3[k]

            # Current cell is true if either option works
            dp[i][j] = take_from_s1 or take_from_s2

    return dp[m][n]
```

```javascript
// Time: O(m*n) where m = s1.length, n = s2.length
// Space: O(m*n) for the DP table
function isInterleave(s1, s2, s3) {
  const m = s1.length,
    n = s2.length;

  // Quick length check
  if (m + n !== s3.length) {
    return false;
  }

  // Create DP table with (m+1) x (n+1) dimensions
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(false));

  // Base case: empty strings
  dp[0][0] = true;

  // Fill first column (using only s1)
  for (let i = 1; i <= m; i++) {
    dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
  }

  // Fill first row (using only s2)
  for (let j = 1; j <= n; j++) {
    dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
  }

  // Fill the rest of the table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const k = i + j - 1; // Current index in s3

      // Check if we can take from s1
      const takeFromS1 = dp[i - 1][j] && s1[i - 1] === s3[k];

      // Check if we can take from s2
      const takeFromS2 = dp[i][j - 1] && s2[j - 1] === s3[k];

      // Current state is valid if either path works
      dp[i][j] = takeFromS1 || takeFromS2;
    }
  }

  return dp[m][n];
}
```

```java
// Time: O(m*n) where m = s1.length(), n = s2.length()
// Space: O(m*n) for the DP table
public boolean isInterleave(String s1, String s2, String s3) {
    int m = s1.length(), n = s2.length();

    // Quick length validation
    if (m + n != s3.length()) {
        return false;
    }

    // dp[i][j] = true if first i chars of s1 and first j chars of s2
    // can form first i+j chars of s3
    boolean[][] dp = new boolean[m + 1][n + 1];

    // Base case: empty strings
    dp[0][0] = true;

    // Fill first column: using only s1
    for (int i = 1; i <= m; i++) {
        dp[i][0] = dp[i-1][0] && s1.charAt(i-1) == s3.charAt(i-1);
    }

    // Fill first row: using only s2
    for (int j = 1; j <= n; j++) {
        dp[0][j] = dp[0][j-1] && s2.charAt(j-1) == s3.charAt(j-1);
    }

    // Fill the DP table
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            int k = i + j - 1;  // Current index in s3

            // Option 1: take current char from s1
            boolean takeFromS1 = dp[i-1][j] && s1.charAt(i-1) == s3.charAt(k);

            // Option 2: take current char from s2
            boolean takeFromS2 = dp[i][j-1] && s2.charAt(j-1) == s3.charAt(k);

            // Current cell is true if either option works
            dp[i][j] = takeFromS1 || takeFromS2;
        }
    }

    return dp[m][n];
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n) where m is the length of `s1` and n is the length of `s2`. We need to fill every cell in the (m+1) × (n+1) DP table, and each cell requires constant time operations (just checking two conditions).

**Space Complexity:** O(m × n) for the DP table. We can optimize this to O(min(m, n)) by using only two rows at a time (since we only need the previous row to compute the current row), but the standard solution above is clearer for interview purposes.

## Common Mistakes

1. **Forgetting the length check:** Always check if `len(s1) + len(s2) == len(s3)` at the beginning. If lengths don't match, it's impossible to form `s3`.

2. **Off-by-one errors in indices:** The DP table has dimensions `(m+1) × (n+1)`, not `m × n`. Remember that `dp[i][j]` corresponds to the first `i` characters of `s1` and first `j` characters of `s2`, so we access `s1[i-1]` and `s2[j-1]` when checking character equality.

3. **Incorrect base case initialization:** The first row and first column need special handling because they represent cases where we use only one string. Forgetting to initialize these properly will cause the entire DP table to be incorrect.

4. **Using greedy approach:** Some candidates try to greedily match characters from whichever string has a matching character first. This fails on cases like `s1 = "aab"`, `s2 = "aac"`, `s3 = "aaabac"` where you need to sometimes take from the "wrong" string to make the overall interleaving work.

## When You'll See This Pattern

The interleaving string problem is a classic **2D dynamic programming** problem with applications in:

- **String matching and comparison** problems
- **Sequence alignment** in bioinformatics
- **Text justification** and word wrapping algorithms

Related LeetCode problems:

1. **Edit Distance (LeetCode 72)** - Similar 2D DP structure for transforming one string to another
2. **Distinct Subsequences (LeetCode 115)** - Counting ways to form one string from another using DP
3. **Regular Expression Matching (LeetCode 10)** - More complex but uses similar DP techniques for string matching

## Key Takeaways

1. **Recognize overlapping subproblems:** When you need to explore all possible combinations/orderings and the problem can be broken down into smaller versions of itself, dynamic programming is often the right approach.

2. **2D DP for two sequences:** When you have two sequences/strings and need to consider all ways to combine or compare them, a 2D DP table where `dp[i][j]` represents some property of the first `i` elements of one sequence and first `j` elements of the other is a powerful pattern.

3. **Start with brute force recursion:** Even if you immediately know the DP solution, explaining the recursive brute force first shows your thought process and makes it clear why we need memoization/DP.

[Practice this problem on CodeJeet](/problem/interleaving-string)
