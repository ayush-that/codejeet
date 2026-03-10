---
title: "How to Solve Maximum Candies You Can Get from Boxes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Candies You Can Get from Boxes. Hard difficulty, 67.9% acceptance rate. Topics: Array, Breadth-First Search, Graph Theory."
date: "2027-05-18"
category: "dsa-patterns"
tags:
  [
    "maximum-candies-you-can-get-from-boxes",
    "array",
    "breadth-first-search",
    "graph-theory",
    "hard",
  ]
---

# How to Solve Maximum Candies You Can Get from Boxes

You have `n` boxes, each with an open/closed status, some candies, keys to other boxes, and other boxes contained inside. You start with some initially open boxes and can only collect candies from boxes you can open. The challenge is determining the maximum candies you can collect given the complex dependencies between boxes, keys, and contained boxes. This problem is tricky because it combines multiple graph-like relationships: boxes contain other boxes, keys unlock boxes, and you need to track what's accessible at each step.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

- n = 3
- status = [1,0,0] (Box 0 is open, boxes 1 and 2 are closed)
- candies = [2,3,4]
- keys = [[1],[2],[]] (Box 0 has key to box 1, box 1 has key to box 2)
- containedBoxes = [[1,2],[],[]] (Box 0 contains boxes 1 and 2)
- initialBoxes = [0]

**Step-by-step process:**

1. **Start with initial open boxes:** We have box 0 initially open and accessible.
   - Collect candies from box 0: `total = 2`
   - Box 0 contains boxes 1 and 2, so we add them to our collection
   - Box 0 has key to box 1, so we get that key

2. **Current state:**
   - Boxes we have: [0, 1, 2] (we physically possess all boxes)
   - Keys we have: key to box 1
   - Box 0 is already opened and processed
   - Box 1 is closed but we have its key
   - Box 2 is closed and we don't have its key

3. **Open box 1** (we have the key):
   - Collect candies from box 1: `total = 2 + 3 = 5`
   - Box 1 has key to box 2, so we get that key
   - Box 1 contains no additional boxes

4. **Open box 2** (we now have its key):
   - Collect candies from box 2: `total = 5 + 4 = 9`
   - Box 2 has no keys and contains no boxes

**Final result:** 9 candies

The key insight is that we need to repeatedly check if we can open new boxes based on the boxes we have and the keys we've collected.

## Brute Force Approach

A naive approach might try to simulate the process by repeatedly scanning all boxes we have to see if any can be opened, then collecting their candies, keys, and contained boxes. However, this becomes inefficient because:

1. We might scan the same boxes many times
2. We need to track multiple states: which boxes we physically have, which keys we've collected, and which boxes we've already opened
3. The dependencies create a complex web that requires careful ordering

The brute force would essentially be: while we can open any new box, open it and update our collections. This could work but would be O(n²) in worst case if we scan all boxes each time and only open one new box per scan.

A more structured brute force might use recursion or backtracking to explore all possible orders of opening boxes, but this would be exponential in complexity since there are many possible sequences.

## Optimized Approach

The optimal solution uses **BFS (Breadth-First Search)** to systematically process boxes as they become openable. Here's the key insight:

1. **Think of boxes as nodes in a graph** with multiple types of edges:
   - A box "contains" other boxes (we get physical possession)
   - A box has keys to other boxes (we get the ability to open them)

2. **We maintain three states:**
   - `ownedBoxes`: Boxes we physically have
   - `availableKeys`: Keys we've collected
   - `openedBoxes`: Boxes we've already processed

3. **The process is iterative:**
   - Start with initially open boxes
   - When we open a box:
     - Collect its candies
     - Add its keys to our key collection
     - Add its contained boxes to our owned boxes
   - Check if any owned box can now be opened (we have it AND we have its key OR it was initially open)
   - Repeat until no new boxes can be opened

4. **BFS is perfect** because it processes boxes in the order they become accessible, ensuring we don't miss any dependencies.

The tricky part is that a box might become openable in two ways:

- We get the box first, then later find its key
- We get the key first, then later find the box

So we need to track both independently and check for matches.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + m) where n = number of boxes, m = total keys and contained boxes
# Space: O(n) for the queues and sets
def maxCandies(status, candies, keys, containedBoxes, initialBoxes):
    """
    Calculate maximum candies that can be collected from boxes.

    Args:
        status: List[int] - 1 if box is open, 0 if closed
        candies: List[int] - candies in each box
        keys: List[List[int]] - keys in each box
        containedBoxes: List[List[int]] - boxes contained in each box
        initialBoxes: List[int] - initially available boxes

    Returns:
        int: Maximum candies collectible
    """
    n = len(status)
    total_candies = 0

    # Track boxes we physically have
    owned_boxes = set(initialBoxes)

    # Track keys we've collected
    available_keys = set()

    # Track boxes we've already opened to avoid reprocessing
    opened = set()

    # Queue for boxes that can be opened right now
    # A box can be opened if:
    # 1. We have the box (it's in owned_boxes)
    # 2. AND (the box is open OR we have its key)
    queue = []

    # Initialize: check which initial boxes can be opened immediately
    for box in initialBoxes:
        if status[box] == 1 or box in available_keys:
            queue.append(box)
            opened.add(box)

    # Process boxes in BFS order
    while queue:
        current_box = queue.pop(0)

        # Collect candies from this box
        total_candies += candies[current_box]

        # Collect keys from this box
        for key in keys[current_box]:
            available_keys.add(key)
            # If we now have both the box and its key, and haven't opened it yet
            if key in owned_boxes and key not in opened:
                # Check if we can open it (might be closed but we now have key)
                if status[key] == 0:  # Box is closed
                    # We have the key, so we can open it
                    queue.append(key)
                    opened.add(key)

        # Get boxes contained in this box
        for contained in containedBoxes[current_box]:
            owned_boxes.add(contained)
            # Check if we can open this contained box now
            if contained not in opened:
                # Box can be opened if it's open or we have its key
                if status[contained] == 1 or contained in available_keys:
                    queue.append(contained)
                    opened.add(contained)

    return total_candies
```

```javascript
// Time: O(n + m) where n = number of boxes, m = total keys and contained boxes
// Space: O(n) for the queues and sets
function maxCandies(status, candies, keys, containedBoxes, initialBoxes) {
  /**
   * Calculate maximum candies that can be collected from boxes.
   *
   * @param {number[]} status - 1 if box is open, 0 if closed
   * @param {number[]} candies - candies in each box
   * @param {number[][]} keys - keys in each box
   * @param {number[][]} containedBoxes - boxes contained in each box
   * @param {number[]} initialBoxes - initially available boxes
   * @return {number} Maximum candies collectible
   */
  const n = status.length;
  let totalCandies = 0;

  // Track boxes we physically have
  const ownedBoxes = new Set(initialBoxes);

  // Track keys we've collected
  const availableKeys = new Set();

  // Track boxes we've already opened to avoid reprocessing
  const opened = new Set();

  // Queue for boxes that can be opened right now
  const queue = [];

  // Initialize: check which initial boxes can be opened immediately
  for (const box of initialBoxes) {
    if (status[box] === 1 || availableKeys.has(box)) {
      queue.push(box);
      opened.add(box);
    }
  }

  // Process boxes in BFS order
  while (queue.length > 0) {
    const currentBox = queue.shift();

    // Collect candies from this box
    totalCandies += candies[currentBox];

    // Collect keys from this box
    for (const key of keys[currentBox]) {
      availableKeys.add(key);
      // If we now have both the box and its key, and haven't opened it yet
      if (ownedBoxes.has(key) && !opened.has(key)) {
        // Check if we can open it (might be closed but we now have key)
        if (status[key] === 0) {
          // Box is closed
          // We have the key, so we can open it
          queue.push(key);
          opened.add(key);
        }
      }
    }

    // Get boxes contained in this box
    for (const contained of containedBoxes[currentBox]) {
      ownedBoxes.add(contained);
      // Check if we can open this contained box now
      if (!opened.has(contained)) {
        // Box can be opened if it's open or we have its key
        if (status[contained] === 1 || availableKeys.has(contained)) {
          queue.push(contained);
          opened.add(contained);
        }
      }
    }
  }

  return totalCandies;
}
```

```java
// Time: O(n + m) where n = number of boxes, m = total keys and contained boxes
// Space: O(n) for the queues and sets
import java.util.*;

class Solution {
    public int maxCandies(int[] status, int[] candies, int[][] keys, int[][] containedBoxes, int[] initialBoxes) {
        /**
         * Calculate maximum candies that can be collected from boxes.
         *
         * @param status: 1 if box is open, 0 if closed
         * @param candies: candies in each box
         * @param keys: keys in each box
         * @param containedBoxes: boxes contained in each box
         * @param initialBoxes: initially available boxes
         * @return Maximum candies collectible
         */
        int n = status.length;
        int totalCandies = 0;

        // Track boxes we physically have
        Set<Integer> ownedBoxes = new HashSet<>();
        for (int box : initialBoxes) {
            ownedBoxes.add(box);
        }

        // Track keys we've collected
        Set<Integer> availableKeys = new HashSet<>();

        // Track boxes we've already opened to avoid reprocessing
        Set<Integer> opened = new HashSet<>();

        // Queue for boxes that can be opened right now
        Queue<Integer> queue = new LinkedList<>();

        // Initialize: check which initial boxes can be opened immediately
        for (int box : initialBoxes) {
            if (status[box] == 1 || availableKeys.contains(box)) {
                queue.offer(box);
                opened.add(box);
            }
        }

        // Process boxes in BFS order
        while (!queue.isEmpty()) {
            int currentBox = queue.poll();

            // Collect candies from this box
            totalCandies += candies[currentBox];

            // Collect keys from this box
            for (int key : keys[currentBox]) {
                availableKeys.add(key);
                // If we now have both the box and its key, and haven't opened it yet
                if (ownedBoxes.contains(key) && !opened.contains(key)) {
                    // Check if we can open it (might be closed but we now have key)
                    if (status[key] == 0) {  // Box is closed
                        // We have the key, so we can open it
                        queue.offer(key);
                        opened.add(key);
                    }
                }
            }

            // Get boxes contained in this box
            for (int contained : containedBoxes[currentBox]) {
                ownedBoxes.add(contained);
                // Check if we can open this contained box now
                if (!opened.contains(contained)) {
                    // Box can be opened if it's open or we have its key
                    if (status[contained] == 1 || availableKeys.contains(contained)) {
                        queue.offer(contained);
                        opened.add(contained);
                    }
                }
            }
        }

        return totalCandies;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n + m) where:

- n is the number of boxes
- m is the total number of keys and contained boxes across all boxes

We process each box at most once (when we open it), and for each box we process all its keys and contained boxes. Each key and contained box is processed at most once when we add it to our collections.

**Space Complexity:** O(n) for:

- The sets tracking owned boxes, available keys, and opened boxes (each O(n))
- The BFS queue (O(n) in worst case)
- The input data structures are given and not counted toward our space usage

## Common Mistakes

1. **Forgetting to track opened boxes separately:** Candidates sometimes try to remove boxes from `ownedBoxes` when opening them, but we need to keep them to avoid trying to open them again. Always maintain a separate `opened` set.

2. **Not checking both directions of dependency:** When we get a new key, we need to check if we already have the corresponding box. When we get a new box, we need to check if we already have its key. Missing either check means some boxes might never get opened.

3. **Incorrect initialization:** The initial boxes need to be checked for openability immediately. Some candidates add all initial boxes to the queue without checking if they can be opened (they might be closed with no key available yet).

4. **Using DFS instead of BFS:** While DFS could work, BFS is more intuitive here because we want to process boxes as soon as they become openable. DFS might work but requires more careful state management.

## When You'll See This Pattern

This problem combines several graph traversal patterns:

1. **Multi-source BFS:** Similar to "Rotting Oranges" (LeetCode 994) where you start with multiple initial points (initially open boxes) and propagate outward.

2. **State-dependent traversal:** Like "Open the Lock" (LeetCode 752) where you need certain conditions (keys) to access new states (boxes).

3. **Dependency resolution:** Similar to "Course Schedule" (LeetCode 207) but with two types of dependencies (having the box and having its key) instead of just one.

The core pattern is **BFS with multiple preconditions** - you can only visit a node (open a box) when all required conditions are met (you have the box AND it's open or you have its key).

## Key Takeaways

1. **BFS is ideal for "unlocking" scenarios:** When you have dependencies where accessing one item gives you access to others, BFS naturally processes items in the order they become accessible.

2. **Track multiple states separately:** When a node has multiple requirements (like needing both the item and a key), track each requirement independently and check for completeness.

3. **Think in terms of graph nodes and edges:** Even when the problem doesn't explicitly mention graphs, if there are relationships between items (contains, unlocks, depends on), modeling it as a graph with BFS/DFS often leads to the cleanest solution.

[Practice this problem on CodeJeet](/problem/maximum-candies-you-can-get-from-boxes)
