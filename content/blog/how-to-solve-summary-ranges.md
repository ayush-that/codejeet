---
title: "How to Solve Summary Ranges — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Summary Ranges. Easy difficulty, 53.9% acceptance rate. Topics: Array."
date: "2026-11-04"
category: "dsa-patterns"
tags: ["summary-ranges", "array", "easy"]
---

# How to Solve Summary Ranges

You're given a sorted array of unique integers and need to return the smallest sorted list of ranges that covers all numbers exactly. The challenge lies in efficiently identifying consecutive sequences while handling edge cases like single-element ranges and empty arrays. This problem tests your ability to traverse arrays while tracking state—a fundamental skill for many array manipulation problems.

## Visual Walkthrough

Let's trace through the example `nums = [0,1,2,4,5,7]`:

1. **Start at index 0**: `nums[0] = 0`. This begins our first range.
2. **Check consecutive numbers**:
   - `0` and `1` are consecutive (difference of 1) → continue
   - `1` and `2` are consecutive → continue
   - `2` and `4` are NOT consecutive (difference of 2) → break the range
3. **First range complete**: From `0` to `2` → format as `"0->2"`
4. **Start new range at index 3**: `nums[3] = 4`
5. **Check consecutive numbers**:
   - `4` and `5` are consecutive → continue
   - `5` and `7` are NOT consecutive → break the range
6. **Second range complete**: From `4` to `5` → format as `"4->5"`
7. **Start new range at index 5**: `nums[5] = 7`
8. **No more elements**: This is a single-element range → format as `"7"`
9. **Final result**: `["0->2", "4->5", "7"]`

The key insight is that we need to identify when the consecutive sequence breaks and format ranges appropriately.

## Brute Force Approach

A naive approach might try to check every possible range combination, but that's unnecessary since the array is sorted. A more plausible but inefficient brute force would be:

For each starting element, scan forward until you find a non-consecutive element. While this approach would technically work, it's not truly "brute force" in the sense of trying all combinations—it's actually close to optimal. The real issue candidates face isn't algorithmic complexity but implementation correctness.

What makes this problem tricky is handling:

- Single-element ranges (should be `"a"` not `"a->a"`)
- Empty input array
- Large arrays where you need to build the result efficiently
- Properly updating indices after completing a range

## Optimal Solution

The optimal solution uses a single pass through the array with two pointers. We maintain a `start` pointer for the beginning of each range and iterate through the array. When we find a break in the consecutive sequence, we format the range from `start` to the current position and update `start` to begin a new range.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output, O(n) including output
def summaryRanges(nums):
    """
    Convert sorted unique integers into minimal range representation.

    Args:
        nums: List[int] - sorted array of unique integers

    Returns:
        List[str] - list of formatted ranges
    """
    # Handle empty input immediately
    if not nums:
        return []

    result = []
    n = len(nums)
    i = 0  # Start pointer for current range

    while i < n:
        # Mark the start of a new range
        start = nums[i]

        # Continue while the next number is consecutive
        while i + 1 < n and nums[i + 1] == nums[i] + 1:
            i += 1

        # Format the range based on whether it's single or multiple elements
        if start == nums[i]:
            # Single element range
            result.append(str(start))
        else:
            # Multiple element range
            result.append(f"{start}->{nums[i]}")

        # Move to next potential range
        i += 1

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output, O(n) including output
function summaryRanges(nums) {
  /**
   * Convert sorted unique integers into minimal range representation.
   *
   * @param {number[]} nums - sorted array of unique integers
   * @return {string[]} - list of formatted ranges
   */

  // Handle empty input immediately
  if (nums.length === 0) {
    return [];
  }

  const result = [];
  const n = nums.length;
  let i = 0; // Start pointer for current range

  while (i < n) {
    // Mark the start of a new range
    const start = nums[i];

    // Continue while the next number is consecutive
    while (i + 1 < n && nums[i + 1] === nums[i] + 1) {
      i++;
    }

    // Format the range based on whether it's single or multiple elements
    if (start === nums[i]) {
      // Single element range
      result.push(start.toString());
    } else {
      // Multiple element range
      result.push(`${start}->${nums[i]}`);
    }

    // Move to next potential range
    i++;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output, O(n) including output
import java.util.ArrayList;
import java.util.List;

public class Solution {
    public List<String> summaryRanges(int[] nums) {
        /**
         * Convert sorted unique integers into minimal range representation.
         *
         * @param nums - sorted array of unique integers
         * @return List<String> - list of formatted ranges
         */

        List<String> result = new ArrayList<>();

        // Handle empty input immediately
        if (nums.length == 0) {
            return result;
        }

        int n = nums.length;
        int i = 0;  // Start pointer for current range

        while (i < n) {
            // Mark the start of a new range
            int start = nums[i];

            // Continue while the next number is consecutive
            while (i + 1 < n && nums[i + 1] == nums[i] + 1) {
                i++;
            }

            // Format the range based on whether it's single or multiple elements
            if (start == nums[i]) {
                // Single element range
                result.add(String.valueOf(start));
            } else {
                // Multiple element range
                result.add(start + "->" + nums[i]);
            }

            // Move to next potential range
            i++;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We traverse the array exactly once with the outer `while` loop
- The inner `while` loop doesn't add extra complexity because each element is visited at most twice (once when it's the start of a range check, once when checking consecutiveness)
- In total, we perform O(n) comparisons and iterations

**Space Complexity: O(1) excluding output, O(n) including output**

- We use only a few integer variables for pointers (O(1) extra space)
- The result list stores up to n strings in the worst case (when every element is isolated)
- In practice, the output size is typically much smaller than n

## Common Mistakes

1. **Off-by-one errors in the inner loop**: Forgetting to check `i + 1 < n` before accessing `nums[i + 1]` will cause index out of bounds errors. Always verify array bounds when looking ahead.

2. **Incorrect range formatting for single elements**: Writing `"a->a"` instead of just `"a"` for isolated numbers. The problem specifies ranges should be minimal, so single elements don't need arrow notation.

3. **Not handling empty input**: Forgetting to check if `nums` is empty at the beginning can lead to errors when trying to access `nums[0]`. Always handle edge cases first.

4. **Infinite loops from incorrect pointer updates**: Forgetting to increment `i` at the end of the outer loop will cause infinite loops. The pointer must advance whether we found a range or a single element.

5. **Using string concatenation inefficiently**: In Java, using `+` in a loop creates new string objects. While not critical for this problem, it's good practice to use `StringBuilder` for more complex string building.

## When You'll See This Pattern

This "two-pointer range detection" pattern appears in many array processing problems:

1. **Missing Ranges (LeetCode 163)**: Similar concept but finding gaps between numbers instead of consecutive sequences. You use the same pointer movement logic but format the missing ranges.

2. **Data Stream as Disjoint Intervals (LeetCode 352)**: Maintains ranges dynamically as new numbers arrive. The core challenge is efficiently merging overlapping/consecutive ranges.

3. **Merge Intervals (LeetCode 56)**: While not exactly the same, it involves similar range manipulation logic—identifying when intervals overlap and merging them.

4. **Find Maximal Uncovered Ranges (LeetCode 1898)**: Another variation where you need to identify ranges not covered by given intervals.

The pattern is: **when you need to process sorted sequences and identify contiguous segments, use a pointer to track segment starts and iterate to find segment ends.**

## Key Takeaways

1. **Sorted arrays enable single-pass solutions**: When input is sorted, you can often solve problems with O(n) time by processing elements in order and maintaining state.

2. **Two-pointer technique for range detection**: Use one pointer to mark the start of a range and another (or the same pointer moving) to find the end. This is more efficient than checking every possible range combination.

3. **Edge cases matter**: Always test with empty arrays, single-element arrays, arrays with all consecutive numbers, and arrays with no consecutive numbers. These reveal common implementation bugs.

4. **Formatting requirements are part of the problem**: Pay attention to output format specifications. In this case, single elements should not use arrow notation.

Related problems: [Missing Ranges](/problem/missing-ranges), [Data Stream as Disjoint Intervals](/problem/data-stream-as-disjoint-intervals), [Find Maximal Uncovered Ranges](/problem/find-maximal-uncovered-ranges)
