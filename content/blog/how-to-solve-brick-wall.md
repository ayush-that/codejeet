---
title: "How to Solve Brick Wall — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Brick Wall. Medium difficulty, 56.0% acceptance rate. Topics: Array, Hash Table."
date: "2026-05-24"
category: "dsa-patterns"
tags: ["brick-wall", "array", "hash-table", "medium"]
---

# How to Solve Brick Wall

You're given a rectangular brick wall where each row has bricks of varying widths but the same total width. You need to draw a vertical line from top to bottom that crosses the **minimum number of bricks**. The tricky part is that the line can only be drawn between bricks, not through them, and you need to find the position where the most brick edges align across rows.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider this wall:

```
Row 1: [3, 1, 2, 4]  (total width = 10)
Row 2: [2, 3, 5]     (total width = 10)
Row 3: [1, 4, 3, 2]  (total width = 10)
```

We need to find where to draw a vertical line. Let's look at potential positions:

- At position 0 (the left edge): All rows start with a brick, so the line would go through 3 bricks.
- At position 3: Row 1 has a brick edge here (after the first brick of width 3). Row 2 has a brick of width 2, then 3, so position 3 is in the middle of the second brick. Row 3 has a brick of width 1, then 4, so position 3 is in the middle of the second brick. So only 1 row has an edge here.
- At position 4: Row 1 has bricks 3+1=4, so edge here. Row 2 has 2+3=5, so middle of brick. Row 3 has 1+4=5, so middle of brick. Again only 1 edge.
- At position 5: Row 1: 3+1+2=6, so middle of brick. Row 2: 2+3=5, edge here! Row 3: 1+4=5, edge here! So 2 edges align at position 5.

The key insight: **We want to find the position where the most brick edges align**. If `n` edges align at position `x`, then a line drawn at `x` will cross `total_rows - n` bricks (since it avoids those `n` edges).

Let's track cumulative sums for each row (excluding the last brick's edge since that's the wall's right edge):

Row 1 cumulative sums: 3, 4, 6 (edges at positions 3, 4, 6)  
Row 2 cumulative sums: 2, 5 (edges at 2, 5)  
Row 3 cumulative sums: 1, 5, 8 (edges at 1, 5, 8)

Now count how many rows have an edge at each position:

- Position 1: 1 row (Row 3)
- Position 2: 1 row (Row 2)
- Position 3: 1 row (Row 1)
- Position 4: 1 row (Row 1)
- Position 5: 2 rows (Row 2 and Row 3) ← maximum!
- Position 6: 1 row (Row 1)
- Position 8: 1 row (Row 3)

Maximum edges aligned = 2 at position 5. Total rows = 3, so minimum bricks crossed = 3 - 2 = 1.

## Brute Force Approach

A naive approach would be to check every possible position from 1 to total_width-1. For each position, we'd scan each row to see if that position aligns with a brick edge. This requires checking `width-1` positions × `n` rows × scanning each row's bricks to find edges.

The brute force code would look like this:

```python
def leastBricks(wall):
    total_width = sum(wall[0])
    min_crossed = len(wall)  # worst case: line through all bricks

    for pos in range(1, total_width):
        edges_at_pos = 0
        for row in wall:
            current = 0
            for brick in row:
                current += brick
                if current == pos:
                    edges_at_pos += 1
                    break
                elif current > pos:
                    break
        crossed = len(wall) - edges_at_pos
        min_crossed = min(min_crossed, crossed)

    return min_crossed
```

**Why this is inefficient:** For a wall with width `w` and `n` rows, this takes O(w × n × average_bricks_per_row) time. If the wall is very wide (say 10,000 units) with many thin bricks, this becomes O(w × n²) in worst case. We need a smarter approach.

## Optimized Approach

The key insight is that **we don't need to check every pixel position**. We only need to check positions where brick edges actually occur. Since edges occur at cumulative sums of brick widths, we can:

1. For each row, calculate cumulative brick widths (stopping before the last brick, since the wall's right edge doesn't count).
2. Track how many rows have an edge at each cumulative sum using a hash map.
3. Find the cumulative sum with the maximum edge count.
4. The minimum bricks crossed = total rows - maximum edges aligned.

Why does this work? If `max_edges` rows have aligned edges at some position, then drawing a line there avoids those `max_edges` bricks, crossing only the remaining rows.

The optimization comes from using a hash map to count edges in O(1) time per edge, giving us O(total number of bricks) time complexity instead of O(width × rows).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * m) where n = rows, m = avg bricks per row
# Space: O(k) where k = number of unique edge positions
def leastBricks(wall):
    """
    Calculate the minimum number of bricks crossed by a vertical line.

    Args:
        wall: List of lists, where each inner list represents brick widths in a row

    Returns:
        Minimum number of bricks crossed
    """
    # Dictionary to count how many rows have an edge at each position
    edge_count = {}

    # Iterate through each row of the wall
    for row in wall:
        # Track cumulative width as we move across bricks
        cumulative_width = 0

        # Process all bricks except the last one
        # (The last brick's edge is the wall's right edge, which we ignore)
        for brick in row[:-1]:  # Exclude the last brick
            cumulative_width += brick

            # Increment count for this edge position
            # Using get() with default 0 for positions not yet seen
            edge_count[cumulative_width] = edge_count.get(cumulative_width, 0) + 1

    # If no edges were found (all rows have exactly one brick),
    # then we must cross all bricks
    if not edge_count:
        return len(wall)

    # Find the maximum number of edges aligned at any position
    # More edges aligned = fewer bricks crossed
    max_edges_aligned = max(edge_count.values())

    # Minimum bricks crossed = total rows - maximum edges aligned
    return len(wall) - max_edges_aligned
```

```javascript
// Time: O(n * m) where n = rows, m = avg bricks per row
// Space: O(k) where k = number of unique edge positions
function leastBricks(wall) {
  /**
   * Calculate the minimum number of bricks crossed by a vertical line.
   *
   * @param {number[][]} wall - Array of arrays, each inner array represents brick widths in a row
   * @return {number} Minimum number of bricks crossed
   */
  // Map to count how many rows have an edge at each position
  const edgeCount = new Map();

  // Iterate through each row of the wall
  for (const row of wall) {
    // Track cumulative width as we move across bricks
    let cumulativeWidth = 0;

    // Process all bricks except the last one
    // The last brick's edge is the wall's right edge, which we ignore
    for (let i = 0; i < row.length - 1; i++) {
      cumulativeWidth += row[i];

      // Increment count for this edge position
      const currentCount = edgeCount.get(cumulativeWidth) || 0;
      edgeCount.set(cumulativeWidth, currentCount + 1);
    }
  }

  // If no edges were found (all rows have exactly one brick),
  // then we must cross all bricks
  if (edgeCount.size === 0) {
    return wall.length;
  }

  // Find the maximum number of edges aligned at any position
  // More edges aligned = fewer bricks crossed
  let maxEdgesAligned = 0;
  for (const count of edgeCount.values()) {
    maxEdgesAligned = Math.max(maxEdgesAligned, count);
  }

  // Minimum bricks crossed = total rows - maximum edges aligned
  return wall.length - maxEdgesAligned;
}
```

```java
// Time: O(n * m) where n = rows, m = avg bricks per row
// Space: O(k) where k = number of unique edge positions
import java.util.*;

class Solution {
    public int leastBricks(List<List<Integer>> wall) {
        /**
         * Calculate the minimum number of bricks crossed by a vertical line.
         *
         * @param wall List of lists, where each inner list represents brick widths in a row
         * @return Minimum number of bricks crossed
         */
        // HashMap to count how many rows have an edge at each position
        Map<Integer, Integer> edgeCount = new HashMap<>();

        // Iterate through each row of the wall
        for (List<Integer> row : wall) {
            // Track cumulative width as we move across bricks
            int cumulativeWidth = 0;

            // Process all bricks except the last one
            // The last brick's edge is the wall's right edge, which we ignore
            for (int i = 0; i < row.size() - 1; i++) {
                cumulativeWidth += row.get(i);

                // Increment count for this edge position
                // Using getOrDefault for positions not yet seen
                edgeCount.put(cumulativeWidth,
                             edgeCount.getOrDefault(cumulativeWidth, 0) + 1);
            }
        }

        // If no edges were found (all rows have exactly one brick),
        // then we must cross all bricks
        if (edgeCount.isEmpty()) {
            return wall.size();
        }

        // Find the maximum number of edges aligned at any position
        // More edges aligned = fewer bricks crossed
        int maxEdgesAligned = 0;
        for (int count : edgeCount.values()) {
            maxEdgesAligned = Math.max(maxEdgesAligned, count);
        }

        // Minimum bricks crossed = total rows - maximum edges aligned
        return wall.size() - maxEdgesAligned;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(N), where N is the total number of bricks in the wall. We process each brick exactly once (except the last brick of each row, which we skip). If there are `n` rows with an average of `m` bricks per row, this is O(n × m).

**Space Complexity:** O(K), where K is the number of unique edge positions. In the worst case, if every row has many unique edge positions that don't align with other rows, K could be up to the total number of bricks. However, in practice, edges often align, so the space usage is typically less.

## Common Mistakes

1. **Including the wall's right edge:** The problem specifies drawing a line "from the top to the bottom" of the wall. The right edge of the wall doesn't count as a brick edge you can use. Many candidates forget to exclude the last cumulative sum in each row.

2. **Not handling single-brick rows:** If a row has only one brick, it has no internal edges. If all rows have one brick each, there are no edges to align, so you must cross all bricks. Forgetting this edge case returns 0 instead of the correct answer (number of rows).

3. **Using array instead of hash map:** Some candidates try to use an array of size `total_width` to count edges. This works for small widths but fails memory constraints when width is large (e.g., 2^31 - 1). A hash map only stores positions where edges actually occur.

4. **Off-by-one in cumulative sums:** When calculating cumulative width, it's easy to accidentally include the total width or start from 1 instead of 0. Remember: after adding the first brick of width `w`, the edge is at position `w`, not `w-1` or `w+1`.

## When You'll See This Pattern

This problem uses the **"frequency counting of partial sums"** pattern, which appears in many problems:

1. **Subarray Sum Equals K (LeetCode 560):** Uses a hash map to track cumulative sums to find subarrays summing to K. Similar to tracking edge positions here.

2. **Continuous Subarray Sum (LeetCode 523):** Looks for subarrays with sums divisible by K, using modulo arithmetic on cumulative sums stored in a hash map.

3. **Find Pivot Index (LeetCode 724):** Uses prefix sums to find where left and right sums are equal, similar to finding alignment points.

The core pattern: when you need to find positions where some cumulative metric aligns across multiple sequences, use a hash map to count frequencies of intermediate results.

## Key Takeaways

1. **Transform alignment problems into frequency counting:** Instead of checking every possible position, identify what creates a "good" position (brick edges here) and count how many sequences have that feature at each point.

2. **Hash maps optimize alignment searches:** When looking for matching values across multiple sequences, a hash map gives O(1) lookups instead of O(n) scans.

3. **Exclude boundary conditions carefully:** The right edge of the wall isn't a valid cutting point. Always verify edge cases with single-element sequences or empty inputs.

Related problems: [Number of Ways to Build Sturdy Brick Wall](/problem/number-of-ways-to-build-sturdy-brick-wall)
