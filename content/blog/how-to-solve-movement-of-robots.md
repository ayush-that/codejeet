---
title: "How to Solve Movement of Robots — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Movement of Robots. Medium difficulty, 27.9% acceptance rate. Topics: Array, Brainteaser, Sorting, Prefix Sum."
date: "2029-12-26"
category: "dsa-patterns"
tags: ["movement-of-robots", "array", "brainteaser", "sorting", "medium"]
---

# How to Solve Movement of Robots

This problem involves robots moving on an infinite number line where collisions cause them to change direction. The tricky part is that when robots collide, they don't just stop or disappear—they immediately reverse direction and continue moving. This creates a seemingly complex interaction pattern that would be computationally expensive to simulate directly for large inputs.

## Visual Walkthrough

Let's trace through a small example to build intuition. Consider:

- `nums = [-2, 0, 2]` (robot positions)
- `s = "RLL"` (directions: right, left, left)
- `d = 3` (seconds of movement)

**Initial state (t=0):**

- Robot 0 at position -2, moving right →
- Robot 1 at position 0, moving left ←
- Robot 2 at position 2, moving left ←

**Second 1 (t=1):**

- Robot 0 moves to -1
- Robot 1 moves to -1 → COLLISION! Both reverse direction
- Robot 2 moves to 1

After collision at position -1:

- Robot 0 now moves left ← (was right →)
- Robot 1 now moves right → (was left ←)

**Second 2 (t=2):**

- Robot 0 moves from -1 to -2
- Robot 1 moves from -1 to 0
- Robot 2 moves from 1 to 0 → COLLISION! Both reverse direction

After collision at position 0:

- Robot 1 now moves left ← (was right →)
- Robot 2 now moves right → (was left ←)

**Second 3 (t=3):**

- Robot 0 moves from -2 to -3
- Robot 1 moves from 0 to -1
- Robot 2 moves from 0 to 1

**Final positions:** [-3, -1, 1]

The key insight: When two robots collide and reverse direction, it's equivalent to them passing through each other! Robot 0 started at -2 moving right and ended at -3 (left of start). Robot 1 started at 0 moving left and ended at -1 (right of start). They essentially swapped identities.

## Brute Force Approach

The most straightforward approach is to simulate every second of movement:

1. For each second from 1 to `d`:
   - Move each robot according to its current direction
   - Check for collisions at each position
   - For each collision, reverse the direction of both robots
2. Calculate the sum of distances between all pairs of final positions

Here's what the simulation code might look like:

<div class="code-group">

```python
# Time: O(n * d + n²) | Space: O(n)
def sumDistanceBruteForce(nums, s, d):
    n = len(nums)
    directions = list(s)

    # Simulate d seconds
    for _ in range(d):
        # Move all robots
        for i in range(n):
            if directions[i] == 'R':
                nums[i] += 1
            else:  # 'L'
                nums[i] -= 1

        # Check for collisions
        position_map = {}
        for i in range(n):
            if nums[i] in position_map:
                position_map[nums[i]].append(i)
            else:
                position_map[nums[i]] = [i]

        # Reverse directions for colliding robots
        for pos, robots in position_map.items():
            if len(robots) > 1:
                for i in robots:
                    directions[i] = 'L' if directions[i] == 'R' else 'R'

    # Calculate sum of distances
    total = 0
    for i in range(n):
        for j in range(i + 1, n):
            total += abs(nums[i] - nums[j])

    return total % (10**9 + 7)
```

```javascript
// Time: O(n * d + n²) | Space: O(n)
function sumDistanceBruteForce(nums, s, d) {
  const n = nums.length;
  const directions = s.split("");

  // Simulate d seconds
  for (let t = 0; t < d; t++) {
    // Move all robots
    for (let i = 0; i < n; i++) {
      if (directions[i] === "R") {
        nums[i]++;
      } else {
        // 'L'
        nums[i]--;
      }
    }

    // Check for collisions
    const positionMap = new Map();
    for (let i = 0; i < n; i++) {
      if (!positionMap.has(nums[i])) {
        positionMap.set(nums[i], []);
      }
      positionMap.get(nums[i]).push(i);
    }

    // Reverse directions for colliding robots
    for (const [pos, robots] of positionMap) {
      if (robots.length > 1) {
        for (const i of robots) {
          directions[i] = directions[i] === "R" ? "L" : "R";
        }
      }
    }
  }

  // Calculate sum of distances
  let total = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      total += Math.abs(nums[i] - nums[j]);
    }
  }

  return total % 1000000007;
}
```

```java
// Time: O(n * d + n²) | Space: O(n)
public int sumDistanceBruteForce(int[] nums, String s, int d) {
    int n = nums.length;
    char[] directions = s.toCharArray();

    // Simulate d seconds
    for (int t = 0; t < d; t++) {
        // Move all robots
        for (int i = 0; i < n; i++) {
            if (directions[i] == 'R') {
                nums[i]++;
            } else { // 'L'
                nums[i]--;
            }
        }

        // Check for collisions
        Map<Integer, List<Integer>> positionMap = new HashMap<>();
        for (int i = 0; i < n; i++) {
            positionMap.computeIfAbsent(nums[i], k -> new ArrayList<>()).add(i);
        }

        // Reverse directions for colliding robots
        for (List<Integer> robots : positionMap.values()) {
            if (robots.size() > 1) {
                for (int i : robots) {
                    directions[i] = directions[i] == 'R' ? 'L' : 'R';
                }
            }
        }
    }

    // Calculate sum of distances
    long total = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            total += Math.abs(nums[i] - nums[j]);
        }
    }

    return (int)(total % 1000000007);
}
```

</div>

**Why this fails:** The time complexity is O(n × d + n²), where n can be up to 10⁵ and d up to 10⁹. This is far too slow—we need a solution that doesn't depend on simulating each second.

## Optimized Approach

The key insight is that **collisions don't matter for final positions**. When two robots collide and reverse direction, it's mathematically equivalent to them passing through each other without interacting. Think about it:

1. Robot A at position x moving right →, Robot B at position y moving left ←
2. They collide at some point between x and y
3. After collision: A moves left ←, B moves right →
4. This is exactly what would happen if they passed through each other and continued in their original directions!

Therefore, we can ignore collisions entirely. Each robot's final position is simply:

- If moving right: `final = initial + d`
- If moving left: `final = initial - d`

Once we have all final positions, we need to efficiently calculate the sum of distances between all pairs. The naive O(n²) approach is still too slow. We can optimize this using sorting and prefix sums:

For sorted positions `[p₁, p₂, ..., pₙ]`:

- Distance from p₁ to all others: `(p₂ - p₁) + (p₃ - p₁) + ... + (pₙ - p₁)`
- Distance from p₂ to all others to its right: `(p₃ - p₂) + ... + (pₙ - p₂)`
- And so on...

We can compute this efficiently by noticing that for position i in the sorted array:

- Contribution to total = `pᵢ × i - sum_of_left` + `sum_of_right - pᵢ × (n - i - 1)`
  Where `sum_of_left` is sum of all positions to the left, and `sum_of_right` is sum of all positions to the right.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def sumDistance(nums, s, d):
    """
    Calculate the sum of distances between all pairs of robots after d seconds.

    The key insight is that collisions don't affect final positions -
    robots effectively pass through each other. So we can compute each
    robot's final position independently, then sum all pairwise distances.
    """
    n = len(nums)
    MOD = 10**9 + 7

    # Step 1: Calculate final positions ignoring collisions
    # Robots moving right add d, robots moving left subtract d
    final_positions = []
    for i in range(n):
        if s[i] == 'R':
            final_positions.append(nums[i] + d)
        else:  # 'L'
            final_positions.append(nums[i] - d)

    # Step 2: Sort positions to enable efficient pairwise distance calculation
    # Sorting allows us to use prefix sums to avoid O(n²) pairwise comparisons
    final_positions.sort()

    # Step 3: Calculate total distance using prefix sums
    # For position i, its contribution to total distance is:
    # (position[i] * i - prefix_sum_left) + (prefix_sum_right - position[i] * (n-i-1))
    total = 0
    prefix_sum = 0  # Running sum of all positions seen so far

    for i in range(n):
        current_pos = final_positions[i]

        # Calculate contribution of current position to total distance
        # Left part: current_pos appears i times in differences to the left
        # Right part: current_pos appears (n-i-1) times in differences to the right
        # Using the formula: total += current_pos * i - prefix_sum
        total += current_pos * i - prefix_sum

        # Update prefix sum for next iteration
        prefix_sum += current_pos

        # Take modulo at each step to prevent overflow
        total %= MOD

    return total % MOD
```

```javascript
// Time: O(n log n) | Space: O(n)
function sumDistance(nums, s, d) {
  /**
   * Calculate the sum of distances between all pairs of robots after d seconds.
   *
   * The key insight is that collisions don't affect final positions -
   * robots effectively pass through each other. So we can compute each
   * robot's final position independently, then sum all pairwise distances.
   */
  const n = nums.length;
  const MOD = 1000000007;

  // Step 1: Calculate final positions ignoring collisions
  // Robots moving right add d, robots moving left subtract d
  const finalPositions = new Array(n);
  for (let i = 0; i < n; i++) {
    if (s[i] === "R") {
      finalPositions[i] = nums[i] + d;
    } else {
      // 'L'
      finalPositions[i] = nums[i] - d;
    }
  }

  // Step 2: Sort positions to enable efficient pairwise distance calculation
  // Sorting allows us to use prefix sums to avoid O(n²) pairwise comparisons
  finalPositions.sort((a, b) => a - b);

  // Step 3: Calculate total distance using prefix sums
  // For position i, its contribution to total distance is:
  // (position[i] * i - prefixSumLeft) + (prefixSumRight - position[i] * (n-i-1))
  let total = 0;
  let prefixSum = 0; // Running sum of all positions seen so far

  for (let i = 0; i < n; i++) {
    const currentPos = finalPositions[i];

    // Calculate contribution of current position to total distance
    // Left part: currentPos appears i times in differences to the left
    // Right part: currentPos appears (n-i-1) times in differences to the right
    // Using the formula: total += currentPos * i - prefixSum
    total += currentPos * i - prefixSum;

    // Update prefix sum for next iteration
    prefixSum += currentPos;

    // Take modulo at each step to prevent overflow
    total %= MOD;
  }

  // Handle negative result (JavaScript modulo can return negative)
  return (total + MOD) % MOD;
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public int sumDistance(int[] nums, String s, int d) {
        /**
         * Calculate the sum of distances between all pairs of robots after d seconds.
         *
         * The key insight is that collisions don't affect final positions -
         * robots effectively pass through each other. So we can compute each
         * robot's final position independently, then sum all pairwise distances.
         */
        int n = nums.length;
        final int MOD = 1000000007;

        // Step 1: Calculate final positions ignoring collisions
        // Robots moving right add d, robots moving left subtract d
        long[] finalPositions = new long[n];  // Use long to avoid overflow
        for (int i = 0; i < n; i++) {
            if (s.charAt(i) == 'R') {
                finalPositions[i] = (long)nums[i] + d;
            } else { // 'L'
                finalPositions[i] = (long)nums[i] - d;
            }
        }

        // Step 2: Sort positions to enable efficient pairwise distance calculation
        // Sorting allows us to use prefix sums to avoid O(n²) pairwise comparisons
        Arrays.sort(finalPositions);

        // Step 3: Calculate total distance using prefix sums
        // For position i, its contribution to total distance is:
        // (position[i] * i - prefixSumLeft) + (prefixSumRight - position[i] * (n-i-1))
        long total = 0;
        long prefixSum = 0;  // Running sum of all positions seen so far

        for (int i = 0; i < n; i++) {
            long currentPos = finalPositions[i];

            // Calculate contribution of current position to total distance
            // Left part: currentPos appears i times in differences to the left
            // Right part: currentPos appears (n-i-1) times in differences to the right
            // Using the formula: total += currentPos * i - prefixSum
            total += currentPos * i - prefixSum;

            // Update prefix sum for next iteration
            prefixSum += currentPos;

            // Take modulo at each step to prevent overflow
            total %= MOD;
        }

        return (int)((total + MOD) % MOD);  // Ensure positive result
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Calculating final positions: O(n)
- Sorting positions: O(n log n) - this dominates
- Calculating sum of distances with prefix sums: O(n)

**Space Complexity:** O(n)

- Storing final positions: O(n)
- Sorting typically requires O(n) space (for Timsort in Python, mergesort variants in Java/JavaScript)
- Prefix sum calculation uses O(1) extra space

The O(n log n) time is efficient even for n = 10⁵, which is the upper bound for this problem.

## Common Mistakes

1. **Simulating collisions directly:** Attempting to track collisions and direction changes second by second leads to O(n × d) time, which is impossible for d up to 10⁹. Always look for mathematical insights that simplify physical simulations.

2. **Forgetting to use modulo properly:** The result needs to be modulo 10⁹+7. Candidates often:
   - Forget modulo entirely
   - Apply modulo only at the end, risking overflow
   - In Java/JavaScript, not handling negative modulo results correctly

   Solution: Apply modulo at each addition step and ensure final result is positive.

3. **Using O(n²) pairwise distance calculation:** After computing final positions, some candidates sum distances with nested loops. With n up to 10⁵, this is O(10¹⁰) operations - far too slow. Always use the prefix sum technique for summing pairwise distances in sorted arrays.

4. **Integer overflow:** When d = 10⁹ and positions are up to 10⁹, final positions can be up to 2×10⁹. In Java, use `long`; in Python it's automatic; in JavaScript, numbers are 64-bit floats but can lose precision. The prefix sum calculation involves multiplication that can exceed 32-bit limits.

## When You'll See This Pattern

This problem combines two important patterns:

1. **"Passing through" collision insight:** Similar to "Last Moment Before All Ants Fall Out of a Plank" (LeetCode 1503), where ants passing through each other is equivalent to them continuing without interaction. Any problem with objects that change state on collision might have this simplification.

2. **Sum of pairwise distances in sorted array:** This pattern appears in:
   - "Minimum Moves to Equal Array Elements II" (LeetCode 462) - finding median to minimize moves
   - "Minimum Absolute Difference" (LeetCode 1200) - finding closest pairs
   - Any problem requiring sum of |aᵢ - aⱼ| for all i < j

The prefix sum technique for pairwise distances is worth memorizing: for sorted array `arr`, sum of distances = Σᵢ (arr[i] × i - prefixSum[i-1]).

## Key Takeaways

1. **Physical simulations often have mathematical simplifications:** When objects interact in symmetric ways (like robots or ants reversing on collision), look for equivalent behaviors that are easier to compute. The "passing through" insight transforms an O(n × d) problem into O(n).

2. **Sorting enables efficient pairwise computations:** Many problems involving sums of differences become tractable after sorting. The formula `Σᵢ (arr[i] × i - prefixSum[i-1])` for sum of absolute differences is a powerful tool to have in your toolkit.

3. **Modulo arithmetic requires careful handling:** When a problem asks for results modulo M, apply modulo at each arithmetic operation to prevent overflow, and ensure the final result is positive (especially in languages where % can return negative values).

Related problems: [Last Moment Before All Ants Fall Out of a Plank](/problem/last-moment-before-all-ants-fall-out-of-a-plank)
