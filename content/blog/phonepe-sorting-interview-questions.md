---
title: "Sorting Questions at PhonePe: What to Expect"
description: "Prepare for Sorting interview questions at PhonePe — patterns, difficulty breakdown, and study tips."
date: "2028-06-15"
category: "dsa-patterns"
tags: ["phonepe", "sorting", "interview prep"]
---

PhonePe’s technical interviews are known for being intensely practical. With 24 of their 102 coding problems tagged under Sorting, you might assume they’re obsessed with algorithms like quicksort. The reality is more nuanced. Sorting isn’t a primary focus in isolation; it’s a **fundamental utility**. At a company processing billions of digital payment transactions, the core engineering challenges revolve around data aggregation, reconciliation, fraud detection, and real-time analytics. All of these require efficiently ordering, merging, and comparing massive datasets. Therefore, PhonePe doesn’t test if you can implement merge sort from scratch. They test if you can recognize when sorting a dataset is the key to unlocking an optimal solution to a complex, real-world-adjacent problem. In interviews, a sorting step is often the clever insight that transforms an O(n²) brute force into an elegant O(n log n) solution.

## Specific Patterns PhonePe Favors

PhonePe’s sorting problems rarely stand alone. They are almost always **Sorting + X**, where X is another core pattern. The company’s problem set reveals a clear preference for two hybrid patterns:

1.  **Sorting + Two-Pointer / Sliding Window:** This is the most frequent combination. The classic scenario: you have an array, and you need to find pairs, triplets, or subarrays that satisfy a condition (like a sum, difference, or target value). Sorting the array first brings order, allowing you to use two pointers to find answers in linear time after the O(n log n) sort. This pattern is essential for problems like finding unique triplets, or the pair with the smallest difference.
2.  **Sorting + Greedy Intervals:** Many "scheduling" or "resource allocation" problems map perfectly to payment batch processing or meeting room scheduling. The greedy approach often requires sorting the data by start time or end time as the critical first step to finding the optimal number of non-overlapping intervals or the minimum points to cover all intervals.

You will almost never see a "pure" sorting implementation question. Instead, expect problems like **Merge Intervals (#56)**, **Non-overlapping Intervals (#435)**, or **3Sum (#15)**, where sorting is the enabling step for a more advanced technique.

## How to Prepare

Your preparation should center on the "Sorting + X" mindset. Don't just practice sorting algorithms; practice identifying when sorting is the key preprocessing step. For the Two-Pointer pattern, the mental checklist is: "If I need to find a relationship between elements (like pairs summing to K), would sorting help me use two pointers instead of a hash map?" For the Greedy Intervals pattern, the question is: "Is this about finding overlaps or minimizing conflicts? If yes, I should probably sort by one dimension first."

Let's look at a cornerstone example: finding all unique triplets that sum to zero (3Sum). The brute force is O(n³). The optimal solution is Sorting + Two-Pointer.

<div class="code-group">

```python
def threeSum(nums):
    """
    Finds all unique triplets in the array that sum to zero.
    Approach: Sort + Two-Pointer.
    Time: O(n^2) - O(n log n) for sort, then O(n^2) for nested loops.
    Space: O(1) or O(n) depending on sort implementation (ignoring output storage).
    """
    nums.sort()
    result = []
    n = len(nums)

    for i in range(n - 2):
        # Skip duplicate values for the first element
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        # Two-pointer technique for the remaining subarray
        left, right = i + 1, n - 1
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                # Found a valid triplet
                result.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                # Skip duplicates for the second element
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                # Skip duplicates for the third element (right pointer moves inward)
    return result
```

```javascript
function threeSum(nums) {
  /**
   * Finds all unique triplets in the array that sum to zero.
   * Approach: Sort + Two-Pointer.
   * Time: O(n^2) - O(n log n) for sort, then O(n^2) for nested loops.
   * Space: O(1) or O(n) depending on sort implementation (ignoring output storage).
   */
  nums.sort((a, b) => a - b);
  const result = [];
  const n = nums.length;

  for (let i = 0; i < n - 2; i++) {
    // Skip duplicate values for the first element
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = n - 1;
    while (left < right) {
      const total = nums[i] + nums[left] + nums[right];
      if (total < 0) {
        left++;
      } else if (total > 0) {
        right--;
      } else {
        // Found a valid triplet
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        // Skip duplicates for the second element
        while (left < right && nums[left] === nums[left - 1]) {
          left++;
        }
      }
    }
  }
  return result;
}
```

```java
public List<List<Integer>> threeSum(int[] nums) {
    /**
     * Finds all unique triplets in the array that sum to zero.
     * Approach: Sort + Two-Pointer.
     * Time: O(n^2) - O(n log n) for sort, then O(n^2) for nested loops.
     * Space: O(1) or O(n) depending on sort implementation (ignoring output storage).
     */
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;

    for (int i = 0; i < n - 2; i++) {
        // Skip duplicate values for the first element
        if (i > 0 && nums[i] == nums[i - 1]) continue;

        int left = i + 1, right = n - 1;
        while (left < right) {
            int total = nums[i] + nums[left] + nums[right];
            if (total < 0) {
                left++;
            } else if (total > 0) {
                right--;
            } else {
                // Found a valid triplet
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++;
                right--;
                // Skip duplicates for the second element
                while (left < right && nums[left] == nums[left - 1]) {
                    left++;
                }
            }
        }
    }
    return result;
}
```

</div>

For the Greedy Intervals pattern, the solution to **Non-overlapping Intervals (#435)** is a perfect example. The greedy choice is to keep the interval with the earliest end time, which requires sorting by end time.

<div class="code-group">

```python
def eraseOverlapIntervals(intervals):
    """
    Finds the minimum number of intervals to remove to make the rest non-overlapping.
    Approach: Sort by end time + Greedy.
    Time: O(n log n) for sorting.
    Space: O(1) (ignoring sort memory).
    """
    if not intervals:
        return 0

    # Sort intervals by their end time
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end = intervals[0][1]

    for start, end in intervals[1:]:
        if start < last_end:
            # Overlap found, we need to remove this interval
            count += 1
        else:
            # No overlap, update the last_end to current end
            last_end = end
    return count
```

```javascript
function eraseOverlapIntervals(intervals) {
  /**
   * Finds the minimum number of intervals to remove to make the rest non-overlapping.
   * Approach: Sort by end time + Greedy.
   * Time: O(n log n) for sorting.
   * Space: O(1) (ignoring sort memory).
   */
  if (intervals.length === 0) return 0;

  // Sort intervals by their end time
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let lastEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];
    if (start < lastEnd) {
      // Overlap found, we need to remove this interval
      count++;
    } else {
      // No overlap, update the lastEnd to current end
      lastEnd = end;
    }
  }
  return count;
}
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    /**
     * Finds the minimum number of intervals to remove to make the rest non-overlapping.
     * Approach: Sort by end time + Greedy.
     * Time: O(n log n) for sorting.
     * Space: O(1) (ignoring sort memory).
     */
    if (intervals.length == 0) return 0;

    // Sort intervals by their end time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int lastEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int start = intervals[i][0];
        int end = intervals[i][1];
        if (start < lastEnd) {
            // Overlap found, we need to remove this interval
            count++;
        } else {
            // No overlap, update the lastEnd to current end
            lastEnd = end;
        }
    }
    return count;
}
```

</div>

## How PhonePe Tests Sorting vs Other Companies

Compared to other major tech companies, PhonePe's sorting questions are less about algorithmic minutiae and more about **applied problem-solving**.

- **vs. FAANG (Meta, Google):** FAANG interviews might delve deeper into the theoretical trade-offs of sorting algorithms (stable vs. unstable, in-place vs. out-of-place) or ask you to implement a specific sort like quicksort partition. PhonePe is more likely to assume you know the standard library `sort()` function and focus on the higher-level pattern.
- **vs. Service-Based/Consulting Firms:** These interviews might ask more basic, standalone sorting questions. PhonePe's problems are almost always a step up in integration, requiring you to combine sorting with another technique to solve a business-logic-like scenario (e.g., "merge transaction logs" or "schedule payment batches").
- **The PhonePe Differentiator:** The context often hints at scalability. You might be nudged to discuss why O(n log n) is acceptable, or how you'd handle the data if it were streamed and couldn't be fully sorted in memory. This reflects their large-scale, data-intensive engineering environment.

## Study Order

Tackle sorting in this logical progression:

1.  **Master the Standard Library Sort:** Know exactly how to sort arrays, lists, and custom objects (by a key, by multiple keys) in your chosen language. This is your tool; be fluent with it.
2.  **Learn the Two-Pointer Technique on Sorted Arrays:** Start with the absolute basics like **Two Sum II - Input Array Is Sorted (#167)**. This builds the muscle memory for the "sort first, then point" approach.
3.  **Tackle the Classic Hybrids:** Move to the flagship problems: **3Sum (#15)** and **Merge Intervals (#56)**. These are the blueprints for the two most common PhoneFe patterns.
4.  **Practice Greedy Interval Problems:** Deepen your understanding with **Non-overlapping Intervals (#435)** and **Meeting Rooms II (#253)**. The sorting criteria (by start vs. by end) is the key insight here.
5.  **Explore Advanced Integration:** Finally, look at problems where sorting is a subtler enabler, like **Top K Frequent Elements (#347)** (where you might sort a frequency map) or **Queue Reconstruction by Height (#406)**. This prepares you for unexpected applications.

## Recommended Practice Order

Solve these problems in sequence to build competence:

1.  **Two Sum II - Input Array Is Sorted (#167)** - Warm-up for the two-pointer pattern.
2.  **3Sum (#15)** - The essential Sorting + Two-Pointer problem.
3.  **Merge Intervals (#56)** - The foundational interval problem.
4.  **Non-overlapping Intervals (#435)** - Applies the greedy interval pattern.
5.  **Meeting Rooms II (#253)** - A slight twist, often solved with sorting + a min-heap.
6.  **Sort Colors (#75)** - A classic in-place sort (Dutch National Flag problem), tests understanding of partitioning.
7.  **Kth Largest Element in an Array (#215)** - Connects sorting to selection algorithms (QuickSelect).

By following this path, you won't just learn sorting algorithms; you'll develop the instinct to see when sorting is the lever that simplifies a complex PhonePe-style problem.

[Practice Sorting at PhonePe](/company/phonepe/sorting)
