---
title: "How to Solve Wiggle Sort II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Wiggle Sort II. Medium difficulty, 37.0% acceptance rate. Topics: Array, Divide and Conquer, Greedy, Sorting, Quickselect."
date: "2028-10-07"
category: "dsa-patterns"
tags: ["wiggle-sort-ii", "array", "divide-and-conquer", "greedy", "medium"]
---

# How to Solve Wiggle Sort II

Wiggle Sort II asks us to reorder an array so that elements follow the pattern `nums[0] < nums[1] > nums[2] < nums[3] > nums[4]...`. The "II" distinguishes it from the easier Wiggle Sort problem where we only need `nums[0] <= nums[1] >= nums[2] <= nums[3]...`. The strict inequality with "greater than" makes this problem significantly trickier — a simple one-pass swap won't work because equal or nearby values can create invalid sequences. The key insight is that we need to separate the array into two halves and interleave them carefully.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `nums = [1,5,1,1,6,4]`.

**Step 1: Understanding the pattern**
We need: position 0 < position 1 > position 2 < position 3 > position 4 < position 5
Or: even indices (0,2,4) should be smaller than their neighbors, odd indices (1,3,5) should be larger.

**Step 2: Why simple swapping fails**
If we try the simple wiggle sort approach (comparing adjacent pairs and swapping if needed):

- Compare 1 and 5: 1 < 5 ✓
- Compare 5 and 1: need 5 > 1 ✓
- Compare 1 and 1: need 1 < 1 ✗ (fails because they're equal)

The problem is that equal values or values that are too close can end up adjacent.

**Step 3: The median-based approach**
A working strategy: find the median, then split the array into two halves:

1. Sort the array: `[1,1,1,4,5,6]`
2. Find middle: median ≈ 2.5, but we'll use index 3 (n//2) as our split
3. Left half: `[1,1,1]` (smaller values)
4. Right half: `[4,5,6]` (larger values)

**Step 4: Interleaving from the ends**
If we interleave naively (small, large, small, large...): `[1,4,1,5,1,6]`
Check: 1<4 ✓, 4>1 ✓, 1<5 ✓, 5>1 ✓, 1<6 ✓ — this works!

But wait — what if we have `[1,2,2,3]`?
Sorted: `[1,2,2,3]`, left: `[1,2]`, right: `[2,3]`
Naive interleave: `[1,2,2,3]` → 1<2 ✓, 2>2 ✗ (equal, not greater)

**Step 5: The crucial insight**
We need to interleave from the ENDS of each half, not the beginnings:
Left half (reversed): `[2,1]`
Right half (reversed): `[3,2]`
Interleave: `[2,3,1,2]` → 2<3 ✓, 3>1 ✓, 1<2 ✓

This works because by taking the largest of the small values and the largest of the large values first, we ensure maximum separation between potentially equal values.

## Brute Force Approach

A brute force approach would try all permutations until we find one that satisfies the wiggle condition. For an array of length n, there are n! permutations. We could generate each permutation (O(n!)) and check if it satisfies the condition (O(n)), resulting in O(n × n!) time complexity — completely impractical for even small arrays.

Even a more reasonable brute force — trying to place each element greedily — fails because local decisions can lead to dead ends. For example, with `[1,2,2,3]`, if we place 1 at index 0, then 2 at index 1, we're stuck because we need something greater than 2 at index 2, but we only have 2 and 3 left, and 2 isn't greater than 2.

The fundamental issue is that without global knowledge of value distribution, we can't guarantee we'll have the right values available when we need them.

## Optimized Approach

The optimal solution uses a three-step "Dutch National Flag" style approach:

1. **Find the median** — We need to partition the array into "smaller than median" and "larger than median" groups. The median gives us a natural split point. We can find it using quickselect (O(n) average) or by sorting (O(n log n)).

2. **Three-way partition** — Using the "virtual indexing" technique, we arrange elements so that:
   - All elements less than median go in the last even positions
   - All elements greater than median go in the first odd positions
   - Median elements go in the remaining positions

3. **Virtual indexing mapping** — The trickiest part: we map indices `0,1,2,3,4,5,...` to `1,3,5,0,2,4,...` for odd-length arrays (or similar for even). This ensures that when we do a three-way partition on these virtual indices, the result automatically satisfies the wiggle condition.

Why does this work? By placing smaller elements at even virtual indices (which map to later positions in the actual array) and larger elements at odd virtual indices (which map to earlier positions), we guarantee the wiggle pattern. The virtual indexing handles the interleaving automatically.

## Optimal Solution

Here's the complete implementation using the virtual indexing approach:

<div class="code-group">

```python
# Time: O(n) average, O(n^2) worst-case | Space: O(1)
def wiggleSort(nums):
    """
    Reorders nums in-place to satisfy nums[0] < nums[1] > nums[2] < nums[3]...
    Uses three-way partitioning with virtual indexing.
    """
    n = len(nums)

    # Find median using nth_element (quickselect)
    # For simplicity, we'll sort here, but in interview you should mention
    # quickselect for O(n) average time
    median = sorted(nums)[n // 2]

    # Helper function to map original index to virtual index
    # This mapping places even indices at the end and odd indices at the beginning
    # For n = 6: map idx 0->1, 1->3, 2->5, 3->0, 4->2, 5->4
    # Formula: (2*idx + 1) % (n|1)
    # n|1 ensures odd number for the modulus operation
    def virtual_index(i):
        return (2 * i + 1) % (n | 1)

    # Three-way partition using virtual indices
    left, right = 0, n - 1
    i = 0

    while i <= right:
        # Get the virtual index for current position
        vi = virtual_index(i)

        if nums[vi] > median:
            # Current element is greater than median
            # Swap with left virtual index
            vl = virtual_index(left)
            nums[vi], nums[vl] = nums[vl], nums[vi]
            left += 1
            i += 1
        elif nums[vi] < median:
            # Current element is less than median
            # Swap with right virtual index
            vr = virtual_index(right)
            nums[vi], nums[vr] = nums[vr], nums[vi]
            right -= 1
            # Don't increment i because we need to check the new element
        else:
            # Current element equals median
            i += 1

# Alternative implementation with sorting for clarity
def wiggleSortWithSorting(nums):
    """
    More intuitive version using sorting and reverse interleaving.
    Time: O(n log n) | Space: O(n)
    """
    n = len(nums)

    # Sort the array
    sorted_nums = sorted(nums)

    # Find split point - take ceiling of n/2 for left half
    mid = (n + 1) // 2

    # Split into two halves and reverse them
    left = sorted_nums[:mid][::-1]  # Smaller half, reversed
    right = sorted_nums[mid:][::-1]  # Larger half, reversed

    # Interleave the two halves
    j = 0
    for i in range(len(left)):
        nums[j] = left[i]
        j += 1
        if i < len(right):
            nums[j] = right[i]
            j += 1
```

```javascript
// Time: O(n log n) | Space: O(n)
function wiggleSort(nums) {
  const n = nums.length;

  // Sort the array
  const sorted = [...nums].sort((a, b) => a - b);

  // Find the split point - take ceiling of n/2
  const mid = Math.ceil(n / 2);

  // Split into two halves and reverse them
  const left = sorted.slice(0, mid).reverse(); // Smaller half, reversed
  const right = sorted.slice(mid).reverse(); // Larger half, reversed

  // Interleave the two halves
  let j = 0;
  for (let i = 0; i < left.length; i++) {
    nums[j] = left[i];
    j++;
    if (i < right.length) {
      nums[j] = right[i];
      j++;
    }
  }
}

// Alternative O(n) average time version with virtual indexing
function wiggleSortOptimized(nums) {
  const n = nums.length;

  // Find median (using sort for simplicity, mention quickselect in interview)
  const median = [...nums].sort((a, b) => a - b)[Math.floor(n / 2)];

  // Virtual index mapping function
  // (2 * i + 1) % (n | 1) maps indices to interleaved positions
  const virtualIndex = (i) => (2 * i + 1) % (n | 1);

  // Three-way partition using virtual indices
  let left = 0,
    right = n - 1,
    i = 0;

  while (i <= right) {
    const vi = virtualIndex(i);

    if (nums[vi] > median) {
      // Current element > median, swap to left section
      const vl = virtualIndex(left);
      [nums[vi], nums[vl]] = [nums[vl], nums[vi]];
      left++;
      i++;
    } else if (nums[vi] < median) {
      // Current element < median, swap to right section
      const vr = virtualIndex(right);
      [nums[vi], nums[vr]] = [nums[vr], nums[vi]];
      right--;
      // Don't increment i - need to check swapped element
    } else {
      // Current element == median, move to next
      i++;
    }
  }
}
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    public void wiggleSort(int[] nums) {
        int n = nums.length;

        // Create a copy and sort it
        int[] sorted = nums.clone();
        Arrays.sort(sorted);

        // Find the split point - take ceiling of n/2
        int mid = (n + 1) / 2;

        // Interleave from the ends of both halves
        // We start from mid-1 for left (smaller values) and n-1 for right (larger values)
        int left = mid - 1;  // End of smaller half
        int right = n - 1;   // End of larger half

        for (int i = 0; i < n; i++) {
            if (i % 2 == 0) {
                // Even index: take from smaller half (decreasing)
                nums[i] = sorted[left];
                left--;
            } else {
                // Odd index: take from larger half (decreasing)
                nums[i] = sorted[right];
                right--;
            }
        }
    }
}

// Alternative with virtual indexing for O(n) average time
class SolutionOptimized {
    public void wiggleSort(int[] nums) {
        int n = nums.length;

        // Find median (simplified with sort, mention quickselect)
        int[] copy = nums.clone();
        Arrays.sort(copy);
        int median = copy[n / 2];

        // Virtual index mapping
        // n | 1 gives the next odd number >= n
        int oddLen = n | 1;

        // Three-way partition using virtual indices
        int left = 0, right = n - 1, i = 0;

        while (i <= right) {
            int vi = virtualIndex(i, oddLen);

            if (nums[vi] > median) {
                // Swap to left section
                int vl = virtualIndex(left, oddLen);
                swap(nums, vi, vl);
                left++;
                i++;
            } else if (nums[vi] < median) {
                // Swap to right section
                int vr = virtualIndex(right, oddLen);
                swap(nums, vi, vr);
                right--;
                // i not incremented - check swapped element
            } else {
                i++;
            }
        }
    }

    private int virtualIndex(int i, int oddLen) {
        // Maps original index to virtual index for interleaving
        return (2 * i + 1) % oddLen;
    }

    private void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- With sorting approach: O(n log n) for sorting + O(n) for interleaving = **O(n log n)**
- With quickselect + virtual indexing: O(n) average for quickselect + O(n) for three-way partition = **O(n) average**, but O(n²) worst-case if quickselect picks bad pivots

**Space Complexity:**

- With sorting approach: O(n) for the sorted copy
- With virtual indexing approach: O(1) additional space (in-place)

The sorting approach is more intuitive and acceptable in interviews unless specifically asked for O(n) time. The virtual indexing approach is more elegant but trickier to implement correctly.

## Common Mistakes

1. **Using simple adjacent swapping**: Candidates often try to adapt the simpler Wiggle Sort solution (which uses `<=` and `>=`) by changing it to `<` and `>`. This fails because equal values or values that are too close can end up violating the strict inequality.

2. **Forgetting to reverse the halves before interleaving**: When interleaving sorted halves, if you take from the beginning of each half, you might place two equal or nearby values together. Taking from the ends (largest of small values with largest of large values) ensures maximum separation.

3. **Incorrect median calculation for even-length arrays**: For `n=4`, should you split `[a,b,c,d]` as `[a,b]` and `[c,d]` or `[a,b,c]` and `[d]`? The left half should have ceiling(n/2) elements to ensure we have enough "small" values for all even positions.

4. **Off-by-one errors in virtual indexing**: The formula `(2*i + 1) % (n|1)` is delicate. Using `n` instead of `n|1` fails for even n. The `n|1` ensures we always modulus by an odd number, which properly handles the wrap-around.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Three-way partitioning** (Dutch National Flag): Used in problems like [Sort Colors](/problem/sort-colors) where you need to group elements into three categories. Here we partition into `< median`, `= median`, and `> median`.

2. **Quickselect/median finding**: The core of [Kth Largest Element in an Array](/problem/kth-largest-element-in-an-array). Finding the median efficiently is crucial for the O(n) solution.

3. **Virtual indexing**: A technique used in array rearrangement problems where you want to process elements in a non-linear order without extra space. Similar to the "rearrange array elements by sign" problem.

4. **Interleaving patterns**: Problems that require arranging elements in specific alternating patterns, like rearranging array alternately (max, min, second max, second min...).

## Key Takeaways

1. **Strict inequality requires separation**: When you need `a < b > c < d` (strict inequalities), you can't have equal or nearly-equal values adjacent. The solution is to separate values into two groups (smaller and larger than median) and interleave them with maximum separation.

2. **Virtual indexing enables in-place interleaving**: Instead of creating a new array to hold the interleaved result, you can use index mapping to rearrange elements in-place. The formula `(2*i + 1) % (n|1)` maps to the desired interleaved order.

3. **Median is the natural split point**: For wiggle patterns with strict inequality, the median value provides the perfect boundary between "small" values (for even indices) and "large" values (for odd indices).

4. **When stuck, try the sorting approach first**: In an interview, it's acceptable to start with the O(n log n) sorting approach, then discuss how to optimize to O(n) with quickselect if time permits.

Related problems: [Sort Colors](/problem/sort-colors), [Kth Largest Element in an Array](/problem/kth-largest-element-in-an-array), [Wiggle Sort](/problem/wiggle-sort)
