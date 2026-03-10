---
title: "How to Solve Generate a String With Characters That Have Odd Counts — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Generate a String With Characters That Have Odd Counts. Easy difficulty, 78.5% acceptance rate. Topics: String."
date: "2027-03-25"
category: "dsa-patterns"
tags: ["generate-a-string-with-characters-that-have-odd-counts", "string", "easy"]
---

# How to Solve "Generate a String With Characters That Have Odd Counts"

This problem asks us to generate a string of length `n` where every character appears an odd number of times. While it seems simple at first glance, the interesting part is recognizing that we don't need to overcomplicate it — there's a clean mathematical insight that leads to an elegant solution. The challenge is realizing that we can satisfy the constraints with just one or two different characters, regardless of how large `n` is.

## Visual Walkthrough

Let's walk through some examples to build intuition:

**Example 1: n = 4**
We need a 4-character string where each character appears an odd number of times. Let's try building it:

- If we use only 'a': "aaaa" → 'a' appears 4 times (even) ❌
- If we use 'a' and 'b': "aaa" + "b" = "aaab" → 'a' appears 3 times (odd), 'b' appears 1 time (odd) ✅
  So "aaab" works. "abbb" would also work.

**Example 2: n = 7**

- If n is odd: "aaaaaaa" → 'a' appears 7 times (odd) ✅
- Or we could use: "aaaaaab" → 'a' appears 6 times (even), 'b' appears 1 time (odd) ❌
- Better: "aaaaabb" → 'a' appears 5 times (odd), 'b' appears 2 times (even) ❌
- Actually, with odd n, just use one character!

**The pattern emerges:**

- If n is odd: Use a single character repeated n times
- If n is even: Use one character (n-1) times (odd count) and a different character 1 time (odd count)

Let's verify with n = 6 (even):

- Use 'a' 5 times and 'b' 1 time: "aaaaab" → 'a': 5 (odd), 'b': 1 (odd) ✅

## Brute Force Approach

A naive approach might try to generate all possible strings of length n and check if each character appears an odd number of times. For each position, we could choose from 26 letters, giving us 26^n possibilities to check — clearly infeasible even for moderate n.

Another brute force idea: try all combinations of character frequencies that sum to n where each frequency is odd. We'd need to consider all partitions of n into odd numbers, then assign letters to those frequencies. This is still exponential in complexity and completely unnecessary.

The key insight is that we don't need to search — we can construct the answer directly using the simple parity observation from our visual walkthrough.

## Optimal Solution

The optimal solution leverages the observation about odd and even n:

- If n is odd: Return a string of n copies of the same character (e.g., 'a')
- If n is even: Return (n-1) copies of 'a' followed by one 'b'

Why does this work?

1. When n is odd, using one character means that character appears n times (odd)
2. When n is even, n-1 is odd, so 'a' appears an odd number of times, and 'b' appears once (odd)

<div class="code-group">

```python
# Time: O(n) - we build a string of length n
# Space: O(n) - for the output string
def generateTheString(n: int) -> str:
    # If n is odd, we can use a single character repeated n times
    if n % 2 == 1:
        # 'a' repeated n times gives us n occurrences of 'a' (odd)
        return 'a' * n
    else:
        # n is even: use 'a' (n-1) times (odd count) and 'b' once (odd count)
        # n-1 is odd since n is even
        return 'a' * (n - 1) + 'b'
```

```javascript
// Time: O(n) - we build a string of length n
// Space: O(n) - for the output string
function generateTheString(n) {
  // If n is odd, we can use a single character repeated n times
  if (n % 2 === 1) {
    // 'a' repeated n times gives us n occurrences of 'a' (odd)
    return "a".repeat(n);
  } else {
    // n is even: use 'a' (n-1) times (odd count) and 'b' once (odd count)
    // n-1 is odd since n is even
    return "a".repeat(n - 1) + "b";
  }
}
```

```java
// Time: O(n) - we build a string of length n
// Space: O(n) - for the output string
class Solution {
    public String generateTheString(int n) {
        // StringBuilder is more efficient than string concatenation in Java
        StringBuilder result = new StringBuilder();

        // If n is odd, we can use a single character repeated n times
        if (n % 2 == 1) {
            // 'a' repeated n times gives us n occurrences of 'a' (odd)
            for (int i = 0; i < n; i++) {
                result.append('a');
            }
        } else {
            // n is even: use 'a' (n-1) times (odd count) and 'b' once (odd count)
            // n-1 is odd since n is even
            for (int i = 0; i < n - 1; i++) {
                result.append('a');
            }
            result.append('b');
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We need to construct a string of length n, which requires O(n) operations
- The parity check (n % 2) is O(1)
- String construction (repeating characters) takes O(n) time

**Space Complexity: O(n)**

- We need to store the output string of length n
- No additional data structures are used
- In Python/JavaScript, the string repetition creates a new string of size n
- In Java, StringBuilder uses O(n) space for the result

## Common Mistakes

1. **Overcomplicating with multiple characters**: Some candidates try to use many different characters or create complex distributions. Remember: the problem says "return any" valid string, so the simplest solution is best.

2. **Forgetting the even case needs two characters**: When n is even, you can't use just one character because an even number of repetitions would mean that character appears an even number of times. You need at least two different characters.

3. **Off-by-one errors in the even case**: When n is even, using n copies of 'a' would be wrong (even count). Using (n-1) copies of 'a' gives an odd count, and adding one 'b' gives another odd count.

4. **Using inefficient string concatenation**: In Java, using `String` concatenation in a loop would be O(n²) due to string immutability. Always use `StringBuilder` for building strings character by character.

## When You'll See This Pattern

This problem teaches **parity-based construction** — solving problems by considering odd/even cases separately. You'll see similar patterns in:

1. **1404. Number of Steps to Reduce a Number in Binary Representation to One** - Different operations based on whether the number is odd or even
2. **397. Integer Replacement** - Different replacement strategies based on n's parity
3. **1523. Count Odd Numbers in an Interval Range** - Directly about counting odd numbers between bounds
4. **1013. Partition Array Into Three Parts With Equal Sum** - Checking if sum is divisible by 3 (similar parity thinking)

The core technique is recognizing that problems with constraints involving "odd" or "even" often have different optimal strategies for odd vs even inputs.

## Key Takeaways

1. **Parity matters**: When a problem involves odd/even constraints, always consider odd and even cases separately — they often require different approaches.

2. **Simplest solution is often best**: Don't overcomplicate! The problem says "return any" valid answer, so find the simplest construction that satisfies the constraints.

3. **Mathematical insight beats brute force**: Instead of searching for a solution, use mathematical reasoning (n odd → one character; n even → two characters) to construct it directly.

[Practice this problem on CodeJeet](/problem/generate-a-string-with-characters-that-have-odd-counts)
