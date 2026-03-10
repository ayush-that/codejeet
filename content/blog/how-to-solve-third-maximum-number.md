---
title: "How to Solve Third Maximum Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Third Maximum Number. Easy difficulty, 38.9% acceptance rate. Topics: Array, Sorting."
date: "2026-12-11"
category: "dsa-patterns"
tags: ["third-maximum-number", "array", "sorting", "easy"]
---

# How to Solve Third Maximum Number

You're given an integer array `nums` and need to return the third distinct maximum number. If it doesn't exist, return the maximum number instead. What makes this problem interesting is that it looks simple but has several edge cases that can trip you up: duplicate values, negative numbers, and arrays with fewer than three distinct elements. You need to track the top three distinct maximums without sorting the entire array.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 2, 1, 5, 5, 4]`

We need to find the third distinct maximum. The distinct values are: `[1, 2, 3, 4, 5]`. Sorted in descending order: `[5, 4, 3, 2, 1]`. The third distinct maximum is `3`.

Now let's walk through how we'd find this without sorting:

1. Initialize three variables to track our top three: `first`, `second`, `third` = `None`
2. Process each number:
   - `3`: first = 3
   - `2`: 2 < 3, so second = 2
   - `1`: 1 < 2, so third = 1
   - `5`: 5 > 3, so shift values: third = 2, second = 3, first = 5
   - `5`: equal to first, skip (distinct values only)
   - `4`: 4 > 3 but < 5, so shift: third = 3, second = 4, first = 5

After processing, we have first=5, second=4, third=3. Since third exists, we return 3.

What if we have `nums = [1, 2]`? Distinct values: `[1, 2]`. We only have two distinct values, so no third maximum exists. We'd return the maximum, which is 2.

## Brute Force Approach

The most straightforward approach is to:

1. Remove duplicates (convert to set)
2. Sort in descending order
3. Check if we have at least 3 elements
   - If yes, return the third element (index 2)
   - If no, return the maximum (first element)

While this works, it's inefficient for large arrays because sorting takes O(n log n) time. We can do better with a single pass through the array.

However, let's see what the brute force looks like:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def thirdMax(nums):
    # Step 1: Get distinct values
    distinct = list(set(nums))

    # Step 2: Sort in descending order
    distinct.sort(reverse=True)

    # Step 3: Check if we have at least 3 distinct values
    if len(distinct) >= 3:
        return distinct[2]
    else:
        return distinct[0] if distinct else None
```

```javascript
// Time: O(n log n) | Space: O(n)
function thirdMax(nums) {
  // Step 1: Get distinct values
  const distinct = [...new Set(nums)];

  // Step 2: Sort in descending order
  distinct.sort((a, b) => b - a);

  // Step 3: Check if we have at least 3 distinct values
  if (distinct.length >= 3) {
    return distinct[2];
  } else {
    return distinct[0] || null;
  }
}
```

```java
// Time: O(n log n) | Space: O(n)
public int thirdMax(int[] nums) {
    // Step 1: Get distinct values
    Set<Integer> distinctSet = new HashSet<>();
    for (int num : nums) {
        distinctSet.add(num);
    }

    // Step 2: Convert to list and sort in descending order
    List<Integer> distinct = new ArrayList<>(distinctSet);
    Collections.sort(distinct, Collections.reverseOrder());

    // Step 3: Check if we have at least 3 distinct values
    if (distinct.size() >= 3) {
        return distinct.get(2);
    } else {
        return distinct.get(0);
    }
}
```

</div>

The problem with this approach is the O(n log n) time complexity. For large arrays, this is inefficient when we only need to track the top three values.

## Optimal Solution

We can solve this in O(n) time with a single pass through the array. The key insight is to maintain three variables tracking the first, second, and third maximum distinct values. As we iterate through the array, we update these variables appropriately.

Important details:

1. We need to handle `Integer.MIN_VALUE` in Java or negative infinity in Python/JavaScript since the array can contain `Integer.MIN_VALUE` itself
2. We need to track whether we've actually found three distinct values
3. We need to handle duplicates properly

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def thirdMax(nums):
    # Initialize three variables to track top three distinct maximums
    # We use None instead of negative infinity to track if we've actually found values
    first = second = third = None

    for num in nums:
        # Skip if num equals any of our current top three (distinct values only)
        if num == first or num == second or num == third:
            continue

        # Update first, second, third based on the current number
        if first is None or num > first:
            # Current number is larger than first maximum
            # Shift everything down: third = second, second = first, first = num
            third = second
            second = first
            first = num
        elif second is None or num > second:
            # Current number is between first and second
            # Shift: third = second, second = num
            third = second
            second = num
        elif third is None or num > third:
            # Current number is between second and third
            # Just update third
            third = num

    # If third maximum exists, return it. Otherwise return first maximum.
    return third if third is not None else first
```

```javascript
// Time: O(n) | Space: O(1)
function thirdMax(nums) {
  // Initialize three variables to track top three distinct maximums
  // We use null instead of -Infinity to track if we've actually found values
  let first = null;
  let second = null;
  let third = null;

  for (let num of nums) {
    // Skip if num equals any of our current top three (distinct values only)
    if (num === first || num === second || num === third) {
      continue;
    }

    // Update first, second, third based on the current number
    if (first === null || num > first) {
      // Current number is larger than first maximum
      // Shift everything down: third = second, second = first, first = num
      third = second;
      second = first;
      first = num;
    } else if (second === null || num > second) {
      // Current number is between first and second
      // Shift: third = second, second = num
      third = second;
      second = num;
    } else if (third === null || num > third) {
      // Current number is between second and third
      // Just update third
      third = num;
    }
  }

  // If third maximum exists, return it. Otherwise return first maximum.
  return third !== null ? third : first;
}
```

```java
// Time: O(n) | Space: O(1)
public int thirdMax(int[] nums) {
    // Use Long instead of Integer to handle Integer.MIN_VALUE case
    Long first = null;
    Long second = null;
    Long third = null;

    for (int num : nums) {
        long current = (long) num;

        // Skip if num equals any of our current top three (distinct values only)
        if (current == first || current == second || current == third) {
            continue;
        }

        // Update first, second, third based on the current number
        if (first == null || current > first) {
            // Current number is larger than first maximum
            // Shift everything down: third = second, second = first, first = current
            third = second;
            second = first;
            first = current;
        } else if (second == null || current > second) {
            // Current number is between first and second
            // Shift: third = second, second = current
            third = second;
            second = current;
        } else if (third == null || current > third) {
            // Current number is between second and third
            // Just update third
            third = current;
        }
    }

    // If third maximum exists, return it. Otherwise return first maximum.
    return third != null ? third.intValue() : first.intValue();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing constant-time operations for each element
- The comparisons and assignments inside the loop are O(1)
- Total: O(n) where n is the length of the input array

**Space Complexity: O(1)**

- We only use three variables to track the top three values (plus loop variables)
- No additional data structures that grow with input size
- Even with the Long wrapper in Java, it's still constant space

## Common Mistakes

1. **Not handling duplicates properly**: Candidates often forget that we need the third _distinct_ maximum. If you don't skip duplicates, `[2, 2, 3, 1]` would incorrectly return 2 as the third maximum instead of 1.

2. **Using Integer.MIN_VALUE as initial value in Java**: If the array contains `Integer.MIN_VALUE`, you can't distinguish between "we found Integer.MIN_VALUE" and "we haven't found a third value yet." That's why we use `Long` or `null` to track initialization state.

3. **Incorrect update logic when shifting values**: When you find a new maximum, you need to shift all three values: `third = second`, `second = first`, `first = num`. A common mistake is doing these assignments in the wrong order, losing values in the process.

4. **Returning the wrong value when third doesn't exist**: The problem says to return the maximum if the third distinct maximum doesn't exist. Some candidates return 0 or -1 instead of the actual maximum.

## When You'll See This Pattern

This "track top K elements" pattern appears in many problems:

1. **Kth Largest Element in an Array (Medium)**: This is the generalized version where you need to find the kth largest element. The same single-pass tracking approach works for small k, though for larger k you'd typically use a min-heap.

2. **Top K Frequent Elements (Medium)**: While this uses a frequency map and heap, the core idea of tracking the "top K" of something is similar.

3. **Find Median from Data Stream (Hard)**: This maintains the top half and bottom half of numbers seen so far, using two heaps to efficiently track "middle" elements.

The pattern is: when you need to track extreme values (maximums, minimums, or kth extremes) and the array is too large to sort, consider maintaining a small set of candidate values that you update as you process each element.

## Key Takeaways

1. **For "top K" problems with small K, consider maintaining K variables** instead of sorting. This gives you O(n) time instead of O(n log n).

2. **Always think about initialization values** when tracking extremes. Using `null` or a special sentinel value helps distinguish between "not found yet" and "found the minimum/maximum possible value."

3. **Pay attention to the word "distinct"** in problem statements. Many array problems require handling duplicates specially, either by skipping them or counting them differently.

Related problems: [Kth Largest Element in an Array](/problem/kth-largest-element-in-an-array), [Neither Minimum nor Maximum](/problem/neither-minimum-nor-maximum)
