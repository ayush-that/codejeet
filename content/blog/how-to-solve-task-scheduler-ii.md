---
title: "How to Solve Task Scheduler II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Task Scheduler II. Medium difficulty, 54.7% acceptance rate. Topics: Array, Hash Table, Simulation."
date: "2028-05-18"
category: "dsa-patterns"
tags: ["task-scheduler-ii", "array", "hash-table", "simulation", "medium"]
---

# How to Solve Task Scheduler II

This problem asks us to schedule tasks that must be completed in order, with a mandatory cooldown period between tasks of the same type. Given an array of tasks (where each value represents a task type) and a `space` value representing the minimum days between identical tasks, we need to calculate the total number of days required to complete all tasks. The tricky part is that we can only work on one task per day, and if we encounter a task type that was recently completed, we must wait enough days to satisfy the cooldown period before starting it.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `tasks = [1, 2, 1, 2]`, `space = 2`

We'll simulate day by day:

- **Day 0:** Task 1 is new → complete it immediately. Record: last day for task 1 = 0
- **Day 1:** Task 2 is new → complete it immediately. Record: last day for task 2 = 1
- **Day 2:** Next task is 1. Last completed on day 0. Space = 2, so we need at least 2 days between. Minimum start day = last_day + space + 1 = 0 + 2 + 1 = 3. Current day is 2, so we must wait until day 3. We advance current day to 3 and complete task 1. Record: last day for task 1 = 3
- **Day 4:** Next task is 2. Last completed on day 1. Minimum start day = 1 + 2 + 1 = 4. Current day is 4, so we can complete it immediately. Record: last day for task 2 = 4

Total days: 5 (days 0 through 4 inclusive). Notice we didn't just count tasks — we had to account for waiting days when the cooldown wasn't satisfied.

## Brute Force Approach

A naive approach would simulate every single day explicitly:

1. Start with day = 0
2. For each task in order:
   - Check when this task type was last completed
   - If it's never been done or enough days have passed, complete it on the current day
   - Otherwise, increment day by 1 and check again tomorrow
   - Repeat until we can complete the task

The brute force code would look like this:

```python
def taskSchedulerII_brute(tasks, space):
    last_day = {}
    current_day = 0

    for task in tasks:
        # Keep waiting until we can schedule this task
        while task in last_day and current_day <= last_day[task] + space:
            current_day += 1
        # Schedule the task
        last_day[task] = current_day
        current_day += 1

    return current_day
```

**Why this is inefficient:** In the worst case, we might have to wait `space` days for each task, leading to O(n × space) time complexity. If `space` is large (up to 10^9 per constraints), this becomes completely impractical. We need a way to jump directly to the next valid day without simulating each intermediate day.

## Optimized Approach

The key insight is that we don't need to simulate waiting day by day. We can calculate the earliest day we can start each task using a simple formula:

```
earliest_start_day = max(current_day, last_completed_day[task] + space + 1)
```

Where:

- `current_day` is the day counter (0-indexed)
- `last_completed_day[task]` is the last day we completed this task type
- `space` is the required cooldown period

The logic works like this:

1. If we've never seen this task before, we can do it immediately on `current_day`
2. If we have seen it, we need to wait until `last_completed_day[task] + space + 1`
3. We take the maximum because we might already be past that required day (if we waited for previous tasks)

This allows us to jump directly to the correct day in O(1) time per task, eliminating the need for day-by-day simulation.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the number of tasks
# Space: O(n) for the hash map storing last completion day for each task type
def taskSchedulerII(tasks, space):
    """
    Calculates the minimum days needed to complete all tasks with cooldown.

    Args:
        tasks: List of task types to complete in order
        space: Minimum days between tasks of the same type

    Returns:
        Total days required (0-indexed count)
    """
    # Dictionary to track the last day each task type was completed
    # Key: task type, Value: last completion day
    last_day = {}

    # Current day counter (0-indexed)
    current_day = 0

    # Process each task in the given order
    for task in tasks:
        # Calculate the earliest day we can start this task
        # If task was never done before, last_day.get(task, -inf) returns -inf
        # so earliest_start = max(current_day, -inf + space + 1) = current_day
        earliest_start = max(current_day, last_day.get(task, float('-inf')) + space + 1)

        # Update current day to when we actually complete this task
        # (earliest_start is when we start, completion happens on the same day)
        current_day = earliest_start

        # Record that this task type was completed on current_day
        last_day[task] = current_day

        # Move to the next day for the next task
        current_day += 1

    # Since current_day was incremented after the last task,
    # it represents the total number of days (0-indexed)
    return current_day
```

```javascript
// Time: O(n) where n is the number of tasks
// Space: O(n) for the map storing last completion day for each task type
function taskSchedulerII(tasks, space) {
  /**
   * Calculates the minimum days needed to complete all tasks with cooldown.
   *
   * @param {number[]} tasks - Array of task types to complete in order
   * @param {number} space - Minimum days between tasks of the same type
   * @return {number} Total days required (0-indexed count)
   */

  // Map to track the last day each task type was completed
  // Key: task type, Value: last completion day
  const lastDay = new Map();

  // Current day counter (0-indexed)
  let currentDay = 0;

  // Process each task in the given order
  for (const task of tasks) {
    // Get the last completion day for this task type
    // If not found, use -Infinity so the calculation works correctly
    const lastCompleted = lastDay.get(task) ?? -Infinity;

    // Calculate the earliest day we can start this task
    // Math.max ensures we don't go backwards in time
    const earliestStart = Math.max(currentDay, lastCompleted + space + 1);

    // Update current day to when we actually complete this task
    currentDay = earliestStart;

    // Record that this task type was completed on currentDay
    lastDay.set(task, currentDay);

    // Move to the next day for the next task
    currentDay++;
  }

  // Since currentDay was incremented after the last task,
  // it represents the total number of days (0-indexed)
  return currentDay;
}
```

```java
// Time: O(n) where n is the number of tasks
// Space: O(n) for the hash map storing last completion day for each task type
class Solution {
    public long taskSchedulerII(int[] tasks, int space) {
        /**
         * Calculates the minimum days needed to complete all tasks with cooldown.
         *
         * @param tasks Array of task types to complete in order
         * @param space Minimum days between tasks of the same type
         * @return Total days required (0-indexed count)
         */

        // HashMap to track the last day each task type was completed
        // Key: task type, Value: last completion day
        Map<Integer, Long> lastDay = new HashMap<>();

        // Current day counter (0-indexed)
        long currentDay = 0;

        // Process each task in the given order
        for (int task : tasks) {
            // Get the last completion day for this task type
            // If not found, Long.MIN_VALUE ensures calculation works
            long lastCompleted = lastDay.getOrDefault(task, Long.MIN_VALUE);

            // Calculate the earliest day we can start this task
            // Math.max ensures we don't go backwards in time
            long earliestStart = Math.max(currentDay, lastCompleted + space + 1);

            // Update current day to when we actually complete this task
            currentDay = earliestStart;

            // Record that this task type was completed on currentDay
            lastDay.put(task, currentDay);

            // Move to the next day for the next task
            currentDay++;
        }

        // Since currentDay was incremented after the last task,
        // it represents the total number of days (0-indexed)
        return currentDay;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the number of tasks. We process each task exactly once, performing O(1) operations (hash map lookups and arithmetic) for each task.

**Space Complexity:** O(n) in the worst case. In the worst scenario, every task is a different type, so our hash map would store an entry for each task type. In practice, it's O(k) where k is the number of unique task types, but k ≤ n.

The optimization comes from avoiding day-by-day simulation. Instead of potentially waiting O(space) days between tasks, we calculate the next valid day directly.

## Common Mistakes

1. **Off-by-one errors with the cooldown formula:** The most common mistake is using `last_day[task] + space` instead of `last_day[task] + space + 1`. If task A was done on day 0 with space=2, the next task A can be done on day 3 (days 0, 1, 2 must pass), which is `0 + 2 + 1 = 3`.

2. **Forgetting to use `max()` with current_day:** Some candidates calculate `last_day[task] + space + 1` but forget that we might already be on a later day due to waiting for previous tasks. We need `max(current_day, last_day[task] + space + 1)` to ensure we don't schedule tasks in the past.

3. **Using integer instead of long (Java specific):** Since we might need up to `n × (space + 1)` days and both n and space can be up to 10^5, the result can exceed 32-bit integer range. Always use 64-bit integers (long in Java, int is fine in Python).

4. **Incorrect initialization for unseen tasks:** When a task hasn't been seen before, we need a value that makes `max(current_day, last_day[task] + space + 1) = current_day`. Using 0 doesn't work because `0 + space + 1` might be > current_day. Use negative infinity or a special sentinel value.

## When You'll See This Pattern

This "cooldown scheduling with memory" pattern appears in several LeetCode problems:

1. **Task Scheduler (Medium):** The original task scheduler problem where tasks can be reordered to minimize idle time. Both problems deal with cooldown periods between identical tasks, but Task Scheduler allows reordering while Task Scheduler II requires preserving order.

2. **Check If All 1's Are at Least Length K Places Away (Easy):** Similar concept of maintaining minimum distance between elements, though simpler since it's just validation rather than scheduling.

3. **Car Fleet II (Hard):** While more complex, it uses similar "look ahead" calculation to determine when cars will collide based on their speeds and positions.

The core technique of using a hash map to track the last occurrence and calculating the next valid position directly (rather than simulating) is widely applicable to problems with spacing constraints.

## Key Takeaways

1. **When you need to enforce minimum distance between occurrences of the same element**, use a hash map/dictionary to track the last position and calculate the next valid position directly using arithmetic rather than simulating each step.

2. **The formula `max(current_position, last_position + min_distance + 1)`** is a powerful pattern for these types of problems. The `+1` accounts for the fact that if you're at position X, you need X+1 to be at least min_distance away.

3. **Always consider integer overflow** when dealing with large constraints. Even if inputs are within 32-bit range, calculations might exceed it (like multiplying n × space).

Related problems: [Task Scheduler](/problem/task-scheduler), [Maximize Distance to Closest Person](/problem/maximize-distance-to-closest-person), [Check If All 1's Are at Least Length K Places Away](/problem/check-if-all-1s-are-at-least-length-k-places-away)
