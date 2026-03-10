---
title: "How to Solve Largest Values From Labels — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Values From Labels. Medium difficulty, 64.1% acceptance rate. Topics: Array, Hash Table, Greedy, Sorting, Counting."
date: "2028-08-04"
category: "dsa-patterns"
tags: ["largest-values-from-labels", "array", "hash-table", "greedy", "medium"]
---

# How to Solve Largest Values From Labels

You’re given a list of items, each with a value and a label. You want to pick at most `numWanted` items to maximize the total value, but you can’t take more than `useLimit` items with the same label. The challenge is balancing between picking the highest-value items and respecting the per-label limit—this makes it a **constrained greedy selection** problem.

## Visual Walkthrough

Let’s walk through an example to build intuition.

**Input:**

```
values = [5, 4, 3, 2, 1]
labels = [1, 1, 2, 2, 1]
numWanted = 3
useLimit = 1
```

We want at most 3 items, and we can take at most 1 item per label.

**Step 1 – Pair items:** Combine each value with its label:

- (5, 1)
- (4, 1)
- (3, 2)
- (2, 2)
- (1, 1)

**Step 2 – Sort by value descending:** We want the highest values first.

- (5, 1)
- (4, 1)
- (3, 2)
- (2, 2)
- (1, 1)

**Step 3 – Greedy selection with limits:**

- Pick (5, 1). Total = 5, items taken = 1, label 1 count = 1 (at useLimit).
- Next (4, 1) – can’t take because label 1 is at limit.
- Next (3, 2). Total = 8, items taken = 2, label 2 count = 1.
- Next (2, 2) – can’t take because label 2 is at limit.
- Next (1, 1) – can’t take because label 1 is at limit.
- We have 2 items (< numWanted) but no more eligible items.

**Result:** 8

The key insight: **Always try to take the highest available value, but skip if its label has reached the limit.**

## Brute Force Approach

A brute force solution would consider all possible subsets of items, check if they satisfy the constraints (size ≤ numWanted, each label count ≤ useLimit), and track the maximum sum. For `n` items, there are 2<sup>n</sup> subsets—exponential time.

Even for moderate `n` (like 20), this becomes infeasible. A naive candidate might try backtracking with pruning, but it’s still exponential in worst case. The problem’s constraints (values/labels length up to 2×10<sup>4</sup>) clearly rule out any exponential approach.

## Optimized Approach

The optimal solution uses **greedy selection with sorting and counting**:

1. **Pair and sort:** Combine each value with its label, sort pairs by value descending.
2. **Greedy pick:** Iterate through sorted pairs. For each item:
   - Check if we’ve already taken `numWanted` items → stop.
   - Check if we’ve taken `useLimit` items with this label → skip.
   - Otherwise, take it: add value to sum, increment item count and label count.
3. **Track label usage:** Use a hash map (dictionary) to count how many items per label we’ve taken.

**Why greedy works:** Since we always pick the highest available value that doesn’t violate constraints, we never miss a better combination. If we skip a high-value item because its label is at limit, any replacement would have lower value (since we process in descending order). This is a classic “pick top K with constraints” pattern.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting | Space: O(n) for storing pairs and label counts
def largestValsFromLabels(values, labels, numWanted, useLimit):
    """
    Returns the maximum possible sum of values from at most numWanted items,
    with at most useLimit items per label.
    """
    # Step 1: Pair each value with its label
    items = list(zip(values, labels))

    # Step 2: Sort items by value in descending order
    # We want to consider highest values first
    items.sort(key=lambda x: -x[0])

    # Step 3: Initialize tracking variables
    total_value = 0          # Sum of selected item values
    taken_count = 0          # Number of items selected so far
    label_used = {}          # Map label -> how many times it's been used

    # Step 4: Greedy selection
    for value, label in items:
        # Stop if we've taken enough items
        if taken_count >= numWanted:
            break

        # Check if we can take more items with this label
        if label_used.get(label, 0) < useLimit:
            # Take this item
            total_value += value
            taken_count += 1
            label_used[label] = label_used.get(label, 0) + 1

    return total_value
```

```javascript
// Time: O(n log n) for sorting | Space: O(n) for storing items and label counts
function largestValsFromLabels(values, labels, numWanted, useLimit) {
  /**
   * Returns the maximum possible sum of values from at most numWanted items,
   * with at most useLimit items per label.
   */
  // Step 1: Pair each value with its label
  const items = [];
  for (let i = 0; i < values.length; i++) {
    items.push([values[i], labels[i]]);
  }

  // Step 2: Sort items by value in descending order
  // We want to consider highest values first
  items.sort((a, b) => b[0] - a[0]);

  // Step 3: Initialize tracking variables
  let totalValue = 0; // Sum of selected item values
  let takenCount = 0; // Number of items selected so far
  const labelUsed = new Map(); // Map label -> how many times it's been used

  // Step 4: Greedy selection
  for (const [value, label] of items) {
    // Stop if we've taken enough items
    if (takenCount >= numWanted) {
      break;
    }

    // Check if we can take more items with this label
    const currentLabelCount = labelUsed.get(label) || 0;
    if (currentLabelCount < useLimit) {
      // Take this item
      totalValue += value;
      takenCount++;
      labelUsed.set(label, currentLabelCount + 1);
    }
  }

  return totalValue;
}
```

```java
// Time: O(n log n) for sorting | Space: O(n) for storing items and label counts
import java.util.*;

class Solution {
    public int largestValsFromLabels(int[] values, int[] labels, int numWanted, int useLimit) {
        /**
         * Returns the maximum possible sum of values from at most numWanted items,
         * with at most useLimit items per label.
         */
        int n = values.length;

        // Step 1: Pair each value with its label
        int[][] items = new int[n][2];
        for (int i = 0; i < n; i++) {
            items[i][0] = values[i];  // value
            items[i][1] = labels[i];  // label
        }

        // Step 2: Sort items by value in descending order
        // We want to consider highest values first
        Arrays.sort(items, (a, b) -> b[0] - a[0]);

        // Step 3: Initialize tracking variables
        int totalValue = 0;           // Sum of selected item values
        int takenCount = 0;           // Number of items selected so far
        Map<Integer, Integer> labelUsed = new HashMap<>(); // Label -> usage count

        // Step 4: Greedy selection
        for (int[] item : items) {
            int value = item[0];
            int label = item[1];

            // Stop if we've taken enough items
            if (takenCount >= numWanted) {
                break;
            }

            // Check if we can take more items with this label
            int currentLabelCount = labelUsed.getOrDefault(label, 0);
            if (currentLabelCount < useLimit) {
                // Take this item
                totalValue += value;
                takenCount++;
                labelUsed.put(label, currentLabelCount + 1);
            }
        }

        return totalValue;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Creating item pairs: O(n)
- Sorting items by value: O(n log n) — dominates the time
- Greedy selection loop: O(n)
- Total: O(n log n)

**Space Complexity:** O(n)

- Storing the paired items: O(n)
- Hash map for label counts: O(k) where k ≤ n (distinct labels)
- In worst case, all labels are distinct: O(n)

The sorting step is the bottleneck. If values were already sorted, we could achieve O(n), but the problem doesn’t guarantee that.

## Common Mistakes

1. **Forgetting to sort descending:** Sorting ascending and iterating from the end works, but it’s error-prone. Explicitly sort descending for clarity.
2. **Not checking both limits:** Candidates sometimes check only `numWanted` or only `useLimit`. You must check both on each iteration.
3. **Incorrect label counting:** Using an array instead of hash map for labels. Labels can be any integer, not necessarily small consecutive numbers. A hash map handles sparse labels correctly.
4. **Early termination confusion:** The loop should stop when `takenCount >= numWanted`, not `takenCount > numWanted`. Since we increment after checking, `takenCount` represents items already taken.

## When You'll See This Pattern

This "pick top K with constraints" pattern appears in many greedy problems:

1. **Maximum Performance of a Team (LeetCode 1383)** – Pick at most k engineers with speed and efficiency constraints. Similar sorting + greedy selection with limits.
2. **Maximum Sum Obtained of Any Permutation (LeetCode 1589)** – Assign largest numbers to most frequently requested indices. Uses sorting and counting.
3. **Reduce Array Size to The Half (LeetCode 1338)** – Remove elements to reduce array by half, greedy by frequency.

These problems share: sort by some metric (value, frequency, efficiency), then apply constraints while greedily selecting.

## Key Takeaways

- **Greedy with sorting** is powerful when you need to pick top elements subject to constraints. Always try the highest-value option first.
- **Hash maps for constraint tracking** are essential when limits apply to categories (labels). They handle arbitrary, sparse categories efficiently.
- **Two-part solution structure:** 1) Sort by what you want to maximize, 2) Iterate with constraint checks. This pattern works for many "pick K best" problems.

Related problems: [Maximize Y‑Sum by Picking a Triplet of Distinct X‑Values](/problem/maximize-ysum-by-picking-a-triplet-of-distinct-xvalues)
