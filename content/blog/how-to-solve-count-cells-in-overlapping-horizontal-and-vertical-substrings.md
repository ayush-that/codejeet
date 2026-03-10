---
title: "How to Solve Count Cells in Overlapping Horizontal and Vertical Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Cells in Overlapping Horizontal and Vertical Substrings. Medium difficulty, 27.0% acceptance rate. Topics: Array, String, Rolling Hash, String Matching, Matrix."
date: "2026-07-14"
category: "dsa-patterns"
tags:
  [
    "count-cells-in-overlapping-horizontal-and-vertical-substrings",
    "array",
    "string",
    "rolling-hash",
    "medium",
  ]
---

# How to Solve Count Cells in Overlapping Horizontal and Vertical Substrings

This problem asks us to count how many cells in a character matrix are part of both a horizontal substring and a vertical substring that match a given pattern. The tricky part is that horizontal substrings can wrap across rows, and we need to efficiently find all occurrences of the pattern in both directions while tracking which cells are included in matches.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
grid = [['a', 'b', 'c'],
        ['d', 'e', 'f']]
pattern = "ab"
```

**Step 1: Find horizontal matches (with wrapping)**

- Starting at (0,0): Read "a" from (0,0), then "b" from (0,1) → "ab" matches pattern
- Starting at (0,1): Read "b" from (0,1), then "d" from (1,0) → "bd" doesn't match
- Starting at (0,2): Read "c" from (0,2), then "d" from (1,0) → "cd" doesn't match
- Starting at (1,0): Read "d" from (1,0), then "e" from (1,1) → "de" doesn't match
- Starting at (1,1): Read "e" from (1,1), then "f" from (1,2) → "ef" doesn't match
- Starting at (1,2): Read "f" from (1,2), then "a" from (0,0) → "fa" doesn't match

Horizontal matches: only the substring starting at (0,0)

**Step 2: Find vertical matches (no wrapping)**

- Starting at (0,0): Read "a" from (0,0), then "d" from (1,0) → "ad" doesn't match
- Starting at (0,1): Read "b" from (0,1), then "e" from (1,1) → "be" doesn't match
- Starting at (0,2): Read "c" from (0,2), then "f" from (1,2) → "cf" doesn't match

Vertical matches: none

**Step 3: Count overlapping cells**
Only cell (0,0) is in a horizontal match, but no vertical matches exist, so answer = 0

The key insight is that we need to efficiently find all pattern matches in both directions and track which cells are covered by these matches.

## Brute Force Approach

A naive solution would:

1. For each cell as starting point, check if horizontal substring matches pattern
2. For each cell as starting point, check if vertical substring matches pattern
3. Track which cells are in horizontal matches and vertical matches
4. Count cells that appear in both

The brute force approach has several inefficiencies:

- Checking each starting position independently means we're re-checking overlapping substrings
- For each starting position, we need to read k characters (where k = pattern length)
- This results in O(m × n × k) time complexity, which is too slow for larger grids

Here's what the brute force might look like:

<div class="code-group">

```python
def countOverlappingCells(grid, pattern):
    m, n = len(grid), len(grid[0])
    k = len(pattern)

    # Track cells in horizontal and vertical matches
    horizontal = [[False] * n for _ in range(m)]
    vertical = [[False] * n for _ in range(m)]

    # Check horizontal matches (with wrapping)
    for i in range(m):
        for j in range(n):
            match = True
            for p in range(k):
                # Calculate position with wrapping
                row = (i + (j + p) // n) % m
                col = (j + p) % n
                if grid[row][col] != pattern[p]:
                    match = False
                    break
            if match:
                # Mark all cells in this match
                for p in range(k):
                    row = (i + (j + p) // n) % m
                    col = (j + p) % n
                    horizontal[row][col] = True

    # Check vertical matches (no wrapping)
    for i in range(m - k + 1):
        for j in range(n):
            match = True
            for p in range(k):
                if grid[i + p][j] != pattern[p]:
                    match = False
                    break
            if match:
                # Mark all cells in this match
                for p in range(k):
                    vertical[i + p][j] = True

    # Count overlapping cells
    count = 0
    for i in range(m):
        for j in range(n):
            if horizontal[i][j] and vertical[i][j]:
                count += 1

    return count
```

```javascript
function countOverlappingCells(grid, pattern) {
  const m = grid.length,
    n = grid[0].length;
  const k = pattern.length;

  // Track cells in horizontal and vertical matches
  const horizontal = Array(m)
    .fill()
    .map(() => Array(n).fill(false));
  const vertical = Array(m)
    .fill()
    .map(() => Array(n).fill(false));

  // Check horizontal matches (with wrapping)
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let match = true;
      for (let p = 0; p < k; p++) {
        // Calculate position with wrapping
        const row = (i + Math.floor((j + p) / n)) % m;
        const col = (j + p) % n;
        if (grid[row][col] !== pattern[p]) {
          match = false;
          break;
        }
      }
      if (match) {
        // Mark all cells in this match
        for (let p = 0; p < k; p++) {
          const row = (i + Math.floor((j + p) / n)) % m;
          const col = (j + p) % n;
          horizontal[row][col] = true;
        }
      }
    }
  }

  // Check vertical matches (no wrapping)
  for (let i = 0; i <= m - k; i++) {
    for (let j = 0; j < n; j++) {
      let match = true;
      for (let p = 0; p < k; p++) {
        if (grid[i + p][j] !== pattern[p]) {
          match = false;
          break;
        }
      }
      if (match) {
        // Mark all cells in this match
        for (let p = 0; p < k; p++) {
          vertical[i + p][j] = true;
        }
      }
    }
  }

  // Count overlapping cells
  let count = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (horizontal[i][j] && vertical[i][j]) {
        count++;
      }
    }
  }

  return count;
}
```

```java
public int countOverlappingCells(char[][] grid, String pattern) {
    int m = grid.length, n = grid[0].length;
    int k = pattern.length();

    // Track cells in horizontal and vertical matches
    boolean[][] horizontal = new boolean[m][n];
    boolean[][] vertical = new boolean[m][n];

    // Check horizontal matches (with wrapping)
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            boolean match = true;
            for (int p = 0; p < k; p++) {
                // Calculate position with wrapping
                int row = (i + (j + p) / n) % m;
                int col = (j + p) % n;
                if (grid[row][col] != pattern.charAt(p)) {
                    match = false;
                    break;
                }
            }
            if (match) {
                // Mark all cells in this match
                for (int p = 0; p < k; p++) {
                    int row = (i + (j + p) / n) % m;
                    int col = (j + p) % n;
                    horizontal[row][col] = true;
                }
            }
        }
    }

    // Check vertical matches (no wrapping)
    for (int i = 0; i <= m - k; i++) {
        for (int j = 0; j < n; j++) {
            boolean match = true;
            for (int p = 0; p < k; p++) {
                if (grid[i + p][j] != pattern.charAt(p)) {
                    match = false;
                    break;
                }
            }
            if (match) {
                // Mark all cells in this match
                for (int p = 0; p < k; p++) {
                    vertical[i + p][j] = true;
                }
            }
        }
    }

    // Count overlapping cells
    int count = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (horizontal[i][j] && vertical[i][j]) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

This brute force has O(m × n × k) time complexity, which is too slow when k is large.

## Optimized Approach

The key insight is that we can use string matching algorithms to find pattern occurrences more efficiently:

1. **Flatten the grid for horizontal matching**: Since horizontal substrings wrap across rows, we can treat the grid as a 1D string by concatenating rows. A horizontal substring starting at position (i,j) corresponds to a substring in this flattened string starting at index `i*n + j` with length k.

2. **Use KMP or rolling hash for pattern matching**: Instead of checking each starting position independently, we can use efficient string matching algorithms:
   - **KMP (Knuth-Morris-Pratt)**: O(m×n + k) time to find all occurrences
   - **Rolling hash (Rabin-Karp)**: O(m×n + k) average time, O(m×n × k) worst case but rare with good hash

3. **Handle vertical matching similarly**: For vertical matches, we can process each column separately as a string and find pattern occurrences.

4. **Track cell coverage efficiently**: Instead of marking each cell in every match, we can use prefix sums or difference arrays to mark ranges of cells covered by matches.

## Optimal Solution

Here's the optimal solution using KMP for pattern matching:

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m × n)
def countOverlappingCells(grid, pattern):
    m, n = len(grid), len(grid[0])
    k = len(pattern)

    if k == 0:
        return m * n  # Empty pattern matches everywhere

    # Build KMP failure function for pattern
    def build_kmp(pattern):
        lps = [0] * len(pattern)
        length = 0
        i = 1
        while i < len(pattern):
            if pattern[i] == pattern[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                if length != 0:
                    length = lps[length - 1]
                else:
                    lps[i] = 0
                    i += 1
        return lps

    lps = build_kmp(pattern)

    # Helper function to find all pattern occurrences using KMP
    def kmp_search(text, pattern, lps):
        matches = []
        i = j = 0
        while i < len(text):
            if pattern[j] == text[i]:
                i += 1
                j += 1

            if j == len(pattern):
                matches.append(i - j)  # Start index of match
                j = lps[j - 1]
            elif i < len(text) and pattern[j] != text[i]:
                if j != 0:
                    j = lps[j - 1]
                else:
                    i += 1
        return matches

    # Track horizontal coverage using difference array
    horizontal = [[0] * (n + 1) for _ in range(m)]

    # Flatten grid for horizontal search (with wrapping)
    flattened = []
    for i in range(m):
        flattened.extend(grid[i])

    # Since horizontal substrings wrap, we need to consider the flattened string twice
    # to handle matches that cross the end
    extended_flattened = flattened + flattened[:k-1]

    # Find all horizontal matches in extended string
    matches = kmp_search(extended_flattened, pattern, lps)

    # Mark horizontal coverage
    for start in matches:
        if start < m * n:  # Only consider matches starting in original grid
            # Convert start index back to grid coordinates
            for p in range(k):
                pos = start + p
                row = pos // n
                col = pos % n
                if row < m:  # Only mark if within original grid bounds
                    horizontal[row][col] += 1
                    horizontal[row][col + 1] -= 1  # Difference array technique

    # Convert difference array to actual counts
    for i in range(m):
        current = 0
        for j in range(n):
            current += horizontal[i][j]
            horizontal[i][j] = current

    # Track vertical coverage
    vertical = [[0] * n for _ in range(m)]

    # Process each column separately
    for col in range(n):
        # Extract column as string
        column_text = ''.join(grid[row][col] for row in range(m))

        # Find pattern matches in column
        matches = kmp_search(column_text, pattern, lps)

        # Mark vertical coverage
        for start in matches:
            for p in range(k):
                vertical[start + p][col] = 1

    # Count overlapping cells
    count = 0
    for i in range(m):
        for j in range(n):
            if horizontal[i][j] > 0 and vertical[i][j] > 0:
                count += 1

    return count
```

```javascript
// Time: O(m × n) | Space: O(m × n)
function countOverlappingCells(grid, pattern) {
  const m = grid.length,
    n = grid[0].length;
  const k = pattern.length;

  if (k === 0) return m * n; // Empty pattern matches everywhere

  // Build KMP failure function for pattern
  function buildKMP(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let length = 0;
    let i = 1;

    while (i < pattern.length) {
      if (pattern[i] === pattern[length]) {
        length++;
        lps[i] = length;
        i++;
      } else {
        if (length !== 0) {
          length = lps[length - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    return lps;
  }

  const lps = buildKMP(pattern);

  // Helper function to find all pattern occurrences using KMP
  function kmpSearch(text, pattern, lps) {
    const matches = [];
    let i = 0,
      j = 0;

    while (i < text.length) {
      if (pattern[j] === text[i]) {
        i++;
        j++;
      }

      if (j === pattern.length) {
        matches.push(i - j); // Start index of match
        j = lps[j - 1];
      } else if (i < text.length && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++;
        }
      }
    }
    return matches;
  }

  // Track horizontal coverage using difference array
  const horizontal = Array(m)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Flatten grid for horizontal search (with wrapping)
  const flattened = [];
  for (let i = 0; i < m; i++) {
    flattened.push(...grid[i]);
  }

  // Since horizontal substrings wrap, extend to handle matches crossing end
  const extendedFlattened = flattened.concat(flattened.slice(0, k - 1));

  // Find all horizontal matches
  const hMatches = kmpSearch(extendedFlattened, pattern, lps);

  // Mark horizontal coverage
  for (const start of hMatches) {
    if (start < m * n) {
      // Only consider matches starting in original grid
      for (let p = 0; p < k; p++) {
        const pos = start + p;
        const row = Math.floor(pos / n);
        const col = pos % n;
        if (row < m) {
          // Only mark if within original grid bounds
          horizontal[row][col]++;
          horizontal[row][col + 1]--; // Difference array technique
        }
      }
    }
  }

  // Convert difference array to actual counts
  for (let i = 0; i < m; i++) {
    let current = 0;
    for (let j = 0; j < n; j++) {
      current += horizontal[i][j];
      horizontal[i][j] = current;
    }
  }

  // Track vertical coverage
  const vertical = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // Process each column separately
  for (let col = 0; col < n; col++) {
    // Extract column as string
    const columnText = Array(m)
      .fill()
      .map((_, row) => grid[row][col])
      .join("");

    // Find pattern matches in column
    const vMatches = kmpSearch(columnText, pattern, lps);

    // Mark vertical coverage
    for (const start of vMatches) {
      for (let p = 0; p < k; p++) {
        vertical[start + p][col] = 1;
      }
    }
  }

  // Count overlapping cells
  let count = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (horizontal[i][j] > 0 && vertical[i][j] > 0) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(m × n) | Space: O(m × n)
public int countOverlappingCells(char[][] grid, String pattern) {
    int m = grid.length, n = grid[0].length;
    int k = pattern.length();

    if (k == 0) return m * n;  // Empty pattern matches everywhere

    // Build KMP failure function for pattern
    int[] lps = buildKMP(pattern);

    // Track horizontal coverage using difference array
    int[][] horizontal = new int[m][n + 1];

    // Flatten grid for horizontal search (with wrapping)
    StringBuilder flattened = new StringBuilder();
    for (int i = 0; i < m; i++) {
        flattened.append(grid[i]);
    }

    // Since horizontal substrings wrap, extend to handle matches crossing end
    StringBuilder extended = new StringBuilder(flattened);
    extended.append(flattened.substring(0, Math.min(k - 1, flattened.length())));

    // Find all horizontal matches
    List<Integer> hMatches = kmpSearch(extended.toString(), pattern, lps);

    // Mark horizontal coverage
    for (int start : hMatches) {
        if (start < m * n) {  // Only consider matches starting in original grid
            for (int p = 0; p < k; p++) {
                int pos = start + p;
                int row = pos / n;
                int col = pos % n;
                if (row < m) {  // Only mark if within original grid bounds
                    horizontal[row][col]++;
                    horizontal[row][col + 1]--;  // Difference array technique
                }
            }
        }
    }

    // Convert difference array to actual counts
    for (int i = 0; i < m; i++) {
        int current = 0;
        for (int j = 0; j < n; j++) {
            current += horizontal[i][j];
            horizontal[i][j] = current;
        }
    }

    // Track vertical coverage
    int[][] vertical = new int[m][n];

    // Process each column separately
    for (int col = 0; col < n; col++) {
        // Extract column as string
        StringBuilder columnText = new StringBuilder();
        for (int row = 0; row < m; row++) {
            columnText.append(grid[row][col]);
        }

        // Find pattern matches in column
        List<Integer> vMatches = kmpSearch(columnText.toString(), pattern, lps);

        // Mark vertical coverage
        for (int start : vMatches) {
            for (int p = 0; p < k; p++) {
                vertical[start + p][col] = 1;
            }
        }
    }

    // Count overlapping cells
    int count = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (horizontal[i][j] > 0 && vertical[i][j] > 0) {
                count++;
            }
        }
    }

    return count;
}

// Helper method to build KMP failure function
private int[] buildKMP(String pattern) {
    int[] lps = new int[pattern.length()];
    int length = 0;
    int i = 1;

    while (i < pattern.length()) {
        if (pattern.charAt(i) == pattern.charAt(length)) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length != 0) {
                length = lps[length - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

// Helper method for KMP search
private List<Integer> kmpSearch(String text, String pattern, int[] lps) {
    List<Integer> matches = new ArrayList<>();
    int i = 0, j = 0;

    while (i < text.length()) {
        if (pattern.charAt(j) == text.charAt(i)) {
            i++;
            j++;
        }

        if (j == pattern.length()) {
            matches.add(i - j);  // Start index of match
            j = lps[j - 1];
        } else if (i < text.length() && pattern.charAt(j) != text.charAt(i)) {
            if (j != 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    return matches;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n)**

- Building KMP failure function: O(k)
- Horizontal search: O(2×m×n) = O(m×n) (we search extended string of length ~2×m×n)
- Vertical search: O(m×n) (n columns each of length m)
- Marking coverage: O(m×n) for each direction
- Counting overlaps: O(m×n)
- Total: O(m×n + k) which simplifies to O(m×n) since k ≤ m×n

**Space Complexity: O(m × n)**

- KMP failure function: O(k)
- Horizontal/vertical coverage arrays: O(m×n) each
- Flattened string: O(m×n)
- Total: O(m×n)

## Common Mistakes

1. **Forgetting about wrapping in horizontal matches**: The problem states that horizontal substrings wrap to the next row when reaching the end of a row. Many candidates only check within the same row.

2. **Not handling empty pattern**: If pattern length is 0, every cell is trivially part of both horizontal and vertical matches, so answer should be m×n.

3. **Inefficient marking of covered cells**: Marking each cell individually for every match leads to O(m×n×k) time. Using difference arrays or prefix sums reduces this to O(m×n).

4. **Off-by-one errors in vertical bounds**: For vertical matches, the starting row must satisfy `i ≤ m - k` since we need k consecutive rows. Starting at row `m - k + 1` would go out of bounds.

## When You'll See This Pattern

This problem combines several important patterns:

1. **String matching in 2D grids**: Similar to "Word Search" (LeetCode 79) but with wrapping and requiring efficient pattern matching algorithms.

2. **KMP/Rolling Hash applications**: Problems like "Repeated Substring Pattern" (LeetCode 459) and "Find the Index of the First Occurrence in a String" (LeetCode 28) teach the KMP algorithm which is essential here.

3. **Difference array technique**: Used in problems like "Range Addition" (LeetCode 370) to efficiently mark ranges. Here we use it to mark cells covered by horizontal matches.

4. **Matrix traversal with coordinate transformation**: Similar to problems that require treating 2D arrays as 1D, like "Spiral Matrix" (LeetCode 54).

## Key Takeaways

1. **When you need to find pattern matches in a grid, consider flattening it**: Treating the grid as a 1D string allows you to apply efficient string matching algorithms like KMP or rolling hash.

2. **Use difference arrays for range marking**: When you need to mark that a range of positions satisfies some condition, difference arrays provide O(1) marking and O(n) reconstruction.

3. **KMP is your friend for pattern matching**: The KMP algorithm provides O(n + m) pattern matching and is essential knowledge for coding interviews. Practice implementing it from memory.

4. **Always check edge cases**: Empty patterns, single-row/single-column grids, and patterns longer than grid dimensions all need special handling.

[Practice this problem on CodeJeet](/problem/count-cells-in-overlapping-horizontal-and-vertical-substrings)
