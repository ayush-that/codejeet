---
title: "How to Solve Lexicographically Smallest String After Operations With Constraint — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Lexicographically Smallest String After Operations With Constraint. Medium difficulty, 62.9% acceptance rate. Topics: String, Greedy."
date: "2029-05-20"
category: "dsa-patterns"
tags:
  [
    "lexicographically-smallest-string-after-operations-with-constraint",
    "string",
    "greedy",
    "medium",
  ]
---

# How to Solve Lexicographically Smallest String After Operations With Constraint

You're given a string `s` and an integer `k`. You can perform operations where you change any character to any other character, but the total "distance" between the original and modified string must be at most `k`. The distance is calculated cyclically (wrapping from 'z' to 'a'), and you need to find the lexicographically smallest possible string after these operations. The challenge lies in balancing two competing goals: making the string as small as possible while staying within the distance budget.

## Visual Walkthrough

Let's trace through an example: `s = "bcd", k = 5`.

**Step 1: Understanding cyclic distance**
The distance between two characters is the minimum steps needed to change one to the other in a circular alphabet:

- 'a' to 'c': 2 steps (a→b→c)
- 'b' to 'a': 1 step (b→a)
- 'z' to 'b': 4 steps (z→a→b, not z→y→x... which would be 24 steps)

**Step 2: Our goal**
We want the lexicographically smallest string possible. This means we should try to make early characters as small as possible ('a' is best), working left to right.

**Step 3: Process each character**

1. First character 'b':
   - Changing to 'a' costs 1 (b→a)
   - We have k=5, so we can afford this
   - Result: 'a', k becomes 4

2. Second character 'c':
   - Changing to 'a' would cost 2 (c→b→a)
   - We have k=4, so we can afford this
   - Result: 'a', k becomes 2

3. Third character 'd':
   - Changing to 'a' would cost 3 (d→c→b→a)
   - We only have k=2, so we can't get all the way to 'a'
   - The best we can do is reduce by 2: 'd'→'b'
   - Result: 'b', k becomes 0

Final result: `"aab"`

**Key insight**: We should greedily try to make each character 'a' from left to right, spending our k budget as we go. Once k runs out, we can't make any more changes.

## Brute Force Approach

A naive approach would be to try all possible strings and check which ones satisfy the distance constraint, then pick the lexicographically smallest. For a string of length n, there are 26^n possible strings (26 choices for each character). For each candidate string, we'd need to calculate the distance from the original, which takes O(n) time. This gives us O(26^n × n) time complexity, which is completely infeasible even for small n.

Even a slightly better brute force might try all possible changes to each character, but without the greedy insight, we might waste k on later characters when we should use it on earlier ones. For example, if we tried to optimize each character independently without considering the left-to-right priority, we might end up with a suboptimal result.

## Optimized Approach

The key insight is **greedy processing from left to right**:

1. **Lexicographic order prioritizes earlier positions**: To get the smallest possible string, we must minimize the first character as much as possible, then the second, and so on.

2. **Cyclic distance calculation**: The distance from character `c` to 'a' is `min(ord(c) - ord('a'), 26 - (ord(c) - ord('a')))`. This accounts for both forward and backward wrapping in the circular alphabet.

3. **Budget management**: We have a total budget `k`. For each character:
   - Calculate the cost to change it to 'a'
   - If we can afford it, change it to 'a' and deduct the cost from k
   - If we can't afford the full cost to 'a', change it as much as we can (reduce by k), then set k to 0

4. **Early termination**: Once k reaches 0, we can't make any more changes, so we can stop processing.

This greedy approach works because:

- Making an earlier character smaller always improves lexicographic order more than making any later character smaller
- The cost function is symmetric and circular
- We're always making the optimal choice at each step given our remaining budget

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of string s
# Space: O(n) for the result string (or O(1) if modifying in-place)
def getSmallestString(s: str, k: int) -> str:
    """
    Returns the lexicographically smallest string that can be obtained
    by changing characters of s with total cyclic distance at most k.

    Args:
        s: The original string
        k: Maximum total distance allowed

    Returns:
        The lexicographically smallest possible string
    """
    # Convert string to list for mutable operations
    result = list(s)

    # Process each character from left to right
    for i in range(len(result)):
        # If we've used all our budget, we can't make more changes
        if k <= 0:
            break

        current_char = result[i]
        # Calculate the cyclic distance from current character to 'a'
        # There are two possible paths: forward (wrap through z) or backward
        distance_to_a = ord(current_char) - ord('a')
        cyclic_distance = min(distance_to_a, 26 - distance_to_a)

        # If we can afford to change this character to 'a'
        if k >= cyclic_distance:
            result[i] = 'a'
            k -= cyclic_distance
        else:
            # We can't reach 'a', but we can reduce the character as much as possible
            # Move the character backward by k positions
            new_char_code = (ord(current_char) - k)
            # Handle wrap-around if we go before 'a'
            if new_char_code < ord('a'):
                new_char_code += 26
            result[i] = chr(new_char_code)
            k = 0  # We've used all remaining budget

    # Convert list back to string
    return ''.join(result)
```

```javascript
// Time: O(n) where n is the length of string s
// Space: O(n) for the result string
/**
 * Returns the lexicographically smallest string that can be obtained
 * by changing characters of s with total cyclic distance at most k.
 *
 * @param {string} s - The original string
 * @param {number} k - Maximum total distance allowed
 * @return {string} The lexicographically smallest possible string
 */
function getSmallestString(s, k) {
  // Convert string to array for mutable operations
  const result = s.split("");

  // Process each character from left to right
  for (let i = 0; i < result.length; i++) {
    // If we've used all our budget, we can't make more changes
    if (k <= 0) {
      break;
    }

    const currentChar = result[i];
    // Calculate the cyclic distance from current character to 'a'
    // There are two possible paths: forward or backward
    const distanceToA = currentChar.charCodeAt(0) - "a".charCodeAt(0);
    const cyclicDistance = Math.min(distanceToA, 26 - distanceToA);

    // If we can afford to change this character to 'a'
    if (k >= cyclicDistance) {
      result[i] = "a";
      k -= cyclicDistance;
    } else {
      // We can't reach 'a', but we can reduce the character as much as possible
      // Move the character backward by k positions
      let newCharCode = currentChar.charCodeAt(0) - k;
      // Handle wrap-around if we go before 'a'
      if (newCharCode < "a".charCodeAt(0)) {
        newCharCode += 26;
      }
      result[i] = String.fromCharCode(newCharCode);
      k = 0; // We've used all remaining budget
    }
  }

  // Convert array back to string
  return result.join("");
}
```

```java
// Time: O(n) where n is the length of string s
// Space: O(n) for the result string
class Solution {
    /**
     * Returns the lexicographically smallest string that can be obtained
     * by changing characters of s with total cyclic distance at most k.
     *
     * @param s The original string
     * @param k Maximum total distance allowed
     * @return The lexicographically smallest possible string
     */
    public String getSmallestString(String s, int k) {
        // Convert string to char array for mutable operations
        char[] result = s.toCharArray();

        // Process each character from left to right
        for (int i = 0; i < result.length; i++) {
            // If we've used all our budget, we can't make more changes
            if (k <= 0) {
                break;
            }

            char currentChar = result[i];
            // Calculate the cyclic distance from current character to 'a'
            // There are two possible paths: forward or backward
            int distanceToA = currentChar - 'a';
            int cyclicDistance = Math.min(distanceToA, 26 - distanceToA);

            // If we can afford to change this character to 'a'
            if (k >= cyclicDistance) {
                result[i] = 'a';
                k -= cyclicDistance;
            } else {
                // We can't reach 'a', but we can reduce the character as much as possible
                // Move the character backward by k positions
                int newCharCode = currentChar - k;
                // Handle wrap-around if we go before 'a'
                if (newCharCode < 'a') {
                    newCharCode += 26;
                }
                result[i] = (char) newCharCode;
                k = 0;  // We've used all remaining budget
            }
        }

        // Convert char array back to string
        return new String(result);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character of the string exactly once in a single pass
- For each character, we perform constant-time operations: ASCII value calculations, comparisons, and arithmetic
- Even in the worst case, we look at every character once

**Space Complexity: O(n)**

- We need to store the result string, which requires O(n) space
- If we were allowed to modify the input in-place (and the input was mutable), we could achieve O(1) additional space
- The auxiliary variables (k, distances, character codes) use O(1) space

## Common Mistakes

1. **Forgetting about cyclic nature of distance**: Calculating distance as simple absolute difference without considering wrap-around from 'z' to 'a'. This fails for cases like changing 'z' to 'a', which should cost 1, not 25.

2. **Not processing left-to-right greedily**: Trying to optimize the whole string at once or right-to-left. Lexicographic order means earlier characters matter more, so we must prioritize them.

3. **Incorrect wrap-around handling when partially reducing**: When we can't reach 'a' but can reduce by some amount k, we need to handle the case where subtracting k goes past 'a'. For example, if current char is 'b' and k=2, we need to wrap to 'z', not go to character code -1.

4. **Not breaking early when k reaches 0**: Continuing to process characters after exhausting the budget wastes time. Once k=0, we can't make any more changes, so we should stop immediately.

## When You'll See This Pattern

This problem combines **greedy algorithms** with **cyclic/rotational calculations**, which appears in several other problems:

1. **Lexicographically Smallest String After Substring Operation** (LeetCode 2734): Similar concept of making a string lexicographically smallest through operations, though with different constraints.

2. **Minimum Time Difference** (LeetCode 539): Involves cyclic calculations on a 24-hour clock, similar to our circular alphabet distance calculations.

3. **Minimum Operations to Make the Array Increasing** (LeetCode 1827): Another greedy problem where you make changes with constraints to achieve a goal, prioritizing earlier elements.

The greedy left-to-right approach is common in string manipulation problems where lexicographic order matters. The cyclic distance calculation appears in problems involving circular buffers, clocks, or rotational systems.

## Key Takeaways

1. **Lexicographic order demands left-to-right greedy processing**: When you need the smallest lexicographic result, always prioritize making earlier characters as small as possible before considering later ones.

2. **Cyclic calculations require considering both directions**: When dealing with circular systems (alphabets, clocks, modular arithmetic), remember there are always two paths between any two points - the shorter one is the minimum of the forward and backward distances.

3. **Budget/constraint problems often benefit from greedy approaches**: When you have a limited resource (like k operations or distance budget), spending it optimally at each step from highest priority to lowest often yields the global optimum.

Related problems: [Lexicographically Smallest String After Substring Operation](/problem/lexicographically-smallest-string-after-substring-operation)
