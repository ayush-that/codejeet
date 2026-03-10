---
title: "Sorting Questions at Coupang: What to Expect"
description: "Prepare for Sorting interview questions at Coupang — patterns, difficulty breakdown, and study tips."
date: "2029-06-24"
category: "dsa-patterns"
tags: ["coupang", "sorting", "interview prep"]
---

# Sorting Questions at Coupang: What to Expect

If you're preparing for a Coupang interview, you've probably noticed their data shows 8 Sorting questions out of 53 total — that's about 15% of their problem pool. This isn't a coincidence. While many companies treat sorting as a basic warm-up topic, Coupang frequently uses it as a vehicle to assess deeper algorithmic thinking, particularly around optimization and real-world data processing scenarios. In a logistics and e-commerce giant where sorting orders, inventory, delivery routes, and search results is literally the business, sorting algorithms aren't just academic exercises — they're daily operations.

What makes Coupang's sorting questions distinct is that they rarely ask you to implement quicksort from scratch. Instead, they embed sorting concepts into problems where the optimal solution requires recognizing that sorting transforms an otherwise complex problem into a tractable one. The sorting itself is often just the setup — the real test is what you do with the sorted data.

## Specific Patterns Coupang Favors

Coupang's sorting problems typically fall into three categories:

1. **Interval Problems with Sorting as the Enabler**: These questions present overlapping intervals (meetings, orders, time windows) where sorting by start or end time reveals the structure needed to solve them. Think "Merge Intervals" (#56) or "Meeting Rooms II" (#253) style problems, but often with a Coupang-specific twist like delivery time windows or warehouse slot management.

2. **Greedy Algorithms Requiring Pre-sorting**: Many greedy solutions only work if you process items in a specific order. Coupang loves problems where sorting creates the optimal processing sequence. For example, "Non-overlapping Intervals" (#435) asks you to remove the minimum number of intervals to make the rest non-overlapping — the greedy solution only works if you sort by end time first.

3. **Two-Pointer Techniques on Sorted Arrays**: Once an array is sorted, two-pointer techniques become powerful. Coupang frequently tests variations where you need to find pairs meeting certain criteria after sorting, similar to "Two Sum II" (#167) but often with additional constraints.

Here's a classic example of the interval pattern that appears frequently in variations:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on implementation
def merge_intervals(intervals):
    """
    Merge overlapping intervals (LeetCode #56).
    The key insight: sort by start time first.
    """
    if not intervals:
        return []

    # Sort by start time - this is the crucial preprocessing step
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    for current in intervals[1:]:
        last = merged[-1]

        # If current interval overlaps with last merged interval
        if current[0] <= last[1]:
            # Merge them by updating the end time
            last[1] = max(last[1], current[1])
        else:
            # No overlap, add as new interval
            merged.append(current)

    return merged
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on implementation
function mergeIntervals(intervals) {
  if (!intervals.length) return [];

  // Sort by start time
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = merged[merged.length - 1];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on implementation
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;

    // Sort by start time
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);

    for (int i = 1; i < intervals.length; i++) {
        int[] current = intervals[i];
        int[] last = merged.get(merged.size() - 1);

        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.add(current);
        }
    }

    return merged.toArray(new int[merged.size()][]);
}
```

</div>

## How to Prepare

When preparing for Coupang's sorting questions, focus on these three skills:

1. **Recognizing when sorting helps**: The hardest part isn't implementing the sort, but realizing that sorting the input first simplifies the problem. Ask yourself: "Would processing these items in a specific order make this easier?"

2. **Choosing the right sorting key**: In interval problems, should you sort by start time or end time? In greedy problems, what metric maximizes your objective? This decision often determines whether your solution works.

3. **Combining sorting with other techniques**: Sorting alone rarely solves the problem. You typically need to combine it with two-pointers, greedy algorithms, or linear scans.

Here's an example of combining sorting with the two-pointer technique:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1)
def two_sum_sorted(numbers, target):
    """
    Two Sum II - Input array is sorted (LeetCode #167).
    Demonstrates two-pointer technique on sorted data.
    """
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left + 1, right + 1]  # 1-indexed
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return []  # No solution
```

```javascript
// Time: O(n log n) | Space: O(1)
function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const currentSum = numbers[left] + numbers[right];

    if (currentSum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (currentSum < target) {
      left++;
    } else {
      right--;
    }
  }

  return []; // No solution
}
```

```java
// Time: O(n log n) | Space: O(1)
public int[] twoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;

    while (left < right) {
        int currentSum = numbers[left] + numbers[right];

        if (currentSum == target) {
            return new int[]{left + 1, right + 1};  // 1-indexed
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }

    return new int[0];  // No solution
}
```

</div>

## How Coupang Tests Sorting vs Other Companies

Compared to other tech companies, Coupang's sorting questions have distinct characteristics:

- **More applied, less theoretical**: While Google might ask you to derive the time complexity of mergesort, Coupang is more likely to present a logistics problem that can be solved by sorting delivery windows. The sorting is a means to an end, not the end itself.

- **Medium difficulty dominates**: Coupang's sorting questions tend to be LeetCode Medium level. They want to see if you can apply sorting creatively, not just implement it.

- **Business context matters**: Problems often have subtle hints related to e-commerce or logistics. When you see time intervals, think delivery slots. When you see arrays of numbers, think inventory counts or pricing data.

- **Follow-up questions probe optimization**: After solving the basic problem, expect questions like "What if the data doesn't fit in memory?" or "How would this work with streaming data?" These test your understanding of external sorting and system design implications.

## Study Order

Follow this progression to build your sorting skills systematically:

1. **Basic sorting algorithms**: Understand quicksort, mergesort, and heapsort conceptually. You don't need to implement them from scratch, but know their time/space complexities and when each is appropriate.

2. **Built-in sorting with custom comparators**: Master sorting arrays/lists with custom sort keys. This is where 80% of interview sorting happens.

3. **Interval problems**: Start with "Merge Intervals" (#56), then progress to "Meeting Rooms" (#252) and "Meeting Rooms II" (#253). These teach you how sorting reveals structure.

4. **Greedy algorithms with sorting**: Practice "Non-overlapping Intervals" (#435) and "Minimum Number of Arrows to Burst Balloons" (#452). These demonstrate how sorting enables optimal greedy choices.

5. **Two-pointer techniques on sorted data**: Solve "Two Sum II" (#167), "3Sum" (#15), and "Container With Most Water" (#11). These show how sorting transforms search problems.

6. **Advanced applications**: Tackle problems like "Maximum Profit in Job Scheduling" (#1235) or "Car Fleet" (#853) where sorting is just one component of a more complex solution.

## Recommended Practice Order

Solve these problems in sequence to build upon concepts:

1. **Merge Intervals** (#56) - Foundation for all interval problems
2. **Meeting Rooms II** (#253) - Interval counting with sorting
3. **Non-overlapping Intervals** (#435) - Greedy choice after sorting
4. **Two Sum II** (#167) - Two-pointer technique on sorted data
5. **3Sum** (#15) - Extending two-pointer technique
6. **K Closest Points to Origin** (#973) - Sorting with custom comparator
7. **Top K Frequent Elements** (#347) - Bucket sort variation
8. **Car Fleet** (#853) - Applied sorting with physics/logistics context

Remember: at Coupang, the key insight is usually recognizing that sorting the data first will unlock a simpler solution. When you encounter a problem with comparisons, overlaps, or finding optimal sequences, ask yourself: "What if I sorted this first?"

[Practice Sorting at Coupang](/company/coupang/sorting)
