---
title: "How to Solve Number of Ways to Form a Target String Given a Dictionary — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Ways to Form a Target String Given a Dictionary. Hard difficulty, 56.6% acceptance rate. Topics: Array, String, Dynamic Programming."
date: "2026-12-04"
category: "dsa-patterns"
tags:
  [
    "number-of-ways-to-form-a-target-string-given-a-dictionary",
    "array",
    "string",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve "Number of Ways to Form a Target String Given a Dictionary"

This problem asks: given a list of words (all same length) and a target string, count how many ways we can build the target by selecting characters from specific positions across all words. The twist is that we must build the target left-to-right, and for each character we pick, we can only use words that haven't been "used" at that position yet. This creates a combinatorial problem where the order matters, making it tricky to count efficiently without double-counting or missing valid sequences.

What makes this interesting is that it looks like a simple counting problem at first, but the exponential number of possible sequences makes brute force impossible. The key insight is recognizing that we don't care which specific words we use—only how many words have each character at each position.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
words = ["acca", "bbbb", "caca"]
target = "aba"
```

All words have length 4. We need to form "a" then "b" then "a".

**Step 1: Count characters at each position**

First, let's count how many of each character appear at each column position:

```
Position 0: a:1 (from "acca"), b:1 (from "bbbb"), c:1 (from "caca")
Position 1: a:0, b:1 (from "bbbb"), c:2 (from "acca" and "caca")
Position 2: a:0, b:1 (from "bbbb"), c:2 (from "acca" and "caca")
Position 3: a:2 (from "acca" and "caca"), b:1 (from "bbbb"), c:0
```

**Step 2: Build target sequentially**

We need to pick:

1. First 'a' from some position ≥ 0
2. Then 'b' from some position > the first position
3. Then 'a' from some position > the second position

Let's enumerate some valid sequences:

- Pick 'a' from position 0 (using "acca"), then 'b' from position 1 (using "bbbb"), then 'a' from position 3 (using "acca" or "caca")
- Pick 'a' from position 0 (using "acca"), then 'b' from position 2 (using "bbbb"), then 'a' from position 3 (using "acca" or "caca")
- Pick 'a' from position 3 (using "acca" or "caca") - wait, this can't work because we need to pick 'b' from a later position, but position 3 is the last position!

Notice the constraint: once we pick a character from position `p`, all future characters must come from positions `> p`. This creates a natural ordering that suggests dynamic programming.

**Step 3: Dynamic programming thinking**

Let `dp[i][j]` = number of ways to build first `i` characters of target using positions up to `j` in the words.

For our example:

- To build "a" (i=1):
  - Using position 0: 1 way (1 'a' at position 0)
  - Using position 1: 0 ways (no 'a' at position 1)
  - Using position 2: 0 ways (no 'a' at position 2)
  - Using position 3: 2 ways (2 'a's at position 3)

- To build "ab" (i=2):
  - We need 'b' after picking 'a' from some earlier position
  - If we picked 'a' from position 0, we can pick 'b' from positions 1, 2, or 3
  - Count 'b's at those positions and multiply by ways to get 'a' at position 0

This recursive counting leads us to the DP solution.

## Brute Force Approach

A naive approach would try all possible sequences:

1. For each character in target, try all words and all positions
2. Ensure positions are strictly increasing
3. Count all valid sequences

The brute force would involve exploring all combinations of:

- Which word to use for each target character
- Which position to take from that word

This leads to `O((n * m)^k)` complexity where:

- `n` = number of words
- `m` = length of each word
- `k` = length of target

For typical constraints (n=1000, m=1000, k=1000), this is astronomically large (~10^3000 operations).

Even the smarter brute force of trying all increasing position sequences has complexity `O(C(m, k) * n^k)`, which is still exponential.

The problem with brute force is it doesn't leverage the fact that:

1. We only care about counts of characters at each position, not which specific words
2. Many sequences share the same prefix and can be computed once

## Optimized Approach

The key insight is **dynamic programming with prefix sums**.

**Step 1: Preprocess character counts**
Instead of tracking individual words, count how many times each character appears at each column position across all words. This reduces the problem from `n` words to just 26 possible characters per position.

**Step 2: Define the DP state**
Let `dp[i][j]` = number of ways to build the first `i` characters of target using the first `j` columns (positions) of the words.

**Step 3: Transition logic**
For each state `(i, j)`, we have two choices:

1. Don't use column `j` for character `i`: `dp[i][j-1]`
2. Use column `j` for character `i`: `dp[i-1][j-1] * count[target[i-1]][j-1]`

Wait, why `j-1`? Because if we use column `j` for character `i`, then character `i-1` must come from some column `< j`.

**Step 4: Optimization with 1D DP**
We can reduce space from `O(k*m)` to `O(m)` by noticing we only need the previous row of the DP table.

**Step 5: Handle modulo**
Since the answer can be huge, we need to return it modulo `10^9 + 7`.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m * k + n * m) where n=len(words), m=len(words[0]), k=len(target)
# Space: O(m * 26 + m) = O(m)
def numWays(words, target):
    MOD = 10**9 + 7
    n = len(words)
    m = len(words[0])
    k = len(target)

    # Step 1: Count character frequencies at each position
    # count[char_index][position] = how many times char appears at this position
    # We use 26 for lowercase English letters
    count = [[0] * m for _ in range(26)]

    # For each word, count characters at each position
    for word in words:
        for j in range(m):
            char_idx = ord(word[j]) - ord('a')
            count[char_idx][j] += 1

    # Step 2: Initialize DP array
    # dp[j] = number of ways to build current prefix of target using first j columns
    # We'll iterate through target characters and update dp
    dp = [0] * (m + 1)

    # Base case: empty target can be formed in 1 way using any number of columns
    for j in range(m + 1):
        dp[j] = 1

    # Step 3: Build target character by character
    for i in range(1, k + 1):
        # new_dp[j] will store ways to build first i characters using first j columns
        new_dp = [0] * (m + 1)

        # We need at least i columns to build i characters (since positions must increase)
        for j in range(i, m + 1):
            # Option 1: Don't use column j-1 for character i-1
            # Carry over ways from using only first j-1 columns
            ways_without = new_dp[j-1]

            # Option 2: Use column j-1 for character i-1
            # We need character target[i-1] at position j-1
            char_idx = ord(target[i-1]) - ord('a')
            char_count = count[char_idx][j-1]

            # If we use this column, previous i-1 characters must come from first j-1 columns
            ways_with = dp[j-1] * char_count

            # Total ways = don't use this column + use this column
            new_dp[j] = (ways_without + ways_with) % MOD

        # Update dp for next character
        dp = new_dp

    # dp[m] = ways to build all k characters using all m columns
    return dp[m] % MOD
```

```javascript
// Time: O(m * k + n * m) where n=words.length, m=words[0].length, k=target.length
// Space: O(m * 26 + m) = O(m)
function numWays(words, target) {
  const MOD = 1_000_000_007;
  const n = words.length;
  const m = words[0].length;
  const k = target.length;

  // Step 1: Count character frequencies at each position
  // count[charIndex][position] = how many times char appears at this position
  const count = Array.from({ length: 26 }, () => new Array(m).fill(0));

  // For each word, count characters at each position
  for (const word of words) {
    for (let j = 0; j < m; j++) {
      const charIdx = word.charCodeAt(j) - "a".charCodeAt(0);
      count[charIdx][j]++;
    }
  }

  // Step 2: Initialize DP array
  // dp[j] = number of ways to build current prefix of target using first j columns
  let dp = new Array(m + 1).fill(1); // Base case: empty target

  // Step 3: Build target character by character
  for (let i = 1; i <= k; i++) {
    // newDp[j] will store ways to build first i characters using first j columns
    const newDp = new Array(m + 1).fill(0);

    // We need at least i columns to build i characters
    for (let j = i; j <= m; j++) {
      // Option 1: Don't use column j-1 for character i-1
      const waysWithout = newDp[j - 1];

      // Option 2: Use column j-1 for character i-1
      const charIdx = target.charCodeAt(i - 1) - "a".charCodeAt(0);
      const charCount = count[charIdx][j - 1];

      // If we use this column, previous i-1 characters must come from first j-1 columns
      const waysWith = dp[j - 1] * charCount;

      // Total ways = don't use this column + use this column
      newDp[j] = (waysWithout + waysWith) % MOD;
    }

    // Update dp for next character
    dp = newDp;
  }

  // dp[m] = ways to build all k characters using all m columns
  return dp[m] % MOD;
}
```

```java
// Time: O(m * k + n * m) where n=words.length, m=words[0].length(), k=target.length()
// Space: O(m * 26 + m) = O(m)
class Solution {
    public int numWays(String[] words, String target) {
        final int MOD = 1_000_000_007;
        int n = words.length;
        int m = words[0].length();
        int k = target.length();

        // Step 1: Count character frequencies at each position
        // count[charIndex][position] = how many times char appears at this position
        int[][] count = new int[26][m];

        // For each word, count characters at each position
        for (String word : words) {
            for (int j = 0; j < m; j++) {
                int charIdx = word.charAt(j) - 'a';
                count[charIdx][j]++;
            }
        }

        // Step 2: Initialize DP array
        // dp[j] = number of ways to build current prefix of target using first j columns
        long[] dp = new long[m + 1];

        // Base case: empty target can be formed in 1 way using any number of columns
        for (int j = 0; j <= m; j++) {
            dp[j] = 1;
        }

        // Step 3: Build target character by character
        for (int i = 1; i <= k; i++) {
            // newDp[j] will store ways to build first i characters using first j columns
            long[] newDp = new long[m + 1];

            // We need at least i columns to build i characters
            for (int j = i; j <= m; j++) {
                // Option 1: Don't use column j-1 for character i-1
                long waysWithout = newDp[j - 1];

                // Option 2: Use column j-1 for character i-1
                int charIdx = target.charAt(i - 1) - 'a';
                int charCount = count[charIdx][j - 1];

                // If we use this column, previous i-1 characters must come from first j-1 columns
                long waysWith = dp[j - 1] * charCount;

                // Total ways = don't use this column + use this column
                newDp[j] = (waysWithout + waysWith) % MOD;
            }

            // Update dp for next character
            dp = newDp;
        }

        // dp[m] = ways to build all k characters using all m columns
        return (int)(dp[m] % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Preprocessing: `O(n * m)` to count characters across all words at all positions
- DP computation: `O(m * k)` where we iterate through `k` target characters and `m` columns
- Total: `O(n * m + m * k)`

**Space Complexity:**

- `count` array: `O(26 * m) = O(m)` for character counts per position
- DP arrays: `O(m)` for current and previous rows
- Total: `O(m)`

The space optimization from 2D DP to 1D DP is crucial here. With `m` up to 1000 and `k` up to 1000, a 2D table would require 1M entries, while our 1D solution only needs ~1000 entries.

## Common Mistakes

1. **Forgetting the modulo operation**: The number of ways can be enormous (exponential in `k`), so we must take results modulo `10^9+7` at every addition and multiplication, not just at the end.

2. **Incorrect DP state definition**: A common mistake is defining `dp[i][j]` as ways to build first `i` characters using exactly `j` columns. This makes the transition logic more complex. Our definition (using first `j` columns) is cleaner.

3. **Off-by-one errors with indices**: The conversion between 1-indexed DP dimensions and 0-indexed string positions is tricky. Remember:
   - `dp[i][j]` deals with first `i` characters (i=0 means empty string)
   - Character `target[i-1]` corresponds to the `i`-th character
   - Column `j-1` corresponds to the `j`-th column in 0-indexing

4. **Not handling the "don't use this column" case**: Some solutions only consider using the current column, forgetting that we can skip columns. This undercounts valid sequences.

## When You'll See This Pattern

This problem combines several important patterns:

1. **DP on two sequences**: Similar to "Distinct Subsequences" (LeetCode 115), where we count how many ways one string appears as a subsequence of another. Both problems use DP with states `(i, j)` representing prefixes.

2. **DP with prefix sums optimization**: Like "Number of Subsequences That Satisfy the Given Sum Condition" (LeetCode 1498), where we optimize 2D DP to 1D by noticing we only need the previous row.

3. **Counting problems with combinatorial constraints**: Similar to "Number of Music Playlists" (LeetCode 920), where we count valid sequences subject to ordering constraints.

The core pattern is: when you need to count valid sequences/combinations with ordering constraints and the naive approach is exponential, think about DP where the state represents how much of each sequence you've used.

## Key Takeaways

1. **Aggregate identical states**: When multiple choices lead to the same future state (like which specific word gives a character), count them upfront rather than enumerating individually.

2. **DP state compression**: If your DP transition only depends on the previous row/column, you can often reduce space from 2D to 1D.

3. **Position-based vs word-based thinking**: In problems with multiple identical resources (words), think in terms of what's available at each position rather than tracking individual resources.

Remember: the hardest part of this problem is recognizing that we don't need to track which specific words we use, only how many of each character are available at each position. Once you make that leap, the DP formulation becomes much clearer.

[Practice this problem on CodeJeet](/problem/number-of-ways-to-form-a-target-string-given-a-dictionary)
