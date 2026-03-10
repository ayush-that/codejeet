---
title: "How to Solve Prime Palindrome — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Prime Palindrome. Medium difficulty, 28.0% acceptance rate. Topics: Math, Number Theory."
date: "2028-08-15"
category: "dsa-patterns"
tags: ["prime-palindrome", "math", "number-theory", "medium"]
---

# How to Solve Prime Palindrome

We need to find the smallest prime palindrome number greater than or equal to a given integer `n`. This problem combines two mathematical properties: primality testing and palindrome checking. The challenge is that checking every number sequentially would be too slow for large inputs (up to 10⁸), so we need a smarter way to generate candidate palindromes efficiently.

## Visual Walkthrough

Let's trace through `n = 13`:

1. Start checking from 13: 13 is prime? Yes. Is 13 a palindrome? Yes (reads same forward/backward). So answer is 13.

Now `n = 102`:

1. Check 102: Not prime (divisible by 2)
2. Check 103: Prime? Yes. Palindrome? No (103 ≠ 301)
3. Check 104: Not prime
4. Check 105: Not prime
5. Check 106: Not prime
6. Check 107: Prime? Yes. Palindrome? No
7. Check 108: Not prime
8. Check 109: Prime? Yes. Palindrome? No
9. Check 110: Not prime
10. Check 111: Not prime (divisible by 3)
11. Check 112: Not prime
12. Check 113: Prime? Yes. Palindrome? No
13. Check 114: Not prime
14. Check 115: Not prime
15. Check 116: Not prime
16. Check 117: Not prime
17. Check 118: Not prime
18. Check 119: Not prime
19. Check 120: Not prime
20. Check 121: Prime? No (11×11). Palindrome? Yes but not prime.
21. Check 122: Not prime
22. Check 123: Not prime
23. Check 124: Not prime
24. Check 125: Not prime
25. Check 126: Not prime
26. Check 127: Prime? Yes. Palindrome? No
27. Check 128: Not prime
28. Check 129: Not prime
29. Check 130: Not prime
30. Check 131: Prime? Yes. Palindrome? Yes! So answer is 131.

This brute force approach works but is inefficient for large `n`. We need to generate palindromes directly instead of checking every number.

## Brute Force Approach

The naive solution checks every number starting from `n`, testing if it's both prime and a palindrome:

<div class="code-group">

```python
def is_prime(x):
    if x < 2:
        return False
    if x == 2:
        return True
    if x % 2 == 0:
        return False
    # Check odd divisors up to sqrt(x)
    for i in range(3, int(x**0.5) + 1, 2):
        if x % i == 0:
            return False
    return True

def is_palindrome(x):
    s = str(x)
    return s == s[::-1]

def primePalindrome_brute(n):
    x = n
    while True:
        if is_palindrome(x) and is_prime(x):
            return x
        x += 1

# Test: primePalindrome_brute(13) returns 13
# Test: primePalindrome_brute(102) returns 131
```

```javascript
function isPrime(x) {
  if (x < 2) return false;
  if (x === 2) return true;
  if (x % 2 === 0) return false;
  for (let i = 3; i * i <= x; i += 2) {
    if (x % i === 0) return false;
  }
  return true;
}

function isPalindrome(x) {
  const s = x.toString();
  return s === s.split("").reverse().join("");
}

function primePalindromeBrute(n) {
  let x = n;
  while (true) {
    if (isPalindrome(x) && isPrime(x)) {
      return x;
    }
    x++;
  }
}

// Test: primePalindromeBrute(13) returns 13
// Test: primePalindromeBrute(102) returns 131
```

```java
class Solution {
    private boolean isPrime(int x) {
        if (x < 2) return false;
        if (x == 2) return true;
        if (x % 2 == 0) return false;
        for (int i = 3; i * i <= x; i += 2) {
            if (x % i == 0) return false;
        }
        return true;
    }

    private boolean isPalindrome(int x) {
        String s = Integer.toString(x);
        return s.equals(new StringBuilder(s).reverse().toString());
    }

    public int primePalindromeBrute(int n) {
        int x = n;
        while (true) {
            if (isPalindrome(x) && isPrime(x)) {
                return x;
            }
            x++;
        }
    }
}
```

</div>

**Why this is too slow:**

- For `n` up to 10⁸, we might check millions of numbers
- Each primality test takes O(√n) time
- Most numbers aren't palindromes, so we waste time checking non-palindromes
- The worst-case gap between prime palindromes can be large (e.g., between 11 and 101)

## Optimized Approach

The key insight: **Generate palindromes directly, then test if they're prime.** This dramatically reduces the search space since palindromes are much rarer than all integers.

Important observations:

1. All even-length palindromes (except 11) are divisible by 11, so they can't be prime (except 11 itself)
2. Therefore, we only need to check odd-length palindromes (and 11 as a special case)
3. We can generate palindromes by taking the first half and mirroring it

For example, to generate 5-digit palindromes:

- Take numbers 100 to 999 (first 3 digits)
- Mirror them: 100 → 10001, 101 → 10101, etc.

Algorithm:

1. Handle small cases directly (n ≤ 11)
2. For n > 11, start generating odd-length palindromes
3. For each palindrome ≥ n, check if it's prime
4. If no palindrome found at current length, move to next odd length

## Optimal Solution

<div class="code-group">

```python
class Solution:
    def primePalindrome(self, n: int) -> int:
        # Time: O(N^(1/2) * log N) where N is the palindrome value
        # Space: O(log N) for string operations

        # Handle small cases directly
        if n <= 2:
            return 2
        if n <= 3:
            return 3
        if n <= 5:
            return 5
        if n <= 7:
            return 7
        if n <= 11:
            return 11

        # Function to check if a number is prime
        def is_prime(x):
            if x < 2 or x % 2 == 0:
                return x == 2
            # Check odd divisors up to sqrt(x)
            for i in range(3, int(x**0.5) + 1, 2):
                if x % i == 0:
                    return False
            return True

        # Get the number of digits in n
        length = len(str(n))

        # Start with odd-length palindromes
        # If current length is even, start from next odd length
        if length % 2 == 0:
            length += 1
            # Start from smallest palindrome of this length
            start = 10 ** (length // 2)
        else:
            # Start from appropriate half based on n
            half = int(str(n)[:length // 2 + 1])
            start = half

        # Generate palindromes
        while True:
            # Generate all palindromes of current length
            for half in range(start, 10 ** (length // 2 + 1)):
                # Build palindrome: take half and mirror it
                s = str(half)
                # For odd-length palindrome, don't repeat the middle digit
                palindrome = int(s + s[-2::-1])

                # Check if palindrome >= n and is prime
                if palindrome >= n and is_prime(palindrome):
                    return palindrome

            # Move to next odd length
            length += 2
            # Reset start to smallest half for new length
            start = 10 ** (length // 2)
```

```javascript
/**
 * @param {number} n
 * @return {number}
 */
var primePalindrome = function (n) {
  // Time: O(N^(1/2) * log N) where N is the palindrome value
  // Space: O(log N) for string operations

  // Handle small cases directly
  if (n <= 2) return 2;
  if (n <= 3) return 3;
  if (n <= 5) return 5;
  if (n <= 7) return 7;
  if (n <= 11) return 11;

  // Function to check if a number is prime
  function isPrime(x) {
    if (x < 2 || x % 2 === 0) return x === 2;
    // Check odd divisors up to sqrt(x)
    for (let i = 3; i * i <= x; i += 2) {
      if (x % i === 0) return false;
    }
    return true;
  }

  // Get the number of digits in n
  const nStr = n.toString();
  let length = nStr.length;

  // Start with odd-length palindromes
  // If current length is even, start from next odd length
  if (length % 2 === 0) {
    length += 1;
    // Start from smallest palindrome of this length
    start = 10 ** Math.floor(length / 2);
  } else {
    // Start from appropriate half based on n
    const half = parseInt(nStr.substring(0, Math.floor(length / 2) + 1));
    start = half;
  }

  // Generate palindromes
  while (true) {
    // Generate all palindromes of current length
    for (let half = start; half < 10 ** (Math.floor(length / 2) + 1); half++) {
      // Build palindrome: take half and mirror it
      const s = half.toString();
      // For odd-length palindrome, don't repeat the middle digit
      const palindrome = parseInt(
        s +
          s
            .substring(0, s.length - 1)
            .split("")
            .reverse()
            .join("")
      );

      // Check if palindrome >= n and is prime
      if (palindrome >= n && isPrime(palindrome)) {
        return palindrome;
      }
    }

    // Move to next odd length
    length += 2;
    // Reset start to smallest half for new length
    start = 10 ** Math.floor(length / 2);
  }
};
```

```java
class Solution {
    public int primePalindrome(int n) {
        // Time: O(N^(1/2) * log N) where N is the palindrome value
        // Space: O(log N) for string operations

        // Handle small cases directly
        if (n <= 2) return 2;
        if (n <= 3) return 3;
        if (n <= 5) return 5;
        if (n <= 7) return 7;
        if (n <= 11) return 11;

        // Get the number of digits in n
        String nStr = Integer.toString(n);
        int length = nStr.length();
        int start;

        // Start with odd-length palindromes
        // If current length is even, start from next odd length
        if (length % 2 == 0) {
            length += 1;
            // Start from smallest palindrome of this length
            start = (int)Math.pow(10, length / 2);
        } else {
            // Start from appropriate half based on n
            int half = Integer.parseInt(nStr.substring(0, length / 2 + 1));
            start = half;
        }

        // Generate palindromes
        while (true) {
            // Generate all palindromes of current length
            for (int half = start; half < Math.pow(10, length / 2 + 1); half++) {
                // Build palindrome: take half and mirror it
                String s = Integer.toString(half);
                StringBuilder sb = new StringBuilder(s);
                // Append reversed substring without the last character
                for (int i = s.length() - 2; i >= 0; i--) {
                    sb.append(s.charAt(i));
                }
                int palindrome = Integer.parseInt(sb.toString());

                // Check if palindrome >= n and is prime
                if (palindrome >= n && isPrime(palindrome)) {
                    return palindrome;
                }
            }

            // Move to next odd length
            length += 2;
            // Reset start to smallest half for new length
            start = (int)Math.pow(10, length / 2);
        }
    }

    private boolean isPrime(int x) {
        if (x < 2 || x % 2 == 0) return x == 2;
        // Check odd divisors up to sqrt(x)
        for (int i = 3; i * i <= x; i += 2) {
            if (x % i == 0) return false;
        }
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Palindrome generation: We generate O(√N) palindromes where N is the value of the answer
- Each primality test takes O(√N) time
- Total: O(N) in the worst case, but much better than brute force O(N√N)
- In practice, since palindromes are sparse, this is efficient enough for n ≤ 10⁸

**Space Complexity:**

- O(log N) for string operations to create palindrome strings
- O(1) additional space for variables

## Common Mistakes

1. **Not handling the even-length palindrome case**: All even-length palindromes (except 11) are divisible by 11. Candidates who check all palindromes waste time on numbers that can't be prime.

2. **Incorrect palindrome generation**: When generating odd-length palindromes, you must not repeat the middle digit. For example, from "123" you should generate "12321", not "123321".

3. **Off-by-one errors in half calculation**: When n has an odd number of digits, you need to take the appropriate first half. For n=12345 (5 digits), you need the first 3 digits (123), not 2.

4. **Forgetting edge cases**: The solution must handle n ≤ 11 correctly, as these are special cases where the "even-length palindromes aren't prime" rule doesn't apply to 11.

## When You'll See This Pattern

This problem combines mathematical insight with efficient search space reduction. Similar patterns appear in:

1. **Sum of k-Mirror Numbers (Hard)**: Also requires generating palindromes in multiple bases and checking special properties.

2. **Find the Closest Palindrome (Hard)**: Requires generating the nearest palindrome to a given number, using similar palindrome construction techniques.

3. **Count Primes (Medium)**: Uses primality testing, though with a different approach (Sieve of Eratosthenes).

The core pattern is: **When searching for numbers with multiple properties, generate candidates that satisfy one property efficiently, then test for the other properties.**

## Key Takeaways

1. **Mathematical properties can dramatically reduce search space**: Knowing that even-length palindromes (except 11) are divisible by 11 lets us skip checking them entirely.

2. **Generate rather than filter**: Instead of checking all numbers for palindrome property, generate palindromes directly and test for primality. This is often faster when one property is rarer than the other.

3. **Handle edge cases explicitly**: Small values often break general patterns and need special handling.

Related problems: [Sum of k-Mirror Numbers](/problem/sum-of-k-mirror-numbers)
