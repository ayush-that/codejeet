---
title: "How to Solve Intersection of Multiple Arrays — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Intersection of Multiple Arrays. Easy difficulty, 68.6% acceptance rate. Topics: Array, Hash Table, Sorting, Counting."
date: "2027-01-13"
category: "dsa-patterns"
tags: ["intersection-of-multiple-arrays", "array", "hash-table", "sorting", "easy"]
---

# How to Solve Intersection of Multiple Arrays

You're given a 2D array where each inner array contains distinct positive integers. Your task is to find all numbers that appear in **every single array**, then return them sorted in ascending order. While this problem seems straightforward, the challenge lies in efficiently tracking which numbers appear across all arrays without excessive comparisons. The key insight is that we need to count occurrences across arrays, not just compare two arrays at a time.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `nums = [[3,1,2,4,5], [1,2,3,4], [2,3,4,5,6]]`

We need to find numbers present in all three arrays.

**Step 1:** Look at the first array `[3,1,2,4,5]`. These are our initial candidates.

**Step 2:** Check the second array `[1,2,3,4]`. Only numbers that appear in both arrays survive:

- 3 appears in both ✓
- 1 appears in both ✓
- 2 appears in both ✓
- 4 appears in both ✓
- 5 is not in the second array ✗

Current intersection: `[1,2,3,4]`

**Step 3:** Check the third array `[2,3,4,5,6]`. Filter our current intersection:

- 1 is not in the third array ✗
- 2 appears in the third array ✓
- 3 appears in the third array ✓
- 4 appears in the third array ✓

Final intersection: `[2,3,4]`

**Step 4:** Sort the result in ascending order: `[2,3,4]`

The pattern is clear: we start with all numbers from the first array, then repeatedly filter them by checking subsequent arrays. This gives us an O(n²) approach in the worst case. But we can do better by counting occurrences.

## Brute Force Approach

A naive approach would compare each number in the first array against every other array:

1. Take the first array as the starting set
2. For each subsequent array, create a new set containing only numbers that exist in both the current intersection and the current array
3. Repeat for all arrays
4. Sort the final result

The problem with this approach is its inefficiency. In the worst case where all arrays contain all numbers, we're doing O(k × m × n) comparisons, where k is the number of arrays, m is the length of the first array, and n is the average length of other arrays. While this might pass for small inputs, it's not optimal.

## Optimal Solution

The optimal approach uses a hash map to count occurrences. Since we need numbers that appear in **every** array, we can:

1. Count how many times each number appears across all arrays
2. Numbers with count equal to the number of arrays are in the intersection
3. Sort the result

Why this works: Each array contains distinct numbers, so a number can appear at most once per array. If a number appears in count equal to the total number of arrays, it must be present in every single one.

<div class="code-group">

```python
# Time: O(n) where n is total number of elements across all arrays
# Space: O(m) where m is number of distinct elements
def intersection(nums):
    """
    Find numbers present in every array of nums.

    Args:
        nums: 2D list of distinct positive integers

    Returns:
        List of integers present in all arrays, sorted ascending
    """
    # Step 1: Create a dictionary to count occurrences
    # We'll use a defaultdict so missing keys default to 0
    from collections import defaultdict
    count_map = defaultdict(int)

    # Step 2: Count occurrences of each number across all arrays
    # Each inner array represents one "vote" for the numbers it contains
    for arr in nums:
        # Since numbers are distinct within each array,
        # we can simply increment count for each number
        for num in arr:
            count_map[num] += 1

    # Step 3: Find numbers that appear in ALL arrays
    # A number appears in all arrays if its count equals total number of arrays
    total_arrays = len(nums)
    result = []

    for num, count in count_map.items():
        if count == total_arrays:
            result.append(num)

    # Step 4: Sort the result in ascending order
    result.sort()

    return result
```

```javascript
// Time: O(n) where n is total number of elements across all arrays
// Space: O(m) where m is number of distinct elements
function intersection(nums) {
  /**
   * Find numbers present in every array of nums.
   *
   * @param {number[][]} nums - 2D array of distinct positive integers
   * @return {number[]} Numbers present in all arrays, sorted ascending
   */

  // Step 1: Create a map to count occurrences
  const countMap = new Map();

  // Step 2: Count occurrences of each number across all arrays
  for (const arr of nums) {
    // Since numbers are distinct within each array,
    // we increment count for each number in this array
    for (const num of arr) {
      // Get current count or 0 if not in map yet
      const currentCount = countMap.get(num) || 0;
      countMap.set(num, currentCount + 1);
    }
  }

  // Step 3: Find numbers that appear in ALL arrays
  const totalArrays = nums.length;
  const result = [];

  for (const [num, count] of countMap) {
    if (count === totalArrays) {
      result.push(num);
    }
  }

  // Step 4: Sort the result in ascending order
  result.sort((a, b) => a - b);

  return result;
}
```

```java
// Time: O(n) where n is total number of elements across all arrays
// Space: O(m) where m is number of distinct elements
import java.util.*;

public class Solution {
    public List<Integer> intersection(int[][] nums) {
        /**
         * Find numbers present in every array of nums.
         *
         * @param nums 2D array of distinct positive integers
         * @return List of integers present in all arrays, sorted ascending
         */

        // Step 1: Create a map to count occurrences
        Map<Integer, Integer> countMap = new HashMap<>();

        // Step 2: Count occurrences of each number across all arrays
        for (int[] arr : nums) {
            // Since numbers are distinct within each array,
            // we increment count for each number in this array
            for (int num : arr) {
                // Get current count or 0 if not in map yet
                countMap.put(num, countMap.getOrDefault(num, 0) + 1);
            }
        }

        // Step 3: Find numbers that appear in ALL arrays
        int totalArrays = nums.length;
        List<Integer> result = new ArrayList<>();

        for (Map.Entry<Integer, Integer> entry : countMap.entrySet()) {
            if (entry.getValue() == totalArrays) {
                result.add(entry.getKey());
            }
        }

        // Step 4: Sort the result in ascending order
        Collections.sort(result);

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(N + M log M) where:

- N is the total number of elements across all arrays (we process each element once)
- M is the number of elements in the final intersection (we sort these)

In the worst case where all arrays contain the same numbers, M could be as large as the smallest array. However, since we're told numbers are distinct within each array, M ≤ min(array lengths).

**Space Complexity:** O(K) where K is the number of distinct elements across all arrays. We store each distinct number in our hash map with its count.

The sorting step adds O(M log M) time but M is typically much smaller than N, making the overall approach efficient.

## Common Mistakes

1. **Forgetting to sort the result:** The problem explicitly requires ascending order. Even if you find the correct intersection, returning it unsorted is incorrect. Always read the output requirements carefully.

2. **Assuming arrays have the same length:** The problem states each array is non-empty but doesn't guarantee equal lengths. Your solution should handle arrays of varying sizes.

3. **Using set intersection inefficiently:** Some candidates try to repeatedly intersect sets: `set1 ∩ set2 ∩ set3 ...`. While this works, it's less efficient than counting because each intersection operation creates a new set. The counting approach processes each element exactly once.

4. **Not handling the single array case:** If there's only one array, the intersection should be all elements of that array (sorted). Make sure your solution handles edge cases like `nums = [[1,2,3]]`.

5. **Missing the "distinct" condition:** The problem states numbers are distinct within each array. This is important because it means a number can appear at most once per array, so counting occurrences tells us exactly how many arrays contain that number.

## When You'll See This Pattern

The counting pattern using hash maps appears in many intersection and frequency problems:

1. **Intersection of Two Arrays II (Easy):** Similar concept but numbers can repeat within arrays, so you need to track minimum counts.

2. **Find Smallest Common Element in All Rows (Medium):** Exactly the same pattern - find elements present in every row of a matrix. The optimal solution uses counting.

3. **Majority Element (Easy):** Uses counting to find elements that appear more than n/2 times.

4. **Uncommon Words from Two Sentences (Easy):** Find words that appear exactly once across both sentences - another counting application.

The core insight is that when you need to find elements meeting certain frequency criteria (appearing in all arrays, appearing once, appearing more than n/k times), a frequency counter is often the right tool.

## Key Takeaways

1. **Counting solves intersection problems efficiently:** When you need to find elements common to multiple collections, counting occurrences across all collections is often more efficient than pairwise comparisons.

2. **Hash maps are your friend for frequency problems:** The O(1) average case lookup/insertion makes hash maps ideal for counting patterns. Remember the tradeoff: O(n) space for O(n) time.

3. **Read constraints carefully:** The "distinct within each array" constraint is crucial here. Without it, you'd need a different approach (like tracking minimum counts per array).

4. **Sorting is often the final step:** Many problems require sorted output. Remember that sorting M elements takes O(M log M) time, which is acceptable when M is smaller than your input size.

Related problems: [Intersection of Two Arrays](/problem/intersection-of-two-arrays), [Intersection of Two Arrays II](/problem/intersection-of-two-arrays-ii), [Find Smallest Common Element in All Rows](/problem/find-smallest-common-element-in-all-rows)
