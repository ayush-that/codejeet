---
title: "How to Solve Edit Distance — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Edit Distance. Medium difficulty, 60.2% acceptance rate. Topics: String, Dynamic Programming."
date: "2026-07-28"
category: "dsa-patterns"
tags: ["edit-distance", "string", "dynamic-programming", "medium"]
---

# How to Solve Edit Distance

The Edit Distance problem asks us to find the minimum number of operations (insert, delete, or replace) needed to transform one string into another. This is a classic dynamic programming problem that appears frequently in interviews because it tests your ability to recognize overlapping subproblems and build up solutions systematically. What makes this problem tricky is that you need to consider three different operations at each step, and the optimal choice depends on future characters in both strings.

## Visual Walkthrough

Let's walk through a concrete example: converting "horse" to "ros".

We want to transform "horse" into "ros" with the fewest operations. Let's think about what happens when we compare characters:

1. Compare 'h' and 'r': They're different. We have three options:
   - **Replace** 'h' with 'r' (cost 1), then convert "orse" to "os"
   - **Delete** 'h' (cost 1), then convert "orse" to "ros"
   - **Insert** 'r' (cost 1), then convert "horse" to "os"

2. Notice how each operation reduces the problem size:
   - Replace: Both strings move forward one character
   - Delete: Only the first string moves forward
   - Insert: Only the second string moves forward

Let's trace the optimal path:

- 'h' ≠ 'r': Replace 'h' with 'r' (1 operation)
- Now we have "rorse" and "ros"
- 'o' = 'o': No operation needed, both move forward
- 'r' ≠ 's': Replace 'r' with 's' (1 operation, total 2)
- Now we have "rosse" and "ros"
- Delete 's' (1 operation, total 3)
- Delete 'e' (1 operation, total 4)

But wait, we can do better! Let's try:

- Delete 'h' (1)
- 'o' = 'o': No operation
- 'r' = 'r': No operation
- Delete 's' (1, total 2)
- Delete 'e' (1, total 3)

So the minimum edit distance is 3. This shows why we need a systematic approach - trying all possibilities manually gets complex quickly.

## Brute Force Approach

The brute force approach would be to try all possible sequences of operations. At each step, we have three choices (insert, delete, replace), leading to an exponential number of possibilities. For strings of length m and n, the time complexity would be O(3^(m+n)), which is completely impractical for even moderately sized strings.

A naive candidate might try a greedy approach: always choose the operation that gives the best immediate match. However, this fails because local optimal choices don't guarantee a global optimum, as we saw in our example where the seemingly good "replace" operation led to a suboptimal solution.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems** - the hallmarks of dynamic programming.

**Optimal substructure**: The minimum edit distance between word1[0..i] and word2[0..j] depends on the solutions to smaller subproblems:

- If the last characters match: dp[i][j] = dp[i-1][j-1] (no cost)
- If they don't match: dp[i][j] = 1 + min(
  dp[i-1][j], // delete from word1
  dp[i][j-1], // insert into word1  
   dp[i-1][j-1] // replace
  )

**Overlapping subproblems**: When we compute dp[i][j], we need dp[i-1][j], dp[i][j-1], and dp[i-1][j-1], which themselves depend on even smaller subproblems. Computing these recursively would lead to repeated work.

We can visualize this as a 2D table where dp[i][j] represents the minimum edit distance between the first i characters of word1 and first j characters of word2.

Base cases:

- dp[0][j] = j: Convert empty string to word2[0..j] requires j insertions
- dp[i][0] = i: Convert word1[0..i] to empty string requires i deletions

## Optimal Solution

Here's the complete dynamic programming solution with detailed comments:

<div class="code-group">

```python
# Time: O(m*n) where m = len(word1), n = len(word2)
# Space: O(m*n) for the DP table
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)

    # Create a DP table with (m+1) rows and (n+1) columns
    # dp[i][j] = min edit distance between word1[:i] and word2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Initialize base cases:
    # Converting empty string to word2[:j] requires j insertions
    for j in range(n + 1):
        dp[0][j] = j

    # Converting word1[:i] to empty string requires i deletions
    for i in range(m + 1):
        dp[i][0] = i

    # Fill the DP table row by row
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            # If current characters match, no operation needed
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                # Take minimum of three possible operations:
                # 1. Delete: dp[i-1][j] + 1 (remove char from word1)
                # 2. Insert: dp[i][j-1] + 1 (add char to word1)
                # 3. Replace: dp[i-1][j-1] + 1 (change char in word1)
                dp[i][j] = 1 + min(
                    dp[i - 1][j],    # delete
                    dp[i][j - 1],    # insert
                    dp[i - 1][j - 1] # replace
                )

    # Bottom-right cell contains answer for full strings
    return dp[m][n]
```

```javascript
// Time: O(m*n) where m = word1.length, n = word2.length
// Space: O(m*n) for the DP table
function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;

  // Create DP table with (m+1) rows and (n+1) columns
  // dp[i][j] = min edit distance between first i chars of word1 and first j chars of word2
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Initialize base cases
  // Empty string to word2[0..j] requires j insertions
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // word1[0..i] to empty string requires i deletions
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Check if current characters match
      if (word1[i - 1] === word2[j - 1]) {
        // Characters match, no operation needed
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        // Take minimum of three operations:
        // 1. Delete: remove char from word1
        // 2. Insert: add char to word1
        // 3. Replace: change char in word1
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j], // delete
            dp[i][j - 1], // insert
            dp[i - 1][j - 1] // replace
          );
      }
    }
  }

  // Bottom-right cell has answer for complete strings
  return dp[m][n];
}
```

```java
// Time: O(m*n) where m = word1.length(), n = word2.length()
// Space: O(m*n) for the DP table
class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();

        // dp[i][j] = min edit distance between first i chars of word1 and first j chars of word2
        int[][] dp = new int[m + 1][n + 1];

        // Initialize base cases
        // Empty string to word2[0..j] requires j insertions
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }

        // word1[0..i] to empty string requires i deletions
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }

        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                // Check if current characters match
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    // Characters match, no operation needed
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    // Take minimum of three possible operations
                    // 1. Delete: remove char from word1
                    // 2. Insert: add char to word1
                    // 3. Replace: change char in word1
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j],      // delete
                        Math.min(
                            dp[i][j - 1],  // insert
                            dp[i - 1][j - 1] // replace
                        )
                    );
                }
            }
        }

        // Bottom-right cell contains the answer
        return dp[m][n];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m×n)** where m and n are the lengths of word1 and word2. We need to fill every cell in the (m+1)×(n+1) DP table, and each cell takes O(1) time to compute.

**Space Complexity: O(m×n)** for the DP table. We can optimize this to O(min(m,n)) by only keeping two rows of the DP table at a time, since we only need the previous row to compute the current row. However, the O(m×n) solution is usually acceptable in interviews and is easier to explain.

## Common Mistakes

1. **Off-by-one errors in DP table indices**: The DP table has dimensions (m+1)×(n+1), not m×n. dp[i][j] corresponds to the first i characters of word1 and first j characters of word2. Remember that word1[i-1] gives the i-th character, not word1[i].

2. **Incorrect base case initialization**: Forgetting to initialize dp[0][j] = j and dp[i][0] = i. These represent converting empty strings, which require insertions or deletions for every character.

3. **Wrong recurrence relation when characters match**: When word1[i-1] == word2[j-1], the cost is dp[i-1][j-1], NOT min(dp[i-1][j-1], dp[i-1][j] + 1, dp[i][j-1] + 1). If characters match, we don't need any operation.

4. **Confusing insert vs delete operations**: Insert means adding a character to word1 (which matches a character in word2), so we look at dp[i][j-1]. Delete means removing a character from word1, so we look at dp[i-1][j]. Mixing these up gives wrong results.

## When You'll See This Pattern

The Edit Distance problem uses a classic 2D dynamic programming pattern for sequence alignment problems. You'll see similar patterns in:

1. **Longest Common Subsequence (LCS)**: Instead of counting operations, you're finding the longest matching subsequence. The DP recurrence is similar but simpler.

2. **Delete Operation for Two Strings**: This is essentially Edit Distance with only delete operations allowed (no insert or replace). The recurrence simplifies to considering only deletions.

3. **Minimum ASCII Delete Sum for Two Strings**: Similar to Edit Distance but with weighted operations (ASCII values instead of unit costs).

4. **One Edit Distance**: A special case where you only need to check if the edit distance is exactly 1, which can be done in O(n) time without full DP.

## Key Takeaways

1. **Recognize sequence alignment problems**: When you need to transform one sequence into another with minimum cost operations, think 2D DP with dp[i][j] representing the cost for prefixes.

2. **Understand the three fundamental operations**: Insert (look left), delete (look up), and replace (look diagonally). The recurrence always considers these three possibilities when characters don't match.

3. **Practice the DP table visualization**: Drawing the DP table for small examples helps build intuition and catch implementation errors. Always start with clear base cases.

Related problems: [One Edit Distance](/problem/one-edit-distance), [Delete Operation for Two Strings](/problem/delete-operation-for-two-strings), [Minimum ASCII Delete Sum for Two Strings](/problem/minimum-ascii-delete-sum-for-two-strings)
