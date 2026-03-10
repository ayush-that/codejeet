---
title: "How to Solve Largest Merge Of Two Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Largest Merge Of Two Strings. Medium difficulty, 53.5% acceptance rate. Topics: Two Pointers, String, Greedy."
date: "2029-02-21"
category: "dsa-patterns"
tags: ["largest-merge-of-two-strings", "two-pointers", "string", "greedy", "medium"]
---

# How to Solve Largest Merge Of Two Strings

You're given two strings and must merge them by repeatedly taking the first character from either string, forming the lexicographically largest possible result. The challenge is that you can't just compare the current characters — you need to look ahead to break ties when they're equal, making this a greedy problem with careful comparison logic.

## Visual Walkthrough

Let's trace through `word1 = "cabaa"` and `word2 = "bcaaa"`:

**Step 1:** Compare `word1[0] = 'c'` vs `word2[0] = 'b'`. Since `'c' > 'b'`, take from `word1`.

- Merge: `"c"`, word1: `"abaa"`, word2: `"bcaaa"`

**Step 2:** Compare `word1[0] = 'a'` vs `word2[0] = 'b'`. Since `'b' > 'a'`, take from `word2`.

- Merge: `"cb"`, word1: `"abaa"`, word2: `"caaa"`

**Step 3:** Compare `word1[0] = 'a'` vs `word2[0] = 'c'`. Since `'c' > 'a'`, take from `word2`.

- Merge: `"cbc"`, word1: `"abaa"`, word2: `"aaa"`

**Step 4:** Now `word1[0] = 'a'` and `word2[0] = 'a'` are equal. We need to look ahead:

- Compare the remaining strings: `"abaa"` vs `"aaa"`
- Since `"abaa"` > `"aaa"` lexicographically, take from `word1`
- Merge: `"cbca"`, word1: `"baa"`, word2: `"aaa"`

**Step 5:** Compare `word1[0] = 'b'` vs `word2[0] = 'a'`. Since `'b' > 'a'`, take from `word1`.

- Merge: `"cbcab"`, word1: `"aa"`, word2: `"aaa"`

**Step 6:** Compare `word1[0] = 'a'` vs `word2[0] = 'a'`. Look ahead:

- Compare `"aa"` vs `"aaa"` → `"aaa"` > `"aa"`, take from `word2`
- Merge: `"cbcaba"`, word1: `"aa"`, word2: `"aa"`

Continue until both strings are empty. The key insight: when characters are equal, compare the entire remaining suffix of each string.

## Brute Force Approach

A naive approach would be to try all possible merge sequences. At each step with both strings non-empty, you have 2 choices, leading to 2^(m+n) possibilities where m and n are string lengths. You'd generate all merges and pick the lexicographically largest.

This is clearly infeasible for even moderate string lengths (20 characters would mean over 1 million possibilities). The exponential growth makes brute force impossible.

Even a simpler brute force — comparing only the current characters without lookahead — fails on cases like:

- `word1 = "abc"`, `word2 = "ab"`
- If we only compare current characters, we'd take `'a'` from either, then `'b'` from either, then be left with `'c'` vs empty string
- But the optimal is to take from `word2` first when both have `'a'`, because `"abc"` > `"ab"`

## Optimized Approach

The key insight is **greedy with lookahead**: at each step, compare not just the current characters, but the entire remaining strings starting from the current position.

**Why this works:**

1. If the current characters differ, take from the string with the larger character (obvious)
2. If they're equal, we need to see which string's _remaining suffix_ is lexicographically larger
3. Comparing `word1[i:]` vs `word2[j:]` tells us which choice leads to a better overall result

**Step-by-step reasoning:**

1. Maintain two pointers `i` and `j` for current positions in `word1` and `word2`
2. While both pointers are within bounds:
   - If `word1[i] > word2[j]`: take from `word1`
   - If `word1[i] < word2[j]`: take from `word2`
   - If equal: compare `word1[i:]` vs `word2[j:]`
     - If `word1[i:] >= word2[j:]`: take from `word1`
     - Else: take from `word2`
3. Append remaining characters from whichever string isn't exhausted

The string comparison `word1[i:] >= word2[j:]` is efficient because:

- Python/Java/JavaScript compare strings lexicographically in O(k) time where k is min(length)
- We can optimize further by noting that once we find a differing character, we can stop comparing

## Optimal Solution

<div class="code-group">

```python
# Time: O((m+n) * min(m,n)) in worst case, O(m+n) average
# Space: O(m+n) for the result string
def largestMerge(word1: str, word2: str) -> str:
    """
    Constructs the lexicographically largest merge of two strings.

    The greedy approach: at each step, take from the string whose
    remaining suffix is lexicographically larger.
    """
    i, j = 0, 0  # Pointers for current positions in word1 and word2
    merge = []   # Using list for O(1) append, convert to string at end

    # Continue until we've exhausted both strings
    while i < len(word1) and j < len(word2):
        # Compare current characters
        if word1[i] > word2[j]:
            # word1's current char is larger, take it
            merge.append(word1[i])
            i += 1
        elif word1[i] < word2[j]:
            # word2's current char is larger, take it
            merge.append(word2[j])
            j += 1
        else:
            # Characters are equal - need to look ahead
            # Compare the remaining suffixes starting from current positions
            if word1[i:] >= word2[j:]:
                # word1's suffix is lexicographically larger or equal
                merge.append(word1[i])
                i += 1
            else:
                # word2's suffix is lexicographically larger
                merge.append(word2[j])
                j += 1

    # Append any remaining characters from word1
    while i < len(word1):
        merge.append(word1[i])
        i += 1

    # Append any remaining characters from word2
    while j < len(word2):
        merge.append(word2[j])
        j += 1

    # Convert list to string
    return ''.join(merge)
```

```javascript
// Time: O((m+n) * min(m,n)) in worst case, O(m+n) average
// Space: O(m+n) for the result string
function largestMerge(word1, word2) {
  /**
   * Constructs the lexicographically largest merge of two strings.
   *
   * The greedy approach: at each step, take from the string whose
   * remaining suffix is lexicographically larger.
   */
  let i = 0,
    j = 0; // Pointers for current positions in word1 and word2
  const merge = []; // Using array for O(1) push, join at end

  // Continue until we've exhausted both strings
  while (i < word1.length && j < word2.length) {
    // Compare current characters
    if (word1[i] > word2[j]) {
      // word1's current char is larger, take it
      merge.push(word1[i]);
      i++;
    } else if (word1[i] < word2[j]) {
      // word2's current char is larger, take it
      merge.push(word2[j]);
      j++;
    } else {
      // Characters are equal - need to look ahead
      // Compare the remaining suffixes starting from current positions
      // slice creates a substring from current position to end
      if (word1.slice(i) >= word2.slice(j)) {
        // word1's suffix is lexicographically larger or equal
        merge.push(word1[i]);
        i++;
      } else {
        // word2's suffix is lexicographically larger
        merge.push(word2[j]);
        j++;
      }
    }
  }

  // Append any remaining characters from word1
  while (i < word1.length) {
    merge.push(word1[i]);
    i++;
  }

  // Append any remaining characters from word2
  while (j < word2.length) {
    merge.push(word2[j]);
    j++;
  }

  // Convert array to string
  return merge.join("");
}
```

```java
// Time: O((m+n) * min(m,n)) in worst case, O(m+n) average
// Space: O(m+n) for the result string
class Solution {
    public String largestMerge(String word1, String word2) {
        /**
         * Constructs the lexicographically largest merge of two strings.
         *
         * The greedy approach: at each step, take from the string whose
         * remaining suffix is lexicographically larger.
         */
        int i = 0, j = 0;  // Pointers for current positions in word1 and word2
        StringBuilder merge = new StringBuilder();  // Efficient string builder

        // Continue until we've exhausted both strings
        while (i < word1.length() && j < word2.length()) {
            // Compare current characters
            if (word1.charAt(i) > word2.charAt(j)) {
                // word1's current char is larger, take it
                merge.append(word1.charAt(i));
                i++;
            } else if (word1.charAt(i) < word2.charAt(j)) {
                // word2's current char is larger, take it
                merge.append(word2.charAt(j));
                j++;
            } else {
                // Characters are equal - need to look ahead
                // Compare the remaining suffixes starting from current positions
                // substring creates a substring from current position to end
                if (word1.substring(i).compareTo(word2.substring(j)) >= 0) {
                    // word1's suffix is lexicographically larger or equal
                    merge.append(word1.charAt(i));
                    i++;
                } else {
                    // word2's suffix is lexicographically larger
                    merge.append(word2.charAt(j));
                    j++;
                }
            }
        }

        // Append any remaining characters from word1
        while (i < word1.length()) {
            merge.append(word1.charAt(i));
            i++;
        }

        // Append any remaining characters from word2
        while (j < word2.length()) {
            merge.append(word2.charAt(j));
            j++;
        }

        return merge.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- Best case: O(m+n) when characters are never equal (simple comparisons)
- Worst case: O((m+n) \* min(m,n)) when strings have long equal prefixes
  - Each time characters are equal, we compare suffixes which takes O(k) where k = min(remaining lengths)
  - In pathological cases like `"aaa...aaa"` and `"aaa...aaa"`, we compare suffixes at each step
- Average case: Closer to O(m+n) since most comparisons stop early

**Space Complexity:**

- O(m+n) for the output string
- O(1) additional space for pointers (excluding output storage)

## Common Mistakes

1. **Only comparing current characters without lookahead**: This fails on cases like `word1 = "abc"`, `word2 = "ab"`. Candidates might think: "both start with 'a', take from either" but should take from `word2` first because `"abc" > "ab"`.

2. **Inefficient suffix comparison**: Some candidates implement manual character-by-character comparison in the tie-breaking case. While correct, it's redundant since built-in string comparison does this optimally. Reinventing it often introduces bugs.

3. **Forgetting to append remaining characters**: After the main loop, one string might still have characters left. Failing to add these results in an incomplete merge.

4. **Using string concatenation instead of list/string builder**: In Python/JavaScript, `merge += char` creates a new string each time (O(n²) total). Using list/array with `join()` is O(n). In Java, `StringBuilder` is essential for efficiency.

## When You'll See This Pattern

This greedy-with-lookahead pattern appears in problems where you need to make optimal local decisions that depend on future information:

1. **Merge k Sorted Lists (Hard)**: Similar merging logic but with heap optimization for k lists
2. **Largest Number (Medium)**: Sort numbers based on custom comparator that looks at concatenation results
3. **Remove Duplicate Letters (Medium)**: Greedy choice depends on future occurrences of characters
4. **Split a String Into the Max Number of Unique Substrings (Medium)**: Greedy decisions with lookahead for uniqueness

The core idea: when a simple greedy choice isn't sufficient (comparing only current elements), compare the "future consequences" of each choice.

## Key Takeaways

1. **Greedy with lookahead**: When local decisions require future knowledge, compare not just current elements but their "remaining contexts." This transforms an exponential search space into linear/greedy.

2. **Lexicographic comparison is your friend**: Built-in string comparison handles the complex "which suffix is larger" logic correctly and efficiently. Don't reinvent it unless you need special behavior.

3. **Tie-breaking matters**: Many greedy problems are straightforward except for tie cases. Always ask: "What happens when the obvious comparison is equal?" This is often where the problem's true difficulty lies.

Related problems: [Maximum Matching of Players With Trainers](/problem/maximum-matching-of-players-with-trainers), [Decremental String Concatenation](/problem/decremental-string-concatenation)
