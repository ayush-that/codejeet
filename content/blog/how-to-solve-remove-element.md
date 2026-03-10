---
title: "How to Solve Remove Element — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Remove Element. Easy difficulty, 61.4% acceptance rate. Topics: Array, Two Pointers."
date: "2026-02-20"
category: "dsa-patterns"
tags: ["remove-element", "array", "two-pointers", "easy"]
---

# How to Solve Remove Element

You're given an array `nums` and a value `val`. Your task is to remove all occurrences of `val` from the array **in-place**, meaning you can't create a new array to store the result. The order of the remaining elements can be changed. After removing the elements, return the count of elements that aren't equal to `val`.

What makes this problem interesting is the **in-place constraint** combined with the flexibility to change element order. This allows for an elegant two-pointer solution that runs in O(n) time with O(1) extra space. The challenge is managing the pointers correctly to avoid overwriting elements you need to keep.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 2, 2, 3]`, `val = 3`

We'll use two pointers:

- `k` (write pointer): tracks where to place the next valid element
- `i` (read pointer): scans through the array

**Step 1:** i = 0, k = 0

- nums[0] = 3, which equals val
- Skip it (don't write it)
- Array: [3, 2, 2, 3], k = 0

**Step 2:** i = 1, k = 0

- nums[1] = 2, which ≠ val
- Write nums[1] to nums[k] (nums[0] = 2)
- Increment k to 1
- Array: [2, 2, 2, 3], k = 1

**Step 3:** i = 2, k = 1

- nums[2] = 2, which ≠ val
- Write nums[2] to nums[k] (nums[1] = 2)
- Increment k to 2
- Array: [2, 2, 2, 3], k = 2

**Step 4:** i = 3, k = 2

- nums[3] = 3, which equals val
- Skip it
- Array: [2, 2, 2, 3], k = 2

**Result:** k = 2, which is the count of elements not equal to val. The first k elements [2, 2] are the valid elements.

## Brute Force Approach

A naive approach would be to create a new array, copy all elements except those equal to `val`, then copy them back to the original array. However, this violates the **in-place requirement** and uses O(n) extra space.

Another brute force approach would be to repeatedly find `val` in the array and shift all subsequent elements left by one position. For each occurrence of `val`, this would take O(n) time to shift, resulting in O(n²) total time for an array filled with `val`.

```python
# Brute force - shifting approach (inefficient)
def removeElement(nums, val):
    n = len(nums)
    i = 0
    while i < n:
        if nums[i] == val:
            # Shift all elements after i left by one
            for j in range(i, n-1):
                nums[j] = nums[j+1]
            n -= 1  # Reduce the effective size
        else:
            i += 1  # Only move forward if we didn't find val
    return n
```

This approach is O(n²) in the worst case (when all elements equal `val`) because for each removal, we shift up to n elements. The space is O(1) but the time complexity is unacceptable for large arrays.

## Optimal Solution

The optimal solution uses a two-pointer technique. Since we can change the order of elements, we can maintain a "write" pointer that tracks where to place the next valid element, and a "read" pointer that scans through the array. When the read pointer finds an element not equal to `val`, we copy it to the write position and advance both pointers. Otherwise, we just advance the read pointer.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def removeElement(nums, val):
    """
    Removes all occurrences of val from nums in-place.
    Returns the count of elements not equal to val.
    """
    # k is the write pointer - tracks where to place next valid element
    k = 0

    # i is the read pointer - scans through the entire array
    for i in range(len(nums)):
        # If current element is not equal to val, it's a keeper
        if nums[i] != val:
            # Write the valid element to position k
            nums[k] = nums[i]
            # Move write pointer forward for next valid element
            k += 1

    # k now represents the count of valid elements
    return k
```

```javascript
// Time: O(n) | Space: O(1)
function removeElement(nums, val) {
  /**
   * Removes all occurrences of val from nums in-place.
   * Returns the count of elements not equal to val.
   */
  // k is the write pointer - tracks where to place next valid element
  let k = 0;

  // i is the read pointer - scans through the entire array
  for (let i = 0; i < nums.length; i++) {
    // If current element is not equal to val, it's a keeper
    if (nums[i] !== val) {
      // Write the valid element to position k
      nums[k] = nums[i];
      // Move write pointer forward for next valid element
      k++;
    }
  }

  // k now represents the count of valid elements
  return k;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int removeElement(int[] nums, int val) {
        /**
         * Removes all occurrences of val from nums in-place.
         * Returns the count of elements not equal to val.
         */
        // k is the write pointer - tracks where to place next valid element
        int k = 0;

        // i is the read pointer - scans through the entire array
        for (int i = 0; i < nums.length; i++) {
            // If current element is not equal to val, it's a keeper
            if (nums[i] != val) {
                // Write the valid element to position k
                nums[k] = nums[i];
                // Move write pointer forward for next valid element
                k++;
            }
        }

        // k now represents the count of valid elements
        return k;
    }
}
```

</div>

**Alternative two-pointer approach (when val is rare):** When the element to remove is rare, we can optimize by swapping with the last element. This reduces the number of writes.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
# Optimized for cases where val is rare
def removeElement(nums, val):
    """
    Alternative approach that swaps elements when val is found.
    More efficient when val appears rarely in the array.
    """
    i = 0
    n = len(nums)

    while i < n:
        if nums[i] == val:
            # Swap current element with last element
            nums[i] = nums[n - 1]
            # Reduce array size (effectively removing last element)
            n -= 1
        else:
            # Only increment i if we didn't find val
            i += 1

    return n
```

```javascript
// Time: O(n) | Space: O(1)
// Optimized for cases where val is rare
function removeElement(nums, val) {
  /**
   * Alternative approach that swaps elements when val is found.
   * More efficient when val appears rarely in the array.
   */
  let i = 0;
  let n = nums.length;

  while (i < n) {
    if (nums[i] === val) {
      // Swap current element with last element
      nums[i] = nums[n - 1];
      // Reduce array size (effectively removing last element)
      n--;
    } else {
      // Only increment i if we didn't find val
      i++;
    }
  }

  return n;
}
```

```java
// Time: O(n) | Space: O(1)
// Optimized for cases where val is rare
class Solution {
    public int removeElement(int[] nums, int val) {
        /**
         * Alternative approach that swaps elements when val is found.
         * More efficient when val appears rarely in the array.
         */
        int i = 0;
        int n = nums.length;

        while (i < n) {
            if (nums[i] == val) {
                // Swap current element with last element
                nums[i] = nums[n - 1];
                // Reduce array size (effectively removing last element)
                n--;
            } else {
                // Only increment i if we didn't find val
                i++;
            }
        }

        return n;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the array once with the read pointer `i`
- Each element is examined exactly once
- In the worst case (no elements equal `val`), we perform n writes
- In the best case (all elements equal `val`), we perform 0 writes

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the pointers
- All modifications are done in-place on the input array
- No additional data structures are created

The alternative swap approach also has O(n) time complexity but may perform fewer write operations when `val` is rare in the array.

## Common Mistakes

1. **Forgetting the in-place requirement**: Some candidates try to create a new array and return it. Remember, you must modify the input array directly.

2. **Off-by-one errors with pointers**: When using two pointers, it's easy to get confused about when to increment each pointer. Remember: increment the write pointer only when you write a valid element; increment the read pointer on every iteration.

3. **Not handling empty arrays**: Always check edge cases. For an empty array, the function should return 0.

4. **Assuming elements after k need to be cleared**: The problem doesn't require you to set the remaining elements to any specific value. Only the first k elements need to be valid.

5. **Using the wrong comparison operator**: In JavaScript, using `==` instead of `===` can lead to unexpected type coercion. Always use strict equality (`===`) for value comparison.

## When You'll See This Pattern

The two-pointer technique used here is fundamental and appears in many array manipulation problems:

1. **Remove Duplicates from Sorted Array (LeetCode 26)**: Similar two-pointer approach where you compare adjacent elements instead of comparing to a fixed value.

2. **Move Zeroes (LeetCode 283)**: Essentially the same problem with `val = 0`, but often requires maintaining relative order (which adds a slight twist).

3. **Remove Linked List Elements (LeetCode 203)**: The same concept applied to linked lists instead of arrays.

4. **Sort Colors (LeetCode 75)**: Uses a similar three-pointer approach to partition an array into sections.

The pattern is: when you need to filter or partition an array in-place, consider using read/write pointers to track positions for different categories of elements.

## Key Takeaways

1. **Two-pointer technique is powerful for in-place array modifications**: When you need to filter elements without extra space, maintain a write pointer for where to place valid elements and a read pointer to scan through the array.

2. **Order flexibility can simplify solutions**: This problem allows changing element order, which makes the two-pointer solution straightforward. If order must be preserved (like in Move Zeroes), you need a slightly different approach.

3. **The return value often serves dual purpose**: In this problem, `k` both counts the valid elements and marks the boundary between valid and "don't care" elements in the array.

4. **Consider alternative approaches for different distributions**: The swap approach is better when the element to remove is rare, while the copy-forward approach is better when it's common.

Related problems: [Remove Duplicates from Sorted Array](/problem/remove-duplicates-from-sorted-array), [Remove Linked List Elements](/problem/remove-linked-list-elements), [Move Zeroes](/problem/move-zeroes)
