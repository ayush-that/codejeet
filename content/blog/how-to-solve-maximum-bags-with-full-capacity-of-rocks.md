---
title: "How to Solve Maximum Bags With Full Capacity of Rocks — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Bags With Full Capacity of Rocks. Medium difficulty, 68.0% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2027-04-01"
category: "dsa-patterns"
tags: ["maximum-bags-with-full-capacity-of-rocks", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximum Bags With Full Capacity of Rocks

You have `n` bags, each with a maximum capacity and current number of rocks. You're given additional rocks to distribute, and you want to maximize the number of bags that become completely full. The challenge is figuring out which bags to fill first to get the most full bags possible. This is a classic **greedy** problem where the optimal strategy isn't immediately obvious but becomes clear once you think about it systematically.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

- `capacity = [2, 3, 4, 5]`
- `rocks = [1, 2, 4, 4]`
- `additionalRocks = 2`

**Step 1: Calculate remaining capacity for each bag**
For each bag, we need to know how many more rocks it needs to become full:

- Bag 0: 2 - 1 = 1 rock needed
- Bag 1: 3 - 2 = 1 rock needed
- Bag 2: 4 - 4 = 0 rocks needed (already full!)
- Bag 3: 5 - 4 = 1 rock needed

**Step 2: Sort bags by remaining capacity**
If we sort the bags by how many rocks they need, we get:

- Bag 2: 0 rocks needed
- Bag 0: 1 rock needed
- Bag 1: 1 rock needed
- Bag 3: 1 rock needed

**Step 3: Fill the easiest bags first**
We have 2 additional rocks. Let's use our greedy approach:

1. Bag 2 is already full → count = 1, rocks used = 0
2. Bag 0 needs 1 rock → count = 2, rocks used = 1
3. Bag 1 needs 1 rock → count = 3, rocks used = 2
4. Bag 3 needs 1 rock but we're out of rocks → stop

**Result:** We can fill 3 bags completely.

This example shows why sorting is crucial: by filling the bags that need the fewest rocks first, we maximize the number of bags we can fill completely.

## Brute Force Approach

A naive approach might try all possible distributions of rocks. For example:

1. Try giving all rocks to the first bag, see how many bags become full
2. Try splitting rocks between first and second bag, etc.
3. Continue trying all combinations

The problem with this approach is the **combinatorial explosion**. With `n` bags and `additionalRocks` rocks, there are an enormous number of ways to distribute them. Even if `additionalRocks` is small, we'd need to consider all subsets of bags and all ways to allocate rocks to them.

A slightly better but still inefficient brute force would be to try filling bags in different orders:

- Try filling bags in their original order
- Try filling bags in reverse order
- Try random orders

But without systematically identifying the optimal order, we can't guarantee the best result. The time complexity would be factorial in the worst case (trying all permutations of bag-filling order), which is completely impractical for the constraints (n up to 5×10⁴).

## Optimized Approach

The key insight is that **to maximize the number of full bags, we should always fill the bags that need the fewest rocks first**. Think about it this way: if you have a choice between filling a bag that needs 1 rock or a bag that needs 5 rocks, filling the 1-rock bag leaves you with more rocks to potentially fill other bags.

This is a classic **greedy** strategy that works because:

1. Each bag either becomes full or doesn't - there's no partial credit
2. The cost to fill a bag is fixed (its remaining capacity)
3. We want to maximize count, not minimize total rocks used

**Step-by-step reasoning:**

1. **Calculate deficits**: For each bag, compute `capacity[i] - rocks[i]` - how many rocks it needs to become full
2. **Sort deficits**: Sort these deficits in ascending order (smallest first)
3. **Greedy fill**: Iterate through the sorted deficits, subtracting each from `additionalRocks` as long as we have enough rocks
4. **Count successes**: Each time we can fill a bag (deficit ≤ remaining rocks), increment our count

This works because by always choosing the smallest deficit available, we're using our rocks in the most efficient way possible to maximize the count of full bags.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) or O(1) depending on implementation
def maximumBags(capacity, rocks, additionalRocks):
    """
    Calculate the maximum number of bags that can be filled to capacity
    using the additional rocks.

    Args:
        capacity: List of maximum capacities for each bag
        rocks: List of current rocks in each bag
        additionalRocks: Number of additional rocks available

    Returns:
        Maximum number of bags that can be completely filled
    """
    n = len(capacity)

    # Step 1: Calculate how many rocks each bag needs to become full
    # This creates a list of deficits - how many rocks are missing from each bag
    deficits = [capacity[i] - rocks[i] for i in range(n)]

    # Step 2: Sort the deficits in ascending order
    # This is the key insight: fill bags with smallest deficits first
    deficits.sort()

    # Step 3: Greedily fill bags starting with smallest deficits
    full_bags = 0
    remaining_rocks = additionalRocks

    for deficit in deficits:
        # If we have enough rocks to fill this bag
        if deficit <= remaining_rocks:
            # Use the rocks to fill this bag
            remaining_rocks -= deficit
            # Count this bag as full
            full_bags += 1
        else:
            # If we can't fill this bag, we can't fill any remaining bags
            # (because deficits are sorted in increasing order)
            break

    return full_bags
```

```javascript
// Time: O(n log n) | Space: O(n)
/**
 * Calculate the maximum number of bags that can be filled to capacity
 * using the additional rocks.
 *
 * @param {number[]} capacity - Maximum capacities for each bag
 * @param {number[]} rocks - Current rocks in each bag
 * @param {number} additionalRocks - Number of additional rocks available
 * @return {number} Maximum number of bags that can be completely filled
 */
function maximumBags(capacity, rocks, additionalRocks) {
  const n = capacity.length;

  // Step 1: Calculate how many rocks each bag needs to become full
  // Create an array of deficits - how many rocks are missing from each bag
  const deficits = new Array(n);
  for (let i = 0; i < n; i++) {
    deficits[i] = capacity[i] - rocks[i];
  }

  // Step 2: Sort the deficits in ascending order
  // This is crucial: we want to fill bags with smallest needs first
  deficits.sort((a, b) => a - b);

  // Step 3: Greedily fill bags starting with smallest deficits
  let fullBags = 0;
  let remainingRocks = additionalRocks;

  for (const deficit of deficits) {
    // If we have enough rocks to fill this bag
    if (deficit <= remainingRocks) {
      // Use rocks to fill this bag
      remainingRocks -= deficit;
      // Count this bag as full
      fullBags++;
    } else {
      // If we can't fill this bag, we can't fill any remaining bags
      // because deficits are sorted in increasing order
      break;
    }
  }

  return fullBags;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.Arrays;

class Solution {
    /**
     * Calculate the maximum number of bags that can be filled to capacity
     * using the additional rocks.
     *
     * @param capacity Maximum capacities for each bag
     * @param rocks Current rocks in each bag
     * @param additionalRocks Number of additional rocks available
     * @return Maximum number of bags that can be completely filled
     */
    public int maximumBags(int[] capacity, int[] rocks, int additionalRocks) {
        int n = capacity.length;

        // Step 1: Calculate how many rocks each bag needs to become full
        // Create an array of deficits - how many rocks are missing from each bag
        int[] deficits = new int[n];
        for (int i = 0; i < n; i++) {
            deficits[i] = capacity[i] - rocks[i];
        }

        // Step 2: Sort the deficits in ascending order
        // This is the key: fill bags with smallest needs first
        Arrays.sort(deficits);

        // Step 3: Greedily fill bags starting with smallest deficits
        int fullBags = 0;
        int remainingRocks = additionalRocks;

        for (int deficit : deficits) {
            // If we have enough rocks to fill this bag
            if (deficit <= remainingRocks) {
                // Use rocks to fill this bag
                remainingRocks -= deficit;
                // Count this bag as full
                fullBags++;
            } else {
                // If we can't fill this bag, we can't fill any remaining bags
                // because deficits are sorted in increasing order
                break;
            }
        }

        return fullBags;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Calculating deficits: O(n) - we iterate through all n bags once
- Sorting deficits: O(n log n) - this is the dominant operation
- Greedy filling: O(n) - we iterate through sorted deficits once
- Total: O(n + n log n + n) = O(n log n)

**Space Complexity: O(n) or O(1)**

- If we create a new array for deficits: O(n) extra space
- If we modify the input arrays in-place (e.g., store deficits in `capacity` array): O(1) extra space
- The sorting algorithm typically uses O(log n) to O(n) space depending on implementation

## Common Mistakes

1. **Not sorting the deficits**: The most common mistake is trying to fill bags in their original order or trying to be "smart" about which bags to fill. Without sorting, you might fill a bag that needs 5 rocks first, then not have enough for 5 bags that each need 1 rock.

2. **Forgetting about already-full bags**: Some candidates calculate deficits but forget that bags with `capacity[i] == rocks[i]` have deficit 0 and should be counted immediately. Our solution handles this automatically since 0 ≤ `additionalRocks` is always true.

3. **Continuing after running out of rocks**: After the `break` statement, we stop processing because all remaining bags need more rocks than we have left. Continuing would waste time and potentially cause errors if we try to subtract from negative `remainingRocks`.

4. **Integer overflow with large values**: While not an issue in Python (which has arbitrary precision integers), in Java and JavaScript, adding many large numbers could theoretically overflow. However, with the given constraints (n ≤ 5×10⁴, values ≤ 10⁹), even the sum of all capacities would be at most 5×10¹³, which fits in a 64-bit integer.

## When You'll See This Pattern

This "greedy with sorting" pattern appears in many optimization problems where you need to maximize or minimize a count given limited resources:

1. **Maximum Units on a Truck (LeetCode 1710)**: Similar concept - you want to maximize total units on a truck by taking boxes with the highest units per box first (sort by unit count descending).

2. **Capacity To Ship Packages Within D Days (LeetCode 1011)**: While solved with binary search, it involves similar thinking about distributing items (packages) into containers (days) with capacity constraints.

3. **Assign Cookies (LeetCode 455)**: Another classic greedy problem - assign cookies to children to maximize satisfaction by giving the smallest adequate cookie to each child.

4. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)**: Sort intervals by end point, then greedily shoot arrows at the earliest end points.

The pattern is: when you need to maximize a count (full bags, satisfied children, etc.) with limited resources, sort by "cost" or "requirement" and take the cheapest ones first.

## Key Takeaways

1. **Greedy with sorting is powerful**: When you need to maximize a count given limited resources, sorting by cost/requirement and taking the smallest first is often optimal. This works when items are independent and there's no benefit to partial fulfillment.

2. **Look for "all-or-nothing" fulfillment**: This pattern works well when items are either fully satisfied (bag is full) or not satisfied at all. If partial fulfillment gave partial credit, we'd need a different approach.

3. **Always consider already-satisfied items**: Items with zero cost (already full bags, already burst balloons) should be handled automatically by your algorithm - they'll be at the front after sorting.

4. **Test with edge cases**: Empty arrays, all bags already full, not enough rocks for any bag, exactly enough rocks for all bags - these edge cases will catch most implementation errors.

Related problems: [Capacity To Ship Packages Within D Days](/problem/capacity-to-ship-packages-within-d-days), [Maximum Units on a Truck](/problem/maximum-units-on-a-truck)
