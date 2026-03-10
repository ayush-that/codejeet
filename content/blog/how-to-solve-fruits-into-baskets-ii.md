---
title: "How to Solve Fruits Into Baskets II — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Fruits Into Baskets II. Easy difficulty, 70.2% acceptance rate. Topics: Array, Binary Search, Segment Tree, Simulation, Ordered Set."
date: "2028-10-22"
category: "dsa-patterns"
tags: ["fruits-into-baskets-ii", "array", "binary-search", "segment-tree", "easy"]
---

# How to Solve Fruits Into Baskets II

This problem asks us to efficiently distribute fruit quantities into baskets with varying capacities, following specific placement rules. While the description might seem straightforward, the challenge lies in implementing an efficient algorithm that handles the "place from left to right" constraint while minimizing time complexity. The interesting part is recognizing that we need to repeatedly find the first basket with enough capacity for each fruit, which suggests we need more than a simple linear scan.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
fruits = [3, 2, 4]
baskets = [2, 5, 3, 1]
```

**Step-by-step process:**

1. **First fruit (3 units):** We look from left to right in baskets:
   - Basket 0: capacity 2 → insufficient (3 > 2)
   - Basket 1: capacity 5 → sufficient (3 ≤ 5)
   - Place fruit 0 in basket 1, update basket capacity: 5 - 3 = 2
   - Baskets become: [2, 2, 3, 1]

2. **Second fruit (2 units):** Look from left to right:
   - Basket 0: capacity 2 → sufficient (2 ≤ 2)
   - Place fruit 1 in basket 0, update basket capacity: 2 - 2 = 0
   - Baskets become: [0, 2, 3, 1]

3. **Third fruit (4 units):** Look from left to right:
   - Basket 0: capacity 0 → insufficient (4 > 0)
   - Basket 1: capacity 2 → insufficient (4 > 2)
   - Basket 2: capacity 3 → insufficient (4 > 3)
   - Basket 3: capacity 1 → insufficient (4 > 1)
   - No basket can hold this fruit → return -1

**Result:** -1 (not all fruits could be placed)

This walkthrough reveals the core challenge: for each fruit, we need to find the first basket (from left) with sufficient remaining capacity. A naive approach would scan from the beginning each time, but that's inefficient for large inputs.

## Brute Force Approach

The most straightforward solution is to simulate the process exactly as described:

For each fruit:

1. Start from the first basket
2. Scan through baskets until finding one with enough capacity
3. If found, reduce that basket's capacity by the fruit quantity
4. If no basket has enough capacity, return -1

After placing all fruits successfully, return the index of the last used basket.

**Why this is inefficient:**

- In the worst case, for each of n fruits, we might scan through all m baskets
- Time complexity: O(n × m) where n = fruits.length, m = baskets.length
- For large inputs (n, m up to 10⁵), this becomes O(10¹⁰) operations, which is far too slow

The brute force approach fails because it doesn't leverage the fact that once a basket's capacity drops below a certain threshold, we can skip it in future searches. We need a way to efficiently find the next basket with sufficient capacity without scanning from the beginning each time.

## Optimal Solution

The key insight is that we need to maintain a data structure that allows us to quickly find the first basket (from current position onward) with enough capacity for the current fruit. While a segment tree or ordered set could work, there's a simpler approach using binary search on prefix sums.

However, for this specific problem, we can use a two-pointer approach that's more intuitive:

1. Maintain a pointer `basketIndex` tracking our current position in baskets
2. For each fruit, start searching from `basketIndex` instead of from 0
3. If we find a suitable basket, update its capacity and move on to the next fruit
4. If we don't find one, return -1

This works because we never need to go backward - once we pass a basket, we won't use it again for future fruits.

<div class="code-group">

```python
# Time: O(n + m) | Space: O(1)
def fruits_into_baskets(fruits, baskets):
    """
    Distribute fruits into baskets following the given rules.

    Args:
        fruits: List of fruit quantities
        baskets: List of basket capacities

    Returns:
        Index of last used basket, or -1 if not all fruits can be placed
    """
    n = len(fruits)
    m = len(baskets)

    basket_idx = 0  # Start from the first basket

    # Try to place each fruit
    for fruit_idx in range(n):
        fruit_qty = fruits[fruit_idx]

        # Find a basket with enough capacity starting from current position
        while basket_idx < m and baskets[basket_idx] < fruit_qty:
            basket_idx += 1

        # If no basket found, we can't place this fruit
        if basket_idx == m:
            return -1

        # Place the fruit in this basket
        baskets[basket_idx] -= fruit_qty

        # If basket still has capacity, we might use it again for next fruit
        # Only move to next basket if current one is now empty
        if baskets[basket_idx] == 0:
            basket_idx += 1

    # All fruits placed successfully, return index of last used basket
    # Note: basket_idx might point to next basket, so subtract 1
    # But if we never used any basket (n=0), return -1
    return basket_idx - 1 if n > 0 else -1
```

```javascript
// Time: O(n + m) | Space: O(1)
function fruitsIntoBaskets(fruits, baskets) {
  /**
   * Distribute fruits into baskets following the given rules.
   *
   * @param {number[]} fruits - Array of fruit quantities
   * @param {number[]} baskets - Array of basket capacities
   * @return {number} Index of last used basket, or -1 if not all fruits can be placed
   */
  const n = fruits.length;
  const m = baskets.length;

  let basketIdx = 0; // Start from the first basket

  // Try to place each fruit
  for (let fruitIdx = 0; fruitIdx < n; fruitIdx++) {
    const fruitQty = fruits[fruitIdx];

    // Find a basket with enough capacity starting from current position
    while (basketIdx < m && baskets[basketIdx] < fruitQty) {
      basketIdx++;
    }

    // If no basket found, we can't place this fruit
    if (basketIdx === m) {
      return -1;
    }

    // Place the fruit in this basket
    baskets[basketIdx] -= fruitQty;

    // If basket still has capacity, we might use it again for next fruit
    // Only move to next basket if current one is now empty
    if (baskets[basketIdx] === 0) {
      basketIdx++;
    }
  }

  // All fruits placed successfully, return index of last used basket
  // Note: basketIdx might point to next basket, so subtract 1
  // But if we never used any basket (n=0), return -1
  return n > 0 ? basketIdx - 1 : -1;
}
```

```java
// Time: O(n + m) | Space: O(1)
public int fruitsIntoBaskets(int[] fruits, int[] baskets) {
    /**
     * Distribute fruits into baskets following the given rules.
     *
     * @param fruits Array of fruit quantities
     * @param baskets Array of basket capacities
     * @return Index of last used basket, or -1 if not all fruits can be placed
     */
    int n = fruits.length;
    int m = baskets.length;

    int basketIdx = 0;  // Start from the first basket

    // Try to place each fruit
    for (int fruitIdx = 0; fruitIdx < n; fruitIdx++) {
        int fruitQty = fruits[fruitIdx];

        // Find a basket with enough capacity starting from current position
        while (basketIdx < m && baskets[basketIdx] < fruitQty) {
            basketIdx++;
        }

        // If no basket found, we can't place this fruit
        if (basketIdx == m) {
            return -1;
        }

        // Place the fruit in this basket
        baskets[basketIdx] -= fruitQty;

        // If basket still has capacity, we might use it again for next fruit
        // Only move to next basket if current one is now empty
        if (baskets[basketIdx] == 0) {
            basketIdx++;
        }
    }

    // All fruits placed successfully, return index of last used basket
    // Note: basketIdx might point to next basket, so subtract 1
    // But if we never used any basket (n=0), return -1
    return n > 0 ? basketIdx - 1 : -1;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- We iterate through each fruit exactly once: O(n)
- The `basketIdx` pointer moves through each basket at most once: O(m)
- Even though we have nested loops (for + while), notice that `basketIdx` only increases and never decreases
- Each basket is examined at most once across all iterations
- Therefore total operations = n + m, not n × m

**Space Complexity: O(1)**

- We only use a few integer variables (`basketIdx`, loop counters)
- We modify the input `baskets` array in place, so no additional data structures are needed
- If we couldn't modify the input, we'd need O(m) space for a copy

## Common Mistakes

1. **Starting search from index 0 for each fruit:** This leads to O(n × m) time complexity. Candidates often miss that once we've passed a basket (either used it or found it too small), we never need to check it again.

2. **Incorrectly updating basket index:** Forgetting to move to the next basket when current basket becomes empty. If a basket has capacity 5 and we place a 3-unit fruit, it still has 2 capacity left and could hold another small fruit.

3. **Off-by-one error in return value:** The problem asks for the index of the last used basket. If `basketIdx` points to the next available basket after processing all fruits, we need to return `basketIdx - 1`. Candidates often return `basketIdx` directly or forget to handle the case where no fruits were placed.

4. **Not handling empty arrays:** If `fruits` is empty, we should return -1 (no basket used). If `baskets` is empty but `fruits` is not, we should immediately return -1.

## When You'll See This Pattern

This "two-pointer forward scan" pattern appears in problems where you need to match elements from two sequences with a monotonic property (once you pass an element, you don't go back):

1. **Assign Cookies (LeetCode 455):** Match children with cookie sizes where each child needs a minimum size cookie. Similar forward scanning approach.

2. **Merge Sorted Arrays (LeetCode 88):** While not identical, it uses similar forward-pointer logic when merging in place.

3. **Interval Scheduling Problems:** When you need to assign tasks to time slots or resources, this forward-scanning approach often works well.

The key recognition signal is: "From left to right" placement with the property that once you use or reject an element from the second sequence, you never reconsider it.

## Key Takeaways

1. **Forward-only scanning is efficient:** When a problem has "left to right" placement rules, you can often use a single pointer that only moves forward through the data structure, giving you O(n + m) instead of O(n × m) complexity.

2. **Don't scan from start each time:** The biggest optimization comes from recognizing that you can resume searching from where you left off, not from the beginning.

3. **Modify in place when possible:** This problem allows modifying the `baskets` array, which saves space. Always check problem constraints to see if input modification is allowed.

Related problems: [Fruit Into Baskets](/problem/fruit-into-baskets)
