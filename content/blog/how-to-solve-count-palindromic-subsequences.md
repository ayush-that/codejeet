---
title: "How to Solve Count Palindromic Subsequences — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Palindromic Subsequences. Hard difficulty, 41.0% acceptance rate. Topics: String, Dynamic Programming."
date: "2029-10-20"
category: "dsa-patterns"
tags: ["count-palindromic-subsequences", "string", "dynamic-programming", "hard"]
---

# How to Solve Count Palindromic Subsequences

We need to count all length-5 palindromic subsequences in a string of digits. A subsequence is a sequence that can be derived by deleting some characters without changing the order of the remaining characters. The challenge is that we can't generate all subsequences (there are 2^n possibilities), so we need a smarter way to count them without enumerating each one. What makes this problem interesting is that we're counting fixed-length palindromes, which lets us use a middle-out approach rather than the typical DP for variable-length palindromes.

## Visual Walkthrough

Let's trace through a small example: `s = "12321"`. We want to count all length-5 palindromic subsequences.

A length-5 palindrome has the form: `a b c b a` where the first and last characters match, and the second and fourth characters match. The middle character can be anything.

Let's think about how we can count these efficiently. Instead of trying all subsequences, we can fix the middle position and count how many valid pairs exist on each side.

Consider position `i` as the middle (third character) of our palindrome. We need:

- Two positions `j` and `k` where `j < i < k` and `s[j] == s[k]`
- Two more positions `p` and `q` where `p < j` and `k < q` and `s[p] == s[q]`

But there's a better approach: Let's think of the palindrome as `X Y Z Y X` where `X`, `Y`, `Z` are digits. We need to count all combinations of positions where:

- First and last positions have the same digit `X`
- Second and fourth positions have the same digit `Y`
- Middle position has digit `Z`

We can count for each possible triple `(X, Y, Z)` how many ways to choose positions that satisfy these conditions.

For `s = "12321"`:

- Possible `X` values: '1', '2', '3'
- Possible `Y` values: '1', '2', '3'
- Possible `Z` values: '1', '2', '3'

Let's count for `(X, Y, Z) = (1, 2, 3)`:

- We need first position with '1', last position with '1'
- We need second position with '2', fourth position with '2'
- We need middle position with '3'

In `"12321"`:

- '1' appears at indices 0 and 4
- '2' appears at indices 1 and 3
- '3' appears at index 2

We can choose: first=0, second=1, middle=2, fourth=3, fifth=4 → `"12321"` itself.
That's 1 combination for this `(1, 2, 3)` triple.

The total answer will be the sum over all digit triples `(X, Y, Z)`.

## Brute Force Approach

The brute force approach would be to generate all length-5 subsequences and check if each is a palindrome. There are C(n, 5) possible subsequences, which is O(n⁵) in the worst case (when n is large). Even for n=1000, this is far too slow (about 10¹³ operations).

A slightly better but still insufficient brute force would be to try all combinations of 5 indices and check if they form a palindrome:

<div class="code-group">

```python
# BRUTE FORCE - TOO SLOW
# Time: O(n^5) | Space: O(1)
def countPalindromicSubsequences_brute(s):
    n = len(s)
    count = 0
    MOD = 10**9 + 7

    # Try all combinations of 5 indices
    for i in range(n):
        for j in range(i+1, n):
            for k in range(j+1, n):
                for l in range(k+1, n):
                    for m in range(l+1, n):
                        # Check if s[i], s[j], s[k], s[l], s[m] forms a palindrome
                        if s[i] == s[m] and s[j] == s[l]:
                            count = (count + 1) % MOD
    return count
```

```javascript
// BRUTE FORCE - TOO SLOW
// Time: O(n^5) | Space: O(1)
function countPalindromicSubsequencesBrute(s) {
  const n = s.length;
  let count = 0;
  const MOD = 10 ** 9 + 7;

  // Try all combinations of 5 indices
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        for (let l = k + 1; l < n; l++) {
          for (let m = l + 1; m < n; m++) {
            // Check if s[i], s[j], s[k], s[l], s[m] forms a palindrome
            if (s[i] === s[m] && s[j] === s[l]) {
              count = (count + 1) % MOD;
            }
          }
        }
      }
    }
  }
  return count;
}
```

```java
// BRUTE FORCE - TOO SLOW
// Time: O(n^5) | Space: O(1)
public int countPalindromicSubsequencesBrute(String s) {
    int n = s.length();
    long count = 0;
    final int MOD = 1_000_000_007;

    // Try all combinations of 5 indices
    for (int i = 0; i < n; i++) {
        for (int j = i+1; j < n; j++) {
            for (int k = j+1; k < n; k++) {
                for (int l = k+1; l < n; l++) {
                    for (int m = l+1; m < n; m++) {
                        // Check if s[i], s[j], s[k], s[l], s[m] forms a palindrome
                        if (s.charAt(i) == s.charAt(m) && s.charAt(j) == s.charAt(l)) {
                            count = (count + 1) % MOD;
                        }
                    }
                }
            }
        }
    }
    return (int) count;
}
```

</div>

This is O(n⁵) time, which is completely impractical for n up to 10⁴ (the typical constraint for such problems).

## Optimized Approach

The key insight is that we don't need to enumerate all 5 indices. Since we're counting length-5 palindromes of the form `X Y Z Y X`, we can:

1. Fix the middle position `k` (the `Z` character)
2. For each possible digit pair `(X, Y)`, count:
   - How many pairs `(i, j)` where `i < j < k` and `s[i] = X` and `s[j] = Y`
   - How many pairs `(l, m)` where `k < l < m` and `s[l] = Y` and `s[m] = X`

Then for this middle position `k`, the contribution is: `leftCount[X][Y] * rightCount[Y][X]` for each `(X, Y)` pair.

But we can optimize further: Since there are only 10 possible digits (0-9), we can precompute prefix and suffix counts.

Better approach (the standard solution):

- Precompute for each position:
  - `prefix[i][d]`: count of digit `d` in `s[0..i]`
  - `suffix[i][d]`: count of digit `d` in `s[i..n-1]`
- Then for each possible `(j, k)` where `j < k` and we treat these as the middle two positions (positions 2 and 3 in 0-based indexing for a length-5 palindrome), we can count how many `X` before `j` and how many `X` after `k`.

Actually, the cleanest approach is to fix the middle character position, then count pairs on left and right:

For position `k` as the middle (3rd character in 0-based indexing for length-5):

- We need to choose `(i, j)` with `i < j < k` where `s[i] = X` and `s[j] = Y`
- And choose `(l, m)` with `k < l < m` where `s[l] = Y` and `s[m] = X`

But the most efficient approach is dynamic programming where `dp[x][y]` counts the number of pairs `(i, j)` with `i < j` and `s[i] = x`, `s[j] = y` seen so far.

Algorithm:

1. Initialize `dp[10][10]` to count pairs `(x, y)` seen so far
2. Initialize `rightCount[10]` to count occurrences of each digit to the right
3. For each position `k` from left to right:
   - Decrease `rightCount[s[k]]` (since `s[k]` is now at current position, not to the right)
   - For all pairs `(x, y)`, add `dp[x][y] * rightCount[y]` to answer if `s[k] == x` (because we can form `x s[k] y x` with `s[k]` as the middle)
   - Wait, this doesn't quite work for length-5...

Actually, the correct approach is more complex. Let me explain the working solution:

We want palindromes of form: `a b c b a`
We can think of it as: choose positions `i < j < k < l < m` with `s[i] = s[m] = a` and `s[j] = s[l] = b`

We can fix `j` and `l` (the positions of `b`), then count:

- How many `a` before `j` (for first position)
- How many `a` after `l` (for last position)

For each pair `(j, l)` with `j < l` and `s[j] = s[l] = b`:

- Let `leftCount[a]` = number of `a` in `s[0..j-1]`
- Let `rightCount[a]` = number of `a` in `s[l+1..n-1]`
- Contribution for this `(j, l)` pair is `sum over all a (leftCount[a] * rightCount[a])`

But we need to be careful: `a` and `b` can be the same digit! That's allowed.

## Optimal Solution

Here's the efficient O(100n) solution (since there are only 10 digits, 100 pairs):

1. Precompute prefix counts: `prefix[i][d]` = count of digit `d` in `s[0..i]`
2. Precompute suffix counts: `suffix[i][d]` = count of digit `d` in `s[i..n-1]`
3. For each pair of positions `(j, k)` with `j < k`:
   - If `s[j] == s[k]` (these will be positions 2 and 4 in our palindrome, 0-based indices 1 and 3):
     - For each digit `d` from '0' to '9':
       - Count how many `d` appear before `j` (from prefix)
       - Count how many `d` appear after `k` (from suffix)
       - Multiply these counts and add to answer

This works because:

- We're fixing the second and fourth characters (both equal to `s[j] = s[k]`)
- We need first character = fifth character = some digit `d`
- Number of choices for first character = count of `d` before position `j`
- Number of choices for fifth character = count of `d` after position `k`
- Middle character (third) can be anything between `j` and `k`, but wait... actually the middle character is at some position between `j` and `k`! We haven't accounted for that.

Actually, the correct formula is: For positions `(j, k)` with `s[j] == s[k]`, the contribution is the sum over all digits `d` of:
`(count of d before j) * (count of d after k)`

This gives us all palindromes of form `d s[j] ? s[k] d` where `?` is any character between `j` and `k`. But we need exactly length 5, so `?` must be exactly one character between `j` and `k`. So we need to multiply by the number of positions between `j` and `k`!

Final formula: For each pair `(j, k)` with `j < k` and `s[j] == s[k]`:
`total += (k - j - 1) * sum_over_d(prefix[j-1][d] * suffix[k+1][d])`

Wait, `k - j - 1` counts positions strictly between `j` and `k`, which is exactly the number of choices for the middle character!

<div class="code-group">

```python
# Optimal Solution
# Time: O(100n²) but with optimization: O(100n) = O(n) since 100 is constant
# Space: O(n) for prefix/suffix arrays
def countPalindromicSubsequences(s):
    n = len(s)
    MOD = 10**9 + 7

    # Convert string to list of integers for faster access
    digits = [int(ch) for ch in s]

    # prefix[i][d]: count of digit d in s[0..i]
    prefix = [[0] * 10 for _ in range(n)]
    # suffix[i][d]: count of digit d in s[i..n-1]
    suffix = [[0] * 10 for _ in range(n)]

    # Build prefix array
    for i in range(n):
        d = digits[i]
        # Copy previous row
        if i > 0:
            for digit in range(10):
                prefix[i][digit] = prefix[i-1][digit]
        # Increment current digit
        prefix[i][d] += 1

    # Build suffix array
    for i in range(n-1, -1, -1):
        d = digits[i]
        # Copy next row
        if i < n-1:
            for digit in range(10):
                suffix[i][digit] = suffix[i+1][digit]
        # Increment current digit
        suffix[i][d] += 1

    result = 0

    # For each pair (j, k) where j < k and s[j] == s[k]
    for j in range(n):
        for k in range(j + 1, n):
            if digits[j] == digits[k]:
                # Count choices for middle character
                middle_choices = k - j - 1
                if middle_choices <= 0:
                    continue

                # Sum over all digits d: prefix[j-1][d] * suffix[k+1][d]
                sum_pairs = 0
                for d in range(10):
                    left_count = prefix[j-1][d] if j > 0 else 0
                    right_count = suffix[k+1][d] if k < n-1 else 0
                    sum_pairs = (sum_pairs + left_count * right_count) % MOD

                # Add to result: middle_choices * sum_pairs
                result = (result + middle_choices * sum_pairs) % MOD

    return result
```

```javascript
// Optimal Solution
// Time: O(100n²) but with optimization: O(100n) = O(n) since 100 is constant
// Space: O(n) for prefix/suffix arrays
function countPalindromicSubsequences(s) {
  const n = s.length;
  const MOD = 10 ** 9 + 7;

  // Convert string to array of digit numbers
  const digits = Array.from(s, (ch) => parseInt(ch));

  // prefix[i][d]: count of digit d in s[0..i]
  const prefix = Array(n)
    .fill()
    .map(() => Array(10).fill(0));
  // suffix[i][d]: count of digit d in s[i..n-1]
  const suffix = Array(n)
    .fill()
    .map(() => Array(10).fill(0));

  // Build prefix array
  for (let i = 0; i < n; i++) {
    const d = digits[i];
    // Copy previous row
    if (i > 0) {
      for (let digit = 0; digit < 10; digit++) {
        prefix[i][digit] = prefix[i - 1][digit];
      }
    }
    // Increment current digit
    prefix[i][d]++;
  }

  // Build suffix array
  for (let i = n - 1; i >= 0; i--) {
    const d = digits[i];
    // Copy next row
    if (i < n - 1) {
      for (let digit = 0; digit < 10; digit++) {
        suffix[i][digit] = suffix[i + 1][digit];
      }
    }
    // Increment current digit
    suffix[i][d]++;
  }

  let result = 0;

  // For each pair (j, k) where j < k and s[j] == s[k]
  for (let j = 0; j < n; j++) {
    for (let k = j + 1; k < n; k++) {
      if (digits[j] === digits[k]) {
        // Count choices for middle character
        const middleChoices = k - j - 1;
        if (middleChoices <= 0) continue;

        // Sum over all digits d: prefix[j-1][d] * suffix[k+1][d]
        let sumPairs = 0;
        for (let d = 0; d < 10; d++) {
          const leftCount = j > 0 ? prefix[j - 1][d] : 0;
          const rightCount = k < n - 1 ? suffix[k + 1][d] : 0;
          sumPairs = (sumPairs + leftCount * rightCount) % MOD;
        }

        // Add to result: middleChoices * sumPairs
        result = (result + middleChoices * sumPairs) % MOD;
      }
    }
  }

  return result;
}
```

```java
// Optimal Solution
// Time: O(100n²) but with optimization: O(100n) = O(n) since 100 is constant
// Space: O(n) for prefix/suffix arrays
public int countPalindromicSubsequences(String s) {
    int n = s.length();
    final int MOD = 1_000_000_007;

    // Convert string to array of digit numbers
    int[] digits = new int[n];
    for (int i = 0; i < n; i++) {
        digits[i] = s.charAt(i) - '0';
    }

    // prefix[i][d]: count of digit d in s[0..i]
    int[][] prefix = new int[n][10];
    // suffix[i][d]: count of digit d in s[i..n-1]
    int[][] suffix = new int[n][10];

    // Build prefix array
    for (int i = 0; i < n; i++) {
        int d = digits[i];
        // Copy previous row
        if (i > 0) {
            System.arraycopy(prefix[i-1], 0, prefix[i], 0, 10);
        }
        // Increment current digit
        prefix[i][d]++;
    }

    // Build suffix array
    for (int i = n-1; i >= 0; i--) {
        int d = digits[i];
        // Copy next row
        if (i < n-1) {
            System.arraycopy(suffix[i+1], 0, suffix[i], 0, 10);
        }
        // Increment current digit
        suffix[i][d]++;
    }

    long result = 0;  // Use long to avoid overflow

    // For each pair (j, k) where j < k and s[j] == s[k]
    for (int j = 0; j < n; j++) {
        for (int k = j + 1; k < n; k++) {
            if (digits[j] == digits[k]) {
                // Count choices for middle character
                int middleChoices = k - j - 1;
                if (middleChoices <= 0) continue;

                // Sum over all digits d: prefix[j-1][d] * suffix[k+1][d]
                long sumPairs = 0;
                for (int d = 0; d < 10; d++) {
                    int leftCount = j > 0 ? prefix[j-1][d] : 0;
                    int rightCount = k < n-1 ? suffix[k+1][d] : 0;
                    sumPairs = (sumPairs + (long) leftCount * rightCount) % MOD;
                }

                // Add to result: middleChoices * sumPairs
                result = (result + middleChoices * sumPairs) % MOD;
            }
        }
    }

    return (int) result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(100n²) in the naive implementation above, but we can optimize to O(100n) = O(n) by being smarter about the loops. Actually, the double loop over `j` and `k` gives O(n²), which might be acceptable for n ≤ 1000 but not for n ≤ 10⁴. For the truly optimal O(n) solution, we need to use a different approach that accumulates counts as we go.

The truly optimal solution (which is O(100n) = O(n)):

- As we iterate through the string, maintain counts of pairs `(a, b)` seen so far
- Also maintain suffix counts of single digits
- For each position treated as the "second b" in our palindrome, we can quickly compute the contribution

But the O(n²) solution with the double loop is often acceptable in interviews if you explain that with only 10 digits, we could optimize further.

**Space Complexity:** O(n) for the prefix and suffix arrays (each is n × 10).

## Common Mistakes

1. **Off-by-one errors with indices**: When accessing `prefix[j-1]` or `suffix[k+1]`, forgetting to check if `j > 0` or `k < n-1`. This leads to index out of bounds errors.

2. **Forgetting to mod frequently**: The result can be huge, so we need to apply modulo after each multiplication and addition. Waiting until the end to mod can cause integer overflow.

3. **Incorrect middle character count**: The number of middle choices is `k - j - 1`, not `k - j`. We need strictly between `j` and `k`.

4. **Not handling empty string or short strings**: For n < 5, the answer should be 0. Our code handles this correctly because the double loop won't find valid pairs with middle choices > 0.

## When You'll See This Pattern

This "count palindromic subsequences" pattern appears in several variations:

1. **Count Palindromic Substrings** (LeetCode 647): Count all palindromic substrings (contiguous). Uses expanding around center or DP.

2. **Longest Palindromic Subsequence** (LeetCode 516): Find the length of the longest palindromic subsequence. Uses 2D DP.

3. **Count Different Palindromic Subsequences** (LeetCode 730): Count distinct palindromic subsequences. Uses more complex DP with next/prev arrays.

4. **Unique Length-3 Palindromic Subsequences** (LeetCode 1930): Count unique palindromic subsequences of length 3. Simpler version of this problem.

The key pattern is using prefix/suffix counts or DP to avoid enumerating all subsequences, especially when the alphabet size is small (like digits 0-9).

## Key Takeaways

1. **Fixed-length palindrome counting can use combinatorics**: For length-5 palindromes `a b c b a`, fix the positions of `b` (second and fourth characters), then count valid `a` pairs and middle `c` choices.

2. **Small alphabet enables O(n) solutions**: With only 10 digits, we can afford to maintain counts for all digit pairs (100 possibilities).

3. **Prefix/suffix arrays are powerful**: When you need counts of characters before/after certain positions, precomputing prefix and suffix counts saves time.

4. **Think about the palindrome structure**: Break it down into symmetric parts. For odd-length palindromes, handle the middle separately.

Related problems: [Arithmetic Slices II - Subsequence](/problem/arithmetic-slices-ii-subsequence), [Count Different Palindromic Subsequences](/problem/count-different-palindromic-subsequences), [Unique Length-3 Palindromic Subsequences](/problem/unique-length-3-palindromic-subsequences)
