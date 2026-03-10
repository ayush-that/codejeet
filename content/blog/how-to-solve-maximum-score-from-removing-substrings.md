---
title: "How to Solve Maximum Score From Removing Substrings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Maximum Score From Removing Substrings. Medium difficulty, 66.6% acceptance rate. Topics: String, Stack, Greedy."
date: "2028-05-29"
category: "dsa-patterns"
tags: ["maximum-score-from-removing-substrings", "string", "stack", "greedy", "medium"]
---

# How to Solve Maximum Score From Removing Substrings

This problem asks us to maximize points by repeatedly removing either "ab" or "ba" substrings from a string. What makes it tricky is that the order of removals matters — removing one substring can create new opportunities for the other type, and the point values (x and y) determine which removals we should prioritize.

## Visual Walkthrough

Let's trace through an example: `s = "aabbaaxybbaabb"`, `x = 5`, `y = 4`.

**Key Insight:** Since we can perform operations any number of times, we want to maximize our score. If `x > y`, we should prioritize removing "ab" substrings first, then clean up remaining "ba" substrings. If `y > x`, we do the opposite.

For our example, `x=5 > y=4`, so we prioritize "ab" removals:

1. **First pass (remove "ab"):** `"aabbaaxybbaabb"` → `"aaxybbaabb"` (removed "ab" at positions 1-2)
   - Score: 5 points
   - Now we have: `"aaxybbaabb"`

2. **Continue removing "ab":** `"aaxybbaabb"` → `"aaxybbab"` (removed "ab" at positions 7-8)
   - Score: +5 = 10 points
   - Now we have: `"aaxybbab"`

3. **Continue removing "ab":** `"aaxybbab"` → `"aaxybb"` (removed "ab" at positions 6-7)
   - Score: +5 = 15 points
   - Now we have: `"aaxybb"`

No more "ab" substrings remain. Now we remove "ba" substrings:

4. **Second pass (remove "ba"):** `"aaxybb"` → `"aaxyb"` (removed "ba" at positions 4-5)
   - Score: +4 = 19 points
   - Now we have: `"aaxyb"`

No more "ba" substrings remain. Final score: 19 points.

But wait — is this optimal? Let's check if removing "ba" first would give a better score:

1. **Remove "ba" first:** `"aabbaaxybbaabb"` → `"aabaaxybbaabb"` (removed "ba" at positions 3-4)
   - Score: 4 points
   - Now we have: `"aabaaxybbaabb"`

2. **Continue removing "ba":** `"aabaaxybbaabb"` → `"aaaxybbaabb"` (removed "ba" at positions 2-3)
   - Score: +4 = 8 points
   - Now we have: `"aaaxybbaabb"`

3. **Continue removing "ba":** `"aaaxybbaabb"` → `"aaaxybabb"` (removed "ba" at positions 5-6)
   - Score: +4 = 12 points
   - Now we have: `"aaaxybabb"`

4. **Continue removing "ba":** `"aaaxybabb"` → `"aaaxybb"` (removed "ba" at positions 6-7)
   - Score: +4 = 16 points
   - Now we have: `"aaaxybb"`

5. **Now remove "ab":** `"aaaxybb"` → `"aaaxyb"` (removed "ab" at positions 4-5)
   - Score: +5 = 21 points
   - Now we have: `"aaaxyb"`

Final score: 21 points — better than 19! This shows why we need to be careful: even though "ab" gives more points individually, removing "ba" first can create more "ab" opportunities.

## Brute Force Approach

A naive approach would be to try all possible sequences of removals using recursion or BFS. At each step, we could:

1. Find all occurrences of "ab" and "ba"
2. Try removing each one
3. Recurse on the resulting string

This leads to exponential time complexity — O(2^n) where n is the string length — which is completely impractical for strings up to length 10^5.

Even a greedy approach that always removes the highest-value substring first (without considering future opportunities) fails, as our example showed. We need a smarter approach.

## Optimized Approach

The key insight is that we can process the string **twice** using a stack:

1. **First pass:** Remove all occurrences of the higher-value substring type
2. **Second pass:** Remove all occurrences of the lower-value substring type from what remains

But there's a subtlety: when removing the higher-value substring, we might create new opportunities for the lower-value substring in the second pass. However, we don't need to worry about this because:

- If we prioritize "ab" (when x > y), any "ba" substrings we create will be handled in the second pass
- If we prioritize "ba" (when y > x), any "ab" substrings we create will be handled in the second pass

The stack helps us efficiently find and remove substrings in a single pass. For example, when looking for "ab":

- Push characters onto the stack
- If the top of stack is 'a' and current character is 'b', pop 'a' and count it as a removal
- Otherwise, push the current character

This works because we process characters left to right, and the stack lets us check the most recent character efficiently.

## Optimal Solution

Here's the complete solution using a two-pass stack approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def maximumGain(s: str, x: int, y: int) -> int:
    """
    Calculate maximum score by removing "ab" and "ba" substrings.

    Strategy:
    1. Determine which substring gives higher points
    2. Remove all occurrences of higher-point substring first
    3. Remove all occurrences of lower-point substring from remaining string
    4. Use stack for efficient substring removal in O(n) time
    """

    def remove_substring(s: str, first_char: str, second_char: str) -> tuple:
        """
        Remove all occurrences of first_char+second_char from s using stack.
        Returns: (result_string, count_of_removals)
        """
        stack = []
        count = 0

        for char in s:
            # Check if we can form the target substring
            if stack and stack[-1] == first_char and char == second_char:
                stack.pop()  # Remove the first character from stack
                count += 1   # Count this removal
            else:
                stack.append(char)  # Add current character to stack

        # Convert stack back to string
        result = ''.join(stack)
        return result, count

    total_score = 0

    # Case 1: "ab" gives more points, remove it first
    if x >= y:
        # First pass: remove all "ab" substrings
        remaining, ab_count = remove_substring(s, 'a', 'b')
        total_score += ab_count * x

        # Second pass: remove all "ba" substrings from remaining string
        _, ba_count = remove_substring(remaining, 'b', 'a')
        total_score += ba_count * y
    # Case 2: "ba" gives more points, remove it first
    else:
        # First pass: remove all "ba" substrings
        remaining, ba_count = remove_substring(s, 'b', 'a')
        total_score += ba_count * y

        # Second pass: remove all "ab" substrings from remaining string
        _, ab_count = remove_substring(remaining, 'a', 'b')
        total_score += ab_count * x

    return total_score
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Calculate maximum score by removing "ab" and "ba" substrings.
 *
 * Strategy:
 * 1. Determine which substring gives higher points
 * 2. Remove all occurrences of higher-point substring first
 * 3. Remove all occurrences of lower-point substring from remaining string
 * 4. Use stack for efficient substring removal in O(n) time
 */
function maximumGain(s, x, y) {
  /**
   * Remove all occurrences of firstChar+secondChar from str using stack.
   * Returns: {result: string, count: number}
   */
  function removeSubstring(str, firstChar, secondChar) {
    const stack = [];
    let count = 0;

    for (let char of str) {
      // Check if we can form the target substring
      if (stack.length > 0 && stack[stack.length - 1] === firstChar && char === secondChar) {
        stack.pop(); // Remove the first character from stack
        count++; // Count this removal
      } else {
        stack.push(char); // Add current character to stack
      }
    }

    // Convert stack back to string
    const result = stack.join("");
    return { result, count };
  }

  let totalScore = 0;

  // Case 1: "ab" gives more points, remove it first
  if (x >= y) {
    // First pass: remove all "ab" substrings
    const { result: remaining1, count: abCount } = removeSubstring(s, "a", "b");
    totalScore += abCount * x;

    // Second pass: remove all "ba" substrings from remaining string
    const { count: baCount } = removeSubstring(remaining1, "b", "a");
    totalScore += baCount * y;
  }
  // Case 2: "ba" gives more points, remove it first
  else {
    // First pass: remove all "ba" substrings
    const { result: remaining2, count: baCount } = removeSubstring(s, "b", "a");
    totalScore += baCount * y;

    // Second pass: remove all "ab" substrings from remaining string
    const { count: abCount } = removeSubstring(remaining2, "a", "b");
    totalScore += abCount * x;
  }

  return totalScore;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    /**
     * Calculate maximum score by removing "ab" and "ba" substrings.
     *
     * Strategy:
     * 1. Determine which substring gives higher points
     * 2. Remove all occurrences of higher-point substring first
     * 3. Remove all occurrences of lower-point substring from remaining string
     * 4. Use stack for efficient substring removal in O(n) time
     */
    public int maximumGain(String s, int x, int y) {
        // Helper class to return both result string and count
        class RemovalResult {
            String result;
            int count;
            RemovalResult(String r, int c) {
                result = r;
                count = c;
            }
        }

        /**
         * Remove all occurrences of firstChar+secondChar from str using stack.
         * Returns: RemovalResult with result string and count of removals
         */
        RemovalResult removeSubstring(String str, char firstChar, char secondChar) {
            Stack<Character> stack = new Stack<>();
            int count = 0;

            for (char c : str.toCharArray()) {
                // Check if we can form the target substring
                if (!stack.isEmpty() &&
                    stack.peek() == firstChar &&
                    c == secondChar) {
                    stack.pop();  // Remove the first character from stack
                    count++;      // Count this removal
                } else {
                    stack.push(c);  // Add current character to stack
                }
            }

            // Convert stack back to string
            StringBuilder sb = new StringBuilder();
            for (char c : stack) {
                sb.append(c);
            }

            return new RemovalResult(sb.toString(), count);
        }

        int totalScore = 0;

        // Case 1: "ab" gives more points, remove it first
        if (x >= y) {
            // First pass: remove all "ab" substrings
            RemovalResult res1 = removeSubstring(s, 'a', 'b');
            totalScore += res1.count * x;

            // Second pass: remove all "ba" substrings from remaining string
            RemovalResult res2 = removeSubstring(res1.result, 'b', 'a');
            totalScore += res2.count * y;
        }
        // Case 2: "ba" gives more points, remove it first
        else {
            // First pass: remove all "ba" substrings
            RemovalResult res1 = removeSubstring(s, 'b', 'a');
            totalScore += res1.count * y;

            // Second pass: remove all "ab" substrings from remaining string
            RemovalResult res2 = removeSubstring(res1.result, 'a', 'b');
            totalScore += res2.count * x;
        }

        return totalScore;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We make two passes through the string (or parts of it)
- Each pass processes each character exactly once
- Stack operations (push/pop) are O(1) each

**Space Complexity:** O(n)

- In the worst case, the stack might contain all characters (when no removals are possible)
- The result string after first pass could be up to n characters

## Common Mistakes

1. **Trying to interleave removals:** Some candidates try to alternate between removing "ab" and "ba" based on local optimizations. This doesn't work because you can't know if removing one type now will create more opportunities for the other type later. The two-pass approach is provably optimal.

2. **Forgetting to handle equal point values:** When x == y, the order doesn't matter mathematically, but you still need to handle it correctly in code. Our solution handles this with `x >= y` check.

3. **Inefficient substring searching:** Using string search and replace in a loop (like `while("ab" in s): s = s.replace("ab", "", 1)`) is O(n²) in the worst case. The stack approach is necessary for O(n) time.

4. **Not considering all characters:** The string can contain characters other than 'a' and 'b'. The stack approach handles this naturally — non-'a'/non-'b' characters just get pushed onto the stack and don't participate in removals.

## When You'll See This Pattern

This "stack-based substring removal" pattern appears in several string processing problems:

1. **Remove All Adjacent Duplicates In String (LeetCode 1047):** Similar concept of removing adjacent pairs, though here it's identical characters rather than specific pairs.

2. **Minimum Remove to Make Valid Parentheses (LeetCode 1249):** Uses a stack to track and remove unmatched parentheses.

3. **Make The String Great (LeetCode 1544):** Remove adjacent characters that are the same letter but different cases (e.g., "aA").

The common theme is using a stack to efficiently process and remove patterns as we scan left to right, avoiding the need to repeatedly search the entire string.

## Key Takeaways

1. **When order of operations matters but you have only two types,** process the higher-value type first, then the lower-value type. This greedy approach works because any opportunities created for the second type will be captured in the second pass.

2. **Stacks are perfect for matching and removing patterns** in a single pass when you need to check the most recent element. Think "stack" when you see problems about removing adjacent characters or matching pairs.

3. **Don't overcomplicate with recursion or BFS** when a simpler two-pass approach exists. If you can prove that processing in a specific order yields the optimal result, implement that directly.

Related problems: [Count Words Obtained After Adding a Letter](/problem/count-words-obtained-after-adding-a-letter)
