---
title: "How to Solve Shortest Common Supersequence  — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Shortest Common Supersequence . Hard difficulty, 61.8% acceptance rate. Topics: String, Dynamic Programming."
date: "2028-01-03"
category: "dsa-patterns"
tags: ["shortest-common-supersequence", "string", "dynamic-programming", "hard"]
---

# How to Solve Shortest Common Supersequence

The Shortest Common Supersequence (SCS) problem asks us to find the shortest string that contains both input strings as subsequences. This is tricky because we need to preserve the order of characters from both strings while minimizing the total length. The key insight is that the shortest common supersequence must include the longest common subsequence (LCS) exactly once, while interleaving the remaining characters from both strings in their original order.

## Visual Walkthrough

Let's trace through an example with `str1 = "abac"` and `str2 = "cab"`:

1. First, we need to find the Longest Common Subsequence (LCS) between these strings. The LCS is "ab" (positions: str1[0]='a', str1[2]='a' and str1[1]='b'; str2[1]='a', str2[2]='b').

2. Now we build the supersequence by merging both strings while preserving the LCS:
   - Start with both pointers at the beginning: i=0 (str1), j=0 (str2)
   - Compare 'a' from str1 and 'c' from str2 - they don't match
   - Since 'c' is not in the LCS, we add it to result: result = "c", j=1
   - Now compare 'a' from str1 and 'a' from str2 - they match (part of LCS)
   - Add 'a' to result: result = "ca", i=1, j=2
   - Compare 'b' from str1 and 'b' from str2 - they match (part of LCS)
   - Add 'b' to result: result = "cab", i=2, j=3
   - str2 is exhausted, add remaining str1 characters: 'a' then 'c'
   - Final result: "cabac"

The shortest common supersequence "cabac" (length 5) contains both "abac" and "cab" as subsequences. Notice how we included the LCS "ab" only once, and added the non-common characters 'c' from str2 at the beginning and 'ac' from str1 at the end.

## Brute Force Approach

A naive approach would be to generate all possible interleavings of the two strings that preserve their respective orders, then pick the shortest one. For strings of length m and n, there are C(m+n, m) possible interleavings (the binomial coefficient), which grows exponentially.

The brute force algorithm would:

1. Generate all possible sequences where we take characters from either str1 or str2 in order
2. Check if each generated sequence contains both strings as subsequences
3. Return the shortest valid sequence

This approach has O(2^(m+n)) time complexity, which is completely impractical for even moderately sized strings (e.g., m=n=20 gives over 1 million possibilities).

## Optimized Approach

The optimal solution uses dynamic programming with a two-step process:

1. **Find the LCS using DP**: Build a DP table where dp[i][j] represents the length of LCS between str1[0:i] and str2[0:j]. This takes O(m×n) time and space.

2. **Reconstruct the SCS from the LCS**: Once we have the LCS, we can build the SCS by:
   - Starting from the end of both strings and the LCS
   - If characters match (part of LCS), add the character once and move all pointers
   - If characters don't match, add the character from the string with the larger LCS value and move that pointer
   - Continue until we've processed both strings completely

The key insight is that the SCS length = m + n - LCS_length. We're essentially merging the two strings while ensuring common characters appear only once.

## Optimal Solution

Here's the complete solution using dynamic programming:

<div class="code-group">

```python
# Time: O(m * n) | Space: O(m * n)
def shortestCommonSupersequence(str1: str, str2: str) -> str:
    m, n = len(str1), len(str2)

    # Step 1: Build DP table for LCS lengths
    # dp[i][j] = length of LCS between str1[:i] and str2[:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i - 1] == str2[j - 1]:
                # Characters match - extend LCS
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                # Take maximum LCS from either skipping str1[i] or str2[j]
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    # Step 2: Reconstruct the shortest common supersequence
    result = []
    i, j = m, n

    # Traverse from the end using the DP table
    while i > 0 and j > 0:
        if str1[i - 1] == str2[j - 1]:
            # Characters match - part of LCS, add once
            result.append(str1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            # str1[i-1] is not in LCS, add it
            result.append(str1[i - 1])
            i -= 1
        else:
            # str2[j-1] is not in LCS, add it
            result.append(str2[j - 1])
            j -= 1

    # Add remaining characters from str1 (if any)
    while i > 0:
        result.append(str1[i - 1])
        i -= 1

    # Add remaining characters from str2 (if any)
    while j > 0:
        result.append(str2[j - 1])
        j -= 1

    # Reverse since we built from the end
    return ''.join(reversed(result))
```

```javascript
// Time: O(m * n) | Space: O(m * n)
function shortestCommonSupersequence(str1, str2) {
  const m = str1.length,
    n = str2.length;

  // Step 1: Build DP table for LCS lengths
  // dp[i][j] = length of LCS between str1[0..i-1] and str2[0..j-1]
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        // Characters match - extend LCS
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // Take maximum LCS from either skipping str1[i-1] or str2[j-1]
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Step 2: Reconstruct the shortest common supersequence
  const result = [];
  let i = m,
    j = n;

  // Traverse from the end using the DP table
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      // Characters match - part of LCS, add once
      result.push(str1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      // str1[i-1] is not in LCS, add it
      result.push(str1[i - 1]);
      i--;
    } else {
      // str2[j-1] is not in LCS, add it
      result.push(str2[j - 1]);
      j--;
    }
  }

  // Add remaining characters from str1 (if any)
  while (i > 0) {
    result.push(str1[i - 1]);
    i--;
  }

  // Add remaining characters from str2 (if any)
  while (j > 0) {
    result.push(str2[j - 1]);
    j--;
  }

  // Reverse since we built from the end
  return result.reverse().join("");
}
```

```java
// Time: O(m * n) | Space: O(m * n)
class Solution {
    public String shortestCommonSupersequence(String str1, String str2) {
        int m = str1.length(), n = str2.length();

        // Step 1: Build DP table for LCS lengths
        // dp[i][j] = length of LCS between str1[0..i-1] and str2[0..j-1]
        int[][] dp = new int[m + 1][n + 1];

        // Fill DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                    // Characters match - extend LCS
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    // Take maximum LCS from either skipping str1[i-1] or str2[j-1]
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // Step 2: Reconstruct the shortest common supersequence
        StringBuilder result = new StringBuilder();
        int i = m, j = n;

        // Traverse from the end using the DP table
        while (i > 0 && j > 0) {
            if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                // Characters match - part of LCS, add once
                result.append(str1.charAt(i - 1));
                i--;
                j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                // str1[i-1] is not in LCS, add it
                result.append(str1.charAt(i - 1));
                i--;
            } else {
                // str2[j-1] is not in LCS, add it
                result.append(str2.charAt(j - 1));
                j--;
            }
        }

        // Add remaining characters from str1 (if any)
        while (i > 0) {
            result.append(str1.charAt(i - 1));
            i--;
        }

        // Add remaining characters from str2 (if any)
        while (j > 0) {
            result.append(str2.charAt(j - 1));
            j--;
        }

        // Reverse since we built from the end
        return result.reverse().toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m × n), where m and n are the lengths of str1 and str2 respectively. This comes from:

- Building the DP table: O(m × n) for the nested loops
- Reconstructing the SCS: O(m + n) for the backward traversal
- The dominant term is O(m × n)

**Space Complexity:** O(m × n) for the DP table. We can optimize this to O(min(m, n)) by only keeping two rows of the DP table at a time, but the reconstruction becomes more complex since we need the full table to backtrack.

## Common Mistakes

1. **Forgetting to reverse the result**: Since we build the string from the end during reconstruction, beginners often return the unreversed string, getting the sequence backwards.

2. **Incorrect DP table initialization**: The DP table needs to be (m+1) × (n+1) to handle empty strings. Using m × n leads to index errors.

3. **Wrong comparison in reconstruction**: When characters don't match, we need to compare dp[i-1][j] and dp[i][j-1] to decide which character to add. Comparing the wrong indices leads to incorrect ordering.

4. **Not handling remaining characters**: After the main loop, we must add any remaining characters from either string. Forgetting the two while loops at the end is a common oversight.

## When You'll See This Pattern

This LCS-based reconstruction pattern appears in several related problems:

1. **Longest Common Subsequence (LeetCode 1143)**: The direct precursor to this problem. Mastering LCS is essential for solving SCS.

2. **Delete Operation for Two Strings (LeetCode 583)**: Asks for the minimum deletions to make strings equal, which equals m + n - 2 × LCS_length.

3. **Minimum ASCII Delete Sum for Two Strings (LeetCode 712)**: Similar to #583 but with weighted deletions based on ASCII values.

4. **Interleaving String (LeetCode 97)**: Checks if a string is formed by interleaving two other strings, using similar DP techniques.

## Key Takeaways

1. **SCS is built on LCS**: The shortest common supersequence length is always m + n - LCS_length. Recognizing this relationship is crucial.

2. **DP + Backtracking is powerful**: Many string problems combine DP table construction with backtracking to reconstruct the solution. The DP table stores not just the answer but the "path" to get there.

3. **Work backwards for reconstruction**: When building sequences from DP tables, it's often easier to start from the end and work backwards, then reverse the result.

Related problems: [Longest Common Subsequence](/problem/longest-common-subsequence), [Shortest String That Contains Three Strings](/problem/shortest-string-that-contains-three-strings)
