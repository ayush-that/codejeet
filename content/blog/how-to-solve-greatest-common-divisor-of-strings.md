---
title: "How to Solve Greatest Common Divisor of Strings — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Greatest Common Divisor of Strings. Easy difficulty, 53.4% acceptance rate. Topics: Math, String."
date: "2026-11-01"
category: "dsa-patterns"
tags: ["greatest-common-divisor-of-strings", "math", "string", "easy"]
---

# How to Solve Greatest Common Divisor of Strings

This problem asks us to find the largest string that can be concatenated multiple times to form both input strings. While it's categorized as "Easy," the challenge lies in recognizing the mathematical pattern: this is essentially finding the greatest common divisor (GCD) of two strings, where division means repeated concatenation. The tricky part is connecting string operations to number theory concepts.

## Visual Walkthrough

Let's trace through an example: `str1 = "ABCABC"` and `str2 = "ABC"`

**Step 1: Understanding what "divides" means**

- "ABC" divides "ABCABC" because "ABC" + "ABC" = "ABCABC"
- "ABC" divides "ABC" because "ABC" = "ABC" (concatenated once)

**Step 2: Looking for the largest common divisor**

- Could "AB" work? "AB" doesn't divide "ABC" because "ABC" isn't made of repeated "AB" strings
- Could "ABC" work? Yes, as shown above
- So the answer is "ABC"

**Another example: `str1 = "ABABAB"`, `str2 = "ABAB"`**

- "AB" divides both: "AB"×3 = "ABABAB", "AB"×2 = "ABAB"
- "ABAB" doesn't divide "ABABAB" because "ABAB"×1.5 doesn't make sense (needs integer repetitions)
- So the answer is "AB"

**Key insight**: If a string `x` divides both `str1` and `str2`, then:

1. `x` must divide the concatenation `str1 + str2`
2. But more importantly, `str1 + str2` must equal `str2 + str1` (commutative property)
3. The length of `x` must divide the lengths of both strings
4. The length of `x` is the GCD of the lengths of `str1` and `str2`

## Brute Force Approach

A naive approach would be to:

1. Try every possible substring of the shorter string, starting from the largest
2. Check if it divides both strings
3. Return the first one that works

This approach has several problems:

- It's inefficient: O(min(m,n)²) time complexity where m and n are string lengths
- It doesn't leverage the mathematical insight about GCD
- It requires checking many substrings that can't possibly work

The brute force fails because it doesn't recognize that if a string divides both inputs, its length must be a divisor of both string lengths. This means we only need to check substrings whose lengths are common divisors, not all substrings.

## Optimal Solution

The optimal solution uses mathematical reasoning:

1. First, check if `str1 + str2 == str2 + str1`. If not, no common divisor exists.
2. If they do concatenate equally, the GCD string's length is the GCD of the lengths of `str1` and `str2`.
3. Take the prefix of either string with that length.

Why does this work? If a string `x` divides both `str1` and `str2`, then:

- `str1 = x + x + ... + x` (k times)
- `str2 = x + x + ... + x` (l times)
- Therefore, `str1 + str2 = x×(k+l)` and `str2 + str1 = x×(l+k)`, which are equal
- The length of `x` must divide both `len(str1)` and `len(str2)`, and the largest possible is GCD(len(str1), len(str2))

<div class="code-group">

```python
# Time: O(m + n) where m = len(str1), n = len(str2)
# Space: O(m + n) for the concatenated strings
def gcdOfStrings(str1: str, str2: str) -> str:
    # Step 1: Check if concatenations are equal
    # If str1 + str2 != str2 + str1, no common divisor exists
    # This is because if x divides both, then both concatenations
    # would be the same repeated pattern of x
    if str1 + str2 != str2 + str1:
        return ""

    # Step 2: Calculate GCD of lengths using Euclidean algorithm
    # The length of the GCD string must divide both string lengths
    # The largest possible divisor is the GCD of the lengths
    def gcd(a: int, b: int) -> int:
        # Euclidean algorithm: gcd(a, b) = gcd(b, a mod b)
        while b:
            a, b = b, a % b
        return a

    # Step 3: Get the GCD length and return prefix of that length
    # Since we verified the strings are made of the same repeating pattern,
    # the first gcd_len characters of either string is our answer
    gcd_len = gcd(len(str1), len(str2))
    return str1[:gcd_len]
```

```javascript
// Time: O(m + n) where m = str1.length, n = str2.length
// Space: O(m + n) for the concatenated strings
function gcdOfStrings(str1, str2) {
  // Step 1: Check if concatenations are equal
  // This is the necessary condition for a common divisor to exist
  if (str1 + str2 !== str2 + str1) {
    return "";
  }

  // Step 2: Helper function to calculate GCD using Euclidean algorithm
  // The GCD of lengths gives us the length of the largest repeating pattern
  function gcd(a, b) {
    // Euclidean algorithm: keep replacing larger number with remainder
    // until we reach 0
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  // Step 3: Calculate GCD length and return prefix
  // The prefix of this length from either string is our answer
  const gcdLength = gcd(str1.length, str2.length);
  return str1.substring(0, gcdLength);
}
```

```java
// Time: O(m + n) where m = str1.length(), n = str2.length()
// Space: O(m + n) for the concatenated strings
class Solution {
    public String gcdOfStrings(String str1, String str2) {
        // Step 1: Check if concatenations are equal
        // This is the key insight: if x divides both strings,
        // then str1+str2 and str2+str1 must be equal
        if (!(str1 + str2).equals(str2 + str1)) {
            return "";
        }

        // Step 2: Calculate GCD of lengths
        // The length of the common divisor string is the GCD of lengths
        int gcdLength = gcd(str1.length(), str2.length());

        // Step 3: Return prefix of GCD length
        // Since we verified the pattern exists, the first gcdLength
        // characters form the repeating unit
        return str1.substring(0, gcdLength);
    }

    // Helper method to calculate GCD using Euclidean algorithm
    private int gcd(int a, int b) {
        // Euclidean algorithm: repeatedly replace (a, b) with (b, a mod b)
        // until b becomes 0
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m + n)**

- String concatenation `str1 + str2` takes O(m + n) time
- String comparison `str1 + str2 == str2 + str1` takes O(m + n) time
- GCD calculation using Euclidean algorithm takes O(log(min(m, n))) time, which is dominated by O(m + n)
- Total: O(m + n) + O(m + n) + O(log(min(m, n))) = O(m + n)

**Space Complexity: O(m + n)**

- We create two concatenated strings of length m + n each
- The rest of the operations use O(1) additional space
- Total: O(m + n) for the concatenated strings

## Common Mistakes

1. **Not checking `str1 + str2 == str2 + str1` first**
   - Some candidates jump straight to calculating GCD of lengths
   - Without this check, you might return a prefix when no common divisor exists
   - Example: `str1 = "LEET"`, `str2 = "CODE"` have GCD length 1, but no common divisor

2. **Using substring checking instead of concatenation check**
   - Some try to check if the shorter string divides the longer one
   - This misses cases where neither string divides the other, but a smaller substring divides both
   - Example: `"ABAB"` and `"AB"` - "AB" divides both but "AB" doesn't equal either string

3. **Incorrect GCD implementation**
   - Using a naive divisor-checking approach instead of Euclidean algorithm
   - This makes the solution O(min(m, n)) instead of O(log(min(m, n)))
   - While acceptable for this problem, it's less efficient and shows poor algorithmic knowledge

4. **Forgetting to handle empty string result**
   - When no common divisor exists, the function should return `""`
   - Some candidates return `None`/`null` or throw an exception instead

## When You'll See This Pattern

This problem teaches the pattern of **reducing a string/number problem to a mathematical GCD problem**. You'll see similar patterns in:

1. **Find Greatest Common Divisor of Array (LeetCode 1979)**
   - Direct application of GCD to numbers
   - Same Euclidean algorithm, just applied to integers instead of string lengths

2. **Repeated Substring Pattern (LeetCode 459)**
   - Checks if a string can be formed by repeating a substring
   - Uses similar concatenation trick: `s in (s + s)[1:-1]`

3. **Number of Substrings With Only 1s (LeetCode 1513)**
   - While not directly about GCD, it uses mathematical formulas for counting patterns
   - Teaches thinking about string problems mathematically

The key insight is recognizing when a problem about repetition or divisibility can be transformed into a number theory problem. Whenever you see "divides," "repeats," or "pattern" in a problem description, consider whether GCD or LCM might be relevant.

## Key Takeaways

1. **String divisibility reduces to number divisibility**
   - If string `x` divides string `s`, then `len(x)` must divide `len(s)`
   - The largest possible `x` has length = GCD(len(str1), len(str2))

2. **The concatenation check is crucial**
   - `str1 + str2 == str2 + str1` is necessary and sufficient for a common divisor to exist
   - This check handles all edge cases and validates the mathematical approach

3. **Euclidean algorithm is your friend**
   - Learn to recognize when GCD/LCM can simplify a problem
   - The Euclidean algorithm (gcd(a,b) = gcd(b, a mod b)) is efficient and elegant

Remember: When a problem involves repetition, patterns, or divisibility, think about mathematical properties. The connection between string operations and number theory is a powerful tool in algorithmic problem solving.

Related problems: [Find Greatest Common Divisor of Array](/problem/find-greatest-common-divisor-of-array), [Smallest Even Multiple](/problem/smallest-even-multiple), [Find the Maximum Factor Score of Array](/problem/find-the-maximum-factor-score-of-array)
