---
title: "How to Solve Maximum Element After Decreasing and Rearranging — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Element After Decreasing and Rearranging. Medium difficulty, 65.8% acceptance rate. Topics: Array, Greedy, Sorting."
date: "2027-03-15"
category: "dsa-patterns"
tags: ["maximum-element-after-decreasing-and-rearranging", "array", "greedy", "sorting", "medium"]
---

# How to Solve Maximum Element After Decreasing and Rearranging

This problem asks us to transform an array of positive integers so that it starts with 1 and has adjacent elements differing by at most 1, while maximizing the largest element in the final array. The tricky part is that we can both decrease elements (to any positive integer) and rearrange them arbitrarily, giving us significant flexibility that we need to use strategically.

## Visual Walkthrough

Let's trace through an example: `arr = [2, 2, 1, 2, 1]`

**Step 1: Sort the array**  
Sorted: `[1, 1, 2, 2, 2]`  
Sorting helps because we want to build our sequence from smallest to largest.

**Step 2: Build the valid sequence**  
We need the first element to be 1. Our sorted array already has 1 as the first element, so we can use it directly.

- Start with `result[0] = 1`
- Look at the next element (1): It can be at most `result[0] + 1 = 2`. Since 1 ≤ 2, we keep it as 1.
- Next element (2): Can be at most `result[1] + 1 = 2`. Since 2 ≤ 2, we keep it as 2.
- Next element (2): Can be at most `result[2] + 1 = 3`. Since 2 ≤ 3, we keep it as 2.
- Next element (2): Can be at most `result[3] + 1 = 3`. Since 2 ≤ 3, we keep it as 2.

**Step 3: Find the maximum**  
Our final sequence is `[1, 1, 2, 2, 2]`, so the maximum is 2.

But wait — could we do better? Let's try a different arrangement: `[1, 2, 2, 2, 2]`

- Start with 1 (we can decrease the first 2 to 1)
- Next can be at most 2 (1+1), so we take a 2
- Next can be at most 3 (2+1), so we take a 2 (or could increase it to 3 if available)
- Next can be at most 3, take a 2
- Next can be at most 3, take a 2

Maximum is still 2. The limiting factor is that we only have numbers up to 2 in our original array. The insight: we can only increase values gradually, and we're limited by what numbers we have available after sorting.

## Brute Force Approach

A naive approach might try all permutations of the array, then for each permutation try to adjust values to meet the conditions while maximizing the last element. This would involve:

1. Generating all n! permutations of the array
2. For each permutation, starting with the first element set to 1, adjust each subsequent element to be at most 1 greater than the previous
3. Track the maximum value achieved in any valid sequence

The problem with this approach is obvious: n! grows extremely fast. For n=10, that's 3.6 million permutations; for n=20, it's 2.4×10¹⁸ permutations. Even with pruning, this is computationally infeasible.

What about a different brute force? We could try to greedily build the sequence by always picking the smallest available number that can fit at each position. But without sorting first, we might make suboptimal choices early that limit our maximum later.

## Optimized Approach

The key insight is that **sorting the array first allows us to build the optimal sequence greedily**. Here's why:

1. **Sorting doesn't hurt our maximum**: Since we can rearrange arbitrarily, putting numbers in ascending order gives us the most flexibility to build a gradually increasing sequence.

2. **Greedy construction works**: After sorting, we process elements left to right. For each position i, the maximum value we can place there is `min(arr[i], result[i-1] + 1)`. This ensures:
   - We never exceed the original value (since we can only decrease)
   - We maintain the adjacency constraint (difference ≤ 1)
   - We maximize the current value, which helps maximize the final maximum

3. **Why this is optimal**: At each step, we're taking the largest possible value that maintains validity. If we took a smaller value at any position, it could only limit what we can place later, never help. This is the hallmark of a greedy algorithm where local optimal choices lead to a global optimum.

The algorithm in words:

1. Sort the array in ascending order
2. Initialize the first element to 1 (we might need to decrease it)
3. For each subsequent element, set it to `min(arr[i], previous + 1)`
4. The answer is the last element in this transformed sequence

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) for sorting, O(n) for processing = O(n log n)
# Space: O(1) if we modify in-place, O(n) if we create a new array
def maximumElementAfterDecrementingAndRearranging(arr):
    """
    Transform arr to satisfy:
    1. First element is 1
    2. Adjacent elements differ by at most 1
    While maximizing the maximum element.

    Strategy: Sort first, then greedily assign the maximum possible
    value at each position.
    """
    # Step 1: Sort the array to process elements in ascending order
    arr.sort()

    # Step 2: Ensure first element is 1 (we can only decrease)
    # If arr[0] > 1, we must decrease it to 1
    arr[0] = 1

    # Step 3: Process remaining elements
    for i in range(1, len(arr)):
        # The maximum we can assign at position i is:
        # 1. The original value arr[i] (we can't increase it)
        # 2. Previous value + 1 (to maintain adjacency constraint)
        # We take the minimum of these two constraints
        arr[i] = min(arr[i], arr[i-1] + 1)

    # Step 4: The maximum element is the last element
    # (since array is sorted and we've maximized each position)
    return arr[-1]
```

```javascript
// Time: O(n log n) for sorting, O(n) for processing = O(n log n)
// Space: O(1) if we modify in-place, O(n) if sorting creates a copy
function maximumElementAfterDecrementingAndRearranging(arr) {
  /**
   * Transform arr to satisfy:
   * 1. First element is 1
   * 2. Adjacent elements differ by at most 1
   * While maximizing the maximum element.
   *
   * Strategy: Sort first, then greedily assign the maximum possible
   * value at each position.
   */

  // Step 1: Sort the array to process elements in ascending order
  arr.sort((a, b) => a - b); // Numeric sort, not lexicographic!

  // Step 2: Ensure first element is 1 (we can only decrease)
  arr[0] = 1;

  // Step 3: Process remaining elements
  for (let i = 1; i < arr.length; i++) {
    // The maximum we can assign at position i is:
    // 1. The original value arr[i] (we can't increase it)
    // 2. Previous value + 1 (to maintain adjacency constraint)
    arr[i] = Math.min(arr[i], arr[i - 1] + 1);
  }

  // Step 4: The maximum element is the last element
  return arr[arr.length - 1];
}
```

```java
// Time: O(n log n) for sorting, O(n) for processing = O(n log n)
// Space: O(1) if we modify in-place (Arrays.sort uses O(log n) space for primitives)
class Solution {
    public int maximumElementAfterDecrementingAndRearranging(int[] arr) {
        /**
         * Transform arr to satisfy:
         * 1. First element is 1
         * 2. Adjacent elements differ by at most 1
         * While maximizing the maximum element.
         *
         * Strategy: Sort first, then greedily assign the maximum possible
         * value at each position.
         */

        // Step 1: Sort the array to process elements in ascending order
        Arrays.sort(arr);

        // Step 2: Ensure first element is 1 (we can only decrease)
        arr[0] = 1;

        // Step 3: Process remaining elements
        for (int i = 1; i < arr.length; i++) {
            // The maximum we can assign at position i is:
            // 1. The original value arr[i] (we can't increase it)
            // 2. Previous value + 1 (to maintain adjacency constraint)
            arr[i] = Math.min(arr[i], arr[i-1] + 1);
        }

        // Step 4: The maximum element is the last element
        return arr[arr.length - 1];
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the array takes O(n log n) time (using Timsort in Python, Merge sort or similar in JavaScript/Java)
- The single pass through the array takes O(n) time
- Dominated by the sorting step, so overall O(n log n)

**Space Complexity: O(1) or O(n)**

- If we modify the input array in-place: O(1) additional space (except for sorting which may use O(log n) stack space for some implementations)
- If sorting creates a copy: O(n) space
- The algorithm itself uses only a few variables, so minimal additional space

## Common Mistakes

1. **Forgetting to sort**: Some candidates try to process the array in its original order, which fails because early large numbers force us to decrease them significantly, limiting later values. Always sort first!

2. **Wrong JavaScript sort**: In JavaScript, `array.sort()` without a comparator sorts lexicographically (alphabetically), not numerically. `[10, 2, 1]` would become `[1, 10, 2]`. Always use `arr.sort((a, b) => a - b)`.

3. **Starting with wrong initial value**: The problem requires the first element to be exactly 1. Some candidates miss that we might need to decrease the first element even if it's not the smallest in the array. Always set `arr[0] = 1` after sorting.

4. **Overthinking the rearrangement**: Remember we can rearrange arbitrarily! Some candidates try complex DP or backtracking to find the "best" arrangement, when simple sorting followed by greedy assignment is optimal.

## When You'll See This Pattern

This "sort then greedy" pattern appears in many optimization problems where:

1. You can rearrange elements arbitrarily
2. You need to satisfy adjacency or ordering constraints
3. The goal is to maximize or minimize some value

Related LeetCode problems:

- **455. Assign Cookies**: Sort both arrays, then greedily match smallest cookie to smallest greed
- **561. Array Partition**: Sort, then take every other element to maximize sum of mins
- **1710. Maximum Units on a Truck**: Sort by units per box, take from highest first

The core insight is that when rearrangement is allowed, sorting often reveals the optimal ordering, and greedy choices after sorting are frequently optimal.

## Key Takeaways

1. **When you can rearrange, sort first**: This is a powerful heuristic. Sorting transforms the problem from "find the best arrangement" to "process in natural order."

2. **Greedy after sorting is often optimal**: For problems with monotonic constraints (like the adjacency constraint here), processing sorted elements with simple rules frequently yields the optimal solution.

3. **Constraints define the algorithm**: The "can only decrease" constraint means we take `min(original, previous+1)`. The "first must be 1" constraint means we force `arr[0]=1`. Always translate constraints directly into code operations.

[Practice this problem on CodeJeet](/problem/maximum-element-after-decreasing-and-rearranging)
