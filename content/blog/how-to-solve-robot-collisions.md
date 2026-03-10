---
title: "How to Solve Robot Collisions — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Robot Collisions. Hard difficulty, 56.1% acceptance rate. Topics: Array, Stack, Sorting, Simulation."
date: "2027-02-26"
category: "dsa-patterns"
tags: ["robot-collisions", "array", "stack", "sorting", "hard"]
---

# How to Solve Robot Collisions

This problem involves robots moving on a line, colliding with each other, and having their health reduced based on collisions. The tricky part is that robots move at the same speed, collisions only occur when moving toward each other, and we need to efficiently handle multiple collisions in the correct order while tracking surviving robots.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

- positions = [5, 4, 3, 2, 1]
- healths = [2, 17, 9, 15, 10]
- directions = "RRRRR"

**Step 1:** All robots are moving right → no collisions since they're all moving in the same direction.  
**Result:** All robots survive: [2, 17, 9, 15, 10]

**Now let's try a more interesting example:**

**Input:**

- positions = [3, 5, 2, 6]
- healths = [10, 10, 15, 2]
- directions = "RLRL"

**Step 1:** Sort robots by position to process them in order:

- Robot 2: pos=2, health=15, dir='R'
- Robot 0: pos=3, health=10, dir='L'
- Robot 1: pos=5, health=10, dir='R'
- Robot 3: pos=6, health=2, dir='L'

**Step 2:** Process collisions:

- Robot 2 (R) and Robot 0 (L) are moving toward each other → collision!
- Compare health: 15 vs 10 → Robot 0 destroyed, Robot 2 health becomes 15-10=5
- Robot 2 (R) and Robot 1 (R) → same direction, no collision
- Robot 1 (R) and Robot 3 (L) → moving toward each other → collision!
- Compare health: 10 vs 2 → Robot 3 destroyed, Robot 1 health becomes 10-2=8

**Step 3:** Return surviving robots in original order:

- Robot 0: destroyed
- Robot 1: health=8
- Robot 2: health=5
- Robot 3: destroyed

**Result:** [8, 5]

The key insight: we need to process collisions in order of position, and a stack helps us handle nested collisions correctly.

## Brute Force Approach

A naive approach would simulate each time unit until no more collisions occur:

1. Sort robots by position
2. While collisions can happen:
   - Move all robots one step based on their direction
   - Check for robots in the same position
   - Handle collisions by comparing health
   - Remove destroyed robots

**Why this fails:**

- Time complexity is O(n × max_position) which can be enormous
- Robots move at the same speed, so we're simulating unnecessary steps
- We need to process collisions immediately when robots meet, not step by step

**Key realization:** Since robots move at the same speed, we only care about when robots moving toward each other would meet. We can process collisions in the order they would occur based on positions.

## Optimized Approach

The optimal solution uses a stack to process collisions in the correct order:

1. **Combine and sort:** Create an array of robots with their original index, position, health, and direction. Sort by position.
2. **Use a stack:** Process robots from left to right:
   - If current robot moves right or stack is empty → push to stack
   - If current robot moves left and top of stack moves right → COLLISION!
3. **Handle collision:**
   - If left robot has more health: right robot destroyed, left robot health reduced
   - If right robot has more health: left robot destroyed, right robot health reduced
   - If equal health: both destroyed
   - If left robot survives with reduced health, it might collide with next robot in stack
4. **Continue processing:** Keep resolving collisions until no more collisions possible
5. **Extract survivors:** Collect surviving robots and sort by original index

The stack ensures we process collisions in the correct spatial order, similar to the Asteroid Collision problem.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting + O(n) for processing = O(n log n)
# Space: O(n) for the stack and result array
def survivedRobotsHealths(positions, healths, directions):
    n = len(positions)

    # Step 1: Create array of robots with original index
    robots = []
    for i in range(n):
        robots.append({
            'index': i,           # Original index for final ordering
            'pos': positions[i],  # Position on the line
            'health': healths[i], # Current health
            'dir': directions[i]  # Direction: 'R' or 'L'
        })

    # Step 2: Sort robots by position (left to right)
    robots.sort(key=lambda x: x['pos'])

    # Step 3: Process collisions using a stack
    stack = []  # Stores indices of robots in the sorted array

    for i in range(n):
        current = robots[i]

        # Case 1: Robot moving right or stack is empty
        if current['dir'] == 'R' or not stack:
            stack.append(i)
            continue

        # Case 2: Robot moving left, check for collision with stack top
        top_idx = stack[-1]
        top_robot = robots[top_idx]

        # Only collide if top robot moves right and current moves left
        if top_robot['dir'] == 'R' and current['dir'] == 'L':
            # Resolve collisions until no more possible
            while stack and robots[stack[-1]]['dir'] == 'R' and current['health'] > 0:
                top_idx = stack[-1]
                top_robot = robots[top_idx]

                if top_robot['health'] == current['health']:
                    # Both robots destroyed
                    robots[top_idx]['health'] = 0
                    current['health'] = 0
                    stack.pop()  # Remove top robot
                    break
                elif top_robot['health'] > current['health']:
                    # Current robot destroyed, top robot health reduced
                    robots[top_idx]['health'] -= 1
                    current['health'] = 0
                    break
                else:
                    # Top robot destroyed, current robot health reduced
                    current['health'] -= 1
                    robots[top_idx]['health'] = 0
                    stack.pop()  # Remove destroyed robot

            # If current robot survived, it might collide with next in stack
            if current['health'] > 0:
                # Check if we need to continue processing
                if stack and robots[stack[-1]]['dir'] == 'R':
                    # Continue collision resolution in next iteration
                    i -= 1  # Reprocess current robot
                else:
                    # No more collisions possible, push to stack
                    stack.append(i)
        else:
            # No collision, push to stack
            stack.append(i)

    # Step 4: Collect surviving robots
    survivors = []
    for idx in stack:
        robot = robots[idx]
        if robot['health'] > 0:
            survivors.append((robot['index'], robot['health']))

    # Step 5: Sort by original index and extract healths
    survivors.sort(key=lambda x: x[0])
    return [health for _, health in survivors]
```

```javascript
// Time: O(n log n) for sorting + O(n) for processing = O(n log n)
// Space: O(n) for the stack and result array
function survivedRobotsHealths(positions, healths, directions) {
  const n = positions.length;

  // Step 1: Create array of robots with original index
  const robots = [];
  for (let i = 0; i < n; i++) {
    robots.push({
      index: i, // Original index for final ordering
      pos: positions[i], // Position on the line
      health: healths[i], // Current health
      dir: directions[i], // Direction: 'R' or 'L'
    });
  }

  // Step 2: Sort robots by position (left to right)
  robots.sort((a, b) => a.pos - b.pos);

  // Step 3: Process collisions using a stack
  const stack = []; // Stores indices of robots in the sorted array

  for (let i = 0; i < n; i++) {
    const current = robots[i];

    // Case 1: Robot moving right or stack is empty
    if (current.dir === "R" || stack.length === 0) {
      stack.push(i);
      continue;
    }

    // Case 2: Robot moving left, check for collision with stack top
    let topIdx = stack[stack.length - 1];
    let topRobot = robots[topIdx];

    // Only collide if top robot moves right and current moves left
    if (topRobot.dir === "R" && current.dir === "L") {
      // Resolve collisions until no more possible
      while (
        stack.length > 0 &&
        robots[stack[stack.length - 1]].dir === "R" &&
        current.health > 0
      ) {
        topIdx = stack[stack.length - 1];
        topRobot = robots[topIdx];

        if (topRobot.health === current.health) {
          // Both robots destroyed
          robots[topIdx].health = 0;
          current.health = 0;
          stack.pop(); // Remove top robot
          break;
        } else if (topRobot.health > current.health) {
          // Current robot destroyed, top robot health reduced
          robots[topIdx].health -= 1;
          current.health = 0;
          break;
        } else {
          // Top robot destroyed, current robot health reduced
          current.health -= 1;
          robots[topIdx].health = 0;
          stack.pop(); // Remove destroyed robot
        }
      }

      // If current robot survived, it might collide with next in stack
      if (current.health > 0) {
        // Check if we need to continue processing
        if (stack.length > 0 && robots[stack[stack.length - 1]].dir === "R") {
          // Continue collision resolution
          i--; // Reprocess current robot
        } else {
          // No more collisions possible, push to stack
          stack.push(i);
        }
      }
    } else {
      // No collision, push to stack
      stack.push(i);
    }
  }

  // Step 4: Collect surviving robots
  const survivors = [];
  for (const idx of stack) {
    const robot = robots[idx];
    if (robot.health > 0) {
      survivors.push([robot.index, robot.health]);
    }
  }

  // Step 5: Sort by original index and extract healths
  survivors.sort((a, b) => a[0] - b[0]);
  return survivors.map((item) => item[1]);
}
```

```java
// Time: O(n log n) for sorting + O(n) for processing = O(n log n)
// Space: O(n) for the stack and result array
import java.util.*;

class Solution {
    public List<Integer> survivedRobotsHealths(int[] positions, int[] healths, String directions) {
        int n = positions.length;

        // Step 1: Create array of robots with original index
        Robot[] robots = new Robot[n];
        for (int i = 0; i < n; i++) {
            robots[i] = new Robot(i, positions[i], healths[i], directions.charAt(i));
        }

        // Step 2: Sort robots by position (left to right)
        Arrays.sort(robots, (a, b) -> Integer.compare(a.pos, b.pos));

        // Step 3: Process collisions using a stack
        Stack<Integer> stack = new Stack<>();  // Stores indices of robots in sorted array

        for (int i = 0; i < n; i++) {
            Robot current = robots[i];

            // Case 1: Robot moving right or stack is empty
            if (current.dir == 'R' || stack.isEmpty()) {
                stack.push(i);
                continue;
            }

            // Case 2: Robot moving left, check for collision with stack top
            int topIdx = stack.peek();
            Robot topRobot = robots[topIdx];

            // Only collide if top robot moves right and current moves left
            if (topRobot.dir == 'R' && current.dir == 'L') {
                // Resolve collisions until no more possible
                while (!stack.isEmpty() &&
                       robots[stack.peek()].dir == 'R' &&
                       current.health > 0) {

                    topIdx = stack.peek();
                    topRobot = robots[topIdx];

                    if (topRobot.health == current.health) {
                        // Both robots destroyed
                        robots[topIdx].health = 0;
                        current.health = 0;
                        stack.pop();  // Remove top robot
                        break;
                    } else if (topRobot.health > current.health) {
                        // Current robot destroyed, top robot health reduced
                        robots[topIdx].health -= 1;
                        current.health = 0;
                        break;
                    } else {
                        // Top robot destroyed, current robot health reduced
                        current.health -= 1;
                        robots[topIdx].health = 0;
                        stack.pop();  // Remove destroyed robot
                    }
                }

                // If current robot survived, it might collide with next in stack
                if (current.health > 0) {
                    // Check if we need to continue processing
                    if (!stack.isEmpty() && robots[stack.peek()].dir == 'R') {
                        // Continue collision resolution
                        i--;  // Reprocess current robot
                    } else {
                        // No more collisions possible, push to stack
                        stack.push(i);
                    }
                }
            } else {
                // No collision, push to stack
                stack.push(i);
            }
        }

        // Step 4: Collect surviving robots
        List<int[]> survivors = new ArrayList<>();
        for (int idx : stack) {
            Robot robot = robots[idx];
            if (robot.health > 0) {
                survivors.add(new int[]{robot.index, robot.health});
            }
        }

        // Step 5: Sort by original index and extract healths
        survivors.sort((a, b) -> Integer.compare(a[0], b[0]));
        List<Integer> result = new ArrayList<>();
        for (int[] survivor : survivors) {
            result.add(survivor[1]);
        }

        return result;
    }

    // Helper class to store robot information
    class Robot {
        int index;
        int pos;
        int health;
        char dir;

        Robot(int index, int pos, int health, char dir) {
            this.index = index;
            this.pos = pos;
            this.health = health;
            this.dir = dir;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the robots by position: O(n log n)
- Processing collisions with stack: O(n) — each robot is pushed and popped at most once
- Sorting survivors by original index: O(k log k) where k ≤ n
- Dominated by the initial sort: O(n log n)

**Space Complexity: O(n)**

- Storing the robots array: O(n)
- Stack for processing collisions: O(n) in worst case
- Result array: O(k) where k ≤ n
- Total: O(n)

## Common Mistakes

1. **Not sorting by position first:** Robots must be processed in spatial order from left to right. Processing in original index order leads to incorrect collision detection.

2. **Forgetting to track original indices:** The result must be in the original order of input. Many candidates forget to store the original index and struggle to reconstruct the correct output order.

3. **Incorrect collision resolution logic:** The health reduction is always by 1 (not by the opponent's full health). A robot with health 5 beating a robot with health 3 ends with health 5-1=4, not 2.

4. **Not handling the "reprocess" case correctly:** When a left-moving robot survives a collision, it might still collide with the next right-moving robot in the stack. The `i--` trick (or equivalent) is needed to reprocess the current robot.

## When You'll See This Pattern

This problem uses a **stack-based collision resolution** pattern that appears in several other problems:

1. **Asteroid Collision (LeetCode 735):** Almost identical pattern where asteroids moving in opposite directions collide based on their size. The stack-based solution is nearly the same.

2. **Exclusive Time of Functions (LeetCode 636):** Uses stack to track nested function calls, similar to how we track robots that might still collide.

3. **Daily Temperatures (LeetCode 739):** Uses stack to find next greater element, demonstrating how stacks help process elements in order while looking backward.

The key insight is that when you need to process elements in order while potentially "undoing" or "collapsing" previous decisions based on new information, a stack is often the right data structure.

## Key Takeaways

1. **Stack for ordered collision/conflict resolution:** When elements processed in order can affect previously seen elements (like collisions moving backward through space), a stack lets you efficiently handle these nested interactions.

2. **Separate processing order from output order:** Often you need to process data in one order (spatial, temporal) but output in another (original index). Always store the original indices.

3. **Health/size reduction patterns:** In collision problems, pay close attention to exactly how values reduce. Is it by 1, by the opponent's value, or some other rule? This is often where candidates make subtle errors.

Related problems: [Asteroid Collision](/problem/asteroid-collision)
