---
title: "How to Solve Find Words Containing Character — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Words Containing Character. Easy difficulty, 90.4% acceptance rate. Topics: Array, String."
date: "2027-08-18"
category: "dsa-patterns"
tags: ["find-words-containing-character", "array", "string", "easy"]
---

# How to Solve Find Words Containing Character

This problem asks you to find which words in an array contain a specific character, returning their indices. While conceptually straightforward, it tests your ability to handle string operations, array iteration, and index tracking—all fundamental skills for more complex problems. The "tricky" part isn't algorithmic complexity but rather writing clean, correct code that handles edge cases properly.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:** `words = ["leet", "code", "test"]`, `x = "e"`

We need to check each word to see if it contains the character "e":

1. **Index 0:** Word = "leet"
   - Check characters: 'l', 'e', 'e', 't'
   - Contains 'e'? Yes → Add index 0 to result

2. **Index 1:** Word = "code"
   - Check characters: 'c', 'o', 'd', 'e'
   - Contains 'e'? Yes → Add index 1 to result

3. **Index 2:** Word = "test"
   - Check characters: 't', 'e', 's', 't'
   - Contains 'e'? Yes → Add index 2 to result

**Result:** `[0, 1, 2]`

Now let's try another example: `words = ["abc", "bcd", "cde"]`, `x = "a"`

1. **Index 0:** "abc" contains 'a' → Add 0
2. **Index 1:** "bcd" doesn't contain 'a' → Skip
3. **Index 2:** "cde" doesn't contain 'a' → Skip

**Result:** `[0]`

The key insight is that we need to iterate through each word and check if it contains the target character. Since we're returning indices, we need to track both the word and its position in the array.

## Brute Force Approach

For this problem, the "brute force" approach is actually optimal because we must examine every character in every word to determine if it contains `x`. There's no way to avoid checking each word, and within each word, we need to check characters until we find `x` or reach the end.

However, a truly naive implementation might:

1. Use nested loops without early termination
2. Convert each word to a set unnecessarily
3. Use string concatenation instead of list/array building

The most straightforward approach is:

1. Create an empty result list
2. Loop through each word with its index
3. For each word, check if it contains `x`
4. If yes, add the index to the result
5. Return the result

This is already O(n \* m) where n is number of words and m is average word length, which is optimal since we need to examine each character at least once.

## Optimal Solution

The optimal solution uses a single pass through the words array, checking each word for the target character. We can use built-in string methods like `contains()` or `indexOf()` for efficiency and readability.

<div class="code-group">

```python
# Time: O(n * m) where n = len(words), m = avg word length
# Space: O(k) where k = number of words containing x (worst case O(n))
def findWordsContaining(words, x):
    """
    Find indices of words containing character x.

    Args:
        words: List of strings to search
        x: Character to find in words

    Returns:
        List of indices where word contains x
    """
    result = []  # Step 1: Initialize result list

    # Step 2: Iterate through words with their indices
    for i, word in enumerate(words):
        # Step 3: Check if current word contains x
        if x in word:
            # Step 4: If yes, add current index to result
            result.append(i)

    # Step 5: Return the list of indices
    return result
```

```javascript
// Time: O(n * m) where n = words.length, m = avg word length
// Space: O(k) where k = number of words containing x (worst case O(n))
function findWordsContaining(words, x) {
  /**
   * Find indices of words containing character x.
   *
   * @param {string[]} words - Array of strings to search
   * @param {string} x - Character to find in words
   * @return {number[]} Array of indices where word contains x
   */
  const result = []; // Step 1: Initialize result array

  // Step 2: Iterate through words with their indices
  for (let i = 0; i < words.length; i++) {
    // Step 3: Check if current word contains x
    if (words[i].includes(x)) {
      // Step 4: If yes, add current index to result
      result.push(i);
    }
  }

  // Step 5: Return the array of indices
  return result;
}
```

```java
// Time: O(n * m) where n = words.length, m = avg word length
// Space: O(k) where k = number of words containing x (worst case O(n))
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> findWordsContaining(String[] words, char x) {
        /**
         * Find indices of words containing character x.
         *
         * @param words Array of strings to search
         * @param x Character to find in words
         * @return List of indices where word contains x
         */
        List<Integer> result = new ArrayList<>();  // Step 1: Initialize result list

        // Step 2: Iterate through words with their indices
        for (int i = 0; i < words.length; i++) {
            // Step 3: Check if current word contains x
            if (words[i].indexOf(x) != -1) {
                // Step 4: If yes, add current index to result
                result.add(i);
            }
        }

        // Step 5: Return the list of indices
        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × m)

- `n` is the number of words in the input array
- `m` is the average length of the words
- We need to check each word, and for each word, we might need to check each character (in the worst case when `x` isn't found or is at the end)
- Built-in methods like `includes()`, `in`, or `indexOf()` typically have O(m) complexity for searching a character in a string

**Space Complexity:** O(k) where k is the number of words containing `x`

- In the worst case, when all words contain `x`, this becomes O(n)
- We only store the indices of matching words, not the words themselves
- The input and output are not counted toward space complexity in standard analysis

## Common Mistakes

1. **Forgetting that indices are 0-based:** The problem explicitly states the array is 0-indexed, but some candidates might accidentally return 1-based indices or misunderstand what "index" means in this context.

2. **Using the wrong comparison for character `x`:** In some languages, `x` might be passed as a string of length 1 rather than a char. Make sure to use the appropriate string method (e.g., `includes()` in JavaScript, `indexOf()` in Java, `in` operator in Python).

3. **Not handling empty words array:** While the problem doesn't specify edge cases, a good solution should handle an empty input by returning an empty array/list.

4. **Inefficient string searching:** Some candidates might write their own linear search through each word instead of using built-in methods. While this doesn't change time complexity, it's more error-prone and less readable.

5. **Returning words instead of indices:** This is a classic misreading of the problem statement. The output should be indices (numbers), not the words themselves.

## When You'll See This Pattern

This problem demonstrates the **linear scan with filtering** pattern, which appears in many array/string problems:

1. **Find Target Indices After Sorting Array (Easy):** Similar filtering logic but requires sorting first, then finding indices where values match the target.

2. **Find All Numbers Disappeared in an Array (Easy):** Uses a similar scanning approach to identify which numbers are missing from a range.

3. **Find All Duplicates in an Array (Medium):** Another filtering problem where you scan an array and collect elements meeting certain criteria.

The core pattern is: iterate through a collection, apply a condition to each element, and collect the indices or elements that satisfy the condition. This is fundamental to many data processing tasks.

## Key Takeaways

1. **Master built-in string methods:** Knowing when to use `includes()`/`contains()`/`indexOf()` vs writing manual loops saves time and reduces bugs.

2. **Pay attention to return type:** This problem asks for indices, not values. Always double-check what the problem is asking you to return.

3. **Simple problems test fundamentals:** Even "easy" problems test your ability to write clean, correct code with proper edge case handling. Don't underestimate them.

4. **The enumerate/enhanced for loop pattern:** When you need both the index and value from an array, use `enumerate()` in Python, traditional for loop with index in JavaScript/Java, or enhanced for loops with manual index tracking.

Related problems: [Find Target Indices After Sorting Array](/problem/find-target-indices-after-sorting-array)
