---
title: "How to Solve Total Characters in String After Transformations II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Total Characters in String After Transformations II. Hard difficulty, 58.1% acceptance rate. Topics: Hash Table, Math, String, Dynamic Programming, Counting."
date: "2028-03-27"
category: "dsa-patterns"
tags:
  ["total-characters-in-string-after-transformations-ii", "hash-table", "math", "string", "hard"]
---

# How to Solve Total Characters in String After Transformations II

This problem asks us to track how a string evolves through multiple transformations, where each character gets replaced according to a fixed mapping. The challenge is that performing `t` transformations directly would be impossibly slow for large `t` (up to 10^9), forcing us to find a mathematical pattern in how character counts evolve rather than simulating each step individually.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose:

- `s = "ab"`
- `nums = [1, 2, 0, 0, ...]` (only first 3 matter for 'a','b','c')
- `t = 2`

The transformation rules: 'a'→'b', 'b'→'c', 'c'→'a' (based on nums indices 0,1,2).

**Step-by-step transformation:**

1. Start: "ab" → counts: a:1, b:1
2. After 1st transformation: 'a' becomes 'b', 'b' becomes 'c' → "bc" → counts: b:1, c:1
3. After 2nd transformation: 'b' becomes 'c', 'c' becomes 'a' → "ca" → counts: c:1, a:1

The key insight: Instead of tracking the actual string, we can track **character counts**. Each transformation redistributes counts according to the mapping. For example, after step 1, all 'a' counts moved to 'b', and all 'b' counts moved to 'c'.

This suggests we can represent the transformation as a **matrix operation** on the count vector. If we can compute this transformation applied `t` times efficiently, we avoid simulating each step.

## Brute Force Approach

The most straightforward approach is to literally perform `t` transformations:

1. Start with the initial string `s`
2. For each of `t` transformations:
   - Create a new string by replacing each character according to `nums`
3. Return the length of the final string

**Why this fails:**

- Time complexity: O(t × n) where n is string length
- With `t` up to 10^9 and `n` up to 10^5, this is impossibly slow (10^14 operations)
- Even with optimization, we'd run out of time and memory

The brute force helps us understand the problem but isn't viable. We need to recognize that character transformations are **independent** and **deterministic**, allowing us to work with counts rather than the actual string.

## Optimized Approach

The key insight is that transformations follow a **directed graph** where each node (character) points to exactly one other node (its replacement). This creates functional graphs that eventually fall into cycles.

**Step-by-step reasoning:**

1. **Count initial characters**: Convert the string to a count array of size 26.

2. **Understand the transformation graph**: Each character `i` maps to `nums[i]`. This creates:
   - Chains that eventually enter cycles
   - Potentially self-loops (character maps to itself)
   - Multiple chains converging to the same cycle

3. **Track character evolution**: Instead of transforming the string `t` times, we track where each character's count ends up after `t` steps. For character `i`:
   - Follow its transformation path for `t` steps (or until a cycle is detected)
   - Add its count to the final destination character

4. **Optimize with cycle detection**: Since `t` can be huge, we can't follow the path step-by-step. Instead:
   - Detect cycles in the transformation graph
   - For paths before entering cycles: process steps individually
   - For cycles: use modular arithmetic to compute final position after `t` steps

5. **Alternative: matrix exponentiation**: The transformation can be represented as a 26×26 matrix where each column has exactly one 1 (at row `nums[i]`). Applying it `t` times is matrix exponentiation, but this is O(26³ log t) which is efficient.

The most elegant solution uses **binary lifting** or **exponentiation by squaring** on the transformation function.

## Optimal Solution

We'll use binary lifting (also called "doubling method") to compute where each character ends up after `t` transformations in O(26 log t) time.

<div class="code-group">

```python
# Time: O(26 * log t + n) | Space: O(26 * log t)
def totalCharacters(s, t, nums):
    """
    Calculate total characters after t transformations using binary lifting.

    Args:
        s: initial string
        t: number of transformations
        nums: transformation mapping (size 26)

    Returns:
        Total characters (always len(s), but we return it for completeness)
    """
    n = len(s)

    # Step 1: Count initial characters
    # We have 26 lowercase letters, map 'a'=0, 'b'=1, ..., 'z'=25
    count = [0] * 26
    for ch in s:
        count[ord(ch) - ord('a')] += 1

    # Step 2: Precompute binary lifting table
    # next_char[k][i] = character reached from i after 2^k steps
    # We need up to floor(log2(t)) levels
    max_power = t.bit_length()  # Number of bits needed to represent t
    next_char = [[0] * 26 for _ in range(max_power)]

    # Base case: 2^0 = 1 step
    for i in range(26):
        next_char[0][i] = nums[i]

    # Fill the table using doubling: after 2^(k+1) steps =
    # after 2^k steps from the position after 2^k steps
    for k in range(1, max_power):
        for i in range(26):
            # Character after 2^k steps = character after 2^(k-1) steps
            # from the character after 2^(k-1) steps from i
            mid = next_char[k-1][i]
            next_char[k][i] = next_char[k-1][mid]

    # Step 3: Compute final counts after t transformations
    final_count = [0] * 26

    # For each starting character
    for start_char in range(26):
        if count[start_char] == 0:
            continue  # No characters of this type to transform

        # Find destination character after t steps
        dest_char = start_char
        bit_mask = t
        power = 0

        # Use binary representation of t to jump in powers of 2
        while bit_mask > 0:
            if bit_mask & 1:  # If this bit is set in t
                dest_char = next_char[power][dest_char]
            bit_mask >>= 1
            power += 1

        # Add all characters of type start_char to their destination
        final_count[dest_char] += count[start_char]

    # The problem asks for total characters, which is just sum(final_count)
    # But we need to handle the modulo operation as specified
    MOD = 10**9 + 7
    total = sum(final_count) % MOD

    return total
```

```javascript
// Time: O(26 * log t + n) | Space: O(26 * log t)
function totalCharacters(s, t, nums) {
  /**
   * Calculate total characters after t transformations using binary lifting.
   *
   * @param {string} s - initial string
   * @param {number} t - number of transformations
   * @param {number[]} nums - transformation mapping (size 26)
   * @returns {number} - total characters modulo 10^9+7
   */
  const n = s.length;
  const MOD = 1e9 + 7;

  // Step 1: Count initial characters
  // Map 'a'=0, 'b'=1, ..., 'z'=25
  const count = new Array(26).fill(0);
  for (let i = 0; i < n; i++) {
    const charCode = s.charCodeAt(i) - 97; // 'a' = 97
    count[charCode]++;
  }

  // Step 2: Precompute binary lifting table
  // nextChar[k][i] = character reached from i after 2^k steps
  const maxPower = Math.floor(Math.log2(t)) + 1;
  const nextChar = new Array(maxPower);

  // Initialize and fill base case (2^0 = 1 step)
  nextChar[0] = new Array(26);
  for (let i = 0; i < 26; i++) {
    nextChar[0][i] = nums[i];
  }

  // Fill the table using doubling
  for (let k = 1; k < maxPower; k++) {
    nextChar[k] = new Array(26);
    for (let i = 0; i < 26; i++) {
      // After 2^k steps = after 2^(k-1) steps from position after 2^(k-1) steps
      const mid = nextChar[k - 1][i];
      nextChar[k][i] = nextChar[k - 1][mid];
    }
  }

  // Step 3: Compute final counts after t transformations
  const finalCount = new Array(26).fill(0);

  // For each starting character
  for (let startChar = 0; startChar < 26; startChar++) {
    if (count[startChar] === 0) continue;

    // Find destination character after t steps using binary representation
    let destChar = startChar;
    let bitMask = t;
    let power = 0;

    while (bitMask > 0) {
      if (bitMask & 1) {
        // If this bit is set in t
        destChar = nextChar[power][destChar];
      }
      bitMask >>= 1;
      power++;
    }

    // Add all characters of this type to their destination
    finalCount[destChar] += count[startChar];
  }

  // Calculate total (sum of all counts)
  let total = 0;
  for (let i = 0; i < 26; i++) {
    total = (total + finalCount[i]) % MOD;
  }

  return total;
}
```

```java
// Time: O(26 * log t + n) | Space: O(26 * log t)
class Solution {
    public int totalCharacters(String s, int t, int[] nums) {
        /**
         * Calculate total characters after t transformations using binary lifting.
         *
         * @param s - initial string
         * @param t - number of transformations
         * @param nums - transformation mapping (size 26)
         * @return total characters modulo 10^9+7
         */
        int n = s.length();
        final int MOD = 1_000_000_007;

        // Step 1: Count initial characters
        // Map 'a'=0, 'b'=1, ..., 'z'=25
        int[] count = new int[26];
        for (int i = 0; i < n; i++) {
            char ch = s.charAt(i);
            count[ch - 'a']++;
        }

        // Step 2: Precompute binary lifting table
        // nextChar[k][i] = character reached from i after 2^k steps
        int maxPower = 32 - Integer.numberOfLeadingZeros(t); // ceil(log2(t+1))
        int[][] nextChar = new int[maxPower][26];

        // Base case: 2^0 = 1 step
        for (int i = 0; i < 26; i++) {
            nextChar[0][i] = nums[i];
        }

        // Fill the table using doubling
        for (int k = 1; k < maxPower; k++) {
            for (int i = 0; i < 26; i++) {
                // After 2^k steps = after 2^(k-1) steps from position after 2^(k-1) steps
                int mid = nextChar[k-1][i];
                nextChar[k][i] = nextChar[k-1][mid];
            }
        }

        // Step 3: Compute final counts after t transformations
        int[] finalCount = new int[26];

        // For each starting character
        for (int startChar = 0; startChar < 26; startChar++) {
            if (count[startChar] == 0) continue;

            // Find destination character after t steps
            int destChar = startChar;
            int bitMask = t;
            int power = 0;

            // Use binary representation of t to jump in powers of 2
            while (bitMask > 0) {
                if ((bitMask & 1) == 1) { // If this bit is set in t
                    destChar = nextChar[power][destChar];
                }
                bitMask >>= 1;
                power++;
            }

            // Add all characters of this type to their destination
            finalCount[destChar] += count[startChar];
        }

        // Calculate total (sum of all counts)
        long total = 0;
        for (int i = 0; i < 26; i++) {
            total = (total + finalCount[i]) % MOD;
        }

        return (int)total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(26 × log t + n)**

- `O(n)`: Counting initial characters in the string
- `O(26 × log t)`: Building the binary lifting table (26 characters × log₂t levels)
- `O(26 × log t)`: Computing final destinations for each character type
- Total: Dominated by O(26 log t) since log t ≤ 30 for t ≤ 10^9

**Space Complexity: O(26 × log t)**

- Binary lifting table: 26 × log₂t integers
- Count arrays: O(26) each for initial and final counts
- Total: O(26 log t) dominates

This is extremely efficient compared to the brute force O(t × n).

## Common Mistakes

1. **Simulating transformations directly**: Attempting to actually transform the string `t` times. With `t` up to 10^9, this will time out immediately. Always check constraints before implementing.

2. **Forgetting about cycles in large t**: Even if you track character counts, naively following the transformation `t` times for each character is still O(26 × t). You must use cycle detection or binary lifting.

3. **Incorrect binary lifting implementation**: Common errors include:
   - Not handling the case when `t = 0` (no transformations)
   - Off-by-one errors in the number of levels needed (use `t.bit_length()` or similar)
   - Incorrectly combining jumps (must apply them in the right order)

4. **Modulo arithmetic errors**: The problem may require results modulo 10^9+7. Remember to apply modulo after each addition to prevent overflow, especially in Java where ints can overflow.

## When You'll See This Pattern

This "functional graph with binary lifting" pattern appears in problems where you need to apply a deterministic transformation many times:

1. **Find the Celebrity (LeetCode 277)**: Similar "follow the chain" thinking, though simpler.
2. **Linked List Cycle II (LeetCode 142)**: Cycle detection in functional graphs.
3. **K-th Ancestor of a Tree Node (LeetCode 1483)**: Exactly the same binary lifting technique on trees.
4. **Repeated DNA Sequences (LeetCode 187)**: While not identical, it involves tracking state transitions over sequences.

The core technique—binary lifting—is used whenever you need to answer "where do I end up after k steps?" queries efficiently, with preprocessing to answer multiple queries.

## Key Takeaways

1. **When you see huge iteration counts (like t=10^9)**, think about mathematical patterns, cycles, or binary exponentiation rather than simulation.

2. **Functional graphs** (where each node has exactly one outgoing edge) often contain cycles that can be exploited for efficiency.

3. **Binary lifting/doubling** is a powerful technique for answering "k-th step" queries in O(log k) time after O(n log k) preprocessing. It works for any associative operation, not just graph traversal.

[Practice this problem on CodeJeet](/problem/total-characters-in-string-after-transformations-ii)
