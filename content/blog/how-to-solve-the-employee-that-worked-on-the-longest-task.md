---
title: "How to Solve The Employee That Worked on the Longest Task — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode The Employee That Worked on the Longest Task. Easy difficulty, 51.4% acceptance rate. Topics: Array."
date: "2028-10-09"
category: "dsa-patterns"
tags: ["the-employee-that-worked-on-the-longest-task", "array", "easy"]
---

# How to Solve "The Employee That Worked on the Longest Task"

This problem asks us to find which employee worked on the longest single task from a sequence of task logs. While it's categorized as "Easy," what makes it interesting is that you need to carefully calculate task durations from leave times and handle ties correctly (return the smallest employee ID when multiple employees have the same longest task duration). The challenge lies in understanding how to extract task durations from sequential leave times and implementing the tie-breaking logic properly.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `n = 10` employees (IDs 0-9)
- `logs = [[0,3],[2,5],[0,9],[1,15]]`

We need to calculate how long each task took and find the longest one.

**Step 1: Process the first task**

- Employee 0 finishes at time 3
- Since this is the first task, we compare to start time 0
- Duration = 3 - 0 = 3
- Current longest duration = 3, employee = 0

**Step 2: Process the second task**

- Employee 2 finishes at time 5
- Previous leave time was 3 (from first task)
- Duration = 5 - 3 = 2
- 2 < 3, so longest duration remains 3 (employee 0)

**Step 3: Process the third task**

- Employee 0 finishes at time 9
- Previous leave time was 5
- Duration = 9 - 5 = 4
- 4 > 3, so new longest duration = 4, employee = 0

**Step 4: Process the fourth task**

- Employee 1 finishes at time 15
- Previous leave time was 9
- Duration = 15 - 9 = 6
- 6 > 4, so new longest duration = 6, employee = 1

**Result:** Employee 1 worked on the longest task (duration 6)

Now let's consider a tie scenario:

- `logs = [[0,3],[1,5],[2,8]]`
- Task durations: 3, 2, 3
- Longest duration = 3
- Employees with duration 3: 0 and 2
- We return the smallest ID: 0

## Brute Force Approach

A naive approach might try to calculate all task durations first, store them in an array, then find the maximum. While this would work, it's unnecessarily complex. The brute force approach would:

1. Create an array to store durations for each task
2. Calculate each duration as `logs[i][1] - logs[i-1][1]` (with special handling for i=0)
3. Find the maximum value in the durations array
4. Find all employees with that maximum duration
5. Return the smallest employee ID among them

This approach uses O(n) extra space for the durations array when we don't need to store all durations. We can solve the problem in a single pass without storing all intermediate results.

## Optimal Solution

The optimal solution processes the logs in a single pass, tracking:

1. The current longest duration found so far
2. The employee ID with that duration (or the smallest ID in case of ties)
3. The previous leave time to calculate the next task's duration

We iterate through the logs, calculate each task's duration by subtracting the previous leave time, and update our answer whenever we find a longer duration or an equal duration with a smaller employee ID.

<div class="code-group">

```python
# Time: O(m) where m = len(logs) | Space: O(1)
def hardestWorker(n, logs):
    """
    Find the employee who worked on the longest single task.

    Args:
        n: Number of employees (not directly used in solution)
        logs: List of [employee_id, leave_time] pairs

    Returns:
        Employee ID with the longest task duration
    """
    # Initialize tracking variables
    longest_duration = 0      # Track the maximum duration found so far
    employee_id = 0           # Track the employee with longest duration
    prev_time = 0             # Track the previous leave time

    # Process each log entry
    for emp_id, leave_time in logs:
        # Calculate duration of current task
        # Duration = current leave time - previous leave time
        duration = leave_time - prev_time

        # Update answer if we find a longer duration
        # OR if we find equal duration with smaller employee ID
        if duration > longest_duration or \
           (duration == longest_duration and emp_id < employee_id):
            longest_duration = duration
            employee_id = emp_id

        # Update previous time for next iteration
        prev_time = leave_time

    return employee_id
```

```javascript
// Time: O(m) where m = logs.length | Space: O(1)
/**
 * Find the employee who worked on the longest single task.
 * @param {number} n - Number of employees (not directly used in solution)
 * @param {number[][]} logs - Array of [employee_id, leave_time] pairs
 * @return {number} Employee ID with the longest task duration
 */
function hardestWorker(n, logs) {
  // Initialize tracking variables
  let longestDuration = 0; // Track the maximum duration found so far
  let employeeId = 0; // Track the employee with longest duration
  let prevTime = 0; // Track the previous leave time

  // Process each log entry
  for (const [empId, leaveTime] of logs) {
    // Calculate duration of current task
    // Duration = current leave time - previous leave time
    const duration = leaveTime - prevTime;

    // Update answer if we find a longer duration
    // OR if we find equal duration with smaller employee ID
    if (duration > longestDuration || (duration === longestDuration && empId < employeeId)) {
      longestDuration = duration;
      employeeId = empId;
    }

    // Update previous time for next iteration
    prevTime = leaveTime;
  }

  return employeeId;
}
```

```java
// Time: O(m) where m = logs.length | Space: O(1)
class Solution {
    /**
     * Find the employee who worked on the longest single task.
     * @param n Number of employees (not directly used in solution)
     * @param logs Array of [employee_id, leave_time] pairs
     * @return Employee ID with the longest task duration
     */
    public int hardestWorker(int n, int[][] logs) {
        // Initialize tracking variables
        int longestDuration = 0;  // Track the maximum duration found so far
        int employeeId = 0;       // Track the employee with longest duration
        int prevTime = 0;         // Track the previous leave time

        // Process each log entry
        for (int[] log : logs) {
            int empId = log[0];
            int leaveTime = log[1];

            // Calculate duration of current task
            // Duration = current leave time - previous leave time
            int duration = leaveTime - prevTime;

            // Update answer if we find a longer duration
            // OR if we find equal duration with smaller employee ID
            if (duration > longestDuration ||
                (duration == longestDuration && empId < employeeId)) {
                longestDuration = duration;
                employeeId = empId;
            }

            // Update previous time for next iteration
            prevTime = leaveTime;
        }

        return employeeId;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(m) where m is the number of log entries (length of `logs` array). We make a single pass through all the logs, performing constant-time operations for each entry.

**Space Complexity:** O(1) for all implementations. We only use a few variables to track the current state (longest duration, employee ID, previous time). No additional data structures scale with input size.

The key insight is that we don't need to store all durations or create any maps. We can solve this with a simple linear scan, updating our answer as we go.

## Common Mistakes

1. **Incorrect duration calculation for first task**: Forgetting that the first task starts at time 0. The duration of the first task is `logs[0][1] - 0`, not `logs[0][1] - logs[-1][1]` (which would be invalid).

2. **Wrong tie-breaking logic**: When multiple employees have the same longest duration, we need to return the smallest ID. A common mistake is to return the first occurrence or the last occurrence instead of the smallest ID.

3. **Overcomplicating with unnecessary data structures**: Some candidates create hash maps or arrays to store all durations, then find the maximum. This uses O(n) extra space when O(1) is sufficient.

4. **Misunderstanding the problem statement**: Thinking we need to find the employee with the longest total working time across all tasks, rather than the longest single task. The problem clearly states "worked on the longest task" (singular).

## When You'll See This Pattern

This problem uses a **single-pass tracking pattern** where you maintain the "best so far" while iterating through data. You'll see similar patterns in:

1. **Maximum Subarray (LeetCode 53)**: Track the maximum sum ending at each position while iterating through the array.
2. **Best Time to Buy and Sell Stock (LeetCode 121)**: Track the minimum price seen so far while iterating through prices to calculate maximum profit.
3. **Find the Highest Altitude (LeetCode 1732)**: Track the maximum altitude while calculating running sums.

The common theme is maintaining state (maximum/minimum values, running sums, etc.) while processing data in a single pass, avoiding the need to store all intermediate results.

## Key Takeaways

1. **Single-pass solutions are often optimal**: When you can determine the answer by tracking state as you go, you can usually achieve O(n) time and O(1) space.

2. **Read tie-breaking rules carefully**: Many problems have specific tie-breaking rules (smallest ID, earliest occurrence, etc.). Always verify you're implementing the correct rule.

3. **Start with edge cases**: For time-based problems, always check how the first and last elements should be handled. In this case, the first task starts at time 0.

[Practice this problem on CodeJeet](/problem/the-employee-that-worked-on-the-longest-task)
