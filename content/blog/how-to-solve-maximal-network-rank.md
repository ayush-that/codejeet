---
title: "How to Solve Maximal Network Rank — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximal Network Rank. Medium difficulty, 65.9% acceptance rate. Topics: Graph Theory."
date: "2026-06-02"
category: "dsa-patterns"
tags: ["maximal-network-rank", "graph-theory", "medium"]
---

# How to Solve Maximal Network Rank

This problem asks us to find the maximum possible "network rank" between any two different cities in a road network. The network rank of two cities is defined as the total number of roads connected to either city, but if there's a direct road between them, we must count it only once. The challenge lies in efficiently calculating this for all possible city pairs without double-counting connections.

## Visual Walkthrough

Let's trace through a concrete example with 4 cities and 5 roads:

- n = 4
- roads = [[0,1], [0,3], [1,2], [1,3], [2,3]]

First, let's understand the connections:

- City 0 connects to cities 1 and 3 (2 roads)
- City 1 connects to cities 0, 2, and 3 (3 roads)
- City 2 connects to cities 1 and 3 (2 roads)
- City 3 connects to cities 0, 1, and 2 (3 roads)

Now let's calculate network ranks for some city pairs:

- Cities (0,1): City 0 has 2 roads + City 1 has 3 roads = 5 total. But they're directly connected (road [0,1]), so we subtract 1 → rank = 4
- Cities (0,2): 2 + 2 = 4, no direct connection → rank = 4
- Cities (0,3): 2 + 3 = 5, directly connected → subtract 1 → rank = 4
- Cities (1,2): 3 + 2 = 5, directly connected → subtract 1 → rank = 4
- Cities (1,3): 3 + 3 = 6, directly connected → subtract 1 → rank = 5
- Cities (2,3): 2 + 3 = 5, directly connected → subtract 1 → rank = 4

The maximal network rank is 5 for cities (1,3).

## Brute Force Approach

A naive approach would be:

1. For each pair of cities (i, j) where i < j
2. Count all roads connected to city i
3. Count all roads connected to city j
4. Add these counts together
5. If there's a direct road between i and j, subtract 1
6. Track the maximum value

The problem with this approach is efficiency. For each city pair, we need to scan through all roads to count connections. With n cities, there are O(n²) city pairs, and checking each road for each pair takes O(m) time, resulting in O(n² × m) time complexity. For n up to 100 and m up to n×(n-1)/2 ≈ 5000, this could be up to 100² × 5000 = 50 million operations, which is borderline but often too slow in interviews.

## Optimized Approach

The key insight is that we can precompute the degree (number of connections) for each city in O(m) time. Then, for each city pair, we can calculate their network rank in O(1) time using:

```
rank = degree[i] + degree[j] - (1 if i and j are directly connected else 0)
```

We need a fast way to check if two cities are directly connected. Since roads are bidirectional, we can use:

1. An adjacency matrix (O(n²) space) for O(1) lookup
2. A set of tuples or a hash set of encoded pairs for O(1) average lookup

The adjacency matrix approach uses more space but is simpler. For n ≤ 100, an n×n boolean matrix (10,000 elements) is perfectly reasonable.

## Optimal Solution

Here's the step-by-step optimal solution:

1. **Precompute degrees**: Create an array `degree` of size n, initialized to 0. For each road [a, b], increment degree[a] and degree[b].

2. **Track direct connections**: Create an n×n boolean matrix `connected` where connected[i][j] = true if there's a direct road between i and j.

3. **Calculate maximal rank**: For each pair (i, j) where i < j, compute rank = degree[i] + degree[j] - (1 if connected[i][j] else 0). Track the maximum.

<div class="code-group">

```python
# Time: O(n² + m) | Space: O(n²)
def maximalNetworkRank(n, roads):
    """
    Calculate the maximal network rank between any two different cities.

    Args:
        n: Number of cities (0 to n-1)
        roads: List of [a, b] pairs representing bidirectional roads

    Returns:
        Maximum network rank possible between any two different cities
    """
    # Step 1: Initialize degree array and connection matrix
    degree = [0] * n  # Track number of roads connected to each city
    connected = [[False] * n for _ in range(n)]  # Track direct connections

    # Step 2: Process all roads to build degree counts and connection matrix
    for a, b in roads:
        degree[a] += 1
        degree[b] += 1
        connected[a][b] = True
        connected[b][a] = True  # Roads are bidirectional

    # Step 3: Check all city pairs to find maximal network rank
    max_rank = 0

    # Iterate through all unique pairs of cities
    for i in range(n):
        for j in range(i + 1, n):  # j > i ensures we don't count pairs twice
            # Calculate network rank for this pair
            rank = degree[i] + degree[j]

            # Subtract 1 if cities are directly connected (avoid double-counting)
            if connected[i][j]:
                rank -= 1

            # Update maximum if we found a better rank
            max_rank = max(max_rank, rank)

    return max_rank
```

```javascript
// Time: O(n² + m) | Space: O(n²)
function maximalNetworkRank(n, roads) {
  /**
   * Calculate the maximal network rank between any two different cities.
   *
   * @param {number} n - Number of cities (0 to n-1)
   * @param {number[][]} roads - Array of [a, b] pairs representing bidirectional roads
   * @return {number} - Maximum network rank possible between any two different cities
   */

  // Step 1: Initialize degree array and connection matrix
  const degree = new Array(n).fill(0); // Track number of roads connected to each city
  const connected = Array.from({ length: n }, () => new Array(n).fill(false)); // Track direct connections

  // Step 2: Process all roads to build degree counts and connection matrix
  for (const [a, b] of roads) {
    degree[a]++;
    degree[b]++;
    connected[a][b] = true;
    connected[b][a] = true; // Roads are bidirectional
  }

  // Step 3: Check all city pairs to find maximal network rank
  let maxRank = 0;

  // Iterate through all unique pairs of cities
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // j > i ensures we don't count pairs twice
      // Calculate network rank for this pair
      let rank = degree[i] + degree[j];

      // Subtract 1 if cities are directly connected (avoid double-counting)
      if (connected[i][j]) {
        rank--;
      }

      // Update maximum if we found a better rank
      maxRank = Math.max(maxRank, rank);
    }
  }

  return maxRank;
}
```

```java
// Time: O(n² + m) | Space: O(n²)
class Solution {
    public int maximalNetworkRank(int n, int[][] roads) {
        /**
         * Calculate the maximal network rank between any two different cities.
         *
         * @param n: Number of cities (0 to n-1)
         * @param roads: Array of [a, b] pairs representing bidirectional roads
         * @return: Maximum network rank possible between any two different cities
         */

        // Step 1: Initialize degree array and connection matrix
        int[] degree = new int[n];  // Track number of roads connected to each city
        boolean[][] connected = new boolean[n][n];  // Track direct connections

        // Step 2: Process all roads to build degree counts and connection matrix
        for (int[] road : roads) {
            int a = road[0];
            int b = road[1];

            degree[a]++;
            degree[b]++;
            connected[a][b] = true;
            connected[b][a] = true;  // Roads are bidirectional
        }

        // Step 3: Check all city pairs to find maximal network rank
        int maxRank = 0;

        // Iterate through all unique pairs of cities
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {  // j > i ensures we don't count pairs twice
                // Calculate network rank for this pair
                int rank = degree[i] + degree[j];

                // Subtract 1 if cities are directly connected (avoid double-counting)
                if (connected[i][j]) {
                    rank--;
                }

                // Update maximum if we found a better rank
                maxRank = Math.max(maxRank, rank);
            }
        }

        return maxRank;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n² + m)**

- Building the degree array and connection matrix: O(m) where m is the number of roads
- Checking all city pairs: O(n²) where n is the number of cities
- Total: O(n² + m)

**Space Complexity: O(n²)**

- The degree array uses O(n) space
- The connection matrix uses O(n²) space (n × n boolean matrix)
- Total: O(n²)

For n ≤ 100, n² = 10,000 which is very manageable. The O(n²) pair checking is the bottleneck, but with n=100, 100² = 10,000 operations is trivial.

## Common Mistakes

1. **Double-counting the direct connection**: The most common error is forgetting to subtract 1 when two cities are directly connected. Remember: if city A connects to city B, that road contributes to both cities' degrees, but in the network rank calculation, it should only be counted once.

2. **Checking city pairs incorrectly**: Some candidates check pairs (i, j) and (j, i), effectively doubling the work. Always ensure j starts from i+1 to avoid redundant calculations.

3. **Using inefficient connection checking**: Checking if two cities are connected by scanning the roads list for each pair takes O(m) time per pair, making the overall solution O(n² × m). Always precompute connections in a lookup-optimized structure.

4. **Off-by-one with city indices**: Cities are 0-indexed (0 to n-1). Make sure your arrays are sized correctly and you're not trying to access index n.

## When You'll See This Pattern

This problem combines degree counting with pair-wise comparison, a pattern seen in several graph problems:

1. **Find the Town Judge (LeetCode 997)**: Similar degree counting where you track in-degrees and out-degrees to identify a special node.

2. **Minimum Degree of a Connected Trio in a Graph (LeetCode 1761)**: Also involves calculating degrees and checking connections between nodes, but for trios instead of pairs.

3. **Course Schedule (LeetCode 207)**: Uses degree counting (in-degree) in a directed graph to perform topological sorting.

The core pattern is: when you need to calculate something based on node connections in a graph, precompute node degrees and use an efficient data structure to check connections between specific nodes.

## Key Takeaways

1. **Precomputation is key**: When you need to repeatedly check node properties (like degree) or relationships (like connections), precompute them once at the beginning rather than recalculating for each pair.

2. **Choose the right data structure for lookups**: For dense graphs with small n, an adjacency matrix provides O(1) connection checks. For sparse graphs with large n, use adjacency lists with hash sets for O(1) average lookup.

3. **Understand what's being counted**: In network rank, we're counting unique roads. If two cities share a road, that road appears in both their degrees but should only be counted once in their combined rank.

[Practice this problem on CodeJeet](/problem/maximal-network-rank)
