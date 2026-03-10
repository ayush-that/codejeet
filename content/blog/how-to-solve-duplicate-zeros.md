---
title: "How to Solve Duplicate Zeros — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Duplicate Zeros. Easy difficulty, 53.4% acceptance rate. Topics: Array, Two Pointers."
date: "2027-04-12"
category: "dsa-patterns"
tags: ["duplicate-zeros", "array", "two-pointers", "easy"]
---

# How to Solve Duplicate Zeros

The problem asks us to modify an array in-place by duplicating every zero we encounter, shifting existing elements to the right. The tricky part is that we must handle this within the fixed length of the original array—any elements that would be pushed beyond the array's bounds are simply discarded. This creates an interesting challenge: we need to know which zeros will actually fit in the final array before we start overwriting elements.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `arr = [1, 0, 2, 3, 0, 4, 5, 0]` with length 8.

**Step 1: Count how many elements will be in the final array**
We need to simulate what would happen if we had infinite space, then work backwards:

- Start with `count = 0` (elements that will be in final array)
- For each element in original array:
  - If element is 0: `count += 2` (zero gets duplicated)
  - Else: `count += 1`
  - Stop when `count >= arr.length`

Let's trace:

- `arr[0] = 1`: count = 1
- `arr[1] = 0`: count = 3 (0 → +2)
- `arr[2] = 2`: count = 4
- `arr[3] = 3`: count = 5
- `arr[4] = 0`: count = 7 (0 → +2)
- `arr[5] = 4`: count = 8 (STOP, we've reached array length)

So elements at indices 0-5 will contribute to the final array. The element at index 5 (4) will be the last element in the final array.

**Step 2: Work backwards to place elements**
We'll use two pointers: `i` tracks our position in the original array (starting at index 5), and `j` tracks our position in the final array (starting at the last index, 7).

We fill from the end backward:

- `arr[5] = 4` (not zero) → place at `arr[7]`
- `arr[4] = 0` (zero) → place TWO zeros at `arr[6]` and `arr[5]`, decrement j by 2
- `arr[3] = 3` (not zero) → place at `arr[4]`
- `arr[2] = 2` (not zero) → place at `arr[3]`
- `arr[1] = 0` (zero) → place TWO zeros at `arr[2]` and `arr[1]`
- `arr[0] = 1` (not zero) → place at `arr[0]`

Final array: `[1, 0, 0, 2, 3, 0, 0, 4]`

## Brute Force Approach

A naive approach would be to iterate through the array from left to right, and whenever we encounter a zero, shift all elements to the right by one position to make room for the duplicate zero. Here's what that looks like:

1. Start at index 0
2. If current element is 0:
   - Shift all elements from current position+1 to the end right by 1
   - Insert a 0 at current position+1
   - Skip the newly inserted zero (move index forward by 2)
3. Otherwise, move to next index

The problem with this approach is its time complexity: O(n²) in the worst case. Consider an array like `[0, 0, 0, 0, 1]` — each zero requires shifting almost the entire array. For an array of length n, we could perform up to n shifts of up to n elements, giving us O(n²) operations.

This is too slow for large arrays (LeetCode tests can include arrays with 10,000+ elements), so we need a more efficient solution.

## Optimal Solution

The key insight is that we can solve this in O(n) time with O(1) space using a two-pass approach:

1. First pass: Count how many zeros will be duplicated and determine which elements will fit in the final array
2. Second pass: Work backwards from the end, placing elements in their correct positions

This approach ensures we never overwrite elements we still need to process.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def duplicateZeros(arr):
    """
    Duplicate each zero in the array, shifting elements to the right.
    Elements beyond the original length are discarded.
    """
    n = len(arr)

    # Step 1: Count how many elements will be in the final array
    # We simulate what would happen with infinite space
    count = 0
    last_index = 0

    # Find the last element that will be included in the final array
    for i in range(n):
        if count >= n:
            break
        if arr[i] == 0:
            count += 2  # Zero gets duplicated
        else:
            count += 1
        last_index = i

    # Step 2: Work backwards from the end
    # j points to the last position in the final array
    j = n - 1
    i = last_index

    # Special case: if the last element we counted was a zero
    # and it would create an extra element beyond array bounds
    # we only write one zero instead of two
    if count > n and arr[i] == 0:
        arr[j] = 0
        j -= 1
        i -= 1

    # Copy elements from i to j, working backwards
    while i >= 0:
        if arr[i] == 0:
            # Duplicate the zero
            arr[j] = 0
            arr[j-1] = 0
            j -= 2
        else:
            # Copy the non-zero element
            arr[j] = arr[i]
            j -= 1
        i -= 1
```

```javascript
// Time: O(n) | Space: O(1)
function duplicateZeros(arr) {
  const n = arr.length;

  // Step 1: Count how many elements will be in the final array
  let count = 0;
  let lastIndex = 0;

  // Find the last element that will be included in the final array
  for (let i = 0; i < n; i++) {
    if (count >= n) break;
    if (arr[i] === 0) {
      count += 2; // Zero gets duplicated
    } else {
      count += 1;
    }
    lastIndex = i;
  }

  // Step 2: Work backwards from the end
  let j = n - 1;
  let i = lastIndex;

  // Special case: if the last element we counted was a zero
  // and it would create an extra element beyond array bounds
  // we only write one zero instead of two
  if (count > n && arr[i] === 0) {
    arr[j] = 0;
    j--;
    i--;
  }

  // Copy elements from i to j, working backwards
  while (i >= 0) {
    if (arr[i] === 0) {
      // Duplicate the zero
      arr[j] = 0;
      arr[j - 1] = 0;
      j -= 2;
    } else {
      // Copy the non-zero element
      arr[j] = arr[i];
      j--;
    }
    i--;
  }
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public void duplicateZeros(int[] arr) {
        int n = arr.length;

        // Step 1: Count how many elements will be in the final array
        int count = 0;
        int lastIndex = 0;

        // Find the last element that will be included in the final array
        for (int i = 0; i < n; i++) {
            if (count >= n) break;
            if (arr[i] == 0) {
                count += 2;  // Zero gets duplicated
            } else {
                count += 1;
            }
            lastIndex = i;
        }

        // Step 2: Work backwards from the end
        int j = n - 1;
        int i = lastIndex;

        // Special case: if the last element we counted was a zero
        // and it would create an extra element beyond array bounds
        // we only write one zero instead of two
        if (count > n && arr[i] == 0) {
            arr[j] = 0;
            j--;
            i--;
        }

        // Copy elements from i to j, working backwards
        while (i >= 0) {
            if (arr[i] == 0) {
                // Duplicate the zero
                arr[j] = 0;
                arr[j - 1] = 0;
                j -= 2;
            } else {
                // Copy the non-zero element
                arr[j] = arr[i];
                j--;
            }
            i--;
        }
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- First pass: We iterate through the array once to count elements → O(n)
- Second pass: We iterate from the last included element back to the beginning → O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a few integer variables (`count`, `last_index`, `i`, `j`)
- No additional data structures are created
- The modification is done in-place as required

## Common Mistakes

1. **Forgetting the edge case where the last zero doesn't fully fit**
   When a zero at the boundary would create two elements but there's only space for one, we need to handle this specially. In our solution, this is the `if (count > n && arr[i] == 0)` check.

2. **Modifying the array while iterating forward**
   If you try to insert zeros while iterating left to right, you'll overwrite elements you haven't processed yet. This is why the two-pass backward approach is essential.

3. **Incorrect index management in the backward pass**
   When duplicating a zero, you need to decrement `j` by 2, not 1. When copying a non-zero, decrement `j` by 1. Mixing these up leads to incorrect placements.

4. **Not stopping the count phase at the right time**
   The loop should stop when `count >= n`, not `count == n`. There's a subtle difference: if we're at exactly `n`, we can include the current element. If we're past `n`, we need to check if the last element was a zero that only partially fits.

## When You'll See This Pattern

The "two-pointer backward traversal" pattern appears in several array modification problems:

1. **Merge Sorted Array (LeetCode 88)**
   Similar backward merging technique: you have two sorted arrays and need to merge them into the first array without extra space. You work backwards to avoid overwriting.

2. **Remove Element (LeetCode 27)**
   When removing elements in-place, you often use two pointers: one to read and one to write, working in the same direction.

3. **Move Zeroes (LeetCode 283)**
   While this uses forward traversal, it's conceptually similar: you're rearranging elements in-place based on a condition (zero vs non-zero).

The core idea is recognizing when you can overwrite elements safely by processing data in a specific order (often backwards) or using multiple passes to gather information before making modifications.

## Key Takeaways

1. **When modifying arrays in-place, consider processing backwards** to avoid overwriting data you still need. This is especially useful when elements need to shift to make room.

2. **Two-pass solutions are often optimal** when you need information about the entire dataset before making decisions. The first pass gathers data (like how many zeros will fit), and the second pass performs the actual modification.

3. **Boundary cases matter** in array problems. Always test with:
   - Arrays that start or end with zeros
   - Arrays where all elements are zeros
   - Arrays with no zeros
   - The maximum length edge case (last zero only partially fits)

[Practice this problem on CodeJeet](/problem/duplicate-zeros)
