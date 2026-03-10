---
title: "How to Solve Split a String in Balanced Strings — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Split a String in Balanced Strings. Easy difficulty, 87.3% acceptance rate. Topics: String, Greedy, Counting."
date: "2027-08-24"
category: "dsa-patterns"
tags: ["split-a-string-in-balanced-strings", "string", "greedy", "counting", "easy"]
---

# How to Solve Split a String in Balanced Strings

The problem asks us to split a balanced string (equal number of 'L' and 'R' characters) into the maximum number of balanced substrings. The key insight is that we can greedily split whenever we encounter a balanced substring, and this will yield the maximum possible splits. What makes this problem interesting is that the greedy approach works perfectly here—once we have a balanced prefix, splitting it off immediately doesn't hurt our ability to split the remainder.

## Visual Walkthrough

Let's trace through an example: `s = "RLRRLLRLRL"`

We'll maintain a counter that increments when we see 'R' and decrements when we see 'L'. When the counter reaches 0, we have a balanced substring and can make a split.

**Step-by-step:**

- Start with `count = 0`, `result = 0`
- `s[0] = 'R'` → `count = 1` (more R's so far)
- `s[1] = 'L'` → `count = 0` → Balanced! Split here → `result = 1`
  - First substring: "RL"
- Reset and continue with remaining string: "RRLLRLRL"
- `s[2] = 'R'` → `count = 1`
- `s[3] = 'R'` → `count = 2`
- `s[4] = 'L'` → `count = 1`
- `s[5] = 'L'` → `count = 0` → Balanced! Split → `result = 2`
  - Second substring: "RRLL"
- Continue with: "RLRL"
- `s[6] = 'R'` → `count = 1`
- `s[7] = 'L'` → `count = 0` → Balanced! Split → `result = 3`
  - Third substring: "RL"
- Continue with: "RL"
- `s[8] = 'R'` → `count = 1`
- `s[9] = 'L'` → `count = 0` → Balanced! Split → `result = 4`
  - Fourth substring: "RL"

Final answer: **4** balanced substrings: ["RL", "RRLL", "RL", "RL"]

Notice that we never needed to look ahead or backtrack—once our counter hit 0, we immediately split. This greedy approach works because any balanced prefix can be safely removed without affecting the balance of the remaining string.

## Brute Force Approach

A naive approach might try to find all possible split points and check which combination yields the maximum number of balanced substrings. For a string of length n, there are 2^(n-1) possible ways to split it (between each pair of characters, we either split or don't). We would need to:

1. Generate all possible split combinations
2. For each combination, verify every substring is balanced
3. Track the maximum number of balanced substrings found

This approach has exponential time complexity O(2^n × n), which is completely impractical for strings of any reasonable length. Even for n=20, we'd need to check over 1 million possibilities.

The key realization is that we don't need to explore all possibilities. The greedy approach—splitting as soon as we can—always gives us the maximum number of splits. This is because once we have a balanced prefix, keeping it longer won't help us get more splits from the remainder.

## Optimal Solution

The optimal solution uses a simple counting approach with O(n) time and O(1) space. We iterate through the string, maintaining a balance counter. When the counter hits 0, we increment our result and continue.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def balancedStringSplit(s: str) -> int:
    """
    Returns the maximum number of balanced substrings in s.

    Approach: Use a greedy counter that increments for 'R' and
    decrements for 'L'. Whenever the counter reaches 0, we've
    found a balanced substring and can increment our result.
    """
    balance = 0  # Tracks the difference between R and L counts
    result = 0   # Counts the number of balanced substrings found

    for char in s:
        # Update balance: +1 for 'R', -1 for 'L'
        if char == 'R':
            balance += 1
        else:  # char == 'L'
            balance -= 1

        # When balance reaches 0, we have a balanced substring
        # This works because the entire string is guaranteed balanced,
        # so every prefix that balances will be a valid substring
        if balance == 0:
            result += 1

    return result
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Returns the maximum number of balanced substrings in s.
 *
 * Approach: Use a greedy counter that increments for 'R' and
 * decrements for 'L'. Whenever the counter reaches 0, we've
 * found a balanced substring and can increment our result.
 */
function balancedStringSplit(s) {
  let balance = 0; // Tracks the difference between R and L counts
  let result = 0; // Counts the number of balanced substrings found

  for (let i = 0; i < s.length; i++) {
    // Update balance: +1 for 'R', -1 for 'L'
    if (s[i] === "R") {
      balance++;
    } else {
      // s[i] === 'L'
      balance--;
    }

    // When balance reaches 0, we have a balanced substring
    // This works because the entire string is guaranteed balanced,
    // so every prefix that balances will be a valid substring
    if (balance === 0) {
      result++;
    }
  }

  return result;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Returns the maximum number of balanced substrings in s.
     *
     * Approach: Use a greedy counter that increments for 'R' and
     * decrements for 'L'. Whenever the counter reaches 0, we've
     * found a balanced substring and can increment our result.
     */
    public int balancedStringSplit(String s) {
        int balance = 0;  // Tracks the difference between R and L counts
        int result = 0;   // Counts the number of balanced substrings found

        for (int i = 0; i < s.length(); i++) {
            // Update balance: +1 for 'R', -1 for 'L'
            if (s.charAt(i) == 'R') {
                balance++;
            } else {  // s.charAt(i) == 'L'
                balance--;
            }

            // When balance reaches 0, we have a balanced substring
            // This works because the entire string is guaranteed balanced,
            // so every prefix that balances will be a valid substring
            if (balance == 0) {
                result++;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string exactly once, performing constant-time operations (comparisons and arithmetic) for each character.
- The loop runs n times, where n is the length of the input string.

**Space Complexity: O(1)**

- We only use a fixed number of integer variables (`balance` and `result`), regardless of the input size.
- No additional data structures that grow with input size are used.

## Common Mistakes

1. **Overcomplicating with backtracking or DP**: Some candidates try to use dynamic programming or backtracking to find all possible splits. This is unnecessary since the greedy approach always works. Remember: if a problem is marked "Easy" and has high acceptance, there's usually a simple linear solution.

2. **Forgetting the input is guaranteed balanced**: The problem states the input string is balanced. This guarantees our counter will end at 0. Some candidates add unnecessary checks for the final balance not being 0.

3. **Incorrect balance tracking**: Swapping the signs (incrementing for 'L' and decrementing for 'R') still works mathematically, but it's important to be consistent. The key is that opposite characters have opposite effects on the balance.

4. **Off-by-one in result counting**: Some candidates might increment `result` when starting a new substring instead of when completing one. We only count when `balance == 0`, which marks the end of a balanced substring.

## When You'll See This Pattern

This problem uses a **greedy counting** pattern that appears in many string and parentheses balancing problems:

1. **Valid Parentheses (LeetCode #20)**: Similar balance tracking with stack, but here we only need a counter because we have one type of pair.
2. **Minimum Add to Make Parentheses Valid (LeetCode #921)**: Uses a similar balance counter to track unmatched parentheses.
3. **Remove Outermost Parentheses (LeetCode #1021)**: Exactly the same pattern—split into primitive parentheses strings whenever balance returns to 0.
4. **Maximum Nesting Depth of Parentheses (LeetCode #1614)**: Tracks the maximum balance reached during traversal.

The core pattern is: **When you need to track matching pairs or balanced segments in a sequence, a simple counter that increments for one type and decrements for the other often suffices.**

## Key Takeaways

1. **Greedy works for balanced splits**: When you can split a balanced sequence into balanced parts, taking the earliest possible split (greedy) always yields the maximum number of splits. This is because any balanced prefix is independent of what follows.

2. **Counter over stack for single pair types**: For problems with only two matching characters (like 'L'/'R' or '('/')'), a simple integer counter is often sufficient instead of a stack. Use a stack when you have multiple types that need to match specifically (like '{', '[', '(').

3. **Look for balance reset points**: The key moment to act is when your balance counter returns to 0—this marks the end of a balanced segment. Many problems build on this insight.

Related problems: [Split Strings by Separator](/problem/split-strings-by-separator)
