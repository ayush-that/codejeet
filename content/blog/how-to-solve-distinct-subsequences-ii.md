---
title: "How to Solve Distinct Subsequences II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Distinct Subsequences II. Hard difficulty, 44.0% acceptance rate. Topics: String, Dynamic Programming."
date: "2028-07-19"
category: "dsa-patterns"
tags: ["distinct-subsequences-ii", "string", "dynamic-programming", "hard"]
---

# How to Solve Distinct Subsequences II

This problem asks us to count all distinct non-empty subsequences of a given string `s`. A subsequence is formed by deleting zero or more characters from the original string while maintaining the relative order of the remaining characters. The challenge comes from two factors: we must count only **distinct** subsequences (avoiding duplicates), and the answer can be enormous, requiring modulo arithmetic. The brute force approach of generating all subsequences would be exponential, so we need a smarter dynamic programming solution.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `s = "aba"`. We'll build up subsequences step by step:

**Step 1:** Start with empty string `""` (we'll exclude this from final count)

- Current distinct subsequences: `{""}`

**Step 2:** Process first character `'a'`

- We can either add `'a'` to all existing subsequences or not
- New subsequences: `"" + "a" = "a"`
- All distinct subsequences: `{"", "a"}`

**Step 3:** Process second character `'b'`

- Add `'b'` to all existing subsequences: `"" + "b" = "b"`, `"a" + "b" = "ab"`
- All distinct subsequences: `{"", "a", "b", "ab"}`

**Step 4:** Process third character `'a'` (here's where it gets interesting)

- Add `'a'` to all existing subsequences:
  - `"" + "a" = "a"` (duplicate!)
  - `"a" + "a" = "aa"` (new)
  - `"b" + "a" = "ba"` (new)
  - `"ab" + "a" = "aba"` (new)
- But wait, `"a"` already exists! We shouldn't double-count it.

The key insight: when we encounter a character we've seen before, we need to subtract the subsequences that would be duplicated. In this case, the last time we saw `'a'` was at position 0, and at that time we had 2 subsequences (`""` and `"a"`). Adding `'a'` to these would create duplicates.

So the formula becomes:

- For new character: `new_count = 2 * current_count`
- For character seen before: `new_count = 2 * current_count - count_when_last_seen`

For `"aba"`:

- After `'a'`: count = 2 (`""`, `"a"`)
- After `'b'`: count = 4 (`""`, `"a"`, `"b"`, `"ab"`)
- After second `'a'`: count = 2×4 - 2 = 6 (excluding `""`, that's 5 distinct non-empty subsequences)

Let's verify: `{"a", "b", "ab", "aa", "ba", "aba"}` = 6 distinct non-empty subsequences.

## Brute Force Approach

The most straightforward approach would be to generate all possible subsequences using recursion or bit manipulation, store them in a set to eliminate duplicates, and count them. For a string of length `n`, there are `2^n` possible subsequences (including the empty one).

```python
def distinctSubseqII_brute(s):
    result = set()
    n = len(s)

    # Generate all subsequences using bitmask
    for mask in range(1, 1 << n):  # Start from 1 to exclude empty string
        subsequence = []
        for i in range(n):
            if mask & (1 << i):
                subsequence.append(s[i])
        result.add(''.join(subsequence))

    return len(result) % (10**9 + 7)
```

**Why this fails:**

- Time complexity: O(n × 2^n) - For a string of length 30, that's over 30 billion operations
- Space complexity: O(2^n) - Storing all subsequences quickly becomes impossible
- The problem constraints typically expect solutions for strings up to length 2000, making the brute force completely infeasible

## Optimized Approach

The key insight is that we can count distinct subsequences dynamically without explicitly generating them. Let's think recursively:

Let `dp[i]` = number of distinct subsequences using the first `i` characters of `s`.

When we add character `s[i-1]` (0-indexed):

1. We can either include this character in all existing subsequences
2. Or not include it

So initially, it seems like `dp[i] = 2 × dp[i-1]`. But this counts duplicates!

Consider what happens when we've seen `s[i-1]` before at some position `j`:

- The subsequences that end with `s[i-1]` at position `j` would be created again
- These duplicates come from taking all subsequences that existed before position `j`, and appending `s[i-1]`

Thus, we need to subtract `dp[last[s[i-1]]]` where `last[c]` stores the dp value when character `c` was last seen.

The recurrence becomes:

- `dp[i] = 2 × dp[i-1] - dp[last[s[i-1]]]` if `s[i-1]` was seen before
- `dp[i] = 2 × dp[i-1]` otherwise

We initialize `dp[0] = 1` for the empty subsequence, and subtract 1 at the end.

## Optimal Solution

Here's the complete solution using dynamic programming with O(n) time and O(1) extra space (since we only need to track 26 letters):

<div class="code-group">

```python
# Time: O(n) where n is length of s
# Space: O(1) since we store only 26 characters' last counts
def distinctSubseqII(s: str) -> int:
    MOD = 10**9 + 7
    n = len(s)

    # dp[i] represents number of distinct subsequences using first i characters
    # We only need the previous value, so we can use a single variable
    dp = 1  # Start with 1 for empty subsequence

    # Track the last dp value when each character was seen
    # Initialize to 0 since characters haven't been seen yet
    last_occurrence = [0] * 26

    for char in s:
        # Convert character to index 0-25
        idx = ord(char) - ord('a')

        # The number of new subsequences ending with current character
        # is dp (all previous subsequences) minus those that already ended
        # with this character before
        duplicates = last_occurrence[idx]

        # New count = 2 * old count - duplicates
        # We use MOD to prevent overflow
        new_dp = (2 * dp - duplicates) % MOD

        # Update last occurrence for this character
        last_occurrence[idx] = dp

        # Update dp for next iteration
        dp = new_dp

    # Subtract 1 to exclude the empty subsequence
    # Add MOD before modulo to handle negative results
    return (dp - 1) % MOD
```

```javascript
// Time: O(n) where n is length of s
// Space: O(1) since we store only 26 characters' last counts
function distinctSubseqII(s) {
  const MOD = 1000000007;
  const n = s.length;

  // dp represents number of distinct subsequences using processed characters
  let dp = 1; // Start with 1 for empty subsequence

  // Track the last dp value when each character was seen
  // Initialize to 0 since characters haven't been seen yet
  const lastOccurrence = new Array(26).fill(0);

  for (let i = 0; i < n; i++) {
    const char = s[i];
    // Convert character to index 0-25
    const idx = char.charCodeAt(0) - "a".charCodeAt(0);

    // The number of new subsequences ending with current character
    // is dp (all previous subsequences) minus those that already ended
    // with this character before
    const duplicates = lastOccurrence[idx];

    // New count = 2 * old count - duplicates
    // We use MOD to prevent overflow
    let newDp = (2 * dp - duplicates) % MOD;

    // Handle negative result by adding MOD
    if (newDp < 0) newDp += MOD;

    // Update last occurrence for this character
    lastOccurrence[idx] = dp;

    // Update dp for next iteration
    dp = newDp;
  }

  // Subtract 1 to exclude the empty subsequence
  return (dp - 1 + MOD) % MOD;
}
```

```java
// Time: O(n) where n is length of s
// Space: O(1) since we store only 26 characters' last counts
class Solution {
    public int distinctSubseqII(String s) {
        final int MOD = 1000000007;
        int n = s.length();

        // dp represents number of distinct subsequences using processed characters
        long dp = 1; // Use long to prevent overflow before modulo

        // Track the last dp value when each character was seen
        // Initialize to 0 since characters haven't been seen yet
        long[] lastOccurrence = new long[26];

        for (int i = 0; i < n; i++) {
            char c = s.charAt(i);
            int idx = c - 'a';

            // The number of new subsequences ending with current character
            // is dp (all previous subsequences) minus those that already ended
            // with this character before
            long duplicates = lastOccurrence[idx];

            // New count = 2 * old count - duplicates
            long newDp = (2 * dp - duplicates) % MOD;

            // Handle negative result by adding MOD
            if (newDp < 0) newDp += MOD;

            // Update last occurrence for this character
            lastOccurrence[idx] = dp;

            // Update dp for next iteration
            dp = newDp;
        }

        // Subtract 1 to exclude the empty subsequence
        return (int)((dp - 1 + MOD) % MOD);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the string once, performing constant-time operations for each character
- The operations include: character index calculation, array lookup, arithmetic operations, and assignment

**Space Complexity:** O(1)

- We use a fixed-size array of 26 elements to track last occurrences of each character
- This is constant regardless of input size
- We only store a few additional variables (dp, MOD constant, loop counters)

## Common Mistakes

1. **Forgetting to handle negative modulo results**: When we subtract duplicates, the result can be negative. In many languages, `-1 % MOD` gives a negative result. Always add MOD before taking modulo when dealing with subtractions.

2. **Incorrect initialization of last_occurrence**: Some candidates initialize with -1 or other values. We need to initialize to 0 because when a character hasn't been seen before, there are no duplicates to subtract.

3. **Off-by-one with empty subsequence**: Remember to subtract 1 at the end to exclude the empty subsequence. The problem asks for non-empty subsequences.

4. **Using integer overflow**: The counts grow exponentially, so even for moderate string lengths, the numbers exceed 64-bit integer limits. Always apply modulo operations during calculations, not just at the end.

## When You'll See This Pattern

This dynamic programming pattern with deduplication appears in several counting problems:

1. **Number of Unique Good Subsequences (LeetCode 1987)**: This is essentially the same problem but with binary strings and additional constraints. The core deduplication logic is identical.

2. **Count Different Palindromic Subsequences (LeetCode 730)**: While more complex, it uses similar deduplication logic when counting palindromic subsequences.

3. **Distinct Subsequences (LeetCode 115)**: This counts how many times a subsequence appears rather than counting distinct subsequences, but the DP approach has similarities.

The key pattern to recognize: when counting sequences/subsequences/combinations where order matters and duplicates must be avoided, track the last occurrence of each element to subtract duplicate counts.

## Key Takeaways

1. **Dynamic programming with deduplication**: When counting distinct sequences, use a recurrence that subtracts counts from previous occurrences of the same element to avoid duplicates.

2. **Modulo arithmetic with subtraction**: Always handle negative results by adding MOD before taking modulo when performing subtraction in modular arithmetic.

3. **Space optimization**: Often, DP problems that seem to require O(n) space can be optimized to O(1) by recognizing that we only need information from the previous step and from specific historical points (like last occurrences).

Related problems: [Number of Unique Good Subsequences](/problem/number-of-unique-good-subsequences), [Count K-Subsequences of a String With Maximum Beauty](/problem/count-k-subsequences-of-a-string-with-maximum-beauty)
