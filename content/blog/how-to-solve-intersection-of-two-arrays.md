---
title: "How to Solve Intersection of Two Arrays — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Intersection of Two Arrays. Easy difficulty, 77.5% acceptance rate. Topics: Array, Hash Table, Two Pointers, Binary Search, Sorting."
date: "2026-06-11"
category: "dsa-patterns"
tags: ["intersection-of-two-arrays", "array", "hash-table", "two-pointers", "easy"]
---

# How to Solve Intersection of Two Arrays

Given two integer arrays `nums1` and `nums2`, you need to find their intersection — the set of elements that appear in both arrays. The result must contain only unique elements (no duplicates) and can be returned in any order. While this is labeled as an "Easy" problem, it's interesting because it has multiple valid approaches, each with different trade-offs in time and space complexity. The key challenge is efficiently handling duplicates while maintaining readability.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we have:

- `nums1 = [4, 9, 5, 4]`
- `nums2 = [9, 4, 9, 8, 4]`

We want to find elements that appear in both arrays. Notice that both arrays contain duplicates: `nums1` has `4` twice, and `nums2` has both `4` and `9` multiple times. However, our result should only contain each intersecting element once.

**Step-by-step thinking:**

1. Look at `nums1`: elements are `4`, `9`, `5`, and `4` (again)
2. Look at `nums2`: elements are `9`, `4`, `9`, `8`, `4`
3. Common elements: `4` appears in both arrays, `9` appears in both arrays
4. `5` only appears in `nums1`, `8` only appears in `nums2`
5. Result should be `[4, 9]` (or `[9, 4]` — order doesn't matter)

The simplest mental approach is: "For each unique element in the first array, check if it exists in the second array." This naturally leads us to using sets to handle uniqueness efficiently.

## Brute Force Approach

A naive approach would be to check every element in `nums1` against every element in `nums2`:

1. Initialize an empty result list
2. For each element in `nums1`:
   - Check if it exists in `nums2` (by scanning through `nums2`)
   - Also check if we haven't already added it to our result (to avoid duplicates)
3. Return the result

This approach has O(m × n) time complexity where m and n are the array lengths. For each of m elements in `nums1`, we scan through all n elements of `nums2`, giving us m × n operations. We also need to check if an element is already in our result, which could add additional overhead.

The brute force is inefficient because:

- It doesn't handle duplicates well (requires extra checks)
- It performs unnecessary repeated comparisons
- For large arrays (say 10,000 elements each), we'd need 100 million operations

While we could slightly optimize by sorting first or using early exits, the fundamental inefficiency remains. Let's move to better approaches.

## Optimal Solution

We have several optimal approaches, each with different trade-offs:

### Approach 1: Using Sets (Most Common)

Convert both arrays to sets, then find their intersection. Sets automatically handle uniqueness and provide O(1) lookups.

### Approach 2: Sorting + Two Pointers

Sort both arrays, then use two pointers to find common elements while skipping duplicates.

### Approach 3: Hash Map Counting

Use a hash map to count occurrences in one array, then check against the second array.

The set approach is usually the most intuitive and readable for interviews. Here's the implementation:

<div class="code-group">

```python
# Time: O(m + n) | Space: O(m + n)
def intersection(nums1, nums2):
    """
    Find the intersection of two arrays using sets.

    Args:
        nums1: First integer array
        nums2: Second integer array

    Returns:
        List of unique elements present in both arrays
    """
    # Step 1: Convert both arrays to sets
    # This removes duplicates and enables O(1) lookups
    set1 = set(nums1)
    set2 = set(nums2)

    # Step 2: Find intersection using set operation
    # The & operator returns elements common to both sets
    result_set = set1 & set2

    # Step 3: Convert back to list for return type
    return list(result_set)
```

```javascript
// Time: O(m + n) | Space: O(m + n)
function intersection(nums1, nums2) {
  /**
   * Find the intersection of two arrays using sets.
   *
   * @param {number[]} nums1 - First integer array
   * @param {number[]} nums2 - Second integer array
   * @return {number[]} Array of unique elements present in both arrays
   */
  // Step 1: Convert both arrays to sets
  // This removes duplicates and enables O(1) lookups
  const set1 = new Set(nums1);
  const set2 = new Set(nums2);

  // Step 2: Find intersection by filtering set1
  // We check which elements from set1 also exist in set2
  const result = [];
  for (const num of set1) {
    if (set2.has(num)) {
      result.push(num);
    }
  }

  // Step 3: Return the result array
  return result;
}
```

```java
// Time: O(m + n) | Space: O(m + n)
import java.util.*;

public class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        /**
         * Find the intersection of two arrays using sets.
         *
         * @param nums1 First integer array
         * @param nums2 Second integer array
         * @return Array of unique elements present in both arrays
         */
        // Step 1: Convert first array to set
        // HashSet provides O(1) lookups and removes duplicates
        Set<Integer> set1 = new HashSet<>();
        for (int num : nums1) {
            set1.add(num);
        }

        // Step 2: Convert second array to set
        Set<Integer> set2 = new HashSet<>();
        for (int num : nums2) {
            set2.add(num);
        }

        // Step 3: Find intersection by retaining only common elements
        set1.retainAll(set2);

        // Step 4: Convert set to array for return
        int[] result = new int[set1.size()];
        int i = 0;
        for (int num : set1) {
            result[i++] = num;
        }

        return result;
    }
}
```

</div>

### Alternative: Sorting + Two Pointers Approach

If we have memory constraints or want to avoid hash sets, we can sort and use two pointers:

<div class="code-group">

```python
# Time: O(m log m + n log n) | Space: O(1) excluding output
def intersection_sorted(nums1, nums2):
    """
    Find intersection using sorting and two pointers.
    Useful when memory is constrained.
    """
    # Step 1: Sort both arrays
    nums1.sort()
    nums2.sort()

    i, j = 0, 0
    result = []

    # Step 2: Use two pointers to find common elements
    while i < len(nums1) and j < len(nums2):
        if nums1[i] < nums2[j]:
            i += 1
        elif nums1[i] > nums2[j]:
            j += 1
        else:
            # Found common element
            result.append(nums1[i])

            # Skip duplicates in both arrays
            while i + 1 < len(nums1) and nums1[i] == nums1[i + 1]:
                i += 1
            while j + 1 < len(nums2) and nums2[j] == nums2[j + 1]:
                j += 1

            i += 1
            j += 1

    return result
```

</div>

## Complexity Analysis

**Set Approach:**

- **Time Complexity:** O(m + n) where m and n are the lengths of the arrays. Converting each array to a set takes O(m) and O(n) respectively. The intersection operation is O(min(m, n)) in practice.
- **Space Complexity:** O(m + n) for storing the two sets. In the worst case, if all elements are unique, we store all elements from both arrays.

**Sorting + Two Pointers Approach:**

- **Time Complexity:** O(m log m + n log n) for sorting plus O(m + n) for the two-pointer traversal. The sorting dominates.
- **Space Complexity:** O(1) extra space (excluding the output and input arrays), or O(log m + log n) for the sorting algorithm's stack space in some languages.

The set approach is generally preferred in interviews because:

1. It's more readable and less error-prone
2. For typical constraints, O(m + n) is better than O(m log m + n log n)
3. It clearly demonstrates understanding of hash sets and their properties

## Common Mistakes

1. **Not handling duplicates in the result:** Candidates sometimes add elements to the result without checking if they're already present. Remember: "Each element in the result must be unique."
   - **Fix:** Use a set for the result or ensure you skip duplicates during processing.

2. **Using inefficient data structures:** Some candidates use lists for lookups, which gives O(n) time per lookup instead of O(1).
   - **Fix:** Always use sets or hash maps for membership testing when you need O(1) lookups.

3. **Forgetting edge cases:**
   - Empty arrays: Should return an empty list
   - No intersection: Should return an empty list
   - All elements the same: Should return that single element
   - **Fix:** Test with [ ], [1,2,3], [4,5,6], [1,1,2,2], etc.

4. **Incorrectly using set operations:** In Python, `set1.intersection(set2)` works, but in Java, you need `set1.retainAll(set2)`, and in JavaScript, there's no built-in intersection method.
   - **Fix:** Know your language's set API or implement intersection manually by iterating.

## When You'll See This Pattern

The "find common elements" pattern appears in many variations:

1. **Intersection of Two Arrays II (LeetCode 350):** Similar but requires counting duplicates (how many times each element appears in both arrays). Solution uses hash maps to count frequencies.

2. **Find the Difference of Two Arrays (LeetCode 2215):** Find elements present in one array but not the other. Uses similar set operations but with difference instead of intersection.

3. **Intersection of Three Sorted Arrays (LeetCode 1213):** Extension to three arrays. Can be solved with three pointers or by chaining intersections.

4. **Common Characters (LeetCode 1002):** Find common characters across multiple strings. Uses frequency counting similar to Intersection II.

The core technique — using hash sets for efficient membership testing — applies to any problem where you need to check "does this element exist in that collection?" This includes problems like Two Sum (using a hash map to store complements), Contains Duplicate, and Valid Anagram.

## Key Takeaways

1. **Sets are your friend for uniqueness and fast lookups:** When a problem mentions "unique elements" or requires checking if an element exists in a collection, think sets first. They provide O(1) average-case lookups and automatically handle duplicates.

2. **Multiple approaches exist — know the trade-offs:**
   - Sets: Best for general case, O(m + n) time
   - Sorting + two pointers: Best when memory is constrained, O(m log m + n log n) time
   - Binary search: Useful when one array is much smaller (sort the smaller, binary search in larger)

3. **Read the problem requirements carefully:** This problem specifically asks for unique elements in the result. The similar problem "Intersection of Two Arrays II" requires keeping duplicates. Small wording differences change the solution approach.

4. **Practice language-specific APIs:** Know how to perform set operations in your interview language. Python has built-in operators (`&`, `|`, `-`), Java has methods (`retainAll`, `removeAll`), JavaScript requires manual implementation.

Remember: The intersection problem tests your ability to choose the right data structure for efficient element lookups while handling edge cases like duplicates and empty inputs.

**Related problems:** [Intersection of Two Arrays II](/problem/intersection-of-two-arrays-ii), [Intersection of Three Sorted Arrays](/problem/intersection-of-three-sorted-arrays), [Find the Difference of Two Arrays](/problem/find-the-difference-of-two-arrays)
