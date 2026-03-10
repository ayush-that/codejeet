---
title: "How to Solve Count Vowels Permutation — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Vowels Permutation. Hard difficulty, 61.4% acceptance rate. Topics: Dynamic Programming."
date: "2026-03-25"
category: "dsa-patterns"
tags: ["count-vowels-permutation", "dynamic-programming", "hard"]
---

# How to Solve Count Vowels Permutation

This problem asks us to count how many strings of length `n` can be formed using only vowels ('a', 'e', 'i', 'o', 'u') where each vowel has specific rules about what can follow it. What makes this problem interesting is that while it appears to be about string generation, it's really a **dynamic programming counting problem** where the state depends on both the length and the last character used. The constraints make it impossible to brute force for large `n`, requiring an efficient DP approach.

## Visual Walkthrough

Let's trace through what happens with `n = 2` to build intuition:

**Rules recap:**

- 'a' → can only be followed by 'e'
- 'e' → can only be followed by 'a' or 'i'
- 'i' → can be followed by 'a', 'e', 'o', or 'u' (but NOT 'i')
- 'o' → can only be followed by 'i' or 'u'
- 'u' → can only be followed by 'a'

**Step-by-step for n = 2:**

1. **Starting with length 1 strings:** We have 5 possibilities: "a", "e", "i", "o", "u"

2. **Building length 2 strings:**
   - From "a": Can only add 'e' → "ae" (1 string)
   - From "e": Can add 'a' or 'i' → "ea", "ei" (2 strings)
   - From "i": Can add 'a', 'e', 'o', 'u' → "ia", "ie", "io", "iu" (4 strings)
   - From "o": Can add 'i' or 'u' → "oi", "ou" (2 strings)
   - From "u": Can only add 'a' → "ua" (1 string)

3. **Total for n = 2:** 1 + 2 + 4 + 2 + 1 = 10 strings

We can visualize this as a state machine where each vowel is a state, and we're counting paths of length `n` through this directed graph. For `n = 3`, we'd continue: from each length 2 string, we'd follow the rules to generate length 3 strings.

## Brute Force Approach

The most straightforward approach would be to generate all possible strings recursively:

1. Start with an empty string
2. At each step, add a vowel that's valid according to the last character
3. When the string reaches length `n`, increment our count
4. Explore all possibilities using recursion

**Why this fails:**
The problem is exponential! Each step has between 1-4 choices, leading to roughly O(5 × 4^(n-1)) possibilities. For `n = 10,000` (the upper bound in constraints), this is astronomically large. Even memoization won't help enough because we'd need to store every possible string, which is still exponential.

The key insight is that we don't need to track the entire string - we only need to know:

1. How many strings we've built so far (the length)
2. What the last character was

This reduces our state space dramatically.

## Optimized Approach

The optimal solution uses **dynamic programming** with the following insight:

Let `dp[length][vowel]` = number of strings of length `length` ending with `vowel`

**Transition rules** (based on the problem statement):

- Strings ending with 'a' can only come from strings ending with 'e', 'i', or 'u'
- Strings ending with 'e' can only come from strings ending with 'a' or 'i'
- Strings ending with 'i' can only come from strings ending with 'e' or 'o'
- Strings ending with 'o' can only come from strings ending with 'i'
- Strings ending with 'u' can only come from strings ending with 'i' or 'o'

Wait, let's double-check these transitions by reading the rules carefully:

- 'a' may only be followed by 'e' → So 'a' can only come after vowels that can be followed by 'a'
- Looking at the rules: 'e' can be followed by 'a', 'i' can be followed by 'a', 'u' can be followed by 'a'
- So 'a' comes from 'e', 'i', 'u' ✓

Similarly:

- 'e' comes from 'a' (a→e) and 'i' (i→e) ✓
- 'i' comes from 'e' (e→i) and 'o' (o→i) ✓
- 'o' comes from 'i' (i→o) ✓
- 'u' comes from 'i' (i→u) and 'o' (o→u) ✓

**Base case:** For length 1, `dp[1][vowel] = 1` for each vowel (5 total)

**Recurrence relation:**

```
dp[len][a] = dp[len-1][e] + dp[len-1][i] + dp[len-1][u]
dp[len][e] = dp[len-1][a] + dp[len-1][i]
dp[len][i] = dp[len-1][e] + dp[len-1][o]
dp[len][o] = dp[len-1][i]
dp[len][u] = dp[len-1][i] + dp[len-1][o]
```

**Answer:** Sum of `dp[n][vowel]` for all vowels, modulo 10^9+7

We can optimize space by only keeping the previous row since we only need `dp[len-1]` to compute `dp[len]`.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - we only store 2 rows of 5 values each
def countVowelPermutation(n: int) -> int:
    MOD = 10**9 + 7

    # Base case: for strings of length 1, each vowel appears once
    # We'll use indices: 0=a, 1=e, 2=i, 3=o, 4=u
    prev = [1, 1, 1, 1, 1]  # dp[1][vowel] = 1 for all vowels

    # Build up to length n
    for length in range(2, n + 1):
        # Current counts for strings of current length
        curr = [0, 0, 0, 0, 0]

        # Apply transition rules:
        # 'a' can only be followed by 'e' → so 'a' comes from vowels that can have 'a' after them
        # From rules: 'e'→'a', 'i'→'a', 'u'→'a'
        curr[0] = (prev[1] + prev[2] + prev[4]) % MOD  # a from e, i, u

        # 'e' can be followed by 'a' or 'i' → so 'e' comes from 'a' or 'i'
        curr[1] = (prev[0] + prev[2]) % MOD  # e from a, i

        # 'i' can be followed by 'a', 'e', 'o', 'u' → so 'i' comes from 'e' or 'o'
        curr[2] = (prev[1] + prev[3]) % MOD  # i from e, o

        # 'o' can be followed by 'i' or 'u' → so 'o' comes from 'i'
        curr[3] = prev[2] % MOD  # o from i

        # 'u' can be followed by 'a' → so 'u' comes from 'i' or 'o'
        curr[4] = (prev[2] + prev[3]) % MOD  # u from i, o

        # Update prev for next iteration
        prev = curr

    # Answer is sum of all counts for length n
    return sum(prev) % MOD
```

```javascript
// Time: O(n) | Space: O(1)
function countVowelPermutation(n) {
  const MOD = 1_000_000_007;

  // Base case: length 1 strings
  // Indices: 0=a, 1=e, 2=i, 3=o, 4=u
  let prev = [1, 1, 1, 1, 1];

  // Build strings up to length n
  for (let length = 2; length <= n; length++) {
    const curr = [0, 0, 0, 0, 0];

    // Apply transition rules based on problem constraints
    curr[0] = (prev[1] + prev[2] + prev[4]) % MOD; // a from e, i, u
    curr[1] = (prev[0] + prev[2]) % MOD; // e from a, i
    curr[2] = (prev[1] + prev[3]) % MOD; // i from e, o
    curr[3] = prev[2] % MOD; // o from i
    curr[4] = (prev[2] + prev[3]) % MOD; // u from i, o

    // Update for next iteration
    prev = curr;
  }

  // Sum all possibilities for length n
  let total = 0;
  for (let count of prev) {
    total = (total + count) % MOD;
  }
  return total;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int countVowelPermutation(int n) {
        final int MOD = 1_000_000_007;

        // Base case: strings of length 1
        // 0=a, 1=e, 2=i, 3=o, 4=u
        long[] prev = {1, 1, 1, 1, 1};

        // Build up to length n
        for (int length = 2; length <= n; length++) {
            long[] curr = new long[5];

            // Apply the transition rules from the problem
            // 'a' comes from 'e', 'i', or 'u'
            curr[0] = (prev[1] + prev[2] + prev[4]) % MOD;

            // 'e' comes from 'a' or 'i'
            curr[1] = (prev[0] + prev[2]) % MOD;

            // 'i' comes from 'e' or 'o'
            curr[2] = (prev[1] + prev[3]) % MOD;

            // 'o' comes from 'i'
            curr[3] = prev[2] % MOD;

            // 'u' comes from 'i' or 'o'
            curr[4] = (prev[2] + prev[3]) % MOD;

            // Update for next iteration
            prev = curr;
        }

        // Sum all counts for length n
        long total = 0;
        for (long count : prev) {
            total = (total + count) % MOD;
        }
        return (int) total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We perform n-1 iterations (from length 2 to n)
- Each iteration does a constant amount of work (5 additions and modulo operations)
- Total operations: ~5n, which is O(n)

**Space Complexity:** O(1)

- We only store two arrays of size 5 each (prev and curr)
- This is constant space regardless of n
- Even if we stored the full DP table, it would be O(n), but we optimized to O(1)

## Common Mistakes

1. **Misunderstanding the transition rules:** The most common error is confusing "X can be followed by Y" with "Y can come from X". Remember: if 'a' can only be followed by 'e', then 'e' can come from 'a', but 'a' can come from any vowel that allows 'a' to follow it. Double-check your transitions by working through small examples.

2. **Forgetting the modulo operation:** The counts grow exponentially, so they quickly exceed 32-bit or even 64-bit integer limits. You must apply modulo 10^9+7 at each addition, not just at the end. Otherwise, you'll get integer overflow.

3. **Off-by-one errors with length:** The base case is length 1 (not length 0). An empty string is not valid. Make sure your loop starts at 2 and goes to n inclusive.

4. **Using the wrong data type in Java:** In Java, use `long` for intermediate calculations because even with modulo at each step, the sums before modulo can exceed 32-bit limits. Cast back to `int` only at the final return.

## When You'll See This Pattern

This type of **state-based dynamic programming** appears in many counting problems:

1. **Knight Probability in Chessboard (LeetCode 688)** - Similar state transitions based on knight moves, counting probabilities instead of permutations.

2. **Number of Dice Rolls With Target Sum (LeetCode 1155)** - Counting ways to achieve a sum with dice rolls, where the state is (number of dice used, current sum).

3. **Decode Ways (LeetCode 91)** - Counting ways to decode a string, where each digit or pair of digits has specific valid decodings.

The pattern to recognize: when you need to count sequences where the next element depends only on the current/last element(s), and brute force is exponential, think about DP with states representing the "last element" situation.

## Key Takeaways

1. **State reduction is key:** Instead of tracking entire sequences, identify what minimal information you need about the current state to determine valid next steps. Here, only the last character matters.

2. **Directed graph interpretation:** Many sequence generation problems can be modeled as counting paths in a directed graph. Vertices are states (last character), edges are valid transitions, and you're counting paths of length n.

3. **Space optimization:** When the recurrence only depends on the previous state(s), you can often reduce space from O(n) to O(1) by only keeping the immediately needed previous values.

Related problems: [Number of Strings Which Can Be Rearranged to Contain Substring](/problem/number-of-strings-which-can-be-rearranged-to-contain-substring)
