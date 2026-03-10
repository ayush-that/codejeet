---
title: "How to Solve Maximum Number of Events That Can Be Attended — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Number of Events That Can Be Attended. Medium difficulty, 38.9% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue)."
date: "2028-07-18"
category: "dsa-patterns"
tags: ["maximum-number-of-events-that-can-be-attended", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximum Number of Events That Can Be Attended

This problem asks us to maximize the number of events we can attend when each event spans multiple days, but we can only attend one event per day. The tricky part is that we have flexibility—for an event running from day 2 to day 5, we can choose any single day within that range to attend it. This flexibility is what makes the greedy approach work, but also what makes the problem interesting compared to simpler interval scheduling problems.

## Visual Walkthrough

Let's trace through a concrete example: `events = [[1,2],[2,3],[3,4],[1,2]]`

**Step 1: Sort events by start day**
Sorted: `[[1,2],[1,2],[2,3],[3,4]]`

**Step 2: Process days from earliest to latest**
We'll use a min-heap to track available events and always attend the one ending soonest.

- **Day 1**: Events starting today: `[1,2]` and `[1,2]`. Add both to heap (by end day). Heap: `[2, 2]`. Attend one event ending on day 2. Count = 1.
- **Day 2**: Events starting today: `[2,3]`. Add to heap. Heap: `[2, 3]`. Remove expired events (end day < 2). Heap becomes `[2, 3]`. Attend event ending on day 2. Count = 2.
- **Day 3**: Events starting today: `[3,4]`. Add to heap. Heap: `[3, 4]`. Remove expired events (end day < 3). Heap becomes `[3, 4]`. Attend event ending on day 3. Count = 3.
- **Day 4**: No new events. Remove expired events (end day < 4). Heap becomes `[4]`. Attend event ending on day 4. Count = 4.

Result: We can attend all 4 events.

## Brute Force Approach

A naive approach would be to try all possible combinations of event-day assignments. For each event with duration d days, we have d possible days to attend it. We could use backtracking to try all combinations, checking for conflicts where two events use the same day.

The complexity would be exponential: O(d^n) where d is the average duration and n is the number of events. Even for moderate inputs (n=20, d=5), that's 5^20 ≈ 9.5×10^13 operations—completely infeasible.

Another naive approach might be to always attend events in chronological order by start day, but this fails because we might use up a day on a long event when we could have used it for a short one. For example: `[[1,10],[2,2],[3,3]]`. If we attend `[1,10]` on day 1, we miss both other events. The optimal solution is to skip the long event and attend the two short ones.

## Optimized Approach

The key insight is a **greedy strategy**: on each day, attend the event that ends the soonest among those currently available. This works because:

1. We want to leave later days available for events that might need them
2. An event ending sooner has fewer options for when it can be attended
3. By attending the soonest-ending event first, we maximize future flexibility

**Step-by-step reasoning:**

1. **Sort events by start day** so we can efficiently find which events become available each day
2. **Process days sequentially** from the earliest start to the latest end
3. **Use a min-heap** to track available events by their end day
4. **Each day**:
   - Add all events starting today to the heap
   - Remove any events that have already ended (end day < current day)
   - If the heap has events, attend one (the one ending soonest, at heap root)
   - Increment count and move to next day

We need to be careful about the range of days to process. The maximum day we need to consider is the maximum end day among all events, but we can stop early if we run out of events.

## Optimal Solution

<div class="code-group">

```python
# Time: O(D + N log N) where D is the range of days, N is number of events
# Space: O(N) for the heap and sorting
def maxEvents(events):
    """
    Returns the maximum number of events that can be attended.

    Strategy: Greedy approach - each day, attend the event that ends the soonest
    among those currently available.
    """
    # Sort events by their start day so we can process them in order
    events.sort(key=lambda x: x[0])

    # Min-heap to store end days of available events
    import heapq
    heap = []

    # Pointer to track which events we've added to the heap
    event_idx = 0
    n = len(events)

    # Find the maximum day we need to consider
    max_day = max(end for _, end in events)

    count = 0

    # Process each day from the earliest start to the latest end
    for day in range(1, max_day + 1):
        # Step 1: Add all events that start on this day to the heap
        while event_idx < n and events[event_idx][0] == day:
            # Push the end day of the event to the heap
            heapq.heappush(heap, events[event_idx][1])
            event_idx += 1

        # Step 2: Remove events that have already ended (end day < current day)
        while heap and heap[0] < day:
            heapq.heappop(heap)

        # Step 3: If there are available events, attend one (the one ending soonest)
        if heap:
            heapq.heappop(heap)  # Attend this event
            count += 1

        # Optimization: If we've processed all events and heap is empty, we can stop
        if event_idx == n and not heap:
            break

    return count
```

```javascript
// Time: O(D + N log N) where D is the range of days, N is number of events
// Space: O(N) for the heap and sorting
function maxEvents(events) {
  /**
   * Returns the maximum number of events that can be attended.
   *
   * Strategy: Greedy approach - each day, attend the event that ends the soonest
   * among those currently available.
   */

  // Sort events by their start day so we can process them in order
  events.sort((a, b) => a[0] - b[0]);

  // Min-heap to store end days of available events
  const heap = new MinHeap();

  // Pointer to track which events we've added to the heap
  let eventIdx = 0;
  const n = events.length;

  // Find the maximum day we need to consider
  let maxDay = 0;
  for (const [_, end] of events) {
    maxDay = Math.max(maxDay, end);
  }

  let count = 0;

  // Process each day from the earliest start to the latest end
  for (let day = 1; day <= maxDay; day++) {
    // Step 1: Add all events that start on this day to the heap
    while (eventIdx < n && events[eventIdx][0] === day) {
      // Push the end day of the event to the heap
      heap.push(events[eventIdx][1]);
      eventIdx++;
    }

    // Step 2: Remove events that have already ended (end day < current day)
    while (heap.size() > 0 && heap.peek() < day) {
      heap.pop();
    }

    // Step 3: If there are available events, attend one (the one ending soonest)
    if (heap.size() > 0) {
      heap.pop(); // Attend this event
      count++;
    }

    // Optimization: If we've processed all events and heap is empty, we can stop
    if (eventIdx === n && heap.size() === 0) {
      break;
    }
  }

  return count;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return root;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent] <= this.heap[index]) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  _bubbleDown(index) {
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

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O(D + N log N) where D is the range of days, N is number of events
// Space: O(N) for the heap and sorting
import java.util.*;

class Solution {
    public int maxEvents(int[][] events) {
        /**
         * Returns the maximum number of events that can be attended.
         *
         * Strategy: Greedy approach - each day, attend the event that ends the soonest
         * among those currently available.
         */

        // Sort events by their start day so we can process them in order
        Arrays.sort(events, (a, b) -> Integer.compare(a[0], b[0]));

        // Min-heap to store end days of available events
        PriorityQueue<Integer> heap = new PriorityQueue<>();

        // Pointer to track which events we've added to the heap
        int eventIdx = 0;
        int n = events.length;

        // Find the maximum day we need to consider
        int maxDay = 0;
        for (int[] event : events) {
            maxDay = Math.max(maxDay, event[1]);
        }

        int count = 0;

        // Process each day from the earliest start to the latest end
        for (int day = 1; day <= maxDay; day++) {
            // Step 1: Add all events that start on this day to the heap
            while (eventIdx < n && events[eventIdx][0] == day) {
                // Push the end day of the event to the heap
                heap.offer(events[eventIdx][1]);
                eventIdx++;
            }

            // Step 2: Remove events that have already ended (end day < current day)
            while (!heap.isEmpty() && heap.peek() < day) {
                heap.poll();
            }

            // Step 3: If there are available events, attend one (the one ending soonest)
            if (!heap.isEmpty()) {
                heap.poll();  // Attend this event
                count++;
            }

            // Optimization: If we've processed all events and heap is empty, we can stop
            if (eventIdx == n && heap.isEmpty()) {
                break;
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(D + N log N)**

- Sorting the events takes O(N log N)
- Processing each day takes O(D) in the worst case, where D is the range from day 1 to max end day
- Each event is added to the heap once (O(log N)) and removed once (O(log N))
- The total is O(N log N + D), but in practice D ≤ 10^5 and N ≤ 10^5, so this is efficient

**Space Complexity: O(N)**

- We store all events in a sorted array: O(N)
- The heap can contain up to N elements in the worst case: O(N)
- Total: O(N)

## Common Mistakes

1. **Forgetting to remove expired events from the heap**: Each day, you must clean out events whose end day has passed. If you don't, you might try to attend events that are no longer available.

2. **Processing days beyond the maximum end day**: Some candidates continue processing days indefinitely. We only need to process up to the maximum end day, and we can stop early if all events are processed and the heap is empty.

3. **Incorrect sorting**: Sorting by end day instead of start day breaks the algorithm. We need to process events by start day to know when they become available. The heap handles ordering by end day for selection.

4. **Off-by-one errors with day ranges**: The problem states days are 1-indexed (startDayi >= 1). Starting your loop from 0 instead of 1 will cause issues.

## When You'll See This Pattern

This "greedy with heap" pattern appears in scheduling problems where you need to maximize throughput while respecting constraints:

1. **Meeting Rooms II (LeetCode 253)**: Similar concept of scheduling meetings in rooms, but here you're counting rooms instead of events attended.

2. **Maximum Profit in Job Scheduling (LeetCode 1235)**: A more complex version where events have weights (profits) and you need to maximize total profit rather than count.

3. **Course Schedule III (LeetCode 630)**: Schedule courses with durations and deadlines to maximize the number taken—uses the same "always take the shortest duration first" heuristic.

The core pattern is: **sort by one dimension (start time), then use a heap to dynamically select the best option based on another dimension (end time)**.

## Key Takeaways

1. **Greedy with heap is powerful for interval scheduling**: When you need to make a series of choices and always want the "most urgent" option, a min-heap lets you efficiently track and select it.

2. **Flexibility enables greedy strategies**: The fact that we can attend an event on any day within its range is what makes the "attend soonest-ending event" strategy optimal. Without this flexibility, the problem would be much harder.

3. **Two-dimensional sorting**: Often in interval problems, you sort by one dimension and use a data structure to manage the other dimension. Here: sort by start time, manage by end time using a heap.

Related problems: [Maximum Number of Events That Can Be Attended II](/problem/maximum-number-of-events-that-can-be-attended-ii), [Maximum Earnings From Taxi](/problem/maximum-earnings-from-taxi), [Meeting Rooms III](/problem/meeting-rooms-iii)
