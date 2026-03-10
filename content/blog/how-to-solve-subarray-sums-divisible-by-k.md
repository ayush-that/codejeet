---
title: "How to Solve Subarray Sums Divisible by K — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Subarray Sums Divisible by K. Medium difficulty, 56.1% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2027-05-28"
category: "dsa-patterns"
tags: ["subarray-sums-divisible-by-k", "array", "hash-table", "prefix-sum", "medium"]
---

# How to Solve Subarray Sums Divisible by K

This problem asks us to count all contiguous subarrays whose sum is divisible by a given integer `k`. What makes this problem interesting is that we can't just check every possible subarray—that would be too slow for large arrays. The key insight involves transforming the problem using prefix sums and modular arithmetic to achieve an efficient O(n) solution.

## Visual Walkthrough

Let's trace through a concrete example: `nums = [4,5,0,-2,-3,1]`, `k = 5`.

We want to find subarrays whose sum is divisible by 5. Let's build intuition with prefix sums:

1. **Calculate prefix sums**: The prefix sum at index `i` is the sum of elements from index 0 to i.
   - Index 0: 4 → prefix sum = 4
   - Index 1: 5 → prefix sum = 4 + 5 = 9
   - Index 2: 0 → prefix sum = 9 + 0 = 9
   - Index 3: -2 → prefix sum = 9 + (-2) = 7
   - Index 4: -3 → prefix sum = 7 + (-3) = 4
   - Index 5: 1 → prefix sum = 4 + 1 = 5

2. **Key insight**: If the sum of a subarray from index `i+1` to `j` is divisible by `k`, then:

   ```
   (prefix[j] - prefix[i]) % k == 0
   ```

   This simplifies to:

   ```
   prefix[j] % k == prefix[i] % k
   ```

   So two prefix sums with the same remainder modulo `k` define a subarray divisible by `k`.

3. **Calculate remainders**:
   - 4 % 5 = 4
   - 9 % 5 = 4
   - 9 % 5 = 4
   - 7 % 5 = 2
   - 4 % 5 = 4
   - 5 % 5 = 0

4. **Count pairs with same remainder**:
   - Remainder 4 appears at indices 0, 1, 2, 4 → 4 occurrences
   - Number of pairs = C(4,2) = 4×3/2 = 6 subarrays
   - Remainder 0 appears at index 5 → 1 occurrence
   - A remainder of 0 means the prefix sum itself is divisible by k, so we count the subarray from start to that index
   - Total subarrays with remainder 0 = C(1,2) + 1 = 0 + 1 = 1

5. **Total**: 6 + 1 = 7 subarrays divisible by 5

Let's verify one: Subarray from index 1 to 4: `[5,0,-2,-3]` sums to 0, which is divisible by 5.

## Brute Force Approach

The most straightforward solution is to check every possible subarray:

1. For each starting index `i` from 0 to n-1
2. For each ending index `j` from i to n-1
3. Calculate the sum of elements from i to j
4. If sum % k == 0, increment count

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def subarraysDivByK_brute(nums, k):
    n = len(nums)
    count = 0

    # Try every possible starting point
    for i in range(n):
        # Try every possible ending point
        for j in range(i, n):
            # Calculate sum of subarray nums[i..j]
            current_sum = 0
            for idx in range(i, j + 1):
                current_sum += nums[idx]

            # Check if divisible by k
            if current_sum % k == 0:
                count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function subarraysDivByKBrute(nums, k) {
  const n = nums.length;
  let count = 0;

  // Try every possible starting point
  for (let i = 0; i < n; i++) {
    // Try every possible ending point
    for (let j = i; j < n; j++) {
      // Calculate sum of subarray nums[i..j]
      let currentSum = 0;
      for (let idx = i; idx <= j; idx++) {
        currentSum += nums[idx];
      }

      // Check if divisible by k
      if (currentSum % k === 0) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int subarraysDivByKBrute(int[] nums, int k) {
    int n = nums.length;
    int count = 0;

    // Try every possible starting point
    for (int i = 0; i < n; i++) {
        // Try every possible ending point
        for (int j = i; j < n; j++) {
            // Calculate sum of subarray nums[i..j]
            int currentSum = 0;
            for (int idx = i; idx <= j; idx++) {
                currentSum += nums[idx];
            }

            // Check if divisible by k
            if (currentSum % k == 0) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this is insufficient**: With O(n³) time complexity, this solution becomes impractical for arrays larger than a few hundred elements. Even with optimization to O(n²) by reusing sums, it's still too slow for typical constraints where n can be up to 30,000.

## Optimized Approach

The key insight comes from two mathematical observations:

1. **Prefix sums**: The sum of any subarray `nums[i..j]` can be expressed as `prefix[j] - prefix[i-1]`, where `prefix[x]` is the sum of elements from index 0 to x.

2. **Modular arithmetic**: For a subarray sum to be divisible by `k`:

   ```
   (prefix[j] - prefix[i]) % k == 0
   ```

   This is equivalent to:

   ```
   prefix[j] % k == prefix[i] % k
   ```

   So we're looking for pairs of prefix sums with the same remainder modulo `k`.

3. **Special case**: When `prefix[i] % k == 0`, the subarray from index 0 to i is itself divisible by k. We handle this by starting with a count of 1 for remainder 0 (representing the empty prefix sum).

The algorithm:

1. Initialize a hash map/dictionary to count occurrences of each remainder
2. Start with remainder 0 having count 1 (empty prefix)
3. Iterate through the array, maintaining a running prefix sum
4. For each element, update the prefix sum and calculate its remainder modulo k
5. Add the current count of this remainder to the answer (these represent valid subarrays ending at current position)
6. Increment the count for this remainder in the hash map

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n) | Space: O(min(n, k))
def subarraysDivByK(nums, k):
    """
    Count subarrays with sum divisible by k using prefix sums and modular arithmetic.

    The key insight: if (prefix[j] - prefix[i]) % k == 0, then
    prefix[j] % k == prefix[i] % k. So we count pairs of prefix sums
    with the same remainder modulo k.
    """
    # Initialize remainder count dictionary
    # remainder 0 starts with count 1 for the empty prefix sum
    remainder_count = {0: 1}

    prefix_sum = 0  # Running prefix sum
    count = 0       # Result: number of valid subarrays

    for num in nums:
        # Update prefix sum with current number
        prefix_sum += num

        # Calculate remainder of current prefix sum modulo k
        # Use ((prefix_sum % k) + k) % k to handle negative numbers correctly
        remainder = ((prefix_sum % k) + k) % k

        # If we've seen this remainder before, each previous occurrence
        # represents a subarray ending at current position that's divisible by k
        if remainder in remainder_count:
            count += remainder_count[remainder]

        # Update the count for this remainder
        remainder_count[remainder] = remainder_count.get(remainder, 0) + 1

    return count
```

```javascript
// Time: O(n) | Space: O(min(n, k))
function subarraysDivByK(nums, k) {
  /**
   * Count subarrays with sum divisible by k using prefix sums and modular arithmetic.
   *
   * The key insight: if (prefix[j] - prefix[i]) % k == 0, then
   * prefix[j] % k == prefix[i] % k. So we count pairs of prefix sums
   * with the same remainder modulo k.
   */
  // Initialize remainder count map
  // remainder 0 starts with count 1 for the empty prefix sum
  const remainderCount = new Map();
  remainderCount.set(0, 1);

  let prefixSum = 0; // Running prefix sum
  let count = 0; // Result: number of valid subarrays

  for (const num of nums) {
    // Update prefix sum with current number
    prefixSum += num;

    // Calculate remainder of current prefix sum modulo k
    // Use ((prefixSum % k) + k) % k to handle negative numbers correctly
    let remainder = ((prefixSum % k) + k) % k;

    // If we've seen this remainder before, each previous occurrence
    // represents a subarray ending at current position that's divisible by k
    if (remainderCount.has(remainder)) {
      count += remainderCount.get(remainder);
    }

    // Update the count for this remainder
    remainderCount.set(remainder, (remainderCount.get(remainder) || 0) + 1);
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(min(n, k))
public int subarraysDivByK(int[] nums, int k) {
    /**
     * Count subarrays with sum divisible by k using prefix sums and modular arithmetic.
     *
     * The key insight: if (prefix[j] - prefix[i]) % k == 0, then
     * prefix[j] % k == prefix[i] % k. So we count pairs of prefix sums
     * with the same remainder modulo k.
     */
    // Initialize remainder count array (k possible remainders: 0 to k-1)
    int[] remainderCount = new int[k];

    // remainder 0 starts with count 1 for the empty prefix sum
    remainderCount[0] = 1;

    int prefixSum = 0;  // Running prefix sum
    int count = 0;      // Result: number of valid subarrays

    for (int num : nums) {
        // Update prefix sum with current number
        prefixSum += num;

        // Calculate remainder of current prefix sum modulo k
        // Use ((prefixSum % k) + k) % k to handle negative numbers correctly
        int remainder = ((prefixSum % k) + k) % k;

        // If we've seen this remainder before, each previous occurrence
        // represents a subarray ending at current position that's divisible by k
        count += remainderCount[remainder];

        // Update the count for this remainder
        remainderCount[remainder]++;
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We make a single pass through the array of length n
- Each iteration performs O(1) operations (hash map lookup/update or array access)

**Space Complexity**: O(min(n, k))

- We store counts for each remainder we encounter
- There are at most k possible remainders (0 to k-1)
- In practice, we store at most min(n, k) entries since we can't have more than n prefix sums

## Common Mistakes

1. **Not handling negative remainders correctly**: In Python and JavaScript, `-1 % 5` gives `-1`, not `4`. We need `((prefix_sum % k) + k) % k` to get a proper remainder in the range `[0, k-1]`. Java's `%` operator handles negatives correctly, but the formula works universally.

2. **Forgetting to initialize remainder 0 with count 1**: The empty prefix sum (before any elements) has remainder 0. Without this, we miss subarrays that start at index 0 and are divisible by k.

3. **Using O(n²) approach with prefix sums**: Some candidates calculate all prefix sums then check all pairs, which is O(n²). The hash map optimization reduces this to O(n).

4. **Confusing subarrays with subsequences**: Remember subarrays must be contiguous. The prefix sum approach works because it maintains contiguity.

## When You'll See This Pattern

This "prefix sum + hash map" pattern appears in several related problems:

1. **Subarray Sum Equals K (LeetCode 560)**: Instead of checking divisibility, we check if `prefix[j] - prefix[i] == k`, which means `prefix[j] - k == prefix[i]`. We store prefix sums in a hash map and look for `prefix_sum - k`.

2. **Make Sum Divisible by P (LeetCode 1590)**: Find the smallest subarray to remove to make the sum divisible by p. Uses similar remainder tracking but looks for specific remainder differences.

3. **Continuous Subarray Sum (LeetCode 523)**: Check if there's a subarray of size at least 2 with sum multiple of k. Similar approach but stores indices instead of counts.

The core pattern: when you need to find subarrays satisfying a condition on their sum, consider prefix sums and what condition on prefix sums would satisfy it.

## Key Takeaways

1. **Transform subarray problems into prefix sum problems**: Any subarray sum can be expressed as the difference of two prefix sums.

2. **Use modular arithmetic for divisibility conditions**: The condition `(a - b) % k == 0` simplifies to `a % k == b % k`, allowing us to use remainder frequencies.

3. **Hash maps optimize pair-finding**: Instead of checking all O(n²) pairs, a hash map lets us count valid pairs in O(1) per element.

Related problems: [Subarray Sum Equals K](/problem/subarray-sum-equals-k), [Make Sum Divisible by P](/problem/make-sum-divisible-by-p), [Count Number of Bad Pairs](/problem/count-number-of-bad-pairs)
