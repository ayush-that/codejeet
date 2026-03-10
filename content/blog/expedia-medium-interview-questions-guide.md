---
title: "Medium Expedia Interview Questions: Strategy Guide"
description: "How to tackle 35 medium difficulty questions from Expedia — patterns, time targets, and practice tips."
date: "2032-09-02"
category: "tips"
tags: ["expedia", "medium", "interview prep"]
---

Medium questions at Expedia are the main event. They're the core technical filter, designed to assess not just if you can code, but _how_ you code under pressure. Unlike the straightforward "can you implement this?" nature of Easy problems, Expedia's Medium questions (which make up 35 of their 54 tagged problems) are almost exclusively about applying a known algorithmic pattern to a slightly disguised real-world scenario. Think "Flight Itinerary Reconstruction" instead of just "Topological Sort," or "Hotel Room Scheduling" instead of just "Merge Intervals." The difficulty jump isn't in discovering a novel algorithm; it's in recognizing the correct, efficient pattern within a business-domain wrapper and implementing it flawlessly with clean, production-ready code.

## Common Patterns and Templates

Expedia's Medium problems heavily favor a few high-utility patterns that map directly to backend and data processing tasks: **Graph Traversal (BFS/DFS), Dynamic Programming (usually 1D), and Interval Manipulation**. The most common template you'll use is the **BFS for shortest path in an unweighted graph**. This pattern appears in problems about network hops, connection degrees between users, or finding the minimum steps in a booking flow.

Here is the canonical BFS template you must have memorized:

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(start, target, adj_list):
    """
    Template for BFS finding shortest path length in unweighted graph.
    adj_list: Dict or List where adj_list[node] returns list of neighbors.
    Returns -1 if no path exists.
    """
    if start == target:
        return 0

    queue = deque([start])
    # visited serves dual purpose: track seen nodes and distance from start
    visited = {start: 0}

    while queue:
        current_node = queue.popleft()
        current_distance = visited[current_node]

        for neighbor in adj_list[current_node]:
            if neighbor == target:
                # Found it! Return distance to neighbor.
                return current_distance + 1
            if neighbor not in visited:
                visited[neighbor] = current_distance + 1
                queue.append(neighbor)

    return -1  # No path found

# Time: O(V + E) | Space: O(V)
```

```javascript
function bfsShortestPath(start, target, adjList) {
  // Template for BFS finding shortest path length in unweighted graph.
  // adjList: Array or Object where adjList[node] returns array of neighbors.
  // Returns -1 if no path exists.
  if (start === target) return 0;

  const queue = [start];
  const visited = new Map();
  visited.set(start, 0);

  while (queue.length > 0) {
    const currentNode = queue.shift(); // For true O(n), use an index pointer.
    const currentDistance = visited.get(currentNode);

    for (const neighbor of adjList[currentNode]) {
      if (neighbor === target) {
        return currentDistance + 1;
      }
      if (!visited.has(neighbor)) {
        visited.set(neighbor, currentDistance + 1);
        queue.push(neighbor);
      }
    }
  }
  return -1;
}

// Time: O(V + E) | Space: O(V)
```

```java
import java.util.*;

public int bfsShortestPath(int start, int target, List<List<Integer>> adjList) {
    // Template for BFS finding shortest path length in unweighted graph.
    // adjList: adjacency list where adjList.get(node) returns list of neighbors.
    // Returns -1 if no path exists.
    if (start == target) return 0;

    Queue<Integer> queue = new LinkedList<>();
    Map<Integer, Integer> visited = new HashMap<>(); // node -> distance
    queue.offer(start);
    visited.put(start, 0);

    while (!queue.isEmpty()) {
        int currentNode = queue.poll();
        int currentDistance = visited.get(currentNode);

        for (int neighbor : adjList.get(currentNode)) {
            if (neighbor == target) {
                return currentDistance + 1;
            }
            if (!visited.containsKey(neighbor)) {
                visited.put(neighbor, currentDistance + 1);
                queue.offer(neighbor);
            }
        }
    }
    return -1;
}

// Time: O(V + E) | Space: O(V)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot, you have **25-30 minutes** to solve one Medium problem. This includes: 5 minutes for clarification and examples, 15 minutes for coding and explaining, and 5-10 minutes for testing, discussing edge cases, and optimization.

Getting the correct output is merely the price of entry. Interviewers are evaluating:

1.  **Pattern Recognition Speed:** How quickly do you map the problem statement to a known category? Hesitation here is costly.
2.  **Code as Communication:** Your variable names should be semantic (`flightGraph`, `minRooms`). Use helper functions for clarity. This shows you write code for humans, not just compilers.
3.  **Edge Case Proactivity:** Don't wait for the interviewer to ask. Verbally flag and handle them early: empty input, single element, duplicates, cycles in graphs, integer overflow.
4.  **Trade-off Justification:** Be prepared to explain _why_ you chose BFS over DFS, or a HashMap over an Array. This demonstrates systems thinking.

## Key Differences from Easy Problems

The leap from Easy to Medium at Expedia is defined by three specific shifts:

1.  **From Single-Pass to Stateful Traversal:** Easy problems often involve one loop with a counter or hash map. Medium problems require maintaining complex state across a traversal—like a `(node, visited_mask)` tuple in BFS for shortest path visiting multiple points, or a DP array where `dp[i]` depends on `dp[i-1]` and `dp[i-2]`.
2.  **From Direct to Indirect Modeling:** You won't be asked to "sort a list of intervals." You'll be asked to "find the minimum number of conference rooms required given meeting schedules," which _is_ the Merge Intervals pattern. The core skill is stripping away the domain narrative to reveal the underlying data structure.
3.  **From O(n²) to O(n log n) or O(n):** Brute force is almost never the intended solution. If your first thought is a nested loop, pause. The problem is asking for a more optimal approach, typically involving sorting, a hash map, or a heap.

## Specific Patterns for Medium

Beyond BFS, two other patterns are essential:

**1. Merge Intervals for Scheduling:** Problems about booking conflicts, resource allocation, or time-based overlaps. The template involves sorting by start time and iteratively merging or checking for overlaps.

**2. 1D Dynamic Programming for Optimization:** Used in problems like "maximum points from selecting activities with constraints" or "minimum cost to reach a destination." The state transition is usually linear.

<div class="code-group">

```python
# Pattern: Merge Intervals (e.g., Expedia's "Meeting Rooms II" variant)
def min_meeting_rooms(intervals):
    if not intervals:
        return 0

    start_times = sorted([i[0] for i in intervals])
    end_times = sorted([i[1] for i in intervals])

    start_ptr, end_ptr = 0, 0
    used_rooms = 0

    while start_ptr < len(intervals):
        # If a meeting has ended by the time the current one starts, free a room.
        if start_times[start_ptr] >= end_times[end_ptr]:
            used_rooms -= 1
            end_ptr += 1
        # Always need a room for the new meeting starting.
        used_rooms += 1
        start_ptr += 1

    return used_rooms
# Time: O(n log n) from sorting | Space: O(n)
```

```javascript
// Pattern: 1D DP - Fibonacci-style (e.g., "Min Cost Climbing Stairs")
function minCostClimbingStairs(cost) {
  const n = cost.length;
  // dp[i] = min cost to reach step i
  const dp = new Array(n + 1).fill(0);

  // Base cases: can start at step 0 or 1 with 0 cost from the "ground"
  dp[0] = 0;
  dp[1] = 0;

  for (let i = 2; i <= n; i++) {
    dp[i] = Math.min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2]);
  }

  return dp[n];
}
// Time: O(n) | Space: O(n) [can be optimized to O(1)]
```

```java
// Pattern: Merge Intervals (e.g., Expedia's "Meeting Rooms II" variant)
public int minMeetingRooms(int[][] intervals) {
    if (intervals.length == 0) return 0;

    int[] starts = new int[intervals.length];
    int[] ends = new int[intervals.length];
    for (int i = 0; i < intervals.length; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }
    Arrays.sort(starts);
    Arrays.sort(ends);

    int startPtr = 0, endPtr = 0;
    int usedRooms = 0;

    while (startPtr < intervals.length) {
        if (starts[startPtr] >= ends[endPtr]) {
            usedRooms--;
            endPtr++;
        }
        usedRooms++;
        startPtr++;
    }
    return usedRooms;
}
// Time: O(n log n) | Space: O(n)
```

</div>

## Practice Strategy

Don't just solve problems; solve them under interview conditions. Here's a 2-week plan:

- **Week 1 - Pattern Acquisition:** Group problems by pattern. Do 2-3 BFS problems in a row, then 2-3 Interval problems. Focus on internalizing the template, not memorizing problem specifics. Use the Expedia tag and filter by "Medium" and the pattern name.
- **Week 2 - Mixed Simulation:** Set a 30-minute timer. Pick a random Medium Expedia problem. Verbalize your thought process out loud. Write code as if someone will read it. Afterwards, analyze: Did you recognize the pattern within 3 minutes? Did you handle all edge cases? Was your code clean?
- **Daily Target:** 2-3 high-quality problem attempts with full analysis. Reviewing a problem's solution in depth is more valuable than brute-forcing 5 new ones.

Your goal is to make the pattern application automatic, so your mental bandwidth is free for problem-specific nuances and clear communication.

[Practice Medium Expedia questions](/company/expedia/medium)
