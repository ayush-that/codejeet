---
title: "How to Solve Special Array With X Elements Greater Than or Equal X — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Special Array With X Elements Greater Than or Equal X. Easy difficulty, 66.8% acceptance rate. Topics: Array, Binary Search, Sorting."
date: "2028-06-24"
category: "dsa-patterns"
tags:
  [
    "special-array-with-x-elements-greater-than-or-equal-x",
    "array",
    "binary-search",
    "sorting",
    "easy",
  ]
---

# How to Solve Special Array With X Elements Greater Than or Equal X

This problem asks us to find a number `x` such that exactly `x` numbers in the array are greater than or equal to `x`. The tricky part is that `x` doesn't need to be in the array, and we need to find this special property efficiently. What makes this interesting is that it's essentially a counting problem that can be optimized with sorting or binary search.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [3, 5, 2, 0, 4, 1]`.

We need to find `x` where exactly `x` numbers are ≥ `x`. Let's test some values:

- `x = 0`: How many numbers ≥ 0? All 6 numbers. But 6 ≠ 0 ❌
- `x = 1`: Numbers ≥ 1: [3, 5, 2, 4, 1] → 5 numbers. 5 ≠ 1 ❌
- `x = 2`: Numbers ≥ 2: [3, 5, 2, 4] → 4 numbers. 4 ≠ 2 ❌
- `x = 3`: Numbers ≥ 3: [3, 5, 4] → 3 numbers. 3 = 3 ✅

So `x = 3` works! Notice that if we sort the array: `[0, 1, 2, 3, 4, 5]`, we can see a pattern:

- For `x = 3`, look at the element at index `n - x = 6 - 3 = 3`, which is `3`.
- All elements from index 3 onward are ≥ 3, and there are exactly 3 of them.

This gives us a key insight: after sorting, the condition "exactly `x` numbers ≥ `x`" becomes equivalent to finding `x` where the element at index `n - x` is ≥ `x`, but the element at index `n - x - 1` (if it exists) is < `x`.

## Brute Force Approach

The brute force solution tries every possible `x` from 0 to `n` (since `x` can't be larger than the array length). For each `x`, we count how many numbers are ≥ `x` by scanning the entire array.

**Why this is inefficient:**

- Time complexity: O(n²) - For each of n+1 possible x values, we scan n elements
- Space complexity: O(1) - We only use a counter

While this works for small arrays, it's too slow for the constraints (n up to 100). Let's see why we need optimization:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def specialArray(nums):
    n = len(nums)

    # Try every possible x from 0 to n
    for x in range(n + 1):
        count = 0

        # Count how many numbers are >= x
        for num in nums:
            if num >= x:
                count += 1

        # Check if exactly x numbers are >= x
        if count == x:
            return x

    return -1
```

```javascript
// Time: O(n²) | Space: O(1)
function specialArray(nums) {
  const n = nums.length;

  // Try every possible x from 0 to n
  for (let x = 0; x <= n; x++) {
    let count = 0;

    // Count how many numbers are >= x
    for (let num of nums) {
      if (num >= x) {
        count++;
      }
    }

    // Check if exactly x numbers are >= x
    if (count === x) {
      return x;
    }
  }

  return -1;
}
```

```java
// Time: O(n²) | Space: O(1)
public int specialArray(int[] nums) {
    int n = nums.length;

    // Try every possible x from 0 to n
    for (int x = 0; x <= n; x++) {
        int count = 0;

        // Count how many numbers are >= x
        for (int num : nums) {
            if (num >= x) {
                count++;
            }
        }

        // Check if exactly x numbers are >= x
        if (count == x) {
            return x;
        }
    }

    return -1;
}
```

</div>

## Optimal Solution

We can optimize by sorting the array first. Once sorted, we can use binary search to find `x` efficiently. Here's the intuition:

1. Sort the array in ascending order
2. For a candidate `x`, we need to find how many numbers are ≥ `x`
3. In a sorted array, we can use binary search to find the first index where element ≥ `x`
4. The count of numbers ≥ `x` is `n - index`
5. We need `n - index == x`

We can iterate through possible `x` values from 0 to `n` and use binary search to check each one in O(log n) time.

<div class="code-group">

```python
# Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
def specialArray(nums):
    n = len(nums)
    nums.sort()  # Step 1: Sort the array

    # Step 2: Try every possible x from 0 to n
    for x in range(n + 1):
        # Step 3: Use binary search to find first index where nums[i] >= x
        left, right = 0, n - 1
        first_greater_equal_idx = n  # Default to n (meaning no element >= x)

        while left <= right:
            mid = left + (right - left) // 2

            if nums[mid] >= x:
                # Found a candidate, but check if there's an earlier one
                first_greater_equal_idx = mid
                right = mid - 1
            else:
                # Current element is too small, search right half
                left = mid + 1

        # Step 4: Count of numbers >= x is n - first_greater_equal_idx
        count = n - first_greater_equal_idx

        # Step 5: Check if condition is satisfied
        if count == x:
            return x

    return -1
```

```javascript
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
function specialArray(nums) {
  const n = nums.length;
  nums.sort((a, b) => a - b); // Step 1: Sort the array

  // Step 2: Try every possible x from 0 to n
  for (let x = 0; x <= n; x++) {
    // Step 3: Use binary search to find first index where nums[i] >= x
    let left = 0,
      right = n - 1;
    let firstGreaterEqualIdx = n; // Default to n (meaning no element >= x)

    while (left <= right) {
      const mid = Math.floor(left + (right - left) / 2);

      if (nums[mid] >= x) {
        // Found a candidate, but check if there's an earlier one
        firstGreaterEqualIdx = mid;
        right = mid - 1;
      } else {
        // Current element is too small, search right half
        left = mid + 1;
      }
    }

    // Step 4: Count of numbers >= x is n - firstGreaterEqualIdx
    const count = n - firstGreaterEqualIdx;

    // Step 5: Check if condition is satisfied
    if (count === x) {
      return x;
    }
  }

  return -1;
}
```

```java
// Time: O(n log n) | Space: O(1) or O(n) depending on sort implementation
public int specialArray(int[] nums) {
    int n = nums.length;
    Arrays.sort(nums);  // Step 1: Sort the array

    // Step 2: Try every possible x from 0 to n
    for (int x = 0; x <= n; x++) {
        // Step 3: Use binary search to find first index where nums[i] >= x
        int left = 0, right = n - 1;
        int firstGreaterEqualIdx = n;  // Default to n (meaning no element >= x)

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] >= x) {
                // Found a candidate, but check if there's an earlier one
                firstGreaterEqualIdx = mid;
                right = mid - 1;
            } else {
                // Current element is too small, search right half
                left = mid + 1;
            }
        }

        // Step 4: Count of numbers >= x is n - firstGreaterEqualIdx
        int count = n - firstGreaterEqualIdx;

        // Step 5: Check if condition is satisfied
        if (count == x) {
            return x;
        }
    }

    return -1;
}
```

</div>

**Alternative optimized approach:** We can also solve this in O(n) time using counting sort since the values are non-negative integers. Create a frequency array and work backwards to accumulate counts.

## Complexity Analysis

**Time Complexity: O(n log n)**

- Sorting takes O(n log n) time
- For each of n+1 possible x values, we perform binary search in O(log n) time
- Total: O(n log n) + O(n log n) = O(n log n)

**Space Complexity: O(1) or O(n)**

- If sorting is done in-place (like Python's Timsort), space is O(1)
- If sorting requires extra space (like merge sort), space is O(n)
- The algorithm itself uses only O(1) extra space beyond sorting

## Common Mistakes

1. **Forgetting that x can be 0**: Some candidates start checking from x = 1, but x = 0 is valid if no numbers are ≥ 0 (though with non-negative integers, this only happens with empty array).

2. **Off-by-one errors in binary search**: When finding the first index where element ≥ x, it's easy to get the boundary conditions wrong. Always test with edge cases like x = 0 and x = n.

3. **Not handling the case when no x satisfies the condition**: The problem requires returning -1 when no such x exists. Some candidates forget this and return 0 or the last checked value.

4. **Assuming x must be in the array**: The problem explicitly states x doesn't need to be in nums. For example, in [2, 3, 3], x = 2 works (2 numbers ≥ 2: [2, 3, 3]), even though 2 is in the array, it could also work when x isn't present.

## When You'll See This Pattern

This problem combines sorting with binary search on the answer space, a common pattern in coding interviews:

1. **"H-Index" (LeetCode 274)**: Almost identical problem - find the largest h where h papers have at least h citations each. The solution uses the same sorting + binary search approach.

2. **"Kth Smallest Element in a Sorted Matrix" (LeetCode 378)**: Uses binary search on the answer space to find the kth smallest element.

3. **"Capacity To Ship Packages Within D Days" (LeetCode 1011)**: Binary search on the possible capacity values to find the minimum capacity that works.

The pattern is: when you need to find a value that satisfies some condition, and you can test whether a candidate value works in better than O(n) time, consider binary search on the answer space.

## Key Takeaways

1. **When to use binary search on answer space**: If you can test whether a candidate solution works in O(f(n)) time, and the answer space is monotonic (if x works, then all values > x or < x also work), binary search can reduce O(n × f(n)) to O(f(n) × log n).

2. **Sorting transforms counting problems**: Many counting problems become easier when the data is sorted. The condition "count of elements ≥ x" becomes a simple index calculation in a sorted array.

3. **Check boundary conditions carefully**: With binary search and counting problems, edge cases (x = 0, x = n, empty array) often reveal implementation bugs.

[Practice this problem on CodeJeet](/problem/special-array-with-x-elements-greater-than-or-equal-x)
