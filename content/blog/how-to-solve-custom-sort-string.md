---
title: "How to Solve Custom Sort String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Custom Sort String. Medium difficulty, 72.3% acceptance rate. Topics: Hash Table, String, Sorting."
date: "2027-03-22"
category: "dsa-patterns"
tags: ["custom-sort-string", "hash-table", "string", "sorting", "medium"]
---

# How to Solve Custom Sort String

You're given two strings: `order` (with unique characters) and `s`. You need to rearrange the characters in `s` so they appear in the same relative order as they do in `order`. Characters in `s` that don't appear in `order` can go anywhere at the end. What makes this problem interesting is that it's not a simple alphabetical sort—it's a custom ordering defined by the `order` string, which requires us to map characters to their priority values.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose:

- `order = "cba"`
- `s = "abcd"`

We want to rearrange `"abcd"` so characters appear in `"cba"` order. Characters not in `order` go at the end.

**Step 1: Understand the desired order**

- In `order`, `'c'` comes first, then `'b'`, then `'a'`
- `'d'` is not in `order`, so it goes at the end

**Step 2: Count characters in `s`**

- `'a'`: appears 1 time
- `'b'`: appears 1 time
- `'c'`: appears 1 time
- `'d'`: appears 1 time

**Step 3: Build result following `order`**

1. Append all `'c'`s: `"c"`
2. Append all `'b'`s: `"cb"`
3. Append all `'a'`s: `"cba"`
4. Append remaining characters (those not in `order`): `"cba" + "d" = "cba"`

**Step 4: Check edge cases**
What if `s` has multiple occurrences? Example: `order = "cba"`, `s = "abccba"`

- Counts: `'a':2`, `'b':2`, `'c':2`
- Result: `"cc" + "bb" + "aa" = "ccbbaa"`

The key insight: we need to count characters in `s`, then output them in `order` sequence, finally appending any leftovers.

## Brute Force Approach

A naive approach might try to sort `s` using a custom comparator that compares characters based on their positions in `order`. For each pair of characters, we'd look up their indices in `order` (or assign a large value if not found) and compare.

**Why this is inefficient:**

1. **Time complexity:** O(n log n) for sorting, plus O(m) for each comparison (where m is length of `order`), giving O(n log n \* m)
2. **Unnecessary work:** We don't actually need a full sort—we just need to group characters by their order priority
3. **Extra complexity:** Handling characters not in `order` requires special logic in the comparator

The brute force misses a key observation: since `order` defines a total ordering for characters that appear in it, we can simply count occurrences and output in that order.

## Optimized Approach

The optimal solution uses **counting with a hash map**:

1. **Count frequencies:** First, count how many times each character appears in `s` using a frequency map (hash table/dictionary).
2. **Build result in order:** Iterate through `order` characters. For each character, if it exists in our frequency map, append it to the result as many times as it appears, then remove it from the map (or set count to 0).
3. **Append leftovers:** After processing all characters in `order`, append any remaining characters from the frequency map (those not in `order`) to the end of the result.

**Why this works:**

- We ensure characters in `order` appear in the correct relative order
- We handle multiple occurrences correctly by using counts
- Characters not in `order` naturally end up at the end
- Time complexity is O(m + n) where m = len(order), n = len(s)

**Key insight:** This is essentially a **bucket sort** where the buckets are defined by the `order` string. Each character gets a priority based on its position in `order`, and we output characters in priority order.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(m + n) where m = len(order), n = len(s)
# Space: O(n) for the frequency map and output string
def customSortString(order: str, s: str) -> str:
    # Step 1: Count frequency of each character in s
    # We use a dictionary to store character counts
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Step 2: Build result by following the order string
    result = []

    # For each character in the predefined order
    for char in order:
        # If this character exists in s
        if char in freq:
            # Append it to result as many times as it appears
            result.append(char * freq[char])
            # Remove it from frequency map since we've processed it
            del freq[char]

    # Step 3: Append remaining characters (not in order) to the end
    # These can be in any order since they're not constrained
    for char, count in freq.items():
        result.append(char * count)

    # Step 4: Join all parts into a single string
    return ''.join(result)
```

```javascript
// Time: O(m + n) where m = order.length, n = s.length
// Space: O(n) for the frequency map and output string
function customSortString(order, s) {
  // Step 1: Count frequency of each character in s
  const freq = new Map();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }

  // Step 2: Build result by following the order string
  let result = "";

  // For each character in the predefined order
  for (const char of order) {
    // If this character exists in s
    if (freq.has(char)) {
      // Append it to result as many times as it appears
      result += char.repeat(freq.get(char));
      // Remove it from frequency map since we've processed it
      freq.delete(char);
    }
  }

  // Step 3: Append remaining characters (not in order) to the end
  // These can be in any order since they're not constrained
  for (const [char, count] of freq) {
    result += char.repeat(count);
  }

  // Step 4: Return the final sorted string
  return result;
}
```

```java
// Time: O(m + n) where m = order.length(), n = s.length()
// Space: O(n) for the frequency map and output string
class Solution {
    public String customSortString(String order, String s) {
        // Step 1: Count frequency of each character in s
        // Use an array since characters are lowercase letters (26 possible)
        // This is more efficient than HashMap for this specific constraint
        int[] freq = new int[26];
        for (char c : s.toCharArray()) {
            freq[c - 'a']++;
        }

        // Step 2: Build result by following the order string
        StringBuilder result = new StringBuilder();

        // For each character in the predefined order
        for (char c : order.toCharArray()) {
            // Append this character as many times as it appears in s
            while (freq[c - 'a'] > 0) {
                result.append(c);
                freq[c - 'a']--;
            }
        }

        // Step 3: Append remaining characters (not in order) to the end
        // These can be in any order since they're not constrained
        for (char c = 'a'; c <= 'z'; c++) {
            while (freq[c - 'a'] > 0) {
                result.append(c);
                freq[c - 'a']--;
            }
        }

        // Step 4: Return the final sorted string
        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(m + n)**

- Counting characters in `s`: O(n) where n = len(s)
- Building result by iterating through `order`: O(m) where m = len(order)
- Appending remaining characters: O(26) in Java array version, O(k) in hash map versions where k = unique chars in s not in order
- Total: O(m + n)

**Space Complexity: O(n)**

- Frequency map: O(k) where k = number of unique characters in `s` (at most 26 for lowercase letters, at most n in general)
- Output string: O(n) to store the result
- Total: O(n)

The Java solution uses O(1) extra space for the frequency array (fixed size 26) plus O(n) for the output, giving O(n) total.

## Common Mistakes

1. **Forgetting to handle multiple occurrences:** Some candidates append each character only once instead of the correct number of times. Always use counting!

2. **Incorrectly handling characters not in `order`:** They must go at the end, but candidates sometimes:
   - Omit them entirely
   - Put them at the beginning
   - Try to sort them alphabetically (not required)

3. **Using inefficient data structures:**
   - Using `index()` or `find()` in a loop gives O(m\*n) time
   - Sorting with custom comparator gives O(n log n) time, which is worse than O(n)

4. **Off-by-one errors with indices:** When using array-based solutions (like the Java version), remember that `c - 'a'` gives 0 for 'a', 1 for 'b', etc.

**How to avoid:** Always trace through a small example first. Count frequencies explicitly. Test with edge cases like empty strings, all characters in `order`, no characters in `order`, etc.

## When You'll See This Pattern

This **custom ordering with counting** pattern appears in several problems:

1. **Sort Characters By Frequency (LeetCode 451)** - Similar but orders by frequency instead of custom order. Uses counting + bucket sort.

2. **Relative Sort Array (LeetCode 1122)** - Almost identical! Sort array1 so that relative ordering of items matches array2, with remaining items in ascending order at the end.

3. **Reorder Data in Log Files (LeetCode 937)** - Custom sorting with different rules for letter-logs vs digit-logs.

**Why they're related:** All involve sorting with non-standard comparison rules. The pattern is: count/group elements, then output in specific order, finally handle leftovers.

## Key Takeaways

1. **When you need custom ordering, think counting + sequential output** instead of full comparison-based sorting. This often gives O(n) instead of O(n log n).

2. **Hash maps are perfect for counting frequencies** when you don't know the character set. If you know it's limited (like lowercase letters), arrays are more efficient.

3. **The "leftovers at the end" pattern** is common in custom sorting problems. Process constrained elements first, then append unconstrained ones.

Remember: Interviewers love this problem because it tests understanding of hash maps, string manipulation, and efficient algorithm design—all in one concise solution.

Related problems: [Sort the Students by Their Kth Score](/problem/sort-the-students-by-their-kth-score)
