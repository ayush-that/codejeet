---
title: "How to Solve Bus Routes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Bus Routes. Hard difficulty, 47.1% acceptance rate. Topics: Array, Hash Table, Breadth-First Search."
date: "2028-02-21"
category: "dsa-patterns"
tags: ["bus-routes", "array", "hash-table", "breadth-first-search", "hard"]
---

# How to Solve Bus Routes

You're given bus routes where each route is a circular list of stops, a starting bus stop, and a target bus stop. The goal is to find the minimum number of buses you must take to reach the target from the start. What makes this problem tricky is that you're not just moving between stops—you're switching between entire bus routes, and multiple buses can visit the same stop, creating a complex network of connections.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
routes = [[1,2,7],[3,6,7]]
source = 1
target = 6
```

**Step 1: Build a map from stops to buses**

- Stop 1: [Bus 0]
- Stop 2: [Bus 0]
- Stop 3: [Bus 1]
- Stop 6: [Bus 1]
- Stop 7: [Bus 0, Bus 1] ← Key connection point!

**Step 2: BFS starting from source stop 1**

- Start: We're at stop 1, we've taken 0 buses
- From stop 1, we can take Bus 0
- Taking Bus 0 gives us access to all its stops: 1, 2, 7
- We mark Bus 0 as used (to avoid revisiting)

**Step 3: Explore from newly accessible stops**

- From Bus 0's stops, we check stop 7
- Stop 7 connects to Bus 1 (which we haven't used yet)
- We take Bus 1, incrementing our bus count to 2
- Bus 1's stops include 3, 6, 7
- Stop 6 is our target! We found it in 2 buses.

The key insight: We're doing BFS on **buses**, not stops. Each "level" in BFS represents taking one additional bus.

## Brute Force Approach

A naive approach might try to explore all possible sequences of stops:

1. Start at the source stop
2. For each bus that visits the current stop
3. Try all stops on that bus's route
4. Repeat until finding the target

This approach has several problems:

- It could get stuck in infinite loops (circular routes)
- It doesn't track which buses we've already used
- The branching factor is huge: at each stop, you might have multiple buses, and each bus has multiple stops
- Worst-case time complexity would be exponential

The brute force fails because it treats this as a simple graph of stops, but the real cost is in switching buses, not moving between stops on the same bus.

## Optimized Approach

The key insight is to recognize this as a **bipartite graph problem**:

- **Nodes**: Buses (not stops!)
- **Edges**: Two buses are connected if they share at least one stop
- **Start**: All buses that visit the source stop
- **Target**: All buses that visit the target stop

We perform BFS on this bus graph:

1. Build a map: stop → list of buses that visit it
2. Initialize BFS queue with all buses that visit the source stop
3. Track visited buses (not stops!)
4. For each bus in the current BFS level:
   - If this bus visits the target stop, return current bus count
   - Otherwise, for each stop this bus visits:
     - For each other bus that visits that stop (and isn't visited yet):
       - Add it to the next BFS level
5. Each BFS level represents taking one additional bus

Why this works: The minimum number of buses equals the shortest path in the bus graph from any source bus to any target bus.

## Optimal Solution

<div class="code-group">

```python
# Time: O(S + B^2) where S = total stops across all routes, B = number of buses
# Space: O(S + B) for the stop-to-buses map and visited set
from collections import deque, defaultdict

def numBusesToDestination(routes, source, target):
    # Edge case: source and target are the same
    if source == target:
        return 0

    # Step 1: Build a map from each stop to all buses that visit it
    stop_to_buses = defaultdict(list)
    for bus_id, route in enumerate(routes):
        for stop in route:
            stop_to_buses[stop].append(bus_id)

    # Step 2: Initialize BFS
    # We start with all buses that can be taken from the source stop
    queue = deque()
    visited_buses = set()

    # Add all buses that visit the source stop to the initial queue
    for bus_id in stop_to_buses[source]:
        queue.append(bus_id)
        visited_buses.add(bus_id)

    # Step 3: BFS on buses
    buses_taken = 1  # We've taken one bus to start

    while queue:
        # Process all buses at the current level
        level_size = len(queue)

        for _ in range(level_size):
            current_bus = queue.popleft()

            # Check if this bus visits the target stop
            if target in routes[current_bus]:
                return buses_taken

            # Explore all stops this bus visits
            for stop in routes[current_bus]:
                # For each other bus that visits this stop
                for next_bus in stop_to_buses[stop]:
                    if next_bus not in visited_buses:
                        visited_buses.add(next_bus)
                        queue.append(next_bus)

        # We've taken one more bus
        buses_taken += 1

    # If we exhaust all possibilities without finding target
    return -1
```

```javascript
// Time: O(S + B^2) where S = total stops across all routes, B = number of buses
// Space: O(S + B) for the stop-to-buses map and visited set
function numBusesToDestination(routes, source, target) {
  // Edge case: source and target are the same
  if (source === target) {
    return 0;
  }

  // Step 1: Build a map from each stop to all buses that visit it
  const stopToBuses = new Map();

  for (let busId = 0; busId < routes.length; busId++) {
    for (const stop of routes[busId]) {
      if (!stopToBuses.has(stop)) {
        stopToBuses.set(stop, []);
      }
      stopToBuses.get(stop).push(busId);
    }
  }

  // Step 2: Initialize BFS
  const queue = [];
  const visitedBuses = new Set();

  // Add all buses that visit the source stop to the initial queue
  const sourceBuses = stopToBuses.get(source) || [];
  for (const busId of sourceBuses) {
    queue.push(busId);
    visitedBuses.add(busId);
  }

  // Step 3: BFS on buses
  let busesTaken = 1; // We've taken one bus to start

  while (queue.length > 0) {
    // Process all buses at the current level
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const currentBus = queue.shift();

      // Check if this bus visits the target stop
      if (routes[currentBus].includes(target)) {
        return busesTaken;
      }

      // Explore all stops this bus visits
      for (const stop of routes[currentBus]) {
        // For each other bus that visits this stop
        const nextBuses = stopToBuses.get(stop) || [];
        for (const nextBus of nextBuses) {
          if (!visitedBuses.has(nextBus)) {
            visitedBuses.add(nextBus);
            queue.push(nextBus);
          }
        }
      }
    }

    // We've taken one more bus
    busesTaken++;
  }

  // If we exhaust all possibilities without finding target
  return -1;
}
```

```java
// Time: O(S + B^2) where S = total stops across all routes, B = number of buses
// Space: O(S + B) for the stop-to-buses map and visited set
import java.util.*;

class Solution {
    public int numBusesToDestination(int[][] routes, int source, int target) {
        // Edge case: source and target are the same
        if (source == target) {
            return 0;
        }

        // Step 1: Build a map from each stop to all buses that visit it
        Map<Integer, List<Integer>> stopToBuses = new HashMap<>();

        for (int busId = 0; busId < routes.length; busId++) {
            for (int stop : routes[busId]) {
                stopToBuses.putIfAbsent(stop, new ArrayList<>());
                stopToBuses.get(stop).add(busId);
            }
        }

        // Step 2: Initialize BFS
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> visitedBuses = new HashSet<>();

        // Add all buses that visit the source stop to the initial queue
        List<Integer> sourceBuses = stopToBuses.get(source);
        if (sourceBuses != null) {
            for (int busId : sourceBuses) {
                queue.offer(busId);
                visitedBuses.add(busId);
            }
        }

        // Step 3: BFS on buses
        int busesTaken = 1;  // We've taken one bus to start

        while (!queue.isEmpty()) {
            // Process all buses at the current level
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int currentBus = queue.poll();

                // Check if this bus visits the target stop
                for (int stop : routes[currentBus]) {
                    if (stop == target) {
                        return busesTaken;
                    }
                }

                // Explore all stops this bus visits
                for (int stop : routes[currentBus]) {
                    List<Integer> nextBuses = stopToBuses.get(stop);
                    if (nextBuses != null) {
                        for (int nextBus : nextBuses) {
                            if (!visitedBuses.contains(nextBus)) {
                                visitedBuses.add(nextBus);
                                queue.offer(nextBus);
                            }
                        }
                    }
                }
            }

            // We've taken one more bus
            busesTaken++;
        }

        // If we exhaust all possibilities without finding target
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(S + B²)**

- **S**: Total number of stops across all routes (sum of lengths of all routes)
- **B**: Number of buses (routes.length)

**Breakdown:**

1. Building `stop_to_buses`: O(S) - we visit each stop once
2. BFS traversal: In worst case, each bus connects to every other bus through shared stops, creating O(B²) edges to explore

**Space Complexity: O(S + B)**

- `stop_to_buses`: O(S) - stores each stop with its list of buses
- `visited_buses`: O(B) - tracks which buses we've used
- BFS queue: O(B) in worst case

## Common Mistakes

1. **BFS on stops instead of buses**: Candidates often try to BFS on stops, tracking visited stops. This fails because you can revisit stops with different buses, and the cost is in bus switches, not stop visits.

2. **Forgetting the source == target edge case**: If you start and end at the same stop, you don't need any buses. Always check this first.

3. **Not handling disconnected networks**: If no bus visits the source or target, or if they're in completely disconnected parts of the network, return -1. Don't assume a path exists.

4. **Inefficient target checking**: Checking `if target in routes[current_bus]` is O(n) for lists. For optimization, you could convert routes to sets during preprocessing, though this increases space usage.

## When You'll See This Pattern

This "graph transformation" pattern appears in problems where:

1. The natural elements (stops) aren't the right nodes for shortest path
2. You need to define new nodes (buses) based on relationships between elements
3. The cost metric involves switching between groups rather than moving between elements

**Related problems:**

1. **Word Ladder** - Transform words by changing one letter at a time. Similar BFS on a transformed graph where nodes are words and edges connect words that differ by one letter.
2. **Minimum Genetic Mutation** - Almost identical to Word Ladder but with genetic sequences.
3. **Sliding Puzzle** - BFS on board states rather than tile positions.

## Key Takeaways

1. **Recognize when to transform the graph**: When the obvious nodes (stops) don't align with your cost metric (bus switches), consider what should be the real nodes in your graph (buses).

2. **BFS for unweighted shortest path**: When all "moves" have equal cost (one bus switch), BFS gives you the minimum number of moves.

3. **Track the right visited set**: In transformed graphs, track visitation at the level of your new nodes (buses), not the original elements (stops).

Related problems: [Minimum Costs Using the Train Line](/problem/minimum-costs-using-the-train-line)
