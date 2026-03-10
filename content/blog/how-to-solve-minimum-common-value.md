---
title: "How to Solve Minimum Common Value — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Common Value. Easy difficulty, 58.0% acceptance rate. Topics: Array, Hash Table, Two Pointers, Binary Search."
date: "2027-12-21"
category: "dsa-patterns"
tags: ["minimum-common-value", "array", "hash-table", "two-pointers", "easy"]
---

# How to Solve Minimum Common Value

You're given two sorted arrays and need to find the smallest number that appears in both. While this sounds simple, the challenge lies in doing it efficiently. The fact that both arrays are sorted is your biggest hint—it means you can avoid checking every possible combination and find the answer much faster.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `nums1 = [1, 2, 3, 6]`, `nums2 = [2, 3, 4, 5]`

We need the smallest number that appears in both arrays. Since both are sorted, we can use two pointers:

1. Start with `i = 0` (pointing to `nums1[0] = 1`) and `j = 0` (pointing to `nums2[0] = 2`)
2. Compare `1` vs `2`: `1 < 2`, so move `i` forward (we know `1` can't be in `nums2` since `nums2` starts at `2`)
3. Now `i = 1` (`nums1[1] = 2`), `j = 0` (`nums2[0] = 2`)
4. Compare `2` vs `2`: They're equal! This is our first common value, and since arrays are sorted, it must be the minimum common value
5. Return `2`

What if the first match isn't the smallest? Let's try: `nums1 = [1, 5, 6]`, `nums2 = [2, 3, 5, 7]`

1. `i = 0` (`1`), `j = 0` (`2`): `1 < 2`, move `i`
2. `i = 1` (`5`), `j = 0` (`2`): `5 > 2`, move `j`
3. `i = 1` (`5`), `j = 1` (`3`): `5 > 3`, move `j`
4. `i = 1` (`5`), `j = 2` (`5`): Equal! Return `5`

The key insight: because both arrays are sorted, when we find a match, we know it's the smallest possible match at that point. Any smaller number would have been found earlier.

## Brute Force Approach

The most straightforward approach is to check every number in `nums1` against every number in `nums2`:

1. For each number in `nums1`
2. For each number in `nums2`
3. If they're equal, track the minimum

This brute force solution has O(n×m) time complexity where n and m are the array lengths. For arrays of length 10,000 each, that's 100 million operations—far too slow.

Even if we try to optimize by stopping early when we find a match in `nums2`, we still need to check all smaller numbers in `nums1` first to ensure we find the minimum. The sorted nature of the arrays gives us a much better approach.

## Optimal Solution

The optimal solution uses two pointers, taking advantage of the fact that both arrays are sorted. We start at the beginning of both arrays and move forward strategically:

- If `nums1[i] < nums2[j]`, move `i` forward (the current number in `nums1` is too small)
- If `nums1[i] > nums2[j]`, move `j` forward (the current number in `nums2` is too small)
- If they're equal, we found our answer (and it's guaranteed to be the minimum)

This works because when we move a pointer forward, we're essentially saying "all numbers before this pointer in the other array are either smaller (already checked) or can't match the current number."

<div class="code-group">

```python
# Time: O(n + m) | Space: O(1)
def getCommon(nums1, nums2):
    """
    Find the minimum common value between two sorted arrays.

    Args:
        nums1: First sorted array in non-decreasing order
        nums2: Second sorted array in non-decreasing order

    Returns:
        The minimum integer common to both arrays, or -1 if none exists
    """
    # Initialize two pointers at the start of both arrays
    i, j = 0, 0

    # Continue while both pointers are within bounds
    while i < len(nums1) and j < len(nums2):
        # If current elements are equal, we found the minimum common value
        if nums1[i] == nums2[j]:
            return nums1[i]

        # If nums1[i] is smaller, move i forward to try larger values
        elif nums1[i] < nums2[j]:
            i += 1

        # If nums2[j] is smaller, move j forward to try larger values
        else:
            j += 1

    # If we exit the loop, no common value was found
    return -1
```

```javascript
// Time: O(n + m) | Space: O(1)
function getCommon(nums1, nums2) {
  /**
   * Find the minimum common value between two sorted arrays.
   *
   * @param {number[]} nums1 - First sorted array in non-decreasing order
   * @param {number[]} nums2 - Second sorted array in non-decreasing order
   * @return {number} The minimum integer common to both arrays, or -1 if none exists
   */
  // Initialize two pointers at the start of both arrays
  let i = 0,
    j = 0;

  // Continue while both pointers are within bounds
  while (i < nums1.length && j < nums2.length) {
    // If current elements are equal, we found the minimum common value
    if (nums1[i] === nums2[j]) {
      return nums1[i];
    }

    // If nums1[i] is smaller, move i forward to try larger values
    else if (nums1[i] < nums2[j]) {
      i++;
    }

    // If nums2[j] is smaller, move j forward to try larger values
    else {
      j++;
    }
  }

  // If we exit the loop, no common value was found
  return -1;
}
```

```java
// Time: O(n + m) | Space: O(1)
class Solution {
    public int getCommon(int[] nums1, int[] nums2) {
        /**
         * Find the minimum common value between two sorted arrays.
         *
         * @param nums1 First sorted array in non-decreasing order
         * @param nums2 Second sorted array in non-decreasing order
         * @return The minimum integer common to both arrays, or -1 if none exists
         */
        // Initialize two pointers at the start of both arrays
        int i = 0, j = 0;

        // Continue while both pointers are within bounds
        while (i < nums1.length && j < nums2.length) {
            // If current elements are equal, we found the minimum common value
            if (nums1[i] == nums2[j]) {
                return nums1[i];
            }

            // If nums1[i] is smaller, move i forward to try larger values
            else if (nums1[i] < nums2[j]) {
                i++;
            }

            // If nums2[j] is smaller, move j forward to try larger values
            else {
                j++;
            }
        }

        // If we exit the loop, no common value was found
        return -1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- In the worst case, we might traverse both arrays completely without finding a match
- Each iteration of the while loop moves at least one pointer forward
- Maximum possible iterations is (n + m - 1), which simplifies to O(n + m)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for the two pointers
- No additional data structures are created

## Common Mistakes

1. **Forgetting to check array bounds:** The most common error is accessing `nums1[i]` or `nums2[j]` after incrementing without checking if `i < len(nums1)` or `j < len(nums2)`. Always put the bounds check in the while condition.

2. **Using nested loops instead of two pointers:** Many candidates start with nested loops (O(n×m)) even though the arrays are sorted. Remember: sorted arrays often mean you can use two pointers to achieve linear time.

3. **Not returning immediately when finding a match:** Some candidates continue searching after finding a match to "make sure it's the minimum." But because arrays are sorted and we're moving from smallest to largest, the first match is guaranteed to be the minimum common value.

4. **Incorrect pointer movement logic:** Swapping the conditions (moving `i` when `nums1[i] > nums2[j]`) will cause infinite loops or missed matches. Remember: move the pointer pointing to the smaller value.

## When You'll See This Pattern

The two-pointer technique on sorted arrays appears in many problems:

1. **Merge Two Sorted Lists (Easy)** - Similar pointer movement to merge arrays
2. **Intersection of Two Arrays (Easy)** - Finding all common elements between arrays
3. **3Sum (Medium)** - Uses two pointers on sorted array to find triplets summing to zero
4. **Container With Most Water (Medium)** - Two pointers moving inward from both ends

The pattern is recognizable when you have sorted data and need to find pairs, intersections, or merge results. The key insight is that sorting allows you to make intelligent decisions about which elements to consider next.

## Key Takeaways

1. **Sorted arrays enable two-pointer solutions:** When both inputs are sorted, you can often solve problems in O(n + m) time instead of O(n × m) by using two pointers to traverse both arrays simultaneously.

2. **The first match is the minimum:** In sorted arrays, when searching for the minimum common value, the first equality you encounter while moving from smallest to largest is guaranteed to be the answer.

3. **Pointer movement depends on comparison:** Always move the pointer pointing to the smaller value forward, since that value can't match any future values in the other array (which are all larger or equal).

Related problems: [Intersection of Two Arrays](/problem/intersection-of-two-arrays), [Intersection of Two Arrays II](/problem/intersection-of-two-arrays-ii)
