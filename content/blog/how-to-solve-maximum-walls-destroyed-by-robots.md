---
title: "How to Solve Maximum Walls Destroyed by Robots — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Walls Destroyed by Robots. Hard difficulty, 26.4% acceptance rate. Topics: Array, Binary Search, Dynamic Programming, Sorting."
date: "2026-07-04"
category: "dsa-patterns"
tags: ["maximum-walls-destroyed-by-robots", "array", "binary-search", "dynamic-programming", "hard"]
---

# How to Solve Maximum Walls Destroyed by Robots

This problem involves strategically choosing which robots to activate to destroy the maximum number of walls along a line. Each robot can only destroy walls within its maximum bullet range, and once a wall is destroyed, it can't be counted again. The challenge lies in efficiently matching robots to walls while respecting range limitations and the ordering along the line.

What makes this problem tricky is that we need to consider both the robot's position and its range simultaneously, and we must avoid double-counting walls. A naive approach would try all combinations, which is computationally infeasible. The optimal solution requires careful sorting and greedy matching with binary search.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

- Robots: positions = [1, 5, 3], ranges = [2, 1, 3]
- Walls: [2, 4, 6, 8]

**Step 1: Calculate effective coverage for each robot**
For each robot, we calculate the leftmost and rightmost walls it can reach:

- Robot at position 1 with range 2: can reach walls from 1-2 to 1+2 = [-1, 3]
  - Walls in range: [2] (only wall at position 2)
  - Coverage interval: [2, 2]
- Robot at position 5 with range 1: can reach walls from 5-1 to 5+1 = [4, 6]
  - Walls in range: [4, 6]
  - Coverage interval: [4, 6]
- Robot at position 3 with range 3: can reach walls from 3-3 to 3+3 = [0, 6]
  - Walls in range: [2, 4, 6]
  - Coverage interval: [2, 6]

**Step 2: Sort walls and robot coverage intervals**
Walls sorted: [2, 4, 6, 8]
Robot intervals sorted by their right endpoint:

- Robot 1: [2, 2] (right=2)
- Robot 3: [2, 6] (right=6)
- Robot 2: [4, 6] (right=6)

**Step 3: Greedy matching**
We iterate through walls in order and try to match each wall with a robot:

1. Wall 2: Find robot with left ≤ 2 and right ≥ 2. Robot 1 works. Use Robot 1 for wall 2.
2. Wall 4: Find robot with left ≤ 4 and right ≥ 4. Robot 3 works. Use Robot 3 for wall 4.
3. Wall 6: Find robot with left ≤ 6 and right ≥ 6. Robot 2 works. Use Robot 2 for wall 6.
4. Wall 8: No robot can reach wall 8.

**Result:** 3 walls destroyed.

This example shows the core idea: we want to match each wall to the robot that can reach it with the smallest possible right endpoint, leaving robots with larger ranges available for later walls.

## Brute Force Approach

A brute force solution would try all possible assignments of robots to walls. For each robot, we could consider which walls it can destroy, then try all combinations to find the maximum number of walls that can be destroyed.

The naive approach would be:

1. For each robot, calculate which walls it can reach
2. Try all subsets of robots and check how many unique walls they can cover
3. Return the maximum count

This approach has exponential time complexity O(2^n \* m) where n is the number of robots and m is the number of walls. Even for moderate inputs (n=20, m=20), this would require checking over 1 million combinations, which is far too slow.

The key insight we need is that we don't need to try all combinations. Since walls are on a line and robots have ranges, we can process them in a greedy manner.

## Optimized Approach

The optimal solution uses a greedy approach with sorting and binary search:

1. **Preprocessing**: For each robot, calculate the interval of walls it can destroy. Since walls are discrete points, we find the leftmost and rightmost wall indices the robot can reach using binary search.

2. **Sorting**: Sort the robot intervals by their right endpoint. This allows us to always use the robot that can reach the current wall but has the smallest possible right endpoint (is "least powerful" for future walls).

3. **Greedy Matching**: Iterate through walls in sorted order. For each wall, find a robot whose interval contains this wall. Among available robots, choose the one with the smallest right endpoint that still covers the current wall.

4. **Efficient Selection**: We need a data structure to quickly find and remove the robot with the smallest right endpoint that covers the current wall. A min-heap (priority queue) works well for this.

The reasoning behind this greedy approach:

- By processing walls in order, we ensure we don't miss any walls
- By always choosing the robot with the smallest right endpoint that can cover the current wall, we save robots with larger ranges for later walls that might need them
- This is similar to the classic "interval scheduling" problem but with the twist that intervals can cover multiple points

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O((n + m) log n) where n = number of robots, m = number of walls
# Space: O(n) for storing robot intervals and the heap
def maxWallsDestroyed(robots, distance, walls):
    # Step 1: Sort walls to enable binary search
    walls.sort()

    intervals = []

    # Step 2: For each robot, calculate the range of walls it can destroy
    for pos, d in zip(robots, distance):
        # Find leftmost wall the robot can reach
        left_idx = bisect_left(walls, pos - d)
        # Find rightmost wall the robot can reach
        right_idx = bisect_right(walls, pos + d) - 1

        # Only add robots that can reach at least one wall
        if left_idx <= right_idx:
            intervals.append((left_idx, right_idx))

    # Step 3: Sort intervals by their right endpoint
    intervals.sort(key=lambda x: x[1])

    # Step 4: Use a min-heap to track available robots for current wall
    import heapq
    heap = []
    wall_idx = 0
    interval_idx = 0
    destroyed = 0

    # Step 5: Process each wall in order
    while wall_idx < len(walls):
        # Add all robots that can reach this wall (left endpoint <= current wall)
        while interval_idx < len(intervals) and intervals[interval_idx][1] >= wall_idx:
            if intervals[interval_idx][0] <= wall_idx:
                # Push the right endpoint to the heap (we want min right endpoint)
                heapq.heappush(heap, intervals[interval_idx][1])
            interval_idx += 1

        # Remove robots that can't reach current wall (right endpoint < current wall)
        while heap and heap[0] < wall_idx:
            heapq.heappop(heap)

        # If we have a robot that can destroy this wall, use it
        if heap:
            heapq.heappop(heap)  # Use this robot for current wall
            destroyed += 1

        # Move to next wall
        wall_idx += 1

    return destroyed

# Helper functions (Python's bisect module)
from bisect import bisect_left, bisect_right
```

```javascript
// Time: O((n + m) log n) where n = number of robots, m = number of walls
// Space: O(n) for storing robot intervals and the heap
function maxWallsDestroyed(robots, distance, walls) {
  // Step 1: Sort walls to enable binary search
  walls.sort((a, b) => a - b);

  const intervals = [];

  // Step 2: For each robot, calculate the range of walls it can destroy
  for (let i = 0; i < robots.length; i++) {
    const pos = robots[i];
    const d = distance[i];

    // Find leftmost wall the robot can reach
    let left = 0,
      right = walls.length - 1;
    let leftIdx = walls.length;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (walls[mid] >= pos - d) {
        leftIdx = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // Find rightmost wall the robot can reach
    left = 0;
    right = walls.length - 1;
    let rightIdx = -1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (walls[mid] <= pos + d) {
        rightIdx = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // Only add robots that can reach at least one wall
    if (leftIdx <= rightIdx) {
      intervals.push([leftIdx, rightIdx]);
    }
  }

  // Step 3: Sort intervals by their right endpoint
  intervals.sort((a, b) => a[1] - b[1]);

  // Step 4: Use a min-heap to track available robots for current wall
  const heap = new MinHeap();
  let wallIdx = 0;
  let intervalIdx = 0;
  let destroyed = 0;

  // Step 5: Process each wall in order
  while (wallIdx < walls.length) {
    // Add all robots that can reach this wall (right endpoint >= current wall)
    while (intervalIdx < intervals.length && intervals[intervalIdx][1] >= wallIdx) {
      if (intervals[intervalIdx][0] <= wallIdx) {
        // Push the right endpoint to the heap
        heap.insert(intervals[intervalIdx][1]);
      }
      intervalIdx++;
    }

    // Remove robots that can't reach current wall (right endpoint < current wall)
    while (!heap.isEmpty() && heap.getMin() < wallIdx) {
      heap.extractMin();
    }

    // If we have a robot that can destroy this wall, use it
    if (!heap.isEmpty()) {
      heap.extractMin(); // Use this robot for current wall
      destroyed++;
    }

    // Move to next wall
    wallIdx++;
  }

  return destroyed;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] > this.heap[index]) {
        [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
        index = parent;
      } else {
        break;
      }
    }
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  sinkDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < length && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }

  getMin() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}
```

```java
// Time: O((n + m) log n) where n = number of robots, m = number of walls
// Space: O(n) for storing robot intervals and the heap
import java.util.*;

public class Solution {
    public int maxWallsDestroyed(int[] robots, int[] distance, int[] walls) {
        // Step 1: Sort walls to enable binary search
        Arrays.sort(walls);
        List<int[]> intervals = new ArrayList<>();

        // Step 2: For each robot, calculate the range of walls it can destroy
        for (int i = 0; i < robots.length; i++) {
            int pos = robots[i];
            int d = distance[i];

            // Find leftmost wall the robot can reach
            int leftIdx = lowerBound(walls, pos - d);
            // Find rightmost wall the robot can reach
            int rightIdx = upperBound(walls, pos + d) - 1;

            // Only add robots that can reach at least one wall
            if (leftIdx <= rightIdx) {
                intervals.add(new int[]{leftIdx, rightIdx});
            }
        }

        // Step 3: Sort intervals by their right endpoint
        intervals.sort((a, b) -> Integer.compare(a[1], b[1]));

        // Step 4: Use a min-heap to track available robots for current wall
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        int wallIdx = 0;
        int intervalIdx = 0;
        int destroyed = 0;

        // Step 5: Process each wall in order
        while (wallIdx < walls.length) {
            // Add all robots that can reach this wall (right endpoint >= current wall)
            while (intervalIdx < intervals.size() && intervals.get(intervalIdx)[1] >= wallIdx) {
                if (intervals.get(intervalIdx)[0] <= wallIdx) {
                    // Push the right endpoint to the heap
                    heap.offer(intervals.get(intervalIdx)[1]);
                }
                intervalIdx++;
            }

            // Remove robots that can't reach current wall (right endpoint < current wall)
            while (!heap.isEmpty() && heap.peek() < wallIdx) {
                heap.poll();
            }

            // If we have a robot that can destroy this wall, use it
            if (!heap.isEmpty()) {
                heap.poll();  // Use this robot for current wall
                destroyed++;
            }

            // Move to next wall
            wallIdx++;
        }

        return destroyed;
    }

    // Helper method to find first index where walls[idx] >= target
    private int lowerBound(int[] walls, int target) {
        int left = 0, right = walls.length;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (walls[mid] >= target) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }

    // Helper method to find first index where walls[idx] > target
    private int upperBound(int[] walls, int target) {
        int left = 0, right = walls.length;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (walls[mid] > target) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O((n + m) log n)**

- Sorting walls: O(m log m)
- Creating intervals: O(n log m) for binary search on walls for each robot
- Sorting intervals: O(n log n)
- Processing walls with heap operations: O(m log n) since each robot is added to and removed from the heap at most once
- Overall: O((n + m) log n) assuming n and m are comparable

**Space Complexity: O(n)**

- Storing intervals: O(n)
- Heap: O(n) in worst case
- Other variables: O(1)

The dominant factor is the heap operations and sorting, both of which are logarithmic per element.

## Common Mistakes

1. **Not sorting walls first**: Without sorting walls, you can't use binary search to find which walls a robot can reach efficiently. This leads to O(n\*m) time to compute coverage.

2. **Forgetting to filter out robots that can't reach any walls**: Some robots might be too far from all walls. Including them wastes computation and could lead to incorrect results if not handled properly.

3. **Incorrect interval sorting or greedy strategy**: Sorting by left endpoint instead of right endpoint, or choosing the robot with the largest range instead of the smallest sufficient range, can lead to suboptimal solutions. The key insight is to be "greedy" with the current wall by using the robot that can reach it but has the smallest right endpoint.

4. **Off-by-one errors in binary search**: When finding the range of walls a robot can reach, it's easy to make mistakes with inclusive/exclusive bounds. Always test edge cases where a robot is exactly at a wall's position or exactly at the maximum range.

## When You'll See This Pattern

This problem combines several important algorithmic patterns:

1. **Interval scheduling with resource allocation**: Similar to LeetCode 435 "Non-overlapping Intervals" and 452 "Minimum Number of Arrows to Burst Balloons", but with the twist that intervals can cover multiple points and we're maximizing coverage rather than minimizing resources.

2. **Greedy matching with priority queues**: The pattern of sorting items and using a heap to select the best available resource appears in problems like LeetCode 630 "Course Schedule III" and 1353 "Maximum Number of Events That Can Be Attended".

3. **Binary search on sorted arrays**: The technique of converting positions to indices using binary search is common in problems involving ranges on a number line, like LeetCode 475 "Heaters" and 826 "Most Profit Assigning Work".

The core idea is to transform a spatial problem into an interval problem, then apply greedy matching with efficient data structures.

## Key Takeaways

1. **Convert spatial constraints to intervals**: When dealing with positions and ranges on a line, convert them to interval indices on a sorted array. This simplifies the problem to interval matching.

2. **Greedy with "smallest sufficient resource"**: When matching resources (robots) to tasks (walls), always use the resource that can complete the current task but has the smallest capacity for future tasks. This is implemented by sorting by right endpoint and using a min-heap.

3. **Combine sorting with efficient data structures**: Many hard problems become tractable when you sort inputs and use appropriate data structures (heaps, trees, etc.) to maintain candidate solutions efficiently.

[Practice this problem on CodeJeet](/problem/maximum-walls-destroyed-by-robots)
