---
title: "How to Solve Boats to Save People — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Boats to Save People. Medium difficulty, 61.4% acceptance rate. Topics: Array, Two Pointers, Greedy, Sorting."
date: "2027-04-08"
category: "dsa-patterns"
tags: ["boats-to-save-people", "array", "two-pointers", "greedy", "medium"]
---

# How to Solve Boats to Save People

You're given an array of people's weights and a boat weight limit. Each boat can carry at most two people, and you need to find the minimum number of boats needed to carry everyone. The tricky part is that you need to pair people optimally to minimize boats while respecting the weight limit constraint.

## Visual Walkthrough

Let's walk through an example: `people = [3, 2, 2, 1]` with `limit = 3`.

**Step 1: Sort the array**  
Sorted: `[1, 2, 2, 3]`

**Step 2: Initialize two pointers**  
Left pointer (lightest person) at index 0: weight 1  
Right pointer (heaviest person) at index 3: weight 3

**Step 3: Process pairs**

1. Check if lightest (1) + heaviest (3) ≤ limit (3)? 1 + 3 = 4 > 3 → NO
   - Heaviest person (3) needs their own boat → boats = 1
   - Move right pointer left: right = 2

2. Check if lightest (1) + current heaviest (2) ≤ limit (3)? 1 + 2 = 3 ≤ 3 → YES
   - They can share a boat → boats = 2
   - Move both pointers: left = 1, right = 1

3. Left (1) and right (1) point to same person (weight 2)
   - This person needs their own boat → boats = 3

**Result:** 3 boats needed: [3], [1,2], [2]

## Brute Force Approach

A naive approach would try all possible pairings of people. For each person, you could try pairing them with every other person, then recursively solve the remaining problem. This would involve:

1. For each person, try pairing with every other person where weight sum ≤ limit
2. Recursively solve for remaining people
3. Track the minimum number of boats

The problem with this approach is it has factorial time complexity (O(n!)) because you're exploring all possible pairings. Even for moderate n (like 50 people), this becomes computationally impossible.

Another brute force idea might be: always pair the heaviest person with the lightest available person. But without sorting first, you'd need to scan the entire array for each person to find the best match, resulting in O(n²) time complexity.

## Optimized Approach

The key insight is that we should **pair the heaviest person with the lightest possible person** who can share a boat with them. Here's why this greedy approach works:

1. **Sorting enables efficient pairing**: When sorted, the heaviest person is at the end, and the lightest at the beginning.
2. **If the heaviest person can't share with the lightest person**, then they can't share with anyone (because everyone else is heavier than or equal to the lightest person). So they must go alone.
3. **If the heaviest person can share with the lightest person**, this is optimal because:
   - The heaviest person is the hardest to pair
   - Using the lightest person leaves heavier options available for other pairings
   - This minimizes "wasted" capacity

This leads to a two-pointer approach:

- Sort the array
- Initialize left pointer at lightest person, right pointer at heaviest person
- While left ≤ right:
  - If people[left] + people[right] ≤ limit: they can share a boat
  - Otherwise: heaviest person goes alone
  - Count boats as we go

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) due to sorting | Space: O(1) or O(n) depending on sorting implementation
def numRescueBoats(people, limit):
    """
    Calculate minimum number of boats needed to rescue all people.

    Args:
        people: List of integers representing weights
        limit: Maximum weight a boat can carry

    Returns:
        Minimum number of boats needed
    """
    # Step 1: Sort the people by weight
    # This allows us to efficiently pair lightest with heaviest
    people.sort()

    # Step 2: Initialize pointers and boat counter
    left = 0  # Pointer to lightest available person
    right = len(people) - 1  # Pointer to heaviest available person
    boats = 0  # Count of boats needed

    # Step 3: Process people from both ends
    while left <= right:
        # If lightest and heaviest can share a boat
        if people[left] + people[right] <= limit:
            left += 1  # Lightest person is paired
            right -= 1  # Heaviest person is paired
        else:
            # Heaviest person must go alone (can't pair with anyone)
            right -= 1

        # Each iteration uses one boat (either shared or single)
        boats += 1

    return boats
```

```javascript
// Time: O(n log n) due to sorting | Space: O(1) or O(n) depending on sorting implementation
function numRescueBoats(people, limit) {
  /**
   * Calculate minimum number of boats needed to rescue all people.
   *
   * @param {number[]} people - Array of weights
   * @param {number} limit - Maximum weight per boat
   * @return {number} Minimum number of boats needed
   */

  // Step 1: Sort the people by weight
  // This enables efficient pairing of lightest with heaviest
  people.sort((a, b) => a - b);

  // Step 2: Initialize pointers and boat counter
  let left = 0; // Pointer to lightest available person
  let right = people.length - 1; // Pointer to heaviest available person
  let boats = 0; // Count of boats needed

  // Step 3: Process people from both ends
  while (left <= right) {
    // Check if lightest and heaviest can share a boat
    if (people[left] + people[right] <= limit) {
      left++; // Lightest person is paired
      right--; // Heaviest person is paired
    } else {
      // Heaviest person must go alone
      right--;
    }

    // Each iteration uses one boat
    boats++;
  }

  return boats;
}
```

```java
// Time: O(n log n) due to sorting | Space: O(1) or O(n) depending on sorting implementation
import java.util.Arrays;

class Solution {
    public int numRescueBoats(int[] people, int limit) {
        /**
         * Calculate minimum number of boats needed to rescue all people.
         *
         * @param people Array of weights
         * @param limit Maximum weight per boat
         * @return Minimum number of boats needed
         */

        // Step 1: Sort the people by weight
        // This allows efficient pairing strategy
        Arrays.sort(people);

        // Step 2: Initialize pointers and boat counter
        int left = 0;  // Pointer to lightest available person
        int right = people.length - 1;  // Pointer to heaviest available person
        int boats = 0;  // Count of boats needed

        // Step 3: Process people from both ends
        while (left <= right) {
            // Check if lightest and heaviest can share a boat
            if (people[left] + people[right] <= limit) {
                left++;  // Lightest person is paired
                right--;  // Heaviest person is paired
            } else {
                // Heaviest person must go alone
                right--;
            }

            // Each iteration uses one boat
            boats++;
        }

        return boats;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- The two-pointer traversal takes O(n) time
- Dominated by sorting, so overall O(n log n)

**Space Complexity: O(1) or O(n)**

- If sorting is done in-place (like Python's Timsort or Java's Arrays.sort), space is O(1) or O(log n) for recursion stack
- If sorting requires additional space (like merge sort), it could be O(n)
- The two-pointer algorithm itself uses O(1) extra space

## Common Mistakes

1. **Forgetting to sort the array**: Without sorting, you can't efficiently pair lightest with heaviest. You'd need nested loops (O(n²)) to find optimal pairs.

2. **Incorrect pointer movement when a pair is found**: When `people[left] + people[right] <= limit`, you must move BOTH pointers (left++ AND right--). Some candidates only move one pointer, counting the same person multiple times.

3. **Wrong loop condition**: The loop should continue while `left <= right`, not `left < right`. When left == right, there's one person left who needs their own boat.

4. **Not considering that a person's weight might exceed the limit**: The problem guarantees `people[i] <= limit`, but in interviews, it's good to mention this assumption. If weights could exceed limit, you'd need to handle that case separately (such person couldn't be rescued at all).

## When You'll See This Pattern

This "two-pointer greedy pairing" pattern appears in several problems:

1. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: Similar two-pointer approach to find pairs that sum to a target.

2. **3Sum (LeetCode 15)**: Uses sorting and multiple pointers to find triplets summing to zero.

3. **Container With Most Water (LeetCode 11)**: Uses two pointers moving inward from both ends to maximize area.

4. **Assign Cookies (LeetCode 455)**: Another greedy problem where you match smallest cookies to smallest greed factors.

The pattern is: when you need to pair elements optimally, sorting + two pointers often provides an efficient O(n log n) solution.

## Key Takeaways

1. **Sorting enables greedy pairing**: When you need to pair elements optimally, sorting first often reveals a simple greedy strategy.

2. **Pair extremes first**: When pairing under constraints (like weight limits), pairing the heaviest with the lightest available is often optimal.

3. **Two-pointer technique is powerful**: Moving pointers from both ends toward the middle gives O(n) traversal after sorting, much better than nested loops.

[Practice this problem on CodeJeet](/problem/boats-to-save-people)
