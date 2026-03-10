---
title: "How to Solve Minimum Processing Time — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Processing Time. Medium difficulty, 70.2% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2028-09-23"
category: "dsa-patterns"
tags: ["minimum-processing-time", "array", "greedy", "sorting", "medium"]
---

# How to Solve Minimum Processing Time

This problem asks us to minimize the total processing time when assigning tasks to processors with multiple cores. The tricky part is that each processor has 4 cores, and we need to strategically pair tasks with processors to minimize the overall completion time. The key insight is that we want to match the fastest processors with the longest tasks to minimize the maximum completion time across all processors.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

- `processorTime = [8, 10]` (2 processors)
- `tasks = [2, 2, 3, 1, 8, 7, 4, 5]` (8 tasks = 4 × 2 processors)

**Step 1: Sort the arrays**

- Sort processors in ascending order: `[8, 10]`
- Sort tasks in ascending order: `[1, 2, 2, 3, 4, 5, 7, 8]`

**Step 2: Assign tasks to processors**
Each processor gets 4 tasks. To minimize the maximum completion time, we assign the longest tasks to the fastest processors.

Processor 1 (time = 8) gets tasks: `[8, 7, 5, 4]` (largest 4 tasks)
Processor 2 (time = 10) gets tasks: `[3, 2, 2, 1]` (smallest 4 tasks)

**Step 3: Calculate completion times**

- Processor 1: `8 + 8 = 16` (max of 8+8, 8+7, 8+5, 8+4)
- Processor 2: `10 + 3 = 13` (max of 10+3, 10+2, 10+2, 10+1)

**Step 4: Find the maximum**
Maximum completion time = `max(16, 13) = 16`

The optimal assignment gives us a minimum maximum completion time of 16.

## Brute Force Approach

A brute force approach would try all possible assignments of tasks to cores. Since each processor has 4 cores and there are `n` processors, we have `4n` tasks total. We would need to:

1. Generate all permutations of task assignments
2. Group tasks into sets of 4 for each processor
3. Calculate the maximum completion time for each assignment
4. Track the minimum of these maximums

The complexity would be factorial in the number of tasks, which is completely infeasible even for small inputs. For 8 tasks, that's 8! = 40,320 permutations. For 16 tasks, it's 16! ≈ 20 trillion permutations.

Even a more reasonable brute force that only considers which tasks go to which processor (not which specific core) would still be exponential. We need a smarter approach.

## Optimized Approach

The key insight is that we want to minimize the maximum of `processorTime[i] + taskTime[j]` across all assignments. This is similar to minimizing the maximum sum when pairing two sets of numbers.

**Why sorting works:**

1. Each processor's completion time is determined by its own start time plus the **maximum** of its 4 assigned tasks
2. To minimize the overall maximum, we want to avoid pairing a slow processor with a long task
3. By sorting processors in ascending order and tasks in descending order, we pair the fastest processors with the longest tasks
4. This ensures that no processor gets stuck with both a late start time AND a long task

**Step-by-step reasoning:**

1. Sort `processorTime` in ascending order (fastest processors first)
2. Sort `tasks` in ascending order (for easier access to largest tasks)
3. For each processor (starting from the fastest), assign it the 4 largest remaining tasks
4. Calculate `processorTime[i] + max(assigned_tasks)` for each processor
5. Track the maximum of these sums - this is our answer

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) excluding input storage
def minProcessingTime(processorTime, tasks):
    """
    Calculate the minimum possible maximum processing time.

    Args:
        processorTime: List of processor start times
        tasks: List of task durations

    Returns:
        Minimum possible maximum completion time
    """
    # Step 1: Sort processors in ascending order (fastest first)
    processorTime.sort()

    # Step 2: Sort tasks in ascending order
    tasks.sort()

    # Initialize result to track the maximum completion time
    result = 0

    # Step 3: Assign tasks to processors
    # We have n processors, each gets 4 tasks
    n = len(processorTime)

    # For each processor (starting from fastest)
    for i in range(n):
        # Calculate the index of the last task assigned to this processor
        # Since tasks are sorted ascending, the largest tasks are at the end
        # Processor i gets tasks at indices: 4*(n-i)-1, 4*(n-i)-2, 4*(n-i)-3, 4*(n-i)-4
        # The maximum task time for this processor is at index 4*(n-i)-1
        task_index = 4 * (n - i) - 1

        # Step 4: Calculate completion time for this processor
        # Completion time = processor start time + longest assigned task
        completion_time = processorTime[i] + tasks[task_index]

        # Step 5: Update overall maximum
        result = max(result, completion_time)

    return result
```

```javascript
// Time: O(n log n) | Space: O(1) excluding input storage
/**
 * Calculate the minimum possible maximum processing time.
 *
 * @param {number[]} processorTime - Array of processor start times
 * @param {number[]} tasks - Array of task durations
 * @return {number} Minimum possible maximum completion time
 */
function minProcessingTime(processorTime, tasks) {
  // Step 1: Sort processors in ascending order (fastest first)
  processorTime.sort((a, b) => a - b);

  // Step 2: Sort tasks in ascending order
  tasks.sort((a, b) => a - b);

  // Initialize result to track the maximum completion time
  let result = 0;

  // Step 3: Assign tasks to processors
  // We have n processors, each gets 4 tasks
  const n = processorTime.length;

  // For each processor (starting from fastest)
  for (let i = 0; i < n; i++) {
    // Calculate the index of the last task assigned to this processor
    // Since tasks are sorted ascending, the largest tasks are at the end
    // Processor i gets tasks at indices: 4*(n-i)-1, 4*(n-i)-2, 4*(n-i)-3, 4*(n-i)-4
    // The maximum task time for this processor is at index 4*(n-i)-1
    const taskIndex = 4 * (n - i) - 1;

    // Step 4: Calculate completion time for this processor
    // Completion time = processor start time + longest assigned task
    const completionTime = processorTime[i] + tasks[taskIndex];

    // Step 5: Update overall maximum
    result = Math.max(result, completionTime);
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(1) excluding input storage
import java.util.Arrays;

class Solution {
    /**
     * Calculate the minimum possible maximum processing time.
     *
     * @param processorTime Array of processor start times
     * @param tasks Array of task durations
     * @return Minimum possible maximum completion time
     */
    public int minProcessingTime(List<Integer> processorTime, List<Integer> tasks) {
        // Step 1: Sort processors in ascending order (fastest first)
        Collections.sort(processorTime);

        // Step 2: Sort tasks in ascending order
        Collections.sort(tasks);

        // Initialize result to track the maximum completion time
        int result = 0;

        // Step 3: Assign tasks to processors
        // We have n processors, each gets 4 tasks
        int n = processorTime.size();

        // For each processor (starting from fastest)
        for (int i = 0; i < n; i++) {
            // Calculate the index of the last task assigned to this processor
            // Since tasks are sorted ascending, the largest tasks are at the end
            // Processor i gets tasks at indices: 4*(n-i)-1, 4*(n-i)-2, 4*(n-i)-3, 4*(n-i)-4
            // The maximum task time for this processor is at index 4*(n-i)-1
            int taskIndex = 4 * (n - i) - 1;

            // Step 4: Calculate completion time for this processor
            // Completion time = processor start time + longest assigned task
            int completionTime = processorTime.get(i) + tasks.get(taskIndex);

            // Step 5: Update overall maximum
            result = Math.max(result, completionTime);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting `processorTime`: O(n log n) where n is number of processors
- Sorting `tasks`: O(4n log 4n) = O(n log n) since 4n is the number of tasks
- Single pass through processors: O(n)
- Dominated by sorting: O(n log n)

**Space Complexity: O(1)**

- We only use a few variables (`result`, `n`, `i`, `task_index`)
- Sorting is typically done in-place, so no additional space is needed
- If sorting creates new arrays (depends on language implementation), it would be O(n)

## Common Mistakes

1. **Wrong sorting order**: Sorting both arrays in the same direction (both ascending or both descending) leads to suboptimal pairing. The fastest processors should get the longest tasks.

2. **Incorrect task indexing**: When accessing tasks from the end of the sorted array, it's easy to make off-by-one errors. Remember that array indices are 0-based, so the last element is at index `len(tasks)-1`.

3. **Forgetting each processor gets 4 tasks**: Some candidates might try to assign tasks one-to-one instead of in groups of 4. Each processor must get exactly 4 tasks.

4. **Not considering the maximum task per processor**: The completion time for a processor is its start time plus the **maximum** of its 4 assigned tasks, not the sum or average.

## When You'll See This Pattern

This problem uses a **greedy sorting and pairing** pattern that appears in many optimization problems:

1. **Minimum Time to Complete All Tasks (LeetCode 2589)**: Similar concept of minimizing maximum completion time by strategic task assignment.

2. **Assign Cookies (LeetCode 455)**: Uses greedy sorting to match children with cookies, maximizing satisfaction.

3. **Maximum Performance of a Team (LeetCode 1383)**: Combines sorting with priority queues to optimize team composition under constraints.

4. **Task Scheduler (LeetCode 621)**: Another task assignment problem that uses greedy strategies to minimize idle time.

The core pattern is: when you need to optimize pairings between two sets (like processors and tasks), sorting both sets and pairing in a specific order (often smallest with largest) frequently yields the optimal solution.

## Key Takeaways

1. **Greedy pairing with sorting**: When minimizing maximum sums in pairings, sort one array ascending and the other descending (or access from opposite ends).

2. **Think about extremes**: Optimization problems often involve pairing extremes (fastest with slowest, smallest with largest) to balance the distribution.

3. **Verify constraints**: Always check if there are grouping requirements (like 4 tasks per processor) and adjust your algorithm accordingly.

4. **Test with edge cases**: Small inputs, already sorted inputs, and inputs where all values are equal help verify your solution's correctness.

[Practice this problem on CodeJeet](/problem/minimum-processing-time)
