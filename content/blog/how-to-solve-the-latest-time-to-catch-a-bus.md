---
title: "How to Solve The Latest Time to Catch a Bus — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode The Latest Time to Catch a Bus. Medium difficulty, 29.9% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting."
date: "2029-02-07"
category: "dsa-patterns"
tags: ["the-latest-time-to-catch-a-bus", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve "The Latest Time to Catch a Bus"

You need to find the latest time you can arrive at the bus station and still catch a bus, given bus departure times and passenger arrival times. Each bus has a capacity, and passengers board in arrival order. The tricky part is balancing between arriving early enough to get a seat and arriving as late as possible—while also considering that you can't arrive at the same time as an existing passenger.

## Visual Walkthrough

Let's trace through a concrete example:

- Buses: `[10, 20]` with capacity 2 each
- Passengers: `[2, 4, 5, 8, 9, 15, 18]`

**Step 1: Sort everything**

- Buses already sorted: `[10, 20]`
- Passengers sorted: `[2, 4, 5, 8, 9, 15, 18]`

**Step 2: Process first bus (departs at 10, capacity 2)**

- Check passengers arriving ≤ 10: `[2, 4, 5, 8, 9]`
- Take first 2 passengers: `2` and `4` board
- Remaining passengers: `[5, 8, 9, 15, 18]`

**Step 3: Process second bus (departs at 20, capacity 2)**

- Check passengers arriving ≤ 20: `[5, 8, 9, 15, 18]`
- Take first 2 passengers: `5` and `8` board
- Remaining passengers: `[9, 15, 18]`

**Step 4: Find latest arrival time**
We can try to arrive at different times:

- Can we arrive at 19? Yes, bus 2 departs at 20 with 1 seat left (only `5` and `8` boarded)
- Can we arrive at 18? No, passenger already at 18
- Can we arrive at 17? Yes, no passenger at 17
- Can we arrive at 16? Yes, no passenger at 16
- Can we arrive at 15? No, passenger already at 15
- Can we arrive at 14? Yes, no passenger at 14

The latest is 19, but wait—we need to check if we can arrive at 20 (bus departure time). No, because you must arrive strictly before departure.

**Key insight**: We need to systematically check from the latest possible time backward, avoiding occupied passenger times.

## Brute Force Approach

A naive approach would be to simulate all possible arrival times from the latest bus departure time down to 1:

1. Sort buses and passengers
2. Simulate boarding to find empty seats
3. For each time `t` from last bus departure down to 1:
   - Check if `t` doesn't conflict with any passenger
   - Check if you can board some bus at time `t`

This is O(max(bus departure) × (n + m)) which is far too slow when bus times can be up to 10^9.

What makes brute force insufficient:

- Checking every possible time is infeasible with large time values
- We need to intelligently find gaps in passenger arrivals
- We must consider bus capacities and departure times together

## Optimized Approach

The key insight is that we should **simulate the boarding process** to understand seat availability, then **work backwards from potential boarding opportunities** to find the latest valid arrival time.

**Step-by-step reasoning:**

1. **Sort both arrays** - Buses might not be sorted, and passengers definitely need sorting for efficient processing
2. **Simulate boarding** using two pointers:
   - `busPtr` iterates through buses
   - `passengerPtr` iterates through passengers
   - For each bus, count how many passengers board (those arriving ≤ bus departure time, up to capacity)
3. **Identify boarding opportunities**:
   - If a bus has empty seats after all eligible passengers board, you could arrive at the bus departure time
   - If a bus is full, check if you can arrive just before the last passenger who boarded
4. **Work backwards** from these opportunities, checking if the time is not occupied by a passenger

The clever part: We only need to check a handful of candidate times rather than all possible times:

1. Bus departure times (if bus has capacity)
2. Times just before passengers who boarded (if bus was full)
3. We check these candidates in descending order and take the first valid one

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + m log m) | Space: O(1) excluding sort space
def latestTimeCatchTheBus(buses, passengers, capacity):
    """
    Find the latest time you can arrive and still catch a bus.

    Args:
        buses: List of bus departure times
        passengers: List of passenger arrival times
        capacity: Maximum passengers per bus

    Returns:
        Latest arrival time that allows catching a bus
    """
    # Step 1: Sort both arrays for ordered processing
    buses.sort()
    passengers.sort()

    n, m = len(buses), len(passengers)
    passenger_ptr = 0  # Pointer to next passenger to consider
    occupied = set(passengers)  # For O(1) lookup of occupied times

    # Step 2: Simulate boarding process
    for i in range(n):
        bus_departure = buses[i]
        seats_filled = 0  # Count passengers boarding this bus

        # Board passengers while conditions hold:
        # 1. There are passengers left
        # 2. Passenger arrives before or at bus departure
        # 3. Bus has capacity
        while (passenger_ptr < m and
               passengers[passenger_ptr] <= bus_departure and
               seats_filled < capacity):
            seats_filled += 1
            passenger_ptr += 1

        # Step 3: Check if this bus has an opportunity
        # Case 1: Bus has empty seats after processing all eligible passengers
        if seats_filled < capacity:
            # We can arrive at the bus departure time (if not occupied)
            # Start from bus departure time and work backwards
            candidate = bus_departure
            while candidate in occupied:
                candidate -= 1
            return candidate

    # Step 4: If all buses are full, check times before last boarded passengers
    # We need to work backwards from the last passenger who boarded
    passenger_ptr -= 1  # Move back to last boarded passenger
    candidate = passengers[passenger_ptr] - 1  # Try time just before them

    # Keep moving back until we find an unoccupied time
    while candidate in occupied:
        candidate -= 1

    return candidate
```

```javascript
// Time: O(n log n + m log m) | Space: O(m) for the occupied set
function latestTimeCatchTheBus(buses, passengers, capacity) {
  /**
   * Find the latest time you can arrive and still catch a bus.
   *
   * @param {number[]} buses - Bus departure times
   * @param {number[]} passengers - Passenger arrival times
   * @param {number} capacity - Maximum passengers per bus
   * @return {number} Latest arrival time that allows catching a bus
   */

  // Step 1: Sort both arrays for ordered processing
  buses.sort((a, b) => a - b);
  passengers.sort((a, b) => a - b);

  const n = buses.length,
    m = passengers.length;
  let passengerPtr = 0; // Pointer to next passenger to consider
  const occupied = new Set(passengers); // For O(1) lookup of occupied times

  // Step 2: Simulate boarding process
  for (let i = 0; i < n; i++) {
    const busDeparture = buses[i];
    let seatsFilled = 0; // Count passengers boarding this bus

    // Board passengers while conditions hold:
    // 1. There are passengers left
    // 2. Passenger arrives before or at bus departure
    // 3. Bus has capacity
    while (passengerPtr < m && passengers[passengerPtr] <= busDeparture && seatsFilled < capacity) {
      seatsFilled++;
      passengerPtr++;
    }

    // Step 3: Check if this bus has an opportunity
    // Case 1: Bus has empty seats after processing all eligible passengers
    if (seatsFilled < capacity) {
      // We can arrive at the bus departure time (if not occupied)
      // Start from bus departure time and work backwards
      let candidate = busDeparture;
      while (occupied.has(candidate)) {
        candidate--;
      }
      return candidate;
    }
  }

  // Step 4: If all buses are full, check times before last boarded passengers
  // We need to work backwards from the last passenger who boarded
  passengerPtr--; // Move back to last boarded passenger
  let candidate = passengers[passengerPtr] - 1; // Try time just before them

  // Keep moving back until we find an unoccupied time
  while (occupied.has(candidate)) {
    candidate--;
  }

  return candidate;
}
```

```java
// Time: O(n log n + m log m) | Space: O(m) for the occupied set
import java.util.*;

class Solution {
    public int latestTimeCatchTheBus(int[] buses, int[] passengers, int capacity) {
        /**
         * Find the latest time you can arrive and still catch a bus.
         *
         * @param buses Bus departure times
         * @param passengers Passenger arrival times
         * @param capacity Maximum passengers per bus
         * @return Latest arrival time that allows catching a bus
         */

        // Step 1: Sort both arrays for ordered processing
        Arrays.sort(buses);
        Arrays.sort(passengers);

        int n = buses.length, m = passengers.length;
        int passengerPtr = 0;  // Pointer to next passenger to consider
        Set<Integer> occupied = new HashSet<>();
        for (int passenger : passengers) {
            occupied.add(passenger);
        }

        // Step 2: Simulate boarding process
        for (int i = 0; i < n; i++) {
            int busDeparture = buses[i];
            int seatsFilled = 0;  // Count passengers boarding this bus

            // Board passengers while conditions hold:
            // 1. There are passengers left
            // 2. Passenger arrives before or at bus departure
            // 3. Bus has capacity
            while (passengerPtr < m &&
                   passengers[passengerPtr] <= busDeparture &&
                   seatsFilled < capacity) {
                seatsFilled++;
                passengerPtr++;
            }

            // Step 3: Check if this bus has an opportunity
            // Case 1: Bus has empty seats after processing all eligible passengers
            if (seatsFilled < capacity) {
                // We can arrive at the bus departure time (if not occupied)
                // Start from bus departure time and work backwards
                int candidate = busDeparture;
                while (occupied.contains(candidate)) {
                    candidate--;
                }
                return candidate;
            }
        }

        // Step 4: If all buses are full, check times before last boarded passengers
        // We need to work backwards from the last passenger who boarded
        passengerPtr--;  // Move back to last boarded passenger
        int candidate = passengers[passengerPtr] - 1;  // Try time just before them

        // Keep moving back until we find an unoccupied time
        while (occupied.contains(candidate)) {
            candidate--;
        }

        return candidate;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + m log m)**

- Sorting buses: O(n log n)
- Sorting passengers: O(m log m)
- Simulation loop: O(n + m) — each passenger processed at most once
- Candidate search: O(m) in worst case but typically much less
- Dominated by the sorting operations

**Space Complexity: O(m)**

- The `occupied` set stores all passenger times for O(1) lookup
- Sorting may use O(log n + log m) space for the algorithm's internal operations
- If we can't modify input arrays, we'd need O(n + m) space for copies

## Common Mistakes

1. **Not sorting buses**: Buses might not be given in sorted order. If you process them out of order, you'll incorrectly calculate which passengers are eligible for each bus.

2. **Forgetting to check if candidate time is occupied**: Even if a bus has capacity, you can't arrive at the same time as an existing passenger. The `occupied` set is crucial for this check.

3. **Off-by-one errors with passenger pointer**: When all buses are full and we need to check before the last passenger, we must decrement `passengerPtr` first (since it points to the next passenger after the last boarded one).

4. **Assuming you can arrive at bus departure time**: You must arrive _strictly before_ the bus departs. If bus departs at time t, arriving at t is too late.

5. **Not considering all buses**: Some candidates try to only check the last bus, but earlier buses might have empty seats even if later ones are full.

## When You'll See This Pattern

This problem combines **two-pointer simulation** with **greedy candidate selection**, a pattern common in scheduling and allocation problems:

1. **Minimum Speed to Arrive on Time (LeetCode 1870)**: Similar simulation where you test candidate speeds to meet a deadline.

2. **Maximum Matching of Players With Trainers (LeetCode 2410)**: Two-pointer approach to match players with suitable trainers based on capacity constraints.

3. **Time Taken to Cross the Door (LeetCode 2534)**: More complex simulation with multiple queues and capacity constraints.

The core pattern is: sort inputs, simulate process with pointers, then optimize based on the simulation results.

## Key Takeaways

1. **Simulate then optimize**: First understand exactly what happens during the boarding process, then look for optimization opportunities based on that simulation.

2. **Limited candidate search**: Instead of checking all possible times, identify that only certain times are worth checking (bus departures and times just before boarded passengers).

3. **Two-pointer simulation is powerful**: When processing two sorted sequences with capacity constraints, the two-pointer technique provides an efficient O(n + m) solution.

4. **Edge cases matter**: Empty buses, full buses, arriving at occupied times—these edge cases determine whether your solution is robust.

Related problems: [Minimum Speed to Arrive on Time](/problem/minimum-speed-to-arrive-on-time), [Maximum Matching of Players With Trainers](/problem/maximum-matching-of-players-with-trainers), [Time Taken to Cross the Door](/problem/time-taken-to-cross-the-door)
