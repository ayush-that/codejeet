---
title: "How to Solve Walking Robot Simulation II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Walking Robot Simulation II. Medium difficulty, 25.6% acceptance rate. Topics: Design, Simulation."
date: "2030-01-22"
category: "dsa-patterns"
tags: ["walking-robot-simulation-ii", "design", "simulation", "medium"]
---

# How to Solve Walking Robot Simulation II

This problem asks you to design a robot that moves on a rectangular grid and responds to movement commands, but with a twist: the robot moves along the perimeter of the grid in a fixed cycle. The challenge comes from efficiently handling large numbers of commands without simulating every single step. What makes this problem interesting is that while it appears to be a simulation problem, brute force simulation will time out—the optimal solution requires mathematical reasoning about the robot's periodic movement pattern.

## Visual Walkthrough

Let's trace through a small example with width=4, height=3. The grid looks like this (coordinates are (x, y)):

```
(3,2) (3,1) (3,0)  ← top-right to bottom-right
(2,2) (2,1) (2,0)
(1,2) (1,1) (1,0)
(0,2) (0,1) (0,0)  ← bottom-left to top-left
```

The perimeter has length: 2*(width + height - 2) = 2*(4 + 3 - 2) = 10 positions.

Starting at (0,0) facing "East", the robot will move along the perimeter:

1. (0,0) East → (1,0) → (2,0) → (3,0) // Bottom edge
2. (3,0) North → (3,1) → (3,2) // Right edge
3. (3,2) West → (2,2) → (1,2) → (0,2) // Top edge
4. (0,2) South → (0,1) → (0,0) // Left edge (back to start)

If we call `move(8)` from the starting position, instead of simulating 8 steps, we notice:

- The perimeter length is 10
- 8 steps from (0,0) East means: 8 % 10 = 8 steps
- Starting at position 0 in our perimeter array (0-indexed), we move to position 8
- Position 8 corresponds to (0,2) facing "South"

The key insight: after moving `num` steps, we can compute `num % perimeter` to get the effective movement, then map that to a position and direction.

## Brute Force Approach

A naive solution would simulate every single step of the robot's movement. For each `move(num)` command:

1. For i from 1 to num:
   - Check if moving one step in current direction would go out of bounds
   - If it would, change direction clockwise and move one step
   - Otherwise, move one step in current direction
2. Return current position and direction

The problem with this approach is time complexity. If we have `k` move commands and each moves `num` steps where `num` can be up to 10^9, we're looking at O(k \* num) operations, which is impossible within time limits. Even with smaller numbers, this approach is inefficient because we're simulating the same perimeter cycle over and over.

## Optimized Approach

The optimal approach recognizes that the robot's movement is periodic with period `perimeter = 2*(width + height - 2)`. After `perimeter` steps, the robot returns to its starting position and orientation.

Key insights:

1. **Modulo arithmetic**: `move(num)` is equivalent to `move(num % perimeter)` because the extra full cycles don't change the final state
2. **Position mapping**: We can precompute or calculate where each position (0 to perimeter-1) on the perimeter corresponds to in (x, y) coordinates
3. **Direction tracking**: The direction at any position depends on where we are on the perimeter (bottom, right, top, or left edge)

The algorithm:

1. Compute the perimeter length: `2*(width + height - 2)`
2. For `move(num)`:
   - If `num == 0`, return current state (no movement)
   - Reduce `num` modulo perimeter to avoid unnecessary cycles
   - Add `num` to the robot's current position index (0 to perimeter-1)
   - Take modulo perimeter to wrap around if needed
   - Convert the resulting position index to (x, y) coordinates and direction
3. For `getPos()`: return current (x, y)
4. For `getDir()`: return current direction string

The tricky part is converting between position index and coordinates. We need to handle the four edges carefully:

- Bottom edge: x from 0 to width-1, y = 0, direction = "East"
- Right edge: x = width-1, y from 1 to height-1, direction = "North"
- Top edge: x from width-2 down to 0, y = height-1, direction = "West"
- Left edge: x = 0, y from height-2 down to 1, direction = "South"

Special case: when width=1 or height=1, the perimeter calculation changes because corners aren't duplicated.

## Optimal Solution

<div class="code-group">

```python
class Robot:
    # Time: O(1) for all operations | Space: O(1)

    def __init__(self, width: int, height: int):
        self.width = width
        self.height = height
        self.perimeter = 2 * (width + height - 2)  # Total positions on perimeter
        self.pos = 0  # Current position index (0 to perimeter-1)
        self.dir_index = 0  # 0: East, 1: North, 2: West, 3: South

        # Special case: if width=1 or height=1, robot can only move in one direction
        if width == 1 or height == 1:
            self.perimeter = width * height  # All cells are on perimeter

        # Direction names corresponding to dir_index
        self.directions = ["East", "North", "West", "South"]

    def _index_to_state(self, idx: int):
        """Convert position index to (x, y, direction_index)"""
        idx %= self.perimeter

        # Handle special case of single row or column
        if self.width == 1:
            # Only vertical movement
            if idx < self.height:
                return 0, idx, 1 if idx < self.height - 1 else 3  # North or South
        if self.height == 1:
            # Only horizontal movement
            if idx < self.width:
                return idx, 0, 0 if idx < self.width - 1 else 2  # East or West

        # Normal case: rectangular grid
        if idx < self.width:  # Bottom edge (excluding top-right corner)
            return idx, 0, 0 if idx < self.width - 1 else 1  # East or turn to North

        idx -= self.width - 1  # Remove bottom edge (keeping corner)
        if idx < self.height - 1:  # Right edge (excluding top-right corner)
            return self.width - 1, idx, 1 if idx < self.height - 2 else 2  # North or turn to West

        idx -= self.height - 2  # Remove right edge (keeping corner)
        if idx < self.width - 1:  # Top edge (excluding bottom-left corner)
            return self.width - 1 - idx, self.height - 1, 2 if idx < self.width - 2 else 3  # West or turn to South

        idx -= self.width - 2  # Remove top edge (keeping corner)
        # Left edge (excluding start position)
        return 0, self.height - 1 - idx, 3  # Always South on left edge

    def move(self, num: int) -> None:
        if num == 0:
            return

        # Reduce by modulo perimeter to avoid unnecessary cycles
        num %= self.perimeter

        # Special handling for returning to start: if move would return to start,
        # we need to maintain the direction from previous position
        if num == 0:
            # Moving full perimeter brings us back to start
            # We need to use the direction from the position before start
            prev_idx = (self.pos - 1) % self.perimeter
            _, _, dir_idx = self._index_to_state(prev_idx)
            self.dir_index = (dir_idx + 1) % 4  # Direction after reaching start
        else:
            # Normal movement
            self.pos = (self.pos + num) % self.perimeter
            _, _, self.dir_index = self._index_to_state(self.pos)

    def getPos(self) -> List[int]:
        x, y, _ = self._index_to_state(self.pos)
        return [x, y]

    def getDir(self) -> str:
        return self.directions[self.dir_index]
```

```javascript
// Time: O(1) for all operations | Space: O(1)
class Robot {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.perimeter = 2 * (width + height - 2); // Total positions on perimeter
    this.pos = 0; // Current position index (0 to perimeter-1)
    this.dirIndex = 0; // 0: East, 1: North, 2: West, 3: South

    // Special case: if width=1 or height=1, robot can only move in one direction
    if (width === 1 || height === 1) {
      this.perimeter = width * height; // All cells are on perimeter
    }

    // Direction names corresponding to dirIndex
    this.directions = ["East", "North", "West", "South"];
  }

  _indexToState(idx) {
    // Convert position index to [x, y, directionIndex]
    idx %= this.perimeter;

    // Handle special case of single row or column
    if (this.width === 1) {
      // Only vertical movement
      if (idx < this.height) {
        return [0, idx, idx < this.height - 1 ? 1 : 3]; // North or South
      }
    }
    if (this.height === 1) {
      // Only horizontal movement
      if (idx < this.width) {
        return [idx, 0, idx < this.width - 1 ? 0 : 2]; // East or West
      }
    }

    // Normal case: rectangular grid
    if (idx < this.width) {
      // Bottom edge (excluding top-right corner)
      return [idx, 0, idx < this.width - 1 ? 0 : 1]; // East or turn to North
    }

    idx -= this.width - 1; // Remove bottom edge (keeping corner)
    if (idx < this.height - 1) {
      // Right edge (excluding top-right corner)
      return [this.width - 1, idx, idx < this.height - 2 ? 1 : 2]; // North or turn to West
    }

    idx -= this.height - 2; // Remove right edge (keeping corner)
    if (idx < this.width - 1) {
      // Top edge (excluding bottom-left corner)
      return [this.width - 1 - idx, this.height - 1, idx < this.width - 2 ? 2 : 3]; // West or turn to South
    }

    idx -= this.width - 2; // Remove top edge (keeping corner)
    // Left edge (excluding start position)
    return [0, this.height - 1 - idx, 3]; // Always South on left edge
  }

  move(num) {
    if (num === 0) return;

    // Reduce by modulo perimeter to avoid unnecessary cycles
    num %= this.perimeter;

    // Special handling for returning to start
    if (num === 0) {
      // Moving full perimeter brings us back to start
      // We need to use the direction from the position before start
      const prevIdx = (this.pos - 1 + this.perimeter) % this.perimeter;
      const [, , dirIdx] = this._indexToState(prevIdx);
      this.dirIndex = (dirIdx + 1) % 4; // Direction after reaching start
    } else {
      // Normal movement
      this.pos = (this.pos + num) % this.perimeter;
      const [, , newDirIdx] = this._indexToState(this.pos);
      this.dirIndex = newDirIdx;
    }
  }

  getPos() {
    const [x, y] = this._indexToState(this.pos);
    return [x, y];
  }

  getDir() {
    return this.directions[this.dirIndex];
  }
}
```

```java
// Time: O(1) for all operations | Space: O(1)
class Robot {
    private int width;
    private int height;
    private int perimeter;
    private int pos;  // Current position index (0 to perimeter-1)
    private int dirIndex;  // 0: East, 1: North, 2: West, 3: South
    private String[] directions = {"East", "North", "West", "South"};

    public Robot(int width, int height) {
        this.width = width;
        this.height = height;
        this.perimeter = 2 * (width + height - 2);  // Total positions on perimeter
        this.pos = 0;
        this.dirIndex = 0;

        // Special case: if width=1 or height=1, robot can only move in one direction
        if (width == 1 || height == 1) {
            this.perimeter = width * height;  // All cells are on perimeter
        }
    }

    private int[] indexToState(int idx) {
        // Convert position index to {x, y, directionIndex}
        idx %= perimeter;

        // Handle special case of single row or column
        if (width == 1) {
            // Only vertical movement
            if (idx < height) {
                return new int[]{0, idx, idx < height - 1 ? 1 : 3};  // North or South
            }
        }
        if (height == 1) {
            // Only horizontal movement
            if (idx < width) {
                return new int[]{idx, 0, idx < width - 1 ? 0 : 2};  // East or West
            }
        }

        // Normal case: rectangular grid
        if (idx < width) {  // Bottom edge (excluding top-right corner)
            return new int[]{idx, 0, idx < width - 1 ? 0 : 1};  // East or turn to North
        }

        idx -= width - 1;  // Remove bottom edge (keeping corner)
        if (idx < height - 1) {  // Right edge (excluding top-right corner)
            return new int[]{width - 1, idx, idx < height - 2 ? 1 : 2};  // North or turn to West
        }

        idx -= height - 2;  // Remove right edge (keeping corner)
        if (idx < width - 1) {  // Top edge (excluding bottom-left corner)
            return new int[]{width - 1 - idx, height - 1, idx < width - 2 ? 2 : 3};  // West or turn to South
        }

        idx -= width - 2;  // Remove top edge (keeping corner)
        // Left edge (excluding start position)
        return new int[]{0, height - 1 - idx, 3};  // Always South on left edge
    }

    public void move(int num) {
        if (num == 0) return;

        // Reduce by modulo perimeter to avoid unnecessary cycles
        num %= perimeter;

        // Special handling for returning to start
        if (num == 0) {
            // Moving full perimeter brings us back to start
            // We need to use the direction from the position before start
            int prevIdx = (pos - 1 + perimeter) % perimeter;
            int[] prevState = indexToState(prevIdx);
            dirIndex = (prevState[2] + 1) % 4;  // Direction after reaching start
        } else {
            // Normal movement
            pos = (pos + num) % perimeter;
            int[] newState = indexToState(pos);
            dirIndex = newState[2];
        }
    }

    public int[] getPos() {
        int[] state = indexToState(pos);
        return new int[]{state[0], state[1]};
    }

    public String getDir() {
        return directions[dirIndex];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)** for all operations

- `move(num)`: O(1) because we use modulo arithmetic instead of simulating steps
- `getPos()` and `getDir()`: O(1) as we just return stored or computed values
- The `_index_to_state` helper runs in O(1) with simple arithmetic operations

**Space Complexity: O(1)**

- We store only a constant amount of data: dimensions, perimeter, current position index, and direction index
- No additional data structures that grow with input size

The key to achieving O(1) time is recognizing that we don't need to simulate each step—we can compute the final position directly using the periodic nature of the movement.

## Common Mistakes

1. **Not handling the special case when num % perimeter == 0**: When the robot moves exactly a multiple of the perimeter, it returns to the starting position (0,0). However, the direction should be "South" (from the last edge), not "East" (the initial direction). Many candidates miss this edge case.

2. **Incorrect perimeter calculation for 1xN or Nx1 grids**: When width=1 or height=1, the formula `2*(width + height - 2)` gives 0 or negative values. The correct perimeter for these cases is `width * height` since all cells are on the perimeter and the robot can't turn.

3. **Off-by-one errors in edge mapping**: The four edges share corners, so we need to be careful not to count corners twice. For example, position (width-1, 0) is both the end of the bottom edge and the start of the right edge. Consistent indexing (treating it as the end of the bottom edge) is crucial.

4. **Simulating steps instead of using modulo**: The most common performance mistake is actually simulating each step. With num up to 10^9, this will always time out. Always look for periodic patterns in movement problems.

## When You'll See This Pattern

This problem combines **modulo arithmetic** with **state machine design**, a pattern that appears in several coding interview problems:

1. **Walking Robot Simulation (LeetCode 874)**: The easier version where the robot moves freely until obstacles. Both problems require careful direction handling and boundary checking.

2. **Robot Bounded In Circle (LeetCode 1041)**: Determines if a robot's path is bounded by checking if it returns to origin or changes direction after a cycle. Uses similar direction cycling logic.

3. **Design Snake Game (LeetCode 353)**: Another grid-based simulation with periodic movement (when the snake hits walls). Requires efficient state management.

The core pattern is recognizing **periodicity** or **cycles** in movement, which allows using modulo arithmetic to avoid simulating redundant steps. This is especially common in problems involving circular buffers, rotating arrays, or periodic sequences.

## Key Takeaways

1. **Look for cycles in movement problems**: When a system has periodic behavior (like moving along a fixed path), you can often use modulo arithmetic to handle large movement counts efficiently.

2. **Separate position from direction state**: In grid movement problems, maintain position and direction separately. The direction often depends on both the current position and movement rules.

3. **Handle edge cases systematically**: Single-row/column grids, full cycles returning to start, and corner positions are common pitfalls. Test these cases explicitly.

4. **Prefer computation over simulation**: When possible, compute the final state directly rather than simulating intermediate steps. This is especially important when numbers can be large (like 10^9 steps).

Related problems: [Walking Robot Simulation](/problem/walking-robot-simulation)
