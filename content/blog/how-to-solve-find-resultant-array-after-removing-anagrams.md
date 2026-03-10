---
title: "How to Solve Find Resultant Array After Removing Anagrams — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Find Resultant Array After Removing Anagrams. Easy difficulty, 69.9% acceptance rate. Topics: Array, Hash Table, String, Sorting."
date: "2028-09-20"
category: "dsa-patterns"
tags: ["find-resultant-array-after-removing-anagrams", "array", "hash-table", "string", "easy"]
---

# How to Solve Find Resultant Array After Removing Anagrams

This problem asks us to process an array of strings and repeatedly remove any word that is an anagram of its immediate predecessor. The catch is that after each removal, the array shrinks, potentially creating new adjacent pairs that need checking. While the problem is labeled "Easy," it tests your understanding of anagram detection and careful array traversal. The interesting part is realizing you don't actually need to simulate deletions—you can build the result directly by tracking which words survive.

## Visual Walkthrough

Let's trace through `words = ["abba","baba","bbaa","cd","cd"]`:

**Step 1:** Start with result array containing only the first word `["abba"]` (it always stays).

**Step 2:** Compare second word `"baba"` with last word in result (`"abba"`). Are they anagrams? Both sorted become `"aabb"`, so yes. Don't add `"baba"` to result.

**Step 3:** Compare third word `"bbaa"` with last word in result (still `"abba"`). Sorted: `"aabb"` vs `"aabb"` → anagrams. Don't add `"bbaa"`.

**Step 4:** Compare fourth word `"cd"` with last word in result (`"abba"`). Sorted: `"cd"` vs `"aabb"` → not anagrams. Add `"cd"` to result: `["abba","cd"]`.

**Step 5:** Compare fifth word `"cd"` with last word in result (`"cd"`). Sorted: `"cd"` vs `"cd"` → anagrams. Don't add second `"cd"`.

Final result: `["abba","cd"]`.

Notice we only compare each word with the _last surviving word_ in our result, not its original neighbor. This works because if word B is removed for being an anagram of A, then word C should be compared to A (not B) to determine if it stays.

## Brute Force Approach

A naive approach would literally simulate the deletion process: repeatedly scan the array, find adjacent anagram pairs, remove the second element, and repeat until no more deletions are possible.

```python
def removeAnagrams(words):
    changed = True
    while changed:
        changed = False
        i = 1
        while i < len(words):
            # Check if words[i-1] and words[i] are anagrams
            if sorted(words[i-1]) == sorted(words[i]):
                words.pop(i)  # Remove words[i]
                changed = True
            else:
                i += 1
    return words
```

**Why this is inefficient:**

- Time complexity: O(n²) in worst case (consider `["a","a","a","a","a"]` where we remove one element per pass)
- Space complexity: O(n) for sorting strings
- Modifying the array while iterating requires careful index management
- Repeatedly sorting the same strings multiple times

The brute force helps understand the problem but isn't optimal. We need a single-pass solution.

## Optimal Solution

The key insight: we can build the result array directly. For each word in the original array, we compare it to the _last word added to our result_. If they're not anagrams, we add the current word to the result. This works because:

1. The first word always stays
2. If word B is an anagram of word A, it gets removed, so word C should be compared to A
3. By only keeping non-anagram words in our result, the last result word is always the correct comparison point

We need an efficient way to check anagrams. Sorting each string works (O(k log k) where k is string length), or we could use character frequency counts (O(k)). Since k ≤ 100 and n ≤ 100, both are acceptable.

<div class="code-group">

```python
# Time: O(n * k log k) where n = len(words), k = avg word length
# Space: O(n) for the result array (excluding sorting space)
def removeAnagrams(words):
    # Result list starting with first word (always included)
    result = [words[0]]

    # Compare each subsequent word with the last word in result
    for i in range(1, len(words)):
        # Get current word and last word in result
        current_word = words[i]
        last_word = result[-1]

        # Check if they're anagrams by comparing sorted versions
        # Two strings are anagrams if their sorted forms are equal
        if sorted(current_word) != sorted(last_word):
            # Not anagrams, add current word to result
            result.append(current_word)

    return result
```

```javascript
// Time: O(n * k log k) where n = words.length, k = avg word length
// Space: O(n) for the result array
function removeAnagrams(words) {
  // Result array starting with first word
  const result = [words[0]];

  // Compare each subsequent word with last word in result
  for (let i = 1; i < words.length; i++) {
    const currentWord = words[i];
    const lastWord = result[result.length - 1];

    // Helper function to check if two strings are anagrams
    // by comparing their sorted versions
    const areAnagrams = (s1, s2) => {
      // Sort characters and compare
      return s1.split("").sort().join("") === s2.split("").sort().join("");
    };

    // If not anagrams, add to result
    if (!areAnagrams(currentWord, lastWord)) {
      result.push(currentWord);
    }
  }

  return result;
}
```

```java
// Time: O(n * k log k) where n = words.length, k = avg word length
// Space: O(n) for the result list
import java.util.*;

class Solution {
    public List<String> removeAnagrams(String[] words) {
        // Result list starting with first word
        List<String> result = new ArrayList<>();
        result.add(words[0]);

        // Compare each subsequent word with last word in result
        for (int i = 1; i < words.length; i++) {
            String currentWord = words[i];
            String lastWord = result.get(result.size() - 1);

            // Check if current word and last result word are anagrams
            if (!isAnagram(currentWord, lastWord)) {
                // Not anagrams, add to result
                result.add(currentWord);
            }
        }

        return result;
    }

    // Helper method to check if two strings are anagrams
    private boolean isAnagram(String s1, String s2) {
        // Convert strings to char arrays and sort
        char[] arr1 = s1.toCharArray();
        char[] arr2 = s2.toCharArray();
        Arrays.sort(arr1);
        Arrays.sort(arr2);

        // Compare sorted arrays
        return Arrays.equals(arr1, arr2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k log k)

- We process each of the n words once
- For each comparison, we sort two strings of length k, which takes O(k log k) time
- In total: O(n × k log k)

**Space Complexity:** O(n)

- We store the result array, which in worst case contains all n words
- Sorting creates temporary arrays of size O(k), but this is usually considered auxiliary space
- If we count the space for sorting, it's O(n + k) but typically simplified to O(n)

**Optimization Note:** We could use character frequency counts (arrays of size 26) to check anagrams in O(k) time instead of O(k log k), reducing time to O(n × k). However, with the given constraints (k ≤ 100), the sorting approach is simpler and still efficient.

## Common Mistakes

1. **Comparing with original neighbors instead of last kept word:**
   - Mistake: Checking `words[i]` against `words[i-1]` in the original array
   - Why it fails: After removing an element, the next element should be compared to the element before the removed one
   - Fix: Always compare with the last word in your result array

2. **Modifying the input array while iterating:**
   - Mistake: Using `pop()` or `splice()` during iteration without adjusting indices
   - Why it fails: Causes index errors or skipped elements
   - Fix: Build a new result array instead of modifying in-place

3. **Forgetting the first word always stays:**
   - Mistake: Starting with empty result and special-casing the first comparison
   - Why it fails: Unnecessary complexity and potential off-by-one errors
   - Fix: Initialize result with `words[0]` and start loop from index 1

4. **Inefficient anagram checking:**
   - Mistake: Using nested loops or counting characters repeatedly
   - Why it fails: Could lead to O(n² × k) time
   - Fix: Use sorting or precomputed frequency arrays

## When You'll See This Pattern

This problem combines two common patterns:

1. **Adjacent element comparison with filtering:** Similar to "Remove Duplicates from Sorted Array" where you compare each element with the last kept element. The pattern is: build result incrementally, comparing each new element with the last element in your result.

2. **Anagram detection:** The core technique of sorting strings or using character counts appears in:
   - **Group Anagrams (Medium):** Group words that are anagrams of each other
   - **Valid Anagram (Easy):** Check if two strings are anagrams
   - **Find All Anagrams in a String (Medium):** Find all substrings that are anagrams of a pattern

The adjacency filtering pattern also appears in:

- **Remove All Adjacent Duplicates In String (Easy):** Remove adjacent duplicate characters
- **Crawler Log Folder (Easy):** Process log operations based on previous state

## Key Takeaways

1. **When removing elements based on adjacency, build the result rather than delete:** Instead of modifying the input array (which causes index issues), construct a new array by deciding which elements to include based on the last included element.

2. **Anagram checking has two efficient approaches:** Sorting strings (O(k log k)) or character frequency counting (O(k)). Choose based on constraints—sorting is simpler for short strings, counting scales better for longer strings.

3. **The first element often has special handling:** Many array processing problems treat the first element as a base case. Initialize your result with it and start processing from the second element.

Related problems: [Group Anagrams](/problem/group-anagrams), [Valid Anagram](/problem/valid-anagram)
