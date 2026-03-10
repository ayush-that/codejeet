---
title: "How to Solve Group Anagrams — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Group Anagrams. Medium difficulty, 72.2% acceptance rate. Topics: Array, Hash Table, String, Sorting."
date: "2026-02-28"
category: "dsa-patterns"
tags: ["group-anagrams", "array", "hash-table", "string", "medium"]
---

# How to Solve Group Anagrams

Grouping anagrams is a classic coding interview problem that tests your ability to recognize patterns and use hash tables effectively. The challenge is to take an array of strings and group together those that are anagrams of each other. Two strings are anagrams if they contain the same characters in the same frequency, just rearranged. What makes this problem interesting is that we need to find an efficient way to identify this "sameness" without comparing every string to every other string.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. Suppose we're given:

```
strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
```

We need to group strings that are anagrams together. Let's think about what makes two strings anagrams:

1. "eat", "tea", and "ate" all contain: 1 'e', 1 'a', 1 't'
2. "tan" and "nat" both contain: 1 't', 1 'a', 1 'n'
3. "bat" contains: 1 'b', 1 'a', 1 't' (unique combination)

The key insight is that if we sort each string alphabetically, all anagrams will become identical:

- "eat", "tea", "ate" → all sort to "aet"
- "tan", "nat" → both sort to "ant"
- "bat" → sorts to "abt"

So our approach will be:

1. For each string, create a sorted version
2. Use the sorted version as a key in a hash map
3. Group original strings under their sorted key

Let's walk through step-by-step:

**Step 1:** Process "eat"

- Sorted: "aet"
- Add to map: {"aet": ["eat"]}

**Step 2:** Process "tea"

- Sorted: "aet"
- Add to map: {"aet": ["eat", "tea"]}

**Step 3:** Process "tan"

- Sorted: "ant"
- Add to map: {"aet": ["eat", "tea"], "ant": ["tan"]}

**Step 4:** Process "ate"

- Sorted: "aet"
- Add to map: {"aet": ["eat", "tea", "ate"], "ant": ["tan"]}

**Step 5:** Process "nat"

- Sorted: "ant"
- Add to map: {"aet": ["eat", "tea", "ate"], "ant": ["tan", "nat"]}

**Step 6:** Process "bat"

- Sorted: "abt"
- Add to map: {"aet": ["eat", "tea", "ate"], "ant": ["tan", "nat"], "abt": ["bat"]}

Finally, we return all the values from the map: [["eat","tea","ate"], ["tan","nat"], ["bat"]]

## Brute Force Approach

A naive approach would be to compare each string with every other string to check if they're anagrams. For each string `strs[i]`, we could:

1. Check if it's already been grouped
2. If not, start a new group with this string
3. For every other string `strs[j]` where `j > i`, check if they're anagrams
4. If yes, add to the current group

The anagram check could be done by:

- Sorting both strings and comparing (O(k log k) where k is string length)
- OR counting character frequencies (O(k) with O(26) space)

Here's what the brute force might look like:

```python
def groupAnagramsBruteForce(strs):
    result = []
    used = [False] * len(strs)

    for i in range(len(strs)):
        if used[i]:
            continue

        # Start a new group with current string
        group = [strs[i]]
        used[i] = True

        # Compare with all remaining strings
        for j in range(i + 1, len(strs)):
            if not used[j] and isAnagram(strs[i], strs[j]):
                group.append(strs[j])
                used[j] = True

        result.append(group)

    return result

def isAnagram(s, t):
    # Could sort both strings or count characters
    return sorted(s) == sorted(t)
```

**Why this is inefficient:**

- Time complexity: O(n² \* k log k) where n is number of strings and k is average string length
- For each of n strings, we compare with up to n other strings, and each comparison takes O(k log k) for sorting
- With n=10,000 and k=100, this becomes completely impractical (10⁸ \* 100 log 100 operations)

The brute force fails because it doesn't leverage the fact that we can create a canonical representation (sorted string or character count) that allows us to group strings in a single pass.

## Optimized Approach

The key insight is that we need a way to quickly identify which strings are anagrams without comparing each pair. We need a **hashable representation** that is identical for all anagrams. Two main approaches work:

1. **Sorted String Approach**: Sort each string to create a canonical form
   - "eat" → "aet", "tea" → "aet", "ate" → "aet"
   - All anagrams map to the same sorted string
   - Time: O(n \* k log k) where k is max string length

2. **Character Count Approach**: Create a string representation of character counts
   - For "eat": count[0]=1 ('a'), count[4]=1 ('e'), count[19]=1 ('t')
   - Represent as "#1#0#0#0#1#0...#1..." or use tuple of counts
   - Time: O(n \* k) (faster for long strings)

Both approaches use a hash map to group strings by their canonical representation. The sorted string approach is simpler to implement and understand, while the character count approach has better asymptotic complexity for long strings.

## Optimal Solution

Here's the complete solution using both approaches. The sorted string approach is usually preferred in interviews for its simplicity unless the interviewer specifically asks for optimization.

<div class="code-group">

```python
# Approach 1: Sorted String as Key
# Time: O(n * k log k) where n = len(strs), k = max string length
# Space: O(n * k) for storing all strings
def groupAnagrams(strs):
    """
    Groups anagrams together using sorted strings as hash keys.

    Args:
        strs: List of strings to group

    Returns:
        List of lists, where each inner list contains anagrams
    """
    # Dictionary to map sorted string -> list of anagrams
    anagram_map = {}

    for s in strs:
        # Create canonical form by sorting characters
        # sorted('tea') returns ['a', 'e', 't'], join to get 'aet'
        key = ''.join(sorted(s))

        # Add original string to the appropriate group
        if key in anagram_map:
            anagram_map[key].append(s)
        else:
            anagram_map[key] = [s]

    # Return all groups as a list of lists
    return list(anagram_map.values())

# Approach 2: Character Count as Key (Optimized for long strings)
# Time: O(n * k) where n = len(strs), k = max string length
# Space: O(n * k)
def groupAnagramsCount(strs):
    """
    Groups anagrams together using character counts as hash keys.
    More efficient for long strings.
    """
    from collections import defaultdict

    # Dictionary with default value of empty list
    anagram_map = defaultdict(list)

    for s in strs:
        # Create a count array for 26 lowercase letters
        count = [0] * 26

        # Count each character in the string
        for char in s:
            # ord(char) - ord('a') gives index 0-25
            count[ord(char) - ord('a')] += 1

        # Convert count array to a tuple (hashable) to use as key
        # Using tuple because lists are not hashable in Python
        key = tuple(count)

        # Add string to the appropriate group
        anagram_map[key].append(s)

    return list(anagram_map.values())
```

```javascript
// Approach 1: Sorted String as Key
// Time: O(n * k log k) where n = strs.length, k = max string length
// Space: O(n * k)
function groupAnagrams(strs) {
  /**
   * Groups anagrams together using sorted strings as hash keys.
   *
   * @param {string[]} strs - Array of strings to group
   * @return {string[][]} - Array of anagram groups
   */
  const anagramMap = new Map();

  for (const s of strs) {
    // Create canonical form by sorting characters
    // split('') converts string to array, sort() sorts array,
    // join('') converts back to string
    const key = s.split("").sort().join("");

    // Add original string to the appropriate group
    if (anagramMap.has(key)) {
      anagramMap.get(key).push(s);
    } else {
      anagramMap.set(key, [s]);
    }
  }

  // Return all groups as an array of arrays
  return Array.from(anagramMap.values());
}

// Approach 2: Character Count as Key
// Time: O(n * k) where n = strs.length, k = max string length
// Space: O(n * k)
function groupAnagramsCount(strs) {
  /**
   * Groups anagrams together using character counts as hash keys.
   * More efficient for long strings.
   */
  const anagramMap = new Map();

  for (const s of strs) {
    // Create a count array for 26 lowercase letters
    const count = new Array(26).fill(0);

    // Count each character in the string
    for (const char of s) {
      // charCodeAt(0) - 'a'.charCodeAt(0) gives index 0-25
      count[char.charCodeAt(0) - "a".charCodeAt(0)]++;
    }

    // Convert count array to a string to use as key
    // Using string because arrays can't be Map keys in JavaScript
    const key = count.join("#");

    // Add string to the appropriate group
    if (anagramMap.has(key)) {
      anagramMap.get(key).push(s);
    } else {
      anagramMap.set(key, [s]);
    }
  }

  return Array.from(anagramMap.values());
}
```

```java
// Approach 1: Sorted String as Key
// Time: O(n * k log k) where n = strs.length, k = max string length
// Space: O(n * k)
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        /**
         * Groups anagrams together using sorted strings as hash keys.
         *
         * @param strs Array of strings to group
         * @return List of anagram groups
         */
        // Map to store sorted string -> list of anagrams
        Map<String, List<String>> anagramMap = new HashMap<>();

        for (String s : strs) {
            // Create canonical form by sorting characters
            // Convert to char array, sort, then convert back to string
            char[] charArray = s.toCharArray();
            Arrays.sort(charArray);
            String key = new String(charArray);

            // Add original string to the appropriate group
            // Use computeIfAbsent for cleaner code
            anagramMap.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        // Return all groups as a list of lists
        return new ArrayList<>(anagramMap.values());
    }
}

// Approach 2: Character Count as Key
// Time: O(n * k) where n = strs.length, k = max string length
// Space: O(n * k)
class Solution {
    public List<List<String>> groupAnagramsCount(String[] strs) {
        /**
         * Groups anagrams together using character counts as hash keys.
         * More efficient for long strings.
         */
        Map<String, List<String>> anagramMap = new HashMap<>();

        for (String s : strs) {
            // Create a count array for 26 lowercase letters
            int[] count = new int[26];

            // Count each character in the string
            for (char c : s.toCharArray()) {
                count[c - 'a']++;
            }

            // Convert count array to a string representation
            // Using StringBuilder for efficiency
            StringBuilder keyBuilder = new StringBuilder();
            for (int i = 0; i < 26; i++) {
                keyBuilder.append('#');
                keyBuilder.append(count[i]);
            }
            String key = keyBuilder.toString();

            // Add string to the appropriate group
            anagramMap.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        return new ArrayList<>(anagramMap.values());
    }
}
```

</div>

## Complexity Analysis

**Sorted String Approach:**

- **Time Complexity:** O(n \* k log k)
  - `n`: number of strings in the input array
  - `k`: maximum length of any string
  - For each of `n` strings, we sort it which takes O(k log k) time
  - Dictionary operations (insert/lookup) are O(1) on average

- **Space Complexity:** O(n \* k)
  - We store all `n` strings in the dictionary
  - Each string has length up to `k`
  - Additional O(k) space for the sorted string (temporary)

**Character Count Approach:**

- **Time Complexity:** O(n \* k)
  - For each string, we iterate through its characters once: O(k)
  - Building the key string from counts: O(26) = O(1)
  - Total: O(n \* k)

- **Space Complexity:** O(n \* k)
  - Same as above for storing all strings
  - Additional O(26) = O(1) for the count array

The character count approach has better time complexity asymptotically, but in practice, for typical interview constraints (strings up to 100 characters), both approaches are acceptable. The sorted string approach is often preferred for its simplicity.

## Common Mistakes

1. **Forgetting that lists can't be dictionary keys in some languages**
   - In Python, lists are not hashable; use tuples instead
   - In JavaScript, arrays can't be Map keys; convert to string
   - Solution: Always convert your key representation to a hashable type

2. **Incorrect character counting for the count approach**
   - Using ASCII values directly without normalizing to 0-25
   - Forgetting that input might contain uppercase or special characters (problem states lowercase English letters)
   - Solution: Always subtract 'a' (or 97) to get 0-25 index

3. **Returning dictionary values instead of list of lists**
   - In Python: `anagram_map.values()` returns a dict_values object
   - In Java: `map.values()` returns a Collection
   - Solution: Explicitly convert to the required return type

4. **Inefficient string concatenation in the key builder**
   - Using string concatenation in a loop (O(k²) time)
   - Solution: Use StringBuilder (Java), list join (Python), or array join (JavaScript)

## When You'll See This Pattern

The core pattern here is **creating a canonical representation** for grouping similar items. This technique appears in many problems:

1. **Group Shifted Strings** (LeetCode 249)
   - Similar to Group Anagrams but for strings where characters are shifted by the same amount
   - Create key by calculating differences between consecutive characters

2. **Find Duplicate Subtrees** (LeetCode 652)
   - Need to identify duplicate subtrees in a binary tree
   - Create a string representation of each subtree (serialization) as the key

3. **Isomorphic Strings** (LeetCode 205)
   - Check if two strings are isomorphic (character mapping preserves order)
   - Create a pattern representation for each string

The pattern is: when you need to group or compare items that might be rearranged or transformed versions of each other, find a way to create a standardized representation that is identical for all items in the same group.

## Key Takeaways

1. **Hash maps are powerful for grouping problems**: When you need to group items by some property, a hash map with an appropriate key is often the solution.

2. **Canonical representations simplify comparisons**: Instead of comparing each pair (O(n²)), create a standardized form for each item and group by that form (O(n)).

3. **Consider trade-offs between approaches**: The sorted string approach (O(n k log k)) is simpler to implement and explain, while the character count approach (O(n k)) is asymptotically faster for long strings. In interviews, explain both and choose based on constraints.

Related problems: [Valid Anagram](/problem/valid-anagram), [Group Shifted Strings](/problem/group-shifted-strings), [Find Resultant Array After Removing Anagrams](/problem/find-resultant-array-after-removing-anagrams)
