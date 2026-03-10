---
title: "How to Solve Trionic Array I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Trionic Array I. Easy difficulty, 49.5% acceptance rate. Topics: Array."
date: "2026-02-21"
category: "dsa-patterns"
tags: ["trionic-array-i", "array", "easy"]
---

# How to Solve Trionic Array I

You're given an array and need to determine if it can be split into three contiguous segments: strictly increasing, then strictly decreasing, then strictly increasing again. The challenge is that the split points `p` and `q` aren't given — you need to find if such positions exist. What makes this interesting is that you can't just check the whole array for a single pattern; you need to verify that somewhere within the array, these three patterns exist consecutively.

## Visual Walkthrough

Let's trace through an example: `nums = [1, 3, 5, 4, 2, 6, 8]`

We need to find positions `p` and `q` where:

- `nums[0...p]` is strictly increasing (elements get larger)
- `nums[p...q]` is strictly decreasing (elements get smaller)
- `nums[q...n-1]` is strictly increasing (elements get larger again)

Let's walk through step by step:

1. **First increasing segment**: Starting from index 0, we check consecutive pairs:
   - 1 → 3: increasing ✓
   - 3 → 5: increasing ✓
   - 5 → 4: decreasing ✗ (so p could be 2, before this decrease)

2. **Decreasing segment**: Starting from p=2 (value 5):
   - 5 → 4: decreasing ✓
   - 4 → 2: decreasing ✓
   - 2 → 6: increasing ✗ (so q could be 4, before this increase)

3. **Second increasing segment**: Starting from q=4 (value 2):
   - 2 → 6: increasing ✓
   - 6 → 8: increasing ✓

We found p=2 and q=4 that satisfy all conditions! The array is trionic.

But what if we tried different positions? The key insight is we don't need to try every combination — we can find the natural transition points by scanning the array once.

## Brute Force Approach

A naive approach would try all possible pairs of indices `(p, q)` with `0 < p < q < n-1` and check if the three segments satisfy the conditions:

1. For each p from 1 to n-3
2. For each q from p+1 to n-2
3. Check if nums[0..p] is strictly increasing
4. Check if nums[p..q] is strictly decreasing
5. Check if nums[q..n-1] is strictly increasing

This would be O(n³) time complexity because for each pair (p, q), we're scanning up to n elements to verify the conditions. With n up to 1000 (typical LeetCode constraints), this could mean up to 1 billion operations — far too slow.

Even if we precompute some information to avoid repeated scanning, the brute force approach with nested loops checking all pairs would still be O(n²), which might be acceptable for small n but isn't optimal.

## Optimal Solution

The optimal approach uses a single pass through the array to identify natural transition points. Here's the strategy:

1. **Find the peak (p)**: Scan from left to right until we find the first decrease. The index before the decrease is our candidate for p.
2. **Find the valley (q)**: Continue scanning from p until we find the first increase after the decreasing segment. The index before this increase is our candidate for q.
3. **Verify all segments**: Check that:
   - The segment from 0 to p is strictly increasing
   - The segment from p to q is strictly decreasing
   - The segment from q to end is strictly increasing

The key insight is that for the array to be trionic, there must be exactly one peak followed by exactly one valley, and these must occur in the correct order.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def isTrionic(nums):
    n = len(nums)

    # Edge case: array must have at least 4 elements
    # We need 0 < p < q < n-1, so minimum indices would be:
    # p=1, q=2, n-1=3 → n=4
    if n < 4:
        return False

    # Step 1: Find p - the end of the first increasing segment
    p = 0
    while p + 1 < n and nums[p] < nums[p + 1]:
        p += 1

    # If p is at the start or end, we don't have a proper peak
    if p == 0 or p == n - 1:
        return False

    # Step 2: Find q - the end of the decreasing segment
    q = p
    while q + 1 < n and nums[q] > nums[q + 1]:
        q += 1

    # If q didn't move from p, we don't have a decreasing segment
    if q == p:
        return False

    # If q is at the end, we don't have a second increasing segment
    if q == n - 1:
        return False

    # Step 3: Verify the second increasing segment
    r = q
    while r + 1 < n and nums[r] < nums[r + 1]:
        r += 1

    # If we couldn't reach the end with increasing sequence, return False
    if r != n - 1:
        return False

    # All conditions satisfied
    return True
```

```javascript
// Time: O(n) | Space: O(1)
function isTrionic(nums) {
  const n = nums.length;

  // Edge case: array must have at least 4 elements
  // We need 0 < p < q < n-1, so minimum indices would be:
  // p=1, q=2, n-1=3 → n=4
  if (n < 4) {
    return false;
  }

  // Step 1: Find p - the end of the first increasing segment
  let p = 0;
  while (p + 1 < n && nums[p] < nums[p + 1]) {
    p++;
  }

  // If p is at the start or end, we don't have a proper peak
  if (p === 0 || p === n - 1) {
    return false;
  }

  // Step 2: Find q - the end of the decreasing segment
  let q = p;
  while (q + 1 < n && nums[q] > nums[q + 1]) {
    q++;
  }

  // If q didn't move from p, we don't have a decreasing segment
  if (q === p) {
    return false;
  }

  // If q is at the end, we don't have a second increasing segment
  if (q === n - 1) {
    return false;
  }

  // Step 3: Verify the second increasing segment
  let r = q;
  while (r + 1 < n && nums[r] < nums[r + 1]) {
    r++;
  }

  // If we couldn't reach the end with increasing sequence, return false
  if (r !== n - 1) {
    return false;
  }

  // All conditions satisfied
  return true;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean isTrionic(int[] nums) {
        int n = nums.length;

        // Edge case: array must have at least 4 elements
        // We need 0 < p < q < n-1, so minimum indices would be:
        // p=1, q=2, n-1=3 → n=4
        if (n < 4) {
            return false;
        }

        // Step 1: Find p - the end of the first increasing segment
        int p = 0;
        while (p + 1 < n && nums[p] < nums[p + 1]) {
            p++;
        }

        // If p is at the start or end, we don't have a proper peak
        if (p == 0 || p == n - 1) {
            return false;
        }

        // Step 2: Find q - the end of the decreasing segment
        int q = p;
        while (q + 1 < n && nums[q] > nums[q + 1]) {
            q++;
        }

        // If q didn't move from p, we don't have a decreasing segment
        if (q == p) {
            return false;
        }

        // If q is at the end, we don't have a second increasing segment
        if (q == n - 1) {
            return false;
        }

        // Step 3: Verify the second increasing segment
        int r = q;
        while (r + 1 < n && nums[r] < nums[r + 1]) {
            r++;
        }

        // If we couldn't reach the end with increasing sequence, return false
        if (r != n - 1) {
            return false;
        }

        // All conditions satisfied
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array to find p, then continue to find q, then continue to verify the last segment
- In the worst case, we traverse the entire array once (when the array is trionic)
- Even though we have three while loops, they don't nest — each element is visited at most once

**Space Complexity: O(1)**

- We only use a few integer variables (p, q, r, n)
- No additional data structures are needed
- The space usage is constant regardless of input size

## Common Mistakes

1. **Not checking array length minimum**: The problem requires `0 < p < q < n-1`, which means we need at least 4 elements (indices 0, 1, 2, 3). Forgetting this edge case will cause index out of bounds errors or incorrect results for small arrays.

2. **Using ≤ instead of < for strict comparisons**: The problem says "strictly increasing" and "strictly decreasing," which means consecutive elements cannot be equal. Using `nums[i] <= nums[i+1]` instead of `nums[i] < nums[i+1]` will incorrectly accept arrays with plateaus.

3. **Not verifying the entire second increasing segment**: Some candidates stop once they find q and assume the rest is increasing. But you need to verify that from q to the end, the entire segment is strictly increasing. There could be another decrease later that invalidates the trionic property.

4. **Missing the case where segments might be of length 1**: The increasing and decreasing segments must exist, but they could be as short as 2 elements each (since strictly increasing/decreasing requires at least 2 elements to compare). Make sure your logic handles these minimal cases correctly.

## When You'll See This Pattern

This problem uses the **"array pattern detection"** technique, where you scan an array to identify specific sequences or transitions. Similar problems include:

1. **LeetCode 941: Valid Mountain Array** - Check if an array is strictly increasing then strictly decreasing. This is essentially checking for a simpler version of the trionic pattern (just two segments instead of three).

2. **LeetCode 845: Longest Mountain in Array** - Find the longest subarray that forms a mountain (increasing then decreasing). This requires identifying all possible peaks and valleys in the array.

3. **LeetCode 376: Wiggle Subsequence** - Find the longest subsequence that alternates between increasing and decreasing. While this works with subsequences rather than contiguous segments, it uses similar logic for detecting direction changes.

The core pattern is scanning through an array while tracking the current "direction" (increasing, decreasing) and looking for specific transition points.

## Key Takeaways

1. **Single-pass solutions often exist for pattern detection problems**: When you need to find specific sequences in an array, consider whether you can identify them in one pass by tracking state transitions rather than checking all possible subarrays.

2. **Pay attention to "strictly" vs "non-decreasing"**: The difference between `<` and `≤` matters in many array problems. Always check the problem description carefully for these keywords.

3. **Edge cases matter for index manipulation**: When working with consecutive element comparisons (`nums[i]` and `nums[i+1]`), always ensure `i+1` is within bounds. Also consider minimum array lengths needed for your logic to work.

[Practice this problem on CodeJeet](/problem/trionic-array-i)
