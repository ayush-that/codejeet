---
title: "How to Solve Checking Existence of Edge Length Limited Paths — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Checking Existence of Edge Length Limited Paths. Hard difficulty, 63.2% acceptance rate. Topics: Array, Two Pointers, Union-Find, Graph Theory, Sorting."
date: "2028-04-21"
category: "dsa-patterns"
tags:
  ["checking-existence-of-edge-length-limited-paths", "array", "two-pointers", "union-find", "hard"]
---

# How to Solve Checking Existence of Edge Length Limited Paths

You're given an undirected graph with weighted edges and need to answer multiple queries asking: "Is there a path between nodes p and q where every edge on the path has weight strictly less than limit?" The challenge is answering many queries efficiently when the graph can have up to 10⁵ edges and 10⁵ queries. The brute force approach of running BFS/DFS for each query would be far too slow. The key insight is that we can process queries in increasing limit order while gradually building up connectivity using only edges below each query's limit.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- n = 4
- edgeList = [[0,1,2],[1,2,4],[2,3,5],[0,3,8]]
- queries = [[0,1,2],[1,3,5],[0,3,3]]

**Step-by-step reasoning:**

1. **Sort queries by limit:** We'll process queries in order of increasing limit:
   - Query 0: [0,1,2] (limit=2)
   - Query 1: [0,3,3] (limit=3)
   - Query 2: [1,3,5] (limit=5)

2. **Sort edges by weight:** edgeList sorted: [[0,1,2],[1,2,4],[2,3,5],[0,3,8]]

3. **Process Query 0 (limit=2):**
   - Add edges with weight < 2: None (smallest edge has weight=2)
   - Check if 0 and 1 are connected: They're not connected yet
   - **Answer: false**

4. **Process Query 1 (limit=3):**
   - Add edges with weight < 3: Edge [0,1,2] (weight=2 < 3)
   - Now nodes 0 and 1 are connected
   - Check if 0 and 3 are connected: Still not connected
   - **Answer: false**

5. **Process Query 2 (limit=5):**
   - Add edges with weight < 5: Edges [1,2,4] (weight=4 < 5) and [2,3,5] (weight=5 is NOT < 5)
   - After adding [1,2,4], we have connected component: {0,1,2}
   - Check if 1 and 3 are connected: Node 3 is still isolated
   - **Answer: false**

**Final answers:** [false, false, false]

Notice how we never disconnected edges - once an edge is added, it stays in our union-find structure. This works because if edges with weight < 3 connect nodes, those same edges certainly have weight < 5, so they should still be connected for the query with limit=5.

## Brute Force Approach

The most straightforward approach is to treat each query independently:

1. For each query [p, q, limit]:
2. Build a graph containing only edges with weight < limit
3. Run BFS/DFS from p to see if q is reachable
4. Return true if reachable, false otherwise

**Why this fails:**

- Time complexity: O(Q × (E + V)) where Q = number of queries, E = edges, V = vertices
- With Q, E up to 10⁵, this becomes O(10¹⁰) operations - far too slow
- We're doing redundant work: rebuilding the graph and re-traversing for each query
- The key observation: queries with smaller limits use subsets of edges used by queries with larger limits

**Brute force code (Python):**

```python
def distanceLimitedPathsExist(n, edgeList, queries):
    # Build adjacency list for each query (too slow!)
    results = []
    for p, q, limit in queries:
        # Build graph with edges < limit
        adj = [[] for _ in range(n)]
        for u, v, w in edgeList:
            if w < limit:
                adj[u].append(v)
                adj[v].append(u)

        # BFS to check connectivity
        visited = [False] * n
        queue = [p]
        visited[p] = True
        found = False

        while queue:
            node = queue.pop(0)
            if node == q:
                found = True
                break
            for neighbor in adj[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)

        results.append(found)
    return results
```

## Optimized Approach

The optimal solution combines two key techniques:

1. **Union-Find (Disjoint Set Union):** Efficiently track connectivity as we add edges
2. **Offline Query Processing:** Sort queries by limit and process them in order

**Key Insight:** If we process queries in increasing order of `limit`, we can:

- Start with an empty graph (no edges connected)
- For each query, add all edges with weight < current query's limit to our union-find structure
- Check if p and q are connected in the current union-find
- Move to next query, adding more edges (but never removing any)

**Why this works:**

- For query with limit L, we need edges with weight < L
- If we've already processed a query with limit L-1, we've already added all edges with weight < L-1
- We only need to add edges with weights in range [L-1, L)
- Since queries are sorted, we process edges in increasing weight order
- Once an edge is added, it remains added for all future queries (with higher limits)

**Step-by-step algorithm:**

1. Sort edges by weight
2. Sort queries by limit, but keep track of original indices
3. Initialize union-find for n nodes
4. Initialize edge index pointer to 0
5. For each query in sorted order:
   - While edge pointer < len(edges) and edge weight < query limit:
     - Union the two nodes of this edge
     - Increment edge pointer
   - Check if query nodes are connected in union-find
   - Store result at original query index
6. Return results in original query order

## Optimal Solution

<div class="code-group">

```python
# Time: O(E log E + Q log Q) where E = edges, Q = queries
# Space: O(n + Q) for union-find and result storage
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
            return False

        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        return True

    def connected(self, x, y):
        return self.find(x) == self.find(y)

def distanceLimitedPathsExist(n, edgeList, queries):
    # Step 1: Sort edges by weight (distance)
    edgeList.sort(key=lambda x: x[2])

    # Step 2: Sort queries by limit, preserving original indices
    # We need to return answers in original query order
    sorted_queries = sorted(enumerate(queries), key=lambda x: x[1][2])

    # Step 3: Initialize union-find and result array
    uf = UnionFind(n)
    result = [False] * len(queries)

    # Step 4: Process edges in increasing weight order
    edge_idx = 0

    # Process each query in sorted order (by limit)
    for query_idx, (p, q, limit) in sorted_queries:
        # Add all edges with weight < current query's limit
        while edge_idx < len(edgeList) and edgeList[edge_idx][2] < limit:
            u, v, _ = edgeList[edge_idx]
            uf.union(u, v)
            edge_idx += 1

        # Check if p and q are connected using only edges with weight < limit
        result[query_idx] = uf.connected(p, q)

    return result
```

```javascript
// Time: O(E log E + Q log Q) where E = edges, Q = queries
// Space: O(n + Q) for union-find and result storage
class UnionFind {
  constructor(n) {
    this.parent = new Array(n);
    this.rank = new Array(n);
    for (let i = 0; i < n; i++) {
      this.parent[i] = i;
      this.rank[i] = 0;
    }
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

    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }

  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

function distanceLimitedPathsExist(n, edgeList, queries) {
  // Step 1: Sort edges by weight (distance)
  edgeList.sort((a, b) => a[2] - b[2]);

  // Step 2: Sort queries by limit, preserving original indices
  // We need to return answers in original query order
  const sortedQueries = queries.map((query, idx) => [idx, query]);
  sortedQueries.sort((a, b) => a[1][2] - b[1][2]);

  // Step 3: Initialize union-find and result array
  const uf = new UnionFind(n);
  const result = new Array(queries.length);

  // Step 4: Process edges in increasing weight order
  let edgeIdx = 0;

  // Process each query in sorted order (by limit)
  for (const [queryIdx, [p, q, limit]] of sortedQueries) {
    // Add all edges with weight < current query's limit
    while (edgeIdx < edgeList.length && edgeList[edgeIdx][2] < limit) {
      const [u, v] = edgeList[edgeIdx];
      uf.union(u, v);
      edgeIdx++;
    }

    // Check if p and q are connected using only edges with weight < limit
    result[queryIdx] = uf.connected(p, q);
  }

  return result;
}
```

```java
// Time: O(E log E + Q log Q) where E = edges, Q = queries
// Space: O(n + Q) for union-find and result storage
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

    public boolean union(int x, int y) {
        // Union by rank
        int rootX = find(x);
        int rootY = find(y);

        if (rootX == rootY) return false;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        return true;
    }

    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}

class Solution {
    public boolean[] distanceLimitedPathsExist(int n, int[][] edgeList, int[][] queries) {
        // Step 1: Sort edges by weight (distance)
        Arrays.sort(edgeList, (a, b) -> Integer.compare(a[2], b[2]));

        // Step 2: Sort queries by limit, preserving original indices
        // We need to return answers in original query order
        int[][] indexedQueries = new int[queries.length][4];
        for (int i = 0; i < queries.length; i++) {
            indexedQueries[i][0] = queries[i][0]; // p
            indexedQueries[i][1] = queries[i][1]; // q
            indexedQueries[i][2] = queries[i][2]; // limit
            indexedQueries[i][3] = i; // original index
        }
        Arrays.sort(indexedQueries, (a, b) -> Integer.compare(a[2], b[2]));

        // Step 3: Initialize union-find and result array
        UnionFind uf = new UnionFind(n);
        boolean[] result = new boolean[queries.length];

        // Step 4: Process edges in increasing weight order
        int edgeIdx = 0;

        // Process each query in sorted order (by limit)
        for (int[] query : indexedQueries) {
            int p = query[0];
            int q = query[1];
            int limit = query[2];
            int originalIdx = query[3];

            // Add all edges with weight < current query's limit
            while (edgeIdx < edgeList.length && edgeList[edgeIdx][2] < limit) {
                int u = edgeList[edgeIdx][0];
                int v = edgeList[edgeIdx][1];
                uf.union(u, v);
                edgeIdx++;
            }

            // Check if p and q are connected using only edges with weight < limit
            result[originalIdx] = uf.connected(p, q);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(E log E + Q log Q)**

- Sorting edges: O(E log E) where E = number of edges
- Sorting queries: O(Q log Q) where Q = number of queries
- Processing edges and queries: O(E + Q) with union-find operations (near-constant time with path compression)
- Total: O(E log E + Q log Q + E + Q) = O(E log E + Q log Q)

**Space Complexity: O(n + Q)**

- Union-Find data structure: O(n) for parent and rank arrays
- Result array: O(Q) for storing answers
- Sorting queries with indices: O(Q) for the indexed query array
- Total: O(n + Q)

The union-find operations are amortized O(α(n)) where α is the inverse Ackermann function (effectively constant for practical n).

## Common Mistakes

1. **Forgetting to preserve original query order:** When sorting queries by limit, you must store the original indices and use them to place answers in the correct positions. The output must match the input query order.

2. **Using ≤ instead of < for edge comparison:** The problem asks for paths where "every edge has distance **strictly less than** limit." Using `edge.weight <= limit` would be incorrect.

3. **Not handling multiple edges between nodes:** The problem states there may be multiple edges between two nodes. Union-find handles this naturally since `union(a, b)` is idempotent - connecting already-connected nodes does nothing.

4. **Inefficient union-find implementation:** Without path compression and union by rank, union-find operations become O(log n) instead of near-constant time. This can significantly impact performance with 10⁵ operations.

5. **Processing queries online instead of offline:** Trying to answer each query independently without sorting them first leads to O(Q × E) time complexity, which is too slow for the constraints.

## When You'll See This Pattern

This "offline queries + union-find + sorting" pattern appears in problems where:

- You have multiple queries about connectivity or component properties
- Queries have a threshold parameter (like "limit" here)
- The answer for a higher threshold depends on answers for lower thresholds

**Related LeetCode problems:**

1. **Checking Existence of Edge Length Limited Paths II (Hard):** The same problem but with dynamic edge additions/deletions, requiring more advanced data structures.

2. **Number of Good Paths (Hard):** Uses union-find with nodes processed in increasing value order, similar to processing edges in increasing weight order here.

3. **Minimum Score of a Path Between Two Cities (Medium):** Finding a path where the maximum edge weight is minimized - uses union-find with edges sorted by weight.

4. **The Earliest Moment When Everyone Becomes Friends (Medium):** Process timestamped events in order, using union-find to track when all nodes become connected.

## Key Takeaways

1. **Offline query processing is powerful:** When queries can be reordered without affecting correctness (and especially when answering later queries helps answer earlier ones), sort them by a parameter and process in optimal order.

2. **Union-find excels at incremental connectivity:** As you add edges one by one, union-find efficiently maintains connectivity information. Combined with sorting, this solves many "threshold-based connectivity" problems.

3. **Look for monotonicity:** If adding more edges/resources can only improve connectivity (never worsen it), you can process in increasing order. This monotonic property is what makes the offline approach work.

4. **Always track original indices when sorting:** When the output must match the input order, store original indices alongside sorted elements.

**Related problems:** [Checking Existence of Edge Length Limited Paths II](/problem/checking-existence-of-edge-length-limited-paths-ii), [Number of Good Paths](/problem/number-of-good-paths), [Minimum Score of a Path Between Two Cities](/problem/minimum-score-of-a-path-between-two-cities)
