---
title: "How to Solve Maximum Count of Positive Integer and Negative Integer — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Count of Positive Integer and Negative Integer. Easy difficulty, 74.3% acceptance rate. Topics: Array, Binary Search, Counting."
date: "2027-09-26"
category: "dsa-patterns"
tags:
  [
    "maximum-count-of-positive-integer-and-negative-integer",
    "array",
    "binary-search",
    "counting",
    "easy",
  ]
---

# How to Solve Maximum Count of Positive Integer and Negative Integer

This problem asks us to find the maximum between the count of positive integers and the count of negative integers in a sorted array. While it seems straightforward, the key insight is that the array is sorted in non-decreasing order, which allows us to use binary search to find the transition point between negative and positive numbers efficiently. The challenge lies in correctly handling zeros and edge cases while leveraging the sorted property.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the input array: `[-3, -2, -1, 0, 0, 1, 2]`

**Step 1: Understand the goal**
We need to find:

- `neg`: count of negative integers (numbers < 0)
- `pos`: count of positive integers (numbers > 0)
- Return `max(neg, pos)`

**Step 2: Manual counting**
Looking at the array: `[-3, -2, -1, 0, 0, 1, 2]`

- Negative integers: -3, -2, -1 → 3 negatives
- Positive integers: 1, 2 → 2 positives
- Zeros: 0, 0 → 2 zeros (neither positive nor negative)

**Step 3: The sorted property advantage**
Since the array is sorted, all negatives come first, then zeros (if any), then positives. We can find:

1. The first index where element ≥ 0 → this gives us the count of negatives
2. The first index where element > 0 → this gives us the count of positives

For our example:

- First index where element ≥ 0: index 3 (value 0) → 3 negatives (indices 0, 1, 2)
- First index where element > 0: index 5 (value 1) → 2 positives (indices 5, 6)

**Step 4: Calculate the answer**
`max(3, 2) = 3`

This visual walkthrough shows us that binary search can efficiently find these transition points in O(log n) time instead of O(n) linear scanning.

## Brute Force Approach

The most straightforward approach is to iterate through the entire array once, counting negatives and positives separately:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumCount(nums):
    neg = 0
    pos = 0

    for num in nums:
        if num < 0:
            neg += 1
        elif num > 0:
            pos += 1

    return max(neg, pos)
```

```javascript
// Time: O(n) | Space: O(1)
function maximumCount(nums) {
  let neg = 0;
  let pos = 0;

  for (let num of nums) {
    if (num < 0) {
      neg++;
    } else if (num > 0) {
      pos++;
    }
  }

  return Math.max(neg, pos);
}
```

```java
// Time: O(n) | Space: O(1)
public int maximumCount(int[] nums) {
    int neg = 0;
    int pos = 0;

    for (int num : nums) {
        if (num < 0) {
            neg++;
        } else if (num > 0) {
            pos++;
        }
    }

    return Math.max(neg, pos);
}
```

</div>

**Why this isn't optimal:**
While this solution works with O(n) time complexity and O(1) space, it doesn't take advantage of the fact that the array is sorted. When an interviewer gives you a sorted array, they're often hinting that you can do better than linear time. The brute force approach examines every element, but we can use binary search to find the transition points in O(log n) time.

## Optimal Solution

The optimal solution uses binary search to find two key positions:

1. The first index where the element is ≥ 0 (end of negative section)
2. The first index where the element is > 0 (start of positive section)

From these positions, we can calculate:

- `neg` = index of first element ≥ 0 (which equals the count of negatives)
- `pos` = n - index of first element > 0 (where n is array length)

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def maximumCount(nums):
    n = len(nums)

    # Find the first index where element >= 0
    # This gives us the count of negative numbers
    left, right = 0, n
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] < 0:
            left = mid + 1  # Move right, negative section continues
        else:
            right = mid     # Move left, found potential boundary

    neg_count = left  # All indices before 'left' contain negatives

    # Find the first index where element > 0
    # This gives us the starting point of positive numbers
    left, right = 0, n
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] <= 0:
            left = mid + 1  # Move right, still in zero/negative section
        else:
            right = mid     # Move left, found potential boundary

    pos_count = n - left  # All indices from 'left' to end contain positives

    return max(neg_count, pos_count)
```

```javascript
// Time: O(log n) | Space: O(1)
function maximumCount(nums) {
  const n = nums.length;

  // Find the first index where element >= 0
  // This gives us the count of negative numbers
  let left = 0,
    right = n;
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] < 0) {
      left = mid + 1; // Move right, negative section continues
    } else {
      right = mid; // Move left, found potential boundary
    }
  }

  const negCount = left; // All indices before 'left' contain negatives

  // Find the first index where element > 0
  // This gives us the starting point of positive numbers
  left = 0;
  right = n;
  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] <= 0) {
      left = mid + 1; // Move right, still in zero/negative section
    } else {
      right = mid; // Move left, found potential boundary
    }
  }

  const posCount = n - left; // All indices from 'left' to end contain positives

  return Math.max(negCount, posCount);
}
```

```java
// Time: O(log n) | Space: O(1)
public int maximumCount(int[] nums) {
    int n = nums.length;

    // Find the first index where element >= 0
    // This gives us the count of negative numbers
    int left = 0, right = n;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < 0) {
            left = mid + 1;  // Move right, negative section continues
        } else {
            right = mid;     // Move left, found potential boundary
        }
    }

    int negCount = left;  // All indices before 'left' contain negatives

    // Find the first index where element > 0
    // This gives us the starting point of positive numbers
    left = 0;
    right = n;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] <= 0) {
            left = mid + 1;  // Move right, still in zero/negative section
        } else {
            right = mid;     // Move left, found potential boundary
        }
    }

    int posCount = n - left;  // All indices from 'left' to end contain positives

    return Math.max(negCount, posCount);
}
```

</div>

**Key implementation details:**

1. We use `left < right` instead of `left <= right` to avoid infinite loops
2. We initialize `right = n` (not `n-1`) because the boundary could be at the end
3. The first binary search looks for `nums[mid] < 0` to find the end of negatives
4. The second binary search looks for `nums[mid] <= 0` to skip zeros
5. We calculate `pos_count` as `n - left` because positives start at index `left`

## Complexity Analysis

**Time Complexity: O(log n)**

- We perform two binary searches, each taking O(log n) time
- Even though we have two binary searches, O(2 log n) simplifies to O(log n)
- This is significantly faster than the O(n) brute force for large arrays

**Space Complexity: O(1)**

- We only use a constant amount of extra space (variables for indices and counts)
- No additional data structures are created

## Common Mistakes

1. **Forgetting to handle zeros correctly**: Some candidates try to find the first positive number but forget that zeros are neither positive nor negative. The second binary search must use `> 0` not `>= 0`.

2. **Off-by-one errors in binary search**: Using `left <= right` instead of `left < right` can cause infinite loops. Also, initializing `right = n-1` instead of `right = n` can miss cases where all elements are negative or all are positive.

3. **Incorrect calculation of counts**: After finding boundaries, some candidates miscalculate:
   - `neg_count` should be the index of first element ≥ 0 (not the index of last negative)
   - `pos_count` should be `n - index_of_first_positive` (not the index itself)

4. **Using linear search when binary search is expected**: While the brute force solution is acceptable for an easy problem, interviewers appreciate candidates who recognize and leverage the sorted property with binary search.

## When You'll See This Pattern

This problem uses the "binary search for boundary" pattern, which appears in many LeetCode problems:

1. **First Bad Version (Easy)**: Find the first version that's bad in a sorted sequence of good then bad versions. The pattern is identical: binary search for the first element satisfying a condition.

2. **Search Insert Position (Easy)**: Find the index where a target should be inserted in a sorted array. This is essentially finding the first position where element ≥ target.

3. **Find First and Last Position of Element in Sorted Array (Medium)**: Find the first and last occurrence of a target, which requires two binary searches similar to our solution.

4. **Count Negative Numbers in a Sorted Matrix (Easy)**: This is essentially the 2D version of our problem, where each row is sorted and you need to count negatives efficiently.

The core pattern is: **When you need to find a boundary in a sorted array (first element satisfying a condition, last element before a change, etc.), binary search is your tool of choice.**

## Key Takeaways

1. **Sorted arrays beg for binary search**: Whenever you see "sorted" in the problem description, consider if binary search can improve time complexity from O(n) to O(log n).

2. **Boundary-finding binary search**: Learn the pattern for finding the first element that satisfies a condition. The key is adjusting the search range based on whether the midpoint satisfies the condition.

3. **Two binary searches for two boundaries**: When you need to find both the start and end of a range (like negative and positive sections), you can use two separate binary searches with different conditions.

4. **Test edge cases**: Always test with arrays containing all negatives, all positives, all zeros, and mixed cases to ensure your boundary conditions are correct.

Related problems: [Binary Search](/problem/binary-search), [Count Negative Numbers in a Sorted Matrix](/problem/count-negative-numbers-in-a-sorted-matrix)
