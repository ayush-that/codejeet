---
title: "How to Solve Sort an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sort an Array. Medium difficulty, 55.9% acceptance rate. Topics: Array, Divide and Conquer, Sorting, Heap (Priority Queue), Merge Sort."
date: "2026-09-26"
category: "dsa-patterns"
tags: ["sort-an-array", "array", "divide-and-conquer", "sorting", "medium"]
---

# How to Solve Sort an Array

This problem asks us to sort an array of integers in ascending order without using any built-in sorting functions, achieving O(n log n) time complexity with minimal space usage. What makes this interesting is that we need to implement a sorting algorithm from scratch that meets these constraints—it's a fundamental test of understanding algorithmic efficiency and trade-offs.

## Visual Walkthrough

Let's trace through sorting the array `[5, 2, 3, 1]` using Merge Sort, which is a good fit for our requirements:

**Step 1: Divide the array**

- Start with `[5, 2, 3, 1]`
- Split into left half `[5, 2]` and right half `[3, 1]`
- Split `[5, 2]` into `[5]` and `[2]` (single elements are sorted)
- Split `[3, 1]` into `[3]` and `[1]` (single elements are sorted)

**Step 2: Merge sorted subarrays**

- Merge `[5]` and `[2]`:
  - Compare 5 and 2 → 2 is smaller → add 2 to result
  - Add remaining 5 → result is `[2, 5]`
- Merge `[3]` and `[1]`:
  - Compare 3 and 1 → 1 is smaller → add 1 to result
  - Add remaining 3 → result is `[1, 3]`

**Step 3: Merge larger subarrays**

- Merge `[2, 5]` and `[1, 3]`:
  - Compare 2 and 1 → 1 is smaller → add 1 to result
  - Compare 2 and 3 → 2 is smaller → add 2 to result
  - Compare 5 and 3 → 3 is smaller → add 3 to result
  - Add remaining 5 → final result is `[1, 2, 3, 5]`

The key insight is that merging two sorted arrays is efficient (O(n)), and by recursively dividing the problem, we achieve O(n log n) time.

## Brute Force Approach

A naive approach would be to implement Bubble Sort or Selection Sort, which repeatedly scan through the array to find the minimum element and swap it into position. While these are simple to implement, they have O(n²) time complexity, which fails the O(n log n) requirement for this problem.

For example, Bubble Sort would work like this on `[5, 2, 3, 1]`:

- First pass: compare and swap adjacent elements → `[2, 5, 3, 1]` → `[2, 3, 5, 1]` → `[2, 3, 1, 5]`
- Second pass: `[2, 3, 1, 5]` → `[2, 1, 3, 5]` → `[2, 1, 3, 5]`
- Third pass: `[1, 2, 3, 5]` → `[1, 2, 3, 5]`

This requires n-1 passes, each taking O(n) time, resulting in O(n²) time complexity. For large arrays (n = 10⁵), this would be far too slow.

## Optimized Approach

We need an algorithm with O(n log n) time complexity. The main candidates are:

1. **Merge Sort**: Divide-and-conquer approach with O(n log n) time and O(n) space
2. **Heap Sort**: Build a max-heap and repeatedly extract maximum, O(n log n) time and O(1) space
3. **Quick Sort**: Partition-based approach with O(n log n) average time but O(n²) worst case

For this problem, Merge Sort is the safest choice because:

- It guarantees O(n log n) time in all cases
- It can be implemented with O(n) auxiliary space
- It's stable (maintains relative order of equal elements)
- It doesn't have the worst-case O(n²) risk of Quick Sort

The key insight is that sorting a large array can be reduced to sorting two smaller arrays and then merging them efficiently. By recursively applying this divide-and-conquer strategy, we achieve logarithmic depth and linear work at each level.

## Optimal Solution

Here's the complete Merge Sort implementation:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def sortArray(nums):
    """
    Main function to sort the array using merge sort.
    """
    # Base case: array of length 0 or 1 is already sorted
    if len(nums) <= 1:
        return nums

    # Step 1: Divide - find the middle index
    mid = len(nums) // 2

    # Step 2: Conquer - recursively sort left and right halves
    left_half = sortArray(nums[:mid])
    right_half = sortArray(nums[mid:])

    # Step 3: Combine - merge the two sorted halves
    return merge(left_half, right_half)

def merge(left, right):
    """
    Merge two sorted arrays into one sorted array.
    """
    result = []
    i = j = 0  # Pointers for left and right arrays

    # Step 1: Compare elements from both arrays and add the smaller one
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Step 2: Add any remaining elements from left array
    while i < len(left):
        result.append(left[i])
        i += 1

    # Step 3: Add any remaining elements from right array
    while j < len(right):
        result.append(right[j])
        j += 1

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function sortArray(nums) {
  /**
   * Main function to sort the array using merge sort.
   */
  // Base case: array of length 0 or 1 is already sorted
  if (nums.length <= 1) {
    return nums;
  }

  // Step 1: Divide - find the middle index
  const mid = Math.floor(nums.length / 2);

  // Step 2: Conquer - recursively sort left and right halves
  const leftHalf = sortArray(nums.slice(0, mid));
  const rightHalf = sortArray(nums.slice(mid));

  // Step 3: Combine - merge the two sorted halves
  return merge(leftHalf, rightHalf);
}

function merge(left, right) {
  /**
   * Merge two sorted arrays into one sorted array.
   */
  const result = [];
  let i = 0,
    j = 0; // Pointers for left and right arrays

  // Step 1: Compare elements from both arrays and add the smaller one
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // Step 2: Add any remaining elements from left array
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  // Step 3: Add any remaining elements from right array
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public int[] sortArray(int[] nums) {
        /**
         * Main function to sort the array using merge sort.
         */
        // Base case: array of length 0 or 1 is already sorted
        if (nums.length <= 1) {
            return nums;
        }

        // Step 1: Divide - find the middle index
        int mid = nums.length / 2;

        // Step 2: Conquer - create and recursively sort left and right halves
        int[] leftHalf = new int[mid];
        int[] rightHalf = new int[nums.length - mid];

        // Copy elements to left half
        for (int i = 0; i < mid; i++) {
            leftHalf[i] = nums[i];
        }

        // Copy elements to right half
        for (int i = mid; i < nums.length; i++) {
            rightHalf[i - mid] = nums[i];
        }

        // Recursively sort both halves
        leftHalf = sortArray(leftHalf);
        rightHalf = sortArray(rightHalf);

        // Step 3: Combine - merge the two sorted halves
        return merge(leftHalf, rightHalf);
    }

    private int[] merge(int[] left, int[] right) {
        /**
         * Merge two sorted arrays into one sorted array.
         */
        int[] result = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;  // Pointers for left, right, and result arrays

        // Step 1: Compare elements from both arrays and add the smaller one
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result[k] = left[i];
                i++;
            } else {
                result[k] = right[j];
                j++;
            }
            k++;
        }

        // Step 2: Add any remaining elements from left array
        while (i < left.length) {
            result[k] = left[i];
            i++;
            k++;
        }

        // Step 3: Add any remaining elements from right array
        while (j < right.length) {
            result[k] = right[j];
            j++;
            k++;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The array is divided in half at each recursive level, creating log₂ n levels
- At each level, we merge all elements (n total operations across all merges at that level)
- Total operations = n × log₂ n = O(n log n)

**Space Complexity: O(n)**

- We need auxiliary arrays to store the merged results
- At any point, we need at most O(n) extra space for the merge operation
- The recursion stack uses O(log n) space, but this is dominated by the O(n) array storage

## Common Mistakes

1. **Forgetting the base case in recursion**: Without `if len(nums) <= 1: return nums`, the recursion would never terminate, causing infinite recursion and stack overflow.

2. **Incorrect midpoint calculation**: Using `mid = len(nums) // 2` ensures integer division. Using float division or incorrect rounding can cause uneven splits or index errors.

3. **Not handling remaining elements in merge**: After the main comparison loop, one array might still have elements left. Forgetting to add these (the second and third while loops) would lose data.

4. **Using O(n²) algorithms by mistake**: Candidates sometimes implement Insertion Sort or Bubble Sort without realizing they don't meet the O(n log n) requirement. Always verify your algorithm's time complexity.

## When You'll See This Pattern

The divide-and-conquer pattern used in Merge Sort appears in many algorithmic problems:

1. **Merge k Sorted Lists (LeetCode 23)**: Similar merging logic but with k lists instead of 2, often solved using a min-heap or divide-and-conquer merging.

2. **Count of Smaller Numbers After Self (LeetCode 315)**: Can be solved with Merge Sort by counting inversions during the merge process.

3. **Sort List (LeetCode 148)**: Requires sorting a linked list in O(n log n) time with O(1) space, often solved with Merge Sort adapted for linked lists.

4. **Reverse Pairs (LeetCode 493)**: Another problem where modified Merge Sort efficiently counts pairs satisfying certain conditions.

## Key Takeaways

1. **Divide-and-conquer is powerful for sorting**: Breaking a problem into smaller subproblems, solving them recursively, and combining results can transform O(n²) problems into O(n log n) solutions.

2. **Merge Sort guarantees O(n log n)**: Unlike Quick Sort, Merge Sort has consistent performance regardless of input distribution, making it a safe choice when worst-case performance matters.

3. **The merge operation is the key insight**: Once you understand how to merge two sorted arrays in O(n) time, the rest of Merge Sort follows naturally from recursive application of this operation.

[Practice this problem on CodeJeet](/problem/sort-an-array)
