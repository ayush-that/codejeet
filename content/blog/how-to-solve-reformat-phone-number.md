---
title: "How to Solve Reformat Phone Number — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reformat Phone Number. Easy difficulty, 67.6% acceptance rate. Topics: String."
date: "2028-08-12"
category: "dsa-patterns"
tags: ["reformat-phone-number", "string", "easy"]
---

# How to Solve Reformat Phone Number

You're given a phone number string containing digits, spaces, and dashes, and need to reformat it by removing all non-digits, then grouping the digits into blocks of 3, except the final block which can be 2 digits if needed. The challenge is handling the edge cases for the final grouping correctly—this is what makes an "easy" problem actually test your attention to detail.

## Visual Walkthrough

Let's trace through an example: `"123 4-5678"`

**Step 1: Remove all non-digits**

- Input: `"123 4-5678"`
- Remove spaces and dashes: `"12345678"`
- We now have 8 digits

**Step 2: Group into blocks of 3 from left to right**

- First 3: `"123"`
- Remaining: `"45678"` (5 digits left)
- Next 3: `"456"`
- Remaining: `"78"` (2 digits left)

**Step 3: Handle the final block**

- We have 2 digits left: `"78"`
- Since 2 < 4, we keep them as a block of 2
- Final grouping: `["123", "456", "78"]`

**Step 4: Join with dashes**

- `"123-456-78"`

Now let's try a trickier case: `"123 4-567"` (7 digits after cleaning)

**Step 1:** Clean to `"1234567"` (7 digits)
**Step 2:** Group into 3s: `"123"`, remaining `"4567"` (4 digits)
**Step 3:** Handle final block: With 4 digits, we make two blocks of 2: `"45"` and `"67"`
**Step 4:** Final: `"123-45-67"`

The pattern emerges: when we have 4 digits remaining at the end, we split them into two blocks of 2 instead of one block of 3 followed by one block of 1.

## Brute Force Approach

The most straightforward approach is exactly what the problem describes:

1. Remove all non-digit characters
2. Build the result by taking blocks of 3 until we can't
3. Handle the final block specially

While this isn't a "brute force" in the algorithmic complexity sense (there's no exponential solution to optimize away), many candidates try to overcomplicate this by:

- Using regex for everything (which can be hard to read and debug)
- Trying to do everything in one pass without cleaning first
- Creating complex conditional logic for the final grouping

The clean approach is actually optimal: clean the string first, then handle grouping. Any attempt to avoid cleaning first usually leads to more complex code with more edge cases.

## Optimal Solution

The optimal solution follows these clear steps:

1. **Clean the string**: Remove all spaces and dashes
2. **Initialize result array**: We'll build our blocks here
3. **Process in chunks of 3**: Take blocks of 3 until we have 4 or fewer digits left
4. **Handle the final block**:
   - If 4 digits remain: Make two blocks of 2
   - If 3 digits remain: Keep as one block of 3
   - If 2 digits remain: Keep as one block of 2
5. **Join with dashes**: Combine all blocks with `-`

Here's the complete implementation:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def reformatNumber(number: str) -> str:
    # Step 1: Remove all non-digit characters
    # We filter only digits using isdigit() check
    cleaned = ''.join([ch for ch in number if ch.isdigit()])

    # Step 2: Initialize list to store blocks
    blocks = []
    i = 0
    n = len(cleaned)

    # Step 3: Process in chunks of 3 until 4 or fewer digits remain
    # We stop when we have 4 or fewer because those cases need special handling
    while i < n - 4:
        # Take next 3 digits as a block
        blocks.append(cleaned[i:i+3])
        i += 3

    # Step 4: Handle the final block(s)
    remaining = n - i

    if remaining == 4:
        # Special case: split 4 digits into two blocks of 2
        blocks.append(cleaned[i:i+2])
        blocks.append(cleaned[i+2:i+4])
    elif remaining == 3:
        # Exactly 3 digits left - keep as one block
        blocks.append(cleaned[i:i+3])
    elif remaining == 2:
        # Exactly 2 digits left - keep as one block
        blocks.append(cleaned[i:i+2])
    # Note: remaining == 1 is impossible since we always group in 3s
    # and the total is made of digits only

    # Step 5: Join all blocks with dashes
    return '-'.join(blocks)
```

```javascript
// Time: O(n) | Space: O(n)
function reformatNumber(number) {
  // Step 1: Remove all non-digit characters
  // Use regex to match only digits
  const cleaned = number.replace(/\D/g, "");

  // Step 2: Initialize array to store blocks
  const blocks = [];
  let i = 0;
  const n = cleaned.length;

  // Step 3: Process in chunks of 3 until 4 or fewer digits remain
  // We use n - 4 as the stopping condition to handle the special 4-digit case
  while (i < n - 4) {
    // Take next 3 digits as a block
    blocks.push(cleaned.substring(i, i + 3));
    i += 3;
  }

  // Step 4: Handle the final block(s)
  const remaining = n - i;

  if (remaining === 4) {
    // Special case: split 4 digits into two blocks of 2
    blocks.push(cleaned.substring(i, i + 2));
    blocks.push(cleaned.substring(i + 2, i + 4));
  } else if (remaining === 3) {
    // Exactly 3 digits left - keep as one block
    blocks.push(cleaned.substring(i, i + 3));
  } else if (remaining === 2) {
    // Exactly 2 digits left - keep as one block
    blocks.push(cleaned.substring(i, i + 2));
  }
  // remaining === 1 is impossible given the grouping rules

  // Step 5: Join all blocks with dashes
  return blocks.join("-");
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public String reformatNumber(String number) {
        // Step 1: Remove all non-digit characters
        // Use StringBuilder for efficient string manipulation
        StringBuilder cleaned = new StringBuilder();
        for (char ch : number.toCharArray()) {
            if (Character.isDigit(ch)) {
                cleaned.append(ch);
            }
        }

        // Step 2: Initialize list to store blocks
        List<String> blocks = new ArrayList<>();
        int i = 0;
        int n = cleaned.length();

        // Step 3: Process in chunks of 3 until 4 or fewer digits remain
        // The condition i < n - 4 ensures we stop with 4 or fewer digits
        while (i < n - 4) {
            // Take next 3 digits as a block
            blocks.add(cleaned.substring(i, i + 3));
            i += 3;
        }

        // Step 4: Handle the final block(s)
        int remaining = n - i;

        if (remaining == 4) {
            // Special case: split 4 digits into two blocks of 2
            blocks.add(cleaned.substring(i, i + 2));
            blocks.add(cleaned.substring(i + 2, i + 4));
        } else if (remaining == 3) {
            // Exactly 3 digits left - keep as one block
            blocks.add(cleaned.substring(i, i + 3));
        } else if (remaining == 2) {
            // Exactly 2 digits left - keep as one block
            blocks.add(cleaned.substring(i, i + 2));
        }
        // remaining == 1 is impossible with the given constraints

        // Step 5: Join all blocks with dashes
        return String.join("-", blocks);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Cleaning the string takes O(n) to iterate through all characters
- Building blocks takes O(n) as we process each digit exactly once
- Joining the final string takes O(n) for concatenation
- Overall linear time relative to input size

**Space Complexity: O(n)**

- We store the cleaned string: O(n)
- We store the blocks array: O(n) in total
- The final output string: O(n)
- Overall linear space relative to input size

The space could be optimized to O(1) by building the result directly without intermediate arrays, but the code would be more complex. For interview purposes, the clarity of the O(n) space solution is usually preferred.

## Common Mistakes

1. **Forgetting the 4-digit special case**: The most common error is treating 4 remaining digits as "3 + 1" instead of "2 + 2". Always remember: when you have exactly 4 digits at the end, split them into two pairs.

2. **Off-by-one errors in substring indices**: When using `substring(i, i+3)`, remember that the second parameter is exclusive. A common mistake is `substring(i, i+2)` for 2 digits (correct) vs `substring(i, i+1)` (incorrect, only gets 1 digit).

3. **Not cleaning the string properly**: Some candidates try to process the original string without cleaning first, which leads to complex logic dealing with spaces and dashes in the middle of grouping. Always clean first—it simplifies everything.

4. **Incorrect loop termination condition**: Using `while i < n` instead of `while i < n - 4` means you might end with 1 digit at the end (which shouldn't happen). The `n - 4` condition ensures we stop with 4 or fewer digits to handle specially.

## When You'll See This Pattern

This problem teaches **string processing with grouping rules**, a common pattern in:

- **License Key Formatting (LeetCode 482)**: Similar grouping problem but with different rules (first group can be shorter)
- **Add Bold Tag in String (LeetCode 616)**: Requires processing strings with specific formatting rules
- **Text Justification (LeetCode 68)**: More complex version of grouping with padding rules

The core pattern is: clean/preprocess → apply grouping rules → handle edge cases → format output. This appears in many string manipulation problems where you need to transform input according to specific formatting requirements.

## Key Takeaways

1. **Clean before processing**: When dealing with strings that need cleaning (removing certain characters), always do the cleaning step first. This separates concerns and makes the main logic much simpler.

2. **Identify special cases early**: The "4 digits at the end" case is what makes this problem interesting. In any grouping problem, carefully analyze what happens with the final group—it often has different rules.

3. **Use clear variable names**: Names like `cleaned`, `blocks`, `remaining` make the code self-documenting. In interviews, clear code is as important as correct code.

[Practice this problem on CodeJeet](/problem/reformat-phone-number)
