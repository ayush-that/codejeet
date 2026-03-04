---
title: "Binary Search Questions at Salesforce: What to Expect"
description: "Prepare for Binary Search interview questions at Salesforce — patterns, difficulty breakdown, and study tips."
date: "2027-10-03"
category: "dsa-patterns"
tags: ["salesforce", "binary-search", "interview prep"]
---

Binary Search is a core algorithm at Salesforce, appearing in 21 of their 189 technical interview questions. This prevalence signals its importance for solving problems involving large, sorted datasets—a common scenario when dealing with customer records, transaction logs, or time-series analytics. Mastering it demonstrates you can write efficient, scalable code, a critical skill for a company handling massive data volumes.

## What to Expect — Types of Problems

Salesforce’s binary search questions typically extend beyond checking for an element in a sorted array. You should prepare for these common variations:

1.  **Search in Modified/Rotated Sorted Arrays:** Finding a target in an array that has been rotated at an unknown pivot point.
2.  **Finding Boundaries:** Applying binary search to find the first or last occurrence of a target, or the insertion point for an element (like Python's `bisect` module).
3.  **Search in a Sorted 2D Matrix:** Treating a sorted matrix as a flattened 1D array to locate a value.
4.  **Answer on a Sorted Range:** Using binary search to find a specific value (like the _Kth_ smallest element) or an optimal value (like a capacity or threshold) within a defined, sorted range of possible answers.

These problems test your ability to adapt the core `while (left <= right)` loop logic to new constraints.

## How to Prepare — Study Tips with One Code Example

Focus on the pattern, not memorization. The core pattern involves maintaining `left` and `right` pointers, calculating a `mid` index, and comparing the element at `mid` to your target to decide which half to discard. Always verify your logic works for edge cases: empty input, single element, and duplicates.

A key pattern is **finding the first occurrence of a target** in a sorted array with duplicates. When `nums[mid] == target`, you cannot return immediately. Instead, you must continue searching the left half to see if an earlier occurrence exists.

<div class="code-group">

```python
def find_first_occurrence(nums, target):
    left, right = 0, len(nums) - 1
    first_index = -1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            first_index = mid
            right = mid - 1  # Search left for an earlier occurrence
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return first_index
```

```javascript
function findFirstOccurrence(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  let firstIndex = -1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) {
      firstIndex = mid;
      right = mid - 1; // Search left for an earlier occurrence
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return firstIndex;
}
```

```java
public int findFirstOccurrence(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    int firstIndex = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            firstIndex = mid;
            right = mid - 1; // Search left for an earlier occurrence
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return firstIndex;
}
```

</div>

## Recommended Practice Order

Build your skills progressively:

1.  **Standard Binary Search:** Implement basic search and verify you handle edge cases.
2.  **Search Boundaries:** Practice finding the first/last position, as shown above.
3.  **Modified Arrays:** Solve search in a rotated sorted array.
4.  **2D Search:** Apply the pattern to a sorted matrix.
5.  **Answer on a Range:** Tackle problems where you binary search for an _answer_ (like "Koko Eating Bananas").

This order solidifies the fundamental loop before adding complexity.

[Practice Binary Search at Salesforce](/company/salesforce/binary-search)
