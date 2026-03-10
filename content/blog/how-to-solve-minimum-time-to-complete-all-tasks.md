---
title: "How to Solve Minimum Time to Complete All Tasks — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Time to Complete All Tasks. Hard difficulty, 39.7% acceptance rate. Topics: Array, Binary Search, Stack, Greedy, Sorting."
date: "2026-02-15"
category: "dsa-patterns"
tags: ["minimum-time-to-complete-all-tasks", "array", "binary-search", "stack", "hard"]
---

# How to Solve Minimum Time to Complete All Tasks

You're given tasks that must run for a specified duration within a time window, and you can run unlimited tasks simultaneously. The challenge is to schedule these tasks efficiently to minimize the total time the computer is active. What makes this problem tricky is that tasks can be split into non-continuous segments, but you need to be strategic about when to run them to avoid wasting time.

## Visual Walkthrough

Let's trace through a concrete example: `tasks = [[1,3,2],[2,5,3],[5,6,2]]`

We have three tasks:

1. Task 1: Must run 2 seconds between time 1 and 3 (inclusive)
2. Task 2: Must run 3 seconds between time 2 and 5
3. Task 3: Must run 2 seconds between time 5 and 6

**Step 1: Sort tasks by end time**
Sorted: `[[1,3,2],[2,5,3],[5,6,2]]` (already sorted in this case)

**Step 2: Process tasks in order**
We'll use a timeline array to track when the computer is active:

- **Task 1 (end=3, need=2)**: Check times 3, 2, 1
  - Time 3: available → mark active, need=1
  - Time 2: available → mark active, need=0
  - Total active time added: 2 (times 2 and 3)

- **Task 2 (end=5, need=3)**: Check times 5, 4, 3, 2
  - Time 5: available → mark active, need=2
  - Time 4: available → mark active, need=1
  - Time 3: already active (from Task 1) → skip
  - Time 2: already active (from Task 1) → skip
  - Time 1: available → mark active, need=0
  - Total active time added: 3 (times 1, 4, 5)

- **Task 3 (end=6, need=2)**: Check times 6, 5, 4
  - Time 6: available → mark active, need=1
  - Time 5: already active (from Task 2) → skip
  - Time 4: already active (from Task 2) → skip
  - Time 3: available → mark active, need=0
  - Total active time added: 2 (times 3 and 6)

**Result**: Active times are {1,2,3,4,5,6} → total = 6 seconds

The key insight: we process tasks from latest to earliest within their windows, preferring to use time slots that are already occupied by later tasks. This minimizes the total number of unique time slots needed.

## Brute Force Approach

A naive approach would be to try all possible ways to schedule each task's duration within its window. For each task with window size `w` and duration `d`, there are `C(w, d)` ways to choose which time slots to use (combinations of choosing d slots from w available slots). With n tasks, this becomes combinatorial explosion.

Even a simpler brute force that tries to assign tasks hour by hour would be exponential. Consider checking every time unit from min_start to max_end:

- At each time unit, decide which tasks to run
- Need to ensure each task gets its required duration within its window
- This is essentially a constraint satisfaction problem that grows exponentially with the number of tasks

The brute force is clearly infeasible for the constraints (tasks.length ≤ 2000, end times up to 2000).

## Optimized Approach

The key insight is **greedy scheduling from right to left**. Here's the step-by-step reasoning:

1. **Sort tasks by end time**: We want to handle tasks with earlier deadlines first.
2. **Track used time slots**: We need to know which time units are already scheduled.
3. **For each task, schedule from its end backwards**:
   - Start from the task's end time
   - Move leftward through time
   - Use any available time slot (not already used by this or previous tasks)
   - Stop when we've scheduled all required duration for this task
4. **Why right-to-left works**: Later tasks have later end times. By scheduling current task from right to left, we leave earlier time slots available for future tasks with earlier deadlines. This is optimal because:
   - If we schedule a task earlier than necessary, we might block a task with an earlier deadline
   - Scheduling as late as possible preserves flexibility for other tasks

The challenge is efficiently checking if a time slot is available. A boolean array works but can be slow for large time ranges. We can optimize using a union-find (disjoint set union) structure that helps us quickly find the next available time slot to the left.

## Optimal Solution

We'll use a DSU (Disjoint Set Union) structure where each time slot points to the next available slot to its left. When we use a time slot `t`, we union it with `t-1`, so future queries for `t` will automatically find the next available slot.

<div class="code-group">

```python
# Time: O(n * log(max_end) + n * α(max_end)) ≈ O(n log M) where M is max end time
# Space: O(max_end) for the DSU array
class DSU:
    def __init__(self, n):
        # Each slot initially points to itself
        self.parent = list(range(n + 2))  # +2 for safety with 1-based indexing

    def find(self, x):
        # Find root with path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        # Union two sets
        root_x = self.find(x)
        root_y = self.find(y)
        if root_x != root_y:
            self.parent[root_x] = root_y

def findMinimumTime(tasks):
    # Sort tasks by end time
    tasks.sort(key=lambda x: x[1])

    # Find maximum end time to initialize DSU
    max_end = max(task[1] for task in tasks)

    # Initialize DSU: parent[i] points to next available slot <= i
    dsu = DSU(max_end + 1)  # +1 for 1-based indexing

    # Track which time slots are used
    used = [False] * (max_end + 2)

    total_time = 0

    for start, end, duration in tasks:
        # First, count how much of this task is already covered
        # by previously scheduled tasks within [start, end]
        already_covered = 0
        for t in range(start, end + 1):
            if used[t]:
                already_covered += 1

        # If we still need to schedule more time
        need = duration - already_covered
        if need > 0:
            # Schedule from right to left
            current_time = end
            while need > 0:
                # Find next available slot using DSU
                available_slot = dsu.find(current_time)

                # If available slot is within task window and not used
                if available_slot >= start and not used[available_slot]:
                    # Use this time slot
                    used[available_slot] = True
                    total_time += 1
                    need -= 1

                    # Union with left neighbor so future queries skip this slot
                    dsu.union(available_slot, available_slot - 1)

                # Move to next potential slot
                current_time = available_slot - 1

    return total_time
```

```javascript
// Time: O(n * log(max_end) + n * α(max_end)) ≈ O(n log M)
// Space: O(max_end) for the DSU array
class DSU {
  constructor(n) {
    // Each slot initially points to itself
    this.parent = new Array(n + 2);
    for (let i = 0; i <= n + 1; i++) {
      this.parent[i] = i;
    }
  }

  find(x) {
    // Find root with path compression
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    // Union two sets
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX !== rootY) {
      this.parent[rootX] = rootY;
    }
  }
}

function findMinimumTime(tasks) {
  // Sort tasks by end time
  tasks.sort((a, b) => a[1] - b[1]);

  // Find maximum end time to initialize DSU
  let maxEnd = 0;
  for (const task of tasks) {
    maxEnd = Math.max(maxEnd, task[1]);
  }

  // Initialize DSU
  const dsu = new DSU(maxEnd + 1);

  // Track which time slots are used
  const used = new Array(maxEnd + 2).fill(false);

  let totalTime = 0;

  for (const [start, end, duration] of tasks) {
    // Count how much of this task is already covered
    let alreadyCovered = 0;
    for (let t = start; t <= end; t++) {
      if (used[t]) {
        alreadyCovered++;
      }
    }

    // Calculate how much more time we need to schedule
    let need = duration - alreadyCovered;
    if (need > 0) {
      // Schedule from right to left
      let currentTime = end;
      while (need > 0) {
        // Find next available slot using DSU
        const availableSlot = dsu.find(currentTime);

        // Check if slot is within task window and available
        if (availableSlot >= start && !used[availableSlot]) {
          // Use this time slot
          used[availableSlot] = true;
          totalTime++;
          need--;

          // Union with left neighbor
          dsu.union(availableSlot, availableSlot - 1);
        }

        // Move to next potential slot
        currentTime = availableSlot - 1;
      }
    }
  }

  return totalTime;
}
```

```java
// Time: O(n * log(max_end) + n * α(max_end)) ≈ O(n log M)
// Space: O(max_end) for the DSU array
class DSU {
    private int[] parent;

    public DSU(int n) {
        // Each slot initially points to itself
        parent = new int[n + 2];
        for (int i = 0; i <= n + 1; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        // Find root with path compression
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public void union(int x, int y) {
        // Union two sets
        int rootX = find(x);
        int rootY = find(y);
        if (rootX != rootY) {
            parent[rootX] = rootY;
        }
    }
}

class Solution {
    public int findMinimumTime(int[][] tasks) {
        // Sort tasks by end time
        Arrays.sort(tasks, (a, b) -> Integer.compare(a[1], b[1]));

        // Find maximum end time to initialize DSU
        int maxEnd = 0;
        for (int[] task : tasks) {
            maxEnd = Math.max(maxEnd, task[1]);
        }

        // Initialize DSU
        DSU dsu = new DSU(maxEnd + 1);

        // Track which time slots are used
        boolean[] used = new boolean[maxEnd + 2];

        int totalTime = 0;

        for (int[] task : tasks) {
            int start = task[0];
            int end = task[1];
            int duration = task[2];

            // Count how much of this task is already covered
            int alreadyCovered = 0;
            for (int t = start; t <= end; t++) {
                if (used[t]) {
                    alreadyCovered++;
                }
            }

            // Calculate how much more time we need to schedule
            int need = duration - alreadyCovered;
            if (need > 0) {
                // Schedule from right to left
                int currentTime = end;
                while (need > 0) {
                    // Find next available slot using DSU
                    int availableSlot = dsu.find(currentTime);

                    // Check if slot is within task window and available
                    if (availableSlot >= start && !used[availableSlot]) {
                        // Use this time slot
                        used[availableSlot] = true;
                        totalTime++;
                        need--;

                        // Union with left neighbor
                        dsu.union(availableSlot, availableSlot - 1);
                    }

                    // Move to next potential slot
                    currentTime = availableSlot - 1;
                }
            }
        }

        return totalTime;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n log M + n \* α(M)) where n is number of tasks and M is maximum end time

- Sorting tasks: O(n log n)
- For each task, we might iterate through its window: O(n \* w) in worst case, but with DSU optimization, each time slot is used at most once
- DSU operations are amortized O(α(M)) where α is inverse Ackermann function (effectively constant)
- Overall: O(n log n + M) where M ≤ 2000 in constraints

**Space Complexity**: O(M)

- DSU parent array: O(M)
- Used boolean array: O(M)
- Sorting uses O(log n) for recursion stack (or O(1) for iterative sort)

## Common Mistakes

1. **Not sorting by end time**: If you process tasks in arbitrary order, you might schedule a task with a late deadline early, blocking a task with an earlier deadline. Always sort by end time ascending.

2. **Scheduling left-to-right instead of right-to-left**: Scheduling from start to end wastes later time slots that could be shared with tasks having later deadlines. Right-to-left scheduling preserves flexibility.

3. **Forgetting to check already covered time**: Before scheduling new time for a task, check how much of its duration is already covered by previously scheduled tasks within its window. This avoids double-counting.

4. **Inefficient availability checking**: Using linear scan for each time slot gives O(n \* M) time. The DSU optimization is crucial for handling the upper constraints efficiently.

## When You'll See This Pattern

This greedy scheduling with DSU optimization appears in problems where you need to allocate limited resources over time:

1. **Meeting Rooms III (Hard)**: Allocating meeting rooms to intervals, similar to scheduling tasks to resources
2. **Course Schedule III (Hard)**: Scheduling courses with deadlines and durations
3. **Maximum Number of Events That Can Be Attended (Medium)**: Attending events with time constraints

The pattern involves: sorting by deadline, processing in order, and using a data structure to efficiently find available resources/slots.

## Key Takeaways

1. **Greedy with deadlines**: When tasks have deadlines, processing in deadline order and scheduling as late as possible is often optimal.
2. **DSU for interval management**: Union-Find isn't just for connectivity; it can efficiently manage "next available slot" queries in scheduling problems.
3. **Right-to-left scheduling**: When you can split tasks non-continuously, scheduling from the end backwards maximizes resource sharing.

Related problems: [Single-Threaded CPU](/problem/single-threaded-cpu)
