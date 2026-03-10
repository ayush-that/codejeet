---
title: "How to Solve Design Spreadsheet — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Spreadsheet. Medium difficulty, 74.3% acceptance rate. Topics: Array, Hash Table, String, Design, Matrix."
date: "2027-02-20"
category: "dsa-patterns"
tags: ["design-spreadsheet", "array", "hash-table", "string", "medium"]
---

# How to Solve Design Spreadsheet

Designing a spreadsheet system requires managing a grid of cells where each cell can hold either a direct integer value or a formula that sums other cells. The challenge lies in efficiently handling both direct assignments and formula evaluations while ensuring formulas correctly update when referenced cells change. This problem tests your ability to design data structures that support multiple operations efficiently.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose we create a spreadsheet with 3 rows:

```
Spreadsheet sheet = new Spreadsheet(3);
```

The spreadsheet has 3 rows (1-indexed) and columns A-Z. Now let's perform some operations:

1. **Set a direct value:**

   ```
   sheet.set("A1", 5);
   ```

   Cell A1 now contains the integer 5.

2. **Set another direct value:**

   ```
   sheet.set("B1", 3);
   ```

   Cell B1 now contains 3.

3. **Set a formula:**

   ```
   sheet.set("C1", "=A1+B1");
   ```

   Cell C1 contains a formula that sums A1 and B1. When we get C1, it should return 8 (5 + 3).

4. **Get the formula result:**

   ```
   sheet.get("C1");  // Returns 8
   ```

5. **Update a referenced cell:**

   ```
   sheet.set("A1", 10);
   ```

   Now A1 changes to 10. C1's formula should now evaluate to 13 (10 + 3).

6. **Get the updated result:**
   ```
   sheet.get("C1");  // Returns 13
   ```

The tricky part is that when we update A1, we need to know that C1 depends on A1 so we can update C1's cached value. But what if C1 itself is referenced by other cells? We need to handle dependency chains.

## Brute Force Approach

A naive approach would be to store each cell's value or formula in a 2D array. For `get()` operations:

- If the cell contains a direct value, return it
- If it contains a formula, parse it and recursively compute the sum by looking up each referenced cell

The problem with this approach is **performance**. Every `get()` operation on a formula cell requires:

1. Parsing the formula string
2. Looking up each referenced cell
3. If those cells contain formulas, recursively evaluating them

This becomes inefficient when:

- Formulas reference other formulas (creating dependency chains)
- We call `get()` frequently on formula cells
- The spreadsheet is large

Worse, if there are circular dependencies (A1 references B1, B1 references A1), the naive recursive approach would enter an infinite loop.

## Optimized Approach

The key insight is that we need to:

1. **Cache computed values** for formula cells to avoid repeated parsing and evaluation
2. **Track dependencies** so when a cell changes, we can invalidate all cells that depend on it
3. **Detect circular dependencies** to prevent infinite loops

Here's the step-by-step reasoning:

1. **Data Structure Design:**
   - Store cell contents in a 2D array or hash map
   - Each cell can be: a direct integer, a formula string, or a special marker for "needs recomputation"
   - Maintain a dependency graph: for each cell, track which cells depend on it

2. **Formula Parsing:**
   - Formulas start with "=" and contain cell references separated by "+"
   - Parse by splitting on "+" and extracting cell coordinates
   - Convert column letters to indices (A=0, B=1, ..., Z=25)

3. **Dependency Management:**
   - When setting a formula, clear old dependencies and establish new ones
   - When a cell changes, mark all dependent cells as "needs recomputation"
   - Use topological ordering or DFS to detect circular dependencies

4. **Lazy Evaluation:**
   - Don't compute formula values immediately when setting
   - Compute only when `get()` is called, and cache the result
   - If a cell is marked "needs recomputation", recompute it during the next `get()`

5. **Circular Dependency Detection:**
   - During formula evaluation, track visited cells in the current computation path
   - If we encounter a cell already in the current path, we have a cycle

## Optimal Solution

<div class="code-group">

```python
# Time:
#   - set(): O(k + d) where k is formula length, d is number of dependents
#   - get(): O(k) where k is formula length (worst case with no cache)
# Space: O(r * c + e) where r=rows, c=26, e=edges in dependency graph
class Spreadsheet:
    def __init__(self, rows: int):
        # Initialize grid with None values
        self.rows = rows
        self.cols = 26  # A-Z
        # grid[row][col] stores either:
        # - an integer (direct value)
        # - a string (formula starting with "=")
        # - None (empty cell)
        self.grid = [[None for _ in range(self.cols)] for _ in range(rows)]

        # dependency graph: cell -> set of cells that depend on it
        # We'll use (row, col) tuples as keys
        self.dependencies = {}

        # cache for computed formula values to avoid repeated computation
        self.cache = {}

    def _parse_cell(self, cell: str):
        """Convert cell reference like 'A1' to (row, col) indices (0-based)."""
        # Column is the letter part, row is the number part
        col = ord(cell[0]) - ord('A')  # A=0, B=1, ..., Z=25
        row = int(cell[1:]) - 1  # Convert to 0-based index
        return row, col

    def _get_cell_value(self, row: int, col: int, visited: set):
        """
        Get value of cell at (row, col), handling formulas recursively.
        visited set tracks cells in current evaluation path to detect cycles.
        """
        # Check for circular dependency
        if (row, col) in visited:
            raise ValueError("Circular dependency detected")

        # Check cache first
        if (row, col) in self.cache:
            return self.cache[(row, col)]

        cell_content = self.grid[row][col]

        # If cell is empty or contains direct integer
        if cell_content is None or isinstance(cell_content, int):
            value = cell_content if cell_content is not None else 0
            self.cache[(row, col)] = value
            return value

        # If cell contains a formula
        if isinstance(cell_content, str) and cell_content.startswith('='):
            # Parse formula: remove '=' and split by '+'
            formula = cell_content[1:]
            cell_refs = formula.split('+')

            # Compute sum of referenced cells
            total = 0
            visited.add((row, col))  # Add current cell to path

            for ref in cell_refs:
                ref_row, ref_col = self._parse_cell(ref.strip())
                total += self._get_cell_value(ref_row, ref_col, visited)

            visited.remove((row, col))  # Remove from path
            self.cache[(row, col)] = total
            return total

        # Should not reach here
        return 0

    def _invalidate_dependents(self, row: int, col: int):
        """Remove from cache all cells that depend on (row, col)."""
        cell_key = (row, col)
        if cell_key in self.dependencies:
            for dependent in self.dependencies[cell_key]:
                # Remove from cache
                if dependent in self.cache:
                    del self.cache[dependent]
                # Recursively invalidate cells that depend on this one
                self._invalidate_dependents(dependent[0], dependent[1])

    def set(self, cell: str, value: str) -> None:
        """Set cell to either a direct value or a formula."""
        row, col = self._parse_cell(cell)

        # Clear old dependencies for this cell
        # First, find all cells that this cell currently depends on
        old_deps = set()
        if isinstance(self.grid[row][col], str) and self.grid[row][col].startswith('='):
            formula = self.grid[row][col][1:]
            for ref in formula.split('+'):
                ref_row, ref_col = self._parse_cell(ref.strip())
                old_deps.add((ref_row, ref_col))

        # Remove this cell from the dependency lists of its old dependencies
        for dep in old_deps:
            if dep in self.dependencies:
                self.dependencies[dep].discard((row, col))

        # Update cell content
        if value.startswith('='):
            # It's a formula
            self.grid[row][col] = value

            # Parse new dependencies
            formula = value[1:]
            cell_refs = formula.split('+')
            new_deps = set()

            for ref in cell_refs:
                ref_row, ref_col = self._parse_cell(ref.strip())
                new_deps.add((ref_row, ref_col))

                # Add this cell as dependent of the referenced cell
                if (ref_row, ref_col) not in self.dependencies:
                    self.dependencies[(ref_row, ref_col)] = set()
                self.dependencies[(ref_row, ref_col)].add((row, col))

            # Invalidate cache for this cell and its dependents
            if (row, col) in self.cache:
                del self.cache[(row, col)]
            self._invalidate_dependents(row, col)

        else:
            # It's a direct integer value
            self.grid[row][col] = int(value)

            # Invalidate cache for this cell and its dependents
            if (row, col) in self.cache:
                del self.cache[(row, col)]
            self._invalidate_dependents(row, col)

    def get(self, cell: str) -> int:
        """Get value of cell, computing formulas if needed."""
        row, col = self._parse_cell(cell)

        # Use DFS with visited set to detect cycles
        try:
            visited = set()
            return self._get_cell_value(row, col, visited)
        except ValueError as e:
            # Circular dependency found
            return -1
```

```javascript
// Time:
//   - set(): O(k + d) where k is formula length, d is number of dependents
//   - get(): O(k) where k is formula length (worst case with no cache)
// Space: O(r * c + e) where r=rows, c=26, e=edges in dependency graph
class Spreadsheet {
  constructor(rows) {
    this.rows = rows;
    this.cols = 26; // A-Z

    // Initialize grid with null values
    this.grid = Array(rows);
    for (let i = 0; i < rows; i++) {
      this.grid[i] = Array(this.cols).fill(null);
    }

    // dependency graph: cell -> set of cells that depend on it
    // Use string keys like "0,0" for (row, col)
    this.dependencies = new Map();

    // cache for computed formula values
    this.cache = new Map();
  }

  _parseCell(cell) {
    // Convert cell reference like 'A1' to [row, col] indices (0-based)
    const col = cell.charCodeAt(0) - "A".charCodeAt(0); // A=0, B=1, ..., Z=25
    const row = parseInt(cell.substring(1)) - 1; // Convert to 0-based
    return [row, col];
  }

  _getCellKey(row, col) {
    // Convert (row, col) to string key for Map
    return `${row},${col}`;
  }

  _getCellValue(row, col, visited) {
    // Get value of cell at (row, col), handling formulas recursively
    const cellKey = this._getCellKey(row, col);

    // Check for circular dependency
    if (visited.has(cellKey)) {
      throw new Error("Circular dependency detected");
    }

    // Check cache first
    if (this.cache.has(cellKey)) {
      return this.cache.get(cellKey);
    }

    const cellContent = this.grid[row][col];

    // If cell is empty or contains direct number
    if (cellContent === null || typeof cellContent === "number") {
      const value = cellContent !== null ? cellContent : 0;
      this.cache.set(cellKey, value);
      return value;
    }

    // If cell contains a formula
    if (typeof cellContent === "string" && cellContent.startsWith("=")) {
      // Parse formula: remove '=' and split by '+'
      const formula = cellContent.substring(1);
      const cellRefs = formula.split("+");

      // Compute sum of referenced cells
      let total = 0;
      visited.add(cellKey); // Add current cell to path

      for (const ref of cellRefs) {
        const [refRow, refCol] = this._parseCell(ref.trim());
        total += this._getCellValue(refRow, refCol, visited);
      }

      visited.delete(cellKey); // Remove from path
      this.cache.set(cellKey, total);
      return total;
    }

    // Should not reach here
    return 0;
  }

  _invalidateDependents(row, col) {
    // Remove from cache all cells that depend on (row, col)
    const cellKey = this._getCellKey(row, col);

    if (this.dependencies.has(cellKey)) {
      const dependents = this.dependencies.get(cellKey);
      for (const dependent of dependents) {
        // Remove from cache
        if (this.cache.has(dependent)) {
          this.cache.delete(dependent);
        }

        // Recursively invalidate cells that depend on this one
        const [depRow, depCol] = dependent.split(",").map(Number);
        this._invalidateDependents(depRow, depCol);
      }
    }
  }

  set(cell, value) {
    const [row, col] = this._parseCell(cell);
    const cellKey = this._getCellKey(row, col);

    // Clear old dependencies for this cell
    const oldContent = this.grid[row][col];
    if (typeof oldContent === "string" && oldContent.startsWith("=")) {
      const formula = oldContent.substring(1);
      const cellRefs = formula.split("+");

      for (const ref of cellRefs) {
        const [refRow, refCol] = this._parseCell(ref.trim());
        const refKey = this._getCellKey(refRow, refCol);

        if (this.dependencies.has(refKey)) {
          this.dependencies.get(refKey).delete(cellKey);
        }
      }
    }

    // Update cell content
    if (value.startsWith("=")) {
      // It's a formula
      this.grid[row][col] = value;

      // Parse new dependencies
      const formula = value.substring(1);
      const cellRefs = formula.split("+");

      for (const ref of cellRefs) {
        const [refRow, refCol] = this._parseCell(ref.trim());
        const refKey = this._getCellKey(refRow, refCol);

        // Add this cell as dependent of the referenced cell
        if (!this.dependencies.has(refKey)) {
          this.dependencies.set(refKey, new Set());
        }
        this.dependencies.get(refKey).add(cellKey);
      }

      // Invalidate cache for this cell and its dependents
      this.cache.delete(cellKey);
      this._invalidateDependents(row, col);
    } else {
      // It's a direct integer value
      this.grid[row][col] = parseInt(value, 10);

      // Invalidate cache for this cell and its dependents
      this.cache.delete(cellKey);
      this._invalidateDependents(row, col);
    }
  }

  get(cell) {
    const [row, col] = this._parseCell(cell);

    // Use DFS with visited set to detect cycles
    try {
      const visited = new Set();
      return this._getCellValue(row, col, visited);
    } catch (e) {
      // Circular dependency found
      return -1;
    }
  }
}
```

```java
// Time:
//   - set(): O(k + d) where k is formula length, d is number of dependents
//   - get(): O(k) where k is formula length (worst case with no cache)
// Space: O(r * c + e) where r=rows, c=26, e=edges in dependency graph
import java.util.*;

class Spreadsheet {
    private int rows;
    private int cols = 26; // A-Z
    private Object[][] grid; // Can store Integer, String, or null
    private Map<String, Set<String>> dependencies; // cellKey -> dependent cells
    private Map<String, Integer> cache; // cellKey -> computed value

    public Spreadsheet(int rows) {
        this.rows = rows;
        this.grid = new Object[rows][cols];
        this.dependencies = new HashMap<>();
        this.cache = new HashMap<>();
    }

    private int[] parseCell(String cell) {
        // Convert cell reference like "A1" to {row, col} indices (0-based)
        int col = cell.charAt(0) - 'A'; // A=0, B=1, ..., Z=25
        int row = Integer.parseInt(cell.substring(1)) - 1; // Convert to 0-based
        return new int[]{row, col};
    }

    private String getCellKey(int row, int col) {
        // Convert (row, col) to string key for Map
        return row + "," + col;
    }

    private int getCellValue(int row, int col, Set<String> visited) {
        // Get value of cell at (row, col), handling formulas recursively
        String cellKey = getCellKey(row, col);

        // Check for circular dependency
        if (visited.contains(cellKey)) {
            throw new RuntimeException("Circular dependency detected");
        }

        // Check cache first
        if (cache.containsKey(cellKey)) {
            return cache.get(cellKey);
        }

        Object cellContent = grid[row][col];

        // If cell is empty or contains direct integer
        if (cellContent == null || cellContent instanceof Integer) {
            int value = (cellContent != null) ? (Integer) cellContent : 0;
            cache.put(cellKey, value);
            return value;
        }

        // If cell contains a formula
        if (cellContent instanceof String) {
            String formula = (String) cellContent;
            if (formula.startsWith("=")) {
                // Parse formula: remove '=' and split by '+'
                formula = formula.substring(1);
                String[] cellRefs = formula.split("\\+");

                // Compute sum of referenced cells
                int total = 0;
                visited.add(cellKey); // Add current cell to path

                for (String ref : cellRefs) {
                    ref = ref.trim();
                    int[] refCoords = parseCell(ref);
                    total += getCellValue(refCoords[0], refCoords[1], visited);
                }

                visited.remove(cellKey); // Remove from path
                cache.put(cellKey, total);
                return total;
            }
        }

        // Should not reach here
        return 0;
    }

    private void invalidateDependents(int row, int col) {
        // Remove from cache all cells that depend on (row, col)
        String cellKey = getCellKey(row, col);

        if (dependencies.containsKey(cellKey)) {
            Set<String> dependents = dependencies.get(cellKey);
            for (String dependent : dependents) {
                // Remove from cache
                cache.remove(dependent);

                // Recursively invalidate cells that depend on this one
                String[] parts = dependent.split(",");
                int depRow = Integer.parseInt(parts[0]);
                int depCol = Integer.parseInt(parts[1]);
                invalidateDependents(depRow, depCol);
            }
        }
    }

    public void set(String cell, String value) {
        int[] coords = parseCell(cell);
        int row = coords[0];
        int col = coords[1];
        String cellKey = getCellKey(row, col);

        // Clear old dependencies for this cell
        Object oldContent = grid[row][col];
        if (oldContent instanceof String) {
            String oldFormula = (String) oldContent;
            if (oldFormula.startsWith("=")) {
                String formula = oldFormula.substring(1);
                String[] cellRefs = formula.split("\\+");

                for (String ref : cellRefs) {
                    ref = ref.trim();
                    int[] refCoords = parseCell(ref);
                    String refKey = getCellKey(refCoords[0], refCoords[1]);

                    if (dependencies.containsKey(refKey)) {
                        dependencies.get(refKey).remove(cellKey);
                    }
                }
            }
        }

        // Update cell content
        if (value.startsWith("=")) {
            // It's a formula
            grid[row][col] = value;

            // Parse new dependencies
            String formula = value.substring(1);
            String[] cellRefs = formula.split("\\+");

            for (String ref : cellRefs) {
                ref = ref.trim();
                int[] refCoords = parseCell(ref);
                String refKey = getCellKey(refCoords[0], refCoords[1]);

                // Add this cell as dependent of the referenced cell
                dependencies.putIfAbsent(refKey, new HashSet<>());
                dependencies.get(refKey).add(cellKey);
            }

            // Invalidate cache for this cell and its dependents
            cache.remove(cellKey);
            invalidateDependents(row, col);

        } else {
            // It's a direct integer value
            grid[row][col] = Integer.parseInt(value);

            // Invalidate cache for this cell and its dependents
            cache.remove(cellKey);
            invalidateDependents(row, col);
        }
    }

    public int get(String cell) {
        int[] coords = parseCell(cell);
        int row = coords[0];
        int col = coords[1];

        // Use DFS with visited set to detect cycles
        try {
            Set<String> visited = new HashSet<>();
            return getCellValue(row, col, visited);
        } catch (RuntimeException e) {
            // Circular dependency found
            return -1;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `set()` operation: O(k + d) where:
  - k is the length of the formula (number of referenced cells)
  - d is the number of cells that depend on the cell being set
  - We need to parse the formula (O(k)) and invalidate all dependents (O(d))
- `get()` operation: O(k) in worst case where:
  - k is the length of the formula chain
  - With caching, most `get()` operations become O(1) after first computation
  - Without cache, we might need to traverse the entire dependency chain

**Space Complexity:**

- O(r × c) for the grid storage, where r = rows, c = 26 columns
- O(e) for the dependency graph edges, where e is the number of formula relationships
- In worst case, every cell could reference every other cell, giving O((r × c)²) edges
- O(r × c) for the cache in worst case

## Common Mistakes

1. **Not handling circular dependencies:** Forgetting to detect cycles can cause infinite recursion. Always track visited cells during formula evaluation.

2. **Forgetting to invalidate cache when dependencies change:** When a cell's value changes, all cells that depend on it (directly or indirectly) need their cached values cleared. This requires maintaining a reverse dependency graph.

3. **Incorrect cell coordinate parsing:** Mixing up 0-based and 1-based indexing. Remember: rows are 1-indexed in the input but should be 0-indexed internally. Columns A=0, B=1, etc.

4. **Not trimming formula references:** Formulas like "=A1+B1" split into ["A1", "B1"], but "=A1 + B1" splits into ["A1 ", " B1"]. Always trim whitespace from cell references.

5. **Using the wrong data structure for dependencies:** A simple list won't efficiently support removing old dependencies when formulas change. Use sets for O(1) add/remove operations.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Dependency Graph + Topological Sort:** Similar to course scheduling (LeetCode 207) or build order problems where you need to track dependencies between items.

2. **Lazy Evaluation with Caching:** Used in spreadsheet applications, reactive programming frameworks, and memoization problems like Fibonacci with caching.

3. **Graph Traversal with Cycle Detection:** Like detecting cycles in linked lists or directed graphs, but applied to cell dependencies.

Related problems:

- **LeetCode 207: Course Schedule** - Also uses dependency graphs and cycle detection
- **LeetCode 399: Evaluate Division** - Evaluates expressions based on relationships between variables
- **LeetCode 1396: Design Underground System** - Another design problem with cumulative calculations

## Key Takeaways

1. **Design for the operations:** When designing data structures, think about which operations need to be fast. Here, `get()` needs to be fast, so we cache computed values.

2. **Track dependencies in both directions:** To efficiently invalidate cached values, maintain both "depends on" and "depended on by" relationships.

3. **Handle edge cases early:** Circular dependencies, empty cells, and formula parsing errors are common in real spreadsheet applications. Design your solution to handle them gracefully.

Related problems: [Excel Sheet Column Title](/problem/excel-sheet-column-title)
