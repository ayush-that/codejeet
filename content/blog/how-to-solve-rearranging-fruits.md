---
title: "How to Solve Rearranging Fruits — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Rearranging Fruits. Hard difficulty, 57.5% acceptance rate. Topics: Array, Hash Table, Greedy, Sort."
date: "2027-07-05"
category: "dsa-patterns"
tags: ["rearranging-fruits", "array", "hash-table", "greedy", "hard"]
---

# How to Solve Rearranging Fruits

You have two baskets of fruits with different costs, and you can swap fruits between them to make both baskets equal. The challenge is finding the minimum total cost to achieve this through swaps, where each swap's cost is the minimum of the two fruits being exchanged. This problem is tricky because you need to identify which fruits must move between baskets, determine the most cost-effective way to swap them, and handle cases where direct swaps might not be optimal.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose:

- `basket1 = [4, 2, 2, 2]`
- `basket2 = [1, 4, 1, 1]`

**Step 1: Understand what "equal baskets" means**
Both baskets must contain exactly the same multiset of fruits. That means for each fruit cost, the total count across both baskets must be even (so it can be split equally), and each basket must end up with half of each fruit type.

**Step 2: Count frequencies**
Let's count how many of each fruit we have in total:

- Cost 1: 3 fruits (all in basket2)
- Cost 2: 3 fruits (all in basket1)
- Cost 4: 2 fruits (1 in basket1, 1 in basket2)

Total fruits per basket: n = 4

**Step 3: Check if solution is possible**
For each fruit cost, the total count must be even so we can split it equally. Here:

- Cost 1: 3 (odd) ❌
- Cost 2: 3 (odd) ❌
- Cost 4: 2 (even) ✅

Since we have odd counts, it's impossible to split fruits equally. The problem guarantees valid inputs, so let's use a valid example:

`basket1 = [4, 2, 2, 2]` → `basket1 = [4, 2, 2, 2]`
`basket2 = [1, 4, 1, 3]` → `basket2 = [1, 4, 1, 3]`

Now counts:

- Cost 1: 2 fruits (both in basket2)
- Cost 2: 3 fruits (all in basket1)
- Cost 3: 1 fruit (in basket2)
- Cost 4: 2 fruits (1 in each basket)

Still invalid (costs 2 and 3 have odd counts). Let's use:
`basket1 = [4, 2, 2, 2]` → `[4, 2, 2, 2]`
`basket2 = [1, 4, 1, 2]` → `[1, 4, 1, 2]`

Counts:

- Cost 1: 2 (basket2)
- Cost 2: 4 (3 in basket1, 1 in basket2)
- Cost 4: 2 (1 in each)

All even! Each basket needs:

- Cost 1: 1 fruit
- Cost 2: 2 fruits
- Cost 4: 1 fruit

**Step 4: Determine what needs to move**
Current basket1 has: 2 (×3), 4 (×1) → needs 1, 2, 2, 4
Current basket2 has: 1 (×2), 2 (×1), 4 (×1) → needs 1, 2, 4, 4

Basket1 has extra: 2, 2 (needs to give away two 2's)
Basket1 needs: 1, 4 (needs to receive one 1 and one 4)

Basket2 has extra: 1, 4 (needs to give away one 1 and one 4)
Basket2 needs: 2, 2 (needs to receive two 2's)

**Step 5: Find optimal swaps**
We need to exchange: basket1 gives [2, 2], basket2 gives [1, 4]
Cost of swapping 2 with 1: min(2, 1) = 1
Cost of swapping 2 with 4: min(2, 4) = 2
Total cost = 1 + 2 = 3

But wait! There's a better way: use the overall minimum fruit as an intermediary.
Overall minimum fruit cost = 1

Alternative: Swap 2 with 1 (cost 1), then swap 2 with 1 (cost 1) = total 2
But we need to end up with the right distribution...

Actually, the optimal approach: Sort what needs to be exchanged:
From basket1 to basket2: [2, 2] (sorted)
From basket2 to basket1: [1, 4] (sorted)

Pair smallest with smallest: 2↔1 (cost 1), 2↔4 (cost 2) = 3

But consider using minimum fruit (cost 1) as intermediary:
Swap 2 with 1 (cost 1), now basket1 has 1 (extra), basket2 has 2 (needs it)
Then swap 1 with 4 (cost 1), total = 2

This is better! The key insight: sometimes it's cheaper to swap both items through the minimum fruit rather than directly.

## Brute Force Approach

A naive approach would try all possible sequences of swaps. For each fruit that needs to move from basket1 to basket2, we could try pairing it with every fruit that needs to move from basket2 to basket1. We'd need to consider all permutations of pairings.

The brute force would:

1. Identify all fruits that are in excess in each basket
2. Generate all possible pairings between excess fruits
3. For each pairing, calculate the total swap cost
4. Return the minimum cost

This is exponential in the number of excess fruits (which could be up to n). For n=10^5, this is completely infeasible.

Even a greedy direct pairing (smallest excess from basket1 with smallest excess from basket2) might not be optimal, as we saw in the example where using the global minimum as an intermediary gave a better result.

## Optimized Approach

The key insight is that we need to exchange two multisets of fruits: those that basket1 has too many of (and needs to give to basket2) and those that basket2 has too many of (and needs to give to basket1).

**Step-by-step reasoning:**

1. **Frequency analysis**: Count how many of each fruit cost each basket has. For a fruit to be splittable equally between baskets, its total count across both baskets must be even. If any fruit has an odd total count, it's impossible (though the problem guarantees valid inputs).

2. **Identify excess fruits**: For each fruit cost, calculate how many more basket1 has than it should. If basket1 has count1 and basket2 has count2 for a fruit, and the total is total = count1 + count2, then each basket should have total/2. If count1 > total/2, basket1 has excess = count1 - total/2 of that fruit to give away.

3. **Prepare swap lists**: Collect all excess fruits from basket1 (ones to give to basket2) and all excess fruits from basket2 (ones to give to basket1). Sort both lists.

4. **Optimal pairing strategy**: We need to pair fruits from the two lists for swapping. The cost of swapping fruit x from basket1 with fruit y from basket2 is min(x, y). However, we can also use the overall minimum fruit cost (from either basket) as an intermediary:
   - Direct swap cost: min(x, y)
   - Indirect swap through minimum m: min(x, m) + min(y, m) = x + y (if m is smaller than both) or potentially less
     Actually, if we swap x with m and then m with y, total cost = min(x, m) + min(m, y)
     If m is the global minimum, then min(x, m) = m and min(m, y) = m, so total = 2m
     This is better than min(x, y) when 2m < min(x, y)

5. **The algorithm**: Sort both lists of excess fruits. Pair the smallest from list1 with smallest from list2, second smallest with second smallest, etc. For each pair (x, y), take min(min(x, y), 2 \* global_min) as the cost for that exchange.

6. **Why this works**: The global minimum fruit can serve as a cheap intermediary. If we have to move fruit x from basket1 to basket2 and fruit y from basket2 to basket1, we can either:
   - Swap directly: cost = min(x, y)
   - Use minimum m: swap x with m (cost m), then swap m with y (cost m) = 2m
     We choose whichever is cheaper for each pair.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minCost(basket1, basket2):
    """
    Calculate minimum cost to make two baskets equal through swaps.

    Args:
        basket1: List of fruit costs in first basket
        basket2: List of fruit costs in second basket

    Returns:
        Minimum total swap cost, or -1 if impossible
    """
    from collections import Counter

    # Step 1: Count frequencies of each fruit cost in both baskets
    count1 = Counter(basket1)
    count2 = Counter(basket2)

    # Step 2: Find the overall minimum fruit cost
    # This will be used as potential intermediary for swaps
    min_fruit = min(min(basket1), min(basket2))

    # Step 3: Identify fruits that need to be swapped
    swap_from_1 = []  # Fruits basket1 needs to give away
    swap_from_2 = []  # Fruits basket2 needs to give away

    # Check all fruit costs that appear in either basket
    all_fruits = set(count1.keys()) | set(count2.keys())

    for fruit in all_fruits:
        c1 = count1.get(fruit, 0)
        c2 = count2.get(fruit, 0)
        total = c1 + c2

        # If total count is odd, impossible to split equally
        if total % 2 == 1:
            return -1

        # Each basket should have total // 2 of this fruit
        target = total // 2

        # Calculate how many excess basket1 has
        if c1 > target:
            # basket1 has too many of this fruit
            # It needs to give away (c1 - target) of them
            excess = c1 - target
            # Add this fruit 'excess' times to the swap list
            swap_from_1.extend([fruit] * excess)
        elif c2 > target:
            # basket2 has too many of this fruit
            excess = c2 - target
            swap_from_2.extend([fruit] * excess)

    # Step 4: Sort the swap lists
    # We'll pair smallest from swap_from_1 with smallest from swap_from_2
    swap_from_1.sort()
    swap_from_2.sort()

    # Step 5: Calculate minimum cost
    total_cost = 0

    # Pair corresponding elements from both lists
    for x, y in zip(swap_from_1, swap_from_2):
        # For each pair, we can either swap directly or use min_fruit as intermediary
        # Direct swap cost: min(x, y)
        # Indirect swap: swap x with min_fruit (cost min_fruit),
        # then min_fruit with y (cost min_fruit) = 2 * min_fruit
        # Choose the cheaper option
        cost = min(min(x, y), 2 * min_fruit)
        total_cost += cost

    return total_cost
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Calculate minimum cost to make two baskets equal through swaps.
 * @param {number[]} basket1 - Fruit costs in first basket
 * @param {number[]} basket2 - Fruit costs in second basket
 * @return {number} Minimum total swap cost, or -1 if impossible
 */
function minCost(basket1, basket2) {
  // Step 1: Count frequencies of each fruit cost in both baskets
  const count1 = new Map();
  const count2 = new Map();

  // Count fruits in basket1
  for (const fruit of basket1) {
    count1.set(fruit, (count1.get(fruit) || 0) + 1);
  }

  // Count fruits in basket2
  for (const fruit of basket2) {
    count2.set(fruit, (count2.get(fruit) || 0) + 1);
  }

  // Step 2: Find the overall minimum fruit cost
  const min1 = Math.min(...basket1);
  const min2 = Math.min(...basket2);
  const minFruit = Math.min(min1, min2);

  // Step 3: Identify fruits that need to be swapped
  const swapFrom1 = []; // Fruits basket1 needs to give away
  const swapFrom2 = []; // Fruits basket2 needs to give away

  // Get all unique fruit costs
  const allFruits = new Set([...basket1, ...basket2]);

  for (const fruit of allFruits) {
    const c1 = count1.get(fruit) || 0;
    const c2 = count2.get(fruit) || 0;
    const total = c1 + c2;

    // If total count is odd, impossible to split equally
    if (total % 2 === 1) {
      return -1;
    }

    // Each basket should have total / 2 of this fruit
    const target = total / 2;

    // Calculate how many excess basket1 has
    if (c1 > target) {
      // basket1 has too many of this fruit
      const excess = c1 - target;
      // Add this fruit 'excess' times to the swap list
      for (let i = 0; i < excess; i++) {
        swapFrom1.push(fruit);
      }
    } else if (c2 > target) {
      // basket2 has too many of this fruit
      const excess = c2 - target;
      for (let i = 0; i < excess; i++) {
        swapFrom2.push(fruit);
      }
    }
  }

  // Step 4: Sort the swap lists
  // We'll pair smallest from swapFrom1 with smallest from swapFrom2
  swapFrom1.sort((a, b) => a - b);
  swapFrom2.sort((a, b) => a - b);

  // Step 5: Calculate minimum cost
  let totalCost = 0;

  // Pair corresponding elements from both lists
  for (let i = 0; i < swapFrom1.length; i++) {
    const x = swapFrom1[i];
    const y = swapFrom2[i];

    // For each pair, choose cheaper option:
    // Direct swap: min(x, y) or indirect through minFruit: 2 * minFruit
    const cost = Math.min(Math.min(x, y), 2 * minFruit);
    totalCost += cost;
  }

  return totalCost;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    /**
     * Calculate minimum cost to make two baskets equal through swaps.
     * @param basket1 Fruit costs in first basket
     * @param basket2 Fruit costs in second basket
     * @return Minimum total swap cost, or -1 if impossible
     */
    public long minCost(int[] basket1, int[] basket2) {
        // Step 1: Count frequencies of each fruit cost in both baskets
        Map<Integer, Integer> count1 = new HashMap<>();
        Map<Integer, Integer> count2 = new HashMap<>();

        // Count fruits in basket1
        for (int fruit : basket1) {
            count1.put(fruit, count1.getOrDefault(fruit, 0) + 1);
        }

        // Count fruits in basket2
        for (int fruit : basket2) {
            count2.put(fruit, count2.getOrDefault(fruit, 0) + 1);
        }

        // Step 2: Find the overall minimum fruit cost
        int min1 = Arrays.stream(basket1).min().getAsInt();
        int min2 = Arrays.stream(basket2).min().getAsInt();
        int minFruit = Math.min(min1, min2);

        // Step 3: Identify fruits that need to be swapped
        List<Integer> swapFrom1 = new ArrayList<>();  // Fruits basket1 needs to give away
        List<Integer> swapFrom2 = new ArrayList<>();  // Fruits basket2 needs to give away

        // Get all unique fruit costs
        Set<Integer> allFruits = new HashSet<>();
        for (int fruit : basket1) allFruits.add(fruit);
        for (int fruit : basket2) allFruits.add(fruit);

        for (int fruit : allFruits) {
            int c1 = count1.getOrDefault(fruit, 0);
            int c2 = count2.getOrDefault(fruit, 0);
            int total = c1 + c2;

            // If total count is odd, impossible to split equally
            if (total % 2 == 1) {
                return -1;
            }

            // Each basket should have total / 2 of this fruit
            int target = total / 2;

            // Calculate how many excess basket1 has
            if (c1 > target) {
                // basket1 has too many of this fruit
                int excess = c1 - target;
                // Add this fruit 'excess' times to the swap list
                for (int i = 0; i < excess; i++) {
                    swapFrom1.add(fruit);
                }
            } else if (c2 > target) {
                // basket2 has too many of this fruit
                int excess = c2 - target;
                for (int i = 0; i < excess; i++) {
                    swapFrom2.add(fruit);
                }
            }
        }

        // Step 4: Sort the swap lists
        // We'll pair smallest from swapFrom1 with smallest from swapFrom2
        Collections.sort(swapFrom1);
        Collections.sort(swapFrom2);

        // Step 5: Calculate minimum cost
        long totalCost = 0;

        // Pair corresponding elements from both lists
        for (int i = 0; i < swapFrom1.size(); i++) {
            int x = swapFrom1.get(i);
            int y = swapFrom2.get(i);

            // For each pair, choose cheaper option:
            // Direct swap: min(x, y) or indirect through minFruit: 2 * minFruit
            int cost = Math.min(Math.min(x, y), 2 * minFruit);
            totalCost += cost;
        }

        return totalCost;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Counting frequencies: O(n) for iterating through both arrays
- Processing unique fruits: O(k) where k ≤ 2n (number of unique fruit costs)
- Sorting swap lists: O(m log m) where m ≤ n (number of fruits to swap)
- In worst case, m = n/2, so O(n log n) dominates

**Space Complexity: O(n)**

- Frequency maps: O(k) where k is number of unique fruit costs
- Swap lists: O(m) where m is number of fruits to swap
- In worst case, all fruits need to be swapped, so O(n)

## Common Mistakes

1. **Forgetting to check for odd counts**: Before attempting to solve, verify that each fruit type has an even total count across both baskets. If any fruit has an odd count, it's impossible to split equally.

2. **Not considering the global minimum as intermediary**: The trickiest part is realizing that sometimes it's cheaper to swap both fruits through the global minimum rather than swapping them directly. Candidates often only consider direct swaps and miss the optimization.

3. **Incorrect pairing strategy**: After identifying which fruits need to move, you must pair them optimally. Sorting both lists and pairing smallest with smallest is optimal because it minimizes the max cost in each swap.

4. **Integer overflow**: The total cost can be large (up to n × max_fruit_cost). Use 64-bit integers (long in Java, normal ints are fine in Python).

## When You'll See This Pattern

This problem combines frequency counting with greedy pairing optimization. You'll see similar patterns in:

1. **Minimum Number of Operations to Make Arrays Similar (Hard)**: Also requires balancing two collections through swaps with cost considerations. The key insight is similar: identify what needs to move and find optimal pairings.

2. **The Latest Time to Catch a Bus (Medium)**: While not about swapping, it involves similar greedy pairing thinking—matching people to buses optimally.

3. **Minimum Operations to Make the Array Alternating (Medium)**: Requires frequency analysis and balancing elements with constraints.

The core pattern: When you need to balance two collections, first use frequency analysis to determine what needs to move, then apply greedy strategies to minimize the cost of moving items.

## Key Takeaways

1. **Frequency analysis first**: When dealing with "make two collections equal" problems, start by counting elements. Determine what each collection has and what it needs.

2. **Look for intermediary optimization**: When swapping items between collections, check if using a common minimum element as an intermediary reduces costs. This is a classic optimization in swap-based problems.

3. **Greedy pairing is often optimal**: After identifying items to exchange, sorting and pairing smallest with smallest (or largest with largest) usually gives the optimal solution when costs are based on min() or max() operations.

Related problems: [The Latest Time to Catch a Bus](/problem/the-latest-time-to-catch-a-bus), [Minimum Number of Operations to Make Arrays Similar](/problem/minimum-number-of-operations-to-make-arrays-similar)
