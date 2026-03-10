---
title: "How to Solve Sort Colors — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sort Colors. Medium difficulty, 69.2% acceptance rate. Topics: Array, Two Pointers, Sorting."
date: "2026-03-15"
category: "dsa-patterns"
tags: ["sort-colors", "array", "two-pointers", "sorting", "medium"]
---

# How to Solve Sort Colors (Dutch National Flag Problem)

Sort Colors is a classic two-pointer problem that asks you to sort an array containing only 0s, 1s, and 2s in-place. What makes this problem interesting is that while you could use a standard sorting algorithm, the optimal solution uses a single pass with three pointers—a technique known as the Dutch National Flag algorithm. This problem tests your ability to manipulate multiple pointers simultaneously while maintaining proper invariants.

## Visual Walkthrough

Let's trace through the algorithm with example input `[2, 0, 2, 1, 1, 0]`. We'll use three pointers:

- `low` points to the boundary of 0s (everything before `low` is 0)
- `mid` is our current index being examined
- `high` points to the boundary of 2s (everything after `high` is 2)

**Initial state:** `low = 0`, `mid = 0`, `high = 5`
Array: `[2, 0, 2, 1, 1, 0]`

**Step 1:** `nums[mid] = 2` → swap with `nums[high]`, decrement `high`
Array: `[0, 0, 2, 1, 1, 2]` (high = 4)

**Step 2:** `nums[mid] = 0` → swap with `nums[low]`, increment both `low` and `mid`
Array: `[0, 0, 2, 1, 1, 2]` (low = 1, mid = 1)

**Step 3:** `nums[mid] = 0` → swap with `nums[low]`, increment both `low` and `mid`
Array: `[0, 0, 2, 1, 1, 2]` (low = 2, mid = 2)

**Step 4:** `nums[mid] = 2` → swap with `nums[high]`, decrement `high`
Array: `[0, 0, 1, 1, 2, 2]` (high = 3)

**Step 5:** `nums[mid] = 1` → just increment `mid`
Array unchanged (mid = 3)

**Step 6:** `nums[mid] = 1` → just increment `mid`
Array unchanged (mid = 4)

Now `mid > high`, so we stop. The array is sorted: `[0, 0, 1, 1, 2, 2]`.

## Brute Force Approach

The most straightforward approach would be to count how many 0s, 1s, and 2s are in the array, then overwrite the array with the correct number of each. While this approach works and has O(n) time complexity, it requires two passes through the array—one to count and one to write.

An even simpler brute force would be to use a standard sorting algorithm like quicksort or mergesort, which would give us O(n log n) time complexity. However, the problem specifically asks for an in-place solution, and we can do better given that we only have three distinct values.

The counting approach code would look like this:

```python
def sortColors(nums):
    count = [0, 0, 0]
    for num in nums:
        count[num] += 1

    index = 0
    for i in range(3):
        for _ in range(count[i]):
            nums[index] = i
            index += 1
```

While this works, it's not optimal for an interview setting because:

1. It requires two passes through the array
2. It doesn't demonstrate the two-pointer technique that interviewers want to see
3. It uses extra space for the count array (though only O(1) space)

## Optimized Approach

The key insight is that we can sort the array in a single pass using three pointers. This is known as the Dutch National Flag algorithm, named after the three-colored flag of the Netherlands. The algorithm maintains three invariants:

1. All elements before `low` are 0s
2. All elements after `high` are 2s
3. All elements between `low` and `mid` are 1s (except those being processed)

The algorithm works by examining each element with the `mid` pointer:

- If `nums[mid] == 0`, swap it with `nums[low]` and increment both `low` and `mid`
- If `nums[mid] == 1`, just increment `mid` (it's already in the correct region)
- If `nums[mid] == 2`, swap it with `nums[high]` and decrement `high` (but don't increment `mid` because the new element at `mid` hasn't been examined yet)

This approach ensures that 0s move to the front, 2s move to the back, and 1s naturally end up in the middle—all in a single pass.

## Optimal Solution

Here's the complete implementation of the Dutch National Flag algorithm:

<div class="code-group">

```python
# Time: O(n) - single pass through the array
# Space: O(1) - only using three pointers
def sortColors(nums):
    """
    Sort an array of 0s, 1s, and 2s in-place using the Dutch National Flag algorithm.

    Args:
        nums: List[int] - array containing only 0, 1, or 2

    Returns:
        None - modifies nums in-place
    """
    # Initialize three pointers:
    # low - boundary for 0s (everything before low is 0)
    # mid - current element being examined
    # high - boundary for 2s (everything after high is 2)
    low, mid, high = 0, 0, len(nums) - 1

    # Continue until mid passes high
    while mid <= high:
        if nums[mid] == 0:
            # Current element is 0, swap it to the low region
            nums[low], nums[mid] = nums[mid], nums[low]
            # Increment both pointers since low now contains a 0
            # and mid now contains an element from low's position
            low += 1
            mid += 1
        elif nums[mid] == 1:
            # Current element is 1, it's already in the correct region
            # Just move to the next element
            mid += 1
        else:  # nums[mid] == 2
            # Current element is 2, swap it to the high region
            nums[mid], nums[high] = nums[high], nums[mid]
            # Decrement high since we've placed a 2 at the end
            # Don't increment mid because we need to examine the
            # element that was swapped from high to mid
            high -= 1
```

```javascript
// Time: O(n) - single pass through the array
// Space: O(1) - only using three pointers
function sortColors(nums) {
  /**
   * Sort an array of 0s, 1s, and 2s in-place using the Dutch National Flag algorithm.
   *
   * @param {number[]} nums - array containing only 0, 1, or 2
   * @return {void} - modifies nums in-place
   */

  // Initialize three pointers:
  // low - boundary for 0s (everything before low is 0)
  // mid - current element being examined
  // high - boundary for 2s (everything after high is 2)
  let low = 0,
    mid = 0,
    high = nums.length - 1;

  // Continue until mid passes high
  while (mid <= high) {
    if (nums[mid] === 0) {
      // Current element is 0, swap it to the low region
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      // Increment both pointers since low now contains a 0
      // and mid now contains an element from low's position
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      // Current element is 1, it's already in the correct region
      // Just move to the next element
      mid++;
    } else {
      // nums[mid] === 2
      // Current element is 2, swap it to the high region
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      // Decrement high since we've placed a 2 at the end
      // Don't increment mid because we need to examine the
      // element that was swapped from high to mid
      high--;
    }
  }
}
```

```java
// Time: O(n) - single pass through the array
// Space: O(1) - only using three pointers
class Solution {
    public void sortColors(int[] nums) {
        /**
         * Sort an array of 0s, 1s, and 2s in-place using the Dutch National Flag algorithm.
         *
         * @param nums - array containing only 0, 1, or 2
         */

        // Initialize three pointers:
        // low - boundary for 0s (everything before low is 0)
        // mid - current element being examined
        // high - boundary for 2s (everything after high is 2)
        int low = 0, mid = 0, high = nums.length - 1;

        // Continue until mid passes high
        while (mid <= high) {
            if (nums[mid] == 0) {
                // Current element is 0, swap it to the low region
                swap(nums, low, mid);
                // Increment both pointers since low now contains a 0
                // and mid now contains an element from low's position
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                // Current element is 1, it's already in the correct region
                // Just move to the next element
                mid++;
            } else { // nums[mid] == 2
                // Current element is 2, swap it to the high region
                swap(nums, mid, high);
                // Decrement high since we've placed a 2 at the end
                // Don't increment mid because we need to examine the
                // element that was swapped from high to mid
                high--;
            }
        }
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We make a single pass through the array with the `mid` pointer. Each element is examined at most once, and each operation (swap or pointer increment) is O(1).

**Space Complexity:** O(1)  
We only use three integer pointers (`low`, `mid`, `high`) and a constant amount of additional space for temporary variables during swaps. The algorithm modifies the array in-place without allocating any additional data structures.

## Common Mistakes

1. **Incrementing `mid` when swapping with `high`**: This is the most common error. When you swap `nums[mid]` with `nums[high]` and the element at `high` is 2, you need to examine the new element at `mid` (which came from `high`) before moving on. Only increment `mid` when you're sure the element at `mid` is correctly placed (0 or 1).

2. **Wrong loop condition**: Using `mid < len(nums)` instead of `mid <= high`. The algorithm should stop when `mid` passes `high`, not when it reaches the end of the array. Elements after `high` are already correctly placed as 2s.

3. **Forgetting edge cases**:
   - Empty array: The algorithm handles this because `high` would be -1, so the while loop doesn't execute.
   - Array with only one color: The algorithm still works correctly as swaps only happen when needed.
   - Already sorted array: The algorithm makes unnecessary swaps (0 with itself, 2 with itself) but still produces correct output.

4. **Using two passes when one suffices**: Some candidates count occurrences first, then overwrite the array. While this is O(n), it's not the optimal single-pass solution interviewers expect for this problem.

## When You'll See This Pattern

The Dutch National Flag pattern appears in problems where you need to partition an array into three sections based on some criteria. It's essentially a three-way partitioning algorithm. You'll see this pattern in:

1. **Partitioning problems**: Any problem that asks you to separate elements into three groups. For example, moving all zeros to the end while maintaining relative order of non-zero elements (though that's usually a two-pointer problem).

2. **Quickselect and Quicksort variants**: The three-way partitioning is useful when there are many duplicate elements, as it groups all equal elements together.

3. **Array reordering problems**: Problems where you need to reorder elements based on some property without using extra space.

Specific related LeetCode problems:

- **Move Zeroes (Easy)**: Similar two-pointer technique but for two partitions instead of three.
- **Remove Element (Easy)**: Uses similar pointer manipulation to filter elements in-place.
- **Partition Labels (Medium)**: Requires tracking boundaries for different groups.

## Key Takeaways

1. **The Dutch National Flag algorithm** is the optimal solution for sorting or partitioning an array with three distinct values in a single pass with O(1) space.

2. **Three-pointer technique**: When you need to partition into three sections, consider using `low`, `mid`, and `high` pointers with specific invariants for each section.

3. **Careful pointer updates**: The key to getting this algorithm right is understanding when to increment `mid`. Only increment it when you're confident the element at that position is correctly placed (0 or 1), not when it's 2 (because you swapped in an unexamined element).

Related problems: [Sort List](/problem/sort-list), [Wiggle Sort](/problem/wiggle-sort), [Wiggle Sort II](/problem/wiggle-sort-ii)
