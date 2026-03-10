---
title: "How to Solve Sum of k-Mirror Numbers — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Sum of k-Mirror Numbers. Hard difficulty, 63.8% acceptance rate. Topics: Math, Enumeration."
date: "2027-11-30"
category: "dsa-patterns"
tags: ["sum-of-k-mirror-numbers", "math", "enumeration", "hard"]
---

# How to Solve Sum of k-Mirror Numbers

This problem asks us to find the sum of the smallest `n` numbers that are palindromes in both base-10 (decimal) and base-k. The challenge lies in efficiently generating these dual palindromes without brute-forcing through all integers, which would be far too slow given the constraints (k can be up to 9 and n up to 30, but numbers can be very large).

What makes this problem interesting is that we need to generate palindromes in one base and then verify them in another base, but we must do so in increasing order. The key insight is that we can generate decimal palindromes systematically and check if they're also palindromes in base-k, rather than checking every integer.

## Visual Walkthrough

Let's trace through finding the first 3 2-mirror numbers (k=2, n=3):

**Step 1:** Start with the smallest positive integer, 1.

- Decimal: "1" (palindrome ✓)
- Base-2: "1" (palindrome ✓)
- Found first 2-mirror number: 1

**Step 2:** Check 2:

- Decimal: "2" (palindrome ✓)
- Base-2: "10" (not palindrome ✗)

**Step 3:** Check 3:

- Decimal: "3" (palindrome ✓)
- Base-2: "11" (palindrome ✓)
- Found second 2-mirror number: 3

**Step 4:** Check 4:

- Decimal: "4" (palindrome ✓)
- Base-2: "100" (not palindrome ✗)

**Step 5:** Check 5:

- Decimal: "5" (palindrome ✓)
- Base-2: "101" (palindrome ✓)
- Found third 2-mirror number: 5

So the sum of the first 3 2-mirror numbers is 1 + 3 + 5 = 9.

However, this brute-force checking of every integer becomes impractical as numbers grow larger. We need a smarter way to generate palindromes directly.

## Brute Force Approach

The most straightforward approach would be to iterate through all positive integers starting from 1, convert each to base-k, and check if both representations are palindromes. We'd stop when we've found `n` such numbers.

**Why this fails:**

1. **Exponential growth:** Palindromes become increasingly rare as numbers grow. For k=9 and n=30, we might need to check millions of numbers.
2. **Large number handling:** The 30th k-mirror number can be enormous (up to ~10^15), making iteration through all integers impossible.
3. **Base conversion overhead:** Converting every number to base-k adds significant computational cost.

Even with optimizations like skipping even numbers when k=2, this approach would time out for the problem constraints.

## Optimized Approach

The key insight is to **generate decimal palindromes in increasing order** and check if they're also palindromes in base-k. This is much more efficient because:

1. Palindromes are much rarer than all integers
2. We can generate them systematically without gaps
3. We only need to check base-k palindrome condition for already-confirmed decimal palindromes

**How to generate decimal palindromes in order:**

- Generate palindromes by length (1-digit, 2-digit, 3-digit, etc.)
- For each length, generate all possible palindromes
- Sort or generate them in natural order

**Palindrome generation technique:**
For a palindrome of length `L`:

- If `L` is even: Generate all numbers of length `L/2` and mirror them
- If `L` is odd: Generate all numbers of length `(L+1)/2` and mirror all but the last digit

Example for 3-digit palindromes:

- Take numbers 10 to 99 (2-digit prefixes)
- For each prefix "ab", create palindrome "aba"

**Optimization:** We can generate the next palindrome directly without storing all of them by using a counter for the "half" and constructing the full palindrome.

## Optimal Solution

The optimal solution generates decimal palindromes in increasing order, converts each to base-k, and checks if the base-k representation is also a palindrome. We continue until we find `n` such numbers.

<div class="code-group">

```python
# Time: O(n * M) where M is the average palindrome length
# Space: O(log M) for string conversions
class Solution:
    def kMirror(self, k: int, n: int) -> int:
        def is_palindrome(s: str) -> bool:
            """Check if a string is a palindrome."""
            return s == s[::-1]

        def next_palindrome(num: int) -> int:
            """
            Get the next palindrome greater than the given number.
            Works by taking the left half, incrementing it, and mirroring.
            """
            s = str(num)
            length = len(s)

            # Get the left half (including middle for odd length)
            left = s[:(length + 1) // 2]

            # Try to create palindrome by mirroring the current left half
            candidate = int(left + left[-(length % 2) - 1::-1])

            # If this candidate is greater than original, return it
            if candidate > num:
                return candidate

            # Otherwise, increment the left half and create new palindrome
            left_incremented = str(int(left) + 1)

            # Handle carry-over (e.g., 99 -> 100)
            if len(left_incremented) > len(left):
                # For even length, next palindrome is 10...01
                if length % 2 == 0:
                    return int('1' + '0' * (length - 1) + '1')
                # For odd length, next palindrome is 10...01
                else:
                    return int('1' + '0' * (length - 1) + '1')

            # Mirror the incremented left half
            return int(left_incremented + left_incremented[-(length % 2) - 1::-1])

        def to_base_k(num: int, k: int) -> str:
            """Convert a number to base-k representation."""
            if num == 0:
                return "0"

            digits = []
            while num > 0:
                digits.append(str(num % k))
                num //= k

            return ''.join(digits[::-1])

        # Start with the smallest palindrome
        current = 1
        total = 0
        count = 0

        while count < n:
            # Check if current decimal palindrome is also palindrome in base-k
            if is_palindrome(to_base_k(current, k)):
                total += current
                count += 1

            # Get next decimal palindrome
            current = next_palindrome(current)

        return total
```

```javascript
// Time: O(n * M) where M is the average palindrome length
// Space: O(log M) for string conversions
/**
 * @param {number} k
 * @param {number} n
 * @return {number}
 */
var kMirror = function (k, n) {
  // Helper function to check if a string is a palindrome
  const isPalindrome = (s) => {
    return s === s.split("").reverse().join("");
  };

  // Helper function to get the next palindrome greater than given number
  const nextPalindrome = (num) => {
    const s = num.toString();
    const length = s.length;

    // Get the left half (including middle for odd length)
    const left = s.substring(0, Math.floor((length + 1) / 2));

    // Try to create palindrome by mirroring current left half
    let candidate =
      left +
      left
        .substring(0, length % 2 === 0 ? left.length : left.length - 1)
        .split("")
        .reverse()
        .join("");

    // If this candidate is greater than original, return it
    if (parseInt(candidate) > num) {
      return parseInt(candidate);
    }

    // Otherwise, increment the left half
    let leftIncremented = (parseInt(left) + 1).toString();

    // Handle carry-over (e.g., 99 -> 100)
    if (leftIncremented.length > left.length) {
      // For both even and odd lengths, next palindrome is 10...01
      return parseInt("1" + "0".repeat(length - 1) + "1");
    }

    // Mirror the incremented left half
    candidate =
      leftIncremented +
      leftIncremented
        .substring(0, length % 2 === 0 ? leftIncremented.length : leftIncremented.length - 1)
        .split("")
        .reverse()
        .join("");
    return parseInt(candidate);
  };

  // Helper function to convert number to base-k
  const toBaseK = (num, k) => {
    if (num === 0) return "0";

    const digits = [];
    while (num > 0) {
      digits.push((num % k).toString());
      num = Math.floor(num / k);
    }

    return digits.reverse().join("");
  };

  // Start with the smallest palindrome
  let current = 1;
  let total = 0;
  let count = 0;

  while (count < n) {
    // Check if current decimal palindrome is also palindrome in base-k
    if (isPalindrome(toBaseK(current, k))) {
      total += current;
      count++;
    }

    // Get next decimal palindrome
    current = nextPalindrome(current);
  }

  return total;
};
```

```java
// Time: O(n * M) where M is the average palindrome length
// Space: O(log M) for string conversions
class Solution {
    public long kMirror(int k, int n) {
        // Helper function to check if a string is a palindrome
        private boolean isPalindrome(String s) {
            int left = 0, right = s.length() - 1;
            while (left < right) {
                if (s.charAt(left) != s.charAt(right)) {
                    return false;
                }
                left++;
                right--;
            }
            return true;
        }

        // Helper function to get the next palindrome greater than given number
        private long nextPalindrome(long num) {
            String s = Long.toString(num);
            int length = s.length();

            // Get the left half (including middle for odd length)
            String left = s.substring(0, (length + 1) / 2);

            // Try to create palindrome by mirroring current left half
            StringBuilder candidate = new StringBuilder(left);
            for (int i = length / 2 - 1; i >= 0; i--) {
                candidate.append(left.charAt(i));
            }

            long candidateNum = Long.parseLong(candidate.toString());

            // If this candidate is greater than original, return it
            if (candidateNum > num) {
                return candidateNum;
            }

            // Otherwise, increment the left half
            long leftNum = Long.parseLong(left) + 1;
            String leftIncremented = Long.toString(leftNum);

            // Handle carry-over (e.g., 99 -> 100)
            if (leftIncremented.length() > left.length()) {
                // For both even and odd lengths, next palindrome is 10...01
                StringBuilder next = new StringBuilder("1");
                for (int i = 0; i < length - 1; i++) {
                    next.append("0");
                }
                next.append("1");
                return Long.parseLong(next.toString());
            }

            // Mirror the incremented left half
            StringBuilder newCandidate = new StringBuilder(leftIncremented);
            for (int i = length / 2 - 1; i >= 0; i--) {
                newCandidate.append(leftIncremented.charAt(i));
            }

            return Long.parseLong(newCandidate.toString());
        }

        // Helper function to convert number to base-k
        private String toBaseK(long num, int k) {
            if (num == 0) return "0";

            StringBuilder result = new StringBuilder();
            while (num > 0) {
                result.append(num % k);
                num /= k;
            }

            return result.reverse().toString();
        }

        // Start with the smallest palindrome
        long current = 1;
        long total = 0;
        int count = 0;

        while (count < n) {
            // Check if current decimal palindrome is also palindrome in base-k
            if (isPalindrome(toBaseK(current, k))) {
                total += current;
                count++;
            }

            // Get next decimal palindrome
            current = nextPalindrome(current);
        }

        return total;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n \* M)

- `n` is the number of k-mirror numbers to find
- `M` is the average length (in digits) of the decimal palindromes we check
- For each candidate, we:
  1. Generate the next palindrome: O(M)
  2. Convert to base-k: O(logₖ(num)) ≈ O(M)
  3. Check palindrome in base-k: O(M)
- Since we only check decimal palindromes (not all numbers), and palindromes become increasingly sparse, this is efficient enough.

**Space Complexity:** O(log M)

- We need space to store string representations of numbers
- The base conversion and palindrome checking use O(digit length) space
- No additional data structures are needed

## Common Mistakes

1. **Brute-forcing all integers:** This is the most common mistake. Candidates try to iterate through all positive integers, which times out for large n. Remember that palindromes are rare - generate them directly.

2. **Incorrect palindrome generation:** When generating the next palindrome, forgetting to handle:
   - Carry-over cases (e.g., 99 → 101, not 100)
   - Difference between even and odd length palindromes
   - The mirroring logic for odd-length palindromes (don't repeat the middle digit)

3. **Base conversion errors:**
   - Forgetting that base-k digits can be more than one character (though in this problem k ≤ 9)
   - Not handling the zero case properly
   - Reversing digits in wrong order during conversion

4. **Integer overflow:** The numbers can be very large (up to ~10^15). Use 64-bit integers (long in Java/JavaScript, int in Python handles big integers natively).

## When You'll See This Pattern

This problem combines several important patterns:

1. **Palindrome Generation:** Similar to "Strobogrammatic Number II" where you generate all strobogrammatic numbers of length n. The technique of building from the middle out or generating halves and mirroring is common.

2. **Base Conversion with Palindrome Check:** Seen in "Prime Palindrome" where you need to find prime numbers that are palindromes. The difference is that here we check two bases.

3. **Systematic Enumeration:** Problems like "Ugly Number II" or "Super Ugly Number" where you need to generate numbers in order based on certain properties. The key is to generate candidates in increasing order without gaps.

## Key Takeaways

1. **Generate, don't filter:** When looking for numbers with specific properties (like being palindromes), it's often more efficient to generate candidates with that property directly rather than filtering all numbers.

2. **Work in the smaller space:** Here, decimal palindromes are easier to generate in order than base-k palindromes. Choose the representation that's simpler to work with for generation.

3. **Break down complex conditions:** The problem requires numbers to be palindromes in two bases. Instead of checking both conditions simultaneously, generate candidates that satisfy one condition (decimal palindrome) and then verify the other (base-k palindrome).

Related problems: [Strobogrammatic Number II](/problem/strobogrammatic-number-ii), [Prime Palindrome](/problem/prime-palindrome)
