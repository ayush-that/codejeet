---
title: "Greedy Questions at Microsoft: What to Expect"
description: "Prepare for Greedy interview questions at Microsoft — patterns, difficulty breakdown, and study tips."
date: "2027-04-02"
category: "dsa-patterns"
tags: ["microsoft", "greedy", "interview prep"]
---

# Greedy Questions at Microsoft: What to Expect

If you're preparing for a Microsoft interview, you've probably noticed the sheer volume of Greedy questions in their problem bank — 133 out of 1352 total. That's nearly 10% of their catalog, which is a significant chunk. But here's what most candidates miss: Microsoft doesn't just test Greedy algorithms to check if you know the pattern. They use these problems as a window into your decision-making process under constraints. At Microsoft, where resource optimization (whether it's cloud compute, memory, or API calls) is part of daily engineering, Greedy problems serve as excellent proxies for real-world trade-offs.

In actual interviews, you'll encounter Greedy questions in about 20-30% of technical rounds, often in the second or third problem of an onsite loop. They're not as ubiquitous as arrays or strings, but when they appear, they're usually the centerpiece question that determines whether you get a "strong hire" versus a "hire." The key insight: Microsoft interviewers love Greedy problems that have a "proof" component — they want to hear not just _how_ your algorithm works, but _why_ it's optimal.

## Specific Patterns Microsoft Favors

Microsoft's Greedy problems tend to cluster around three main themes:

1. **Interval Scheduling and Merging** — This is their absolute favorite. Problems like meeting rooms, task scheduling, and calendar overlaps appear constantly because they mirror real challenges in Outlook, Teams scheduling, and Azure resource allocation.

2. **Greedy with Sorting** — Nearly every Microsoft Greedy problem requires sorting first. The pattern is: sort by one dimension, then make locally optimal choices. This appears in problems like "Minimum Number of Arrows to Burst Balloons" (#452) and "Non-overlapping Intervals" (#435).

3. **Two-Pointer Greedy** — These problems involve making decisions while traversing with two pointers, like in "Container With Most Water" (#11) or "Partition Labels" (#763). Microsoft likes these because they test both greedy intuition and efficient implementation.

What you won't see much of: pure coin change problems (that's DP territory) or abstract Huffman coding implementations. Microsoft's Greedy problems are almost always grounded in practical scenarios.

## How to Prepare

The most common mistake candidates make is jumping straight to implementation without proving correctness. For Microsoft interviews, you need to articulate the greedy choice property and optimal substructure. Let's look at the interval pattern that appears in at least a dozen Microsoft questions:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting
def eraseOverlapIntervals(intervals):
    """
    LeetCode #435: Non-overlapping Intervals
    Greedy choice: Always pick the interval that ends earliest
    Why it works: Freeing up the resource (time) sooner allows more intervals later
    """
    if not intervals:
        return 0

    # Sort by end time - this is the key insight
    intervals.sort(key=lambda x: x[1])

    count = 0
    prev_end = intervals[0][1]

    for i in range(1, len(intervals)):
        current_start, current_end = intervals[i]

        # If current interval starts before previous ends, we have overlap
        if current_start < prev_end:
            count += 1  # We need to remove one of them
        else:
            # No overlap, update the previous end to current end
            prev_end = current_end

    return count
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting
function eraseOverlapIntervals(intervals) {
  if (!intervals.length) return 0;

  // Sort by end time - the greedy choice
  intervals.sort((a, b) => a[1] - b[1]);

  let count = 0;
  let prevEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [currentStart, currentEnd] = intervals[i];

    if (currentStart < prevEnd) {
      count++;
    } else {
      prevEnd = currentEnd;
    }
  }

  return count;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting
public int eraseOverlapIntervals(int[][] intervals) {
    if (intervals.length == 0) return 0;

    // Sort by end time - critical greedy step
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

    int count = 0;
    int prevEnd = intervals[0][1];

    for (int i = 1; i < intervals.length; i++) {
        int currentStart = intervals[i][0];
        int currentEnd = intervals[i][1];

        if (currentStart < prevEnd) {
            count++;
        } else {
            prevEnd = currentEnd;
        }
    }

    return count;
}
```

</div>

Notice the pattern: sort by end time, then iterate through, keeping the interval that ends earliest when conflicts occur. The proof you should articulate: "By choosing the interval that finishes first, we maximize the remaining time for future intervals."

## How Microsoft Tests Greedy vs Other Companies

Microsoft's Greedy questions differ from other FAANG companies in subtle but important ways:

- **vs Google**: Google's Greedy problems are often more mathematically complex (think "Minimum Domino Rotations" or "Jump Game II"). Microsoft's are more practical and tied to business scenarios.
- **vs Amazon**: Amazon loves Greedy in the context of optimization (shipping, warehouses), but their problems are usually harder edge cases. Microsoft's have cleaner patterns.
- **vs Facebook**: Facebook's Greedy problems often involve strings or arrays with tricky constraints. Microsoft's frequently use intervals or two-pointer approaches.

What's unique about Microsoft: They often combine Greedy with other concepts. You might get a problem that starts as a Greedy interval problem but then adds a twist requiring a heap (like "Meeting Rooms II" #253) or even a slight DP modification. They're testing whether you recognize when pure Greedy works versus when you need to augment it.

## Study Order

Don't just solve random Greedy problems. Follow this progression:

1. **Basic Sorting Greedy** — Start with problems where sorting alone enables the greedy choice. "Maximum Units on a Truck" (#1710) is perfect here.
2. **Interval Scheduling** — Master the classic "earliest finish time" pattern with "Non-overlapping Intervals" (#435) and "Minimum Number of Arrows" (#452).
3. **Two-Pointer Greedy** — Learn to make decisions while traversing with "Container With Most Water" (#11) and "Partition Labels" (#763).
4. **Greedy with Heaps** — Some Microsoft problems need priority queues, like "Meeting Rooms II" (#253) or "Reorganize String" (#767).
5. **Proof Practice** — For each problem, write down why the greedy choice is optimal in one sentence. This is what Microsoft interviewers want to hear.

The logic: You need to understand the fundamental sorting-based Greedy before tackling intervals, which are Microsoft's favorite. Two-pointer comes next because it's their second most common pattern. Heaps are included because Microsoft sometimes combines patterns.

## Recommended Practice Order

Solve these in sequence:

1. "Maximum Units on a Truck" (#1710) — Simplest sorting greedy
2. "Non-overlapping Intervals" (#435) — Core interval pattern
3. "Minimum Number of Arrows to Burst Balloons" (#452) — Interval variation
4. "Merge Intervals" (#56) — Not purely greedy but often appears
5. "Container With Most Water" (#11) — Two-pointer greedy
6. "Partition Labels" (#763) — More complex two-pointer
7. "Meeting Rooms II" (#253) — Greedy + heap combination
8. "Task Scheduler" (#621) — Advanced greedy (Microsoft favorite)

Here's the two-pointer pattern that appears in several Microsoft questions:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxArea(height):
    """
    LeetCode #11: Container With Most Water
    Greedy choice: Move the pointer pointing to the shorter line
    Why it works: The area is limited by the shorter line, so moving the taller line can't help
    """
    left, right = 0, len(height) - 1
    max_water = 0

    while left < right:
        # Calculate current area
        width = right - left
        current_height = min(height[left], height[right])
        max_water = max(max_water, width * current_height)

        # Greedy choice: move the shorter line inward
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1

    return max_water
```

```javascript
// Time: O(n) | Space: O(1)
function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, width * currentHeight);

    // Greedy move: shift the shorter boundary
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}
```

```java
// Time: O(n) | Space: O(1)
public int maxArea(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int maxWater = 0;

    while (left < right) {
        int width = right - left;
        int currentHeight = Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, width * currentHeight);

        // Greedy decision point
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxWater;
}
```

</div>

The key insight for Microsoft interviews: Always state the greedy choice explicitly. In this case: "We move the pointer at the shorter line because the area is limited by the shorter side, so keeping it fixed can't yield a better solution."

Remember, Microsoft isn't just testing whether you can solve the problem — they're evaluating how you think about optimization in constrained environments. Practice articulating _why_ your greedy approach works, not just _how_ to implement it.

[Practice Greedy at Microsoft](/company/microsoft/greedy)
