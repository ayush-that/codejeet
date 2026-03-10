---
title: "How to Solve Can Place Flowers — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Can Place Flowers. Easy difficulty, 29.1% acceptance rate. Topics: Array, Greedy."
date: "2026-08-01"
category: "dsa-patterns"
tags: ["can-place-flowers", "array", "greedy", "easy"]
---

# How to Solve Can Place Flowers

You're given a flowerbed represented as an array of 0s (empty) and 1s (planted), and you need to determine if you can plant `n` new flowers without violating the "no adjacent flowers" rule. The tricky part is that you need to check each potential planting spot while considering how planting affects adjacent spots — but you can't actually modify the array while checking, you just need to determine if it's _possible_.

## Visual Walkthrough

Let's trace through an example: `flowerbed = [1,0,0,0,1]`, `n = 1`

We need to check each empty spot (0) to see if we can plant there:

1. **Index 0**: Value is 1 (already planted) → skip
2. **Index 1**: Value is 0 (empty)
   - Check left neighbor (index 0): it's 1 (planted) → cannot plant here
3. **Index 2**: Value is 0 (empty)
   - Check left neighbor (index 1): it's 0 (empty)
   - Check right neighbor (index 3): it's 0 (empty)
   - Both neighbors are empty → we CAN plant here!
   - We've found 1 valid spot, and we need 1 flower → return `true`

What if we needed `n = 2`? After finding the spot at index 2, we'd continue checking: 4. **Index 3**: Value is 0 (empty)

- Check left neighbor (index 2): we just planted there (but in reality we're just checking, not modifying)
- Actually, we need to be careful: if we plant at index 2, index 3 becomes invalid. But we're just checking feasibility, not actually planting. The correct approach is to check if a spot is plantable given the _current_ state, and if we "plant" there conceptually, we should mark it somehow for future checks.

This reveals the core insight: we can greedily plant in any valid spot we find, because planting early never hurts our chances later — it only reduces the available spots, which is fine if we're just checking if we can reach `n`.

## Brute Force Approach

A naive approach might try all combinations of planting spots, but that would be O(2^n) — far too slow. Another brute force would be to repeatedly scan the array, planting in the first valid spot we find, then updating the array, and continuing until we've planted `n` flowers or no more valid spots exist.

The problem with this approach is it requires modifying the array, which isn't necessary. More importantly, it's O(n²) in the worst case (if we scan the entire array for each flower we plant). While this might pass for small inputs, it's inefficient and shows poor algorithmic thinking.

## Optimal Solution

The optimal solution uses a **greedy** approach with a **single pass** through the array. We check each position and plant if it's valid, counting as we go. The key insight is that we can check validity by looking at the current position and its immediate neighbors, and we don't need to backtrack because planting early never reduces our maximum possible plantings — if we can plant `n` flowers, the greedy approach will find at least one way to do it.

Here's why greedy works: If we have an empty spot with empty neighbors, planting there is always optimal because:

1. It uses up one flower (which we need to do anyway)
2. It only affects adjacent spots, which would have been unusable anyway if we planted here later
3. It doesn't affect spots further away

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def canPlaceFlowers(flowerbed, n):
    """
    Determines if n new flowers can be planted in the flowerbed
    without violating the no-adjacent-flowers rule.

    Args:
        flowerbed: List[int] - array of 0s (empty) and 1s (planted)
        n: int - number of new flowers to plant

    Returns:
        bool - True if n flowers can be planted, False otherwise
    """
    # Edge case: if n is 0, we can always "plant" 0 flowers
    if n == 0:
        return True

    length = len(flowerbed)

    # Iterate through each position in the flowerbed
    for i in range(length):
        # Check if current spot is empty
        if flowerbed[i] == 0:
            # Check left neighbor (if it exists)
            left_empty = (i == 0) or (flowerbed[i - 1] == 0)
            # Check right neighbor (if it exists)
            right_empty = (i == length - 1) or (flowerbed[i + 1] == 0)

            # If both neighbors are empty (or don't exist), we can plant here
            if left_empty and right_empty:
                # "Plant" the flower by marking the spot
                flowerbed[i] = 1
                # Decrease the number of flowers we need to plant
                n -= 1

                # If we've planted all required flowers, return True
                if n == 0:
                    return True

    # If we've checked all spots and still need more flowers, return False
    return False
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Determines if n new flowers can be planted in the flowerbed
 * without violating the no-adjacent-flowers rule.
 *
 * @param {number[]} flowerbed - array of 0s (empty) and 1s (planted)
 * @param {number} n - number of new flowers to plant
 * @return {boolean} - True if n flowers can be planted, False otherwise
 */
function canPlaceFlowers(flowerbed, n) {
  // Edge case: if n is 0, we can always "plant" 0 flowers
  if (n === 0) {
    return true;
  }

  const length = flowerbed.length;

  // Iterate through each position in the flowerbed
  for (let i = 0; i < length; i++) {
    // Check if current spot is empty
    if (flowerbed[i] === 0) {
      // Check left neighbor (if it exists)
      const leftEmpty = i === 0 || flowerbed[i - 1] === 0;
      // Check right neighbor (if it exists)
      const rightEmpty = i === length - 1 || flowerbed[i + 1] === 0;

      // If both neighbors are empty (or don't exist), we can plant here
      if (leftEmpty && rightEmpty) {
        // "Plant" the flower by marking the spot
        flowerbed[i] = 1;
        // Decrease the number of flowers we need to plant
        n--;

        // If we've planted all required flowers, return true
        if (n === 0) {
          return true;
        }
      }
    }
  }

  // If we've checked all spots and still need more flowers, return false
  return false;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Determines if n new flowers can be planted in the flowerbed
     * without violating the no-adjacent-flowers rule.
     *
     * @param flowerbed - array of 0s (empty) and 1s (planted)
     * @param n - number of new flowers to plant
     * @return true if n flowers can be planted, false otherwise
     */
    public boolean canPlaceFlowers(int[] flowerbed, int n) {
        // Edge case: if n is 0, we can always "plant" 0 flowers
        if (n == 0) {
            return true;
        }

        int length = flowerbed.length;

        // Iterate through each position in the flowerbed
        for (int i = 0; i < length; i++) {
            // Check if current spot is empty
            if (flowerbed[i] == 0) {
                // Check left neighbor (if it exists)
                boolean leftEmpty = (i == 0) || (flowerbed[i - 1] == 0);
                // Check right neighbor (if it exists)
                boolean rightEmpty = (i == length - 1) || (flowerbed[i + 1] == 0);

                // If both neighbors are empty (or don't exist), we can plant here
                if (leftEmpty && rightEmpty) {
                    // "Plant" the flower by marking the spot
                    flowerbed[i] = 1;
                    // Decrease the number of flowers we need to plant
                    n--;

                    // If we've planted all required flowers, return true
                    if (n == 0) {
                        return true;
                    }
                }
            }
        }

        // If we've checked all spots and still need more flowers, return false
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the flowerbed array of length `n`
- Each iteration performs constant-time operations: checking the current value and its neighbors
- Even though we modify the array when we "plant" flowers, this is just an assignment operation that takes O(1) time

**Space Complexity: O(1)**

- We use only a constant amount of extra space regardless of input size
- We modify the input array in place, but this is allowed by the problem (and if it weren't, we could use a separate variable to track "planted" status)
- The variables `length`, `i`, and the neighbor checks all use O(1) space

## Common Mistakes

1. **Forgetting edge cases at array boundaries**: When checking neighbors for the first and last elements, candidates often get index out of bounds errors. The solution is to check if `i == 0` before checking `flowerbed[i-1]` and if `i == length-1` before checking `flowerbed[i+1]`.

2. **Not handling n = 0 case**: If `n = 0`, we should return `true` immediately since we can always plant 0 flowers. Some candidates miss this and proceed with unnecessary calculations.

3. **Modifying the array without "planting"**: Some candidates check if a spot is valid but forget to actually mark it as planted (`flowerbed[i] = 1`). This causes incorrect results because subsequent positions will see empty neighbors where there should be a flower.

4. **Overcomplicating with extra data structures**: Candidates sometimes create additional arrays or use complex data structures to track planted flowers, when a simple in-place modification suffices. This wastes time and space.

## When You'll See This Pattern

This greedy single-pass pattern appears in many array manipulation problems where you need to make local decisions that don't affect the global optimum:

1. **Teemo Attacking (Easy)**: Similar time-based array problem where you process events in order and make local decisions about overlapping time intervals.

2. **Asteroid Collision (Medium)**: While implemented with a stack, it also involves processing elements in sequence and making local decisions about collisions.

3. **Jump Game (Medium)**: Another greedy array problem where you make local decisions about how far you can jump from each position.

4. **Maximum Subarray (Easy)**: Kadane's algorithm uses a similar single-pass approach to find the maximum sum subarray.

The key insight is recognizing when a greedy approach works — typically when local optimal choices lead to a global optimum, and you don't need to backtrack.

## Key Takeaways

1. **Greedy works for adjacency constraints**: When you have adjacency rules (like "no two adjacent elements can both be X"), a greedy approach often works because taking an opportunity early never hurts your chances later.

2. **Single-pass array problems often need boundary checks**: Whenever you're checking neighbors in an array, always consider the first and last elements separately to avoid index errors.

3. **In-place modification can simplify solutions**: If allowed, modifying the input array can reduce space complexity and make the logic clearer, as long as you document this side effect.

4. **Early termination optimizes runtime**: Once you've planted all required flowers (`n == 0`), you can return immediately without checking the rest of the array.

Related problems: [Teemo Attacking](/problem/teemo-attacking), [Asteroid Collision](/problem/asteroid-collision)
