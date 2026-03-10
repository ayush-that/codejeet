---
title: "How to Solve Check if All A's Appears Before All B's — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Check if All A's Appears Before All B's. Easy difficulty, 73.1% acceptance rate. Topics: String."
date: "2027-02-02"
category: "dsa-patterns"
tags: ["check-if-all-as-appears-before-all-bs", "string", "easy"]
---

# How to Solve "Check if All A's Appears Before All B's"

This problem asks us to verify whether every occurrence of the character `'a'` comes before every occurrence of `'b'` in a given string containing only these two characters. While seemingly straightforward, this problem tests your ability to reason about ordering constraints and handle edge cases efficiently. The interesting part is that we don't need to track every position—we just need to detect if there's any violation of the "all a's before all b's" rule.

## Visual Walkthrough

Let's trace through the example `s = "aaabbb"`:

1. We start scanning from left to right: `a`, `a`, `a`, `b`, `b`, `b`
2. All `a` characters appear first, followed by all `b` characters
3. This satisfies the condition "every `a` appears before every `b`"

Now let's try `s = "abab"`:

1. First character: `a` ✓
2. Second character: `b` ✓ (so far, all a's come before this b)
3. Third character: `a` ← Here's the problem! We've already seen a `b`, but now we're seeing an `a` after it
4. This violates the rule because we found an `a` that appears after a `b`

The key insight: Once we encounter our first `b`, we should never see another `a`. If we do, the condition fails immediately.

## Brute Force Approach

A naive approach would be to find all positions of `'a'` and all positions of `'b'`, then check if the maximum `'a'` position is less than the minimum `'b'` position:

1. Find all indices where `'a'` appears
2. Find all indices where `'b'` appears
3. If either list is empty, return `true` (all characters are the same)
4. Otherwise, check if `max(a_indices) < min(b_indices)`

While this works, it requires:

- Two passes through the string to collect indices
- Additional space to store all indices
- Extra comparisons at the end

This is O(n) time and O(n) space, which is acceptable but not optimal. More importantly, it's more complex than needed. Interviewers would expect you to recognize that we can solve this with a single pass and constant space.

## Optimal Solution

The optimal approach uses a single pass through the string. We track whether we've seen a `'b'` yet. Once we see a `'b'`, if we encounter any `'a'` later in the string, we immediately return `false`. Otherwise, we return `true`.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def checkString(s: str) -> bool:
    """
    Check if all 'a's appear before all 'b's in the string.

    Approach: Scan through the string. Once we encounter a 'b',
    we set a flag. If we see any 'a' after that, return False.
    """
    seen_b = False  # Track if we've seen a 'b' yet

    # Iterate through each character in the string
    for char in s:
        if char == 'b':
            # We've encountered our first 'b'
            seen_b = True
        elif char == 'a' and seen_b:
            # We found an 'a' after seeing a 'b' - violation!
            return False

    # If we made it through without finding an 'a' after a 'b',
    # the condition is satisfied
    return True
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Check if all 'a's appear before all 'b's in the string.
 *
 * Approach: Scan through the string. Once we encounter a 'b',
 * we set a flag. If we see any 'a' after that, return false.
 */
function checkString(s) {
  let seenB = false; // Track if we've seen a 'b' yet

  // Iterate through each character in the string
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    if (char === "b") {
      // We've encountered our first 'b'
      seenB = true;
    } else if (char === "a" && seenB) {
      // We found an 'a' after seeing a 'b' - violation!
      return false;
    }
  }

  // If we made it through without finding an 'a' after a 'b',
  // the condition is satisfied
  return true;
}
```

```java
// Time: O(n) | Space: O(1)
/**
 * Check if all 'a's appear before all 'b's in the string.
 *
 * Approach: Scan through the string. Once we encounter a 'b',
 * we set a flag. If we see any 'a' after that, return false.
 */
public boolean checkString(String s) {
    boolean seenB = false;  // Track if we've seen a 'b' yet

    // Iterate through each character in the string
    for (int i = 0; i < s.length(); i++) {
        char currentChar = s.charAt(i);

        if (currentChar == 'b') {
            // We've encountered our first 'b'
            seenB = true;
        } else if (currentChar == 'a' && seenB) {
            // We found an 'a' after seeing a 'b' - violation!
            return false;
        }
    }

    // If we made it through without finding an 'a' after a 'b',
    // the condition is satisfied
    return true;
}
```

</div>

## Alternative One-Liner Solution

There's also a clever one-liner solution: we can check if the string is already sorted. Since `'a'` comes before `'b'` in lexicographical order, we just need to verify that the string equals its sorted version:

<div class="code-group">

```python
# Time: O(n log n) | Space: O(n) - due to sorting
def checkString(s: str) -> bool:
    # The string is valid if it's already in sorted order
    return s == ''.join(sorted(s))
```

```javascript
// Time: O(n log n) | Space: O(n) - due to sorting
function checkString(s) {
  // The string is valid if it's already in sorted order
  return s === s.split("").sort().join("");
}
```

```java
// Time: O(n log n) | Space: O(n) - due to sorting
public boolean checkString(String s) {
    // Convert to char array, sort it, and compare with original
    char[] chars = s.toCharArray();
    Arrays.sort(chars);
    return s.equals(new String(chars));
}
```

</div>

While elegant, this approach has O(n log n) time complexity due to sorting, making it less efficient than the single-pass O(n) solution. It's good to mention this alternative in an interview to show breadth of thinking, but you should prefer the O(n) solution.

## Complexity Analysis

**Optimal Solution (Single Pass):**

- **Time Complexity:** O(n) where n is the length of the string. We iterate through the string exactly once.
- **Space Complexity:** O(1). We only use a single boolean variable regardless of input size.

**Alternative (Sorting) Solution:**

- **Time Complexity:** O(n log n) due to the sorting operation.
- **Space Complexity:** O(n) to store the sorted string/array.

The optimal solution is clearly better for both time and space, especially for large inputs.

## Common Mistakes

1. **Not handling edge cases properly:** What if the string is empty? What if it contains only `'a'`s or only `'b'`s? Our solution handles all these cases correctly:
   - Empty string: Returns `true` (trivially satisfies the condition)
   - Only `'a'`s: Returns `true` (no `'b'`s to violate ordering)
   - Only `'b'`s: Returns `true` (no `'a'`s to violate ordering)

2. **Overcomplicating the solution:** Some candidates try to:
   - Count all `'a'`s and `'b'`s (unnecessary)
   - Find the last `'a'` and first `'b'` (requires two passes)
   - Use complex data structures like stacks or queues (overkill)

3. **Incorrect boolean logic:** The condition `char == 'a' && seen_b` is correct. Watch out for:
   - `char == 'a' || seen_b` (always returns `false` after first `'b'`)
   - `char == 'a' && !seen_b` (checks the opposite condition)

4. **Assuming input validation:** The problem states the string contains only `'a'` and `'b'`, but in a real interview, you might want to mention that you're assuming valid input. If asked, you could add a check for other characters.

## When You'll See This Pattern

This "single pass with state tracking" pattern appears in many string and array validation problems:

1. **Check if Array Is Sorted and Rotated (LeetCode 1752):** Similar concept of checking ordering constraints, though with rotation complexity.
2. **Check if Numbers Are Ascending in a Sentence (LeetCode 2042):** Extract numbers and verify they're in strictly increasing order.
3. **Valid Parentheses (LeetCode 20):** Track opening brackets and ensure they close in the correct order.
4. **Minimum Deletions to Make String Balanced (LeetCode 1653):** A harder version of this problem where you need to find the minimum deletions to achieve the "all a's before all b's" condition.

The core technique—scanning once while maintaining minimal state to validate a constraint—is fundamental to many algorithm problems.

## Key Takeaways

1. **Look for the simplest validation condition:** Instead of checking "all a's before all b's" directly, we check for the violation condition: "any a after any b." This often simplifies the logic.

2. **Single pass with state is powerful:** Many problems that seem to require multiple passes or complex data structures can be solved with a single pass and O(1) extra space by tracking just enough state.

3. **Edge cases matter:** Always test with empty strings, single-character strings, and uniform strings. These often reveal bugs in the logic.

4. **Consider alternative approaches:** Even if you have an optimal solution, mentioning alternatives (like the sorting approach) shows deeper understanding, though you should always explain why your chosen solution is better.

Related problems: [Minimum Deletions to Make String Balanced](/problem/minimum-deletions-to-make-string-balanced), [Check if Array Is Sorted and Rotated](/problem/check-if-array-is-sorted-and-rotated), [Check if Numbers Are Ascending in a Sentence](/problem/check-if-numbers-are-ascending-in-a-sentence)
