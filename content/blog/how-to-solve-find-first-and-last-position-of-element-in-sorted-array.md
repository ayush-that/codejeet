---
title: "How to Solve Find First and Last Position of Element in Sorted Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find First and Last Position of Element in Sorted Array. Medium difficulty, 48.4% acceptance rate. Topics: Array, Binary Search."
date: "2026-03-25"
category: "dsa-patterns"
tags:
  ["find-first-and-last-position-of-element-in-sorted-array", "array", "binary-search", "medium"]
---

# How to Solve Find First and Last Position of Element in Sorted Array

You're given a sorted array of integers and a target value. Your task is to find the starting and ending position (index) of that target in the array. If the target doesn't exist, return [-1, -1]. The catch? You must do this in O(log n) time complexity, which immediately rules out linear scanning. This problem is interesting because it's not just about finding _if_ the target exists, but finding its _boundaries_ — and doing so efficiently requires modifying the standard binary search algorithm.

## Visual Walkthrough

Let's walk through an example to build intuition. Consider `nums = [5, 7, 7, 8, 8, 10]` with `target = 8`.

A naive approach would scan left to right, finding the first 8 at index 3 and the last at index 4. But that's O(n), and we need O(log n).

Here's how binary search thinking helps:

1. **First position**: We need to find the _leftmost_ occurrence of 8. In binary search terms, even if we find an 8 at some index, we should continue searching to the _left_ to see if there's an earlier one.
2. **Last position**: Similarly, we need the _rightmost_ occurrence. If we find an 8, we continue searching to the _right_.

Let's trace finding the first position:

- Start with `left = 0`, `right = 5` (indices)
- `mid = (0 + 5) // 2 = 2` → `nums[2] = 7` (less than 8)
- Since 7 < 8, search right: `left = 3`
- `left = 3`, `right = 5` → `mid = 4` → `nums[4] = 8` (equals target!)
- Here's the key: Instead of stopping, we continue searching left because we want the _first_ occurrence. So `right = 4`
- `left = 3`, `right = 4` → `mid = 3` → `nums[3] = 8` (equals target)
- Continue searching left: `right = 3`
- Now `left = 3`, `right = 3` → check `nums[3] = 8` (valid)
- Loop ends, return `left = 3` as first position

For the last position, we'd do a similar modified binary search that biases toward the right when we find the target.

## Brute Force Approach

The brute force solution is straightforward: iterate through the array from left to right, recording the first and last time you see the target.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def searchRangeBruteForce(nums, target):
    first, last = -1, -1

    for i in range(len(nums)):
        if nums[i] == target:
            if first == -1:  # First time seeing target
                first = i
            last = i  # Update last position each time

    return [first, last]
```

```javascript
// Time: O(n) | Space: O(1)
function searchRangeBruteForce(nums, target) {
  let first = -1,
    last = -1;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      if (first === -1) {
        // First time seeing target
        first = i;
      }
      last = i; // Update last position each time
    }
  }

  return [first, last];
}
```

```java
// Time: O(n) | Space: O(1)
public int[] searchRangeBruteForce(int[] nums, int target) {
    int first = -1, last = -1;

    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) {
            if (first == -1) {  // First time seeing target
                first = i;
            }
            last = i;  // Update last position each time
        }
    }

    return new int[]{first, last};
}
```

</div>

**Why this isn't enough:** The problem explicitly requires O(log n) runtime, and the array is sorted. Linear scanning ignores the sorted property and would be too slow for large arrays (imagine searching through a million elements when binary search could find it in ~20 steps).

## Optimized Approach

The key insight is that we need **two modified binary searches**:

1. One to find the left boundary (first occurrence)
2. One to find the right boundary (last occurrence)

**Finding the left boundary:** When `nums[mid] == target`, instead of returning `mid`, we set `right = mid` to continue searching in the left half. This pushes our search toward the beginning of the array while still maintaining the possibility that `mid` might be the first occurrence.

**Finding the right boundary:** When `nums[mid] == target`, we set `left = mid + 1` to search in the right half. But we need to be careful: if we move `left` past the last occurrence, we'll lose it. So we track the position separately.

The trick is that both searches are still O(log n), and 2 × O(log n) = O(log n).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def searchRange(nums, target):
    def find_left(nums, target):
        """Find first occurrence of target using binary search"""
        left, right = 0, len(nums) - 1
        first_pos = -1

        while left <= right:
            mid = left + (right - left) // 2  # Avoid overflow, equivalent to (left+right)//2

            if nums[mid] == target:
                # Found target, but continue searching left for earlier occurrence
                first_pos = mid
                right = mid - 1  # Move right pointer leftward
            elif nums[mid] < target:
                # Target must be in right half
                left = mid + 1
            else:
                # Target must be in left half
                right = mid - 1

        return first_pos

    def find_right(nums, target):
        """Find last occurrence of target using binary search"""
        left, right = 0, len(nums) - 1
        last_pos = -1

        while left <= right:
            mid = left + (right - left) // 2

            if nums[mid] == target:
                # Found target, but continue searching right for later occurrence
                last_pos = mid
                left = mid + 1  # Move left pointer rightward
            elif nums[mid] < target:
                # Target must be in right half
                left = mid + 1
            else:
                # Target must be in left half
                right = mid - 1

        return last_pos

    # Handle empty array case
    if not nums:
        return [-1, -1]

    # Find first and last positions using separate binary searches
    first = find_left(nums, target)
    last = find_right(nums, target)

    return [first, last]
```

```javascript
// Time: O(log n) | Space: O(1)
function searchRange(nums, target) {
  const findLeft = (nums, target) => {
    // Find first occurrence of target using binary search
    let left = 0,
      right = nums.length - 1;
    let firstPos = -1;

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2); // Avoid overflow

      if (nums[mid] === target) {
        // Found target, but continue searching left for earlier occurrence
        firstPos = mid;
        right = mid - 1; // Move right pointer leftward
      } else if (nums[mid] < target) {
        // Target must be in right half
        left = mid + 1;
      } else {
        // Target must be in left half
        right = mid - 1;
      }
    }

    return firstPos;
  };

  const findRight = (nums, target) => {
    // Find last occurrence of target using binary search
    let left = 0,
      right = nums.length - 1;
    let lastPos = -1;

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);

      if (nums[mid] === target) {
        // Found target, but continue searching right for later occurrence
        lastPos = mid;
        left = mid + 1; // Move left pointer rightward
      } else if (nums[mid] < target) {
        // Target must be in right half
        left = mid + 1;
      } else {
        // Target must be in left half
        right = mid - 1;
      }
    }

    return lastPos;
  };

  // Handle empty array case
  if (nums.length === 0) {
    return [-1, -1];
  }

  // Find first and last positions using separate binary searches
  const first = findLeft(nums, target);
  const last = findRight(nums, target);

  return [first, last];
}
```

```java
// Time: O(log n) | Space: O(1)
public int[] searchRange(int[] nums, int target) {
    // Handle empty array case
    if (nums.length == 0) {
        return new int[]{-1, -1};
    }

    // Find first and last positions using separate binary searches
    int first = findLeft(nums, target);
    int last = findRight(nums, target);

    return new int[]{first, last};
}

private int findLeft(int[] nums, int target) {
    // Find first occurrence of target using binary search
    int left = 0, right = nums.length - 1;
    int firstPos = -1;

    while (left <= right) {
        int mid = left + (right - left) / 2;  // Avoid overflow

        if (nums[mid] == target) {
            // Found target, but continue searching left for earlier occurrence
            firstPos = mid;
            right = mid - 1;  // Move right pointer leftward
        } else if (nums[mid] < target) {
            // Target must be in right half
            left = mid + 1;
        } else {
            // Target must be in left half
            right = mid - 1;
        }
    }

    return firstPos;
}

private int findRight(int[] nums, int target) {
    // Find last occurrence of target using binary search
    int left = 0, right = nums.length - 1;
    int lastPos = -1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (nums[mid] == target) {
            // Found target, but continue searching right for later occurrence
            lastPos = mid;
            left = mid + 1;  // Move left pointer rightward
        } else if (nums[mid] < target) {
            // Target must be in right half
            left = mid + 1;
        } else {
            // Target must be in left half
            right = mid - 1;
        }
    }

    return lastPos;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- We perform two binary searches: one for the left boundary and one for the right boundary.
- Each binary search takes O(log n) time.
- 2 × O(log n) = O(log n), as constant factors are dropped in Big O notation.

**Space Complexity:** O(1)

- We only use a constant amount of extra space for pointers and variables (`left`, `right`, `mid`, `firstPos`, `lastPos`).
- The recursive stack isn't used here (iterative implementation), so no additional space proportional to input size.

## Common Mistakes

1. **Using a single binary search and then linear scan:** Some candidates find one occurrence with binary search, then scan left and right linearly to find boundaries. This is O(log n + k) where k is the count of target occurrences, which could be O(n) in worst case (e.g., all elements are the target).

2. **Incorrect boundary updates in binary search:** When `nums[mid] == target`, forgetting to update the boundary pointer (`right = mid - 1` for left search or `left = mid + 1` for right search) leads to infinite loops or incorrect results.

3. **Off-by-one errors with empty arrays:** Not handling the case where `nums` is empty. Attempting to access `nums[0]` or `nums[nums.length - 1]` on an empty array causes index errors.

4. **Forgetting to check if target was found at all:** The helper functions return -1 if target isn't found, but some implementations might return 0 or another index incorrectly. Always initialize position trackers to -1.

## When You'll See This Pattern

This "modified binary search" pattern appears whenever you need to find boundaries or specific positions in sorted data:

1. **First Bad Version (Easy):** Find the first bad version in a series. Similar to finding the left boundary — when you find a bad version, you continue searching left for an earlier one.

2. **Find Peak Element (Medium):** While not exactly the same, it uses binary search on a property (increasing/decreasing) rather than exact value matching.

3. **Search in Rotated Sorted Array (Medium):** Another variation where binary search logic is modified to handle rotated arrays.

4. **Find Minimum in Rotated Sorted Array (Medium):** Binary search modified to find an inflection point rather than a specific value.

The core idea is always: "What condition tells me whether to search left or right, and what do I do when I find what I'm looking for?"

## Key Takeaways

1. **Binary search can be adapted for more than just existence checks.** By modifying what happens when you find a match, you can find boundaries, counts, or other positional information.

2. **When asked for O(log n) on sorted data, think binary search first.** The constraint is a strong hint about the expected solution approach.

3. **Two binary searches are still O(log n).** Don't be afraid to run binary search multiple times if each run is O(log n) — the total will still be O(log n).

4. **Always test edge cases:** Empty array, single element array, target not present, target at boundaries (first/last index), all elements equal to target.

Related problems: [First Bad Version](/problem/first-bad-version), [Plates Between Candles](/problem/plates-between-candles), [Find Target Indices After Sorting Array](/problem/find-target-indices-after-sorting-array)
