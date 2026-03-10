---
title: "How to Solve Reconstruct Itinerary — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Reconstruct Itinerary. Hard difficulty, 44.3% acceptance rate. Topics: Array, String, Depth-First Search, Graph Theory, Sorting."
date: "2027-04-14"
category: "dsa-patterns"
tags: ["reconstruct-itinerary", "array", "string", "depth-first-search", "hard"]
---

# How to Solve Reconstruct Itinerary

You're given a list of flight tickets where each ticket is a `[from, to]` pair, and you need to reconstruct the itinerary that uses all tickets exactly once, starting from "JFK". The challenge is that there may be multiple valid itineraries, and you must return the lexicographically smallest one when read as a single string. This is essentially finding a Eulerian path in a directed graph, but with the twist that you need the lexicographically smallest valid path.

## Visual Walkthrough

Let's trace through a small example: `tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]`

We can think of this as a directed graph:

- JFK → SFO, ATL
- SFO → ATL
- ATL → JFK, SFO

We need to start at JFK and use all edges (tickets) exactly once. Let's build the itinerary step by step:

1. Start at JFK. From JFK, we can go to SFO or ATL. Since we need the lexicographically smallest itinerary, we choose ATL first (ATL < SFO).
2. Now at ATL. From ATL, we can go to JFK or SFO. Lexicographically, JFK < SFO, so we choose JFK.
3. Now at JFK. From JFK, we've already used the JFK→ATL ticket, so we only have JFK→SFO left. We go to SFO.
4. Now at SFO. From SFO, we only have SFO→ATL. We go to ATL.
5. Now at ATL. From ATL, we've used ATL→JFK, so we only have ATL→SFO left. We go to SFO.

Our itinerary becomes: JFK → ATL → JFK → SFO → ATL → SFO

But wait — we've used all tickets! Let's verify:

- JFK→ATL ✓
- ATL→JFK ✓
- JFK→SFO ✓
- SFO→ATL ✓
- ATL→SFO ✓

This is indeed a valid itinerary that uses all tickets exactly once, and it's the lexicographically smallest possible.

## Brute Force Approach

A naive approach would be to generate all possible permutations of the tickets, check which ones form valid itineraries starting from JFK, and then pick the lexicographically smallest one. Here's what that might look like:

1. Generate all permutations of the tickets (there are n! permutations)
2. For each permutation, check if it forms a valid itinerary:
   - First departure must be "JFK"
   - Each arrival must match the next departure
3. If valid, compare to current best (lexicographically smallest) and update if needed

The problem with this approach is the factorial time complexity. With just 10 tickets, we'd have 3,628,800 permutations to check. With the constraints (up to 300 tickets), this is completely infeasible.

Even a slightly better brute force using DFS to explore all paths would still be exponential in the worst case if we don't prune effectively.

## Optimized Approach

The key insight is that this is exactly the problem of finding an **Eulerian path** in a directed graph. An Eulerian path is a path that visits every edge exactly once. For directed graphs, a Eulerian path exists if:

1. The graph is connected (in the weak sense)
2. At most one vertex has outdegree - indegree = 1 (start)
3. At most one vertex has indegree - outdegree = 1 (end)
4. All other vertices have equal indegree and outdegree

In our case, we're guaranteed a valid itinerary exists, so we know a Eulerian path exists.

The standard algorithm for finding an Eulerian path is **Hierholzer's algorithm**, which runs in O(E) time. The algorithm works like this:

1. Start from the given starting vertex (JFK)
2. Follow edges until you get stuck (a vertex with no unused outgoing edges)
3. Backtrack, adding vertices to the path in reverse order
4. If there are unused edges from vertices in the current path, start new trails from those vertices

For the lexicographical requirement, we need to always choose the smallest available destination at each step. We can achieve this by sorting the adjacency lists or using a min-heap/priority queue.

## Optimal Solution

We'll use a modified DFS (Hierholzer's algorithm) with backtracking. The key is to process edges in sorted order and use post-order traversal to build the itinerary in reverse.

<div class="code-group">

```python
# Time: O(E log E) where E is number of tickets (for sorting adjacency lists)
# Space: O(E) for the graph and recursion stack
def findItinerary(tickets):
    # Step 1: Build the graph as adjacency list
    # We use a list for destinations so we can pop from the end efficiently
    graph = {}

    # Build the graph from tickets
    for from_airport, to_airport in tickets:
        if from_airport not in graph:
            graph[from_airport] = []
        graph[from_airport].append(to_airport)

    # Step 2: Sort each adjacency list in reverse order
    # We sort in reverse so we can pop from the end (which is O(1))
    # and get the lexicographically smallest destination first
    for airport in graph:
        graph[airport].sort(reverse=True)

    # Step 3: DFS (Hierholzer's algorithm) to find Eulerian path
    result = []

    def dfs(airport):
        # Visit all outgoing edges from this airport
        while airport in graph and graph[airport]:
            # Get the smallest destination (pop from end since we sorted in reverse)
            next_airport = graph[airport].pop()
            dfs(next_airport)
        # Add airport to result in post-order (reversed order)
        result.append(airport)

    # Start DFS from JFK
    dfs("JFK")

    # The result is built in reverse, so reverse it
    return result[::-1]
```

```javascript
// Time: O(E log E) where E is number of tickets (for sorting adjacency lists)
// Space: O(E) for the graph and recursion stack
function findItinerary(tickets) {
  // Step 1: Build the graph as adjacency list
  const graph = {};

  // Build the graph from tickets
  for (const [fromAirport, toAirport] of tickets) {
    if (!graph[fromAirport]) {
      graph[fromAirport] = [];
    }
    graph[fromAirport].push(toAirport);
  }

  // Step 2: Sort each adjacency list in reverse order
  // We sort in reverse so we can pop from the end (which is O(1))
  // and get the lexicographically smallest destination first
  for (const airport in graph) {
    graph[airport].sort((a, b) => b.localeCompare(a));
  }

  // Step 3: DFS (Hierholzer's algorithm) to find Eulerian path
  const result = [];

  function dfs(airport) {
    // Visit all outgoing edges from this airport
    while (graph[airport] && graph[airport].length > 0) {
      // Get the smallest destination (pop from end since we sorted in reverse)
      const nextAirport = graph[airport].pop();
      dfs(nextAirport);
    }
    // Add airport to result in post-order (reversed order)
    result.push(airport);
  }

  // Start DFS from JFK
  dfs("JFK");

  // The result is built in reverse, so reverse it
  return result.reverse();
}
```

```java
// Time: O(E log E) where E is number of tickets (for sorting adjacency lists)
// Space: O(E) for the graph and recursion stack
import java.util.*;

class Solution {
    public List<String> findItinerary(List<List<String>> tickets) {
        // Step 1: Build the graph as adjacency list
        Map<String, PriorityQueue<String>> graph = new HashMap<>();

        // Build the graph from tickets
        for (List<String> ticket : tickets) {
            String from = ticket.get(0);
            String to = ticket.get(1);

            graph.putIfAbsent(from, new PriorityQueue<>());
            graph.get(from).offer(to);
        }

        // Step 2: DFS (Hierholzer's algorithm) to find Eulerian path
        LinkedList<String> result = new LinkedList<>();

        dfs("JFK", graph, result);

        return result;
    }

    private void dfs(String airport, Map<String, PriorityQueue<String>> graph, LinkedList<String> result) {
        // Visit all outgoing edges from this airport
        PriorityQueue<String> destinations = graph.get(airport);
        while (destinations != null && !destinations.isEmpty()) {
            // Get the smallest destination (PriorityQueue gives us this automatically)
            String nextAirport = destinations.poll();
            dfs(nextAirport, graph, result);
        }
        // Add airport to result in post-order (at the beginning since we're using LinkedList)
        result.addFirst(airport);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(E log E)** where E is the number of tickets (edges). Here's why:

- Building the graph takes O(E) time
- Sorting each adjacency list takes O(E log E) in total (or O(d log d) for each vertex, summing to O(E log E))
- The DFS visits each edge exactly once, taking O(E) time
- The dominant factor is the sorting, giving us O(E log E)

In the Java solution using PriorityQueue, each insertion is O(log d) where d is the outdegree, so building the graph is O(E log E), and DFS is O(E log E) for polling from the priority queue.

**Space Complexity: O(E)** for:

- The graph adjacency list (stores all destinations)
- The recursion stack (in worst case could be O(E) if the path is very deep)
- The result list (stores E+1 airports)

## Common Mistakes

1. **Not handling multiple identical tickets correctly**: Some candidates use a Set instead of a multiset/bag. Remember that there can be multiple tickets with the same [from, to] pair. You need to track how many times each edge appears.

2. **Wrong lexicographical ordering**: When you have multiple choices at a node, you must always choose the lexicographically smallest one FIRST. But be careful: choosing the smallest first at each step (greedy) doesn't always work for Eulerian paths. That's why we need the post-order traversal approach.

3. **Infinite recursion or stack overflow**: Without proper edge removal, you might revisit the same edge multiple times. Always remove the edge when you traverse it. Also, for large inputs, the recursion depth could be up to E (number of edges), which might cause stack overflow. An iterative approach with an explicit stack can avoid this.

4. **Forgetting to reverse the result**: The Hierholzer algorithm builds the path in reverse order (post-order). Many candidates forget to reverse the result at the end, giving them the itinerary backwards.

## When You'll See This Pattern

This Eulerian path pattern appears in problems where you need to traverse all edges exactly once or arrange items in a specific order based on connections:

1. **Valid Arrangement of Pairs (LeetCode 2097)**: Almost identical problem but with numbers instead of strings. The same Eulerian path approach works.

2. **Cracking the Safe (LeetCode 753)**: Finding a de Bruijn sequence is related to finding an Eulerian circuit in a de Bruijn graph.

3. **Alien Dictionary (LeetCode 269)**: While not exactly the same, it also involves building and traversing a directed graph to find a valid ordering.

4. **Course Schedule II (LeetCode 210)**: Finding a topological order in a directed graph has similarities, though it's for DAGs rather than general graphs with Eulerian paths.

## Key Takeaways

1. **Recognize Eulerian path problems**: When you need to use all "connections" exactly once and return to a path (not necessarily a cycle), think Eulerian path. The giveaway is "use all tickets/edges exactly once."

2. **Hierholzer's algorithm is your friend**: For Eulerian paths in directed graphs, Hierholzer's algorithm with DFS and post-order traversal is the standard approach. Remember it builds the path in reverse.

3. **Lexicographical ordering requires careful handling**: Simply sorting adjacency lists isn't enough; you need to process edges in sorted order AND use the correct traversal order (post-order DFS) to ensure you get the correct lexicographically smallest complete path.

Related problems: [Longest Common Subpath](/problem/longest-common-subpath), [Valid Arrangement of Pairs](/problem/valid-arrangement-of-pairs)
