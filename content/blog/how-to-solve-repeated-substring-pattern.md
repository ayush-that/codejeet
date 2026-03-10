---
title: "How to Solve Repeated Substring Pattern — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Repeated Substring Pattern. Easy difficulty, 47.9% acceptance rate. Topics: String, String Matching."
date: "2027-03-09"
category: "dsa-patterns"
tags: ["repeated-substring-pattern", "string", "string-matching", "easy"]
---

# How to Solve Repeated Substring Pattern

This problem asks us to determine if a given string can be formed by repeating a smaller substring multiple times. What makes this problem interesting is that while it seems straightforward, there are several clever approaches that reveal important insights about string properties and pattern matching. The challenge lies in finding an efficient solution that doesn't require checking every possible substring length.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider the string `"ababab"`.

**Step 1: Understanding the pattern**
If `"ababab"` can be formed by repeating a substring, that substring must be a divisor of the total length. The length is 6, so possible substring lengths are 1, 2, 3, and 6 (but 6 would just be the whole string).

**Step 2: Testing length 1**
If the substring length is 1, the substring would be `"a"`. Repeating `"a"` 6 times gives `"aaaaaa"`, which doesn't match `"ababab"`.

**Step 3: Testing length 2**
If the substring length is 2, the substring would be `"ab"`. Repeating `"ab"` 3 times gives `"ababab"`, which matches exactly!

**Step 4: The insight**
Notice that for `"ababab"`, if we concatenate it with itself to get `"abababababab"` and remove the first and last characters, we get `"bababababab"`. The original string `"ababab"` appears in this modified string. This isn't a coincidence - it's a mathematical property of repeated strings.

**Step 5: Why this works**
For a string `s` that can be formed by repeating substring `t`, we have `s = t + t + ... + t` (k times). When we create `s + s = t + t + ... + t + t + t + ... + t` (2k times), removing the first and last characters leaves us with a string that contains `s` in the middle. If `s` doesn't have this repeating property, `s` won't appear in the modified `s + s`.

## Brute Force Approach

The most straightforward approach is to check every possible substring length that divides the total length. For each candidate length, extract the substring and check if repeating it the appropriate number of times reconstructs the original string.

**Why this is inefficient:**

- We need to check all divisors of `n` (where `n` is the string length)
- For each divisor `d`, we need to build a new string of length `n` by repeating the first `d` characters
- This gives us O(n × number_of_divisors) time complexity
- While this might be acceptable for small inputs, it's not optimal

<div class="code-group">

```python
# Time: O(n × number_of_divisors) | Space: O(n)
def repeatedSubstringPattern_brute(s: str) -> bool:
    n = len(s)

    # Check all possible substring lengths
    for length in range(1, n // 2 + 1):
        # Only consider lengths that divide n evenly
        if n % length == 0:
            # Get the candidate substring
            substring = s[:length]
            # Build the string by repeating the substring
            constructed = substring * (n // length)
            # Check if it matches the original
            if constructed == s:
                return True
    return False
```

```javascript
// Time: O(n × number_of_divisors) | Space: O(n)
function repeatedSubstringPatternBrute(s) {
  const n = s.length;

  // Check all possible substring lengths
  for (let length = 1; length <= Math.floor(n / 2); length++) {
    // Only consider lengths that divide n evenly
    if (n % length === 0) {
      // Get the candidate substring
      const substring = s.substring(0, length);
      // Build the string by repeating the substring
      const constructed = substring.repeat(n / length);
      // Check if it matches the original
      if (constructed === s) {
        return true;
      }
    }
  }
  return false;
}
```

```java
// Time: O(n × number_of_divisors) | Space: O(n)
public boolean repeatedSubstringPatternBrute(String s) {
    int n = s.length();

    // Check all possible substring lengths
    for (int length = 1; length <= n / 2; length++) {
        // Only consider lengths that divide n evenly
        if (n % length == 0) {
            // Get the candidate substring
            String substring = s.substring(0, length);
            // Build the string by repeating the substring
            StringBuilder constructed = new StringBuilder();
            for (int i = 0; i < n / length; i++) {
                constructed.append(substring);
            }
            // Check if it matches the original
            if (constructed.toString().equals(s)) {
                return true;
            }
        }
    }
    return false;
}
```

</div>

## Optimal Solution

The most elegant solution uses the concatenation trick we saw in the visual walkthrough. If a string `s` can be formed by repeating a substring, then `s` must appear in `(s + s)` with the first and last characters removed. This approach is both efficient and clever.

**Why this works mathematically:**
If `s = t + t + ... + t` (k times, where k ≥ 2), then:

- `s + s = t + t + ... + t + t + t + ... + t` (2k times)
- Removing first character removes first `t`
- Removing last character removes last `t`
- We're left with `t + ... + t` (2k-2 times), which contains `s` in the middle

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def repeatedSubstringPattern(s: str) -> bool:
    """
    Check if s can be constructed by repeating a substring.

    The key insight: if s can be formed by repeating a substring t,
    then s must be a substring of (s + s) with the first and last
    characters removed.

    Args:
        s: The input string to check

    Returns:
        True if s can be formed by repeating a substring, False otherwise
    """
    # Create the doubled string
    doubled = s + s

    # Remove first and last characters from doubled string
    # This ensures we don't trivially find s at the beginning or end
    # We're looking for s somewhere in the middle
    search_space = doubled[1:-1]

    # Check if original s exists in the modified search space
    # If it does, s can be formed by repeating a substring
    return s in search_space
```

```javascript
// Time: O(n) | Space: O(n)
function repeatedSubstringPattern(s) {
  /**
   * Check if s can be constructed by repeating a substring.
   *
   * The key insight: if s can be formed by repeating a substring t,
   * then s must be a substring of (s + s) with the first and last
   * characters removed.
   *
   * @param {string} s - The input string to check
   * @return {boolean} True if s can be formed by repeating a substring
   */

  // Create the doubled string
  const doubled = s + s;

  // Remove first and last characters from doubled string
  // This ensures we don't trivially find s at the beginning or end
  // We're looking for s somewhere in the middle
  const searchSpace = doubled.substring(1, doubled.length - 1);

  // Check if original s exists in the modified search space
  // If it does, s can be formed by repeating a substring
  return searchSpace.includes(s);
}
```

```java
// Time: O(n) | Space: O(n)
public boolean repeatedSubstringPattern(String s) {
    /**
     * Check if s can be constructed by repeating a substring.
     *
     * The key insight: if s can be formed by repeating a substring t,
     * then s must be a substring of (s + s) with the first and last
     * characters removed.
     *
     * @param s The input string to check
     * @return True if s can be formed by repeating a substring
     */

    // Create the doubled string
    String doubled = s + s;

    // Remove first and last characters from doubled string
    // This ensures we don't trivially find s at the beginning or end
    // We're looking for s somewhere in the middle
    String searchSpace = doubled.substring(1, doubled.length() - 1);

    // Check if original s exists in the modified search space
    // If it does, s can be formed by repeating a substring
    return searchSpace.contains(s);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Creating `s + s` takes O(n) time
- Creating the search space by removing first and last characters takes O(n) time
- The substring search operation (`in` in Python, `includes()` in JavaScript, `contains()` in Java) typically takes O(n) time for string matching
- Overall, we have O(n) + O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We create `doubled` which has length 2n, using O(n) space
- We create `search_space` which has length 2n-2, using O(n) space
- Some implementations might optimize this, but in the worst case we use O(n) additional space

## Common Mistakes

1. **Forgetting to remove both first AND last characters**: Some candidates only remove the first character, which can lead to false positives. For example, with `"aba"`, if we only remove the first character from `"abaaba"`, we get `"baaba"` which contains `"aba"`, but `"aba"` cannot be formed by repeating a substring.

2. **Checking substring lengths up to n instead of n/2**: The repeating substring must be at most half the length of the original string (otherwise you'd only have one repetition). Checking lengths beyond n/2 is wasted computation.

3. **Not handling the edge case of length 1 strings**: A single character string like `"a"` should return `False` because it cannot be formed by appending multiple copies of a proper substring (the substring would be the whole string). Our optimal solution correctly handles this because `"a"` in `""` (empty string after removing first and last characters from `"aa"`) returns `False`.

4. **Using the wrong string comparison method**: In Java, using `==` instead of `.equals()` for string comparison would compare object references rather than content. Always use `.equals()` for string content comparison in Java.

## When You'll See This Pattern

This "doubled string" pattern appears in several string manipulation problems:

1. **Rotated Strings (LeetCode 796)**: To check if one string is a rotation of another, you can check if it's a substring of the doubled string. For example, to check if `"cdeab"` is a rotation of `"abcde"`, check if `"cdeab"` is in `"abcdeabcde"`.

2. **Repeated String Match (LeetCode 686)**: This problem asks for the minimum number of times you need to repeat string A so that string B becomes a substring. The solution involves building A repeated enough times and checking for B.

3. **String Periodicity Problems**: Any problem dealing with finding the smallest repeating unit in a string can use similar logic. The KMP algorithm's failure function can also solve this problem by finding the longest proper prefix that is also a suffix.

## Key Takeaways

1. **The concatenation trick is powerful**: For problems about repeated patterns or rotations in strings, consider concatenating the string with itself and searching within the result. This often simplifies complex pattern matching.

2. **Understand the mathematical properties**: The insight that removing both first and last characters from `s + s` before searching for `s` comes from understanding how repeated strings behave under concatenation. Developing this mathematical intuition helps with similar problems.

3. **Edge cases matter**: Always test with strings of length 1, strings with no repeating pattern, and strings where the pattern repeats many times. These edge cases often reveal flaws in the logic.

Related problems: [Find the Index of the First Occurrence in a String](/problem/find-the-index-of-the-first-occurrence-in-a-string), [Repeated String Match](/problem/repeated-string-match)
