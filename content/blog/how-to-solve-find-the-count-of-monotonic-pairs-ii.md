---
title: "How to Solve Find the Count of Monotonic Pairs II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Count of Monotonic Pairs II. Hard difficulty, 24.6% acceptance rate. Topics: Array, Math, Dynamic Programming, Combinatorics, Prefix Sum."
date: "2026-07-03"
category: "dsa-patterns"
tags: ["find-the-count-of-monotonic-pairs-ii", "array", "math", "dynamic-programming", "hard"]
---

# How to Solve Find the Count of Monotonic Pairs II

This problem asks us to count all possible pairs of arrays `(arr1, arr2)` where both arrays have length `n`, `arr1` is non-decreasing, `arr2` is non-increasing, and for every index `i`, `arr1[i] + arr2[i] = nums[i]`. The challenge comes from the constraints: `nums` contains positive integers up to 10^9, and `n` can be up to 10^5. The combinatorial explosion makes brute force impossible, requiring a clever dynamic programming approach with prefix sums.

## Visual Walkthrough

Let's trace through a small example: `nums = [3, 5, 4]`. We need to find all `(arr1, arr2)` pairs satisfying:

1. `arr1[0] ≤ arr1[1] ≤ arr1[2]` (non-decreasing)
2. `arr2[0] ≥ arr2[1] ≥ arr2[2]` (non-increasing)
3. `arr1[i] + arr2[i] = nums[i]` for all `i`

Since `arr2[i] = nums[i] - arr1[i]`, we can rewrite condition 2 in terms of `arr1`:

- `arr2[0] ≥ arr2[1]` → `nums[0] - arr1[0] ≥ nums[1] - arr1[1]` → `arr1[1] - arr1[0] ≥ nums[1] - nums[0]`
- `arr2[1] ≥ arr2[2]` → `nums[1] - arr1[1] ≥ nums[2] - arr1[2]` → `arr1[2] - arr1[1] ≥ nums[2] - nums[1]`

So we have three constraints on `arr1`:

1. `arr1[0] ≤ arr1[1] ≤ arr1[2]` (original non-decreasing)
2. `arr1[1] - arr1[0] ≥ nums[1] - nums[0] = 5 - 3 = 2`
3. `arr1[2] - arr1[1] ≥ nums[2] - nums[1] = 4 - 5 = -1` (this is automatically satisfied since `arr1[2] ≥ arr1[1]`)

Also, `arr1[i]` must be between 0 and `nums[i]` (since `arr2[i] = nums[i] - arr1[i]` must be non-negative).

Let's find valid `arr1` values:

- `arr1[0]` can be 0, 1, 2, or 3
- For each `arr1[0]`, `arr1[1]` must satisfy:
  - `arr1[1] ≥ arr1[0]` (non-decreasing)
  - `arr1[1] ≥ arr1[0] + 2` (from constraint 2)
  - `arr1[1] ≤ 5` (since `arr1[1] ≤ nums[1]`)
- Then for each `arr1[1]`, `arr1[2]` must satisfy:
  - `arr1[2] ≥ arr1[1]` (non-decreasing)
  - `arr1[2] ≤ 4` (since `arr1[2] ≤ nums[2]`)

Let's count systematically:

- If `arr1[0] = 0`: `arr1[1]` must be ≥ 2 and ≤ 5 → values {2,3,4,5}
  - For `arr1[1] = 2`: `arr1[2]` must be ≥ 2 and ≤ 4 → values {2,3,4} → 3 pairs
  - For `arr1[1] = 3`: `arr1[2]` ≥ 3 and ≤ 4 → {3,4} → 2 pairs
  - For `arr1[1] = 4`: `arr1[2]` ≥ 4 and ≤ 4 → {4} → 1 pair
  - For `arr1[1] = 5`: `arr1[2]` ≥ 5 and ≤ 4 → impossible → 0 pairs
  - Total for `arr1[0] = 0`: 3+2+1 = 6 pairs

- If `arr1[0] = 1`: `arr1[1]` ≥ 3 and ≤ 5 → {3,4,5}
  - `arr1[1] = 3`: `arr1[2]` ≥ 3 and ≤ 4 → {3,4} → 2 pairs
  - `arr1[1] = 4`: `arr1[2]` ≥ 4 and ≤ 4 → {4} → 1 pair
  - `arr1[1] = 5`: impossible → 0 pairs
  - Total: 2+1 = 3 pairs

- If `arr1[0] = 2`: `arr1[1]` ≥ 4 and ≤ 5 → {4,5}
  - `arr1[1] = 4`: `arr1[2]` ≥ 4 and ≤ 4 → {4} → 1 pair
  - `arr1[1] = 5`: impossible → 0 pairs
  - Total: 1 pair

- If `arr1[0] = 3`: `arr1[1]` ≥ 5 and ≤ 5 → {5}
  - `arr1[1] = 5`: impossible for `arr1[2]` → 0 pairs
  - Total: 0 pairs

Total valid pairs: 6 + 3 + 1 + 0 = 10. Each `arr1` uniquely determines `arr2`, so we have 10 monotonic pairs.

## Brute Force Approach

The brute force approach would try all possible values for `arr1[0]` (0 to `nums[0]`), then for each, try all possible values for `arr1[1]` satisfying the constraints, and so on. This leads to exponential time complexity O(M^n) where M is the maximum value in `nums`. Even for small `n`, this is infeasible since `nums[i]` can be up to 10^9.

A slightly better brute force would use recursion with memoization on `(index, prev_arr1_value)`, but the state space is still O(n × max(nums)) which is 10^5 × 10^9 = 10^14 states, far too large.

## Optimized Approach

The key insight is that we can transform the constraints into a more manageable form. Let's define `diff[i] = nums[i] - nums[i-1]` for `i ≥ 1`. The constraints become:

1. `arr1[i] ≥ arr1[i-1]` (non-decreasing)
2. `arr1[i] - arr1[i-1] ≥ diff[i]` (from the non-increasing `arr2` condition)

Combining these: `arr1[i] ≥ max(arr1[i-1], arr1[i-1] + diff[i]) = arr1[i-1] + max(0, diff[i])`

So `arr1[i]` has a **minimum** value based on `arr1[i-1]`, but also has a **maximum** value: `arr1[i] ≤ nums[i]` (since `arr2[i] = nums[i] - arr1[i] ≥ 0`).

This leads to a DP formulation: Let `dp[i][x]` = number of ways to choose `arr1[0..i]` ending with `arr1[i] = x`. The recurrence is:
`dp[i][x] = sum(dp[i-1][y])` for all `y` where:

- `y ≤ x` (from non-decreasing)
- `x - y ≥ max(0, diff[i])` (from the transformed constraint)

But `x` can range from 0 to `nums[i]`, which is up to 10^9, so we can't store a DP table directly.

The second key insight: at each step `i`, the valid `y` values for a given `x` form a contiguous range. Specifically, for a given `x` at position `i`:

- From non-decreasing: `y ≤ x`
- From the constraint: `y ≤ x - max(0, diff[i])`
- So `y` must be ≤ `min(x, x - max(0, diff[i])) = x - max(0, diff[i])`

Thus `dp[i][x] = sum(dp[i-1][0..(x - max(0, diff[i]))])`

This is a **prefix sum** of the previous DP row! So we can maintain prefix sums instead of the full DP table. Let `prefix[i][x] = sum(dp[i][0..x])`. Then:
`dp[i][x] = prefix[i-1][x - max(0, diff[i])]` if `x - max(0, diff[i]) ≥ 0`, else 0.

But we still have the problem that `x` ranges up to 10^9. The third key insight: `dp[i][x]` is non-zero only when `x` is between some minimum and maximum values. We can track these bounds!

Let `low[i]` = minimum possible value of `arr1[i]`, and `high[i]` = maximum possible value.

- `low[0] = 0`, `high[0] = nums[0]`
- For `i ≥ 1`: `low[i] = low[i-1] + max(0, diff[i])` and `high[i] = nums[i]`

Within `[low[i], high[i]]`, `dp[i][x]` is non-zero. And crucially, for `x` in this range, `x - max(0, diff[i])` is in `[low[i-1], high[i-1]]`, so `prefix[i-1][x - max(0, diff[i])]` is defined.

Now we can compute efficiently: for each `i`, we need to compute `prefix[i][x]` for `x` from `low[i]` to `high[i]`. But `high[i] - low[i]` could still be up to 10^9!

The final insight: `dp[i][x]` as a function of `x` is actually **piecewise linear**! Let's examine the recurrence:
`dp[i][x] = prefix[i-1][x - max(0, diff[i])]`

Since `prefix[i-1]` is a non-decreasing array (cumulative sum of non-negative values), `dp[i][x]` is also non-decreasing in `x`. More importantly, `prefix[i-1]` is a piecewise linear function with slope changes only where `dp[i-1]` changes. We can represent it compactly using "breakpoints" where the slope changes.

In fact, `dp[i]` will be non-decreasing and can be represented as a difference array: let `delta[i][x] = dp[i][x] - dp[i][x-1]` for `x > low[i]`. Then from the recurrence:
`dp[i][x] - dp[i][x-1] = prefix[i-1][x - max(0, diff[i])] - prefix[i-1][x-1 - max(0, diff[i])] = dp[i-1][x - max(0, diff[i])]`

So `delta[i][x] = dp[i-1][x - max(0, diff[i])]` for `x > low[i]`.

This gives us an efficient way to compute: maintain `dp[i]` as a list of `(value, count)` pairs where the value is constant. Since `dp[i]` is non-decreasing and `delta[i]` comes from shifting `dp[i-1]`, we can implement this with careful array management.

## Optimal Solution

The implementation uses two arrays: `dp` representing the current `dp[i]` values as a list of `(end_value, count)` pairs, and `prefix` as the cumulative sum. At each step, we:

1. Compute the shift = `max(0, diff[i])`
2. The new `dp` for position `i` is essentially the prefix sums of the previous `dp`, shifted by `shift`
3. We only care about values from `low[i]` to `high[i]`, so we trim accordingly

<div class="code-group">

```python
MOD = 10**9 + 7

def countOfPairs(nums):
    n = len(nums)
    if n == 0:
        return 0

    # dp will store pairs (end_value, count) where count is the number of ways
    # to have arr1[i] = end_value
    dp = [(0, 1)]  # At position 0, arr1[0] = 0 has 1 way

    for i in range(1, n):
        diff = nums[i] - nums[i-1]
        shift = max(0, diff)

        # The new low bound for arr1[i]
        low = dp[0][0] + shift

        # We need to compute prefix sums of the previous dp
        # But we only need them for values that will map to valid arr1[i]
        new_dp = []
        prefix_sum = 0

        # For each segment in the previous dp
        for j in range(len(dp)):
            end_val, count = dp[j]

            # This segment contributes to new_dp from (end_val + shift) onward
            start_new = max(low, end_val + shift)
            if j + 1 < len(dp):
                next_end_val = dp[j+1][0]
                end_new = min(nums[i], next_end_val + shift - 1)
            else:
                end_new = nums[i]

            if start_new > end_new:
                continue

            # The count for all values in [start_new, end_new] is the same:
            # it's the prefix sum up to 'end_val' in the previous dp
            # We need to compute this prefix sum
            seg_prefix = 0
            for k in range(j + 1):
                seg_prefix = (seg_prefix + dp[k][1]) % MOD

            new_dp.append((start_new, seg_prefix))

            # If the segment has length > 1, we need to handle the case
            # where the count changes
            if end_new > start_new:
                # The count increases by dp[j][1] for each increase in x
                # because delta[i][x] = dp[i-1][x - shift]
                # So for x in (start_new, end_new], the count increases by dp[j][1]
                # We represent this as a new segment
                new_dp.append((end_new + 1, (seg_prefix + dp[j][1]) % MOD))

        # Merge adjacent segments with the same count
        merged = []
        for end_val, count in sorted(new_dp):
            if merged and merged[-1][1] == count:
                merged[-1] = (end_val, count)
            else:
                merged.append((end_val, count))

        dp = merged

    # Sum all counts in the final dp
    result = 0
    for i in range(len(dp)):
        end_val, count = dp[i]
        # Determine how many values this segment covers
        if i + 1 < len(dp):
            next_end = dp[i+1][0]
            length = next_end - end_val
        else:
            length = nums[-1] - end_val + 1

        result = (result + count * length) % MOD

    return result
```

```javascript
const MOD = 1_000_000_007n;

function countOfPairs(nums) {
  const n = nums.length;
  if (n === 0) return 0;

  // dp stores pairs [endValue, count] where count is number of ways
  // to have arr1[i] = endValue
  let dp = [[0n, 1n]]; // At position 0, arr1[0] = 0 has 1 way

  for (let i = 1; i < n; i++) {
    const diff = BigInt(nums[i] - nums[i - 1]);
    const shift = diff > 0n ? diff : 0n;

    // New low bound for arr1[i]
    const low = dp[0][0] + shift;

    const newDp = [];
    let prefixSum = 0n;

    // Process each segment in the previous dp
    for (let j = 0; j < dp.length; j++) {
      const [endVal, count] = dp[j];

      // This segment contributes to newDp from (endVal + shift) onward
      let startNew = low > endVal + shift ? low : endVal + shift;
      let endNew;

      if (j + 1 < dp.length) {
        const nextEndVal = dp[j + 1][0];
        endNew =
          BigInt(nums[i]) < nextEndVal + shift - 1n ? BigInt(nums[i]) : nextEndVal + shift - 1n;
      } else {
        endNew = BigInt(nums[i]);
      }

      if (startNew > endNew) continue;

      // Compute prefix sum up to endVal in previous dp
      let segPrefix = 0n;
      for (let k = 0; k <= j; k++) {
        segPrefix = (segPrefix + dp[k][1]) % MOD;
      }

      newDp.push([startNew, segPrefix]);

      // If segment has length > 1, handle count changes
      if (endNew > startNew) {
        // Count increases by dp[j][1] for each increase in x
        newDp.push([endNew + 1n, (segPrefix + count) % MOD]);
      }
    }

    // Merge adjacent segments with same count
    newDp.sort((a, b) => Number(a[0] - b[0]));
    const merged = [];
    for (const [endVal, count] of newDp) {
      if (merged.length > 0 && merged[merged.length - 1][1] === count) {
        merged[merged.length - 1][0] = endVal;
      } else {
        merged.push([endVal, count]);
      }
    }

    dp = merged;
  }

  // Sum all counts in final dp
  let result = 0n;
  for (let i = 0; i < dp.length; i++) {
    const [endVal, count] = dp[i];
    let length;

    if (i + 1 < dp.length) {
      const nextEnd = dp[i + 1][0];
      length = Number(nextEnd - endVal);
    } else {
      length = Number(BigInt(nums[n - 1]) - endVal + 1n);
    }

    result = (result + count * BigInt(length)) % MOD;
  }

  return Number(result);
}
```

```java
class Solution {
    private static final int MOD = 1_000_000_007;

    public int countOfPairs(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;

        // dp stores pairs (endValue, count) where count is number of ways
        // to have arr1[i] = endValue
        List<long[]> dp = new ArrayList<>();
        dp.add(new long[]{0, 1});  // At position 0, arr1[0] = 0 has 1 way

        for (int i = 1; i < n; i++) {
            long diff = (long)nums[i] - nums[i-1];
            long shift = Math.max(0, diff);

            // New low bound for arr1[i]
            long low = dp.get(0)[0] + shift;

            List<long[]> newDp = new ArrayList<>();

            // Process each segment in the previous dp
            for (int j = 0; j < dp.size(); j++) {
                long endVal = dp.get(j)[0];
                long count = dp.get(j)[1];

                // This segment contributes to newDp from (endVal + shift) onward
                long startNew = Math.max(low, endVal + shift);
                long endNew;

                if (j + 1 < dp.size()) {
                    long nextEndVal = dp.get(j+1)[0];
                    endNew = Math.min(nums[i], nextEndVal + shift - 1);
                } else {
                    endNew = nums[i];
                }

                if (startNew > endNew) continue;

                // Compute prefix sum up to endVal in previous dp
                long segPrefix = 0;
                for (int k = 0; k <= j; k++) {
                    segPrefix = (segPrefix + dp.get(k)[1]) % MOD;
                }

                newDp.add(new long[]{startNew, segPrefix});

                // If segment has length > 1, handle count changes
                if (endNew > startNew) {
                    // Count increases by dp[j][1] for each increase in x
                    newDp.add(new long[]{endNew + 1, (segPrefix + count) % MOD});
                }
            }

            // Merge adjacent segments with same count
            newDp.sort((a, b) -> Long.compare(a[0], b[0]));
            List<long[]> merged = new ArrayList<>();
            for (long[] pair : newDp) {
                if (!merged.isEmpty() && merged.get(merged.size()-1)[1] == pair[1]) {
                    merged.get(merged.size()-1)[0] = pair[0];
                } else {
                    merged.add(pair);
                }
            }

            dp = merged;
        }

        // Sum all counts in final dp
        long result = 0;
        for (int i = 0; i < dp.size(); i++) {
            long endVal = dp.get(i)[0];
            long count = dp.get(i)[1];
            long length;

            if (i + 1 < dp.size()) {
                long nextEnd = dp.get(i+1)[0];
                length = nextEnd - endVal;
            } else {
                length = nums[n-1] - endVal + 1;
            }

            result = (result + count * length) % MOD;
        }

        return (int)result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) in the worst case, but typically much better. Each iteration processes all segments from the previous step, and the number of segments can grow up to O(n). In practice, with the merging of adjacent segments, it's often closer to O(n log n) or O(n).

**Space Complexity:** O(n) for storing the dp segments. We only keep the current and previous dp states.

## Common Mistakes

1. **Not handling large numbers modulo correctly**: The counts can grow exponentially, so we must take modulo at every addition/multiplication. Forgetting this causes integer overflow.

2. **Incorrectly computing the shift**: The shift is `max(0, nums[i] - nums[i-1])`, not just `nums[i] - nums[i-1]`. Using the wrong shift violates the constraints.

3. **Off-by-one errors in segment boundaries**: When defining `end_new = min(nums[i], next_end_val + shift - 1)`, the `-1` is crucial because if `next_end_val + shift` is a valid value, it belongs to the next segment.

4. **Not merging adjacent segments**: Without merging, the number of segments grows linearly with each step, leading to O(n²) time. Proper merging keeps the segment count manageable.

## When You'll See This Pattern

This problem combines several advanced techniques:

1. **DP with prefix sums**: Similar to problems like "Number of Ways to Separate Numbers" (LeetCode 1977) where we maintain prefix sums of DP states.
2. **DP with range constraints**: Like "Count the Number of Ideal Arrays" (LeetCode 2338) where values have constraints based on previous values.
3. **Piecewise linear DP**: Problems where the DP state can be represented compactly using breakpoints, such as "Maximum Profit in Job Scheduling" (LeetCode 1235) when optimized with coordinate compression.

## Key Takeaways

1. **Transform constraints algebraically**: Converting the `arr2` non-increasing condition into a constraint on `arr1` differences was crucial to simplify the problem.

2. **Look for prefix sum patterns in DP**: When your recurrence involves sums over ranges of previous states, prefix sums can optimize from O(n²) to O(n).

3. **Compact representation of DP states**: When the state space is large but the DP values have structure (like being piecewise constant), represent them with breakpoints rather than storing all values.

[Practice this problem on CodeJeet](/problem/find-the-count-of-monotonic-pairs-ii)
