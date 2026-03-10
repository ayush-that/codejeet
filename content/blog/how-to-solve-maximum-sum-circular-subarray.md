---
title: "How to Solve Maximum Sum Circular Subarray — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Sum Circular Subarray. Medium difficulty, 49.5% acceptance rate. Topics: Array, Divide and Conquer, Dynamic Programming, Queue, Monotonic Queue."
date: "2027-07-27"
category: "dsa-patterns"
tags:
  ["maximum-sum-circular-subarray", "array", "divide-and-conquer", "dynamic-programming", "medium"]
---

# How to Solve Maximum Sum Circular Subarray

This problem asks us to find the maximum sum of any non-empty subarray in a **circular array**, where elements can wrap around from the end to the beginning. The tricky part is that the optimal subarray might either be entirely within the linear array (like a normal maximum subarray) or it might wrap around, taking elements from both ends.

## Visual Walkthrough

Let's trace through an example: `nums = [5, -3, 5]`

In a linear array, the maximum subarray sum would be `max(5, -3, 5, 5+(-3)=2, -3+5=2, 5+(-3)+5=7)` = 7 (the entire array).

But in a circular array, we can also consider subarrays that wrap around:

- `[5, 5]` (last element and first element): sum = 10
- `[5, -3, 5, 5]` (wrapping around once): This would actually be the entire array twice, which isn't allowed since we can't use elements more than once.

Wait, let's think carefully. In a circular array of length 3, a subarray can have at most 3 elements. The wrapping subarray `[5, 5]` means we take the last 5 and the first 5, skipping the middle -3. This is valid because in circular terms, index 2 connects to index 0.

So for `[5, -3, 5]`:

- Linear subarrays: `[5]`=5, `[-3]`=-3, `[5]`=5, `[5,-3]`=2, `[-3,5]`=2, `[5,-3,5]`=7 → max = 7
- Circular subarrays: `[5,5]` (indices 2 and 0) = 10 → this is better!

The maximum is 10, which comes from the wrapping subarray.

## Brute Force Approach

The brute force approach would consider every possible subarray in the circular array. For an array of length `n`, there are `n` choices for the starting index and up to `n` choices for length (though we can't reuse elements, so maximum length is `n`).

A naive implementation would:

1. Consider each starting index `i` (0 to n-1)
2. Consider each length `l` (1 to n)
3. Sum the elements from `i` to `(i + l - 1) % n`
4. Track the maximum sum

This gives us O(n³) time complexity if we compute sums naively, or O(n²) if we use prefix sums. For n up to 3×10⁴ (typical LeetCode constraints), O(n²) is still too slow (would be ~900 million operations).

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxSubarraySumCircular(nums):
    n = len(nums)
    max_sum = float('-inf')

    for i in range(n):
        current_sum = 0
        for length in range(1, n + 1):
            # Get element at circular position (i + length - 1) % n
            j = (i + length - 1) % n
            current_sum += nums[j]
            max_sum = max(max_sum, current_sum)

    return max_sum
```

```javascript
// Time: O(n²) | Space: O(1)
function maxSubarraySumCircular(nums) {
  const n = nums.length;
  let maxSum = -Infinity;

  for (let i = 0; i < n; i++) {
    let currentSum = 0;
    for (let length = 1; length <= n; length++) {
      // Get element at circular position (i + length - 1) % n
      const j = (i + length - 1) % n;
      currentSum += nums[j];
      maxSum = Math.max(maxSum, currentSum);
    }
  }

  return maxSum;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maxSubarraySumCircular(int[] nums) {
    int n = nums.length;
    int maxSum = Integer.MIN_VALUE;

    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        for (int length = 1; length <= n; length++) {
            // Get element at circular position (i + length - 1) % n
            int j = (i + length - 1) % n;
            currentSum += nums[j];
            maxSum = Math.max(maxSum, currentSum);
        }
    }

    return maxSum;
}
```

</div>

## Optimized Approach

The key insight is that the maximum circular subarray sum can be one of two cases:

1. **Case 1: Maximum subarray doesn't wrap around**  
   This is just the classic maximum subarray problem (Kadane's algorithm), which we can solve in O(n) time.

2. **Case 2: Maximum subarray wraps around**  
   If the maximum subarray wraps around, it means it takes elements from both ends. Another way to think about this: the wrapping subarray is the **total sum of the array minus the minimum subarray in the middle**.

   Why? If we think about the circular array, a wrapping subarray takes elements from the start and end. The elements NOT taken form a contiguous subarray in the middle (which doesn't wrap). To maximize the wrapping subarray, we want to minimize the middle part we're excluding.

So the algorithm becomes:

1. Compute `max_linear` using Kadane's algorithm (maximum subarray sum)
2. Compute `total_sum` of all elements
3. Compute `min_linear` using Kadane's algorithm for minimum subarray sum
4. Compute `max_wrap = total_sum - min_linear`
5. The answer is `max(max_linear, max_wrap)`

**Edge case**: If all numbers are negative, `total_sum - min_linear` would be 0 (since `min_linear` would equal `total_sum`), but we need a non-empty subarray. In this case, `max_linear` (the least negative number) is the correct answer.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxSubarraySumCircular(nums):
    # Step 1: Initialize variables for Kadane's algorithm
    # We'll track both max and min subarray sums
    current_max = max_sum = current_min = min_sum = nums[0]
    total_sum = nums[0]

    # Step 2: Iterate through the array starting from the second element
    for i in range(1, len(nums)):
        num = nums[i]

        # Update total sum
        total_sum += num

        # Kadane's algorithm for maximum subarray
        # Either start new subarray at current element or extend previous
        current_max = max(num, current_max + num)
        max_sum = max(max_sum, current_max)

        # Kadane's algorithm for minimum subarray
        # Either start new min subarray at current element or extend previous
        current_min = min(num, current_min + num)
        min_sum = min(min_sum, current_min)

    # Step 3: Handle the edge case where all numbers are negative
    # If max_sum is negative, all numbers are negative
    if max_sum < 0:
        return max_sum

    # Step 4: The answer is either the regular max subarray (doesn't wrap)
    # or the total sum minus the minimum subarray (wraps around)
    return max(max_sum, total_sum - min_sum)
```

```javascript
// Time: O(n) | Space: O(1)
function maxSubarraySumCircular(nums) {
  // Step 1: Initialize variables for Kadane's algorithm
  let currentMax = nums[0],
    maxSum = nums[0];
  let currentMin = nums[0],
    minSum = nums[0];
  let totalSum = nums[0];

  // Step 2: Iterate through the array starting from the second element
  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];

    // Update total sum
    totalSum += num;

    // Kadane's algorithm for maximum subarray
    currentMax = Math.max(num, currentMax + num);
    maxSum = Math.max(maxSum, currentMax);

    // Kadane's algorithm for minimum subarray
    currentMin = Math.min(num, currentMin + num);
    minSum = Math.min(minSum, currentMin);
  }

  // Step 3: Handle the edge case where all numbers are negative
  if (maxSum < 0) {
    return maxSum;
  }

  // Step 4: The answer is either regular max or wrap-around case
  return Math.max(maxSum, totalSum - minSum);
}
```

```java
// Time: O(n) | Space: O(1)
public int maxSubarraySumCircular(int[] nums) {
    // Step 1: Initialize variables for Kadane's algorithm
    int currentMax = nums[0], maxSum = nums[0];
    int currentMin = nums[0], minSum = nums[0];
    int totalSum = nums[0];

    // Step 2: Iterate through the array starting from the second element
    for (int i = 1; i < nums.length; i++) {
        int num = nums[i];

        // Update total sum
        totalSum += num;

        // Kadane's algorithm for maximum subarray
        currentMax = Math.max(num, currentMax + num);
        maxSum = Math.max(maxSum, currentMax);

        // Kadane's algorithm for minimum subarray
        currentMin = Math.min(num, currentMin + num);
        minSum = Math.min(minSum, currentMin);
    }

    // Step 3: Handle the edge case where all numbers are negative
    if (maxSum < 0) {
        return maxSum;
    }

    // Step 4: The answer is either regular max or wrap-around case
    return Math.max(maxSum, totalSum - minSum);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**  
We make a single pass through the array, performing constant work for each element. We compute total sum, maximum subarray, and minimum subarray all in one pass.

**Space Complexity: O(1)**  
We only use a constant number of variables regardless of input size: `current_max`, `max_sum`, `current_min`, `min_sum`, and `total_sum`.

## Common Mistakes

1. **Forgetting the all-negative case**: When all numbers are negative, `total_sum - min_sum` equals 0 (because `min_sum` equals `total_sum`), but we can't have an empty subarray. The correct answer in this case is simply `max_sum` (the least negative number).

2. **Trying to modify Kadane's algorithm directly for circular arrays**: Some candidates try to adapt Kadane's algorithm to handle wrapping by considering indices modulo n. This doesn't work because you might count elements twice. The two-case approach (max linear vs. total - min) is cleaner and correct.

3. **Incorrectly computing the wrap-around case**: The wrap-around maximum is `total_sum - min_sum`, but only if `min_sum` represents a true subarray (not the entire array when all are positive). Our algorithm handles this correctly because when all are positive, `max_sum` (entire array) will be greater than `total_sum - min_sum` (which would be 0 if `min_sum` is the entire array).

4. **Off-by-one errors in brute force**: When implementing the brute force solution, it's easy to make mistakes with the modulo arithmetic for circular indices. Always test with small cases.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Kadane's Algorithm**: For maximum/minimum subarray problems. Related problems:
   - [Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) - The classic Kadane's algorithm problem
   - [Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) - Similar idea but with products instead of sums

2. **Circular Array Transformations**: Many circular array problems can be solved by considering the array twice or using modulo arithmetic. Related problems:
   - [Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/) - Circular version of next greater element
   - [House Robber II](https://leetcode.com/problems/house-robber-ii/) - Circular version of house robber

The key insight of transforming a circular problem into linear subproblems (one regular, one complement) is powerful and appears in various forms.

## Key Takeaways

1. **Circular problems often reduce to linear cases**: When dealing with circular arrays, look for ways to transform the problem into one or more linear problems. The "two-case" approach (regular vs. wrap-around) is a common pattern.

2. **Complement thinking is powerful**: The insight that a wrapping subarray is the complement of a non-wrapping subarray (total sum minus minimum middle subarray) is counterintuitive but elegant. Look for complement relationships in other problems.

3. **Master Kadane's algorithm**: This problem reinforces how versatile Kadane's algorithm is. You need it for both max and min subarrays here. The pattern of `current = max(num, current + num)` appears in many variations.

[Practice this problem on CodeJeet](/problem/maximum-sum-circular-subarray)
