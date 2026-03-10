---
title: "How to Solve Booking Concert Tickets in Groups — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Booking Concert Tickets in Groups. Hard difficulty, 19.2% acceptance rate. Topics: Binary Search, Design, Binary Indexed Tree, Segment Tree."
date: "2026-06-05"
category: "dsa-patterns"
tags:
  ["booking-concert-tickets-in-groups", "binary-search", "design", "binary-indexed-tree", "hard"]
---

# How to Solve Booking Concert Tickets in Groups

This problem asks you to design a ticketing system that can allocate seats for groups in a concert hall with `n` rows and `m` seats per row. The system must handle two operations: `gather(k, maxRow)` which tries to seat `k` people together in a single row at or before `maxRow`, and `scatter(k, maxRow)` which tries to seat `k` people individually (not necessarily together) across rows at or before `maxRow`. What makes this problem challenging is that you need to support both operations efficiently while tracking seat availability in real-time as tickets are booked.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we have `n = 3` rows with `m = 5` seats each:

```
Row 0: [0, 0, 0, 0, 0]  (5 available)
Row 1: [0, 0, 0, 0, 0]  (5 available)
Row 2: [0, 0, 0, 0, 0]  (5 available)
```

**Operation 1:** `gather(3, 1)` - Try to seat 3 people together in rows 0-1.

The system checks row 0: has 5 consecutive seats? Yes. It returns `[0, 0]` (row 0, starting at seat 0) and marks those seats as taken:

```
Row 0: [1, 1, 1, 0, 0]  (2 available)
Row 1: [0, 0, 0, 0, 0]  (5 available)
Row 2: [0, 0, 0, 0, 0]  (5 available)
```

**Operation 2:** `scatter(4, 2)` - Try to seat 4 people individually in rows 0-2.

The system checks total available seats in rows 0-2: row 0 has 2, row 1 has 5, row 2 has 5 = 12 total. Since 12 ≥ 4, it can proceed. It allocates from left to right, row by row:

- Row 0: seats 3 and 4 (2 people)
- Row 1: seats 0 and 1 (2 people)

```
Row 0: [1, 1, 1, 1, 1]  (0 available)
Row 1: [1, 1, 0, 0, 0]  (3 available)
Row 2: [0, 0, 0, 0, 0]  (5 available)
```

**Operation 3:** `gather(2, 2)` - Try to seat 2 people together in rows 0-2.

The system checks row 0: no consecutive seats (0 available). Row 1: has 3 consecutive seats starting at seat 2? Yes. Returns `[1, 2]` and updates:

```
Row 0: [1, 1, 1, 1, 1]  (0 available)
Row 1: [1, 1, 1, 1, 0]  (1 available)
Row 2: [0, 0, 0, 0, 0]  (5 available)
```

The key insight is that for `gather`, we need to quickly find a row with enough consecutive seats, and for `scatter`, we need to quickly calculate total available seats in a range of rows and allocate them efficiently.

## Brute Force Approach

A naive approach would store the seat matrix as a 2D array and scan through rows for each operation:

- **For `gather(k, maxRow)`**: Iterate through rows 0 to `maxRow`, and for each row, scan through seats to find `k` consecutive empty seats. This takes O(maxRow × m) time per operation.
- **For `scatter(k, maxRow)`**: First, count total empty seats by scanning all rows 0 to `maxRow` and all seats in each row (O(maxRow × m)). If enough seats exist, allocate them by scanning again and marking seats as taken until `k` seats are allocated.

The brute force approach is too slow because `n` and `m` can be up to 5×10⁴, making operations potentially O(5×10⁴ × 5×10⁴) = O(2.5×10⁹), which is infeasible. We need operations to be logarithmic or better.

## Optimized Approach

The core optimization uses two data structures:

1. **Segment Tree for Consecutive Seats**: For `gather`, we need to quickly find the leftmost row ≤ `maxRow` that has at least `k` consecutive empty seats. We can use a segment tree where each node stores:
   - `max_consecutive`: Maximum number of consecutive empty seats in that row range
   - `left_consecutive`: Consecutive empty seats starting from the leftmost seat
   - `right_consecutive`: Consecutive empty seats ending at the rightmost seat
   - `total_seats`: Total seats in the range (fixed)
   - `total_empty`: Total empty seats in the range

   This allows us to query in O(log n) time whether any row in a range has `k` consecutive seats.

2. **Binary Indexed Tree (Fenwick Tree) for Total Empty Seats**: For `scatter`, we need to:
   - Quickly get the sum of empty seats in rows 0 to `maxRow` (to check if scattering is possible)
   - Efficiently update empty seat counts when seats are booked
   - Find the specific rows and seats to allocate

   A Fenwick tree gives us O(log n) range sum queries and updates.

**Key Insight for `gather`**: When querying for `k` consecutive seats, we traverse the segment tree to find the leftmost row that satisfies the condition. Once found, we need to locate the starting seat position within that row. We can do this by maintaining for each row a balanced structure (like a sorted list of empty seat intervals) or by using binary search on a bitmask representation of the row.

**Key Insight for `scatter`**: We can allocate seats greedily from left to right, row by row. Using the Fenwick tree, we find how many seats to take from each row: if a row has `available` seats, we take `min(available, remaining_k)`. To track which specific seats are taken, we maintain a pointer for each row indicating the next available seat.

## Optimal Solution

We'll implement a solution using:

- A segment tree for `max_consecutive` queries
- A Fenwick tree for prefix sums of empty seats
- An array `next_seat` to track the next available seat in each row
- An array `seats` to represent each row's occupancy (as a bitmask or boolean array)

<div class="code-group">

```python
class BookMyShow:
    # Time: O(log n) for gather, O(log n + k/m) for scatter
    # Space: O(n + m) for storing seat states and trees

    def __init__(self, n: int, m: int):
        self.n = n
        self.m = m
        # Segment tree nodes: each stores (max_consecutive, left_consecutive, right_consecutive, total_empty)
        self.seg_tree = [(0, 0, 0, 0) for _ in range(4 * n)]
        # Fenwick tree for prefix sums of empty seats
        self.fenwick = [0] * (n + 1)
        # Next available seat index for each row
        self.next_seat = [0] * n
        # Build initial trees
        self._build_seg_tree(0, 0, n - 1)
        for i in range(n):
            self._update_fenwick(i, m)

    def _build_seg_tree(self, idx: int, l: int, r: int):
        """Build segment tree with initial empty rows"""
        if l == r:
            # Leaf node: entire row is empty
            self.seg_tree[idx] = (self.m, self.m, self.m, self.m)
            return

        mid = (l + r) // 2
        self._build_seg_tree(2 * idx + 1, l, mid)
        self._build_seg_tree(2 * idx + 2, mid + 1, r)
        self._push_up(idx, l, r)

    def _push_up(self, idx: int, l: int, r: int):
        """Update parent node from children"""
        if l == r:
            return

        left_child = self.seg_tree[2 * idx + 1]
        right_child = self.seg_tree[2 * idx + 2]
        mid = (l + r) // 2

        total_empty = left_child[3] + right_child[3]

        # Calculate left_consecutive: if left child's left_consecutive spans entire left segment,
        # we can extend into right child's left_consecutive
        left_consecutive = left_child[1]
        if left_child[1] == (mid - l + 1) * self.m // (mid - l + 1):  # Entire left segment is empty
            left_consecutive += right_child[1]

        # Calculate right_consecutive similarly
        right_consecutive = right_child[2]
        if right_child[2] == (r - mid) * self.m // (r - mid):  # Entire right segment is empty
            right_consecutive += left_child[2]

        # max_consecutive is max of children's max_consecutive and cross-boundary consecutive
        max_consecutive = max(left_child[0], right_child[0], left_child[2] + right_child[1])

        self.seg_tree[idx] = (max_consecutive, left_consecutive, right_consecutive, total_empty)

    def _update_fenwick(self, i: int, delta: int):
        """Update Fenwick tree at index i with delta"""
        i += 1
        while i <= self.n:
            self.fenwick[i] += delta
            i += i & -i

    def _query_fenwick(self, i: int) -> int:
        """Query prefix sum up to index i"""
        res = 0
        i += 1
        while i > 0:
            res += self.fenwick[i]
            i -= i & -i
        return res

    def _query_seg_tree(self, idx: int, l: int, r: int, maxRow: int, k: int) -> int:
        """Find leftmost row <= maxRow with at least k consecutive seats.
           Returns row index or -1 if not found."""
        if self.seg_tree[idx][0] < k or l > maxRow:
            return -1

        if l == r:
            return l

        mid = (l + r) // 2
        # Check left child first (to find leftmost row)
        left_res = self._query_seg_tree(2 * idx + 1, l, mid, maxRow, k)
        if left_res != -1:
            return left_res

        # Check if there's a crossing between left and right children
        left_child = self.seg_tree[2 * idx + 1]
        right_child = self.seg_tree[2 * idx + 2]
        if mid <= maxRow and left_child[2] + right_child[1] >= k:
            # The crossing spans the boundary, return the starting row
            return mid - left_child[2] // self.m + 1 if left_child[2] % self.m == 0 else mid

        # Check right child
        return self._query_seg_tree(2 * idx + 2, mid + 1, r, maxRow, k)

    def _update_seg_tree(self, idx: int, l: int, r: int, row: int, seats_taken: int):
        """Update segment tree after taking seats from a row"""
        if l == r:
            # Update leaf node for this row
            remaining = self.m - self.next_seat[row]
            max_consecutive = remaining if remaining > 0 else 0
            left_consecutive = right_consecutive = max_consecutive
            total_empty = remaining
            self.seg_tree[idx] = (max_consecutive, left_consecutive, right_consecutive, total_empty)
            return

        mid = (l + r) // 2
        if row <= mid:
            self._update_seg_tree(2 * idx + 1, l, mid, row, seats_taken)
        else:
            self._update_seg_tree(2 * idx + 2, mid + 1, r, row, seats_taken)

        self._push_up(idx, l, r)

    def gather(self, k: int, maxRow: int):
        # Step 1: Find a row with k consecutive seats
        row = self._query_seg_tree(0, 0, self.n - 1, maxRow, k)
        if row == -1:
            return []

        # Step 2: Calculate starting seat
        start_seat = self.next_seat[row]

        # Step 3: Update data structures
        self.next_seat[row] += k
        seats_taken = k

        # Update Fenwick tree
        self._update_fenwick(row, -seats_taken)

        # Update segment tree
        self._update_seg_tree(0, 0, self.n - 1, row, seats_taken)

        return [row, start_seat]

    def scatter(self, k: int, maxRow: int) -> bool:
        # Step 1: Check if enough total seats available
        total_empty = self._query_fenwick(maxRow)
        if total_empty < k:
            return False

        # Step 2: Allocate seats greedily row by row
        row = 0
        while k > 0 and row <= maxRow:
            available = min(self.m - self.next_seat[row], k)
            if available > 0:
                # Take available seats from this row
                self.next_seat[row] += available
                k -= available

                # Update Fenwick tree
                self._update_fenwick(row, -available)

                # Update segment tree
                self._update_seg_tree(0, 0, self.n - 1, row, available)

            row += 1

        return True
```

```javascript
// Time: O(log n) for gather, O(log n + k/m) for scatter
// Space: O(n + m) for storing seat states and trees

class BookMyShow {
  constructor(n, m) {
    this.n = n;
    this.m = m;
    // Segment tree: each node is [max_consecutive, left_consecutive, right_consecutive, total_empty]
    this.segTree = new Array(4 * n).fill(null).map(() => [0, 0, 0, 0]);
    // Fenwick tree for prefix sums
    this.fenwick = new Array(n + 1).fill(0);
    // Next available seat for each row
    this.nextSeat = new Array(n).fill(0);

    // Initialize trees
    this._buildSegTree(0, 0, n - 1);
    for (let i = 0; i < n; i++) {
      this._updateFenwick(i, m);
    }
  }

  _buildSegTree(idx, l, r) {
    if (l === r) {
      // Entire row is initially empty
      this.segTree[idx] = [this.m, this.m, this.m, this.m];
      return;
    }

    const mid = Math.floor((l + r) / 2);
    this._buildSegTree(2 * idx + 1, l, mid);
    this._buildSegTree(2 * idx + 2, mid + 1, r);
    this._pushUp(idx, l, r);
  }

  _pushUp(idx, l, r) {
    if (l === r) return;

    const leftChild = this.segTree[2 * idx + 1];
    const rightChild = this.segTree[2 * idx + 2];
    const mid = Math.floor((l + r) / 2);

    const totalEmpty = leftChild[3] + rightChild[3];

    // Calculate left_consecutive
    let leftConsecutive = leftChild[1];
    if (leftChild[1] === ((mid - l + 1) * this.m) / (mid - l + 1)) {
      leftConsecutive += rightChild[1];
    }

    // Calculate right_consecutive
    let rightConsecutive = rightChild[2];
    if (rightChild[2] === ((r - mid) * this.m) / (r - mid)) {
      rightConsecutive += leftChild[2];
    }

    // max_consecutive is max of children and cross-boundary
    const maxConsecutive = Math.max(leftChild[0], rightChild[0], leftChild[2] + rightChild[1]);

    this.segTree[idx] = [maxConsecutive, leftConsecutive, rightConsecutive, totalEmpty];
  }

  _updateFenwick(i, delta) {
    i += 1;
    while (i <= this.n) {
      this.fenwick[i] += delta;
      i += i & -i;
    }
  }

  _queryFenwick(i) {
    let res = 0;
    i += 1;
    while (i > 0) {
      res += this.fenwick[i];
      i -= i & -i;
    }
    return res;
  }

  _querySegTree(idx, l, r, maxRow, k) {
    if (this.segTree[idx][0] < k || l > maxRow) {
      return -1;
    }

    if (l === r) {
      return l;
    }

    const mid = Math.floor((l + r) / 2);

    // Check left child first
    const leftRes = this._querySegTree(2 * idx + 1, l, mid, maxRow, k);
    if (leftRes !== -1) {
      return leftRes;
    }

    // Check cross-boundary
    const leftChild = this.segTree[2 * idx + 1];
    const rightChild = this.segTree[2 * idx + 2];
    if (mid <= maxRow && leftChild[2] + rightChild[1] >= k) {
      // Crossing found, return starting row
      return mid - Math.floor(leftChild[2] / this.m) + 1;
    }

    // Check right child
    return this._querySegTree(2 * idx + 2, mid + 1, r, maxRow, k);
  }

  _updateSegTree(idx, l, r, row, seatsTaken) {
    if (l === r) {
      const remaining = this.m - this.nextSeat[row];
      const maxConsecutive = remaining > 0 ? remaining : 0;
      const leftConsecutive = maxConsecutive;
      const rightConsecutive = maxConsecutive;
      const totalEmpty = remaining;
      this.segTree[idx] = [maxConsecutive, leftConsecutive, rightConsecutive, totalEmpty];
      return;
    }

    const mid = Math.floor((l + r) / 2);
    if (row <= mid) {
      this._updateSegTree(2 * idx + 1, l, mid, row, seatsTaken);
    } else {
      this._updateSegTree(2 * idx + 2, mid + 1, r, row, seatsTaken);
    }

    this._pushUp(idx, l, r);
  }

  gather(k, maxRow) {
    // Find row with k consecutive seats
    const row = this._querySegTree(0, 0, this.n - 1, maxRow, k);
    if (row === -1) {
      return [];
    }

    // Calculate starting seat
    const startSeat = this.nextSeat[row];

    // Update data structures
    this.nextSeat[row] += k;

    // Update Fenwick tree
    this._updateFenwick(row, -k);

    // Update segment tree
    this._updateSegTree(0, 0, this.n - 1, row, k);

    return [row, startSeat];
  }

  scatter(k, maxRow) {
    // Check if enough seats available
    const totalEmpty = this._queryFenwick(maxRow);
    if (totalEmpty < k) {
      return false;
    }

    // Allocate seats row by row
    let row = 0;
    let remaining = k;

    while (remaining > 0 && row <= maxRow) {
      const available = Math.min(this.m - this.nextSeat[row], remaining);
      if (available > 0) {
        this.nextSeat[row] += available;
        remaining -= available;

        // Update Fenwick tree
        this._updateFenwick(row, -available);

        // Update segment tree
        this._updateSegTree(0, 0, this.n - 1, row, available);
      }
      row++;
    }

    return true;
  }
}
```

```java
// Time: O(log n) for gather, O(log n + k/m) for scatter
// Space: O(n + m) for storing seat states and trees

class BookMyShow {
    private int n, m;
    private long[] fenwick;
    private int[] nextSeat;
    private Node[] segTree;

    class Node {
        int maxConsecutive;
        int leftConsecutive;
        int rightConsecutive;
        long totalEmpty;

        Node(int maxConsecutive, int leftConsecutive, int rightConsecutive, long totalEmpty) {
            this.maxConsecutive = maxConsecutive;
            this.leftConsecutive = leftConsecutive;
            this.rightConsecutive = rightConsecutive;
            this.totalEmpty = totalEmpty;
        }
    }

    public BookMyShow(int n, int m) {
        this.n = n;
        this.m = m;
        this.fenwick = new long[n + 1];
        this.nextSeat = new int[n];
        this.segTree = new Node[4 * n];

        buildSegTree(0, 0, n - 1);
        for (int i = 0; i < n; i++) {
            updateFenwick(i, m);
        }
    }

    private void buildSegTree(int idx, int l, int r) {
        if (l == r) {
            segTree[idx] = new Node(m, m, m, m);
            return;
        }

        int mid = (l + r) / 2;
        buildSegTree(2 * idx + 1, l, mid);
        buildSegTree(2 * idx + 2, mid + 1, r);
        pushUp(idx, l, r);
    }

    private void pushUp(int idx, int l, int r) {
        if (l == r) return;

        Node leftChild = segTree[2 * idx + 1];
        Node rightChild = segTree[2 * idx + 2];
        int mid = (l + r) / 2;

        long totalEmpty = leftChild.totalEmpty + rightChild.totalEmpty;

        // Calculate left_consecutive
        int leftConsecutive = leftChild.leftConsecutive;
        if (leftChild.leftConsecutive == (mid - l + 1) * m / (mid - l + 1)) {
            leftConsecutive += rightChild.leftConsecutive;
        }

        // Calculate right_consecutive
        int rightConsecutive = rightChild.rightConsecutive;
        if (rightChild.rightConsecutive == (r - mid) * m / (r - mid)) {
            rightConsecutive += leftChild.rightConsecutive;
        }

        // max_consecutive is max of children and cross-boundary
        int maxConsecutive = Math.max(
            Math.max(leftChild.maxConsecutive, rightChild.maxConsecutive),
            leftChild.rightConsecutive + rightChild.leftConsecutive
        );

        segTree[idx] = new Node(maxConsecutive, leftConsecutive, rightConsecutive, totalEmpty);
    }

    private void updateFenwick(int i, int delta) {
        i += 1;
        while (i <= n) {
            fenwick[i] += delta;
            i += i & -i;
        }
    }

    private long queryFenwick(int i) {
        long res = 0;
        i += 1;
        while (i > 0) {
            res += fenwick[i];
            i -= i & -i;
        }
        return res;
    }

    private int querySegTree(int idx, int l, int r, int maxRow, int k) {
        if (segTree[idx].maxConsecutive < k || l > maxRow) {
            return -1;
        }

        if (l == r) {
            return l;
        }

        int mid = (l + r) / 2;

        // Check left child first
        int leftRes = querySegTree(2 * idx + 1, l, mid, maxRow, k);
        if (leftRes != -1) {
            return leftRes;
        }

        // Check cross-boundary
        Node leftChild = segTree[2 * idx + 1];
        Node rightChild = segTree[2 * idx + 2];
        if (mid <= maxRow && leftChild.rightConsecutive + rightChild.leftConsecutive >= k) {
            // Crossing found, return starting row
            return mid - leftChild.rightConsecutive / m + 1;
        }

        // Check right child
        return querySegTree(2 * idx + 2, mid + 1, r, maxRow, k);
    }

    private void updateSegTree(int idx, int l, int r, int row, int seatsTaken) {
        if (l == r) {
            int remaining = m - nextSeat[row];
            int maxConsecutive = remaining > 0 ? remaining : 0;
            int leftConsecutive = maxConsecutive;
            int rightConsecutive = maxConsecutive;
            long totalEmpty = remaining;
            segTree[idx] = new Node(maxConsecutive, leftConsecutive, rightConsecutive, totalEmpty);
            return;
        }

        int mid = (l + r) / 2;
        if (row <= mid) {
            updateSegTree(2 * idx + 1, l, mid, row, seatsTaken);
        } else {
            updateSegTree(2 * idx + 2, mid + 1, r, row, seatsTaken);
        }

        pushUp(idx, l, r);
    }

    public int[] gather(int k, int maxRow) {
        int row = querySegTree(0, 0, n - 1, maxRow, k);
        if (row == -1) {
            return new int[0];
        }

        int startSeat = nextSeat[row];
        nextSeat[row] += k;

        updateFenwick(row, -k);
        updateSegTree(0, 0, n - 1, row, k);

        return new int[]{row, startSeat};
    }

    public boolean scatter(int k, int maxRow) {
        long totalEmpty = queryFenwick(maxRow);
        if (totalEmpty < k) {
            return false;
        }

        int row = 0;
        int remaining = k;

        while (remaining > 0 && row <= maxRow) {
            int available = Math.min(m - nextSeat[row], remaining);
            if (available > 0) {
                nextSeat[row] += available;
                remaining -= available;

                updateFenwick(row, -available);
                updateSegTree(0, 0, n - 1, row, available);
            }
            row++;
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `gather(k, maxRow)`: O(log n) for the segment tree query to find a suitable row, plus O(log n) for updating both trees.
- `scatter(k, maxRow)`: O(log n) for the Fenwick tree query to check total seats, plus O(k/m) for the row-by-row allocation (in worst case we might visit many rows but each visit is O(1)), plus O(log n) per row update in worst case.

**Space Complexity:** O(n) for the segment tree (4n nodes), O(n) for the Fenwick tree, and O(n) for the `next_seat` array, totaling O(n).

## Common Mistakes

1. **Not handling the "consecutive seats" requirement properly in `gather`**: Some candidates try to use just a count of empty seats per row, but you need consecutive seats. The segment tree must track `max_consecutive`, `left_consecutive`, and `right_consecutive` to handle cases where consecutive seats span row boundaries in the tree.

2. **Inefficient seat allocation in `scatter`**: Allocating seats one by one would be O(k), which is too slow when k is large. The greedy row-by-row approach with `next_seat` pointers ensures we allocate in batches.

3. **Forgetting to update all data structures consistently**: When seats are booked, you must update:
   - The `next_seat` pointer for the row
   - The Fenwick tree (prefix sums of empty seats)
   - The segment tree (consecutive seat information)
     Missing any one leads to incorrect future queries.

4. **Off-by-one errors with row indices**: The problem uses 0-based indexing for rows, but Fenwick trees often use 1-based indexing internally. Be careful when converting between them.

## When You'll See This Pattern

This problem combines several advanced data structure patterns:

1. **Segment Trees for Range Queries with Complex Aggregation**: Similar to problems where you need to maintain and query custom statistics over ranges:
   - [Longest Increasing Subsequence II](https://leetcode.com/problems/longest-increasing-subsequence-ii/) - Uses segment tree to track LIS lengths
   - [Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/) - Basic segment tree/Fenwick tree application

2. **Fenwick Trees for Dynamic Prefix Sums**: Used whenever you need frequent updates and prefix sum queries:
   - [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/) - Uses Fenwick tree for counting inversions
   - [Cinema Seat Allocation](https://leetcode.com/problems/cinema-seat-allocation/) - Similar seat booking problem but simpler

3. **Greedy Allocation with Pointer Tracking**: The `next_seat` array pattern appears in problems where you allocate resources sequentially:
   - [Task Scheduler](https://leetcode.com/problems/task-scheduler/) - Similar greedy allocation of tasks to time slots

## Key Takeaways

1. **Combine multiple data structures for different query types**: When a problem requires different types of queries (range maximum, prefix sum), use specialized structures for each (segment tree for max, Fenwick tree for sum).

2. **Design segment tree nodes carefully**: The information stored in each node must be sufficient to compute parent values from children. For consecutive seat queries, we need `max_consecutive`, `left_consecutive`, and `right_consecutive`.

3. **Use greedy allocation with pointers for sequential resource assignment**: When allocating items to slots, maintaining a "next available" pointer per slot avoids O(k) scanning.

Related problems: [Cinema Seat Allocation](/problem/cinema-seat-allocation), [Longest Increasing Subsequence II](/problem/longest-increasing-subsequence-ii)
