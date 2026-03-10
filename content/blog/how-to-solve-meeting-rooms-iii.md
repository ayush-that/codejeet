---
title: "How to Solve Meeting Rooms III — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Meeting Rooms III. Hard difficulty, 51.6% acceptance rate. Topics: Array, Hash Table, Sorting, Heap (Priority Queue), Simulation."
date: "2028-01-27"
category: "dsa-patterns"
tags: ["meeting-rooms-iii", "array", "hash-table", "sorting", "hard"]
---

# How to Solve Meeting Rooms III

Meeting Rooms III is a challenging scheduling problem where you need to determine which room holds the most meetings when given `n` rooms and a list of meeting intervals. The twist is that meetings must be assigned to the lowest-numbered available room when they start, and when a room becomes free, the next meeting that can fit should be assigned immediately. This combination of room selection rules and overlapping intervals makes it tricky—you need to track both available rooms and ongoing meetings efficiently.

## Visual Walkthrough

Let's walk through a small example:  
`n = 2`, `meetings = [[0,10],[1,5],[2,7],[3,4]]`

We have 2 rooms (0 and 1). Meetings start at unique times: 0, 1, 2, and 3.

**Step 1:** Meeting [0,10] starts at time 0. Both rooms are free. Pick the lowest-numbered room (room 0). Room 0 is now occupied until time 10.

**Step 2:** Meeting [1,5] starts at time 1. Room 0 is busy, but room 1 is free. Assign to room 1. Room 1 occupied until time 5.

**Step 3:** Meeting [2,7] starts at time 2. Both rooms are busy. We need to wait for the earliest ending meeting. Room 1 ends at 5, room 0 ends at 10. The earliest end time is 5. So we fast-forward time to 5, freeing room 1. Now assign meeting [2,7] to the lowest free room (room 1). Room 1 now ends at 7 (2 + (7-2) = 7, but since we advanced time to 5, the meeting actually runs from 5 to 10? Wait—careful! The meeting duration is fixed: it's scheduled for [2,7), duration 5. If it starts at time 5, it should end at 10? No—the meeting has a fixed end time of 7. If we delay its start to 5, it should still end at 7, meaning its duration becomes 2, not 5. That's incorrect.

Actually, the problem states: meetings are scheduled during `[start_i, end_i)`. If a meeting is delayed, its end time remains `end_i` (it doesn't shift). So when we assign a delayed meeting, it runs from `current_time` to `end_i`. Let's correct:

At time 2, both rooms busy. Earliest end is 5 (room 1). Advance time to 5, free room 1. Meeting [2,7] now starts at 5, ends at 7 (its original end time). Assign to room 1 (lowest free). Room 1 occupied until 7.

**Step 4:** Meeting [3,4] starts at time 3. Currently, time is 5 from previous step. So this meeting should have been considered earlier? We process meetings in start time order. At time 3, both rooms were busy. The earliest end was 5. So we advance time to 5, free room 1. But before assigning the next meeting, we should check if any meetings have start times ≤ current time (5). Meeting [3,4] has start 3 ≤ 5, so it should be assigned now. However, its end time is 4, which is already past at time 5. That means this meeting would have ended before we even reached it—so it never actually occurs? The problem likely expects that if a meeting's end time is ≤ current time when we try to assign it, it's simply skipped (it couldn't be held). Let's assume that.

So at time 5, we have two meetings waiting: [2,7] and [3,4]. We assign the one with earlier start time first? Actually, we should process meetings sorted by start time. So we take the next unassigned meeting: [2,7] (start 2). Assign it as above. Then next meeting [3,4] (start 3). At time 5, its end time 4 < 5, so it's skipped.

Finally, room 0 holds 1 meeting, room 1 holds 2 meetings. Room 1 has the most meetings.

This illustrates the complexity: we need to manage time jumps, room availability, and meeting delays correctly.

## Brute Force Approach

A brute force approach would simulate every time unit from the earliest start to the latest end. For each time unit, check which meetings start, which rooms become free, and assign meetings to free rooms in room number order. This is extremely inefficient—time complexity O(T _ n) where T is the total time span, which can be huge (up to 10^9). Even with optimization to only check event times, a naive simulation that iterates through all meetings repeatedly would be O(m^2 _ n), still too slow for constraints (m up to 10^5).

The key inefficiency is checking all rooms and meetings repeatedly. We need data structures to quickly find the earliest ending meeting and the lowest free room.

## Optimized Approach

The optimal approach uses two heaps (priority queues) and sorting:

1. **Sort meetings by start time** so we process them in chronological order.
2. **Use a min-heap `busy`** to track rooms in use: each entry is `(end_time, room_number)`. This lets us quickly find the next room to become free.
3. **Use a min-heap `available`** to track free rooms: stores room numbers so the lowest-numbered free room is at the top.
4. **Initialize** all rooms as available (0 to n-1 in a heap).
5. **Iterate through sorted meetings**:
   - Before assigning the current meeting, advance time to its start time (or beyond if busy rooms end earlier).
   - Free all rooms that have ended by this time (pop from `busy` heap, push room number to `available`).
   - If no room is free, we need to delay the meeting: pop the earliest ending room from `busy`, advance time to its end time, free that room, then assign the meeting (which will now start at this advanced time).
   - Assign the meeting to the lowest free room (pop from `available`), push to `busy` heap with end time (if meeting was delayed, end time is original `end_i`; if not delayed, end time is `start_i + duration`).
   - Increment meeting count for the assigned room.
6. **Track meeting counts per room** and find the room with maximum meetings (lowest room number tie-breaker).

The insight is that we don't need to simulate every time unit—we only need to jump to the next "event": either a meeting start or a room becoming free. The heaps let us manage these events efficiently.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(m log m + m log n) where m = len(meetings), n = number of rooms
# Space: O(n + m) for heaps and count array
def mostBooked(self, n: int, meetings: List[List[int]]) -> int:
    # Sort meetings by start time to process in order
    meetings.sort(key=lambda x: x[0])

    # Min-heap for available rooms (stores room numbers)
    available = list(range(n))
    heapq.heapify(available)

    # Min-heap for busy rooms: (end_time, room_number)
    busy = []  # Python heap is min-heap by default

    # Array to count meetings per room
    count = [0] * n

    # Process each meeting in start time order
    for start, end in meetings:
        # Free all rooms that have finished by current meeting start time
        while busy and busy[0][0] <= start:
            _, room = heapq.heappop(busy)
            heapq.heappush(available, room)

        # If no room is available, we need to delay this meeting
        if not available:
            # Get the earliest ending room
            earliest_end, room = heapq.heappop(busy)
            # The meeting will start when this room frees up
            # But we must keep the original duration: end - start
            duration = end - start
            # New start time is when the room becomes free
            new_start = earliest_end
            # End time preserves original duration from new start
            new_end = new_start + duration
            # Push the room back to busy with new end time
            heapq.heappush(busy, (new_end, room))
            # Increment count for this room
            count[room] += 1
        else:
            # Get the lowest-numbered available room
            room = heapq.heappop(available)
            # Meeting starts on time, ends at original end time
            heapq.heappush(busy, (end, room))
            count[room] += 1

    # Find room with maximum meetings (break ties by lowest room number)
    max_count = max(count)
    for room in range(n):
        if count[room] == max_count:
            return room
```

```javascript
// Time: O(m log m + m log n) where m = meetings.length, n = number of rooms
// Space: O(n + m) for heaps and count array
function mostBooked(n, meetings) {
  // Sort meetings by start time
  meetings.sort((a, b) => a[0] - b[0]);

  // Min-heap for available rooms (stores room numbers)
  const available = new MinHeap();
  for (let i = 0; i < n; i++) {
    available.push(i);
  }

  // Min-heap for busy rooms: [endTime, roomNumber]
  const busy = new MinHeap((a, b) => a[0] - b[0]);

  // Array to count meetings per room
  const count = new Array(n).fill(0);

  // Process each meeting
  for (const [start, end] of meetings) {
    // Free rooms that have finished by current meeting start time
    while (busy.size() > 0 && busy.peek()[0] <= start) {
      const [, room] = busy.pop();
      available.push(room);
    }

    // If no room available, delay the meeting
    if (available.size() === 0) {
      const [earliestEnd, room] = busy.pop();
      const duration = end - start;
      const newEnd = earliestEnd + duration;
      busy.push([newEnd, room]);
      count[room]++;
    } else {
      // Get lowest-numbered available room
      const room = available.pop();
      busy.push([end, room]);
      count[room]++;
    }
  }

  // Find room with maximum meetings
  let maxRoom = 0;
  for (let i = 0; i < n; i++) {
    if (count[i] > count[maxRoom]) {
      maxRoom = i;
    }
  }
  return maxRoom;
}

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
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return root;
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
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
// Time: O(m log m + m log n) where m = meetings.length, n = number of rooms
// Space: O(n + m) for heaps and count array
class Solution {
    public int mostBooked(int n, int[][] meetings) {
        // Sort meetings by start time
        Arrays.sort(meetings, (a, b) -> Integer.compare(a[0], b[0]));

        // Min-heap for available rooms (stores room numbers)
        PriorityQueue<Integer> available = new PriorityQueue<>();
        for (int i = 0; i < n; i++) {
            available.offer(i);
        }

        // Min-heap for busy rooms: (endTime, roomNumber)
        PriorityQueue<long[]> busy = new PriorityQueue<>((a, b) -> {
            if (a[0] != b[0]) return Long.compare(a[0], b[0]);
            return Long.compare(a[1], b[1]);
        });

        // Array to count meetings per room
        int[] count = new int[n];

        // Process each meeting
        for (int[] meeting : meetings) {
            int start = meeting[0];
            int end = meeting[1];

            // Free rooms that have finished by current meeting start time
            while (!busy.isEmpty() && busy.peek()[0] <= start) {
                long[] finished = busy.poll();
                int room = (int) finished[1];
                available.offer(room);
            }

            // If no room available, delay the meeting
            if (available.isEmpty()) {
                long[] earliest = busy.poll();
                long earliestEnd = earliest[0];
                int room = (int) earliest[1];
                long duration = end - start;
                long newEnd = earliestEnd + duration;
                busy.offer(new long[]{newEnd, room});
                count[room]++;
            } else {
                // Get lowest-numbered available room
                int room = available.poll();
                busy.offer(new long[]{end, room});
                count[room]++;
            }
        }

        // Find room with maximum meetings
        int maxRoom = 0;
        for (int i = 0; i < n; i++) {
            if (count[i] > count[maxRoom]) {
                maxRoom = i;
            }
        }
        return maxRoom;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m log m + m log n)

- Sorting meetings takes O(m log m) where m is the number of meetings.
- Each meeting is processed once, and for each we perform heap operations (push/pop) which are O(log n) for the busy heap and O(log n) for the available heap. In the worst case, we might process each meeting with a heap operation, giving O(m log n).
- Overall: O(m log m + m log n).

**Space Complexity:** O(n + m)

- The available heap stores all n rooms: O(n).
- The busy heap can store up to n entries at once: O(n).
- The count array is O(n).
- Sorting in Python/JavaScript uses O(m) space for Timsort; in Java it's O(log m) for quicksort variant.
- Overall: O(n + m) dominated by the heaps and sorting space.

## Common Mistakes

1. **Not handling meeting delays correctly**: When a meeting is delayed, its end time should be `current_time + (original_end - original_start)`, not the original end time. Many candidates mistakenly keep the original end time, which would incorrectly shorten or lengthen the meeting.

2. **Forgetting to free multiple rooms before assignment**: When advancing time to a meeting's start, you must free **all** rooms that have ended by that time, not just one. This requires a `while` loop popping from the busy heap, not an `if`.

3. **Incorrect tie-breaking for room assignment**: The problem requires assigning to the lowest-numbered free room. If you use a regular heap for available rooms (which gives the smallest number), that's correct. But if you use a list and sort it repeatedly, you'll get TLE.

4. **Using integer overflow for time calculations**: With large start/end times (up to 10^9) and many delays, the end time can exceed 32-bit integer range. Use 64-bit integers (long in Java, int in Python handles big integers, but in JavaScript use Number which is 64-bit float).

## When You'll See This Pattern

This two-heap pattern appears in scheduling problems where you need to manage resources (rooms, servers, workers) and tasks (meetings, jobs, requests) over time:

- **Meeting Rooms II** (Medium): Similar but only needs the maximum number of concurrent meetings, not room assignment counts. Uses one heap for end times.
- **Maximum Number of Events That Can Be Attended** (Medium): Assign events to days, uses a heap to track available days and events sorted by start time.
- **Course Schedule III** (Hard): Schedule courses with deadlines and durations, uses a heap to manage course durations and replace longer courses with shorter ones.

The core pattern: sort events by start time, use a heap to track the earliest ending resource, and another data structure (often another heap) to manage available resources.

## Key Takeaways

1. **Two-heap technique**: When you need to manage both "next available resource" and "earliest finishing task", two heaps (or a heap plus another ordered structure) are often the solution. One heap tracks busy resources by end time, another tracks free resources by priority (e.g., room number).

2. **Jump simulation**: Instead of simulating every time unit, jump to the next event (meeting start or resource free). This reduces complexity from O(T) to O(m log m).

3. **Delay handling**: When a task can't start immediately, calculate its new end time based on original duration, not original end time. This preserves the task's length.

Related problems: [Meeting Rooms](/problem/meeting-rooms), [Meeting Rooms II](/problem/meeting-rooms-ii), [Maximum Number of Events That Can Be Attended](/problem/maximum-number-of-events-that-can-be-attended)
