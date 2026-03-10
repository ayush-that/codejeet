---
title: "How to Solve Rank Transform of an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Rank Transform of an Array. Easy difficulty, 70.8% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2027-12-05"
category: "dsa-patterns"
tags: ["rank-transform-of-an-array", "array", "hash-table", "sorting", "easy"]
---

# How to Solve Rank Transform of an Array

The problem asks us to replace each element in an array with its rank, where rank starts at 1, larger elements get larger ranks, and equal elements share the same rank. What makes this interesting is that we need to preserve the original array's order while assigning ranks based on sorted values. The challenge lies in efficiently mapping each value to its rank without modifying the original order.

## Visual Walkthrough

Let's trace through an example: `arr = [40, 10, 20, 30, 20]`

**Step 1: Sort unique values**
First, we need to understand what ranks we'll assign. We sort the unique values:

- Original: `[40, 10, 20, 30, 20]`
- Unique sorted values: `[10, 20, 30, 40]`

**Step 2: Assign ranks to values**
Now we assign ranks starting from 1:

- 10 → rank 1
- 20 → rank 2
- 30 → rank 3
- 40 → rank 4

**Step 3: Map original elements to ranks**
We go back to the original array and replace each element with its rank:

- 40 → rank 4
- 10 → rank 1
- 20 → rank 2
- 30 → rank 3
- 20 → rank 2

**Result:** `[4, 1, 2, 3, 2]`

Notice how both 20s got rank 2, and the original order `[40, 10, 20, 30, 20]` is preserved in the ranks `[4, 1, 2, 3, 2]`.

## Brute Force Approach

A naive approach would be: for each element, count how many distinct smaller values exist, then add 1. Here's how that would work:

For each element `arr[i]`:

1. Create a set of all unique values smaller than `arr[i]`
2. The rank is `len(smaller_values_set) + 1`

This approach has several problems:

- Time complexity is O(n²) because for each of n elements, we potentially scan all n elements
- We repeatedly process the same comparisons
- We need to handle duplicates carefully

While this brute force method would produce correct results, it's too slow for larger arrays (n > 10,000). The key insight is that we can sort once, create a mapping from values to ranks, then apply that mapping to the original array.

## Optimal Solution

The optimal solution uses sorting and a hash map (dictionary) to create a value-to-rank mapping:

1. **Get sorted unique values**: Create a sorted list of unique elements from the array
2. **Create rank mapping**: Assign rank 1 to the smallest unique value, rank 2 to the next, etc.
3. **Transform original array**: Replace each element in the original array with its rank from the mapping

This approach works because:

- Sorting gives us the relative order of values
- Using unique values ensures equal elements get the same rank
- The hash map provides O(1) lookup for converting values to ranks

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def arrayRankTransform(arr):
    """
    Replace each element in arr with its rank.

    Steps:
    1. Create a sorted list of unique values
    2. Map each unique value to its rank (starting from 1)
    3. Replace each element in original array with its rank

    Args:
        arr: List[int] - input array

    Returns:
        List[int] - array with ranks instead of original values
    """
    # Step 1: Get sorted unique values
    # Using sorted(set(arr)) gives us unique values in ascending order
    sorted_unique = sorted(set(arr))

    # Step 2: Create value-to-rank mapping
    # Dictionary where key = original value, value = rank
    rank_map = {}

    # Assign ranks starting from 1
    # enumerate gives us (index, value) pairs, but we want rank = index + 1
    for rank, value in enumerate(sorted_unique, start=1):
        rank_map[value] = rank

    # Step 3: Transform original array using the mapping
    # List comprehension: for each value in arr, get its rank from rank_map
    return [rank_map[value] for value in arr]
```

```javascript
// Time: O(n log n) | Space: O(n)
function arrayRankTransform(arr) {
  /**
   * Replace each element in arr with its rank.
   *
   * Steps:
   * 1. Create a sorted array of unique values
   * 2. Map each unique value to its rank (starting from 1)
   * 3. Replace each element in original array with its rank
   *
   * @param {number[]} arr - input array
   * @return {number[]} - array with ranks instead of original values
   */

  // Step 1: Get sorted unique values
  // Using Set to get unique values, then sort them
  const sortedUnique = [...new Set(arr)].sort((a, b) => a - b);

  // Step 2: Create value-to-rank mapping
  // Object where key = original value, value = rank
  const rankMap = {};

  // Assign ranks starting from 1
  // forEach with index gives us value and position
  sortedUnique.forEach((value, index) => {
    // index is 0-based, rank is 1-based
    rankMap[value] = index + 1;
  });

  // Step 3: Transform original array using the mapping
  // Map each value to its rank from rankMap
  return arr.map((value) => rankMap[value]);
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int[] arrayRankTransform(int[] arr) {
        /**
         * Replace each element in arr with its rank.
         *
         * Steps:
         * 1. Create a sorted array of unique values
         * 2. Map each unique value to its rank (starting from 1)
         * 3. Replace each element in original array with its rank
         *
         * @param arr - input array
         * @return - array with ranks instead of original values
         */

        // Edge case: empty array
        if (arr.length == 0) {
            return new int[0];
        }

        // Step 1: Get sorted unique values
        // Copy array to avoid modifying original
        int[] sortedArr = arr.clone();
        Arrays.sort(sortedArr);

        // Create mapping from value to rank
        Map<Integer, Integer> rankMap = new HashMap<>();

        // Step 2: Assign ranks to unique values
        int rank = 1;
        for (int i = 0; i < sortedArr.length; i++) {
            // Only assign rank if we haven't seen this value before
            // This handles duplicates - they get the same rank
            if (!rankMap.containsKey(sortedArr[i])) {
                rankMap.put(sortedArr[i], rank);
                rank++;
            }
        }

        // Step 3: Transform original array
        int[] result = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            result[i] = rankMap.get(arr[i]);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting the unique values takes O(n log n) time
- Creating the hash map takes O(n) time (iterating through sorted unique values)
- Transforming the original array takes O(n) time
- Dominated by the sorting step: O(n log n)

**Space Complexity: O(n)**

- Storing the sorted unique values: O(n) in worst case (all values unique)
- The hash map: O(n) to store value-to-rank mappings
- The result array: O(n)
- Total: O(3n) = O(n)

The space complexity could be optimized to O(n) total by being more careful, but we typically don't count the output array in space complexity for transformation problems. Even if we do, it's still O(n).

## Common Mistakes

1. **Forgetting to handle duplicates**: If you don't use unique values when creating the rank mapping, duplicate values will get different ranks. Always use `set()` in Python, `Set` in JavaScript, or check `containsKey()` in Java.

2. **Starting ranks from 0 instead of 1**: The problem explicitly states ranks start from 1. Remember to add 1 to your 0-based indices when assigning ranks.

3. **Modifying the original array in place**: While not strictly wrong, it's better practice to return a new array unless the problem specifies otherwise. This avoids side effects.

4. **Using the wrong sort order**: We need ascending order (smallest to largest) so the smallest value gets rank 1. In JavaScript, remember to provide a compare function: `.sort((a, b) => a - b)`.

5. **Not handling empty arrays**: While the problem doesn't specify edge cases, good practice is to handle empty input by returning an empty array.

## When You'll See This Pattern

This "sort and map" pattern appears in many ranking and ordering problems:

1. **Relative Ranks (LeetCode 506)**: Similar concept but with "Gold Medal", "Silver Medal", "Bronze Medal" for top 3 ranks. The core technique of sorting and mapping values to ranks is identical.

2. **How Many Numbers Are Smaller Than the Current Number (LeetCode 1365)**: Instead of ranks, you count how many numbers are smaller than each element. The solution involves sorting and creating a count mapping.

3. **Sort Characters By Frequency (LeetCode 451)**: While not exactly the same, it uses the pattern of counting frequencies, sorting by frequency, then reconstructing the string.

The key insight is recognizing when you need to transform elements based on their relative order or frequency. If you need to assign positions, ranks, or counts based on value comparisons, consider sorting first to establish order, then mapping back to original positions.

## Key Takeaways

1. **Sorting establishes relative order**: When you need to assign ranks or positions based on value, sorting gives you the natural order. The rank is simply the position in the sorted list (plus 1 for 1-based indexing).

2. **Hash maps bridge between values and metadata**: Once you have ranks assigned to values, a hash map lets you quickly look up the rank for each original element without searching.

3. **Preserve original structure when needed**: We kept the original array intact and only used it for the final mapping. This pattern of "analyze, then transform" is common: first analyze the data (sorting, counting), then apply the analysis to the original structure.

Related problems: [Rank Transform of a Matrix](/problem/rank-transform-of-a-matrix), [Find Target Indices After Sorting Array](/problem/find-target-indices-after-sorting-array)
