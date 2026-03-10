---
title: "How to Solve Super Pow — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Super Pow. Medium difficulty, 36.4% acceptance rate. Topics: Math, Divide and Conquer."
date: "2027-06-23"
category: "dsa-patterns"
tags: ["super-pow", "math", "divide-and-conquer", "medium"]
---

# How to Solve Super Pow: Efficient Modular Exponentiation with Large Exponents

This problem asks us to compute `a^b mod 1337` where `a` is a positive integer and `b` is an extremely large positive integer represented as an array of digits. The challenge comes from the fact that `b` can be astronomically large (up to 2000 digits long), making direct computation impossible due to both time and space constraints. The key insight is that we need to leverage modular arithmetic properties to break down the exponent into manageable pieces.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose `a = 2` and `b = [3, 4, 5]` (which represents the number 345).

We need to compute `2^345 mod 1337`. Instead of computing the massive number `2^345` directly, we can use modular arithmetic properties:

1. **Property 1**: `(x * y) mod m = ((x mod m) * (y mod m)) mod m`
2. **Property 2**: `x^(a+b) mod m = (x^a mod m * x^b mod m) mod m`
3. **Property 3**: `x^(ab) mod m = (x^a mod m)^b mod m`

For our example `2^345`, we can break it down using the digits:

- `345 = 3*100 + 4*10 + 5`
- So `2^345 = 2^(3*100 + 4*10 + 5) = 2^(3*100) * 2^(4*10) * 2^5`

But there's an even better approach using the array representation directly. We can process the digits from left to right:

Let's define `result = 1` initially.

For the first digit `3`:

- `result = result^10 * a^3 mod 1337 = 1^10 * 2^3 mod 1337 = 8`

For the second digit `4`:

- `result = result^10 * a^4 mod 1337 = 8^10 * 2^4 mod 1337`
- First compute `8^10 mod 1337 = 1073741824 mod 1337 = 1024` (we'll use modular exponentiation)
- Then `1024 * 16 mod 1337 = 16384 mod 1337 = 276`

For the third digit `5`:

- `result = result^10 * a^5 mod 1337 = 276^10 * 2^5 mod 1337`
- Compute `276^10 mod 1337 = 32` (using modular exponentiation)
- Then `32 * 32 mod 1337 = 1024 mod 1337 = 1024`

So `2^345 mod 1337 = 1024`.

## Brute Force Approach

The most naive approach would be to:

1. Convert the array `b` to an actual integer
2. Compute `a^b` directly
3. Take the result modulo 1337

This fails spectacularly for several reasons:

1. Converting a 2000-digit array to an integer is impossible in most languages (the number would have ~2000 decimal digits, far beyond typical integer limits)
2. Even if we could store it, computing `a^b` would take exponential time
3. The intermediate result would be astronomically large (impossible to store)

Here's what the naive code might look like (that would fail):

<div class="code-group">

```python
# THIS CODE WILL FAIL FOR LARGE INPUTS - DO NOT USE
def superPow(a, b):
    # Convert array to integer (fails for large b)
    exponent = 0
    for digit in b:
        exponent = exponent * 10 + digit

    # Compute a^exponent (fails due to overflow)
    result = a ** exponent

    # Return modulo 1337
    return result % 1337
```

```javascript
// THIS CODE WILL FAIL FOR LARGE INPUTS - DO NOT USE
function superPow(a, b) {
  // Convert array to integer (fails for large b)
  let exponent = 0;
  for (let digit of b) {
    exponent = exponent * 10 + digit;
  }

  // Compute a^exponent (fails due to overflow)
  let result = Math.pow(a, exponent);

  // Return modulo 1337
  return result % 1337;
}
```

```java
// THIS CODE WILL FAIL FOR LARGE INPUTS - DO NOT USE
public int superPow(int a, int[] b) {
    // Convert array to integer (fails for large b)
    BigInteger exponent = BigInteger.ZERO;
    for (int digit : b) {
        exponent = exponent.multiply(BigInteger.TEN)
                          .add(BigInteger.valueOf(digit));
    }

    // Compute a^exponent (still fails due to time and space)
    BigInteger base = BigInteger.valueOf(a);
    BigInteger result = base.pow(exponent.intValue()); // This will throw exception

    // Return modulo 1337
    return result.mod(BigInteger.valueOf(1337)).intValue();
}
```

</div>

## Optimized Approach

The key insight comes from two mathematical properties:

1. **Modular exponentiation**: We can compute `a^b mod m` efficiently using binary exponentiation (also known as exponentiation by squaring), which runs in O(log b) time.

2. **Breaking down the exponent by digits**: Since `b` is represented as digits in base 10, we can use the property:
   - `a^(10x + y) = (a^x)^10 * a^y`
   - This allows us to process the exponent digit by digit

The algorithm works as follows:

1. Initialize `result = 1`
2. For each digit `d` in the array `b`:
   - Update `result = (result^10 mod 1337) * (a^d mod 1337) mod 1337`
3. Return `result`

Why does this work? Let's say `b = [d1, d2, d3, ..., dn]` representing the number `d1d2d3...dn`.

- After processing the first digit: `result = a^d1`
- After processing the second digit: `result = (a^d1)^10 * a^d2 = a^(10*d1 + d2)`
- After processing the third digit: `result = (a^(10*d1 + d2))^10 * a^d3 = a^(100*d1 + 10*d2 + d3)`
- And so on...

We need a helper function `modPow(x, y, m)` to compute `x^y mod m` efficiently using binary exponentiation.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * log(1337)) where n is the length of b
# Space: O(1) excluding the input array
class Solution:
    def superPow(self, a: int, b: List[int]) -> int:
        MOD = 1337

        # Helper function: compute x^y mod MOD using binary exponentiation
        # This runs in O(log y) time
        def mod_pow(x: int, y: int) -> int:
            result = 1
            x %= MOD  # Reduce x modulo MOD first

            while y > 0:
                # If y is odd, multiply result by x
                if y & 1:
                    result = (result * x) % MOD

                # Square x and halve y
                x = (x * x) % MOD
                y >>= 1  # Equivalent to y //= 2

            return result

        # Initialize result to 1 (a^0 = 1)
        result = 1

        # Process each digit in the exponent array
        for digit in b:
            # Update result using the formula:
            # result = (result^10) * (a^digit) mod 1337
            result = (mod_pow(result, 10) * mod_pow(a, digit)) % MOD

        return result
```

```javascript
// Time: O(n * log(1337)) where n is the length of b
// Space: O(1) excluding the input array
/**
 * @param {number} a
 * @param {number[]} b
 * @return {number}
 */
var superPow = function (a, b) {
  const MOD = 1337;

  // Helper function: compute x^y mod MOD using binary exponentiation
  // This runs in O(log y) time
  const modPow = (x, y) => {
    let result = 1;
    x %= MOD; // Reduce x modulo MOD first

    while (y > 0) {
      // If y is odd, multiply result by x
      if (y & 1) {
        result = (result * x) % MOD;
      }

      // Square x and halve y
      x = (x * x) % MOD;
      y >>= 1; // Equivalent to Math.floor(y / 2)
    }

    return result;
  };

  // Initialize result to 1 (a^0 = 1)
  let result = 1;

  // Process each digit in the exponent array
  for (let digit of b) {
    // Update result using the formula:
    // result = (result^10) * (a^digit) mod 1337
    result = (modPow(result, 10) * modPow(a, digit)) % MOD;
  }

  return result;
};
```

```java
// Time: O(n * log(1337)) where n is the length of b
// Space: O(1) excluding the input array
class Solution {
    private static final int MOD = 1337;

    // Helper function: compute x^y mod MOD using binary exponentiation
    // This runs in O(log y) time
    private int modPow(int x, int y) {
        int result = 1;
        x %= MOD;  // Reduce x modulo MOD first

        while (y > 0) {
            // If y is odd, multiply result by x
            if ((y & 1) == 1) {
                result = (result * x) % MOD;
            }

            // Square x and halve y
            x = (x * x) % MOD;
            y >>= 1;  // Equivalent to y / 2
        }

        return result;
    }

    public int superPow(int a, int[] b) {
        // Initialize result to 1 (a^0 = 1)
        int result = 1;

        // Process each digit in the exponent array
        for (int digit : b) {
            // Update result using the formula:
            // result = (result^10) * (a^digit) mod 1337
            result = (modPow(result, 10) * modPow(a, digit)) % MOD;
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n \* log(1337))

- We process each of the `n` digits in array `b`
- For each digit, we call `modPow` twice: once with exponent 10 and once with the digit value (0-9)
- Each `modPow` call takes O(log exponent) time
- Since the maximum exponent is 10 (for `result^10`) and 9 (for `a^digit`), and log(10) ≈ 3.3, log(9) ≈ 3.2, we can consider this O(n) in practice
- More precisely: O(n \* (log 10 + log 9)) = O(n)

**Space Complexity**: O(1)

- We only use a constant amount of extra space for variables `result`, loop counters, and the recursion stack for `modPow` (which is iterative, not recursive)
- The input array `b` is not counted toward space complexity as it's given

## Common Mistakes

1. **Not reducing `a` modulo 1337 initially**: If `a` is very large, computing `a^digit` could overflow even before taking modulo. Always reduce the base modulo 1337 first.

2. **Using recursion for modular exponentiation**: While recursion can work for `modPow`, it uses O(log y) stack space. The iterative approach shown above is more efficient and avoids stack overflow risks.

3. **Forgetting to take modulo at each multiplication**: In modular arithmetic, you should take modulo after each multiplication to prevent overflow. Don't wait until the end.

4. **Incorrectly handling the exponent 0**: When `digit = 0`, we need `a^0 = 1`. Our `modPow` function handles this correctly since when `y = 0`, the while loop doesn't execute and returns `result = 1`.

5. **Trying to convert the entire array to an integer**: As explained in the brute force section, this fails for large arrays because the resulting integer would be too large to store.

## When You'll See This Pattern

This problem combines two important patterns:

1. **Modular exponentiation with binary exponentiation**: Used whenever you need to compute large powers modulo some number efficiently.
   - Related problem: [Pow(x, n)](https://leetcode.com/problems/powx-n/) - Compute x^n efficiently
   - Related problem: [Count Good Numbers](https://leetcode.com/problems/count-good-numbers/) - Uses modular exponentiation with even/odd positions

2. **Processing numbers digit by digit**: When dealing with extremely large numbers represented as arrays or strings.
   - Related problem: [Plus One](https://leetcode.com/problems/plus-one/) - Add 1 to a number represented as an array
   - Related problem: [Add to Array-Form of Integer](https://leetcode.com/problems/add-to-array-form-of-integer/) - Add an integer to an array-form number

3. **Breaking down exponents using mathematical properties**: Useful in cryptography and number theory problems.
   - Related problem: [Integer Break](https://leetcode.com/problems/integer-break/) - Break an integer into parts to maximize product

## Key Takeaways

1. **Modular arithmetic properties are powerful**: Remember that `(a * b) mod m = ((a mod m) * (b mod m)) mod m` and `a^(x+y) mod m = (a^x mod m * a^y mod m) mod m`. These allow us to work with manageable numbers.

2. **Binary exponentiation is essential for large powers**: Instead of multiplying `a` by itself `b` times (O(b)), use exponentiation by squaring (O(log b)).

3. **Process large numbers digit by digit**: When a number is too large to store as an integer, process it digit by digit using mathematical properties of the base (10 in this case).

4. **Always reduce modulo at each step**: To prevent overflow and improve efficiency, apply the modulo operation after each multiplication, not just at the end.

Related problems: [Pow(x, n)](/problem/powx-n)
