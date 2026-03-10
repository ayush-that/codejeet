---
title: "How to Solve Find Minimum Time to Finish All Jobs — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find Minimum Time to Finish All Jobs. Hard difficulty, 45.4% acceptance rate. Topics: Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask."
date: "2028-10-25"
category: "dsa-patterns"
tags:
  ["find-minimum-time-to-finish-all-jobs", "array", "dynamic-programming", "backtracking", "hard"]
---

# How to Solve Find Minimum Time to Finish All Jobs

You're given `k` workers and an array `jobs` where each job takes a certain time to complete. Each job must be assigned to exactly one worker, and you need to minimize the maximum working time among all workers. This is essentially a load balancing problem where you want to distribute work as evenly as possible. What makes this problem tricky is that it's NP-hard - there's no known polynomial-time solution, so we need clever search techniques to avoid exploring all possible assignments.

## Visual Walkthrough

Let's walk through a small example: `jobs = [3, 2, 3]` with `k = 3` workers.

**Step 1: Understanding the goal**
We have 3 jobs taking 3, 2, and 3 hours respectively. With 3 workers, the optimal assignment is obvious: give each worker one job. The maximum working time would be 3 (from either of the workers with the 3-hour jobs).

**Step 2: A more interesting case**
Now consider `jobs = [3, 2, 3]` with `k = 2` workers. We need to assign these 3 jobs to 2 workers. Let's think about possible assignments:

- Option 1: Worker 1 gets [3, 2] = 5 hours, Worker 2 gets [3] = 3 hours → max = 5
- Option 2: Worker 1 gets [3, 3] = 6 hours, Worker 2 gets [2] = 2 hours → max = 6
- Option 3: Worker 1 gets [2, 3] = 5 hours, Worker 2 gets [3] = 3 hours → max = 5

The best we can do is a maximum of 5 hours. Notice that we want to balance the load - if one worker gets too much, that becomes our bottleneck.

**Step 3: The search challenge**
With `n` jobs and `k` workers, there are `k^n` possible assignments if we assign each job independently. For `n=10` and `k=4`, that's over a million possibilities. We need a smarter way to search.

## Brute Force Approach

The brute force approach would be to try every possible assignment of jobs to workers. For each job, we have `k` choices of which worker gets it, leading to `k^n` possibilities. For each assignment, we calculate the maximum working time and track the minimum.

Why this fails: Even for moderate inputs like `n=12` and `k=4`, we have `4^12 = 16,777,216` possibilities. With `n=20`, we're looking at over a trillion possibilities. This is clearly infeasible.

## Optimized Approach

The key insight is that we can use **backtracking with pruning** and **binary search**:

1. **Binary search on the answer**: Instead of trying to find the minimum maximum time directly, we ask: "Can we assign all jobs such that no worker exceeds time `T`?" We then binary search for the smallest `T` where the answer is "yes".

2. **Backtracking with pruning**: To answer the "can we do it with limit T" question, we use backtracking with several optimizations:
   - Sort jobs in descending order: Try larger jobs first since they're harder to fit
   - Skip duplicate assignments: If two workers have the same current load, don't try assigning to both
   - Early termination: If any worker exceeds `T`, backtrack immediately
   - Prune when `T` is too small: If the sum of all jobs divided by `k` (rounded up) is greater than `T`, we know it's impossible

3. **Why this works**: Binary search reduces the problem from "find minimum T" to "can we do it with T". The backtracking with pruning explores the assignment space much more efficiently than brute force by cutting off hopeless branches early.

## Optimal Solution

Here's the complete solution using backtracking with pruning and binary search:

<div class="code-group">

```python
# Time: O(k^n) worst case but heavily pruned in practice
# Space: O(n) for recursion depth and worker loads array
class Solution:
    def minimumTimeRequired(self, jobs: List[int], k: int) -> int:
        # Sort jobs in descending order - larger jobs first for better pruning
        jobs.sort(reverse=True)

        # Binary search for the minimum possible maximum working time
        left, right = max(jobs), sum(jobs)

        while left < right:
            mid = (left + right) // 2
            # Initialize worker loads to 0
            worker_loads = [0] * k

            # Check if we can assign all jobs with max time <= mid
            if self.can_assign(jobs, worker_loads, 0, mid):
                right = mid  # Try for smaller maximum
            else:
                left = mid + 1  # Need larger maximum

        return left

    def can_assign(self, jobs, worker_loads, job_index, limit):
        # Base case: all jobs assigned
        if job_index == len(jobs):
            return True

        current_job = jobs[job_index]

        # Try assigning current job to each worker
        for i in range(len(worker_loads)):
            # Pruning: if worker can take this job without exceeding limit
            if worker_loads[i] + current_job <= limit:
                worker_loads[i] += current_job

                # Recursively try to assign remaining jobs
                if self.can_assign(jobs, worker_loads, job_index + 1, limit):
                    return True

                # Backtrack: remove job from this worker
                worker_loads[i] -= current_job

            # Additional pruning: if a worker has 0 load, and we couldn't assign
            # the job to them, then assigning to later workers with 0 load
            # would be equivalent (since workers are identical)
            if worker_loads[i] == 0:
                break

        return False
```

```javascript
// Time: O(k^n) worst case but heavily pruned in practice
// Space: O(n) for recursion depth and worker loads array
/**
 * @param {number[]} jobs
 * @param {number} k
 * @return {number}
 */
var minimumTimeRequired = function (jobs, k) {
  // Sort jobs in descending order for better pruning
  jobs.sort((a, b) => b - a);

  // Binary search bounds: minimum possible is max(jobs),
  // maximum possible is sum(jobs)
  let left = Math.max(...jobs);
  let right = jobs.reduce((sum, job) => sum + job, 0);

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const workerLoads = new Array(k).fill(0);

    if (canAssign(jobs, workerLoads, 0, mid)) {
      right = mid; // Try for smaller maximum
    } else {
      left = mid + 1; // Need larger maximum
    }
  }

  return left;
};

/**
 * Check if we can assign all jobs with given limit
 * @param {number[]} jobs - Sorted in descending order
 * @param {number[]} workerLoads - Current loads of workers
 * @param {number} jobIndex - Index of current job to assign
 * @param {number} limit - Maximum allowed load per worker
 * @return {boolean}
 */
function canAssign(jobs, workerLoads, jobIndex, limit) {
  // All jobs assigned successfully
  if (jobIndex === jobs.length) {
    return true;
  }

  const currentJob = jobs[jobIndex];

  // Try assigning current job to each worker
  for (let i = 0; i < workerLoads.length; i++) {
    // Skip if assigning would exceed limit
    if (workerLoads[i] + currentJob <= limit) {
      workerLoads[i] += currentJob;

      // Try to assign remaining jobs
      if (canAssign(jobs, workerLoads, jobIndex + 1, limit)) {
        return true;
      }

      // Backtrack: remove job from this worker
      workerLoads[i] -= currentJob;
    }

    // Pruning: if worker has 0 load and we couldn't assign to them,
    // then assigning to any other worker with 0 load is equivalent
    if (workerLoads[i] === 0) {
      break;
    }
  }

  return false;
}
```

```java
// Time: O(k^n) worst case but heavily pruned in practice
// Space: O(n) for recursion depth and worker loads array
class Solution {
    public int minimumTimeRequired(int[] jobs, int k) {
        // Sort jobs in descending order for better pruning
        Integer[] jobsInteger = Arrays.stream(jobs)
            .boxed()
            .sorted((a, b) -> b - a)
            .toArray(Integer[]::new);

        // Convert back to int array
        int[] jobsDesc = Arrays.stream(jobsInteger)
            .mapToInt(Integer::intValue)
            .toArray();

        // Binary search bounds
        int left = Arrays.stream(jobsDesc).max().getAsInt();
        int right = Arrays.stream(jobsDesc).sum();

        while (left < right) {
            int mid = left + (right - left) / 2;
            int[] workerLoads = new int[k];

            if (canAssign(jobsDesc, workerLoads, 0, mid)) {
                right = mid;  // Try for smaller maximum
            } else {
                left = mid + 1;  // Need larger maximum
            }
        }

        return left;
    }

    private boolean canAssign(int[] jobs, int[] workerLoads, int jobIndex, int limit) {
        // All jobs assigned successfully
        if (jobIndex == jobs.length) {
            return true;
        }

        int currentJob = jobs[jobIndex];

        // Try assigning current job to each worker
        for (int i = 0; i < workerLoads.length; i++) {
            // Skip if assigning would exceed limit
            if (workerLoads[i] + currentJob <= limit) {
                workerLoads[i] += currentJob;

                // Try to assign remaining jobs
                if (canAssign(jobs, workerLoads, jobIndex + 1, limit)) {
                    return true;
                }

                // Backtrack: remove job from this worker
                workerLoads[i] -= currentJob;
            }

            // Pruning: if worker has 0 load and we couldn't assign to them,
            // then assigning to any other worker with 0 load is equivalent
            if (workerLoads[i] == 0) {
                break;
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**:

- Worst case: O(k^n) where n is number of jobs and k is number of workers
- In practice, with pruning (sorting jobs descending, skipping equivalent workers, early termination), it's much faster
- Binary search adds O(log(S)) factor where S is sum of all jobs

**Space Complexity**:

- O(n) for the recursion call stack (depth of n)
- O(k) for the worker loads array
- Total: O(n + k) which simplifies to O(n) since k ≤ n

The key insight is that while the worst-case complexity looks bad, the pruning strategies make it practical for the constraints typically seen in coding interviews (n ≤ 12 or similar).

## Common Mistakes

1. **Not sorting jobs in descending order**: Trying smaller jobs first leads to much less effective pruning. Larger jobs are harder to fit, so trying them early helps identify impossible assignments sooner.

2. **Missing the "skip duplicate workers" pruning**: If worker i has load 0 and we couldn't assign a job to them, then worker j with load 0 would be in the same situation. Without this break statement, you'll explore many equivalent states.

3. **Incorrect binary search bounds**:
   - Lower bound should be `max(jobs)`, not 0 or 1 (one worker must take at least the largest job)
   - Upper bound should be `sum(jobs)`, not an arbitrary large number

4. **Forgetting to backtrack**: When the recursive call returns, you must undo the assignment (subtract the job from the worker's load). This is a classic backtracking pattern that's easy to forget.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Binary search on answer**: Used when you can transform "find minimum X" into "can we do it with X?" Other problems using this pattern:
   - **Capacity To Ship Packages Within D Days**: Find minimum ship capacity to deliver all packages in D days
   - **Split Array Largest Sum**: Minimize the largest sum among m subarrays

2. **Backtracking with pruning**: Used for NP-hard assignment problems. Similar problems:
   - **Partition to K Equal Sum Subsets**: Assign numbers to k subsets with equal sums
   - **Matchsticks to Square**: Assign matchsticks to 4 sides of a square

3. **Load balancing/partition problems**: Any problem where you need to distribute items as evenly as possible.

## Key Takeaways

1. **When you see "minimize the maximum"**, consider binary search on the answer. Transform the problem into a decision problem: "Can we achieve this maximum value?"

2. **For NP-hard assignment problems**, backtracking with intelligent pruning is often the best approach. Key pruning strategies include:
   - Sort items by size (largest first)
   - Skip equivalent states
   - Use early termination when constraints are violated

3. **Always validate your bounds** for binary search. Think about the absolute minimum and maximum possible answers based on problem constraints.

Related problems: [Minimum Number of Work Sessions to Finish the Tasks](/problem/minimum-number-of-work-sessions-to-finish-the-tasks), [Find Minimum Time to Finish All Jobs II](/problem/find-minimum-time-to-finish-all-jobs-ii)
