---
title: "How to Solve Delete Columns to Make Sorted II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Delete Columns to Make Sorted II. Medium difficulty, 49.7% acceptance rate. Topics: Array, String, Greedy."
date: "2027-08-25"
category: "dsa-patterns"
tags: ["delete-columns-to-make-sorted-ii", "array", "string", "greedy", "medium"]
---

# How to Solve Delete Columns to Make Sorted II

This problem asks us to find the minimum number of columns to delete from an array of equal-length strings so that the remaining strings are in lexicographic (dictionary) order. What makes this tricky is that unlike the simpler version (Delete Columns to Make Sorted I), we can't just check each column independently—we need to consider relationships between columns when strings are already sorted by previous columns.

## Visual Walkthrough

Let's trace through an example: `strs = ["ax", "ay", "bx", "by"]`

**Step 1:** Check column 0 (first character of each string)

- Compare "a" vs "a" vs "b" vs "b"
- Strings are already sorted by column 0: "a" ≤ "a" ≤ "b" ≤ "b"
- Since column 0 alone sorts all strings, we don't need to check column 1
- **Answer: 0 deletions**

Now a more complex example: `strs = ["ca", "bb", "ac"]`

**Step 1:** Check column 0

- "c" vs "b" vs "a" → NOT sorted ("c" > "b" > "a" is decreasing)
- We must delete column 0

**Step 2:** After deleting column 0, strings become: ["a", "b", "c"]

- Now check column 1 (original column 1 becomes new column 0)
- "a" vs "b" vs "c" → sorted!
- **Answer: 1 deletion**

The real challenge comes when some strings are equal in earlier columns. Let's trace the example from the problem: `strs = ["xc", "yb", "za"]`

**Step 1:** Check column 0

- "x" vs "y" vs "z" → sorted ("x" < "y" < "z")
- Mark that strings are sorted by column 0

**Step 2:** Check column 1

- For strings where column 0 was equal, we need to check column 1
- But here, column 0 was strictly increasing, so all strings are already sorted
- We don't need to check column 1 at all!
- **Answer: 0 deletions**

The key insight: Once we know two strings are in correct order based on earlier columns, we never need to compare them again in later columns.

## Brute Force Approach

A naive approach would be to try all possible subsets of columns to delete (2^n possibilities where n is string length), check if the remaining columns make strings sorted, and take the minimum deletions. This is exponential time and completely impractical.

A slightly better but still inefficient approach would be to:

1. Start with all columns
2. Try deleting each column one by one
3. Check if the remaining columns make strings sorted
4. If not, try deleting different combinations

This still leads to combinatorial explosion. The problem requires a more clever approach that avoids checking all combinations.

## Optimized Approach

The optimal solution uses a **greedy column-by-column checking with tracking of sorted relationships**.

**Key Insight:** We don't need to check every pair of strings in every column. Once we know `strs[i] < strs[j]` based on columns we've kept so far, we never need to compare them again.

**Algorithm:**

1. Initialize a boolean array `sorted` where `sorted[i] = true` means `strs[i] <= strs[i+1]` based on columns checked so far
2. Initially, all `sorted[i] = false` (we haven't proven any ordering yet)
3. For each column:
   - Check if we can keep this column without breaking sorted order
   - For each adjacent pair `(i, i+1)` that's not already sorted:
     - If `strs[i][col] > strs[i+1][col]`: This column breaks sorting, must delete it
     - If `strs[i][col] < strs[i+1][col]`: This column fixes their order, mark them as sorted
     - If equal: Order not determined yet, keep `sorted[i] = false`
4. Count how many columns we delete

**Why this works:** We're building up knowledge about which string pairs are already in correct order. Once a pair is sorted by some column, we ignore them in future columns. This avoids unnecessary deletions.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * m) where n = len(strs), m = len(strs[0])
# Space: O(n) for the sorted array
def minDeletionSize(strs):
    """
    Returns minimum number of columns to delete so remaining strings are sorted.

    Args:
        strs: List of strings, all same length

    Returns:
        Minimum number of columns to delete
    """
    n = len(strs)  # Number of strings
    m = len(strs[0])  # Length of each string
    deletions = 0  # Count of columns we need to delete

    # sorted[i] = True means strs[i] <= strs[i+1] based on columns kept so far
    # Initially, no pairs are proven to be sorted
    sorted_pairs = [False] * (n - 1)

    # Check each column
    for col in range(m):
        # Track if we need to delete this column
        delete_column = False
        # Make a copy to update only after checking all pairs
        new_sorted = sorted_pairs.copy()

        # Check each adjacent pair of strings
        for i in range(n - 1):
            # If this pair is already sorted, skip it
            if sorted_pairs[i]:
                continue

            # Compare characters in current column
            if strs[i][col] > strs[i + 1][col]:
                # Current column breaks sorting, must delete it
                delete_column = True
                break  # No need to check other pairs
            elif strs[i][col] < strs[i + 1][col]:
                # Current column fixes ordering for this pair
                new_sorted[i] = True
            # If equal, ordering not determined yet

        if delete_column:
            # Delete this column
            deletions += 1
        else:
            # Keep this column, update sorted status
            sorted_pairs = new_sorted

    return deletions
```

```javascript
// Time: O(n * m) where n = strs.length, m = strs[0].length
// Space: O(n) for the sorted array
function minDeletionSize(strs) {
  /**
   * Returns minimum number of columns to delete so remaining strings are sorted.
   *
   * @param {string[]} strs - Array of strings, all same length
   * @return {number} Minimum number of columns to delete
   */
  const n = strs.length; // Number of strings
  const m = strs[0].length; // Length of each string
  let deletions = 0; // Count of columns we need to delete

  // sorted[i] = true means strs[i] <= strs[i+1] based on columns kept so far
  // Initially, no pairs are proven to be sorted
  let sorted = new Array(n - 1).fill(false);

  // Check each column
  for (let col = 0; col < m; col++) {
    // Track if we need to delete this column
    let deleteColumn = false;
    // Make a copy to update only after checking all pairs
    let newSorted = [...sorted];

    // Check each adjacent pair of strings
    for (let i = 0; i < n - 1; i++) {
      // If this pair is already sorted, skip it
      if (sorted[i]) {
        continue;
      }

      // Compare characters in current column
      if (strs[i][col] > strs[i + 1][col]) {
        // Current column breaks sorting, must delete it
        deleteColumn = true;
        break; // No need to check other pairs
      } else if (strs[i][col] < strs[i + 1][col]) {
        // Current column fixes ordering for this pair
        newSorted[i] = true;
      }
      // If equal, ordering not determined yet
    }

    if (deleteColumn) {
      // Delete this column
      deletions++;
    } else {
      // Keep this column, update sorted status
      sorted = newSorted;
    }
  }

  return deletions;
}
```

```java
// Time: O(n * m) where n = strs.length, m = strs[0].length()
// Space: O(n) for the sorted array
class Solution {
    public int minDeletionSize(String[] strs) {
        /**
         * Returns minimum number of columns to delete so remaining strings are sorted.
         *
         * @param strs Array of strings, all same length
         * @return Minimum number of columns to delete
         */
        int n = strs.length;  // Number of strings
        int m = strs[0].length();  // Length of each string
        int deletions = 0;  // Count of columns we need to delete

        // sorted[i] = true means strs[i] <= strs[i+1] based on columns kept so far
        // Initially, no pairs are proven to be sorted
        boolean[] sorted = new boolean[n - 1];

        // Check each column
        for (int col = 0; col < m; col++) {
            // Track if we need to delete this column
            boolean deleteColumn = false;
            // Make a copy to update only after checking all pairs
            boolean[] newSorted = sorted.clone();

            // Check each adjacent pair of strings
            for (int i = 0; i < n - 1; i++) {
                // If this pair is already sorted, skip it
                if (sorted[i]) {
                    continue;
                }

                // Compare characters in current column
                if (strs[i].charAt(col) > strs[i + 1].charAt(col)) {
                    // Current column breaks sorting, must delete it
                    deleteColumn = true;
                    break;  // No need to check other pairs
                } else if (strs[i].charAt(col) < strs[i + 1].charAt(col)) {
                    // Current column fixes ordering for this pair
                    newSorted[i] = true;
                }
                // If equal, ordering not determined yet
            }

            if (deleteColumn) {
                // Delete this column
                deletions++;
            } else {
                // Keep this column, update sorted status
                sorted = newSorted;
            }
        }

        return deletions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m) where n is the number of strings and m is the length of each string.

- We iterate through each column (m iterations)
- For each column, in the worst case we check all adjacent pairs (n-1 pairs)
- Each check is O(1) character comparison
- Total: O(n × m)

**Space Complexity:** O(n) for the `sorted` array tracking which adjacent pairs are already in order.

- We need to track n-1 boolean values
- The input strings are not counted in space complexity (they're given)
- Additional O(1) for loop variables and counters

## Common Mistakes

1. **Checking columns independently:** The most common mistake is treating this like Delete Columns to Make Sorted I, where you can check each column independently. In this version, once strings are sorted by earlier columns, later columns don't matter for those strings.

2. **Forgetting to track sorted status:** Without tracking which pairs are already sorted, you might delete columns unnecessarily. For example, in `["ax", "ay", "bx", "by"]`, column 1 might appear unsorted if you compare "x" vs "y" vs "x" vs "y", but since column 0 already sorted everything, we don't need to check column 1.

3. **Incorrect comparison direction:** Comparing `strs[i][col] > strs[i+1][col]` when they should be non-decreasing. Remember we want `strs[i] <= strs[i+1]` for all i.

4. **Not breaking early when column must be deleted:** Once we find any pair where `strs[i][col] > strs[i+1][col]`, we must delete the entire column. Continuing to check other pairs is unnecessary and could lead to incorrect updates of the sorted array.

## When You'll See This Pattern

This greedy approach with tracking "already satisfied constraints" appears in several problems:

1. **Candy (LeetCode 135):** Similar idea of tracking relationships between adjacent elements and propagating constraints.

2. **Remove Duplicate Letters (LeetCode 316):** Uses a similar approach of tracking which characters are "fixed" in their positions.

3. **Queue Reconstruction by Height (LeetCode 406):** Another problem where you process elements in a specific order while maintaining constraints.

The pattern is: when you have constraints between elements and processing in a certain order lets you "lock in" some relationships early, allowing you to ignore them later.

## Key Takeaways

1. **Greedy with constraint tracking:** When a problem involves satisfying pairwise constraints, consider tracking which constraints are already satisfied so you can ignore them in future decisions.

2. **Lexicographic ordering builds left to right:** For string sorting problems, earlier characters are more important than later ones. Once order is determined by an earlier position, later positions don't matter for those strings.

3. **Break complex problems into column/row iterations:** For grid/array problems, iterating by columns or rows and maintaining state between iterations is a powerful technique.

[Practice this problem on CodeJeet](/problem/delete-columns-to-make-sorted-ii)
