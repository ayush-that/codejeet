---
title: "How to Solve Maximum Value of an Ordered Triplet I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Value of an Ordered Triplet I. Easy difficulty, 58.2% acceptance rate. Topics: Array."
date: "2028-09-22"
category: "dsa-patterns"
tags: ["maximum-value-of-an-ordered-triplet-i", "array", "easy"]
---

# How to Solve Maximum Value of an Ordered Triplet I

This problem asks us to find the maximum value of `(nums[i] - nums[j]) * nums[k]` where `i < j < k`. While the constraint seems straightforward, the challenge lies in efficiently checking all valid triplets without resorting to a cubic brute force approach. The key insight is that we can optimize by precomputing useful information about the array.

## Visual Walkthrough

Let's trace through an example: `nums = [12, 6, 1, 2, 7]`

We need to find the maximum value of `(nums[i] - nums[j]) * nums[k]` where `i < j < k`.

**Step-by-step thinking:**

1. For each possible `j` position, we want:
   - The maximum `nums[i]` to the left of `j` (to maximize `nums[i] - nums[j]`)
   - The maximum `nums[k]` to the right of `j` (to maximize the product)
2. Let's compute for each position:
   - At index 1 (`j = 1`, value = 6):
     - Max left: `max(nums[0]) = 12`
     - Max right: `max(nums[2], nums[3], nums[4]) = max(1, 2, 7) = 7`
     - Value: `(12 - 6) * 7 = 6 * 7 = 42`
   - At index 2 (`j = 2`, value = 1):
     - Max left: `max(nums[0], nums[1]) = max(12, 6) = 12`
     - Max right: `max(nums[3], nums[4]) = max(2, 7) = 7`
     - Value: `(12 - 1) * 7 = 11 * 7 = 77`
   - At index 3 (`j = 3`, value = 2):
     - Max left: `max(nums[0], nums[1], nums[2]) = max(12, 6, 1) = 12`
     - Max right: `max(nums[4]) = 7`
     - Value: `(12 - 2) * 7 = 10 * 7 = 70`

3. The maximum value is 77 (when `i=0, j=2, k=4`).

This walkthrough reveals the optimal strategy: for each middle element `j`, we need the maximum value to its left and the maximum value to its right.

## Brute Force Approach

The most straightforward solution is to check all possible triplets `(i, j, k)` where `i < j < k`:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def maximumTripletValue(nums):
    n = len(nums)
    max_val = 0

    # Check all possible triplets
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                # Calculate value for current triplet
                val = (nums[i] - nums[j]) * nums[k]
                # Update maximum value
                max_val = max(max_val, val)

    return max_val
```

```javascript
// Time: O(n³) | Space: O(1)
function maximumTripletValue(nums) {
  const n = nums.length;
  let maxVal = 0;

  // Check all possible triplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        // Calculate value for current triplet
        const val = (nums[i] - nums[j]) * nums[k];
        // Update maximum value
        maxVal = Math.max(maxVal, val);
      }
    }
  }

  return maxVal;
}
```

```java
// Time: O(n³) | Space: O(1)
public long maximumTripletValue(int[] nums) {
    int n = nums.length;
    long maxVal = 0;

    // Check all possible triplets
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                // Calculate value for current triplet
                long val = (long)(nums[i] - nums[j]) * nums[k];
                // Update maximum value
                maxVal = Math.max(maxVal, val);
            }
        }
    }

    return maxVal;
}
```

</div>

**Why this is insufficient:** With `n` up to 100, the brute force approach with O(n³) time complexity is too slow (1,000,000 operations for n=100). We need a more efficient solution.

## Optimal Solution

The key optimization is to precompute the maximum value to the right of each position. Then, for each possible `j`, we track the maximum `nums[i]` to its left and combine it with the precomputed maximum to the right.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumTripletValue(nums):
    n = len(nums)

    # Step 1: Precompute maxRight array
    # maxRight[i] = maximum value in nums[i+1:]
    maxRight = [0] * n
    # Initialize last element (no elements to the right)
    maxRight[-1] = 0

    # Fill maxRight from right to left
    for i in range(n - 2, -1, -1):
        # Current maxRight is max of next element's maxRight and next element itself
        maxRight[i] = max(maxRight[i + 1], nums[i + 1])

    # Step 2: Track maxLeft while iterating through j positions
    maxLeft = nums[0]  # Initialize with first element
    maxVal = 0  # Track maximum triplet value

    # Iterate through possible j positions (from index 1 to n-2)
    for j in range(1, n - 1):
        # Calculate value using current maxLeft, current j, and maxRight[j]
        val = (maxLeft - nums[j]) * maxRight[j]
        # Update maximum value
        maxVal = max(maxVal, val)
        # Update maxLeft for next iteration
        maxLeft = max(maxLeft, nums[j])

    return max(maxVal, 0)  # Return 0 if all values are negative
```

```javascript
// Time: O(n) | Space: O(n)
function maximumTripletValue(nums) {
  const n = nums.length;

  // Step 1: Precompute maxRight array
  // maxRight[i] = maximum value in nums[i+1:]
  const maxRight = new Array(n).fill(0);
  // Initialize last element (no elements to the right)
  maxRight[n - 1] = 0;

  // Fill maxRight from right to left
  for (let i = n - 2; i >= 0; i--) {
    // Current maxRight is max of next element's maxRight and next element itself
    maxRight[i] = Math.max(maxRight[i + 1], nums[i + 1]);
  }

  // Step 2: Track maxLeft while iterating through j positions
  let maxLeft = nums[0]; // Initialize with first element
  let maxVal = 0; // Track maximum triplet value

  // Iterate through possible j positions (from index 1 to n-2)
  for (let j = 1; j < n - 1; j++) {
    // Calculate value using current maxLeft, current j, and maxRight[j]
    const val = (maxLeft - nums[j]) * maxRight[j];
    // Update maximum value
    maxVal = Math.max(maxVal, val);
    // Update maxLeft for next iteration
    maxLeft = Math.max(maxLeft, nums[j]);
  }

  return Math.max(maxVal, 0); // Return 0 if all values are negative
}
```

```java
// Time: O(n) | Space: O(n)
public long maximumTripletValue(int[] nums) {
    int n = nums.length;

    // Step 1: Precompute maxRight array
    // maxRight[i] = maximum value in nums[i+1:]
    int[] maxRight = new int[n];
    // Initialize last element (no elements to the right)
    maxRight[n - 1] = 0;

    // Fill maxRight from right to left
    for (int i = n - 2; i >= 0; i--) {
        // Current maxRight is max of next element's maxRight and next element itself
        maxRight[i] = Math.max(maxRight[i + 1], nums[i + 1]);
    }

    // Step 2: Track maxLeft while iterating through j positions
    int maxLeft = nums[0];  // Initialize with first element
    long maxVal = 0;  // Track maximum triplet value

    // Iterate through possible j positions (from index 1 to n-2)
    for (int j = 1; j < n - 1; j++) {
        // Calculate value using current maxLeft, current j, and maxRight[j]
        long val = (long)(maxLeft - nums[j]) * maxRight[j];
        // Update maximum value
        maxVal = Math.max(maxVal, val);
        // Update maxLeft for next iteration
        maxLeft = Math.max(maxLeft, nums[j]);
    }

    return Math.max(maxVal, 0);  // Return 0 if all values are negative
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array:
  1. One pass from right to left to compute `maxRight` array
  2. One pass from left to right to compute the maximum triplet value
- Each pass processes each element exactly once, resulting in O(n) time.

**Space Complexity: O(n)**

- We use an additional array `maxRight` of size n to store maximum values to the right of each position.
- We could optimize to O(1) space by computing maxRight on the fly, but the O(n) solution is clearer and still efficient.

## Common Mistakes

1. **Off-by-one errors in indices**: When computing `maxRight`, it's easy to confuse whether to use `nums[i+1]` or `nums[i]`. Remember: `maxRight[i]` should contain the maximum value in `nums[i+1:]`, not including `nums[i]` itself.

2. **Forgetting to handle the return 0 case**: The problem states to return 0 if all triplets have negative value. Some candidates forget to take the maximum with 0 at the end.

3. **Integer overflow**: In languages like Java, the product `(nums[i] - nums[j]) * nums[k]` can exceed 32-bit integer limits. Always use `long` for intermediate calculations.

4. **Incorrect initialization of maxRight**: The last element of `maxRight` should be 0 (or negative infinity) since there are no elements to the right. Using the last element of `nums` instead would be incorrect.

## When You'll See This Pattern

This problem uses the **prefix/suffix maximum** pattern, which appears in many array optimization problems:

1. **Trapping Rain Water (Hard)**: Uses both left and right maximums to determine how much water can be trapped at each position.

2. **Maximum Product Subarray (Medium)**: While not identical, it also involves tracking maximum values while iterating through an array.

3. **Best Time to Buy and Sell Stock (Easy)**: Similar concept of tracking minimum price seen so far (like our `maxLeft`) and calculating potential profit.

The core idea is to precompute useful information about the array to avoid redundant calculations, transforming an O(n³) problem into O(n).

## Key Takeaways

1. **When dealing with ordered triplets `(i, j, k)`, consider fixing the middle element**: This reduces the problem from checking all O(n³) triplets to O(n) possibilities for `j`, with O(1) computation for each using precomputed information.

2. **Prefix/suffix arrays are powerful tools**: When you need information about elements before or after a certain position, precomputing prefix or suffix arrays can dramatically improve efficiency.

3. **Always check for overflow in product calculations**: Even in "Easy" problems, test cases may include large numbers that cause integer overflow in some languages.

Related problems: [Number of Arithmetic Triplets](/problem/number-of-arithmetic-triplets), [Minimum Sum of Mountain Triplets I](/problem/minimum-sum-of-mountain-triplets-i)
