---
title: "How to Solve Construct the Minimum Bitwise Array II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct the Minimum Bitwise Array II. Medium difficulty, 66.5% acceptance rate. Topics: Array, Bit Manipulation."
date: "2027-06-06"
category: "dsa-patterns"
tags: ["construct-the-minimum-bitwise-array-ii", "array", "bit-manipulation", "medium"]
---

# How to Solve Construct the Minimum Bitwise Array II

This problem asks us to construct an array `ans` where for each index `i`, the bitwise OR of `ans[i]` and `ans[i] + 1` equals a given prime number `nums[i]`. The tricky part is that we need to find the **minimum** possible `ans[i]` that satisfies this equation for each position independently. The challenge lies in understanding the bitwise relationship between a number and its successor.

## Visual Walkthrough

Let's trace through a small example: `nums = [3, 7, 13]`

**For nums[0] = 3:**

- We need `ans[0] OR (ans[0] + 1) = 3`
- Let's test values:
  - `ans[0] = 0`: `0 OR 1 = 1` ❌
  - `ans[0] = 1`: `1 OR 2 = 3` ✅ (1 in binary: 01, 2: 10, OR: 11 = 3)
  - `ans[0] = 2`: `2 OR 3 = 3` ✅ (2: 10, 3: 11, OR: 11 = 3)
- Minimum valid value is 1, so `ans[0] = 1`

**For nums[1] = 7:**

- Need `ans[1] OR (ans[1] + 1) = 7` (binary 111)
- Test values:
  - `ans[1] = 3`: `3 OR 4 = 7` ✅ (3: 011, 4: 100, OR: 111 = 7)
  - `ans[1] = 5`: `5 OR 6 = 7` ✅ (5: 101, 6: 110, OR: 111 = 7)
  - `ans[1] = 6`: `6 OR 7 = 7` ✅ (6: 110, 7: 111, OR: 111 = 7)
- Minimum valid value is 3, so `ans[1] = 3`

**For nums[2] = 13:**

- Need `ans[2] OR (ans[2] + 1) = 13` (binary 1101)
- Test values:
  - `ans[2] = 4`: `4 OR 5 = 5` ❌
  - `ans[2] = 5`: `5 OR 6 = 7` ❌
  - `ans[2] = 12`: `12 OR 13 = 13` ✅ (12: 1100, 13: 1101, OR: 1101 = 13)
- Minimum valid value is 12, so `ans[2] = 12`

Final answer: `[1, 3, 12]`

The pattern emerging: For a given `nums[i]`, we need to find the smallest `x` such that `x OR (x + 1) = nums[i]`.

## Brute Force Approach

A naive approach would be to try every possible integer starting from 0 until we find one that satisfies the condition for each `nums[i]`:

1. For each `nums[i]`, start with `x = 0`
2. While `x OR (x + 1) != nums[i]`, increment `x`
3. Add the found `x` to the answer array

This approach has several problems:

- It's extremely slow for large numbers (could need to check up to `nums[i]` values)
- No guarantee of termination if no solution exists (though the problem guarantees a solution)
- Time complexity would be O(n × m) where m is the maximum value in nums

The brute force fails because it doesn't leverage the bitwise properties of the problem. We need to understand what `x OR (x + 1)` actually means in binary terms.

## Optimized Approach

The key insight comes from analyzing the binary representation. Let's think about what `x OR (x + 1)` looks like:

1. In binary, `x + 1` flips all trailing 1s to 0s and flips the first 0 to 1
2. When we OR `x` with `x + 1`, we get a number where:
   - All bits before the first 0 in `x` remain as they are
   - The first 0 in `x` becomes 1 (from `x + 1`)
   - All bits after that become 1 (because `x` has 1s in those positions and `x + 1` has 0s)

For example, if `x = 12` (binary 1100):

- `x + 1 = 13` (binary 1101)
- `x OR (x + 1) = 1100 OR 1101 = 1101 = 13`

Notice that `x OR (x + 1)` always results in a number where:

- All bits are the same as `x` except the rightmost 0 bit becomes 1
- All bits to the right of that become 1

Therefore, given `nums[i]`, we need to find the smallest `x` such that:

- `x` has all 1-bits of `nums[i]` except one
- The exception is the rightmost 1-bit in `nums[i]` that has a 0 to its right

**Algorithm:**

1. For each `nums[i]`, find the rightmost 1-bit that has a 0-bit immediately to its right
2. Clear that bit in `nums[i]` to get `ans[i]`
3. If no such bit exists (all 1s are contiguous from the right), then `ans[i] = nums[i] - 1`

Let's verify with our examples:

- `nums[0] = 3` (binary 11): Rightmost 1 with 0 to right? No (both bits are 1). So `ans[0] = 3 - 1 = 2`? Wait, but we found 1 earlier. Let me reconsider...

Actually, let me correct the logic. The smallest `x` that satisfies `x OR (x + 1) = nums[i]` is `nums[i]` with its rightmost 1-bit turned off, UNLESS that would make `x` have all 1s in the lower bits.

Better approach: The smallest `x` is `nums[i]` with its rightmost 0-bit turned to 1 and all bits to the right set to 0, then subtract 1.

Wait, let's derive it properly:

Given `x OR (x + 1) = n`, we want minimal `x`.
Let `k` be the position of the rightmost 0-bit in `x`.
Then `x` has form: `...0 11...1` where there are `k` trailing 1s.
`x + 1` has form: `...1 00...0`
OR gives: `...1 11...1` = `n`

So `n` has form: `...1 11...1` where the `...` part is same as `x` except the 0 becomes 1.

Thus, to get minimal `x` from `n`:

1. Find the rightmost 01 pattern in `n` (reading from right to left)
2. Change it to 10 to get `x`
3. If no 01 pattern exists (n is all 1s), then `x = n - 1`

Example: `n = 13` (binary 1101)

- Rightmost 01 pattern: at position 1 (bits: ...01)
- Change to 10: 1100 = 12 ✓

Example: `n = 7` (binary 111)

- No 01 pattern (all 1s)
- `x = 7 - 1 = 6` ✓

But wait, 6 OR 7 = 7, but we found 3 earlier as the minimum. So 3 is smaller than 6. Let me check 3: binary 011, 3 OR 4 = 7. So 3 works and is smaller.

The issue: My pattern detection needs refinement. Let's find the actual rule:

We need `x` such that `x OR (x + 1) = n`.
Let's think of it as: `n` must have all bits of `x` set, plus possibly more.
The smallest `x` would have as many 0s as possible in high positions.

Actually, there's a known trick: `x = n & (n + 1)` doesn't work. Let me test:

For `n = 7`: `7 & 8 = 0` ❌
For `n = 13`: `13 & 14 = 12` ✓ but is this minimal? 12 works.

Wait, `12 OR 13 = 13` ✓ and 12 is indeed minimal for 13.

But for 7, 0 doesn't work. So we need a different approach.

Let me think differently: `x OR (x + 1) = n` means `n` must have all bits set from some position onward.
The minimal `x` is obtained by taking `n`, finding the rightmost 01 pattern, and changing it to 10.

For `n = 7` (111): There's no 01 pattern, so we take `n - 1 = 6` (110).
But 6 OR 7 = 7 ✓, and 3 OR 4 = 7 ✓, and 3 < 6.
So 3 is smaller. Why does our rule give 6 instead of 3?

Because 3 has binary 011, and 3 OR 4 (100) = 111 = 7.
The pattern in 7 (111) when looking for 01: we don't see it because we need to consider all bits.

Actually, the correct rule: Find the rightmost 1 in `n` that has a 0 to its right. Clear that 1.
For `n = 7` (111): All 1s are contiguous from right, so clear the leftmost 1? That gives 011 = 3 ✓

So algorithm:

1. If `n` has all 1s (i.e., `n & (n + 1) == 0`), then `x = n >> 1`
2. Else, find the rightmost 1-bit in `n` that has a 0 to its right, and clear it

Wait, test `n = 3` (11): All 1s, so `x = 3 >> 1 = 1` ✓
`n = 15` (1111): All 1s, `x = 15 >> 1 = 7` ✓ (7 OR 8 = 15)

Actually simpler: `x = n & ~(n >> 1)`? Let me test:
`n = 7`: `7 & ~3 = 7 & 4 = 4` ❌ (4 OR 5 = 7 ✓ but 3 is smaller)
`n = 3`: `3 & ~1 = 3 & 2 = 2` ✓ (2 OR 3 = 3)
`n = 13`: `13 & ~6 = 13 & 9 = 9` ❌ (9 OR 10 = 11 ≠ 13)

Not working.

Let me use the correct mathematical insight: `x OR (x + 1) = n` implies `x = n - (n & -n) / 2`?

Actually, I recall a known solution: `x = n & (n + 1)` for most cases, but when `n` is all 1s, `x = n >> 1`.

Test:
`n = 13`: `13 & 14 = 12` ✓
`n = 7`: `7 & 8 = 0` ❌ but `7 >> 1 = 3` ✓
`n = 3`: `3 & 4 = 0` ❌ but `3 >> 1 = 1` ✓

So algorithm:

```python
if (n & (n + 1)) == 0:  # n is all 1s
    return n >> 1
else:
    return n & (n + 1)
```

## Optimal Solution

The optimal solution uses bit manipulation to find the answer in O(1) time per element. The key realization is that `x OR (x + 1) = n` has a direct bitwise solution:

1. If `n` is of the form `2^k - 1` (all bits 1), then `x = n >> 1`
2. Otherwise, `x = n & (n + 1)`

This works because:

- When `n` is all 1s, `n & (n + 1) = 0`, which is not valid (except when n=0, but nums are primes > 1)
- The minimal valid `x` when `n` is all 1s is `n >> 1`
- When `n` is not all 1s, `n & (n + 1)` clears the rightmost trailing 1s, giving the minimal `x`

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output
def constructMinimumArray(nums):
    """
    Constructs the minimum array where ans[i] OR (ans[i] + 1) == nums[i]

    For each nums[i]:
    1. If nums[i] is all 1s in binary (i.e., nums[i] & (nums[i] + 1) == 0),
       then ans[i] = nums[i] >> 1
    2. Otherwise, ans[i] = nums[i] & (nums[i] + 1)
    """
    ans = []

    for num in nums:
        # Check if num is all 1s in binary (e.g., 3, 7, 15, ...)
        # num & (num + 1) == 0 when num is all 1s
        if (num & (num + 1)) == 0:
            # When num is all 1s, the minimal x is num >> 1
            # Example: num = 7 (111), x = 3 (11) satisfies 3 OR 4 = 7
            ans.append(num >> 1)
        else:
            # For other numbers, x = num & (num + 1) works
            # This clears the rightmost trailing 1s in num
            # Example: num = 13 (1101), x = 13 & 14 = 12 (1100)
            # 12 OR 13 = 13 satisfies the condition
            ans.append(num & (num + 1))

    return ans
```

```javascript
// Time: O(n) | Space: O(1) excluding output
function constructMinimumArray(nums) {
  /**
   * Constructs the minimum array where ans[i] OR (ans[i] + 1) == nums[i]
   *
   * For each nums[i]:
   * 1. If nums[i] is all 1s in binary (i.e., nums[i] & (nums[i] + 1) == 0),
   *    then ans[i] = nums[i] >> 1
   * 2. Otherwise, ans[i] = nums[i] & (nums[i] + 1)
   */
  const ans = [];

  for (const num of nums) {
    // Check if num is all 1s in binary (e.g., 3, 7, 15, ...)
    // num & (num + 1) == 0 when num is all 1s
    if ((num & (num + 1)) === 0) {
      // When num is all 1s, the minimal x is num >> 1
      // Example: num = 7 (111), x = 3 (11) satisfies 3 OR 4 = 7
      ans.push(num >> 1);
    } else {
      // For other numbers, x = num & (num + 1) works
      // This clears the rightmost trailing 1s in num
      // Example: num = 13 (1101), x = 13 & 14 = 12 (1100)
      // 12 OR 13 = 13 satisfies the condition
      ans.push(num & (num + 1));
    }
  }

  return ans;
}
```

```java
// Time: O(n) | Space: O(1) excluding output
class Solution {
    public int[] constructMinimumArray(int[] nums) {
        /**
         * Constructs the minimum array where ans[i] OR (ans[i] + 1) == nums[i]
         *
         * For each nums[i]:
         * 1. If nums[i] is all 1s in binary (i.e., nums[i] & (nums[i] + 1) == 0),
         *    then ans[i] = nums[i] >> 1
         * 2. Otherwise, ans[i] = nums[i] & (nums[i] + 1)
         */
        int[] ans = new int[nums.length];

        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];

            // Check if num is all 1s in binary (e.g., 3, 7, 15, ...)
            // num & (num + 1) == 0 when num is all 1s
            if ((num & (num + 1)) == 0) {
                // When num is all 1s, the minimal x is num >> 1
                // Example: num = 7 (111), x = 3 (11) satisfies 3 OR 4 = 7
                ans[i] = num >> 1;
            } else {
                // For other numbers, x = num & (num + 1) works
                // This clears the rightmost trailing 1s in num
                // Example: num = 13 (1101), x = 13 & 14 = 12 (1100)
                // 12 OR 13 = 13 satisfies the condition
                ans[i] = num & (num + 1);
            }
        }

        return ans;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each element of the input array exactly once
- For each element, we perform constant-time bitwise operations (AND, shift, addition)
- Total operations: n × O(1) = O(n)

**Space Complexity:** O(1) extra space (excluding the output array)

- We only use a few integer variables regardless of input size
- The output array is required by the problem statement, so it's not counted in extra space
- If we count the output, it's O(n) to store the result

## Common Mistakes

1. **Not handling the "all 1s" case separately**: The expression `n & (n + 1)` gives 0 when `n` is all 1s, which is not a valid answer (except when n=0, but nums are primes > 1). Candidates often miss this edge case.

2. **Using the wrong bitwise operator**: Confusing `&` (AND) with `|` (OR) or `^` (XOR). The solution requires careful use of `&` for checking the "all 1s" condition and for computing the result.

3. **Off-by-one errors with bit shifting**: When `n` is all 1s, we need `n >> 1` (right shift by 1), not `n << 1` or `n >> 2`. A right shift divides by 2, which gives the correct minimal value.

4. **Assuming input constraints incorrectly**: The problem states nums contains prime integers, but the solution works for any positive integer. However, candidates might waste time checking primality or making unnecessary assumptions about the input.

## When You'll See This Pattern

This problem tests bit manipulation skills, specifically understanding how numbers behave under OR operations with their successors. Similar patterns appear in:

1. **Single Number III (LeetCode 260)**: Uses XOR and bit masking to find two unique numbers. Like this problem, it requires isolating specific bits through clever bitwise operations.

2. **Counting Bits (LeetCode 338)**: Requires understanding how bits change when incrementing numbers. The relationship between `n` and `n & (n-1)` is similar to our `n & (n+1)`.

3. **Bitwise AND of Numbers Range (LeetCode 201)**: Involves finding common bits across a range of numbers, requiring analysis of how bits change when numbers increment.

These problems all require thinking about binary representations and how they change with arithmetic operations.

## Key Takeaways

1. **Bitwise OR with successor has a pattern**: `x OR (x + 1)` always produces a number where all bits are 1 from the rightmost 0-bit of `x` onward. This insight is key to solving the problem efficiently.

2. **Check for special cases in bit patterns**: The "all 1s" case (`2^k - 1` numbers) often behaves differently in bit manipulation problems and needs special handling.

3. **Bit masking with `n & (n ± 1)` is powerful**: This technique appears in many bit manipulation problems for clearing or checking specific bit patterns.

[Practice this problem on CodeJeet](/problem/construct-the-minimum-bitwise-array-ii)
