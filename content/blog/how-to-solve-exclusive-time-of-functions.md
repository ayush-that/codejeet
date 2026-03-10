---
title: "How to Solve Exclusive Time of Functions — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Exclusive Time of Functions. Medium difficulty, 66.1% acceptance rate. Topics: Array, Stack."
date: "2027-10-19"
category: "dsa-patterns"
tags: ["exclusive-time-of-functions", "array", "stack", "medium"]
---

# How to Solve Exclusive Time of Functions

This problem asks us to calculate the exclusive execution time for each function in a single-threaded CPU, given a sequence of log entries that indicate when functions start and end. What makes this problem interesting is that we need to track nested function calls and accurately attribute time to the correct function, especially when one function interrupts another.

## Visual Walkthrough

Let's trace through a simple example to build intuition:

**Input:** n = 2, logs = ["0:start:0","1:start:2","1:end:5","0:end:6"]

**Step-by-step:**

1. Time 0: Function 0 starts. Stack = [0], result = [0, 0]
2. Time 2: Function 1 starts. This interrupts function 0. We need to account for the time function 0 has run so far: 2 - 0 = 2 units. Add this to result[0]. Stack = [0, 1], result = [2, 0]
3. Time 5: Function 1 ends. It ran from time 2 to 5, which is 5 - 2 + 1 = 4 units (inclusive of both start and end). Add to result[1]. Since function 0 resumes, we update its "last known start time" to 6 (the next timestamp). Stack = [0], result = [2, 4]
4. Time 6: Function 0 ends. It ran from time 6 to 6, which is 6 - 6 + 1 = 1 unit. Add to result[0]. Stack = [], result = [3, 4]

**Key insight:** When a function ends, we need to add time to the ending function AND update the start time of the function that resumes (if any) to the next timestamp.

## Brute Force Approach

A naive approach might try to simulate every time unit:

1. Create an array to track current function at each timestamp
2. Process logs to mark when each function runs
3. Count how many timestamps each function occupies

**Why this fails:**

- Time complexity would be O(max_timestamp × n), which is impractical when timestamps can be large (up to 10^9)
- It doesn't handle the concept of "exclusive time" correctly when functions are nested
- Memory usage would be excessive for large timestamps

## Optimized Approach

The key insight is that we can use a **stack** to track the call hierarchy, similar to how a real CPU call stack works. Each log entry gives us a discrete event (start or end) at a specific timestamp. By processing these events in order, we can calculate time intervals without simulating every unit.

**Step-by-step reasoning:**

1. Initialize result array with zeros for n functions
2. Use a stack to track function IDs in the order they were called
3. Keep track of the "previous timestamp" to calculate time intervals
4. For each log:
   - Parse function ID, action (start/end), and timestamp
   - If action is "start":
     - If stack is not empty, the current top function has been interrupted. Add the elapsed time (current - previous) to that function
     - Push new function ID onto stack
     - Update previous timestamp to current timestamp
   - If action is "end":
     - The top function is ending. Add elapsed time (current - previous + 1) to this function
     - Pop the stack
     - Update previous timestamp to current + 1 (next available time unit)

**Why the stack works:**

- Functions are called and returned in LIFO order (last in, first out)
- When a function ends, we know it must be the one most recently started that hasn't ended yet
- The stack naturally tracks which function is currently executing at any point

## Optimal Solution

<div class="code-group">

```python
# Time: O(L) where L is number of logs | Space: O(n) for stack and result
def exclusiveTime(n, logs):
    """
    Calculate exclusive execution time for each function.

    Args:
        n: Number of functions
        logs: List of log strings in format "id:start/end:timestamp"

    Returns:
        List of exclusive times for each function
    """
    result = [0] * n  # Step 1: Initialize result array
    stack = []        # Step 2: Stack to track function call hierarchy
    prev_time = 0     # Step 3: Track previous timestamp for interval calculation

    for log in logs:
        # Step 4: Parse log entry
        parts = log.split(":")
        func_id = int(parts[0])
        action = parts[1]
        curr_time = int(parts[2])

        if action == "start":
            # Step 5: Handle function start
            if stack:
                # If there's a function already running, it's being interrupted
                # Add elapsed time to the interrupted function
                result[stack[-1]] += curr_time - prev_time

            # Push new function onto stack
            stack.append(func_id)
            # Update previous timestamp
            prev_time = curr_time
        else:
            # Step 6: Handle function end
            # The ending function must be at the top of the stack
            result[stack.pop()] += curr_time - prev_time + 1
            # Update previous timestamp to next available time unit
            prev_time = curr_time + 1

    return result
```

```javascript
// Time: O(L) where L is number of logs | Space: O(n) for stack and result
function exclusiveTime(n, logs) {
  /**
   * Calculate exclusive execution time for each function.
   *
   * @param {number} n - Number of functions
   * @param {string[]} logs - Array of log strings in format "id:start/end:timestamp"
   * @return {number[]} - Array of exclusive times for each function
   */
  const result = new Array(n).fill(0); // Step 1: Initialize result array
  const stack = []; // Step 2: Stack to track function call hierarchy
  let prevTime = 0; // Step 3: Track previous timestamp for interval calculation

  for (const log of logs) {
    // Step 4: Parse log entry
    const parts = log.split(":");
    const funcId = parseInt(parts[0]);
    const action = parts[1];
    const currTime = parseInt(parts[2]);

    if (action === "start") {
      // Step 5: Handle function start
      if (stack.length > 0) {
        // If there's a function already running, it's being interrupted
        // Add elapsed time to the interrupted function
        result[stack[stack.length - 1]] += currTime - prevTime;
      }

      // Push new function onto stack
      stack.push(funcId);
      // Update previous timestamp
      prevTime = currTime;
    } else {
      // Step 6: Handle function end
      // The ending function must be at the top of the stack
      result[stack.pop()] += currTime - prevTime + 1;
      // Update previous timestamp to next available time unit
      prevTime = currTime + 1;
    }
  }

  return result;
}
```

```java
// Time: O(L) where L is number of logs | Space: O(n) for stack and result
import java.util.*;

class Solution {
    public int[] exclusiveTime(int n, List<String> logs) {
        /**
         * Calculate exclusive execution time for each function.
         *
         * @param n - Number of functions
         * @param logs - List of log strings in format "id:start/end:timestamp"
         * @return - Array of exclusive times for each function
         */
        int[] result = new int[n];           // Step 1: Initialize result array
        Stack<Integer> stack = new Stack<>(); // Step 2: Stack to track function call hierarchy
        int prevTime = 0;                     // Step 3: Track previous timestamp for interval calculation

        for (String log : logs) {
            // Step 4: Parse log entry
            String[] parts = log.split(":");
            int funcId = Integer.parseInt(parts[0]);
            String action = parts[1];
            int currTime = Integer.parseInt(parts[2]);

            if (action.equals("start")) {
                // Step 5: Handle function start
                if (!stack.isEmpty()) {
                    // If there's a function already running, it's being interrupted
                    // Add elapsed time to the interrupted function
                    result[stack.peek()] += currTime - prevTime;
                }

                // Push new function onto stack
                stack.push(funcId);
                // Update previous timestamp
                prevTime = currTime;
            } else {
                // Step 6: Handle function end
                // The ending function must be at the top of the stack
                result[stack.pop()] += currTime - prevTime + 1;
                // Update previous timestamp to next available time unit
                prevTime = currTime + 1;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(L) where L is the number of logs

- We process each log exactly once
- Each log operation (parsing, stack push/pop, array update) is O(1)
- Total operations scale linearly with number of logs

**Space Complexity:** O(n)

- The result array uses O(n) space
- The stack can contain up to n function IDs in the worst case (deeply nested calls)
- Additional variables use O(1) space

## Common Mistakes

1. **Forgetting to update prevTime correctly on end events**
   - When a function ends at time t, the next available time unit is t+1
   - If you set prevTime = currTime instead of currTime + 1, you'll double-count time units
   - **Fix:** Always set prevTime = currTime + 1 after processing an end event

2. **Not handling the +1 for end events**
   - The timestamp in an end log is inclusive (the function runs at that timestamp)
   - So elapsed time is currTime - prevTime + 1, not just currTime - prevTime
   - **Fix:** Add 1 when calculating time for end events

3. **Assuming stack is empty when processing end events**
   - In valid input, an end event should always match the top of the stack
   - But it's good practice to validate or at least be aware of this assumption
   - **Fix:** Trust the input format, but in interviews you might mention this assumption

4. **Mixing up when to add time to which function**
   - On start events, time goes to the function being interrupted (top of stack)
   - On end events, time goes to the function ending (also top of stack)
   - **Fix:** Always check which function ID is at stack[-1] when adding time

## When You'll See This Pattern

This stack-based approach for tracking nested intervals appears in several problems:

1. **Valid Parentheses (LeetCode #20)** - Similar LIFO structure for matching opening/closing symbols
2. **Daily Temperatures (LeetCode #739)** - Using stack to track indices and calculate differences
3. **Asteroid Collision (LeetCode #735)** - Stack helps resolve collisions in correct order
4. **Evaluate Reverse Polish Notation (LeetCode #150)** - Stack evaluates nested operations

The common theme is using a stack to process events in the correct order when there's a hierarchical or nested relationship between elements.

## Key Takeaways

1. **Stacks naturally model LIFO (Last-In-First-Out) relationships** - When you see problems involving nested structures, function calls, or matching pairs, consider using a stack.

2. **Track previous state to calculate intervals efficiently** - Instead of simulating every time unit, track the last relevant event and calculate differences. This transforms O(max_time) problems into O(number_of_events).

3. **Pay attention to inclusive vs exclusive boundaries** - The "+1" adjustment for end events is crucial. Always verify whether interval endpoints are inclusive or exclusive in time calculation problems.

[Practice this problem on CodeJeet](/problem/exclusive-time-of-functions)
