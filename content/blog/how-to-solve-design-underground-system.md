---
title: "How to Solve Design Underground System — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Underground System. Medium difficulty, 74.4% acceptance rate. Topics: Hash Table, String, Design."
date: "2028-03-25"
category: "dsa-patterns"
tags: ["design-underground-system", "hash-table", "string", "design", "medium"]
---

## How to Solve Design Underground System

This problem asks us to design a system that tracks customer check-ins and check-outs at subway stations, then calculates the average travel time between any two stations. What makes this interesting is that we need to handle two separate but related operations: recording individual journeys and computing aggregate statistics. The challenge lies in efficiently connecting a customer's check-in with their check-out while maintaining running totals for station pairs.

## Visual Walkthrough

Let's trace through a concrete example:

1. `checkIn(45, "Leyton", 3)` - Customer 45 checks in at Leyton at time 3
2. `checkIn(32, "Paradise", 8)` - Customer 32 checks in at Paradise at time 8
3. `checkIn(27, "Leyton", 10)` - Customer 27 checks in at Leyton at time 10
4. `checkOut(45, "Waterloo", 15)` - Customer 45 checks out at Waterloo at time 15
   - Travel time: 15 - 3 = 12 minutes
   - Route: "Leyton->Waterloo" now has 1 trip totaling 12 minutes
5. `checkOut(27, "Waterloo", 20)` - Customer 27 checks out at Waterloo at time 20
   - Travel time: 20 - 10 = 10 minutes
   - Route: "Leyton->Waterloo" now has 2 trips totaling 22 minutes
6. `checkOut(32, "Cambridge", 22)` - Customer 32 checks out at Cambridge at time 22
   - Travel time: 22 - 8 = 14 minutes
   - Route: "Paradise->Cambridge" has 1 trip totaling 14 minutes
7. `getAverageTime("Leyton", "Waterloo")` - Returns 22 / 2 = 11
8. `getAverageTime("Paradise", "Cambridge")` - Returns 14 / 1 = 14

The key insight: we need to store check-in data temporarily until checkout, then move that data to aggregate statistics for the route.

## Brute Force Approach

A naive approach might store all individual trips in a list:

1. Store check-ins in a dictionary: `{customer_id: (station, time)}`
2. On checkout, calculate travel time and append to a list for that route
3. For `getAverageTime`, sum all times in the route's list and divide by count

The problem with this approach is that `getAverageTime` becomes O(n) where n is the number of trips between those stations. With many trips, this becomes inefficient. We also waste space storing every individual trip when we only need running totals.

## Optimized Approach

The optimal solution uses two hash maps:

1. **Active trips map**: `{customer_id: (check_in_station, check_in_time)}`
   - Stores check-in data until checkout
   - O(1) lookup to find a customer's check-in

2. **Route statistics map**: `{route_key: (total_time, trip_count)}`
   - Route key combines start and end stations (e.g., "Leyton->Waterloo")
   - Stores running total of travel times and count of trips
   - Allows O(1) average calculation: `total_time / trip_count`

**Key insight**: We don't need to store individual trips. By maintaining running totals, we can compute averages in constant time while using minimal space.

**Step-by-step reasoning**:

- When a customer checks in, store their station and time
- When they check out:
  1. Look up their check-in data
  2. Calculate travel time: `checkout_time - check_in_time`
  3. Create route key: `start_station + "->" + end_station`
  4. Update route statistics: add to total time, increment count
  5. Remove the customer from active trips (they've completed their journey)
- For average time: simply divide total time by count for that route

## Optimal Solution

<div class="code-group">

```python
class UndergroundSystem:
    """
    Time Complexity:
    - checkIn: O(1)
    - checkOut: O(1)
    - getAverageTime: O(1)

    Space Complexity: O(P + S^2) where P is number of active passengers,
                      S is number of stations (worst-case routes)
    """

    def __init__(self):
        # Map customer_id -> (check_in_station, check_in_time)
        self.check_ins = {}

        # Map route_key -> [total_travel_time, trip_count]
        # Route key format: "start_station->end_station"
        self.route_stats = {}

    def checkIn(self, id: int, stationName: str, t: int) -> None:
        """
        Record customer check-in.
        Assumes each customer can only have one active trip at a time.
        """
        # Store check-in data for this customer
        self.check_ins[id] = (stationName, t)

    def checkOut(self, id: int, stationName: str, t: int) -> None:
        """
        Record customer check-out and update route statistics.
        """
        # Retrieve check-in data for this customer
        start_station, start_time = self.check_ins[id]

        # Create unique key for this route
        route_key = f"{start_station}->{stationName}"

        # Calculate travel time for this trip
        travel_time = t - start_time

        # Update route statistics
        if route_key not in self.route_stats:
            # First trip on this route
            self.route_stats[route_key] = [travel_time, 1]
        else:
            # Add to existing totals
            self.route_stats[route_key][0] += travel_time
            self.route_stats[route_key][1] += 1

        # Remove customer from active trips (trip completed)
        del self.check_ins[id]

    def getAverageTime(self, startStation: str, endStation: str) -> float:
        """
        Calculate average travel time for a specific route.
        """
        route_key = f"{startStation}->{endStation}"

        # Retrieve total time and count for this route
        total_time, count = self.route_stats[route_key]

        # Calculate and return average
        return total_time / count
```

```javascript
class UndergroundSystem {
  /**
   * Time Complexity:
   * - checkIn: O(1)
   * - checkOut: O(1)
   * - getAverageTime: O(1)
   *
   * Space Complexity: O(P + S^2) where P is active passengers,
   *                   S is stations (worst-case routes)
   */
  constructor() {
    // Map customer_id -> {station: check_in_station, time: check_in_time}
    this.checkIns = new Map();

    // Map route_key -> {totalTime: number, count: number}
    // Route key format: "startStation->endStation"
    this.routeStats = new Map();
  }

  /**
   * Record customer check-in.
   * @param {number} id - Customer ID
   * @param {string} stationName - Check-in station
   * @param {number} t - Check-in time
   */
  checkIn(id, stationName, t) {
    // Store check-in data for this customer
    this.checkIns.set(id, { station: stationName, time: t });
  }

  /**
   * Record customer check-out and update route statistics.
   * @param {number} id - Customer ID
   * @param {string} stationName - Check-out station
   * @param {number} t - Check-out time
   */
  checkOut(id, stationName, t) {
    // Retrieve check-in data for this customer
    const checkInData = this.checkIns.get(id);
    const startStation = checkInData.station;
    const startTime = checkInData.time;

    // Create unique key for this route
    const routeKey = `${startStation}->${stationName}`;

    // Calculate travel time for this trip
    const travelTime = t - startTime;

    // Update route statistics
    if (!this.routeStats.has(routeKey)) {
      // First trip on this route
      this.routeStats.set(routeKey, { totalTime: travelTime, count: 1 });
    } else {
      // Add to existing totals
      const stats = this.routeStats.get(routeKey);
      stats.totalTime += travelTime;
      stats.count += 1;
    }

    // Remove customer from active trips (trip completed)
    this.checkIns.delete(id);
  }

  /**
   * Calculate average travel time for a specific route.
   * @param {string} startStation - Starting station
   * @param {string} endStation - Ending station
   * @return {number} Average travel time
   */
  getAverageTime(startStation, endStation) {
    const routeKey = `${startStation}->${endStation}`;

    // Retrieve total time and count for this route
    const { totalTime, count } = this.routeStats.get(routeKey);

    // Calculate and return average
    return totalTime / count;
  }
}
```

```java
class UndergroundSystem {
    /**
     * Time Complexity:
     * - checkIn: O(1)
     * - checkOut: O(1)
     * - getAverageTime: O(1)
     *
     * Space Complexity: O(P + S^2) where P is active passengers,
     *                   S is stations (worst-case routes)
     */

    // Map customer_id -> CheckInData (station and time)
    private Map<Integer, CheckInData> checkIns;

    // Map route_key -> RouteStats (total time and count)
    // Route key format: "startStation->endStation"
    private Map<String, RouteStats> routeStats;

    // Helper class to store check-in data
    private class CheckInData {
        String station;
        int time;

        CheckInData(String station, int time) {
            this.station = station;
            this.time = time;
        }
    }

    // Helper class to store route statistics
    private class RouteStats {
        int totalTime;
        int count;

        RouteStats(int totalTime, int count) {
            this.totalTime = totalTime;
            this.count = count;
        }
    }

    public UndergroundSystem() {
        checkIns = new HashMap<>();
        routeStats = new HashMap<>();
    }

    public void checkIn(int id, String stationName, int t) {
        // Store check-in data for this customer
        checkIns.put(id, new CheckInData(stationName, t));
    }

    public void checkOut(int id, String stationName, int t) {
        // Retrieve check-in data for this customer
        CheckInData checkInData = checkIns.get(id);
        String startStation = checkInData.station;
        int startTime = checkInData.time;

        // Create unique key for this route
        String routeKey = startStation + "->" + stationName;

        // Calculate travel time for this trip
        int travelTime = t - startTime;

        // Update route statistics
        RouteStats stats = routeStats.getOrDefault(routeKey,
            new RouteStats(0, 0));
        stats.totalTime += travelTime;
        stats.count += 1;
        routeStats.put(routeKey, stats);

        // Remove customer from active trips (trip completed)
        checkIns.remove(id);
    }

    public double getAverageTime(String startStation, String endStation) {
        String routeKey = startStation + "->" + endStation;

        // Retrieve total time and count for this route
        RouteStats stats = routeStats.get(routeKey);

        // Calculate and return average
        return (double) stats.totalTime / stats.count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `checkIn(id, station, t)`: O(1) - Simple dictionary/map insertion
- `checkOut(id, station, t)`: O(1) - Dictionary lookup, calculation, and update
- `getAverageTime(start, end)`: O(1) - Dictionary lookup and division

**Space Complexity:**

- Active trips map: O(P) where P is the maximum number of concurrent active trips
- Route statistics map: O(S²) in worst case where every station connects to every other station
- In practice, space usage is reasonable since not all station pairs will have trips

## Common Mistakes

1. **Not removing completed trips**: Forgetting to delete check-in data after checkout can cause memory leaks and incorrect behavior if a customer checks in again.

2. **Incorrect route key format**: Using a non-unique separator or format that could cause collisions (e.g., station names containing "->").

3. **Integer division**: In languages like Java, dividing two integers gives an integer result. Need to cast to double/float for accurate averages.

4. **Assuming valid inputs**: Not handling cases where `getAverageTime` is called for a route with no trips. The problem guarantees at least one trip, but in real interviews, you should mention this assumption.

## When You'll See This Pattern

This two-hashmap pattern appears in problems requiring both individual tracking and aggregate statistics:

1. **Design Hit Counter (LeetCode 362)**: Track hits per timestamp and need to get hits in last 5 minutes. Similar need to maintain both individual hits and rolling totals.

2. **Time Based Key-Value Store (LeetCode 981)**: Store values with timestamps and retrieve values based on time. Uses similar timestamp-based lookups.

3. **Logger Rate Limiter (LeetCode 359)**: Track last timestamp per message to determine if message should be printed. Uses a single hashmap for individual tracking.

The core pattern: Use one data structure for active/individual records and another for aggregated/processed data.

## Key Takeaways

1. **Separate concerns**: When a problem requires both per-entity tracking and aggregate calculations, consider using separate data structures for each purpose.

2. **Trade memory for speed**: Storing running totals (total time, count) allows O(1) average calculations instead of O(n) recalculations.

3. **Design for the operations**: Analyze which operations need to be fast (checkIn, checkOut, getAverageTime) and choose data structures that optimize those specific operations.

Related problems: [Design Bitset](/problem/design-bitset)
