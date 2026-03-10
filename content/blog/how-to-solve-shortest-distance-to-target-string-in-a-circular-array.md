---
title: "How to Solve Shortest Distance to Target String in a Circular Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Shortest Distance to Target String in a Circular Array. Easy difficulty, 50.6% acceptance rate. Topics: Array, String."
date: "2028-12-05"
category: "dsa-patterns"
tags: ["shortest-distance-to-target-string-in-a-circular-array", "array", "string", "easy"]
---

# How to Solve Shortest Distance to Target String in a Circular Array

This problem asks us to find the shortest distance from a starting index to a target string in a circular array. The "circular" aspect means we can move both forward and backward, wrapping around the array boundaries. What makes this interesting is that we need to consider both directions and calculate the minimum distance, which requires understanding modular arithmetic for circular traversal.

## Visual Walkthrough

Let's walk through an example: `words = ["hello", "world", "code", "leet"]`, `target = "leet"`, `startIndex = 1`.

We start at index 1 ("world") and need to find the shortest path to "leet" which appears at index 3.

**Forward direction:**

- From index 1 → index 2: distance 1
- From index 1 → index 3: distance 2 (found target!)

**Backward direction:**

- From index 1 → index 0: distance 1
- From index 1 → index 3 (wrapping around): distance 2

Wait, that's the same distance in both directions! Let's check the backward calculation more carefully. When moving backward from index 1:

- Step 1: index 0 (distance 1)
- Step 2: index 3 (distance 2, since array wraps around)

So the minimum distance is 2.

But what if we had `words = ["a", "b", "c", "d", "e"]`, `target = "a"`, `startIndex = 4`?

**Forward direction:**

- From index 4 → index 0 (wrapping): distance 1

**Backward direction:**

- From index 4 → index 3: distance 1
- From index 4 → index 2: distance 2
- From index 4 → index 1: distance 3
- From index 4 → index 0: distance 4

Here, forward gives us distance 1, backward gives us distance 4, so the minimum is 1.

The key insight is that we need to check both directions and take the minimum, accounting for the circular nature of the array.

## Brute Force Approach

A naive approach would be to search outward in both directions simultaneously until we find the target. We could:

1. Check if the current index contains the target (distance 0)
2. Check indices at distance 1 in both directions
3. Check indices at distance 2 in both directions
4. Continue until we find the target

While this would work, it's not the most efficient way to think about the problem. A more systematic brute force would be to:

1. Find all indices where `words[i] == target`
2. For each matching index, calculate the distance from `startIndex` in both forward and backward directions
3. Take the minimum of all these distances

The issue with this approach is that we might scan the entire array multiple times. However, since the array size is limited (n ≤ 100 in typical constraints), even this would be acceptable. But we can do better with a single pass.

Actually, let me correct that thinking. The optimal solution for this problem is quite straightforward - we just need to check each index once and calculate the minimum distance. The "brute force" here would simply be checking every index and calculating the distance if it contains the target.

## Optimal Solution

The optimal approach is to iterate through the array once. For each index where `words[i] == target`, we calculate:

1. Forward distance: `(i - startIndex + n) % n` (handles wrap-around)
2. Backward distance: `(startIndex - i + n) % n`
3. Take the minimum of these two distances
4. Keep track of the overall minimum across all matching indices

The key formula uses modular arithmetic to handle the circular nature correctly. When calculating forward distance from startIndex to i, we use `(i - startIndex + n) % n` to ensure we get a positive result even when wrapping around.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def closetTarget(words, target, startIndex):
    """
    Finds the shortest distance to reach the target string in a circular array.

    Args:
        words: List of strings representing the circular array
        target: The string to search for
        startIndex: The starting position in the array

    Returns:
        The minimum distance to reach the target, or -1 if target not found
    """
    n = len(words)
    min_distance = float('inf')  # Initialize with infinity

    # Iterate through all indices in the array
    for i in range(n):
        # Check if current word matches the target
        if words[i] == target:
            # Calculate forward distance (moving right/wrapping forward)
            # (i - startIndex + n) % n ensures positive result when wrapping
            forward_dist = (i - startIndex + n) % n

            # Calculate backward distance (moving left/wrapping backward)
            # (startIndex - i + n) % n ensures positive result when wrapping
            backward_dist = (startIndex - i + n) % n

            # Take the minimum of forward and backward distances
            current_min = min(forward_dist, backward_dist)

            # Update overall minimum distance
            min_distance = min(min_distance, current_min)

    # If target was never found, return -1
    # Otherwise return the minimum distance found
    return -1 if min_distance == float('inf') else min_distance
```

```javascript
// Time: O(n) | Space: O(1)
function closetTarget(words, target, startIndex) {
  /**
   * Finds the shortest distance to reach the target string in a circular array.
   *
   * @param {string[]} words - The circular array of strings
   * @param {string} target - The string to search for
   * @param {number} startIndex - The starting position in the array
   * @return {number} The minimum distance to reach the target, or -1 if not found
   */
  const n = words.length;
  let minDistance = Infinity; // Initialize with a very large number

  // Check each position in the array
  for (let i = 0; i < n; i++) {
    // If we found the target at this position
    if (words[i] === target) {
      // Calculate forward distance (moving right/clockwise)
      // Adding n before modulo ensures we get positive result when wrapping
      const forwardDist = (i - startIndex + n) % n;

      // Calculate backward distance (moving left/counter-clockwise)
      const backwardDist = (startIndex - i + n) % n;

      // Take the smaller of the two distances
      const currentMin = Math.min(forwardDist, backwardDist);

      // Update our overall minimum
      minDistance = Math.min(minDistance, currentMin);
    }
  }

  // If we never found the target, return -1
  // Otherwise return the minimum distance
  return minDistance === Infinity ? -1 : minDistance;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int closetTarget(String[] words, String target, int startIndex) {
        /**
         * Finds the shortest distance to reach the target string in a circular array.
         *
         * @param words The circular array of strings
         * @param target The string to search for
         * @param startIndex The starting position in the array
         * @return The minimum distance to reach the target, or -1 if not found
         */
        int n = words.length;
        int minDistance = Integer.MAX_VALUE;  // Initialize with maximum possible value

        // Iterate through all positions in the array
        for (int i = 0; i < n; i++) {
            // Check if current word equals the target
            if (words[i].equals(target)) {
                // Calculate forward distance (moving right)
                // The +n before %n handles negative values when wrapping around
                int forwardDist = (i - startIndex + n) % n;

                // Calculate backward distance (moving left)
                int backwardDist = (startIndex - i + n) % n;

                // Get the minimum of the two directions
                int currentMin = Math.min(forwardDist, backwardDist);

                // Update overall minimum distance
                minDistance = Math.min(minDistance, currentMin);
            }
        }

        // If target was not found, return -1
        // Otherwise return the minimum distance
        return minDistance == Integer.MAX_VALUE ? -1 : minDistance;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, checking each element exactly once
- For each element, we perform constant-time operations (string comparison and arithmetic)
- Even though we might find multiple occurrences of the target, we still only visit each index once

**Space Complexity: O(1)**

- We only use a fixed number of variables (n, min_distance, i, forward_dist, backward_dist, current_min)
- No additional data structures that grow with input size
- The input array is given and not counted toward our space usage

## Common Mistakes

1. **Forgetting to handle the case when target is not found**: Many candidates forget to return -1 when the target doesn't exist in the array. Always initialize your minimum distance to a sentinel value (like infinity) and check if it was updated before returning.

2. **Incorrect modular arithmetic for negative values**: When calculating `(i - startIndex) % n` in some languages (like C++ or Java), negative results give negative remainders. The correct formula is `(i - startIndex + n) % n` to ensure we always get a positive distance.

3. **Only checking one direction**: Some candidates only calculate the forward distance or assume the shortest path is always forward. Remember that in a circular array, sometimes going backward (wrapping around) gives a shorter distance.

4. **Off-by-one errors with array bounds**: When the array has only one element, both forward and backward distances should be 0. Make sure your formula handles this edge case: `(0 - 0 + 1) % 1 = 0` and `(0 - 0 + 1) % 1 = 0`.

## When You'll See This Pattern

This problem teaches the pattern of **circular array traversal with modular arithmetic**. You'll see similar patterns in:

1. **Defuse the Bomb (LeetCode 1652)**: This problem also involves circular arrays where you need to calculate sums of elements in a sliding window that wraps around. The modular arithmetic technique is identical.

2. **Circular Array Loop (LeetCode 457)**: Detecting cycles in a circular array requires similar wrapping logic with modular arithmetic.

3. **Find the Winner of the Circular Game (LeetCode 1823)**: The Josephus problem in a circular arrangement uses modular arithmetic to determine elimination order.

The core technique is using `(index ± offset + n) % n` to safely navigate circular arrays without index out of bounds errors.

## Key Takeaways

1. **Modular arithmetic is the key to circular arrays**: The formula `(i ± offset + n) % n` handles wrap-around automatically and works for both forward and backward traversal.

2. **Always consider both directions in circular problems**: The shortest path might be forward or backward, so calculate both and take the minimum.

3. **Initialize sentinel values properly**: Use `infinity` or `Integer.MAX_VALUE` for minimum distance problems to easily detect when no solution was found.

4. **Test edge cases**: Single element arrays, target at startIndex, target not found, and arrays where wrapping gives a shorter path are all important to test.

Related problems: [Defuse the Bomb](/problem/defuse-the-bomb)
