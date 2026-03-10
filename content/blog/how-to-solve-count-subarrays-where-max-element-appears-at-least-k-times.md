---
title: "How to Solve Count Subarrays Where Max Element Appears at Least K Times — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Subarrays Where Max Element Appears at Least K Times. Medium difficulty, 62.4% acceptance rate. Topics: Array, Sliding Window."
date: "2028-04-20"
category: "dsa-patterns"
tags:
  [
    "count-subarrays-where-max-element-appears-at-least-k-times",
    "array",
    "sliding-window",
    "medium",
  ]
---

# How to Solve Count Subarrays Where Max Element Appears at Least K Times

You need to count all contiguous subarrays where the maximum element appears at least `k` times. The tricky part is that the maximum element isn't fixed—it's the maximum within each subarray, which can change depending on which subarray you're examining. This creates a challenge because you can't just look for a specific value; you need to dynamically track the maximum as you consider different subarrays.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 3, 2, 3, 3]`, `k = 2`

We need to count subarrays where the maximum element appears at least 2 times. Let's think about what makes a valid subarray:

1. **Subarray [1, 3]**: Maximum = 3, appears 1 time → ❌ Invalid
2. **Subarray [3, 2, 3]**: Maximum = 3, appears 2 times → ✅ Valid
3. **Subarray [2, 3, 3]**: Maximum = 3, appears 2 times → ✅ Valid
4. **Subarray [3, 3]**: Maximum = 3, appears 2 times → ✅ Valid

But checking every subarray individually would be O(n²), which is too slow for large arrays. The key insight is that for a subarray to be valid, it must contain at least `k` occurrences of the global maximum value? Wait, no—that's a common mistake! The maximum is determined _within_ each subarray, not globally.

Actually, let's find the global maximum first: it's 3. Any subarray that doesn't contain 3 can't have 3 as its maximum, so those subarrays are automatically invalid. But what if a subarray contains only 1s and 2s? Its maximum would be 2, and we'd need at least k occurrences of 2. So we need to consider all possible maximum values!

This reveals the real challenge: we need to count subarrays where the most frequent element (which must be the maximum) appears at least k times. But there's a better approach: for each possible maximum value, we can find all subarrays where that value is the maximum and appears at least k times.

Actually, here's the breakthrough realization: **If we fix the maximum value, we can transform the problem**. For a given maximum value `m`, we mark all positions where `nums[i] = m` and all positions where `nums[i] > m` (which would break the subarray since `m` wouldn't be the maximum anymore).

Let's try with `m = 3` in our example:

- Positions with value 3: indices 1, 3, 4
- Positions with value > 3: none
- We need subarrays containing at least 2 of these positions and no values > 3

This is getting complex. There's actually a simpler approach using the sliding window technique!

## Brute Force Approach

The brute force solution checks every possible subarray:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Find the maximum in nums[i..j]
4. Count how many times that maximum appears
5. If count ≥ k, increment result

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def countSubarrays_brute(nums, k):
    n = len(nums)
    count = 0

    for i in range(n):
        for j in range(i, n):
            # Find maximum in subarray nums[i..j]
            max_val = max(nums[i:j+1])

            # Count occurrences of max_val
            freq = 0
            for idx in range(i, j+1):
                if nums[idx] == max_val:
                    freq += 1

            if freq >= k:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function countSubarraysBrute(nums, k) {
  let count = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Find maximum in subarray nums[i..j]
      let maxVal = -Infinity;
      for (let idx = i; idx <= j; idx++) {
        if (nums[idx] > maxVal) {
          maxVal = nums[idx];
        }
      }

      // Count occurrences of maxVal
      let freq = 0;
      for (let idx = i; idx <= j; idx++) {
        if (nums[idx] === maxVal) {
          freq++;
        }
      }

      if (freq >= k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int countSubarraysBrute(int[] nums, int k) {
    int count = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Find maximum in subarray nums[i..j]
            int maxVal = Integer.MIN_VALUE;
            for (int idx = i; idx <= j; idx++) {
                if (nums[idx] > maxVal) {
                    maxVal = nums[idx];
                }
            }

            // Count occurrences of maxVal
            int freq = 0;
            for (int idx = i; idx <= j; idx++) {
                if (nums[idx] == maxVal) {
                    freq++;
                }
            }

            if (freq >= k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is too slow**: With O(n³) time complexity, this fails for arrays larger than a few hundred elements. We need to optimize.

## Optimized Approach

The key insight is that we don't need to check every subarray individually. Instead, we can use a **sliding window** approach with a clever observation:

1. First, find the **global maximum** of the entire array. Let's call it `max_val`.
2. Any valid subarray must have `max_val` as its maximum element (since it's the largest value in the entire array).
3. Therefore, we only need to count subarrays that:
   - Contain at least `k` occurrences of `max_val`
   - Don't contain any element greater than `max_val` (which is impossible since it's the global maximum)

Wait, that's not quite right either. What if the array has multiple elements with the same maximum value? Then `max_val` is indeed the global maximum, and any subarray containing a value greater than `max_val` doesn't exist. So our condition simplifies to: count subarrays containing at least `k` occurrences of the global maximum.

But here's the catch: a subarray might have a maximum that's NOT the global maximum. For example, in `[1, 2, 1]` with `k=2`, the global maximum is 2, but subarray `[1, 1]` has maximum 1, which appears twice. So it should be counted if k=2!

Actually, let me reconsider. The problem says "the maximum element of nums appears at least k times." This is ambiguous! It means: for each subarray, find its maximum element, then check if that maximum element appears at least k times in THAT subarray.

So we need to consider ALL possible maximum values, not just the global maximum. But here's the optimization: we can process each distinct value as a potential maximum. For each value `v`:

1. Mark positions where nums[i] = v (these contribute to the count)
2. Mark positions where nums[i] > v (these break the subarray since v wouldn't be maximum)
3. Use sliding window to count subarrays with at least k occurrences of v and no values > v

But this is still O(n²) if we check all values. There's an even better O(n) approach!

**The O(n) sliding window insight**:

1. The maximum element in a subarray is simply the largest value in that subarray
2. If we fix the right endpoint `j`, we want to count how many left endpoints `i` create valid subarrays
3. For a subarray ending at `j` to be valid, it must contain at least `k` occurrences of its maximum
4. As we expand the window to the right, we track the frequency of each element
5. We maintain a variable tracking how many times the current maximum appears
6. When the current maximum appears at least `k` times, ALL subarrays starting from `i=0` to the current left pointer are valid!

Actually, let me think through this more carefully with an example...

## Optimal Solution

The optimal solution uses a **sliding window** approach with this key insight: For each position `j` as the right endpoint, we find the smallest `i` such that the subarray `nums[i..j]` has its maximum appearing at least `k` times. Then ALL subarrays starting from `0` to `i` and ending at `j` are valid!

Here's the step-by-step reasoning:

1. Find the global maximum value `max_val` (since only subarrays containing `max_val` can have it as their maximum)
2. Use a sliding window to count subarrays where `max_val` appears at least `k` times
3. For each right pointer `j`, expand the window
4. Count how many times `max_val` appears in the current window
5. When count reaches `k`, we know that:
   - The current window `[left..j]` is valid
   - Any window `[i..j]` where `i ≤ left` is also valid (since it contains at least the same `k` occurrences)
6. So we add `(left + 1)` to the answer (all possible starting positions from 0 to left)
7. Move left pointer to shrink window when needed

But wait, this only counts subarrays where the global maximum is the maximum. What about subarrays with other maximums? Actually, if a subarray doesn't contain the global maximum, then its maximum must be less than the global maximum. But then we could have multiple subarrays with different maximums...

I realize now: the problem is simpler than I thought! Let me re-read: "where the maximum element of nums appears at least k times." This means we're looking for subarrays where the GLOBAL maximum (of the entire array) appears at least k times. Not the maximum of the subarray!

Yes, that's correct! The phrasing "the maximum element of nums" means the maximum element of the entire input array. So we only need to count subarrays containing at least k occurrences of the global maximum.

This simplifies the problem dramatically! Here's the O(n) solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countSubarrays(nums, k):
    # Step 1: Find the global maximum element
    max_val = max(nums)
    n = len(nums)
    count = 0

    # Step 2: Sliding window to count subarrays with at least k occurrences of max_val
    left = 0
    max_count = 0

    for right in range(n):
        # Step 3: Expand window by including nums[right]
        if nums[right] == max_val:
            max_count += 1

        # Step 4: When we have at least k occurrences of max_val,
        # ALL subarrays starting from 0..left and ending at right are valid
        while max_count >= k:
            # Current window [left..right] has at least k max_val
            # So all subarrays starting from any i <= left and ending at right are valid
            # That's (left + 1) subarrays (starting at 0, 1, ..., left)
            count += (left + 1)

            # Try to shrink window from left
            if nums[left] == max_val:
                max_count -= 1
            left += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function countSubarrays(nums, k) {
  // Step 1: Find the global maximum element
  const maxVal = Math.max(...nums);
  const n = nums.length;
  let count = 0;

  // Step 2: Sliding window to count subarrays with at least k occurrences of maxVal
  let left = 0;
  let maxCount = 0;

  for (let right = 0; right < n; right++) {
    // Step 3: Expand window by including nums[right]
    if (nums[right] === maxVal) {
      maxCount++;
    }

    // Step 4: When we have at least k occurrences of maxVal,
    // ALL subarrays starting from 0..left and ending at right are valid
    while (maxCount >= k) {
      // Current window [left..right] has at least k maxVal
      // So all subarrays starting from any i <= left and ending at right are valid
      // That's (left + 1) subarrays (starting at 0, 1, ..., left)
      count += left + 1;

      // Try to shrink window from left
      if (nums[left] === maxVal) {
        maxCount--;
      }
      left++;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public int countSubarrays(int[] nums, int k) {
    // Step 1: Find the global maximum element
    int maxVal = Integer.MIN_VALUE;
    for (int num : nums) {
        maxVal = Math.max(maxVal, num);
    }

    int n = nums.length;
    int count = 0;

    // Step 2: Sliding window to count subarrays with at least k occurrences of maxVal
    int left = 0;
    int maxCount = 0;

    for (int right = 0; right < n; right++) {
        // Step 3: Expand window by including nums[right]
        if (nums[right] == maxVal) {
            maxCount++;
        }

        // Step 4: When we have at least k occurrences of maxVal,
        // ALL subarrays starting from 0..left and ending at right are valid
        while (maxCount >= k) {
            // Current window [left..right] has at least k maxVal
            // So all subarrays starting from any i <= left and ending at right are valid
            // That's (left + 1) subarrays (starting at 0, 1, ..., left)
            count += (left + 1);

            // Try to shrink window from left
            if (nums[left] == maxVal) {
                maxCount--;
            }
            left++;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We pass through the array once with the right pointer: O(n)
- The left pointer also moves from 0 to n at most: O(n)
- Each element is processed at most twice (once by right, once by left): O(2n) = O(n)

**Space Complexity: O(1)**

- We only use a few integer variables: max_val, count, left, max_count
- No additional data structures that scale with input size

## Common Mistakes

1. **Misinterpreting "maximum element of nums"**: Many candidates think this means the maximum of each subarray, but it actually means the global maximum of the entire input array. This misunderstanding leads to overly complex solutions.

2. **Off-by-one errors in sliding window**: When counting valid subarrays, remember that if window [left..right] is valid, then ALL subarrays starting from 0..left and ending at right are valid. That's (left + 1) subarrays, not left subarrays.

3. **Forgetting to handle shrinking window correctly**: When nums[left] equals max_val, we must decrement max_count before moving left pointer. Otherwise, we lose track of how many max_val elements are in the window.

4. **Inefficient maximum finding**: Some candidates repeatedly find the maximum in each subarray or use a heap/ordered map, resulting in O(n² log n) or O(n²) time. The key is recognizing we only care about the global maximum.

## When You'll See This Pattern

This sliding window pattern appears in many "count subarrays satisfying condition" problems:

1. **Subarrays with K Different Integers** (LeetCode 992): Count subarrays with exactly K distinct integers. Uses sliding window with frequency map.

2. **Binary Subarrays With Sum** (LeetCode 930): Count subarrays with sum equal to goal. Uses prefix sums and hash map.

3. **Fruit Into Baskets** (LeetCode 904): Find longest subarray with at most 2 distinct values. Classic sliding window problem.

The common theme is using two pointers to maintain a window that satisfies some condition, then efficiently counting valid subarrays based on that window.

## Key Takeaways

1. **Read carefully**: "Maximum element of nums" means the global maximum, not the maximum of each subarray. This simplification is crucial for the O(n) solution.

2. **Sliding window for subarray counting**: When counting subarrays satisfying a condition, often the optimal approach is to fix the right endpoint and find all valid left endpoints.

3. **The "at least k" pattern**: When a window has at least k of something, ALL subarrays containing that window also satisfy the condition. This allows efficient counting without checking each subarray individually.

Related problems: [Find the Number of Subarrays Where Boundary Elements Are Maximum](/problem/find-the-number-of-subarrays-where-boundary-elements-are-maximum)
