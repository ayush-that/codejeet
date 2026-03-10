---
title: "How to Solve Regular Expression Matching — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Regular Expression Matching. Hard difficulty, 30.5% acceptance rate. Topics: String, Dynamic Programming, Recursion."
date: "2026-08-08"
category: "dsa-patterns"
tags: ["regular-expression-matching", "string", "dynamic-programming", "recursion", "hard"]
---

# How to Solve Regular Expression Matching

Regular expression matching is a classic hard problem that tests your ability to handle complex pattern matching with special characters. The challenge comes from the `*` operator, which can match zero or more of the preceding element, creating multiple possible matching paths that need to be explored. This problem is particularly interesting because it requires careful handling of overlapping subproblems and demonstrates the power of dynamic programming for string matching.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Consider matching `s = "aab"` against pattern `p = "c*a*b"`.

**Step-by-step matching:**

1. Pattern starts with `"c*"` - this means zero or more `'c'` characters
2. Since our string starts with `'a'`, we choose to match zero `'c'` characters
3. Next pattern character is `'a'` - matches the first `'a'` in our string
4. Next pattern is `"*"` - this applies to the preceding `'a'`, so `"a*"` means zero or more `'a'` characters
5. We have `"ab"` remaining in our string and `"b"` remaining in our pattern
6. We need to decide how many `'a'` characters to match:
   - Option 1: Match zero `'a'` characters → remaining string `"ab"`, remaining pattern `"b"` → fails
   - Option 2: Match one `'a'` character → remaining string `"b"`, remaining pattern `"b"` → matches!
   - Option 3: Match two `'a'` characters → remaining string `""`, remaining pattern `"b"` → fails

The key insight is that at each `*` character, we need to consider multiple possibilities: matching zero occurrences or matching one occurrence and then potentially more. This branching creates exponential possibilities in a naive approach.

## Brute Force Approach

The most straightforward approach is recursive backtracking. At each position, we check if the current characters match, then handle `*` patterns by trying all possible numbers of matches.

**Why this is insufficient:**

- The branching factor at each `*` creates exponential time complexity
- For a string of length `n` and pattern of length `m`, worst-case time is O(3^(m+n))
- Many subproblems are solved repeatedly (e.g., matching `"a*"` against the same substring multiple times)
- This approach times out on larger test cases

The brute force reveals the core challenge: we need to avoid recomputing the same subproblems over and over.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems** - the hallmarks of dynamic programming.

**Optimal substructure:** Whether `s[i:]` matches `p[j:]` depends on:

1. Whether the current characters match
2. What happens with the rest of the string and pattern

**Overlapping subproblems:** When we encounter `*`, we need to check multiple possibilities that may involve the same subproblems.

**DP state definition:**
Let `dp[i][j]` be a boolean indicating whether `s[i:]` matches `p[j:]`. We work backwards from the end of both strings to the beginning.

**Transition rules:**

1. If `p[j]` is not `'*'`:
   - Current characters must match (`s[i] == p[j]` or `p[j] == '.'`)
   - The rest must match: `dp[i+1][j+1]`
2. If `p[j]` is `'*'`:
   - We have two main options:
     a. Match zero characters of `p[j-1]`: `dp[i][j+2]`
     b. Match at least one character if current character matches: `dp[i+1][j]`
   - The `*` always applies to the preceding character `p[j-1]`

**Base cases:**

- Empty string matches empty pattern: `dp[n][m] = true`
- Empty string may match patterns like `"a*b*c*"` (all `*` patterns can match zero occurrences)

## Optimal Solution

Here's the complete dynamic programming solution with detailed comments:

<div class="code-group">

```python
# Time: O(m * n) where m = len(s), n = len(p)
# Space: O(m * n) for the DP table
def isMatch(s: str, p: str) -> bool:
    m, n = len(s), len(p)

    # dp[i][j] = True if s[i:] matches p[j:]
    dp = [[False] * (n + 1) for _ in range(m + 1)]

    # Base case: empty string matches empty pattern
    dp[m][n] = True

    # Handle patterns that can match empty string (like "a*b*c*")
    # We fill from the end backwards
    for j in range(n - 1, -1, -1):
        # If current pattern char is '*', check if pattern after '*' matches empty string
        if p[j] == '*':
            # Skip the '*' and its preceding character
            dp[m][j] = dp[m][j + 1]
        elif j + 1 < n and p[j + 1] == '*':
            # Current char is followed by '*', so it can match zero occurrences
            dp[m][j] = dp[m][j + 2]

    # Fill DP table from bottom-right to top-left
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            # Check if current characters match
            # Match if characters are equal OR pattern has '.' which matches any char
            curr_match = j < n and (s[i] == p[j] or p[j] == '.')

            if j + 1 < n and p[j + 1] == '*':
                # Case 1: '*' means zero or more of preceding element
                # Option A: Match zero occurrences - skip pattern[j] and '*'
                zero_match = dp[i][j + 2]

                # Option B: Match one or more occurrences - only if current chars match
                # If we match one occurrence, we stay at same pattern position
                # (to potentially match more) and move to next string char
                one_or_more_match = curr_match and dp[i + 1][j]

                dp[i][j] = zero_match or one_or_more_match
            else:
                # Case 2: No '*' following current pattern char
                # Current chars must match AND the rest must match
                dp[i][j] = curr_match and dp[i + 1][j + 1]

    return dp[0][0]
```

```javascript
// Time: O(m * n) where m = s.length, n = p.length
// Space: O(m * n) for the DP table
function isMatch(s, p) {
  const m = s.length,
    n = p.length;

  // dp[i][j] = true if s.substring(i) matches p.substring(j)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));

  // Base case: empty string matches empty pattern
  dp[m][n] = true;

  // Handle patterns that can match empty string
  for (let j = n - 1; j >= 0; j--) {
    if (p[j] === "*") {
      // Current char is '*', check if pattern after '*' matches empty string
      dp[m][j] = dp[m][j + 1];
    } else if (j + 1 < n && p[j + 1] === "*") {
      // Current char is followed by '*', so it can match zero occurrences
      dp[m][j] = dp[m][j + 2];
    }
  }

  // Fill DP table from bottom to top
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      // Check if current characters match
      const currMatch = j < n && (s[i] === p[j] || p[j] === ".");

      if (j + 1 < n && p[j + 1] === "*") {
        // Case 1: Pattern has '*' following current character
        // Option A: Match zero occurrences
        const zeroMatch = dp[i][j + 2];

        // Option B: Match one or more occurrences
        const oneOrMoreMatch = currMatch && dp[i + 1][j];

        dp[i][j] = zeroMatch || oneOrMoreMatch;
      } else {
        // Case 2: No '*' following current pattern char
        // Current chars must match AND the rest must match
        dp[i][j] = currMatch && dp[i + 1][j + 1];
      }
    }
  }

  return dp[0][0];
}
```

```java
// Time: O(m * n) where m = s.length(), n = p.length()
// Space: O(m * n) for the DP table
class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();

        // dp[i][j] = true if s.substring(i) matches p.substring(j)
        boolean[][] dp = new boolean[m + 1][n + 1];

        // Base case: empty string matches empty pattern
        dp[m][n] = true;

        // Handle patterns that can match empty string
        for (int j = n - 1; j >= 0; j--) {
            if (p.charAt(j) == '*') {
                // Current char is '*', check if pattern after '*' matches empty string
                dp[m][j] = dp[m][j + 1];
            } else if (j + 1 < n && p.charAt(j + 1) == '*') {
                // Current char is followed by '*', so it can match zero occurrences
                dp[m][j] = dp[m][j + 2];
            }
        }

        // Fill DP table from bottom to top
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                // Check if current characters match
                boolean currMatch = j < n &&
                    (s.charAt(i) == p.charAt(j) || p.charAt(j) == '.');

                if (j + 1 < n && p.charAt(j + 1) == '*') {
                    // Case 1: Pattern has '*' following current character
                    // Option A: Match zero occurrences
                    boolean zeroMatch = dp[i][j + 2];

                    // Option B: Match one or more occurrences
                    boolean oneOrMoreMatch = currMatch && dp[i + 1][j];

                    dp[i][j] = zeroMatch || oneOrMoreMatch;
                } else {
                    // Case 2: No '*' following current pattern char
                    // Current chars must match AND the rest must match
                    dp[i][j] = currMatch && dp[i + 1][j + 1];
                }
            }
        }

        return dp[0][0];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- We fill a DP table of size (m+1) × (n+1)
- Each cell requires O(1) computation
- Where m is the length of string `s` and n is the length of pattern `p`

**Space Complexity: O(m × n)**

- We store the entire DP table
- Can be optimized to O(n) by only keeping two rows at a time since we only need the current and next row

## Common Mistakes

1. **Forgetting that `*` applies to the preceding character:** Candidates sometimes treat `*` as a standalone wildcard instead of understanding it modifies the preceding character. Remember: `"a*"` means "zero or more `'a'` characters," not "match any character zero or more times."

2. **Incorrect base case handling:** The empty string can match patterns like `"a*b*"` because each `*` can match zero occurrences. Many candidates forget to initialize the last row of the DP table properly.

3. **Off-by-one errors with indices:** When checking `p[j+1] == '*'`, it's easy to forget the bounds check `j+1 < n`. Similarly, when accessing `s[i]` or `p[j]`, we need to ensure indices are valid.

4. **Confusing this with Wildcard Matching:** These are different problems! In Wildcard Matching, `'*'` matches any sequence (including empty), while here `'*'` matches zero or more of the preceding specific character.

## When You'll See This Pattern

This pattern of using dynamic programming for string matching appears in several related problems:

1. **Wildcard Matching (Hard):** Similar structure but with different semantics for `'*'`. The DP approach is almost identical, making it excellent practice after solving this problem.

2. **Edit Distance (Medium):** Uses a similar DP table to find the minimum operations to transform one string into another. The state transitions involve insert, delete, and replace operations.

3. **Interleaving String (Medium):** Determines if a string is formed by interleaving two other strings. Uses a 2D DP table where `dp[i][j]` represents whether the first `i+j` characters can be formed from the first `i` of one string and first `j` of another.

## Key Takeaways

1. **When you see string matching with special characters and multiple possibilities**, think dynamic programming. The overlapping subproblems created by `*` operators make DP a natural fit.

2. **Define DP state based on suffixes or prefixes** of the strings. `dp[i][j]` representing whether `s[i:]` matches `p[j:]` or whether `s[:i]` matches `p[:j]` are both valid approaches.

3. **Pay special attention to base cases** when one string is empty. Empty patterns only match empty strings, but patterns with `*` can match empty strings by taking the zero-match option.

Related problems: [Wildcard Matching](/problem/wildcard-matching)
