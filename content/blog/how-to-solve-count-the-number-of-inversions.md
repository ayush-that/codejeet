---
title: "How to Solve Count the Number of Inversions — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count the Number of Inversions. Hard difficulty, 29.7% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-05-28"
category: "dsa-patterns"
tags: ["count-the-number-of-inversions", "array", "dynamic-programming", "hard"]
---

# How to Solve Count the Number of Inversions

This problem asks us to count valid permutations of numbers 1 through `n` that satisfy multiple inversion count requirements. Each requirement specifies that up to a certain ending index, the permutation must have exactly a given number of inversions. The challenge lies in efficiently counting permutations that simultaneously satisfy all constraints, which requires careful dynamic programming with prefix sums.

## Visual Walkthrough

Let's walk through a small example: `n = 3` with requirements `[[2, 1]]`. This means we need permutations of [1, 2, 3] where the first 2 elements have exactly 1 inversion.

First, let's list all permutations of [1, 2, 3]:

1. [1, 2, 3] - First 2 elements: [1, 2] → 0 inversions ❌
2. [1, 3, 2] - First 2 elements: [1, 3] → 0 inversions ❌
3. [2, 1, 3] - First 2 elements: [2, 1] → 1 inversion ✅
4. [2, 3, 1] - First 2 elements: [2, 3] → 0 inversions ❌
5. [3, 1, 2] - First 2 elements: [3, 1] → 1 inversion ✅
6. [3, 2, 1] - First 2 elements: [3, 2] → 1 inversion ✅

We have 3 valid permutations: [2, 1, 3], [3, 1, 2], and [3, 2, 1].

Now let's think about how to build this systematically. When we insert a new number `i` into a permutation of size `i-1`, we can place it in different positions. If we place it at position `k` (0-indexed from the right), it creates `k` new inversions because it's smaller than all `k` elements to its right.

## Brute Force Approach

A brute force approach would generate all `n!` permutations and check each one against all requirements. For each permutation, we'd need to:

1. Count inversions up to each required end index
2. Verify all counts match the requirements

This approach has factorial time complexity `O(n! * m * n²)` where `m` is the number of requirements. Even for `n = 10`, we'd have over 3.6 million permutations to check, which is clearly infeasible.

The key insight is that we don't need to generate all permutations - we can count them using dynamic programming. We need to track how many inversions we have as we build the permutation incrementally.

## Optimized Approach

The optimal solution uses dynamic programming with prefix sums. Here's the reasoning:

1. **State Definition**: Let `dp[i][j]` represent the number of permutations of the first `i` numbers (1 through `i`) that have exactly `j` inversions.

2. **Transition**: When we add number `i` to a permutation of size `i-1`, we can insert it in `i` possible positions (0 through `i-1` from the right). Inserting at position `k` creates `k` new inversions. So:

   ```
   dp[i][j] = sum(dp[i-1][j-k] for k = 0 to min(j, i-1))
   ```

   This means to get `j` inversions with `i` numbers, we can take permutations with `i-1` numbers that had `j-k` inversions and insert `i` in a position that creates `k` new inversions.

3. **Prefix Sum Optimization**: The naive DP would be `O(n³)` due to the summation. We can optimize to `O(n²)` using prefix sums. Let `prefix[i][j] = sum(dp[i][0] + ... + dp[i][j])`. Then:

   ```
   dp[i][j] = prefix[i-1][j] - prefix[i-1][j-i] (if j >= i)
   ```

   This gives us `O(1)` access to the sum we need.

4. **Handling Requirements**: We process requirements in order of increasing end index. For each requirement `(end, cnt)`, we only keep DP states that satisfy it. We can do this by zeroing out invalid states after processing each requirement.

5. **Maximum Inversions**: The maximum possible inversions with `i` numbers is `i*(i-1)/2`. We only need to compute DP up to this limit.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2 + m) where n is the max number, m is number of requirements
# Space: O(n^2) for the DP table
def numberOfPermutations(n: int, requirements: List[List[int]]) -> int:
    MOD = 10**9 + 7

    # Sort requirements by end index
    requirements.sort()

    # Initialize DP table: dp[i][j] = permutations of first i numbers with j inversions
    max_inv = n * (n - 1) // 2  # maximum possible inversions
    dp = [[0] * (max_inv + 1) for _ in range(n + 1)]
    dp[0][0] = 1  # empty permutation has 0 inversions

    # Track the last requirement processed
    last_end = 0

    # Process each requirement
    for end, cnt in requirements:
        # Fill DP for sizes from last_end + 1 to end
        for i in range(last_end + 1, end + 1):
            # Use prefix sum for efficient calculation
            prefix = [0] * (max_inv + 2)
            # Build prefix sum for previous row
            for j in range(max_inv + 1):
                prefix[j + 1] = (prefix[j] + dp[i - 1][j]) % MOD

            # Calculate dp[i][j] using prefix sums
            for j in range(max_inv + 1):
                # dp[i][j] = sum(dp[i-1][j-k] for k = 0 to min(j, i-1))
                # Using prefix sums: prefix[j+1] - prefix[max(0, j-i+1)]
                min_k = max(0, j - i + 1)
                dp[i][j] = (prefix[j + 1] - prefix[min_k]) % MOD

        # Zero out invalid states for current requirement
        for j in range(max_inv + 1):
            if j != cnt:
                dp[end][j] = 0

        last_end = end

    # Fill remaining sizes up to n
    for i in range(last_end + 1, n + 1):
        # Use prefix sum for efficient calculation
        prefix = [0] * (max_inv + 2)
        for j in range(max_inv + 1):
            prefix[j + 1] = (prefix[j] + dp[i - 1][j]) % MOD

        for j in range(max_inv + 1):
            min_k = max(0, j - i + 1)
            dp[i][j] = (prefix[j + 1] - prefix[min_k]) % MOD

    # Sum all valid permutations of size n
    # If there are requirements for size n, only count those with correct inversion count
    if requirements and requirements[-1][0] == n:
        cnt = requirements[-1][1]
        return dp[n][cnt] % MOD
    else:
        # Sum all possible inversion counts
        return sum(dp[n]) % MOD
```

```javascript
// Time: O(n^2 + m) where n is the max number, m is number of requirements
// Space: O(n^2) for the DP table
function numberOfPermutations(n, requirements) {
  const MOD = 10 ** 9 + 7;

  // Sort requirements by end index
  requirements.sort((a, b) => a[0] - b[0]);

  // Initialize DP table
  const maxInv = (n * (n - 1)) / 2;
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(maxInv + 1).fill(0));
  dp[0][0] = 1; // empty permutation

  let lastEnd = 0;

  // Process each requirement
  for (const [end, cnt] of requirements) {
    // Fill DP for sizes from lastEnd + 1 to end
    for (let i = lastEnd + 1; i <= end; i++) {
      // Build prefix sum for previous row
      const prefix = Array(maxInv + 2).fill(0);
      for (let j = 0; j <= maxInv; j++) {
        prefix[j + 1] = (prefix[j] + dp[i - 1][j]) % MOD;
      }

      // Calculate dp[i][j] using prefix sums
      for (let j = 0; j <= maxInv; j++) {
        const minK = Math.max(0, j - i + 1);
        dp[i][j] = (prefix[j + 1] - prefix[minK] + MOD) % MOD;
      }
    }

    // Zero out invalid states for current requirement
    for (let j = 0; j <= maxInv; j++) {
      if (j !== cnt) {
        dp[end][j] = 0;
      }
    }

    lastEnd = end;
  }

  // Fill remaining sizes up to n
  for (let i = lastEnd + 1; i <= n; i++) {
    // Build prefix sum for previous row
    const prefix = Array(maxInv + 2).fill(0);
    for (let j = 0; j <= maxInv; j++) {
      prefix[j + 1] = (prefix[j] + dp[i - 1][j]) % MOD;
    }

    // Calculate dp[i][j] using prefix sums
    for (let j = 0; j <= maxInv; j++) {
      const minK = Math.max(0, j - i + 1);
      dp[i][j] = (prefix[j + 1] - prefix[minK] + MOD) % MOD;
    }
  }

  // Return result based on whether there's a requirement for size n
  if (requirements.length > 0 && requirements[requirements.length - 1][0] === n) {
    const cnt = requirements[requirements.length - 1][1];
    return dp[n][cnt] % MOD;
  } else {
    // Sum all possible inversion counts
    let result = 0;
    for (let j = 0; j <= maxInv; j++) {
      result = (result + dp[n][j]) % MOD;
    }
    return result;
  }
}
```

```java
// Time: O(n^2 + m) where n is the max number, m is number of requirements
// Space: O(n^2) for the DP table
class Solution {
    public int numberOfPermutations(int n, int[][] requirements) {
        final int MOD = 1_000_000_007;

        // Sort requirements by end index
        Arrays.sort(requirements, (a, b) -> Integer.compare(a[0], b[0]));

        // Initialize DP table
        int maxInv = n * (n - 1) / 2;
        int[][] dp = new int[n + 1][maxInv + 1];
        dp[0][0] = 1;  // empty permutation

        int lastEnd = 0;

        // Process each requirement
        for (int[] req : requirements) {
            int end = req[0];
            int cnt = req[1];

            // Fill DP for sizes from lastEnd + 1 to end
            for (int i = lastEnd + 1; i <= end; i++) {
                // Build prefix sum for previous row
                int[] prefix = new int[maxInv + 2];
                for (int j = 0; j <= maxInv; j++) {
                    prefix[j + 1] = (prefix[j] + dp[i - 1][j]) % MOD;
                }

                // Calculate dp[i][j] using prefix sums
                for (int j = 0; j <= maxInv; j++) {
                    int minK = Math.max(0, j - i + 1);
                    dp[i][j] = (prefix[j + 1] - prefix[minK]) % MOD;
                    if (dp[i][j] < 0) dp[i][j] += MOD;
                }
            }

            // Zero out invalid states for current requirement
            for (int j = 0; j <= maxInv; j++) {
                if (j != cnt) {
                    dp[end][j] = 0;
                }
            }

            lastEnd = end;
        }

        // Fill remaining sizes up to n
        for (int i = lastEnd + 1; i <= n; i++) {
            // Build prefix sum for previous row
            int[] prefix = new int[maxInv + 2];
            for (int j = 0; j <= maxInv; j++) {
                prefix[j + 1] = (prefix[j] + dp[i - 1][j]) % MOD;
            }

            // Calculate dp[i][j] using prefix sums
            for (int j = 0; j <= maxInv; j++) {
                int minK = Math.max(0, j - i + 1);
                dp[i][j] = (prefix[j + 1] - prefix[minK]) % MOD;
                if (dp[i][j] < 0) dp[i][j] += MOD;
            }
        }

        // Return result based on whether there's a requirement for size n
        if (requirements.length > 0 && requirements[requirements.length - 1][0] == n) {
            int cnt = requirements[requirements.length - 1][1];
            return dp[n][cnt] % MOD;
        } else {
            // Sum all possible inversion counts
            int result = 0;
            for (int j = 0; j <= maxInv; j++) {
                result = (result + dp[n][j]) % MOD;
            }
            return result;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: `O(n² + m)` where `n` is the given number and `m` is the number of requirements.

- We have `n` iterations for building permutations of different sizes
- For each size `i`, we compute DP values for up to `O(i²)` inversion counts (since max inversions is `i*(i-1)/2`)
- The prefix sum optimization reduces the inner summation from `O(i)` to `O(1)`
- Sorting requirements takes `O(m log m)`, but since `m ≤ n`, this is dominated by `O(n²)`

**Space Complexity**: `O(n²)` for the DP table storing permutations counts for each size and inversion count.

- We store `(n+1) × (maxInv+1)` values where `maxInv = n*(n-1)/2`
- In practice, we could optimize to `O(n²)` by only storing two rows at a time, but the current implementation is clearer

## Common Mistakes

1. **Not sorting requirements**: Requirements can come in any order, but we need to process them in increasing order of end index. Failing to sort will lead to incorrect zeroing of DP states.

2. **Forgetting to handle negative modulo values**: When subtracting prefix sums, the result can be negative. We need to add `MOD` and take modulo again to ensure positive results.

3. **Incorrect bounds for prefix sum calculation**: The formula `min_k = max(0, j-i+1)` is crucial. This comes from the fact that when inserting number `i`, we can create at most `i-1` new inversions, so we can only use states from `dp[i-1][j-(i-1)]` to `dp[i-1][j]`.

4. **Not handling the case with no requirements for size n**: If there's no requirement specifying the inversion count for the full permutation, we need to sum over all possible inversion counts for size `n`.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Counting permutations with constraints**: Similar to "K Inverse Pairs Array" (LeetCode 629), which counts permutations with exactly k inverse pairs. The DP transition is identical.

2. **DP with prefix sum optimization**: When the DP transition involves summing over a range of previous states, prefix sums can optimize from `O(k)` to `O(1)` per state. This pattern appears in problems like "Number of Dice Rolls With Target Sum" (LeetCode 1155).

3. **Multiple constraints processing**: Processing requirements in order and zeroing invalid states is similar to problems with multiple conditions that need to be satisfied simultaneously, like "Student Attendance Record II" (LeetCode 552).

## Key Takeaways

1. **Incremental construction is powerful**: When counting permutations, building them incrementally by inserting numbers one by one often leads to efficient DP solutions.

2. **Prefix sums optimize range sums in DP**: If your DP transition sums over a contiguous range of previous states, prefix sums can reduce the complexity significantly.

3. **Process constraints in order**: When dealing with multiple constraints on prefixes, process them in increasing order of the prefix length to efficiently prune invalid states.

Related problems: [K Inverse Pairs Array](/problem/k-inverse-pairs-array)
