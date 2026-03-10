---
title: "How to Solve Path Crossing — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Path Crossing. Easy difficulty, 62.6% acceptance rate. Topics: Hash Table, String."
date: "2026-02-11"
category: "dsa-patterns"
tags: ["path-crossing", "hash-table", "string", "easy"]
---

# How to Solve Path Crossing

You're given a string representing movement directions (N, S, E, W) and need to determine if the path ever revisits the same coordinate. The challenge is tracking visited positions efficiently while handling coordinate updates correctly. This problem tests your ability to model movement in 2D space and use appropriate data structures for tracking state.

## Visual Walkthrough

Let's trace through `path = "NES"` step by step:

1. **Start at (0, 0)** - Mark this as visited
2. **Move N (North)**: (0, 0) → (0, 1) - Check if (0, 1) visited? No
3. **Move E (East)**: (0, 1) → (1, 1) - Check if (1, 1) visited? No
4. **Move S (South)**: (1, 1) → (1, 0) - Check if (1, 0) visited? No

No crossing occurs. Now try `path = "NESW"`:

1. **Start at (0, 0)** - Mark visited
2. **Move N**: (0, 0) → (0, 1) - Not visited
3. **Move E**: (0, 1) → (1, 1) - Not visited
4. **Move S**: (1, 1) → (1, 0) - Not visited
5. **Move W**: (1, 0) → (0, 0) - **ALREADY VISITED!** Path crosses itself.

The key insight: we need to track every coordinate we visit and check if we return to any previously visited point.

## Brute Force Approach

A naive approach would store all visited coordinates in a list and check each new position against all previous positions:

1. Start with `visited = [(0, 0)]`
2. For each move, calculate new position
3. Check if new position exists in `visited` by scanning the entire list
4. If found, return `true`
5. Otherwise, add to `visited` and continue

This approach has O(n²) time complexity because for each of n moves, we might scan up to n previous positions. While this would work for small inputs, it's inefficient for longer paths. The problem constraints (path length up to 10⁴) make this approach too slow.

## Optimal Solution

The optimal solution uses a hash set to track visited coordinates. Hash sets provide O(1) average-case lookup and insertion, making the entire algorithm O(n). We represent coordinates as tuples or strings that can be hashed.

**Algorithm:**

1. Initialize current position at (0, 0) and add it to visited set
2. For each character in path:
   - Update x, y based on direction
   - Create a string/tuple representation of new position
   - If position exists in visited set, return true (path crosses)
   - Otherwise, add to visited set
3. If loop completes without finding duplicates, return false

<div class="code-group">

```python
# Time: O(n) where n is length of path | Space: O(n) for visited set
def isPathCrossing(path: str) -> bool:
    # Start at origin (0, 0)
    x, y = 0, 0

    # Use a set to store visited coordinates for O(1) lookup
    # We store as string "x,y" for easy hashing
    visited = set()
    visited.add("0,0")  # Add starting point

    # Map each direction to coordinate changes
    directions = {
        'N': (0, 1),   # North: increase y
        'S': (0, -1),  # South: decrease y
        'E': (1, 0),   # East: increase x
        'W': (-1, 0)   # West: decrease x
    }

    # Process each move in the path
    for move in path:
        # Get the direction vector for this move
        dx, dy = directions[move]

        # Update current position
        x += dx
        y += dy

        # Create a string representation of the coordinate
        # Using f-string is efficient and clear
        current_pos = f"{x},{y}"

        # Check if we've been here before
        if current_pos in visited:
            return True  # Path crosses itself

        # Mark this position as visited
        visited.add(current_pos)

    # If we complete the path without finding duplicates
    return False
```

```javascript
// Time: O(n) where n is length of path | Space: O(n) for visited set
function isPathCrossing(path) {
  // Start at origin (0, 0)
  let x = 0,
    y = 0;

  // Use a Set to store visited coordinates for O(1) lookup
  // We store as string "x,y" for easy comparison
  const visited = new Set();
  visited.add("0,0"); // Add starting point

  // Process each move in the path
  for (let i = 0; i < path.length; i++) {
    const move = path[i];

    // Update position based on direction
    switch (move) {
      case "N":
        y++;
        break; // North: increase y
      case "S":
        y--;
        break; // South: decrease y
      case "E":
        x++;
        break; // East: increase x
      case "W":
        x--;
        break; // West: decrease x
    }

    // Create string representation of current coordinate
    const currentPos = `${x},${y}`;

    // Check if we've visited this position before
    if (visited.has(currentPos)) {
      return true; // Path crosses itself
    }

    // Mark this position as visited
    visited.add(currentPos);
  }

  // Path completed without crossing
  return false;
}
```

```java
// Time: O(n) where n is length of path | Space: O(n) for visited set
import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean isPathCrossing(String path) {
        // Start at origin (0, 0)
        int x = 0, y = 0;

        // Use a HashSet to store visited coordinates for O(1) lookup
        // We store as string "x,y" for easy hashing
        Set<String> visited = new HashSet<>();
        visited.add("0,0");  // Add starting point

        // Process each character in the path
        for (int i = 0; i < path.length(); i++) {
            char move = path.charAt(i);

            // Update position based on direction
            switch (move) {
                case 'N': y++; break;  // North: increase y
                case 'S': y--; break;  // South: decrease y
                case 'E': x++; break;  // East: increase x
                case 'W': x--; break;  // West: decrease x
            }

            // Create string representation of current coordinate
            String currentPos = x + "," + y;

            // Check if we've visited this position before
            if (visited.contains(currentPos)) {
                return true;  // Path crosses itself
            }

            // Mark this position as visited
            visited.add(currentPos);
        }

        // Path completed without crossing
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character in the path exactly once: O(n)
- Each set operation (lookup and insert) is O(1) on average
- Total: O(n) where n is the length of the path

**Space Complexity: O(n)**

- In the worst case, we visit n+1 unique positions (no crossings)
- The hash set stores up to n+1 coordinate strings
- Each coordinate string has length O(log n) in worst case (coordinates can grow), but typically treated as O(1) for complexity analysis
- Total: O(n) space

## Common Mistakes

1. **Forgetting to add the starting point (0, 0) to visited set**
   - If you only add positions after moving, you'll miss crossings that return to origin
   - Always initialize visited set with starting position

2. **Using a list instead of a set for visited positions**
   - List lookups are O(n), making total complexity O(n²)
   - Always use a hash-based set for O(1) lookups when checking membership

3. **Incorrect coordinate updates**
   - Mixing up x and y axes: N/S should affect y, E/W should affect x
   - Getting sign wrong: N = +y, S = -y, E = +x, W = -x
   - Double-check your direction mappings

4. **Not considering large coordinate values**
   - Coordinates can become large (up to ±10⁴)
   - Using arrays indexed by coordinates would require huge memory
   - Hash sets handle sparse coordinates efficiently

## When You'll See This Pattern

This "visited tracking with hash set" pattern appears in many grid and path problems:

1. **Robot Return to Origin (LeetCode 657)** - Simpler version where you only check if you return to origin
2. **Walking Robot Simulation (LeetCode 874)** - Similar coordinate tracking with obstacles
3. **Unique Paths (LeetCode 62)** - Different but related grid navigation
4. **Word Search (LeetCode 79)** - Uses visited tracking on a grid during DFS

The core pattern: when you need to track visited states in a sparse or unbounded space, hash sets/maps are your go-to tool. They provide O(1) operations while using memory proportional to actual visited states, not the entire potential space.

## Key Takeaways

1. **Hash sets are ideal for tracking visited states** when you need O(1) lookups and the state space is large or unbounded. Always reach for a set when the problem asks "have we seen this before?"

2. **Model movement systematically** by defining clear direction vectors. Create a mapping from symbols to coordinate changes to avoid errors in complex movement logic.

3. **Don't forget initial state** - whether it's (0, 0) in path problems or empty string in substring problems, your visited tracking should include the starting point.

[Practice this problem on CodeJeet](/problem/path-crossing)
