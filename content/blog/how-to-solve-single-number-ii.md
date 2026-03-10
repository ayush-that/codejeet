---
title: "How to Solve Single Number II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Single Number II. Medium difficulty, 66.7% acceptance rate. Topics: Array, Bit Manipulation."
date: "2026-11-21"
category: "dsa-patterns"
tags: ["single-number-ii", "array", "bit-manipulation", "medium"]
---

# How to Solve Single Number II

You're given an array where every number appears exactly three times except for one number that appears exactly once. Your task is to find that single number. The challenge is doing this in O(n) time with O(1) space — no hash maps allowed! This problem is tricky because the standard XOR trick from Single Number I doesn't work when numbers appear three times instead of twice.

## Visual Walkthrough

Let's trace through the example `[2, 2, 3, 2]` to build intuition:

**Binary representation:**

- 2 = 010 (in binary)
- 3 = 011 (in binary)

**Step-by-step counting:**

1. First 2 (010): ones = 010, twos = 000
2. Second 2 (010):
   - ones becomes 000 (because 010 XOR 010 = 000, and we see it's already in twos)
   - twos becomes 010 (because 000 XOR 010 = 010)
3. 3 (011):
   - ones becomes 011 (000 XOR 011 = 011)
   - twos remains 010 (because 010 & ~011 = 010 & 100 = 000)
4. Third 2 (010):
   - ones becomes 001 (011 XOR 010 = 001)
   - twos becomes 000 (010 XOR 010 = 000, because ones was 001 and 001 & 010 = 000)

At the end, `ones = 001 = 3`, which is our answer. The key insight is that we're tracking bits that appear once versus bits that appear twice, and when a bit would appear three times, we reset it to zero.

## Brute Force Approach

The most straightforward approach is to use a hash map to count occurrences:

1. Iterate through the array
2. For each number, increment its count in the hash map
3. Iterate through the hash map to find the number with count = 1

While this approach works and is O(n) time, it requires O(n) space for the hash map, violating the constant space requirement. A candidate might also try sorting the array first (O(n log n) time) and then scanning for the single element, but this violates the linear time requirement.

## Optimized Approach

The optimal solution uses **bit manipulation** with a finite state machine approach. Here's the key insight:

For each bit position (0 to 31 for 32-bit integers), we need to count how many numbers have that bit set to 1. Since numbers appear three times except for one, the count for each bit position will be either:

- A multiple of 3 (if the single number has 0 in that position)
- A multiple of 3 plus 1 (if the single number has 1 in that position)

We can track this using two bit masks:

- `ones`: bits that have appeared once (mod 3 = 1)
- `twos`: bits that have appeared twice (mod 3 = 2)

The state transitions work like this:

- When we see a bit for the first time: 0 → 1 (add to `ones`)
- When we see it again: 1 → 2 (move from `ones` to `twos`)
- When we see it a third time: 2 → 0 (remove from `twos`)

The mathematical implementation:

1. Update `ones` first: `ones = (ones ^ num) & ~twos`
   - XOR adds the bit to `ones` if it's not there
   - The `& ~twos` ensures we don't count bits that are already in `twos`
2. Update `twos`: `twos = (twos ^ num) & ~ones`
   - XOR adds the bit to `twos` if it's not there
   - The `& ~ones` ensures we don't count bits that are now in `ones`

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def singleNumber(nums):
    """
    Finds the number that appears exactly once in an array
    where all other numbers appear exactly three times.

    Uses bit manipulation with two counters:
    - ones: tracks bits that have appeared once (mod 3 = 1)
    - twos: tracks bits that have appeared twice (mod 3 = 2)

    When a bit appears three times, both counters reset to 0 for that bit.
    """
    ones = 0  # Bits that have appeared once (mod 3 = 1)
    twos = 0  # Bits that have appeared twice (mod 3 = 2)

    for num in nums:
        # Update ones: XOR adds the bit, then mask out bits already in twos
        # This ensures bits that would become "three times" don't get counted
        ones = (ones ^ num) & ~twos

        # Update twos: XOR adds the bit, then mask out bits now in ones
        # This ensures we only track bits that have appeared exactly twice
        twos = (twos ^ num) & ~ones

    # At the end, ones contains the bits of our single number
    # (since it appears once, not three times)
    return ones
```

```javascript
// Time: O(n) | Space: O(1)
function singleNumber(nums) {
  /**
   * Finds the number that appears exactly once in an array
   * where all other numbers appear exactly three times.
   *
   * Uses bit manipulation with two counters:
   * - ones: tracks bits that have appeared once (mod 3 = 1)
   * - twos: tracks bits that have appeared twice (mod 3 = 2)
   *
   * When a bit appears three times, both counters reset to 0 for that bit.
   */
  let ones = 0; // Bits that have appeared once (mod 3 = 1)
  let twos = 0; // Bits that have appeared twice (mod 3 = 2)

  for (let num of nums) {
    // Update ones: XOR adds the bit, then mask out bits already in twos
    // This ensures bits that would become "three times" don't get counted
    ones = (ones ^ num) & ~twos;

    // Update twos: XOR adds the bit, then mask out bits now in ones
    // This ensures we only track bits that have appeared exactly twice
    twos = (twos ^ num) & ~ones;
  }

  // At the end, ones contains the bits of our single number
  // (since it appears once, not three times)
  return ones;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int singleNumber(int[] nums) {
        /**
         * Finds the number that appears exactly once in an array
         * where all other numbers appear exactly three times.
         *
         * Uses bit manipulation with two counters:
         * - ones: tracks bits that have appeared once (mod 3 = 1)
         * - twos: tracks bits that have appeared twice (mod 3 = 2)
         *
         * When a bit appears three times, both counters reset to 0 for that bit.
         */
        int ones = 0;  // Bits that have appeared once (mod 3 = 1)
        int twos = 0;  // Bits that have appeared twice (mod 3 = 2)

        for (int num : nums) {
            // Update ones: XOR adds the bit, then mask out bits already in twos
            // This ensures bits that would become "three times" don't get counted
            ones = (ones ^ num) & ~twos;

            // Update twos: XOR adds the bit, then mask out bits now in ones
            // This ensures we only track bits that have appeared exactly twice
            twos = (twos ^ num) & ~ones;
        }

        // At the end, ones contains the bits of our single number
        // (since it appears once, not three times)
        return ones;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the array once, performing constant-time bit operations for each element
- The number of operations per element is fixed and independent of input size

**Space Complexity:** O(1)

- We only use two integer variables (`ones` and `twos`) regardless of input size
- No additional data structures that grow with input size

## Common Mistakes

1. **Using XOR directly like in Single Number I**: Candidates often try `result ^= num` which works when numbers appear twice, but fails here because `a ^ a ^ a = a`, not 0.

2. **Incorrect update order**: The order of updating `ones` and `twos` matters. If you update `twos` before `ones`, the logic breaks because `twos` needs to see the updated `ones` value.

3. **Forgetting about negative numbers**: In languages like Java, integers are signed 32-bit. The bit manipulation approach handles negative numbers correctly because we're working at the bit level, but candidates sometimes worry unnecessarily about sign bits.

4. **Trying to extend the XOR trick incorrectly**: Some candidates try `(3 * sum_of_unique - sum_of_all) / 2` which requires knowing the unique elements or using extra space to find them.

## When You'll See This Pattern

This bit manipulation pattern with finite state machines appears in several variations:

1. **Single Number I (Easy)**: The simpler version where XOR works directly because `a ^ a = 0` and `a ^ 0 = a`.

2. **Single Number III (Medium)**: Find two numbers that appear once while others appear twice. Requires dividing numbers into two groups based on a differentiating bit.

3. **Maximum Product of Word Lengths (Medium)**: Uses bit masks to represent character sets in words for efficient comparison.

4. **Counting Bits (Easy)**: While not identical, it reinforces thinking about numbers at the bit level and using bit operations for efficiency.

The core pattern is using bit masks to track states or properties efficiently when dealing with sets of integers.

## Key Takeaways

1. **Bit manipulation can simulate finite state machines**: When you need to track counts modulo some number (like 3 in this case), you can use bit operations to create the equivalent of a state machine with minimal space.

2. **XOR is addition modulo 2**: This problem extends that concept to modulo 3 by using two bit masks instead of one. For modulo k, you'd need ⌈log₂k⌉ bit masks.

3. **Work at the bit level for constant space**: When space is constrained, consider whether you can solve the problem by examining bits independently rather than whole numbers.

Related problems: [Single Number](/problem/single-number), [Single Number III](/problem/single-number-iii), [Find the XOR of Numbers Which Appear Twice](/problem/find-the-xor-of-numbers-which-appear-twice)
