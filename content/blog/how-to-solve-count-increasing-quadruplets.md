---
title: "How to Solve Count Increasing Quadruplets — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Count Increasing Quadruplets. Hard difficulty, 34.6% acceptance rate. Topics: Array, Dynamic Programming, Binary Indexed Tree, Enumeration, Prefix Sum."
date: "2026-04-07"
category: "dsa-patterns"
tags:
  ["count-increasing-quadruplets", "array", "dynamic-programming", "binary-indexed-tree", "hard"]
---

# How to Solve Count Increasing Quadruplets

This problem asks us to count quadruplets `(i, j, k, l)` where `0 <= i < j < k < l < n` and `nums[i] < nums[k] < nums[j] < nums[l]`. The tricky part is the non-standard ordering constraint: `nums[i] < nums[k] < nums[j] < nums[l]` means the middle two elements are reversed (`nums[k] < nums[j]`), creating a "1324" pattern where the third element is smaller than the second. This makes it more complex than simple increasing sequences.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 3, 2, 4]` (n=4).

We need to find all `(i, j, k, l)` satisfying:

1. `0 <= i < j < k < l < 4`
2. `nums[i] < nums[k] < nums[j] < nums[l]`

Let's check possible quadruplets:

- `(0, 1, 2, 3)`: nums = [1, 3, 2, 4]. Check: `1 < 2 < 3 < 4` ✓
- `(0, 1, 2, ?)` - no valid l after index 2
- `(0, 1, ?)` - no valid k after index 1
- `(0, 2, 3, ?)` - no valid l after index 3
- `(1, 2, 3, ?)` - no valid l after index 3

Only one valid quadruplet: `(0, 1, 2, 3)`. The key insight is that for each `(j, k)` pair, we need to count:

1. How many `i < j` have `nums[i] < nums[k]` (elements before j smaller than nums[k])
2. How many `l > k` have `nums[l] > nums[j]` (elements after k larger than nums[j])

For `j=1, k=2` in our example:

- `nums[j]=3, nums[k]=2`
- `i` candidates before index 1: index 0 with value 1. `1 < 2` ✓ → 1 valid i
- `l` candidates after index 2: index 3 with value 4. `4 > 3` ✓ → 1 valid l
- Contribution: `1 × 1 = 1` quadruplet

## Brute Force Approach

The brute force solution checks all possible quadruplets:

<div class="code-group">

```python
# Time: O(n^4) | Space: O(1)
def countQuadruplets(nums):
    n = len(nums)
    count = 0

    # Check all possible quadruplets
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                for l in range(k + 1, n):
                    if nums[i] < nums[k] < nums[j] < nums[l]:
                        count += 1

    return count
```

```javascript
// Time: O(n^4) | Space: O(1)
function countQuadruplets(nums) {
  const n = nums.length;
  let count = 0;

  // Check all possible quadruplets
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      for (let k = j + 1; k < n; k++) {
        for (let l = k + 1; l < n; l++) {
          if (nums[i] < nums[k] && nums[k] < nums[j] && nums[j] < nums[l]) {
            count++;
          }
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n^4) | Space: O(1)
public long countQuadruplets(int[] nums) {
    int n = nums.length;
    long count = 0;

    // Check all possible quadruplets
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                for (int l = k + 1; l < n; l++) {
                    if (nums[i] < nums[k] && nums[k] < nums[j] && nums[j] < nums[l]) {
                        count++;
                    }
                }
            }
        }
    }

    return count;
}
```

</div>

This runs in O(n⁴) time, which is far too slow for n up to 4000 (4000⁴ = 256 trillion operations). We need a smarter approach.

## Optimized Approach

The key insight is to fix the middle two indices `(j, k)` and count valid `i` and `l` for each pair. For fixed `j` and `k`:

- We need `nums[i] < nums[k]` where `i < j`
- We need `nums[l] > nums[j]` where `l > k`

We can precompute two 2D arrays:

1. `less[k][x]`: number of indices `i < k` with `nums[i] < x`
2. `greater[j][x]`: number of indices `l > j` with `nums[l] > x`

Then for each `(j, k)` pair with `j < k`:

- Valid `i` count = `less[j][nums[k]]` (indices before j with value < nums[k])
- Valid `l` count = `greater[k][nums[j]]` (indices after k with value > nums[j])
- Contribution = `less[j][nums[k]] * greater[k][nums[j]]`

We need to be careful: `less[j][nums[k]]` counts indices before j, not before k. This is correct because we need `i < j`.

## Optimal Solution

Here's the optimized solution using prefix sums:

<div class="code-group">

```python
# Time: O(n^2) | Space: O(n^2)
def countQuadruplets(nums):
    n = len(nums)

    # less[k][x]: count of indices i < k where nums[i] < x
    # Since nums contains 1..n, x ranges from 1 to n
    less = [[0] * (n + 2) for _ in range(n)]

    # Build less table
    for k in range(n):
        if k > 0:
            # Copy previous row to maintain counts for indices < k
            less[k] = less[k-1][:]

        # Update counts: for all x > nums[k], increment count
        # because nums[k] is now an element at index k
        # This will affect counts for future k values
        for x in range(nums[k] + 1, n + 2):
            less[k][x] += 1

    # greater[j][x]: count of indices l > j where nums[l] > x
    greater = [[0] * (n + 2) for _ in range(n)]

    # Build greater table from the end
    for j in range(n-1, -1, -1):
        if j < n-1:
            # Copy next row to maintain counts for indices > j
            greater[j] = greater[j+1][:]

        # Update counts: for all x < nums[j], increment count
        # because nums[j] is now an element at index j
        # This will affect counts for previous j values
        for x in range(1, nums[j]):
            greater[j][x] += 1

    # Count quadruplets
    count = 0
    for j in range(n):
        for k in range(j + 1, n):
            if nums[j] > nums[k]:
                # nums[i] < nums[k] and i < j
                valid_i = less[j][nums[k]]
                # nums[l] > nums[j] and l > k
                valid_l = greater[k][nums[j]]
                count += valid_i * valid_l

    return count
```

```javascript
// Time: O(n^2) | Space: O(n^2)
function countQuadruplets(nums) {
  const n = nums.length;

  // less[k][x]: count of indices i < k where nums[i] < x
  const less = Array.from({ length: n }, () => new Array(n + 2).fill(0));

  // Build less table
  for (let k = 0; k < n; k++) {
    if (k > 0) {
      // Copy previous row
      less[k] = [...less[k - 1]];
    }

    // Update counts for all x > nums[k]
    for (let x = nums[k] + 1; x <= n + 1; x++) {
      less[k][x]++;
    }
  }

  // greater[j][x]: count of indices l > j where nums[l] > x
  const greater = Array.from({ length: n }, () => new Array(n + 2).fill(0));

  // Build greater table from the end
  for (let j = n - 1; j >= 0; j--) {
    if (j < n - 1) {
      // Copy next row
      greater[j] = [...greater[j + 1]];
    }

    // Update counts for all x < nums[j]
    for (let x = 1; x < nums[j]; x++) {
      greater[j][x]++;
    }
  }

  // Count quadruplets
  let count = 0;
  for (let j = 0; j < n; j++) {
    for (let k = j + 1; k < n; k++) {
      if (nums[j] > nums[k]) {
        // nums[i] < nums[k] and i < j
        const valid_i = less[j][nums[k]];
        // nums[l] > nums[j] and l > k
        const valid_l = greater[k][nums[j]];
        count += valid_i * valid_l;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n^2) | Space: O(n^2)
public long countQuadruplets(int[] nums) {
    int n = nums.length;

    // less[k][x]: count of indices i < k where nums[i] < x
    int[][] less = new int[n][n + 2];

    // Build less table
    for (int k = 0; k < n; k++) {
        if (k > 0) {
            // Copy previous row
            System.arraycopy(less[k-1], 0, less[k], 0, n + 2);
        }

        // Update counts for all x > nums[k]
        for (int x = nums[k] + 1; x <= n + 1; x++) {
            less[k][x]++;
        }
    }

    // greater[j][x]: count of indices l > j where nums[l] > x
    int[][] greater = new int[n][n + 2];

    // Build greater table from the end
    for (int j = n - 1; j >= 0; j--) {
        if (j < n - 1) {
            // Copy next row
            System.arraycopy(greater[j+1], 0, greater[j], 0, n + 2);
        }

        // Update counts for all x < nums[j]
        for (int x = 1; x < nums[j]; x++) {
            greater[j][x]++;
        }
    }

    // Count quadruplets
    long count = 0;
    for (int j = 0; j < n; j++) {
        for (int k = j + 1; k < n; k++) {
            if (nums[j] > nums[k]) {
                // nums[i] < nums[k] and i < j
                int valid_i = less[j][nums[k]];
                // nums[l] > nums[j] and l > k
                int valid_l = greater[k][nums[j]];
                count += (long) valid_i * valid_l;
            }
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n²)

- Building the `less` table: O(n²) - for each of n positions, we update up to n values
- Building the `greater` table: O(n²) - same as above
- Counting quadruplets: O(n²) - checking all (j, k) pairs
- Total: O(n²) + O(n²) + O(n²) = O(n²)

**Space Complexity:** O(n²)

- We store two 2D arrays of size n × (n+2)
- Each array uses O(n²) space
- Total: O(n²)

## Common Mistakes

1. **Wrong index boundaries in prefix arrays:** Using `less[k][nums[k]]` instead of `less[j][nums[k]]`. Remember: `i` must be before `j`, not before `k`.

2. **Forgetting the `nums[j] > nums[k]` condition:** The pattern requires `nums[k] < nums[j]`. Without this check, you'll count invalid quadruplets.

3. **Integer overflow with large counts:** The result can be large (up to ~n⁴/24). Use `long` in Java and ensure multiplication doesn't overflow.

4. **Incorrect array sizes:** Since `nums` contains values 1..n, we need arrays of size n+2 to safely access indices `nums[k]` and `nums[j]` without bounds errors.

## When You'll See This Pattern

This "fix middle elements and count ends" pattern appears in several counting problems:

1. **Count Good Triplets in an Array (Hard):** Similar structure but with triplets instead of quadruplets. You fix the middle element and count valid left/right elements.

2. **132 Pattern (Medium):** Looking for `i < j < k` with `nums[i] < nums[k] < nums[j]`. This is essentially our quadruplet problem without the fourth element.

3. **Count Increasing Triplets (Medium):** Simpler version where you count `i < j < k` with `nums[i] < nums[j] < nums[k]`.

The core technique is using prefix/suffix arrays or Fenwick Trees to quickly query counts of elements satisfying certain conditions relative to a fixed position.

## Key Takeaways

1. **Break complex constraints into simpler parts:** When dealing with multiple indices, fix some indices and precompute information about the others. Here, fixing `(j, k)` lets us count valid `i` and `l` efficiently.

2. **Prefix/suffix arrays for range queries:** When you need to count elements before/after a position satisfying a condition, precomputing prefix/suffix counts transforms O(n) queries into O(1) lookups.

3. **Look for symmetry in constraints:** The `nums[i] < nums[k]` and `nums[l] > nums[j]` constraints are symmetric - one looks backward, one looks forward. This symmetry often suggests a prefix/suffix approach.

Related problems: [Increasing Triplet Subsequence](/problem/increasing-triplet-subsequence), [Count Special Quadruplets](/problem/count-special-quadruplets), [Count Good Triplets in an Array](/problem/count-good-triplets-in-an-array)
