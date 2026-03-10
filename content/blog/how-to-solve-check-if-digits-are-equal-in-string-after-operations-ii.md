---
title: "How to Solve Check If Digits Are Equal in String After Operations II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Check If Digits Are Equal in String After Operations II. Hard difficulty, 14.2% acceptance rate. Topics: Math, String, Combinatorics, Number Theory."
date: "2026-03-13"
category: "dsa-patterns"
tags:
  [
    "check-if-digits-are-equal-in-string-after-operations-ii",
    "math",
    "string",
    "combinatorics",
    "hard",
  ]
---

# How to Solve "Check If Digits Are Equal in String After Operations II"

This problem asks us to repeatedly transform a string of digits by replacing consecutive pairs with their sum modulo 10 until only two digits remain, then check if those two digits are equal. What makes this problem tricky is that the string can be up to 10⁵ digits long, so simulating all operations directly would be far too slow. The key insight is recognizing that this operation follows a mathematical pattern related to binomial coefficients modulo 10.

## Visual Walkthrough

Let's trace through a small example: `s = "12345"`

**Step 1:** Original string has 5 digits, need to reduce to exactly 2 digits.

**Operation 1:**

- (1,2) → (1+2) % 10 = 3
- (2,3) → (2+3) % 10 = 5
- (3,4) → (3+4) % 10 = 7
- (4,5) → (4+5) % 10 = 9
  New string: `"3579"` (4 digits)

**Operation 2:**

- (3,5) → (3+5) % 10 = 8
- (5,7) → (5+7) % 10 = 2
- (7,9) → (7+9) % 10 = 6
  New string: `"826"` (3 digits)

**Operation 3:**

- (8,2) → (8+2) % 10 = 0
- (2,6) → (2+6) % 10 = 8
  New string: `"08"` (2 digits) → Final result: digits 0 and 8 are not equal.

The challenge is that for a string of length n, we need n-2 operations, and each operation reduces the string length by 1. For n = 10⁵, this would be 99,998 operations, each processing a slightly shorter string. The total work would be O(n²), which is impossible within time limits.

## Brute Force Approach

The most straightforward approach is to simulate the process exactly as described:

1. While the string length > 2:
   - Create a new empty string
   - For each pair of consecutive digits:
     - Calculate (digit1 + digit2) % 10
     - Append the result to the new string
   - Replace the original string with the new string
2. Check if the two remaining digits are equal

<div class="code-group">

```python
# Time: O(n²) | Space: O(n)
def brute_force(s):
    # Convert to list of integers for easier manipulation
    digits = [int(ch) for ch in s]

    while len(digits) > 2:
        new_digits = []
        for i in range(len(digits) - 1):
            # Sum consecutive digits modulo 10
            new_digit = (digits[i] + digits[i + 1]) % 10
            new_digits.append(new_digit)
        digits = new_digits

    # Check if the two remaining digits are equal
    return digits[0] == digits[1]
```

```javascript
// Time: O(n²) | Space: O(n)
function bruteForce(s) {
  // Convert string to array of digits
  let digits = s.split("").map((ch) => parseInt(ch));

  while (digits.length > 2) {
    const newDigits = [];
    for (let i = 0; i < digits.length - 1; i++) {
      // Sum consecutive digits modulo 10
      const newDigit = (digits[i] + digits[i + 1]) % 10;
      newDigits.push(newDigit);
    }
    digits = newDigits;
  }

  // Check if the two remaining digits are equal
  return digits[0] === digits[1];
}
```

```java
// Time: O(n²) | Space: O(n)
public boolean bruteForce(String s) {
    // Convert string to list of digits
    List<Integer> digits = new ArrayList<>();
    for (char ch : s.toCharArray()) {
        digits.add(ch - '0');
    }

    while (digits.size() > 2) {
        List<Integer> newDigits = new ArrayList<>();
        for (int i = 0; i < digits.size() - 1; i++) {
            // Sum consecutive digits modulo 10
            int newDigit = (digits.get(i) + digits.get(i + 1)) % 10;
            newDigits.add(newDigit);
        }
        digits = newDigits;
    }

    // Check if the two remaining digits are equal
    return digits.get(0).equals(digits.get(1));
}
```

</div>

**Why this fails:** For a string of length n, we perform n-2 operations. The first operation processes n-1 pairs, the second processes n-2 pairs, and so on. This is the sum of integers from 1 to n-1, which is O(n²). With n up to 10⁵, this is approximately 5×10⁹ operations, far beyond what's feasible (typically 10⁷-10⁸ operations per second).

## Optimized Approach

The key insight is recognizing that this operation is equivalent to computing binomial coefficients modulo 10. Each digit in the final result is a linear combination of the original digits, where the coefficients follow Pascal's triangle pattern.

For example, with original digits a₀, a₁, a₂, a₃, a₄:

- After first reduction: a₀+a₁, a₁+a₂, a₂+a₃, a₃+a₄
- After second: (a₀+a₁)+(a₁+a₂)=a₀+2a₁+a₂, etc.

This is exactly the binomial coefficient pattern! The final two digits are:

- First digit: Σ C(n-2, i) × aᵢ mod 10 for i = 0 to n-2
- Second digit: Σ C(n-2, i) × aᵢ₊₁ mod 10 for i = 0 to n-2

Where C(k, i) are binomial coefficients "k choose i".

However, we need these modulo 10, and 10 is not prime, so we can't use modular inverses directly. Instead, we can use Lucas's theorem or compute binomial coefficients modulo 2 and modulo 5 separately, then combine using the Chinese Remainder Theorem.

**Step-by-step reasoning:**

1. The final two digits are linear combinations of original digits with binomial coefficients
2. We need to compute C(n-2, i) mod 10 for all i
3. Since 10 = 2 × 5, compute C(n-2, i) mod 2 and mod 5 separately
4. Use Chinese Remainder Theorem to combine mod 2 and mod 5 results to get mod 10
5. Compute the two final digits using these coefficients
6. Compare if they're equal

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def hasSameDigits(s):
    n = len(s)
    if n == 2:
        return s[0] == s[1]

    # We need binomial coefficients C(n-2, i) mod 10
    k = n - 2

    # Step 1: Precompute factorials mod 2 and mod 5
    # Since we only need up to k, and k <= n <= 10^5
    fact2 = [1] * (k + 1)
    fact5 = [1] * (k + 1)

    for i in range(1, k + 1):
        fact2[i] = (fact2[i-1] * i) % 2
        fact5[i] = (fact5[i-1] * i) % 5

    # Helper function to compute nCr mod p using Lucas theorem for small p
    def nCr_mod_p(n, r, p, fact):
        if r > n:
            return 0
        # Since p is small (2 or 5), we can compute directly
        # Using: nCr = n! / (r! * (n-r)!)
        # For p=2 or 5, we need modular inverse, but since p is prime
        # we can use Fermat's little theorem
        result = fact[n]

        # We need modular inverse of fact[r] and fact[n-r]
        # For prime p, a^(p-2) ≡ a^(-1) mod p
        def mod_inv(a, p):
            return pow(a, p-2, p)

        result = (result * mod_inv(fact[r], p)) % p
        result = (result * mod_inv(fact[n-r], p)) % p
        return result

    # Step 2: Compute binomial coefficients mod 2 and mod 5 for all i
    coeff_mod2 = [0] * (k + 1)
    coeff_mod5 = [0] * (k + 1)

    for i in range(k + 1):
        coeff_mod2[i] = nCr_mod_p(k, i, 2, fact2)
        coeff_mod5[i] = nCr_mod_p(k, i, 5, fact5)

    # Step 3: Combine mod 2 and mod 5 to get mod 10 using CRT
    # Chinese Remainder Theorem: x ≡ a (mod 2), x ≡ b (mod 5)
    # Solution: x ≡ a * 5 * inv(5,2) + b * 2 * inv(2,5) (mod 10)
    # inv(5,2) = 1 (since 5 ≡ 1 mod 2), inv(2,5) = 3 (since 2*3=6≡1 mod 5)
    coeff_mod10 = [0] * (k + 1)
    for i in range(k + 1):
        a = coeff_mod2[i]
        b = coeff_mod5[i]
        # CRT formula for mod 10
        coeff_mod10[i] = (a * 5 * 1 + b * 2 * 3) % 10

    # Step 4: Compute the two final digits
    digit1 = 0
    digit2 = 0

    # First digit uses coefficients for positions 0 to k
    for i in range(k + 1):
        digit1 = (digit1 + coeff_mod10[i] * (ord(s[i]) - ord('0'))) % 10

    # Second digit uses same coefficients but shifted by 1
    for i in range(k + 1):
        digit2 = (digit2 + coeff_mod10[i] * (ord(s[i + 1]) - ord('0'))) % 10

    return digit1 == digit2
```

```javascript
// Time: O(n) | Space: O(n)
function hasSameDigits(s) {
  const n = s.length;
  if (n === 2) {
    return s[0] === s[1];
  }

  // We need binomial coefficients C(n-2, i) mod 10
  const k = n - 2;

  // Step 1: Precompute factorials mod 2 and mod 5
  const fact2 = new Array(k + 1).fill(1);
  const fact5 = new Array(k + 1).fill(1);

  for (let i = 1; i <= k; i++) {
    fact2[i] = (fact2[i - 1] * i) % 2;
    fact5[i] = (fact5[i - 1] * i) % 5;
  }

  // Helper function to compute modular inverse for prime p
  function modInv(a, p) {
    // Fermat's little theorem: a^(p-1) ≡ 1 mod p
    // So a^(p-2) ≡ a^(-1) mod p
    return modPow(a, p - 2, p);
  }

  // Fast modular exponentiation
  function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      base = (base * base) % mod;
      exp = Math.floor(exp / 2);
    }
    return result;
  }

  // Compute nCr mod p for small prime p
  function nCrModP(n, r, p, fact) {
    if (r > n) return 0;
    let result = fact[n];
    result = (result * modInv(fact[r], p)) % p;
    result = (result * modInv(fact[n - r], p)) % p;
    return result;
  }

  // Step 2: Compute binomial coefficients mod 2 and mod 5
  const coeffMod2 = new Array(k + 1).fill(0);
  const coeffMod5 = new Array(k + 1).fill(0);

  for (let i = 0; i <= k; i++) {
    coeffMod2[i] = nCrModP(k, i, 2, fact2);
    coeffMod5[i] = nCrModP(k, i, 5, fact5);
  }

  // Step 3: Combine using Chinese Remainder Theorem to get mod 10
  const coeffMod10 = new Array(k + 1).fill(0);
  for (let i = 0; i <= k; i++) {
    const a = coeffMod2[i];
    const b = coeffMod5[i];
    // CRT: x ≡ a mod 2, x ≡ b mod 5
    // Solution: x = a*5*inv(5,2) + b*2*inv(2,5) mod 10
    // inv(5,2) = 1, inv(2,5) = 3
    coeffMod10[i] = (a * 5 * 1 + b * 2 * 3) % 10;
  }

  // Step 4: Compute the two final digits
  let digit1 = 0;
  let digit2 = 0;

  // First digit uses positions 0 to k
  for (let i = 0; i <= k; i++) {
    digit1 = (digit1 + coeffMod10[i] * (s.charCodeAt(i) - 48)) % 10;
  }

  // Second digit uses positions 1 to k+1
  for (let i = 0; i <= k; i++) {
    digit2 = (digit2 + coeffMod10[i] * (s.charCodeAt(i + 1) - 48)) % 10;
  }

  return digit1 === digit2;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean hasSameDigits(String s) {
    int n = s.length();
    if (n == 2) {
        return s.charAt(0) == s.charAt(1);
    }

    // We need binomial coefficients C(n-2, i) mod 10
    int k = n - 2;

    // Step 1: Precompute factorials mod 2 and mod 5
    int[] fact2 = new int[k + 1];
    int[] fact5 = new int[k + 1];
    fact2[0] = 1;
    fact5[0] = 1;

    for (int i = 1; i <= k; i++) {
        fact2[i] = (fact2[i-1] * i) % 2;
        fact5[i] = (fact5[i-1] * i) % 5;
    }

    // Helper function for modular exponentiation
    // To compute a^b mod m
    private int modPow(int a, int b, int m) {
        int result = 1;
        a = a % m;
        while (b > 0) {
            if ((b & 1) == 1) {
                result = (result * a) % m;
            }
            a = (a * a) % m;
            b >>= 1;
        }
        return result;
    }

    // Compute modular inverse for prime modulus
    private int modInv(int a, int p) {
        // Fermat's little theorem: a^(p-1) ≡ 1 mod p
        // So a^(p-2) ≡ a^(-1) mod p
        return modPow(a, p-2, p);
    }

    // Compute nCr mod p for small prime p
    private int nCrModP(int n, int r, int p, int[] fact) {
        if (r > n) return 0;
        int result = fact[n];
        result = (int)((long)result * modInv(fact[r], p) % p);
        result = (int)((long)result * modInv(fact[n-r], p) % p);
        return result;
    }

    // Step 2: Compute binomial coefficients mod 2 and mod 5
    int[] coeffMod2 = new int[k + 1];
    int[] coeffMod5 = new int[k + 1];

    for (int i = 0; i <= k; i++) {
        coeffMod2[i] = nCrModP(k, i, 2, fact2);
        coeffMod5[i] = nCrModP(k, i, 5, fact5);
    }

    // Step 3: Combine using Chinese Remainder Theorem to get mod 10
    int[] coeffMod10 = new int[k + 1];
    for (int i = 0; i <= k; i++) {
        int a = coeffMod2[i];
        int b = coeffMod5[i];
        // CRT: x ≡ a mod 2, x ≡ b mod 5
        // Solution: x = a*5*inv(5,2) + b*2*inv(2,5) mod 10
        // inv(5,2) = 1, inv(2,5) = 3
        coeffMod10[i] = (a * 5 * 1 + b * 2 * 3) % 10;
    }

    // Step 4: Compute the two final digits
    int digit1 = 0;
    int digit2 = 0;

    // First digit uses positions 0 to k
    for (int i = 0; i <= k; i++) {
        digit1 = (digit1 + coeffMod10[i] * (s.charAt(i) - '0')) % 10;
    }

    // Second digit uses positions 1 to k+1
    for (int i = 0; i <= k; i++) {
        digit2 = (digit2 + coeffMod10[i] * (s.charAt(i + 1) - '0')) % 10;
    }

    return digit1 == digit2;
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We precompute factorials up to n-2: O(n)
- We compute binomial coefficients for all i from 0 to n-2: O(n)
- We compute the final two digits: O(n)
- Total: O(n)

**Space Complexity:** O(n)

- We store factorials mod 2 and mod 5: O(n)
- We store binomial coefficients mod 2, mod 5, and mod 10: O(n)
- Total: O(n)

## Common Mistakes

1. **Attempting to simulate the process directly:** This is the most common mistake. Candidates see the problem description and immediately start coding the simulation without considering the time complexity. Always check constraints first (n ≤ 10⁵ should signal O(n²) won't work).

2. **Incorrect handling of modulo 10:** Since 10 is not prime, we can't use standard modular inverse techniques directly. Some candidates try to compute binomial coefficients mod 10 using factorial inverses, which fails because not all numbers have inverses modulo 10.

3. **Off-by-one errors in coefficient indices:** The final two digits use coefficients C(n-2, i) where i ranges from 0 to n-2. The first digit uses original digits at positions 0 to n-2, and the second digit uses positions 1 to n-1. Mixing these up leads to wrong results.

4. **Forgetting the base case:** When n = 2, we should immediately return whether the two digits are equal without any computation. Some candidates miss this edge case.

## When You'll See This Pattern

This problem combines several important patterns:

1. **Pascal's Triangle / Binomial Coefficients:** Problems involving repeated pairwise operations often relate to binomial coefficients. Similar problems:
   - [Pascal's Triangle](https://leetcode.com/problems/pascals-triangle/) - Direct computation of binomial coefficients
   - [Triangle](https://leetcode.com/problems/triangle/) - Path sum problems that use similar recurrence

2. **Modular Arithmetic with Composite Modulus:** When working modulo a composite number, the Chinese Remainder Theorem is often useful. Similar problems:
   - [Super Pow](https://leetcode.com/problems/super-pow/) - Modular exponentiation
   - [Number of Good Ways to Split a String](https://leetcode.com/problems/number-of-good-ways-to-split-a-string/) - Uses modular arithmetic for counting

3. **Dynamic Programming Optimization:** The brute force is essentially DP with O(n²) time, and we optimize by recognizing the mathematical structure. This pattern appears in many DP optimization problems.

## Key Takeaways

1. **Always check constraints first:** When n is large (10⁵), O(n²) solutions won't work. Look for mathematical patterns or optimizations.

2. **Repeated pairwise operations often relate to binomial coefficients:** If you're combining elements in a way that resembles "each new element is the sum of two previous ones," think of Pascal's triangle.

3. **For composite modulus, use Chinese Remainder Theorem:** When you need results modulo a composite number (like 10 = 2 × 5), compute modulo each prime factor separately and combine.

4. **Test with small examples:** The connection to binomial coefficients becomes clear when you work through small examples manually and look for patterns in the coefficients.

Related problems: [Pascal's Triangle](/problem/pascals-triangle)
