---
title: "How to Solve Maximum Number of Tasks You Can Assign — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Number of Tasks You Can Assign. Hard difficulty, 50.2% acceptance rate. Topics: Array, Two Pointers, Binary Search, Greedy, Queue."
date: "2027-09-26"
category: "dsa-patterns"
tags: ["maximum-number-of-tasks-you-can-assign", "array", "two-pointers", "binary-search", "hard"]
---

# How to Solve Maximum Number of Tasks You Can Assign

You’re given `n` tasks and `m` workers, each with a strength value. Tasks have a strength requirement, and workers can be assigned to tasks only if their strength meets or exceeds the task’s requirement. Additionally, you have `pills` that can temporarily boost a worker’s strength by `strength`. A worker can take at most one pill, and a pill can be used at most once. The goal is to assign the **maximum number of tasks** possible. What makes this problem tricky is the interaction between three constraints: matching strengths, limited pills, and the need to maximize assignments—this isn’t a simple greedy matching problem.

## Visual Walkthrough

Let’s walk through a small example to build intuition:

**Input:**

```
tasks = [3, 2, 1]
workers = [0, 3, 3]
pills = 1
strength = 1
```

We want to assign as many tasks as possible. First, sort both arrays:

- Sorted tasks: `[1, 2, 3]`
- Sorted workers: `[0, 3, 3]`

Now, suppose we try to assign `k` tasks. Let’s test if we can assign `k = 2` tasks.

We need to match the 2 hardest tasks (`[2, 3]`) to 2 workers. We’ll use a greedy approach from hardest task to weakest worker:

1. **Task 3** → Look for a worker who can handle it without a pill. Worker `3` can handle it. Assign worker `3` to task `3`. Workers left: `[0, 3]`.
2. **Task 2** → Remaining workers: `[0, 3]`. Worker `3` can handle it without a pill. Assign worker `3` to task `2`. All tasks assigned.

So `k = 2` is possible. Can we assign all 3 tasks? Let’s test `k = 3`:

We need to match tasks `[1, 2, 3]` to 3 workers:

1. **Task 3** → Worker `3` can handle it. Assign worker `3` to task `3`. Workers left: `[0, 3]`.
2. **Task 2** → Worker `3` can handle it. Assign worker `3` to task `2`. Workers left: `[0]`.
3. **Task 1** → Remaining worker `0` cannot handle it. Can we use a pill? Worker `0` + pill strength `1` = strength `1`, which equals task `1`. Yes! Use one pill. Assign worker `0` to task `1`.

All 3 tasks assigned with 1 pill. So the maximum is **3**.

This walkthrough reveals the core challenge: for a given `k`, we must check if we can match the `k` hardest tasks to `k` workers, possibly using pills. The greedy matching needs careful worker selection—pills are a limited resource.

## Brute Force Approach

A brute force approach would try all possible assignments of tasks to workers, considering pill usage. For each worker, we could decide whether to give them a pill or not, and then match tasks. This leads to checking all permutations of assignments.

**Why it fails:**

- There are `n` tasks and `m` workers. The number of possible assignments grows factorially.
- Even for small constraints (tasks and workers up to 5×10⁴), brute force is impossible.
- We need an efficient way to determine the maximum `k` without enumerating assignments.

The brute force teaches us that we need a way to **test feasibility** for a given `k` efficiently, then search for the maximum `k` using binary search.

## Optimized Approach

The key insight is to use **binary search** on the answer `k` (the number of tasks we can assign). Why binary search? Because if we can assign `k` tasks, we can certainly assign fewer than `k` (by simply not using some assignments). This monotonic property allows binary search.

For a given `k`, we need a **feasibility check**: can we assign the `k` hardest tasks to `k` workers (any order) with at most `pills` pills available?

**Feasibility check algorithm:**

1. Select the `k` hardest tasks and `k` strongest workers (since stronger workers are more versatile).
2. Use a greedy matching from hardest task to weakest available worker:
   - If the current worker can do the task without a pill, assign them.
   - Otherwise, try to find the weakest worker who can do the task with a pill. Why the weakest? Because we want to save stronger workers for harder tasks.
3. To efficiently find the weakest worker who can do the task with a pill, we can use a sorted data structure (like a deque or multiset) to maintain available workers.

**Steps for checking feasibility(k):**

- Let `task_ptr = k-1` (start from hardest task).
- Use a deque `available_workers` to store workers who haven’t been assigned yet.
- Iterate from strongest to weakest worker:
  - If this worker can do the current task without a pill, assign them to the task (pop from deque if they were added earlier).
  - Otherwise, add this worker to the deque (they might use a pill later).
- After processing all workers, check the deque: for each remaining task, see if the weakest worker in the deque can do it with a pill. If yes, use a pill and assign; if not, return false.
- If we run out of pills, return false.

This greedy matching ensures we use pills only when necessary and always on the weakest capable worker.

## Optimal Solution

We implement binary search over `k` from `0` to `min(n, m)`. For each `k`, we run the feasibility check using the greedy algorithm with a deque.

<div class="code-group">

```python
# Time: O(n log n + m log m + log(min(n,m)) * (n + m)) | Space: O(n + m)
def maxTaskAssign(tasks, workers, pills, strength):
    # Sort tasks and workers
    tasks.sort()
    workers.sort()

    n, m = len(tasks), len(workers)

    # Helper function to check if we can assign k tasks
    def can_assign(k):
        # Deque to store workers that might need pills
        from collections import deque
        dq = deque()

        # Start from the strongest worker and hardest task
        worker_idx = m - 1

        # Try to assign the k hardest tasks
        for task_idx in range(k - 1, -1, -1):
            current_task = tasks[task_idx]

            # Add all workers that are at least as strong as the current task (without pill)
            while worker_idx >= m - k and workers[worker_idx] >= current_task:
                dq.appendleft(workers[worker_idx])
                worker_idx -= 1

            # If there's a worker who can do the task without pill, assign them
            if dq and dq[-1] >= current_task:
                dq.pop()
            else:
                # Otherwise, try to use a pill on the weakest available worker
                if not dq:
                    return False
                # Check if weakest worker can do the task with pill
                if dq[0] + strength >= current_task:
                    dq.popleft()
                    pills_needed[0] += 1
                    if pills_needed[0] > pills:
                        return False
                else:
                    return False
        return True

    # Binary search for the maximum k
    left, right = 0, min(n, m)
    pills_needed = [0]  # Use list to allow modification in nested function

    while left <= right:
        mid = (left + right) // 2
        pills_needed[0] = 0
        if can_assign(mid):
            left = mid + 1
        else:
            right = mid - 1

    return right
```

```javascript
// Time: O(n log n + m log m + log(min(n,m)) * (n + m)) | Space: O(n + m)
function maxTaskAssign(tasks, workers, pills, strength) {
  // Sort tasks and workers
  tasks.sort((a, b) => a - b);
  workers.sort((a, b) => a - b);

  const n = tasks.length,
    m = workers.length;

  // Helper function to check if we can assign k tasks
  function canAssign(k) {
    // Deque simulation using array
    const dq = [];
    let workerIdx = m - 1;
    let pillsUsed = 0;

    // Try to assign the k hardest tasks
    for (let taskIdx = k - 1; taskIdx >= 0; taskIdx--) {
      const currentTask = tasks[taskIdx];

      // Add workers that can handle the task without pill
      while (workerIdx >= m - k && workers[workerIdx] >= currentTask) {
        dq.unshift(workers[workerIdx]);
        workerIdx--;
      }

      // If a worker can do it without pill, assign them
      if (dq.length > 0 && dq[dq.length - 1] >= currentTask) {
        dq.pop();
      } else {
        // Otherwise try to use a pill on the weakest worker
        if (dq.length === 0) return false;
        if (dq[0] + strength >= currentTask) {
          dq.shift();
          pillsUsed++;
          if (pillsUsed > pills) return false;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  // Binary search for maximum k
  let left = 0,
    right = Math.min(n, m);
  let answer = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (canAssign(mid)) {
      answer = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return answer;
}
```

```java
// Time: O(n log n + m log m + log(min(n,m)) * (n + m)) | Space: O(n + m)
import java.util.*;

class Solution {
    public int maxTaskAssign(int[] tasks, int[] workers, int pills, int strength) {
        // Sort tasks and workers
        Arrays.sort(tasks);
        Arrays.sort(workers);

        int n = tasks.length, m = workers.length;

        // Helper function to check if we can assign k tasks
        // Using array as parameter to track pills used
        int[] pillsUsed = new int[1];

        // Binary search for maximum k
        int left = 0, right = Math.min(n, m);
        int answer = 0;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            pillsUsed[0] = 0;

            if (canAssign(mid, tasks, workers, pills, strength, pillsUsed)) {
                answer = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return answer;
    }

    private boolean canAssign(int k, int[] tasks, int[] workers, int pills, int strength, int[] pillsUsed) {
        // Deque to store workers that might need pills
        Deque<Integer> dq = new ArrayDeque<>();

        // Start from strongest worker and hardest task
        int workerIdx = workers.length - 1;

        // Try to assign the k hardest tasks
        for (int taskIdx = k - 1; taskIdx >= 0; taskIdx--) {
            int currentTask = tasks[taskIdx];

            // Add workers that can handle the task without pill
            while (workerIdx >= workers.length - k && workers[workerIdx] >= currentTask) {
                dq.addFirst(workers[workerIdx]);
                workerIdx--;
            }

            // If a worker can do it without pill, assign them
            if (!dq.isEmpty() && dq.getLast() >= currentTask) {
                dq.removeLast();
            } else {
                // Otherwise try to use a pill on the weakest worker
                if (dq.isEmpty()) return false;
                if (dq.getFirst() + strength >= currentTask) {
                    dq.removeFirst();
                    pillsUsed[0]++;
                    if (pillsUsed[0] > pills) return false;
                } else {
                    return false;
                }
            }
        }
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting tasks and workers: `O(n log n + m log m)`
- Binary search runs `O(log(min(n, m)))` times
- Each feasibility check processes at most `k` tasks and `k` workers: `O(k) = O(min(n, m))`
- Total: `O(n log n + m log m + log(min(n, m)) * min(n, m))`

**Space Complexity:**

- Sorting uses `O(log n + log m)` space for the algorithm's stack (in languages using Timsort).
- The deque stores at most `k` workers: `O(min(n, m))`
- Total: `O(min(n, m))` for the deque plus sorting overhead.

## Common Mistakes

1. **Not sorting both arrays first** – The greedy matching relies on processing tasks and workers in sorted order. Attempting to match without sorting leads to incorrect assignments.

2. **Incorrect greedy strategy for pill usage** – Assigning pills to the first available worker rather than the weakest capable worker wastes stronger workers. Always use pills on the weakest worker who can handle the task with the boost.

3. **Off-by-one errors in binary search bounds** – The search range should be `[0, min(n, m)]`. Forgetting to handle the case where `k = 0` is possible can cause infinite loops.

4. **Forgetting to reset pill count for each feasibility check** – Each binary search iteration tests a new `k`, so the pill counter must be reset. Using a global counter without resetting gives wrong results.

## When You'll See This Pattern

This problem combines **binary search on answer** with **greedy feasibility checking**, a pattern common in "maximum assignment" problems with constraints:

1. **Most Profit Assigning Work** – Assign workers to jobs for maximum profit. Similar greedy matching but without the pill constraint.
2. **Maximum Running Time of N Computers** – Binary search on the maximum running time, with greedy checking if batteries can support it.
3. **Maximum Number of Robots Within Budget** – Binary search on the number of robots, with a sliding window check for cost constraints.

These problems all share the structure: "Find the maximum X such that condition Y holds," where checking the condition requires a clever greedy or two-pointer approach.

## Key Takeaways

- **When you need to maximize a count under constraints, consider binary search on the answer** – If "can we achieve k?" is easier to answer than "what's the maximum k?", binary search transforms the problem.
- **Greedy matching often pairs strongest with hardest** – For assignment problems, sorting and matching from hardest to easiest (or vice versa) is a common strategy.
- **Use the right data structure for efficient lookups** – A deque or sorted set helps quickly find the weakest worker who can handle a task with a pill.

**Related problems:** [Most Profit Assigning Work](/problem/most-profit-assigning-work), [Maximum Running Time of N Computers](/problem/maximum-running-time-of-n-computers), [Maximum Number of Robots Within Budget](/problem/maximum-number-of-robots-within-budget)
