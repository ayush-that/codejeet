---
title: "How to Solve Number of Great Partitions — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Great Partitions. Hard difficulty, 33.4% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-03-12"
category: "dsa-patterns"
tags: ["number-of-great-partitions", "array", "dynamic-programming", "hard"]
---

# How to Solve Number of Great Partitions

This problem asks us to count how many ways we can split an array of positive integers into two ordered groups where each group's sum is at least `k`. What makes this problem tricky is that we need to count partitions, not find if one exists, and the constraints make brute force impossible. The key insight is that we can transform this into a knapsack-style counting problem by focusing on "bad" partitions instead of good ones.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3]`, `k = 3`.

We need to count partitions where both groups have sum ≥ 3. Let's list all possible partitions:

1. Group 1: [1,2,3], Group 2: [] → Sums: 6 and 0 → NOT great (group 2 sum < 3)
2. Group 1: [1,2], Group 2: [3] → Sums: 3 and 3 → GREAT ✓
3. Group 1: [1,3], Group 2: [2] → Sums: 4 and 2 → NOT great (group 2 sum < 3)
4. Group 1: [1], Group 2: [2,3] → Sums: 1 and 5 → NOT great (group 1 sum < 3)
5. Group 1: [2,3], Group 2: [1] → Sums: 5 and 1 → NOT great (group 2 sum < 3)
6. Group 1: [2], Group 2: [1,3] → Sums: 2 and 4 → NOT great (group 1 sum < 3)
7. Group 1: [3], Group 2: [1,2] → Sums: 3 and 3 → GREAT ✓
8. Group 1: [], Group 2: [1,2,3] → Sums: 0 and 6 → NOT great (group 1 sum < 3)

We have 2 great partitions out of 8 total partitions. Notice that total partitions = 2^n where n is array length (here 2³ = 8).

The key observation: Instead of counting "good" partitions directly, it's easier to count "bad" partitions where at least one group has sum < k, then subtract from total partitions.

## Brute Force Approach

The brute force solution would generate all 2^n possible partitions by assigning each element to either group 1 or group 2. For each partition, we'd calculate both group sums and check if both are ≥ k.

Why this fails: With n up to 1000, 2^1000 is astronomically large (~1.07 × 10^301 operations). Even for n=30, that's over 1 billion operations. We need a smarter approach.

## Optimized Approach

The key insight comes from noticing that for a partition to be "bad", at least one group has sum < k. Since both groups can't simultaneously have sum < k (because total sum = sum1 + sum2), a bad partition means either:

- Group 1 sum < k, OR
- Group 2 sum < k

But wait — if group 1 sum < k, then group 2 sum = total_sum - group1_sum. For group 2 to also be < k, we'd need total_sum - group1_sum < k, which means group1_sum > total_sum - k.

So actually, a partition is bad if EITHER:

1. Group 1 sum < k (regardless of group 2), OR
2. Group 2 sum < k (regardless of group 1)

But these conditions can overlap! We need inclusion-exclusion: bad_count = count(group1_sum < k) + count(group2_sum < k) - count(both < k).

Since the array elements are positive, both groups can't have sum < k if total_sum ≥ 2k. If total_sum < 2k, there are NO great partitions at all (because even putting all elements in one group gives sum < 2k, so one group would have < k).

Now the problem reduces to: count subsets with sum < k. This is a classic knapsack counting problem! We can use dynamic programming where dp[s] = number of subsets with sum exactly s.

Final formula:

- If total_sum < 2k: return 0
- Otherwise: great_count = total_partitions - bad_count
- Where bad_count = 2 × (sum of dp[s] for s < k) - dp_both
- And dp_both = 1 if we count empty subset? Actually, careful: "both groups < k" means group1_sum < k AND group2_sum < k. But if group1_sum < k, then group2_sum = total_sum - group1_sum. For group2_sum < k, we need total_sum - group1_sum < k, i.e., group1_sum > total_sum - k.

So we need to count subsets where sum < k AND sum > total_sum - k. Since total_sum ≥ 2k, total_sum - k ≥ k, so no sum can be both < k and > total_sum - k. Therefore dp_both = 0!

Thus: bad_count = 2 × count(subsets with sum < k)

## Optimal Solution

We'll use dynamic programming to count subsets with sum < k. Since k can be up to 1000 and n up to 1000, we need O(n×k) solution.

<div class="code-group">

```python
# Time: O(n × k) | Space: O(k)
def countPartitions(self, nums: List[int], k: int) -> int:
    MOD = 10**9 + 7
    total_sum = sum(nums)

    # If total sum is less than 2k, no great partitions exist
    if total_sum < 2 * k:
        return 0

    # dp[s] = number of subsets with sum exactly s
    dp = [0] * k
    dp[0] = 1  # Empty subset has sum 0

    # Count subsets with sum < k
    for num in nums:
        # Iterate backwards to avoid reusing the same element multiple times
        for s in range(k - 1, num - 1, -1):
            dp[s] = (dp[s] + dp[s - num]) % MOD

    # Total subsets with sum < k
    subsets_less_than_k = sum(dp) % MOD

    # Total possible partitions = 2^n (each element can go to group 1 or 2)
    total_partitions = pow(2, len(nums), MOD)

    # Bad partitions = 2 × subsets_less_than_k
    # Why ×2? Because if a subset in group1 has sum < k, that's bad.
    # Similarly if that subset is in group2 (complement), also bad.
    bad_partitions = (2 * subsets_less_than_k) % MOD

    # Great partitions = total - bad
    great_partitions = (total_partitions - bad_partitions) % MOD

    # Ensure non-negative result
    return great_partitions if great_partitions >= 0 else great_partitions + MOD
```

```javascript
// Time: O(n × k) | Space: O(k)
var countPartitions = function (nums, k) {
  const MOD = 10 ** 9 + 7;
  let totalSum = nums.reduce((a, b) => a + b, 0);

  // If total sum is less than 2k, no great partitions exist
  if (totalSum < 2 * k) {
    return 0;
  }

  // dp[s] = number of subsets with sum exactly s
  let dp = new Array(k).fill(0);
  dp[0] = 1; // Empty subset has sum 0

  // Count subsets with sum < k
  for (let num of nums) {
    // Iterate backwards to avoid reusing the same element multiple times
    for (let s = k - 1; s >= num; s--) {
      dp[s] = (dp[s] + dp[s - num]) % MOD;
    }
  }

  // Total subsets with sum < k
  let subsetsLessThanK = dp.reduce((a, b) => (a + b) % MOD, 0);

  // Total possible partitions = 2^n (each element can go to group 1 or 2)
  let totalPartitions = 1;
  for (let i = 0; i < nums.length; i++) {
    totalPartitions = (totalPartitions * 2) % MOD;
  }

  // Bad partitions = 2 × subsets_less_than_k
  let badPartitions = (2 * subsetsLessThanK) % MOD;

  // Great partitions = total - bad
  let greatPartitions = (totalPartitions - badPartitions) % MOD;

  // Ensure non-negative result
  if (greatPartitions < 0) {
    greatPartitions += MOD;
  }

  return greatPartitions;
};
```

```java
// Time: O(n × k) | Space: O(k)
class Solution {
    public int countPartitions(int[] nums, int k) {
        final int MOD = 1_000_000_007;
        long totalSum = 0;
        for (int num : nums) {
            totalSum += num;
        }

        // If total sum is less than 2k, no great partitions exist
        if (totalSum < 2L * k) {
            return 0;
        }

        // dp[s] = number of subsets with sum exactly s
        long[] dp = new long[k];
        dp[0] = 1;  // Empty subset has sum 0

        // Count subsets with sum < k
        for (int num : nums) {
            // Iterate backwards to avoid reusing the same element multiple times
            for (int s = k - 1; s >= num; s--) {
                dp[s] = (dp[s] + dp[s - num]) % MOD;
            }
        }

        // Total subsets with sum < k
        long subsetsLessThanK = 0;
        for (int s = 0; s < k; s++) {
            subsetsLessThanK = (subsetsLessThanK + dp[s]) % MOD;
        }

        // Total possible partitions = 2^n (each element can go to group 1 or 2)
        long totalPartitions = 1;
        for (int i = 0; i < nums.length; i++) {
            totalPartitions = (totalPartitions * 2) % MOD;
        }

        // Bad partitions = 2 × subsets_less_than_k
        long badPartitions = (2L * subsetsLessThanK) % MOD;

        // Great partitions = total - bad
        long greatPartitions = (totalPartitions - badPartitions) % MOD;

        // Ensure non-negative result
        if (greatPartitions < 0) {
            greatPartitions += MOD;
        }

        return (int) greatPartitions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k)

- We iterate through all n elements, and for each element, we update dp array of size k in reverse order
- The nested loops give us O(n × k) operations

**Space Complexity:** O(k)

- We only maintain a dp array of size k
- We don't need O(n × k) space because we process elements one by one and update dp in-place

## Common Mistakes

1. **Forgetting the modulo operation**: The result can be huge (2^1000), so we must take modulo at every addition/multiplication step, not just at the end.

2. **Incorrectly counting "bad" partitions**: Some candidates try to count bad partitions as count(group1 < k) + count(group2 < k) without realizing these counts are equal due to symmetry. Remember: for every subset with sum < k in group1, its complement in group2 creates another bad partition.

3. **Wrong iteration order in DP**: When updating dp array, we must iterate backwards (from k-1 down to num). If we iterate forwards, we'd reuse the same element multiple times, counting subsets where elements can be used more than once.

4. **Not handling the total_sum < 2k case**: If total sum is less than 2k, it's impossible to have both groups with sum ≥ k. This is an important early exit condition.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Subset Sum Counting (Knapsack)**: Like "Partition Equal Subset Sum" (LeetCode 416), but here we count subsets rather than check existence. The DP approach for counting subsets with certain sums is identical.

2. **Complement Counting**: Instead of counting what we want directly, count what we don't want and subtract from total. This appears in problems like "Count Subarrays With Score Less Than K" (LeetCode 2302) where we count valid subarrays by excluding invalid ones.

3. **Symmetry Exploitation**: Recognizing that group1 and group2 are symmetric saves us from double counting. Similar symmetry appears in "Palindrome Partitioning II" (LeetCode 132) where we exploit palindrome symmetry.

## Key Takeaways

1. **Transform hard-to-count problems**: When asked to count configurations satisfying condition C, consider counting configurations NOT satisfying C and subtracting from total. This is especially useful when "not C" is easier to characterize.

2. **Subset sum DP for counting**: The DP array dp[s] = count(subsets with sum s) with transition dp[s] += dp[s - num] (processed in reverse) is a versatile tool for subset counting problems.

3. **Check impossibility early**: Always check for trivial impossibility cases (like total_sum < 2k here) before running expensive computations.

Related problems: [Palindrome Partitioning II](/problem/palindrome-partitioning-ii), [Partition Equal Subset Sum](/problem/partition-equal-subset-sum), [Find the Punishment Number of an Integer](/problem/find-the-punishment-number-of-an-integer)
