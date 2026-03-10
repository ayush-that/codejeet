---
title: "How to Solve Maximum Score of a Good Subarray — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Score of a Good Subarray. Hard difficulty, 64.4% acceptance rate. Topics: Array, Two Pointers, Binary Search, Stack, Monotonic Stack."
date: "2027-08-24"
category: "dsa-patterns"
tags: ["maximum-score-of-a-good-subarray", "array", "two-pointers", "binary-search", "hard"]
---

# How to Solve Maximum Score of a Good Subarray

This problem asks us to find the maximum possible score of a subarray that must include index `k`, where the score is calculated as `(minimum value in subarray) * (subarray length)`. What makes this problem tricky is that we need to efficiently explore all possible subarrays containing `k` while calculating their scores based on the minimum value within each subarray. The constraint that the subarray must include index `k` is crucial—it means we can't just find the maximum rectangle in the histogram (though that's related), but we need to focus our search around this pivot point.

## Visual Walkthrough

Let's walk through an example: `nums = [1, 4, 3, 7, 4, 5]` with `k = 3`.

We need to find the maximum score of a subarray that includes index 3 (value 7). The score is `min(subarray) * length(subarray)`.

Let's think about expanding outward from index `k`:

- Start with just `[7]`: score = `7 * 1 = 7`
- Expand left to include index 2: `[3, 7]`: min = 3, length = 2, score = `3 * 2 = 6`
- Expand right to include index 4: `[7, 4]`: min = 4, length = 2, score = `4 * 2 = 8`
- Expand both directions: `[3, 7, 4]`: min = 3, length = 3, score = `3 * 3 = 9`
- Continue expanding: `[4, 3, 7, 4]`: min = 3, length = 4, score = `3 * 4 = 12`
- Full array: `[1, 4, 3, 7, 4, 5]`: min = 1, length = 6, score = `1 * 6 = 6`

The maximum score we found is 12 from subarray `[4, 3, 7, 4]` (indices 1-4).

The key insight: as we expand outward from `k`, the minimum value can only decrease or stay the same—it never increases. This means we can use a two-pointer approach, expanding the side with the larger current value to maximize the potential score.

## Brute Force Approach

A naive solution would be to check all possible subarrays that include index `k`. For each possible left boundary `i` (0 to `k`) and right boundary `j` (`k` to `n-1`), we would:

1. Find the minimum value in `nums[i..j]`
2. Calculate the score as `min * (j - i + 1)`
3. Track the maximum score

This approach has O(n²) time complexity for finding minima and O(n²) subarrays to check, resulting in O(n³) overall time. Even with prefix minimums, we'd still have O(n²) time, which is too slow for n up to 10⁵.

The brute force fails because it redundantly recalculates minima and doesn't leverage the property that we're expanding from a fixed point `k`.

## Optimized Approach

The optimal solution uses a **two-pointer expansion technique** from index `k`. Here's the key reasoning:

1. **Start with the subarray containing only `nums[k]`** and expand outward.
2. **Always expand toward the side with the larger value** between `nums[left-1]` and `nums[right+1]` (when available).
3. **Track the current minimum** as we expand. Since we're always adding elements with values ≥ current minimum (because we choose the larger side), the minimum only decreases when we add a smaller value.
4. **Calculate score at each step** as `current_min * (right - left + 1)`.

Why does this work? By always expanding toward the larger value, we're trying to maintain as high a minimum as possible for as long as possible. This greedy approach ensures we consider the most promising expansions first.

Think of it like this: we have a "window" `[left, right]` that always contains `k`. We want to maximize `min(window) * width`. If we expand toward a smaller value, we immediately reduce the minimum, which might not be optimal. By expanding toward larger values, we delay reducing the minimum, allowing for potentially higher scores.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumScore(nums, k):
    """
    Find maximum score of a subarray containing index k.
    Score = min(subarray) * length(subarray)
    """
    n = len(nums)
    left = right = k  # Start with subarray containing only nums[k]
    current_min = nums[k]  # Current minimum in our window
    max_score = nums[k]  # Initialize with score of single element

    # Expand outward until we cover the entire array
    while left > 0 or right < n - 1:
        # Choose which side to expand toward
        # If left is at boundary, must expand right
        if left == 0:
            right += 1
        # If right is at boundary, must expand left
        elif right == n - 1:
            left -= 1
        # Otherwise, expand toward the side with larger value
        # This helps maintain a higher minimum
        elif nums[left - 1] > nums[right + 1]:
            left -= 1
        else:
            right += 1

        # Update current minimum (it can only decrease as we expand)
        current_min = min(current_min, nums[left], nums[right])

        # Calculate score for current window
        current_score = current_min * (right - left + 1)
        max_score = max(max_score, current_score)

    return max_score
```

```javascript
// Time: O(n) | Space: O(1)
function maximumScore(nums, k) {
  const n = nums.length;
  let left = k,
    right = k; // Start with subarray containing only nums[k]
  let currentMin = nums[k]; // Current minimum in our window
  let maxScore = nums[k]; // Initialize with score of single element

  // Expand outward until we cover the entire array
  while (left > 0 || right < n - 1) {
    // Choose which side to expand toward
    // If left is at boundary, must expand right
    if (left === 0) {
      right++;
    }
    // If right is at boundary, must expand left
    else if (right === n - 1) {
      left--;
    }
    // Otherwise, expand toward the side with larger value
    // This helps maintain a higher minimum
    else if (nums[left - 1] > nums[right + 1]) {
      left--;
    } else {
      right++;
    }

    // Update current minimum (it can only decrease as we expand)
    currentMin = Math.min(currentMin, nums[left], nums[right]);

    // Calculate score for current window
    const currentScore = currentMin * (right - left + 1);
    maxScore = Math.max(maxScore, currentScore);
  }

  return maxScore;
}
```

```java
// Time: O(n) | Space: O(1)
public int maximumScore(int[] nums, int k) {
    int n = nums.length;
    int left = k, right = k;  // Start with subarray containing only nums[k]
    int currentMin = nums[k];  // Current minimum in our window
    int maxScore = nums[k];    // Initialize with score of single element

    // Expand outward until we cover the entire array
    while (left > 0 || right < n - 1) {
        // Choose which side to expand toward
        // If left is at boundary, must expand right
        if (left == 0) {
            right++;
        }
        // If right is at boundary, must expand left
        else if (right == n - 1) {
            left--;
        }
        // Otherwise, expand toward the side with larger value
        // This helps maintain a higher minimum
        else if (nums[left - 1] > nums[right + 1]) {
            left--;
        } else {
            right++;
        }

        // Update current minimum (it can only decrease as we expand)
        currentMin = Math.min(currentMin, Math.min(nums[left], nums[right]));

        // Calculate score for current window
        int currentScore = currentMin * (right - left + 1);
        maxScore = Math.max(maxScore, currentScore);
    }

    return maxScore;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We start with a window of size 1 at index `k`
- In each iteration of the while loop, we expand either left or right by 1
- We can expand at most `n-1` times (to cover the entire array)
- Each iteration does constant work: comparisons, min/max operations
- Total operations: O(n)

**Space Complexity: O(1)**

- We only use a few integer variables (`left`, `right`, `currentMin`, `maxScore`)
- No additional data structures that scale with input size
- Constant extra space regardless of input size

## Common Mistakes

1. **Forgetting that the subarray must include index `k`**: Some candidates try to find the maximum score subarray anywhere in the array, which is a different (and harder) problem. Always verify your solution includes `k`.

2. **Incorrect expansion logic**: Expanding randomly or always expanding left then right won't guarantee the optimal solution. The key is to always expand toward the larger adjacent value to maintain a higher minimum.

3. **Not updating the minimum correctly**: When we expand, we need to compare the new element with our current minimum. The minimum can only stay the same or decrease—never increase.

4. **Off-by-one errors in boundary conditions**: When `left = 0` or `right = n-1`, we can only expand in one direction. Forgetting these edge cases can cause index out of bounds errors.

## When You'll See This Pattern

This two-pointer expansion technique appears in several problems where you need to optimize a function over subarrays containing a specific element:

1. **Container With Most Water (Medium)**: Similar two-pointer approach moving from ends toward the middle, always moving the pointer with the smaller height.

2. **Trapping Rain Water (Hard)**: Uses two pointers to track left and right maxima while calculating trapped water.

3. **Largest Rectangle in Histogram (Hard)**: While not identical, it shares the concept of finding maximum area where height is limited by the minimum bar. This problem is essentially "Largest Rectangle in Histogram" constrained to rectangles that must include bar `k`.

The core pattern is: when you need to explore all subarrays containing a specific point, and the value of interest (minimum, sum, etc.) changes monotonically as you expand, a two-pointer expansion from that point is often optimal.

## Key Takeaways

1. **When a problem requires exploring subarrays containing a specific index**, consider expanding outward from that index using two pointers. This is more efficient than checking all possible subarrays.

2. **The greedy choice of expanding toward larger values** helps maintain higher minima/sums, leading to better candidate solutions. This works when the optimization function benefits from larger values.

3. **Track the changing constraint (minimum value) as you expand**—it only changes when you encounter a smaller value, not at every step. This observation simplifies the logic.

Related problems: [Largest Rectangle in Histogram](/problem/largest-rectangle-in-histogram)
