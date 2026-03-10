---
title: "How to Solve Time to Cross a Bridge — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Time to Cross a Bridge. Hard difficulty, 44.4% acceptance rate. Topics: Array, Heap (Priority Queue), Simulation."
date: "2026-08-19"
category: "dsa-patterns"
tags: ["time-to-cross-a-bridge", "array", "heap-(priority-queue)", "simulation", "hard"]
---

# How to Solve Time to Cross a Bridge

This problem simulates workers moving boxes across a bridge between two warehouses. Each worker must: 1) cross right-to-left to pick up a box, 2) pick it up, 3) cross left-to-right to deliver it, and 4) put it down. The challenge is coordinating multiple workers sharing a bridge that can only hold one person at a time, while minimizing total completion time. What makes this tricky is that we need to track both sides of the river simultaneously and handle the bridge crossing constraint efficiently.

## Visual Walkthrough

Let's trace through a small example: `n = 2` boxes, `k = 2` workers with times:

- Worker 0: `[10, 5, 10, 5]` (right=10, pick=5, left=10, put=5)
- Worker 1: `[15, 3, 15, 3]` (right=15, pick=3, left=15, put=3)

**Step 1:** Initially, both workers are on the right side. The bridge is empty. Worker 0 crosses right-to-left first (takes 10 time units). Current time = 10.

**Step 2:** Worker 0 picks box 0 (takes 5). Current time = 15. Worker 1 is still waiting on right side.

**Step 3:** Worker 0 crosses left-to-right with box 0 (takes 10). Current time = 25.

**Step 4:** Worker 0 puts down box 0 (takes 5). Current time = 30. Box 0 is now delivered.

**Step 5:** Worker 1 can now cross right-to-left (takes 15). Current time = 45.

**Step 6:** Worker 1 picks box 1 (takes 3). Current time = 48.

**Step 7:** Worker 1 crosses left-to-right with box 1 (takes 15). Current time = 63.

**Step 8:** Worker 1 puts down box 1 (takes 3). Current time = 66.

The key insight: workers become available at different times on each side, and we need to always choose the next available worker who can use the bridge.

## Brute Force Approach

A naive approach would simulate every possible sequence of worker actions. At each moment, we could:

1. Check all workers to see who's available on which side
2. Try all possible next actions (crossing, picking, putting)
3. Recursively explore all sequences until all boxes are moved

This leads to exponential time complexity because for `n` boxes and `k` workers, there are factorial-like combinations of which worker handles which box in what order. Even for moderate inputs (n=10, k=4), this becomes computationally infeasible.

The brute force fails because it doesn't recognize that workers are interchangeable in terms of availability - we only care about _when_ a worker becomes available, not _which_ worker it is.

## Optimized Approach

The key insight is that we can model this as two priority queues (heaps):

1. **Wait Left**: Workers available on the left side (ready to cross right-to-left)
2. **Wait Right**: Workers available on the right side (ready to cross left-to-right)

We also track:

- **Bridge availability time**: When the bridge will next be free
- **Current time**: The simulation clock
- **Boxes remaining**: How many boxes still need to be moved

**Step-by-step reasoning:**

1. Initially, all workers start on the right side, so add them to `wait_right` with availability time 0
2. While boxes remain:
   - If bridge is free and workers are waiting on right: A worker crosses right-to-left
   - If bridge is free and workers are waiting on left: A worker crosses left-to-right
   - If no workers are waiting: Fast-forward time to when next worker finishes their current task
3. When a worker finishes crossing, they either pick up a box (if on left) or put down a box (if on right)
4. After picking/putting, they become available on the opposite side

We use heaps because we always want the worker who becomes available earliest. The bridge constraint means we process crossings one at a time.

## Optimal Solution

<div class="code-group">

```python
# Time: O((n + k) * log k) | Space: O(k)
# We process n boxes and k workers, with heap operations taking O(log k)
def findCrossingTime(self, n: int, k: int, time: List[List[int]]) -> int:
    import heapq

    # Sort workers by efficiency (sum of crossing times) for tie-breaking
    # Worker with lower (right_to_left + left_to_right) crosses first when bridge is free
    workers = []
    for i, (right, pick, left, put) in enumerate(time):
        # Store: (-efficiency, -index, right, pick, left, put)
        # Negative efficiency because heapq is min-heap, we want max efficiency first
        # Negative index breaks ties by smaller index
        workers.append((-right - left, -i, right, pick, left, put))

    # Convert to heap - workers waiting on right side initially
    heapq.heapify(workers)

    # Heaps for workers waiting on each side
    # Each element: (available_time, efficiency, index, crossing times...)
    wait_left = []  # Workers on left waiting to cross right-to-left
    wait_right = []  # Workers on left waiting to cross left-to-right

    # Initially all workers are on right side and available at time 0
    # We'll move them from workers heap to wait_right
    wait_right = workers  # All workers start waiting on right

    # Bridge status
    bridge_free = 0  # Time when bridge becomes free
    current_time = 0
    boxes_left = n
    boxes_on_left = 0  # Boxes picked up but not yet delivered

    while boxes_left > 0 or boxes_on_left > 0:
        # Step 1: Check if any workers finish their tasks (picking/putting)
        # and become available before current bridge crossing
        while wait_left and wait_left[0][0] <= current_time:
            _, eff, idx, right, pick, left, put = heapq.heappop(wait_left)
            heapq.heappush(wait_right, (eff, idx, right, pick, left, put))

        while wait_right and wait_right[0][0] <= current_time:
            _, eff, idx, right, pick, left, put = heapq.heappop(wait_right)
            heapq.heappush(wait_left, (eff, idx, right, pick, left, put))

        # Step 2: Determine who can cross the bridge
        can_cross_right = wait_right and boxes_left > 0
        can_cross_left = wait_left and boxes_on_left > 0

        if not can_cross_right and not can_cross_left:
            # No one can cross now, fast forward to next available worker
            next_time = float('inf')
            if wait_left:
                next_time = min(next_time, wait_left[0][0])
            if wait_right:
                next_time = min(next_time, wait_right[0][0])
            current_time = next_time
            continue

        # Step 3: Choose which worker crosses based on rules
        if can_cross_right:
            # Worker crosses from right to left to pick up a box
            eff, idx, right, pick, left, put = heapq.heappop(wait_right)
            current_time += right  # Crossing time
            # Worker will be available on left after picking
            heapq.heappush(wait_left, (current_time + pick, eff, idx, right, pick, left, put))
            boxes_left -= 1
            boxes_on_left += 1
        else:
            # Worker crosses from left to right to deliver a box
            eff, idx, right, pick, left, put = heapq.heappop(wait_left)
            current_time += left  # Crossing time
            # Worker will be available on right after putting
            heapq.heappush(wait_right, (current_time + put, eff, idx, right, pick, left, put))
            boxes_on_left -= 1

    return current_time
```

```javascript
// Time: O((n + k) * log k) | Space: O(k)
var findCrossingTime = function (n, k, time) {
  // Min-heap implementation for JavaScript
  class MinHeap {
    constructor(compareFn) {
      this.heap = [];
      this.compare = compareFn || ((a, b) => a - b);
    }

    push(val) {
      this.heap.push(val);
      this.bubbleUp(this.heap.length - 1);
    }

    pop() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();

      const root = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.sinkDown(0);
      return root;
    }

    peek() {
      return this.heap.length > 0 ? this.heap[0] : null;
    }

    size() {
      return this.heap.length;
    }

    bubbleUp(index) {
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (this.compare(this.heap[index], this.heap[parent]) >= 0) break;
        [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
        index = parent;
      }
    }

    sinkDown(index) {
      const length = this.heap.length;
      while (true) {
        let left = 2 * index + 1;
        let right = 2 * index + 2;
        let swap = null;
        let element = this.heap[index];

        if (left < length && this.compare(this.heap[left], element) < 0) {
          swap = left;
        }

        if (right < length) {
          if (
            (swap === null && this.compare(this.heap[right], element) < 0) ||
            (swap !== null && this.compare(this.heap[right], this.heap[left]) < 0)
          ) {
            swap = right;
          }
        }

        if (swap === null) break;
        [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
        index = swap;
      }
    }
  }

  // Create workers with efficiency for priority comparison
  // We want workers with higher efficiency (lower right+left) to cross first
  // So we store negative efficiency in min-heap to get max efficiency first
  const workers = new MinHeap((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0]; // Compare efficiency
    return a[1] - b[1]; // Compare index for tie-breaking
  });

  for (let i = 0; i < k; i++) {
    const [right, pick, left, put] = time[i];
    // [efficiency, index, right, pick, left, put]
    workers.push([-(right + left), -i, right, pick, left, put]);
  }

  // Heaps for workers waiting on each side
  // Each element: [available_time, efficiency, index, right, pick, left, put]
  const waitLeft = new MinHeap((a, b) => a[0] - b[0]);
  const waitRight = new MinHeap((a, b) => a[0] - b[0]);

  // Initially all workers are on right side
  // Move them from workers heap to waitRight
  const initialWaitRight = new MinHeap((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1];
  });

  while (workers.size() > 0) {
    initialWaitRight.push(workers.pop());
  }

  let currentTime = 0;
  let boxesLeft = n;
  let boxesOnLeft = 0;

  while (boxesLeft > 0 || boxesOnLeft > 0) {
    // Move workers who finished tasks to appropriate waiting heaps
    while (waitLeft.size() > 0 && waitLeft.peek()[0] <= currentTime) {
      const worker = waitLeft.pop();
      // [available_time, efficiency, index, right, pick, left, put]
      initialWaitRight.push([worker[1], worker[2], worker[3], worker[4], worker[5], worker[6]]);
    }

    while (initialWaitRight.size() > 0 && initialWaitRight.peek()[0] <= currentTime) {
      const worker = initialWaitRight.pop();
      waitLeft.push([worker[1], worker[2], worker[3], worker[4], worker[5], worker[6]]);
    }

    // Check who can cross
    const canCrossRight = initialWaitRight.size() > 0 && boxesLeft > 0;
    const canCrossLeft = waitLeft.size() > 0 && boxesOnLeft > 0;

    if (!canCrossRight && !canCrossLeft) {
      // Fast forward to next available worker
      let nextTime = Infinity;
      if (waitLeft.size() > 0) nextTime = Math.min(nextTime, waitLeft.peek()[0]);
      if (initialWaitRight.size() > 0) nextTime = Math.min(nextTime, initialWaitRight.peek()[0]);
      currentTime = nextTime;
      continue;
    }

    if (canCrossRight) {
      // Worker crosses right to left
      const [eff, idx, right, pick, left, put] = initialWaitRight.pop();
      currentTime += right;
      // Worker will be available after picking
      waitLeft.push([currentTime + pick, eff, idx, right, pick, left, put]);
      boxesLeft--;
      boxesOnLeft++;
    } else {
      // Worker crosses left to right
      const [eff, idx, right, pick, left, put] = waitLeft.pop();
      currentTime += left;
      // Worker will be available after putting
      initialWaitRight.push([currentTime + put, eff, idx, right, pick, left, put]);
      boxesOnLeft--;
    }
  }

  return currentTime;
};
```

```java
// Time: O((n + k) * log k) | Space: O(k)
class Solution {
    public int findCrossingTime(int n, int k, int[][] time) {
        // Priority queue for workers waiting on left side (ready to cross right-to-left)
        // Stores: [available_time, efficiency, index, right, pick, left, put]
        PriorityQueue<int[]> waitLeft = new PriorityQueue<>((a, b) -> {
            if (a[0] != b[0]) return a[0] - b[0];  // Compare available time
            return 0;
        });

        // Priority queue for workers waiting on right side (ready to cross left-to-right)
        // We need to get worker with highest efficiency first, so use custom comparator
        PriorityQueue<int[]> waitRight = new PriorityQueue<>((a, b) -> {
            if (a[1] != b[1]) return b[1] - a[1];  // Higher efficiency first
            return b[2] - a[2];  // Higher index first for tie-breaking
        });

        // Initialize all workers on right side
        for (int i = 0; i < k; i++) {
            int right = time[i][0];
            int pick = time[i][1];
            int left = time[i][2];
            int put = time[i][3];
            int efficiency = right + left;  // Lower is better for crossing

            // [available_time, efficiency, index, right, pick, left, put]
            // Initially available at time 0, on right side
            waitRight.offer(new int[]{0, -efficiency, -i, right, pick, left, put});
        }

        int currentTime = 0;
        int boxesLeft = n;
        int boxesOnLeft = 0;  // Boxes picked but not yet delivered

        while (boxesLeft > 0 || boxesOnLeft > 0) {
            // Move workers who finished tasks to appropriate waiting queues
            while (!waitLeft.isEmpty() && waitLeft.peek()[0] <= currentTime) {
                int[] worker = waitLeft.poll();
                // Change to waitRight queue
                waitRight.offer(new int[]{worker[1], worker[2], worker[3],
                                         worker[4], worker[5], worker[6]});
            }

            while (!waitRight.isEmpty() && waitRight.peek()[0] <= currentTime) {
                int[] worker = waitRight.poll();
                waitLeft.offer(new int[]{worker[1], worker[2], worker[3],
                                        worker[4], worker[5], worker[6]});
            }

            // Check who can cross the bridge
            boolean canCrossRight = !waitRight.isEmpty() && boxesLeft > 0;
            boolean canCrossLeft = !waitLeft.isEmpty() && boxesOnLeft > 0;

            if (!canCrossRight && !canCrossLeft) {
                // Fast forward to next available worker
                int nextTime = Integer.MAX_VALUE;
                if (!waitLeft.isEmpty()) nextTime = Math.min(nextTime, waitLeft.peek()[0]);
                if (!waitRight.isEmpty()) nextTime = Math.min(nextTime, waitRight.peek()[0]);
                currentTime = nextTime;
                continue;
            }

            if (canCrossRight) {
                // Worker crosses from right to left
                int[] worker = waitRight.poll();
                int rightTime = worker[3];
                int pickTime = worker[4];
                int leftTime = worker[5];
                int putTime = worker[6];

                currentTime += rightTime;

                // Worker will be available on left after picking
                waitLeft.offer(new int[]{currentTime + pickTime, worker[1], worker[2],
                                        rightTime, pickTime, leftTime, putTime});
                boxesLeft--;
                boxesOnLeft++;
            } else {
                // Worker crosses from left to right
                int[] worker = waitLeft.poll();
                int rightTime = worker[3];
                int pickTime = worker[4];
                int leftTime = worker[5];
                int putTime = worker[6];

                currentTime += leftTime;

                // Worker will be available on right after putting
                waitRight.offer(new int[]{currentTime + putTime, worker[1], worker[2],
                                         rightTime, pickTime, leftTime, putTime});
                boxesOnLeft--;
            }
        }

        return currentTime;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + k) \* log k)

- We process each of the `n` boxes exactly once (each requires two crossings)
- We also handle `k` workers moving between states
- Each heap operation (push/pop) takes O(log k) time
- In total: O((n + k) \* log k) operations

**Space Complexity:** O(k)

- We maintain up to `k` workers across our heaps
- Each heap stores worker information (constant amount per worker)
- Total space: O(k) for the heaps

## Common Mistakes

1. **Forgetting to handle the bridge constraint properly**: The bridge can only hold one person at a time. Some candidates try to process multiple crossings simultaneously. Always check bridge availability before allowing any crossing.

2. **Incorrect priority when choosing which worker crosses**: When multiple workers are waiting, the one with highest efficiency (lowest sum of crossing times) should go first. Getting the comparator wrong leads to suboptimal scheduling.

3. **Not tracking boxes correctly**: You need to track both `boxes_left` (on right side) and `boxes_on_left` (picked but not delivered). Forgetting either leads to incorrect termination or logic errors.

4. **Infinite loop when no one can cross**: If all workers are busy and bridge is free, you need to fast-forward time to when the next worker becomes available. Missing this causes infinite loops.

## When You'll See This Pattern

This problem combines **priority queue simulation** with **resource scheduling** - a common pattern in hard interview problems:

1. **The Latest Time to Catch a Bus**: Similar scheduling problem where you need to coordinate multiple buses and passengers with timing constraints.

2. **Total Cost to Hire K Workers**: Uses heaps to efficiently select workers based on cost, similar to how we select workers based on efficiency here.

3. **Meeting Rooms II/III**: Scheduling problems that use priority queues to track resource availability over time.

The core pattern is: when you need to simulate a process where entities compete for limited resources over time, and you always want the "best" available entity, think priority queues.

## Key Takeaways

1. **Multi-resource scheduling often requires multiple heaps**: When entities move between different states (left/right sides), maintain separate heaps for each state.

2. **Simulation problems need careful time management**: You'll often need to "fast forward" time when no actions are possible, rather than incrementing by 1.

3. **Tie-breaking matters**: Real interview problems often have specific rules for breaking ties (worker index here). Don't overlook these details.

Related problems: [The Latest Time to Catch a Bus](/problem/the-latest-time-to-catch-a-bus), [Total Cost to Hire K Workers](/problem/total-cost-to-hire-k-workers)
