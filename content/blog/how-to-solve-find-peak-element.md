---
title: "How to Solve Find Peak Element — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Peak Element. Medium difficulty, 46.8% acceptance rate. Topics: Array, Binary Search."
date: "2026-05-04"
category: "dsa-patterns"
tags: ["find-peak-element", "array", "binary-search", "medium"]
---

# How to Solve Find Peak Element

A peak element is any element in an array that's strictly greater than both its neighbors. The challenge is that we need to find **any** peak element in logarithmic time, even though the array isn't necessarily sorted. What makes this problem interesting is that while binary search typically requires sorted data, we can still apply it here by leveraging the fact that we only need to find **any** peak, not necessarily the highest one.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 2, 3, 1]`

We know that `nums[-1] = nums[n] = -∞`, so we can think of the array as having negative infinity at both ends.

**Step-by-step reasoning:**

1. Start with the entire array: indices 0 to 3
2. Check middle element at index 1: `nums[1] = 2`
   - Left neighbor (index 0): `1` → 2 > 1 ✓
   - Right neighbor (index 2): `3` → 2 < 3 ✗
   - Since 2 < 3, there must be a peak on the right side. Why? Because if we keep going right and find a decreasing element, that's a peak. If we keep increasing all the way to the end, the last element is a peak since `nums[n] = -∞`.
3. Search right half: indices 2 to 3
4. Check middle element at index 2: `nums[2] = 3`
   - Left neighbor (index 1): `2` → 3 > 2 ✓
   - Right neighbor (index 3): `1` → 3 > 1 ✓
   - Found a peak! Return index 2.

The key insight: if `nums[mid] < nums[mid+1]`, then there must be a peak on the right. If `nums[mid] < nums[mid-1]`, there must be a peak on the left. This property allows us to use binary search even though the array isn't fully sorted.

## Brute Force Approach

The most straightforward solution is to scan through the array and check each element:

1. For each index `i` from 0 to `n-1`, check if `nums[i]` is greater than both neighbors
2. Handle edge cases: first element only needs to be greater than the second (since first "neighbor" is -∞), last element only needs to be greater than the second-to-last
3. Return the first peak found

**Why this isn't optimal:**

- Time complexity is O(n), which works but isn't optimal
- The problem can be solved in O(log n) time using binary search
- In an interview, you'd be expected to find the optimal solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findPeakElement_brute(nums):
    n = len(nums)

    # Handle edge cases
    if n == 1:
        return 0

    # Check first element
    if nums[0] > nums[1]:
        return 0

    # Check middle elements
    for i in range(1, n - 1):
        if nums[i] > nums[i - 1] and nums[i] > nums[i + 1]:
            return i

    # Check last element
    if nums[n - 1] > nums[n - 2]:
        return n - 1

    # According to problem constraints, there's always at least one peak
    return -1
```

```javascript
// Time: O(n) | Space: O(1)
function findPeakElementBrute(nums) {
  const n = nums.length;

  // Handle edge cases
  if (n === 1) return 0;

  // Check first element
  if (nums[0] > nums[1]) return 0;

  // Check middle elements
  for (let i = 1; i < n - 1; i++) {
    if (nums[i] > nums[i - 1] && nums[i] > nums[i + 1]) {
      return i;
    }
  }

  // Check last element
  if (nums[n - 1] > nums[n - 2]) return n - 1;

  // According to problem constraints, there's always at least one peak
  return -1;
}
```

```java
// Time: O(n) | Space: O(1)
public int findPeakElementBrute(int[] nums) {
    int n = nums.length;

    // Handle edge cases
    if (n == 1) return 0;

    // Check first element
    if (nums[0] > nums[1]) return 0;

    // Check middle elements
    for (int i = 1; i < n - 1; i++) {
        if (nums[i] > nums[i - 1] && nums[i] > nums[i + 1]) {
            return i;
        }
    }

    // Check last element
    if (nums[n - 1] > nums[n - 2]) return n - 1;

    // According to problem constraints, there's always at least one peak
    return -1;
}
```

</div>

## Optimized Approach

The key insight for the optimal solution is that we can use **binary search** even though the array isn't sorted. Here's why it works:

1. **Local decision rule**: Compare `nums[mid]` with `nums[mid+1]`
   - If `nums[mid] < nums[mid+1]`: The peak must be on the right side because:
     - Either we'll find a decreasing element (which is a peak)
     - Or we'll reach the end, and `nums[n] = -∞` guarantees the last element is a peak
   - If `nums[mid] > nums[mid+1]`: The peak must be on the left side for the same reasoning

2. **Why binary search works**: This comparison gives us a "direction" to search, similar to how comparing with a target tells us which half to search in standard binary search.

3. **Termination**: When `left == right`, we've found a peak. At this point, we've narrowed our search to a single element that's greater than its "virtual" neighbors (the elements we compared against during the search).

## Optimal Solution

Here's the binary search implementation with detailed comments:

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def findPeakElement(nums):
    """
    Find any peak element in the array using binary search.

    Args:
        nums: List of integers

    Returns:
        Index of any peak element
    """
    left, right = 0, len(nums) - 1

    while left < right:
        # Calculate mid point - using floor division
        mid = (left + right) // 2

        # Compare mid with its right neighbor
        if nums[mid] < nums[mid + 1]:
            # Peak must be on the right side
            # Why? Because nums[mid] < nums[mid+1], so we're on an upward slope
            # Either we'll find a peak (where it starts decreasing)
            # Or we'll reach the end, and nums[n] = -∞ guarantees a peak
            left = mid + 1
        else:
            # Peak must be on the left side (including mid)
            # Why? Because nums[mid] >= nums[mid+1], so we're on a downward slope
            # Either mid is the peak, or there's a peak to the left
            right = mid

    # When left == right, we've found a peak
    # At this point, we've narrowed down to a single element that satisfies
    # the peak condition based on our comparisons during the search
    return left
```

```javascript
// Time: O(log n) | Space: O(1)
function findPeakElement(nums) {
  /**
   * Find any peak element in the array using binary search.
   *
   * @param {number[]} nums - Array of integers
   * @return {number} Index of any peak element
   */
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    // Calculate mid point - using Math.floor for integer division
    const mid = Math.floor((left + right) / 2);

    // Compare mid with its right neighbor
    if (nums[mid] < nums[mid + 1]) {
      // Peak must be on the right side
      // We're on an upward slope, so move right
      left = mid + 1;
    } else {
      // Peak must be on the left side (including mid)
      // We're on a downward slope, so move left
      right = mid;
    }
  }

  // When left === right, we've found a peak
  return left;
}
```

```java
// Time: O(log n) | Space: O(1)
public int findPeakElement(int[] nums) {
    /**
     * Find any peak element in the array using binary search.
     *
     * @param nums Array of integers
     * @return Index of any peak element
     */
    int left = 0;
    int right = nums.length - 1;

    while (left < right) {
        // Calculate mid point - prevent potential overflow
        int mid = left + (right - left) / 2;

        // Compare mid with its right neighbor
        if (nums[mid] < nums[mid + 1]) {
            // Peak must be on the right side
            // We're on an upward slope, so move right
            left = mid + 1;
        } else {
            // Peak must be on the left side (including mid)
            // We're on a downward slope, so move left
            right = mid;
        }
    }

    // When left == right, we've found a peak
    return left;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- We're using binary search, which halves the search space each iteration
- Each iteration does constant work (just a comparison)
- With n elements, we need at most log₂(n) iterations

**Space Complexity: O(1)**

- We only use a few integer variables (left, right, mid)
- No additional data structures are created
- The space usage is constant regardless of input size

## Common Mistakes

1. **Off-by-one errors with binary search bounds**
   - Mistake: Using `while (left <= right)` instead of `while (left < right)`
   - Why it's wrong: With `<=`, you might get stuck in an infinite loop when `left == right`
   - Fix: Use `<` and update bounds carefully: `left = mid + 1` or `right = mid`

2. **Checking both neighbors in binary search**
   - Mistake: Comparing `nums[mid]` with both `nums[mid-1]` and `nums[mid+1]`
   - Why it's wrong: This complicates the logic and requires extra bounds checking
   - Fix: Just compare with `nums[mid+1]`. This single comparison is sufficient to decide direction

3. **Forgetting about the -∞ boundaries**
   - Mistake: Special-casing the first and last elements in binary search
   - Why it's wrong: The -∞ boundaries are already handled by our algorithm
   - Fix: Trust the algorithm. If we reach index 0 or n-1, our comparisons have already accounted for the -∞ neighbors

4. **Using the wrong comparison operator**
   - Mistake: Using `nums[mid] <= nums[mid+1]` instead of `nums[mid] < nums[mid+1]`
   - Why it's wrong: With `<=`, you might miss peaks when elements are equal (though the problem says "strictly greater")
   - Fix: Use `<` for the comparison to match the problem's "strictly greater" requirement

## When You'll See This Pattern

This "binary search on unsorted data" pattern appears in problems where:

1. **You need to find a local maximum/minimum**: The array has some structure (like being "mountain-shaped" or having a single peak) that allows directional decisions.

2. **The comparison gives you a "hint" about which direction to search**: Even without global ordering, local comparisons can guide your search.

**Related problems:**

- **Peak Index in a Mountain Array (LeetCode 852)**: Almost identical problem - find the peak in an array that strictly increases then decreases. The same binary search approach works.
- **Find Minimum in Rotated Sorted Array (LeetCode 153)**: Another problem where binary search works on "partially sorted" data by comparing with the rightmost element.
- **Search in Rotated Sorted Array (LeetCode 33)**: Similar pattern - use comparisons to decide which half of the rotated array to search.

## Key Takeaways

1. **Binary search doesn't require fully sorted data**: If you can make a local comparison that tells you which direction contains your answer, you can use binary search.

2. **Look for "directional hints"**: In this problem, comparing with the right neighbor tells us whether we're on an upward or downward slope, which tells us which side must contain a peak.

3. **Simplify boundary conditions**: The trick of imagining `nums[-1] = nums[n] = -∞` eliminates special cases and makes the algorithm cleaner. Look for similar simplifications in other problems.

Remember: The goal isn't to find the highest peak, just **any** peak. This relaxation of requirements is what makes the O(log n) solution possible.

Related problems: [Peak Index in a Mountain Array](/problem/peak-index-in-a-mountain-array), [Find a Peak Element II](/problem/find-a-peak-element-ii), [Pour Water Between Buckets to Make Water Levels Equal](/problem/pour-water-between-buckets-to-make-water-levels-equal)
