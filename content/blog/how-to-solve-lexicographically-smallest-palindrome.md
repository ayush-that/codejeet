---
title: "How to Solve Lexicographically Smallest Palindrome — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest Palindrome. Easy difficulty, 80.9% acceptance rate. Topics: Two Pointers, String, Greedy."
date: "2027-11-07"
category: "dsa-patterns"
tags: ["lexicographically-smallest-palindrome", "two-pointers", "string", "greedy", "easy"]
---

# How to Solve Lexicographically Smallest Palindrome

This problem asks us to transform a given string into a palindrome with the minimum number of character replacements, and when multiple palindromes are possible with the same minimum operations, we must return the lexicographically smallest one. What makes this problem interesting is that we need to balance two competing objectives: minimizing operations while also ensuring the result is as small alphabetically as possible.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the input string `s = "abcde"`.

**Step 1: Identify character pairs**
We need to compare characters from both ends moving toward the center:

- Position 0 ('a') vs position 4 ('e')
- Position 1 ('b') vs position 3 ('d')
- Position 2 ('c') vs itself (middle character)

**Step 2: Make each pair match with minimum operations**
For each pair, we need to make both characters equal. The key insight is that we should replace the larger character with the smaller one to minimize operations AND get a lexicographically smaller result.

- Pair 1: 'a' vs 'e' → 'e' is larger, so replace 'e' with 'a' (1 operation)
- Pair 2: 'b' vs 'd' → 'd' is larger, so replace 'd' with 'b' (1 operation)
- Pair 3: 'c' vs 'c' → already equal, no operation needed

**Step 3: Check if we can make it even smaller lexicographically**
After making the string a palindrome with minimum operations, we have `"abcba"`. But wait — we might be able to make it even smaller! Since we only replaced characters on one side, we could potentially replace both characters in a pair with an even smaller character if it doesn't increase our operation count.

Actually, let's reconsider: When we have two different characters, we must change at least one of them. Changing the larger to the smaller uses exactly 1 operation, which is minimum. But what if both characters could be changed to something even smaller? That would require 2 operations (changing both), which would increase our count. So we stick with 1 operation per mismatched pair.

**Final result:** `"abcba"` with 2 total operations.

Let's try another example: `s = "abcdc"`

- Pair 1: 'a' vs 'c' → replace 'c' with 'a' (1 op)
- Pair 2: 'b' vs 'd' → replace 'd' with 'b' (1 op)
- Pair 3: 'c' vs itself → no op

Result: `"abcba"` with 2 operations.

Wait, that's the same result! But the original string was different. This shows that with minimum operations, we might get the same palindrome from different starting strings.

## Brute Force Approach

A naive approach would be to generate all possible palindromes, count how many operations each would require, then pick the one with minimum operations, and among those with equal minimum operations, pick the lexicographically smallest.

How would this work?

1. Generate all possible palindromes of length n (26^n possibilities for each half)
2. For each palindrome, count how many characters differ from the original string
3. Track the minimum operations and corresponding palindrome

Why this fails:

- For a string of length n, there are 26^(⌈n/2⌉) possible palindromes (since we only need to choose the first half)
- Even for n=10, that's 26^5 = 11,881,376 possibilities
- The time complexity is exponential: O(26^(n/2))
- This is completely impractical for any reasonable input size

What a naive candidate might try: They might try to greedily make the string a palindrome by always replacing the right character with the left character, but then forget to check if they could make it lexicographically smaller by potentially replacing both with an even smaller character when they're already equal.

## Optimal Solution

The optimal solution uses a two-pointer approach. We start with pointers at both ends of the string and move toward the center. For each pair of characters:

1. If they're different, we must change at least one of them
2. To minimize operations, we change exactly one character
3. To get the lexicographically smallest result, we change the larger character to the smaller one
4. If they're already equal, we leave them as is

But here's the crucial insight: After making the string a palindrome with minimum operations, we might have opportunities to make it even smaller lexicographically WITHOUT increasing the operation count. Specifically, when both characters in a pair are already equal (or become equal after our initial changes), if they're not 'a', we could potentially change BOTH to 'a'. However, this would increase our operation count unless... wait, we need to be careful!

Actually, let's think this through: If two characters are already equal and not 'a', changing both to 'a' would require 2 operations. But if we're allowed to do that, we might get a lexicographically smaller result. The problem says we want the minimum number of operations. So we can't arbitrarily change characters that are already matching.

However, there's one special case: when we have a middle character (in odd-length strings) that's not 'a', we could change it to 'a' with just 1 operation. But wait, that would only help if we haven't already used an operation on that position.

The correct algorithm:

1. First pass: Make the string a palindrome with minimum operations by changing the larger of each mismatched pair to the smaller
2. Second pass: For pairs that are already matching (including after our changes), if both characters are not 'a', AND we have "free" operations available from having a middle character in odd-length strings... Actually, let me reconsider.

Actually, the clean solution is simpler: We only need to consider each pair once. When two characters differ, we must change at least one. We change the larger to the smaller. When they're equal, we do nothing. That's it! The result is already the lexicographically smallest palindrome with minimum operations.

But wait, what about this example: `s = "aacde"`? Let's trace:

- 'a' vs 'e' → change 'e' to 'a' (1 op) → "aacda"
- 'a' vs 'd' → change 'd' to 'a' (1 op) → "aacaa"
- 'c' vs itself → no change

Result: `"aacaa"`. But could we get `"aaaaa"`? That would require changing 'c' to 'a' (1 more op) for a total of 3 ops vs our 2 ops. So no, we can't.

What about when the two characters are already equal but not 'a', like in `"bb"`? We could change both to 'a' (2 ops) vs leaving as 'b' (0 ops). Since we want minimum operations, we leave it as 'b'.

So the algorithm is indeed simple: just change the larger of mismatched pairs to the smaller.

<div class="code-group">

```python
# Time: O(n) | Space: O(n) for the character array (could be O(1) if we modify in-place)
def makeSmallestPalindrome(s: str) -> str:
    # Convert string to list for mutable character operations
    chars = list(s)
    n = len(s)

    # Use two pointers: left starts at beginning, right starts at end
    left, right = 0, n - 1

    # Move pointers toward the center
    while left < right:
        # Compare characters at left and right positions
        if chars[left] != chars[right]:
            # Characters are different - we need to make them equal
            # To minimize operations and get lexicographically smallest result,
            # replace the larger character with the smaller one
            if chars[left] < chars[right]:
                # Right character is larger, replace it with left character
                chars[right] = chars[left]
            else:
                # Left character is larger, replace it with right character
                chars[left] = chars[right]
        # If characters are already equal, no change needed

        # Move pointers toward center
        left += 1
        right -= 1

    # Convert character list back to string
    return ''.join(chars)
```

```javascript
// Time: O(n) | Space: O(n) for the character array
function makeSmallestPalindrome(s) {
  // Convert string to array for mutable character operations
  const chars = s.split("");
  const n = s.length;

  // Two pointers: left starts at beginning, right starts at end
  let left = 0,
    right = n - 1;

  // Move pointers toward the center
  while (left < right) {
    // Compare characters at left and right positions
    if (chars[left] !== chars[right]) {
      // Characters are different - need to make them equal
      // Replace the larger character with the smaller one
      if (chars[left] < chars[right]) {
        // Right character is larger, replace with left character
        chars[right] = chars[left];
      } else {
        // Left character is larger, replace with right character
        chars[left] = chars[right];
      }
    }
    // If characters are already equal, no change needed

    // Move pointers toward center
    left++;
    right--;
  }

  // Convert array back to string
  return chars.join("");
}
```

```java
// Time: O(n) | Space: O(n) for the character array
class Solution {
    public String makeSmallestPalindrome(String s) {
        // Convert string to character array for mutable operations
        char[] chars = s.toCharArray();
        int n = s.length();

        // Two pointers: left starts at beginning, right starts at end
        int left = 0, right = n - 1;

        // Move pointers toward the center
        while (left < right) {
            // Compare characters at left and right positions
            if (chars[left] != chars[right]) {
                // Characters are different - need to make them equal
                // Replace the larger character with the smaller one
                if (chars[left] < chars[right]) {
                    // Right character is larger, replace with left character
                    chars[right] = chars[left];
                } else {
                    // Left character is larger, replace with right character
                    chars[left] = chars[right];
                }
            }
            // If characters are already equal, no change needed

            // Move pointers toward center
            left++;
            right--;
        }

        // Convert character array back to string
        return new String(chars);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once with two pointers
- Each iteration does constant work (character comparison and possible assignment)
- The while loop runs approximately n/2 times, which is O(n)

**Space Complexity: O(n)**

- We create a character array/list of size n to allow mutable operations
- In Python and JavaScript, strings are immutable, so we need a mutable representation
- In Java, we also use a character array
- Could be O(1) if the input was mutable, but typically strings are immutable in these languages

## Common Mistakes

1. **Forgetting to handle the middle character in odd-length strings**: Actually, in our two-pointer approach, when left < right, the middle character (if it exists) is automatically skipped because the loop stops when left >= right. For odd-length strings, the middle character is never compared with anything else, which is correct since it's already in the correct position for a palindrome.

2. **Trying to make the string lexicographically smaller after it's already a palindrome**: Some candidates think they should change pairs like "bb" to "aa" to make it smaller, but this would increase the operation count. Remember: minimum operations come first, then lexicographically smallest among those with minimum operations.

3. **Modifying both characters when they differ**: If characters are different, some candidates might change both to a third, smaller character. But this would require 2 operations vs changing just one character (1 operation). Always change only the larger character to the smaller one.

4. **Using string concatenation instead of mutable arrays**: In Python/JavaScript, doing `s = s[:i] + new_char + s[i+1:]` for each change creates a new string each time, making the solution O(n²) instead of O(n). Always convert to a mutable data structure first.

## When You'll See This Pattern

The two-pointer technique used here is common in many string and array problems:

1. **Valid Palindrome (LeetCode 125)**: Similar two-pointer approach to check if a string is a palindrome, but here we're modifying to make it one.

2. **Reverse String (LeetCode 344)**: Two pointers moving toward the center to swap characters.

3. **Valid Palindrome II (LeetCode 680)**: Check if a string can be a palindrome by removing at most one character - uses similar two-pointer logic with a chance to skip a mismatch.

The greedy aspect (always choosing the smaller character when there's a mismatch) is also common in optimization problems where you make locally optimal choices to reach a globally optimal solution.

## Key Takeaways

1. **Two-pointer technique is perfect for palindrome problems**: When you need to compare or modify symmetric positions in a string, starting from both ends and moving toward the center is often the most efficient approach.

2. **Greedy choices can solve optimization problems**: Here, the locally optimal choice (changing the larger character to the smaller one) leads to the globally optimal solution (minimum operations + lexicographically smallest).

3. **Understand the priority of constraints**: Minimum operations is the primary objective; lexicographically smallest is secondary. This affects our algorithm design - we don't make changes that would increase operation count even if they make the string smaller.

[Practice this problem on CodeJeet](/problem/lexicographically-smallest-palindrome)
