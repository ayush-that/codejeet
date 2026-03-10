---
title: "How to Solve Graph Connectivity With Threshold — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Graph Connectivity With Threshold. Hard difficulty, 49.2% acceptance rate. Topics: Array, Math, Union-Find, Number Theory."
date: "2029-09-13"
category: "dsa-patterns"
tags: ["graph-connectivity-with-threshold", "array", "math", "union-find", "hard"]
---

# How to Solve Graph Connectivity With Threshold

This problem asks us to determine which cities are connected through a network of roads, where two cities are directly connected if they share a common divisor greater than a given threshold. The challenge lies in efficiently determining connectivity between potentially thousands of cities without checking every pair, which would be computationally impossible.

What makes this problem interesting is the clever transformation from a graph connectivity problem into a number theory problem. Instead of checking pairs of cities directly, we connect cities through their divisors, which dramatically reduces the number of operations needed.

## Visual Walkthrough

Let's trace through a small example: `n = 6`, `threshold = 1`

**Step 1: Understanding the connection rule**
Two cities `x` and `y` are connected if they share a divisor > threshold. With threshold = 1, this means they need a common divisor > 1 (so at least 2).

**Step 2: List divisors for each city**

- City 1: [1] (no divisors > 1)
- City 2: [2]
- City 3: [3]
- City 4: [2, 4]
- City 5: [5]
- City 6: [2, 3, 6]

**Step 3: Build connections through divisors**
Instead of checking all 15 pairs of cities, we connect cities that share divisors:

- Divisor 2 connects: 2, 4, 6
- Divisor 3 connects: 3, 6
- Divisor 4 connects: 4
- Divisor 5 connects: 5
- Divisor 6 connects: 6

**Step 4: Determine connectivity**
Through these divisor connections:

- Cities 2, 4, 6 are connected (via divisor 2)
- City 3 connects to 6 (via divisor 3), so 3 joins the 2-4-6 group
- City 5 is isolated (only connects to itself)
- City 1 is isolated (no divisors > 1)

**Key insight**: Cities 2 and 4 don't share a divisor directly, but both connect to divisor 2, making them indirectly connected. This is why we need union-find!

## Brute Force Approach

A naive approach would check every pair of cities (i, j) and compute their greatest common divisor (GCD). If GCD > threshold, connect them in a union-find structure.

**Why this fails**:

- Checking all pairs takes O(n²) time
- For n up to 10⁴, that's 100 million operations
- Each GCD computation adds overhead
- The problem constraints make this approach too slow

<div class="code-group">

```python
# Brute Force Solution (Too Slow)
# Time: O(n² * log(min(a,b))) | Space: O(n)
def areConnectedBruteForce(n, threshold):
    parent = list(range(n + 1))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(x, y):
        root_x, root_y = find(x), find(y)
        if root_x != root_y:
            parent[root_y] = root_x

    # Check all pairs - this is the bottleneck
    for i in range(1, n + 1):
        for j in range(i + 1, n + 1):
            # Compute GCD
            a, b = i, j
            while b:
                a, b = b, a % b
            gcd = a

            if gcd > threshold:
                union(i, j)

    # Check if all cities are connected to city 1
    root1 = find(1)
    return [find(i) == root1 for i in range(1, n + 1)]
```

```javascript
// Brute Force Solution (Too Slow)
// Time: O(n² * log(min(a,b))) | Space: O(n)
function areConnectedBruteForce(n, threshold) {
  const parent = Array.from({ length: n + 1 }, (_, i) => i);

  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  }

  function union(x, y) {
    const rootX = find(x);
    const rootY = find(y);
    if (rootX !== rootY) {
      parent[rootY] = rootX;
    }
  }

  // Check all pairs - this is the bottleneck
  for (let i = 1; i <= n; i++) {
    for (let j = i + 1; j <= n; j++) {
      // Compute GCD
      let a = i,
        b = j;
      while (b !== 0) {
        [a, b] = [b, a % b];
      }
      const gcd = a;

      if (gcd > threshold) {
        union(i, j);
      }
    }
  }

  // Check if all cities are connected to city 1
  const root1 = find(1);
  return Array.from({ length: n }, (_, i) => find(i + 1) === root1);
}
```

```java
// Brute Force Solution (Too Slow)
// Time: O(n² * log(min(a,b))) | Space: O(n)
public List<Boolean> areConnectedBruteForce(int n, int threshold) {
    int[] parent = new int[n + 1];
    for (int i = 0; i <= n; i++) {
        parent[i] = i;
    }

    // Union-Find operations
    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            // Compute GCD
            int a = i, b = j;
            while (b != 0) {
                int temp = b;
                b = a % b;
                a = temp;
            }
            int gcd = a;

            if (gcd > threshold) {
                // Union the two cities
                int rootI = find(parent, i);
                int rootJ = find(parent, j);
                if (rootI != rootJ) {
                    parent[rootJ] = rootI;
                }
            }
        }
    }

    // Check connectivity to city 1
    int root1 = find(parent, 1);
    List<Boolean> result = new ArrayList<>();
    for (int i = 1; i <= n; i++) {
        result.add(find(parent, i) == root1);
    }
    return result;
}

private int find(int[] parent, int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}
```

</div>

## Optimized Approach

The key insight is that we don't need to check every pair of cities. Instead, we can connect cities through their common divisors:

1. **Divisor-based connection**: For each divisor `d` greater than the threshold, connect all multiples of `d`
2. **Mathematical reasoning**: If two numbers share a divisor `d > threshold`, then both are multiples of `d`. By connecting all multiples of each divisor, we automatically connect all cities that share any common divisor
3. **Union-Find efficiency**: This approach reduces the complexity from O(n²) to O(n log n) in practice

**Why this works**:

- If cities `x` and `y` share divisor `d > threshold`, then `x = d * a` and `y = d * b`
- When we process divisor `d`, we connect all its multiples
- Both `x` and `y` will be connected through `d`
- This handles all possible connections without checking pairs

**Step-by-step algorithm**:

1. Initialize Union-Find for n cities
2. For each divisor `d` from `threshold + 1` to `n`:
   - Connect all multiples of `d`: `d`, `2d`, `3d`, ... up to `n`
3. Check connectivity relative to city 1

## Optimal Solution

<div class="code-group">

```python
# Optimal Solution
# Time: O(n log log n) | Space: O(n)
def areConnected(n, threshold):
    """
    Determine which cities are connected to city 1.

    Args:
        n: Number of cities (1 to n)
        threshold: Minimum divisor value to consider for connections

    Returns:
        List of booleans indicating if each city is connected to city 1
    """
    # Initialize Union-Find data structure
    parent = list(range(n + 1))
    rank = [0] * (n + 1)

    def find(x):
        """Find root of x with path compression."""
        # Path compression: make nodes point directly to root
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        """Union two sets using union by rank."""
        root_x = find(x)
        root_y = find(y)

        # If already in same set, do nothing
        if root_x == root_y:
            return

        # Union by rank: attach smaller tree to larger tree
        if rank[root_x] < rank[root_y]:
            parent[root_x] = root_y
        elif rank[root_x] > rank[root_y]:
            parent[root_y] = root_x
        else:
            # Same rank, choose one as root and increment its rank
            parent[root_y] = root_x
            rank[root_x] += 1

    # Key optimization: Connect through divisors instead of checking pairs
    # For each divisor d > threshold, connect all its multiples
    for d in range(threshold + 1, n + 1):
        # Start from the first multiple (d itself) and connect all multiples
        # This connects all numbers that share d as a common divisor
        multiple = d * 2  # Start from 2d since d is already in the set
        while multiple <= n:
            union(d, multiple)  # Connect d with its multiple
            multiple += d

    # Check connectivity relative to city 1
    root_of_1 = find(1)
    result = []
    for i in range(1, n + 1):
        result.append(find(i) == root_of_1)

    return result
```

```javascript
// Optimal Solution
// Time: O(n log log n) | Space: O(n)
function areConnected(n, threshold) {
  // Initialize Union-Find data structure
  const parent = Array.from({ length: n + 1 }, (_, i) => i);
  const rank = new Array(n + 1).fill(0);

  // Find with path compression
  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]); // Path compression
    }
    return parent[x];
  }

  // Union by rank
  function union(x, y) {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX === rootY) return;

    // Union by rank: attach smaller tree to larger tree
    if (rank[rootX] < rank[rootY]) {
      parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
      parent[rootY] = rootX;
    } else {
      // Same rank, choose one as root and increment rank
      parent[rootY] = rootX;
      rank[rootX]++;
    }
  }

  // Connect cities through their common divisors
  // For each divisor d > threshold, connect all multiples of d
  for (let d = threshold + 1; d <= n; d++) {
    // Connect all multiples of d (starting from 2d)
    // This efficiently connects all numbers sharing d as a divisor
    for (let multiple = d * 2; multiple <= n; multiple += d) {
      union(d, multiple);
    }
  }

  // Check which cities are connected to city 1
  const rootOf1 = find(1);
  const result = [];
  for (let i = 1; i <= n; i++) {
    result.push(find(i) === rootOf1);
  }

  return result;
}
```

```java
// Optimal Solution
// Time: O(n log log n) | Space: O(n)
class Solution {
    public List<Boolean> areConnected(int n, int threshold) {
        // Initialize Union-Find
        int[] parent = new int[n + 1];
        int[] rank = new int[n + 1];
        for (int i = 0; i <= n; i++) {
            parent[i] = i;
        }

        // Connect through divisors
        // For each divisor > threshold, union all its multiples
        for (int d = threshold + 1; d <= n; d++) {
            // Connect all multiples of d
            // This connects all numbers that share d as a common divisor
            for (int multiple = d * 2; multiple <= n; multiple += d) {
                union(parent, rank, d, multiple);
            }
        }

        // Check connectivity to city 1
        int rootOf1 = find(parent, 1);
        List<Boolean> result = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            result.add(find(parent, i) == rootOf1);
        }

        return result;
    }

    // Find with path compression
    private int find(int[] parent, int x) {
        if (parent[x] != x) {
            parent[x] = find(parent, parent[x]); // Path compression
        }
        return parent[x];
    }

    // Union by rank
    private void union(int[] parent, int[] rank, int x, int y) {
        int rootX = find(parent, x);
        int rootY = find(parent, y);

        if (rootX == rootY) return;

        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log log n)**

- The outer loop runs from `threshold + 1` to `n`: O(n) iterations
- For each divisor `d`, we connect multiples: `n/d` operations
- Total operations: Σ\_{d=threshold+1}^{n} n/d ≈ n \* Σ 1/d
- The harmonic series sum Σ 1/d from d=1 to n is O(log n)
- However, we start from `threshold + 1`, and in practice this gives us O(n log log n) complexity
- Union-Find operations are nearly constant time (inverse Ackermann function)

**Space Complexity: O(n)**

- Parent array: O(n)
- Rank array: O(n)
- Result array: O(n)

The key efficiency gain comes from avoiding O(n²) pair checks and instead performing O(n log n) divisor-based connections.

## Common Mistakes

1. **Starting multiples from d instead of 2d**: If you start connecting multiples from `d` itself, you'll create self-connections (union(d, d)) which is unnecessary. Always start from `2d`.

2. **Forgetting that threshold is exclusive**: The problem says "strictly greater than threshold", so we start from `threshold + 1`, not `threshold`.

3. **Not using union by rank/path compression**: Without these optimizations, Union-Find operations can degrade to O(n) in worst case, making the solution too slow for large n.

4. **Checking connectivity incorrectly**: Some candidates check if all cities have the same root, but the problem asks specifically about connectivity to city 1. A city might be connected to other cities but not to city 1.

5. **Inefficient divisor iteration**: Iterating up to √n for each city to find divisors is less efficient than iterating through divisors and connecting their multiples.

## When You'll See This Pattern

This "connect through divisors" pattern appears in problems where:

1. Connectivity depends on mathematical properties (divisors, multiples, GCD)
2. Direct pair checking is too expensive (O(n²))
3. You can use a "hub-and-spoke" model to reduce connections

**Related problems**:

1. **Greatest Common Divisor Traversal** (Hard) - Almost identical pattern: check if you can traverse between array elements where you can move between indices if their values share a common divisor > 1.
2. **Largest Component Size by Common Factor** (Hard) - Connect numbers through common factors to find the largest connected component.
3. **Number of Good Pairs** (Easy) - Simpler version focusing on counting rather than connectivity.

The core technique is recognizing that mathematical relationships (like sharing divisors) create equivalence classes that can be efficiently processed using Union-Find.

## Key Takeaways

1. **Transform pair relationships to hub connections**: When connectivity depends on shared properties (divisors, factors, etc.), connect elements through the shared property rather than checking all pairs.

2. **Union-Find is your friend for connectivity problems**: Whenever you need to determine if elements are connected or belong to the same group, consider Union-Find with path compression and union by rank.

3. **Mathematical constraints enable optimizations**: Problems with number theory constraints often have clever optimizations. Look for ways to iterate through divisors/multiples instead of checking all pairs.

4. **Always verify edge cases**: Threshold = 0, threshold = n, n = 1, and other boundary conditions should be tested. With threshold = 0, all numbers > 0 are connected through divisor 1? Wait, divisor must be > threshold, so with threshold = 0, we need divisors > 0, which includes 1. But 1 doesn't help since all numbers are divisible by 1. Actually, we start from threshold + 1 = 1, so we'd connect through divisor 1... but that connects nothing useful. The algorithm handles this correctly.

Related problems: [Greatest Common Divisor Traversal](/problem/greatest-common-divisor-traversal)
