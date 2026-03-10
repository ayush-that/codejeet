---
title: "How to Solve Minimum Sum of Values by Dividing Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Sum of Values by Dividing Array. Hard difficulty, 27.9% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Bit Manipulation, Segment Tree."
date: "2026-07-28"
category: "dsa-patterns"
tags:
  [
    "minimum-sum-of-values-by-dividing-array",
    "array",
    "binary-search",
    "dynamic-programming",
    "hard",
  ]
---

# How to Solve Minimum Sum of Values by Dividing Array

This problem asks us to split an array `nums` into exactly `m` contiguous subarrays such that the bitwise AND of each subarray equals a corresponding target value from `andValues`. We then need to minimize the sum of the last elements of each subarray. The challenge lies in the interaction between three constraints: the subarrays must be contiguous and disjoint, cover the entire array, and each must satisfy a specific AND condition. The bitwise AND operation makes this particularly tricky because AND values can only decrease or stay the same as we extend a subarray, never increase.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose:

- `nums = [1, 2, 3, 4]`
- `andValues = [1, 4]`
- We need to split into 2 subarrays

We need to find positions to split the array such that:

1. First subarray AND = 1
2. Second subarray AND = 4
3. Sum of last elements (subarray ends) is minimized

Let's try possible splits:

**Split after index 0**: `[1]` and `[2,3,4]`

- First subarray AND = 1 ✓
- Second subarray AND = 2 & 3 & 4 = 0 ✗ (should be 4)

**Split after index 1**: `[1,2]` and `[3,4]`

- First subarray AND = 1 & 2 = 0 ✗
- Second subarray AND = 3 & 4 = 0 ✗

**Split after index 2**: `[1,2,3]` and `[4]`

- First subarray AND = 1 & 2 & 3 = 0 ✗
- Second subarray AND = 4 ✓

Only the first split satisfies the first condition, but fails the second. Actually, looking more carefully, there's no valid split! The second subarray needs AND = 4, but the only way to get AND = 4 is if all elements in that subarray have bit 3 set (binary 100). Element 4 has this bit, but 2 and 3 don't. So `[4]` alone gives AND = 4, but then the first subarray `[1,2,3]` has AND = 0, not 1.

This shows the challenge: we need to find splits where each segment's AND exactly matches the target, and AND is non-increasing as we extend segments.

## Brute Force Approach

The brute force approach would try all possible ways to split `n` elements into `m` contiguous subarrays. This is equivalent to choosing `m-1` split points from `n-1` possible positions between elements. The number of ways is C(n-1, m-1), which grows exponentially.

For each split configuration, we would:

1. Compute the AND of each subarray
2. Check if all AND values match `andValues`
3. If valid, compute the sum of last elements
4. Track the minimum sum

The time complexity would be O(C(n-1, m-1) \* n) in the worst case, which is far too slow for constraints where n can be up to 10^4.

Even if we precompute AND values, we still have exponential combinations to check. A naive candidate might try backtracking with pruning, but without proper memoization, it would still be exponential.

## Optimized Approach

The key insight is that this problem has optimal substructure and overlapping subproblems, making it suitable for dynamic programming. However, the AND operation adds complexity because it depends on the entire subarray, not just the endpoint.

Let's define our DP state:

- `dp[i][j]` = minimum sum of last elements for dividing the first `i` elements of `nums` into `j` subarrays that satisfy the AND conditions for the first `j` subarrays

The transition would be:
`dp[i][j] = min(dp[k][j-1] + nums[i-1])` for all `k < i` where the subarray `nums[k...i-1]` has AND equal to `andValues[j-1]`

But there's a problem: to check if `nums[k...i-1]` has AND = `andValues[j-1]`, we need to compute the AND of that range. Doing this naively for each transition would make the solution O(n³), which is still too slow for n=10^4.

The second key insight: for a fixed ending position `i`, as we extend a subarray backward (decreasing `k`), the AND value can only change O(log(max(nums))) times because AND can only decrease when we encounter an element that doesn't have some bit set. Each bit can go from 1 to 0 at most once as we extend backward.

So for each ending position `i`, we can maintain a list of "AND change points" - positions where the AND value changes as we extend the subarray backward from `i`. Between these change points, the AND value is constant.

This gives us an O(n _ m _ log(max(nums))) solution:

1. For each position `i`, precompute the AND values and the positions where they change as we go backward
2. Use DP with state `dp[i][j]` as defined above
3. For each `i` and `j`, find all segments ending at `i` that have AND = `andValues[j-1]` using the precomputed change points
4. For each such segment starting at `k+1`, update `dp[i][j]` with `dp[k][j-1] + nums[i-1]`

## Optimal Solution

The solution uses dynamic programming with optimization based on the observation that AND values change infrequently. We maintain a list for each position `i` containing pairs `(and_value, start_index)` representing that for subarrays ending at `i`, if we start at or after `start_index`, the AND value will be `and_value`.

<div class="code-group">

```python
# Time: O(n * m * log(max(nums))) | Space: O(n * m)
def minimumValueSum(self, nums, andValues):
    n, m = len(nums), len(andValues)
    INF = float('inf')

    # dp[i][j] = min sum for first i elements divided into j subarrays
    dp = [[INF] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = 0  # base case: 0 elements, 0 subarrays

    # Precompute AND change points for each ending position
    # and_changes[i] will contain list of (and_value, start_index) pairs
    # for subarrays ending at position i-1
    and_changes = [[] for _ in range(n + 1)]

    for i in range(1, n + 1):
        # Start with current element
        current_and = nums[i - 1]
        start = i

        # For each previous change point, update AND
        for and_val, prev_start in and_changes[i - 1]:
            new_and = current_and & and_val
            if new_and != current_and:
                # AND changed, add to list
                and_changes[i].append((current_and, start))
                current_and = new_and
                start = prev_start

        # Add the final AND value
        and_changes[i].append((current_and, start))

    # Fill DP table
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            # Look at all possible subarrays ending at i (using nums[i-1] as last element)
            # that have AND equal to andValues[j-1]
            for and_val, start in and_changes[i]:
                if and_val == andValues[j - 1]:
                    # start is the earliest index where AND becomes this value
                    # k can be any index from start-1 to i-1
                    # We need to check dp[k][j-1] for all k in [start-1, i-1]
                    # But since AND is constant in this range, we just need
                    # the minimum dp[k][j-1] for k in [start-1, i-1]

                    # We can maintain prefix mins for dp[·][j-1]
                    # For simplicity, we'll iterate here (optimization would use prefix mins)
                    min_prev = INF
                    for k in range(start - 1, i):
                        if dp[k][j - 1] < INF:
                            min_prev = min(min_prev, dp[k][j - 1])

                    if min_prev < INF:
                        dp[i][j] = min(dp[i][j], min_prev + nums[i - 1])

    return dp[n][m] if dp[n][m] < INF else -1
```

```javascript
// Time: O(n * m * log(max(nums))) | Space: O(n * m)
function minimumValueSum(nums, andValues) {
  const n = nums.length,
    m = andValues.length;
  const INF = Number.MAX_SAFE_INTEGER;

  // dp[i][j] = min sum for first i elements divided into j subarrays
  const dp = Array(n + 1)
    .fill()
    .map(() => Array(m + 1).fill(INF));
  dp[0][0] = 0; // base case: 0 elements, 0 subarrays

  // Precompute AND change points for each ending position
  // andChanges[i] will contain list of [and_value, start_index] pairs
  // for subarrays ending at position i-1
  const andChanges = Array(n + 1)
    .fill()
    .map(() => []);

  for (let i = 1; i <= n; i++) {
    // Start with current element
    let currentAnd = nums[i - 1];
    let start = i;

    // For each previous change point, update AND
    for (const [andVal, prevStart] of andChanges[i - 1]) {
      const newAnd = currentAnd & andVal;
      if (newAnd !== currentAnd) {
        // AND changed, add to list
        andChanges[i].push([currentAnd, start]);
        currentAnd = newAnd;
        start = prevStart;
      }
    }

    // Add the final AND value
    andChanges[i].push([currentAnd, start]);
  }

  // Fill DP table
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      // Look at all possible subarrays ending at i
      // that have AND equal to andValues[j-1]
      for (const [andVal, start] of andChanges[i]) {
        if (andVal === andValues[j - 1]) {
          // Find minimum dp[k][j-1] for k in [start-1, i-1]
          let minPrev = INF;
          for (let k = start - 1; k < i; k++) {
            if (dp[k][j - 1] < INF) {
              minPrev = Math.min(minPrev, dp[k][j - 1]);
            }
          }

          if (minPrev < INF) {
            dp[i][j] = Math.min(dp[i][j], minPrev + nums[i - 1]);
          }
        }
      }
    }
  }

  return dp[n][m] < INF ? dp[n][m] : -1;
}
```

```java
// Time: O(n * m * log(max(nums))) | Space: O(n * m)
class Solution {
    public int minimumValueSum(int[] nums, int[] andValues) {
        int n = nums.length, m = andValues.length;
        long INF = Long.MAX_VALUE / 2;

        // dp[i][j] = min sum for first i elements divided into j subarrays
        long[][] dp = new long[n + 1][m + 1];
        for (int i = 0; i <= n; i++) {
            Arrays.fill(dp[i], INF);
        }
        dp[0][0] = 0;  // base case: 0 elements, 0 subarrays

        // Precompute AND change points for each ending position
        // andChanges[i] will contain list of pairs (and_value, start_index)
        // for subarrays ending at position i-1
        List<List<long[]>> andChanges = new ArrayList<>(n + 1);
        for (int i = 0; i <= n; i++) {
            andChanges.add(new ArrayList<>());
        }

        for (int i = 1; i <= n; i++) {
            // Start with current element
            long currentAnd = nums[i - 1];
            long start = i;

            // For each previous change point, update AND
            for (long[] change : andChanges.get(i - 1)) {
                long newAnd = currentAnd & change[0];
                if (newAnd != currentAnd) {
                    // AND changed, add to list
                    andChanges.get(i).add(new long[]{currentAnd, start});
                    currentAnd = newAnd;
                    start = change[1];
                }
            }

            // Add the final AND value
            andChanges.get(i).add(new long[]{currentAnd, start});
        }

        // Fill DP table
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                // Look at all possible subarrays ending at i
                // that have AND equal to andValues[j-1]
                for (long[] change : andChanges.get(i)) {
                    if (change[0] == andValues[j - 1]) {
                        // Find minimum dp[k][j-1] for k in [start-1, i-1]
                        long minPrev = INF;
                        int start = (int) change[1];
                        for (int k = start - 1; k < i; k++) {
                            if (dp[k][j - 1] < INF) {
                                minPrev = Math.min(minPrev, dp[k][j - 1]);
                            }
                        }

                        if (minPrev < INF) {
                            dp[i][j] = Math.min(dp[i][j], minPrev + nums[i - 1]);
                        }
                    }
                }
            }
        }

        return dp[n][m] < INF ? (int) dp[n][m] : -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n _ m _ log(max(nums)))

- We have O(n \* m) DP states
- For each state, we check O(log(max(nums))) AND change points (because AND can only change when bits become 0, and there are at most log(max(nums)) bits)
- For each valid AND match, we might iterate over a range to find the minimum previous DP value. With optimization using prefix minimums, this could be O(1), but in the straightforward implementation shown, it adds another O(n) factor in worst case. A fully optimized version would be O(n _ m _ log(max(nums))).

**Space Complexity:** O(n _ m + n _ log(max(nums)))

- DP table: O(n \* m)
- AND changes storage: O(n \* log(max(nums))) since each position stores at most log(max(nums)) change points

## Common Mistakes

1. **Not handling the AND property correctly**: Candidates might try to use standard DP for partitioning problems without considering that AND values can only decrease. Remember: AND(a, b) <= min(a, b), and extending a subarray can only maintain or reduce the AND value.

2. **Exponential backtracking**: Trying all possible splits without DP memoization leads to exponential time. The key is recognizing this as a DP problem with state depending on both position and number of segments.

3. **Off-by-one errors with indices**: The problem uses 1-based indexing for the m subarrays but 0-based for nums. Carefully manage the conversion between dp indices (1-based for length) and array indices (0-based).

4. **Not using large enough INF**: The sum can be up to n \* max(nums) which could exceed 32-bit integer range. Use 64-bit integers or appropriate large values for INF.

## When You'll See This Pattern

This problem combines several important patterns:

1. **DP with partitioning**: Similar to "Minimum Cost to Split an Array" (LeetCode 2547) where you partition an array to minimize cost based on segment properties.

2. **Bitwise property optimization**: Problems like "Find Subarray With Bitwise OR Closest to K" (LeetCode 2411) use similar observations about how bitwise operations change infrequently as you extend subarrays.

3. **Segment tree/RMQ for range queries**: While not used here, similar problems might use segment trees to answer range AND queries quickly. The key insight that AND changes O(log(max_value)) times is more efficient for this specific problem.

## Key Takeaways

1. **Bitwise operations have monotonic properties**: AND and OR are monotonic in different directions (AND non-increasing, OR non-decreasing) as you extend subarrays. This means they change infrequently—at most O(log(max_value)) times.

2. **DP state often needs to capture both position and count**: When partitioning into exactly k segments, your DP state usually needs to track how many segments used so far.

3. **Precomputation of change points**: When a property changes infrequently, precomputing where it changes can dramatically optimize solutions that need to find segments with specific property values.

Related problems: [Minimum Cost to Split an Array](/problem/minimum-cost-to-split-an-array), [Split With Minimum Sum](/problem/split-with-minimum-sum), [Find Subarray With Bitwise OR Closest to K](/problem/find-subarray-with-bitwise-or-closest-to-k)
