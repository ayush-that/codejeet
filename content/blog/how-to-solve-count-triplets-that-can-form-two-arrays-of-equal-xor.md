---
title: "How to Solve Count Triplets That Can Form Two Arrays of Equal XOR — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count Triplets That Can Form Two Arrays of Equal XOR. Medium difficulty, 84.8% acceptance rate. Topics: Array, Hash Table, Math, Bit Manipulation, Prefix Sum."
date: "2026-10-30"
category: "dsa-patterns"
tags:
  ["count-triplets-that-can-form-two-arrays-of-equal-xor", "array", "hash-table", "math", "medium"]
---

# How to Solve Count Triplets That Can Form Two Arrays of Equal XOR

We need to count triplets of indices `(i, j, k)` where `0 <= i < j <= k < arr.length` such that the XOR of elements from `i` to `j-1` equals the XOR of elements from `j` to `k`. This problem is interesting because it looks like it requires O(n³) time to check all triplets, but with XOR properties and prefix sums, we can solve it in O(n) time.

## Visual Walkthrough

Let's trace through a small example: `arr = [2, 3, 1, 6, 7]`.

We want to find `(i, j, k)` where:

- `a = arr[i] ^ arr[i+1] ^ ... ^ arr[j-1]`
- `b = arr[j] ^ arr[j+1] ^ ... ^ arr[k]`
- `a == b`

**Key Insight**: If `a == b`, then `a ^ b == 0`. But `a ^ b` is just the XOR of the entire segment from `i` to `k`! Let's verify:

`a ^ b = (arr[i]^...^arr[j-1]) ^ (arr[j]^...^arr[k]) = arr[i]^...^arr[k]`

So the condition `a == b` is equivalent to `arr[i] ^ ... ^ arr[k] == 0`.

Let's check some segments:

- `i=0, k=2`: `2 ^ 3 ^ 1 = 0` ✓ This means any `j` between `i+1` and `k` will work!
  - For `j=1`: `a=2`, `b=3^1=2` ✓
  - For `j=2`: `a=2^3=1`, `b=1` ✓
  - That's 2 triplets: `(0,1,2)` and `(0,2,2)`
- `i=2, k=4`: `1 ^ 6 ^ 7 = 0` ✓
  - For `j=3`: `a=1`, `b=6^7=1` ✓
  - For `j=4`: `a=1^6=7`, `b=7` ✓
  - That's 2 more triplets: `(2,3,4)` and `(2,4,4)`

So we found 4 triplets total. The pattern is: whenever we find a subarray `[i..k]` with XOR 0, we can choose ANY `j` between `i+1` and `k` (inclusive), giving us `k-i` valid triplets.

## Brute Force Approach

The brute force solution checks all possible `(i, j, k)` triplets:

1. For each `i` from `0` to `n-1`
2. For each `k` from `i` to `n-1`
3. For each `j` from `i+1` to `k`
4. Compute `a` and `b` and check if they're equal

This takes O(n³) time and O(1) space. For `n=300` (typical constraint), that's 27 million operations - too slow!

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def countTriplets_brute(arr):
    n = len(arr)
    count = 0

    for i in range(n):
        for k in range(i, n):
            # Compute XOR from i to k
            total_xor = 0
            for idx in range(i, k + 1):
                total_xor ^= arr[idx]

            # If total XOR is 0, any j between i+1 and k works
            if total_xor == 0:
                count += (k - i)

    return count
```

```javascript
// Time: O(n³) | Space: O(1)
function countTripletsBrute(arr) {
  const n = arr.length;
  let count = 0;

  for (let i = 0; i < n; i++) {
    for (let k = i; k < n; k++) {
      // Compute XOR from i to k
      let totalXor = 0;
      for (let idx = i; idx <= k; idx++) {
        totalXor ^= arr[idx];
      }

      // If total XOR is 0, any j between i+1 and k works
      if (totalXor === 0) {
        count += k - i;
      }
    }
  }

  return count;
}
```

```java
// Time: O(n³) | Space: O(1)
public int countTripletsBrute(int[] arr) {
    int n = arr.length;
    int count = 0;

    for (int i = 0; i < n; i++) {
        for (int k = i; k < n; k++) {
            // Compute XOR from i to k
            int totalXor = 0;
            for (int idx = i; idx <= k; idx++) {
                totalXor ^= arr[idx];
            }

            // If total XOR is 0, any j between i+1 and k works
            if (totalXor == 0) {
                count += (k - i);
            }
        }
    }

    return count;
}
```

</div>

## Optimized Approach

The key insight is that `a == b` if and only if `arr[i] ^ ... ^ arr[k] == 0`. So we need to find all subarrays with XOR 0.

**Prefix XOR Trick**: Let `prefix[i] = arr[0] ^ arr[1] ^ ... ^ arr[i-1]`. Then:

- `arr[i] ^ ... ^ arr[k] = prefix[k+1] ^ prefix[i]`

Why? Because `prefix[k+1]` contains XOR of first `k+1` elements, and `prefix[i]` contains XOR of first `i` elements. XORing them cancels out the common prefix.

So `arr[i] ^ ... ^ arr[k] == 0` means `prefix[k+1] == prefix[i]`.

**Counting Triplets**: If `prefix[k+1] == prefix[i]`, then for ANY `j` where `i < j <= k`, we have a valid triplet. How many such `j`? There are `k-i` choices.

But we can do better: If we've seen the same prefix value `m` times before at indices `i1, i2, ..., im`, then for current index `k`, we can pair it with each previous index `i` to get `(k - i)` triplets. Summing over all previous occurrences gives us the count.

Wait, we can optimize further! Let's say we have prefix value `x` appearing at indices `p1, p2, p3, ..., pm`. For current index `k`:

- With `p1`: `k - p1` triplets
- With `p2`: `k - p2` triplets
- ...
- With `pm`: `k - pm` triplets

Total = `m*k - (p1 + p2 + ... + pm)`

So we need to track:

1. `count[x]`: How many times we've seen prefix value `x`
2. `sum[x]`: Sum of indices where we've seen prefix value `x`

## Optimal Solution

We iterate through the array, maintaining the current prefix XOR. For each position `k`:

1. If we've seen the current prefix before `m` times at indices summing to `total`, we add `m*k - total` to our answer
2. Update our maps with the current prefix and index `k`

Note: We need to initialize with prefix 0 at "index -1" (or index 0 in 1-based indexing) because an empty prefix has XOR 0.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def countTriplets(arr):
    """
    Counts triplets (i, j, k) where XOR from i to j-1 equals XOR from j to k.

    The key insight: a == b if and only if XOR from i to k is 0.
    If prefix[k+1] == prefix[i], then for any j between i+1 and k,
    we have a valid triplet.
    """
    n = len(arr)
    count = 0
    prefix_xor = 0

    # Maps to store frequency and sum of indices for each prefix XOR value
    # freq[x] = how many times we've seen prefix XOR x
    # index_sum[x] = sum of indices where we've seen prefix XOR x
    freq = {0: 1}  # Initialize: prefix XOR 0 at "index -1"
    index_sum = {0: 0}  # For prefix 0, we consider it at index -1, but we'll handle as 0

    for k in range(n):
        # Update current prefix XOR
        prefix_xor ^= arr[k]

        # If we've seen this prefix XOR before, we found subarrays with XOR 0
        if prefix_xor in freq:
            # For each previous occurrence at index i, we get (k - i) triplets
            # Sum over all previous occurrences: m * k - sum_of_indices
            m = freq[prefix_xor]
            total_indices = index_sum[prefix_xor]
            count += m * k - total_indices

        # Update the maps with current prefix XOR at index k
        # Note: We store k+1 because prefix[k+1] corresponds to XOR up to index k
        freq[prefix_xor] = freq.get(prefix_xor, 0) + 1
        index_sum[prefix_xor] = index_sum.get(prefix_xor, 0) + (k + 1)

    return count
```

```javascript
// Time: O(n) | Space: O(n)
function countTriplets(arr) {
  /**
   * Counts triplets (i, j, k) where XOR from i to j-1 equals XOR from j to k.
   *
   * The key insight: a == b if and only if XOR from i to k is 0.
   * If prefix[k+1] == prefix[i], then for any j between i+1 and k,
   * we have a valid triplet.
   */
  const n = arr.length;
  let count = 0;
  let prefixXor = 0;

  // Maps to store frequency and sum of indices for each prefix XOR value
  const freq = new Map();
  const indexSum = new Map();

  // Initialize: prefix XOR 0 at "index -1" (treated as index 0 for calculation)
  freq.set(0, 1);
  indexSum.set(0, 0);

  for (let k = 0; k < n; k++) {
    // Update current prefix XOR
    prefixXor ^= arr[k];

    // If we've seen this prefix XOR before, we found subarrays with XOR 0
    if (freq.has(prefixXor)) {
      // For each previous occurrence at index i, we get (k - i) triplets
      // Sum over all previous occurrences: m * k - sum_of_indices
      const m = freq.get(prefixXor);
      const totalIndices = indexSum.get(prefixXor);
      count += m * k - totalIndices;
    }

    // Update the maps with current prefix XOR at index k
    // Note: We store k+1 because prefix[k+1] corresponds to XOR up to index k
    freq.set(prefixXor, (freq.get(prefixXor) || 0) + 1);
    indexSum.set(prefixXor, (indexSum.get(prefixXor) || 0) + (k + 1));
  }

  return count;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.HashMap;
import java.util.Map;

public int countTriplets(int[] arr) {
    /**
     * Counts triplets (i, j, k) where XOR from i to j-1 equals XOR from j to k.
     *
     * The key insight: a == b if and only if XOR from i to k is 0.
     * If prefix[k+1] == prefix[i], then for any j between i+1 and k,
     * we have a valid triplet.
     */
    int n = arr.length;
    int count = 0;
    int prefixXor = 0;

    // Maps to store frequency and sum of indices for each prefix XOR value
    Map<Integer, Integer> freq = new HashMap<>();
    Map<Integer, Integer> indexSum = new HashMap<>();

    // Initialize: prefix XOR 0 at "index -1" (treated as index 0 for calculation)
    freq.put(0, 1);
    indexSum.put(0, 0);

    for (int k = 0; k < n; k++) {
        // Update current prefix XOR
        prefixXor ^= arr[k];

        // If we've seen this prefix XOR before, we found subarrays with XOR 0
        if (freq.containsKey(prefixXor)) {
            // For each previous occurrence at index i, we get (k - i) triplets
            // Sum over all previous occurrences: m * k - sum_of_indices
            int m = freq.get(prefixXor);
            int totalIndices = indexSum.get(prefixXor);
            count += m * k - totalIndices;
        }

        // Update the maps with current prefix XOR at index k
        // Note: We store k+1 because prefix[k+1] corresponds to XOR up to index k
        freq.put(prefixXor, freq.getOrDefault(prefixXor, 0) + 1);
        indexSum.put(prefixXor, indexSum.getOrDefault(prefixXor, 0) + (k + 1));
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n)

- We make a single pass through the array
- Each iteration does O(1) map operations (HashMap operations are O(1) on average)

**Space Complexity**: O(n)

- In the worst case, all prefix XOR values are distinct, so we store O(n) entries in our maps
- Even with collisions, we still need O(n) space for the maps

## Common Mistakes

1. **Forgetting to initialize prefix 0**: The empty prefix (before any elements) has XOR 0. If you don't initialize `freq[0] = 1`, you'll miss subarrays starting at index 0 that have XOR 0.

2. **Off-by-one with indices**: Remember that `prefix[k]` means XOR of first `k` elements (indices 0 to k-1). So when we compute `arr[i] ^ ... ^ arr[k] = prefix[k+1] ^ prefix[i]`. Many candidates get confused about whether to use `k` or `k+1`.

3. **Not understanding the triplet count formula**: When `prefix[k+1] == prefix[i]`, there are `k-i` valid `j` values (from `i+1` to `k`). Some candidates mistakenly think there's only 1 valid `j` or count incorrectly.

4. **Using O(n²) approach when O(n) is possible**: Some candidates realize they need to find subarrays with XOR 0, but then use nested loops to find all pairs `(i, k)` with equal prefix XOR, resulting in O(n²) time. The hash map optimization is crucial for O(n).

## When You'll See This Pattern

This problem combines two important patterns:

1. **Prefix XOR/Sum**: Like prefix sums but with XOR. Used when you need to compute range XOR queries efficiently.
   - Related: [Find The Original Array of Prefix Xor](https://leetcode.com/problems/find-the-original-array-of-prefix-xor/) - Direct application of prefix XOR
   - Related: [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/) - Same pattern but with sum instead of XOR

2. **Counting subarrays with certain property**: Using hash maps to count occurrences of prefix values.
   - Related: [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/) - Similar counting technique
   - Related: [Binary Subarrays With Sum](https://leetcode.com/problems/binary-subarrays-with-sum/) - Same pattern for binary arrays

## Key Takeaways

1. **XOR properties are powerful**: `a == b ⇔ a ^ b == 0`. This transforms an equality check into a zero check, which is often easier to work with.

2. **Prefix technique works for XOR too**: Just like prefix sums help with range sum queries, prefix XOR helps with range XOR queries. `arr[i]^...^arr[k] = prefix[k+1] ^ prefix[i]`.

3. **When counting pairs/triplets with certain conditions, think about what you need to store**: Here we needed both frequency and sum of indices for each prefix value to compute the count efficiently in O(1) per element.

Related problems: [Find The Original Array of Prefix Xor](/problem/find-the-original-array-of-prefix-xor)
