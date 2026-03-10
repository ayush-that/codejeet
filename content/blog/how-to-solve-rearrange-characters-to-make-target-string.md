---
title: "How to Solve Rearrange Characters to Make Target String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Rearrange Characters to Make Target String. Easy difficulty, 61.1% acceptance rate. Topics: Hash Table, String, Counting."
date: "2028-05-31"
category: "dsa-patterns"
tags: ["rearrange-characters-to-make-target-string", "hash-table", "string", "counting", "easy"]
---

# How to Solve Rearrange Characters to Make Target String

You're given two strings: `s` (your source of characters) and `target` (the string you want to build). Your task is to determine how many complete copies of `target` you can form by rearranging characters from `s`. What makes this problem interesting is that it's not about finding substrings or subsequences—it's about counting character frequencies and determining the limiting factor for how many complete sets you can assemble.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose:

- `s = "abbcccdddd"`
- `target = "abcd"`

**Step 1: Count characters in `target`**

- 'a': 1
- 'b': 1
- 'c': 1
- 'd': 1

**Step 2: Count characters in `s`**

- 'a': 1
- 'b': 2
- 'c': 3
- 'd': 4

**Step 3: Determine how many copies we can make**
For each character in `target`, we check how many copies we have in `s`:

- 'a': We have 1 in `s`, need 1 per copy → can make 1 copy
- 'b': We have 2 in `s`, need 1 per copy → can make 2 copies
- 'c': We have 3 in `s`, need 1 per copy → can make 3 copies
- 'd': We have 4 in `s`, need 1 per copy → can make 4 copies

The limiting factor is 'a' with only 1 available, so we can make **1** complete copy of "abcd".

Now let's try another example: `s = "aaabbbccc"`, `target = "abc"`

- Target counts: a:1, b:1, c:1
- Source counts: a:3, b:3, c:3
- For each character: we can make 3 copies of each
- Minimum is 3, so we can make **3** copies

The pattern is clear: For each character in `target`, we divide how many we have in `s` by how many we need per copy, then take the minimum across all characters.

## Brute Force Approach

A naive approach might try to repeatedly remove characters from `s` to form `target` until we can't form another copy:

1. Make a copy of `s` as a list
2. Try to form `target` by checking if all characters exist in the list
3. If yes, remove those characters and increment count
4. Repeat until we can't form `target`

This approach has several problems:

- It's inefficient: O(n × m) where n is length of `s` and m is length of `target`
- Removing characters from lists/strings is expensive
- We're doing repeated work counting characters each time

The key insight is that we don't need to actually rearrange or remove characters—we just need to know if we have enough of each character type. This is a frequency counting problem.

## Optimal Solution

The optimal solution uses character frequency counting. We count how many times each character appears in both strings, then for each character in `target`, we calculate how many complete copies we could make based on the available count in `s`. The answer is the minimum of these ratios.

<div class="code-group">

```python
# Time: O(n + m) where n = len(s), m = len(target)
# Space: O(1) since we store at most 26 characters for each counter
def rearrangeCharacters(s: str, target: str) -> int:
    # Step 1: Count character frequencies in source string
    s_count = [0] * 26  # Array for 26 lowercase letters
    for char in s:
        s_count[ord(char) - ord('a')] += 1

    # Step 2: Count character frequencies in target string
    target_count = [0] * 26
    for char in target:
        target_count[ord(char) - ord('a')] += 1

    # Step 3: Calculate maximum copies possible
    max_copies = float('inf')  # Start with infinity as our upper bound

    # For each character that appears in target
    for i in range(26):
        if target_count[i] > 0:  # Only check characters needed for target
            if s_count[i] == 0:  # If we don't have this character at all
                return 0  # Can't make any copies

            # How many copies can we make with this character?
            # Divide available count by needed count per copy
            copies_with_char = s_count[i] // target_count[i]

            # Update overall maximum copies (minimum across all characters)
            max_copies = min(max_copies, copies_with_char)

    return max_copies
```

```javascript
// Time: O(n + m) where n = s.length, m = target.length
// Space: O(1) since we store at most 26 characters for each counter
function rearrangeCharacters(s, target) {
  // Step 1: Count character frequencies in source string
  const sCount = new Array(26).fill(0);
  for (const char of s) {
    sCount[char.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Step 2: Count character frequencies in target string
  const targetCount = new Array(26).fill(0);
  for (const char of target) {
    targetCount[char.charCodeAt(0) - "a".charCodeAt(0)]++;
  }

  // Step 3: Calculate maximum copies possible
  let maxCopies = Infinity; // Start with infinity as our upper bound

  // For each character that appears in target
  for (let i = 0; i < 26; i++) {
    if (targetCount[i] > 0) {
      // Only check characters needed for target
      if (sCount[i] === 0) {
        // If we don't have this character at all
        return 0; // Can't make any copies
      }

      // How many copies can we make with this character?
      // Divide available count by needed count per copy
      const copiesWithChar = Math.floor(sCount[i] / targetCount[i]);

      // Update overall maximum copies (minimum across all characters)
      maxCopies = Math.min(maxCopies, copiesWithChar);
    }
  }

  return maxCopies;
}
```

```java
// Time: O(n + m) where n = s.length(), m = target.length()
// Space: O(1) since we store at most 26 characters for each counter
public int rearrangeCharacters(String s, String target) {
    // Step 1: Count character frequencies in source string
    int[] sCount = new int[26];
    for (char c : s.toCharArray()) {
        sCount[c - 'a']++;
    }

    // Step 2: Count character frequencies in target string
    int[] targetCount = new int[26];
    for (char c : target.toCharArray()) {
        targetCount[c - 'a']++;
    }

    // Step 3: Calculate maximum copies possible
    int maxCopies = Integer.MAX_VALUE;  // Start with max value as our upper bound

    // For each character that appears in target
    for (int i = 0; i < 26; i++) {
        if (targetCount[i] > 0) {  // Only check characters needed for target
            if (sCount[i] == 0) {  // If we don't have this character at all
                return 0;  // Can't make any copies
            }

            // How many copies can we make with this character?
            // Divide available count by needed count per copy
            int copiesWithChar = sCount[i] / targetCount[i];

            // Update overall maximum copies (minimum across all characters)
            maxCopies = Math.min(maxCopies, copiesWithChar);
        }
    }

    return maxCopies;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- We iterate through `s` once to count character frequencies: O(n)
- We iterate through `target` once to count character frequencies: O(m)
- We iterate through 26 possible characters to calculate the minimum: O(26) = O(1)
- Total: O(n + m + 26) = O(n + m)

**Space Complexity: O(1)**

- We use two fixed-size arrays of length 26 (one for each string)
- This is constant space regardless of input size
- Even if we used hash maps, the space would still be O(1) since there are only 26 possible lowercase letters

## Common Mistakes

1. **Not handling characters that appear in `target` but not in `s`**
   - If a character in `target` doesn't exist in `s`, we can't make any copies
   - Solution: Check for this case early and return 0

2. **Using integer division incorrectly**
   - When calculating `s_count[i] // target_count[i]`, ensure you're using integer division
   - In JavaScript, use `Math.floor()` since regular division returns a float
   - Mistake: `sCount[i] / targetCount[i]` in JavaScript gives a decimal

3. **Forgetting that characters are lowercase only**
   - The problem states strings consist of lowercase English letters
   - This allows us to use arrays of size 26 instead of hash maps
   - If you use hash maps, that's fine too, but arrays are more efficient

4. **Incorrect initialization of max_copies**
   - Starting with 0 or a small number can give wrong results
   - Solution: Start with infinity (or a very large number) so the first `min()` comparison works correctly

## When You'll See This Pattern

This frequency counting pattern appears in many string and array problems:

1. **Find Words That Can Be Formed by Characters (LeetCode 1160)**
   - Very similar problem: Count characters in a "chars" string, then check which words can be formed
   - Uses the same character frequency comparison technique

2. **Maximum Number of Occurrences of a Substring (LeetCode 1297)**
   - Requires counting character frequencies to determine valid substrings
   - Builds on the same frequency analysis concept

3. **Ransom Note (LeetCode 383)**
   - Check if you can form one string from characters of another
   - Same core idea but only needs a boolean answer (can/cannot form) instead of count

4. **Valid Anagram (LeetCode 242)**
   - Compare character frequencies between two strings
   - Simpler version: just check if frequencies are equal

The pattern is: When you need to compare availability of items (characters, numbers, etc.) between two collections, frequency counting with arrays or hash maps is often the solution.

## Key Takeaways

1. **Frequency counting transforms comparison problems into simple arithmetic**
   - Instead of trying to match characters directly, count them first
   - Then compare counts to answer the question

2. **The limiting factor principle**
   - When assembling multiple copies of something, the resource with the smallest supply-to-demand ratio determines how many you can make
   - This applies to manufacturing, resource allocation, and many other domains

3. **Array indexing with character codes is efficient for fixed alphabets**
   - When you know the character set is small (like 26 lowercase letters), use `ord(char) - ord('a')` for array indexing
   - This is faster and uses less memory than hash maps

Related problems: [Find Words That Can Be Formed by Characters](/problem/find-words-that-can-be-formed-by-characters), [Maximum Number of Occurrences of a Substring](/problem/maximum-number-of-occurrences-of-a-substring)
