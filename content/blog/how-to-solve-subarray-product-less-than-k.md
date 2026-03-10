---
title: "How to Solve Subarray Product Less Than K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Subarray Product Less Than K. Medium difficulty, 53.9% acceptance rate. Topics: Array, Binary Search, Sliding Window, Prefix Sum."
date: "2027-03-11"
category: "dsa-patterns"
tags: ["subarray-product-less-than-k", "array", "binary-search", "sliding-window", "medium"]
---

# How to Solve Subarray Product Less Than K

This problem asks us to count all contiguous subarrays where the product of all elements is strictly less than a given threshold `k`. What makes this problem interesting is that while we can't use a hashmap like we do for subarray sums (since products grow exponentially), we can adapt the sliding window technique to efficiently handle the multiplicative constraint.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [10, 5, 2, 6]` with `k = 100`.

We'll use a sliding window approach where we maintain a window `[left, right]` whose product is less than `k`. For each new element at `right`, we expand the window to include it, then shrink from the left if the product becomes too large.

**Step-by-step:**

- Start: left = 0, right = 0, product = 1, count = 0
- right = 0: product = 10 (< 100). All subarrays ending at 0: [10] → count += 1
- right = 1: product = 10 × 5 = 50 (< 100). Subarrays ending at 1: [5], [10,5] → count += 2
- right = 2: product = 50 × 2 = 100 (≥ 100). Need to shrink:
  - Remove nums[0]=10: product = 100/10 = 10 (< 100), left = 1
  - Subarrays ending at 2: [2], [5,2] → count += 2
- right = 3: product = 10 × 6 = 60 (< 100). Subarrays ending at 3: [6], [2,6], [5,2,6] → count += 3

Total count = 1 + 2 + 2 + 3 = 8

The key insight: For a window `[left, right]` with product < k, the number of new subarrays ending at `right` is `(right - left + 1)`. This counts all subarrays that end at `right`: the single element, the last two elements, the last three, and so on up to the entire window.

## Brute Force Approach

The most straightforward solution is to check every possible subarray. For each starting index `i`, we iterate through all ending indices `j ≥ i`, compute the product, and increment count if product < k.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def numSubarrayProductLessThanK(nums, k):
    count = 0
    n = len(nums)

    for i in range(n):
        product = 1
        for j in range(i, n):
            product *= nums[j]
            if product < k:
                count += 1
            else:
                # Once product >= k, all longer subarrays starting at i will also have product >= k
                break

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function numSubarrayProductLessThanK(nums, k) {
  let count = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    let product = 1;
    for (let j = i; j < n; j++) {
      product *= nums[j];
      if (product < k) {
        count++;
      } else {
        // Once product >= k, all longer subarrays starting at i will also have product >= k
        break;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int numSubarrayProductLessThanK(int[] nums, int k) {
    int count = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        int product = 1;
        for (int j = i; j < n; j++) {
            product *= nums[j];
            if (product < k) {
                count++;
            } else {
                // Once product >= k, all longer subarrays starting at i will also have product >= k
                break;
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient:** With `n` up to 3×10⁴, O(n²) is too slow (could be ~900 million operations). We need a linear solution.

## Optimized Approach

The key insight is that we can use a **sliding window** approach. Since all numbers are positive (the problem guarantees `1 <= nums[i] <= 1000`), when we expand the window to the right, the product increases, and when we shrink from the left, the product decreases.

**Step-by-step reasoning:**

1. Maintain two pointers `left` and `right` representing the current window.
2. Expand the window by moving `right` one step at a time.
3. Multiply the product by `nums[right]`.
4. If product becomes ≥ k, shrink the window from the left by dividing by `nums[left]` and incrementing `left`.
5. For each valid window `[left, right]`, the number of new subarrays ending at `right` is `(right - left + 1)`.

**Why `(right - left + 1)` works:** Consider window [10, 5, 2] with product 100. If we add 6 to get [10, 5, 2, 6] with product 600 (≥ 100), we need to shrink. After shrinking to [5, 2, 6] with product 60 (< 100), the subarrays ending at 6 are: [6], [2,6], [5,2,6]. That's exactly 3 subarrays, which equals `right - left + 1 = 3 - 1 + 1 = 3`.

## Optimal Solution

Here's the sliding window implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numSubarrayProductLessThanK(nums, k):
    # Edge case: if k <= 1, no subarray can have product < k since nums[i] >= 1
    if k <= 1:
        return 0

    count = 0          # Total count of valid subarrays
    product = 1        # Current product of elements in window
    left = 0           # Left pointer of sliding window

    # Expand window by moving right pointer
    for right in range(len(nums)):
        # Include current element in product
        product *= nums[right]

        # Shrink window from left while product is too large
        while product >= k:
            product //= nums[left]  # Remove leftmost element
            left += 1               # Move left pointer right

        # Count all subarrays ending at 'right'
        # For window [left, right], there are (right - left + 1) such subarrays
        count += (right - left + 1)

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function numSubarrayProductLessThanK(nums, k) {
  // Edge case: if k <= 1, no subarray can have product < k since nums[i] >= 1
  if (k <= 1) {
    return 0;
  }

  let count = 0; // Total count of valid subarrays
  let product = 1; // Current product of elements in window
  let left = 0; // Left pointer of sliding window

  // Expand window by moving right pointer
  for (let right = 0; right < nums.length; right++) {
    // Include current element in product
    product *= nums[right];

    // Shrink window from left while product is too large
    while (product >= k) {
      product /= nums[left]; // Remove leftmost element
      left++; // Move left pointer right
    }

    // Count all subarrays ending at 'right'
    // For window [left, right], there are (right - left + 1) such subarrays
    count += right - left + 1;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public int numSubarrayProductLessThanK(int[] nums, int k) {
    // Edge case: if k <= 1, no subarray can have product < k since nums[i] >= 1
    if (k <= 1) {
        return 0;
    }

    int count = 0;      // Total count of valid subarrays
    int product = 1;    // Current product of elements in window
    int left = 0;       // Left pointer of sliding window

    // Expand window by moving right pointer
    for (int right = 0; right < nums.length; right++) {
        // Include current element in product
        product *= nums[right];

        // Shrink window from left while product is too large
        while (product >= k) {
            product /= nums[left];  // Remove leftmost element
            left++;                 // Move left pointer right
        }

        // Count all subarrays ending at 'right'
        // For window [left, right], there are (right - left + 1) such subarrays
        count += (right - left + 1);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Each element is added to the window exactly once (when `right` pointer passes it)
- Each element is removed from the window at most once (when `left` pointer passes it)
- The `while` loop doesn't make it O(n²) because `left` only moves forward and never backward

**Space Complexity: O(1)**

- We only use a few integer variables regardless of input size
- No additional data structures are needed

## Common Mistakes

1. **Forgetting the k ≤ 1 edge case**: When k ≤ 1, no subarray can have product < k since all nums[i] ≥ 1. The code would enter an infinite loop trying to shrink the window when product = 1 ≥ k.

2. **Incorrect counting formula**: Some candidates try to count subarrays differently, like incrementing by 1 each time. Remember: for window [left, right], all subarrays ending at `right` are valid, and there are exactly `(right - left + 1)` of them.

3. **Using integer overflow**: With large arrays, the product could overflow 32-bit integers. In Python this isn't an issue, but in Java/JavaScript, you might need to use `long` or check for overflow. However, since we shrink when product ≥ k, and k ≤ 10⁶, overflow is unlikely with the given constraints.

4. **Not handling empty input**: While the problem guarantees nums.length ≥ 1, it's good practice to check. Our solution handles it correctly since the loop won't execute for empty arrays.

## When You'll See This Pattern

The sliding window technique with two pointers is common for problems involving contiguous subarrays with some constraint:

1. **Minimum Size Subarray Sum (LeetCode 209)**: Find minimal length of subarray with sum ≥ target. Similar shrinking window approach.

2. **Longest Substring Without Repeating Characters (LeetCode 3)**: Maintain window with unique characters, shrink when duplicates appear.

3. **Fruit Into Baskets (LeetCode 904)**: Maintain window with at most 2 types of fruits.

The key pattern: When you need to find **contiguous** subarrays/substrings satisfying some condition, and the condition is **monotonic** (adding elements makes it "worse", removing makes it "better"), sliding window is often the solution.

## Key Takeaways

1. **Sliding window works for monotonic constraints**: When adding elements to a window always increases some value (like sum or product) and removing decreases it, sliding window with two pointers gives O(n) solution.

2. **Count subarrays ending at each position**: Instead of counting all subarrays directly, count how many end at each position `right`. This avoids double-counting and works naturally with sliding window.

3. **Handle edge cases early**: Always check for k ≤ 1 in this problem. More generally, identify inputs where the algorithm might fail or behave unexpectedly.

Related problems: [Maximum Product Subarray](/problem/maximum-product-subarray), [Maximum Size Subarray Sum Equals k](/problem/maximum-size-subarray-sum-equals-k), [Subarray Sum Equals K](/problem/subarray-sum-equals-k)
