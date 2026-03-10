---
title: "Hard PhonePe Interview Questions: Strategy Guide"
description: "How to tackle 36 hard difficulty questions from PhonePe — patterns, time targets, and practice tips."
date: "2032-05-13"
category: "tips"
tags: ["phonepe", "hard", "interview prep"]
---

PhonePe's interview questions have a distinct flavor. While many companies use LeetCode's difficulty ratings as-is, PhonePe's "Hard" designation often means one thing: you're dealing with a problem that combines multiple fundamental concepts into a single, intricate puzzle. It's rarely about knowing an obscure algorithm. Instead, it's about cleanly orchestrating several Medium-level patterns—like dynamic programming, graph traversal, and advanced data structure manipulation—under significant time pressure and with minimal guidance. The separator isn't raw intelligence; it's disciplined pattern recognition and the ability to decompose a complex, real-world-sounding prompt into a sequence of solvable steps.

## Common Patterns and Templates

PhonePe's Hard problems frequently involve **Graphs + Dynamic Programming** or **Intervals + Sorting + Greedy/DP**. You'll see problems like "find the minimum cost to reach a destination with constraints" (graph DP) or "schedule the maximum number of non-overlapping tasks with weights" (interval scheduling with a twist). The most common template you need internalized is for **Dijkstra's Algorithm with State Tracking**, used when the shortest path depends on more than just node identity (e.g., remaining fuel, steps taken, tickets used).

Here's the essential multi-state Dijkstra template:

<div class="code-group">

```python
import heapq
from math import inf

def dijkstra_with_state(start, target, max_k):
    # dist[node][state] = min cost to reach node with given state
    dist = [[inf] * (max_k + 1) for _ in range(n)]
    dist[start][0] = 0
    # min-heap: (cost, node, state)
    heap = [(0, start, 0)]

    while heap:
        cost, node, state = heapq.heappop(heap)
        # Prune if we've found a better path for this (node, state)
        if cost > dist[node][state]:
            continue
        if node == target:
            # May return based on state condition, e.g., min cost for any state <= k
            return cost

        for neighbor, weight in graph[node]:
            new_state = state + 1  # State transition varies (e.g., steps, stops used)
            new_cost = cost + weight
            # Check state bound and if this path is better
            if new_state <= max_k and new_cost < dist[neighbor][new_state]:
                dist[neighbor][new_state] = new_cost
                heapq.heappush(heap, (new_cost, neighbor, new_state))
    return -1  # Unreachable under constraints

# Time: O((V + E) * K * log(V*K)) for K states | Space: O(V * K)
```

```javascript
function dijkstraWithState(start, target, maxK, graph, n) {
  const dist = Array.from({ length: n }, () => Array(maxK + 1).fill(Infinity));
  dist[start][0] = 0;
  // min-heap: [cost, node, state]
  const heap = new MinPriorityQueue({ priority: (x) => x[0] });
  heap.enqueue([0, start, 0]);

  while (!heap.isEmpty()) {
    const [cost, node, state] = heap.dequeue().element;
    if (cost > dist[node][state]) continue;
    if (node === target) {
      // Return logic depends on problem
      return cost;
    }

    for (const [neighbor, weight] of graph[node]) {
      const newState = state + 1;
      const newCost = cost + weight;
      if (newState <= maxK && newCost < dist[neighbor][newState]) {
        dist[neighbor][newState] = newCost;
        heap.enqueue([newCost, neighbor, newState]);
      }
    }
  }
  return -1;
}

// Time: O((V + E) * K * log(V*K)) | Space: O(V * K)
```

```java
public int dijkstraWithState(int start, int target, int maxK, List<int[]>[] graph, int n) {
    // dist[node][state]
    int[][] dist = new int[n][maxK + 1];
    for (int i = 0; i < n; i++) Arrays.fill(dist[i], Integer.MAX_VALUE);
    dist[start][0] = 0;
    // min-heap: {cost, node, state}
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    heap.offer(new int[]{0, start, 0});

    while (!heap.isEmpty()) {
        int[] curr = heap.poll();
        int cost = curr[0], node = curr[1], state = curr[2];
        if (cost > dist[node][state]) continue;
        if (node == target) return cost; // or min over states

        for (int[] edge : graph[node]) {
            int neighbor = edge[0], weight = edge[1];
            int newState = state + 1;
            int newCost = cost + weight;
            if (newState <= maxK && newCost < dist[neighbor][newState]) {
                dist[neighbor][newState] = newCost;
                heap.offer(new int[]{newCost, neighbor, newState});
            }
        }
    }
    return -1;
}

// Time: O((V + E) * K * log(V*K)) | Space: O(V * K)
```

</div>

## Time Benchmarks and What Interviewers Look For

You have 30-45 minutes for a Hard problem. Aim for a working, optimized solution in 25-30 minutes, leaving time for discussion and edge cases. The interviewer isn't just checking correctness; they're evaluating your **problem decomposition skills**. Can you identify the core patterns (e.g., "This is essentially a shortest path problem with a constraint on the number of edges")? They listen for your thought process: "I think we can model this as a graph where each node represents a city and the state tracks fuel, then use Dijkstra with a 2D distance array."

Code quality matters immensely. Use meaningful variable names (`minCost` not `mc`), extract helper functions for clarity, and comment on the non-obvious parts (e.g., "We use a min-heap to always expand the cheapest path first"). Handling edge cases—like unreachable nodes, negative weights (if not allowed), or state bounds—shows production-level thinking. The final signal they want: can you take a vague, complex requirement and translate it into efficient, maintainable code?

## Upgrading from Medium to Hard

The jump from Medium to Hard is about **composition and optimization**. A Medium problem might ask you to implement Dijkstra. A Hard problem asks you to run Dijkstra on a graph you construct from a matrix, with a state dimension for broken walls, to find the shortest path where you can break at most `k` obstacles (LeetCode 1293: Shortest Path in a Grid with Obstacles Elimination).

New techniques required:

1.  **State-augmented BFS/DFS/Dijkstra:** Adding dimensions (stops, remaining capacity, visited mask) to your traversal state.
2.  **DP on intervals or trees:** Moving from 1D DP to 2D DP where the state represents a range (`dp[i][j]`) or a node and a parent.
3.  **Union-Find with additional tracking:** Not just connecting components, but maintaining aggregate properties (sum, count, max) per component with path compression.

The mindset shift: stop looking for a single algorithm. Start asking, "What are the **two or three subproblems** here?" Break it down: first, how do I model the data? Second, what's the core algorithmic pattern? Third, what extra constraint needs to be woven into the state?

## Specific Patterns for Hard

**1. Dynamic Programming on Intervals**
Common in problems about optimizing operations on sequences (e.g., burst balloons, strange printer). The key is defining `dp[i][j]` as the answer for the subarray/substring from index `i` to `j`, and building it from smaller intervals.

**2. Bitmask DP for Subset Problems**
When you need to consider all subsets of a small set (n ≤ 20), use an integer mask where the `i`-th bit indicates whether element `i` is selected. `dp[mask]` stores the optimal result for that subset. Used in problems like maximum compatibility score or minimum cost to visit every node once.

**3. Segment Trees with Lazy Propagation**
For frequent range queries and updates on an array (e.g., range sum, range minimum), a segment tree provides O(log n) operations. PhonePe problems might hide this need behind a scenario like "repeatedly query the most frequent element in a subarray after updates."

## Practice Strategy

Don't grind randomly. Focus on composition.

1.  **First Week:** Master the foundational patterns individually. Do 2-3 problems each on: Dijkstra, standard 2D DP, interval DP, and union-find.
2.  **Second Week:** Practice composed problems. When you see a new Hard, force yourself to write down the two patterns you spot. For example, "PhonePe Hard #XYZ: This is a graph construction problem + Dijkstra with state."
3.  **Daily Target:** One Hard problem, but with deep analysis. Spend 30 minutes solving, then 30 minutes reviewing the solution. Write a paragraph in your own words explaining the composition. Re-solve it 48 hours later without hints.
4.  **Order:** Start with PhonePe's most frequent Hard tags: "Dynamic Programming," "Graph," and "Greedy." Problems like "Cherry Pickup" (DP on grid) and "Swim in Rising Water" (Dijkstra/binary search) are excellent preparation.

Remember, the goal isn't to memorize solutions. It's to build the reflex that when you see a complex constraint, you know how to fold it into your state space or DP definition.

[Practice Hard PhonePe questions](/company/phonepe/hard)
