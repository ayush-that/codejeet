---
title: "How to Solve Valid Triangle Number — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Valid Triangle Number. Medium difficulty, 56.7% acceptance rate. Topics: Array, Two Pointers, Binary Search, Greedy, Sorting."
date: "2027-09-19"
category: "dsa-patterns"
tags: ["valid-triangle-number", "array", "two-pointers", "binary-search", "medium"]
---

# How to Solve Valid Triangle Number

Given an array of integers representing side lengths, count how many triplets can form a triangle. The triangle inequality theorem states that for three sides `a`, `b`, and `c` to form a valid triangle, they must satisfy: `a + b > c`, `a + c > b`, and `b + c > a`. What makes this problem interesting is that while checking all three conditions seems necessary, sorting the array reduces it to just one condition: for a sorted triple `a ≤ b ≤ c`, we only need to check `a + b > c`.

## Visual Walkthrough

Let's trace through an example: `nums = [4, 2, 3, 4]`

**Step 1: Sort the array**
Sorted array: `[2, 3, 4, 4]`

**Step 2: Fix the largest side (c)**
We'll iterate from right to left, treating each element as the potential largest side `c`:

- When `c = 4` (index 3), we need to find pairs `(a, b)` from the left portion `[2, 3, 4]` where `a + b > 4`
- When `c = 4` (index 2), we need pairs from `[2, 3]` where `a + b > 4`
- When `c = 3` (index 1), we need pairs from `[2]` where `a + b > 3` (impossible with only one element)

**Step 3: Two-pointer search for each c**
Let's examine `c = 4` (index 3) more closely:

- Initialize `left = 0`, `right = 2` (index before c)
- Check `nums[0] + nums[2] = 2 + 4 = 6 > 4` ✓
  Since this works, ALL pairs with `left = 0` and `right` between `left+1` and `2` will also work:
  - `(2, 3)` at indices (0,1): `2 + 3 = 5 > 4` ✓
  - `(2, 4)` at indices (0,2): `2 + 4 = 6 > 4` ✓
    That's `right - left = 2 - 0 = 2` valid pairs!
- Increment count by 2, then move `left` to 1

**Step 4: Continue for remaining c values**
Following this process:

- For `c = 4` (index 3): found 2 triplets → `(2,3,4)`, `(2,4,4)`
- For `c = 4` (index 2): found 1 triplet → `(2,3,4)` (but wait, this is duplicate!)
- For `c = 3` (index 1): found 0 triplets

Total: 3 unique triplets. Let's verify:

1. `(2,3,4)`: `2+3=5>4`, `2+4=6>3`, `3+4=7>2` ✓
2. `(2,4,4)`: `2+4=6>4`, `2+4=6>4`, `4+4=8>2` ✓
3. `(3,4,4)`: `3+4=7>4`, `3+4=7>4`, `4+4=8>3` ✓

Actually there are 3 valid triangles, not 2! Our visual example missed `(3,4,4)`. This shows why we need to be systematic.

## Brute Force Approach

The most straightforward solution checks all possible triplets:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def triangleNumber(nums):
    n = len(nums)
    count = 0

    # Check all possible triplets
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                a, b, c = nums[i], nums[j], nums[k]
                # Check triangle inequality
                if a + b > c and a + c > b and b + c > a:
                    count += 1
    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function triangleNumber(nums) {
  let count = 0;
  const n = nums.length;

  // Check all possible triplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        const a = nums[i],
          b = nums[j],
          c = nums[k];
        // Check triangle inequality
        if (a + b > c && a + c > b && b + c > a) {
          count++;
        }
      }
    }
  }
  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int triangleNumber(int[] nums) {
    int count = 0;
    int n = nums.length;

    // Check all possible triplets
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                int a = nums[i], b = nums[j], c = nums[k];
                // Check triangle inequality
                if (a + b > c && a + c > b && b + c > a) {
                    count++;
                }
            }
        }
    }
    return count;
}
```

</div>

**Why it's insufficient:** With `n` up to 1000, `O(n³)` is far too slow (up to 1 billion operations). We need at least `O(n²)`.

## Optimized Approach

The key insight is that if we sort the array, for any triple `(a, b, c)` where `a ≤ b ≤ c`, the triangle conditions simplify to just `a + b > c`. Why? Because:

- `a + c > b` is always true (since `c ≥ b` and `a > 0` for positive lengths)
- `b + c > a` is always true (since both `b` and `c` are ≥ `a` and positive)

So we only need to check `a + b > c` for sorted triples.

**Optimization strategy:**

1. Sort the array in ascending order
2. For each element as the potential largest side `c` (starting from the end)
3. Use two pointers to find all pairs `(a, b)` in the subarray before `c` where `a + b > c`

**Why two pointers work:**

- When we fix `c` at position `k`, we need to find all pairs `(i, j)` with `0 ≤ i < j < k` where `nums[i] + nums[j] > nums[k]`
- Since the array is sorted, if `nums[i] + nums[j] > nums[k]`, then for that same `i`, all indices between `i+1` and `j-1` will also satisfy the condition
- This allows us to count multiple pairs at once and move pointers efficiently

## Optimal Solution

Here's the efficient two-pointer approach:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1) or O(n) depending on sort implementation
def triangleNumber(nums):
    # Sort the array to enable the two-pointer approach
    nums.sort()
    n = len(nums)
    count = 0

    # Iterate from the end to use each element as potential largest side (c)
    for k in range(n - 1, 1, -1):
        # Initialize two pointers at the start and just before k
        left, right = 0, k - 1

        # Find all pairs (left, right) where nums[left] + nums[right] > nums[k]
        while left < right:
            # If the current pair forms a valid triangle with nums[k]
            if nums[left] + nums[right] > nums[k]:
                # All pairs with same left and any right between left+1 and current right
                # will also satisfy the condition (because array is sorted)
                count += right - left
                # Move right pointer left to try smaller values
                right -= 1
            else:
                # Sum is too small, need larger left value
                left += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1) or O(n) depending on sort implementation
function triangleNumber(nums) {
  // Sort the array to enable the two-pointer approach
  nums.sort((a, b) => a - b);
  let count = 0;
  const n = nums.length;

  // Iterate from the end to use each element as potential largest side (c)
  for (let k = n - 1; k >= 2; k--) {
    // Initialize two pointers at the start and just before k
    let left = 0,
      right = k - 1;

    // Find all pairs (left, right) where nums[left] + nums[right] > nums[k]
    while (left < right) {
      // If the current pair forms a valid triangle with nums[k]
      if (nums[left] + nums[right] > nums[k]) {
        // All pairs with same left and any right between left+1 and current right
        // will also satisfy the condition (because array is sorted)
        count += right - left;
        // Move right pointer left to try smaller values
        right--;
      } else {
        // Sum is too small, need larger left value
        left++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1) or O(n) depending on sort implementation
public int triangleNumber(int[] nums) {
    // Sort the array to enable the two-pointer approach
    Arrays.sort(nums);
    int count = 0;
    int n = nums.length;

    // Iterate from the end to use each element as potential largest side (c)
    for (int k = n - 1; k >= 2; k--) {
        // Initialize two pointers at the start and just before k
        int left = 0, right = k - 1;

        // Find all pairs (left, right) where nums[left] + nums[right] > nums[k]
        while (left < right) {
            // If the current pair forms a valid triangle with nums[k]
            if (nums[left] + nums[right] > nums[k]) {
                // All pairs with same left and any right between left+1 and current right
                // will also satisfy the condition (because array is sorted)
                count += right - left;
                // Move right pointer left to try smaller values
                right--;
            } else {
                // Sum is too small, need larger left value
                left++;
            }
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n²)`

- Sorting takes `O(n log n)`
- The outer loop runs `n` times (for each potential largest side `c`)
- The inner two-pointer loop runs at most `n` times in total for each `c`, but amortized over all iterations it's `O(n)` per outer iteration
- Total: `O(n log n + n²) = O(n²)` since `n²` dominates for large `n`

**Space Complexity:** `O(1)` or `O(n)`

- If sorting is done in-place (like Python's Timsort), it's `O(1)` auxiliary space
- If sorting requires extra space (like merge sort), it's `O(n)`
- Our algorithm uses only a few variables besides the sorted array

## Common Mistakes

1. **Not sorting the array first:** Many candidates try to apply the two-pointer technique without sorting, which doesn't work because the two-pointer approach relies on the sorted order to efficiently find pairs.

2. **Checking all three triangle conditions after sorting:** After sorting with `a ≤ b ≤ c`, you only need to check `a + b > c`. The other two conditions are automatically satisfied. Checking all three wastes time and adds complexity.

3. **Off-by-one errors in pointer movement:** When `nums[left] + nums[right] > nums[k]`, it's tempting to increment `count` by 1 and move both pointers. But remember: if `(left, right)` works, then `(left, right-1)`, `(left, right-2)`, ... `(left, left+1)` all work too! That's why we add `right - left` to count.

4. **Handling zeros incorrectly:** If the array contains zeros, no triangle can be formed with them (since triangle sides must have positive length). Our solution handles this correctly because when we encounter zeros, `nums[left] + nums[right]` will never be greater than any positive `nums[k]`.

## When You'll See This Pattern

This "sorted array + two pointers for pair finding" pattern appears in several problems:

1. **3Sum Smaller (Medium):** Count triplets with sum less than target. After sorting, fix one element and use two pointers to count pairs with sum < `target - nums[i]`.

2. **Find Polygon With the Largest Perimeter (Medium):** Find the largest perimeter polygon from side lengths. Sort and check from the end, similar to checking triangle inequality but for polygons.

3. **Valid Triangle Number variants:** Any problem involving counting triplets satisfying some inequality condition on sorted arrays can use this pattern.

The core idea is: **sort first, then for each element as a "pivot" or "largest value," use two pointers to efficiently count valid pairs in the remaining subarray.**

## Key Takeaways

1. **Sorting transforms inequality problems:** Many problems involving inequalities become tractable after sorting because it creates an ordering that simplifies the conditions you need to check.

2. **Two-pointer technique for pair finding:** When you need to find pairs satisfying some condition in a sorted array, two pointers starting at opposite ends can often do it in `O(n)` time instead of `O(n²)`.

3. **Fix the largest element first:** For triplet problems where one element plays a special role (like the largest side in a triangle), iterate from the end and treat each element as that special role while searching for pairs in the prefix.

Related problems: [3Sum Smaller](/problem/3sum-smaller), [Find Polygon With the Largest Perimeter](/problem/find-polygon-with-the-largest-perimeter)
