---
title: "How to Solve Minimum ASCII Delete Sum for Two Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum ASCII Delete Sum for Two Strings. Medium difficulty, 70.9% acceptance rate. Topics: String, Dynamic Programming."
date: "2028-03-08"
category: "dsa-patterns"
tags: ["minimum-ascii-delete-sum-for-two-strings", "string", "dynamic-programming", "medium"]
---

# How to Solve Minimum ASCII Delete Sum for Two Strings

You're given two strings `s1` and `s2`. Your task is to find the minimum sum of ASCII values of characters you need to delete from both strings to make them equal. This problem is tricky because it's not just about finding matching characters—you need to consider the ASCII costs of deletions, and the optimal solution might involve keeping some characters that don't initially seem like the best match.

## Visual Walkthrough

Let's trace through a small example: `s1 = "sea"`, `s2 = "eat"`.

We want to make these strings equal by deleting characters with the lowest total ASCII cost. Let's think about our options:

1. **Option 1**: Delete 's' from "sea" (ASCII 115) and 't' from "eat" (ASCII 116). We're left with "ea" and "ea". Total cost = 115 + 116 = 231.

2. **Option 2**: Delete 's' from "sea" (115) and 'e' from "eat" (101). We're left with "ea" and "at". Not equal, so we need to delete more.

3. **Option 3**: Delete 'e' from "sea" (101) and 't' from "eat" (116). We're left with "sa" and "ea". Not equal.

The best option is actually to keep the longest common subsequence with the highest ASCII sum. Let's find all common subsequences:

- "e" (ASCII 101)
- "a" (ASCII 97)
- "ea" (ASCII 101 + 97 = 198)

"ea" gives us the highest ASCII sum (198). To get "ea" from both strings:

- From "sea": delete 's' (ASCII 115)
- From "eat": delete 't' (ASCII 116)
  Total deletions: 115 + 116 = 231

Wait, that's the same as Option 1! Let's verify: Total ASCII of both strings = sum("sea") + sum("eat") = (115+101+97) + (101+97+116) = 627. If we keep "ea" (ASCII 198), we need to delete 627 - 2\*198 = 627 - 396 = 231. Perfect!

This reveals the key insight: **Minimum delete sum = Total ASCII sum of both strings - 2 × Maximum ASCII sum of common subsequence**.

## Brute Force Approach

A brute force approach would try all possible deletions from both strings. For each character in each string, we could either delete it or keep it. With two strings of length m and n, this gives us 2^(m+n) possibilities to check—exponential time complexity.

We could also think about finding all common subsequences and calculating their ASCII sums. For each character in s1, we either include it in the subsequence or not, and similarly for s2. We need to find matching subsequences. Even with memoization, this approach would be O(2^max(m,n)) in the worst case.

The problem with brute force is clear: for strings of even moderate length (say 20 characters each), we'd have over a million possibilities to check. We need a more efficient approach.

## Optimized Approach

The key insight is that this problem is a variation of the **Longest Common Subsequence (LCS)** problem, but instead of maximizing length, we want to maximize the ASCII sum of the common subsequence.

We can use **dynamic programming** with a 2D table `dp[i][j]` where:

- `dp[i][j]` = maximum ASCII sum of common subsequence between `s1[0:i]` and `s2[0:j]`
- `i` ranges from 0 to m (where m = length of s1)
- `j` ranges from 0 to n (where n = length of s2)

The recurrence relation:

1. If `s1[i-1] == s2[j-1]`: We can include this character in our common subsequence.
   `dp[i][j] = dp[i-1][j-1] + ascii(s1[i-1])`
2. If `s1[i-1] != s2[j-1]`: We take the maximum of either skipping the character from s1 or skipping it from s2.
   `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

Base cases:

- `dp[0][j] = 0` (empty s1 has no common characters with any prefix of s2)
- `dp[i][0] = 0` (empty s2 has no common characters with any prefix of s1)

Once we have the maximum ASCII sum of common subsequence, the answer is:
`total_ascii(s1) + total_ascii(s2) - 2 × dp[m][n]`

## Optimal Solution

<div class="code-group">

```python
# Time: O(m*n) where m = len(s1), n = len(s2)
# Space: O(m*n) for the DP table
def minimumDeleteSum(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)

    # Create DP table with dimensions (m+1) x (n+1)
    # dp[i][j] = max ASCII sum of common subsequence between s1[:i] and s2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Fill the DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i - 1] == s2[j - 1]:
                # Characters match: add ASCII value to the previous best
                dp[i][j] = dp[i - 1][j - 1] + ord(s1[i - 1])
            else:
                # Characters don't match: take the best of skipping char from s1 or s2
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # Calculate total ASCII sum of both strings
    total_ascii = sum(ord(c) for c in s1) + sum(ord(c) for c in s2)

    # Minimum delete sum = total ASCII - 2 * max common subsequence ASCII
    return total_ascii - 2 * dp[m][n]
```

```javascript
// Time: O(m*n) where m = s1.length, n = s2.length
// Space: O(m*n) for the DP table
function minimumDeleteSum(s1, s2) {
  const m = s1.length,
    n = s2.length;

  // Create DP table with dimensions (m+1) x (n+1)
  // dp[i][j] = max ASCII sum of common subsequence between s1[0:i] and s2[0:j]
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        // Characters match: add ASCII value to the previous best
        dp[i][j] = dp[i - 1][j - 1] + s1.charCodeAt(i - 1);
      } else {
        // Characters don't match: take the best of skipping char from s1 or s2
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Calculate total ASCII sum of both strings
  let totalAscii = 0;
  for (let i = 0; i < m; i++) totalAscii += s1.charCodeAt(i);
  for (let i = 0; i < n; i++) totalAscii += s2.charCodeAt(i);

  // Minimum delete sum = total ASCII - 2 * max common subsequence ASCII
  return totalAscii - 2 * dp[m][n];
}
```

```java
// Time: O(m*n) where m = s1.length(), n = s2.length()
// Space: O(m*n) for the DP table
class Solution {
    public int minimumDeleteSum(String s1, String s2) {
        int m = s1.length(), n = s2.length();

        // Create DP table with dimensions (m+1) x (n+1)
        // dp[i][j] = max ASCII sum of common subsequence between s1[0:i) and s2[0:j)
        int[][] dp = new int[m + 1][n + 1];

        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    // Characters match: add ASCII value to the previous best
                    dp[i][j] = dp[i - 1][j - 1] + (int) s1.charAt(i - 1);
                } else {
                    // Characters don't match: take the best of skipping char from s1 or s2
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // Calculate total ASCII sum of both strings
        int totalAscii = 0;
        for (int i = 0; i < m; i++) totalAscii += (int) s1.charAt(i);
        for (int i = 0; i < n; i++) totalAscii += (int) s2.charAt(i);

        // Minimum delete sum = total ASCII - 2 * max common subsequence ASCII
        return totalAscii - 2 * dp[m][n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n), where m and n are the lengths of s1 and s2. We fill a 2D DP table of size (m+1) × (n+1), and each cell takes O(1) time to compute.

**Space Complexity:** O(m × n) for the DP table. We can optimize this to O(min(m, n)) by only keeping two rows of the DP table at a time, since we only need the previous row to compute the current row. However, the O(m × n) solution is usually acceptable in interviews unless specifically asked to optimize space.

## Common Mistakes

1. **Confusing subsequence with substring**: A common subsequence doesn't need to be contiguous, while a substring does. This problem asks for subsequences, so characters can be non-adjacent.

2. **Off-by-one errors in DP indices**: Remember that `dp[i][j]` corresponds to `s1[0:i-1]` and `s2[0:j-1]` (Python slicing notation). The extra row and column at index 0 represent empty strings.

3. **Forgetting to multiply by 2 in the final calculation**: The formula is `total_ascii - 2 * dp[m][n]`, not `total_ascii - dp[m][n]`. We subtract the common subsequence ASCII sum twice because we're keeping it in both strings.

4. **Using ASCII values incorrectly**: Some candidates try to work with character differences instead of ASCII sums. Remember we're summing ASCII values, not comparing characters directly.

## When You'll See This Pattern

This problem uses a **2D dynamic programming** pattern common in string comparison problems. You'll see similar patterns in:

1. **Edit Distance (LeetCode 72)**: Also uses a 2D DP table to find minimum operations (insert, delete, replace) to transform one string to another.

2. **Longest Common Subsequence (LeetCode 1143)**: The exact same DP structure but maximizing length instead of ASCII sum.

3. **Delete Operation for Two Strings (LeetCode 583)**: Nearly identical to this problem but minimizing the number of deletions (count) instead of ASCII sum.

4. **Interleaving String (LeetCode 97)**: Another 2D DP problem checking if a string can be formed by interleaving two other strings.

## Key Takeaways

1. **Many string comparison problems reduce to 2D dynamic programming**: When you need to find relationships between two strings (common subsequences, edit distance, etc.), think about a DP table where `dp[i][j]` represents some optimal value for prefixes `s1[:i]` and `s2[:j]`.

2. **The recurrence often involves three cases**: match (use both characters), skip character from first string, or skip character from second string.

3. **Minimizing deletions is equivalent to maximizing what you keep**: This is a common optimization insight—instead of thinking about what to delete, think about what common subsequence gives you the maximum value to keep.

Related problems: [Edit Distance](/problem/edit-distance), [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Delete Operation for Two Strings](/problem/delete-operation-for-two-strings)
