---
title: "How to Solve Minimum Number of Moves to Seat Everyone — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Number of Moves to Seat Everyone. Easy difficulty, 87.2% acceptance rate. Topics: Array, Greedy, Sorting, Counting Sort."
date: "2028-02-17"
category: "dsa-patterns"
tags: ["minimum-number-of-moves-to-seat-everyone", "array", "greedy", "sorting", "easy"]
---

# How to Solve Minimum Number of Moves to Seat Everyone

This problem asks us to find the minimum total moves required to seat all students, where each move shifts a student one position left or right. The interesting part is recognizing that the optimal matching isn't about pairing specific students with specific seats, but about matching the smallest student position with the smallest seat position, the second smallest with the second smallest, and so on. This greedy approach yields the global minimum.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
seats = [4, 1, 5, 9]
students = [1, 3, 2, 6]
```

**Step 1: Sort both arrays**

- Sorted seats: [1, 4, 5, 9]
- Sorted students: [1, 2, 3, 6]

**Step 2: Pair smallest with smallest**

- Pair 1st: seat at position 1 ↔ student at position 1 → moves = |1-1| = 0
- Pair 2nd: seat at position 4 ↔ student at position 2 → moves = |4-2| = 2
- Pair 3rd: seat at position 5 ↔ student at position 3 → moves = |5-3| = 2
- Pair 4th: seat at position 9 ↔ student at position 6 → moves = |9-6| = 3

**Step 3: Calculate total**
Total moves = 0 + 2 + 2 + 3 = 7

**Why this works:** If we try any other pairing, we'll create "crossings" where a student passes another student to reach a seat, which always increases the total distance. By matching in sorted order, we minimize the total distance each student travels.

## Brute Force Approach

A naive approach would be to try all possible assignments of students to seats. For n students and n seats, there are n! possible permutations. For each permutation, we'd calculate the total moves by summing the absolute differences between each student's position and their assigned seat's position.

The brute force code would involve generating all permutations (using backtracking or itertools), calculating the total for each, and keeping track of the minimum. However, with n up to 100, n! is astronomically large (100! has 158 digits), making this approach completely impractical.

Even for small n, this approach is inefficient because it doesn't leverage the mathematical insight that sorting provides the optimal solution.

## Optimal Solution

The optimal solution is surprisingly simple: sort both arrays and sum the absolute differences between corresponding elements. This works because:

1. Each move is independent (moving one student doesn't affect others)
2. The total distance is minimized when we avoid "crossings" in assignments
3. Sorting ensures the closest available seat goes to each student in order

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def minMovesToSeat(seats, students):
    """
    Calculate minimum total moves to seat all students.

    Args:
        seats: List of seat positions
        students: List of student positions

    Returns:
        Minimum total moves (each move = 1 position change)
    """
    # Step 1: Sort both arrays
    # Sorting ensures we pair the closest available seat with each student
    seats.sort()
    students.sort()

    # Step 2: Initialize total moves counter
    total_moves = 0

    # Step 3: Iterate through both sorted arrays
    # Pair i-th smallest seat with i-th smallest student
    for i in range(len(seats)):
        # Calculate absolute difference between seat and student positions
        # This represents moves needed for this student to reach this seat
        moves = abs(seats[i] - students[i])

        # Add to running total
        total_moves += moves

    # Step 4: Return the minimum total moves
    return total_moves
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
function minMovesToSeat(seats, students) {
  /**
   * Calculate minimum total moves to seat all students.
   *
   * @param {number[]} seats - Array of seat positions
   * @param {number[]} students - Array of student positions
   * @return {number} Minimum total moves
   */

  // Step 1: Sort both arrays in ascending order
  // JavaScript sort() sorts lexicographically by default, so we need compare function
  seats.sort((a, b) => a - b);
  students.sort((a, b) => a - b);

  // Step 2: Initialize total moves counter
  let totalMoves = 0;

  // Step 3: Iterate through both arrays
  // Pair corresponding elements after sorting
  for (let i = 0; i < seats.length; i++) {
    // Calculate absolute difference (moves for this student)
    const moves = Math.abs(seats[i] - students[i]);

    // Add to running total
    totalMoves += moves;
  }

  // Step 4: Return the minimum total
  return totalMoves;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public int minMovesToSeat(int[] seats, int[] students) {
        /**
         * Calculate minimum total moves to seat all students.
         *
         * @param seats Array of seat positions
         * @param students Array of student positions
         * @return Minimum total moves
         */

        // Step 1: Sort both arrays
        // Arrays.sort() uses Dual-Pivot Quicksort for primitives
        Arrays.sort(seats);
        Arrays.sort(students);

        // Step 2: Initialize total moves counter
        int totalMoves = 0;

        // Step 3: Iterate through both arrays
        // Pair i-th element of sorted seats with i-th element of sorted students
        for (int i = 0; i < seats.length; i++) {
            // Calculate absolute difference
            // Math.abs() handles negative differences (though positions are positive)
            int moves = Math.abs(seats[i] - students[i]);

            // Add to running total
            totalMoves += moves;
        }

        // Step 4: Return the minimum total
        return totalMoves;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The dominant operation is sorting both arrays: O(n log n) + O(n log n) = O(2n log n) = O(n log n)
- The iteration through the arrays is O(n), which doesn't change the overall complexity since O(n log n) dominates O(n)

**Space Complexity: O(1) or O(n)**

- If the sorting algorithm is in-place (like Python's Timsort, Java's Arrays.sort for primitives), space is O(1) excluding input storage
- Some languages/sorting algorithms may use O(n) auxiliary space
- The algorithm itself only uses a few integer variables (O(1) extra space)

## Common Mistakes

1. **Forgetting to sort**: The most common mistake is trying to match students to seats without sorting. This doesn't guarantee the minimum total. Always remember: sorting enables the optimal greedy pairing.

2. **Incorrect sorting in JavaScript**: JavaScript's `Array.sort()` without a compare function sorts lexicographically (like strings), not numerically. For `[10, 2, 1]`, default sort gives `[1, 10, 2]`. Always use `(a, b) => a - b` for numeric sorting.

3. **Off-by-one errors in loops**: When iterating, ensure you use the same index for both arrays. The loop should run `min(len(seats), len(students))` times, but since the problem guarantees equal lengths, a simple `for i in range(len(seats))` works.

4. **Not using absolute value**: The distance between positions must be positive. Using `seats[i] - students[i]` without `abs()` could give negative values that incorrectly reduce the total when summed.

## When You'll See This Pattern

This "sort and pair" pattern appears in many optimization problems where you need to minimize the sum of pairwise distances:

1. **Minimum Cost to Move Chips to The Same Position (LeetCode 1217)**: Similar concept of minimizing moves, though with different move costs for different directions.

2. **Assign Cookies (LeetCode 455)**: Greedy approach of matching smallest cookie with smallest greed factor to maximize satisfaction.

3. **Maximum Units on a Truck (LeetCode 1710)**: Sort boxes by units per box to maximize total units within truck capacity.

4. **Meeting Rooms II (LeetCode 253)**: While not identical, it uses sorting to efficiently schedule meetings and minimize rooms.

The core insight is recognizing when sorting transforms a complex assignment problem into a simple greedy matching problem.

## Key Takeaways

1. **Greedy with sorting often solves assignment problems**: When you need to minimize the sum of pairwise distances between two sets, try sorting both sets and matching corresponding elements.

2. **Proof by exchange argument**: To convince yourself (and the interviewer) this works, consider what happens if you swap two assignments in a non-sorted pairing—you'll always increase the total distance.

3. **Check language-specific sorting behavior**: Different languages handle sorting differently (JavaScript's default lexicographic sort is a common pitfall). Always verify you're sorting numerically when needed.

[Practice this problem on CodeJeet](/problem/minimum-number-of-moves-to-seat-everyone)
