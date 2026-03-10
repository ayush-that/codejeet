---
title: "How to Solve Rotate Function — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Rotate Function. Medium difficulty, 45.4% acceptance rate. Topics: Array, Math, Dynamic Programming."
date: "2027-04-04"
category: "dsa-patterns"
tags: ["rotate-function", "array", "math", "dynamic-programming", "medium"]
---

# How to Solve Rotate Function

You're given an array `nums` and need to find the maximum value of a rotation function `F(k)` where `F(k)` is the weighted sum of elements after rotating the array by `k` positions. The challenge is that directly computing all rotations would be O(n²), but there's a clever mathematical relationship between consecutive rotations that lets us solve this in O(n) time.

## Visual Walkthrough

Let's trace through `nums = [4, 3, 2, 6]` step by step:

**Rotation 0 (k=0):** `[4, 3, 2, 6]`

- F(0) = 0×4 + 1×3 + 2×2 + 3×6 = 0 + 3 + 4 + 18 = 25

**Rotation 1 (k=1):** `[3, 2, 6, 4]`

- F(1) = 0×3 + 1×2 + 2×6 + 3×4 = 0 + 2 + 12 + 12 = 26

**Rotation 2 (k=2):** `[2, 6, 4, 3]`

- F(2) = 0×2 + 1×6 + 2×4 + 3×3 = 0 + 6 + 8 + 9 = 23

**Rotation 3 (k=3):** `[6, 4, 3, 2]`

- F(3) = 0×6 + 1×4 + 2×3 + 3×2 = 0 + 4 + 6 + 6 = 16

Maximum is 26 at k=1.

Now let's look for a pattern. Notice that when we rotate from k=0 to k=1:

- The element `4` moves from position 0 to position 3 (last position)
- Every other element moves one position left (decreasing its coefficient by 1)

We can express F(1) in terms of F(0):

- F(1) = F(0) + (sum of all elements) - n×(element that moved to last position)
- F(1) = 25 + (4+3+2+6) - 4×4 = 25 + 15 - 16 = 26

This recurrence relation is the key insight!

## Brute Force Approach

The most straightforward solution is to compute every possible rotation and calculate F(k) for each:

1. For each rotation k from 0 to n-1:
   - Create the rotated array (or simulate rotation with modulo indexing)
   - Calculate the weighted sum F(k)
   - Track the maximum value

This approach has O(n²) time complexity because for each of n rotations, we need to compute a sum involving all n elements. For large arrays (n up to 10⁵ in LeetCode constraints), this is far too slow.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maxRotateFunction(nums):
    n = len(nums)
    max_val = float('-inf')

    # Try every possible rotation
    for k in range(n):
        current_sum = 0
        # Calculate F(k) for this rotation
        for i in range(n):
            # The element at index i in rotated array is at index (i+k) % n in original
            current_sum += i * nums[(i + k) % n]
        max_val = max(max_val, current_sum)

    return max_val
```

```javascript
// Time: O(n²) | Space: O(1)
function maxRotateFunction(nums) {
  const n = nums.length;
  let maxVal = -Infinity;

  // Try every possible rotation
  for (let k = 0; k < n; k++) {
    let currentSum = 0;
    // Calculate F(k) for this rotation
    for (let i = 0; i < n; i++) {
      // The element at index i in rotated array is at index (i+k) % n in original
      currentSum += i * nums[(i + k) % n];
    }
    maxVal = Math.max(maxVal, currentSum);
  }

  return maxVal;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maxRotateFunction(int[] nums) {
    int n = nums.length;
    int maxVal = Integer.MIN_VALUE;

    // Try every possible rotation
    for (int k = 0; k < n; k++) {
        int currentSum = 0;
        // Calculate F(k) for this rotation
        for (int i = 0; i < n; i++) {
            // The element at index i in rotated array is at index (i+k) % n in original
            currentSum += i * nums[(i + k) % n];
        }
        maxVal = Math.max(maxVal, currentSum);
    }

    return maxVal;
}
```

</div>

## Optimized Approach

The key insight is that consecutive rotations have a mathematical relationship. Let's derive it:

Let:

- `n` = length of array
- `sum` = sum of all elements in nums
- `F(k)` = value of rotation function after k rotations

When we rotate from k to k+1:

1. Every element except one moves one position left (its coefficient decreases by 1)
2. The last element in the rotated array (which was at index n-1 in rotation k) moves to position 0 in rotation k+1

Mathematically:

```
F(k+1) = F(k) + sum - n × nums[n-1-k]
```

Why?

- `F(k) + sum`: Adding sum accounts for each element's coefficient increasing by 1 (except the one that moved to front)
- `- n × nums[n-1-k]`: Subtract n times the element that moved to front because it went from coefficient (n-1) to coefficient 0

We can compute:

1. `F(0)` directly
2. `sum` of all elements
3. Then compute F(1), F(2), ..., F(n-1) using the recurrence relation in O(1) each

This reduces the time complexity from O(n²) to O(n).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxRotateFunction(nums):
    n = len(nums)

    # Step 1: Calculate F(0) and sum of all elements
    f0 = 0
    total_sum = 0

    for i in range(n):
        f0 += i * nums[i]  # F(0) = 0*nums[0] + 1*nums[1] + ... + (n-1)*nums[n-1]
        total_sum += nums[i]

    # Step 2: Initialize max value with F(0)
    max_val = f0
    current_f = f0

    # Step 3: Compute F(1) through F(n-1) using recurrence relation
    # F(k+1) = F(k) + total_sum - n * nums[n-1-k]
    for k in range(n - 1):
        # The element that was at the end of rotation k is nums[n-1-k] in original array
        # It moves from position n-1 (coefficient n-1) to position 0 (coefficient 0)
        current_f = current_f + total_sum - n * nums[n - 1 - k]
        max_val = max(max_val, current_f)

    return max_val
```

```javascript
// Time: O(n) | Space: O(1)
function maxRotateFunction(nums) {
  const n = nums.length;

  // Step 1: Calculate F(0) and sum of all elements
  let f0 = 0;
  let totalSum = 0;

  for (let i = 0; i < n; i++) {
    f0 += i * nums[i]; // F(0) = 0*nums[0] + 1*nums[1] + ... + (n-1)*nums[n-1]
    totalSum += nums[i];
  }

  // Step 2: Initialize max value with F(0)
  let maxVal = f0;
  let currentF = f0;

  // Step 3: Compute F(1) through F(n-1) using recurrence relation
  // F(k+1) = F(k) + totalSum - n * nums[n-1-k]
  for (let k = 0; k < n - 1; k++) {
    // The element that was at the end of rotation k is nums[n-1-k] in original array
    // It moves from position n-1 (coefficient n-1) to position 0 (coefficient 0)
    currentF = currentF + totalSum - n * nums[n - 1 - k];
    maxVal = Math.max(maxVal, currentF);
  }

  return maxVal;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxRotateFunction(int[] nums) {
    int n = nums.length;

    // Step 1: Calculate F(0) and sum of all elements
    int f0 = 0;
    int totalSum = 0;

    for (int i = 0; i < n; i++) {
        f0 += i * nums[i];  // F(0) = 0*nums[0] + 1*nums[1] + ... + (n-1)*nums[n-1]
        totalSum += nums[i];
    }

    // Step 2: Initialize max value with F(0)
    int maxVal = f0;
    int currentF = f0;

    // Step 3: Compute F(1) through F(n-1) using recurrence relation
    // F(k+1) = F(k) + totalSum - n * nums[n-1-k]
    for (int k = 0; k < n - 1; k++) {
        // The element that was at the end of rotation k is nums[n-1-k] in original array
        // It moves from position n-1 (coefficient n-1) to position 0 (coefficient 0)
        currentF = currentF + totalSum - n * nums[n - 1 - k];
        maxVal = Math.max(maxVal, currentF);
    }

    return maxVal;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes through the array:
  1. First pass to compute F(0) and total sum: O(n)
  2. Second pass to compute all other F(k) values: O(n)
- Each F(k) computation after F(0) takes O(1) time using the recurrence relation

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables:
  - `f0`, `total_sum`, `max_val`, `current_f`
  - Loop counters and indices
- No additional data structures proportional to input size

## Common Mistakes

1. **Off-by-one errors in the recurrence relation**: The trickiest part is correctly identifying which element moves to the front. For rotation k, the element at the end is `nums[n-1-k]` in the original array (not `nums[k]`). Always test with a small example to verify.

2. **Forgetting to handle n=0 or n=1**: While the problem guarantees n ≥ 1, it's good practice to consider edge cases. For n=1, F(0) = 0 and there are no other rotations to check.

3. **Integer overflow with large values**: The problem constraints allow large numbers that could overflow 32-bit integers. Use 64-bit integers (long in Java, no issue in Python). In the recurrence `current_f + total_sum - n * nums[n-1-k]`, each term can be large.

4. **Incorrectly computing F(0)**: Some candidates mistakenly compute F(0) as just the sum of elements. Remember F(0) is a weighted sum: `0*nums[0] + 1*nums[1] + ... + (n-1)*nums[n-1]`.

## When You'll See This Pattern

This problem teaches the **prefix sum with rotation** pattern, where we find a mathematical relationship between consecutive states to avoid recomputation.

Related problems:

1. **Rotate Array (LeetCode 189)** - While simpler, it introduces the concept of array rotation which is fundamental here.
2. **Maximum Subarray (LeetCode 53)** - Uses a similar "carry forward" optimization where we compute maximum sum ending at each position in O(1) from the previous position.
3. **Product of Array Except Self (LeetCode 238)** - Uses prefix and suffix products, similar to how we use the total sum here to compute subsequent values efficiently.
4. **Best Time to Buy and Sell Stock (LeetCode 121)** - Another problem where finding relationships between consecutive states leads to O(n) solution instead of O(n²).

## Key Takeaways

1. **Look for mathematical relationships between consecutive states**: When a problem involves computing something for all rotations/shifts/permutations, there's often a recurrence relation that lets you compute the next state from the previous one in O(1) time.

2. **Derive formulas with small examples**: Use concrete examples (like [4,3,2,6]) to discover patterns. Write out F(0), F(1), F(2) and look for how they relate.

3. **The "sum trick" is powerful**: Many array rotation problems can be optimized by maintaining the total sum and adjusting for the element that changes position dramatically.

[Practice this problem on CodeJeet](/problem/rotate-function)
