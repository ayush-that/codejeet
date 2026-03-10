---
title: "How to Solve Shortest Subarray to be Removed to Make Array Sorted — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shortest Subarray to be Removed to Make Array Sorted. Medium difficulty, 51.3% acceptance rate. Topics: Array, Two Pointers, Binary Search, Stack, Monotonic Stack."
date: "2027-01-09"
category: "dsa-patterns"
tags:
  [
    "shortest-subarray-to-be-removed-to-make-array-sorted",
    "array",
    "two-pointers",
    "binary-search",
    "medium",
  ]
---

# How to Solve Shortest Subarray to be Removed to Make Array Sorted

This problem asks us to find the shortest contiguous subarray we can remove from an array so that the remaining elements form a non-decreasing sequence. What makes this tricky is that we can't just remove any elements—they must be contiguous—and the remaining elements must stay in their original order. The challenge is finding the minimal-length contiguous removal that leaves a sorted array.

## Visual Walkthrough

Let's trace through example `arr = [1,2,3,10,4,2,3,5]`:

1. First, identify the already sorted prefix: `[1,2,3,10]` (indices 0-3)
2. Identify the already sorted suffix: `[2,3,5]` (indices 5-7)
3. The middle segment `[4]` (index 4) is problematic and likely needs removal
4. But we need to check: can we remove a shorter segment that connects prefix and suffix?
5. Try removing just `[10,4]` (indices 3-4): Remaining = `[1,2,3,2,3,5]` → `[2,3,5]` is not sorted after `[1,2,3]`
6. Try removing `[10,4,2]` (indices 3-5): Remaining = `[1,2,3,3,5]` → sorted! Length = 3
7. Could we do better? Try removing `[3,10,4]` (indices 2-4): Remaining = `[1,2,2,3,5]` → sorted! Length = 3
8. Try removing `[10,4,2,3]` (indices 3-6): Length = 4 (worse)
9. Minimum is 3

The key insight: We need to find the longest prefix and suffix that are already sorted, then find the minimal middle segment to remove so the prefix and suffix can connect in sorted order.

## Brute Force Approach

A naive approach would be to try removing every possible subarray and check if what remains is sorted:

1. For each possible start index `i` (0 to n-1)
2. For each possible end index `j` (i to n-1)
3. Create a new array without elements `arr[i:j+1]`
4. Check if the new array is non-decreasing
5. Track the minimum length `(j-i+1)` that works

This is O(n³) time (O(n²) subarrays × O(n) to check if sorted) and O(n) space for the new array. For n=10⁵ (typical constraint), this is completely infeasible.

Even a slightly better brute force would be O(n²) by checking sortedness incrementally, but that's still too slow.

## Optimized Approach

The optimal solution uses a two-pointer technique with this reasoning:

1. **Find the longest sorted prefix**: Starting from left, find the last index where `arr[i] <= arr[i+1]`
2. **Find the longest sorted suffix**: Starting from right, find the first index where `arr[j-1] <= arr[j]`
3. **If the entire array is already sorted**: Return 0 (no removal needed)
4. **Otherwise, we have three segments**:
   - Sorted prefix: `arr[0...left]`
   - Middle (potentially unsorted): `arr[left+1...right-1]`
   - Sorted suffix: `arr[right...n-1]`
5. **We must remove at least the middle segment**, but we might need to extend into prefix/suffix
6. **Key optimization**: For each element in the prefix, find the smallest element in the suffix that's ≥ it, using binary search since suffix is sorted
7. **Alternative approach (more efficient)**: Use two pointers to find minimal overlap:
   - Start with `i = 0` (beginning of prefix) and `j = right` (beginning of suffix)
   - While `i <= left` and `j < n`:
     - If `arr[i] <= arr[j]`, we can connect prefix up to `i` with suffix starting at `j`
     - Track minimal removal length: `(j - i - 1)`
     - Increment `i` to try for better (shorter) removal
     - If `arr[i] > arr[j]`, increment `j` to find larger suffix element

This gives us O(n) time with O(1) space.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def findLengthOfShortestSubarray(arr):
    """
    Find the length of the shortest subarray to remove to make arr non-decreasing.

    Approach:
    1. Find the longest non-decreasing prefix
    2. Find the longest non-decreasing suffix
    3. If the whole array is sorted, return 0
    4. Try removing only the middle segment
    5. Use two pointers to find minimal overlap between prefix and suffix
    """
    n = len(arr)

    # Step 1: Find the end of the longest non-decreasing prefix
    left = 0
    while left < n - 1 and arr[left] <= arr[left + 1]:
        left += 1

    # If the entire array is already sorted
    if left == n - 1:
        return 0

    # Step 2: Find the start of the longest non-decreasing suffix
    right = n - 1
    while right > 0 and arr[right - 1] <= arr[right]:
        right -= 1

    # Step 3: Initial answer - remove everything between prefix and suffix
    # We could remove either:
    #   - Everything from (left+1) to end: length = n - (left + 1)
    #   - Everything from start to (right-1): length = right
    # Take the minimum of these two options
    result = min(n - left - 1, right)

    # Step 4: Try to connect prefix with suffix by removing less
    # Use two pointers: i in prefix [0...left], j in suffix [right...n-1]
    i, j = 0, right

    while i <= left and j < n:
        if arr[i] <= arr[j]:
            # We can connect prefix[0...i] with suffix[j...n-1]
            # The removed segment would be from i+1 to j-1
            # Length of removed segment = j - i - 1
            result = min(result, j - i - 1)
            # Try with next prefix element to see if we can remove even less
            i += 1
        else:
            # Current prefix element is too large for this suffix element
            # Try a larger suffix element
            j += 1

    return result
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Find the length of the shortest subarray to remove to make arr non-decreasing.
 *
 * Approach:
 * 1. Find the longest non-decreasing prefix
 * 2. Find the longest non-decreasing suffix
 * 3. If the whole array is sorted, return 0
 * 4. Try removing only the middle segment
 * 5. Use two pointers to find minimal overlap between prefix and suffix
 */
function findLengthOfShortestSubarray(arr) {
  const n = arr.length;

  // Step 1: Find the end of the longest non-decreasing prefix
  let left = 0;
  while (left < n - 1 && arr[left] <= arr[left + 1]) {
    left++;
  }

  // If the entire array is already sorted
  if (left === n - 1) {
    return 0;
  }

  // Step 2: Find the start of the longest non-decreasing suffix
  let right = n - 1;
  while (right > 0 && arr[right - 1] <= arr[right]) {
    right--;
  }

  // Step 3: Initial answer - remove everything between prefix and suffix
  // We could remove either:
  //   - Everything from (left+1) to end: length = n - (left + 1)
  //   - Everything from start to (right-1): length = right
  // Take the minimum of these two options
  let result = Math.min(n - left - 1, right);

  // Step 4: Try to connect prefix with suffix by removing less
  // Use two pointers: i in prefix [0...left], j in suffix [right...n-1]
  let i = 0,
    j = right;

  while (i <= left && j < n) {
    if (arr[i] <= arr[j]) {
      // We can connect prefix[0...i] with suffix[j...n-1]
      // The removed segment would be from i+1 to j-1
      // Length of removed segment = j - i - 1
      result = Math.min(result, j - i - 1);
      // Try with next prefix element to see if we can remove even less
      i++;
    } else {
      // Current prefix element is too large for this suffix element
      // Try a larger suffix element
      j++;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
/**
 * Find the length of the shortest subarray to remove to make arr non-decreasing.
 *
 * Approach:
 * 1. Find the longest non-decreasing prefix
 * 2. Find the longest non-decreasing suffix
 * 3. If the whole array is sorted, return 0
 * 4. Try removing only the middle segment
 * 5. Use two pointers to find minimal overlap between prefix and suffix
 */
public int findLengthOfShortestSubarray(int[] arr) {
    int n = arr.length;

    // Step 1: Find the end of the longest non-decreasing prefix
    int left = 0;
    while (left < n - 1 && arr[left] <= arr[left + 1]) {
        left++;
    }

    // If the entire array is already sorted
    if (left == n - 1) {
        return 0;
    }

    // Step 2: Find the start of the longest non-decreasing suffix
    int right = n - 1;
    while (right > 0 && arr[right - 1] <= arr[right]) {
        right--;
    }

    // Step 3: Initial answer - remove everything between prefix and suffix
    // We could remove either:
    //   - Everything from (left+1) to end: length = n - (left + 1)
    //   - Everything from start to (right-1): length = right
    // Take the minimum of these two options
    int result = Math.min(n - left - 1, right);

    // Step 4: Try to connect prefix with suffix by removing less
    // Use two pointers: i in prefix [0...left], j in suffix [right...n-1]
    int i = 0, j = right;

    while (i <= left && j < n) {
        if (arr[i] <= arr[j]) {
            // We can connect prefix[0...i] with suffix[j...n-1]
            // The removed segment would be from i+1 to j-1
            // Length of removed segment = j - i - 1
            result = Math.min(result, j - i - 1);
            // Try with next prefix element to see if we can remove even less
            i++;
        } else {
            // Current prefix element is too large for this suffix element
            // Try a larger suffix element
            j++;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the sorted prefix: O(n) in worst case (scan entire array)
- Finding the sorted suffix: O(n) in worst case (scan entire array)
- Two-pointer merge of prefix and suffix: O(n) in worst case (each pointer moves at most n times)
- Total: O(3n) = O(n)

**Space Complexity: O(1)**

- We only use a constant number of variables (left, right, i, j, result)
- No additional data structures are created

## Common Mistakes

1. **Forgetting the case where the entire array is already sorted**: Always check if `left == n-1` after finding the prefix. If you miss this, you'll return a non-zero answer for sorted arrays.

2. **Incorrect boundary conditions in the two-pointer loop**: The condition should be `i <= left` (inclusive) because we can use the entire prefix. Using `i < left` would miss cases where we use the last prefix element.

3. **Not considering removing only prefix or only suffix**: Before the two-pointer pass, we need to consider removing everything after the prefix (`n - left - 1`) or everything before the suffix (`right`). Some candidates jump straight to the two-pointer approach and miss these cases.

4. **Off-by-one errors in calculating removal length**: When `arr[i] <= arr[j]`, the removed segment is from `i+1` to `j-1`, which has length `j - i - 1`. A common mistake is using `j - i` or `j - i + 1`.

## When You'll See This Pattern

This "find sorted prefix/suffix then merge" pattern appears in several array problems:

1. **Shortest Unsorted Continuous Subarray (LeetCode 581)**: Find the shortest subarray that, if sorted, makes the whole array sorted. Similar prefix/suffix identification but different merging logic.

2. **Minimum Size Subarray Sum (LeetCode 209)**: While not identical, it uses similar two-pointer sliding window technique to find minimal subarrays satisfying a condition.

3. **Remove Duplicates from Sorted Array II (LeetCode 80)**: Maintains sorted prefix while processing the array, similar to how we identify the sorted prefix here.

The core pattern is: identify already-valid portions of the array, then find minimal modification needed to connect them while maintaining constraints.

## Key Takeaways

1. **When dealing with sorted/non-decreasing constraints, look for already-sorted segments first**: This often simplifies the problem by reducing what needs to be fixed.

2. **Two pointers are efficient for finding minimal overlap between two sorted sequences**: Since both prefix and suffix are sorted, we can use two pointers to find the optimal connection point in O(n) time.

3. **Always handle edge cases early**: Check if the array is already sorted, handle empty/single-element arrays, and consider removing only prefix or only suffix before attempting more complex solutions.

Related problems: [Count the Number of Incremovable Subarrays II](/problem/count-the-number-of-incremovable-subarrays-ii), [Count the Number of Incremovable Subarrays I](/problem/count-the-number-of-incremovable-subarrays-i)
