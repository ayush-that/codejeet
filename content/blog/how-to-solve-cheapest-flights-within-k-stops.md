---
title: "How to Solve Cheapest Flights Within K Stops — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Cheapest Flights Within K Stops. Medium difficulty, 41.4% acceptance rate. Topics: Dynamic Programming, Depth-First Search, Breadth-First Search, Graph Theory, Heap (Priority Queue)."
date: "2026-11-17"
category: "dsa-patterns"
tags:
  [
    "cheapest-flights-within-k-stops",
    "dynamic-programming",
    "depth-first-search",
    "breadth-first-search",
    "medium",
  ]
---

# How to Solve Cheapest Flights Within K Stops

You're given a flight network with costs between cities, and you need to find the cheapest route from a source to a destination with at most K stops. What makes this problem tricky is that it's not just about finding the shortest path—you have a constraint on the number of intermediate stops, which prevents you from using standard Dijkstra's algorithm directly. You need to track both cost and stops simultaneously.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- n = 4 cities (0, 1, 2, 3)
- flights = [[0,1,100],[1,2,100],[0,2,500],[1,3,600],[2,3,200]]
- src = 0, dst = 3, k = 1 (at most 1 stop)

**Step-by-step reasoning:**

1. **Initial state:** We start at city 0 with cost 0 and 0 stops used.
2. **From city 0:**
   - Flight 0→1 costs 100: Now at city 1, total cost = 100, stops used = 1
   - Flight 0→2 costs 500: Now at city 2, total cost = 500, stops used = 1

3. **From city 1 (cost 100, 1 stop used):**
   - Flight 1→2 costs 100: Total cost = 200, stops used = 2 (exceeds k=1, so invalid)
   - Flight 1→3 costs 600: Total cost = 700, stops used = 2 (invalid)

4. **From city 2 (cost 500, 1 stop used):**
   - Flight 2→3 costs 200: Total cost = 700, stops used = 2 (invalid)

Wait—this seems wrong! We found a route 0→1→3 with cost 700, but it uses 2 stops (0→1 counts as 1 stop, 1→3 counts as another). Actually, let's clarify: "k stops" means intermediate stops. So with k=1, you can have at most 1 intermediate city between src and dst.

Let me correct: Route 0→1→3 has 1 intermediate city (city 1), so it's valid! The stops count is the number of edges minus 1, or the number of intermediate cities.

Actually, looking at the problem statement: "return the cheapest price from src to dst with at most k stops." A "stop" means you land at a city. So if k=1, you can have at most 1 intermediate city.

Route 0→1→3: Takes 2 flights, lands at 1 intermediate city. That's valid with k=1.

But in my calculation above, I said it had "stops used = 2" which was incorrect. Let me track this properly:

**Correct tracking:**

- Start at city 0: cost=0, stops=0
- Flight 0→1: cost=100, stops=1 (landed at 1 intermediate city)
- Flight 1→3: cost=700, stops=2 (landed at 2 intermediate cities total: 1 and 3) Wait, dst=3 is our destination, not an intermediate stop!

Actually, the "stops" count should only include intermediate cities, not the destination. So:

- Flight 0→1: cost=100, stops=1 (city 1 is intermediate)
- Flight 1→3: cost=700, stops=1 (city 1 is still the only intermediate; city 3 is destination)

So route 0→1→3 costs 700 with 1 stop.

But is there a cheaper route? Let's check 0→2→3:

- Flight 0→2: cost=500, stops=1
- Flight 2→3: cost=700, stops=1

Both routes cost 700. But wait, there's also 0→1→2→3:

- 0→1: cost=100, stops=1
- 1→2: cost=200, stops=2 (exceeds k=1, so invalid)

So the cheapest valid price is 700.

This example shows why we need to track both cost and stops: sometimes a cheaper route might use too many stops, and sometimes a more expensive route with fewer stops might be the only valid option.

## Brute Force Approach

A naive approach would be to explore all possible paths from src to dst with at most k+1 edges (since k stops means k+1 flights). We could use DFS to explore all routes:

1. Start from src with cost=0 and stops=0
2. For each outgoing flight from current city:
   - Add flight cost to total
   - Increment stops count
   - If stops > k+1, abandon this path
   - If reached dst, update minimum cost
   - Otherwise, continue DFS

The problem with this approach is exponential time complexity. In the worst case, if every city connects to every other city, we'd explore O(n^k) paths. For n=100 and k=99, that's astronomically large.

Even with memoization (caching results for [city, stops] pairs), we might still explore many paths because cheaper paths to a city might use more stops, making them invalid for reaching dst within the stop limit.

## Optimized Approach

The key insight is that this is a **shortest path problem with an additional constraint** (maximum stops). We need to modify Dijkstra's algorithm or use dynamic programming.

**Why not standard Dijkstra?**
Dijkstra's algorithm always picks the node with the smallest distance, but in our case, a path with lower cost might use more stops, preventing us from reaching the destination within the stop limit. Conversely, a path with higher cost but fewer stops might allow us to complete the journey.

**Two main approaches:**

1. **Bellman-Ford / Dynamic Programming**: Since we have a constraint on the number of edges (k+1 flights), we can use an approach similar to Bellman-Ford which relaxes edges repeatedly. We can track the minimum cost to reach each city using exactly i flights for i from 0 to k+1.

2. **Modified Dijkstra with stops tracking**: We can use a priority queue that stores (cost, city, stops). When we pop a node, if stops > k, we skip it. Otherwise, we explore neighbors. We also need to track the minimum stops to reach each city with a given cost, or vice versa.

The DP approach is more straightforward for this problem because the constraint is on the number of steps (flights), which aligns perfectly with Bellman-Ford's iteration count.

**DP State Definition:**
Let `dp[i][city]` = minimum cost to reach `city` using exactly `i` flights.

**Transition:**
`dp[i][to] = min(dp[i][to], dp[i-1][from] + price)` for each flight `[from, to, price]`

**Base Case:**
`dp[0][src] = 0` (0 cost to be at src with 0 flights)
All other `dp[0][city] = infinity`

**Answer:**
We want the minimum cost to reach dst using at most k+1 flights, so:
`answer = min(dp[i][dst]) for i in range(1, k+2)`

## Optimal Solution

Here's the dynamic programming solution that runs in O(k \* E) time where E is the number of flights:

<div class="code-group">

```python
# Time: O(k * E) where E = len(flights)
# Space: O(n) for the DP arrays
def findCheapestPrice(n, flights, src, dst, k):
    # dp_prev[c] = minimum cost to reach city c in the previous iteration
    # dp_curr[c] = minimum cost to reach city c in the current iteration
    # We only need two arrays because we only need dp[i-1] to compute dp[i]

    # Initialize with infinity for all cities
    INF = float('inf')
    dp_prev = [INF] * n
    dp_curr = [INF] * n

    # Base case: cost to reach src with 0 flights is 0
    dp_prev[src] = 0

    # We can take at most k+1 flights (k stops means k intermediate cities)
    for stops in range(k + 1):
        # Copy previous state to current (we might reach cities without taking a flight)
        dp_curr = dp_prev.copy()

        # Try to relax each flight
        for from_city, to_city, price in flights:
            # If we can reach the departure city from previous iteration
            if dp_prev[from_city] != INF:
                # Try to improve the cost to reach the arrival city
                new_cost = dp_prev[from_city] + price
                if new_cost < dp_curr[to_city]:
                    dp_curr[to_city] = new_cost

        # Move current to previous for next iteration
        dp_prev = dp_curr

    # Return the cost to reach dst, or -1 if unreachable
    return dp_curr[dst] if dp_curr[dst] != INF else -1
```

```javascript
// Time: O(k * E) where E = flights.length
// Space: O(n) for the DP arrays
function findCheapestPrice(n, flights, src, dst, k) {
  // dpPrev[c] = minimum cost to reach city c in the previous iteration
  // dpCurr[c] = minimum cost to reach city c in the current iteration

  const INF = Number.MAX_SAFE_INTEGER;
  let dpPrev = new Array(n).fill(INF);
  let dpCurr = new Array(n).fill(INF);

  // Base case: cost to reach src with 0 flights is 0
  dpPrev[src] = 0;

  // We can take at most k+1 flights
  for (let stops = 0; stops <= k; stops++) {
    // Copy previous state to current
    dpCurr = [...dpPrev];

    // Try to relax each flight
    for (const [fromCity, toCity, price] of flights) {
      // If we can reach the departure city from previous iteration
      if (dpPrev[fromCity] !== INF) {
        // Try to improve the cost to reach the arrival city
        const newCost = dpPrev[fromCity] + price;
        if (newCost < dpCurr[toCity]) {
          dpCurr[toCity] = newCost;
        }
      }
    }

    // Move current to previous for next iteration
    dpPrev = dpCurr;
  }

  // Return the cost to reach dst, or -1 if unreachable
  return dpCurr[dst] !== INF ? dpCurr[dst] : -1;
}
```

```java
// Time: O(k * E) where E = flights.length
// Space: O(n) for the DP arrays
public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    // dpPrev[c] = minimum cost to reach city c in the previous iteration
    // dpCurr[c] = minimum cost to reach city c in the current iteration

    final int INF = Integer.MAX_VALUE / 2; // Avoid overflow when adding
    int[] dpPrev = new int[n];
    int[] dpCurr = new int[n];

    // Initialize with infinity
    Arrays.fill(dpPrev, INF);
    Arrays.fill(dpCurr, INF);

    // Base case: cost to reach src with 0 flights is 0
    dpPrev[src] = 0;

    // We can take at most k+1 flights
    for (int stops = 0; stops <= k; stops++) {
        // Copy previous state to current
        System.arraycopy(dpPrev, 0, dpCurr, 0, n);

        // Try to relax each flight
        for (int[] flight : flights) {
            int fromCity = flight[0];
            int toCity = flight[1];
            int price = flight[2];

            // If we can reach the departure city from previous iteration
            if (dpPrev[fromCity] != INF) {
                // Try to improve the cost to reach the arrival city
                int newCost = dpPrev[fromCity] + price;
                if (newCost < dpCurr[toCity]) {
                    dpCurr[toCity] = newCost;
                }
            }
        }

        // Move current to previous for next iteration
        int[] temp = dpPrev;
        dpPrev = dpCurr;
        dpCurr = temp;
    }

    // Return the cost to reach dst, or -1 if unreachable
    return dpPrev[dst] != INF ? dpPrev[dst] : -1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(k × E)**

- We iterate `k+1` times (from 0 to k stops, which means at most k+1 flights)
- In each iteration, we process all `E` flights
- Each flight processing is O(1) constant time

**Space Complexity: O(n)**

- We maintain two arrays of size `n` for the DP states
- We don't need the full `(k+2) × n` DP table because we only need the previous iteration to compute the current one

This is efficient because `k` is typically much smaller than `n` in practice (you wouldn't make hundreds of stops on a flight itinerary).

## Common Mistakes

1. **Using standard Dijkstra without stop tracking**: Candidates often try to use Dijkstra's algorithm with just a priority queue of (cost, city). This fails because a cheaper path might use too many stops, making it impossible to reach the destination within the stop limit.

2. **Incorrect stop counting**: The problem says "at most k stops" which means at most k intermediate cities. Some candidates count the destination as a stop or confuse stops with flights. Remember: k stops = at most k intermediate cities = at most k+1 flights.

3. **Not handling unreachable destinations**: Forgetting to return -1 when the destination is unreachable within k stops. Always check if your final cost is still infinity (or a very large number) and return -1 in that case.

4. **Space inefficiency**: Creating a full (k+2) × n DP table uses O(k × n) space, which can be large. The optimal solution only needs O(n) space by reusing two arrays.

## When You'll See This Pattern

This "shortest path with constraints" pattern appears in various forms:

1. **Maximum Vacation Days (LeetCode 568)**: Similar structure where you have a constraint on the number of weeks (like our stop constraint) and want to maximize vacation days (instead of minimizing cost).

2. **Minimum Cost to Reach City With Discounts (LeetCode 2093)**: Another shortest path problem with an additional constraint (number of discounts you can use).

3. **Network Delay Time (LeetCode 743)**: Standard shortest path without the stop constraint, but understanding Dijkstra helps with this problem.

4. **Path With Minimum Effort (LeetCode 1631)**: Different constraint (maximum effort along a path) but similar idea of optimizing with constraints.

The core pattern is: when you need to find an optimal path (shortest, cheapest, etc.) but have an additional resource constraint (stops, time, discounts, etc.), consider dynamic programming where one dimension tracks the resource usage.

## Key Takeaways

1. **Constraint-aware shortest path problems often need DP**: When you have a limit on steps/resources (stops, time, fuel, etc.), dynamic programming with states like `dp[steps][node]` is often the right approach.

2. **Bellman-Ford adapts well to step constraints**: The Bellman-Ford algorithm naturally works in iterations (relaxing edges i times finds shortest paths with at most i edges), making it perfect for problems with step limits.

3. **Space optimization is possible**: For DP problems where you only need the previous state to compute the current one, you can often reduce space from O(k × n) to O(n) by using rolling arrays.

**Related problems:** [Maximum Vacation Days](/problem/maximum-vacation-days), [Minimum Cost to Reach City With Discounts](/problem/minimum-cost-to-reach-city-with-discounts)
