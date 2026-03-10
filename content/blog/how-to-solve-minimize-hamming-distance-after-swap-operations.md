---
title: "How to Solve Minimize Hamming Distance After Swap Operations — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimize Hamming Distance After Swap Operations. Medium difficulty, 49.2% acceptance rate. Topics: Array, Depth-First Search, Union-Find."
date: "2029-10-01"
category: "dsa-patterns"
tags:
  [
    "minimize-hamming-distance-after-swap-operations",
    "array",
    "depth-first-search",
    "union-find",
    "medium",
  ]
---

# How to Solve Minimize Hamming Distance After Swap Operations

You're given two arrays `source` and `target` of length `n`, and a list of allowed swaps between indices in `source`. The goal is to minimize the Hamming distance (number of positions where elements differ) between `source` and `target` by performing any number of allowed swaps. What makes this problem interesting is that swaps create connected components of indices that can be rearranged arbitrarily within each component, but elements cannot move between components.

## Visual Walkthrough

Let's trace through an example to build intuition:

```
source = [1, 2, 3, 4]
target = [2, 1, 4, 3]
allowedSwaps = [[0, 1], [2, 3]]
```

**Step 1: Identify connected components**

- Swap [0,1] connects indices 0 and 1
- Swap [2,3] connects indices 2 and 3
  We have two separate components: {0, 1} and {2, 3}

**Step 2: Analyze each component separately**
For component {0, 1}:

- Available source elements: source[0]=1, source[1]=2
- Required target elements: target[0]=2, target[1]=1
  We can match both: 1↔1 and 2↔2 → 0 mismatches

For component {2, 3}:

- Available source elements: source[2]=3, source[3]=4
- Required target elements: target[2]=4, target[3]=3
  We can match both: 3↔3 and 4↔4 → 0 mismatches

Total Hamming distance = 0

**Key insight**: Within each connected component, we can rearrange source elements arbitrarily. The minimum Hamming distance for a component equals the total number of elements in that component minus the maximum number of matches we can make between source and target elements within that component.

## Brute Force Approach

A naive approach might try all possible sequences of swaps, but this is computationally infeasible. Even if we consider just rearranging elements within connected components, the number of permutations grows factorially.

Another brute force idea: For each connected component, try all permutations of source elements to minimize mismatches with target. For a component of size k, there are k! permutations to check. With n up to 10^5, this is impossible.

The fundamental problem with brute force is it doesn't recognize that we don't need to find the specific arrangement—we just need to count how many elements can be matched.

## Optimized Approach

The key insight is that **swaps create equivalence classes of indices**. If index i can swap with j, and j can swap with k, then i, j, and k are all connected (transitive property). This is exactly what Union-Find (Disjoint Set Union) is designed to handle.

**Step-by-step reasoning:**

1. Use Union-Find to group indices into connected components based on allowed swaps
2. For each component, collect:
   - All source elements at indices in that component
   - All target elements at indices in that component
3. For each component, count how many source elements match target elements
4. The Hamming distance = total elements - total matches

**Why this works:**
Within a connected component, we can rearrange source elements arbitrarily through swaps (think bubble sort logic). So if a component has X copies of value v in source and Y copies in target, we can match min(X, Y) of them. The rest will be mismatches.

## Optimal Solution

We'll use Union-Find to identify connected components, then use hash maps to count element frequencies within each component.

<div class="code-group">

```python
# Time: O(n + m * α(n)) where n = len(source), m = len(allowedSwaps), α is inverse Ackermann
# Space: O(n) for Union-Find and frequency maps
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression: make parent of x point to root
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union by rank: attach smaller tree under larger tree
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

def minimumHammingDistance(source, target, allowedSwaps):
    n = len(source)
    uf = UnionFind(n)

    # Step 1: Union all connected indices based on allowed swaps
    for a, b in allowedSwaps:
        uf.union(a, b)

    # Step 2: Group indices by their root component
    component_map = {}
    for i in range(n):
        root = uf.find(i)
        if root not in component_map:
            component_map[root] = []
        component_map[root].append(i)

    # Step 3: For each component, count matches between source and target
    total_matches = 0

    for indices in component_map.values():
        # Count frequencies of values in source for this component
        source_count = {}
        for idx in indices:
            val = source[idx]
            source_count[val] = source_count.get(val, 0) + 1

        # For each target value in this component, match with available source values
        for idx in indices:
            target_val = target[idx]
            if source_count.get(target_val, 0) > 0:
                total_matches += 1
                source_count[target_val] -= 1

    # Hamming distance = total elements - matched elements
    return n - total_matches
```

```javascript
// Time: O(n + m * α(n)) where n = source.length, m = allowedSwaps.length
// Space: O(n) for Union-Find and frequency maps
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

function minimumHammingDistance(source, target, allowedSwaps) {
  const n = source.length;
  const uf = new UnionFind(n);

  // Step 1: Connect all swappable indices
  for (const [a, b] of allowedSwaps) {
    uf.union(a, b);
  }

  // Step 2: Group indices by their root component
  const componentMap = new Map();
  for (let i = 0; i < n; i++) {
    const root = uf.find(i);
    if (!componentMap.has(root)) {
      componentMap.set(root, []);
    }
    componentMap.get(root).push(i);
  }

  // Step 3: Count matches in each component
  let totalMatches = 0;

  for (const indices of componentMap.values()) {
    // Count source values in this component
    const sourceCount = new Map();
    for (const idx of indices) {
      const val = source[idx];
      sourceCount.set(val, (sourceCount.get(val) || 0) + 1);
    }

    // Match target values with available source values
    for (const idx of indices) {
      const targetVal = target[idx];
      if ((sourceCount.get(targetVal) || 0) > 0) {
        totalMatches++;
        sourceCount.set(targetVal, sourceCount.get(targetVal) - 1);
      }
    }
  }

  // Hamming distance = total elements - matched elements
  return n - totalMatches;
}
```

```java
// Time: O(n + m * α(n)) where n = source.length, m = allowedSwaps.length
// Space: O(n) for Union-Find and frequency maps
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
    public int minimumHammingDistance(int[] source, int[] target, int[][] allowedSwaps) {
        int n = source.length;
        UnionFind uf = new UnionFind(n);

        // Step 1: Connect all swappable indices
        for (int[] swap : allowedSwaps) {
            uf.union(swap[0], swap[1]);
        }

        // Step 2: Group indices by their root component
        Map<Integer, List<Integer>> componentMap = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int root = uf.find(i);
            componentMap.computeIfAbsent(root, k -> new ArrayList<>()).add(i);
        }

        // Step 3: Count matches in each component
        int totalMatches = 0;

        for (List<Integer> indices : componentMap.values()) {
            // Count source values in this component
            Map<Integer, Integer> sourceCount = new HashMap<>();
            for (int idx : indices) {
                int val = source[idx];
                sourceCount.put(val, sourceCount.getOrDefault(val, 0) + 1);
            }

            // Match target values with available source values
            for (int idx : indices) {
                int targetVal = target[idx];
                if (sourceCount.getOrDefault(targetVal, 0) > 0) {
                    totalMatches++;
                    sourceCount.put(targetVal, sourceCount.get(targetVal) - 1);
                }
            }
        }

        // Hamming distance = total elements - matched elements
        return n - totalMatches;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m \* α(n))

- Building Union-Find: O(m \* α(n)) where m is number of swaps, α(n) is inverse Ackermann (effectively constant)
- Grouping indices by component: O(n \* α(n))
- Counting matches: O(n) total across all components
- Overall: O(n + m \* α(n)) which is effectively O(n + m) for practical n

**Space Complexity:** O(n)

- Union-Find arrays: O(n)
- Component map: O(n) in worst case (each index in its own component)
- Frequency maps: O(n) total across all components

## Common Mistakes

1. **Forgetting transitive swaps**: Not realizing that if you can swap (0,1) and (1,2), then 0, 1, and 2 are all connected. This requires Union-Find or DFS to find connected components, not just direct swaps.

2. **Incorrect matching logic**: Trying to match elements by position within a component instead of by value frequency. Remember: within a component, you can rearrange arbitrarily, so position doesn't matter—only which values are available.

3. **Not handling duplicate values correctly**: When a value appears multiple times in source and target within a component, you need to count how many can be matched. Using sets instead of frequency maps will undercount matches.

4. **Inefficient Union-Find implementation**: Not using path compression and union by rank makes operations O(log n) instead of O(α(n)). In interviews, always implement both optimizations.

## When You'll See This Pattern

This "connected components + frequency matching" pattern appears in problems where:

1. Elements can be rearranged within groups
2. You need to minimize mismatches or maximize matches
3. Swaps or relationships define connectivity

**Related problems:**

- **Smallest String With Swaps (Medium)**: Almost identical structure—swaps create connected components where characters can be rearranged to form the lexicographically smallest string.
- **Make Lexicographically Smallest Array by Swapping Elements (Medium)**: Similar concept with an additional constraint that swaps are only allowed between elements whose difference ≤ limit.
- **Evaluate Division (Medium)**: Uses Union-Find to track relationships between variables, though for different purpose.

## Key Takeaways

1. **When swaps create connectivity, think Union-Find**: Any problem involving "you can swap these positions" likely means you need to find connected components of indices.

2. **Within a connected component, arrangement is flexible**: Once you identify components, you can treat all elements in a component as a multiset that can be rearranged arbitrarily.

3. **Frequency matching beats position matching**: When elements can be rearranged, count how many of each value you have in source and target, then match as many as possible.

Related problems: [Smallest String With Swaps](/problem/smallest-string-with-swaps), [Make Lexicographically Smallest Array by Swapping Elements](/problem/make-lexicographically-smallest-array-by-swapping-elements)
