---
title: "Sorting Questions at Expedia: What to Expect"
description: "Prepare for Sorting interview questions at Expedia — patterns, difficulty breakdown, and study tips."
date: "2029-06-04"
category: "dsa-patterns"
tags: ["expedia", "sorting", "interview prep"]
---

If you're preparing for a software engineering interview at Expedia, you'll likely face a sorting question. With 8 out of their 54 tagged problems being sorting-related, it's a statistically significant portion of their technical repertoire. But this isn't about memorizing `array.sort()`. At Expedia, sorting is rarely the end goal; it's the critical first step that unlocks an efficient solution to a more complex, domain-specific problem. Think of it as the organizational principle that brings order to chaos, much like sorting flight options by price, duration, or departure time is fundamental to their core products. You won't just be asked to implement quicksort. You'll be asked to _use_ sorting strategically to solve problems related to scheduling, resource allocation, and data aggregation—scenarios that mirror the real-world challenges of managing travel inventory and user preferences.

## Specific Patterns Expedia Favors

Expedia's sorting problems lean heavily toward **applied sorting patterns** rather than algorithm implementation. The focus is on using sorting as a tool to transform the problem space, making a subsequent greedy, two-pointer, or interval-based solution possible. You'll almost never need to implement merge sort from scratch, but you will need to know how to sort custom objects and use the sorted order as a foundation.

The dominant patterns are:

1.  **Sorting + Greedy Algorithms:** This is the most common pattern. You sort the data based on a key attribute (e.g., end time, start value, price), which then allows you to make a series of locally optimal choices to arrive at a global optimum. Classic problems that fit this mold are about scheduling and selection.
2.  **Sorting + Two Pointers:** After sorting an array, the two-pointer technique becomes incredibly powerful for finding pairs, triplets, or eliminating overlaps. This is common in problems involving comparisons or merging datasets.
3.  **Custom Comparator Sorting:** This is a fundamental skill. You must be fluent in writing comparator functions or implementing the `Comparable` interface to sort objects by multiple fields or in a non-default order (e.g., sort by end time ascending, then by start time descending).

A quintessential Expedia-style problem is **Meeting Rooms II (LeetCode #253)**. The naive solution is tricky, but the efficient solution is a brilliant application of sorting. You don't sort the meetings directly; you sort the start times and end times into separate lists. This abstraction is key.

<div class="code-group">

```python
def minMeetingRooms(intervals):
    if not intervals:
        return 0

    start_times = sorted([i[0] for i in intervals])
    end_times = sorted([i[1] for i in intervals])

    start_ptr, end_ptr = 0, 0
    used_rooms = 0

    # Iterate through all start times
    while start_ptr < len(intervals):
        # If a meeting has ended by the time the current meeting starts, free a room
        if start_times[start_ptr] >= end_times[end_ptr]:
            used_rooms -= 1
            end_ptr += 1

        # We always need to allocate a room for the current starting meeting
        used_rooms += 1
        start_ptr += 1

    return used_rooms
# Time: O(N log N) for sorting. The single while loop is O(N).
# Space: O(N) for the two sorted lists.
```

```javascript
function minMeetingRooms(intervals) {
  if (intervals.length === 0) return 0;

  const starts = intervals.map((i) => i[0]).sort((a, b) => a - b);
  const ends = intervals.map((i) => i[1]).sort((a, b) => a - b);

  let startPtr = 0,
    endPtr = 0;
  let usedRooms = 0;

  while (startPtr < intervals.length) {
    // A meeting ends before the current one starts
    if (starts[startPtr] >= ends[endPtr]) {
      usedRooms--;
      endPtr++;
    }
    // Allocate a room for the current starting meeting
    usedRooms++;
    startPtr++;
  }
  return usedRooms;
}
// Time: O(N log N) | Space: O(N)
```

```java
public int minMeetingRooms(int[][] intervals) {
    if (intervals.length == 0) return 0;

    int[] startTimes = new int[intervals.length];
    int[] endTimes = new int[intervals.length];

    for (int i = 0; i < intervals.length; i++) {
        startTimes[i] = intervals[i][0];
        endTimes[i] = intervals[i][1];
    }

    Arrays.sort(startTimes);
    Arrays.sort(endTimes);

    int startPtr = 0, endPtr = 0;
    int usedRooms = 0;

    while (startPtr < intervals.length) {
        if (startTimes[startPtr] >= endTimes[endPtr]) {
            usedRooms--;
            endPtr++;
        }
        usedRooms++;
        startPtr++;
    }
    return usedRooms;
}
// Time: O(N log N) | Space: O(N)
```

</div>

Another excellent example is **Non-overlapping Intervals (LeetCode #435)**, which is a pure "Sorting + Greedy" problem. You sort by end time and greedily keep the interval that finishes earliest, removing overlapping ones. This pattern of "sort by end, then track the last valid end" is a workhorse.

## How to Prepare

Your preparation should focus on pattern recognition and implementation speed. Follow this process:

1.  **Identify the Core Problem:** Is it about scheduling, finding pairs, merging data, or selecting items? This hints at the pattern.
2.  **Ask: "Would sorting simplify this?"** If the problem involves comparisons, overlaps, or ordering constraints, the answer is almost always yes.
3.  **Determine the Sort Key:** What should you sort by? Start time, end time, value, or a computed property? This is the crux of the problem. For intervals, sorting by end time is most common for greedy selection.
4.  **Implement the Comparator:** Practice this until it's muscle memory. Know the syntax for your language cold.
5.  **Apply the Secondary Technique:** After sorting, walk through the sorted array. Are you using a greedy counter? Two pointers? A merge step?

Let's look at a **Sorting + Two Pointers** pattern, common in problems like **3Sum (LeetCode #15)**. The brute force is O(N³). Sorting (O(N log N)) enables an O(N²) solution by fixing one element and using a two-pointer sweep for the remaining array.

<div class="code-group">

```python
def threeSum(nums):
    nums.sort()
    result = []
    n = len(nums)

    for i in range(n - 2):
        # Skip duplicate values for the first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        # Two-pointer approach for the subarray after i
        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                # Move pointers and skip duplicates
                left += 1
                right -= 1
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
    return result
# Time: O(N^2) - The outer loop is O(N), the inner while is O(N).
# Space: O(log N) to O(N) depending on sorting algorithm. Output space is extra.
```

```javascript
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  const n = nums.length;

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1,
      right = n - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        // Skip duplicates for the second and third numbers
        while (left < right && nums[left] === nums[left - 1]) left++;
        while (left < right && nums[right] === nums[right + 1]) right--;
      }
    }
  }
  return result;
}
// Time: O(N^2) | Space: O(log N) to O(N) for sorting.
```

```java
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;

    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;

        int left = i + 1, right = n - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum < 0) {
                left++;
            } else if (sum > 0) {
                right--;
            } else {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++;
                right--;
                // Skip duplicates
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            }
        }
    }
    return result;
}
// Time: O(N^2) | Space: O(log N) to O(N) for sorting.
```

</div>

## How Expedia Tests Sorting vs Other Companies

Compared to FAANG companies, Expedia's sorting questions tend to be more **applied and less algorithmic**. At Google or Meta, you might get a question where you need to modify a sorting algorithm itself (e.g., "Sort colors" - Dutch National Flag) or implement a comparator for a very complex object. At Expedia, the sorting step is more straightforward, but the _reasoning_ for why you sort and what you do after is the real test.

The difficulty is typically in the **medium** range on LeetCode. The unique aspect is the **travel domain context**. While the underlying problem might be a standard "Merge Intervals" or "Meeting Schedules," it will often be dressed in terminology like "merging hotel stay periods," "allocating conference rooms for client meetings," or "finding optimal flight combinations." Don't let the context throw you. Strip it away to find the core pattern.

## Study Order

Tackle sorting topics in this logical progression:

1.  **Basic Sorting & Custom Comparators:** Before anything else, be able to sort an array of integers, strings, and custom objects in any language. This is non-negotiable.
2.  **Sorting + Greedy (Interval Problems):** Start with the most common pattern. Learn to sort intervals by start or end time and then apply a simple greedy pass. This builds intuition.
3.  **Sorting + Two Pointers:** Learn how sorting enables efficient pair-finding. This is a versatile pattern used beyond just sum problems.
4.  **Advanced Greedy with Custom Sorting:** Problems where the sort key isn't obvious, like "Largest Number (LeetCode #179)," where you sort strings via a custom concatenation comparator.
5.  **Sorting as a Pre-processing Step for Other Algorithms:** Recognize when sorting is used to enable efficient searching (Binary Search) or to simplify a Dynamic Programming problem (like "Longest Increasing Subsequence").

## Recommended Practice Order

Solve these problems in sequence to build competence:

1.  **Meeting Rooms (LeetCode #252):** The simplest "can you attend all meetings?" test. It's just sorting by start time and checking overlaps.
2.  **Merge Intervals (LeetCode #56):** The foundational interval problem. Sort by start time and merge.
3.  **Non-overlapping Intervals (LeetCode #435):** The classic "Sorting + Greedy" problem. Sort by end time.
4.  **Meeting Rooms II (LeetCode #253):** Uses the sophisticated two-list sorting technique shown above.
5.  **Two Sum (LeetCode #1):** First with a hash map (O(N)), then solve it with sorting + two pointers (O(N log N)) for practice.
6.  **3Sum (LeetCode #15):** The definitive sorting + two-pointer problem.
7.  **K Closest Points to Origin (LeetCode #973):** Practice sorting with a custom key (distance).
8.  **Largest Number (LeetCode #179):** A challenging but excellent problem that forces deep understanding of comparator logic.

Mastering these patterns will make Expedia's sorting questions feel less like puzzles and more like a clear, methodical process. Remember: sort first, think later.

[Practice Sorting at Expedia](/company/expedia/sorting)
