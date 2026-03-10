---
title: "How to Solve Find the Count of Monotonic Pairs I — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Count of Monotonic Pairs I. Hard difficulty, 47.5% acceptance rate. Topics: Array, Math, Dynamic Programming, Combinatorics, Prefix Sum."
date: "2029-11-04"
category: "dsa-patterns"
tags: ["find-the-count-of-monotonic-pairs-i", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Find the Count of Monotonic Pairs I

This problem asks us to count all possible pairs of non-negative integer arrays `(arr1, arr2)` where both arrays have length `n`, `arr1` is non-decreasing, `arr2` is non-increasing, and for every index `i`, `arr1[i] + arr2[i] = nums[i]`. What makes this problem tricky is that we need to count **all possible combinations** while respecting the monotonic constraints, which creates dependencies between adjacent positions. The constraints are quite tight: `n` can be up to 100 and `nums[i]` up to 100, so a brute force approach would be impossible.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 3]`. We need to find all pairs `(arr1, arr2)` where:

- `arr1[0] + arr2[0] = 2`
- `arr1[1] + arr2[1] = 3`
- `arr1[0] ≤ arr1[1]` (non-decreasing)
- `arr2[0] ≥ arr2[1]` (non-increasing)

Let's enumerate possibilities systematically:

For position 0:

- If `arr1[0] = 0`, then `arr2[0] = 2`
- If `arr1[0] = 1`, then `arr2[0] = 1`
- If `arr1[0] = 2`, then `arr2[0] = 0`

Now for position 1, we need to respect both the sum constraint and monotonic constraints:

1. When `(arr1[0], arr2[0]) = (0, 2)`:
   - `arr1[1] ≥ 0` (from `arr1[0] ≤ arr1[1]`)
   - `arr2[1] ≤ 2` (from `arr2[0] ≥ arr2[1]`)
   - `arr1[1] + arr2[1] = 3`

   Valid combinations: `(0,3)` ❌ (arr2[1]=3 > 2), `(1,2)` ✓, `(2,1)` ✓, `(3,0)` ✓
   → 3 valid pairs

2. When `(arr1[0], arr2[0]) = (1, 1)`:
   - `arr1[1] ≥ 1`
   - `arr2[1] ≤ 1`
   - `arr1[1] + arr2[1] = 3`

   Valid combinations: `(2,1)` ✓, `(3,0)` ✓ (but arr2[1]=0 ≤ 1 ✓)
   → 2 valid pairs

3. When `(arr1[0], arr2[0]) = (2, 0)`:
   - `arr1[1] ≥ 2`
   - `arr2[1] ≤ 0`
   - `arr1[1] + arr2[1] = 3`

   Valid combinations: `(3,0)` ✓
   → 1 valid pair

Total: 3 + 2 + 1 = 6 monotonic pairs.

This manual enumeration shows the combinatorial nature of the problem. For larger `n`, we need a systematic way to count without enumerating every possibility.

## Brute Force Approach

A naive approach would try all possible values for `arr1[i]` at each position. Since `arr1[i]` can range from 0 to `nums[i]` (because `arr2[i] = nums[i] - arr1[i]` must be non-negative), we could use recursion to explore all possibilities:

```
For each position i from 0 to n-1:
    For each possible arr1[i] from 0 to nums[i]:
        Check if arr1[i] ≥ arr1[i-1] (for i > 0)
        Check if arr2[i] ≤ arr2[i-1] (for i > 0)
        If valid, recurse to position i+1
```

The problem is the exponential time complexity: at each of `n` positions, we could have up to `max(nums[i]) + 1` choices. With `n=100` and `max(nums[i])=100`, that's roughly `101^100` possibilities — astronomically large. Even with pruning (skipping invalid choices), this is far too slow.

## Optimized Approach

The key insight is that we can use **dynamic programming** with careful state definition. Let's think about what constraints we need to track:

1. At position `i`, we choose `arr1[i] = x`
2. Then `arr2[i] = nums[i] - x`
3. For the next position `i+1`:
   - `arr1[i+1] ≥ x` (non-decreasing constraint on arr1)
   - `arr2[i+1] ≤ nums[i] - x` (non-increasing constraint on arr2)

But `arr2[i+1] = nums[i+1] - arr1[i+1]`, so the second constraint becomes:
`nums[i+1] - arr1[i+1] ≤ nums[i] - x` which simplifies to:
`arr1[i+1] ≥ nums[i+1] - nums[i] + x`

So at position `i+1`, `arr1[i+1]` must satisfy:

- `arr1[i+1] ≥ x` (from arr1 monotonic)
- `arr1[i+1] ≥ nums[i+1] - nums[i] + x` (from arr2 monotonic)
- `arr1[i+1] ≤ nums[i+1]` (since arr2[i+1] must be non-negative)

Thus, `arr1[i+1]` must be at least `max(x, nums[i+1] - nums[i] + x)` and at most `nums[i+1]`.

This gives us our DP state: `dp[i][x]` = number of ways to choose values for positions 0..i such that `arr1[i] = x`.

Transition: `dp[i][x] = sum(dp[i-1][y])` for all `y` where choosing `arr1[i-1] = y` allows `arr1[i] = x`.

But we can optimize further using **prefix sums**. Notice that for a fixed `x` at position `i`, the valid `y` values at position `i-1` form a contiguous range:

- From the constraints above (applied backward), if `arr1[i] = x`, then `arr1[i-1]` must satisfy:
  - `y ≤ x` (from arr1 monotonic: `arr1[i-1] ≤ arr1[i]`)
  - `nums[i-1] - y ≤ nums[i] - x` (from arr2 monotonic: `arr2[i-1] ≥ arr2[i]`)
    → `y ≥ x + nums[i-1] - nums[i]`

So `y` must be in range `[max(0, x + nums[i-1] - nums[i]), min(nums[i-1], x)]`.

Thus, `dp[i][x] = sum(dp[i-1][y])` for `y` in that range. We can compute this quickly using prefix sums on `dp[i-1]`.

## Optimal Solution

We'll implement DP with prefix sums. The algorithm:

1. Initialize `dp[x]` for the first position: `dp[x] = 1` for all `x` from 0 to `nums[0]` (since at position 0, any `arr1[0]` is valid).
2. For each subsequent position `i`, compute new `dp2[x]` for each possible `x` (0 to `nums[i]`):
   - Find the valid range of previous `y` values: `[low, high]`
   - `dp2[x] = prefix[high+1] - prefix[low]` where `prefix` is prefix sum of previous dp
3. Update `dp = dp2` and continue
4. Final answer is sum of `dp[x]` for all `x` at last position

<div class="code-group">

```python
# Time: O(n * M) where M = max(nums[i]), Space: O(M)
def countOfPairs(nums):
    MOD = 10**9 + 7
    n = len(nums)

    # dp[x] = number of ways for current position with arr1[i] = x
    # Initialize for position 0: any x from 0 to nums[0] is valid
    max_val = nums[0]
    dp = [1] * (max_val + 1)

    for i in range(1, n):
        prev_max = nums[i-1]
        curr_max = nums[i]

        # Build prefix sums for previous dp
        prefix = [0] * (prev_max + 2)  # +1 for length, +1 for easier indexing
        for x in range(prev_max + 1):
            prefix[x + 1] = (prefix[x] + dp[x]) % MOD

        # New dp for current position
        new_dp = [0] * (curr_max + 1)

        for x in range(curr_max + 1):
            # Valid range for previous y: y must satisfy:
            # 1. y ≤ x (arr1 non-decreasing)
            # 2. nums[i-1] - y ≤ nums[i] - x (arr2 non-increasing)
            #    → y ≥ x + nums[i-1] - nums[i]
            low = max(0, x + nums[i-1] - nums[i])
            high = min(prev_max, x)

            if low <= high:
                # Sum of dp[y] for y in [low, high]
                new_dp[x] = (prefix[high + 1] - prefix[low]) % MOD

        dp = new_dp

    # Sum all possibilities for the last position
    return sum(dp) % MOD
```

```javascript
// Time: O(n * M) where M = max(nums[i]), Space: O(M)
function countOfPairs(nums) {
  const MOD = 10 ** 9 + 7;
  const n = nums.length;

  // dp[x] = number of ways for current position with arr1[i] = x
  // Initialize for position 0
  let dp = new Array(nums[0] + 1).fill(1);

  for (let i = 1; i < n; i++) {
    const prevMax = nums[i - 1];
    const currMax = nums[i];

    // Build prefix sums for previous dp
    const prefix = new Array(prevMax + 2).fill(0);
    for (let x = 0; x <= prevMax; x++) {
      prefix[x + 1] = (prefix[x] + dp[x]) % MOD;
    }

    // New dp for current position
    const newDp = new Array(currMax + 1).fill(0);

    for (let x = 0; x <= currMax; x++) {
      // Calculate valid range for previous y
      const low = Math.max(0, x + nums[i - 1] - nums[i]);
      const high = Math.min(prevMax, x);

      if (low <= high) {
        // Sum of dp[y] for y in [low, high]
        newDp[x] = (prefix[high + 1] - prefix[low] + MOD) % MOD;
      }
    }

    dp = newDp;
  }

  // Sum all possibilities for the last position
  let result = 0;
  for (let val of dp) {
    result = (result + val) % MOD;
  }
  return result;
}
```

```java
// Time: O(n * M) where M = max(nums[i]), Space: O(M)
public int countOfPairs(int[] nums) {
    final int MOD = 1_000_000_007;
    int n = nums.length;

    // dp[x] = number of ways for current position with arr1[i] = x
    // Initialize for position 0
    int[] dp = new int[nums[0] + 1];
    for (int x = 0; x <= nums[0]; x++) {
        dp[x] = 1;
    }

    for (int i = 1; i < n; i++) {
        int prevMax = nums[i - 1];
        int currMax = nums[i];

        // Build prefix sums for previous dp
        int[] prefix = new int[prevMax + 2];
        for (int x = 0; x <= prevMax; x++) {
            prefix[x + 1] = (prefix[x] + dp[x]) % MOD;
        }

        // New dp for current position
        int[] newDp = new int[currMax + 1];

        for (int x = 0; x <= currMax; x++) {
            // Calculate valid range for previous y
            int low = Math.max(0, x + nums[i - 1] - nums[i]);
            int high = Math.min(prevMax, x);

            if (low <= high) {
                // Sum of dp[y] for y in [low, high]
                newDp[x] = (prefix[high + 1] - prefix[low]) % MOD;
                if (newDp[x] < 0) newDp[x] += MOD;
            }
        }

        dp = newDp;
    }

    // Sum all possibilities for the last position
    int result = 0;
    for (int val : dp) {
        result = (result + val) % MOD;
    }
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × M) where M = max(nums[i])

- We iterate through n positions
- For each position, we iterate through up to M+1 possible values of x
- For each x, we compute the range and do constant-time prefix sum lookup
- Building prefix sums takes O(M) per position

**Space Complexity:** O(M)

- We maintain dp arrays of size up to M+1
- We maintain a prefix array of similar size
- We don't need to keep all rows of DP, just the previous one

With constraints n ≤ 100 and nums[i] ≤ 100, this is efficient: 100 × 100 = 10,000 operations.

## Common Mistakes

1. **Forgetting modulo operations**: The count can be huge, so we need modulo 10^9+7 at every addition/subtraction. A common mistake is to apply modulo only at the end, causing integer overflow.

2. **Incorrect range calculation**: The derivation of `low = max(0, x + nums[i-1] - nums[i])` is subtle. Candidates often get the inequality direction wrong when converting `arr2[i-1] ≥ arr2[i]` to a constraint on `y`.

3. **Off-by-one errors in prefix sums**: When using prefix sums, remember that `prefix[r+1] - prefix[l]` gives sum of elements l..r. Using `prefix[r] - prefix[l]` would exclude element r.

4. **Not handling negative low bound correctly**: `low` could be negative if `x + nums[i-1] - nums[i] < 0`, but array indices can't be negative. That's why we take `max(0, ...)`.

## When You'll See This Pattern

This DP-with-range-query pattern appears in problems where:

1. The state transition involves summing over a contiguous range of previous states
2. The valid range can be computed from current parameters

Similar problems:

- **Count Number of Texts** (LeetCode 2266): Counting ways to decode with constraints on consecutive characters, using DP with prefix sums.
- **Number of Ways to Separate Numbers** (LeetCode 1977): Counting ways to split string into increasing numbers, using DP with range queries.
- **K-Concatenation Maximum Sum** (LeetCode 1191): While not identical, it uses similar prefix/suffix sum techniques for optimization.

## Key Takeaways

1. **When constraints create dependencies between adjacent positions, think DP**: The monotonic constraints link `arr1[i]` with `arr1[i-1]` and `arr2[i]` with `arr2[i-1]`, making DP a natural fit.

2. **Prefix sums optimize range queries**: If your DP transition sums over a contiguous range of previous states, prefix sums can reduce O(M) summation to O(1) lookup.

3. **Derive constraints carefully**: Convert all constraints to inequalities involving the variable you're tracking (here, `arr1[i]`). Simplify algebraically to find the exact valid range.

Related problems: [Monotonic Array](/problem/monotonic-array)
