---
title: "How to Solve Trionic Array II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Trionic Array II. Hard difficulty, 47.3% acceptance rate. Topics: Array, Dynamic Programming."
date: "2027-10-10"
category: "dsa-patterns"
tags: ["trionic-array-ii", "array", "dynamic-programming", "hard"]
---

# How to Solve Trionic Array II

This problem asks us to count all contiguous subarrays that contain a "trionic" pattern: a strictly increasing segment followed by a strictly decreasing segment, with both segments having at least two elements. The challenge lies in efficiently checking every possible subarray for this complex pattern without resorting to O(n³) brute force checking.

What makes this problem interesting is that while the definition sounds complex, we can break it down into simpler components using dynamic programming. The real trick is recognizing that we don't need to check every subarray from scratch—we can precompute information about increasing and decreasing runs.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 3, 5, 4, 2, 6]`

We're looking for subarrays that contain: `[strictly increasing...]` then `[strictly decreasing...]` with at least 2 elements in each segment.

Consider subarray `[1, 3, 5, 4, 2]` (indices 0-4):

- From index 0 to 2: `[1, 3, 5]` is strictly increasing
- From index 2 to 4: `[5, 4, 2]` is strictly decreasing
- This satisfies the condition with `l=0, p=2, q=4, r=4`

Consider subarray `[3, 5, 4, 2, 6]` (indices 1-5):

- From index 1 to 2: `[3, 5]` is strictly increasing
- From index 2 to 4: `[5, 4, 2]` is strictly decreasing
- This also satisfies the condition

But `[1, 3, 5, 4]` (indices 0-3) doesn't work because the decreasing segment `[5, 4]` has only 2 elements, and we need `p < q < r`, meaning the decreasing segment must have at least 3 elements (indices p, q, and r).

The key insight: For each position `i`, we can precompute:

1. How long the strictly increasing run ending at `i` is
2. How long the strictly decreasing run starting at `i` is

Then for each possible "peak" `p` (where increasing turns to decreasing), we can count valid subarrays.

## Brute Force Approach

A naive solution would check every possible subarray `nums[l...r]` and within it, try every possible `p` and `q`:

1. For each `l` from 0 to n-1
2. For each `r` from l+1 to n-1
3. For each `p` from l+1 to r-2
4. For each `q` from p+1 to r-1
5. Check if `nums[l...p]` is strictly increasing
6. Check if `nums[p...q]` is strictly decreasing

This is O(n⁴) time complexity—completely impractical for typical constraints (n up to 1000 would be 10¹² operations).

Even a slightly better brute force would be O(n³): for each `l` and `r`, scan to find a valid `p` and `q`. But this is still too slow.

## Optimized Approach

The key insight is that we don't need to check subarrays from scratch. Instead:

1. **Precompute increasing runs**: For each index `i`, compute `inc[i]` = length of strictly increasing run ending at `i`. If `nums[i] > nums[i-1]`, then `inc[i] = inc[i-1] + 1`, else `inc[i] = 1`.

2. **Precompute decreasing runs**: For each index `i`, compute `dec[i]` = length of strictly decreasing run starting at `i`. We compute this backwards: if `nums[i] > nums[i+1]`, then `dec[i] = dec[i+1] + 1`, else `dec[i] = 1`.

3. **Find valid peaks**: A valid peak `p` is where an increasing run ends and a decreasing run begins. Specifically, we need `inc[p] >= 2` (at least 2 elements in increasing part) and `dec[p] >= 2` (at least 2 elements in decreasing part).

4. **Count subarrays**: For each valid peak `p`, the increasing part can start at any of the `inc[p] - 1` positions before `p` (since we need at least 2 elements). The decreasing part can end at any of the `dec[p] - 1` positions after `p`. Each combination gives a valid subarray.

Wait—there's a catch! The problem requires `l < p < q < r`, meaning:

- The increasing segment `nums[l...p]` must have at least 2 elements (`l < p`)
- The decreasing segment `nums[p...q]` must have at least 2 elements (`p < q`)
- And we need `q < r`, meaning the decreasing segment must extend beyond `q`

Actually, let's re-examine: The condition says `l < p < q < r` with:

- `nums[l...p]` strictly increasing (length ≥ 2)
- `nums[p...q]` strictly decreasing (length ≥ 2)
- `nums[q...r]`? The problem statement cuts off, but from context, it seems `nums[q...r]` can be anything.

So for a peak at `p`, we need:

- At least 1 element before `p` for the increasing part (making length ≥ 2)
- At least 1 element after `p` for `q` (making decreasing length ≥ 2)
- And `q` must be before `r`, so the decreasing segment must have at least 2 elements after `p`

Thus: `inc[p] >= 2` and `dec[p] >= 3` (because from `p` to `r` we need at least indices p, q, r)

## Optimal Solution

Now we have a clear plan:

1. Compute `inc` array: increasing run lengths ending at each index
2. Compute `dec` array: decreasing run lengths starting at each index
3. For each index `p` where `inc[p] >= 2` and `dec[p] >= 3`:
   - The increasing part can start at any of `p - inc[p] + 1` to `p - 1` (total `inc[p] - 1` choices)
   - The decreasing part from `p` must extend to at least `p + 2` (for q and r)
   - Actually, for fixed `l` and `p`, valid `r` values are from `p + 2` to `p + dec[p] - 1`
   - So total subarrays for this peak: `(inc[p] - 1) * (dec[p] - 2)`

Let's implement this:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countTrionicSubarrays(nums):
    """
    Counts all contiguous subarrays containing a trionic pattern:
    strictly increasing followed by strictly decreasing with at least 2 elements each.
    """
    n = len(nums)
    if n < 4:  # Need at least 4 elements for l < p < q < r
        return 0

    # Step 1: Compute increasing run lengths ending at each index
    inc = [1] * n  # inc[i] = length of strictly increasing run ending at i
    for i in range(1, n):
        if nums[i] > nums[i - 1]:
            inc[i] = inc[i - 1] + 1
        # else remains 1 (default)

    # Step 2: Compute decreasing run lengths starting at each index
    dec = [1] * n  # dec[i] = length of strictly decreasing run starting at i
    for i in range(n - 2, -1, -1):  # Process backwards
        if nums[i] > nums[i + 1]:
            dec[i] = dec[i + 1] + 1
        # else remains 1 (default)

    # Step 3: Count valid subarrays for each possible peak p
    count = 0
    for p in range(1, n - 2):  # p needs at least 1 element before and 2 after
        # Check if p can be a peak: increasing run to p has >= 2 elements
        # and decreasing run from p has >= 3 elements (for p, q, r)
        if inc[p] >= 2 and dec[p] >= 3:
            # For this peak p:
            # - Increasing part can start at any of the (inc[p] - 1) positions before p
            # - Decreasing part must extend to at least p+2 (for q and r)
            #   Valid r positions: from p+2 to p+dec[p]-1 inclusive
            #   That's (dec[p] - 2) choices
            count += (inc[p] - 1) * (dec[p] - 2)

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function countTrionicSubarrays(nums) {
  /**
   * Counts all contiguous subarrays containing a trionic pattern:
   * strictly increasing followed by strictly decreasing with at least 2 elements each.
   */
  const n = nums.length;
  if (n < 4) {
    // Need at least 4 elements for l < p < q < r
    return 0;
  }

  // Step 1: Compute increasing run lengths ending at each index
  const inc = new Array(n).fill(1); // inc[i] = length of strictly increasing run ending at i
  for (let i = 1; i < n; i++) {
    if (nums[i] > nums[i - 1]) {
      inc[i] = inc[i - 1] + 1;
    }
    // else remains 1 (default)
  }

  // Step 2: Compute decreasing run lengths starting at each index
  const dec = new Array(n).fill(1); // dec[i] = length of strictly decreasing run starting at i
  for (let i = n - 2; i >= 0; i--) {
    // Process backwards
    if (nums[i] > nums[i + 1]) {
      dec[i] = dec[i + 1] + 1;
    }
    // else remains 1 (default)
  }

  // Step 3: Count valid subarrays for each possible peak p
  let count = 0;
  for (let p = 1; p < n - 2; p++) {
    // p needs at least 1 element before and 2 after
    // Check if p can be a peak: increasing run to p has >= 2 elements
    // and decreasing run from p has >= 3 elements (for p, q, r)
    if (inc[p] >= 2 && dec[p] >= 3) {
      // For this peak p:
      // - Increasing part can start at any of the (inc[p] - 1) positions before p
      // - Decreasing part must extend to at least p+2 (for q and r)
      //   Valid r positions: from p+2 to p+dec[p]-1 inclusive
      //   That's (dec[p] - 2) choices
      count += (inc[p] - 1) * (dec[p] - 2);
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int countTrionicSubarrays(int[] nums) {
        /**
         * Counts all contiguous subarrays containing a trionic pattern:
         * strictly increasing followed by strictly decreasing with at least 2 elements each.
         */
        int n = nums.length;
        if (n < 4) {  // Need at least 4 elements for l < p < q < r
            return 0;
        }

        // Step 1: Compute increasing run lengths ending at each index
        int[] inc = new int[n];  // inc[i] = length of strictly increasing run ending at i
        inc[0] = 1;
        for (int i = 1; i < n; i++) {
            if (nums[i] > nums[i - 1]) {
                inc[i] = inc[i - 1] + 1;
            } else {
                inc[i] = 1;
            }
        }

        // Step 2: Compute decreasing run lengths starting at each index
        int[] dec = new int[n];  // dec[i] = length of strictly decreasing run starting at i
        dec[n - 1] = 1;
        for (int i = n - 2; i >= 0; i--) {  // Process backwards
            if (nums[i] > nums[i + 1]) {
                dec[i] = dec[i + 1] + 1;
            } else {
                dec[i] = 1;
            }
        }

        // Step 3: Count valid subarrays for each possible peak p
        int count = 0;
        for (int p = 1; p < n - 2; p++) {  // p needs at least 1 element before and 2 after
            // Check if p can be a peak: increasing run to p has >= 2 elements
            // and decreasing run from p has >= 3 elements (for p, q, r)
            if (inc[p] >= 2 && dec[p] >= 3) {
                // For this peak p:
                // - Increasing part can start at any of the (inc[p] - 1) positions before p
                // - Decreasing part must extend to at least p+2 (for q and r)
                //   Valid r positions: from p+2 to p+dec[p]-1 inclusive
                //   That's (dec[p] - 2) choices
                count += (inc[p] - 1) * (dec[p] - 2);
            }
        }

        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Computing the `inc` array: O(n) (one forward pass)
- Computing the `dec` array: O(n) (one backward pass)
- Counting valid subarrays: O(n) (one pass through all possible peaks)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- We store two arrays of size n: `inc` and `dec`
- No recursion or additional data structures needed
- Total: O(2n) = O(n)

## Common Mistakes

1. **Off-by-one errors in boundary conditions**: The most common mistake is getting the conditions wrong for `p`. Remember: `p` needs at least 1 element before it (for `l`) and at least 2 elements after it (for `q` and `r`). That's why our loop runs `for p in range(1, n-2)`.

2. **Misunderstanding the decreasing segment length**: Many candidates think `dec[p] >= 2` is sufficient, but we need `dec[p] >= 3` because we need indices `p, q, r` all within the decreasing run. With only 2, we could have `p` and `q` but not `r`.

3. **Forgetting "strictly" increasing/decreasing**: The problem says "strictly" increasing and decreasing, so equal elements break the run. Check `nums[i] > nums[i-1]` not `>=`.

4. **Double-counting subarrays**: When a subarray contains multiple peaks, it might be counted multiple times. Our approach avoids this because we count based on the "peak" `p`, and each subarray has exactly one peak where the increasing turns to decreasing (the maximum element in the mountain).

## When You'll See This Pattern

This problem uses **run length encoding** and **precomputation** patterns common in array problems:

1. **Longest Mountain in Array (LeetCode 845)**: Very similar concept—find the longest trionic subarray. The solution uses the same `inc` and `dec` arrays.

2. **Maximum Product Subarray (LeetCode 152)**: While different in goal, it uses similar precomputation of running products from both directions.

3. **Trapping Rain Water (LeetCode 42)**: Uses precomputation of maximum heights from left and right to determine water capacity at each position.

The core pattern: When you need to consider relationships between elements in both directions, precompute running values from left-to-right and right-to-left.

## Key Takeaways

1. **Break complex patterns into simpler runs**: Instead of checking the trionic pattern directly, break it into increasing and decreasing runs that can be precomputed.

2. **Precomputation is powerful for O(n²) → O(n)**: Many problems that seem to require checking all O(n²) subarrays can be solved in O(n) by precomputing information about each position.

3. **Pay attention to strict vs non-strict comparisons**: "Strictly increasing" means `>` not `>=`. This subtle difference affects when runs break.

[Practice this problem on CodeJeet](/problem/trionic-array-ii)
