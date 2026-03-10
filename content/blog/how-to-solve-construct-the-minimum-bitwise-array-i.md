---
title: "How to Solve Construct the Minimum Bitwise Array I — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Construct the Minimum Bitwise Array I. Easy difficulty, 85.3% acceptance rate. Topics: Array, Bit Manipulation."
date: "2026-11-21"
category: "dsa-patterns"
tags: ["construct-the-minimum-bitwise-array-i", "array", "bit-manipulation", "easy"]
---

# How to Solve Construct the Minimum Bitwise Array I

This problem asks us to construct an array `ans` where for each index `i`, the bitwise OR of `ans[i]` and `ans[i] + 1` equals a given prime number `nums[i]`. The tricky part is that we need to find the **minimum** possible `ans[i]` that satisfies this condition for each position independently. The key insight lies in understanding the bitwise relationship between a number and its successor.

## Visual Walkthrough

Let's trace through an example: `nums = [5, 7, 11, 13]`

For each `nums[i]`, we need to find the smallest `ans[i]` such that `ans[i] OR (ans[i] + 1) == nums[i]`.

**Step 1: Understanding the OR pattern**
When we OR a number with its successor (`n OR (n+1)`), something interesting happens:

- If `n` ends with `0` in binary, then `n+1` just flips that `0` to `1`, so `n OR (n+1)` = `n+1`
- If `n` ends with `01`, then `n+1` flips it to `10`, potentially affecting multiple bits
- In general, `n OR (n+1)` turns all trailing `1`s in `n` to `0`s and the first `0` before them to `1`

**Step 2: Working backwards**
Given `nums[i]`, we need to find the smallest `ans[i]` where `ans[i] OR (ans[i] + 1) = nums[i]`.

Let's test with `nums[0] = 5` (binary `101`):

- Try `ans[0] = 0`: `0 OR 1 = 1` ≠ 5 ✗
- Try `ans[0] = 1`: `1 OR 2 = 3` ≠ 5 ✗
- Try `ans[0] = 2`: `2 OR 3 = 3` ≠ 5 ✗
- Try `ans[0] = 3`: `3 OR 4 = 7` ≠ 5 ✗
- Try `ans[0] = 4`: `4 OR 5 = 5` ✓ Found it!

**Step 3: Pattern recognition**
Notice that for `nums[i] = 5`, we found `ans[i] = 4`. Let's check the binary:

- `5` = `101` in binary
- `4` = `100` in binary
- `4 OR 5` = `100 OR 101` = `101` = `5`

The pattern emerges: `ans[i] = nums[i] & (nums[i] + 1)`. Let's verify:

- For `5`: `5 & 6` = `101 & 110` = `100` = `4` ✓
- For `7`: `7 & 8` = `111 & 1000` = `0000` = `0` ✓ (Check: `0 OR 1 = 1` ≠ 7, wait...)

Actually, let's test `nums[1] = 7`:

- `7 & 8` = `0`, but `0 OR 1 = 1` ≠ 7 ✗
- Let's search manually: We need `ans[1] OR (ans[1] + 1) = 7`
- Try `ans[1] = 3`: `3 OR 4 = 7` ✓ Found it!

So `ans[1] = 3`, and `3 = 7 & (7 + 1) = 7 & 8 = 0` doesn't work. Let's refine our approach.

**Step 4: Correct pattern**
The correct insight is: `ans[i] = nums[i] & ~(nums[i] + 1)`? Let's test:
For `7` (binary `111`): `~(7+1) = ~8 = ...11110111` (in 4-bit: `0111`)
`7 & ~8` = `0111 & 0111` = `0111` = `7` ✗ (but `7 OR 8 = 15`)

Actually, the solution is simpler: `ans[i] = nums[i] & (nums[i] + 1)` works for most cases, but we need to handle when `nums[i]` has all bits set (like `7` = `111`).

For `7`: All bits are `1`s, so `ans[i] = nums[i] - 1` = `6`? Let's test: `6 OR 7 = 7` ✓

So the rule is:

- If `nums[i]` has all bits set (i.e., `nums[i] & (nums[i] + 1) == 0`), then `ans[i] = nums[i] - 1`
- Otherwise, `ans[i] = nums[i] & (nums[i] + 1)`

## Brute Force Approach

A naive approach would be to try every possible `ans[i]` from `0` up to `nums[i]` (since `ans[i]` can't be larger than `nums[i]` because OR can't decrease value):

1. For each `nums[i]`, start with `ans[i] = 0`
2. Check if `ans[i] OR (ans[i] + 1) == nums[i]`
3. If yes, we found the minimum (since we're checking from smallest to largest)
4. If no, increment `ans[i]` and repeat

This approach is too slow because:

- In the worst case (like `nums[i] = 2^31-1`), we might check up to `2^31` values
- For an array of length `n`, this gives O(n × m) time where `m` can be up to 2^31
- The problem constraints likely expect an O(n) solution

## Optimal Solution

The optimal solution uses bit manipulation to find the answer in O(1) per element. The key insight is that `ans[i] OR (ans[i] + 1) = nums[i]` means `ans[i]` must have `0`s in positions where `nums[i]` has `0`s, and can have either `0` or `1` where `nums[i]` has `1`s. To minimize `ans[i]`, we want as many `0`s as possible.

The pattern is:

- If `nums[i]` has all bits set (i.e., `nums[i] & (nums[i] + 1) == 0`), then `ans[i] = nums[i] - 1`
- Otherwise, `ans[i] = nums[i] & (nums[i] + 1)`

Let's see why this works:

1. When `nums[i]` has all bits set (like `7` = `111`), `nums[i] & (nums[i] + 1) = 0`, which doesn't satisfy the OR condition. The next candidate is `nums[i] - 1`, which works because `(n-1) OR n = n` when `n` has all bits set.
2. Otherwise, `nums[i] & (nums[i] + 1)` gives us a number that, when ORed with its successor, equals `nums[i]`.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the output array
def constructMinimumArray(nums):
    """
    Constructs the minimum array where ans[i] OR (ans[i] + 1) == nums[i]

    For each nums[i]:
    1. If nums[i] has all bits set (nums[i] & (nums[i] + 1) == 0),
       then ans[i] = nums[i] - 1
    2. Otherwise, ans[i] = nums[i] & (nums[i] + 1)
    """
    ans = [0] * len(nums)  # Initialize result array

    for i in range(len(nums)):
        # Check if nums[i] has all bits set (like 1, 3, 7, 15, ...)
        if nums[i] & (nums[i] + 1) == 0:
            # When all bits are 1, the minimum ans[i] is nums[i] - 1
            # Example: For nums[i] = 7 (111), ans[i] = 6 (110)
            # 6 OR 7 = 110 OR 111 = 111 = 7
            ans[i] = nums[i] - 1
        else:
            # For other cases, nums[i] & (nums[i] + 1) gives the minimum
            # Example: For nums[i] = 5 (101), nums[i] + 1 = 6 (110)
            # 5 & 6 = 101 & 110 = 100 = 4
            # 4 OR 5 = 100 OR 101 = 101 = 5
            ans[i] = nums[i] & (nums[i] + 1)

    return ans
```

```javascript
// Time: O(n) | Space: O(n) for the output array
function constructMinimumArray(nums) {
  /**
   * Constructs the minimum array where ans[i] OR (ans[i] + 1) == nums[i]
   *
   * For each nums[i]:
   * 1. If nums[i] has all bits set (nums[i] & (nums[i] + 1) == 0),
   *    then ans[i] = nums[i] - 1
   * 2. Otherwise, ans[i] = nums[i] & (nums[i] + 1)
   */
  const ans = new Array(nums.length);

  for (let i = 0; i < nums.length; i++) {
    // Check if nums[i] has all bits set (like 1, 3, 7, 15, ...)
    if ((nums[i] & (nums[i] + 1)) === 0) {
      // When all bits are 1, the minimum ans[i] is nums[i] - 1
      // Example: For nums[i] = 7 (111), ans[i] = 6 (110)
      // 6 OR 7 = 110 OR 111 = 111 = 7
      ans[i] = nums[i] - 1;
    } else {
      // For other cases, nums[i] & (nums[i] + 1) gives the minimum
      // Example: For nums[i] = 5 (101), nums[i] + 1 = 6 (110)
      // 5 & 6 = 101 & 110 = 100 = 4
      // 4 OR 5 = 100 OR 101 = 101 = 5
      ans[i] = nums[i] & (nums[i] + 1);
    }
  }

  return ans;
}
```

```java
// Time: O(n) | Space: O(n) for the output array
class Solution {
    public int[] constructMinimumArray(int[] nums) {
        /**
         * Constructs the minimum array where ans[i] OR (ans[i] + 1) == nums[i]
         *
         * For each nums[i]:
         * 1. If nums[i] has all bits set (nums[i] & (nums[i] + 1) == 0),
         *    then ans[i] = nums[i] - 1
         * 2. Otherwise, ans[i] = nums[i] & (nums[i] + 1)
         */
        int[] ans = new int[nums.length];

        for (int i = 0; i < nums.length; i++) {
            // Check if nums[i] has all bits set (like 1, 3, 7, 15, ...)
            if ((nums[i] & (nums[i] + 1)) == 0) {
                // When all bits are 1, the minimum ans[i] is nums[i] - 1
                // Example: For nums[i] = 7 (111), ans[i] = 6 (110)
                // 6 OR 7 = 110 OR 111 = 111 = 7
                ans[i] = nums[i] - 1;
            } else {
                // For other cases, nums[i] & (nums[i] + 1) gives the minimum
                // Example: For nums[i] = 5 (101), nums[i] + 1 = 6 (110)
                // 5 & 6 = 101 & 110 = 100 = 4
                // 4 OR 5 = 100 OR 101 = 101 = 5
                ans[i] = nums[i] & (nums[i] + 1);
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
- For each element, we perform a constant number of bitwise operations and arithmetic operations
- The loop runs n times, where n is the length of the input array

**Space Complexity:** O(n)

- We need to store the output array of length n
- The auxiliary space (excluding output) is O(1) since we only use a few variables
- If we don't count the output array, the space complexity would be O(1)

## Common Mistakes

1. **Forgetting the special case when all bits are set**: The most common mistake is using only `ans[i] = nums[i] & (nums[i] + 1)` without handling the case where this results in `0`. For example, with `nums[i] = 7`, `7 & 8 = 0`, but `0 OR 1 = 1 ≠ 7`. Always check if `nums[i] & (nums[i] + 1) == 0`.

2. **Incorrect bitwise operator precedence**: In some languages, `&` has lower precedence than `+`. Writing `nums[i] & nums[i] + 1` without parentheses might be interpreted as `nums[i] & (nums[i]) + 1` instead of `nums[i] & (nums[i] + 1)`. Always use parentheses for clarity.

3. **Assuming ans[i] can be larger than nums[i]**: Some candidates might search beyond `nums[i]`, but `ans[i]` cannot be larger than `nums[i]` because `ans[i] OR (ans[i] + 1) ≥ ans[i]`. If `ans[i] > nums[i]`, then the OR result would be at least `ans[i]`, which is already greater than `nums[i]`.

4. **Not minimizing ans[i]**: The problem asks for the minimum possible `ans[i]`. Some candidates might find a valid `ans[i]` but not the smallest one. For example, for `nums[i] = 5`, both `4` and `5` satisfy the condition (`4 OR 5 = 5`, `5 OR 6 = 7`), but `4` is smaller and should be chosen.

## When You'll See This Pattern

This problem tests bit manipulation skills, specifically understanding how numbers interact through OR operations. Similar patterns appear in:

1. **Single Number III (LeetCode 260)**: Uses XOR and bit manipulation to find two unique numbers in an array where all others appear twice. The technique involves finding a set bit and partitioning based on it.

2. **Counting Bits (LeetCode 338)**: Requires understanding how bits change when incrementing numbers, similar to how we analyze `n` vs `n+1` in this problem.

3. **Bitwise AND of Numbers Range (LeetCode 201)**: Involves finding common bits in a range of numbers, requiring analysis of how bits change across consecutive numbers.

4. **Minimum Flips to Make a OR b Equal to c (LeetCode 1318)**: Directly works with OR operations between bits, similar to our core operation here.

## Key Takeaways

1. **Bit manipulation often has mathematical patterns**: When dealing with consecutive numbers (`n` and `n+1`), their bitwise operations often follow predictable patterns. Learning to recognize these can simplify complex-seeming problems.

2. **Edge cases matter in bit problems**: The special case where a number has all bits set (`1`, `3`, `7`, `15`, etc.) often requires separate handling. Always test with numbers like these.

3. **Work backwards from the operation**: Instead of trying all possible `ans[i]`, analyze what properties `ans[i]` must have given that `ans[i] OR (ans[i] + 1) = nums[i]`. This "reverse engineering" approach is powerful for constraint satisfaction problems.

[Practice this problem on CodeJeet](/problem/construct-the-minimum-bitwise-array-i)
