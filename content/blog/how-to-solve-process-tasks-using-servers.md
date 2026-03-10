---
title: "How to Solve Process Tasks Using Servers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Process Tasks Using Servers. Medium difficulty, 42.0% acceptance rate. Topics: Array, Heap (Priority Queue)."
date: "2028-09-09"
category: "dsa-patterns"
tags: ["process-tasks-using-servers", "array", "heap-(priority-queue)", "medium"]
---

# How to Solve Process Tasks Using Servers

This problem requires efficiently assigning tasks to servers when both servers and tasks have specific constraints. You're given two arrays: `servers` (server weights) and `tasks` (task durations). At any given second, you need to assign the next available task to the **least weight** server that's **currently free**. If multiple servers are free, choose the one with the smallest weight. If no servers are free, you must wait until one becomes available. The challenge lies in efficiently tracking which servers are free and which are busy, and making optimal assignments at each time step.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- Servers: `[3, 3, 2]` (weights of servers 0, 1, 2)
- Tasks: `[1, 2, 3, 2, 1]` (durations in seconds)

**Step-by-step process:**

**Time 0:**

- Free servers: All servers are free → `[0(2), 1(3), 2(3)]` (sorted by weight, then index)
- Task 0 (duration 1) → assign to server 0 (weight 2, smallest)
- Server 0 becomes busy until time 1
- Result: `[0]`

**Time 1:**

- Server 0 finishes its task and becomes free
- Free servers: `[0(2), 1(3), 2(3)]`
- Task 1 (duration 2) → assign to server 0 (weight 2, smallest)
- Server 0 becomes busy until time 3
- Result: `[0, 0]`

**Time 2:**

- No servers finish at time 2
- Free servers: `[1(3), 2(3)]`
- Task 2 (duration 3) → assign to server 1 (weight 3, smaller index)
- Server 1 becomes busy until time 5
- Result: `[0, 0, 1]`

**Time 3:**

- Server 0 finishes its task and becomes free
- Free servers: `[0(2), 2(3)]`
- Task 3 (duration 2) → assign to server 0 (weight 2, smallest)
- Server 0 becomes busy until time 5
- Result: `[0, 0, 1, 0]`

**Time 4:**

- No servers finish at time 4
- Free servers: `[2(3)]`
- Task 4 (duration 1) → assign to server 2
- Server 2 becomes busy until time 5
- Result: `[0, 0, 1, 0, 2]`

**Final output:** `[0, 0, 1, 0, 2]`

The key insight is that we need two priority queues: one for free servers (sorted by weight then index) and one for busy servers (sorted by when they become free).

## Brute Force Approach

A naive approach would be to simulate each second and check all servers:

1. For each time from 0 to the total task duration:
   - Check all busy servers to see if any finish at this time
   - Move finished servers to free pool
   - If there's a task at this time, check all free servers to find the one with smallest weight (and smallest index if tied)
   - Assign the task and mark server as busy until `current_time + task_duration`

**Why this fails:**

- Time complexity: O(m × n) where m is number of tasks and n is number of servers
- In the worst case (long tasks, many servers), this could be O(10^5 × 10^5) = 10^10 operations
- Checking all servers at each time step is inefficient when we only need the "best" free server

## Optimized Approach

The optimal solution uses **two priority queues (min-heaps)**:

1. **Free servers heap**: Stores `(weight, index)` pairs. Always gives us the server with smallest weight (and smallest index if weights tie).

2. **Busy servers heap**: Stores `(finish_time, weight, index)` tuples. Always gives us the server that will finish earliest.

**Key steps:**

1. Initialize free heap with all servers sorted by weight then index
2. Track current time starting from 0
3. For each task (in order):
   - Move all servers that finish by current time from busy heap to free heap
   - If no free servers, fast-forward time to when the next server finishes
   - Assign current task to the best free server
   - Move that server to busy heap with finish time = `current_time + task_duration`
   - Increment time (or process next task at its scheduled time)

**Why this works:**

- Heaps give us O(log n) access to the best free server and earliest finishing busy server
- We only process events when they matter (when servers finish or tasks arrive)
- We avoid checking every server at every time step

## Optimal Solution

<div class="code-group">

```python
# Time: O((m + n) * log n) where m = tasks, n = servers
# Space: O(n) for the two heaps
def assignTasks(servers, tasks):
    """
    Assign tasks to servers optimally.

    Args:
        servers: List of server weights
        tasks: List of task durations

    Returns:
        List of server indices assigned to each task
    """
    import heapq

    n, m = len(servers), len(tasks)
    result = [0] * m

    # Free servers heap: (weight, index)
    # We sort by weight first, then index if weights are equal
    free_servers = [(servers[i], i) for i in range(n)]
    heapq.heapify(free_servers)

    # Busy servers heap: (finish_time, weight, index)
    busy_servers = []

    current_time = 0

    for i in range(m):
        # Update current time to when this task is available
        # Tasks are available at time i (0-indexed seconds)
        current_time = max(current_time, i)

        # If no free servers, fast-forward time to when next server finishes
        if not free_servers:
            # The next server to finish is at the top of busy heap
            finish_time, weight, index = heapq.heappop(busy_servers)
            current_time = finish_time

            # Add this server back to free pool
            heapq.heappush(free_servers, (weight, index))

            # Also add any other servers that finish at the same time
            while busy_servers and busy_servers[0][0] == current_time:
                _, w, idx = heapq.heappop(busy_servers)
                heapq.heappush(free_servers, (w, idx))

        # Now we have at least one free server at current_time
        # Move all servers that finish by current_time from busy to free
        while busy_servers and busy_servers[0][0] <= current_time:
            _, weight, index = heapq.heappop(busy_servers)
            heapq.heappush(free_servers, (weight, index))

        # Get the best free server (smallest weight, then smallest index)
        weight, index = heapq.heappop(free_servers)

        # Assign current task to this server
        result[i] = index

        # Mark server as busy until current_time + task_duration
        finish_time = current_time + tasks[i]
        heapq.heappush(busy_servers, (finish_time, weight, index))

    return result
```

```javascript
// Time: O((m + n) * log n) where m = tasks, n = servers
// Space: O(n) for the two heaps
function assignTasks(servers, tasks) {
  /**
   * Assign tasks to servers optimally.
   *
   * @param {number[]} servers - Server weights
   * @param {number[]} tasks - Task durations
   * @return {number[]} Server indices assigned to each task
   */
  const n = servers.length;
  const m = tasks.length;
  const result = new Array(m);

  // Free servers min-heap: [weight, index]
  // JavaScript doesn't have built-in heap, so we'll use array and sort
  // For efficiency, we'd use a library in real interview, but for clarity:
  const freeServers = [];
  for (let i = 0; i < n; i++) {
    freeServers.push([servers[i], i]);
  }
  freeServers.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

  // Busy servers min-heap: [finishTime, weight, index]
  const busyServers = [];

  // Helper function to maintain heap property
  function pushBusy(server) {
    busyServers.push(server);
    busyServers.sort((a, b) => a[0] - b[0]);
  }

  function popBusy() {
    return busyServers.shift();
  }

  function pushFree(server) {
    freeServers.push(server);
    freeServers.sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));
  }

  function popFree() {
    return freeServers.shift();
  }

  let currentTime = 0;

  for (let i = 0; i < m; i++) {
    // Update current time to when this task is available
    currentTime = Math.max(currentTime, i);

    // If no free servers, fast-forward to when next server finishes
    if (freeServers.length === 0) {
      const [finishTime, weight, index] = popBusy();
      currentTime = finishTime;

      // Add this server back to free pool
      pushFree([weight, index]);

      // Also add any other servers that finish at the same time
      while (busyServers.length > 0 && busyServers[0][0] === currentTime) {
        const [, w, idx] = popBusy();
        pushFree([w, idx]);
      }
    }

    // Move all servers that finish by current_time from busy to free
    while (busyServers.length > 0 && busyServers[0][0] <= currentTime) {
      const [, weight, index] = popBusy();
      pushFree([weight, index]);
    }

    // Get the best free server
    const [weight, index] = popFree();

    // Assign current task to this server
    result[i] = index;

    // Mark server as busy
    const finishTime = currentTime + tasks[i];
    pushBusy([finishTime, weight, index]);
  }

  return result;
}
```

```java
// Time: O((m + n) * log n) where m = tasks, n = servers
// Space: O(n) for the two heaps
import java.util.*;

class Solution {
    public int[] assignTasks(int[] servers, int[] tasks) {
        /**
         * Assign tasks to servers optimally.
         *
         * @param servers Server weights
         * @param tasks Task durations
         * @return Server indices assigned to each task
         */
        int n = servers.length;
        int m = tasks.length;
        int[] result = new int[m];

        // Free servers min-heap: sorted by weight, then index
        PriorityQueue<int[]> freeServers = new PriorityQueue<>((a, b) -> {
            if (a[0] != b[0]) return a[0] - b[0]; // Compare weight
            return a[1] - b[1]; // Compare index
        });

        // Initialize free servers heap
        for (int i = 0; i < n; i++) {
            freeServers.offer(new int[]{servers[i], i});
        }

        // Busy servers min-heap: sorted by finish time
        PriorityQueue<int[]> busyServers = new PriorityQueue<>((a, b) -> {
            if (a[0] != b[0]) return a[0] - b[0]; // Compare finish time
            if (a[1] != b[1]) return a[1] - b[1]; // Compare weight
            return a[2] - b[2]; // Compare index
        });

        int currentTime = 0;

        for (int i = 0; i < m; i++) {
            // Update current time to when this task is available
            currentTime = Math.max(currentTime, i);

            // If no free servers, fast-forward to when next server finishes
            if (freeServers.isEmpty()) {
                int[] server = busyServers.poll();
                currentTime = server[0]; // Finish time

                // Add this server back to free pool
                freeServers.offer(new int[]{server[1], server[2]});

                // Also add any other servers that finish at the same time
                while (!busyServers.isEmpty() && busyServers.peek()[0] == currentTime) {
                    server = busyServers.poll();
                    freeServers.offer(new int[]{server[1], server[2]});
                }
            }

            // Move all servers that finish by current_time from busy to free
            while (!busyServers.isEmpty() && busyServers.peek()[0] <= currentTime) {
                int[] server = busyServers.poll();
                freeServers.offer(new int[]{server[1], server[2]});
            }

            // Get the best free server
            int[] server = freeServers.poll();
            int weight = server[0];
            int index = server[1];

            // Assign current task to this server
            result[i] = index;

            // Mark server as busy
            int finishTime = currentTime + tasks[i];
            busyServers.offer(new int[]{finishTime, weight, index});
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O((m + n) × log n)**

- `n` = number of servers, `m` = number of tasks
- Each server enters and leaves the free heap at most once: O(n log n)
- Each task causes at most one push/pop from each heap: O(m log n)
- The while loops that move servers from busy to free don't increase complexity because each server is moved at most once per busy period

**Space Complexity: O(n)**

- Both heaps store at most `n` servers total
- Result array is O(m) but that's part of the output, not auxiliary space

## Common Mistakes

1. **Not handling time correctly**: Tasks become available at second `i` (0-indexed), not immediately after previous task finishes. Some candidates incorrectly assume tasks are processed back-to-back.

2. **Forgetting to sort by index when weights tie**: The problem states that if multiple servers have the same weight, choose the server with the smallest index. This is easy to overlook in the comparator function.

3. **Inefficient time advancement**: Some candidates increment time by 1 second at a time (O(max_time) approach) instead of jumping to the next server finish time. This causes TLE for large inputs.

4. **Not maintaining both heaps correctly**: Forgetting to move servers from busy to free when they finish, or not handling the case when multiple servers finish at the same time.

## When You'll See This Pattern

This "dual priority queue" pattern appears in scheduling problems where you need to manage resources with different priorities becoming available at different times:

1. **Meeting Rooms II** (LeetCode 253): Similar concept of tracking when rooms become available for new meetings.

2. **Parallel Courses III** (LeetCode 2050): Managing course prerequisites with time constraints, though it's more complex with dependencies.

3. **Task Scheduler** (LeetCode 621): Different constraints but similar need to manage task ordering with cooldown periods.

4. **Design a Food Rating System** (LeetCode 2353): Maintaining sorted collections of items that get updated frequently.

The key indicator is when you need to repeatedly select the "best" available resource from a pool that changes over time.

## Key Takeaways

1. **Dual heaps for scheduling**: When you need to manage resources that become available at different times while maintaining priority ordering, consider using two priority queues—one for available resources and one for busy resources.

2. **Time jumping optimization**: Instead of simulating every time unit, jump directly to the next relevant event (like when a server becomes free). This changes the complexity from O(max_time × n) to O((m + n) log n).

3. **Comparator design matters**: Pay close attention to sorting criteria. In this case, free servers are sorted by weight then index, while busy servers are sorted by finish time then weight then index.

Related problems: [Parallel Courses III](/problem/parallel-courses-iii)
