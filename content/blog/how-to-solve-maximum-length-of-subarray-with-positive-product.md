---
title: "How to Solve Maximum Length of Subarray With Positive Product — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Length of Subarray With Positive Product. Medium difficulty, 44.6% acceptance rate. Topics: Array, Dynamic Programming, Greedy."
date: "2027-04-10"
category: "dsa-patterns"
tags:
  [
    "maximum-length-of-subarray-with-positive-product",
    "array",
    "dynamic-programming",
    "greedy",
    "medium",
  ]
---

## How to Solve Maximum Length of Subarray With Positive Product

This problem asks us to find the longest contiguous subarray where the product of all elements is positive. The tricky part is that we're dealing with products (not sums), which means negative numbers flip the sign, and zeros reset everything completely. This creates a dynamic where we need to track both positive and negative product lengths simultaneously.

## Visual Walkthrough

Let's trace through `nums = [1, -2, -3, 4]` step by step:

**Step 1:** Start at index 0 (value = 1)

- Positive product length = 1 (subarray [1])
- Negative product length = 0 (no negative product possible)
- Max length = 1

**Step 2:** Index 1 (value = -2)

- If we extend previous positive product with -2, it becomes negative: negative length = 1 + 1 = 2
- If we extend previous negative product (0) with -2: positive length = 0 + 1 = 1
- But wait, we also need to consider starting fresh at -2: negative length = max(2, 1) = 2
- Positive length = 1, Negative length = 2, Max length = 2

**Step 3:** Index 2 (value = -3)

- Extend positive (1) with -3 → negative: 1 + 1 = 2
- Extend negative (2) with -3 → positive: 2 + 1 = 3
- Max positive = 3, Max negative = 2, Max length = 3

**Step 4:** Index 3 (value = 4)

- Extend positive (3) with 4 → positive: 3 + 1 = 4
- Extend negative (2) with 4 → negative: 2 + 1 = 3
- Max positive = 4, Max negative = 3, Max length = 4

The answer is 4 (subarray [1, -2, -3, 4]).

Now let's see what happens with zeros: `nums = [2, -3, 0, 4, -1]`

- At index 0: pos=1, neg=0, max=1
- At index 1: pos=0, neg=2, max=2
- At index 2 (value=0): Reset both to 0
- At index 3: pos=1, neg=0, max=2
- At index 4: pos=0, neg=2, max=2

Answer is 2 (subarray [4, -1]).

## Brute Force Approach

The brute force solution checks every possible subarray and computes its product:

1. Generate all subarrays using two nested loops
2. For each subarray, compute the product
3. Track the maximum length where product > 0

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def bruteForce(nums):
    n = len(nums)
    max_len = 0

    for i in range(n):
        for j in range(i, n):
            # Compute product of subarray nums[i:j+1]
            product = 1
            for k in range(i, j + 1):
                product *= nums[k]

            if product > 0:
                max_len = max(max_len, j - i + 1)

    return max_len
```

```javascript
// Time: O(n³) | Space: O(1)
function bruteForce(nums) {
  let maxLen = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Compute product of subarray nums[i..j]
      let product = 1;
      for (let k = i; k <= j; k++) {
        product *= nums[k];
      }

      if (product > 0) {
        maxLen = Math.max(maxLen, j - i + 1);
      }
    }
  }

  return maxLen;
}
```

```java
// Time: O(n³) | Space: O(1)
public int bruteForce(int[] nums) {
    int maxLen = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Compute product of subarray nums[i..j]
            long product = 1;  // Use long to avoid overflow
            for (int k = i; k <= j; k++) {
                product *= nums[k];
            }

            if (product > 0) {
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
    }

    return maxLen;
}
```

</div>

**Why this fails:** With O(n³) time complexity, it's far too slow for the typical constraints (n up to 10⁵). We need something that runs in O(n) time.

## Optimized Approach

The key insight is that we don't need to compute actual products—we only need to know whether the product is positive or negative. We can track this using two variables:

1. **pos_len**: Maximum length of subarray ending at current index with positive product
2. **neg_len**: Maximum length of subarray ending at current index with negative product

For each number:

- If **num > 0**:
  - Extending a positive product stays positive: `pos_len = pos_len + 1`
  - Extending a negative product stays negative: `neg_len = neg_len + 1` (if neg_len > 0)
- If **num < 0**:
  - Extending a positive product becomes negative: `neg_len = pos_len + 1`
  - Extending a negative product becomes positive: `pos_len = neg_len + 1` (if neg_len > 0)
  - Also, the number itself is a negative product of length 1

- If **num == 0**:
  - Reset both to 0 (zero breaks any subarray)

We need to be careful with the order of updates since `pos_len` and `neg_len` depend on each other's previous values when num < 0.

## Optimal Solution

Here's the O(n) time, O(1) space solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def getMaxLen(nums):
    """
    Returns the maximum length of a subarray with positive product.

    We track two variables:
    - pos_len: max length of subarray ending at current index with positive product
    - neg_len: max length of subarray ending at current index with negative product

    For each number:
    1. If num > 0:
       - pos_len increases by 1
       - neg_len increases by 1 if it was > 0 (otherwise stays 0)
    2. If num < 0:
       - New pos_len = old neg_len + 1 (if neg_len > 0)
       - New neg_len = old pos_len + 1
    3. If num == 0: Reset both to 0
    """
    max_len = 0
    pos_len = 0  # Length of subarray with positive product ending at current index
    neg_len = 0  # Length of subarray with negative product ending at current index

    for num in nums:
        if num > 0:
            # Positive number extends both positive and negative products
            pos_len += 1
            neg_len = neg_len + 1 if neg_len > 0 else 0
        elif num < 0:
            # Negative number flips the sign
            # Store old pos_len before updating (we need it for neg_len calculation)
            old_pos_len = pos_len
            # New positive length comes from extending old negative product
            pos_len = neg_len + 1 if neg_len > 0 else 0
            # New negative length comes from extending old positive product
            neg_len = old_pos_len + 1
        else:  # num == 0
            # Zero resets everything - cannot include zero in any valid subarray
            pos_len = 0
            neg_len = 0

        # Update maximum length found so far
        max_len = max(max_len, pos_len)

    return max_len
```

```javascript
// Time: O(n) | Space: O(1)
function getMaxLen(nums) {
  let maxLen = 0;
  let posLen = 0; // Length of subarray ending here with positive product
  let negLen = 0; // Length of subarray ending here with negative product

  for (let num of nums) {
    if (num > 0) {
      // Positive number: extends both positive and negative subarrays
      posLen++;
      negLen = negLen > 0 ? negLen + 1 : 0;
    } else if (num < 0) {
      // Negative number: flips the sign
      // Save old posLen before updating (needed for negLen calculation)
      const oldPosLen = posLen;
      // New positive length comes from old negative length
      posLen = negLen > 0 ? negLen + 1 : 0;
      // New negative length comes from old positive length
      negLen = oldPosLen + 1;
    } else {
      // num === 0
      // Zero resets both lengths
      posLen = 0;
      negLen = 0;
    }

    // Update maximum length
    maxLen = Math.max(maxLen, posLen);
  }

  return maxLen;
}
```

```java
// Time: O(n) | Space: O(1)
public int getMaxLen(int[] nums) {
    int maxLen = 0;
    int posLen = 0;  // Max length with positive product ending at current index
    int negLen = 0;  // Max length with negative product ending at current index

    for (int num : nums) {
        if (num > 0) {
            // Positive number extends both sequences
            posLen++;
            negLen = (negLen > 0) ? negLen + 1 : 0;
        } else if (num < 0) {
            // Negative number flips the signs
            // Store old posLen before updating
            int oldPosLen = posLen;
            // New positive length comes from old negative length
            posLen = (negLen > 0) ? negLen + 1 : 0;
            // New negative length comes from old positive length
            negLen = oldPosLen + 1;
        } else {  // num == 0
            // Zero resets both lengths
            posLen = 0;
            negLen = 0;
        }

        // Update the maximum length found so far
        maxLen = Math.max(maxLen, posLen);
    }

    return maxLen;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, performing constant-time operations at each step.

**Space Complexity: O(1)**

- We only use a few integer variables regardless of input size.

## Common Mistakes

1. **Forgetting to handle zeros properly**: Zeros reset the sequence completely. If you don't reset `pos_len` and `neg_len` to 0 when encountering zero, you'll incorrectly count subarrays that include zeros.

2. **Incorrect update order for negative numbers**: When `num < 0`, the new `pos_len` depends on the old `neg_len`, and the new `neg_len` depends on the old `pos_len`. If you update `pos_len` first and then use the new value to compute `neg_len`, you'll get wrong results. Always save the old value.

3. **Not initializing `neg_len` properly**: When extending a negative product sequence, you can only do so if `neg_len > 0`. A single negative number starts a negative sequence of length 1, but you can't extend a non-existent negative sequence.

4. **Overlooking the case where `neg_len = 0`**: When `num > 0` and `neg_len = 0`, you can't extend the negative sequence, so `neg_len` stays 0. Similarly, when `num < 0` and `neg_len = 0`, the new `pos_len` should be 0 (not 1) because you can't get a positive product from just a negative number.

## When You'll See This Pattern

This "track two states" pattern appears in several problems:

1. **Maximum Product Subarray (LeetCode 152)**: Similar concept but tracks actual maximum/minimum products instead of lengths. Both problems handle sign flips from negative numbers.

2. **Subarray Product Less Than K (LeetCode 713)**: Uses a sliding window approach but also deals with products. The key insight is similar—products can grow/ shrink non-linearly.

3. **Count Subarrays With Fixed Bounds (LeetCode 2444)**: While not about products, it uses a similar "tracking state" approach to count valid subarrays based on constraints.

The core pattern is: **When dealing with multiplicative operations (or operations where values don't change monotonically), track both "positive" and "negative" states because they can flip into each other.**

## Key Takeaways

1. **For product-related problems, track sign changes**: Instead of computing actual products, often you only need to know whether the product is positive or negative. Negative numbers flip the sign, zeros reset everything.

2. **Dynamic programming with two states**: When the optimal solution depends on two complementary states (like positive/negative, included/excluded, etc.), maintain variables for both states and update them based on transitions between states.

3. **Order of updates matters**: When state updates depend on each other's previous values, save old values before updating to avoid using already-updated values in subsequent calculations.

[Practice this problem on CodeJeet](/problem/maximum-length-of-subarray-with-positive-product)
