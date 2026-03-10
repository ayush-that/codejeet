---
title: "How to Solve Maximum Distance in Arrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Distance in Arrays. Medium difficulty, 45.6% acceptance rate. Topics: Array, Greedy."
date: "2028-09-24"
category: "dsa-patterns"
tags: ["maximum-distance-in-arrays", "array", "greedy", "medium"]
---

# How to Solve Maximum Distance in Arrays

You're given multiple sorted arrays and need to find the maximum absolute difference between any two numbers from different arrays. The challenge is that you can't take both numbers from the same array, and the arrays are sorted individually but not relative to each other. This problem tests your ability to track extremes across multiple sequences efficiently.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider these three arrays:

```
Array 1: [1, 4, 7]
Array 2: [3, 5]
Array 3: [2, 6, 8]
```

We need to find the maximum distance between numbers from different arrays. The brute force approach would check all pairs: (1,3), (1,5), (1,2), (1,6), (1,8), (4,3), (4,5), etc. But there's a smarter way.

The maximum distance will always involve either:

1. The smallest number from one array and the largest number from another array
2. The largest number from one array and the smallest number from another array

But here's the catch: these extremes can't come from the same array. So we need to track the global minimum and maximum values while ensuring they come from different arrays.

Let's walk through it step by step:

- Start with Array 1: min=1, max=7 (both from array 0)
- Process Array 2: min=3, max=5 (both from array 1)
  - Current global min=1 (array 0), global max=7 (array 0)
  - Check distance using Array 2's extremes with global extremes:
    - |5 (array 1) - 1 (array 0)| = 4
    - |7 (array 0) - 3 (array 1)| = 4
  - Update global min to 1 (array 0) and global max to 7 (array 0)
- Process Array 3: min=2, max=8 (both from array 2)
  - Current global min=1 (array 0), global max=7 (array 0)
  - Check distance:
    - |8 (array 2) - 1 (array 0)| = 7
    - |7 (array 0) - 2 (array 2)| = 5
  - Update global min to 1 (array 0) and global max to 8 (array 2)

Maximum distance found: 7 (from 8 in array 2 and 1 in array 0)

## Brute Force Approach

The brute force solution checks every possible pair of numbers from different arrays. For each array `i`, we iterate through all its elements, and for each element, we check all elements in all other arrays `j ≠ i`. This gives us all possible distances.

The problem with this approach is its time complexity. If we have `m` arrays with an average of `n` elements each, we have roughly `m × n` total elements. Checking all pairs from different arrays would take O((m × n)²) time, which is far too slow for typical constraints.

Even if we're clever and only check the first and last elements of each array (since arrays are sorted), we still need to check all pairs of arrays, resulting in O(m²) time. While better, this can still be too slow when `m` is large.

## Optimized Approach

The key insight is that the maximum distance must involve either:

1. The smallest element from some array and the largest element from a different array, OR
2. The largest element from some array and the smallest element from a different array

Since arrays are sorted, the smallest element is always the first element, and the largest is always the last element. We only need to track these extremes.

Here's the step-by-step reasoning:

1. Initialize variables to track the global minimum value and which array it came from, and similarly for the global maximum.
2. For each new array we process:
   - Calculate potential maximum distances using this array's extremes with the global extremes from previous arrays
   - Update the global extremes if this array has a new minimum or maximum
3. The trick is to always check distances BEFORE updating global extremes for the current array. This ensures we never use two extremes from the same array.

Why does this work? When we process array `i`, the global min and max come from arrays processed before `i` (arrays 0 to i-1). Since array `i` is different from those, we can safely pair array `i`'s elements with the global extremes. We check both possibilities: (array i's max - global min) and (global max - array i's min).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is total number of elements across all arrays
# Space: O(1) as we only store a few variables
def maxDistance(arrays):
    """
    Find maximum distance between elements from different sorted arrays.

    Args:
        arrays: List of lists, each sorted in ascending order

    Returns:
        Maximum absolute difference between any two elements from different arrays
    """
    # Initialize with first array's values
    # min_val stores the smallest value seen so far
    # min_idx stores which array it came from
    min_val = arrays[0][0]
    min_idx = 0

    # max_val stores the largest value seen so far
    # max_idx stores which array it came from
    max_val = arrays[0][-1]
    max_idx = 0

    # Initialize result
    result = 0

    # Process remaining arrays starting from index 1
    for i in range(1, len(arrays)):
        curr_arr = arrays[i]
        curr_min = curr_arr[0]
        curr_max = curr_arr[-1]

        # Check potential maximum distances
        # Case 1: Current max with global min (if they're from different arrays)
        distance1 = abs(curr_max - min_val)
        # Case 2: Global max with current min (if they're from different arrays)
        distance2 = abs(max_val - curr_min)

        # Update result with the maximum distance found so far
        result = max(result, distance1, distance2)

        # Update global min if current array has a smaller first element
        if curr_min < min_val:
            min_val = curr_min
            min_idx = i

        # Update global max if current array has a larger last element
        if curr_max > max_val:
            max_val = curr_max
            max_idx = i

    return result
```

```javascript
// Time: O(n) where n is total number of elements across all arrays
// Space: O(1) as we only store a few variables
function maxDistance(arrays) {
  /**
   * Find maximum distance between elements from different sorted arrays.
   *
   * @param {number[][]} arrays - Array of arrays, each sorted in ascending order
   * @return {number} Maximum absolute difference between any two elements from different arrays
   */

  // Initialize with first array's values
  // minVal stores the smallest value seen so far
  // minIdx stores which array it came from
  let minVal = arrays[0][0];
  let minIdx = 0;

  // maxVal stores the largest value seen so far
  // maxIdx stores which array it came from
  let maxVal = arrays[0][arrays[0].length - 1];
  let maxIdx = 0;

  // Initialize result
  let result = 0;

  // Process remaining arrays starting from index 1
  for (let i = 1; i < arrays.length; i++) {
    const currArr = arrays[i];
    const currMin = currArr[0];
    const currMax = currArr[currArr.length - 1];

    // Check potential maximum distances
    // Case 1: Current max with global min (if they're from different arrays)
    const distance1 = Math.abs(currMax - minVal);
    // Case 2: Global max with current min (if they're from different arrays)
    const distance2 = Math.abs(maxVal - currMin);

    // Update result with the maximum distance found so far
    result = Math.max(result, distance1, distance2);

    // Update global min if current array has a smaller first element
    if (currMin < minVal) {
      minVal = currMin;
      minIdx = i;
    }

    // Update global max if current array has a larger last element
    if (currMax > maxVal) {
      maxVal = currMax;
      maxIdx = i;
    }
  }

  return result;
}
```

```java
// Time: O(n) where n is total number of elements across all arrays
// Space: O(1) as we only store a few variables
public int maxDistance(List<List<Integer>> arrays) {
    /**
     * Find maximum distance between elements from different sorted arrays.
     *
     * @param arrays List of lists, each sorted in ascending order
     * @return Maximum absolute difference between any two elements from different arrays
     */

    // Initialize with first array's values
    // minVal stores the smallest value seen so far
    // minIdx stores which array it came from
    int minVal = arrays.get(0).get(0);
    int minIdx = 0;

    // maxVal stores the largest value seen so far
    // maxIdx stores which array it came from
    int maxVal = arrays.get(0).get(arrays.get(0).size() - 1);
    int maxIdx = 0;

    // Initialize result
    int result = 0;

    // Process remaining arrays starting from index 1
    for (int i = 1; i < arrays.size(); i++) {
        List<Integer> currArr = arrays.get(i);
        int currMin = currArr.get(0);
        int currMax = currArr.get(currArr.size() - 1);

        // Check potential maximum distances
        // Case 1: Current max with global min (if they're from different arrays)
        int distance1 = Math.abs(currMax - minVal);
        // Case 2: Global max with current min (if they're from different arrays)
        int distance2 = Math.abs(maxVal - currMin);

        // Update result with the maximum distance found so far
        result = Math.max(result, Math.max(distance1, distance2));

        // Update global min if current array has a smaller first element
        if (currMin < minVal) {
            minVal = currMin;
            minIdx = i;
        }

        // Update global max if current array has a larger last element
        if (currMax > maxVal) {
            maxVal = currMax;
            maxIdx = i;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)** where n is the total number of elements across all arrays. We iterate through each array once, performing constant-time operations for each. Even though we only look at the first and last elements of each array, we still need to access each array, so the complexity is O(m) where m is the number of arrays. Since m ≤ n, this is O(n).

**Space Complexity: O(1)**. We only use a fixed number of variables regardless of input size: minVal, minIdx, maxVal, maxIdx, and result. No additional data structures are created.

## Common Mistakes

1. **Using extremes from the same array**: The most common error is forgetting that the two numbers must come from different arrays. If you simply find the global minimum and maximum across all arrays, they might come from the same array. Always track which array each extreme came from and ensure you're comparing elements from different arrays.

2. **Not checking both pairing directions**: Candidates sometimes only check (current max - global min) but forget to check (global max - current min). Both need to be considered because the maximum distance could come from either pairing.

3. **Updating extremes before checking distances**: If you update the global min/max with the current array's values BEFORE checking distances, you might accidentally pair two numbers from the same array. Always check distances first, then update.

4. **Assuming arrays are non-empty**: While the problem guarantees at least 2 arrays, it doesn't guarantee arrays are non-empty. Always check array bounds before accessing first/last elements in real interviews.

## When You'll See This Pattern

This "track extremes while processing" pattern appears in several problems:

1. **Best Time to Buy and Sell Stock (LeetCode 121)**: Track the minimum price seen so far and calculate maximum profit with current price. Similar to tracking min and calculating max distance.

2. **Maximum Product Subarray (LeetCode 152)**: Track both minimum and maximum products because a negative number can turn a minimum into a maximum.

3. **Container With Most Water (LeetCode 11)**: Use two pointers tracking heights while maximizing area, similar to tracking extremes from different arrays.

The core pattern is maintaining state (min/max) while iterating through data, using that state to compute results, and updating the state as you go.

## Key Takeaways

1. **When dealing with sorted arrays, extremes are at the ends**: This lets you work with just the first and last elements rather than scanning entire arrays.

2. **Track metadata with your extremes**: Always track which array or index your min/max values came from when you need to ensure they're from different sources.

3. **Process in order, check before update**: When maintaining running extremes, calculate results using current values BEFORE updating your running extremes with the current element's values.

[Practice this problem on CodeJeet](/problem/maximum-distance-in-arrays)
