---
title: "How to Solve Divide Players Into Teams of Equal Skill — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Divide Players Into Teams of Equal Skill. Medium difficulty, 68.9% acceptance rate. Topics: Array, Hash Table, Two Pointers, Sorting."
date: "2028-10-06"
category: "dsa-patterns"
tags: ["divide-players-into-teams-of-equal-skill", "array", "hash-table", "two-pointers", "medium"]
---

# How to Solve Divide Players Into Teams of Equal Skill

You're given an array of player skills with an even length, and you need to pair them into teams of two where every team has the same total skill. The challenge is finding the correct pairing strategy that ensures all team sums are equal while calculating the total chemistry (product of skills in each team). What makes this interesting is that you can't just pair any two players—the pairing must satisfy a global constraint where all team sums are identical.

## Visual Walkthrough

Let's walk through an example: `skill = [3, 4, 2, 5, 1, 6]`

**Step 1: Understanding the constraint**
If we have `n` players forming `n/2` teams, and each team must have the same total skill, then:

- Let the target team sum be `T`
- Each of the `n/2` teams sums to `T`
- So total sum of all skills = `(n/2) * T`
- Therefore `T = (total_sum * 2) / n`

For our example: `total_sum = 3+4+2+5+1+6 = 21`, `n = 6`
`T = (21 * 2) / 6 = 42 / 6 = 7`

So every team must sum to 7.

**Step 2: Finding valid pairs**
We need to find pairs that sum to 7:

- 3 + 4 = 7 ✓
- 2 + 5 = 7 ✓
- 1 + 6 = 7 ✓

**Step 3: Calculating chemistry**
Chemistry = product of skills in each team:

- Team 1: 3 × 4 = 12
- Team 2: 2 × 5 = 10
- Team 3: 1 × 6 = 6
  Total chemistry = 12 + 10 + 6 = 28

**Step 4: Why ordering matters**
If we had tried to pair 3 with 2 (sum 5), we couldn't make all teams equal to 7. The key insight: we need to pair the smallest with the largest, second smallest with second largest, etc., when the array is sorted. Let's verify:

Sorted array: `[1, 2, 3, 4, 5, 6]`

- 1 + 6 = 7 ✓
- 2 + 5 = 7 ✓
- 3 + 4 = 7 ✓

This gives us the same valid pairing we found manually.

## Brute Force Approach

A naive approach would try all possible pairings:

1. Generate all permutations of the array
2. Group each permutation into consecutive pairs
3. Check if all pairs have the same sum
4. If yes, calculate the total chemistry
5. Return the maximum (or in this case, the only valid) chemistry

The problem with this approach is the time complexity: generating all permutations of an array of length `n` is `O(n!)`, which is astronomically large even for moderate `n`. For `n = 10`, that's 3.6 million permutations; for `n = 20`, it's 2.4 × 10¹⁸ permutations.

Even if we try to be smarter by only considering combinations (not permutations), we'd still need to check `C(n, 2) × C(n-2, 2) × ...` ways to form teams, which grows factorially.

## Optimized Approach

The key insight comes from understanding the mathematical constraint:

1. **Target sum calculation**: As shown in the visual walkthrough, if all teams must have equal sum `T`, then `T = (total_sum * 2) / n`. Since `n` is even and we're guaranteed a solution exists (the problem statement implies this), `total_sum * 2` must be divisible by `n`.

2. **Pairing strategy**: Once we know `T`, we need to find pairs that sum to `T`. The most efficient way is to sort the array and use two pointers:
   - Sort the array in ascending order
   - Use `left` pointer at the start and `right` pointer at the end
   - Check if `skill[left] + skill[right] == T`
   - If yes, add their product to the total chemistry and move both pointers inward
   - If no, return -1 (though the problem guarantees a solution exists)

3. **Why sorting works**: When the array is sorted, the smallest element must pair with the largest element that brings the sum to `T`. If `skill[left] + skill[right] > T`, we need a smaller sum, so move `right` leftward. If the sum is less than `T`, we need a larger sum, so move `left` rightward. But wait—since we calculated `T` from the total sum, and we're pairing extremes, we should always get exactly `T` if a solution exists.

Actually, there's an even simpler realization: After sorting, `skill[i] + skill[n-1-i]` should equal `T` for all `i`. Let's prove this:

- The smallest element must pair with some element to make sum `T`
- The only element large enough to pair with the smallest (making sum `T`) is the largest, because if we paired the smallest with anything smaller than the largest, the sum would be too small
- By induction, this applies to all pairs: `skill[i] + skill[n-1-i] = T`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
def dividePlayers(self, skill):
    """
    Divide players into teams with equal total skill per team.

    Approach:
    1. Calculate total skill and target team sum
    2. Sort players by skill
    3. Pair smallest with largest, second smallest with second largest, etc.
    4. Verify each pair sums to target, calculate total chemistry

    Args:
        skill: List[int] - Array of player skills

    Returns:
        int - Total chemistry (sum of products) or -1 if impossible
    """
    n = len(skill)
    total_sum = sum(skill)

    # Step 1: Calculate target team sum
    # Each team must sum to: (total_sum * 2) / n
    # If this is not an integer, no valid pairing exists
    if (total_sum * 2) % n != 0:
        return -1

    target = (total_sum * 2) // n

    # Step 2: Sort to enable efficient pairing
    skill.sort()

    total_chemistry = 0
    left, right = 0, n - 1

    # Step 3: Pair players from both ends
    while left < right:
        current_sum = skill[left] + skill[right]

        # Step 4: Verify pair sums to target
        if current_sum != target:
            return -1

        # Step 5: Add chemistry (product) to total
        total_chemistry += skill[left] * skill[right]

        # Move pointers inward to process next pair
        left += 1
        right -= 1

    return total_chemistry
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
/**
 * Divide players into teams with equal total skill per team.
 *
 * Approach:
 * 1. Calculate total skill and target team sum
 * 2. Sort players by skill
 * 3. Pair smallest with largest, second smallest with second largest, etc.
 * 4. Verify each pair sums to target, calculate total chemistry
 *
 * @param {number[]} skill - Array of player skills
 * @return {number} - Total chemistry (sum of products) or -1 if impossible
 */
function dividePlayers(skill) {
  const n = skill.length;

  // Step 1: Calculate total sum
  const totalSum = skill.reduce((sum, val) => sum + val, 0);

  // Step 2: Calculate target team sum
  // Each team must sum to: (totalSum * 2) / n
  // If this is not an integer, no valid pairing exists
  if ((totalSum * 2) % n !== 0) {
    return -1;
  }

  const target = (totalSum * 2) / n;

  // Step 3: Sort to enable efficient pairing
  skill.sort((a, b) => a - b);

  let totalChemistry = 0;
  let left = 0,
    right = n - 1;

  // Step 4: Pair players from both ends
  while (left < right) {
    const currentSum = skill[left] + skill[right];

    // Step 5: Verify pair sums to target
    if (currentSum !== target) {
      return -1;
    }

    // Step 6: Add chemistry (product) to total
    totalChemistry += skill[left] * skill[right];

    // Move pointers inward to process next pair
    left++;
    right--;
  }

  return totalChemistry;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sorting implementation
class Solution {
    /**
     * Divide players into teams with equal total skill per team.
     *
     * Approach:
     * 1. Calculate total skill and target team sum
     * 2. Sort players by skill
     * 3. Pair smallest with largest, second smallest with second largest, etc.
     * 4. Verify each pair sums to target, calculate total chemistry
     *
     * @param skill - Array of player skills
     * @return Total chemistry (sum of products) or -1 if impossible
     */
    public long dividePlayers(int[] skill) {
        int n = skill.length;

        // Step 1: Calculate total sum
        long totalSum = 0;
        for (int s : skill) {
            totalSum += s;
        }

        // Step 2: Calculate target team sum
        // Each team must sum to: (totalSum * 2) / n
        // If this is not an integer, no valid pairing exists
        if ((totalSum * 2) % n != 0) {
            return -1;
        }

        long target = (totalSum * 2) / n;

        // Step 3: Sort to enable efficient pairing
        Arrays.sort(skill);

        long totalChemistry = 0;
        int left = 0, right = n - 1;

        // Step 4: Pair players from both ends
        while (left < right) {
            long currentSum = (long) skill[left] + skill[right];

            // Step 5: Verify pair sums to target
            if (currentSum != target) {
                return -1;
            }

            // Step 6: Add chemistry (product) to total
            // Use long to avoid integer overflow
            totalChemistry += (long) skill[left] * skill[right];

            // Move pointers inward to process next pair
            left++;
            right--;
        }

        return totalChemistry;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Calculating the sum: O(n)
- Sorting the array: O(n log n) — this dominates
- Two-pointer pairing: O(n)
- Total: O(n log n)

**Space Complexity: O(1) or O(n)**

- If sorting is done in-place (like Python's Timsort or Java's Arrays.sort), space is O(1) or O(log n) for the sorting algorithm's internal stack
- If we count the input array itself, it's O(n)
- The two-pointer approach uses only constant extra space

## Common Mistakes

1. **Not checking if target sum is an integer**: Even though the problem guarantees a solution exists, in real interviews or variations, you should check if `(total_sum * 2) % n == 0`. If not, return -1 immediately.

2. **Integer overflow**: When `n` is large and skills are large, `total_sum * 2` might overflow 32-bit integers. Always use 64-bit integers (long in Java/C++, long long in C). In the product calculation `skill[left] * skill[right]`, this can also overflow.

3. **Assuming any pairing works**: Some candidates try to use a hash map to find pairs that sum to target, but this doesn't guarantee all teams will have the same sum. For example, with `[1, 2, 3, 4, 5, 7]` and target 8, you could pair (1,7) and (3,5) but then 2+4=6 ≠ 8. The sorted two-pointer approach ensures consistency.

4. **Forgetting to sort**: Attempting to pair without sorting leads to incorrect pairings. You might pair (1,4) and (2,3) when you should pair (1,4) and (2,3) is fine if they sum to target, but without sorting you can't systematically verify all pairs match the target.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Two-pointer technique with sorting**: Used in problems like "Two Sum" (when sorted), "3Sum", "Container With Most Water". The pattern: sort first, then use pointers from both ends to find pairs satisfying a condition.

2. **Pair matching with constraints**: Similar to "Max Number of K-Sum Pairs" where you find pairs that sum to k. The difference here is that ALL elements must be paired, and ALL pairs must have the SAME sum.

3. **Mathematical constraint derivation**: Like "Minimum Moves to Equal Array Elements" where you derive that incrementing n-1 elements by 1 is equivalent to decrementing 1 element by 1. Here, deriving `T = (total_sum * 2) / n` is crucial.

Related problems:

- **Two Sum II - Input Array Is Sorted**: Same two-pointer technique after sorting
- **3Sum**: Extends two-pointer technique to triplets
- **Max Number of K-Sum Pairs**: Almost identical pairing logic

## Key Takeaways

1. **Derive constraints mathematically**: When a problem has a global constraint (all teams equal), express it mathematically. Here, `total_sum = (n/2) * T` led to `T = (total_sum * 2) / n`.

2. **Sorting enables systematic pairing**: When you need to pair elements with a sum constraint, sorting + two pointers is often optimal. The smallest pairs with the largest possible element that satisfies the constraint.

3. **Check edge cases early**: Verify the target is an integer, watch for integer overflow, and ensure your solution handles the guaranteed-solution case as well as invalid inputs.

Related problems: [Minimum Moves to Equal Array Elements](/problem/minimum-moves-to-equal-array-elements), [Max Number of K-Sum Pairs](/problem/max-number-of-k-sum-pairs)
