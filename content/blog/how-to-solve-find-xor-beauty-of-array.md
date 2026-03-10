---
title: "How to Solve Find Xor-Beauty of Array — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Xor-Beauty of Array. Medium difficulty, 70.5% acceptance rate. Topics: Array, Math, Bit Manipulation."
date: "2029-07-15"
category: "dsa-patterns"
tags: ["find-xor-beauty-of-array", "array", "math", "bit-manipulation", "medium"]
---

# How to Solve Find Xor-Beauty of Array

This problem asks us to compute the XOR of all possible triple combinations `(i, j, k)` where each index can be any position in the array, and the value for each triplet is `((nums[i] | nums[j]) & nums[k])`. The challenge is that a brute force approach would be O(n³), which is infeasible for arrays up to length 10⁵. The key insight is that we need to leverage bit manipulation properties to simplify the expression mathematically.

## Visual Walkthrough

Let's walk through a small example: `nums = [1, 4]` (binary: `01` and `100`).

First, let's understand what we're computing. For all possible `(i, j, k)` where each index can be 0 or 1:

Triplet calculations:

- (0,0,0): `((1|1)&1) = (1&1) = 1` (binary: 001)
- (0,0,1): `((1|1)&4) = (1&4) = 0` (binary: 000)
- (0,1,0): `((1|4)&1) = (5&1) = 1` (binary: 001)
- (0,1,1): `((1|4)&4) = (5&4) = 4` (binary: 100)
- (1,0,0): `((4|1)&1) = (5&1) = 1` (binary: 001)
- (1,0,1): `((4|1)&4) = (5&4) = 4` (binary: 100)
- (1,1,0): `((4|4)&1) = (4&1) = 0` (binary: 000)
- (1,1,1): `((4|4)&4) = (4&4) = 4` (binary: 100)

Now XOR all results: `1 ⊕ 0 ⊕ 1 ⊕ 4 ⊕ 1 ⊕ 4 ⊕ 0 ⊕ 4 = (1⊕1⊕1) ⊕ (4⊕4⊕4) = 1 ⊕ 4 = 5`

Notice something interesting: the result `5` equals the XOR of all array elements: `1 ⊕ 4 = 5`. This isn't a coincidence — as we'll see, the XOR-beauty simplifies to exactly the XOR of all array elements.

## Brute Force Approach

The most straightforward solution is to iterate through all possible triplets `(i, j, k)` and compute the XOR of their effective values:

<div class="code-group">

```python
# Time: O(n³) | Space: O(1)
def xorBeauty_brute(nums):
    n = len(nums)
    result = 0

    # Try all possible triplets (i, j, k)
    for i in range(n):
        for j in range(n):
            for k in range(n):
                # Compute effective value: ((nums[i] | nums[j]) & nums[k])
                value = (nums[i] | nums[j]) & nums[k]
                result ^= value  # XOR with current result

    return result
```

```javascript
// Time: O(n³) | Space: O(1)
function xorBeautyBrute(nums) {
  const n = nums.length;
  let result = 0;

  // Try all possible triplets (i, j, k)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        // Compute effective value: ((nums[i] | nums[j]) & nums[k])
        const value = (nums[i] | nums[j]) & nums[k];
        result ^= value; // XOR with current result
      }
    }
  }

  return result;
}
```

```java
// Time: O(n³) | Space: O(1)
public int xorBeautyBrute(int[] nums) {
    int n = nums.length;
    int result = 0;

    // Try all possible triplets (i, j, k)
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                // Compute effective value: ((nums[i] | nums[j]) & nums[k])
                int value = (nums[i] | nums[j]) & nums[k];
                result ^= value;  // XOR with current result
            }
        }
    }

    return result;
}
```

</div>

**Why this fails:** With `n` up to 10⁵, O(n³) is impossibly slow (10¹⁵ operations). Even for `n = 1000`, we'd need 10⁹ operations. We need a mathematical simplification.

## Optimized Approach

The key insight comes from analyzing the expression `((nums[i] | nums[j]) & nums[k])` bit by bit. Let's consider a single bit position `b`:

1. For the result to have bit `b` set to 1 in the final XOR, the number of triplets where `((nums[i] | nums[j]) & nums[k])` has bit `b` set must be **odd** (because XOR counts parity).

2. The expression `(A | B) & C` has bit `b` set if and only if:
   - Bit `b` of `C` is 1 (from the `&` operation)
   - AND at least one of bit `b` of `A` or bit `b` of `B` is 1 (from the `|` operation)

3. Let `count` = number of elements with bit `b` set. Then:
   - For a fixed `k` with bit `b` set, we need `(nums[i] | nums[j])` to have bit `b` set
   - The number of `(i, j)` pairs where at least one has bit `b` set is: `n² - (n - count)²`
     - Total pairs: `n²`
     - Pairs where neither has bit `b` set: `(n - count)²`

4. So for each `k` with bit `b` set, there are `n² - (n - count)²` valid `(i, j)` pairs
   - Total triplets with bit `b` set: `count × [n² - (n - count)²]`

5. We need this to be odd for bit `b` to appear in the final result
   - `n² - (n - count)² = n² - (n² - 2n×count + count²) = 2n×count - count²`
   - Total triplets: `count × (2n×count - count²) = 2n×count² - count³`

6. For this to be odd, `count` must be odd (since `2n×count²` is always even)
   - If `count` is odd, then `count³` is odd, and `even - odd = odd`
   - If `count` is even, then `count³` is even, and `even - even = even`

7. Therefore, bit `b` appears in the final result if and only if `count` (number of elements with bit `b` set) is odd

8. But this is exactly the definition of XOR! The XOR of all numbers has bit `b` set if and only if an odd number of elements have bit `b` set.

Thus, the XOR-beauty simplifies to simply the XOR of all array elements!

## Optimal Solution

Based on our mathematical derivation, we can implement an extremely simple solution:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def xorBeauty(nums):
    """
    Compute the XOR-beauty of the array.

    Mathematical insight: The XOR-beauty simplifies to the XOR of all elements.
    For each bit position, it appears in the final result if and only if
    it appears in an odd number of array elements, which is exactly what
    XOR computes.
    """
    result = 0

    # XOR all elements together
    for num in nums:
        result ^= num  # XOR accumulates the bitwise parity

    return result
```

```javascript
// Time: O(n) | Space: O(1)
function xorBeauty(nums) {
  /**
   * Compute the XOR-beauty of the array.
   *
   * Mathematical insight: The XOR-beauty simplifies to the XOR of all elements.
   * For each bit position, it appears in the final result if and only if
   * it appears in an odd number of array elements, which is exactly what
   * XOR computes.
   */
  let result = 0;

  // XOR all elements together
  for (const num of nums) {
    result ^= num; // XOR accumulates the bitwise parity
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
public int xorBeauty(int[] nums) {
    /**
     * Compute the XOR-beauty of the array.
     *
     * Mathematical insight: The XOR-beauty simplifies to the XOR of all elements.
     * For each bit position, it appears in the final result if and only if
     * it appears in an odd number of array elements, which is exactly what
     * XOR computes.
     */
    int result = 0;

    // XOR all elements together
    for (int num : nums) {
        result ^= num;  // XOR accumulates the bitwise parity
    }

    return result;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once to compute the XOR of all elements
- Each XOR operation is O(1), so total time is linear in the number of elements

**Space Complexity:** O(1)

- We only use a single variable `result` to accumulate the XOR
- No additional data structures are needed

## Common Mistakes

1. **Attempting the brute force solution:** Many candidates start coding the triple nested loop without considering the constraints. Always check constraints first — with `n ≤ 10⁵`, O(n³) is impossible.

2. **Overcomplicating with bit-by-bit analysis:** While analyzing bit-by-bit is correct, some candidates get lost in the combinatorial counting. Remember that XOR problems often have elegant simplifications.

3. **Misunderstanding XOR properties:** Some candidates try to distribute XOR over the expression `((a|b)&c)`, which doesn't work directly. XOR doesn't distribute over AND or OR in simple ways.

4. **Not testing with small examples:** Always test your mathematical reasoning with small examples (like we did with `[1, 4]`). This helps verify your simplification before implementing.

## When You'll See This Pattern

This problem teaches the pattern of **mathematical simplification of combinatorial expressions through bitwise analysis**. You'll see similar patterns in:

1. **"Decode XORed Permutation" (Medium)** - Also requires understanding XOR properties to reconstruct an array from XOR relationships.

2. **"Maximum XOR of Two Numbers in an Array" (Medium)** - Uses bit-by-bit analysis with tries to find maximum XOR pairs.

3. **"Count Triplets That Can Form Two Arrays of Equal XOR" (Medium)** - Involves XOR prefix sums and combinatorial counting.

The common thread is recognizing when a seemingly complex combinatorial problem can be simplified by analyzing bits independently and leveraging properties of bitwise operations.

## Key Takeaways

1. **When faced with combinatorial bitwise problems, consider analyzing each bit position independently.** Many operations (AND, OR, XOR) act independently on each bit.

2. **XOR counts parity** - A bit appears in the XOR result if it appears in an odd number of operands. This is crucial for many XOR problems.

3. **Always check constraints before implementing** - If constraints suggest O(n³) is impossible (like n ≤ 10⁵), look for mathematical simplifications rather than brute force.

Related problems: [Decode XORed Permutation](/problem/decode-xored-permutation)
