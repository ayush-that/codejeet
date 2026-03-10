---
title: "How to Solve First Bad Version — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode First Bad Version. Easy difficulty, 46.9% acceptance rate. Topics: Binary Search, Interactive."
date: "2026-05-21"
category: "dsa-patterns"
tags: ["first-bad-version", "binary-search", "interactive", "easy"]
---

# How to Solve First Bad Version

You’re given `n` versions of a product, and you have a function `isBadVersion(version)` that tells you whether a given version is bad. Since versions are sequential, once a version is bad, all later versions are also bad. Your task is to find the _first_ bad version while minimizing the number of calls to `isBadVersion`. This problem is interesting because it’s a classic binary search variation—instead of finding an exact match, you’re finding the _first_ occurrence that satisfies a condition in a sorted, boolean sequence.

## Visual Walkthrough

Let’s walk through an example with `n = 8` and the first bad version being `5`. We’ll represent versions 1 through 8, with `F` for good (false) and `T` for bad (true):

**Versions:** [1: F, 2: F, 3: F, 4: F, 5: T, 6: T, 7: T, 8: T]

We start with `left = 1` and `right = 8`.

**Step 1:**  
`mid = (1 + 8) // 2 = 4`  
`isBadVersion(4)` returns `False` (good version).  
Since version 4 is good, the first bad version must be _after_ 4.  
We update `left = mid + 1 = 5`.

**Step 2:**  
`left = 5`, `right = 8`  
`mid = (5 + 8) // 2 = 6`  
`isBadVersion(6)` returns `True` (bad version).  
Version 6 is bad, but we need the _first_ bad version. It could be 6 or an earlier version.  
We update `right = mid = 6` (not `mid - 1` because `mid` might be the first bad version).

**Step 3:**  
`left = 5`, `right = 6`  
`mid = (5 + 6) // 2 = 5`  
`isBadVersion(5)` returns `True` (bad version).  
Again, version 5 is bad, but we need to check if there’s an earlier bad version.  
We update `right = mid = 5`.

**Step 4:**  
`left = 5`, `right = 5`  
The loop ends because `left == right`.  
We return `left` (or `right`), which is `5`—the first bad version.

Notice how we didn’t stop when we found _a_ bad version at step 2; we kept narrowing the search to find the _first_ one.

## Brute Force Approach

A brute force solution would check each version sequentially from 1 to `n`, calling `isBadVersion` until it finds the first `True`. This is intuitive but inefficient for large `n`.

**Why it’s insufficient:**

- **Time Complexity:** O(n) in the worst case (if the first bad version is the last one).
- **Calls to `isBadVersion`:** Up to `n` calls.  
  The problem’s constraints (up to 2³¹ - 1 versions) make this approach too slow. The binary search approach reduces this to O(log n) calls.

## Optimal Solution

The optimal solution uses binary search. The key insight: versions are sorted in a boolean sense (all good versions come before all bad versions). We’re looking for the _first_ `True` in this sorted sequence. Standard binary search finds an exact match; here, we modify it to find the boundary between `False` and `True`.

**Algorithm:**

1. Initialize `left = 1`, `right = n`.
2. While `left < right`:
   - Calculate `mid = left + (right - left) // 2` (prevents integer overflow).
   - If `isBadVersion(mid)` is `True`, the first bad version is at `mid` or earlier. Set `right = mid`.
   - If `isBadVersion(mid)` is `False`, the first bad version is after `mid`. Set `left = mid + 1`.
3. When `left == right`, we’ve found the first bad version. Return `left`.

**Why this works:**

- When `mid` is bad, we can’t discard `mid` because it might be the first bad version. So we set `right = mid`.
- When `mid` is good, we know the first bad version is strictly after `mid`, so we set `left = mid + 1`.
- The loop ends when `left == right`, which is guaranteed to be the first bad version.

<div class="code-group">

```python
# The isBadVersion API is already defined for you.
# def isBadVersion(version: int) -> bool:

# Time: O(log n) | Space: O(1)
# n is the number of versions, log n comes from binary search
class Solution:
    def firstBadVersion(self, n: int) -> int:
        # Step 1: Initialize search boundaries
        # We use 1-based indexing (versions start at 1)
        left, right = 1, n

        # Step 2: Binary search for the first bad version
        # We use left < right (not <=) because we want to find the boundary
        while left < right:
            # Calculate mid point - use this form to prevent integer overflow
            mid = left + (right - left) // 2

            # Step 3: Check if mid version is bad
            if isBadVersion(mid):
                # If mid is bad, the first bad version is at mid or earlier
                # So we move right boundary to mid (not mid-1 because mid might be first)
                right = mid
            else:
                # If mid is good, the first bad version must be after mid
                # So we move left boundary to mid + 1
                left = mid + 1

        # Step 4: When left == right, we've found the first bad version
        return left
```

```javascript
// The isBadVersion API is already defined for you.
// isBadVersion(version: number): boolean

// Time: O(log n) | Space: O(1)
// n is the number of versions, log n comes from binary search
/**
 * @param {number} n
 * @return {number}
 */
var solution = function (n) {
  // Step 1: Initialize search boundaries
  // We use 1-based indexing (versions start at 1)
  let left = 1;
  let right = n;

  // Step 2: Binary search for the first bad version
  // We use left < right (not <=) because we want to find the boundary
  while (left < right) {
    // Calculate mid point - use this form to prevent integer overflow
    const mid = Math.floor(left + (right - left) / 2);

    // Step 3: Check if mid version is bad
    if (isBadVersion(mid)) {
      // If mid is bad, the first bad version is at mid or earlier
      // So we move right boundary to mid (not mid-1 because mid might be first)
      right = mid;
    } else {
      // If mid is good, the first bad version must be after mid
      // So we move left boundary to mid + 1
      left = mid + 1;
    }
  }

  // Step 4: When left == right, we've found the first bad version
  return left;
};
```

```java
/* The isBadVersion API is defined in the parent class VersionControl.
   boolean isBadVersion(int version); */

// Time: O(log n) | Space: O(1)
// n is the number of versions, log n comes from binary search
public class Solution extends VersionControl {
    public int firstBadVersion(int n) {
        // Step 1: Initialize search boundaries
        // We use 1-based indexing (versions start at 1)
        int left = 1;
        int right = n;

        // Step 2: Binary search for the first bad version
        // We use left < right (not <=) because we want to find the boundary
        while (left < right) {
            // Calculate mid point - use this form to prevent integer overflow
            int mid = left + (right - left) / 2;

            // Step 3: Check if mid version is bad
            if (isBadVersion(mid)) {
                // If mid is bad, the first bad version is at mid or earlier
                // So we move right boundary to mid (not mid-1 because mid might be first)
                right = mid;
            } else {
                // If mid is good, the first bad version must be after mid
                // So we move left boundary to mid + 1
                left = mid + 1;
            }
        }

        // Step 4: When left == right, we've found the first bad version
        return left;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- Each iteration of the while loop halves the search space.
- Starting with `n` versions, after `k` iterations, the search space is `n / 2^k`.
- The loop ends when the search space is 1, so `n / 2^k = 1` ⇒ `k = log₂ n`.
- Thus, we make O(log n) calls to `isBadVersion`.

**Space Complexity:** O(1)

- We only use a constant amount of extra space for variables `left`, `right`, and `mid`.
- No additional data structures are used.

## Common Mistakes

1. **Using `mid = (left + right) // 2` without considering overflow**  
   When `left` and `right` are large (up to 2³¹ - 1), their sum can exceed the maximum integer value, causing overflow.  
   **Fix:** Use `mid = left + (right - left) // 2`.

2. **Setting `right = mid - 1` when `isBadVersion(mid)` is true**  
   If `mid` is the first bad version, setting `right = mid - 1` would skip it, and you’d return a version after the first bad one.  
   **Fix:** When `mid` is bad, set `right = mid` (not `mid - 1`) because `mid` might be the first bad version.

3. **Using `while (left <= right)` instead of `while (left < right)`**  
   With `left <= right`, you might get stuck in an infinite loop or need extra checks. The standard binary search for exact matches uses `<=`, but for finding boundaries, `<` is cleaner.  
   **Fix:** Use `while (left < right)` and return `left` (or `right`) when they converge.

4. **Forgetting that versions start at 1, not 0**  
   Some candidates initialize `left = 0`, but versions are 1-indexed.  
   **Fix:** Initialize `left = 1`, `right = n`.

## When You'll See This Pattern

This "find the first occurrence" binary search pattern appears whenever you have a sorted sequence (or a monotonic property) and need to find the boundary where a condition changes from false to true (or vice versa).

**Related LeetCode problems:**

1. **Find First and Last Position of Element in Sorted Array (Medium)**  
   Similar to finding the first bad version, but you need to find both the first and last occurrence of a target. You can use two binary searches: one for the left boundary (like this problem) and one for the right boundary.

2. **Search Insert Position (Easy)**  
   You’re given a sorted array and a target; return the index where the target would be inserted. This is essentially finding the first position where the element is greater than or equal to the target—another boundary search.

3. **Guess Number Higher or Lower (Easy)**  
   Almost identical to this problem, but instead of `isBadVersion`, you have a `guess` function that tells you if your guess is higher, lower, or correct. You’re finding the exact match rather than a boundary, but the binary search structure is the same.

## Key Takeaways

- **Recognize the pattern:** When you need to find the _first_ or _last_ occurrence in a sorted sequence (or any monotonic function), think binary search.
- **Modify standard binary search:** For finding boundaries, adjust how you update `left` and `right`. When the condition is met at `mid`, don’t discard `mid`—it might be the boundary.
- **Prevent overflow:** Always use `mid = left + (right - left) // 2` instead of `(left + right) // 2` in languages with fixed integer sizes.

**Related problems:** [Find First and Last Position of Element in Sorted Array](/problem/find-first-and-last-position-of-element-in-sorted-array), [Search Insert Position](/problem/search-insert-position), [Guess Number Higher or Lower](/problem/guess-number-higher-or-lower)
