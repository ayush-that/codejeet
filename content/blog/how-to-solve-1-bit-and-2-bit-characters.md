---
title: "How to Solve 1-bit and 2-bit Characters — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode 1-bit and 2-bit Characters. Easy difficulty, 49.5% acceptance rate. Topics: Array."
date: "2028-03-26"
category: "dsa-patterns"
tags: ["1-bit-and-2-bit-characters", "array", "easy"]
---

# How to Solve 1-bit and 2-bit Characters

This problem asks us to determine whether the last character in a binary array must be a one-bit character (`0`), given that characters can be either one-bit (`0`) or two-bit (`10` or `11`). The tricky part is that the array doesn't explicitly mark character boundaries—we need to parse it according to the rules and see if the final `0` stands alone or is part of a two-bit character.

## Visual Walkthrough

Let's trace through an example: `bits = [1, 0, 0]`

We start at index 0:

- First element is `1`. According to our rules, `1` must be the start of a two-bit character. So we consume two bits: `[1, 0]` forms the valid two-bit character `10`.
- We move past these two bits. Our current position is now at index 2.
- At index 2, we have `0`. Since `0` always represents a one-bit character, we consume just this one bit.
- We've reached the end of the array. The last character we consumed was a one-bit character (`0`), so the answer is `true`.

Now consider `bits = [1, 1, 0]`:

- Start at index 0: `1` means we have a two-bit character. Consume `[1, 1]` as the character `11`.
- Move to index 2: `0` is a one-bit character.
- End of array. Last character is one-bit, so answer is `true`.

Finally, `bits = [1, 1, 1, 0]`:

- Index 0: `1` → two-bit character `[1, 1]` (`11`)
- Index 2: `1` → two-bit character `[1, 0]` (`10`)
- We've consumed all bits. The last character was `10`, a two-bit character, so the answer is `false`.

The key insight: When we encounter a `1`, we must skip the next bit too (since it's part of a two-bit character). When we encounter a `0`, we just move to the next bit. We need to see where this parsing ends relative to the last bit.

## Brute Force Approach

A naive approach might try to actually build the character sequence or use recursion to explore all possible parsings. For example:

1. Try parsing from the start: if the current bit is `0`, parse it as a one-bit character and recurse on the rest
2. If the current bit is `1`, parse it as the start of a two-bit character (with the next bit) and recurse on what remains
3. Check all possible parsings to see if the last character could be one-bit

However, this is unnecessary complexity. The problem has a deterministic greedy solution: since `1` always starts a two-bit character, we can simply walk through the array, and whenever we see `1`, we skip two positions; when we see `0`, we skip one position. We then check if we land exactly at the last bit (meaning it's a standalone `0`) or skip past it (meaning it's part of a two-bit character).

The brute force would be O(2^n) in the worst case if we explore all possibilities, while the optimal solution is O(n).

## Optimal Solution

The optimal approach uses a simple linear scan with a pointer. We iterate through the array, and based on the current bit, we decide how many positions to advance. If we end exactly at the last index, the last character is a one-bit character; if we skip past it, it's part of a two-bit character.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def isOneBitCharacter(bits):
    """
    Determine if the last character is a one-bit character.

    Approach: Iterate through bits with a pointer i.
    - If bits[i] == 0: move forward 1 step (0 is always one-bit)
    - If bits[i] == 1: move forward 2 steps (1 always starts two-bit character)
    Check if we end exactly at the last index.
    """
    i = 0
    n = len(bits)

    # Walk through the bits until we reach or pass the last element
    while i < n - 1:  # Stop before the last element since we might skip past it
        if bits[i] == 0:
            i += 1      # 0 is one-bit character
        else:
            i += 2      # 1 starts two-bit character (10 or 11)

    # If i == n - 1, we landed exactly on the last bit, so it's a one-bit character
    # If i == n, we skipped past the last bit, so it was part of a two-bit character
    return i == n - 1
```

```javascript
// Time: O(n) | Space: O(1)
function isOneBitCharacter(bits) {
  /**
   * Determine if the last character is a one-bit character.
   *
   * Approach: Iterate through bits with a pointer i.
   * - If bits[i] === 0: move forward 1 step (0 is always one-bit)
   * - If bits[i] === 1: move forward 2 steps (1 always starts two-bit character)
   * Check if we end exactly at the last index.
   */
  let i = 0;
  const n = bits.length;

  // Walk through the bits until we reach or pass the last element
  while (i < n - 1) {
    // Stop before the last element since we might skip past it
    if (bits[i] === 0) {
      i += 1; // 0 is one-bit character
    } else {
      i += 2; // 1 starts two-bit character (10 or 11)
    }
  }

  // If i === n - 1, we landed exactly on the last bit, so it's a one-bit character
  // If i === n, we skipped past the last bit, so it was part of a two-bit character
  return i === n - 1;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public boolean isOneBitCharacter(int[] bits) {
        /**
         * Determine if the last character is a one-bit character.
         *
         * Approach: Iterate through bits with a pointer i.
         * - If bits[i] == 0: move forward 1 step (0 is always one-bit)
         * - If bits[i] == 1: move forward 2 steps (1 always starts two-bit character)
         * Check if we end exactly at the last index.
         */
        int i = 0;
        int n = bits.length;

        // Walk through the bits until we reach or pass the last element
        while (i < n - 1) {  // Stop before the last element since we might skip past it
            if (bits[i] == 0) {
                i += 1;      // 0 is one-bit character
            } else {
                i += 2;      // 1 starts two-bit character (10 or 11)
            }
        }

        // If i == n - 1, we landed exactly on the last bit, so it's a one-bit character
        // If i == n, we skipped past the last bit, so it was part of a two-bit character
        return i == n - 1;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)  
We traverse the array once with our pointer `i`. Each iteration either increments by 1 or 2, so in the worst case we make O(n) steps.

**Space Complexity:** O(1)  
We only use a constant amount of extra space (the pointer `i` and length variable `n`). No additional data structures are needed.

## Common Mistakes

1. **Forgetting the array always ends with 0**  
   The problem guarantees the last bit is 0, but some candidates might write unnecessary checks for the last bit being 1. Remember: the question is whether that final 0 is a standalone character or part of a two-bit character.

2. **Incorrect loop condition**  
   Using `while i < n:` instead of `while i < n - 1:` can cause issues. If we process the last bit inside the loop when it's 0, we'll increment `i` by 1 and end up with `i == n`, incorrectly returning `false`. The loop should stop before the last element since we might skip past it.

3. **Overcomplicating with backtracking or DP**  
   Some candidates try to use dynamic programming or backtracking to explore all possible parsings. This is unnecessary since the parsing is deterministic: a `1` always consumes the next bit, and a `0` always stands alone.

4. **Misunderstanding the return condition**  
   The question is "must be a one-bit character," not "could be." If there's any way the last character could be part of a two-bit character, we return `false`. Our greedy approach correctly handles this because if we land exactly on the last index, there's no way it could be part of a two-bit character.

## When You'll See This Pattern

This greedy parsing pattern appears in problems where you need to process data according to fixed rules, and the optimal approach is to make locally optimal choices (in this case, parsing each character according to the current bit).

Similar problems include:

1. **Jump Game (LeetCode 55)** - Similar greedy approach where you check how far you can jump from each position. Instead of fixed 1 or 2 steps, you have variable jump lengths, but the idea of iteratively moving a pointer is the same.

2. **Decode Ways (LeetCode 91)** - More complex version where digits can represent letters (1-26). While it requires dynamic programming due to multiple valid interpretations, the core idea of parsing sequences according to rules is similar.

3. **Partition Labels (LeetCode 763)** - Another greedy parsing problem where you process a string in chunks based on the last occurrence of each character.

## Key Takeaways

1. **Greedy parsing works when rules are deterministic** - When you encounter a specific pattern (like `1` starting a two-bit character), you can make an immediate decision without needing to explore alternatives.

2. **Pointer-based iteration is efficient** - Instead of creating new arrays or using recursion, a simple pointer that moves through the array according to rules often provides the optimal O(n) time and O(1) space solution.

3. **Pay attention to loop boundaries** - The condition `i < n - 1` is crucial here. Always think about whether you want to process the last element inside the loop or handle it separately.

Related problems: [Gray Code](/problem/gray-code)
