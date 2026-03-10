---
title: "How to Solve Continuous Subarray Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Continuous Subarray Sum. Medium difficulty, 31.2% acceptance rate. Topics: Array, Hash Table, Math, Prefix Sum."
date: "2026-12-31"
category: "dsa-patterns"
tags: ["continuous-subarray-sum", "array", "hash-table", "math", "medium"]
---

# How to Solve Continuous Subarray Sum

This problem asks us to determine if there exists a subarray of length at least two whose sum is divisible by a given integer `k`. What makes this problem interesting is that we can't just check every subarray (which would be O(n²)), and the "divisible by k" condition requires a mathematical insight about prefix sums and remainders. The key challenge is recognizing that if two prefix sums have the same remainder when divided by `k`, the subarray between them has a sum divisible by `k`.

## Visual Walkthrough

Let's trace through an example: `nums = [23, 2, 4, 6, 7]`, `k = 6`

We'll compute prefix sums and their remainders modulo 6:

1. Start with prefix sum = 0, remainder = 0 % 6 = 0
   - Store remainder 0 at index -1 (conceptually, before the array starts)

2. Index 0: value = 23
   - Prefix sum = 23, remainder = 23 % 6 = 5
   - Check: Have we seen remainder 5 before? No
   - Store remainder 5 at index 0

3. Index 1: value = 2
   - Prefix sum = 25, remainder = 25 % 6 = 1
   - Check: Have we seen remainder 1 before? No
   - Store remainder 1 at index 1

4. Index 2: value = 4
   - Prefix sum = 29, remainder = 29 % 6 = 5
   - Check: Have we seen remainder 5 before? Yes, at index 0
   - The subarray from index 1 to 2 (inclusive) has sum: 2 + 4 = 6
   - Length = 2 (index 2 - index 0 = 2), which satisfies "at least two"
   - 6 is divisible by 6, so we found a valid subarray!

The insight: When two prefix sums have the same remainder modulo `k`, their difference (which is the sum of the subarray between them) is divisible by `k`. This is because:

- If prefix_sum[i] % k = r and prefix_sum[j] % k = r
- Then (prefix_sum[j] - prefix_sum[i]) % k = 0
- So the subarray from i+1 to j has sum divisible by k

## Brute Force Approach

The most straightforward approach is to check every possible subarray of length at least two:

1. For each starting index `i` from 0 to n-2
2. For each ending index `j` from i+1 to n-1
3. Compute the sum of elements from i to j
4. Check if this sum is divisible by `k`

This approach is simple to implement but has O(n²) time complexity, which is too slow for large arrays (n up to 10⁵ in typical test cases). The space complexity is O(1).

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def checkSubarraySumBruteForce(nums, k):
    n = len(nums)

    # Check every possible subarray
    for i in range(n - 1):  # Start index
        current_sum = nums[i]
        for j in range(i + 1, n):  # End index
            current_sum += nums[j]
            # Check if sum is divisible by k
            if current_sum % k == 0:
                return True
    return False
```

```javascript
// Time: O(n²) | Space: O(1)
function checkSubarraySumBruteForce(nums, k) {
  const n = nums.length;

  // Check every possible subarray
  for (let i = 0; i < n - 1; i++) {
    let currentSum = nums[i];
    for (let j = i + 1; j < n; j++) {
      currentSum += nums[j];
      // Check if sum is divisible by k
      if (currentSum % k === 0) {
        return true;
      }
    }
  }
  return false;
}
```

```java
// Time: O(n²) | Space: O(1)
public boolean checkSubarraySumBruteForce(int[] nums, int k) {
    int n = nums.length;

    // Check every possible subarray
    for (int i = 0; i < n - 1; i++) {
        int currentSum = nums[i];
        for (int j = i + 1; j < n; j++) {
            currentSum += nums[j];
            // Check if sum is divisible by k
            if (currentSum % k == 0) {
                return true;
            }
        }
    }
    return false;
}
```

</div>

## Optimized Approach

The brute force approach is inefficient because it recomputes subarray sums repeatedly. We can optimize using prefix sums:

1. Compute prefix sums as we iterate through the array
2. Instead of storing the actual prefix sums, store their remainders modulo `k`
3. Use a hash map to store the first index where each remainder appears
4. If we see the same remainder again, check if the distance between indices is at least 2

The key mathematical insight: For any two indices `i` and `j` where `i < j`:

- If `prefix_sum[j] % k == prefix_sum[i] % k`
- Then `(prefix_sum[j] - prefix_sum[i]) % k == 0`
- This means the subarray from `i+1` to `j` has sum divisible by `k`

We need to handle the special case where the remainder is 0. When we see remainder 0 at index `i`, it means the subarray from the beginning (index 0) to `i` has sum divisible by `k`. But we need to ensure the subarray length is at least 2.

## Optimal Solution

Here's the optimal solution using prefix sums with remainder tracking:

<div class="code-group">

```python
# Time: O(n) | Space: O(min(n, k))
def checkSubarraySum(nums, k):
    """
    Check if there exists a subarray of length at least 2
    whose sum is divisible by k.

    Args:
        nums: List of integers
        k: Integer divisor

    Returns:
        True if such subarray exists, False otherwise
    """
    # Map to store remainder -> first index where it appears
    remainder_map = {}

    # Initialize with remainder 0 at index -1
    # This handles the case where prefix sum itself is divisible by k
    remainder_map[0] = -1

    prefix_sum = 0

    for i in range(len(nums)):
        # Update prefix sum with current element
        prefix_sum += nums[i]

        # Calculate remainder modulo k
        # We use modulo k to handle negative numbers properly
        remainder = prefix_sum % k

        # Check if we've seen this remainder before
        if remainder in remainder_map:
            # If the distance between current index and first occurrence
            # is at least 2, we found a valid subarray
            if i - remainder_map[remainder] >= 2:
                return True
        else:
            # Store the first occurrence of this remainder
            remainder_map[remainder] = i

    # No valid subarray found
    return False
```

```javascript
// Time: O(n) | Space: O(min(n, k))
function checkSubarraySum(nums, k) {
  /**
   * Check if there exists a subarray of length at least 2
   * whose sum is divisible by k.
   *
   * @param {number[]} nums - Array of integers
   * @param {number} k - Integer divisor
   * @return {boolean} True if such subarray exists, False otherwise
   */
  // Map to store remainder -> first index where it appears
  const remainderMap = new Map();

  // Initialize with remainder 0 at index -1
  // This handles the case where prefix sum itself is divisible by k
  remainderMap.set(0, -1);

  let prefixSum = 0;

  for (let i = 0; i < nums.length; i++) {
    // Update prefix sum with current element
    prefixSum += nums[i];

    // Calculate remainder modulo k
    // JavaScript's % operator handles negative numbers differently,
    // so we adjust to always get positive remainder
    let remainder = prefixSum % k;
    if (remainder < 0) remainder += k;

    // Check if we've seen this remainder before
    if (remainderMap.has(remainder)) {
      // If the distance between current index and first occurrence
      // is at least 2, we found a valid subarray
      if (i - remainderMap.get(remainder) >= 2) {
        return true;
      }
    } else {
      // Store the first occurrence of this remainder
      remainderMap.set(remainder, i);
    }
  }

  // No valid subarray found
  return false;
}
```

```java
// Time: O(n) | Space: O(min(n, k))
public boolean checkSubarraySum(int[] nums, int k) {
    /**
     * Check if there exists a subarray of length at least 2
     * whose sum is divisible by k.
     *
     * @param nums Array of integers
     * @param k Integer divisor
     * @return True if such subarray exists, False otherwise
     */
    // Map to store remainder -> first index where it appears
    Map<Integer, Integer> remainderMap = new HashMap<>();

    // Initialize with remainder 0 at index -1
    // This handles the case where prefix sum itself is divisible by k
    remainderMap.put(0, -1);

    int prefixSum = 0;

    for (int i = 0; i < nums.length; i++) {
        // Update prefix sum with current element
        prefixSum += nums[i];

        // Calculate remainder modulo k
        // Java's % operator can return negative for negative numbers,
        // so we adjust to always get positive remainder
        int remainder = prefixSum % k;
        if (remainder < 0) remainder += k;

        // Check if we've seen this remainder before
        if (remainderMap.containsKey(remainder)) {
            // If the distance between current index and first occurrence
            // is at least 2, we found a valid subarray
            if (i - remainderMap.get(remainder) >= 2) {
                return true;
            }
        } else {
            // Store the first occurrence of this remainder
            remainderMap.put(remainder, i);
        }
    }

    // No valid subarray found
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the array once, performing O(1) operations at each step
- Hash map operations (insert and lookup) are O(1) on average

**Space Complexity: O(min(n, k))**

- In the worst case, we store up to n different remainders
- However, since remainders are modulo k, there can be at most k distinct remainders (0 to k-1)
- So the space complexity is O(min(n, k))

## Common Mistakes

1. **Not handling the remainder 0 case properly**: When the prefix sum itself is divisible by k, we need to check if the subarray from the beginning has length at least 2. The trick is to initialize the hash map with `{0: -1}` to represent the prefix sum before the array starts.

2. **Forgetting to check subarray length**: Even if two prefix sums have the same remainder, the subarray between them must have length at least 2. Always check `i - first_occurrence_index >= 2`.

3. **Incorrect handling of negative numbers**: In some languages (like Java and JavaScript), the modulo operator can return negative results for negative inputs. You need to adjust to get a positive remainder: `(remainder % k + k) % k` or equivalent.

4. **Using an array instead of hash map for remainders**: Some candidates try to use an array of size k to store remainders. This works when k is small, but if k is very large (up to 2³¹ - 1), this would use too much memory. A hash map is more space-efficient.

## When You'll See This Pattern

This "prefix sum with remainder/modulo" pattern appears in several other problems:

1. **Subarray Sum Equals K (LeetCode 560)**: Instead of checking for remainders, you check if `prefix_sum[j] - prefix_sum[i] == k`. The core technique of using a hash map to store prefix sums is the same.

2. **Make Sum Divisible by P (LeetCode 1590)**: Find the smallest subarray to remove to make the sum divisible by p. This uses the same remainder tracking technique.

3. **Count Number of Nice Subarrays (LeetCode 1248)**: Count subarrays with exactly k odd numbers. While not exactly the same, it uses the prefix sum technique with a different condition.

The pattern to recognize: When you need to find subarrays satisfying a condition on their sum (especially divisible by something, equal to something, or within a range), think about using prefix sums with a hash map to store previously seen values.

## Key Takeaways

1. **Prefix sums transform subarray problems into difference problems**: Instead of thinking about subarray sums, think about differences between prefix sums. This reduces O(n²) problems to O(n).

2. **Modulo arithmetic simplifies divisibility checks**: If `(a - b) % k == 0`, then `a % k == b % k`. This lets us track remainders instead of actual sums.

3. **Hash maps store "seen before" information efficiently**: By storing the first index where each remainder appears, we can quickly check if we've seen a remainder before and compute the subarray length.

Remember: When you encounter a problem asking about subarray sums with divisibility conditions, immediately think about prefix sums and remainder tracking with a hash map.

Related problems: [Subarray Sum Equals K](/problem/subarray-sum-equals-k), [Minimum Number of Operations to Make Array Continuous](/problem/minimum-number-of-operations-to-make-array-continuous), [Intervals Between Identical Elements](/problem/intervals-between-identical-elements)
