---
title: "How to Solve Defanging an IP Address — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Defanging an IP Address. Easy difficulty, 90.0% acceptance rate. Topics: String."
date: "2026-11-30"
category: "dsa-patterns"
tags: ["defanging-an-ip-address", "string", "easy"]
---

# How to Solve Defanging an IP Address

At first glance, this problem seems trivial—just replace periods in a string. However, it’s a perfect introduction to string manipulation and edge-case thinking in coding interviews. What makes it interesting is that while the solution is straightforward, interviewers use it to assess your attention to detail, your ability to handle simple transformations correctly, and your knowledge of built-in string methods versus manual iteration.

## Visual Walkthrough

Let’s trace through the example `address = "255.100.50.0"`:

1. **Start with the original string:** `"255.100.50.0"`
2. **Scan each character:**
   - `'2'` → not a period, keep as `'2'`
   - `'5'` → not a period, keep as `'5'`
   - `'5'` → not a period, keep as `'5'`
   - `'.'` → period found! Replace with `"[.]"`
   - `'1'` → not a period, keep as `'1'`
   - `'0'` → not a period, keep as `'0'`
   - `'0'` → not a period, keep as `'0'`
   - `'.'` → period found! Replace with `"[.]"`
   - `'5'` → not a period, keep as `'5'`
   - `'0'` → not a period, keep as `'0'`
   - `'.'` → period found! Replace with `"[.]"`
   - `'0'` → not a period, keep as `'0'`
3. **Result:** `"255[.]100[.]50[.]0"`

Notice how each period is replaced by three characters: `'['`, `'.'`, and `']'`. The replacement isn’t just removing and inserting—it’s expanding the string.

## Brute Force Approach

For this problem, the “brute force” approach is actually the optimal approach because the problem is inherently linear—you must examine every character. However, let’s consider what a less experienced candidate might try:

A naive approach would be to use nested loops or complex regex without understanding time complexity. For example, someone might try to repeatedly find periods and rebuild the string in an inefficient way. The key insight is that we need to process each character exactly once, either by using built-in string replacement methods (which do this internally) or by manually iterating through the string.

Since the problem is simple, the “brute force” here is essentially the optimal solution: iterate through each character and build the result. The only difference between approaches is whether you use built-in methods or manual iteration.

## Optimal Solution

The optimal solution processes the string in a single pass. We can either:

1. Use the language’s built-in string replacement method (like `replace()` in Python/JavaScript or `replaceAll()` in Java), which internally iterates through the string.
2. Manually iterate through each character, appending either the character itself (if it’s not a period) or `"[.]"` (if it is a period).

Both approaches have O(n) time complexity and O(n) space complexity (since we’re creating a new string). The manual iteration approach is often preferred in interviews because it demonstrates your understanding of the underlying process.

Here are complete implementations in three languages:

<div class="code-group">

```python
# Time: O(n) where n is the length of the address string
# Space: O(n) for the output string (we build a new string)
def defangIPaddr(address):
    """
    Replace every period '.' in the IP address with '[.]'.

    Args:
        address (str): A valid IPv4 address string

    Returns:
        str: Defanged version of the IP address
    """
    # Initialize an empty list to store characters
    # Using a list is more efficient than string concatenation in Python
    result = []

    # Iterate through each character in the input string
    for char in address:
        if char == '.':
            # If character is a period, append the replacement '[.]'
            result.append('[.]')
        else:
            # Otherwise, append the character as-is
            result.append(char)

    # Join all list elements into a single string
    return ''.join(result)

# Alternative one-liner using built-in method:
# return address.replace('.', '[.]')
```

```javascript
// Time: O(n) where n is the length of the address string
// Space: O(n) for the output string
function defangIPaddr(address) {
  /**
   * Replace every period '.' in the IP address with '[.]'.
   *
   * @param {string} address - A valid IPv4 address string
   * @return {string} Defanged version of the IP address
   */
  let result = "";

  // Iterate through each character in the input string
  for (let i = 0; i < address.length; i++) {
    const char = address[i];
    if (char === ".") {
      // If character is a period, append the replacement '[.]'
      result += "[.]";
    } else {
      // Otherwise, append the character as-is
      result += char;
    }
  }

  return result;

  // Alternative one-liner using built-in method:
  // return address.replace(/\./g, '[.]');
  // or: return address.split('.').join('[.]');
}
```

```java
// Time: O(n) where n is the length of the address string
// Space: O(n) for the output string
public String defangIPaddr(String address) {
    /**
     * Replace every period '.' in the IP address with '[.]'.
     *
     * @param address - A valid IPv4 address string
     * @return Defanged version of the IP address
     */
    // Use StringBuilder for efficient string concatenation in Java
    StringBuilder result = new StringBuilder();

    // Iterate through each character in the input string
    for (int i = 0; i < address.length(); i++) {
        char c = address.charAt(i);
        if (c == '.') {
            // If character is a period, append the replacement '[.]'
            result.append("[.]");
        } else {
            // Otherwise, append the character as-is
            result.append(c);
        }
    }

    return result.toString();

    // Alternative one-liner using built-in method (Java 11+):
    // return address.replace(".", "[.]");
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n), where n is the length of the input string. We must examine each character exactly once to determine if it needs replacement. Even built-in methods like `replace()` have O(n) time complexity internally.

**Space Complexity:** O(n) for the output string. In the worst case (when every character is a period, though that wouldn't be a valid IP), we would need 3n space. For valid IPv4 addresses, the output string length is n + 2\*(number of periods) = n + 6 (since there are always 3 periods in a valid IPv4 address).

## Common Mistakes

1. **Using inefficient string concatenation in loops:** In languages like Java and JavaScript, using `+=` on strings in a loop creates a new string each time, leading to O(n²) time complexity. Always use `StringBuilder` in Java and be mindful of this in JavaScript (though modern JS engines optimize this).

2. **Forgetting that strings are immutable:** Some candidates try to modify the input string directly. Remember that in most languages, strings are immutable—you need to create a new string rather than modifying the original.

3. **Overcomplicating with regex:** While regex can work (`address.replace(/\./g, '[.]')` in JavaScript), it's often overkill for this simple replacement and can be confusing to read. Stick to simple iteration unless you're comfortable explaining the regex.

4. **Not handling edge cases:** While the problem states the input is a valid IPv4 address, in a real interview you might discuss what happens with empty strings, null inputs, or strings without periods. Always clarify assumptions with your interviewer.

## When You'll See This Pattern

This problem teaches fundamental string manipulation patterns that appear in many other problems:

1. **Reverse String (LeetCode 344)** - Similar iteration through characters, but with pointer manipulation.
2. **Valid Palindrome (LeetCode 125)** - Requires filtering characters (removing non-alphanumeric) and comparing, which involves building a new string or using two pointers.
3. **String Compression (LeetCode 443)** - Builds a new string by iterating through the original and counting consecutive characters.
4. **Robot Return to Origin (LeetCode 657)** - Counts specific characters in a string to determine final position.

The core pattern is: **iterate through a string, conditionally transform characters, and build a result**. This pattern appears whenever you need to filter, replace, or transform string data.

## Key Takeaways

- **Simple problems test fundamentals:** Even easy problems assess your understanding of basic data structures (strings are immutable), time/space complexity, and clean code practices.
- **Choose the right string building approach:** Use lists in Python, `StringBuilder` in Java, and be cautious with concatenation in loops in JavaScript.
- **Clarify assumptions:** Always confirm with the interviewer whether you can assume valid input or need to handle edge cases. For this problem, the valid IPv4 assumption simplifies things, but mentioning edge cases shows thoroughness.

[Practice this problem on CodeJeet](/problem/defanging-an-ip-address)
