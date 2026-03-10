---
title: "How to Solve Most Profit Assigning Work — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Most Profit Assigning Work. Medium difficulty, 56.1% acceptance rate. Topics: Array, Two Pointers, Binary Search, Greedy, Sorting."
date: "2028-05-28"
category: "dsa-patterns"
tags: ["most-profit-assigning-work", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Most Profit Assigning Work

You're given jobs with difficulty/profit pairs and workers with ability levels. Each worker can complete any job where their ability is at least the job's difficulty, and you want to assign each worker to at most one job to maximize total profit. The tricky part is that higher difficulty doesn't always mean higher profit, so you can't just match each worker to the hardest job they can do.

## Visual Walkthrough

Let's trace through a concrete example:

**Input:**

- difficulty = [2, 4, 6, 8, 10]
- profit = [10, 20, 30, 40, 50]
- worker = [4, 5, 6, 7]

**Step 1: Pair jobs**
First, we combine difficulty and profit into job pairs:
[(2,10), (4,20), (6,30), (8,40), (10,50)]

**Step 2: Sort jobs by difficulty**
They're already sorted: [(2,10), (4,20), (6,30), (8,40), (10,50)]

**Step 3: Create "best up to" array**
For each job, track the maximum profit achievable at or below that difficulty:

- At difficulty 2: max profit = 10
- At difficulty 4: max profit = max(10, 20) = 20
- At difficulty 6: max profit = max(20, 30) = 30
- At difficulty 8: max profit = max(30, 40) = 40
- At difficulty 10: max profit = max(40, 50) = 50

So best_profit = [10, 20, 30, 40, 50]

**Step 4: Process each worker**

- Worker ability 4: Can do jobs with difficulty ≤ 4. Best profit = 20
- Worker ability 5: Can do jobs with difficulty ≤ 5. Best profit = 20 (from difficulty 4)
- Worker ability 6: Can do jobs with difficulty ≤ 6. Best profit = 30
- Worker ability 7: Can do jobs with difficulty ≤ 7. Best profit = 30 (from difficulty 6)

**Total profit:** 20 + 20 + 30 + 30 = 100

## Brute Force Approach

The most straightforward approach is: for each worker, scan through all jobs to find the one with maximum profit that has difficulty ≤ worker's ability.

**Why this is inefficient:**

- For each of `m` workers, we check all `n` jobs
- Time complexity: O(m × n)
- With n, m up to 10^4, this could be 10^8 operations, which is too slow

**What a naive candidate might miss:**
They might think to sort workers by ability and jobs by difficulty, but still need to handle the fact that higher difficulty doesn't guarantee higher profit. Without the "best up to" preprocessing, they'd still need to scan backwards for each worker.

## Optimized Approach

The key insight is that we need to know, for any given ability level, what's the maximum profit achievable from jobs with difficulty ≤ that ability. This requires two steps:

1. **Sort jobs by difficulty** so we can efficiently find which jobs a worker can do
2. **Precompute maximum profit up to each difficulty** because a harder job might pay less than an easier one
3. **Use binary search** to quickly find the right job for each worker

**Why this works:**

- After sorting and preprocessing, for any ability `a`, we can binary search to find the last job with difficulty ≤ `a`
- The precomputed "best up to" array tells us the maximum profit achievable at that point
- Each worker's assignment becomes O(log n) instead of O(n)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n + m log n) where n = jobs, m = workers
# Space: O(n) for storing sorted jobs and best_profit array
def maxProfitAssignment(difficulty, profit, worker):
    """
    Calculate maximum total profit by assigning each worker to at most one job.

    Steps:
    1. Combine difficulty and profit into job pairs
    2. Sort jobs by difficulty
    3. Create array of best profit achievable up to each difficulty
    4. For each worker, binary search to find best job they can do
    """
    # Step 1: Create job pairs (difficulty, profit)
    jobs = list(zip(difficulty, profit))

    # Step 2: Sort jobs by difficulty
    jobs.sort(key=lambda x: x[0])

    # Step 3: Precompute best profit up to each difficulty
    n = len(jobs)
    best_profit = [0] * n

    # First job: best profit is just its profit
    best_profit[0] = jobs[0][1]

    # For each subsequent job, track maximum profit seen so far
    for i in range(1, n):
        # Current best is max of previous best and current job's profit
        best_profit[i] = max(best_profit[i-1], jobs[i][1])

    total_profit = 0

    # Step 4: Process each worker
    for ability in worker:
        # Binary search to find rightmost job with difficulty <= ability
        left, right = 0, n - 1
        best_index = -1  # -1 means no job found

        while left <= right:
            mid = (left + right) // 2

            if jobs[mid][0] <= ability:
                # This job is possible, try to find a harder one
                best_index = mid
                left = mid + 1
            else:
                # Job too hard, look for easier ones
                right = mid - 1

        # If we found a suitable job, add its best profit
        if best_index != -1:
            total_profit += best_profit[best_index]

    return total_profit
```

```javascript
// Time: O(n log n + m log n) where n = jobs, m = workers
// Space: O(n) for storing sorted jobs and bestProfit array
function maxProfitAssignment(difficulty, profit, worker) {
  /**
   * Calculate maximum total profit by assigning each worker to at most one job.
   *
   * Steps:
   * 1. Combine difficulty and profit into job pairs
   * 2. Sort jobs by difficulty
   * 3. Create array of best profit achievable up to each difficulty
   * 4. For each worker, binary search to find best job they can do
   */

  // Step 1: Create job pairs [difficulty, profit]
  const jobs = [];
  for (let i = 0; i < difficulty.length; i++) {
    jobs.push([difficulty[i], profit[i]]);
  }

  // Step 2: Sort jobs by difficulty
  jobs.sort((a, b) => a[0] - b[0]);

  // Step 3: Precompute best profit up to each difficulty
  const n = jobs.length;
  const bestProfit = new Array(n);

  // First job: best profit is just its profit
  bestProfit[0] = jobs[0][1];

  // For each subsequent job, track maximum profit seen so far
  for (let i = 1; i < n; i++) {
    // Current best is max of previous best and current job's profit
    bestProfit[i] = Math.max(bestProfit[i - 1], jobs[i][1]);
  }

  let totalProfit = 0;

  // Step 4: Process each worker
  for (const ability of worker) {
    // Binary search to find rightmost job with difficulty <= ability
    let left = 0,
      right = n - 1;
    let bestIndex = -1; // -1 means no job found

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (jobs[mid][0] <= ability) {
        // This job is possible, try to find a harder one
        bestIndex = mid;
        left = mid + 1;
      } else {
        // Job too hard, look for easier ones
        right = mid - 1;
      }
    }

    // If we found a suitable job, add its best profit
    if (bestIndex !== -1) {
      totalProfit += bestProfit[bestIndex];
    }
  }

  return totalProfit;
}
```

```java
// Time: O(n log n + m log n) where n = jobs, m = workers
// Space: O(n) for storing sorted jobs and bestProfit array
class Solution {
    public int maxProfitAssignment(int[] difficulty, int[] profit, int[] worker) {
        /**
         * Calculate maximum total profit by assigning each worker to at most one job.
         *
         * Steps:
         * 1. Combine difficulty and profit into job pairs
         * 2. Sort jobs by difficulty
         * 3. Create array of best profit achievable up to each difficulty
         * 4. For each worker, binary search to find best job they can do
         */

        // Step 1: Create job pairs
        int n = difficulty.length;
        int[][] jobs = new int[n][2];
        for (int i = 0; i < n; i++) {
            jobs[i][0] = difficulty[i];  // difficulty
            jobs[i][1] = profit[i];      // profit
        }

        // Step 2: Sort jobs by difficulty
        Arrays.sort(jobs, (a, b) -> Integer.compare(a[0], b[0]));

        // Step 3: Precompute best profit up to each difficulty
        int[] bestProfit = new int[n];
        bestProfit[0] = jobs[0][1];

        for (int i = 1; i < n; i++) {
            // Current best is max of previous best and current job's profit
            bestProfit[i] = Math.max(bestProfit[i-1], jobs[i][1]);
        }

        int totalProfit = 0;

        // Step 4: Process each worker
        for (int ability : worker) {
            // Binary search to find rightmost job with difficulty <= ability
            int left = 0, right = n - 1;
            int bestIndex = -1;  // -1 means no job found

            while (left <= right) {
                int mid = left + (right - left) / 2;

                if (jobs[mid][0] <= ability) {
                    // This job is possible, try to find a harder one
                    bestIndex = mid;
                    left = mid + 1;
                } else {
                    // Job too hard, look for easier ones
                    right = mid - 1;
                }
            }

            // If we found a suitable job, add its best profit
            if (bestIndex != -1) {
                totalProfit += bestProfit[bestIndex];
            }
        }

        return totalProfit;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n + m log n)**

- Sorting `n` jobs: O(n log n)
- Precomputing best profit array: O(n)
- For each of `m` workers, binary search on jobs: O(m log n)
- Total: O(n log n + m log n)

**Space Complexity: O(n)**

- Storing sorted job pairs: O(n)
- Best profit array: O(n)
- Other variables: O(1)
- Total: O(n)

## Common Mistakes

1. **Forgetting that higher difficulty ≠ higher profit**
   - Mistake: Assuming you can just take the hardest job a worker can do
   - Fix: Always precompute maximum profit up to each difficulty level

2. **Incorrect binary search bounds**
   - Mistake: Using `left < right` instead of `left <= right`, missing edge cases
   - Fix: Use `left <= right` and carefully update bounds based on comparison

3. **Not handling workers who can't do any job**
   - Mistake: Assuming every worker can do at least one job
   - Fix: Check if `bestIndex != -1` before adding profit

4. **Sorting only by difficulty without considering profit**
   - Mistake: Sorting jobs but not updating profit values to be cumulative maximum
   - Fix: After sorting by difficulty, create a "best up to" array

## When You'll See This Pattern

This problem combines **sorting + binary search + prefix maximum**, a pattern that appears in many matching problems:

1. **Maximum Number of Tasks You Can Assign (Hard)**
   - Similar: Match workers to tasks with difficulty constraints
   - Difference: Additional constraints on pills and strength

2. **Successful Pairs of Spells and Potions (Medium)**
   - Similar: For each spell, find how many potions are strong enough
   - Difference: Counting pairs instead of maximizing sum

3. **Maximum Matching of Players With Trainers (Medium)**
   - Similar: Match players to trainers based on ability
   - Difference: One-to-one matching with greedy two-pointer approach

## Key Takeaways

1. **When matching based on thresholds**, sort by the constraint and use binary search to find valid matches efficiently.

2. **Prefix maximum is crucial** when optimal value isn't monotonic with the sorting key—always track the best value seen so far.

3. **The combination of sorting + binary search + preprocessing** solves many "matching with constraints" problems in O(n log n) time.

Related problems: [Maximum Number of Tasks You Can Assign](/problem/maximum-number-of-tasks-you-can-assign), [Successful Pairs of Spells and Potions](/problem/successful-pairs-of-spells-and-potions), [Maximum Matching of Players With Trainers](/problem/maximum-matching-of-players-with-trainers)
