---
title: "How to Solve Maximum Difference Between Increasing Elements — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Difference Between Increasing Elements. Easy difficulty, 66.5% acceptance rate. Topics: Array."
date: "2028-02-12"
category: "dsa-patterns"
tags: ["maximum-difference-between-increasing-elements", "array", "easy"]
---

# How to Solve Maximum Difference Between Increasing Elements

This problem asks us to find the maximum difference `nums[j] - nums[i]` where `i < j` and `nums[i] < nums[j]`. If no valid pair exists, we return `-1`. What makes this problem interesting is that it's essentially a simplified version of the classic "Best Time to Buy and Sell Stock" problem, but with an important twist: we're looking for the maximum difference, not maximum profit, and we need to handle cases where no increasing pair exists.

## Visual Walkthrough

Let's trace through an example: `nums = [7, 1, 5, 3, 6, 4]`

We need to find the maximum difference where a later element is larger than an earlier one. Let's think through this step-by-step:

1. Start with `min_so_far = 7` (first element)
2. Move to index 1: `nums[1] = 1`
   - Update `min_so_far = 1` (smaller than 7)
   - No difference to calculate yet
3. Move to index 2: `nums[2] = 5`
   - Calculate difference: `5 - 1 = 4`
   - Update `max_diff = 4`
   - `min_so_far` stays 1 (1 < 5)
4. Move to index 3: `nums[3] = 3`
   - Calculate difference: `3 - 1 = 2`
   - `max_diff` stays 4 (2 < 4)
   - `min_so_far` stays 1 (1 < 3)
5. Move to index 4: `nums[4] = 6`
   - Calculate difference: `6 - 1 = 5`
   - Update `max_diff = 5`
   - `min_so_far` stays 1
6. Move to index 5: `nums[5] = 4`
   - Calculate difference: `4 - 1 = 3`
   - `max_diff` stays 5

Final result: `5` (from buying at 1 and selling at 6)

The key insight: to maximize `nums[j] - nums[i]` with `i < j`, we want the smallest possible `nums[i]` before each `nums[j]`. So as we traverse the array, we track the minimum value seen so far and calculate the difference with the current element.

## Brute Force Approach

The brute force solution checks every possible pair `(i, j)` where `i < j`:

1. Initialize `max_diff = -1`
2. For each `i` from `0` to `n-2`:
3. For each `j` from `i+1` to `n-1`:
4. If `nums[j] > nums[i]`, update `max_diff = max(max_diff, nums[j] - nums[i])`

This approach is straightforward but inefficient with O(n²) time complexity, which is too slow for large arrays (n up to 1000 in typical constraints).

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def maximumDifferenceBruteForce(nums):
    n = len(nums)
    max_diff = -1

    # Check every possible pair (i, j) where i < j
    for i in range(n - 1):
        for j in range(i + 1, n):
            if nums[j] > nums[i]:
                diff = nums[j] - nums[i]
                if diff > max_diff:
                    max_diff = diff

    return max_diff
```

```javascript
// Time: O(n²) | Space: O(1)
function maximumDifferenceBruteForce(nums) {
  let maxDiff = -1;
  const n = nums.length;

  // Check every possible pair (i, j) where i < j
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[j] > nums[i]) {
        const diff = nums[j] - nums[i];
        if (diff > maxDiff) {
          maxDiff = diff;
        }
      }
    }
  }

  return maxDiff;
}
```

```java
// Time: O(n²) | Space: O(1)
public int maximumDifferenceBruteForce(int[] nums) {
    int maxDiff = -1;
    int n = nums.length;

    // Check every possible pair (i, j) where i < j
    for (int i = 0; i < n - 1; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[j] > nums[i]) {
                int diff = nums[j] - nums[i];
                if (diff > maxDiff) {
                    maxDiff = diff;
                }
            }
        }
    }

    return maxDiff;
}
```

</div>

## Optimal Solution

The optimal solution uses a single pass through the array. The key insight is that for any element `nums[j]`, the best `nums[i]` to pair with it is the minimum element that appears before it. So we track the minimum element seen so far as we iterate.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumDifference(nums):
    """
    Find maximum difference nums[j] - nums[i] where i < j and nums[i] < nums[j].

    Approach:
    - Track the minimum element seen so far
    - For each element, calculate difference with current minimum
    - Update maximum difference if current difference is larger
    - Update minimum if current element is smaller
    """
    if len(nums) < 2:
        return -1  # Need at least 2 elements for a valid pair

    min_so_far = nums[0]  # Track the smallest element seen so far
    max_diff = -1  # Initialize result

    # Start from index 1 since we need i < j
    for j in range(1, len(nums)):
        current = nums[j]

        # Calculate difference with the minimum element seen so far
        if current > min_so_far:
            diff = current - min_so_far
            max_diff = max(max_diff, diff)

        # Update minimum if current element is smaller
        if current < min_so_far:
            min_so_far = current

    return max_diff
```

```javascript
// Time: O(n) | Space: O(1)
function maximumDifference(nums) {
  /**
   * Find maximum difference nums[j] - nums[i] where i < j and nums[i] < nums[j].
   *
   * Approach:
   * - Track the minimum element seen so far
   * - For each element, calculate difference with current minimum
   * - Update maximum difference if current difference is larger
   * - Update minimum if current element is smaller
   */
  if (nums.length < 2) {
    return -1; // Need at least 2 elements for a valid pair
  }

  let minSoFar = nums[0]; // Track the smallest element seen so far
  let maxDiff = -1; // Initialize result

  // Start from index 1 since we need i < j
  for (let j = 1; j < nums.length; j++) {
    const current = nums[j];

    // Calculate difference with the minimum element seen so far
    if (current > minSoFar) {
      const diff = current - minSoFar;
      maxDiff = Math.max(maxDiff, diff);
    }

    // Update minimum if current element is smaller
    if (current < minSoFar) {
      minSoFar = current;
    }
  }

  return maxDiff;
}
```

```java
// Time: O(n) | Space: O(1)
public int maximumDifference(int[] nums) {
    /**
     * Find maximum difference nums[j] - nums[i] where i < j and nums[i] < nums[j].
     *
     * Approach:
     * - Track the minimum element seen so far
     * - For each element, calculate difference with current minimum
     * - Update maximum difference if current difference is larger
     * - Update minimum if current element is smaller
     */
    if (nums.length < 2) {
        return -1;  // Need at least 2 elements for a valid pair
    }

    int minSoFar = nums[0];  // Track the smallest element seen so far
    int maxDiff = -1;  // Initialize result

    // Start from index 1 since we need i < j
    for (int j = 1; j < nums.length; j++) {
        int current = nums[j];

        // Calculate difference with the minimum element seen so far
        if (current > minSoFar) {
            int diff = current - minSoFar;
            if (diff > maxDiff) {
                maxDiff = diff;
            }
        }

        // Update minimum if current element is smaller
        if (current < minSoFar) {
            minSoFar = current;
        }
    }

    return maxDiff;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, performing constant-time operations at each step
- Each element is visited exactly once

**Space Complexity: O(1)**

- We only use a few variables (`min_so_far`, `max_diff`, loop counter)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the `nums[i] < nums[j]` condition**: Some candidates calculate differences for all pairs without checking if the later element is actually larger. This would give incorrect results for decreasing sequences.

2. **Initializing `max_diff` to 0 instead of -1**: The problem specifies to return `-1` when no valid pair exists. If you initialize to 0 and the array is strictly decreasing, you'll return 0 instead of -1.

3. **Starting the loop at index 0 instead of 1**: Since we need `i < j`, the first element can only be `nums[i]`, not `nums[j]`. Starting at index 0 would compare an element with itself or create invalid index pairs.

4. **Updating the minimum before calculating the difference**: Always calculate the difference with the current minimum BEFORE updating it. If you update the minimum first, you might calculate `nums[j] - nums[j] = 0` instead of the correct difference.

## When You'll See This Pattern

This "track minimum so far" pattern appears in several stock trading and optimization problems:

1. **Best Time to Buy and Sell Stock (LeetCode 121)**: Almost identical problem - find maximum profit from buying low and selling high. The only difference is that here we return -1 if no profit is possible, while the stock problem returns 0.

2. **Maximum Subarray (LeetCode 53)**: While not identical, it uses a similar "track running value" approach where you maintain the best result seen so far as you iterate.

3. **Maximum Product Subarray (LeetCode 152)**: Another variation where you track both minimum and maximum products due to negative numbers.

4. **Two Furthest Houses With Different Colors (LeetCode 2078)**: While the constraint is different (looking for houses with different colors), the optimization approach of tracking extremes is similar.

## Key Takeaways

1. **When looking for maximum difference with order constraint (`i < j`)**, track the minimum value seen so far. For each new element, the best pair is with the smallest element that came before it.

2. **Single-pass solutions are often possible** when you only need information about elements seen so far (like the minimum) rather than comparing all pairs.

3. **Pay attention to edge cases**: Strictly decreasing arrays should return `-1`, not `0`. Arrays with fewer than 2 elements have no valid pairs.

4. **This is essentially the "buy low, sell high" problem** from stock trading, which is a classic interview question in various forms.

Related problems: [Best Time to Buy and Sell Stock](/problem/best-time-to-buy-and-sell-stock), [Two Furthest Houses With Different Colors](/problem/two-furthest-houses-with-different-colors)
