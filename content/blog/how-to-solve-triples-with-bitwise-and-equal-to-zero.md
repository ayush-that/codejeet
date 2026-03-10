---
title: "How to Solve Triples with Bitwise AND Equal To Zero — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Triples with Bitwise AND Equal To Zero. Hard difficulty, 60.0% acceptance rate. Topics: Array, Hash Table, Bit Manipulation."
date: "2029-08-22"
category: "dsa-patterns"
tags: ["triples-with-bitwise-and-equal-to-zero", "array", "hash-table", "bit-manipulation", "hard"]
---

# How to Solve Triples with Bitwise AND Equal To Zero

This problem asks us to count all triples `(i, j, k)` from an array where the bitwise AND of the three numbers equals zero. The challenge comes from the constraints: arrays can have up to 1000 elements, making the brute force O(n³) approach (1 billion operations) infeasible. The key insight is that we need to leverage bitmask properties and clever counting to reduce the complexity.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 2, 3]`

We need to find all triples where `nums[i] & nums[j] & nums[k] == 0`:

**Triple (0,0,0):** `1 & 1 & 1 = 1` ❌  
**Triple (0,0,1):** `1 & 1 & 2 = 0` ✅  
**Triple (0,0,2):** `1 & 1 & 3 = 1` ❌  
**Triple (0,1,0):** `1 & 2 & 1 = 0` ✅  
**Triple (0,1,1):** `1 & 2 & 2 = 0` ✅  
**Triple (0,1,2):** `1 & 2 & 3 = 0` ✅  
**Triple (0,2,0):** `1 & 3 & 1 = 1` ❌  
**Triple (0,2,1):** `1 & 3 & 2 = 0` ✅  
**Triple (0,2,2):** `1 & 3 & 3 = 1` ❌

Continuing this process for all 27 possible triples, we'd find 12 valid triples. The brute force approach checks all 27 combinations, but with 1000 elements, we'd need to check 1 billion combinations - far too many.

The key observation: `nums[i] & nums[j] & nums[k] == 0` means that for every bit position, at least one of the three numbers has a 0 in that position. Another way to think about it: the bitwise AND of any two numbers can produce various masks, and we need to find a third number that has no 1 bits in common with that mask.

## Brute Force Approach

The most straightforward solution is to check all possible triples:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def countTriplets_brute(nums):
    n = len(nums)
    count = 0

    # Check all possible triples
    for i in range(n):
        for j in range(n):
            for k in range(n):
                # If bitwise AND of all three is zero, count it
                if (nums[i] & nums[j] & nums[k]) == 0:
                    count += 1

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function countTripletsBrute(nums) {
  const n = nums.length;
  let count = 0;

  // Check all possible triples
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        // If bitwise AND of all three is zero, count it
        if ((nums[i] & nums[j] & nums[k]) === 0) {
          count++;
        }
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int countTripletsBrute(int[] nums) {
    int n = nums.length;
    int count = 0;

    // Check all possible triples
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                // If bitwise AND of all three is zero, count it
                if ((nums[i] & nums[j] & nums[k]) == 0) {
                    count++;
                }
            }
        }
    }

    return count;
}
```

</div>

**Why this fails:** With n ≤ 1000, the brute force approach requires up to 1,000,000,000 (1 billion) operations, which is far too slow. We need a solution that's at most O(n²) or better.

## Optimized Approach

The key insight is to precompute the frequency of AND results for pairs of numbers, then check which third numbers would make the triple AND to zero.

**Step-by-step reasoning:**

1. **Observation:** `nums[i] & nums[j] & nums[k] == 0` means that `nums[k]` must have no 1 bits in common with `(nums[i] & nums[j])`. In other words, `nums[k] & mask == 0` where `mask = nums[i] & nums[j]`.

2. **Precomputation:** We can compute all possible AND results from pairs `(nums[i], nums[j])` and count how many pairs produce each mask value. Since numbers are up to 2¹⁶ (65536) in the problem constraints, there are at most 65536 possible mask values.

3. **Counting:** For each mask value `m` and its frequency `freq[m]` (number of pairs that AND to `m`), we need to count how many numbers in `nums` have no 1 bits in common with `m`. A number `x` has no 1 bits in common with `m` if `(x & m) == 0`.

4. **Optimization:** Instead of checking each number against each mask (O(n × 65536)), we can precompute for each number which masks it's compatible with. But there's an even better approach: for each mask, we can find all numbers that are compatible using bitwise complement logic.

5. **Final calculation:** For each mask `m` with frequency `freq[m]`, count how many numbers in `nums` satisfy `(num & m) == 0`, multiply by `freq[m]`, and sum all results.

**Why this works:** We're effectively saying: "For every possible AND result of two numbers, how many third numbers would complete a valid triple?" This reduces the problem from O(n³) to O(n² + n × M) where M is the number of possible masks.

## Optimal Solution

Here's the implementation using the optimized approach:

<div class="code-group">

```python
# Time: O(n² + n × M) where M = 65536 (max mask value)
# Space: O(M) for the frequency array
def countTriplets(nums):
    # Maximum possible mask value is 2^16 - 1 = 65535
    MAX_MASK = 1 << 16

    # Step 1: Count frequency of each AND result from pairs
    freq = [0] * MAX_MASK
    n = len(nums)

    # Compute AND for all pairs and count frequencies
    for i in range(n):
        for j in range(n):
            mask = nums[i] & nums[j]
            freq[mask] += 1

    # Step 2: For each mask, count how many numbers are compatible
    result = 0

    # For each possible mask value
    for mask in range(MAX_MASK):
        # Skip masks that no pair produced (optimization)
        if freq[mask] == 0:
            continue

        # For each number in nums, check if it's compatible with this mask
        for num in nums:
            # A number is compatible if it has no 1 bits in common with mask
            if (num & mask) == 0:
                # This (i,j) pair (represented by mask) with this k (num) forms a valid triple
                result += freq[mask]

    return result
```

```javascript
// Time: O(n² + n × M) where M = 65536 (max mask value)
// Space: O(M) for the frequency array
function countTriplets(nums) {
  // Maximum possible mask value is 2^16 - 1 = 65535
  const MAX_MASK = 1 << 16;

  // Step 1: Count frequency of each AND result from pairs
  const freq = new Array(MAX_MASK).fill(0);
  const n = nums.length;

  // Compute AND for all pairs and count frequencies
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const mask = nums[i] & nums[j];
      freq[mask]++;
    }
  }

  // Step 2: For each mask, count how many numbers are compatible
  let result = 0;

  // For each possible mask value
  for (let mask = 0; mask < MAX_MASK; mask++) {
    // Skip masks that no pair produced (optimization)
    if (freq[mask] === 0) {
      continue;
    }

    // For each number in nums, check if it's compatible with this mask
    for (let k = 0; k < n; k++) {
      // A number is compatible if it has no 1 bits in common with mask
      if ((nums[k] & mask) === 0) {
        // This (i,j) pair (represented by mask) with this k (num) forms a valid triple
        result += freq[mask];
      }
    }
  }

  return result;
}
```

```java
// Time: O(n² + n × M) where M = 65536 (max mask value)
// Space: O(M) for the frequency array
public int countTriplets(int[] nums) {
    // Maximum possible mask value is 2^16 - 1 = 65535
    final int MAX_MASK = 1 << 16;

    // Step 1: Count frequency of each AND result from pairs
    int[] freq = new int[MAX_MASK];
    int n = nums.length;

    // Compute AND for all pairs and count frequencies
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            int mask = nums[i] & nums[j];
            freq[mask]++;
        }
    }

    // Step 2: For each mask, count how many numbers are compatible
    int result = 0;

    // For each possible mask value
    for (int mask = 0; mask < MAX_MASK; mask++) {
        // Skip masks that no pair produced (optimization)
        if (freq[mask] == 0) {
            continue;
        }

        // For each number in nums, check if it's compatible with this mask
        for (int k = 0; k < n; k++) {
            // A number is compatible if it has no 1 bits in common with mask
            if ((nums[k] & mask) == 0) {
                // This (i,j) pair (represented by mask) with this k (num) forms a valid triple
                result += freq[mask];
            }
        }
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n² + n × M)

- The first nested loop to compute pair AND frequencies takes O(n²) time
- The second phase iterates through M possible masks (65536) and for each non-zero mask, checks all n numbers, giving O(n × M) in worst case
- In practice, many masks have frequency 0, so we skip them, making it faster

**Space Complexity:** O(M)

- We need an array of size M = 65536 to store frequencies of mask values
- This is constant space relative to input size since M is fixed

**Why this is acceptable:** With n ≤ 1000, n² = 1,000,000 operations is fine. The n × M factor is 1000 × 65536 = 65,536,000 operations, which is also acceptable. Total operations are around 66 million, much better than 1 billion.

## Common Mistakes

1. **Forgetting that indices can be equal:** The problem allows i, j, k to be the same index. Some candidates mistakenly think they need distinct indices, which would require a different approach.

2. **Incorrect mask size:** Using 2³² instead of 2¹⁶ for the frequency array. The problem constraints say nums[i] ≤ 2¹⁶, so masks are at most 16 bits. Using 2³² would waste memory and time.

3. **Not skipping zero-frequency masks:** Checking all 65536 masks against all n numbers even when freq[mask] = 0 wastes time. Always check if freq[mask] > 0 before the inner loop.

4. **Misunderstanding bitwise AND properties:** Some candidates try to use XOR or OR properties instead. Remember: `a & b & c == 0` means for every bit position, at least one of a, b, c has 0 in that position.

## When You'll See This Pattern

This "precompute pair results then find compatible third elements" pattern appears in several problems:

1. **3Sum (LeetCode 15)** - Similar triple counting problem, but with sum instead of bitwise AND. The optimized solution often uses sorting and two pointers.

2. **Count Triplets That Can Form Two Arrays of Equal XOR (LeetCode 1442)** - Uses prefix XOR and counting frequencies, similar to how we count AND frequencies here.

3. **Number of Valid Words for Each Puzzle (LeetCode 1178)** - Uses bitmask representation and compatibility checking, similar to our mask compatibility check.

The core pattern is: when you need to count triples satisfying some condition, consider if you can precompute results for pairs and then efficiently find compatible third elements.

## Key Takeaways

1. **Bitmask frequency counting** is a powerful technique when dealing with bitwise operations and limited possible values (2¹⁶ in this case).

2. **Break complex conditions into parts:** Instead of checking all triples directly, we broke the condition `a & b & c == 0` into: find all `a & b`, then find all `c` compatible with that result.

3. **Look for fixed bounds:** The constraint that numbers are ≤ 2¹⁶ tells us we can use an array of size 65536 instead of a hash map, which is more efficient.

[Practice this problem on CodeJeet](/problem/triples-with-bitwise-and-equal-to-zero)
