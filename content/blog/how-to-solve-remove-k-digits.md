---
title: "How to Solve Remove K Digits — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove K Digits. Medium difficulty, 36.4% acceptance rate. Topics: String, Stack, Greedy, Monotonic Stack."
date: "2027-01-16"
category: "dsa-patterns"
tags: ["remove-k-digits", "string", "stack", "greedy", "medium"]
---

# How to Solve Remove K Digits

You're given a string `num` representing a non-negative integer and an integer `k`. Your task is to remove exactly `k` digits from `num` to create the smallest possible integer, then return that integer as a string. What makes this problem tricky is that removing digits isn't just about taking out the largest numbers — you need to consider the positional value of each digit. Removing a large digit early might create an even smaller number than removing a slightly smaller digit later.

## Visual Walkthrough

Let's walk through an example: `num = "1432219"`, `k = 3`. We want to remove 3 digits to get the smallest number.

**Step-by-step reasoning:**

1. Start from the left. The first digit is '1'. Should we remove it? No — removing it would expose '4' as the first digit, making the number start with 4 instead of 1. A number starting with 4 is larger than one starting with 1.
2. Move to the second digit: '4'. The next digit is '3', which is smaller than '4'. If we remove '4', we get "132219" — the number now starts with '1' followed by '3' instead of '4'. This is better! So we remove '4'. Now `k = 2` remaining removals.
3. Current number: "132219". Look at the first two digits: '1' then '3'. '3' is larger than the next digit '2'. Remove '3' → "12219", `k = 1`.
4. Current: "12219". Look at '2' (third digit) vs next '2' (equal). No removal. Look at '2' (fourth digit) vs next '1' — '2' > '1', so remove the fourth '2' → "1219", `k = 0`.
5. We've removed 3 digits. Final result: "1219".

Notice the pattern: whenever we find a digit that's larger than the next digit, removing it creates a smaller number. This is the key insight!

## Brute Force Approach

A naive approach would be to try all possible combinations of removing `k` digits from an `n`-digit number. There are C(n, k) combinations (n choose k), which grows factorially. For `n = 10` and `k = 5`, that's 252 combinations — manageable. But for `n = 1000` and `k = 500`, it's astronomically large.

Even if we could generate all combinations, we'd need to compare the resulting numbers. Since numbers can have up to 10,000 digits (per constraints), comparing them would be expensive.

**Why brute force fails:**

- Exponential time complexity: O(C(n, k) × n) — completely infeasible for large inputs
- No intelligent pruning — we're checking many obviously bad combinations
- Doesn't leverage the positional nature of digits in a number

## Optimized Approach

The key insight is **monotonic stack** (also called a greedy stack approach). Here's the reasoning:

1. **Leftmost digits matter most**: In a number, the leftmost digits have the highest place value. Removing a large digit early (like removing '4' from "143...") has more impact than removing it later.
2. **Look for "peaks"**: A digit that's larger than the digit immediately to its right creates a "peak". Removing that peak digit gives us a smaller number.
3. **Process left to right**: As we scan the number from left to right, we maintain a stack of digits. For each new digit:
   - While we still have removals left (`k > 0`) AND the stack isn't empty AND the top of stack > current digit
   - Pop from stack (remove that digit) and decrement `k`
   - This removes "peaks" as we encounter them
4. **Handle leftover removals**: If we finish scanning but still have `k > 0`, remove digits from the end (they're the largest remaining digits).
5. **Clean up leading zeros**: After removal, we might have leading zeros. Remove them, but be careful — if the result would be empty, return "0".

This approach works because it's greedy: whenever we can make the number smaller by removing a digit now, we do it immediately. The monotonic stack ensures we maintain the smallest possible prefix as we build the result.

## Optimal Solution

Here's the complete solution using a monotonic stack:

<div class="code-group">

```python
# Time: O(n) where n is length of num - we process each digit at most twice
# Space: O(n) for the stack
def removeKdigits(num: str, k: int) -> str:
    # Edge case: if we need to remove all digits, result is "0"
    if k >= len(num):
        return "0"

    # Use a list as a stack to build the result
    stack = []

    # Process each digit in the number
    for digit in num:
        # While we still have removals left, stack isn't empty,
        # and the current digit is smaller than the top of stack
        while k > 0 and stack and stack[-1] > digit:
            # Removing the top of stack (larger digit) gives us a smaller number
            stack.pop()
            k -= 1

        # Add current digit to stack
        stack.append(digit)

    # If we still have removals left after processing all digits
    # (this happens when digits are in non-decreasing order)
    # Remove from the end - these are the largest remaining digits
    if k > 0:
        stack = stack[:-k]

    # Convert stack to string
    result = ''.join(stack)

    # Remove leading zeros
    # lstrip('0') removes all leading '0' characters
    result = result.lstrip('0')

    # If result is empty after removing leading zeros, return "0"
    # Otherwise return the result
    return result if result else "0"
```

```javascript
// Time: O(n) where n is length of num
// Space: O(n) for the stack
function removeKdigits(num, k) {
  // Edge case: if we need to remove all digits, result is "0"
  if (k >= num.length) {
    return "0";
  }

  // Use an array as a stack
  const stack = [];

  // Process each digit in the number
  for (let i = 0; i < num.length; i++) {
    const digit = num[i];

    // While we have removals left, stack isn't empty,
    // and current digit is smaller than top of stack
    while (k > 0 && stack.length > 0 && stack[stack.length - 1] > digit) {
      // Remove the larger digit from stack
      stack.pop();
      k--;
    }

    // Add current digit to stack
    stack.push(digit);
  }

  // If we still have removals left, remove from the end
  if (k > 0) {
    stack.splice(stack.length - k, k);
  }

  // Convert stack to string
  let result = stack.join("");

  // Remove leading zeros
  // The regex /^0+/ matches one or more '0' at the beginning
  result = result.replace(/^0+/, "");

  // If result is empty, return "0", otherwise return result
  return result === "" ? "0" : result;
}
```

```java
// Time: O(n) where n is length of num
// Space: O(n) for the StringBuilder used as stack
class Solution {
    public String removeKdigits(String num, int k) {
        // Edge case: if we need to remove all digits
        if (k >= num.length()) {
            return "0";
        }

        // Use StringBuilder as a stack for efficiency
        StringBuilder stack = new StringBuilder();

        // Process each digit in the number
        for (char digit : num.toCharArray()) {
            // While we have removals left, stack isn't empty,
            // and current digit is smaller than top of stack
            while (k > 0 && stack.length() > 0 && stack.charAt(stack.length() - 1) > digit) {
                // Remove the larger digit from stack
                stack.deleteCharAt(stack.length() - 1);
                k--;
            }

            // Add current digit to stack
            stack.append(digit);
        }

        // If we still have removals left, remove from the end
        if (k > 0) {
            stack.delete(stack.length() - k, stack.length());
        }

        // Remove leading zeros
        int start = 0;
        while (start < stack.length() && stack.charAt(start) == '0') {
            start++;
        }

        // Extract the result substring
        String result = stack.substring(start);

        // If result is empty, return "0", otherwise return result
        return result.isEmpty() ? "0" : result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each digit exactly once when we add it to the stack
- Each digit can be removed from the stack at most once (in the while loop)
- Even though we have a nested while loop, each digit is pushed and popped at most once, so total operations are O(2n) = O(n)

**Space Complexity: O(n)**

- In the worst case, when no digits are removed (k=0 or digits are in strictly increasing order), we store all digits in the stack
- The stack can grow to size n, so space is O(n)

## Common Mistakes

1. **Not handling leading zeros correctly**: After removing digits, you might get something like "000123" or "0000". You need to remove all leading zeros, but if everything becomes zeros, you should return "0", not an empty string.

2. **Forgetting to handle leftover k**: After processing all digits, if k > 0 (which happens when digits are in non-decreasing order), you need to remove the last k digits. These are the largest remaining digits.

3. **Using the wrong comparison in the while loop**: The condition should be `stack[-1] > digit` (greater than), not `>=`. Using `>=` would remove equal digits, which isn't necessary and could give a suboptimal result in some cases.

4. **Not considering the edge case where k >= num.length()**: If you need to remove all or more digits than exist, the result should be "0". Handle this at the beginning to avoid index errors.

## When You'll See This Pattern

The monotonic stack pattern appears in problems where you need to maintain a certain order while processing elements sequentially, especially when you can remove elements to optimize something. Look for these clues:

- You're processing a sequence (array, string) left to right
- You can remove elements to achieve some ordering property
- The decision to keep or remove an element depends on its relationship with upcoming elements

**Related problems:**

1. **Find the Most Competitive Subsequence (Medium)**: Almost identical! Instead of removing k digits to get the smallest number, you're keeping n-k digits to get the most competitive (smallest lexicographically) subsequence.
2. **Create Maximum Number (Hard)**: A more complex version where you merge two arrays after creating maximum numbers from each.
3. **Daily Temperatures (Medium)**: Uses monotonic stack to find next warmer temperature.
4. **Next Greater Element I (Easy)**: Another classic monotonic stack problem.

## Key Takeaways

1. **Monotonic stacks are perfect for "remove to optimize" problems**: When you need to remove elements to achieve the best ordering (smallest, largest, etc.), a monotonic stack that removes "bad" elements as you encounter them is often the solution.

2. **Greedy works when local optima lead to global optimum**: Removing a digit when it's larger than the next digit (a local decision) leads to the globally smallest number. This works because digits have positional value.

3. **Always handle edge cases explicitly**: Leading zeros, empty results, and k >= n are common pitfalls. Address them at the beginning or end of your solution to avoid subtle bugs.

Related problems: [Create Maximum Number](/problem/create-maximum-number), [Monotone Increasing Digits](/problem/monotone-increasing-digits), [Find the Most Competitive Subsequence](/problem/find-the-most-competitive-subsequence)
