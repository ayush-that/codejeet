---
title: "How to Solve Pancake Sorting — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Pancake Sorting. Medium difficulty, 71.7% acceptance rate. Topics: Array, Two Pointers, Greedy, Sorting."
date: "2027-03-27"
category: "dsa-patterns"
tags: ["pancake-sorting", "array", "two-pointers", "greedy", "medium"]
---

# How to Solve Pancake Sorting

Pancake sorting is a classic algorithmic problem where you must sort an array using only a specific operation: reversing the first k elements. The challenge lies in designing an efficient strategy that uses this limited operation to achieve full sorting, which requires careful selection of flip positions at each step.

## Visual Walkthrough

Let's trace through sorting `arr = [3, 2, 4, 1]` using pancake flips. Our goal is to sort in ascending order: `[1, 2, 3, 4]`.

**Step 1:** Find the largest unsorted element (4). It's at index 2 (0-indexed).

- Flip first 3 elements (k=3): `[3, 2, 4, 1]` → `[4, 2, 3, 1]`
- Now 4 is at the front. Flip first 4 elements to move it to the end: `[4, 2, 3, 1]` → `[1, 3, 2, 4]`
- Now 4 is in its correct final position.

**Step 2:** Find next largest unsorted element (3). It's at index 1.

- Flip first 2 elements (k=2): `[1, 3, 2, 4]` → `[3, 1, 2, 4]`
- Flip first 3 elements to move 3 to position 2: `[3, 1, 2, 4]` → `[2, 1, 3, 4]`
- Now 3 is in its correct position.

**Step 3:** Find next largest unsorted element (2). It's at index 0.

- Flip first 2 elements (k=2): `[2, 1, 3, 4]` → `[1, 2, 3, 4]`
- Now 2 is in its correct position, and the array is sorted.

We used 5 flips total. Notice the pattern: for each element from largest to smallest, we perform at most 2 flips to place it in the correct position.

## Brute Force Approach

A naive approach would be to try all possible sequences of flips until we find one that sorts the array. For an array of length n, there are n possible flips at each step (k can be 1 to n). Even with a depth limit, this leads to exploring n! possibilities in the worst case, which is completely impractical for any reasonable n.

Another brute force idea might be to implement bubble sort using pancake flips: repeatedly find the next smallest element and bring it to the front, then flip it to the correct position. While this would work, it would require O(n²) flips, which is inefficient compared to the optimal approach.

The key insight we need is that we can work from the largest element to the smallest, placing each element in its correct position with at most 2 flips per element.

## Optimized Approach

The optimal solution uses a greedy approach that works from the largest element down to the smallest:

1. Start with the largest element (n, where n is the array length)
2. Find its current position in the array
3. If it's not already in the correct position:
   - Flip it to the front (flip k = position + 1)
   - Then flip it to its correct position (flip k = desired position + 1)
4. Decrease n by 1 and repeat for the next largest element

Why does this work? Each element only needs at most 2 flips to reach its correct position:

- First flip brings the element to the front
- Second flip moves it from the front to its correct sorted position

Since we work from largest to smallest, once we place an element, we never need to move it again. The flips only affect the unsorted portion of the array (the first n elements), so already-placed elements remain undisturbed.

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n^2) - We process n elements, each requiring O(n) to find
# Space: O(1) - We only store the result list (not counting output space)
def pancakeSort(arr):
    """
    Sort an array using pancake flips.

    The algorithm works from largest to smallest element:
    1. Find the current position of the largest unsorted element
    2. If not at correct position:
       a. Flip it to the front
       b. Flip it to its correct position
    3. Repeat for next largest element

    Args:
        arr: List[int] - The array to sort

    Returns:
        List[int] - Sequence of k-values for the flips performed
    """
    result = []
    n = len(arr)

    # Process elements from largest (n) to smallest (1)
    for target in range(n, 0, -1):
        # Find current position of target value
        # Note: arr is 0-indexed, target is 1-indexed
        idx = arr.index(target)

        # If already in correct position, skip
        if idx == target - 1:
            continue

        # If not at position 0, flip to bring target to front
        if idx != 0:
            # Flip first (idx+1) elements to bring target to front
            result.append(idx + 1)
            arr[:idx + 1] = arr[:idx + 1][::-1]

        # Now target is at position 0, flip to move to correct position
        # Flip first target elements to move target to position target-1
        result.append(target)
        arr[:target] = arr[:target][::-1]

    return result
```

```javascript
// Time: O(n^2) - We process n elements, each requiring O(n) to find
// Space: O(1) - We only store the result array (not counting output space)
function pancakeSort(arr) {
  /**
   * Sort an array using pancake flips.
   *
   * The algorithm works from largest to smallest element:
   * 1. Find the current position of the largest unsorted element
   * 2. If not at correct position:
   *    a. Flip it to the front
   *    b. Flip it to its correct position
   * 3. Repeat for next largest element
   *
   * @param {number[]} arr - The array to sort
   * @return {number[]} - Sequence of k-values for the flips performed
   */
  const result = [];
  const n = arr.length;

  // Process elements from largest (n) to smallest (1)
  for (let target = n; target > 0; target--) {
    // Find current position of target value
    // Note: arr is 0-indexed, target is 1-indexed
    let idx = arr.indexOf(target);

    // If already in correct position, skip
    if (idx === target - 1) {
      continue;
    }

    // If not at position 0, flip to bring target to front
    if (idx !== 0) {
      // Flip first (idx+1) elements to bring target to front
      result.push(idx + 1);
      // Reverse the subarray from 0 to idx
      for (let i = 0, j = idx; i < j; i++, j--) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    // Now target is at position 0, flip to move to correct position
    // Flip first target elements to move target to position target-1
    result.push(target);
    // Reverse the subarray from 0 to target-1
    for (let i = 0, j = target - 1; i < j; i++, j--) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  return result;
}
```

```java
// Time: O(n^2) - We process n elements, each requiring O(n) to find
// Space: O(1) - We only store the result list (not counting output space)
import java.util.*;

class Solution {
    public List<Integer> pancakeSort(int[] arr) {
        /**
         * Sort an array using pancake flips.
         *
         * The algorithm works from largest to smallest element:
         * 1. Find the current position of the largest unsorted element
         * 2. If not at correct position:
         *    a. Flip it to the front
         *    b. Flip it to its correct position
         * 3. Repeat for next largest element
         *
         * @param arr - The array to sort
         * @return List<Integer> - Sequence of k-values for the flips performed
         */
        List<Integer> result = new ArrayList<>();
        int n = arr.length;

        // Process elements from largest (n) to smallest (1)
        for (int target = n; target > 0; target--) {
            // Find current position of target value
            // Note: arr is 0-indexed, target is 1-indexed
            int idx = -1;
            for (int i = 0; i < n; i++) {
                if (arr[i] == target) {
                    idx = i;
                    break;
                }
            }

            // If already in correct position, skip
            if (idx == target - 1) {
                continue;
            }

            // If not at position 0, flip to bring target to front
            if (idx != 0) {
                // Flip first (idx+1) elements to bring target to front
                result.add(idx + 1);
                reverse(arr, 0, idx);
            }

            // Now target is at position 0, flip to move to correct position
            // Flip first target elements to move target to position target-1
            result.add(target);
            reverse(arr, 0, target - 1);
        }

        return result;
    }

    // Helper function to reverse a subarray from start to end (inclusive)
    private void reverse(int[] arr, int start, int end) {
        while (start < end) {
            int temp = arr[start];
            arr[start] = arr[end];
            arr[end] = temp;
            start++;
            end--;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n²)**

- We process each element from n down to 1: O(n) iterations
- For each element, we need to find its position in the array: O(n) using linear search
- Each flip operation reverses a subarray, which takes O(n) in the worst case
- Total: O(n) × O(n) = O(n²)

**Space Complexity: O(1) auxiliary space**

- We only use a constant amount of extra space for variables
- The result list is part of the output, so typically not counted in space complexity
- If we count the output, it would be O(n) in the worst case (2 flips per element)

Note: The O(n²) time complexity is optimal for this problem since any comparison-based pancake sorting algorithm requires Ω(n²) operations in the worst case.

## Common Mistakes

1. **Off-by-one errors with k-values**: Remember that k is 1-indexed (1 ≤ k ≤ arr.length) while arrays are 0-indexed. When you find an element at index i, the flip needed to bring it to the front is k = i + 1, not k = i.

2. **Forgetting to skip already-placed elements**: Always check if the current element is already in its correct position before performing flips. Unnecessary flips waste operations and can even unsort already-sorted portions.

3. **Modifying the wrong portion of the array**: When working with the nth largest element, remember that you should only consider the first n elements of the array (0 to n-1). Elements beyond position n-1 are already in their final sorted positions.

4. **Incorrect reversal implementation**: When implementing the flip operation manually (especially in Java/C++), ensure your reversal includes both endpoints. A common error is reversing from 0 to k instead of 0 to k-1.

## When You'll See This Pattern

The pancake sorting pattern appears in problems where you need to sort or rearrange elements using limited operations. The core technique—working backward from the desired final state—is useful in many scenarios:

1. **Reverse Operations Problems**: Similar to pancake sorting but with different constraints on allowed operations. For example, "Reverse Subarray To Maximize Array Value" (LeetCode 1330) uses similar reversal logic.

2. **Greedy Sorting with Constraints**: Problems like "Minimum Number of Operations to Move All Balls to Each Box" (LeetCode 1769) use a similar approach of strategically moving elements to their correct positions.

3. **Permutation Group Problems**: The concept of bringing elements to the front or back with limited operations appears in problems about permutation groups and sorting networks.

## Key Takeaways

1. **Work backward from the solution**: When dealing with constrained operations, it's often easier to think from the final sorted state backward to the current state. Place the largest elements first since they're easier to identify and position.

2. **Greedy can be optimal**: For pancake sorting, the simple greedy approach of placing one element at a time is actually optimal in terms of the number of flips required (each element needs at most 2 flips).

3. **Mind your indices**: With 1-indexed operations on 0-indexed data structures, off-by-one errors are the most common pitfall. Always double-check your index arithmetic, especially when the problem statement mixes indexing schemes.

[Practice this problem on CodeJeet](/problem/pancake-sorting)
