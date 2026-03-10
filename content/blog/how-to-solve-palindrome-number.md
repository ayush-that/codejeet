---
title: "How to Solve Palindrome Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Palindrome Number. Easy difficulty, 60.3% acceptance rate. Topics: Math."
date: "2026-02-03"
category: "dsa-patterns"
tags: ["palindrome-number", "math", "easy"]
---

# How to Solve Palindrome Number

Given an integer `x`, determine if it reads the same forwards and backwards. While this sounds straightforward, the challenge lies in doing it efficiently without converting the entire number to a string (which would use extra space) and while correctly handling edge cases like negative numbers and numbers ending with zero.

## Visual Walkthrough

Let's trace through the number `1221` step-by-step using the optimal mathematical approach:

**Step 1:** Initialize `reversed = 0` and work with `x = 1221`

- We'll build the reversed number digit by digit while reducing the original

**Step 2:** Extract last digit and build reversed

- Last digit of 1221 is `1` (1221 % 10 = 1)
- Add to reversed: `reversed = 0 * 10 + 1 = 1`
- Remove last digit from x: `x = 1221 // 10 = 122`

**Step 3:** Continue process

- Last digit of 122 is `2` (122 % 10 = 2)
- `reversed = 1 * 10 + 2 = 12`
- `x = 122 // 10 = 12`

**Step 4:** Check if we've reversed enough

- Now `x = 12` and `reversed = 12`
- Since `x == reversed`, we have a palindrome!

For odd-length numbers like `12321`, we'd stop when `reversed > x` and compare `x == reversed // 10`.

## Brute Force Approach

The most intuitive approach is to convert the integer to a string and compare it with its reverse:

```python
def isPalindrome(x):
    return str(x) == str(x)[::-1]
```

This works, but it uses O(n) extra space for the string (where n is the number of digits). While acceptable for this easy problem, interviewers often want to see the mathematical solution that doesn't require string conversion. The string approach also doesn't demonstrate algorithmic thinking about number manipulation.

## Optimal Solution

The optimal solution reverses only half of the number mathematically. We reverse digits until the reversed portion becomes greater than or equal to the remaining original number, then compare. This approach handles both even and odd digit counts efficiently.

<div class="code-group">

```python
# Time: O(log₁₀(n)) | Space: O(1)
def isPalindrome(x):
    # Negative numbers cannot be palindromes
    # Numbers ending with 0 (except 0 itself) cannot be palindromes
    if x < 0 or (x % 10 == 0 and x != 0):
        return False

    reversed_half = 0

    # Reverse only half of the number
    while x > reversed_half:
        # Extract the last digit from x
        last_digit = x % 10
        # Add it to the reversed half (shift left and add)
        reversed_half = reversed_half * 10 + last_digit
        # Remove the last digit from x
        x //= 10

    # For even digit counts: x == reversed_half
    # For odd digit counts: x == reversed_half // 10 (remove middle digit)
    return x == reversed_half or x == reversed_half // 10
```

```javascript
// Time: O(log₁₀(n)) | Space: O(1)
function isPalindrome(x) {
  // Negative numbers cannot be palindromes
  // Numbers ending with 0 (except 0 itself) cannot be palindromes
  if (x < 0 || (x % 10 === 0 && x !== 0)) {
    return false;
  }

  let reversedHalf = 0;

  // Reverse only half of the number
  while (x > reversedHalf) {
    // Extract the last digit from x
    const lastDigit = x % 10;
    // Add it to the reversed half (shift left and add)
    reversedHalf = reversedHalf * 10 + lastDigit;
    // Remove the last digit from x
    x = Math.floor(x / 10);
  }

  // For even digit counts: x === reversedHalf
  // For odd digit counts: x === Math.floor(reversedHalf / 10) (remove middle digit)
  return x === reversedHalf || x === Math.floor(reversedHalf / 10);
}
```

```java
// Time: O(log₁₀(n)) | Space: O(1)
class Solution {
    public boolean isPalindrome(int x) {
        // Negative numbers cannot be palindromes
        // Numbers ending with 0 (except 0 itself) cannot be palindromes
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }

        int reversedHalf = 0;

        // Reverse only half of the number
        while (x > reversedHalf) {
            // Extract the last digit from x
            int lastDigit = x % 10;
            // Add it to the reversed half (shift left and add)
            reversedHalf = reversedHalf * 10 + lastDigit;
            // Remove the last digit from x
            x /= 10;
        }

        // For even digit counts: x == reversedHalf
        // For odd digit counts: x == reversedHalf / 10 (remove middle digit)
        return x == reversedHalf || x == reversedHalf / 10;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(log₁₀(n)) or O(d) where d is the number of digits

- We process each digit exactly once (or half of them in practice)
- The loop runs approximately log₁₀(n) times since we divide the number by 10 each iteration

**Space Complexity:** O(1)

- We only use a constant amount of extra space (a few integer variables)
- No additional data structures that grow with input size

## Common Mistakes

1. **Not handling negative numbers**: Negative numbers like -121 are not palindromes because the '-' sign only appears at the front. Always check `if x < 0: return False` first.

2. **Forgetting numbers ending with zero**: Numbers like 10, 100, 1230 cannot be palindromes because no integer can start with 0 (except 0 itself). Check `if x % 10 == 0 and x != 0: return False`.

3. **Reversing the entire number and comparing**: While correct, this can cause integer overflow for very large numbers. The half-reversal approach avoids this issue entirely.

4. **Incorrect handling of odd-digit numbers**: For numbers like 12321, after reversal we get `x = 12` and `reversed_half = 123`. Remember to compare `x == reversed_half // 10` to remove the middle digit.

## When You'll See This Pattern

The "reverse digits mathematically" pattern appears in several number manipulation problems:

1. **Reverse Integer (LeetCode #7)**: Uses similar digit extraction and reversal logic.
2. **Palindrome Linked List (LeetCode #234)**: Uses the same "reverse half and compare" strategy, but applied to linked lists instead of numbers.
3. **Find Palindrome With Fixed Length (LeetCode #2217)**: Builds palindromes mathematically by constructing half and mirroring.

The core technique of processing digits from right to left using modulo and division operations is fundamental to many number-based algorithms.

## Key Takeaways

1. **Mathematical digit extraction**: Use `x % 10` to get the last digit and `x // 10` (or `x / 10` with floor) to remove it. This is more efficient than string conversion for number manipulation problems.

2. **Half-reversal optimization**: When checking palindromes, you only need to reverse half the digits. Stop when the reversed portion becomes greater than or equal to the remaining original.

3. **Edge case awareness**: Always consider negative numbers, numbers ending with zero, and single-digit cases. These edge cases often reveal the depth of your problem-solving approach.

Related problems: [Palindrome Linked List](/problem/palindrome-linked-list), [Find Palindrome With Fixed Length](/problem/find-palindrome-with-fixed-length), [Strictly Palindromic Number](/problem/strictly-palindromic-number)
