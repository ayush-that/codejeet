---
title: "How to Solve Minimum Operations to Make a Subsequence — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Minimum Operations to Make a Subsequence. Hard difficulty, 49.6% acceptance rate. Topics: Array, Hash Table, Binary Search, Greedy."
date: "2030-02-09"
category: "dsa-patterns"
tags: ["minimum-operations-to-make-a-subsequence", "array", "hash-table", "binary-search", "hard"]
---

# How to Solve Minimum Operations to Make a Subsequence

You're given two arrays: `target` (distinct integers) and `arr` (can have duplicates). You can insert any integer at any position in `arr`, and you want the minimum number of insertions needed so that `target` becomes a subsequence of `arr`. The tricky part is that `arr` already contains some elements from `target`, and you need to find the longest subsequence of `target` that already exists in `arr`—the rest will need to be inserted.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Example:**

```
target = [5, 1, 3]
arr = [9, 4, 1, 3, 2, 6]
```

We want `target` to be a subsequence of `arr`. Currently, `arr` contains `[1, 3]` in order, but missing `5`. So we need to insert `5` somewhere before `1` in `arr`.

But how do we systematically find what's already present? Let's map it out:

1. First, note that `target` has distinct elements, so we can create a mapping from value to index:
   - `5` → index 0
   - `1` → index 1
   - `3` → index 2

2. Now look at `arr = [9, 4, 1, 3, 2, 6]`. Filter to only elements that appear in `target`:
   - `1` (at index 1 in target)
   - `3` (at index 2 in target)

3. We get the sequence of target indices: `[1, 2]`

4. The longest increasing subsequence (LIS) of these indices is `[1, 2]` (length 2).

5. Since `target` has length 3, we need to insert `3 - 2 = 1` element.

Why does this work? Because `target` must appear in order in `arr`. The indices from `target` that appear in `arr` must be in increasing order to maintain the subsequence order. The longest such increasing sequence tells us how much of `target` is already present in correct order.

## Brute Force Approach

A naive approach would be to try all possible subsequences of `arr` and check if they match `target`. Specifically:

1. Generate all subsequences of `arr` (2^n possibilities where n = len(arr))
2. For each subsequence, check if it equals `target`
3. Find the longest matching subsequence
4. The answer is `len(target) - length_of_longest_matching_subsequence`

This is clearly exponential time (O(2^n \* m) where m = len(target)), which is infeasible for typical constraints (n up to 10^5).

Even a slightly better brute force would be to try all possible insertions: start with `arr` and try inserting each missing element at all possible positions. This becomes factorial complexity as we'd need to consider permutations of insertions.

The key insight we need is that we don't actually care about the exact positions in `arr`—we only care about finding the longest subsequence of `target` that already exists in `arr` in the correct order.

## Optimized Approach

The problem reduces to: **Find the longest subsequence of `target` that appears in `arr` in order.**

Here's the step-by-step reasoning:

1. **Map target indices**: Since `target` has distinct elements, create a dictionary mapping each value to its index in `target`. This gives us the required order.

2. **Extract relevant indices from arr**: Go through `arr` and collect the indices (from the mapping) of elements that appear in `target`. This gives us a sequence of numbers representing positions in `target`.

3. **Find longest increasing subsequence**: We need the longest subsequence of these indices that is increasing (not necessarily strictly, but since indices are unique in `target`, it will be strictly increasing). Why increasing? Because for `target` to be a subsequence of `arr`, the elements must appear in the same order as in `target`, which means their indices must increase.

4. **Calculate answer**: The LIS length tells us how much of `target` is already present in correct order. We need to insert the rest: `len(target) - LIS_length`.

The clever optimization comes in step 3: finding the LIS in O(n log n) time using patience sorting/binary search, rather than the O(n²) DP approach.

## Optimal Solution

The key insight is that we're finding the LIS of the mapped indices from `arr`. Since we only need the length (not the actual subsequence), we can use the efficient O(n log n) algorithm.

<div class="code-group">

```python
# Time: O(n log n) where n = len(arr)
# Space: O(m + n) where m = len(target)
def minOperations(target, arr):
    """
    Returns minimum insertions needed to make target a subsequence of arr.

    Approach:
    1. Map each value in target to its index for O(1) lookup
    2. Extract sequence of target indices from arr (only elements in target)
    3. Find LIS of this sequence using patience sorting
    4. Answer = len(target) - LIS length
    """
    # Step 1: Create mapping from value to index in target
    # Since target has distinct elements, this is a bijection
    index_map = {val: i for i, val in enumerate(target)}

    # Step 2: Extract sequence of indices from arr
    # We only care about elements that appear in target
    seq = []
    for num in arr:
        if num in index_map:
            seq.append(index_map[num])

    # Step 3: Find length of Longest Increasing Subsequence (LIS)
    # Using patience sorting algorithm (binary search on piles)
    piles = []

    for num in seq:
        # Binary search to find where to place num
        left, right = 0, len(piles)
        while left < right:
            mid = (left + right) // 2
            if piles[mid] < num:
                left = mid + 1
            else:
                right = mid

        # If we found a pile to place on top
        if left < len(piles):
            piles[left] = num
        else:
            # Start a new pile
            piles.append(num)

    # Length of LIS = number of piles
    lis_length = len(piles)

    # Step 4: Calculate minimum operations needed
    # We need to insert all elements of target not in the LIS
    return len(target) - lis_length
```

```javascript
// Time: O(n log n) where n = arr.length
// Space: O(m + n) where m = target.length
function minOperations(target, arr) {
  /**
   * Returns minimum insertions needed to make target a subsequence of arr.
   *
   * Approach:
   * 1. Map each value in target to its index for O(1) lookup
   * 2. Extract sequence of target indices from arr (only elements in target)
   * 3. Find LIS of this sequence using patience sorting
   * 4. Answer = target.length - LIS length
   */

  // Step 1: Create mapping from value to index in target
  const indexMap = new Map();
  for (let i = 0; i < target.length; i++) {
    indexMap.set(target[i], i);
  }

  // Step 2: Extract sequence of indices from arr
  // We only care about elements that appear in target
  const seq = [];
  for (const num of arr) {
    if (indexMap.has(num)) {
      seq.push(indexMap.get(num));
    }
  }

  // Step 3: Find length of Longest Increasing Subsequence (LIS)
  // Using patience sorting algorithm (binary search on piles)
  const piles = [];

  for (const num of seq) {
    // Binary search to find where to place num
    let left = 0;
    let right = piles.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (piles[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // If we found a pile to place on top
    if (left < piles.length) {
      piles[left] = num;
    } else {
      // Start a new pile
      piles.push(num);
    }
  }

  // Length of LIS = number of piles
  const lisLength = piles.length;

  // Step 4: Calculate minimum operations needed
  return target.length - lisLength;
}
```

```java
// Time: O(n log n) where n = arr.length
// Space: O(m + n) where m = target.length
import java.util.*;

class Solution {
    public int minOperations(int[] target, int[] arr) {
        /**
         * Returns minimum insertions needed to make target a subsequence of arr.
         *
         * Approach:
         * 1. Map each value in target to its index for O(1) lookup
         * 2. Extract sequence of target indices from arr (only elements in target)
         * 3. Find LIS of this sequence using patience sorting
         * 4. Answer = target.length - LIS length
         */

        // Step 1: Create mapping from value to index in target
        Map<Integer, Integer> indexMap = new HashMap<>();
        for (int i = 0; i < target.length; i++) {
            indexMap.put(target[i], i);
        }

        // Step 2: Extract sequence of indices from arr
        // We only care about elements that appear in target
        List<Integer> seq = new ArrayList<>();
        for (int num : arr) {
            if (indexMap.containsKey(num)) {
                seq.add(indexMap.get(num));
            }
        }

        // Step 3: Find length of Longest Increasing Subsequence (LIS)
        // Using patience sorting algorithm (binary search on piles)
        List<Integer> piles = new ArrayList<>();

        for (int num : seq) {
            // Binary search to find where to place num
            int left = 0;
            int right = piles.size();

            while (left < right) {
                int mid = left + (right - left) / 2;
                if (piles.get(mid) < num) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }

            // If we found a pile to place on top
            if (left < piles.size()) {
                piles.set(left, num);
            } else {
                // Start a new pile
                piles.add(num);
            }
        }

        // Length of LIS = number of piles
        int lisLength = piles.size();

        // Step 4: Calculate minimum operations needed
        return target.length - lisLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- Creating the index map: O(m) where m = len(target)
- Extracting the sequence from arr: O(n) where n = len(arr)
- Finding LIS using patience sorting: O(k log k) where k = length of extracted sequence (≤ n)
- Overall: O(m + n + k log k) = O(n log n) in worst case

**Space Complexity: O(m + n)**

- Index map: O(m)
- Extracted sequence: O(k) ≤ O(n)
- Piles array: O(k) ≤ O(n)
- Overall: O(m + n)

The log factor comes from binary search in the patience sorting algorithm. This is much better than the O(n²) DP approach for LIS.

## Common Mistakes

1. **Forgetting that target has distinct elements**: This is crucial for creating the index mapping. If target had duplicates, we'd need a different approach (like mapping to list of indices).

2. **Using O(n²) LIS algorithm**: With n up to 10^5, O(n²) is too slow (10^10 operations). Candidates might default to the DP solution they memorized without considering constraints.

3. **Not filtering arr to target elements**: Including elements not in target adds noise and makes LIS longer than it should be. For example, if arr has numbers between target indices, they could create false increasing sequences.

4. **Off-by-one in binary search**: The patience sorting algorithm requires careful binary search implementation. A common mistake is using `<=` instead of `<` or incorrect update of left/right bounds.

5. **Misunderstanding the problem as edit distance**: Some candidates try to use edit distance DP, which would be O(m\*n) and too slow. The key insight is that we only insert, never delete from arr.

## When You'll See This Pattern

This problem combines two classic patterns:

1. **Reduction to LIS**: Many "order preservation" problems can be reduced to finding the longest increasing subsequence. The mapping trick (value → index) is key.

2. **Patience sorting for LIS**: The O(n log n) LIS algorithm appears in:
   - **Longest Increasing Subsequence** (LeetCode 300) - direct application
   - **Russian Doll Envelopes** (LeetCode 354) - 2D version requiring sorting first
   - **Maximum Length of Pair Chain** (LeetCode 646) - similar greedy approach

The core idea: when you need to find the longest sequence that maintains some order, and you can map elements to indices/ranks, LIS often appears.

## Key Takeaways

1. **Map to indices for order problems**: When you need to check if one sequence appears in another in order, map values to their positions to transform the problem into finding an increasing sequence.

2. **Know your LIS algorithms**: For interviews, you should know both the O(n²) DP and O(n log n) patience sorting versions. The latter is essential for large inputs.

3. **Filter irrelevant data**: Don't let elements not in target distract you. Extract only what matters (indices of target elements in arr).

4. **Minimum insertions = target length - LIS length**: This formula works because the LIS represents the longest part of target already present in correct order.

Related problems: [Append Characters to String to Make Subsequence](/problem/append-characters-to-string-to-make-subsequence)
