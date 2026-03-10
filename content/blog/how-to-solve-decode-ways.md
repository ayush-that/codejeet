---
title: "How to Solve Decode Ways — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Decode Ways. Medium difficulty, 37.6% acceptance rate. Topics: String, Dynamic Programming."
date: "2026-07-01"
category: "dsa-patterns"
tags: ["decode-ways", "string", "dynamic-programming", "medium"]
---

# How to Solve Decode Ways

You're given a string of digits representing an encoded message where each digit or pair of digits can map to a letter (1→A, 2→B, ..., 26→Z). Your task is to count how many different ways the message can be decoded. What makes this problem tricky is that a single digit can represent a letter (like "1"→A), but two consecutive digits might also represent a letter (like "12"→L), creating overlapping possibilities that require careful counting.

## Visual Walkthrough

Let's trace through the example `s = "226"` step by step to build intuition:

**Step 1: Start at the beginning**

- At position 0 (digit '2'): We can decode it as single digit "2" → 'B'
- Or we can look at positions 0-1 (digits "22"): "22" is between 10-26, so valid → 'V'

**Step 2: Visualize the decision tree**

```
Start at "226"
├── Take "2" → Remaining "26"
│   ├── Take "2" → Remaining "6" → Take "6" → Valid path
│   └── Take "26" → Remaining "" → Valid path
└── Take "22" → Remaining "6"
    └── Take "6" → Remaining "" → Valid path
```

We find 3 valid decodings: (2,2,6), (2,26), (22,6)

**Step 3: Notice the pattern**
The number of ways to decode `"226"` depends on:

- Ways to decode `"26"` (if we take first digit alone)
- Ways to decode `"6"` (if we take first two digits together)

This reveals a recurrence relation: `dp[i] = dp[i+1] + dp[i+2]` when the two-digit substring is valid, otherwise `dp[i] = dp[i+1]`.

## Brute Force Approach

The most intuitive approach is recursive backtracking: at each position, try decoding one digit (if it's not '0'), then try decoding two digits (if they form a valid number between 10-26).

<div class="code-group">

```python
# Time: O(2^n) | Space: O(n) for recursion stack
def numDecodings_brute(s: str) -> int:
    def backtrack(index: int) -> int:
        # Base case: reached end of string
        if index == len(s):
            return 1

        # If current digit is '0', no valid decoding
        if s[index] == '0':
            return 0

        # Try single digit decoding
        ways = backtrack(index + 1)

        # Try two-digit decoding if possible
        if index + 1 < len(s):
            two_digit = int(s[index:index+2])
            if 10 <= two_digit <= 26:
                ways += backtrack(index + 2)

        return ways

    return backtrack(0) if s else 0
```

```javascript
// Time: O(2^n) | Space: O(n) for recursion stack
function numDecodingsBrute(s) {
  function backtrack(index) {
    // Base case: reached end of string
    if (index === s.length) return 1;

    // If current digit is '0', no valid decoding
    if (s[index] === "0") return 0;

    // Try single digit decoding
    let ways = backtrack(index + 1);

    // Try two-digit decoding if possible
    if (index + 1 < s.length) {
      const twoDigit = parseInt(s.substring(index, index + 2));
      if (twoDigit >= 10 && twoDigit <= 26) {
        ways += backtrack(index + 2);
      }
    }

    return ways;
  }

  return s ? backtrack(0) : 0;
}
```

```java
// Time: O(2^n) | Space: O(n) for recursion stack
public int numDecodingsBrute(String s) {
    if (s == null || s.length() == 0) return 0;
    return backtrack(s, 0);
}

private int backtrack(String s, int index) {
    // Base case: reached end of string
    if (index == s.length()) return 1;

    // If current digit is '0', no valid decoding
    if (s.charAt(index) == '0') return 0;

    // Try single digit decoding
    int ways = backtrack(s, index + 1);

    // Try two-digit decoding if possible
    if (index + 1 < s.length()) {
        int twoDigit = Integer.parseInt(s.substring(index, index + 2));
        if (twoDigit >= 10 && twoDigit <= 26) {
            ways += backtrack(s, index + 2);
        }
    }

    return ways;
}
```

</div>

**Why this is inefficient:** The brute force solution has exponential time complexity O(2ⁿ) because at each position we make up to 2 recursive calls. For a string like `"111111"`, we're repeatedly solving the same subproblems. This is where dynamic programming comes in.

## Optimized Approach

The key insight is that this problem has **optimal substructure** and **overlapping subproblems** — the hallmarks of dynamic programming.

**DP State Definition:**
Let `dp[i]` = number of ways to decode the substring starting at position `i` (from index `i` to the end).

**Recurrence Relation:**

1. If `s[i] == '0'`: `dp[i] = 0` (no valid decoding can start with '0')
2. Otherwise:
   - `dp[i] = dp[i+1]` (take single digit)
   - Plus `dp[i+2]` if `s[i:i+2]` is between 10-26 (take two digits)

**Base Cases:**

- `dp[n] = 1` (empty string has 1 way to decode)
- `dp[n-1] = 0` if `s[n-1] == '0'`, else `1`

**Optimization:** We only need the last two values, so we can use O(1) space instead of O(n).

## Optimal Solution

Here's the bottom-up dynamic programming solution with space optimization:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def numDecodings(s: str) -> int:
    # Edge case: empty string or starting with '0'
    if not s or s[0] == '0':
        return 0

    n = len(s)

    # Use two variables instead of full dp array
    # dp_i_plus_2 represents dp[i+2], dp_i_plus_1 represents dp[i+1]
    dp_i_plus_2 = 1  # dp[n] = 1 (empty string)
    dp_i_plus_1 = 1 if s[n-1] != '0' else 0  # dp[n-1]

    # Process from right to left
    for i in range(n-2, -1, -1):
        current = 0

        # If current digit is '0', no valid decoding starts here
        if s[i] == '0':
            current = 0
        else:
            # Single digit decoding
            current = dp_i_plus_1

            # Check if two-digit decoding is possible
            two_digit = int(s[i:i+2])
            if 10 <= two_digit <= 26:
                current += dp_i_plus_2

        # Shift variables for next iteration
        dp_i_plus_2, dp_i_plus_1 = dp_i_plus_1, current

    return dp_i_plus_1
```

```javascript
// Time: O(n) | Space: O(1)
function numDecodings(s) {
  // Edge case: empty string or starting with '0'
  if (!s || s[0] === "0") return 0;

  const n = s.length;

  // Use two variables instead of full dp array
  // dpIPlus2 represents dp[i+2], dpIPlus1 represents dp[i+1]
  let dpIPlus2 = 1; // dp[n] = 1 (empty string)
  let dpIPlus1 = s[n - 1] !== "0" ? 1 : 0; // dp[n-1]

  // Process from right to left
  for (let i = n - 2; i >= 0; i--) {
    let current = 0;

    // If current digit is '0', no valid decoding starts here
    if (s[i] === "0") {
      current = 0;
    } else {
      // Single digit decoding
      current = dpIPlus1;

      // Check if two-digit decoding is possible
      const twoDigit = parseInt(s.substring(i, i + 2));
      if (twoDigit >= 10 && twoDigit <= 26) {
        current += dpIPlus2;
      }
    }

    // Shift variables for next iteration
    dpIPlus2 = dpIPlus1;
    dpIPlus1 = current;
  }

  return dpIPlus1;
}
```

```java
// Time: O(n) | Space: O(1)
public int numDecodings(String s) {
    // Edge case: empty string or starting with '0'
    if (s == null || s.length() == 0 || s.charAt(0) == '0') {
        return 0;
    }

    int n = s.length();

    // Use two variables instead of full dp array
    // dpIPlus2 represents dp[i+2], dpIPlus1 represents dp[i+1]
    int dpIPlus2 = 1;  // dp[n] = 1 (empty string)
    int dpIPlus1 = s.charAt(n-1) != '0' ? 1 : 0;  // dp[n-1]

    // Process from right to left
    for (int i = n - 2; i >= 0; i--) {
        int current = 0;

        // If current digit is '0', no valid decoding starts here
        if (s.charAt(i) == '0') {
            current = 0;
        } else {
            // Single digit decoding
            current = dpIPlus1;

            // Check if two-digit decoding is possible
            int twoDigit = Integer.parseInt(s.substring(i, i + 2));
            if (twoDigit >= 10 && twoDigit <= 26) {
                current += dpIPlus2;
            }
        }

        // Shift variables for next iteration
        dpIPlus2 = dpIPlus1;
        dpIPlus1 = current;
    }

    return dpIPlus1;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We iterate through the string once from right to left
- Each iteration does constant work: checking current digit and possibly parsing two digits

**Space Complexity:** O(1)

- We only store two variables (`dp_i_plus_1` and `dp_i_plus_2`) regardless of input size
- This is the space-optimized version; the non-optimized version would be O(n)

## Common Mistakes

1. **Forgetting to handle '0' properly:** '0' alone cannot be decoded to any letter. A common mistake is treating '0' as valid or not checking if two-digit numbers starting with '0' (like "01", "02") are invalid. Remember: only 10-26 are valid two-digit codes.

2. **Off-by-one errors in two-digit parsing:** When checking `s[i:i+2]`, ensure `i+1` is within bounds. Also, converting to integer should use exactly two characters, not more.

3. **Incorrect base cases:** The empty string should return 1 way (not 0) because when we successfully decode the entire string, we've found one valid decoding. This is counterintuitive but crucial for the recurrence to work.

4. **Not handling edge cases:** Empty string, string starting with '0', string containing only '0', and single-character strings all need special handling. Always test: `""`, `"0"`, `"10"`, `"01"`, `"1"`.

## When You'll See This Pattern

This "ways to decode/partition" pattern appears in several variations:

1. **Decode Ways II (Hard):** Same problem but with '\*' characters that can represent 1-9, adding complexity to the state transitions.

2. **Climbing Stairs (Easy):** Essentially the same recurrence (`dp[i] = dp[i-1] + dp[i-2]`) but with simpler constraints (always can take 1 or 2 steps).

3. **Count Number of Texts (Medium):** Similar concept but with phone keypad mappings where some digits can map to 3 or 4 letters, changing the window size in the recurrence.

The core pattern is: **count the number of ways to partition a sequence where each partition must satisfy certain constraints, and the count depends on overlapping subproblems.**

## Key Takeaways

1. **Recognize overlapping subproblems:** When a problem asks for "number of ways" and decisions at each step affect future decisions, dynamic programming is likely the solution.

2. **Start from the end for string DP problems:** Processing from right to left often simplifies the recurrence when the decision depends on what comes after the current position.

3. **Space optimization is often possible:** If the recurrence only depends on a constant number of previous states, you can reduce space from O(n) to O(1).

Related problems: [Decode Ways II](/problem/decode-ways-ii), [Number of Ways to Separate Numbers](/problem/number-of-ways-to-separate-numbers), [Count Number of Texts](/problem/count-number-of-texts)
