---
title: "How to Solve Find the Number of Distinct Colors Among the Balls — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Number of Distinct Colors Among the Balls. Medium difficulty, 54.2% acceptance rate. Topics: Array, Hash Table, Simulation."
date: "2026-05-21"
category: "dsa-patterns"
tags:
  [
    "find-the-number-of-distinct-colors-among-the-balls",
    "array",
    "hash-table",
    "simulation",
    "medium",
  ]
---

# How to Solve "Find the Number of Distinct Colors Among the Balls"

You're given a `limit` (defining balls labeled `0` to `limit`) and a list of queries where each query `[x, y]` colors ball `x` with color `y`. After each query, you need to return the number of distinct colors currently present on at least one ball. The challenge is that balls can be recolored multiple times, which affects the count of distinct colors in real time. This problem is interesting because it requires efficiently tracking both which colors are currently active and how many balls have each color, since recoloring a ball might remove a color entirely from the system.

## Visual Walkthrough

Let's walk through a concrete example to build intuition. Suppose `limit = 4` (balls 0-4) and `queries = [[1, 3], [2, 3], [1, 2], [3, 1]]`.

**Initial state:** All 5 balls are uncolored. Distinct colors count = 0.

**Query 1: [1, 3]**

- Color ball 1 with color 3.
- Colors present: {3}
- Distinct colors = 1

**Query 2: [2, 3]**

- Color ball 2 with color 3.
- Colors present: {3} (color 3 now appears on two balls)
- Distinct colors = 1

**Query 3: [1, 2]**

- Recolor ball 1 from color 3 to color 2.
- Check: Ball 1 was the only ball with color 3? No, ball 2 still has color 3.
- Colors present: {3, 2}
- Distinct colors = 2

**Query 4: [3, 1]**

- Color ball 3 with color 1.
- Colors present: {3, 2, 1}
- Distinct colors = 3

The key insight: we need to track not just which colors exist, but _how many balls_ have each color. When recoloring a ball, we decrement the count for its old color, and if that count reaches 0, we remove that color from our distinct colors count.

## Brute Force Approach

A naive approach would be to maintain an array `ballColors` of size `limit+1` tracking each ball's current color (with a special value like `-1` for uncolored). After each query:

1. Update `ballColors[x]` to `y`
2. Scan through all `limit+1` balls to collect all colors into a set
3. Return the size of that set

This is straightforward but extremely inefficient: each query takes O(limit) time to scan all balls, making the overall complexity O(n × limit), where n is the number of queries. With `limit` up to 10⁹ in constraints, this is impossible.

Even a slightly better brute force might track colors in a set, but without tracking color frequencies, we can't correctly handle when recoloring removes a color entirely. For example, if we just maintain a set of colors seen so far, in our walkthrough after query 3, we'd incorrectly think color 3 is still present after recoloring ball 1.

## Optimized Approach

The key insight is that we need two data structures working together:

1. **A mapping from ball → color** to quickly update each ball's color
2. **A mapping from color → count** to track how many balls have each color

Here's the step-by-step reasoning:

1. **Initialize:**
   - `ballColor = {}` (dictionary/hash map) to store each ball's current color
   - `colorCount = {}` (dictionary/hash map) to store frequency of each color
   - `distinct = 0` to track current number of distinct colors
   - `result = []` to store answers after each query

2. **For each query `[x, y]`:**
   - If ball `x` already has a color `oldColor`:
     - Decrement `colorCount[oldColor]`
     - If `colorCount[oldColor]` becomes 0:
       - Remove this color from `colorCount`
       - Decrement `distinct` (this color no longer exists on any ball)
   - Assign new color `y` to ball `x` in `ballColor`
   - If `y` is not in `colorCount` or has count 0:
     - Increment `distinct` (this is a new color appearing)
   - Increment `colorCount[y]`
   - Append `distinct` to `result`

3. **Return `result`**

This approach runs in O(1) per query for updates and O(1) for tracking distinct colors, giving us O(n) total time complexity.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n = len(queries) | Space: O(n + limit) but practically O(n)
def queryResults(limit, queries):
    """
    Returns the number of distinct colors after each query.

    Args:
        limit: Maximum ball label (balls are 0 to limit)
        queries: List of [ball, color] pairs

    Returns:
        List of distinct color counts after each query
    """
    # Track current color of each ball
    ball_color = {}
    # Track how many balls have each color
    color_count = {}
    # Current number of distinct colors
    distinct = 0
    # Result array
    result = []

    for x, y in queries:
        # If ball x already has a color, we need to update counts
        if x in ball_color:
            old_color = ball_color[x]
            # Decrement count for old color
            color_count[old_color] -= 1

            # If no more balls have this color, remove it from distinct count
            if color_count[old_color] == 0:
                distinct -= 1
                # Optional: delete from dictionary to save space
                del color_count[old_color]

        # Assign new color to ball x
        ball_color[x] = y

        # Update count for new color
        # If this color is new (not in color_count or count is 0), increment distinct
        if y not in color_count or color_count[y] == 0:
            distinct += 1
            # Initialize count to 0 if color is new
            if y not in color_count:
                color_count[y] = 0

        # Increment count for the new color
        color_count[y] += 1

        # Record current distinct count
        result.append(distinct)

    return result
```

```javascript
// Time: O(n) where n = queries.length | Space: O(n + limit) but practically O(n)
function queryResults(limit, queries) {
  /**
   * Returns the number of distinct colors after each query.
   *
   * @param {number} limit - Maximum ball label (balls are 0 to limit)
   * @param {number[][]} queries - Array of [ball, color] pairs
   * @return {number[]} - Array of distinct color counts after each query
   */

  // Track current color of each ball
  const ballColor = new Map();
  // Track how many balls have each color
  const colorCount = new Map();
  // Current number of distinct colors
  let distinct = 0;
  // Result array
  const result = [];

  for (const [x, y] of queries) {
    // If ball x already has a color, we need to update counts
    if (ballColor.has(x)) {
      const oldColor = ballColor.get(x);
      // Decrement count for old color
      colorCount.set(oldColor, colorCount.get(oldColor) - 1);

      // If no more balls have this color, remove it from distinct count
      if (colorCount.get(oldColor) === 0) {
        distinct--;
        // Optional: delete from map to save space
        colorCount.delete(oldColor);
      }
    }

    // Assign new color to ball x
    ballColor.set(x, y);

    // Update count for new color
    // If this color is new (not in colorCount or count is 0), increment distinct
    if (!colorCount.has(y) || colorCount.get(y) === 0) {
      distinct++;
      // Initialize count to 0 if color is new
      if (!colorCount.has(y)) {
        colorCount.set(y, 0);
      }
    }

    // Increment count for the new color
    colorCount.set(y, colorCount.get(y) + 1);

    // Record current distinct count
    result.push(distinct);
  }

  return result;
}
```

```java
// Time: O(n) where n = queries.size() | Space: O(n + limit) but practically O(n)
import java.util.*;

class Solution {
    public List<Integer> queryResults(int limit, int[][] queries) {
        /**
         * Returns the number of distinct colors after each query.
         *
         * @param limit Maximum ball label (balls are 0 to limit)
         * @param queries Array of [ball, color] pairs
         * @return List of distinct color counts after each query
         */

        // Track current color of each ball
        Map<Integer, Integer> ballColor = new HashMap<>();
        // Track how many balls have each color
        Map<Integer, Integer> colorCount = new HashMap<>();
        // Current number of distinct colors
        int distinct = 0;
        // Result list
        List<Integer> result = new ArrayList<>();

        for (int[] query : queries) {
            int x = query[0];
            int y = query[1];

            // If ball x already has a color, we need to update counts
            if (ballColor.containsKey(x)) {
                int oldColor = ballColor.get(x);
                // Decrement count for old color
                colorCount.put(oldColor, colorCount.get(oldColor) - 1);

                // If no more balls have this color, remove it from distinct count
                if (colorCount.get(oldColor) == 0) {
                    distinct--;
                    // Optional: remove from map to save space
                    colorCount.remove(oldColor);
                }
            }

            // Assign new color to ball x
            ballColor.put(x, y);

            // Update count for new color
            // If this color is new (not in colorCount or count is 0), increment distinct
            if (!colorCount.containsKey(y) || colorCount.get(y) == 0) {
                distinct++;
                // Initialize count to 0 if color is new
                if (!colorCount.containsKey(y)) {
                    colorCount.put(y, 0);
                }
            }

            // Increment count for the new color
            colorCount.put(y, colorCount.get(y) + 1);

            // Record current distinct count
            result.add(distinct);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of queries.

- Each query involves a constant number of hash map operations (get, put, containsKey, etc.), each taking O(1) average time.
- The loop runs exactly n times, so total time is O(n).

**Space Complexity:** O(n + limit) in the worst case, but practically O(n).

- `ballColor` stores at most one entry per unique ball that has been colored. In worst case, all balls 0..limit get colored, giving O(limit) space.
- `colorCount` stores at most one entry per unique color used. In worst case, each ball gets a unique color, giving O(min(n, limit)) space.
- `result` stores n integers, giving O(n) space.
- In practice, since we only store entries for balls that have been colored and colors that are currently active, the space usage is proportional to the number of active balls/colors, not the full limit.

## Common Mistakes

1. **Forgetting to decrement distinct count when a color disappears:**  
   When recoloring a ball, if it was the last ball with its old color, you must decrement the distinct count. Candidates often track colors in a set without tracking frequencies, which causes this error.

2. **Using arrays instead of hash maps for large limits:**  
   With `limit` up to 10⁹, allocating arrays of size `limit+1` is impossible (would require ~4GB memory for integers). Hash maps are essential for sparse storage.

3. **Incorrect initialization for new colors:**  
   When a color first appears, you need to initialize its count to 0 before incrementing. A common mistake is trying to increment a non-existent key without checking if it exists first.

4. **Not handling the case where oldColor == newColor:**  
   If a ball is recolored with the same color it already has, the logic should handle this gracefully. Our solution does: we decrement then increment the same color count, and distinct count remains unchanged.

## When You'll See This Pattern

This "frequency tracking with real-time updates" pattern appears in many problems where you need to maintain aggregate statistics (like distinct counts) while elements are being added, removed, or modified.

Related problems:

1. **Maximum Frequency Stack (LeetCode 895)** - Similar frequency tracking, but with stack operations
2. **Design Underground System (LeetCode 1396)** - Tracking aggregate statistics (average time) from individual events
3. **Find Original Array From Doubled Array (LeetCode 2007)** - Uses frequency counting to match pairs
4. **Top K Frequent Elements (LeetCode 347)** - Also uses frequency counting, though without real-time updates

The core technique of maintaining a frequency map alongside the main data structure is widely applicable to problems involving counting, aggregation, or real-time statistics.

## Key Takeaways

1. **When tracking "distinct" elements with dynamic additions/removals, always track frequencies, not just presence.** A set alone isn't enough when elements can be removed.

2. **Hash maps are your friend for sparse data with large ranges.** When the potential key space is huge (like `limit = 10⁹`) but actual usage is sparse, hash maps provide O(1) operations with memory proportional to actual usage, not the full range.

3. **Think in terms of state transitions.** For each operation (query), consider: what state changes occur, and what invariants need to be maintained? Here, the invariant is: "distinct equals the number of colors with count > 0."

Related problems: [Maximum Number of Balls in a Box](/problem/maximum-number-of-balls-in-a-box)
