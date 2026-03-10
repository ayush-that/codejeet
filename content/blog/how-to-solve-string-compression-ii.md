---
title: "How to Solve String Compression II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode String Compression II. Hard difficulty, 52.2% acceptance rate. Topics: String, Dynamic Programming."
date: "2027-05-10"
category: "dsa-patterns"
tags: ["string-compression-ii", "string", "dynamic-programming", "hard"]
---

# How to Solve String Compression II

String Compression II is a challenging dynamic programming problem where you need to compress a string by removing characters to minimize the compressed length. Unlike basic run-length encoding, you can delete characters strategically to achieve better compression. The tricky part is that removing characters can merge adjacent runs, potentially creating longer compressible sequences that save more space.

## Visual Walkthrough

Let's walk through a small example: `s = "aaabcccd"`, `k = 2` (we can remove at most 2 characters).

Our goal is to minimize the compressed length. The compression rules:

- Single characters stay as is: `"a"` → `"a"`
- Runs of length `n` become: `"a" + str(n)` if `n > 1`

Let's explore what happens if we remove different characters:

**Option 1: Remove two 'c's from "ccc"**

- Original: `"aaa" + "b" + "ccc" + "d"` → `"a3b1c3d1"` (length 6)
- After removing two 'c's: `"aaa" + "b" + "c" + "d"` → `"a3b1c1d1"` (length 6)
- No improvement! The 'c' run became length 1, which doesn't compress.

**Option 2: Remove 'b' and one 'c'**

- After removal: `"aaa" + "cc" + "d"` → `"a3c2d1"` (length 5)
- Better! We merged 'aaa' and 'b'? Wait, 'b' was between them, so removing 'b' doesn't merge 'aaa' and 'ccc'.

**Option 3: Remove 'b' and 'd'**

- After removal: `"aaa" + "ccc"` → `"a3c3"` (length 4)
- Even better! We created two compressible runs.

**Option 4: Remove two from 'aaa' to merge with 'ccc'**

- Remove 2 'a's: `"a" + "b" + "ccc" + "d"` → `"a1b1c3d1"` (length 7) - worse!
- Actually, to merge 'a' and 'c', we need to remove ALL characters between them...

**The key insight**: Removing 'b' allows 'aaa' and 'ccc' to become adjacent, but they're different characters, so they won't merge. To merge runs, we need them to be the SAME character.

**Best option**: Remove 'b' and one 'c', then we have `"aaa" + "cc" + "d"` = `"a3c2d1"` (length 5).

But wait, let's check if we can do better by being smarter...

Actually, the optimal solution for this example is length 4: remove 'b' and 'd', leaving `"aaaccc"` which compresses to `"a3c3"`.

This shows why we need dynamic programming: we have to consider all possible removal combinations to find the minimum compressed length.

## Brute Force Approach

A brute force approach would try all possible combinations of removing exactly `k` characters from the string. For each combination:

1. Remove the selected characters
2. Compress the resulting string using run-length encoding
3. Track the minimum compressed length

The number of combinations is C(n, k) where n is the string length. For n=100 and k=50, this is astronomically large (about 1e29 combinations).

Even if we try all subsets of characters to remove (2^n possibilities), that's still 2^100 ≈ 1.3e30 operations - completely infeasible.

The brute force approach fails because:

1. Exponential time complexity
2. Redundant computations (many removal patterns lead to similar compressed strings)
3. No way to reuse computations for overlapping subproblems

## Optimized Approach

The key insight is that this is a dynamic programming problem. We need to track:

1. Current position in the string (index `i`)
2. How many removals we have left (`k`)
3. The current run we're building (character and count)

However, tracking the exact run state makes the state space too large. A better approach is to notice that when we compress, we only care about:

- The current character we're counting
- How many of that character we've seen consecutively

This leads to a DP state: `dp[i][k][c][cnt]` = minimum compressed length starting at position `i` with `k` removals left, where we're currently in a run of character `c` with current count `cnt`.

But this has 100 × 100 × 26 × 100 ≈ 26 million states, which might be acceptable but is complex to implement.

The optimal insight: Instead of tracking exact count, we can track the length of the encoded count:

- Count 1-9: adds 1 character (just the digit)
- Count 10-99: adds 2 characters
- Count 100: adds 3 characters

Also, we can use a cleaner DP definition: `dp[i][k]` = minimum compressed length for substring starting at `i` with `k` removals available.

But we need to know what character we're carrying from the left. So we add another parameter: `dp[i][k][prev_char][prev_count]`.

The breakthrough optimization: We don't need to store the exact `prev_count`, only its contribution to the encoded length! The contribution depends on whether adding one more to the count increases the encoded length.

So our DP becomes: `dp[i][k][c][cnt]` where `cnt` is limited to small values (since encoded length changes at 1, 9, 99).

## Optimal Solution

The cleanest solution uses DP with state `(index, k, last_char, last_count)` and memoization. We try two options at each step:

1. Delete the current character (if k > 0)
2. Keep the current character, which may extend the current run or start a new one

<div class="code-group">

```python
# Time: O(n * k * 26 * 10) ≈ O(26000n) | Space: O(n * k * 26 * 10)
class Solution:
    def getLengthOfOptimalCompression(self, s: str, k: int) -> int:
        n = len(s)

        # Memoization cache: dp[i][k][last_char_index][last_count]
        # last_char_index: 0-25 for 'a'-'z', 26 for no previous character
        # last_count: 1-10 (we only care up to 10 because beyond that,
        # adding more characters doesn't change encoded length until 100)
        from functools import lru_cache

        @lru_cache(None)
        def dp(i, k_rem, last_char, last_count):
            """
            Returns minimum compressed length starting from position i,
            with k_rem deletions remaining,
            where last_char is the previous character (0-25, or 26 for none),
            and last_count is the current run length of last_char.
            """
            # Base case: reached end of string
            if i == n:
                return 0

            # Option 1: Delete current character if we can
            best = float('inf')
            if k_rem > 0:
                best = min(best, dp(i + 1, k_rem - 1, last_char, last_count))

            # Option 2: Keep current character
            current_char = ord(s[i]) - ord('a')

            if current_char == last_char:
                # Same character as previous, extends the run
                # The additional length depends on whether last_count is 1, 9, or 99
                add_length = 0
                if last_count == 1 or last_count == 9 or last_count == 99:
                    # Adding this character increases encoded length
                    # 1->2: adds 1 (for the digit '2')
                    # 9->10: adds 1 (extra digit in '10')
                    # 99->100: adds 1 (extra digit in '100')
                    add_length = 1
                best = min(best, add_length + dp(i + 1, k_rem, current_char, last_count + 1))
            else:
                # Different character, starts a new run
                # Always adds 1 for the new character
                best = min(best, 1 + dp(i + 1, k_rem, current_char, 1))

            return best

        # Start with no previous character (26), count 0
        return dp(0, k, 26, 0)
```

```javascript
// Time: O(n * k * 27 * 101) | Space: O(n * k * 27 * 101)
/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var getLengthOfOptimalCompression = function (s, k) {
  const n = s.length;

  // Memoization cache: dp[i][k][lastChar][lastCount]
  // Use a 4D array or memo object
  const memo = new Map();

  // Helper function to create a memo key
  const getKey = (i, kRem, lastChar, lastCount) => {
    return `${i},${kRem},${lastChar},${lastCount}`;
  };

  const dp = (i, kRem, lastChar, lastCount) => {
    // Base case: end of string
    if (i === n) return 0;

    const key = getKey(i, kRem, lastChar, lastCount);
    if (memo.has(key)) return memo.get(key);

    let best = Infinity;

    // Option 1: Delete current character if possible
    if (kRem > 0) {
      best = Math.min(best, dp(i + 1, kRem - 1, lastChar, lastCount));
    }

    // Option 2: Keep current character
    const currentChar = s.charCodeAt(i) - 97; // 'a' = 0

    if (currentChar === lastChar) {
      // Same character, extends current run
      let addLength = 0;
      // Check if adding this character increases encoded length
      if (lastCount === 1 || lastCount === 9 || lastCount === 99) {
        addLength = 1; // Need an extra digit
      }
      best = Math.min(best, addLength + dp(i + 1, kRem, currentChar, lastCount + 1));
    } else {
      // Different character, starts new run
      // Always add 1 for the new character itself
      best = Math.min(best, 1 + dp(i + 1, kRem, currentChar, 1));
    }

    memo.set(key, best);
    return best;
  };

  // Start with lastChar = 26 (no previous character), lastCount = 0
  return dp(0, k, 26, 0);
};
```

```java
// Time: O(n * k * 27 * 101) | Space: O(n * k * 27 * 101)
class Solution {
    public int getLengthOfOptimalCompression(String s, int k) {
        int n = s.length();

        // Memoization array: dp[i][k][lastChar][lastCount]
        // lastChar: 0-25 for 'a'-'z', 26 for no previous character
        // lastCount: 0-100 (we cap at 100 since that's max meaningful count)
        Integer[][][][] memo = new Integer[n + 1][k + 1][27][101];

        return dp(0, k, 26, 0, s, memo);
    }

    private int dp(int i, int kRem, int lastChar, int lastCount, String s, Integer[][][][] memo) {
        // Base case: reached end of string
        if (i == s.length()) return 0;

        // Return cached result if available
        if (memo[i][kRem][lastChar][lastCount] != null) {
            return memo[i][kRem][lastChar][lastCount];
        }

        int best = Integer.MAX_VALUE;

        // Option 1: Delete current character if we have deletions left
        if (kRem > 0) {
            best = Math.min(best, dp(i + 1, kRem - 1, lastChar, lastCount, s, memo));
        }

        // Option 2: Keep current character
        int currentChar = s.charAt(i) - 'a';

        if (currentChar == lastChar) {
            // Same character as previous, extends the run
            int addLength = 0;
            // Check if adding this character increases the encoded length
            if (lastCount == 1 || lastCount == 9 || lastCount == 99) {
                addLength = 1; // Need an extra digit in the count
            }
            best = Math.min(best, addLength + dp(i + 1, kRem, currentChar, lastCount + 1, s, memo));
        } else {
            // Different character, starts a new run
            // Always add 1 for the new character
            best = Math.min(best, 1 + dp(i + 1, kRem, currentChar, 1, s, memo));
        }

        memo[i][kRem][lastChar][lastCount] = best;
        return best;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × k × 27 × 101) ≈ O(2727 × n × k)

- `n`: length of the string (up to 100)
- `k`: number of deletions allowed (up to 100)
- `27`: possible previous characters (26 letters + "none")
- `101`: possible previous counts (0 to 100, but practically limited)
- Each state computes 2 options (delete or keep)
- In practice, many states are unreachable, so it's faster than worst-case

**Space Complexity**: O(n × k × 27 × 101) for the memoization table

- Same factors as time complexity
- Can be optimized to O(k × 27 × 101) by only storing current and next rows, but the implementation is more complex

## Common Mistakes

1. **Trying greedy approaches**: Candidates often try to always delete the character that gives immediate benefit, but optimal deletion might require sacrificing short-term gains for long-term benefits (like merging large runs).

2. **Incorrect state representation**: Trying to use 2D DP `dp[i][k]` without tracking the current run state. This fails because the optimal decision depends on what character we're currently counting and how many we've seen.

3. **Not limiting the count in DP state**: Storing exact counts up to 100 makes the state space 100 times larger. The key insight is that we only care about counts at thresholds (1, 9, 99) where encoded length changes.

4. **Forgetting base cases**: Not handling the case when we reach the end of string correctly, or when `k` becomes negative.

5. **Integer overflow with large counts**: When counts exceed 9 or 99, the encoded length calculation changes. Need to handle the transition from 1-digit to 2-digit to 3-digit counts correctly.

## When You'll See This Pattern

This DP-with-state pattern appears in problems where:

1. Decisions have long-term consequences (deleting a character affects future compression)
2. The state depends on more than just position (need to track "context" from previous decisions)
3. There's a trade-off between immediate cost and future benefits

Similar LeetCode problems:

1. **Edit Distance (Hard)**: Also uses DP where state depends on positions in two strings, with operations (insert, delete, replace) having different costs.
2. **Regular Expression Matching (Hard)**: DP where state includes position in string and pattern, with '\*' having special meaning.
3. **Wildcard Matching (Hard)**: Similar to regex matching but with simpler pattern rules.
4. **Minimum Difficulty of a Job Schedule (Hard)**: DP where you partition array into d days, maximizing minimum daily difficulty.

## Key Takeaways

1. **When decisions have future consequences, think DP**: If choosing to delete/keep a character affects what happens later, it's likely a DP problem.

2. **The state must capture all relevant information**: For string compression, you need to know: current position, deletions left, current run character, and current run length (or its encoded contribution).

3. **Look for ways to limit state space**: We limited count to tracking only when it affects encoded length (at 1, 9, 99). This optimization is crucial for making the solution feasible.

4. **Try both options at each step**: In many DP problems, you need to consider multiple actions (delete or keep, include or exclude, etc.) and take the minimum/maximum.

Related problems: [String Compression III](/problem/string-compression-iii)
