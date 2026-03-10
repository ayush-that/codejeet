---
title: "How to Solve Peak Index in a Mountain Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Peak Index in a Mountain Array. Medium difficulty, 66.9% acceptance rate. Topics: Array, Binary Search."
date: "2026-09-09"
category: "dsa-patterns"
tags: ["peak-index-in-a-mountain-array", "array", "binary-search", "medium"]
---

# How to Solve Peak Index in a Mountain Array

You’re given an array that is guaranteed to be a “mountain”: it strictly increases to a peak element, then strictly decreases. Your job is to find the index of that peak element in **O(log n)** time. The challenge is that the array isn’t sorted in the traditional sense—it increases, then decreases—but we can still use binary search by comparing neighboring elements to determine which side of the peak we’re on.

---

## Visual Walkthrough

Let’s trace through an example: `arr = [1, 3, 5, 7, 9, 8, 6, 4, 2]`

We know the array increases, then decreases. The peak is the largest element. A naive approach would scan the whole array, but that’s O(n). Instead, we can use binary search:

1. **Initial bounds**: `left = 0`, `right = 8` (length - 1)
2. **First mid**: `mid = (0 + 8) // 2 = 4`. Compare `arr[4] = 9` with its neighbor `arr[5] = 8`. Since `9 > 8`, we’re on the decreasing side of the mountain, so the peak must be at index 4 or to its left. Move `right = mid`.
3. **New bounds**: `left = 0`, `right = 4`. `mid = (0 + 4) // 2 = 2`. Compare `arr[2] = 5` with `arr[3] = 7`. Since `5 < 7`, we’re on the increasing side, so the peak is to the right. Move `left = mid + 1`.
4. **New bounds**: `left = 3`, `right = 4`. `mid = (3 + 4) // 2 = 3`. Compare `arr[3] = 7` with `arr[4] = 9`. Since `7 < 9`, still increasing. Move `left = mid + 1`.
5. **Bounds converge**: `left = 4`, `right = 4`. Loop ends. Peak index is 4.

The key insight: at any point, comparing `arr[mid]` with `arr[mid + 1]` tells us if we’re on the increasing slope (`arr[mid] < arr[mid + 1]`) or decreasing slope (`arr[mid] > arr[mid + 1]`). We move toward the peak by adjusting `left` or `right` accordingly.

---

## Brute Force Approach

The simplest solution is to scan the array from left to right and return the index of the maximum element. Since the array is guaranteed to be a mountain, the maximum is the peak.

**Why it’s insufficient**: This runs in O(n) time, but the problem requires O(log n). In an interview, you’d be expected to recognize that linear scan doesn’t meet the constraint, prompting you to think about binary search.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def peakIndexInMountainArray_brute(arr):
    # Simply find the index of the maximum element
    peak_idx = 0
    for i in range(1, len(arr)):
        if arr[i] > arr[peak_idx]:
            peak_idx = i
    return peak_idx
```

```javascript
// Time: O(n) | Space: O(1)
function peakIndexInMountainArrayBrute(arr) {
  let peakIdx = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[peakIdx]) {
      peakIdx = i;
    }
  }
  return peakIdx;
}
```

```java
// Time: O(n) | Space: O(1)
public int peakIndexInMountainArrayBrute(int[] arr) {
    int peakIdx = 0;
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] > arr[peakIdx]) {
            peakIdx = i;
        }
    }
    return peakIdx;
}
```

</div>

---

## Optimized Approach

The array isn’t fully sorted, but it has a useful property: it’s **strictly increasing** up to the peak, then **strictly decreasing**. This means for any index `i`:

- If `arr[i] < arr[i + 1]`, we’re on the increasing slope → peak is to the right.
- If `arr[i] > arr[i + 1]`, we’re on the decreasing slope → peak is at `i` or to the left.

This monotonic property allows binary search. We maintain `left` and `right` pointers and at each step:

1. Compute `mid`.
2. Compare `arr[mid]` with `arr[mid + 1]`.
3. If `arr[mid] < arr[mid + 1]`, move `left = mid + 1` (peak is right of `mid`).
4. If `arr[mid] > arr[mid + 1]`, move `right = mid` (peak is at `mid` or left).
5. Stop when `left == right`. That index is the peak.

Why does this work? Because we’re essentially searching for the first index where the array starts decreasing (i.e., the transition point from increasing to decreasing). The condition `arr[mid] > arr[mid + 1]` is true for all indices on the decreasing side, including the peak. We’re finding the leftmost index where that condition holds.

---

## Optimal Solution

Here’s the O(log n) binary search solution with detailed comments.

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def peakIndexInMountainArray(arr):
    """
    Find the peak index in a mountain array using binary search.
    The array is guaranteed to have a peak.
    """
    left, right = 0, len(arr) - 1

    while left < right:
        # Calculate mid point
        mid = (left + right) // 2

        # Compare mid element with its next neighbor
        if arr[mid] < arr[mid + 1]:
            # We're on the increasing slope, peak is to the right
            left = mid + 1
        else:
            # We're on the decreasing slope, peak is at mid or to the left
            right = mid

    # When left == right, we've found the peak index
    return left
```

```javascript
// Time: O(log n) | Space: O(1)
function peakIndexInMountainArray(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // Calculate mid point (use Math.floor to avoid floating point)
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] < arr[mid + 1]) {
      // On increasing slope, move right
      left = mid + 1;
    } else {
      // On decreasing slope, peak is at mid or left
      right = mid;
    }
  }

  // When loop ends, left === right, which is the peak index
  return left;
}
```

```java
// Time: O(log n) | Space: O(1)
public int peakIndexInMountainArray(int[] arr) {
    int left = 0;
    int right = arr.length - 1;

    while (left < right) {
        // Calculate mid point
        int mid = left + (right - left) / 2;  // Avoids potential overflow

        if (arr[mid] < arr[mid + 1]) {
            // On increasing slope, peak is to the right
            left = mid + 1;
        } else {
            // On decreasing slope, peak is at mid or left
            right = mid;
        }
    }

    // When left == right, we've found the peak
    return left;
}
```

</div>

---

## Complexity Analysis

**Time Complexity**: O(log n)  
We halve the search space in each iteration of the while loop. With `n` elements, we need at most log₂(n) steps.

**Space Complexity**: O(1)  
We only use a few integer variables (`left`, `right`, `mid`), regardless of input size.

---

## Common Mistakes

1. **Using `<=` instead of `<` in the while condition**  
   With `while (left <= right)`, you might get stuck in an infinite loop or return an incorrect index. The standard pattern for this “find first true” binary search uses `left < right`. When `left == right`, we’ve found our answer.

2. **Comparing with the wrong neighbor**  
   Some candidates compare `arr[mid]` with `arr[mid - 1]` instead of `arr[mid + 1]`. While this can work with adjusted logic, it’s more error-prone. The `mid + 1` comparison is cleaner because we know `mid + 1` always exists within bounds when `left < right`.

3. **Returning `mid` instead of `left`/`right`**  
   The loop invariant is that the peak is always between `left` and `right` inclusive. When the loop ends, `left == right`, and that’s the peak. Returning `mid` from inside the loop would be incorrect.

4. **Not handling the guaranteed mountain property**  
   The problem guarantees a mountain array, so we don’t need to check for edge cases like flat regions or multiple peaks. However, in the similar “Find Peak Element” problem, you would need a different approach since multiple peaks are allowed.

---

## When You'll See This Pattern

This “peak finding” binary search appears in several scenarios:

1. **Find Peak Element (LeetCode 162)**  
   Similar but without the strict mountain guarantee—there can be multiple peaks. The same binary search logic works by comparing with neighbors.

2. **Find in Mountain Array (LeetCode 1095)**  
   First find the peak using this exact method, then perform binary search on both sides of the peak.

3. **Search in Rotated Sorted Array (LeetCode 33)**  
   While not exactly the same, it uses similar “compare with neighbor” logic to determine which side is sorted and where the target might be.

The core pattern: **When you have a sequence with some monotonic property that changes at a specific point, binary search can find that transition point in O(log n) time.**

---

## Key Takeaways

- **Mountain arrays have a predictable pattern**: strictly increasing to a peak, then strictly decreasing. This allows binary search even though the array isn’t fully sorted.
- **Compare with the next element**: The condition `arr[mid] < arr[mid + 1]` tells you which side of the peak you’re on. This is cleaner than comparing with the previous element.
- **Standard binary search template**: Use `while left < right` and update either `left = mid + 1` or `right = mid`. This finds the first index where the condition becomes true (in this case, where the array starts decreasing).

---

Related problems: [Find Peak Element](/problem/find-peak-element), [Find in Mountain Array](/problem/find-in-mountain-array), [Minimum Number of Removals to Make Mountain Array](/problem/minimum-number-of-removals-to-make-mountain-array)
