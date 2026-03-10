---
title: "How to Solve Count of Interesting Subarrays — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count of Interesting Subarrays. Medium difficulty, 58.0% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2027-08-09"
category: "dsa-patterns"
tags: ["count-of-interesting-subarrays", "array", "hash-table", "prefix-sum", "medium"]
---

# How to Solve Count of Interesting Subarrays

This problem asks us to count subarrays where the number of elements divisible by `modulo` within the subarray, when taken modulo `modulo`, equals `k`. At first glance, it might seem like we need to check every possible subarray, but with constraints up to 10⁵ elements, we need a smarter approach. The key insight is recognizing this as a **prefix sum modulo counting** problem, similar to counting subarrays with a particular sum property.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `nums = [3, 1, 9, 2, 4]`, `modulo = 3`, `k = 1`

We're looking for subarrays where the count of numbers divisible by 3 (modulo 3) equals 1 modulo 3.

**Step 1: Transform the array**
First, let's mark which elements are divisible by 3:

- 3 ÷ 3 = 1 remainder 0 → divisible ✓
- 1 ÷ 3 = 0 remainder 1 → not divisible
- 9 ÷ 3 = 3 remainder 0 → divisible ✓
- 2 ÷ 3 = 0 remainder 2 → not divisible
- 4 ÷ 3 = 1 remainder 1 → not divisible

So we have: `[1, 0, 1, 0, 0]` where 1 means divisible by 3, 0 means not.

**Step 2: Think about what we're counting**
For any subarray `nums[l..r]`, we want:
`(count of 1's in that range) % modulo == k`

**Step 3: Try a brute force check**
Let's check subarray `[3, 1, 9]` (indices 0-2):

- Count of divisible numbers = 2 (3 and 9)
- 2 % 3 = 2 ≠ 1 → not interesting

Subarray `[1, 9, 2]` (indices 1-3):

- Count of divisible numbers = 1 (just 9)
- 1 % 3 = 1 → interesting! ✓

**Step 4: The prefix sum insight**
If we create a prefix sum array of the 1's:

- Prefix sums: `[1, 1, 2, 2, 2]` (cumulative count of divisible numbers)

For subarray `[1, 9, 2]` (indices 1-3):

- Count = prefix[3] - prefix[0] = 2 - 1 = 1
- 1 % 3 = 1 → interesting

But wait, we need `(prefix[r] - prefix[l-1]) % modulo == k`

Rearranging: `(prefix[r] - k) % modulo == prefix[l-1] % modulo`

This is the key transformation! Now we can use a hash map to count how many previous prefix sums (modulo `modulo`) match `(current_prefix - k) % modulo`.

## Brute Force Approach

The brute force solution would check every possible subarray:

<div class="code-group">

```python
# Time: O(n²) | Space: O(1)
def countInterestingSubarrays(nums, modulo, k):
    n = len(nums)
    count = 0

    # Check every possible subarray
    for left in range(n):
        divisible_count = 0
        for right in range(left, n):
            # Count how many numbers in nums[left..right] are divisible by modulo
            if nums[right] % modulo == 0:
                divisible_count += 1

            # Check if the count modulo modulo equals k
            if divisible_count % modulo == k:
                count += 1

    return count
```

```javascript
// Time: O(n²) | Space: O(1)
function countInterestingSubarrays(nums, modulo, k) {
  const n = nums.length;
  let count = 0;

  // Check every possible subarray
  for (let left = 0; left < n; left++) {
    let divisibleCount = 0;
    for (let right = left; right < n; right++) {
      // Count how many numbers in nums[left..right] are divisible by modulo
      if (nums[right] % modulo === 0) {
        divisibleCount++;
      }

      // Check if the count modulo modulo equals k
      if (divisibleCount % modulo === k) {
        count++;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n²) | Space: O(1)
public long countInterestingSubarrays(int[] nums, int modulo, int k) {
    int n = nums.length;
    long count = 0;

    // Check every possible subarray
    for (int left = 0; left < n; left++) {
        int divisibleCount = 0;
        for (int right = left; right < n; right++) {
            // Count how many numbers in nums[left..right] are divisible by modulo
            if (nums[right] % modulo == 0) {
                divisibleCount++;
            }

            // Check if the count modulo modulo equals k
            if (divisibleCount % modulo == k) {
                count++;
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With `n` up to 10⁵, O(n²) is far too slow (10¹⁰ operations). We need an O(n) or O(n log n) solution.

## Optimized Approach

The key insight transforms this into a **prefix sum modulo counting** problem:

1. **Transform the problem:** Instead of working with the original numbers, create a binary array where `arr[i] = 1` if `nums[i] % modulo == 0`, else `0`.

2. **Prefix sums:** Let `prefix[i]` be the sum of the first `i` elements of this binary array (number of divisible elements up to index `i-1`).

3. **The condition:** For a subarray `nums[l..r]`, we want:
   `(prefix[r+1] - prefix[l]) % modulo == k`

4. **Rearrange:** This is equivalent to:
   `(prefix[r+1] - k) % modulo == prefix[l] % modulo`

5. **Use a hash map:** As we iterate through the array, we can store how many times each `prefix % modulo` value has appeared. For each position `r`, we look for how many previous positions `l` satisfy the equation above.

6. **Handle modulo arithmetic carefully:** Since we're dealing with modulo operations, we need to ensure we handle negative values correctly by adding `modulo` before taking modulo.

## Optimal Solution

Here's the complete optimized solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(modulo)
def countInterestingSubarrays(nums, modulo, k):
    """
    Count subarrays where (count of elements divisible by modulo) % modulo == k

    Args:
        nums: List of integers
        modulo: The modulo value
        k: The target remainder

    Returns:
        Count of interesting subarrays
    """
    n = len(nums)
    count = 0
    prefix_mod = 0  # Current prefix sum modulo modulo
    freq = {0: 1}   # Frequency map of prefix_mod values, start with prefix_mod = 0

    for num in nums:
        # Update prefix_mod: add 1 if current number is divisible by modulo
        if num % modulo == 0:
            prefix_mod = (prefix_mod + 1) % modulo

        # We're looking for previous prefix_mod values such that:
        # (current_prefix_mod - previous_prefix_mod) % modulo == k
        # Rearranged: previous_prefix_mod == (current_prefix_mod - k) % modulo
        target = (prefix_mod - k) % modulo

        # Add the count of how many times we've seen this target before
        # Each occurrence represents a valid starting point for a subarray
        count += freq.get(target, 0)

        # Update frequency of current prefix_mod
        freq[prefix_mod] = freq.get(prefix_mod, 0) + 1

    return count
```

```javascript
// Time: O(n) | Space: O(modulo)
function countInterestingSubarrays(nums, modulo, k) {
  /**
   * Count subarrays where (count of elements divisible by modulo) % modulo == k
   *
   * @param {number[]} nums - Array of integers
   * @param {number} modulo - The modulo value
   * @param {number} k - The target remainder
   * @return {number} - Count of interesting subarrays
   */
  const n = nums.length;
  let count = 0;
  let prefixMod = 0; // Current prefix sum modulo modulo
  const freq = new Map();
  freq.set(0, 1); // Initialize with prefix_mod = 0

  for (const num of nums) {
    // Update prefixMod: add 1 if current number is divisible by modulo
    if (num % modulo === 0) {
      prefixMod = (prefixMod + 1) % modulo;
    }

    // We're looking for previous prefixMod values such that:
    // (current_prefixMod - previous_prefixMod) % modulo === k
    // Rearranged: previous_prefixMod === (current_prefixMod - k) % modulo
    let target = (prefixMod - k) % modulo;
    // Handle negative modulo result
    if (target < 0) target += modulo;

    // Add the count of how many times we've seen this target before
    // Each occurrence represents a valid starting point for a subarray
    count += freq.get(target) || 0;

    // Update frequency of current prefixMod
    freq.set(prefixMod, (freq.get(prefixMod) || 0) + 1);
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(modulo)
public long countInterestingSubarrays(int[] nums, int modulo, int k) {
    /**
     * Count subarrays where (count of elements divisible by modulo) % modulo == k
     *
     * @param nums - Array of integers
     * @param modulo - The modulo value
     * @param k - The target remainder
     * @return Count of interesting subarrays
     */
    int n = nums.length;
    long count = 0;
    int prefixMod = 0;  // Current prefix sum modulo modulo
    Map<Integer, Integer> freq = new HashMap<>();
    freq.put(0, 1);     // Initialize with prefix_mod = 0

    for (int num : nums) {
        // Update prefixMod: add 1 if current number is divisible by modulo
        if (num % modulo == 0) {
            prefixMod = (prefixMod + 1) % modulo;
        }

        // We're looking for previous prefixMod values such that:
        // (current_prefixMod - previous_prefixMod) % modulo == k
        // Rearranged: previous_prefixMod == (current_prefixMod - k) % modulo
        int target = (prefixMod - k) % modulo;
        // Handle negative modulo result
        if (target < 0) target += modulo;

        // Add the count of how many times we've seen this target before
        // Each occurrence represents a valid starting point for a subarray
        count += freq.getOrDefault(target, 0);

        // Update frequency of current prefixMod
        freq.put(prefixMod, freq.getOrDefault(prefixMod, 0) + 1);
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array, performing O(1) operations for each element.
- Hash map operations (get and put) are O(1) on average.

**Space Complexity: O(modulo)**

- In the worst case, we might store up to `modulo` different remainder values in our frequency map.
- Since `modulo` can be up to 10⁹, but in practice the number of distinct remainders we encounter is limited by the array length, we can also say O(min(n, modulo)).

## Common Mistakes

1. **Forgetting to initialize the frequency map with `{0: 1}`**
   - This accounts for subarrays starting at index 0. Without it, you'll miss all subarrays that begin at the first element.
   - **Fix:** Always initialize `freq[0] = 1` before the loop.

2. **Incorrect modulo arithmetic with negative numbers**
   - In some languages, `-1 % 3` gives `-1` instead of `2`.
   - **Fix:** Use `((a % m) + m) % m` or check if result is negative and add `modulo`.

3. **Using integer overflow for large counts**
   - The count can exceed 2³¹ - 1 for large arrays.
   - **Fix:** Use 64-bit integers (long in Java, no issue in Python).

4. **Confusing the condition with subarray sum problems**
   - This counts elements divisible by modulo, not the sum of elements.
   - **Fix:** Remember to transform the array first: `1` if divisible, `0` otherwise.

## When You'll See This Pattern

This **prefix sum modulo counting** pattern appears in several LeetCode problems:

1. **Subarray Sums Divisible by K (LeetCode 974)**
   - Almost identical pattern: count subarrays where sum % k == 0.
   - The key transformation is the same: `(prefix[r] - prefix[l]) % k == 0` → `prefix[r] % k == prefix[l] % k`.

2. **Count Number of Nice Subarrays (LeetCode 1248)**
   - Count subarrays with exactly k odd numbers.
   - Similar transformation: `prefix[r] - prefix[l] == k` → `prefix[l] == prefix[r] - k`.

3. **Binary Subarrays With Sum (LeetCode 930)**
   - Count binary subarrays with sum equal to goal.
   - Uses the same prefix sum with hash map technique.

## Key Takeaways

1. **When you need to count subarrays with a particular sum/count property**, think about transforming it into a prefix sum problem and using a hash map to store previously seen prefix values.

2. **The rearrangement trick** `(prefix[r] - prefix[l]) % m == k` → `(prefix[r] - k) % m == prefix[l] % m` is powerful for modulo-based subarray counting problems.

3. **Always initialize your frequency map** with the empty prefix (usually `freq[0] = 1`) to handle subarrays starting at index 0.

**Related problems:** [Subarray Sums Divisible by K](/problem/subarray-sums-divisible-by-k), [Count Number of Nice Subarrays](/problem/count-number-of-nice-subarrays)
