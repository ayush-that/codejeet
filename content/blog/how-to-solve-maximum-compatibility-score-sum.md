---
title: "How to Solve Maximum Compatibility Score Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Compatibility Score Sum. Medium difficulty, 64.3% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask."
date: "2029-03-05"
category: "dsa-patterns"
tags: ["maximum-compatibility-score-sum", "array", "dynamic-programming", "backtracking", "medium"]
---

# How to Solve Maximum Compatibility Score Sum

You're given `m` students and `m` mentors, each with `n` binary answers to a survey. The compatibility score between a student and mentor is the number of answers they have in common. Your task is to assign each student to exactly one mentor (and vice versa) to maximize the total compatibility score. What makes this problem interesting is that it's essentially a maximum-weight bipartite matching problem disguised as a survey compatibility question. The challenge comes from the combinatorial explosion of possible assignments - there are `m!` ways to pair students with mentors.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
students = [[1,1,0],[1,0,1],[0,0,1]]
mentors = [[1,0,0],[0,0,1],[1,1,0]]
m = 3, n = 3
```

**Step 1: Calculate all compatibility scores**
We need to compute the score for each student-mentor pair:

- Student 0 [1,1,0]:
  - With Mentor 0 [1,0,0]: 1 match (question 0) → score = 1
  - With Mentor 1 [0,0,1]: 0 matches → score = 0
  - With Mentor 2 [1,1,0]: 3 matches → score = 3

- Student 1 [1,0,1]:
  - With Mentor 0: 1 match (question 0) → score = 1
  - With Mentor 1: 2 matches (questions 1,2) → score = 2
  - With Mentor 2: 1 match (question 0) → score = 1

- Student 2 [0,0,1]:
  - With Mentor 0: 0 matches → score = 0
  - With Mentor 1: 2 matches (questions 1,2) → score = 2
  - With Mentor 2: 1 match (question 2) → score = 1

**Step 2: Find optimal assignment**
We need to assign each student to a unique mentor. Let's try different assignments:

- Assignment 1: S0→M0(1), S1→M1(2), S2→M2(1) → Total = 4
- Assignment 2: S0→M0(1), S1→M2(1), S2→M1(2) → Total = 4
- Assignment 3: S0→M1(0), S1→M0(1), S2→M2(1) → Total = 2
- Assignment 4: S0→M1(0), S1→M2(1), S2→M0(0) → Total = 1
- Assignment 5: S0→M2(3), S1→M0(1), S2→M1(2) → Total = 6 ← **Best!**
- Assignment 6: S0→M2(3), S1→M1(2), S2→M0(0) → Total = 5

The optimal assignment gives us a total score of 6.

## Brute Force Approach

The most straightforward approach is to generate all possible permutations of mentor assignments to students. Since there are `m` students and `m` mentors, there are `m!` possible assignments. For each permutation, we calculate the total compatibility score and keep track of the maximum.

**Why this is insufficient:**

- For `m = 8`, there are 40,320 permutations
- For `m = 10`, there are 3,628,800 permutations
- For `m = 12`, there are 479,001,600 permutations
- The problem constraints allow `m` up to 8, which gives 40,320 permutations - manageable but not optimal. However, this approach doesn't scale well and misses opportunities for optimization through memoization.

The brute force approach has O(m! × m × n) time complexity, which becomes impractical quickly as `m` grows.

## Optimized Approach

The key insight is that this is a **maximum-weight bipartite matching** problem, which can be solved using **bitmask dynamic programming**. Here's the step-by-step reasoning:

1. **Precompute compatibility scores**: First, calculate the compatibility score for every student-mentor pair and store it in a 2D array. This avoids recomputing scores repeatedly.

2. **Use bitmask to represent mentor availability**: Since `m ≤ 8`, we can use an integer bitmask where the i-th bit is 1 if mentor i is already assigned, and 0 if available. This gives us 2^m possible states (256 for m=8).

3. **DP state definition**: Let `dp[mask]` represent the maximum total compatibility score we can achieve when we've assigned mentors to the first `k` students, where `k` is the number of 1-bits in `mask`, and `mask` represents which mentors are already taken.

4. **DP transition**: For the current state `mask`, we're about to assign a mentor to student `k` (where `k = countBits(mask)`). We try all mentors `j` that are still available (bit `j` is 0 in `mask`), and transition to state `mask | (1 << j)` by adding the compatibility score between student `k` and mentor `j`.

5. **Base case**: When all mentors are assigned (`mask` has all m bits set), the score is 0 (no more students to assign).

6. **Answer**: The maximum score is `dp[(1 << m) - 1]` (all bits set).

This approach reduces the complexity from O(m!) to O(m × 2^m), which is much more efficient for m ≤ 8.

## Optimal Solution

Here's the complete implementation using bitmask DP:

<div class="code-group">

```python
# Time: O(m^2 * 2^m) | Space: O(2^m)
def maxCompatibilitySum(students, mentors):
    m, n = len(students), len(students[0])

    # Step 1: Precompute compatibility scores for all student-mentor pairs
    # score[i][j] = compatibility between student i and mentor j
    score = [[0] * m for _ in range(m)]
    for i in range(m):
        for j in range(m):
            # Count number of matching answers between student i and mentor j
            matches = 0
            for k in range(n):
                if students[i][k] == mentors[j][k]:
                    matches += 1
            score[i][j] = matches

    # Step 2: Initialize DP array
    # dp[mask] = max score when we've assigned mentors represented by 'mask'
    # to the first k students, where k = number of 1 bits in mask
    dp = [-1] * (1 << m)
    dp[0] = 0  # Base case: no mentors assigned yet

    # Step 3: Iterate through all possible mask states
    for mask in range(1 << m):
        # Skip invalid states (shouldn't happen with our transitions)
        if dp[mask] == -1:
            continue

        # Count how many students have been assigned so far
        # This equals the number of 1 bits in mask
        k = bin(mask).count('1')

        # If we've assigned all mentors, continue to next state
        if k == m:
            continue

        # Try assigning each available mentor to student k
        for j in range(m):
            # Check if mentor j is available (bit j is 0 in mask)
            if not (mask & (1 << j)):
                new_mask = mask | (1 << j)
                # Update DP for the new state
                dp[new_mask] = max(dp[new_mask], dp[mask] + score[k][j])

    # Step 4: Return the maximum score when all mentors are assigned
    return dp[(1 << m) - 1]
```

```javascript
// Time: O(m^2 * 2^m) | Space: O(2^m)
function maxCompatibilitySum(students, mentors) {
  const m = students.length;
  const n = students[0].length;

  // Step 1: Precompute compatibility scores for all student-mentor pairs
  // score[i][j] = compatibility between student i and mentor j
  const score = Array(m)
    .fill()
    .map(() => Array(m).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < m; j++) {
      // Count number of matching answers between student i and mentor j
      let matches = 0;
      for (let k = 0; k < n; k++) {
        if (students[i][k] === mentors[j][k]) {
          matches++;
        }
      }
      score[i][j] = matches;
    }
  }

  // Step 2: Initialize DP array
  // dp[mask] = max score when we've assigned mentors represented by 'mask'
  // to the first k students, where k = number of 1 bits in mask
  const dp = Array(1 << m).fill(-1);
  dp[0] = 0; // Base case: no mentors assigned yet

  // Helper function to count bits in a number
  function countBits(num) {
    let count = 0;
    while (num > 0) {
      count += num & 1;
      num >>= 1;
    }
    return count;
  }

  // Step 3: Iterate through all possible mask states
  for (let mask = 0; mask < 1 << m; mask++) {
    // Skip invalid states (shouldn't happen with our transitions)
    if (dp[mask] === -1) continue;

    // Count how many students have been assigned so far
    // This equals the number of 1 bits in mask
    const k = countBits(mask);

    // If we've assigned all mentors, continue to next state
    if (k === m) continue;

    // Try assigning each available mentor to student k
    for (let j = 0; j < m; j++) {
      // Check if mentor j is available (bit j is 0 in mask)
      if (!(mask & (1 << j))) {
        const newMask = mask | (1 << j);
        // Update DP for the new state
        dp[newMask] = Math.max(dp[newMask], dp[mask] + score[k][j]);
      }
    }
  }

  // Step 4: Return the maximum score when all mentors are assigned
  return dp[(1 << m) - 1];
}
```

```java
// Time: O(m^2 * 2^m) | Space: O(2^m)
class Solution {
    public int maxCompatibilitySum(int[][] students, int[][] mentors) {
        int m = students.length;
        int n = students[0].length;

        // Step 1: Precompute compatibility scores for all student-mentor pairs
        // score[i][j] = compatibility between student i and mentor j
        int[][] score = new int[m][m];
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < m; j++) {
                // Count number of matching answers between student i and mentor j
                int matches = 0;
                for (int k = 0; k < n; k++) {
                    if (students[i][k] == mentors[j][k]) {
                        matches++;
                    }
                }
                score[i][j] = matches;
            }
        }

        // Step 2: Initialize DP array
        // dp[mask] = max score when we've assigned mentors represented by 'mask'
        // to the first k students, where k = number of 1 bits in mask
        int[] dp = new int[1 << m];
        Arrays.fill(dp, -1);
        dp[0] = 0;  // Base case: no mentors assigned yet

        // Step 3: Iterate through all possible mask states
        for (int mask = 0; mask < (1 << m); mask++) {
            // Skip invalid states (shouldn't happen with our transitions)
            if (dp[mask] == -1) continue;

            // Count how many students have been assigned so far
            // This equals the number of 1 bits in mask
            int k = Integer.bitCount(mask);

            // If we've assigned all mentors, continue to next state
            if (k == m) continue;

            // Try assigning each available mentor to student k
            for (int j = 0; j < m; j++) {
                // Check if mentor j is available (bit j is 0 in mask)
                if ((mask & (1 << j)) == 0) {
                    int newMask = mask | (1 << j);
                    // Update DP for the new state
                    dp[newMask] = Math.max(dp[newMask], dp[mask] + score[k][j]);
                }
            }
        }

        // Step 4: Return the maximum score when all mentors are assigned
        return dp[(1 << m) - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m² × 2^m + m² × n)**

- Precomputing scores: O(m² × n) - For each of m² student-mentor pairs, we compare n answers
- DP transitions: O(m × 2^m × m) = O(m² × 2^m) - We iterate through 2^m states, and for each state, we try up to m available mentors
- Since m ≤ 8, 2^m ≤ 256, and m² ≤ 64, this is very efficient

**Space Complexity: O(2^m + m²)**

- DP array: O(2^m) to store scores for all mask states
- Score matrix: O(m²) to store precomputed compatibility scores
- The space is dominated by O(2^m) since m² is much smaller than 2^m for m > 4

## Common Mistakes

1. **Not precomputing compatibility scores**: Recalculating scores for each DP transition leads to O(m² × n × 2^m) time instead of O(m² × 2^m + m² × n). This can be significantly slower.

2. **Incorrect bitmask interpretation**: Confusing whether bit j = 1 means mentor j is available or assigned. Be consistent: 0 = available, 1 = assigned is the standard convention.

3. **Forgetting that k = countBits(mask)**: The number of assigned mentors equals the number of students assigned so far. This is crucial for knowing which student we're currently assigning.

4. **Not handling all mask states**: Some candidates only consider masks in increasing order of bit count, but we need to process all masks from 0 to (1<<m)-1 to ensure we consider all assignment orders.

5. **Integer overflow with bit operations**: When m=8, (1 << 8) = 256 fits in standard integers, but for larger m, be mindful of using appropriate integer types.

## When You'll See This Pattern

This bitmask DP pattern appears in several assignment/permutation optimization problems:

1. **Assigning tasks to workers** (LeetCode 1947 is essentially this problem)
2. **Maximum performance of a team** (LeetCode 1383) - Similar bitmask DP for selecting workers
3. **Minimum number of work sessions to finish tasks** (LeetCode 1986) - Bitmask DP to partition tasks into sessions
4. **Campus Bikes II** (LeetCode 1066) - Almost identical problem with workers and bikes instead of students and mentors

The pattern is: "Given two sets of equal size, find the optimal one-to-one pairing to maximize/minimize some score." When constraints are small (n ≤ 12-20), bitmask DP is often the solution.

## Key Takeaways

1. **Bitmask DP is perfect for assignment problems** with small n (≤ 20). The mask represents which items from one set have been assigned/used.

2. **The number of set bits in the mask often has meaning** - in this case, it tells us how many students have been assigned so far, which determines which student we're currently pairing.

3. **Always precompute pairwise scores** when they're needed repeatedly in DP transitions. This transforms O(n) operations inside the DP loop to O(1) lookups.

4. **The state transition is typically**: For current state `mask`, try all available items `j`, transition to `mask | (1 << j)` with cost/score `dp[mask] + cost[k][j]`, where `k = countBits(mask)`.

[Practice this problem on CodeJeet](/problem/maximum-compatibility-score-sum)
