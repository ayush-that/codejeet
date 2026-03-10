---
title: "How to Solve Parallel Courses II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Parallel Courses II. Hard difficulty, 30.6% acceptance rate. Topics: Dynamic Programming, Bit Manipulation, Graph Theory, Bitmask."
date: "2029-07-18"
category: "dsa-patterns"
tags: ["parallel-courses-ii", "dynamic-programming", "bit-manipulation", "graph-theory", "hard"]
---

# How to Solve Parallel Courses II

You're given `n` courses with prerequisite relationships, and you need to determine the minimum number of semesters to complete all courses when you can take at most `k` courses per semester. What makes this problem tricky is that it's not just topological sorting—you need to consider both the prerequisite constraints AND the per-semester course limit, which requires careful state tracking and optimization.

## Visual Walkthrough

Let's trace through a small example: `n = 4`, `k = 2`, `relations = [[2,1],[3,1],[1,4]]`

**Step 1: Build the graph**

- Course 2 is a prerequisite for course 1
- Course 3 is a prerequisite for course 1
- Course 1 is a prerequisite for course 4

This means:

- Courses 2 and 3 have no prerequisites
- Course 1 needs both 2 and 3 completed first
- Course 4 needs course 1 completed first

**Step 2: Initial state (semester 0)**
We can start with courses that have no prerequisites: courses 2 and 3.
Since `k = 2`, we can take both in the first semester.

**Step 3: After semester 1**
Completed courses: {2, 3}
Now course 1's prerequisites are satisfied (it needed both 2 AND 3).
Course 4 still needs course 1.

**Step 4: Semester 2**
Available courses: only course 1 (since course 4 still needs course 1)
We take course 1 (1 ≤ k = 2)

**Step 5: After semester 2**
Completed courses: {1, 2, 3}
Now course 4's prerequisite is satisfied.

**Step 6: Semester 3**
Available courses: course 4
We take course 4

**Step 7: Done!**
All 4 courses completed in 3 semesters.

The challenge is that with larger `n` and more complex dependencies, we need a systematic way to track which courses are available at each step while respecting the `k` limit.

## Brute Force Approach

A naive approach would be to try all possible course selections at each step:

1. At each semester, identify all courses whose prerequisites are satisfied
2. Try all possible subsets of these available courses (up to size `k`)
3. Recursively explore each possibility
4. Track the minimum semesters needed

This brute force approach has exponential complexity because at each step with `m` available courses, we'd need to consider `C(m,1) + C(m,2) + ... + C(m,min(m,k))` possibilities. For `n=15` and `k=5`, this becomes computationally infeasible.

The key insight we need is that we don't need to track _which specific courses_ we took, only _which courses are completed_. The order matters less than the state of completion.

## Optimized Approach

The optimal solution uses **bitmask dynamic programming** with **topological constraints**:

**Key Insight 1: State Representation**
We can represent the set of completed courses as a bitmask where bit `i` is 1 if course `i+1` is completed. With `n ≤ 15`, there are only `2^n = 32768` possible states, which is manageable.

**Key Insight 2: Valid Course Selection**
At any state (set of completed courses), a course is available if:

1. It's not already completed
2. All its prerequisites are in the completed set

**Key Insight 3: Optimal Substructure**
The minimum semesters to reach a state depends only on which courses we've completed, not the specific sequence. This satisfies the requirements for dynamic programming.

**Key Insight 4: Prerequisite Preprocessing**
We can precompute for each course a bitmask of its prerequisites. Then checking if all prerequisites are satisfied becomes a simple bitwise AND operation: `(prereqMask & completedMask) == prereqMask`

**Algorithm Steps:**

1. Precompute prerequisite bitmasks for each course
2. Initialize DP array where `dp[mask]` = minimum semesters to reach state `mask`
3. Start with `dp[0] = 0` (no courses completed)
4. For each state `mask`, find all available courses not in `mask`
5. Try all subsets of available courses of size up to `k`
6. Update the new state `nextMask = mask | subsetMask`
7. The answer is `dp[(1<<n)-1]` (all bits set to 1)

**Optimization:** Instead of trying all subsets, we can use a clever trick: we only need to consider taking the first `min(k, count)` available courses in some order, since all valid subsets of the same size are equivalent for our state transition.

## Optimal Solution

<div class="code-group">

```python
# Time: O(3^n) - for each mask, we iterate through its submasks
# Space: O(2^n) - for the DP array
class Solution:
    def minNumberOfSemesters(self, n: int, relations: List[List[int]], k: int) -> int:
        # Step 1: Precompute prerequisite masks for each course
        # prereq[i] is a bitmask where bit j is 1 if course j is a prerequisite of course i
        prereq = [0] * n

        for prev, next in relations:
            # Convert to 0-based indexing
            prereq[next - 1] |= 1 << (prev - 1)

        # Step 2: Initialize DP array
        # dp[mask] = minimum semesters to complete courses represented by mask
        dp = [float('inf')] * (1 << n)
        dp[0] = 0  # No courses completed

        # Step 3: Iterate through all possible states
        for mask in range(1 << n):
            if dp[mask] == float('inf'):
                continue  # This state is unreachable

            # Step 4: Find available courses for current state
            available = 0
            for i in range(n):
                # Course i is available if:
                # 1. Not already taken (bit i is 0 in mask)
                # 2. All prerequisites are satisfied
                if not (mask >> i) & 1 and (prereq[i] & mask) == prereq[i]:
                    available |= 1 << i

            # Step 5: Try all subsets of available courses
            # We iterate through all submasks of 'available'
            subset = available
            while subset > 0:
                # Count number of courses in this subset
                count = bin(subset).count('1')

                # We can only take up to k courses per semester
                if count <= k:
                    next_mask = mask | subset
                    dp[next_mask] = min(dp[next_mask], dp[mask] + 1)

                # Get next subset (iterate through all submasks)
                subset = (subset - 1) & available

        # Step 6: Return answer for state where all courses are completed
        return dp[(1 << n) - 1]
```

```javascript
// Time: O(3^n) - for each mask, we iterate through its submasks
// Space: O(2^n) - for the DP array
/**
 * @param {number} n
 * @param {number[][]} relations
 * @param {number} k
 * @return {number}
 */
var minNumberOfSemesters = function (n, relations, k) {
  // Step 1: Precompute prerequisite masks for each course
  // prereq[i] is a bitmask where bit j is 1 if course j is a prerequisite of course i
  const prereq = new Array(n).fill(0);

  for (const [prev, next] of relations) {
    // Convert to 0-based indexing
    prereq[next - 1] |= 1 << (prev - 1);
  }

  // Step 2: Initialize DP array
  // dp[mask] = minimum semesters to complete courses represented by mask
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0; // No courses completed

  // Step 3: Iterate through all possible states
  for (let mask = 0; mask < 1 << n; mask++) {
    if (dp[mask] === Infinity) {
      continue; // This state is unreachable
    }

    // Step 4: Find available courses for current state
    let available = 0;
    for (let i = 0; i < n; i++) {
      // Course i is available if:
      // 1. Not already taken (bit i is 0 in mask)
      // 2. All prerequisites are satisfied
      if (!((mask >> i) & 1) && (prereq[i] & mask) === prereq[i]) {
        available |= 1 << i;
      }
    }

    // Step 5: Try all subsets of available courses
    // We iterate through all submasks of 'available'
    let subset = available;
    while (subset > 0) {
      // Count number of courses in this subset
      const count = countBits(subset);

      // We can only take up to k courses per semester
      if (count <= k) {
        const nextMask = mask | subset;
        dp[nextMask] = Math.min(dp[nextMask], dp[mask] + 1);
      }

      // Get next subset (iterate through all submasks)
      subset = (subset - 1) & available;
    }
  }

  // Step 6: Return answer for state where all courses are completed
  return dp[(1 << n) - 1];
};

// Helper function to count bits in a number
function countBits(x) {
  let count = 0;
  while (x > 0) {
    count += x & 1;
    x >>= 1;
  }
  return count;
}
```

```java
// Time: O(3^n) - for each mask, we iterate through its submasks
// Space: O(2^n) - for the DP array
class Solution {
    public int minNumberOfSemesters(int n, int[][] relations, int k) {
        // Step 1: Precompute prerequisite masks for each course
        // prereq[i] is a bitmask where bit j is 1 if course j is a prerequisite of course i
        int[] prereq = new int[n];

        for (int[] relation : relations) {
            int prev = relation[0] - 1;  // Convert to 0-based
            int next = relation[1] - 1;  // Convert to 0-based
            prereq[next] |= 1 << prev;
        }

        // Step 2: Initialize DP array
        // dp[mask] = minimum semesters to complete courses represented by mask
        int[] dp = new int[1 << n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;  // No courses completed

        // Step 3: Iterate through all possible states
        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[mask] == Integer.MAX_VALUE) {
                continue;  // This state is unreachable
            }

            // Step 4: Find available courses for current state
            int available = 0;
            for (int i = 0; i < n; i++) {
                // Course i is available if:
                // 1. Not already taken (bit i is 0 in mask)
                // 2. All prerequisites are satisfied
                if (((mask >> i) & 1) == 0 && (prereq[i] & mask) == prereq[i]) {
                    available |= 1 << i;
                }
            }

            // Step 5: Try all subsets of available courses
            // We iterate through all submasks of 'available'
            // This is a standard trick: subset = available; while (subset > 0) { ... subset = (subset - 1) & available; }
            for (int subset = available; subset > 0; subset = (subset - 1) & available) {
                // Count number of courses in this subset
                int count = Integer.bitCount(subset);

                // We can only take up to k courses per semester
                if (count <= k) {
                    int nextMask = mask | subset;
                    dp[nextMask] = Math.min(dp[nextMask], dp[mask] + 1);
                }
            }
        }

        // Step 6: Return answer for state where all courses are completed
        return dp[(1 << n) - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(3^n)

- We have 2^n possible states (masks)
- For each state, we iterate through all subsets of available courses
- The total number of state-subset pairs is approximately 3^n because each course can be in one of three states: not available, available but not taken, or taken
- More precisely: ∑\_{mask=0}^{2^n-1} 2^{popcount(available(mask))} ≤ 3^n

**Space Complexity:** O(2^n)

- We store a DP array of size 2^n
- The prerequisite array uses O(n) space
- Total space is dominated by the DP array

For n ≤ 15, 2^n = 32768 and 3^n ≈ 14 million, which is acceptable in practice.

## Common Mistakes

1. **Forgetting to convert to 0-based indexing**: The problem uses 1-based course labels, but bitmask operations work best with 0-based indices. Always subtract 1 when building prerequisite masks.

2. **Incorrect prerequisite checking**: The condition `(prereq[i] & mask) == prereq[i]` checks if ALL prerequisites are satisfied. A common mistake is using `!= 0` which would check if ANY prerequisite is satisfied.

3. **Not handling unreachable states**: Some states might be unreachable due to prerequisite constraints. We need to skip processing these states (check `dp[mask] == INF`).

4. **Inefficient subset iteration**: The pattern `subset = available; while (subset > 0) { ... subset = (subset - 1) & available; }` efficiently iterates through all non-empty subsets. A naive approach would try all 2^n subsets instead of just subsets of available courses.

## When You'll See This Pattern

This **bitmask DP with topological constraints** pattern appears in several scheduling and sequencing problems:

1. **Course Schedule IV (LeetCode 1462)**: Similar prerequisite checking but without the semester limit constraint.

2. **Maximum Students Taking Exam (LeetCode 1349)**: Uses bitmask DP to represent seating arrangements with adjacency constraints.

3. **Minimum Number of Work Sessions (LeetCode 1986)**: Similar state representation for tasks with time constraints.

4. **Traveling Salesman Problem**: The classic bitmask DP problem where mask represents visited cities.

The pattern is recognizable when:

- You have a set of items (n ≤ 20-25)
- There are constraints between items
- You need to find an optimal sequence or selection
- The state can be represented by which items have been processed

## Key Takeaways

1. **Bitmask representation is powerful for small n**: When n ≤ 15-20, representing subsets as bitmasks enables efficient DP solutions with O(2^n) or O(3^n) complexity.

2. **Precompute constraints as bitmasks**: Convert relationship constraints into bitwise operations for O(1) checking during DP transitions.

3. **Iterate subsets efficiently**: Learn the pattern `for (int subset = mask; subset > 0; subset = (subset - 1) & mask)` to iterate through all non-empty subsets of a bitmask.

4. **State = completed items**: In sequencing problems, the DP state often represents which items have been processed so far, not the exact order.

Related problems: [Parallel Courses](/problem/parallel-courses)
