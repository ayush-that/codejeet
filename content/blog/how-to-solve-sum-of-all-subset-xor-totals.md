---
title: "How to Solve Sum of All Subset XOR Totals — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Sum of All Subset XOR Totals. Easy difficulty, 90.1% acceptance rate. Topics: Array, Math, Backtracking, Bit Manipulation, Combinatorics."
date: "2027-09-30"
category: "dsa-patterns"
tags: ["sum-of-all-subset-xor-totals", "array", "math", "backtracking", "easy"]
---

# How to Solve Sum of All Subset XOR Totals

This problem asks us to compute the sum of XOR totals for every possible subset of an array. While it's labeled "Easy," it's interesting because it reveals how combinatorial problems can often be optimized using bit manipulation insights. The brute force approach (generating all subsets) works but is exponential. The optimal solution uses a clever mathematical observation that reduces it to linear time.

## Visual Walkthrough

Let's trace through a small example: `nums = [1, 3]`.

First, list all subsets and their XOR totals:

1. Empty subset `[]`: XOR total = 0
2. `[1]`: XOR total = 1
3. `[3]`: XOR total = 3
4. `[1, 3]`: XOR total = 1 XOR 3 = 2

Sum = 0 + 1 + 3 + 2 = 6

Now let's look at the binary representation to build intuition:

- `1` in binary: `01`
- `3` in binary: `11`

Let's examine each bit position separately:

**Rightmost bit (1s place):**

- `1` contributes `1` at this position
- `3` contributes `1` at this position
  How many subsets have XOR with `1` at this position? A subset's XOR has `1` at this position if it contains an odd number of elements with `1` at that bit. Here, both elements have `1` at this bit. We need to count subsets with odd count of these elements:
- Subsets with 1 element having this bit: `[1]` and `[3]` → 2 subsets
- Subsets with 3 elements: Not possible (only 2 elements total)
  Total: 2 subsets contribute `1` at this position → contributes `2 × 1 = 2` to total sum

**Leftmost bit (2s place):**

- `1` contributes `0` at this position
- `3` contributes `1` at this position
  Only `3` has `1` at this position. How many subsets have XOR with `1` at this position? A subset's XOR has `1` here if it contains an odd number of elements with `1` at this bit. Only `3` has this bit, so we need subsets containing `3`:
- `[3]` and `[1, 3]` → 2 subsets
  Total: 2 subsets contribute `1` at this position → contributes `2 × 2 = 4` to total sum

Sum = 2 + 4 = 6, which matches our earlier calculation.

The pattern: For each bit position `i`, if `k` elements have that bit set, then `2^(n-1)` subsets will have XOR with `1` at that position (when `k > 0`). Each such subset contributes `2^i` to the total sum.

## Brute Force Approach

The most straightforward solution is to generate all subsets, compute each subset's XOR, and sum them. For an array of size `n`, there are `2^n` subsets. We can generate subsets using:

1. Recursive backtracking
2. Iterative bitmasking (using numbers from `0` to `2^n - 1`)

Here's the iterative bitmask approach:

<div class="code-group">

```python
# Time: O(n * 2^n) | Space: O(1)
def subsetXORSum(nums):
    n = len(nums)
    total_sum = 0

    # Iterate through all possible subset masks
    for mask in range(1 << n):  # 2^n possible masks
        subset_xor = 0

        # For each bit in the mask, include corresponding element
        for i in range(n):
            if mask & (1 << i):  # Check if i-th bit is set in mask
                subset_xor ^= nums[i]

        total_sum += subset_xor

    return total_sum
```

```javascript
// Time: O(n * 2^n) | Space: O(1)
function subsetXORSum(nums) {
  const n = nums.length;
  let totalSum = 0;

  // Iterate through all possible subset masks
  for (let mask = 0; mask < 1 << n; mask++) {
    let subsetXOR = 0;

    // For each bit in the mask, include corresponding element
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        // Check if i-th bit is set in mask
        subsetXOR ^= nums[i];
      }
    }

    totalSum += subsetXOR;
  }

  return totalSum;
}
```

```java
// Time: O(n * 2^n) | Space: O(1)
public int subsetXORSum(int[] nums) {
    int n = nums.length;
    int totalSum = 0;

    // Iterate through all possible subset masks
    for (int mask = 0; mask < (1 << n); mask++) {
        int subsetXOR = 0;

        // For each bit in the mask, include corresponding element
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {  // Check if i-th bit is set in mask
                subsetXOR ^= nums[i];
            }
        }

        totalSum += subsetXOR;
    }

    return totalSum;
}
```

</div>

**Why this is inefficient:** For each of the `2^n` subsets, we iterate through `n` elements to compute the XOR, giving `O(n * 2^n)` time complexity. For `n = 20`, that's about `20 * 1,048,576 ≈ 21 million` operations, which is borderline but might pass. However, the optimal solution is much faster.

## Optimal Solution

The key insight is that we don't need to generate all subsets. Instead, we can analyze each bit position independently:

For a given bit position `i` (representing value `2^i`):

- Let `count` = number of elements in `nums` that have bit `i` set
- If `count == 0`, no subset will have bit `i` set in its XOR (contributes 0 to sum)
- If `count > 0`, exactly half of all subsets that include at least one element with bit `i` will have odd parity for that bit
- More precisely: `2^(n-1)` subsets will have bit `i` set in their XOR

Thus, for each bit position `i`, its contribution to the total sum is:

- `0` if no element has bit `i` set
- `2^i * 2^(n-1)` if at least one element has bit `i` set

We can compute this efficiently using bitwise OR:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def subsetXORSum(nums):
    """
    Optimal solution using bit manipulation.
    Key insight: Each bit that appears in any element contributes
    to exactly half of all subset XORs (2^(n-1) subsets).
    """
    n = len(nums)

    # Step 1: Compute OR of all elements
    # This gives us a mask of all bits that appear in the array
    or_all = 0
    for num in nums:
        or_all |= num

    # Step 2: Each bit in or_all contributes to 2^(n-1) subsets
    # Multiply by 2^(n-1) using left shift
    return or_all * (1 << (n - 1))
```

```javascript
// Time: O(n) | Space: O(1)
function subsetXORSum(nums) {
  /**
   * Optimal solution using bit manipulation.
   * Key insight: Each bit that appears in any element contributes
   * to exactly half of all subset XORs (2^(n-1) subsets).
   */
  const n = nums.length;

  // Step 1: Compute OR of all elements
  // This gives us a mask of all bits that appear in the array
  let orAll = 0;
  for (const num of nums) {
    orAll |= num;
  }

  // Step 2: Each bit in orAll contributes to 2^(n-1) subsets
  // Multiply by 2^(n-1) using left shift
  // Handle edge case: when n = 0, (n - 1) would be negative
  if (n === 0) return 0;
  return orAll * (1 << (n - 1));
}
```

```java
// Time: O(n) | Space: O(1)
public int subsetXORSum(int[] nums) {
    /**
     * Optimal solution using bit manipulation.
     * Key insight: Each bit that appears in any element contributes
     * to exactly half of all subset XORs (2^(n-1) subsets).
     */
    int n = nums.length;

    // Step 1: Compute OR of all elements
    // This gives us a mask of all bits that appear in the array
    int orAll = 0;
    for (int num : nums) {
        orAll |= num;
    }

    // Step 2: Each bit in orAll contributes to 2^(n-1) subsets
    // Multiply by 2^(n-1) using left shift
    // Handle edge case: when n = 0, (n - 1) would be negative
    if (n == 0) return 0;
    return orAll * (1 << (n - 1));
}
```

</div>

**Why this works:**

1. `or_all` contains all bits that appear in at least one element
2. For each bit in `or_all`, exactly `2^(n-1)` subsets will have that bit set in their XOR
3. The contribution of bit `i` is `2^i * 2^(n-1)`
4. Summing over all bits gives `or_all * 2^(n-1)`

## Complexity Analysis

**Time Complexity:** `O(n)`

- We iterate through the array once to compute the bitwise OR
- The OR operation and final multiplication are `O(1)` operations

**Space Complexity:** `O(1)`

- We only use a few integer variables regardless of input size
- No additional data structures are needed

## Common Mistakes

1. **Forgetting the empty subset:** The empty subset has XOR total 0, which doesn't affect the sum. Our formula correctly handles this because when we multiply by `2^(n-1)`, we're counting all subsets including the empty one.

2. **Incorrect handling of n=0 edge case:** When `n=0`, `1 << (n-1)` would be `1 << -1`, which is undefined or gives unexpected results. Always check for empty array first.

3. **Using XOR instead of OR:** A common mistake is to XOR all elements instead of OR-ing them. XOR would cancel out bits that appear an even number of times, but we need to know if a bit appears in ANY element, not how many times.

4. **Off-by-one in exponent calculation:** Remember it's `2^(n-1)`, not `2^n`. The reasoning: For a given bit, half of all subsets (excluding those with no elements having that bit) will have that bit set in their XOR. Since there are `2^n` total subsets, and subsets without the bit don't contribute, we get `2^(n-1)`.

## When You'll See This Pattern

This pattern of analyzing problems bit-by-bit appears in several optimization problems:

1. **Sum of All Subset AND Totals (LeetCode 2419):** Similar concept but with AND instead of XOR. The approach is different because AND requires all elements in a subset to have a bit set for it to appear in the result.

2. **Total Hamming Distance (LeetCode 477):** Counts the sum of Hamming distances between all pairs of numbers. The optimal solution also works by examining each bit position separately and counting how many numbers have that bit set vs. unset.

3. **Counting Bits (LeetCode 338):** While not exactly the same, it also uses bit manipulation patterns and the relationship `countBits(n) = countBits(n >> 1) + (n & 1)`.

The key insight in all these problems is that bit operations (AND, OR, XOR) can often be analyzed independently for each bit position, turning combinatorial problems into simpler counting problems.

## Key Takeaways

1. **Bit independence principle:** For XOR (and other bitwise operations), each bit position can often be analyzed independently. This can transform exponential problems into linear ones.

2. **Subset counting trick:** When dealing with subsets and parity (odd/even counts), remember that for a given property, exactly half of the relevant subsets will have odd parity if at least one element has the property.

3. **OR reveals presence, XOR reveals parity:** Use OR when you need to know if a bit appears in ANY element, use XOR when you care about whether it appears an ODD number of times.

[Practice this problem on CodeJeet](/problem/sum-of-all-subset-xor-totals)
