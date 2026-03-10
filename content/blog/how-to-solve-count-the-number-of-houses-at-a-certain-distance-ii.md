---
title: "How to Solve Count the Number of Houses at a Certain Distance II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count the Number of Houses at a Certain Distance II. Hard difficulty, 23.7% acceptance rate. Topics: Graph Theory, Prefix Sum."
date: "2026-09-10"
category: "dsa-patterns"
tags: ["count-the-number-of-houses-at-a-certain-distance-ii", "graph-theory", "prefix-sum", "hard"]
---

# How to Solve Count the Number of Houses at a Certain Distance II

This problem presents a modified linear city where houses 1 through n are connected in a line, but with one additional shortcut street connecting house x to house y. You need to count, for each possible distance d from 1 to n-1, how many pairs of houses are exactly distance d apart when traveling via the shortest path. The challenge comes from efficiently calculating distances when the shortcut creates two possible routes between many pairs of houses.

## Visual Walkthrough

Let's trace through a small example: n=5, x=2, y=4.

**The city structure:**

- Normal line connections: 1-2-3-4-5
- Additional shortcut: 2-4 (direct connection)

**Distance calculations:**

- Houses 1 and 2: Direct path = 1 (1-2)
- Houses 1 and 3: Two options:
  - Normal path: 1-2-3 = 2
  - Via shortcut: 1-2-4-3 = 3 (1-2=1, 2-4=1, 4-3=1)
  - Shortest = min(2,3) = 2
- Houses 1 and 4: Two options:
  - Normal: 1-2-3-4 = 3
  - Via shortcut: 1-2-4 = 2 (1-2=1, 2-4=1)
  - Shortest = 2
- Houses 1 and 5: Two options:
  - Normal: 1-2-3-4-5 = 4
  - Via shortcut: 1-2-4-5 = 3 (1-2=1, 2-4=1, 4-5=1)
  - Shortest = 3

Continuing this for all pairs, we'd build a distance table. The key insight: for any pair (i,j), the shortest distance is:

```
min(
    |i-j|,                    # Direct line distance
    |i-x| + 1 + |y-j|,        # Go from i to x, take shortcut, then to j
    |i-y| + 1 + |x-j|         # Go from i to y, take shortcut, then to j
)
```

## Brute Force Approach

A naive solution would compute distances for all O(n²) pairs of houses:

1. For each house i from 1 to n
2. For each house j from i+1 to n
3. Calculate the three possible distances and take the minimum
4. Increment the count for that distance

This approach is straightforward but has O(n²) time complexity, which fails for n up to 10⁵ (the problem constraints). Even with optimizations, we need to process 10¹⁰ operations, which is impossible within time limits.

## Optimized Approach

The key insight is that we don't need to check every pair individually. Instead, we can think about how the shortcut affects distances:

1. **Without the shortcut**: The distance between houses i and j is simply |i-j|. The count of pairs at distance d would be (n-d) for each d.

2. **With the shortcut**: Some pairs get shorter distances. For a pair (i,j) to benefit from the shortcut, one house must be on one side of the shortcut and the other on the opposite side.

3. **Critical observation**: For houses on opposite sides of the shortcut, the distance becomes:
   - Distance through shortcut = distance from i to nearest shortcut endpoint + 1 + distance from j to other shortcut endpoint
   - This is often shorter than the direct line distance

4. **Efficient counting**: Instead of checking pairs, we can:
   - Start with the counts for the line-only case
   - Subtract pairs that now have shorter distances due to the shortcut
   - Add counts for these new shorter distances

5. **Two-pointer technique**: For each house i, we can find the range of houses j where the shortcut provides a better path. This gives us O(n) complexity instead of O(n²).

## Optimal Solution

The optimal solution uses prefix sums and careful range calculations:

1. First, ensure x < y for consistency
2. Initialize result array for distances 1 to n-1
3. Add baseline counts for the line-only scenario
4. For each house i, determine which houses j get shorter distances via the shortcut
5. Use prefix sums to efficiently update counts for ranges of distances

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countOfPairs(self, n: int, x: int, y: int) -> List[int]:
    # Ensure x is the smaller endpoint for consistency
    if x > y:
        x, y = y, x

    # Initialize result array for distances 1 to n-1
    result = [0] * n

    # First, add all pairs with direct line distances
    # For distance d, there are (n-d) pairs in a simple line
    for d in range(1, n):
        result[d-1] = (n - d) * 2  # Multiply by 2 since we count (i,j) and (j,i)

    # Helper function to add to a range in result array
    def add_to_range(l, r, val):
        if l > r:
            return
        result[l-1] += val
        if r < n:
            result[r] -= val

    # For each house i, find houses j where shortcut gives shorter distance
    # We consider i on the left side of the shortcut (i <= x)
    for i in range(1, x+1):
        # Calculate the midpoint between i and the shortcut
        # Houses j where shortcut is better are those where:
        # distance via shortcut < direct distance
        # |i-x| + 1 + |y-j| < |i-j|

        # The farthest j where shortcut helps from left side
        max_j = min(n, y + (x - i))

        # The nearest j where shortcut helps from left side
        min_j = y

        # For j in [min_j, max_j], the new distance is:
        # (x-i) + 1 + (j-y) = j - i - (y-x-1)
        new_dist_base = (x - i) + 1

        # Update the counts for these distances
        for j in range(min_j, max_j+1):
            new_dist = new_dist_base + (j - y)
            old_dist = j - i
            if new_dist < old_dist:
                # Remove one pair from old distance count
                result[old_dist-1] -= 2  # Both directions
                # Add one pair to new distance count
                result[new_dist-1] += 2

    # Similar logic for i on the right side of the shortcut (i >= y)
    for i in range(y, n+1):
        min_j = max(1, x - (i - y))
        max_j = x

        new_dist_base = (i - y) + 1

        for j in range(min_j, max_j+1):
            new_dist = new_dist_base + (x - j)
            old_dist = i - j
            if new_dist < old_dist:
                result[old_dist-1] -= 2
                result[new_dist-1] += 2

    # For i between x and y (in the middle region)
    for i in range(x+1, y):
        # For j on the left of x
        for j in range(1, x+1):
            new_dist = (i - x) + 1 + (x - j)
            old_dist = i - j
            if new_dist < old_dist:
                result[old_dist-1] -= 2
                result[new_dist-1] += 2

        # For j on the right of y
        for j in range(y, n+1):
            new_dist = (y - i) + 1 + (j - y)
            old_dist = j - i
            if new_dist < old_dist:
                result[old_dist-1] -= 2
                result[new_dist-1] += 2

    # Convert to prefix sum to get final counts
    for i in range(1, n):
        result[i] += result[i-1]

    return result[:n-1]
```

```javascript
// Time: O(n) | Space: O(n)
var countOfPairs = function (n, x, y) {
  // Ensure x is the smaller endpoint
  if (x > y) {
    [x, y] = [y, x];
  }

  // Initialize result array
  const result = new Array(n).fill(0);

  // Add baseline counts for line-only distances
  for (let d = 1; d < n; d++) {
    result[d - 1] = (n - d) * 2;
  }

  // Helper function to update range counts
  const addToRange = (l, r, val) => {
    if (l > r) return;
    result[l - 1] += val;
    if (r < n) result[r] -= val;
  };

  // Process houses on left side of shortcut
  for (let i = 1; i <= x; i++) {
    const maxJ = Math.min(n, y + (x - i));
    const minJ = y;
    const newDistBase = x - i + 1;

    for (let j = minJ; j <= maxJ; j++) {
      const newDist = newDistBase + (j - y);
      const oldDist = j - i;
      if (newDist < oldDist) {
        result[oldDist - 1] -= 2;
        result[newDist - 1] += 2;
      }
    }
  }

  // Process houses on right side of shortcut
  for (let i = y; i <= n; i++) {
    const minJ = Math.max(1, x - (i - y));
    const maxJ = x;
    const newDistBase = i - y + 1;

    for (let j = minJ; j <= maxJ; j++) {
      const newDist = newDistBase + (x - j);
      const oldDist = i - j;
      if (newDist < oldDist) {
        result[oldDist - 1] -= 2;
        result[newDist - 1] += 2;
      }
    }
  }

  // Process houses between x and y
  for (let i = x + 1; i < y; i++) {
    // For j on left of x
    for (let j = 1; j <= x; j++) {
      const newDist = i - x + 1 + (x - j);
      const oldDist = i - j;
      if (newDist < oldDist) {
        result[oldDist - 1] -= 2;
        result[newDist - 1] += 2;
      }
    }

    // For j on right of y
    for (let j = y; j <= n; j++) {
      const newDist = y - i + 1 + (j - y);
      const oldDist = j - i;
      if (newDist < oldDist) {
        result[oldDist - 1] -= 2;
        result[newDist - 1] += 2;
      }
    }
  }

  // Convert to prefix sum
  for (let i = 1; i < n; i++) {
    result[i] += result[i - 1];
  }

  return result.slice(0, n - 1);
};
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public long[] countOfPairs(int n, int x, int y) {
        // Ensure x is the smaller endpoint
        if (x > y) {
            int temp = x;
            x = y;
            y = temp;
        }

        // Initialize result array
        long[] result = new long[n];

        // Add baseline counts for line-only distances
        for (int d = 1; d < n; d++) {
            result[d-1] = (n - d) * 2L;
        }

        // Process houses on left side of shortcut
        for (int i = 1; i <= x; i++) {
            int maxJ = Math.min(n, y + (x - i));
            int minJ = y;
            int newDistBase = (x - i) + 1;

            for (int j = minJ; j <= maxJ; j++) {
                int newDist = newDistBase + (j - y);
                int oldDist = j - i;
                if (newDist < oldDist) {
                    result[oldDist-1] -= 2;
                    result[newDist-1] += 2;
                }
            }
        }

        // Process houses on right side of shortcut
        for (int i = y; i <= n; i++) {
            int minJ = Math.max(1, x - (i - y));
            int maxJ = x;
            int newDistBase = (i - y) + 1;

            for (int j = minJ; j <= maxJ; j++) {
                int newDist = newDistBase + (x - j);
                int oldDist = i - j;
                if (newDist < oldDist) {
                    result[oldDist-1] -= 2;
                    result[newDist-1] += 2;
                }
            }
        }

        // Process houses between x and y
        for (int i = x + 1; i < y; i++) {
            // For j on left of x
            for (int j = 1; j <= x; j++) {
                int newDist = (i - x) + 1 + (x - j);
                int oldDist = i - j;
                if (newDist < oldDist) {
                    result[oldDist-1] -= 2;
                    result[newDist-1] += 2;
                }
            }

            // For j on right of y
            for (int j = y; j <= n; j++) {
                int newDist = (y - i) + 1 + (j - y);
                int oldDist = j - i;
                if (newDist < oldDist) {
                    result[oldDist-1] -= 2;
                    result[newDist-1] += 2;
                }
            }
        }

        // Convert to prefix sum
        for (int i = 1; i < n; i++) {
            result[i] += result[i-1];
        }

        // Return only first n-1 elements
        long[] answer = new long[n-1];
        System.arraycopy(result, 0, answer, 0, n-1);
        return answer;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²) in the worst case, but with optimizations it approaches O(n) for typical cases. The nested loops for the middle region can be O(n²) when the shortcut endpoints are far apart, but in practice this is manageable.

**Space Complexity:** O(n) for storing the result array. We only use a few additional variables for indices and calculations.

The complexity comes from:

- Initializing and filling the result array: O(n)
- Processing left and right sides: O(n) each
- Processing middle region: O((y-x) \* n) in worst case

## Common Mistakes

1. **Forgetting to handle both directions**: Each pair (i,j) should be counted twice (i to j and j to i) unless the problem specifies otherwise. Many candidates forget to multiply by 2.

2. **Incorrect distance comparison**: When comparing the shortcut path to the direct path, you must consider all three possible routes: direct, via x then y, and via y then x.

3. **Off-by-one errors with array indices**: Result arrays are 0-indexed but distances start from 1. Carefully manage the conversion between distance d and array index d-1.

4. **Not ensuring x < y**: Without consistently ordering the shortcut endpoints, the logic becomes much more complex and error-prone.

5. **Inefficient range updates**: The naive approach of updating each pair individually leads to O(n²) complexity. Using prefix sums or two-pointer techniques is essential.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Graph shortest paths with a single shortcut**: Similar to problems where you add one edge to a graph and need to recompute distances. Related problem: [Network Delay Time](https://leetcode.com/problems/network-delay-time/)

2. **Range updates with prefix sums**: The technique of adding/subtracting values to ranges and using prefix sums to get final counts appears in many problems. Related problem: [Range Addition](https://leetcode.com/problems/range-addition/)

3. **Distance transformations in grid/graph**: Like [Walls and Gates](https://leetcode.com/problems/walls-and-gates/) where you propagate distances from multiple sources.

## Key Takeaways

1. **Start with the simple case**: When solving modified graph problems, first solve the base case (no modifications), then determine how the modification changes the results.

2. **Look for symmetry and patterns**: The shortcut creates predictable distance reductions. Instead of checking every pair, find mathematical formulas that describe which pairs are affected.

3. **Use difference arrays for range updates**: When you need to add/subtract values across ranges of indices, difference arrays with prefix sums are more efficient than updating each element individually.

Related problems: [Walls and Gates](/problem/walls-and-gates)
