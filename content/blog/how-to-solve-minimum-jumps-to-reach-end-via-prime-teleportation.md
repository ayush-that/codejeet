---
title: "How to Solve Minimum Jumps to Reach End via Prime Teleportation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Jumps to Reach End via Prime Teleportation. Medium difficulty, 31.8% acceptance rate. Topics: Array, Hash Table, Math, Breadth-First Search, Number Theory."
date: "2029-07-17"
category: "dsa-patterns"
tags:
  ["minimum-jumps-to-reach-end-via-prime-teleportation", "array", "hash-table", "math", "medium"]
---

# How to Solve Minimum Jumps to Reach End via Prime Teleportation

This problem combines graph traversal with number theory in a clever way. You're given an array and need to reach the last index using two types of moves: adjacent steps (forward/backward) and teleportation to indices with the same prime factors. The challenge is that teleportation creates non-local connections between indices, making this a graph search problem where nodes can be connected in unexpected ways.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 3, 4, 5, 6]`

**Step 1: Understanding the moves**

- From index 0 (value 2, prime factor 2):
  - Adjacent: can go to index 1
  - Teleport: can go to any index with value sharing prime factor 2 (indices 2 and 4)
- From index 1 (value 3, prime factor 3):
  - Adjacent: indices 0 and 2
  - Teleport: indices 4 (value 6 has prime factor 3)

**Step 2: Finding the shortest path**
Starting at index 0:

- Level 0: {0}
- Level 1: From 0 → {1 (adjacent), 2 (teleport), 4 (teleport)}
- Level 2: From 1 → {0 (already visited), 2 (adjacent), 4 (teleport)}
  From 2 → {1, 3 (adjacent), 0 (teleport? no, 0 has prime factor 2, 4 has 2)}
  From 4 → {3 (adjacent), 5 (out of bounds), 0 (teleport), 2 (teleport)}

We reach index 4 at level 1, but need index 4 (last index). Actually, last index is 4 (n-1 = 4). So minimum jumps = 1.

The key insight: we need to track both index positions AND their prime factor connections efficiently.

## Brute Force Approach

A naive approach would be to treat this as a graph where each index connects to:

1. i+1 and i-1 (if valid)
2. All indices j where nums[i] and nums[j] share at least one prime factor

The brute force BFS would work like this:

- Start BFS from index 0
- For each node, explore all adjacent indices
- For teleportation, scan the entire array to find indices with shared prime factors

**Why this fails:**
The teleportation check requires O(n) per node, making overall complexity O(n²) in the worst case. With n up to 10⁵, this is far too slow. We need a way to find teleportation targets without scanning the entire array each time.

## Optimized Approach

The key optimization is to precompute a mapping from prime factors to all indices containing that factor. This turns the expensive O(n) teleportation scan into O(1) lookup for each prime factor.

**Step-by-step reasoning:**

1. **Prime Factorization**: For each number, find its unique prime factors. We only need distinct primes since multiple copies of the same prime don't give additional teleportation options.

2. **Build Factor-to-Indices Map**: Create a hash map where keys are prime factors and values are lists of indices containing that factor.

3. **BFS with Smart Teleportation**: During BFS:
   - From current index i, get all prime factors of nums[i]
   - For each prime factor, look up all indices that share this factor
   - Mark these indices as visited and add to queue
   - **Crucial**: After using a prime factor, clear its list to avoid redundant processing. Once all indices with a prime factor are discovered, we don't need to check them again.

4. **Avoid Revisiting**: Maintain two visited sets:
   - Visited indices (standard BFS visited)
   - Used prime factors (to avoid reprocessing the same teleportation groups)

This approach ensures each index and each prime factor is processed at most once.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * sqrt(M)) where M is max(nums[i]) | Space: O(n + P) where P is total prime factors
from collections import deque, defaultdict
import math

def minJumps(nums):
    n = len(nums)
    if n == 1:
        return 0

    # Step 1: Precompute prime factors for each number
    # We'll store them in a list of sets for O(1) lookup
    prime_factors = [set() for _ in range(n)]

    # Helper function to get distinct prime factors
    def get_prime_factors(x):
        factors = set()
        # Check divisibility by 2 separately
        while x % 2 == 0:
            factors.add(2)
            x //= 2

        # Check odd divisors up to sqrt(x)
        for i in range(3, int(math.sqrt(x)) + 1, 2):
            while x % i == 0:
                factors.add(i)
                x //= i

        # If x is still > 1, it's a prime factor
        if x > 1:
            factors.add(x)

        return factors

    # Step 2: Build factor-to-indices mapping
    factor_to_indices = defaultdict(list)

    for i, num in enumerate(nums):
        factors = get_prime_factors(num)
        prime_factors[i] = factors

        # Add index to each prime factor's list
        for factor in factors:
            factor_to_indices[factor].append(i)

    # Step 3: BFS to find shortest path
    queue = deque([0])
    visited = [False] * n
    visited[0] = True
    steps = 0

    while queue:
        # Process all nodes at current distance
        level_size = len(queue)
        for _ in range(level_size):
            current = queue.popleft()

            # If we reached the last index, return steps
            if current == n - 1:
                return steps

            # Option 1: Move to adjacent indices
            for neighbor in [current - 1, current + 1]:
                if 0 <= neighbor < n and not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)

            # Option 2: Teleport to indices with same prime factors
            for factor in prime_factors[current]:
                # Get all indices sharing this factor
                if factor in factor_to_indices:
                    for idx in factor_to_indices[factor]:
                        if not visited[idx]:
                            visited[idx] = True
                            queue.append(idx)

                    # Clear this factor's list to avoid reprocessing
                    # This is crucial for efficiency
                    del factor_to_indices[factor]

        steps += 1

    return -1  # Should never reach here for valid inputs
```

```javascript
// Time: O(n * sqrt(M)) where M is max(nums[i]) | Space: O(n + P) where P is total prime factors
function minJumps(nums) {
  const n = nums.length;
  if (n === 1) return 0;

  // Helper function to get distinct prime factors
  function getPrimeFactors(x) {
    const factors = new Set();

    // Handle factor 2 separately
    while (x % 2 === 0) {
      factors.add(2);
      x = Math.floor(x / 2);
    }

    // Check odd factors up to sqrt(x)
    for (let i = 3; i <= Math.sqrt(x); i += 2) {
      while (x % i === 0) {
        factors.add(i);
        x = Math.floor(x / i);
      }
    }

    // If x > 1, it's a prime factor
    if (x > 1) {
      factors.add(x);
    }

    return factors;
  }

  // Step 1: Precompute prime factors and build mapping
  const primeFactors = new Array(n);
  const factorToIndices = new Map();

  for (let i = 0; i < n; i++) {
    const factors = getPrimeFactors(nums[i]);
    primeFactors[i] = factors;

    // Add index to each factor's list
    for (const factor of factors) {
      if (!factorToIndices.has(factor)) {
        factorToIndices.set(factor, []);
      }
      factorToIndices.get(factor).push(i);
    }
  }

  // Step 2: BFS to find shortest path
  const queue = [0];
  const visited = new Array(n).fill(false);
  visited[0] = true;
  let steps = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const current = queue.shift();

      // Check if we reached the target
      if (current === n - 1) {
        return steps;
      }

      // Option 1: Move to adjacent indices
      const neighbors = [current - 1, current + 1];
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && neighbor < n && !visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      }

      // Option 2: Teleport to indices with same prime factors
      for (const factor of primeFactors[current]) {
        if (factorToIndices.has(factor)) {
          const indices = factorToIndices.get(factor);

          for (const idx of indices) {
            if (!visited[idx]) {
              visited[idx] = true;
              queue.push(idx);
            }
          }

          // Clear to avoid reprocessing - crucial for efficiency
          factorToIndices.delete(factor);
        }
      }
    }

    steps++;
  }

  return -1; // Should never reach here for valid inputs
}
```

```java
// Time: O(n * sqrt(M)) where M is max(nums[i]) | Space: O(n + P) where P is total prime factors
import java.util.*;

public class Solution {
    public int minJumps(int[] nums) {
        int n = nums.length;
        if (n == 1) return 0;

        // Step 1: Precompute prime factors for each number
        List<Set<Integer>> primeFactors = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            primeFactors.add(new HashSet<>());
        }

        // Map from prime factor to list of indices
        Map<Integer, List<Integer>> factorToIndices = new HashMap<>();

        for (int i = 0; i < n; i++) {
            int num = nums[i];
            Set<Integer> factors = getPrimeFactors(num);
            primeFactors.set(i, factors);

            // Add index to each factor's list
            for (int factor : factors) {
                factorToIndices.putIfAbsent(factor, new ArrayList<>());
                factorToIndices.get(factor).add(i);
            }
        }

        // Step 2: BFS to find shortest path
        Queue<Integer> queue = new LinkedList<>();
        boolean[] visited = new boolean[n];
        queue.offer(0);
        visited[0] = true;
        int steps = 0;

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            for (int i = 0; i < levelSize; i++) {
                int current = queue.poll();

                // Check if we reached the target
                if (current == n - 1) {
                    return steps;
                }

                // Option 1: Move to adjacent indices
                int[] neighbors = {current - 1, current + 1};
                for (int neighbor : neighbors) {
                    if (neighbor >= 0 && neighbor < n && !visited[neighbor]) {
                        visited[neighbor] = true;
                        queue.offer(neighbor);
                    }
                }

                // Option 2: Teleport to indices with same prime factors
                for (int factor : primeFactors.get(current)) {
                    if (factorToIndices.containsKey(factor)) {
                        List<Integer> indices = factorToIndices.get(factor);

                        for (int idx : indices) {
                            if (!visited[idx]) {
                                visited[idx] = true;
                                queue.offer(idx);
                            }
                        }

                        // Clear this factor's list to avoid reprocessing
                        // This is crucial for efficiency
                        factorToIndices.remove(factor);
                    }
                }
            }

            steps++;
        }

        return -1; // Should never reach here for valid inputs
    }

    // Helper method to get distinct prime factors
    private Set<Integer> getPrimeFactors(int x) {
        Set<Integer> factors = new HashSet<>();

        // Handle factor 2 separately
        while (x % 2 == 0) {
            factors.add(2);
            x /= 2;
        }

        // Check odd factors up to sqrt(x)
        for (int i = 3; i <= Math.sqrt(x); i += 2) {
            while (x % i == 0) {
                factors.add(i);
                x /= i;
            }
        }

        // If x > 1, it's a prime factor
        if (x > 1) {
            factors.add(x);
        }

        return factors;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × √M)**

- `n` is the length of the array
- `M` is the maximum value in nums
- For each element, we compute prime factors up to √M
- BFS visits each index at most once: O(n)
- Each prime factor is processed at most once: O(P) where P is total distinct prime factors
- Overall dominated by prime factorization: O(n × √M)

**Space Complexity: O(n + P)**

- `O(n)` for visited array, queue, and prime factors storage
- `O(P)` for factor-to-indices mapping where P is total distinct prime factors
- In worst case, each number has unique prime factors: O(n × log M)

## Common Mistakes

1. **Not clearing the factor-to-indices map**: The most critical optimization is deleting factors from the map after first use. Without this, you'll reprocess the same teleportation groups multiple times, leading to O(n²) complexity.

2. **Incorrect prime factorization**: Forgetting to handle repeated factors (like 8 = 2×2×2) or missing the final prime factor when it's greater than √x. Always check if x > 1 after the loop.

3. **Missing level-by-level BFS**: Using DFS or not tracking steps properly in BFS. Remember to process nodes level by level to count jumps correctly.

4. **Forgetting backward moves**: The problem allows i-1 moves, which can be necessary to reach teleportation points that are behind your current position.

## When You'll See This Pattern

This problem combines BFS with group processing, a pattern seen in:

1. **Word Ladder (LeetCode 127)**: Like teleportation between words that differ by one letter, here we teleport between indices sharing prime factors.

2. **Jump Game II (LeetCode 45)**: Both involve finding minimum jumps, but this problem adds the complexity of non-local connections.

3. **Open the Lock (LeetCode 752)**: Similar BFS with "teleportation" between states that are one turn away, but here teleportation is based on shared properties rather than incremental changes.

The core pattern is: **When you have multiple ways to connect nodes, some based on local adjacency and others based on shared properties, BFS with precomputed group mappings is often the solution.**

## Key Takeaways

1. **BFS with group optimization**: When nodes can connect via shared properties, precompute a mapping from properties to nodes. Process each property only once by clearing it after use.

2. **Prime factorization efficiently**: Remember the √n optimization and handle factor 2 separately. Use sets to store distinct factors only.

3. **Level-order traversal for counting**: When you need the number of steps/moves, use level-by-level BFS rather than storing distances in nodes.

[Practice this problem on CodeJeet](/problem/minimum-jumps-to-reach-end-via-prime-teleportation)
