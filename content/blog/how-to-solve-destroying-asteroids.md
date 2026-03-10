---
title: "How to Solve Destroying Asteroids — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Destroying Asteroids. Medium difficulty, 53.3% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2028-02-23"
category: "dsa-patterns"
tags: ["destroying-asteroids", "array", "greedy", "sorting", "medium"]
---

# How to Solve Destroying Asteroids

You're given a planet with initial mass and an array of asteroid masses. The planet can collide with asteroids in any order, and when it collides with an asteroid of equal or smaller mass, it gains that asteroid's mass. If it encounters an asteroid larger than its current mass, the planet is destroyed. The challenge is to determine if you can destroy all asteroids by choosing an optimal collision order. What makes this interesting is that the order matters—some sequences work while others fail, even with the same asteroids.

## Visual Walkthrough

Let's trace through an example: `mass = 10`, `asteroids = [3, 9, 19, 5, 21]`

**Key insight:** The planet can only destroy asteroids smaller than or equal to its current mass, and each successful destruction makes it heavier. This suggests we should start with the smallest asteroids first to build up mass gradually.

**Step-by-step with optimal ordering:**

1. Sort asteroids: `[3, 5, 9, 19, 21]`
2. Current mass = 10
3. Asteroid 3 ≤ 10 → destroy it, mass becomes 13
4. Asteroid 5 ≤ 13 → destroy it, mass becomes 18
5. Asteroid 9 ≤ 18 → destroy it, mass becomes 27
6. Asteroid 19 ≤ 27 → destroy it, mass becomes 46
7. Asteroid 21 ≤ 46 → destroy it, mass becomes 67
8. All asteroids destroyed → return `true`

**What if we tried a bad order?** Suppose we started with asteroid 21 first:

- Current mass = 10
- Asteroid 21 > 10 → planet destroyed immediately → return `false`

This shows why ordering matters: starting with smaller asteroids lets us build up mass to handle larger ones later.

## Brute Force Approach

A naive approach would try all possible permutations of asteroid collision orders. For each permutation, simulate collisions in that order, checking if the planet survives all collisions. This is essentially a brute-force search through all possible sequences.

**Why this fails:**

- With n asteroids, there are n! possible permutations
- For n = 100 (a reasonable test case), 100! is astronomically large (~9.3×10¹⁵⁷)
- Even for n = 20, 20! ≈ 2.4×10¹⁸ operations is far too slow
- This approach has O(n! × n) time complexity, which is completely impractical

The brute force teaches us that we need a smarter way to choose the collision order without trying every possibility.

## Optimized Approach

The key insight comes from observing the destruction mechanics: the planet only grows when it destroys asteroids, and it can only destroy asteroids smaller than or equal to its current mass. This creates a natural greedy strategy:

1. **Always destroy the smallest available asteroid first** - This minimizes the risk of encountering an asteroid too large to handle
2. **After each destruction, the planet grows**, making it capable of handling larger asteroids
3. **If at any point the smallest remaining asteroid is larger than the current planet mass**, we can't destroy it (and therefore can't destroy any asteroids)

This leads to the algorithm:

1. Sort the asteroids in ascending order
2. Iterate through the sorted asteroids
3. For each asteroid:
   - If asteroid mass ≤ current planet mass: add asteroid mass to planet mass
   - Else: return `false` (planet destroyed)
4. If we process all asteroids: return `true`

**Why sorting works:** By always taking the smallest available asteroid, we ensure we never miss an opportunity to grow the planet when possible. If we can't handle the smallest asteroid, we certainly can't handle any larger ones. This greedy choice is optimal because any successful sequence can be rearranged to process asteroids in increasing order without breaking the success condition.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def asteroidsDestroyed(mass, asteroids):
    """
    Determines if a planet can destroy all asteroids by colliding with them.

    Args:
        mass: Initial mass of the planet
        asteroids: List of asteroid masses

    Returns:
        bool: True if all asteroids can be destroyed, False otherwise
    """
    # Step 1: Sort asteroids in ascending order
    # This allows us to always try the smallest available asteroid first
    asteroids.sort()

    # Step 2: Iterate through each asteroid in sorted order
    for asteroid in asteroids:
        # Step 3: Check if planet can destroy this asteroid
        if asteroid > mass:
            # Asteroid is too large - planet gets destroyed
            return False

        # Step 4: Planet destroys asteroid and gains its mass
        # Note: We use integer addition since masses are integers
        mass += asteroid

    # Step 5: All asteroids successfully destroyed
    return True
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
/**
 * Determines if a planet can destroy all asteroids by colliding with them.
 *
 * @param {number} mass - Initial mass of the planet
 * @param {number[]} asteroids - Array of asteroid masses
 * @return {boolean} - True if all asteroids can be destroyed, False otherwise
 */
function asteroidsDestroyed(mass, asteroids) {
  // Step 1: Sort asteroids in ascending order
  // Using (a, b) => a - b ensures numerical sorting (default is string sorting)
  asteroids.sort((a, b) => a - b);

  // Step 2: Iterate through each asteroid in sorted order
  for (let asteroid of asteroids) {
    // Step 3: Check if planet can destroy this asteroid
    if (asteroid > mass) {
      // Asteroid is too large - planet gets destroyed
      return false;
    }

    // Step 4: Planet destroys asteroid and gains its mass
    // Using BigInt would be needed for extremely large numbers beyond Number.MAX_SAFE_INTEGER
    mass += asteroid;
  }

  // Step 5: All asteroids successfully destroyed
  return true;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
class Solution {
    /**
     * Determines if a planet can destroy all asteroids by colliding with them.
     *
     * @param mass Initial mass of the planet
     * @param asteroids Array of asteroid masses
     * @return True if all asteroids can be destroyed, False otherwise
     */
    public boolean asteroidsDestroyed(int mass, int[] asteroids) {
        // Step 1: Sort asteroids in ascending order
        // Arrays.sort uses dual-pivot quicksort for primitives
        Arrays.sort(asteroids);

        // Use long to prevent integer overflow when adding many asteroids
        // The problem constraints allow asteroid masses up to 10^5 and n up to 10^5,
        // so total mass could exceed Integer.MAX_VALUE
        long currentMass = mass;

        // Step 2: Iterate through each asteroid in sorted order
        for (int asteroid : asteroids) {
            // Step 3: Check if planet can destroy this asteroid
            if (asteroid > currentMass) {
                // Asteroid is too large - planet gets destroyed
                return false;
            }

            // Step 4: Planet destroys asteroid and gains its mass
            currentMass += asteroid;
        }

        // Step 5: All asteroids successfully destroyed
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the asteroids dominates: O(n log n) for comparison-based sorts
- The single pass through the sorted array is O(n)
- Total: O(n log n) + O(n) = O(n log n)

**Space Complexity: O(1) or O(n)**

- **Python:** `list.sort()` uses Timsort which needs O(n) space in worst case
- **JavaScript:** The ECMAScript spec doesn't guarantee in-place sorting, but most implementations use O(log n) to O(n) space
- **Java:** `Arrays.sort()` for primitives uses a dual-pivot quicksort with O(log n) stack space
- If we consider only auxiliary space (excluding input storage): O(1) for Python/Java, O(log n) to O(n) for JavaScript
- If we consider total space including input: O(n)

## Common Mistakes

1. **Not sorting the asteroids:** The most common mistake is trying to process asteroids in their given order. Remember: you can choose any order, so you should choose the optimal one (smallest first).

2. **Integer overflow:** When the planet mass grows very large (up to 10⁵ × 10⁵ = 10¹⁰ in worst case), it can exceed 32-bit integer limits. Java's `int` type max is ~2.1×10⁹, so using `int` for accumulating mass can overflow. Always use `long` in Java for accumulation.

3. **Forgetting edge cases:**
   - Empty asteroid array: should return `true` (planet survives with no threats)
   - Single asteroid smaller than mass: should return `true`
   - Single asteroid larger than mass: should return `false`
   - All asteroids equal to mass: should work (equal mass is allowed)

4. **Incorrect sorting in JavaScript:** Using `asteroids.sort()` without a comparator function sorts lexicographically (as strings), not numerically. For example, `[10, 2, 1]` would sort to `[1, 10, 2]` instead of `[1, 2, 10]`. Always use `sort((a, b) => a - b)` for numerical sorting.

## When You'll See This Pattern

This problem uses a **greedy algorithm with sorting**, a common pattern for problems where order matters and you want to maximize or minimize some outcome. The core idea: sort items by some criterion, then process them in that order making locally optimal choices.

**Related problems:**

1. **Asteroid Collision (LeetCode 735)** - Also involves asteroids and collisions, but with different rules (direction matters). Both require careful thinking about collision order.
2. **Assign Cookies (LeetCode 455)** - Another greedy sorting problem: match children with cookie sizes to maximize satisfied children.
3. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)** - Sort intervals by end point, then greedily shoot arrows to burst as many balloons as possible.
4. **Queue Reconstruction by Height (LeetCode 406)** - Sort people by height, then insert them into positions based on how many taller people should be in front.

## Key Takeaways

1. **When order matters and you can choose it, sorting is often the key insight.** If a problem says "in any order" or "you can arrange", consider whether sorting by some property gives an optimal sequence.

2. **Greedy algorithms often work when local optimal choices lead to global optimum.** Here, always destroying the smallest available asteroid is locally optimal and leads to the best chance of surviving all asteroids.

3. **Test with small examples to build intuition.** The visual walkthrough with concrete numbers helps verify the sorting approach works before implementing it.

**Related problems:** [Asteroid Collision](/problem/asteroid-collision)
