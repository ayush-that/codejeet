---
title: "How to Solve The Skyline Problem — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode The Skyline Problem. Hard difficulty, 45.0% acceptance rate. Topics: Array, Divide and Conquer, Binary Indexed Tree, Segment Tree, Sweep Line."
date: "2027-10-09"
category: "dsa-patterns"
tags: ["the-skyline-problem", "array", "divide-and-conquer", "binary-indexed-tree", "hard"]
---

# How to Solve The Skyline Problem

The Skyline Problem asks us to compute the outline formed by overlapping rectangular buildings when viewed from a distance. Given a list of buildings represented as `[left, right, height]`, we need to return the skyline as a list of key points where the height changes. This problem is notoriously tricky because it requires careful handling of overlapping intervals and efficient tracking of the maximum height at any x-coordinate.

## Visual Walkthrough

Let's trace through a simple example: `buildings = [[1,3,3], [2,4,2], [5,7,3]]`

We need to find the skyline points where the height changes:

1. **Building 1**: `[1,3,3]` - From x=1 to x=3, height is 3
2. **Building 2**: `[2,4,2]` - From x=2 to x=4, height is 2, but overlaps with building 1
3. **Building 3**: `[5,7,3]` - From x=5 to x=7, height is 3, separate from others

Let's process this step-by-step:

- At x=1: Building 1 starts, height becomes 3 → point `[1,3]`
- At x=2: Building 2 starts, but height 2 < current max 3, so no change
- At x=3: Building 1 ends, max height drops from 3 to 2 → point `[3,2]`
- At x=4: Building 2 ends, max height drops from 2 to 0 → point `[4,0]`
- At x=5: Building 3 starts, height becomes 3 → point `[5,3]`
- At x=7: Building 3 ends, height drops to 0 → point `[7,0]`

Final skyline: `[[1,3], [3,2], [4,0], [5,3], [7,0]]`

## Brute Force Approach

A naive approach would be to:

1. Find the maximum x-coordinate among all buildings
2. For each integer x from 0 to max_x, compute the maximum height at that x
3. Track changes in height to generate key points

This approach has several problems:

- It assumes integer x-coordinates (buildings can have non-integer coordinates)
- It's extremely inefficient: O(n × w) where n is number of buildings and w is width of skyline
- Real buildings can have coordinates up to 2^31 - 1, making this approach infeasible

The brute force fails because it doesn't leverage the fact that height only changes at building edges, not at every x-coordinate.

## Optimized Approach

The key insight is that height changes only occur at building start or end points. We can use a **sweep line algorithm**:

1. **Convert buildings to events**: For each building `[l, r, h]`, create two events:
   - Start event: `(l, -h)` (negative height to ensure starts come before ends at same x)
   - End event: `(r, h)`
2. **Sort events**: Sort by x-coordinate, and for same x, by height (start events first)

3. **Track active heights**: Use a max-heap to track current building heights
   - When we encounter a start event, add its height to the heap
   - When we encounter an end event, mark that height for removal
4. **Lazy removal from heap**: Since standard heaps don't support efficient removal, we track the current max height and remove outdated heights when they reach the top

5. **Generate skyline**: Whenever the current max height changes after processing events at an x-coordinate, add a point `[x, current_max_height]`

This approach runs in O(n log n) time where n is the number of buildings.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
# where n is the number of buildings
def getSkyline(buildings):
    """
    Compute the skyline formed by overlapping buildings.

    Approach: Sweep line algorithm with max-heap for active heights.
    Convert each building to start and end events, process in sorted order.
    """
    # Step 1: Create events from buildings
    # For each building [l, r, h]:
    # - Start event: (l, -h) - negative height ensures starts come before ends at same x
    # - End event: (r, h)
    events = []
    for l, r, h in buildings:
        events.append((l, -h))  # Start event
        events.append((r, h))   # End event

    # Step 2: Sort events
    # Sort by x-coordinate, then by height (start events first due to negative heights)
    events.sort()

    # Step 3: Initialize data structures
    import heapq
    # Max-heap (using negative values since Python has min-heap)
    # Stores (-height, end_x) for active buildings
    active = [(0, float('inf'))]  # Sentinel: ground level that never ends
    removed = set()  # Track heights that need removal
    result = []
    prev_max_height = 0  # Track previous max height

    # Step 4: Process events in sorted order
    for x, h in events:
        if h < 0:  # Start event (negative height)
            # Add building to active heap
            heapq.heappush(active, (h, -h))  # Store (-height, height) for max-heap
        else:  # End event (positive height)
            # Mark this height for removal
            removed.add(h)

        # Step 5: Clean up inactive buildings from heap
        # Remove outdated heights that are at the top of the heap
        while active and active[0][1] in removed:
            removed.remove(active[0][1])
            heapq.heappop(active)

        # Step 6: Get current max height from heap
        # The heap stores negative heights, so top is -active[0][0]
        current_max_height = -active[0][0]

        # Step 7: Add point if height changed
        if current_max_height != prev_max_height:
            result.append([x, current_max_height])
            prev_max_height = current_max_height

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
// where n is the number of buildings
function getSkyline(buildings) {
  /**
   * Compute the skyline formed by overlapping buildings.
   *
   * Approach: Sweep line algorithm with max-heap for active heights.
   * Convert each building to start and end events, process in sorted order.
   */

  // Step 1: Create events from buildings
  // For each building [l, r, h]:
  // - Start event: [l, -h] - negative height ensures starts come before ends at same x
  // - End event: [r, h]
  const events = [];
  for (const [l, r, h] of buildings) {
    events.push([l, -h]); // Start event
    events.push([r, h]); // End event
  }

  // Step 2: Sort events
  // Sort by x-coordinate, then by height (start events first due to negative heights)
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  // Step 3: Initialize data structures
  // Max-heap implementation using array
  const active = [{ height: 0, end: Infinity }]; // Sentinel: ground level
  const removed = new Set(); // Track heights that need removal
  const result = [];
  let prevMaxHeight = 0; // Track previous max height

  // Helper function to maintain max-heap property
  function heapPush(heap, item) {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent].height >= heap[i].height) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  }

  function heapPop(heap) {
    if (heap.length === 1) return heap.pop();
    const root = heap[0];
    heap[0] = heap.pop();
    let i = 0;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;

      if (left < heap.length && heap[left].height > heap[largest].height) {
        largest = left;
      }
      if (right < heap.length && heap[right].height > heap[largest].height) {
        largest = right;
      }
      if (largest === i) break;
      [heap[i], heap[largest]] = [heap[largest], heap[i]];
      i = largest;
    }
    return root;
  }

  // Step 4: Process events in sorted order
  for (const [x, h] of events) {
    if (h < 0) {
      // Start event (negative height)
      // Add building to active heap
      heapPush(active, { height: -h, end: x + Math.abs(h) });
    } else {
      // End event (positive height)
      // Mark this height for removal
      removed.add(h);
    }

    // Step 5: Clean up inactive buildings from heap
    // Remove outdated heights that are at the top of the heap
    while (active.length > 0 && removed.has(active[0].height)) {
      removed.delete(active[0].height);
      heapPop(active);
    }

    // Step 6: Get current max height from heap
    const currentMaxHeight = active.length > 0 ? active[0].height : 0;

    // Step 7: Add point if height changed
    if (currentMaxHeight !== prevMaxHeight) {
      result.push([x, currentMaxHeight]);
      prevMaxHeight = currentMaxHeight;
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
// where n is the number of buildings
import java.util.*;

class Solution {
    public List<List<Integer>> getSkyline(int[][] buildings) {
        /**
         * Compute the skyline formed by overlapping buildings.
         *
         * Approach: Sweep line algorithm with max-heap for active heights.
         * Convert each building to start and end events, process in sorted order.
         */

        // Step 1: Create events from buildings
        // For each building [l, r, h]:
        // - Start event: (l, -h) - negative height ensures starts come before ends at same x
        // - End event: (r, h)
        List<int[]> events = new ArrayList<>();
        for (int[] building : buildings) {
            int l = building[0], r = building[1], h = building[2];
            events.add(new int[]{l, -h});  // Start event
            events.add(new int[]{r, h});   // End event
        }

        // Step 2: Sort events
        // Sort by x-coordinate, then by height (start events first due to negative heights)
        events.sort((a, b) -> {
            if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
            return Integer.compare(a[1], b[1]);
        });

        // Step 3: Initialize data structures
        // Max-heap for active heights (using negative values for max-heap with PriorityQueue)
        PriorityQueue<Integer> active = new PriorityQueue<>(Collections.reverseOrder());
        active.offer(0);  // Sentinel: ground level
        Map<Integer, Integer> removed = new HashMap<>();  // Track heights that need removal
        List<List<Integer>> result = new ArrayList<>();
        int prevMaxHeight = 0;  // Track previous max height

        // Step 4: Process events in sorted order
        for (int[] event : events) {
            int x = event[0], h = event[1];

            if (h < 0) {  // Start event (negative height)
                // Add building height to active heap
                active.offer(-h);
            } else {  // End event (positive height)
                // Mark this height for removal
                removed.put(h, removed.getOrDefault(h, 0) + 1);
            }

            // Step 5: Clean up inactive buildings from heap
            // Remove outdated heights that are at the top of the heap
            while (!active.isEmpty() && removed.containsKey(active.peek())) {
                int top = active.poll();
                int count = removed.get(top);
                if (count == 1) {
                    removed.remove(top);
                } else {
                    removed.put(top, count - 1);
                }
            }

            // Step 6: Get current max height from heap
            int currentMaxHeight = active.peek();

            // Step 7: Add point if height changed
            if (currentMaxHeight != prevMaxHeight) {
                result.add(Arrays.asList(x, currentMaxHeight));
                prevMaxHeight = currentMaxHeight;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Creating events: O(n)
- Sorting events: O(n log n)
- Processing each event: O(log n) for heap operations
- Total: O(n log n) dominated by sorting

**Space Complexity: O(n)**

- Events array: O(2n) = O(n)
- Active heap: O(n) in worst case (all buildings overlapping)
- Removed set/map: O(n) in worst case
- Result: O(n) in worst case

## Common Mistakes

1. **Not handling same x-coordinate correctly**: When multiple events occur at the same x, start events must be processed before end events. Using negative heights for start events ensures proper sorting.

2. **Inefficient heap removal**: Directly removing from a heap is O(n). The lazy removal technique (marking for removal and cleaning when the element reaches the top) keeps operations O(log n).

3. **Forgetting the ground level sentinel**: Without an initial 0 height in the heap, you'll get null pointer errors when the heap becomes empty. The sentinel ensures there's always a current height.

4. **Adding duplicate points**: When multiple events at the same x don't change the max height, you shouldn't add a point. Always compare with the previous max height.

## When You'll See This Pattern

The sweep line algorithm with interval tracking appears in many interval-related problems:

1. **Falling Squares (Hard)**: Similar to skyline but in 2D - track maximum height as squares "fall" onto existing piles. Uses the same concept of tracking active intervals.

2. **Meeting Rooms II (Medium)**: Find minimum number of rooms needed given meeting intervals. Uses similar event processing but tracks count instead of max value.

3. **Merge Intervals (Medium)**: While simpler, it uses similar interval processing logic.

4. **Shifting Letters II (Medium)**: Apply range updates efficiently - similar to tracking changes at interval boundaries.

## Key Takeaways

1. **Sweep line technique**: When dealing with intervals or ranges, consider converting to events at boundaries and processing in sorted order. This often reduces O(n²) problems to O(n log n).

2. **Lazy data structure updates**: When you need to frequently query the maximum/minimum of a changing set, use a heap with lazy deletion rather than trying to maintain a perfectly updated structure.

3. **Sentinel values**: Adding dummy values (like ground level height 0) can simplify edge case handling and prevent null checks.

Related problems: [Falling Squares](/problem/falling-squares), [Shifting Letters II](/problem/shifting-letters-ii)
