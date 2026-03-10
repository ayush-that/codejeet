---
title: "How to Solve Verifying an Alien Dictionary — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Verifying an Alien Dictionary. Easy difficulty, 55.9% acceptance rate. Topics: Array, Hash Table, String."
date: "2027-03-17"
category: "dsa-patterns"
tags: ["verifying-an-alien-dictionary", "array", "hash-table", "string", "easy"]
---

# How to Solve Verifying an Alien Dictionary

This problem asks us to verify whether a list of words is sorted according to a custom alphabet order. The twist is that instead of the standard English alphabetical order (a-z), we're given a permutation of the 26 lowercase letters that defines the alien language's ordering. The challenge lies in comparing words character-by-character according to this custom ordering rather than relying on built-in string comparison.

## Visual Walkthrough

Let's walk through an example to build intuition:

**Input:**

- `words = ["hello", "leetcode"]`
- `order = "hlabcdefgijkmnopqrstuvwxyz"`

**Step 1: Understand the alien order**
The order string tells us that 'h' comes before 'l', which comes before 'a', and so on. We need to compare words pairwise to check if they're in sorted order.

**Step 2: Compare first two words**
We compare "hello" and "leetcode":

1. First character: 'h' vs 'l'
2. Check alien order: 'h' comes before 'l' in the order string
3. Since 'h' < 'l', "hello" should come before "leetcode" - this pair is valid!

**Step 3: What if words have a common prefix?**
Consider `words = ["apple", "app"]` with standard order:

1. Compare "apple" and "app"
2. First 3 characters match: 'a', 'p', 'p'
3. "apple" is longer than "app"
4. In sorted order, shorter word should come first when there's a prefix match
5. So "app" should come before "apple" - this pair is NOT valid

**Step 4: The comparison logic**
For each pair of adjacent words `word1` and `word2`:

1. Find the first position where characters differ
2. If `word1_char` comes after `word2_char` in alien order → NOT sorted
3. If all compared characters are equal but `word1` is longer than `word2` → NOT sorted
4. Otherwise → sorted

## Brute Force Approach

A naive approach would be to compare every word with every other word, but that's O(n²) comparisons where n is the number of words. However, there's a more subtle brute force: we could convert each word to its "normalized" form by mapping alien letters to standard English letters, then use standard string comparison.

**Why this fails:**

1. **Mapping approach complexity:** Creating a mapping from alien to standard letters is O(1) since there are only 26 letters, but the comparison still requires checking each character.
2. **The real issue:** The brute force isn't about time complexity but about missing the proper comparison logic. Many candidates try to sort the words using the custom comparator (which would be O(n log n)) when we only need to verify they're already sorted (O(n)).
3. **Common brute force mistake:** Comparing each word with all previous words instead of just the adjacent one. Since we're checking if the list is sorted, we only need to check adjacent pairs.

The optimal solution is actually quite straightforward once we understand the comparison rules.

## Optimal Solution

The key insight is that we only need to:

1. Create a mapping from each character to its position in the alien alphabet for O(1) lookups
2. Compare each adjacent pair of words using the custom ordering rules
3. Return false as soon as we find any violation

<div class="code-group">

```python
# Time: O(C) where C is total characters in all words
# Space: O(1) since we store only 26 characters in the mapping
def isAlienSorted(words, order):
    # Step 1: Create a dictionary mapping each character to its index in the alien order
    # This allows O(1) lookup when comparing characters
    order_map = {}
    for i, char in enumerate(order):
        order_map[char] = i

    # Step 2: Compare each adjacent pair of words
    for i in range(len(words) - 1):
        word1 = words[i]
        word2 = words[i + 1]

        # Step 3: Find the first differing character
        # We only need to compare up to the length of the shorter word
        for j in range(min(len(word1), len(word2))):
            char1 = word1[j]
            char2 = word2[j]

            # If characters are different, check their order
            if char1 != char2:
                # If word1's char comes AFTER word2's char in alien order,
                # the words are not sorted
                if order_map[char1] > order_map[char2]:
                    return False
                # If word1's char comes BEFORE word2's char, this pair is valid
                # We can break and check the next word pair
                break
        else:
            # This else clause executes if the for loop completes without breaking
            # This happens when all compared characters are equal (common prefix)

            # If word1 is longer than word2 and they share a prefix,
            # word1 should come after word2, so they're not sorted
            # Example: ["apple", "app"] is NOT sorted
            if len(word1) > len(word2):
                return False

    # Step 4: If we've checked all adjacent pairs without finding violations,
    # the words are sorted according to the alien dictionary
    return True
```

```javascript
// Time: O(C) where C is total characters in all words
// Space: O(1) since we store only 26 characters in the mapping
function isAlienSorted(words, order) {
  // Step 1: Create a map from character to its position in alien order
  const orderMap = new Map();
  for (let i = 0; i < order.length; i++) {
    orderMap.set(order[i], i);
  }

  // Step 2: Compare each adjacent pair of words
  for (let i = 0; i < words.length - 1; i++) {
    const word1 = words[i];
    const word2 = words[i + 1];

    // Step 3: Find the first differing character
    const minLength = Math.min(word1.length, word2.length);
    let foundDifference = false;

    for (let j = 0; j < minLength; j++) {
      const char1 = word1[j];
      const char2 = word2[j];

      if (char1 !== char2) {
        // If word1's char comes AFTER word2's char, not sorted
        if (orderMap.get(char1) > orderMap.get(char2)) {
          return false;
        }
        // Valid order found, move to next word pair
        foundDifference = true;
        break;
      }
    }

    // Step 4: Handle the case where all compared characters are equal
    // (common prefix case)
    if (!foundDifference) {
      // If word1 is longer than word2 with common prefix, not sorted
      if (word1.length > word2.length) {
        return false;
      }
    }
  }

  // Step 5: All adjacent pairs are properly ordered
  return true;
}
```

```java
// Time: O(C) where C is total characters in all words
// Space: O(1) since we store only 26 characters in the mapping
class Solution {
    public boolean isAlienSorted(String[] words, String order) {
        // Step 1: Create an array to map character to its position
        // Using array instead of HashMap for better performance
        int[] orderMap = new int[26];
        for (int i = 0; i < order.length(); i++) {
            // Map 'a' to index 0, 'b' to index 1, etc.
            orderMap[order.charAt(i) - 'a'] = i;
        }

        // Step 2: Compare each adjacent pair of words
        for (int i = 0; i < words.length - 1; i++) {
            String word1 = words[i];
            String word2 = words[i + 1];

            // Step 3: Compare characters until we find a difference
            // or reach the end of the shorter word
            int minLength = Math.min(word1.length(), word2.length());
            boolean foundDifference = false;

            for (int j = 0; j < minLength; j++) {
                char char1 = word1.charAt(j);
                char char2 = word2.charAt(j);

                if (char1 != char2) {
                    // Check order using our mapping
                    if (orderMap[char1 - 'a'] > orderMap[char2 - 'a']) {
                        return false;
                    }
                    // Valid order found, check next word pair
                    foundDifference = true;
                    break;
                }
            }

            // Step 4: Handle common prefix case
            if (!foundDifference) {
                // If word1 is longer than word2 with same prefix, not sorted
                if (word1.length() > word2.length()) {
                    return false;
                }
            }
        }

        // Step 5: All pairs are properly ordered
        return true;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(C)**

- Where C is the total number of characters across all words
- We create the order mapping: O(26) = O(1)
- We compare each adjacent pair of words: O(n-1) pairs
- For each pair, we compare up to min(length(word1), length(word2)) characters
- In the worst case, we compare every character in every word once
- Thus total time is proportional to the total number of characters

**Space Complexity: O(1)**

- We only store the order mapping for 26 characters
- The mapping uses constant space regardless of input size
- No additional data structures that grow with input size

## Common Mistakes

1. **Forgetting the prefix edge case:** The most common mistake is not handling the case where one word is a prefix of another. For example, `["apple", "app"]` should return false because in sorted order, the shorter word should come first. Always check lengths after comparing all available characters.

2. **Comparing beyond the shorter word's length:** When comparing `word1` and `word2`, you should only compare up to `min(len(word1), len(word2))`. Comparing beyond that leads to index out of bounds errors. Use `range(min(len(word1), len(word2)))` in Python or similar in other languages.

3. **Using the wrong comparison direction:** Remember that we want `word1` to come before `word2`. If `order_map[char1] > order_map[char2]`, then `word1` comes after `word2` in the alien order, so we should return false. It's easy to reverse this logic.

4. **Not breaking early when valid order is found:** Once we find the first differing characters and confirm they're in the correct order (`char1` before `char2`), we should break out of the character comparison loop. There's no need to check remaining characters for that word pair.

## When You'll See This Pattern

This problem teaches **custom comparator design**, which appears in many sorting and validation problems:

1. **Reorder Data in Log Files (LeetCode 937):** Similar custom comparison logic where you need to define what makes one log entry "less than" another based on specific rules.

2. **Sort Characters By Frequency (LeetCode 451):** Requires custom sorting based on character frequencies rather than alphabetical order.

3. **Largest Number (LeetCode 179):** Requires defining a custom comparison for numbers to determine which concatenation forms the largest number.

The pattern involves: creating a mapping or function that defines ordering, then using that to compare elements according to specific business rules rather than natural ordering.

## Key Takeaways

1. **Custom comparators often need lookup tables:** When comparing elements according to non-standard ordering, create a mapping first for O(1) lookups during comparison.

2. **Adjacent comparison is sufficient for validation:** To check if a list is sorted, you only need to verify each element is in order with its immediate neighbor, not compare it with all other elements.

3. **Watch for prefix/suffix edge cases:** When comparing strings, always consider what happens when one is a prefix of the other. The general rule: if all compared characters are equal, the shorter string should come first.

[Practice this problem on CodeJeet](/problem/verifying-an-alien-dictionary)
