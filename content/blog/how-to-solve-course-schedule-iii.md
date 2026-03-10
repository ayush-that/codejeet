---
title: "How to Solve Course Schedule III — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Course Schedule III. Hard difficulty, 41.4% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2026-11-15"
category: "dsa-patterns"
tags: ["course-schedule-iii", "array", "greedy", "sorting", "hard"]
---

# How to Solve Course Schedule III

You're given a list of courses, each with a duration and a last day to complete it. You need to find the maximum number of courses you can take, starting from day 1, where each course must be taken continuously and completed by its deadline. What makes this problem tricky is that courses have different durations and deadlines, and taking a longer course early might prevent you from taking multiple shorter courses later. This is a classic scheduling optimization problem that requires careful ordering and selection.

## Visual Walkthrough

Let's trace through a concrete example: `courses = [[100, 200], [200, 1300], [1000, 1250], [2000, 3200]]`

**Step 1: Sort by deadline**  
First, we sort courses by their last day: `[[100, 200], [1000, 1250], [200, 1300], [2000, 3200]]`

**Step 2: Process each course**  
We'll maintain the total time spent so far and a max-heap of durations of courses we've taken.

- Course 1: [100, 200]  
  Total time = 0 + 100 = 100 ≤ 200 ✅  
  Add to heap: [100]  
  Courses taken: 1

- Course 2: [1000, 1250]  
  Total time = 100 + 1000 = 1100 ≤ 1250 ✅  
  Add to heap: [1000, 100]  
  Courses taken: 2

- Course 3: [200, 1300]  
  Total time = 1100 + 200 = 1300 ≤ 1300 ✅  
  Add to heap: [1000, 100, 200]  
  Courses taken: 3

- Course 4: [2000, 3200]  
  Total time = 1300 + 2000 = 3300 ≤ 3200 ❌ (exceeds deadline)  
  Check if we can replace a longer course: The longest course in heap is 1000  
  If we remove 1000 and add 2000: total time = 1300 - 1000 + 2000 = 2300  
  This is still > 3200? Wait, let's recalculate:  
  Current total time before adding: 1300  
  Remove longest (1000): new total = 1300 - 1000 = 300  
  Add new course (2000): new total = 300 + 2000 = 2300  
  Check deadline: 2300 ≤ 3200 ✅  
  So we replace 1000 with 2000  
  Heap becomes: [2000, 200, 100]  
  Courses taken: still 3 (we replaced, didn't add)

**Final answer: 3 courses**

The key insight: When we can't fit a new course, we check if swapping it with the longest course we've taken so far helps. This greedy replacement ensures we keep the total time minimal while maintaining the same number of courses.

## Brute Force Approach

A naive approach would try all possible subsets of courses, check if each subset can be scheduled, and return the largest valid subset. For each subset of size k, we'd need to check all k! permutations to find if any ordering satisfies all deadlines.

The checking process for a given ordering would be:

1. Start with current day = 0
2. For each course in order: current day += duration
3. If current day > last day for any course, invalid

This brute force has O(2^n × n!) time complexity, which is astronomical even for n=20. A candidate might think about dynamic programming with bitmasking (O(n × 2^n)), but that's still exponential and impractical for n up to 10^4.

The fundamental issue with brute force is it doesn't leverage the structure of the problem: we should process courses in deadline order, and when we can't take a course, we should consider replacing the longest course we've taken.

## Optimized Approach

The optimal solution uses a greedy approach with a max-heap:

1. **Sort by deadline**: Process courses in increasing order of last day. This ensures we always consider courses with earlier deadlines first, which is optimal because delaying a course with an early deadline might make it impossible to take.

2. **Track total time**: Maintain the cumulative time spent on courses taken so far.

3. **Use a max-heap**: Store durations of courses we've taken. The heap lets us quickly find the longest course.

4. **Process each course**:
   - If we can take the course (total time + duration ≤ last day), add it to our schedule
   - If we can't take it, check if swapping it with the longest course we've taken would help:
     - If the new course is shorter than the longest course in our schedule, replace them
     - This reduces total time while keeping the same number of courses

Why does this work? By always replacing the longest course when we can't fit a new one, we minimize the total time spent while maintaining the count. This greedy choice is safe because if we can't fit a course with our current schedule, the only way to make room is to remove some course(s). Removing the longest course is optimal because it frees up the most time.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def scheduleCourse(courses):
    """
    Returns the maximum number of courses that can be taken.

    Approach:
    1. Sort courses by deadline (last day)
    2. Use a max-heap (via negative values in Python's min-heap) to track durations
    3. Process each course, adding if possible
    4. If not possible, replace the longest course if current course is shorter

    Args:
        courses: List[List[int]] where each inner list is [duration, lastDay]

    Returns:
        int: Maximum number of courses that can be taken
    """
    import heapq

    # Step 1: Sort courses by their deadline (last day)
    # This ensures we process courses with earlier deadlines first
    courses.sort(key=lambda x: x[1])

    # Max-heap to store durations of courses we've taken
    # In Python, we use negative values to simulate a max-heap
    max_heap = []

    # Track total time spent on courses taken so far
    total_time = 0

    # Step 2: Process each course in deadline order
    for duration, last_day in courses:
        # Try to add current course to our schedule
        if total_time + duration <= last_day:
            # We can take this course
            total_time += duration
            # Add negative duration to simulate max-heap
            heapq.heappush(max_heap, -duration)
        elif max_heap and -max_heap[0] > duration:
            # Can't take course directly, but we might replace a longer course
            # Check if the longest course we've taken is longer than current course
            # Remove the longest course (most negative, so smallest in min-heap)
            longest_duration = -heapq.heappop(max_heap)
            # Update total time by removing the longest course
            total_time -= longest_duration
            # Add the new (shorter) course
            total_time += duration
            heapq.heappush(max_heap, -duration)
        # If neither condition applies, skip this course

    # The size of heap is the number of courses we can take
    return len(max_heap)
```

```javascript
// Time: O(n log n) | Space: O(n)
function scheduleCourse(courses) {
  /**
   * Returns the maximum number of courses that can be taken.
   *
   * Approach:
   * 1. Sort courses by deadline (last day)
   * 2. Use a max-heap to track durations
   * 3. Process each course, adding if possible
   * 4. If not possible, replace the longest course if current course is shorter
   *
   * @param {number[][]} courses - Array of [duration, lastDay] pairs
   * @return {number} Maximum number of courses that can be taken
   */

  // Custom max-heap implementation
  class MaxHeap {
    constructor() {
      this.heap = [];
    }

    push(val) {
      this.heap.push(val);
      this._bubbleUp(this.heap.length - 1);
    }

    pop() {
      if (this.heap.length === 0) return null;
      const max = this.heap[0];
      const last = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this._sinkDown(0);
      }
      return max;
    }

    peek() {
      return this.heap.length > 0 ? this.heap[0] : null;
    }

    size() {
      return this.heap.length;
    }

    _bubbleUp(index) {
      const element = this.heap[index];
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        const parent = this.heap[parentIndex];
        if (element <= parent) break;
        this.heap[parentIndex] = element;
        this.heap[index] = parent;
        index = parentIndex;
      }
    }

    _sinkDown(index) {
      const length = this.heap.length;
      const element = this.heap[index];

      while (true) {
        let leftChildIndex = 2 * index + 1;
        let rightChildIndex = 2 * index + 2;
        let swap = null;
        let leftChild, rightChild;

        if (leftChildIndex < length) {
          leftChild = this.heap[leftChildIndex];
          if (leftChild > element) {
            swap = leftChildIndex;
          }
        }

        if (rightChildIndex < length) {
          rightChild = this.heap[rightChildIndex];
          if (
            (swap === null && rightChild > element) ||
            (swap !== null && rightChild > leftChild)
          ) {
            swap = rightChildIndex;
          }
        }

        if (swap === null) break;
        this.heap[index] = this.heap[swap];
        this.heap[swap] = element;
        index = swap;
      }
    }
  }

  // Step 1: Sort courses by deadline (last day)
  courses.sort((a, b) => a[1] - b[1]);

  // Max-heap to store durations of courses we've taken
  const maxHeap = new MaxHeap();

  // Track total time spent on courses taken so far
  let totalTime = 0;

  // Step 2: Process each course in deadline order
  for (const [duration, lastDay] of courses) {
    // Try to add current course to our schedule
    if (totalTime + duration <= lastDay) {
      // We can take this course
      totalTime += duration;
      maxHeap.push(duration);
    } else if (maxHeap.size() > 0 && maxHeap.peek() > duration) {
      // Can't take course directly, but we might replace a longer course
      // Remove the longest course
      const longestDuration = maxHeap.pop();
      // Update total time by removing the longest course
      totalTime -= longestDuration;
      // Add the new (shorter) course
      totalTime += duration;
      maxHeap.push(duration);
    }
    // If neither condition applies, skip this course
  }

  // The size of heap is the number of courses we can take
  return maxHeap.size();
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int scheduleCourse(int[][] courses) {
        /**
         * Returns the maximum number of courses that can be taken.
         *
         * Approach:
         * 1. Sort courses by deadline (last day)
         * 2. Use a max-heap to track durations
         * 3. Process each course, adding if possible
         * 4. If not possible, replace the longest course if current course is shorter
         *
         * @param courses Array of [duration, lastDay] pairs
         * @return Maximum number of courses that can be taken
         */

        // Step 1: Sort courses by deadline (last day)
        // Using Comparator to sort by the second element (lastDay)
        Arrays.sort(courses, (a, b) -> Integer.compare(a[1], b[1]));

        // Max-heap to store durations of courses we've taken
        // PriorityQueue in Java is min-heap by default, so we use reverse order
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

        // Track total time spent on courses taken so far
        int totalTime = 0;

        // Step 2: Process each course in deadline order
        for (int[] course : courses) {
            int duration = course[0];
            int lastDay = course[1];

            // Try to add current course to our schedule
            if (totalTime + duration <= lastDay) {
                // We can take this course
                totalTime += duration;
                maxHeap.offer(duration);
            } else if (!maxHeap.isEmpty() && maxHeap.peek() > duration) {
                // Can't take course directly, but we might replace a longer course
                // Remove the longest course
                int longestDuration = maxHeap.poll();
                // Update total time by removing the longest course
                totalTime -= longestDuration;
                // Add the new (shorter) course
                totalTime += duration;
                maxHeap.offer(duration);
            }
            // If neither condition applies, skip this course
        }

        // The size of heap is the number of courses we can take
        return maxHeap.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the courses takes O(n log n)
- Processing each course involves heap operations (push/pop) which are O(log n) each
- With n courses, total is O(n log n) + O(n log n) = O(n log n)

**Space Complexity: O(n)**

- The heap can store up to n courses in the worst case
- Sorting may use O(log n) space for the algorithm's internal stack (depending on language)
- Overall O(n) dominates

## Common Mistakes

1. **Not sorting by deadline first**: Some candidates try to sort by duration or other criteria. Processing by deadline is crucial because courses with earlier deadlines are more constrained. If you take a long course with a late deadline first, you might miss several shorter courses with early deadlines.

2. **Forgetting to check the replacement condition**: When you can't fit a course, you must check if replacing the longest course would help. Simply skipping the course might not be optimal. The key insight is that replacing a longer course with a shorter one reduces total time while keeping the count same.

3. **Using min-heap instead of max-heap**: The heap needs to give us the longest course quickly. In Python, remember to use negative values. In Java, use `Collections.reverseOrder()`. In JavaScript, implement a proper max-heap.

4. **Not updating total time correctly during replacement**: When replacing, you must:
   - Subtract the duration of the removed course
   - Add the duration of the new course
     A common error is to only add the new course or miscalculate the new total.

## When You'll See This Pattern

This "greedy with heap replacement" pattern appears in scheduling problems where you need to maximize count subject to constraints:

1. **Maximum Number of Events That Can Be Attended** (LeetCode 1353): Similar structure where events have start/end times and you want to attend as many as possible. The solution uses a min-heap to track end times.

2. **Meeting Rooms II** (LeetCode 253): While not identical, it also uses a heap to track ongoing meetings and greedily allocate rooms.

3. **Task Scheduler** (LeetCode 621): Uses priority queues to schedule tasks with cooling periods, though the heap usage is different.

The core pattern: When you need to maximize count with constraints, sort by one criterion (usually deadline or start time), use a heap to track selections, and consider replacement when you can't add a new item.

## Key Takeaways

1. **Greedy with replacement is powerful**: When maximizing count under constraints, sometimes the optimal strategy involves not just adding items but potentially replacing existing ones. The replacement should always improve your situation (reduce total time/cost while maintaining count).

2. **Sorting order matters**: In scheduling problems, processing items in the right order (usually by deadline) simplifies the problem and makes greedy choices optimal.

3. **Heaps efficiently track extremes**: When you need quick access to the largest or smallest element in a dynamic set, heaps are the right data structure. Here, we need the longest course for potential replacement.

Related problems: [Course Schedule](/problem/course-schedule), [Course Schedule II](/problem/course-schedule-ii), [Parallel Courses III](/problem/parallel-courses-iii)
