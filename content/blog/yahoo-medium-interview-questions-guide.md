---
title: "Medium Yahoo Interview Questions: Strategy Guide"
description: "How to tackle 32 medium difficulty questions from Yahoo — patterns, time targets, and practice tips."
date: "2032-07-22"
category: "tips"
tags: ["yahoo", "medium", "interview prep"]
---

Medium questions at Yahoo occupy a unique and critical space in their interview process. While Easy questions test basic competency and syntax, and Hard questions often involve complex algorithms or heavy optimization, Yahoo's Medium questions are the primary battleground for assessing _practical problem-solving_. They are designed to see if you can take a known concept and apply it cleanly to a non-trivial, real-world adjacent problem within a reasonable timeframe. The 32 Medium questions in their tagged list often involve combining 2-3 core patterns, requiring careful state management, or implementing a standard algorithm with a subtle twist that demands precise edge case handling.

## Common Patterns and Templates

Yahoo's Medium problems frequently center around **arrays/strings manipulation**, **binary trees**, and **graph traversal (BFS/DFS)**. However, the defining characteristic is the "twist." You're rarely asked to implement a vanilla BFS; you're asked to do a BFS on a 2D grid with a specific condition, or to find the shortest path in a weighted graph using BFS-level logic.

A highly recurrent pattern is the **"Modified BFS for Shortest Path in Unweighted Graph"**. This isn't just for explicit graphs; it's used for problems like "Word Ladder" or finding the minimum steps to reach a target. The template is robust and a must-know.

<div class="code-group">

```python
from collections import deque

def bfs_shortest_path(start, target, get_neighbors):
    """
    Template for finding the shortest path length (number of steps)
    in an unweighted graph using BFS.
    - start: starting node
    - target: target node (or a function to check if node is target)
    - get_neighbors: function(node) -> list of adjacent nodes
    Returns: int (minimum steps), or -1 if not reachable.
    """
    if start == target:
        return 0

    queue = deque([start])
    # visited serves to both prevent cycles and store distance
    visited = {start: 0}  # node -> distance from start

    while queue:
        current_node = queue.popleft()
        current_distance = visited[current_node]

        for neighbor in get_neighbors(current_node):
            if neighbor == target:
                return current_distance + 1
            if neighbor not in visited:
                visited[neighbor] = current_distance + 1
                queue.append(neighbor)

    return -1  # Target not reachable

# Time: O(V + E) | Space: O(V)
```

```javascript
function bfsShortestPath(start, target, getNeighbors) {
  // Template for shortest path length in an unweighted graph.
  if (start === target) return 0;

  const queue = [start];
  const visited = new Map(); // node -> distance from start
  visited.set(start, 0);

  while (queue.length > 0) {
    const currentNode = queue.shift();
    const currentDistance = visited.get(currentNode);

    for (const neighbor of getNeighbors(currentNode)) {
      if (neighbor === target) return currentDistance + 1;
      if (!visited.has(neighbor)) {
        visited.set(neighbor, currentDistance + 1);
        queue.push(neighbor);
      }
    }
  }
  return -1; // Target not reachable
}
// Time: O(V + E) | Space: O(V)
```

```java
import java.util.*;

public int bfsShortestPath(Object start, Object target, Function<Object, List<Object>> getNeighbors) {
    // Template for shortest path length in an unweighted graph.
    if (start.equals(target)) return 0;

    Queue<Object> queue = new LinkedList<>();
    Map<Object, Integer> visited = new HashMap<>(); // node -> distance
    queue.offer(start);
    visited.put(start, 0);

    while (!queue.isEmpty()) {
        Object currentNode = queue.poll();
        int currentDistance = visited.get(currentNode);

        for (Object neighbor : getNeighbors.apply(currentNode)) {
            if (neighbor.equals(target)) return currentDistance + 1;
            if (!visited.containsKey(neighbor)) {
                visited.put(neighbor, currentDistance + 1);
                queue.offer(neighbor);
            }
        }
    }
    return -1; // Target not reachable
}
// Time: O(V + E) | Space: O(V)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot, you should aim to solve a single Medium problem in **25-30 minutes**. This includes understanding the problem, discussing your approach, writing the code, and walking through test cases. The remaining time is for follow-ups or a second, simpler question.

Beyond correctness, Yahoo interviewers are keenly watching for:

1.  **Code Quality & Readability:** They want to see code they'd be comfortable reviewing in a production PR. Use descriptive variable names, helper functions for clarity, and avoid "clever" one-liners that obfuscate logic.
2.  **Edge Case Proactivity:** Don't wait for the interviewer to ask "What if the input list is empty?" Mention these during your initial approach. For tree problems, discuss null nodes. For array problems, discuss single-element, sorted, or reverse-sorted inputs.
3.  **Communication of Trade-offs:** Verbally state your chosen algorithm's time and space complexity. If you're using extra space for speed, say so: "I'm using a HashMap which gives us O(n) space, but it reduces the time complexity from O(n²) to O(n)."

## Key Differences from Easy Problems

The jump from Easy to Medium at Yahoo is defined by the need for **abstraction and combination**. Easy problems are usually one-step applications: "Implement a queue using stacks." Medium problems require you to manage multiple steps or states simultaneously.

- **New Techniques Required:** Recursion with memoization (Dynamic Programming), systematic BFS/DFS traversal, and the sliding window technique with a hash map for counting become essential.
- **Mindset Shift Needed:** You must stop looking for a single "trick" and start thinking in terms of **decomposition**. Break the problem down: "First, I need to process the string into a graph. Then, finding the shortest transformation is a BFS problem." This modular thinking is what they're evaluating.

## Specific Patterns for Medium

1.  **In-Place Array/String Manipulation:** Problems like "Set Matrix Zeroes" or "Rotate Image" require modifying the data structure without using extra space (or only O(1) extra space). The pattern involves using the structure itself to mark state.
    - **Pattern:** Use the first row and first column as markers, with two extra booleans for the first row/column themselves. This is a classic Yahoo-style test of careful indexing.

2.  **Tree DFS with State Carrying:** Not just simple traversal. Problems like "Validate Binary Search Tree" or "Binary Tree Maximum Path Sum" require the DFS helper function to return _multiple_ pieces of information (e.g., `(isValid, min, max)` or `(maxPathSum, maxChain)`).
    - **Pattern:** Define a helper that returns a custom object or tuple. Process left and right results, compute the current node's result based on them and global constraints, update a global answer variable, and return the necessary state to the parent.

## Practice Strategy

Don't just solve all 32 questions sequentially. Practice by **pattern clusters**.

1.  **Week 1 - Core Data Structures:** Group and solve all Tree and Graph BFS/DFS problems.
2.  **Week 2 - Array/String Techniques:** Group Sliding Window, Two Pointers, and In-Place manipulation problems.
3.  **Week 3 - Dynamic Programming & Recursion:** Tackle the problems involving memoization and combinatorial search.

**Daily Target:** Solve 2-3 Medium problems. For each one, time yourself (30-minute hard stop). If you can't solve it, study the solution, **wait 24 hours**, and then re-implement it from scratch without any hints. This "delayed repetition" is far more effective for retention than immediately re-coding.

Focus on the quality of your solution and your communication. Practice explaining your thought process out loud as you write on a whiteboard or in a shared editor. Mastering Yahoo's Medium tier means demonstrating you're not just a coder, but a structured engineer who can translate a fuzzy requirement into robust, clean code.

[Practice Medium Yahoo questions](/company/yahoo/medium)
