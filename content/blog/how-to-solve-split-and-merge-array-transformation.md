---
title: "How to Solve Split and Merge Array Transformation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Split and Merge Array Transformation. Medium difficulty, 58.6% acceptance rate. Topics: Array, Hash Table, Breadth-First Search."
date: "2029-08-13"
category: "dsa-patterns"
tags:
  ["split-and-merge-array-transformation", "array", "hash-table", "breadth-first-search", "medium"]
---

# How to Solve Split and Merge Array Transformation

This problem asks whether we can transform one array into another using a specific operation: we can repeatedly take any contiguous subarray from the first array, remove it, and reinsert it anywhere else in the array (including at the beginning or end). The challenge is determining if such transformations are possible without actually simulating all possible moves—which would be computationally infeasible.

What makes this problem interesting is that it appears to be about array manipulation, but the solution actually reduces to a simpler pattern recognition problem. The key insight is understanding what this operation _preserves_ about the relative order of elements.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

- `nums1 = [1, 2, 3, 4, 5]`
- `nums2 = [4, 5, 1, 2, 3]`

Can we transform `nums1` into `nums2` using our split-and-merge operation?

**Step 1: Understanding the operation**
The operation lets us take any contiguous block and move it elsewhere. For example, we could take `[4, 5]` from the end of `nums1` and move it to the front:

- Take `nums1[3..4]` = `[4, 5]`
- Remove it, leaving `[1, 2, 3]`
- Insert `[4, 5]` at the beginning: `[4, 5, 1, 2, 3]`

That's exactly `nums2`! So this transformation is possible.

**Step 2: A more subtle example**
Consider: `nums1 = [1, 2, 3, 4, 5]` and `nums2 = [1, 3, 5, 2, 4]`

Is this possible? Let's think about what the operation preserves:

- When we move a contiguous block, the relative order of elements _within_ that block stays the same
- The relative order of elements _outside_ the block also stays the same
- But we can change the order between elements from different parts

In `nums2`, notice that `1` comes before `3`, and `3` comes before `5` in the original array. Also, `2` comes before `4` in the original. But `1, 3, 5` are interleaved with `2, 4` in a way that breaks their original relative ordering.

Actually, let's check: In `nums1`, `1` → `2` → `3` → `4` → `5`. In `nums2`, we have `1` → `3` → `5` → `2` → `4`. The sequence `1, 3, 5` maintains their relative order (1 before 3 before 5), and `2, 4` maintains their relative order (2 before 4). This might be possible!

**Step 3: The key observation**
The operation essentially lets us rearrange the array by taking contiguous blocks and repositioning them. This means the original array gets divided into blocks that maintain their internal order, and these blocks get rearranged.

Therefore, `nums2` must be obtainable by taking `nums1`, cutting it into contiguous blocks, and rearranging those blocks. But there's an even simpler way to think about it...

## Brute Force Approach

A naive approach would be to simulate all possible sequences of operations using BFS. Starting from `nums1`, we could:

1. Generate all possible moves (all possible L,R positions and all possible insertion points)
2. Apply each move to create new arrays
3. Check if any equals `nums2`
4. Repeat until we find `nums2` or exhaust all possibilities

The problem with this approach is the state space explosion. For an array of length `n`:

- There are O(n²) possible subarrays to choose (L,R pairs)
- For each subarray, there are O(n) possible insertion positions
- This gives O(n³) possible moves from each state
- The number of possible arrays is n! (factorial), which grows extremely fast

Even for n=10, 10! = 3,628,800 possible permutations. The BFS would need to explore a significant portion of this space, making it infeasible for typical constraints (n up to 1000 or more).

## Optimized Approach

The key insight is that our operation preserves the **relative order of elements that aren't separated by a "cut"**. More formally:

Think of `nums1` as a sequence. When we perform operations, we're essentially:

1. Cutting the array at some points
2. Rearranging the resulting blocks

Therefore, in the final array `nums2`, if we look at the elements in the order they appear in `nums1`, they should appear in `nums2` as several increasing subsequences (one for each block).

Actually, there's an even cleaner formulation: **`nums2` must be a subsequence of `nums1 + nums1`** (concatenated with itself).

Why? Consider that we can take any contiguous block from `nums1` and move it. The remaining elements stay in order. If we imagine "rotating" the array so that the block we move comes first, we get a cyclic rotation of the original order. More formally, any sequence obtainable by our operations can be obtained by:

1. Taking `nums1`
2. Cutting it into two parts: `A` and `B`
3. Rearranging to get `B + A`

But wait, we can do multiple operations! Actually, with multiple operations, we can get any arrangement where `nums2` is a subsequence of some rotation of `nums1`. But there's an even simpler check...

**The actual solution**: `nums2` is obtainable from `nums1` if and only if we can find `nums2` as a subsequence in `nums1 + nums1`.

Why does this work? Because any valid transformation corresponds to taking some prefix of `nums1` (which becomes a suffix after moving other blocks) and some suffix of `nums1` (which becomes a prefix). When concatenated, these give us the original circular order.

## Optimal Solution

The algorithm is straightforward:

1. Concatenate `nums1` with itself to handle circular arrangements
2. Check if `nums2` is a subsequence of this doubled array
3. A subsequence doesn't need to be contiguous, just in order

<div class="code-group">

```python
# Time: O(n^2) in worst case, but typically O(n) | Space: O(n)
def canTransform(nums1, nums2):
    """
    Check if nums2 can be obtained from nums1 using split-and-merge operations.

    The key insight: nums2 must be a subsequence of nums1 concatenated with itself.
    This handles all possible rearrangements achievable by moving contiguous blocks.
    """
    n = len(nums1)

    # Double nums1 to handle circular arrangements
    doubled = nums1 + nums1

    # Check if nums2 is a subsequence of doubled
    i, j = 0, 0
    while i < len(doubled) and j < n:
        if doubled[i] == nums2[j]:
            j += 1  # Found a match, move to next element in nums2
        i += 1  # Always move forward in doubled

    # If we matched all elements of nums2, transformation is possible
    return j == n
```

```javascript
// Time: O(n^2) in worst case, but typically O(n) | Space: O(n)
function canTransform(nums1, nums2) {
  /**
   * Check if nums2 can be obtained from nums1 using split-and-merge operations.
   *
   * The key insight: nums2 must be a subsequence of nums1 concatenated with itself.
   * This handles all possible rearrangements achievable by moving contiguous blocks.
   */
  const n = nums1.length;

  // Double nums1 to handle circular arrangements
  const doubled = nums1.concat(nums1);

  // Check if nums2 is a subsequence of doubled
  let i = 0,
    j = 0;
  while (i < doubled.length && j < n) {
    if (doubled[i] === nums2[j]) {
      j++; // Found a match, move to next element in nums2
    }
    i++; // Always move forward in doubled
  }

  // If we matched all elements of nums2, transformation is possible
  return j === n;
}
```

```java
// Time: O(n^2) in worst case, but typically O(n) | Space: O(n)
public boolean canTransform(int[] nums1, int[] nums2) {
    /**
     * Check if nums2 can be obtained from nums1 using split-and-merge operations.
     *
     * The key insight: nums2 must be a subsequence of nums1 concatenated with itself.
     * This handles all possible rearrangements achievable by moving contiguous blocks.
     */
    int n = nums1.length;

    // Double nums1 to handle circular arrangements
    int[] doubled = new int[2 * n];
    for (int i = 0; i < n; i++) {
        doubled[i] = nums1[i];
        doubled[i + n] = nums1[i];
    }

    // Check if nums2 is a subsequence of doubled
    int i = 0, j = 0;
    while (i < doubled.length && j < n) {
        if (doubled[i] == nums2[j]) {
            j++;  // Found a match, move to next element in nums2
        }
        i++;  // Always move forward in doubled
    }

    // If we matched all elements of nums2, transformation is possible
    return j == n;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n²) in the worst case, but typically O(n)

- We create a doubled array of size 2n: O(n)
- The subsequence check in worst case could be O(n²) if implemented naively (checking each position)
- However, our two-pointer approach is O(2n) = O(n) in practice since we traverse the doubled array once
- The worst case O(n²) would only occur with a different implementation that repeatedly searches

**Space Complexity**: O(n)

- We create a doubled array of size 2n
- We could optimize to O(1) by using modular arithmetic instead of actually doubling, but the code would be less clear

## Common Mistakes

1. **Checking for exact rotation instead of subsequence**: Some candidates think the arrays must be exact rotations of each other. But our operation allows moving multiple blocks, not just one rotation. The subsequence check is more permissive.

2. **Forgetting to handle duplicate elements**: When elements can repeat, we need to be careful. Our algorithm handles this correctly because we're looking for a subsequence match, not just checking if all elements exist.

3. **Assuming contiguous subsequence instead of regular subsequence**: The elements in `nums2` don't need to appear contiguously in the doubled `nums1`. They just need to appear in order. This is a subtle but important distinction.

4. **Not considering empty or single-element arrays**: Edge cases matter! Our algorithm handles n=0 and n=1 correctly because the while loop conditions properly handle these cases.

## When You'll See This Pattern

This "doubled array" or "circular array" pattern appears in several problems:

1. **Rotate Array (LeetCode 189)**: While different in specifics, it also deals with circular rotations of arrays.

2. **Find Minimum in Rotated Sorted Array (LeetCode 153)**: Searching in rotated arrays often involves thinking about the array as circular.

3. **Circular Array Loop (LeetCode 457)**: Directly works with circular array concepts.

4. **Is Subsequence (LeetCode 392)**: The core of our solution is checking if one array is a subsequence of another, which is exactly this problem.

The pattern to recognize: when a problem involves circular arrangements or rotations, consider concatenating the array with itself to linearize the circular structure.

## Key Takeaways

1. **Operations preserve certain invariants**: When an operation seems complex, look for what it preserves. Here, moving contiguous blocks preserves the relative order within unseparated portions of the original array.

2. **Circular problems → doubled arrays**: Many problems involving circular arrangements become simpler if you concatenate the array with itself, turning circular relationships into linear ones.

3. **Subsequence checks are powerful**: The simple "is A a subsequence of B?" check has surprising applications beyond the obvious string problems.

[Practice this problem on CodeJeet](/problem/split-and-merge-array-transformation)
