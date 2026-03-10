---
title: "How to Solve Find the Distance Value Between Two Arrays — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find the Distance Value Between Two Arrays. Easy difficulty, 71.5% acceptance rate. Topics: Array, Two Pointers, Binary Search, Sorting."
date: "2026-10-08"
category: "dsa-patterns"
tags:
  ["find-the-distance-value-between-two-arrays", "array", "two-pointers", "binary-search", "easy"]
---

# How to Solve Find the Distance Value Between Two Arrays

This problem asks us to count how many elements in the first array are "far enough" from all elements in the second array. Specifically, for each element in `arr1`, we need to check if there exists any element in `arr2` within distance `d` (inclusive). If no such element exists, we count it. The challenge lies in doing this efficiently when arrays can be large—a brute force check for every pair would be too slow.

What makes this problem interesting is that it appears simple but has multiple optimization paths. You can solve it with binary search after sorting, or with two pointers. The key insight is that we don't need to compare every `arr1[i]` with every `arr2[j]`—we just need to know if any `arr2[j]` falls within the range `[arr1[i]-d, arr1[i]+d]`.

## Visual Walkthrough

Let's trace through an example to build intuition:

```
arr1 = [4, 5, 8]
arr2 = [10, 9, 1, 8]
d = 2
```

We need to count elements in `arr1` where NO element in `arr2` satisfies `|arr1[i] - arr2[j]| <= 2`.

**For arr1[0] = 4:**

- Check arr2[0] = 10: |4-10| = 6 > 2 ✓
- Check arr2[1] = 9: |4-9| = 5 > 2 ✓
- Check arr2[2] = 1: |4-1| = 3 > 2 ✓
- Check arr2[3] = 8: |4-8| = 4 > 2 ✓
  All checks pass (all distances > 2), so we count this element.

**For arr1[1] = 5:**

- Check arr2[0] = 10: |5-10| = 5 > 2 ✓
- Check arr2[1] = 9: |5-9| = 4 > 2 ✓
- Check arr2[2] = 1: |5-1| = 4 > 2 ✓
- Check arr2[3] = 8: |5-8| = 3 > 2 ✓
  All checks pass, so we count this element.

**For arr1[2] = 8:**

- Check arr2[0] = 10: |8-10| = 2 ≤ 2 ✗
  Found an element within distance! We stop checking and don't count this element.

Final count: 2 elements (4 and 5).

The brute force approach does exactly this—nested loops checking every pair. But with large arrays (up to 500 elements each), 500×500 = 250,000 operations is acceptable for an "Easy" problem. However, we can do better with sorting and binary search.

## Brute Force Approach

The most straightforward solution uses two nested loops: for each element in `arr1`, check it against every element in `arr2`. If we find any `arr2[j]` within distance `d`, we skip that `arr1[i]`. Otherwise, we increment our count.

Why is this acceptable but not optimal? With constraints up to 500 elements, O(n×m) = O(250,000) operations is fine. But if arrays were larger (say 10,000 elements each), 100 million operations would be too slow. The optimal solution prepares `arr2` once and uses binary search for each `arr1[i]`.

<div class="code-group">

```python
# Time: O(n×m) | Space: O(1)
def findTheDistanceValue(arr1, arr2, d):
    """
    Brute force solution: Check every pair
    """
    count = 0

    # For each element in arr1
    for num1 in arr1:
        valid = True

        # Check against all elements in arr2
        for num2 in arr2:
            # If any arr2 element is within distance d, mark as invalid
            if abs(num1 - num2) <= d:
                valid = False
                break  # No need to check further for this num1

        # If no arr2 element was within distance d, count it
        if valid:
            count += 1

    return count
```

```javascript
// Time: O(n×m) | Space: O(1)
function findTheDistanceValue(arr1, arr2, d) {
  let count = 0;

  // For each element in arr1
  for (let i = 0; i < arr1.length; i++) {
    let valid = true;

    // Check against all elements in arr2
    for (let j = 0; j < arr2.length; j++) {
      // If any arr2 element is within distance d, mark as invalid
      if (Math.abs(arr1[i] - arr2[j]) <= d) {
        valid = false;
        break; // No need to check further for this arr1[i]
      }
    }

    // If no arr2 element was within distance d, count it
    if (valid) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n×m) | Space: O(1)
public int findTheDistanceValue(int[] arr1, int[] arr2, int d) {
    int count = 0;

    // For each element in arr1
    for (int i = 0; i < arr1.length; i++) {
        boolean valid = true;

        // Check against all elements in arr2
        for (int j = 0; j < arr2.length; j++) {
            // If any arr2 element is within distance d, mark as invalid
            if (Math.abs(arr1[i] - arr2[j]) <= d) {
                valid = false;
                break;  // No need to check further for this arr1[i]
            }
        }

        // If no arr2 element was within distance d, count it
        if (valid) {
            count++;
        }
    }

    return count;
}
```

</div>

## Optimal Solution

The optimal approach sorts `arr2` and uses binary search. For each `arr1[i]`, we want to know: is there any element in `arr2` between `arr1[i]-d` and `arr1[i]+d`?

After sorting `arr2`, we can use binary search to find the smallest element in `arr2` that is ≥ `arr1[i]-d`. If that element exists and is ≤ `arr1[i]+d`, then we have a conflict. Otherwise, no element in `arr2` falls within the forbidden range.

Why does this work? When `arr2` is sorted, all elements within the range `[arr1[i]-d, arr1[i]+d]` will be contiguous. We just need to check if the range contains any elements from `arr2`.

<div class="code-group">

```python
# Time: O((n+m)log m) | Space: O(1) or O(log m) for sorting
def findTheDistanceValue(arr1, arr2, d):
    """
    Optimal solution using sorting and binary search
    """
    # Step 1: Sort arr2 to enable binary search
    arr2.sort()

    count = 0

    # Step 2: For each element in arr1
    for num in arr1:
        # We need to check if any element in arr2 falls in [num-d, num+d]
        # Using binary search, find the smallest element >= num-d
        left, right = 0, len(arr2) - 1
        found = False

        while left <= right:
            mid = left + (right - left) // 2

            # If arr2[mid] is within the forbidden range, we found a conflict
            if abs(arr2[mid] - num) <= d:
                found = True
                break
            # If arr2[mid] is too small (less than num-d), search right half
            elif arr2[mid] < num - d:
                left = mid + 1
            # If arr2[mid] is too large (greater than num+d), search left half
            else:  # arr2[mid] > num + d
                right = mid - 1

        # If no element in arr2 is within distance d, count this element
        if not found:
            count += 1

    return count
```

```javascript
// Time: O((n+m)log m) | Space: O(1) or O(log m) for sorting
function findTheDistanceValue(arr1, arr2, d) {
  // Step 1: Sort arr2 to enable binary search
  arr2.sort((a, b) => a - b);

  let count = 0;

  // Step 2: For each element in arr1
  for (let i = 0; i < arr1.length; i++) {
    const num = arr1[i];

    // We need to check if any element in arr2 falls in [num-d, num+d]
    // Using binary search, find if any element is within the range
    let left = 0,
      right = arr2.length - 1;
    let found = false;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      // If arr2[mid] is within the forbidden range, we found a conflict
      if (Math.abs(arr2[mid] - num) <= d) {
        found = true;
        break;
      }
      // If arr2[mid] is too small (less than num-d), search right half
      else if (arr2[mid] < num - d) {
        left = mid + 1;
      }
      // If arr2[mid] is too large (greater than num+d), search left half
      else {
        // arr2[mid] > num + d
        right = mid - 1;
      }
    }

    // If no element in arr2 is within distance d, count this element
    if (!found) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O((n+m)log m) | Space: O(1) or O(log m) for sorting
public int findTheDistanceValue(int[] arr1, int[] arr2, int d) {
    // Step 1: Sort arr2 to enable binary search
    Arrays.sort(arr2);

    int count = 0;

    // Step 2: For each element in arr1
    for (int num : arr1) {
        // We need to check if any element in arr2 falls in [num-d, num+d]
        // Using binary search, find if any element is within the range
        int left = 0, right = arr2.length - 1;
        boolean found = false;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            // If arr2[mid] is within the forbidden range, we found a conflict
            if (Math.abs(arr2[mid] - num) <= d) {
                found = true;
                break;
            }
            // If arr2[mid] is too small (less than num-d), search right half
            else if (arr2[mid] < num - d) {
                left = mid + 1;
            }
            // If arr2[mid] is too large (greater than num+d), search left half
            else {  // arr2[mid] > num + d
                right = mid - 1;
            }
        }

        // If no element in arr2 is within distance d, count this element
        if (!found) {
            count++;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Sorting `arr2`: O(m log m) where m = length of arr2
- For each of n elements in arr1, we perform binary search: O(n log m)
- Total: O((n + m) log m)

**Space Complexity:**

- O(1) for the algorithm itself (not counting input storage)
- Sorting typically uses O(log m) stack space for quicksort or O(m) for mergesort, depending on implementation

Compared to brute force O(n×m), this is much better when arrays are large. For the given constraints (500 elements max), both approaches work, but the optimal solution demonstrates better algorithmic thinking.

## Common Mistakes

1. **Forgetting to sort arr2 before binary search**: Binary search only works on sorted arrays. If you skip the sorting step, your binary search will give incorrect results.

2. **Incorrect binary search condition**: The trickiest part is the condition `abs(arr2[mid] - num) <= d`. Some candidates try to check if `arr2[mid]` is between `num-d` and `num+d`, which is correct, but they forget the absolute value handles both sides of the range.

3. **Off-by-one errors in binary search**: Classic binary search pitfalls include using `while (left < right)` instead of `while (left <= right)`, or incorrect midpoint calculation `(left + right) / 2` which can overflow in Java. Use `left + (right - left) / 2` instead.

4. **Not breaking early when found**: Once you find an `arr2[j]` within distance `d` for a given `arr1[i]`, you should stop checking further `arr2` elements for that `arr1[i]`. This optimization is crucial for the brute force approach.

## When You'll See This Pattern

This problem combines sorting with binary search to answer range queries—a common pattern in coding interviews:

1. **Two Sum II - Input Array Is Sorted (LeetCode 167)**: After sorting, you use two pointers to find pairs summing to a target. Similar idea of preparing data once then answering queries efficiently.

2. **Find K Closest Elements (LeetCode 658)**: Find k elements closest to a target value. Uses binary search to find the starting point of the range, similar to how we find elements within `[num-d, num+d]`.

3. **Heaters (LeetCode 475)**: Find the minimum radius so all houses are covered by heaters. Uses binary search on the radius and checks if all houses have a heater within that distance—very similar to checking if any `arr2[j]` is within distance `d` of `arr1[i]`.

The core pattern: When you need to check if elements from one set are "close" to elements from another set, sort one set and use binary search (or two pointers) to answer queries efficiently.

## Key Takeaways

1. **Preprocessing enables efficient queries**: By sorting `arr2` once (O(m log m)), we can answer "is there an element within distance d?" in O(log m) time instead of O(m). This tradeoff is often worth it when answering many queries.

2. **Range checking with binary search**: To check if any element falls within `[num-d, num+d]`, we don't need to find the exact element—we just need to know if the range contains any elements from the sorted array. Binary search can answer this by looking for elements ≥ `num-d` and checking if they're ≤ `num+d`.

3. **Absolute distance problems often involve sorting**: When dealing with distances between elements from two sets, sorting one or both sets is a common first step. This transforms the problem from checking all pairs to a more structured search.

[Practice this problem on CodeJeet](/problem/find-the-distance-value-between-two-arrays)
