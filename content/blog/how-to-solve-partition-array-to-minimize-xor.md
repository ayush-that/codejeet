---
title: "How to Solve Partition Array to Minimize XOR — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partition Array to Minimize XOR. Medium difficulty, 41.0% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Prefix Sum."
date: "2026-02-16"
category: "dsa-patterns"
tags:
  ["partition-array-to-minimize-xor", "array", "dynamic-programming", "bit-manipulation", "medium"]
---

# How to Solve Partition Array to Minimize XOR

You're given an array of integers and need to split it into exactly `k` non-empty subarrays. For each subarray, you compute the XOR of all its elements. Your goal is to minimize the maximum XOR value across all subarrays. This problem is tricky because it combines three challenging concepts: bit manipulation, dynamic programming, and optimization of a maximum value.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `nums = [1, 2, 3, 4]` with `k = 2`.

We need to split the array into 2 subarrays. All possible partitions:

1. **[1]** and **[2, 3, 4]**
   - First subarray XOR: 1
   - Second subarray XOR: 2 ^ 3 ^ 4 = 5
   - Maximum XOR: max(1, 5) = 5

2. **[1, 2]** and **[3, 4]**
   - First subarray XOR: 1 ^ 2 = 3
   - Second subarray XOR: 3 ^ 4 = 7
   - Maximum XOR: max(3, 7) = 7

3. **[1, 2, 3]** and **[4]**
   - First subarray XOR: 1 ^ 2 ^ 3 = 0
   - Second subarray XOR: 4
   - Maximum XOR: max(0, 4) = 4

The minimum possible maximum XOR is 4 (from partition 3).

Notice that we're trying to minimize the maximum XOR value. This is a classic **minimize the maximum** problem, which often suggests using binary search on the answer combined with dynamic programming to check feasibility.

## Brute Force Approach

The brute force approach would try all possible ways to partition the array into `k` subarrays. For an array of length `n`, we need to choose `k-1` split points from `n-1` possible positions between elements. The number of ways is C(n-1, k-1), which grows exponentially.

Even if we could generate all partitions efficiently, we'd still need to compute XORs for each subarray. A naive implementation would recompute XORs repeatedly, making this approach O(2^n) in the worst case.

What makes this approach infeasible is that for `n = 1000` (typical constraint), C(999, k-1) is astronomically large. We need a smarter approach that avoids exploring all possibilities.

## Optimized Approach

The key insight is that we can use **binary search** on the answer combined with **dynamic programming** to check feasibility.

Here's the reasoning:

1. **Binary search on the answer**: We're looking for the minimum possible maximum XOR value. Let's call this value `M`. If we can check whether it's possible to partition the array such that all subarray XORs are ≤ `M`, then we can binary search for the smallest `M` that works.

2. **Why binary search works**:
   - The XOR of any subarray is between 0 and 2^31 - 1 (since numbers are 32-bit integers)
   - If it's possible with maximum XOR = `X`, it's also possible with any maximum XOR > `X` (we can just use the same partition)
   - This monotonic property allows binary search

3. **Checking feasibility with DP**:
   - Let `dp[i]` = whether we can partition the first `i` elements into some number of subarrays where each subarray's XOR ≤ `M`
   - We want to know if `dp[n]` is true with at most `k` subarrays
   - Transition: `dp[i]` is true if there exists some `j < i` such that `dp[j]` is true AND XOR of elements from `j+1` to `i` ≤ `M`
   - We also need to track the minimum number of subarrays used to reach each position

4. **Optimizing XOR computation**:
   - We can use prefix XORs: `prefix[i] = nums[0] ^ nums[1] ^ ... ^ nums[i-1]`
   - XOR of subarray from `j` to `i-1` = `prefix[i] ^ prefix[j]`

The algorithm:

1. Compute prefix XOR array
2. Binary search for minimum possible maximum XOR
3. For each candidate `M`, use DP to check if we can partition into ≤ `k` subarrays with all XORs ≤ `M`
4. Return the smallest feasible `M`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n^2 * log(max_xor)) | Space: O(n)
# where max_xor is the maximum possible XOR value (2^31)
def minimumMaximumXOR(nums, k):
    n = len(nums)

    # Step 1: Compute prefix XOR array
    # prefix[i] = XOR of first i elements (prefix[0] = 0)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] ^ nums[i]

    # Step 2: Binary search on the answer
    # The answer is between 0 and maximum possible XOR (2^31 - 1)
    left, right = 0, (1 << 31) - 1

    def canPartition(max_xor):
        """
        Check if we can partition nums into at most k subarrays
        where each subarray's XOR <= max_xor
        """
        # dp[i] = minimum number of subarrays needed for first i elements
        # Initialize with infinity (impossible)
        dp = [float('inf')] * (n + 1)
        dp[0] = 0  # 0 elements need 0 subarrays

        for i in range(1, n + 1):
            for j in range(i):
                # Check if subarray from j to i-1 has XOR <= max_xor
                subarray_xor = prefix[i] ^ prefix[j]
                if subarray_xor <= max_xor:
                    # If we can partition first j elements, we can extend to i
                    dp[i] = min(dp[i], dp[j] + 1)

        # We need exactly k subarrays, but dp[n] gives minimum needed
        # If minimum needed <= k, we can split some subarrays to get exactly k
        return dp[n] <= k

    # Binary search for minimum feasible max_xor
    while left < right:
        mid = (left + right) // 2
        if canPartition(mid):
            # Try for smaller max_xor
            right = mid
        else:
            # Need larger max_xor
            left = mid + 1

    return left
```

```javascript
// Time: O(n^2 * log(max_xor)) | Space: O(n)
// where max_xor is the maximum possible XOR value (2^31)
function minimumMaximumXOR(nums, k) {
  const n = nums.length;

  // Step 1: Compute prefix XOR array
  // prefix[i] = XOR of first i elements (prefix[0] = 0)
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] ^ nums[i];
  }

  // Step 2: Binary search on the answer
  // The answer is between 0 and maximum possible XOR (2^31 - 1)
  let left = 0,
    right = (1 << 31) - 1;

  const canPartition = (maxXor) => {
    /**
     * Check if we can partition nums into at most k subarrays
     * where each subarray's XOR <= maxXor
     */
    // dp[i] = minimum number of subarrays needed for first i elements
    // Initialize with Infinity (impossible)
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0; // 0 elements need 0 subarrays

    for (let i = 1; i <= n; i++) {
      for (let j = 0; j < i; j++) {
        // Check if subarray from j to i-1 has XOR <= maxXor
        const subarrayXor = prefix[i] ^ prefix[j];
        if (subarrayXor <= maxXor) {
          // If we can partition first j elements, we can extend to i
          dp[i] = Math.min(dp[i], dp[j] + 1);
        }
      }
    }

    // We need exactly k subarrays, but dp[n] gives minimum needed
    // If minimum needed <= k, we can split some subarrays to get exactly k
    return dp[n] <= k;
  };

  // Binary search for minimum feasible maxXor
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (canPartition(mid)) {
      // Try for smaller maxXor
      right = mid;
    } else {
      // Need larger maxXor
      left = mid + 1;
    }
  }

  return left;
}
```

```java
// Time: O(n^2 * log(max_xor)) | Space: O(n)
// where max_xor is the maximum possible XOR value (2^31)
public int minimumMaximumXOR(int[] nums, int k) {
    int n = nums.length;

    // Step 1: Compute prefix XOR array
    // prefix[i] = XOR of first i elements (prefix[0] = 0)
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] ^ nums[i];
    }

    // Step 2: Binary search on the answer
    // The answer is between 0 and maximum possible XOR (2^31 - 1)
    int left = 0, right = (1 << 31) - 1;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (canPartition(nums, k, prefix, mid)) {
            // Try for smaller max_xor
            right = mid;
        } else {
            // Need larger max_xor
            left = mid + 1;
        }
    }

    return left;
}

private boolean canPartition(int[] nums, int k, int[] prefix, int maxXor) {
    /**
     * Check if we can partition nums into at most k subarrays
     * where each subarray's XOR <= maxXor
     */
    int n = nums.length;

    // dp[i] = minimum number of subarrays needed for first i elements
    // Initialize with max value (impossible)
    int[] dp = new int[n + 1];
    for (int i = 0; i <= n; i++) {
        dp[i] = Integer.MAX_VALUE;
    }
    dp[0] = 0;  // 0 elements need 0 subarrays

    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            // Check if subarray from j to i-1 has XOR <= maxXor
            int subarrayXor = prefix[i] ^ prefix[j];
            if (subarrayXor <= maxXor && dp[j] != Integer.MAX_VALUE) {
                // If we can partition first j elements, we can extend to i
                dp[i] = Math.min(dp[i], dp[j] + 1);
            }
        }
    }

    // We need exactly k subarrays, but dp[n] gives minimum needed
    // If minimum needed <= k, we can split some subarrays to get exactly k
    return dp[n] <= k;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² \* log(max_xor))

- `n` is the length of the input array
- `max_xor` is the maximum possible XOR value (2³¹ for 32-bit integers)
- Binary search runs O(log(max_xor)) times
- Each feasibility check with DP takes O(n²) time (nested loops over array indices)
- Total: O(n² \* log(max_xor))

**Space Complexity:** O(n)

- We store the prefix XOR array of size n+1
- We store the DP array of size n+1
- No other significant space usage

## Common Mistakes

1. **Forgetting that subarrays must be non-empty**: When checking feasibility, ensure `j < i` (not `j ≤ i`) to guarantee non-empty subarrays. Using `j ≤ i` would allow empty subarrays, which violates the problem constraints.

2. **Incorrect binary search bounds**: The maximum possible XOR isn't simply the maximum value in the array. Since XOR can produce values larger than individual elements, we need to consider the full range up to 2³¹ for 32-bit integers.

3. **Not handling the "exactly k subarrays" requirement correctly**: The DP finds the minimum number of subarrays needed. If the minimum is less than `k`, we can always split existing subarrays to reach exactly `k` (since splitting a subarray never increases the maximum XOR). But if the minimum is greater than `k`, it's impossible.

4. **Inefficient XOR computation**: Recomputing XOR for each subarray from scratch would add an O(n) factor, making the solution O(n³). Always use prefix XORs for O(1) subarray XOR computation.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Minimize the maximum** (or maximize the minimum) problems: These often use binary search on the answer with a feasibility check. Similar problems include:
   - **LeetCode 410: Split Array Largest Sum** - Minimize the largest sum when splitting into k subarrays
   - **LeetCode 1011: Capacity To Ship Packages Within D Days** - Minimize the maximum weight capacity
   - **LeetCode 875: Koko Eating Bananas** - Minimize the eating speed

2. **Partition DP with prefix sums**: When you need to partition an array and compute some aggregate function on subarrays, prefix sums (or prefix XORs) help optimize the computation. Similar problems include:
   - **LeetCode 1335: Minimum Difficulty of a Job Schedule** - Partition jobs into days to minimize maximum difficulty
   - **LeetCode 1278: Palindrome Partitioning III** - Partition string into k palindromes with minimum changes

## Key Takeaways

1. **When you see "minimize the maximum" or "maximize the minimum"**, think binary search on the answer combined with a greedy or DP feasibility check.

2. **Prefix computations** (sums, XORs, etc.) are essential for efficiently computing subarray aggregates. Always consider them when dealing with subarray problems.

3. **Partition DP** often has this structure: `dp[i]` represents the best result for the first `i` elements, and you transition by considering where the last subarray ends.

[Practice this problem on CodeJeet](/problem/partition-array-to-minimize-xor)
