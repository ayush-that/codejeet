---
title: "How to Solve Number of Sub-arrays With Odd Sum — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Sub-arrays With Odd Sum. Medium difficulty, 55.8% acceptance rate. Topics: Array, Math, Dynamic Programming, Prefix Sum."
date: "2026-05-05"
category: "dsa-patterns"
tags: ["number-of-sub-arrays-with-odd-sum", "array", "math", "dynamic-programming", "medium"]
---

# How to Solve Number of Sub-arrays With Odd Sum

This problem asks us to count all contiguous subarrays of a given integer array whose sum is odd. The challenge comes from the fact that a brute force approach checking every possible subarray would be O(n²), which is too slow for large arrays (n up to 10⁵). The key insight is that we don't need to compute every subarray sum—we can use prefix sums and parity tracking to solve this in linear time.

## Visual Walkthrough

Let's trace through a small example: `arr = [1, 2, 3]`

We want to count subarrays with odd sums:

- `[1]` → sum = 1 (odd) ✓
- `[1, 2]` → sum = 3 (odd) ✓
- `[1, 2, 3]` → sum = 6 (even) ✗
- `[2]` → sum = 2 (even) ✗
- `[2, 3]` → sum = 5 (odd) ✓
- `[3]` → sum = 3 (odd) ✓

Total: 4 odd-sum subarrays.

Now let's build intuition with prefix sums. The prefix sums are cumulative sums from the start:

- Prefix[0] = 0 (empty prefix)
- Prefix[1] = 1
- Prefix[2] = 1 + 2 = 3
- Prefix[3] = 1 + 2 + 3 = 6

A subarray sum from index i to j (inclusive) is `Prefix[j+1] - Prefix[i]`. This sum is odd if and only if `Prefix[j+1]` and `Prefix[i]` have **different parity** (one odd, one even).

So we can track how many even and odd prefix sums we've seen so far. For each new prefix sum:

- If it's odd, it can form odd-sum subarrays with all previous even prefix sums
- If it's even, it can form odd-sum subarrays with all previous odd prefix sums

Let's track this step by step:

1. Start with `even_count = 1` (prefix sum 0), `odd_count = 0`, `result = 0`
2. Process arr[0] = 1 → prefix sum = 1 (odd)
   - Current odd prefix can pair with previous even prefixes: `result += even_count = 1`
   - Update: `odd_count = 1`
3. Process arr[1] = 2 → prefix sum = 3 (odd)
   - Current odd prefix can pair with previous even prefixes: `result += even_count = 1` (total = 2)
   - Update: `odd_count = 2`
4. Process arr[2] = 3 → prefix sum = 6 (even)
   - Current even prefix can pair with previous odd prefixes: `result += odd_count = 2` (total = 4)
   - Update: `even_count = 2`

Final result: 4, which matches our manual count.

## Brute Force Approach

The most straightforward solution is to check every possible subarray:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def numOfSubarrays(arr):
    n = len(arr)
    count = 0
    MOD = 10**9 + 7

    # Check all possible subarrays
    for i in range(n):
        for j in range(i, n):
            # Compute sum of subarray arr[i..j]
            subarray_sum = 0
            for k in range(i, j + 1):
                subarray_sum += arr[k]

            # Check if sum is odd
            if subarray_sum % 2 == 1:
                count = (count + 1) % MOD

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function numOfSubarrays(arr) {
  const n = arr.length;
  let count = 0;
  const MOD = 10 ** 9 + 7;

  // Check all possible subarrays
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      // Compute sum of subarray arr[i..j]
      let subarraySum = 0;
      for (let k = i; k <= j; k++) {
        subarraySum += arr[k];
      }

      // Check if sum is odd
      if (subarraySum % 2 === 1) {
        count = (count + 1) % MOD;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int numOfSubarrays(int[] arr) {
    int n = arr.length;
    int count = 0;
    final int MOD = 1_000_000_007;

    // Check all possible subarrays
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            // Compute sum of subarray arr[i..j]
            int subarraySum = 0;
            for (int k = i; k <= j; k++) {
                subarraySum += arr[k];
            }

            // Check if sum is odd
            if (subarraySum % 2 == 1) {
                count = (count + 1) % MOD;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With n up to 10⁵, O(n³) is far too slow. Even an O(n²) approach (which we could achieve by precomputing prefix sums) would be 10¹⁰ operations, which is still too slow. We need a linear solution.

## Optimized Approach

The key insight is that we don't need to compute every subarray sum. Instead, we can use these mathematical properties:

1. **Parity property**: A sum is odd if and only if it has an odd number of odd elements.
2. **Prefix sum relationship**: For a subarray from i to j, sum = prefix[j+1] - prefix[i]
3. **Difference parity**: (prefix[j+1] - prefix[i]) is odd if and only if prefix[j+1] and prefix[i] have different parity

This leads to our algorithm:

- Maintain running prefix sum
- Track counts of even and odd prefix sums seen so far
- For each new prefix sum:
  - If it's odd, it can form odd-sum subarrays with all previous even prefix sums
  - If it's even, it can form odd-sum subarrays with all previous odd prefix sums
- Update the counts accordingly

We start with `even_count = 1` because prefix sum 0 (empty array) is even and should be counted.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numOfSubarrays(arr):
    """
    Counts the number of subarrays with odd sum.

    The key insight: A subarray sum arr[i..j] = prefix[j+1] - prefix[i]
    This sum is odd if and only if prefix[j+1] and prefix[i] have different parity.

    We maintain counts of even and odd prefix sums seen so far.
    For each new prefix sum:
    - If odd: it can form odd-sum subarrays with all previous even prefix sums
    - If even: it can form odd-sum subarrays with all previous odd prefix sums
    """
    MOD = 10**9 + 7

    # Initialize counts: we start with prefix sum 0 (even)
    even_count = 1  # prefix sum 0 is even
    odd_count = 0
    result = 0

    # Running prefix sum
    prefix_sum = 0

    for num in arr:
        # Update prefix sum with current element
        prefix_sum += num

        # Check parity of current prefix sum
        if prefix_sum % 2 == 1:
            # Current prefix sum is odd
            # It can form odd-sum subarrays with all previous even prefix sums
            result = (result + even_count) % MOD
            # Update odd count for future iterations
            odd_count += 1
        else:
            # Current prefix sum is even
            # It can form odd-sum subarrays with all previous odd prefix sums
            result = (result + odd_count) % MOD
            # Update even count for future iterations
            even_count += 1

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function numOfSubarrays(arr) {
  /**
   * Counts the number of subarrays with odd sum.
   *
   * The key insight: A subarray sum arr[i..j] = prefix[j+1] - prefix[i]
   * This sum is odd if and only if prefix[j+1] and prefix[i] have different parity.
   *
   * We maintain counts of even and odd prefix sums seen so far.
   * For each new prefix sum:
   * - If odd: it can form odd-sum subarrays with all previous even prefix sums
   * - If even: it can form odd-sum subarrays with all previous odd prefix sums
   */
  const MOD = 10 ** 9 + 7;

  // Initialize counts: we start with prefix sum 0 (even)
  let evenCount = 1; // prefix sum 0 is even
  let oddCount = 0;
  let result = 0;

  // Running prefix sum
  let prefixSum = 0;

  for (const num of arr) {
    // Update prefix sum with current element
    prefixSum += num;

    // Check parity of current prefix sum
    if (prefixSum % 2 === 1) {
      // Current prefix sum is odd
      // It can form odd-sum subarrays with all previous even prefix sums
      result = (result + evenCount) % MOD;
      // Update odd count for future iterations
      oddCount++;
    } else {
      // Current prefix sum is even
      // It can form odd-sum subarrays with all previous odd prefix sums
      result = (result + oddCount) % MOD;
      // Update even count for future iterations
      evenCount++;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
public int numOfSubarrays(int[] arr) {
    /**
     * Counts the number of subarrays with odd sum.
     *
     * The key insight: A subarray sum arr[i..j] = prefix[j+1] - prefix[i]
     * This sum is odd if and only if prefix[j+1] and prefix[i] have different parity.
     *
     * We maintain counts of even and odd prefix sums seen so far.
     * For each new prefix sum:
     * - If odd: it can form odd-sum subarrays with all previous even prefix sums
     * - If even: it can form odd-sum subarrays with all previous odd prefix sums
     */
    final int MOD = 1_000_000_007;

    // Initialize counts: we start with prefix sum 0 (even)
    int evenCount = 1;  // prefix sum 0 is even
    int oddCount = 0;
    int result = 0;

    // Running prefix sum
    int prefixSum = 0;

    for (int num : arr) {
        // Update prefix sum with current element
        prefixSum += num;

        // Check parity of current prefix sum
        if (prefixSum % 2 == 1) {
            // Current prefix sum is odd
            // It can form odd-sum subarrays with all previous even prefix sums
            result = (result + evenCount) % MOD;
            // Update odd count for future iterations
            oddCount++;
        } else {
            // Current prefix sum is even
            // It can form odd-sum subarrays with all previous odd prefix sums
            result = (result + oddCount) % MOD;
            // Update even count for future iterations
            evenCount++;
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, processing each element exactly once
- Each iteration performs constant-time operations (addition, modulo, parity check)

**Space Complexity: O(1)**

- We only use a fixed number of integer variables (even_count, odd_count, result, prefix_sum)
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting to initialize even_count = 1**: Many candidates start with even_count = 0, forgetting that prefix sum 0 (empty array) is even and should be counted. This leads to undercounting by exactly the number of odd prefix sums.

2. **Not using modulo properly**: The problem states the answer can be large and should be returned modulo 10⁹+7. Candidates often:
   - Forget to apply modulo after each addition
   - Apply modulo only at the end (risking integer overflow)
   - Use the wrong modulus value

3. **Confusing subarray with subsequence**: A subarray is contiguous, while a subsequence is not necessarily contiguous. Some candidates try to count non-contiguous sequences, which is incorrect for this problem.

4. **Overcomplicating with DP**: While dynamic programming is possible (tracking odd/even sums ending at each position), it's less efficient than the prefix sum parity approach and uses O(n) space instead of O(1).

## When You'll See This Pattern

This prefix sum parity technique appears in several other problems:

1. **Subarray Sum Equals K (LeetCode 560)**: Instead of tracking parity, we track actual prefix sums and use a hashmap to count subarrays summing to a target value.

2. **Count Number of Nice Subarrays (LeetCode 1248)**: Similar parity concept but counting subarrays with exactly k odd numbers instead of odd sum.

3. **Continuous Subarray Sum (LeetCode 523)**: Uses prefix sums with modulo arithmetic to find subarrays divisible by k.

The common pattern: when you need to count subarrays satisfying a condition on their sum, think about using prefix sums and maintaining counts of prefix sums with certain properties (parity, remainder modulo k, etc.).

## Key Takeaways

1. **Prefix sums transform range queries into point queries**: Instead of computing sums for every subarray O(n²), prefix sums let us compute any subarray sum in O(1) after O(n) preprocessing.

2. **Parity is simpler than magnitude**: For problems asking about odd/even sums, you only need to track parity (odd/even) not the actual sum values. This reduces space and simplifies logic.

3. **Count complements, not direct matches**: Instead of counting subarrays with odd sums directly, we count pairs of prefix sums with different parity. This indirect counting is often more efficient.

Related problems: [Subsequence of Size K With the Largest Even Sum](/problem/subsequence-of-size-k-with-the-largest-even-sum)
