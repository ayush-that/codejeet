---
title: "How to Solve Product of Array Except Self — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Product of Array Except Self. Medium difficulty, 68.6% acceptance rate. Topics: Array, Prefix Sum."
date: "2026-03-02"
category: "dsa-patterns"
tags: ["product-of-array-except-self", "array", "prefix-sum", "medium"]
---

# How to Solve Product of Array Except Self

The problem asks us to create an output array where each element is the product of all numbers in the input array except the one at that index. What makes this problem interesting is the constraint: we need an O(n) time solution without using division, which forces us to think creatively about prefix and suffix products.

## Visual Walkthrough

Let's trace through the example `nums = [1, 2, 3, 4]`:

We want to calculate:

- `answer[0]` = product of all elements except `nums[0]` = 2 × 3 × 4 = 24
- `answer[1]` = product of all elements except `nums[1]` = 1 × 3 × 4 = 12
- `answer[2]` = product of all elements except `nums[2]` = 1 × 2 × 4 = 8
- `answer[3]` = product of all elements except `nums[3]` = 1 × 2 × 3 = 6

The key insight is that `answer[i]` = (product of all elements to the left of i) × (product of all elements to the right of i).

For `nums = [1, 2, 3, 4]`:

- Left products: `[1, 1, 2, 6]` (product of all elements before each index)
- Right products: `[24, 12, 4, 1]` (product of all elements after each index)
- Final answer: `[1×24, 1×12, 2×4, 6×1]` = `[24, 12, 8, 6]`

## Brute Force Approach

The most straightforward solution is to use nested loops: for each index `i`, multiply all elements except `nums[i]`.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) excluding output array
def productExceptSelf(nums):
    n = len(nums)
    answer = [1] * n

    for i in range(n):
        product = 1
        for j in range(n):
            if i != j:
                product *= nums[j]
        answer[i] = product

    return answer
```

```javascript
// Time: O(n²) | Space: O(1) excluding output array
function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(1);

  for (let i = 0; i < n; i++) {
    let product = 1;
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        product *= nums[j];
      }
    }
    answer[i] = product;
  }

  return answer;
}
```

```java
// Time: O(n²) | Space: O(1) excluding output array
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] answer = new int[n];

    for (int i = 0; i < n; i++) {
        int product = 1;
        for (int j = 0; j < n; j++) {
            if (i != j) {
                product *= nums[j];
            }
        }
        answer[i] = product;
    }

    return answer;
}
```

</div>

**Why this fails:** The O(n²) time complexity is too slow for large inputs. The problem constraints typically require O(n) time. Also, using division (another naive approach) is prohibited by the problem statement.

## Optimized Approach

The optimal solution uses the prefix-suffix product technique. Here's the step-by-step reasoning:

1. **Observation:** `answer[i] = leftProduct[i] × rightProduct[i]`, where:
   - `leftProduct[i]` = product of all elements before index `i`
   - `rightProduct[i]` = product of all elements after index `i`

2. **Two-pass approach:**
   - First pass (left to right): Calculate running prefix products and store them
   - Second pass (right to left): Calculate running suffix products and multiply with prefix products

3. **Space optimization:** Instead of storing separate prefix and suffix arrays, we can:
   - Use the output array to store prefix products in the first pass
   - Use a single variable to track suffix products in the second pass, multiplying as we go

## Optimal Solution

Here's the space-optimized O(n) time, O(1) extra space solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output array
def productExceptSelf(nums):
    n = len(nums)
    answer = [1] * n  # Initialize answer array with 1s

    # First pass: calculate prefix products
    # answer[i] will contain product of all elements to the left of i
    prefix = 1
    for i in range(n):
        answer[i] = prefix  # Store prefix product at current position
        prefix *= nums[i]   # Update prefix for next position

    # Second pass: calculate suffix products and multiply with prefix
    # We traverse from right to left, multiplying prefix with suffix
    suffix = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= suffix  # Multiply prefix with suffix
        suffix *= nums[i]    # Update suffix for next position (moving left)

    return answer
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(1);

  // First pass: calculate prefix products
  // answer[i] will contain product of all elements to the left of i
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = prefix; // Store prefix product at current position
    prefix *= nums[i]; // Update prefix for next position
  }

  // Second pass: calculate suffix products and multiply with prefix
  // We traverse from right to left, multiplying prefix with suffix
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= suffix; // Multiply prefix with suffix
    suffix *= nums[i]; // Update suffix for next position (moving left)
  }

  return answer;
}
```

```java
// Time: O(n) | Space: O(1) excluding output array
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] answer = new int[n];

    // First pass: calculate prefix products
    // answer[i] will contain product of all elements to the left of i
    int prefix = 1;
    for (int i = 0; i < n; i++) {
        answer[i] = prefix;  // Store prefix product at current position
        prefix *= nums[i];   // Update prefix for next position
    }

    // Second pass: calculate suffix products and multiply with prefix
    // We traverse from right to left, multiplying prefix with suffix
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] *= suffix;  // Multiply prefix with suffix
        suffix *= nums[i];    // Update suffix for next position (moving left)
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make two passes through the array: one left-to-right and one right-to-left
- Each pass performs O(1) operations per element
- Total operations: 2n = O(n)

**Space Complexity:** O(1) extra space

- We only use a few integer variables (`prefix`, `suffix`)
- The output array doesn't count toward extra space per problem requirements
- If we counted the output array, it would be O(n), but interview conventions typically exclude it

## Common Mistakes

1. **Using division:** Many candidates immediately think to calculate the total product and divide by `nums[i]`. This fails when there are zeros in the array (division by zero) and is explicitly prohibited by the problem.

2. **Incorrect initialization:** Forgetting to initialize the answer array with 1s or using 0s can lead to incorrect products. Remember that the multiplicative identity is 1, not 0.

3. **Off-by-one errors in suffix calculation:** When calculating suffix products, it's easy to get the indices wrong. Remember:
   - For index `i`, the suffix product should include elements from `i+1` to `n-1`
   - Start `suffix` at 1 and update it after using it for the current position

4. **Not handling edge cases:** While the problem guarantees non-empty arrays, candidates should still consider:
   - Single element arrays: the answer should be `[1]` (product of empty set is 1)
   - Arrays with zeros: the algorithm handles them correctly since multiplication by zero works naturally

## When You'll See This Pattern

The prefix-suffix technique appears in several other problems:

1. **Trapping Rain Water (Hard):** Uses prefix and suffix arrays to track maximum heights to the left and right of each position, similar to how we track products here.

2. **Maximum Product Subarray (Medium):** While different in goal, it also deals with tracking products and requires careful handling of negative numbers and zeros.

3. **Candy (Hard):** Uses two passes (left-to-right and right-to-left) to ensure candy distribution rules are satisfied, similar to our two-pass approach.

4. **Range Sum Query - Immutable (Easy):** Uses prefix sums, which is the additive version of what we're doing with products.

## Key Takeaways

1. **Prefix-suffix decomposition:** When you need to combine information from both sides of an element, consider calculating prefix (left-to-right) and suffix (right-to-left) values separately, then combine them.

2. **Space optimization:** Many two-pass solutions can be optimized from O(n) extra space to O(1) by reusing the output array and tracking running values with variables.

3. **Multiplicative identity:** Remember that the multiplicative identity is 1 (just as the additive identity is 0). This is crucial for initializing products.

Related problems: [Trapping Rain Water](/problem/trapping-rain-water), [Maximum Product Subarray](/problem/maximum-product-subarray), [Paint House II](/problem/paint-house-ii)
