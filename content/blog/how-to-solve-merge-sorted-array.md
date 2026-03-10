---
title: "How to Solve Merge Sorted Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Merge Sorted Array. Easy difficulty, 54.4% acceptance rate. Topics: Array, Two Pointers, Sorting."
date: "2026-02-16"
category: "dsa-patterns"
tags: ["merge-sorted-array", "array", "two-pointers", "sorting", "easy"]
---

# How to Solve Merge Sorted Array

You're given two sorted arrays and need to merge them into one sorted array. The twist is that the first array has extra space at the end to accommodate the second array's elements. This problem is interesting because it tests your understanding of in-place operations and efficient merging techniques while dealing with the constraint of not creating a new array unnecessarily.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
nums1 = [1, 3, 5, 0, 0, 0], m = 3
nums2 = [2, 4, 6], n = 3
```

We have two sorted arrays: `[1, 3, 5]` and `[2, 4, 6]`. The zeros in `nums1` are placeholders for the elements from `nums2`. We need to merge them into `nums1` without using extra space.

**Step-by-step merging from the end:**

1. **Initialize pointers:**
   - `i = m - 1 = 2` (last real element in nums1: 5)
   - `j = n - 1 = 2` (last element in nums2: 6)
   - `k = m + n - 1 = 5` (last position in nums1)

2. **Compare 5 and 6:** 6 is larger, so place 6 at position k=5

   ```
   nums1 = [1, 3, 5, 0, 0, 6]
   i=2, j=1, k=4
   ```

3. **Compare 5 and 4:** 5 is larger, so place 5 at position k=4

   ```
   nums1 = [1, 3, 5, 0, 5, 6]
   i=1, j=1, k=3
   ```

4. **Compare 3 and 4:** 4 is larger, so place 4 at position k=3

   ```
   nums1 = [1, 3, 5, 4, 5, 6]
   i=1, j=0, k=2
   ```

5. **Compare 3 and 2:** 3 is larger, so place 3 at position k=2

   ```
   nums1 = [1, 3, 3, 4, 5, 6]
   i=0, j=0, k=1
   ```

6. **Compare 1 and 2:** 2 is larger, so place 2 at position k=1

   ```
   nums1 = [1, 2, 3, 4, 5, 6]
   i=0, j=-1, k=0
   ```

7. **Copy remaining from nums1:** Since j < 0, we're done. No need to copy nums1 elements because they're already in place.

**Final result:** `[1, 2, 3, 4, 5, 6]`

## Brute Force Approach

The most straightforward approach would be:

1. Copy all elements from `nums2` into the empty space at the end of `nums1`
2. Sort the entire `nums1` array

While this works, it's inefficient because:

- Sorting takes O((m+n)log(m+n)) time
- We're not taking advantage of the fact that both arrays are already sorted
- This approach would be acceptable if the arrays weren't sorted, but since they are, we can do much better

The key insight is that when both arrays are sorted, we can merge them in linear time O(m+n) by comparing elements one by one.

## Optimal Solution

The optimal solution uses a three-pointer technique starting from the end of both arrays. We work backwards because the end of `nums1` has empty space, so we don't overwrite any elements we haven't processed yet. This allows us to merge in-place without extra space.

<div class="code-group">

```python
# Time: O(m + n) | Space: O(1)
def merge(nums1, m, nums2, n):
    """
    Merge two sorted arrays in-place into nums1.

    Args:
        nums1: First sorted array with extra space at the end
        m: Number of actual elements in nums1
        nums2: Second sorted array
        n: Number of elements in nums2
    """
    # Initialize three pointers:
    # i - tracks the last element in nums1's valid portion
    # j - tracks the last element in nums2
    # k - tracks the position to place the next largest element
    i = m - 1
    j = n - 1
    k = m + n - 1

    # Process both arrays from the end to the beginning
    # This prevents overwriting elements in nums1 that we haven't processed yet
    while i >= 0 and j >= 0:
        if nums1[i] > nums2[j]:
            # nums1[i] is larger, place it at position k
            nums1[k] = nums1[i]
            i -= 1
        else:
            # nums2[j] is larger or equal, place it at position k
            nums1[k] = nums2[j]
            j -= 1
        k -= 1

    # If there are remaining elements in nums2, copy them over
    # No need to copy remaining nums1 elements - they're already in place
    while j >= 0:
        nums1[k] = nums2[j]
        j -= 1
        k -= 1

    # nums1 now contains the merged sorted array
```

```javascript
// Time: O(m + n) | Space: O(1)
function merge(nums1, m, nums2, n) {
  /**
   * Merge two sorted arrays in-place into nums1.
   *
   * @param {number[]} nums1 - First sorted array with extra space at the end
   * @param {number} m - Number of actual elements in nums1
   * @param {number[]} nums2 - Second sorted array
   * @param {number} n - Number of elements in nums2
   * @return {void} - Modifies nums1 in-place
   */

  // Initialize three pointers:
  // i - tracks the last element in nums1's valid portion
  // j - tracks the last element in nums2
  // k - tracks the position to place the next largest element
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;

  // Process both arrays from the end to the beginning
  // This prevents overwriting elements in nums1 that we haven't processed yet
  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      // nums1[i] is larger, place it at position k
      nums1[k] = nums1[i];
      i--;
    } else {
      // nums2[j] is larger or equal, place it at position k
      nums1[k] = nums2[j];
      j--;
    }
    k--;
  }

  // If there are remaining elements in nums2, copy them over
  // No need to copy remaining nums1 elements - they're already in place
  while (j >= 0) {
    nums1[k] = nums2[j];
    j--;
    k--;
  }

  // nums1 now contains the merged sorted array
}
```

```java
// Time: O(m + n) | Space: O(1)
class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        /**
         * Merge two sorted arrays in-place into nums1.
         *
         * @param nums1 - First sorted array with extra space at the end
         * @param m - Number of actual elements in nums1
         * @param nums2 - Second sorted array
         * @param n - Number of elements in nums2
         */

        // Initialize three pointers:
        // i - tracks the last element in nums1's valid portion
        // j - tracks the last element in nums2
        // k - tracks the position to place the next largest element
        int i = m - 1;
        int j = n - 1;
        int k = m + n - 1;

        // Process both arrays from the end to the beginning
        // This prevents overwriting elements in nums1 that we haven't processed yet
        while (i >= 0 && j >= 0) {
            if (nums1[i] > nums2[j]) {
                // nums1[i] is larger, place it at position k
                nums1[k] = nums1[i];
                i--;
            } else {
                // nums2[j] is larger or equal, place it at position k
                nums1[k] = nums2[j];
                j--;
            }
            k--;
        }

        // If there are remaining elements in nums2, copy them over
        // No need to copy remaining nums1 elements - they're already in place
        while (j >= 0) {
            nums1[k] = nums2[j];
            j--;
            k--;
        }

        // nums1 now contains the merged sorted array
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m + n)

- We process each element exactly once from both arrays
- The while loops run until we've processed all m elements from nums1 and all n elements from nums2
- Each iteration does constant work (comparison and assignment)

**Space Complexity:** O(1)

- We only use a constant amount of extra space for the pointers (i, j, k)
- The merging happens in-place within nums1, so no additional arrays are created
- This is the key advantage over approaches that create a new result array

## Common Mistakes

1. **Starting from the beginning instead of the end:** This is the most common mistake. If you start merging from the beginning, you'll overwrite elements in nums1 that you haven't processed yet. Always work backwards when merging into an array with existing data.

2. **Forgetting to handle remaining elements in nums2:** After the main loop, if nums2 still has elements (j ≥ 0), you need to copy them. However, you don't need to copy remaining nums1 elements because they're already in their correct positions.

3. **Incorrect pointer initialization:**
   - `i` should be `m-1` (last valid element in nums1)
   - `j` should be `n-1` (last element in nums2)
   - `k` should be `m+n-1` (last position in the final array)
     Getting these off by one will cause index errors or incorrect results.

4. **Using extra space unnecessarily:** Some candidates create a new array to store the result, then copy it back to nums1. While this works, it uses O(m+n) extra space when O(1) is possible. Interviewers expect the in-place solution.

## When You'll See This Pattern

The "merge from the end" pattern appears in several problems where you need to merge sorted data in-place:

1. **Merge Two Sorted Lists (Easy):** While this uses linked lists instead of arrays, the core merging logic is identical - compare elements from both lists and build the merged list.

2. **Squares of a Sorted Array (Easy):** After squaring sorted numbers that can be negative, you get a "V" shaped array. The optimal solution uses a similar two-pointer approach from both ends toward the middle.

3. **Interval List Intersections (Medium):** Finding overlapping intervals between two sorted lists uses a similar two-pointer merging technique to process both lists in one pass.

The key insight is recognizing when you have two sorted sequences and need to combine them efficiently. The pattern is: use pointers to track positions in each sequence, compare elements, and build the result.

## Key Takeaways

1. **When merging sorted arrays in-place with existing data, always work backwards** to avoid overwriting unprocessed elements. This is the single most important insight for this problem.

2. **The three-pointer technique** (one for each array plus one for the result position) is a clean way to implement in-place merging of sorted arrays.

3. **Recognize when O(1) space is possible** - if the problem gives you extra space in one of the inputs (like the zeros at the end of nums1), there's usually an in-place solution that avoids creating new arrays.

Related problems: [Merge Two Sorted Lists](/problem/merge-two-sorted-lists), [Squares of a Sorted Array](/problem/squares-of-a-sorted-array), [Interval List Intersections](/problem/interval-list-intersections)
