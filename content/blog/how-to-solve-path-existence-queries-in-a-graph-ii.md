---
title: "How to Solve Path Existence Queries in a Graph II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Path Existence Queries in a Graph II. Hard difficulty, 26.2% acceptance rate. Topics: Array, Two Pointers, Binary Search, Dynamic Programming, Greedy."
date: "2026-09-13"
category: "dsa-patterns"
tags: ["path-existence-queries-in-a-graph-ii", "array", "two-pointers", "binary-search", "hard"]
---

# How to Solve Path Existence Queries in a Graph II

This problem presents a unique graph connectivity challenge where edges aren't given explicitly but are defined by a value-based condition. You have `n` nodes where an edge exists between nodes `i` and `j` if `|nums[i] - nums[j]| ≤ maxDiff`. The task is to answer multiple queries about whether a path exists between two nodes. What makes this tricky is that we can't afford to build the full graph explicitly for large `n`, and we need to answer queries efficiently.

## Visual Walkthrough

Let's trace through a small example: `n = 5`, `nums = [3, 8, 1, 5, 9]`, `maxDiff = 3`, and queries `[[0,4], [1,3]]`.

First, let's understand which edges exist:

- Node 0 (value 3) connects to: node 2 (|3-1|=2≤3), node 3 (|3-5|=2≤3)
- Node 1 (value 8) connects to: node 4 (|8-9|=1≤3)
- Node 2 (value 1) connects to: node 0 (|1-3|=2≤3), node 3 (|1-5|=4>3 ✗)
- Node 3 (value 5) connects to: node 0 (|5-3|=2≤3), node 4 (|5-9|=4>3 ✗)
- Node 4 (value 9) connects to: node 1 (|9-8|=1≤3)

The graph has two connected components: {0, 2, 3} and {1, 4}.

Now for the queries:

1. Query [0,4]: Node 0 is in component {0,2,3}, node 4 is in {1,4} → No path exists
2. Query [1,3]: Node 1 is in {1,4}, node 3 is in {0,2,3} → No path exists

The challenge is doing this efficiently without explicitly building all edges, which would be O(n²).

## Brute Force Approach

A naive approach would be:

1. Build the complete adjacency list by checking all O(n²) pairs
2. Run BFS/DFS for each query to check connectivity

The code would look like this:

<div class="code-group">

```python
# Time: O(n² + q*(n+m)) | Space: O(n²)
def brute_force(n, nums, maxDiff, queries):
    # Step 1: Build graph (O(n²))
    graph = [[] for _ in range(n)]
    for i in range(n):
        for j in range(i+1, n):
            if abs(nums[i] - nums[j]) <= maxDiff:
                graph[i].append(j)
                graph[j].append(i)

    # Step 2: Answer queries with BFS (O(q*(n+m)))
    results = []
    for u, v in queries:
        visited = [False] * n
        queue = [u]
        visited[u] = True
        found = False

        while queue:
            node = queue.pop(0)
            if node == v:
                found = True
                break
            for neighbor in graph[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    queue.append(neighbor)

        results.append(found)

    return results
```

```javascript
// Time: O(n² + q*(n+m)) | Space: O(n²)
function bruteForce(n, nums, maxDiff, queries) {
  // Step 1: Build graph (O(n²))
  const graph = Array(n)
    .fill()
    .map(() => []);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(nums[i] - nums[j]) <= maxDiff) {
        graph[i].push(j);
        graph[j].push(i);
      }
    }
  }

  // Step 2: Answer queries with BFS (O(q*(n+m)))
  const results = [];
  for (const [u, v] of queries) {
    const visited = Array(n).fill(false);
    const queue = [u];
    visited[u] = true;
    let found = false;

    while (queue.length > 0) {
      const node = queue.shift();
      if (node === v) {
        found = true;
        break;
      }
      for (const neighbor of graph[node]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      }
    }

    results.push(found);
  }

  return results;
}
```

```java
// Time: O(n² + q*(n+m)) | Space: O(n²)
public List<Boolean> bruteForce(int n, int[] nums, int maxDiff, int[][] queries) {
    // Step 1: Build graph (O(n²))
    List<Integer>[] graph = new List[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new ArrayList<>();
    }

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (Math.abs(nums[i] - nums[j]) <= maxDiff) {
                graph[i].add(j);
                graph[j].add(i);
            }
        }
    }

    // Step 2: Answer queries with BFS (O(q*(n+m)))
    List<Boolean> results = new ArrayList<>();
    for (int[] query : queries) {
        int u = query[0], v = query[1];
        boolean[] visited = new boolean[n];
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(u);
        visited[u] = true;
        boolean found = false;

        while (!queue.isEmpty()) {
            int node = queue.poll();
            if (node == v) {
                found = true;
                break;
            }
            for (int neighbor : graph[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
            }
        }

        results.add(found);
    }

    return results;
}
```

</div>

**Why this fails:** With n up to 10⁵, O(n²) is 10¹⁰ operations — far too slow. We need O(n log n) or better.

## Optimized Approach

The key insight is that connectivity depends on values being within `maxDiff` of each other. If we sort nodes by their values, then:

- A node can only connect to other nodes whose values are within `maxDiff` range
- This creates "value windows" where nodes are connected if they're close enough in value

Think of it this way: If we have sorted values `[1, 3, 5, 8, 9]` with `maxDiff = 3`:

- Value 1 connects to values ≤ 4 (so 1, 3)
- Value 3 connects to values between 0-6 (so 1, 3, 5)
- Value 5 connects to values between 2-8 (so 3, 5, 8)
- Value 8 connects to values between 5-11 (so 5, 8, 9)
- Value 9 connects to values ≥ 6 (so 8, 9)

This creates a chain of connectivity! The critical observation: **In sorted order, if each node connects to the next node (when their values are within maxDiff), we get transitive connectivity across the entire range.**

So the algorithm becomes:

1. Sort nodes by their values, keeping track of original indices
2. Use two pointers to find connected components in the sorted array
3. Assign component IDs to each node
4. Answer queries in O(1) by checking if nodes have the same component ID

## Optimal Solution

Here's the complete solution using the two-pointer approach:

<div class="code-group">

```python
# Time: O(n log n + q) | Space: O(n)
def solve(n, nums, maxDiff, queries):
    # Step 1: Create list of (value, original_index) pairs and sort by value
    # This allows us to process nodes in value order while tracking original positions
    nodes = [(nums[i], i) for i in range(n)]
    nodes.sort()  # O(n log n) - sort by value

    # Step 2: Use two pointers to find connected components in sorted order
    # Two pointers will expand/contract a window where all values are within maxDiff
    component_id = [-1] * n  # Store component ID for each original node
    current_component = 0
    left = 0

    for right in range(n):
        # If current window's max-min > maxDiff, shrink from left
        # This ensures all nodes in current window can connect to each other
        while nodes[right][0] - nodes[left][0] > maxDiff:
            left += 1

        # If we've moved past the previous component, start a new one
        # This happens when the gap between values is too large
        if right == 0 or nodes[right][0] - nodes[right-1][0] > maxDiff:
            # Check if we need to start new component
            # The key insight: if current node can't connect to previous,
            # we need a new component
            if nodes[right][0] - nodes[right-1][0] > maxDiff:
                current_component += 1

        # Assign current component to this node's original index
        original_index = nodes[right][1]
        component_id[original_index] = current_component

    # Step 3: Answer queries in O(1) by comparing component IDs
    # Two nodes are connected iff they're in the same component
    results = []
    for u, v in queries:
        results.append(component_id[u] == component_id[v])

    return results
```

```javascript
// Time: O(n log n + q) | Space: O(n)
function solve(n, nums, maxDiff, queries) {
  // Step 1: Create array of objects with value and original index, then sort
  const nodes = nums.map((value, index) => ({ value, index }));
  nodes.sort((a, b) => a.value - b.value); // O(n log n)

  // Step 2: Two-pointer approach to find connected components
  const componentId = new Array(n).fill(-1);
  let currentComponent = 0;
  let left = 0;

  for (let right = 0; right < n; right++) {
    // Shrink window from left if values differ by more than maxDiff
    // This maintains a valid connected window
    while (nodes[right].value - nodes[left].value > maxDiff) {
      left++;
    }

    // Start new component if gap from previous node is too large
    // This handles disconnected components in the sorted order
    if (right > 0 && nodes[right].value - nodes[right - 1].value > maxDiff) {
      currentComponent++;
    }

    // Assign component to the original node index
    const originalIndex = nodes[right].index;
    componentId[originalIndex] = currentComponent;
  }

  // Step 3: Answer queries by comparing component IDs
  const results = [];
  for (const [u, v] of queries) {
    results.push(componentId[u] === componentId[v]);
  }

  return results;
}
```

```java
// Time: O(n log n + q) | Space: O(n)
public List<Boolean> solve(int n, int[] nums, int maxDiff, int[][] queries) {
    // Step 1: Create and sort nodes by value while keeping original indices
    int[][] nodes = new int[n][2];  // [value, original_index]
    for (int i = 0; i < n; i++) {
        nodes[i][0] = nums[i];
        nodes[i][1] = i;
    }
    Arrays.sort(nodes, (a, b) -> Integer.compare(a[0], b[0]));  // O(n log n)

    // Step 2: Two-pointer sliding window to identify components
    int[] componentId = new int[n];
    Arrays.fill(componentId, -1);
    int currentComponent = 0;
    int left = 0;

    for (int right = 0; right < n; right++) {
        // Maintain window where all values are within maxDiff
        while (nodes[right][0] - nodes[left][0] > maxDiff) {
            left++;
        }

        // Check if we need to start a new component
        // New component starts when we can't connect to previous node
        if (right > 0 && nodes[right][0] - nodes[right - 1][0] > maxDiff) {
            currentComponent++;
        }

        // Map back to original index
        int originalIndex = nodes[right][1];
        componentId[originalIndex] = currentComponent;
    }

    // Step 3: Answer queries in constant time
    List<Boolean> results = new ArrayList<>();
    for (int[] query : queries) {
        int u = query[0], v = query[1];
        results.add(componentId[u] == componentId[v]);
    }

    return results;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + q)**

- Sorting the nodes takes O(n log n)
- The two-pointer pass is O(n) — each node is processed once, and `left` pointer only moves forward
- Answering q queries takes O(q)
- Total: O(n log n + q)

**Space Complexity: O(n)**

- We store the sorted nodes array: O(n)
- We store component IDs for each node: O(n)
- Total: O(n)

## Common Mistakes

1. **Forgetting to map back to original indices**: When we sort by value, we lose the original node numbering. Always store and use the original indices to answer queries correctly.

2. **Incorrect component boundary detection**: The condition `nodes[right][0] - nodes[right-1][0] > maxDiff` is subtle but crucial. It detects when we can't form an edge between consecutive sorted nodes, indicating a new component.

3. **Using union-find unnecessarily**: While union-find could work, it would require O(n²) edge checks or clever windowing. The two-pointer approach is more direct and efficient for this specific connectivity condition.

4. **Misunderstanding the connectivity condition**: Remember it's "≤ maxDiff", not "< maxDiff". This affects the window condition in the two-pointer approach.

## When You'll See This Pattern

This problem combines sorting with connectivity analysis — a pattern that appears in several graph problems:

1. **Meeting Rooms II (LeetCode 253)**: Similar "sort by time and use pointers to track overlaps" approach
2. **Merge Intervals (LeetCode 56)**: Sorting and then merging overlapping ranges
3. **Car Fleet (LeetCode 853)**: Sorting by position and analyzing connectivity based on speed differences

The core pattern is: when connectivity depends on a numeric condition (like value differences), sort first to bring related items together, then use a sliding window or greedy approach to determine connectivity.

## Key Takeaways

1. **Sorting transforms value-based connectivity into positional connectivity**: Once sorted, nodes that can connect form contiguous ranges, making the problem tractable.

2. **Two-pointer sliding windows efficiently find connected components**: When connectivity depends on values being within a range, a sliding window can identify all connected nodes in linear time.

3. **Store original indices when sorting**: Always keep track of original positions when you need to map results back to the original input ordering.

[Practice this problem on CodeJeet](/problem/path-existence-queries-in-a-graph-ii)
