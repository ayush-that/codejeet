---
title: "How to Solve Minimum Prefix Removal to Make Array Strictly Increasing — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Prefix Removal to Make Array Strictly Increasing. Medium difficulty, 73.6% acceptance rate. Topics: Array."
date: "2028-07-28"
category: "dsa-patterns"
tags: ["minimum-prefix-removal-to-make-array-strictly-increasing", "array", "medium"]
---

# How to Solve Minimum Prefix Removal to Make Array Strictly Increasing

You need to remove exactly one prefix from an array so that the remaining elements form a strictly increasing sequence, and you must find the minimum length of such prefix. The tricky part is that you can't rearrange elements—you can only remove a prefix—and you need to identify where the strictly increasing property first breaks, since removing a shorter prefix won't fix violations that occur later.

## Visual Walkthrough

Let's trace through `nums = [1, 2, 3, 2, 4, 5]` step by step:

1. **Initial array**: `[1, 2, 3, 2, 4, 5]`
2. **Check from left to right**:
   - Index 0 → 1: Starting point
   - Index 1 → 2: 2 > 1 ✓ (strictly increasing so far)
   - Index 2 → 3: 3 > 2 ✓
   - Index 3 → 2: 2 > 3? ✗ (violation! 2 ≤ 3)

   The first violation occurs at index 3. For the remaining array to be strictly increasing, we must remove all elements up to and including the _first_ element involved in this violation? Let's think carefully.

3. **What happens if we remove different prefixes**:
   - Remove prefix of length 0 (keep all): `[1, 2, 3, 2, 4, 5]` → fails at index 3
   - Remove prefix of length 1: `[2, 3, 2, 4, 5]` → 2, 3 ✓, then 2 ≤ 3 ✗ still fails
   - Remove prefix of length 2: `[3, 2, 4, 5]` → 3, 2 ✗ immediately fails
   - Remove prefix of length 3: `[2, 4, 5]` → 2, 4 ✓, 4, 5 ✓ ✓ Works!

The minimum prefix length is 3. Notice the pattern: we need to remove everything up to the _last_ element of the decreasing pair (index 2, value 3), because that element is causing the issue. The remaining array starts at index 3, but wait—that's the smaller element. Actually, we need to find the _rightmost_ point where the strictly increasing property would be guaranteed after removal.

## Brute Force Approach

A brute force solution would try removing every possible prefix length from 0 to n (where n is array length), then check if the remaining array is strictly increasing:

1. For each possible prefix length `k` from 0 to n:
   - Create the remaining array `nums[k:]`
   - Check if it's strictly increasing by comparing each adjacent pair
   - If yes, return `k` (since we check from smallest to largest, first valid is minimum)

This approach is straightforward but inefficient. For each `k`, checking if the remaining array is strictly increasing takes O(n) time, leading to O(n²) total time complexity. For large arrays (n up to 10⁵ in typical constraints), this is far too slow.

<div class="code-group">

```python
# Brute Force Solution - Too Slow for Large Inputs
# Time: O(n²) | Space: O(1)
def minimumPrefixRemovalBrute(nums):
    n = len(nums)

    # Try every possible prefix length from 0 to n
    for k in range(n + 1):
        # Get the remaining array after removing prefix of length k
        remaining = nums[k:]

        # Check if remaining array is strictly increasing
        valid = True
        for i in range(len(remaining) - 1):
            if remaining[i] >= remaining[i + 1]:  # Not strictly increasing
                valid = False
                break

        if valid:
            return k  # First valid k is the minimum

    return n  # If nothing works (edge case)
```

```javascript
// Brute Force Solution - Too Slow for Large Inputs
// Time: O(n²) | Space: O(1)
function minimumPrefixRemovalBrute(nums) {
  const n = nums.length;

  // Try every possible prefix length from 0 to n
  for (let k = 0; k <= n; k++) {
    // Get the remaining array after removing prefix of length k
    const remaining = nums.slice(k);

    // Check if remaining array is strictly increasing
    let valid = true;
    for (let i = 0; i < remaining.length - 1; i++) {
      if (remaining[i] >= remaining[i + 1]) {
        // Not strictly increasing
        valid = false;
        break;
      }
    }

    if (valid) {
      return k; // First valid k is the minimum
    }
  }

  return n; // If nothing works (edge case)
}
```

```java
// Brute Force Solution - Too Slow for Large Inputs
// Time: O(n²) | Space: O(1)
public int minimumPrefixRemovalBrute(int[] nums) {
    int n = nums.length;

    // Try every possible prefix length from 0 to n
    for (int k = 0; k <= n; k++) {
        // Check if remaining array is strictly increasing
        boolean valid = true;
        for (int i = k; i < n - 1; i++) {
            if (nums[i] >= nums[i + 1]) {  // Not strictly increasing
                valid = false;
                break;
            }
        }

        if (valid) {
            return k;  // First valid k is the minimum
        }
    }

    return n;  // If nothing works (edge case)
}
```

</div>

## Optimized Approach

The key insight is that we don't need to check every possible prefix. Instead, we can find the **first point where the array stops being strictly increasing** when scanning from left to right. Once we find a violation `nums[i] >= nums[i+1]`, we know:

1. The prefix must include at least one element from this violating pair
2. If we remove only elements before `i`, the violation at `i` still exists
3. If we remove up to and including `i`, then the remaining array starts at `i+1`

But wait—what if there are multiple violations? Consider `[1, 3, 2, 2, 4]`:

- First violation: 3 ≥ 2 at index 1
- Second violation: 2 ≥ 2 at index 2

If we remove prefix up to index 1: `[2, 2, 4]` → still has violation 2 ≥ 2
We need to remove up to index 2: `[4]` → works

So we need to find the **rightmost index** where a violation "ends." Actually, think of it this way: after removing a prefix, the first element of the remaining array must be strictly less than all subsequent elements. So we need to find the longest prefix where the array is non-decreasing (has violations), and remove it all.

**Correct approach**: Scan from left to right to find the first index `i` where `nums[i] >= nums[i+1]`. This is a violation. Now, the remaining array must start _after_ the larger element in this pair. But which is the "problem" element? It's `nums[i]` because it's too large relative to what comes next. So we should remove everything up to and including index `i`.

But what about cases like `[1, 2, 3, 1, 2, 3, 4]`? Violation at index 2 (3 ≥ 1). Remove up to index 2: `[1, 2, 3, 4]` works. Good.

Actually, there's an even cleaner way: find the first index from the left where the array is no longer strictly increasing. The minimum prefix to remove is the length up to that index. If the entire array is strictly increasing, we remove 0 elements.

## Optimal Solution

The optimal solution is a single pass through the array. We scan from left to right, looking for the first violation of the strictly increasing property. Once found, the prefix to remove is everything up to that point. If no violation is found, we can remove 0 elements.

<div class="code-group">

```python
# Optimal Solution - Single Pass
# Time: O(n) | Space: O(1)
def minimumPrefixRemoval(nums):
    """
    Find minimum prefix length to remove so remaining array is strictly increasing.

    Approach: Scan from left to right, find first violation of strictly increasing property.
    The prefix to remove is everything up to and including the first element of the violating pair.
    """
    n = len(nums)

    # Edge case: empty array or single element
    if n <= 1:
        return 0  # Empty or single element array is trivially strictly increasing

    # Scan through the array to find the first violation
    for i in range(n - 1):
        # Check if current element is NOT strictly less than next element
        if nums[i] >= nums[i + 1]:
            # Violation found! We need to remove prefix up to index i
            # Why i and not i+1? Because nums[i] is causing the issue.
            # If we remove only up to i-1, nums[i] would still be in the array
            # and would violate the strictly increasing condition with nums[i+1]
            return i + 1  # Prefix length is index + 1 (0-based to 1-based)

    # If we complete the loop without finding violations
    # The entire array is strictly increasing
    return 0
```

```javascript
// Optimal Solution - Single Pass
// Time: O(n) | Space: O(1)
function minimumPrefixRemoval(nums) {
  /**
   * Find minimum prefix length to remove so remaining array is strictly increasing.
   *
   * Approach: Scan from left to right, find first violation of strictly increasing property.
   * The prefix to remove is everything up to and including the first element of the violating pair.
   */
  const n = nums.length;

  // Edge case: empty array or single element
  if (n <= 1) {
    return 0; // Empty or single element array is trivially strictly increasing
  }

  // Scan through the array to find the first violation
  for (let i = 0; i < n - 1; i++) {
    // Check if current element is NOT strictly less than next element
    if (nums[i] >= nums[i + 1]) {
      // Violation found! We need to remove prefix up to index i
      // Why i and not i+1? Because nums[i] is causing the issue.
      // If we remove only up to i-1, nums[i] would still be in the array
      // and would violate the strictly increasing condition with nums[i+1]
      return i + 1; // Prefix length is index + 1 (0-based to 1-based)
    }
  }

  // If we complete the loop without finding violations
  // The entire array is strictly increasing
  return 0;
}
```

```java
// Optimal Solution - Single Pass
// Time: O(n) | Space: O(1)
public int minimumPrefixRemoval(int[] nums) {
    /**
     * Find minimum prefix length to remove so remaining array is strictly increasing.
     *
     * Approach: Scan from left to right, find first violation of strictly increasing property.
     * The prefix to remove is everything up to and including the first element of the violating pair.
     */
    int n = nums.length;

    // Edge case: empty array or single element
    if (n <= 1) {
        return 0;  // Empty or single element array is trivially strictly increasing
    }

    // Scan through the array to find the first violation
    for (int i = 0; i < n - 1; i++) {
        // Check if current element is NOT strictly less than next element
        if (nums[i] >= nums[i + 1]) {
            // Violation found! We need to remove prefix up to index i
            // Why i and not i+1? Because nums[i] is causing the issue.
            // If we remove only up to i-1, nums[i] would still be in the array
            // and would violate the strictly increasing condition with nums[i+1]
            return i + 1;  // Prefix length is index + 1 (0-based to 1-based)
        }
    }

    // If we complete the loop without finding violations
    // The entire array is strictly increasing
    return 0;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, checking each adjacent pair once
- In the worst case, we check all n-1 adjacent pairs
- This is optimal since we must examine each element at least once to determine if the array is strictly increasing

**Space Complexity: O(1)**

- We only use a constant amount of extra space (loop variable, n)
- No additional data structures are created
- The input array is not modified

## Common Mistakes

1. **Returning the wrong index when violation is found**: Candidates often return `i` instead of `i + 1`. Remember: if we find a violation at index `i`, we need to remove `i + 1` elements (indices 0 through i inclusive).

2. **Not handling edge cases**:
   - Empty array: should return 0
   - Single element array: should return 0 (a single element is trivially strictly increasing)
   - Already strictly increasing array: should return 0

3. **Using > instead of >=**: The problem requires _strictly_ increasing, which means no equal elements are allowed. So `nums[i] >= nums[i+1]` is the correct condition, not `nums[i] > nums[i+1]`.

4. **Overcomplicating with multiple passes**: Some candidates try to find "all violations" or use complex logic. The simple single-pass approach is sufficient because once we remove the prefix up to the first violation, any subsequent violations would also be removed (they occur later in the array).

## When You'll See This Pattern

This problem uses the **single-pass scanning with early termination** pattern, which appears in many array processing problems:

1. **Find First Bad Version** (LeetCode 278): Binary search variant, but similar idea of finding the first point where a property changes
2. **Monotonic Array** (LeetCode 896): Check if an array is entirely non-increasing or non-decreasing
3. **Remove Duplicates from Sorted Array** (LeetCode 26): Similar scanning approach to find where the sorted property is violated
4. **Shortest Unsorted Continuous Subarray** (LeetCode 581): More complex but also involves finding where sorted order breaks

The core pattern is: scan through the array, track some property, and take action when the property is violated. The action might be returning a result, updating a counter, or modifying the array.

## Key Takeaways

1. **For prefix/suffix removal problems**, often the optimal solution involves finding the first/last point where a condition is violated in a single pass.

2. **Strictly increasing means no equal elements**: Use `>=` not `>` when checking for violations.

3. **Index arithmetic is crucial**: When returning a count of elements to remove, remember that array indices are 0-based but counts are 1-based. If violation is at index `i`, remove `i + 1` elements.

4. **Don't overthink**: Sometimes the simplest approach (single linear scan) is optimal. Before implementing complex logic, ask if the problem can be solved with one pass.

[Practice this problem on CodeJeet](/problem/minimum-prefix-removal-to-make-array-strictly-increasing)
