---
title: "How to Solve Count Valid Paths in a Tree — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Valid Paths in a Tree. Hard difficulty, 36.0% acceptance rate. Topics: Math, Dynamic Programming, Tree, Depth-First Search, Number Theory."
date: "2026-06-03"
category: "dsa-patterns"
tags: ["count-valid-paths-in-a-tree", "math", "dynamic-programming", "tree", "hard"]
---

# How to Solve Count Valid Paths in a Tree

This problem asks us to count all valid paths in an undirected tree with `n` nodes. A path is valid if the greatest common divisor (GCD) of the node values along the path equals 1. What makes this problem challenging is that we need to efficiently count paths across the entire tree without checking every possible pair of nodes directly (which would be O(n²) and too slow for n up to 10⁵). The key insight is that we need to leverage number theory and tree traversal techniques to count paths in O(n log n) time.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider a tree with 5 nodes where the node values are [2, 3, 4, 5, 6]:

```
Node 1: value 2
Node 2: value 3
Node 3: value 4
Node 4: value 5
Node 5: value 6

Edges: 1-2, 1-3, 2-4, 2-5
```

We need to count all paths where the GCD of all node values along the path equals 1. Let's manually check a few paths:

- Path 1-2: GCD(2, 3) = 1 ✓ (valid)
- Path 1-3: GCD(2, 4) = 2 ✗ (invalid)
- Path 2-4: GCD(3, 5) = 1 ✓ (valid)
- Path 2-5: GCD(3, 6) = 3 ✗ (invalid)
- Path 1-2-4: GCD(2, 3, 5) = 1 ✓ (valid)
- Path 1-2-5: GCD(2, 3, 6) = 1 ✓ (valid)

The brute force approach would check all n(n-1)/2 = 10 possible paths in this small tree, but for n=10⁵, this would be 5×10⁹ operations - far too many.

## Brute Force Approach

The most straightforward solution would be to:

1. Generate all possible pairs of nodes (u, v) in the tree
2. For each pair, find the path between them (using DFS/BFS)
3. Compute the GCD of all node values along that path
4. Count how many have GCD = 1

The code would look something like this:

```python
def brute_force_count_valid_paths(n, edges, values):
    # Build adjacency list
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u-1].append(v-1)
        adj[v-1].append(u-1)

    # DFS to find path between two nodes
    def find_path(start, end):
        stack = [(start, [start])]
        visited = [False] * n
        visited[start] = True

        while stack:
            node, path = stack.pop()
            if node == end:
                return path

            for neighbor in adj[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    stack.append((neighbor, path + [neighbor]))
        return []

    count = 0
    # Check all pairs of nodes
    for i in range(n):
        for j in range(i+1, n):
            path = find_path(i, j)
            # Compute GCD of all nodes in path
            current_gcd = values[path[0]]
            for node in path[1:]:
                current_gcd = math.gcd(current_gcd, values[node])
                if current_gcd == 1:
                    break
            if current_gcd == 1:
                count += 1

    return count
```

**Why this fails:**

- Time complexity: O(n² × n) = O(n³) in worst case (finding path can take O(n) for each pair)
- Even with optimizations, checking all O(n²) pairs is impossible for n=10⁵
- We need a smarter approach that counts valid paths without explicitly checking each pair

## Optimized Approach

The key insight is to use the **inclusion-exclusion principle** with **Möbius inversion**. Instead of counting paths with GCD = 1 directly, we can:

1. Count paths where GCD is divisible by d (for various d)
2. Use Möbius function μ(d) to get the count of paths with GCD exactly equal to 1

**Step-by-step reasoning:**

1. **Observation**: If we fix a divisor d, we can consider only nodes whose values are divisible by d. These nodes form a forest (multiple disconnected components).

2. **Counting approach**: For each d from 1 to max_value:
   - Create a subgraph of nodes where value % d == 0
   - Count all paths within each connected component of this subgraph
   - This gives us count_d = number of paths where GCD is divisible by d

3. **Möbius inversion**: The number of paths with GCD exactly equal to 1 is:

   ```
   answer = Σ μ(d) * count_d for d = 1 to max_value
   ```

   where μ(d) is the Möbius function:
   - μ(1) = 1
   - μ(d) = 0 if d has a squared prime factor
   - μ(d) = (-1)^k if d is product of k distinct primes

4. **Efficient computation**:
   - Precompute Möbius function for all numbers up to max_value
   - For each d, we only need to process nodes divisible by d
   - Use DFS to find connected components in the filtered graph
   - For a component with k nodes, it contributes k\*(k-1)/2 paths

This approach works because:

- We process each edge only for divisors of both endpoint values
- The total work is O(n log n) due to harmonic series sum
- Möbius inversion correctly converts "divisible by d" counts to "exactly equal to 1" counts

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
from math import gcd
from collections import defaultdict

class Solution:
    def countValidPaths(self, n: int, edges: List[List[int]], values: List[int]) -> int:
        # Time: O(n log M) where M is max value
        # Space: O(n + M)

        # Build adjacency list (0-based indexing)
        adj = [[] for _ in range(n)]
        for u, v in edges:
            u -= 1  # Convert to 0-based
            v -= 1
            adj[u].append(v)
            adj[v].append(u)

        max_val = max(values)

        # Step 1: Precompute Möbius function using sieve
        mobius = [1] * (max_val + 1)
        is_prime = [True] * (max_val + 1)

        # Sieve to compute Möbius function
        for i in range(2, max_val + 1):
            if is_prime[i]:
                # Mark multiples of i
                for j in range(i, max_val + 1, i):
                    is_prime[j] = False
                    mobius[j] = -mobius[j]
                # Mark multiples of i^2
                i2 = i * i
                for j in range(i2, max_val + 1, i2):
                    mobius[j] = 0

        # Step 2: Group nodes by their divisors
        # nodes_by_divisor[d] = list of nodes where values[node] % d == 0
        nodes_by_divisor = defaultdict(list)
        for node in range(n):
            val = values[node]
            # Only consider divisors up to sqrt(val) for efficiency
            d = 1
            while d * d <= val:
                if val % d == 0:
                    nodes_by_divisor[d].append(node)
                    # Add the other divisor if different
                    other = val // d
                    if other != d:
                        nodes_by_divisor[other].append(node)
                d += 1

        # Step 3: Count paths for each divisor using DFS
        total_paths = 0
        visited = [False] * n

        for d in range(1, max_val + 1):
            if mobius[d] == 0:
                continue  # Skip if μ(d) = 0 (no contribution)

            # Mark nodes divisible by d as active
            active = [False] * n
            for node in nodes_by_divisor[d]:
                active[node] = True

            # Reset visited array for this divisor
            # We only visit active nodes
            for node in nodes_by_divisor[d]:
                visited[node] = False

            # DFS to find connected components among active nodes
            for start_node in nodes_by_divisor[d]:
                if not visited[start_node] and active[start_node]:
                    # Found a new component
                    stack = [start_node]
                    visited[start_node] = True
                    component_size = 0

                    while stack:
                        node = stack.pop()
                        component_size += 1

                        # Only traverse to neighbors that are also active
                        for neighbor in adj[node]:
                            if active[neighbor] and not visited[neighbor]:
                                visited[neighbor] = True
                                stack.append(neighbor)

                    # This component contributes C(component_size, 2) paths
                    # where GCD is divisible by d
                    paths_in_component = component_size * (component_size - 1) // 2
                    total_paths += mobius[d] * paths_in_component

        return total_paths
```

```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @param {number[]} values
 * @return {number}
 */
var countValidPaths = function (n, edges, values) {
  // Time: O(n log M) where M is max value
  // Space: O(n + M)

  // Build adjacency list (0-based indexing)
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u - 1].push(v - 1);
    adj[v - 1].push(u - 1);
  }

  const maxVal = Math.max(...values);

  // Step 1: Precompute Möbius function using sieve
  const mobius = new Array(maxVal + 1).fill(1);
  const isPrime = new Array(maxVal + 1).fill(true);

  // Sieve to compute Möbius function
  for (let i = 2; i <= maxVal; i++) {
    if (isPrime[i]) {
      // Mark multiples of i
      for (let j = i; j <= maxVal; j += i) {
        isPrime[j] = false;
        mobius[j] = -mobius[j];
      }
      // Mark multiples of i^2
      const i2 = i * i;
      for (let j = i2; j <= maxVal; j += i2) {
        mobius[j] = 0;
      }
    }
  }

  // Step 2: Group nodes by their divisors
  // nodesByDivisor[d] = list of nodes where values[node] % d == 0
  const nodesByDivisor = new Map();
  for (let node = 0; node < n; node++) {
    const val = values[node];
    // Only consider divisors up to sqrt(val) for efficiency
    for (let d = 1; d * d <= val; d++) {
      if (val % d === 0) {
        if (!nodesByDivisor.has(d)) nodesByDivisor.set(d, []);
        nodesByDivisor.get(d).push(node);

        // Add the other divisor if different
        const other = val / d;
        if (other !== d) {
          if (!nodesByDivisor.has(other)) nodesByDivisor.set(other, []);
          nodesByDivisor.get(other).push(node);
        }
      }
    }
  }

  // Step 3: Count paths for each divisor using DFS
  let totalPaths = 0;
  const visited = new Array(n).fill(false);

  for (let d = 1; d <= maxVal; d++) {
    if (mobius[d] === 0) continue; // Skip if μ(d) = 0 (no contribution)

    // Get nodes divisible by d, or empty array if none
    const nodes = nodesByDivisor.get(d) || [];

    // Mark nodes divisible by d as active
    const active = new Array(n).fill(false);
    for (const node of nodes) {
      active[node] = true;
    }

    // Reset visited array for this divisor
    // We only visit active nodes
    for (const node of nodes) {
      visited[node] = false;
    }

    // DFS to find connected components among active nodes
    for (const startNode of nodes) {
      if (!visited[startNode] && active[startNode]) {
        // Found a new component
        const stack = [startNode];
        visited[startNode] = true;
        let componentSize = 0;

        while (stack.length > 0) {
          const node = stack.pop();
          componentSize++;

          // Only traverse to neighbors that are also active
          for (const neighbor of adj[node]) {
            if (active[neighbor] && !visited[neighbor]) {
              visited[neighbor] = true;
              stack.push(neighbor);
            }
          }
        }

        // This component contributes C(componentSize, 2) paths
        // where GCD is divisible by d
        const pathsInComponent = (componentSize * (componentSize - 1)) / 2;
        totalPaths += mobius[d] * pathsInComponent;
      }
    }
  }

  return totalPaths;
};
```

```java
class Solution {
    public long countValidPaths(int n, int[][] edges, int[] values) {
        // Time: O(n log M) where M is max value
        // Space: O(n + M)

        // Build adjacency list (0-based indexing)
        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            adj[i] = new ArrayList<>();
        }
        for (int[] edge : edges) {
            int u = edge[0] - 1; // Convert to 0-based
            int v = edge[1] - 1;
            adj[u].add(v);
            adj[v].add(u);
        }

        int maxVal = 0;
        for (int val : values) {
            maxVal = Math.max(maxVal, val);
        }

        // Step 1: Precompute Möbius function using sieve
        int[] mobius = new int[maxVal + 1];
        boolean[] isPrime = new boolean[maxVal + 1];
        Arrays.fill(mobius, 1);
        Arrays.fill(isPrime, true);

        // Sieve to compute Möbius function
        for (int i = 2; i <= maxVal; i++) {
            if (isPrime[i]) {
                // Mark multiples of i
                for (int j = i; j <= maxVal; j += i) {
                    isPrime[j] = false;
                    mobius[j] = -mobius[j];
                }
                // Mark multiples of i^2
                int i2 = i * i;
                for (int j = i2; j <= maxVal; j += i2) {
                    mobius[j] = 0;
                }
            }
        }

        // Step 2: Group nodes by their divisors
        // nodesByDivisor[d] = list of nodes where values[node] % d == 0
        List<Integer>[] nodesByDivisor = new ArrayList[maxVal + 1];
        for (int i = 0; i <= maxVal; i++) {
            nodesByDivisor[i] = new ArrayList<>();
        }

        for (int node = 0; node < n; node++) {
            int val = values[node];
            // Only consider divisors up to sqrt(val) for efficiency
            for (int d = 1; d * d <= val; d++) {
                if (val % d == 0) {
                    nodesByDivisor[d].add(node);
                    // Add the other divisor if different
                    int other = val / d;
                    if (other != d) {
                        nodesByDivisor[other].add(node);
                    }
                }
            }
        }

        // Step 3: Count paths for each divisor using DFS
        long totalPaths = 0;
        boolean[] visited = new boolean[n];

        for (int d = 1; d <= maxVal; d++) {
            if (mobius[d] == 0) {
                continue; // Skip if μ(d) = 0 (no contribution)
            }

            // Mark nodes divisible by d as active
            boolean[] active = new boolean[n];
            for (int node : nodesByDivisor[d]) {
                active[node] = true;
            }

            // Reset visited array for this divisor
            // We only visit active nodes
            for (int node : nodesByDivisor[d]) {
                visited[node] = false;
            }

            // DFS to find connected components among active nodes
            for (int startNode : nodesByDivisor[d]) {
                if (!visited[startNode] && active[startNode]) {
                    // Found a new component
                    Stack<Integer> stack = new Stack<>();
                    stack.push(startNode);
                    visited[startNode] = true;
                    int componentSize = 0;

                    while (!stack.isEmpty()) {
                        int node = stack.pop();
                        componentSize++;

                        // Only traverse to neighbors that are also active
                        for (int neighbor : adj[node]) {
                            if (active[neighbor] && !visited[neighbor]) {
                                visited[neighbor] = true;
                                stack.push(neighbor);
                            }
                        }
                    }

                    // This component contributes C(componentSize, 2) paths
                    // where GCD is divisible by d
                    long pathsInComponent = (long) componentSize * (componentSize - 1) / 2;
                    totalPaths += mobius[d] * pathsInComponent;
                }
            }
        }

        return totalPaths;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log M)**

- M is the maximum node value (up to 10⁵)
- Precomputing Möbius function: O(M log log M) using sieve
- Grouping nodes by divisors: Each node's value has O(√val) divisors, so total O(n √M) in worst case, but with optimizations it's O(n log M)
- DFS for each divisor: Each edge is processed only for divisors common to both endpoints. The total work across all divisors is O(n log M) due to the harmonic series sum

**Space Complexity: O(n + M)**

- O(n) for adjacency list, visited arrays, and active arrays
- O(M) for Möbius array and nodesByDivisor structure
- Total: O(n + M) which is acceptable for n, M ≤ 10⁵

## Common Mistakes

1. **Forgetting to convert to 0-based indexing**: The problem uses 1-based node labels, but most implementations work better with 0-based. Always convert at the beginning.

2. **Not handling μ(d) = 0 correctly**: When a number has a squared prime factor, μ(d) = 0 and contributes nothing. Skipping these cases improves performance.

3. **Inefficient divisor enumeration**: Checking all numbers up to maxVal for each node is O(nM), which is too slow. Only check divisors up to √val for each node.

4. **Double-counting paths**: When using inclusion-exclusion, ensure you're correctly applying Möbius inversion. The formula is Σ μ(d) \* count_d, not other variations.

5. **Integer overflow**: The number of paths can be large (up to ~5×10⁹ for n=10⁵). Use 64-bit integers (long in Java/C++, long long in C).

## When You'll See This Pattern

This problem combines several advanced techniques:

1. **Möbius inversion**: Used in number theory problems where you need to count objects with gcd=1. Similar problems:
   - "Count the Number of Good Subarrays" (LeetCode 2537)
   - "Count Pairs With GCD K" (LeetCode 2446)

2. **Tree DP with number theory**: When you need to count paths in a tree based on node values. Similar problems:
   - "Count Paths That Can Form a Palindrome in a Tree" (LeetCode 2846)
   - "Tree of Coprimes" (LeetCode 2842)

3. **Inclusion-exclusion on divisors**: When direct counting is hard but counting "divisible by d" is easier. This pattern appears in many combinatorics problems involving gcd constraints.

## Key Takeaways

1. **Möbius inversion is powerful for gcd=1 problems**: When you need to count pairs/paths with gcd=1, consider counting pairs with gcd divisible by d first, then use μ(d) to get the exact count.

2. **Process by divisors, not by nodes**: Instead of checking all O(n²) pairs, process by possible gcd values. This reduces the problem to finding connected components in filtered graphs.

3. **Tree structure enables efficient component finding**: In a tree, finding connected components after filtering is O(n) per divisor using DFS, and each edge is processed only for common divisors of its endpoints.

4. **Optimize divisor enumeration**: Use sqrt decomposition when finding all divisors of a number to avoid O(n) per node.

Related problems: [Count Paths That Can Form a Palindrome in a Tree](/problem/count-paths-that-can-form-a-palindrome-in-a-tree)
