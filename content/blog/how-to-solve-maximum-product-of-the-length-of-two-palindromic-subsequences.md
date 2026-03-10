---
title: "How to Solve Maximum Product of the Length of Two Palindromic Subsequences — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Product of the Length of Two Palindromic Subsequences. Medium difficulty, 62.4% acceptance rate. Topics: String, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask."
date: "2028-12-07"
category: "dsa-patterns"
tags:
  [
    "maximum-product-of-the-length-of-two-palindromic-subsequences",
    "string",
    "dynamic-programming",
    "backtracking",
    "medium",
  ]
---

# How to Solve Maximum Product of the Length of Two Palindromic Subsequences

This problem asks us to find two **disjoint palindromic subsequences** in a string `s` that maximize the product of their lengths. Two subsequences are disjoint if they don't share any characters from the same index. What makes this problem tricky is that we need to simultaneously consider two constraints: each subsequence must be a palindrome, and they must be disjoint. The brute force approach would be exponential, but we can optimize using bitmasking and precomputation.

## Visual Walkthrough

Let's trace through an example: `s = "leetcode"`

We need to find two disjoint palindromic subsequences. Let's think about possible choices:

1. First subsequence: "ete" (indices 1,3,4) → length 3
2. Second subsequence: "cdc" (indices 2,5,7) → length 3
   - Product: 3 × 3 = 9

But can we do better? Let's check:

- "leetc" (indices 0,1,2,3,4) isn't a palindrome
- "ee" (indices 1,2) is a palindrome, length 2
- "cdc" (indices 2,5,7) is a palindrome, length 3
  - Product: 2 × 3 = 6 (worse than 9)

Actually, let's try:

- "eee" (indices 1,2,4) isn't a palindrome
- "ete" (indices 1,3,4) is a palindrome, length 3
- "cdc" (indices 2,5,7) is a palindrome, length 3
  - But wait, these share index 2! They're not disjoint.

The key insight: we need to check ALL possible subsequences and find two that don't overlap. For a string of length `n`, there are `2^n` possible subsequences. For `n=8`, that's 256 possibilities. We need to check all pairs of these, which would be `256 × 256 = 65,536` pairs. That's manageable for small `n`, but for `n=12`, it's `4,096 × 4,096 = 16.7 million` pairs. We need a smarter approach.

## Brute Force Approach

The brute force approach would be:

1. Generate all possible subsequences (using bitmasks or recursion)
2. For each subsequence, check if it's a palindrome
3. For each pair of palindromic subsequences, check if they're disjoint (no shared indices)
4. Track the maximum product of lengths

The problem with this approach is the time complexity: `O(2^n × n + 2^(2n))`. For `n=12`, that's about `4,096 × 12 + 16.7M ≈ 16.8M` operations, which might pass but is inefficient. For `n=15`, it's `32,768 × 15 + 1B ≈ 1B` operations, which is too slow.

Here's what the brute force might look like:

<div class="code-group">

```python
# Brute force - too slow for n > 12
def maxProductBrute(s: str) -> int:
    n = len(s)
    max_prod = 0

    # Generate all subsequences
    for mask1 in range(1 << n):
        # Extract subsequence for mask1
        sub1 = []
        for i in range(n):
            if mask1 & (1 << i):
                sub1.append(s[i])

        # Check if it's a palindrome
        if sub1 == sub1[::-1]:
            length1 = len(sub1)

            # Try all other subsequences
            for mask2 in range(1 << n):
                # Check if disjoint
                if mask1 & mask2 == 0:
                    # Extract subsequence for mask2
                    sub2 = []
                    for i in range(n):
                        if mask2 & (1 << i):
                            sub2.append(s[i])

                    # Check if palindrome
                    if sub2 == sub2[::-1]:
                        length2 = len(sub2)
                        max_prod = max(max_prod, length1 * length2)

    return max_prod
```

```javascript
// Brute force - too slow for n > 12
function maxProductBrute(s) {
  const n = s.length;
  let maxProd = 0;

  // Generate all subsequences
  for (let mask1 = 0; mask1 < 1 << n; mask1++) {
    // Extract subsequence for mask1
    const sub1 = [];
    for (let i = 0; i < n; i++) {
      if (mask1 & (1 << i)) {
        sub1.push(s[i]);
      }
    }

    // Check if it's a palindrome
    if (isPalindrome(sub1)) {
      const length1 = sub1.length;

      // Try all other subsequences
      for (let mask2 = 0; mask2 < 1 << n; mask2++) {
        // Check if disjoint
        if ((mask1 & mask2) === 0) {
          // Extract subsequence for mask2
          const sub2 = [];
          for (let i = 0; i < n; i++) {
            if (mask2 & (1 << i)) {
              sub2.push(s[i]);
            }
          }

          // Check if palindrome
          if (isPalindrome(sub2)) {
            const length2 = sub2.length;
            maxProd = Math.max(maxProd, length1 * length2);
          }
        }
      }
    }
  }

  return maxProd;
}

function isPalindrome(arr) {
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    if (arr[left] !== arr[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

```java
// Brute force - too slow for n > 12
public int maxProductBrute(String s) {
    int n = s.length();
    int maxProd = 0;

    // Generate all subsequences
    for (int mask1 = 0; mask1 < (1 << n); mask1++) {
        // Extract subsequence for mask1
        StringBuilder sb1 = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if ((mask1 & (1 << i)) != 0) {
                sb1.append(s.charAt(i));
            }
        }

        // Check if it's a palindrome
        if (isPalindrome(sb1.toString())) {
            int length1 = sb1.length();

            // Try all other subsequences
            for (int mask2 = 0; mask2 < (1 << n); mask2++) {
                // Check if disjoint
                if ((mask1 & mask2) == 0) {
                    // Extract subsequence for mask2
                    StringBuilder sb2 = new StringBuilder();
                    for (int i = 0; i < n; i++) {
                        if ((mask2 & (1 << i)) != 0) {
                            sb2.append(s.charAt(i));
                        }
                    }

                    // Check if palindrome
                    if (isPalindrome(sb2.toString())) {
                        int length2 = sb2.length();
                        maxProd = Math.max(maxProd, length1 * length2);
                    }
                }
            }
        }
    }

    return maxProd;
}

private boolean isPalindrome(String str) {
    int left = 0, right = str.length() - 1;
    while (left < right) {
        if (str.charAt(left) != str.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}
```

</div>

## Optimized Approach

The key insight is that we can:

1. **Precompute** which subsequences (represented as bitmasks) are palindromes
2. For each palindrome mask, store its length
3. For each mask, also compute the **complement mask** (all indices not in the mask)
4. Find the longest palindrome in the complement mask

Why does this work? If we fix one palindrome subsequence (mask1), the other must come from the remaining characters (complement of mask1). We want the longest palindrome in those remaining characters. So for each mask that's a palindrome, we compute:

- `product = length(mask) × longestPalindromeInComplement(mask)`

But how do we quickly find the longest palindrome in a complement mask? We can precompute for every mask, the longest palindrome that's a **subset** of that mask. Then for complement mask `C`, we just look up `dp[C]` where `dp[mask]` stores the longest palindrome length that's a subset of `mask`.

The algorithm:

1. Precompute for all masks `m` (0 to 2^n-1):
   - Check if the subsequence represented by `m` is a palindrome
   - If yes, store `dp[m] = length(m)`
   - If no, `dp[m] = 0`
2. For each mask `m`, compute the longest palindrome that's a subset of `m` using DP over subsets
3. For each palindrome mask `m`, compute complement `comp = ((1<<n)-1) ^ m`
   - Get longest palindrome in complement: `dp[comp]`
   - Update answer: `max(answer, length(m) × dp[comp])`

Step 2 uses subset DP: `dp[mask] = max(dp[mask], dp[submask])` for all `submask ⊆ mask`. This can be done efficiently by iterating over all masks and removing one bit at a time.

## Optimal Solution

Here's the complete optimized solution:

<div class="code-group">

```python
# Time: O(n * 2^n + 3^n) ≈ O(3^n) | Space: O(2^n)
def maxProduct(s: str) -> int:
    n = len(s)
    total_masks = 1 << n  # 2^n possible masks

    # Step 1: Precompute palindrome lengths for all masks
    # dp[mask] = length of palindrome if mask forms a palindrome, else 0
    dp = [0] * total_masks

    for mask in range(1, total_masks):
        # Extract characters for this mask
        chars = []
        for i in range(n):
            if mask & (1 << i):
                chars.append(s[i])

        # Check if it's a palindrome
        is_pal = True
        left, right = 0, len(chars) - 1
        while left < right:
            if chars[left] != chars[right]:
                is_pal = False
                break
            left += 1
            right -= 1

        if is_pal:
            dp[mask] = len(chars)

    # Step 2: For each mask, find the longest palindrome subset
    # This is DP over subsets: dp[mask] = max palindrome length in any subset of mask
    for mask in range(total_masks):
        # Try removing one bit at a time to find better palindromes in subsets
        submask = mask
        while submask > 0:
            # dp[mask] should be max of itself and all its subsets
            dp[mask] = max(dp[mask], dp[submask])
            # Move to next subset (by removing one bit)
            submask = (submask - 1) & mask

    # Step 3: Try all possible first palindrome masks
    # For each palindrome, find best palindrome in complement
    max_prod = 0
    full_mask = total_masks - 1  # mask with all bits set

    for mask in range(1, total_masks):
        if dp[mask] > 0:  # This mask forms a palindrome
            # Complement mask: all indices not in mask
            comp_mask = full_mask ^ mask
            # Best palindrome in complement
            best_comp = dp[comp_mask]
            max_prod = max(max_prod, dp[mask] * best_comp)

    return max_prod
```

```javascript
// Time: O(n * 2^n + 3^n) ≈ O(3^n) | Space: O(2^n)
function maxProduct(s) {
  const n = s.length;
  const totalMasks = 1 << n; // 2^n possible masks

  // Step 1: Precompute palindrome lengths for all masks
  // dp[mask] = length of palindrome if mask forms a palindrome, else 0
  const dp = new Array(totalMasks).fill(0);

  for (let mask = 1; mask < totalMasks; mask++) {
    // Extract characters for this mask
    const chars = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        chars.push(s[i]);
      }
    }

    // Check if it's a palindrome
    let isPal = true;
    let left = 0,
      right = chars.length - 1;
    while (left < right) {
      if (chars[left] !== chars[right]) {
        isPal = false;
        break;
      }
      left++;
      right--;
    }

    if (isPal) {
      dp[mask] = chars.length;
    }
  }

  // Step 2: For each mask, find the longest palindrome subset
  // This is DP over subsets: dp[mask] = max palindrome length in any subset of mask
  for (let mask = 0; mask < totalMasks; mask++) {
    // Try all subsets of mask
    let submask = mask;
    while (submask > 0) {
      // dp[mask] should be max of itself and all its subsets
      dp[mask] = Math.max(dp[mask], dp[submask]);
      // Move to next subset (by removing one bit)
      submask = (submask - 1) & mask;
    }
  }

  // Step 3: Try all possible first palindrome masks
  // For each palindrome, find best palindrome in complement
  let maxProd = 0;
  const fullMask = totalMasks - 1; // mask with all bits set

  for (let mask = 1; mask < totalMasks; mask++) {
    if (dp[mask] > 0) {
      // This mask forms a palindrome
      // Complement mask: all indices not in mask
      const compMask = fullMask ^ mask;
      // Best palindrome in complement
      const bestComp = dp[compMask];
      maxProd = Math.max(maxProd, dp[mask] * bestComp);
    }
  }

  return maxProd;
}
```

```java
// Time: O(n * 2^n + 3^n) ≈ O(3^n) | Space: O(2^n)
public int maxProduct(String s) {
    int n = s.length();
    int totalMasks = 1 << n;  // 2^n possible masks

    // Step 1: Precompute palindrome lengths for all masks
    // dp[mask] = length of palindrome if mask forms a palindrome, else 0
    int[] dp = new int[totalMasks];

    for (int mask = 1; mask < totalMasks; mask++) {
        // Extract characters for this mask
        StringBuilder chars = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                chars.append(s.charAt(i));
            }
        }

        // Check if it's a palindrome
        boolean isPal = true;
        int left = 0, right = chars.length() - 1;
        while (left < right) {
            if (chars.charAt(left) != chars.charAt(right)) {
                isPal = false;
                break;
            }
            left++;
            right--;
        }

        if (isPal) {
            dp[mask] = chars.length();
        }
    }

    // Step 2: For each mask, find the longest palindrome subset
    // This is DP over subsets: dp[mask] = max palindrome length in any subset of mask
    for (int mask = 0; mask < totalMasks; mask++) {
        // Try all subsets of mask
        int submask = mask;
        while (submask > 0) {
            // dp[mask] should be max of itself and all its subsets
            dp[mask] = Math.max(dp[mask], dp[submask]);
            // Move to next subset (by removing one bit)
            submask = (submask - 1) & mask;
        }
    }

    // Step 3: Try all possible first palindrome masks
    // For each palindrome, find best palindrome in complement
    int maxProd = 0;
    int fullMask = totalMasks - 1;  // mask with all bits set

    for (int mask = 1; mask < totalMasks; mask++) {
        if (dp[mask] > 0) {  // This mask forms a palindrome
            // Complement mask: all indices not in mask
            int compMask = fullMask ^ mask;
            // Best palindrome in complement
            int bestComp = dp[compMask];
            maxProd = Math.max(maxProd, dp[mask] * bestComp);
        }
    }

    return maxProd;
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n * 2^n + 3^n)`

Let's break this down:

1. `O(n * 2^n)`: For each of the `2^n` masks, we extract up to `n` characters and check if it's a palindrome (which takes `O(n)` time in worst case).
2. `O(3^n)`: The subset DP step. For each mask, we iterate over all its subsets. The total number of mask-subset pairs is `3^n` (each element can be: not in mask, in mask but not subset, or in subset).

For `n=12`, this is about `12×4096 + 3^12 ≈ 50k + 530k = 580k` operations, much better than the brute force's 16.8M.

**Space Complexity:** `O(2^n)` for the `dp` array storing palindrome lengths for all masks.

## Common Mistakes

1. **Not checking disjointness properly**: Candidates might check if subsequences share characters instead of indices. Remember: "ab" and "ba" from "abba" are disjoint even though they use the same characters, because they use different indices.

2. **Forgetting empty subsequences**: The empty string is technically a palindrome (length 0), but the product would be 0. Our code starts from mask=1 to avoid this, but it's important to consider.

3. **Inefficient subset iteration**: When computing `dp[mask] = max(dp[submask])` for all `submask ⊆ mask`, a naive approach would iterate over all masks and check `if (submask & mask) == submask`. This is `O(4^n)`. The correct way is to use `submask = (submask - 1) & mask` to iterate only over subsets.

4. **Not using bitmask complement correctly**: To get the complement of a mask, use `full_mask ^ mask`, not `~mask`. The `~` operator flips all bits including leading zeros, which gives negative numbers in most languages.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Bitmask DP for subset problems**: When you need to consider all subsets of a set and `n ≤ 20`, bitmasking is often the right approach. Each bit represents whether an element is included.
   - Related: [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)
   - Related: [Smallest Sufficient Team](https://leetcode.com/problems/smallest-sufficient-team/)

2. **Palindrome checking on subsequences**: The classic "is this string a palindrome" check applied to subsequences.
   - Related: [Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/)
   - Related: [Count Different Palindromic Subsequences](https://leetcode.com/problems/count-different-palindromic-subsequences/)

3. **Disjoint subset optimization**: Finding two disjoint subsets that optimize some function.
   - Related: [Maximum Product of Two Elements in an Array](https://leetcode.com/problems/maximum-product-of-two-elements-in-an-array/) (simpler version)
   - Related: [Split Array into Consecutive Subsequences](https://leetcode.com/problems/split-array-into-consecutive-subsequences/) (different constraints)

## Key Takeaways

1. **Bitmasking is powerful for small `n`**: When `n ≤ 20`, consider representing subsets as bitmasks. This gives you `O(2^n)` states which is often manageable.

2. **Precomputation + DP over subsets**: A common pattern is to precompute something for all masks, then use DP over subsets to aggregate results. The subset iteration trick `submask = (submask - 1) & mask` is worth memorizing.

3. **Complement masks for disjointness**: When you need disjoint subsets, the complement mask (`full_mask ^ mask`) gives you exactly the elements not in your current subset.

Related problems: [Valid Palindrome](/problem/valid-palindrome), [Longest Palindromic Subsequence](/problem/longest-palindromic-subsequence), [Maximum Product of the Length of Two Palindromic Substrings](/problem/maximum-product-of-the-length-of-two-palindromic-substrings)
