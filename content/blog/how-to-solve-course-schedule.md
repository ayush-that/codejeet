---
title: "How to Solve Course Schedule — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Course Schedule. Medium difficulty, 50.8% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory, Topological Sort."
date: "2026-04-25"
category: "dsa-patterns"
tags: ["course-schedule", "depth-first-search", "breadth-first-search", "graph-theory", "medium"]
---

# How to Solve Course Schedule

You're given a number of courses and prerequisites between them. The task is to determine whether it's possible to complete all courses given these dependencies. This is essentially asking: "Is this directed graph acyclic?" because if there's a cycle in the prerequisites, you'd need to take course A before B, B before C, and C before A — an impossible situation.

What makes this problem interesting is that it's a classic **topological sort** problem disguised as a scheduling question. You need to recognize that courses form nodes in a graph, and prerequisites form directed edges. The solution requires either DFS cycle detection or Kahn's algorithm (BFS-based topological sort).

## Visual Walkthrough

Let's trace through a concrete example:

**Input:** `numCourses = 4`, `prerequisites = [[1,0],[2,1],[3,2]]`

This means:

- Course 1 requires course 0
- Course 2 requires course 1
- Course 3 requires course 2

We can visualize this as a graph:

```
0 → 1 → 2 → 3
```

No cycles exist here. We can take courses in order: 0, then 1, then 2, then 3.

Now let's add a cycle:

**Input:** `numCourses = 3`, `prerequisites = [[1,0],[2,1],[0,2]]`

This means:

- Course 1 requires course 0
- Course 2 requires course 1
- Course 0 requires course 2

Visualization:

```
0 → 1 → 2
↑         |
└─────────┘
```

This creates a cycle: 0 → 1 → 2 → 0. No valid ordering exists because each course requires another in the cycle to be taken first.

## Brute Force Approach

A naive approach might try to simulate taking courses: repeatedly find courses with no prerequisites, "take" them, and remove them from other courses' requirements. While this is actually the optimal BFS approach, a truly brute force method might try all permutations of courses (n! possibilities) and check if any satisfies all prerequisites. That's O(n!) time — impossibly slow for n=1000.

Another naive approach would be to recursively check each course's prerequisites without tracking visited states, leading to exponential time. For example, starting from course 0, we check its prerequisites, then their prerequisites, etc., potentially revisiting the same nodes many times.

The key insight: we need to detect cycles efficiently in a directed graph. Without cycle detection, we might get stuck in infinite recursion or miss the fact that some courses form a dependency loop.

## Optimized Approach

We have two optimal approaches, both O(V+E) time where V is numCourses and E is prerequisites.length:

### 1. DFS with Cycle Detection (Three-State Marking)

We perform DFS on the graph, marking nodes with three states:

- `0` = unvisited
- `1` = visiting (in the current DFS path)
- `2` = visited (fully processed)

If during DFS we encounter a node marked as `1` (visiting), we've found a back edge → cycle exists. This works because `1` means the node is in our current recursion stack.

### 2. Kahn's Algorithm (BFS/Topological Sort)

1. Build adjacency list and in-degree count for each node
2. Add all nodes with in-degree 0 to a queue
3. While queue not empty:
   - Remove a node, add to topological order
   - For each neighbor, decrement its in-degree
   - If neighbor's in-degree becomes 0, add to queue
4. If topological order contains all nodes → no cycle

Both approaches are optimal. DFS uses less code but requires careful state management. BFS is more intuitive for topological sort but requires building the graph structure first.

## Optimal Solution

Here are complete implementations of both approaches:

<div class="code-group">

```python
# Approach 1: DFS Cycle Detection
# Time: O(V + E) where V = numCourses, E = len(prerequisites)
# Space: O(V + E) for adjacency list and recursion stack
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # Build adjacency list: course -> list of courses that depend on it
        # Actually, we need: course -> list of courses it depends on (prerequisites)
        # But for DFS cycle detection, we need outgoing edges: course -> courses it points to
        # Let's use: graph[course] = list of courses that require this course as prerequisite
        # Wait, that's incoming edges. For DFS, we want outgoing: course -> courses it requires
        # So: graph[prereq] = [course] means prereq must be taken before course
        # Actually standard: graph[course] = [prereqs] means course requires these prereqs
        # Let me clarify: For [a,b] where a requires b, we want b -> a edge
        # Because b must come before a in topological order

        graph = [[] for _ in range(numCourses)]
        for course, prereq in prerequisites:
            graph[prereq].append(course)  # prereq must come before course

        # States: 0 = unvisited, 1 = visiting (in current DFS path), 2 = visited
        state = [0] * numCourses

        def has_cycle(course):
            if state[course] == 1:  # Found a back edge → cycle
                return True
            if state[course] == 2:  # Already processed, no cycle from here
                return False

            state[course] = 1  # Mark as visiting

            # Check all courses that depend on this one
            for next_course in graph[course]:
                if has_cycle(next_course):
                    return True

            state[course] = 2  # Mark as fully processed
            return False

        # Check each course for cycles
        for course in range(numCourses):
            if state[course] == 0:  # Only start DFS from unvisited nodes
                if has_cycle(course):
                    return False

        return True

# Approach 2: Kahn's Algorithm (BFS/Topological Sort)
# Time: O(V + E) | Space: O(V + E)
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # Build adjacency list and in-degree count
        graph = [[] for _ in range(numCourses)]
        in_degree = [0] * numCourses

        # For each prerequisite [course, prereq]:
        # prereq must come before course, so edge goes from prereq to course
        for course, prereq in prerequisites:
            graph[prereq].append(course)  # prereq -> course
            in_degree[course] += 1  # course has one more incoming edge

        # Initialize queue with all nodes having 0 in-degree
        from collections import deque
        queue = deque([i for i in range(numCourses) if in_degree[i] == 0])

        count_processed = 0

        # Process nodes in topological order
        while queue:
            current = queue.popleft()
            count_processed += 1

            # For each course that depends on current
            for neighbor in graph[current]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        # If we processed all courses, no cycle exists
        return count_processed == numCourses
```

```javascript
// Approach 1: DFS Cycle Detection
// Time: O(V + E) | Space: O(V + E)
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function (numCourses, prerequisites) {
  // Build adjacency list: graph[prereq] = [courses that require this prereq]
  const graph = new Array(numCourses).fill(0).map(() => []);
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course); // prereq must come before course
  }

  // States: 0 = unvisited, 1 = visiting, 2 = visited
  const state = new Array(numCourses).fill(0);

  const hasCycle = (course) => {
    if (state[course] === 1) return true; // Found cycle
    if (state[course] === 2) return false; // Already processed

    state[course] = 1; // Mark as visiting

    // Check all dependent courses
    for (const nextCourse of graph[course]) {
      if (hasCycle(nextCourse)) {
        return true;
      }
    }

    state[course] = 2; // Mark as visited
    return false;
  };

  // Check each course for cycles
  for (let course = 0; course < numCourses; course++) {
    if (state[course] === 0) {
      if (hasCycle(course)) {
        return false;
      }
    }
  }

  return true;
};

// Approach 2: Kahn's Algorithm (BFS)
// Time: O(V + E) | Space: O(V + E)
var canFinish = function (numCourses, prerequisites) {
  // Build graph and in-degree array
  const graph = new Array(numCourses).fill(0).map(() => []);
  const inDegree = new Array(numCourses).fill(0);

  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }

  // Initialize queue with nodes having 0 in-degree
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }

  let processedCount = 0;

  // Process nodes in topological order
  while (queue.length > 0) {
    const current = queue.shift();
    processedCount++;

    // Reduce in-degree of neighbors
    for (const neighbor of graph[current]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If all nodes processed, no cycle
  return processedCount === numCourses;
};
```

```java
// Approach 1: DFS Cycle Detection
// Time: O(V + E) | Space: O(V + E)
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Build adjacency list
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }

        for (int[] prereq : prerequisites) {
            int course = prereq[0];
            int required = prereq[1];
            graph.get(required).add(course);  // required -> course
        }

        // States: 0 = unvisited, 1 = visiting, 2 = visited
        int[] state = new int[numCourses];

        // DFS to detect cycles
        for (int course = 0; course < numCourses; course++) {
            if (state[course] == 0) {
                if (hasCycle(graph, state, course)) {
                    return false;
                }
            }
        }

        return true;
    }

    private boolean hasCycle(List<List<Integer>> graph, int[] state, int course) {
        if (state[course] == 1) return true;  // Cycle detected
        if (state[course] == 2) return false; // Already processed

        state[course] = 1;  // Mark as visiting

        // Check all courses that depend on this one
        for (int nextCourse : graph.get(course)) {
            if (hasCycle(graph, state, nextCourse)) {
                return true;
            }
        }

        state[course] = 2;  // Mark as visited
        return false;
    }
}

// Approach 2: Kahn's Algorithm (BFS)
// Time: O(V + E) | Space: O(V + E)
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Build graph and in-degree array
        List<List<Integer>> graph = new ArrayList<>();
        int[] inDegree = new int[numCourses];

        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }

        for (int[] prereq : prerequisites) {
            int course = prereq[0];
            int required = prereq[1];
            graph.get(required).add(course);
            inDegree[course]++;
        }

        // Initialize queue with 0 in-degree nodes
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) {
                queue.offer(i);
            }
        }

        int processedCount = 0;

        // Process in topological order
        while (!queue.isEmpty()) {
            int current = queue.poll();
            processedCount++;

            // Reduce in-degree of neighbors
            for (int neighbor : graph.get(current)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) {
                    queue.offer(neighbor);
                }
            }
        }

        // All nodes processed = no cycle
        return processedCount == numCourses;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(V + E)**

- **V** = numCourses (vertices/nodes)
- **E** = prerequisites.length (edges)
- We visit each node once and traverse each edge once in both DFS and BFS approaches.

**Space Complexity: O(V + E)**

- **O(V)** for state arrays (DFS) or in-degree arrays (BFS)
- **O(E)** for adjacency list storage
- **O(V)** for recursion stack (DFS worst case) or queue (BFS)

The space is dominated by the graph representation, which stores all edges.

## Common Mistakes

1. **Incorrect graph direction**: Building `graph[course] = prereq` instead of `graph[prereq] = course`. Remember: if course A requires B, then B must come before A in topological order, so the edge goes from B to A.

2. **Missing the three-state system in DFS**: Using only visited/unvisited (2 states) instead of unvisited/visiting/visited (3 states). With only 2 states, you can't distinguish between "fully processed" and "currently in recursion stack," leading to false cycle detection.

3. **Not checking all components**: Starting DFS/BFS from only one node. The graph might be disconnected, so you need to check every course. In DFS, iterate through all courses and start DFS from unvisited ones. In BFS, initialize the queue with ALL nodes having 0 in-degree.

4. **Forgetting to handle empty prerequisites**: If `prerequisites` is empty, you can always finish all courses. Both implementations handle this correctly as the graph has no edges.

## When You'll See This Pattern

Topological sort appears whenever you have dependencies or ordering constraints:

1. **Course Schedule II** - Same problem but return the actual ordering instead of just checking feasibility.
2. **Alien Dictionary** - Determine letter order from sorted alien words, where "word1 before word2" creates edges between differing letters.
3. **Sequence Reconstruction** - Check if a sequence is the unique topological sort of a graph.
4. **Parallel Courses** - Find minimum semesters to complete all courses when you can take multiple per semester.
5. **Task Scheduler** - Similar dependency concept but with additional constraints on execution order.

The pattern is: "Given items with prerequisites/constraints, find a valid ordering or determine if one exists."

## Key Takeaways

1. **Recognize topological sort problems**: When you see "prerequisites," "dependencies," or "ordering constraints," think directed graph and topological sort.

2. **Two equivalent approaches**: DFS cycle detection (3-state marking) and Kahn's algorithm (BFS with in-degrees) both solve it optimally. DFS is often shorter to code; BFS more intuitive for actual ordering.

3. **Cycle detection is key**: In scheduling problems, a cycle means impossibility. The core challenge is detecting cycles efficiently in O(V+E) time.

4. **Graph direction matters**: Carefully decide edge direction based on "A must come before B" meaning edge from A to B or B to A. Draw a small example to verify.

Related problems: [Course Schedule II](/problem/course-schedule-ii), [Graph Valid Tree](/problem/graph-valid-tree), [Minimum Height Trees](/problem/minimum-height-trees)
