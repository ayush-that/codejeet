---
title: "How to Crack Uber Coding Interviews in 2026"
description: "Complete guide to Uber coding interviews — question patterns, difficulty breakdown, must-practice topics, and preparation strategy."
date: "2026-06-19"
category: "company-guide"
company: "uber"
tags: ["uber", "interview prep", "leetcode"]
---

Uber's coding interview is demanding, and its reputation for asking hard problems is well-earned. The typical process includes a recruiter call, one technical phone screen, and an on-site loop of four to five rounds. Coding rounds are 45 to 50 minutes each, and you will usually tackle one problem per round — but that single problem is often challenging enough to fill the entire time. Uber's engineering culture prizes strong algorithmic thinking and the ability to build systems that operate at massive scale. Their interview problems reflect this: you will see questions that involve graph algorithms, optimization, and real-world modeling of ride-sharing, routing, or marketplace dynamics.

Uber has a relatively small but difficult question pool, meaning the problems they ask tend to be curated for depth rather than breadth. This works in your favor if you prepare strategically — there is less ground to cover, but what you do cover needs to be thorough.

## By the Numbers

Uber's question bank has **381 questions**, similar in size to TikTok's. The difficulty split is notably tough:

- **Easy: 54 questions (14%)**
- **Medium: 224 questions (59%)**
- **Hard: 103 questions (27%)**

A 27% hard rate is the highest among the companies in this guide — more than one in four problems you might encounter is a hard-level question. Combined with only 14% easy questions, this paints a clear picture: Uber's interview skews significantly harder than average. If you can only solve medium problems reliably, you will need to level up before interviewing at Uber.

## Top Topics to Focus On

**Arrays** — Array problems at Uber often involve complex manipulation: merging, partitioning, and multi-step transformations. Many of these problems model real scenarios — processing sequences of rides, calculating optimal routes, or managing time-series data. A classic pattern is using two pointers for in-place operations or sliding windows for subarray problems. You must also be comfortable with sorting and binary search on transformed arrays.

**Hash Tables** — Efficient lookups and state tracking via hash maps are critical for Uber problems. Many of Uber's harder problems become tractable only with the right hash-based data structure. Practice problems that require building custom lookup structures or using multiple hash maps in tandem. Common uses include frequency counting, memoization for dynamic programming, and storing graph adjacency lists for quick access.

**Strings** — String problems at Uber tend to be medium-to-hard and often involve parsing structured data, pattern matching, or transformation chains. These are not the simple string reversal problems you see elsewhere. You'll need to master techniques like building character frequency maps, using tries for prefix/suffix searches, and applying dynamic programming for edit distance or palindrome problems.

**Dynamic Programming** — DP appears heavily at Uber, and the problems are not always the standard textbook variants. You may encounter DP problems that require graph-aware states, multi-dimensional recurrences, or non-obvious subproblem definitions. Uber's DP problems reward deep conceptual understanding. It's crucial to practice identifying overlapping subproblems and optimal substructure in complex scenarios.

**Breadth-First Search** — BFS stands out in Uber's top topics for a clear reason: Uber's domain is fundamentally about graphs, routes, and shortest paths. BFS-based problems — shortest path in unweighted graphs, multi-source BFS, level-order traversals, and state-space search — appear more frequently at Uber than at most other companies. You must be able to implement BFS iteratively with a queue and handle visited states efficiently.

## Preparation Strategy

**Weeks 1-2: Core Data Structures at a High Level.** Skip easy problems entirely. Start with medium-difficulty arrays, strings, and hash table problems. Solve 6-8 problems per day. Focus on problems that require multiple techniques — for example, array problems that combine sorting with two pointers, or string problems that require hash maps for optimization. By the end of week two, you should be solving mediums in under 20 minutes consistently.

**Week 3: Graph Algorithms Deep Dive.** This is arguably the most important week for Uber preparation. Cover BFS, DFS, Dijkstra's algorithm, topological sort, union-find, and connected components thoroughly. Solve at least 30 graph problems, including 10 hard ones. Pay special attention to shortest path problems and problems that model real-world networks or grids. Practice building adjacency lists from various input formats.

**Week 4: Dynamic Programming.** Cover standard patterns first (1D, 2D, knapsack, LIS) and then move to advanced patterns (interval DP, DP on graphs, DP with bitmasks). Solve at least 25 DP problems, targeting medium-to-hard difficulty. For each problem, practice articulating why DP is the right approach before jumping into the recurrence. Draw the state transition diagram to visualize dependencies.

**Week 5: Hard Problem Training.** With 27% of Uber's problems being hard, you need dedicated practice at this difficulty level. Solve 4-5 hard problems per day from mixed topics. Focus on problems that combine multiple concepts — graph + DP, binary search + greedy, or tree + hash map. The goal is to build resilience when facing unfamiliar hard problems. Time yourself strictly to mimic interview pressure.

**Week 6: Mock Interviews and System Design.** Run mock interviews with hard problems, simulating Uber's 45-50 minute format. For senior roles, prepare system design for Uber-specific scenarios: design a ride-matching system, a surge pricing engine, a real-time location tracking service, or a driver dispatch system. These are not just hypothetical — they are the systems Uber actually builds.

## Key Tips

1. **Invest heavily in graph algorithms.** Uber's domain is inherently graph-based. BFS, DFS, shortest paths, and connected components are not just interview topics — they are the foundation of what Uber engineers work on. Be exceptionally strong here.

2. **Build comfort with hard problems.** With the highest hard percentage of any company in this guide, you cannot afford to freeze when you see a problem you do not immediately recognize. Practice working through confusion methodically: identify what you know, what you need, and try multiple approaches.

3. **Think about scale in your answers.** Uber operates at massive scale — millions of concurrent users, billions of events per day. When discussing your solution, mention how it would perform at scale. Interviewers notice when candidates think beyond the algorithm. Consider time and space complexity in terms of large `n`.

4. **Practice multi-step problem solving.** Uber problems often have multiple layers. You solve the core algorithm, then the interviewer adds a constraint or changes the input format. Practice problems where you first solve a simpler version and then extend it. This demonstrates adaptability.

5. **Do not ignore BFS as a problem-solving framework.** Many candidates default to DFS for traversal problems, but BFS is often the more natural fit for Uber-style problems involving shortest paths, level-by-level processing, or minimum operations. Make BFS your first instinct for these types of problems.

## Practical Code Examples

Let's look at concrete implementations for some of the core algorithms emphasized for Uber interviews.

### Breadth-First Search (BFS) for Shortest Path in a Grid

A common Uber problem involves finding the shortest path in a 2D grid, which models city streets or a map. BFS is ideal for unweighted grids.

<div class="code-group">

```python
from collections import deque

def shortest_path_in_grid(grid, start, end):
    """
    grid: 2D list where 0 = traversable, 1 = obstacle
    start: (row, col) tuple
    end: (row, col) tuple
    Returns the minimum number of steps, or -1 if unreachable.
    """
    if not grid or grid[start[0]][start[1]] == 1 or grid[end[0]][end[1]] == 1:
        return -1

    rows, cols = len(grid), len(grid[0])
    directions = [(1,0), (-1,0), (0,1), (0,-1)]  # Down, Up, Right, Left
    queue = deque([(start[0], start[1], 0)])  # (row, col, distance)
    visited = set()
    visited.add((start[0], start[1]))

    while queue:
        row, col, dist = queue.popleft()
        if (row, col) == end:
            return dist

        for dr, dc in directions:
            new_r, new_c = row + dr, col + dc
            if (0 <= new_r < rows and 0 <= new_c < cols and
                grid[new_r][new_c] == 0 and (new_r, new_c) not in visited):
                visited.add((new_r, new_c))
                queue.append((new_r, new_c, dist + 1))
    return -1
```

```javascript
function shortestPathInGrid(grid, start, end) {
  // grid: 2D array where 0 = traversable, 1 = obstacle
  // start: [row, col]
  // end: [row, col]
  // Returns the minimum number of steps, or -1 if unreachable.
  if (!grid || grid[start[0]][start[1]] === 1 || grid[end[0]][end[1]] === 1) {
    return -1;
  }

  const rows = grid.length;
  const cols = grid[0].length;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]; // Down, Up, Right, Left
  const queue = [[start[0], start[1], 0]]; // [row, col, distance]
  const visited = new Set();
  visited.add(`${start[0]},${start[1]}`);

  while (queue.length > 0) {
    const [row, col, dist] = queue.shift();
    if (row === end[0] && col === end[1]) {
      return dist;
    }

    for (const [dr, dc] of directions) {
      const newR = row + dr;
      const newC = col + dc;
      const key = `${newR},${newC}`;
      if (
        newR >= 0 &&
        newR < rows &&
        newC >= 0 &&
        newC < cols &&
        grid[newR][newC] === 0 &&
        !visited.has(key)
      ) {
        visited.add(key);
        queue.push([newR, newC, dist + 1]);
      }
    }
  }
  return -1;
}
```

```java
import java.util.*;

public class GridBFS {
    public int shortestPathInGrid(int[][] grid, int[] start, int[] end) {
        // grid: 2D array where 0 = traversable, 1 = obstacle
        // start: [row, col]
        // end: [row, col]
        // Returns the minimum number of steps, or -1 if unreachable.
        if (grid == null || grid.length == 0 || grid[start[0]][start[1]] == 1 || grid[end[0]][end[1]] == 1) {
            return -1;
        }

        int rows = grid.length;
        int cols = grid[0].length;
        int[][] directions = {{1,0}, {-1,0}, {0,1}, {0,-1}}; // Down, Up, Right, Left
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{start[0], start[1], 0}); // [row, col, distance]
        boolean[][] visited = new boolean[rows][cols];
        visited[start[0]][start[1]] = true;

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int row = current[0];
            int col = current[1];
            int dist = current[2];

            if (row == end[0] && col == end[1]) {
                return dist;
            }

            for (int[] dir : directions) {
                int newR = row + dir[0];
                int newC = col + dir[1];
                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols &&
                    grid[newR][newC] == 0 && !visited[newR][newC]) {
                    visited[newR][newC] = true;
                    queue.offer(new int[]{newR, newC, dist + 1});
                }
            }
        }
        return -1;
    }
}
```

</div>

### Dynamic Programming: Coin Change (Minimum Coins)

This is a classic DP problem that models optimization, similar to finding the minimum number of actions (like driver moves) to reach a target. The recurrence relation is `dp[amount] = min(dp[amount], 1 + dp[amount - coin])`.

<div class="code-group">

```python
def coin_change_min_coins(coins, amount):
    """
    coins: List of coin denominations (positive integers)
    amount: Target amount
    Returns the fewest number of coins needed, or -1 if impossible.
    """
    # Initialize DP array with a value larger than any possible solution
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins needed for amount 0

    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], 1 + dp[i - coin])

    return dp[amount] if dp[amount] != float('inf') else -1
```

```javascript
function coinChangeMinCoins(coins, amount) {
  // coins: Array of coin denominations (positive integers)
  // amount: Target amount
  // Returns the fewest number of coins needed, or -1 if impossible.
  // Initialize DP array with Infinity
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // Base case

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
      }
    }
  }
  return dp[amount] !== Infinity ? dp[amount] : -1;
}
```

```java
import java.util.Arrays;

public class CoinChangeDP {
    public int coinChangeMinCoins(int[] coins, int amount) {
        // coins: Array of coin denominations (positive integers)
        // amount: Target amount
        // Returns the fewest number of coins needed, or -1 if impossible.
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1); // Use amount+1 as a sentinel for "infinity"
        dp[0] = 0; // Base case

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
```

</div>

### Hash Table: Two Sum with Indices

A fundamental hash table problem that demonstrates efficient lookup. At Uber, this might be extended to finding pairs of rides or locations that meet certain criteria.

<div class="code-group">

```python
def two_sum_indices(nums, target):
    """
    nums: List of integers
    target: Target sum
    Returns a list of two indices such that nums[i] + nums[j] = target.
    Assumes exactly one solution exists.
    """
    num_to_index = {}  # Hash map: value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_to_index:
            return [num_to_index[complement], i]
        num_to_index[num] = i
    return []  # Should not be reached per problem assumption
```

```javascript
function twoSumIndices(nums, target) {
  // nums: Array of integers
  // target: Target sum
  // Returns an array of two indices such that nums[i] + nums[j] = target.
  // Assumes exactly one solution exists.
  const numToIndex = new Map(); // Hash map: value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numToIndex.has(complement)) {
      return [numToIndex.get(complement), i];
    }
    numToIndex.set(nums[i], i);
  }
  return []; // Should not be reached per problem assumption
}
```

```java
import java.util.*;

public class TwoSumHash {
    public int[] twoSumIndices(int[] nums, int target) {
        // nums: Array of integers
        // target: Target sum
        // Returns an array of two indices such that nums[i] + nums[j] = target.
        // Assumes exactly one solution exists.
        Map<Integer, Integer> numToIndex = new HashMap<>(); // Hash map: value -> index
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numToIndex.containsKey(complement)) {
                return new int[]{numToIndex.get(complement), i};
            }
            numToIndex.put(nums[i], i);
        }
        return new int[]{}; // Should not be reached per problem assumption
    }
}
```

</div>

### Advanced: Dijkstra's Algorithm for Weighted Graphs

For ride-sharing, shortest path often involves weighted edges (travel time, distance). Dijkstra's algorithm is essential. Here's a basic implementation using a priority queue.

<div class="code-group">

```python
import heapq

def dijkstra_shortest_path(graph, start):
    """
    graph: adjacency list as dict {node: [(neighbor, weight), ...]}
    start: starting node
    Returns a dict of shortest distances from start to all other nodes.
    """
    # Initialize distances with infinity
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    # Priority queue: (distance, node)
    pq = [(0, start)]

    while pq:
        current_dist, current_node = heapq.heappop(pq)
        # If we found a better path already, skip
        if current_dist > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node]:
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    return distances
```

```javascript
function dijkstraShortestPath(graph, start) {
  // graph: adjacency list as Map {node: [[neighbor, weight], ...]}
  // start: starting node
  // Returns a Map of shortest distances from start to all other nodes.
  const distances = new Map();
  for (const node of graph.keys()) {
    distances.set(node, Infinity);
  }
  distances.set(start, 0);

  // Priority queue as a min-heap (simulated with array and sorting)
  const pq = [[0, start]]; // [distance, node]

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]); // Simple sort for demonstration (inefficient for large graphs)
    const [currentDist, currentNode] = pq.shift();

    // If we found a better path already, skip
    if (currentDist > distances.get(currentNode)) {
      continue;
    }

    const neighbors = graph.get(currentNode) || [];
    for (const [neighbor, weight] of neighbors) {
      const distance = currentDist + weight;
      if (distance < distances.get(neighbor)) {
        distances.set(neighbor, distance);
        pq.push([distance, neighbor]);
      }
    }
  }
  return distances;
}
```

```java
import java.util.*;

public class DijkstraAlgorithm {
    public Map<Integer, Integer> dijkstraShortestPath(Map<Integer, List<int[]>> graph, int start) {
        // graph: adjacency list as Map<Integer, List<int[]>> where int[] is [neighbor, weight]
        // start: starting node
        // Returns a Map of shortest distances from start to all other nodes.
        Map<Integer, Integer> distances = new HashMap<>();
        for (int node : graph.keySet()) {
            distances.put(node, Integer.MAX_VALUE);
        }
        distances.put(start, 0);

        // Priority queue: (distance, node)
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.offer(new int[]{0, start});

        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int currentDist = current[0];
            int currentNode = current[1];

            // If we found a better path already, skip
            if (currentDist > distances.get(currentNode)) {
                continue;
            }

            List<int[]> neighbors = graph.getOrDefault(currentNode, new ArrayList<>());
            for (int[] edge : neighbors) {
                int neighbor = edge[0];
                int weight = edge[1];
                int distance = currentDist + weight;
                if (distance < distances.get(neighbor)) {
                    distances.put(neighbor, distance);
                    pq.offer(new int[]{distance, neighbor});
                }
            }
        }
        return distances;
    }
}
```

</div>

## Final Thoughts

Uber's interview process is designed to identify engineers who can handle complex, scalable problems. Success requires a deep, practical understanding of algorithms—especially graphs and dynamic programming—and the ability to translate real-world scenarios into code. Use the preparation strategy and code examples above to build the muscle memory needed to tackle their challenging problems. Remember to always discuss the scalability implications of your solution, as this demonstrates the systems thinking Uber values.

[Browse all Uber questions on CodeJeet](/company/uber)
