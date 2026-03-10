---
title: "How to Solve Watering Plants II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Watering Plants II. Medium difficulty, 48.6% acceptance rate. Topics: Array, Two Pointers, Simulation."
date: "2029-05-02"
category: "dsa-patterns"
tags: ["watering-plants-ii", "array", "two-pointers", "simulation", "medium"]
---

# How to Solve Watering Plants II

Watering Plants II is a simulation problem where two people water plants from opposite ends of a row, each with their own watering can. The challenge lies in tracking when they need to refill their cans while coordinating their movements. What makes this problem interesting is that it's not just about simulating the process—it requires careful handling of the two pointers moving toward each other and deciding when they've met.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have plants `[2, 4, 5, 1, 2]` with capacityA = 5 and capacityB = 7.

**Initial state:**

- Alice at plant 0 (left end), Bob at plant 4 (right end)
- Alice's can: 5 water, Bob's can: 7 water
- Refill count: 0

**Step 1:** Alice waters plant 0 (needs 2). She has 5, uses 2 → remaining 3. Bob waters plant 4 (needs 2). He has 7, uses 2 → remaining 5. They move inward: Alice → plant 1, Bob → plant 3.

**Step 2:** Alice waters plant 1 (needs 4). She has 3, needs 4 → must refill! Refill count becomes 1. She refills to 5, uses 4 → remaining 1. Bob waters plant 3 (needs 1). He has 5, uses 1 → remaining 4. They move: Alice → plant 2, Bob → plant 2.

**Step 3:** Now Alice and Bob are at the same plant (plant 2). Only one person needs to water it. Since Alice arrived first (left pointer reached it), she waters it. Plant 2 needs 5 water. Alice has 1, needs 5 → must refill! Refill count becomes 2. She refills to 5, uses 5 → remaining 0.

**Total refills:** 2

This walkthrough shows the key points: we need two pointers, we need to track remaining water, and we need special handling when pointers meet at the same plant.

## Brute Force Approach

A naive approach might involve simulating each step individually, perhaps using a queue or repeatedly scanning the array. However, the most straightforward brute force would be to simulate time steps rather than plant visits, which would be inefficient.

Actually, for this problem, there isn't a truly "brute force" solution that's dramatically different from the optimal approach. The natural way to solve it is already quite efficient. The "naive" thinking would be to overcomplicate the simulation—perhaps trying to track both people's positions with complex conditionals or using unnecessary data structures like stacks or queues.

The key insight is that we don't need to simulate time; we can process plants in order using two pointers, which gives us O(n) time complexity right away. Any approach that doesn't use two pointers would likely be less efficient or more complex.

## Optimized Approach

The optimal solution uses a **two-pointer simulation**:

1. **Initialize pointers**: Alice starts at the left (i = 0), Bob starts at the right (j = n-1)
2. **Track remaining water**: Keep variables `remA` and `remB` for how much water each has left
3. **Simulate watering**:
   - If Alice and Bob are at different plants, water independently
   - If they're at the same plant, only one needs to water it (we can choose Alice arbitrarily)
4. **Handle refills**: When a person doesn't have enough water for their current plant:
   - Increment refill count
   - Reset their water to full capacity
5. **Water the plant**: Subtract plant's water needs from their remaining water
6. **Move pointers**: Alice moves right, Bob moves left until they meet or cross

The tricky part is handling the meeting point correctly. When `i == j`, they're at the same plant. We need to check if either has enough water to water it. If both have enough, we choose one (it doesn't matter which). If neither has enough, we need exactly one refill (not two!).

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def minimumRefill(plants, capacityA, capacityB):
    """
    Calculate minimum refills needed for Alice and Bob to water all plants.

    Args:
        plants: List of water requirements for each plant
        capacityA: Alice's watering can capacity
        capacityB: Bob's watering can capacity

    Returns:
        Minimum number of refills needed
    """
    n = len(plants)
    # Initialize pointers: Alice at left, Bob at right
    i, j = 0, n - 1
    # Track remaining water for each person
    remA, remB = capacityA, capacityB
    # Count refills
    refills = 0

    # Continue until pointers meet or cross
    while i <= j:
        # If Alice and Bob are at different plants
        if i != j:
            # Alice waters her plant
            if remA < plants[i]:
                # Not enough water, need to refill
                refills += 1
                remA = capacityA
            # Water the plant
            remA -= plants[i]
            i += 1

            # Bob waters his plant
            if remB < plants[j]:
                # Not enough water, need to refill
                refills += 1
                remB = capacityB
            # Water the plant
            remB -= plants[j]
            j -= 1
        else:
            # They're at the same plant
            # Check if Alice has enough water
            if remA >= plants[i]:
                remA -= plants[i]
            # Check if Bob has enough water
            elif remB >= plants[i]:
                remB -= plants[i]
            else:
                # Neither has enough, need one refill
                # We choose to refill Alice (could choose Bob)
                refills += 1
                # After refill, water the plant
                # Note: We don't need to track remaining after this
                # since it's the last plant
            # Done with last plant
            break

    return refills
```

```javascript
// Time: O(n) | Space: O(1)
function minimumRefill(plants, capacityA, capacityB) {
  /**
   * Calculate minimum refills needed for Alice and Bob to water all plants.
   *
   * @param {number[]} plants - Water requirements for each plant
   * @param {number} capacityA - Alice's watering can capacity
   * @param {number} capacityB - Bob's watering can capacity
   * @return {number} Minimum number of refills needed
   */
  const n = plants.length;
  // Initialize pointers: Alice at left, Bob at right
  let i = 0,
    j = n - 1;
  // Track remaining water for each person
  let remA = capacityA,
    remB = capacityB;
  // Count refills
  let refills = 0;

  // Continue until pointers meet or cross
  while (i <= j) {
    // If Alice and Bob are at different plants
    if (i !== j) {
      // Alice waters her plant
      if (remA < plants[i]) {
        // Not enough water, need to refill
        refills++;
        remA = capacityA;
      }
      // Water the plant
      remA -= plants[i];
      i++;

      // Bob waters his plant
      if (remB < plants[j]) {
        // Not enough water, need to refill
        refills++;
        remB = capacityB;
      }
      // Water the plant
      remB -= plants[j];
      j--;
    } else {
      // They're at the same plant
      // Check if Alice has enough water
      if (remA >= plants[i]) {
        remA -= plants[i];
      }
      // Check if Bob has enough water
      else if (remB >= plants[i]) {
        remB -= plants[i];
      } else {
        // Neither has enough, need one refill
        // We choose to refill Alice (could choose Bob)
        refills++;
        // After refill, water the plant
        // Note: We don't need to track remaining after this
        // since it's the last plant
      }
      // Done with last plant
      break;
    }
  }

  return refills;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int minimumRefill(int[] plants, int capacityA, int capacityB) {
        /**
         * Calculate minimum refills needed for Alice and Bob to water all plants.
         *
         * @param plants Water requirements for each plant
         * @param capacityA Alice's watering can capacity
         * @param capacityB Bob's watering can capacity
         * @return Minimum number of refills needed
         */
        int n = plants.length;
        // Initialize pointers: Alice at left, Bob at right
        int i = 0, j = n - 1;
        // Track remaining water for each person
        int remA = capacityA, remB = capacityB;
        // Count refills
        int refills = 0;

        // Continue until pointers meet or cross
        while (i <= j) {
            // If Alice and Bob are at different plants
            if (i != j) {
                // Alice waters her plant
                if (remA < plants[i]) {
                    // Not enough water, need to refill
                    refills++;
                    remA = capacityA;
                }
                // Water the plant
                remA -= plants[i];
                i++;

                // Bob waters his plant
                if (remB < plants[j]) {
                    // Not enough water, need to refill
                    refills++;
                    remB = capacityB;
                }
                // Water the plant
                remB -= plants[j];
                j--;
            } else {
                // They're at the same plant
                // Check if Alice has enough water
                if (remA >= plants[i]) {
                    remA -= plants[i];
                }
                // Check if Bob has enough water
                else if (remB >= plants[i]) {
                    remB -= plants[i];
                } else {
                    // Neither has enough, need one refill
                    // We choose to refill Alice (could choose Bob)
                    refills++;
                    // After refill, water the plant
                    // Note: We don't need to track remaining after this
                    // since it's the last plant
                }
                // Done with last plant
                break;
            }
        }

        return refills;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each plant exactly once
- The two pointers move toward each other, so we make at most n iterations
- Each iteration does constant work (comparisons, arithmetic)

**Space Complexity: O(1)**

- We only use a fixed number of variables (pointers, remaining water counters, refill count)
- No additional data structures that grow with input size

The efficiency comes from the two-pointer approach: instead of simulating each person's movement separately (which could be O(n²) if done naively), we process both simultaneously.

## Common Mistakes

1. **Double-counting refills when pointers meet**: When Alice and Bob are at the same plant, some candidates check both separately and might count 2 refills if neither has enough water. But only one person needs to water the plant, so we need at most 1 refill.

2. **Incorrect pointer movement order**: Watering then moving is correct. If you move pointers before watering, you'll water the wrong plants. The order matters: check water, refill if needed, water, then move.

3. **Forgetting to handle the meeting case separately**: When `i == j`, we can't have both people water the same plant independently. We need special logic to ensure only one person waters it.

4. **Off-by-one errors in the loop condition**: Using `while i < j` instead of `while i <= j` will miss the middle plant when n is odd. The `<=` ensures we process the middle plant when pointers meet.

## When You'll See This Pattern

The two-pointer approach from both ends is common in many problems:

1. **Valid Palindrome (Easy)**: Check if a string reads the same forward and backward by using pointers from both ends.
2. **Container With Most Water (Medium)**: Find two lines that form the largest container by moving pointers based on height comparisons.
3. **Two Sum II (Medium)**: Find two numbers that sum to target in a sorted array by using pointers from both ends.
4. **Trapping Rain Water (Hard)**: Calculate trapped water using two pointers to track left and right maxima.

These problems all involve processing an array from both ends simultaneously, often making decisions based on comparisons between the two ends.

## Key Takeaways

1. **Two pointers from opposite ends** is a powerful pattern for problems where you need to process elements relative to both ends of an array. Look for keywords like "from both ends," "meet in the middle," or symmetric operations.

2. **Simulation problems often have optimal greedy solutions**. Here, watering plants in order from both ends is optimal—there's no benefit to skipping plants or changing the order.

3. **Special case handling for meeting points** is crucial in two-pointer problems. Always consider what happens when pointers meet or cross, as this often requires different logic.

Related problems: [Watering Plants](/problem/watering-plants)
