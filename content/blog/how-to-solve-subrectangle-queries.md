---
title: "How to Solve Subrectangle Queries — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Subrectangle Queries. Medium difficulty, 86.3% acceptance rate. Topics: Array, Design, Matrix."
date: "2027-01-08"
category: "dsa-patterns"
tags: ["subrectangle-queries", "array", "design", "matrix", "medium"]
---

# How to Solve Subrectangle Queries

This problem asks us to design a class that stores a rectangular matrix and supports two operations: updating all values in a subrectangle to a new value, and retrieving the value at a specific position. What makes this interesting is the tension between these operations - we need updates to be efficient, but we also need quick lookups. A naive approach would make one operation fast at the expense of the other, so we need a balanced solution.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we start with this 3×4 rectangle:

```
Initial rectangle:
[1, 2, 3, 4]
[5, 6, 7, 8]
[9, 10, 11, 12]
```

Now we call `updateSubrectangle(1, 1, 2, 2, 99)`. This means:

- `row1=1, col1=1` (top-left corner at row 1, column 1, which is value 6)
- `row2=2, col2=2` (bottom-right corner at row 2, column 2, which is value 11)
- `newValue=99`

The subrectangle to update is:

```
[6, 7]
[10, 11]
```

After the update, our rectangle becomes:

```
[1, 2, 3, 4]
[5, 99, 99, 8]
[9, 99, 99, 12]
```

If we then call `getValue(2, 1)`, we get the value at row 2, column 1, which is 99.

The challenge comes when we have many updates. If we update the same cell multiple times, we need to know which update "wins" - the most recent one should override previous ones.

## Brute Force Approach

The most straightforward approach is to store the rectangle as a 2D array and implement updates by literally iterating through every cell in the specified subrectangle:

1. **Constructor**: Store the rectangle in a 2D array
2. **updateSubrectangle**: Use nested loops from `row1` to `row2` and `col1` to `col2`, setting each cell to `newValue`
3. **getValue**: Simply return `rectangle[row][col]`

While this makes `getValue` very fast (O(1)), `updateSubrectangle` becomes O(k) where k is the number of cells in the subrectangle. In the worst case, if we update the entire rectangle of size n×m, that's O(n×m) per update. If we have many updates, this becomes prohibitively slow.

<div class="code-group">

```python
# Brute Force Solution
# Time: updateSubrectangle: O((row2-row1+1)*(col2-col1+1)), getValue: O(1)
# Space: O(rows*cols) for storing the rectangle
class SubrectangleQueries:
    def __init__(self, rectangle):
        # Store a deep copy of the rectangle
        self.rectangle = [row[:] for row in rectangle]

    def updateSubrectangle(self, row1, col1, row2, col2, newValue):
        # Iterate through every cell in the subrectangle
        for r in range(row1, row2 + 1):
            for c in range(col1, col2 + 1):
                self.rectangle[r][c] = newValue

    def getValue(self, row, col):
        # Direct lookup
        return self.rectangle[row][col]
```

```javascript
// Brute Force Solution
// Time: updateSubrectangle: O((row2-row1+1)*(col2-col1+1)), getValue: O(1)
// Space: O(rows*cols) for storing the rectangle
class SubrectangleQueries {
  constructor(rectangle) {
    // Store a deep copy of the rectangle
    this.rectangle = rectangle.map((row) => [...row]);
  }

  updateSubrectangle(row1, col1, row2, col2, newValue) {
    // Iterate through every cell in the subrectangle
    for (let r = row1; r <= row2; r++) {
      for (let c = col1; c <= col2; c++) {
        this.rectangle[r][c] = newValue;
      }
    }
  }

  getValue(row, col) {
    // Direct lookup
    return this.rectangle[row][col];
  }
}
```

```java
// Brute Force Solution
// Time: updateSubrectangle: O((row2-row1+1)*(col2-col1+1)), getValue: O(1)
// Space: O(rows*cols) for storing the rectangle
class SubrectangleQueries {
    private int[][] rectangle;

    public SubrectangleQueries(int[][] rectangle) {
        // Store a deep copy of the rectangle
        this.rectangle = new int[rectangle.length][];
        for (int i = 0; i < rectangle.length; i++) {
            this.rectangle[i] = rectangle[i].clone();
        }
    }

    public void updateSubrectangle(int row1, int col1, int row2, int col2, int newValue) {
        // Iterate through every cell in the subrectangle
        for (int r = row1; r <= row2; r++) {
            for (int c = col1; c <= col2; c++) {
                rectangle[r][c] = newValue;
            }
        }
    }

    public int getValue(int row, int col) {
        // Direct lookup
        return rectangle[row][col];
    }
}
```

</div>

## Optimized Approach

The key insight is that we don't need to immediately apply updates to the rectangle. Instead, we can store updates in a list and check them during `getValue`. Here's the reasoning:

1. **Store updates separately**: Instead of modifying the rectangle, we record each update as a tuple `(row1, col1, row2, col2, newValue)` in a list.
2. **Check updates in reverse order**: When `getValue(row, col)` is called, we iterate through the updates list from most recent to oldest.
3. **Return the first matching update**: If the `(row, col)` falls within an update's rectangle, return that update's value. If no update covers this cell, return the original value from the rectangle.

This approach makes `updateSubrectangle` O(1) - we just append to a list. `getValue` becomes O(k) where k is the number of updates, which is efficient when updates are relatively infrequent compared to lookups.

The clever part is checking updates in reverse chronological order - the most recent update that covers a cell should override all previous updates to that cell.

## Optimal Solution

Here's the complete implementation using the update history approach:

<div class="code-group">

```python
# Optimal Solution - Update History Approach
# Time: updateSubrectangle: O(1), getValue: O(k) where k is number of updates
# Space: O(rows*cols + k) for storing rectangle and updates
class SubrectangleQueries:
    def __init__(self, rectangle):
        # Store the original rectangle (deep copy to prevent external modification)
        self.rectangle = [row[:] for row in rectangle]
        # List to store all updates in chronological order
        # Each update is stored as (row1, col1, row2, col2, newValue)
        self.updates = []

    def updateSubrectangle(self, row1, col1, row2, col2, newValue):
        # Instead of modifying the rectangle, record this update
        # This is O(1) time complexity
        self.updates.append((row1, col1, row2, col2, newValue))

    def getValue(self, row, col):
        # Check updates in reverse order (most recent first)
        # This ensures the latest update overrides previous ones
        for i in range(len(self.updates) - 1, -1, -1):
            row1, col1, row2, col2, newValue = self.updates[i]
            # Check if (row, col) is within this update's rectangle
            if row1 <= row <= row2 and col1 <= col <= col2:
                return newValue
        # If no update covers this cell, return original value
        return self.rectangle[row][col]
```

```javascript
// Optimal Solution - Update History Approach
// Time: updateSubrectangle: O(1), getValue: O(k) where k is number of updates
// Space: O(rows*cols + k) for storing rectangle and updates
class SubrectangleQueries {
  constructor(rectangle) {
    // Store the original rectangle (deep copy to prevent external modification)
    this.rectangle = rectangle.map((row) => [...row]);
    // Array to store all updates in chronological order
    // Each update is stored as [row1, col1, row2, col2, newValue]
    this.updates = [];
  }

  updateSubrectangle(row1, col1, row2, col2, newValue) {
    // Instead of modifying the rectangle, record this update
    // This is O(1) time complexity
    this.updates.push([row1, col1, row2, col2, newValue]);
  }

  getValue(row, col) {
    // Check updates in reverse order (most recent first)
    // This ensures the latest update overrides previous ones
    for (let i = this.updates.length - 1; i >= 0; i--) {
      const [row1, col1, row2, col2, newValue] = this.updates[i];
      // Check if (row, col) is within this update's rectangle
      if (row >= row1 && row <= row2 && col >= col1 && col <= col2) {
        return newValue;
      }
    }
    // If no update covers this cell, return original value
    return this.rectangle[row][col];
  }
}
```

```java
// Optimal Solution - Update History Approach
// Time: updateSubrectangle: O(1), getValue: O(k) where k is number of updates
// Space: O(rows*cols + k) for storing rectangle and updates
class SubrectangleQueries {
    private int[][] rectangle;
    private List<int[]> updates;

    public SubrectangleQueries(int[][] rectangle) {
        // Store the original rectangle (deep copy to prevent external modification)
        this.rectangle = new int[rectangle.length][];
        for (int i = 0; i < rectangle.length; i++) {
            this.rectangle[i] = rectangle[i].clone();
        }
        // List to store all updates in chronological order
        // Each update is stored as int[]{row1, col1, row2, col2, newValue}
        this.updates = new ArrayList<>();
    }

    public void updateSubrectangle(int row1, int col1, int row2, int col2, int newValue) {
        // Instead of modifying the rectangle, record this update
        // This is O(1) time complexity
        updates.add(new int[]{row1, col1, row2, col2, newValue});
    }

    public int getValue(int row, int col) {
        // Check updates in reverse order (most recent first)
        // This ensures the latest update overrides previous ones
        for (int i = updates.size() - 1; i >= 0; i--) {
            int[] update = updates.get(i);
            int row1 = update[0], col1 = update[1], row2 = update[2], col2 = update[3], newValue = update[4];
            // Check if (row, col) is within this update's rectangle
            if (row >= row1 && row <= row2 && col >= col1 && col <= col2) {
                return newValue;
            }
        }
        // If no update covers this cell, return original value
        return rectangle[row][col];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Constructor**: O(n×m) where n is rows and m is cols, for creating a deep copy of the rectangle
- **updateSubrectangle**: O(1) - we just append to a list
- **getValue**: O(k) where k is the number of updates - in the worst case, we check all updates

**Space Complexity:**

- O(n×m + k) where n×m is for storing the original rectangle and k is for storing all updates

This is optimal for the problem constraints because:

1. If updates are frequent and lookups are rare, the brute force approach would be better
2. If lookups are frequent and updates are rare, our approach is better
3. In practice, we don't know the ratio, but O(1) updates with O(k) lookups is a good trade-off

## Common Mistakes

1. **Not handling overlapping updates correctly**: The most common mistake is not checking updates in reverse chronological order. If you check from oldest to newest, earlier updates will override later ones, which is incorrect. Always check from most recent backward.

2. **Modifying the input rectangle directly**: The constructor should create a deep copy of the input rectangle. If you store a reference to the input array, external code could modify it, breaking your class's correctness.

3. **Off-by-one errors in bounds checking**: When checking if a point is within an update rectangle, use inclusive comparisons (`row1 <= row <= row2` not `row1 < row < row2`). The problem specifies that row2 and col2 are inclusive boundaries.

4. **Forgetting to handle the case with no updates**: Always include a fallback to return the original rectangle value when no update covers the requested cell.

## When You'll See This Pattern

This "lazy update" or "deferred update" pattern appears in several other problems:

1. **Range Sum Query - Mutable (LeetCode 307)**: Similar trade-off between update and query operations, though with different optimal solutions like Segment Trees or Binary Indexed Trees.

2. **Design Underground System (LeetCode 1396)**: Another design problem where you need to efficiently handle two types of operations (check-in/check-out and getting average times).

3. **Snapshot Array (LeetCode 1146)**: Very similar pattern - instead of immediately updating values, you store snapshots of changes and retrieve the most recent one for a given index.

The core pattern is: when you have operations that modify data and operations that query data, sometimes it's more efficient to defer the actual modification and instead record what modifications should be applied.

## Key Takeaways

1. **Trade-offs in design problems**: When designing data structures with multiple operations, consider which operations need to be fast and which can be slower. Sometimes making one operation O(1) at the cost of making another O(k) is the right trade-off.

2. **Lazy evaluation pattern**: Instead of immediately applying updates, store them and apply only when needed. This is particularly useful when queries are more frequent than updates or when updates are expensive.

3. **Chronological ordering matters**: When storing historical data, always consider the order of operations. The most recent operation typically takes precedence, so process history from newest to oldest.

[Practice this problem on CodeJeet](/problem/subrectangle-queries)
