---
title: "How to Solve Count Collisions on a Road — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Collisions on a Road. Medium difficulty, 58.1% acceptance rate. Topics: String, Stack, Simulation."
date: "2027-01-12"
category: "dsa-patterns"
tags: ["count-collisions-on-a-road", "string", "stack", "simulation", "medium"]
---

# How to Solve Count Collisions on a Road

This problem asks us to count collisions between cars moving on an infinitely long road, where each car can move left ('L'), right ('R'), or stay stationary ('S'). The tricky part is that collisions cause cars to stop and become stationary, which then affects subsequent collisions in a chain reaction. This isn't just about counting pairs of colliding cars—it's about simulating the domino effect of collisions.

## Visual Walkthrough

Let's trace through an example: `directions = "RLRSLL"`

We have 6 cars at positions 0 through 5:

- Car 0: 'R' (moving right)
- Car 1: 'L' (moving left)
- Car 2: 'R' (moving right)
- Car 3: 'S' (stationary)
- Car 4: 'L' (moving left)
- Car 5: 'L' (moving left)

**Step 1:** Cars 0 ('R') and 1 ('L') are moving toward each other → collision! Both become stationary 'S'. Collisions so far: 2

**Step 2:** Car 2 ('R') is moving right toward the now-stationary car at position 1 → collision! Car 2 becomes stationary. Collisions: 3

**Step 3:** Car 4 ('L') is moving left toward the stationary car at position 3 → collision! Car 4 becomes stationary. Collisions: 4

**Step 4:** Car 5 ('L') is moving left toward the now-stationary car at position 4 → collision! Car 5 becomes stationary. Collisions: 5

Total collisions: 5

Notice the pattern: collisions happen when:

1. A right-moving car meets a left-moving car (both collide)
2. A moving car meets a stationary car (only the moving one collides)
3. Chain reactions occur when cars become stationary and cause more collisions

## Brute Force Approach

A naive approach would be to simulate each time step until no more collisions can occur. At each step, we'd check every adjacent pair of cars to see if they collide, update their states, and repeat. This is problematic because:

1. **Time complexity is high**: In the worst case (like "RLRLRL..."), we might need O(n²) time as each collision could trigger a cascade that requires re-scanning the entire road.
2. **Implementation complexity**: We need to handle the fact that cars become stationary after colliding, which affects future collisions.

While we could implement this with repeated passes until no changes occur, it's inefficient and doesn't leverage the key insight about collision propagation.

## Optimized Approach

The key insight is that we don't need to simulate time steps. We can think about the road from left to right:

1. **Left-moving cars ('L')**: Only collide if there's something to their left that forces a collision
2. **Right-moving cars ('R')**: Only collide if there's something to their right that forces a collision
3. **Stationary cars ('S')**: Act as collision triggers but don't move

Here's the optimal reasoning:

- A car moving left will eventually collide if there's ANY car to its left that's moving right OR stationary
- A car moving right will eventually collide if there's ANY car to its right that's moving left OR stationary
- But there's a catch: cars moving left off the left edge or right off the right edge never collide

The efficient approach:

1. Ignore all leading 'L's (they drive off the left edge without colliding)
2. Ignore all trailing 'R's (they drive off the right edge without colliding)
3. Count all remaining cars except stationary ones (since stationary cars don't "collide" themselves, but cause others to collide)

Wait, that's not quite right. Let's refine: After removing leading 'L's and trailing 'R's, every remaining car will eventually collide. The total collisions equals the count of all non-stationary cars in this middle section.

Why? Because in the middle section:

- Any 'R' will eventually meet either an 'L' or 'S' to its right
- Any 'L' will eventually meet either an 'R' or 'S' to its left
- Any 'S' will cause collisions but isn't itself a collision

Actually, we need to count collisions, not colliding cars. Each collision involves at least one car changing from moving to stationary. When two moving cars collide head-on, that's 2 collisions. When one moving car hits a stationary car, that's 1 collision.

Final insight: After removing leading 'L's and trailing 'R's, count all cars that are NOT 'S'. Why? Because:

- Each 'R' that meets an 'L' or 'S' contributes 1 collision
- Each 'L' that meets an 'R' or 'S' contributes 1 collision
- 'S' cars don't contribute to the collision count (they're already stationary)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countCollisions(directions: str) -> int:
    """
    Counts the total number of collisions on a road with cars moving
    left ('L'), right ('R'), or stationary ('S').

    Key insight: After ignoring leading 'L's and trailing 'R's (which
    drive off the edges), all remaining moving cars will eventually collide.
    Each non-stationary car in this middle section contributes 1 collision.
    """
    n = len(directions)

    # Step 1: Skip all leading 'L's - they drive off left edge without colliding
    left = 0
    while left < n and directions[left] == 'L':
        left += 1

    # Step 2: Skip all trailing 'R's - they drive off right edge without colliding
    right = n - 1
    while right >= 0 and directions[right] == 'R':
        right -= 1

    # Step 3: Count collisions in the middle section
    # Every non-stationary car in [left, right] will collide
    collisions = 0
    for i in range(left, right + 1):
        if directions[i] != 'S':
            collisions += 1

    return collisions
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Counts the total number of collisions on a road with cars moving
 * left ('L'), right ('R'), or stationary ('S').
 *
 * Key insight: After ignoring leading 'L's and trailing 'R's (which
 * drive off the edges), all remaining moving cars will eventually collide.
 * Each non-stationary car in this middle section contributes 1 collision.
 */
function countCollisions(directions) {
  const n = directions.length;

  // Step 1: Skip all leading 'L's - they drive off left edge without colliding
  let left = 0;
  while (left < n && directions[left] === "L") {
    left++;
  }

  // Step 2: Skip all trailing 'R's - they drive off right edge without colliding
  let right = n - 1;
  while (right >= 0 && directions[right] === "R") {
    right--;
  }

  // Step 3: Count collisions in the middle section
  // Every non-stationary car in [left, right] will collide
  let collisions = 0;
  for (let i = left; i <= right; i++) {
    if (directions[i] !== "S") {
      collisions++;
    }
  }

  return collisions;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Counts the total number of collisions on a road with cars moving
     * left ('L'), right ('R'), or stationary ('S').
     *
     * Key insight: After ignoring leading 'L's and trailing 'R's (which
     * drive off the edges), all remaining moving cars will eventually collide.
     * Each non-stationary car in this middle section contributes 1 collision.
     */
    public int countCollisions(String directions) {
        int n = directions.length();

        // Step 1: Skip all leading 'L's - they drive off left edge without colliding
        int left = 0;
        while (left < n && directions.charAt(left) == 'L') {
            left++;
        }

        // Step 2: Skip all trailing 'R's - they drive off right edge without colliding
        int right = n - 1;
        while (right >= 0 && directions.charAt(right) == 'R') {
            right--;
        }

        // Step 3: Count collisions in the middle section
        // Every non-stationary car in [left, right] will collide
        int collisions = 0;
        for (int i = left; i <= right; i++) {
            if (directions.charAt(i) != 'S') {
                collisions++;
            }
        }

        return collisions;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make two passes: one from left to right to skip leading 'L's, and one from right to left to skip trailing 'R's
- Then we iterate through the middle section once
- Each pass is O(n), and O(3n) = O(n)

**Space Complexity: O(1)**

- We only use a few integer variables (left, right, collisions, loop counters)
- No additional data structures are needed

## Common Mistakes

1. **Counting each collision as 1 regardless of cars involved**: When two moving cars collide head-on ('R' and 'L'), that's 2 collisions (both cars become stationary). When a moving car hits a stationary car, that's 1 collision. Our solution correctly handles this by counting each non-stationary car in the middle section.

2. **Forgetting about chain reactions**: A common error is to only count direct collisions between adjacent cars. But when car A hits stationary car B, and car C later hits the now-stationary car A, that's another collision. Our approach handles this because once we establish the middle section, all non-stationary cars in it will eventually be involved in some collision.

3. **Incorrect boundary handling**: Leading 'L's drive off the left edge, trailing 'R's drive off the right edge. Failing to skip these will overcount collisions. Always validate with edge cases like "LLLL" (0 collisions) and "RRRR" (0 collisions).

4. **Overcomplicating with simulation**: Some candidates try to simulate each time step with a stack or queue, which works but is more complex and error-prone. The two-pointer approach is simpler and more efficient.

## When You'll See This Pattern

This problem uses the **"effective range"** pattern: instead of simulating every interaction, we determine which elements will eventually participate in the process based on their position relative to boundaries.

Similar problems include:

1. **Asteroid Collision (LeetCode 735)**: Asteroids moving left and right collide based on size. The stack-based solution has similar logic about which asteroids survive based on direction and size comparisons.

2. **Car Fleet (LeetCode 853)**: Cars moving toward a destination at different speeds form fleets when faster cars catch slower ones. The insight is about which cars will eventually meet based on their speed and position.

3. **Last Moment Before All Ants Fall Out of a Plank (LeetCode 1503)**: Ants changing direction when meeting. The key insight is that ants passing through each other is equivalent to them continuing straight, similar to how we treat the inevitable collisions here.

## Key Takeaways

1. **Look for inevitability patterns**: When certain elements are guaranteed to interact based on their properties (like direction) and positions, you can often avoid simulation and calculate the outcome directly.

2. **Boundary conditions are critical**: Elements that can "escape" the system (like cars driving off edges) often simplify the problem. Identify and handle these first.

3. **Chain reactions can be analyzed statically**: Instead of simulating step-by-step, think about the final state. If A affects B and B affects C, then A indirectly affects C. This often leads to linear scans with careful boundary tracking.

Related problems: [Asteroid Collision](/problem/asteroid-collision), [Car Fleet](/problem/car-fleet), [Last Moment Before All Ants Fall Out of a Plank](/problem/last-moment-before-all-ants-fall-out-of-a-plank)
