---
title: "How to Solve Count Subarrays With Score Less Than K — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Subarrays With Score Less Than K. Hard difficulty, 62.3% acceptance rate. Topics: Array, Binary Search, Sliding Window, Prefix Sum."
date: "2026-10-06"
category: "dsa-patterns"
tags: ["count-subarrays-with-score-less-than-k", "array", "binary-search", "sliding-window", "hard"]
---

# How to Solve Count Subarrays With Score Less Than K

This problem asks us to count all non-empty subarrays of a given array `nums` where the **score**—defined as `(sum of subarray) * (length of subarray)`—is strictly less than a given integer `k`. While the definition is straightforward, the challenge lies in counting all possible subarrays efficiently. A brute-force check of all O(n²) subarrays would be too slow for constraints where `n` can be up to 10⁵. The interesting twist is that the score combines both sum and length multiplicatively, which prevents direct application of standard sliding window techniques without careful adjustment.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider `nums = [2, 1, 4, 3, 2]` with `k = 10`.

We need to count subarrays where `(sum) * (length) < 10`. Let's examine some subarrays starting from index 0:

- `[2]`: score = 2 × 1 = 2 < 10 ✓
- `[2, 1]`: score = 3 × 2 = 6 < 10 ✓
- `[2, 1, 4]`: score = 7 × 3 = 21 ≥ 10 ✗

Notice that once a subarray becomes too large (score ≥ k), adding more elements will only increase both sum and length, making the score even larger. This suggests a sliding window approach: for each starting index `left`, we can find the largest `right` such that the window `[left, right]` has score < k. Then all subarrays starting at `left` with endings from `left` to `right` are valid.

Let's apply this systematically:

**Left = 0:**

- Expand right: [2] (score=2), [2,1] (score=6), [2,1,4] (score=21 ≥ 10)
- Stop at right=1. Valid subarrays starting at 0: [2] and [2,1] → 2 subarrays

**Left = 1:**

- Start with [1] (score=1), [1,4] (score=10 ≥ 10)
- Stop at right=1. Valid: [1] → 1 subarray

**Left = 2:**

- [4] (score=4), [4,3] (score=14 ≥ 10)
- Valid: [4] → 1 subarray

**Left = 3:**

- [3] (score=3), [3,2] (score=10 ≥ 10)
- Valid: [3] → 1 subarray

**Left = 4:**

- [2] (score=4) → 1 subarray

Total = 2 + 1 + 1 + 1 + 1 = 6 valid subarrays.

The key insight: for each `left`, we need the maximum `right` where `(prefixSum[right+1] - prefixSum[left]) * (right - left + 1) < k`. This is where the optimization challenge lies.

## Brute Force Approach

The most straightforward solution is to check every possible subarray:

1. Generate all O(n²) subarrays (for each starting index `i`, for each ending index `j ≥ i`)
2. Compute the sum (could be done with prefix sums to avoid O(n) sum calculation)
3. Calculate score = sum × length
4. Count if score < k

Even with prefix sums (O(n) precomputation, O(1) sum queries), we still have O(n²) subarrays to check. For n = 10⁵, this is ~10¹⁰ operations—far too slow.

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) - Too slow for n up to 10⁵
def countSubarrays_brute(nums, k):
    n = len(nums)
    count = 0

    for i in range(n):
        current_sum = 0
        length = 0

        for j in range(i, n):
            current_sum += nums[j]
            length += 1
            score = current_sum * length

            if score < k:
                count += 1
            else:
                # Once score >= k, further extensions will only increase score
                # (since both sum and length increase for positive numbers)
                break

    return count
```

```javascript
// Time: O(n²) | Space: O(1) - Too slow for n up to 10⁵
function countSubarraysBrute(nums, k) {
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    let currentSum = 0;
    let length = 0;

    for (let j = i; j < n; j++) {
      currentSum += nums[j];
      length++;
      const score = currentSum * length;

      if (score < k) {
        count++;
      } else {
        // Once score >= k, further extensions will only increase score
        break;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1) - Too slow for n up to 10⁵
public long countSubarraysBrute(int[] nums, long k) {
    int n = nums.length;
    long count = 0;

    for (int i = 0; i < n; i++) {
        long currentSum = 0;
        int length = 0;

        for (int j = i; j < n; j++) {
            currentSum += nums[j];
            length++;
            long score = currentSum * length;

            if (score < k) {
                count++;
            } else {
                // Once score >= k, further extensions will only increase score
                break;
            }
        }
    }

    return count;
}
```

</div>

The brute force has two main inefficiencies:

1. O(n²) time complexity
2. Recomputing sums from scratch for each starting point

We need to reduce this to O(n) or O(n log n).

## Optimized Approach

The key insight comes from rewriting the score condition. For a subarray from index `left` to `right`:

```
score = sum[left:right] × (right - left + 1) < k
```

If we use prefix sums where `prefix[i]` = sum of first `i` elements (with `prefix[0] = 0`), then:

```
sum[left:right] = prefix[right+1] - prefix[left]
```

So our condition becomes:

```
(prefix[right+1] - prefix[left]) × (right - left + 1) < k
```

Now, for a fixed `left`, as `right` increases:

- `prefix[right+1]` increases (since nums has positive integers)
- `(right - left + 1)` increases
- Both factors increase, so the product increases monotonically

This monotonicity is crucial—it means for each `left`, there's a maximum `right` where the condition holds, and all subarrays from `left` to any index ≤ that `right` are valid.

We can use a **sliding window** approach:

1. Maintain `left` and `right` pointers defining the current window
2. Maintain the current sum of the window
3. While the window's score ≥ k, shrink from the left
4. For each `left`, all subarrays ending at `right` are valid

Wait—there's a subtlety. When we find a valid window `[left, right]`, how many subarrays does it give us? Not just 1, but `(right - left + 1)` subarrays: all subarrays ending at `right` that start at `left` or later.

Actually, the standard approach is different: for each `right`, find how many `left` values give a valid subarray ending at `right`. This is easier because when we expand `right`, we can maintain the smallest `left` such that the window `[left, right]` is valid.

The algorithm:

1. Initialize `left = 0`, `current_sum = 0`, `count = 0`
2. For each `right` from 0 to n-1:
   - Add `nums[right]` to `current_sum`
   - While `current_sum × (right - left + 1) ≥ k`:
     - Subtract `nums[left]` from `current_sum`
     - Increment `left` (shrink window from left)
   - Now window `[left, right]` has score < k
   - All subarrays ending at `right` with start ≥ `left` are valid
   - Add `(right - left + 1)` to count

This works because:

- When we shrink the window until score < k, we find the smallest `left` for this `right`
- Any subarray ending at `right` with start < `left` would have score ≥ k
- Any subarray ending at `right` with start ≥ `left` has score < k (since removing elements reduces both sum and length)

## Optimal Solution

Here's the complete implementation using the sliding window approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countSubarrays(nums, k):
    """
    Count subarrays where (sum * length) < k using sliding window.

    For each right pointer, we find the smallest left such that
    the window [left, right] has score < k. Then all subarrays
    ending at right with start in [left, right] are valid.
    """
    n = len(nums)
    count = 0          # Total valid subarrays
    current_sum = 0    # Sum of current window [left, right]
    left = 0           # Left pointer of sliding window

    # Expand window by moving right pointer
    for right in range(n):
        # Add current element to window sum
        current_sum += nums[right]

        # Shrink window from left while score is too large
        # We need to maintain: current_sum * window_length < k
        while left <= right and current_sum * (right - left + 1) >= k:
            # Remove leftmost element from window
            current_sum -= nums[left]
            left += 1

        # Now window [left, right] has score < k
        # All subarrays ending at 'right' with start in [left, right] are valid
        # That's exactly (right - left + 1) subarrays
        count += (right - left + 1)

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function countSubarrays(nums, k) {
  /**
   * Count subarrays where (sum * length) < k using sliding window.
   *
   * For each right pointer, we find the smallest left such that
   * the window [left, right] has score < k. Then all subarrays
   * ending at right with start in [left, right] are valid.
   */
  const n = nums.length;
  let count = 0; // Total valid subarrays
  let currentSum = 0; // Sum of current window [left, right]
  let left = 0; // Left pointer of sliding window

  // Expand window by moving right pointer
  for (let right = 0; right < n; right++) {
    // Add current element to window sum
    currentSum += nums[right];

    // Shrink window from left while score is too large
    // We need to maintain: currentSum * windowLength < k
    while (left <= right && currentSum * (right - left + 1) >= k) {
      // Remove leftmost element from window
      currentSum -= nums[left];
      left++;
    }

    // Now window [left, right] has score < k
    // All subarrays ending at 'right' with start in [left, right] are valid
    // That's exactly (right - left + 1) subarrays
    count += right - left + 1;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public long countSubarrays(int[] nums, long k) {
    /**
     * Count subarrays where (sum * length) < k using sliding window.
     *
     * For each right pointer, we find the smallest left such that
     * the window [left, right] has score < k. Then all subarrays
     * ending at right with start in [left, right] are valid.
     */
    int n = nums.length;
    long count = 0;          // Total valid subarrays
    long currentSum = 0;     // Sum of current window [left, right]
    int left = 0;            // Left pointer of sliding window

    // Expand window by moving right pointer
    for (int right = 0; right < n; right++) {
        // Add current element to window sum
        currentSum += nums[right];

        // Shrink window from left while score is too large
        // We need to maintain: currentSum * windowLength < k
        while (left <= right && currentSum * (right - left + 1) >= k) {
            // Remove leftmost element from window
            currentSum -= nums[left];
            left++;
        }

        // Now window [left, right] has score < k
        // All subarrays ending at 'right' with start in [left, right] are valid
        // That's exactly (right - left + 1) subarrays
        count += (right - left + 1);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- The `right` pointer goes from 0 to n-1: O(n) iterations
- The `left` pointer only moves forward and never backs up
- Each element is added to the window once and removed at most once
- Total operations: O(2n) = O(n)

**Space Complexity: O(1)**

- We only use a few variables (`count`, `current_sum`, `left`, `right`)
- No additional data structures proportional to input size

The linear time complexity is optimal since we must at least examine each element once.

## Common Mistakes

1. **Using integer overflow**: The product `sum × length` can easily exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C, BigInt in JavaScript for very large values).
2. **Incorrect counting logic**: Some candidates try to count as `count++` for each valid window, but that only counts one subarray per window. Remember: for window `[left, right]`, there are `(right - left + 1)` valid subarrays ending at `right`.

3. **Wrong while loop condition**: The condition should be `while current_sum × length >= k`, not `> k`. We need to shrink until the score is **strictly less than** k. Also, don't forget to check `left <= right` to avoid infinite loops when window becomes empty.

4. **Assuming nums can contain zeros or negatives**: The problem states "positive integer array", so all elements are ≥ 1. This guarantees monotonicity—when we extend the window, score always increases. If zeros were allowed, the score might stay the same when adding a zero, complicating the logic.

## When You'll See This Pattern

This sliding window pattern appears in problems where you need to count subarrays satisfying some condition involving the product or sum of the subarray:

1. **Subarray Product Less Than K (LeetCode 713)** - Very similar: count subarrays where product < k. Uses the same sliding window approach with multiplication instead of `sum × length`.

2. **Binary Subarrays With Sum (LeetCode 930)** - Count subarrays with sum equal to goal. Can be solved with sliding window or prefix sum + hashmap.

3. **Maximum Subarray (LeetCode 53)** - Find subarray with maximum sum. Uses Kadane's algorithm, a simpler form of sliding window.

The key signature is: "count subarrays where some function of the subarray satisfies a condition" and the function increases monotonically as you extend the subarray (for positive elements).

## Key Takeaways

1. **Monotonicity enables sliding window**: When adding elements to a subarray always increases (or decreases) the value you're checking, you can use a sliding window with O(n) time instead of checking all O(n²) subarrays.

2. **Count subarrays ending at each position**: For sliding window problems, it's often easier to think "for each ending position `right`, how many starting positions `left` give a valid subarray?" rather than the reverse.

3. **Watch for overflow in products**: When dealing with products or `sum × length`, the values can grow quickly. Use appropriate data types (64-bit integers) to avoid overflow.

Related problems: [Maximum Subarray](/problem/maximum-subarray), [Subarray Product Less Than K](/problem/subarray-product-less-than-k), [Binary Subarrays With Sum](/problem/binary-subarrays-with-sum)
