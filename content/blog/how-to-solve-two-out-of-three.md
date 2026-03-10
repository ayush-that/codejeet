---
title: "How to Solve Two Out of Three — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Two Out of Three. Easy difficulty, 77.4% acceptance rate. Topics: Array, Hash Table, Bit Manipulation."
date: "2027-06-13"
category: "dsa-patterns"
tags: ["two-out-of-three", "array", "hash-table", "bit-manipulation", "easy"]
---

# How to Solve Two Out of Three

This problem asks us to find values that appear in at least two out of three given integer arrays. While conceptually straightforward, it's interesting because it tests your ability to efficiently track membership across multiple collections and handle duplicates within each array. The main challenge is avoiding O(n³) comparisons while correctly counting occurrences across distinct arrays.

## Visual Walkthrough

Let's trace through a concrete example:

```
nums1 = [1, 1, 3, 2]
nums2 = [2, 3]
nums3 = [3]
```

We need values present in at least two arrays. Let's track membership:

**Step 1: Process nums1**

- Value 1: Only in nums1 so far
- Value 3: Only in nums1 so far
- Value 2: Only in nums1 so far

**Step 2: Process nums2**

- Value 2: Now in nums1 AND nums2 → qualifies!
- Value 3: Now in nums1 AND nums2 → qualifies!

**Step 3: Process nums3**

- Value 3: Already in nums1 and nums2, now also in nums3 (still qualifies)

**Result:** [2, 3] (distinct values)

Notice that even though 1 appears twice in nums1, it doesn't qualify because it's only in one array. Also, 3 appears in all three arrays but we only count it once in the result.

## Brute Force Approach

A naive approach would be to compare every element across all arrays:

1. For each value in nums1, check if it exists in nums2 OR nums3
2. For each value in nums2, check if it exists in nums3 (but not already counted)
3. Collect all qualifying values, remove duplicates

This requires O(n₁×n₂ + n₁×n₃ + n₂×n₃) comparisons where nᵢ is the length of each array. In the worst case (all arrays have length n), that's O(3n²) = O(n²) time. While this might pass for small inputs, it's inefficient and doesn't scale well.

More importantly, this approach is error-prone because:

- You might double-count values that appear in all three arrays
- You need careful logic to avoid counting values multiple times from the same array
- Checking membership in arrays is O(n) each time, not O(1)

## Optimal Solution

The optimal approach uses sets to track which values appear in each array, then counts occurrences across the sets. Here's why this works:

1. **Convert each array to a set** - This removes duplicates within each array and gives us O(1) membership checking
2. **Count occurrences across sets** - For each unique value across all arrays, check how many sets contain it
3. **Collect values with count ≥ 2** - These appear in at least two arrays

The key insight is that we don't care how many times a value appears within a single array - we only care whether it appears in the array at all. Sets perfectly capture this "membership" information.

<div class="code-group">

```python
# Time: O(n1 + n2 + n3) where n_i is the length of each array
# Space: O(n1 + n2 + n3) for storing the sets
def twoOutOfThree(nums1, nums2, nums3):
    # Step 1: Convert each array to a set to remove duplicates
    # This gives us O(1) lookup time for membership checks
    set1 = set(nums1)
    set2 = set(nums2)
    set3 = set(nums3)

    # Step 2: Create a set of all unique values across all arrays
    # We use union (|) operator to combine all unique values
    all_values = set1 | set2 | set3

    # Step 3: Initialize result list
    result = []

    # Step 4: Check each unique value
    for num in all_values:
        # Count how many sets contain this value
        # We use boolean to int conversion: True=1, False=0
        count = (num in set1) + (num in set2) + (num in set3)

        # If value appears in at least 2 sets, add to result
        if count >= 2:
            result.append(num)

    return result
```

```javascript
// Time: O(n1 + n2 + n3) where n_i is the length of each array
// Space: O(n1 + n2 + n3) for storing the sets
function twoOutOfThree(nums1, nums2, nums3) {
  // Step 1: Convert each array to a set to remove duplicates
  // Sets provide O(1) average case lookup time
  const set1 = new Set(nums1);
  const set2 = new Set(nums2);
  const set3 = new Set(nums3);

  // Step 2: Create a set of all unique values across all arrays
  // We use a Set to automatically handle duplicates
  const allValues = new Set();

  // Add all values from each array to the combined set
  nums1.forEach((num) => allValues.add(num));
  nums2.forEach((num) => allValues.add(num));
  nums3.forEach((num) => allValues.add(num));

  // Step 3: Initialize result array
  const result = [];

  // Step 4: Check each unique value
  for (const num of allValues) {
    // Count how many sets contain this value
    // Convert boolean to number: true=1, false=0
    const count = (set1.has(num) ? 1 : 0) + (set2.has(num) ? 1 : 0) + (set3.has(num) ? 1 : 0);

    // If value appears in at least 2 sets, add to result
    if (count >= 2) {
      result.push(num);
    }
  }

  return result;
}
```

```java
// Time: O(n1 + n2 + n3) where n_i is the length of each array
// Space: O(n1 + n2 + n3) for storing the sets
import java.util.*;

public List<Integer> twoOutOfThree(int[] nums1, int[] nums2, int[] nums3) {
    // Step 1: Convert each array to a set to remove duplicates
    Set<Integer> set1 = new HashSet<>();
    Set<Integer> set2 = new HashSet<>();
    Set<Integer> set3 = new HashSet<>();

    for (int num : nums1) set1.add(num);
    for (int num : nums2) set2.add(num);
    for (int num : nums3) set3.add(num);

    // Step 2: Create a set of all unique values across all arrays
    Set<Integer> allValues = new HashSet<>();
    allValues.addAll(set1);
    allValues.addAll(set2);
    allValues.addAll(set3);

    // Step 3: Initialize result list
    List<Integer> result = new ArrayList<>();

    // Step 4: Check each unique value
    for (int num : allValues) {
        // Count how many sets contain this value
        int count = 0;
        if (set1.contains(num)) count++;
        if (set2.contains(num)) count++;
        if (set3.contains(num)) count++;

        // If value appears in at least 2 sets, add to result
        if (count >= 2) {
            result.add(num);
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n₁ + n₂ + n₃)**

- Converting each array to a set takes O(n₁), O(n₂), and O(n₃) respectively
- Creating the combined set of all values takes O(n₁ + n₂ + n₃) in the worst case
- Iterating through all unique values and checking set membership is O(n₁ + n₂ + n₃) since each membership check is O(1)
- Total: O(3×(n₁ + n₂ + n₃)) = O(n₁ + n₂ + n₃)

**Space Complexity: O(n₁ + n₂ + n₃)**

- We store three sets containing all unique values from each array
- In the worst case (no duplicates within each array), each set stores all values from its array
- The combined set and result list also use O(n₁ + n₂ + n₃) space in total

## Common Mistakes

1. **Not using sets and checking arrays directly**: This leads to O(n²) time complexity. Candidates might write nested loops comparing arrays, which becomes inefficient for larger inputs.

2. **Counting duplicates within the same array multiple times**: The problem says "present in at least two out of the three arrays" - a value appearing twice in the same array but not in others shouldn't count. Always convert to sets first to remove intra-array duplicates.

3. **Forgetting to make the result distinct**: The problem explicitly asks for a "distinct" array. If you don't use sets or proper deduplication, you might return [2, 2, 3] instead of [2, 3] for our example.

4. **Incorrect counting logic**: Some candidates check `(num in nums1) + (num in nums2) >= 2 or (num in nums1) + (num in nums3) >= 2 or ...` which is redundant. The correct approach is to count total occurrences across all three sets.

## When You'll See This Pattern

This "set membership counting" pattern appears in many problems where you need to track elements across multiple collections:

1. **Intersection of Multiple Arrays (LeetCode 2248)**: Find all integers that appear in each of the arrays. This is similar but requires presence in ALL arrays rather than at least two.

2. **Find Common Characters (LeetCode 1002)**: Find characters that appear in all strings in an array. The pattern is the same - track membership across multiple collections and find intersections.

3. **Design HashMap/HashSet problems**: Many hash table problems require tracking element presence across different operations or data structures.

The core technique is: when you need to track "whether an element exists in a collection" rather than "how many times it appears," sets are your best friend. They provide O(1) membership checks and automatically handle duplicates.

## Key Takeaways

1. **Use sets for membership tracking**: When a problem asks about presence (not frequency) across collections, convert to sets first. This removes duplicates and enables O(1) lookups.

2. **Count across collections, not within them**: For "at least N collections" problems, count how many collections contain each element, not how many times it appears total.

3. **Watch for distinct results**: Many array problems require distinct outputs. Sets help both in intermediate processing and final deduplication.

[Practice this problem on CodeJeet](/problem/two-out-of-three)
