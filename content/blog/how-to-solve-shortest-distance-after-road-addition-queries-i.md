---
title: "How to Solve Shortest Distance After Road Addition Queries I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Shortest Distance After Road Addition Queries I. Medium difficulty, 61.9% acceptance rate. Topics: Array, Breadth-First Search, Graph Theory."
date: "2027-03-10"
category: "dsa-patterns"
tags:
  [
    "shortest-distance-after-road-addition-queries-i",
    "array",
    "breadth-first-search",
    "graph-theory",
    "medium",
  ]
---

# How to Solve Shortest Distance After Road Addition Queries I

This problem presents an interesting graph challenge: we start with a simple linear chain of cities (0→1→2→...→n-1) and gradually add new unidirectional roads, needing to compute the shortest distance from city 0 to city n-1 after each query. The tricky part is that we need to efficiently handle multiple queries without recomputing everything from scratch each time.

## Visual Walkthrough

Let's trace through a small example: `n = 5`, `queries = [[1,3], [2,4]]`

**Initial state:**

- Cities: 0 → 1 → 2 → 3 → 4
- Distance from 0 to 4: 4 (0→1→2→3→4)

**After query 1: [1,3]**

- New road: 1 → 3
- Now we have: 0 → 1 → 3 → 4 (and 1 → 2 → 3 still exists)
- Shortest path: 0→1→3→4 = 3 edges
- Output: 3

**After query 2: [2,4]**

- New road: 2 → 4
- Now we have: 0 → 1 → 2 → 4 (and other roads still exist)
- Shortest path: 0→1→2→4 = 3 edges
- Output: 3

The key insight: each new road creates potential shortcuts. A road from `u` to `v` gives us a path 0→...→u→v→...→n-1. The total distance would be: distance from 0 to u, plus 1 (for the new road), plus distance from v to n-1.

## Brute Force Approach

A naive approach would be to rebuild the graph after each query and run BFS/DFS from city 0 to find the shortest path to city n-1. Here's what that would look like:

1. Initialize the graph with the initial linear chain
2. For each query:
   - Add the new edge u→v
   - Run BFS from 0 to find shortest path to n-1
   - Store the result

**Why this fails:** Each BFS takes O(n + m) time where m is the number of edges. With q queries, this becomes O(q × (n + m)). Since we can add up to q edges, m = (n-1) + q, giving us O(q × (n + q)). For n up to 10^5 and q up to 10^4, this is far too slow (potentially 10^9 operations).

The brute force misses a crucial observation: we don't need to recompute the entire graph. We only need to know if the new road creates a better path than what we already have.

## Optimized Approach

The key insight is that we can precompute two important distances:

1. `distFromStart[i]`: shortest distance from city 0 to city i using only original roads
2. `distToEnd[i]`: shortest distance from city i to city n-1 using only original roads

For the initial linear chain:

- `distFromStart[i] = i` (0→1→...→i takes i edges)
- `distToEnd[i] = n-1-i` (i→i+1→...→n-1 takes n-1-i edges)

When we add a road from u to v, we get a candidate path:
`distFromStart[u] + 1 + distToEnd[v]`

We need to track the minimum distance found so far. Initially, the best distance is `n-1` (the linear path). With each new query, we check if the new road creates a shorter path and update our answer if it does.

**Why this works:** All roads are unidirectional and forward-pointing (u < v for queries). The original graph is a DAG (Directed Acyclic Graph), and new roads maintain this property since u < v. This means the shortest path from 0 to n-1 will always be a simple path without cycles.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + q) where n = number of cities, q = number of queries
# Space: O(n) for storing the distance arrays
def shortestDistanceAfterQueries(n, queries):
    """
    Calculate shortest distance from city 0 to city n-1 after each road addition.

    Args:
        n: number of cities (0 to n-1)
        queries: list of [u, v] pairs representing new roads u->v

    Returns:
        List of shortest distances after each query
    """
    # Precompute distances from start and to end using original linear chain
    dist_from_start = [0] * n
    dist_to_end = [0] * n

    # For the initial linear chain: 0->1->2->...->n-1
    # Distance from 0 to i is simply i
    for i in range(n):
        dist_from_start[i] = i

    # Distance from i to n-1 is (n-1 - i)
    for i in range(n):
        dist_to_end[i] = n - 1 - i

    # Initial shortest distance is the linear path: 0->1->2->...->n-1
    current_min = n - 1
    result = []

    # Process each query
    for u, v in queries:
        # Candidate path using the new road: 0->...->u->v->...->n-1
        candidate = dist_from_start[u] + 1 + dist_to_end[v]

        # Update minimum if this path is shorter
        current_min = min(current_min, candidate)

        # Add current best distance to results
        result.append(current_min)

    return result
```

```javascript
// Time: O(n + q) where n = number of cities, q = number of queries
// Space: O(n) for storing the distance arrays
function shortestDistanceAfterQueries(n, queries) {
  /**
   * Calculate shortest distance from city 0 to city n-1 after each road addition.
   *
   * @param {number} n - number of cities (0 to n-1)
   * @param {number[][]} queries - array of [u, v] pairs representing new roads u->v
   * @return {number[]} - array of shortest distances after each query
   */

  // Precompute distances from start and to end using original linear chain
  const distFromStart = new Array(n);
  const distToEnd = new Array(n);

  // For the initial linear chain: 0->1->2->...->n-1
  // Distance from 0 to i is simply i
  for (let i = 0; i < n; i++) {
    distFromStart[i] = i;
  }

  // Distance from i to n-1 is (n-1 - i)
  for (let i = 0; i < n; i++) {
    distToEnd[i] = n - 1 - i;
  }

  // Initial shortest distance is the linear path: 0->1->2->...->n-1
  let currentMin = n - 1;
  const result = [];

  // Process each query
  for (const [u, v] of queries) {
    // Candidate path using the new road: 0->...->u->v->...->n-1
    const candidate = distFromStart[u] + 1 + distToEnd[v];

    // Update minimum if this path is shorter
    currentMin = Math.min(currentMin, candidate);

    // Add current best distance to results
    result.push(currentMin);
  }

  return result;
}
```

```java
// Time: O(n + q) where n = number of cities, q = number of queries
// Space: O(n) for storing the distance arrays
import java.util.ArrayList;
import java.util.List;

class Solution {
    public int[] shortestDistanceAfterQueries(int n, int[][] queries) {
        /**
         * Calculate shortest distance from city 0 to city n-1 after each road addition.
         *
         * @param n: number of cities (0 to n-1)
         * @param queries: array of [u, v] pairs representing new roads u->v
         * @return: array of shortest distances after each query
         */

        // Precompute distances from start and to end using original linear chain
        int[] distFromStart = new int[n];
        int[] distToEnd = new int[n];

        // For the initial linear chain: 0->1->2->...->n-1
        // Distance from 0 to i is simply i
        for (int i = 0; i < n; i++) {
            distFromStart[i] = i;
        }

        // Distance from i to n-1 is (n-1 - i)
        for (int i = 0; i < n; i++) {
            distToEnd[i] = n - 1 - i;
        }

        // Initial shortest distance is the linear path: 0->1->2->...->n-1
        int currentMin = n - 1;
        List<Integer> resultList = new ArrayList<>();

        // Process each query
        for (int[] query : queries) {
            int u = query[0];
            int v = query[1];

            // Candidate path using the new road: 0->...->u->v->...->n-1
            int candidate = distFromStart[u] + 1 + distToEnd[v];

            // Update minimum if this path is shorter
            currentMin = Math.min(currentMin, candidate);

            // Add current best distance to results
            resultList.add(currentMin);
        }

        // Convert List to array
        int[] result = new int[resultList.size()];
        for (int i = 0; i < resultList.size(); i++) {
            result[i] = resultList.get(i);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + q)**

- O(n) to precompute the `distFromStart` and `distToEnd` arrays
- O(q) to process each query (constant time per query)
- Total: O(n + q)

**Space Complexity: O(n)**

- O(n) for storing `distFromStart` array
- O(n) for storing `distToEnd` array
- O(q) for output array (not counted in auxiliary space)
- Total auxiliary space: O(n)

## Common Mistakes

1. **Using BFS/DFS for each query:** This is the most common mistake. Candidates often try to rebuild the graph and run a full search after each query, resulting in O(q × (n+q)) time complexity which is too slow for the constraints.

2. **Forgetting that roads are unidirectional:** Some candidates treat the graph as undirected or consider backward traversal. Remember: all roads (initial and added) go from lower-numbered to higher-numbered cities.

3. **Not considering that minimum distance never increases:** Once we find a shorter path, the distance can only stay the same or decrease with new roads. Some candidates try to recompute from scratch each time instead of tracking the minimum.

4. **Off-by-one errors in distance calculation:** The distance from 0 to i in the initial chain is `i`, not `i+1`. Similarly, from i to n-1 is `n-1-i`, not `n-i`.

## When You'll See This Pattern

This problem uses **precomputation of prefix/suffix values** combined with **incremental updates**—a pattern common in problems where you need to answer multiple queries efficiently.

Related LeetCode problems:

1. **Range Sum Query - Immutable (LeetCode 303)**: Uses prefix sums to answer sum queries in O(1) time after O(n) precomputation.
2. **Product of Array Except Self (LeetCode 238)**: Uses prefix and suffix products to compute the result in O(n) time.
3. **Trapping Rain Water (LeetCode 42)**: Uses precomputed left-max and right-max arrays to determine water capacity at each position.

The core idea is to spend O(n) time upfront to compute some useful information, then use that information to answer each query in O(1) time.

## Key Takeaways

1. **Precomputation is powerful for multiple queries:** When you need to answer many queries on the same data structure, look for opportunities to precompute information that makes each query faster.

2. **Break complex paths into segments:** The insight to split the path into (0→u), (u→v), and (v→n-1) segments is crucial. This decomposition simplifies the problem significantly.

3. **Track incremental improvements:** When processing queries sequentially, maintain the best result found so far rather than recomputing everything. This is especially useful when new data can only improve (not worsen) the solution.

[Practice this problem on CodeJeet](/problem/shortest-distance-after-road-addition-queries-i)
