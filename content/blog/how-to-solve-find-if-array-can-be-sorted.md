---
title: "How to Solve Find if Array Can Be Sorted — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find if Array Can Be Sorted. Medium difficulty, 66.4% acceptance rate. Topics: Array, Bit Manipulation, Sorting."
date: "2026-09-13"
category: "dsa-patterns"
tags: ["find-if-array-can-be-sorted", "array", "bit-manipulation", "sorting", "medium"]
---

# How to Solve "Find if Array Can Be Sorted"

This problem asks whether we can sort an array of positive integers by repeatedly swapping adjacent elements that share the same number of set bits (1-bits in their binary representation). The tricky part is recognizing that elements with different bit counts create "barriers" that cannot be crossed, so we need to check if each group of elements with the same bit count is already sorted relative to the overall array order.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 1, 5, 2, 4]`

**Step 1: Calculate bit counts for each element**

- 3 (binary 11) → 2 set bits
- 1 (binary 1) → 1 set bit
- 5 (binary 101) → 2 set bits
- 2 (binary 10) → 1 set bit
- 4 (binary 100) → 1 set bit

**Step 2: Group elements by bit count**

- 1-bit group: [1, 2, 4] (from indices 1, 3, 4)
- 2-bit group: [3, 5] (from indices 0, 2)

**Step 3: Check if groups are sorted in their original positions**
For the 1-bit group, the elements in their original positions are [1, 2, 4]. This is already sorted.
For the 2-bit group, the elements are [3, 5]. This is also sorted.

**Step 4: Verify the overall array can be sorted**
Since each group is internally sorted, we can bubble-sort within each group to move elements to their correct positions. The key insight: elements with different bit counts cannot cross each other, so if each group is sorted, the entire array can be sorted.

Let's see why: In the final sorted array `[1, 2, 3, 4, 5]`, the 1-bit elements (1, 2, 4) appear in positions 0, 1, and 3, which matches their relative order in the original array.

## Brute Force Approach

A naive approach would be to simulate all possible swaps. We could try to implement bubble sort but only allow swaps between adjacent elements with the same bit count. This would involve repeatedly scanning the array and making swaps until either:

1. The array is sorted (return true)
2. No more valid swaps can be made but the array isn't sorted (return false)

The problem with this approach is efficiency. In the worst case (like `[5,4,3,2,1]` where all elements have different bit counts), we'd make O(n²) comparisons only to discover we can't sort it. Even worse, if elements have the same bit count, we might need many passes to bubble elements to their correct positions.

This simulation approach is messy to implement and inefficient. We need a more analytical approach that doesn't require actually performing the swaps.

## Optimized Approach

The key insight is that **elements with different numbers of set bits cannot cross each other** in any sequence of valid swaps. Why? Because we can only swap adjacent elements if they have the same bit count. An element with 2 bits can never swap with an element that has 3 bits, even if there are other elements between them.

This creates a partitioning of the array: elements with the same bit count form contiguous groups in the final sorted array, maintaining their relative order from the original array.

Therefore, the algorithm becomes:

1. Calculate the bit count for each element
2. Extract all elements with the same bit count, in their original order
3. Check if each extracted group is already sorted
4. If all groups are sorted, return true; otherwise false

We don't need to actually move elements around. We just need to verify that within each bit-count group, the elements appear in non-decreasing order.

## Optimal Solution

The most efficient implementation uses a single pass through the array while tracking the previous element for each bit count group.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) - we only store up to 32 previous values (max bits for positive int)
def canSortArray(nums):
    """
    Determine if array can be sorted using adjacent swaps only between
    elements with the same number of set bits.
    """
    # Dictionary to track the last seen element for each bit count
    # Key: bit count, Value: last element seen with that bit count
    last_in_group = {}

    # Track the maximum element seen so far (overall, not per group)
    # This helps us ensure elements are non-decreasing across the array
    prev_max = 0

    for num in nums:
        # Count set bits in current number
        bit_count = bin(num).count('1')

        # Get the last element we saw with this bit count
        # If this is the first element with this bit count, use -inf
        last_val = last_in_group.get(bit_count, float('-inf'))

        # Current element must be >= last element in its bit-count group
        # AND >= the overall maximum element seen so far
        # Why? Because elements can't decrease, and different-bit elements can't cross
        if num < last_val or num < prev_max:
            return False

        # Update the last seen element for this bit count
        last_in_group[bit_count] = num

        # Update overall maximum
        prev_max = max(prev_max, num)

    return True
```

```javascript
// Time: O(n) | Space: O(1) - max 32 entries in map (bits in 32-bit int)
function canSortArray(nums) {
  /**
   * Determine if array can be sorted using adjacent swaps only between
   * elements with the same number of set bits.
   */

  // Map to track last element seen for each bit count
  const lastInGroup = new Map();

  // Track maximum element seen so far (overall)
  let prevMax = 0;

  // Helper function to count set bits
  function countSetBits(num) {
    let count = 0;
    while (num > 0) {
      count += num & 1; // Add 1 if last bit is 1
      num >>= 1; // Shift right to check next bit
    }
    return count;
  }

  for (const num of nums) {
    // Count set bits in current number
    const bitCount = countSetBits(num);

    // Get last element with this bit count, or -Infinity if first
    const lastVal = lastInGroup.has(bitCount) ? lastInGroup.get(bitCount) : -Infinity;

    // Current element must be >= last in its group AND >= overall max
    // This ensures elements are non-decreasing and groups don't interfere
    if (num < lastVal || num < prevMax) {
      return false;
    }

    // Update last seen for this bit count
    lastInGroup.set(bitCount, num);

    // Update overall maximum
    prevMax = Math.max(prevMax, num);
  }

  return true;
}
```

```java
// Time: O(n) | Space: O(1) - HashMap has at most 32 entries
class Solution {
    public boolean canSortArray(int[] nums) {
        /**
         * Determine if array can be sorted using adjacent swaps only between
         * elements with the same number of set bits.
         */

        // HashMap to track last element seen for each bit count
        Map<Integer, Integer> lastInGroup = new HashMap<>();

        // Track maximum element seen so far (overall)
        int prevMax = 0;

        for (int num : nums) {
            // Count set bits in current number
            int bitCount = Integer.bitCount(num);

            // Get last element with this bit count, or minimum value if first
            int lastVal = lastInGroup.getOrDefault(bitCount, Integer.MIN_VALUE);

            // Current element must be >= last in its group AND >= overall max
            // This ensures proper ordering constraints
            if (num < lastVal || num < prevMax) {
                return false;
            }

            // Update last seen for this bit count
            lastInGroup.put(bitCount, num);

            // Update overall maximum
            prevMax = Math.max(prevMax, num);
        }

        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array: O(n)
- For each element, we calculate its bit count: O(1) using built-in functions or bit operations
- HashMap operations (get and put) are O(1) on average

**Space Complexity: O(1)**

- The `lastInGroup` map stores at most 32 entries (for 32-bit integers, the maximum number of set bits is 32)
- We use a few additional variables: O(1)
- This is constant space regardless of input size

## Common Mistakes

1. **Forgetting that elements with different bit counts cannot cross**: Some candidates try to sort the entire array without considering the bit-count constraint. Remember: swaps are only allowed between elements with the same number of set bits.

2. **Only checking within groups, not across groups**: Even if each bit-count group is sorted internally, the overall array might not be sortable if a smaller element from a later group needs to move before a larger element from an earlier group. That's why we need the `prevMax` check.

3. **Inefficient bit counting**: Using string conversion (`bin(num).count('1')`) is fine for interviews, but know that `Integer.bitCount()` in Java and similar built-ins are optimized. For JavaScript, implement a manual count using bit operations.

4. **Off-by-one with indices**: When implementing the group extraction approach (not shown here), candidates might incorrectly handle the boundaries when extracting elements with the same bit count from the original array.

## When You'll See This Pattern

This problem combines **grouping by a property** with **constraint validation**, a pattern seen in:

1. **Sort Integers by The Number of 1 Bits (LeetCode 1356)**: Also involves grouping/sorting by bit count, though with different constraints.

2. **Queue Reconstruction by Height (LeetCode 406)**: Requires arranging elements based on constraints about their relative positions.

3. **Candy (LeetCode 135)**: Involves arranging elements based on comparisons with neighbors, though with different rules.

The core pattern is: when elements have constraints on which positions they can occupy relative to others, check if those constraints create a valid ordering.

## Key Takeaways

1. **Constraints create immovable barriers**: When swaps are only allowed between certain elements, those elements form groups that cannot intermix. Identify what creates these barriers.

2. **Check local and global constraints**: For sortability under constraints, verify both that each group is internally consistent AND that groups are properly ordered relative to each other.

3. **Avoid simulation when analysis suffices**: Instead of simulating all possible swaps, look for invariants or necessary conditions that must hold for a solution to exist.

Related problems: [Sort Integers by The Number of 1 Bits](/problem/sort-integers-by-the-number-of-1-bits)
