---
title: "How to Solve Maximum Spending After Buying Items — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum Spending After Buying Items. Hard difficulty, 61.3% acceptance rate. Topics: Array, Greedy, Sorting, Heap (Priority Queue), Matrix."
date: "2030-02-21"
category: "dsa-patterns"
tags: ["maximum-spending-after-buying-items", "array", "greedy", "sorting", "hard"]
---

# How to Solve Maximum Spending After Buying Items

You're given a matrix where each row represents a shop with items sorted in non-increasing order, and you need to buy exactly one item per day for `m*n` days, with each day's price being the day number multiplied by the item's value. The challenge is to maximize total spending by strategically choosing which items to buy each day. What makes this tricky is that you need to balance buying expensive items early (when day multipliers are small) with saving them for later (when multipliers are larger), while also considering that each shop's items are sorted in a specific order.

## Visual Walkthrough

Let's trace through a small example to build intuition:

```
values = [[8,5,4,3], [10,9,2]]
```

We have 2 shops with 4 and 2 items respectively, for a total of 6 items. We'll need to buy items for 6 days.

**Step 1: Understanding the sorting**
Each shop's items are already sorted in non-increasing order:

- Shop 0: [8, 5, 4, 3] (8 is most expensive)
- Shop 1: [10, 9, 2] (10 is most expensive)

**Step 2: The greedy insight**
We want to maximize: `sum(day_number * item_value)`. Since day numbers increase (1, 2, 3, ...), we want:

- Cheaper items on earlier days (small multipliers)
- More expensive items on later days (large multipliers)

But there's a constraint: we can only take items from the end of each shop's list (since items are consumed in order).

**Step 3: Step-by-step simulation**
We'll use a min-heap to always pick the smallest available item for the current day:

Day 1: Available items are 3 (end of shop 0) and 2 (end of shop 1). Pick smallest: 2

- Total = 1 × 2 = 2
- Shop 1 now has [10, 9]

Day 2: Available items are 3 (shop 0) and 9 (shop 1). Pick smallest: 3

- Total = 2 + 2×3 = 8
- Shop 0 now has [8, 5, 4]

Day 3: Available items are 4 (shop 0) and 9 (shop 1). Pick smallest: 4

- Total = 8 + 3×4 = 20
- Shop 0 now has [8, 5]

Day 4: Available items are 5 (shop 0) and 9 (shop 1). Pick smallest: 5

- Total = 20 + 4×5 = 40
- Shop 0 now has [8]

Day 5: Available items are 8 (shop 0) and 9 (shop 1). Pick smallest: 8

- Total = 40 + 5×8 = 80
- Shop 0 is now empty

Day 6: Only shop 1 has item 9 left

- Total = 80 + 6×9 = 134

**Final answer: 134**

The key insight: always pick the smallest available item for the current day, because we want to "waste" small multipliers on cheap items and save large multipliers for expensive items.

## Brute Force Approach

A naive approach would be to consider all possible sequences of buying items. Since we have `m*n` total items and need to buy them in some order (respecting that we can only take from the end of each shop's list), this becomes a combinatorial problem.

The brute force would involve:

1. Generating all possible valid sequences of purchases
2. For each sequence, calculating the total spending
3. Returning the maximum

However, this is extremely inefficient. For `m` shops with `n` items each, the number of valid sequences grows factorially. Even for modest inputs like 3 shops with 3 items each (9 total items), the number of sequences is in the thousands. For larger inputs, this becomes computationally impossible.

The brute force fails because it doesn't leverage the problem's structure: the sorted order within shops and the fact that we want to maximize `day × value`.

## Optimized Approach

The optimal solution uses a **min-heap (priority queue)** with a **greedy strategy**:

**Key Insight**: To maximize `sum(day × value)`, we want to assign the largest multipliers (day numbers) to the most expensive items, and the smallest multipliers to the cheapest items. Since we must buy items in order from each shop (taking from the end), we need to decide which shop to buy from each day.

**Reasoning Step-by-Step**:

1. **Initialization**: Each shop has its items sorted in non-increasing order. This means the cheapest items are at the end of each list.
2. **Available Items**: On any given day, we can only buy from the last remaining item of each shop (if the shop still has items).
3. **Greedy Choice**: Each day, we should buy the **cheapest available item**. Why?
   - If we buy a cheap item today (small multiplier), we "waste" a small multiplier on it
   - If we save a cheap item for later, we might have to use a large multiplier on it, which is worse
   - Conversely, expensive items benefit more from large multipliers
4. **Data Structure**: We need a way to always know the cheapest available item. A min-heap gives us O(log m) access to the minimum, where m is the number of shops.
5. **Process**:
   - Start with day = 1
   - Add the last item from each shop to the heap
   - Each day: take the smallest item, add `day × value` to total, increment day
   - If the shop still has items, add its new last item to the heap
   - Repeat until all items are purchased

This approach works because it's always optimal to assign the current smallest multiplier to the current smallest available item.

## Optimal Solution

<div class="code-group">

```python
# Time: O(m*n log m) | Space: O(m)
# m = number of shops, n = items per shop
def maxSpending(values):
    """
    Calculate maximum total spending by strategically buying items over days.

    Args:
        values: List[List[int]] - matrix where each row is a shop with items
                sorted in non-increasing order

    Returns:
        int - maximum possible total spending
    """
    import heapq

    m = len(values)  # number of shops
    if m == 0:
        return 0

    # Initialize min-heap with the last item from each shop
    # Each heap element is (value, shop_index, item_index)
    # item_index points to the current last item in the shop
    heap = []
    for i in range(m):
        if values[i]:  # if shop has items
            # Last item is at index len(values[i]) - 1
            last_idx = len(values[i]) - 1
            heapq.heappush(heap, (values[i][last_idx], i, last_idx))

    total = 0
    day = 1

    # Process items for m*n days (total items across all shops)
    while heap:
        # Get the cheapest available item
        value, shop_idx, item_idx = heapq.heappop(heap)

        # Add to total: day * item value
        total += day * value
        day += 1

        # If the shop has more items, add the next one to heap
        if item_idx > 0:  # There are more items before this one
            next_idx = item_idx - 1  # Move to previous item (closer to front)
            next_value = values[shop_idx][next_idx]
            heapq.heappush(heap, (next_value, shop_idx, next_idx))

    return total
```

```javascript
// Time: O(m*n log m) | Space: O(m)
// m = number of shops, n = items per shop
function maxSpending(values) {
  /**
   * Calculate maximum total spending by strategically buying items over days.
   *
   * @param {number[][]} values - matrix where each row is a shop with items
   *                              sorted in non-increasing order
   * @return {number} - maximum possible total spending
   */
  const m = values.length;
  if (m === 0) return 0;

  // Min-heap implementation using array
  const heap = [];

  // Helper functions for min-heap
  function heapPush(item) {
    heap.push(item);
    let i = heap.length - 1;
    // Bubble up
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent][0] <= heap[i][0]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  }

  function heapPop() {
    if (heap.length === 0) return null;
    const min = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      // Bubble down
      let i = 0;
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;

        if (left < heap.length && heap[left][0] < heap[smallest][0]) {
          smallest = left;
        }
        if (right < heap.length && heap[right][0] < heap[smallest][0]) {
          smallest = right;
        }
        if (smallest === i) break;
        [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
        i = smallest;
      }
    }
    return min;
  }

  // Initialize heap with last item from each shop
  // Each element: [value, shopIndex, itemIndex]
  for (let i = 0; i < m; i++) {
    if (values[i].length > 0) {
      const lastIdx = values[i].length - 1;
      heapPush([values[i][lastIdx], i, lastIdx]);
    }
  }

  let total = 0;
  let day = 1;

  // Process all items
  while (heap.length > 0) {
    // Get cheapest available item
    const [value, shopIdx, itemIdx] = heapPop();

    // Add to total: day * item value
    total += day * value;
    day++;

    // If shop has more items, add next one to heap
    if (itemIdx > 0) {
      const nextIdx = itemIdx - 1;
      const nextValue = values[shopIdx][nextIdx];
      heapPush([nextValue, shopIdx, nextIdx]);
    }
  }

  return total;
}
```

```java
// Time: O(m*n log m) | Space: O(m)
// m = number of shops, n = items per shop
import java.util.PriorityQueue;

class Solution {
    public long maxSpending(int[][] values) {
        /**
         * Calculate maximum total spending by strategically buying items over days.
         *
         * @param values - matrix where each row is a shop with items
         *                sorted in non-increasing order
         * @return maximum possible total spending
         */
        int m = values.length;
        if (m == 0) return 0;

        // Min-heap: each element is [value, shopIndex, itemIndex]
        // We use a custom comparator to compare by value
        PriorityQueue<int[]> heap = new PriorityQueue<>(
            (a, b) -> Integer.compare(a[0], b[0])
        );

        // Initialize heap with last item from each shop
        for (int i = 0; i < m; i++) {
            if (values[i].length > 0) {
                int lastIdx = values[i].length - 1;
                heap.offer(new int[]{values[i][lastIdx], i, lastIdx});
            }
        }

        long total = 0;  // Use long to avoid overflow for large inputs
        int day = 1;

        // Process all items
        while (!heap.isEmpty()) {
            // Get cheapest available item
            int[] current = heap.poll();
            int value = current[0];
            int shopIdx = current[1];
            int itemIdx = current[2];

            // Add to total: day * item value
            total += (long) day * value;
            day++;

            // If shop has more items, add next one to heap
            if (itemIdx > 0) {
                int nextIdx = itemIdx - 1;
                int nextValue = values[shopIdx][nextIdx];
                heap.offer(new int[]{nextValue, shopIdx, nextIdx});
            }
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m × n × log m)**

- We process all `m × n` items (total items across all shops)
- For each item, we perform heap operations (push/pop) which take O(log m) time
- The heap size is at most `m` (one entry per shop)
- Therefore: O(m × n × log m)

**Space Complexity: O(m)**

- The heap stores at most one entry per shop
- We don't need to store all items simultaneously, just the current "available" items
- Additional O(1) space for variables like `total`, `day`, etc.

## Common Mistakes

1. **Wrong sorting direction**: Some candidates try to sort all items first, but this ignores the constraint that items must be taken in order from each shop. You can't just take any item from any position.

2. **Using max-heap instead of min-heap**: Intuitively, you might think to always pick the most expensive item, but this is wrong. You want to save expensive items for later days when multipliers are larger.

3. **Forgetting to track shop indices**: When you pop an item from the heap, you need to know which shop it came from so you can add the next item from that shop. Forgetting to store shop indices leads to incorrect results.

4. **Integer overflow**: With large inputs (many items, large values, many days), the total can exceed 32-bit integer limits. Always use 64-bit integers (long in Java/C++, long long in C, normal int in Python handles big integers).

## When You'll See This Pattern

This problem combines **greedy selection** with **priority queue** management, a pattern common in optimization problems with sequential constraints:

1. **Merge K Sorted Lists (LeetCode 23)**: Similar heap-based approach to always pick the smallest available element from multiple sorted sources.

2. **Maximum Performance of a Team (LeetCode 1383)**: Uses a min-heap to maintain the smallest elements while trying to maximize a product-like quantity (similar to our day × value).

3. **Course Schedule III (LeetCode 630)**: Uses a max-heap to manage courses by duration while maximizing the number of courses taken within time constraints.

The core pattern: when you need to make a series of choices from multiple sorted sources to optimize a cumulative score, consider using a heap to always make the locally optimal choice.

## Key Takeaways

1. **Greedy with proof**: The key insight (assign smallest multipliers to smallest available items) needs justification. In interviews, explain why this greedy choice is always optimal.

2. **Heap for multi-source selection**: When selecting from multiple sorted sequences, a heap lets you efficiently always pick the minimum/maximum available element.

3. **Constraint-aware sorting**: Even though items are sorted within shops, you can't globally sort all items because of the consumption order constraint. The heap elegantly handles this by only considering currently available items.

**Related problems**: [Maximum Points You Can Obtain from Cards](/problem/maximum-points-you-can-obtain-from-cards), [Maximum Score from Performing Multiplication Operations](/problem/maximum-score-from-performing-multiplication-operations)
