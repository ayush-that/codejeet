---
title: "How to Solve Strange Printer II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Strange Printer II. Hard difficulty, 60.7% acceptance rate. Topics: Array, Graph Theory, Topological Sort, Matrix."
date: "2030-02-08"
category: "dsa-patterns"
tags: ["strange-printer-ii", "array", "graph-theory", "topological-sort", "hard"]
---

# How to Solve Strange Printer II

This problem asks us to determine if a given target color grid can be produced by a printer that works in layers: each operation prints a solid rectangle of a single color, covering whatever was there before. The twist is that once a color is used, it can't be used again. What makes this tricky is that we need to reason backwards from the final grid to reconstruct a valid printing sequence, which involves identifying dependencies between colors.

## Visual Walkthrough

Let's walk through a small example to build intuition. Consider this 3×3 target grid:

```
[[1, 1, 2],
 [1, 1, 2],
 [3, 3, 2]]
```

We have colors 1, 2, and 3. Let's think backwards:

1. **Color 2** appears in the right column (positions (0,2), (1,2), (2,2)). It forms a rectangle covering the entire right column.

2. **Color 3** appears in the bottom-left 2×2 block (positions (2,0), (2,1)). But wait — position (2,2) has color 2, not 3. So color 3's rectangle must be exactly the bottom-left 2×1 rectangle.

3. **Color 1** appears in the remaining top-left 2×2 block.

Now let's think about dependencies:

- Color 1's rectangle is completely covered by other colors? No, it's in the top-left.
- Color 3's rectangle is in the bottom-left, partially overlapping where color 1 was.
- Color 2's rectangle covers the right column.

If we print in order 1 → 3 → 2:

- Print color 1 in top-left 2×2: `[[1,1,0],[1,1,0],[0,0,0]]`
- Print color 3 in bottom-left 2×1: `[[1,1,0],[1,1,0],[3,3,0]]`
- Print color 2 in right column: `[[1,1,2],[1,1,2],[3,3,2]]` ✓

The key insight: each color must form a solid rectangle in the final grid, and colors printed later can cover earlier ones. So when working backwards, a color can only be printed if all cells currently showing that color form a rectangle, and any other colors within that rectangle's bounds must be printed after it.

## Brute Force Approach

A naive approach might try to simulate all possible printing sequences. For k colors, we could try all k! permutations, checking if each sequence produces the target grid. For each permutation:

1. Start with an empty grid (all 0s)
2. For each color in sequence, find its rectangle bounds and fill them
3. Check if final grid matches target

The rectangle for a color would be the minimal bounding box containing all cells of that color in the target grid. We then check if every cell within that bounding box is either that color or a color that appears later in the sequence (which would cover it).

This brute force has O(k! × m × n) time complexity, which is astronomical for even moderate k. With up to 60 colors and 60×60 grid, this is completely infeasible.

## Optimized Approach

The key insight is that this is a **dependency graph** problem. For each color:

1. Find its bounding rectangle (min/max row and column)
2. Within that rectangle, if we find a different color, that color must be printed _after_ the current color (because it's covering part of the rectangle)

This creates a directed graph where edge A → B means "color A must be printed before color B". If this graph has a cycle, no valid sequence exists. If it's acyclic, we can find a topological ordering.

The algorithm:

1. Identify all colors present (1-60)
2. For each color, compute its bounding rectangle
3. Build a directed graph: for each color A, look at all cells in A's bounding rectangle. If a cell has color B ≠ A, add edge A → B (A before B)
4. Check if the graph has a cycle using DFS topological sort
5. If no cycle exists, return true

Why does this work? If color B appears inside color A's bounding rectangle, then when we print A's rectangle, it would cover B unless B is printed later. So B must come after A.

## Optimal Solution

<div class="code-group">

```python
# Time: O(k * m * n) where k = number of colors (max 60), m = rows, n = cols
# Space: O(k^2) for the graph
def isPrintable(self, targetGrid):
    """
    Determines if the target grid can be produced by the strange printer.

    The printer works by printing solid rectangles of a single color,
    with each color used exactly once. Later prints cover earlier ones.
    """
    m, n = len(targetGrid), len(targetGrid[0])

    # Step 1: Identify all colors and their bounding boxes
    # Colors are integers from 1 to 60
    colors = set()
    bounds = {}  # color -> (min_row, max_row, min_col, max_col)

    for i in range(m):
        for j in range(n):
            color = targetGrid[i][j]
            colors.add(color)
            if color not in bounds:
                # Initialize bounds for this color
                bounds[color] = [i, i, j, j]
            else:
                # Update bounds to include current cell
                bounds[color][0] = min(bounds[color][0], i)  # min_row
                bounds[color][1] = max(bounds[color][1], i)  # max_row
                bounds[color][2] = min(bounds[color][2], j)  # min_col
                bounds[color][3] = max(bounds[color][3], j)  # max_col

    # Step 2: Build dependency graph
    # graph[u] = set of colors that must come after color u
    graph = {color: set() for color in colors}

    for color in colors:
        min_r, max_r, min_c, max_c = bounds[color]

        # Check all cells within this color's bounding rectangle
        for i in range(min_r, max_r + 1):
            for j in range(min_c, max_c + 1):
                other_color = targetGrid[i][j]
                if other_color != color:
                    # other_color covers part of color's rectangle,
                    # so other_color must be printed after color
                    graph[color].add(other_color)

    # Step 3: Check for cycles using DFS topological sort
    # 0 = unvisited, 1 = visiting (in current DFS path), 2 = visited
    state = {color: 0 for color in colors}

    def has_cycle(color):
        """Returns True if there's a cycle reachable from this color."""
        if state[color] == 1:
            # Found a back edge - cycle detected
            return True
        if state[color] == 2:
            # Already fully processed, no cycle from here
            return False

        # Mark as visiting (in current DFS path)
        state[color] = 1

        # Check all neighbors
        for neighbor in graph[color]:
            if has_cycle(neighbor):
                return True

        # Mark as fully visited
        state[color] = 2
        return False

    # Check each color for cycles
    for color in colors:
        if state[color] == 0:
            if has_cycle(color):
                return False

    # No cycles found - a valid printing sequence exists
    return True
```

```javascript
// Time: O(k * m * n) where k = number of colors (max 60), m = rows, n = cols
// Space: O(k^2) for the graph
/**
 * Determines if the target grid can be produced by the strange printer.
 *
 * The printer works by printing solid rectangles of a single color,
 * with each color used exactly once. Later prints cover earlier ones.
 */
function isPrintable(targetGrid) {
  const m = targetGrid.length;
  const n = targetGrid[0].length;

  // Step 1: Identify all colors and their bounding boxes
  // Colors are integers from 1 to 60
  const colors = new Set();
  const bounds = new Map(); // color -> [min_row, max_row, min_col, max_col]

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      const color = targetGrid[i][j];
      colors.add(color);

      if (!bounds.has(color)) {
        // Initialize bounds for this color
        bounds.set(color, [i, i, j, j]);
      } else {
        // Update bounds to include current cell
        const [minR, maxR, minC, maxC] = bounds.get(color);
        bounds.set(color, [
          Math.min(minR, i),
          Math.max(maxR, i),
          Math.min(minC, j),
          Math.max(maxC, j),
        ]);
      }
    }
  }

  // Step 2: Build dependency graph
  // graph[u] = set of colors that must come after color u
  const graph = new Map();
  for (const color of colors) {
    graph.set(color, new Set());
  }

  for (const color of colors) {
    const [minR, maxR, minC, maxC] = bounds.get(color);

    // Check all cells within this color's bounding rectangle
    for (let i = minR; i <= maxR; i++) {
      for (let j = minC; j <= maxC; j++) {
        const otherColor = targetGrid[i][j];
        if (otherColor !== color) {
          // otherColor covers part of color's rectangle,
          // so otherColor must be printed after color
          graph.get(color).add(otherColor);
        }
      }
    }
  }

  // Step 3: Check for cycles using DFS topological sort
  // 0 = unvisited, 1 = visiting (in current DFS path), 2 = visited
  const state = new Map();
  for (const color of colors) {
    state.set(color, 0);
  }

  function hasCycle(color) {
    /** Returns true if there's a cycle reachable from this color. */
    if (state.get(color) === 1) {
      // Found a back edge - cycle detected
      return true;
    }
    if (state.get(color) === 2) {
      // Already fully processed, no cycle from here
      return false;
    }

    // Mark as visiting (in current DFS path)
    state.set(color, 1);

    // Check all neighbors
    for (const neighbor of graph.get(color)) {
      if (hasCycle(neighbor)) {
        return true;
      }
    }

    // Mark as fully visited
    state.set(color, 2);
    return false;
  }

  // Check each color for cycles
  for (const color of colors) {
    if (state.get(color) === 0) {
      if (hasCycle(color)) {
        return false;
      }
    }
  }

  // No cycles found - a valid printing sequence exists
  return true;
}
```

```java
// Time: O(k * m * n) where k = number of colors (max 60), m = rows, n = cols
// Space: O(k^2) for the graph
class Solution {
    /**
     * Determines if the target grid can be produced by the strange printer.
     *
     * The printer works by printing solid rectangles of a single color,
     * with each color used exactly once. Later prints cover earlier ones.
     */
    public boolean isPrintable(int[][] targetGrid) {
        int m = targetGrid.length;
        int n = targetGrid[0].length;

        // Step 1: Identify all colors and their bounding boxes
        // Colors are integers from 1 to 60
        Set<Integer> colors = new HashSet<>();
        Map<Integer, int[]> bounds = new HashMap<>(); // color -> {min_row, max_row, min_col, max_col}

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int color = targetGrid[i][j];
                colors.add(color);

                if (!bounds.containsKey(color)) {
                    // Initialize bounds for this color
                    bounds.put(color, new int[]{i, i, j, j});
                } else {
                    // Update bounds to include current cell
                    int[] b = bounds.get(color);
                    b[0] = Math.min(b[0], i); // min_row
                    b[1] = Math.max(b[1], i); // max_row
                    b[2] = Math.min(b[2], j); // min_col
                    b[3] = Math.max(b[3], j); // max_col
                }
            }
        }

        // Step 2: Build dependency graph
        // graph[u] = set of colors that must come after color u
        Map<Integer, Set<Integer>> graph = new HashMap<>();
        for (int color : colors) {
            graph.put(color, new HashSet<>());
        }

        for (int color : colors) {
            int[] b = bounds.get(color);
            int minR = b[0], maxR = b[1], minC = b[2], maxC = b[3];

            // Check all cells within this color's bounding rectangle
            for (int i = minR; i <= maxR; i++) {
                for (int j = minC; j <= maxC; j++) {
                    int otherColor = targetGrid[i][j];
                    if (otherColor != color) {
                        // otherColor covers part of color's rectangle,
                        // so otherColor must be printed after color
                        graph.get(color).add(otherColor);
                    }
                }
            }
        }

        // Step 3: Check for cycles using DFS topological sort
        // 0 = unvisited, 1 = visiting (in current DFS path), 2 = visited
        Map<Integer, Integer> state = new HashMap<>();
        for (int color : colors) {
            state.put(color, 0);
        }

        for (int color : colors) {
            if (state.get(color) == 0) {
                if (hasCycle(color, graph, state)) {
                    return false;
                }
            }
        }

        // No cycles found - a valid printing sequence exists
        return true;
    }

    private boolean hasCycle(int color, Map<Integer, Set<Integer>> graph, Map<Integer, Integer> state) {
        /** Returns true if there's a cycle reachable from this color. */
        if (state.get(color) == 1) {
            // Found a back edge - cycle detected
            return true;
        }
        if (state.get(color) == 2) {
            // Already fully processed, no cycle from here
            return false;
        }

        // Mark as visiting (in current DFS path)
        state.put(color, 1);

        // Check all neighbors
        for (int neighbor : graph.get(color)) {
            if (hasCycle(neighbor, graph, state)) {
                return true;
            }
        }

        // Mark as fully visited
        state.put(color, 2);
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(k × m × n) where:

- k is the number of distinct colors (at most 60)
- m is the number of rows
- n is the number of columns

We iterate through the grid once to find color bounds (O(m × n)). Then for each color, we examine all cells in its bounding rectangle. In the worst case, a color could cover the entire grid, so each color could take O(m × n) time, giving O(k × m × n). With k ≤ 60, this is efficient.

**Space Complexity:** O(k²) for the graph. Each color could have edges to all other colors, though in practice the graph is sparse. We also use O(k) for bounds and state tracking.

## Common Mistakes

1. **Not checking the entire bounding rectangle:** Some candidates only check the cells that actually contain the color, but we need to check _all_ cells within the bounding rectangle. If another color appears anywhere in that rectangle, it creates a dependency.

2. **Incorrect cycle detection:** Using BFS topological sort (Kahn's algorithm) without properly building the graph first. The DFS approach with three states (0=unvisited, 1=visiting, 2=visited) is more straightforward for this problem.

3. **Forgetting that colors are 1-60, not 0-59:** The problem states colors are positive integers. Some candidates create arrays of size 60 instead of 61, causing index errors.

4. **Assuming rectangles must be contiguous:** The color's cells don't need to form a contiguous block in the final grid—they just need to be contained within some rectangle that could have been printed. Other colors within that rectangle must be printed later.

## When You'll See This Pattern

This "dependency graph + topological sort" pattern appears in problems where you need to find a valid ordering subject to constraints:

1. **Course Schedule (LeetCode 207):** Courses have prerequisites, forming a directed graph. Check if you can take all courses (no cycles).

2. **Alien Dictionary (LeetCode 269):** Given sorted words in an alien language, deduce character ordering from adjacent word comparisons.

3. **Sequence Reconstruction (LeetCode 444):** Check if a sequence is the only valid topological order of a graph.

The key insight is recognizing when constraints translate to "A must come before B" relationships, which naturally form a directed graph. Cycle detection then tells you if a valid ordering exists.

## Key Takeaways

1. **When you see "A must happen before B" constraints, think directed graph + topological sort.** This pattern converts ordering problems into graph problems.

2. **Work backwards from the final state** when dealing with "layered" operations. The final result shows what's visible on top, which tells you what was printed last.

3. **Bounding boxes simplify rectangle problems.** Instead of checking all possible rectangles, compute the minimal containing rectangle for each color—if the printer used any rectangle for that color, it must have been at least this large.

Related problems: [Strange Printer](/problem/strange-printer), [Longest Cycle in a Graph](/problem/longest-cycle-in-a-graph), [Sort Array by Moving Items to Empty Space](/problem/sort-array-by-moving-items-to-empty-space)
