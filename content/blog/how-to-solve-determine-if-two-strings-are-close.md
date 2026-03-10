---
title: "How to Solve Determine if Two Strings Are Close — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Determine if Two Strings Are Close. Medium difficulty, 54.2% acceptance rate. Topics: Hash Table, String, Sorting, Counting."
date: "2027-04-03"
category: "dsa-patterns"
tags: ["determine-if-two-strings-are-close", "hash-table", "string", "sorting", "medium"]
---

# How to Solve "Determine if Two Strings Are Close"

This problem asks whether two strings can be made equal using two specific operations: swapping any two existing characters, or transforming all occurrences of one existing character into another existing character. The tricky part is recognizing that these operations aren't about the actual characters themselves, but about the underlying frequency patterns and character sets. You can't just check if the strings are anagrams—you need to understand what transformations are actually possible given the constraints.

## Visual Walkthrough

Let's trace through an example: `word1 = "aabc"` and `word2 = "bbca"`.

**Step 1: Check lengths**
Both strings have length 4, so we can proceed. If lengths were different, they couldn't possibly be made equal.

**Step 2: Check character sets**

- `word1` uses characters: `{a, b, c}`
- `word2` uses characters: `{b, c, a}` (same set!)

Since Operation 2 allows transforming all occurrences of one character to another (but only if both characters exist in the string), the strings must use exactly the same set of characters. If `word2` had a character not in `word1` (like 'd'), we couldn't create it from scratch.

**Step 3: Check frequency patterns**
Count character frequencies:

- `word1`: a:2, b:1, c:1
- `word2`: b:2, c:1, a:1

The frequencies are `[2, 1, 1]` for both, just assigned to different characters. Why does this work? Operation 1 (swaps) lets us rearrange characters arbitrarily, so the actual positions don't matter. Operation 2 lets us reassign frequencies between existing characters. For example, we could:

1. Transform all 'a's in `word1` to 'b's (now: b:3, c:1)
2. Transform one of the 'b's to 'a' (now: b:2, a:1, c:1)
3. Use swaps to arrange them as `"bbca"`

The key insight: **The multiset of frequencies must be the same for both strings**, ignoring which character has which frequency.

**Step 4: Counterexample**
Try `word1 = "aabb"` and `word2 = "ccdd"`.

- Character sets: `{a, b}` vs `{c, d}` → different! Can't transform 'a' to 'c' because 'c' doesn't exist in `word1`.
- Result: Not close.

## Brute Force Approach

A naive approach might try to simulate the operations, but there are exponentially many possibilities. Another brute force idea: generate all permutations of one string and check if any can be transformed into the other via Operation 2. This is O(n! \* n) time—completely infeasible even for moderate n.

Even checking all possible frequency reassignments would be factorial in the number of unique characters. The problem constraints (strings up to 10^5 characters) demand an O(n) or O(n log n) solution.

## Optimized Approach

The optimal solution comes from recognizing what the operations actually allow:

1. **Operation 1 (swaps)**: This means positions don't matter at all. We only care about character counts, not their arrangement. Any permutation is achievable through enough swaps.

2. **Operation 2 (transform all occurrences)**: This allows us to reassign a frequency from one character to another, but only if both characters exist in the string. This means:
   - The set of unique characters must be identical between both strings
   - We can redistribute frequencies among existing characters

**Key Insight**: Two strings are close if and only if:

1. They have the same length (obvious requirement)
2. They have the same set of unique characters
3. They have the same multiset of character frequencies (the sorted list of frequencies must match)

Why does condition 3 work? Operation 2 lets us swap frequencies between characters. If `word1` has frequencies [2, 2, 1] and `word2` has [2, 2, 1] (in any order), we can reassign them appropriately. But if `word1` has [3, 1, 1] and `word2` has [2, 2, 1], no reassignment can make them match—we'd need to split the count of 3 into two numbers that sum to 3, which isn't possible with these operations.

## Optimal Solution

Here's the implementation following our insights:

<div class="code-group">

```python
# Time: O(n) where n is length of strings
# Space: O(1) since we store at most 26 characters (constant space)
def closeStrings(word1: str, word2: str) -> bool:
    # Step 1: Check lengths - if different, impossible to be close
    if len(word1) != len(word2):
        return False

    # Step 2: Count frequencies for each character
    # We use arrays of size 26 since problem states strings contain only lowercase letters
    count1 = [0] * 26
    count2 = [0] * 26

    # Count frequencies for word1
    for ch in word1:
        count1[ord(ch) - ord('a')] += 1

    # Count frequencies for word2
    for ch in word2:
        count2[ord(ch) - ord('a')] += 1

    # Step 3: Check character sets - both strings must have same unique characters
    # A character exists if its count > 0
    for i in range(26):
        # XOR-like check: if one has the character and the other doesn't, return False
        if (count1[i] > 0) != (count2[i] > 0):
            return False

    # Step 4: Check frequency multisets - sorted frequencies must match
    # Sort the frequency arrays to compare distributions
    count1.sort()
    count2.sort()

    # If sorted frequencies match, strings are close
    return count1 == count2
```

```javascript
// Time: O(n) where n is length of strings
// Space: O(1) since we store at most 26 characters (constant space)
function closeStrings(word1, word2) {
  // Step 1: Check lengths - if different, impossible to be close
  if (word1.length !== word2.length) {
    return false;
  }

  // Step 2: Count frequencies for each character
  // We use arrays of size 26 since strings contain only lowercase letters
  const count1 = new Array(26).fill(0);
  const count2 = new Array(26).fill(0);

  // Count frequencies for word1
  for (let i = 0; i < word1.length; i++) {
    count1[word1.charCodeAt(i) - 97]++; // 'a' char code is 97
  }

  // Count frequencies for word2
  for (let i = 0; i < word2.length; i++) {
    count2[word2.charCodeAt(i) - 97]++;
  }

  // Step 3: Check character sets - both strings must have same unique characters
  // A character exists if its count > 0
  for (let i = 0; i < 26; i++) {
    // XOR-like check: if one has the character and the other doesn't, return false
    if (count1[i] > 0 !== count2[i] > 0) {
      return false;
    }
  }

  // Step 4: Check frequency multisets - sorted frequencies must match
  // Sort the frequency arrays to compare distributions
  count1.sort((a, b) => a - b);
  count2.sort((a, b) => a - b);

  // If sorted frequencies match, strings are close
  for (let i = 0; i < 26; i++) {
    if (count1[i] !== count2[i]) {
      return false;
    }
  }
  return true;
}
```

```java
// Time: O(n) where n is length of strings
// Space: O(1) since we store at most 26 characters (constant space)
class Solution {
    public boolean closeStrings(String word1, String word2) {
        // Step 1: Check lengths - if different, impossible to be close
        if (word1.length() != word2.length()) {
            return false;
        }

        // Step 2: Count frequencies for each character
        // We use arrays of size 26 since strings contain only lowercase letters
        int[] count1 = new int[26];
        int[] count2 = new int[26];

        // Count frequencies for word1
        for (char ch : word1.toCharArray()) {
            count1[ch - 'a']++;
        }

        // Count frequencies for word2
        for (char ch : word2.toCharArray()) {
            count2[ch - 'a']++;
        }

        // Step 3: Check character sets - both strings must have same unique characters
        // A character exists if its count > 0
        for (int i = 0; i < 26; i++) {
            // XOR-like check: if one has the character and the other doesn't, return false
            if ((count1[i] > 0) != (count2[i] > 0)) {
                return false;
            }
        }

        // Step 4: Check frequency multisets - sorted frequencies must match
        // Sort the frequency arrays to compare distributions
        Arrays.sort(count1);
        Arrays.sort(count2);

        // If sorted frequencies match, strings are close
        return Arrays.equals(count1, count2);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Counting characters: O(n) for each string, where n is the string length
- Checking character sets: O(26) = O(1) since we iterate over 26 possible characters
- Sorting frequency arrays: O(26 log 26) = O(1) since we're sorting fixed-size arrays of 26 elements
- Overall: O(n) + O(1) + O(1) = O(n)

**Space Complexity: O(1)**

- We use two arrays of size 26 each, regardless of input size
- This is constant space, not dependent on n

## Common Mistakes

1. **Only checking sorted strings**: Some candidates sort both strings and compare them, but this ignores Operation 2. Example: `"aabc"` and `"bbca"` sorted are `"aabc"` and `"abbc"`—not equal, but the strings ARE close.

2. **Only checking frequency counts without checking character sets**: Counting that both strings have the same frequency distribution (e.g., both have one character with frequency 2 and two with frequency 1) but forgetting to check if they use the same characters. Example: `"aabb"` (frequencies: [2,2]) and `"ccdd"` (frequencies: [2,2]) have same frequency distribution but different character sets, so they're NOT close.

3. **Incorrect frequency comparison**: Comparing frequencies in original order instead of sorting them. The frequencies [2, 1, 1] and [1, 2, 1] are the same multiset but different arrays. You must sort before comparing.

4. **Overcomplicating with graph theory**: Some candidates try to model this as a graph problem or use complex transformations. The simple three-condition check (same length, same character set, same sorted frequencies) is sufficient and efficient.

## When You'll See This Pattern

This problem combines frequency counting with set operations—a common pattern in string manipulation problems:

1. **Buddy Strings (Easy)**: Also checks string closeness under swap operations, but with stricter constraints (exactly one swap allowed).

2. **Minimum Number of Steps to Make Two Strings Anagram (Medium)**: Uses frequency counting to find differences between strings, similar to how we compare frequency distributions here.

3. **Group Anagrams (Medium)**: Uses character frequency patterns (often via sorted strings or frequency counts) to group related strings together.

4. **Custom Sort String (Medium)**: Involves rearranging characters based on frequency and custom ordering rules.

The core pattern is: when character positions don't matter (or can be rearranged), think in terms of frequency counts and character sets rather than actual sequences.

## Key Takeaways

1. **Operations define equivalence classes**: The allowed operations determine what properties must be preserved. Swaps mean order doesn't matter. Character transformations mean the actual characters don't matter as long as the set is preserved.

2. **Think in terms of invariants**: For transformation problems, identify what cannot change. Here, the length is invariant, the set of characters is invariant, and the multiset of frequencies is invariant.

3. **Frequency analysis + sorting solves many string problems**: When order doesn't matter, counting frequencies and sorting them often reveals the structure needed for comparison.

Related problems: [Buddy Strings](/problem/buddy-strings), [Minimum Swaps to Make Strings Equal](/problem/minimum-swaps-to-make-strings-equal), [Minimum Number of Steps to Make Two Strings Anagram](/problem/minimum-number-of-steps-to-make-two-strings-anagram)
