---
title: "How to Solve Maximum Number of Balloons — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Maximum Number of Balloons. Easy difficulty, 60.0% acceptance rate. Topics: Hash Table, String, Counting."
date: "2027-11-25"
category: "dsa-patterns"
tags: ["maximum-number-of-balloons", "hash-table", "string", "counting", "easy"]
---

# How to Solve Maximum Number of Balloons

This problem asks us to find how many times we can form the word "balloon" using characters from a given string, where each character can only be used once. What makes this interesting is that "balloon" has duplicate letters ('l' and 'o' appear twice), so we need to track character frequencies carefully to determine our limiting factor.

## Visual Walkthrough

Let's trace through an example: `text = "nlaebolko"`

**Step 1: Count all characters in the text**

- b: 1
- a: 1
- l: 2
- o: 2
- n: 2
- e: 1
- k: 1

**Step 2: Check requirements for "balloon"**
The word "balloon" requires:

- b: 1
- a: 1
- l: 2
- o: 2
- n: 1

**Step 3: Calculate how many "balloon"s we can make**
For each character in "balloon", we divide our available count by the required count:

- b: 1 ÷ 1 = 1
- a: 1 ÷ 1 = 1
- l: 2 ÷ 2 = 1
- o: 2 ÷ 2 = 1
- n: 2 ÷ 1 = 2

The bottleneck is the smallest result: **1**. So we can make 1 "balloon".

**Step 4: Verify**
Using characters: b, a, l, l, o, o, n (7 letters)
Remaining: e, k (unused)

## Brute Force Approach

A naive approach would be to repeatedly search for and remove complete sets of "balloon" characters from the text:

1. While the text contains all letters needed for "balloon":
   - For each character in "balloon":
     - Find and remove one occurrence from the text
   - Increment counter
2. Return counter

This approach has several problems:

- Removing characters from strings is O(n) each time
- We'd need to scan the string repeatedly
- Worst-case time complexity could be O(n × m) where n is text length and m is "balloon" length
- The code becomes messy with edge cases

The brute force is inefficient because we're doing repeated work counting characters. Instead, we should count once and calculate.

## Optimal Solution

The optimal solution uses frequency counting. We count all characters in the text, then determine how many complete "balloon"s we can form by dividing available counts by required counts, taking the minimum.

<div class="code-group">

```python
# Time: O(n) where n is length of text
# Space: O(1) since we store at most 26 character counts
def maxNumberOfBalloons(text: str) -> int:
    # Step 1: Count all characters in the input text
    # We use a dictionary to store character frequencies
    char_count = {}
    for char in text:
        char_count[char] = char_count.get(char, 0) + 1

    # Step 2: Check if we have all required characters for "balloon"
    # If any required character is missing, we can't form any balloons
    balloon_chars = ['b', 'a', 'l', 'o', 'n']
    for char in balloon_chars:
        if char not in char_count:
            return 0

    # Step 3: Calculate how many "balloon"s we can form
    # 'b', 'a', 'n' appear once in "balloon"
    # 'l' and 'o' appear twice in "balloon"
    # We take the minimum of available divided by required

    # For single-occurrence letters: available / 1
    b_count = char_count['b']
    a_count = char_count['a']
    n_count = char_count['n']

    # For double-occurrence letters: available / 2
    # Using integer division to get whole balloons
    l_count = char_count['l'] // 2
    o_count = char_count['o'] // 2

    # Step 4: The bottleneck determines our maximum
    # We can only form as many balloons as the limiting character allows
    return min(b_count, a_count, n_count, l_count, o_count)
```

```javascript
// Time: O(n) where n is length of text
// Space: O(1) since we store at most 26 character counts
function maxNumberOfBalloons(text) {
  // Step 1: Count all characters in the input text
  const charCount = {};
  for (const char of text) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Step 2: Check if we have all required characters for "balloon"
  // If any required character is missing, we can't form any balloons
  const balloonChars = ["b", "a", "l", "o", "n"];
  for (const char of balloonChars) {
    if (!charCount[char]) {
      return 0;
    }
  }

  // Step 3: Calculate how many "balloon"s we can form
  // 'b', 'a', 'n' appear once in "balloon"
  // 'l' and 'o' appear twice in "balloon"
  const bCount = charCount["b"];
  const aCount = charCount["a"];
  const nCount = charCount["n"];

  // Integer division for double letters
  const lCount = Math.floor(charCount["l"] / 2);
  const oCount = Math.floor(charCount["o"] / 2);

  // Step 4: The bottleneck determines our maximum
  return Math.min(bCount, aCount, nCount, lCount, oCount);
}
```

```java
// Time: O(n) where n is length of text
// Space: O(1) since we store at most 26 character counts
public int maxNumberOfBalloons(String text) {
    // Step 1: Count all characters in the input text
    int[] charCount = new int[26]; // 26 letters in English alphabet

    for (char c : text.toCharArray()) {
        charCount[c - 'a']++; // Convert char to index (0-25)
    }

    // Step 2: Check if we have all required characters for "balloon"
    // We need at least: 1 b, 1 a, 2 l, 2 o, 1 n
    // If any is missing (count = 0), return 0 immediately

    // Step 3: Calculate how many "balloon"s we can form
    // 'b', 'a', 'n' appear once in "balloon"
    int bCount = charCount['b' - 'a']; // index 1
    int aCount = charCount['a' - 'a']; // index 0
    int nCount = charCount['n' - 'a']; // index 13

    // 'l' and 'o' appear twice in "balloon"
    // Use integer division since we need whole pairs
    int lCount = charCount['l' - 'a'] / 2; // index 11
    int oCount = charCount['o' - 'a'] / 2; // index 14

    // Step 4: The bottleneck determines our maximum
    // We can only form as many balloons as the limiting character allows
    return Math.min(Math.min(Math.min(bCount, aCount), Math.min(lCount, oCount)), nCount);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the input string once to count characters: O(n)
- We then perform constant-time operations to calculate the result: O(1)
- Total: O(n) where n is the length of the input string

**Space Complexity: O(1)**

- We store character counts in a fixed-size data structure
- For the dictionary approach: at most 26 entries (English alphabet)
- For the array approach: exactly 26 integers
- Both are constant space regardless of input size

## Common Mistakes

1. **Forgetting that 'l' and 'o' appear twice**: The most common error is treating all letters equally and simply checking if each letter exists. Candidates often miss that "balloon" needs two 'l's and two 'o's, so the available count for these letters must be divided by 2.

2. **Not handling missing characters**: If the text doesn't contain all required letters, we should return 0. Some candidates forget to check for missing letters and get runtime errors when trying to access undefined dictionary keys or array indices.

3. **Using floating-point division**: When dividing counts for 'l' and 'o', we need integer division (floor division). Using regular division in languages like Python 3 gives a float, which can't be used with `min()` alongside integers.

4. **Overcomplicating with removal logic**: Some candidates try to actually remove characters from the string or modify counts, which is unnecessary. We only need to calculate mathematically once we have the counts.

## When You'll See This Pattern

This frequency counting pattern appears in many string manipulation problems:

1. **Ransom Note (LeetCode 383)**: Similar concept - check if you can form one string using characters from another. The main difference is that "ransomNote" can have any characters, while here we're specifically forming "balloon".

2. **Find Words That Can Be Formed by Characters (LeetCode 1160)**: Count characters available, then check which words can be formed from those characters. This extends the pattern to multiple target strings.

3. **First Unique Character in a String (LeetCode 387)**: Uses character counting to find frequencies, then scans to find the first character with count 1.

The core pattern is: when you need to compare character availability between strings, count frequencies first, then compare mathematically rather than manipulating the strings directly.

## Key Takeaways

1. **Frequency counting solves many string problems**: When a problem involves checking if one string can be formed from another, or comparing character availability, counting frequencies is usually the right first step.

2. **Identify the bottleneck**: In problems like this, the answer is determined by the most limited resource (the character we have the least of relative to its requirement). Look for the minimum ratio.

3. **Pay attention to character multiplicities**: Always check if letters appear multiple times in the target word. The requirement isn't just "has the letter" but "has enough copies of the letter".

[Practice this problem on CodeJeet](/problem/maximum-number-of-balloons)
