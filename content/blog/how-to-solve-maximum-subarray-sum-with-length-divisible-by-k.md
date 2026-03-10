---
title: "How to Solve Maximum Subarray Sum With Length Divisible by K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Subarray Sum With Length Divisible by K. Medium difficulty, 49.6% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2027-09-29"
category: "dsa-patterns"
tags:
  ["maximum-subarray-sum-with-length-divisible-by-k", "array", "hash-table", "prefix-sum", "medium"]
---

# How to Solve Maximum Subarray Sum With Length Divisible by K

You need to find the maximum sum of any subarray whose length is divisible by a given integer `k`. The challenge is that you can't just find the maximum sum subarray (like Kadane's algorithm) because you have the additional constraint that the subarray length must be a multiple of `k`. This makes the problem more interesting than standard maximum subarray problems.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, -2, 4, -1, 2, 6]` with `k = 3`.

We want to find subarrays where length is divisible by 3 (lengths 3, 6, etc.):

- Length 3 subarrays:
  - `[3, -2, 4]` sum = 5
  - `[-2, 4, -1]` sum = 1
  - `[4, -1, 2]` sum = 5
  - `[-1, 2, 6]` sum = 7
- Length 6 subarray:
  - `[3, -2, 4, -1, 2, 6]` sum = 12

The maximum is 12 from the entire array.

But checking every possible subarray is inefficient. The key insight comes from prefix sums and modular arithmetic. Let's compute prefix sums:

`prefix = [0, 3, 1, 5, 4, 6, 12]` (starting with 0)

For a subarray from index `i` to `j` (inclusive), the sum is `prefix[j+1] - prefix[i]`. The length is `(j+1) - i = j - i + 1`.

We want `(j - i + 1) % k == 0`, which means `(j+1) - i` is divisible by `k`.

This is equivalent to `(j+1) % k == i % k` when working with prefix sums!

So we can track the earliest occurrence of each remainder when computing prefix sums modulo `k`. For each current prefix sum, we check if we've seen the same remainder before at some index `i`. If yes, then the subarray from `i` to current index has length divisible by `k`.

## Brute Force Approach

The brute force solution checks every possible subarray and verifies if its length is divisible by `k`. For each starting index `i`, we iterate through ending indices `j` where `(j - i + 1) % k == 0`, compute the sum, and track the maximum.

<div class="code-group">

```python
# Time: O(n^2) | Space: O(1)
def maxSubarraySumDivisibleByK_brute(nums, k):
    n = len(nums)
    max_sum = float('-inf')

    # Check all possible starting positions
    for i in range(n):
        current_sum = 0
        # Check all possible ending positions
        for j in range(i, n):
            current_sum += nums[j]
            # Only consider subarrays where length is divisible by k
            if (j - i + 1) % k == 0:
                max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n^2) | Space: O(1)
function maxSubarraySumDivisibleByKBrute(nums, k) {
  const n = nums.length;
  let maxSum = -Infinity;

  // Check all possible starting positions
  for (let i = 0; i < n; i++) {
    let currentSum = 0;
    // Check all possible ending positions
    for (let j = i; j < n; j++) {
      currentSum += nums[j];
      // Only consider subarrays where length is divisible by k
      if ((j - i + 1) % k === 0) {
        maxSum = Math.max(maxSum, currentSum);
      }
    }
  }

  return maxSum;
}
```

```java
// Time: O(n^2) | Space: O(1)
public int maxSubarraySumDivisibleByKBrute(int[] nums, int k) {
    int n = nums.length;
    int maxSum = Integer.MIN_VALUE;

    // Check all possible starting positions
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        // Check all possible ending positions
        for (int j = i; j < n; j++) {
            currentSum += nums[j];
            // Only consider subarrays where length is divisible by k
            if ((j - i + 1) % k == 0) {
                maxSum = Math.max(maxSum, currentSum);
            }
        }
    }

    return maxSum;
}
```

</div>

This approach is too slow for large inputs (O(n²) time complexity). We need a more efficient solution.

## Optimized Approach

The key insight is using prefix sums with modular arithmetic. Let `prefix[i]` be the sum of the first `i` elements (with `prefix[0] = 0`).

For a subarray from index `i` to `j` (inclusive):

- Sum = `prefix[j+1] - prefix[i]`
- Length = `j - i + 1`

We want `(j - i + 1) % k == 0`, which means `(j+1) - i` is divisible by `k`.

Notice that `(j+1) % k == i % k` implies `(j+1) - i` is divisible by `k`.

So we can track remainders when computing prefix sums modulo `k`. For each current prefix sum, if we've seen the same remainder before at index `i`, then the subarray from `i` to current index has length divisible by `k`.

However, we want the **maximum** sum, not just any sum. So we need to track the **minimum** prefix sum for each remainder. Why minimum? Because:

- Current sum = `prefix[current] - prefix[previous]`
- To maximize this, we want `prefix[previous]` to be as small as possible (when `prefix[current]` is fixed)

So we maintain a hash map that stores, for each remainder `r`, the minimum prefix sum seen so far with that remainder. As we iterate through the array, for each position we:

1. Update the current prefix sum
2. Compute current remainder = `prefix_sum % k`
3. If we've seen this remainder before, calculate the candidate sum = `current_prefix - min_prefix_for_remainder`
4. Update the maximum sum if this candidate is larger
5. Update the minimum prefix sum for this remainder if current prefix is smaller

## Optimal Solution

Here's the optimal solution using prefix sums with modular arithmetic:

<div class="code-group">

```python
# Time: O(n) | Space: O(k)
def maxSubarraySumDivisibleByK(nums, k):
    """
    Find maximum sum of subarray with length divisible by k.

    Args:
        nums: List of integers
        k: Integer divisor for subarray length

    Returns:
        Maximum sum of subarray with length divisible by k
    """
    n = len(nums)

    # Dictionary to store minimum prefix sum for each remainder
    # remainder -> minimum prefix sum with that remainder
    remainder_min_prefix = {}

    # Initialize with remainder 0 having prefix sum 0 at "index -1"
    # This handles subarrays starting from index 0
    remainder_min_prefix[0] = 0

    prefix_sum = 0
    max_sum = float('-inf')

    for i in range(n):
        # Step 1: Update current prefix sum
        prefix_sum += nums[i]

        # Step 2: Compute current remainder (ensure it's positive)
        current_remainder = prefix_sum % k

        # Step 3: Check if we've seen this remainder before
        if current_remainder in remainder_min_prefix:
            # Candidate sum = current prefix - minimum prefix with same remainder
            candidate_sum = prefix_sum - remainder_min_prefix[current_remainder]
            max_sum = max(max_sum, candidate_sum)

        # Step 4: Update minimum prefix sum for current remainder
        # We only update if current prefix is smaller than stored minimum
        # or if this remainder hasn't been seen before
        if current_remainder not in remainder_min_prefix or prefix_sum < remainder_min_prefix[current_remainder]:
            remainder_min_prefix[current_remainder] = prefix_sum

    return max_sum
```

```javascript
// Time: O(n) | Space: O(k)
function maxSubarraySumDivisibleByK(nums, k) {
  /**
   * Find maximum sum of subarray with length divisible by k.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Integer divisor for subarray length
   * @return {number} Maximum sum of subarray with length divisible by k
   */
  const n = nums.length;

  // Map to store minimum prefix sum for each remainder
  // remainder -> minimum prefix sum with that remainder
  const remainderMinPrefix = new Map();

  // Initialize with remainder 0 having prefix sum 0 at "index -1"
  // This handles subarrays starting from index 0
  remainderMinPrefix.set(0, 0);

  let prefixSum = 0;
  let maxSum = -Infinity;

  for (let i = 0; i < n; i++) {
    // Step 1: Update current prefix sum
    prefixSum += nums[i];

    // Step 2: Compute current remainder (ensure it's positive)
    // JavaScript's % can return negative, so we adjust
    let currentRemainder = ((prefixSum % k) + k) % k;

    // Step 3: Check if we've seen this remainder before
    if (remainderMinPrefix.has(currentRemainder)) {
      // Candidate sum = current prefix - minimum prefix with same remainder
      const candidateSum = prefixSum - remainderMinPrefix.get(currentRemainder);
      maxSum = Math.max(maxSum, candidateSum);
    }

    // Step 4: Update minimum prefix sum for current remainder
    // We only update if current prefix is smaller than stored minimum
    // or if this remainder hasn't been seen before
    if (
      !remainderMinPrefix.has(currentRemainder) ||
      prefixSum < remainderMinPrefix.get(currentRemainder)
    ) {
      remainderMinPrefix.set(currentRemainder, prefixSum);
    }
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(k)
public int maxSubarraySumDivisibleByK(int[] nums, int k) {
    /**
     * Find maximum sum of subarray with length divisible by k.
     *
     * @param nums Array of integers
     * @param k Integer divisor for subarray length
     * @return Maximum sum of subarray with length divisible by k
     */
    int n = nums.length;

    // HashMap to store minimum prefix sum for each remainder
    // remainder -> minimum prefix sum with that remainder
    Map<Integer, Integer> remainderMinPrefix = new HashMap<>();

    // Initialize with remainder 0 having prefix sum 0 at "index -1"
    // This handles subarrays starting from index 0
    remainderMinPrefix.put(0, 0);

    int prefixSum = 0;
    int maxSum = Integer.MIN_VALUE;

    for (int i = 0; i < n; i++) {
        // Step 1: Update current prefix sum
        prefixSum += nums[i];

        // Step 2: Compute current remainder (ensure it's positive)
        // Java's % can return negative, so we adjust
        int currentRemainder = ((prefixSum % k) + k) % k;

        // Step 3: Check if we've seen this remainder before
        if (remainderMinPrefix.containsKey(currentRemainder)) {
            // Candidate sum = current prefix - minimum prefix with same remainder
            int candidateSum = prefixSum - remainderMinPrefix.get(currentRemainder);
            maxSum = Math.max(maxSum, candidateSum);
        }

        // Step 4: Update minimum prefix sum for current remainder
        // We only update if current prefix is smaller than stored minimum
        // or if this remainder hasn't been seen before
        if (!remainderMinPrefix.containsKey(currentRemainder) ||
            prefixSum < remainderMinPrefix.get(currentRemainder)) {
            remainderMinPrefix.put(currentRemainder, prefixSum);
        }
    }

    return maxSum;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of length `n`
- Each iteration performs O(1) operations (hash map lookups and updates)
- The modulo operation and comparisons are constant time

**Space Complexity: O(k)**

- We store at most `k` entries in the hash map (one for each possible remainder)
- In the worst case, we might store all `k` remainders (0 through k-1)
- Additional variables use O(1) space

## Common Mistakes

1. **Forgetting to initialize with remainder 0 and prefix sum 0**: This handles subarrays starting from index 0. Without this, you'll miss valid subarrays.

2. **Not handling negative remainders properly**: In some languages (Java, JavaScript), the modulo operator can return negative values for negative inputs. You need to adjust to get a positive remainder: `((x % k) + k) % k`.

3. **Updating the minimum prefix sum incorrectly**: You should only update the minimum if the current prefix sum is **smaller** than the stored minimum for that remainder. Updating with larger values would give you smaller candidate sums.

4. **Confusing when to update the hash map**: Update the minimum prefix sum **after** checking for candidate sums. If you update before checking, you might subtract the current prefix from itself, giving you a sum of 0.

## When You'll See This Pattern

This pattern of using prefix sums with modular arithmetic appears in several subarray problems:

1. **Subarray Sums Divisible by K (LeetCode 974)**: Almost identical pattern - count subarrays with sum divisible by k rather than finding maximum sum.

2. **Continuous Subarray Sum (LeetCode 523)**: Check if there's a subarray with sum multiple of k and length at least 2. Uses similar remainder tracking.

3. **Make Sum Divisible by P (LeetCode 1590)**: Find smallest subarray to remove to make sum divisible by p. Uses prefix sums and remainders.

The core insight is that when you need to find subarrays with some property related to divisibility by k, tracking remainders of prefix sums modulo k is often the key.

## Key Takeaways

1. **Prefix sums + modular arithmetic** is a powerful combination for problems involving subarray sums and divisibility constraints.

2. When looking for subarrays with length divisible by k, the condition `(j - i + 1) % k == 0` is equivalent to `(j+1) % k == i % k` when working with prefix sums.

3. For maximum sum problems with this pattern, track the **minimum** prefix sum for each remainder to maximize `current_prefix - previous_prefix`.

Related problems: [Subarray Sums Divisible by K](/problem/subarray-sums-divisible-by-k)
