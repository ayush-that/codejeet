---
title: "How to Solve Number of Ways to Rearrange Sticks With K Sticks Visible — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Ways to Rearrange Sticks With K Sticks Visible. Hard difficulty, 60.5% acceptance rate. Topics: Math, Dynamic Programming, Combinatorics."
date: "2029-10-11"
category: "dsa-patterns"
tags:
  [
    "number-of-ways-to-rearrange-sticks-with-k-sticks-visible",
    "math",
    "dynamic-programming",
    "combinatorics",
    "hard",
  ]
---

# How to Solve "Number of Ways to Rearrange Sticks With K Sticks Visible"

This problem asks: given `n` uniquely-sized sticks with lengths from 1 to `n`, how many arrangements exist where exactly `k` sticks are visible from the left? A stick is visible if no longer stick appears to its left. The challenge lies in counting permutations with specific visibility constraints—a combinatorial dynamic programming problem that requires careful state definition and recurrence relation derivation.

## Visual Walkthrough

Let's build intuition with `n = 3, k = 2`. We have sticks of lengths 1, 2, 3. We need arrangements where exactly 2 sticks are visible from the left.

Consider all 3! = 6 permutations:

1. **[1, 2, 3]**: Visible sticks: 1 (all sticks to its right are longer), 2 (3 is longer but to the right), 3 (last stick). That's 3 visible → ❌
2. **[1, 3, 2]**: Visible: 1, 3. 2 is hidden by 3. That's 2 visible → ✅
3. **[2, 1, 3]**: Visible: 2, 3. 1 is hidden by 2. That's 2 visible → ✅
4. **[2, 3, 1]**: Visible: 2, 3. 1 is hidden by 3. That's 2 visible → ✅
5. **[3, 1, 2]**: Visible: 3 only (1 and 2 are shorter and to the right of 3). That's 1 visible → ❌
6. **[3, 2, 1]**: Visible: 3 only. That's 1 visible → ❌

We found 3 valid arrangements: [1,3,2], [2,1,3], [2,3,1]. The pattern emerges: the tallest stick (length n) plays a special role. If placed at position i, it divides the problem into subproblems.

## Brute Force Approach

A naive solution would generate all n! permutations, count visible sticks for each, and return the count where visible equals k. This is straightforward but impossibly slow for n up to 1000 (1000! is astronomically large).

Even with pruning, any approach that enumerates permutations is doomed. We need a combinatorial counting method rather than enumeration.

## Optimized Approach

The key insight: **The tallest stick dominates visibility**. Consider placing the tallest stick (length n) in any position from 1 to n:

1. **If tallest stick is placed at the front (position 1)**:
   - It's always visible (no sticks to its left)
   - It hides all sticks behind it
   - Remaining problem: Arrange n-1 sticks to have k-1 visible sticks

2. **If tallest stick is placed anywhere else (position i > 1)**:
   - It's never visible (a taller stick? No, but it hides all sticks behind it)
   - All sticks before it remain unaffected
   - Remaining problem: Arrange n-1 sticks to have k visible sticks
   - The tallest stick can be placed in any of the n-1 positions (not first)

This gives us a recurrence relation known as the **unsigned Stirling numbers of the first kind**:

```
dp[n][k] = dp[n-1][k-1] + (n-1) * dp[n-1][k]
```

Where:

- `dp[n][k]` = number of ways to arrange n sticks with k visible
- `dp[n-1][k-1]` = tallest stick at front (adds 1 visible)
- `(n-1) * dp[n-1][k]` = tallest stick not at front (in any of n-1 positions, doesn't add visibility)

Base cases:

- `dp[0][0] = 1` (empty arrangement)
- `dp[n][0] = 0` for n > 0 (can't have 0 visible with sticks)
- `dp[0][k] = 0` for k > 0 (no sticks but need visibility)

We compute this with dynamic programming, taking modulo 10^9+7 as required.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n*k) | Space: O(n*k) (can be optimized to O(k))
def rearrangeSticks(n: int, k: int) -> int:
    MOD = 10**9 + 7

    # dp[i][j] = ways to arrange i sticks with j visible
    dp = [[0] * (k + 1) for _ in range(n + 1)]

    # Base case: 0 sticks, 0 visible = 1 way (empty arrangement)
    dp[0][0] = 1

    for i in range(1, n + 1):  # i = number of sticks
        # We only need up to min(i, k) since can't have more visible than sticks
        for j in range(1, min(i, k) + 1):  # j = number of visible sticks
            # Recurrence: dp[i][j] = dp[i-1][j-1] + (i-1) * dp[i-1][j]
            # Case 1: Tallest stick at front -> adds 1 visible
            case1 = dp[i-1][j-1]

            # Case 2: Tallest stick not at front -> in any of (i-1) positions
            # Doesn't add to visible count
            case2 = (i-1) * dp[i-1][j]

            dp[i][j] = (case1 + case2) % MOD

    return dp[n][k] % MOD
```

```javascript
// Time: O(n*k) | Space: O(n*k) (can be optimized to O(k))
function rearrangeSticks(n, k) {
  const MOD = 10 ** 9 + 7;

  // dp[i][j] = ways to arrange i sticks with j visible
  const dp = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0));

  // Base case: 0 sticks, 0 visible = 1 way
  dp[0][0] = 1;

  for (let i = 1; i <= n; i++) {
    // i = number of sticks
    // We only need up to min(i, k) since can't have more visible than sticks
    const maxJ = Math.min(i, k);
    for (let j = 1; j <= maxJ; j++) {
      // j = number of visible sticks
      // Recurrence: dp[i][j] = dp[i-1][j-1] + (i-1) * dp[i-1][j]
      // Case 1: Tallest stick at front -> adds 1 visible
      const case1 = dp[i - 1][j - 1];

      // Case 2: Tallest stick not at front -> in any of (i-1) positions
      // Doesn't add to visible count
      const case2 = (i - 1) * dp[i - 1][j];

      dp[i][j] = (case1 + case2) % MOD;
    }
  }

  return dp[n][k] % MOD;
}
```

```java
// Time: O(n*k) | Space: O(n*k) (can be optimized to O(k))
class Solution {
    public int rearrangeSticks(int n, int k) {
        final int MOD = 1_000_000_007;

        // dp[i][j] = ways to arrange i sticks with j visible
        long[][] dp = new long[n + 1][k + 1];

        // Base case: 0 sticks, 0 visible = 1 way
        dp[0][0] = 1;

        for (int i = 1; i <= n; i++) {  // i = number of sticks
            // We only need up to min(i, k) since can't have more visible than sticks
            int maxJ = Math.min(i, k);
            for (int j = 1; j <= maxJ; j++) {  // j = number of visible sticks
                // Recurrence: dp[i][j] = dp[i-1][j-1] + (i-1) * dp[i-1][j]
                // Case 1: Tallest stick at front -> adds 1 visible
                long case1 = dp[i-1][j-1];

                // Case 2: Tallest stick not at front -> in any of (i-1) positions
                // Doesn't add to visible count
                long case2 = (i-1) * dp[i-1][j];

                dp[i][j] = (case1 + case2) % MOD;
            }
        }

        return (int)(dp[n][k] % MOD);
    }
}
```

</div>

**Space Optimization:** We can reduce space to O(k) by using only the previous row since dp[i] depends only on dp[i-1]:

<div class="code-group">

```python
# Time: O(n*k) | Space: O(k)
def rearrangeSticks(n: int, k: int) -> int:
    MOD = 10**9 + 7

    # dp[j] = ways for current number of sticks with j visible
    dp = [0] * (k + 1)
    dp[0] = 1  # Base case for 0 sticks

    for i in range(1, n + 1):  # Add sticks one by one
        new_dp = [0] * (k + 1)
        for j in range(1, min(i, k) + 1):
            # dp[j-1] corresponds to dp[i-1][j-1]
            # dp[j] corresponds to dp[i-1][j]
            new_dp[j] = (dp[j-1] + (i-1) * dp[j]) % MOD
        dp = new_dp

    return dp[k] % MOD
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k)  
We have nested loops: outer runs n times, inner runs up to k times (or min(i, k)). Each iteration does constant work.

**Space Complexity:** O(n × k) for the 2D DP table, optimizable to O(k) using rolling array.  
We store a table of size (n+1)×(k+1), but only need the previous row to compute the current one.

## Common Mistakes

1. **Not understanding the tallest stick dominance**: Some candidates try to track all sticks' positions. The key insight is that the tallest stick's position determines the subproblem structure.

2. **Incorrect base cases**: Forgetting dp[0][0] = 1 or incorrectly handling dp[n][0]. With 0 sticks, there's exactly 1 way (the empty arrangement) to have 0 visible sticks.

3. **Modulo operation placement**: Applying modulo only at the end can cause integer overflow. Apply modulo after each addition/multiplication, especially with large n (up to 1000).

4. **Index out of bounds**: When j > i, dp[i][j] should be 0 (can't have more visible than sticks). The inner loop should go only to min(i, k).

5. **Confusing with other Stirling numbers**: This uses unsigned Stirling numbers of the first kind. Signed Stirling numbers or second kind won't work here.

## When You'll See This Pattern

This problem exemplifies **combinatorial dynamic programming with recurrence relations based on "largest element" placement**:

1. **Count Ways to Build Rooms in an Ant Colony** (LeetCode 1916): Similar recurrence for counting arrangements based on subtree sizes.

2. **Count Sorted Vowel Strings** (LeetCode 1641): Counting combinatorial objects with constraints, though simpler.

3. **Unique Binary Search Trees** (LeetCode 96): Catalan numbers recurrence—different but similar in using DP to count combinatorial structures.

4. **K Inverse Pairs Array** (LeetCode 629): Counting permutations with specific properties (inverse pairs) using DP with recurrence.

The pattern: When counting permutations/arrangements with constraints, consider placing the largest/smallest element and see how it affects the constraint.

## Key Takeaways

1. **Largest element strategy**: When counting permutations with constraints, placing the largest (or smallest) element often simplifies the problem into subproblems.

2. **Stirling numbers appear in visibility/counting problems**: The recurrence dp[n][k] = dp[n-1][k-1] + (n-1)\*dp[n-1][k] counts permutations with k left-to-right maxima.

3. **Combinatorial DP requires careful base cases**: Pay special attention to n=0, k=0 cases—they're often the foundation of the recurrence.

[Practice this problem on CodeJeet](/problem/number-of-ways-to-rearrange-sticks-with-k-sticks-visible)
