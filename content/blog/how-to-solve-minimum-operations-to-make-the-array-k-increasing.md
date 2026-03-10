---
title: "How to Solve Minimum Operations to Make the Array K-Increasing — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make the Array K-Increasing. Hard difficulty, 40.2% acceptance rate. Topics: Array, Binary Search."
date: "2030-02-14"
category: "dsa-patterns"
tags: ["minimum-operations-to-make-the-array-k-increasing", "array", "binary-search", "hard"]
---

# How to Solve Minimum Operations to Make the Array K-Increasing

This problem asks us to find the minimum number of operations (where we can change any element to any positive integer) needed to make an array "K-increasing" — meaning for every index `i` where `k ≤ i ≤ n-1`, we must have `arr[i-k] ≤ arr[i]`. The challenge is that this constraint creates `k` independent subsequences (elements spaced `k` apart), and we need to make each subsequence non-decreasing with minimal changes.

What makes this problem tricky is recognizing that:

1. The K-increasing condition creates `k` independent sequences
2. For each sequence, we need to find the minimum changes to make it non-decreasing
3. This reduces to finding the Longest Non-Decreasing Subsequence (LNDS) for each sequence

## Visual Walkthrough

Let's trace through an example: `arr = [5, 4, 3, 2, 1]` with `k = 1`

For `k = 1`, the condition becomes `arr[i-1] ≤ arr[i]` for all `i ≥ 1`, which means the entire array must be non-decreasing. Our array `[5, 4, 3, 2, 1]` is strictly decreasing, so we need to make it non-decreasing.

The optimal approach is to find the Longest Non-Decreasing Subsequence (LNDS). The elements that are already in the correct non-decreasing order don't need to change. We only need to change the others.

LNDS of `[5, 4, 3, 2, 1]` is just 1 (any single element). So we need to change `5 - 1 = 4` elements.

Now let's try `arr = [4, 1, 5, 2, 6, 2]` with `k = 2` (from the example):

When `k = 2`, we have two independent sequences:

1. Indices 0, 2, 4: `[4, 5, 6]` (already non-decreasing)
2. Indices 1, 3, 5: `[1, 2, 2]` (already non-decreasing)

Both sequences are already non-decreasing, so we need 0 changes.

Let's try a more interesting example: `arr = [2, 1, 3, 1, 4, 1]` with `k = 3`:

We get 3 independent sequences:

1. Indices 0, 3: `[2, 1]` → needs 1 change (make 1 ≥ 2 or 2 ≤ 1)
2. Indices 1, 4: `[1, 4]` → already non-decreasing
3. Indices 2, 5: `[3, 1]` → needs 1 change

Total changes = 1 + 0 + 1 = 2

## Brute Force Approach

A naive approach would be to try all possible modifications to the array. For each element, we could either:

1. Leave it as is
2. Change it to any positive integer

With `n` elements, each having infinite possible values (though practically bounded), this leads to an exponential search space. Even if we limit values to the range of existing elements, we'd have `O(m^n)` possibilities where `m` is the number of unique values.

Another brute force approach would be: for each of the `k` subsequences, try all possible non-decreasing sequences we could create by changing elements. For a subsequence of length `L`, we could try all combinations of keeping/changing elements, which is `O(2^L)`. With `k` subsequences, this becomes exponential in `n/k`.

Both approaches are clearly infeasible for typical constraints where `n` can be up to 10^5.

## Optimized Approach

The key insight is that for each of the `k` independent subsequences, we need to make it non-decreasing with minimal changes. This is equivalent to finding the **Longest Non-Decreasing Subsequence (LNDS)** for that subsequence.

Why? Because:

- Elements that are already in non-decreasing order don't need to change
- We only need to change elements that break the non-decreasing order
- The minimum number of changes = length of subsequence - length of LNDS

For example, in sequence `[2, 1, 3, 1, 4, 1]` with `k = 3`:

- First subsequence `[2, 1]`: LNDS length = 1, so changes needed = 2 - 1 = 1
- Second subsequence `[1, 4]`: LNDS length = 2, so changes needed = 2 - 2 = 0
- Third subsequence `[3, 1]`: LNDS length = 1, so changes needed = 2 - 1 = 1

Total = 1 + 0 + 1 = 2

Now, how do we find LNDS efficiently? We can use the **patience sorting** algorithm with binary search, which finds LNDS in `O(L log L)` time for a sequence of length `L`.

The algorithm works by maintaining a list `tails` where `tails[i]` is the smallest possible tail value for all non-decreasing subsequences of length `i+1`. For each new element:

- If it's greater than or equal to the last tail, append it
- Otherwise, find the first tail that's greater than the element and replace it

This gives us the length of LNDS in `O(L log L)` time.

## Optimal Solution

The complete solution:

1. Split the array into `k` independent subsequences (elements with indices `i % k`)
2. For each subsequence, find the length of its Longest Non-Decreasing Subsequence (LNDS)
3. The changes needed for that subsequence = length of subsequence - length of LNDS
4. Sum the changes across all `k` subsequences

<div class="code-group">

```python
# Time: O(n log(n/k)) | Space: O(n/k)
# We process k subsequences, each of length ~n/k
# For each, LNDS takes O(L log L) where L = n/k
# Total: O(k * (n/k) log(n/k)) = O(n log(n/k))

def kIncreasing(arr, k):
    n = len(arr)
    total_operations = 0

    # Process each of the k independent subsequences
    for start in range(k):
        # Extract the subsequence: indices start, start+k, start+2k, ...
        subsequence = []
        i = start
        while i < n:
            subsequence.append(arr[i])
            i += k

        # Find length of Longest Non-Decreasing Subsequence (LNDS)
        lnds_length = length_of_lnds(subsequence)

        # Minimum changes for this subsequence = total length - LNDS length
        total_operations += len(subsequence) - lnds_length

    return total_operations

def length_of_lnds(nums):
    """Return length of Longest Non-Decreasing Subsequence using patience sorting."""
    tails = []

    for num in nums:
        # Binary search to find position in tails
        left, right = 0, len(tails)

        while left < right:
            mid = (left + right) // 2
            if tails[mid] <= num:
                # We want non-decreasing, so <= is acceptable
                left = mid + 1
            else:
                right = mid

        # If num is greater than or equal to all tails, extend the sequence
        if left == len(tails):
            tails.append(num)
        else:
            # Otherwise, replace the first tail that's greater than num
            tails[left] = num

    return len(tails)
```

```javascript
// Time: O(n log(n/k)) | Space: O(n/k)
/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
function kIncreasing(arr, k) {
  const n = arr.length;
  let totalOperations = 0;

  // Process each of the k independent subsequences
  for (let start = 0; start < k; start++) {
    // Extract the subsequence: indices start, start+k, start+2k, ...
    const subsequence = [];
    for (let i = start; i < n; i += k) {
      subsequence.push(arr[i]);
    }

    // Find length of Longest Non-Decreasing Subsequence (LNDS)
    const lndsLength = lengthOfLNDS(subsequence);

    // Minimum changes for this subsequence = total length - LNDS length
    totalOperations += subsequence.length - lndsLength;
  }

  return totalOperations;
}

/**
 * Returns length of Longest Non-Decreasing Subsequence using patience sorting.
 * @param {number[]} nums
 * @return {number}
 */
function lengthOfLNDS(nums) {
  const tails = [];

  for (const num of nums) {
    // Binary search to find position in tails
    let left = 0;
    let right = tails.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] <= num) {
        // We want non-decreasing, so <= is acceptable
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // If num is greater than or equal to all tails, extend the sequence
    if (left === tails.length) {
      tails.push(num);
    } else {
      // Otherwise, replace the first tail that's greater than num
      tails[left] = num;
    }
  }

  return tails.length;
}
```

```java
// Time: O(n log(n/k)) | Space: O(n/k)
class Solution {
    public int kIncreasing(int[] arr, int k) {
        int n = arr.length;
        int totalOperations = 0;

        // Process each of the k independent subsequences
        for (int start = 0; start < k; start++) {
            // Extract the subsequence: indices start, start+k, start+2k, ...
            List<Integer> subsequence = new ArrayList<>();
            for (int i = start; i < n; i += k) {
                subsequence.add(arr[i]);
            }

            // Find length of Longest Non-Decreasing Subsequence (LNDS)
            int lndsLength = lengthOfLNDS(subsequence);

            // Minimum changes for this subsequence = total length - LNDS length
            totalOperations += subsequence.size() - lndsLength;
        }

        return totalOperations;
    }

    /**
     * Returns length of Longest Non-Decreasing Subsequence using patience sorting.
     */
    private int lengthOfLNDS(List<Integer> nums) {
        List<Integer> tails = new ArrayList<>();

        for (int num : nums) {
            // Binary search to find position in tails
            int left = 0;
            int right = tails.size();

            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails.get(mid) <= num) {
                    // We want non-decreasing, so <= is acceptable
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }

            // If num is greater than or equal to all tails, extend the sequence
            if (left == tails.size()) {
                tails.add(num);
            } else {
                // Otherwise, replace the first tail that's greater than num
                tails.set(left, num);
            }
        }

        return tails.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n log(n/k))`

- We have `k` independent subsequences
- Each subsequence has length approximately `L = n/k`
- Finding LNDS for each subsequence takes `O(L log L)` using patience sorting with binary search
- Total time: `O(k * (n/k) log(n/k)) = O(n log(n/k))`

**Space Complexity:** `O(n/k)`

- We need to store each subsequence separately, but we process them one at a time
- The `tails` array for LNDS algorithm uses `O(L)` space where `L = n/k`
- We could optimize further by processing subsequences in-place, but `O(n/k)` is acceptable

## Common Mistakes

1. **Using LIS instead of LNDS:** The problem requires `arr[i-k] ≤ arr[i]` (non-decreasing), not `arr[i-k] < arr[i]` (strictly increasing). Using standard LIS algorithm (which finds strictly increasing subsequences) will give wrong results. Always use `≤` comparison in binary search.

2. **Not handling k > n/2 correctly:** When `k` is large, some subsequences may have only 1 element. The LNDS of a single element is always 1, so no changes needed. The algorithm handles this correctly since a 1-element sequence is always non-decreasing.

3. **Off-by-one errors in subsequence extraction:** When extracting elements for each subsequence, remember to start at index `start` and increment by `k`. A common mistake is using `i < n` as the condition but forgetting that `i` should start at different offsets for each subsequence.

4. **Inefficient LNDS implementation:** Some candidates try to implement LNDS using the `O(L^2)` DP approach, which would make the overall solution `O(n * n/k) = O(n²/k)`, potentially too slow for large `n`. Always use the `O(L log L)` patience sorting approach.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Independent subsequences from modular indexing:** When elements at positions `i` and `j` interact only if `i ≡ j (mod k)`, you can split the problem into `k` independent subproblems. Similar patterns appear in:
   - **Circular array problems** where indices wrap around
   - **Problems with stride or periodicity** constraints

2. **Longest Increasing/Non-decreasing Subsequence (LIS/LNDS):** The core of solving each subproblem is finding the longest subsequence that doesn't need changes. This pattern appears in:
   - **Longest Increasing Subsequence (Medium)** - the classic problem
   - **Russian Doll Envelopes (Hard)** - 2D version of LIS
   - **Minimum Number of Removals to Make Mountain Array (Hard)** - uses LIS from both directions

3. **Minimum changes to make sequence sorted:** The formula `changes = length - LNDS_length` is a common pattern when you can change elements to any value (as opposed to swapping adjacent elements).

## Key Takeaways

1. **Decompose constraints into independent subproblems:** When a constraint like `arr[i-k] ≤ arr[i]` applies with fixed `k`, it creates `k` independent chains of elements. Always check if you can process these chains separately.

2. **LNDS for minimum changes to sorted order:** When you need to make a sequence non-decreasing by changing elements (not swapping), the minimum changes equals the length minus the length of the Longest Non-Decreasing Subsequence. Remember to use `≤` not `<` for non-decreasing.

3. **Patience sorting is your friend:** The `O(n log n)` LIS/LNDS algorithm using binary search on a `tails` array is worth memorizing. It's a versatile tool that appears in many optimization problems involving sequences.

Related problems: [Longest Increasing Subsequence](/problem/longest-increasing-subsequence), [Minimum Swaps To Make Sequences Increasing](/problem/minimum-swaps-to-make-sequences-increasing)
