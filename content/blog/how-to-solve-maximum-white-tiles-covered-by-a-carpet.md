---
title: "How to Solve Maximum White Tiles Covered by a Carpet — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum White Tiles Covered by a Carpet. Medium difficulty, 35.7% acceptance rate. Topics: Array, Binary Search, Greedy, Sliding Window, Sorting."
date: "2029-10-12"
category: "dsa-patterns"
tags: ["maximum-white-tiles-covered-by-a-carpet", "array", "binary-search", "greedy", "medium"]
---

# How to Solve Maximum White Tiles Covered by a Carpet

This problem asks us to find the maximum number of white tiles we can cover with a carpet of fixed length. The tricky part is that the carpet can be placed anywhere (not necessarily aligned with tile boundaries), and we need to efficiently handle potentially thousands of tile intervals. The core challenge is balancing coverage optimization with computational efficiency.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

```
tiles = [[1,5], [10,11], [12,18], [20,25]]
carpetLen = 10
```

**Step 1: Sort the tiles**
First, we sort by starting position:

```
[[1,5], [10,11], [12,18], [20,25]]
```

**Step 2: Try placing carpet starting at tile 1**
If we place the carpet starting at position 1:

- Covers [1,5] completely (5 tiles)
- Covers [10,11] partially (only position 10, since carpet ends at 10)
  Total: 5 + 1 = 6 tiles

**Step 3: Try placing carpet starting at tile 10**
If we place the carpet starting at position 10:

- Covers [10,11] completely (2 tiles)
- Covers [12,18] partially (positions 12-19, but carpet ends at 19)
  Total: 2 + 7 = 9 tiles

**Step 4: Try placing carpet starting at tile 12**
If we place the carpet starting at position 12:

- Covers [12,18] completely (7 tiles)
- Covers [20,25] partially (only position 20, since carpet ends at 21)
  Total: 7 + 1 = 8 tiles

**Step 5: Try placing carpet starting at tile 20**
If we place the carpet starting at position 20:

- Covers [20,25] completely (6 tiles)
  Total: 6 tiles

The maximum is 9 tiles when starting at position 10.

The key insight: We only need to consider starting positions at the beginning of each tile interval, since starting between intervals would waste carpet coverage.

## Brute Force Approach

A naive approach would be to try every possible starting position for the carpet. Since positions can range from the minimum to maximum tile values, this could be O(n × range) where range could be up to 10^9, which is clearly infeasible.

A slightly better but still inefficient brute force would be to try starting at each tile's beginning position and manually calculate coverage:

1. Sort the tiles by starting position
2. For each tile as a starting point:
   - Calculate how many tiles are covered from that starting position
   - This requires scanning through subsequent tiles until the carpet ends
3. Track the maximum coverage found

This approach is O(n²) in the worst case (when carpet length is very large and covers many tiles). For n up to 10^5, this is too slow.

## Optimized Approach

The optimal solution uses a **sliding window** approach with **prefix sums**:

**Key Insights:**

1. We only need to consider starting the carpet at the beginning of each tile interval (optimal placement principle)
2. We can use a sliding window to track which tiles are currently covered by the carpet
3. Prefix sums allow us to quickly calculate total coverage of fully covered tiles
4. For the partially covered tile at the end, we need special handling

**Step-by-step reasoning:**

1. **Sort tiles** by starting position - this allows us to process them in order
2. **Initialize two pointers** (left and right) for our sliding window
3. **Maintain a running total** of fully covered tiles between left and right-1
4. **For each starting position** (left pointer):
   - Expand the right pointer as far as possible while the carpet can still cover tiles[right]
   - Calculate coverage: fully covered tiles + partial coverage of tiles[right]
   - Update maximum
   - Move left pointer forward, subtracting tiles[left] from running total

The tricky part is handling the partial tile correctly. When the carpet ends inside a tile, we only count the portion from that tile's start to the carpet's end.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) excluding sort space
def maximumWhiteTiles(tiles, carpetLen):
    """
    Find maximum white tiles covered by a carpet of given length.

    Args:
        tiles: List of [start, end] intervals (inclusive)
        carpetLen: Length of the carpet

    Returns:
        Maximum number of white tiles covered
    """
    # Step 1: Sort tiles by starting position
    tiles.sort(key=lambda x: x[0])

    n = len(tiles)
    max_cover = 0
    total_tiles = 0  # Tiles fully covered in current window
    right = 0

    # Step 2: Slide window through all possible starting positions
    for left in range(n):
        # Calculate where the carpet would end if starting at current tile's beginning
        carpet_end = tiles[left][0] + carpetLen - 1

        # Step 3: Expand right pointer as far as possible
        while right < n and tiles[right][0] <= carpet_end:
            total_tiles += tiles[right][1] - tiles[right][0] + 1
            right += 1

        # Step 4: Calculate coverage for current window
        # Handle case where right pointer went beyond all tiles
        if right == 0 or right == left:
            # No tiles covered or window hasn't expanded yet
            current_cover = 0
        else:
            # All tiles from left to right-1 are fully or partially covered
            # Tiles from left to right-2 are fully covered (in total_tiles)
            # The last tile (right-1) might be partially covered

            # Subtract the last tile from total_tiles since it might be partial
            last_tile_full = tiles[right-1][1] - tiles[right-1][0] + 1
            total_without_last = total_tiles - last_tile_full

            # Calculate how much of the last tile is covered
            last_tile_covered = min(carpet_end, tiles[right-1][1]) - tiles[right-1][0] + 1
            last_tile_covered = max(0, last_tile_covered)  # Ensure non-negative

            current_cover = total_without_last + last_tile_covered

        # Step 5: Update maximum coverage
        max_cover = max(max_cover, current_cover)

        # Step 6: Move left pointer forward
        # Subtract the tiles that are no longer covered
        total_tiles -= tiles[left][1] - tiles[left][0] + 1

    return max_cover
```

```javascript
// Time: O(n log n) | Space: O(1) excluding sort space
function maximumWhiteTiles(tiles, carpetLen) {
  /**
   * Find maximum white tiles covered by a carpet of given length.
   *
   * @param {number[][]} tiles - Array of [start, end] intervals (inclusive)
   * @param {number} carpetLen - Length of the carpet
   * @return {number} Maximum number of white tiles covered
   */

  // Step 1: Sort tiles by starting position
  tiles.sort((a, b) => a[0] - b[0]);

  const n = tiles.length;
  let maxCover = 0;
  let totalTiles = 0; // Tiles fully covered in current window
  let right = 0;

  // Step 2: Slide window through all possible starting positions
  for (let left = 0; left < n; left++) {
    // Calculate where the carpet would end if starting at current tile's beginning
    const carpetEnd = tiles[left][0] + carpetLen - 1;

    // Step 3: Expand right pointer as far as possible
    while (right < n && tiles[right][0] <= carpetEnd) {
      totalTiles += tiles[right][1] - tiles[right][0] + 1;
      right++;
    }

    // Step 4: Calculate coverage for current window
    let currentCover = 0;
    if (right > 0 && right > left) {
      // All tiles from left to right-1 are fully or partially covered
      // Tiles from left to right-2 are fully covered (in totalTiles)
      // The last tile (right-1) might be partially covered

      // Subtract the last tile from totalTiles since it might be partial
      const lastTileFull = tiles[right - 1][1] - tiles[right - 1][0] + 1;
      const totalWithoutLast = totalTiles - lastTileFull;

      // Calculate how much of the last tile is covered
      let lastTileCovered = Math.min(carpetEnd, tiles[right - 1][1]) - tiles[right - 1][0] + 1;
      lastTileCovered = Math.max(0, lastTileCovered); // Ensure non-negative

      currentCover = totalWithoutLast + lastTileCovered;
    }

    // Step 5: Update maximum coverage
    maxCover = Math.max(maxCover, currentCover);

    // Step 6: Move left pointer forward
    // Subtract the tiles that are no longer covered
    totalTiles -= tiles[left][1] - tiles[left][0] + 1;
  }

  return maxCover;
}
```

```java
// Time: O(n log n) | Space: O(1) excluding sort space
import java.util.Arrays;

class Solution {
    public int maximumWhiteTiles(int[][] tiles, int carpetLen) {
        /**
         * Find maximum white tiles covered by a carpet of given length.
         *
         * @param tiles - Array of [start, end] intervals (inclusive)
         * @param carpetLen - Length of the carpet
         * @return Maximum number of white tiles covered
         */

        // Step 1: Sort tiles by starting position
        Arrays.sort(tiles, (a, b) -> Integer.compare(a[0], b[0]));

        int n = tiles.length;
        int maxCover = 0;
        int totalTiles = 0;  // Tiles fully covered in current window
        int right = 0;

        // Step 2: Slide window through all possible starting positions
        for (int left = 0; left < n; left++) {
            // Calculate where the carpet would end if starting at current tile's beginning
            int carpetEnd = tiles[left][0] + carpetLen - 1;

            // Step 3: Expand right pointer as far as possible
            while (right < n && tiles[right][0] <= carpetEnd) {
                totalTiles += tiles[right][1] - tiles[right][0] + 1;
                right++;
            }

            // Step 4: Calculate coverage for current window
            if (right > 0 && right > left) {
                // All tiles from left to right-1 are fully or partially covered
                // Tiles from left to right-2 are fully covered (in totalTiles)
                // The last tile (right-1) might be partially covered

                // Subtract the last tile from totalTiles since it might be partial
                int lastTileFull = tiles[right - 1][1] - tiles[right - 1][0] + 1;
                int totalWithoutLast = totalTiles - lastTileFull;

                // Calculate how much of the last tile is covered
                int lastTileCovered = Math.min(carpetEnd, tiles[right - 1][1]) - tiles[right - 1][0] + 1;
                lastTileCovered = Math.max(0, lastTileCovered);  // Ensure non-negative

                int currentCover = totalWithoutLast + lastTileCovered;

                // Step 5: Update maximum coverage
                maxCover = Math.max(maxCover, currentCover);
            }

            // Step 6: Move left pointer forward
            // Subtract the tiles that are no longer covered
            totalTiles -= tiles[left][1] - tiles[left][0] + 1;
        }

        return maxCover;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the tiles takes O(n log n)
- The sliding window processes each tile at most twice (once as left pointer, once as right pointer), which is O(n)
- Total: O(n log n + n) = O(n log n)

**Space Complexity: O(1)** (excluding the space required for sorting)

- We use only a constant amount of extra space for pointers and counters
- If we consider the sort operation, it typically requires O(log n) space for the recursion stack in most sorting algorithms

## Common Mistakes

1. **Forgetting to sort the tiles**: The sliding window approach relies on tiles being processed in order. Without sorting, the algorithm won't work correctly.

2. **Off-by-one errors with inclusive ranges**: Tile intervals are inclusive [li, ri], meaning both endpoints count. A common mistake is calculating length as `ri - li` instead of `ri - li + 1`.

3. **Incorrect partial tile calculation**: When the carpet ends inside a tile, candidates often miscalculate how much of that tile is covered. Remember to use `min(carpetEnd, tileEnd) - tileStart + 1`.

4. **Not handling empty or single tile cases**: Always test edge cases like empty tile list, carpet longer than all tiles combined, or carpet shorter than the smallest tile.

## When You'll See This Pattern

This problem combines **sliding window** with **interval processing**, a pattern that appears in many LeetCode problems:

1. **Maximum Number of Vowels in a Substring of Given Length (1456)**: Similar sliding window approach but with a fixed window size instead of dynamic expansion.

2. **Minimum Size Subarray Sum (209)**: Uses sliding window to find the smallest subarray with sum ≥ target, similar to finding coverage ≥ carpet length.

3. **Meeting Rooms II (253)**: Also involves processing intervals, though it uses a different technique (min-heap for room allocation).

The key pattern is when you need to find an optimal contiguous segment in a sorted sequence, especially when the segment can cover multiple elements partially.

## Key Takeaways

1. **Sliding window with two pointers** is powerful for finding optimal contiguous segments in sorted data. The right pointer expands to include as much as possible, while the left pointer contracts to explore other possibilities.

2. **Sorting intervals by start time** is often the first step in interval-related problems. This enables efficient scanning and comparison.

3. **Handle partial coverage carefully** in interval problems. The edge cases at window boundaries are where most bugs occur, so always test them thoroughly.

Related problems: [Maximum Number of Vowels in a Substring of Given Length](/problem/maximum-number-of-vowels-in-a-substring-of-given-length)
