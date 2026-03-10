---
title: "How to Solve Number of Unique XOR Triplets I — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Number of Unique XOR Triplets I. Medium difficulty, 26.5% acceptance rate. Topics: Array, Math, Bit Manipulation."
date: "2030-02-11"
category: "dsa-patterns"
tags: ["number-of-unique-xor-triplets-i", "array", "math", "bit-manipulation", "medium"]
---

# How to Solve Number of Unique XOR Triplets I

You're given a permutation of numbers from 1 to `n`, and you need to count how many unique XOR values you can get by taking any three elements where their indices are in non-decreasing order (`i ≤ j ≤ k`). The challenge here is that while the indices must be ordered, the elements themselves can be in any arrangement, and XOR has special properties that make this problem interesting but potentially computationally expensive if approached naively.

## Visual Walkthrough

Let's trace through a small example: `nums = [2, 1, 3]` (a permutation of [1, 2, 3]).

We need to consider all triplets where `i ≤ j ≤ k`:

1. `i=0, j=0, k=0`: `nums[0] XOR nums[0] XOR nums[0]` = `2 XOR 2 XOR 2` = `2`
   - Any number XORed with itself is 0, and 0 XORed with the number gives the number: `(2 XOR 2) = 0`, then `0 XOR 2 = 2`

2. `i=0, j=0, k=1`: `2 XOR 2 XOR 1` = `(2 XOR 2) XOR 1` = `0 XOR 1` = `1`

3. `i=0, j=0, k=2`: `2 XOR 2 XOR 3` = `0 XOR 3` = `3`

4. `i=0, j=1, k=1`: `2 XOR 1 XOR 1` = `2 XOR (1 XOR 1)` = `2 XOR 0` = `2`

5. `i=0, j=1, k=2`: `2 XOR 1 XOR 3` = `(2 XOR 1) XOR 3` = `3 XOR 3` = `0`

6. `i=0, j=2, k=2`: `2 XOR 3 XOR 3` = `2 XOR 0` = `2`

7. `i=1, j=1, k=1`: `1 XOR 1 XOR 1` = `1`

8. `i=1, j=1, k=2`: `1 XOR 1 XOR 3` = `0 XOR 3` = `3`

9. `i=1, j=2, k=2`: `1 XOR 3 XOR 3` = `1 XOR 0` = `1`

10. `i=2, j=2, k=2`: `3 XOR 3 XOR 3` = `3`

Now let's collect the unique values: {2, 1, 3, 0} → 4 unique XOR triplets.

Notice that even with just 3 elements, we have 10 possible triplets (the number of combinations with repetition: `C(n+2, 3)` = `C(5, 3)` = 10). For larger `n`, this grows as O(n³), which is why we need a smarter approach.

## Brute Force Approach

The most straightforward solution is to generate all possible triplets with `i ≤ j ≤ k`, compute their XOR, and store the results in a set to count unique values.

**Why this is problematic:**

- For an array of length `n`, there are `C(n+2, 3)` = `(n+2)(n+1)n/6` triplets, which is O(n³)
- With `n` up to 1000 (typical for medium problems), that's up to ~167 million operations
- This is far too slow and will time out

<div class="code-group">

```python
# Time: O(n³) | Space: O(n³) worst case
def countUniqueXORTriplets_brute(nums):
    n = len(nums)
    unique_xors = set()

    # Generate all triplets with i <= j <= k
    for i in range(n):
        for j in range(i, n):
            for k in range(j, n):
                # Compute XOR of the triplet
                xor_val = nums[i] ^ nums[j] ^ nums[k]
                unique_xors.add(xor_val)

    return len(unique_xors)
```

```javascript
// Time: O(n³) | Space: O(n³) worst case
function countUniqueXORTripletsBrute(nums) {
  const n = nums.length;
  const uniqueXors = new Set();

  // Generate all triplets with i <= j <= k
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      for (let k = j; k < n; k++) {
        // Compute XOR of the triplet
        const xorVal = nums[i] ^ nums[j] ^ nums[k];
        uniqueXors.add(xorVal);
      }
    }
  }

  return uniqueXors.size;
}
```

```java
// Time: O(n³) | Space: O(n³) worst case
public int countUniqueXORTripletsBrute(int[] nums) {
    int n = nums.length;
    Set<Integer> uniqueXors = new HashSet<>();

    // Generate all triplets with i <= j <= k
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            for (int k = j; k < n; k++) {
                // Compute XOR of the triplet
                int xorVal = nums[i] ^ nums[j] ^ nums[k];
                uniqueXors.add(xorVal);
            }
        }
    }

    return uniqueXors.size();
}
```

</div>

## Optimized Approach

The key insight comes from understanding XOR properties and the structure of the problem:

1. **XOR Properties:**
   - `a XOR a = 0`
   - `a XOR 0 = a`
   - XOR is associative and commutative: `(a XOR b) XOR c = a XOR (b XOR c)`

2. **Observation about permutations:**
   Since `nums` is a permutation of `[1, n]`, all numbers from 1 to `n` appear exactly once. This means the maximum XOR value we can get is when we XOR the largest numbers, which gives us an upper bound.

3. **Key optimization insight:**
   Instead of iterating through all O(n³) triplets, we can notice that the XOR of three numbers will always be in the range `[0, 2^m - 1]` where `m` is the smallest integer such that `2^m > n`. This is because:
   - The maximum value in `nums` is `n`
   - When XORing three numbers ≤ n, the result will be less than `2^m` where `m` is the number of bits needed to represent `n`
   - For example, if `n = 1000`, we need 10 bits (2¹⁰ = 1024 > 1000)

4. **Dynamic programming approach:**
   We can use a 2D DP approach where `dp[j][x]` represents whether we can achieve XOR value `x` using exactly `j+1` elements from the array. We iterate through each number in `nums` and update our DP table.

5. **Algorithm:**
   - Find `m` such that `2^m > n` (this gives us the range of possible XOR values)
   - Initialize DP: `dp[0][x] = True` if we can get XOR `x` with 1 element
   - For each number in `nums`, update DP for 2-element and 3-element XORs
   - Count how many XOR values are achievable with exactly 3 elements

## Optimal Solution

Here's the efficient solution using dynamic programming:

<div class="code-group">

```python
# Time: O(n * 2^m) where m = ceil(log2(n+1)) | Space: O(2^m)
def countUniqueXORTriplets(nums):
    n = len(nums)

    # Find m such that 2^m > n (maximum possible XOR value)
    # We need enough bits to represent all possible XOR results
    m = 1
    while (1 << m) <= n:
        m += 1

    # Maximum possible XOR value is less than 2^m
    max_xor = 1 << m

    # DP arrays: dp[j][x] = can we get XOR x using j+1 elements?
    # We only need to track for 1, 2, and 3 elements
    dp1 = [False] * max_xor  # For 1 element
    dp2 = [False] * max_xor  # For 2 elements
    dp3 = [False] * max_xor  # For 3 elements

    # Initialize: each single element gives its own value as XOR
    for num in nums:
        dp1[num] = True

    # Process each number to build 2-element and 3-element XORs
    for num in nums:
        # Update dp3 using dp2 and current num
        for x in range(max_xor):
            if dp2[x]:
                dp3[x ^ num] = True

        # Update dp2 using dp1 and current num
        for x in range(max_xor):
            if dp1[x]:
                dp2[x ^ num] = True

    # Count how many XOR values are achievable with exactly 3 elements
    count = 0
    for x in range(max_xor):
        if dp3[x]:
            count += 1

    return count
```

```javascript
// Time: O(n * 2^m) where m = ceil(log2(n+1)) | Space: O(2^m)
function countUniqueXORTriplets(nums) {
  const n = nums.length;

  // Find m such that 2^m > n (maximum possible XOR value)
  let m = 1;
  while (1 << m <= n) {
    m++;
  }

  // Maximum possible XOR value is less than 2^m
  const maxXor = 1 << m;

  // DP arrays: dp[j][x] = can we get XOR x using j+1 elements?
  const dp1 = new Array(maxXor).fill(false); // For 1 element
  const dp2 = new Array(maxXor).fill(false); // For 2 elements
  const dp3 = new Array(maxXor).fill(false); // For 3 elements

  // Initialize: each single element gives its own value as XOR
  for (const num of nums) {
    dp1[num] = true;
  }

  // Process each number to build 2-element and 3-element XORs
  for (const num of nums) {
    // Update dp3 using dp2 and current num
    for (let x = 0; x < maxXor; x++) {
      if (dp2[x]) {
        dp3[x ^ num] = true;
      }
    }

    // Update dp2 using dp1 and current num
    for (let x = 0; x < maxXor; x++) {
      if (dp1[x]) {
        dp2[x ^ num] = true;
      }
    }
  }

  // Count how many XOR values are achievable with exactly 3 elements
  let count = 0;
  for (let x = 0; x < maxXor; x++) {
    if (dp3[x]) {
      count++;
    }
  }

  return count;
}
```

```java
// Time: O(n * 2^m) where m = ceil(log2(n+1)) | Space: O(2^m)
public int countUniqueXORTriplets(int[] nums) {
    int n = nums.length;

    // Find m such that 2^m > n (maximum possible XOR value)
    int m = 1;
    while ((1 << m) <= n) {
        m++;
    }

    // Maximum possible XOR value is less than 2^m
    int maxXor = 1 << m;

    // DP arrays: dp[j][x] = can we get XOR x using j+1 elements?
    boolean[] dp1 = new boolean[maxXor];  // For 1 element
    boolean[] dp2 = new boolean[maxXor];  // For 2 elements
    boolean[] dp3 = new boolean[maxXor];  // For 3 elements

    // Initialize: each single element gives its own value as XOR
    for (int num : nums) {
        dp1[num] = true;
    }

    // Process each number to build 2-element and 3-element XORs
    for (int num : nums) {
        // Update dp3 using dp2 and current num
        for (int x = 0; x < maxXor; x++) {
            if (dp2[x]) {
                dp3[x ^ num] = true;
            }
        }

        // Update dp2 using dp1 and current num
        for (int x = 0; x < maxXor; x++) {
            if (dp1[x]) {
                dp2[x ^ num] = true;
            }
        }
    }

    // Count how many XOR values are achievable with exactly 3 elements
    int count = 0;
    for (int x = 0; x < maxXor; x++) {
        if (dp3[x]) {
            count++;
        }
    }

    return count;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × 2^m) where m = ⌈log₂(n+1)⌉

- We iterate through all `n` elements
- For each element, we iterate through all possible XOR values (up to 2^m)
- Since m ≈ log₂(n), 2^m ≈ 2n, giving us O(n²) in practice
- This is much better than O(n³) for the brute force approach

**Space Complexity:** O(2^m) ≈ O(n)

- We maintain three boolean arrays of size 2^m
- Since 2^m is O(n), the space complexity is linear in n

**Why this works:**
The DP approach efficiently tracks which XOR values are achievable with 1, 2, or 3 elements. By processing each number and updating our DP tables, we build up all possible XOR combinations without explicitly enumerating all triplets.

## Common Mistakes

1. **Forgetting that indices must be ordered (i ≤ j ≤ k):**
   - Some candidates might generate all permutations of indices, which would overcount
   - Remember: the problem allows the same element to be used multiple times as long as indices are non-decreasing

2. **Not leveraging the permutation property:**
   - Since `nums` contains all numbers from 1 to `n` exactly once, we know the maximum value is `n`
   - This helps us bound the possible XOR results to at most 2^⌈log₂(n+1)⌉

3. **Incorrectly calculating the maximum possible XOR:**
   - The maximum XOR of three numbers ≤ n is not simply 3n
   - XOR operates bitwise, so the result can have more bits than any individual number
   - Example: 7 (111) XOR 6 (110) XOR 5 (101) = 4 (100), which is less than all inputs

4. **Using O(n³) approach for large n:**
   - With n up to 1000, O(n³) is ~1 billion operations
   - Always check constraints before implementing brute force

## When You'll See This Pattern

This problem combines several important patterns:

1. **Bitmask DP / Subset DP:** Similar to problems where you need to track which states are achievable
   - Related problem: [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)
   - Related problem: [Target Sum](https://leetcode.com/problems/target-sum/)

2. **XOR Problems with Bounded Results:** Problems where XOR results have limited range
   - Related problem: [Count Triplets That Can Form Two Arrays of Equal XOR](https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/)
   - Related problem: [Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)

3. **Combinatorial Problems with Symmetry:** Where order matters but has constraints
   - Related problem: [Number of Ways to Select Buildings](https://leetcode.com/problems/number-of-ways-to-select-buildings/)

## Key Takeaways

1. **When dealing with XOR and permutations, think about bit bounds:** The result of XOR operations on numbers ≤ n will be less than 2^⌈log₂(n+1)⌉, which often allows for efficient DP solutions.

2. **DP can count combinations without enumeration:** Instead of generating all O(n³) triplets, we can use DP to track achievable XOR values, reducing the complexity significantly.

3. **Read constraints carefully:** The fact that `nums` is a permutation of `[1, n]` is crucial—it gives us the upper bound `n` and ensures all numbers are distinct, which simplifies the analysis.

[Practice this problem on CodeJeet](/problem/number-of-unique-xor-triplets-i)
