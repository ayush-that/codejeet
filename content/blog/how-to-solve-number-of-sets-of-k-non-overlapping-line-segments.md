---
title: "How to Solve Number of Sets of K Non-Overlapping Line Segments — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Sets of K Non-Overlapping Line Segments. Medium difficulty, 45.6% acceptance rate. Topics: Math, Dynamic Programming, Combinatorics, Prefix Sum."
date: "2026-03-21"
category: "dsa-patterns"
tags:
  [
    "number-of-sets-of-k-non-overlapping-line-segments",
    "math",
    "dynamic-programming",
    "combinatorics",
    "medium",
  ]
---

# How to Solve Number of Sets of K Non-Overlapping Line Segments

This problem asks us to count the number of ways to draw exactly `k` non-overlapping line segments on `n` equally spaced points, where each segment must cover at least two points. The challenge lies in the combinatorial nature of the problem — we need to count valid segment arrangements without actually enumerating all possibilities, which would be computationally infeasible for large inputs. The key insight is recognizing that this is fundamentally a combinatorial selection problem that can be solved with dynamic programming.

## Visual Walkthrough

Let's build intuition with a concrete example: `n = 4` points (positions 0, 1, 2, 3) and `k = 2` segments.

We need exactly 2 segments, each covering at least 2 points, that don't overlap. Let's enumerate valid arrangements:

1. **Segments [0,1] and [2,3]**: First segment covers points 0-1, second covers 2-3
2. **Segments [0,2] and [3,?]**: This doesn't work because the second segment needs at least 2 points but only point 3 remains
3. **Segments [0,1] and [2,?]**: Similar issue - only point 2 remains for second segment
4. **Segments [0,2] and [?,?]**: After using points 0-2 for first segment, only point 3 remains - not enough for second segment
5. **Segments [1,2] and [3,?]**: Only point 3 remains for second segment - not enough

Wait, we seem to have a problem! With `n=4` and `k=2`, each segment needs at least 2 points, so we need at least 4 points total. But we only have 4 points exactly, which means the segments must exactly partition all points without gaps. Let's check:

- Segment [0,1] uses points 0,1 → remaining points 2,3 → segment [2,3] works ✓
- Segment [0,2] uses points 0,1,2 → only point 3 remains → fails
- Segment [1,2] uses points 1,2 → remaining points 0,3 → can't form a segment (not contiguous)

So only **1 valid arrangement**: segments [0,1] and [2,3].

This example reveals the combinatorial challenge: we need to count arrangements where segments don't overlap and each has length ≥ 2. The brute force approach would try all possible segment placements, which grows exponentially.

## Brute Force Approach

A naive solution would try to place `k` segments by:

1. Generating all possible segments (start and end positions)
2. Trying all combinations of `k` segments
3. Checking if they're non-overlapping and cover ≥ 2 points each
4. Counting valid combinations

For `n` points, there are `O(n²)` possible segments (any start < end). Choosing `k` from these gives `O((n²)^k)` combinations to check — astronomically large even for moderate `n` and `k`.

A slightly better brute force might use recursion: at each step, choose a segment starting from the current position, then recursively place remaining segments after it. This avoids overlap by construction. The code would look like:

<div class="code-group">

```python
# Brute force recursive solution - too slow for large inputs
def numberOfSets_brute(n, k):
    MOD = 10**9 + 7

    def dfs(pos, segments_left):
        if segments_left == 0:
            return 1  # Found a valid arrangement

        total = 0
        # Try all possible segments starting at 'pos'
        for end in range(pos + 1, n):  # Segment must have at least 2 points
            # Segment from pos to end covers (end - pos + 1) points
            # We need at least 2 points, so end - pos >= 1 (already true)

            # For the remaining points after this segment
            # We can start next segment at 'end' (touching) or later
            # Actually segments can touch but not overlap
            for next_start in range(end, n):
                total += dfs(next_start, segments_left - 1)

        return total % MOD

    # Try starting first segment at any position
    result = 0
    for start in range(n):
        result += dfs(start, k)

    return result % MOD
```

```javascript
// Brute force recursive solution - too slow for large inputs
function numberOfSetsBrute(n, k) {
  const MOD = 10 ** 9 + 7;

  function dfs(pos, segmentsLeft) {
    if (segmentsLeft === 0) {
      return 1; // Found a valid arrangement
    }

    let total = 0;
    // Try all possible segments starting at 'pos'
    for (let end = pos + 1; end < n; end++) {
      // Try all possible starting positions for next segment
      for (let nextStart = end; nextStart < n; nextStart++) {
        total += dfs(nextStart, segmentsLeft - 1);
      }
    }

    return total % MOD;
  }

  let result = 0;
  for (let start = 0; start < n; start++) {
    result += dfs(start, k);
  }

  return result % MOD;
}
```

```java
// Brute force recursive solution - too slow for large inputs
public class Solution {
    private static final int MOD = 1_000_000_007;

    public int numberOfSetsBrute(int n, int k) {
        int result = 0;
        for (int start = 0; start < n; start++) {
            result = (result + dfs(start, k, n)) % MOD;
        }
        return result;
    }

    private int dfs(int pos, int segmentsLeft, int n) {
        if (segmentsLeft == 0) {
            return 1;
        }

        int total = 0;
        // Try all possible segments starting at 'pos'
        for (int end = pos + 1; end < n; end++) {
            // Try all possible starting positions for next segment
            for (int nextStart = end; nextStart < n; nextStart++) {
                total = (total + dfs(nextStart, segmentsLeft - 1, n)) % MOD;
            }
        }

        return total;
    }
}
```

</div>

This brute force has exponential time complexity and will time out even for moderate inputs like `n=30, k=7`. We need a smarter approach.

## Optimized Approach

The key insight is that we can transform this problem into a combinatorial selection problem. Think about it this way:

1. We have `n` points at positions `0, 1, 2, ..., n-1`
2. Each segment needs at least 2 points
3. Segments cannot overlap but can touch at endpoints

Here's the clever transformation: Instead of thinking about segments directly, think about choosing `2k` points from `n + k - 1` available positions. Why `n + k - 1`?

Consider drawing `k` segments. Each segment has a start and end point. If segments could be single points, we'd need `2k` points. But segments must have length ≥ 2, so start and end cannot be the same point. More importantly, when segments touch (share an endpoint), that endpoint counts for both segments.

The combinatorial formula is: Number of ways = C(n + k - 1, 2k)

Let's verify with our example `n=4, k=2`:

- `n + k - 1 = 4 + 2 - 1 = 5`
- `2k = 4`
- C(5, 4) = 5!/(4!1!) = 5

But we counted only 1 valid arrangement earlier! What's wrong?

The issue is that our formula counts arrangements where segments can have length 1 (just a point), which isn't allowed. We need to ensure each segment has at least 2 points.

The correct approach uses dynamic programming. Let `dp[i][j]` = number of ways to draw `j` segments using first `i` points.

For each position `i`, we have two choices:

1. Don't end a segment at point `i`
2. End a segment at point `i`

If we end a segment at point `i`, we need to choose where it started. It could start at any point `s` where `s < i` (segment has at least 2 points, so `i - s ≥ 1`).

This leads to the recurrence:

```
dp[i][j] = dp[i-1][j] + sum(dp[s][j-1] for s = 0 to i-1)
```

But this is O(n³) if computed naively. We can optimize using prefix sums!

Let `prefix[i][j] = sum(dp[0][j] + dp[1][j] + ... + dp[i][j])`

Then:

```
dp[i][j] = dp[i-1][j] + prefix[i-1][j-1]
prefix[i][j] = prefix[i-1][j] + dp[i][j]
```

This reduces the complexity to O(nk).

## Optimal Solution

Here's the efficient dynamic programming solution with prefix sums:

<div class="code-group">

```python
# Time: O(n*k) | Space: O(n*k)
def numberOfSets(n, k):
    MOD = 10**9 + 7

    # dp[i][j] = number of ways to draw j segments using first i points
    dp = [[0] * (k + 1) for _ in range(n + 1)]
    # prefix[i][j] = sum(dp[0][j] + dp[1][j] + ... + dp[i][j])
    prefix = [[0] * (k + 1) for _ in range(n + 1)]

    # Base case: using 0 points, we can draw 0 segments in 1 way
    for i in range(n + 1):
        dp[i][0] = 1
        prefix[i][0] = i + 1  # sum of dp[0..i][0]

    # Fill the DP table
    for j in range(1, k + 1):
        for i in range(1, n + 1):
            # Option 1: Don't end a segment at point i-1
            # This means we're using the same number of segments as with i-1 points
            option1 = dp[i-1][j]

            # Option 2: End a segment at point i-1
            # The segment could have started at any point s where s < i-1
            # Sum of dp[s][j-1] for s = 0 to i-2 is prefix[i-2][j-1]
            option2 = prefix[i-2][j-1] if i >= 2 else 0

            dp[i][j] = (option1 + option2) % MOD

            # Update prefix sum
            prefix[i][j] = (prefix[i-1][j] + dp[i][j]) % MOD

    return dp[n][k]

# Alternative combinatorial solution (more efficient)
# Time: O(n) for computing combinations | Space: O(n)
def numberOfSetsCombinatorial(n, k):
    MOD = 10**9 + 7

    # Helper function to compute nCr mod MOD
    def nCr(n, r):
        if r < 0 or r > n:
            return 0

        # Compute factorial and inverse factorial using modular inverse
        fact = [1] * (n + 1)
        inv_fact = [1] * (n + 1)

        for i in range(2, n + 1):
            fact[i] = fact[i-1] * i % MOD

        # Fermat's little theorem for modular inverse
        inv_fact[n] = pow(fact[n], MOD-2, MOD)
        for i in range(n-1, -1, -1):
            inv_fact[i] = inv_fact[i+1] * (i+1) % MOD

        return fact[n] * inv_fact[r] % MOD * inv_fact[n-r] % MOD

    # The combinatorial formula: C(n + k - 1, 2k)
    return nCr(n + k - 1, 2 * k)
```

```javascript
// Time: O(n*k) | Space: O(n*k)
function numberOfSets(n, k) {
  const MOD = 10 ** 9 + 7;

  // dp[i][j] = number of ways to draw j segments using first i points
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(k + 1).fill(0));
  // prefix[i][j] = sum(dp[0][j] + dp[1][j] + ... + dp[i][j])
  const prefix = Array(n + 1)
    .fill()
    .map(() => Array(k + 1).fill(0));

  // Base case: using 0 points, we can draw 0 segments in 1 way
  for (let i = 0; i <= n; i++) {
    dp[i][0] = 1;
    prefix[i][0] = i + 1; // sum of dp[0..i][0]
  }

  // Fill the DP table
  for (let j = 1; j <= k; j++) {
    for (let i = 1; i <= n; i++) {
      // Option 1: Don't end a segment at point i-1
      const option1 = dp[i - 1][j];

      // Option 2: End a segment at point i-1
      // The segment could have started at any point s where s < i-1
      const option2 = i >= 2 ? prefix[i - 2][j - 1] : 0;

      dp[i][j] = (option1 + option2) % MOD;

      // Update prefix sum
      prefix[i][j] = (prefix[i - 1][j] + dp[i][j]) % MOD;
    }
  }

  return dp[n][k];
}

// Alternative combinatorial solution (more efficient)
// Time: O(n) for computing combinations | Space: O(n)
function numberOfSetsCombinatorial(n, k) {
  const MOD = 10 ** 9 + 7;

  // Helper function to compute nCr mod MOD
  function nCr(n, r) {
    if (r < 0 || r > n) return 0;

    // Compute factorial and inverse factorial
    const fact = new Array(n + 1).fill(1);
    const invFact = new Array(n + 1).fill(1);

    for (let i = 2; i <= n; i++) {
      fact[i] = (fact[i - 1] * i) % MOD;
    }

    // Fermat's little theorem for modular inverse
    invFact[n] = modPow(fact[n], MOD - 2);
    for (let i = n - 1; i >= 0; i--) {
      invFact[i] = (invFact[i + 1] * (i + 1)) % MOD;
    }

    return (((fact[n] * invFact[r]) % MOD) * invFact[n - r]) % MOD;
  }

  // Modular exponentiation
  function modPow(a, b) {
    let result = 1;
    while (b > 0) {
      if (b & 1) result = (result * a) % MOD;
      a = (a * a) % MOD;
      b >>= 1;
    }
    return result;
  }

  // The combinatorial formula: C(n + k - 1, 2k)
  return nCr(n + k - 1, 2 * k);
}
```

```java
// Time: O(n*k) | Space: O(n*k)
class Solution {
    private static final int MOD = 1_000_000_007;

    public int numberOfSets(int n, int k) {
        // dp[i][j] = number of ways to draw j segments using first i points
        int[][] dp = new int[n + 1][k + 1];
        // prefix[i][j] = sum(dp[0][j] + dp[1][j] + ... + dp[i][j])
        int[][] prefix = new int[n + 1][k + 1];

        // Base case: using 0 points, we can draw 0 segments in 1 way
        for (int i = 0; i <= n; i++) {
            dp[i][0] = 1;
            prefix[i][0] = i + 1;  // sum of dp[0..i][0]
        }

        // Fill the DP table
        for (int j = 1; j <= k; j++) {
            for (int i = 1; i <= n; i++) {
                // Option 1: Don't end a segment at point i-1
                int option1 = dp[i-1][j];

                // Option 2: End a segment at point i-1
                // The segment could have started at any point s where s < i-1
                int option2 = i >= 2 ? prefix[i-2][j-1] : 0;

                dp[i][j] = (option1 + option2) % MOD;

                // Update prefix sum
                prefix[i][j] = (prefix[i-1][j] + dp[i][j]) % MOD;
            }
        }

        return dp[n][k];
    }
}

// Alternative combinatorial solution (more efficient)
// Time: O(n) for computing combinations | Space: O(n)
class SolutionCombinatorial {
    private static final int MOD = 1_000_000_007;

    public int numberOfSets(int n, int k) {
        // The combinatorial formula: C(n + k - 1, 2k)
        return nCr(n + k - 1, 2 * k);
    }

    private int nCr(int n, int r) {
        if (r < 0 || r > n) return 0;

        // Compute factorial and inverse factorial
        long[] fact = new long[n + 1];
        long[] invFact = new long[n + 1];
        fact[0] = 1;

        for (int i = 1; i <= n; i++) {
            fact[i] = fact[i-1] * i % MOD;
        }

        // Fermat's little theorem for modular inverse
        invFact[n] = modPow(fact[n], MOD-2);
        for (int i = n-1; i >= 0; i--) {
            invFact[i] = invFact[i+1] * (i+1) % MOD;
        }

        return (int)(fact[n] * invFact[r] % MOD * invFact[n-r] % MOD);
    }

    private long modPow(long a, long b) {
        long result = 1;
        while (b > 0) {
            if ((b & 1) == 1) result = result * a % MOD;
            a = a * a % MOD;
            b >>= 1;
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Dynamic Programming Solution:**

- **Time Complexity:** O(n × k) - We have nested loops: outer loop runs k times, inner loop runs n times
- **Space Complexity:** O(n × k) - We maintain two 2D arrays of size (n+1) × (k+1)

**Combinatorial Solution:**

- **Time Complexity:** O(n) - We need to compute factorials up to n+k-1
- **Space Complexity:** O(n) - We store factorial and inverse factorial arrays

The combinatorial solution is more efficient but requires understanding the combinatorial derivation. The DP solution is more intuitive and easier to explain during an interview.

## Common Mistakes

1. **Off-by-one errors with indices:** The transformation from "i points" to "point at position i-1" is tricky. Remember that `dp[i][j]` uses the first `i` points (indices 0 to i-1). When we say "end a segment at point i-1", we mean the actual point with coordinate i-1.

2. **Forgetting the modulo operation:** The result can be huge, so we need to apply modulo 10^9+7 after each addition/multiplication. A common mistake is to apply modulo only at the end, which can cause integer overflow.

3. **Incorrect base cases:** For `dp[i][0]`, there's exactly 1 way to draw 0 segments using any number of points (do nothing). For `prefix[i][0]`, it's the sum of `i+1` ones (from `dp[0][0]` to `dp[i][0]`).

4. **Missing the optimization with prefix sums:** Without prefix sums, the naive DP would be O(n³), which is too slow for the constraints (n up to 1000). Candidates might miss that `sum(dp[s][j-1] for s = 0 to i-2)` can be computed efficiently using prefix sums.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Dynamic Programming with prefix sums:** Similar to problems where you need to count ways to partition or arrange items with constraints. Examples:
   - LeetCode 91 "Decode Ways" - counting ways to decode a string
   - LeetCode 276 "Paint Fence" - counting ways to paint fences with constraints
   - LeetCode 629 "K Inverse Pairs Array" - counting permutations with given number of inversions

2. **Combinatorial counting problems:** When you need to count arrangements without actually generating them:
   - LeetCode 62 "Unique Paths" - counting paths in a grid (C(m+n-2, m-1))
   - LeetCode 96 "Unique Binary Search Trees" - Catalan numbers

3. **Transformation to combinatorial formula:** Recognizing that a complex arrangement problem can be reduced to a simple combination formula is a powerful technique seen in problems like:
   - LeetCode 1359 "Count All Valid Pickup and Delivery Options" - counting valid sequences

## Key Takeaways

1. **Think about transformations:** Complex arrangement problems can often be transformed into simpler combinatorial selection problems. The key insight here was realizing that choosing segments is equivalent to choosing points with certain constraints.

2. **Dynamic Programming with optimization:** When your DP recurrence involves summing over previous states, consider using prefix sums to optimize from O(n³) to O(n²) or from O(n²) to O(n).

3. **Modular arithmetic matters:** For counting problems with large results, always work modulo the given prime (usually 10^9+7) to avoid overflow and reduce computation time.

4. **Visualize with small examples:** Before jumping to code, work through small examples by hand. This helps you understand the pattern and catch edge cases.

[Practice this problem on CodeJeet](/problem/number-of-sets-of-k-non-overlapping-line-segments)
