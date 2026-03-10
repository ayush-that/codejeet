---
title: "How to Solve Self Crossing — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Self Crossing. Hard difficulty, 34.2% acceptance rate. Topics: Array, Math, Geometry."
date: "2028-09-04"
category: "dsa-patterns"
tags: ["self-crossing", "array", "math", "geometry", "hard"]
---

# How to Solve Self Crossing

You're given an array of distances representing sequential moves in four directions (north, west, south, east, repeating). The challenge is to determine if the path crosses itself at any point. What makes this problem tricky is that self-intersection can occur in multiple patterns, not just when lines directly intersect, but also when the path spirals inward and crosses a line drawn several moves earlier.

## Visual Walkthrough

Let's trace through `[2, 1, 1, 2]` step by step:

1. Start at `(0, 0)`
2. Move north 2 units: `(0, 2)`
3. Move west 1 unit: `(-1, 2)`
4. Move south 1 unit: `(-1, 1)`
5. Move east 2 units: `(1, 1)`

The final eastward move from `(-1, 1)` to `(1, 1)` crosses the initial northward segment from `(0, 0)` to `(0, 2)` at `(0, 1)`. This is a direct crossing.

Now consider `[1, 2, 3, 4]`:

1. North 1: `(0, 1)`
2. West 2: `(-2, 1)`
3. South 3: `(-2, -2)`
4. East 4: `(2, -2)`

No crossing occurs here. The path forms an expanding spiral.

The real challenge comes with patterns like `[3, 3, 4, 2, 2]`:

1. North 3: `(0, 3)`
2. West 3: `(-3, 3)`
3. South 4: `(-3, -1)`
4. East 2: `(-1, -1)`
5. North 2: `(-1, 1)`

Here, the fifth move (north) crosses the first move (north) because the path has spiraled inward. This is the type of crossing that's easy to miss.

## Brute Force Approach

A naive approach would track every segment of the path and check for intersections between each new segment and all previous segments. For each move, we'd need to check if the new line segment intersects with any of the O(n) previous segments. With n moves, this gives O(n²) time complexity.

The intersection checking itself is also non-trivial: we need to handle horizontal/vertical segments, check if they're collinear, and handle edge cases where endpoints touch. While this approach would work for small inputs, it's inefficient and error-prone.

## Optimized Approach

The key insight is that self-crossing only occurs in three specific patterns when the path spirals inward. We don't need to track coordinates or check geometric intersections directly. Instead, we can analyze the distance relationships.

After drawing out many examples, we discover three crossing scenarios:

1. **Fourth line crosses first line**: Occurs when `distance[i] >= distance[i-2]` and `distance[i-1] <= distance[i-3]`

   ```
   i-3: ──────
   i-2: │
        │
   i-1: ──────
   i:   │
   ```

2. **Fifth line meets first line**: Occurs when `i >= 4` and `distance[i-1] == distance[i-3]` and `distance[i] + distance[i-4] >= distance[i-2]`

   ```
   i-4: ──────
   i-3: │
        │
   i-2: ──────
   i-1: │
        │
   i:   ──────
   ```

3. **Sixth line crosses first line**: Occurs when `i >= 5` and `distance[i-2] >= distance[i-4]` and `distance[i-3] >= distance[i-1]` and `distance[i-1] + distance[i-5] >= distance[i-3]` and `distance[i] + distance[i-4] >= distance[i-2]`
   ```
   i-5: ──────
   i-4: │
        │
   i-3: ──────
   i-2: │
        │
   i-1: ──────
   i:   │
   ```

These patterns cover all possible crossing scenarios. The reasoning is that crossings only happen when the path turns inward sharply enough to intersect with a segment drawn 3, 4, or 5 moves earlier.

## Optimal Solution

We iterate through the distances, checking for the three crossing patterns at each step. If any pattern matches, we return true immediately. If we finish without finding a crossing, return false.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def isSelfCrossing(distance):
    """
    Check if the path crosses itself using the three crossing patterns.
    Pattern 1: Fourth line crosses first (i >= 3)
    Pattern 2: Fifth line meets first (i >= 4)
    Pattern 3: Sixth line crosses first (i >= 5)
    """
    n = len(distance)

    for i in range(n):
        # Pattern 1: Fourth line crosses first line
        # Happens when current line is long enough to reach or pass the line from 3 steps ago
        if i >= 3 and distance[i] >= distance[i-2] and distance[i-1] <= distance[i-3]:
            return True

        # Pattern 2: Fifth line meets first line
        # Happens when the previous line exactly aligns with line from 3 steps ago
        # and current line is long enough to reach line from 2 steps ago
        if i >= 4 and distance[i-1] == distance[i-3] and distance[i] + distance[i-4] >= distance[i-2]:
            return True

        # Pattern 3: Sixth line crosses first line
        # Most complex pattern involving lines from 4 and 5 steps ago
        if i >= 5 and distance[i-2] >= distance[i-4] and distance[i-3] >= distance[i-1] and \
           distance[i-1] + distance[i-5] >= distance[i-3] and distance[i] + distance[i-4] >= distance[i-2]:
            return True

    return False
```

```javascript
// Time: O(n) | Space: O(1)
function isSelfCrossing(distance) {
  /**
   * Check if the path crosses itself using the three crossing patterns.
   * Pattern 1: Fourth line crosses first (i >= 3)
   * Pattern 2: Fifth line meets first (i >= 4)
   * Pattern 3: Sixth line crosses first (i >= 5)
   */
  const n = distance.length;

  for (let i = 0; i < n; i++) {
    // Pattern 1: Fourth line crosses first line
    // Current line reaches or passes the line from 3 steps ago
    if (i >= 3 && distance[i] >= distance[i - 2] && distance[i - 1] <= distance[i - 3]) {
      return true;
    }

    // Pattern 2: Fifth line meets first line
    // Previous line aligns exactly with line from 3 steps ago
    // Current line reaches line from 2 steps ago
    if (
      i >= 4 &&
      distance[i - 1] === distance[i - 3] &&
      distance[i] + distance[i - 4] >= distance[i - 2]
    ) {
      return true;
    }

    // Pattern 3: Sixth line crosses first line
    // Complex pattern involving lines from 4 and 5 steps ago
    if (
      i >= 5 &&
      distance[i - 2] >= distance[i - 4] &&
      distance[i - 3] >= distance[i - 1] &&
      distance[i - 1] + distance[i - 5] >= distance[i - 3] &&
      distance[i] + distance[i - 4] >= distance[i - 2]
    ) {
      return true;
    }
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean isSelfCrossing(int[] distance) {
        /**
         * Check if the path crosses itself using the three crossing patterns.
         * Pattern 1: Fourth line crosses first (i >= 3)
         * Pattern 2: Fifth line meets first (i >= 4)
         * Pattern 3: Sixth line crosses first (i >= 5)
         */
        int n = distance.length;

        for (int i = 0; i < n; i++) {
            // Pattern 1: Fourth line crosses first line
            // Current line reaches or passes the line from 3 steps ago
            if (i >= 3 && distance[i] >= distance[i-2] && distance[i-1] <= distance[i-3]) {
                return true;
            }

            // Pattern 2: Fifth line meets first line
            // Previous line aligns exactly with line from 3 steps ago
            // Current line reaches line from 2 steps ago
            if (i >= 4 && distance[i-1] == distance[i-3] &&
                distance[i] + distance[i-4] >= distance[i-2]) {
                return true;
            }

            // Pattern 3: Sixth line crosses first line
            // Complex pattern involving lines from 4 and 5 steps ago
            if (i >= 5 && distance[i-2] >= distance[i-4] &&
                distance[i-3] >= distance[i-1] &&
                distance[i-1] + distance[i-5] >= distance[i-3] &&
                distance[i] + distance[i-4] >= distance[i-2]) {
                return true;
            }
        }

        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the length of the distance array. We make a single pass through the array, performing constant-time checks at each step.

**Space Complexity:** O(1). We only use a few variables for indices and comparisons, regardless of input size. We don't store the path coordinates or any additional data structures.

## Common Mistakes

1. **Checking only adjacent segments**: Many candidates only check if the current segment intersects with the immediately previous one, missing crossings that occur with segments drawn several moves earlier.

2. **Incorrect pattern conditions**: The inequality signs in the patterns are crucial. For example, in Pattern 1, it's `distance[i-1] <= distance[i-3]`, not `<`. The equals case matters because touching at endpoints still counts as crossing.

3. **Forgetting to check all three patterns**: Some candidates discover Pattern 1 but miss Patterns 2 and 3, which handle the more subtle inward-spiraling crossings.

4. **Array index errors**: When checking `i >= 3`, `i >= 4`, and `i >= 5`, it's easy to accidentally access `distance[i-5]` when `i` is only 4. Always check the index bound before accessing.

## When You'll See This Pattern

This problem teaches pattern recognition in sequence analysis. Similar problems include:

1. **Spiral Matrix (LeetCode 54)**: While different in implementation, both require understanding how a path evolves in a structured, repeating pattern.

2. **Robot Bounded In Circle (LeetCode 1041)**: Both involve analyzing a sequence of moves to determine geometric properties of the resulting path.

3. **Convex Polygon (LeetCode 469)**: This problem also involves analyzing a sequence of points/vectors to determine geometric properties.

The core technique is identifying that complex geometric behavior can often be reduced to checking a few specific conditions rather than simulating the entire process.

## Key Takeaways

1. **Look for patterns in constraints**: When a problem seems to require complex geometric calculations, look for simplifying patterns. Here, we discovered that all crossings follow one of three specific distance relationships.

2. **Think about relative comparisons**: Instead of tracking absolute coordinates, we compared distances between non-adjacent moves. This reduced space complexity from O(n) to O(1).

3. **Test edge cases systematically**: The three patterns emerged from analyzing many edge cases. When solving similar problems, systematically test small cases to discover underlying patterns.

[Practice this problem on CodeJeet](/problem/self-crossing)
