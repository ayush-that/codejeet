---
title: "How to Solve Next Permutation — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Next Permutation. Medium difficulty, 44.8% acceptance rate. Topics: Array, Two Pointers."
date: "2026-05-16"
category: "dsa-patterns"
tags: ["next-permutation", "array", "two-pointers", "medium"]
---

# How to Solve Next Permutation

The "Next Permutation" problem asks us to rearrange an array of integers into the lexicographically next greater permutation. If no such permutation exists (the array is in descending order), we must rearrange it to the lowest possible order (ascending order). What makes this problem tricky is that we need to find the next permutation _in-place_ with constant extra space, and the algorithm isn't immediately obvious from the problem statement.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the array `[1, 2, 4, 3, 0]`. We want to find the next permutation that's just larger than this one.

**Step 1: Find the first decreasing element from the right**
We scan from right to left: `0 → 3 → 4 → 2 → 1`

- `3 > 0`? Yes (increasing)
- `4 > 3`? Yes (increasing)
- `2 > 4`? No! Found our decreasing element at index 1 (value 2)

**Step 2: Find the smallest element to the right that's larger than 2**
To the right of index 1: `[4, 3, 0]`
The smallest element larger than 2 is 3 (at index 3)

**Step 3: Swap these two elements**
Swap index 1 (value 2) with index 3 (value 3)
Array becomes: `[1, 3, 4, 2, 0]`

**Step 4: Reverse the suffix starting after the swap position**
The suffix after index 1 is `[4, 2, 0]`
Reverse it to get `[0, 2, 4]`
Final array: `[1, 3, 0, 2, 4]`

This is indeed the next permutation! Let's verify:

- Original: `[1, 2, 4, 3, 0]`
- Next: `[1, 3, 0, 2, 4]`
- All permutations between would be: `[1, 2, 4, 0, 3]`, `[1, 3, 0, 2, 4]`, etc.

## Brute Force Approach

A naive approach would be to:

1. Generate all permutations of the array
2. Sort them lexicographically
3. Find the current permutation in the sorted list
4. Return the next permutation (or the first if at the end)

However, this approach has several problems:

- Generating all permutations takes O(n!) time, which is infeasible for arrays of any reasonable size
- We'd need O(n!) space to store all permutations
- The problem requires in-place modification, but we'd be creating new arrays

Even if we tried to be clever and generate permutations in lexicographic order until we find the next one, we'd still potentially generate many permutations before finding the right one. For an array like `[3, 2, 1]`, we'd generate all 6 permutations just to wrap around to `[1, 2, 3]`.

## Optimized Approach

The key insight comes from understanding how permutations evolve lexicographically. When we look for the next permutation, we want to make the smallest possible increase to the number represented by the array.

Think of it like incrementing a number: `199` → `200`. We don't change the first digit if we can help it, but when we must, we make the smallest possible increase and set the remaining digits to their smallest values.

The algorithm works in three steps:

1. **Find the first decreasing element from the right** (pivot)
   - Starting from the end, find the first index `i` where `nums[i] < nums[i+1]`
   - This is the "pivot" point where we can make a change to increase the permutation

2. **Find the smallest element to the right that's larger than the pivot**
   - If we found a pivot (i >= 0), scan from the right to find the first element larger than `nums[i]`
   - This will be the element we swap with to make the smallest possible increase

3. **Reverse the suffix starting after the pivot**
   - After swapping, the suffix (everything after the pivot) is in descending order
   - Reversing it puts it in ascending order, giving us the smallest possible arrangement for that suffix

If no pivot is found (the entire array is in descending order), we simply reverse the whole array to get the smallest permutation (ascending order).

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def nextPermutation(nums):
    """
    Rearranges nums into the lexicographically next greater permutation.
    Modifies nums in-place.
    """
    n = len(nums)

    # Step 1: Find the first decreasing element from the right
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1

    # Step 2: If we found a pivot, find the element to swap with
    if i >= 0:
        j = n - 1
        # Find the smallest element to the right that's larger than nums[i]
        while j >= 0 and nums[j] <= nums[i]:
            j -= 1
        # Swap the pivot with this element
        nums[i], nums[j] = nums[j], nums[i]

    # Step 3: Reverse the suffix (from i+1 to end)
    # If i == -1 (no pivot found), this reverses the entire array
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1
```

```javascript
// Time: O(n) | Space: O(1)
function nextPermutation(nums) {
  const n = nums.length;

  // Step 1: Find the first decreasing element from the right
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) {
    i--;
  }

  // Step 2: If we found a pivot, find the element to swap with
  if (i >= 0) {
    let j = n - 1;
    // Find the smallest element to the right that's larger than nums[i]
    while (j >= 0 && nums[j] <= nums[i]) {
      j--;
    }
    // Swap the pivot with this element
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  // Step 3: Reverse the suffix (from i+1 to end)
  // If i == -1 (no pivot found), this reverses the entire array
  let left = i + 1;
  let right = n - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
}
```

```java
// Time: O(n) | Space: O(1)
public void nextPermutation(int[] nums) {
    int n = nums.length;

    // Step 1: Find the first decreasing element from the right
    int i = n - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }

    // Step 2: If we found a pivot, find the element to swap with
    if (i >= 0) {
        int j = n - 1;
        // Find the smallest element to the right that's larger than nums[i]
        while (j >= 0 && nums[j] <= nums[i]) {
            j--;
        }
        // Swap the pivot with this element
        swap(nums, i, j);
    }

    // Step 3: Reverse the suffix (from i+1 to end)
    // If i == -1 (no pivot found), this reverses the entire array
    reverse(nums, i + 1, n - 1);
}

private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

private void reverse(int[] nums, int left, int right) {
    while (left < right) {
        swap(nums, left, right);
        left++;
        right--;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make at most three passes through the array:
  1. Finding the pivot: O(n) in worst case (scanning entire array)
  2. Finding the swap candidate: O(n) in worst case
  3. Reversing the suffix: O(n) in worst case
- Each pass is linear, so overall O(3n) = O(n)

**Space Complexity: O(1)**

- We only use a few integer variables (i, j, left, right)
- All modifications are done in-place on the input array
- No additional data structures are created

## Common Mistakes

1. **Forgetting to handle the "no next permutation" case**: When the array is in descending order (e.g., `[3, 2, 1]`), we need to return the smallest permutation (`[1, 2, 3]`). The algorithm handles this because when no pivot is found, `i = -1`, and we reverse the entire array.

2. **Using >= instead of > in comparisons**: When finding the pivot, we need `nums[i] >= nums[i+1]` (not `>`), because equal values don't count as increasing. Similarly, when finding the swap candidate, we need `nums[j] <= nums[i]` to skip over equal values.

3. **Reversing instead of sorting the suffix**: After swapping, the suffix is in descending order. Some candidates try to sort it, which would be O(n log n). But since it's already in descending order, we can simply reverse it in O(n).

4. **Off-by-one errors in indices**: The pivot search starts at `n-2` (not `n-1`), and the swap candidate search starts at `n-1`. Getting these wrong can lead to array index out of bounds errors or incorrect results.

## When You'll See This Pattern

This "next permutation" algorithm is a specific pattern for generating permutations in lexicographic order. You'll encounter similar patterns in:

1. **Permutations (LeetCode 46)**: While this problem asks for all permutations, understanding the next permutation algorithm helps you generate them efficiently in lexicographic order.

2. **Permutations II (LeetCode 47)**: The same algorithm works for arrays with duplicates, though you need to be careful with the comparisons to avoid generating duplicate permutations.

3. **Permutation Sequence (LeetCode 60)**: This problem asks for the k-th permutation sequence. The next permutation algorithm can be used to generate permutations until you reach the k-th one (though there's a more mathematical approach).

The core pattern of "find pivot, find swap, reverse suffix" is a useful trick for any problem involving lexicographic ordering or generating the next combinatorial object in a sequence.

## Key Takeaways

1. **Lexicographic ordering has structure**: When looking for the next permutation, we want to make the smallest possible increase. This means changing the rightmost possible position and making the suffix as small as possible.

2. **Three-step process**: Memorize the algorithm: (1) Find first decreasing element from right, (2) Swap with next larger element to the right, (3) Reverse the suffix. This works for any permutation problem.

3. **In-place modification is possible**: Many candidates think they need extra arrays, but this algorithm shows how to rearrange elements in-place with just swaps and reversals.

Related problems: [Permutations](/problem/permutations), [Permutations II](/problem/permutations-ii), [Permutation Sequence](/problem/permutation-sequence)
