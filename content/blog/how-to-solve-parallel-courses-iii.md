---
title: "How to Solve Parallel Courses III — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Parallel Courses III. Hard difficulty, 66.8% acceptance rate. Topics: Array, Dynamic Programming, Graph Theory, Topological Sort."
date: "2027-04-05"
category: "dsa-patterns"
tags: ["parallel-courses-iii", "array", "dynamic-programming", "graph-theory", "hard"]
---

# How to Solve Parallel Courses III

You're given `n` courses with individual completion times and prerequisite relationships. The challenge is to find the **minimum time** needed to complete all courses when you can take multiple courses simultaneously, as long as their prerequisites are satisfied. What makes this problem tricky is that it combines topological ordering with dynamic programming—you need to process courses in dependency order while tracking the cumulative time to reach each course.

## Visual Walkthrough

Let's trace through a concrete example:

- `n = 3`, `time = [1, 2, 3]` (course 1 takes 1 month, course 2 takes 2, course 3 takes 3)
- `relations = [[1, 3], [2, 3]]` (course 1 and 2 are prerequisites for course 3)

**Step 1: Build the dependency graph**

- Course 1 → Course 3
- Course 2 → Course 3
- Course 3 has no outgoing edges

**Step 2: Identify courses with no prerequisites**

- Courses 1 and 2 have no incoming edges
- We can start both simultaneously at time 0

**Step 3: Process course 1**

- Completion time = start time (0) + time[0] (1) = 1
- Update course 3's earliest start time to max(current, 1)

**Step 4: Process course 2**

- Completion time = 0 + 2 = 2
- Update course 3's earliest start time to max(1, 2) = 2

**Step 5: Process course 3**

- All prerequisites satisfied when both 1 and 2 are done → start time = 2
- Completion time = 2 + 3 = 5

**Result:** Minimum time = 5 months

The key insight: For each course, you can only start when **all** its prerequisites are completed. Since prerequisites can finish at different times, you need the **maximum** completion time among all prerequisites.

## Brute Force Approach

A naive approach might try all possible course sequences that respect prerequisites. For each valid topological ordering, you'd simulate parallel execution by tracking when each course becomes available. However, this is extremely inefficient:

1. Generate all topological orderings (O(n!·n) worst case)
2. For each ordering, compute completion times
3. Track the minimum across all orderings

The problem is exponential because there can be many valid orderings. Even with optimizations, this approach doesn't scale beyond tiny inputs. The brute force fails because it doesn't leverage the fact that courses can run in parallel—it treats the problem as purely sequential.

## Optimized Approach

The optimal solution combines **topological sort** with **dynamic programming**:

**Key Insight:** The earliest completion time for a course equals its own duration plus the **maximum** completion time among all its prerequisites. This is because all prerequisites must finish before the course can start, and they may finish at different times when taken in parallel.

**Step-by-step reasoning:**

1. **Build the graph:** Create adjacency lists for prerequisites (which courses depend on this one) and dependencies (which courses this one enables).
2. **Initialize DP array:** `dp[i]` stores the minimum time to complete course `i+1`.
3. **Find starting points:** Courses with no prerequisites can start immediately at time 0.
4. **Process in topological order:** Use Kahn's algorithm (BFS-based topological sort):
   - When we process a course, we know all its prerequisites are done
   - Calculate its completion time: `dp[course] = time[course] + max(dp[prereq] for all prereqs)`
   - Update its dependents: Decrease their prerequisite count; if it reaches 0, they're ready to process
5. **Track maximum:** The answer is the maximum value in `dp` since all courses must finish.

This works because topological ordering ensures we process each course only after all its prerequisites have been processed, giving us their final completion times.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = number of courses, m = number of relations
# Space: O(n + m) for the graph and auxiliary data structures
def minimumTime(n, time, relations):
    """
    Calculate minimum time to complete all courses with prerequisites.

    Args:
        n: number of courses (1-indexed)
        time: list of course durations (0-indexed by course-1)
        relations: list of [prev, next] prerequisite pairs

    Returns:
        Minimum months to complete all courses
    """
    # Step 1: Build the graph and track prerequisites count
    # graph[node] = list of courses that depend on this node
    graph = [[] for _ in range(n)]
    # in_degree[node] = number of prerequisites for this node
    in_degree = [0] * n

    for prev, next_course in relations:
        # Convert to 0-based indexing
        prev -= 1
        next_course -= 1
        graph[prev].append(next_course)
        in_degree[next_course] += 1

    # Step 2: Initialize DP array and queue
    # dp[i] = minimum time to complete course i (0-indexed)
    dp = [0] * n
    queue = []

    # Step 3: Find courses with no prerequisites (in_degree = 0)
    for i in range(n):
        if in_degree[i] == 0:
            queue.append(i)
            # Courses with no prerequisites can start immediately
            dp[i] = time[i]

    # Step 4: Process courses in topological order
    for course in queue:
        # For each course that depends on the current course
        for dependent in graph[course]:
            # Update the dependent's earliest start time
            # It can only start after ALL prerequisites are done,
            # so we take the maximum completion time
            dp[dependent] = max(dp[dependent], dp[course])

            # Decrease prerequisite count
            in_degree[dependent] -= 1

            # If all prerequisites are satisfied, process this course
            if in_degree[dependent] == 0:
                # Add the course's own duration to the start time
                dp[dependent] += time[dependent]
                queue.append(dependent)

    # Step 5: The answer is the maximum completion time
    return max(dp)
```

```javascript
// Time: O(n + m) where n = number of courses, m = number of relations
// Space: O(n + m) for the graph and auxiliary data structures
function minimumTime(n, time, relations) {
  // Step 1: Build the graph and track prerequisites count
  // graph[node] = array of courses that depend on this node
  const graph = Array.from({ length: n }, () => []);
  // inDegree[node] = number of prerequisites for this node
  const inDegree = new Array(n).fill(0);

  for (const [prev, nextCourse] of relations) {
    // Convert to 0-based indexing
    const prevIdx = prev - 1;
    const nextIdx = nextCourse - 1;
    graph[prevIdx].push(nextIdx);
    inDegree[nextIdx]++;
  }

  // Step 2: Initialize DP array and queue
  // dp[i] = minimum time to complete course i (0-indexed)
  const dp = new Array(n).fill(0);
  const queue = [];

  // Step 3: Find courses with no prerequisites (inDegree = 0)
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
      // Courses with no prerequisites can start immediately
      dp[i] = time[i];
    }
  }

  // Step 4: Process courses in topological order
  for (let i = 0; i < queue.length; i++) {
    const course = queue[i];

    // For each course that depends on the current course
    for (const dependent of graph[course]) {
      // Update the dependent's earliest start time
      // It can only start after ALL prerequisites are done,
      // so we take the maximum completion time
      dp[dependent] = Math.max(dp[dependent], dp[course]);

      // Decrease prerequisite count
      inDegree[dependent]--;

      // If all prerequisites are satisfied, process this course
      if (inDegree[dependent] === 0) {
        // Add the course's own duration to the start time
        dp[dependent] += time[dependent];
        queue.push(dependent);
      }
    }
  }

  // Step 5: The answer is the maximum completion time
  return Math.max(...dp);
}
```

```java
// Time: O(n + m) where n = number of courses, m = number of relations
// Space: O(n + m) for the graph and auxiliary data structures
public int minimumTime(int n, int[] time, int[][] relations) {
    // Step 1: Build the graph and track prerequisites count
    // graph[node] = list of courses that depend on this node
    List<Integer>[] graph = new ArrayList[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new ArrayList<>();
    }
    // inDegree[node] = number of prerequisites for this node
    int[] inDegree = new int[n];

    for (int[] relation : relations) {
        // Convert to 0-based indexing
        int prev = relation[0] - 1;
        int nextCourse = relation[1] - 1;
        graph[prev].add(nextCourse);
        inDegree[nextCourse]++;
    }

    // Step 2: Initialize DP array and queue
    // dp[i] = minimum time to complete course i (0-indexed)
    int[] dp = new int[n];
    Queue<Integer> queue = new LinkedList<>();

    // Step 3: Find courses with no prerequisites (inDegree = 0)
    for (int i = 0; i < n; i++) {
        if (inDegree[i] == 0) {
            queue.offer(i);
            // Courses with no prerequisites can start immediately
            dp[i] = time[i];
        }
    }

    // Step 4: Process courses in topological order
    while (!queue.isEmpty()) {
        int course = queue.poll();

        // For each course that depends on the current course
        for (int dependent : graph[course]) {
            // Update the dependent's earliest start time
            // It can only start after ALL prerequisites are done,
            // so we take the maximum completion time
            dp[dependent] = Math.max(dp[dependent], dp[course]);

            // Decrease prerequisite count
            inDegree[dependent]--;

            // If all prerequisites are satisfied, process this course
            if (inDegree[dependent] == 0) {
                // Add the course's own duration to the start time
                dp[dependent] += time[dependent];
                queue.offer(dependent);
            }
        }
    }

    // Step 5: The answer is the maximum completion time
    int maxTime = 0;
    for (int t : dp) {
        maxTime = Math.max(maxTime, t);
    }
    return maxTime;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Building the graph: O(m) where m is the number of relations
- Initializing arrays: O(n)
- Topological sort (BFS): O(n + m) since we visit each node and edge once
- Finding maximum: O(n)

**Space Complexity: O(n + m)**

- Graph adjacency list: O(n + m)
- `in_degree` array: O(n)
- `dp` array: O(n)
- Queue: O(n) in worst case

The linear complexity makes this solution efficient even for large inputs (n up to 5×10⁴ in typical constraints).

## Common Mistakes

1. **Forgetting to convert to 0-based indexing:** The problem uses 1-indexed courses, but arrays are 0-indexed. Always subtract 1 when accessing arrays.
   - Fix: `prev -= 1; next_course -= 1` before using as indices.

2. **Adding course duration at the wrong time:** Some candidates add `time[course]` immediately when adding to queue, but this only works for courses with no prerequisites. For others, you must wait until all prerequisites are processed to know the correct start time.
   - Fix: Add `time[course]` only when `in_degree[dependent] == 0`.

3. **Using DFS without memoization:** A recursive DFS that recomputes completion times for each path leads to exponential time.
   - Fix: Use topological sort (BFS) or DFS with memoization to ensure each course is computed once.

4. **Not handling cycles:** While the problem states it's a DAG, in interviews you might need to handle invalid input with cycles.
   - Fix: Add cycle detection by tracking processed count vs n.

## When You'll See This Pattern

This "topological sort + DP" pattern appears in scheduling problems with dependencies:

1. **Course Schedule II (Medium):** Find a valid ordering of courses with prerequisites. Same graph structure but simpler—no durations to track.

2. **Alien Dictionary (Hard):** Reconstruct alphabet order from word comparisons. Uses topological sort on character dependencies.

3. **Longest Increasing Path in a Matrix (Hard):** Find the longest path in a grid where each step must go to a larger value. Uses DFS with memoization on a DAG formed by the "greater than" relation.

The pattern is: when you have tasks/nodes with dependencies (a DAG) and need to compute some cumulative value (time, distance, count), think topological sort combined with DP.

## Key Takeaways

1. **Topological sort + DP is powerful for dependency problems:** When tasks have prerequisites and you need to compute cumulative metrics, process in dependency order while storing results.

2. **Parallel execution changes the math:** Unlike sequential problems where you sum durations, with parallel execution you take the **maximum** of prerequisite completion times.

3. **Kahn's algorithm (BFS) is often cleaner than DFS:** For topological sort with DP updates, the BFS approach naturally processes nodes when all prerequisites are ready.

**Related problems:** [Course Schedule III](/problem/course-schedule-iii), [Parallel Courses](/problem/parallel-courses), [Single-Threaded CPU](/problem/single-threaded-cpu)
