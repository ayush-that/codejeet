---
title: "How to Solve Apple Redistribution into Boxes — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Apple Redistribution into Boxes. Easy difficulty, 78.5% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2026-06-25"
category: "dsa-patterns"
tags: ["apple-redistribution-into-boxes", "array", "greedy", "sorting", "easy"]
---

# How to Solve Apple Redistribution into Boxes

This problem asks us to find the minimum number of boxes needed to hold all apples from different packs. You're given two arrays: `apple` (number of apples in each pack) and `capacity` (maximum apples each box can hold). The challenge is that boxes can be selected in any order, and we need to minimize the number of boxes used. This is essentially a "minimum containers" problem where we want to pack items into the fewest possible containers, given containers of different sizes.

What makes this interesting is that it's a classic greedy problem in disguise. The optimal strategy isn't immediately obvious—should we try to fill small boxes first or large ones? The answer reveals a fundamental principle about resource allocation problems.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

- `apple = [1, 3, 2]` (total apples = 1 + 3 + 2 = 6)
- `capacity = [4, 3, 1, 5, 2]`

**Step 1: Calculate total apples**
We need to store 6 apples total. The packs themselves don't matter individually—only the total matters since we can redistribute apples freely between boxes.

**Step 2: Sort boxes by capacity (descending)**
Sorted `capacity = [5, 4, 3, 2, 1]` (largest to smallest)

**Step 3: Select boxes greedily**

- Take box with capacity 5 → apples remaining: 6 - 5 = 1
- Take box with capacity 4 → apples remaining: 1 - 4 = -3 (we have enough space!)

We only needed 2 boxes. Notice that if we had taken smaller boxes first (like 1, then 2, then 3), we would have needed 3 boxes. The greedy approach of taking the largest boxes first minimizes the count.

**Why this works:** Since all apples are identical and can be redistributed freely, we want to use the fewest boxes possible. The optimal strategy is always to use the largest available boxes first, because each large box can hold more apples, reducing the total number needed.

## Brute Force Approach

A naive approach would be to try all possible combinations of boxes. For `m` boxes, there are 2^m possible subsets to check. For each subset:

1. Sum the capacities of selected boxes
2. Check if the sum ≥ total apples
3. Track the minimum size of valid subsets

This brute force solution has exponential time complexity O(2^m), which is completely impractical for even moderately sized inputs (m = 30 would mean checking over 1 billion subsets).

What makes this approach terrible is that it ignores the structure of the problem. We don't need to check combinations because the boxes are interchangeable—we only care about their capacities, not their identities. Any box with capacity X is equivalent to any other box with capacity X.

## Optimal Solution

The optimal solution follows these steps:

1. Calculate the total number of apples needed
2. Sort the capacity array in descending order (largest boxes first)
3. Iterate through sorted capacities, accumulating capacity until we have enough for all apples
4. Return the count of boxes used

This greedy approach works because:

- All apples are identical and can be freely redistributed
- Using larger boxes first minimizes the count (proven by exchange argument)
- The problem has optimal substructure: once we take a large box, the remaining problem is the same but smaller

<div class="code-group">

```python
# Time: O(m log m) for sorting | Space: O(1) or O(m) depending on sorting implementation
def minimumBoxes(apple, capacity):
    """
    Calculate minimum boxes needed to hold all apples.

    Args:
        apple: List[int] - apples in each pack
        capacity: List[int] - capacity of each box

    Returns:
        int - minimum number of boxes needed
    """
    # Step 1: Calculate total apples needed
    total_apples = sum(apple)

    # Step 2: Sort boxes in descending order (largest first)
    # We want to use the biggest boxes first to minimize count
    capacity.sort(reverse=True)

    # Step 3: Greedily select boxes until we have enough capacity
    boxes_used = 0
    current_capacity = 0

    # Iterate through boxes from largest to smallest
    for box_capacity in capacity:
        boxes_used += 1  # Take this box
        current_capacity += box_capacity  # Add its capacity

        # Check if we have enough space for all apples
        if current_capacity >= total_apples:
            return boxes_used  # Found minimum number of boxes

    # In theory, we should always have enough boxes (problem guarantees solution exists)
    return boxes_used
```

```javascript
// Time: O(m log m) for sorting | Space: O(1) or O(log m) for sorting
function minimumBoxes(apple, capacity) {
  /**
   * Calculate minimum boxes needed to hold all apples.
   *
   * @param {number[]} apple - apples in each pack
   * @param {number[]} capacity - capacity of each box
   * @return {number} - minimum number of boxes needed
   */

  // Step 1: Calculate total apples needed
  const totalApples = apple.reduce((sum, count) => sum + count, 0);

  // Step 2: Sort boxes in descending order (largest first)
  // Using (b - a) for descending sort
  capacity.sort((a, b) => b - a);

  // Step 3: Greedily select boxes until we have enough capacity
  let boxesUsed = 0;
  let currentCapacity = 0;

  // Iterate through boxes from largest to smallest
  for (const boxCapacity of capacity) {
    boxesUsed++; // Take this box
    currentCapacity += boxCapacity; // Add its capacity

    // Check if we have enough space for all apples
    if (currentCapacity >= totalApples) {
      return boxesUsed; // Found minimum number of boxes
    }
  }

  // In theory, we should always have enough boxes
  return boxesUsed;
}
```

```java
// Time: O(m log m) for sorting | Space: O(1) or O(log m) for sorting (quicksort recursion stack)
class Solution {
    public int minimumBoxes(int[] apple, int[] capacity) {
        /**
         * Calculate minimum boxes needed to hold all apples.
         *
         * @param apple - apples in each pack
         * @param capacity - capacity of each box
         * @return minimum number of boxes needed
         */

        // Step 1: Calculate total apples needed
        int totalApples = 0;
        for (int count : apple) {
            totalApples += count;
        }

        // Step 2: Sort boxes in descending order (largest first)
        // Convert to Integer[] to use Comparator.reverseOrder()
        // or sort and reverse manually for primitive array
        Arrays.sort(capacity);

        // Step 3: Greedily select boxes until we have enough capacity
        int boxesUsed = 0;
        int currentCapacity = 0;

        // Iterate from largest to smallest (reverse sorted array)
        for (int i = capacity.length - 1; i >= 0; i--) {
            boxesUsed++;  // Take this box
            currentCapacity += capacity[i];  // Add its capacity

            // Check if we have enough space for all apples
            if (currentCapacity >= totalApples) {
                return boxesUsed;  // Found minimum number of boxes
            }
        }

        // In theory, we should always have enough boxes
        return boxesUsed;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m log m)**

- Calculating total apples: O(n) where n is length of apple array
- Sorting capacity array: O(m log m) where m is length of capacity array
- Iterating through sorted capacities: O(m)
- Dominated by the sorting step: O(m log m)

**Space Complexity: O(1) or O(log m)**

- If using in-place sort (like quicksort): O(log m) for recursion stack
- If using merge sort: O(m) for auxiliary array
- The variables use constant space: O(1)
- Most languages use hybrid sorts with O(log m) recursion depth

The key insight is that sorting is the bottleneck. For very large inputs, we could use a counting sort if capacities have a limited range, but generally m log m is acceptable.

## Common Mistakes

1. **Sorting in ascending order (smallest first)**
   - This uses more boxes than necessary
   - Example: apples=10, boxes=[1,9,9] → ascending uses 2 boxes (1+9), descending uses 1 box (9)
   - Always sort descending for minimum container problems

2. **Forgetting to sum apples first**
   - Some candidates try to match packs to boxes individually
   - But apples can be redistributed! Total is all that matters
   - Always calculate `sum(apple)` first

3. **Not handling the "enough boxes" check properly**
   - The loop should stop when `currentCapacity >= totalApples`, not `>`
   - If they're equal, we have exactly enough space
   - Using `>` would continue the loop unnecessarily

4. **Assuming boxes must be used in given order**
   - The problem doesn't require using boxes in the order given
   - We can select any boxes in any order
   - Sorting is essential for the optimal solution

## When You'll See This Pattern

This "greedy selection with sorting" pattern appears in many resource allocation problems:

1. **Container With Most Water (LeetCode 11)**
   - Similar two-pointer approach after sorting or analyzing extremes
   - Teaches that sometimes sorting transforms the problem

2. **Assign Cookies (LeetCode 455)**
   - Almost identical pattern: sort greed sizes and cookie sizes
   - Assign largest cookies to greediest children first
   - Same "sort and match greedily" approach

3. **Minimum Number of Arrows to Burst Balloons (LeetCode 452)**
   - Sort intervals by end point, then greedily shoot arrows
   - The "process in sorted order" pattern is the same

The core insight is: when you need to minimize or maximize something with interchangeable resources, sorting often reveals the optimal greedy strategy.

## Key Takeaways

1. **When to use greedy with sorting**: Problems asking for "minimum number of containers/items" where items are interchangeable often have a greedy solution after sorting by size.

2. **Redistribution changes everything**: The fact that apples can be freely redistributed means we only care about total apples, not individual packs. Always check if items can be rearranged!

3. **Largest-first for minimization**: When minimizing count of containers needed, always try the largest containers first. This is counterintuitive to some who think "use small ones first to avoid waste," but for minimizing count, big-first is optimal.

[Practice this problem on CodeJeet](/problem/apple-redistribution-into-boxes)
