---
title: "How to Solve Distribute Candies to People — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Distribute Candies to People. Easy difficulty, 67.4% acceptance rate. Topics: Math, Simulation."
date: "2027-04-24"
category: "dsa-patterns"
tags: ["distribute-candies-to-people", "math", "simulation", "easy"]
---

# How to Solve Distribute Candies to People

This problem asks us to distribute candies to people in a circular pattern: we give 1 candy to the first person, 2 to the second, and so on until we give `n` candies to the last person, then continue with `n+1` candies to the first person again, and so forth until we run out of candies. The tricky part is handling the final distribution where we might not have enough candies to give the full amount to the current person.

## Visual Walkthrough

Let's trace through an example with `candies = 10` and `num_people = 3`:

**Initial state:** `result = [0, 0, 0]`, `candies_left = 10`, `current_give = 1`

**Round 1:**

- Person 0: Give min(1, 10) = 1 candy → `result = [1, 0, 0]`, `candies_left = 9`, `current_give = 2`
- Person 1: Give min(2, 9) = 2 candies → `result = [1, 2, 0]`, `candies_left = 7`, `current_give = 3`
- Person 2: Give min(3, 7) = 3 candies → `result = [1, 2, 3]`, `candies_left = 4`, `current_give = 4`

**Round 2:**

- Person 0: Give min(4, 4) = 4 candies → `result = [5, 2, 3]`, `candies_left = 0`, `current_give = 5`

Since we have no candies left, we stop. Final distribution: `[5, 2, 3]`.

The pattern shows we need to:

1. Track how many candies we have left
2. Track how many candies to give to the current person
3. Give either the full amount or whatever candies remain, whichever is smaller
4. Move to the next person, wrapping around when we reach the end

## Brute Force Approach

The most straightforward approach is to simulate the distribution exactly as described. We'll keep giving candies to people in order, increasing the amount to give each time, until we run out of candies.

While this approach is actually optimal for this problem (O(√candies) time complexity), some candidates might try to pre-calculate everything mathematically without simulation, which can lead to complex formulas and off-by-one errors. The simulation approach is clean, intuitive, and efficient enough given the constraints.

## Optimal Solution

The optimal solution uses simulation with careful handling of the final distribution. We maintain:

- An array to track how many candies each person has received
- A counter for how many candies we should give to the current person
- The remaining number of candies

We iterate through people in a circular fashion, giving either the planned amount or whatever candies remain (whichever is smaller), until we run out of candies.

<div class="code-group">

```python
# Time: O(√candies) - We give 1 + 2 + 3 + ... + k candies where k(k+1)/2 ≤ candies
# Space: O(n) - We store the result array of size n
def distributeCandies(candies, num_people):
    """
    Distributes candies to people in a circular pattern.

    Args:
        candies: Total number of candies to distribute
        num_people: Number of people to distribute to

    Returns:
        List of integers representing candies each person received
    """
    # Initialize result array with zeros for each person
    result = [0] * num_people

    # Start giving 1 candy to the first person
    current_give = 1

    # Continue distributing until we run out of candies
    while candies > 0:
        # Loop through each person
        for i in range(num_people):
            # If we have enough candies for the full amount
            if candies >= current_give:
                # Give the full amount to current person
                result[i] += current_give
                # Reduce remaining candies
                candies -= current_give
                # Increase amount for next person
                current_give += 1
            else:
                # Give all remaining candies to current person
                result[i] += candies
                # No candies left, return immediately
                return result

    return result
```

```javascript
// Time: O(√candies) - We give 1 + 2 + 3 + ... + k candies where k(k+1)/2 ≤ candies
// Space: O(n) - We store the result array of size n
function distributeCandies(candies, num_people) {
  /**
   * Distributes candies to people in a circular pattern.
   *
   * @param {number} candies - Total number of candies to distribute
   * @param {number} num_people - Number of people to distribute to
   * @return {number[]} Array representing candies each person received
   */

  // Initialize result array with zeros for each person
  const result = new Array(num_people).fill(0);

  // Start giving 1 candy to the first person
  let currentGive = 1;

  // Continue distributing until we run out of candies
  while (candies > 0) {
    // Loop through each person
    for (let i = 0; i < num_people; i++) {
      // If we have enough candies for the full amount
      if (candies >= currentGive) {
        // Give the full amount to current person
        result[i] += currentGive;
        // Reduce remaining candies
        candies -= currentGive;
        // Increase amount for next person
        currentGive++;
      } else {
        // Give all remaining candies to current person
        result[i] += candies;
        // No candies left, return immediately
        return result;
      }
    }
  }

  return result;
}
```

```java
// Time: O(√candies) - We give 1 + 2 + 3 + ... + k candies where k(k+1)/2 ≤ candies
// Space: O(n) - We store the result array of size n
class Solution {
    public int[] distributeCandies(int candies, int num_people) {
        /**
         * Distributes candies to people in a circular pattern.
         *
         * @param candies Total number of candies to distribute
         * @param num_people Number of people to distribute to
         * @return Array representing candies each person received
         */

        // Initialize result array with zeros for each person
        int[] result = new int[num_people];

        // Start giving 1 candy to the first person
        int currentGive = 1;

        // Continue distributing until we run out of candies
        while (candies > 0) {
            // Loop through each person
            for (int i = 0; i < num_people; i++) {
                // If we have enough candies for the full amount
                if (candies >= currentGive) {
                    // Give the full amount to current person
                    result[i] += currentGive;
                    // Reduce remaining candies
                    candies -= currentGive;
                    // Increase amount for next person
                    currentGive++;
                } else {
                    // Give all remaining candies to current person
                    result[i] += candies;
                    // No candies left, return immediately
                    return result;
                }
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(√candies)**

- We distribute candies in increasing amounts: 1, 2, 3, ..., k
- The total distributed is k(k+1)/2 ≤ candies
- Solving k²/2 ≈ candies gives us k ≈ √(2candies) = O(√candies)
- In the worst case, we might loop through all people for each distribution, but since k ≈ √candies, the total operations are O(√candies)

**Space Complexity: O(n)**

- We only store the result array of size `num_people`
- No additional data structures are needed
- The space used is linear in the number of people

## Common Mistakes

1. **Forgetting to handle the final partial distribution**: Some candidates give the full planned amount even when there aren't enough candies left. Always use `min(current_give, candies_left)` or check if `candies >= current_give` before giving.

2. **Infinite loop when candies run out**: Without the early return when candies become 0, the loop might continue indefinitely or until `current_give` overflows. The solution should return immediately after giving the last candies.

3. **Off-by-one errors in indexing**: When wrapping around to the beginning, make sure to use modulo or reset the index to 0. In our solution, the for loop handles this automatically by restarting from 0 each full cycle.

4. **Not initializing the result array properly**: Forgetting to initialize all elements to 0 can lead to incorrect results, especially in languages that don't automatically initialize arrays.

## When You'll See This Pattern

This problem combines **simulation** with **circular iteration**, which appears in many coding problems:

1. **Josephus Problem**: A classic elimination game where people are arranged in a circle and every k-th person is eliminated until one remains.

2. **Find the Winner of the Circular Game**: LeetCode problem 1823, which is essentially the Josephus problem.

3. **Design Circular Queue**: LeetCode problem 622, where you need to implement a queue with a fixed size that wraps around.

4. **Baseball Game**: LeetCode problem 682, where you process operations in sequence with special rules for certain operations.

The key pattern is processing elements in a circular manner, often with a counter that increments or follows specific rules at each step.

## Key Takeaways

1. **Simulation is often the cleanest solution**: When a problem describes a step-by-step process, implementing it directly with simulation is usually clearer and less error-prone than trying to derive complex mathematical formulas.

2. **Handle edge cases at distribution boundaries**: The most common pitfall is at the transition points—when wrapping around to the beginning or when resources run out. Always test these boundary conditions.

3. **Use early returns for efficiency**: When you know the process is complete (like when candies run out), return immediately rather than continuing unnecessary iterations.

Related problems: [Distribute Money to Maximum Children](/problem/distribute-money-to-maximum-children)
