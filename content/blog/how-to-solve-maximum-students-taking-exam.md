---
title: "How to Solve Maximum Students Taking Exam — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Students Taking Exam. Hard difficulty, 53.4% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation, Matrix, Bitmask."
date: "2029-09-25"
category: "dsa-patterns"
tags: ["maximum-students-taking-exam", "array", "dynamic-programming", "bit-manipulation", "hard"]
---

# How to Solve Maximum Students Taking Exam

This problem asks us to place the maximum number of students in a classroom where some seats are broken, with the constraint that no student can see another's answers. A student can see the person to their left, right, upper left, and upper right. The challenge lies in the complex adjacency rules and the need to consider the entire seating arrangement simultaneously.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider this 2×3 classroom:

```
. . .
. # .
```

Where '.' is available and '#' is broken.

We need to place students such that:

1. No two adjacent students horizontally (left/right)
2. No two adjacent students diagonally (upper-left/upper-right)
3. Students can only sit in available seats ('.')

Let's try placing students row by row:

- Row 1: We could place students in seats 0 and 2 (0-indexed), but not 0 and 1 together.
- Row 2: Seat 1 is broken, so only seats 0 and 2 are available.

Valid arrangements:

- Row 1: student at seat 0, Row 2: student at seat 2 → 2 students
- Row 1: student at seat 2, Row 2: student at seat 0 → 2 students
- Row 1: students at seats 0 and 2, Row 2: no students → 2 students

The maximum is 2 students. This shows how each row's arrangement affects the next row due to diagonal constraints.

## Brute Force Approach

A naive approach would try all possible combinations of students in all available seats. For an m×n classroom, there are 2^(m×n) possible arrangements to check. For each arrangement, we would need to:

1. Verify no student is in a broken seat
2. Check no two students are adjacent horizontally
3. Check no two students are adjacent diagonally

This is exponential time and completely impractical for typical constraints (m,n ≤ 8 gives up to 2^64 possibilities).

Even a smarter brute force that only considers valid row arrangements still faces combinatorial explosion. If we generate all valid arrangements for each row (2^n possibilities per row), and then try all combinations across m rows, we have (2^n)^m = 2^(m×n) possibilities again.

## Optimized Approach

The key insight is that this is a **bitmask dynamic programming** problem. Here's the step-by-step reasoning:

1. **Row independence with constraints**: Each row's seating arrangement only directly affects the next row due to diagonal visibility. There's no constraint between non-adjacent rows.

2. **Bitmask representation**: Since n ≤ 8, we can represent a row's seating arrangement as a bitmask of length n, where bit i = 1 means a student sits in column i.

3. **Valid row arrangements**: For each row, we need masks where:
   - No two adjacent bits are 1 (no horizontal adjacency)
   - All 1-bits correspond to available seats (not broken)
   - This can be precomputed for each row.

4. **DP state definition**: Let `dp[i][mask]` = maximum students we can place in first i rows, where the i-th row has seating arrangement `mask`.

5. **Transition formula**: To compute `dp[i][current_mask]`, we consider all valid masks for the previous row (`prev_mask`) and check:
   - No diagonal conflict: `(current_mask & (prev_mask << 1)) == 0` and `(current_mask & (prev_mask >> 1)) == 0`
   - Then: `dp[i][current_mask] = max(dp[i][current_mask], dp[i-1][prev_mask] + count_bits(current_mask))`

6. **Final answer**: The maximum over all valid masks for the last row.

This reduces the complexity from exponential in m×n to exponential only in n, which is manageable since n ≤ 8.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m * 4^n) - For each of m rows, we check all pairs of valid masks (up to 2^n each)
# Space: O(m * 2^n) - DP table size
class Solution:
    def maxStudents(self, seats: List[List[str]]) -> int:
        m, n = len(seats), len(seats[0])

        # Step 1: Precompute valid masks for each row
        # A mask is valid if: no adjacent students, and all students sit in available seats
        valid_masks = []
        for i in range(m):
            masks = []
            # Try all possible masks for this row (0 to 2^n - 1)
            for mask in range(1 << n):
                valid = True
                # Check each bit in the mask
                for j in range(n):
                    # If this bit is set (student in seat j)
                    if (mask >> j) & 1:
                        # Check if seat is available
                        if seats[i][j] == '#':
                            valid = False
                            break
                        # Check left neighbor in same row (if j > 0)
                        if j > 0 and (mask >> (j - 1)) & 1:
                            valid = False
                            break
                if valid:
                    masks.append(mask)
            valid_masks.append(masks)

        # Step 2: Initialize DP table
        # dp[i][mask] = max students in first i rows ending with mask in row i
        # We only need previous row, so we can optimize space to O(2^n)
        dp = [-1] * (1 << n)
        dp[0] = 0  # Base case: no rows, no students

        # Step 3: Process each row
        for i in range(m):
            new_dp = [-1] * (1 << n)
            # Try all valid masks for current row
            for curr_mask in valid_masks[i]:
                # Try all previous masks that are compatible
                for prev_mask in range(1 << n):
                    if dp[prev_mask] == -1:
                        continue  # This previous mask wasn't reachable

                    # Check diagonal constraints with previous row
                    # No student in curr_mask should have a student in prev_mask
                    # at upper-left or upper-right positions
                    if (curr_mask & (prev_mask << 1)) == 0 and (curr_mask & (prev_mask >> 1)) == 0:
                        # Count students in current mask (number of 1 bits)
                        students = bin(curr_mask).count('1')
                        new_dp[curr_mask] = max(new_dp[curr_mask], dp[prev_mask] + students)

            # Move to next row
            dp = new_dp

        # Step 4: Return maximum from last row
        return max(dp)
```

```javascript
// Time: O(m * 4^n) - For each of m rows, we check all pairs of valid masks
// Space: O(2^n) - DP table size (optimized to only store previous row)
var maxStudents = function (seats) {
  const m = seats.length;
  const n = seats[0].length;

  // Step 1: Precompute valid masks for each row
  const validMasks = [];
  for (let i = 0; i < m; i++) {
    const masks = [];
    // Try all possible masks for this row (0 to 2^n - 1)
    for (let mask = 0; mask < 1 << n; mask++) {
      let valid = true;
      // Check each bit in the mask
      for (let j = 0; j < n; j++) {
        // If this bit is set (student in seat j)
        if ((mask >> j) & 1) {
          // Check if seat is available
          if (seats[i][j] === "#") {
            valid = false;
            break;
          }
          // Check left neighbor in same row
          if (j > 0 && (mask >> (j - 1)) & 1) {
            valid = false;
            break;
          }
        }
      }
      if (valid) {
        masks.push(mask);
      }
    }
    validMasks.push(masks);
  }

  // Step 2: Initialize DP table (only need previous row)
  let dp = new Array(1 << n).fill(-1);
  dp[0] = 0; // Base case: no rows, no students

  // Step 3: Process each row
  for (let i = 0; i < m; i++) {
    const newDp = new Array(1 << n).fill(-1);

    // Try all valid masks for current row
    for (const currMask of validMasks[i]) {
      // Try all previous masks that are compatible
      for (let prevMask = 0; prevMask < 1 << n; prevMask++) {
        if (dp[prevMask] === -1) continue; // Unreachable state

        // Check diagonal constraints with previous row
        // No student in currMask should have a student in prevMask
        // at upper-left or upper-right positions
        if ((currMask & (prevMask << 1)) === 0 && (currMask & (prevMask >> 1)) === 0) {
          // Count students in current mask (number of 1 bits)
          const students = countBits(currMask);
          newDp[currMask] = Math.max(newDp[currMask], dp[prevMask] + students);
        }
      }
    }

    // Move to next row
    dp = newDp;
  }

  // Step 4: Return maximum from last row
  return Math.max(...dp);
};

// Helper function to count number of 1 bits in a number
function countBits(num) {
  let count = 0;
  while (num > 0) {
    count += num & 1;
    num >>= 1;
  }
  return count;
}
```

```java
// Time: O(m * 4^n) - For each of m rows, we check all pairs of valid masks
// Space: O(2^n) - DP table size (optimized to only store previous row)
class Solution {
    public int maxStudents(char[][] seats) {
        int m = seats.length;
        int n = seats[0].length;

        // Step 1: Precompute valid masks for each row
        List<Integer>[] validMasks = new List[m];
        for (int i = 0; i < m; i++) {
            validMasks[i] = new ArrayList<>();
            // Try all possible masks for this row (0 to 2^n - 1)
            for (int mask = 0; mask < (1 << n); mask++) {
                boolean valid = true;
                // Check each bit in the mask
                for (int j = 0; j < n; j++) {
                    // If this bit is set (student in seat j)
                    if (((mask >> j) & 1) == 1) {
                        // Check if seat is available
                        if (seats[i][j] == '#') {
                            valid = false;
                            break;
                        }
                        // Check left neighbor in same row
                        if (j > 0 && ((mask >> (j - 1)) & 1) == 1) {
                            valid = false;
                            break;
                        }
                    }
                }
                if (valid) {
                    validMasks[i].add(mask);
                }
            }
        }

        // Step 2: Initialize DP table (only need previous row)
        int[] dp = new int[1 << n];
        Arrays.fill(dp, -1);
        dp[0] = 0;  // Base case: no rows, no students

        // Step 3: Process each row
        for (int i = 0; i < m; i++) {
            int[] newDp = new int[1 << n];
            Arrays.fill(newDp, -1);

            // Try all valid masks for current row
            for (int currMask : validMasks[i]) {
                // Try all previous masks that are compatible
                for (int prevMask = 0; prevMask < (1 << n); prevMask++) {
                    if (dp[prevMask] == -1) continue;  // Unreachable state

                    // Check diagonal constraints with previous row
                    // No student in currMask should have a student in prevMask
                    // at upper-left or upper-right positions
                    if ((currMask & (prevMask << 1)) == 0 &&
                        (currMask & (prevMask >> 1)) == 0) {

                        // Count students in current mask
                        int students = Integer.bitCount(currMask);
                        newDp[currMask] = Math.max(newDp[currMask], dp[prevMask] + students);
                    }
                }
            }

            // Move to next row
            dp = newDp;
        }

        // Step 4: Return maximum from last row
        int maxStudents = 0;
        for (int students : dp) {
            maxStudents = Math.max(maxStudents, students);
        }
        return maxStudents;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(m × 4^n)

- We have m rows to process
- For each row, we consider all valid masks (up to 2^n) and for each, we check against all previous masks (up to 2^n)
- In practice, valid masks are fewer than 2^n, but worst-case is O(2^n × 2^n) = O(4^n) per row
- With n ≤ 8, 4^8 = 65,536 operations per row is manageable

**Space Complexity**: O(2^n)

- We store DP states for the current and previous rows, each of size 2^n
- The valid masks list takes O(m × 2^n) but this can be generated on the fly if needed

## Common Mistakes

1. **Missing the diagonal constraint check**: Candidates often check horizontal adjacency within a row but forget that students can see diagonally. Remember to check both `(curr & (prev << 1))` and `(curr & (prev >> 1))`.

2. **Incorrect bit manipulation for adjacency checks**: When checking horizontal adjacency within a row, you need to check if bit j and bit j-1 are both 1. The common mistake is checking `mask & (mask << 1)` which only catches some adjacent pairs.

3. **Not handling broken seats correctly**: A mask might have no adjacent students but place students in broken seats. Always verify that every 1-bit in a mask corresponds to an available seat ('.').

4. **Space optimization oversight**: While the DP can be implemented as `dp[m][1<<n]`, we only need the previous row. Using 2D array when 1D suffices wastes memory and can cause cache inefficiency.

## When You'll See This Pattern

This **bitmask DP** pattern appears in problems where:

1. You need to make binary decisions (choose or not choose) for each position in a row/array
2. Decisions are constrained by adjacent positions (horizontally or vertically)
3. The width (n) is small enough that 2^n states are manageable (typically n ≤ 20, often n ≤ 12)

Related LeetCode problems:

- **LeetCode 1349. Maximum Students Taking Exam** (this problem)
- **LeetCode 1986. Minimum Number of Work Sessions to Finish the Tasks** - Bitmask DP for task assignment
- **LeetCode 698. Partition to K Equal Sum Subsets** - Bitmask DP for subset partitioning
- **LeetCode 1723. Find Minimum Time to Finish All Jobs** - Similar to 698 but with optimization

## Key Takeaways

1. **Bitmask DP is powerful for small-width grid problems**: When n ≤ 12-20, representing row states as bitmasks lets you efficiently encode and transition between configurations.

2. **Break complex constraints into layers**: Row-by-row processing with DP lets you handle 2D constraints by only worrying about adjacency between consecutive rows.

3. **Precomputation is key**: Generating all valid row arrangements upfront simplifies the main DP logic and improves performance by eliminating invalid states early.

[Practice this problem on CodeJeet](/problem/maximum-students-taking-exam)
