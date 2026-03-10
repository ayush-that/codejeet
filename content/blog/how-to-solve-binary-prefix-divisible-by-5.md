---
title: "How to Solve Binary Prefix Divisible By 5 — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Binary Prefix Divisible By 5. Easy difficulty, 53.5% acceptance rate. Topics: Array, Bit Manipulation."
date: "2026-04-07"
category: "dsa-patterns"
tags: ["binary-prefix-divisible-by-5", "array", "bit-manipulation", "easy"]
---

# How to Solve Binary Prefix Divisible By 5

This problem asks us to determine, for each prefix of a binary array, whether the integer value represented by that prefix is divisible by 5. While it seems straightforward, the challenge arises because the numbers can grow exponentially with each additional bit, potentially causing integer overflow in languages with fixed-size integers. The key insight is that we don't need to store the entire number—we only need to track the remainder modulo 5.

## Visual Walkthrough

Let's trace through the example `nums = [1,0,1,1,1,1]`:

**Step 1:** Start with `current = 0`

- Process `nums[0] = 1`: `current = (0 × 2 + 1) % 5 = 1 % 5 = 1`
  - `1 % 5 = 1` → not divisible → `false`

**Step 2:** `current = 1`

- Process `nums[1] = 0`: `current = (1 × 2 + 0) % 5 = 2 % 5 = 2`
  - `2 % 5 = 2` → not divisible → `false`

**Step 3:** `current = 2`

- Process `nums[2] = 1`: `current = (2 × 2 + 1) % 5 = 5 % 5 = 0`
  - `0 % 5 = 0` → divisible → `true`

**Step 4:** `current = 0`

- Process `nums[3] = 1`: `current = (0 × 2 + 1) % 5 = 1 % 5 = 1`
  - `1 % 5 = 1` → not divisible → `false`

**Step 5:** `current = 1`

- Process `nums[4] = 1`: `current = (1 × 2 + 1) % 5 = 3 % 5 = 3`
  - `3 % 5 = 3` → not divisible → `false`

**Step 6:** `current = 3`

- Process `nums[5] = 1`: `current = (3 × 2 + 1) % 5 = 7 % 5 = 2`
  - `2 % 5 = 2` → not divisible → `false`

Final result: `[false, false, true, false, false, false]`

The pattern is: when we append a new bit to an existing binary number, we're effectively shifting left (multiplying by 2) and then adding the new bit. By taking modulo 5 at each step, we keep the number small while preserving the divisibility property.

## Brute Force Approach

A naive approach would be to actually construct each binary number from the prefix and check divisibility:

1. For each index `i` from 0 to `n-1`:
   - Convert the subarray `nums[0..i]` to its integer value
   - Check if that value is divisible by 5
   - Store the result

The problem with this approach is that binary numbers grow exponentially. For an array of length `n`, the largest number could have `n` bits, which requires `O(n)` bits to store. In languages with fixed-size integers (like 32-bit or 64-bit), this would quickly cause overflow for moderately large `n`. Even with arbitrary-precision integers (like Python's `int`), the time complexity becomes `O(n²)` because building each number from scratch takes `O(i)` time for the i-th prefix.

## Optimal Solution

The optimal solution uses modular arithmetic to avoid storing large numbers. The key observation is that if `x % 5 = r`, then `(2x + b) % 5 = (2r + b) % 5` where `b` is the new bit (0 or 1). This allows us to maintain only the remainder modulo 5 as we process each bit.

<div class="code-group">

```python
# Time: O(n) | Space: O(1) excluding output
def prefixesDivBy5(nums):
    """
    Returns a list of booleans indicating whether each prefix
    of the binary array is divisible by 5.

    Args:
        nums: List[int] - binary array containing only 0s and 1s

    Returns:
        List[bool] - result for each prefix
    """
    result = []  # Store results for each prefix
    current = 0  # Current remainder modulo 5

    # Process each bit in the array
    for bit in nums:
        # Update remainder: (previous_remainder * 2 + new_bit) % 5
        # The modulo operation keeps the number small
        current = (current * 2 + bit) % 5

        # Check if current remainder is 0 (divisible by 5)
        result.append(current == 0)

    return result
```

```javascript
// Time: O(n) | Space: O(1) excluding output
/**
 * Returns an array of booleans indicating whether each prefix
 * of the binary array is divisible by 5.
 *
 * @param {number[]} nums - binary array containing only 0s and 1s
 * @return {boolean[]} - result for each prefix
 */
function prefixesDivBy5(nums) {
  const result = []; // Store results for each prefix
  let current = 0; // Current remainder modulo 5

  // Process each bit in the array
  for (const bit of nums) {
    // Update remainder: (previous_remainder * 2 + new_bit) % 5
    // The modulo operation keeps the number small
    current = (current * 2 + bit) % 5;

    // Check if current remainder is 0 (divisible by 5)
    result.push(current === 0);
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1) excluding output
import java.util.ArrayList;
import java.util.List;

class Solution {
    /**
     * Returns a list of booleans indicating whether each prefix
     * of the binary array is divisible by 5.
     *
     * @param nums - binary array containing only 0s and 1s
     * @return List<Boolean> - result for each prefix
     */
    public List<Boolean> prefixesDivBy5(int[] nums) {
        List<Boolean> result = new ArrayList<>();  // Store results for each prefix
        int current = 0;  // Current remainder modulo 5

        // Process each bit in the array
        for (int bit : nums) {
            // Update remainder: (previous_remainder * 2 + new_bit) % 5
            // The modulo operation keeps the number small
            current = (current * 2 + bit) % 5;

            // Check if current remainder is 0 (divisible by 5)
            result.add(current == 0);
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** `O(n)` where `n` is the length of the input array. We process each element exactly once, performing constant-time operations (multiplication, addition, and modulo) for each element.

**Space Complexity:** `O(1)` extra space (excluding the output array). We only use a constant amount of additional space to store the current remainder. The output array itself requires `O(n)` space, but this is typically not counted toward space complexity in interview settings unless specified otherwise.

## Common Mistakes

1. **Not using modulo at each step:** Some candidates try to accumulate the full binary number, which causes integer overflow in languages with fixed-size integers. Even in Python where integers can be arbitrarily large, this approach is inefficient for large inputs.

2. **Incorrect update formula:** The correct formula is `current = (current * 2 + bit) % 5`. Common mistakes include:
   - Forgetting to multiply by 2 (which corresponds to the left shift operation)
   - Applying modulo only at the end instead of at each step
   - Using bitwise operations incorrectly (e.g., `current << 1 + bit` without proper parentheses)

3. **Confusing binary representation:** Remember that `nums[0]` is the most significant bit. When we process bits left to right, we're building the number from most significant to least significant, which is the natural reading order for binary numbers.

4. **Return type confusion:** The problem asks for an array/list of booleans, not integers or strings. Make sure to return the correct type in your language.

## When You'll See This Pattern

This problem demonstrates the **modular arithmetic** pattern, which is useful when:

- You need to check divisibility properties of large numbers
- Numbers grow exponentially or factorially in a sequence
- You only care about the remainder, not the actual value

Similar problems that use this pattern:

1. **Subarray Sums Divisible by K (LeetCode 974)** - Uses prefix sums with modulo to find subarrays divisible by K
2. **Continuous Subarray Sum (LeetCode 523)** - Checks if there's a subarray with sum multiple of k using modulo arithmetic
3. **Pairs of Songs With Total Durations Divisible by 60 (LeetCode 1010)** - Uses remainders modulo 60 to find complementary pairs

The core idea is always the same: instead of tracking the actual (potentially large) values, track their remainders modulo some number, since many properties (like divisibility) depend only on the remainder.

## Key Takeaways

1. **Modular arithmetic prevents overflow:** When dealing with numbers that grow quickly in sequences, use modulo operations to keep them bounded while preserving divisibility properties.

2. **Update formulas for building numbers:** When building a number digit by digit (in any base), the update rule is `new_value = old_value * base + new_digit`. For binary, the base is 2.

3. **Divisibility checks only need remainders:** To check if `x` is divisible by `m`, you only need to know if `x % m == 0`. You don't need the actual value of `x`.

Related problems: [Average Value of Even Numbers That Are Divisible by Three](/problem/average-value-of-even-numbers-that-are-divisible-by-three), [Find the Maximum Divisibility Score](/problem/find-the-maximum-divisibility-score)
