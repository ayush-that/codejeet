---
title: "How to Solve Magnetic Force Between Two Balls — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Magnetic Force Between Two Balls. Medium difficulty, 71.9% acceptance rate. Topics: Array, Binary Search, Sorting."
date: "2028-08-09"
category: "dsa-patterns"
tags: ["magnetic-force-between-two-balls", "array", "binary-search", "sorting", "medium"]
---

# How to Solve Magnetic Force Between Two Balls

This problem asks us to place `m` balls into `n` baskets at given positions such that the **minimum magnetic force** between any two balls is maximized. The magnetic force between two balls is simply the absolute difference between their basket positions. What makes this problem interesting is that we're not just finding any arrangement — we're looking for the arrangement that maximizes the smallest gap between balls. This is a classic **"maximize the minimum distance"** problem that appears in many real-world scenarios like placing cell towers, scheduling tasks, or distributing resources.

## Visual Walkthrough

Let's walk through an example: `position = [1, 2, 3, 4, 7]`, `m = 3`

**Step 1: Sort the positions**  
First, we need to sort the positions: `[1, 2, 3, 4, 7]` (already sorted here).

**Step 2: Understand what we're looking for**  
We need to place 3 balls into these 5 baskets. The magnetic force between balls is the distance between their baskets. We want to maximize the **minimum** of these distances.

**Step 3: Try some arrangements**

- If we place balls at positions 1, 2, and 3: distances are 1 and 1 → minimum = 1
- If we place balls at positions 1, 3, and 7: distances are 2 and 4 → minimum = 2
- If we place balls at positions 1, 4, and 7: distances are 3 and 3 → minimum = 3

**Step 4: Can we do better than 3?**  
Let's check if we can achieve minimum distance of 4:  
Start at position 1, next ball must be at least at position 5 (1+4), but we only have 7. So we can place at 1 and 7 (distance 6). Need a third ball: from 7 we need another at 11, which doesn't exist. So we can't place 3 balls with minimum distance 4.

**Step 5: The answer**  
The maximum minimum distance we can achieve is 3.

This manual process gives us insight: we're trying to find the largest distance `d` such that we can place all `m` balls with at least distance `d` between them.

## Brute Force Approach

A naive approach would be to try all possible placements of `m` balls into `n` baskets. This is a combinatorial problem:

1. Generate all combinations of `m` baskets from `n` total baskets
2. For each combination, calculate the minimum distance between consecutive balls
3. Track the maximum of these minimum distances

The number of combinations is C(n, m) = n!/(m!(n-m)!), which grows extremely fast. For n=10^5 and m=10, this is completely infeasible.

Even if we try all possible minimum distances directly, we'd need to check distances from 1 up to the maximum possible (position[-1] - position[0]), which could be up to 10^9. Checking each distance would require O(n) time to verify if we can place all balls, giving us O(n × max_distance) which is also too slow.

## Optimized Approach

The key insight is that we can use **binary search** on the answer space:

1. **What can we binary search on?**  
   We're looking for the maximum minimum distance. The answer must be between:
   - Minimum possible: 1 (balls in adjacent baskets)
   - Maximum possible: (max_position - min_position) / (m-1) in the best case, but we can use (max_position - min_position) as a safe upper bound

2. **Why does binary search work?**  
   If we can place all balls with minimum distance `d`, then we can certainly place them with any smaller distance. Conversely, if we cannot place all balls with distance `d`, we cannot place them with any larger distance either. This monotonic property (feasible for small distances, infeasible for large ones) allows binary search.

3. **How do we check if a distance `d` is feasible?**  
   We use a greedy approach:
   - Place the first ball in the first basket
   - For each subsequent ball, find the next basket that's at least `d` away from the last placed ball
   - If we can place all `m` balls this way, distance `d` is feasible

4. **Binary search process:**
   - Start with `left = 1`, `right = max_position - min_position`
   - While `left ≤ right`:
     - Calculate `mid = (left + right) // 2`
     - Check if we can place all balls with minimum distance `mid`
     - If yes, try larger distances (move `left = mid + 1`)
     - If no, try smaller distances (move `right = mid - 1`)
   - Return `right` (the largest feasible distance)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log(max_distance)) | Space: O(1)
def maxDistance(position, m):
    """
    Returns the maximum minimum distance between m balls placed in baskets.

    Args:
        position: List of basket positions
        m: Number of balls to place

    Returns:
        Maximum possible minimum distance between any two balls
    """
    # Sort positions to make distance calculations meaningful
    position.sort()
    n = len(position)

    # Helper function to check if we can place all m balls with at least min_dist apart
    def can_place(min_dist):
        """
        Greedy check: Try to place m balls with at least min_dist between them.
        Returns True if possible, False otherwise.
        """
        count = 1  # Place first ball in the first basket
        last_pos = position[0]

        # Try to place remaining balls
        for i in range(1, n):
            # If this basket is at least min_dist away from last placed ball
            if position[i] - last_pos >= min_dist:
                count += 1  # Place a ball here
                last_pos = position[i]  # Update last position

                # If we've placed all balls, we're done
                if count == m:
                    return True

        # Couldn't place all m balls
        return False

    # Binary search for the maximum minimum distance
    left = 1  # Minimum possible distance
    right = position[-1] - position[0]  # Maximum possible distance

    while left <= right:
        mid = left + (right - left) // 2  # Avoid potential overflow

        if can_place(mid):
            # If we can place with distance mid, try for larger distance
            left = mid + 1
        else:
            # If we can't place with distance mid, try smaller distance
            right = mid - 1

    # right contains the largest feasible distance
    return right
```

```javascript
// Time: O(n log(max_distance)) | Space: O(1)
function maxDistance(position, m) {
  /**
   * Returns the maximum minimum distance between m balls placed in baskets.
   *
   * @param {number[]} position - Array of basket positions
   * @param {number} m - Number of balls to place
   * @return {number} Maximum possible minimum distance between any two balls
   */

  // Sort positions to make distance calculations meaningful
  position.sort((a, b) => a - b);
  const n = position.length;

  // Helper function to check if we can place all m balls with at least minDist apart
  const canPlace = (minDist) => {
    /**
     * Greedy check: Try to place m balls with at least minDist between them.
     * Returns true if possible, false otherwise.
     */
    let count = 1; // Place first ball in the first basket
    let lastPos = position[0];

    // Try to place remaining balls
    for (let i = 1; i < n; i++) {
      // If this basket is at least minDist away from last placed ball
      if (position[i] - lastPos >= minDist) {
        count++; // Place a ball here
        lastPos = position[i]; // Update last position

        // If we've placed all balls, we're done
        if (count === m) {
          return true;
        }
      }
    }

    // Couldn't place all m balls
    return false;
  };

  // Binary search for the maximum minimum distance
  let left = 1; // Minimum possible distance
  let right = position[n - 1] - position[0]; // Maximum possible distance

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2); // Avoid potential overflow

    if (canPlace(mid)) {
      // If we can place with distance mid, try for larger distance
      left = mid + 1;
    } else {
      // If we can't place with distance mid, try smaller distance
      right = mid - 1;
    }
  }

  // right contains the largest feasible distance
  return right;
}
```

```java
// Time: O(n log(max_distance)) | Space: O(1)
import java.util.Arrays;

class Solution {
    public int maxDistance(int[] position, int m) {
        /**
         * Returns the maximum minimum distance between m balls placed in baskets.
         *
         * @param position Array of basket positions
         * @param m Number of balls to place
         * @return Maximum possible minimum distance between any two balls
         */

        // Sort positions to make distance calculations meaningful
        Arrays.sort(position);
        int n = position.length;

        // Binary search for the maximum minimum distance
        int left = 1;  // Minimum possible distance
        int right = position[n - 1] - position[0];  // Maximum possible distance

        while (left <= right) {
            int mid = left + (right - left) / 2;  // Avoid potential overflow

            if (canPlace(position, m, mid)) {
                // If we can place with distance mid, try for larger distance
                left = mid + 1;
            } else {
                // If we can't place with distance mid, try smaller distance
                right = mid - 1;
            }
        }

        // right contains the largest feasible distance
        return right;
    }

    // Helper function to check if we can place all m balls with at least minDist apart
    private boolean canPlace(int[] position, int m, int minDist) {
        /**
         * Greedy check: Try to place m balls with at least minDist between them.
         * Returns true if possible, false otherwise.
         */
        int count = 1;  // Place first ball in the first basket
        int lastPos = position[0];

        // Try to place remaining balls
        for (int i = 1; i < position.length; i++) {
            // If this basket is at least minDist away from last placed ball
            if (position[i] - lastPos >= minDist) {
                count++;  // Place a ball here
                lastPos = position[i];  // Update last position

                // If we've placed all balls, we're done
                if (count == m) {
                    return true;
                }
            }
        }

        // Couldn't place all m balls
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log(max_distance))**

- Sorting: O(n log n)
- Binary search: O(log(max_distance)) iterations, where max_distance ≤ 10^9
- Each binary search iteration calls `can_place()`: O(n)
- Total: O(n log n + n log(max_distance)) = O(n log(max_distance)) since log(max_distance) dominates log n

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables
- Sorting is typically done in-place (O(1) for heapsort in Java, O(n) for timsort in Python/JavaScript worst case, but we count it as O(1) since we're not allocating additional data structures)

## Common Mistakes

1. **Forgetting to sort the positions**: The greedy placement algorithm only works if positions are sorted. Without sorting, consecutive positions in the array might not be physically close to each other.

2. **Incorrect binary search bounds**:
   - Setting `left = 0` instead of `1`: Minimum distance between balls must be at least 1
   - Setting `right` too small: Should be `position[-1] - position[0]` (maximum possible distance)

3. **Off-by-one errors in the greedy check**:
   - Starting `count` at 0 instead of 1 (we always place the first ball)
   - Not updating `lastPos` correctly after placing a ball
   - Returning too early without checking if we placed all `m` balls

4. **Incorrect binary search update logic**:
   - When `can_place(mid)` returns true, we should search in the right half (`left = mid + 1`)
   - When false, search in the left half (`right = mid - 1`)
   - Confusing these updates will give wrong results

## When You'll See This Pattern

This "maximize the minimum" or "minimize the maximum" pattern with binary search appears in many problems:

1. **Aggressive Cows (SPOJ)**: Exactly the same problem but with cows instead of balls
2. **Capacity To Ship Packages Within D Days (LeetCode 1011)**: Minimize the maximum weight capacity of ships
3. **Split Array Largest Sum (LeetCode 410)**: Minimize the largest sum among subarrays
4. **Koko Eating Bananas (LeetCode 875)**: Minimize the eating speed to finish all bananas in H hours

The pattern to recognize: When you need to optimize an extreme value (min or max) subject to constraints, and there's a monotonic relationship (if value X works, then all values less/greater than X also work), binary search on the answer is often the solution.

## Key Takeaways

1. **"Maximize the minimum" or "minimize the maximum" problems often have binary search solutions**: Look for problems where you're optimizing an extreme value and there's a monotonic feasibility function.

2. **Binary search doesn't require a sorted array to search in**: You can binary search on the answer space (range of possible answers) as long as you have a way to check feasibility for a given candidate.

3. **Greedy verification is common**: For many of these problems, once you fix a candidate value, you can use a greedy algorithm to check if it's feasible. The greedy approach is often straightforward once you know what value you're testing.

4. **Sorting is usually the first step**: Even though the main algorithm is binary search, you'll often need to sort the input first to enable efficient feasibility checking.

Related problems: [Minimized Maximum of Products Distributed to Any Store](/problem/minimized-maximum-of-products-distributed-to-any-store)
