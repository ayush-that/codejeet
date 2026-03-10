---
title: "How to Solve Reverse String Prefix — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reverse String Prefix. Easy difficulty, 89.4% acceptance rate. Topics: Two Pointers, String."
date: "2028-06-17"
category: "dsa-patterns"
tags: ["reverse-string-prefix", "two-pointers", "string", "easy"]
---

# How to Solve Reverse String Prefix

You're given a string `s` and an integer `k`. Your task is to reverse only the first `k` characters of the string while leaving the rest unchanged. While this problem seems straightforward, it tests your understanding of string manipulation, boundary conditions, and the two-pointer technique—all fundamental skills for coding interviews.

## Visual Walkthrough

Let's trace through an example to build intuition. Suppose we have `s = "abcdefg"` and `k = 4`.

**Step 1:** Identify the substring to reverse

- We need to reverse the first 4 characters: `"abcd"`
- The remaining characters `"efg"` stay as they are

**Step 2:** Reverse the prefix

- Start with `"abcd"`
- Swap first and last: `"dbca"` (swap 'a' and 'd')
- Swap inner pair: `"dcba"` (swap 'b' and 'c')
- Result: `"dcba"`

**Step 3:** Combine with the rest

- Append the unchanged suffix: `"efg"`
- Final result: `"dcbaefg"`

**Visual representation:**

```
Original:  a  b  c  d  e  f  g
           ↑  ↑  ↑  ↑
Reverse these 4 characters

Step 1:    d  b  c  a  e  f  g  (swap a↔d)
Step 2:    d  c  b  a  e  f  g  (swap b↔c)
Final:     d  c  b  a  e  f  g
```

Notice that we only need to swap characters up to the middle of the prefix—once we reach the center, all swaps are complete.

## Brute Force Approach

A naive approach might involve creating a new string by manually building it character by character. While this works, it's unnecessarily complex:

1. Create an empty result string
2. Append characters from index `k-1` down to `0` (reversed prefix)
3. Append characters from index `k` to the end (unchanged suffix)

This approach works but involves unnecessary string concatenation operations, which can be inefficient in some languages (especially when strings are immutable). More importantly, it doesn't demonstrate the optimal in-place reversal technique that interviewers look for.

The real "brute force" mistake would be trying to reverse the entire string or using complex data structures when a simple two-pointer swap is sufficient.

## Optimal Solution

The optimal solution uses the two-pointer technique to reverse the prefix in-place (or in a mutable character array). We convert the string to a character array, use two pointers starting at the beginning and end of the prefix, swap characters, and move pointers toward the center until they meet.

<div class="code-group">

```python
# Time: O(k) - We process k/2 swaps
# Space: O(n) - We create a character array of length n
def reversePrefix(s: str, k: int) -> str:
    # Convert string to list of characters for in-place modification
    # Strings are immutable in Python, so we need a mutable structure
    chars = list(s)

    # Initialize two pointers: left at start, right at end of prefix
    left = 0
    right = k - 1

    # Swap characters until pointers meet or cross
    while left < right:
        # Temporary swap using Python's tuple unpacking
        chars[left], chars[right] = chars[right], chars[left]

        # Move pointers toward the center
        left += 1
        right -= 1

    # Convert character list back to string
    return ''.join(chars)
```

```javascript
// Time: O(k) - We process k/2 swaps
// Space: O(n) - We create a character array of length n
function reversePrefix(s, k) {
  // Convert string to array of characters for in-place modification
  // Strings are immutable in JavaScript, so we need an array
  const chars = s.split("");

  // Initialize two pointers: left at start, right at end of prefix
  let left = 0;
  let right = k - 1;

  // Swap characters until pointers meet or cross
  while (left < right) {
    // Temporary variable for swapping
    const temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;

    // Move pointers toward the center
    left++;
    right--;
  }

  // Convert character array back to string
  return chars.join("");
}
```

```java
// Time: O(k) - We process k/2 swaps
// Space: O(n) - We create a character array of length n
public String reversePrefix(String s, int k) {
    // Convert string to character array for in-place modification
    // Strings are immutable in Java, so we need a char array
    char[] chars = s.toCharArray();

    // Initialize two pointers: left at start, right at end of prefix
    int left = 0;
    int right = k - 1;

    // Swap characters until pointers meet or cross
    while (left < right) {
        // Temporary variable for swapping
        char temp = chars[left];
        chars[left] = chars[right];
        chars[right] = temp;

        // Move pointers toward the center
        left++;
        right--;
    }

    // Convert character array back to string
    return new String(chars);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(k)**

- We perform approximately k/2 swaps (each swap is O(1))
- The while loop runs until `left < right`, which happens k/2 times
- Converting between string and character array is O(n), but this is typically considered preprocessing

**Space Complexity: O(n)**

- We create a character array of length n (where n is the length of the string)
- The auxiliary space is O(n) because strings are immutable in most languages
- If we could modify the string in-place, space complexity would be O(1)

**Why not O(1) space?**
In languages like Python, JavaScript, and Java, strings are immutable. We must create a new character array to modify the characters, which takes O(n) space. In languages with mutable strings (like C++), this could be done in O(1) space.

## Common Mistakes

### 1. Off-by-one errors with the right pointer

**Mistake:** Setting `right = k` instead of `right = k - 1`
**Why it happens:** Forgetting that string indices are zero-based
**How to avoid:** Remember that if you want to reverse the first k characters, the last character to reverse is at index `k-1`

### 2. Not handling edge cases

**Mistake:** Assuming k is always less than or equal to the string length
**Why it happens:** Not reading the problem constraints carefully
**How to avoid:** Check if `k > s.length()` - in this case, you should reverse the entire string (or handle according to problem requirements)

### 3. Incorrect loop condition

**Mistake:** Using `left <= right` instead of `left < right`
**Why it happens:** Forgetting that when pointers meet, there's nothing to swap
**How to avoid:** Visualize with a small example - when left = right, you're at the middle character which doesn't need swapping

### 4. Forgetting string immutability

**Mistake:** Trying to modify the string directly like `s[i] = s[j]`
**Why it happens:** Not remembering that strings are immutable in many languages
**How to avoid:** Always convert to a character array/list first when you need to modify individual characters

## When You'll See This Pattern

The two-pointer reversal technique appears in many string and array problems:

1. **Reverse String (LeetCode 344)** - The exact same pattern but applied to the entire string instead of a prefix
2. **Reverse Vowels of a String (LeetCode 345)** - Similar two-pointer approach but with condition checking for vowels
3. **Valid Palindrome (LeetCode 125)** - Uses two pointers moving toward the center, though without swapping
4. **Rotate Array (LeetCode 189)** - Often solved using three reversal operations

The core insight is that when you need to reverse a contiguous segment of an array or string, the two-pointer swap is usually the most efficient approach. This pattern extends to linked list reversal as well, though with different pointer mechanics.

## Key Takeaways

1. **Two-pointer swap is optimal for reversal problems** - When you need to reverse elements in an array or string, consider using two pointers starting at the ends and moving toward the center, swapping as they go.

2. **Mind the immutability** - In many languages, strings are immutable. Always convert to a character array when you need to modify individual characters, then convert back when done.

3. **Visualize with small examples** - Before coding, trace through a small example (like we did with "abcdefg", k=4) to understand the pointer movements and avoid off-by-one errors.

4. **Check boundary conditions** - Always consider what happens when k equals 0, 1, the string length, or exceeds the string length. These edge cases often reveal bugs in the logic.

[Practice this problem on CodeJeet](/problem/reverse-string-prefix)
