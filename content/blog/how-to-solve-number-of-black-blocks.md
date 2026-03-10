---
title: "How to Solve Number of Black Blocks — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Black Blocks. Medium difficulty, 41.5% acceptance rate. Topics: Array, Hash Table, Enumeration."
date: "2029-10-29"
category: "dsa-patterns"
tags: ["number-of-black-blocks", "array", "hash-table", "enumeration", "medium"]
---

# How to Solve Number of Black Blocks

This problem asks us to count how many 2×2 blocks in an m×n grid contain exactly 0, 1, 2, 3, or 4 black cells, given a list of black cell coordinates. The challenge lies in efficiently tracking which 2×2 blocks are affected by each black cell without checking every possible block.

## Visual Walkthrough

Let's walk through a small example: m=3, n=3, coordinates=[[0,0],[1,1],[2,2]]

We have a 3×3 grid with black cells at (0,0), (1,1), and (2,2). The valid 2×2 blocks in this grid are:

- Block with top-left at (0,0): covers cells (0,0), (0,1), (1,0), (1,1)
- Block with top-left at (0,1): covers cells (0,1), (0,2), (1,1), (1,2)
- Block with top-left at (1,0): covers cells (1,0), (1,1), (2,0), (2,1)
- Block with top-left at (1,1): covers cells (1,1), (1,2), (2,1), (2,2)

Now let's count black cells in each block:

- Block (0,0): contains black cells at (0,0) and (1,1) → 2 black cells
- Block (0,1): contains black cell at (1,1) → 1 black cell
- Block (1,0): contains black cell at (1,1) → 1 black cell
- Block (1,1): contains black cells at (1,1) and (2,2) → 2 black cells

So our result would be: [1, 2, 1, 0, 0] meaning:

- 1 block with 0 black cells (none in this case, but there are 4 total blocks and we counted 4)
- 2 blocks with 1 black cell (blocks (0,1) and (1,0))
- 1 block with 2 black cells (block (0,0))
- 0 blocks with 3 black cells
- 0 blocks with 4 black cells

Wait, we have 4 blocks total but only counted 3? Actually block (1,1) has 2 black cells, so that's 2 blocks with 2 black cells total.

## Brute Force Approach

The brute force approach would be to:

1. Create a 2D boolean array to mark black cells
2. Iterate through all possible 2×2 blocks (top-left corners from (0,0) to (m-2,n-2))
3. For each block, count how many of its 4 cells are black
4. Increment the corresponding count in our result array

The problem with this approach is its time complexity: O(m×n + k) where k is the number of coordinates. For m,n up to 10^5, this is far too slow (10^10 operations). We need a smarter approach that only looks at blocks affected by black cells.

## Optimized Approach

The key insight is that **each black cell affects only the 2×2 blocks that contain it**. A black cell at position (x,y) can be part of up to 4 different 2×2 blocks:

- Block with top-left at (x-1, y-1) if x>0 and y>0
- Block with top-left at (x-1, y) if x>0 and y<n-1
- Block with top-left at (x, y-1) if x<m-1 and y>0
- Block with top-left at (x, y) if x<m-1 and y<n-1

Instead of checking every block, we can:

1. For each black cell, find all 2×2 blocks that contain it
2. Increment a counter for each of those blocks
3. After processing all black cells, we know how many black cells each block contains
4. Count how many blocks have 0, 1, 2, 3, or 4 black cells

However, we need to handle blocks with 0 black cells specially, since they won't be touched by any black cell. We can calculate: total blocks = (m-1)\*(n-1), then blocks with 0 black cells = total blocks - (blocks with 1+ black cells).

## Optimal Solution

We'll use a hash map to track how many black cells each block contains. For each black cell, we find all valid blocks that contain it and increment their counts. Finally, we count how many blocks have each count value.

<div class="code-group">

```python
# Time: O(k) where k is the number of coordinates
# Space: O(min(k*4, (m-1)*(n-1))) for the hash map
def countBlackBlocks(m, n, coordinates):
    """
    Counts how many 2x2 blocks contain 0, 1, 2, 3, or 4 black cells.

    Args:
        m: Number of rows in the grid
        n: Number of columns in the grid
        coordinates: List of [x, y] coordinates of black cells

    Returns:
        List of 5 integers: counts of blocks with 0, 1, 2, 3, 4 black cells
    """
    from collections import defaultdict

    # Dictionary to count black cells in each 2x2 block
    # Key: (top-left row, top-left col) of the block
    # Value: number of black cells in that block
    block_counts = defaultdict(int)

    # For each black cell, find all 2x2 blocks that contain it
    for x, y in coordinates:
        # Check all 4 possible blocks that could contain this black cell
        # Block with top-left at (x-1, y-1)
        if x > 0 and y > 0:
            block_counts[(x-1, y-1)] += 1

        # Block with top-left at (x-1, y)
        if x > 0 and y < n-1:
            block_counts[(x-1, y)] += 1

        # Block with top-left at (x, y-1)
        if x < m-1 and y > 0:
            block_counts[(x, y-1)] += 1

        # Block with top-left at (x, y)
        if x < m-1 and y < n-1:
            block_counts[(x, y)] += 1

    # Initialize result array for counts of blocks with 0, 1, 2, 3, 4 black cells
    result = [0] * 5

    # Count how many blocks have 1, 2, 3, or 4 black cells
    for count in block_counts.values():
        if count <= 4:  # Safety check, though count will never exceed 4
            result[count] += 1

    # Calculate blocks with 0 black cells
    # Total possible 2x2 blocks = (m-1) * (n-1)
    total_blocks = (m-1) * (n-1)
    blocks_with_black = sum(result[1:])  # Blocks with 1+ black cells
    result[0] = total_blocks - blocks_with_black

    return result
```

```javascript
// Time: O(k) where k is the number of coordinates
// Space: O(min(k*4, (m-1)*(n-1))) for the hash map
function countBlackBlocks(m, n, coordinates) {
  /**
   * Counts how many 2x2 blocks contain 0, 1, 2, 3, or 4 black cells.
   *
   * @param {number} m - Number of rows in the grid
   * @param {number} n - Number of columns in the grid
   * @param {number[][]} coordinates - Array of [x, y] coordinates of black cells
   * @return {number[]} - Array of 5 integers: counts of blocks with 0, 1, 2, 3, 4 black cells
   */

  // Map to count black cells in each 2x2 block
  // Key: string representation of (top-left row, top-left col)
  // Value: number of black cells in that block
  const blockCounts = new Map();

  // For each black cell, find all 2x2 blocks that contain it
  for (const [x, y] of coordinates) {
    // Check all 4 possible blocks that could contain this black cell

    // Block with top-left at (x-1, y-1)
    if (x > 0 && y > 0) {
      const key = `${x - 1},${y - 1}`;
      blockCounts.set(key, (blockCounts.get(key) || 0) + 1);
    }

    // Block with top-left at (x-1, y)
    if (x > 0 && y < n - 1) {
      const key = `${x - 1},${y}`;
      blockCounts.set(key, (blockCounts.get(key) || 0) + 1);
    }

    // Block with top-left at (x, y-1)
    if (x < m - 1 && y > 0) {
      const key = `${x},${y - 1}`;
      blockCounts.set(key, (blockCounts.get(key) || 0) + 1);
    }

    // Block with top-left at (x, y)
    if (x < m - 1 && y < n - 1) {
      const key = `${x},${y}`;
      blockCounts.set(key, (blockCounts.get(key) || 0) + 1);
    }
  }

  // Initialize result array for counts of blocks with 0, 1, 2, 3, 4 black cells
  const result = [0, 0, 0, 0, 0];

  // Count how many blocks have 1, 2, 3, or 4 black cells
  for (const count of blockCounts.values()) {
    if (count <= 4) {
      // Safety check
      result[count]++;
    }
  }

  // Calculate blocks with 0 black cells
  // Total possible 2x2 blocks = (m-1) * (n-1)
  const totalBlocks = (m - 1) * (n - 1);
  const blocksWithBlack = result[1] + result[2] + result[3] + result[4];
  result[0] = totalBlocks - blocksWithBlack;

  return result;
}
```

```java
// Time: O(k) where k is the number of coordinates
// Space: O(min(k*4, (m-1)*(n-1))) for the hash map
import java.util.*;

class Solution {
    public long[] countBlackBlocks(int m, int n, int[][] coordinates) {
        /**
         * Counts how many 2x2 blocks contain 0, 1, 2, 3, or 4 black cells.
         *
         * @param m - Number of rows in the grid
         * @param n - Number of columns in the grid
         * @param coordinates - Array of [x, y] coordinates of black cells
         * @return - Array of 5 longs: counts of blocks with 0, 1, 2, 3, 4 black cells
         */

        // Map to count black cells in each 2x2 block
        // Key: Pair of (top-left row, top-left col)
        // Value: number of black cells in that block
        Map<String, Integer> blockCounts = new HashMap<>();

        // For each black cell, find all 2x2 blocks that contain it
        for (int[] coord : coordinates) {
            int x = coord[0];
            int y = coord[1];

            // Check all 4 possible blocks that could contain this black cell

            // Block with top-left at (x-1, y-1)
            if (x > 0 && y > 0) {
                String key = (x-1) + "," + (y-1);
                blockCounts.put(key, blockCounts.getOrDefault(key, 0) + 1);
            }

            // Block with top-left at (x-1, y)
            if (x > 0 && y < n-1) {
                String key = (x-1) + "," + y;
                blockCounts.put(key, blockCounts.getOrDefault(key, 0) + 1);
            }

            // Block with top-left at (x, y-1)
            if (x < m-1 && y > 0) {
                String key = x + "," + (y-1);
                blockCounts.put(key, blockCounts.getOrDefault(key, 0) + 1);
            }

            // Block with top-left at (x, y)
            if (x < m-1 && y < n-1) {
                String key = x + "," + y;
                blockCounts.put(key, blockCounts.getOrDefault(key, 0) + 1);
            }
        }

        // Initialize result array for counts of blocks with 0, 1, 2, 3, 4 black cells
        long[] result = new long[5];

        // Count how many blocks have 1, 2, 3, or 4 black cells
        for (int count : blockCounts.values()) {
            if (count <= 4) {  // Safety check
                result[count]++;
            }
        }

        // Calculate blocks with 0 black cells
        // Total possible 2x2 blocks = (m-1) * (n-1)
        long totalBlocks = (long)(m-1) * (n-1);
        long blocksWithBlack = result[1] + result[2] + result[3] + result[4];
        result[0] = totalBlocks - blocksWithBlack;

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(k)** where k is the number of black cells (coordinates). For each black cell, we perform up to 4 operations to update the blocks that contain it. This is much better than O(m×n) since k can be much smaller than the grid size.

**Space Complexity: O(min(4k, (m-1)×(n-1)))** for the hash map. In the worst case, each black cell could contribute to 4 different blocks, but there are at most (m-1)×(n-1) total blocks. The actual space used is the number of distinct blocks that contain at least one black cell.

## Common Mistakes

1. **Off-by-one errors in block boundaries**: Forgetting that valid top-left corners go from (0,0) to (m-2,n-2), not (m-1,n-1). Always check that x < m-1 and y < n-1 for blocks with top-left at (x,y).

2. **Not handling the 0-count case properly**: Blocks with 0 black cells won't appear in our hash map, so we need to calculate them as: total blocks - (blocks with 1+ black cells). Forgetting this leads to incorrect results.

3. **Using array instead of hash map for block counts**: With m,n up to 10^5, creating a (m-1)×(n-1) array would use 10^10 memory, which is impossible. Always use a hash map to store only blocks that actually have black cells.

4. **Integer overflow when calculating total blocks**: When m and n are large (up to 10^5), (m-1)×(n-1) can exceed 32-bit integer range. Use 64-bit integers (long in Java, default in Python).

## When You'll See This Pattern

This "incremental update" pattern appears in many grid problems:

1. **Range Sum Query 2D - Mutable (LeetCode 308)**: Similar concept of updating cells and querying rectangular regions efficiently.

2. **Bomb Enemy (LeetCode 361)**: Counting enemies in rows and columns affected by placing bombs at certain positions.

3. **Image Overlap (LeetCode 835)**: Finding maximum overlap by tracking how many 1s align at each offset.

The core pattern is: instead of recomputing everything from scratch for each query or update, track how each element affects the overall structure and update incrementally.

## Key Takeaways

1. **Think in terms of contributions**: Each black cell contributes to up to 4 blocks. By tracking these contributions, we avoid examining blocks that have no black cells.

2. **Use the right data structure for sparse data**: When most elements are zero/default, use a hash map instead of a full array to save space.

3. **Handle edge cases in grid problems**: Always check boundaries (x>0, y>0, x<m-1, y<n-1) when accessing neighboring cells or blocks.

[Practice this problem on CodeJeet](/problem/number-of-black-blocks)
