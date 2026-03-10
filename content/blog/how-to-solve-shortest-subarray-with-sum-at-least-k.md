---
title: "How to Solve Shortest Subarray with Sum at Least K — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Shortest Subarray with Sum at Least K. Hard difficulty, 32.6% acceptance rate. Topics: Array, Binary Search, Queue, Sliding Window, Heap (Priority Queue)."
date: "2028-09-08"
category: "dsa-patterns"
tags: ["shortest-subarray-with-sum-at-least-k", "array", "binary-search", "queue", "hard"]
---

# How to Solve Shortest Subarray with Sum at Least K

This problem asks us to find the shortest contiguous subarray whose sum is at least `k`. While it sounds similar to classic sliding window problems, there's a crucial twist: the array can contain **negative numbers**. This breaks the standard sliding window approach because shrinking the window when we find a valid subarray might actually increase the sum (if we remove negative numbers), making it impossible to guarantee we've found the shortest valid window. This negative number complication is what makes this problem "Hard" and requires a more sophisticated approach.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [2, -1, 2, 3], k = 3`

**Step 1: Calculate prefix sums**
First, we compute prefix sums: `prefix[i] = sum(nums[0..i-1])`

- `prefix[0] = 0` (sum of empty subarray)
- `prefix[1] = 2` (sum of first element)
- `prefix[2] = 1` (2 + (-1))
- `prefix[3] = 3` (2 + (-1) + 2)
- `prefix[4] = 6` (2 + (-1) + 2 + 3)

**Step 2: The key insight**
For any subarray `nums[i..j]`, its sum = `prefix[j+1] - prefix[i]`. We want this ≥ k, so:
`prefix[j+1] - prefix[i] ≥ k` → `prefix[j+1] - k ≥ prefix[i]`

This means: for each position `j`, we need to find the **largest index i ≤ j** such that `prefix[i] ≤ prefix[j+1] - k`. The subarray length would be `j - i + 1`.

**Step 3: Why we need a monotonic deque**
With positive numbers only, we could use a sliding window. But with negatives, prefix sums aren't monotonic. Look at our prefix array: `[0, 2, 1, 3, 6]`. Notice `prefix[2] = 1` is actually **smaller** than `prefix[1] = 2`. This means any future `j` that could pair with `prefix[1]` could also pair with `prefix[2]` (since it's smaller), and `prefix[2]` gives us a **longer** subarray (since i=2 is closer to j). So we should keep prefix sums in increasing order.

**Step 4: Processing with a deque**
We'll maintain a deque of indices where prefix sums are increasing:

1. `j=0`: prefix[1]=2, deque=[0] (prefix[0]=0)
   Check: prefix[1]-k=2-3=-1. Find largest i where prefix[i] ≤ -1 → i=0
   Length = 0-0+1=1 (sum=2, not ≥3, so skip)
2. `j=1`: prefix[2]=1
   Before adding index 2, remove indices from back where prefix[i] ≥ current prefix (1)
   Remove index 1 (prefix[1]=2 ≥ 1) → deque=[0]
   Add index 2 → deque=[0,2]
   Check: prefix[2]-k=1-3=-2. Find i=0 → length=1-0+1=2 (sum=1, not ≥3)
3. `j=2`: prefix[3]=3
   Remove from back: prefix[2]=1 ≤ 3, keep it
   Add index 3 → deque=[0,2,3]
   Check: prefix[3]-k=3-3=0. Find largest i where prefix[i] ≤ 0 → i=0
   Length=2-0+1=3 (sum=3 ≥3 ✓) → min_len=3
4. `j=3`: prefix[4]=6
   Remove from back: prefix[3]=3 ≤ 6, keep it
   Add index 4 → deque=[0,2,3,4]
   Check: prefix[4]-k=6-3=3
   Find largest i where prefix[i] ≤ 3:
   - i=0 (prefix=0 ≤3) → length=3-0+1=4
   - i=2 (prefix=1 ≤3) → length=3-2+1=2 (better!)
   - i=3 (prefix=3 ≤3) → length=3-3+1=1 (best!)
     min_len=1 (subarray [3] with sum=3)

The shortest subarray is `[3]` with length 1.

## Brute Force Approach

The brute force solution checks every possible subarray:

```python
def shortestSubarray(nums, k):
    n = len(nums)
    min_len = float('inf')

    for i in range(n):
        current_sum = 0
        for j in range(i, n):
            current_sum += nums[j]
            if current_sum >= k:
                min_len = min(min_len, j - i + 1)
                break  # Can't get shorter by extending

    return min_len if min_len != float('inf') else -1
```

**Why it's too slow:**

- Time complexity: O(n²) — for each starting index i, we potentially scan to the end
- Space complexity: O(1)
- With n up to 10⁵ (typical LeetCode constraints), O(n²) is far too slow (~10¹⁰ operations)

The brute force also misses an optimization opportunity: with negative numbers, even if we find a valid subarray starting at i, a later starting point might yield a shorter valid subarray, so we can't just break early.

## Optimized Approach

The optimal solution uses a **monotonic deque** to track potential starting indices. Here's the step-by-step reasoning:

1. **Prefix sums transform the problem**: Instead of tracking subarray sums directly, we work with prefix sums. The sum of `nums[i..j]` = `prefix[j+1] - prefix[i]`.

2. **The inequality we need**: We want `prefix[j+1] - prefix[i] ≥ k`, which rearranges to `prefix[i] ≤ prefix[j+1] - k`.

3. **Key observation 1**: For a given ending position `j`, we want the **largest possible i** (closest to j) that satisfies `prefix[i] ≤ prefix[j+1] - k`. This gives us the shortest subarray ending at j.

4. **Key observation 2**: We can maintain prefix sums in increasing order using a deque:
   - Before adding a new index to the deque, remove indices from the back where their prefix sum ≥ current prefix sum. Why? If we have two indices `x < y` with `prefix[x] ≥ prefix[y]`, then for any future `j`, if `prefix[x]` satisfies the inequality, `prefix[y]` will also satisfy it (since it's smaller), and `y` gives a shorter subarray (since it's closer to j).
   - This keeps the deque strictly increasing.

5. **Key observation 3**: We can also remove indices from the front once we've processed them. When we find a valid subarray starting at deque[0], we record its length and pop it from the front. We can continue checking the next indices in the deque since they might give even shorter subarrays (with larger starting indices).

6. **The algorithm**:
   - Compute prefix sums array
   - Initialize deque and min_len
   - Iterate through the array:
     1. While deque is not empty and prefix[deque.back] ≥ prefix[current], pop from back
     2. Add current index to deque
     3. While deque is not empty and prefix[current] - prefix[deque.front] ≥ k:
        - Update min_len with current - deque.front
        - Pop from front (this index won't give better results for future j)

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def shortestSubarray(nums, k):
    """
    Find shortest subarray with sum at least k.

    Args:
        nums: List of integers (can be negative)
        k: Target sum threshold

    Returns:
        Length of shortest subarray with sum >= k, or -1 if none exists
    """
    n = len(nums)

    # Step 1: Compute prefix sums
    # prefix[i] = sum(nums[0..i-1]), so prefix[0] = 0
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]

    # Step 2: Initialize deque to store indices of prefix array
    # We'll maintain indices in deque such that prefix[deque[i]] is increasing
    from collections import deque
    dq = deque()
    min_len = float('inf')

    # Step 3: Iterate through prefix array
    for i in range(n + 1):
        # Step 3a: Maintain monotonic increasing property
        # Remove indices from back where prefix value is >= current prefix
        # This ensures deque stores indices with strictly increasing prefix values
        while dq and prefix[dq[-1]] >= prefix[i]:
            dq.pop()

        # Step 3b: Add current index to deque
        dq.append(i)

        # Step 3c: Check for valid subarrays ending at i-1
        # While the difference between current prefix and front prefix >= k,
        # we found a valid subarray
        while dq and prefix[i] - prefix[dq[0]] >= k:
            # Update minimum length
            # The subarray is from dq[0] to i-1 (in original array indices)
            min_len = min(min_len, i - dq[0])
            # Remove from front since we won't get shorter subarray
            # with this starting point for future i
            dq.popleft()

    # Step 4: Return result
    return min_len if min_len != float('inf') else -1
```

```javascript
// Time: O(n) | Space: O(n)
function shortestSubarray(nums, k) {
  /**
   * Find shortest subarray with sum at least k.
   *
   * @param {number[]} nums - Array of integers (can be negative)
   * @param {number} k - Target sum threshold
   * @return {number} - Length of shortest subarray with sum >= k, or -1
   */
  const n = nums.length;

  // Step 1: Compute prefix sums
  // prefix[i] = sum(nums[0..i-1]), so prefix[0] = 0
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }

  // Step 2: Initialize deque (using array as deque)
  const dq = [];
  let minLen = Infinity;

  // Step 3: Iterate through prefix array
  for (let i = 0; i <= n; i++) {
    // Step 3a: Maintain monotonic increasing property
    // Remove indices from back where prefix value >= current prefix
    while (dq.length > 0 && prefix[dq[dq.length - 1]] >= prefix[i]) {
      dq.pop();
    }

    // Step 3b: Add current index to deque
    dq.push(i);

    // Step 3c: Check for valid subarrays ending at i-1
    // While difference between current and front prefix >= k
    while (dq.length > 0 && prefix[i] - prefix[dq[0]] >= k) {
      // Update minimum length
      // Subarray from dq[0] to i-1 in original array
      minLen = Math.min(minLen, i - dq[0]);
      // Remove from front - won't get shorter with this start
      dq.shift();
    }
  }

  // Step 4: Return result
  return minLen !== Infinity ? minLen : -1;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int shortestSubarray(int[] nums, int k) {
        /**
         * Find shortest subarray with sum at least k.
         *
         * @param nums - Array of integers (can be negative)
         * @param k - Target sum threshold
         * @return Length of shortest subarray with sum >= k, or -1
         */
        int n = nums.length;

        // Step 1: Compute prefix sums
        // prefix[i] = sum(nums[0..i-1]), so prefix[0] = 0
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }

        // Step 2: Initialize deque to store indices
        Deque<Integer> dq = new ArrayDeque<>();
        int minLen = Integer.MAX_VALUE;

        // Step 3: Iterate through prefix array
        for (int i = 0; i <= n; i++) {
            // Step 3a: Maintain monotonic increasing property
            // Remove indices from back where prefix value >= current prefix
            while (!dq.isEmpty() && prefix[dq.peekLast()] >= prefix[i]) {
                dq.pollLast();
            }

            // Step 3b: Add current index to deque
            dq.offerLast(i);

            // Step 3c: Check for valid subarrays ending at i-1
            // While difference between current and front prefix >= k
            while (!dq.isEmpty() && prefix[i] - prefix[dq.peekFirst()] >= k) {
                // Update minimum length
                // Subarray from dq[0] to i-1 in original array
                minLen = Math.min(minLen, i - dq.peekFirst());
                // Remove from front - won't get shorter with this start
                dq.pollFirst();
            }
        }

        // Step 4: Return result
        return minLen == Integer.MAX_VALUE ? -1 : minLen;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Computing prefix sums: O(n)
- Each index is added to the deque exactly once: O(n)
- Each index is removed from the deque at most once: O(n)
- Total: O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- Prefix array: O(n)
- Deque: O(n) in worst case (when array is strictly increasing)
- Total: O(n)

The linear time complexity comes from the fact that each element enters and exits the deque at most once. The monotonic property ensures we don't need to scan through all previous indices for each new position.

## Common Mistakes

1. **Using standard sliding window**: The most common mistake is trying to apply the standard "sum >= k" sliding window template that works for positive numbers only. With negatives, shrinking the window can increase the sum, so you can't guarantee you've found the shortest valid window. Always check if the problem allows negative numbers before using sliding window.

2. **Forgetting the prefix[0] = 0**: The prefix array needs an extra element at the beginning representing the empty subarray sum (0). This handles subarrays starting at index 0. Without it, you'll miss valid subarrays that include the first element.

3. **Using wrong data types for large sums**: In Java, use `long` for prefix sums, not `int`. The constraints allow nums[i] up to 10⁵ and n up to 10⁵, so the maximum prefix sum is 10¹⁰, which exceeds 32-bit integer range.

4. **Not maintaining strict monotonicity**: When removing from the back of the deque, you must remove indices where `prefix[back] >= prefix[current]`, not just `>`. If you keep equal values, you might miss opportunities to get shorter subarrays with later starting indices.

## When You'll See This Pattern

This "monotonic deque with prefix sums" pattern appears in problems where you need to find optimal subarrays with constraints, especially when:

- The array contains negative numbers
- You need to maintain some monotonic property while scanning
- The constraint involves comparing prefix sums

**Related problems:**

1. **Maximum Subarray Sum (Kadane's Algorithm)**: While Kadane's algorithm solves a simpler version (just finding maximum sum), it shares the prefix sum intuition. The deque approach here is like a generalized version that handles lower bounds.

2. **Sliding Window Maximum**: Uses a monotonic deque to track maximum values in a sliding window. The deque maintenance logic is similar—removing elements that won't be useful for future windows.

3. **Contiguous Array**: Finds the longest subarray with equal number of 0s and 1s. It uses a hash map with prefix sums (treating 0 as -1), showing how prefix sums can transform counting problems.

## Key Takeaways

1. **Prefix sums transform subarray problems**: When you need to work with subarray sums, prefix sums let you compute any subarray sum in O(1) time as the difference of two prefix sums.

2. **Monotonic deques optimize search**: When you need to find the "best" previous element (largest index with prefix ≤ some value), a monotonic deque lets you do this in amortized O(1) time instead of O(n).

3. **Negative numbers break standard sliding window**: Always check if array elements can be negative. If they can, you'll likely need prefix sums + deque/heap/binary search instead of simple two-pointer sliding window.

Related problems: [Shortest Subarray With OR at Least K II](/problem/shortest-subarray-with-or-at-least-k-ii), [Shortest Subarray With OR at Least K I](/problem/shortest-subarray-with-or-at-least-k-i)
