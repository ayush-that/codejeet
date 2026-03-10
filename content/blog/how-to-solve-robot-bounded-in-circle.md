---
title: "How to Solve Robot Bounded In Circle — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Robot Bounded In Circle. Medium difficulty, 56.5% acceptance rate. Topics: Math, String, Simulation."
date: "2028-03-14"
category: "dsa-patterns"
tags: ["robot-bounded-in-circle", "math", "string", "simulation", "medium"]
---

# How to Solve Robot Bounded In Circle

This problem asks whether a robot following a sequence of movement instructions will remain within a bounded circle or wander off infinitely. The robot starts at `(0, 0)` facing north, and receives instructions consisting of `'G'` (go straight 1 unit), `'L'` (turn left 90°), and `'R'` (turn right 90°). The tricky part is that the robot repeats these instructions forever — we need to determine if its path eventually loops back on itself.

## Visual Walkthrough

Let's trace through the example `instructions = "GGLLGG"`:

**Initial state:** Position `(0, 0)`, facing north (direction vector `(0, 1)`)

**First instruction 'G':** Move forward in current direction → Position `(0, 1)`

**Second instruction 'G':** Move forward → Position `(0, 2)`

**Third instruction 'L':** Turn left 90° → Now facing west (direction `(-1, 0)`)

**Fourth instruction 'L':** Turn left → Now facing south (direction `(0, -1)`)

**Fifth instruction 'G':** Move south → Position `(0, 1)`

**Sixth instruction 'G':** Move south → Position `(0, 0)`

After one cycle, the robot returns to `(0, 0)` facing south. Since it's back at the origin, no matter how many times we repeat the instructions, it will trace the same path repeatedly. Therefore, it's bounded in a circle.

Now consider `instructions = "GG"`:

**First 'G':** `(0, 0)` → `(0, 1)` facing north

**Second 'G':** `(0, 1)` → `(0, 2)` facing north

After one cycle, the robot is at `(0, 2)` still facing north. Repeating the instructions will keep moving it north indefinitely → unbounded.

## Brute Force Approach

A naive approach might simulate many cycles of instructions, checking if the robot returns to the origin. However, this has two major issues:

1. **When do we stop?** If the robot is unbounded, it will never return to the origin, so we need a stopping condition.
2. **Performance:** Simulating potentially thousands of cycles is inefficient.

We could simulate a fixed number of cycles (like 4, since there are 4 directions), but without proper reasoning, this is just guessing. The brute force approach lacks the mathematical insight needed for an elegant solution.

## Optimized Approach

The key insight is that the robot's path is bounded if **either**:

1. After one cycle, it returns to the origin `(0, 0)`, OR
2. After one cycle, it's facing a different direction than it started

**Why does this work?**

- **Case 1:** If the robot returns to `(0, 0)`, it will repeat the exact same path every cycle.
- **Case 2:** If the robot isn't facing north after one cycle, its orientation changes each cycle. After at most 4 cycles, it will have rotated 360° and return to its starting orientation. This rotation combined with linear displacement creates a closed loop.

Mathematically, if the final direction after one cycle isn't north, then the displacement vector rotates with each cycle. After 4 cycles, the sum of these rotated vectors is zero, creating a closed polygon.

## Optimal Solution

We simulate one cycle of instructions, tracking position `(x, y)` and direction. Directions are represented as vectors: north `(0, 1)`, east `(1, 0)`, south `(0, -1)`, west `(-1, 0)`. Turning left/right rotates through these vectors cyclically.

After one cycle:

- If position is `(0, 0)`: bounded (returns to origin)
- If direction isn't north: bounded (will cycle due to rotation)
- Otherwise: unbounded (keeps moving in same direction)

<div class="code-group">

```python
# Time: O(n) where n = len(instructions)
# Space: O(1) - only constant extra space
def isRobotBounded(instructions: str) -> bool:
    # Initial position and direction
    x, y = 0, 0
    # Directions: north, east, south, west
    # Represented as (dx, dy) vectors
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    current_dir = 0  # Start facing north (index 0)

    # Process each instruction once
    for instruction in instructions:
        if instruction == 'G':
            # Move in current direction
            dx, dy = directions[current_dir]
            x += dx
            y += dy
        elif instruction == 'L':
            # Turn left: rotate counter-clockwise in directions array
            current_dir = (current_dir + 3) % 4  # +3 because 4 directions
        elif instruction == 'R':
            # Turn right: rotate clockwise in directions array
            current_dir = (current_dir + 1) % 4

    # Robot is bounded if:
    # 1. It returns to origin (0, 0), OR
    # 2. It's not facing north after one cycle
    return (x == 0 and y == 0) or current_dir != 0
```

```javascript
// Time: O(n) where n = instructions.length
// Space: O(1) - constant extra space
function isRobotBounded(instructions) {
  // Initial position
  let x = 0,
    y = 0;
  // Directions: north, east, south, west as (dx, dy) vectors
  const directions = [
    [0, 1], // north
    [1, 0], // east
    [0, -1], // south
    [-1, 0], // west
  ];
  let currentDir = 0; // Start facing north

  // Process each instruction once
  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];

    if (instruction === "G") {
      // Move in current direction
      x += directions[currentDir][0];
      y += directions[currentDir][1];
    } else if (instruction === "L") {
      // Turn left: rotate counter-clockwise
      currentDir = (currentDir + 3) % 4; // +3 ≡ -1 mod 4
    } else if (instruction === "R") {
      // Turn right: rotate clockwise
      currentDir = (currentDir + 1) % 4;
    }
  }

  // Bounded if back at origin OR not facing north
  return (x === 0 && y === 0) || currentDir !== 0;
}
```

```java
// Time: O(n) where n = instructions.length()
// Space: O(1) - constant extra space
class Solution {
    public boolean isRobotBounded(String instructions) {
        // Initial position
        int x = 0, y = 0;
        // Directions: north, east, south, west
        // Represented as {dx, dy} arrays
        int[][] directions = {
            {0, 1},   // north
            {1, 0},   // east
            {0, -1},  // south
            {-1, 0}   // west
        };
        int currentDir = 0;  // Start facing north

        // Process each instruction once
        for (char instruction : instructions.toCharArray()) {
            if (instruction == 'G') {
                // Move in current direction
                x += directions[currentDir][0];
                y += directions[currentDir][1];
            } else if (instruction == 'L') {
                // Turn left: rotate counter-clockwise
                currentDir = (currentDir + 3) % 4;  // +3 ≡ -1 mod 4
            } else if (instruction == 'R') {
                // Turn right: rotate clockwise
                currentDir = (currentDir + 1) % 4;
            }
        }

        // Bounded if back at origin OR not facing north
        return (x == 0 && y == 0) || currentDir != 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the instructions string. We process each character exactly once.

**Space Complexity:** O(1). We use only a fixed amount of extra space for variables tracking position, direction, and the directions array (which has constant size 4).

The efficiency comes from the mathematical insight that we only need to simulate one cycle. Without this insight, we might simulate many cycles unnecessarily.

## Common Mistakes

1. **Simulating indefinitely:** Trying to simulate until the robot returns to origin without a stopping condition for unbounded cases. This creates an infinite loop.

2. **Incorrect direction rotation:** Using `(current_dir - 1) % 4` for left turns without handling negative values properly. In Python, `-1 % 4 = 3`, but in Java/JavaScript, `-1 % 4 = -1`. The safe approach is `(current_dir + 3) % 4`.

3. **Missing the "direction change" condition:** Only checking if the robot returns to origin after one cycle, missing cases where direction change creates a bounded path. Example: `"GL"` doesn't return to origin after one cycle but is bounded.

4. **Overcomplicating with simulation:** Trying to track visited positions or simulate many cycles instead of recognizing the mathematical pattern. The optimal solution is surprisingly simple once you understand the insight.

## When You'll See This Pattern

This problem combines **state simulation** with **mathematical reasoning** about cycles and periodicity. Similar patterns appear in:

1. **Robot Room Cleaner (LeetCode 489):** Also involves tracking robot position and direction, though with backtracking for exploration.

2. **Spiral Matrix (LeetCode 54):** Uses similar direction rotation logic to traverse a grid in a spiral pattern.

3. **Walking Robot Simulation (LeetCode 874):** Simulates robot movement with obstacles, using the same direction vector approach.

The core technique of representing directions as vectors and rotating through them appears in many grid traversal problems.

## Key Takeaways

1. **Look for mathematical properties:** Instead of brute-force simulation, analyze what conditions create cycles. Many "infinite repetition" problems have mathematical shortcuts.

2. **Represent directions systematically:** Using direction vectors `(dx, dy)` and rotating through them with modulo arithmetic is cleaner than complex if-else chains.

3. **One cycle is often enough:** When dealing with repeated sequences, properties after one iteration often determine the long-term behavior. This appears in problems about detecting cycles in state machines.

[Practice this problem on CodeJeet](/problem/robot-bounded-in-circle)
