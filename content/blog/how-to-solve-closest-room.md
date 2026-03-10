---
title: "How to Solve Closest Room — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Closest Room. Hard difficulty, 41.1% acceptance rate. Topics: Array, Binary Search, Sorting, Ordered Set."
date: "2026-04-08"
category: "dsa-patterns"
tags: ["closest-room", "array", "binary-search", "sorting", "hard"]
---

# How to Solve Closest Room

You're given a list of hotel rooms (each with a unique ID and size) and a series of queries asking: "For a preferred room ID and minimum size, find the room with the smallest absolute ID difference that meets or exceeds the size requirement." The challenge is handling thousands of rooms and queries efficiently—a brute force check for each query would be far too slow. This problem combines sorting, binary search, and careful data structure selection to achieve optimal performance.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Rooms:** `[[2, 100], [4, 80], [5, 120], [7, 90]]`  
**Queries:** `[[3, 90], [6, 85]]`

For the first query `[3, 90]`:

- We need rooms with size ≥ 90: that's room 2 (size 100), room 5 (size 120), and room 7 (size 90)
- Among these, find the room ID closest to 3:
  - Room 2: |2-3| = 1
  - Room 5: |5-3| = 2
  - Room 7: |7-3| = 4
- Closest is room 2 with ID 2

For the second query `[6, 85]`:

- Rooms with size ≥ 85: room 2 (100), room 4 (80❌), room 5 (120), room 7 (90)
- Compare distances to 6:
  - Room 2: |2-6| = 4
  - Room 5: |5-6| = 1
  - Room 7: |7-6| = 1
- Both room 5 and 7 have distance 1. We need the smallest ID, so choose room 5

The brute force approach would check every room for every query (O(n×k)), which becomes impossible with 10⁵ rooms and queries. We need a smarter way to quickly find rooms meeting the size requirement and then find the closest ID among them.

## Brute Force Approach

The most straightforward solution is to iterate through all rooms for each query:

1. For each query `[preferred, minSize]`
2. Initialize `bestId = -1` and `minDiff = Infinity`
3. For each room `[id, size]`:
   - If `size >= minSize`:
     - Calculate `diff = abs(id - preferred)`
     - If `diff < minDiff` or (`diff == minDiff` and `id < bestId`):
       - Update `bestId = id` and `minDiff = diff`
4. Add `bestId` to results

This approach is simple but has O(n×k) time complexity. With n and k up to 10⁵, that's 10¹⁰ operations—far too slow. We need to avoid scanning all rooms for every query.

## Optimized Approach

The key insight is that we can **preprocess rooms by size** and use **binary search** to efficiently find candidate rooms for each query. Here's the step-by-step reasoning:

1. **Sort rooms by size descending**: This way, when we process queries in descending order of their minimum size requirement, we can incrementally add rooms to a data structure as we go.

2. **Sort queries by minSize descending**: By processing larger minimum sizes first, we can maintain a collection of all rooms that meet the current (and all future) size requirements.

3. **Use an ordered set to store room IDs**: We need a data structure that supports:
   - Insertion of room IDs
   - Finding the closest ID to a given value
   - Python's `bisect` module with lists works, but we need efficient insertions
   - Java's `TreeSet` or JavaScript's manual implementation with sorted arrays and binary search

4. **Process queries in size order**: For each query, add all rooms with size ≥ current query's minSize to our ordered set, then find the closest ID in the set to the preferred ID.

The critical optimization is that we only add each room once to our data structure, and we can find the closest ID in O(log n) time using binary search.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O((n + k) log (n + k)) | Space: O(n + k)
def closestRoom(rooms, queries):
    """
    Find the closest room ID for each query.

    Strategy:
    1. Sort rooms by size descending
    2. Sort queries by minSize descending, preserving original indices
    3. Process queries in order, adding eligible rooms to sorted list
    4. For each query, binary search for closest ID in eligible rooms
    """
    # Sort rooms by size in descending order
    # We'll process larger rooms first since queries with larger minSize come first
    rooms.sort(key=lambda x: -x[1])

    # Sort queries by minSize descending, but keep original indices
    # to place answers in correct order
    sorted_queries = sorted(
        [(i, preferred, minSize) for i, (preferred, minSize) in enumerate(queries)],
        key=lambda x: -x[2]  # Sort by minSize descending
    )

    # We'll maintain a sorted list of room IDs that meet current size requirement
    # Since we process queries in descending minSize order, once a room is added,
    # it remains eligible for all subsequent queries
    room_ids = []  # Sorted list of eligible room IDs
    result = [-1] * len(queries)

    room_idx = 0  # Pointer to track which rooms we've added

    # Process each query in order of descending minSize
    for query_idx, preferred, minSize in sorted_queries:
        # Add all rooms with size >= current query's minSize
        while room_idx < len(rooms) and rooms[room_idx][1] >= minSize:
            # Insert room ID into sorted position
            id_to_insert = rooms[room_idx][0]
            insert_pos = bisect.bisect_left(room_ids, id_to_insert)
            room_ids.insert(insert_pos, id_to_insert)
            room_idx += 1

        # If no rooms meet the size requirement, answer remains -1
        if not room_ids:
            result[query_idx] = -1
            continue

        # Find the closest room ID to preferred
        # Binary search to find insertion position
        pos = bisect.bisect_left(room_ids, preferred)

        # Check candidate on the right (if exists)
        best_id = -1
        min_diff = float('inf')

        # Check room at pos (first room with ID >= preferred)
        if pos < len(room_ids):
            diff = abs(room_ids[pos] - preferred)
            if diff < min_diff or (diff == min_diff and room_ids[pos] < best_id):
                min_diff = diff
                best_id = room_ids[pos]

        # Check room just before pos (last room with ID < preferred)
        if pos > 0:
            diff = abs(room_ids[pos - 1] - preferred)
            if diff < min_diff or (diff == min_diff and room_ids[pos - 1] < best_id):
                min_diff = diff
                best_id = room_ids[pos - 1]

        result[query_idx] = best_id

    return result

# Note: Don't forget to import bisect at the top of your file
```

```javascript
// Time: O((n + k) log (n + k)) | Space: O(n + k)
function closestRoom(rooms, queries) {
  /**
   * Find the closest room ID for each query.
   *
   * Strategy:
   * 1. Sort rooms by size descending
   * 2. Sort queries by minSize descending, preserving original indices
   * 3. Process queries in order, adding eligible rooms to sorted array
   * 4. For each query, binary search for closest ID in eligible rooms
   */

  // Sort rooms by size in descending order
  rooms.sort((a, b) => b[1] - a[1]);

  // Sort queries by minSize descending, preserving original indices
  const sortedQueries = queries.map((query, idx) => [idx, ...query]).sort((a, b) => b[2] - a[2]); // Sort by minSize descending

  // Sorted array of eligible room IDs
  const roomIds = [];
  const result = new Array(queries.length).fill(-1);

  let roomIdx = 0; // Pointer to track which rooms we've added

  // Helper function to insert ID into sorted array
  function insertSorted(id) {
    let left = 0;
    let right = roomIds.length;

    // Binary search for insertion position
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (roomIds[mid] < id) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // Insert at the found position
    roomIds.splice(left, 0, id);
  }

  // Helper function to find closest ID
  function findClosestId(preferred) {
    if (roomIds.length === 0) return -1;

    // Binary search for insertion position
    let left = 0;
    let right = roomIds.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (roomIds[mid] < preferred) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    let bestId = -1;
    let minDiff = Infinity;

    // Check room at insertion position (first ID >= preferred)
    if (left < roomIds.length) {
      const diff = Math.abs(roomIds[left] - preferred);
      if (diff < minDiff || (diff === minDiff && roomIds[left] < bestId)) {
        minDiff = diff;
        bestId = roomIds[left];
      }
    }

    // Check room just before insertion position (last ID < preferred)
    if (left > 0) {
      const diff = Math.abs(roomIds[left - 1] - preferred);
      if (diff < minDiff || (diff === minDiff && roomIds[left - 1] < bestId)) {
        minDiff = diff;
        bestId = roomIds[left - 1];
      }
    }

    return bestId;
  }

  // Process each query in order of descending minSize
  for (const [queryIdx, preferred, minSize] of sortedQueries) {
    // Add all rooms with size >= current query's minSize
    while (roomIdx < rooms.length && rooms[roomIdx][1] >= minSize) {
      insertSorted(rooms[roomIdx][0]);
      roomIdx++;
    }

    // Find closest room ID among eligible rooms
    result[queryIdx] = findClosestId(preferred);
  }

  return result;
}
```

```java
// Time: O((n + k) log (n + k)) | Space: O(n + k)
import java.util.*;

class Solution {
    public int[] closestRoom(int[][] rooms, int[][] queries) {
        /**
         * Find the closest room ID for each query.
         *
         * Strategy:
         * 1. Sort rooms by size descending
         * 2. Sort queries by minSize descending, preserving original indices
         * 3. Process queries in order, adding eligible rooms to TreeSet
         * 4. For each query, find closest ID in TreeSet using ceiling/floor
         */

        // Sort rooms by size in descending order
        Arrays.sort(rooms, (a, b) -> b[1] - a[1]);

        // Create array of queries with original indices
        int[][] sortedQueries = new int[queries.length][3];
        for (int i = 0; i < queries.length; i++) {
            sortedQueries[i][0] = i;           // original index
            sortedQueries[i][1] = queries[i][0]; // preferred
            sortedQueries[i][2] = queries[i][1]; // minSize
        }

        // Sort queries by minSize descending
        Arrays.sort(sortedQueries, (a, b) -> b[2] - a[2]);

        // TreeSet to store eligible room IDs (automatically sorted)
        TreeSet<Integer> roomIds = new TreeSet<>();
        int[] result = new int[queries.length];
        Arrays.fill(result, -1);

        int roomIdx = 0;  // Pointer to track which rooms we've added

        // Process each query in order of descending minSize
        for (int[] query : sortedQueries) {
            int queryIdx = query[0];
            int preferred = query[1];
            int minSize = query[2];

            // Add all rooms with size >= current query's minSize
            while (roomIdx < rooms.length && rooms[roomIdx][1] >= minSize) {
                roomIds.add(rooms[roomIdx][0]);
                roomIdx++;
            }

            // If no rooms meet the size requirement, answer remains -1
            if (roomIds.isEmpty()) {
                result[queryIdx] = -1;
                continue;
            }

            // Find closest room ID using TreeSet's ceiling and floor methods
            Integer ceiling = roomIds.ceiling(preferred);  // smallest ID >= preferred
            Integer floor = roomIds.floor(preferred);      // largest ID <= preferred

            int bestId = -1;
            int minDiff = Integer.MAX_VALUE;

            // Check ceiling candidate
            if (ceiling != null) {
                int diff = Math.abs(ceiling - preferred);
                if (diff < minDiff || (diff == minDiff && ceiling < bestId)) {
                    minDiff = diff;
                    bestId = ceiling;
                }
            }

            // Check floor candidate
            if (floor != null) {
                int diff = Math.abs(floor - preferred);
                if (diff < minDiff || (diff == minDiff && floor < bestId)) {
                    minDiff = diff;
                    bestId = floor;
                }
            }

            result[queryIdx] = bestId;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O((n + k) log (n + k))

- Sorting rooms: O(n log n)
- Sorting queries: O(k log k)
- Processing queries: We add each room to our data structure once (O(log n) per insertion) and perform binary search for each query (O(log n) per query)
- Total: O(n log n + k log k + (n + k) log n) = O((n + k) log (n + k))

**Space Complexity:** O(n + k)

- Storing sorted rooms: O(n)
- Storing queries with indices: O(k)
- Data structure for room IDs: O(n) in worst case
- Result array: O(k)

## Common Mistakes

1. **Forgetting to preserve query order**: When sorting queries by minSize, you must store the original index to place answers in the correct order. Without this, you'll return answers in the wrong sequence.

2. **Using inefficient data structures for ID lookup**: Some candidates try to use a hash set or unsorted list, then scan all eligible rooms for each query. This degenerates to O(n×k) in worst case. You need O(log n) lookup via binary search or TreeSet.

3. **Incorrect handling of tie-breaking**: When two rooms have equal distance to preferred, you must choose the smaller ID. Forgetting this tie-breaker will fail test cases.

4. **Off-by-one errors in binary search**: When finding the closest ID, you need to check both the position where the preferred ID would be inserted AND the position immediately before it. Missing either can skip the actual closest room.

## When You'll See This Pattern

This problem combines **offline query processing** (sorting queries by a parameter) with **maintaining a data structure incrementally**. You'll see similar patterns in:

1. **Most Beautiful Item for Each Query (Medium)**: Sort items by price, sort queries by max price, and maintain the maximum beauty seen so far as you process queries in order.

2. **Range Sum Query - Mutable (Medium)**: While different in implementation, it shares the concept of preprocessing data to answer queries efficiently.

3. **Minimum Time to Kill All Monsters (Hard)**: Also uses sorting and incremental processing, though with different optimization criteria.

The core pattern is: when queries depend on a threshold (like minimum size), sort by that threshold and process in order, maintaining a data structure that efficiently answers the other part of the query.

## Key Takeaways

1. **Offline query processing is powerful**: When queries are independent and can be reordered, sorting them by a parameter often enables incremental updates that dramatically improve efficiency.

2. **Combine sorting with the right data structure**: Sorting rooms and queries by size allows us to use a single pass. Pair this with an ordered set for O(log n) insertions and closest-value lookups.

3. **Think about what can be preprocessed**: The expensive part is finding rooms meeting the size requirement. By sorting and processing in order, we ensure each room is added to our data structure exactly once.

Related problems: [Most Beautiful Item for Each Query](/problem/most-beautiful-item-for-each-query), [Minimum Time to Kill All Monsters](/problem/minimum-time-to-kill-all-monsters)
