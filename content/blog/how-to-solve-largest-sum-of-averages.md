---
title: "How to Solve Largest Sum of Averages — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Sum of Averages. Medium difficulty, 54.8% acceptance rate. Topics: Array, Dynamic Programming, Prefix Sum."
date: "2028-02-27"
category: "dsa-patterns"
tags: ["largest-sum-of-averages", "array", "dynamic-programming", "prefix-sum", "medium"]
---

# How to Solve Largest Sum of Averages

This problem asks us to partition an array into at most `k` adjacent subarrays to maximize the sum of their averages. What makes this tricky is that we need to balance two competing factors: creating more subarrays lets us isolate high-value segments, but each additional split reduces the number of elements in existing groups, potentially lowering their averages. This tension between segmentation and grouping requires careful optimization.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [9,1,2,3,9]`, `k = 3`.

We want to split this array into at most 3 contiguous groups. Let's think about possible partitions:

1. **No splits (k=1)**: Entire array average = (9+1+2+3+9)/5 = 24/5 = 4.8
2. **One split (k=2)**: We can split after position 1: [9] avg=9, [1,2,3,9] avg=15/4=3.75 → total=12.75
   Split after position 2: [9,1] avg=5, [2,3,9] avg=14/3≈4.67 → total≈9.67
   Split after position 3: [9,1,2] avg=4, [3,9] avg=6 → total=10
   Split after position 4: [9,1,2,3] avg=3.75, [9] avg=9 → total=12.75
3. **Two splits (k=3)**: We need to find the best partition with exactly 3 groups:
   - Split after 1 and 3: [9] avg=9, [1,2] avg=1.5, [3,9] avg=6 → total=16.5
   - Split after 1 and 4: [9] avg=9, [1,2,3] avg=2, [9] avg=9 → total=20 ← **Best so far!**
   - Split after 2 and 4: [9,1] avg=5, [2,3] avg=2.5, [9] avg=9 → total=16.5

The optimal partition is [9], [1,2,3], [9] with total average sum = 20.

Notice the pattern: we isolate the high-value 9's at the ends, grouping the lower values together in the middle. This example shows why we need dynamic programming - we're building optimal solutions for prefixes of the array with increasing numbers of groups.

## Brute Force Approach

A naive approach would try all possible ways to place `k-1` split points among `n-1` possible positions. For each arrangement, we'd calculate the sum of averages. The number of combinations is C(n-1, k-1), which grows exponentially with n.

Even if we precompute prefix sums to calculate averages quickly in O(1), the combinatorial explosion makes this impractical. For n=100 and k=50, we'd have C(99,49) ≈ 5×10²⁸ combinations - completely infeasible.

The brute force fails because it doesn't reuse computation. If we know the optimal way to partition the first `i` elements into `j` groups, we shouldn't recompute it when considering longer prefixes.

## Optimized Approach

The key insight is that this is a **dynamic programming** problem with optimal substructure:

1. **State definition**: Let `dp[i][j]` = maximum sum of averages for the first `i` elements partitioned into `j` groups.
2. **Transition**: To compute `dp[i][j]`, we consider where the last split occurs. If the last group starts at position `m` (0-indexed), then:
   - First `j-1` groups cover elements 0...m-1 (optimal value = `dp[m][j-1]`)
   - Last group covers elements m...i-1 (average = sum(m...i-1)/(i-m))

   So: `dp[i][j] = max(dp[m][j-1] + average(m, i-1))` for all m from j-1 to i-1
   (We need at least 1 element per group, so m ≥ j-1)

3. **Base cases**:
   - `dp[i][1]` = average of first i elements (one group covering everything)
   - `dp[0][j]` = 0 (empty array has sum 0)

4. **Prefix sums**: We can precompute prefix sums to calculate any subarray average in O(1) time.

5. **Final answer**: We want the maximum over all j ≤ k, so answer = max(dp[n][j]) for j=1...k

This approach reduces the problem to O(n²×k) time, which is manageable for typical constraints.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2 * k) | Space: O(n * k)
def largestSumOfAverages(nums, k):
    n = len(nums)

    # Step 1: Precompute prefix sums for O(1) average calculations
    # prefix[i] = sum of first i elements (prefix[0] = 0)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    # Helper function to get average of subarray [l, r] (0-indexed)
    def average(l, r):
        return (prefix[r + 1] - prefix[l]) / (r - l + 1)

    # Step 2: Initialize DP table
    # dp[i][j] = max sum for first i elements with j groups
    dp = [[0.0] * (k + 1) for _ in range(n + 1)]

    # Step 3: Base case - one group for each prefix
    for i in range(1, n + 1):
        dp[i][1] = average(0, i - 1)

    # Step 4: Fill DP table
    for j in range(2, k + 1):  # Number of groups
        for i in range(j, n + 1):  # At least j elements for j groups
            # Try all possible starting points for the last group
            for m in range(j - 1, i):
                # dp[m][j-1] = best for first m elements with j-1 groups
                # average(m, i-1) = average of last group (elements m to i-1)
                dp[i][j] = max(dp[i][j], dp[m][j - 1] + average(m, i - 1))

    # Step 5: Answer is max over all possible number of groups ≤ k
    # We can use fewer than k groups if it gives better result
    return max(dp[n][j] for j in range(1, k + 1))
```

```javascript
// Time: O(n^2 * k) | Space: O(n * k)
function largestSumOfAverages(nums, k) {
  const n = nums.length;

  // Step 1: Precompute prefix sums
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // Helper to get average of subarray [l, r]
  const average = (l, r) => {
    return (prefix[r + 1] - prefix[l]) / (r - l + 1);
  };

  // Step 2: Initialize DP table
  // dp[i][j] = max sum for first i elements with j groups
  const dp = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0));

  // Step 3: Base case - one group for each prefix
  for (let i = 1; i <= n; i++) {
    dp[i][1] = average(0, i - 1);
  }

  // Step 4: Fill DP table
  for (let j = 2; j <= k; j++) {
    // Number of groups
    for (let i = j; i <= n; i++) {
      // At least j elements for j groups
      // Try all possible starting points for the last group
      for (let m = j - 1; m < i; m++) {
        dp[i][j] = Math.max(dp[i][j], dp[m][j - 1] + average(m, i - 1));
      }
    }
  }

  // Step 5: Answer is max over all possible number of groups ≤ k
  let maxResult = 0;
  for (let j = 1; j <= k; j++) {
    maxResult = Math.max(maxResult, dp[n][j]);
  }
  return maxResult;
}
```

```java
// Time: O(n^2 * k) | Space: O(n * k)
class Solution {
    public double largestSumOfAverages(int[] nums, int k) {
        int n = nums.length;

        // Step 1: Precompute prefix sums
        double[] prefix = new double[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }

        // Step 2: Initialize DP table
        // dp[i][j] = max sum for first i elements with j groups
        double[][] dp = new double[n + 1][k + 1];

        // Step 3: Base case - one group for each prefix
        for (int i = 1; i <= n; i++) {
            dp[i][1] = (prefix[i] - prefix[0]) / i;
        }

        // Step 4: Fill DP table
        for (int j = 2; j <= k; j++) {  // Number of groups
            for (int i = j; i <= n; i++) {  // At least j elements for j groups
                // Try all possible starting points for the last group
                for (int m = j - 1; m < i; m++) {
                    double lastGroupAvg = (prefix[i] - prefix[m]) / (i - m);
                    dp[i][j] = Math.max(dp[i][j], dp[m][j - 1] + lastGroupAvg);
                }
            }
        }

        // Step 5: Answer is max over all possible number of groups ≤ k
        double maxResult = 0;
        for (int j = 1; j <= k; j++) {
            maxResult = Math.max(maxResult, dp[n][j]);
        }
        return maxResult;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n² × k)

- We have three nested loops: over j (up to k), i (up to n), and m (up to n)
- The innermost loop runs O(n) times for each (i, j) pair
- Total iterations ≈ k × n × n = O(n²k)

**Space Complexity**: O(n × k)

- The DP table has (n+1) × (k+1) entries
- The prefix sum array uses O(n) space
- Total space dominated by DP table: O(nk)

We can optimize space to O(n) by noticing that `dp[i][j]` only depends on `dp[·][j-1]`, so we only need to keep two rows at a time. However, the O(nk) solution is usually acceptable for interview settings.

## Common Mistakes

1. **Forgetting that k is "at most" not "exactly"**: Some candidates assume we must use exactly k groups. The problem says "at most k", so we need to take the maximum over all j ≤ k. Our solution handles this by taking max(dp[n][j]) at the end.

2. **Off-by-one errors with indices**: The transition `dp[m][j-1] + average(m, i-1)` is tricky. Remember:
   - `dp[m][j-1]` covers elements 0...m-1 (first m elements)
   - `average(m, i-1)` covers elements m...i-1 (last i-m elements)
   - Total elements covered: m + (i-m) = i elements ✓

3. **Incorrect loop boundaries**: The loop `for i in range(j, n+1)` ensures we have at least j elements for j groups. Similarly, `for m in range(j-1, i)` ensures:
   - First j-1 groups have at least 1 element each (m ≥ j-1)
   - Last group has at least 1 element (m < i)

4. **Using integer division for averages**: In Python 3, `/` does float division, but in Java and JavaScript, you need to be careful. Always use floating-point division when calculating averages.

## When You'll See This Pattern

This "partition DP" pattern appears in several optimization problems:

1. **Palindrome Partitioning II (LeetCode 132)**: Partition string into minimum cuts to make all substrings palindromes. Similar DP state: `dp[i] = min cuts for first i characters`.

2. **Minimum Difficulty of a Job Schedule (LeetCode 1335)**: Schedule jobs over d days to minimize maximum difficulty per day. DP state: `dp[i][j] = min difficulty for first i jobs in j days`.

3. **Split Array Largest Sum (LeetCode 410)**: Split array into m subarrays to minimize largest sum. While this uses binary search + greedy, the partitioning concept is similar.

The common theme: breaking a sequence into contiguous segments to optimize some aggregate measure (sum, average, max, etc.).

## Key Takeaways

1. **Partition DP pattern**: When you need to split an array/string into contiguous segments, define `dp[i][j]` as optimal value for first i elements with j segments. The transition considers where the last segment starts.

2. **Prefix sums for subarray queries**: When you need frequent subarray sum/average calculations, precompute prefix sums to answer queries in O(1) time.

3. **"At most k" vs "exactly k"**: Always check whether you need to use exactly k segments or at most k. For "at most", take maximum over all possible numbers of segments.

[Practice this problem on CodeJeet](/problem/largest-sum-of-averages)
