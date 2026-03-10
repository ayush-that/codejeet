---
title: "How to Solve Find Servers That Handled Most Number of Requests — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Servers That Handled Most Number of Requests. Hard difficulty, 45.2% acceptance rate. Topics: Array, Heap (Priority Queue), Simulation, Ordered Set."
date: "2029-06-08"
category: "dsa-patterns"
tags:
  [
    "find-servers-that-handled-most-number-of-requests",
    "array",
    "heap-(priority-queue)",
    "simulation",
    "hard",
  ]
---

# How to Solve "Find Servers That Handled Most Number of Requests"

This problem simulates a load balancing system where requests arrive at specific times and must be assigned to available servers according to specific rules. The challenge lies in efficiently tracking which servers are busy and which are free at any given moment, while also maintaining the circular "next available server" logic. What makes this problem tricky is that we need to handle two competing priorities: finding the first available server starting from `(i % k)`, and efficiently updating server availability as requests complete.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- k = 3 servers (servers 0, 1, 2)
- arrival = [1, 2, 3, 4, 5]
- load = [5, 2, 3, 3, 2]

**Step-by-step simulation:**

1. **Request 0** at time 1, load 5:
   - Start from server (0 % 3) = server 0
   - Server 0 is free → assign request to server 0
   - Server 0 will be busy until time 1 + 5 = 6
   - Server 0 count: 1

2. **Request 1** at time 2, load 2:
   - Start from server (1 % 3) = server 1
   - Server 1 is free → assign request to server 1
   - Server 1 busy until time 2 + 2 = 4
   - Server 1 count: 1

3. **Request 2** at time 3, load 3:
   - Start from server (2 % 3) = server 2
   - Server 2 is free → assign request to server 2
   - Server 2 busy until time 3 + 3 = 6
   - Server 2 count: 1

4. **Request 3** at time 4, load 3:
   - Start from server (3 % 3) = server 0
   - Server 0 is busy until time 6 (current time is 4)
   - Check server 1: busy until time 4 (just became free!)
   - Server 1 is now free → assign request to server 1
   - Server 1 busy until time 4 + 3 = 7
   - Server 1 count: 2

5. **Request 4** at time 5, load 2:
   - Start from server (4 % 3) = server 1
   - Server 1 is busy until time 7
   - Check server 2: busy until time 6
   - Check server 0: busy until time 6
   - No available servers → request is dropped

**Final counts:** Server 0: 1, Server 1: 2, Server 2: 1
**Result:** Return [1] (server 1 handled the most requests)

The key insight: we need to efficiently find the first available server starting from `(i % k)` and wrapping around, while also tracking when busy servers become free.

## Brute Force Approach

A naive approach would be to simulate each request by:

1. For each request, start checking from server `(i % k)`
2. For each server, check if it's free by comparing current time with its busyUntil time
3. If free, assign the request and update busyUntil
4. If we check all k servers and none are free, drop the request

**Why this is too slow:**

- For each of n requests, we might check up to k servers
- This gives O(n × k) time complexity
- With k up to 10^5 and n up to 10^5, this could be 10^10 operations → too slow

The brute force fails because we waste time repeatedly checking servers that are clearly busy. We need a way to quickly skip over busy servers and find available ones.

## Optimized Approach

The key insight is that we need two data structures working together:

1. **A min-heap for busy servers** to track which servers become free next
   - Stores (busyUntilTime, serverId) pairs
   - Lets us efficiently find servers that become free at or before current time

2. **An ordered set for available servers** to quickly find the next available server
   - Stores server IDs that are currently free
   - Supports finding the first server ≥ starting index (with wrap-around)

**Step-by-step reasoning:**

1. **Initialize:**
   - All servers start as available (add 0 through k-1 to available set)
   - Busy heap starts empty
   - Request counts array initialized to zeros

2. **For each request:**
   - First, move any servers that have become free from busy heap to available set
   - If no servers are available, drop this request
   - If servers are available, find the first server ≥ (i % k)
     - If found, use that server
     - If not found (wraps around), use the smallest available server
   - Update server's busyUntil time and move it to busy heap
   - Increment request count for that server

3. **After processing all requests:**
   - Find the maximum request count
   - Return all servers with that count

The critical optimization is that we only check servers that are actually available, not all k servers for each request.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log k) where n = number of requests, k = number of servers
# Space: O(k) for the heap, available set, and request counts
def busiestServers(k, arrival, load):
    import heapq
    from sortedcontainers import SortedList

    # Step 1: Initialize data structures
    # available servers (sorted for efficient search)
    available = SortedList(range(k))
    # min-heap of (busy_until_time, server_id)
    busy = []
    # request count for each server
    requests_handled = [0] * k

    # Step 2: Process each request
    for i, (start_time, duration) in enumerate(zip(arrival, load)):
        # Step 2a: Free up servers that have finished by current time
        while busy and busy[0][0] <= start_time:
            # Server is now free, add it back to available
            _, server_id = heapq.heappop(busy)
            available.add(server_id)

        # Step 2b: If no servers available, drop this request
        if not available:
            continue

        # Step 2c: Find the target server starting from (i % k)
        target = i % k

        # Find first available server >= target
        idx = available.bisect_left(target)

        if idx == len(available):
            # Wrap around: use the smallest available server
            server_id = available[0]
        else:
            # Found a server >= target
            server_id = available[idx]

        # Step 2d: Assign request to this server
        available.remove(server_id)
        # Server will be busy until start_time + duration
        heapq.heappush(busy, (start_time + duration, server_id))
        requests_handled[server_id] += 1

    # Step 3: Find servers with maximum requests
    max_requests = max(requests_handled)
    result = [i for i, count in enumerate(requests_handled) if count == max_requests]

    return result
```

```javascript
// Time: O(n log k) where n = number of requests, k = number of servers
// Space: O(k) for the heap, available set, and request counts
function busiestServers(k, arrival, load) {
  // Step 1: Initialize data structures
  // available servers (using sorted array for simplicity)
  let available = new Array(k).fill(0).map((_, i) => i);
  // min-heap of [busyUntilTime, serverId]
  let busy = new MinHeap((a, b) => a[0] - b[0]);
  // request count for each server
  let requestsHandled = new Array(k).fill(0);

  // Step 2: Process each request
  for (let i = 0; i < arrival.length; i++) {
    const startTime = arrival[i];
    const duration = load[i];

    // Step 2a: Free up servers that have finished by current time
    while (busy.size() > 0 && busy.peek()[0] <= startTime) {
      const [_, serverId] = busy.pop();
      // Add server back to available (maintain sorted order)
      let insertPos = 0;
      while (insertPos < available.length && available[insertPos] < serverId) {
        insertPos++;
      }
      available.splice(insertPos, 0, serverId);
    }

    // Step 2b: If no servers available, drop this request
    if (available.length === 0) {
      continue;
    }

    // Step 2c: Find the target server starting from (i % k)
    const target = i % k;

    // Find first available server >= target
    let idx = available.findIndex((serverId) => serverId >= target);

    let serverId;
    if (idx === -1) {
      // Wrap around: use the smallest available server
      serverId = available[0];
    } else {
      // Found a server >= target
      serverId = available[idx];
    }

    // Step 2d: Assign request to this server
    available.splice(available.indexOf(serverId), 1);
    // Server will be busy until startTime + duration
    busy.push([startTime + duration, serverId]);
    requestsHandled[serverId]++;
  }

  // Step 3: Find servers with maximum requests
  const maxRequests = Math.max(...requestsHandled);
  const result = [];
  for (let i = 0; i < k; i++) {
    if (requestsHandled[i] === maxRequests) {
      result.push(i);
    }
  }

  return result;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor(compareFn = (a, b) => a - b) {
    this.heap = [];
    this.compare = compareFn;
  }

  size() {
    return this.heap.length;
  }

  peek() {
    return this.heap[0];
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

  _bubbleUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.compare(this.heap[idx], this.heap[parent]) >= 0) break;
      [this.heap[idx], this.heap[parent]] = [this.heap[parent], this.heap[idx]];
      idx = parent;
    }
  }

  _bubbleDown(idx) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * idx + 1;
      let right = 2 * idx + 2;
      let smallest = idx;

      if (left < length && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest === idx) break;
      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }
}
```

```java
// Time: O(n log k) where n = number of requests, k = number of servers
// Space: O(k) for the heap, available set, and request counts
import java.util.*;

class Solution {
    public List<Integer> busiestServers(int k, int[] arrival, int[] load) {
        // Step 1: Initialize data structures
        // TreeSet for available servers (maintains sorted order)
        TreeSet<Integer> available = new TreeSet<>();
        for (int i = 0; i < k; i++) {
            available.add(i);
        }
        // Min-heap for busy servers: [busyUntilTime, serverId]
        PriorityQueue<int[]> busy = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        // Request count for each server
        int[] requestsHandled = new int[k];

        // Step 2: Process each request
        for (int i = 0; i < arrival.length; i++) {
            int startTime = arrival[i];
            int duration = load[i];

            // Step 2a: Free up servers that have finished by current time
            while (!busy.isEmpty() && busy.peek()[0] <= startTime) {
                int[] freedServer = busy.poll();
                available.add(freedServer[1]);
            }

            // Step 2b: If no servers available, drop this request
            if (available.isEmpty()) {
                continue;
            }

            // Step 2c: Find the target server starting from (i % k)
            int target = i % k;

            // Find first available server >= target
            Integer serverId = available.ceiling(target);

            if (serverId == null) {
                // Wrap around: use the smallest available server
                serverId = available.first();
            }

            // Step 2d: Assign request to this server
            available.remove(serverId);
            // Server will be busy until startTime + duration
            busy.offer(new int[]{startTime + duration, serverId});
            requestsHandled[serverId]++;
        }

        // Step 3: Find servers with maximum requests
        int maxRequests = 0;
        for (int count : requestsHandled) {
            maxRequests = Math.max(maxRequests, count);
        }

        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < k; i++) {
            if (requestsHandled[i] == maxRequests) {
                result.add(i);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log k)**

- We process n requests
- For each request:
  - Moving servers from busy heap to available set: O(log k) per server moved (amortized)
  - Finding next available server: O(log k) using binary search in sorted structure
  - Adding/removing from available set: O(log k)
  - Heap operations: O(log k)
- Overall: O(n log k)

**Space Complexity: O(k)**

- Available servers set: O(k)
- Busy heap: O(k) in worst case
- Request counts array: O(k)
- Total: O(k)

## Common Mistakes

1. **Not handling wrap-around correctly**: When starting from `(i % k)` and no server ≥ that index is available, candidates forget to wrap around and take the smallest available server. Always check if your search returns null/undefined and handle the wrap-around case.

2. **Inefficient available server lookup**: Using a linear scan through all k servers for each request gives O(nk) time. The key is to maintain available servers in a sorted structure (TreeSet in Java, SortedList in Python, or sorted array in JavaScript) for O(log k) lookup.

3. **Forgetting to free servers before checking availability**: Servers become free when their `busyUntil` time ≤ current request time. This must be done at the beginning of processing each request, not at the end.

4. **Incorrect heap ordering**: The busy heap should be a min-heap ordered by `busyUntil` time, not by server ID. We need to free the server that becomes available earliest.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Simulation with priority queues**: Similar to "Meeting Rooms III" (LeetCode 2402), where you need to allocate resources over time. Both problems use a min-heap to track when resources become available.

2. **Circular array search with ordered sets**: Similar to problems where you need to find the next available element in a circular manner, like some variations of "Seat Reservation" problems.

3. **Resource allocation problems**: Any problem where limited resources need to be allocated to tasks arriving over time, with specific allocation rules. The combination of heap + sorted set is powerful for these.

## Key Takeaways

1. **When you need to track "next available" in a circular manner**, maintain available resources in a sorted structure for efficient ceiling/floor operations.

2. **For simulation problems with time-based events**, use a min-heap to track when resources become free. Always check and free resources at the beginning of processing each new event.

3. **The heap + sorted set combination** is powerful for problems requiring both temporal ordering (when things happen) and spatial ordering (which resource to choose).

Related problems: [Meeting Rooms III](/problem/meeting-rooms-iii)
