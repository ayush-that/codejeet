---
title: "How to Solve Consecutive Characters — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Consecutive Characters. Easy difficulty, 60.3% acceptance rate. Topics: String."
date: "2028-07-12"
category: "dsa-patterns"
tags: ["consecutive-characters", "string", "easy"]
---

# How to Solve Consecutive Characters

This problem asks us to find the maximum length of a substring containing only one unique character in a given string. While it seems straightforward, the subtle challenge lies in efficiently tracking consecutive runs without unnecessary complexity. The problem tests your ability to traverse a string while maintaining state about the current sequence, a fundamental pattern in string processing.

## Visual Walkthrough

Let's trace through an example to build intuition. Consider `s = "leetcode"`:

1. Start with `max_power = 0`, `current_power = 1` (first character 'l')
2. Move to index 1: 'e' ≠ 'l', so reset `current_power = 1`, update `max_power = max(0, 1) = 1`
3. Index 2: 'e' = 'e', so `current_power = 2`, `max_power = max(1, 2) = 2`
4. Index 3: 't' ≠ 'e', reset `current_power = 1`, `max_power = max(2, 1) = 2`
5. Index 4: 'c' ≠ 't', reset `current_power = 1`, `max_power = 2`
6. Index 5: 'o' ≠ 'c', reset `current_power = 1`, `max_power = 2`
7. Index 6: 'd' ≠ 'o', reset `current_power = 1`, `max_power = 2`
8. Index 7: 'e' ≠ 'd', reset `current_power = 1`, `max_power = 2`

The maximum power is 2 (from "ee").

Now try `s = "abbcccddddeeeeedcba"`:

- 'a': power = 1
- 'bb': power = 2
- 'ccc': power = 3
- 'dddd': power = 4
- 'eeeee': power = 5 (maximum)
- The rest are shorter sequences

The algorithm efficiently finds this by comparing each character to the previous one.

## Brute Force Approach

A naive approach would check every possible substring to see if it contains only one character:

1. Generate all substrings (O(n²) substrings)
2. For each substring, check if all characters are the same (O(k) where k is substring length)
3. Track the maximum length found

This results in O(n³) time complexity, which is far too slow for strings of meaningful length. Even an optimized O(n²) version that expands from each center would be inefficient compared to the optimal linear solution.

The key insight is that we don't need to check every substring explicitly. If we find a break in consecutive characters, we know any substring crossing that break cannot be uniform. This allows us to process the string in a single pass.

## Optimal Solution

The optimal solution uses a single pass through the string with two pointers or a simple counter. We maintain:

- `max_power`: the maximum consecutive count found so far
- `current_power`: the length of the current consecutive sequence

As we iterate through the string, we compare each character with the previous one. If they match, we increment `current_power`. If not, we reset `current_power` to 1 (starting a new sequence). After each step, we update `max_power` if needed.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def maxPower(s: str) -> int:
    """
    Returns the maximum length of a substring containing only one unique character.

    Args:
        s: Input string to analyze

    Returns:
        Maximum power (consecutive identical characters)
    """
    # Handle edge case: empty string
    if not s:
        return 0

    max_power = 1  # Minimum power is 1 (single character)
    current_power = 1  # Start counting from first character

    # Iterate through string starting from second character
    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            # Same character as previous, increment current sequence
            current_power += 1
        else:
            # Different character, reset sequence
            current_power = 1

        # Update maximum power if current sequence is longer
        max_power = max(max_power, current_power)

    return max_power
```

```javascript
// Time: O(n) | Space: O(1)
/**
 * Returns the maximum length of a substring containing only one unique character.
 * @param {string} s - Input string to analyze
 * @return {number} Maximum power (consecutive identical characters)
 */
function maxPower(s) {
  // Handle edge case: empty string
  if (s.length === 0) {
    return 0;
  }

  let maxPower = 1; // Minimum power is 1 (single character)
  let currentPower = 1; // Start counting from first character

  // Iterate through string starting from second character
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i - 1]) {
      // Same character as previous, increment current sequence
      currentPower++;
    } else {
      // Different character, reset sequence
      currentPower = 1;
    }

    // Update maximum power if current sequence is longer
    maxPower = Math.max(maxPower, currentPower);
  }

  return maxPower;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    /**
     * Returns the maximum length of a substring containing only one unique character.
     * @param s Input string to analyze
     * @return Maximum power (consecutive identical characters)
     */
    public int maxPower(String s) {
        // Handle edge case: empty string
        if (s == null || s.length() == 0) {
            return 0;
        }

        int maxPower = 1;  // Minimum power is 1 (single character)
        int currentPower = 1;  // Start counting from first character

        // Iterate through string starting from second character
        for (int i = 1; i < s.length(); i++) {
            if (s.charAt(i) == s.charAt(i - 1)) {
                // Same character as previous, increment current sequence
                currentPower++;
            } else {
                // Different character, reset sequence
                currentPower = 1;
            }

            // Update maximum power if current sequence is longer
            maxPower = Math.max(maxPower, currentPower);
        }

        return maxPower;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the string exactly once, performing constant-time operations (comparisons, increments, max calculations) at each position.
- The loop runs n-1 times (starting from index 1), which simplifies to O(n).

**Space Complexity: O(1)**

- We use only a fixed number of integer variables (`max_power`, `current_power`, loop index) regardless of input size.
- No additional data structures that grow with input size are used.

## Common Mistakes

1. **Forgetting the empty string case**: The problem states the string is non-empty, but in interviews, it's good practice to handle edge cases. Always check if the string could be empty and return 0 in that case.

2. **Off-by-one errors in loop initialization**: Starting the loop at index 0 instead of 1 would cause index out of bounds when accessing `s[i-1]`. Remember we need to compare each character with the previous one.

3. **Incorrect initialization of `max_power`**: Setting `max_power = 0` fails for single-character strings. The minimum valid answer is 1 (a string always has at least one character, and that character forms a valid substring of length 1).

4. **Forgetting to update `max_power` inside the loop**: Some candidates update `max_power` only when resetting `current_power`, but the maximum might occur in the middle of a sequence. Always update after each character comparison.

5. **Overcomplicating with two pointers**: While a two-pointer approach works, it's more complex than needed. The single counter approach is cleaner and less error-prone for this problem.

## When You'll See This Pattern

This "consecutive sequence tracking" pattern appears in many problems where you need to find the longest contiguous segment with a certain property:

1. **Max Consecutive Ones (LeetCode 485)**: Find the maximum number of consecutive 1s in a binary array. The same logic applies—just compare with previous element and track runs.

2. **Longest Continuous Increasing Subsequence (LeetCode 674)**: Find the length of the longest continuous increasing subsequence. Instead of checking for equality, check if current > previous.

3. **Maximum Subarray (LeetCode 53)**: While more complex (involves sums), it uses similar contiguous segment tracking with a "reset when beneficial" logic.

4. **String Compression (LeetCode 443)**: Count consecutive characters to compress a string, using the same comparison technique.

The core pattern: iterate through a sequence, compare each element with the previous, maintain a running count of the current "streak," and reset when the property no longer holds.

## Key Takeaways

1. **Single-pass algorithms often suffice for consecutive sequence problems**: When looking for contiguous properties, you usually don't need nested loops. A single pass with state tracking is optimal.

2. **Compare current with previous, not future elements**: For consecutive runs, it's easier to look backward than forward. This avoids complex lookahead logic and boundary conditions.

3. **Initialize carefully for edge cases**: Think about minimum valid answers (1 for this problem) and empty inputs. Proper initialization prevents off-by-one errors.

4. **This is a fundamental building block**: Mastering this pattern helps with more complex problems like sliding window, dynamic programming, and greedy algorithms that build on contiguous sequence analysis.

Related problems: [Max Consecutive Ones](/problem/max-consecutive-ones), [Longest Continuous Increasing Subsequence](/problem/longest-continuous-increasing-subsequence), [Check if an Array Is Consecutive](/problem/check-if-an-array-is-consecutive)
