---
title: "How to Solve Longest Palindromic Subsequence After at Most K Operations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Palindromic Subsequence After at Most K Operations. Medium difficulty, 37.4% acceptance rate. Topics: String, Dynamic Programming."
date: "2030-03-07"
category: "dsa-patterns"
tags:
  [
    "longest-palindromic-subsequence-after-at-most-k-operations",
    "string",
    "dynamic-programming",
    "medium",
  ]
---

# How to Solve Longest Palindromic Subsequence After at Most K Operations

This problem asks us to find the longest palindromic subsequence we can create from a string `s` by performing at most `k` operations, where each operation changes a character to the next or previous letter in the alphabet (with wrap-around). What makes this tricky is that we need to consider both the subsequence selection (which characters to keep) AND the cost to make those characters match in a palindrome, all while staying within our operation budget.

## Visual Walkthrough

Let's walk through an example: `s = "abcda"`, `k = 2`.

We want to find a subsequence that can become a palindrome with ≤2 operations. Consider the subsequence `"aba"` (positions 0, 1, 4):

- Characters at positions 0 and 4 are `'a'` and `'a'` → already match (0 operations)
- Middle character `'b'` at position 1 doesn't need to match anything else
- Total operations: 0 → valid palindrome

But can we do better? What about `"abcba"` (positions 0, 1, 2, 3, 4)?

- Pair 1: `s[0]='a'` and `s[4]='a'` → match (0 ops)
- Pair 2: `s[1]='b'` and `s[3]='d'` → need to make them equal
  - `'b'` to `'d'`: forward distance = 2, backward distance = 24 (wrap-around)
  - Minimum operations = min(2, 24) = 2
- Middle character `'c'` at position 2 (no pair)
- Total operations: 0 + 2 = 2 → valid palindrome!

So the longest palindromic subsequence we can get is length 5 with exactly 2 operations.

The key insight: This is a variation of the classic Longest Palindromic Subsequence (LPS) problem, but with a cost to make characters match.

## Brute Force Approach

A naive approach would be:

1. Generate all possible subsequences of `s` (2^n possibilities)
2. For each subsequence, check if it can be made into a palindrome with ≤k operations
3. Track the longest valid subsequence

To check if a subsequence can be made palindrome:

- Pair up characters from both ends
- For each pair, compute the minimum operations to make them equal
- Sum all operation costs
- If sum ≤ k, it's valid

**Why this fails:**

- Generating all subsequences is O(2^n), which is infeasible for n up to 200
- Even with pruning, the search space is enormous
- We need a smarter way to combine subsequence selection with operation cost calculation

## Optimized Approach

The optimal solution uses **Dynamic Programming (DP)** with a 3D state:

**Key Insight:**

- This is similar to the standard LPS DP, but we need to track both the length of the palindrome AND the operations used so far.
- For standard LPS: `dp[i][j]` = longest palindromic subsequence in `s[i:j+1]`
- Here we need: `dp[i][j][ops]` = whether we can form a palindrome in `s[i:j+1]` using exactly `ops` operations

But tracking exact operations for each state is complex. Instead, we can think differently:

**Better Insight:**
We can precompute the cost to make any two characters equal. Then in our DP, when we consider matching `s[i]` and `s[j]`, we add this cost. Our DP state becomes: `dp[i][j]` = maximum length of palindrome we can form in `s[i:j+1]` with some operations, but we need to track operations separately.

**Final DP State:**
`dp[i][j][ops]` = maximum length of palindrome we can achieve in substring `s[i:j+1]` using exactly `ops` operations.

**Transitions:**

1. If `i == j`: Single character is always a palindrome of length 1 with 0 operations
2. If `s[i] == s[j]`: We can take both characters
   - `dp[i][j][ops] = max(dp[i][j][ops], 2 + dp[i+1][j-1][ops])`
3. If `s[i] != s[j]`: We have choices:
   - Skip `s[i]`: `dp[i][j][ops] = max(dp[i][j][ops], dp[i+1][j][ops])`
   - Skip `s[j]`: `dp[i][j][ops] = max(dp[i][j][ops], dp[i][j-1][ops])`
   - Take both and make them equal (cost = c):
     - If `ops ≥ c`: `dp[i][j][ops] = max(dp[i][j][ops], 2 + dp[i+1][j-1][ops-c])`

**Base Case:** `dp[i][i][0] = 1` (single character with 0 operations)

**Answer:** Maximum `dp[0][n-1][ops]` where `ops ≤ k`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2 * k) where n = len(s)
# Space: O(n^2 * k) for the DP table
def longestPalindromicSubsequence(s: str, k: int) -> int:
    n = len(s)

    # Precompute cost to make any two characters equal
    # cost[a][b] = minimum operations to change a to b (or b to a)
    # Since alphabet wraps, distance is min(forward, backward)
    def char_cost(c1: str, c2: str) -> int:
        if c1 == c2:
            return 0
        # Convert to 0-25
        a, b = ord(c1) - ord('a'), ord(c2) - ord('a')
        # Direct distance
        direct = abs(a - b)
        # Wrap-around distance (through 'z' to 'a')
        wrap = 26 - direct
        return min(direct, wrap)

    # DP table: dp[i][j][ops] = max length palindrome in s[i:j+1] using exactly ops operations
    # We use -1 to indicate unreachable state
    dp = [[[-1] * (k + 1) for _ in range(n)] for _ in range(n)]

    # Initialize base cases
    for i in range(n):
        for ops in range(k + 1):
            # Single character is always palindrome with 0 operations
            # If ops > 0, we could have used operations before, but for single char,
            # we only care about ops=0 since using ops on single char doesn't help
            if ops == 0:
                dp[i][i][ops] = 1
            else:
                # We could have a single character after using some operations
                # But using ops on single character doesn't change it into a longer palindrome
                # So we set it to 1 as well (we can always have length 1)
                dp[i][i][ops] = 1

    # Fill DP table
    # We need to iterate by substring length to ensure subproblems are solved
    for length in range(2, n + 1):  # length of substring
        for i in range(n - length + 1):
            j = i + length - 1

            for ops in range(k + 1):
                # Option 1: Skip s[i]
                if dp[i+1][j][ops] != -1:
                    dp[i][j][ops] = max(dp[i][j][ops], dp[i+1][j][ops])

                # Option 2: Skip s[j]
                if dp[i][j-1][ops] != -1:
                    dp[i][j][ops] = max(dp[i][j][ops], dp[i][j-1][ops])

                # Option 3: Take both s[i] and s[j]
                cost = char_cost(s[i], s[j])
                if cost <= ops:
                    # We need to check if the inner substring can be formed with remaining ops
                    if i + 1 <= j - 1:  # There's an inner substring
                        if dp[i+1][j-1][ops - cost] != -1:
                            dp[i][j][ops] = max(dp[i][j][ops], 2 + dp[i+1][j-1][ops - cost])
                    else:  # No inner substring (i+1 > j-1), so we're just taking these two characters
                        dp[i][j][ops] = max(dp[i][j][ops], 2)

    # Find the maximum length achievable with ≤ k operations
    result = 0
    for ops in range(k + 1):
        if dp[0][n-1][ops] != -1:
            result = max(result, dp[0][n-1][ops])

    return result
```

```javascript
// Time: O(n^2 * k) where n = s.length
// Space: O(n^2 * k) for the DP table
function longestPalindromicSubsequence(s, k) {
  const n = s.length;

  // Helper function to compute cost between two characters
  function charCost(c1, c2) {
    if (c1 === c2) return 0;
    const a = c1.charCodeAt(0) - "a".charCodeAt(0);
    const b = c2.charCodeAt(0) - "a".charCodeAt(0);
    const direct = Math.abs(a - b);
    const wrap = 26 - direct;
    return Math.min(direct, wrap);
  }

  // Initialize 3D DP table with -1 (unreachable)
  // dp[i][j][ops] = max length palindrome in s[i..j] using exactly ops operations
  const dp = new Array(n);
  for (let i = 0; i < n; i++) {
    dp[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      dp[i][j] = new Array(k + 1).fill(-1);
    }
  }

  // Base case: single characters
  for (let i = 0; i < n; i++) {
    for (let ops = 0; ops <= k; ops++) {
      // Single character is always palindrome
      // We set it to 1 regardless of ops since we can always have length 1
      dp[i][i][ops] = 1;
    }
  }

  // Fill DP table by increasing substring length
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;

      for (let ops = 0; ops <= k; ops++) {
        // Option 1: Skip the left character
        if (i + 1 < n && dp[i + 1][j][ops] !== -1) {
          dp[i][j][ops] = Math.max(dp[i][j][ops], dp[i + 1][j][ops]);
        }

        // Option 2: Skip the right character
        if (j - 1 >= 0 && dp[i][j - 1][ops] !== -1) {
          dp[i][j][ops] = Math.max(dp[i][j][ops], dp[i][j - 1][ops]);
        }

        // Option 3: Take both characters
        const cost = charCost(s[i], s[j]);
        if (cost <= ops) {
          if (i + 1 <= j - 1) {
            // Has inner substring
            if (dp[i + 1][j - 1][ops - cost] !== -1) {
              dp[i][j][ops] = Math.max(dp[i][j][ops], 2 + dp[i + 1][j - 1][ops - cost]);
            }
          } else {
            // No inner substring (adjacent or same characters)
            dp[i][j][ops] = Math.max(dp[i][j][ops], 2);
          }
        }
      }
    }
  }

  // Find maximum length achievable with ≤ k operations
  let result = 0;
  for (let ops = 0; ops <= k; ops++) {
    if (dp[0][n - 1][ops] !== -1) {
      result = Math.max(result, dp[0][n - 1][ops]);
    }
  }

  return result;
}
```

```java
// Time: O(n^2 * k) where n = s.length()
// Space: O(n^2 * k) for the DP table
class Solution {
    public int longestPalindromicSubsequence(String s, int k) {
        int n = s.length();

        // Helper function to compute cost between two characters
        // cost = minimum operations to make c1 and c2 equal
        int charCost(char c1, char c2) {
            if (c1 == c2) return 0;
            int a = c1 - 'a';
            int b = c2 - 'a';
            int direct = Math.abs(a - b);
            int wrap = 26 - direct;
            return Math.min(direct, wrap);
        }

        // DP table: dp[i][j][ops] = max length palindrome in s[i..j] using exactly ops operations
        // -1 indicates unreachable state
        int[][][] dp = new int[n][n][k + 1];

        // Initialize with -1
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                Arrays.fill(dp[i][j], -1);
            }
        }

        // Base case: single characters
        for (int i = 0; i < n; i++) {
            for (int ops = 0; ops <= k; ops++) {
                // Single character is always a palindrome of length 1
                dp[i][i][ops] = 1;
            }
        }

        // Fill DP table by increasing substring length
        for (int length = 2; length <= n; length++) {
            for (int i = 0; i <= n - length; i++) {
                int j = i + length - 1;

                for (int ops = 0; ops <= k; ops++) {
                    // Option 1: Skip s[i]
                    if (i + 1 < n && dp[i + 1][j][ops] != -1) {
                        dp[i][j][ops] = Math.max(dp[i][j][ops], dp[i + 1][j][ops]);
                    }

                    // Option 2: Skip s[j]
                    if (j - 1 >= 0 && dp[i][j - 1][ops] != -1) {
                        dp[i][j][ops] = Math.max(dp[i][j][ops], dp[i][j - 1][ops]);
                    }

                    // Option 3: Take both s[i] and s[j]
                    int cost = charCost(s.charAt(i), s.charAt(j));
                    if (cost <= ops) {
                        if (i + 1 <= j - 1) {
                            // Has inner substring
                            if (dp[i + 1][j - 1][ops - cost] != -1) {
                                dp[i][j][ops] = Math.max(dp[i][j][ops], 2 + dp[i + 1][j - 1][ops - cost]);
                            }
                        } else {
                            // No inner substring
                            dp[i][j][ops] = Math.max(dp[i][j][ops], 2);
                        }
                    }
                }
            }
        }

        // Find maximum length achievable with ≤ k operations
        int result = 0;
        for (int ops = 0; ops <= k; ops++) {
            if (dp[0][n - 1][ops] != -1) {
                result = Math.max(result, dp[0][n - 1][ops]);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² × k)

- We have O(n²) substrings (i from 0 to n-1, j from i to n-1)
- For each substring, we iterate over k+1 possible operation counts
- Each state computation takes O(1) time (just a few max operations)
- Total: O(n² × k)

**Space Complexity:** O(n² × k)

- The 3D DP table has dimensions n × n × (k+1)
- In practice, we could optimize to O(n × k) by only storing two rows at a time since we iterate by length, but the code is clearer with the full table

## Common Mistakes

1. **Forgetting about wrap-around in character operations**: The alphabet wraps ('a' comes after 'z'), so the distance between 'a' and 'z' is 1, not 25. Always compute `min(direct_distance, 26 - direct_distance)`.

2. **Incorrect DP state definition**: Some candidates try to track only the maximum length without tracking operations, then check feasibility separately. This doesn't work because the same substring might be formable with different operation counts yielding different lengths.

3. **Wrong iteration order**: The DP must be filled by increasing substring length, not simply by i and j. We need to ensure that when computing `dp[i][j]`, the subproblems `dp[i+1][j]`, `dp[i][j-1]`, and `dp[i+1][j-1]` are already computed.

4. **Not handling the empty inner substring case**: When `i+1 > j-1` (characters are adjacent or the same), there's no inner substring. We need to handle this as a base case with length 2, not try to access `dp[i+1][j-1]`.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Longest Palindromic Subsequence (LPS)**: The core DP structure is identical to LeetCode 516 "Longest Palindromic Subsequence". If you understand that problem, this is an extension with an additional constraint.

2. **DP with resource constraints**: Similar to knapsack problems where you have a budget (operations) and need to maximize value (palindrome length). Other problems using this pattern:
   - LeetCode 474 "Ones and Zeroes": Maximize subset size with constraints on 0s and 1s
   - LeetCode 879 "Profitable Schemes": Count schemes with profit and member constraints
   - LeetCode 1049 "Last Stone Weight II": Partition array to minimize difference (similar to knapsack)

3. **Edit distance variations**: The character operation cost is similar to edit distance problems, but with a circular alphabet.

## Key Takeaways

1. **When you see "longest subsequence" + "constraints", think DP with additional dimensions**: The standard LPS DP becomes `dp[i][j]`. When you add operation constraints, it becomes `dp[i][j][ops]`.

2. **Precompute transformation costs**: When operations have well-defined costs between elements, precompute them to simplify the DP transitions.

3. **Circular distances need special handling**: For wrap-around alphabets or circular arrays, the distance between two points is `min(direct, total - direct)`.

4. **Always verify your iteration order**: For interval DP, filling by increasing length ensures subproblems are solved before larger problems.

[Practice this problem on CodeJeet](/problem/longest-palindromic-subsequence-after-at-most-k-operations)
