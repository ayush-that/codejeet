---
title: "How to Solve Construct K Palindrome Strings — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Construct K Palindrome Strings. Medium difficulty, 68.6% acceptance rate. Topics: Hash Table, String, Greedy, Counting."
date: "2028-09-02"
category: "dsa-patterns"
tags: ["construct-k-palindrome-strings", "hash-table", "string", "greedy", "medium"]
---

# How to Solve Construct K Palindrome Strings

This problem asks whether we can rearrange all characters from a given string `s` to form exactly `k` non-empty palindromes. The challenge lies in understanding the mathematical constraints of palindrome construction — specifically, how character frequencies determine what's possible.

What makes this interesting is that we don't actually need to construct the palindromes. We just need to determine if it's _possible_, which reduces to checking a simple condition about character counts.

## Visual Walkthrough

Let's trace through an example: `s = "annabelle"`, `k = 2`

**Step 1: Count character frequencies**

- a: 2
- n: 2
- e: 2
- b: 1
- l: 2

**Step 2: Identify odd-count characters**
Characters with odd frequencies: b (1 odd count)

**Step 3: Apply the key insight**
For palindrome construction:

1. Each palindrome can have at most one character with an odd frequency (the middle character)
2. Therefore, we need at least as many palindromes as we have odd-count characters
3. We also cannot have more palindromes than the total length of the string (since each must be non-empty)

In our example: 1 odd-count character, k = 2

- We have enough palindromes (2 ≥ 1) to accommodate the odd characters
- We have enough characters (8 ≥ 2) to make k non-empty palindromes
- Result: **True** (we can make 2 palindromes)

Another example: `s = "leetcode"`, `k = 3`

Frequencies: l:1, e:3, t:1, c:1, o:1, d:1
Odd-count characters: l, t, c, o, d (5 odd counts)

We have 5 odd-count characters but only k=3 palindromes.
Since 3 < 5, we cannot place all odd characters in middle positions.
Result: **False**

## Brute Force Approach

A naive approach might try to actually construct the palindromes through backtracking or generate all possible partitions. For example:

1. Generate all possible ways to partition the characters into k groups
2. For each partition, check if each group can form a palindrome
3. Return true if any valid partition exists

The problem with this approach is combinatorial explosion. With n characters and k groups, the number of partitions grows exponentially. Even checking if a single group can form a palindrome requires examining character frequencies.

For a string of length n, there are O(kⁿ) possible partitions to consider, making this approach completely impractical for any reasonable input size.

## Optimized Approach

The key insight comes from understanding palindrome properties:

1. **Palindrome Characteristic**: A string is a palindrome if it reads the same forwards and backwards. This means for most characters, they must come in pairs (one on each side of the center). At most one character can appear an odd number of times (the center character).

2. **Multiple Palindromes**: When constructing k palindromes, each palindrome can accommodate at most one character with an odd frequency as its center. Therefore, we need at least as many palindromes as we have characters with odd frequencies.

3. **Non-empty Constraint**: Each palindrome must be non-empty, so we cannot have more palindromes than we have total characters.

This leads to our two simple conditions:

- `k >= count_of_odd_frequencies` (enough palindromes for odd characters)
- `k <= len(s)` (enough characters for k non-empty palindromes)

The second condition is obvious but important to check.

## Optimal Solution

The solution is surprisingly simple: count character frequencies, count how many have odd frequencies, and check the two conditions above.

<div class="code-group">

```python
# Time: O(n) where n is the length of string s
# Space: O(1) because we store at most 26 character counts
def canConstruct(s: str, k: int) -> bool:
    # If k is greater than the string length, impossible
    # because each palindrome must be non-empty
    if k > len(s):
        return False

    # Count frequency of each character
    char_count = {}
    for char in s:
        char_count[char] = char_count.get(char, 0) + 1

    # Count how many characters have odd frequency
    odd_count = 0
    for count in char_count.values():
        if count % 2 == 1:
            odd_count += 1

    # We need at least 'odd_count' palindromes because
    # each palindrome can have at most one odd-frequency character
    # (as its center)
    return k >= odd_count
```

```javascript
// Time: O(n) where n is the length of string s
// Space: O(1) because we store at most 26 character counts
function canConstruct(s, k) {
  // If k is greater than the string length, impossible
  // because each palindrome must be non-empty
  if (k > s.length) {
    return false;
  }

  // Count frequency of each character
  const charCount = new Map();
  for (const char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // Count how many characters have odd frequency
  let oddCount = 0;
  for (const count of charCount.values()) {
    if (count % 2 === 1) {
      oddCount++;
    }
  }

  // We need at least 'oddCount' palindromes because
  // each palindrome can have at most one odd-frequency character
  // (as its center)
  return k >= oddCount;
}
```

```java
// Time: O(n) where n is the length of string s
// Space: O(1) because we store at most 26 character counts
class Solution {
    public boolean canConstruct(String s, int k) {
        // If k is greater than the string length, impossible
        // because each palindrome must be non-empty
        if (k > s.length()) {
            return false;
        }

        // Count frequency of each character
        int[] charCount = new int[26];
        for (char c : s.toCharArray()) {
            charCount[c - 'a']++;
        }

        // Count how many characters have odd frequency
        int oddCount = 0;
        for (int count : charCount) {
            if (count % 2 == 1) {
                oddCount++;
            }
        }

        // We need at least 'oddCount' palindromes because
        // each palindrome can have at most one odd-frequency character
        // (as its center)
        return k >= oddCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once to count character frequencies: O(n)
- We iterate through the frequency counts (at most 26 for lowercase English letters): O(1)
- Total: O(n)

**Space Complexity: O(1)**

- We store character counts in a fixed-size array or map
- For lowercase English letters, we need at most 26 counts
- Even with Unicode, the space is constant relative to input size (bounded by character set)

## Common Mistakes

1. **Forgetting the non-empty constraint**: Candidates sometimes check only `k >= odd_count` but forget that `k` cannot exceed the string length. Each palindrome must be non-empty, so we need at least k characters total.

2. **Overcomplicating with actual construction**: Some candidates try to actually build the palindromes or find specific arrangements. The problem only asks if it's possible, not to provide the actual palindromes. Recognizing this is key to the simple solution.

3. **Incorrect odd count logic**: A subtle mistake is thinking we need `k == odd_count` instead of `k >= odd_count`. We can always add even-frequency characters to any palindrome, so having extra palindromes (k > odd_count) is fine as long as we have enough characters.

4. **Not handling edge cases**:
   - When k = 0 (should return false unless string is also empty, but problem states k ≥ 1)
   - When string is empty (should return false unless k = 0, but k ≥ 1)
   - When all characters have even frequencies (odd_count = 0, so k can be any value ≤ n)

## When You'll See This Pattern

This problem uses **character frequency counting** and **parity reasoning** — patterns that appear in many string and palindrome problems:

1. **Valid Palindrome II (LeetCode 680)**: Similar parity reasoning about allowing one "mismatch" (like allowing one odd-count character).

2. **Palindrome Permutation (LeetCode 266)**: The single-palindrome version of this problem — checking if a string can be rearranged into a palindrome (odd_count ≤ 1).

3. **Longest Palindrome (LeetCode 409)**: Building the longest palindrome from a set of characters uses similar logic about pairing characters and allowing one odd-count character in the center.

The core pattern is: when dealing with palindromes, think about character frequencies and parity (even/odd counts). This often reduces complex arrangement problems to simple counting problems.

## Key Takeaways

1. **Palindrome = pairing + at most one singleton**: A palindrome requires characters in symmetric pairs, with at most one character appearing an odd number of times as the center.

2. **Counting beats construction**: For "is it possible" questions about rearrangements, often you only need to check aggregate properties (like frequency counts) rather than trying to actually construct the arrangement.

3. **Multiple constraints often combine simply**: The solution combines two independent constraints (enough palindromes for odd characters, enough characters for palindromes) with a simple `and` condition.

[Practice this problem on CodeJeet](/problem/construct-k-palindrome-strings)
