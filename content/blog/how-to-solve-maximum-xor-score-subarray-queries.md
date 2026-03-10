---
title: "How to Solve Maximum XOR Score Subarray Queries — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Maximum XOR Score Subarray Queries. Hard difficulty, 43.7% acceptance rate. Topics: Array, Dynamic Programming."
date: "2026-08-22"
category: "dsa-patterns"
tags: ["maximum-xor-score-subarray-queries", "array", "dynamic-programming", "hard"]
---

# How to Solve Maximum XOR Score Subarray Queries

This problem asks us to find, for each query `[l, r]`, the maximum XOR score of any subarray within `nums[l..r]`. The XOR score is computed by repeatedly XOR-ing adjacent elements until only one number remains. What makes this problem tricky is that the XOR score of a subarray isn't simply the XOR of all elements—it's a more complex operation that depends on the subarray's length and structure.

## Visual Walkthrough

Let's understand the XOR score with an example. Given `nums = [2, 7, 11, 15]`:

For subarray `[2, 7, 11]`:

- Step 1: XOR adjacent elements: `2^7 = 5`, `7^11 = 12` → `[5, 12]`
- Step 2: XOR adjacent elements: `5^12 = 9` → `[9]`
- XOR score = 9

For subarray `[7, 11, 15]`:

- Step 1: `7^11 = 12`, `11^15 = 4` → `[12, 4]`
- Step 2: `12^4 = 8` → `[8]`
- XOR score = 8

Now consider a query `[0, 3]` (the whole array). We need to check all possible subarrays:

- `[2]`: score = 2
- `[7]`: score = 7
- `[11]`: score = 11
- `[15]`: score = 15
- `[2,7]`: `2^7 = 5`
- `[7,11]`: `7^11 = 12`
- `[11,15]`: `11^15 = 4`
- `[2,7,11]`: 9 (as calculated)
- `[7,11,15]`: 8 (as calculated)
- `[2,7,11,15]`:
  - Step 1: `2^7=5`, `7^11=12`, `11^15=4` → `[5,12,4]`
  - Step 2: `5^12=9`, `12^4=8` → `[9,8]`
  - Step 3: `9^8=1` → `[1]`
  - Score = 1

Maximum XOR score = 15 (from subarray `[15]`).

The key insight is that the XOR score of a subarray `nums[l..r]` equals the XOR of elements at positions where binomial coefficient `C(r-l, k)` is odd, where `k` is the position offset within the subarray. This is equivalent to checking if `(r-l) & k == k` (bitwise AND).

## Brute Force Approach

A naive solution would be to, for each query, check all possible subarrays within `[l, r]`, compute each subarray's XOR score, and track the maximum. Computing the XOR score for a subarray of length `m` takes O(m²) time using the described process, or O(m) using the binomial coefficient property.

For `n` elements and `q` queries, with maximum query length `n`, this gives O(q × n³) time complexity if we naively compute scores, or O(q × n²) using the binomial property. Both are far too slow for typical constraints where `n` and `q` can be up to 10⁵.

<div class="code-group">

```python
# Time: O(q * n^3) | Space: O(1)
def brute_force(nums, queries):
    results = []

    for l, r in queries:
        max_score = 0
        # Check all subarrays within [l, r]
        for start in range(l, r + 1):
            for end in range(start, r + 1):
                # Compute XOR score for subarray nums[start..end]
                score = 0
                length = end - start
                for k in range(length + 1):
                    # Check if binomial coefficient C(length, k) is odd
                    if (length & k) == k:
                        score ^= nums[start + k]
                max_score = max(max_score, score)
        results.append(max_score)

    return results
```

```javascript
// Time: O(q * n^3) | Space: O(1)
function bruteForce(nums, queries) {
  const results = [];

  for (const [l, r] of queries) {
    let maxScore = 0;
    // Check all subarrays within [l, r]
    for (let start = l; start <= r; start++) {
      for (let end = start; end <= r; end++) {
        // Compute XOR score for subarray nums[start..end]
        let score = 0;
        const length = end - start;
        for (let k = 0; k <= length; k++) {
          // Check if binomial coefficient C(length, k) is odd
          if ((length & k) === k) {
            score ^= nums[start + k];
          }
        }
        maxScore = Math.max(maxScore, score);
      }
    }
    results.push(maxScore);
  }

  return results;
}
```

```java
// Time: O(q * n^3) | Space: O(1)
public int[] bruteForce(int[] nums, int[][] queries) {
    int[] results = new int[queries.length];

    for (int i = 0; i < queries.length; i++) {
        int l = queries[i][0];
        int r = queries[i][1];
        int maxScore = 0;

        // Check all subarrays within [l, r]
        for (int start = l; start <= r; start++) {
            for (int end = start; end <= r; end++) {
                // Compute XOR score for subarray nums[start..end]
                int score = 0;
                int length = end - start;
                for (int k = 0; k <= length; k++) {
                    // Check if binomial coefficient C(length, k) is odd
                    if ((length & k) == k) {
                        score ^= nums[start + k];
                    }
                }
                maxScore = Math.max(maxScore, score);
            }
        }
        results[i] = maxScore;
    }

    return results;
}
```

</div>

## Optimized Approach

The key optimization comes from recognizing that the XOR score of a subarray `nums[l..r]` is simply the XOR of elements where `(r-l) & (i-l) == (i-l)` for position `i` in the subarray. This is equivalent to saying element `nums[i]` contributes to the XOR score if the bitwise AND of `(r-l)` and `(i-l)` equals `(i-l)`.

We can think of this as: for a given length `len = r-l`, we want the maximum XOR of a subset of `nums[l..r]` where we can only include elements whose offset `(i-l)` is a submask of `len`.

For each query, we need to find the maximum XOR we can get by XOR-ing a subset of numbers from `nums[l..r]` where the indices form a submask of `len`. This is similar to finding maximum XOR using a trie, but with constraints on which elements we can choose.

The optimal approach uses dynamic programming with bitmask properties. For each position `i`, we consider all possible lengths `len` and compute the maximum XOR score ending at `i` with that length. The recurrence is based on the observation that if we include `nums[i]` in a subarray ending at `i` with length `len`, then the previous element's offset must be a submask of `len-1`.

## Optimal Solution

We use dynamic programming where `dp[i][mask]` represents the maximum XOR score for subarrays ending at position `i` where the mask represents which offsets from the start of the subarray are included. Since `n` can be large, we optimize by noting that we only need to consider masks that are submasks of `len`, and we can process queries offline.

<div class="code-group">

```python
# Time: O(n * 2^B + q) where B is bits in max length | Space: O(n * 2^B)
def max_xor_score_queries(nums, queries):
    n = len(nums)
    B = n.bit_length()  # Maximum bits needed for length

    # dp[mask] stores maximum XOR for current position with given mask
    dp = [-1] * (1 << B)
    dp[0] = 0  # Empty subarray has XOR 0

    # Preprocess queries: group by right endpoint
    queries_by_right = [[] for _ in range(n)]
    for idx, (l, r) in enumerate(queries):
        queries_by_right[r].append((l, idx))

    results = [0] * len(queries)

    # Process each position as right endpoint
    for r in range(n):
        new_dp = [-1] * (1 << B)

        # For each possible mask from previous position
        for mask in range(1 << B):
            if dp[mask] == -1:
                continue

            # Option 1: Don't include nums[r] (start new subarray at r)
            new_dp[0] = max(new_dp[0], dp[mask])

            # Option 2: Extend existing subarray
            # New mask with nums[r] included at offset = popcount(mask)
            offset = mask.bit_count()
            if offset < B:
                new_mask = mask | (1 << offset)
                new_dp[new_mask] = max(new_dp[new_mask], dp[mask] ^ nums[r])

        # Also consider starting new subarray at r with just nums[r]
        new_dp[1] = max(new_dp[1], nums[r])

        dp = new_dp

        # Answer queries ending at r
        for l, idx in queries_by_right[r]:
            max_score = 0
            length = r - l
            # Check all masks that are submasks of length
            mask = length
            while True:
                if dp[mask] != -1:
                    max_score = max(max_score, dp[mask])
                if mask == 0:
                    break
                mask = (mask - 1) & length
            results[idx] = max_score

    return results
```

```javascript
// Time: O(n * 2^B + q) where B is bits in max length | Space: O(n * 2^B)
function maxXorScoreQueries(nums, queries) {
  const n = nums.length;
  const B = Math.ceil(Math.log2(n + 1)); // Maximum bits needed for length

  // dp[mask] stores maximum XOR for current position with given mask
  let dp = new Array(1 << B).fill(-1);
  dp[0] = 0; // Empty subarray has XOR 0

  // Preprocess queries: group by right endpoint
  const queriesByRight = Array.from({ length: n }, () => []);
  queries.forEach(([l, r], idx) => {
    queriesByRight[r].push([l, idx]);
  });

  const results = new Array(queries.length).fill(0);

  // Helper function to count bits
  function bitCount(x) {
    let count = 0;
    while (x > 0) {
      count += x & 1;
      x >>= 1;
    }
    return count;
  }

  // Process each position as right endpoint
  for (let r = 0; r < n; r++) {
    const newDp = new Array(1 << B).fill(-1);

    // For each possible mask from previous position
    for (let mask = 0; mask < 1 << B; mask++) {
      if (dp[mask] === -1) continue;

      // Option 1: Don't include nums[r] (start new subarray at r)
      newDp[0] = Math.max(newDp[0], dp[mask]);

      // Option 2: Extend existing subarray
      // New mask with nums[r] included at offset = bitCount(mask)
      const offset = bitCount(mask);
      if (offset < B) {
        const newMask = mask | (1 << offset);
        newDp[newMask] = Math.max(newDp[newMask], dp[mask] ^ nums[r]);
      }
    }

    // Also consider starting new subarray at r with just nums[r]
    newDp[1] = Math.max(newDp[1], nums[r]);

    dp = newDp;

    // Answer queries ending at r
    for (const [l, idx] of queriesByRight[r]) {
      let maxScore = 0;
      const length = r - l;
      // Check all masks that are submasks of length
      let mask = length;
      while (true) {
        if (dp[mask] !== -1) {
          maxScore = Math.max(maxScore, dp[mask]);
        }
        if (mask === 0) break;
        mask = (mask - 1) & length;
      }
      results[idx] = maxScore;
    }
  }

  return results;
}
```

```java
// Time: O(n * 2^B + q) where B is bits in max length | Space: O(n * 2^B)
public int[] maxXorScoreQueries(int[] nums, int[][] queries) {
    int n = nums.length;
    int B = Integer.toBinaryString(n).length();  // Maximum bits needed for length

    // dp[mask] stores maximum XOR for current position with given mask
    int[] dp = new int[1 << B];
    Arrays.fill(dp, -1);
    dp[0] = 0;  // Empty subarray has XOR 0

    // Preprocess queries: group by right endpoint
    List<int[]>[] queriesByRight = new List[n];
    for (int i = 0; i < n; i++) {
        queriesByRight[i] = new ArrayList<>();
    }

    for (int i = 0; i < queries.length; i++) {
        int l = queries[i][0];
        int r = queries[i][1];
        queriesByRight[r].add(new int[]{l, i});
    }

    int[] results = new int[queries.length];

    // Process each position as right endpoint
    for (int r = 0; r < n; r++) {
        int[] newDp = new int[1 << B];
        Arrays.fill(newDp, -1);

        // For each possible mask from previous position
        for (int mask = 0; mask < (1 << B); mask++) {
            if (dp[mask] == -1) continue;

            // Option 1: Don't include nums[r] (start new subarray at r)
            newDp[0] = Math.max(newDp[0], dp[mask]);

            // Option 2: Extend existing subarray
            // New mask with nums[r] included at offset = bitCount(mask)
            int offset = Integer.bitCount(mask);
            if (offset < B) {
                int newMask = mask | (1 << offset);
                newDp[newMask] = Math.max(newDp[newMask], dp[mask] ^ nums[r]);
            }
        }

        // Also consider starting new subarray at r with just nums[r]
        newDp[1] = Math.max(newDp[1], nums[r]);

        dp = newDp;

        // Answer queries ending at r
        for (int[] query : queriesByRight[r]) {
            int l = query[0];
            int idx = query[1];
            int maxScore = 0;
            int length = r - l;

            // Check all masks that are submasks of length
            int mask = length;
            while (true) {
                if (dp[mask] != -1) {
                    maxScore = Math.max(maxScore, dp[mask]);
                }
                if (mask == 0) break;
                mask = (mask - 1) & length;
            }
            results[idx] = maxScore;
        }
    }

    return results;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 2ᴮ + q), where B is the number of bits needed to represent the maximum subarray length (B ≈ log₂n). The factor 2ᴮ comes from iterating over all possible masks at each position. For each query, we iterate over submasks of the length, which takes O(2ᴮ) in worst case but is typically much less.

**Space Complexity:** O(2ᴮ) for the DP array, which is O(n) since 2ᴮ ≤ 2n. We also use O(n + q) space for storing queries and results.

The complexity is acceptable for n up to about 10⁵ when B is small (B ≤ 17 for n ≤ 10⁵).

## Common Mistakes

1. **Misunderstanding XOR score computation**: Candidates often think the XOR score is simply the XOR of all elements in the subarray. Remember it's the result of repeatedly XOR-ing adjacent pairs until one element remains.

2. **Not using the binomial coefficient property**: The brute force computation of XOR score is O(m²) for length m. Using the property that element contributes if `(len & offset) == offset` reduces this to O(m).

3. **Incorrect submask iteration**: When iterating over submasks of a number, the pattern `mask = (mask - 1) & length` correctly enumerates all submasks. A common mistake is using `mask--` without the AND, which gives wrong results.

4. **Forgetting to handle empty subarrays**: The empty subarray has XOR score 0, which might be the maximum if all numbers are negative (though XOR doesn't have negatives, similar issues arise with certain bit patterns).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Submask DP**: Similar to problems like "Maximum XOR of Two Numbers in an Array" (LeetCode 421), but with constraints on which elements can be combined.

2. **Offline query processing**: Grouping queries by right endpoint is common in range query problems like "Number of Subarrays with Bounded Maximum" (LeetCode 795).

3. **Binomial coefficient properties via bitwise operations**: The connection between Pascal's triangle parity and bitwise AND appears in problems like "Find XOR Sum of All Pairs Bitwise AND" (LeetCode 1835).

## Key Takeaways

1. **XOR score reduces to subset XOR with offset constraints**: The XOR score of a subarray equals the XOR of elements whose offsets are submasks of the subarray length.

2. **Dynamic programming over masks efficiently handles subset constraints**: When you need to track which elements from a prefix are included, a bitmask DP can often optimize from exponential to manageable complexity.

3. **Offline processing helps with range queries**: When queries can be answered in any order, grouping them by endpoint often enables more efficient incremental computation.

Related problems: [Make the XOR of All Segments Equal to Zero](/problem/make-the-xor-of-all-segments-equal-to-zero)
