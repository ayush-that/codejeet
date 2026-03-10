---
title: "How to Solve Walking Robot Simulation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Walking Robot Simulation. Medium difficulty, 58.4% acceptance rate. Topics: Array, Hash Table, Simulation."
date: "2026-05-26"
category: "dsa-patterns"
tags: ["walking-robot-simulation", "array", "hash-table", "simulation", "medium"]
---

# How to Solve Walking Robot Simulation

Walking Robot Simulation is a deceptively tricky problem that combines coordinate geometry with efficient obstacle detection. While the simulation itself is straightforward, the challenge lies in efficiently checking whether each step would hit an obstacle without scanning through all obstacles on every move. This forces us to think about data structure optimization in what initially appears to be a simple simulation problem.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

- `commands = [4,-1,4,-2,4]`
- `obstacles = [[2,4]]`

**Step-by-step simulation:**

1. **Start:** Position `(0, 0)`, facing north (direction index 0)
2. **Command 4:** Move 4 units north
   - Check positions: `(0,1)`, `(0,2)`, `(0,3)`, `(0,4)`
   - `(0,4)` is clear (obstacle is at `(2,4)`, not `(0,4)`)
   - New position: `(0, 4)`
3. **Command -1:** Turn right 90°
   - From north → east (direction index 1)
4. **Command 4:** Move 4 units east
   - Check positions: `(1,4)`, `(2,4)`
   - `(2,4)` IS an obstacle! Stop before it
   - New position: `(1, 4)` (stopped at previous step)
5. **Command -2:** Turn left 90°
   - From east → north (direction index 0)
6. **Command 4:** Move 4 units north
   - Check positions: `(1,5)`, `(1,6)`, `(1,7)`, `(1,8)`
   - All clear
   - New position: `(1, 8)`

**Maximum Euclidean distance squared:**

- `(0, 4)` → `0² + 4² = 16`
- `(1, 4)` → `1² + 4² = 17`
- `(1, 8)` → `1² + 8² = 65` ← **Maximum**

The key insight: we need to check obstacles efficiently at each step, not scan through all obstacles every time.

## Brute Force Approach

A naive approach would simulate the robot's movement exactly as described:

1. For each command:
   - If it's a turn command, update direction
   - If it's a move command, move one step at a time
   - For each step, check if the new position exists in the obstacles array
   - If obstacle found, stop moving for this command

The problem with this approach is obstacle checking. If we store obstacles as a list of `[x, y]` pairs and check `if [x, y] in obstacles` for each step, we get O(k) time per step where k is the number of obstacles. With up to 10⁴ commands and each command moving up to 9 steps, and up to 10⁴ obstacles, this could approach O(10⁸) operations, which is too slow.

**What makes the brute force insufficient:**

- Linear search through obstacles for every single step
- No quick way to check if a specific coordinate has an obstacle
- The problem constraints (10⁴ obstacles, 10⁴ commands) make O(n²) approaches impractical

## Optimized Approach

The key optimization is using a hash set for O(1) obstacle lookups. Instead of storing obstacles as a list, we store them as strings or tuples in a set. This allows us to check `if (x, y) in obstacles_set` in constant time.

**Step-by-step reasoning:**

1. **Direction representation:** We need a clean way to handle the four directions. Using direction vectors works well:
   - North: `(0, 1)` → add to y-coordinate
   - East: `(1, 0)` → add to x-coordinate
   - South: `(0, -1)` → subtract from y-coordinate
   - West: `(-1, 0)` → subtract from x-coordinate

2. **Turning logic:** We can represent directions as indices 0-3:
   - Turn right: `(current_dir + 1) % 4`
   - Turn left: `(current_dir - 1) % 4` (or `(current_dir + 3) % 4` to avoid negative)

3. **Efficient obstacle checking:** Convert obstacles to a set of tuples for O(1) lookups.

4. **Movement simulation:** For each move command:
   - Move one step at a time
   - Check if next position is in obstacle set
   - If yes, stop and don't move to that position
   - If no, update position and continue

5. **Tracking maximum distance:** After each successful move (even partial moves due to obstacles), calculate `x² + y²` and update maximum if needed.

The critical insight is that while we still move step-by-step (O(steps) time), each obstacle check is now O(1) instead of O(k), making the overall solution efficient enough for the constraints.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n + k) where n is total steps (sum of move commands) and k is number of obstacles
# Space: O(k) for storing obstacles in a set
def robotSim(commands, obstacles):
    # Direction vectors: north, east, south, west
    # Each vector is (dx, dy) - how x and y change when moving in that direction
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]

    # Convert obstacles to a set of tuples for O(1) lookups
    # Using tuple instead of string is more memory efficient
    obstacle_set = set()
    for x, y in obstacles:
        obstacle_set.add((x, y))

    # Initialize robot state
    x, y = 0, 0           # Starting position
    dir_index = 0         # Start facing north (index 0)
    max_distance = 0      # Track maximum Euclidean distance squared

    # Process each command
    for cmd in commands:
        if cmd == -1:  # Turn right 90 degrees
            # Clockwise turn: (0→1→2→3→0)
            dir_index = (dir_index + 1) % 4
        elif cmd == -2:  # Turn left 90 degrees
            # Counter-clockwise turn: (0→3→2→1→0)
            dir_index = (dir_index + 3) % 4  # +3 is same as -1 mod 4
        else:  # Move forward cmd steps
            dx, dy = directions[dir_index]

            # Move one step at a time
            for _ in range(cmd):
                # Calculate next position
                next_x = x + dx
                next_y = y + dy

                # Check if next position has an obstacle
                if (next_x, next_y) in obstacle_set:
                    # Hit an obstacle - stop moving for this command
                    break

                # No obstacle - move to the new position
                x, y = next_x, next_y

                # Update maximum distance squared
                # We calculate after each successful move
                distance = x * x + y * y
                max_distance = max(max_distance, distance)

    return max_distance
```

```javascript
// Time: O(n + k) where n is total steps and k is number of obstacles
// Space: O(k) for storing obstacles in a set
function robotSim(commands, obstacles) {
  // Direction vectors: north, east, south, west
  const directions = [
    [0, 1], // north: increase y
    [1, 0], // east: increase x
    [0, -1], // south: decrease y
    [-1, 0], // west: decrease x
  ];

  // Convert obstacles to a Set for O(1) lookups
  // Use string keys like "x,y" for easy comparison
  const obstacleSet = new Set();
  for (const [x, y] of obstacles) {
    obstacleSet.add(`${x},${y}`);
  }

  // Initialize robot state
  let x = 0,
    y = 0; // Starting position
  let dirIndex = 0; // Start facing north
  let maxDistance = 0; // Track maximum Euclidean distance squared

  // Process each command
  for (const cmd of commands) {
    if (cmd === -1) {
      // Turn right 90 degrees
      // Clockwise turn
      dirIndex = (dirIndex + 1) % 4;
    } else if (cmd === -2) {
      // Turn left 90 degrees
      // Counter-clockwise turn: +3 is same as -1 mod 4
      dirIndex = (dirIndex + 3) % 4;
    } else {
      // Move forward cmd steps
      const [dx, dy] = directions[dirIndex];

      // Move one step at a time
      for (let i = 0; i < cmd; i++) {
        // Calculate next position
        const nextX = x + dx;
        const nextY = y + dy;

        // Check if next position has an obstacle
        if (obstacleSet.has(`${nextX},${nextY}`)) {
          // Hit an obstacle - stop moving for this command
          break;
        }

        // No obstacle - move to the new position
        x = nextX;
        y = nextY;

        // Update maximum distance squared
        const distance = x * x + y * y;
        maxDistance = Math.max(maxDistance, distance);
      }
    }
  }

  return maxDistance;
}
```

```java
// Time: O(n + k) where n is total steps and k is number of obstacles
// Space: O(k) for storing obstacles in a set
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int robotSim(int[] commands, int[][] obstacles) {
        // Direction vectors: north, east, south, west
        int[][] directions = {
            {0, 1},   // north: increase y
            {1, 0},   // east: increase x
            {0, -1},  // south: decrease y
            {-1, 0}   // west: decrease x
        };

        // Convert obstacles to a Set for O(1) lookups
        // Use a custom encoding to store coordinates efficiently
        Set<String> obstacleSet = new HashSet<>();
        for (int[] obstacle : obstacles) {
            obstacleSet.add(obstacle[0] + "," + obstacle[1]);
        }

        // Initialize robot state
        int x = 0, y = 0;           // Starting position
        int dirIndex = 0;           // Start facing north
        int maxDistance = 0;        // Track maximum Euclidean distance squared

        // Process each command
        for (int cmd : commands) {
            if (cmd == -1) {  // Turn right 90 degrees
                // Clockwise turn
                dirIndex = (dirIndex + 1) % 4;
            } else if (cmd == -2) {  // Turn left 90 degrees
                // Counter-clockwise turn: +3 is same as -1 mod 4
                dirIndex = (dirIndex + 3) % 4;
            } else {  // Move forward cmd steps
                int dx = directions[dirIndex][0];
                int dy = directions[dirIndex][1];

                // Move one step at a time
                for (int i = 0; i < cmd; i++) {
                    // Calculate next position
                    int nextX = x + dx;
                    int nextY = y + dy;

                    // Check if next position has an obstacle
                    if (obstacleSet.contains(nextX + "," + nextY)) {
                        // Hit an obstacle - stop moving for this command
                        break;
                    }

                    // No obstacle - move to the new position
                    x = nextX;
                    y = nextY;

                    // Update maximum distance squared
                    int distance = x * x + y * y;
                    maxDistance = Math.max(maxDistance, distance);
                }
            }
        }

        return maxDistance;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + k)**

- `k`: Converting obstacles to a set takes O(k) time
- `n`: The total number of steps taken (sum of all move commands)
- Each step does O(1) work (hash set lookup and position update)
- In worst case, if all commands are move-9 commands, n = 9 × number_of_commands

**Space Complexity: O(k)**

- We store all obstacles in a hash set
- The set uses O(k) space where k is the number of obstacles
- Constant extra space for robot state variables

The optimization comes from the O(1) obstacle lookups. Without the hash set, each step would require O(k) time for linear search, giving O(n × k) time which is too slow for the constraints.

## Common Mistakes

1. **Not using a hash set for obstacles:** Candidates often try to check obstacles by scanning the array each time. With up to 10⁴ obstacles and 10⁴ commands, this leads to 10⁸ operations, which may time out.

2. **Moving past obstacles:** When hitting an obstacle, the robot should stop at the position BEFORE the obstacle, not at the obstacle itself. The problem states: "If the robot would attempt to move onto an obstacle, it stays on the previous grid square."

3. **Forgetting to update max distance after partial moves:** If a move command is partially completed (stopped by obstacle), we still need to check the distance at each intermediate position, not just at the end of the command.

4. **Incorrect direction handling:** Mixing up the order of directions or the turn logic. A good practice is to define direction vectors clearly and test turning logic with simple cases.

5. **Not handling negative coordinates:** The robot can move to negative x or y coordinates. The Euclidean distance squared calculation handles this correctly (negative squared is positive), but some candidates forget this.

## When You'll See This Pattern

This problem combines simulation with efficient lookup, a pattern seen in many grid-based problems:

1. **Word Search (LeetCode 79):** Uses similar grid traversal with efficient character lookups, though with backtracking instead of obstacles.

2. **Number of Islands (LeetCode 200):** Involves grid traversal with visited checks, often optimized with hash sets or in-place marking.

3. **Snake Game (LeetCode 353):** Another simulation problem where efficient collision detection is crucial, often using hash sets for the snake's body.

The core pattern is: when you need to repeatedly check if coordinates are in a set of blocked/visited positions, convert that set to a hash-based structure for O(1) lookups.

## Key Takeaways

1. **Simulation + lookup optimization:** When a simulation requires frequent membership checks (obstacles, visited cells, etc.), convert the collection to a hash set for O(1) lookups.

2. **Direction vectors simplify movement:** Representing directions as (dx, dy) pairs makes movement logic cleaner than complex if-else chains.

3. **Update incrementally in simulations:** For problems tracking maximum/minimum values during simulation, update after each state change, not just at obvious breakpoints.

4. **Modular arithmetic for cyclic states:** Using `% 4` for direction changes handles the cyclic nature of directions elegantly.

Related problems: [Walking Robot Simulation II](/problem/walking-robot-simulation-ii)
