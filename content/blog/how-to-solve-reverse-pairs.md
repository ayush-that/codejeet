---
title: "How to Solve Reverse Pairs — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Reverse Pairs. Hard difficulty, 33.7% acceptance rate. Topics: Array, Binary Search, Divide and Conquer, Binary Indexed Tree, Segment Tree."
date: "2027-10-12"
category: "dsa-patterns"
tags: ["reverse-pairs", "array", "binary-search", "divide-and-conquer", "hard"]
---

# How to Solve Reverse Pairs

The Reverse Pairs problem asks us to count pairs `(i, j)` where `i < j` and `nums[i] > 2 * nums[j]`. While this looks similar to counting inversions (where we count `nums[i] > nums[j]`), the factor of 2 makes it significantly more challenging. The brute force O(n²) approach is too slow for the typical constraints (n up to 5×10⁴), requiring us to find a more efficient O(n log n) solution. This problem is interesting because it combines divide-and-conquer with careful counting logic, testing your ability to adapt known patterns to new constraints.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 4, 3, 5, 1]`

We need to count pairs `(i, j)` where `i < j` and `nums[i] > 2 * nums[j]`.

**Step-by-step counting:**

- For `j = 1` (value 4): Check `i = 0` (value 2). Is `2 > 2*4 = 8`? No.
- For `j = 2` (value 3): Check `i = 0` (value 2): `2 > 6`? No. Check `i = 1` (value 4): `4 > 6`? No.
- For `j = 3` (value 5): Check `i = 0` (value 2): `2 > 10`? No. Check `i = 1` (value 4): `4 > 10`? No. Check `i = 2` (value 3): `3 > 10`? No.
- For `j = 4` (value 1): Check `i = 0` (value 2): `2 > 2`? No. Check `i = 1` (value 4): `4 > 2`? Yes → count = 1. Check `i = 2` (value 3): `3 > 2`? Yes → count = 2. Check `i = 3` (value 5): `5 > 2`? Yes → count = 3.

Total reverse pairs = 3.

Notice the pattern: For each `j`, we need to count how many elements before it are greater than `2 * nums[j]`. This is similar to counting inversions but with a modified comparison.

## Brute Force Approach

The straightforward solution checks every possible pair `(i, j)`:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def reversePairs(nums):
    count = 0
    n = len(nums)

    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] > 2 * nums[j]:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function reversePairs(nums) {
  let count = 0;
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (nums[i] > 2 * nums[j]) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public int reversePairs(int[] nums) {
    int count = 0;
    int n = nums.length;

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (nums[i] > 2L * nums[j]) {  // Use long to prevent overflow
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With n up to 50,000, O(n²) operations would be 2.5 billion comparisons, far too slow. We need an O(n log n) solution.

## Optimized Approach

The key insight is that this problem can be solved using a **modified merge sort** approach, similar to counting inversions. Here's the step-by-step reasoning:

1. **Divide and Conquer**: Split the array into halves recursively until we have single elements.
2. **Count and Merge**: When merging two sorted halves, we can efficiently count reverse pairs:
   - For each element in the right half, we need to count how many elements in the left half satisfy `left[i] > 2 * right[j]`
   - Since both halves are sorted, we can use a **two-pointer technique** to count these in O(n) time
3. **Modified Comparison**: The tricky part is that we need `nums[i] > 2 * nums[j]`, not just `nums[i] > nums[j]`. This means we need a separate counting pass before the actual merge.

**Why merge sort works:**

- Sorting doesn't change the relative positions between elements in different halves
- When both halves are sorted, we can count cross-halves pairs efficiently with two pointers
- We recursively count pairs within each half

**Counting logic during merge:**

1. First pass: Count reverse pairs between left and right halves
2. Second pass: Merge the two sorted halves into a single sorted array

## Optimal Solution

Here's the complete merge sort based solution:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
def reversePairs(nums):
    if not nums:
        return 0

    # Helper function that performs divide, count, and merge
    def merge_sort_count(nums, left, right):
        if left >= right:
            return 0

        mid = (left + right) // 2

        # Recursively count pairs in left and right halves
        count = merge_sort_count(nums, left, mid) + merge_sort_count(nums, mid + 1, right)

        # Count cross-halves reverse pairs
        j = mid + 1
        for i in range(left, mid + 1):
            # Move j until nums[i] <= 2 * nums[j] or j exceeds right boundary
            while j <= right and nums[i] > 2 * nums[j]:
                j += 1
            # All elements from mid+1 to j-1 satisfy nums[i] > 2 * nums[k]
            count += (j - (mid + 1))

        # Merge the two sorted halves
        temp = []
        i, j = left, mid + 1

        while i <= mid and j <= right:
            if nums[i] <= nums[j]:
                temp.append(nums[i])
                i += 1
            else:
                temp.append(nums[j])
                j += 1

        # Append remaining elements
        while i <= mid:
            temp.append(nums[i])
            i += 1
        while j <= right:
            temp.append(nums[j])
            j += 1

        # Copy back to original array
        nums[left:right + 1] = temp

        return count

    return merge_sort_count(nums, 0, len(nums) - 1)
```

```javascript
// Time: O(n log n) | Space: O(n)
function reversePairs(nums) {
  if (!nums || nums.length === 0) return 0;

  // Helper function for divide, count, and merge
  function mergeSortCount(nums, left, right) {
    if (left >= right) return 0;

    const mid = Math.floor((left + right) / 2);

    // Recursively count pairs in left and right halves
    let count = mergeSortCount(nums, left, mid) + mergeSortCount(nums, mid + 1, right);

    // Count cross-halves reverse pairs
    let j = mid + 1;
    for (let i = left; i <= mid; i++) {
      // Move j until nums[i] <= 2 * nums[j] or j exceeds right boundary
      while (j <= right && nums[i] > 2 * nums[j]) {
        j++;
      }
      // All elements from mid+1 to j-1 satisfy nums[i] > 2 * nums[k]
      count += j - (mid + 1);
    }

    // Merge the two sorted halves
    const temp = [];
    let i = left;
    j = mid + 1;

    while (i <= mid && j <= right) {
      if (nums[i] <= nums[j]) {
        temp.push(nums[i]);
        i++;
      } else {
        temp.push(nums[j]);
        j++;
      }
    }

    // Append remaining elements
    while (i <= mid) {
      temp.push(nums[i]);
      i++;
    }
    while (j <= right) {
      temp.push(nums[j]);
      j++;
    }

    // Copy back to original array
    for (let k = left; k <= right; k++) {
      nums[k] = temp[k - left];
    }

    return count;
  }

  return mergeSortCount(nums, 0, nums.length - 1);
}
```

```java
// Time: O(n log n) | Space: O(n)
public int reversePairs(int[] nums) {
    if (nums == null || nums.length == 0) return 0;
    return mergeSortCount(nums, 0, nums.length - 1);
}

private int mergeSortCount(int[] nums, int left, int right) {
    if (left >= right) return 0;

    int mid = left + (right - left) / 2;

    // Recursively count pairs in left and right halves
    int count = mergeSortCount(nums, left, mid) +
                mergeSortCount(nums, mid + 1, right);

    // Count cross-halves reverse pairs
    int j = mid + 1;
    for (int i = left; i <= mid; i++) {
        // Use long to prevent integer overflow in multiplication
        while (j <= right && nums[i] > 2L * nums[j]) {
            j++;
        }
        // All elements from mid+1 to j-1 satisfy nums[i] > 2 * nums[k]
        count += (j - (mid + 1));
    }

    // Merge the two sorted halves
    int[] temp = new int[right - left + 1];
    int i = left;
    j = mid + 1;
    int k = 0;

    while (i <= mid && j <= right) {
        if (nums[i] <= nums[j]) {
            temp[k++] = nums[i++];
        } else {
            temp[k++] = nums[j++];
        }
    }

    // Append remaining elements
    while (i <= mid) {
        temp[k++] = nums[i++];
    }
    while (j <= right) {
        temp[k++] = nums[j++];
    }

    // Copy back to original array
    System.arraycopy(temp, 0, nums, left, temp.length);

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- The merge sort recursion tree has height log n
- At each level, we do O(n) work for counting cross-halves pairs and merging
- Total: O(n log n)

**Space Complexity: O(n)**

- We need O(n) temporary storage for merging
- The recursion stack uses O(log n) space, but the temporary array dominates

**Why this is optimal:**

- Any comparison-based solution must examine relationships between elements
- The problem has a lower bound of Ω(n log n) for comparison-based algorithms
- Our solution achieves this lower bound

## Common Mistakes

1. **Integer Overflow**: Forgetting to use `long` or `BigInteger` when computing `2 * nums[j]`. When `nums[j]` is large (close to Integer.MAX_VALUE), `2 * nums[j]` can overflow. Always use a larger data type for the multiplication.

2. **Counting During Merge**: Trying to count reverse pairs during the actual merge step. This doesn't work because the merge compares `nums[i] <= nums[j]`, but we need `nums[i] > 2 * nums[j]`. These are different comparisons, so we need a separate counting pass before merging.

3. **Incorrect Index Management**: Getting the indices wrong in the counting loop. Remember:
   - `i` goes from `left` to `mid`
   - `j` starts at `mid + 1` and moves right
   - The count added is `(j - (mid + 1))`, which represents how many elements in the right half satisfy the condition for the current `i`

4. **Not Handling Empty/Single Element Arrays**: Forgetting the base case `if (left >= right) return 0;` can lead to infinite recursion or index errors.

## When You'll See This Pattern

This modified merge sort pattern appears in several counting problems where you need to count pairs satisfying certain conditions:

1. **Count Inversions (Reverse Pairs without the 2x factor)**: The classic problem that introduces this pattern. Instead of `nums[i] > 2 * nums[j]`, it's just `nums[i] > nums[j]`.

2. **Count of Smaller Numbers After Self**: For each element, count how many elements to its right are smaller. This uses the same merge sort approach but tracks counts per element rather than a total.

3. **Count of Range Sum**: Counts the number of range sums lying in a given interval. This extends the pattern to prefix sums and requires careful handling of the counting condition.

The core insight is that when you need to count relationships between elements based on their values (not just positions), sorting can help organize the information for efficient counting.

## Key Takeaways

1. **Divide and Conquer with Merge Sort** is a powerful pattern for counting problems where elements' relative values matter. When you see "count pairs satisfying some condition," consider if sorting can help organize the counting.

2. **Separate Counting from Merging**: When the counting condition differs from the sorting comparison, perform counting in a separate pass before merging. This keeps the logic clean and correct.

3. **Two-Pointer Technique** on sorted arrays enables O(n) counting of cross-halves pairs. This is the key optimization that brings the complexity from O(n²) to O(n log n).

Related problems: [Count of Smaller Numbers After Self](/problem/count-of-smaller-numbers-after-self), [Count of Range Sum](/problem/count-of-range-sum)
