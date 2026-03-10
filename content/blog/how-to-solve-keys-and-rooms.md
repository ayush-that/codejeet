---
title: "How to Solve Keys and Rooms — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Keys and Rooms. Medium difficulty, 75.5% acceptance rate. Topics: Depth-First Search, Breadth-First Search, Graph Theory."
date: "2027-02-03"
category: "dsa-patterns"
tags: ["keys-and-rooms", "depth-first-search", "breadth-first-search", "graph-theory", "medium"]
---

# How to Solve Keys and Rooms

You're given a list of rooms, where each room contains keys to other rooms. Starting from room 0, you need to determine whether you can visit all rooms. The challenge lies in tracking which rooms you can unlock as you discover new keys—this is essentially a graph traversal problem where rooms are nodes and keys are edges.

## Visual Walkthrough

Let's trace through a concrete example: `rooms = [[1,3],[3,0,1],[2],[0]]`

**Step 1:** Start at room 0 (the only unlocked room initially).  
We find keys [1, 3].  
Visited rooms: {0}

**Step 2:** Use key 1 to enter room 1.  
Room 1 contains keys [3, 0, 1].  
Key 3 is new, key 0 and key 1 are already visited or in our possession.  
Visited rooms: {0, 1}

**Step 3:** Use key 3 to enter room 3.  
Room 3 contains key [0] (already visited).  
Visited rooms: {0, 1, 3}

**Step 4:** We still have room 2 unvisited.  
Do we have key 2? No—none of the rooms we visited contained key 2.  
We're stuck! We can't reach room 2.

**Result:** We can only visit rooms {0, 1, 3}, not all 4 rooms. The function should return `false`.

This example shows why we need systematic traversal: we must explore all reachable rooms from our starting point and check if the count matches the total number of rooms.

## Brute Force Approach

A naive approach might try to simulate the process without proper tracking:

1. Start with keys from room 0
2. Repeatedly try to enter rooms with keys you have
3. Stop when no new rooms can be entered

The problem with this unstructured approach is it might miss rooms or get stuck in cycles. You could implement it with repeated scanning, but it would be inefficient—potentially O(n²) if you rescan the keys list repeatedly.

More importantly, without proper visited tracking, you might enter infinite loops (revisiting the same room repeatedly). The brute force would need careful cycle detection, making it complex and still suboptimal.

## Optimized Approach

The key insight: **This is a graph connectivity problem.** Each room is a node, and each key is a directed edge from the current room to the room it unlocks. We need to determine if all nodes are reachable from node 0.

We can solve this with either DFS or BFS:

1. Start traversal from room 0
2. Keep track of visited rooms to avoid cycles
3. Collect new keys as we visit rooms
4. Continue until no new rooms can be visited
5. Check if number of visited rooms equals total rooms

**Why this works:** Graph traversal ensures we explore all reachable rooms exactly once. The visited set prevents infinite loops, and the stack/queue ensures we process rooms in a systematic order.

## Optimal Solution

We'll implement DFS (though BFS works equally well). DFS is slightly simpler to implement recursively, but we'll use an iterative stack to avoid recursion depth issues.

<div class="code-group">

```python
# Time: O(n + k) where n = number of rooms, k = total keys
# Space: O(n) for visited set and stack
def canVisitAllRooms(rooms):
    """
    Determines if all rooms can be visited starting from room 0.

    Args:
        rooms: List of lists, where rooms[i] contains keys found in room i

    Returns:
        bool: True if all rooms can be visited, False otherwise
    """
    n = len(rooms)
    visited = set()          # Track rooms we've already entered
    stack = [0]              # Start with room 0 (initially unlocked)

    while stack:
        # Get the next room to visit
        current_room = stack.pop()

        # If we've already visited this room, skip it
        if current_room in visited:
            continue

        # Mark current room as visited
        visited.add(current_room)

        # Add all keys from current room to our stack
        # These represent rooms we can now try to enter
        for key in rooms[current_room]:
            # Only add rooms we haven't visited yet
            if key not in visited:
                stack.append(key)

    # We've visited all reachable rooms
    # Check if we visited ALL rooms
    return len(visited) == n
```

```javascript
// Time: O(n + k) where n = number of rooms, k = total keys
// Space: O(n) for visited set and stack
function canVisitAllRooms(rooms) {
  /**
   * Determines if all rooms can be visited starting from room 0.
   *
   * @param {number[][]} rooms - Array where rooms[i] contains keys in room i
   * @return {boolean} True if all rooms can be visited, False otherwise
   */
  const n = rooms.length;
  const visited = new Set(); // Track rooms we've already entered
  const stack = [0]; // Start with room 0 (initially unlocked)

  while (stack.length > 0) {
    // Get the next room to visit (LIFO for DFS)
    const currentRoom = stack.pop();

    // If we've already visited this room, skip it
    if (visited.has(currentRoom)) {
      continue;
    }

    // Mark current room as visited
    visited.add(currentRoom);

    // Add all keys from current room to our stack
    // These represent rooms we can now try to enter
    const keys = rooms[currentRoom];
    for (const key of keys) {
      // Only add rooms we haven't visited yet
      if (!visited.has(key)) {
        stack.push(key);
      }
    }
  }

  // We've visited all reachable rooms
  // Check if we visited ALL rooms
  return visited.size === n;
}
```

```java
// Time: O(n + k) where n = number of rooms, k = total keys
// Space: O(n) for visited set and stack
class Solution {
    public boolean canVisitAllRooms(List<List<Integer>> rooms) {
        /**
         * Determines if all rooms can be visited starting from room 0.
         *
         * @param rooms List where rooms.get(i) contains keys in room i
         * @return true if all rooms can be visited, false otherwise
         */
        int n = rooms.size();
        Set<Integer> visited = new HashSet<>();  // Track rooms we've entered
        Stack<Integer> stack = new Stack<>();    // Rooms to visit
        stack.push(0);                           // Start with room 0

        while (!stack.isEmpty()) {
            // Get the next room to visit
            int currentRoom = stack.pop();

            // If we've already visited this room, skip it
            if (visited.contains(currentRoom)) {
                continue;
            }

            // Mark current room as visited
            visited.add(currentRoom);

            // Add all keys from current room to our stack
            // These represent rooms we can now try to enter
            List<Integer> keys = rooms.get(currentRoom);
            for (int key : keys) {
                // Only add rooms we haven't visited yet
                if (!visited.contains(key)) {
                    stack.push(key);
                }
            }
        }

        // We've visited all reachable rooms
        // Check if we visited ALL rooms
        return visited.size() == n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + k) where n is the number of rooms and k is the total number of keys across all rooms.

- We visit each room at most once: O(n)
- For each room, we process all its keys: O(k)
- Total: O(n + k)

**Space Complexity:** O(n)

- Visited set stores up to n rooms: O(n)
- Stack/queue in worst case stores up to n rooms: O(n)
- Total: O(n)

Note: In the worst case where all rooms are connected, k could be O(n²) if each room contains keys to all other rooms. However, the problem states keys are "distinct" within a room, so k ≤ n(n-1) in worst case. Our O(n + k) accounts for this.

## Common Mistakes

1. **Forgetting to track visited rooms:** Without a visited set, you'll enter infinite loops when there are cycles in the graph (like room 0 having key to room 1, and room 1 having key to room 0).

2. **Only checking keys, not rooms:** Some candidates check if they have all keys (0 through n-1), but you need to check if you've visited all rooms. Having a key doesn't guarantee you used it to enter the room.

3. **Starting with wrong initial state:** You must start with room 0 already "visited" or in your stack, since it's the only initially unlocked room. Don't make the mistake of starting empty.

4. **Using recursion without considering depth:** A recursive DFS might hit recursion limits for large graphs (n up to 1000). Iterative DFS with a stack is safer.

## When You'll See This Pattern

This graph traversal pattern appears whenever you need to:

- Check connectivity in a graph
- Find reachable nodes from a starting point
- Explore all connected components

**Related problems:**

1. **Graph Valid Tree (LeetCode 261)** - Similar graph traversal to check if all nodes are connected and there are no cycles.
2. **Number of Provinces (LeetCode 547)** - Finding connected components in an undirected graph.
3. **Clone Graph (LeetCode 133)** - Uses BFS/DFS to traverse and copy graph structure.

The core technique—using a stack/queue with visited tracking—is fundamental to graph algorithms and appears in dozens of LeetCode problems.

## Key Takeaways

1. **Recognize graph problems:** When you see nodes/vertices with connections/edges between them, think graph traversal. Rooms as nodes and keys as edges is a classic adjacency list representation.

2. **DFS vs BFS choice:** For connectivity problems like this, DFS and BFS are equally good. Use DFS when you want simpler implementation, BFS when you need shortest paths or level-order traversal.

3. **Always track visited states:** In any graph traversal, a visited set is crucial to avoid infinite loops and repeated work. This is non-negotiable for cyclic graphs.

Remember: The essence of this problem is determining if the graph formed by rooms and keys is connected starting from node 0. Once you frame it that way, the solution becomes straightforward.

Related problems: [Graph Valid Tree](/problem/graph-valid-tree)
