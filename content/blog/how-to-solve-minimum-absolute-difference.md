---
title: "How to Solve Minimum Absolute Difference — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Absolute Difference. Easy difficulty, 75.0% acceptance rate. Topics: Array, Sorting."
date: "2027-07-11"
category: "dsa-patterns"
tags: ["minimum-absolute-difference", "array", "sorting", "easy"]
---

# How to Solve Minimum Absolute Difference

This problem asks us to find all pairs of distinct integers in an array that have the smallest possible absolute difference between them. While the problem is classified as "Easy," it has a subtle twist: we need to find **all** pairs with the minimum difference, not just one pair or the minimum difference value itself. The key insight is that the minimum difference can only occur between consecutive elements when the array is sorted.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `arr = [4,2,1,3]`:

**Step 1: Sort the array**
When we sort the array, we get `[1,2,3,4]`. Sorting is crucial because the minimum absolute difference between any two elements must occur between consecutive elements in the sorted order. Think about it: if we have three numbers `a < b < c`, then `c - a = (c - b) + (b - a)`, which is always greater than or equal to both `c - b` and `b - a`.

**Step 2: Find the minimum difference**
Now we compare consecutive pairs:

- Difference between 1 and 2: |1-2| = 1
- Difference between 2 and 3: |2-3| = 1
- Difference between 3 and 4: |3-4| = 1

The minimum difference is 1.

**Step 3: Collect all pairs with this difference**
We check each consecutive pair again and collect those with difference = 1:

- [1,2] has difference 1 → include
- [2,3] has difference 1 → include
- [3,4] has difference 1 → include

So the result is `[[1,2],[2,3],[3,4]]`.

Let's try another example: `arr = [1,3,6,10,15]`:

- Sorted: `[1,3,6,10,15]`
- Differences: 2, 3, 4, 5
- Minimum difference = 2
- Only [1,3] has difference 2 → result is `[[1,3]]`

## Brute Force Approach

A naive approach would be to check every possible pair of elements:

1. Initialize `minDiff` to a very large number
2. For each pair `(i, j)` where `i < j`:
   - Calculate the absolute difference
   - If it's smaller than `minDiff`, update `minDiff` and start a new result list
   - If it equals `minDiff`, add the pair to the result list
3. Sort the result list before returning

This approach has O(n²) time complexity since we check all n(n-1)/2 pairs. For an array with 10,000 elements, that's about 50 million operations - far too slow. The sorting step at the end adds additional O(k log k) complexity where k is the number of pairs in the result.

The brute force fails because it doesn't leverage the mathematical insight that the minimum difference must occur between consecutive elements in sorted order. By sorting first, we reduce the search space dramatically.

## Optimal Solution

The optimal solution follows these steps:

1. Sort the array (O(n log n))
2. Find the minimum difference by comparing consecutive elements (O(n))
3. Collect all consecutive pairs that have this minimum difference (O(n))

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for the result list
def minimumAbsDifference(arr):
    """
    Finds all pairs with minimum absolute difference.

    Args:
        arr: List of distinct integers

    Returns:
        List of pairs [a, b] where b - a equals minimum difference
    """
    # Step 1: Sort the array - O(n log n)
    # Sorting is essential because the minimum difference
    # can only occur between consecutive elements in sorted order
    arr.sort()

    # Step 2: Initialize variables
    result = []  # Will store all pairs with minimum difference
    min_diff = float('inf')  # Start with infinity as our minimum

    # Step 3: First pass - find the minimum difference
    # We compare each element with its next neighbor
    for i in range(len(arr) - 1):
        current_diff = arr[i + 1] - arr[i]  # Since array is sorted, no abs() needed

        # Update minimum difference if we found a smaller one
        if current_diff < min_diff:
            min_diff = current_diff

    # Step 4: Second pass - collect all pairs with minimum difference
    # We need a second pass because we don't know the minimum difference
    # until we've seen all consecutive pairs
    for i in range(len(arr) - 1):
        current_diff = arr[i + 1] - arr[i]

        # If this pair has the minimum difference, add it to result
        if current_diff == min_diff:
            # Add as [a, b] with a < b (guaranteed since array is sorted)
            result.append([arr[i], arr[i + 1]])

    return result
```

```javascript
// Time: O(n log n) | Space: O(n) for the result array
function minimumAbsDifference(arr) {
  /**
   * Finds all pairs with minimum absolute difference.
   *
   * @param {number[]} arr - Array of distinct integers
   * @return {number[][]} - List of pairs [a, b] where b - a equals minimum difference
   */

  // Step 1: Sort the array - O(n log n)
  // Use numeric sort to avoid lexicographic sorting
  arr.sort((a, b) => a - b);

  // Step 2: Initialize variables
  const result = []; // Will store all pairs with minimum difference
  let minDiff = Infinity; // Start with infinity as our minimum

  // Step 3: First pass - find the minimum difference
  // Compare each element with its next neighbor
  for (let i = 0; i < arr.length - 1; i++) {
    const currentDiff = arr[i + 1] - arr[i]; // No Math.abs needed since sorted

    // Update minimum difference if we found a smaller one
    if (currentDiff < minDiff) {
      minDiff = currentDiff;
    }
  }

  // Step 4: Second pass - collect all pairs with minimum difference
  for (let i = 0; i < arr.length - 1; i++) {
    const currentDiff = arr[i + 1] - arr[i];

    // If this pair has the minimum difference, add it to result
    if (currentDiff === minDiff) {
      // Add as [a, b] with a < b (guaranteed since array is sorted)
      result.push([arr[i], arr[i + 1]]);
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n) for the result list
import java.util.*;

class Solution {
    public List<List<Integer>> minimumAbsDifference(int[] arr) {
        /**
         * Finds all pairs with minimum absolute difference.
         *
         * @param arr - Array of distinct integers
         * @return List of pairs [a, b] where b - a equals minimum difference
         */

        // Step 1: Sort the array - O(n log n)
        Arrays.sort(arr);

        // Step 2: Initialize variables
        List<List<Integer>> result = new ArrayList<>();
        int minDiff = Integer.MAX_VALUE;  // Start with maximum possible integer

        // Step 3: First pass - find the minimum difference
        // Compare each element with its next neighbor
        for (int i = 0; i < arr.length - 1; i++) {
            int currentDiff = arr[i + 1] - arr[i];  // No Math.abs needed since sorted

            // Update minimum difference if we found a smaller one
            if (currentDiff < minDiff) {
                minDiff = currentDiff;
            }
        }

        // Step 4: Second pass - collect all pairs with minimum difference
        for (int i = 0; i < arr.length - 1; i++) {
            int currentDiff = arr[i + 1] - arr[i];

            // If this pair has the minimum difference, add it to result
            if (currentDiff == minDiff) {
                // Create a new list for this pair
                List<Integer> pair = new ArrayList<>();
                pair.add(arr[i]);      // a
                pair.add(arr[i + 1]);  // b (guaranteed a < b since array is sorted)
                result.add(pair);
            }
        }

        return result;
    }
}
```

</div>

## One-Pass Optimization

We can actually combine steps 3 and 4 into a single pass. When we find a new minimum difference, we clear the result list and start fresh:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for the result list
def minimumAbsDifference(arr):
    """
    One-pass optimized version.
    """
    arr.sort()
    result = []
    min_diff = float('inf')

    for i in range(len(arr) - 1):
        current_diff = arr[i + 1] - arr[i]

        if current_diff < min_diff:
            # Found a new minimum, start fresh
            min_diff = current_diff
            result = [[arr[i], arr[i + 1]]]
        elif current_diff == min_diff:
            # Same minimum, add to existing list
            result.append([arr[i], arr[i + 1]])

    return result
```

```javascript
// Time: O(n log n) | Space: O(n) for the result array
function minimumAbsDifference(arr) {
  arr.sort((a, b) => a - b);
  const result = [];
  let minDiff = Infinity;

  for (let i = 0; i < arr.length - 1; i++) {
    const currentDiff = arr[i + 1] - arr[i];

    if (currentDiff < minDiff) {
      minDiff = currentDiff;
      result.length = 0; // Clear the array
      result.push([arr[i], arr[i + 1]]);
    } else if (currentDiff === minDiff) {
      result.push([arr[i], arr[i + 1]]);
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n) for the result list
import java.util.*;

class Solution {
    public List<List<Integer>> minimumAbsDifference(int[] arr) {
        Arrays.sort(arr);
        List<List<Integer>> result = new ArrayList<>();
        int minDiff = Integer.MAX_VALUE;

        for (int i = 0; i < arr.length - 1; i++) {
            int currentDiff = arr[i + 1] - arr[i];

            if (currentDiff < minDiff) {
                minDiff = currentDiff;
                result.clear();  // Clear the list
                result.add(Arrays.asList(arr[i], arr[i + 1]));
            } else if (currentDiff == minDiff) {
                result.add(Arrays.asList(arr[i], arr[i + 1]));
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time
- The single pass through the array takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(n)**

- The result list can contain up to n-1 pairs in the worst case (when all consecutive differences are equal)
- Sorting may use O(log n) to O(n) additional space depending on the algorithm, but we typically say O(n) for the output

## Common Mistakes

1. **Forgetting to sort the array**: This is the most common mistake. Without sorting, you can't guarantee that the minimum difference occurs between consecutive elements, forcing you to check all O(n²) pairs.

2. **Incorrect sorting in JavaScript**: Using `arr.sort()` without a comparator function in JavaScript sorts lexicographically (e.g., `[1, 10, 2]`). Always use `arr.sort((a, b) => a - b)` for numeric sorting.

3. **Off-by-one errors in loops**: When accessing `arr[i+1]`, the loop should run until `i < arr.length - 1`, not `i < arr.length`. Going out of bounds is a common error.

4. **Not handling the "new minimum" case correctly in one-pass solution**: When you find a new minimum difference, you must clear the result list before adding the new pair. Forgetting to clear means you'll include pairs from the old, larger minimum difference.

5. **Using absolute value unnecessarily**: Once the array is sorted, `arr[i+1] - arr[i]` is always non-negative, so `Math.abs()` or `abs()` is redundant and adds unnecessary computation.

## When You'll See This Pattern

The "sort first, then process consecutive elements" pattern appears in many array problems:

1. **Maximum Gap (LeetCode 164)**: After sorting, the maximum gap between successive elements is the answer. This problem actually has a harder version that asks for O(n) time solution using bucket sort.

2. **Array Partition I (LeetCode 561)**: To maximize the sum of min(a,b) for pairs, you sort and take every other element.

3. **Assign Cookies (LeetCode 455)**: Sort both the greed factors and cookie sizes, then match them greedily from smallest to largest.

4. **Non-overlapping Intervals (LeetCode 435)**: While not exactly the same, sorting intervals by end time then processing consecutively is a similar pattern.

The core insight is that sorting often reveals structure that makes a problem tractable. When you see "minimum difference," "maximum gap," or "closest" in a problem statement, consider if sorting might help.

## Key Takeaways

1. **Sorting reveals structure**: For problems involving differences between elements, sorting often transforms an O(n²) problem into O(n log n). The minimum/maximum difference between any two elements always occurs between consecutive elements in sorted order.

2. **Two-pass vs one-pass**: The two-pass solution (find min, then collect) is clearer and less error-prone for interviews. The one-pass optimization is more efficient but requires careful handling of the "new minimum" case.

3. **Watch for language-specific pitfalls**: JavaScript's default sort is lexicographic, Python's `sort()` is in-place while `sorted()` returns a new list, and Java's `Arrays.sort()` for primitives uses quicksort but for objects uses mergesort.

4. **Edge cases matter**: Always consider empty arrays, single-element arrays, and arrays where all elements are equal (though this problem guarantees distinct integers).

Related problems: [Minimum Cost of Buying Candies With Discount](/problem/minimum-cost-of-buying-candies-with-discount), [Minimize the Maximum Difference of Pairs](/problem/minimize-the-maximum-difference-of-pairs)
