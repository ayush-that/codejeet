---
title: "How to Solve Maximum XOR for Each Query — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum XOR for Each Query. Medium difficulty, 84.8% acceptance rate. Topics: Array, Bit Manipulation, Prefix Sum."
date: "2026-10-07"
category: "dsa-patterns"
tags: ["maximum-xor-for-each-query", "array", "bit-manipulation", "prefix-sum", "medium"]
---

# How to Solve Maximum XOR for Each Query

You're given a sorted array of non-negative integers and an integer `maximumBit`. For each query, you need to find a value `k < 2^maximumBit` that maximizes the XOR of the entire array's prefix XOR with `k`. The tricky part is that after each query, you remove the last element from the array, and you need to do this efficiently for all `n` queries.

What makes this problem interesting is that it combines prefix XOR computation with bitwise optimization. The sorted array is actually a red herring - the solution doesn't depend on the sorting at all. The key insight is understanding how to maximize XOR by complementing bits within a given range.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `nums = [0,1,1,3]`, `maximumBit = 2`

This means `k` must be less than `2^2 = 4`, so `k` can be `0`, `1`, `2`, or `3`.

**Step 1: Initial state**

- Full array: `[0, 1, 1, 3]`
- XOR of entire array: `0 XOR 1 XOR 1 XOR 3 = 3` (binary: `11`)
- We need `k` such that `3 XOR k` is maximized, with `k < 4`
- Let's check all possibilities:
  - `3 XOR 0 = 3` (binary `11`)
  - `3 XOR 1 = 2` (binary `10`)
  - `3 XOR 2 = 1` (binary `01`)
  - `3 XOR 3 = 0` (binary `00`)
- Maximum is `3`, achieved with `k = 0`
- **First answer:** `0`

**Step 2: Remove last element (3)**

- Remaining array: `[0, 1, 1]`
- XOR: `0 XOR 1 XOR 1 = 0` (binary: `00`)
- Find `k` for maximum `0 XOR k`:
  - `0 XOR 0 = 0`
  - `0 XOR 1 = 1`
  - `0 XOR 2 = 2`
  - `0 XOR 3 = 3`
- Maximum is `3`, achieved with `k = 3`
- **Second answer:** `3`

**Step 3: Remove last element (1)**

- Remaining array: `[0, 1]`
- XOR: `0 XOR 1 = 1` (binary: `01`)
- Find `k` for maximum `1 XOR k`:
  - `1 XOR 0 = 1`
  - `1 XOR 1 = 0`
  - `1 XOR 2 = 3`
  - `1 XOR 3 = 2`
- Maximum is `3`, achieved with `k = 2`
- **Third answer:** `2`

**Step 4: Remove last element (1)**

- Remaining array: `[0]`
- XOR: `0` (binary: `00`)
- Find `k` for maximum `0 XOR k`:
  - Same as step 2: maximum is `3` with `k = 3`
- **Fourth answer:** `3`

**Final result:** `[0, 3, 2, 3]`

Notice the pattern: To maximize `x XOR k` where `k < 2^maximumBit`, we want `k` to be the bitwise complement of `x` within the first `maximumBit` bits. For example, when `x = 1` (binary `01`), its complement within 2 bits is `10` (decimal `2`), which gives us the maximum XOR.

## Brute Force Approach

A naive approach would be to simulate the process exactly as described:

1. For each query `i` from `0` to `n-1`:
   - Compute XOR of current array (first `n-i` elements)
   - Try all possible `k` values from `0` to `2^maximumBit - 1`
   - Find the `k` that gives maximum XOR
   - Remove the last element (or conceptually work with a shrinking array)

<div class="code-group">

```python
# Time: O(n² * 2^maximumBit) | Space: O(n)
def getMaximumXor_brute(nums, maximumBit):
    n = len(nums)
    result = []

    # For each query (each time we remove last element)
    for i in range(n):
        # Compute XOR of current array (first n-i elements)
        current_xor = 0
        for j in range(n - i):
            current_xor ^= nums[j]

        # Try all possible k values
        max_val = -1
        best_k = 0
        for k in range(1 << maximumBit):  # 2^maximumBit possibilities
            val = current_xor ^ k
            if val > max_val:
                max_val = val
                best_k = k

        result.append(best_k)

    return result
```

```javascript
// Time: O(n² * 2^maximumBit) | Space: O(n)
function getMaximumXorBrute(nums, maximumBit) {
  const n = nums.length;
  const result = [];

  // For each query (each time we remove last element)
  for (let i = 0; i < n; i++) {
    // Compute XOR of current array (first n-i elements)
    let currentXor = 0;
    for (let j = 0; j < n - i; j++) {
      currentXor ^= nums[j];
    }

    // Try all possible k values
    let maxVal = -1;
    let bestK = 0;
    const maxK = 1 << maximumBit; // 2^maximumBit
    for (let k = 0; k < maxK; k++) {
      const val = currentXor ^ k;
      if (val > maxVal) {
        maxVal = val;
        bestK = k;
      }
    }

    result.push(bestK);
  }

  return result;
}
```

```java
// Time: O(n² * 2^maximumBit) | Space: O(n)
public int[] getMaximumXorBrute(int[] nums, int maximumBit) {
    int n = nums.length;
    int[] result = new int[n];

    // For each query (each time we remove last element)
    for (int i = 0; i < n; i++) {
        // Compute XOR of current array (first n-i elements)
        int currentXor = 0;
        for (int j = 0; j < n - i; j++) {
            currentXor ^= nums[j];
        }

        // Try all possible k values
        int maxVal = -1;
        int bestK = 0;
        int maxK = 1 << maximumBit;  // 2^maximumBit
        for (int k = 0; k < maxK; k++) {
            int val = currentXor ^ k;
            if (val > maxVal) {
                maxVal = val;
                bestK = k;
            }
        }

        result[i] = bestK;
    }

    return result;
}
```

</div>

**Why this is too slow:**

- Time complexity is O(n² \* 2^maximumBit)
- For each of `n` queries, we compute XOR in O(n) time
- For each XOR value, we try up to 2^maximumBit possible `k` values
- With constraints (n up to 10^5, maximumBit up to 20), this could mean up to 10^5 _ 10^5 _ 2^20 ≈ 10^10 \* 1,000,000 operations, which is completely infeasible.

## Optimized Approach

The key insight comes from understanding XOR properties:

1. **Maximizing XOR**: To maximize `x XOR k`, we want `k` to be the bitwise complement of `x` (within the allowed bit range). For example, if `x = 5` (binary `101`) and we have 3 bits, the complement is `010` (binary `2`), giving `101 XOR 010 = 111` (binary `7`, the maximum with 3 bits).

2. **Mathematically**: The maximum possible value with `maximumBit` bits is `(1 << maximumBit) - 1` (all bits set to 1). To achieve this with `x XOR k`, we need `k = ((1 << maximumBit) - 1) XOR x`.

3. **Efficient prefix XOR**: Instead of recomputing XOR from scratch each time, we can use prefix XOR. Let `prefix[i]` be XOR of first `i` elements. Then XOR of elements from `i` to `j` is `prefix[j] XOR prefix[i-1]`. In our case, we need XOR of the entire current array, which is just the prefix XOR up to the current last element.

4. **Working backwards**: Since we remove elements from the end, we can:
   - First compute total XOR of all elements
   - For each query, use the current total XOR
   - Update total XOR by XOR-ing with the removed element (because `a XOR a = 0`)

**Step-by-step reasoning:**

1. Compute total XOR of all elements
2. The optimal `k` for XOR value `x` is `((1 << maximumBit) - 1) XOR x`
3. For each query:
   - Compute optimal `k` for current total XOR
   - Add to result
   - Update total XOR by XOR-ing with the last element (which is being removed)
4. Return result

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the result array
def getMaximumXor(nums, maximumBit):
    """
    For each query (removing last element each time), find k that maximizes
    XOR of remaining array with k, where k < 2^maximumBit.

    Key insight: To maximize x XOR k, we want k to be the bitwise complement
    of x within the first maximumBit bits.
    """
    n = len(nums)
    result = [0] * n

    # Compute the mask for maximumBit bits
    # (1 << maximumBit) - 1 gives us all 1's in the first maximumBit bits
    mask = (1 << maximumBit) - 1

    # Start with XOR of all elements
    total_xor = 0
    for num in nums:
        total_xor ^= num

    # Process queries in reverse order (from full array to single element)
    # We go backwards because we remove from the end
    for i in range(n):
        # The optimal k is the complement of total_xor within mask bits
        # XOR with mask flips all bits within the mask range
        k = total_xor ^ mask
        result[i] = k

        # Remove last element from consideration for next iteration
        # XOR with the element being removed cancels it out
        total_xor ^= nums[n - 1 - i]

    return result
```

```javascript
// Time: O(n) | Space: O(n) for the result array
function getMaximumXor(nums, maximumBit) {
  /**
   * For each query (removing last element each time), find k that maximizes
   * XOR of remaining array with k, where k < 2^maximumBit.
   *
   * Key insight: To maximize x XOR k, we want k to be the bitwise complement
   * of x within the first maximumBit bits.
   */
  const n = nums.length;
  const result = new Array(n);

  // Compute the mask for maximumBit bits
  // (1 << maximumBit) - 1 gives us all 1's in the first maximumBit bits
  const mask = (1 << maximumBit) - 1;

  // Start with XOR of all elements
  let totalXor = 0;
  for (const num of nums) {
    totalXor ^= num;
  }

  // Process queries in reverse order (from full array to single element)
  // We go backwards because we remove from the end
  for (let i = 0; i < n; i++) {
    // The optimal k is the complement of totalXor within mask bits
    // XOR with mask flips all bits within the mask range
    const k = totalXor ^ mask;
    result[i] = k;

    // Remove last element from consideration for next iteration
    // XOR with the element being removed cancels it out
    totalXor ^= nums[n - 1 - i];
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(n) for the result array
public int[] getMaximumXor(int[] nums, int maximumBit) {
    /**
     * For each query (removing last element each time), find k that maximizes
     * XOR of remaining array with k, where k < 2^maximumBit.
     *
     * Key insight: To maximize x XOR k, we want k to be the bitwise complement
     * of x within the first maximumBit bits.
     */
    int n = nums.length;
    int[] result = new int[n];

    // Compute the mask for maximumBit bits
    // (1 << maximumBit) - 1 gives us all 1's in the first maximumBit bits
    int mask = (1 << maximumBit) - 1;

    // Start with XOR of all elements
    int totalXor = 0;
    for (int num : nums) {
        totalXor ^= num;
    }

    // Process queries in reverse order (from full array to single element)
    // We go backwards because we remove from the end
    for (int i = 0; i < n; i++) {
        // The optimal k is the complement of totalXor within mask bits
        // XOR with mask flips all bits within the mask range
        int k = totalXor ^ mask;
        result[i] = k;

        // Remove last element from consideration for next iteration
        // XOR with the element being removed cancels it out
        totalXor ^= nums[n - 1 - i];
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We make one pass through the array to compute initial total XOR: O(n)
- We make another pass through the array to compute results: O(n)
- Each operation within the loops is O(1) bitwise operations
- Total: O(2n) = O(n)

**Space Complexity: O(n)**

- We need O(n) space for the result array
- We use O(1) additional space for variables (total_xor, mask, etc.)
- Total: O(n) for output, O(1) auxiliary space

## Common Mistakes

1. **Forgetting the mask constraint**: Candidates might try to use full bitwise complement without considering `maximumBit`. For example, using `~x` instead of `x ^ mask`. Remember that `k` must be less than `2^maximumBit`, so we can only flip the first `maximumBit` bits.

2. **Inefficient XOR recomputation**: Some candidates recompute XOR from scratch for each query, leading to O(n²) time. The key optimization is maintaining a running XOR and updating it efficiently when removing elements.

3. **Wrong update order**: When removing elements, you need to XOR with the element being removed **after** computing the current answer. The update `total_xor ^= nums[n - 1 - i]` must come after computing `k` for the current query.

4. **Off-by-one errors with indices**: When accessing `nums[n - 1 - i]`, be careful with bounds. At the last iteration (i = n-1), we access `nums[0]`, which is correct since we're removing the first element (in reverse order).

5. **Misunderstanding the sorted property**: The array is sorted, but this doesn't affect the solution. Some candidates waste time trying to use binary search or other sorted array techniques, when the solution only depends on XOR properties.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Prefix XOR/Partial XOR Computation**: Similar to prefix sums but with XOR. Useful when you need XOR of subarrays frequently.
   - Related problem: [Count the Number of Beautiful Subarrays](/problem/count-the-number-of-beautiful-subarrays) - uses prefix XOR to find subarrays with XOR zero
   - Related problem: [Find the Longest Awesome Substring](/problem/find-the-longest-awesome-substring) - uses prefix XOR with bitmask

2. **Bitwise Optimization for Maximization**: When you need to maximize `a XOR b` with constraints on `b`, think about complementing bits within the allowed range.
   - Related problem: [Maximum XOR of Two Numbers in an Array](/problem/maximum-xor-of-two-numbers-in-an-array) - uses trie to find maximum XOR pair
   - Related problem: [Maximum XOR With an Element From Array](/problem/maximum-xor-with-an-element-from-array) - similar concept with queries

3. **Reverse Processing**: When elements are removed from the end, processing in reverse order often simplifies the logic, as seen here where we start with full XOR and "undo" elements.

## Key Takeaways

1. **XOR properties are powerful**: Remember that `a XOR a = 0` and `a XOR 0 = a`. This allows efficient updates when adding or removing elements from XOR calculations.

2. **Maximizing XOR means complementing bits**: To maximize `x XOR k` where `k` has limited bits, set `k` to be the bitwise complement of `x` within the allowed bit range. Mathematically, `k = mask XOR x` where `mask` has 1's in all allowed bit positions.

3. **Process in natural order for efficiency**: When queries involve removing elements, consider if processing backwards (from full to empty) simplifies computation. Maintaining running totals and updating them incrementally is often more efficient than recomputing from scratch.

4. **Don't be distracted by irrelevant properties**: The array is sorted, but the solution doesn't use this property. Focus on what actually matters for the problem - in this case, XOR operations and bit manipulation.

Related problems: [Count the Number of Beautiful Subarrays](/problem/count-the-number-of-beautiful-subarrays)
