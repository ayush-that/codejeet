---
title: "How to Solve Find Closest Person — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Closest Person. Easy difficulty, 88.9% acceptance rate. Topics: Math."
date: "2028-08-23"
category: "dsa-patterns"
tags: ["find-closest-person", "math", "easy"]
---

# How to Solve Find Closest Person

This problem asks us to determine which of two moving people reaches a stationary person first. Given positions `x` (Person 1), `y` (Person 2), and `z` (Person 3), both Person 1 and Person 2 move toward Person 3 at the same speed. The challenge is handling the direction of movement—people move toward Person 3, not necessarily to the right. This makes it more interesting than a simple distance comparison.

## Visual Walkthrough

Let's trace through an example: `x = 4`, `y = -2`, `z = 1`.

1. **Person 3** is stationary at position 1
2. **Person 1** starts at position 4 and moves toward Person 3 at position 1. Since 4 > 1, Person 1 moves left
3. **Person 2** starts at position -2 and moves toward Person 3 at position 1. Since -2 < 1, Person 2 moves right
4. Calculate distances:
   - Person 1 distance: |4 - 1| = 3
   - Person 2 distance: |-2 - 1| = 3
5. Both have equal distance, so neither reaches first

The key insight: we're comparing absolute distances from Person 3, but we need to handle three cases:

- Person 1 is closer → return 1
- Person 2 is closer → return 2
- Equal distance → return 3 (Person 3)

## Brute Force Approach

A naive approach might simulate the movement step-by-step:

1. Check if Person 1 has reached Person 3
2. Check if Person 2 has reached Person 3
3. Move both one unit closer to Person 3
4. Repeat until someone reaches Person 3

However, this is unnecessary since we can calculate the answer directly from the initial positions. The step-by-step simulation would have time complexity O(d) where d is the maximum distance, which could be up to 100 (given constraints) but is still inefficient compared to O(1) math.

## Optimal Solution

The optimal solution uses simple distance comparison. Since both people move at the same speed toward Person 3, whoever has the shorter distance to Person 3 will arrive first. We calculate absolute distances and compare them.

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def find_closest_person(x: int, y: int, z: int) -> int:
    """
    Determine which person reaches Person 3 first.

    Args:
        x: Position of Person 1
        y: Position of Person 2
        z: Position of Person 3 (stationary)

    Returns:
        1 if Person 1 reaches first,
        2 if Person 2 reaches first,
        3 if both reach at the same time
    """
    # Calculate absolute distances from Person 3
    dist1 = abs(x - z)  # Distance Person 1 needs to travel
    dist2 = abs(y - z)  # Distance Person 2 needs to travel

    # Compare distances to determine who reaches first
    if dist1 < dist2:
        return 1  # Person 1 is closer
    elif dist2 < dist1:
        return 2  # Person 2 is closer
    else:
        return 3  # Both are equally distant
```

```javascript
// Time: O(1) | Space: O(1)
/**
 * Determine which person reaches Person 3 first.
 *
 * @param {number} x - Position of Person 1
 * @param {number} y - Position of Person 2
 * @param {number} z - Position of Person 3 (stationary)
 * @return {number} 1 if Person 1 reaches first, 2 if Person 2 reaches first, 3 if both reach at same time
 */
function findClosestPerson(x, y, z) {
  // Calculate absolute distances from Person 3
  const dist1 = Math.abs(x - z); // Distance Person 1 needs to travel
  const dist2 = Math.abs(y - z); // Distance Person 2 needs to travel

  // Compare distances to determine who reaches first
  if (dist1 < dist2) {
    return 1; // Person 1 is closer
  } else if (dist2 < dist1) {
    return 2; // Person 2 is closer
  } else {
    return 3; // Both are equally distant
  }
}
```

```java
// Time: O(1) | Space: O(1)
class Solution {
    /**
     * Determine which person reaches Person 3 first.
     *
     * @param x Position of Person 1
     * @param y Position of Person 2
     * @param z Position of Person 3 (stationary)
     * @return 1 if Person 1 reaches first, 2 if Person 2 reaches first, 3 if both reach at same time
     */
    public int findClosestPerson(int x, int y, int z) {
        // Calculate absolute distances from Person 3
        int dist1 = Math.abs(x - z);  // Distance Person 1 needs to travel
        int dist2 = Math.abs(y - z);  // Distance Person 2 needs to travel

        // Compare distances to determine who reaches first
        if (dist1 < dist2) {
            return 1;  // Person 1 is closer
        } else if (dist2 < dist1) {
            return 2;  // Person 2 is closer
        } else {
            return 3;  // Both are equally distant
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(1)

- We perform a constant number of operations: two subtractions, two absolute values, and one comparison
- No loops or recursion, so time is constant regardless of input values

**Space Complexity:** O(1)

- We only store a few integer variables (dist1, dist2)
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting absolute value:** Some candidates calculate `x - z` and `y - z` without taking absolute values. This fails when people are on opposite sides of Person 3. For example, if `x = 5`, `y = -3`, `z = 1`, then `x - z = 4` and `y - z = -4`. Without absolute values, the comparison would be incorrect.

2. **Misunderstanding movement direction:** Assuming both people always move right or always move left. Remember: people move _toward_ Person 3, which could be in either direction depending on their starting position relative to Person 3.

3. **Overcomplicating with simulation:** Trying to simulate step-by-step movement instead of recognizing the simple distance comparison. This adds unnecessary complexity and could lead to infinite loops if not implemented carefully.

4. **Incorrect return value for equal distances:** Returning 0, -1, or some other value instead of 3 when distances are equal. The problem specifically states to return 3 in this case.

## When You'll See This Pattern

This problem teaches the **distance comparison pattern**, which appears in many geometry and optimization problems:

1. **Minimum Distance to Target (LeetCode 1779)**: Find the point with smallest Manhattan distance to a target—similar concept of comparing distances.

2. **Shortest Word Distance (LeetCode 243)**: Find the minimum distance between two words in a list—involves tracking positions and comparing distances.

3. **Closest Binary Search Tree Value (LeetCode 270)**: Find the value in a BST closest to a target—uses distance comparison while traversing the tree.

The core pattern is recognizing that when speeds are equal, the problem reduces to comparing distances. This simplification transforms what seems like a simulation problem into a simple calculation.

## Key Takeaways

1. **Simplify movement problems**: When objects move at equal speed toward a target, you only need to compare initial distances. Don't simulate what you can calculate.

2. **Absolute values matter for direction**: When measuring distance to a point, use absolute value to handle positions on either side of the target.

3. **Read return requirements carefully**: The problem specifies to return 3 for equal distances, not 0 or some other convention. Always check the exact output format.

[Practice this problem on CodeJeet](/problem/find-closest-person)
