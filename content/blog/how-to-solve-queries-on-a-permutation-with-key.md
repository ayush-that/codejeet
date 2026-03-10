---
title: "How to Solve Queries on a Permutation With Key — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Queries on a Permutation With Key. Medium difficulty, 84.9% acceptance rate. Topics: Array, Binary Indexed Tree, Simulation."
date: "2028-05-07"
category: "dsa-patterns"
tags: ["queries-on-a-permutation-with-key", "array", "binary-indexed-tree", "simulation", "medium"]
---

# How to Solve Queries on a Permutation With Key

This problem asks us to process a series of queries on a permutation [1, 2, 3, ..., m]. For each query value, we need to find its current position in the permutation, record that position, and then move that value to the front. The challenge is doing this efficiently when m and the number of queries can be up to 1000, making the naive O(n²) approach borderline acceptable but not ideal for interview standards.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose `m = 5` and `queries = [3, 1, 2, 1]`.

**Initial permutation:** P = [1, 2, 3, 4, 5]

**Query 1: Find value 3**

- Position of 3 in P is index 2 (0-based) → record position 2
- Move 3 to front: P = [3, 1, 2, 4, 5]

**Query 2: Find value 1**

- Position of 1 in P is index 1 → record position 1
- Move 1 to front: P = [1, 3, 2, 4, 5]

**Query 3: Find value 2**

- Position of 2 in P is index 2 → record position 2
- Move 2 to front: P = [2, 1, 3, 4, 5]

**Query 4: Find value 1**

- Position of 1 in P is index 1 → record position 1
- Move 1 to front: P = [1, 2, 3, 4, 5]

**Result:** [2, 1, 2, 1]

The key observation: each query requires us to find a value's current position, which changes as we move elements to the front. A naive approach would scan the array each time, but we can do better.

## Brute Force Approach

The most straightforward solution simulates exactly what the problem describes:

1. Create the initial permutation [1, 2, ..., m]
2. For each query:
   - Find the query value by linear search through the permutation
   - Record its position (0-based or 1-based depending on requirements)
   - Remove the value from its current position
   - Insert it at the beginning

<div class="code-group">

```python
# Time: O(n * m) where n = len(queries), m = initial permutation size
# Space: O(m) for storing the permutation
def processQueriesBrute(queries, m):
    # Step 1: Create initial permutation
    perm = list(range(1, m + 1))
    result = []

    # Step 2: Process each query
    for query in queries:
        # Find position by linear search - O(m)
        pos = perm.index(query)
        result.append(pos)

        # Remove from current position and insert at front
        perm.pop(pos)
        perm.insert(0, query)

    return result
```

```javascript
// Time: O(n * m) where n = queries.length, m = initial permutation size
// Space: O(m) for storing the permutation
function processQueriesBrute(queries, m) {
  // Step 1: Create initial permutation
  const perm = [];
  for (let i = 1; i <= m; i++) {
    perm.push(i);
  }

  const result = [];

  // Step 2: Process each query
  for (const query of queries) {
    // Find position by linear search - O(m)
    const pos = perm.indexOf(query);
    result.push(pos);

    // Remove from current position and insert at front
    perm.splice(pos, 1);
    perm.unshift(query);
  }

  return result;
}
```

```java
// Time: O(n * m) where n = queries.length, m = initial permutation size
// Space: O(m) for storing the permutation
public int[] processQueriesBrute(int[] queries, int m) {
    // Step 1: Create initial permutation
    List<Integer> perm = new ArrayList<>();
    for (int i = 1; i <= m; i++) {
        perm.add(i);
    }

    int[] result = new int[queries.length];

    // Step 2: Process each query
    for (int i = 0; i < queries.length; i++) {
        int query = queries[i];
        // Find position by linear search - O(m)
        int pos = perm.indexOf(query);
        result[i] = pos;

        // Remove from current position and insert at front
        perm.remove(pos);
        perm.add(0, query);
    }

    return result;
}
```

</div>

**Why this is inefficient:** Each query requires O(m) time to find the element and O(m) time to shift elements when moving to front (in worst case). With n queries, this becomes O(n × m). For m, n ≤ 1000, this is 1,000,000 operations which might pass but isn't optimal. In an interview, you should aim for better.

## Optimized Approach

The key insight is that we don't actually need to maintain the full permutation array. We only need to:

1. Quickly find the position of a query value
2. Efficiently move it to the front

We can use a **Fenwick Tree (Binary Indexed Tree)** to solve both problems efficiently. Here's the reasoning:

1. **Initial setup**: Imagine we have an array of size `m + n` (where n = number of queries). The first n positions are empty (reserved for future queries moved to front), and the last m positions hold our initial permutation [1, 2, ..., m].

2. **Position tracking**: For each value (1 to m), we track its current index in this extended array. Initially, value i is at position `n + i - 1`.

3. **Fenwick Tree purpose**: The Fenwick Tree will help us quickly answer: "How many elements are before position X?" This tells us the 0-based position of our query value.

4. **Processing a query**:
   - Get the current index of the query value from our position map
   - Query the Fenwick Tree to count how many elements are before this index → this is our answer
   - Update the Fenwick Tree to "remove" the element from its current position
   - Move the value to a new position at the front (decreasing front index)
   - Update the Fenwick Tree to "add" the element at its new position
   - Update the position map with the new index

This approach gives us O(log(m+n)) per query instead of O(m).

## Optimal Solution

Here's the complete implementation using a Fenwick Tree:

<div class="code-group">

```python
# Time: O(n log(m+n)) where n = len(queries), m = permutation size
# Space: O(m + n) for Fenwick tree and position map
class FenwickTree:
    def __init__(self, size):
        self.size = size
        self.tree = [0] * (size + 1)  # 1-based indexing

    def update(self, index, delta):
        """Add delta to element at index (1-based)"""
        while index <= self.size:
            self.tree[index] += delta
            index += index & -index  # Move to next responsible index

    def query(self, index):
        """Get prefix sum from 1 to index (1-based)"""
        total = 0
        while index > 0:
            total += self.tree[index]
            index -= index & -index  # Move to parent
        return total

def processQueries(queries, m):
    n = len(queries)
    # We need m + n positions: n for front positions, m for initial permutation
    size = m + n

    # Initialize Fenwick Tree - all positions initially have 1 (occupied)
    ft = FenwickTree(size)

    # Position map: value -> current index (1-based)
    # Initially, values are at positions n+1, n+2, ..., n+m
    pos = [0] * (m + 1)  # 1-based for values
    for i in range(1, m + 1):
        pos[i] = n + i
        ft.update(pos[i], 1)  # Mark this position as occupied

    result = []
    front_index = n  # Next available front position (will decrease)

    for query in queries:
        # Step 1: Get current position of query value
        current_pos = pos[query]

        # Step 2: Count how many elements are before current position
        # query() returns count of 1's before and including current_pos
        # We want count BEFORE, so subtract 1
        count_before = ft.query(current_pos) - 1
        result.append(count_before)

        # Step 3: "Remove" element from current position
        ft.update(current_pos, -1)

        # Step 4: Move element to front
        front_index -= 1
        pos[query] = front_index + 1  # Convert to 1-based
        ft.update(pos[query], 1)  # Mark new position as occupied

    return result
```

```javascript
// Time: O(n log(m+n)) where n = queries.length, m = permutation size
// Space: O(m + n) for Fenwick tree and position map
class FenwickTree {
  constructor(size) {
    this.size = size;
    this.tree = new Array(size + 1).fill(0); // 1-based indexing
  }

  update(index, delta) {
    // Add delta to element at index (1-based)
    while (index <= this.size) {
      this.tree[index] += delta;
      index += index & -index; // Move to next responsible index
    }
  }

  query(index) {
    // Get prefix sum from 1 to index (1-based)
    let total = 0;
    while (index > 0) {
      total += this.tree[index];
      index -= index & -index; // Move to parent
    }
    return total;
  }
}

function processQueries(queries, m) {
  const n = queries.length;
  // We need m + n positions: n for front positions, m for initial permutation
  const size = m + n;

  // Initialize Fenwick Tree
  const ft = new FenwickTree(size);

  // Position map: value -> current index (1-based)
  // Initially, values are at positions n+1, n+2, ..., n+m
  const pos = new Array(m + 1).fill(0); // 1-based for values
  for (let i = 1; i <= m; i++) {
    pos[i] = n + i;
    ft.update(pos[i], 1); // Mark this position as occupied
  }

  const result = [];
  let frontIndex = n; // Next available front position (will decrease)

  for (const query of queries) {
    // Step 1: Get current position of query value
    const currentPos = pos[query];

    // Step 2: Count how many elements are before current position
    // query() returns count of 1's before and including currentPos
    // We want count BEFORE, so subtract 1
    const countBefore = ft.query(currentPos) - 1;
    result.push(countBefore);

    // Step 3: "Remove" element from current position
    ft.update(currentPos, -1);

    // Step 4: Move element to front
    frontIndex--;
    pos[query] = frontIndex + 1; // Convert to 1-based
    ft.update(pos[query], 1); // Mark new position as occupied
  }

  return result;
}
```

```java
// Time: O(n log(m+n)) where n = queries.length, m = permutation size
// Space: O(m + n) for Fenwick tree and position map
class FenwickTree {
    private int size;
    private int[] tree;

    public FenwickTree(int size) {
        this.size = size;
        this.tree = new int[size + 1]; // 1-based indexing
    }

    public void update(int index, int delta) {
        // Add delta to element at index (1-based)
        while (index <= size) {
            tree[index] += delta;
            index += index & -index; // Move to next responsible index
        }
    }

    public int query(int index) {
        // Get prefix sum from 1 to index (1-based)
        int total = 0;
        while (index > 0) {
            total += tree[index];
            index -= index & -index; // Move to parent
        }
        return total;
    }
}

public int[] processQueries(int[] queries, int m) {
    int n = queries.length;
    // We need m + n positions: n for front positions, m for initial permutation
    int size = m + n;

    // Initialize Fenwick Tree
    FenwickTree ft = new FenwickTree(size);

    // Position map: value -> current index (1-based)
    // Initially, values are at positions n+1, n+2, ..., n+m
    int[] pos = new int[m + 1]; // 1-based for values
    for (int i = 1; i <= m; i++) {
        pos[i] = n + i;
        ft.update(pos[i], 1); // Mark this position as occupied
    }

    int[] result = new int[n];
    int frontIndex = n; // Next available front position (will decrease)

    for (int i = 0; i < n; i++) {
        int query = queries[i];

        // Step 1: Get current position of query value
        int currentPos = pos[query];

        // Step 2: Count how many elements are before current position
        // query() returns count of 1's before and including currentPos
        // We want count BEFORE, so subtract 1
        int countBefore = ft.query(currentPos) - 1;
        result[i] = countBefore;

        // Step 3: "Remove" element from current position
        ft.update(currentPos, -1);

        // Step 4: Move element to front
        frontIndex--;
        pos[query] = frontIndex + 1; // Convert to 1-based
        ft.update(pos[query], 1); // Mark new position as occupied
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log(m+n))

- We process n queries
- For each query, we perform:
  - Two Fenwick Tree queries (O(log(m+n)) each)
  - Two Fenwick Tree updates (O(log(m+n)) each)
  - Constant time map operations
- Total: O(n log(m+n))

**Space Complexity:** O(m + n)

- Fenwick Tree requires O(m+n) space
- Position map requires O(m) space
- Result array requires O(n) space
- Total: O(m + n)

## Common Mistakes

1. **Off-by-one errors with indexing**: The problem uses 1-based values but 0-based positions in the result. Candidates often confuse these. Remember: the permutation values are 1-based, but the positions we return are 0-based.

2. **Inefficient position finding**: The most common mistake is using linear search (O(m)) for each query instead of maintaining a position map. Even with the Fenwick Tree approach, forgetting to update the position map after moving an element will cause wrong results.

3. **Incorrect Fenwick Tree implementation**: Fenwick Trees are tricky. Common errors include:
   - Using 0-based indexing instead of 1-based
   - Incorrect update/query loop conditions
   - Forgetting that `index & -index` gets the lowest set bit

4. **Not reserving enough space**: For the Fenwick Tree approach, we need m+n positions, not just m. If we only allocate m positions, we have nowhere to "move" elements to the front.

## When You'll See This Pattern

The Fenwick Tree pattern appears in problems where you need to:

1. Efficiently maintain prefix sums
2. Support frequent updates and queries
3. Deal with elements moving or changing positions

Related LeetCode problems:

1. **Count of Smaller Numbers After Self** (Hard): Uses Fenwick Tree to count inversions by processing elements from right to left.
2. **Range Sum Query - Mutable** (Medium): Classic Fenwick Tree application for dynamic range sum queries.
3. **Create Sorted Array through Instructions** (Hard): Similar to this problem - maintaining counts of where elements should go.

## Key Takeaways

1. **When you need to track positions and support move-to-front operations**, consider using a Fenwick Tree with a position map. This gives you O(log n) time for both finding positions and updating them.

2. **The "virtual array" trick** is powerful: instead of physically moving elements in an array (O(n) time), maintain a data structure that represents element positions and can quickly answer "how many elements come before position X?"

3. **Fenwick Trees are worth mastering** for coding interviews. They're less common than hash maps or heaps, but when they fit, they provide elegant O(log n) solutions to problems that seem like they should be O(n).

[Practice this problem on CodeJeet](/problem/queries-on-a-permutation-with-key)
