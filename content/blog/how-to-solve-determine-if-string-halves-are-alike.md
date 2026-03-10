---
title: "How to Solve Determine if String Halves Are Alike — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Determine if String Halves Are Alike. Easy difficulty, 78.8% acceptance rate. Topics: String, Counting."
date: "2027-07-31"
category: "dsa-patterns"
tags: ["determine-if-string-halves-are-alike", "string", "counting", "easy"]
---

# How to Solve "Determine if String Halves Are Alike"

This problem asks us to split a string of even length into two equal halves, then determine if both halves contain the same number of vowels. While conceptually straightforward, it tests your ability to work with string indices, character classification, and efficient counting. The interesting part is handling both uppercase and lowercase vowels while ensuring we only count vowels, not consonants.

## Visual Walkthrough

Let's trace through an example step by step to build intuition. Consider the input string `s = "book"`:

1. **Split the string**: Since the length is 4 (even), we split into two halves of length 2 each:
   - First half `a = "bo"` (indices 0-1)
   - Second half `b = "ok"` (indices 2-3)

2. **Count vowels in each half**:
   - For `"bo"`: 'b' is not a vowel, 'o' is a vowel → count = 1
   - For `"ok"`: 'o' is a vowel, 'k' is not a vowel → count = 1

3. **Compare counts**: Both halves have 1 vowel, so they are alike.

Now let's try `s = "textbook"` (length 8):

1. Split into halves of length 4:
   - First half: `"text"` (indices 0-3)
   - Second half: `"book"` (indices 4-7)

2. Count vowels:
   - `"text"`: 't' (no), 'e' (yes), 'x' (no), 't' (no) → count = 1
   - `"book"`: 'b' (no), 'o' (yes), 'o' (yes), 'k' (no) → count = 2

3. Compare: 1 ≠ 2, so they are not alike.

The key insight is that we need to efficiently check each character in both halves and count only the vowels.

## Brute Force Approach

A naive approach would be to:

1. Split the string into two separate strings
2. Count vowels in each string separately by iterating through each
3. Compare the counts

While this approach works, it's not optimal because:

- We create two new string objects (extra memory)
- We iterate through the entire string twice (once for each half)
- The logic for checking vowels is duplicated

However, for this problem, even the brute force approach would be acceptable since the constraints are small. The real optimization comes from doing everything in a single pass through the string.

## Optimal Solution

The optimal solution uses a single pass through the string with two pointers or indices. We can:

1. Calculate the midpoint of the string
2. Use one index `i` for the first half and another index `j` for the second half
3. Iterate through both halves simultaneously
4. Count vowels in each half
5. Compare the counts at the end

Alternatively, we can use a set for O(1) vowel lookup and iterate through the string once, adding to the count for the first half and subtracting for the second half, then check if the final count is zero.

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n) where n is the length of the string
# Space: O(1) since we only use a fixed-size set and a few variables
def halvesAreAlike(s: str) -> bool:
    # Step 1: Define a set of vowels for O(1) lookup
    # We include both lowercase and uppercase vowels
    vowels = set('aeiouAEIOU')

    # Step 2: Calculate the midpoint of the string
    # Since the string length is guaranteed to be even,
    # integer division gives us the exact split point
    mid = len(s) // 2

    # Step 3: Initialize counters for vowels in each half
    # We'll use a single counter that adds for first half,
    # subtracts for second half, then check if it's zero
    count = 0

    # Step 4: Iterate through the string
    for i in range(len(s)):
        if s[i] in vowels:
            # If we're in the first half (i < mid), increment count
            # If we're in the second half (i >= mid), decrement count
            if i < mid:
                count += 1
            else:
                count -= 1

    # Step 5: If count is 0, both halves have equal vowels
    # Positive count means first half has more vowels
    # Negative count means second half has more vowels
    return count == 0
```

```javascript
// Time: O(n) where n is the length of the string
// Space: O(1) since we only use a fixed-size set and a few variables
function halvesAreAlike(s) {
  // Step 1: Define a set of vowels for O(1) lookup
  // We include both lowercase and uppercase vowels
  const vowels = new Set(["a", "e", "i", "o", "u", "A", "E", "I", "O", "U"]);

  // Step 2: Calculate the midpoint of the string
  // Since the string length is guaranteed to be even,
  // integer division gives us the exact split point
  const mid = Math.floor(s.length / 2);

  // Step 3: Initialize counters for vowels in each half
  // We'll use a single counter that adds for first half,
  // subtracts for second half, then check if it's zero
  let count = 0;

  // Step 4: Iterate through the string
  for (let i = 0; i < s.length; i++) {
    if (vowels.has(s[i])) {
      // If we're in the first half (i < mid), increment count
      // If we're in the second half (i >= mid), decrement count
      if (i < mid) {
        count++;
      } else {
        count--;
      }
    }
  }

  // Step 5: If count is 0, both halves have equal vowels
  // Positive count means first half has more vowels
  // Negative count means second half has more vowels
  return count === 0;
}
```

```java
// Time: O(n) where n is the length of the string
// Space: O(1) since we only use a fixed-size set and a few variables
public boolean halvesAreAlike(String s) {
    // Step 1: Define a set of vowels for O(1) lookup
    // We include both lowercase and uppercase vowels
    Set<Character> vowels = new HashSet<>();
    String vowelStr = "aeiouAEIOU";
    for (char c : vowelStr.toCharArray()) {
        vowels.add(c);
    }

    // Step 2: Calculate the midpoint of the string
    // Since the string length is guaranteed to be even,
    // integer division gives us the exact split point
    int mid = s.length() / 2;

    // Step 3: Initialize counters for vowels in each half
    // We'll use a single counter that adds for first half,
    // subtracts for second half, then check if it's zero
    int count = 0;

    // Step 4: Iterate through the string
    for (int i = 0; i < s.length(); i++) {
        if (vowels.contains(s.charAt(i))) {
            // If we're in the first half (i < mid), increment count
            // If we're in the second half (i >= mid), decrement count
            if (i < mid) {
                count++;
            } else {
                count--;
            }
        }
    }

    // Step 5: If count is 0, both halves have equal vowels
    // Positive count means first half has more vowels
    // Negative count means second half has more vowels
    return count == 0;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once, performing O(1) operations for each character
- The vowel lookup using a hash set is O(1) on average
- Total operations scale linearly with the length of the string

**Space Complexity: O(1)**

- The vowel set contains exactly 10 characters (5 lowercase + 5 uppercase), which is constant
- We use a few integer variables (mid, count, i) which are also constant space
- No additional data structures that scale with input size

## Common Mistakes

1. **Forgetting uppercase vowels**: The problem explicitly mentions both lowercase and uppercase vowels. Candidates often check only lowercase or only uppercase. Always read the problem statement carefully and include all specified characters.

2. **Off-by-one errors in midpoint calculation**: When calculating `mid = len(s) // 2`, remember that integer division in most languages truncates toward zero. Since the length is guaranteed to be even, this works perfectly. However, some candidates try to use `(len(s) + 1) // 2` or similar, which can cause issues.

3. **Inefficient vowel checking**: Using a long `if` statement with multiple `or` conditions (e.g., `if c == 'a' or c == 'e' ...`) is less efficient than using a set for O(1) lookup. While both work for this problem, the set approach is cleaner and more extensible.

4. **Creating unnecessary substrings**: Some candidates create two new strings for the halves, which uses extra O(n) space. The optimal solution processes the string in place without creating substrings.

## When You'll See This Pattern

This problem uses several patterns common in string processing:

1. **Two-pointer technique**: While we used indices rather than explicit pointers, the concept of processing two parts of a data structure simultaneously is key. Similar problems include:
   - **Valid Palindrome** (LeetCode 125): Check if a string reads the same forward and backward, ignoring case and non-alphanumeric characters.
   - **Reverse String** (LeetCode 344): Reverse a string in-place using two pointers.

2. **Character counting with sets**: Using a set for O(1) membership testing is common when you need to check if characters belong to a specific group. Similar problems include:
   - **Jewels and Stones** (LeetCode 771): Count how many characters in one string appear in another string (the "jewels").
   - **First Unique Character in a String** (LeetCode 387): Find the first non-repeating character using frequency counting.

3. **Balanced counting**: The technique of adding for one group and subtracting for another, then checking if the result is zero, appears in problems like:
   - **Valid Parentheses** (LeetCode 20): Use a stack to ensure parentheses are properly balanced.
   - **Find the Difference** (LeetCode 389): Find the extra character in one string by using XOR or counting.

## Key Takeaways

1. **Use sets for O(1) membership testing**: When you need to check if elements belong to a fixed group, a set provides constant-time lookup and cleaner code than multiple `or` conditions.

2. **Process in a single pass when possible**: Instead of creating substrings and processing them separately, try to process the entire input in one iteration. This often leads to better time and space complexity.

3. **The "balance counter" technique is versatile**: Adding for one condition and subtracting for another, then checking if the result is zero, is a useful pattern for comparing two groups or checking balance conditions.

[Practice this problem on CodeJeet](/problem/determine-if-string-halves-are-alike)
