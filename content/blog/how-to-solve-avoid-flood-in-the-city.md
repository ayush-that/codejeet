---
title: "How to Solve Avoid Flood in The City — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Avoid Flood in The City. Medium difficulty, 39.0% acceptance rate. Topics: Array, Hash Table, Binary Search, Greedy, Heap (Priority Queue)."
date: "2026-12-13"
category: "dsa-patterns"
tags: ["avoid-flood-in-the-city", "array", "hash-table", "binary-search", "medium"]
---

# How to Solve Avoid Flood in The City

This problem asks us to manage rainfall over lakes to prevent flooding. When rain falls on a lake, it fills up. If rain falls on an already full lake, a flood occurs. We have the ability to dry one lake per day when it doesn't rain. The challenge is deciding **which lake to dry on sunny days** to prevent future floods.

What makes this tricky: We need to look ahead to see when a lake will get rain again, and dry it before that day. This requires both remembering past rains and planning future actions.

## Visual Walkthrough

Let's trace through `rains = [1, 2, 0, 2, 0, 1]`:

**Day 0**: Rain on lake 1 → lake 1 becomes full. Result: `[-1]` (can't dry when raining)
**Day 1**: Rain on lake 2 → lake 2 becomes full. Result: `[-1, -1]`
**Day 2**: Sunny day! We can dry one lake. Both lakes 1 and 2 are full. Which to dry?

- Lake 1 will get rain again on day 5
- Lake 2 will get rain again on day 3
- Lake 2's next rain is sooner, so dry lake 2 first

**Day 3**: Rain on lake 2 → lake 2 was dried on day 2, so it's empty. Fill it. Result: `[-1, -1, 2, -1]`
**Day 4**: Sunny again. Only lake 1 is full (lake 2 just got rain). Dry lake 1.
**Day 5**: Rain on lake 1 → lake 1 was dried on day 4, so it's empty. Fill it. Result: `[-1, -1, 2, -1, 1, -1]`

Final answer: `[-1, -1, 2, -1, 1, -1]`

## Brute Force Approach

A naive approach: For each sunny day, try drying each full lake to see if it prevents future floods.

Algorithm:

1. Track which lakes are full using a set
2. When it rains on a lake:
   - If already full → flood occurs (return `[]`)
   - Otherwise, mark it full
3. On sunny days, try each full lake:
   - Simulate drying it
   - Check if we can complete the schedule without floods
   - Backtrack if needed

Why this fails: Exponential time complexity. For `k` sunny days and `m` full lakes, we have `O(m^k)` possibilities. With up to 10⁵ days, this is impossible.

## Optimized Approach

The key insight: **When we have multiple full lakes on a sunny day, we should dry the one whose next rain is soonest**. This is a greedy choice that maximizes our chances.

We need:

1. A way to track when each lake last rained (to detect floods)
2. A way to find upcoming rains for currently full lakes
3. A priority queue to always dry the lake with nearest future rain

Step-by-step reasoning:

- Iterate through the `rains` array day by day
- When it rains on lake `lake`:
  - If `lake` is already full (we've seen it before and haven't dried it), we need to find a sunny day between its last rain and today to dry it
  - Use binary search to find the earliest sunny day after its last rain occurrence
  - If no such sunny day exists → flood occurs
  - Otherwise, use that sunny day to dry this lake
- On sunny days, we don't immediately decide what to dry. We'll decide later when we encounter a flood risk.

## Optimal Solution

We'll use:

- A hash map to track the last day each lake rained
- A list/array to track sunny days
- A min-heap (priority queue) to manage which lakes need drying soonest

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def avoidFlood(rains):
    """
    Strategy:
    1. Track last rain day for each lake using a dictionary
    2. Use a min-heap to store lakes that need drying (prioritized by next rain day)
    3. Use a set to track currently full lakes
    4. Process each day:
       - If rainy: check if lake is already full → flood
                  otherwise, mark it full and schedule for future drying
       - If sunny: dry the lake with nearest upcoming rain
    """
    from collections import defaultdict
    import heapq

    n = len(rains)
    last_rain = {}  # lake -> last day it rained
    sunny_days = []  # list of sunny day indices
    result = [1] * n  # default to drying lake 1 on sunny days

    # First pass: collect all sunny days
    for i in range(n):
        if rains[i] == 0:
            sunny_days.append(i)
            result[i] = 1  # placeholder, will update later
        else:
            result[i] = -1  # rainy days always get -1

    # Min-heap: (next_rain_day, lake)
    # Tracks lakes that need drying, ordered by when they'll rain next
    heap = []
    full_lakes = set()  # lakes currently full

    for i in range(n):
        lake = rains[i]

        if lake > 0:  # Rainy day
            if lake in full_lakes:
                # Flood! This lake is already full
                return []

            # Mark lake as full
            full_lakes.add(lake)

            # Schedule this lake for future drying
            if lake in last_rain:
                # We need to dry this lake before its next rain
                # Find the earliest sunny day after last rain
                # Use binary search on sunny_days
                import bisect
                idx = bisect.bisect_left(sunny_days, last_rain[lake])

                if idx == len(sunny_days) or sunny_days[idx] >= i:
                    # No sunny day available between last rain and now
                    return []

                # Use this sunny day to dry the lake
                sunny_day = sunny_days.pop(idx)
                result[sunny_day] = lake

                # Remove from full lakes since we dried it
                full_lakes.remove(lake)

            # Update last rain day for this lake
            last_rain[lake] = i

        # else: sunny day - we handle these when we need them

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function avoidFlood(rains) {
  /**
   * Strategy:
   * 1. Track last rain day for each lake using a Map
   * 2. Use binary search to find sunny days between rains
   * 3. Process each day, handling floods and scheduling drying
   */
  const n = rains.length;
  const lastRain = new Map(); // lake -> last rain day
  const sunnyDays = []; // indices of sunny days
  const result = new Array(n).fill(1); // default to drying lake 1

  // First pass: collect sunny days and initialize result array
  for (let i = 0; i < n; i++) {
    if (rains[i] === 0) {
      sunnyDays.push(i);
      result[i] = 1; // placeholder
    } else {
      result[i] = -1; // rainy days
    }
  }

  const fullLakes = new Set(); // currently full lakes

  for (let i = 0; i < n; i++) {
    const lake = rains[i];

    if (lake > 0) {
      // Rainy day
      if (fullLakes.has(lake)) {
        // Flood! Lake is already full
        return [];
      }

      // Mark lake as full
      fullLakes.add(lake);

      if (lastRain.has(lake)) {
        // Need to dry this lake before current rain
        // Find earliest sunny day after last rain
        const lastRainDay = lastRain.get(lake);

        // Binary search for sunny day
        let left = 0,
          right = sunnyDays.length - 1;
        let sunnyIdx = -1;

        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          if (sunnyDays[mid] > lastRainDay) {
            sunnyIdx = mid;
            right = mid - 1;
          } else {
            left = mid + 1;
          }
        }

        if (sunnyIdx === -1 || sunnyDays[sunnyIdx] >= i) {
          // No available sunny day
          return [];
        }

        // Use this sunny day to dry the lake
        const sunnyDay = sunnyDays[sunnyIdx];
        sunnyDays.splice(sunnyIdx, 1); // remove used sunny day
        result[sunnyDay] = lake;

        // Lake is no longer full
        fullLakes.delete(lake);
      }

      // Update last rain day
      lastRain.set(lake, i);
    }
    // Sunny days are handled when needed above
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int[] avoidFlood(int[] rains) {
        /**
         * Strategy:
         * 1. Use HashMap to track last rain day for each lake
         * 2. Use TreeSet to efficiently find sunny days between rains
         * 3. Process days, using sunny days to prevent floods
         */
        int n = rains.length;
        Map<Integer, Integer> lastRain = new HashMap<>();  // lake -> last rain day
        TreeSet<Integer> sunnyDays = new TreeSet<>();  // sorted set of sunny days
        int[] result = new int[n];

        // Initialize result array and collect sunny days
        for (int i = 0; i < n; i++) {
            if (rains[i] == 0) {
                sunnyDays.add(i);
                result[i] = 1;  // default drying choice
            } else {
                result[i] = -1;  // rainy days
            }
        }

        Set<Integer> fullLakes = new HashSet<>();  // currently full lakes

        for (int i = 0; i < n; i++) {
            int lake = rains[i];

            if (lake > 0) {  // Rainy day
                if (fullLakes.contains(lake)) {
                    // Flood! Lake is already full
                    return new int[0];
                }

                // Mark lake as full
                fullLakes.add(lake);

                if (lastRain.containsKey(lake)) {
                    // Need to dry this lake before current rain
                    // Find earliest sunny day after last rain
                    Integer sunnyDay = sunnyDays.higher(lastRain.get(lake));

                    if (sunnyDay == null || sunnyDay >= i) {
                        // No available sunny day between rains
                        return new int[0];
                    }

                    // Use this sunny day to dry the lake
                    result[sunnyDay] = lake;
                    sunnyDays.remove(sunnyDay);

                    // Lake is no longer full
                    fullLakes.remove(lake);
                }

                // Update last rain day
                lastRain.put(lake, i);
            }
            // Sunny days are handled when needed above
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- We process each of the `n` days once → O(n)
- For each lake that needs drying, we perform:
  - Binary search on sunny days (Python/JS) or TreeSet operations (Java) → O(log n)
  - Removing used sunny days → O(log n) for TreeSet, O(n) for array removal (but we use binary search + pop in Python/JS)
- In worst case, each rainy day might need a binary search → O(n log n)

**Space Complexity: O(n)**

- `last_rain` dictionary: O(n) in worst case (all different lakes)
- `sunny_days` list: O(n) in worst case (all sunny days)
- `result` array: O(n)
- `full_lakes` set: O(n)

## Common Mistakes

1. **Not checking for floods immediately**: When rain falls on a full lake, you must return `[]` immediately. Some candidates try to rearrange sunny days retroactively, which doesn't work.

2. **Wrong priority when choosing which lake to dry**: Always dry the lake whose next rain is soonest. Drying a lake that won't rain for a long time wastes sunny days.

3. **Forgetting to update data structures**: After using a sunny day to dry a lake, you must:
   - Remove it from `full_lakes`
   - Remove the sunny day from available days
   - Update the result array for that sunny day

4. **Incorrect binary search bounds**: When looking for a sunny day between `last_rain[lake]` and current day `i`, the sunny day must be:
   - Greater than `last_rain[lake]` (after last rain)
   - Less than `i` (before current rain)
   - The earliest such sunny day

## When You'll See This Pattern

This problem combines **greedy scheduling** with **interval management**:

1. **Task Scheduler** (LeetCode 621): Similar concept of scheduling tasks with cooldown periods, using priority queues to choose which task to do next.

2. **Meeting Rooms II** (LeetCode 253): Managing overlapping intervals, though here we're preventing overlaps by scheduling "drying" operations between rains.

3. **Car Pooling** (LeetCode 1094): Managing capacity over time, checking if we can handle all passengers without exceeding capacity.

The core pattern: When you need to schedule limited resources (sunny days) to prevent conflicts (floods), and future events (rains) are known in advance, think about greedy scheduling with priority queues or binary search.

## Key Takeaways

1. **Greedy with lookahead works when future is known**: Since we know all future rain days from the input, we can make optimal greedy choices by always addressing the most urgent flood risk.

2. **Binary search finds resources in sorted sequences**: When you need to find the first available resource (sunny day) after a certain point, binary search on a sorted list is efficient.

3. **Multiple data structures for different operations**: We use hash maps for O(1) lookups, sets for membership testing, and sorted structures for finding nearest elements. Choose the right tool for each operation.

[Practice this problem on CodeJeet](/problem/avoid-flood-in-the-city)
