---
title: "How to Solve Magical String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Magical String. Medium difficulty, 54.5% acceptance rate. Topics: Two Pointers, String."
date: "2028-06-16"
category: "dsa-patterns"
tags: ["magical-string", "two-pointers", "string", "medium"]
---

# How to Solve Magical String

This problem asks us to work with a self-generating string where the sequence of group lengths of identical characters produces the string itself. The tricky part is understanding how this recursive definition works and finding an efficient way to generate enough of the string to count the number of '1's within the first `n` characters.

## Visual Walkthrough

Let's trace through how the magical string is generated. The string starts with `"122"` as given. The key insight is that we can use the string itself to generate more of itself through a clever two-pointer approach.

**Step-by-step generation:**

1. Start with `s = "122"` and initialize `index = 2` (pointing to the third character)
2. The last generated group was of length 2 (the "22" at the end)
3. Look at the next character in `s` that tells us what to generate next:
   - `s[index] = s[2] = '2'` → we need to add 2 copies of the next character
   - The next character alternates between '1' and '2'
   - Since the last group was '2's, we add '1's next
   - Add "11" → `s = "12211"`
4. Move index to 3: `s[3] = '1'` → add 1 copy of the next character
   - Last group was '1's, so add '2' next
   - Add "2" → `s = "122112"`
5. Move index to 4: `s[4] = '1'` → add 1 copy of the next character
   - Last group was '2', so add '1' next
   - Add "1" → `s = "1221121"`
6. Continue this process...

For `n = 6`, we would generate `"122112"` and count 3 '1's in the first 6 characters.

## Brute Force Approach

A naive approach might try to generate the entire infinite string up to some large limit, but we don't know how far we need to go. Another brute force idea would be to try all possible strings of length `n` and check which ones satisfy the magical property, but this is exponential in complexity (O(2ⁿ)).

The problem with brute force is that the magical string has a very specific structure that we can't guess randomly. We need to understand the generation rule and use it to our advantage.

## Optimized Approach

The key insight is that we can **generate the string dynamically using itself as instructions**. This is a classic "self-referential sequence" problem similar to the look-and-say sequence.

**Step-by-step reasoning:**

1. We know the first three characters: `"122"`
2. We maintain two pointers:
   - `i`: points to the next "instruction" in the string (tells us how many characters to add)
   - `end`: points to the last character in our generated string
3. The value at `s[i]` tells us how many copies of the next character to append
4. The next character alternates between '1' and '2' based on what was last added
5. We continue until our string has at least `n` characters
6. Finally, count the '1's in the first `n` characters

This approach works because the string is defined by its own structure - each position tells us how to extend the string further.

## Optimal Solution

Here's the complete solution using the two-pointer generation approach:

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def magicalString(n: int) -> int:
    """
    Generate the magical string up to length n and count '1's.

    The magical string is self-generating: each digit tells us
    how many times to repeat the next character (alternating 1/2).
    """
    # Base cases
    if n == 0:
        return 0
    if n <= 3:
        return 1  # First 3 chars are "122" which has one '1'

    # Initialize with first 3 characters
    s = ['1', '2', '2']

    # i points to the next "instruction" character
    # end tracks the last index of our generated string
    i = 2  # Start from third character (index 2)

    # Generate until we have at least n characters
    while len(s) < n:
        # Current instruction tells us how many to add
        count = int(s[i])

        # Next character alternates: if last was '2', add '1's, and vice versa
        next_char = '1' if s[-1] == '2' else '2'

        # Add 'count' copies of next_char
        s.extend([next_char] * count)

        # Move to next instruction
        i += 1

    # Count '1's in first n characters
    return s[:n].count('1')
```

```javascript
// Time: O(n) | Space: O(n)
function magicalString(n) {
  /**
   * Generate the magical string up to length n and count '1's.
   *
   * The magical string is self-generating: each digit tells us
   * how many times to repeat the next character (alternating 1/2).
   */

  // Base cases
  if (n === 0) return 0;
  if (n <= 3) return 1; // First 3 chars are "122" which has one '1'

  // Initialize with first 3 characters
  const s = ["1", "2", "2"];

  // i points to the next "instruction" character
  // end tracks the last index of our generated string
  let i = 2; // Start from third character (index 2)

  // Generate until we have at least n characters
  while (s.length < n) {
    // Current instruction tells us how many to add
    const count = parseInt(s[i]);

    // Next character alternates: if last was '2', add '1's, and vice versa
    const nextChar = s[s.length - 1] === "2" ? "1" : "2";

    // Add 'count' copies of nextChar
    for (let j = 0; j < count; j++) {
      s.push(nextChar);
    }

    // Move to next instruction
    i++;
  }

  // Count '1's in first n characters
  let ones = 0;
  for (let k = 0; k < n; k++) {
    if (s[k] === "1") ones++;
  }
  return ones;
}
```

```java
// Time: O(n) | Space: O(n)
class Solution {
    public int magicalString(int n) {
        /**
         * Generate the magical string up to length n and count '1's.
         *
         * The magical string is self-generating: each digit tells us
         * how many times to repeat the next character (alternating 1/2).
         */

        // Base cases
        if (n == 0) return 0;
        if (n <= 3) return 1;  // First 3 chars are "122" which has one '1'

        // Initialize with first 3 characters
        List<Character> s = new ArrayList<>();
        s.add('1');
        s.add('2');
        s.add('2');

        // i points to the next "instruction" character
        int i = 2;  // Start from third character (index 2)

        // Generate until we have at least n characters
        while (s.size() < n) {
            // Current instruction tells us how many to add
            int count = s.get(i) - '0';  // Convert char to int

            // Next character alternates: if last was '2', add '1's, and vice versa
            char nextChar = s.get(s.size() - 1) == '2' ? '1' : '2';

            // Add 'count' copies of nextChar
            for (int j = 0; j < count; j++) {
                s.add(nextChar);
            }

            // Move to next instruction
            i++;
        }

        // Count '1's in first n characters
        int ones = 0;
        for (int k = 0; k < n; k++) {
            if (s.get(k) == '1') ones++;
        }
        return ones;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We generate the string character by character until we have at least `n` characters
- Each character is processed exactly once when it's generated
- The counting step also takes O(n) time
- Overall linear time complexity

**Space Complexity: O(n)**

- We store the generated string up to length `n` (or slightly more)
- No additional significant data structures are used
- The space grows linearly with input size

## Common Mistakes

1. **Incorrect initialization**: Starting with `"1"` or `"12"` instead of `"122"`. The first three characters are fixed and crucial for correct generation.

2. **Wrong alternation logic**: Adding the same character type instead of alternating. Remember: after a group of '1's, you must add '2's, and vice versa.

3. **Off-by-one errors in the loop condition**: Using `<= n` instead of `< n` or vice versa. Test with small values like `n = 1, 2, 3` to catch these.

4. **Forgetting base cases**: Not handling `n = 0` or small `n` values separately. Always check edge cases first.

5. **Inefficient counting**: Generating more than `n` characters is fine, but generating the entire string for large `n` when we only need the count up to `n` is wasteful.

## When You'll See This Pattern

This "self-generating sequence with two pointers" pattern appears in several problems:

1. **Count and Say (LeetCode 38)**: Similar recursive definition where each term describes the previous term.

2. **Look-and-Say Sequence**: The classic sequence that this problem is based on, where each term is generated by "reading" the previous term.

3. **Sequence Reconstruction**: Problems where you need to generate a sequence based on its own properties often use similar pointer-based generation techniques.

The core pattern is using the sequence itself as instructions for its own extension, maintaining pointers to track both what to generate next and where to get the instructions from.

## Key Takeaways

1. **Self-referential sequences** can often be generated efficiently by using the sequence itself as a set of instructions for extension.

2. **Two-pointer technique** isn't just for searching - it's useful anytime you need to track multiple positions in a sequence with different purposes (one for reading instructions, one for writing results).

3. **When a problem defines something recursively**, consider whether you can build it iteratively from the base case outward, using what you've built so far to determine what to build next.

[Practice this problem on CodeJeet](/problem/magical-string)
