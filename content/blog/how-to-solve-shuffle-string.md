---
title: "How to Solve Shuffle String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Shuffle String. Easy difficulty, 85.4% acceptance rate. Topics: Array, String."
date: "2027-05-17"
category: "dsa-patterns"
tags: ["shuffle-string", "array", "string", "easy"]
---

# How to Solve Shuffle String

This problem asks us to reconstruct a string after its characters have been shuffled according to a given mapping. You're given a string `s` and an integer array `indices` where `indices[i]` tells you the position where character `s[i]` should end up in the final string. While this is labeled as an easy problem, it's interesting because it teaches a fundamental pattern of reordering elements according to a mapping—a technique that appears in many more complex problems.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `s = "code"`, `indices = [3,1,2,0]`

We need to figure out where each character goes:

- Character `'c'` at index 0 → goes to position `indices[0] = 3`
- Character `'o'` at index 1 → goes to position `indices[1] = 1`
- Character `'d'` at index 2 → goes to position `indices[2] = 2`
- Character `'e'` at index 3 → goes to position `indices[3] = 0`

So we're essentially told: "Put 'c' at position 3, 'o' at position 1, 'd' at position 2, and 'e' at position 0."

Let's build the result step by step:

1. Start with an empty result array: `['', '', '', '']`
2. Place 'c' at position 3: `['', '', '', 'c']`
3. Place 'o' at position 1: `['', 'o', '', 'c']`
4. Place 'd' at position 2: `['', 'o', 'd', 'c']`
5. Place 'e' at position 0: `['e', 'o', 'd', 'c']`

The final string is `"eodc"`.

Notice the pattern: we're creating a new array/string where for each index `i`, we place `s[i]` at position `indices[i]` in the result.

## Brute Force Approach

For this particular problem, there isn't really a "brute force" in the traditional sense of trying all permutations. The most straightforward approach is exactly what we visualized above: create a new array and place each character in its correct position.

However, a naive candidate might try to sort the indices and characters together, which would work but is unnecessarily complex (O(n log n) time when O(n) is possible). Another suboptimal approach would be to repeatedly search for which character belongs at each position, which would take O(n²) time.

The key insight is that we don't need to sort or search—we already have the exact mapping from the `indices` array. We just need to apply it directly.

## Optimal Solution

The optimal solution follows directly from our visual walkthrough: create a result array of the same length as the input string, then iterate through the indices array, placing each character at its designated position.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def restoreString(s, indices):
    """
    Restores the original string from shuffled characters.

    Args:
        s: The shuffled string
        indices: Array where indices[i] is the position of s[i] in the result

    Returns:
        The restored string
    """
    # Create a list of the same length as s to store the result
    # Using a list instead of string for efficient character assignment
    result = [''] * len(s)

    # Iterate through each character in the input string
    for i in range(len(s)):
        # Place character s[i] at position indices[i] in the result
        result[indices[i]] = s[i]

    # Join the list back into a string and return
    return ''.join(result)
```

```javascript
// Time: O(n) | Space: O(n)
function restoreString(s, indices) {
  /**
   * Restores the original string from shuffled characters.
   *
   * @param {string} s - The shuffled string
   * @param {number[]} indices - Array where indices[i] is the position of s[i] in the result
   * @return {string} The restored string
   */
  // Create an array of the same length as s to store the result
  // Using an array instead of string for efficient character assignment
  const result = new Array(s.length);

  // Iterate through each character in the input string
  for (let i = 0; i < s.length; i++) {
    // Place character s[i] at position indices[i] in the result
    result[indices[i]] = s[i];
  }

  // Join the array back into a string and return
  return result.join("");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String restoreString(String s, int[] indices) {
        /**
         * Restores the original string from shuffled characters.
         *
         * @param s The shuffled string
         * @param indices Array where indices[i] is the position of s.charAt(i) in the result
         * @return The restored string
         */
        // Create a character array of the same length as s to store the result
        char[] result = new char[s.length()];

        // Iterate through each character in the input string
        for (int i = 0; i < s.length(); i++) {
            // Place character s.charAt(i) at position indices[i] in the result
            result[indices[i]] = s.charAt(i);
        }

        // Convert the character array back to a string and return
        return new String(result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing constant-time operations (array access and assignment) for each character.
- The final string construction (join/concatenation) also takes O(n) time.
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We create a new array/string of length n to store the result.
- The input arrays are not modified, so we don't count them as extra space.
- Total auxiliary space: O(n)

## Common Mistakes

1. **Using string concatenation instead of array assignment**: Some candidates try to build the result string by concatenation, but strings are immutable in most languages. This would create a new string each time (O(n²) time) instead of O(n). Always use a character array/list for efficient building.

2. **Confusing source and destination indices**: The most common logical error is writing `result[i] = s[indices[i]]` instead of `result[indices[i]] = s[i]`. Remember: `indices[i]` tells you where `s[i]` should go, not which character should go at position `i`.

3. **Not handling empty input**: While the problem guarantees `s` and `indices` have the same length, they could be empty. Our solution handles this correctly since an empty loop creates an empty result.

4. **Assuming indices are sorted or in range**: The problem guarantees indices are a permutation of [0, n-1], so we don't need to validate. In a real interview, it's good to mention this assumption.

## When You'll See This Pattern

This "reorder according to mapping" pattern appears in many problems:

1. **Sort Colors (LeetCode 75)**: While different in implementation, it uses a similar idea of placing elements in specific positions based on their values.

2. **Rearrange Array Elements by Sign (LeetCode 2149)**: You need to place positive and negative numbers in alternating positions, which requires tracking separate indices for each type.

3. **Set Matrix Zeroes (LeetCode 73)**: The optimal O(1) space solution uses the first row and column as markers, similar to using indices to track where zeros should be.

4. **Any in-place reordering problem**: When you need to rearrange elements without extra space but have a mapping, you often use cyclic sort techniques, which is a more advanced version of this pattern.

## Key Takeaways

1. **Direct mapping application**: When you have an explicit mapping from source to destination indices, you can often solve the problem in O(n) time by creating a result array and placing each element in its mapped position.

2. **Use appropriate data structures**: For string building with random access assignments, always prefer arrays/lists over direct string manipulation due to immutability concerns.

3. **Visualize with small examples**: Tracing through a concrete example (like we did with "code") is the fastest way to understand the mapping and avoid index confusion.

[Practice this problem on CodeJeet](/problem/shuffle-string)
