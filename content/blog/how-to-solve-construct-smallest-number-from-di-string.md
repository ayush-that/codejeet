---
title: "How to Solve Construct Smallest Number From DI String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct Smallest Number From DI String. Medium difficulty, 85.6% acceptance rate. Topics: String, Backtracking, Stack, Greedy."
date: "2026-06-15"
category: "dsa-patterns"
tags: ["construct-smallest-number-from-di-string", "string", "backtracking", "stack", "medium"]
---

# How to Solve Construct Smallest Number From DI String

You're given a string pattern like "IIDD" where 'I' means increasing and 'D' means decreasing, and you need to construct the smallest possible number (as a string) of length n+1 using digits 1-9 that satisfies the pattern. The challenge is that you can't reuse digits, and you need the lexicographically smallest result. What makes this interesting is that you need to be clever about when to use small digits versus when to save them for later.

## Visual Walkthrough

Let's trace through pattern = "IIDD" step by step:

We need a 5-digit number (n+1 = 5) using digits 1-9 without repetition.

**Step 1:** Start with an empty result and available digits 1-9
Result: "", Pattern: I I D D

**Step 2:** First character is 'I' - we need increasing
We want the smallest possible number, so we should use the smallest available digit: 1
Result: "1", Remaining: 2-9

**Step 3:** Second character is 'I' - increasing again
We need a digit larger than 1. The smallest available that's larger than 1 is 2
Result: "12", Remaining: 3-9

**Step 4:** Third character is 'D' - decreasing
We need a digit smaller than 2. But wait - we've used 1 and 2, and 1 is smaller than 2 but it's already used!
This is the key insight: When we hit a 'D', we might need to backtrack and adjust previous digits.

**Better approach:** Let's think about processing in reverse or using a stack.

Actually, here's the trick: Whenever we see a sequence of D's, we need to reverse the corresponding digits. Let me show you:

For "I I D D":

1. Start with digits 1-5 (since we need 5 digits total): [1, 2, 3, 4, 5]
2. Process the pattern:
   - First 'I': take 1 → result: [1]
   - Second 'I': take 2 → result: [1, 2]
   - First 'D': we know we'll need decreasing, so we should prepare
   - Second 'D': more decreasing

Better yet, let's use the stack approach:

1. Initialize result = [], stack = []
2. For i from 0 to n (pattern length):
   - Push i+1 to stack
   - If i == n OR pattern[i] == 'I':
     - Pop all from stack to result
3. After loop, we have our result

For "I I D D" with n=4:
i=0: push 1, pattern[0]='I' → pop stack [1] → result=[1]
i=1: push 2, pattern[1]='I' → pop stack [2] → result=[1,2]
i=2: push 3, pattern[2]='D' → no pop (not 'I' and not last)
i=3: push 4, pattern[3]='D' → no pop
i=4: push 5, i==n → pop all [5,4,3] → result=[1,2,5,4,3]

So the smallest number is "12543". Let's verify:

- 1 < 2 (I)
- 2 < 5 (I)
- 5 > 4 (D)
- 4 > 3 (D)

Perfect! And it's the smallest possible because we used the smallest available digits in the right order.

## Brute Force Approach

A naive approach would be to generate all permutations of digits 1-9 of length n+1, check which ones satisfy the pattern, and return the smallest. For n up to 8 (so 9-digit numbers), that's 9! = 362,880 permutations. While this might work for small n, it's inefficient and doesn't scale well. More importantly, the problem expects an optimal O(n) solution.

The brute force would look like:

1. Generate all permutations of digits 1 through (n+1)
2. For each permutation, check if it satisfies the pattern
3. Keep track of the smallest valid permutation

The problem is the factorial time complexity: O((n+1)!) which is far too slow for n up to 8.

## Optimized Approach

The key insight is that we can construct the answer greedily using a stack. Here's the reasoning:

1. **Observation**: When we see 'I', we want to use the smallest available digit that's larger than the previous one. When we see 'D', we need a digit smaller than the previous one.

2. **Problem**: If we just pick digits greedily from smallest to largest, we might get stuck when we need a decreasing sequence. For example, in "DD", if we use 1 then 2, we violate the decreasing pattern.

3. **Solution**: Use a stack to handle decreasing sequences. The algorithm:
   - Iterate from 0 to n (where n is pattern length)
   - Push (i+1) onto the stack at each step
   - Whenever we encounter 'I' or reach the end of the pattern, pop all elements from the stack and append them to the result
   - This ensures that for consecutive D's, we accumulate numbers on the stack, then when we finally see an I or reach the end, we pop them in reverse order, creating a decreasing sequence

4. **Why this gives the smallest number**: We're always using the smallest available digits (1, 2, 3, ... in order), and by reversing the stack for D sequences, we create the smallest possible decreasing subsequence with those digits.

## Optimal Solution

Here's the complete implementation using the stack approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def smallestNumber(pattern: str) -> str:
    """
    Constructs the smallest number that satisfies the given DI pattern.

    The key insight is to use a stack to handle decreasing sequences.
    We iterate through 0 to n (where n is pattern length), pushing i+1
    onto the stack. When we see 'I' or reach the end, we pop all elements
    from the stack, which creates decreasing sequences when needed.
    """
    n = len(pattern)
    result = []  # Will store the digits of our answer
    stack = []   # Stack to handle decreasing sequences

    # Iterate from 0 to n (we need n+1 digits total)
    for i in range(n + 1):
        # Push the next smallest available digit (i+1)
        stack.append(i + 1)

        # If we're at the end OR the current pattern character is 'I'
        if i == n or pattern[i] == 'I':
            # Pop all elements from stack to result
            # This reverses the order for D sequences
            while stack:
                result.append(stack.pop())

    # Convert list of integers to string
    return ''.join(map(str, result))
```

```javascript
// Time: O(n) | Space: O(n)
function smallestNumber(pattern) {
  /**
   * Constructs the smallest number that satisfies the given DI pattern.
   *
   * The key insight is to use a stack to handle decreasing sequences.
   * We iterate through 0 to n (where n is pattern length), pushing i+1
   * onto the stack. When we see 'I' or reach the end, we pop all elements
   * from the stack, which creates decreasing sequences when needed.
   */
  const n = pattern.length;
  const result = []; // Will store the digits of our answer
  const stack = []; // Stack to handle decreasing sequences

  // Iterate from 0 to n (we need n+1 digits total)
  for (let i = 0; i <= n; i++) {
    // Push the next smallest available digit (i+1)
    stack.push(i + 1);

    // If we're at the end OR the current pattern character is 'I'
    if (i === n || pattern[i] === "I") {
      // Pop all elements from stack to result
      // This reverses the order for D sequences
      while (stack.length > 0) {
        result.push(stack.pop());
      }
    }
  }

  // Convert array of numbers to string
  return result.join("");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String smallestNumber(String pattern) {
        /**
         * Constructs the smallest number that satisfies the given DI pattern.
         *
         * The key insight is to use a stack to handle decreasing sequences.
         * We iterate through 0 to n (where n is pattern length), pushing i+1
         * onto the stack. When we see 'I' or reach the end, we pop all elements
         * from the stack, which creates decreasing sequences when needed.
         */
        int n = pattern.length();
        StringBuilder result = new StringBuilder();  // Will store our answer
        Stack<Integer> stack = new Stack<>();       // Stack to handle decreasing sequences

        // Iterate from 0 to n (we need n+1 digits total)
        for (int i = 0; i <= n; i++) {
            // Push the next smallest available digit (i+1)
            stack.push(i + 1);

            // If we're at the end OR the current pattern character is 'I'
            if (i == n || pattern.charAt(i) == 'I') {
                // Pop all elements from stack to result
                // This reverses the order for D sequences
                while (!stack.isEmpty()) {
                    result.append(stack.pop());
                }
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the pattern once (n iterations) plus one more for the final digit (n+1 total)
- Each digit is pushed onto the stack exactly once and popped exactly once
- Total operations: 2(n+1) = O(n)

**Space Complexity: O(n)**

- The stack can hold up to n+1 elements in the worst case (when pattern is all D's)
- The result array also stores n+1 elements
- Total space: O(n) for stack + O(n) for result = O(n)

## Common Mistakes

1. **Off-by-one errors with indices**: Remember the result has length n+1, not n. A common mistake is iterating only n times instead of n+1. Always check: if pattern has length n, you need n+1 digits.

2. **Forgetting to handle the last digit**: The algorithm needs to process one more digit after the last pattern character. That's why we check `i == n` in addition to checking for 'I'.

3. **Using the wrong comparison for decreasing sequences**: Some candidates try to manually track previous digits and find decreasing values, which gets complicated. The stack approach elegantly handles this by reversing sequences of consecutive D's.

4. **Not understanding why the stack gives the smallest number**: The stack approach works because we're always using the smallest available digits in order (1, 2, 3, ...). When we reverse a subsequence for D's, we're creating the smallest possible decreasing sequence with those particular digits.

## When You'll See This Pattern

This stack-based pattern for handling increasing/decreasing sequences appears in several problems:

1. **DI String Match (LeetCode 942)**: Almost identical problem but returns an array of integers instead of a string, and uses digits 0-n instead of 1-9. The same stack approach works perfectly.

2. **Remove K Digits (LeetCode 402)**: Uses a monotonic stack to maintain increasing/decreasing sequences while removing digits to get the smallest number.

3. **132 Pattern (LeetCode 456)**: Uses a stack to track decreasing sequences while looking for a specific pattern.

4. **Next Greater Element problems**: Stack is commonly used to handle sequences where you need to find the next greater or smaller element.

The core pattern is: **When you need to process elements in order but might need to reverse subsequences based on certain conditions, a stack is often the right tool.**

## Key Takeaways

1. **Stack for sequence reversal**: When you need to potentially reverse subsequences (like handling decreasing runs in an otherwise increasing sequence), a stack naturally gives you LIFO (Last-In-First-Out) behavior which reverses the order.

2. **Greedy with smallest digits**: For lexicographically smallest results, using the smallest available digits in order is usually correct. The challenge is arranging them to satisfy constraints.

3. **Pattern recognition**: DI pattern problems often have O(n) stack solutions. If you see "increasing/decreasing pattern" and "smallest lexicographic result", think about whether a stack can help you reverse subsequences as needed.

Remember: The stack doesn't just store values—it stores them in a way that lets you reverse their order when needed, which is exactly what decreasing sequences require.

Related problems: [DI String Match](/problem/di-string-match)
