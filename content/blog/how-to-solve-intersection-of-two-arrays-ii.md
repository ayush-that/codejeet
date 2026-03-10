---
title: "How to Solve Intersection of Two Arrays II — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Intersection of Two Arrays II. Easy difficulty, 59.7% acceptance rate. Topics: Array, Hash Table, Two Pointers, Binary Search, Sorting."
date: "2026-06-20"
category: "dsa-patterns"
tags: ["intersection-of-two-arrays-ii", "array", "hash-table", "two-pointers", "easy"]
---

# How to Solve Intersection of Two Arrays II

This problem asks us to find the intersection of two arrays, but with a twist: we must include each element as many times as it appears in both arrays. For example, if `nums1 = [1,2,2,1]` and `nums2 = [2,2]`, the result should be `[2,2]`, not just `[2]`. This requirement makes the problem more interesting than simply finding unique common elements, as we need to track frequencies.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have:

- `nums1 = [4, 9, 5, 4, 4]`
- `nums2 = [9, 4, 9, 8, 4]`

We need to find elements that appear in both arrays, with the minimum count from either array.

**Step-by-step thinking:**

1. Count occurrences in `nums1`: `{4: 3, 9: 1, 5: 1}`
2. For each element in `nums2`, check if it exists in our count:
   - `9`: Exists with count 1 → add `9` to result, decrement count to 0
   - `4`: Exists with count 3 → add `4` to result, decrement count to 2
   - `9`: Exists with count 0 → skip (no more 9s available)
   - `8`: Doesn't exist → skip
   - `4`: Exists with count 2 → add `4` to result, decrement count to 1
3. Result: `[9, 4, 4]` (order doesn't matter)

This approach ensures we include each element the correct number of times: `9` appears once in both arrays, `4` appears twice in `nums2` and three times in `nums1`, so we include it twice.

## Brute Force Approach

A naive approach would be to compare every element in `nums1` with every element in `nums2`. For each element in `nums1`, we could scan `nums2` to find a match, mark it as used, and add it to our result.

**Why this fails:**

1. **Time complexity**: O(n×m) where n and m are array lengths. For large arrays (10⁵ elements each), this would be 10¹⁰ operations — far too slow.
2. **Complex handling**: We need to mark elements as "used" to avoid counting them multiple times, which adds complexity.
3. **No benefit from frequency**: We're not leveraging the fact that elements repeat, so we do redundant work.

While this brute force approach would technically produce the correct result, it's impractical for anything beyond tiny inputs.

## Optimal Solution

The optimal approach uses a hash map (dictionary) to count frequencies. We count occurrences in the smaller array (to minimize space), then iterate through the larger array, adding matches to our result and decrementing counts.

<div class="code-group">

```python
# Time: O(n + m) where n = len(nums1), m = len(nums2)
# Space: O(min(n, m)) for the frequency map
def intersect(nums1, nums2):
    # Always count frequencies of the smaller array to minimize space usage
    if len(nums1) > len(nums2):
        return intersect(nums2, nums1)

    # Step 1: Build frequency map for the smaller array
    freq = {}
    for num in nums1:
        freq[num] = freq.get(num, 0) + 1

    # Step 2: Iterate through larger array and find intersections
    result = []
    for num in nums2:
        # Check if current number exists in frequency map with count > 0
        if num in freq and freq[num] > 0:
            result.append(num)      # Add to intersection
            freq[num] -= 1          # Decrement count since we've used one occurrence

    return result
```

```javascript
// Time: O(n + m) where n = nums1.length, m = nums2.length
// Space: O(min(n, m)) for the frequency map
function intersect(nums1, nums2) {
  // Always count frequencies of the smaller array to minimize space usage
  if (nums1.length > nums2.length) {
    return intersect(nums2, nums1);
  }

  // Step 1: Build frequency map for the smaller array
  const freq = new Map();
  for (const num of nums1) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }

  // Step 2: Iterate through larger array and find intersections
  const result = [];
  for (const num of nums2) {
    // Check if current number exists in frequency map with count > 0
    const count = freq.get(num);
    if (count > 0) {
      result.push(num); // Add to intersection
      freq.set(num, count - 1); // Decrement count since we've used one occurrence
    }
  }

  return result;
}
```

```java
// Time: O(n + m) where n = nums1.length, m = nums2.length
// Space: O(min(n, m)) for the frequency map
public int[] intersect(int[] nums1, int[] nums2) {
    // Always count frequencies of the smaller array to minimize space usage
    if (nums1.length > nums2.length) {
        return intersect(nums2, nums1);
    }

    // Step 1: Build frequency map for the smaller array
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums1) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }

    // Step 2: Iterate through larger array and find intersections
    List<Integer> resultList = new ArrayList<>();
    for (int num : nums2) {
        // Check if current number exists in frequency map with count > 0
        int count = freq.getOrDefault(num, 0);
        if (count > 0) {
            resultList.add(num);    // Add to intersection
            freq.put(num, count - 1); // Decrement count since we've used one occurrence
        }
    }

    // Convert List to array for return type
    int[] result = new int[resultList.size()];
    for (int i = 0; i < resultList.size(); i++) {
        result[i] = resultList.get(i);
    }
    return result;
}
```

</div>

**Alternative sorted approach:** If the arrays are already sorted (or sorting is acceptable), we can use a two-pointer technique:

<div class="code-group">

```python
# Time: O(n log n + m log m) for sorting, O(n + m) for two-pointer pass
# Space: O(1) excluding output, O(min(n, m)) including output
def intersect_sorted(nums1, nums2):
    # Sort both arrays
    nums1.sort()
    nums2.sort()

    i, j = 0, 0
    result = []

    # Two-pointer traversal
    while i < len(nums1) and j < len(nums2):
        if nums1[i] < nums2[j]:
            i += 1  # nums1[i] is too small, move forward
        elif nums1[i] > nums2[j]:
            j += 1  # nums2[j] is too small, move forward
        else:
            # Found intersection
            result.append(nums1[i])
            i += 1
            j += 1

    return result
```

</div>

The hash map approach is generally better when arrays aren't sorted, as O(n+m) beats O(n log n + m log m). The two-pointer approach shines when arrays are already sorted or when memory is extremely constrained.

## Complexity Analysis

**Hash Map Approach:**

- **Time**: O(n + m) where n and m are array lengths. We make one pass through each array.
- **Space**: O(min(n, m)) for the frequency map of the smaller array.

**Two-Pointer Approach (if arrays are sorted):**

- **Time**: O(n log n + m log m) for sorting plus O(n + m) for the two-pointer pass.
- **Space**: O(1) extra space (excluding output), or O(min(n, m)) if we count the output array.

The hash map approach is optimal for unsorted arrays since any solution must examine each element at least once, giving us a lower bound of O(n+m).

## Common Mistakes

1. **Not handling frequency counts correctly**: Simply checking if an element exists in a set (rather than tracking counts) gives wrong results for duplicates. Always use a frequency map, not a set.
2. **Forgetting to decrement counts**: After adding an element to the result, you must decrement its count in the frequency map. Otherwise, you'll add more copies than should exist in the intersection.

3. **Choosing the wrong array for frequency counting**: Always count the smaller array to minimize memory usage. While counting the larger array still works, it's less efficient.

4. **Assuming sorted input**: The problem doesn't state arrays are sorted. Don't use two-pointer approach unless you sort first or confirm arrays are pre-sorted.

5. **Returning wrong data type**: In Java, you need to convert `List<Integer>` to `int[]`. Forgetting this results in compilation errors.

## When You'll See This Pattern

The frequency counting pattern appears in many problems where you need to track occurrences of elements:

1. **Valid Anagram (Easy)**: Check if two strings are anagrams by counting character frequencies.
2. **Ransom Note (Easy)**: Determine if you can construct a ransom note from magazine letters using frequency counts.
3. **Find Common Characters (Easy)**: Find characters common to all strings in an array, considering frequencies.
4. **Top K Frequent Elements (Medium)**: Find k most frequent elements using frequency maps.

The two-pointer pattern on sorted arrays is also widely applicable:

1. **Merge Sorted Array (Easy)**: Merge two sorted arrays using similar pointer movement.
2. **Two Sum II - Input Array Is Sorted (Medium)**: Find two numbers that sum to target using two pointers.

## Key Takeaways

1. **Frequency maps solve "count-aware" intersection problems**: When you need to consider how many times elements appear (not just whether they exist), reach for a hash map to track counts.

2. **Optimize space by processing the smaller collection first**: When building frequency maps, always count the smaller array/list/string to minimize memory usage.

3. **Sorted data enables two-pointer solutions**: If inputs are sorted (or can be sorted efficiently), consider two-pointer techniques that use O(1) extra space.

4. **The problem constraints guide the approach**: For small ranges of integers, you could use an array instead of a hash map. For already-sorted data, use two pointers. Know your tools and when to apply them.

Related problems: [Intersection of Two Arrays](/problem/intersection-of-two-arrays), [Find Common Characters](/problem/find-common-characters), [Find the Difference of Two Arrays](/problem/find-the-difference-of-two-arrays)
