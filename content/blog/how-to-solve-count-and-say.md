---
title: "How to Solve Count and Say — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Count and Say. Medium difficulty, 62.3% acceptance rate. Topics: String."
date: "2026-07-29"
category: "dsa-patterns"
tags: ["count-and-say", "string", "medium"]
---

# How to Solve Count and Say

The "Count and Say" problem asks you to generate the nth term in a sequence where each term describes the previous term using run-length encoding. While the concept is straightforward, the challenge lies in implementing the recursive/iterative generation correctly and handling string building efficiently. What makes this problem interesting is that it's essentially a self-referential sequence—each term describes the digits of the previous term, creating a pattern that's simple to understand but requires careful implementation.

## Visual Walkthrough

Let's trace through the first few terms to understand exactly how the sequence works:

- **countAndSay(1) = "1"** (Base case)
- **countAndSay(2)**: We look at the previous term "1" and describe it: "one 1" → "11"
- **countAndSay(3)**: We look at "11" and describe it: "two 1s" → "21"
- **countAndSay(4)**: We look at "21" and describe it: "one 2, one 1" → "1211"
- **countAndSay(5)**: We look at "1211" and describe it: "one 1, one 2, two 1s" → "111221"
- **countAndSay(6)**: We look at "111221" and describe it: "three 1s, two 2s, one 1" → "312211"

The pattern is clear: for each term, we scan the previous term from left to right, count consecutive identical digits, and append "count" followed by "digit" to our result string. This is classic run-length encoding.

## Brute Force Approach

There's really only one reasonable approach to this problem—iteratively building each term from the previous one. However, a "brute force" way to think about it would be to generate all terms from 1 to n each time we need a term, which is what we'll do anyway. The inefficiency would come from poor implementation choices like:

1. Using string concatenation in a loop without StringBuilder (in Java/JavaScript) or list joining (in Python)
2. Not reusing previous computations (though the problem naturally requires computing all previous terms)
3. Overly complex logic for counting runs

The key insight is that we must compute each term sequentially—we can't jump directly to the nth term without computing all intermediate terms. So our solution will be O(n \* m) where m is the length of the strings we're processing.

## Optimized Approach

The optimal approach follows directly from the problem definition:

1. Start with the base case "1" for n = 1
2. For each i from 2 to n:
   - Take the previous term
   - Scan through it, counting consecutive identical digits
   - Build the new term by appending "count" then "digit" for each run
3. Return the nth term

The optimization comes from using efficient string building:

- In Python: Build a list of strings and join at the end
- In JavaScript: Use an array and join
- In Java: Use StringBuilder

This avoids the O(k²) time complexity that would come from repeated string concatenation in a loop.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * m) where n is the input and m is the average length of strings
# Space: O(m) for storing the current term
def countAndSay(n: int) -> str:
    # Start with the base case
    current = "1"

    # Generate terms from 2 to n
    for _ in range(1, n):
        next_term = []
        i = 0

        # Scan through the current term
        while i < len(current):
            # Count consecutive identical digits
            count = 1
            # Move forward while we see the same digit
            while i + 1 < len(current) and current[i] == current[i + 1]:
                count += 1
                i += 1

            # Append the count and the digit to the next term
            next_term.append(str(count))
            next_term.append(current[i])

            # Move to the next digit (or group of digits)
            i += 1

        # Join the list into a string for the next iteration
        current = "".join(next_term)

    return current
```

```javascript
// Time: O(n * m) where n is the input and m is the average length of strings
// Space: O(m) for storing the current term
function countAndSay(n) {
  // Start with the base case
  let current = "1";

  // Generate terms from 2 to n
  for (let iteration = 1; iteration < n; iteration++) {
    const parts = [];
    let i = 0;

    // Scan through the current term
    while (i < current.length) {
      // Count consecutive identical digits
      let count = 1;
      // Move forward while we see the same digit
      while (i + 1 < current.length && current[i] === current[i + 1]) {
        count++;
        i++;
      }

      // Append the count and the digit to the next term
      parts.push(count.toString());
      parts.push(current[i]);

      // Move to the next digit (or group of digits)
      i++;
    }

    // Join the array into a string for the next iteration
    current = parts.join("");
  }

  return current;
}
```

```java
// Time: O(n * m) where n is the input and m is the average length of strings
// Space: O(m) for storing the current term
public String countAndSay(int n) {
    // Start with the base case
    String current = "1";

    // Generate terms from 2 to n
    for (int iteration = 1; iteration < n; iteration++) {
        StringBuilder nextTerm = new StringBuilder();
        int i = 0;

        // Scan through the current term
        while (i < current.length()) {
            // Count consecutive identical digits
            int count = 1;
            // Move forward while we see the same digit
            while (i + 1 < current.length() && current.charAt(i) == current.charAt(i + 1)) {
                count++;
                i++;
            }

            // Append the count and the digit to the next term
            nextTerm.append(count);
            nextTerm.append(current.charAt(i));

            // Move to the next digit (or group of digits)
            i++;
        }

        // Convert StringBuilder to String for the next iteration
        current = nextTerm.toString();
    }

    return current;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m)**

- We need to generate n terms
- For each term, we scan through the entire previous term of length m
- The length m grows with each iteration (approximately by a factor of ~1.3), so m is not constant
- In practice, this is O(n × m) where m is the length of the final string

**Space Complexity: O(m)**

- We need to store the current term which has length m
- We also need temporary storage for building the next term (also O(m))
- The recursive call stack if using recursion would be O(n), but our iterative solution uses O(1) extra space beyond the string storage

## Common Mistakes

1. **Off-by-one errors in the loop conditions**: When checking `current[i] == current[i + 1]`, forgetting to also check `i + 1 < len(current)` will cause index out of bounds errors. Always check array bounds before accessing.

2. **Inefficient string concatenation**: Using `+=` in a loop in Java or JavaScript creates a new string each time, leading to O(k²) time complexity. Always use StringBuilder (Java) or array joining (JavaScript/Python).

3. **Forgetting to reset or update indices correctly**: After counting a run of digits, you need to move `i` to the next unprocessed digit. A common mistake is to increment `i` too much or too little in the inner while loop.

4. **Not handling the base case properly**: For n = 1, we should return "1" immediately. Some implementations might enter the loop incorrectly and return an empty string or wrong value.

## When You'll See This Pattern

This problem teaches **run-length encoding (RLE)**, a simple compression technique that's useful in several contexts:

1. **String Compression** (LeetCode 443): Similar concept of compressing a character array by counting consecutive characters.
2. **Encode and Decode Strings** (LeetCode 271): While not exactly RLE, it involves encoding strings with length prefixes, which is a related concept.
3. **Image processing**: RLE is used in simple image formats like BMP for compression.
4. **Consecutive character problems**: Any problem that involves counting or grouping consecutive identical elements uses similar logic.

The pattern of "scan and count runs" appears whenever you need to process consecutive identical elements efficiently.

## Key Takeaways

1. **Run-length encoding is a two-step process**: First count consecutive identical elements, then output the count followed by the element. This pattern is worth memorizing.

2. **String building optimization matters**: In interview settings, always use the language's efficient string building tools (StringBuilder in Java, array joining in JavaScript/Python) when building strings in loops.

3. **Edge cases are in the indices**: The tricky part of RLE is managing the loop indices correctly—ensuring you don't go out of bounds and that you advance to the next unprocessed element.

4. **Some problems require sequential computation**: You can't always jump to the answer; sometimes you need to compute intermediate results. Recognize when this is necessary and implement it cleanly.

Related problems: [Encode and Decode Strings](/problem/encode-and-decode-strings), [String Compression](/problem/string-compression)
