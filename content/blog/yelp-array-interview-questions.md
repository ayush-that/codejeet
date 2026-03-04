---
title: "Array Questions at Yelp: What to Expect"
description: "Prepare for Array interview questions at Yelp — patterns, difficulty breakdown, and study tips."
date: "2031-01-05"
category: "dsa-patterns"
tags: ["yelp", "array", "interview prep"]
---

Array questions make up nearly half of Yelp’s technical interview question pool (12 out of 27 total). This isn’t a coincidence. Yelp’s core products—search, reviews, business listings, and maps—rely heavily on processing and organizing lists of data. Whether you’re filtering nearby restaurants, ranking search results, or analyzing user check-ins, you’re working with sequences. Mastering array manipulation is therefore non-negotiable for passing their coding interviews.

## What to Expect — Types of Problems

Yelp’s array questions tend to focus on practical, data-centric problems rather than abstract algorithmic puzzles. You can generally expect them to fall into a few key categories:

- **Sorting and Searching:** This is the most common theme. Expect questions that involve finding, filtering, or ordering elements based on specific criteria (e.g., "find the k closest businesses," "merge overlapping intervals").
- **Two-Pointer Technique:** Many problems involve comparing or processing pairs of elements within an array. The two-pointer technique is essential for solving these efficiently, often turning an O(n²) brute-force solution into O(n).
- **Hash Map for Lookup:** A frequent pattern is using a hash map (dictionary or object) to store elements or counts for O(1) lookups. This is crucial for problems involving pairs, duplicates, or frequency counts.
- **Sliding Window:** For questions dealing with contiguous subarrays that meet a certain condition (e.g., longest substring, maximum average), the sliding window technique is the standard approach.

The problems are typically framed around Yelp’s domain, such as manipulating lists of business IDs, user reviews, or geographic coordinates.

## How to Prepare — Study Tips with One Code Example

Focus on understanding the underlying patterns, not just memorizing solutions. For each problem type above, learn the standard algorithmic approach and practice applying it to different scenarios.

A critical pattern to master is the **Two-Pointer Technique**. It’s versatile and appears frequently. Let’s look at a classic example: determining if a sorted array contains two numbers that sum to a specific target.

<div class="code-group">

```python
def has_pair_with_sum(sorted_arr, target):
    left, right = 0, len(sorted_arr) - 1
    while left < right:
        current_sum = sorted_arr[left] + sorted_arr[right]
        if current_sum == target:
            return True
        elif current_sum < target:
            left += 1  # Need a larger sum
        else:
            right -= 1  # Need a smaller sum
    return False
```

```javascript
function hasPairWithSum(sortedArr, target) {
  let left = 0;
  let right = sortedArr.length - 1;
  while (left < right) {
    const currentSum = sortedArr[left] + sortedArr[right];
    if (currentSum === target) {
      return true;
    } else if (currentSum < target) {
      left++; // Need a larger sum
    } else {
      right--; // Need a smaller sum
    }
  }
  return false;
}
```

```java
public boolean hasPairWithSum(int[] sortedArr, int target) {
    int left = 0;
    int right = sortedArr.length - 1;
    while (left < right) {
        int currentSum = sortedArr[left] + sortedArr[right];
        if (currentSum == target) {
            return true;
        } else if (currentSum < target) {
            left++; // Need a larger sum
        } else {
            right--; // Need a smaller sum
        }
    }
    return false;
}
```

</div>

This approach runs in O(n) time with O(1) space, far more efficient than a nested loop. Practice identifying when a sorted (or sortable) array and a pair-based condition make this technique applicable.

## Recommended Practice Order

1.  Start with fundamental sorting and searching (Binary Search).
2.  Move to two-pointer problems (pair sums, removing duplicates).
3.  Practice hash map-based problems (finding duplicates, two-sum variants).
4.  Tackle sliding window problems (maximum subarray, longest substring).
5.  Finally, combine patterns for more complex challenges (like interval merging).

Consistently practice explaining your thought process out loud as you solve, as communication is a key part of the interview.

[Practice Array at Yelp](/company/yelp/array)
