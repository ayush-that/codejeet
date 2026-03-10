---
title: "How to Solve K-Concatenation Maximum Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode K-Concatenation Maximum Sum. Medium difficulty, 25.2% acceptance rate. Topics: Array, Dynamic Programming."
date: "2028-10-03"
category: "dsa-patterns"
tags: ["k-concatenation-maximum-sum", "array", "dynamic-programming", "medium"]
---

# How to Solve K-Concatenation Maximum Sum

This problem asks us to find the maximum subarray sum in an array formed by repeating the original array `k` times. What makes this tricky is that `k` can be up to 10⁵, so we can't actually build the repeated array—we need to find patterns in how subarrays behave across repetitions.

## Visual Walkthrough

Let's walk through an example: `arr = [1, -2, 1]`, `k = 3`.

The repeated array would be: `[1, -2, 1, 1, -2, 1, 1, -2, 1]`

We need to find the maximum subarray sum. Let's think about where the maximum sum could come from:

1. **Within a single copy**: The maximum subarray within one copy is `[1]` with sum 1 (or `[1, -2, 1]` also sums to 0).

2. **Spanning two copies**: If we take `[1]` from the end of first copy and `[1]` from start of second copy: `[1, 1]` = 2.

3. **Spanning all copies**: The whole array sums to 3, but we can do better by taking `[1, -2, 1, 1, -2, 1, 1]` = 1.

The key insight: The maximum subarray in the repeated array can be:

- Entirely within one copy of `arr`
- A suffix of one copy + a prefix of the next copy
- Something involving multiple full copies in the middle

Let's calculate some useful values:

- Total sum of `arr`: 1 + (-2) + 1 = 0
- Maximum prefix sum (best sum starting from left): max(1, 1+(-2)=-1, 1+(-2)+1=0) = 1
- Maximum suffix sum (best sum ending at right): max(1, 1+1=2, 1+(-2)+1=0) = 2
- Maximum subarray sum within one copy (Kadane's algorithm): max(1, -1, 0) = 1

When `k = 1`: answer = 1 (just Kadane's on original array)

When `k = 2`: We can have:

- Best within one copy: 1
- Suffix of first + prefix of second: 2 + 1 = 3
- Answer = max(1, 3) = 3

When `k = 3`: We can have:

- Best within one copy: 1
- Suffix of first + middle full copy + prefix of third: 2 + 0 + 1 = 3
- Answer = max(1, 3) = 3

Notice: When total sum > 0, we want to include as many full copies as possible in the middle!

## Brute Force Approach

The brute force approach would be to actually construct the repeated array of length `n * k`, then apply Kadane's algorithm to find the maximum subarray sum.

```python
def brute_force(arr, k):
    repeated = arr * k  # O(n*k) space
    max_sum = 0
    current_sum = 0

    for num in repeated:  # O(n*k) time
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)

    return max_sum
```

**Why this fails:**

- Time complexity: O(n × k) where n ≤ 10⁵ and k ≤ 10⁵ → up to 10¹⁰ operations
- Space complexity: O(n × k) → up to 10¹⁰ elements in memory
- Both are infeasible for the constraints

## Optimized Approach

The key insight is that we don't need to build the repeated array. We can analyze cases based on `k`:

**Case 1: k = 1**

- Just apply Kadane's algorithm to the original array

**Case 2: k = 2**

- Maximum could be within one copy
- Or suffix of first copy + prefix of second copy

**Case 3: k > 2**

- If total sum of arr ≤ 0:
  - Maximum is same as k = 2 case (no benefit from middle copies)
- If total sum of arr > 0:
  - We can take: max suffix + (k-2) × total sum + max prefix
  - The (k-2) middle copies all contribute positive sum

So the algorithm becomes:

1. Compute Kadane's max for one copy
2. Compute max prefix sum and max suffix sum
3. Compute total sum of arr
4. If k = 1: return Kadane's max
5. If k > 1:
   - Two copy max = max(Kadane's max, max suffix + max prefix)
   - If total sum > 0: return max(two copy max, max suffix + (k-2)×total sum + max prefix)
   - Else: return two copy max

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def kConcatenationMaxSum(arr, k):
    MOD = 10**9 + 7

    # Helper function to compute Kadane's algorithm
    def kadane(arr):
        max_sum = 0
        current_sum = 0
        for num in arr:
            current_sum = max(num, current_sum + num)
            max_sum = max(max_sum, current_sum)
        return max_sum

    # Helper function to compute max prefix sum
    def max_prefix_sum(arr):
        max_sum = 0
        current_sum = 0
        for num in arr:
            current_sum += num
            max_sum = max(max_sum, current_sum)
        return max_sum

    # Helper function to compute max suffix sum
    def max_suffix_sum(arr):
        max_sum = 0
        current_sum = 0
        for num in reversed(arr):
            current_sum += num
            max_sum = max(max_sum, current_sum)
        return max_sum

    n = len(arr)

    # Case 1: k = 1
    if k == 1:
        return kadane(arr) % MOD

    # Compute key values
    total_sum = sum(arr)
    kadane_max = kadane(arr)
    max_prefix = max_prefix_sum(arr)
    max_suffix = max_suffix_sum(arr)

    # Case for k = 2
    two_copy_max = max(kadane_max, max_suffix + max_prefix)

    # Case for k > 2
    if total_sum > 0:
        # We can include (k-2) full copies in the middle
        # max_suffix + (k-2)*total_sum + max_prefix
        result = max(two_copy_max, max_suffix + (k-2)*total_sum + max_prefix)
    else:
        result = two_copy_max

    return result % MOD
```

```javascript
// Time: O(n) | Space: O(1)
function kConcatenationMaxSum(arr, k) {
  const MOD = 1000000007;

  // Kadane's algorithm for maximum subarray sum
  function kadane(arr) {
    let maxSum = 0;
    let currentSum = 0;
    for (let num of arr) {
      currentSum = Math.max(num, currentSum + num);
      maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
  }

  // Maximum prefix sum (starting from left)
  function maxPrefixSum(arr) {
    let maxSum = 0;
    let currentSum = 0;
    for (let num of arr) {
      currentSum += num;
      maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
  }

  // Maximum suffix sum (ending at right)
  function maxSuffixSum(arr) {
    let maxSum = 0;
    let currentSum = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
      currentSum += arr[i];
      maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
  }

  // Case 1: k = 1
  if (k === 1) {
    return kadane(arr) % MOD;
  }

  // Compute all needed values
  const totalSum = arr.reduce((a, b) => a + b, 0);
  const kadaneMax = kadane(arr);
  const maxPrefix = maxPrefixSum(arr);
  const maxSuffix = maxSuffixSum(arr);

  // Case for k = 2
  const twoCopyMax = Math.max(kadaneMax, maxSuffix + maxPrefix);

  // Case for k > 2
  let result;
  if (totalSum > 0) {
    // Include (k-2) full copies in the middle
    result = Math.max(twoCopyMax, maxSuffix + (k - 2) * totalSum + maxPrefix);
  } else {
    result = twoCopyMax;
  }

  return result % MOD;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    private static final int MOD = 1000000007;

    public int kConcatenationMaxSum(int[] arr, int k) {
        // Case 1: k = 1
        if (k == 1) {
            return (int)(kadane(arr) % MOD);
        }

        // Compute total sum of array
        long totalSum = 0;
        for (int num : arr) {
            totalSum += num;
        }

        // Compute key values
        long kadaneMax = kadane(arr);
        long maxPrefix = maxPrefixSum(arr);
        long maxSuffix = maxSuffixSum(arr);

        // Case for k = 2
        long twoCopyMax = Math.max(kadaneMax, maxSuffix + maxPrefix);

        // Case for k > 2
        long result;
        if (totalSum > 0) {
            // Include (k-2) full copies in the middle
            result = Math.max(twoCopyMax, maxSuffix + (k - 2) * totalSum + maxPrefix);
        } else {
            result = twoCopyMax;
        }

        return (int)(result % MOD);
    }

    // Kadane's algorithm for maximum subarray sum
    private long kadane(int[] arr) {
        long maxSum = 0;
        long currentSum = 0;
        for (int num : arr) {
            currentSum = Math.max(num, currentSum + num);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }

    // Maximum prefix sum (starting from left)
    private long maxPrefixSum(int[] arr) {
        long maxSum = 0;
        long currentSum = 0;
        for (int num : arr) {
            currentSum += num;
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }

    // Maximum suffix sum (ending at right)
    private long maxSuffixSum(int[] arr) {
        long maxSum = 0;
        long currentSum = 0;
        for (int i = arr.length - 1; i >= 0; i--) {
            currentSum += arr[i];
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make 4 passes through the array:
  1. Compute total sum: O(n)
  2. Kadane's algorithm: O(n)
  3. Max prefix sum: O(n)
  4. Max suffix sum: O(n)
- All other operations are O(1)
- Total: O(4n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No additional data structures that scale with input size

## Common Mistakes

1. **Actually building the repeated array**: This is the most common mistake. With n ≤ 10⁵ and k ≤ 10⁵, the repeated array would have up to 10¹⁰ elements, exceeding memory limits.

2. **Forgetting about k = 1 case**: When k = 1, we just need Kadane's algorithm. Some solutions incorrectly apply the k > 1 logic to all cases.

3. **Not handling negative total sum correctly**: When total sum ≤ 0, we can't benefit from including full middle copies. The maximum is just the k = 2 case.

4. **Integer overflow**: With large k values (up to 10⁵) and potentially large array values (up to 10⁵), intermediate calculations like `(k-2)*total_sum` can overflow 32-bit integers. Always use 64-bit integers and apply modulo at the end.

5. **Incorrectly computing max prefix/suffix**: Remember these are maximum sums starting from left/right, not the entire array sum. Use running sums and track maximums.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Kadane's Algorithm** (Maximum Subarray - LeetCode 53): The core of finding maximum subarray sum within one copy.

2. **Circular Array Maximum Sum** (LeetCode 918): Similar to our k = 2 case where we consider wrapping around.

3. **Prefix/Suffix Sum Patterns**: Many array problems use prefix/suffix sums to optimize calculations:
   - Product of Array Except Self (LeetCode 238)
   - Maximum Sum Circular Subarray (LeetCode 918)
   - Trapping Rain Water (LeetCode 42)

The insight of "when to include middle copies" based on total sum is similar to problems where you need to decide whether to include additional segments based on their contribution.

## Key Takeaways

1. **Don't construct what you can compute**: When dealing with repeated patterns, look for mathematical relationships instead of physically building large structures.

2. **Break into cases**: Complex problems often become simpler when analyzed case by case (k=1, k=2, k>2 with positive/negative total sum).

3. **Combine fundamental algorithms**: This problem combines Kadane's algorithm with prefix/suffix sums and simple arithmetic—recognizing how to combine these tools is key to solving medium/hard problems.

4. **Watch for overflow**: When k and array values are large, intermediate calculations can overflow. Use appropriate data types (long in Java, BigInt if needed in JS).

[Practice this problem on CodeJeet](/problem/k-concatenation-maximum-sum)
