---
title: "How to Solve Binary Search — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Binary Search. Easy difficulty, 60.5% acceptance rate. Topics: Array, Binary Search."
date: "2026-03-10"
category: "dsa-patterns"
tags: ["binary-search", "array", "binary-search", "easy"]
---

# How to Solve Binary Search

Binary search is a fundamental algorithm that every developer should master. While the concept seems simple—repeatedly divide a sorted array in half—interview candidates often stumble on implementation details. The problem asks us to find a target value in a sorted array with O(log n) time complexity, which immediately signals that binary search is required. What makes this problem interesting is that despite its apparent simplicity, there are subtle variations in implementation that can lead to off-by-one errors and infinite loops if not handled carefully.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have `nums = [1, 3, 5, 7, 9, 11]` and `target = 7`.

**Step 1:** Initialize pointers. We set `left = 0` (start of array) and `right = 5` (end of array). The middle index is `(0 + 5) // 2 = 2`. `nums[2] = 5`. Since `5 < 7` (target), we know the target must be in the right half.

**Step 2:** Update `left = middle + 1 = 3`. Now `left = 3`, `right = 5`. Middle is `(3 + 5) // 2 = 4`. `nums[4] = 9`. Since `9 > 7`, the target must be in the left half.

**Step 3:** Update `right = middle - 1 = 3`. Now `left = 3`, `right = 3`. Middle is `(3 + 3) // 2 = 3`. `nums[3] = 7`. We found the target! Return index 3.

If the target were `8` instead, we'd continue until `left > right`, then return `-1`. This visual shows how each comparison eliminates half of the remaining elements, giving us logarithmic time complexity.

## Brute Force Approach

The naive solution would be to iterate through the entire array from left to right, checking each element against the target. While this would work, it has O(n) time complexity, which violates the problem's requirement for O(log n) runtime.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def search_brute_force(nums, target):
    # Check every element in the array
    for i in range(len(nums)):
        if nums[i] == target:
            return i  # Found target, return index
    return -1  # Target not found
```

```javascript
// Time: O(n) | Space: O(1)
function searchBruteForce(nums, target) {
  // Check every element in the array
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) {
      return i; // Found target, return index
    }
  }
  return -1; // Target not found
}
```

```java
// Time: O(n) | Space: O(1)
public int searchBruteForce(int[] nums, int target) {
    // Check every element in the array
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) {
            return i;  // Found target, return index
        }
    }
    return -1;  // Target not found
}
```

</div>

This linear scan is inefficient for sorted arrays because it doesn't leverage the sorted property. When an array is sorted, we can make intelligent decisions about where to look next, which is exactly what binary search does.

## Optimal Solution

The optimal solution uses the classic binary search algorithm. The key insight is that because the array is sorted, we can compare the target with the middle element and eliminate half of the remaining search space with each comparison.

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def search(nums, target):
    # Initialize pointers to the start and end of the array
    left, right = 0, len(nums) - 1

    # Continue searching while there's a valid search space
    while left <= right:
        # Calculate middle index - using floor division for integer result
        # Using (left + right) // 2 avoids potential overflow issues
        mid = (left + right) // 2

        # Check if we found the target
        if nums[mid] == target:
            return mid  # Target found at index mid

        # If target is greater than middle element, search right half
        elif nums[mid] < target:
            left = mid + 1  # Move left pointer past mid

        # If target is smaller than middle element, search left half
        else:  # nums[mid] > target
            right = mid - 1  # Move right pointer before mid

    # If we exit the loop, target was not found
    return -1
```

```javascript
// Time: O(log n) | Space: O(1)
function search(nums, target) {
  // Initialize pointers to the start and end of the array
  let left = 0;
  let right = nums.length - 1;

  // Continue searching while there's a valid search space
  while (left <= right) {
    // Calculate middle index - using Math.floor for integer result
    // Using left + Math.floor((right - left) / 2) avoids potential overflow
    const mid = Math.floor((left + right) / 2);

    // Check if we found the target
    if (nums[mid] === target) {
      return mid; // Target found at index mid
    }

    // If target is greater than middle element, search right half
    if (nums[mid] < target) {
      left = mid + 1; // Move left pointer past mid
    }
    // If target is smaller than middle element, search left half
    else {
      right = mid - 1; // Move right pointer before mid
    }
  }

  // If we exit the loop, target was not found
  return -1;
}
```

```java
// Time: O(log n) | Space: O(1)
public int search(int[] nums, int target) {
    // Initialize pointers to the start and end of the array
    int left = 0;
    int right = nums.length - 1;

    // Continue searching while there's a valid search space
    while (left <= right) {
        // Calculate middle index - using (left + right) / 2
        // Using left + (right - left) / 2 avoids potential integer overflow
        int mid = left + (right - left) / 2;

        // Check if we found the target
        if (nums[mid] == target) {
            return mid;  // Target found at index mid
        }

        // If target is greater than middle element, search right half
        if (nums[mid] < target) {
            left = mid + 1;  // Move left pointer past mid
        }
        // If target is smaller than middle element, search left half
        else {
            right = mid - 1;  // Move right pointer before mid
        }
    }

    // If we exit the loop, target was not found
    return -1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**  
Each iteration of the while loop cuts the search space in half. Starting with n elements, after k iterations we have n/(2^k) elements remaining. The algorithm stops when n/(2^k) ≤ 1, which means k ≈ log₂(n). This logarithmic scaling is what makes binary search so efficient for large arrays.

**Space Complexity: O(1)**  
We only use a constant amount of extra space for the `left`, `right`, and `mid` pointers, regardless of the input size. The algorithm operates directly on the input array without creating additional data structures.

## Common Mistakes

1. **Incorrect loop condition (`left < right` instead of `left <= right`)**  
   Using `left < right` can cause the algorithm to miss the target when it's at the boundary. For example, if `nums = [5]` and `target = 5`, with `left < right` the loop wouldn't execute at all. Always use `left <= right` for inclusive bounds.

2. **Forgetting to update pointers correctly (`mid` instead of `mid ± 1`)**  
   When you find that `nums[mid]` is not the target, you must exclude `mid` from the next search space. Using `left = mid` or `right = mid` instead of `mid + 1` or `mid - 1` can cause infinite loops when `left` and `right` are adjacent.

3. **Integer overflow when calculating mid**  
   In languages with fixed-size integers (like Java), calculating `(left + right) / 2` can overflow when `left` and `right` are large. The safe approach is `left + (right - left) / 2`, which gives the same result without risk of overflow.

4. **Assuming the array is non-empty**  
   Always check edge cases. If `nums` is empty, `len(nums) - 1` or `nums.length - 1` would be `-1`, which could cause issues. The algorithm handles this correctly because with `left = 0` and `right = -1`, the loop condition `0 <= -1` is false, so we immediately return `-1`.

## When You'll See This Pattern

Binary search appears in many variations beyond simple array lookup:

1. **Search in a Sorted Array of Unknown Size** (LeetCode 702)  
   This problem extends binary search to an unbounded array. You first find bounds by exponentially increasing an index, then perform binary search within those bounds.

2. **Find Peak Element** (LeetCode 162)  
   Although not a sorted array, this problem uses binary search on conditions. You compare `nums[mid]` with `nums[mid+1]` to determine which direction to search.

3. **Search in Rotated Sorted Array** (LeetCode 33)  
   This adds complexity because the array is rotated. You first determine which half is properly sorted, then decide which half to search based on where the target could be.

4. **First Bad Version** (LeetCode 278)  
   This is essentially binary search with a boolean condition. Instead of comparing with a target value, you check if a version is "bad" and adjust search boundaries accordingly.

## Key Takeaways

1. **Binary search requires sorted data** - The algorithm relies on the sorted property to eliminate half the search space with each comparison. If the data isn't sorted, you must sort it first (O(n log n)) or use a different approach.

2. **The loop condition determines inclusivity** - `left <= right` means inclusive bounds (both ends are valid indices). `left < right` means right is exclusive. Choose based on whether you want to include the right boundary in your search.

3. **Binary search thinking extends beyond arrays** - The core idea of "divide and conquer based on a condition" applies to many problems, including finding roots of equations, optimization problems, and search in abstract spaces.

Related problems: [Search in a Sorted Array of Unknown Size](/problem/search-in-a-sorted-array-of-unknown-size), [Maximum Count of Positive Integer and Negative Integer](/problem/maximum-count-of-positive-integer-and-negative-integer)
