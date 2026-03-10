---
title: "How to Solve Monotone Increasing Digits — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Monotone Increasing Digits. Medium difficulty, 49.4% acceptance rate. Topics: Math, Greedy."
date: "2028-02-11"
category: "dsa-patterns"
tags: ["monotone-increasing-digits", "math", "greedy", "medium"]
---

# How to Solve Monotone Increasing Digits

This problem asks us to find the largest number less than or equal to a given integer `n` that has monotone increasing digits, meaning each digit is greater than or equal to the digit before it. The challenge lies in efficiently finding this number without brute-forcing through all possibilities, which would be far too slow for large inputs. The key insight involves working backwards through the digits to find where the monotonic property breaks and adjusting accordingly.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `n = 332`.

**Step 1:** Convert to digits: `[3, 3, 2]`

**Step 2:** Scan from left to right looking for the first violation of monotonicity:

- Compare digits at positions 0 and 1: 3 ≤ 3 ✓
- Compare digits at positions 1 and 2: 3 ≤ 2 ✗ (violation found!)

**Step 3:** When we find a violation, we need to adjust. The issue is at position 1 (value 3) and position 2 (value 2). We can't simply swap them because that might create a number larger than `n`. Instead, we:

1. Decrement the digit at position 1: 3 becomes 2
2. Set all digits after position 1 to 9 (to maximize the number)

**Step 4:** Our digits become: `[3, 2, 9]`

**Step 5:** But wait! Now we have a new problem: compare positions 0 and 1: 3 ≤ 2 ✗ (another violation!)

**Step 6:** We need to continue moving left until all digits are monotonic:

- Decrement digit at position 0: 3 becomes 2
- Set all digits after position 0 to 9

**Step 7:** Final digits: `[2, 9, 9]` → Result: 299

This process ensures we get the largest monotone increasing number ≤ 332. Let's verify: 299 < 332 and has monotone increasing digits (2 ≤ 9 ≤ 9), and it's the largest such number (300+ would be larger than 332, 298 would be smaller than 299).

## Brute Force Approach

A naive approach would be to start from `n` and decrement by 1 until we find a number with monotone increasing digits:

1. Start with `current = n`
2. While `current > 0`:
   - Check if `current` has monotone increasing digits
   - If yes, return `current`
   - Otherwise, decrement `current` by 1

**Why this fails:**

- Time complexity is O(n × d) where d is the number of digits
- For `n = 10^9`, we might need to check up to 10^9 numbers
- Each check requires scanning all digits (up to 10 digits)
- This is far too slow for the constraints

Even if we try to be smarter by skipping numbers (like when we see a violation, we know all numbers in a certain range won't work), implementing this correctly is complex and still potentially inefficient.

## Optimized Approach

The key insight is that we can find the solution in a single pass through the digits by working backwards:

1. **Convert to mutable digits**: Convert the number to a list/array of digits so we can modify them.

2. **Find the first violation**: Scan from left to right to find the first index `i` where `digits[i] > digits[i+1]`. This is where monotonicity breaks.

3. **Propagate the fix backwards**: When we find such a violation at position `i`, we need to:
   - Decrement `digits[i]` by 1
   - Set all digits after `i` to 9
   - However, decrementing `digits[i]` might create a new violation with the digit before it, so we need to continue moving left until all digits are monotonic.

4. **Alternative approach (more efficient)**: Instead of fixing and then checking again, we can:
   - Find the first position where a decrease happens
   - Move left from that position until we find where to decrement
   - Set everything after to 9

The most elegant solution uses a marker approach:

1. Convert `n` to a list of digits
2. Find the first index `i` where `digits[i] > digits[i+1]`
3. While such an `i` exists and `i > 0` and `digits[i] == digits[i-1]`, move `i` left
4. Decrement `digits[i]` by 1
5. Set all digits after `i` to 9
6. Convert back to integer

This works because when we find a violation at position `i`, the digit at `i` is too high. We need to reduce it, but if it's part of a sequence of equal digits, we need to reduce the first one in that sequence to maintain monotonicity.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(d) where d is number of digits | Space: O(d)
def monotoneIncreasingDigits(n: int) -> int:
    # Convert the number to a list of digits for easy manipulation
    digits = list(str(n))

    # Find the first position where digits[i] > digits[i+1]
    # This is where monotonicity breaks
    marker = len(digits)
    for i in range(len(digits) - 1):
        if digits[i] > digits[i + 1]:
            # We found a violation. We need to mark this position
            marker = i
            break

    # If marker wasn't updated, the number is already monotone increasing
    if marker == len(digits):
        return n

    # Move marker left while digits[marker] == digits[marker-1]
    # This handles cases like 332 where we need to decrement the first 3, not the second
    while marker > 0 and digits[marker] == digits[marker - 1]:
        marker -= 1

    # Decrement the digit at marker position
    # This ensures the number becomes smaller than n
    digits[marker] = str(int(digits[marker]) - 1)

    # Set all digits after marker to '9' to maximize the number
    for i in range(marker + 1, len(digits)):
        digits[i] = '9'

    # Convert back to integer
    return int(''.join(digits))
```

```javascript
// Time: O(d) where d is number of digits | Space: O(d)
function monotoneIncreasingDigits(n) {
  // Convert the number to an array of digit characters
  const digits = n.toString().split("");

  // Find the first position where digits[i] > digits[i+1]
  let marker = digits.length;
  for (let i = 0; i < digits.length - 1; i++) {
    if (digits[i] > digits[i + 1]) {
      marker = i;
      break;
    }
  }

  // If no violation found, return the original number
  if (marker === digits.length) {
    return n;
  }

  // Move marker left while digits are equal
  // This handles cases like 332 where we need to decrement the first 3
  while (marker > 0 && digits[marker] === digits[marker - 1]) {
    marker--;
  }

  // Decrement the digit at marker position
  digits[marker] = (parseInt(digits[marker]) - 1).toString();

  // Set all digits after marker to '9' to maximize the number
  for (let i = marker + 1; i < digits.length; i++) {
    digits[i] = "9";
  }

  // Convert back to integer
  return parseInt(digits.join(""));
}
```

```java
// Time: O(d) where d is number of digits | Space: O(d)
class Solution {
    public int monotoneIncreasingDigits(int n) {
        // Convert the number to a character array for digit manipulation
        char[] digits = Integer.toString(n).toCharArray();

        // Find the first position where digits[i] > digits[i+1]
        int marker = digits.length;
        for (int i = 0; i < digits.length - 1; i++) {
            if (digits[i] > digits[i + 1]) {
                marker = i;
                break;
            }
        }

        // If no violation found, return the original number
        if (marker == digits.length) {
            return n;
        }

        // Move marker left while digits are equal
        // This handles cases like 332 where we need to decrement the first 3
        while (marker > 0 && digits[marker] == digits[marker - 1]) {
            marker--;
        }

        // Decrement the digit at marker position
        digits[marker]--;

        // Set all digits after marker to '9' to maximize the number
        for (int i = marker + 1; i < digits.length; i++) {
            digits[i] = '9';
        }

        // Convert back to integer
        return Integer.parseInt(new String(digits));
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(d)**

- We make at most two passes through the digits:
  1. First pass to find the violation (O(d))
  2. Second pass to set digits to '9' (O(d))
- The while loop to move marker left also runs in O(d) worst case
- Total: O(d) where d is the number of digits in n

**Space Complexity: O(d)**

- We need to store the digits as a list/array for modification
- In Python/JavaScript: O(d) for the list of characters
- In Java: O(d) for the char array
- We could optimize to O(1) extra space by working with the number mathematically, but the digit array approach is more readable and the constraints make O(d) acceptable

## Common Mistakes

1. **Not handling equal digits correctly**: In cases like `n = 332`, some candidates decrement the second 3 instead of the first. This gives `329` which is not monotone increasing (3 > 2). The fix is to move left while digits are equal before decrementing.

2. **Forgetting to set digits to 9 after the marker**: After decrementing, candidates might leave the remaining digits as-is. For `n = 100`, the correct answer is `99`, but without setting digits to 9, you might get `100` (not monotone) or `090` (not a valid number).

3. **Off-by-one errors in the marker initialization**: Initializing `marker = 0` instead of `marker = len(digits)` can cause issues when the number is already monotone increasing. We need a way to detect when no violation was found.

4. **Not converting digits properly when decrementing**: In Python/JavaScript, digits are characters, so `digits[i] - 1` doesn't work directly. You need to convert to int, decrement, then convert back to string.

## When You'll See This Pattern

This problem uses a **greedy with backtracking** pattern:

- We make a local decision (decrement at a specific position)
- But we may need to adjust earlier positions based on that decision

Similar problems include:

1. **Remove K Digits (Medium)**: Given a string num representing a non-negative integer and an integer k, return the smallest possible integer after removing k digits. Both problems involve modifying digits to achieve a property while optimizing the result.

2. **Next Greater Element III (Medium)**: Find the smallest integer that has exactly the same digits existing in the integer n and is greater in value than n. This also involves digit manipulation to find the "next" valid number.

3. **Maximum Swap (Medium)**: Given a non-negative integer, you could swap two digits at most once to get the maximum valued number. This involves analyzing digit positions to make optimal swaps.

The common thread is analyzing digit sequences and making minimal changes to achieve a desired property.

## Key Takeaways

1. **When working with digit manipulation problems, convert to a mutable representation** (list/array of characters) rather than trying to work with the integer directly. This makes it easier to modify individual digits.

2. **Look for the first violation of the desired property** when designing greedy algorithms. Often, fixing the first problem point reveals the optimal solution structure.

3. **Test edge cases with repeated digits and transitions at boundaries**. Cases like `n = 1234` (already monotone), `n = 10` (needs to become 9), `n = 332` (needs backtracking), and `n = 1000` (needs multiple adjustments) will reveal most implementation bugs.

Related problems: [Remove K Digits](/problem/remove-k-digits)
