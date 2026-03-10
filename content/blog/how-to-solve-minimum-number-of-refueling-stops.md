---
title: "How to Solve Minimum Number of Refueling Stops — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Number of Refueling Stops. Hard difficulty, 41.1% acceptance rate. Topics: Array, Dynamic Programming, Greedy, Heap (Priority Queue)."
date: "2026-07-08"
category: "dsa-patterns"
tags: ["minimum-number-of-refueling-stops", "array", "dynamic-programming", "greedy", "hard"]
---

# How to Solve Minimum Number of Refueling Stops

This problem asks us to find the **minimum number of refueling stops** needed for a car to reach a target destination, given its starting fuel and available gas stations along the route. The tricky part is that we must decide **when** to refuel at which stations to minimize stops while ensuring we never run out of gas before reaching the next station or the target.

What makes this problem interesting is that it appears to be a greedy choice problem (always refuel at the next station), but a simple greedy approach fails because sometimes it's better to skip a station now and refuel later. This requires either dynamic programming or a more sophisticated greedy approach using a priority queue.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- `target = 100`
- `startFuel = 10`
- `stations = [[10, 60], [20, 30], [30, 30], [60, 40]]`

**Step-by-step reasoning:**

1. **Start at position 0 with 10 fuel** - Can travel 10 miles without refueling
2. **Reach station at position 10** - We have exactly enough fuel to get here (10 miles). Now we have a decision: refuel or not?
   - If we refuel: We get 60 fuel, total becomes 60. We've made 1 stop.
   - We can now travel to position 70 (10 + 60)
3. **Pass station at position 20** - We could refuel here for 30 more fuel
4. **Pass station at position 30** - We could refuel here for 30 more fuel
5. **Reach station at position 60** - We still have 40 fuel left (70 - 60 = 10 miles traveled from position 10 to 60, used 50 fuel, have 10 left). We can refuel here for 40 fuel.
6. **With optimal choices**: Refuel at position 10 (60 fuel) and position 60 (40 fuel) gives us 100 total range from start, enough to reach target 100 with 2 stops.

The key insight: When we pass a station, we don't need to decide immediately whether to use it. We can "remember" it and use it later when we run low on fuel.

## Brute Force Approach

A naive approach would be to try all possible combinations of stations:

1. Try reaching the target with 0 stops (just using startFuel)
2. Try all combinations with 1 stop at any station
3. Try all combinations with 2 stops at any two stations
4. And so on...

This is essentially exploring all subsets of stations, which has **O(2ⁿ)** time complexity where n is the number of stations. For n=100, this is 2¹⁰⁰ ≈ 1.3×10³⁰ operations - completely infeasible.

Even a slightly better brute force using recursion (at each station, choose to refuel or not) still has exponential time complexity. We need a more efficient approach.

## Optimized Approach

The key insight comes from thinking about the problem differently:

1. **We drive as far as we can with current fuel**
2. **When we can't reach the next station or target**, we look back at all stations we've passed but didn't refuel at
3. **We choose the station with the most fuel** from those we passed
4. **Repeat** until we either reach the target or run out of stations to use

This is a **greedy approach using a max-heap (priority queue)**:

- As we drive, we add every station we pass to a max-heap (prioritized by fuel amount)
- When we run out of fuel before reaching the next point of interest, we "retroactively" refuel at the best station we passed
- Each time we refuel, we increment our stop count

Why does this work? Because if we need to refuel to continue, it's always optimal to use the station with the most fuel among those we've passed. Using a smaller fuel station now might mean we need more stops later.

## Optimal Solution

Here's the complete solution using a max-heap/priority queue:

<div class="code-group">

```python
# Time: O(n log n) where n is number of stations
# Space: O(n) for the priority queue
def minRefuelStops(target, startFuel, stations):
    """
    Calculate minimum refueling stops to reach target.

    Args:
        target: Destination position in miles
        startFuel: Initial fuel amount
        stations: List of [position, fuel] pairs

    Returns:
        Minimum stops needed or -1 if impossible
    """
    import heapq

    # Max-heap simulation using min-heap with negative values
    max_heap = []

    # Current position and fuel
    current_position = 0
    current_fuel = startFuel

    # Number of stops made
    stops = 0

    # Index for iterating through stations
    i = 0
    n = len(stations)

    # Continue until we reach or pass the target
    while current_position + current_fuel < target:
        # Add all stations we can reach with current fuel to the heap
        while i < n and stations[i][0] <= current_position + current_fuel:
            # Use negative value for max-heap behavior with heapq (min-heap)
            heapq.heappush(max_heap, -stations[i][1])
            i += 1

        # If no stations in heap, we can't reach target or next station
        if not max_heap:
            return -1

        # Refuel at the station with maximum fuel (pop from heap)
        max_fuel = -heapq.heappop(max_heap)
        current_fuel += max_fuel
        stops += 1

        # Update current position to where we ran out of fuel
        # Note: We don't actually track exact position, just fuel capacity

    return stops
```

```javascript
// Time: O(n log n) where n is number of stations
// Space: O(n) for the priority queue
function minRefuelStops(target, startFuel, stations) {
  /**
   * Calculate minimum refueling stops to reach target.
   *
   * @param {number} target - Destination position in miles
   * @param {number} startFuel - Initial fuel amount
   * @param {number[][]} stations - Array of [position, fuel] pairs
   * @return {number} Minimum stops needed or -1 if impossible
   */

  // Max-heap using array and sorting (JavaScript doesn't have built-in heap)
  // We'll simulate heap operations manually
  const maxHeap = [];

  // Helper function to add to max-heap
  const heapPush = (fuel) => {
    maxHeap.push(fuel);
    maxHeap.sort((a, b) => b - a); // Sort descending for max-heap
  };

  // Helper function to remove from max-heap
  const heapPop = () => {
    return maxHeap.shift(); // Remove and return largest element
  };

  let currentPosition = 0;
  let currentFuel = startFuel;
  let stops = 0;
  let i = 0;
  const n = stations.length;

  // Continue until we can reach target with current fuel
  while (currentPosition + currentFuel < target) {
    // Add all reachable stations to the heap
    while (i < n && stations[i][0] <= currentPosition + currentFuel) {
      heapPush(stations[i][1]);
      i++;
    }

    // If heap is empty, we can't reach target or next station
    if (maxHeap.length === 0) {
      return -1;
    }

    // Refuel at the station with maximum fuel
    const maxFuel = heapPop();
    currentFuel += maxFuel;
    stops++;

    // Note: We don't need to update currentPosition explicitly
    // because we're using currentPosition + currentFuel as our range
  }

  return stops;
}
```

```java
// Time: O(n log n) where n is number of stations
// Space: O(n) for the priority queue
import java.util.PriorityQueue;
import java.util.Collections;

class Solution {
    public int minRefuelStops(int target, int startFuel, int[][] stations) {
        /**
         * Calculate minimum refueling stops to reach target.
         *
         * @param target Destination position in miles
         * @param startFuel Initial fuel amount
         * @param stations Array of [position, fuel] pairs
         * @return Minimum stops needed or -1 if impossible
         */

        // Max-heap using PriorityQueue with reverse order comparator
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

        int currentPosition = 0;
        int currentFuel = startFuel;
        int stops = 0;
        int i = 0;
        int n = stations.length;

        // Continue until we can reach target
        while (currentPosition + currentFuel < target) {
            // Add all stations within current range to the heap
            while (i < n && stations[i][0] <= currentPosition + currentFuel) {
                maxHeap.offer(stations[i][1]);
                i++;
            }

            // If no stations available, we can't reach target
            if (maxHeap.isEmpty()) {
                return -1;
            }

            // Refuel at the station with maximum fuel
            int maxFuel = maxHeap.poll();
            currentFuel += maxFuel;
            stops++;

            // Note: currentPosition doesn't need explicit update
            // We're effectively "teleporting" to where we would have refueled
        }

        return stops;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- We process each station once when adding it to the heap: O(n)
- Each heap insertion and removal takes O(log n) time
- In worst case, we add all n stations to the heap and potentially remove many of them
- Total: O(n log n)

**Space Complexity: O(n)**

- In the worst case, we store all n stations in the heap
- The heap uses O(n) space
- Other variables use O(1) additional space

## Common Mistakes

1. **Not handling the case where target is reachable with initial fuel** - Some solutions forget to check if `startFuel >= target` at the beginning, which should return 0 stops.

2. **Updating current position incorrectly** - A common mistake is to update `currentPosition` to the station position when refueling. Actually, we don't need to track exact position, just the maximum distance we can travel (`currentPosition + currentFuel`).

3. **Using min-heap instead of max-heap** - The problem requires always choosing the station with maximum fuel when we need to refuel. Using a min-heap would give us the smallest fuel station, which is suboptimal.

4. **Not checking heap emptiness before popping** - If we try to pop from an empty heap, we'll get an error. Always check if the heap has elements before attempting to remove one.

5. **Infinite loop with position update** - Some implementations get stuck because they don't properly advance through stations. Make sure to use a separate index `i` to track which stations have been processed.

## When You'll See This Pattern

This "greedy with priority queue" pattern appears in several scheduling and optimization problems:

1. **Meeting Rooms II (LeetCode 253)** - Similar concept of using a min-heap to track ongoing meetings and always allocating to the room that frees up first.

2. **Course Schedule III (LeetCode 630)** - Uses a max-heap to track course durations and replace longer courses with shorter ones when time constraints are violated.

3. **Maximum Performance of a Team (LeetCode 1383)** - Combines sorting with a min-heap to efficiently track the top k engineers by speed while maintaining minimum efficiency.

The pattern is: **When you need to make optimal choices from a set of options that become available over time, and you can defer decisions until needed, a priority queue is often the right tool.**

## Key Takeaways

1. **Think in terms of "reachable range" not "current position"** - The key insight is that we care about how far we can travel from our starting point, not necessarily where we are at each moment.

2. **Use a max-heap to defer decisions** - When you pass a resource (like a gas station) that you might use later, store it in a data structure that lets you efficiently retrieve the best one when needed.

3. **Greedy can work with the right data structure** - Some problems seem like they need dynamic programming, but a greedy approach with a priority queue can be more efficient. Always ask: "If I need to choose one, which is the best choice?"

[Practice this problem on CodeJeet](/problem/minimum-number-of-refueling-stops)
