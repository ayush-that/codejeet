---
title: "How to Solve Find the Maximum Sequence Value of Array — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Maximum Sequence Value of Array. Hard difficulty, 21.2% acceptance rate. Topics: Array, Dynamic Programming, Bit Manipulation."
date: "2026-08-18"
category: "dsa-patterns"
tags:
  [
    "find-the-maximum-sequence-value-of-array",
    "array",
    "dynamic-programming",
    "bit-manipulation",
    "hard",
  ]
---

# How to Solve Find the Maximum Sequence Value of Array

This problem asks us to find the maximum value of a specific bitwise expression over all subsequences of an array. The tricky part is that we're dealing with subsequences (not subarrays), and the value depends on splitting the subsequence into two halves, computing the OR of each half, then XORing those results. The combination of subsequence selection, bitwise operations, and the need to maximize a complex expression makes this a challenging optimization problem.

## Visual Walkthrough

Let's walk through a small example to understand the problem mechanics. Suppose `nums = [1, 2, 3, 4]` and `k = 2`.

We need to consider subsequences of size `2 * x` where `x ≥ k`. Since `k = 2`, the smallest subsequence we can consider has size 4 (`2 * 2`).

Let's examine one possible subsequence: `[1, 2, 3, 4]` (the entire array). For this sequence:

- First half: `[1, 2]` → OR = `1 | 2 = 3` (binary: `01 | 10 = 11`)
- Second half: `[3, 4]` → OR = `3 | 4 = 7` (binary: `011 | 100 = 111`)
- Value: `3 XOR 7 = 4` (binary: `011 XOR 111 = 100`)

Now consider another subsequence: `[2, 3, 4]` (size 3). This is invalid because size must be even (`2 * x`).

What about `[1, 4]` (size 2)? This is also invalid because `x = 1`, but we need `x ≥ k = 2`.

The key insight is that we need to find the best way to split elements between the two halves to maximize the XOR of their ORs. The OR operation tends to set bits, while XOR highlights differences between the two halves.

## Brute Force Approach

The most straightforward approach would be to:

1. Generate all possible subsequences of the array
2. For each subsequence of even length `2 * x` where `x ≥ k`
3. Split it into two halves of equal size
4. Compute the OR of each half
5. Compute the XOR of the two ORs
6. Track the maximum value

However, this approach is extremely inefficient. With `n` elements, there are `2^n` possible subsequences. For each valid subsequence, we need to compute ORs and XOR, making the overall complexity exponential.

Even if we try to optimize by only considering subsequences of certain sizes, the number of combinations is still enormous for typical constraints (n up to 1000).

<div class="code-group">

```python
# Brute force solution - too slow for practical use
# Time: O(2^n * n) | Space: O(n)
def maxSequenceValueBruteForce(nums, k):
    n = len(nums)
    max_val = 0

    # Generate all subsequences using bitmask
    for mask in range(1 << n):
        subsequence = []
        # Build the subsequence from the mask
        for i in range(n):
            if mask & (1 << i):
                subsequence.append(nums[i])

        length = len(subsequence)
        # Check if length is valid: even and x ≥ k
        if length % 2 == 0 and length // 2 >= k:
            x = length // 2
            # Compute OR of first half
            or1 = 0
            for i in range(x):
                or1 |= subsequence[i]

            # Compute OR of second half
            or2 = 0
            for i in range(x, length):
                or2 |= subsequence[i]

            # Compute value and update max
            value = or1 ^ or2
            max_val = max(max_val, value)

    return max_val
```

```javascript
// Brute force solution - too slow for practical use
// Time: O(2^n * n) | Space: O(n)
function maxSequenceValueBruteForce(nums, k) {
  const n = nums.length;
  let maxVal = 0;

  // Generate all subsequences using bitmask
  for (let mask = 1; mask < 1 << n; mask++) {
    const subsequence = [];
    // Build the subsequence from the mask
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        subsequence.push(nums[i]);
      }
    }

    const length = subsequence.length;
    // Check if length is valid: even and x ≥ k
    if (length % 2 === 0 && length / 2 >= k) {
      const x = length / 2;
      // Compute OR of first half
      let or1 = 0;
      for (let i = 0; i < x; i++) {
        or1 |= subsequence[i];
      }

      // Compute OR of second half
      let or2 = 0;
      for (let i = x; i < length; i++) {
        or2 |= subsequence[i];
      }

      // Compute value and update max
      const value = or1 ^ or2;
      maxVal = Math.max(maxVal, value);
    }
  }

  return maxVal;
}
```

```java
// Brute force solution - too slow for practical use
// Time: O(2^n * n) | Space: O(n)
public int maxSequenceValueBruteForce(int[] nums, int k) {
    int n = nums.length;
    int maxVal = 0;

    // Generate all subsequences using bitmask
    for (int mask = 1; mask < (1 << n); mask++) {
        List<Integer> subsequence = new ArrayList<>();
        // Build the subsequence from the mask
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                subsequence.add(nums[i]);
            }
        }

        int length = subsequence.size();
        // Check if length is valid: even and x ≥ k
        if (length % 2 == 0 && length / 2 >= k) {
            int x = length / 2;
            // Compute OR of first half
            int or1 = 0;
            for (int i = 0; i < x; i++) {
                or1 |= subsequence.get(i);
            }

            // Compute OR of second half
            int or2 = 0;
            for (int i = x; i < length; i++) {
                or2 |= subsequence.get(i);
            }

            // Compute value and update max
            int value = or1 ^ or2;
            maxVal = Math.max(maxVal, value);
        }
    }

    return maxVal;
}
```

</div>

This brute force approach is clearly infeasible for anything beyond very small inputs (n ≤ 20). We need a smarter approach.

## Optimized Approach

The key insight is that we can think about this problem bit by bit. For each bit position (from most significant to least significant), we want to determine if we can achieve a value with that bit set.

Consider what it means for the result to have a particular bit set. The XOR of two numbers has a bit set if exactly one of the two numbers has that bit set. So for bit position `b`, we want:

- The OR of the first half to have bit `b` set
- The OR of the second half to NOT have bit `b` set
- OR vice versa

This leads to a greedy approach: starting from the most significant bit, try to see if we can construct a subsequence that gives us a result with that bit set. If we can, we keep that bit in our answer and move to the next bit, but now we require that the solution also satisfies the bits we've already chosen.

The construction problem becomes: can we select a subsequence of even length `2 * x` where `x ≥ k` such that:

1. For bits we want to be 1 in the final answer, exactly one of the two halves has all those bits set in its OR
2. For bits we don't care about (lower bits we haven't processed yet), anything is allowed

We can solve this construction problem using dynamic programming. Let `dp[i][mask]` represent whether we can achieve OR value `mask` using exactly `i` elements from the array. However, this would be too slow for the constraints.

A better approach is to use meet-in-the-middle or bitmask DP with pruning. Since the maximum value in the array determines the maximum number of bits we need to consider (up to 20 bits for values up to 10^6), we can work with bitmasks efficiently.

## Optimal Solution

The optimal solution uses a greedy approach combined with feasibility checking. For each bit from most significant to least significant, we check if we can achieve a result with that bit set while preserving all higher bits we've already chosen.

<div class="code-group">

```python
# Optimal solution using greedy bit-by-bit construction
# Time: O(n * B * 2^B) where B is number of bits (max 20) | Space: O(2^B)
def maxSequenceValue(nums, k):
    # First, collect all possible OR values we can get from subsequences
    # and the minimum size needed to achieve each OR value
    from collections import defaultdict

    n = len(nums)

    # We only need to consider up to 20 bits (since nums[i] <= 10^6)
    MAX_BITS = 20

    # For each OR mask, store the minimum number of elements needed
    # to achieve that OR value
    min_size = defaultdict(lambda: float('inf'))

    # Initialize with empty subsequence
    min_size[0] = 0

    # Process each number
    for num in nums:
        # We need to iterate over a copy because we'll be modifying the dict
        items = list(min_size.items())
        for mask, size in items:
            new_mask = mask | num
            new_size = size + 1
            # Update if we found a smaller size for this mask
            if new_size < min_size[new_mask]:
                min_size[new_mask] = new_size

    # Now, we try to build the answer bit by bit
    answer = 0

    # Try from most significant bit to least significant
    for bit in range(MAX_BITS - 1, -1, -1):
        # Try setting this bit in the answer
        candidate = answer | (1 << bit)

        # Check if we can achieve this candidate value
        # We need to find two masks m1 and m2 such that:
        # 1. m1 XOR m2 has all the bits in candidate set
        # 2. We can achieve m1 with size x1 and m2 with size x2
        # 3. x1 = x2 ≥ k

        possible = False

        # Iterate through all possible masks for the first half
        for m1, size1 in min_size.items():
            if size1 < k:
                continue  # First half too small

            # What should m2 be to get the candidate value?
            # We need: m1 XOR m2 = candidate
            # So: m2 = m1 XOR candidate
            m2 = m1 ^ candidate

            if m2 in min_size and min_size[m2] >= k:
                # Check if we can have equal sizes
                # We need total size = size1 + size2 to be even
                # and each half to have at least k elements
                size2 = min_size[m2]

                # We can potentially adjust sizes by adding elements
                # that don't change the OR value (elements with 0 bits
                # in positions where we already have bits set)

                # The key insight: if we have masks m1 and m2 that work,
                # we can always add "dummy" elements (0 or elements that
                # don't add new bits) to make the halves equal in size
                # as long as we have enough total elements

                # Minimum total size needed
                min_total = max(size1, size2) * 2

                # Check if we can achieve this total
                # We need to find if there's a mask that can be achieved
                # with the required size
                found = False
                for total_mask, total_size in min_size.items():
                    if total_size >= min_total:
                        # Check if this mask contains all bits from m1 and m2
                        if (total_mask & m1) == m1 and (total_mask & m2) == m2:
                            found = True
                            break

                if found:
                    possible = True
                    break

        if possible:
            answer = candidate

    return answer
```

```javascript
// Optimal solution using greedy bit-by-bit construction
// Time: O(n * B * 2^B) where B is number of bits (max 20) | Space: O(2^B)
function maxSequenceValue(nums, k) {
  // First, collect all possible OR values we can get from subsequences
  // and the minimum size needed to achieve each OR value
  const n = nums.length;
  const MAX_BITS = 20;

  // Map from OR mask to minimum size needed
  const minSize = new Map();

  // Initialize with empty subsequence
  minSize.set(0, 0);

  // Process each number
  for (const num of nums) {
    // We need to iterate over a copy because we'll be modifying the map
    const entries = Array.from(minSize.entries());
    for (const [mask, size] of entries) {
      const newMask = mask | num;
      const newSize = size + 1;

      // Update if we found a smaller size for this mask
      if (!minSize.has(newMask) || newSize < minSize.get(newMask)) {
        minSize.set(newMask, newSize);
      }
    }
  }

  // Now, we try to build the answer bit by bit
  let answer = 0;

  // Try from most significant bit to least significant
  for (let bit = MAX_BITS - 1; bit >= 0; bit--) {
    // Try setting this bit in the answer
    const candidate = answer | (1 << bit);

    // Check if we can achieve this candidate value
    let possible = false;

    // Iterate through all possible masks for the first half
    for (const [m1, size1] of minSize.entries()) {
      if (size1 < k) continue; // First half too small

      // What should m2 be to get the candidate value?
      // We need: m1 XOR m2 = candidate
      // So: m2 = m1 XOR candidate
      const m2 = m1 ^ candidate;

      if (minSize.has(m2) && minSize.get(m2) >= k) {
        const size2 = minSize.get(m2);

        // Minimum total size needed
        const minTotal = Math.max(size1, size2) * 2;

        // Check if we can achieve this total
        let found = false;
        for (const [totalMask, totalSize] of minSize.entries()) {
          if (totalSize >= minTotal) {
            // Check if this mask contains all bits from m1 and m2
            if ((totalMask & m1) === m1 && (totalMask & m2) === m2) {
              found = true;
              break;
            }
          }
        }

        if (found) {
          possible = true;
          break;
        }
      }
    }

    if (possible) {
      answer = candidate;
    }
  }

  return answer;
}
```

```java
// Optimal solution using greedy bit-by-bit construction
// Time: O(n * B * 2^B) where B is number of bits (max 20) | Space: O(2^B)
public int maxSequenceValue(int[] nums, int k) {
    int n = nums.length;
    final int MAX_BITS = 20;

    // Map from OR mask to minimum size needed
    Map<Integer, Integer> minSize = new HashMap<>();

    // Initialize with empty subsequence
    minSize.put(0, 0);

    // Process each number
    for (int num : nums) {
        // We need to iterate over a copy because we'll be modifying the map
        List<Map.Entry<Integer, Integer>> entries = new ArrayList<>(minSize.entrySet());
        for (Map.Entry<Integer, Integer> entry : entries) {
            int mask = entry.getKey();
            int size = entry.getValue();

            int newMask = mask | num;
            int newSize = size + 1;

            // Update if we found a smaller size for this mask
            if (!minSize.containsKey(newMask) || newSize < minSize.get(newMask)) {
                minSize.put(newMask, newSize);
            }
        }
    }

    // Now, we try to build the answer bit by bit
    int answer = 0;

    // Try from most significant bit to least significant
    for (int bit = MAX_BITS - 1; bit >= 0; bit--) {
        // Try setting this bit in the answer
        int candidate = answer | (1 << bit);

        // Check if we can achieve this candidate value
        boolean possible = false;

        // Iterate through all possible masks for the first half
        for (Map.Entry<Integer, Integer> entry : minSize.entrySet()) {
            int m1 = entry.getKey();
            int size1 = entry.getValue();

            if (size1 < k) continue;  // First half too small

            // What should m2 be to get the candidate value?
            // We need: m1 XOR m2 = candidate
            // So: m2 = m1 XOR candidate
            int m2 = m1 ^ candidate;

            if (minSize.containsKey(m2) && minSize.get(m2) >= k) {
                int size2 = minSize.get(m2);

                // Minimum total size needed
                int minTotal = Math.max(size1, size2) * 2;

                // Check if we can achieve this total
                boolean found = false;
                for (Map.Entry<Integer, Integer> totalEntry : minSize.entrySet()) {
                    int totalMask = totalEntry.getKey();
                    int totalSize = totalEntry.getValue();

                    if (totalSize >= minTotal) {
                        // Check if this mask contains all bits from m1 and m2
                        if ((totalMask & m1) == m1 && (totalMask & m2) == m2) {
                            found = true;
                            break;
                        }
                    }
                }

                if (found) {
                    possible = true;
                    break;
                }
            }
        }

        if (possible) {
            answer = candidate;
        }
    }

    return answer;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n _ B _ 2^B), where:

- `n` is the length of the input array
- `B` is the number of bits we need to consider (at most 20 for values ≤ 10^6)
- We process each of the `n` elements to build the `minSize` map
- For each bit position, we iterate through up to 2^B masks
- In practice, this is manageable because 2^20 ≈ 1 million operations

**Space Complexity:** O(2^B) for storing the `minSize` map, which in the worst case contains an entry for every possible OR mask (up to 2^B).

The key factor that makes this solution efficient is that `B` is limited by the maximum value in the array, which is at most 20 bits for the given constraints.

## Common Mistakes

1. **Not handling the minimum size constraint properly:** Candidates often forget that each half must have at least `k` elements. This affects both the feasibility check and the DP state.

2. **Confusing subsequences with subarrays:** The problem asks for subsequences (which can skip elements), not subarrays (which must be contiguous). This significantly changes the approach needed.

3. **Trying to brute force all subsequences:** With n up to 1000, there are 2^1000 possible subsequences, which is astronomically large. Any solution that enumerates all subsequences will time out.

4. **Not considering the greedy bit-by-bit approach:** Many candidates try to directly maximize the expression without realizing they can build the answer bit by bit from most significant to least significant.

5. **Forgetting that halves must be equal in size:** The sequence must have size `2 * x`, meaning both halves must have exactly `x` elements. Some solutions allow halves of different sizes.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Bitmask DP with greedy bit construction:** Similar to problems where you build an answer bit by bit, checking feasibility at each step. This pattern appears in problems like:
   - "Maximum XOR of Two Numbers in an Array" (LeetCode 421)
   - "Find Maximum Number of String Pairs" (LeetCode 2741) - though simpler

2. **OR value enumeration:** The technique of enumerating all possible OR values of subsequences appears in:
   - "Bitwise ORs of Subarrays" (LeetCode 898) - which asks for the number of distinct OR values of all subarrays

3. **Meet-in-the-middle for optimization problems:** While not exactly meet-in-the-middle, the idea of considering two halves separately is a common optimization pattern for hard problems.

## Key Takeaways

1. **When dealing with bitwise operations and maximization, consider building the answer bit by bit from most significant to least significant.** This greedy approach often works because higher bits contribute more to the value.

2. **For subsequence problems with bitwise operations, enumerate all possible results rather than all subsequences.** The number of distinct OR values is often much smaller than the number of subsequences.

3. **Always check constraints carefully.** The fact that array values are limited to 10^6 (20 bits) is crucial for making the bitmask approach feasible.

4. **When a problem has complex constraints (like equal-sized halves with minimum size), break it down into feasibility checking.** Instead of trying to directly find the maximum, check if a candidate value is achievable.

Related problems: [Bitwise ORs of Subarrays](/problem/bitwise-ors-of-subarrays)
