---
title: "How to Solve Count Ways to Group Overlapping Ranges — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Ways to Group Overlapping Ranges. Medium difficulty, 39.0% acceptance rate. Topics: Array, Sorting."
date: "2029-09-21"
category: "dsa-patterns"
tags: ["count-ways-to-group-overlapping-ranges", "array", "sorting", "medium"]
---

# How to Solve Count Ways to Group Overlapping Ranges

This problem asks us to count the number of ways to split a list of intervals into two groups such that no two intervals in the same group overlap. At first glance, it might seem like a complex combinatorial problem, but the key insight lies in recognizing that overlapping intervals force grouping constraints. The tricky part is understanding how these constraints propagate through the interval graph.

## Visual Walkthrough

Let's trace through an example: `ranges = [[1,3], [2,5], [4,7], [6,8]]`

1. **Identify overlaps**:
   - [1,3] overlaps with [2,5] (they share points 2-3)
   - [2,5] overlaps with [4,7] (they share points 4-5)
   - [4,7] overlaps with [6,8] (they share points 6-7)
   - [1,3] does NOT overlap with [4,7] or [6,8]
   - [2,5] does NOT overlap with [6,8]

2. **Build constraint graph**:
   Think of each interval as a node. Draw edges between overlapping intervals:

   ```
   1-3 --- 2-5 --- 4-7 --- 6-8
   ```

   This forms a chain of 4 connected intervals.

3. **Grouping constraints**:
   - If we put [1,3] in Group A, then [2,5] MUST go to Group B (since they overlap)
   - If [2,5] is in Group B, then [4,7] MUST go to Group A
   - If [4,7] is in Group A, then [6,8] MUST go to Group B

   This creates an alternating pattern: A, B, A, B

4. **Counting possibilities**:
   For this connected component of 4 intervals:
   - Option 1: Start with first interval in Group A → pattern: A, B, A, B
   - Option 2: Start with first interval in Group B → pattern: B, A, B, A

   So this component gives us 2 valid assignments.

5. **Independent components**:
   If we had another component with 3 intervals, it would also have 2 valid assignments.
   The total ways = 2 × 2 = 4 (each component's choices multiply).

The challenge is detecting when constraints are contradictory (creating an impossible "odd cycle" where an interval would need to be in both groups).

## Brute Force Approach

A naive approach would try all possible assignments of intervals to two groups. For each of the 2^n possible assignments, we would need to check if any group contains overlapping intervals.

**Why this fails**:

- With n up to 10^5, 2^n is astronomically large
- Even for small n, checking overlaps in each group requires O(n²) comparisons
- Total complexity: O(2^n × n²) — completely infeasible

The brute force teaches us that we need a smarter way to propagate constraints without enumerating all possibilities.

## Optimized Approach

The key insight is that this is essentially a **graph coloring problem** with 2 colors (groups):

1. **Build an interval graph**: Create a graph where nodes are intervals, and edges connect overlapping intervals
2. **Check bipartiteness**: The graph must be bipartite (2-colorable) for any valid grouping to exist
3. **Count components**: Each connected component can be colored in exactly 2 ways (swap all colors)
4. **Multiply possibilities**: Total ways = 2^(number of connected components)

**But there's a catch**: Building the full graph explicitly would require O(n²) edges in the worst case (when all intervals overlap). We need a more efficient way to find overlapping intervals.

**The optimization**: Sort intervals by start time, then use a sweep line approach:

- Sort all intervals by their start time
- Maintain the maximum end time of intervals in the current connected component
- If a new interval starts after the current max end, we've found a new component
- Otherwise, the interval overlaps with the current component, so extend the max end

This gives us connected components in O(n log n) time without building the full graph!

## Optimal Solution

The algorithm proceeds in these steps:

1. Sort intervals by start time
2. Iterate through sorted intervals, tracking components
3. For each new interval:
   - If it starts after the current component's max end → new component
   - Otherwise, it belongs to current component (update max end)
4. Count components and calculate 2^(component count) mod (10^9+7)

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) [excluding input storage]
def countWays(ranges):
    """
    Counts the number of ways to split intervals into two non-overlapping groups.

    The key insight: Intervals that overlap must be in different groups.
    This creates connected components in the interval overlap graph.
    Each component can be assigned to groups in exactly 2 ways.
    Total ways = 2^(number of components) mod (10^9+7).
    """
    # Step 1: Sort intervals by their start time
    # This allows us to process intervals in order and detect component boundaries
    ranges.sort(key=lambda x: x[0])

    # Step 2: Initialize tracking variables
    component_count = 0
    current_max_end = -1  # Tracks the maximum end in current component

    # Step 3: Iterate through sorted intervals to find connected components
    for start, end in ranges:
        if start > current_max_end:
            # This interval doesn't overlap with current component
            # It starts a new connected component
            component_count += 1
            current_max_end = end
        else:
            # This interval overlaps with current component
            # Update the max end to include this interval
            current_max_end = max(current_max_end, end)

    # Step 4: Calculate 2^component_count mod (10^9+7)
    # Each component can be colored in 2 ways (assign first interval to group 0 or 1)
    MOD = 10**9 + 7
    result = pow(2, component_count, MOD)  # Efficient modular exponentiation

    return result
```

```javascript
// Time: O(n log n) | Space: O(1) [excluding input storage]
function countWays(ranges) {
  /**
   * Counts the number of ways to split intervals into two non-overlapping groups.
   *
   * The key insight: Intervals that overlap must be in different groups.
   * This creates connected components in the interval overlap graph.
   * Each component can be assigned to groups in exactly 2 ways.
   * Total ways = 2^(number of components) mod (10^9+7).
   */

  // Step 1: Sort intervals by their start time
  // This allows us to process intervals in order and detect component boundaries
  ranges.sort((a, b) => a[0] - b[0]);

  // Step 2: Initialize tracking variables
  let componentCount = 0;
  let currentMaxEnd = -1; // Tracks the maximum end in current component

  // Step 3: Iterate through sorted intervals to find connected components
  for (const [start, end] of ranges) {
    if (start > currentMaxEnd) {
      // This interval doesn't overlap with current component
      // It starts a new connected component
      componentCount++;
      currentMaxEnd = end;
    } else {
      // This interval overlaps with current component
      // Update the max end to include this interval
      currentMaxEnd = Math.max(currentMaxEnd, end);
    }
  }

  // Step 4: Calculate 2^componentCount mod (10^9+7)
  // Each component can be colored in 2 ways (assign first interval to group 0 or 1)
  const MOD = 1_000_000_007;

  // Efficient modular exponentiation using binary exponentiation
  let result = 1;
  let base = 2;
  let exponent = componentCount;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % MOD;
    }
    base = (base * base) % MOD;
    exponent = Math.floor(exponent / 2);
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(1) [excluding input storage]
class Solution {
    public int countWays(int[][] ranges) {
        /**
         * Counts the number of ways to split intervals into two non-overlapping groups.
         *
         * The key insight: Intervals that overlap must be in different groups.
         * This creates connected components in the interval overlap graph.
         * Each component can be assigned to groups in exactly 2 ways.
         * Total ways = 2^(number of components) mod (10^9+7).
         */

        // Step 1: Sort intervals by their start time
        // This allows us to process intervals in order and detect component boundaries
        Arrays.sort(ranges, (a, b) -> Integer.compare(a[0], b[0]));

        // Step 2: Initialize tracking variables
        int componentCount = 0;
        int currentMaxEnd = -1;  // Tracks the maximum end in current component

        // Step 3: Iterate through sorted intervals to find connected components
        for (int[] range : ranges) {
            int start = range[0];
            int end = range[1];

            if (start > currentMaxEnd) {
                // This interval doesn't overlap with current component
                // It starts a new connected component
                componentCount++;
                currentMaxEnd = end;
            } else {
                // This interval overlaps with current component
                // Update the max end to include this interval
                currentMaxEnd = Math.max(currentMaxEnd, end);
            }
        }

        // Step 4: Calculate 2^componentCount mod (10^9+7)
        // Each component can be colored in 2 ways (assign first interval to group 0 or 1)
        final int MOD = 1_000_000_007;

        // Efficient modular exponentiation using binary exponentiation
        long result = 1;
        long base = 2;
        int exponent = componentCount;

        while (exponent > 0) {
            if ((exponent & 1) == 1) {
                result = (result * base) % MOD;
            }
            base = (base * base) % MOD;
            exponent >>= 1;
        }

        return (int) result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the intervals takes O(n log n) time
- The single pass through sorted intervals takes O(n) time
- Modular exponentiation takes O(log n) time (for the exponent, which is ≤ n)
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(1) or O(n)**

- O(1) extra space if we don't count input storage
- O(n) for Python's Timsort (which needs O(n) space in worst case)
- O(log n) for Java's Arrays.sort() (quicksort variant)
- The algorithm itself uses only a few variables

## Common Mistakes

1. **Forgetting to sort by start time**: Without sorting, you can't use the sweep line approach to efficiently find connected components. You'd need to check all pairs for overlaps (O(n²)).

2. **Incorrect overlap detection**: The condition `start > currentMaxEnd` detects NON-overlap. Some candidates mistakenly use `start >= currentMaxEnd`, which is wrong because intervals like [1,3] and [3,5] DO overlap (they share point 3).

3. **Not updating currentMaxEnd correctly**: When an interval overlaps with the current component, you must update `currentMaxEnd = max(currentMaxEnd, end)`. Forgetting this can incorrectly split a single component into multiple ones.

4. **Modulo arithmetic errors**: Calculating 2^n mod M for large n (up to 10^5) requires efficient modular exponentiation. Using `pow(2, n) % MOD` directly can cause overflow in some languages or be inefficient.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Interval merging/sweep line**: Like in "Merge Intervals" (LeetCode 56), we sort by start time and process intervals in order. The difference is we're tracking connected components rather than merging.

2. **Graph coloring/bipartiteness checking**: The grouping constraint creates a graph coloring problem. Similar patterns appear in:
   - "Is Graph Bipartite?" (LeetCode 785) - Direct bipartiteness checking
   - "Possible Bipartition" (LeetCode 886) - Bipartiteness with given dislikes
   - "Alien Dictionary" (LeetCode 269) - Builds constraint graphs from word comparisons

The key recognition signal: When you have pairwise constraints (A and B can't be together) and need to count valid assignments, think graph coloring.

## Key Takeaways

1. **Interval overlap graphs are implicit**: You don't need to build the full O(n²) graph. Sorting by start time lets you find connected components in O(n log n) time.

2. **Constraints propagate in chains**: When A conflicts with B and B conflicts with C, then A and C must be together. This creates alternating patterns that are always 2-colorable for intervals (no odd cycles possible).

3. **Independent choices multiply**: When you have multiple disconnected components, the total number of valid assignments is the product of possibilities for each component.

Related problems: [Merge Intervals](/problem/merge-intervals)
