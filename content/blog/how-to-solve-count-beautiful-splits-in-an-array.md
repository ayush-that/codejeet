---
title: "How to Solve Count Beautiful Splits in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Beautiful Splits in an Array. Medium difficulty, 18.6% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-07-06"
category: "dsa-patterns"
tags: ["count-beautiful-splits-in-an-array", "array", "dynamic-programming", "medium"]
---

# How to Solve Count Beautiful Splits in an Array

This problem asks us to count how many ways we can split an array into three contiguous subarrays where the first subarray is a prefix of the third subarray. The challenge lies in efficiently checking all possible split points while verifying the prefix condition without repeatedly comparing entire subarrays.

## Visual Walkthrough

Let's trace through a small example: `nums = [1,2,3,1,2,3,4]`

We need to find all pairs of indices `(i, j)` where:

- `0 < i < j < n` (so we have three non-empty subarrays)
- `nums[0..i-1]` is a prefix of `nums[j..n-1]`

Let's check some possibilities:

**Split at i=2, j=4:**

- `nums1 = [1,2]` (indices 0-1)
- `nums2 = [3,1,2]` (indices 2-3)
- `nums3 = [3,4]` (indices 4-6)
- Is `[1,2]` a prefix of `[3,4]`? No, because first elements differ.

**Split at i=3, j=6:**

- `nums1 = [1,2,3]` (indices 0-2)
- `nums2 = [1,2,3]` (indices 3-5)
- `nums3 = [4]` (indices 6-6)
- Is `[1,2,3]` a prefix of `[4]`? No, because `[4]` is shorter than `nums1`.

**Split at i=3, j=5:**

- `nums1 = [1,2,3]` (indices 0-2)
- `nums2 = [1,2]` (indices 3-4)
- `nums3 = [3,4]` (indices 5-6)
- Is `[1,2,3]` a prefix of `[3,4]`? No, because first elements differ.

**Split at i=2, j=5:**

- `nums1 = [1,2]` (indices 0-1)
- `nums2 = [3,1,2]` (indices 2-4)
- `nums3 = [3,4]` (indices 5-6)
- Is `[1,2]` a prefix of `[3,4]`? No.

**Split at i=1, j=4:**

- `nums1 = [1]` (indices 0-0)
- `nums2 = [2,3,1]` (indices 1-3)
- `nums3 = [2,3,4]` (indices 4-6)
- Is `[1]` a prefix of `[2,3,4]`? No.

**Split at i=1, j=5:**

- `nums1 = [1]` (indices 0-0)
- `nums2 = [2,3,1,2]` (indices 1-4)
- `nums3 = [3,4]` (indices 5-6)
- Is `[1]` a prefix of `[3,4]`? No.

Actually, for this array, there are **no** beautiful splits! The key insight is that `nums1` must match the beginning of `nums3`, so we need to efficiently check this condition for all possible `(i, j)` pairs.

## Brute Force Approach

The most straightforward approach is to check every possible pair of split points:

1. For each possible `i` from 1 to `n-2` (ensuring at least one element in each subarray)
2. For each possible `j` from `i+1` to `n-1`
3. Check if `nums[0..i-1]` is a prefix of `nums[j..n-1]`

The prefix check requires comparing up to `i` elements, and we have O(n²) pairs to check, giving us O(n³) time complexity.

Here's what the brute force code looks like:

<div class="code-group">

```python
# Time: O(n^3) | Space: O(1)
def countBeautifulSplitsBrute(nums):
    n = len(nums)
    count = 0

    # Try all possible first split points
    for i in range(1, n - 1):  # i is end of nums1 (exclusive)
        # Try all possible second split points
        for j in range(i + 1, n):
            # Check if nums[0:i] is a prefix of nums[j:]
            is_prefix = True
            # We can only check up to min(i, n-j) elements
            # since nums3 might be shorter than nums1
            for k in range(min(i, n - j)):
                if nums[k] != nums[j + k]:
                    is_prefix = False
                    break
            # If nums1 is longer than nums3, it can't be a prefix
            if i > n - j:
                is_prefix = False

            if is_prefix:
                count += 1

    return count
```

```javascript
// Time: O(n^3) | Space: O(1)
function countBeautifulSplitsBrute(nums) {
  const n = nums.length;
  let count = 0;

  // Try all possible first split points
  for (let i = 1; i < n - 1; i++) {
    // Try all possible second split points
    for (let j = i + 1; j < n; j++) {
      // Check if nums[0:i] is a prefix of nums[j:]
      let isPrefix = true;
      // We can only check up to min(i, n-j) elements
      const checkLength = Math.min(i, n - j);

      for (let k = 0; k < checkLength; k++) {
        if (nums[k] !== nums[j + k]) {
          isPrefix = false;
          break;
        }
      }

      // If nums1 is longer than nums3, it can't be a prefix
      if (i > n - j) {
        isPrefix = false;
      }

      if (isPrefix) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n^3) | Space: O(1)
public int countBeautifulSplitsBrute(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Try all possible first split points
    for (int i = 1; i < n - 1; i++) {
        // Try all possible second split points
        for (int j = i + 1; j < n; j++) {
            // Check if nums[0:i] is a prefix of nums[j:]
            boolean isPrefix = true;
            // We can only check up to min(i, n-j) elements
            int checkLength = Math.min(i, n - j);

            for (int k = 0; k < checkLength; k++) {
                if (nums[k] != nums[j + k]) {
                    isPrefix = false;
                    break;
                }
            }

            // If nums1 is longer than nums3, it can't be a prefix
            if (i > n - j) {
                isPrefix = false;
            }

            if (isPrefix) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

This brute force solution is too slow for the constraints (n up to 1000 would be 10⁹ operations). We need a more efficient approach.

## Optimized Approach

The key insight is that we can precompute information to answer prefix queries faster. For each position `j` where `nums3` starts, we want to know: "For what lengths `L` is `nums[0..L-1]` a prefix of `nums[j..n-1]`?"

We can use the **Z-algorithm** (also known as the Z-function) to solve this efficiently. The Z-algorithm computes for each position `i` in the array, the length of the longest substring starting at `i` that is also a prefix of the whole array.

Here's the step-by-step reasoning:

1. **Reverse the problem**: Instead of checking if `nums[0..i-1]` is a prefix of `nums[j..]`, we can check if the substring starting at `j` matches the prefix of length `i`.

2. **Use Z-algorithm**: Compute `z[j]` = length of longest common prefix between `nums[j..]` and `nums[0..]`.

3. **For each j**: If `z[j] >= i`, then `nums[0..i-1]` is a prefix of `nums[j..]`.

4. **Counting valid splits**: For each `j` (starting position of `nums3`), we need to count how many `i` values satisfy:
   - `1 <= i <= j-1` (so `nums2` is non-empty)
   - `i <= z[j]` (prefix condition)
   - `i <= n-j` (so `nums3` is at least as long as `nums1`)

5. **Final count**: For each `j`, the number of valid `i` values is `min(z[j], j-1, n-j)`.

The Z-algorithm runs in O(n) time, and then we can compute the answer in O(n) time by iterating through all `j` values.

## Optimal Solution

Here's the complete solution using the Z-algorithm:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countBeautifulSplits(nums):
    n = len(nums)

    # Step 1: Compute Z-array using Z-algorithm
    # z[i] = length of longest common prefix between nums[i:] and nums[0:]
    z = [0] * n
    left = right = 0  # [left, right) is the current Z-box

    for i in range(1, n):
        # Case 1: i is outside current Z-box
        if i > right:
            left = right = i
            # Expand while characters match
            while right < n and nums[right] == nums[right - left]:
                right += 1
            z[i] = right - left
            right -= 1  # Adjust right pointer
        # Case 2: i is inside current Z-box
        else:
            k = i - left  # Corresponding position in prefix
            # If z[k] is less than remaining box, we can copy
            if z[k] < right - i + 1:
                z[i] = z[k]
            # Otherwise, we need to expand
            else:
                left = i
                while right < n and nums[right] == nums[right - left]:
                    right += 1
                z[i] = right - left
                right -= 1  # Adjust right pointer

    # Step 2: Count beautiful splits
    count = 0
    # j is the starting index of nums3
    for j in range(2, n):  # j must be at least 2 to have non-empty nums1 and nums2
        # z[j] tells us how many elements from the start match nums[j:]
        # We need i <= z[j] for prefix condition
        # Also i <= j-1 (so nums2 is non-empty)
        # And i <= n-j (so nums3 is at least as long as nums1)
        max_valid_i = min(z[j], j - 1, n - j)
        if max_valid_i > 0:
            count += max_valid_i

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function countBeautifulSplits(nums) {
  const n = nums.length;

  // Step 1: Compute Z-array using Z-algorithm
  // z[i] = length of longest common prefix between nums[i:] and nums[0:]
  const z = new Array(n).fill(0);
  let left = 0,
    right = 0; // [left, right) is the current Z-box

  for (let i = 1; i < n; i++) {
    // Case 1: i is outside current Z-box
    if (i > right) {
      left = right = i;
      // Expand while characters match
      while (right < n && nums[right] === nums[right - left]) {
        right++;
      }
      z[i] = right - left;
      right--; // Adjust right pointer
    }
    // Case 2: i is inside current Z-box
    else {
      const k = i - left; // Corresponding position in prefix
      // If z[k] is less than remaining box, we can copy
      if (z[k] < right - i + 1) {
        z[i] = z[k];
      }
      // Otherwise, we need to expand
      else {
        left = i;
        while (right < n && nums[right] === nums[right - left]) {
          right++;
        }
        z[i] = right - left;
        right--; // Adjust right pointer
      }
    }
  }

  // Step 2: Count beautiful splits
  let count = 0;
  // j is the starting index of nums3
  for (let j = 2; j < n; j++) {
    // j must be at least 2 to have non-empty nums1 and nums2
    // z[j] tells us how many elements from the start match nums[j:]
    // We need i <= z[j] for prefix condition
    // Also i <= j-1 (so nums2 is non-empty)
    // And i <= n-j (so nums3 is at least as long as nums1)
    const maxValidI = Math.min(z[j], j - 1, n - j);
    if (maxValidI > 0) {
      count += maxValidI;
    }
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
public int countBeautifulSplits(int[] nums) {
    int n = nums.length;

    // Step 1: Compute Z-array using Z-algorithm
    // z[i] = length of longest common prefix between nums[i:] and nums[0:]
    int[] z = new int[n];
    int left = 0, right = 0;  // [left, right) is the current Z-box

    for (int i = 1; i < n; i++) {
        // Case 1: i is outside current Z-box
        if (i > right) {
            left = right = i;
            // Expand while characters match
            while (right < n && nums[right] == nums[right - left]) {
                right++;
            }
            z[i] = right - left;
            right--;  // Adjust right pointer
        }
        // Case 2: i is inside current Z-box
        else {
            int k = i - left;  // Corresponding position in prefix
            // If z[k] is less than remaining box, we can copy
            if (z[k] < right - i + 1) {
                z[i] = z[k];
            }
            // Otherwise, we need to expand
            else {
                left = i;
                while (right < n && nums[right] == nums[right - left]) {
                    right++;
                }
                z[i] = right - left;
                right--;  // Adjust right pointer
            }
        }
    }

    // Step 2: Count beautiful splits
    int count = 0;
    // j is the starting index of nums3
    for (int j = 2; j < n; j++) {  // j must be at least 2 to have non-empty nums1 and nums2
        // z[j] tells us how many elements from the start match nums[j:]
        // We need i <= z[j] for prefix condition
        // Also i <= j-1 (so nums2 is non-empty)
        // And i <= n-j (so nums3 is at least as long as nums1)
        int maxValidI = Math.min(z[j], Math.min(j - 1, n - j));
        if (maxValidI > 0) {
            count += maxValidI;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- The Z-algorithm runs in O(n) time. Each character is compared at most twice: once when it's included in a Z-box, and once when we expand beyond the current Z-box.
- Counting the beautiful splits takes O(n) time by iterating through the z-array once.

**Space Complexity: O(n)**

- We need O(n) space to store the z-array.
- The input array is given, so we don't count it toward space complexity.

## Common Mistakes

1. **Forgetting that all three subarrays must be non-empty**: The conditions `0 < i < j < n` are crucial. Some candidates might allow `i=0` or `j=n`, which would create empty subarrays.

2. **Incorrect prefix length check**: When checking if `nums1` is a prefix of `nums3`, you must ensure `nums3` is at least as long as `nums1`. A common mistake is only checking element-by-element without verifying lengths.

3. **Off-by-one errors in Z-algorithm implementation**: The Z-algorithm has tricky index manipulations. Common errors include:
   - Forgetting to decrement `right` after expanding a Z-box
   - Incorrect calculation of `k = i - left`
   - Wrong comparison in the condition `z[k] < right - i + 1`

4. **Missing the optimization with min() in final count**: After computing z[j], the number of valid i values is `min(z[j], j-1, n-j)`. Some candidates might only use `min(z[j], j-1)` and forget the `n-j` constraint.

## When You'll See This Pattern

The Z-algorithm pattern appears in problems involving string/array matching, especially when you need to find prefixes or repeated patterns:

1. **Find All Anagrams in a String (LeetCode 438)**: While typically solved with sliding window, Z-algorithm can find all occurrences of a pattern.
2. **Repeated Substring Pattern (LeetCode 459)**: Check if a string can be formed by repeating a substring, which can be solved with Z-algorithm.
3. **Shortest Palindrome (LeetCode 214)**: Find the shortest palindrome by adding characters to the beginning, solvable with Z-algorithm on the reversed string.

The core idea is recognizing when you need to compare prefixes with suffixes or substrings starting at different positions.

## Key Takeaways

1. **Z-algorithm is powerful for prefix matching**: When you need to check if prefixes match substrings starting at various positions, Z-algorithm provides O(n) preprocessing followed by O(1) queries.

2. **Break down complex conditions**: The problem has multiple constraints (non-empty subarrays, prefix condition, length constraints). Breaking them down and handling each separately makes the solution clearer.

3. **Precomputation enables optimization**: Instead of checking O(n²) pairs with O(n) comparisons each (O(n³) total), we can precompute the Z-array in O(n) time and then answer each query in O(1) time.

[Practice this problem on CodeJeet](/problem/count-beautiful-splits-in-an-array)
