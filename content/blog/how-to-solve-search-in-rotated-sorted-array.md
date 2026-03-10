---
title: "How to Solve Search in Rotated Sorted Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Search in Rotated Sorted Array. Medium difficulty, 44.1% acceptance rate. Topics: Array, Binary Search."
date: "2026-03-03"
category: "dsa-patterns"
tags: ["search-in-rotated-sorted-array", "array", "binary-search", "medium"]
---

# How to Solve Search in Rotated Sorted Array

You're given a sorted array that has been rotated at an unknown pivot point, and you need to find if a target value exists in it. The twist? You must do this in O(log n) time. This problem is tricky because standard binary search assumes a fully sorted array, but here the rotation breaks that monotonicity. The key insight is that even though the array isn't fully sorted, at least one half of any midpoint will always be properly sorted, allowing us to adapt binary search.

## Visual Walkthrough

Let's trace through an example: `nums = [4,5,6,7,0,1,2]`, `target = 0`.

1. **Initial state**: `left = 0`, `right = 6`, `mid = 3` (value 7)
2. **Check which side is sorted**:
   - Left half `[4,5,6,7]` is sorted (4 ≤ 7)
   - Right half `[7,0,1,2]` is not sorted (7 > 2)
3. **Determine where target could be**:
   - Since left half is sorted, check if target is within its range: `4 ≤ 0 ≤ 7`? No.
   - Therefore, target must be in the right half: `left = mid + 1 = 4`
4. **Next iteration**: `left = 4`, `right = 6`, `mid = 5` (value 1)
5. **Check which side is sorted**:
   - Left half `[0,1]` is sorted (0 ≤ 1)
   - Right half `[1,2]` is sorted (1 ≤ 2)
6. **Determine where target could be**:
   - Since left half is sorted, check if target is within its range: `0 ≤ 0 ≤ 1`? Yes!
   - Therefore, search left half: `right = mid = 5`
7. **Next iteration**: `left = 4`, `right = 5`, `mid = 4` (value 0)
8. **Found target!** Return index 4.

The pattern: At each step, one half will always be sorted. We check if the target lies within that sorted half's range. If yes, we search there; if no, we search the other half.

## Brute Force Approach

The simplest solution is linear search: iterate through the entire array and check each element against the target. While this works, it's inefficient for large arrays.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def search_brute(nums, target):
    """
    Brute force linear search through the array.
    Works but doesn't leverage the partially sorted property.
    """
    for i in range(len(nums)):
        if nums[i] == target:
            return i
    return -1
```

```javascript
// Time: O(n) | Space: O(1)
function searchBrute(nums, target) {
  // Iterate through each element
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      return i;
    }
  }
  return -1;
}
```

```java
// Time: O(n) | Space: O(1)
public int searchBrute(int[] nums, int target) {
    // Check each position sequentially
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) {
            return i;
        }
    }
    return -1;
}
```

</div>

**Why this isn't enough**: The problem constraints hint at O(log n) time, and linear search fails to meet that. With arrays of size 10⁵, linear search would take up to 100,000 operations, while binary search would need only about 17.

## Optimized Approach

The optimal solution uses **modified binary search**. Here's the step-by-step reasoning:

1. **Core insight**: In a rotated sorted array, when you pick a midpoint, at least one half (left or right) will be properly sorted.
2. **How to check which half is sorted**: Compare the first element of the half with the last element. If `nums[left] ≤ nums[mid]`, the left half is sorted. Otherwise, the right half is sorted.
3. **Decision making**:
   - If left half is sorted AND target is within `[nums[left], nums[mid]]`, search left.
   - If right half is sorted AND target is within `[nums[mid], nums[right]]`, search right.
   - Otherwise, search the other half.
4. **Why this works**: Even though the array is rotated, the sorted half gives us a predictable range. If the target falls outside that range, it must be in the other half.

The trick is realizing that binary search doesn't require the _entire_ array to be sorted—it just needs predictable conditions to eliminate half the search space each time.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def search(nums, target):
    """
    Modified binary search for rotated sorted array.

    Args:
        nums: List[int] - rotated sorted array with distinct values
        target: int - value to search for

    Returns:
        int - index of target if found, -1 otherwise
    """
    left, right = 0, len(nums) - 1

    while left <= right:
        # Calculate midpoint
        mid = left + (right - left) // 2  # Prevents overflow

        # Found target at midpoint
        if nums[mid] == target:
            return mid

        # Check if left half [left, mid] is sorted
        if nums[left] <= nums[mid]:
            # Left half is sorted
            if nums[left] <= target < nums[mid]:
                # Target is in sorted left half
                right = mid - 1
            else:
                # Target is in right half (which may or may not be sorted)
                left = mid + 1
        else:
            # Right half [mid, right] is sorted
            if nums[mid] < target <= nums[right]:
                # Target is in sorted right half
                left = mid + 1
            else:
                # Target is in left half (which may or may not be sorted)
                right = mid - 1

    # Target not found
    return -1
```

```javascript
// Time: O(log n) | Space: O(1)
function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    // Calculate midpoint safely
    const mid = Math.floor((left + right) / 2);

    // Found target at midpoint
    if (nums[mid] === target) {
      return mid;
    }

    // Check if left half [left, mid] is sorted
    if (nums[left] <= nums[mid]) {
      // Left half is sorted
      if (nums[left] <= target && target < nums[mid]) {
        // Target is in sorted left half
        right = mid - 1;
      } else {
        // Target is in right half
        left = mid + 1;
      }
    } else {
      // Right half [mid, right] is sorted
      if (nums[mid] < target && target <= nums[right]) {
        // Target is in sorted right half
        left = mid + 1;
      } else {
        // Target is in left half
        right = mid - 1;
      }
    }
  }

  // Target not found
  return -1;
}
```

```java
// Time: O(log n) | Space: O(1)
public int search(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;

    while (left <= right) {
        // Calculate midpoint (prevents integer overflow)
        int mid = left + (right - left) / 2;

        // Found target at midpoint
        if (nums[mid] == target) {
            return mid;
        }

        // Check if left half [left, mid] is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                // Target is in sorted left half
                right = mid - 1;
            } else {
                // Target is in right half
                left = mid + 1;
            }
        } else {
            // Right half [mid, right] is sorted
            if (nums[mid] < target && target <= nums[right]) {
                // Target is in sorted right half
                left = mid + 1;
            } else {
                // Target is in left half
                right = mid - 1;
            }
        }
    }

    // Target not found
    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(log n)

- Each iteration eliminates half of the remaining search space, just like standard binary search.
- Even though we're checking which half is sorted, that's a constant-time operation (O(1)).
- With n elements, we need at most log₂(n) iterations.

**Space Complexity**: O(1)

- We only use a few integer variables (left, right, mid).
- No additional data structures are created.

## Common Mistakes

1. **Using standard binary search without modification**: Candidates often try to apply vanilla binary search directly, which fails because the array isn't fully sorted. Remember: you must first determine which half is sorted.

2. **Incorrect boundary checks in sorted half**: When checking if target is in a sorted half, be careful with inclusive/exclusive bounds. For example, `if nums[left] <= target < nums[mid]` (Python) or `if nums[left] <= target && target < nums[mid]` (JS/Java). Note the strict inequality on the right side since we already checked `nums[mid]` earlier.

3. **Forgetting the early return when `nums[mid] == target`**: This seems obvious, but under time pressure, candidates sometimes skip this check and get stuck in infinite loops or incorrect logic.

4. **Mishandling the sorted half detection**: The condition `nums[left] <= nums[mid]` (not `<`) is crucial. When `left == mid`, this half has one element and is trivially sorted. Using `<` would incorrectly mark single-element halves as unsorted.

## When You'll See This Pattern

This modified binary search pattern appears whenever you have data that's _partially_ sorted or has some predictable structure:

1. **Search in Rotated Sorted Array II** (Medium): Same problem but with duplicate values. The presence of duplicates breaks the guarantee that one half is always sorted, requiring additional checks.

2. **Find Minimum in Rotated Sorted Array** (Medium): Instead of searching for a target, you find the rotation point (minimum element). The same "which half is sorted" logic applies, but you compare against the endpoints rather than a target.

3. **Find Peak Element** (Medium): While not exactly the same, it uses similar "local decision making" in binary search—you don't need global sortedness, just enough information to eliminate half the space.

## Key Takeaways

1. **Binary search works on more than just fully sorted arrays**: As long as you can consistently eliminate half the search space, you can achieve O(log n) time. Look for patterns where portions of the data have predictable structure.

2. **The "sorted half" trick is powerful**: When dealing with rotated arrays, always check which half is sorted at each step. This single insight unlocks the O(log n) solution.

3. **Practice boundary cases**: Test with arrays of length 1, 2, fully sorted (unrotated), and fully rotated. These edge cases often reveal bugs in the sorted half detection or boundary conditions.

Related problems: [Search in Rotated Sorted Array II](/problem/search-in-rotated-sorted-array-ii), [Find Minimum in Rotated Sorted Array](/problem/find-minimum-in-rotated-sorted-array), [Pour Water Between Buckets to Make Water Levels Equal](/problem/pour-water-between-buckets-to-make-water-levels-equal)
