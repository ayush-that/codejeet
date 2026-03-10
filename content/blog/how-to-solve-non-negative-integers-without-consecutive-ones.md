---
title: "How to Solve Non-negative Integers without Consecutive Ones — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Non-negative Integers without Consecutive Ones. Hard difficulty, 41.7% acceptance rate. Topics: Dynamic Programming."
date: "2028-07-24"
category: "dsa-patterns"
tags: ["non-negative-integers-without-consecutive-ones", "dynamic-programming", "hard"]
---

# How to Solve Non-negative Integers without Consecutive Ones

Given a positive integer `n`, we need to count all integers from `0` to `n` (inclusive) whose binary representation does not contain two consecutive `1`s. This problem is tricky because directly checking every number up to `n` is too slow for large `n` (up to 10⁹). The challenge lies in finding a way to count valid numbers without iterating through each one, which requires a clever combination of dynamic programming and bit manipulation.

## Visual Walkthrough

Let's build intuition with a small example: `n = 5`. The binary representations of numbers 0-5 are:

- 0: `0`
- 1: `1`
- 2: `10`
- 3: `11` ← Contains consecutive ones!
- 4: `100`
- 5: `101`

Valid numbers (no consecutive ones): 0, 1, 2, 4, 5 → **5 valid numbers**.

Now let's think about how to count these systematically. Consider binary numbers of length 3 (bits):

- Numbers starting with `0`: `0xx` → The last 2 bits can be any valid 2-bit number without consecutive ones
- Numbers starting with `1`: `1xx` → The next bit MUST be `0` (to avoid consecutive ones), so we have `10x` → The last bit can be any valid 1-bit number

This reveals a recurrence relation: Let `dp[k]` = number of valid k-bit binary numbers (including leading zeros). Then:

- `dp[0] = 1` (empty string)
- `dp[1] = 2` (0, 1)
- `dp[k] = dp[k-1] + dp[k-2]` for k ≥ 2
  - Numbers starting with `0`: `0` followed by any valid (k-1)-bit number → `dp[k-1]`
  - Numbers starting with `1`: `10` followed by any valid (k-2)-bit number → `dp[k-2]`

For example:

- `dp[2] = dp[1] + dp[0] = 2 + 1 = 3` (00, 01, 10)
- `dp[3] = dp[2] + dp[1] = 3 + 2 = 5` (000, 001, 010, 100, 101)

Notice this is the Fibonacci sequence! But we need to count numbers ≤ `n`, not all k-bit numbers. We'll use this DP approach combined with digit-by-digit analysis of `n`'s binary representation.

## Brute Force Approach

The brute force solution checks every integer from `0` to `n`, converts it to binary, and verifies it has no consecutive ones:

<div class="code-group">

```python
# Time: O(n * log n) | Space: O(log n)
def brute_force(n):
    def has_consecutive_ones(x):
        # Check if binary representation has consecutive 1s
        while x > 0:
            if (x & 3) == 3:  # Check last two bits: 3 = 11 in binary
                return True
            x >>= 1  # Shift right to check next pair
        return False

    count = 0
    for i in range(n + 1):
        if not has_consecutive_ones(i):
            count += 1
    return count
```

```javascript
// Time: O(n * log n) | Space: O(1)
function bruteForce(n) {
  function hasConsecutiveOnes(x) {
    // Check if binary representation has consecutive 1s
    while (x > 0) {
      if ((x & 3) === 3) {
        // Check last two bits: 3 = 11 in binary
        return true;
      }
      x >>= 1; // Shift right to check next pair
    }
    return false;
  }

  let count = 0;
  for (let i = 0; i <= n; i++) {
    if (!hasConsecutiveOnes(i)) {
      count++;
    }
  }
  return count;
}
```

```java
// Time: O(n * log n) | Space: O(1)
public int bruteForce(int n) {
    int count = 0;
    for (int i = 0; i <= n; i++) {
        if (!hasConsecutiveOnes(i)) {
            count++;
        }
    }
    return count;
}

private boolean hasConsecutiveOnes(int x) {
    // Check if binary representation has consecutive 1s
    while (x > 0) {
        if ((x & 3) == 3) {  // Check last two bits: 3 = 11 in binary
            return true;
        }
        x >>= 1;  // Shift right to check next pair
    }
    return false;
}
```

</div>

**Why this fails:** For `n` up to 10⁹, we'd need to check up to 1 billion numbers, each requiring O(log n) operations. This is O(n log n) ≈ 10⁹ × 30 = 30 billion operations, which is far too slow. We need a solution that works in O(log n) time.

## Optimized Approach

The key insight is to use **digit dynamic programming** (digit DP) on the binary representation of `n`. We process the bits from most significant to least significant, keeping track of whether we're still matching `n` exactly or can use any digits.

Let `bits` be the binary representation of `n`. We define:

- `dp[pos][tight][prev]` = number of ways to fill bits from position `pos` to the end
  - `pos`: current bit position (0 = most significant bit)
  - `tight`: 1 if we're still matching `n` exactly so far, 0 if we've already chosen a smaller digit
  - `prev`: the previous bit chosen (0 or 1)

At each step:

1. If `prev == 1`, we can only choose `0` for the current bit (to avoid consecutive ones)
2. If `prev == 0`, we can choose either `0` or `1`
3. If `tight == 1`, our choices are limited by the corresponding bit in `n`
4. If `tight == 0`, we can choose any valid digit

We can optimize space by noticing we only need the previous state, not all positions.

## Optimal Solution

Here's the complete solution using digit DP with memoization:

<div class="code-group">

```python
# Time: O(log n) | Space: O(log n) for recursion stack and memoization
class Solution:
    def findIntegers(self, n: int) -> int:
        # Convert n to binary string (most significant bit first)
        binary = bin(n)[2:]
        length = len(binary)

        # Memoization dictionary: (pos, tight, prev) -> count
        memo = {}

        def dfs(pos, tight, prev):
            """
            pos: current position in binary string (0 = most significant bit)
            tight: 1 if current prefix equals n's prefix, 0 otherwise
            prev: previous bit (0 or 1)
            Returns: number of valid integers from this state
            """
            # Base case: reached end of binary string
            if pos == length:
                return 1  # Found one valid number

            # Check memoization
            if (pos, tight, prev) in memo:
                return memo[(pos, tight, prev)]

            # Determine the maximum digit we can choose at this position
            max_digit = int(binary[pos]) if tight else 1

            count = 0
            # Try placing 0 at current position (always valid)
            count += dfs(pos + 1, tight and (0 == max_digit), 0)

            # Try placing 1 at current position if:
            # 1. It doesn't exceed max_digit
            # 2. Previous bit wasn't 1 (to avoid consecutive ones)
            if prev != 1 and 1 <= max_digit:
                count += dfs(pos + 1, tight and (1 == max_digit), 1)

            memo[(pos, tight, prev)] = count
            return count

        # Start from position 0, tight=True (matching n exactly), prev=0
        return dfs(0, True, 0)
```

```javascript
// Time: O(log n) | Space: O(log n) for recursion stack and memoization
var findIntegers = function (n) {
  // Convert n to binary string (most significant bit first)
  const binary = n.toString(2);
  const length = binary.length;

  // Memoization map: key = "pos,tight,prev" -> count
  const memo = new Map();

  const dfs = (pos, tight, prev) => {
    // Base case: reached end of binary string
    if (pos === length) {
      return 1; // Found one valid number
    }

    // Check memoization
    const key = `${pos},${tight ? 1 : 0},${prev}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    // Determine the maximum digit we can choose at this position
    const maxDigit = tight ? parseInt(binary[pos]) : 1;

    let count = 0;
    // Try placing 0 at current position (always valid)
    count += dfs(pos + 1, tight && 0 === maxDigit, 0);

    // Try placing 1 at current position if:
    // 1. It doesn't exceed maxDigit
    // 2. Previous bit wasn't 1 (to avoid consecutive ones)
    if (prev !== 1 && 1 <= maxDigit) {
      count += dfs(pos + 1, tight && 1 === maxDigit, 1);
    }

    memo.set(key, count);
    return count;
  };

  // Start from position 0, tight=true (matching n exactly), prev=0
  return dfs(0, true, 0);
};
```

```java
// Time: O(log n) | Space: O(log n) for recursion stack and memoization
class Solution {
    public int findIntegers(int n) {
        // Convert n to binary string (most significant bit first)
        String binary = Integer.toBinaryString(n);
        int length = binary.length();

        // Memoization array: dp[pos][tight][prev]
        // -1 indicates uncomputed state
        int[][][] memo = new int[length][2][2];
        for (int i = 0; i < length; i++) {
            for (int j = 0; j < 2; j++) {
                Arrays.fill(memo[i][j], -1);
            }
        }

        return dfs(0, 1, 0, binary, memo);
    }

    private int dfs(int pos, int tight, int prev, String binary, int[][][] memo) {
        // Base case: reached end of binary string
        if (pos == binary.length()) {
            return 1;  // Found one valid number
        }

        // Check memoization
        if (memo[pos][tight][prev] != -1) {
            return memo[pos][tight][prev];
        }

        // Determine the maximum digit we can choose at this position
        int maxDigit = (tight == 1) ? (binary.charAt(pos) - '0') : 1;

        int count = 0;
        // Try placing 0 at current position (always valid)
        int nextTight = (tight == 1 && 0 == maxDigit) ? 1 : 0;
        count += dfs(pos + 1, nextTight, 0, binary, memo);

        // Try placing 1 at current position if:
        // 1. It doesn't exceed maxDigit
        // 2. Previous bit wasn't 1 (to avoid consecutive ones)
        if (prev != 1 && 1 <= maxDigit) {
            nextTight = (tight == 1 && 1 == maxDigit) ? 1 : 0;
            count += dfs(pos + 1, nextTight, 1, binary, memo);
        }

        memo[pos][tight][prev] = count;
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log n)

- We process each bit of `n` exactly once
- There are O(log n) bits since n ≤ 10⁹ has at most 30 bits
- Each state (pos, tight, prev) is computed once and memoized
- Total states: O(2 × 2 × log n) = O(log n)

**Space Complexity:** O(log n)

- Recursion stack depth: O(log n)
- Memoization storage: O(log n) states
- Binary string representation: O(log n)

## Common Mistakes

1. **Forgetting to handle the "tight" constraint correctly**: When `tight = 1`, you must check if your current digit equals the corresponding digit in `n`. If you choose a smaller digit, `tight` becomes 0 for all subsequent positions.

2. **Incorrect base case**: The base case should return 1 (not 0) when we reach the end, because we've successfully constructed one valid number. Returning 0 would undercount.

3. **Not preventing consecutive ones when prev=1**: When the previous bit is 1, you must only choose 0 for the current bit. Forgetting this check counts invalid numbers.

4. **Off-by-one errors with binary representation**: Remember that `bin(n)[2:]` gives the binary without leading zeros. The length of this string is ⌊log₂n⌋ + 1, not n itself.

## When You'll See This Pattern

This **digit DP** pattern appears in problems where you need to count numbers in a range satisfying certain digit-based constraints:

1. **Count Numbers with Unique Digits (LeetCode 357)**: Count numbers with no repeated digits using similar digit-by-digit construction.

2. **Numbers At Most N Given Digit Set (LeetCode 902)**: Count numbers ≤ n using digits from a given set, using the same "tight" concept.

3. **Digit Count in Range (LeetCode 1067)**: Count occurrences of a digit in all numbers from 1 to n.

The core idea is to process digits from most significant to least significant, tracking whether you're still matching the upper bound exactly.

## Key Takeaways

1. **Digit DP is powerful for range counting problems**: When you need to count numbers in [0, n] with digit constraints, digit DP with memoization provides an O(log n) solution.

2. **The "tight" state is crucial**: It tracks whether your current prefix equals n's prefix, determining which digits you can choose next.

3. **Fibonacci appears in consecutive constraint problems**: The recurrence dp[k] = dp[k-1] + dp[k-2] appears whenever you have a "no consecutive ones" constraint, similar to the House Robber problem.

**Related problems:** [House Robber](/problem/house-robber), [House Robber II](/problem/house-robber-ii), [Ones and Zeroes](/problem/ones-and-zeroes)
