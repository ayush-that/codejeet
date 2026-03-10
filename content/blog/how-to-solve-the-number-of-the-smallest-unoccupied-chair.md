---
title: "How to Solve The Number of the Smallest Unoccupied Chair — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode The Number of the Smallest Unoccupied Chair. Medium difficulty, 60.4% acceptance rate. Topics: Array, Hash Table, Heap (Priority Queue)."
date: "2027-01-04"
category: "dsa-patterns"
tags:
  [
    "the-number-of-the-smallest-unoccupied-chair",
    "array",
    "hash-table",
    "heap-(priority-queue)",
    "medium",
  ]
---

# How to Solve "The Number of the Smallest Unoccupied Chair"

This problem simulates a party where friends arrive and leave at specific times, always sitting in the smallest-numbered available chair. The challenge is tracking which chairs become available when friends leave and efficiently finding the smallest unoccupied chair for arriving friends. What makes this tricky is that we need to handle dynamic events (arrivals and departures) in chronological order while maintaining the state of available chairs.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
times = [[1,4], [2,3], [4,6]]
targetFriend = 0
```

We have 3 friends (0, 1, 2) with arrival/departure times:

- Friend 0: arrives at time 1, leaves at time 4
- Friend 1: arrives at time 2, leaves at time 3
- Friend 2: arrives at time 4, leaves at time 6

**Step-by-step simulation:**

1. **Time 1:** Friend 0 arrives. All chairs are empty. Smallest available chair is 0. Friend 0 sits on chair 0.
   - Available chairs: {1, 2, 3, ...}
   - Occupied: {0: friend 0 (leaves at 4)}

2. **Time 2:** Friend 1 arrives. Chair 0 is occupied. Smallest available chair is 1. Friend 1 sits on chair 1.
   - Available chairs: {2, 3, 4, ...}
   - Occupied: {0: friend 0 (leaves at 4), 1: friend 1 (leaves at 3)}

3. **Time 3:** Friend 1 leaves (departure time 3). Chair 1 becomes available.
   - Available chairs: {1, 2, 3, ...}
   - Occupied: {0: friend 0 (leaves at 4)}

4. **Time 4:** Two events happen:
   - First, Friend 0 leaves (departure time 4). Chair 0 becomes available.
   - Then, Friend 2 arrives. Smallest available chair is now 0. Friend 2 sits on chair 0.
   - Available chairs: {1, 2, 3, ...}
   - Occupied: {0: friend 2 (leaves at 6)}

Since targetFriend is 0, and friend 0 sat on chair 0, the answer is **0**.

The key insight: we need to process events in time order, and when a friend arrives, we need the smallest-numbered chair that's currently available.

## Brute Force Approach

A naive approach would be to simulate time from the earliest arrival to the latest departure:

1. Sort friends by arrival time
2. For each time unit from min arrival to max departure:
   - Check if any friend leaves at this time and free their chair
   - Check if any friend arrives at this time and assign them the smallest available chair
3. Track which chair the target friend gets

**Why this fails:**

- Time values can be up to 10^5, and we might need to iterate through all time units
- Finding the smallest available chair would require scanning all chairs each time
- Overall complexity could be O(max_time × n), which is far too slow

Even a slightly better brute force that only processes arrival/departure events would still need to scan all chairs to find the smallest available one, giving us O(n²) time complexity.

## Optimized Approach

The key insight is that we need two efficient operations:

1. **When a friend arrives:** Find the smallest available chair number
2. **When a friend leaves:** Add their chair back to the available pool

This is a perfect use case for a **min-heap (priority queue)** for available chairs. A min-heap gives us the smallest available chair in O(log n) time.

We also need to process events in chronological order. Since arrivals and departures can happen at the same time (departures first, then arrivals according to the problem), we should:

1. Sort all events (arrivals and departures) by time
2. For events at the same time, process departures before arrivals
3. Use a min-heap to track available chairs
4. Use another min-heap to track when occupied chairs will be freed

The second min-heap (for occupied chairs) stores pairs of (departure_time, chair_number). When we process an event at time `t`, we first check if any friends should have left by now (departure_time ≤ t) and free their chairs.

## Optimal Solution

Here's the step-by-step algorithm:

1. **Preprocess the data:** Store each friend's index with their times
2. **Create events:** For each friend, create arrival and departure events
3. **Sort events:** By time, with departures before arrivals at the same time
4. **Initialize data structures:**
   - `available_chairs`: min-heap of available chair numbers
   - `occupied_chairs`: min-heap of (departure_time, chair_number)
   - `friend_to_chair`: array to track which chair each friend gets
5. **Process events in order:**
   - For departure events: push the chair back to `available_chairs`
   - For arrival events:
     - Free any chairs where departure_time ≤ current_time
     - Get smallest chair from `available_chairs` (or use next new chair if heap is empty)
     - Assign chair to friend
     - Push (departure_time, chair) to `occupied_chairs`
6. **Return** the chair assigned to `targetFriend`

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def smallestChair(self, times, targetFriend):
    """
    Finds the chair number that the target friend will sit on.

    Args:
        times: List of [arrival_i, departure_i] for each friend
        targetFriend: Index of the friend we're interested in

    Returns:
        The chair number assigned to targetFriend
    """
    n = len(times)

    # Step 1: Create events with friend indices
    # Each event is (time, type, friend_index)
    # type: 0 for departure, 1 for arrival (so departures come first when sorted)
    events = []
    for i in range(n):
        arrival, departure = times[i]
        events.append((arrival, 1, i))      # Arrival event
        events.append((departure, 0, i))    # Departure event

    # Step 2: Sort events by time, then by type (departures before arrivals)
    events.sort()

    # Step 3: Initialize data structures
    import heapq
    available_chairs = []           # Min-heap of available chair numbers
    occupied_chairs = []            # Min-heap of (departure_time, chair_number)
    friend_to_chair = [0] * n       # Track which chair each friend gets
    next_chair = 0                  # Next new chair number to use if none available

    # Step 4: Process events in chronological order
    for time, event_type, friend_idx in events:
        if event_type == 0:  # Departure event
            # Free the chair this friend was using
            chair = friend_to_chair[friend_idx]
            heapq.heappush(available_chairs, chair)
        else:  # Arrival event (event_type == 1)
            # First, free any chairs where friends have left by this time
            while occupied_chairs and occupied_chairs[0][0] <= time:
                # Free the chair from the earliest departure
                _, freed_chair = heapq.heappop(occupied_chairs)
                heapq.heappush(available_chairs, freed_chair)

            # Get the smallest available chair
            if available_chairs:
                chair = heapq.heappop(available_chairs)
            else:
                # No chairs available, use a new one
                chair = next_chair
                next_chair += 1

            # Assign this chair to the arriving friend
            friend_to_chair[friend_idx] = chair

            # If this is our target friend, we could return early
            # But we need to process all events to maintain correct state
            if friend_idx == targetFriend:
                # We could return here, but let's complete the simulation
                # for clarity in the algorithm
                pass

            # Mark this chair as occupied until friend's departure time
            departure_time = times[friend_idx][1]
            heapq.heappush(occupied_chairs, (departure_time, chair))

    # Return the chair assigned to our target friend
    return friend_to_chair[targetFriend]
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Finds the chair number that the target friend will sit on.
 * @param {number[][]} times - Array of [arrival_i, departure_i] for each friend
 * @param {number} targetFriend - Index of the friend we're interested in
 * @return {number} The chair number assigned to targetFriend
 */
var smallestChair = function (times, targetFriend) {
  const n = times.length;

  // Step 1: Create events with friend indices
  // Each event is [time, type, friendIndex]
  // type: 0 for departure, 1 for arrival (departures come first when sorted)
  const events = [];
  for (let i = 0; i < n; i++) {
    const [arrival, departure] = times[i];
    events.push([arrival, 1, i]); // Arrival event
    events.push([departure, 0, i]); // Departure event
  }

  // Step 2: Sort events by time, then by type
  events.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0]; // Sort by time first
    return a[1] - b[1]; // Then by type (0 before 1)
  });

  // Step 3: Initialize data structures
  const availableChairs = new MinHeap(); // Min-heap of available chair numbers
  const occupiedChairs = new MinHeap((a, b) => a[0] - b[0]); // Min-heap by departure time
  const friendToChair = new Array(n).fill(0); // Track which chair each friend gets
  let nextChair = 0; // Next new chair number

  // Step 4: Process events in chronological order
  for (const [time, eventType, friendIdx] of events) {
    if (eventType === 0) {
      // Departure event
      // Free the chair this friend was using
      const chair = friendToChair[friendIdx];
      availableChairs.push(chair);
    } else {
      // Arrival event
      // First, free any chairs where friends have left by this time
      while (!occupiedChairs.isEmpty() && occupiedChairs.peek()[0] <= time) {
        const [, freedChair] = occupiedChairs.pop();
        availableChairs.push(freedChair);
      }

      // Get the smallest available chair
      let chair;
      if (!availableChairs.isEmpty()) {
        chair = availableChairs.pop();
      } else {
        // No chairs available, use a new one
        chair = nextChair;
        nextChair++;
      }

      // Assign this chair to the arriving friend
      friendToChair[friendIdx] = chair;

      // Mark this chair as occupied until friend's departure time
      const departureTime = times[friendIdx][1];
      occupiedChairs.push([departureTime, chair]);
    }
  }

  // Return the chair assigned to our target friend
  return friendToChair[targetFriend];
};

// MinHeap implementation for JavaScript
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
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
    this.bubbleDown(0);
    return root;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    const last = this.heap.length - 1;
    while (true) {
      let left = index * 2 + 1;
      let right = index * 2 + 2;
      let smallest = index;

      if (left <= last && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right <= last && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
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
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Finds the chair number that the target friend will sit on.
     * @param times Array of [arrival_i, departure_i] for each friend
     * @param targetFriend Index of the friend we're interested in
     * @return The chair number assigned to targetFriend
     */
    public int smallestChair(int[][] times, int targetFriend) {
        int n = times.length;

        // Step 1: Create events with friend indices
        // Each event is an array: [time, type, friendIndex]
        // type: 0 for departure, 1 for arrival (departures come first when sorted)
        List<int[]> events = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int arrival = times[i][0];
            int departure = times[i][1];
            events.add(new int[]{arrival, 1, i});      // Arrival event
            events.add(new int[]{departure, 0, i});    // Departure event
        }

        // Step 2: Sort events by time, then by type
        Collections.sort(events, (a, b) -> {
            if (a[0] != b[0]) return Integer.compare(a[0], b[0]);  // Sort by time first
            return Integer.compare(a[1], b[1]);                     // Then by type (0 before 1)
        });

        // Step 3: Initialize data structures
        PriorityQueue<Integer> availableChairs = new PriorityQueue<>();  // Min-heap of chair numbers
        PriorityQueue<int[]> occupiedChairs = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));  // Min-heap by departure time
        int[] friendToChair = new int[n];  // Track which chair each friend gets
        int nextChair = 0;  // Next new chair number

        // Step 4: Process events in chronological order
        for (int[] event : events) {
            int time = event[0];
            int eventType = event[1];
            int friendIdx = event[2];

            if (eventType == 0) {  // Departure event
                // Free the chair this friend was using
                int chair = friendToChair[friendIdx];
                availableChairs.offer(chair);
            } else {  // Arrival event
                // First, free any chairs where friends have left by this time
                while (!occupiedChairs.isEmpty() && occupiedChairs.peek()[0] <= time) {
                    int[] freed = occupiedChairs.poll();
                    int freedChair = freed[1];
                    availableChairs.offer(freedChair);
                }

                // Get the smallest available chair
                int chair;
                if (!availableChairs.isEmpty()) {
                    chair = availableChairs.poll();
                } else {
                    // No chairs available, use a new one
                    chair = nextChair;
                    nextChair++;
                }

                // Assign this chair to the arriving friend
                friendToChair[friendIdx] = chair;

                // Mark this chair as occupied until friend's departure time
                int departureTime = times[friendIdx][1];
                occupiedChairs.offer(new int[]{departureTime, chair});
            }
        }

        // Return the chair assigned to our target friend
        return friendToChair[targetFriend];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Creating events: O(n)
- Sorting events: O(2n log 2n) = O(n log n)
- Processing each event: O(log n) for heap operations
- Total: O(n log n) dominated by sorting

**Space Complexity: O(n)**

- Events array: O(2n) = O(n)
- Heaps: O(n) total
- friendToChair array: O(n)
- Total: O(n)

## Common Mistakes

1. **Not handling simultaneous events correctly:** When arrival and departure happen at the same time, departures must be processed first. Otherwise, a friend might not get the chair that just became available.

2. **Using the wrong data structure for available chairs:** Candidates sometimes try to use a simple array or set and scan for the smallest available chair each time (O(n) per operation). The min-heap is crucial for O(log n) operations.

3. **Forgetting to free chairs when processing arrivals:** Before assigning a chair to an arriving friend, we need to check if any friends should have left by now. This requires checking the occupied_chairs heap.

4. **Not tracking which chair each friend gets:** We need the `friend_to_chair` array to know which chair to free when a friend departs. Without this, we can't properly manage the available chairs heap.

## When You'll See This Pattern

This problem combines **event-driven simulation** with **priority queue management**, a pattern common in scheduling problems:

1. **Meeting Rooms II (LeetCode 253)** - Similar concept of tracking resource usage over time, needing to know the maximum number of concurrent meetings/chair usage.

2. **Car Fleet (LeetCode 853)** - Events (cars reaching target) processed in order, though with different merging logic.

3. **Exam Room (LeetCode 855)** - Also involves finding the "best" available seat, though with different criteria (maximizing distance from others).

The core pattern: when you need to process events in time order and efficiently manage resources (find smallest/earliest/best available), think about sorting events and using heaps.

## Key Takeaways

1. **Event-driven problems often benefit from sorting all events** (both starts and ends) and processing them in chronological order with proper tie-breaking rules.

2. **When you need the "smallest available" resource repeatedly, a min-heap is ideal** - it gives O(log n) access to the minimum element and O(log n) insertion.

3. **Maintain separate heaps for different purposes** - one for available resources, another for tracking when occupied resources will become available. This separation of concerns simplifies the logic.

[Practice this problem on CodeJeet](/problem/the-number-of-the-smallest-unoccupied-chair)
