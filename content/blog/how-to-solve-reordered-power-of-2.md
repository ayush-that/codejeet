---
title: "How to Solve Reordered Power of 2 — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reordered Power of 2. Medium difficulty, 66.0% acceptance rate. Topics: Hash Table, Math, Sorting, Counting, Enumeration."
date: "2028-07-06"
category: "dsa-patterns"
tags: ["reordered-power-of-2", "hash-table", "math", "sorting", "medium"]
---

# How to Solve Reordered Power of 2

You're given an integer `n`, and you need to determine if you can rearrange its digits (without leading zeros) to form a power of two. The challenge is that checking every possible digit permutation would be extremely inefficient for larger numbers. This problem tests your ability to recognize when brute force is impractical and to find a clever way to compare digit patterns instead of actual numbers.

## Visual Walkthrough

Let's trace through an example: `n = 46`

**Step 1: Understand the goal**
We need to check if we can rearrange the digits of 46 (which are 4 and 6) to form a power of two. The powers of two are: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, etc.

**Step 2: Check possible rearrangements**
The digits of 46 can form:

- 46 (original)
- 64 (swap digits)

**Step 3: Check against powers of two**

- 46 is not a power of two
- 64 IS a power of two (2⁶ = 64)

So for `n = 46`, the answer is `true`.

**Key insight:** Instead of generating all permutations of `n` and checking each one, we can generate all powers of two up to the maximum possible value (based on digit count) and check if any power of two has the same digit multiset as `n`.

## Brute Force Approach

The most straightforward approach would be:

1. Generate all permutations of the digits of `n`
2. For each permutation that doesn't start with 0, convert it to a number
3. Check if that number is a power of two

However, this approach has a critical flaw: the number of permutations grows factorially with the number of digits. For a 10-digit number, that's 10! = 3,628,800 permutations to check! Even worse, for numbers with repeated digits, we'd generate duplicate permutations that we'd need to handle.

The time complexity would be O(d! \* d) where d is the number of digits, which is completely impractical for the problem constraints (n can be up to 10⁹, which has up to 10 digits).

## Optimized Approach

The key insight is that two numbers have the same digit multiset if and only if their digit frequency counts are identical. Instead of comparing actual numbers or their permutations, we can compare digit frequency patterns.

**Step-by-step reasoning:**

1. Count the frequency of each digit (0-9) in the input number `n`
2. Generate all powers of two that have the same number of digits as `n`
3. For each power of two, count its digit frequencies
4. If any power of two has exactly the same digit frequency count as `n`, return `true`
5. Otherwise, return `false`

**Why this works:**

- If a power of two has the same digit frequencies as `n`, then `n`'s digits can be rearranged to form that power of two
- We only need to check powers of two with the same number of digits as `n` (or one more digit if the first digit of the rearrangement could be different)
- The number of powers of two to check is small (at most 31 for 32-bit integers)

## Optimal Solution

<div class="code-group">

```python
# Time: O(log²n) | Space: O(1)
# We check at most 31 powers of two, and for each we count digits (O(log n) time)
def reorderedPowerOf2(n: int) -> bool:
    """
    Returns True if digits of n can be rearranged to form a power of two.

    Approach: Compare digit frequency counts of n with all powers of two
    that have the same number of digits.
    """

    # Step 1: Count digit frequencies in the input number n
    def count_digits(num: int) -> str:
        """
        Convert digit frequencies to a string key for easy comparison.
        Example: 116 -> "0:0,1:2,2:0,3:0,4:0,5:0,6:1,7:0,8:0,9:0"
        Using string representation makes comparison straightforward.
        """
        count = [0] * 10  # Array to store frequency of digits 0-9
        while num > 0:
            digit = num % 10  # Get last digit
            count[digit] += 1  # Increment count for this digit
            num //= 10  # Remove last digit
        return tuple(count)  # Convert to tuple for hashing/comparison

    # Get the digit frequency signature of the input number
    n_count = count_digits(n)

    # Step 2: Check all powers of two
    # We only need to check powers of two with the same number of digits as n
    # The maximum power of two we need to check is 10^9 (given constraint)
    power = 1
    # 2^30 is approximately 1.07e9, which is > 10^9
    for _ in range(31):  # Check 2^0 to 2^30
        # Compare digit frequencies of current power of two with n
        if count_digits(power) == n_count:
            return True
        power <<= 1  # Multiply by 2 using bit shift (faster than power *= 2)

    # Step 3: If no match found, return False
    return False
```

```javascript
// Time: O(log²n) | Space: O(1)
// We check at most 31 powers of two, and for each we count digits (O(log n) time)
function reorderedPowerOf2(n) {
  /**
   * Returns true if digits of n can be rearranged to form a power of two.
   *
   * Approach: Compare digit frequency counts of n with all powers of two
   * that have the same number of digits.
   */

  // Step 1: Helper function to count digit frequencies
  const countDigits = (num) => {
    /**
     * Convert digit frequencies to an array for easy comparison.
     * Example: 116 -> [0,0,2,0,0,0,1,0,0,0] (simplified: actually 10 elements)
     */
    const count = new Array(10).fill(0); // Array for digits 0-9
    while (num > 0) {
      const digit = num % 10; // Get last digit
      count[digit]++; // Increment count for this digit
      num = Math.floor(num / 10); // Remove last digit
    }
    return count.join(","); // Convert to string for easy comparison
  };

  // Get digit frequency signature of input number
  const nSignature = countDigits(n);

  // Step 2: Check all powers of two up to 2^30 (≈1.07e9 > 1e9 constraint)
  let power = 1;
  // Check 2^0 to 2^30 (31 total powers)
  for (let i = 0; i < 31; i++) {
    // Compare digit frequencies of current power of two with n
    if (countDigits(power) === nSignature) {
      return true;
    }
    power <<= 1; // Multiply by 2 using bit shift
  }

  // Step 3: If no match found, return false
  return false;
}
```

```java
// Time: O(log²n) | Space: O(1)
// We check at most 31 powers of two, and for each we count digits (O(log n) time)
class Solution {
    public boolean reorderedPowerOf2(int n) {
        /**
         * Returns true if digits of n can be rearranged to form a power of two.
         *
         * Approach: Compare digit frequency counts of n with all powers of two
         * that have the same number of digits.
         */

        // Step 1: Get digit frequency signature of input number
        String nSignature = getSignature(n);

        // Step 2: Check all powers of two up to 2^30 (≈1.07e9 > 1e9 constraint)
        long power = 1; // Use long to avoid overflow
        // Check 2^0 to 2^30 (31 total powers)
        for (int i = 0; i < 31; i++) {
            // Compare digit frequencies of current power of two with n
            if (getSignature(power).equals(nSignature)) {
                return true;
            }
            power <<= 1; // Multiply by 2 using bit shift
        }

        // Step 3: If no match found, return false
        return false;
    }

    // Helper method to get digit frequency signature
    private String getSignature(long num) {
        /**
         * Convert digit frequencies to a string for easy comparison.
         * Example: 116 -> "0,0,2,0,0,0,1,0,0,0" (10 comma-separated values)
         */
        int[] count = new int[10]; // Array for digits 0-9
        while (num > 0) {
            int digit = (int)(num % 10); // Get last digit
            count[digit]++; // Increment count for this digit
            num /= 10; // Remove last digit
        }

        // Build string signature for comparison
        StringBuilder signature = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            signature.append(count[i]);
            if (i < 9) signature.append(",");
        }
        return signature.toString();
    }

    // Overloaded version for int parameter
    private String getSignature(int num) {
        return getSignature((long)num);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(log²n)**

- We check at most 31 powers of two (from 2⁰ to 2³⁰)
- For each power of two, we count its digits, which takes O(log p) time where p is the power of two
- Since p ≤ 10⁹, log p ≤ 10, so total time is O(31 × 10) = O(310) = O(1) for practical purposes
- More formally: O(k × log M) where k = 31 and M = 10⁹

**Space Complexity: O(1)**

- We use a fixed-size array of length 10 to count digits
- No additional data structures that grow with input size
- The space used is constant regardless of input size

## Common Mistakes

1. **Generating all permutations**: The most tempting mistake is to generate all permutations of the digits. For a 10-digit number, this creates 10! = 3.6 million permutations to check, which is far too slow.

2. **Not handling the "no leading zero" constraint properly**: When checking if a rearrangement forms a power of two, you must ensure it doesn't start with 0. Our solution implicitly handles this because powers of two never start with 0, and we're comparing digit frequencies, not generating actual numbers.

3. **Checking wrong range of powers of two**: Some candidates check powers of two up to n instead of up to the maximum with the same number of digits. For example, if n=46, you need to check 64 (which has 2 digits), not just powers ≤ 46.

4. **Using integer overflow**: In Java, 2³¹ exceeds Integer.MAX_VALUE, so you need to use long or stop at 2³⁰. Our solution handles this by checking only up to 2³⁰, which is sufficient since n ≤ 10⁹.

## When You'll See This Pattern

This "digit frequency comparison" pattern appears in several other problems:

1. **Group Anagrams (LeetCode 49)**: Instead of comparing strings directly, compare their character frequency counts to group anagrams together.

2. **Valid Anagram (LeetCode 242)**: Check if two strings are anagrams by comparing character frequencies.

3. **Find All Anagrams in a String (LeetCode 438)**: Find all substrings that are anagrams of a pattern using a sliding window with frequency counts.

4. **Custom Sort String (LeetCode 791)**: Sort a string based on character frequencies and a custom order.

The common theme is that when direct comparison is expensive or complicated, comparing frequency distributions can be more efficient.

## Key Takeaways

1. **When permutations are involved, consider frequency-based approaches**: If a problem involves rearranging elements to match a pattern, comparing frequency counts is often more efficient than generating all permutations.

2. **Constraints guide the solution**: The fact that n ≤ 10⁹ means there are at most 31 relevant powers of two to check, making the frequency comparison approach feasible.

3. **Precomputation can simplify problems**: By precomputing the digit frequencies of all relevant powers of two (or computing them on the fly), we avoid the exponential complexity of permutation generation.

[Practice this problem on CodeJeet](/problem/reordered-power-of-2)
