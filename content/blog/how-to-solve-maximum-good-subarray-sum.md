---
title: "How to Solve Maximum Good Subarray Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Good Subarray Sum. Medium difficulty, 21.4% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2029-04-12"
category: "dsa-patterns"
tags: ["maximum-good-subarray-sum", "array", "hash-table", "prefix-sum", "medium"]
---

# How to Solve Maximum Good Subarray Sum

This problem asks us to find the maximum sum of any subarray where the absolute difference between its first and last element equals exactly `k`. At first glance, it might seem like a variation of the classic maximum subarray problem, but there's a twist: we're not looking for contiguous elements with maximum sum alone—we need the subarray's endpoints to satisfy a specific condition. This constraint makes brute force approaches too slow, requiring a clever optimization using prefix sums and hash maps.

## Visual Walkthrough

Let's walk through an example to build intuition. Consider `nums = [1, 2, 3, 4, 5]` with `k = 2`.

We need to find all subarrays where `|nums[i] - nums[j]| == 2` (where `i ≤ j`). Let's list them:

- `nums[0]=1` and `nums[2]=3`: `|1-3| = 2` → subarray `[1,2,3]` sum = 6
- `nums[1]=2` and `nums[3]=4`: `|2-4| = 2` → subarray `[2,3,4]` sum = 9
- `nums[2]=3` and `nums[4]=5`: `|3-5| = 2` → subarray `[3,4,5]` sum = 12

The maximum sum is 12 from subarray `[3,4,5]`.

But checking every pair `(i, j)` is O(n²), which is too slow for large arrays. The key insight: for a given endpoint `j`, we only care about values `nums[i]` where `nums[i] = nums[j] + k` or `nums[i] = nums[j] - k`. If we track the minimum prefix sum before each value, we can quickly compute the maximum subarray sum ending at `j`.

## Brute Force Approach

The most straightforward solution checks every possible subarray `(i, j)` and calculates its sum if the endpoint condition is satisfied:

1. Iterate over all starting indices `i` from 0 to n-1
2. For each `i`, iterate over all ending indices `j` from `i` to n-1
3. Check if `|nums[i] - nums[j]| == k`
4. If yes, compute the sum of `nums[i..j]` and update the maximum

This approach has O(n³) time complexity if we compute sums naively, or O(n²) if we use prefix sums to compute subarray sums in O(1). However, O(n²) is still too slow for n up to 10⁵ (common in LeetCode constraints).

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maximumSubarraySumBruteForce(nums, k):
    n = len(nums)
    max_sum = float('-inf')

    # Try all possible starting points
    for i in range(n):
        current_sum = 0
        # Try all possible ending points
        for j in range(i, n):
            current_sum += nums[j]
            # Check if endpoints satisfy the condition
            if abs(nums[i] - nums[j]) == k:
                max_sum = max(max_sum, current_sum)

    return max_sum if max_sum != float('-inf') else 0
```

```javascript
// Time: O(n²) | Space: O(1)
function maximumSubarraySumBruteForce(nums, k) {
  let maxSum = -Infinity;

  // Try all possible starting points
  for (let i = 0; i < nums.length; i++) {
    let currentSum = 0;
    // Try all possible ending points
    for (let j = i; j < nums.length; j++) {
      currentSum += nums[j];
      // Check if endpoints satisfy the condition
      if (Math.abs(nums[i] - nums[j]) === k) {
        maxSum = Math.max(maxSum, currentSum);
      }
    }
  }

  return maxSum !== -Infinity ? maxSum : 0;
}
```

```java
// Time: O(n²) | Space: O(1)
public long maximumSubarraySumBruteForce(int[] nums, int k) {
    long maxSum = Long.MIN_VALUE;

    // Try all possible starting points
    for (int i = 0; i < nums.length; i++) {
        long currentSum = 0;
        // Try all possible ending points
        for (int j = i; j < nums.length; j++) {
            currentSum += nums[j];
            // Check if endpoints satisfy the condition
            if (Math.abs((long)nums[i] - nums[j]) == k) {
                maxSum = Math.max(maxSum, currentSum);
            }
        }
    }

    return maxSum != Long.MIN_VALUE ? maxSum : 0;
}
```

</div>

The brute force is too slow because for n=10⁵, n² operations would be 10¹⁰, which is impractical.

## Optimized Approach

The optimal solution uses prefix sums and a hash map. Here's the key insight:

For any subarray `nums[i..j]` where `|nums[i] - nums[j]| == k`, we have two cases:

1. `nums[i] = nums[j] + k`
2. `nums[i] = nums[j] - k`

If we fix the right endpoint `j`, we're looking for some earlier index `i` where `nums[i]` equals either `nums[j] + k` or `nums[j] - k`. For each such `i`, the subarray sum is `prefix[j] - prefix[i-1]` (or just `prefix[j]` if `i=0`).

To maximize this sum, we want to **minimize** `prefix[i-1]` (or maximize `prefix[j] - prefix[i-1]`). So for each value we encounter, we track the **minimum prefix sum seen before that value**.

Algorithm steps:

1. Maintain a running prefix sum as we iterate through the array
2. For each element `nums[j]`, check if we've seen `nums[j] + k` or `nums[j] - k` before
3. If yes, calculate the candidate sum as `current_prefix - min_prefix_for_that_value`
4. Update the answer with the maximum candidate sum
5. Update the hash map for `nums[j]` with the minimum prefix sum seen so far

This reduces the problem to O(n) time with O(n) space for the hash map.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumSubarraySum(nums, k):
    """
    Finds the maximum sum of any subarray where |nums[i] - nums[j]| == k.

    Args:
        nums: List of integers
        k: Target absolute difference

    Returns:
        Maximum sum of a good subarray, or 0 if none exists
    """
    # Dictionary to store the minimum prefix sum for each value seen so far
    # key: value from nums, value: minimum prefix sum before current position
    min_prefix = {}

    prefix_sum = 0  # Running prefix sum
    max_sum = float('-inf')  # Track maximum sum found

    for num in nums:
        # Add current number to running prefix sum
        prefix_sum += num

        # Check for two possible cases where |nums[i] - nums[j]| == k:
        # Case 1: nums[i] = num + k (if we've seen num + k before)
        # Case 2: nums[i] = num - k (if we've seen num - k before)

        # Check if we've seen a value that is k greater than current num
        if num + k in min_prefix:
            # Calculate candidate sum: current prefix minus minimum prefix before that value
            candidate = prefix_sum - min_prefix[num + k]
            max_sum = max(max_sum, candidate)

        # Check if we've seen a value that is k less than current num
        if num - k in min_prefix:
            # Calculate candidate sum similarly
            candidate = prefix_sum - min_prefix[num - k]
            max_sum = max(max_sum, candidate)

        # Update the minimum prefix sum for the current value
        # We store the minimum prefix sum BEFORE adding current element
        # because when we use this later, we want prefix[i-1], not prefix[i]
        if num not in min_prefix:
            # First time seeing this value, store prefix_sum - num
            # This is the prefix sum before current element (prefix[i-1])
            min_prefix[num] = prefix_sum - num
        else:
            # Update to keep the minimum prefix sum seen so far
            min_prefix[num] = min(min_prefix[num], prefix_sum - num)

    # Return 0 if no good subarray found, otherwise return max_sum
    return max(0, max_sum) if max_sum != float('-inf') else 0
```

```javascript
// Time: O(n) | Space: O(n)
function maximumSubarraySum(nums, k) {
  // Map to store the minimum prefix sum for each value seen so far
  // key: value from nums, value: minimum prefix sum before current position
  const minPrefix = new Map();

  let prefixSum = 0; // Running prefix sum
  let maxSum = -Infinity; // Track maximum sum found

  for (const num of nums) {
    // Add current number to running prefix sum
    prefixSum += num;

    // Check for two possible cases where |nums[i] - nums[j]| == k:
    // Case 1: nums[i] = num + k (if we've seen num + k before)
    // Case 2: nums[i] = num - k (if we've seen num - k before)

    // Check if we've seen a value that is k greater than current num
    if (minPrefix.has(num + k)) {
      // Calculate candidate sum: current prefix minus minimum prefix before that value
      const candidate = prefixSum - minPrefix.get(num + k);
      maxSum = Math.max(maxSum, candidate);
    }

    // Check if we've seen a value that is k less than current num
    if (minPrefix.has(num - k)) {
      // Calculate candidate sum similarly
      const candidate = prefixSum - minPrefix.get(num - k);
      maxSum = Math.max(maxSum, candidate);
    }

    // Update the minimum prefix sum for the current value
    // We store the minimum prefix sum BEFORE adding current element
    // because when we use this later, we want prefix[i-1], not prefix[i]
    const prefixBeforeCurrent = prefixSum - num;
    if (!minPrefix.has(num)) {
      // First time seeing this value, store prefixBeforeCurrent
      minPrefix.set(num, prefixBeforeCurrent);
    } else {
      // Update to keep the minimum prefix sum seen so far
      minPrefix.set(num, Math.min(minPrefix.get(num), prefixBeforeCurrent));
    }
  }

  // Return 0 if no good subarray found, otherwise return maxSum
  return maxSum !== -Infinity ? Math.max(0, maxSum) : 0;
}
```

```java
// Time: O(n) | Space: O(n)
public long maximumSubarraySum(int[] nums, int k) {
    // HashMap to store the minimum prefix sum for each value seen so far
    // key: value from nums, value: minimum prefix sum before current position
    Map<Integer, Long> minPrefix = new HashMap<>();

    long prefixSum = 0;  // Running prefix sum
    long maxSum = Long.MIN_VALUE;  // Track maximum sum found

    for (int num : nums) {
        // Add current number to running prefix sum
        prefixSum += num;

        // Check for two possible cases where |nums[i] - nums[j]| == k:
        // Case 1: nums[i] = num + k (if we've seen num + k before)
        // Case 2: nums[i] = num - k (if we've seen num - k before)

        // Check if we've seen a value that is k greater than current num
        if (minPrefix.containsKey(num + k)) {
            // Calculate candidate sum: current prefix minus minimum prefix before that value
            long candidate = prefixSum - minPrefix.get(num + k);
            maxSum = Math.max(maxSum, candidate);
        }

        // Check if we've seen a value that is k less than current num
        if (minPrefix.containsKey(num - k)) {
            // Calculate candidate sum similarly
            long candidate = prefixSum - minPrefix.get(num - k);
            maxSum = Math.max(maxSum, candidate);
        }

        // Update the minimum prefix sum for the current value
        // We store the minimum prefix sum BEFORE adding current element
        // because when we use this later, we want prefix[i-1], not prefix[i]
        long prefixBeforeCurrent = prefixSum - num;
        if (!minPrefix.containsKey(num)) {
            // First time seeing this value, store prefixBeforeCurrent
            minPrefix.put(num, prefixBeforeCurrent);
        } else {
            // Update to keep the minimum prefix sum seen so far
            minPrefix.put(num, Math.min(minPrefix.get(num), prefixBeforeCurrent));
        }
    }

    // Return 0 if no good subarray found, otherwise return maxSum
    return maxSum != Long.MIN_VALUE ? Math.max(0, maxSum) : 0;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, performing O(1) operations at each step
- Hash map lookups and updates are O(1) on average

**Space Complexity: O(n)**

- In the worst case, we store every unique value from `nums` in the hash map
- This could be up to n entries if all values are distinct

## Common Mistakes

1. **Forgetting to handle the case where no good subarray exists**: The problem states to return 0 in this case. Always check if `max_sum` was updated from its initial value.

2. **Storing the wrong prefix sum in the hash map**: A critical detail is storing `prefix_sum - num` (the prefix sum before the current element) rather than `prefix_sum`. When we later compute `prefix_sum - min_prefix[target]`, we want `prefix[j] - prefix[i-1]`, not `prefix[j] - prefix[i]`.

3. **Not considering both `num + k` and `num - k`**: The condition is `|nums[i] - nums[j]| == k`, which means either `nums[i] = nums[j] + k` OR `nums[i] = nums[j] - k`. Candidates often check only one direction.

4. **Integer overflow with large sums**: Use 64-bit integers (long in Java/JavaScript, no issue in Python) since sums can exceed 32-bit limits with n up to 10⁵ and values up to 10⁵.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Prefix Sum Optimization**: Converting subarray sum problems from O(n²) to O(n) by using cumulative sums
2. **Hash Map for Pair Finding**: Using a hash map to find pairs that satisfy a condition in O(1) time

Similar problems include:

- **Two Sum**: Finding two numbers that add to a target (uses hash map for O(1) lookups)
- **Maximum Subarray**: Finding the contiguous subarray with the largest sum (Kadane's algorithm)
- **Subarray Sum Equals K**: Finding subarrays that sum to exactly k (uses prefix sums and hash maps)

## Key Takeaways

1. **When you need to find subarrays satisfying endpoint conditions**, consider fixing one endpoint and using a hash map to efficiently find matching starting points.

2. **Prefix sums transform subarray sum problems** from O(n²) to O(n) by allowing O(1) calculation of any subarray sum.

3. **The "minimum prefix sum" technique** is useful when maximizing `prefix[j] - prefix[i]`—minimizing `prefix[i]` gives the maximum difference.

Related problems: [Maximum Subarray](/problem/maximum-subarray), [Maximum Sum of Distinct Subarrays With Length K](/problem/maximum-sum-of-distinct-subarrays-with-length-k)
