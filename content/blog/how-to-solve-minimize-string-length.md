---
title: "How to Solve Minimize String Length — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Minimize String Length. Easy difficulty, 78.9% acceptance rate. Topics: Hash Table, String."
date: "2027-11-24"
category: "dsa-patterns"
tags: ["minimize-string-length", "hash-table", "string", "easy"]
---

# How to Solve Minimize String Length

At first glance, this problem seems like it might require complex string manipulation with multiple operations. However, the key insight is understanding what these operations actually allow us to do. You're given a string `s` and two operations: you can delete the closest occurrence of a character to the left of your chosen position, or delete the closest occurrence to the right. The question asks for the **minimum possible length** of the string after performing any number of these operations.

What makes this problem interesting is that it's not about actually performing the operations step-by-step, but rather understanding what these operations fundamentally allow. Let's build intuition before jumping to code.

## Visual Walkthrough

Let's trace through an example: `s = "aaabc"`

**Step 1:** Consider character 'a' at position 0 (index 0). Can we delete anything? There's no 'a' to the left of position 0, so operation 1 doesn't apply. There IS an 'a' to the right at position 1, so we could use operation 2 to delete the 'a' at position 1.

**Step 2:** After deleting position 1, we have `"aabc"`. Now consider the 'a' at position 0 again. There's still an 'a' to the right at position 1 (the original position 2), so we can delete that too.

**Step 3:** After deleting that 'a', we have `"abc"`. Now we have one 'a', one 'b', and one 'c'. Can we delete anything else?

- For 'a' at position 0: No other 'a' to left or right
- For 'b' at position 1: No other 'b' to left or right
- For 'c' at position 2: No other 'c' to left or right

We're stuck! The minimum length is 3.

Wait, let's think differently. What if we started with the last 'a' at position 2 (in the original string)? From position 2, we could delete the 'a' at position 1 to the left using operation 1. Then from position 1 (now an 'a' after deletion), we could delete the 'a' at position 0. We'd still end up with `"abc"` and length 3.

**Key observation:** These operations let us delete any duplicate of a character as long as there's at least one occurrence of that character remaining. In other words, for each distinct character, we can delete all but one occurrence. The remaining character acts as an "anchor" that lets us delete all other occurrences of that character.

Let's test with another example: `s = "cabaabac"`

- Character 'c': appears at positions 0 and 7 → can delete one, keep one
- Character 'a': appears at positions 1, 3, 4, 6 → can delete three, keep one
- Character 'b': appears at positions 2, 5 → can delete one, keep one

Minimum length = 1 (for 'c') + 1 (for 'a') + 1 (for 'b') = 3

The pattern emerges: **The minimum possible length equals the number of distinct characters in the string.**

## Brute Force Approach

A naive approach might try to simulate all possible sequences of operations. For each position `i`, we could:

1. Find the closest occurrence of `s[i]` to the left (if any) and delete it
2. Find the closest occurrence of `s[i]` to the right (if any) and delete it
3. Try all possible orders of operations

This approach has several problems:

1. The number of possible operation sequences grows exponentially with string length
2. After each deletion, indices change, making tracking complex
3. We'd need to explore all possibilities to find the minimum, which is computationally infeasible for longer strings

Even a simpler brute force that tries to delete duplicates systematically would be O(n²) time as we repeatedly search for duplicates and shift elements after deletions. For n up to 100 (typical LeetCode constraints), O(n²) might pass, but there's a much cleaner O(n) solution.

## Optimal Solution

The optimal solution relies on the key insight we discovered: each operation allows us to delete duplicates of a character while keeping at least one occurrence. Therefore, the minimum possible length is simply the number of distinct characters in the string.

We can implement this by using a set to track unique characters. The time complexity is O(n) and space complexity is O(k) where k is the number of distinct characters (at most 26 for lowercase English letters, or 256 for ASCII).

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(k) where k is the number of distinct characters (max 26 for lowercase letters)
def minimizedStringLength(s: str) -> int:
    """
    Returns the minimum possible length of the string after performing
    any number of the allowed operations.

    The key insight: For each character, we can delete all but one occurrence
    using the given operations. Therefore, the minimum length equals
    the number of distinct characters in the string.

    Args:
        s: Input string

    Returns:
        Minimum possible length after operations
    """
    # Use a set to store unique characters
    # Each character in the set represents one character that must remain
    unique_chars = set()

    # Iterate through each character in the string
    for char in s:
        # Add the character to the set
        # Sets automatically handle duplicates - adding an existing character
        # doesn't change the set
        unique_chars.add(char)

    # The size of the set is the number of distinct characters,
    # which equals the minimum possible length
    return len(unique_chars)
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(k) where k is the number of distinct characters (max 26 for lowercase letters)
/**
 * Returns the minimum possible length of the string after performing
 * any number of the allowed operations.
 *
 * The key insight: For each character, we can delete all but one occurrence
 * using the given operations. Therefore, the minimum length equals
 * the number of distinct characters in the string.
 *
 * @param {string} s - Input string
 * @return {number} Minimum possible length after operations
 */
function minimizedStringLength(s) {
  // Use a Set to store unique characters
  // Each character in the Set represents one character that must remain
  const uniqueChars = new Set();

  // Iterate through each character in the string
  for (let i = 0; i < s.length; i++) {
    // Add the character to the Set
    // Sets automatically handle duplicates - adding an existing character
    // doesn't change the Set
    uniqueChars.add(s[i]);
  }

  // The size of the Set is the number of distinct characters,
  // which equals the minimum possible length
  return uniqueChars.size;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(k) where k is the number of distinct characters (max 26 for lowercase letters)
class Solution {
    /**
     * Returns the minimum possible length of the string after performing
     * any number of the allowed operations.
     *
     * The key insight: For each character, we can delete all but one occurrence
     * using the given operations. Therefore, the minimum length equals
     * the number of distinct characters in the string.
     *
     * @param s Input string
     * @return Minimum possible length after operations
     */
    public int minimizedStringLength(String s) {
        // Use a HashSet to store unique characters
        // Each character in the HashSet represents one character that must remain
        Set<Character> uniqueChars = new HashSet<>();

        // Iterate through each character in the string
        for (int i = 0; i < s.length(); i++) {
            // Add the character to the HashSet
            // HashSets automatically handle duplicates - adding an existing character
            // doesn't change the HashSet
            uniqueChars.add(s.charAt(i));
        }

        // The size of the HashSet is the number of distinct characters,
        // which equals the minimum possible length
        return uniqueChars.size();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing O(1) operations (set insertion) for each of the n characters
- Set insertion is O(1) on average for hash-based sets (Python set, JavaScript Set, Java HashSet)

**Space Complexity: O(k)** where k is the number of distinct characters

- In the worst case, all characters are distinct, so k = n → O(n)
- For the common constraint of lowercase English letters only, k ≤ 26 → O(1)
- For ASCII strings, k ≤ 256 → O(1) constant space
- The space is used by the set to track unique characters

## Common Mistakes

1. **Overcomplicating with simulation**: Candidates often try to actually simulate the deletion operations, which leads to complex index management and O(n²) time. Remember: interview problems often have a simple insight that makes simulation unnecessary.

2. **Misunderstanding the operations**: Some candidates think you can only delete adjacent duplicates. Read carefully: the operations delete the "closest occurrence" which could be anywhere to the left or right, not necessarily adjacent.

3. **Forgetting about character case**: While the problem examples use lowercase letters, the actual constraints might allow uppercase or other characters. Our set-based solution handles any character type correctly.

4. **Not considering all duplicates**: A subtle mistake is thinking you need to keep the first occurrence of each character. Actually, you can keep ANY occurrence and delete the others. The set approach elegantly handles this by not caring which specific occurrence remains.

## When You'll See This Pattern

This problem teaches the pattern of **"minimum after removal operations"** where the key is recognizing what the operations fundamentally allow rather than simulating them. Similar patterns appear in:

1. **Remove All Adjacent Duplicates In String (Easy)**: Here you can only remove adjacent duplicates, so the solution requires actual simulation with a stack. Contrast with our problem where you can remove non-adjacent duplicates.

2. **Remove All Adjacent Duplicates in String II (Medium)**: A variation where you remove duplicates only when you have k consecutive identical characters. Again requires simulation with tracking counts.

3. **Minimum Deletions to Make Character Frequencies Unique (Medium)**: While different in specifics, it shares the theme of minimizing something (deletions) to achieve a property (unique frequencies).

The key difference: our problem has operations that allow deleting ANY duplicate (not just adjacent ones), which leads to the simple set-based solution.

## Key Takeaways

1. **Read operations carefully**: The specific wording of operations determines whether you need simulation or a mathematical insight. When operations allow affecting non-adjacent elements, look for pattern-based solutions.

2. **Sets are perfect for tracking uniqueness**: When a problem involves distinct elements or removing duplicates, sets should be your first consideration.

3. **Sometimes the answer is simpler than the process**: You don't always need to simulate the process described in the problem. Look for invariants or properties that give you the answer directly.

**Related problems**: [Remove All Adjacent Duplicates In String](/problem/remove-all-adjacent-duplicates-in-string), [Remove All Adjacent Duplicates in String II](/problem/remove-all-adjacent-duplicates-in-string-ii)
