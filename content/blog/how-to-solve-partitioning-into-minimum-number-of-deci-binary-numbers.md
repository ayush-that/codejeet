---
title: "How to Solve Partitioning Into Minimum Number Of Deci-Binary Numbers — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Partitioning Into Minimum Number Of Deci-Binary Numbers. Medium difficulty, 88.8% acceptance rate. Topics: String, Greedy."
date: "2028-04-23"
category: "dsa-patterns"
tags: ["partitioning-into-minimum-number-of-deci-binary-numbers", "string", "greedy", "medium"]
---

# How to Solve Partitioning Into Minimum Number Of Deci-Binary Numbers

This problem asks us to find the minimum number of deci-binary numbers (numbers consisting only of 0s and 1s) needed to sum to a given decimal number represented as a string. What makes this problem interesting is that while it might initially seem complex, it has a beautifully simple solution that requires just one key insight about digit positions.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the input `n = "82734"`.

We need to find deci-binary numbers (like 10101, 11000, 00101, etc.) that sum to 82734. Let's think about how addition works digit by digit:

1. **Look at each digit position independently**:
   - Thousands place: 8
   - Hundreds place: 2
   - Tens place: 7
   - Ones place: 3
   - Tenths place: 4

2. **Key insight**: When we add deci-binary numbers, each digit position gets contributions from different deci-binary numbers. Since deci-binary digits can only be 0 or 1, the maximum we can add to any digit position in a single deci-binary number is 1.

3. **For digit 8 in the ten-thousands place**: We need to add 1 to this position in 8 different deci-binary numbers to reach a total of 8.

4. **For digit 2 in the thousands place**: We need to add 1 to this position in 2 different deci-binary numbers.

5. **But here's the crucial observation**: The deci-binary numbers that contribute to the ten-thousands place might also contribute to other places. However, to minimize the total number of deci-binary numbers, we want to "pack" as many contributions as possible into each number.

6. **The minimum number needed**: The digit that requires the most contributions determines the minimum number of deci-binary numbers needed. In our example:
   - Digit 8 needs 8 deci-binary numbers to contribute 1 each
   - Digit 7 needs 7 deci-binary numbers
   - Digit 4 needs 4 deci-binary numbers
   - Digit 3 needs 3 deci-binary numbers
   - Digit 2 needs 2 deci-binary numbers

   The maximum is 8, so we need at least 8 deci-binary numbers.

7. **Constructing the solution**: We can create 8 deci-binary numbers where:
   - All 8 have a 1 in the ten-thousands place (to contribute to the 8)
   - First 7 have a 1 in the thousands place (to contribute to the 7)
   - First 4 have a 1 in the hundreds place (to contribute to the 4)
   - First 3 have a 1 in the tens place (to contribute to the 3)
   - First 2 have a 1 in the ones place (to contribute to the 2)

   This gives us exactly 8 deci-binary numbers that sum to 82734.

So for `n = "82734"`, the answer is 8, which is simply the maximum digit in the number.

## Brute Force Approach

A naive approach might try to actually construct all possible deci-binary numbers and find combinations that sum to the target. Here's what that might look like:

1. Generate all possible deci-binary numbers up to the length of `n`
2. Try all combinations of these numbers to see which sum to `n`
3. Track the minimum number of numbers needed

However, this approach is completely impractical. For a number with `m` digits, there are `2^m` possible deci-binary numbers of length `m` (ignoring leading zeros). Trying all combinations would be exponential time, and even for moderately sized inputs (like 10 digits), we'd have over 1000 possible numbers to combine.

Even if we tried a smarter brute force (like starting with the largest possible deci-binary numbers and subtracting), we'd still face combinatorial explosion. The problem constraints (n can be up to 10^5 digits long!) make any brute force approach impossible.

## Optimized Approach

The key insight comes from understanding how addition works with deci-binary numbers:

1. **Digit independence**: When adding numbers, each digit position is independent (except for carries, but with deci-binary numbers, we can avoid carries by construction).

2. **Maximum contribution per number**: In any single deci-binary number, each digit can contribute at most 1 to the sum at that position.

3. **Bottleneck principle**: The digit that needs the largest total contribution determines how many deci-binary numbers we need. If we have a digit `d` at some position, we need at least `d` deci-binary numbers that have a 1 in that position.

4. **Simultaneous satisfaction**: We can satisfy all digit requirements simultaneously by having the first `d` deci-binary numbers contribute to digit `d`, where `d` is the value of each digit.

This leads to the beautifully simple solution: **The minimum number of deci-binary numbers needed is equal to the maximum digit in the input string.**

Why does this work? Because:

- We need at least `max_digit` numbers to satisfy the digit with maximum value
- We can construct exactly `max_digit` numbers that satisfy all digits simultaneously
- No fewer numbers would work because at least one digit wouldn't get enough contributions

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the length of the input string
# Space: O(1) - we only use constant extra space
def minPartitions(n: str) -> int:
    """
    Returns the minimum number of deci-binary numbers needed to sum to n.

    The key insight is that each digit in the result comes from summing
    the corresponding digits of all deci-binary numbers. Since each
    deci-binary digit is either 0 or 1, the digit that requires the
    most contributions determines the minimum number of numbers needed.

    Args:
        n: String representation of the target decimal number

    Returns:
        Integer representing the minimum number of deci-binary numbers needed
    """
    # Initialize max_digit to track the largest digit found
    max_digit = 0

    # Iterate through each character in the string
    for char in n:
        # Convert character to integer
        current_digit = int(char)

        # Update max_digit if current digit is larger
        if current_digit > max_digit:
            max_digit = current_digit

        # Early exit optimization: if we find digit 9, we can't do better
        # This is optional but improves best-case performance
        if max_digit == 9:
            return 9

    # The maximum digit is the answer
    return max_digit
```

```javascript
// Time: O(n) where n is the length of the input string
// Space: O(1) - we only use constant extra space
/**
 * Returns the minimum number of deci-binary numbers needed to sum to n.
 *
 * The key insight is that each digit in the result comes from summing
 * the corresponding digits of all deci-binary numbers. Since each
 * deci-binary digit is either 0 or 1, the digit that requires the
 * most contributions determines the minimum number of numbers needed.
 *
 * @param {string} n - String representation of the target decimal number
 * @return {number} Minimum number of deci-binary numbers needed
 */
function minPartitions(n) {
  // Initialize maxDigit to track the largest digit found
  let maxDigit = 0;

  // Iterate through each character in the string
  for (let i = 0; i < n.length; i++) {
    // Convert character to integer
    const currentDigit = parseInt(n[i], 10);

    // Update maxDigit if current digit is larger
    if (currentDigit > maxDigit) {
      maxDigit = currentDigit;
    }

    // Early exit optimization: if we find digit 9, we can't do better
    // This is optional but improves best-case performance
    if (maxDigit === 9) {
      return 9;
    }
  }

  // The maximum digit is the answer
  return maxDigit;
}
```

```java
// Time: O(n) where n is the length of the input string
// Space: O(1) - we only use constant extra space
class Solution {
    /**
     * Returns the minimum number of deci-binary numbers needed to sum to n.
     *
     * The key insight is that each digit in the result comes from summing
     * the corresponding digits of all deci-binary numbers. Since each
     * deci-binary digit is either 0 or 1, the digit that requires the
     * most contributions determines the minimum number of numbers needed.
     *
     * @param n String representation of the target decimal number
     * @return Minimum number of deci-binary numbers needed
     */
    public int minPartitions(String n) {
        // Initialize maxDigit to track the largest digit found
        int maxDigit = 0;

        // Iterate through each character in the string
        for (int i = 0; i < n.length(); i++) {
            // Convert character to integer
            int currentDigit = n.charAt(i) - '0';

            // Update maxDigit if current digit is larger
            if (currentDigit > maxDigit) {
                maxDigit = currentDigit;
            }

            // Early exit optimization: if we find digit 9, we can't do better
            // This is optional but improves best-case performance
            if (maxDigit == 9) {
                return 9;
            }
        }

        // The maximum digit is the answer
        return maxDigit;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, examining each character exactly once
- `n` here represents the length of the input string
- Each operation inside the loop (character conversion, comparison) takes O(1) time
- The early exit optimization for digit 9 doesn't change the worst-case complexity but improves best-case performance

**Space Complexity: O(1)**

- We only use a constant amount of extra space (the `max_digit` variable)
- No additional data structures are created that scale with input size
- The input string is provided and we don't create copies of it

This is optimal because we must examine each digit at least once to find the maximum, giving us a lower bound of Ω(n) time complexity.

## Common Mistakes

1. **Overcomplicating with actual construction**: Some candidates try to actually construct the deci-binary numbers instead of just returning the count. This is unnecessary and inefficient. Remember: the problem only asks for the minimum _number_, not the actual numbers themselves.

2. **Integer overflow with large inputs**: The problem states `n` can be up to 10^5 digits long. Trying to convert the entire string to an integer will cause overflow in most languages. Always work with the string representation directly.

3. **Forgetting character-to-digit conversion**: When iterating through the string, remember that `'5'` (character) is not the same as `5` (integer). You need to convert each character to its integer value before comparison.

4. **Incorrect early exit conditions**: While the early exit for digit 9 is an optimization, some candidates might incorrectly exit early for other digits. Only digit 9 guarantees we've found the maximum possible value.

5. **Assuming sorted or specific digit order**: The solution works regardless of digit order. Don't assume digits are sorted or have any particular arrangement.

## When You'll See This Pattern

This problem exemplifies the **"bottleneck"** or **"limiting factor"** pattern in greedy algorithms. You'll encounter similar patterns in:

1. **Container With Most Water (LeetCode 11)**: The amount of water is limited by the shorter wall, similar to how our solution is limited by the maximum digit.

2. **Trapping Rain Water (LeetCode 42)**: The water trapped at each position is determined by the minimum of the maximum heights to its left and right.

3. **Assign Cookies (LeetCode 455)**: The number of satisfied children is limited by either the number of cookies or the greed factors.

4. **Task Scheduler (LeetCode 621)**: The minimum time is often determined by the task with maximum frequency, similar to how our solution is determined by the maximum digit.

The common theme is identifying the constraining factor that determines the overall solution, then building around that constraint.

## Key Takeaways

1. **Look for the bottleneck**: In many optimization problems, there's a limiting factor that determines the optimal solution. Here, it's the maximum digit. Train yourself to ask: "What resource is most scarce?" or "What requirement is hardest to satisfy?"

2. **Digit-wise thinking for number problems**: When dealing with digit manipulation problems, consider each digit position independently. This often simplifies what seems like a complex arithmetic problem into simpler character/string processing.

3. **Greedy can be optimal**: Sometimes the seemingly simple, greedy approach (take the maximum digit) is actually provably optimal. Don't overcomplicate problems—look for the straightforward insight first.

4. **Understand the problem constraints deeply**: The fact that deci-binary digits can only be 0 or 1, and that we're summing numbers without carries, is crucial to the solution. Always fully understand the properties given in the problem statement.

[Practice this problem on CodeJeet](/problem/partitioning-into-minimum-number-of-deci-binary-numbers)
