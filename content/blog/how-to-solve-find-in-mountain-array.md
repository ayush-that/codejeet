---
title: "How to Solve Find in Mountain Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find in Mountain Array. Hard difficulty, 41.2% acceptance rate. Topics: Array, Binary Search, Interactive."
date: "2026-02-02"
category: "dsa-patterns"
tags: ["find-in-mountain-array", "array", "binary-search", "interactive", "hard"]
---

# How to Solve Find in Mountain Array

This is an interactive problem where you're given a **mountain array** (an array that increases to a peak, then decreases) and must find the minimum index where a target value appears. The challenge is that you can only access array elements through a limited API (`get(index)` and `length()`), and you need to solve it with minimal API calls. The mountain structure allows us to use binary search strategically, but we need to find the peak first, then search both sides.

## Visual Walkthrough

Let's trace through mountain array `[1, 2, 3, 4, 5, 3, 1]` with target `3`:

1. **Find the peak**: The array increases from 1 to 5, then decreases. The peak is at index 4 (value 5).
2. **Search left side (ascending)**: Search indices 0-4 (values 1,2,3,4,5) for target 3. Since this part is sorted ascending, binary search finds 3 at index 2.
3. **Search right side (descending)**: Only needed if not found on left side. The right side (indices 5-6, values 3,1) is sorted descending, so we'd use a modified binary search.

The key insight: we need **three binary searches**: one to find the peak, then one on each side of the peak. Each binary search is O(log n), giving us O(log n) total calls to the limited API.

## Brute Force Approach

A naive approach would be to call `get(index)` for every index from 0 to `n-1` until we find the target:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) | API calls: O(n)
def findInMountainArray(self, target: int, mountain_arr: 'MountainArray') -> int:
    n = mountain_arr.length()
    for i in range(n):
        if mountain_arr.get(i) == target:
            return i
    return -1
```

```javascript
// Time: O(n) | Space: O(1) | API calls: O(n)
function findInMountainArray(target, mountainArr) {
  const n = mountainArr.length();
  for (let i = 0; i < n; i++) {
    if (mountainArr.get(i) === target) {
      return i;
    }
  }
  return -1;
}
```

```java
// Time: O(n) | Space: O(1) | API calls: O(n)
public int findInMountainArray(int target, MountainArray mountainArr) {
    int n = mountainArr.length();
    for (int i = 0; i < n; i++) {
        if (mountainArr.get(i) == target) {
            return i;
        }
    }
    return -1;
}
```

</div>

**Why this fails**: The problem constraints require minimizing API calls. With `n` up to 10,000 and only 100 calls allowed, linear scanning would use up to 10,000 calls — far exceeding the limit. We need O(log n) calls.

## Optimized Approach

The optimal solution uses **three binary searches**:

1. **Find the peak index**: Use binary search to find where the array transitions from increasing to decreasing. Compare `mountain_arr.get(mid)` with `mountain_arr.get(mid + 1)`:
   - If `get(mid) < get(mid + 1)`, the peak is to the right → search right half
   - If `get(mid) > get(mid + 1)`, the peak is to the left → search left half

2. **Search left (ascending) side**: Perform standard binary search on indices `[0, peak]` since this portion is strictly increasing.

3. **Search right (descending) side**: If not found on left, perform binary search on indices `[peak + 1, n-1]`. Since this portion is strictly decreasing, we need to reverse the comparison logic.

**Why this works**: Each binary search uses O(log n) API calls. Three binary searches = 3 \* O(log n) = O(log n) total calls, well within the 100-call limit for n ≤ 10,000.

## Optimal Solution

<div class="code-group">

```python
# Time: O(log n) | Space: O(1) | API calls: O(log n)
def findInMountainArray(self, target: int, mountain_arr: 'MountainArray') -> int:
    n = mountain_arr.length()

    # Step 1: Find peak index using binary search
    left, right = 0, n - 1
    while left < right:
        mid = left + (right - left) // 2
        # Compare mid with next element to determine slope
        if mountain_arr.get(mid) < mountain_arr.get(mid + 1):
            left = mid + 1  # Peak is to the right
        else:
            right = mid  # Peak is at mid or to the left

    peak = left  # This is the index of the maximum element

    # Step 2: Search left side (ascending part)
    left, right = 0, peak
    while left <= right:
        mid = left + (right - left) // 2
        val = mountain_arr.get(mid)
        if val == target:
            return mid  # Found on left side
        elif val < target:
            left = mid + 1  # Target is greater, search right
        else:
            right = mid - 1  # Target is smaller, search left

    # Step 3: Search right side (descending part) if not found on left
    left, right = peak + 1, n - 1
    while left <= right:
        mid = left + (right - left) // 2
        val = mountain_arr.get(mid)
        if val == target:
            return mid  # Found on right side
        elif val > target:
            # Note: On descending side, if mid value > target,
            # target is to the right (since values decrease)
            left = mid + 1
        else:
            # If mid value < target, target is to the left
            right = mid - 1

    return -1  # Target not found
```

```javascript
// Time: O(log n) | Space: O(1) | API calls: O(log n)
function findInMountainArray(target, mountainArr) {
  const n = mountainArr.length();

  // Step 1: Find peak index
  let left = 0,
    right = n - 1;
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (mountainArr.get(mid) < mountainArr.get(mid + 1)) {
      left = mid + 1; // Peak is to the right
    } else {
      right = mid; // Peak is at mid or to the left
    }
  }
  const peak = left;

  // Step 2: Search left ascending side
  left = 0;
  right = peak;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    const val = mountainArr.get(mid);
    if (val === target) {
      return mid;
    } else if (val < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // Step 3: Search right descending side
  left = peak + 1;
  right = n - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    const val = mountainArr.get(mid);
    if (val === target) {
      return mid;
    } else if (val > target) {
      // On descending side, larger values are to the left
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1;
}
```

```java
// Time: O(log n) | Space: O(1) | API calls: O(log n)
public int findInMountainArray(int target, MountainArray mountainArr) {
    int n = mountainArr.length();

    // Step 1: Find peak index
    int left = 0, right = n - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (mountainArr.get(mid) < mountainArr.get(mid + 1)) {
            left = mid + 1;  // Peak is to the right
        } else {
            right = mid;  // Peak is at mid or to the left
        }
    }
    int peak = left;

    // Step 2: Search left ascending side
    left = 0;
    right = peak;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = mountainArr.get(mid);
        if (val == target) {
            return mid;
        } else if (val < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // Step 3: Search right descending side
    left = peak + 1;
    right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = mountainArr.get(mid);
        if (val == target) {
            return mid;
        } else if (val > target) {
            // On descending side, if current value > target,
            // target must be to the right (values decrease)
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(log n)

- Finding the peak: O(log n) binary search iterations
- Searching left side: O(log n) binary search iterations
- Searching right side: O(log n) binary search iterations
- Total: 3 \* O(log n) = O(log n)

**Space Complexity**: O(1)

- We only use a constant number of variables (pointers, mid values)
- No additional data structures needed

**API Calls**: O(log n)

- Each binary search iteration makes 1-2 `get()` calls
- With n ≤ 10,000, log₂(10,000) ≈ 14, so ~42 calls maximum

## Common Mistakes

1. **Forgetting to search both sides**: Some candidates find the target on the left side and return immediately, which is correct. But if not found, they must also search the right side. The problem asks for the _minimum_ index, so left side takes priority, but both must be checked.

2. **Incorrect binary search on descending side**: The right side is sorted in descending order, so the comparison logic flips. If `mid > target`, we search right (since values decrease). Many candidates use the same logic as ascending side.

3. **Off-by-one errors in peak finding**: When comparing `mid` with `mid+1`, ensure you don't access out of bounds. The while condition `left < right` (not `≤`) and `mid+1` is safe because `mid` is always less than `right`.

4. **Not caching API calls**: While not required for correctness, in a real interview you might discuss that repeated calls to `get()` with the same index could be cached to minimize actual API calls, though the problem guarantees `get()` is O(1).

## When You'll See This Pattern

This problem combines **peak finding** with **binary search on sorted subarrays**, a pattern seen in:

1. **Peak Index in a Mountain Array (LeetCode 852)**: Directly finds the peak using the same binary search technique as step 1 here.

2. **Search in Rotated Sorted Array (LeetCode 33)**: Similar concept of finding a pivot point (like the peak) then searching sorted subarrays on either side.

3. **Find Minimum in Rotated Sorted Array (LeetCode 153)**: Finds transition point in a rotated array, similar to finding the peak in mountain array.

The core pattern: **When data has a structured change (peak, pivot, rotation point), find that transition first, then apply appropriate search algorithms on the resulting sorted segments.**

## Key Takeaways

1. **Mountain arrays have a single peak** that divides the array into ascending and descending sorted segments. Always find the peak first.

2. **Binary search works on any monotonic sequence**, not just ascending. Just flip the comparison logic for descending sequences.

3. **Interactive problems with limited API calls** often require O(log n) solutions. If you're told to minimize calls, think binary search or divide-and-conquer.

4. **When searching for a minimum index** and the array has sorted segments, search the left segment first to satisfy the "minimum index" requirement.

Related problems: [Peak Index in a Mountain Array](/problem/peak-index-in-a-mountain-array), [Minimum Number of Removals to Make Mountain Array](/problem/minimum-number-of-removals-to-make-mountain-array), [Find Good Days to Rob the Bank](/problem/find-good-days-to-rob-the-bank)
