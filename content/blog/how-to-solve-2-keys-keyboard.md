---
title: "How to Solve 2 Keys Keyboard — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode 2 Keys Keyboard. Medium difficulty, 59.3% acceptance rate. Topics: Math, Dynamic Programming."
date: "2028-01-21"
category: "dsa-patterns"
tags: ["2-keys-keyboard", "math", "dynamic-programming", "medium"]
---

# How to Solve 2 Keys Keyboard

You start with a single 'A' on screen and can only perform two operations: copy all current characters (copy) or paste the last copied characters (paste). Given a target number `n`, find the minimum number of operations needed to get exactly `n` 'A's on screen. The challenge lies in recognizing that this isn't about simulating every possible sequence, but understanding the mathematical structure behind efficient copy-paste strategies.

## Visual Walkthrough

Let's trace through `n = 6` to build intuition:

**Goal**: Reach exactly 6 'A's with minimum operations.

**Step-by-step reasoning**:

1. Start: `'A'` (1 character)
2. We need to build up to 6. What's the most efficient way?
   - If we copy the single 'A' and paste repeatedly: copy (1) + paste (1) → 2 'A's, then copy (1) + paste (1) → 3 'A's... This would take many operations.
   - Better: Build in factors. Since 6 = 2 × 3, we can build to 2 'A's first, then triple that.

**Efficient sequence for n = 6**:

1. Start: `'A'` (1)
2. Copy all (1 op): clipboard = `'A'`
3. Paste (1 op): `'AA'` (2 total) → 2 ops used
4. Copy all (1 op): clipboard = `'AA'`
5. Paste (1 op): `'AAAA'` (4 total) → 4 ops used
6. Paste (1 op): `'AAAAAA'` (6 total) → 5 ops used

Total: 5 operations.

But wait — is this optimal? Let's check another approach:

1. Start: `'A'` (1)
2. Copy all (1): clipboard = `'A'`
3. Paste (1): `'AA'` (2) → 2 ops
4. Copy all (1): clipboard = `'AA'`
5. Paste (1): `'AAAA'` (4) → 3 ops
6. Copy all (1): clipboard = `'AAAA'`
7. Paste (1): `'AAAAAAAA'` (8) → Oops, we overshot! We need exactly 6.

Actually, the first sequence (5 ops) works, but there's an even better one:

1. Start: `'A'` (1)
2. Copy all (1): clipboard = `'A'`
3. Paste (1): `'AA'` (2) → 2 ops
4. Copy all (1): clipboard = `'AA'`
5. Paste (1): `'AAAA'` (4) → 3 ops
6. Paste (1): `'AAAAAA'` (6) → 4 ops? Wait, that's 5 ops total (1+1+1+1+1).

Let me recount properly:

- Operation 1: Copy (1 op)
- Operation 2: Paste (1 op) → 2 'A's, total 2 ops
- Operation 3: Copy (1 op) → total 3 ops
- Operation 4: Paste (1 op) → 4 'A's, total 4 ops
- Operation 5: Paste (1 op) → 6 'A's, total 5 ops

So 5 operations is correct. The key insight: we built 2 'A's first (took 2 ops: copy + paste), then used those 2 'A's as a building block to get to 6. Notice that 6 ÷ 2 = 3, so we needed 2 more pastes after copying the 2 'A's (1 copy + 2 pastes = 3 ops). Total: 2 + 3 = 5.

What if we build 3 'A's first?

1. Start: `'A'` (1)
2. Copy (1): clipboard = `'A'`
3. Paste (1): `'AA'` (2) → 2 ops
4. Paste (1): `'AAA'` (3) → 3 ops
5. Copy (1): clipboard = `'AAA'` → 4 ops
6. Paste (1): `'AAAAAA'` (6) → 5 ops

Same result! So 5 is indeed minimal. This shows the pattern: to reach `n`, we find factors and build recursively.

## Brute Force Approach

A naive approach would be to simulate all possible sequences of copy and paste operations using BFS or DFS. Each state would track: current number of 'A's on screen, current number in clipboard, and operations count. We'd explore all paths until we reach exactly `n` 'A's.

Why this fails:

- The state space grows exponentially. For `n = 1000`, there are thousands of possible states at each step.
- We'd need to track visited states to avoid cycles, but even then, the branching factor is large.
- The problem constraints (1 ≤ n ≤ 1000) make exponential solutions impractical.

The brute force helps us understand the problem structure but isn't viable for the given constraints.

## Optimized Approach

The key insight comes from observing how copy-paste works mathematically:

1. **Copy operation** captures ALL current characters. This means you can only paste multiples of your current count.
2. **Paste operation** adds the clipboard content. If you have `k` 'A's and clipboard contains `k` 'A's, pasting gives you `2k` 'A's.
3. **Optimal strategy**: To reach `n` 'A's efficiently, you should build intermediate amounts that are factors of `n`.

Think recursively: If we want `n` 'A's and `d` is the largest proper divisor of `n` (other than 1), then:

- First, reach `d` 'A's optimally (takes `minSteps(d)` operations)
- Then copy all (1 operation)
- Then paste `(n/d - 1)` times (each paste is 1 operation)

So: `minSteps(n) = minSteps(d) + 1 + (n/d - 1) = minSteps(d) + n/d`

But what if `n` is prime? Then the only divisor is 1, so:

- Start with 1 'A'
- Copy (1 op)
- Paste `(n-1)` times (n-1 ops)
  Total: `n` operations

This gives us a recursive formula:

- If `n` is prime: `minSteps(n) = n`
- If `n` is composite: `minSteps(n) = minSteps(d) + n/d` where `d` is the largest proper divisor

We can implement this recursively with memoization, or better yet, use dynamic programming from the bottom up.

## Optimal Solution

We can solve this with dynamic programming: `dp[i]` = minimum steps to get `i` 'A's.

Base case: `dp[1] = 0` (we start with 1 'A', no operations needed)

For each `i` from 2 to `n`:

- Try all possible divisors `j` of `i` where `j < i`
- If `i % j == 0`, then we can reach `i` by:
  1. First reach `j` 'A's (takes `dp[j]` steps)
  2. Copy all (1 step)
  3. Paste `(i/j - 1)` times (each is 1 step)
     Total: `dp[j] + 1 + (i/j - 1) = dp[j] + i/j`
- Take the minimum over all such `j`

We can optimize by only checking divisors up to `√i`, but the straightforward approach is clear enough for the constraints.

<div class="code-group">

```python
# Time: O(n√n) | Space: O(n)
def minSteps(n):
    """
    Returns minimum number of operations to get n 'A's.

    Approach: Dynamic programming where dp[i] = min steps for i 'A's.
    For each i, try all divisors j and compute dp[j] + i/j.
    """
    # dp[i] will store minimum steps to get i 'A's
    dp = [0] * (n + 1)

    # Base case: we start with 1 'A', so 0 steps needed
    dp[1] = 0

    # Fill dp array from 2 to n
    for i in range(2, n + 1):
        # Initialize with worst case: copy 1 'A' and paste (i-1) times
        dp[i] = i

        # Try all possible divisors j of i (where j < i)
        # We only need to check up to i//2 since j must be < i
        for j in range(1, i // 2 + 1):
            if i % j == 0:
                # If j divides i, we can:
                # 1. Get to j 'A's (dp[j] steps)
                # 2. Copy all (1 step)
                # 3. Paste (i/j - 1) times
                # Total: dp[j] + i/j
                dp[i] = min(dp[i], dp[j] + i // j)

    return dp[n]
```

```javascript
// Time: O(n√n) | Space: O(n)
function minSteps(n) {
  /**
   * Returns minimum number of operations to get n 'A's.
   *
   * Approach: Dynamic programming where dp[i] = min steps for i 'A's.
   * For each i, try all divisors j and compute dp[j] + i/j.
   */

  // dp[i] will store minimum steps to get i 'A's
  const dp = new Array(n + 1).fill(0);

  // Base case: we start with 1 'A', so 0 steps needed
  dp[1] = 0;

  // Fill dp array from 2 to n
  for (let i = 2; i <= n; i++) {
    // Initialize with worst case: copy 1 'A' and paste (i-1) times
    dp[i] = i;

    // Try all possible divisors j of i (where j < i)
    // We only need to check up to i/2 since j must be < i
    for (let j = 1; j <= Math.floor(i / 2); j++) {
      if (i % j === 0) {
        // If j divides i, we can:
        // 1. Get to j 'A's (dp[j] steps)
        // 2. Copy all (1 step)
        // 3. Paste (i/j - 1) times
        // Total: dp[j] + i/j
        dp[i] = Math.min(dp[i], dp[j] + i / j);
      }
    }
  }

  return dp[n];
}
```

```java
// Time: O(n√n) | Space: O(n)
class Solution {
    public int minSteps(int n) {
        /**
         * Returns minimum number of operations to get n 'A's.
         *
         * Approach: Dynamic programming where dp[i] = min steps for i 'A's.
         * For each i, try all divisors j and compute dp[j] + i/j.
         */

        // dp[i] will store minimum steps to get i 'A's
        int[] dp = new int[n + 1];

        // Base case: we start with 1 'A', so 0 steps needed
        dp[1] = 0;

        // Fill dp array from 2 to n
        for (int i = 2; i <= n; i++) {
            // Initialize with worst case: copy 1 'A' and paste (i-1) times
            dp[i] = i;

            // Try all possible divisors j of i (where j < i)
            // We only need to check up to i/2 since j must be < i
            for (int j = 1; j <= i / 2; j++) {
                if (i % j == 0) {
                    // If j divides i, we can:
                    // 1. Get to j 'A's (dp[j] steps)
                    // 2. Copy all (1 step)
                    // 3. Paste (i/j - 1) times
                    // Total: dp[j] + i/j
                    dp[i] = Math.min(dp[i], dp[j] + i / j);
                }
            }
        }

        return dp[n];
    }
}
```

</div>

**Even more optimized approach**: We can solve this in O(n) time using prime factorization. Notice that `minSteps(n) = sum of prime factors of n`. For example:

- `n = 6 = 2 × 3` → `minSteps = 2 + 3 = 5`
- `n = 9 = 3 × 3` → `minSteps = 3 + 3 = 6`
- `n = 7` (prime) → `minSteps = 7`

Why does this work? Because breaking `n` into its prime factors corresponds to the optimal copy-paste strategy: each prime factor `p` represents building a block of size `p` and then using it as a building block.

<div class="code-group">

```python
# Time: O(√n) | Space: O(1)
def minSteps(n):
    """
    Returns minimum number of operations to get n 'A's.

    Optimal approach: minSteps(n) = sum of prime factors of n.
    This works because each prime factor corresponds to a
    copy-paste sequence in the optimal strategy.
    """
    result = 0
    factor = 2

    # Factorize n
    while n > 1:
        # While current factor divides n
        while n % factor == 0:
            result += factor  # Add factor to result
            n //= factor      # Divide n by factor
        factor += 1

    return result
```

```javascript
// Time: O(√n) | Space: O(1)
function minSteps(n) {
  /**
   * Returns minimum number of operations to get n 'A's.
   *
   * Optimal approach: minSteps(n) = sum of prime factors of n.
   * This works because each prime factor corresponds to a
   * copy-paste sequence in the optimal strategy.
   */
  let result = 0;
  let factor = 2;

  // Factorize n
  while (n > 1) {
    // While current factor divides n
    while (n % factor === 0) {
      result += factor; // Add factor to result
      n /= factor; // Divide n by factor
    }
    factor++;
  }

  return result;
}
```

```java
// Time: O(√n) | Space: O(1)
class Solution {
    public int minSteps(int n) {
        /**
         * Returns minimum number of operations to get n 'A's.
         *
         * Optimal approach: minSteps(n) = sum of prime factors of n.
         * This works because each prime factor corresponds to a
         * copy-paste sequence in the optimal strategy.
         */
        int result = 0;
        int factor = 2;

        // Factorize n
        while (n > 1) {
            // While current factor divides n
            while (n % factor == 0) {
                result += factor;  // Add factor to result
                n /= factor;       // Divide n by factor
            }
            factor++;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Dynamic Programming Approach**:

- **Time**: O(n√n) — For each `i` from 2 to `n`, we check divisors up to `i/2`, which is O(n) per number in worst case. More precisely, checking divisors up to `√i` would give O(n√n).
- **Space**: O(n) for the DP array.

**Prime Factorization Approach**:

- **Time**: O(√n) — We only need to check factors up to √n. Even though we increment factor by 1 each time, once we pass √n, the remaining `n` will be prime.
- **Space**: O(1) — We only use a few variables.

The prime factorization approach is clearly superior and should be preferred in interviews.

## Common Mistakes

1. **Forgetting the copy operation**: Some candidates think `minSteps(n) = n-1` (just paste n-1 times). But you need to copy first! The actual minimum for prime `n` is `n` (1 copy + n-1 pastes).

2. **Not considering all divisors**: When using DP, candidates might only check the largest divisor or divisors close to `i`. You must check ALL divisors to find the minimum.

3. **Incorrect base case**: `dp[1] = 1` is wrong — we start with 1 'A', so we need 0 operations to have 1 'A'.

4. **Integer division errors**: In Java/JavaScript, ensure you use integer division (`i/j` not `i/j` with floats). The prime factorization approach avoids this issue.

5. **Overcomplicating with BFS/DFS**: Candidates often try to simulate all sequences, which is exponential and times out. Recognize the mathematical pattern early.

## When You'll See This Pattern

This problem teaches **mathematical decomposition** and **factorization thinking**. Similar patterns appear in:

1. **4 Keys Keyboard (LeetCode 651)**: Extended version with more operations (print 'A', copy, paste, select all). Also requires thinking about optimal sequences and factorization.

2. **Broken Calculator (LeetCode 991)**: Working backwards from target to start using division/multiplication, similar to our factorization approach.

3. **Smallest Value After Replacing With Sum of Prime Factors (LeetCode 2507)**: Directly involves prime factorization and iterative replacement.

4. **Integer Break (LeetCode 343)**: Breaking an integer into parts to maximize product, which also involves factorization insights.

These problems all involve breaking a target into components (factors) and finding optimal ways to build up or break down.

## Key Takeaways

1. **Look for mathematical structure**: When operations have multiplicative effects (like copy-paste doubling/tripling counts), think in terms of factors and divisors rather than simulating sequences.

2. **Prime factorization is powerful**: Many number theory problems reduce to understanding prime factors. The sum of prime factors often has combinatorial interpretations.

3. **Work backwards or decompose**: Instead of building from 1 to n, think about how you could have reached n from a divisor. This recursive/DP thinking applies to many optimization problems.

4. **Test small cases**: Tracing through examples like n=6, n=8, n=9 reveals the pattern that minSteps equals the sum of prime factors.

Related problems: [4 Keys Keyboard](/problem/4-keys-keyboard), [Broken Calculator](/problem/broken-calculator), [Smallest Value After Replacing With Sum of Prime Factors](/problem/smallest-value-after-replacing-with-sum-of-prime-factors)
