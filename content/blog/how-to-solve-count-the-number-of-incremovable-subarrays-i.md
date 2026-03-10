---
title: "How to Solve Count the Number of Incremovable Subarrays I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count the Number of Incremovable Subarrays I. Easy difficulty, 56.3% acceptance rate. Topics: Array, Two Pointers, Binary Search, Enumeration."
date: "2029-05-12"
category: "dsa-patterns"
tags:
  ["count-the-number-of-incremovable-subarrays-i", "array", "two-pointers", "binary-search", "easy"]
---

# How to Solve Count the Number of Incremovable Subarrays I

This problem asks us to count how many subarrays we can remove from a given array such that the remaining elements form a strictly increasing sequence. What makes this problem interesting is that we need to efficiently identify which subarrays, when removed, leave behind a valid strictly increasing sequence without actually testing every possible removal (which would be too slow). The key insight is recognizing that the remaining elements must consist of an increasing prefix, an increasing suffix, and the prefix's last element must be smaller than the suffix's first element.

## Visual Walkthrough

Let's walk through an example: `nums = [1, 2, 3, 4]`

We need to find all subarrays that, when removed, leave the remaining elements strictly increasing.

**Step 1: Identify the longest increasing prefix**

- Starting from index 0: 1 < 2 < 3 < 4 → the entire array is increasing
- So the longest increasing prefix ends at index 3

**Step 2: Identify the longest increasing suffix**

- Starting from the end: 4 > 3 > 2 > 1 → but wait, we need to check from right to left
- Actually, for a suffix to be increasing when read left to right, we need each element to be smaller than the one to its right
- From right to left: 4 (ok), 3 < 4 (ok), 2 < 3 (ok), 1 < 2 (ok)
- So the longest increasing suffix starts at index 0

**Step 3: Think about valid removals**
For `[1, 2, 3, 4]`, any subarray we remove should leave the remaining elements increasing. Let's test a few:

- Remove `[2, 3]` → remaining: `[1, 4]` → 1 < 4 ✓
- Remove `[1]` → remaining: `[2, 3, 4]` → 2 < 3 < 4 ✓
- Remove `[4]` → remaining: `[1, 2, 3]` → 1 < 2 < 3 ✓

The pattern emerges: we can remove any subarray as long as:

1. All elements before the removal are strictly increasing
2. All elements after the removal are strictly increasing
3. The last element before removal is less than the first element after removal

Let's try a more complex example: `nums = [1, 3, 2, 4]`

**Step 1: Find increasing prefix**

- 1 < 3 ✓
- 3 < 2 ✗ (breaks at index 2)
- So prefix ends at index 1 (value 3)

**Step 2: Find increasing suffix**

- From right: 4 (ok), 2 < 4 ✓, 3 < 2 ✗
- So suffix starts at index 3 (value 4)

**Step 3: Valid removals must cover the "bad" middle**
The array breaks at index 2 (3 > 2). Any valid removal must include this breaking point. We need to remove a subarray that starts somewhere in [0, 1] (inclusive) and ends somewhere in [2, 3] (inclusive), such that after removal, the prefix before removal and suffix after removal connect properly.

## Brute Force Approach

The brute force solution would try every possible subarray (O(n²) of them), remove it, and check if the remaining sequence is strictly increasing (O(n) check). This gives us O(n³) time complexity, which is far too slow for the constraints (n up to 50 in this "Easy" version, but the pattern appears in harder versions with n up to 10⁵).

Here's what the brute force might look like:

```python
def brute_force(nums):
    n = len(nums)
    count = 0

    # Try all possible subarrays [i:j]
    for i in range(n):
        for j in range(i, n):
            # Create the remaining array
            remaining = nums[:i] + nums[j+1:]

            # Check if strictly increasing
            valid = True
            for k in range(1, len(remaining)):
                if remaining[k] <= remaining[k-1]:
                    valid = False
                    break

            if valid:
                count += 1

    return count
```

This approach is too slow because:

1. We generate O(n²) subarrays
2. For each subarray, we create a new array (O(n) space and time)
3. We then check if it's increasing (O(n) time)
4. Total: O(n³) time and O(n) space

## Optimal Solution

The optimal solution uses two pointers to find the boundaries of valid removals. The key insight is that we only need to find the longest increasing prefix and longest increasing suffix, then count how many subarrays we can remove between them.

**Algorithm:**

1. Find the longest increasing prefix (from left)
2. Find the longest increasing suffix (from right)
3. For each possible starting point `i` in the prefix (including one position before the prefix), find how many ending points `j` in the suffix (including one position after the suffix) satisfy `nums[i] < nums[j]`
4. The count of valid `(i, j)` pairs gives us the number of incremovable subarrays

**Why this works:**

- Any valid removal must remove all elements between some `i` and `j-1`
- After removal, elements `nums[0..i-1]` must be increasing (guaranteed by prefix check)
- Elements `nums[j..n-1]` must be increasing (guaranteed by suffix check)
- And `nums[i-1] < nums[j]` must hold for the sequences to connect properly

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countIncremovableSubarrays(nums):
    n = len(nums)

    # Step 1: Find the longest increasing prefix
    # We find the first index where the sequence breaks
    prefix_end = 0
    while prefix_end + 1 < n and nums[prefix_end] < nums[prefix_end + 1]:
        prefix_end += 1

    # If the entire array is strictly increasing, all subarrays are valid
    if prefix_end == n - 1:
        # For an array of length n, there are n*(n+1)/2 subarrays
        return n * (n + 1) // 2

    # Step 2: Find the longest increasing suffix
    # We find the first index from the right where sequence breaks
    suffix_start = n - 1
    while suffix_start > 0 and nums[suffix_start - 1] < nums[suffix_start]:
        suffix_start -= 1

    # Step 3: Count valid subarrays using two pointers
    count = 0
    left = 0  # Start of subarray to remove
    right = suffix_start  # End of subarray to remove (inclusive)

    # For each possible left boundary, find valid right boundaries
    while left <= prefix_end + 1:  # +1 to include position just after prefix
        # Move right pointer until we find a valid connection
        while right < n and (left > 0 and nums[left - 1] >= nums[right]):
            right += 1

        # All subarrays from [left, right-1] to [left, n-1] are valid
        # That's (n - right) subarrays for this left position
        count += n - right

        # Move to next left position
        left += 1

    return count
```

```javascript
// Time: O(n) | Space: O(1)
function countIncremovableSubarrays(nums) {
  const n = nums.length;

  // Step 1: Find the longest increasing prefix
  let prefixEnd = 0;
  while (prefixEnd + 1 < n && nums[prefixEnd] < nums[prefixEnd + 1]) {
    prefixEnd++;
  }

  // If entire array is strictly increasing, all subarrays are valid
  if (prefixEnd === n - 1) {
    // For an array of length n, there are n*(n+1)/2 subarrays
    return (n * (n + 1)) / 2;
  }

  // Step 2: Find the longest increasing suffix
  let suffixStart = n - 1;
  while (suffixStart > 0 && nums[suffixStart - 1] < nums[suffixStart]) {
    suffixStart--;
  }

  // Step 3: Count valid subarrays using two pointers
  let count = 0;
  let left = 0; // Start of subarray to remove
  let right = suffixStart; // End of subarray to remove (inclusive)

  // For each possible left boundary, find valid right boundaries
  while (left <= prefixEnd + 1) {
    // +1 to include position just after prefix
    // Move right pointer until we find a valid connection
    while (right < n && left > 0 && nums[left - 1] >= nums[right]) {
      right++;
    }

    // All subarrays from [left, right-1] to [left, n-1] are valid
    // That's (n - right) subarrays for this left position
    count += n - right;

    // Move to next left position
    left++;
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(1)
public int countIncremovableSubarrays(int[] nums) {
    int n = nums.length;

    // Step 1: Find the longest increasing prefix
    int prefixEnd = 0;
    while (prefixEnd + 1 < n && nums[prefixEnd] < nums[prefixEnd + 1]) {
        prefixEnd++;
    }

    // If entire array is strictly increasing, all subarrays are valid
    if (prefixEnd == n - 1) {
        // For an array of length n, there are n*(n+1)/2 subarrays
        return n * (n + 1) / 2;
    }

    // Step 2: Find the longest increasing suffix
    int suffixStart = n - 1;
    while (suffixStart > 0 && nums[suffixStart - 1] < nums[suffixStart]) {
        suffixStart--;
    }

    // Step 3: Count valid subarrays using two pointers
    int count = 0;
    int left = 0;  // Start of subarray to remove
    int right = suffixStart;  // End of subarray to remove (inclusive)

    // For each possible left boundary, find valid right boundaries
    while (left <= prefixEnd + 1) {  // +1 to include position just after prefix
        // Move right pointer until we find a valid connection
        while (right < n && (left > 0 && nums[left - 1] >= nums[right])) {
            right++;
        }

        // All subarrays from [left, right-1] to [left, n-1] are valid
        // That's (n - right) subarrays for this left position
        count += n - right;

        // Move to next left position
        left++;
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Finding the increasing prefix: O(n) in worst case (scan from left to right)
- Finding the increasing suffix: O(n) in worst case (scan from right to left)
- Counting valid subarrays with two pointers: O(n) because `left` goes from 0 to `prefixEnd+1` and `right` only moves forward, each pointer moves at most n times
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(1)**

- We only use a constant amount of extra space for pointers and counters
- No additional data structures are created

## Common Mistakes

1. **Off-by-one errors in pointer boundaries**: The trickiest part is handling the inclusive/exclusive boundaries correctly. Remember that `left` can go up to `prefixEnd + 1` (to include removing everything from a position just after the prefix), and we need to check `nums[left-1]` when `left > 0`.

2. **Forgetting the special case of entirely increasing array**: When the entire array is strictly increasing, ANY subarray removal leaves an increasing sequence. This needs to be handled separately to return `n*(n+1)/2`.

3. **Incorrectly checking the connection condition**: The condition `nums[left-1] < nums[right]` is crucial. Some candidates mistakenly check `nums[left] < nums[right]` or forget to handle the case when `left = 0` (no prefix before removal).

4. **Double-counting or missing subarrays**: When counting valid `(left, right)` pairs, remember that for a given `left`, all `right` values from the current `right` to `n-1` are valid. This gives us `n - right` subarrays for that `left`.

## When You'll See This Pattern

This problem uses the **two pointers with prefix/suffix precomputation** pattern, which appears in many array manipulation problems:

1. **Shortest Subarray to be Removed to Make Array Sorted (Medium)**: Very similar problem - instead of counting all valid removals, you find the minimum length removal. Uses the same prefix/suffix approach.

2. **Number of Subarrays That Match a Pattern I (Medium)**: While not identical, it uses similar sliding window techniques for pattern matching in subarrays.

3. **Minimum Size Subarray Sum (Medium)**: Uses the two-pointer sliding window technique to find subarrays satisfying a condition.

4. **Longest Mountain in Array (Medium)**: Uses prefix and suffix computations to find increasing then decreasing sequences.

The core idea is to precompute some property from both ends (prefix/suffix), then use two pointers to efficiently find valid ranges in the middle.

## Key Takeaways

1. **Prefix/Suffix precomputation is powerful**: When you need to check properties about removing middle segments, computing what's true from the left and right ends first can simplify the problem dramatically.

2. **Two pointers for range counting**: When you need to count pairs (i, j) satisfying a monotonic condition, two pointers moving in one direction can often do it in O(n) instead of O(n²).

3. **Handle edge cases early**: The entirely increasing array case shows why it's important to identify special cases upfront. They often have simpler solutions and prevent complex logic from breaking down.

4. **Visualize with concrete examples**: Before coding, walk through examples like `[1, 2, 3, 4]` and `[1, 3, 2, 4]` to understand the pattern of valid removals.

Related problems: [Shortest Subarray to be Removed to Make Array Sorted](/problem/shortest-subarray-to-be-removed-to-make-array-sorted), [Number of Subarrays That Match a Pattern I](/problem/number-of-subarrays-that-match-a-pattern-i)
