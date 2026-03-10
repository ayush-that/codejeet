---
title: "How to Solve Adding Spaces to a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Adding Spaces to a String. Medium difficulty, 71.8% acceptance rate. Topics: Array, Two Pointers, String, Simulation."
date: "2028-07-20"
category: "dsa-patterns"
tags: ["adding-spaces-to-a-string", "array", "two-pointers", "string", "medium"]
---

# How to Solve Adding Spaces to a String

You're given a string `s` and an array `spaces` containing indices where spaces should be inserted **before** the character at each index. The challenge is that inserting spaces directly into a string is inefficient in most languages, requiring O(n²) time. This problem tests your understanding of string manipulation efficiency and careful index management.

## Visual Walkthrough

Let's trace through `s = "EnjoyYourCoffee"` and `spaces = [5, 9]`:

**Step 1:** Start with an empty result string and pointer `spaceIdx = 0` for spaces array

- `s = "EnjoyYourCoffee"`
- `spaces = [5, 9]` (insert before characters at indices 5 and 9)

**Step 2:** Process each character in `s` with index `i`:

- `i = 0`: 'E' → add to result: `"E"`
- `i = 1`: 'n' → add to result: `"En"`
- `i = 2`: 'j' → add to result: `"Enj"`
- `i = 3`: 'o' → add to result: `"Enjo"`
- `i = 4`: 'y' → add to result: `"Enjoy"`

**Step 3:** `i = 5` → check if `spaceIdx < len(spaces)` and `i == spaces[spaceIdx]` (5 == 5)

- Add space first: result becomes `"Enjoy "`
- Then add 'Y': result becomes `"Enjoy Y"`
- Increment `spaceIdx` to 1

**Step 4:** Continue:

- `i = 6`: 'o' → `"Enjoy Yo"`
- `i = 7`: 'u' → `"Enjoy You"`
- `i = 8`: 'r' → `"Enjoy Your"`

**Step 5:** `i = 9` → check if `spaceIdx < len(spaces)` and `i == spaces[spaceIdx]` (9 == 9)

- Add space: `"Enjoy Your "`
- Add 'C': `"Enjoy Your C"`
- Increment `spaceIdx` to 2

**Step 6:** Finish remaining characters:

- `i = 10`: 'o' → `"Enjoy Your Co"`
- `i = 11`: 'f' → `"Enjoy Your Cof"`
- `i = 12`: 'f' → `"Enjoy Your Coff"`
- `i = 13`: 'e' → `"Enjoy Your Coffee"`
- `i = 14`: 'e' → `"Enjoy Your Coffee"`

**Final result:** `"Enjoy Your Coffee"`

## Brute Force Approach

The most intuitive approach is to insert spaces directly into the string as we process the spaces array:

1. Start with the original string
2. For each index in `spaces`, insert a space at that position
3. Since inserting into a string shifts all subsequent characters, we need to adjust subsequent space indices

The problem with this approach is that string insertion in most languages creates a new string each time, making it O(n²) time complexity where n is the length of the string. Each insertion requires copying the entire string, and with k spaces to insert, we're looking at O(k × n) operations.

<div class="code-group">

```python
# Time: O(n × k) where k = len(spaces) | Space: O(n)
def addSpacesBruteForce(s: str, spaces: List[int]) -> str:
    # Convert to list for mutability (Python strings are immutable)
    result = list(s)

    # We need to track offset because each insertion shifts indices
    offset = 0

    for space_idx in spaces:
        # Adjust for previous insertions
        adjusted_idx = space_idx + offset

        # Insert space at adjusted position
        result.insert(adjusted_idx, ' ')

        # Update offset for next iteration
        offset += 1

    return ''.join(result)
```

```javascript
// Time: O(n × k) where k = spaces.length | Space: O(n)
function addSpacesBruteForce(s, spaces) {
  // Convert to array for mutability
  let result = s.split("");

  // Track offset for index adjustments
  let offset = 0;

  for (let spaceIdx of spaces) {
    // Adjust for previous insertions
    const adjustedIdx = spaceIdx + offset;

    // Insert space at adjusted position
    result.splice(adjustedIdx, 0, " ");

    // Update offset
    offset++;
  }

  return result.join("");
}
```

```java
// Time: O(n × k) where k = spaces.length | Space: O(n)
public String addSpacesBruteForce(String s, int[] spaces) {
    // Convert to StringBuilder for mutability
    StringBuilder result = new StringBuilder(s);

    // Track offset for index adjustments
    int offset = 0;

    for (int spaceIdx : spaces) {
        // Adjust for previous insertions
        int adjustedIdx = spaceIdx + offset;

        // Insert space at adjusted position
        result.insert(adjustedIdx, ' ');

        // Update offset
        offset++;
    }

    return result.toString();
}
```

</div>

This brute force approach works but is inefficient for large inputs. The main issue is that each insertion requires shifting all subsequent characters, leading to quadratic time complexity.

## Optimized Approach

The key insight is that we can build the result string in **one pass** without modifying the original string. Instead of inserting into an existing string, we construct a new string by:

1. Using two pointers: one for the current position in `s` (`i`), and one for the current position in `spaces` (`spaceIdx`)
2. Iterating through each character of `s` with index `i`
3. Checking if we need to insert a space before the current character
4. Adding characters to our result builder in the correct order

This approach is O(n) time because we process each character exactly once, and O(n) space for the result string. The trick is maintaining the correct relationship between the character index and the spaces array indices.

## Optimal Solution

Here's the optimal solution that builds the result in linear time:

<div class="code-group">

```python
# Time: O(n) where n = len(s) | Space: O(n) for the result string
def addSpaces(s: str, spaces: List[int]) -> str:
    # Initialize result list for efficient appends
    # Using list instead of string concatenation for O(1) append
    result = []

    # Pointer for spaces array
    space_idx = 0

    # Iterate through each character in s with its index
    for i, char in enumerate(s):
        # Check if we need to insert a space before this character
        # We need both conditions:
        # 1. space_idx < len(spaces): we still have spaces to insert
        # 2. i == spaces[space_idx]: current position matches next space index
        if space_idx < len(spaces) and i == spaces[space_idx]:
            result.append(' ')  # Insert space before current character
            space_idx += 1      # Move to next space index

        # Add the current character to result
        result.append(char)

    # Convert list to string
    return ''.join(result)
```

```javascript
// Time: O(n) where n = s.length | Space: O(n) for the result string
function addSpaces(s, spaces) {
  // Use array for efficient appending
  const result = [];

  // Pointer for spaces array
  let spaceIdx = 0;

  // Iterate through each character in s
  for (let i = 0; i < s.length; i++) {
    const char = s[i];

    // Check if we need to insert a space before this character
    // Conditions:
    // 1. spaceIdx < spaces.length: we still have spaces to insert
    // 2. i === spaces[spaceIdx]: current position matches next space index
    if (spaceIdx < spaces.length && i === spaces[spaceIdx]) {
      result.push(" "); // Insert space before current character
      spaceIdx++; // Move to next space index
    }

    // Add the current character to result
    result.push(char);
  }

  // Convert array to string
  return result.join("");
}
```

```java
// Time: O(n) where n = s.length() | Space: O(n) for the result string
public String addSpaces(String s, int[] spaces) {
    // Use StringBuilder for efficient string building
    StringBuilder result = new StringBuilder();

    // Pointer for spaces array
    int spaceIdx = 0;

    // Iterate through each character in s
    for (int i = 0; i < s.length(); i++) {
        char currentChar = s.charAt(i);

        // Check if we need to insert a space before this character
        // Conditions:
        // 1. spaceIdx < spaces.length: we still have spaces to insert
        // 2. i == spaces[spaceIdx]: current position matches next space index
        if (spaceIdx < spaces.length && i == spaces[spaceIdx]) {
            result.append(' ');  // Insert space before current character
            spaceIdx++;          // Move to next space index
        }

        // Add the current character to result
        result.append(currentChar);
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through each character of the string exactly once: O(n)
- Checking whether to insert a space is O(1) per character
- Appending to our result builder is O(1) per character
- Total: O(n) where n is the length of the input string

**Space Complexity: O(n)**

- We build a new string of length n + k (where k is the number of spaces)
- In the worst case, k ≤ n, so O(n + n) = O(n)
- The spaces array itself is O(k) but is part of the input, not additional space

## Common Mistakes

1. **Off-by-one errors with space indices**: The problem says to insert spaces "before" the character at the given index. Some candidates insert spaces "after" the character or at index+1. Always test with the example: inserting before index 5 in "EnjoyYourCoffee" should give "Enjoy YourCoffee".

2. **Forgetting to handle all spaces**: When using two pointers, it's easy to forget to check `spaceIdx < len(spaces)` before accessing `spaces[spaceIdx]`. This causes index out of bounds errors.

3. **Inefficient string concatenation**: Using string concatenation in a loop (like `result += char`) creates a new string each time, making it O(n²). Always use StringBuilder (Java), list (Python), or array (JavaScript) for building strings.

4. **Not accounting for sorted spaces**: The problem doesn't explicitly state that spaces array is sorted, but it's implied by the 0-indexed nature. If it weren't sorted, you'd need to sort it first or use a different approach.

## When You'll See This Pattern

This "two-pointer string construction" pattern appears in many string manipulation problems:

1. **Merge Strings Alternately (LeetCode 1768)**: Similar pattern of building a new string by iterating through two input strings with separate pointers.

2. **Zigzag Conversion (LeetCode 6)**: Building a new string by reading characters from the original in a specific pattern using multiple pointers or indices.

3. **Text Justification (LeetCode 68)**: Building formatted text by processing words and inserting spaces according to specific rules.

The core pattern is: when you need to transform a string based on some positional rules, avoid modifying the original string. Instead, build a new string by iterating through the original and applying transformations as you go.

## Key Takeaways

1. **Never modify strings in place during iteration**: Strings are immutable in many languages, and even when mutable, modifications are expensive. Always build a new string when transformations are needed.

2. **Two-pointer technique for positional transformations**: When transformations depend on positions (indices), use separate pointers for the input and transformation rules. This keeps logic clean and efficient.

3. **Pre-allocate or use efficient builders**: For string building, use StringBuilder (Java), list (Python), or array (JavaScript) instead of repeated concatenation to avoid O(n²) time complexity.

[Practice this problem on CodeJeet](/problem/adding-spaces-to-a-string)
