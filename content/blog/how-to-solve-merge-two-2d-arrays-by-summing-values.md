---
title: "How to Solve Merge Two 2D Arrays by Summing Values — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Merge Two 2D Arrays by Summing Values. Easy difficulty, 81.7% acceptance rate. Topics: Array, Hash Table, Two Pointers."
date: "2028-08-28"
category: "dsa-patterns"
tags: ["merge-two-2d-arrays-by-summing-values", "array", "hash-table", "two-pointers", "easy"]
---

# How to Solve Merge Two 2D Arrays by Summing Values

You're given two 2D arrays where each element is `[id, value]` pair, and you need to merge them by summing the values for matching IDs while preserving the sorted order of IDs. What makes this problem interesting is that while it's conceptually simple, it tests your ability to choose between multiple valid approaches (hash map vs. two pointers) and implement them cleanly.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
nums1 = [[1,2], [3,5], [4,7]]
nums2 = [[1,3], [2,4], [3,1], [5,6]]
```

**Step-by-step merging:**

1. Compare `nums1[0] = [1,2]` and `nums2[0] = [1,3]`
   - Both have ID 1 → Sum values: 2 + 3 = 5
   - Add `[1,5]` to result
   - Move both pointers forward

2. Compare `nums1[1] = [3,5]` and `nums2[1] = [2,4]`
   - ID 3 > ID 2 → Add `[2,4]` from nums2
   - Move only nums2 pointer forward

3. Compare `nums1[1] = [3,5]` and `nums2[2] = [3,1]`
   - Both have ID 3 → Sum values: 5 + 1 = 6
   - Add `[3,6]` to result
   - Move both pointers forward

4. Compare `nums1[2] = [4,7]` and `nums2[3] = [5,6]`
   - ID 4 < ID 5 → Add `[4,7]` from nums1
   - Move only nums1 pointer forward

5. nums1 exhausted, add remaining `[5,6]` from nums2

**Final result:** `[[1,5], [2,4], [3,6], [4,7], [5,6]]`

Notice how we process IDs in sorted order by always comparing the current smallest available IDs from each array.

## Brute Force Approach

A naive approach would be to combine all pairs into a single list, then group by ID and sum values:

1. Concatenate nums1 and nums2 into one big list
2. Sort by ID (O(n log n) time)
3. Iterate through sorted list, summing consecutive values with same ID

While this works, it's inefficient because:

- We're sorting even though both input arrays are already sorted by ID
- We're using O(n) extra space unnecessarily
- The O(n log n) time complexity is worse than what we can achieve

The key insight is that **both arrays are already sorted by ID**, so we can merge them in linear time without sorting.

## Optimal Solution

We have two optimal approaches, both O(n) time:

### Approach 1: Two Pointers (Most Efficient)

Since both arrays are sorted by ID, we can use two pointers to merge them like merging two sorted arrays, but with the twist of summing values when IDs match.

### Approach 2: Hash Map (Simpler)

Use a dictionary to accumulate sums for each ID, then sort the results. This is simpler to implement but requires sorting at the end.

Here's the two-pointer solution (most efficient):

<div class="code-group">

```python
# Time: O(n + m) where n = len(nums1), m = len(nums2)
# Space: O(1) extra space (excluding output)
def mergeArrays(nums1, nums2):
    """
    Merge two sorted arrays of [id, value] pairs by summing values for matching IDs.

    Args:
        nums1: List of [id, value] pairs, sorted by id
        nums2: List of [id, value] pairs, sorted by id

    Returns:
        Merged list sorted by id with summed values
    """
    result = []
    i, j = 0, 0  # Two pointers for nums1 and nums2

    # Process both arrays while both have elements
    while i < len(nums1) and j < len(nums2):
        id1, val1 = nums1[i]
        id2, val2 = nums2[j]

        if id1 == id2:
            # Same ID: sum values and add to result
            result.append([id1, val1 + val2])
            i += 1
            j += 1
        elif id1 < id2:
            # nums1 has smaller ID: add it as-is
            result.append([id1, val1])
            i += 1
        else:
            # nums2 has smaller ID: add it as-is
            result.append([id2, val2])
            j += 1

    # Add any remaining elements from nums1
    while i < len(nums1):
        result.append(nums1[i])
        i += 1

    # Add any remaining elements from nums2
    while j < len(nums2):
        result.append(nums2[j])
        j += 1

    return result
```

```javascript
// Time: O(n + m) where n = nums1.length, m = nums2.length
// Space: O(1) extra space (excluding output)
function mergeArrays(nums1, nums2) {
  /**
   * Merge two sorted arrays of [id, value] pairs by summing values for matching IDs.
   *
   * @param {number[][]} nums1 - Array of [id, value] pairs, sorted by id
   * @param {number[][]} nums2 - Array of [id, value] pairs, sorted by id
   * @return {number[][]} Merged array sorted by id with summed values
   */
  const result = [];
  let i = 0,
    j = 0; // Two pointers for nums1 and nums2

  // Process both arrays while both have elements
  while (i < nums1.length && j < nums2.length) {
    const [id1, val1] = nums1[i];
    const [id2, val2] = nums2[j];

    if (id1 === id2) {
      // Same ID: sum values and add to result
      result.push([id1, val1 + val2]);
      i++;
      j++;
    } else if (id1 < id2) {
      // nums1 has smaller ID: add it as-is
      result.push([id1, val1]);
      i++;
    } else {
      // nums2 has smaller ID: add it as-is
      result.push([id2, val2]);
      j++;
    }
  }

  // Add any remaining elements from nums1
  while (i < nums1.length) {
    result.push(nums1[i]);
    i++;
  }

  // Add any remaining elements from nums2
  while (j < nums2.length) {
    result.push(nums2[j]);
    j++;
  }

  return result;
}
```

```java
// Time: O(n + m) where n = nums1.length, m = nums2.length
// Space: O(1) extra space (excluding output)
import java.util.ArrayList;
import java.util.List;

class Solution {
    /**
     * Merge two sorted arrays of [id, value] pairs by summing values for matching IDs.
     *
     * @param nums1 Array of [id, value] pairs, sorted by id
     * @param nums2 Array of [id, value] pairs, sorted by id
     * @return Merged list sorted by id with summed values
     */
    public int[][] mergeArrays(int[][] nums1, int[][] nums2) {
        List<int[]> result = new ArrayList<>();
        int i = 0, j = 0;  // Two pointers for nums1 and nums2

        // Process both arrays while both have elements
        while (i < nums1.length && j < nums2.length) {
            int id1 = nums1[i][0];
            int val1 = nums1[i][1];
            int id2 = nums2[j][0];
            int val2 = nums2[j][1];

            if (id1 == id2) {
                // Same ID: sum values and add to result
                result.add(new int[]{id1, val1 + val2});
                i++;
                j++;
            } else if (id1 < id2) {
                // nums1 has smaller ID: add it as-is
                result.add(new int[]{id1, val1});
                i++;
            } else {
                // nums2 has smaller ID: add it as-is
                result.add(new int[]{id2, val2});
                j++;
            }
        }

        // Add any remaining elements from nums1
        while (i < nums1.length) {
            result.add(new int[]{nums1[i][0], nums1[i][1]});
            i++;
        }

        // Add any remaining elements from nums2
        while (j < nums2.length) {
            result.add(new int[]{nums2[j][0], nums2[j][1]});
            j++;
        }

        // Convert List to array for return type
        return result.toArray(new int[result.size()][2]);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- We process each element from nums1 and nums2 exactly once
- The two-pointer approach visits each element in both arrays once
- Even in the worst case (no overlapping IDs), we make n + m comparisons

**Space Complexity: O(n + m) for the output**

- We need to store all merged pairs in the result
- The two-pointer approach uses O(1) extra space (just pointers)
- The hash map approach would use O(n + m) extra space for the map

The two-pointer solution is optimal because:

1. It leverages the fact that inputs are already sorted
2. It processes elements in a single pass
3. It doesn't require additional data structures beyond the output

## Common Mistakes

1. **Forgetting that arrays are already sorted**
   - Some candidates sort the result or use TreeMap unnecessarily
   - Always check if input has useful properties before implementing

2. **Incorrect pointer movement in two-pointer approach**
   - Moving both pointers when IDs don't match
   - Forgetting to move any pointer when adding an element
   - **Fix:** Only move the pointer for the array you just processed

3. **Not handling remaining elements**
   - After the main loop, one array might still have elements
   - **Fix:** Add two while loops to process leftovers from both arrays

4. **Confusing value addition with array concatenation**
   - Using `append()` or `push()` instead of summing values
   - **Fix:** Remember to add values when IDs match: `val1 + val2`

5. **Assuming IDs are always positive or within a certain range**
   - The problem doesn't specify ID constraints
   - **Fix:** Don't make assumptions about ID values

## When You'll See This Pattern

The two-pointer merge pattern appears in many problems where you need to combine sorted data:

1. **Merge Two Sorted Lists (Easy)** - Same pattern but with linked lists
   - Merge two sorted linked lists into one sorted list
   - Uses the same comparison and pointer movement logic

2. **Intersection of Two Arrays (Easy)** - Similar pointer logic
   - Find common elements in two sorted arrays
   - Move pointers based on element comparisons

3. **Meeting Scheduler (Medium)** - More complex two-pointer application
   - Find overlapping time slots between two people's calendars
   - Similar comparison logic but with time intervals

4. **Merge k Sorted Lists (Hard)** - Extension to multiple lists
   - Generalizes the two-pointer approach to k pointers using a heap

The core pattern: **When you have multiple sorted sequences and need to process them in order, two pointers let you do it in linear time.**

## Key Takeaways

1. **Always check if inputs are sorted** - This often enables more efficient solutions
2. **Two pointers are perfect for merging sorted arrays** - Compare current elements, process the smaller one, move its pointer
3. **Hash maps simplify value aggregation** - Even if not optimal, they're often acceptable and easier to implement correctly

The beauty of this problem is that it tests a fundamental pattern (merging sorted sequences) that appears in countless interview questions. Mastering this pattern will help you solve many array and list manipulation problems efficiently.

**Related problems:** [Merge Two Sorted Lists](/problem/merge-two-sorted-lists), [Meeting Scheduler](/problem/meeting-scheduler), [Merge Similar Items](/problem/merge-similar-items)
