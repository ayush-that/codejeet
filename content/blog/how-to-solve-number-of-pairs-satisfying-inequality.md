---
title: "How to Solve Number of Pairs Satisfying Inequality — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Pairs Satisfying Inequality. Hard difficulty, 46.8% acceptance rate. Topics: Array, Binary Search, Divide and Conquer, Binary Indexed Tree, Segment Tree."
date: "2029-12-18"
category: "dsa-patterns"
tags:
  ["number-of-pairs-satisfying-inequality", "array", "binary-search", "divide-and-conquer", "hard"]
---

# How to Solve Number of Pairs Satisfying Inequality

This problem asks us to count pairs of indices `(i, j)` where `i < j` and `nums1[i] - nums1[j] <= nums2[i] - nums2[j] + diff`. At first glance, it looks like we need to compare every possible pair, which would be O(n²). The challenge is finding a way to count these pairs efficiently without checking all O(n²) combinations. What makes this problem interesting is that we can transform the inequality into a form that allows us to use efficient data structures like Fenwick Trees (Binary Indexed Trees) or merge sort with counting during merge steps.

## Visual Walkthrough

Let's walk through a small example to build intuition:

**Input:**

```
nums1 = [3, 2, 5]
nums2 = [2, 2, 1]
diff = 1
```

We need pairs `(i, j)` where `i < j` and `nums1[i] - nums1[j] <= nums2[i] - nums2[j] + diff`.

**Step 1: Transform the inequality**
Let's rearrange the condition:

```
nums1[i] - nums1[j] <= nums2[i] - nums2[j] + diff
```

Add `nums1[j]` to both sides and subtract `nums2[i]`:

```
nums1[i] - nums2[i] <= nums1[j] - nums2[j] + diff
```

Define `arr[i] = nums1[i] - nums2[i]`. Then the condition becomes:

```
arr[i] <= arr[j] + diff
```

where `i < j`.

**Step 2: Calculate arr for our example**

- arr[0] = 3 - 2 = 1
- arr[1] = 2 - 2 = 0
- arr[2] = 5 - 1 = 4

So `arr = [1, 0, 4]` and `diff = 1`.

**Step 3: Check pairs manually**
We need `i < j` and `arr[i] <= arr[j] + diff`:

- (0, 1): arr[0] = 1, arr[1] + diff = 0 + 1 = 1 → 1 <= 1 ✓
- (0, 2): arr[0] = 1, arr[2] + diff = 4 + 1 = 5 → 1 <= 5 ✓
- (1, 2): arr[1] = 0, arr[2] + diff = 4 + 1 = 5 → 0 <= 5 ✓

All 3 pairs satisfy the condition. The answer is 3.

The key insight: After transformation, we need to count pairs `(i, j)` with `i < j` where `arr[i] <= arr[j] + diff`. This is similar to counting inversions but with a `+ diff` term.

## Brute Force Approach

The most straightforward solution is to check every possible pair `(i, j)` where `i < j`:

1. Calculate `arr[k] = nums1[k] - nums2[k]` for all k
2. For each `i` from 0 to n-2:
   - For each `j` from i+1 to n-1:
     - Check if `arr[i] <= arr[j] + diff`
     - If yes, increment count

**Why this is insufficient:**

- Time complexity: O(n²)
- Space complexity: O(1)
- For n up to 10⁵ (typical constraint), O(n²) is far too slow (10¹⁰ operations)

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def bruteForce(nums1, nums2, diff):
    n = len(nums1)
    count = 0

    # Calculate arr on the fly to save space
    for i in range(n - 1):
        arr_i = nums1[i] - nums2[i]
        for j in range(i + 1, n):
            arr_j = nums1[j] - nums2[j]
            if arr_i <= arr_j + diff:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function bruteForce(nums1, nums2, diff) {
  const n = nums1.length;
  let count = 0;

  for (let i = 0; i < n - 1; i++) {
    const arrI = nums1[i] - nums2[i];
    for (let j = i + 1; j < n; j++) {
      const arrJ = nums1[j] - nums2[j];
      if (arrI <= arrJ + diff) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public long bruteForce(int[] nums1, int[] nums2, int diff) {
    int n = nums1.length;
    long count = 0;

    for (int i = 0; i < n - 1; i++) {
        int arrI = nums1[i] - nums2[i];
        for (int j = i + 1; j < n; j++) {
            int arrJ = nums1[j] - nums2[j];
            if (arrI <= arrJ + diff) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that after transforming to `arr[i] <= arr[j] + diff`, we need to count pairs `(i, j)` with `i < j` satisfying this condition. This is similar to the "count inversions" problem, but with a modified comparison.

**Two main approaches:**

1. **Binary Indexed Tree (Fenwick Tree)**: Compress values, then process from right to left, querying how many elements seen so far satisfy `arr[j] >= arr[i] - diff`.
2. **Merge Sort with Counting**: Modify merge sort to count valid pairs during the merge step.

**Why Merge Sort approach works well:**

- During merge sort, when we merge two sorted halves, we can count pairs where `arr[i]` (from left half) <= `arr[j] + diff` (from right half)
- Since left half indices are all less than right half indices, the `i < j` condition is automatically satisfied
- This gives us O(n log n) time complexity

**Step-by-step reasoning for merge sort approach:**

1. Calculate `arr = [nums1[i] - nums2[i] for i in range(n)]`
2. Perform merge sort on `arr`, but modify the merge step to count valid pairs
3. During merge of left and right halves:
   - For each element in left half, find how many elements in right half satisfy `left[i] <= right[j] + diff`
   - Since both halves are sorted, we can use two pointers instead of binary search for efficiency
4. Count all valid pairs, then proceed with normal merge

## Optimal Solution

Here's the merge sort with counting approach:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n)
class Solution:
    def numberOfPairs(self, nums1: List[int], nums2: List[int], diff: int) -> int:
        n = len(nums1)
        # Step 1: Transform the arrays
        arr = [nums1[i] - nums2[i] for i in range(n)]

        # Step 2: Use merge sort to count valid pairs
        self.count = 0
        self.diff = diff

        def merge_sort(arr, left, right):
            if left >= right:
                return

            mid = (left + right) // 2
            # Recursively sort both halves
            merge_sort(arr, left, mid)
            merge_sort(arr, mid + 1, right)

            # Count valid pairs between the two halves
            self.count_pairs(arr, left, mid, right)

            # Merge the two sorted halves
            self.merge(arr, left, mid, right)

        merge_sort(arr, 0, n - 1)
        return self.count

    def count_pairs(self, arr, left, mid, right):
        """Count pairs where arr[i] <= arr[j] + diff for i in left half, j in right half"""
        # Both halves are sorted, so we can use two pointers
        j = mid + 1
        for i in range(left, mid + 1):
            # Move j forward while arr[i] > arr[j] + diff
            while j <= right and arr[i] > arr[j] + self.diff:
                j += 1
            # All elements from j to right satisfy arr[i] <= arr[k] + diff
            self.count += (right - j + 1)

    def merge(self, arr, left, mid, right):
        """Standard merge of two sorted arrays"""
        temp = []
        i, j = left, mid + 1

        while i <= mid and j <= right:
            if arr[i] <= arr[j]:
                temp.append(arr[i])
                i += 1
            else:
                temp.append(arr[j])
                j += 1

        # Add remaining elements
        while i <= mid:
            temp.append(arr[i])
            i += 1
        while j <= right:
            temp.append(arr[j])
            j += 1

        # Copy back to original array
        for k in range(len(temp)):
            arr[left + k] = temp[k]
```

```javascript
// Time: O(n log n) | Space: O(n)
var numberOfPairs = function (nums1, nums2, diff) {
  const n = nums1.length;
  // Step 1: Transform the arrays
  const arr = new Array(n);
  for (let i = 0; i < n; i++) {
    arr[i] = nums1[i] - nums2[i];
  }

  let count = 0;

  // Helper function to count valid pairs between two sorted halves
  const countPairs = (arr, left, mid, right) => {
    let j = mid + 1;
    for (let i = left; i <= mid; i++) {
      // Move j forward while arr[i] > arr[j] + diff
      while (j <= right && arr[i] > arr[j] + diff) {
        j++;
      }
      // All elements from j to right satisfy arr[i] <= arr[k] + diff
      count += right - j + 1;
    }
  };

  // Standard merge function
  const merge = (arr, left, mid, right) => {
    const temp = [];
    let i = left,
      j = mid + 1;

    while (i <= mid && j <= right) {
      if (arr[i] <= arr[j]) {
        temp.push(arr[i]);
        i++;
      } else {
        temp.push(arr[j]);
        j++;
      }
    }

    // Add remaining elements
    while (i <= mid) {
      temp.push(arr[i]);
      i++;
    }
    while (j <= right) {
      temp.push(arr[j]);
      j++;
    }

    // Copy back to original array
    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
    }
  };

  // Merge sort with counting
  const mergeSort = (arr, left, right) => {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);

    // Count valid pairs between the two halves
    countPairs(arr, left, mid, right);

    // Merge the two sorted halves
    merge(arr, left, mid, right);
  };

  mergeSort(arr, 0, n - 1);
  return count;
};
```

```java
// Time: O(n log n) | Space: O(n)
class Solution {
    private long count = 0;
    private int diff = 0;

    public long numberOfPairs(int[] nums1, int[] nums2, int diff) {
        int n = nums1.length;
        // Step 1: Transform the arrays
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = nums1[i] - nums2[i];
        }

        this.diff = diff;

        // Step 2: Use merge sort to count valid pairs
        mergeSort(arr, 0, n - 1);
        return count;
    }

    private void mergeSort(int[] arr, int left, int right) {
        if (left >= right) return;

        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);

        // Count valid pairs between the two halves
        countPairs(arr, left, mid, right);

        // Merge the two sorted halves
        merge(arr, left, mid, right);
    }

    private void countPairs(int[] arr, int left, int mid, int right) {
        // Both halves are sorted, so we can use two pointers
        int j = mid + 1;
        for (int i = left; i <= mid; i++) {
            // Move j forward while arr[i] > arr[j] + diff
            while (j <= right && arr[i] > arr[j] + diff) {
                j++;
            }
            // All elements from j to right satisfy arr[i] <= arr[k] + diff
            count += (right - j + 1);
        }
    }

    private void merge(int[] arr, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;

        while (i <= mid && j <= right) {
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }

        // Add remaining elements
        while (i <= mid) {
            temp[k++] = arr[i++];
        }
        while (j <= right) {
            temp[k++] = arr[j++];
        }

        // Copy back to original array
        System.arraycopy(temp, 0, arr, left, temp.length);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n log n)**

- We perform merge sort, which has O(n log n) time complexity
- The counting step adds O(n) per level of recursion, but there are O(log n) levels
- Total: O(n log n) + O(n log n) = O(n log n)

**Space Complexity: O(n)**

- We need O(n) space for the transformed array `arr`
- The merge sort uses O(n) temporary space for merging
- The recursion stack uses O(log n) space
- Total: O(n) dominates

## Common Mistakes

1. **Not transforming the inequality correctly**: Some candidates try to work with the original form `nums1[i] - nums1[j] <= nums2[i] - nums2[j] + diff` directly, which is much harder to optimize. Always look for algebraic transformations that simplify the condition.

2. **Forgetting that i < j matters**: When using data structures that don't preserve order (like sorting), you must ensure you only count pairs where `i < j`. The merge sort approach naturally handles this because we only count pairs between left and right halves.

3. **Off-by-one errors in the counting loop**: In the `count_pairs` function, the loop condition `j <= right` and the count increment `right - j + 1` are easy to get wrong. Test with small examples to verify.

4. **Using binary search instead of two pointers**: Some candidates use binary search in `count_pairs` to find the first `j` where `arr[i] <= arr[j] + diff`. While this works (O(n log n) per level), the two-pointer approach is more efficient (O(n) per level) since both arrays are sorted and we move `j` monotonically.

## When You'll See This Pattern

This problem uses the **"divide and conquer with counting during merge"** pattern, which appears in several counting problems:

1. **Count Inversions (LeetCode 493)**: Count pairs where `i < j` and `nums[i] > 2 * nums[j]`. The structure is almost identical - just change the comparison condition.

2. **Reverse Pairs (LeetCode 493)**: Exactly the problem mentioned above, with the factor of 2.

3. **Count of Smaller Numbers After Self (LeetCode 315)**: Count how many elements to the right are smaller than each element. This uses a similar merge sort approach.

4. **Count Nice Pairs in an Array (LeetCode 1814)**: Another problem that transforms to counting pairs with a specific condition, though it often uses hash maps instead of divide and conquer.

The key pattern: When you need to count pairs `(i, j)` with `i < j` satisfying some condition, and a brute force O(n²) is too slow, consider if you can:

- Transform the condition into something like `f(i) <= g(j)`
- Use divide and conquer (merge sort) to count during merge
- Or use a Fenwick Tree/BIT if values can be compressed

## Key Takeaways

1. **Always look for algebraic transformations** that simplify comparison conditions. Here, transforming to `arr[i] <= arr[j] + diff` made the problem tractable.

2. **The merge sort counting technique** is powerful for counting ordered pairs `(i, j)` with `i < j`. By only counting between left and right halves during merge, we automatically satisfy the `i < j` condition.

3. **Two pointers are often better than binary search** when both sequences are sorted. In our `count_pairs` function, the two-pointer approach gives us O(n) instead of O(n log n) per merge level.

Related problems: [K-diff Pairs in an Array](/problem/k-diff-pairs-in-an-array), [Count Nice Pairs in an Array](/problem/count-nice-pairs-in-an-array), [Count Number of Bad Pairs](/problem/count-number-of-bad-pairs)
