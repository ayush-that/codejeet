---
title: "How to Solve Count Sorted Vowel Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Sorted Vowel Strings. Medium difficulty, 79.2% acceptance rate. Topics: Math, Dynamic Programming, Combinatorics."
date: "2028-09-19"
category: "dsa-patterns"
tags: ["count-sorted-vowel-strings", "math", "dynamic-programming", "combinatorics", "medium"]
---

# How to Solve Count Sorted Vowel Strings

This problem asks us to count how many strings of length `n` can be formed using only the vowels `a, e, i, o, u` while maintaining lexicographic order (non-decreasing order). The tricky part is that we're not generating the actual strings—we're counting them efficiently for potentially large values of `n`. A brute force approach would generate all possible strings, but that becomes astronomically large quickly. The interesting challenge is finding a mathematical or algorithmic way to count without enumeration.

## Visual Walkthrough

Let's build intuition with a small example: `n = 2`.

We need all 2-character strings using vowels where each character is the same as or comes after the previous one in alphabetical order (`a ≤ e ≤ i ≤ o ≤ u`).

Let's list them systematically:

**Starting with 'a':**

- aa, ae, ai, ao, au (5 strings)

**Starting with 'e':**

- ee, ei, eo, eu (4 strings)  
  Note: 'ea' is invalid because e < a violates the sorted condition

**Starting with 'i':**

- ii, io, iu (3 strings)

**Starting with 'o':**

- oo, ou (2 strings)

**Starting with 'u':**

- uu (1 string)

Total: 5 + 4 + 3 + 2 + 1 = 15 strings.

Notice the pattern: For `n = 1`, we have 5 strings (a, e, i, o, u). For `n = 2`, the counts starting with each vowel form a decreasing sequence: 5, 4, 3, 2, 1.

Why does this happen? If our string starts with 'a', the next character can be any vowel (5 choices). If it starts with 'e', the next character can only be e, i, o, or u (4 choices), and so on. This observation leads us to a dynamic programming approach.

## Brute Force Approach

The most straightforward solution would be to generate all possible strings of length `n` using the 5 vowels, then check if each one is sorted, and count the valid ones.

**Why this fails:**

- For `n = 1`, we have 5¹ = 5 strings
- For `n = 2`, we have 5² = 25 strings
- For `n = 10`, we have 5¹⁰ ≈ 9.7 million strings
- For `n = 50`, we have 5⁵⁰ ≈ 8.9 × 10³⁴ strings (completely infeasible)

Even with pruning (only generating sorted strings), the recursive approach would still have exponential time complexity. We need a smarter counting method.

## Optimized Approach

The key insight is that this is a **combinatorics with repetition** problem. We can think of it as: "How many ways can we choose `n` items from 5 types (vowels) with repetition allowed, where order matters but must be non-decreasing?"

This is equivalent to the "stars and bars" combinatorial problem: The number of combinations with repetition of `k` items chosen from `n` types is C(n + k - 1, k). Here, `n` is our string length (items to choose), and `k = 5` (types of items/vowels).

Wait—actually careful: We have 5 vowel types and want strings of length `n`. The formula for combinations with repetition is C(n + k - 1, n) where `k` is the number of types. So for 5 vowels: C(n + 5 - 1, n) = C(n + 4, n) = C(n + 4, 4).

Let's verify with our example:

- For `n = 2`: C(2+4, 4) = C(6, 4) = 15 ✓
- For `n = 1`: C(1+4, 4) = C(5, 4) = 5 ✓

However, many interviewers prefer to see the dynamic programming approach because it's more intuitive and demonstrates algorithmic thinking. The DP approach builds a table where `dp[i][j]` represents the number of sorted strings of length `i` ending with the `j`-th vowel (0=a, 1=e, 2=i, 3=o, 4=u).

The recurrence relation: `dp[i][j] = sum(dp[i-1][k] for k ≤ j)`
Because if our current character is the `j`-th vowel, the previous character must be the same or an earlier vowel.

We can optimize space by noticing we only need the previous row.

## Optimal Solution

Here's the dynamic programming solution with space optimization:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countVowelStrings(n: int) -> int:
    """
    Counts the number of sorted vowel strings of length n.

    We maintain a DP array of size 5 where dp[j] represents
    the number of strings ending with vowel j.
    For each additional character, we update the counts.
    """
    # Initialize: for length 1, we have 1 string ending with each vowel
    # dp = [1, 1, 1, 1, 1] for a, e, i, o, u respectively
    dp = [1] * 5

    # Build strings of length 2 to n
    for length in range(2, n + 1):
        # For each vowel position, calculate new count
        # We process from right to left to avoid overwriting values we need
        for j in range(3, -1, -1):  # Process u, o, i, e (a is handled separately)
            # Strings ending with vowel j can be formed by:
            # 1. Taking any string ending with vowel j and appending vowel j again
            # 2. Taking any string ending with a vowel < j and appending vowel j
            # This is equivalent to dp[j] += dp[j+1] when processing right to left
            dp[j] += dp[j + 1]
        # 'a' gets special treatment: it can follow any string ending with 'a'
        # which is already accounted for in dp[0]

    # Total strings = sum of all strings ending with each vowel
    return sum(dp)
```

```javascript
// Time: O(n) | Space: O(1)
function countVowelStrings(n) {
  /**
   * Counts the number of sorted vowel strings of length n.
   *
   * We maintain a DP array of size 5 where dp[j] represents
   * the number of strings ending with vowel j.
   * For each additional character, we update the counts.
   */

  // Initialize: for length 1, we have 1 string ending with each vowel
  // dp = [1, 1, 1, 1, 1] for a, e, i, o, u respectively
  let dp = [1, 1, 1, 1, 1];

  // Build strings of length 2 to n
  for (let length = 2; length <= n; length++) {
    // Process vowels from right to left (u to a)
    // This ensures we don't overwrite values we still need
    for (let j = 3; j >= 0; j--) {
      // Strings ending with vowel j can be formed by:
      // 1. Taking any string ending with vowel j and appending vowel j again
      // 2. Taking any string ending with a vowel < j and appending vowel j
      // When processing right to left, this is dp[j] += dp[j+1]
      dp[j] += dp[j + 1];
    }
    // 'a' (dp[0]) is handled implicitly in the loop
  }

  // Sum all strings ending with each vowel
  return dp.reduce((sum, count) => sum + count, 0);
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int countVowelStrings(int n) {
        /**
         * Counts the number of sorted vowel strings of length n.
         *
         * We maintain a DP array of size 5 where dp[j] represents
         * the number of strings ending with vowel j.
         * For each additional character, we update the counts.
         */

        // Initialize: for length 1, we have 1 string ending with each vowel
        // dp = [1, 1, 1, 1, 1] for a, e, i, o, u respectively
        int[] dp = {1, 1, 1, 1, 1};

        // Build strings of length 2 to n
        for (int length = 2; length <= n; length++) {
            // Process vowels from right to left (u to a)
            // This ensures we don't overwrite values we still need
            for (int j = 3; j >= 0; j--) {
                // Strings ending with vowel j can be formed by:
                // 1. Taking any string ending with vowel j and appending vowel j again
                // 2. Taking any string ending with a vowel < j and appending vowel j
                // When processing right to left, this is dp[j] += dp[j+1]
                dp[j] += dp[j + 1];
            }
            // 'a' (dp[0]) is handled implicitly in the loop
        }

        // Sum all strings ending with each vowel
        int total = 0;
        for (int count : dp) {
            total += count;
        }
        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We have an outer loop that runs `n-1` times (from length 2 to n)
- Each iteration has an inner loop that runs 4 times (for vowels e, i, o, u)
- Total operations: 4 × (n-1) = O(n)

**Space Complexity:** O(1)

- We only maintain a fixed-size array of 5 integers regardless of `n`
- No additional data structures that grow with input size

## Common Mistakes

1. **Off-by-one errors in DP initialization:** Some candidates initialize for length 0 instead of length 1. Remember: `dp[j]` represents strings of the _current_ length ending with vowel j. For length 1, each vowel has exactly 1 string.

2. **Processing left-to-right instead of right-to-left:** If you process vowels from a to u, you'll overwrite values needed for later calculations. When we do `dp[j] += dp[j-1]` going left to right, we're adding the _updated_ value of `dp[j-1]` (which includes strings ending with current vowel), not the original value. Right-to-left avoids this.

3. **Forgetting to sum all vowel endings:** The final answer is the sum of `dp[0]` through `dp[4]`, not just `dp[4]` or `dp[0]`. Each represents strings ending with a different vowel, and all are valid.

4. **Trying to use the combinatorial formula incorrectly:** While C(n+4, 4) gives the correct answer, some candidates misremember it as C(n+5, 5) or C(n+4, n). Test with small `n` values to verify your formula.

## When You'll See This Pattern

This problem uses a **dynamic programming with prefix sums** pattern, which appears in many counting problems:

1. **Unique Paths (LeetCode 62)**: Count paths in a grid where you can only move right/down. The DP recurrence `dp[i][j] = dp[i-1][j] + dp[i][j-1]` is similar to our vowel sum pattern.

2. **Coin Change (LeetCode 322)**: Counting ways to make change uses a similar DP accumulation approach, though with different constraints.

3. **Count Sorted Vowel Strings** itself is a special case of counting **combinations with repetition**, which appears in problems like "Number of Dice Rolls With Target Sum" (LeetCode 1155).

The key insight is recognizing when you can build a solution for size `n` from solutions for size `n-1`, and when the counts follow a cumulative pattern.

## Key Takeaways

1. **Sorted string counting often reduces to combinatorics**: When strings must be non-decreasing, it's equivalent to combinations with repetition. The formula C(n+k-1, n) where k is alphabet size is worth remembering.

2. **DP with cumulative sums**: Many counting problems use the pattern `dp[i][j] = sum(dp[i-1][0...j])`. This can often be optimized to O(1) space by processing in the right order.

3. **Test with small cases**: Always verify your logic with n=1, n=2 before implementing. The pattern 5, 15, 35, 70... for n=1,2,3,4 is a good sanity check.

[Practice this problem on CodeJeet](/problem/count-sorted-vowel-strings)
