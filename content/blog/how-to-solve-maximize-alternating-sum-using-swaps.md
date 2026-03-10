---
title: "How to Solve Maximize Alternating Sum Using Swaps — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximize Alternating Sum Using Swaps. Hard difficulty, 64.1% acceptance rate. Topics: Array, Greedy, Union-Find, Sorting."
date: "2026-06-20"
category: "dsa-patterns"
tags: ["maximize-alternating-sum-using-swaps", "array", "greedy", "union-find", "hard"]
---

# How to Solve Maximize Alternating Sum Using Swaps

You're given an array `nums` and a list of swap operations that can be performed any number of times. The goal is to maximize the alternating sum `nums[0] - nums[1] + nums[2] - nums[3]...` by strategically swapping elements. The challenge lies in understanding how swaps affect the alternating sum and which elements should end up at which positions.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have `nums = [4, 2, 5, 3]` and swaps `[[0,1],[1,2],[2,3]]`.

The initial alternating sum is: `4 - 2 + 5 - 3 = 4`

We can swap any elements that are connected through the swap operations. Let's analyze the connections:

- Swap [0,1] connects indices 0 and 1
- Swap [1,2] connects indices 1 and 2 (so 0, 1, 2 are connected)
- Swap [2,3] connects indices 2 and 3 (so all indices 0-3 are connected)

Since all indices are connected, we can rearrange elements arbitrarily. We want to maximize:

- Even indices (0, 2): We want LARGE numbers here since they're added
- Odd indices (1, 3): We want SMALL numbers here since they're subtracted

So we should sort the numbers: `[5, 4, 3, 2]` and place them as:

- Even positions (0, 2): largest numbers → 5 and 3
- Odd positions (1, 3): smallest numbers → 4 and 2

Result: `5 - 4 + 3 - 2 = 2`

Wait, that's worse than our initial 4! Let's try a better arrangement:

- Even positions: largest numbers → 5 and 4
- Odd positions: smallest numbers → 3 and 2

Result: `5 - 3 + 4 - 2 = 4` (same as initial)

Actually, the optimal arrangement is:

- Even positions: largest numbers → 5 and 4
- Odd positions: smallest numbers → 2 and 3

Result: `5 - 2 + 4 - 3 = 4`

But what if we try: `5 - 2 + 4 - 3 = 4`? Still 4.

The key insight: When all indices are connected, we should put the largest numbers at even indices and smallest at odd indices. Let's sort descending: `[5, 4, 3, 2]`

- Even indices get: 5, 3
- Odd indices get: 4, 2
  Sum: `5 - 4 + 3 - 2 = 2` (worse!)

Actually, we need to be careful. For 4 elements:

- Even indices: 0, 2 (2 positions)
- Odd indices: 1, 3 (2 positions)

We should take the 2 largest numbers for even indices and 2 smallest for odd indices:
Largest: 5, 4 → even indices
Smallest: 3, 2 → odd indices

Arrangement: `[5, 3, 4, 2]` gives `5 - 3 + 4 - 2 = 4`

This shows the pattern: Within each connected component, we can rearrange elements arbitrarily. We should assign the largest elements to even positions and smallest to odd positions within that component.

## Brute Force Approach

A naive approach would try all possible sequences of swaps, but this is exponential and impractical. Even if we recognize we can rearrange elements arbitrarily within connected components, a brute force would try all permutations of assignments, which is factorial time.

The brute force intuition: For each connected component:

1. Get all elements in that component
2. Try all ways to assign them to positions in that component
3. Calculate the alternating sum for each assignment
4. Take the maximum

For a component with k elements, there are k! possible assignments. With n up to 10^5, this is impossible.

## Optimized Approach

The key insight comes from understanding how the alternating sum is calculated:

`sum = nums[0] - nums[1] + nums[2] - nums[3] + ...`

We can rewrite this as: `sum = Σ(nums[i] * sign(i))` where `sign(i) = 1` if i is even, `-1` if i is odd.

For each connected component (group of indices that can swap with each other):

1. We have a set of indices with their signs (+1 or -1)
2. We have a set of values that can be placed at those indices
3. To maximize the sum, we should pair the largest values with the largest signs

This becomes an assignment problem: Given m positive signs and n negative signs in a component, and a list of values, assign values to signs to maximize `Σ(value * sign)`.

The optimal strategy: Sort values in descending order. Assign the largest values to +1 signs, and the smallest values to -1 signs.

Implementation steps:

1. Use Union-Find to identify connected components
2. For each component, collect:
   - All indices in that component
   - All values at those indices
3. For each component:
   - Count how many indices are even (+1 sign) and how many are odd (-1 sign)
   - Sort values in descending order
   - Assign largest values to even indices, smallest to odd indices
4. Calculate the final alternating sum

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting within components, O(n α(n)) for Union-Find
# Space: O(n) for Union-Find structures and component storage
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank
        root_x = self.find(x)
        root_y = self.find(y)

        if root_x == root_y:
            return

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1

def maximizeAlternatingSum(nums, swaps):
    n = len(nums)
    uf = UnionFind(n)

    # Step 1: Build connected components using Union-Find
    for a, b in swaps:
        uf.union(a, b)

    # Step 2: Group indices by their root component
    components = {}
    for i in range(n):
        root = uf.find(i)
        if root not in components:
            components[root] = []
        components[root].append(i)

    # Step 3: Rearrange values within each component
    result = [0] * n

    for root, indices in components.items():
        # Get values at these indices
        values = [nums[i] for i in indices]

        # Sort values in descending order
        values.sort(reverse=True)

        # Separate indices into even and odd positions
        even_indices = [i for i in indices if i % 2 == 0]
        odd_indices = [i for i in indices if i % 2 == 1]

        # Assign largest values to even indices
        for i, idx in enumerate(even_indices):
            result[idx] = values[i]

        # Assign remaining (smaller) values to odd indices
        offset = len(even_indices)
        for i, idx in enumerate(odd_indices):
            result[idx] = values[offset + i]

    # Step 4: Calculate the alternating sum
    alternating_sum = 0
    for i in range(n):
        if i % 2 == 0:
            alternating_sum += result[i]
        else:
            alternating_sum -= result[i]

    return alternating_sum
```

```javascript
// Time: O(n log n) for sorting within components, O(n α(n)) for Union-Find
// Space: O(n) for Union-Find structures and component storage
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    // Path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
  }
}

function maximizeAlternatingSum(nums, swaps) {
  const n = nums.length;
  const uf = new UnionFind(n);

  // Step 1: Build connected components using Union-Find
  for (const [a, b] of swaps) {
    uf.union(a, b);
  }

  // Step 2: Group indices by their root component
  const components = new Map();
  for (let i = 0; i < n; i++) {
    const root = uf.find(i);
    if (!components.has(root)) {
      components.set(root, []);
    }
    components.get(root).push(i);
  }

  // Step 3: Rearrange values within each component
  const result = new Array(n).fill(0);

  for (const [root, indices] of components) {
    // Get values at these indices
    const values = indices.map((i) => nums[i]);

    // Sort values in descending order
    values.sort((a, b) => b - a);

    // Separate indices into even and odd positions
    const evenIndices = indices.filter((i) => i % 2 === 0);
    const oddIndices = indices.filter((i) => i % 2 === 1);

    // Assign largest values to even indices
    for (let i = 0; i < evenIndices.length; i++) {
      result[evenIndices[i]] = values[i];
    }

    // Assign remaining (smaller) values to odd indices
    const offset = evenIndices.length;
    for (let i = 0; i < oddIndices.length; i++) {
      result[oddIndices[i]] = values[offset + i];
    }
  }

  // Step 4: Calculate the alternating sum
  let alternatingSum = 0;
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      alternatingSum += result[i];
    } else {
      alternatingSum -= result[i];
    }
  }

  return alternatingSum;
}
```

```java
// Time: O(n log n) for sorting within components, O(n α(n)) for Union-Find
// Space: O(n) for Union-Find structures and component storage
import java.util.*;

class UnionFind {
    private int[] parent;
    private int[] rank;

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        // Path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        // Union by rank
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return;

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

class Solution {
    public long maximizeAlternatingSum(int[] nums, int[][] swaps) {
        int n = nums.length;
        UnionFind uf = new UnionFind(n);

        // Step 1: Build connected components using Union-Find
        for (int[] swap : swaps) {
            uf.union(swap[0], swap[1]);
        }

        // Step 2: Group indices by their root component
        Map<Integer, List<Integer>> components = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int root = uf.find(i);
            components.computeIfAbsent(root, k -> new ArrayList<>()).add(i);
        }

        // Step 3: Rearrange values within each component
        int[] result = new int[n];

        for (List<Integer> indices : components.values()) {
            // Get values at these indices
            List<Integer> values = new ArrayList<>();
            for (int idx : indices) {
                values.add(nums[idx]);
            }

            // Sort values in descending order
            values.sort(Collections.reverseOrder());

            // Separate indices into even and odd positions
            List<Integer> evenIndices = new ArrayList<>();
            List<Integer> oddIndices = new ArrayList<>();
            for (int idx : indices) {
                if (idx % 2 == 0) {
                    evenIndices.add(idx);
                } else {
                    oddIndices.add(idx);
                }
            }

            // Assign largest values to even indices
            for (int i = 0; i < evenIndices.size(); i++) {
                result[evenIndices.get(i)] = values.get(i);
            }

            // Assign remaining (smaller) values to odd indices
            int offset = evenIndices.size();
            for (int i = 0; i < oddIndices.size(); i++) {
                result[oddIndices.get(i)] = values.get(offset + i);
            }
        }

        // Step 4: Calculate the alternating sum
        long alternatingSum = 0;
        for (int i = 0; i < n; i++) {
            if (i % 2 == 0) {
                alternatingSum += result[i];
            } else {
                alternatingSum -= result[i];
            }
        }

        return alternatingSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + m α(n))**

- `O(m α(n))` for Union-Find operations, where m is the number of swaps and α(n) is the inverse Ackermann function (effectively constant)
- `O(n)` for grouping indices by component
- `O(n log n)` for sorting values within components (in the worst case, one component contains all n elements)

**Space Complexity: O(n)**

- `O(n)` for Union-Find parent and rank arrays
- `O(n)` for storing components and their values
- `O(n)` for the result array

The dominant factor is sorting within components. In practice, with multiple smaller components, the actual runtime is often better than worst-case.

## Common Mistakes

1. **Not using Union-Find correctly**: Some candidates try to track connectivity with adjacency lists and DFS/BFS, which works but is more complex. Union-Find is cleaner for this problem. Remember to implement path compression and union by rank for optimal performance.

2. **Incorrect assignment strategy**: The most common error is not realizing that within a component, you should assign the largest values to even indices and smallest to odd indices. Some candidates try to maximize locally without considering the global arrangement.

3. **Forgetting that swaps can be applied multiple times**: The problem states swaps can be performed "any number of times," which means if indices a and b are connected through any path, their values can be swapped. This is why we need to find connected components.

4. **Integer overflow**: With n up to 10^5 and values up to 10^5, the alternating sum can be as large as 10^10, which fits in 64-bit integers but not necessarily in 32-bit. Always use 64-bit integers (long in Java, default in Python).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Union-Find for connectivity**: Similar to problems like "Number of Connected Components in an Undirected Graph" (LeetCode 323) or "Accounts Merge" (LeetCode 721), where you need to group connected elements.

2. **Greedy assignment with sorting**: The pattern of sorting and assigning largest to most valuable positions appears in problems like "Maximum Performance of a Team" (LeetCode 1383) or "Minimum Cost to Hire K Workers" (LeetCode 857).

3. **Alternating sum pattern**: Problems involving alternating signs like "Maximum Alternating Subsequence Sum" (LeetCode 1911) teach similar thinking about positive and negative contributions.

## Key Takeaways

1. **When swaps can be applied arbitrarily many times, think in terms of connected components**: Any two elements in the same connected component can be swapped, so you can rearrange them arbitrarily within that component.

2. **For maximizing linear combinations, sort and assign greedily**: When you need to maximize `Σ(a_i * b_i)` and you can rearrange either sequence, sort both in the same order (both ascending or both descending).

3. **Union-Find is your friend for connectivity problems**: It provides near-constant time operations for maintaining and querying connectivity, making it ideal for problems with dynamic connections.

[Practice this problem on CodeJeet](/problem/maximize-alternating-sum-using-swaps)
