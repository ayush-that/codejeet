---
title: "How to Solve Find the Integer Added to Array II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Integer Added to Array II. Medium difficulty, 32.8% acceptance rate. Topics: Array, Two Pointers, Sorting, Enumeration."
date: "2029-07-21"
category: "dsa-patterns"
tags: ["find-the-integer-added-to-array-ii", "array", "two-pointers", "sorting", "medium"]
---

# How to Solve Find the Integer Added to Array II

You’re given two integer arrays `nums1` and `nums2`. Two elements have been removed from `nums1`, and every remaining element has been shifted by the same integer `x` (added to each element) to become exactly equal to `nums2`. Your task is to find and return that integer `x`. The challenge is that you don’t know which two elements were removed from `nums1`, and you must find the consistent shift value that aligns the remaining elements.

What makes this problem tricky is the combination of unknown removals and a required uniform shift. You can’t simply match elements one-to-one, because two elements are missing and the shift is unknown. The problem requires careful pairing of sorted elements and checking for consistency across possible removal choices.

## Visual Walkthrough

Let’s walk through an example to build intuition.

**Example:**

```
nums1 = [4, 20, 16, 12, 8]
nums2 = [14, 18, 10]
```

**Step 1 – Understanding the transformation**

- Two elements are removed from `nums1` (we don’t know which ones).
- Every remaining element is increased by some integer `x`.
- After these changes, `nums1` becomes exactly equal to `nums2`.

**Step 2 – Sorting**
Since the order doesn’t matter for matching, we sort both arrays:

```
nums1_sorted = [4, 8, 12, 16, 20]
nums2_sorted = [10, 14, 18]
```

**Step 3 – Thinking about possible pairings**
After removing two elements from `nums1`, we have 3 elements left. These three, when shifted by `x`, must match the three elements in `nums2`.

If we think about aligning the sorted arrays:

- The smallest remaining element in `nums1` + `x` should equal some element in `nums2`.
- The largest remaining element in `nums1` + `x` should equal some element in `nums2`.

**Step 4 – Testing possible removals**
We need to test which two elements were removed. Since `nums1` has 5 elements and `nums2` has 3, we remove 2 elements from `nums1`. In sorted order, the remaining elements will be a contiguous block of 3 elements (though not necessarily the first 3).

Let’s test removing the first two elements from sorted `nums1`:
Remaining: `[12, 16, 20]`
We need `12 + x = 10`, `16 + x = 14`, `20 + x = 18`
From first pair: `x = 10 - 12 = -2`
Check others: `16 + (-2) = 14 ✓`, `20 + (-2) = 18 ✓`
All match! So `x = -2` works for this removal choice.

**Step 5 – Verification**
Original `nums1` after removing `[4, 8]`: `[12, 16, 20]`
Add `x = -2` to each: `[10, 14, 18]` which equals `nums2`.

The key insight: we need to check different possible contiguous blocks of length 3 in the sorted `nums1` and see if they can be shifted uniformly to match `nums2`.

## Brute Force Approach

A brute force approach would try all possible ways to choose 3 elements from `nums1` (since `nums2` has 3 elements), then check if there exists an `x` such that each chosen element + `x` equals the corresponding element in `nums2`.

Steps:

1. Generate all combinations of 3 elements from `nums1` (there are C(n, 3) combinations where n = len(nums1)).
2. For each combination, sort it and compare with sorted `nums2`.
3. Check if all differences between corresponding elements are equal.
4. If yes, return that difference.

Why this is inefficient:

- Generating all combinations of 3 from n elements has complexity O(n³) in the worst case.
- For n up to 100 (typical constraints), this could be up to ~160,000 combinations, which might be borderline acceptable but is not optimal.
- More importantly, this approach doesn’t leverage the sorted structure and would require careful implementation to avoid timeouts.

## Optimized Approach

The optimal approach leverages sorting and the fact that after removing two elements, the remaining elements in `nums1` form a contiguous subsequence in the sorted array (though not necessarily starting at index 0).

**Key Insight:**
After sorting both arrays, if we remove two elements from `nums1`, the remaining three elements will be some contiguous block of three elements in the sorted `nums1`. We need to check all possible contiguous blocks of length 3 in sorted `nums1` and see if they can be uniformly shifted to match sorted `nums2`.

**Why contiguous?**
Because if we have sorted arrays and we remove elements, the relative order of remaining elements is preserved. The smallest remaining element in `nums1` will align with the smallest in `nums2`, the second smallest with second smallest, etc.

**Algorithm:**

1. Sort both `nums1` and `nums2`.
2. Since `nums2` has length 3, we need to check all possible starting indices `i` in `nums1` where we take elements `i`, `i+1`, `i+2` as our candidate remaining elements.
3. For each candidate block, calculate the required shift `x = nums2[0] - nums1[i]`.
4. Check if this shift works for all three pairs: `nums1[i+j] + x == nums2[j]` for j=0,1,2.
5. If multiple valid `x` exist, we need to return the smallest one (per problem requirements).

**Optimization:**
We only need to check starting indices from 0 to len(nums1)-3. For each, we compute the shift from the first element and verify it works for all three.

## Optimal Solution

Here’s the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n log n) for sorting, O(n) for checking candidates → O(n log n)
# Space: O(1) if we sort in-place, O(n) if not (depends on language)
def minimumAddedInteger(nums1, nums2):
    # Step 1: Sort both arrays to align smallest elements
    nums1.sort()
    nums2.sort()

    n1, n2 = len(nums1), len(nums2)
    # We'll track the minimum valid x found
    min_x = float('inf')

    # Step 2: Try all possible starting positions for the 3-element block in nums1
    # The block starts at i and goes to i+2 (3 elements total)
    for i in range(n1 - n2 + 1):
        # Calculate x based on the first element of the block
        x = nums2[0] - nums1[i]

        # Step 3: Verify this x works for all elements in the block
        valid = True
        # j iterates through nums2 indices (0, 1, 2)
        # k iterates through nums1 indices starting from i
        for j in range(n2):
            if nums1[i + j] + x != nums2[j]:
                valid = False
                break

        # Step 4: If valid, update minimum x
        if valid:
            min_x = min(min_x, x)

    # Step 5: Return the minimum valid x found
    return min_x
```

```javascript
// Time: O(n log n) for sorting, O(n) for checking candidates → O(n log n)
// Space: O(1) if we sort in-place, O(n) if not (depends on implementation)
function minimumAddedInteger(nums1, nums2) {
  // Step 1: Sort both arrays to align smallest elements
  nums1.sort((a, b) => a - b);
  nums2.sort((a, b) => a - b);

  const n1 = nums1.length,
    n2 = nums2.length;
  // We'll track the minimum valid x found
  let minX = Infinity;

  // Step 2: Try all possible starting positions for the 3-element block in nums1
  // The block starts at i and goes to i+2 (3 elements total)
  for (let i = 0; i <= n1 - n2; i++) {
    // Calculate x based on the first element of the block
    const x = nums2[0] - nums1[i];

    // Step 3: Verify this x works for all elements in the block
    let valid = true;
    // j iterates through nums2 indices (0, 1, 2)
    // k iterates through nums1 indices starting from i
    for (let j = 0; j < n2; j++) {
      if (nums1[i + j] + x !== nums2[j]) {
        valid = false;
        break;
      }
    }

    // Step 4: If valid, update minimum x
    if (valid) {
      minX = Math.min(minX, x);
    }
  }

  // Step 5: Return the minimum valid x found
  return minX;
}
```

```java
// Time: O(n log n) for sorting, O(n) for checking candidates → O(n log n)
// Space: O(1) if we sort in-place, O(n) if not (depends on implementation)
import java.util.Arrays;

public int minimumAddedInteger(int[] nums1, int[] nums2) {
    // Step 1: Sort both arrays to align smallest elements
    Arrays.sort(nums1);
    Arrays.sort(nums2);

    int n1 = nums1.length, n2 = nums2.length;
    // We'll track the minimum valid x found
    int minX = Integer.MAX_VALUE;

    // Step 2: Try all possible starting positions for the 3-element block in nums1
    // The block starts at i and goes to i+2 (3 elements total)
    for (int i = 0; i <= n1 - n2; i++) {
        // Calculate x based on the first element of the block
        int x = nums2[0] - nums1[i];

        // Step 3: Verify this x works for all elements in the block
        boolean valid = true;
        // j iterates through nums2 indices (0, 1, 2)
        // k iterates through nums1 indices starting from i
        for (int j = 0; j < n2; j++) {
            if (nums1[i + j] + x != nums2[j]) {
                valid = false;
                break;
            }
        }

        // Step 4: If valid, update minimum x
        if (valid) {
            minX = Math.min(minX, x);
        }
    }

    // Step 5: Return the minimum valid x found
    return minX;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n)

- Sorting `nums1` takes O(n log n) where n is the length of `nums1`.
- Sorting `nums2` takes O(m log m) where m is the length of `nums2` (m = 3, so O(1)).
- The loop runs (n - m + 1) times, which is O(n).
- Inside the loop, we have another loop of m iterations (m = 3, so O(1)).
- Overall: O(n log n) + O(1) + O(n) = O(n log n).

**Space Complexity:** O(1) or O(n)

- If sorting is done in-place (like in Python's `sort()`), space is O(1) excluding input storage.
- If sorting creates a new array (like in some languages), it could be O(n).
- The algorithm itself uses only a few variables, so auxiliary space is O(1).

## Common Mistakes

1. **Not sorting the arrays first:** Without sorting, you can't assume that the smallest remaining element in `nums1` corresponds to the smallest in `nums2`. This leads to incorrect pairings.

2. **Checking non-contiguous blocks:** Some candidates try to check all combinations of 3 elements from `nums1`, which is O(n³) and inefficient. The insight that the remaining elements form a contiguous block in the sorted array is key.

3. **Forgetting to return the minimum x:** The problem requires returning the smallest valid `x`. If you find multiple valid shifts, you must track and return the minimum one.

4. **Off-by-one errors in loop bounds:** When iterating through possible starting indices, the loop should go from `0` to `len(nums1) - len(nums2)` inclusive. Getting this wrong can cause missed valid blocks or index out of bounds errors.

## When You'll See This Pattern

This problem combines sorting with sliding window/contiguous subsequence checking. You'll see similar patterns in:

1. **Minimum Difference Between Largest and Smallest Value in Three Moves (LeetCode 1509)** - Also involves removing elements and checking contiguous blocks in sorted arrays.

2. **Array Transformation Problems** - Problems where you need to align two arrays through operations like adding a constant, often solved by sorting and comparing differences.

3. **Sliding Window on Sorted Data** - When you need to find a subsequence that satisfies certain conditions, sorting first and then checking contiguous windows is a common technique.

The core pattern: when order doesn't matter but relative magnitude does, sort first. When you need to select a subset of elements, consider whether they form a contiguous block in the sorted order.

## Key Takeaways

1. **Sorting simplifies alignment problems:** When you need to match elements between two arrays and order doesn't matter, sorting both arrays is often the first step. This allows you to align smallest with smallest, second smallest with second smallest, etc.

2. **Contiguous blocks in sorted order:** When removing elements from a sorted array, the remaining elements maintain their relative order and form a contiguous subsequence in the sorted array. This reduces the search space from all combinations to just contiguous windows.

3. **Check consistency with first pair:** Once you have a candidate alignment, compute the required transformation from the first pair and verify it works for all pairs. This is more efficient than checking all possible transformations.

[Practice this problem on CodeJeet](/problem/find-the-integer-added-to-array-ii)
