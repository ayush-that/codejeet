---
title: "How to Solve Minimum Absolute Difference Between Elements With Constraint — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Absolute Difference Between Elements With Constraint. Medium difficulty, 37.2% acceptance rate. Topics: Array, Binary Search, Ordered Set."
date: "2028-11-16"
category: "dsa-patterns"
tags:
  [
    "minimum-absolute-difference-between-elements-with-constraint",
    "array",
    "binary-search",
    "ordered-set",
    "medium",
  ]
---

# How to Solve Minimum Absolute Difference Between Elements With Constraint

This problem asks us to find the minimum absolute difference between any two elements in an array where the indices of those elements are at least `x` apart. What makes this problem interesting is that we need to consider both the values (to minimize difference) and the indices (to satisfy the distance constraint). A naive approach would check all pairs, but that's too slow for large arrays. The key insight is that we can use a sorted data structure to efficiently find the closest values while maintaining the index distance constraint.

## Visual Walkthrough

Let's walk through an example: `nums = [5, 3, 2, 10, 7]` with `x = 2`.

We want to find two elements at least 2 indices apart with the smallest possible value difference. Let's think step by step:

1. **Index 0 (value 5)**: We can only pair with indices ≥ 2 (since `i - j ≥ 2`). So we check:
   - Index 2 (value 2): difference = |5-2| = 3
   - Index 3 (value 10): difference = |5-10| = 5
   - Index 4 (value 7): difference = |5-7| = 2
     Minimum so far: 2

2. **Index 1 (value 3)**: Can pair with indices ≥ 3:
   - Index 3 (value 10): difference = 7
   - Index 4 (value 7): difference = 4
     Minimum so far: still 2

3. **Index 2 (value 2)**: Can pair with indices ≥ 4:
   - Index 4 (value 7): difference = 5
     Minimum so far: still 2

The answer is 2 (from pair (5,7) at indices 0 and 4).

The brute force approach would check all O(n²) pairs, but we can do better. Notice that to minimize value difference, we want to find the closest values. If we could quickly find, for each element, the closest value among elements that are at least `x` indices away, we could solve this efficiently.

## Brute Force Approach

The most straightforward solution is to check every pair of indices `(i, j)` where `abs(i - j) >= x` and track the minimum absolute difference:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def minAbsoluteDifference(nums, x):
    n = len(nums)
    min_diff = float('inf')

    # Check all pairs where indices are at least x apart
    for i in range(n):
        for j in range(i + x, n):  # j starts from i + x
            diff = abs(nums[i] - nums[j])
            min_diff = min(min_diff, diff)

    return min_diff
```

```javascript
// Time: O(n²) | Space: O(1)
function minAbsoluteDifference(nums, x) {
  const n = nums.length;
  let minDiff = Infinity;

  // Check all pairs where indices are at least x apart
  for (let i = 0; i < n; i++) {
    for (let j = i + x; j < n; j++) {
      // j starts from i + x
      const diff = Math.abs(nums[i] - nums[j]);
      minDiff = Math.min(minDiff, diff);
    }
  }

  return minDiff;
}
```

```java
// Time: O(n²) | Space: O(1)
public int minAbsoluteDifference(int[] nums, int x) {
    int n = nums.length;
    int minDiff = Integer.MAX_VALUE;

    // Check all pairs where indices are at least x apart
    for (int i = 0; i < n; i++) {
        for (int j = i + x; j < n; j++) {  // j starts from i + x
            int diff = Math.abs(nums[i] - nums[j]);
            minDiff = Math.min(minDiff, diff);
        }
    }

    return minDiff;
}
```

</div>

**Why this is insufficient:** For an array of size `n`, this takes O(n²) time. If `n = 10^5` (common in LeetCode constraints), this would be 10 billion operations — far too slow. We need a solution that's closer to O(n log n).

## Optimized Approach

The key insight is that for each element `nums[i]`, we need to find the closest value among elements that are at least `x` indices away. Since we're looking for the closest value (to minimize difference), a sorted data structure would help.

Here's the step-by-step reasoning:

1. **Two-phase approach**: We process the array from left to right. For each element `nums[i]`, we want to compare it with:
   - Elements that came **before** it (indices ≤ `i - x`)
   - Elements that will come **after** it (indices ≥ `i + x`)

2. **Using a sorted container**: We maintain a sorted list (like a balanced BST or TreeSet) of values we've seen that are eligible for comparison. As we move through the array:
   - When we're at index `i`, all elements with indices ≤ `i - x` are eligible to pair with `nums[i]`
   - We add `nums[i - x]` to our sorted container (when `i ≥ x`)
   - We use binary search to find the closest value to `nums[i]` in the container

3. **Why this works**: For each element, we only compare it with elements that are at least `x` indices away (specifically, those that came `x` indices earlier). This ensures we check all valid pairs exactly once.

4. **Handling both directions**: Actually, we only need to check one direction! If we check each element against earlier elements that are at least `x` indices away, we cover all pairs. When element A pairs with later element B, later when we process B, it will pair with A (which is now in the earlier elements container).

5. **Data structure choice**: We need a data structure that supports:
   - Insertion in O(log n)
   - Finding closest value (floor and ceiling) in O(log n)
     In Python, we can use `bisect` with a list. In Java, we can use `TreeSet`. In JavaScript, we can implement binary search on a sorted array.

## Optimal Solution

Here's the complete implementation using a sorted list and binary search:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def minAbsoluteDifference(nums, x):
    """
    Find minimum absolute difference between elements at least x indices apart.

    Approach:
    1. Maintain a sorted list of values from indices that are at least x behind current index
    2. For each element nums[i], find the closest value in the sorted list using binary search
    3. Update the minimum difference
    4. Add nums[i - x] to the sorted list when i >= x (so it becomes available for future elements)
    """
    import bisect

    n = len(nums)
    min_diff = float('inf')
    sorted_values = []  # Maintains values from indices that are x positions behind

    for i in range(n):
        # Find the closest value to nums[i] in sorted_values
        if sorted_values:
            # Binary search to find insertion point
            pos = bisect.bisect_left(sorted_values, nums[i])

            # Check the element at or just before insertion point (floor)
            if pos > 0:
                diff = abs(nums[i] - sorted_values[pos - 1])
                min_diff = min(min_diff, diff)

            # Check the element at or just after insertion point (ceiling)
            if pos < len(sorted_values):
                diff = abs(nums[i] - sorted_values[pos])
                min_diff = min(min_diff, diff)

        # Add nums[i - x] to sorted_values when it becomes eligible for future comparisons
        if i >= x:
            # Insert nums[i - x] into sorted_values while maintaining order
            bisect.insort(sorted_values, nums[i - x])

    return min_diff
```

```javascript
// Time: O(n log n) | Space: O(n)
function minAbsoluteDifference(nums, x) {
  /**
   * Find minimum absolute difference between elements at least x indices apart.
   *
   * Approach:
   * 1. Maintain a sorted array of values from indices that are at least x behind current index
   * 2. For each element nums[i], find the closest value in the sorted array using binary search
   * 3. Update the minimum difference
   * 4. Add nums[i - x] to the sorted array when i >= x (so it becomes available for future elements)
   */
  const n = nums.length;
  let minDiff = Infinity;
  const sortedValues = []; // Maintains values from indices that are x positions behind

  // Helper function for binary search insertion
  function binarySearchInsert(arr, target) {
    let left = 0,
      right = arr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    arr.splice(left, 0, target);
  }

  // Helper function for binary search to find closest values
  function findClosest(arr, target) {
    let left = 0,
      right = arr.length - 1;
    let closest = Infinity;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      closest = Math.min(closest, Math.abs(arr[mid] - target));

      if (arr[mid] < target) {
        left = mid + 1;
      } else if (arr[mid] > target) {
        right = mid - 1;
      } else {
        return 0; // Exact match found
      }
    }

    return closest;
  }

  for (let i = 0; i < n; i++) {
    // Find the closest value to nums[i] in sortedValues
    if (sortedValues.length > 0) {
      const diff = findClosest(sortedValues, nums[i]);
      minDiff = Math.min(minDiff, diff);
    }

    // Add nums[i - x] to sortedValues when it becomes eligible for future comparisons
    if (i >= x) {
      binarySearchInsert(sortedValues, nums[i - x]);
    }
  }

  return minDiff;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.TreeSet;

public int minAbsoluteDifference(int[] nums, int x) {
    /**
     * Find minimum absolute difference between elements at least x indices apart.
     *
     * Approach:
     * 1. Maintain a TreeSet of values from indices that are at least x behind current index
     * 2. For each element nums[i], find the closest value in the TreeSet using floor() and ceiling()
     * 3. Update the minimum difference
     * 4. Add nums[i - x] to the TreeSet when i >= x (so it becomes available for future elements)
     */
    int n = nums.length;
    int minDiff = Integer.MAX_VALUE;
    TreeSet<Integer> sortedValues = new TreeSet<>();  // Maintains values from indices that are x positions behind

    for (int i = 0; i < n; i++) {
        // Find the closest value to nums[i] in sortedValues
        if (!sortedValues.isEmpty()) {
            // Find the greatest value ≤ nums[i]
            Integer floor = sortedValues.floor(nums[i]);
            if (floor != null) {
                minDiff = Math.min(minDiff, Math.abs(nums[i] - floor));
            }

            // Find the smallest value ≥ nums[i]
            Integer ceiling = sortedValues.ceiling(nums[i]);
            if (ceiling != null) {
                minDiff = Math.min(minDiff, Math.abs(nums[i] - ceiling));
            }
        }

        // Add nums[i - x] to sortedValues when it becomes eligible for future comparisons
        if (i >= x) {
            sortedValues.add(nums[i - x]);
        }
    }

    return minDiff;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- We iterate through `n` elements
- For each element, we perform O(log n) operations:
  - Binary search to find closest value (Python/JavaScript)
  - `floor()` and `ceiling()` operations in TreeSet (Java)
  - Insertion into sorted structure
- Total: O(n log n)

**Space Complexity: O(n)**

- We store up to `n` elements in our sorted data structure
- In the worst case, we store all elements (when `x = 0`)

## Common Mistakes

1. **Only checking one direction**: Some candidates only check elements that come after the current element, forgetting that pairs can also be formed with earlier elements. Our solution handles this by checking each element against eligible earlier elements.

2. **Incorrect index math**: The condition `abs(i - j) >= x` means the indices must differ by at least `x`. A common mistake is using `>` instead of `>=` or getting the starting index wrong in loops.

3. **Not handling empty sorted structure**: When the sorted structure is empty (at the beginning), we need to check before trying to find closest values. Our code handles this with `if sorted_values:` (Python), `if (sortedValues.length > 0)` (JavaScript), and `if (!sortedValues.isEmpty())` (Java).

4. **Forgetting to maintain sorted order**: When adding new elements to our data structure, we must maintain sorted order. Using the wrong data structure (like a regular list without binary search insertion) would make operations O(n) instead of O(log n).

## When You'll See This Pattern

This "sorted container with distance constraint" pattern appears in several problems:

1. **Contains Duplicate III** (LeetCode 220): Find two indices `i` and `j` such that `abs(i - j) <= k` and `abs(nums[i] - nums[j]) <= t`. Uses a similar approach with a sliding window and sorted container.

2. **K-diff Pairs in an Array** (LeetCode 532): Find unique pairs with absolute difference `k`. While simpler, it uses similar value-difference logic.

3. **Maximum Number of Points with Cost** (LeetCode 1937): Uses prefix/suffix maximums with distance constraints, a more advanced variation of this pattern.

The core idea is maintaining a data structure that lets you quickly query for values satisfying certain conditions (like being close to a target value) while respecting index constraints.

## Key Takeaways

1. **When you need to find closest values with constraints, think sorted data structures**: Trees, heaps, or sorted arrays with binary search can help find closest values efficiently.

2. **Sliding window + sorted container is a powerful combination**: When you have both value-based queries and index-based constraints, maintaining a sliding window of eligible elements in a sorted structure often leads to optimal solutions.

3. **Check both floor and ceiling for closest value**: To find the element closest to a target in a sorted set, you need to check both the largest element ≤ target and the smallest element ≥ target.

Related problems: [K-diff Pairs in an Array](/problem/k-diff-pairs-in-an-array), [Find All K-Distant Indices in an Array](/problem/find-all-k-distant-indices-in-an-array), [Find Indices With Index and Value Difference I](/problem/find-indices-with-index-and-value-difference-i)
