---
title: "How to Solve Find the Difference of Two Arrays — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Difference of Two Arrays. Easy difficulty, 81.3% acceptance rate. Topics: Array, Hash Table."
date: "2027-02-22"
category: "dsa-patterns"
tags: ["find-the-difference-of-two-arrays", "array", "hash-table", "easy"]
---

# How to Solve Find the Difference of Two Arrays

This problem asks us to find the unique elements that exist in one array but not the other. While it sounds straightforward, the challenge lies in doing this efficiently while handling duplicates properly. The key insight is that we need to track presence/absence, not counts, which makes hash sets the perfect tool.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `nums1 = [1, 2, 3, 3, 4]`
- `nums2 = [2, 4, 6, 8]`

We need to find:

1. Elements in `nums1` but not in `nums2`
2. Elements in `nums2` but not in `nums1`

**Step 1: Convert both arrays to sets**

- `set1 = {1, 2, 3, 4}` (duplicate 3 is removed)
- `set2 = {2, 4, 6, 8}`

**Step 2: Find elements in set1 but not in set2**

- Check each element in set1 against set2:
  - 1: Not in set2 → add to answer[0]
  - 2: In set2 → skip
  - 3: Not in set2 → add to answer[0]
  - 4: In set2 → skip
- Result: `answer[0] = [1, 3]`

**Step 3: Find elements in set2 but not in set1**

- Check each element in set2 against set1:
  - 2: In set1 → skip
  - 4: In set1 → skip
  - 6: Not in set1 → add to answer[1]
  - 8: Not in set1 → add to answer[1]
- Result: `answer[1] = [6, 8]`

Final answer: `[[1, 3], [6, 8]]`

Notice how sets automatically handle duplicates for us, and the set difference operation (`set1 - set2`) gives us exactly what we need.

## Brute Force Approach

A naive approach would be to check each element in `nums1` against every element in `nums2`:

1. For each unique element in `nums1`, scan through all of `nums2` to see if it exists
2. For each unique element in `nums2`, scan through all of `nums1` to see if it exists

This approach has several problems:

- We need to handle duplicates carefully to avoid returning the same element multiple times
- The time complexity would be O(n×m) where n and m are the lengths of the arrays
- With arrays of length 1000, that's up to 1,000,000 operations
- We'd need additional logic to track which elements we've already processed

While this brute force would technically work for small inputs, it's inefficient and error-prone. The optimal solution uses hash sets to reduce the lookup time from O(m) to O(1).

## Optimal Solution

The optimal solution uses hash sets to achieve O(1) lookups. Here's the step-by-step approach:

1. Convert both arrays to sets to remove duplicates and enable fast lookups
2. For elements in set1, check if they exist in set2 → these go to answer[0]
3. For elements in set2, check if they exist in set1 → these go to answer[1]
4. Return the result as a list of lists

<div class="code-group">

```python
# Time: O(n + m) where n = len(nums1), m = len(nums2)
# Space: O(n + m) for the two sets
def findDifference(nums1, nums2):
    # Step 1: Convert both arrays to sets
    # This removes duplicates and gives us O(1) lookups
    set1 = set(nums1)
    set2 = set(nums2)

    # Step 2: Find elements in set1 that are not in set2
    # We use list comprehension to iterate through set1
    # and only keep elements not found in set2
    diff1 = [num for num in set1 if num not in set2]

    # Step 3: Find elements in set2 that are not in set1
    # Same logic as above, but checking set2 against set1
    diff2 = [num for num in set2 if num not in set1]

    # Step 4: Return the result as a list of two lists
    return [diff1, diff2]
```

```javascript
// Time: O(n + m) where n = nums1.length, m = nums2.length
// Space: O(n + m) for the two sets
function findDifference(nums1, nums2) {
  // Step 1: Convert both arrays to sets
  // Using Set removes duplicates and provides O(1) lookups
  const set1 = new Set(nums1);
  const set2 = new Set(nums2);

  // Step 2: Find elements in set1 that are not in set2
  // We convert set1 to array and filter elements not in set2
  const diff1 = Array.from(set1).filter((num) => !set2.has(num));

  // Step 3: Find elements in set2 that are not in set1
  // Same logic as above, but checking set2 against set1
  const diff2 = Array.from(set2).filter((num) => !set1.has(num));

  // Step 4: Return the result as an array of two arrays
  return [diff1, diff2];
}
```

```java
// Time: O(n + m) where n = nums1.length, m = nums2.length
// Space: O(n + m) for the two sets
import java.util.*;

public List<List<Integer>> findDifference(int[] nums1, int[] nums2) {
    // Step 1: Convert both arrays to sets
    // HashSet provides O(1) lookups and removes duplicates
    Set<Integer> set1 = new HashSet<>();
    Set<Integer> set2 = new HashSet<>();

    for (int num : nums1) set1.add(num);
    for (int num : nums2) set2.add(num);

    // Step 2: Find elements in set1 that are not in set2
    List<Integer> diff1 = new ArrayList<>();
    for (int num : set1) {
        if (!set2.contains(num)) {
            diff1.add(num);
        }
    }

    // Step 3: Find elements in set2 that are not in set1
    List<Integer> diff2 = new ArrayList<>();
    for (int num : set2) {
        if (!set1.contains(num)) {
            diff2.add(num);
        }
    }

    // Step 4: Return the result as a list of two lists
    List<List<Integer>> result = new ArrayList<>();
    result.add(diff1);
    result.add(diff2);
    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Converting `nums1` to a set takes O(n) time
- Converting `nums2` to a set takes O(m) time
- Checking each element in set1 against set2 takes O(n) time (O(1) per lookup)
- Checking each element in set2 against set1 takes O(m) time (O(1) per lookup)
- Total: O(n + m + n + m) = O(2n + 2m) = O(n + m)

**Space Complexity: O(n + m)**

- We store set1 with up to n unique elements
- We store set2 with up to m unique elements
- The output lists together contain at most n + m elements
- Total: O(n + m) for sets + O(n + m) for output = O(n + m)

## Common Mistakes

1. **Not handling duplicates properly**: If you don't convert to sets first, you might return duplicate values in your answer. For example, with `nums1 = [1, 1, 2]` and `nums2 = [2]`, the correct answer is `[[1], []]`, not `[[1, 1], []]`.

2. **Using the wrong data structure**: Some candidates try to use arrays or lists for lookups, which gives O(n) lookup time instead of O(1). Always use hash sets when you need fast membership testing.

3. **Forgetting to check both directions**: This problem asks for two lists - elements in nums1 not in nums2 AND elements in nums2 not in nums1. Some candidates only compute one direction.

4. **Not understanding set operations**: In Python, you could use `set1 - set2` and `set2 - set1` directly. While this is more concise, it's important to understand what's happening under the hood for interview explanations.

## When You'll See This Pattern

This "set difference" pattern appears whenever you need to:

1. Find unique elements between collections
2. Check for presence/absence of elements
3. Remove duplicates while processing data

Related problems that use similar techniques:

1. **Intersection of Two Arrays (Easy)**: Find common elements between two arrays. Solution: Convert to sets and use set intersection or manual checking.

2. **Intersection of Two Arrays II (Easy)**: Find common elements with counts. Solution: Use hash maps to track counts instead of sets.

3. **Contains Duplicate (Easy)**: Check if an array has duplicates. Solution: Compare array length to set length.

4. **Two Sum (Easy)**: Find two numbers that add to a target. Solution: Use a hash map to store seen numbers for O(1) lookups.

## Key Takeaways

1. **Hash sets are perfect for membership testing**: When you need to check if an element exists in a collection, convert to a set first for O(1) lookups instead of O(n) linear scans.

2. **The problem structure determines the data structure**:
   - Need unique elements? Use sets
   - Need to track counts? Use hash maps
   - Need to preserve order? Use lists with careful tracking

3. **Always consider both directions**: When comparing two collections, make sure you check A vs B AND B vs A unless the problem specifies otherwise.

Related problems: [Intersection of Two Arrays](/problem/intersection-of-two-arrays), [Intersection of Two Arrays II](/problem/intersection-of-two-arrays-ii), [Intersection of Multiple Arrays](/problem/intersection-of-multiple-arrays)
