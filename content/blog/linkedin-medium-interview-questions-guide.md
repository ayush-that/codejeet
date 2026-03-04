---
title: "Medium LinkedIn Interview Questions: Strategy Guide"
description: "How to tackle 117 medium difficulty questions from LinkedIn — patterns, time targets, and practice tips."
date: "2032-03-02"
category: "tips"
tags: ["linkedin", "medium", "interview prep"]
---

Medium LinkedIn interview questions typically focus on practical data manipulation, system design fundamentals, and real-world scenarios involving user connections, feeds, or content. These problems often test your ability to handle edge cases, optimize for performance, and write clean, maintainable code. Expect a mix of algorithmic challenges and object-oriented design tasks that reflect the platform's core features.

## Common Patterns

LinkedIn’s Medium problems frequently involve graphs, strings, arrays, and design. Graph problems often model social networks (e.g., connections, degrees of separation). String and array problems focus on parsing, searching, or transforming data, like processing user input or activity logs. Design questions might ask you to sketch a class structure for a feature (e.g., a news feed, messaging system) without full system-depth.

Key patterns include:

- **BFS/DFS for graphs**: Used in connection searches or network traversal.
- **Two pointers/sliding window**: For array/string optimization (e.g., finding substrings, analyzing sequences).
- **Hash maps for lookups**: Common in frequency counting or caching scenarios.
- **Basic OOP design**: Structuring classes with clear relationships and methods.

Example: Finding if two users are connected within a certain degree.

<div class="code-group">

```python
from collections import deque

def are_connected(graph, user1, user2, max_degree):
    if user1 == user2:
        return True
    queue = deque([(user1, 0)])
    visited = set([user1])
    while queue:
        user, degree = queue.popleft()
        if degree >= max_degree:
            continue
        for neighbor in graph.get(user, []):
            if neighbor == user2:
                return True
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, degree + 1))
    return False
```

```javascript
function areConnected(graph, user1, user2, maxDegree) {
  if (user1 === user2) return true;
  const queue = [[user1, 0]];
  const visited = new Set([user1]);
  while (queue.length > 0) {
    const [user, degree] = queue.shift();
    if (degree >= maxDegree) continue;
    for (const neighbor of graph[user] || []) {
      if (neighbor === user2) return true;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, degree + 1]);
      }
    }
  }
  return false;
}
```

```java
import java.util.*;

public class ConnectionChecker {
    public static boolean areConnected(Map<Integer, List<Integer>> graph,
                                       int user1, int user2, int maxDegree) {
        if (user1 == user2) return true;
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{user1, 0});
        Set<Integer> visited = new HashSet<>();
        visited.add(user1);
        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int user = current[0];
            int degree = current[1];
            if (degree >= maxDegree) continue;
            for (int neighbor : graph.getOrDefault(user, new ArrayList<>())) {
                if (neighbor == user2) return true;
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(new int[]{neighbor, degree + 1});
                }
            }
        }
        return false;
    }
}
```

</div>

## Time Targets

Aim to solve a Medium problem in 20-25 minutes during an interview. This includes understanding the problem, discussing approach, writing code, and testing. Break it down: 2-3 minutes for clarification, 5-7 minutes for planning and explaining, 10-12 minutes for coding, and 3-5 minutes for testing and optimization. Practice under timed conditions to build speed without sacrificing clarity.

## Practice Strategy

Focus on quality over quantity. Start by solving 30-40 of LinkedIn’s Medium questions, prioritizing high-frequency patterns. For each problem:

1. **Solve it manually first**: Sketch logic and edge cases.
2. **Code without help**: Time yourself to simulate interview pressure.
3. **Review solutions**: Compare your approach to optimal ones, noting improvements.
4. **Repeat tough problems**: Re-solve any you struggled with after a few days.
   Use these questions to identify weak areas (e.g., graph traversal, string algorithms) and drill them separately. Mix in design practice by outlining class structures for LinkedIn features.

[Practice Medium LinkedIn questions](/company/linkedin/medium)
