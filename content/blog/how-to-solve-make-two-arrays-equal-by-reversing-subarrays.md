---
title: "How to Solve Make Two Arrays Equal by Reversing Subarrays — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Make Two Arrays Equal by Reversing Subarrays. Easy difficulty, 75.8% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2027-11-09"
category: "dsa-patterns"
tags: ["make-two-arrays-equal-by-reversing-subarrays", "array", "hash-table", "sorting", "easy"]
---

# How to Solve "Make Two Arrays Equal by Reversing Subarrays"

At first glance, this problem seems complex because reversing subarrays can create many possible arrangements. However, the key insight is that reversing operations don't change which elements are present or how many times each appears—they only change the order. This makes the problem much simpler than it initially appears.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `target = [1,2,3,4]`, `arr = [2,4,1,3]`

**Step 1:** Check if we can transform `arr` into `target` using subarray reversals.

**Step 2:** Notice that reversing any subarray doesn't create or destroy elements—it only rearranges them. For example:

- Reverse `[2,4,1,3]` → still has elements {1,2,3,4}
- Reverse subarray `[2,4]` → `[4,2,1,3]` → still has elements {1,2,3,4}
- Reverse subarray `[1,3]` → `[2,4,3,1]` → still has elements {1,2,3,4}

**Step 3:** The only way `arr` cannot become `target` is if they contain different elements or different counts of the same elements. Since both arrays have the same length, we just need to check if they have the same multiset of elements.

**Step 4:** In our example:

- `target` has: 1 appears once, 2 appears once, 3 appears once, 4 appears once
- `arr` has: 1 appears once, 2 appears once, 3 appears once, 4 appears once

**Conclusion:** Since both arrays contain the same elements with the same frequencies, we can transform `arr` into `target` using subarray reversals. One possible sequence:

1. Reverse `[2,4,1,3]` → `[3,1,4,2]`
2. Reverse `[1,4]` → `[3,4,1,2]`
3. Reverse `[3,4]` → `[4,3,1,2]`
4. Reverse `[1,2]` → `[4,3,2,1]`
5. Reverse entire array → `[1,2,3,4]`

## Brute Force Approach

A naive approach would be to try all possible sequences of subarray reversals, but this is computationally infeasible. Even for small arrays, the number of possible subarrays is O(n²), and sequences of reversals can be arbitrarily long.

What some candidates might incorrectly try:

1. Check if arrays are already equal (obvious first check, but not sufficient)
2. Try to match elements one by one through single reversals
3. Attempt to simulate the reversal process with greedy algorithms

The fundamental issue with brute force is that we're trying to solve an ordering problem when the actual constraint is about element composition. The key realization is that **any permutation can be achieved through a sequence of adjacent swaps**, and reversing a subarray is equivalent to performing multiple adjacent swaps simultaneously.

## Optimal Solution

The optimal solution recognizes that reversing subarrays is a powerful operation that allows us to rearrange elements arbitrarily. In fact, we can achieve any permutation of `arr` through a sequence of reversals. Therefore, the only constraint is whether `arr` and `target` contain the same multiset of elements.

We can solve this by:

1. Counting the frequency of each element in `target`
2. Counting the frequency of each element in `arr`
3. Comparing if the frequency counts are identical

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def canBeEqual(target, arr):
    """
    Check if arr can be made equal to target by reversing subarrays.

    The key insight is that reversing subarrays allows us to achieve
    any permutation of the array. Therefore, we only need to check
    if both arrays contain the same elements with the same frequencies.
    """
    # Step 1: Create frequency dictionaries for both arrays
    target_count = {}
    arr_count = {}

    # Step 2: Count frequencies in target array
    for num in target:
        target_count[num] = target_count.get(num, 0) + 1

    # Step 3: Count frequencies in arr array
    for num in arr:
        arr_count[num] = arr_count.get(num, 0) + 1

    # Step 4: Compare the frequency dictionaries
    # If they have different sets of keys, return False
    if set(target_count.keys()) != set(arr_count.keys()):
        return False

    # Step 5: Check that all frequencies match
    for num in target_count:
        if target_count[num] != arr_count.get(num, 0):
            return False

    return True
```

```javascript
// Time: O(n) | Space: O(n)
function canBeEqual(target, arr) {
  /**
   * Check if arr can be made equal to target by reversing subarrays.
   *
   * Since reversing subarrays allows any permutation, we only need
   * to verify that both arrays have the same elements with the same counts.
   */

  // Step 1: Create frequency maps for both arrays
  const targetCount = new Map();
  const arrCount = new Map();

  // Step 2: Count frequencies in target array
  for (const num of target) {
    targetCount.set(num, (targetCount.get(num) || 0) + 1);
  }

  // Step 3: Count frequencies in arr array
  for (const num of arr) {
    arrCount.set(num, (arrCount.get(num) || 0) + 1);
  }

  // Step 4: Check if maps have the same size (different elements)
  if (targetCount.size !== arrCount.size) {
    return false;
  }

  // Step 5: Compare frequencies for each element
  for (const [num, count] of targetCount) {
    if (arrCount.get(num) !== count) {
      return false;
    }
  }

  return true;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean canBeEqual(int[] target, int[] arr) {
        /**
         * Check if arr can be made equal to target by reversing subarrays.
         *
         * The core insight: reversing subarrays is sufficient to achieve
         * any permutation, so we only need to compare element frequencies.
         */

        // Step 1: Create frequency maps for both arrays
        Map<Integer, Integer> targetCount = new HashMap<>();
        Map<Integer, Integer> arrCount = new HashMap<>();

        // Step 2: Count frequencies in target array
        for (int num : target) {
            targetCount.put(num, targetCount.getOrDefault(num, 0) + 1);
        }

        // Step 3: Count frequencies in arr array
        for (int num : arr) {
            arrCount.put(num, arrCount.getOrDefault(num, 0) + 1);
        }

        // Step 4: Check if maps have the same size
        if (targetCount.size() != arrCount.size()) {
            return false;
        }

        // Step 5: Compare frequencies for each key
        for (Map.Entry<Integer, Integer> entry : targetCount.entrySet()) {
            int num = entry.getKey();
            int count = entry.getValue();

            // Check if arr has the same count for this number
            if (!arrCount.containsKey(num) || arrCount.get(num) != count) {
                return false;
            }
        }

        return true;
    }
}
```

</div>

**Alternative simpler approach using sorting:**
Since both arrays have the same length, we can sort both and compare if they're equal. This is O(n log n) time and O(1) or O(n) space depending on the sorting algorithm.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) for Python's Timsort
def canBeEqual(target, arr):
    """
    Alternative solution using sorting.
    If both arrays sorted are equal, then they contain the same elements.
    """
    return sorted(target) == sorted(arr)
```

```javascript
// Time: O(n log n) | Space: O(n) for JavaScript's sort
function canBeEqual(target, arr) {
  /**
   * Alternative solution using sorting.
   * Sort both arrays and compare them.
   */
  // Note: JavaScript's sort() sorts lexicographically by default
  // We need to provide a compare function for numerical sorting
  target.sort((a, b) => a - b);
  arr.sort((a, b) => a - b);

  // Compare arrays element by element
  if (target.length !== arr.length) return false;
  for (let i = 0; i < target.length; i++) {
    if (target[i] !== arr[i]) return false;
  }
  return true;
}
```

```java
// Time: O(n log n) | Space: O(n) for Java's Arrays.sort()
import java.util.Arrays;

class Solution {
    public boolean canBeEqual(int[] target, int[] arr) {
        /**
         * Alternative solution using sorting.
         * Sort both arrays and compare them.
         */
        Arrays.sort(target);
        Arrays.sort(arr);

        return Arrays.equals(target, arr);
    }
}
```

</div>

## Complexity Analysis

**Hash Map Approach:**

- **Time Complexity:** O(n), where n is the length of the arrays. We make two passes through each array to build frequency maps, then one pass through the keys to compare.
- **Space Complexity:** O(n) in the worst case when all elements are distinct. Each map can store up to n entries.

**Sorting Approach:**

- **Time Complexity:** O(n log n) due to sorting. Most languages use comparison sorts like Timsort (Python), Merge sort (JavaScript's V8), or Dual-Pivot Quicksort (Java).
- **Space Complexity:** O(n) for the sorting algorithm's space (except for in-place sorts which use O(log n) for recursion stack).

The hash map approach is asymptotically faster (O(n) vs O(n log n)), but for practical purposes on small to medium inputs, both are acceptable. The sorting approach is simpler to implement and less error-prone.

## Common Mistakes

1. **Overcomplicating with actual reversal simulation:** Some candidates try to actually reverse subarrays to match `target`, which is unnecessary and inefficient. Remember: if a problem allows "any number of operations," think about what properties are invariant under those operations.

2. **Forgetting to check element frequencies:** Checking only if arrays contain the same set of elements (without considering counts) is incorrect. Example: `target = [1,1,2]`, `arr = [1,2,2]` have the same elements {1,2} but different frequencies.

3. **Incorrect array length assumption:** The problem states arrays have equal length, but defensive programming would check this. However, in an interview, you can mention this assumption.

4. **Using inefficient data structures:** Using lists or arrays to track frequencies when element values have a large range. Hash maps handle arbitrary integer values efficiently.

5. **In JavaScript: Forgetting the compare function in sort():** `array.sort()` without a compare function sorts lexicographically, so `[1, 10, 2]` would become `[1, 10, 2]` instead of `[1, 2, 10]`.

## When You'll See This Pattern

This problem teaches the important concept of **invariants**—properties that don't change under allowed operations. Recognizing invariants simplifies many problems:

1. **Valid Anagram (LeetCode 242):** Check if two strings are anagrams by comparing character frequencies—exactly the same pattern as this problem.

2. **Ransom Note (LeetCode 383):** Determine if you can construct a ransom note from magazine letters by comparing character frequencies.

3. **Find All Anagrams in a String (LeetCode 438):** Find all starting indices of anagrams of a pattern in a string using sliding window with frequency counts.

4. **Permutation in String (LeetCode 567):** Check if one string contains a permutation of another using the same frequency comparison technique.

The core pattern: when operations preserve some property (like multiset of elements), you can reduce the problem to checking that property rather than simulating the operations.

## Key Takeaways

1. **Look for invariants:** When a problem allows unlimited operations of a certain type, identify what properties remain unchanged. This often simplifies the problem dramatically.

2. **Frequency counting is powerful:** Many "rearrangement" problems reduce to comparing frequency distributions. Hash maps provide an efficient O(n) solution.

3. **Understand operation power:** Reversing subarrays is a strong operation—it allows achieving any permutation. Recognizing this transforms the problem from "can we rearrange through specific operations" to "do we have the right pieces."

4. **Choose the right tool:** For this problem, both hash maps (O(n) time) and sorting (O(n log n) time) work. The hash map solution is asymptotically better, but sorting is simpler to implement correctly.

Remember: interviewers often present problems that seem to require complex simulation, but the elegant solution comes from recognizing underlying mathematical properties. Always ask yourself: "What doesn't change when I perform this operation?"

[Practice this problem on CodeJeet](/problem/make-two-arrays-equal-by-reversing-subarrays)
