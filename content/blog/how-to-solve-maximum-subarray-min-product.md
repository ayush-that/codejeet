---
title: "How to Solve Maximum Subarray Min-Product — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Subarray Min-Product. Medium difficulty, 40.0% acceptance rate. Topics: Array, Stack, Monotonic Stack, Prefix Sum."
date: "2028-11-29"
category: "dsa-patterns"
tags: ["maximum-subarray-min-product", "array", "stack", "monotonic-stack", "medium"]
---

# How to Solve Maximum Subarray Min-Product

This problem asks us to find the maximum **min-product** across all non-empty subarrays of an integer array. The min-product is defined as the minimum value in a subarray multiplied by the sum of all elements in that subarray. What makes this problem interesting is that we need to consider every possible subarray, but doing so naively would be far too slow. The key insight is that for each element, we want to find the largest subarray where it serves as the minimum value.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [1, 2, 3, 2]`

We need to find the maximum value of `min(subarray) * sum(subarray)` across all subarrays.

**Step 1: Consider each element as the minimum**

- For element at index 0 (value 1): The largest subarray where 1 is the minimum is the entire array `[1, 2, 3, 2]` since 1 is the smallest element. Sum = 8, min-product = 1 × 8 = 8.
- For element at index 1 (value 2): The largest subarray where 2 is the minimum extends from index 1 to 3: `[2, 3, 2]`. Sum = 7, min-product = 2 × 7 = 14.
- For element at index 2 (value 3): The largest subarray where 3 is the minimum is just `[3]`. Sum = 3, min-product = 3 × 3 = 9.
- For element at index 3 (value 2): The largest subarray where 2 is the minimum extends from index 1 to 3: `[2, 3, 2]`. Sum = 7, min-product = 2 × 7 = 14.

**Step 2: Find the maximum**
The maximum min-product we found is 14.

**Key observation**: For each element, we need to find how far it can extend to the left and right while remaining the minimum. This is exactly what a monotonic stack helps us compute efficiently.

## Brute Force Approach

The most straightforward approach is to check every possible subarray:

1. Generate all possible starting and ending indices (i, j) where i ≤ j
2. For each subarray, find the minimum value and compute the sum
3. Calculate min-product = minimum × sum
4. Track the maximum min-product encountered

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def maxSumMinProduct(nums):
    n = len(nums)
    max_product = 0

    # Check all possible subarrays
    for i in range(n):
        for j in range(i, n):
            # Find minimum in subarray nums[i:j+1]
            min_val = min(nums[i:j+1])
            # Calculate sum of subarray
            subarray_sum = sum(nums[i:j+1])
            # Update max product
            max_product = max(max_product, min_val * subarray_sum)

    return max_product % (10**9 + 7)
```

```javascript
// Time: O(n³) | Space: O(1)
function maxSumMinProduct(nums) {
  let maxProduct = 0;
  const n = nums.length;

  // Check all possible subarrays
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Find minimum in subarray nums[i..j]
      let minVal = Infinity;
      let sum = 0;
      for (let k = i; k <= j; k++) {
        minVal = Math.min(minVal, nums[k]);
        sum += nums[k];
      }
      // Update max product
      maxProduct = Math.max(maxProduct, minVal * sum);
    }
  }

  return maxProduct % 1000000007;
}
```

```java
// Time: O(n³) | Space: O(1)
public int maxSumMinProduct(int[] nums) {
    long maxProduct = 0;
    int n = nums.length;

    // Check all possible subarrays
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Find minimum in subarray nums[i..j]
            int minVal = Integer.MAX_VALUE;
            long sum = 0;
            for (int k = i; k <= j; k++) {
                minVal = Math.min(minVal, nums[k]);
                sum += nums[k];
            }
            // Update max product
            maxProduct = Math.max(maxProduct, minVal * sum);
        }
    }

    return (int)(maxProduct % 1_000_000_007);
}
```

</div>

**Why this is insufficient**: With O(n³) time complexity, this solution times out for arrays with more than a few hundred elements. We need to optimize both finding the minimum and computing the sum for each subarray.

## Optimized Approach

The key insight is that for each element, we want to find the largest subarray where it is the minimum. Once we know this subarray, we can compute its sum using prefix sums and calculate the min-product.

**Step-by-step reasoning**:

1. **Prefix Sums**: Precompute prefix sums so we can get the sum of any subarray in O(1) time.
2. **Monotonic Stack**: For each element, find:
   - The previous smaller element (to the left)
   - The next smaller element (to the right)

   These define the boundaries of the largest subarray where the current element is the minimum.

3. **Calculate min-product**: For each element, compute:
   - Subarray sum = prefixSum[right+1] - prefixSum[left]
   - Min-product = nums[i] × subarray sum
4. **Track maximum**: Keep track of the maximum min-product found.

The monotonic stack helps us find the "next smaller element" and "previous smaller element" for each index in O(n) time.

## Optimal Solution

Here's the complete solution using prefix sums and monotonic stack:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maxSumMinProduct(nums):
    n = len(nums)
    MOD = 10**9 + 7

    # Step 1: Compute prefix sums for O(1) range sum queries
    # prefix[i] = sum of first i elements (prefix[0] = 0)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    # Step 2: Find next smaller element for each index using monotonic stack
    next_smaller = [n] * n  # default to n (end of array)
    stack = []

    for i in range(n):
        # While stack is not empty and current element is smaller than stack top
        while stack and nums[i] < nums[stack[-1]]:
            # Current element is the next smaller for the element at stack top
            idx = stack.pop()
            next_smaller[idx] = i
        stack.append(i)

    # Step 3: Find previous smaller element for each index
    prev_smaller = [-1] * n  # default to -1 (start of array)
    stack.clear()

    for i in range(n - 1, -1, -1):
        # While stack is not empty and current element is smaller than stack top
        while stack and nums[i] < nums[stack[-1]]:
            # Current element is the previous smaller for the element at stack top
            idx = stack.pop()
            prev_smaller[idx] = i
        stack.append(i)

    # Step 4: Calculate maximum min-product
    max_product = 0

    for i in range(n):
        # Boundaries of subarray where nums[i] is minimum
        left = prev_smaller[i] + 1  # inclusive
        right = next_smaller[i] - 1  # inclusive

        # Sum of subarray from left to right
        subarray_sum = prefix[right + 1] - prefix[left]

        # Update maximum min-product
        max_product = max(max_product, nums[i] * subarray_sum)

    return max_product % MOD
```

```javascript
// Time: O(n) | Space: O(n)
function maxSumMinProduct(nums) {
  const n = nums.length;
  const MOD = 1000000007;

  // Step 1: Compute prefix sums for O(1) range sum queries
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // Step 2: Find next smaller element for each index
  const nextSmaller = new Array(n).fill(n); // default to n
  const stack = [];

  for (let i = 0; i < n; i++) {
    // While current element is smaller than stack top
    while (stack.length > 0 && nums[i] < nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      nextSmaller[idx] = i;
    }
    stack.push(i);
  }

  // Step 3: Find previous smaller element for each index
  const prevSmaller = new Array(n).fill(-1); // default to -1
  stack.length = 0; // clear stack

  for (let i = n - 1; i >= 0; i--) {
    // While current element is smaller than stack top
    while (stack.length > 0 && nums[i] < nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      prevSmaller[idx] = i;
    }
    stack.push(i);
  }

  // Step 4: Calculate maximum min-product
  let maxProduct = 0;

  for (let i = 0; i < n; i++) {
    // Boundaries of subarray where nums[i] is minimum
    const left = prevSmaller[i] + 1; // inclusive
    const right = nextSmaller[i] - 1; // inclusive

    // Sum of subarray from left to right
    const subarraySum = prefix[right + 1] - prefix[left];

    // Update maximum min-product
    maxProduct = Math.max(maxProduct, nums[i] * subarraySum);
  }

  return maxProduct % MOD;
}
```

```java
// Time: O(n) | Space: O(n)
public int maxSumMinProduct(int[] nums) {
    int n = nums.length;
    final int MOD = 1_000_000_007;

    // Step 1: Compute prefix sums for O(1) range sum queries
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    // Step 2: Find next smaller element for each index
    int[] nextSmaller = new int[n];
    Arrays.fill(nextSmaller, n); // default to n
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        // While current element is smaller than stack top
        while (!stack.isEmpty() && nums[i] < nums[stack.peek()]) {
            int idx = stack.pop();
            nextSmaller[idx] = i;
        }
        stack.push(i);
    }

    // Step 3: Find previous smaller element for each index
    int[] prevSmaller = new int[n];
    Arrays.fill(prevSmaller, -1); // default to -1
    stack.clear();

    for (int i = n - 1; i >= 0; i--) {
        // While current element is smaller than stack top
        while (!stack.isEmpty() && nums[i] < nums[stack.peek()]) {
            int idx = stack.pop();
            prevSmaller[idx] = i;
        }
        stack.push(i);
    }

    // Step 4: Calculate maximum min-product
    long maxProduct = 0;

    for (int i = 0; i < n; i++) {
        // Boundaries of subarray where nums[i] is minimum
        int left = prevSmaller[i] + 1; // inclusive
        int right = nextSmaller[i] - 1; // inclusive

        // Sum of subarray from left to right
        long subarraySum = prefix[right + 1] - prefix[left];

        // Update maximum min-product
        maxProduct = Math.max(maxProduct, nums[i] * subarraySum);
    }

    return (int)(maxProduct % MOD);
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- Computing prefix sums: O(n)
- Finding next smaller elements with monotonic stack: O(n) - each element is pushed and popped at most once
- Finding previous smaller elements with monotonic stack: O(n)
- Calculating max product: O(n)
- Total: O(n)

**Space Complexity**: O(n)

- Prefix sums array: O(n)
- Next smaller array: O(n)
- Previous smaller array: O(n)
- Stack: O(n) in worst case
- Total: O(n)

## Common Mistakes

1. **Forgetting to use modulo operation**: The problem requires returning the result modulo 10^9+7. Candidates often compute the correct answer but forget this final step.

2. **Off-by-one errors with prefix sums**: When computing subarray sums using prefix sums, remember that `prefix[right+1] - prefix[left]` gives the sum from index `left` to `right` inclusive. A common mistake is using `prefix[right] - prefix[left]` which excludes the element at `right`.

3. **Incorrect stack logic for finding boundaries**: When finding the next smaller element, we use `<` (strictly smaller) not `<=`. Using `<=` would give incorrect boundaries when there are equal elements. For example, in `[2, 2, 2]`, each 2 should only be the minimum of its own single-element subarray, not the entire array.

4. **Not handling large products**: The min-product can be very large (up to 10^5 × sum of entire array). Use 64-bit integers (long in Java/JavaScript, int in Python handles big integers automatically) to avoid overflow.

## When You'll See This Pattern

This problem combines two important patterns: **monotonic stack** for finding next/previous smaller elements and **prefix sums** for efficient range sum queries. You'll see this combination in:

1. **Largest Rectangle in Histogram (LeetCode 84)**: Very similar pattern - find the largest rectangle where each bar's height is the minimum. Instead of sum, we multiply height by width.

2. **Maximum Subarray Min-Product variations**: Any problem asking for maximum (min × some aggregate) or maximum (max × some aggregate) often uses this approach.

3. **Subarray With Elements Greater Than Varying Threshold (LeetCode 2334)**: Direct extension of this pattern with an additional constraint.

## Key Takeaways

1. **Monotonic stack is perfect for "next/previous smaller" problems**: When you need to find boundaries where an element is the minimum/maximum in a range, think monotonic stack.

2. **Prefix sums enable O(1) range sum queries**: Whenever you need to compute sums of many subarrays, precomputing prefix sums is almost always the right approach.

3. **Break complex problems into simpler subproblems**: This problem seems daunting at first, but breaking it into "find boundaries where element is minimum" and "compute sum efficiently" makes it manageable.

Related problems: [Subarray With Elements Greater Than Varying Threshold](/problem/subarray-with-elements-greater-than-varying-threshold)
