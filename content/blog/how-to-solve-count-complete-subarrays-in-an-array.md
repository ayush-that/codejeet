---
title: "How to Solve Count Complete Subarrays in an Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Complete Subarrays in an Array. Medium difficulty, 75.9% acceptance rate. Topics: Array, Hash Table, Sliding Window."
date: "2026-05-25"
category: "dsa-patterns"
tags: ["count-complete-subarrays-in-an-array", "array", "hash-table", "sliding-window", "medium"]
---

# How to Solve Count Complete Subarrays in an Array

This problem asks us to count all subarrays where the number of distinct elements equals the total distinct elements in the entire array. What makes this interesting is that we need to count **all** qualifying subarrays, not just find the longest or shortest one. The challenge is doing this efficiently without checking every possible subarray individually.

## Visual Walkthrough

Let's trace through `nums = [1, 3, 1, 2, 2]` step by step:

1. **First, find total distinct elements:** The array has elements 1, 3, and 2 → 3 distinct elements total.
2. **We need to count subarrays with exactly 3 distinct elements:**
   - Subarray `[1, 3, 1, 2]` → distinct: {1, 3, 2} = 3 ✓
   - Subarray `[1, 3, 1, 2, 2]` → distinct: {1, 3, 2} = 3 ✓
   - Subarray `[3, 1, 2]` → distinct: {3, 1, 2} = 3 ✓
   - Subarray `[3, 1, 2, 2]` → distinct: {3, 1, 2} = 3 ✓
   - Subarray `[1, 2, 2]` → distinct: {1, 2} = 2 ✗ (only 2 distinct)
   - And so on...

The key insight: Once a subarray contains all distinct elements, **any extension of that subarray to the right will also contain all distinct elements**. So if `[1, 3, 1, 2]` works, then `[1, 3, 1, 2, 2]` also works.

Let's think about counting systematically:

- Start with left pointer at index 0
- Move right pointer to expand window
- When window has all 3 distinct elements, we know ALL subarrays starting at left and ending anywhere from right to the end will work
- Then move left pointer to shrink window until it no longer has all distinct elements
- Repeat

For our example:

- With left=0, when right=3, window `[1, 3, 1, 2]` has all 3 distinct → all subarrays from left=0, right=3,4 work → that's 2 subarrays
- Move left to 1, window `[3, 1, 2]` still has all 3 distinct → all subarrays from left=1, right=3,4 work → 2 more subarrays
- Move left to 2, window `[1, 2]` only has 2 distinct → stop shrinking left
- Continue...

This sliding window approach lets us count efficiently!

## Brute Force Approach

The brute force solution checks every possible subarray:

1. Count total distinct elements in the array (let's call it `k`)
2. For each starting index `i` from 0 to n-1:
   - For each ending index `j` from i to n-1:
     - Extract subarray `nums[i:j+1]`
     - Count distinct elements in this subarray
     - If count equals `k`, increment result

This approach is straightforward but inefficient. For an array of length `n`, there are O(n²) subarrays. For each subarray, counting distinct elements takes O(subarray length) time, leading to O(n³) worst-case time complexity. Even with optimization (like using a hash set for each subarray), it's still O(n²), which is too slow for n up to 1000.

<div class="code-group">

```python
# Brute Force Solution - Too Slow for Large Inputs
# Time: O(n^3) | Space: O(n)
def countCompleteSubarrays_brute(nums):
    total_distinct = len(set(nums))
    n = len(nums)
    count = 0

    for i in range(n):
        for j in range(i, n):
            # Count distinct in nums[i:j+1]
            subarray_distinct = len(set(nums[i:j+1]))
            if subarray_distinct == total_distinct:
                count += 1

    return count
```

```javascript
// Brute Force Solution - Too Slow for Large Inputs
// Time: O(n^3) | Space: O(n)
function countCompleteSubarraysBrute(nums) {
  const totalDistinct = new Set(nums).size;
  const n = nums.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Count distinct in nums[i..j]
      const subarrayDistinct = new Set(nums.slice(i, j + 1)).size;
      if (subarrayDistinct === totalDistinct) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Brute Force Solution - Too Slow for Large Inputs
// Time: O(n^3) | Space: O(n)
public int countCompleteSubarraysBrute(int[] nums) {
    Set<Integer> totalSet = new HashSet<>();
    for (int num : nums) {
        totalSet.add(num);
    }
    int totalDistinct = totalSet.size();
    int n = nums.length;
    int count = 0;

    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Count distinct in nums[i..j]
            Set<Integer> subarraySet = new HashSet<>();
            for (int k = i; k <= j; k++) {
                subarraySet.add(nums[k]);
            }
            if (subarraySet.size() == totalDistinct) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that we can use a **sliding window** approach with a hash map to track counts of elements in our current window. Here's the step-by-step reasoning:

1. **First, count total distinct elements** in the array using a set.
2. **Use two pointers (left and right)** to represent the current window.
3. **Expand the right pointer** to include more elements, updating counts in our hash map.
4. **When the window contains all distinct elements**, we've found a "complete" subarray starting at `left`.
   - Crucially: If `nums[left:right+1]` is complete, then ALL subarrays starting at `left` and ending anywhere from `right` to the end of array are also complete!
   - So we can add `(n - right)` to our count immediately.
5. **Now shrink from the left** by moving `left` forward until the window no longer contains all distinct elements.
6. **Repeat** until we've processed all starting positions.

Why does this work? For each starting position `left`, we find the **smallest** ending position `right` where the subarray becomes complete. Once we find this, we know all longer subarrays starting at the same `left` will also be complete.

This is essentially counting subarrays with **at least** K distinct elements (where K = total distinct), which is easier than counting subarrays with **exactly** K distinct elements.

## Optimal Solution

Here's the efficient sliding window solution:

<div class="code-group">

```python
# Optimal Solution using Sliding Window
# Time: O(n) | Space: O(n)
def countCompleteSubarrays(nums):
    # Step 1: Count total distinct elements in the array
    total_distinct = len(set(nums))
    n = len(nums)

    # Step 2: Initialize variables for sliding window
    left = 0
    count = 0
    window_counts = {}  # Hash map to track counts of elements in current window

    # Step 3: Expand window with right pointer
    for right in range(n):
        # Add current element to window
        window_counts[nums[right]] = window_counts.get(nums[right], 0) + 1

        # Step 4: While window has all distinct elements, count subarrays and shrink
        while len(window_counts) == total_distinct:
            # All subarrays starting at left and ending at right or beyond are complete
            count += n - right

            # Remove leftmost element from window
            window_counts[nums[left]] -= 1
            if window_counts[nums[left]] == 0:
                del window_counts[nums[left]]

            # Move left pointer to shrink window
            left += 1

    return count
```

```javascript
// Optimal Solution using Sliding Window
// Time: O(n) | Space: O(n)
function countCompleteSubarrays(nums) {
  // Step 1: Count total distinct elements in the array
  const totalDistinct = new Set(nums).size;
  const n = nums.length;

  // Step 2: Initialize variables for sliding window
  let left = 0;
  let count = 0;
  const windowCounts = new Map(); // Map to track counts of elements in current window

  // Step 3: Expand window with right pointer
  for (let right = 0; right < n; right++) {
    // Add current element to window
    windowCounts.set(nums[right], (windowCounts.get(nums[right]) || 0) + 1);

    // Step 4: While window has all distinct elements, count subarrays and shrink
    while (windowCounts.size === totalDistinct) {
      // All subarrays starting at left and ending at right or beyond are complete
      count += n - right;

      // Remove leftmost element from window
      windowCounts.set(nums[left], windowCounts.get(nums[left]) - 1);
      if (windowCounts.get(nums[left]) === 0) {
        windowCounts.delete(nums[left]);
      }

      // Move left pointer to shrink window
      left++;
    }
  }

  return count;
}
```

```java
// Optimal Solution using Sliding Window
// Time: O(n) | Space: O(n)
public int countCompleteSubarrays(int[] nums) {
    // Step 1: Count total distinct elements in the array
    Set<Integer> totalSet = new HashSet<>();
    for (int num : nums) {
        totalSet.add(num);
    }
    int totalDistinct = totalSet.size();
    int n = nums.length;

    // Step 2: Initialize variables for sliding window
    int left = 0;
    int count = 0;
    Map<Integer, Integer> windowCounts = new HashMap<>();  // Map to track counts in current window

    // Step 3: Expand window with right pointer
    for (int right = 0; right < n; right++) {
        // Add current element to window
        windowCounts.put(nums[right], windowCounts.getOrDefault(nums[right], 0) + 1);

        // Step 4: While window has all distinct elements, count subarrays and shrink
        while (windowCounts.size() == totalDistinct) {
            // All subarrays starting at left and ending at right or beyond are complete
            count += n - right;

            // Remove leftmost element from window
            windowCounts.put(nums[left], windowCounts.get(nums[left]) - 1);
            if (windowCounts.get(nums[left]) == 0) {
                windowCounts.remove(nums[left]);
            }

            // Move left pointer to shrink window
            left++;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We pass through the array once with the right pointer (O(n))
- The left pointer also moves from 0 to n at most (O(n))
- Each element is added to and removed from the hash map at most once
- Hash map operations (get, put, delete) are O(1) on average

**Space Complexity: O(n)**

- We store counts of elements in the hash map
- In the worst case, all elements are distinct, so we store n entries
- The set for counting total distinct also uses O(n) space

## Common Mistakes

1. **Counting subarrays with exactly K distinct instead of at least K**: Some candidates try to count subarrays with exactly `total_distinct` elements, which requires a more complex solution. The key insight is that we need "at least" not "exactly" - if a subarray has all distinct elements, adding more elements won't remove any.

2. **Forgetting to handle element counts properly when shrinking**: When removing elements from the window, you must decrement the count and remove the key when count reaches 0. Forgetting to remove keys with zero count will keep `window_counts.size()` incorrect.

3. **Off-by-one errors in counting**: When the window has all distinct elements at position `right`, the number of complete subarrays starting at `left` is `n - right` (not `n - right + 1` or `n - right - 1`). Think: if `right` is the last index where the window first becomes complete, then subarrays ending at `right, right+1, ..., n-1` all work.

4. **Using array instead of hash map for counts**: Since elements can be any positive integer (not necessarily small), we need a hash map, not a fixed-size array. An array would either waste space or fail if elements are large.

## When You'll See This Pattern

This sliding window pattern appears in many substring/subarray problems:

1. **Longest Substring Without Repeating Characters (LeetCode 3)**: Find the longest substring with all unique characters. Similar sliding window with hash map to track last seen positions.

2. **Subarrays with K Different Integers (LeetCode 992)**: Count subarrays with exactly K distinct integers. This is a harder version - you need to count "at most K" minus "at most K-1".

3. **Minimum Window Substring (LeetCode 76)**: Find the minimum window in string S containing all characters of string T. Similar concept of expanding right until condition met, then shrinking left.

The pattern: When you need to find/count subarrays/substrings satisfying some condition related to element frequencies, think sliding window with hash map.

## Key Takeaways

1. **"At least K" is easier than "exactly K"**: For counting subarrays with a property about distinct elements, counting "at least K" can often be done with a simple sliding window, while "exactly K" requires a more complex approach.

2. **Once condition is met, all extensions work**: The key insight for this problem is that if a subarray contains all distinct elements, any extension (adding more elements to the right) will also contain all distinct elements. This lets us count efficiently.

3. **Sliding window with two pointers and frequency map**: This is a powerful pattern for substring/subarray problems where you need to track element frequencies. The window expands to include more elements until a condition is met, then shrinks from the left until the condition is no longer met.

Related problems: [Longest Substring Without Repeating Characters](/problem/longest-substring-without-repeating-characters), [Subarrays with K Different Integers](/problem/subarrays-with-k-different-integers)
