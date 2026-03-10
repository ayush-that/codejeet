---
title: "How to Solve Smallest String With Swaps — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Smallest String With Swaps. Medium difficulty, 60.4% acceptance rate. Topics: Array, Hash Table, String, Depth-First Search, Breadth-First Search."
date: "2026-10-02"
category: "dsa-patterns"
tags: ["smallest-string-with-swaps", "array", "hash-table", "string", "medium"]
---

# How to Solve Smallest String With Swaps

You're given a string and a list of index pairs where characters can be swapped any number of times. Your task is to find the lexicographically smallest string achievable through these swaps. What makes this problem interesting is that swaps are transitive: if you can swap (a,b) and (b,c), you can effectively move characters between a, b, and c, even though (a,c) wasn't directly given. This creates connected components where characters can be rearranged freely within each component.

## Visual Walkthrough

Let's trace through an example: `s = "dcab"`, `pairs = [[0,3],[1,2]]`

**Step 1: Understanding the connections**

- Pair [0,3] means indices 0 and 3 can swap
- Pair [1,2] means indices 1 and 2 can swap

These form two separate groups:

- Group 1: indices {0, 3}
- Group 2: indices {1, 2}

**Step 2: What can we rearrange?**
In Group 1 (indices 0 and 3), we have characters 'd' at index 0 and 'b' at index 3. Since we can swap them any number of times, we can arrange them in any order. The lexicographically smallest arrangement would be 'b' at index 0 and 'd' at index 3.

In Group 2 (indices 1 and 2), we have characters 'c' at index 1 and 'a' at index 2. The smallest arrangement is 'a' at index 1 and 'c' at index 2.

**Step 3: Building the result**
Original string: d c a b
After rearranging:

- Index 0 gets smallest from Group 1: 'b'
- Index 3 gets remaining from Group 1: 'd'
- Index 1 gets smallest from Group 2: 'a'
- Index 2 gets remaining from Group 2: 'c'

Result: "bacd"

**Key insight:** The problem reduces to finding connected components of indices (where swaps are possible), then sorting characters within each component and placing them back at the sorted indices of that component.

## Brute Force Approach

A naive approach might try to simulate all possible swap sequences, but this is infeasible. Since we can swap any number of times, the number of possible sequences grows factorially.

Another brute force idea: try all permutations of characters within connected components. For each component of size k, there are k! permutations to check. For a string of length n, if we have one large component of size n, that's n! possibilities - far too many.

Even if we tried to be clever and use BFS/DFS to explore reachable states, the state space is still enormous because each string configuration is a different state, and there are 26^n possible strings (assuming lowercase letters).

The brute force fails because it doesn't recognize the core property: **within a connected component, characters can be arranged in any order**. Once we understand this, we don't need to explore swap sequences - we just need to find components and sort.

## Optimized Approach

The key insight is that swaps create equivalence classes of indices. If index a can swap with b, and b can swap with c, then a, b, and c are all connected - characters can move freely among them. This is exactly what a **graph connected component** represents.

**Step-by-step reasoning:**

1. **Build the graph:** Each index is a node. For each pair [a,b], add an undirected edge between a and b.

2. **Find connected components:** Use DFS, BFS, or Union-Find to find all connected components. Each component is a set of indices that can exchange characters freely.

3. **Sort within each component:** For each component:
   - Collect all characters at those indices
   - Sort the characters in ascending order
   - Sort the indices in ascending order
   - Place the smallest character at the smallest index, second smallest at second smallest index, etc.

4. **Why this works:** Within a component, we can achieve any permutation of the characters through a sequence of swaps (this is a known property of connected components with swap edges). To get the lexicographically smallest string, we want the smallest characters at the smallest indices within each component.

**Why Union-Find is particularly suitable:**

- We need to group indices that are connected through any chain of swaps
- Union-Find efficiently handles the transitive nature ("if a connects to b and b connects to c, then a connects to c")
- After building components, we can easily collect all indices belonging to each root

## Optimal Solution

Here's the complete solution using Union-Find (Disjoint Set Union):

<div class="code-group">

```python
# Time: O((n + m) * α(n) + n log n) where n = len(s), m = len(pairs), α is inverse Ackermann
# Space: O(n) for Union-Find structures and component collections
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression: make parent of x point directly to root
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

def smallestStringWithSwaps(s: str, pairs: List[List[int]]) -> str:
    n = len(s)
    uf = UnionFind(n)

    # Step 1: Union all connected indices based on pairs
    for a, b in pairs:
        uf.union(a, b)

    # Step 2: Group indices by their root (component)
    components = defaultdict(list)
    for i in range(n):
        root = uf.find(i)
        components[root].append(i)

    # Step 3: Build result string
    result = [''] * n

    for indices in components.values():
        # Get characters at these indices
        chars = [s[i] for i in indices]

        # Sort both indices and characters
        indices.sort()
        chars.sort()

        # Place sorted characters at sorted indices
        for idx, char in zip(indices, chars):
            result[idx] = char

    return ''.join(result)
```

```javascript
// Time: O((n + m) * α(n) + n log n) where n = s.length, m = pairs.length, α is inverse Ackermann
// Space: O(n) for Union-Find structures and component collections
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }

  find(x) {
    // Path compression: make parent point directly to root
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union by rank: attach smaller tree under larger tree
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

function smallestStringWithSwaps(s, pairs) {
  const n = s.length;
  const uf = new UnionFind(n);

  // Step 1: Union all connected indices based on pairs
  for (const [a, b] of pairs) {
    uf.union(a, b);
  }

  // Step 2: Group indices by their root (component)
  const components = new Map();
  for (let i = 0; i < n; i++) {
    const root = uf.find(i);
    if (!components.has(root)) {
      components.set(root, []);
    }
    components.get(root).push(i);
  }

  // Step 3: Build result string
  const result = new Array(n);

  for (const indices of components.values()) {
    // Get characters at these indices
    const chars = indices.map((i) => s[i]);

    // Sort both indices and characters
    indices.sort((a, b) => a - b);
    chars.sort();

    // Place sorted characters at sorted indices
    for (let i = 0; i < indices.length; i++) {
      result[indices[i]] = chars[i];
    }
  }

  return result.join("");
}
```

```java
// Time: O((n + m) * α(n) + n log n) where n = s.length(), m = pairs.size(), α is inverse Ackermann
// Space: O(n) for Union-Find structures and component collections
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
        // Path compression: make parent point directly to root
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        // Union by rank: attach smaller tree under larger tree
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
    public String smallestStringWithSwaps(String s, List<List<Integer>> pairs) {
        int n = s.length();
        UnionFind uf = new UnionFind(n);

        // Step 1: Union all connected indices based on pairs
        for (List<Integer> pair : pairs) {
            uf.union(pair.get(0), pair.get(1));
        }

        // Step 2: Group indices by their root (component)
        Map<Integer, List<Integer>> components = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int root = uf.find(i);
            components.computeIfAbsent(root, k -> new ArrayList<>()).add(i);
        }

        // Step 3: Build result string
        char[] result = new char[n];

        for (List<Integer> indices : components.values()) {
            // Get characters at these indices
            List<Character> chars = new ArrayList<>();
            for (int idx : indices) {
                chars.add(s.charAt(idx));
            }

            // Sort both indices and characters
            Collections.sort(indices);
            Collections.sort(chars);

            // Place sorted characters at sorted indices
            for (int i = 0; i < indices.size(); i++) {
                result[indices.get(i)] = chars.get(i);
            }
        }

        return new String(result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

1. **Union-Find operations:** O((n + m) \* α(n)) where n is string length, m is number of pairs, and α is the inverse Ackermann function (effectively constant).
   - Initializing Union-Find: O(n)
   - Processing m pairs with union operations: O(m \* α(n))
   - Finding roots for all n indices: O(n \* α(n))

2. **Grouping indices by component:** O(n) to iterate through all indices

3. **Sorting within components:** This is the dominant factor. In the worst case where all indices are in one component, we sort n indices and n characters: O(n log n).

Total: **O((n + m) \* α(n) + n log n)** which simplifies to **O(n log n)** in practice since α(n) is essentially constant and n log n dominates.

**Space Complexity:**

- Union-Find structures: O(n) for parent and rank arrays
- Component grouping: O(n) to store indices by component
- Character arrays: O(n) for result and temporary character lists
  Total: **O(n)**

## Common Mistakes

1. **Not understanding transitivity:** Some candidates think only direct swaps are possible. They might try to sort only directly connected pairs. Remember: if (0,1) and (1,2) are pairs, then character at index 0 can reach index 2 through index 1.

2. **Forgetting to sort indices within components:** After sorting characters, you must place them at the sorted indices within the component. If you don't sort indices, you might place a small character at a large index within the component, which isn't optimal.

3. **Inefficient component finding:** Using DFS/BFS for each index without proper visited tracking leads to O(n²) time. Always mark visited nodes or use Union-Find.

4. **Not handling multiple components correctly:** Each component must be processed independently. Characters from different components cannot exchange places, even if sorting all characters together would give a smaller string.

## When You'll See This Pattern

This "connected components with rearrangement" pattern appears in several problems:

1. **Minimize Hamming Distance After Swap Operations (Medium):** Similar structure - find connected components, then within each component, you can match elements optimally to minimize Hamming distance.

2. **Process Restricted Friend Requests (Hard):** Uses Union-Find to track connectivity constraints, with additional conditions about when unions are allowed.

3. **Accounts Merge (Medium):** Find connected email accounts using Union-Find, then merge information within each component.

4. **Similar String Groups (Hard):** Uses connectivity concept where strings are connected if they're similar, then counts connected components.

The core pattern is: when you have elements that can be grouped based on some relationship (swaps, similarity, etc.), and operations can be performed freely within groups but not between groups, think about finding connected components first.

## Key Takeaways

1. **Swaps create equivalence classes:** When you can swap elements according to given pairs, the indices form connected components where elements can be rearranged arbitrarily.

2. **Union-Find is ideal for transitive relationships:** When "if A connects to B and B connects to C, then A connects to C" holds, Union-Find efficiently tracks these relationships.

3. **Two-step approach:** First find components (graph problem), then optimize within each component (sorting problem). This separation of concerns simplifies complex problems.

4. **Lexicographically smallest often means sort:** For problems asking for lexicographically smallest arrangement with rearrangement constraints within groups, the solution usually involves sorting elements within each group.

Related problems: [Minimize Hamming Distance After Swap Operations](/problem/minimize-hamming-distance-after-swap-operations), [Process Restricted Friend Requests](/problem/process-restricted-friend-requests), [Largest Number After Digit Swaps by Parity](/problem/largest-number-after-digit-swaps-by-parity)
