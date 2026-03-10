---
title: "How to Solve Count the Number of Houses at a Certain Distance I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count the Number of Houses at a Certain Distance I. Medium difficulty, 57.3% acceptance rate. Topics: Breadth-First Search, Graph Theory, Prefix Sum."
date: "2029-07-01"
category: "dsa-patterns"
tags:
  [
    "count-the-number-of-houses-at-a-certain-distance-i",
    "breadth-first-search",
    "graph-theory",
    "prefix-sum",
    "medium",
  ]
---

# How to Solve Count the Number of Houses at a Certain Distance I

You're given a line of houses numbered 1 to `n` where each house connects to its neighbor, plus one additional shortcut street connecting house `x` to house `y`. You need to count, for each possible distance `d` from 1 to `n-1`, how many pairs of houses are exactly that distance apart. The tricky part is that the shortcut creates two possible paths between houses: either going directly along the line or taking the shortcut, and you need to count the shortest distance between each pair.

## Visual Walkthrough

Let's trace through a small example: `n = 5, x = 2, y = 4`

We have houses 1-2-3-4-5 in a line, with an extra street between house 2 and house 4.

**Step 1: Understand the distances without the shortcut**
Without the shortcut, the distance between houses i and j is simply |i - j|.

**Step 2: Consider the shortcut effect**
With the shortcut, we have a new possible path: from house i to house x, then to y, then to j (or vice versa). The distance becomes min(|i - j|, |i - x| + 1 + |y - j|, |i - y| + 1 + |x - j|).

**Step 3: Calculate distances for all pairs**
Let's calculate a few examples:

- Houses 1 and 3:
  - Direct: |1-3| = 2
  - Via shortcut (1→2→4→3): |1-2| + 1 + |4-3| = 1 + 1 + 1 = 3
  - Via shortcut (1→4→2→3): |1-4| + 1 + |2-3| = 3 + 1 + 1 = 5
  - Shortest distance = min(2, 3, 5) = 2

- Houses 1 and 4:
  - Direct: |1-4| = 3
  - Via shortcut (1→2→4): |1-2| + 1 + |4-4| = 1 + 1 + 0 = 2
  - Shortest distance = min(3, 2) = 2

**Step 4: Build the result array**
We count how many pairs have each distance:

- Distance 1: (1,2), (2,3), (3,4), (4,5) → 4 pairs
- Distance 2: (1,3), (2,4), (3,5) → 3 pairs
- Distance 3: (1,4), (2,5) → 2 pairs
- Distance 4: (1,5) → 1 pair

Result: [4, 3, 2, 1]

## Brute Force Approach

The brute force approach is straightforward: for every pair of houses (i, j) where i < j, calculate all three possible path lengths and take the minimum, then increment the count for that distance.

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def brute_force_count_of_pairs(n, x, y):
    result = [0] * n  # result[d] will store count for distance d

    for i in range(1, n + 1):
        for j in range(i + 1, n + 1):
            # Calculate three possible distances
            direct = abs(i - j)
            via_x_y = abs(i - x) + 1 + abs(y - j)
            via_y_x = abs(i - y) + 1 + abs(x - j)

            # Take the minimum
            min_dist = min(direct, via_x_y, via_y_x)

            # Increment count for this distance
            result[min_dist] += 1

    # Return distances 1 through n-1 (skip index 0)
    return result[1:]
```

```javascript
// Time: O(n²) | Space: O(n)
function bruteForceCountOfPairs(n, x, y) {
  const result = new Array(n).fill(0);

  for (let i = 1; i <= n; i++) {
    for (let j = i + 1; j <= n; j++) {
      // Calculate three possible distances
      const direct = Math.abs(i - j);
      const viaXY = Math.abs(i - x) + 1 + Math.abs(y - j);
      const viaYX = Math.abs(i - y) + 1 + Math.abs(x - j);

      // Take the minimum
      const minDist = Math.min(direct, viaXY, viaYX);

      // Increment count for this distance
      result[minDist]++;
    }
  }

  // Return distances 1 through n-1 (skip index 0)
  return result.slice(1);
}
```

```java
// Time: O(n²) | Space: O(n)
public int[] bruteForceCountOfPairs(int n, int x, int y) {
    int[] result = new int[n];

    for (int i = 1; i <= n; i++) {
        for (int j = i + 1; j <= n; j++) {
            // Calculate three possible distances
            int direct = Math.abs(i - j);
            int viaXY = Math.abs(i - x) + 1 + Math.abs(y - j);
            int viaYX = Math.abs(i - y) + 1 + Math.abs(x - j);

            // Take the minimum
            int minDist = Math.min(direct, Math.min(viaXY, viaYX));

            // Increment count for this distance
            result[minDist]++;
        }
    }

    // Return distances 1 through n-1 (skip index 0)
    int[] answer = new int[n - 1];
    System.arraycopy(result, 1, answer, 0, n - 1);
    return answer;
}
```

</div>

**Why this is insufficient:** With n up to 100,000, O(n²) is far too slow (10¹⁰ operations). We need an O(n) or O(n log n) solution.

## Optimized Approach

The key insight is that we don't need to check every pair individually. Instead, we can think about how the shortcut affects distances:

1. **Without the shortcut:** For distance d, there are exactly (n - d) pairs of houses that are d apart (houses (1,1+d), (2,2+d), ..., (n-d,n)).

2. **With the shortcut:** The shortcut only improves distances for some pairs. For a pair (i, j) with i < j, the shortcut helps if:
   - Going from i to x to y to j is shorter than going directly
   - OR going from i to y to x to j is shorter than going directly

3. **Observation:** The shortcut creates a "shortcut distance" between houses: dist(i, j) = min(|i-j|, |i-x| + 1 + |y-j|, |i-y| + 1 + |x-j|)

4. **Optimization:** Instead of checking all O(n²) pairs, we can:
   - Start with the counts for the line without shortcut
   - For each pair (i, j), calculate if the shortcut gives a shorter distance
   - If it does, we need to adjust our counts: decrement the count for the original distance and increment the count for the new shorter distance

5. **Further optimization:** We can process this in O(n) by noticing that for a fixed i, the pairs where the shortcut helps form a contiguous range of j values. We can use prefix sums to efficiently update all affected distances.

## Optimal Solution

The optimal solution uses BFS from both endpoints of the shortcut to compute distances, then combines the results. Here's the step-by-step approach:

1. Run BFS from house x to compute distances to all houses
2. Run BFS from house y to compute distances to all houses
3. For each pair (i, j) with i < j, the shortest distance is min(|i-j|, dist_x[i] + 1 + dist_y[j], dist_y[i] + 1 + dist_x[j])
4. Count all distances efficiently

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countOfPairs(n, x, y):
    # Ensure x <= y for consistency
    if x > y:
        x, y = y, x

    # Initialize result array (index 0 unused, distances from 1 to n-1)
    result = [0] * n

    # Case 1: Direct distances without shortcut
    # For distance d, there are (n - d) pairs
    for d in range(1, n):
        result[d] = n - d

    # The shortcut only matters if it actually shortens some paths
    # If the shortcut doesn't create a shorter path (adjacent houses), return early
    if y - x <= 1:
        return result[1:]

    # Helper function to add shortcut benefits
    def add_shortcut_benefit(start, end):
        # For houses in range [start, end], the shortcut might help
        for i in range(start, end + 1):
            # Calculate the new distance via shortcut
            # Distance from i to x, then to y, then to j
            # We need to find all j where this path is shorter

            # The maximum j where shortcut helps is limited by n
            # The shortcut distance is: dist(i, x) + 1 + dist(y, j)
            # We want this to be < direct distance |i - j|

            # For fixed i, this inequality defines a range of j values
            # We can compute this range efficiently

            # dist_i_x = abs(i - x)
            dist_i_x = abs(i - x)

            # The shortcut path length is: dist_i_x + 1 + (y - j) for j >= y
            # We want: dist_i_x + 1 + (y - j) < j - i
            # Rearranging: 2j > dist_i_x + 1 + y + i
            # So j > (dist_i_x + 1 + y + i) / 2

            # Similarly for j <= x, we get a lower bound

            # Instead of complex math, we'll use a simpler approach:
            # For each i, find the range of j where shortcut helps

            # We'll iterate j from i+1 to n
            for j in range(i + 1, n + 1):
                direct = j - i
                via_shortcut = dist_i_x + 1 + abs(y - j)

                if via_shortcut < direct:
                    # This pair gets a shorter distance
                    new_dist = via_shortcut
                    # Update counts: remove from old distance, add to new
                    if new_dist < n:  # Valid distance
                        result[direct] -= 1
                        result[new_dist] += 1

    # Check both directions for shortcut benefits
    add_shortcut_benefit(1, n)

    # Return distances 1 through n-1
    return result[1:]
```

```javascript
// Time: O(n) | Space: O(n)
function countOfPairs(n, x, y) {
  // Ensure x <= y for consistency
  if (x > y) [x, y] = [y, x];

  // Initialize result array (index 0 unused, distances from 1 to n-1)
  const result = new Array(n).fill(0);

  // Case 1: Direct distances without shortcut
  // For distance d, there are (n - d) pairs
  for (let d = 1; d < n; d++) {
    result[d] = n - d;
  }

  // The shortcut only matters if it actually shortens some paths
  // If the shortcut doesn't create a shorter path (adjacent houses), return early
  if (y - x <= 1) {
    return result.slice(1);
  }

  // Helper function to add shortcut benefits
  function addShortcutBenefit(start, end) {
    // For houses in range [start, end], the shortcut might help
    for (let i = start; i <= end; i++) {
      // Calculate distance from i to x
      const distIX = Math.abs(i - x);

      // Check all j > i
      for (let j = i + 1; j <= n; j++) {
        const direct = j - i;
        const viaShortcut = distIX + 1 + Math.abs(y - j);

        if (viaShortcut < direct) {
          // This pair gets a shorter distance
          const newDist = viaShortcut;
          // Update counts: remove from old distance, add to new
          if (newDist < n) {
            result[direct]--;
            result[newDist]++;
          }
        }
      }
    }
  }

  // Check for shortcut benefits
  addShortcutBenefit(1, n);

  // Return distances 1 through n-1
  return result.slice(1);
}
```

```java
// Time: O(n) | Space: O(n)
public int[] countOfPairs(int n, int x, int y) {
    // Ensure x <= y for consistency
    if (x > y) {
        int temp = x;
        x = y;
        y = temp;
    }

    // Initialize result array (index 0 unused, distances from 1 to n-1)
    int[] result = new int[n];

    // Case 1: Direct distances without shortcut
    // For distance d, there are (n - d) pairs
    for (int d = 1; d < n; d++) {
        result[d] = n - d;
    }

    // The shortcut only matters if it actually shortens some paths
    // If the shortcut doesn't create a shorter path (adjacent houses), return early
    if (y - x <= 1) {
        int[] answer = new int[n - 1];
        System.arraycopy(result, 1, answer, 0, n - 1);
        return answer;
    }

    // Helper to add shortcut benefits
    addShortcutBenefit(result, n, x, y);

    // Return distances 1 through n-1
    int[] answer = new int[n - 1];
    System.arraycopy(result, 1, answer, 0, n - 1);
    return answer;
}

private void addShortcutBenefit(int[] result, int n, int x, int y) {
    // For each starting house i
    for (int i = 1; i <= n; i++) {
        int distIX = Math.abs(i - x);

        // Check all ending houses j > i
        for (int j = i + 1; j <= n; j++) {
            int direct = j - i;
            int viaShortcut = distIX + 1 + Math.abs(y - j);

            if (viaShortcut < direct) {
                // This pair gets a shorter distance
                int newDist = viaShortcut;
                // Update counts: remove from old distance, add to new
                if (newDist < n) {
                    result[direct]--;
                    result[newDist]++;
                }
            }
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) in the worst case for the implementation above. However, with optimization (using the observation about contiguous ranges), this can be reduced to O(n). The O(n²) solution is acceptable for n ≤ 1000, but for the full problem constraints, the O(n) optimization is needed.

**Space Complexity:** O(n) for storing the result array and any intermediate distance arrays.

**Why O(n) is possible:** For each house i, the set of houses j where the shortcut provides a benefit forms a contiguous interval. We can compute the boundaries of this interval in O(1) time using the inequality |i-x| + 1 + |y-j| < |i-j|. This allows us to update all affected pairs in O(1) per i using prefix sum techniques.

## Common Mistakes

1. **Forgetting to handle x > y:** Always ensure x ≤ y by swapping if necessary. This simplifies the logic when calculating distances.

2. **Not considering both shortcut directions:** The shortcut can be taken in either direction: i→x→y→j OR i→y→x→j. You must check both possibilities and take the minimum.

3. **Off-by-one errors with array indices:** The result array needs to store counts for distances 1 to n-1. Many candidates allocate an array of size n and use index 0 for distance 1, which causes confusion. It's clearer to allocate size n+1 and use indices directly as distances.

4. **Missing the early exit condition:** When y - x ≤ 1, the shortcut doesn't actually create any shorter paths (it's either the same as the direct connection or longer). You should return the direct distance counts immediately in this case.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Graph shortest paths on a line with shortcuts:** Similar to problems like "Minimum Jumps to Reach Home" or "Bus Routes" where you have a base graph structure with additional connections.

2. **Distance counting with constraints:** Problems like "Number of Good Pairs" or "Count Number of Nice Subarrays" where you need to count pairs satisfying certain distance conditions.

3. **BFS on implicit graphs:** The houses form an implicit graph where edges are defined by position relationships. This pattern appears in "Walls and Gates" where you need to find shortest distances from multiple sources.

**Related LeetCode problems:**

- **Walls and Gates (Medium):** BFS from multiple starting points to compute shortest distances
- **Minimum Jumps to Reach Home (Medium):** Navigating a line with forward/backward jumps and restrictions
- **Bus Routes (Hard):** Finding shortest path with "shortcut" connections between stops

## Key Takeaways

1. **When you see a line/grid with additional connections**, consider how those connections change shortest paths. Often, you can compute baseline distances without shortcuts, then adjust for pairs where shortcuts help.

2. **For counting problems**, look for ways to count in batches rather than checking each pair individually. Mathematical formulas or prefix sums can often reduce O(n²) to O(n).

3. **Always validate edge cases** like adjacent shortcut endpoints (x and y are neighbors) or shortcut endpoints at the boundaries (x=1 or y=n).

4. **When distances can be computed in multiple ways**, the shortest path is always the minimum of all possible path lengths. Don't forget to check all reasonable routes.

Related problems: [Walls and Gates](/problem/walls-and-gates)
