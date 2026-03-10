---
title: "How to Solve Maximum XOR After Operations  — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum XOR After Operations . Medium difficulty, 79.9% acceptance rate. Topics: Array, Math, Bit Manipulation."
date: "2029-04-10"
category: "dsa-patterns"
tags: ["maximum-xor-after-operations", "array", "math", "bit-manipulation", "medium"]
---

# How to Solve Maximum XOR After Operations

This problem asks us to find the maximum possible XOR value we can obtain from an array after performing operations that allow us to clear bits in each number. The tricky part is understanding what the operation `nums[i] AND (nums[i] XOR x)` actually allows us to do, and then realizing that this gives us complete control over which bits we can keep or clear in each number.

## Visual Walkthrough

Let's walk through an example: `nums = [3, 2, 4, 6]` (binary: `[011, 010, 100, 110]`).

**Understanding the operation:**
The operation is `nums[i] AND (nums[i] XOR x)`. Let's break this down:

- `nums[i] XOR x` flips bits where `x` has 1s
- Then we AND with the original `nums[i]`

What does this mean for each bit position?

- If a bit in `nums[i]` is 0, it stays 0 (0 AND anything = 0)
- If a bit in `nums[i]` is 1:
  - If we set the corresponding bit in `x` to 0, then `nums[i] XOR x` keeps that bit as 1, and `1 AND 1 = 1`
  - If we set the corresponding bit in `x` to 1, then `nums[i] XOR x` flips it to 0, and `1 AND 0 = 0`

So for each 1-bit in `nums[i]`, we can choose to keep it (by setting `x`'s bit to 0) or clear it (by setting `x`'s bit to 1). We have no control over 0-bits - they must remain 0.

**Applying to our example:**
We want to maximize the XOR of all numbers. XOR has this property: a bit is 1 in the result if an odd number of numbers have that bit set to 1.

For each bit position, we can look at all numbers and see which ones have a 1 in that position. For each such number, we can choose whether to keep or clear that bit.

The key insight: **For each bit position, if ANY number has a 1 in that position, we can make the XOR result have a 1 in that position.**

Why? If k numbers have a 1 in a particular bit position:

- If k is odd: we keep all those bits, and we get 1 in the XOR
- If k is even: we clear exactly one of those bits (making k-1, which is odd), and we get 1 in the XOR

So the maximum XOR is simply the bitwise OR of all numbers! Let's verify:

`3 OR 2 OR 4 OR 6 = 011 OR 010 OR 100 OR 110 = 111` (binary) = 7 (decimal)

The maximum XOR we can achieve is 7.

## Brute Force Approach

A naive approach would be to try all possible combinations of operations. For each number, we can choose to clear any subset of its 1-bits. With n numbers and up to 30 bits per number (since numbers are up to 10^9, which fits in 30 bits), there are 2^(30n) possibilities - completely infeasible.

Even if we think about it differently - trying to maximize XOR by considering each bit position independently - a brute force would need to consider all 2^30 possible XOR results, which is still 1 billion possibilities.

The brute force approach fails because it doesn't recognize the mathematical property that makes this problem solvable in linear time.

## Optimized Approach

The key insight comes from understanding what the operation allows us to do:

1. **Operation analysis:** `nums[i] AND (nums[i] XOR x)` lets us clear any subset of 1-bits in `nums[i]`, but we cannot set any 0-bit to 1.

2. **XOR property:** The XOR of multiple numbers has a 1 in a bit position if an odd number of the numbers have a 1 in that position.

3. **Combining insights:** For each bit position:
   - If no number has a 1 in that position, the XOR result must have 0 there (we can't create 1s from nothing)
   - If at least one number has a 1 in that position, we can arrange for the XOR result to have 1 there:
     - If an odd number of numbers have 1 there, keep all those bits
     - If an even number of numbers have 1 there, clear exactly one of them (making it odd)

4. **Final realization:** The maximum possible XOR is simply the bitwise OR of all numbers! Any bit that appears in any number can be made to appear in the XOR result.

This gives us an O(n) solution: compute the bitwise OR of all numbers in the array.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maximumXOR(nums):
    """
    Returns the maximum possible XOR after performing operations.

    The key insight is that for each bit position:
    - If any number has a 1 in that position, we can make the XOR result have 1 there
    - If no number has a 1, the XOR result must have 0 there

    Therefore, the maximum XOR is simply the bitwise OR of all numbers.
    """
    result = 0

    # Iterate through all numbers
    for num in nums:
        # Accumulate all 1-bits from all numbers using OR
        result |= num

    return result
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Returns the maximum possible XOR after performing operations.
 *
 * The key insight is that for each bit position:
 * - If any number has a 1 in that position, we can make the XOR result have 1 there
 * - If no number has a 1, the XOR result must have 0 there
 *
 * Therefore, the maximum XOR is simply the bitwise OR of all numbers.
 */
function maximumXOR(nums) {
  let result = 0;

  // Iterate through all numbers
  for (let num of nums) {
    // Accumulate all 1-bits from all numbers using OR
    result |= num;
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Returns the maximum possible XOR after performing operations.
     *
     * The key insight is that for each bit position:
     * - If any number has a 1 in that position, we can make the XOR result have 1 there
     * - If no number has a 1, the XOR result must have 0 there
     *
     * Therefore, the maximum XOR is simply the bitwise OR of all numbers.
     */
    public int maximumXOR(int[] nums) {
        int result = 0;

        // Iterate through all numbers
        for (int num : nums) {
            // Accumulate all 1-bits from all numbers using OR
            result |= num;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the length of the input array. We simply iterate through the array once, performing a constant-time bitwise OR operation for each element.

**Space Complexity:** O(1). We only use a single integer variable to accumulate the result, regardless of input size.

The solution is optimal because we must examine each number at least once to know which bits are present, giving us a lower bound of Ω(n).

## Common Mistakes

1. **Overcomplicating the problem:** Many candidates try to simulate the operations or use complex bit manipulation techniques. The key is to recognize that the operation `a AND (a XOR x)` simply means "you can clear any 1-bit in `a` but cannot change 0-bits to 1."

2. **Confusing AND with OR:** Some candidates might try to use AND instead of OR, thinking they need to find common bits. Remember: for XOR to have a 1 in a position, we need an odd number of numbers with 1 there, not all numbers with 1 there.

3. **Not testing with examples:** Always test with small examples. Try `[1, 2, 3]`:
   - Binary: `[001, 010, 011]`
   - OR: `001 | 010 | 011 = 011` (binary) = 3
   - Can we achieve XOR = 3? Yes: keep all bits as they are (1 XOR 2 XOR 3 = 0, but wait... actually 1 XOR 2 XOR 3 = 0). We need to modify: clear the LSB of 3 (making it 2), then 1 XOR 2 XOR 2 = 1. Hmm, that's not 3. Let's think: we want XOR = 3 (binary 011). We need odd number of 1s in both positions. We have: position 0: numbers 1 and 3 have 1s (even), position 1: numbers 2 and 3 have 1s (even). Clear LSB of 3: now numbers are 1, 2, 2. Position 0: only 1 has 1 (odd → 1), position 1: 2 and 2 have 1s (even → 0). That gives 1, not 3. Let's try clearing a different bit: clear bit 1 of 3, making it 1. Now numbers: 1, 2, 1. Position 0: 1 and 1 have 1s (even → 0), position 1: only 2 has 1 (odd → 1). That gives 2. To get 3 (011), we need both bits set. We have position 0: clear one of the 1s from 1 or 3 to make odd count. Position 1: we have two numbers with 1s (2 and 3), clear one to make odd count. So clear bit 0 from 1 (making it 0) and clear bit 1 from 2 (making it 0). Numbers: 0, 0, 3. XOR = 3. Works!

4. **Forgetting about the operation's limitations:** Remember we can only clear 1-bits, never set 0-bits to 1. This is why the maximum is OR, not simply setting all bits to 1.

## When You'll See This Pattern

This problem teaches **bit manipulation with constraints on operations**. Similar patterns appear in:

1. **Maximum XOR of Two Numbers in an Array (LeetCode 421):** Also involves maximizing XOR, but uses a trie data structure to find the maximum pair XOR. Both problems require deep understanding of XOR properties.

2. **Maximum Xor Product (LeetCode 2939):** Another XOR maximization problem that requires considering bit contributions independently.

3. **Minimize OR of Remaining Elements Using Operations (LeetCode 3092):** Similar structure - operations that clear bits, goal of optimizing a bitwise operation result.

The common theme is analyzing what each operation allows you to do to individual bits, then reasoning about the global objective (maximizing/minimizing a bitwise operation).

## Key Takeaways

1. **Bit independence:** For bitwise operations like XOR, AND, and OR, different bit positions don't interfere with each other. You can analyze each position independently.

2. **Operation analysis is key:** When an operation seems complex, break it down bit-by-bit. For `a AND (a XOR x)`, analyze what happens to a single bit of `a` based on the corresponding bit of `x`.

3. **From constraints to freedom:** The operation constrains what we can do (only clear 1-bits), but understanding this constraint reveals what's possible (we can make any bit that appears in any number appear in the XOR result).

Related problems: [Maximum XOR of Two Numbers in an Array](/problem/maximum-xor-of-two-numbers-in-an-array), [Maximum Xor Product](/problem/maximum-xor-product), [Minimize OR of Remaining Elements Using Operations](/problem/minimize-or-of-remaining-elements-using-operations)
