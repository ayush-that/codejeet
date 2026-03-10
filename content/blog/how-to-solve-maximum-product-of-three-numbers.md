---
title: "How to Solve Maximum Product of Three Numbers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Product of Three Numbers. Easy difficulty, 45.7% acceptance rate. Topics: Array, Math, Sorting."
date: "2027-05-23"
category: "dsa-patterns"
tags: ["maximum-product-of-three-numbers", "array", "math", "sorting", "easy"]
---

# How to Solve Maximum Product of Three Numbers

This problem asks us to find the maximum product we can get by multiplying any three numbers from an integer array. While it seems straightforward, the tricky part is that negative numbers can flip the sign of products, and two negative numbers multiplied together give a positive result. This means the maximum product might come from either the three largest positive numbers, or from the two smallest (most negative) numbers multiplied by the largest positive number.

## Visual Walkthrough

Let's trace through an example: `nums = [-10, -10, 5, 2, 8]`

**Step 1: Sort the array** (we'll see why sorting helps in the optimal solution)
Sorted: `[-10, -10, 2, 5, 8]`

**Step 2: Consider the two candidate products:**

1. **Product of three largest numbers**: `2 × 5 × 8 = 80`
2. **Product of two smallest (most negative) and largest**: `(-10) × (-10) × 8 = 800`

**Step 3: Compare candidates:**

- Candidate 1: 80
- Candidate 2: 800

**Step 4: Maximum product is 800**

The key insight: When we have negative numbers, multiplying two negatives gives a positive, which might create a larger product than using three positive numbers. This is why we need to check both possibilities.

## Brute Force Approach

The most straightforward approach is to try all possible combinations of three numbers from the array and keep track of the maximum product found.

**Why this is insufficient:**

- For an array of size `n`, there are `C(n, 3) = n!/(3!(n-3)!)` combinations
- This is approximately `O(n³)` time complexity
- For `n = 1000`, that's about 166 million operations, which is far too slow
- The problem constraints typically expect `O(n)` or `O(n log n)` solutions

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def maximumProduct(nums):
    n = len(nums)
    max_product = float('-inf')

    # Try all combinations of three numbers
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                product = nums[i] * nums[j] * nums[k]
                max_product = max(max_product, product)

    return max_product
```

```javascript
// Time: O(n³) | Space: O(1)
function maximumProduct(nums) {
  let maxProduct = -Infinity;
  const n = nums.length;

  // Try all combinations of three numbers
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const product = nums[i] * nums[j] * nums[k];
        maxProduct = Math.max(maxProduct, product);
      }
    }
  }

  return maxProduct;
}
```

```java
// Time: O(n³) | Space: O(1)
public int maximumProduct(int[] nums) {
    int maxProduct = Integer.MIN_VALUE;
    int n = nums.length;

    // Try all combinations of three numbers
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                int product = nums[i] * nums[j] * nums[k];
                maxProduct = Math.max(maxProduct, product);
            }
        }
    }

    return maxProduct;
}
```

</div>

## Optimal Solution

The optimal solution uses sorting or linear scanning to find the necessary values. We need either:

1. The three largest numbers (for the all-positive case)
2. The two smallest (most negative) numbers and the largest number (for the case where negatives create a large positive)

After sorting, these values are at the beginning and end of the array. We can also solve this in `O(n)` time by scanning once to find these five key values.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumProduct(nums):
    # Initialize variables to track the three largest numbers
    # We use -inf to handle negative numbers correctly
    max1 = max2 = max3 = float('-inf')

    # Initialize variables to track the two smallest numbers
    # We use inf to handle positive numbers correctly
    min1 = min2 = float('inf')

    # Single pass through the array to find all five key values
    for num in nums:
        # Update the three largest numbers
        if num > max1:
            max3 = max2  # Previous second largest becomes third largest
            max2 = max1  # Previous largest becomes second largest
            max1 = num   # New largest
        elif num > max2:
            max3 = max2  # Previous second largest becomes third largest
            max2 = num   # New second largest
        elif num > max3:
            max3 = num   # New third largest

        # Update the two smallest numbers
        if num < min1:
            min2 = min1  # Previous smallest becomes second smallest
            min1 = num   # New smallest
        elif num < min2:
            min2 = num   # New second smallest

    # Calculate the two possible maximum products:
    # 1. Product of three largest numbers
    # 2. Product of two smallest (most negative) and largest number
    return max(max1 * max2 * max3, min1 * min2 * max1)
```

```javascript
// Time: O(n) | Space: O(1)
function maximumProduct(nums) {
  // Initialize variables to track the three largest numbers
  // Use -Infinity to handle negative numbers correctly
  let max1 = -Infinity,
    max2 = -Infinity,
    max3 = -Infinity;

  // Initialize variables to track the two smallest numbers
  // Use Infinity to handle positive numbers correctly
  let min1 = Infinity,
    min2 = Infinity;

  // Single pass through the array to find all five key values
  for (let num of nums) {
    // Update the three largest numbers
    if (num > max1) {
      max3 = max2; // Previous second largest becomes third largest
      max2 = max1; // Previous largest becomes second largest
      max1 = num; // New largest
    } else if (num > max2) {
      max3 = max2; // Previous second largest becomes third largest
      max2 = num; // New second largest
    } else if (num > max3) {
      max3 = num; // New third largest
    }

    // Update the two smallest numbers
    if (num < min1) {
      min2 = min1; // Previous smallest becomes second smallest
      min1 = num; // New smallest
    } else if (num < min2) {
      min2 = num; // New second smallest
    }
  }

  // Calculate the two possible maximum products:
  // 1. Product of three largest numbers
  // 2. Product of two smallest (most negative) and largest number
  return Math.max(max1 * max2 * max3, min1 * min2 * max1);
}
```

```java
// Time: O(n) | Space: O(1)
public int maximumProduct(int[] nums) {
    // Initialize variables to track the three largest numbers
    // Use Integer.MIN_VALUE to handle negative numbers correctly
    int max1 = Integer.MIN_VALUE, max2 = Integer.MIN_VALUE, max3 = Integer.MIN_VALUE;

    // Initialize variables to track the two smallest numbers
    // Use Integer.MAX_VALUE to handle positive numbers correctly
    int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE;

    // Single pass through the array to find all five key values
    for (int num : nums) {
        // Update the three largest numbers
        if (num > max1) {
            max3 = max2;  // Previous second largest becomes third largest
            max2 = max1;  // Previous largest becomes second largest
            max1 = num;   // New largest
        } else if (num > max2) {
            max3 = max2;  // Previous second largest becomes third largest
            max2 = num;   // New second largest
        } else if (num > max3) {
            max3 = num;   // New third largest
        }

        // Update the two smallest numbers
        if (num < min1) {
            min2 = min1;  // Previous smallest becomes second smallest
            min1 = num;   // New smallest
        } else if (num < min2) {
            min2 = num;   // New second smallest
        }
    }

    // Calculate the two possible maximum products:
    // 1. Product of three largest numbers
    // 2. Product of two smallest (most negative) and largest number
    return Math.max(max1 * max2 * max3, min1 * min2 * max1);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array of size `n`
- Each element is processed once, with constant-time operations for comparisons and updates
- This is optimal since we must examine each element at least once

**Space Complexity: O(1)**

- We only use a fixed number of variables (5 variables) regardless of input size
- No additional data structures that grow with input size

**Alternative Sorting Approach:**
If we used sorting, the time complexity would be `O(n log n)` and space complexity would be `O(1)` if sorting in-place, or `O(n)` if not. The linear approach is more efficient and demonstrates better algorithmic thinking.

## Common Mistakes

1. **Only considering positive numbers**: Many candidates forget that two negatives multiplied give a positive, which could create a larger product than three positives. Always check both `max1 * max2 * max3` and `min1 * min2 * max1`.

2. **Incorrect initialization of tracking variables**: When tracking maximum values, initialize with `-infinity` (or `Integer.MIN_VALUE` in Java) to handle arrays with all negative numbers. For minimum values, use `infinity` (or `Integer.MAX_VALUE` in Java).

3. **Off-by-one errors in the update logic**: When updating the three maximum values, the order matters. Always update from smallest to largest: `max3 = max2`, then `max2 = max1`, then `max1 = num`. Doing this in reverse would overwrite values incorrectly.

4. **Assuming the array has at least 3 elements**: While the problem constraints typically guarantee this, it's good practice to check. Add a guard clause: `if len(nums) < 3: return 0` or handle appropriately.

## When You'll See This Pattern

This "track extreme values" pattern appears in many problems where you need to find combinations of elements with certain properties:

1. **Maximum Product Subarray (LeetCode 152)**: Similar concept of tracking both maximum and minimum products due to negative numbers flipping signs, but applied to contiguous subarrays.

2. **Find Peak Element (LeetCode 162)**: While different, it also involves tracking extreme values in a single pass.

3. **Third Maximum Number (LeetCode 414)**: Directly uses the same technique of tracking the top three values in one pass.

4. **Kth Largest Element in an Array (LeetCode 215)**: Generalizes the concept to finding the kth largest element, often solved with similar tracking or heap-based approaches.

## Key Takeaways

1. **Negative numbers can be your friend in product problems**: Two negatives make a positive, so the maximum product might involve negative numbers when they come in pairs.

2. **Track extreme values in one pass**: Instead of sorting (O(n log n)), you can often track the top/bottom k values in O(n) time with O(1) space by maintaining running variables.

3. **Consider all cases systematically**: For product problems, enumerate the possible sign combinations. For three numbers, the maximum will either be from three positives or two negatives and one positive.

Related problems: [Maximum Product Subarray](/problem/maximum-product-subarray), [Maximum Product of Three Elements After One Replacement](/problem/maximum-product-of-three-elements-after-one-replacement)
