---
title: "Hard DoorDash Interview Questions: Strategy Guide"
description: "How to tackle 30 hard difficulty questions from DoorDash — patterns, time targets, and practice tips."
date: "2032-05-31"
category: "tips"
tags: ["doordash", "hard", "interview prep"]
---

## Hard DoorDash Interview Questions: Strategy Guide

DoorDash’s Hard problems aren’t just “harder versions of Mediums.” They’re a distinct category that tests your ability to combine multiple algorithmic concepts, handle complex state management, and reason about real‑world constraints—often mirroring the actual challenges of building a logistics platform. While Mediums might ask you to implement a single pattern (like BFS or binary search), Hard problems at DoorDash typically require you to orchestrate two or three patterns together, often with a heavy emphasis on graph modeling, dynamic programming with non‑standard states, or interval manipulations with additional constraints.

What separates DoorDash Hard questions is their **domain relevance**. You’ll see problems about delivery routing, order batching, time‑window scheduling, and resource allocation—all thinly disguised as graph, DP, or greedy problems. The “hard” part isn’t just the algorithm; it’s recognizing which algorithm fits the messy, real‑world scenario they’ve described.

## Common Patterns and Templates

DoorDash heavily favors **graph problems** (especially shortest‑path variants and topological sorting) and **interval‑based dynamic programming**. But the signature pattern I’ve seen repeatedly is **Dijkstra’s algorithm with state augmentation**. You’re not just finding the shortest path from A to B; you’re finding the shortest path given constraints like “you can only traverse certain edges after time T” or “you must pick up an item before delivering it.” This requires augmenting your graph nodes with additional state (e.g., `(node, time, items_held)`).

Here’s a template for Dijkstra with state augmentation—a pattern that appears in problems like “Cheapest Flights Within K Stops” (LeetCode #787) and DoorDash’s own “Delivery Route Optimization” variations.

<div class="code-group">

```python
import heapq
from collections import defaultdict

def dijkstra_with_state(start, target, graph, max_state):
    """
    graph: adjacency list where graph[u] = [(v, weight, state_change), ...]
    max_state: maximum value for the additional state dimension
    Returns: minimum cost to reach target with any valid state
    """
    # dist[node][state] = min cost to reach node with given state
    dist = [[float('inf')] * (max_state + 1) for _ in range(n)]
    dist[start][0] = 0
    # priority queue: (cost, node, state)
    pq = [(0, start, 0)]

    while pq:
        cost, node, state = heapq.heappop(pq)
        if cost > dist[node][state]:
            continue
        if node == target:
            # May return early depending on problem
            return cost

        for neighbor, weight, state_change in graph[node]:
            new_state = state + state_change
            if 0 <= new_state <= max_state:
                new_cost = cost + weight
                if new_cost < dist[neighbor][new_state]:
                    dist[neighbor][new_state] = new_cost
                    heapq.heappush(pq, (new_cost, neighbor, new_state))

    # Return min over all states for target, or -1 if unreachable
    min_cost = min(dist[target])
    return min_cost if min_cost != float('inf') else -1

# Time: O(E * S * log(V * S)) where S is state space size
# Space: O(V * S) for dist array
```

```javascript
function dijkstraWithState(start, target, graph, maxState) {
  // graph: adjacency list where graph[u] = [{v, weight, stateChange}, ...]
  // dist[node][state] = min cost
  const n = graph.length;
  const dist = Array.from({ length: n }, () => Array(maxState + 1).fill(Infinity));
  dist[start][0] = 0;
  // min‑heap: [cost, node, state]
  const pq = new MinPriorityQueue({ priority: (x) => x[0] });
  pq.enqueue([0, start, 0]);

  while (!pq.isEmpty()) {
    const [cost, node, state] = pq.dequeue().element;
    if (cost > dist[node][state]) continue;
    if (node === target) {
      // Early return if problem allows
      return cost;
    }

    for (const { v, weight, stateChange } of graph[node]) {
      const newState = state + stateChange;
      if (newState < 0 || newState > maxState) continue;
      const newCost = cost + weight;
      if (newCost < dist[v][newState]) {
        dist[v][newState] = newCost;
        pq.enqueue([newCost, v, newState]);
      }
    }
  }

  const minCost = Math.min(...dist[target]);
  return minCost !== Infinity ? minCost : -1;
}

// Time: O(E * S * log(V * S))
// Space: O(V * S)
```

```java
public int dijkstraWithState(int start, int target, List<int[]>[] graph, int maxState) {
    // graph[u] = list of {v, weight, stateChange}
    int n = graph.length;
    int[][] dist = new int[n][maxState + 1];
    for (int i = 0; i < n; i++) Arrays.fill(dist[i], Integer.MAX_VALUE);
    dist[start][0] = 0;
    // priority queue: (cost, node, state)
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, start, 0});

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int cost = curr[0], node = curr[1], state = curr[2];
        if (cost > dist[node][state]) continue;
        if (node == target) {
            // Early return if allowed
            return cost;
        }

        for (int[] edge : graph[node]) {
            int neighbor = edge[0], weight = edge[1], stateChange = edge[2];
            int newState = state + stateChange;
            if (newState < 0 || newState > maxState) continue;
            int newCost = cost + weight;
            if (newCost < dist[neighbor][newState]) {
                dist[neighbor][newState] = newCost;
                pq.offer(new int[]{newCost, neighbor, newState});
            }
        }
    }

    int minCost = Integer.MAX_VALUE;
    for (int s = 0; s <= maxState; s++) minCost = Math.min(minCost, dist[target][s]);
    return minCost == Integer.MAX_VALUE ? -1 : minCost;
}

// Time: O(E * S * log(V * S))
// Space: O(V * S)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45‑minute interview slot, you should aim to solve one Hard problem in about 25‑30 minutes. That leaves 5‑10 minutes for introduction and questions. The breakdown: 5‑7 minutes to understand the problem and ask clarifying questions, 10‑12 minutes to design the solution (including edge cases), 8‑10 minutes to code, and 2‑3 minutes to test with examples.

Beyond correctness, DoorDash interviewers watch for:

1. **Domain translation** – How well do you map the delivery/order scenario to a graph or DP model? They want to see you recognize that “delivery time windows” are intervals, “driver capacity” is a knapsack constraint, etc.
2. **State definition** – In DP or graph problems, your ability to identify the minimal necessary state is critical. Interviewers listen for you to say, “We need to track the node plus the items picked up so far” or “The DP state is `(index, remaining_time)`.”
3. **Edge‑case hunting** – DoorDash problems often have subtle constraints: “What if two orders have the same deadline?” “Can a driver be idle between deliveries?” Mentioning these shows production‑ready thinking.
4. **Code readability** – Even in a Hard problem, your code should be modular. Extract helper functions for state transitions or priority queue comparisons.

## Upgrading from Medium to Hard

The jump from Medium to Hard isn’t about learning new algorithms—it’s about **combining them fluidly**. In a Medium, you might apply BFS to find the shortest path. In a Hard, you’ll need BFS _plus_ a bitmask to track visited nodes under different conditions (like LeetCode #847, Shortest Path Visiting All Nodes).

The key mindset shifts:

- **Think in state space**: Instead of “node,” think “`(node, time, resources)`.” This is the single biggest leap.
- **Embrace intermediate data structures**: You’ll often need a hash map of hash maps (e.g., `dp[node][mask]`) or a custom object for priority queue entries.
- **Pre‑process aggressively**: Hard problems often require building a graph from raw input, compressing coordinates, or sorting intervals before the main algorithm.
- **Know when to brute‑force a dimension**: If a constraint is small (e.g., “at most 10 delivery items”), it’s a signal to use bitmask DP or brute‑force over subsets.

## Specific Patterns for Hard

**1. Interval DP with Order Constraints**  
Problems like “Maximum Profit in Job Scheduling” (LeetCode #1235) appear frequently with a DoorDash twist: jobs have prerequisites (e.g., order A must be delivered before order B). Solution: sort jobs by end time, then DP where `dp[i] = max profit up to job i`. For prerequisites, binary search for the latest non‑conflicting job that also satisfies prerequisite chains.

**2. Multi‑Source BFS with Walls and Keys**  
Modeled after “Shortest Path to Get All Keys” (LeetCode #864), this pattern involves navigating a grid where you need to pick up keys to open doors. The state is `(x, y, keys_mask)`. DoorDash variants add time windows (keys disappear after T steps) or multiple agents.

**3. Resource‑Constrained Shortest Path**  
Exactly the template shown above: Dijkstra where each node is augmented with resource levels (e.g., remaining battery, items in trunk). The graph may have edges that consume or replenish resources.

## Practice Strategy

Don’t just solve DoorDash’s 30 Hard problems in order. Group them by pattern:

1. **Week 1–2**: Graph‑based Hard problems (8–10 problems). Focus on Dijkstra with state and multi‑source BFS.
2. **Week 3–4**: DP‑based Hard problems (8–10 problems). Emphasize interval DP and bitmask DP.
3. **Week 5–6**: Remaining problems, mixing patterns. Simulate interview conditions: 30 minutes per problem with verbal explanation.

Daily target: 1–2 Hard problems, but only if you spend equal time reviewing and refactoring your solution. For each problem, write a “pattern summary” in your own words: “This is Dijkstra with `(node, fuel)` state, similar to #1578 but with time windows.”

Remember: Hard problems are about **recognizing which combination of tools to use**. Practice until the combination becomes your default thinking.

[Practice Hard DoorDash questions](/company/doordash/hard)
