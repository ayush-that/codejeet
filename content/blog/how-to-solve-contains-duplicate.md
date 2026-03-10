---
title: "How to Solve Contains Duplicate — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Contains Duplicate. Easy difficulty, 64.1% acceptance rate. Topics: Array, Hash Table, Sorting."
date: "2026-02-08"
category: "dsa-patterns"
tags: ["contains-duplicate", "array", "hash-table", "sorting", "easy"]
---

# How to Solve Contains Duplicate

This problem asks us to determine whether an array contains any duplicate values. While it seems straightforward, it's a foundational problem that tests your understanding of trade-offs between different data structures and algorithms. The "trickiness" comes from recognizing that there are multiple valid approaches, each with different time/space complexity implications, and choosing the right one based on the problem constraints.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the input array `[1, 2, 3, 1]`.

**Using a hash set approach:**

1. Start with an empty set: `{}`
2. Check first element `1`: Not in set → add `1` to set: `{1}`
3. Check second element `2`: Not in set → add `2` to set: `{1, 2}`
4. Check third element `3`: Not in set → add `3` to set: `{1, 2, 3}`
5. Check fourth element `1`: Already in set → Found duplicate! Return `true`

**Using a sorting approach:**

1. Sort the array: `[1, 1, 2, 3]`
2. Compare adjacent elements:
   - Compare `1` and `1`: They're equal → Found duplicate! Return `true`

The key insight is that duplicates will be adjacent after sorting, or they'll be detected when we try to add them to a set that already contains them.

## Brute Force Approach

The most straightforward approach is to compare every pair of elements in the array:

1. For each element at index `i`
2. Compare it with every element at index `j` where `j > i`
3. If any pair is equal, return `true`
4. If we finish all comparisons without finding duplicates, return `false`

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def containsDuplicate(nums):
    n = len(nums)
    # Outer loop: pick the first element to compare
    for i in range(n):
        # Inner loop: compare with all subsequent elements
        for j in range(i + 1, n):
            if nums[i] == nums[j]:
                return True  # Found a duplicate
    return False  # No duplicates found
```

```javascript
// Time: O(n²) | Space: O(1)
function containsDuplicate(nums) {
  const n = nums.length;
  // Outer loop: pick the first element to compare
  for (let i = 0; i < n; i++) {
    // Inner loop: compare with all subsequent elements
    for (let j = i + 1; j < n; j++) {
      if (nums[i] === nums[j]) {
        return true; // Found a duplicate
      }
    }
  }
  return false; // No duplicates found
}
```

```java
// Time: O(n²) | Space: O(1)
public boolean containsDuplicate(int[] nums) {
    int n = nums.length;
    // Outer loop: pick the first element to compare
    for (int i = 0; i < n; i++) {
        // Inner loop: compare with all subsequent elements
        for (int j = i + 1; j < n; j++) {
            if (nums[i] == nums[j]) {
                return true;  // Found a duplicate
            }
        }
    }
    return false;  // No duplicates found
}
```

</div>

**Why this is insufficient:** With nested loops, this approach has O(n²) time complexity. For an array with 10⁵ elements (a common constraint), this would require up to 5 billion comparisons, which is far too slow. We need a more efficient solution.

## Optimal Solution

There are two optimal approaches with O(n) time complexity using a hash set, and O(n log n) time complexity using sorting. The hash set approach is generally preferred for its better time complexity.

### Hash Set Approach (Recommended)

We use a hash set to track elements we've seen. As we iterate through the array, if we encounter an element already in the set, we've found a duplicate.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def containsDuplicate(nums):
    # Create an empty set to store seen elements
    seen = set()

    # Iterate through each number in the array
    for num in nums:
        # Check if current number is already in our set
        if num in seen:
            return True  # Found a duplicate
        # Add current number to set for future checks
        seen.add(num)

    # If we finish the loop without finding duplicates
    return False
```

```javascript
// Time: O(n) | Space: O(n)
function containsDuplicate(nums) {
  // Create an empty set to store seen elements
  const seen = new Set();

  // Iterate through each number in the array
  for (const num of nums) {
    // Check if current number is already in our set
    if (seen.has(num)) {
      return true; // Found a duplicate
    }
    // Add current number to set for future checks
    seen.add(num);
  }

  // If we finish the loop without finding duplicates
  return false;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean containsDuplicate(int[] nums) {
    // Create an empty set to store seen elements
    Set<Integer> seen = new HashSet<>();

    // Iterate through each number in the array
    for (int num : nums) {
        // Check if current number is already in our set
        if (seen.contains(num)) {
            return true;  // Found a duplicate
        }
        // Add current number to set for future checks
        seen.add(num);
    }

    // If we finish the loop without finding duplicates
    return false;
}
```

</div>

### Sorting Approach (Alternative)

We can also sort the array first, then check adjacent elements for equality.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def containsDuplicate(nums):
    # Sort the array - duplicates will be adjacent
    nums.sort()

    # Check each adjacent pair
    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1]:
            return True  # Found adjacent duplicates

    return False  # No adjacent duplicates found
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function containsDuplicate(nums) {
  // Sort the array - duplicates will be adjacent
  nums.sort((a, b) => a - b);

  // Check each adjacent pair
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) {
      return true; // Found adjacent duplicates
    }
  }

  return false; // No adjacent duplicates found
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
public boolean containsDuplicate(int[] nums) {
    // Sort the array - duplicates will be adjacent
    Arrays.sort(nums);

    // Check each adjacent pair
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i - 1]) {
            return true;  // Found adjacent duplicates
        }
    }

    return false;  // No adjacent duplicates found
}
```

</div>

**Why the hash set approach is generally better:** While both approaches are acceptable for this problem, the hash set approach has better time complexity (O(n) vs O(n log n)). However, the sorting approach uses less space if the sort is in-place (O(1) vs O(n)). The choice depends on whether you prioritize time or space efficiency.

## Complexity Analysis

**Hash Set Approach:**

- **Time Complexity:** O(n) - We iterate through the array once, and set operations (add and contains) are O(1) on average
- **Space Complexity:** O(n) - In the worst case (no duplicates), we store all n elements in the set

**Sorting Approach:**

- **Time Complexity:** O(n log n) - Dominated by the sorting step
- **Space Complexity:** O(1) for in-place sort, O(n) if the sort creates a copy

**Brute Force Approach:**

- **Time Complexity:** O(n²) - Nested loops comparing all pairs
- **Space Complexity:** O(1) - Only using a few variables

## Common Mistakes

1. **Using a list instead of a set for tracking seen elements:** Some candidates use a list to store seen elements, then check `if num in list`. This turns an O(1) operation into O(n), making the overall solution O(n²) again. Always use a hash set for O(1) membership testing.

2. **Forgetting to handle empty or single-element arrays:** While the code handles these cases correctly (returns `false`), candidates should mention them as edge cases. An empty array or single-element array can never have duplicates.

3. **Incorrect loop bounds in sorting approach:** When checking adjacent elements after sorting, start at index 1 and compare with index i-1. Starting at index 0 and comparing with i+1 risks an index out of bounds error at the last element.

4. **Assuming input is always valid:** While not required for this problem, in interviews it's good practice to ask about input constraints. Can the array be null/empty? Are there any constraints on the values?

## When You'll See This Pattern

The "track seen elements in a hash set" pattern appears in many problems where you need to detect duplicates, find missing elements, or check for membership efficiently:

1. **Two Sum (LeetCode #1)** - Uses a hash map to track seen numbers and their indices, similar to how we track seen elements here
2. **Longest Consecutive Sequence (LeetCode #128)** - Uses a hash set to store all numbers for O(1) lookups while finding sequences
3. **Find All Numbers Disappeared in an Array (LeetCode #448)** - Uses a hash set to track which numbers have been seen
4. **Happy Number (LeetCode #202)** - Uses a hash set to detect cycles (repeated numbers)

The sorting approach pattern is also common:

1. **Maximum Product of Three Numbers (LeetCode #628)** - Sorting helps find the largest numbers efficiently
2. **Kth Largest Element in an Array (LeetCode #215)** - Sorting is one approach to find the kth largest
3. **Merge Intervals (LeetCode #56)** - Sorting by start time makes overlapping intervals adjacent

## Key Takeaways

1. **Hash sets provide O(1) membership testing** - When you need to quickly check if you've seen an element before, a hash set is usually the right choice. This pattern transforms O(n²) brute force solutions into O(n) solutions.

2. **Sorting can reveal patterns** - When elements are sorted, duplicates become adjacent, and many other patterns (like finding pairs with certain properties) become easier to identify. The trade-off is O(n log n) time complexity.

3. **Consider the constraints** - For this problem with n ≤ 10⁵, O(n²) is unacceptable (up to 10¹⁰ operations), O(n log n) is acceptable (~1.7×10⁶ operations), and O(n) is ideal (~10⁵ operations). Always check constraints before choosing an approach.

Related problems: [Contains Duplicate II](/problem/contains-duplicate-ii), [Contains Duplicate III](/problem/contains-duplicate-iii), [Make Array Zero by Subtracting Equal Amounts](/problem/make-array-zero-by-subtracting-equal-amounts)
