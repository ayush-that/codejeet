---
title: "How to Solve Course Schedule II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Course Schedule II. Medium difficulty, 55.0% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory, Topological Sort."
date: "2026-06-28"
category: "dsa-patterns"
tags: ["course-schedule-ii", "depth-first-search", "breadth-first-search", "graph-theory", "medium"]
---

# How to Solve Course Schedule II

You're given a number of courses and prerequisites between them, and you need to return a valid order to take all courses (if possible). This is essentially asking for a topological ordering of a directed graph where courses are nodes and prerequisites are directed edges. The tricky part is detecting cycles—if there's a cycle in the prerequisites, you can't complete all courses, and you need to return an empty array.

## Visual Walkthrough

Let's trace through a concrete example:

- `numCourses = 4`
- `prerequisites = [[1,0],[2,0],[3,1],[3,2]]`

This means:

- Course 0 has no prerequisites
- Course 1 requires course 0
- Course 2 requires course 0
- Course 3 requires both courses 1 and 2

We can visualize this as a graph:

```
0 → 1 → 3
  ↘ 2 ↗
```

A valid order would be `[0,1,2,3]` or `[0,2,1,3]`. Both work because:

1. Take course 0 first (no prerequisites)
2. Then take courses 1 and 2 (both only require course 0)
3. Finally take course 3 (requires both 1 and 2)

Now let's add a cycle: `prerequisites = [[1,0],[0,1]]`

- Course 1 requires course 0
- Course 0 requires course 1

This creates a cycle: `0 ↔ 1`. No valid order exists, so we return `[]`.

## Brute Force Approach

A naive approach might try to simulate taking courses:

1. Start with courses that have no prerequisites
2. Take those courses
3. Remove them from prerequisites of other courses
4. Repeat until all courses are taken or no progress is made

While this is actually the right _algorithm_ (Kahn's algorithm), a brute force implementation would be inefficient if we don't use proper data structures. For example, if we store prerequisites as a list and scan it repeatedly to find courses with zero prerequisites, we'd have O(n²) time complexity.

What a candidate might try that definitely won't work:

- Trying all permutations of courses (O(n!)) and checking if each satisfies prerequisites
- Using DFS without cycle detection and getting stuck in infinite loops

The key insight is that we need both:

1. Efficient tracking of how many prerequisites each course has (in-degree)
2. A way to detect cycles during the ordering process

## Optimized Approach

We have two main approaches, both using topological sort:

### 1. Kahn's Algorithm (BFS-based)

- Calculate in-degree (number of prerequisites) for each course
- Use a queue to process courses with zero in-degree
- When we take a course, reduce in-degree of courses that depend on it
- If we process all courses, we have a valid order; otherwise, there's a cycle

### 2. DFS with Coloring

- Use three states: unvisited (0), visiting (1), visited (2)
- Perform DFS from each unvisited node
- If we encounter a node that's currently being visited (state 1), we found a cycle
- Add nodes to result in reverse post-order (when marking as visited)

Both approaches run in O(V + E) time where V is numCourses and E is number of prerequisites. Kahn's algorithm is often preferred for its iterative nature and clearer cycle detection.

## Optimal Solution

Here's the Kahn's algorithm implementation:

<div class="code-group">

```python
# Time: O(V + E) where V = numCourses, E = len(prerequisites)
# Space: O(V + E) for adjacency list and in-degree array
def findOrder(numCourses, prerequisites):
    """
    Returns a valid course order or empty list if impossible.
    Uses Kahn's algorithm for topological sorting.
    """
    # Step 1: Build adjacency list and in-degree array
    # adj[u] = list of courses that require course u
    adj = [[] for _ in range(numCourses)]
    in_degree = [0] * numCourses

    for course, prereq in prerequisites:
        adj[prereq].append(course)  # prereq -> course
        in_degree[course] += 1

    # Step 2: Initialize queue with courses having no prerequisites
    from collections import deque
    queue = deque()
    for course in range(numCourses):
        if in_degree[course] == 0:
            queue.append(course)

    # Step 3: Process courses in topological order
    result = []
    while queue:
        current = queue.popleft()
        result.append(current)

        # For each course that depends on current course
        for neighbor in adj[current]:
            in_degree[neighbor] -= 1
            # If neighbor now has no prerequisites, add to queue
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # Step 4: Check if we processed all courses
    # If result length < numCourses, there's a cycle
    return result if len(result) == numCourses else []
```

```javascript
// Time: O(V + E) where V = numCourses, E = prerequisites.length
// Space: O(V + E) for adjacency list and in-degree array
function findOrder(numCourses, prerequisites) {
  // Step 1: Build adjacency list and in-degree array
  const adj = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array(numCourses).fill(0);

  for (const [course, prereq] of prerequisites) {
    adj[prereq].push(course); // prereq -> course
    inDegree[course]++;
  }

  // Step 2: Initialize queue with courses having no prerequisites
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }

  // Step 3: Process courses in topological order
  const result = [];
  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);

    // For each course that depends on current course
    for (const neighbor of adj[current]) {
      inDegree[neighbor]--;
      // If neighbor now has no prerequisites, add to queue
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Step 4: Check if we processed all courses
  // If result length < numCourses, there's a cycle
  return result.length === numCourses ? result : [];
}
```

```java
// Time: O(V + E) where V = numCourses, E = prerequisites.length
// Space: O(V + E) for adjacency list and in-degree array
public int[] findOrder(int numCourses, int[][] prerequisites) {
    // Step 1: Build adjacency list and in-degree array
    List<Integer>[] adj = new ArrayList[numCourses];
    int[] inDegree = new int[numCourses];

    for (int i = 0; i < numCourses; i++) {
        adj[i] = new ArrayList<>();
    }

    for (int[] prereq : prerequisites) {
        int course = prereq[0];
        int required = prereq[1];
        adj[required].add(course);  // required -> course
        inDegree[course]++;
    }

    // Step 2: Initialize queue with courses having no prerequisites
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) {
            queue.offer(i);
        }
    }

    // Step 3: Process courses in topological order
    int[] result = new int[numCourses];
    int index = 0;

    while (!queue.isEmpty()) {
        int current = queue.poll();
        result[index++] = current;

        // For each course that depends on current course
        for (int neighbor : adj[current]) {
            inDegree[neighbor]--;
            // If neighbor now has no prerequisites, add to queue
            if (inDegree[neighbor] == 0) {
                queue.offer(neighbor);
            }
        }
    }

    // Step 4: Check if we processed all courses
    // If index < numCourses, there's a cycle
    return index == numCourses ? result : new int[0];
}
```

</div>

## Complexity Analysis

**Time Complexity: O(V + E)**

- Building adjacency list and in-degree array: O(E)
- Initial queue setup: O(V)
- Processing queue: Each node and edge visited once, O(V + E)

**Space Complexity: O(V + E)**

- Adjacency list: O(E) to store all edges
- In-degree array: O(V)
- Queue: O(V) in worst case
- Result array: O(V)

Where V = numCourses and E = number of prerequisites.

## Common Mistakes

1. **Wrong edge direction**: The most common mistake is building the graph backwards. Remember: `[a, b]` means `b → a` (b is prerequisite for a). If you reverse this, your topological sort will be wrong.

2. **Missing cycle detection**: Forgetting to check if result length equals numCourses. Without this check, you might return a partial ordering when there's actually a cycle.

3. **Inefficient cycle detection**: Trying to detect cycles separately before topological sort. This adds unnecessary complexity. The beauty of Kahn's algorithm is that it naturally detects cycles—if there's a cycle, some nodes will never reach in-degree 0.

4. **Using stack instead of queue for BFS**: While both work for topological sort, queue gives a more intuitive level-by-level order. Stack would give a different valid ordering but still correct.

## When You'll See This Pattern

Topological sort appears in problems involving dependencies, ordering constraints, or directed acyclic graphs (DAGs):

1. **Course Schedule I** (LeetCode 207): Almost identical problem—just returns boolean instead of the ordering. Practice this first to understand the cycle detection.

2. **Alien Dictionary** (LeetCode 269): Build a graph from word comparisons, then topological sort to find letter order. The challenge is extracting constraints from the dictionary.

3. **Minimum Height Trees** (LeetCode 310): While not exactly topological sort, it uses similar BFS layer-by-layer removal starting from leaves (nodes with degree 1).

4. **Sequence Reconstruction** (LeetCode 444): Check if a sequence is the unique topological order of a graph.

## Key Takeaways

1. **Topological sort = dependency resolution**: When you see problems about prerequisites, build order, or task scheduling, think topological sort.

2. **Cycle detection is built-in**: With Kahn's algorithm, if you can't process all nodes, there's a cycle. No need for separate DFS cycle detection.

3. **Two equivalent approaches**: Kahn's (BFS) and DFS with coloring both work. Kahn's is often easier to implement correctly in interviews.

4. **Graph direction matters**: Always double-check edge direction. Draw a small example to verify your adjacency list is correct.

Remember: Practice recognizing when to use topological sort. Any problem with "must come before" constraints is a candidate for this pattern.

Related problems: [Course Schedule](/problem/course-schedule), [Alien Dictionary](/problem/alien-dictionary), [Minimum Height Trees](/problem/minimum-height-trees)
