---
title: "How to Solve Reformat The String — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reformat The String. Easy difficulty, 52.1% acceptance rate. Topics: String."
date: "2028-01-21"
category: "dsa-patterns"
tags: ["reformat-the-string", "string", "easy"]
---

# How to Solve "Reformat The String"

This problem asks us to rearrange an alphanumeric string so that no two letters or two digits appear consecutively. While conceptually straightforward, it requires careful handling of character classification and boundary conditions. The challenge lies in determining when a valid rearrangement is possible and constructing it efficiently.

## Visual Walkthrough

Let's walk through an example: `s = "a0b1c2"`

**Step 1: Separate letters and digits**

- Letters: `"abc"` (3 letters)
- Digits: `"012"` (3 digits)

**Step 2: Check if rearrangement is possible**
We need to alternate letters and digits. For this to work:

- The counts must differ by at most 1
- Here: 3 letters vs 3 digits → difference is 0 → possible

**Step 3: Build the result**
Since counts are equal, we can start with either letters or digits. Let's start with letters:

1. Take first letter: `"a"`
2. Take first digit: `"0"` → `"a0"`
3. Take second letter: `"b"` → `"a0b"`
4. Take second digit: `"1"` → `"a0b1"`
5. Take third letter: `"c"` → `"a0b1c"`
6. Take third digit: `"2"` → `"a0b1c2"`

Result: `"a0b1c2"` (which alternates letters and digits)

**Another example: `s = "leetcode"`**

- Letters: `"leetcode"` (8 letters)
- Digits: `""` (0 digits)
- Difference: 8 - 0 = 8 > 1 → impossible → return `""`

**Example where counts differ by 1: `s = "covid2019"`**

- Letters: `"covid"` (5 letters)
- Digits: `"2019"` (4 digits)
- Difference: 1 → possible
- Start with the larger group (letters):
  1. `"c"` + `"2"` → `"c2"`
  2. `"o"` + `"0"` → `"c2o0"`
  3. `"v"` + `"1"` → `"c2o0v1"`
  4. `"i"` + `"9"` → `"c2o0v1i9"`
  5. `"d"` → `"c2o0v1i9d"`

## Brute Force Approach

A naive approach would be to generate all permutations of the string and check each one for validity. For each permutation, we would:

1. Check if it alternates letters and digits
2. Return the first valid permutation found

However, this approach has severe problems:

- Generating all permutations has factorial time complexity: O(n!)
- For a string of length 10, that's 3,628,800 permutations to check
- For length 20, it's approximately 2.4 × 10¹⁸ permutations

This is clearly impractical for any reasonable input size. The brute force approach fails because it doesn't leverage the structure of the problem: we don't need to consider all possible arrangements, only those that alternate character types.

## Optimal Solution

The optimal solution separates letters and digits, checks if rearrangement is possible based on count differences, and then builds the result by alternating between the two groups. We always start with the larger group when counts differ.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def reformat(s: str) -> str:
    # Step 1: Separate letters and digits
    letters = [c for c in s if c.isalpha()]
    digits = [c for c in s if c.isdigit()]

    # Step 2: Check if rearrangement is possible
    # The counts must differ by at most 1 for alternating arrangement
    if abs(len(letters) - len(digits)) > 1:
        return ""

    # Step 3: Determine which group to start with
    # If counts differ, start with the larger group
    # If counts are equal, either group works (we'll use letters)
    result = []

    # Use the longer list as the starting point if lengths differ
    if len(letters) > len(digits):
        # Start with letters
        for i in range(len(digits)):
            result.append(letters[i])
            result.append(digits[i])
        # Add the extra letter at the end
        result.append(letters[-1])
    elif len(digits) > len(letters):
        # Start with digits
        for i in range(len(letters)):
            result.append(digits[i])
            result.append(letters[i])
        # Add the extra digit at the end
        result.append(digits[-1])
    else:
        # Counts are equal, start with either (we choose letters)
        for i in range(len(letters)):
            result.append(letters[i])
            result.append(digits[i])

    # Step 4: Convert list to string and return
    return "".join(result)
```

```javascript
// Time: O(n) | Space: O(n)
function reformat(s) {
  // Step 1: Separate letters and digits
  const letters = [];
  const digits = [];

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    // Check if character is a letter (a-z)
    if (char >= "a" && char <= "z") {
      letters.push(char);
    } else {
      // Character must be a digit (0-9)
      digits.push(char);
    }
  }

  // Step 2: Check if rearrangement is possible
  // The counts must differ by at most 1 for alternating arrangement
  if (Math.abs(letters.length - digits.length) > 1) {
    return "";
  }

  // Step 3: Determine which group to start with
  const result = [];

  // Use the longer list as the starting point if lengths differ
  if (letters.length > digits.length) {
    // Start with letters
    for (let i = 0; i < digits.length; i++) {
      result.push(letters[i]);
      result.push(digits[i]);
    }
    // Add the extra letter at the end
    result.push(letters[letters.length - 1]);
  } else if (digits.length > letters.length) {
    // Start with digits
    for (let i = 0; i < letters.length; i++) {
      result.push(digits[i]);
      result.push(letters[i]);
    }
    // Add the extra digit at the end
    result.push(digits[digits.length - 1]);
  } else {
    // Counts are equal, start with either (we choose letters)
    for (let i = 0; i < letters.length; i++) {
      result.push(letters[i]);
      result.push(digits[i]);
    }
  }

  // Step 4: Convert array to string and return
  return result.join("");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String reformat(String s) {
        // Step 1: Separate letters and digits
        List<Character> letters = new ArrayList<>();
        List<Character> digits = new ArrayList<>();

        for (char c : s.toCharArray()) {
            if (Character.isLetter(c)) {
                letters.add(c);
            } else {
                digits.add(c);
            }
        }

        // Step 2: Check if rearrangement is possible
        // The counts must differ by at most 1 for alternating arrangement
        if (Math.abs(letters.size() - digits.size()) > 1) {
            return "";
        }

        // Step 3: Determine which group to start with
        StringBuilder result = new StringBuilder();

        // Use the longer list as the starting point if lengths differ
        if (letters.size() > digits.size()) {
            // Start with letters
            for (int i = 0; i < digits.size(); i++) {
                result.append(letters.get(i));
                result.append(digits.get(i));
            }
            // Add the extra letter at the end
            result.append(letters.get(letters.size() - 1));
        } else if (digits.size() > letters.size()) {
            // Start with digits
            for (int i = 0; i < letters.size(); i++) {
                result.append(digits.get(i));
                result.append(letters.get(i));
            }
            // Add the extra digit at the end
            result.append(digits.get(digits.size() - 1));
        } else {
            // Counts are equal, start with either (we choose letters)
            for (int i = 0; i < letters.size(); i++) {
                result.append(letters.get(i));
                result.append(digits.get(i));
            }
        }

        // Step 4: Return the result
        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string once to separate letters and digits: O(n)
- We iterate through the separated lists to build the result: O(n)
- Total: O(n) + O(n) = O(n)

**Space Complexity: O(n)**

- We store letters and digits in separate lists: O(n)
- We store the result in a list/string builder: O(n)
- Total: O(n) + O(n) = O(n)

The space complexity could be optimized to O(1) additional space (excluding output) by using two pointers, but the code would be more complex and the O(n) output space would still dominate.

## Common Mistakes

1. **Not checking if rearrangement is possible first**: Many candidates start building the result without checking if `abs(letter_count - digit_count) > 1`. This leads to index out of bounds errors or incorrect results when no valid arrangement exists.

2. **Incorrect handling of the extra character**: When counts differ by 1, the extra character must go at the end. A common mistake is trying to insert it in the middle or forgetting to add it altogether.

3. **Using inefficient character classification**: Some candidates use regular expressions or multiple string methods to classify characters. The most efficient approach is simple character range checks (`'a' <= c <= 'z'`) or using built-in methods like `isalpha()`/`isdigit()`.

4. **Forgetting edge cases**:
   - Empty string input (should return `""`)
   - String with only letters or only digits (should return `""` unless length is 1)
   - Single character strings (always valid as they can't violate adjacency rules)

## When You'll See This Pattern

This problem uses the **"two-pointer"** or **"alternating merge"** pattern, which appears in various forms:

1. **Merge Sorted Array (LeetCode 88)**: Similar alternating pattern but with sorted arrays and different comparison logic.

2. **Zigzag Conversion (LeetCode 6)**: Creates an alternating pattern by placing characters in different rows before reading them back.

3. **Rearrange String k Distance Apart (LeetCode 358)**: A more complex version where you need to ensure characters of the same type are at least k positions apart.

The core technique of separating elements by type and then merging them according to specific rules is widely applicable in string and array manipulation problems.

## Key Takeaways

1. **Separate and conquer**: When dealing with mixed data types, separating them first often simplifies the problem. This allows you to handle each type independently before combining them.

2. **Count differences matter**: For alternating patterns, the difference in counts between the two groups determines feasibility. If the difference exceeds 1, no valid alternating arrangement exists.

3. **Start with the larger group**: When counts differ, starting with the larger group ensures the extra element naturally goes at the end without breaking the alternating pattern.

[Practice this problem on CodeJeet](/problem/reformat-the-string)
