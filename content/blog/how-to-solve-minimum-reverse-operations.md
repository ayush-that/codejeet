---
title: "How to Solve Minimum Reverse Operations — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Reverse Operations. Hard difficulty, 16.7% acceptance rate. Topics: Array, Hash Table, Breadth-First Search, Union-Find, Ordered Set."
date: "2026-07-27"
category: "dsa-patterns"
tags: ["minimum-reverse-operations", "array", "hash-table", "breadth-first-search", "hard"]
---

# How to Solve Minimum Reverse Operations

This problem asks us to find the minimum number of operations to move a "1" from position `p` to every other position in an array of length `n`, where each operation involves reversing a subarray of length `k` that contains the current position of the 1. Certain positions are banned and cannot be visited. The challenge lies in efficiently tracking reachable positions without exploring all possible moves repeatedly.

What makes this problem tricky is that each move can jump the 1 to many different positions (specifically, positions with the same parity as the original within a certain range), and we need to avoid banned positions while efficiently marking visited positions to prevent redundant exploration.

## Visual Walkthrough

Let's trace through a small example: `n = 5, p = 0, banned = [2], k = 3`

Initial state: `[1, 0, 0, 0, 0]` (1 at position 0, banned at position 2)

**Operation possibilities:**
When k=3, the 1 at position 0 can only be in subarrays starting at index 0:

- Reverse arr[0:3] → `[0, 0, 1, 0, 0]` (but position 2 is banned, so invalid)
  Actually, let's think about this more carefully. When we reverse a subarray containing the 1, the 1 moves to a new position. For a subarray of length k containing position i, after reversal, the 1 moves to position `j = left + (right - i)` where left and right are the bounds of the subarray.

For position 0 with k=3:

- Subarray could start at max(0, 0-k+1) = 0 to min(0, n-k) = 2
- For start=0: left=0, right=2, new position = 0 + (2-0) = 2 (banned!)
- For start=1: left=1, right=3, new position = 1 + (3-0) = 4 ✓
- For start=2: left=2, right=4, new position = 2 + (4-0) = 6 (out of bounds)

So from position 0, we can reach position 4 in 1 operation.

From position 4 with k=3:

- Subarray could start at max(0, 4-k+1) = 2 to min(4, n-k) = 2
- For start=2: left=2, right=4, new position = 2 + (4-4) = 2 (banned!)

So position 4 is a dead end. The distances would be: position 0: 0, position 4: 1, others: -1.

This example shows we need a systematic way to find all reachable positions efficiently.

## Brute Force Approach

A naive approach would be to simulate BFS from the starting position:

1. Start BFS from position `p` with distance 0
2. For each position `i` we visit, generate all possible new positions `j` by considering all valid subarrays of length `k` containing `i`
3. For each valid `j` (not banned, not visited), add it to the queue
4. Continue until queue is empty

The problem with this approach is that for each position `i`, we need to check O(k) possible subarrays, and each position might be visited multiple times through different paths. With n up to 10^5 and k up to n, this could be O(n\*k) which is too slow.

Additionally, generating positions by actually reversing subarrays is unnecessary - we can compute the new position mathematically. For a subarray [L, R] containing position i, after reversal, i moves to position `j = L + (R - i) = L + R - i`. Since R = L + k - 1, we get `j = 2L + k - 1 - i`.

## Optimized Approach

The key insight is that for a given position `i` and subarray length `k`, the reachable positions form a pattern with fixed parity. Specifically, `j = 2L + k - 1 - i`, so `i + j = 2L + k - 1`. This means `i + j` has the same parity as `k - 1`.

Therefore, from position `i`, we can reach positions `j` where:

1. `j` has the same parity as `(i + k - 1) % 2`
2. `j` is within `[max(0, i-k+1), min(i, n-k)]` transformed through the formula

More importantly, for a given parity and range, we can efficiently find the next unvisited position using a data structure that supports "find and remove" operations. We can use two sorted sets (one for even positions, one for odd positions) to quickly find the next available position without scanning through all possibilities.

The optimized BFS approach:

1. Create sets of available positions for each parity (excluding banned positions and starting position)
2. Use BFS starting from position `p`
3. For each position `i` in BFS queue, determine the range of possible `L` values (subarray start positions)
4. For each parity (even/odd), compute the corresponding `j` values and remove them from the available sets if they exist
5. Add valid `j` positions to the BFS queue

## Optimal Solution

The optimal solution uses BFS with two sorted sets (or balanced BSTs) to efficiently find reachable positions. We maintain sets of unvisited positions for each parity, which allows us to find all positions in a range without scanning the entire array.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
from sortedcontainers import SortedList
from collections import deque

def minReverseOperations(n, p, banned, k):
    """
    Find minimum operations to reach each position from position p.

    Args:
        n: length of array
        p: starting position of 1
        banned: list of banned positions
        k: length of subarray to reverse

    Returns:
        List of minimum operations to reach each position, -1 if unreachable
    """
    # Initialize result array with -1 (unreachable)
    result = [-1] * n
    result[p] = 0  # Starting position requires 0 operations

    # Create a set of banned positions for O(1) lookup
    banned_set = set(banned)

    # Create two sorted lists for even and odd positions that are not banned
    # These will store positions that haven't been visited yet
    available = [SortedList(), SortedList()]  # 0 for even, 1 for odd

    # Populate available positions (excluding banned and starting position)
    for i in range(n):
        if i != p and i not in banned_set:
            available[i % 2].add(i)

    # BFS queue: stores (position, distance)
    queue = deque([p])

    while queue:
        current = queue.popleft()
        current_dist = result[current]

        # Calculate the range of possible left indices for subarrays containing current position
        # The subarray must be within [0, n) and have length k
        left_min = max(0, current - k + 1)
        left_max = min(current, n - k)

        # The possible new positions j satisfy: j = 2*L + k - 1 - current
        # So j ranges from: 2*left_min + k - 1 - current to 2*left_max + k - 1 - current
        # With step size 2 (because when L increases by 1, j increases by 2)
        j_min = 2 * left_min + k - 1 - current
        j_max = 2 * left_max + k - 1 - current

        # Determine parity of positions we're looking for
        # From the formula j = 2L + k - 1 - current, we see that:
        # current + j = 2L + k - 1, so parity of (current + j) = parity of (k - 1)
        # Therefore j has same parity as (current + k - 1)
        parity = (current + k - 1) % 2

        # Get all positions in the available set for this parity that are within [j_min, j_max]
        # We use bisect_left to find the first position >= j_min
        # and bisect_right to find the first position > j_max
        available_set = available[parity]
        start_idx = available_set.bisect_left(j_min)
        end_idx = available_set.bisect_right(j_max)

        # Collect positions to process (we need to collect first because we'll modify the set)
        positions_to_process = []
        for idx in range(start_idx, end_idx):
            positions_to_process.append(available_set[idx])

        # Process each reachable position
        for j in positions_to_process:
            # Remove from available set (mark as visited)
            available_set.remove(j)
            # Update distance
            result[j] = current_dist + 1
            # Add to BFS queue for further exploration
            queue.append(j)

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function minReverseOperations(n, p, banned, k) {
  // Initialize result array with -1 (unreachable)
  const result = new Array(n).fill(-1);
  result[p] = 0; // Starting position requires 0 operations

  // Create a set of banned positions for O(1) lookup
  const bannedSet = new Set(banned);

  // Create two arrays for even and odd positions that are not banned
  // We'll use binary search on sorted arrays
  const available = [[], []]; // 0 for even, 1 for odd

  // Populate available positions (excluding banned and starting position)
  for (let i = 0; i < n; i++) {
    if (i !== p && !bannedSet.has(i)) {
      available[i % 2].push(i);
    }
  }

  // Helper function for binary search
  const binarySearchLeft = (arr, target) => {
    let left = 0,
      right = arr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  };

  // BFS queue: stores positions
  const queue = [p];
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];
    const currentDist = result[current];

    // Calculate the range of possible left indices for subarrays containing current position
    const leftMin = Math.max(0, current - k + 1);
    const leftMax = Math.min(current, n - k);

    // Calculate range of possible new positions j
    const jMin = 2 * leftMin + k - 1 - current;
    const jMax = 2 * leftMax + k - 1 - current;

    // Determine parity of positions we're looking for
    const parity = (current + k - 1) % 2;
    const availableArr = available[parity];

    // Find indices in availableArr where values are in [jMin, jMax]
    let startIdx = binarySearchLeft(availableArr, jMin);
    let endIdx = binarySearchLeft(availableArr, jMax + 1);

    // Collect positions to process
    const positionsToProcess = availableArr.slice(startIdx, endIdx);

    // Remove processed positions from available array
    // We need to remove from end to beginning to maintain correct indices
    for (let i = endIdx - 1; i >= startIdx; i--) {
      availableArr.splice(i, 1);
    }

    // Process each reachable position
    for (const j of positionsToProcess) {
      result[j] = currentDist + 1;
      queue.push(j);
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int[] minReverseOperations(int n, int p, int[] banned, int k) {
        // Initialize result array with -1 (unreachable)
        int[] result = new int[n];
        Arrays.fill(result, -1);
        result[p] = 0; // Starting position requires 0 operations

        // Create a set of banned positions for O(1) lookup
        Set<Integer> bannedSet = new HashSet<>();
        for (int b : banned) {
            bannedSet.add(b);
        }

        // Create two TreeSets for even and odd positions that are not banned
        // TreeSet provides O(log n) operations for add, remove, and subset queries
        TreeSet<Integer>[] available = new TreeSet[2];
        available[0] = new TreeSet<>(); // even positions
        available[1] = new TreeSet<>(); // odd positions

        // Populate available positions (excluding banned and starting position)
        for (int i = 0; i < n; i++) {
            if (i != p && !bannedSet.contains(i)) {
                available[i % 2].add(i);
            }
        }

        // BFS queue: stores positions
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(p);

        while (!queue.isEmpty()) {
            int current = queue.poll();
            int currentDist = result[current];

            // Calculate the range of possible left indices for subarrays containing current position
            int leftMin = Math.max(0, current - k + 1);
            int leftMax = Math.min(current, n - k);

            // Calculate range of possible new positions j
            int jMin = 2 * leftMin + k - 1 - current;
            int jMax = 2 * leftMax + k - 1 - current;

            // Determine parity of positions we're looking for
            int parity = (current + k - 1) % 2;
            TreeSet<Integer> availableSet = available[parity];

            // Get all positions in the available set that are within [jMin, jMax]
            // subSet returns a view of the portion of the set
            Set<Integer> toProcess = new HashSet<>(
                availableSet.subSet(jMin, true, jMax, true)
            );

            // Process each reachable position
            for (int j : toProcess) {
                // Remove from available set (mark as visited)
                availableSet.remove(j);
                // Update distance
                result[j] = currentDist + 1;
                // Add to BFS queue for further exploration
                queue.offer(j);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- We process each position at most once (O(n))
- For each position, we perform operations on balanced BSTs (TreeSet in Java, SortedList in Python, or binary search on sorted arrays in JavaScript)
- Finding and removing elements from these structures takes O(log n) per operation
- The total is O(n log n)

**Space Complexity:** O(n)

- We store the result array of size n
- We store banned positions in a set of size O(n)
- We maintain two sets of available positions, together containing O(n) elements
- The BFS queue can contain up to O(n) elements in the worst case

## Common Mistakes

1. **Not handling parity correctly**: The reachable positions always have the same parity relationship with the current position and k. Forgetting this leads to checking impossible positions and wasted computation.

2. **Inefficient range checking**: Scanning through all possible j positions (O(k) per node) instead of using data structures to find available positions in a range. This turns O(n log n) into O(nk) which is too slow for large inputs.

3. **Forgetting to remove visited positions from available sets**: If you don't remove positions once they're visited, you'll process them multiple times, leading to incorrect distances and potential infinite loops.

4. **Incorrect bounds calculation**: The formulas for j_min and j_max are derived from the constraints on L. Getting these bounds wrong means missing some reachable positions or checking invalid positions.

## When You'll See This Pattern

This problem combines BFS with efficient set operations to find reachable nodes without scanning all edges explicitly. Similar patterns appear in:

1. **Jump Game II (LeetCode 45)**: Finding minimum jumps to reach the end, though simpler since jumps are from contiguous ranges.

2. **Sliding Puzzle (LeetCode 773)**: BFS on state space with constrained moves, requiring efficient state representation and neighbor generation.

3. **Open the Lock (LeetCode 752)**: BFS on a graph where each node has 8 neighbors (turning each dial up or down), with deadends acting like banned positions.

The key pattern is when you have a graph with many implicit edges (too many to generate explicitly) but you can efficiently find unvisited neighbors using data structures.

## Key Takeaways

1. **BFS with efficient neighbor finding**: When BFS would generate too many edges to explore naively, use data structures (like sorted sets) to find unvisited neighbors in ranges efficiently.

2. **Parity constraints in reversal operations**: Reversal operations often create parity constraints on reachable positions. Look for invariant properties (like i+j mod 2) to reduce the search space.

3. **Mathematical transformation of operations**: Instead of simulating operations, derive formulas for the results. Here, j = 2L + k - 1 - i lets us compute new positions directly without array manipulation.

[Practice this problem on CodeJeet](/problem/minimum-reverse-operations)
