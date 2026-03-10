---
title: "How to Solve Make Sum Divisible by P — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Make Sum Divisible by P. Medium difficulty, 42.6% acceptance rate. Topics: Array, Hash Table, Prefix Sum."
date: "2028-07-19"
category: "dsa-patterns"
tags: ["make-sum-divisible-by-p", "array", "hash-table", "prefix-sum", "medium"]
---

## How to Solve "Make Sum Divisible by P"

You're given an array of positive integers and need to remove the smallest subarray (not the entire array) so that the sum of the remaining elements is divisible by `p`. The challenge is finding which subarray to remove efficiently—checking every possible subarray would be too slow for large arrays. This problem is interesting because it transforms a subarray removal problem into a prefix sum remainder problem, similar to "Subarray Sums Divisible by K" but with a twist: we're looking for a subarray whose sum has a specific remainder relative to the total sum.

## Visual Walkthrough

Let's trace through an example: `nums = [3, 1, 4, 2]`, `p = 6`.

**Step 1: Calculate total sum and target remainder**

- Total sum = 3 + 1 + 4 + 2 = 10
- 10 % 6 = 4 (this is the remainder we need to remove)
- We need to find a subarray whose sum % 6 = 4

**Step 2: Build prefix sum remainders**
We'll track cumulative sum % 6 as we go:

- Index -1 (before start): remainder = 0
- Index 0 (value 3): (0 + 3) % 6 = 3
- Index 1 (value 1): (3 + 1) % 6 = 4
- Index 2 (value 4): (4 + 4) % 6 = 2
- Index 3 (value 2): (2 + 2) % 6 = 4

**Step 3: Find matching remainders**
We need current_remainder - target_remainder ≡ 0 (mod p)
Or equivalently: current_remainder ≡ target_remainder (mod p)

Looking for where we've seen remainder = (current - 4) % 6:

- At index 1: current = 4, need (4 - 4) % 6 = 0 → last seen at index -1 → subarray [0:1] sum = 4
- At index 3: current = 4, need (4 - 4) % 6 = 0 → last seen at index 1 → subarray [2:3] sum = 6

**Step 4: Choose smallest subarray**

- Subarray [0:1] length = 2
- Subarray [2:3] length = 2
  Both give length 2, so answer is 2.

## Brute Force Approach

The brute force solution would check every possible subarray:

1. Calculate total sum of the array
2. For each possible subarray (start and end indices):
   - Calculate sum of that subarray
   - Check if (total_sum - subarray_sum) % p == 0
   - Track the minimum length of valid subarrays

This requires O(n²) time for checking all subarrays and O(n) for calculating each subarray sum (or O(1) with prefix sums but still O(n²) overall). For n up to 10⁵, O(n²) is far too slow (10¹⁰ operations).

```python
# Brute force - too slow for large inputs
def minSubarray(nums, p):
    total = sum(nums)
    n = len(nums)
    min_len = n + 1

    for i in range(n):
        subarray_sum = 0
        for j in range(i, n):
            subarray_sum += nums[j]
            if (total - subarray_sum) % p == 0:
                min_len = min(min_len, j - i + 1)

    return -1 if min_len == n else min_len
```

The brute force fails because it doesn't leverage the mathematical relationship between remainders, forcing us to check O(n²) subarrays.

## Optimized Approach

The key insight is that we can transform this into a prefix sum remainder problem:

1. Let `total_sum % p = target_remainder`
2. If `target_remainder == 0`, we don't need to remove anything (return 0)
3. Otherwise, we need to find a subarray whose sum % p = `target_remainder`
4. For a subarray from index i+1 to j, its sum = prefix[j] - prefix[i]
5. We want (prefix[j] - prefix[i]) % p = target_remainder
6. This is equivalent to (prefix[j] - target_remainder) % p = prefix[i] % p

So we can:

- Calculate prefix sum remainders as we iterate
- For each current remainder `curr`, look for the last index where we saw remainder `(curr - target_remainder) % p`
- The subarray between that index and current index has the required remainder
- Track the minimum length found

We use a hash map to store the most recent index for each remainder we've seen.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(p) - hash map stores at most p remainders
def minSubarray(nums, p):
    """
    Find smallest subarray to remove so remaining sum is divisible by p.

    Args:
        nums: List of positive integers
        p: The divisor

    Returns:
        Minimum length of subarray to remove, or -1 if impossible
    """
    n = len(nums)

    # Step 1: Calculate total sum and target remainder
    total_sum = sum(nums)
    target_remainder = total_sum % p

    # If total sum is already divisible by p, no removal needed
    if target_remainder == 0:
        return 0

    # Step 2: Use hash map to track last seen index for each remainder
    # remainder_map[remainder] = last index where this remainder occurred
    remainder_map = {0: -1}  # Initialize with remainder 0 at index -1
    current_remainder = 0
    min_length = n  # Initialize with worst case (remove almost entire array)

    # Step 3: Iterate through array, calculating prefix sum remainders
    for i in range(n):
        # Update current remainder with current number
        current_remainder = (current_remainder + nums[i]) % p

        # Calculate the remainder we need to have seen earlier
        # We want: (current - needed) % p = target_remainder
        # So: needed = (current - target_remainder) % p
        needed_remainder = (current_remainder - target_remainder) % p

        # Step 4: Check if we've seen the needed remainder before
        if needed_remainder in remainder_map:
            # Found a valid subarray from (previous_index + 1) to i
            subarray_length = i - remainder_map[needed_remainder]
            min_length = min(min_length, subarray_length)

        # Step 5: Update map with current remainder and index
        remainder_map[current_remainder] = i

    # Step 6: Return result (can't remove entire array)
    return -1 if min_length == n else min_length
```

```javascript
// Time: O(n) | Space: O(p) - Map stores at most p remainders
function minSubarray(nums, p) {
  const n = nums.length;

  // Step 1: Calculate total sum and target remainder
  let totalSum = nums.reduce((sum, num) => sum + num, 0);
  let targetRemainder = totalSum % p;

  // If already divisible, no removal needed
  if (targetRemainder === 0) return 0;

  // Step 2: Map to track last seen index for each remainder
  // Initialize with remainder 0 at index -1
  let remainderMap = new Map();
  remainderMap.set(0, -1);

  let currentRemainder = 0;
  let minLength = n; // Worst case: remove almost entire array

  // Step 3: Iterate through array
  for (let i = 0; i < n; i++) {
    // Update current remainder
    currentRemainder = (currentRemainder + nums[i]) % p;

    // Calculate remainder we need to have seen earlier
    // needed = (current - target) mod p
    let neededRemainder = (currentRemainder - targetRemainder) % p;
    // Handle negative remainder in JavaScript
    if (neededRemainder < 0) neededRemainder += p;

    // Step 4: Check if we've seen needed remainder
    if (remainderMap.has(neededRemainder)) {
      let subarrayLength = i - remainderMap.get(neededRemainder);
      minLength = Math.min(minLength, subarrayLength);
    }

    // Step 5: Update map with current remainder
    remainderMap.set(currentRemainder, i);
  }

  // Step 6: Can't remove entire array
  return minLength === n ? -1 : minLength;
}
```

```java
// Time: O(n) | Space: O(p) - HashMap stores at most p entries
import java.util.HashMap;

class Solution {
    public int minSubarray(int[] nums, int p) {
        int n = nums.length;

        // Step 1: Calculate total sum and target remainder
        long totalSum = 0;
        for (int num : nums) totalSum += num;
        int targetRemainder = (int)(totalSum % p);

        // If already divisible, no removal needed
        if (targetRemainder == 0) return 0;

        // Step 2: Map to track last seen index for each remainder
        // Initialize with remainder 0 at index -1
        HashMap<Integer, Integer> remainderMap = new HashMap<>();
        remainderMap.put(0, -1);

        int currentRemainder = 0;
        int minLength = n; // Worst case: remove almost entire array

        // Step 3: Iterate through array
        for (int i = 0; i < n; i++) {
            // Update current remainder
            currentRemainder = (currentRemainder + nums[i]) % p;
            // Ensure positive remainder
            if (currentRemainder < 0) currentRemainder += p;

            // Calculate remainder we need to have seen earlier
            // needed = (current - target) mod p
            int neededRemainder = (currentRemainder - targetRemainder) % p;
            if (neededRemainder < 0) neededRemainder += p;

            // Step 4: Check if we've seen needed remainder
            if (remainderMap.containsKey(neededRemainder)) {
                int subarrayLength = i - remainderMap.get(neededRemainder);
                minLength = Math.min(minLength, subarrayLength);
            }

            // Step 5: Update map with current remainder
            remainderMap.put(currentRemainder, i);
        }

        // Step 6: Can't remove entire array
        return minLength == n ? -1 : minLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make a single pass through the array (n iterations)
- Each iteration does O(1) operations: hash map lookups and updates
- Calculating total sum also takes O(n), but this is dominated by the main loop

**Space Complexity: O(min(n, p))**

- The hash map stores at most p entries (since remainders range from 0 to p-1)
- In practice, we store fewer than p entries as we only store remainders we've encountered
- If p > n, we store at most n entries (one per index)

## Common Mistakes

1. **Forgetting to handle negative remainders**: In languages where `%` can return negative values (like Java and JavaScript), you must adjust to positive range using `(x % p + p) % p`.

2. **Not initializing with remainder 0 at index -1**: The empty prefix (before index 0) has remainder 0. Without this, you'll miss subarrays starting at index 0.

3. **Allowing removal of entire array**: The problem states you cannot remove the whole array. Check if `minLength == n` at the end and return -1 in that case.

4. **Using array instead of hash map for remainder storage**: Some candidates try to use an array of size p, but if p is large (up to 10⁹), this causes memory issues. A hash map handles sparse remainders efficiently.

## When You'll See This Pattern

This prefix sum remainder pattern appears in problems where you need to find subarrays with specific sum properties modulo some number:

1. **Subarray Sums Divisible by K (LeetCode 974)**: Direct application - find number of subarrays divisible by k using similar remainder tracking.

2. **Continuous Subarray Sum (LeetCode 523)**: Check if there's a subarray of size ≥ 2 with sum multiple of k using remainder tracking with index differences.

3. **Find the Divisibility Array of a String (LeetCode 2575)**: While not exactly the same, it involves building remainders incrementally as you process digits.

The core technique is recognizing that `(prefix[j] - prefix[i]) % p = x` can be rewritten as `prefix[j] % p ≡ (prefix[i] + x) % p`, allowing hash map lookups.

## Key Takeaways

1. **Transform removal problems into remainder problems**: Instead of thinking about what to remove, think about what remainder the removed subarray should have relative to the total sum.

2. **Prefix sums + hash maps solve many subarray problems**: When you need to find subarrays with specific sum properties, consider tracking prefix sums or their remainders in a hash map for O(1) lookups.

3. **Initialize with empty prefix**: Always consider the empty subarray (index -1) with remainder 0 when using prefix sums.

Related problems: [Subarray Sums Divisible by K](/problem/subarray-sums-divisible-by-k), [Find the Divisibility Array of a String](/problem/find-the-divisibility-array-of-a-string)
