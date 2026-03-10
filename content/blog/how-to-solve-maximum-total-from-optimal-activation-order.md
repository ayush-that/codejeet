---
title: "How to Solve Maximum Total from Optimal Activation Order — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Total from Optimal Activation Order. Medium difficulty, 33.0% acceptance rate. Topics: Array, Two Pointers, Greedy, Sorting, Heap (Priority Queue)."
date: "2030-01-09"
category: "dsa-patterns"
tags: ["maximum-total-from-optimal-activation-order", "array", "two-pointers", "greedy", "medium"]
---

# How to Solve Maximum Total from Optimal Activation Order

This problem presents a strategic activation puzzle: you have `n` elements, each with a `value` and a `limit`. You can only activate an element when the number of currently active elements is strictly less than its limit. Your goal is to maximize the total value of activated elements by choosing the optimal activation order. What makes this problem interesting is the tension between high-value elements (which you want to activate) and restrictive limits (which might prevent activation if you wait too long).

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

```
values = [5, 3, 8, 2]
limits = [1, 2, 0, 3]
```

Initially, no elements are active (count = 0). We need to decide which element to activate first.

**Step 1:** Look at element 2 (index 2, value 8, limit 0). Can we activate it? No, because we need 0 active elements (count < 0), but count is already 0, not less than 0. This element can never be activated because its limit is 0 and we need strictly less than 0 active elements, which is impossible.

**Step 2:** Consider activation order possibilities. If we try to activate the highest-value element first (value 8), we can't because of its limit 0. So we need to think differently.

**Key Insight:** Elements with lower limits are easier to activate early (when few elements are active). Elements with higher limits can wait until later. But we also want to maximize total value, so we prefer high-value elements.

Let's sort elements by their limits in ascending order:

```
Sorted by limit:
Index 2: value 8, limit 0 (can never activate)
Index 0: value 5, limit 1 (need 0 active elements)
Index 1: value 3, limit 2 (need <2 active, so 0 or 1)
Index 3: value 2, limit 3 (need <3 active, so 0, 1, or 2)
```

**Step 3:** Process in limit order:

- Element 2 (limit 0): Can't activate, skip
- Element 0 (limit 1): Currently 0 active, 0 < 1 ✓, activate. Total = 5, active count = 1
- Element 1 (limit 2): Currently 1 active, 1 < 2 ✓, activate. Total = 8, active count = 2
- Element 3 (limit 3): Currently 2 active, 2 < 3 ✓, activate. Total = 10, active count = 3

Final total = 10. But wait — is this optimal? What if we had taken element 1 first (value 3, limit 2), then element 0 (value 5, limit 1)? Let's check:

- Start: 0 active
- Activate element 1: 0 < 2 ✓, total = 3, active = 1
- Try element 0: 1 < 1? ✗ (1 is not less than 1). Can't activate!
- Activate element 3: 1 < 3 ✓, total = 5, active = 2

That's worse (total = 5). So sorting by limit seems promising, but we need to be careful about values too.

**Better Insight:** Sort by limit, but use a min-heap to track values of activated elements. If we can't activate a new element (because active count ≥ limit), we should consider replacing the smallest activated value with the current element if it's larger.

## Brute Force Approach

The brute force approach would try all possible activation orders (permutations) of the `n` elements. For each permutation, we would simulate the activation process, checking at each step if the current element can be activated given the current active count and its limit. We would track the maximum total value across all valid permutations.

**Why this fails:** There are `n!` possible permutations. For `n = 20`, that's over 2.4 quintillion possibilities. Even for modest `n = 10`, we have 3.6 million permutations. This is computationally infeasible.

Even a smarter brute force that only considers elements that can be activated at each step still has exponential complexity in the worst case. We need a more efficient approach.

## Optimized Approach

The key insight is that we should process elements in increasing order of their limits. Why? Because elements with lower limits have stricter requirements — they can only be activated when very few elements are active. If we don't activate them early, we might miss the opportunity entirely.

Here's the step-by-step reasoning:

1. **Pair and sort:** Combine each value with its limit, then sort these pairs by limit in ascending order. This ensures we consider elements with the strictest requirements first.

2. **Use a min-heap:** Maintain a min-heap (priority queue) of the values we've chosen to activate so far. The heap helps us efficiently track the smallest activated value.

3. **Greedy activation:** For each element in sorted order:
   - If we can activate it (current active count < limit), add it to our activation set (push its value to the heap).
   - If we cannot activate it (active count ≥ limit), compare its value with the smallest value currently activated (heap top):
     - If current value > smallest activated value, replace the smallest with the current one (pop smallest, push current).
     - Otherwise, skip this element.

4. **Why this works:** By processing in limit order, we ensure we never miss an element that could only be activated early. The heap ensures we always maintain the best possible set of activated values given the constraints. When we're forced to choose (because we've activated too many elements for the current limit), we replace the least valuable activated element if the current one is better.

This is essentially a "greedy exchange" argument: if we have an optimal solution and the current element is better than some element in the solution, we can swap them without violating constraints.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def maxTotalValue(values, limits):
    """
    Calculate maximum total value from optimal activation order.

    Args:
        values: List of integers representing element values
        limits: List of integers representing activation limits

    Returns:
        Maximum total value achievable
    """
    n = len(values)

    # Step 1: Create pairs of (limit, value) for each element
    # We'll sort by limit to process strictest requirements first
    pairs = [(limits[i], values[i]) for i in range(n)]

    # Step 2: Sort pairs by limit in ascending order
    # Elements with lower limits must be considered earlier
    pairs.sort(key=lambda x: x[0])

    # Step 3: Use a min-heap to track activated values
    # The heap will always contain the values we've chosen to activate
    import heapq
    min_heap = []
    total = 0

    # Step 4: Process each element in sorted order
    for limit, value in pairs:
        # Current number of activated elements
        active_count = len(min_heap)

        # Check if we can activate this element
        if active_count < limit:
            # We have room to activate this element
            heapq.heappush(min_heap, value)
            total += value
        else:
            # We've already activated too many elements for this limit
            # Consider replacing the smallest activated value if current is better
            if min_heap and value > min_heap[0]:
                # Replace smallest activated value with current (better) value
                smallest = heapq.heappop(min_heap)
                heapq.heappush(min_heap, value)

                # Update total: remove smallest, add current
                total = total - smallest + value

    return total
```

```javascript
// Time: O(n log n) | Space: O(n)
function maxTotalValue(values, limits) {
  /**
   * Calculate maximum total value from optimal activation order.
   *
   * @param {number[]} values - Array of element values
   * @param {number[]} limits - Array of activation limits
   * @return {number} Maximum total value achievable
   */
  const n = values.length;

  // Step 1: Create array of objects with limit and value
  // We'll sort by limit to process strictest requirements first
  const elements = [];
  for (let i = 0; i < n; i++) {
    elements.push({ limit: limits[i], value: values[i] });
  }

  // Step 2: Sort elements by limit in ascending order
  // Elements with lower limits must be considered earlier
  elements.sort((a, b) => a.limit - b.limit);

  // Step 3: Use a min-heap to track activated values
  // JavaScript doesn't have built-in heap, so we'll use array and maintain heap property
  const minHeap = [];
  let total = 0;

  // Helper functions for min-heap operations
  function heapPush(val) {
    minHeap.push(val);
    let i = minHeap.length - 1;
    // Bubble up
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (minHeap[parent] <= minHeap[i]) break;
      [minHeap[parent], minHeap[i]] = [minHeap[i], minHeap[parent]];
      i = parent;
    }
  }

  function heapPop() {
    if (minHeap.length === 0) return null;
    const minVal = minHeap[0];
    const last = minHeap.pop();
    if (minHeap.length > 0) {
      minHeap[0] = last;
      // Heapify down
      let i = 0;
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;

        if (left < minHeap.length && minHeap[left] < minHeap[smallest]) {
          smallest = left;
        }
        if (right < minHeap.length && minHeap[right] < minHeap[smallest]) {
          smallest = right;
        }
        if (smallest === i) break;

        [minHeap[i], minHeap[smallest]] = [minHeap[smallest], minHeap[i]];
        i = smallest;
      }
    }
    return minVal;
  }

  function heapPeek() {
    return minHeap.length > 0 ? minHeap[0] : null;
  }

  // Step 4: Process each element in sorted order
  for (const element of elements) {
    const { limit, value } = element;
    const activeCount = minHeap.length;

    // Check if we can activate this element
    if (activeCount < limit) {
      // We have room to activate this element
      heapPush(value);
      total += value;
    } else {
      // We've already activated too many elements for this limit
      // Consider replacing the smallest activated value if current is better
      const smallest = heapPeek();
      if (smallest !== null && value > smallest) {
        // Replace smallest activated value with current (better) value
        heapPop();
        heapPush(value);

        // Update total: remove smallest, add current
        total = total - smallest + value;
      }
    }
  }

  return total;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int maxTotalValue(int[] values, int[] limits) {
        /**
         * Calculate maximum total value from optimal activation order.
         *
         * @param values Array of element values
         * @param limits Array of activation limits
         * @return Maximum total value achievable
         */
        int n = values.length;

        // Step 1: Create array of Element objects with limit and value
        // We'll sort by limit to process strictest requirements first
        Element[] elements = new Element[n];
        for (int i = 0; i < n; i++) {
            elements[i] = new Element(limits[i], values[i]);
        }

        // Step 2: Sort elements by limit in ascending order
        // Elements with lower limits must be considered earlier
        Arrays.sort(elements, (a, b) -> Integer.compare(a.limit, b.limit));

        // Step 3: Use a min-heap to track activated values
        // PriorityQueue in Java is a min-heap by default
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        int total = 0;

        // Step 4: Process each element in sorted order
        for (Element element : elements) {
            int limit = element.limit;
            int value = element.value;

            // Current number of activated elements
            int activeCount = minHeap.size();

            // Check if we can activate this element
            if (activeCount < limit) {
                // We have room to activate this element
                minHeap.offer(value);
                total += value;
            } else {
                // We've already activated too many elements for this limit
                // Consider replacing the smallest activated value if current is better
                if (!minHeap.isEmpty() && value > minHeap.peek()) {
                    // Replace smallest activated value with current (better) value
                    int smallest = minHeap.poll();
                    minHeap.offer(value);

                    // Update total: remove smallest, add current
                    total = total - smallest + value;
                }
            }
        }

        return total;
    }

    // Helper class to store element data
    class Element {
        int limit;
        int value;

        Element(int limit, int value) {
            this.limit = limit;
            this.value = value;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting the `n` elements by limit takes O(n log n) time
- Each heap operation (push/pop/peek) takes O(log k) time where k ≤ n
- In the worst case, we perform O(n) heap operations
- Total: O(n log n) + O(n log n) = O(n log n)

**Space Complexity:** O(n)

- We store the pairs/objects array: O(n)
- The min-heap can contain up to n elements: O(n)
- Total: O(n)

The logarithmic factors come from the heap operations and sorting. This is optimal since we need to sort the elements by limit to apply the greedy strategy correctly.

## Common Mistakes

1. **Sorting by value instead of limit:** Candidates often try to sort by value in descending order to prioritize high-value elements. This fails because elements with low limits might become unactivatable if we wait too long. Always sort by limit first.

2. **Forgetting the "strictly less than" condition:** The problem states "strictly less than limit[i]". Some candidates implement "less than or equal to", which is incorrect. Check your comparison: it should be `activeCount < limit`, not `activeCount <= limit`.

3. **Not handling the heap replacement correctly:** When `activeCount >= limit`, you must compare with the smallest activated value. A common mistake is to always add the current element if it's larger than the smallest, without checking if there's actually a smallest to compare with (heap might be empty).

4. **Off-by-one errors with zero limits:** Elements with `limit = 0` can never be activated because we need `activeCount < 0`, which is impossible. The code correctly handles this because when `limit = 0`, `activeCount < 0` is always false (since `activeCount ≥ 0`).

## When You'll See This Pattern

This "sort by constraint, use heap for optimal selection" pattern appears in several scheduling and selection problems:

1. **Maximum Performance of a Team (LeetCode 1383):** Similar concept where you need to select engineers with speed and efficiency constraints, sorting by efficiency and using a min-heap for speeds.

2. **Course Schedule III (LeetCode 630):** You have courses with duration and lastDay constraints, sort by lastDay, and use a max-heap to replace courses when you run out of time.

3. **Meeting Rooms II (LeetCode 253):** While not identical, it uses a similar "process in sorted order, maintain active set" approach with a min-heap for end times.

The pattern is: when you need to select items under constraints that depend on the order of selection, sort by the constraint parameter and use a heap to maintain the best possible selection so far.

## Key Takeaways

1. **When order matters and constraints depend on what's already selected, sort by the constraint parameter.** This ensures you consider items with the strictest requirements first.

2. **Use a heap to efficiently maintain the best possible selection.** When you need to replace an item in your current selection, a heap lets you quickly find and remove the least valuable one.

3. **The greedy exchange argument is powerful.** If you can prove that swapping a better item for a worse one in a valid solution keeps it valid, you can use a heap to continuously improve your selection.

[Practice this problem on CodeJeet](/problem/maximum-total-from-optimal-activation-order)
