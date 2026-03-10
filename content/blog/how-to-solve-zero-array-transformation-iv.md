---
title: "How to Solve Zero Array Transformation IV — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Zero Array Transformation IV. Medium difficulty, 31.0% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-04-20"
category: "dsa-patterns"
tags: ["zero-array-transformation-iv", "array", "dynamic-programming", "medium"]
---

# How to Solve Zero Array Transformation IV

This problem asks us to determine if we can transform an array to all zeros by applying a series of operations. Each operation allows us to decrement selected elements within a range by 1, but we can only perform each operation once. The challenge lies in efficiently checking if the sequence of operations can exactly zero out the array without going negative.

What makes this problem tricky is that operations can overlap in complex ways, and we need to ensure we don't overshoot any element (make it negative) while still reaching zero for all elements. This requires careful planning of operation application order and verifying feasibility.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
nums = [2, 1, 3]
queries = [[0, 1, 1], [1, 2, 2]]
```

We need to check if we can make `nums` all zeros using these operations exactly once each.

**Step 1: Understand the operations**

- Query 0: `[0, 1, 1]` → Can decrement up to 1 element in range [0, 1] (indices 0 and 1)
- Query 1: `[1, 2, 2]` → Can decrement up to 2 elements in range [1, 2] (indices 1 and 2)

**Step 2: Plan the transformation**
We need to reduce:

- Index 0: from 2 to 0 (needs 2 decrements)
- Index 1: from 1 to 0 (needs 1 decrement)
- Index 2: from 3 to 0 (needs 3 decrements)

**Step 3: Check feasibility**
Let's see what operations can affect each index:

- Index 0: Only Query 0 can affect it (max 1 decrement)
- Index 1: Both queries can affect it (Query 0: max 1, Query 1: max 2)
- Index 2: Only Query 1 can affect it (max 2 decrements)

**Step 4: Identify the constraint**
Index 0 needs 2 decrements but Query 0 only provides at most 1 → Impossible!
We don't even need to check the rest - this already shows the transformation is impossible.

**Step 5: Try a feasible example**

```
nums = [1, 2, 1]
queries = [[0, 1, 1], [1, 2, 2]]
```

Needs: Index 0: 1, Index 1: 2, Index 2: 1

This looks possible:

- Use Query 0 on index 0 (1 decrement) and index 1 (1 decrement)
- Use Query 1 on index 1 (1 more decrement) and index 2 (1 decrement)
  Result: All indices reach 0!

## Brute Force Approach

A naive approach would try all possible ways to apply the operations. For each query, we could choose which indices within its range to decrement. With `m` queries and each query covering up to `k` indices, the number of possibilities grows exponentially.

Even if we try a greedy approach (always decrement the largest values first), we might still need to backtrack when we get stuck. The brute force would involve:

1. For each query, try all subsets of indices in its range
2. Apply the decrements
3. Check if we reach all zeros
4. Backtrack if needed

This approach has complexity roughly O((n choose k)^m) which is completely infeasible for typical constraints.

The key insight we need is that we don't need to track which specific indices get decremented - we only need to know if enough decrements are available for each index.

## Optimized Approach

The optimal solution uses a **maximum flow** or **circulation** formulation. Here's the step-by-step reasoning:

1. **Model as a flow network**:
   - Create a source node that supplies the total needed decrements
   - Create sink nodes for each array index that demand their required decrements
   - Create query nodes that can supply decrements to indices in their range

2. **Key constraints**:
   - Each index `i` needs exactly `nums[i]` decrements (its demand)
   - Each query `j` can supply at most `val_j` decrements (its capacity)
   - Query `j` can only supply to indices in range `[l_j, r_j]`

3. **Transformation to circulation problem**:
   We can solve this using a bipartite matching approach with capacities:
   - Left side: Query nodes with capacity `val_j`
   - Right side: Index nodes with demand `nums[i]`
   - Edges: Connect query `j` to all indices `i` where `l_j ≤ i ≤ r_j` with capacity 1 (each decrement affects one index)

4. **Checking feasibility**:
   This becomes a **maximum flow with lower bounds** problem:
   - Total supply (sum of query capacities) must ≥ total demand (sum of nums)
   - Each index must have enough incoming capacity from queries that cover it

5. **Efficient solution**:
   We can use a greedy approach with a priority queue:
   - Process indices from left to right
   - For each index, use available queries that cover it
   - Always use queries that end soonest first (like interval scheduling)

## Optimal Solution

The most efficient approach uses a greedy strategy with a min-heap (priority queue). We process indices in order, maintaining active queries that can affect the current index, and always use the queries that are about to expire first.

<div class="code-group">

```python
# Time: O((n + m) log m) where n = len(nums), m = len(queries)
# Space: O(n + m) for storing queries by start and the heap
def canMakeZeroArray(self, nums, queries):
    """
    Returns True if nums can be transformed to all zeros using queries.

    Each query [l, r, val] means we can decrement up to 'val' elements
    in the range [l, r] by 1. Each query can be used at most once.
    """
    n = len(nums)
    m = len(queries)

    # Step 1: Create adjacency list for queries starting at each index
    # queries_by_start[i] contains all queries that start at index i
    queries_by_start = [[] for _ in range(n)]
    for i, (l, r, val) in enumerate(queries):
        if l < n:  # Only consider queries that start within array bounds
            queries_by_start[l].append((r, val, i))

    # Step 2: Min-heap (priority queue) to store active queries
    # Each element is (end_index, remaining_capacity, query_id)
    # We use min-heap based on end_index to always use queries that expire soonest
    import heapq
    heap = []

    # Step 3: Process each index from left to right
    for i in range(n):
        # Step 3a: Add all queries that start at current index to the heap
        for end, capacity, qid in queries_by_start[i]:
            if capacity > 0:  # Only add queries with remaining capacity
                heapq.heappush(heap, (end, capacity, qid))

        # Step 3b: Current index needs nums[i] decrements
        need = nums[i]

        # Step 3c: Use queries from heap to satisfy this index's need
        while need > 0 and heap:
            # Get the query that ends earliest (most urgent)
            end, capacity, qid = heapq.heappop(heap)

            # Check if this query can still affect current index
            if end < i:
                # Query ended before current index, can't use it
                continue

            # Use as much as possible from this query
            use = min(need, capacity)
            need -= use
            capacity -= use

            # If query still has capacity and hasn't expired, push it back
            if capacity > 0 and end > i:
                heapq.heappush(heap, (end, capacity, qid))

        # Step 3d: If we couldn't satisfy this index's need, return False
        if need > 0:
            return False

        # Step 3e: Clean up queries that end at current index
        # (They will be at the top of the heap since we use min-heap by end index)
        while heap and heap[0][0] <= i:
            heapq.heappop(heap)

    # Step 4: All indices processed successfully
    return True
```

```javascript
// Time: O((n + m) log m) where n = nums.length, m = queries.length
// Space: O(n + m) for storing queries by start and the heap
function canMakeZeroArray(nums, queries) {
  const n = nums.length;
  const m = queries.length;

  // Step 1: Create adjacency list for queries starting at each index
  // queriesByStart[i] contains all queries that start at index i
  const queriesByStart = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i++) {
    const [l, r, val] = queries[i];
    if (l < n) {
      // Only consider queries that start within array bounds
      queriesByStart[l].push([r, val, i]);
    }
  }

  // Step 2: Min-heap (priority queue) to store active queries
  // Each element is [endIndex, remainingCapacity, queryId]
  // We use min-heap based on endIndex to always use queries that expire soonest
  const heap = new MinHeap((a, b) => a[0] - b[0]);

  // Step 3: Process each index from left to right
  for (let i = 0; i < n; i++) {
    // Step 3a: Add all queries that start at current index to the heap
    for (const [end, capacity, qid] of queriesByStart[i]) {
      if (capacity > 0) {
        // Only add queries with remaining capacity
        heap.push([end, capacity, qid]);
      }
    }

    // Step 3b: Current index needs nums[i] decrements
    let need = nums[i];

    // Step 3c: Use queries from heap to satisfy this index's need
    while (need > 0 && heap.size() > 0) {
      // Get the query that ends earliest (most urgent)
      const [end, capacity, qid] = heap.pop();

      // Check if this query can still affect current index
      if (end < i) {
        // Query ended before current index, can't use it
        continue;
      }

      // Use as much as possible from this query
      const use = Math.min(need, capacity);
      need -= use;
      const remainingCapacity = capacity - use;

      // If query still has capacity and hasn't expired, push it back
      if (remainingCapacity > 0 && end > i) {
        heap.push([end, remainingCapacity, qid]);
      }
    }

    // Step 3d: If we couldn't satisfy this index's need, return false
    if (need > 0) {
      return false;
    }

    // Step 3e: Clean up queries that end at current index
    // (They will be at the top of the heap since we use min-heap by end index)
    while (heap.size() > 0 && heap.peek()[0] <= i) {
      heap.pop();
    }
  }

  // Step 4: All indices processed successfully
  return true;
}

// MinHeap implementation for JavaScript
class MinHeap {
  constructor(comparator = (a, b) => a - b) {
    this.heap = [];
    this.comparator = comparator;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return root;
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  bubbleDown(index) {
    const last = this.heap.length - 1;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left <= last && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right <= last && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}
```

```java
// Time: O((n + m) log m) where n = nums.length, m = queries.length
// Space: O(n + m) for storing queries by start and the heap
public boolean canMakeZeroArray(int[] nums, int[][] queries) {
    int n = nums.length;
    int m = queries.length;

    // Step 1: Create adjacency list for queries starting at each index
    // queriesByStart[i] contains all queries that start at index i
    List<List<int[]>> queriesByStart = new ArrayList<>(n);
    for (int i = 0; i < n; i++) {
        queriesByStart.add(new ArrayList<>());
    }

    for (int i = 0; i < m; i++) {
        int l = queries[i][0];
        int r = queries[i][1];
        int val = queries[i][2];
        if (l < n) {  // Only consider queries that start within array bounds
            queriesByStart.get(l).add(new int[]{r, val, i});
        }
    }

    // Step 2: Min-heap (priority queue) to store active queries
    // Each element is [endIndex, remainingCapacity, queryId]
    // We use min-heap based on endIndex to always use queries that expire soonest
    PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);

    // Step 3: Process each index from left to right
    for (int i = 0; i < n; i++) {
        // Step 3a: Add all queries that start at current index to the heap
        for (int[] query : queriesByStart.get(i)) {
            if (query[1] > 0) {  // Only add queries with remaining capacity
                heap.offer(new int[]{query[0], query[1], query[2]});
            }
        }

        // Step 3b: Current index needs nums[i] decrements
        int need = nums[i];

        // Step 3c: Use queries from heap to satisfy this index's need
        while (need > 0 && !heap.isEmpty()) {
            // Get the query that ends earliest (most urgent)
            int[] current = heap.poll();
            int end = current[0];
            int capacity = current[1];
            int qid = current[2];

            // Check if this query can still affect current index
            if (end < i) {
                // Query ended before current index, can't use it
                continue;
            }

            // Use as much as possible from this query
            int use = Math.min(need, capacity);
            need -= use;
            capacity -= use;

            // If query still has capacity and hasn't expired, push it back
            if (capacity > 0 && end > i) {
                heap.offer(new int[]{end, capacity, qid});
            }
        }

        // Step 3d: If we couldn't satisfy this index's need, return false
        if (need > 0) {
            return false;
        }

        // Step 3e: Clean up queries that end at current index
        // (They will be at the top of the heap since we use min-heap by end index)
        while (!heap.isEmpty() && heap.peek()[0] <= i) {
            heap.poll();
        }
    }

    // Step 4: All indices processed successfully
    return true;
}
```

</div>

## Complexity Analysis

**Time Complexity: O((n + m) log m)**

- We process each of the `n` indices once
- Each query is added to the heap once when its start index is reached: O(m log m)
- Each query is removed from the heap at most once: O(m log m)
- In the worst case, we might pop and push a query multiple times as we use partial capacity, but each query is processed O(1) times amortized
- Total: O(n + m log m) operations

**Space Complexity: O(n + m)**

- `queries_by_start` array: O(n) for the outer structure + O(m) for storing all queries
- Heap: O(m) in worst case when many queries are active simultaneously
- Total: O(n + m)

## Common Mistakes

1. **Not checking query bounds**: Forgetting to verify that `l < n` before accessing `queries_by_start[l]` can cause index out of bounds errors when queries start beyond array length.

2. **Incorrect heap ordering**: Using max-heap instead of min-heap, or ordering by something other than end index. The "use queries that end soonest" strategy is crucial for correctness.

3. **Forgetting to clean expired queries**: Not removing queries that have ended (`end <= i`) from the heap can lead to using queries that can no longer affect current or future indices.

4. **Not handling partial query usage**: When a query has more capacity than needed for current index, forgetting to push it back to the heap with remaining capacity means losing available decrements for future indices.

## When You'll See This Pattern

This greedy interval scheduling pattern with a priority queue appears in several types of problems:

1. **Meeting Rooms II (LeetCode 253)**: Similar concept of tracking active intervals and always using the one that ends earliest to minimize resources.

2. **Maximum Number of Events That Can Be Attended (LeetCode 1353)**: Almost identical pattern - process days in order, use a min-heap to track available events that end soonest.

3. **Course Schedule III (LeetCode 630)**: Another variation where you schedule courses with deadlines, always replacing longer courses with shorter ones when needed.

The core pattern is: **"Process items in sorted order, maintain active candidates in a heap, always use the most urgent/constrained ones first."**

## Key Takeaways

1. **Greedy with priority queue is powerful**: When you need to allocate limited resources (queries) to demands (indices) with constraints (ranges), processing in order and using a min-heap to track available resources often yields optimal solutions.

2. **Think in terms of coverage**: Instead of tracking exact assignments, think about whether each index has enough "coverage" from queries that include it. This abstraction simplifies complex assignment problems.

3. **Always use soonest-expiring resources first**: This is a general principle in interval scheduling problems - using resources that will become unavailable soonest minimizes waste and maximizes flexibility.

Related problems: [Zero Array Transformation I](/problem/zero-array-transformation-i), [Zero Array Transformation II](/problem/zero-array-transformation-ii), [Zero Array Transformation III](/problem/zero-array-transformation-iii)
