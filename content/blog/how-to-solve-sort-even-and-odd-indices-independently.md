---
title: "How to Solve Sort Even and Odd Indices Independently — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sort Even and Odd Indices Independently. Easy difficulty, 63.2% acceptance rate. Topics: Array, Sorting."
date: "2027-08-21"
category: "dsa-patterns"
tags: ["sort-even-and-odd-indices-independently", "array", "sorting", "easy"]
---

# How to Solve Sort Even and Odd Indices Independently

This problem asks us to rearrange an array by sorting even-indexed elements in non-decreasing order and odd-indexed elements in non-increasing order, independently of each other. What makes this problem interesting is that we need to handle two separate sorting criteria simultaneously while maintaining the original index positions. The challenge lies in efficiently separating, sorting, and recombining the elements without creating complex index manipulations.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [4, 1, 2, 3]`:

**Step 1: Separate even and odd indices**

- Even indices (0, 2): `[4, 2]`
- Odd indices (1, 3): `[1, 3]`

**Step 2: Sort according to rules**

- Even indices should be non-decreasing (ascending): `[2, 4]`
- Odd indices should be non-increasing (descending): `[3, 1]`

**Step 3: Recombine into result array**

- Place sorted even-index elements back at even positions: index 0 gets 2, index 2 gets 4
- Place sorted odd-index elements back at odd positions: index 1 gets 3, index 3 gets 1

**Result:** `[2, 3, 4, 1]`

Let's verify with another example: `nums = [5, 7, 3, 2, 8, 1]`

**Step 1: Separate**

- Even indices (0, 2, 4): `[5, 3, 8]`
- Odd indices (1, 3, 5): `[7, 2, 1]`

**Step 2: Sort**

- Even ascending: `[3, 5, 8]`
- Odd descending: `[7, 2, 1]`

**Step 3: Recombine**

- Even positions: index 0 gets 3, index 2 gets 5, index 4 gets 8
- Odd positions: index 1 gets 7, index 3 gets 2, index 5 gets 1

**Result:** `[3, 7, 5, 2, 8, 1]`

This visual approach shows we need to extract two separate lists, sort them differently, then merge them back together.

## Brute Force Approach

A naive approach might try to sort the entire array in place while tracking indices, but this quickly becomes complex. Another brute force method would be:

1. Create two empty arrays: `evenElements` and `oddElements`
2. Iterate through `nums`, adding elements at even indices to `evenElements` and odd indices to `oddElements`
3. Sort `evenElements` in ascending order
4. Sort `oddElements` in descending order
5. Create a result array and fill it by taking elements from the sorted lists

While this approach is conceptually simple, it's not truly "brute force" in the sense of being inefficient - it's actually quite reasonable. The real "brute force" would be trying to implement a custom sorting algorithm that compares elements based on their indices, which would be unnecessarily complex.

The main inefficiency in the straightforward approach above is that we need to iterate through the array twice (once to separate, once to recombine) and sort two separate lists. However, this is already O(n log n) time complexity, which is optimal for comparison-based sorting.

## Optimal Solution

The optimal solution follows the visual walkthrough directly. We separate the even and odd indexed elements, sort them according to their respective rules, then merge them back. The key insight is that we can use Python's slicing with step parameter or simple loops in other languages to efficiently extract the elements.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def sortEvenOdd(nums):
    """
    Rearrange nums by sorting even indices in non-decreasing order
    and odd indices in non-increasing order independently.
    """
    # Step 1: Extract even and odd indexed elements
    # Using list slicing with step 2 for efficiency
    even_elements = nums[::2]   # Elements at indices 0, 2, 4, ...
    odd_elements = nums[1::2]   # Elements at indices 1, 3, 5, ...

    # Step 2: Sort according to the rules
    # Even indices: non-decreasing (ascending)
    even_elements.sort()
    # Odd indices: non-increasing (descending)
    odd_elements.sort(reverse=True)

    # Step 3: Recombine into result array
    result = []
    # Use two pointers to merge the sorted lists
    even_ptr, odd_ptr = 0, 0

    # Iterate through all positions in the original array
    for i in range(len(nums)):
        if i % 2 == 0:  # Even index
            result.append(even_elements[even_ptr])
            even_ptr += 1
        else:  # Odd index
            result.append(odd_elements[odd_ptr])
            odd_ptr += 1

    return result
```

```javascript
// Time: O(n log n) | Space: O(n)
function sortEvenOdd(nums) {
  /**
   * Rearrange nums by sorting even indices in non-decreasing order
   * and odd indices in non-increasing order independently.
   */
  // Step 1: Extract even and odd indexed elements
  const evenElements = [];
  const oddElements = [];

  // Iterate through array, separating elements by index parity
  for (let i = 0; i < nums.length; i++) {
    if (i % 2 === 0) {
      evenElements.push(nums[i]);
    } else {
      oddElements.push(nums[i]);
    }
  }

  // Step 2: Sort according to the rules
  // Even indices: non-decreasing (ascending)
  evenElements.sort((a, b) => a - b);
  // Odd indices: non-increasing (descending)
  oddElements.sort((a, b) => b - a);

  // Step 3: Recombine into result array
  const result = [];
  let evenPtr = 0,
    oddPtr = 0;

  // Iterate through all positions in the original array
  for (let i = 0; i < nums.length; i++) {
    if (i % 2 === 0) {
      // Even index
      result.push(evenElements[evenPtr]);
      evenPtr++;
    } else {
      // Odd index
      result.push(oddElements[oddPtr]);
      oddPtr++;
    }
  }

  return result;
}
```

```java
// Time: O(n log n) | Space: O(n)
import java.util.*;

class Solution {
    public int[] sortEvenOdd(int[] nums) {
        /**
         * Rearrange nums by sorting even indices in non-decreasing order
         * and odd indices in non-increasing order independently.
         */
        // Step 1: Extract even and odd indexed elements
        List<Integer> evenElements = new ArrayList<>();
        List<Integer> oddElements = new ArrayList<>();

        // Iterate through array, separating elements by index parity
        for (int i = 0; i < nums.length; i++) {
            if (i % 2 == 0) {
                evenElements.add(nums[i]);
            } else {
                oddElements.add(nums[i]);
            }
        }

        // Step 2: Sort according to the rules
        // Even indices: non-decreasing (ascending)
        Collections.sort(evenElements);
        // Odd indices: non-increasing (descending)
        Collections.sort(oddElements, Collections.reverseOrder());

        // Step 3: Recombine into result array
        int[] result = new int[nums.length];
        int evenPtr = 0, oddPtr = 0;

        // Iterate through all positions in the original array
        for (int i = 0; i < nums.length; i++) {
            if (i % 2 == 0) {  // Even index
                result[i] = evenElements.get(evenPtr);
                evenPtr++;
            } else {  // Odd index
                result[i] = oddElements.get(oddPtr);
                oddPtr++;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Separating elements takes O(n) time (one pass through the array)
- Sorting the even elements takes O((n/2) log (n/2)) ≈ O(n log n)
- Sorting the odd elements takes O((n/2) log (n/2)) ≈ O(n log n)
- Recombining takes O(n) time (another pass through the array)
- The dominant term is O(n log n) from the sorting operations

**Space Complexity: O(n)**

- We create two auxiliary lists `evenElements` and `oddElements` that together contain all n elements
- The result array also takes O(n) space
- In total, we use O(n) extra space beyond the input

## Common Mistakes

1. **Mixing up the sorting directions**: The most common error is sorting both lists in the same direction. Remember: even indices → ascending, odd indices → descending. Always double-check which indices get which sort order.

2. **Off-by-one errors with 0-indexing**: When the problem says "even indices" and "odd indices," it means the actual index numbers (0, 2, 4,... are even; 1, 3, 5,... are odd). Some candidates mistakenly think about the elements themselves being even or odd numbers.

3. **In-place modification confusion**: Attempting to sort in-place without proper tracking can lead to overwriting values. It's safer to create new lists for even/odd elements rather than trying to sort in the original array.

4. **Forgetting to handle edge cases**: While the problem guarantees at least 2 elements, candidates should still consider:
   - Single element arrays (though not in this problem's constraints)
   - Arrays with all elements at even or odd indices (when length is 1 or 2)
   - Arrays with duplicate values (sorting should handle these correctly)

## When You'll See This Pattern

This problem uses the **"separate and conquer"** pattern, where you split data based on a criterion, process each part independently, then recombine. You'll see this pattern in:

1. **Sort Array By Parity (LeetCode 905)**: Separate even and odd numbers (based on value, not index), then concatenate.
2. **Sort Array By Parity II (LeetCode 922)**: Rearrange array so that even indices contain even numbers and odd indices contain odd numbers.
3. **Partition Labels (LeetCode 763)**: Split string into partitions where each letter appears in at most one partition.

The core technique of separating data, processing independently, and recombining appears whenever you need to apply different operations to different subsets of data.

## Key Takeaways

1. **When faced with different rules for different subsets, separate first**: If you need to apply different operations to different groups of elements (by index, value, or other criteria), extract them into separate collections first.

2. **Index-based problems often benefit from modular arithmetic**: Using `i % 2` to determine if an index is even or odd is a clean, readable approach that works for any array length.

3. **Read sorting directions carefully**: "Non-decreasing" means ascending (allow equal values), "non-increasing" means descending (allow equal values). These terms are precise and commonly used in algorithmic problems.

Related problems: [Sort Array By Parity](/problem/sort-array-by-parity), [Sort Array By Parity II](/problem/sort-array-by-parity-ii)
