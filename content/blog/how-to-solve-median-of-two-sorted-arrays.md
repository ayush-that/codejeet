---
title: "How to Solve Median of Two Sorted Arrays — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Median of Two Sorted Arrays. Hard difficulty, 46.0% acceptance rate. Topics: Array, Binary Search, Divide and Conquer."
date: "2026-03-04"
category: "dsa-patterns"
tags: ["median-of-two-sorted-arrays", "array", "binary-search", "divide-and-conquer", "hard"]
---

# How to Solve Median of Two Sorted Arrays

Finding the median of two sorted arrays is a classic hard problem that tests your understanding of binary search and array partitioning. What makes this problem tricky is that we need to achieve O(log(m+n)) time complexity, which forces us to think beyond simply merging the arrays. The key insight is that we can find the median without actually merging by using binary search to partition both arrays correctly.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `nums1 = [1, 3, 8, 9, 15]` (m = 5)
- `nums2 = [7, 11, 18, 19, 21, 25]` (n = 6)

We want to find the median of the combined 11 elements. Since 11 is odd, the median is the 6th smallest element (0-indexed position 5).

The brute force approach would merge both arrays and pick the middle element, taking O(m+n) time. But we can do better with binary search.

The key idea: We want to partition both arrays such that:

1. All elements on the left side are ≤ all elements on the right side
2. The left side contains exactly half the elements (or half+1 for odd total)

For our example with total 11 elements, we want the left partition to contain 6 elements (since (11+1)/2 = 6). Let's try a partition:

If we take 3 elements from nums1 and 3 from nums2 for the left partition:

- Left: [1, 3, 8] from nums1 and [7, 11, 18] from nums2
- Right: [9, 15] from nums1 and [19, 21, 25] from nums2

Check if this partition is valid: The largest element on left is max(8, 18) = 18. The smallest element on right is min(9, 19) = 9. Since 18 ≤ 9 is FALSE, this partition is invalid (left side has elements larger than right side).

We need to adjust our partition. Since 18 > 9, we need to move elements from the left to the right. Let's try taking 2 elements from nums1 and 4 from nums2:

- Left: [1, 3] from nums1 and [7, 11, 18, 19] from nums2
- Right: [8, 9, 15] from nums1 and [21, 25] from nums2

Now check: max(3, 19) = 19 and min(8, 21) = 8. Since 19 ≤ 8 is FALSE, still invalid.

Let's try 4 from nums1 and 2 from nums2:

- Left: [1, 3, 8, 9] from nums1 and [7, 11] from nums2
- Right: [15] from nums1 and [18, 19, 21, 25] from nums2

Check: max(9, 11) = 11 and min(15, 18) = 15. Since 11 ≤ 15 is TRUE! This is a valid partition.

The median is the largest element on the left side, which is max(9, 11) = 11. This is indeed the 6th smallest element in the combined array.

## Brute Force Approach

The most straightforward solution is to merge both arrays and find the median. This approach is intuitive but doesn't meet the O(log(m+n)) requirement.

**Algorithm:**

1. Create a new array of size m+n
2. Merge both sorted arrays using two pointers (like in merge sort)
3. Find the median of the merged array:
   - If total length is odd: return middle element
   - If total length is even: return average of two middle elements

**Why it's insufficient:**

- Time complexity: O(m+n) for merging
- Space complexity: O(m+n) for the merged array
- The problem explicitly asks for O(log(m+n)) time, so this solution would be rejected in an interview

<div class="code-group">

```python
# Time: O(m+n) | Space: O(m+n)
def findMedianSortedArraysBrute(nums1, nums2):
    m, n = len(nums1), len(nums2)
    merged = [0] * (m + n)

    i = j = k = 0

    # Merge both arrays
    while i < m and j < n:
        if nums1[i] <= nums2[j]:
            merged[k] = nums1[i]
            i += 1
        else:
            merged[k] = nums2[j]
            j += 1
        k += 1

    # Copy remaining elements from nums1
    while i < m:
        merged[k] = nums1[i]
        i += 1
        k += 1

    # Copy remaining elements from nums2
    while j < n:
        merged[k] = nums2[j]
        j += 1
        k += 1

    # Find median
    total = m + n
    if total % 2 == 1:
        return merged[total // 2]
    else:
        mid1 = merged[total // 2 - 1]
        mid2 = merged[total // 2]
        return (mid1 + mid2) / 2
```

```javascript
// Time: O(m+n) | Space: O(m+n)
function findMedianSortedArraysBrute(nums1, nums2) {
  const m = nums1.length,
    n = nums2.length;
  const merged = new Array(m + n);

  let i = 0,
    j = 0,
    k = 0;

  // Merge both arrays
  while (i < m && j < n) {
    if (nums1[i] <= nums2[j]) {
      merged[k] = nums1[i];
      i++;
    } else {
      merged[k] = nums2[j];
      j++;
    }
    k++;
  }

  // Copy remaining elements from nums1
  while (i < m) {
    merged[k] = nums1[i];
    i++;
    k++;
  }

  // Copy remaining elements from nums2
  while (j < n) {
    merged[k] = nums2[j];
    j++;
    k++;
  }

  // Find median
  const total = m + n;
  if (total % 2 === 1) {
    return merged[Math.floor(total / 2)];
  } else {
    const mid1 = merged[total / 2 - 1];
    const mid2 = merged[total / 2];
    return (mid1 + mid2) / 2;
  }
}
```

```java
// Time: O(m+n) | Space: O(m+n)
public double findMedianSortedArraysBrute(int[] nums1, int[] nums2) {
    int m = nums1.length, n = nums2.length;
    int[] merged = new int[m + n];

    int i = 0, j = 0, k = 0;

    // Merge both arrays
    while (i < m && j < n) {
        if (nums1[i] <= nums2[j]) {
            merged[k] = nums1[i];
            i++;
        } else {
            merged[k] = nums2[j];
            j++;
        }
        k++;
    }

    // Copy remaining elements from nums1
    while (i < m) {
        merged[k] = nums1[i];
        i++;
        k++;
    }

    // Copy remaining elements from nums2
    while (j < n) {
        merged[k] = nums2[j];
        j++;
        k++;
    }

    // Find median
    int total = m + n;
    if (total % 2 == 1) {
        return merged[total / 2];
    } else {
        int mid1 = merged[total / 2 - 1];
        int mid2 = merged[total / 2];
        return (mid1 + mid2) / 2.0;
    }
}
```

</div>

## Optimized Approach

The optimal solution uses binary search to achieve O(log(min(m,n))) time. Here's the key insight:

**Core Concept:** Instead of finding the median directly, we find a partition point that divides the combined elements into two equal halves (or nearly equal for odd total).

**Why binary search works:**

- We're searching for the correct partition point in the smaller array
- If we know how many elements to take from the smaller array, we automatically know how many to take from the larger array (since total left elements = (m+n+1)//2)
- The partition is valid when: maxLeft1 ≤ minRight2 AND maxLeft2 ≤ minRight1
- If maxLeft1 > minRight2, we need to move left in the smaller array (take fewer elements from it)
- If maxLeft2 > minRight1, we need to move right in the smaller array (take more elements from it)

**Step-by-step reasoning:**

1. Ensure nums1 is the smaller array (swap if needed) for binary search efficiency
2. Calculate how many total elements should be on left: (m+n+1)//2
3. Binary search on nums1 to find partition point
4. Calculate corresponding partition in nums2
5. Check if partition is valid using the conditions above
6. If valid, calculate median based on whether total length is odd or even
7. If not valid, adjust binary search bounds

## Optimal Solution

Here's the complete optimal solution with detailed comments:

<div class="code-group">

```python
# Time: O(log(min(m,n))) | Space: O(1)
def findMedianSortedArrays(nums1, nums2):
    # Ensure nums1 is the smaller array for binary search efficiency
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    total = m + n
    half = (total + 1) // 2  # Number of elements in left partition

    # Binary search on the smaller array (nums1)
    left, right = 0, m

    while left <= right:
        # Partition point in nums1
        partition1 = (left + right) // 2
        # Corresponding partition in nums2 (half - partition1)
        partition2 = half - partition1

        # Get the four boundary elements
        # If partition is at 0, there are no elements on left (use -inf)
        max_left1 = float('-inf') if partition1 == 0 else nums1[partition1 - 1]
        # If partition is at m, there are no elements on right (use +inf)
        min_right1 = float('inf') if partition1 == m else nums1[partition1]

        max_left2 = float('-inf') if partition2 == 0 else nums2[partition2 - 1]
        min_right2 = float('inf') if partition2 == n else nums2[partition2]

        # Check if partition is correct
        if max_left1 <= min_right2 and max_left2 <= min_right1:
            # Valid partition found
            if total % 2 == 1:
                # Odd total length: median is max of left elements
                return max(max_left1, max_left2)
            else:
                # Even total length: median is average of max left and min right
                left_max = max(max_left1, max_left2)
                right_min = min(min_right1, min_right2)
                return (left_max + right_min) / 2
        elif max_left1 > min_right2:
            # Too many elements from nums1 in left partition, move left
            right = partition1 - 1
        else:
            # Too few elements from nums1 in left partition, move right
            left = partition1 + 1

    # We should never reach here with valid inputs
    raise ValueError("Input arrays are not sorted or invalid")
```

```javascript
// Time: O(log(min(m,n))) | Space: O(1)
function findMedianSortedArrays(nums1, nums2) {
  // Ensure nums1 is the smaller array for binary search efficiency
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }

  const m = nums1.length,
    n = nums2.length;
  const total = m + n;
  const half = Math.floor((total + 1) / 2); // Number of elements in left partition

  // Binary search on the smaller array (nums1)
  let left = 0,
    right = m;

  while (left <= right) {
    // Partition point in nums1
    const partition1 = Math.floor((left + right) / 2);
    // Corresponding partition in nums2 (half - partition1)
    const partition2 = half - partition1;

    // Get the four boundary elements
    // If partition is at 0, there are no elements on left (use -Infinity)
    const maxLeft1 = partition1 === 0 ? -Infinity : nums1[partition1 - 1];
    // If partition is at m, there are no elements on right (use Infinity)
    const minRight1 = partition1 === m ? Infinity : nums1[partition1];

    const maxLeft2 = partition2 === 0 ? -Infinity : nums2[partition2 - 1];
    const minRight2 = partition2 === n ? Infinity : nums2[partition2];

    // Check if partition is correct
    if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
      // Valid partition found
      if (total % 2 === 1) {
        // Odd total length: median is max of left elements
        return Math.max(maxLeft1, maxLeft2);
      } else {
        // Even total length: median is average of max left and min right
        const leftMax = Math.max(maxLeft1, maxLeft2);
        const rightMin = Math.min(minRight1, minRight2);
        return (leftMax + rightMin) / 2;
      }
    } else if (maxLeft1 > minRight2) {
      // Too many elements from nums1 in left partition, move left
      right = partition1 - 1;
    } else {
      // Too few elements from nums1 in left partition, move right
      left = partition1 + 1;
    }
  }

  // We should never reach here with valid inputs
  throw new Error("Input arrays are not sorted or invalid");
}
```

```java
// Time: O(log(min(m,n))) | Space: O(1)
public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    // Ensure nums1 is the smaller array for binary search efficiency
    if (nums1.length > nums2.length) {
        int[] temp = nums1;
        nums1 = nums2;
        nums2 = temp;
    }

    int m = nums1.length, n = nums2.length;
    int total = m + n;
    int half = (total + 1) / 2;  // Number of elements in left partition

    // Binary search on the smaller array (nums1)
    int left = 0, right = m;

    while (left <= right) {
        // Partition point in nums1
        int partition1 = (left + right) / 2;
        // Corresponding partition in nums2 (half - partition1)
        int partition2 = half - partition1;

        // Get the four boundary elements
        // If partition is at 0, there are no elements on left (use MIN_VALUE)
        int maxLeft1 = (partition1 == 0) ? Integer.MIN_VALUE : nums1[partition1 - 1];
        // If partition is at m, there are no elements on right (use MAX_VALUE)
        int minRight1 = (partition1 == m) ? Integer.MAX_VALUE : nums1[partition1];

        int maxLeft2 = (partition2 == 0) ? Integer.MIN_VALUE : nums2[partition2 - 1];
        int minRight2 = (partition2 == n) ? Integer.MAX_VALUE : nums2[partition2];

        // Check if partition is correct
        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            // Valid partition found
            if (total % 2 == 1) {
                // Odd total length: median is max of left elements
                return Math.max(maxLeft1, maxLeft2);
            } else {
                // Even total length: median is average of max left and min right
                int leftMax = Math.max(maxLeft1, maxLeft2);
                int rightMin = Math.min(minRight1, minRight2);
                return (leftMax + rightMin) / 2.0;
            }
        } else if (maxLeft1 > minRight2) {
            // Too many elements from nums1 in left partition, move left
            right = partition1 - 1;
        } else {
            // Too few elements from nums1 in left partition, move right
            left = partition1 + 1;
        }
    }

    // We should never reach here with valid inputs
    throw new IllegalArgumentException("Input arrays are not sorted or invalid");
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log(min(m,n)))**

- We perform binary search on the smaller array
- Each iteration reduces the search space by half
- All operations within each iteration are O(1)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- No additional data structures are created

**Why not O(log(m+n))?**

- The problem asks for O(log(m+n)), but our solution is actually O(log(min(m,n)))
- Since log(min(m,n)) ≤ log(m+n), our solution meets and exceeds the requirement
- By always binary searching on the smaller array, we achieve better performance

## Common Mistakes

1. **Forgetting to handle edge cases with partition at boundaries**
   - When partition is at index 0, there are no elements on the left side
   - When partition is at array length, there are no elements on the right side
   - Solution: Use -∞ for empty left and +∞ for empty right

2. **Incorrect calculation of partition2**
   - partition2 should be `half - partition1`, not `(m+n)//2 - partition1`
   - The `half` already accounts for the +1 adjustment for odd totals
   - Solution: Use `half = (total + 1) // 2` consistently

3. **Not ensuring nums1 is the smaller array**
   - Binary search efficiency depends on searching the smaller array
   - If you search the larger array, time complexity becomes O(log(max(m,n)))
   - Solution: Swap arrays if nums1 is larger than nums2

4. **Incorrect median calculation for even total length**
   - For even length, median is average of two middle elements
   - These come from max of left partition and min of right partition
   - Solution: Remember to take max(left1, left2) and min(right1, right2)

## When You'll See This Pattern

This "partition search" pattern appears in problems where you need to find a specific element or position in combined sorted data without actually merging:

1. **Find the k-th smallest element in two sorted arrays**
   - Almost identical to this problem
   - Instead of finding median, find the k-th smallest
   - Use the same partitioning approach with k instead of half

2. **Median of a Row Wise Sorted Matrix**
   - Find median of all elements in a matrix where each row is sorted
   - Uses binary search on the value range with count-based validation
   - Similar concept of finding a partition point without materializing all elements

3. **Search in Rotated Sorted Array**
   - Uses modified binary search to find pivot point
   - Similar concept of partitioning data based on sorted properties

## Key Takeaways

1. **When you need O(log n) on sorted data, think binary search**
   - Even if the problem involves multiple arrays, you can often binary search on one and derive the other

2. **The partition approach transforms median finding into a validation problem**
   - Instead of finding the median directly, find a valid partition
   - Validate using boundary comparisons (max left ≤ min right)

3. **Always work with the smaller array for binary search efficiency**
   - This reduces the search space and improves time complexity
   - The pattern generalizes to "binary search on the dimension with smaller range"

Related problems: [Median of a Row Wise Sorted Matrix](/problem/median-of-a-row-wise-sorted-matrix)
