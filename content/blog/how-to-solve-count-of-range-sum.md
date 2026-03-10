---
title: "How to Solve Count of Range Sum — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count of Range Sum. Hard difficulty, 38.3% acceptance rate. Topics: Array, Binary Search, Divide and Conquer, Binary Indexed Tree, Segment Tree."
date: "2027-06-03"
category: "dsa-patterns"
tags: ["count-of-range-sum", "array", "binary-search", "divide-and-conquer", "hard"]
---

# How to Solve Count of Range Sum

This problem asks us to count how many subarray sums fall within a given range `[lower, upper]`. The challenge comes from needing to efficiently count sums that satisfy `lower ≤ sum ≤ upper` without checking all O(n²) possible subarrays. What makes this interesting is that while we can compute prefix sums to represent any subarray sum as `prefix[j] - prefix[i-1]`, efficiently counting pairs `(i, j)` where `i < j` and the difference falls in our target range requires clever data structures.

## Visual Walkthrough

Let's trace through `nums = [-2, 5, -1]` with `lower = -2` and `upper = 2`.

First, compute prefix sums:

- `prefix[0] = 0` (empty prefix)
- `prefix[1] = -2` (sum of first element)
- `prefix[2] = 3` (sum of first two)
- `prefix[3] = 2` (sum of all three)

We want subarray sums `S(i, j) = prefix[j] - prefix[i]` where `i < j`.

Let's check all pairs:

- `j=1, i=0`: `prefix[1] - prefix[0] = -2 - 0 = -2` (in range ✓)
- `j=2, i=0`: `prefix[2] - prefix[0] = 3 - 0 = 3` (out of range ✗)
- `j=2, i=1`: `prefix[2] - prefix[1] = 3 - (-2) = 5` (out of range ✗)
- `j=3, i=0`: `prefix[3] - prefix[0] = 2 - 0 = 2` (in range ✓)
- `j=3, i=1`: `prefix[3] - prefix[1] = 2 - (-2) = 4` (out of range ✗)
- `j=3, i=2`: `prefix[3] - prefix[2] = 2 - 3 = -1` (in range ✓)

We found 3 valid range sums. The brute force approach checks all O(n²) pairs, but for n=10⁵, this is impossible. We need a way to count these differences efficiently.

## Brute Force Approach

The straightforward solution computes all prefix sums, then checks every pair `(i, j)` where `i < j`:

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def countRangeSum(nums, lower, upper):
    n = len(nums)
    # Step 1: Compute prefix sums
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    # Step 2: Check all subarray sums
    count = 0
    for j in range(1, n + 1):
        for i in range(j):
            # S(i, j) = prefix[j] - prefix[i]
            s = prefix[j] - prefix[i]
            if lower <= s <= upper:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(n)
function countRangeSum(nums, lower, upper) {
  const n = nums.length;
  // Step 1: Compute prefix sums
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // Step 2: Check all subarray sums
  let count = 0;
  for (let j = 1; j <= n; j++) {
    for (let i = 0; i < j; i++) {
      // S(i, j) = prefix[j] - prefix[i]
      const s = prefix[j] - prefix[i];
      if (s >= lower && s <= upper) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(n)
public int countRangeSum(int[] nums, int lower, int upper) {
    int n = nums.length;
    // Step 1: Compute prefix sums
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    // Step 2: Check all subarray sums
    int count = 0;
    for (int j = 1; j <= n; j++) {
        for (int i = 0; i < j; i++) {
            // S(i, j) = prefix[j] - prefix[i]
            long s = prefix[j] - prefix[i];
            if (s >= lower && s <= upper) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why it's too slow:** For each `j`, we check all `i < j`, resulting in O(n²) operations. With n up to 10⁵, this would be ~10¹⁰ operations — far too slow. We need to reduce the O(n²) factor.

## Optimized Approach

The key insight: For a fixed `j`, we need to count how many `i < j` satisfy:

```
lower ≤ prefix[j] - prefix[i] ≤ upper
```

Rearranging:

```
prefix[j] - upper ≤ prefix[i] ≤ prefix[j] - lower
```

So for each `j`, we need to count how many previous prefix sums `prefix[i]` (with `i < j`) fall within the range `[prefix[j] - upper, prefix[j] - lower]`.

This is a **range counting query** over dynamic data (as we process `j` from left to right, we're adding prefix sums to our collection). Efficient range counting with dynamic updates suggests using:

- **Binary Indexed Tree (Fenwick Tree)** with coordinate compression
- **Segment Tree** with coordinate compression
- **Balanced Binary Search Tree** (like sorted list)
- **Merge Sort** (divide and conquer)

The merge sort approach is elegant: during merge sort of prefix sums, when merging two sorted halves, for each element in the right half, we can count how many elements in the left half satisfy the range condition using two pointers. This gives us O(n log n) time.

## Optimal Solution

We'll implement the **merge sort with two-pointer counting** approach:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def countRangeSum(nums, lower, upper):
    n = len(nums)
    # Step 1: Compute prefix sums
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    # Step 2: Use merge sort to count valid pairs
    def merge_sort_count(prefix, left, right):
        if left >= right:
            return 0

        mid = (left + right) // 2
        # Count pairs in left and right halves recursively
        count = merge_sort_count(prefix, left, mid) + \
                merge_sort_count(prefix, mid + 1, right)

        # Count pairs where i in left half, j in right half
        # For each j in right half, count i in left half where:
        # prefix[j] - upper ≤ prefix[i] ≤ prefix[j] - lower

        # Two-pointer technique to count valid i's for each j
        i_start = i_end = left
        for j in range(mid + 1, right + 1):
            lower_bound = prefix[j] - upper
            upper_bound = prefix[j] - lower

            # Move i_start to first index where prefix[i] >= lower_bound
            while i_start <= mid and prefix[i_start] < lower_bound:
                i_start += 1

            # Move i_end to first index where prefix[i] > upper_bound
            while i_end <= mid and prefix[i_end] <= upper_bound:
                i_end += 1

            # All i in [i_start, i_end-1] satisfy the condition
            count += (i_end - i_start)

        # Merge the two sorted halves
        temp = []
        i, j = left, mid + 1
        while i <= mid and j <= right:
            if prefix[i] <= prefix[j]:
                temp.append(prefix[i])
                i += 1
            else:
                temp.append(prefix[j])
                j += 1

        # Add remaining elements
        while i <= mid:
            temp.append(prefix[i])
            i += 1
        while j <= right:
            temp.append(prefix[j])
            j += 1

        # Copy back to original array
        for i in range(len(temp)):
            prefix[left + i] = temp[i]

        return count

    return merge_sort_count(prefix, 0, n)
```

```javascript
// Time: O(n log n) | Space: O(n)
function countRangeSum(nums, lower, upper) {
  const n = nums.length;
  // Step 1: Compute prefix sums
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // Step 2: Use merge sort to count valid pairs
  function mergeSortCount(prefix, left, right) {
    if (left >= right) return 0;

    const mid = Math.floor((left + right) / 2);
    // Count pairs in left and right halves recursively
    let count = mergeSortCount(prefix, left, mid) + mergeSortCount(prefix, mid + 1, right);

    // Count pairs where i in left half, j in right half
    // For each j in right half, count i in left half where:
    // prefix[j] - upper ≤ prefix[i] ≤ prefix[j] - lower

    // Two-pointer technique to count valid i's for each j
    let iStart = left,
      iEnd = left;
    for (let j = mid + 1; j <= right; j++) {
      const lowerBound = prefix[j] - upper;
      const upperBound = prefix[j] - lower;

      // Move iStart to first index where prefix[i] >= lowerBound
      while (iStart <= mid && prefix[iStart] < lowerBound) {
        iStart++;
      }

      // Move iEnd to first index where prefix[i] > upperBound
      while (iEnd <= mid && prefix[iEnd] <= upperBound) {
        iEnd++;
      }

      // All i in [iStart, iEnd-1] satisfy the condition
      count += iEnd - iStart;
    }

    // Merge the two sorted halves
    const temp = [];
    let i = left,
      j = mid + 1;
    while (i <= mid && j <= right) {
      if (prefix[i] <= prefix[j]) {
        temp.push(prefix[i]);
        i++;
      } else {
        temp.push(prefix[j]);
        j++;
      }
    }

    // Add remaining elements
    while (i <= mid) {
      temp.push(prefix[i]);
      i++;
    }
    while (j <= right) {
      temp.push(prefix[j]);
      j++;
    }

    // Copy back to original array
    for (let k = 0; k < temp.length; k++) {
      prefix[left + k] = temp[k];
    }

    return count;
  }

  return mergeSortCount(prefix, 0, n);
}
```

```java
// Time: O(n log n) | Space: O(n)
public int countRangeSum(int[] nums, int lower, int upper) {
    int n = nums.length;
    // Step 1: Compute prefix sums (use long to avoid overflow)
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }

    // Step 2: Use merge sort to count valid pairs
    return mergeSortCount(prefix, 0, n, lower, upper);
}

private int mergeSortCount(long[] prefix, int left, int right, int lower, int upper) {
    if (left >= right) return 0;

    int mid = left + (right - left) / 2;
    // Count pairs in left and right halves recursively
    int count = mergeSortCount(prefix, left, mid, lower, upper) +
                mergeSortCount(prefix, mid + 1, right, lower, upper);

    // Count pairs where i in left half, j in right half
    // For each j in right half, count i in left half where:
    // prefix[j] - upper ≤ prefix[i] ≤ prefix[j] - lower

    // Two-pointer technique to count valid i's for each j
    int iStart = left, iEnd = left;
    for (int j = mid + 1; j <= right; j++) {
        long lowerBound = prefix[j] - upper;
        long upperBound = prefix[j] - lower;

        // Move iStart to first index where prefix[i] >= lowerBound
        while (iStart <= mid && prefix[iStart] < lowerBound) {
            iStart++;
        }

        // Move iEnd to first index where prefix[i] > upperBound
        while (iEnd <= mid && prefix[iEnd] <= upperBound) {
            iEnd++;
        }

        // All i in [iStart, iEnd-1] satisfy the condition
        count += (iEnd - iStart);
    }

    // Merge the two sorted halves
    long[] temp = new long[right - left + 1];
    int i = left, j = mid + 1, k = 0;
    while (i <= mid && j <= right) {
        if (prefix[i] <= prefix[j]) {
            temp[k++] = prefix[i++];
        } else {
            temp[k++] = prefix[j++];
        }
    }

    // Add remaining elements
    while (i <= mid) {
        temp[k++] = prefix[i++];
    }
    while (j <= right) {
        temp[k++] = prefix[j++];
    }

    // Copy back to original array
    System.arraycopy(temp, 0, prefix, left, temp.length);

    return count;
}
```

</div>

**How it works:**

1. **Prefix sums:** Convert the problem from counting subarray sums to counting pairs of prefix sums with differences in `[lower, upper]`.
2. **Divide and conquer:** Split prefix sums into left and right halves.
3. **Count cross pairs:** For each `j` in right half, count how many `i` in left half satisfy `prefix[j] - upper ≤ prefix[i] ≤ prefix[j] - lower`. Since left half is sorted, we can use two pointers to find this range in O(n) time for all `j`.
4. **Merge:** Merge the sorted halves to maintain sorted order for parent calls.
5. **Recurse:** Apply the same process to left and right halves.

## Complexity Analysis

**Time: O(n log n)**

- Computing prefix sums: O(n)
- Merge sort with counting: O(n log n)
  - Each level of recursion processes O(n) elements
  - There are O(log n) levels
  - The two-pointer counting at each level is O(n)

**Space: O(n)**

- Prefix sums array: O(n)
- Recursion stack: O(log n)
- Temporary arrays for merging: O(n)

## Common Mistakes

1. **Integer overflow:** Not using 64-bit integers for prefix sums. With n up to 10⁵ and values up to 10⁵, sums can reach ±10¹⁰, which exceeds 32-bit integer range. Always use `long` in Java or ensure proper handling in Python/JavaScript.

2. **Incorrect prefix sum initialization:** Forgetting to include `prefix[0] = 0`. The empty subarray (i=0) is valid and needed for subarrays starting at index 0.

3. **Off-by-one in two-pointer counting:** When counting `i` in `[i_start, i_end-1]`, remember `i_end` points to the first element **greater than** `upper_bound`, so valid indices are `i_end - i_start`.

4. **Forgetting to merge after counting:** The merge step is crucial — without it, the halves won't be sorted for parent calls, breaking the two-pointer counting assumption.

## When You'll See This Pattern

This "divide and conquer with two-pointer counting during merge" pattern appears in several counting problems:

1. **Count of Smaller Numbers After Self (Hard):** Count how many elements to the right are smaller than each element. Similar merge sort approach where during merge, we count inversions.

2. **Reverse Pairs (Hard):** Count pairs where `i < j` and `nums[i] > 2*nums[j]`. Exactly the same pattern — during merge sort, count cross pairs satisfying the condition.

3. **Count the Number of Fair Pairs (Medium):** Count pairs with sum in a range. Can be solved with two pointers on sorted array or similar divide-and-conquer approach.

The pattern is: when you need to count pairs `(i, j)` with `i < j` satisfying some condition, and the condition can be checked efficiently if data is sorted, consider merge sort with counting during the merge phase.

## Key Takeaways

1. **Prefix sums transform subarray problems into pair problems:** `S(i, j) = prefix[j] - prefix[i]` converts subarray sums to differences of prefix sums.

2. **Divide and conquer with merge sort is powerful for pair counting:** When you need to count pairs with a condition and can check the condition efficiently on sorted data, the merge sort approach gives O(n log n) time.

3. **Two-pointer technique during merge:** For range counting queries like `lower ≤ prefix[j] - prefix[i] ≤ upper`, once both halves are sorted, you can use two pointers to count valid pairs in linear time.

Related problems: [Count of Smaller Numbers After Self](/problem/count-of-smaller-numbers-after-self), [Reverse Pairs](/problem/reverse-pairs), [Count the Number of Fair Pairs](/problem/count-the-number-of-fair-pairs)
