---
title: "How to Solve Maximum OR — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum OR. Medium difficulty, 42.7% acceptance rate. Topics: Array, Greedy, Bit Manipulation, Prefix Sum."
date: "2029-12-14"
category: "dsa-patterns"
tags: ["maximum-or", "array", "greedy", "bit-manipulation", "medium"]
---

# How to Solve Maximum OR

This problem asks us to maximize the bitwise OR of an array after we can multiply any element by 2 (left shift its bits) up to `k` times. The challenge is that multiplying by 2 is equivalent to left-shifting the binary representation, which creates new higher-order bits that can significantly increase the OR value. The tricky part is deciding which elements to shift and how many times to shift each one to maximize the final OR.

## Visual Walkthrough

Let's walk through an example: `nums = [12, 9]`, `k = 1`

**Step 1: Understand the binary representations**

- 12 in binary: `1100` (8 + 4)
- 9 in binary: `1001` (8 + 1)

**Step 2: Calculate initial OR**

- `12 | 9 = 1100 | 1001 = 1101` = 13

**Step 3: Try shifting possibilities**
We have 1 operation (k=1). Let's try both options:

**Option A: Shift 12 by 1**

- 12 << 1 = 24 (binary: `11000`)
- New array: [24, 9]
- 24 | 9 = `11000 | 01001 = 11001` = 25

**Option B: Shift 9 by 1**

- 9 << 1 = 18 (binary: `10010`)
- New array: [12, 18]
- 12 | 18 = `01100 | 10010 = 11110` = 30

**Option B gives us 30, which is better than 25!**

**Key insight:** Shifting 9 created a new bit position (bit 4, value 16) that wasn't present in the original OR. Even though 12 is larger initially, shifting 9 gives us access to a higher bit position in the final OR.

## Brute Force Approach

A naive approach would try all possible distributions of `k` shifts among `n` elements. For each element, we could apply 0 to `k` shifts. This creates `(k+1)^n` possibilities to check.

Even for moderate values like `n=10` and `k=10`, that's `11^10 ≈ 2.6×10^10` possibilities - completely infeasible.

The brute force fails because:

1. Exponential time complexity
2. No way to prune the search space
3. Doesn't leverage the properties of bitwise operations

## Optimized Approach

The key insight is that **left-shifting is most valuable when it creates new high-order bits in the final OR**. Here's the step-by-step reasoning:

1. **Bit perspective**: Each bit position contributes `2^position` to the final value. Higher bits contribute exponentially more.

2. **Greedy strategy**: We should apply all `k` shifts to a single element rather than distributing them. Why? Because:
   - Shifting an element by `m` positions creates bits at positions `original_position + m`
   - If we split shifts between elements, we might create multiple medium-high bits
   - But concentrating shifts on one element can create a single very-high bit that dominates

3. **Prefix and suffix ORs**: To efficiently test which element to shift, we can use prefix and suffix OR arrays:
   - `prefix[i]` = OR of all elements before index `i`
   - `suffix[i]` = OR of all elements after index `i`
   - Then for each element `i`, the OR without `nums[i]` is `prefix[i] | suffix[i]`
   - The OR with `nums[i]` shifted by `k` is `(prefix[i] | suffix[i]) | (nums[i] << k)`

4. **Algorithm**:
   - Compute prefix OR array
   - Compute suffix OR array
   - For each index `i`, compute candidate = `(prefix[i] | suffix[i]) | (nums[i] << k)`
   - Track the maximum candidate

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumOr(nums, k):
    """
    Returns the maximum possible OR after applying at most k
    left-shift operations (multiply by 2) to any elements.

    Approach: Use prefix and suffix OR arrays to efficiently
    compute the OR when we apply all k shifts to each element.
    """
    n = len(nums)

    # Step 1: Compute prefix OR array
    # prefix[i] = OR of all elements from index 0 to i-1
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] | nums[i]

    # Step 2: Compute suffix OR array
    # suffix[i] = OR of all elements from index i+1 to n-1
    suffix = [0] * (n + 1)
    for i in range(n - 1, -1, -1):
        suffix[i] = suffix[i + 1] | nums[i]

    # Step 3: Try applying all k shifts to each element
    max_or = 0
    for i in range(n):
        # OR of all elements except nums[i]
        or_without_current = prefix[i] | suffix[i + 1]

        # Apply k left shifts to current element
        # Equivalent to multiplying by 2^k
        shifted_current = nums[i] << k

        # OR including the shifted element
        candidate = or_without_current | shifted_current

        # Update maximum
        max_or = max(max_or, candidate)

    return max_or
```

```javascript
// Time: O(n) | Space: O(n)
function maximumOr(nums, k) {
  /**
   * Returns the maximum possible OR after applying at most k
   * left-shift operations (multiply by 2) to any elements.
   *
   * Approach: Use prefix and suffix OR arrays to efficiently
   * compute the OR when we apply all k shifts to each element.
   */
  const n = nums.length;

  // Step 1: Compute prefix OR array
  // prefix[i] = OR of all elements from index 0 to i-1
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] | nums[i];
  }

  // Step 2: Compute suffix OR array
  // suffix[i] = OR of all elements from index i+1 to n-1
  const suffix = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    suffix[i] = suffix[i + 1] | nums[i];
  }

  // Step 3: Try applying all k shifts to each element
  let maxOr = 0;
  for (let i = 0; i < n; i++) {
    // OR of all elements except nums[i]
    const orWithoutCurrent = prefix[i] | suffix[i + 1];

    // Apply k left shifts to current element
    // Equivalent to multiplying by 2^k
    const shiftedCurrent = nums[i] << k;

    // OR including the shifted element
    const candidate = orWithoutCurrent | shiftedCurrent;

    // Update maximum
    maxOr = Math.max(maxOr, candidate);
  }

  return maxOr;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public long maximumOr(int[] nums, int k) {
        /**
         * Returns the maximum possible OR after applying at most k
         * left-shift operations (multiply by 2) to any elements.
         *
         * Approach: Use prefix and suffix OR arrays to efficiently
         * compute the OR when we apply all k shifts to each element.
         */
        int n = nums.length;

        // Step 1: Compute prefix OR array
        // prefix[i] = OR of all elements from index 0 to i-1
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] | nums[i];
        }

        // Step 2: Compute suffix OR array
        // suffix[i] = OR of all elements from index i+1 to n-1
        long[] suffix = new long[n + 1];
        for (int i = n - 1; i >= 0; i--) {
            suffix[i] = suffix[i + 1] | nums[i];
        }

        // Step 3: Try applying all k shifts to each element
        long maxOr = 0;
        for (int i = 0; i < n; i++) {
            // OR of all elements except nums[i]
            long orWithoutCurrent = prefix[i] | suffix[i + 1];

            // Apply k left shifts to current element
            // Use long to avoid overflow when shifting
            long shiftedCurrent = (long) nums[i] << k;

            // OR including the shifted element
            long candidate = orWithoutCurrent | shiftedCurrent;

            // Update maximum
            maxOr = Math.max(maxOr, candidate);
        }

        return maxOr;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Computing prefix OR array: O(n)
- Computing suffix OR array: O(n)
- Iterating through each element to compute candidates: O(n)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- We store two arrays of size n+1: prefix and suffix
- This is O(2n) = O(n) extra space
- Could be optimized to O(1) by computing suffix on the fly, but O(n) is acceptable for clarity

## Common Mistakes

1. **Distributing shifts among multiple elements**: Many candidates try to split `k` shifts among different elements. This misses the key insight that concentrating shifts on one element is optimal because creating one very high bit is better than creating several medium-high bits.

2. **Overflow with left shifts**: When `k` is large (up to 15 in constraints), shifting can create numbers beyond 32-bit integer range. Always use 64-bit integers (long in Java, normal ints in Python handle big integers automatically).

3. **Forgetting to use prefix/suffix optimization**: Without prefix/suffix arrays, computing the OR without element `i` would be O(n) for each `i`, making the solution O(n²). The prefix/suffix trick reduces this to O(1) per element.

4. **Incorrect array indices**: The prefix and suffix arrays have size `n+1` with `prefix[0] = 0` and `suffix[n] = 0`. A common off-by-one error is using size `n` and getting wrong results at boundaries.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Prefix/Suffix Arrays**: Problems where you need to quickly compute some property of an array excluding each element. Similar problems:
   - **Product of Array Except Self**: Compute product without using division
   - **Left and Right Sum Differences**: Compute sum of elements to left and right

2. **Bit Manipulation with Greedy**: Problems where bitwise operations combine with greedy choices:
   - **Maximum XOR of Two Numbers in an Array**: Use trie to greedily choose bits
   - **Maximum AND Sum of Array**: Bitmask DP with AND operations

3. **Operation Distribution Problems**: Problems where you have limited operations to distribute:
   - **Maximum Product After K Increments**: Similar but with addition instead of shifting
   - **Minimum Operations to Make Array Equal**: Different operation but similar distribution thinking

## Key Takeaways

1. **When dealing with bitwise operations, think in terms of bit positions**: Higher bits dominate, so creating new high bits is more valuable than enhancing existing bits.

2. **Prefix/suffix arrays are powerful for "excluding each element" computations**: When you need to compute a property for each position excluding that element, precompute prefix and suffix arrays to get O(1) queries.

3. **For operation distribution problems, consider extreme distributions first**: Often, applying all operations to one element (or as few as possible) is optimal. Test this hypothesis before considering complex distributions.

[Practice this problem on CodeJeet](/problem/maximum-or)
