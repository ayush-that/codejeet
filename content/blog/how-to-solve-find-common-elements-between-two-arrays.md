---
title: "How to Solve Find Common Elements Between Two Arrays — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Common Elements Between Two Arrays. Easy difficulty, 84.4% acceptance rate. Topics: Array, Hash Table."
date: "2027-05-28"
category: "dsa-patterns"
tags: ["find-common-elements-between-two-arrays", "array", "hash-table", "easy"]
---

# How to Solve Find Common Elements Between Two Arrays

This problem asks us to count how many elements from each array appear in the other array. While it sounds simple, the key insight is that we need to count **occurrences** of elements, not just unique elements. For example, if `nums1 = [1, 1, 2]` and `nums2 = [1]`, then `answer1` should be 2 (both 1's in nums1 exist in nums2), not 1. This distinction between counting elements versus checking uniqueness is what makes this problem interesting.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `nums1 = [4, 3, 2, 3, 1]`, `nums2 = [2, 2, 5, 2, 3, 6]`

**Step 1:** First, we need to understand what exists in each array. Let's create frequency counts:

- `nums1` elements: 4 appears once, 3 appears twice, 2 appears once, 1 appears once
- `nums2` elements: 2 appears three times, 5 appears once, 3 appears once, 6 appears once

**Step 2:** Calculate `answer1` (how many elements in `nums1` exist in `nums2`):

- Check each element in `nums1`:
  - 4 → not in `nums2` → doesn't count
  - 3 → in `nums2` → counts once
  - 2 → in `nums2` → counts once
  - 3 → in `nums2` → counts once (second occurrence)
  - 1 → not in `nums2` → doesn't count
  - Total: 3 elements from `nums1` exist in `nums2`

**Step 3:** Calculate `answer2` (how many elements in `nums2` exist in `nums1`):

- Check each element in `nums2`:
  - 2 → in `nums1` → counts once
  - 2 → in `nums1` → counts once (second occurrence)
  - 5 → not in `nums1` → doesn't count
  - 2 → in `nums1` → counts once (third occurrence)
  - 3 → in `nums1` → counts once
  - 6 → not in `nums1` → doesn't count
  - Total: 4 elements from `nums2` exist in `nums1`

**Output:** `[3, 4]`

The key realization: we need **fast lookup** to check if an element exists in the other array, and we need to count **all occurrences**, not just unique elements.

## Brute Force Approach

The most straightforward approach is to check each element in `nums1` against every element in `nums2`, and vice versa:

1. Initialize `answer1 = 0` and `answer2 = 0`
2. For each element in `nums1`, check if it exists in `nums2` by scanning through all elements of `nums2`
3. For each element in `nums2`, check if it exists in `nums1` by scanning through all elements of `nums1`

**Why this is inefficient:**

- Time complexity: O(n × m) where n = size of nums1, m = size of nums2
- For each of n elements in nums1, we scan through m elements of nums2 → O(n × m)
- For each of m elements in nums2, we scan through n elements of nums1 → O(m × n)
- Total: O(2 × n × m) = O(n × m)

With arrays of size 10,000 each, that's 100,000,000 operations, which is too slow. We need a faster way to check if an element exists.

## Optimal Solution

The optimal solution uses hash sets for O(1) lookups. Here's the approach:

1. Convert `nums2` to a set for fast existence checks when counting `answer1`
2. Convert `nums1` to a set for fast existence checks when counting `answer2`
3. Count `answer1` by checking each element in `nums1` against the `nums2` set
4. Count `answer2` by checking each element in `nums2` against the `nums1` set

<div class="code-group">

```python
# Time: O(n + m) | Space: O(n + m)
def findIntersectionValues(nums1, nums2):
    """
    Calculate how many elements from each array exist in the other array.

    Args:
        nums1: List[int] - first array of integers
        nums2: List[int] - second array of integers

    Returns:
        List[int] - [answer1, answer2] where:
            answer1: count of elements in nums1 that exist in nums2
            answer2: count of elements in nums2 that exist in nums1
    """
    # Step 1: Convert nums2 to a set for O(1) lookups
    # This allows us to quickly check if an element from nums1 exists in nums2
    set2 = set(nums2)

    # Step 2: Convert nums1 to a set for O(1) lookups
    # This allows us to quickly check if an element from nums2 exists in nums1
    set1 = set(nums1)

    # Step 3: Initialize counters for both answers
    answer1 = 0
    answer2 = 0

    # Step 4: Count how many elements in nums1 exist in nums2
    # We iterate through nums1 and check if each element is in set2
    for num in nums1:
        if num in set2:
            answer1 += 1

    # Step 5: Count how many elements in nums2 exist in nums1
    # We iterate through nums2 and check if each element is in set1
    for num in nums2:
        if num in set1:
            answer2 += 1

    # Step 6: Return both counts as a list
    return [answer1, answer2]
```

```javascript
// Time: O(n + m) | Space: O(n + m)
function findIntersectionValues(nums1, nums2) {
  /**
   * Calculate how many elements from each array exist in the other array.
   *
   * @param {number[]} nums1 - first array of integers
   * @param {number[]} nums2 - second array of integers
   * @return {number[]} - [answer1, answer2] where:
   *     answer1: count of elements in nums1 that exist in nums2
   *     answer2: count of elements in nums2 that exist in nums1
   */

  // Step 1: Convert nums2 to a Set for O(1) lookups
  // JavaScript Sets provide fast existence checks
  const set2 = new Set(nums2);

  // Step 2: Convert nums1 to a Set for O(1) lookups
  const set1 = new Set(nums1);

  // Step 3: Initialize counters
  let answer1 = 0;
  let answer2 = 0;

  // Step 4: Count elements in nums1 that exist in nums2
  // Iterate through nums1 and check membership in set2
  for (const num of nums1) {
    if (set2.has(num)) {
      answer1++;
    }
  }

  // Step 5: Count elements in nums2 that exist in nums1
  // Iterate through nums2 and check membership in set1
  for (const num of nums2) {
    if (set1.has(num)) {
      answer2++;
    }
  }

  // Step 6: Return both counts as an array
  return [answer1, answer2];
}
```

```java
// Time: O(n + m) | Space: O(n + m)
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int[] findIntersectionValues(int[] nums1, int[] nums2) {
        /**
         * Calculate how many elements from each array exist in the other array.
         *
         * @param nums1 - first array of integers
         * @param nums2 - second array of integers
         * @return int[] - [answer1, answer2] where:
         *     answer1: count of elements in nums1 that exist in nums2
         *     answer2: count of elements in nums2 that exist in nums1
         */

        // Step 1: Convert nums2 to a HashSet for O(1) lookups
        // HashSet provides constant-time contains() operations
        Set<Integer> set2 = new HashSet<>();
        for (int num : nums2) {
            set2.add(num);
        }

        // Step 2: Convert nums1 to a HashSet for O(1) lookups
        Set<Integer> set1 = new HashSet<>();
        for (int num : nums1) {
            set1.add(num);
        }

        // Step 3: Initialize counters
        int answer1 = 0;
        int answer2 = 0;

        // Step 4: Count elements in nums1 that exist in nums2
        // Check each element in nums1 against set2
        for (int num : nums1) {
            if (set2.contains(num)) {
                answer1++;
            }
        }

        // Step 5: Count elements in nums2 that exist in nums1
        // Check each element in nums2 against set1
        for (int num : nums2) {
            if (set1.contains(num)) {
                answer2++;
            }
        }

        // Step 6: Return both counts as an array
        return new int[]{answer1, answer2};
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Creating `set2` from `nums2`: O(m) operations
- Creating `set1` from `nums1`: O(n) operations
- Counting `answer1`: O(n) operations (each lookup is O(1))
- Counting `answer2`: O(m) operations (each lookup is O(1))
- Total: O(n + m + n + m) = O(2(n + m)) = O(n + m)

**Space Complexity: O(n + m)**

- `set2` stores up to m unique elements: O(m) space
- `set1` stores up to n unique elements: O(n) space
- Total: O(n + m) space

This is optimal because we need to at least examine each element once (Ω(n + m) time) and we need some data structure to track what we've seen.

## Common Mistakes

1. **Counting unique elements instead of all occurrences**: Some candidates convert both arrays to sets and count the intersection size. This gives the wrong answer for arrays with duplicates. Remember: we need to count how many _positions_ in nums1 have values that exist in nums2, not how many _unique values_ exist in both.

2. **Using only one set**: Some candidates create a set from only one array and try to compute both answers from it. This doesn't work because we need fast lookups in both directions. We need `set2` to check if nums1 elements exist in nums2, and `set1` to check if nums2 elements exist in nums1.

3. **Forgetting to handle empty arrays**: While the problem constraints guarantee non-empty arrays, in real interviews you should mention edge cases. If either array is empty, the corresponding answer would be 0.

4. **Inefficient double conversion**: Some candidates convert the entire array to a set for each lookup (e.g., `if num in set(nums2)` inside the loop). This is O(n × m) because converting to a set is O(m) and we do it n times. Always convert to sets once before the loops.

## When You'll See This Pattern

This "convert to set for fast lookups" pattern appears in many problems where you need to check existence efficiently:

1. **Two Sum (LeetCode 1)**: Use a hash map to store seen values for O(1) lookups when finding complement pairs.

2. **Intersection of Two Arrays (LeetCode 349)**: Similar to this problem but returns unique common elements. Uses sets for deduplication and fast lookups.

3. **Contains Duplicate (LeetCode 217)**: Use a set to track seen elements and detect duplicates in O(n) time instead of O(n²).

4. **Longest Consecutive Sequence (LeetCode 128)**: Convert array to a set for O(1) lookups, then find sequences by checking for consecutive numbers.

The core pattern: when you need to check "does this exist in that collection?" and brute force would be O(n²), consider converting to a hash-based structure (set or map) for O(1) lookups.

## Key Takeaways

1. **Hash sets transform O(n) lookups into O(1)**: Whenever you need to repeatedly check if elements exist in a collection, converting that collection to a hash set first is often the key optimization.

2. **Count occurrences, not just existence**: Pay attention to whether the problem asks for counting all occurrences (like this one) or just checking existence/unique elements. The data structure choice might be the same, but how you use it differs.

3. **Two-way lookups need two data structures**: When you need to check membership in both directions between two collections, you typically need to convert both to fast-lookup structures.

[Practice this problem on CodeJeet](/problem/find-common-elements-between-two-arrays)
