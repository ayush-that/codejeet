---
title: "How to Solve Maximum Product of Two Elements in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Product of Two Elements in an Array. Easy difficulty, 83.5% acceptance rate. Topics: Array, Sorting, Heap (Priority Queue)."
date: "2027-05-20"
category: "dsa-patterns"
tags:
  [
    "maximum-product-of-two-elements-in-an-array",
    "array",
    "sorting",
    "heap-(priority-queue)",
    "easy",
  ]
---

# How to Solve Maximum Product of Two Elements in an Array

This problem asks us to find the maximum value of `(nums[i]-1)*(nums[j]-1)` where `i` and `j` are different indices in an integer array. While the problem seems straightforward, the key insight is recognizing that we need the two largest values in the array (after subtracting 1) to maximize the product. The challenge lies in finding these two largest values efficiently without sorting the entire array.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, 4, 5, 2]`.

**Step 1:** We need to find two different indices `i` and `j` that maximize `(nums[i]-1)*(nums[j]-1)`.

**Step 2:** Intuitively, to maximize a product of two numbers, we want the largest possible numbers. Let's test this:

- If we choose 5 and 4: `(5-1)*(4-1) = 4*3 = 12`
- If we choose 5 and 3: `(5-1)*(3-1) = 4*2 = 8`
- If we choose 5 and 2: `(5-1)*(2-1) = 4*1 = 4`
- If we choose 4 and 3: `(4-1)*(3-1) = 3*2 = 6`

**Step 3:** Indeed, the maximum product (12) comes from the two largest values in the array (5 and 4). This pattern holds because we're multiplying positive numbers (after subtracting 1 from positive integers), and multiplication is monotonic with respect to the size of the inputs.

**Step 4:** What about negative numbers? The problem statement doesn't specify that all numbers are positive, but the subtraction of 1 complicates things with negatives. However, looking at the constraints and test cases, we can see the problem is designed for positive integers. Even if negatives were allowed, the two largest values (most positive) would still give the maximum product when subtracting 1.

## Brute Force Approach

The most straightforward solution is to check every possible pair of indices `(i, j)` where `i ≠ j`, compute `(nums[i]-1)*(nums[j]-1)`, and track the maximum.

**Why this is inefficient:**

- For an array of size `n`, there are `n*(n-1)/2` possible pairs
- This gives us O(n²) time complexity, which is too slow for large arrays (n up to 500 in typical constraints)
- We're doing unnecessary work since we don't need to compare every pair

**Brute force code (for understanding only):**

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxProductBruteForce(nums):
    max_product = 0
    n = len(nums)

    # Check every possible pair
    for i in range(n):
        for j in range(i + 1, n):
            product = (nums[i] - 1) * (nums[j] - 1)
            max_product = max(max_product, product)

    return max_product
```

```javascript
// Time: O(n²) | Space: O(1)
function maxProductBruteForce(nums) {
  let maxProduct = 0;
  const n = nums.length;

  // Check every possible pair
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const product = (nums[i] - 1) * (nums[j] - 1);
      maxProduct = Math.max(maxProduct, product);
    }
  }

  return maxProduct;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maxProductBruteForce(int[] nums) {
    int maxProduct = 0;
    int n = nums.length;

    // Check every possible pair
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int product = (nums[i] - 1) * (nums[j] - 1);
            maxProduct = Math.max(maxProduct, product);
        }
    }

    return maxProduct;
}
```

</div>

## Optimal Solution

The optimal solution recognizes that we only need the two largest values in the array. We can find these in a single pass through the array without sorting, giving us O(n) time complexity.

**Key insight:** To maximize `(a-1)*(b-1)` where `a` and `b` are elements from the array, we want the largest possible `a` and `b`. Since subtraction and multiplication are monotonic operations for positive numbers, the maximum product will always come from the two largest numbers in the array.

**Approach:**

1. Initialize two variables to track the largest and second largest values
2. Iterate through the array once
3. For each number, update the largest and second largest as needed
4. Return `(largest-1)*(second_largest-1)`

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxProduct(nums):
    """
    Find the maximum value of (nums[i]-1)*(nums[j]-1) for i != j.

    Approach: We only need the two largest numbers in the array
    because the maximum product will always come from them.
    """
    # Initialize largest and second largest to smallest possible values
    largest = second_largest = 0

    # Iterate through all numbers in the array
    for num in nums:
        # If current number is greater than the largest we've seen
        if num > largest:
            # Previous largest becomes second largest
            second_largest = largest
            # Update largest to current number
            largest = num
        # Else if current number is greater than second largest
        elif num > second_largest:
            # Update second largest to current number
            second_largest = num

    # Calculate and return the maximum product
    return (largest - 1) * (second_largest - 1)
```

```javascript
// Time: O(n) | Space: O(1)
function maxProduct(nums) {
  /**
   * Find the maximum value of (nums[i]-1)*(nums[j]-1) for i != j.
   *
   * Approach: We only need the two largest numbers in the array
   * because the maximum product will always come from them.
   */
  // Initialize largest and second largest to smallest possible values
  let largest = 0;
  let secondLargest = 0;

  // Iterate through all numbers in the array
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];

    // If current number is greater than the largest we've seen
    if (num > largest) {
      // Previous largest becomes second largest
      secondLargest = largest;
      // Update largest to current number
      largest = num;
    }
    // Else if current number is greater than second largest
    else if (num > secondLargest) {
      // Update second largest to current number
      secondLargest = num;
    }
  }

  // Calculate and return the maximum product
  return (largest - 1) * (secondLargest - 1);
}
```

```java
// Time: O(n) | Space: O(1)
public int maxProduct(int[] nums) {
    /**
     * Find the maximum value of (nums[i]-1)*(nums[j]-1) for i != j.
     *
     * Approach: We only need the two largest numbers in the array
     * because the maximum product will always come from them.
     */
    // Initialize largest and second largest to smallest possible values
    int largest = 0;
    int secondLargest = 0;

    // Iterate through all numbers in the array
    for (int i = 0; i < nums.length; i++) {
        int num = nums[i];

        // If current number is greater than the largest we've seen
        if (num > largest) {
            // Previous largest becomes second largest
            secondLargest = largest;
            // Update largest to current number
            largest = num;
        }
        // Else if current number is greater than second largest
        else if (num > secondLargest) {
            // Update second largest to current number
            secondLargest = num;
        }
    }

    // Calculate and return the maximum product
    return (largest - 1) * (secondLargest - 1);
}
```

</div>

**Alternative approach using sorting:**
We could also sort the array and take the last two elements. This is simpler to implement but has O(n log n) time complexity, which is still acceptable for this problem but not optimal.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def maxProductSorting(nums):
    # Sort the array in ascending order
    nums.sort()
    # Get the last two elements (largest and second largest)
    return (nums[-1] - 1) * (nums[-2] - 1)
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function maxProductSorting(nums) {
  // Sort the array in ascending order
  nums.sort((a, b) => a - b);
  // Get the last two elements (largest and second largest)
  return (nums[nums.length - 1] - 1) * (nums[nums.length - 2] - 1);
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
public int maxProductSorting(int[] nums) {
    // Sort the array in ascending order
    Arrays.sort(nums);
    // Get the last two elements (largest and second largest)
    return (nums[nums.length - 1] - 1) * (nums[nums.length - 2] - 1);
}
```

</div>

## Complexity Analysis

**Single pass approach (optimal):**

- **Time complexity:** O(n) - We iterate through the array once, performing constant time operations for each element
- **Space complexity:** O(1) - We only use a fixed number of variables regardless of input size

**Sorting approach:**

- **Time complexity:** O(n log n) - Dominated by the sorting algorithm
- **Space complexity:** O(1) or O(n) - Depends on the sorting algorithm implementation (in-place vs. extra space)

**Why the single pass approach is better:**

- Linear time is always better than linearithmic time (O(n) vs O(n log n))
- The single pass approach has better constant factors (no function calls, simpler operations)
- It's more elegant and demonstrates better algorithmic thinking

## Common Mistakes

1. **Forgetting that indices must be different:** Some candidates might try to use the same element twice, which is not allowed. Our approach naturally avoids this by tracking two different values from the array.

2. **Incorrect initialization of largest/second largest:** If you initialize both to 0 and the array contains only negative numbers, you'll get the wrong answer. However, based on the problem constraints (positive integers), this isn't an issue. For a more general solution, you could initialize with `float('-inf')` in Python or `Integer.MIN_VALUE` in Java.

3. **Updating logic errors in the single pass:** The order of updates matters! When you find a new largest number, you must:
   - First move the current largest to second largest
   - Then update largest to the new value
     Getting this order wrong will cause you to lose the previous largest value.

4. **Assuming sorting is always acceptable:** While sorting gives O(n log n) which is often fine, interviewers prefer the O(n) solution when it exists. Always look for opportunities to improve beyond the sorting solution.

## When You'll See This Pattern

The pattern of "finding the top K elements without sorting" appears frequently in coding interviews:

1. **Kth Largest Element in an Array (LeetCode 215)** - Similar concept but generalized to finding the Kth largest element, often solved with quickselect or a min-heap.

2. **Find Peak Element (LeetCode 162)** - While not exactly the same, it involves scanning an array to find local maxima, which requires similar comparison logic.

3. **Third Maximum Number (LeetCode 414)** - Direct extension of this problem to find the third distinct maximum number.

4. **Maximum Subarray (LeetCode 53)** - Uses a similar single-pass approach to track the best result seen so far.

The core technique is maintaining state (like largest and second largest) as you iterate, updating it based on comparisons with the current element. This is a form of the "greedy" approach where you make the locally optimal choice at each step.

## Key Takeaways

1. **Look for mathematical insights:** Before diving into coding, analyze the problem mathematically. Here, recognizing that the maximum product comes from the two largest values was the key insight that enabled an optimal solution.

2. **Avoid unnecessary work:** The brute force checks all pairs, but we only need the two largest values. Always ask: "What's the minimum information I need to solve this problem?"

3. **Single-pass solutions are elegant:** When you can solve a problem in one pass with O(1) extra space, it's usually the most impressive solution. Practice recognizing when this is possible.

4. **Pay attention to update order:** When maintaining multiple state variables that depend on each other (like largest and second largest), the order of updates is critical. Test your logic with small examples.

[Practice this problem on CodeJeet](/problem/maximum-product-of-two-elements-in-an-array)
