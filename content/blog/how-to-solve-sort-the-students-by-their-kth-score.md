---
title: "How to Solve Sort the Students by Their Kth Score — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sort the Students by Their Kth Score. Medium difficulty, 86.0% acceptance rate. Topics: Array, Sorting, Matrix."
date: "2027-09-04"
category: "dsa-patterns"
tags: ["sort-the-students-by-their-kth-score", "array", "sorting", "matrix", "medium"]
---

# How to Solve Sort the Students by Their Kth Score

You're given a matrix of student exam scores and need to sort the rows (students) based on their score in a specific exam (the k-th column). The challenge is that you need to sort entire rows while maintaining their internal structure, not just sort individual scores. This problem tests your understanding of custom sorting in multi-dimensional data structures.

## Visual Walkthrough

Let's walk through a concrete example to build intuition:

**Input:**

```
score = [[10, 6, 9, 1],
         [7, 5, 11, 2],
         [4, 8, 3, 0]]
k = 2
```

We need to sort students by their score in the 2nd exam (0-indexed, so column index 2).

**Step 1:** Identify the k-th score for each student:

- Student 0 (row 0): score[0][2] = 9
- Student 1 (row 1): score[1][2] = 11
- Student 2 (row 2): score[2][2] = 3

**Step 2:** Sort students in descending order by these k-th scores:

- Student 1 has 11 (highest)
- Student 0 has 9
- Student 2 has 3 (lowest)

**Step 3:** Reconstruct the matrix in this new order:

```
[[7, 5, 11, 2],   # Student 1 (k-th score = 11)
 [10, 6, 9, 1],    # Student 0 (k-th score = 9)
 [4, 8, 3, 0]]     # Student 2 (k-th score = 3)
```

The key insight is that we need to sort entire rows based on a specific column value, keeping all columns for each student together.

## Brute Force Approach

A naive approach might try to extract just the k-th scores, sort them, then somehow reconstruct the matrix. However, this becomes complex because you lose the connection between the k-th score and the rest of the student's data.

A more straightforward brute force would be to implement a custom sorting algorithm (like bubble sort) that compares rows based on their k-th element and swaps entire rows when needed:

1. Iterate through all pairs of rows
2. Compare their k-th scores
3. If they're in the wrong order (not descending), swap the entire rows
4. Repeat until the matrix is sorted

This approach would work but is inefficient with O(m²) time complexity for m students, as we'd need multiple passes through the matrix. While it would produce the correct result, it's not optimal for larger inputs.

## Optimized Approach

The optimal solution leverages built-in sorting functions with custom comparators. Most programming languages provide efficient sorting algorithms (typically O(m log m) for m items) that can be customized to compare items based on specific criteria.

The key insight is that we can:

1. Use the language's built-in sort function (which is highly optimized)
2. Provide a custom comparison function that looks at the k-th element of each row
3. Sort in descending order by specifying reverse order or negating the comparison

This approach is efficient because:

- We only need to sort once
- The sorting algorithm handles all the comparisons and swaps optimally
- We don't need to manually implement sorting logic
- The entire row moves as a unit, maintaining the relationship between columns

## Optimal Solution

Here's the complete solution using custom sorting:

<div class="code-group">

```python
# Time: O(m log m) where m = number of students (rows)
# Space: O(log m) for the sorting algorithm's recursion stack (or O(1) for iterative sort)
def sortTheStudents(score, k):
    """
    Sort the matrix rows in descending order based on the k-th column.

    Args:
        score: List[List[int]] - matrix of student scores
        k: int - column index to sort by (0-indexed)

    Returns:
        List[List[int]] - sorted matrix
    """
    # Sort the rows using a custom key function
    # The key function extracts the k-th element from each row
    # We sort in descending order, so we use reverse=True
    score.sort(key=lambda row: row[k], reverse=True)

    return score
```

```javascript
// Time: O(m log m) where m = number of students (rows)
// Space: O(log m) for the sorting algorithm's recursion stack
/**
 * Sort the matrix rows in descending order based on the k-th column.
 * @param {number[][]} score - matrix of student scores
 * @param {number} k - column index to sort by (0-indexed)
 * @return {number[][]} - sorted matrix
 */
function sortTheStudents(score, k) {
  // Sort the rows using a custom comparator function
  // The comparator compares the k-th elements of two rows
  // We want descending order, so we compare b[k] to a[k] (not a[k] to b[k])
  score.sort((a, b) => b[k] - a[k]);

  return score;
}
```

```java
// Time: O(m log m) where m = number of students (rows)
// Space: O(log m) for the sorting algorithm's recursion stack
import java.util.Arrays;

class Solution {
    /**
     * Sort the matrix rows in descending order based on the k-th column.
     * @param score - matrix of student scores
     * @param k - column index to sort by (0-indexed)
     * @return sorted matrix
     */
    public int[][] sortTheStudents(int[][] score, int k) {
        // Sort the rows using a custom comparator
        // Comparator compares the k-th elements of two rows
        // We use Integer.compare(b[k], a[k]) for descending order
        Arrays.sort(score, (a, b) -> Integer.compare(b[k], a[k]));

        return score;
    }
}
```

</div>

**Line-by-line explanation:**

1. **Python:** `score.sort(key=lambda row: row[k], reverse=True)`
   - `key=lambda row: row[k]`: Creates a function that extracts the k-th element from each row
   - `reverse=True`: Sorts in descending order (highest k-th score first)

2. **JavaScript:** `score.sort((a, b) => b[k] - a[k])`
   - The comparator returns positive if `b[k] > a[k]`, which sorts in descending order
   - If `b[k] - a[k]` is positive, `b` comes before `a` in the sorted array

3. **Java:** `Arrays.sort(score, (a, b) -> Integer.compare(b[k], a[k]))`
   - Uses a lambda expression as a comparator
   - `Integer.compare(b[k], a[k])` compares in reverse order for descending sort

## Complexity Analysis

**Time Complexity:** O(m log m)

- Where m is the number of students (rows in the matrix)
- The dominant operation is sorting the rows, which takes O(m log m) time with efficient comparison-based sorting algorithms
- Extracting the k-th element for comparison is O(1) per comparison

**Space Complexity:** O(log m) for recursion stack (or O(1) for iterative implementations)

- The sorting algorithm typically uses O(log m) space for its recursion stack
- Some implementations might use O(1) additional space for iterative sorting
- We're sorting in-place, so no additional matrix storage is needed

## Common Mistakes

1. **Sorting only the k-th column:** Some candidates extract just the k-th column, sort it, and then try to reconstruct the matrix. This fails because you lose the connection between the k-th score and the rest of the student's data.

2. **Incorrect comparator for descending order:** Forgetting to reverse the comparison for descending order. In many languages, the default sort is ascending, so you need to explicitly specify descending order.

3. **0-index vs 1-index confusion:** The problem states k is 0-indexed, but some candidates might treat it as 1-indexed by mistake. Always double-check the problem statement's indexing.

4. **Modifying the input when it shouldn't be modified:** Some interviewers might expect you not to modify the input. While the problem doesn't explicitly forbid it, it's good practice to mention whether your solution is in-place or creates a copy.

5. **Forgetting that scores are distinct:** The problem states scores are distinct, which means we don't need to handle tie-breaking. In a real-world scenario, you'd need a secondary sort key.

## When You'll See This Pattern

This problem demonstrates the pattern of **custom sorting based on a specific attribute**. You'll encounter similar patterns in:

1. **Sort the People (LeetCode 2418)** - Sort names by heights, similar to sorting rows by a specific column value.

2. **Custom Sort String (LeetCode 791)** - Sort characters in a string based on a custom order, which also requires custom comparison logic.

3. **Sort Characters By Frequency (LeetCode 451)** - Sort characters by their frequency, which involves extracting a specific attribute (frequency) to sort by.

4. **Meeting Rooms II (LeetCode 253)** - While not identical, it involves sorting intervals by start time, then processing them in sorted order.

The core pattern is: when you need to sort items based on a specific property or computed value, use a custom comparator or key function that extracts/compares that property.

## Key Takeaways

1. **Custom sorting is your friend:** When you need to sort complex objects (like rows of a matrix) based on a specific attribute, use your language's built-in sort with a custom comparator or key function.

2. **Think in terms of transformations:** Instead of manually implementing sorting algorithms, think about how to transform the problem to use efficient built-in operations. Extract the sorting key, then let the optimized sort function do the heavy lifting.

3. **Pay attention to sort order:** Always check whether you need ascending or descending order. The difference is usually just a `reverse=True` flag or swapping the comparison order in your comparator.

4. **Consider in-place vs copy:** For interview problems, consider whether you should sort in-place (modifying the input) or create a sorted copy. When in doubt, ask the interviewer for clarification.

Related problems: [Erect the Fence](/problem/erect-the-fence), [Custom Sort String](/problem/custom-sort-string), [Sort the People](/problem/sort-the-people)
