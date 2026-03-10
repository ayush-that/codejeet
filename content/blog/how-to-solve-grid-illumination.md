---
title: "How to Solve Grid Illumination — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Grid Illumination. Hard difficulty, 39.0% acceptance rate. Topics: Array, Hash Table."
date: "2029-07-03"
category: "dsa-patterns"
tags: ["grid-illumination", "array", "hash-table", "hard"]
---

# How to Solve Grid Illumination

Grid Illumination is a challenging problem that tests your ability to efficiently track relationships in a 2D grid. The core difficulty lies in checking whether any lamp illuminates a given cell, which would be straightforward with a brute force approach but becomes computationally expensive when dealing with large grids and many queries. The interesting twist is that lamps get turned off during the query process, requiring dynamic updates to our illumination tracking system.

## Visual Walkthrough

Let's walk through a small example to build intuition. Suppose we have:

- `n = 5` (5x5 grid)
- `lamps = [[1,1], [2,2], [3,3]]`
- `queries = [[1,0], [1,4], [2,3], [3,4]]`

**Initial setup:**
We have lamps at (1,1), (2,2), and (3,3). Each lamp illuminates:

- Its entire row (all cells with same row index)
- Its entire column (all cells with same column index)
- Its diagonal (cells where row - column is constant)
- Its anti-diagonal (cells where row + column is constant)

**First query: [1,0]**

- Check if any lamp illuminates cell (1,0):
  - Row 1: Lamp at (1,1) illuminates all of row 1 → YES
- Since cell (1,0) is illuminated, we need to turn off lamps in its 3x3 neighborhood:
  - Check cells: (0,-1) to (2,1) - only (1,1) exists and has a lamp
  - Turn off lamp at (1,1)
- Result: `[1]` (illuminated)

**Second query: [1,4]**

- Check if any lamp illuminates cell (1,4):
  - Row 1: Lamp at (1,1) was turned off
  - Column 4: No lamps in column 4
  - Diagonal (row-col = -3): No lamps on this diagonal
  - Anti-diagonal (row+col = 5): No lamps on this anti-diagonal
- Result: `[0]` (not illuminated)

**Third query: [2,3]**

- Check if any lamp illuminates cell (2,3):
  - Row 2: Lamp at (2,2) illuminates all of row 2 → YES
- Turn off lamps in 3x3 neighborhood around (2,3):
  - Check cells: (1,2) to (3,4) - only (2,2) exists and has a lamp
  - Turn off lamp at (2,2)
- Result: `[1]` (illuminated)

**Fourth query: [3,4]**

- Check if any lamp illuminates cell (3,4):
  - Row 3: Lamp at (3,3) illuminates all of row 3 → YES
- Turn off lamps in 3x3 neighborhood:
  - Check cells: (2,3) to (4,5) - only (3,3) exists and has a lamp
  - Turn off lamp at (3,3)
- Result: `[1]` (illuminated)

Final answer: `[1, 0, 1, 1]`

## Brute Force Approach

A naive approach would be to:

1. Store all lamp positions in a list
2. For each query:
   - Check all lamps to see if any illuminates the query cell
   - If illuminated, check all lamps to see which ones are in the 3x3 neighborhood and remove them

This approach has several problems:

- Checking all lamps for each query is O(L) where L is the number of lamps
- With Q queries, this becomes O(L × Q), which is too slow when L and Q are large (up to 10⁹ operations)
- Removing lamps requires searching through the list, which is also O(L)
- We need to handle duplicate lamps in the input

The brute force approach fails because it doesn't leverage the mathematical properties of illumination. A lamp illuminates not just individual cells but entire lines (rows, columns, diagonals), so we need a way to track these relationships efficiently.

## Optimized Approach

The key insight is that we don't need to check individual lamps—we need to check if **any** lamp exists on the same row, column, diagonal, or anti-diagonal as the query cell. This suggests using hash maps to count lamps along each of these four dimensions:

1. **Rows**: Track how many lamps are in each row
2. **Columns**: Track how many lamps are in each column
3. **Diagonals**: Track lamps where `row - column` is constant (all cells on the same diagonal)
4. **Anti-diagonals**: Track lamps where `row + column` is constant (all cells on the same anti-diagonal)

Additionally, we need a fast way to:

- Check if a specific cell has a lamp (for turning off lamps in the 3x3 neighborhood)
- Handle duplicate lamps (a lamp might be listed multiple times in the input)

The optimal solution uses:

- Four hash maps for row, column, diagonal, and anti-diagonal counts
- A set (or hash map) to track which cells actually have lamps, handling duplicates

For each query:

1. Check if any of the four hash maps has a count > 0 for the query cell's dimensions
2. If illuminated, check the 3x3 neighborhood and turn off any lamps found there
3. Turning off a lamp means decrementing counts in all four hash maps

## Optimal Solution

<div class="code-group">

```python
# Time: O(L + Q) where L = len(lamps), Q = len(queries)
# Space: O(L) for storing lamp positions and counts
class Solution:
    def gridIllumination(self, n: int, lamps: List[List[int]], queries: List[List[int]]) -> List[int]:
        # Four dictionaries to track lamp counts along each dimension
        rows = defaultdict(int)      # row index -> count of lamps in this row
        cols = defaultdict(int)      # col index -> count of lamps in this column
        diag = defaultdict(int)      # (row - col) -> count of lamps on this diagonal
        anti = defaultdict(int)      # (row + col) -> count of lamps on this anti-diagonal
        # Set to track which cells actually have lamps (handles duplicates)
        lamp_set = set()

        # Step 1: Process all lamps and populate our tracking structures
        for r, c in lamps:
            # Use tuple for hashable key in set
            lamp_key = (r, c)
            # Skip duplicates - each lamp should only be counted once
            if lamp_key in lamp_set:
                continue
            # Add to set to mark this cell as having a lamp
            lamp_set.add(lamp_key)
            # Update all four tracking dictionaries
            rows[r] += 1
            cols[c] += 1
            diag[r - c] += 1  # Diagonal: cells with same (row - col) value
            anti[r + c] += 1  # Anti-diagonal: cells with same (row + col) value

        result = []
        # Directions for 3x3 neighborhood: center + 8 surrounding cells
        directions = [
            (0, 0), (0, 1), (0, -1),  # center, right, left
            (1, 0), (-1, 0),          # down, up
            (1, 1), (1, -1),          # down-right, down-left
            (-1, 1), (-1, -1)         # up-right, up-left
        ]

        # Step 2: Process each query
        for qr, qc in queries:
            # Check if query cell is illuminated
            # Cell is illuminated if ANY of the four dimensions has at least one lamp
            illuminated = (rows[qr] > 0 or cols[qc] > 0 or
                          diag[qr - qc] > 0 or anti[qr + qc] > 0)
            result.append(1 if illuminated else 0)

            # Step 3: If illuminated, turn off lamps in 3x3 neighborhood
            if illuminated:
                for dr, dc in directions:
                    nr, nc = qr + dr, qc + dc
                    # Check if neighbor is within grid bounds
                    if 0 <= nr < n and 0 <= nc < n:
                        lamp_key = (nr, nc)
                        # If this cell has a lamp, turn it off
                        if lamp_key in lamp_set:
                            # Remove from set first to prevent double removal
                            lamp_set.remove(lamp_key)
                            # Decrement counts in all four dictionaries
                            rows[nr] -= 1
                            cols[nc] -= 1
                            diag[nr - nc] -= 1
                            anti[nr + nc] -= 1

        return result
```

```javascript
// Time: O(L + Q) where L = lamps.length, Q = queries.length
// Space: O(L) for storing lamp positions and counts
/**
 * @param {number} n
 * @param {number[][]} lamps
 * @param {number[][]} queries
 * @return {number[]}
 */
var gridIllumination = function (n, lamps, queries) {
  // Four maps to track lamp counts along each dimension
  const rows = new Map(); // row index -> count of lamps in this row
  const cols = new Map(); // col index -> count of lamps in this column
  const diag = new Map(); // (row - col) -> count of lamps on this diagonal
  const anti = new Map(); // (row + col) -> count of lamps on this anti-diagonal
  // Set to track which cells actually have lamps (handles duplicates)
  const lampSet = new Set();

  // Helper function to safely update map counts
  const updateMap = (map, key, delta) => {
    const count = (map.get(key) || 0) + delta;
    if (count === 0) {
      map.delete(key); // Clean up zero counts to save space
    } else {
      map.set(key, count);
    }
  };

  // Step 1: Process all lamps and populate our tracking structures
  for (const [r, c] of lamps) {
    // Create unique key for this lamp position
    const lampKey = `${r},${c}`;
    // Skip duplicates - each lamp should only be counted once
    if (lampSet.has(lampKey)) continue;

    // Add to set to mark this cell as having a lamp
    lampSet.add(lampKey);

    // Update all four tracking maps
    updateMap(rows, r, 1);
    updateMap(cols, c, 1);
    updateMap(diag, r - c, 1); // Diagonal: cells with same (row - col) value
    updateMap(anti, r + c, 1); // Anti-diagonal: cells with same (row + col) value
  }

  const result = [];
  // Directions for 3x3 neighborhood: center + 8 surrounding cells
  const directions = [
    [0, 0],
    [0, 1],
    [0, -1], // center, right, left
    [1, 0],
    [-1, 0], // down, up
    [1, 1],
    [1, -1], // down-right, down-left
    [-1, 1],
    [-1, -1], // up-right, up-left
  ];

  // Step 2: Process each query
  for (const [qr, qc] of queries) {
    // Check if query cell is illuminated
    // Cell is illuminated if ANY of the four dimensions has at least one lamp
    const illuminated =
      (rows.get(qr) || 0) > 0 ||
      (cols.get(qc) || 0) > 0 ||
      (diag.get(qr - qc) || 0) > 0 ||
      (anti.get(qr + qc) || 0) > 0;
    result.push(illuminated ? 1 : 0);

    // Step 3: If illuminated, turn off lamps in 3x3 neighborhood
    if (illuminated) {
      for (const [dr, dc] of directions) {
        const nr = qr + dr;
        const nc = qc + dc;

        // Check if neighbor is within grid bounds
        if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
          const lampKey = `${nr},${nc}`;

          // If this cell has a lamp, turn it off
          if (lampSet.has(lampKey)) {
            // Remove from set first to prevent double removal
            lampSet.delete(lampKey);
            // Decrement counts in all four maps
            updateMap(rows, nr, -1);
            updateMap(cols, nc, -1);
            updateMap(diag, nr - nc, -1);
            updateMap(anti, nr + nc, -1);
          }
        }
      }
    }
  }

  return result;
};
```

```java
// Time: O(L + Q) where L = lamps.length, Q = queries.length
// Space: O(L) for storing lamp positions and counts
class Solution {
    public int[] gridIllumination(int n, int[][] lamps, int[][] queries) {
        // Four maps to track lamp counts along each dimension
        Map<Integer, Integer> rows = new HashMap<>();      // row index -> count
        Map<Integer, Integer> cols = new HashMap<>();      // col index -> count
        Map<Integer, Integer> diag = new HashMap<>();      // (row - col) -> count
        Map<Integer, Integer> anti = new HashMap<>();      // (row + col) -> count
        // Set to track which cells actually have lamps (handles duplicates)
        Set<Long> lampSet = new HashSet<>();

        // Step 1: Process all lamps and populate our tracking structures
        for (int[] lamp : lamps) {
            int r = lamp[0];
            int c = lamp[1];
            // Create unique key for this lamp position using bit manipulation
            long key = (long) r * n + c;

            // Skip duplicates - each lamp should only be counted once
            if (lampSet.contains(key)) continue;

            // Add to set to mark this cell as having a lamp
            lampSet.add(key);

            // Update all four tracking maps
            rows.put(r, rows.getOrDefault(r, 0) + 1);
            cols.put(c, cols.getOrDefault(c, 0) + 1);
            diag.put(r - c, diag.getOrDefault(r - c, 0) + 1);  // Diagonal
            anti.put(r + c, anti.getOrDefault(r + c, 0) + 1);  // Anti-diagonal
        }

        int[] result = new int[queries.length];
        // Directions for 3x3 neighborhood: center + 8 surrounding cells
        int[][] directions = {
            {0, 0}, {0, 1}, {0, -1},  // center, right, left
            {1, 0}, {-1, 0},          // down, up
            {1, 1}, {1, -1},          // down-right, down-left
            {-1, 1}, {-1, -1}         // up-right, up-left
        };

        // Step 2: Process each query
        for (int i = 0; i < queries.length; i++) {
            int qr = queries[i][0];
            int qc = queries[i][1];

            // Check if query cell is illuminated
            // Cell is illuminated if ANY of the four dimensions has at least one lamp
            boolean illuminated = (rows.getOrDefault(qr, 0) > 0 ||
                                  cols.getOrDefault(qc, 0) > 0 ||
                                  diag.getOrDefault(qr - qc, 0) > 0 ||
                                  anti.getOrDefault(qr + qc, 0) > 0);
            result[i] = illuminated ? 1 : 0;

            // Step 3: If illuminated, turn off lamps in 3x3 neighborhood
            if (illuminated) {
                for (int[] dir : directions) {
                    int nr = qr + dir[0];
                    int nc = qc + dir[1];

                    // Check if neighbor is within grid bounds
                    if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                        long key = (long) nr * n + nc;

                        // If this cell has a lamp, turn it off
                        if (lampSet.contains(key)) {
                            // Remove from set first to prevent double removal
                            lampSet.remove(key);
                            // Decrement counts in all four maps
                            rows.put(nr, rows.getOrDefault(nr, 0) - 1);
                            cols.put(nc, cols.getOrDefault(nc, 0) - 1);
                            diag.put(nr - nc, diag.getOrDefault(nr - nc, 0) - 1);
                            anti.put(nr + nc, anti.getOrDefault(nr + nc, 0) - 1);

                            // Clean up zero counts (optional, saves memory)
                            if (rows.get(nr) == 0) rows.remove(nr);
                            if (cols.get(nc) == 0) cols.remove(nc);
                            if (diag.get(nr - nc) == 0) diag.remove(nr - nc);
                            if (anti.get(nr + nc) == 0) anti.remove(nr + nc);
                        }
                    }
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(L + Q)**

- **O(L)**: Processing all lamps to build the hash maps and set
- **O(Q)**: Processing all queries, where each query takes O(1) to check illumination and O(1) to check the 3x3 neighborhood (constant 9 cells)
- Total: O(L + Q), which is optimal since we need to at least look at each input element once

**Space Complexity: O(L)**

- We store each unique lamp in a set: O(L)
- We store counts in four hash maps, but each lamp contributes to exactly one entry in each map: O(4L) = O(L)
- Total: O(L), where L is the number of unique lamps

## Common Mistakes

1. **Not handling duplicate lamps**: The problem states "Even if the same lamp is listed more than once, it is turned on at most once." Candidates who don't deduplicate will overcount lamps, leading to incorrect illumination checks and failed test cases.

2. **Forgetting to check grid bounds when turning off lamps**: When checking the 3x3 neighborhood around a query cell, you must verify that each neighbor is within the 0 to n-1 range. Checking out-of-bounds cells will cause index errors or incorrect lamp removal.

3. **Incorrect diagonal/anti-diagonal formulas**:
   - Diagonal: `row - column` (not `row + column`)
   - Anti-diagonal: `row + column` (not `row - column`)
   - Mixing these up will cause cells to be incorrectly identified as illuminated or not.

4. **Removing lamps before checking illumination**: The problem states: "After answering the ith query, turn off the lamp at grid[rowi][coli] and any lamps that are in adjacent cells." You must answer the query based on the current state of lamps, THEN turn off lamps. Doing it in reverse order is incorrect.

## When You'll See This Pattern

This problem uses **dimensional reduction** - converting a 2D problem into tracking counts along specific dimensions (rows, columns, diagonals). You'll see similar patterns in:

1. **N-Queens (LeetCode 51)**: Queens attack along rows, columns, and diagonals - exactly the same dimensions as lamp illumination! The difference is that N-Queens requires placing queens so they don't attack each other, while Grid Illumination tracks existing "attackers" (lamps).

2. **Valid Sudoku (LeetCode 36)**: Checking for duplicates in rows, columns, and 3x3 sub-boxes uses similar dimensional tracking with hash sets.

3. **Design Tic-Tac-Toe (LeetCode 348)**: Tracking moves along rows, columns, and diagonals to determine a winner uses the same dimensional counting approach.

The core pattern: When you need to track relationships in a grid where elements affect entire lines (rows, columns, diagonals), consider using hash maps to count along each dimension rather than checking individual cells.

## Key Takeaways

1. **Dimensional thinking**: When a problem involves relationships along rows, columns, or diagonals, consider tracking counts per dimension rather than checking individual pairs. This often turns O(n²) problems into O(n) solutions.

2. **Hash maps for constant-time lookups**: The combination of hash maps for counts and a hash set for existence checks enables O(1) operations for both illumination checking and lamp removal.

3. **Careful state management**: This problem requires maintaining multiple synchronized data structures. Changes to one (like removing a lamp) must be reflected in all related structures (row, column, diagonal, anti-diagonal counts).

Related problems: [N-Queens](/problem/n-queens)
