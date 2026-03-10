---
title: "How to Solve Count Pairs Of Nodes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Pairs Of Nodes. Hard difficulty, 42.5% acceptance rate. Topics: Array, Hash Table, Two Pointers, Binary Search, Graph Theory."
date: "2026-06-02"
category: "dsa-patterns"
tags: ["count-pairs-of-nodes", "array", "hash-table", "two-pointers", "hard"]
---

# How to Solve Count Pairs Of Nodes

This problem asks us to count pairs of nodes `(a, b)` where `a < b` and the number of edges incident to either node exceeds a query threshold. The challenge lies in efficiently computing these "incident edge counts" for all node pairs without explicitly checking all O(n²) pairs for each query, which would be far too slow.

## Visual Walkthrough

Let's trace through a small example:

- `n = 4`, `edges = [[1,2],[2,3],[3,4],[1,4],[1,3]]`
- `queries = [2, 3, 4]`

First, compute each node's degree (number of incident edges):

- Node 1: edges to 2, 4, 3 → degree = 3
- Node 2: edges to 1, 3 → degree = 2
- Node 3: edges to 2, 4, 1 → degree = 3
- Node 4: edges to 3, 1 → degree = 2

The incident count for pair `(a,b)` is `degree[a] + degree[b] - count(a,b)`, where `count(a,b)` is the number of edges between a and b (0 or 1 in simple graphs, but can be more with duplicate edges).

For query = 2:

- `(1,2)`: 3 + 2 - 1 = 4 > 2 ✓
- `(1,3)`: 3 + 3 - 1 = 5 > 2 ✓
- `(1,4)`: 3 + 2 - 1 = 4 > 2 ✓
- `(2,3)`: 2 + 3 - 1 = 4 > 2 ✓
- `(2,4)`: 2 + 2 - 0 = 4 > 2 ✓
- `(3,4)`: 3 + 2 - 1 = 4 > 2 ✓
  All 6 pairs satisfy query=2.

For query = 3:

- `(1,2)`: 4 > 3 ✓
- `(1,3)`: 5 > 3 ✓
- `(1,4)`: 4 > 3 ✓
- `(2,3)`: 4 > 3 ✓
- `(2,4)`: 4 > 3 ✓
- `(3,4)`: 4 > 3 ✓
  All 6 pairs satisfy query=3.

For query = 4:

- `(1,2)`: 4 = 4 ✗ (needs strictly greater)
- `(1,3)`: 5 > 4 ✓
- `(1,4)`: 4 = 4 ✗
- `(2,3)`: 4 = 4 ✗
- `(2,4)`: 4 = 4 ✗
- `(3,4)`: 4 = 4 ✗
  Only 1 pair satisfies query=4.

The key insight: we can't compute this naively for each query because with n up to 2×10⁴ and queries up to 2×10⁴, O(n² × q) is impossible.

## Brute Force Approach

A naive solution would:

1. Compute degrees for all nodes
2. For each query, check all n×(n-1)/2 pairs
3. For each pair, compute `degree[a] + degree[b] - count(a,b)` and compare to query

This is O(q × n²), which with n=2×10⁴ and q=2×10⁴ would be ~4×10¹² operations — completely infeasible.

Even computing `count(a,b)` efficiently requires storing edges in a hash map, but the pair checking still dominates.

## Optimized Approach

The optimization uses two key ideas:

1. **Two-pointer technique on sorted degrees**:
   - Sort the degrees array
   - For a given query q, count pairs where `degree[a] + degree[b] > q` using two pointers
   - This gives O(n log n) per query instead of O(n²)

2. **Adjust for direct edges**:
   - The formula `degree[a] + degree[b] - count(a,b) > q` is equivalent to `degree[a] + degree[b] > q + count(a,b)`
   - For each direct edge between a and b, if `degree[a] + degree[b] > q` but `degree[a] + degree[b] ≤ q + count(a,b)`, we overcounted and need to subtract 1
   - We can preprocess all edges and for each query, check only edges where this condition holds

The algorithm:

1. Compute degrees and sort them
2. For each query:
   - Use two pointers to count pairs with `degree[a] + degree[b] > q`
   - Subtract overcounted pairs using the edge adjustment
3. Return results for all queries

## Optimal Solution

<div class="code-group">

```python
# Time: O((n + q) log n + e) where e = number of edges
# Space: O(n + e)
def countPairs(n, edges, queries):
    # Step 1: Compute degree for each node (1-indexed)
    degree = [0] * (n + 1)
    # Step 2: Count edges between each pair (for duplicate edges)
    edge_count = {}

    for u, v in edges:
        # Ensure u < v for consistent key
        if u > v:
            u, v = v, u
        degree[u] += 1
        degree[v] += 1
        # Track how many edges connect u and v
        key = (u, v)
        edge_count[key] = edge_count.get(key, 0) + 1

    # Step 3: Create sorted list of degrees (excluding index 0)
    sorted_deg = sorted(degree[1:])

    # Step 4: Precompute answer for each query using two pointers
    result = []
    for q in queries:
        # Count pairs where degree[i] + degree[j] > q
        count = 0
        left, right = 0, n - 1

        while left < right:
            if sorted_deg[left] + sorted_deg[right] > q:
                # All pairs with current left and any right from left+1 to right work
                count += (right - left)
                right -= 1
            else:
                left += 1

        # Step 5: Adjust for direct edges
        # For each edge (u,v), if we counted it but degree[u]+degree[v]-cnt <= q,
        # we need to subtract 1
        for (u, v), cnt in edge_count.items():
            total = degree[u] + degree[v]
            if total > q and total - cnt <= q:
                count -= 1

        result.append(count)

    return result
```

```javascript
// Time: O((n + q) log n + e) where e = number of edges
// Space: O(n + e)
function countPairs(n, edges, queries) {
  // Step 1: Compute degree for each node (1-indexed)
  const degree = new Array(n + 1).fill(0);
  // Step 2: Count edges between each pair
  const edgeCount = new Map();

  for (const [u, v] of edges) {
    let a = u,
      b = v;
    // Ensure a < b for consistent key
    if (a > b) [a, b] = [b, a];
    degree[a]++;
    degree[b]++;
    // Track edge count
    const key = `${a},${b}`;
    edgeCount.set(key, (edgeCount.get(key) || 0) + 1);
  }

  // Step 3: Create sorted list of degrees (excluding index 0)
  const sortedDeg = degree.slice(1).sort((a, b) => a - b);

  // Step 4: Precompute answer for each query using two pointers
  const result = [];
  for (const q of queries) {
    // Count pairs where degree[i] + degree[j] > q
    let count = 0;
    let left = 0,
      right = n - 1;

    while (left < right) {
      if (sortedDeg[left] + sortedDeg[right] > q) {
        // All pairs with current left and any right from left+1 to right work
        count += right - left;
        right--;
      } else {
        left++;
      }
    }

    // Step 5: Adjust for direct edges
    for (const [key, cnt] of edgeCount.entries()) {
      const [a, b] = key.split(",").map(Number);
      const total = degree[a] + degree[b];
      if (total > q && total - cnt <= q) {
        count--;
      }
    }

    result.push(count);
  }

  return result;
}
```

```java
// Time: O((n + q) log n + e) where e = number of edges
// Space: O(n + e)
class Solution {
    public int[] countPairs(int n, int[][] edges, int[] queries) {
        // Step 1: Compute degree for each node (1-indexed)
        int[] degree = new int[n + 1];
        // Step 2: Count edges between each pair
        Map<String, Integer> edgeCount = new HashMap<>();

        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            // Ensure u < v for consistent key
            if (u > v) {
                int temp = u;
                u = v;
                v = temp;
            }
            degree[u]++;
            degree[v]++;
            // Track edge count
            String key = u + "," + v;
            edgeCount.put(key, edgeCount.getOrDefault(key, 0) + 1);
        }

        // Step 3: Create sorted list of degrees (excluding index 0)
        int[] sortedDeg = new int[n];
        for (int i = 1; i <= n; i++) {
            sortedDeg[i - 1] = degree[i];
        }
        Arrays.sort(sortedDeg);

        // Step 4: Precompute answer for each query using two pointers
        int[] result = new int[queries.length];
        for (int idx = 0; idx < queries.length; idx++) {
            int q = queries[idx];
            // Count pairs where degree[i] + degree[j] > q
            int count = 0;
            int left = 0, right = n - 1;

            while (left < right) {
                if (sortedDeg[left] + sortedDeg[right] > q) {
                    // All pairs with current left and any right from left+1 to right work
                    count += (right - left);
                    right--;
                } else {
                    left++;
                }
            }

            // Step 5: Adjust for direct edges
            for (Map.Entry<String, Integer> entry : edgeCount.entrySet()) {
                String[] parts = entry.getKey().split(",");
                int u = Integer.parseInt(parts[0]);
                int v = Integer.parseInt(parts[1]);
                int cnt = entry.getValue();
                int total = degree[u] + degree[v];
                if (total > q && total - cnt <= q) {
                    count--;
                }
            }

            result[idx] = count;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Computing degrees and edge counts: O(e) where e is number of edges
- Sorting degrees: O(n log n)
- For each query: O(n) for two-pointer scan + O(e) for edge adjustment
- Total: O((n + q) log n + e + q×e) in worst case

**Space Complexity:**

- O(n) for degrees array
- O(e) for edge count map
- O(n) for sorted degrees
- Total: O(n + e)

The edge adjustment step could be O(q×e) in worst case, but we can optimize by:

1. Precomputing for each edge the value `degree[u] + degree[v]`
2. Sorting edges by this value
3. Using binary search to find which edges need adjustment for each query

This would give O((n + q) log n + e log e) time.

## Common Mistakes

1. **Forgetting to handle duplicate edges**: The problem doesn't specify the graph is simple. Multiple edges between the same nodes affect the `count(a,b)` term. Always check for duplicates.

2. **Off-by-one with 1-indexed nodes**: The nodes are numbered 1 to n, but arrays are 0-indexed. Mixing these up leads to index errors.

3. **Incorrect two-pointer logic**: When `sortedDeg[left] + sortedDeg[right] > q`, it's tempting to count `(right-left+1)` or `(right-left)`. The correct count is `(right-left)` because we've already counted the pair `(left,right)` in previous iterations.

4. **Missing the edge adjustment**: Counting only `degree[a] + degree[b] > q` without subtracting cases where `degree[a] + degree[b] - count(a,b) ≤ q` gives wrong results for pairs with direct edges.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Two-pointer technique on sorted arrays**: Used in problems like "Two Sum II" (LeetCode 167) and "3Sum" (LeetCode 15) to find pairs satisfying a condition.

2. **Graph degree computations**: Similar to problems about node connectivity like "Find the Town Judge" (LeetCode 997).

3. **Adjustment/correction approach**: When a formula has multiple terms, sometimes it's easier to compute an approximation and then correct for special cases. This appears in problems like "Count Number of Nice Subarrays" (LeetCode 1248).

## Key Takeaways

1. **Break complex formulas into parts**: When faced with `degree[a] + degree[b] - count(a,b) > q`, compute `degree[a] + degree[b] > q` first, then adjust for the `-count(a,b)` term.

2. **Sorting enables efficient pair counting**: The two-pointer technique on sorted data reduces O(n²) pair checking to O(n).

3. **Preprocess and reuse computations**: Compute degrees and edge counts once, then use them for all queries rather than recomputing for each query.

[Practice this problem on CodeJeet](/problem/count-pairs-of-nodes)
