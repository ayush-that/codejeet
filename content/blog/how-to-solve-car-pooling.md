---
title: "How to Solve Car Pooling — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Car Pooling. Medium difficulty, 56.2% acceptance rate. Topics: Array, Sorting, Heap (Priority Queue), Simulation, Prefix Sum."
date: "2027-12-11"
category: "dsa-patterns"
tags: ["car-pooling", "array", "sorting", "heap-(priority-queue)", "medium"]
---

# How to Solve Car Pooling

Car pooling asks whether a vehicle with given capacity can complete all passenger trips without exceeding capacity at any point. The tricky part is that passengers get on and off at different locations along a one-dimensional route, so we need to track the changing passenger count as the car moves forward.

## Visual Walkthrough

Let's trace through an example: `capacity = 4`, `trips = [[2,1,5],[3,3,7]]`

We can think of this as a timeline from location 0 to the furthest drop-off point (7):

1. **At location 1**: 2 passengers get on → current passengers = 2
2. **At location 3**: 3 passengers get on → current passengers = 2 + 3 = 5
   - But capacity is only 4! This already exceeds capacity.
   - The answer should be `false` (or `False` in Python).

Let's try a valid example: `capacity = 5`, `trips = [[2,1,5],[3,3,7]]`

1. **At location 1**: +2 passengers → current = 2
2. **At location 3**: +3 passengers → current = 5 (at capacity)
3. **At location 5**: -2 passengers → current = 3 (first group gets off)
4. **At location 7**: -3 passengers → current = 0

Since we never exceeded capacity of 5, this should return `true`.

The key insight: we need to track passenger changes at each location efficiently.

## Brute Force Approach

A naive approach would simulate every location from 0 to the maximum drop-off point:

1. Find the furthest location any passenger goes to
2. For each location from 0 to that maximum:
   - Check all trips to see if any start at this location (add passengers)
   - Check all trips to see if any end at this location (remove passengers)
   - Track current passenger count
   - If it ever exceeds capacity, return false

This is O(n × m) where n is number of trips and m is the maximum location. For large distances (e.g., trips from 0 to 1000000), this becomes extremely inefficient even with few trips.

## Optimized Approach

The optimal solution uses a **prefix sum** or **sweep line** technique:

1. **Key observation**: We only care about locations where passenger counts change (pickup or dropoff points).
2. **Approach**: Create an array or map that tracks net passenger change at each location.
3. **Process**:
   - For each trip `[passengers, from, to]`:
     - At `from`: add `passengers` (people get on)
     - At `to`: subtract `passengers` (people get off)
   - Sort or iterate through locations in order
   - Maintain running total of passengers
   - If running total ever exceeds capacity, return false

Why this works: Instead of checking every possible location, we only process points where something actually happens. This reduces complexity from O(max_location) to O(n log n) for sorting or O(n + k) for bucket approaches.

## Optimal Solution

Here's the implementation using a dictionary/map to track changes, then processing locations in sorted order:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def carPooling(trips, capacity):
    """
    Determines if a car can complete all trips without exceeding capacity.

    Args:
        trips: List of [numPassengers, from, to]
        capacity: Maximum number of passengers the car can hold

    Returns:
        bool: True if all trips can be completed, False otherwise
    """
    # Dictionary to track passenger changes at each location
    # Key: location, Value: net change in passengers
    changes = {}

    # Process each trip
    for passengers, start, end in trips:
        # Add passengers at pickup location
        changes[start] = changes.get(start, 0) + passengers
        # Remove passengers at dropoff location
        changes[end] = changes.get(end, 0) - passengers

    # Track current number of passengers in the car
    current_passengers = 0

    # Process locations in sorted order (from smallest to largest)
    for location in sorted(changes.keys()):
        # Update current passengers with the change at this location
        current_passengers += changes[location]

        # Check if we've exceeded capacity at any point
        if current_passengers > capacity:
            return False

    # If we never exceeded capacity, all trips can be completed
    return True
```

```javascript
// Time: O(n log n) | Space: O(n)
function carPooling(trips, capacity) {
  /**
   * Determines if a car can complete all trips without exceeding capacity.
   *
   * @param {number[][]} trips - Array of [numPassengers, from, to]
   * @param {number} capacity - Maximum number of passengers
   * @return {boolean} - True if all trips can be completed
   */

  // Map to track passenger changes at each location
  const changes = new Map();

  // Process each trip
  for (const [passengers, start, end] of trips) {
    // Add passengers at pickup location
    changes.set(start, (changes.get(start) || 0) + passengers);
    // Remove passengers at dropoff location
    changes.set(end, (changes.get(end) || 0) - passengers);
  }

  // Sort locations in ascending order
  const sortedLocations = Array.from(changes.keys()).sort((a, b) => a - b);

  // Track current number of passengers
  let currentPassengers = 0;

  // Process locations in order
  for (const location of sortedLocations) {
    // Update current passengers
    currentPassengers += changes.get(location);

    // Check if capacity is exceeded
    if (currentPassengers > capacity) {
      return false;
    }
  }

  // All trips can be completed
  return true;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public boolean carPooling(int[][] trips, int capacity) {
        /**
         * Determines if a car can complete all trips without exceeding capacity.
         *
         * @param trips - Array of [numPassengers, from, to]
         * @param capacity - Maximum number of passengers
         * @return true if all trips can be completed
         */

        // Map to track passenger changes at each location
        Map<Integer, Integer> changes = new HashMap<>();

        // Process each trip
        for (int[] trip : trips) {
            int passengers = trip[0];
            int start = trip[1];
            int end = trip[2];

            // Add passengers at pickup location
            changes.put(start, changes.getOrDefault(start, 0) + passengers);
            // Remove passengers at dropoff location
            changes.put(end, changes.getOrDefault(end, 0) - passengers);
        }

        // Sort locations in ascending order
        List<Integer> locations = new ArrayList<>(changes.keySet());
        Collections.sort(locations);

        // Track current number of passengers
        int currentPassengers = 0;

        // Process locations in order
        for (int location : locations) {
            // Update current passengers
            currentPassengers += changes.get(location);

            // Check if capacity is exceeded
            if (currentPassengers > capacity) {
                return false;
            }
        }

        // All trips can be completed
        return true;
    }
}
```

</div>

**Alternative bucket sort approach** (when locations have a reasonable bound, e.g., ≤ 1000):

<div class="code-group">

```python
# Time: O(n + m) where m is max location | Space: O(m)
def carPoolingBucket(trips, capacity):
    """
    Alternative approach using bucket sort when locations are bounded.
    More efficient when max location is not too large.
    """
    # Find the furthest location
    max_location = 0
    for _, _, end in trips:
        max_location = max(max_location, end)

    # Create array to track passenger changes
    changes = [0] * (max_location + 1)

    # Record passenger changes
    for passengers, start, end in trips:
        changes[start] += passengers
        changes[end] -= passengers

    # Track current passengers
    current = 0
    for i in range(max_location + 1):
        current += changes[i]
        if current > capacity:
            return False

    return True
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Building the changes map/dictionary: O(n) where n is number of trips
- Sorting the locations: O(k log k) where k is number of unique locations (≤ 2n)
- Processing sorted locations: O(k)
- Overall: O(n + k log k) = O(n log n) in worst case

**Space Complexity: O(n)**

- We store at most 2n entries in the changes map (one for pickup, one for dropoff per trip)
- The sorted locations array also takes O(n) space

**For the bucket sort approach: O(n + m) time, O(m) space** where m is the maximum location value.

## Common Mistakes

1. **Off-by-one with dropoff location**: Some candidates subtract passengers at `to - 1` instead of `to`. Remember: if a trip ends at location 5, passengers get off **before** traveling to location 5, so the car has fewer passengers starting at location 5.

2. **Not sorting locations**: If you process locations in arbitrary order (like dictionary iteration order), you'll get incorrect passenger counts. Locations must be processed in increasing order.

3. **Using array without knowing bounds**: Creating an array sized to the maximum location works well when locations are small (≤ 1000), but can waste memory or fail if locations are very large (e.g., 10^9). Always check constraints.

4. **Forgetting to check capacity during the trip**: Some candidates only check if total passengers exceed capacity, but we need to check at **every point** along the route, not just at the beginning.

## When You'll See This Pattern

The "sweep line" or "prefix sum on events" pattern appears in problems where you need to track overlapping intervals or count changes over time/space:

1. **Meeting Rooms II (LeetCode 253)** - Almost identical! Instead of passengers, you're counting meetings. Instead of capacity, you're finding minimum rooms needed.

2. **Corporate Flight Bookings (LeetCode 1109)** - Exactly the same pattern: bookings with start/end and passenger counts.

3. **Range Addition (LeetCode 370)** - Applying increments over ranges in an array.

4. **My Calendar III (LeetCode 732)** - Tracking maximum overlapping events over time.

The pattern: When you see problems about "overlapping intervals" or "changes at specific points," think about tracking +1/-1 events at boundaries.

## Key Takeaways

1. **Sweep line technique**: When dealing with intervals or ranges, track changes at boundaries rather than simulating every point. This transforms O(n × range) problems into O(n log n).

2. **Sort events**: Always process location/time-based events in sorted order to maintain correct running totals.

3. **Space-time tradeoff**: If the range of locations is small and known, use array/bucket approach for O(n + range) time. If range is large or unknown, use map/dictionary with sorting.

4. **Think in terms of deltas**: Instead of tracking absolute values at each point, track how values change at event boundaries.

Related problems: [Meeting Rooms II](/problem/meeting-rooms-ii)
