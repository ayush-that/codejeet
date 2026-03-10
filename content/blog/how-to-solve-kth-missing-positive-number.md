---
title: "How to Solve Kth Missing Positive Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Kth Missing Positive Number. Easy difficulty, 63.2% acceptance rate. Topics: Array, Binary Search."
date: "2026-12-13"
category: "dsa-patterns"
tags: ["kth-missing-positive-number", "array", "binary-search", "easy"]
---

# How to Solve Kth Missing Positive Number

You're given a sorted array of positive integers and need to find the kth positive integer that's missing from the array. What makes this problem interesting is that while it seems like a simple counting problem, the optimal solution uses binary search in a clever way that doesn't directly search for values but rather counts missing numbers.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `arr = [2, 3, 4, 7, 11]` and `k = 5`.

**Understanding what "missing" means:**
The complete sequence of positive integers is: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, ...
Our array contains: 2, 3, 4, 7, 11

Missing numbers are: 1, 5, 6, 8, 9, 10, 12, ...
The 1st missing is 1, 2nd is 5, 3rd is 6, 4th is 8, 5th is 9, 6th is 10, etc.

**Key insight:** At any position `i` in the array, the number of missing positive integers before `arr[i]` is `arr[i] - (i + 1)`. Let's verify:

- At index 0 (arr[0] = 2): Missing count = 2 - (0 + 1) = 1 (missing: 1)
- At index 1 (arr[1] = 3): Missing count = 3 - (1 + 1) = 1 (missing: 1)
- At index 2 (arr[2] = 4): Missing count = 4 - (2 + 1) = 1 (missing: 1)
- At index 3 (arr[3] = 7): Missing count = 7 - (3 + 1) = 3 (missing: 1, 5, 6)
- At index 4 (arr[4] = 11): Missing count = 11 - (4 + 1) = 6 (missing: 1, 5, 6, 8, 9, 10)

We need the 5th missing number. Looking at index 3, we have 3 missing numbers before it. Looking at index 4, we have 6 missing numbers before it. So the 5th missing number must be between arr[3] = 7 and arr[4] = 11.

**Finding the exact value:** If we know that at index 3 we have 3 missing numbers, and we need the 5th missing, we need 2 more missing numbers after arr[3]. The answer is `arr[3] + (k - missing_count_at_index_3) = 7 + (5 - 3) = 9`.

Let's verify: After 7, the missing numbers are 8, 9, 10. The 1st missing after 7 is 8, 2nd is 9. Since we needed 2 more after the 3 we already had, we get 9.

## Brute Force Approach

The most straightforward approach is to iterate through positive integers starting from 1, checking which ones are missing from the array, and counting them until we find the kth one.

**Why this works:** We simply simulate the process of finding missing numbers by comparing each positive integer against the sorted array.

**Why it's inefficient:** In the worst case where k is large (up to 1000) and the array contains large numbers, we might need to check up to `arr[-1] + k` numbers, which could be significantly larger than the array size. This gives us O(n + k) time complexity where n is the array length.

<div class="code-group">

```python
# Time: O(n + k) | Space: O(1)
def findKthPositive(arr, k):
    """
    Brute force solution: Check each positive integer
    """
    current = 1  # The positive integer we're checking
    i = 0        # Pointer in the array
    missing_count = 0

    while True:
        # If we haven't exhausted the array and current equals arr[i]
        if i < len(arr) and current == arr[i]:
            i += 1  # Move to next array element
        else:
            missing_count += 1  # Found a missing number
            if missing_count == k:
                return current  # Found the kth missing

        current += 1  # Check next positive integer
```

```javascript
// Time: O(n + k) | Space: O(1)
function findKthPositive(arr, k) {
  /**
   * Brute force solution: Check each positive integer
   */
  let current = 1; // The positive integer we're checking
  let i = 0; // Pointer in the array
  let missingCount = 0;

  while (true) {
    // If we haven't exhausted the array and current equals arr[i]
    if (i < arr.length && current === arr[i]) {
      i++; // Move to next array element
    } else {
      missingCount++; // Found a missing number
      if (missingCount === k) {
        return current; // Found the kth missing
      }
    }

    current++; // Check next positive integer
  }
}
```

```java
// Time: O(n + k) | Space: O(1)
public int findKthPositive(int[] arr, int k) {
    /**
     * Brute force solution: Check each positive integer
     */
    int current = 1;  // The positive integer we're checking
    int i = 0;        // Pointer in the array
    int missingCount = 0;

    while (true) {
        // If we haven't exhausted the array and current equals arr[i]
        if (i < arr.length && current == arr[i]) {
            i++;  // Move to next array element
        } else {
            missingCount++;  // Found a missing number
            if (missingCount == k) {
                return current;  // Found the kth missing
            }
        }

        current++;  // Check next positive integer
    }
}
```

</div>

## Optimal Solution

The optimal solution uses binary search to find where the kth missing number would be located. The key insight is that for any index `i`, the number of missing positive integers before `arr[i]` is `arr[i] - (i + 1)`. We can use binary search to find the smallest index where the missing count is greater than or equal to k.

**Why binary search works here:** The missing count `arr[i] - (i + 1)` is non-decreasing as we move through the array (since the array is strictly increasing). This monotonic property allows us to use binary search.

**Algorithm steps:**

1. Use binary search to find the first position where the number of missing numbers is ≥ k
2. If we find such a position, the answer is `arr[left - 1] + (k - missing_count_at_left_minus_1)`
3. If all positions have missing count < k, the answer is `arr[-1] + (k - missing_count_at_last_index)`

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def findKthPositive(arr, k):
    """
    Optimal binary search solution

    The key insight: For any index i, the number of missing
    positive integers before arr[i] is arr[i] - (i + 1).

    We binary search for the smallest index where missing count >= k.
    """
    left, right = 0, len(arr) - 1

    # Binary search for the first position where missing count >= k
    while left <= right:
        mid = left + (right - left) // 2

        # Calculate missing numbers before arr[mid]
        missing_count = arr[mid] - (mid + 1)

        if missing_count < k:
            # Not enough missing numbers, search right half
            left = mid + 1
        else:
            # Too many or just enough missing numbers, search left half
            right = mid - 1

    # After binary search, left points to first index with missing count >= k
    # OR left = len(arr) if all indices have missing count < k

    # If left == 0, no array elements before, answer is k
    # Otherwise, answer = arr[left - 1] + (k - missing_count_at_left_minus_1)
    if left == 0:
        return k
    else:
        missing_before_left = arr[left - 1] - left  # arr[left-1] - ((left-1) + 1)
        return arr[left - 1] + (k - missing_before_left)
```

```javascript
// Time: O(log n) | Space: O(1)
function findKthPositive(arr, k) {
  /**
   * Optimal binary search solution
   *
   * The key insight: For any index i, the number of missing
   * positive integers before arr[i] is arr[i] - (i + 1).
   *
   * We binary search for the smallest index where missing count >= k.
   */
  let left = 0,
    right = arr.length - 1;

  // Binary search for the first position where missing count >= k
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    // Calculate missing numbers before arr[mid]
    const missingCount = arr[mid] - (mid + 1);

    if (missingCount < k) {
      // Not enough missing numbers, search right half
      left = mid + 1;
    } else {
      // Too many or just enough missing numbers, search left half
      right = mid - 1;
    }
  }

  // After binary search, left points to first index with missing count >= k
  // OR left = arr.length if all indices have missing count < k

  // If left == 0, no array elements before, answer is k
  // Otherwise, answer = arr[left - 1] + (k - missing_count_at_left_minus_1)
  if (left === 0) {
    return k;
  } else {
    const missingBeforeLeft = arr[left - 1] - left; // arr[left-1] - ((left-1) + 1)
    return arr[left - 1] + (k - missingBeforeLeft);
  }
}
```

```java
// Time: O(log n) | Space: O(1)
public int findKthPositive(int[] arr, int k) {
    /**
     * Optimal binary search solution
     *
     * The key insight: For any index i, the number of missing
     * positive integers before arr[i] is arr[i] - (i + 1).
     *
     * We binary search for the smallest index where missing count >= k.
     */
    int left = 0, right = arr.length - 1;

    // Binary search for the first position where missing count >= k
    while (left <= right) {
        int mid = left + (right - left) / 2;

        // Calculate missing numbers before arr[mid]
        int missingCount = arr[mid] - (mid + 1);

        if (missingCount < k) {
            // Not enough missing numbers, search right half
            left = mid + 1;
        } else {
            // Too many or just enough missing numbers, search left half
            right = mid - 1;
        }
    }

    // After binary search, left points to first index with missing count >= k
    // OR left = arr.length if all indices have missing count < k

    // If left == 0, no array elements before, answer is k
    // Otherwise, answer = arr[left - 1] + (k - missing_count_at_left_minus_1)
    if (left == 0) {
        return k;
    } else {
        int missingBeforeLeft = arr[left - 1] - left;  // arr[left-1] - ((left-1) + 1)
        return arr[left - 1] + (k - missingBeforeLeft);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log n)**

- The binary search runs in O(log n) time where n is the length of the array
- Each iteration performs constant time operations (arithmetic and comparisons)
- This is significantly faster than the O(n + k) brute force approach

**Space Complexity: O(1)**

- We only use a constant amount of extra space for variables (left, right, mid, etc.)
- No additional data structures are created

## Common Mistakes

1. **Off-by-one errors in the missing count formula:** The correct formula is `arr[i] - (i + 1)`, not `arr[i] - i`. Remember that array indices start at 0, but we're counting positive integers starting from 1. At index 0, if arr[0] = 2, we're missing 1 number (1), which is `2 - (0 + 1) = 1`.

2. **Not handling the case where k is smaller than all missing counts:** If k is very small (e.g., k=1 and arr=[100,200]), the answer is simply k. This happens when left = 0 after binary search. Always check this edge case.

3. **Incorrect binary search termination condition:** The standard binary search pattern `while left <= right` ensures we check all possibilities. Using `while left < right` might miss cases.

4. **Forgetting that the answer can be after the last array element:** When k is larger than the missing count at the last index, the answer is `arr[-1] + (k - missing_count_at_last_index)`. The binary search handles this naturally because left will be `len(arr)` in this case.

## When You'll See This Pattern

This problem teaches a pattern of using binary search on **derived properties** rather than directly on array values. You're not searching for a specific value in the array, but for a position where a calculated property (missing count) meets a condition.

**Related problems:**

1. **Missing Element in Sorted Array (LeetCode 1060)** - Almost identical problem, just framed differently
2. **Search Insert Position (LeetCode 35)** - Binary search for position where a property (value ≥ target) first occurs
3. **First Bad Version (LeetCode 278)** - Binary search for first position where a property (isBadVersion) is true
4. **Find Smallest Letter Greater Than Target (LeetCode 744)** - Binary search for first position where letter > target

## Key Takeaways

1. **Binary search works on any monotonic property:** You don't need to search for a specific value in the array. If you can derive a property from array elements that increases (or decreases) monotonically, you can use binary search to find where that property crosses a threshold.

2. **The missing count formula is key:** `arr[i] - (i + 1)` gives the number of missing positive integers before position i. This insight transforms the problem from "check each number" to "calculate and search."

3. **Edge cases matter:** Always test with k=1, k very large, empty arrays, and arrays starting with numbers > 1. These edge cases reveal flaws in the binary search implementation.

Related problems: [Append K Integers With Minimal Sum](/problem/append-k-integers-with-minimal-sum)
