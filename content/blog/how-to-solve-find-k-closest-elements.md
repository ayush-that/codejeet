---
title: "How to Solve Find K Closest Elements — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find K Closest Elements. Medium difficulty, 49.4% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sliding Window, Sorting."
date: "2026-12-16"
category: "dsa-patterns"
tags: ["find-k-closest-elements", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Find K Closest Elements

You're given a sorted array of integers, a target value `x`, and a number `k`. Your task is to return the `k` closest integers to `x` from the array, sorted in ascending order. The "closeness" is determined by absolute difference, with ties broken by the smaller number. What makes this problem interesting is that while the array is sorted, the target `x` might not exist in the array, and the `k` closest elements form a contiguous subarray—but finding its starting position efficiently requires careful binary search thinking.

## Visual Walkthrough

Let's trace through an example: `arr = [1, 2, 3, 4, 5]`, `k = 4`, `x = 3`.

We need 4 closest elements to 3. The absolute differences are:

- |1-3| = 2
- |2-3| = 1
- |3-3| = 0
- |4-3| = 1
- |5-3| = 2

The 4 smallest differences are for elements 2, 3, 4, and either 1 or 5 (both have difference 2). Since ties go to the smaller number, we choose 1 over 5. So the result is `[1, 2, 3, 4]`.

Notice something important: the k closest elements always form a contiguous subarray in the sorted result. Why? Imagine if there were a gap: you could replace one of the chosen elements with a closer one in the gap. This observation is key—we're not picking k individual elements, but finding the optimal starting index for a window of length k.

## Brute Force Approach

A naive approach would be to calculate the absolute difference for each element, sort the elements by this difference (with tie-breaker), take the first k, and then sort them. This is straightforward but inefficient:

1. Create a list of pairs `(difference, value)` for each element
2. Sort by difference, then by value for ties
3. Take first k values
4. Sort those values (since result must be sorted)

This takes O(n log n) time due to sorting and O(n) space. For large arrays, this is wasteful—we're doing unnecessary work by sorting all elements when we only need k of them, and we're not leveraging the fact that the array is already sorted.

## Optimized Approach

The key insight is that the k closest elements form a contiguous subarray. So instead of finding k individual elements, we need to find the optimal starting index `left` such that `arr[left:left+k]` contains the k closest elements.

How do we find this optimal `left`? We can use binary search! Think of it this way: for any potential starting index `mid`, we compare whether starting at `mid` or `mid+1` gives a better window. The comparison is based on which window has elements closer to `x`.

Specifically, if `x - arr[mid] > arr[mid+k] - x`, then the element at `mid+k` is closer to `x` than the element at `mid`, so we should move our window right. Otherwise, we move left. This works because the array is sorted, so as we move the window right, elements get larger (and potentially farther from x if we go too far).

This is essentially finding the "best" starting position where the window is centered around x as much as possible. The binary search reduces the problem from O(n) to O(log n) for finding the starting index, plus O(k) to build the result.

## Optimal Solution

We'll implement the binary search approach. The algorithm:

1. Initialize `left = 0` and `right = len(arr) - k` (since the window of size k must fit)
2. While `left < right`:
   - Calculate `mid = left + (right - left) // 2`
   - Compare `x - arr[mid]` with `arr[mid + k] - x`
   - If `x - arr[mid] > arr[mid + k] - x`, move `left = mid + 1`
   - Otherwise, move `right = mid`
3. Return `arr[left:left + k]`

The comparison is the tricky part: we're checking which endpoint of our current window is farther from x. If the left endpoint is farther, we need to move the window right. If the right endpoint is farther or equal, we move left (or stay put).

<div class="code-group">

```python
# Time: O(log(n-k) + k) - binary search on possible start positions plus building result
# Space: O(1) - excluding the output array
def findClosestElements(arr, k, x):
    """
    Find k closest elements to x in sorted array arr.

    Args:
        arr: Sorted list of integers
        k: Number of elements to return
        x: Target value

    Returns:
        List of k closest elements to x, sorted ascending
    """
    # Initialize binary search bounds
    # Right boundary is len(arr) - k because window of size k must fit
    left, right = 0, len(arr) - k

    while left < right:
        mid = left + (right - left) // 2

        # Compare distances of endpoints of two possible windows:
        # Window starting at mid: [mid, mid+k-1]
        # Window starting at mid+1: [mid+1, mid+k]
        # We compare arr[mid] vs arr[mid+k] to decide which window is better

        # If x is closer to arr[mid+k] than to arr[mid]
        # Note: We use > not >= because when distances are equal,
        # we prefer the smaller element (which is on the left)
        if x - arr[mid] > arr[mid + k] - x:
            # Move window to the right
            left = mid + 1
        else:
            # Move window to the left or stay
            right = mid

    # left is the optimal starting index
    return arr[left:left + k]
```

```javascript
// Time: O(log(n-k) + k) - binary search on possible start positions plus building result
// Space: O(1) - excluding the output array
function findClosestElements(arr, k, x) {
  /**
   * Find k closest elements to x in sorted array arr.
   *
   * @param {number[]} arr - Sorted array of integers
   * @param {number} k - Number of elements to return
   * @param {number} x - Target value
   * @return {number[]} - k closest elements to x, sorted ascending
   */

  // Initialize binary search bounds
  // Right boundary is arr.length - k because window of size k must fit
  let left = 0;
  let right = arr.length - k;

  while (left < right) {
    // Calculate middle point
    const mid = Math.floor(left + (right - left) / 2);

    // Compare distances of endpoints of two possible windows:
    // Window starting at mid: [mid, mid+k-1]
    // Window starting at mid+1: [mid+1, mid+k]
    // We compare arr[mid] vs arr[mid+k] to decide which window is better

    // If x is closer to arr[mid+k] than to arr[mid]
    // Note: We use > not >= because when distances are equal,
    // we prefer the smaller element (which is on the left)
    if (x - arr[mid] > arr[mid + k] - x) {
      // Move window to the right
      left = mid + 1;
    } else {
      // Move window to the left or stay
      right = mid;
    }
  }

  // left is the optimal starting index
  // Return slice from left to left+k
  return arr.slice(left, left + k);
}
```

```java
// Time: O(log(n-k) + k) - binary search on possible start positions plus building result
// Space: O(1) - excluding the output array
import java.util.*;

class Solution {
    public List<Integer> findClosestElements(int[] arr, int k, int x) {
        /**
         * Find k closest elements to x in sorted array arr.
         *
         * @param arr - Sorted array of integers
         * @param k - Number of elements to return
         * @param x - Target value
         * @return - k closest elements to x, sorted ascending
         */

        // Initialize binary search bounds
        // Right boundary is arr.length - k because window of size k must fit
        int left = 0;
        int right = arr.length - k;

        while (left < right) {
            // Calculate middle point
            int mid = left + (right - left) / 2;

            // Compare distances of endpoints of two possible windows:
            // Window starting at mid: [mid, mid+k-1]
            // Window starting at mid+1: [mid+1, mid+k]
            // We compare arr[mid] vs arr[mid+k] to decide which window is better

            // If x is closer to arr[mid+k] than to arr[mid]
            // Note: We use > not >= because when distances are equal,
            // we prefer the smaller element (which is on the left)
            if (x - arr[mid] > arr[mid + k] - x) {
                // Move window to the right
                left = mid + 1;
            } else {
                // Move window to the left or stay
                right = mid;
            }
        }

        // left is the optimal starting index
        // Build result list from left to left+k-1
        List<Integer> result = new ArrayList<>();
        for (int i = left; i < left + k; i++) {
            result.add(arr[i]);
        }
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log(n-k) + k)

- The binary search runs in O(log(n-k)) time because we're searching over possible starting indices from 0 to n-k.
- Building the result takes O(k) time to slice or copy k elements.
- Note: When k is close to n, the binary search becomes O(1), and the dominant term is O(k).

**Space Complexity:** O(1) excluding the output array

- We only use a few integer variables for the binary search.
- The output array of size k is required by the problem, so it's typically not counted in space complexity.

## Common Mistakes

1. **Incorrect binary search bounds:** Setting `right = len(arr)` instead of `len(arr) - k`. This can cause index out of bounds when accessing `arr[mid + k]`. Remember the window of size k must fit within the array.

2. **Wrong comparison in binary search:** Using `>=` instead of `>` when comparing distances. When `x - arr[mid] == arr[mid + k] - x`, we should prefer the smaller element (arr[mid]), so we don't move the window right. Using `>=` would incorrectly move the window right in this case.

3. **Forgetting the array is sorted for the result:** Some candidates find the k closest elements but forget to sort them before returning. However, since we're taking a contiguous subarray from a sorted array, the result is automatically sorted.

4. **Overcomplicating with heaps:** Trying to use a max-heap of size k to track the k closest elements. While this works (in O(n log k) time), it's less efficient than the binary search approach and doesn't leverage the sorted nature of the input array.

## When You'll See This Pattern

This "find optimal window in sorted array" pattern appears in several problems:

1. **Guess Number Higher or Lower (Easy):** Binary search to find a target number by getting feedback "higher" or "lower". Similar binary search thinking but simpler.

2. **Find K-th Smallest Pair Distance (Hard):** Uses binary search on the possible distance values, then checks how many pairs have distance ≤ mid. The "check" function often uses two pointers, similar to maintaining a window.

3. **Capacity To Ship Packages Within D Days (Medium):** Binary search on the possible capacity, with a verification function that checks if that capacity works. The verification uses a greedy approach similar to maintaining windows.

The core pattern is: when you need to find an optimal position or value in a sorted context, and you can determine whether to go left or right based on a local comparison, binary search is often the answer.

## Key Takeaways

1. **Contiguous k closest elements:** In a sorted array, the k closest elements to any target x always form a contiguous subarray. This transforms the problem from "pick k individual elements" to "find the best starting index for a window of size k".

2. **Binary search on indices, not values:** We're not searching for x in the array. Instead, we're searching for the optimal starting index of our k-element window. This is a powerful technique for "find optimal position" problems.

3. **Compare endpoints, not all elements:** To decide whether to move the window left or right, we only need to compare the two elements that would be included/excluded (arr[mid] and arr[mid+k]). This local comparison is sufficient because the array is sorted.

Related problems: [Guess Number Higher or Lower](/problem/guess-number-higher-or-lower), [Guess Number Higher or Lower II](/problem/guess-number-higher-or-lower-ii), [Find K-th Smallest Pair Distance](/problem/find-k-th-smallest-pair-distance)
