---
title: "Sorting Questions at Agoda: What to Expect"
description: "Prepare for Sorting interview questions at Agoda — patterns, difficulty breakdown, and study tips."
date: "2029-09-22"
category: "dsa-patterns"
tags: ["agoda", "sorting", "interview prep"]
---

Sorting questions appear in nearly a quarter of Agoda's technical interview problems (11 out of 46 total). This isn't about asking you to implement Quicksort from memory. It's because sorting is a fundamental preprocessing step that transforms unsolvable or inefficient problems into tractable ones. At a data-intensive travel platform like Agoda, efficiently organizing and querying vast datasets—user preferences, hotel listings, flight schedules, pricing tiers—is a daily engineering task. Your ability to recognize when and how to sort data to unlock an optimal solution directly reflects your capacity to write performant, scalable code for their systems.

## What to Expect — Types of Problems

Agoda's sorting questions typically fall into two categories. First, **direct application problems** where sorting is the core operation. This includes tasks like merging sorted lists, finding minimum/maximum differences between elements, or custom sorting based on specific object properties (e.g., sorting hotel objects by price, then by rating). The second, more common category is **sorting as a key step**. Here, the insight is that sorting the input data first creates a structure that makes the main algorithm possible or efficient. Classic patterns include the "two-pointer" technique after sorting (for problems like finding pairs or triplets with a certain sum) and "greedy interval" problems (like meeting room scheduling or merging intervals), where sorting by start or end time is the essential first move.

## How to Prepare — Study Tips with Code Example

Master the standard library sorting functions and their APIs for custom comparisons. In Python, know `list.sort()` and `sorted()` with `key` and `lambda`. In JavaScript, understand `array.sort()` and its comparator function. In Java, be fluent with `Arrays.sort()` and `Collections.sort()` using `Comparator`. The critical skill is quickly writing a correct comparator.

The most frequent pattern is using sorting to enable a two-pointer solution. Consider the problem: "Given an array of integers, find all unique pairs that sum to a target."

**The brute-force approach is O(n²).** The optimal approach sorts first (O(n log n)), then uses two pointers to find pairs in a single pass (O(n)). The sorting step is what makes the efficient two-pointer scan possible.

<div class="code-group">

```python
def two_sum_pairs(nums, target):
    nums.sort()
    left, right = 0, len(nums) - 1
    pairs = []
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            pairs.append([nums[left], nums[right]])
            # Move pointers past duplicates
            left += 1
            right -= 1
            while left < right and nums[left] == nums[left - 1]:
                left += 1
            while left < right and nums[right] == nums[right + 1]:
                right -= 1
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return pairs
```

```javascript
function twoSumPairs(nums, target) {
  nums.sort((a, b) => a - b);
  let left = 0;
  let right = nums.length - 1;
  const pairs = [];
  while (left < right) {
    const currentSum = nums[left] + nums[right];
    if (currentSum === target) {
      pairs.push([nums[left], nums[right]]);
      left++;
      right--;
      while (left < right && nums[left] === nums[left - 1]) left++;
      while (left < right && nums[right] === nums[right + 1]) right--;
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }
  return pairs;
}
```

```java
import java.util.*;

public class Solution {
    public List<List<Integer>> twoSumPairs(int[] nums, int target) {
        Arrays.sort(nums);
        int left = 0, right = nums.length - 1;
        List<List<Integer>> pairs = new ArrayList<>();
        while (left < right) {
            int currentSum = nums[left] + nums[right];
            if (currentSum == target) {
                pairs.add(Arrays.asList(nums[left], nums[right]));
                left++;
                right--;
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            } else if (currentSum < target) {
                left++;
            } else {
                right--;
            }
        }
        return pairs;
    }
}
```

</div>

## Recommended Practice Order

1.  **Master Comparators:** Practice custom sorting (objects, multi-key sorts).
2.  **Basic Patterns:** Solve problems where sorting is the primary solution (e.g., Kth Largest Element, Meeting Rooms).
3.  **Two-Pointer with Sort:** Drill problems like Two Sum II (sorted input), 3Sum, and Remove Duplicates.
4.  **Greedy Intervals:** Practice Merge Intervals, Non-overlapping Intervals, and similar problems.
5.  **Agoda-Specific:** Finally, tackle the actual sorting problems from Agoda's question bank to familiarize yourself with their style and difficulty.

[Practice Sorting at Agoda](/company/agoda/sorting)
