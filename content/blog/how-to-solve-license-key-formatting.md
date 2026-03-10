---
title: "How to Solve License Key Formatting — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode License Key Formatting. Easy difficulty, 45.7% acceptance rate. Topics: String."
date: "2027-09-29"
category: "dsa-patterns"
tags: ["license-key-formatting", "string", "easy"]
---

# How to Solve License Key Formatting

You're given a license key string containing alphanumeric characters and dashes, and an integer `k`. Your task is to reformat the string so that all dashes are removed, all letters are uppercase, and the string is regrouped into blocks of exactly `k` characters, with the first block allowed to have fewer characters if needed. The challenge lies in handling the grouping logic correctly, especially when the total length isn't divisible by `k`.

## Visual Walkthrough

Let's walk through an example: `s = "2-5g-3-J"`, `k = 2`

**Step 1: Remove dashes and convert to uppercase**
Original: `"2-5g-3-J"` → `"25G3J"`

**Step 2: Determine first group size**
Total characters: 5
k = 2
We need to find how many characters go in the first group. Since 5 ÷ 2 = 2 remainder 1, the first group gets 1 character.

**Step 3: Build the result**

1. Take first character: `"2"`
2. Add dash: `"2-"`
3. Take next k characters (2): `"5G"` → `"2-5G"`
4. Add dash: `"2-5G-"`
5. Take next k characters (2): `"3J"` → `"2-5G-3J"`

Final result: `"2-5G-3J"`

Another example: `s = "5F3Z-2e-9-w"`, `k = 4`

**Step 1:** `"5F3Z2E9W"` (8 characters)
**Step 2:** 8 ÷ 4 = 2 remainder 0, so first group gets 4 characters
**Step 3:**

- First 4 chars: `"5F3Z"` → `"5F3Z-"`
- Next 4 chars: `"2E9W"` → `"5F3Z-2E9W"`

## Brute Force Approach

A naive approach would be:

1. Remove dashes and convert to uppercase
2. Start from the beginning and insert dashes every k characters

However, this fails because the first group might need fewer than k characters. A candidate might try to work from left to right, but this gets messy with index calculations.

The brute force that actually works (but is inefficient) would be:

1. Clean the string (remove dashes, uppercase)
2. Calculate first group size
3. Build result character by character, tracking when to add dashes

While this brute force works, it's not optimal in terms of code clarity and edge case handling. The real issue isn't time complexity (it's O(n) either way), but rather getting the grouping logic wrong.

## Optimal Solution

The optimal approach processes the string from right to left. This is key because:

- We want groups of exactly k characters from the end
- Any "leftover" characters at the beginning naturally form the first group
- Working backwards avoids complex remainder calculations

Here's the algorithm:

1. Remove all dashes and convert to uppercase
2. Start from the end and move left
3. Add characters to result, inserting a dash after every k characters
4. Reverse the result (since we built it backwards)

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def licenseKeyFormatting(s: str, k: int) -> str:
    # Step 1: Clean the string - remove dashes and convert to uppercase
    clean_s = s.replace('-', '').upper()

    # Step 2: Initialize result list and counter
    result = []
    count = 0

    # Step 3: Process from right to left
    # Working backwards ensures we get exact k-sized groups from the end
    for i in range(len(clean_s) - 1, -1, -1):
        result.append(clean_s[i])  # Add current character
        count += 1

        # Insert dash after every k characters, but not at the very end
        if count == k and i != 0:  # i != 0 prevents dash at beginning
            result.append('-')
            count = 0  # Reset counter for next group

    # Step 4: Reverse and join since we built backwards
    return ''.join(reversed(result))
```

```javascript
// Time: O(n) | Space: O(n)
function licenseKeyFormatting(s, k) {
  // Step 1: Clean the string - remove dashes and convert to uppercase
  const cleanStr = s.replace(/-/g, "").toUpperCase();

  // Step 2: Initialize result array and counter
  const result = [];
  let count = 0;

  // Step 3: Process from right to left
  // Working backwards ensures we get exact k-sized groups from the end
  for (let i = cleanStr.length - 1; i >= 0; i--) {
    result.push(cleanStr[i]); // Add current character
    count++;

    // Insert dash after every k characters, but not at the very end
    if (count === k && i !== 0) {
      // i !== 0 prevents dash at beginning
      result.push("-");
      count = 0; // Reset counter for next group
    }
  }

  // Step 4: Reverse and join since we built backwards
  return result.reverse().join("");
}
```

```java
// Time: O(n) | Space: O(n)
public String licenseKeyFormatting(String s, int k) {
    // Step 1: Clean the string - remove dashes and convert to uppercase
    StringBuilder cleanStr = new StringBuilder();
    for (char c : s.toCharArray()) {
        if (c != '-') {
            cleanStr.append(Character.toUpperCase(c));
        }
    }

    // Step 2: Initialize result StringBuilder and counter
    StringBuilder result = new StringBuilder();
    int count = 0;

    // Step 3: Process from right to left
    // Working backwards ensures we get exact k-sized groups from the end
    for (int i = cleanStr.length() - 1; i >= 0; i--) {
        result.append(cleanStr.charAt(i));  // Add current character
        count++;

        // Insert dash after every k characters, but not at the very end
        if (count == k && i != 0) {  // i != 0 prevents dash at beginning
            result.append('-');
            count = 0;  // Reset counter for next group
        }
    }

    // Step 4: Reverse since we built backwards
    return result.reverse().toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character exactly twice: once to clean the string (remove dashes, uppercase), and once to build the result
- The reverse operation at the end is also O(n)
- Total: O(3n) = O(n)

**Space Complexity: O(n)**

- We create a cleaned string of size ≤ n
- We build a result string of size ≤ n + (n/k) (for dashes)
- Total auxiliary space: O(n)

## Common Mistakes

1. **Forgetting to handle empty result**: If the input is all dashes like `"---"`, the cleaned string will be empty. Some implementations crash when trying to access characters. Always check if the cleaned string is empty and return `""`.

2. **Adding dash at the beginning**: When building from left to right, it's easy to accidentally add a dash before the first group. The condition `i != 0` (or equivalent) is crucial when inserting dashes.

3. **Case sensitivity issues**: The problem says "all letters should be uppercase" but some candidates forget this. Always call `.upper()` or `.toUpperCase()` on the cleaned string.

4. **Incorrect group size calculation**: When working left-to-right, calculating the first group size requires modulo arithmetic: `first_group = len(clean_s) % k`. If this is 0, the first group should have k characters, not 0.

5. **Not resetting the counter**: Forgetting to reset `count = 0` after adding a dash leads to incorrect grouping.

## When You'll See This Pattern

The "process from right to left" pattern appears in several string manipulation problems:

1. **Add Binary (LeetCode 67)**: When adding binary strings, you process from right to left to handle carry propagation naturally.

2. **Add Strings (LeetCode 415)**: Similar to Add Binary, but for decimal numbers. Right-to-left processing handles carries correctly.

3. **Reverse Words in a String (LeetCode 151)**: While not identical, the optimal O(1) space solution often involves processing from right to left to build the result.

The key insight is that when you need to group or process elements with some constraint from one end (usually the end), working backwards often simplifies the logic.

## Key Takeaways

1. **Right-to-left processing simplifies grouping problems**: When you need exact group sizes from the end, working backwards lets you insert separators at natural boundaries without complex remainder calculations.

2. **String manipulation often requires careful boundary checks**: The condition `i != 0` when adding dashes prevents leading separators. Always test with edge cases like single-character strings.

3. **Clean data first, then transform**: It's often easier to normalize your input (remove dashes, uppercase) before applying the main algorithm, rather than trying to do everything in one pass.

[Practice this problem on CodeJeet](/problem/license-key-formatting)
