---
title: "Bitmask Interview Questions: Patterns and Strategies"
description: "Master Bitmask problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-05-10"
category: "dsa-patterns"
tags: ["bitmask", "dsa", "interview prep"]
---

# Bitmask Interview Questions: Patterns and Strategies

You’re in an interview, cruising through a medium-difficulty problem, when the interviewer drops a variation that makes your stomach sink: “Now solve it for all subsets where each element can be in one of three states.” Or “Find the minimum cost to visit every city exactly once and return home.” You might recognize this as the Traveling Salesman Problem (TSP), but implementing it efficiently feels impossible. This is where bitmask dynamic programming separates the candidates who’ve memorized solutions from those who truly understand combinatorial state representation.

Bitmask problems are rare but disproportionately important—they appear in only about 1-2% of questions, but when they do, they’re almost always medium or hard difficulty. The data tells a clear story: of 41 bitmask questions on major platforms, 0% are easy, 29% are medium, and a whopping 71% are hard. This means if you encounter bitmask in an interview, you’re likely facing a significant challenge. Companies like Google, Amazon, Meta, and Microsoft use these problems precisely because they test multiple skills simultaneously: bit manipulation, dynamic programming, combinatorial reasoning, and space optimization.

## Common Patterns

### 1. Subset Enumeration with State Tracking

This is the most fundamental pattern. When you need to track which elements have been selected from a set of size n (where n ≤ 20-25 due to exponential complexity), bitmasks provide an elegant solution. Each bit represents whether an element is included (1) or excluded (0).

Consider **Maximum Product of Word Lengths (#318)**. The brute force approach compares every pair of words, checking for common letters—O(n² × L) where L is word length. With bitmasks, we precompute a 26-bit mask for each word (bit i set if the word contains letter i). Then checking for common letters becomes `(mask1 & mask2) == 0`, an O(1) operation.

<div class="code-group">

```python
# Time: O(n² + n×L) | Space: O(n)
def maxProduct(words):
    n = len(words)
    masks = [0] * n

    # Precompute bitmask for each word
    for i, word in enumerate(words):
        for ch in word:
            masks[i] |= 1 << (ord(ch) - ord('a'))

    max_prod = 0
    for i in range(n):
        for j in range(i + 1, n):
            # Check if words have no common letters
            if masks[i] & masks[j] == 0:
                max_prod = max(max_prod, len(words[i]) * len(words[j]))

    return max_prod
```

```javascript
// Time: O(n² + n×L) | Space: O(n)
function maxProduct(words) {
  const n = words.length;
  const masks = new Array(n).fill(0);

  // Precompute bitmask for each word
  for (let i = 0; i < n; i++) {
    for (const ch of words[i]) {
      masks[i] |= 1 << (ch.charCodeAt(0) - "a".charCodeAt(0));
    }
  }

  let maxProd = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Check if words have no common letters
      if ((masks[i] & masks[j]) === 0) {
        maxProd = Math.max(maxProd, words[i].length * words[j].length);
      }
    }
  }

  return maxProd;
}
```

```java
// Time: O(n² + n×L) | Space: O(n)
public int maxProduct(String[] words) {
    int n = words.length;
    int[] masks = new int[n];

    // Precompute bitmask for each word
    for (int i = 0; i < n; i++) {
        for (char ch : words[i].toCharArray()) {
            masks[i] |= 1 << (ch - 'a');
        }
    }

    int maxProd = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            // Check if words have no common letters
            if ((masks[i] & masks[j]) == 0) {
                maxProd = Math.max(maxProd, words[i].length() * words[j].length());
            }
        }
    }

    return maxProd;
}
```

</div>

**Other problems using this pattern:** Partition to K Equal Sum Subsets (#698), Find the Shortest Superstring (#943).

### 2. Dynamic Programming with Bitmask State

This is where bitmask shines for combinatorial optimization. The state `dp[mask]` represents the optimal solution for the subset represented by `mask`. This pattern is essential for solving NP-hard problems like TSP in O(n² × 2ⁿ) instead of O(n!).

For **Traveling Salesman Problem (similar to #847, #943)**, we want the shortest path visiting all nodes. Let `dp[mask][i]` = minimum distance to visit all cities in `mask` ending at city `i`. The recurrence: `dp[mask][i] = min(dp[prev_mask][j] + dist[j][i])` for all `j` in `prev_mask` where `prev_mask = mask without i`.

<div class="code-group">

```python
# Time: O(n² × 2ⁿ) | Space: O(n × 2ⁿ)
def shortestPathLength(graph):
    n = len(graph)
    target_mask = (1 << n) - 1  # All nodes visited
    dp = [[float('inf')] * n for _ in range(1 << n)]

    # Initialize: starting from each node
    for i in range(n):
        dp[1 << i][i] = 0

    # Iterate over all subsets
    for mask in range(1 << n):
        for i in range(n):
            if not (mask & (1 << i)):
                continue  # i not in current subset

            prev_mask = mask ^ (1 << i)  # Remove i from mask
            for j in range(n):
                if not (prev_mask & (1 << j)):
                    continue  # j not in previous subset

                if i in graph[j]:  # Edge exists
                    dp[mask][i] = min(dp[mask][i], dp[prev_mask][j] + 1)

    # Find minimum path visiting all nodes
    return min(dp[target_mask][i] for i in range(n))
```

```javascript
// Time: O(n² × 2ⁿ) | Space: O(n × 2ⁿ)
function shortestPathLength(graph) {
  const n = graph.length;
  const targetMask = (1 << n) - 1; // All nodes visited
  const dp = Array.from({ length: 1 << n }, () => new Array(n).fill(Infinity));

  // Initialize: starting from each node
  for (let i = 0; i < n; i++) {
    dp[1 << i][i] = 0;
  }

  // Iterate over all subsets
  for (let mask = 0; mask < 1 << n; mask++) {
    for (let i = 0; i < n; i++) {
      if (!(mask & (1 << i))) continue; // i not in current subset

      const prevMask = mask ^ (1 << i); // Remove i from mask
      for (let j = 0; j < n; j++) {
        if (!(prevMask & (1 << j))) continue; // j not in previous subset

        if (graph[j].includes(i)) {
          // Edge exists
          dp[mask][i] = Math.min(dp[mask][i], dp[prevMask][j] + 1);
        }
      }
    }
  }

  // Find minimum path visiting all nodes
  return Math.min(...dp[targetMask]);
}
```

```java
// Time: O(n² × 2ⁿ) | Space: O(n × 2ⁿ)
public int shortestPathLength(int[][] graph) {
    int n = graph.length;
    int targetMask = (1 << n) - 1;  // All nodes visited
    int[][] dp = new int[1 << n][n];

    // Initialize with infinity
    for (int i = 0; i < (1 << n); i++) {
        Arrays.fill(dp[i], Integer.MAX_VALUE / 2);
    }

    // Initialize: starting from each node
    for (int i = 0; i < n; i++) {
        dp[1 << i][i] = 0;
    }

    // Iterate over all subsets
    for (int mask = 0; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) == 0) continue;  // i not in current subset

            int prevMask = mask ^ (1 << i);  // Remove i from mask
            for (int j = 0; j < n; j++) {
                if ((prevMask & (1 << j)) == 0) continue;  // j not in previous subset

                // Check if edge exists (undirected graph)
                boolean hasEdge = false;
                for (int neighbor : graph[j]) {
                    if (neighbor == i) {
                        hasEdge = true;
                        break;
                    }
                }

                if (hasEdge) {
                    dp[mask][i] = Math.min(dp[mask][i], dp[prevMask][j] + 1);
                }
            }
        }
    }

    // Find minimum path visiting all nodes
    int result = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        result = Math.min(result, dp[targetMask][i]);
    }
    return result;
}
```

</div>

**Other problems using this pattern:** Campus Bikes II (#1066), Minimum Cost to Connect Two Groups of Points (#1595).

### 3. Bitmask BFS for State Space Search

When you need to find the shortest path in a state space where each state can be represented as a combination of binary choices, bitmask BFS is incredibly efficient. Each state becomes a node in the graph, and transitions flip bits according to rules.

**Shortest Path Visiting All Nodes (#847)** perfectly demonstrates this. We BFS over states `(mask, node)` where `mask` tracks visited nodes and `node` is the current position. This avoids exponential memory of storing all subsets separately.

<div class="code-group">

```python
# Time: O(n × 2ⁿ) | Space: O(n × 2ⁿ)
def shortestPathLength(graph):
    n = len(graph)
    target_mask = (1 << n) - 1
    visited = [[False] * n for _ in range(1 << n)]
    queue = deque()

    # Start BFS from each node
    for i in range(n):
        start_mask = 1 << i
        queue.append((start_mask, i, 0))  # (mask, node, distance)
        visited[start_mask][i] = True

    while queue:
        mask, node, dist = queue.popleft()

        if mask == target_mask:
            return dist

        for neighbor in graph[node]:
            new_mask = mask | (1 << neighbor)
            if not visited[new_mask][neighbor]:
                visited[new_mask][neighbor] = True
                queue.append((new_mask, neighbor, dist + 1))

    return -1  # Should never reach here for connected graphs
```

```javascript
// Time: O(n × 2ⁿ) | Space: O(n × 2ⁿ)
function shortestPathLength(graph) {
  const n = graph.length;
  const targetMask = (1 << n) - 1;
  const visited = Array.from({ length: 1 << n }, () => new Array(n).fill(false));
  const queue = [];

  // Start BFS from each node
  for (let i = 0; i < n; i++) {
    const startMask = 1 << i;
    queue.push([startMask, i, 0]); // [mask, node, distance]
    visited[startMask][i] = true;
  }

  while (queue.length > 0) {
    const [mask, node, dist] = queue.shift();

    if (mask === targetMask) {
      return dist;
    }

    for (const neighbor of graph[node]) {
      const newMask = mask | (1 << neighbor);
      if (!visited[newMask][neighbor]) {
        visited[newMask][neighbor] = true;
        queue.push([newMask, neighbor, dist + 1]);
      }
    }
  }

  return -1; // Should never reach here for connected graphs
}
```

```java
// Time: O(n × 2ⁿ) | Space: O(n × 2ⁿ)
public int shortestPathLength(int[][] graph) {
    int n = graph.length;
    int targetMask = (1 << n) - 1;
    boolean[][] visited = new boolean[1 << n][n];
    Queue<int[]> queue = new LinkedList<>();

    // Start BFS from each node
    for (int i = 0; i < n; i++) {
        int startMask = 1 << i;
        queue.offer(new int[]{startMask, i, 0});  // [mask, node, distance]
        visited[startMask][i] = true;
    }

    while (!queue.isEmpty()) {
        int[] current = queue.poll();
        int mask = current[0];
        int node = current[1];
        int dist = current[2];

        if (mask == targetMask) {
            return dist;
        }

        for (int neighbor : graph[node]) {
            int newMask = mask | (1 << neighbor);
            if (!visited[newMask][neighbor]) {
                visited[newMask][neighbor] = true;
                queue.offer(new int[]{newMask, neighbor, dist + 1});
            }
        }
    }

    return -1;  // Should never reach here for connected graphs
}
```

</div>

## When to Use Bitmask vs Alternatives

Recognizing when to reach for bitmask is crucial. Here are the decision criteria:

1. **Small n (≤ 25)**: Bitmask has O(2ⁿ) complexity, so it's only feasible for small sets. If n > 25, you need alternative approaches like greedy, backtracking with pruning, or approximation algorithms.

2. **Need to track subset membership**: When you need to know exactly which elements are selected/visited/used, and the order doesn't matter (or is tracked separately), bitmask is ideal. Alternatives:
   - **Backtracking with visited array**: Simpler but slower for checking state equality
   - **String representation of subset**: Much slower for operations and comparisons
   - **Set data structure**: Cleaner API but O(n) for operations vs O(1) for bitmask

3. **State compression in DP**: When your DP state includes which elements have been used, bitmask compresses that information into a single integer. Compare:
   - Bitmask DP: O(n × 2ⁿ) time, O(2ⁿ) space
   - Backtracking: O(n!) time in worst case
   - The tradeoff is exponential space for factorial time reduction

4. **Multiple states per element**: Sometimes each element can be in more than 2 states (e.g., 0/1/2). In these cases, you might use base-3 bitmask (tritmask) or two separate bitmasks. However, if states > 3, consider alternative representations.

**Rule of thumb**: If the problem asks about "all subsets," "minimum cost to visit all nodes," or "assigning tasks to workers" with n ≤ 20, think bitmask DP.

## Edge Cases and Gotchas

1. **Integer overflow with large masks**: When n ≥ 31, 1 << n overflows 32-bit integers. In Java and JavaScript, use `1L << n` (Java long) or BigInt. In Python, integers are arbitrary precision, so no issue.

2. **Off-by-one in mask iteration**: Always iterate `for mask in range(1 << n):` not `range(1 << n - 1)`. The total number of subsets is 2ⁿ, including the empty set.

3. **Empty set handling**: The empty mask (0) often needs special handling. In DP, `dp[0]` might represent the base case (no elements selected).

4. **Symmetry reduction**: Many bitmask DP problems have symmetry. For example, in TSP, the starting city doesn't matter for the cycle length. You can fix one city to reduce state space by factor n.

5. **Memory optimization with rolling arrays**: Since DP transitions often go from smaller masks to larger ones, you can use two arrays instead of 2ⁿ × n matrix. However, this complicates code—only optimize if necessary.

## Difficulty Breakdown

The 0% easy, 29% medium, 71% hard split tells a clear story: bitmask is an advanced topic. This distribution means:

- **If you see a bitmask problem in an interview, expect a challenge**
- **Medium problems** typically combine bitmask with another concept (like BFS or basic DP)
- **Hard problems** often involve multiple bitmasks, complex state transitions, or optimization tricks

For study prioritization: Master the medium problems first—they teach the core patterns. Then tackle hard problems to learn optimizations and edge cases. Don't waste time on "easy" bitmask problems—they don't exist.

## Which Companies Ask Bitmask

- **Google** (/company/google): Favors bitmask DP for optimization problems, especially related to scheduling or assignment. Often appears in onsite rounds.
- **Amazon** (/company/amazon): Leans toward practical applications like task assignment or resource allocation with bitmask state.
- **Meta** (/company/meta): Uses bitmask in graph problems (shortest path visiting nodes) and occasionally in backtracking optimization.
- **Microsoft** (/company/microsoft): Asks bitmask for combinatorial problems and sometimes in system design adjacent questions (like distributed task scheduling).
- **Infosys** (/company/infosys): When they ask bitmask, it's usually in harder technical interviews for specialized roles.

Each company has a style: Google tests if you can recognize the pattern; Amazon wants clean implementation; Meta focuses on optimization; Microsoft looks for mathematical insight.

## Study Tips

1. **Learn bit operations cold**: You should be able to write these without thinking:
   - Set bit: `mask |= (1 << i)`
   - Clear bit: `mask &= ~(1 << i)`
   - Toggle bit: `mask ^= (1 << i)`
   - Check bit: `(mask >> i) & 1`
   - Count set bits: use built-in or Brian Kernighan's algorithm

2. **Follow this problem order**:
   1. **Warm-up**: Maximum Product of Word Lengths (#318) - subset enumeration
   2. **Core DP**: Partition to K Equal Sum Subsets (#698) - bitmask DP
   3. **BFS**: Shortest Path Visiting All Nodes (#847) - bitmask BFS
   4. **Advanced**: Find the Shortest Superstring (#943) - multiple bitmask optimizations

3. **Practice state representation**: Given a problem, sketch the DP state definition on paper before coding. What does `dp[mask]` represent? What's the recurrence?

4. **Time yourself**: Bitmask problems often come late in interviews when time is short. Practice implementing the patterns in ≤20 minutes.

Bitmask questions test whether you can think in terms of state compression and combinatorial optimization. They're rare but high-leverage: mastering them can turn a "hard problem" into a pattern you recognize and implement confidently.

[Practice all Bitmask questions on CodeJeet](/topic/bitmask)
