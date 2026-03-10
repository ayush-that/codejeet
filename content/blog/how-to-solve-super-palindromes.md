---
title: "How to Solve Super Palindromes — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Super Palindromes. Hard difficulty, 39.8% acceptance rate. Topics: Math, String, Enumeration."
date: "2029-06-07"
category: "dsa-patterns"
tags: ["super-palindromes", "math", "string", "enumeration", "hard"]
---

# How to Solve Super Palindromes

A super-palindrome is a number that is both a palindrome itself and the square of another palindrome. Given a range `[left, right]` as strings, we need to count how many super-palindromes exist in that inclusive range. The challenge here is that `left` and `right` can be as large as 10¹⁸, making brute force checking of every number impossible — we need a smarter enumeration strategy.

## Visual Walkthrough

Let's trace through a small example with `left = "4"` and `right = "1000"`. We're looking for numbers `x` such that:

1. `x` is a palindrome
2. `x = y²` where `y` is also a palindrome

Let's manually check some candidates:

- `y = 1` → `x = 1² = 1` → `1` is palindrome, `1` is palindrome → **Super-palindrome**
- `y = 2` → `x = 4` → `4` is palindrome, `2` is palindrome → **Super-palindrome**
- `y = 3` → `x = 9` → `9` is palindrome, `3` is palindrome → **Super-palindrome**
- `y = 11` → `x = 121` → `121` is palindrome, `11` is palindrome → **Super-palindrome**
- `y = 22` → `x = 484` → `484` is palindrome, `22` is palindrome → **Super-palindrome**
- `y = 26` → `x = 676` → `676` is palindrome, `26` is NOT palindrome → Not super-palindrome

So between 4 and 1000, we have super-palindromes: 4, 9, 121, 484. That's 4 super-palindromes.

The key insight: Instead of checking every number in the range (which could be up to 10¹⁸ numbers), we only need to generate palindrome numbers `y`, square them to get `x`, and check if `x` is also a palindrome and within range. Since `x ≤ 10¹⁸`, we only need `y ≤ 10⁹`. But we can do even better — palindrome `y` with up to 9 digits have far fewer possibilities than all numbers up to 10⁹.

## Brute Force Approach

The most straightforward approach would be:

1. Convert `left` and `right` to integers
2. For each number `x` in the range `[left, right]`:
   - Check if `x` is a palindrome
   - If yes, compute `y = sqrt(x)`
   - Check if `y` is an integer and a palindrome
   - If both conditions hold, count it

This approach has two major problems:

1. The range can be up to 10¹⁸ numbers — iterating through all of them is impossible
2. Even if we could iterate, computing square roots and palindrome checks for each number is too slow

The time complexity would be O(R - L) where R and L can differ by up to 10¹⁸, which is completely infeasible.

## Optimized Approach

The key optimization comes from reversing our thinking. Instead of checking every possible `x` in the range, we generate all possible palindrome `y` values, square them to get `x`, and check if `x` is also a palindrome and within range.

Why does this work?

- Since `x = y²` and `x ≤ 10¹⁸`, we need `y ≤ 10⁹`
- But `y` must be a palindrome, so we only need to generate palindromes up to 10⁹
- We can generate palindromes by taking half of the digits and mirroring them
- For example, to generate 5-digit palindromes, we take all 3-digit numbers and mirror the first 2 digits in reverse

Even better: We can generate palindrome `y` by constructing all possible halves. For a palindrome with `d` digits:

- If `d` is even: half = first `d/2` digits, palindrome = half + reverse(half)
- If `d` is odd: half = first `(d+1)/2` digits, palindrome = half + reverse(half[0:-1])

For `y ≤ 10⁹` (up to 9 digits), we need to generate palindromes with 1 to 9 digits. The number of such palindromes is roughly 10^(ceil(d/2)) for each digit length `d`, which totals to about 10^5 possibilities — much more manageable than 10⁹!

## Optimal Solution

We'll implement the following algorithm:

1. Convert `left` and `right` to integers (or compare as strings to avoid overflow)
2. Generate all palindrome numbers `y` up to 10⁵ (since y² ≤ 10¹⁸, and 10⁵² = 10¹⁰ > 10⁹, but we'll be careful)
3. For each palindrome `y`:
   - Compute `x = y²`
   - Check if `x` is a palindrome
   - Check if `left ≤ x ≤ right`
   - If yes, increment count
4. Return the count

Actually, we need to be more precise: Since `x ≤ 10¹⁸`, we need `y ≤ 10⁹`. But 10⁹ is still large. However, if `y` is a palindrome with up to 9 digits, the number of such palindromes is about 10^5, which is manageable.

Wait — let's recalculate: For 9-digit palindromes, we need to generate all 5-digit halves (10⁵ possibilities). So total palindromes up to 9 digits is roughly 10¹ + 10² + 10³ + 10⁴ + 10⁵ ≈ 111,110. That's fine.

But actually, we can optimize further: Since `x` must also be a palindrome, and `x = y²`, we can think about the maximum `y` we need. The maximum `x` is 10¹⁸, so maximum `y` is 10⁹. But we only need to generate palindrome `y` values. The number of palindrome `y` values with ≤ 9 digits is about 10^5 as calculated.

However, there's an even better bound: Since `x` is a palindrome and `x = y²`, and both are palindromes, we can think about generating palindrome `x` values directly. But that's harder because we'd need to check if their square roots are integers and palindromes.

The cleanest approach: Generate all palindrome `y` up to 10⁵ (since (10⁵)² = 10¹⁰, but we actually need up to 10⁹ for `y`, so 10⁵ is not enough... Let me think carefully).

Actually, if `y` has up to 9 digits, the maximum `y` is 999,999,999 ≈ 10⁹. But we're generating palindromes by constructing halves. For a 9-digit palindrome, we need a 5-digit half. So we need to generate all numbers from 1 to 99,999 for the half. That's 100,000 possibilities. For each digit length from 1 to 9, we have:

- 1-digit: 9 numbers (1-9)
- 2-digit: 9 numbers (11, 22, ..., 99)
- 3-digit: 9×10 = 90 numbers
- 4-digit: 9×10 = 90 numbers
- 5-digit: 9×10×10 = 900 numbers
- 6-digit: 9×10×10 = 900 numbers
- 7-digit: 9×10×10×10 = 9,000 numbers
- 8-digit: 9×10×10×10 = 9,000 numbers
- 9-digit: 9×10×10×10×10 = 90,000 numbers

Total ≈ 110,000 numbers. That's manageable.

But wait, we said `y ≤ 10⁹`, and 9-digit palindrome with half = 100,000 would be 100,000,001? Actually, for 9-digit palindrome, the half has 5 digits. The largest 5-digit number is 99,999, which gives palindrome 99,999,999 (not 100,000,001). So we need halves from 1 to 99,999.

Actually, let's implement it correctly: We'll generate all palindrome `y` by constructing all possible halves.

<div class="code-group">

```python
# Time: O(10^(n/2)) where n is max digits in sqrt(right), ≈ O(10^5) for right ≤ 10^18
# Space: O(1) excluding output
class Solution:
    def superpalindromesInRange(self, left: str, right: str) -> int:
        L = int(left)
        R = int(right)

        # Helper function to check if a number is palindrome
        def is_palindrome(x: int) -> bool:
            s = str(x)
            return s == s[::-1]

        count = 0
        # We need to generate palindromes y such that y^2 is within [L, R]
        # and y^2 is also a palindrome

        # Generate odd-length palindromes
        # For example, for half = 123, palindrome = 12321
        for half in range(1, 100000):  # Up to 5-digit halves for 9-digit palindromes
            s = str(half)
            # Create odd-length palindrome: half + reverse(half without last digit)
            odd_pal = int(s + s[-2::-1])  # s[-2::-1] reverses s except last character
            square = odd_pal * odd_pal
            if square > R:
                # If square is already too large, we can break for this half length
                # But we need to check all halves, so we'll just continue
                # Actually, if square > R and we're increasing, we could break
                # but let's keep simple
                pass
            if square >= L and square <= R and is_palindrome(square):
                count += 1

        # Generate even-length palindromes
        # For example, for half = 123, palindrome = 123321
        for half in range(1, 100000):
            s = str(half)
            # Create even-length palindrome: half + reverse(half)
            even_pal = int(s + s[::-1])
            square = even_pal * even_pal
            if square >= L and square <= R and is_palindrome(square):
                count += 1

        # Special case: 0 if needed, but 0^2 = 0, and 0 is palindrome,
        # but problem says positive integers, so we skip 0

        return count
```

```javascript
// Time: O(10^(n/2)) where n is max digits in sqrt(right), ≈ O(10^5) for right ≤ 10^18
// Space: O(1)
/**
 * @param {string} left
 * @param {string} right
 * @return {number}
 */
var superpalindromesInRange = function (left, right) {
  const L = BigInt(left);
  const R = BigInt(right);

  // Helper function to check if a number is palindrome
  const isPalindrome = (x) => {
    const s = x.toString();
    let i = 0,
      j = s.length - 1;
    while (i < j) {
      if (s[i] !== s[j]) return false;
      i++;
      j--;
    }
    return true;
  };

  let count = 0;

  // Generate odd-length palindromes
  for (let half = 1; half < 100000; half++) {
    const s = half.toString();
    // Create odd-length palindrome: half + reverse(half without last digit)
    const oddPalStr = s + s.slice(0, -1).split("").reverse().join("");
    const oddPal = BigInt(oddPalStr);
    const square = oddPal * oddPal;

    if (square > R) {
      // If square exceeds R, further halves will only give larger squares
      // But we need to check all, so continue
    }

    if (square >= L && square <= R && isPalindrome(square)) {
      count++;
    }
  }

  // Generate even-length palindromes
  for (let half = 1; half < 100000; half++) {
    const s = half.toString();
    // Create even-length palindrome: half + reverse(half)
    const evenPalStr = s + s.split("").reverse().join("");
    const evenPal = BigInt(evenPalStr);
    const square = evenPal * evenPal;

    if (square >= L && square <= R && isPalindrome(square)) {
      count++;
    }
  }

  return count;
};
```

```java
// Time: O(10^(n/2)) where n is max digits in sqrt(right), ≈ O(10^5) for right ≤ 10^18
// Space: O(1)
class Solution {
    public int superpalindromesInRange(String left, String right) {
        long L = Long.parseLong(left);
        long R = Long.parseLong(right);

        int count = 0;

        // Generate odd-length palindromes
        for (int half = 1; half < 100000; half++) {
            String s = Integer.toString(half);
            // Create odd-length palindrome: half + reverse(half without last digit)
            StringBuilder oddBuilder = new StringBuilder(s);
            oddBuilder.append(new StringBuilder(s.substring(0, s.length() - 1)).reverse());
            String oddStr = oddBuilder.toString();

            // Check for overflow
            if (oddStr.length() > 10) continue; // Too large for long

            long oddPal = Long.parseLong(oddStr);
            // Check for overflow in multiplication
            if (oddPal > 1000000000) continue; // sqrt(10^18) is 10^9

            long square = oddPal * oddPal;
            if (square > R) {
                // Could break if we're sure squares are increasing, but continue for simplicity
            }
            if (square >= L && square <= R && isPalindrome(square)) {
                count++;
            }
        }

        // Generate even-length palindromes
        for (int half = 1; half < 100000; half++) {
            String s = Integer.toString(half);
            // Create even-length palindrome: half + reverse(half)
            StringBuilder evenBuilder = new StringBuilder(s);
            evenBuilder.append(new StringBuilder(s).reverse());
            String evenStr = evenBuilder.toString();

            // Check for overflow
            if (evenStr.length() > 10) continue;

            long evenPal = Long.parseLong(evenStr);
            if (evenPal > 1000000000) continue;

            long square = evenPal * evenPal;
            if (square >= L && square <= R && isPalindrome(square)) {
                count++;
            }
        }

        return count;
    }

    private boolean isPalindrome(long x) {
        String s = Long.toString(x);
        int i = 0, j = s.length() - 1;
        while (i < j) {
            if (s.charAt(i) != s.charAt(j)) return false;
            i++;
            j--;
        }
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(10^(n/2)) where n is the maximum number of digits in sqrt(right). Since right ≤ 10¹⁸, sqrt(right) ≤ 10⁹, which has up to 9 digits. We generate palindromes by constructing halves of length up to ceil(9/2) = 5 digits. So we generate about 10⁵ palindromes. For each palindrome, we do O(1) operations (squaring, palindrome check). So total time is O(10⁵).

**Space Complexity:** O(1) excluding the space needed for input and output. We only use a constant amount of extra space for variables.

## Common Mistakes

1. **Integer overflow:** When squaring large numbers (up to 10⁹), the square can be up to 10¹⁸, which fits in 64-bit integers (2⁶³ ≈ 9.2×10¹⁸), but some languages might overflow. Use 64-bit integers (long in Java/C++, BigInt in JavaScript).

2. **Incorrect palindrome generation:** For odd-length palindromes, remember to reverse `half[0:-1]` not the entire half. For example, half=123 should give 12321, not 123321.

3. **Missing the upper bound:** Candidates might stop generating halves at 10⁴ instead of 10⁵, missing 9-digit palindromes. Since sqrt(10¹⁸) = 10⁹, and 10⁹ has 10 digits, but actually the maximum palindrome y we need is the largest palindrome ≤ 10⁹, which has 9 digits.

4. **Not handling large string inputs:** The inputs `left` and `right` are given as strings because they can be larger than 32-bit integers. Always convert to 64-bit integers or handle as strings.

## When You'll See This Pattern

This "generate and test" pattern with smart enumeration appears in:

1. **Palindrome Number (Problem #9):** Checking if a number is palindrome by reversing half of it.
2. **Prime Palindrome (Problem #866):** Finding the smallest prime palindrome ≥ N, using similar palindrome generation techniques.
3. **Find the Closest Palindrome (Problem #564):** Finding the closest palindrome to a given number, often using mirroring techniques.

The core idea is to reduce the search space by exploiting mathematical properties (here, that super-palindromes are squares of palindromes) rather than brute forcing through all possibilities.

## Key Takeaways

1. **Reverse the search direction:** Instead of checking all numbers in a range for a property, generate candidates that must have the property and verify they're in range.
2. **Exploit constraints mathematically:** The condition x = y² where both are palindromes lets us generate y values (palindromes) instead of x values.
3. **Palindrome generation trick:** Generate all palindromes of length ≤ n by taking all numbers up to 10^(ceil(n/2)) and mirroring them appropriately.

[Practice this problem on CodeJeet](/problem/super-palindromes)
