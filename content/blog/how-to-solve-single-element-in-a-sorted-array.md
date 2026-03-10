---
title: "How to Solve Single Element in a Sorted Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Single Element in a Sorted Array. Medium difficulty, 59.2% acceptance rate. Topics: Array, Binary Search."
date: "2026-09-12"
category: "dsa-patterns"
tags: ["single-element-in-a-sorted-array", "array", "binary-search", "medium"]
---

# How to Solve Single Element in a Sorted Array

You’re given a sorted array where every element appears exactly twice, except for one unique element that appears only once. The challenge is to find that single element in **O(log n)** time and **O(1)** space. What makes this problem interesting is that binary search—typically used for finding a target value—must be adapted to find a _pattern break_ in a sequence where pairs are normally adjacent.

## Visual Walkthrough

Let’s trace through an example step by step: `nums = [1, 1, 3, 3, 4, 4, 8, 9, 9]`.

In a perfectly paired array without a single element, every first occurrence of a pair would be at an **even index** (0, 2, 4, …) and every second occurrence at an **odd index** (1, 3, 5, …). The single element disrupts this pattern.

We can use binary search to locate where this disruption happens:

1. **Initial state**: `left = 0`, `right = 8` (length - 1)
2. **First iteration**: `mid = 4`. Look at the pair around index 4:
   - Value at index 4 is `4`.
   - Its partner should be at index 5 (since 4 is even, partner is `mid + 1`).
   - `nums[5] = 4` → they match. This means all elements up to index 5 are correctly paired.
   - The disruption must be in the right half → `left = mid + 1 = 5`.
3. **Second iteration**: `left = 5`, `right = 8`, `mid = 6` (or 7 depending on rounding; let’s use floor: `(5+8)//2 = 6`).
   - Index 6 is even. Check partner at index 7: `nums[6] = 8`, `nums[7] = 9` → they don’t match.
   - The disruption is at or before index 6 → `right = mid = 6`.
4. **Third iteration**: `left = 5`, `right = 6`, `mid = 5`.
   - Index 5 is odd. Check partner at index 4: `nums[5] = 4`, `nums[4] = 4` → they match.
   - The disruption is in the right half → `left = mid + 1 = 6`.
5. **Loop ends**: `left = 6`, `right = 6`. Return `nums[6] = 8`.

The single element is `8`. Notice how we always check the pair relationship based on whether `mid` is even or odd, then discard the correctly paired half.

## Brute Force Approach

A naive solution would be to simply iterate through the array and check each element against its neighbor. Since the array is sorted, the single element will be the first one where `nums[i] != nums[i+1]` when starting from even indices. This approach runs in **O(n)** time and **O(1)** space.

However, the problem explicitly requires **O(log n)** time, so the linear scan is insufficient. Interviewers expect you to recognize that sorted arrays with a search condition often imply binary search.

## Optimized Approach

The key insight is that the single element creates a “left half” where the normal pairing pattern holds, and a “right half” where it’s broken. We can use binary search to find the transition point.

**Pattern rule**: In the left half (before the single element):

- For any even index `i`, `nums[i] == nums[i+1]`.
- For any odd index `i`, `nums[i] == nums[i-1]`.

In the right half (after the single element), these relationships are flipped because the single element offsets all subsequent indices.

**Binary search adaptation**:

1. Compute `mid`.
2. Determine if `mid` is even or odd.
3. Compare `nums[mid]` with its appropriate partner:
   - If `mid` is even → partner is `mid + 1`.
   - If `mid` is odd → partner is `mid - 1`.
4. If they match, the single element is in the right half (`left = mid + 1`).
5. If they don’t match, the single element is in the left half or at `mid` (`right = mid`).

We continue until `left == right`, at which point `nums[left]` is the single element.

## Optimal Solution

Here’s the complete implementation in three languages:

<div class="code-group">

```python
# Time: O(log n) | Space: O(1)
def singleNonDuplicate(nums):
    """
    Finds the single element in a sorted array where every other element appears twice.
    Uses binary search on the index to locate the disruption in the pairing pattern.
    """
    left, right = 0, len(nums) - 1

    while left < right:
        mid = (left + right) // 2

        # Determine if mid is even or odd, then check its partner
        # If mid is even, its partner should be at mid + 1
        # If mid is odd, its partner should be at mid - 1
        # We can use XOR: mid ^ 1 gives partner index:
        #   - For even mid: mid ^ 1 = mid + 1 (e.g., 4 ^ 1 = 5)
        #   - For odd mid:  mid ^ 1 = mid - 1 (e.g., 5 ^ 1 = 4)
        partner = mid ^ 1

        # If nums[mid] matches its partner, the single element is to the right
        # because all pairs up to and including mid are intact.
        if nums[mid] == nums[partner]:
            left = mid + 1
        else:
            # Otherwise, the single element is at mid or to the left.
            right = mid

    # When left == right, we've narrowed it down to the single element.
    return nums[left]
```

```javascript
// Time: O(log n) | Space: O(1)
function singleNonDuplicate(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    // Calculate middle index
    const mid = Math.floor((left + right) / 2);

    // Determine partner index using XOR trick
    // For even mid: mid ^ 1 = mid + 1
    // For odd mid:  mid ^ 1 = mid - 1
    const partner = mid ^ 1;

    // If current element matches its partner, all pairs up to mid are intact
    // So the single element must be in the right half
    if (nums[mid] === nums[partner]) {
      left = mid + 1;
    } else {
      // Otherwise, the disruption is at or before mid
      right = mid;
    }
  }

  // When loop ends, left == right, pointing to the single element
  return nums[left];
}
```

```java
// Time: O(log n) | Space: O(1)
class Solution {
    public int singleNonDuplicate(int[] nums) {
        int left = 0;
        int right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2; // Avoids potential overflow

            // Use XOR to find partner index
            // If mid is even: mid ^ 1 = mid + 1
            // If mid is odd:  mid ^ 1 = mid - 1
            int partner = mid ^ 1;

            // Check if mid and its partner match
            if (nums[mid] == nums[partner]) {
                // All pairs up to mid are intact, search right half
                left = mid + 1;
            } else {
                // Disruption is at or before mid, search left half
                right = mid;
            }
        }

        // left == right at the single element
        return nums[left];
    }
}
```

</div>

## Complexity Analysis

- **Time Complexity**: **O(log n)** because we halve the search space in each iteration of the binary search. Each iteration performs constant-time operations (index calculations and comparisons).
- **Space Complexity**: **O(1)** since we only use a few integer variables (`left`, `right`, `mid`, `partner`) regardless of input size.

## Common Mistakes

1. **Forgetting to handle odd/even index logic**: Simply comparing `nums[mid]` with `nums[mid+1]` without considering whether `mid` is even or odd will fail. For example, if `mid` is odd and you compare with `mid+1`, you might be comparing across pair boundaries.

2. **Infinite loop with binary search boundaries**: Using `while (left <= right)` instead of `while (left < right)` can cause infinite loops because when `left == right`, we’ve found the answer and should exit. The condition `left < right` ensures we stop when the search space is one element.

3. **Incorrect partner calculation**: Manually checking `if (mid % 2 == 0)` then `partner = mid + 1` else `partner = mid - 1` is correct but more verbose. The XOR trick (`mid ^ 1`) is elegant but can be confusing if not explained. Either approach works, but be consistent.

4. **Not testing edge cases**: Always test:
   - Single element array: `[5]` should return `5`.
   - Element at beginning: `[1, 2, 2, 3, 3]` should return `1`.
   - Element at end: `[1, 1, 2, 2, 3]` should return `3`.

## When You'll See This Pattern

This “binary search on pattern disruption” technique appears in several problems where you need to find a transition point in a sorted sequence:

1. **Find Peak Element (LeetCode 162)**: Locate an element greater than its neighbors in an array. Similar binary search adaptation where you compare `mid` with `mid+1` to decide direction.

2. **First Bad Version (LeetCode 278)**: Find the first version where a bug appears. This is a direct binary search for a transition from “good” to “bad.”

3. **Search in Rotated Sorted Array (LeetCode 33)**: Find a target in a rotated array. You compare `nums[mid]` with `nums[left]` to determine which half is sorted, then decide where to search.

The common thread is using binary search not just for exact value matching, but for finding where a property changes.

## Key Takeaways

- **Sorted array + O(log n) requirement = binary search**: Always consider binary search when the input is sorted and you need logarithmic time.
- **Adapt binary search to patterns, not just values**: You can binary search on indices to find where a pattern (like element pairing) breaks, not just where a specific value exists.
- **Test with small examples**: Draw out arrays with 5-7 elements and trace the algorithm manually. This helps you verify the even/odd index logic and boundary conditions.

[Practice this problem on CodeJeet](/problem/single-element-in-a-sorted-array)
