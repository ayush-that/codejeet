---
title: "How to Solve Partition Array for Maximum XOR and AND — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Partition Array for Maximum XOR and AND. Hard difficulty, 17.5% acceptance rate. Topics: Array, Math, Greedy, Bit Manipulation, Enumeration."
date: "2026-07-17"
category: "dsa-patterns"
tags: ["partition-array-for-maximum-xor-and-and", "array", "math", "greedy", "hard"]
---

# How to Solve Partition Array for Maximum XOR and AND

You're given an integer array `nums` and need to partition it into three (possibly empty) subsequences A, B, and C to maximize `XOR(A) + AND(B) + XOR(C)`. The challenge is that each element must go to exactly one subsequence, and the operations are different: XOR for A and C, AND for B. What makes this tricky is that XOR and AND behave very differently with bit manipulation, and the optimal partition isn't obvious.

## Visual Walkthrough

Let's trace through `nums = [1, 2, 3, 4]` to build intuition:

**Step 1: Understanding the operations**

- XOR: `a ⊕ b` gives 1 when bits differ, 0 when same
- AND: `a & b` gives 1 only when both bits are 1

**Step 2: Trying different partitions**
We need to split into A, B, C. Let's test a few:

1. `A = [1, 2]`, `B = [3]`, `C = [4]`
   - `XOR(A) = 1 ⊕ 2 = 3`
   - `AND(B) = 3`
   - `XOR(C) = 4`
   - Total: 3 + 3 + 4 = 10

2. `A = [1]`, `B = [2, 3]`, `C = [4]`
   - `XOR(A) = 1`
   - `AND(B) = 2 & 3 = 2` (binary: 10 & 11 = 10 = 2)
   - `XOR(C) = 4`
   - Total: 1 + 2 + 4 = 7

3. `A = []`, `B = [1, 2, 3, 4]`, `C = []`
   - `XOR(A) = 0` (empty XOR is 0)
   - `AND(B) = 1 & 2 & 3 & 4 = 0` (bits: 001 & 010 & 011 & 100 = 000)
   - `XOR(C) = 0`
   - Total: 0

4. `A = [1, 4]`, `B = [2]`, `C = [3]`
   - `XOR(A) = 1 ⊕ 4 = 5` (001 ⊕ 100 = 101 = 5)
   - `AND(B) = 2`
   - `XOR(C) = 3`
   - Total: 5 + 2 + 3 = 10

**Key insight**: The AND operation in B tends to decrease as we add more numbers (more bits get zeroed out), while XOR can increase or decrease unpredictably. This suggests B should be small, possibly just one element or empty.

## Brute Force Approach

The brute force solution would try all possible partitions. For each of n elements, we have 3 choices (A, B, or C), giving us 3ⁿ possibilities. For each partition, we compute XOR(A), AND(B), and XOR(C), then take the maximum.

Why this fails:

- With n up to 10⁵ in constraints, 3ⁿ is astronomically large
- Even for n=20, that's 3²⁰ ≈ 3.5 billion operations
- We need something polynomial, ideally O(n) or O(n log n)

What a naive candidate might try:

1. Sort the array and try greedy approaches
2. Put all numbers in A or C based on some heuristic
3. These fail because XOR and AND don't behave linearly with sorting

## Optimized Approach

The key insight comes from understanding bit operations:

1. **AND operation property**: `a & b ≤ min(a, b)`. Adding more numbers to B can only decrease or keep the same AND value. Therefore, the optimal B will contain at most one element (or be empty). If we put multiple elements in B, we can move all but the maximum element to A or C without decreasing the total.

2. **XOR operation property**: XOR is associative and commutative. We can compute prefix XORs and suffix XORs efficiently.

3. **Optimal structure**: Since B has at most one element, we can:
   - Try each position i as the single element in B
   - Compute XOR of all elements before i (for A)
   - Compute XOR of all elements after i (for C)
   - Also consider B being empty (all elements in A or C)

4. **Handling empty B**: When B is empty, all elements go to A or C. But we can think of this as splitting into two parts: some prefix in A, suffix in C. We need to maximize `prefixXOR + suffixXOR`.

5. **Putting it together**: We need to consider two cases:
   - Case 1: B has exactly one element at position i
   - Case 2: B is empty (all elements split between A and C)

For case 2, we need to find the best split point to maximize `prefixXOR + suffixXOR`.

## Optimal Solution

We'll use prefix XOR arrays to compute XOR of any subarray in O(1) time. The algorithm:

1. Compute total XOR of all elements
2. Compute prefix XOR array
3. For each position i as potential B element:
   - XOR(A) = prefixXOR[i] (elements before i)
   - AND(B) = nums[i]
   - XOR(C) = totalXOR ^ prefixXOR[i] ^ nums[i] (elements after i)
4. Also consider B empty: find max of `prefixXOR[i] + (totalXOR ^ prefixXOR[i])` for all i
5. Take the maximum of all these possibilities

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def max_xor_and_sum(nums):
    """
    Maximize XOR(A) + AND(B) + XOR(C) by partitioning nums into three subsequences.
    Key insight: Optimal B has at most one element.
    """
    n = len(nums)

    # Edge case: empty array
    if n == 0:
        return 0

    # Compute total XOR of all elements
    total_xor = 0
    for num in nums:
        total_xor ^= num

    # Compute prefix XOR: prefix_xor[i] = XOR of nums[0..i-1]
    prefix_xor = [0] * (n + 1)
    for i in range(n):
        prefix_xor[i + 1] = prefix_xor[i] ^ nums[i]

    max_sum = 0

    # Case 1: B has exactly one element at position i
    for i in range(n):
        # XOR of elements before i (A)
        xor_a = prefix_xor[i]

        # AND of B (single element)
        and_b = nums[i]

        # XOR of elements after i (C)
        # total_xor = xor_a ^ nums[i] ^ xor_c
        # So xor_c = total_xor ^ xor_a ^ nums[i]
        xor_c = total_xor ^ prefix_xor[i] ^ nums[i]

        max_sum = max(max_sum, xor_a + and_b + xor_c)

    # Case 2: B is empty (all elements split between A and C)
    # We need to find split point i where:
    # A = nums[0..i-1], C = nums[i..n-1]
    for i in range(n + 1):  # i can be 0 (all in C) to n (all in A)
        xor_a = prefix_xor[i]
        xor_c = total_xor ^ prefix_xor[i]
        max_sum = max(max_sum, xor_a + xor_c)

    return max_sum
```

```javascript
// Time: O(n) | Space: O(n)
function maxXorAndSum(nums) {
  /**
   * Maximize XOR(A) + AND(B) + XOR(C) by partitioning nums into three subsequences.
   * Key insight: Optimal B has at most one element.
   */
  const n = nums.length;

  // Edge case: empty array
  if (n === 0) {
    return 0;
  }

  // Compute total XOR of all elements
  let totalXor = 0;
  for (const num of nums) {
    totalXor ^= num;
  }

  // Compute prefix XOR: prefixXor[i] = XOR of nums[0..i-1]
  const prefixXor = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefixXor[i + 1] = prefixXor[i] ^ nums[i];
  }

  let maxSum = 0;

  // Case 1: B has exactly one element at position i
  for (let i = 0; i < n; i++) {
    // XOR of elements before i (A)
    const xorA = prefixXor[i];

    // AND of B (single element)
    const andB = nums[i];

    // XOR of elements after i (C)
    // totalXor = xorA ^ nums[i] ^ xorC
    // So xorC = totalXor ^ xorA ^ nums[i]
    const xorC = totalXor ^ prefixXor[i] ^ nums[i];

    maxSum = Math.max(maxSum, xorA + andB + xorC);
  }

  // Case 2: B is empty (all elements split between A and C)
  // We need to find split point i where:
  // A = nums[0..i-1], C = nums[i..n-1]
  for (let i = 0; i <= n; i++) {
    // i can be 0 (all in C) to n (all in A)
    const xorA = prefixXor[i];
    const xorC = totalXor ^ prefixXor[i];
    maxSum = Math.max(maxSum, xorA + xorC);
  }

  return maxSum;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int maxXorAndSum(int[] nums) {
        /**
         * Maximize XOR(A) + AND(B) + XOR(C) by partitioning nums into three subsequences.
         * Key insight: Optimal B has at most one element.
         */
        int n = nums.length;

        // Edge case: empty array
        if (n == 0) {
            return 0;
        }

        // Compute total XOR of all elements
        int totalXor = 0;
        for (int num : nums) {
            totalXor ^= num;
        }

        // Compute prefix XOR: prefixXor[i] = XOR of nums[0..i-1]
        int[] prefixXor = new int[n + 1];
        for (int i = 0; i < n; i++) {
            prefixXor[i + 1] = prefixXor[i] ^ nums[i];
        }

        int maxSum = 0;

        // Case 1: B has exactly one element at position i
        for (int i = 0; i < n; i++) {
            // XOR of elements before i (A)
            int xorA = prefixXor[i];

            // AND of B (single element)
            int andB = nums[i];

            // XOR of elements after i (C)
            // totalXor = xorA ^ nums[i] ^ xorC
            // So xorC = totalXor ^ xorA ^ nums[i]
            int xorC = totalXor ^ prefixXor[i] ^ nums[i];

            maxSum = Math.max(maxSum, xorA + andB + xorC);
        }

        // Case 2: B is empty (all elements split between A and C)
        // We need to find split point i where:
        // A = nums[0..i-1], C = nums[i..n-1]
        for (int i = 0; i <= n; i++) {  // i can be 0 (all in C) to n (all in A)
            int xorA = prefixXor[i];
            int xorC = totalXor ^ prefixXor[i];
            maxSum = Math.max(maxSum, xorA + xorC);
        }

        return maxSum;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Computing total XOR: O(n)
- Building prefix XOR array: O(n)
- Checking each position for Case 1: O(n)
- Checking each split for Case 2: O(n)
- Total: O(n) + O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store the prefix XOR array of size n+1: O(n)
- Other variables use O(1) space
- Total: O(n) (can be reduced to O(1) by computing on the fly, but O(n) is clearer)

## Common Mistakes

1. **Assuming B can have multiple elements**: The most common mistake is not realizing that AND(B) is maximized with at most one element. Candidates try complex DP or backtracking to handle multiple elements in B, which is unnecessary and inefficient.

2. **Forgetting the empty B case**: Some candidates only consider B having one element, forgetting that B can be empty. The empty B case corresponds to partitioning between A and C only, which might give a better result.

3. **Incorrect XOR computation for suffix**: When computing XOR(C) for elements after position i, a common error is trying to compute another suffix array. The correct way is: `xor_c = total_xor ^ prefix_xor[i] ^ nums[i]` because `total_xor = xor_a ^ nums[i] ^ xor_c`.

4. **Off-by-one errors in prefix array**: The prefix array has size n+1 where `prefix_xor[i]` represents XOR of first i elements (indices 0 to i-1). Confusing this leads to incorrect XOR calculations.

## When You'll See This Pattern

This problem combines bit manipulation with optimization through problem structure analysis. You'll see similar patterns in:

1. **Maximum Subarray XOR (LeetCode 421)**: Uses bit manipulation and prefix XOR with tries to find maximum XOR pair. Similar bit manipulation concepts but different structure.

2. **Partition Array Into Three Parts With Equal Sum (LeetCode 1013)**: Also about partitioning into three parts, though with sum equality rather than bit operation optimization.

3. **Maximum XOR of Two Numbers in an Array (LeetCode 421)**: Heavy bit manipulation focus, teaching how to think about XOR properties.

4. **Bitwise AND of Numbers Range (LeetCode 201)**: Focuses on AND operation properties, similar to our insight about AND decreasing with more numbers.

## Key Takeaways

1. **Analyze operation properties first**: Before coding, understand how XOR and AND behave. XOR is associative and can be computed with prefix arrays. AND decreases with more operands, suggesting B should be small.

2. **Reduce search space through reasoning**: The insight that B has at most one element reduces the problem from exponential to linear. Always look for properties that constrain the solution space.

3. **Prefix sums/arrays for associative operations**: When dealing with associative operations (like XOR, addition, multiplication), prefix arrays let you compute any subarray result in O(1) time after O(n) preprocessing.

[Practice this problem on CodeJeet](/problem/partition-array-for-maximum-xor-and-and)
