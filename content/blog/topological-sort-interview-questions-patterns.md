---
title: "Topological Sort Interview Questions: Patterns and Strategies"
description: "Master Topological Sort problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-03-05"
category: "dsa-patterns"
tags: ["topological-sort", "dsa", "interview prep"]
---

# Topological Sort Interview Questions: Patterns and Strategies

Topological sort is a fundamental algorithm for ordering nodes in a directed acyclic graph (DAG) where each edge implies a dependency. In coding interviews, it’s rarely asked as a standalone algorithm. Instead, it appears as a critical step in solving problems involving scheduling, build systems, course prerequisites, or any scenario with ordering constraints. Mastering topological sort means you can recognize when a problem is about dependencies and ordering—a pattern that turns complex problems into manageable ones.

## Common Patterns

You’ll encounter topological sort in a few recurring scenarios. Recognizing these patterns lets you map the problem to a graph and apply the standard Kahn's algorithm or DFS-based sorting.

### 1. Course Schedule and Prerequisites

This is the most classic pattern. You’re given `n` items (courses, tasks) and a list of prerequisites `[a, b]` meaning you must complete `b` before `a`. The goal is to determine if a valid order exists (cycle detection) or to return one.

<div class="code-group">

```python
from collections import deque, defaultdict

def find_order(num_courses, prerequisites):
    graph = defaultdict(list)
    indegree = [0] * num_courses

    for course, prereq in prerequisites:
        graph[prereq].append(course)
        indegree[course] += 1

    queue = deque([i for i in range(num_courses) if indegree[i] == 0])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)

    return order if len(order) == num_courses else []
```

```javascript
function findOrder(numCourses, prerequisites) {
  const graph = new Array(numCourses).fill(0).map(() => []);
  const indegree = new Array(numCourses).fill(0);

  for (let [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    indegree[course]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of graph[node]) {
      indegree[neighbor]--;
      if (indegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  return order.length === numCourses ? order : [];
}
```

```java
import java.util.*;

public class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<Integer>[] graph = new ArrayList[numCourses];
        int[] indegree = new int[numCourses];

        for (int i = 0; i < numCourses; i++) {
            graph[i] = new ArrayList<>();
        }

        for (int[] pair : prerequisites) {
            int course = pair[0], prereq = pair[1];
            graph[prereq].add(course);
            indegree[course]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) queue.offer(i);
        }

        int[] order = new int[numCourses];
        int idx = 0;
        while (!queue.isEmpty()) {
            int node = queue.poll();
            order[idx++] = node;
            for (int neighbor : graph[node]) {
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    queue.offer(neighbor);
                }
            }
        }

        return idx == numCourses ? order : new int[0];
    }
}
```

</div>

### 2. Alien Dictionary

Given a sorted list of words from an alien language, derive the character order. Each adjacent word pair gives a constraint: the first differing character implies `c1 < c2` in the alien alphabet. Build a graph of characters and perform topological sort.

### 3. Task Scheduling with Conditions

Tasks have prerequisites, but you may have additional constraints like minimum time intervals or parallel execution. The core is still topological sort, often augmented with a max-heap (for earliest finish time) or a queue for BFS level-by-level processing.

<div class="code-group">

```python
from collections import deque, defaultdict
import heapq

def schedule_tasks(tasks, prerequisites, k):
    # k is the cooldown between identical tasks
    # This variant often uses a max-heap for earliest available time
    # Standard topological sort sets up the dependency graph.
    graph = defaultdict(list)
    indegree = defaultdict(int)
    for a, b in prerequisites:
        graph[b].append(a)
        indegree[a] += 1

    # ... combined with a heap to manage scheduling
    # This is a simplified structure for the pattern.
    available = [task for task in tasks if indegree[task] == 0]
    heapq.heapify(available)
    order = []
    while available:
        task = heapq.heappop(available)
        order.append(task)
        # Process neighbors and manage cooldown logic
    return order
```

```javascript
// Pattern skeleton for task scheduling with heaps
function scheduleTasks(tasks, prerequisites, k) {
  const graph = new Map();
  const indegree = new Map();

  // Build graph and indegree
  // ...

  const minHeap = [];
  tasks.forEach((task) => {
    if ((indegree.get(task) || 0) === 0) {
      minHeap.push(task);
    }
  });
  minHeap.sort((a, b) => a - b);

  const order = [];
  while (minHeap.length) {
    const task = minHeap.shift();
    order.push(task);
    // Process neighbors and handle cooldown
  }
  return order;
}
```

```java
import java.util.*;

public class TaskScheduler {
    public List<Character> scheduleTasks(char[] tasks, int[][] prerequisites, int k) {
        Map<Character, List<Character>> graph = new HashMap<>();
        Map<Character, Integer> indegree = new HashMap<>();

        // Build graph
        // ...

        PriorityQueue<Character> minHeap = new PriorityQueue<>();
        for (char task : tasks) {
            if (indegree.getOrDefault(task, 0) == 0) {
                minHeap.offer(task);
            }
        }

        List<Character> order = new ArrayList<>();
        while (!minHeap.isEmpty()) {
            char task = minHeap.poll();
            order.add(task);
            // Process neighbors
        }
        return order;
    }
}
```

</div>

## Difficulty Breakdown

Our dataset of 26 questions shows a clear skew: **0% Easy, 38% Medium, 62% Hard**. This split is revealing.

- **No Easy Questions:** Topological sort is rarely a trivial one-step problem. Even basic implementations require building a graph, managing indegree, and handling cycle detection.
- **Medium (38%):** These are standard applications: Course Schedule I/II, Alien Dictionary (simpler versions). You must recognize the pattern and implement the algorithm correctly.
- **Hard (62%):** The majority are hard because topological sort is often just the foundation. You’ll layer on:
  - Parallel execution (minimum time to finish all tasks).
  - Complex cycle detection within larger systems.
  - Reconstructing specific orders from partial data.
  - Combining with other algorithms (DFS for strong components, Dijkstra for weighted edges).

This distribution means you must be comfortable extending the basic algorithm. Practice isn't about memorizing code—it's about adapting the core idea to new constraints.

## Which Companies Ask Topological Sort

Topological sort is a favorite at companies that design large-scale systems, compilers, or scheduling software. The top askers are:

- [Google](/company/google) – Frequently asks complex scheduling and dependency problems.
- [Amazon](/company/amazon) – Common in questions about build systems and order fulfillment pipelines.
- [Meta](/company/meta) – Appears in problems related to job scheduling and social graph dependencies.
- [Microsoft](/company/microsoft) – Often tied to compiler design and package management scenarios.
- [Bloomberg](/company/bloomberg) – Used in financial data processing pipelines with ordering constraints.

## Study Tips

1.  **Start with the Classic:** Implement Kahn's algorithm (BFS with indegree) and DFS-based topological sort from memory. Kahn's is often easier to adapt for interview problems.
2.  **Map the Problem to a Graph:** When you see "prerequisite," "order," "before/after," or "dependency," immediately think: nodes are items, edges are relationships. Write that mapping down as your first step.
3.  **Practice Cycle Detection:** The question "is it possible?" is really "is there a cycle?" Implement cycle detection using the same BFS/DFS traversal. If processed nodes < total nodes, there's a cycle.
4.  **Extend Incrementally:** For hard problems, solve the basic topological sort first. Then, step-by-step, add the new constraint (e.g., parallel execution, time intervals). This shows structured thinking.

Topological sort is a pattern-based weapon. Recognize the dependency graph, apply the algorithm, and layer on the extra logic. The high percentage of hard questions means your practice should focus on adaptation, not just recall.

[Practice all Topological Sort questions on CodeJeet](/topic/topological-sort)
