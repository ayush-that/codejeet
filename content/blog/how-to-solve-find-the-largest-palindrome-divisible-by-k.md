---
title: "How to Solve Find the Largest Palindrome Divisible by K — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the Largest Palindrome Divisible by K. Hard difficulty, 16.9% acceptance rate. Topics: Math, String, Dynamic Programming, Greedy, Number Theory."
date: "2026-06-13"
category: "dsa-patterns"
tags:
  ["find-the-largest-palindrome-divisible-by-k", "math", "string", "dynamic-programming", "hard"]
---

# How to Solve "Find the Largest Palindrome Divisible by K"

You need to find the largest n-digit palindrome that's divisible by k. The challenge is that n can be up to 10^5 digits long, so you can't work with actual numbers—you must work with strings. This problem combines palindrome construction with modular arithmetic, making it both a string manipulation and number theory challenge.

## Visual Walkthrough

Let's trace through an example: `n = 4, k = 3`

We want the largest 4-digit palindrome divisible by 3. A 4-digit palindrome has the form `abba` where `a` and `b` are digits.

**Step 1:** Start with the largest possible palindrome: `9999`

- Check if divisible by 3: 9+9+9+9 = 36, divisible by 3 ✓
- But wait! We need to verify the actual number 9999 mod 3 = 0
- 9999 ÷ 3 = 3333 exactly, so this works!

But what if k=7? Let's try `n = 3, k = 7`:

**Step 1:** Largest 3-digit palindrome: `999` (form: `aba`)

- 999 mod 7 = 5 (not divisible)

**Step 2:** Try next: `989`

- 989 mod 7 = 2 (not divisible)

**Step 3:** Continue downward: `979`, `969`, etc.

- We need a systematic way to check divisibility without brute force

The key insight: For large n (like 10^5), we can't check every palindrome. We need to construct the largest palindrome that satisfies the divisibility constraint using modular arithmetic.

## Brute Force Approach

A naive approach would generate all n-digit palindromes from largest to smallest and check divisibility:

1. Start with the largest n-digit number
2. Check if it's a palindrome
3. If yes, check if divisible by k
4. If not, decrement and repeat

This fails spectacularly because:

- For n=5, there are 90,000 numbers to check (900 5-digit palindromes)
- For n=100,000, there are 9×10^49,999 palindromes—impossible to check
- Even checking divisibility of such huge numbers is computationally infeasible

The brute force teaches us we need a constructive approach, not a search approach.

## Optimized Approach

The solution has three main insights:

1. **Palindrome Structure**: An n-digit palindrome is determined by its first ⌈n/2⌉ digits
   - For even n: first n/2 digits mirrored
   - For odd n: first (n+1)/2 digits mirrored (middle digit appears once)

2. **Modular Arithmetic**: We can compute (number mod k) using the palindrome structure
   - If we know the first half's value `x`, the full palindrome value is:
     - Even n: `x × 10^(n/2) + reverse(x)`
     - Odd n: `x × 10^((n-1)/2) + reverse(x/10)` (dropping middle digit)

3. **Greedy Construction**: Build the largest palindrome by:
   - Starting with all '9's in first half
   - Systematically trying smaller values
   - Using DP to track remainders

The algorithm:

1. Let `m = ceil(n/2)` (length of first half)
2. Start with first half = '9'×m (largest possible)
3. Use DP to find if we can complete this to a palindrome divisible by k
4. If not, decrement the first half and try again
5. Use memoization to avoid recomputing remainders

## Optimal Solution

The solution uses dynamic programming where `dp[i][r]` represents whether we can arrange the first `i` digits of the first half to achieve remainder `r` modulo k.

<div class="code-group">

```python
# Time: O(n * k) | Space: O(n * k)
def largestPalindrome(n: int, k: int) -> str:
    # Special case: n = 1, just find largest single digit divisible by k
    if n == 1:
        for digit in range(9, -1, -1):
            if digit % k == 0:
                return str(digit)
        return ""

    # m is the length of the first half (including middle for odd n)
    m = (n + 1) // 2

    # Try from largest possible first half down to smallest
    for first_half in range(10**m - 1, 10**(m-1) - 1, -1):
        first_str = str(first_half).zfill(m)

        # Build the full palindrome from first half
        if n % 2 == 0:
            # Even length: mirror entire first half
            full_str = first_str + first_str[::-1]
        else:
            # Odd length: mirror first half except last digit
            full_str = first_str + first_str[-2::-1]

        # Check divisibility using modular arithmetic
        # We need to compute (full number) % k without converting to int
        remainder = 0
        for char in full_str:
            remainder = (remainder * 10 + int(char)) % k

        if remainder == 0:
            return full_str

    return ""

# Alternative DP approach for very large n (when above is too slow)
def largestPalindromeDP(n: int, k: int) -> str:
    if n == 1:
        for digit in range(9, -1, -1):
            if digit % k == 0:
                return str(digit)
        return ""

    m = (n + 1) // 2
    # DP[i][r] = can we achieve remainder r with first i digits?
    dp = [[False] * k for _ in range(m + 1)]
    prev = [[-1] * k for _ in range(m + 1)]
    prev_digit = [[-1] * k for _ in range(m + 1)]

    # Initialize: 0 digits, remainder 0
    dp[0][0] = True

    # Fill DP table
    for i in range(m):
        for r in range(k):
            if dp[i][r]:
                # Try all possible digits at position i
                start_digit = 9 if i == 0 else 0  # first digit can't be 0
                for d in range(start_digit, 10):
                    new_r = (r * 10 + d) % k
                    dp[i + 1][new_r] = True
                    prev[i + 1][new_r] = r
                    prev_digit[i + 1][new_r] = d

    # Find the largest palindrome
    # We need remainder that works for full palindrome
    result = []

    # For each possible remainder of first half, check if we can complete
    for start_r in range(k - 1, -1, -1):
        if dp[m][start_r]:
            # Reconstruct first half
            first_half = []
            curr_r = start_r
            for i in range(m, 0, -1):
                d = prev_digit[i][curr_r]
                first_half.append(str(d))
                curr_r = prev[i][curr_r]

            first_half_str = ''.join(reversed(first_half))

            # Build full palindrome
            if n % 2 == 0:
                full = first_half_str + first_half_str[::-1]
            else:
                full = first_half_str + first_half_str[-2::-1]

            # Verify (should be true by construction)
            remainder = 0
            for char in full:
                remainder = (remainder * 10 + int(char)) % k
            if remainder == 0:
                return full

    return ""
```

```javascript
// Time: O(n * k) | Space: O(n * k)
function largestPalindrome(n, k) {
  // Special case: n = 1
  if (n === 1) {
    for (let digit = 9; digit >= 0; digit--) {
      if (digit % k === 0) {
        return digit.toString();
      }
    }
    return "";
  }

  // Length of first half (including middle for odd n)
  const m = Math.floor((n + 1) / 2);

  // Try from largest possible first half down to smallest
  const start = Math.pow(10, m) - 1;
  const end = Math.pow(10, m - 1) - 1;

  for (let firstHalf = start; firstHalf > end; firstHalf--) {
    let firstStr = firstHalf.toString().padStart(m, "0");

    // Build the full palindrome
    let fullStr;
    if (n % 2 === 0) {
      // Even length: mirror entire first half
      fullStr = firstStr + firstStr.split("").reverse().join("");
    } else {
      // Odd length: mirror first half except last digit
      fullStr = firstStr + firstStr.slice(0, -1).split("").reverse().join("");
    }

    // Check divisibility using modular arithmetic
    let remainder = 0;
    for (let i = 0; i < fullStr.length; i++) {
      remainder = (remainder * 10 + parseInt(fullStr[i])) % k;
    }

    if (remainder === 0) {
      return fullStr;
    }
  }

  return "";
}

// DP approach for very large n
function largestPalindromeDP(n, k) {
  if (n === 1) {
    for (let digit = 9; digit >= 0; digit--) {
      if (digit % k === 0) {
        return digit.toString();
      }
    }
    return "";
  }

  const m = Math.floor((n + 1) / 2);

  // DP[i][r] = can we achieve remainder r with first i digits?
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(k).fill(false));
  const prev = Array(m + 1)
    .fill()
    .map(() => Array(k).fill(-1));
  const prevDigit = Array(m + 1)
    .fill()
    .map(() => Array(k).fill(-1));

  // Initialize
  dp[0][0] = true;

  // Fill DP table
  for (let i = 0; i < m; i++) {
    for (let r = 0; r < k; r++) {
      if (dp[i][r]) {
        // Try all possible digits at position i
        const startDigit = i === 0 ? 9 : 0; // first digit can't be 0
        for (let d = startDigit; d < 10; d++) {
          const newR = (r * 10 + d) % k;
          dp[i + 1][newR] = true;
          prev[i + 1][newR] = r;
          prevDigit[i + 1][newR] = d;
        }
      }
    }
  }

  // Find the largest palindrome
  for (let startR = k - 1; startR >= 0; startR--) {
    if (dp[m][startR]) {
      // Reconstruct first half
      const firstHalf = [];
      let currR = startR;

      for (let i = m; i > 0; i--) {
        const d = prevDigit[i][currR];
        firstHalf.push(d.toString());
        currR = prev[i][currR];
      }

      const firstHalfStr = firstHalf.reverse().join("");

      // Build full palindrome
      let full;
      if (n % 2 === 0) {
        full = firstHalfStr + firstHalfStr.split("").reverse().join("");
      } else {
        full = firstHalfStr + firstHalfStr.slice(0, -1).split("").reverse().join("");
      }

      // Verify
      let remainder = 0;
      for (let i = 0; i < full.length; i++) {
        remainder = (remainder * 10 + parseInt(full[i])) % k;
      }

      if (remainder === 0) {
        return full;
      }
    }
  }

  return "";
}
```

```java
// Time: O(n * k) | Space: O(n * k)
class Solution {
    public String largestPalindrome(int n, int k) {
        // Special case: n = 1
        if (n == 1) {
            for (int digit = 9; digit >= 0; digit--) {
                if (digit % k == 0) {
                    return Integer.toString(digit);
                }
            }
            return "";
        }

        // Length of first half (including middle for odd n)
        int m = (n + 1) / 2;

        // Try from largest possible first half down to smallest
        long start = (long)Math.pow(10, m) - 1;
        long end = (long)Math.pow(10, m - 1) - 1;

        for (long firstHalf = start; firstHalf > end; firstHalf--) {
            String firstStr = String.format("%0" + m + "d", firstHalf);

            // Build the full palindrome
            StringBuilder fullBuilder = new StringBuilder(firstStr);
            if (n % 2 == 0) {
                // Even length: mirror entire first half
                fullBuilder.append(new StringBuilder(firstStr).reverse());
            } else {
                // Odd length: mirror first half except last digit
                fullBuilder.append(new StringBuilder(firstStr.substring(0, m - 1)).reverse());
            }

            String fullStr = fullBuilder.toString();

            // Check divisibility using modular arithmetic
            long remainder = 0;
            for (int i = 0; i < fullStr.length(); i++) {
                remainder = (remainder * 10 + (fullStr.charAt(i) - '0')) % k;
            }

            if (remainder == 0) {
                return fullStr;
            }
        }

        return "";
    }

    // DP approach for very large n
    public String largestPalindromeDP(int n, int k) {
        if (n == 1) {
            for (int digit = 9; digit >= 0; digit--) {
                if (digit % k == 0) {
                    return Integer.toString(digit);
                }
            }
            return "";
        }

        int m = (n + 1) / 2;

        // DP[i][r] = can we achieve remainder r with first i digits?
        boolean[][] dp = new boolean[m + 1][k];
        int[][] prev = new int[m + 1][k];
        int[][] prevDigit = new int[m + 1][k];

        // Initialize arrays
        for (int i = 0; i <= m; i++) {
            Arrays.fill(prev[i], -1);
            Arrays.fill(prevDigit[i], -1);
        }

        // Initialize: 0 digits, remainder 0
        dp[0][0] = true;

        // Fill DP table
        for (int i = 0; i < m; i++) {
            for (int r = 0; r < k; r++) {
                if (dp[i][r]) {
                    // Try all possible digits at position i
                    int startDigit = (i == 0) ? 9 : 0;  // first digit can't be 0
                    for (int d = startDigit; d < 10; d++) {
                        int newR = (r * 10 + d) % k;
                        dp[i + 1][newR] = true;
                        prev[i + 1][newR] = r;
                        prevDigit[i + 1][newR] = d;
                    }
                }
            }
        }

        // Find the largest palindrome
        for (int startR = k - 1; startR >= 0; startR--) {
            if (dp[m][startR]) {
                // Reconstruct first half
                StringBuilder firstHalf = new StringBuilder();
                int currR = startR;

                for (int i = m; i > 0; i--) {
                    int d = prevDigit[i][currR];
                    firstHalf.append(d);
                    currR = prev[i][currR];
                }

                String firstHalfStr = firstHalf.reverse().toString();

                // Build full palindrome
                StringBuilder full = new StringBuilder(firstHalfStr);
                if (n % 2 == 0) {
                    full.append(new StringBuilder(firstHalfStr).reverse());
                } else {
                    full.append(new StringBuilder(firstHalfStr.substring(0, m - 1)).reverse());
                }

                // Verify
                long remainder = 0;
                String fullStr = full.toString();
                for (int i = 0; i < fullStr.length(); i++) {
                    remainder = (remainder * 10 + (fullStr.charAt(i) - '0')) % k;
                }

                if (remainder == 0) {
                    return fullStr;
                }
            }
        }

        return "";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- First approach (iterative): O(10^m) where m = ceil(n/2), which is exponential in n
- DP approach: O(m × k × 10) = O(n × k) since we try 10 digits at each position
- For n up to 10^5 and k up to 100, this is feasible (10^7 operations)

**Space Complexity:**

- DP approach: O(n × k) for the DP tables
- We can optimize to O(k) by only storing current and previous rows

The DP approach is necessary for large n because the iterative approach would try 10^(n/2) possibilities.

## Common Mistakes

1. **Not handling n=1 separately**: When n=1, we're looking for a single digit divisible by k. The palindrome construction logic fails here.

2. **Forgetting leading zeros in first half**: When decrementing the first half, numbers like 100 become "100" not "001", but we need to consider "001" as a valid first half for palindrome construction.

3. **Incorrect palindrome construction for odd n**: For odd-length palindromes, the middle digit appears only once. Many candidates mistakenly mirror the entire first half.

4. **Not using modular arithmetic for large n**: Trying to convert the full palindrome string to an integer will overflow for n > 20. Always use modular arithmetic: `new_remainder = (old_remainder * 10 + digit) % k`.

## When You'll See This Pattern

This problem combines several patterns:

1. **Palindrome Construction**: Similar to "Find the Closest Palindrome" where you work with halves of palindromes.

2. **Modular Arithmetic with DP**: Used in problems like "Divisible by K" or "Number of Digit One" where you track remainders.

3. **Greedy with Verification**: Like "Largest Multiple of Three" where you build the largest number satisfying a divisibility rule.

Related problems:

- **Palindrome Number**: Basic palindrome checking
- **Find the Closest Palindrome**: Similar palindrome construction
- **Largest Multiple of Three**: Greedy construction with divisibility rules

## Key Takeaways

1. **Palindromes are determined by their first half**: This reduces the search space from 10^n to 10^(n/2).

2. **Modular arithmetic works digit by digit**: You don't need the full number to check divisibility—process digits left to right updating remainder.

3. **DP with remainder states**: When you need to construct a number satisfying a modular condition, DP over positions and remainders is often the solution.

4. **Start from largest and work downward**: For "largest X satisfying Y" problems, a greedy approach trying largest candidates first often works.

Related problems: [Palindrome Number](/problem/palindrome-number), [Find the Closest Palindrome](/problem/find-the-closest-palindrome)
