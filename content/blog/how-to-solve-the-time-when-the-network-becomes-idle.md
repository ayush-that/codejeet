---
title: "How to Solve The Time When the Network Becomes Idle — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode The Time When the Network Becomes Idle. Medium difficulty, 55.3% acceptance rate. Topics: Array, Breadth-First Search, Graph Theory."
date: "2029-09-17"
category: "dsa-patterns"
tags:
  [
    "the-time-when-the-network-becomes-idle",
    "array",
    "breadth-first-search",
    "graph-theory",
    "medium",
  ]
---

# How to Solve "The Time When the Network Becomes Idle"

This problem asks us to find the time when a network of servers becomes idle after messages are sent from a master server (server 0) to all other servers. The tricky part is that servers send response messages back to the master, and these responses can be delayed if the server is busy processing previous messages. This creates a synchronization challenge where we need to track both network travel time and server processing cycles.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
edges = [[0,1],[1,2]], patience = [0,2,1]
```

We have 3 servers (0, 1, 2) with the following connections:

- Server 0 connects to server 1
- Server 1 connects to server 2

Patience values mean:

- Server 0 (master): patience = 0 (doesn't send responses)
- Server 1: patience = 2 (resends message every 2 seconds if no response)
- Server 2: patience = 1 (resends message every 1 second if no response)

**Step 1: Find shortest distances from server 0 to all servers**

- Distance to server 0: 0
- Distance to server 1: 1 (direct connection)
- Distance to server 2: 2 (0→1→2)

**Step 2: Calculate when each server becomes idle**
For server 1 (distance = 1, patience = 2):

- First message arrives at server 1 at time = 1
- Response sent back immediately, arrives at master at time = 2 (1 + 1)
- No resends needed since 2 ≤ 2 × 1 = 2
- Last message arrives at master at time = 2

For server 2 (distance = 2, patience = 1):

- First message arrives at server 2 at time = 2
- Response sent back immediately
- But server 2 has patience = 1, so it resends every 1 second
- Last resend happens at: ⌊(2×2 - 1)/1⌋ × 1 = ⌊3/1⌋ × 1 = 3
- Last resend arrives at server 2 at time = 3
- Response takes 2 seconds to reach master: 3 + 2 = 5
- So server 2 becomes idle at time = 5

**Step 3: Find maximum idle time**
max(2, 5) = 5

The network becomes idle at time 5.

## Brute Force Approach

A naive approach might try to simulate every message sent through the network in real time. We could:

1. Keep a global clock and advance time step by step
2. Track messages in flight between servers
3. Have each server resend messages according to its patience value
4. Stop when all responses have been received

This simulation approach has several problems:

- Time could potentially go up to very large values (up to 10^5 × 10^5 in worst case)
- We'd need to track potentially millions of messages
- The time complexity would be O(T × n) where T is the final idle time, which could be enormous

The key insight is that we don't need to simulate every tick of the clock. We can calculate the last message arrival time for each server mathematically once we know the shortest distance from the master.

## Optimized Approach

The optimal solution combines BFS for shortest paths with mathematical calculation:

1. **Build the graph** from the edges array
2. **Find shortest distances** from server 0 to all servers using BFS (since all edges have weight 1)
3. **For each server i** (except server 0):
   - Calculate round-trip time: `2 * distance[i]`
   - Determine when the last message is sent from server i:
     - If `patience[i] >= roundTripTime`, no resends happen
     - Otherwise, the last resend happens at: `⌊(roundTripTime - 1) / patience[i]⌋ × patience[i]`
   - Calculate when the response to the last message arrives: `lastSendTime + distance[i]`
4. **Take the maximum** of all these arrival times

The formula for the last resend time comes from understanding that:

- The first message arrives at server i at time = `distance[i]`
- Server i will keep resending every `patience[i]` seconds until it receives a response
- The response to the first message arrives at server i at time = `2 * distance[i]`
- So the last resend must happen before time = `2 * distance[i]`
- The last resend time is the largest multiple of `patience[i]` that is less than `2 * distance[i]`

## Optimal Solution

<div class="code-group">

```python
# Time: O(V + E) where V = n servers, E = len(edges)
# Space: O(V + E) for the graph adjacency list and BFS queue
from collections import deque
from typing import List

def networkBecomesIdle(edges: List[List[int]], patience: List[int]) -> int:
    n = len(patience)

    # Step 1: Build adjacency list for the graph
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    # Step 2: BFS to find shortest distances from server 0
    distance = [-1] * n  # -1 means not visited yet
    distance[0] = 0
    queue = deque([0])

    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if distance[neighbor] == -1:  # Not visited
                distance[neighbor] = distance[node] + 1
                queue.append(neighbor)

    # Step 3: Calculate when each server becomes idle
    max_time = 0
    for i in range(1, n):  # Skip server 0 (master)
        round_trip = 2 * distance[i]

        # Calculate when the last message is sent from server i
        if patience[i] >= round_trip:
            # No resends needed, only the first message
            last_send_time = distance[i]
        else:
            # Last resend happens at the largest multiple of patience[i]
            # that is less than round_trip
            last_send_time = ((round_trip - 1) // patience[i]) * patience[i]

        # Response to the last message arrives at master
        arrival_time = last_send_time + distance[i]

        # Update maximum idle time
        max_time = max(max_time, arrival_time)

    # Step 4: Add 1 because the network becomes idle AFTER the last message arrives
    return max_time + 1
```

```javascript
// Time: O(V + E) where V = n servers, E = edges.length
// Space: O(V + E) for the graph adjacency list and BFS queue
function networkBecomesIdle(edges, patience) {
  const n = patience.length;

  // Step 1: Build adjacency list for the graph
  const graph = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    graph[u].push(v);
    graph[v].push(u);
  }

  // Step 2: BFS to find shortest distances from server 0
  const distance = Array(n).fill(-1); // -1 means not visited yet
  distance[0] = 0;
  const queue = [0];

  while (queue.length > 0) {
    const node = queue.shift();
    for (const neighbor of graph[node]) {
      if (distance[neighbor] === -1) {
        // Not visited
        distance[neighbor] = distance[node] + 1;
        queue.push(neighbor);
      }
    }
  }

  // Step 3: Calculate when each server becomes idle
  let maxTime = 0;
  for (let i = 1; i < n; i++) {
    // Skip server 0 (master)
    const roundTrip = 2 * distance[i];

    // Calculate when the last message is sent from server i
    let lastSendTime;
    if (patience[i] >= roundTrip) {
      // No resends needed, only the first message
      lastSendTime = distance[i];
    } else {
      // Last resend happens at the largest multiple of patience[i]
      // that is less than round_trip
      lastSendTime = Math.floor((roundTrip - 1) / patience[i]) * patience[i];
    }

    // Response to the last message arrives at master
    const arrivalTime = lastSendTime + distance[i];

    // Update maximum idle time
    maxTime = Math.max(maxTime, arrivalTime);
  }

  // Step 4: Add 1 because the network becomes idle AFTER the last message arrives
  return maxTime + 1;
}
```

```java
// Time: O(V + E) where V = n servers, E = edges.length
// Space: O(V + E) for the graph adjacency list and BFS queue
import java.util.*;

class Solution {
    public int networkBecomesIdle(int[][] edges, int[] patience) {
        int n = patience.length;

        // Step 1: Build adjacency list for the graph
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph.get(u).add(v);
            graph.get(v).add(u);
        }

        // Step 2: BFS to find shortest distances from server 0
        int[] distance = new int[n];
        Arrays.fill(distance, -1);  // -1 means not visited yet
        distance[0] = 0;
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(0);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            for (int neighbor : graph.get(node)) {
                if (distance[neighbor] == -1) {  // Not visited
                    distance[neighbor] = distance[node] + 1;
                    queue.offer(neighbor);
                }
            }
        }

        // Step 3: Calculate when each server becomes idle
        int maxTime = 0;
        for (int i = 1; i < n; i++) {  // Skip server 0 (master)
            int roundTrip = 2 * distance[i];

            // Calculate when the last message is sent from server i
            int lastSendTime;
            if (patience[i] >= roundTrip) {
                // No resends needed, only the first message
                lastSendTime = distance[i];
            } else {
                // Last resend happens at the largest multiple of patience[i]
                // that is less than round_trip
                lastSendTime = ((roundTrip - 1) / patience[i]) * patience[i];
            }

            // Response to the last message arrives at master
            int arrivalTime = lastSendTime + distance[i];

            // Update maximum idle time
            maxTime = Math.max(maxTime, arrivalTime);
        }

        // Step 4: Add 1 because the network becomes idle AFTER the last message arrives
        return maxTime + 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(V + E)**

- Building the adjacency list: O(E)
- BFS traversal: O(V + E) since we visit each node and edge once
- Calculating idle times: O(V)
- Total: O(V + E)

**Space Complexity: O(V + E)**

- Graph adjacency list: O(E)
- Distance array: O(V)
- BFS queue: O(V) in worst case
- Total: O(V + E)

## Common Mistakes

1. **Forgetting to add 1 at the end**: The problem asks for when the network becomes idle, which happens AFTER the last message arrives. If the last message arrives at time t, the network becomes idle at time t + 1.

2. **Using Dijkstra's algorithm unnecessarily**: Since all edges have weight 1, BFS is sufficient and more efficient than Dijkstra's. Dijkstra's would add O(E log V) complexity.

3. **Incorrect last resend time calculation**: A common error is using `(roundTrip // patience[i]) * patience[i]` instead of `((roundTrip - 1) // patience[i]) * patience[i]`. The last resend must happen BEFORE the response arrives, not at or after.

4. **Not handling the case when patience[i] >= roundTrip**: When a server's patience is greater than or equal to the round-trip time, it won't resend any messages. We need to handle this case separately.

## When You'll See This Pattern

This problem combines BFS for unweighted shortest paths with mathematical reasoning about periodic events. You'll see similar patterns in:

1. **Network Delay Time (LeetCode 743)**: Also finds shortest paths in a network, though with weighted edges requiring Dijkstra's algorithm.

2. **Rotting Oranges (LeetCode 994)**: Uses BFS to simulate propagation through a grid, similar to how we propagate distances through the network.

3. **Word Ladder (LeetCode 127)**: Uses BFS to find the shortest transformation sequence, demonstrating the same shortest-path-in-unweighted-graph pattern.

## Key Takeaways

1. **BFS finds shortest paths in unweighted graphs**: When all edges have the same cost (like 1 second in this problem), BFS is the optimal choice over Dijkstra's.

2. **Mathematical reasoning beats simulation**: Instead of simulating every time tick, we can often derive formulas for periodic events, especially when dealing with multiples and remainders.

3. **Read problem statements carefully**: The distinction between "when the last message arrives" and "when the network becomes idle" (+1) is subtle but crucial.

Related problems: [Network Delay Time](/problem/network-delay-time), [N-ary Tree Level Order Traversal](/problem/n-ary-tree-level-order-traversal), [Maximum Depth of N-ary Tree](/problem/maximum-depth-of-n-ary-tree)
