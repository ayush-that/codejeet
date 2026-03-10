---
title: "How to Solve Design Task Manager — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Task Manager. Medium difficulty, 49.1% acceptance rate. Topics: Hash Table, Design, Heap (Priority Queue), Ordered Set."
date: "2027-06-12"
category: "dsa-patterns"
tags: ["design-task-manager", "hash-table", "design", "heap-(priority-queue)", "medium"]
---

# How to Solve Design Task Manager

Designing a task manager requires efficiently handling tasks with priorities where we need to quickly add, modify, execute (retrieve highest priority), and remove tasks. The tricky part is that we need to support all these operations efficiently—especially when tasks can be modified after being added, which breaks simple priority queue approaches.

## Visual Walkthrough

Let's trace through a concrete example:

**Initialization:** `TaskManager([[1, 10], [2, 5], [3, 8]])`

- Task ID 1 with priority 10
- Task ID 2 with priority 5
- Task ID 3 with priority 8

**Operation 1:** `executeTask()` should return task ID 1 (priority 10, highest)

- After execution, task 1 is removed

**Operation 2:** `addTask(4, 9)` adds task ID 4 with priority 9

**Operation 3:** `modifyTask(2, 12)` changes task 2's priority from 5 to 12

**Operation 4:** `executeTask()` should now return task ID 2 (priority 12, highest)

- After execution, task 2 is removed

**Operation 5:** `removeTask(3)` removes task ID 3

**Key Insight:** A simple max-heap would fail when we modify priorities because we can't efficiently update a task's priority in the heap. We need a way to mark old entries as invalid and add new ones.

## Brute Force Approach

A naive approach would store tasks in an array or list:

- `addTask`: Append to the end → O(1)
- `modifyTask`: Linear search for task ID → O(n)
- `executeTask`: Linear scan for max priority → O(n)
- `removeTask`: Linear search for task ID → O(n)

The brute force code would look like:

```python
class TaskManager:
    def __init__(self, tasks):
        self.tasks = []
        for task_id, priority in tasks:
            self.tasks.append([task_id, priority])

    def addTask(self, taskId, priority):
        self.tasks.append([taskId, priority])

    def modifyTask(self, taskId, newPriority):
        for task in self.tasks:
            if task[0] == taskId:
                task[1] = newPriority
                return

    def executeTask(self):
        if not self.tasks:
            return -1

        max_idx = 0
        for i in range(1, len(self.tasks)):
            if self.tasks[i][1] > self.tasks[max_idx][1]:
                max_idx = i

        task_id = self.tasks[max_idx][0]
        self.tasks.pop(max_idx)
        return task_id

    def removeTask(self, taskId):
        for i in range(len(self.tasks)):
            if self.tasks[i][0] == taskId:
                self.tasks.pop(i)
                return
```

**Why this fails:** All operations except `addTask` are O(n), making the system inefficient for large numbers of tasks. The problem requires efficient priority-based retrieval and updates.

## Optimized Approach

The key insight is that we need **two data structures working together**:

1. **A hash map (dictionary)** to store task ID → priority mappings for O(1) lookups and updates
2. **A max-heap (priority queue)** to efficiently retrieve the highest priority task

However, there's a critical complication: when we modify a task's priority, we can't update it directly in the heap. Instead, we:

- Update the priority in the hash map
- Push a new entry to the heap with the new priority
- Mark the old heap entry as invalid (lazy deletion)

When we pop from the heap, we check if the task ID's current priority matches what's in the heap. If not, we discard it and pop again.

This approach gives us:

- `addTask`: O(log n) for heap push
- `modifyTask`: O(log n) for heap push (with lazy deletion)
- `executeTask`: Amortized O(log n) due to potential lazy deletions
- `removeTask`: O(1) for marking as removed (lazy deletion)

## Optimal Solution

<div class="code-group">

```python
# Time Complexity:
# - Constructor: O(n log n) where n is number of initial tasks
# - addTask: O(log n)
# - modifyTask: O(log n)
# - executeTask: Amortized O(log n)
# - removeTask: O(1) for marking, O(log n) if we need to clean heap
# Space Complexity: O(n) for storing tasks and heap

import heapq

class TaskManager:
    def __init__(self, tasks):
        """
        Initialize the task manager with initial tasks.
        Each task is [taskId, priority].
        """
        # Map task ID to its current priority
        self.task_map = {}

        # Max-heap (using negative priorities since Python has min-heap)
        # Each heap entry is (-priority, taskId)
        self.max_heap = []

        # Set of task IDs that have been removed or modified
        # We use lazy deletion: mark old entries as invalid
        self.invalid_tasks = set()

        # Add initial tasks
        for task_id, priority in tasks:
            self.task_map[task_id] = priority
            heapq.heappush(self.max_heap, (-priority, task_id))

    def addTask(self, taskId, priority):
        """
        Add a new task with given ID and priority.
        If task ID already exists, treat as modifyTask.
        """
        # If task already exists, update it
        if taskId in self.task_map:
            self.modifyTask(taskId, priority)
            return

        # Add to task map
        self.task_map[taskId] = priority

        # Push to max-heap (using negative priority for max-heap behavior)
        heapq.heappush(self.max_heap, (-priority, taskId))

    def modifyTask(self, taskId, newPriority):
        """
        Modify priority of existing task.
        Uses lazy deletion: mark old entry as invalid, push new one.
        """
        if taskId not in self.task_map:
            return  # Task doesn't exist

        # Update priority in task map
        self.task_map[taskId] = newPriority

        # Mark the old heap entry as invalid
        self.invalid_tasks.add(taskId)

        # Push new entry with updated priority
        heapq.heappush(self.max_heap, (-newPriority, taskId))

    def executeTask(self):
        """
        Execute the highest priority task (remove and return its ID).
        Returns -1 if no valid tasks exist.
        """
        # Keep popping until we find a valid task or heap is empty
        while self.max_heap:
            # Get the task with highest priority (most negative value)
            neg_priority, task_id = heapq.heappop(self.max_heap)
            priority = -neg_priority  # Convert back to positive

            # Check if this task is still valid
            # Case 1: Task was marked invalid due to modification
            if task_id in self.invalid_tasks:
                # Remove from invalid set if it's the original entry
                # (modified tasks have new entries in heap)
                self.invalid_tasks.discard(task_id)
                continue

            # Case 2: Task priority doesn't match current priority
            # This handles cases where task was modified multiple times
            if task_id not in self.task_map or self.task_map[task_id] != priority:
                continue

            # Valid task found - remove it from system
            del self.task_map[task_id]
            return task_id

        # No valid tasks found
        return -1

    def removeTask(self, taskId):
        """
        Remove a task by ID.
        Uses lazy deletion: mark as invalid without removing from heap.
        """
        if taskId not in self.task_map:
            return  # Task doesn't exist

        # Remove from task map
        del self.task_map[taskId]

        # Mark as invalid for lazy deletion from heap
        self.invalid_tasks.add(taskId)
```

```javascript
// Time Complexity: Same as Python solution
// Space Complexity: O(n)

class TaskManager {
  constructor(tasks) {
    // Map task ID to current priority
    this.taskMap = new Map();

    // Max-heap (using negative priorities)
    // Each entry is {priority: -priority, taskId: taskId}
    this.maxHeap = [];

    // Set of invalid task IDs (for lazy deletion)
    this.invalidTasks = new Set();

    // Add initial tasks
    for (const [taskId, priority] of tasks) {
      this.taskMap.set(taskId, priority);
      this.maxHeap.push({ priority: -priority, taskId });
      this.heapifyUp(this.maxHeap.length - 1);
    }
  }

  // Helper methods for min-heap implementation
  heapifyUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.maxHeap[parent].priority <= this.maxHeap[index].priority) {
        break;
      }
      [this.maxHeap[parent], this.maxHeap[index]] = [this.maxHeap[index], this.maxHeap[parent]];
      index = parent;
    }
  }

  heapifyDown(index) {
    const n = this.maxHeap.length;
    while (true) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < n && this.maxHeap[left].priority < this.maxHeap[smallest].priority) {
        smallest = left;
      }
      if (right < n && this.maxHeap[right].priority < this.maxHeap[smallest].priority) {
        smallest = right;
      }
      if (smallest === index) break;

      [this.maxHeap[index], this.maxHeap[smallest]] = [this.maxHeap[smallest], this.maxHeap[index]];
      index = smallest;
    }
  }

  addTask(taskId, priority) {
    // If task exists, update it
    if (this.taskMap.has(taskId)) {
      this.modifyTask(taskId, priority);
      return;
    }

    // Add to task map
    this.taskMap.set(taskId, priority);

    // Push to max-heap (using negative priority)
    this.maxHeap.push({ priority: -priority, taskId });
    this.heapifyUp(this.maxHeap.length - 1);
  }

  modifyTask(taskId, newPriority) {
    if (!this.taskMap.has(taskId)) return;

    // Update priority in task map
    this.taskMap.set(taskId, newPriority);

    // Mark old entry as invalid
    this.invalidTasks.add(taskId);

    // Push new entry with updated priority
    this.maxHeap.push({ priority: -newPriority, taskId });
    this.heapifyUp(this.maxHeap.length - 1);
  }

  executeTask() {
    while (this.maxHeap.length > 0) {
      // Get highest priority task (smallest negative = largest positive)
      const { priority: negPriority, taskId } = this.maxHeap[0];
      const priority = -negPriority;

      // Remove from heap
      const last = this.maxHeap.pop();
      if (this.maxHeap.length > 0) {
        this.maxHeap[0] = last;
        this.heapifyDown(0);
      }

      // Check if task is valid
      // Case 1: Marked invalid due to modification
      if (this.invalidTasks.has(taskId)) {
        this.invalidTasks.delete(taskId);
        continue;
      }

      // Case 2: Priority doesn't match current priority
      if (!this.taskMap.has(taskId) || this.taskMap.get(taskId) !== priority) {
        continue;
      }

      // Valid task found - remove from system
      this.taskMap.delete(taskId);
      return taskId;
    }

    return -1; // No valid tasks
  }

  removeTask(taskId) {
    if (!this.taskMap.has(taskId)) return;

    // Remove from task map
    this.taskMap.delete(taskId);

    // Mark as invalid for lazy deletion
    this.invalidTasks.add(taskId);
  }
}
```

```java
// Time Complexity: Same as Python solution
// Space Complexity: O(n)

import java.util.*;

class TaskManager {
    private Map<Integer, Integer> taskMap;
    private PriorityQueue<int[]> maxHeap;
    private Set<Integer> invalidTasks;

    public TaskManager(int[][] tasks) {
        taskMap = new HashMap<>();
        maxHeap = new PriorityQueue<>((a, b) -> b[0] - a[0]); // Max-heap
        invalidTasks = new HashSet<>();

        // Add initial tasks
        for (int[] task : tasks) {
            int taskId = task[0];
            int priority = task[1];
            taskMap.put(taskId, priority);
            maxHeap.offer(new int[]{priority, taskId});
        }
    }

    public void addTask(int taskId, int priority) {
        // If task exists, update it
        if (taskMap.containsKey(taskId)) {
            modifyTask(taskId, priority);
            return;
        }

        // Add to task map
        taskMap.put(taskId, priority);

        // Push to max-heap
        maxHeap.offer(new int[]{priority, taskId});
    }

    public void modifyTask(int taskId, int newPriority) {
        if (!taskMap.containsKey(taskId)) return;

        // Update priority in task map
        taskMap.put(taskId, newPriority);

        // Mark old entry as invalid
        invalidTasks.add(taskId);

        // Push new entry with updated priority
        maxHeap.offer(new int[]{newPriority, taskId});
    }

    public int executeTask() {
        while (!maxHeap.isEmpty()) {
            // Get highest priority task
            int[] task = maxHeap.poll();
            int priority = task[0];
            int taskId = task[1];

            // Check if task is valid
            // Case 1: Marked invalid due to modification
            if (invalidTasks.contains(taskId)) {
                invalidTasks.remove(taskId);
                continue;
            }

            // Case 2: Priority doesn't match current priority
            if (!taskMap.containsKey(taskId) || taskMap.get(taskId) != priority) {
                continue;
            }

            // Valid task found - remove from system
            taskMap.remove(taskId);
            return taskId;
        }

        return -1; // No valid tasks
    }

    public void removeTask(int taskId) {
        if (!taskMap.containsKey(taskId)) return;

        // Remove from task map
        taskMap.remove(taskId);

        // Mark as invalid for lazy deletion
        invalidTasks.add(taskId);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- **Constructor:** O(n log n) - Each of n initial tasks requires O(log n) heap insertion
- **addTask:** O(log n) - Single heap insertion
- **modifyTask:** O(log n) - Mark old entry invalid (O(1)) + new heap insertion (O(log n))
- **executeTask:** Amortized O(log n) - May need to discard invalid entries, but each invalid entry is discarded at most once
- **removeTask:** O(1) - Just marking as invalid in the set

**Space Complexity:** O(n) - We store each task in both the hash map and potentially multiple times in the heap (due to modifications). In worst case, if all tasks are modified many times, we could have O(m) heap entries where m is number of operations, but typically we consider O(n).

## Common Mistakes

1. **Using only a heap without lazy deletion:** Candidates often try to update priorities directly in the heap, which isn't efficient. Without lazy deletion, you'd need to remove and reinsert, which requires finding the task in the heap (O(n)).

2. **Forgetting to check validity in executeTask:** When popping from the heap, you must verify the task hasn't been modified or removed. Skipping this check returns stale data.

3. **Not handling duplicate task IDs in addTask:** The problem doesn't explicitly forbid duplicate task IDs. A good implementation should handle this (either reject or treat as modification).

4. **Using TreeSet instead of heap + hash map:** Some candidates try to use a balanced BST (TreeSet in Java), but modifying priorities still requires removing and reinserting (O(log n)), which is similar to our solution but with more complex code.

## When You'll See This Pattern

This "heap + hash map with lazy deletion" pattern appears in problems requiring priority queues with updates:

1. **LeetCode 355: Design Twitter** - Similar pattern for merging feeds from followed users
2. **LeetCode 895: Maximum Frequency Stack** - Uses frequency as priority with stack behavior
3. **LeetCode 460: LFU Cache** - Similar update pattern for frequency counts
4. **Dijkstra's Algorithm with priority queue** - When distances are updated, we use lazy deletion

The core idea is always the same: when you can't efficiently update elements in a heap, mark old entries as invalid and add new ones.

## Key Takeaways

1. **Heap + Hash Map is powerful:** For dynamic priority management where updates are needed, combine a heap for efficient max/min retrieval with a hash map for O(1) lookups and updates.

2. **Lazy deletion solves the update problem:** Instead of trying to update elements in a heap (which requires O(n) search), mark old entries as invalid and add new ones. Clean up invalid entries when they surface.

3. **Always validate heap pops:** When retrieving from a heap with lazy deletion, check if the entry is still valid by comparing with the authoritative source (hash map).

[Practice this problem on CodeJeet](/problem/design-task-manager)
