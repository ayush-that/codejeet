---
title: "How to Solve Single-Threaded CPU — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Single-Threaded CPU. Medium difficulty, 47.4% acceptance rate. Topics: Array, Sorting, Heap (Priority Queue)."
date: "2026-09-07"
category: "dsa-patterns"
tags: ["single-threaded-cpu", "array", "sorting", "heap-(priority-queue)", "medium"]
---

# How to Solve Single-Threaded CPU

You're given a list of tasks with start times and durations, and you need to simulate a single-threaded CPU that processes tasks according to two rules: 1) It can only work on one task at a time, and 2) When choosing which task to work on next, it picks the shortest available task first. This problem is tricky because it combines time simulation with priority-based selection, requiring careful management of available tasks as time progresses.

## Visual Walkthrough

Let's trace through a concrete example: `tasks = [[1,2],[2,4],[3,2],[4,1]]`

We'll simulate step by step:

1. **Time 0**: No tasks available yet. CPU is idle.
2. **Time 1**: Task 0 becomes available. CPU starts processing it immediately. It will take 2 units of time.
3. **Time 3**: Task 0 completes. Current time = 3. Available tasks: Task 1 (available at time 2), Task 2 (available at time 3). We pick the shortest: Task 2 (duration 2) over Task 1 (duration 4).
4. **Time 5**: Task 2 completes. Current time = 5. Available tasks: Task 1 (available at time 2), Task 3 (available at time 4). We pick the shortest: Task 3 (duration 1).
5. **Time 6**: Task 3 completes. Current time = 6. Available tasks: Task 1 (available at time 2). We process Task 1.
6. **Time 10**: Task 1 completes. All tasks done.

The order of completion: [0, 2, 3, 1]

Notice the key pattern: At each decision point, we need to:

1. Advance time to when the next task becomes available (if CPU is idle)
2. Add all tasks that have become available by that time to our "available pool"
3. From that pool, pick the task with shortest processing time

## Brute Force Approach

A naive approach would be to simulate time tick by tick:

1. Start at time = 0
2. At each time unit:
   - Add any tasks whose enqueueTime equals current time
   - If CPU is idle, find the task with minimum processing time among available tasks
   - Process that task for its duration
3. Repeat until all tasks are processed

The problem with this approach is time complexity. If tasks have large enqueue times or processing times, we might need to simulate millions of time units. For example, if enqueue times go up to 10^9, we can't iterate through each time unit.

Even if we jump to next relevant event (when a task becomes available or completes), the brute force approach of scanning all available tasks each time to find the shortest would be O(n²) in the worst case, which is too slow for n up to 10^5.

## Optimized Approach

The key insight is that we need two data structures working together:

1. **A sorted list of all tasks by enqueue time** - This lets us efficiently find which tasks become available as time progresses. We'll process tasks in order of when they become available.

2. **A min-heap (priority queue) of available tasks** - Once tasks are available, we need to quickly find the one with shortest processing time. A min-heap gives us O(log n) access to the minimum element.

The algorithm works like this:

1. Sort tasks by enqueue time, keeping track of original indices
2. Initialize current time to 0 and an empty min-heap
3. Use an index pointer to track which tasks haven't been considered yet
4. While we haven't processed all tasks:
   - If heap is empty and current time < next task's enqueue time, jump time forward
   - Add all tasks that have become available by current time to the heap
   - Pop the shortest task from heap, process it, update time, and record order

The clever part is that we don't simulate every time unit - we jump from event to event (either when a task becomes available or when a task completes).

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def getOrder(tasks):
    """
    Simulates a single-threaded CPU processing tasks with shortest
    processing time first among available tasks.

    Args:
        tasks: List[List[int]] where tasks[i] = [enqueueTime, processingTime]

    Returns:
        List[int] - order of task processing
    """
    # Step 1: Add original indices to tasks and sort by enqueue time
    # We need to preserve original indices for the output
    indexed_tasks = [(enq, proc, i) for i, (enq, proc) in enumerate(tasks)]
    indexed_tasks.sort(key=lambda x: x[0])  # Sort by enqueue time

    # Step 2: Initialize data structures
    import heapq
    min_heap = []  # Will store (processing_time, original_index)
    result = []
    time = 0  # Current CPU time
    idx = 0   # Pointer to track which tasks we've considered

    # Step 3: Process all tasks
    while len(result) < len(tasks):
        # Add all tasks that have become available by current time to heap
        while idx < len(tasks) and indexed_tasks[idx][0] <= time:
            # Push (processing_time, original_index) to heap
            heapq.heappush(min_heap, (indexed_tasks[idx][1], indexed_tasks[idx][2]))
            idx += 1

        if min_heap:
            # Process the shortest available task
            proc_time, task_idx = heapq.heappop(min_heap)
            time += proc_time  # Advance time by processing duration
            result.append(task_idx)  # Record completion order
        else:
            # If no tasks available, jump to next task's enqueue time
            # This handles idle periods
            time = indexed_tasks[idx][0]

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function getOrder(tasks) {
  /**
   * Simulates a single-threaded CPU processing tasks with shortest
   * processing time first among available tasks.
   *
   * @param {number[][]} tasks - tasks[i] = [enqueueTime, processingTime]
   * @return {number[]} - order of task processing
   */

  // Step 1: Add original indices to tasks and sort by enqueue time
  const indexedTasks = tasks.map((task, i) => ({
    enq: task[0],
    proc: task[1],
    idx: i,
  }));

  indexedTasks.sort((a, b) => a.enq - b.enq); // Sort by enqueue time

  // Step 2: Initialize data structures
  const minHeap = new MinHeap(); // Will store {processingTime, originalIndex}
  const result = [];
  let time = 0; // Current CPU time
  let idx = 0; // Pointer to track which tasks we've considered

  // Step 3: Process all tasks
  while (result.length < tasks.length) {
    // Add all tasks that have become available by current time to heap
    while (idx < tasks.length && indexedTasks[idx].enq <= time) {
      minHeap.push({
        processingTime: indexedTasks[idx].proc,
        originalIndex: indexedTasks[idx].idx,
      });
      idx++;
    }

    if (minHeap.size() > 0) {
      // Process the shortest available task
      const task = minHeap.pop();
      time += task.processingTime; // Advance time by processing duration
      result.push(task.originalIndex); // Record completion order
    } else {
      // If no tasks available, jump to next task's enqueue time
      // This handles idle periods
      time = indexedTasks[idx].enq;
    }
  }

  return result;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(task) {
    this.heap.push(task);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return min;
  }

  size() {
    return this.heap.length;
  }

  bubbleUp(index) {
    const task = this.heap[index];
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIdx];
      if (task.processingTime >= parent.processingTime) break;
      this.heap[index] = parent;
      index = parentIdx;
    }
    this.heap[index] = task;
  }

  sinkDown(index) {
    const length = this.heap.length;
    const task = this.heap[index];

    while (true) {
      let leftChildIdx = 2 * index + 1;
      let rightChildIdx = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIdx < length) {
        leftChild = this.heap[leftChildIdx];
        if (leftChild.processingTime < task.processingTime) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.heap[rightChildIdx];
        if (
          (swap === null && rightChild.processingTime < task.processingTime) ||
          (swap !== null && rightChild.processingTime < leftChild.processingTime)
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      index = swap;
    }
    this.heap[index] = task;
  }
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int[] getOrder(int[][] tasks) {
        /**
         * Simulates a single-threaded CPU processing tasks with shortest
         * processing time first among available tasks.
         *
         * @param tasks - tasks[i] = [enqueueTime, processingTime]
         * @return int[] - order of task processing
         */

        int n = tasks.length;

        // Step 1: Create array of Task objects with original indices
        Task[] indexedTasks = new Task[n];
        for (int i = 0; i < n; i++) {
            indexedTasks[i] = new Task(tasks[i][0], tasks[i][1], i);
        }

        // Sort by enqueue time
        Arrays.sort(indexedTasks, (a, b) -> Integer.compare(a.enqueueTime, b.enqueueTime));

        // Step 2: Initialize data structures
        // Min-heap for available tasks, comparing by processing time then index
        PriorityQueue<Task> minHeap = new PriorityQueue<>((a, b) -> {
            if (a.processingTime != b.processingTime) {
                return Integer.compare(a.processingTime, b.processingTime);
            }
            return Integer.compare(a.index, b.index);
        });

        List<Integer> result = new ArrayList<>();
        long time = 0;  // Use long to avoid integer overflow
        int idx = 0;    // Pointer to track which tasks we've considered

        // Step 3: Process all tasks
        while (result.size() < n) {
            // Add all tasks that have become available by current time to heap
            while (idx < n && indexedTasks[idx].enqueueTime <= time) {
                minHeap.offer(indexedTasks[idx]);
                idx++;
            }

            if (!minHeap.isEmpty()) {
                // Process the shortest available task
                Task current = minHeap.poll();
                time += current.processingTime;  // Advance time by processing duration
                result.add(current.index);       // Record completion order
            } else {
                // If no tasks available, jump to next task's enqueue time
                // This handles idle periods
                time = indexedTasks[idx].enqueueTime;
            }
        }

        // Convert List to array
        int[] order = new int[n];
        for (int i = 0; i < n; i++) {
            order[i] = result.get(i);
        }
        return order;
    }

    // Helper class to store task information
    class Task {
        int enqueueTime;
        int processingTime;
        int index;

        Task(int enqueueTime, int processingTime, int index) {
            this.enqueueTime = enqueueTime;
            this.processingTime = processingTime;
            this.index = index;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the tasks by enqueue time: O(n log n)
- Each task is pushed to and popped from the heap exactly once: O(n log n)
- The while loops together process each task once: O(n)
- Dominated by O(n log n) from sorting and heap operations

**Space Complexity: O(n)**

- Storing the indexed tasks array: O(n)
- The heap can contain up to n elements in worst case: O(n)
- Result array: O(n)
- Total: O(n)

The log n factors come from heap operations (push/pop) which are O(log n) each, and we perform 2n such operations (n pushes, n pops).

## Common Mistakes

1. **Forgetting to handle idle CPU time**: When no tasks are available, you need to jump time forward to the next task's enqueue time. Many candidates get stuck in infinite loops or incorrect ordering by not handling this case.

2. **Losing original indices**: The output requires the original task indices in processing order. If you don't store these before sorting, you can't reconstruct the correct output.

3. **Incorrect heap ordering**: The heap should prioritize by processing time first, but when processing times are equal, we need to break ties by original index (lower index first). Missing this tie-breaker leads to wrong answers on certain test cases.

4. **Using integer overflow for time**: With large enqueue times and processing times (up to 10^9 each), and up to 10^5 tasks, the total time can exceed 32-bit integer limits. Use 64-bit integers (long in Java, normal int in Python handles big integers).

## When You'll See This Pattern

This "event simulation with priority queue" pattern appears in scheduling problems where you need to process items based on both timing constraints and priority:

1. **Meeting Rooms II (LeetCode 253)** - Similar concept of tracking "available" resources over time, though here it's rooms instead of CPU cycles.

2. **Employee Free Time (LeetCode 759)** - Merging intervals with attention to availability, using similar time-jumping techniques.

3. **Task Scheduler (LeetCode 621)** - Different constraints but similar need to schedule tasks optimally with timing considerations.

The core pattern is: sort events by time, use a heap to manage available options, and jump time between events rather than simulating every unit.

## Key Takeaways

1. **Combine sorting with heaps for time-based scheduling**: When problems involve events happening over time with priority-based selection, sort by time and use a heap to manage available options efficiently.

2. **Jump time, don't simulate every unit**: Instead of iterating through each time unit, identify the next "event" (task available or task completed) and jump directly to it.

3. **Preserve original indices when sorting**: Many scheduling problems require output in terms of original input order. Always store indices before sorting if you'll need them later.

Related problems: [Parallel Courses III](/problem/parallel-courses-iii), [Minimum Time to Complete All Tasks](/problem/minimum-time-to-complete-all-tasks)
