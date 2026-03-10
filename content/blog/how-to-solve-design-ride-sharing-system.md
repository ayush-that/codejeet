---
title: "How to Solve Design Ride Sharing System — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Ride Sharing System. Medium difficulty, 63.3% acceptance rate. Topics: Hash Table, Design, Queue, Data Stream."
date: "2029-07-09"
category: "dsa-patterns"
tags: ["design-ride-sharing-system", "hash-table", "design", "queue", "medium"]
---

## How to Solve Design Ride Sharing System

Designing a ride-sharing system is a classic system design interview problem that tests your ability to model real-world systems with appropriate data structures. The core challenge here is managing two asynchronous streams (riders requesting rides and drivers becoming available) and matching them fairly in arrival order. What makes this interesting is that we need to handle cases where riders wait for drivers and drivers wait for riders, all while maintaining first-come-first-served matching.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

1. **Initial state**: No riders waiting, no drivers available
2. **Rider 1 requests a ride**: Since no drivers are available, Rider 1 enters the waiting queue
3. **Rider 2 requests a ride**: Still no drivers, so Rider 2 joins the queue behind Rider 1
4. **Driver 1 becomes available**: Checks for waiting riders → finds Rider 1 → matches them
5. **Rider 3 requests a ride**: No drivers available, joins the queue (now only Rider 2 and 3 waiting)
6. **Driver 2 becomes available**: Checks for waiting riders → finds Rider 2 → matches them
7. **Driver 3 becomes available**: Checks for waiting riders → finds Rider 3 → matches them

The key insight: when a rider requests a ride, if a driver is available immediately, they match. Otherwise, the rider waits. When a driver becomes available, if a rider is waiting, they match with the longest-waiting rider. Otherwise, the driver waits.

## Brute Force Approach

A naive approach might try to manage everything with simple lists:

- Store waiting riders in a list
- Store available drivers in a list
- When a rider requests: scan the drivers list for the first available
- When a driver becomes available: scan the riders list for the first waiting

The problem? Every operation becomes O(n) where n is the number of waiting users. With thousands of concurrent requests, this becomes painfully slow. Removing the first element from a list also requires shifting all remaining elements, adding more overhead.

## Optimized Approach

The key insight is that we need **FIFO (First-In-First-Out) processing** for both riders and drivers. This screams for **queues**:

1. **Use two queues**: one for waiting riders, one for available drivers
2. **When a rider requests a ride**:
   - If driver queue is not empty: pop a driver, match immediately
   - Else: add rider to the rider queue
3. **When a driver becomes available**:
   - If rider queue is not empty: pop a rider, match immediately
   - Else: add driver to the driver queue

This gives us O(1) operations for all key functions. We also need to track unique IDs for riders and drivers to return the correct matches.

## Optimal Solution

Here's the complete implementation using queues for efficient matching:

<div class="code-group">

```python
from collections import deque

class RideSharingSystem:
    """
    Time Complexity:
    - requestRide: O(1) average case (queue operations are O(1))
    - addDriver: O(1) average case (queue operations are O(1))

    Space Complexity: O(n + m) where n = number of waiting riders,
                      m = number of available drivers
    """

    def __init__(self):
        # Two queues: one for waiting riders, one for available drivers
        self.waiting_riders = deque()  # FIFO for riders
        self.available_drivers = deque()  # FIFO for drivers

    def requestRide(self, riderId: int) -> int:
        """
        Called when a rider requests a ride.
        Returns the driver ID they're matched with, or -1 if no driver available.
        """
        # Step 1: Check if any drivers are immediately available
        if self.available_drivers:
            # Match with the driver who has been waiting the longest (FIFO)
            driver_id = self.available_drivers.popleft()
            return driver_id

        # Step 2: No driver available, rider must wait
        self.waiting_riders.append(riderId)
        return -1

    def addDriver(self, driverId: int) -> int:
        """
        Called when a driver becomes available.
        Returns the rider ID they're matched with, or -1 if no rider waiting.
        """
        # Step 1: Check if any riders are waiting
        if self.waiting_riders:
            # Match with the rider who has been waiting the longest (FIFO)
            rider_id = self.waiting_riders.popleft()
            return rider_id

        # Step 2: No rider waiting, driver must wait
        self.available_drivers.append(driverId)
        return -1
```

```javascript
class RideSharingSystem {
  /**
   * Time Complexity: O(1) for both methods
   * Space Complexity: O(n + m) where n = waiting riders, m = available drivers
   */
  constructor() {
    // Use arrays as queues (with shift/push operations)
    // In production, you might use a proper queue library for better performance
    this.waitingRiders = []; // FIFO queue for riders
    this.availableDrivers = []; // FIFO queue for drivers
  }

  /**
   * @param {number} riderId
   * @return {number} driver ID or -1
   */
  requestRide(riderId) {
    // Step 1: Check for available drivers
    if (this.availableDrivers.length > 0) {
      // Get the driver who has been waiting the longest (front of queue)
      const driverId = this.availableDrivers.shift();
      return driverId;
    }

    // Step 2: No driver available, rider joins waiting queue
    this.waitingRiders.push(riderId);
    return -1;
  }

  /**
   * @param {number} driverId
   * @return {number} rider ID or -1
   */
  addDriver(driverId) {
    // Step 1: Check for waiting riders
    if (this.waitingRiders.length > 0) {
      // Get the rider who has been waiting the longest (front of queue)
      const riderId = this.waitingRiders.shift();
      return riderId;
    }

    // Step 2: No rider waiting, driver joins available queue
    this.availableDrivers.push(driverId);
    return -1;
  }
}
```

```java
import java.util.LinkedList;
import java.util.Queue;

class RideSharingSystem {
    /**
     * Time Complexity: O(1) for all operations
     * Space Complexity: O(n + m) where n = waiting riders, m = available drivers
     */

    private Queue<Integer> waitingRiders;
    private Queue<Integer> availableDrivers;

    public RideSharingSystem() {
        // LinkedList implements Queue interface for FIFO operations
        waitingRiders = new LinkedList<>();
        availableDrivers = new LinkedList<>();
    }

    /**
     * Called when a rider requests a ride
     * @param riderId unique identifier for the rider
     * @return driver ID if matched, -1 if no driver available
     */
    public int requestRide(int riderId) {
        // Step 1: Check if any drivers are available
        if (!availableDrivers.isEmpty()) {
            // Poll removes and returns the head of the queue (oldest driver)
            return availableDrivers.poll();
        }

        // Step 2: No drivers available, add rider to waiting queue
        waitingRiders.offer(riderId);
        return -1;
    }

    /**
     * Called when a driver becomes available
     * @param driverId unique identifier for the driver
     * @return rider ID if matched, -1 if no rider waiting
     */
    public int addDriver(int driverId) {
        // Step 1: Check if any riders are waiting
        if (!waitingRiders.isEmpty()) {
            // Poll removes and returns the head of the queue (oldest rider)
            return waitingRiders.poll();
        }

        // Step 2: No riders waiting, add driver to available queue
        availableDrivers.offer(driverId);
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `requestRide()`: O(1) average case. Queue operations (enqueue/dequeue) are constant time.
- `addDriver()`: O(1) average case. Same reasoning as above.

**Space Complexity:** O(n + m) where:

- n = maximum number of waiting riders at any time
- m = maximum number of available drivers at any time
  In the worst case, all users could be waiting (either as riders or drivers).

## Common Mistakes

1. **Using lists instead of queues**: Candidates often use arrays/lists and remove from the front, which is O(n) due to element shifting. Always use proper queue data structures.

2. **Forgetting to handle the -1 return cases**: When there's no match, you must return -1. Some candidates forget this edge case.

3. **Incorrect matching order**: The problem specifies "in the order they arrive." Using a stack (LIFO) instead of a queue (FIFO) would match newest instead of oldest, which is wrong.

4. **Not considering both directions**: Some candidates only check one side (e.g., when a rider requests, they only check for drivers, but don't consider that a driver might have been waiting). You must handle both: riders waiting for drivers AND drivers waiting for riders.

## When You'll See This Pattern

This producer-consumer pattern with two queues appears in many system design problems:

1. **Task Scheduler (LeetCode 621)**: Similar concept of matching tasks with idle slots using queues to manage order.

2. **Design Hit Counter (LeetCode 362)**: Uses queues to maintain timestamps and remove old entries, similar to how we manage waiting users.

3. **Design Browser History (LeetCode 1472)**: While not exactly the same, it uses data structures to manage ordered sequences of events, which is the core skill here.

The pattern is: **when you need to manage two streams of events that need to be matched in arrival order, think of using FIFO queues.**

## Key Takeaways

1. **Queues are perfect for FIFO matching**: When the problem mentions "in the order they arrive" or "first-come-first-served," immediately think of using queues.

2. **Handle both producer and consumer sides**: In matching systems, always consider what happens when either side arrives first. Maintain waiting queues for both.

3. **Keep operations O(1)**: Real-time systems like ride-sharing need constant-time operations. Avoid any O(n) scans or shifts.

[Practice this problem on CodeJeet](/problem/design-ride-sharing-system)
