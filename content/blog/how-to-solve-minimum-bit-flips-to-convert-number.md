---
title: "How to Solve Minimum Bit Flips to Convert Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimum Bit Flips to Convert Number. Easy difficulty, 87.8% acceptance rate. Topics: Bit Manipulation."
date: "2027-09-17"
category: "dsa-patterns"
tags: ["minimum-bit-flips-to-convert-number", "bit-manipulation", "easy"]
---

# How to Solve Minimum Bit Flips to Convert Number

This problem asks: given two integers `start` and `goal`, what's the minimum number of bit flips needed to transform the binary representation of `start` into the binary representation of `goal`? While the problem seems straightforward, it elegantly tests your understanding of bitwise operations and binary representation. The tricky part is recognizing that counting differing bits is equivalent to counting set bits in the XOR result.

## Visual Walkthrough

Let's trace through an example: `start = 10`, `goal = 7`.

**Step 1: Convert to binary**

- `10` in binary: `1010`
- `7` in binary: `0111`

**Step 2: Compare bits position by position**
We compare from rightmost (least significant) to leftmost:

- Position 0 (rightmost): `10` has `0`, `7` has `1` → different (flip needed)
- Position 1: `10` has `1`, `7` has `1` → same (no flip)
- Position 2: `10` has `0`, `7` has `1` → different (flip needed)
- Position 3: `10` has `1`, `7` has `0` → different (flip needed)

**Step 3: Count differences**
We need 3 flips: positions 0, 2, and 3.

**Step 4: The XOR insight**
Notice what happens when we XOR `10` and `7`:

```
  1010 (10)
^ 0111 (7)
= 1101 (13)
```

The result `1101` has exactly 3 set bits (1s) - one for each position where the bits differ! This is the key insight: **the number of differing bits equals the number of 1s in the XOR result**.

## Brute Force Approach

A naive approach would be to:

1. Convert both numbers to binary strings
2. Pad the shorter string with leading zeros
3. Compare each position and count differences

<div class="code-group">

```python
# Time: O(b) where b is number of bits | Space: O(b)
def minBitFlips(start: int, goal: int) -> int:
    # Convert to binary strings without '0b' prefix
    start_bin = bin(start)[2:]
    goal_bin = bin(goal)[2:]

    # Pad the shorter string with leading zeros
    max_len = max(len(start_bin), len(goal_bin))
    start_bin = start_bin.zfill(max_len)
    goal_bin = goal_bin.zfill(max_len)

    # Count positions where bits differ
    flips = 0
    for i in range(max_len):
        if start_bin[i] != goal_bin[i]:
            flips += 1

    return flips
```

```javascript
// Time: O(b) where b is number of bits | Space: O(b)
function minBitFlips(start, goal) {
  // Convert to binary strings
  let startBin = start.toString(2);
  let goalBin = goal.toString(2);

  // Pad the shorter string with leading zeros
  const maxLen = Math.max(startBin.length, goalBin.length);
  startBin = startBin.padStart(maxLen, "0");
  goalBin = goalBin.padStart(maxLen, "0");

  // Count positions where bits differ
  let flips = 0;
  for (let i = 0; i < maxLen; i++) {
    if (startBin[i] !== goalBin[i]) {
      flips++;
    }
  }

  return flips;
}
```

```java
// Time: O(b) where b is number of bits | Space: O(b)
public int minBitFlips(int start, int goal) {
    // Convert to binary strings
    String startBin = Integer.toBinaryString(start);
    String goalBin = Integer.toBinaryString(goal);

    // Pad the shorter string with leading zeros
    int maxLen = Math.max(startBin.length(), goalBin.length());
    startBin = String.format("%" + maxLen + "s", startBin).replace(' ', '0');
    goalBin = String.format("%" + maxLen + "s", goalBin).replace(' ', '0');

    // Count positions where bits differ
    int flips = 0;
    for (int i = 0; i < maxLen; i++) {
        if (startBin.charAt(i) != goalBin.charAt(i)) {
            flips++;
        }
    }

    return flips;
}
```

</div>

**Why this isn't optimal:**

- We're creating string representations which uses extra memory
- The padding operation is unnecessary overhead
- We're comparing character by character instead of using bitwise operations
- Time complexity is O(b) where b is the number of bits (up to 32 for integers), which is acceptable but not the most elegant

## Optimal Solution

The optimal solution leverages bitwise XOR and a clever trick to count set bits efficiently. The key insight is that `start ^ goal` gives us a number where each set bit represents a position where `start` and `goal` differ.

<div class="code-group">

```python
# Time: O(k) where k is number of set bits | Space: O(1)
def minBitFlips(start: int, goal: int) -> int:
    # XOR gives us a number where 1s represent differing bits
    diff = start ^ goal

    # Count the number of 1s in diff using Brian Kernighan's algorithm
    flips = 0
    while diff > 0:
        # diff & (diff - 1) clears the least significant set bit
        diff = diff & (diff - 1)
        flips += 1

    return flips
```

```javascript
// Time: O(k) where k is number of set bits | Space: O(1)
function minBitFlips(start, goal) {
  // XOR gives us a number where 1s represent differing bits
  let diff = start ^ goal;

  // Count the number of 1s in diff using Brian Kernighan's algorithm
  let flips = 0;
  while (diff > 0) {
    // diff & (diff - 1) clears the least significant set bit
    diff = diff & (diff - 1);
    flips++;
  }

  return flips;
}
```

```java
// Time: O(k) where k is number of set bits | Space: O(1)
public int minBitFlips(int start, int goal) {
    // XOR gives us a number where 1s represent differing bits
    int diff = start ^ goal;

    // Count the number of 1s in diff using Brian Kernighan's algorithm
    int flips = 0;
    while (diff > 0) {
        // diff & (diff - 1) clears the least significant set bit
        diff = diff & (diff - 1);
        flips++;
    }

    return flips;
}
```

</div>

**Line-by-line explanation:**

1. **`diff = start ^ goal`**: The XOR operation compares bits position by position. If bits are different, the result has a 1 in that position; if they're the same, it has a 0. This perfectly captures which bits need flipping.

2. **Brian Kernighan's algorithm**: Instead of checking all 32 bits, we use a clever trick to only iterate through the set bits:
   - `diff & (diff - 1)` clears the rightmost (least significant) set bit
   - Each iteration clears one set bit and increments our counter
   - The loop runs exactly once for each set bit

3. **Why this is efficient**: For a 32-bit integer with only a few set bits, this runs in O(k) time where k is the number of set bits, rather than O(32). In the worst case (all bits set), it's still O(32) which is constant time.

## Complexity Analysis

**Time Complexity: O(k) where k is the number of set bits in (start ^ goal)**

- In the worst case, when all bits differ (e.g., `start = 0`, `goal = 2^31-1`), k = 32 for 32-bit integers
- This is effectively O(1) since integers have a fixed maximum number of bits
- Brian Kernighan's algorithm runs once for each set bit, making it optimal for sparse bit patterns

**Space Complexity: O(1)**

- We only use a few integer variables regardless of input size
- No additional data structures or recursion stacks

## Common Mistakes

1. **Forgetting about leading zeros**: When converting to strings, candidates might not pad with leading zeros, causing incorrect comparisons for numbers with different bit lengths. The XOR solution elegantly avoids this issue entirely.

2. **Using inefficient bit counting**: Some candidates might write:

   ```python
   flips = 0
   while diff > 0:
       flips += diff & 1  # Check if last bit is 1
       diff >>= 1         # Shift right
   ```

   This checks all 32 bits even when unnecessary. Brian Kernighan's algorithm is more efficient for numbers with few set bits.

3. **Overcomplicating with binary conversion**: The string-based approach is intuitive but inefficient. Interviewers prefer the bitwise solution as it demonstrates deeper understanding of computer architecture.

4. **Not handling negative numbers properly**: In languages like Java, the right shift operator `>>` preserves sign (arithmetic shift), while `>>>` doesn't (logical shift). For unsigned bit counting, use `>>>` or stick with Brian Kernighan's algorithm which works correctly for all integers.

## When You'll See This Pattern

This problem combines two fundamental bit manipulation patterns:

1. **XOR for finding differences**: XOR is the "difference detector" operation. You'll see it in:
   - **Single Number**: Find the element that appears once when all others appear twice
   - **Find the Difference**: Given two strings where one is a shuffled version of the other plus one extra character, find the extra character
   - **Hamming Distance**: Count positions where bits differ (essentially this problem!)

2. **Brian Kernighan's algorithm for counting set bits**: This efficient bit counting technique appears in:
   - **Counting Bits**: Count set bits for all numbers from 0 to n
   - **Power of Two**: Check if a number is a power of two (has exactly one set bit)
   - **Number of 1 Bits**: The classic problem that asks to count set bits

## Key Takeaways

1. **XOR is your go-to for finding differences**: When you need to compare two binary representations or find elements that differ, XOR should be your first thought. It returns 1 only when bits differ, making it perfect for counting mismatches.

2. **Brian Kernighan's algorithm is the optimal way to count set bits**: Remember the pattern `n = n & (n - 1)` to clear the least significant set bit. This runs in O(k) time where k is the number of set bits, not O(n) where n is the total bits.

3. **Bit problems often have elegant one-liners**: While you should explain your reasoning step-by-step, many bit manipulation problems have surprisingly concise solutions. For this problem, you could even write `return bin(start ^ goal).count('1')` in Python, though interviewers prefer to see the algorithmic approach.

Related problems: [Minimum Flips to Make a OR b Equal to c](/problem/minimum-flips-to-make-a-or-b-equal-to-c), [Minimum Number of Operations to Make Array XOR Equal to K](/problem/minimum-number-of-operations-to-make-array-xor-equal-to-k), [Smallest Number With All Set Bits](/problem/smallest-number-with-all-set-bits)
