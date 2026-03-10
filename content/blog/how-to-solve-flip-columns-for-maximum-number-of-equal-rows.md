---
title: "How to Solve Flip Columns For Maximum Number of Equal Rows — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Flip Columns For Maximum Number of Equal Rows. Medium difficulty, 78.6% acceptance rate. Topics: Array, Hash Table, Matrix."
date: "2027-02-21"
category: "dsa-patterns"
tags: ["flip-columns-for-maximum-number-of-equal-rows", "array", "hash-table", "matrix", "medium"]
---

# How to Solve Flip Columns For Maximum Number of Equal Rows

You're given a binary matrix where you can flip entire columns (changing all 0s to 1s and vice versa in that column). The goal is to find the maximum number of rows that can be made entirely equal (all 0s or all 1s) after any number of column flips. What makes this problem interesting is that flipping columns affects all rows simultaneously, so you need to find which rows can be made identical through the same set of column operations.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
Matrix:
[0, 1, 0]
[1, 0, 1]
[0, 1, 0]
[1, 0, 1]
```

We can flip any columns we want. Let's think about what happens when we flip columns:

1. **Row 1**: `[0, 1, 0]` - To make this all 0s, we'd need to flip column 2 (middle column)
2. **Row 2**: `[1, 0, 1]` - To make this all 0s, we'd need to flip columns 1 and 3
3. **Row 3**: `[0, 1, 0]` - Same as row 1
4. **Row 4**: `[1, 0, 1]` - Same as row 2

Notice something crucial: Rows 1 and 3 are identical, and rows 2 and 4 are identical. But there's more: Rows 1 and 2 are actually complements of each other! Let me show you:

- Row 1: `[0, 1, 0]`
- Row 2: `[1, 0, 1]` (every bit is flipped from row 1)

Here's the key insight: **If we flip all columns where row 1 has a 1, row 1 becomes all 0s. But what happens to row 2?** Since row 2 is the complement of row 1, flipping the same columns will turn row 2 into all 1s! Both rows become all-equal (though not to the same value).

Let's verify:

- Row 1: `[0, 1, 0]` → flip column 2 → `[0, 0, 0]`
- Row 2: `[1, 0, 1]` → flip column 2 → `[1, 1, 1]`

So rows 1 and 2 can BOTH be made all-equal with the same column flips! In fact, any two rows that are either identical OR complements of each other can be made all-equal with the same column flips.

Therefore, the maximum number of equal rows = the maximum frequency of (row pattern OR its complement pattern).

## Brute Force Approach

A naive approach would be to try all possible combinations of column flips. For an `m × n` matrix, there are `2^n` possible column flip combinations (each column can be flipped or not). For each combination, we'd check how many rows become all-equal, which takes `O(m × n)` time. This gives us `O(2^n × m × n)` time complexity, which is exponential and completely impractical for any reasonable `n`.

Even if we think more cleverly, a brute force approach might try to consider each row as a "target" and see how many other rows match it or its complement after appropriate flips. But doing this naively for each row would still be `O(m² × n)` which is `O(m³)` for square matrices - still too slow for typical constraints.

## Optimized Approach

The key insight is that **two rows can be made all-equal by the same column flips if and only if they are either identical or complements of each other**.

Why is this true?

1. If two rows are identical, flipping the same columns will affect them identically
2. If two rows are complements, flipping columns where the first row has 1s will turn the first row to all 0s and the second row to all 1s (since flipping a 0 gives 1 and flipping a 1 gives 0)
3. If rows are neither identical nor complements, no single set of column flips can make both all-equal

Therefore, we can:

1. For each row, create a "pattern key" that represents both the row and its complement
2. Count how many rows share the same pattern key
3. The maximum count is our answer

But how do we create a pattern key that represents both a row and its complement? We have two good options:

- **Option 1**: Use the first element as a reference. If the first element is 0, keep the row as-is. If it's 1, flip the entire row (take its complement). This ensures all rows that are complements get the same key.
- **Option 2**: Create a normalized pattern where we XOR each element with the first element. This gives us a pattern of 0s and 1s where the first element is always 0.

Both approaches work because they map complementary rows to the same pattern.

## Optimal Solution

Here's the complete solution using the normalization approach:

<div class="code-group">

```python
# Time: O(m × n) | Space: O(m × n)
def maxEqualRowsAfterFlips(matrix):
    """
    Returns the maximum number of rows that can be made all-equal
    after flipping any number of columns.

    The key insight: Two rows can be made all-equal by the same
    column flips if and only if they are identical or complements.
    We normalize each row so that identical and complementary rows
    map to the same pattern.
    """
    from collections import defaultdict

    pattern_count = defaultdict(int)

    for row in matrix:
        # Create a normalized pattern for this row
        # If the first element is 1, we flip the entire row
        # This ensures complementary rows get the same pattern
        if row[0] == 1:
            # Flip the row: 0->1 and 1->0
            normalized = tuple(1 - x for x in row)
        else:
            # Keep the row as-is
            normalized = tuple(row)

        # Count how many rows have this normalized pattern
        pattern_count[normalized] += 1

    # The answer is the maximum frequency of any pattern
    return max(pattern_count.values())
```

```javascript
// Time: O(m × n) | Space: O(m × n)
function maxEqualRowsAfterFlips(matrix) {
  /**
   * Returns the maximum number of rows that can be made all-equal
   * after flipping any number of columns.
   *
   * The key insight: Two rows can be made all-equal by the same
   * column flips if and only if they are identical or complements.
   * We normalize each row so that identical and complementary rows
   * map to the same pattern.
   */
  const patternCount = new Map();

  for (const row of matrix) {
    // Create a normalized pattern for this row
    // If the first element is 1, we flip the entire row
    // This ensures complementary rows get the same pattern
    let normalized;
    if (row[0] === 1) {
      // Flip the row: 0->1 and 1->0
      normalized = row.map((x) => 1 - x);
    } else {
      // Keep the row as-is
      normalized = [...row];
    }

    // Convert array to string for use as Map key
    const key = normalized.join(",");

    // Count how many rows have this normalized pattern
    patternCount.set(key, (patternCount.get(key) || 0) + 1);
  }

  // The answer is the maximum frequency of any pattern
  return Math.max(...patternCount.values());
}
```

```java
// Time: O(m × n) | Space: O(m × n)
import java.util.*;

class Solution {
    public int maxEqualRowsAfterFlips(int[][] matrix) {
        /**
         * Returns the maximum number of rows that can be made all-equal
         * after flipping any number of columns.
         *
         * The key insight: Two rows can be made all-equal by the same
         * column flips if and only if they are identical or complements.
         * We normalize each row so that identical and complementary rows
         * map to the same pattern.
         */
        Map<String, Integer> patternCount = new HashMap<>();

        for (int[] row : matrix) {
            // Create a normalized pattern for this row
            // If the first element is 1, we flip the entire row
            // This ensures complementary rows get the same pattern
            StringBuilder normalized = new StringBuilder();

            if (row[0] == 1) {
                // Flip the row: 0->1 and 1->0
                for (int x : row) {
                    normalized.append(1 - x);
                }
            } else {
                // Keep the row as-is
                for (int x : row) {
                    normalized.append(x);
                }
            }

            String key = normalized.toString();

            // Count how many rows have this normalized pattern
            patternCount.put(key, patternCount.getOrDefault(key, 0) + 1);
        }

        // The answer is the maximum frequency of any pattern
        int maxCount = 0;
        for (int count : patternCount.values()) {
            maxCount = Math.max(maxCount, count);
        }
        return maxCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(m × n)` where `m` is the number of rows and `n` is the number of columns. We iterate through each cell once to create the normalized pattern for each row, and then we process the patterns.

**Space Complexity:** `O(m × n)` in the worst case. We store a normalized pattern (size `n`) for each row (up to `m` rows) in our hash map. In practice, if many rows share the same pattern, the space usage will be less.

## Common Mistakes

1. **Trying to actually simulate flips:** Some candidates try to simulate all `2^n` possible column flip combinations. This is exponential time and will timeout for any reasonable `n > 20`.

2. **Forgetting about complementary rows:** The most common mistake is only counting identical rows, forgetting that complementary rows can also be made all-equal with the same flips. Always remember: identical OR complementary.

3. **Incorrect normalization:** When normalizing rows, it's crucial to be consistent. If you choose "make first element 0" as your normalization rule, you must apply it to all rows. Mixing different normalization strategies will give wrong results.

4. **Using the wrong data structure key:** In Java and JavaScript, you can't use arrays directly as Map keys (they compare by reference, not value). You need to convert to String or use a custom object with proper hashCode/equals implementation.

## When You'll See This Pattern

This pattern of "normalizing representations to group equivalent items" appears in several problems:

1. **Group Anagrams (LeetCode 49):** Instead of comparing strings directly, you sort each string or count character frequencies to create a normalized key that groups anagrams together.

2. **Isomorphic Strings (LeetCode 205):** You create a mapping pattern between characters in two strings to check if they have the same structure.

3. **Find and Replace Pattern (LeetCode 890):** Similar to isomorphic strings, you normalize words to a pattern and group words with the same pattern.

The common theme is identifying when two different-looking things are actually "equivalent" under some transformation, and creating a canonical representation that captures this equivalence.

## Key Takeaways

1. **Look for equivalence classes:** When a problem involves transformations (like flipping columns), ask: "Which inputs become identical after applying some transformation?" Group them into equivalence classes.

2. **Normalize to a canonical form:** Create a standardized representation for each equivalence class. This often involves choosing a "reference point" (like the first element in this problem) and transforming everything relative to it.

3. **Complementary patterns matter:** In binary problems, always consider both a pattern and its complement. They're often two sides of the same coin.

[Practice this problem on CodeJeet](/problem/flip-columns-for-maximum-number-of-equal-rows)
