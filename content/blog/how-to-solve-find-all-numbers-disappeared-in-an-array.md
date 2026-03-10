---
title: "How to Solve Find All Numbers Disappeared in an Array — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find All Numbers Disappeared in an Array. Easy difficulty, 63.8% acceptance rate. Topics: Array, Hash Table."
date: "2026-08-13"
category: "dsa-patterns"
tags: ["find-all-numbers-disappeared-in-an-array", "array", "hash-table", "easy"]
---

# How to Solve Find All Numbers Disappeared in an Array

You’re given an array of `n` integers where each number is between `1` and `n` inclusive. Your task is to return a list of all integers from `1` to `n` that are missing from the array. The challenge is to do this efficiently without using extra space for a hash table—though that’s a valid starting point—and to handle the fact that numbers can appear multiple times or not at all. What makes this problem interesting is that it looks like a simple lookup problem, but the optimal solution uses a clever in-place marking technique that turns the array itself into a hash table.

## Visual Walkthrough

Let’s walk through an example step by step to build intuition. Suppose `nums = [4, 3, 2, 7, 8, 2, 3, 1]`. The length `n = 8`, so we’re looking for numbers from `1` to `8` that are missing.

**Step 1 – Understanding the range:**  
We have indices `0` to `7` in the array. The numbers in the array are between `1` and `8`. If we think about it, each number `x` could map to index `x-1` (since arrays are zero-indexed). For example, the number `4` maps to index `3`.

**Step 2 – Marking presence:**  
We can use the array itself to mark which numbers we’ve seen. How? For each number `x` we encounter, we look at index `x-1` and mark it in some way. A common trick is to make the value at that index negative. Since all numbers are positive initially, a negative value at index `i` will mean that the number `i+1` has been seen.

Let’s trace through the marking process:

- Start: `[4, 3, 2, 7, 8, 2, 3, 1]`
- First element is `4`. Go to index `3` (4-1). The value at index 3 is `7`. Make it negative: `[4, 3, 2, -7, 8, 2, 3, 1]`
- Second element is `3`. Go to index `2` (3-1). Value is `2`. Make it negative: `[4, 3, -2, -7, 8, 2, 3, 1]`
- Third element is `2`. Go to index `1` (2-1). Value is `3`. Make it negative: `[4, -3, -2, -7, 8, 2, 3, 1]`
- Fourth element is `7`. Go to index `6` (7-1). Value is `3`. Make it negative: `[4, -3, -2, -7, 8, 2, -3, 1]`
- Fifth element is `8`. Go to index `7` (8-1). Value is `1`. Make it negative: `[4, -3, -2, -7, 8, 2, -3, -1]`
- Sixth element is `2`. Go to index `1` (2-1). Value is `-3` (already negative). Leave it as is.
- Seventh element is `3`. Go to index `2` (3-1). Value is `-2` (already negative). Leave it as is.
- Eighth element is `1`. Go to index `0` (1-1). Value is `4`. Make it negative: `[-4, -3, -2, -7, 8, 2, -3, -1]`

**Step 3 – Finding missing numbers:**  
Now, look at the final array: `[-4, -3, -2, -7, 8, 2, -3, -1]`. Which indices have positive values? Index `4` has `8` (positive) and index `5` has `2` (positive). That means the numbers `5` (index+1) and `6` (index+1) are missing from the original array. So the answer is `[5, 6]`.

This in-place marking lets us track seen numbers without extra space.

## Brute Force Approach

The most straightforward way is to use a hash set. We can store all numbers from `1` to `n` in a set, then iterate through `nums` and remove each number we see. Whatever remains in the set are the missing numbers.

**Why it’s insufficient:**  
This approach takes `O(n)` extra space for the hash set. While that’s acceptable in many real-world scenarios, interviewers often expect the `O(1)` space solution for this problem because it demonstrates a deeper understanding of array manipulation. The brute force also requires two passes: one to build the set and one to check.

Here’s what the brute force code looks like:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def findDisappearedNumbers(nums):
    n = len(nums)
    # Create a set of all numbers from 1 to n
    num_set = set(range(1, n + 1))
    # Remove numbers we see in nums
    for num in nums:
        if num in num_set:
            num_set.remove(num)
    # What's left are the missing numbers
    return list(num_set)
```

```javascript
// Time: O(n) | Space: O(n)
function findDisappearedNumbers(nums) {
  const n = nums.length;
  // Create a set of all numbers from 1 to n
  const numSet = new Set();
  for (let i = 1; i <= n; i++) {
    numSet.add(i);
  }
  // Remove numbers we see in nums
  for (const num of nums) {
    if (numSet.has(num)) {
      numSet.delete(num);
    }
  }
  // What's left are the missing numbers
  return Array.from(numSet);
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

public List<Integer> findDisappearedNumbers(int[] nums) {
    int n = nums.length;
    // Create a set of all numbers from 1 to n
    Set<Integer> numSet = new HashSet<>();
    for (int i = 1; i <= n; i++) {
        numSet.add(i);
    }
    // Remove numbers we see in nums
    for (int num : nums) {
        if (numSet.contains(num)) {
            numSet.remove(num);
        }
    }
    // What's left are the missing numbers
    return new ArrayList<>(numSet);
}
```

</div>

This works, but we can do better with `O(1)` extra space.

## Optimal Solution

The optimal solution uses the array itself as a hash table by marking indices as visited. For each number `x`, we look at index `x-1` and mark it by making the value at that index negative. After marking all seen numbers, we scan the array and collect indices where the value is still positive—those correspond to missing numbers.

**Key insight:**  
Since all numbers are between `1` and `n`, every number maps to a valid index (`0` to `n-1`). By using the sign of the value at that index as a marker, we can track seen numbers without extra space. We must use the absolute value when looking up indices because previous steps may have made values negative.

Here’s the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output list
def findDisappearedNumbers(nums):
    # First pass: mark seen numbers by making corresponding indices negative
    for num in nums:
        # Get the absolute value because num might have been marked negative already
        index = abs(num) - 1  # Map number to zero-based index
        # If the value at this index is positive, make it negative to mark as seen
        if nums[index] > 0:
            nums[index] = -nums[index]

    # Second pass: collect indices that still have positive values
    result = []
    for i in range(len(nums)):
        # If the value is positive, the number (i+1) was never seen
        if nums[i] > 0:
            result.append(i + 1)

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output array
function findDisappearedNumbers(nums) {
  // First pass: mark seen numbers by making corresponding indices negative
  for (let i = 0; i < nums.length; i++) {
    // Get the absolute value because num might have been marked negative already
    const index = Math.abs(nums[i]) - 1; // Map number to zero-based index
    // If the value at this index is positive, make it negative to mark as seen
    if (nums[index] > 0) {
      nums[index] = -nums[index];
    }
  }

  // Second pass: collect indices that still have positive values
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    // If the value is positive, the number (i+1) was never seen
    if (nums[i] > 0) {
      result.push(i + 1);
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output list
import java.util.*;

public List<Integer> findDisappearedNumbers(int[] nums) {
    // First pass: mark seen numbers by making corresponding indices negative
    for (int i = 0; i < nums.length; i++) {
        // Get the absolute value because num might have been marked negative already
        int index = Math.abs(nums[i]) - 1;  // Map number to zero-based index
        // If the value at this index is positive, make it negative to mark as seen
        if (nums[index] > 0) {
            nums[index] = -nums[index];
        }
    }

    // Second pass: collect indices that still have positive values
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        // If the value is positive, the number (i+1) was never seen
        if (nums[i] > 0) {
            result.add(i + 1);
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n)`  
We make two passes through the array. The first pass marks seen numbers, and the second pass collects missing numbers. Each pass does `O(1)` work per element, so total time is linear.

**Space Complexity:** `O(1)` extra space (excluding the output list)  
We modify the input array in place, using the sign bits as markers. No additional data structures are used. The output list is not counted toward extra space complexity in most interview contexts because it’s required by the problem.

## Common Mistakes

1. **Forgetting to use absolute value when calculating the index:**  
   In the marking phase, if we use `nums[i] - 1` directly without `abs()`, we might get a negative index when `nums[i]` was already marked negative. Always use `abs(nums[i]) - 1` to get the correct index.

2. **Modifying the array while iterating without careful index handling:**  
   Some candidates try to swap elements or change values in ways that lose the original number information. The key is to only change the sign of values at target indices, not the values we’re currently reading.

3. **Not handling duplicates correctly:**  
   When a number appears multiple times, we might try to mark the same index multiple times. That’s fine—we just need to check if the value is already negative before marking it again to avoid flipping signs back to positive.

4. **Incorrect mapping between numbers and indices:**  
   Remember: number `x` maps to index `x-1`. A common off-by-one error is using `x` directly or `x+1`. Test with small examples to verify your mapping.

## When You’ll See This Pattern

This in-place marking technique appears in several array problems where values are bounded by the array size:

- **First Missing Positive (Hard):**  
  Similar idea but with stricter constraints—you need to find the smallest missing positive integer. The solution uses swapping to place each number at its correct index.

- **Find All Duplicates in an Array (Medium):**  
  Almost identical to this problem, but instead of finding missing numbers, you find numbers that appear twice. You use the same negative marking technique.

- **Set Matrix Zeroes (Medium):**  
  Uses the first row and column as markers to indicate which rows and columns should be zeroed, similar to using the array itself as storage for metadata.

The core pattern is: when you have an array with values in a known range `[1, n]`, you can often use the array indices as a hash table by modifying values in place.

## Key Takeaways

1. **Use the array itself as a hash table when values are bounded by the array size.**  
   If numbers are between `1` and `n`, you can map number `x` to index `x-1` and use the sign or some other property to mark visited numbers.

2. **Two-pass solutions are often optimal for in-place modifications.**  
   First pass to mark data, second pass to collect results. This keeps the logic clean and avoids overwriting information you still need.

3. **Always consider absolute values when indices might have been modified.**  
   If you’re using negative marking, remember that previously marked values will be negative, so use `abs()` when calculating indices.

Related problems: [First Missing Positive](/problem/first-missing-positive), [Find All Duplicates in an Array](/problem/find-all-duplicates-in-an-array), [Find Unique Binary String](/problem/find-unique-binary-string)
