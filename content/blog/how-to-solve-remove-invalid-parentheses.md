---
title: "How to Solve Remove Invalid Parentheses — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Remove Invalid Parentheses. Hard difficulty, 49.8% acceptance rate. Topics: String, Backtracking, Breadth-First Search."
date: "2027-05-09"
category: "dsa-patterns"
tags: ["remove-invalid-parentheses", "string", "backtracking", "breadth-first-search", "hard"]
---

# How to Solve Remove Invalid Parentheses

This problem asks us to remove the minimum number of parentheses from a string to make it valid, returning all unique valid strings that achieve this minimum removal count. What makes this problem tricky is that we need to find **all possible valid strings** with the minimum removals, not just one. We can't simply count mismatched parentheses and remove them greedily, because multiple removal combinations might yield valid strings with the same minimum removal count.

## Visual Walkthrough

Let's trace through example: `s = "()())()"`

**Step 1: Determine how many parentheses need to be removed**
We can scan the string to find mismatched parentheses:

- Start with `count = 0`
- `"("`: count = 1
- `")"`: count = 0
- `"("`: count = 1
- `")"`: count = 0
- `")"`: count = -1 (this is invalid - we have more closing than opening)
- `"("`: count = 0
- `")"`: count = -1 (another invalid closing)

We find we have 2 invalid closing parentheses. But wait, this simple count doesn't tell the whole story. We actually need to find the minimum removals by checking both directions.

**Step 2: BFS approach intuition**
Think of this as a search problem where each level represents removing one more parenthesis:

- Level 0: Original string `"()())()"`
- Level 1: Remove 1 character at each position:
  - Remove char 0: `")())()"` (invalid)
  - Remove char 1: `"(())()"` (valid!)
  - Remove char 2: `"()())()"` → `"()))()"` (invalid)
  - Remove char 3: `"()())()"` → `"()()()"` (valid!)
  - Remove char 4: `"()()()"` (valid!)
  - Remove char 5: `"()())("` (invalid)
  - Remove char 6: `"()())"` (invalid)

We found 3 valid strings at level 1: `"(())()"`, `"()()()"`, `"()()()"` (wait, the last two are duplicates). So we have 2 unique valid strings with 1 removal.

**Step 3: Why BFS works**
BFS ensures we find all valid strings with the minimum removals. Once we find valid strings at a certain level, we don't need to explore further removals (which would create strings with more removals than necessary).

## Brute Force Approach

A naive approach would be to generate all possible subsets of parentheses to remove (2^n possibilities where n is the string length), check which ones produce valid strings, then filter to those with minimum removals.

The problems with this approach:

1. **Exponential time complexity**: For a string of length n, there are 2^n possible removal combinations.
2. **Duplicate results**: We'd need to track duplicates.
3. **Inefficient validation**: We'd validate each generated string from scratch.

Even for moderate n=20, we'd have over 1 million combinations to check. This is clearly infeasible.

## Optimized Approach

The key insight is to use **Breadth-First Search (BFS)** to explore removal levels:

1. Start with the original string in a queue
2. At each level, remove one parenthesis from each string at that level
3. Check if any resulting strings are valid
4. If we find valid strings at a level, that's our answer (minimum removals)
5. If not, continue to the next level (one more removal)

**Why BFS is optimal**:

- BFS explores all strings with k removals before exploring strings with k+1 removals
- The first time we find valid strings, we know they have the minimum removals
- We can stop searching once we find valid strings at a level

**Optimization**: We need to avoid duplicates and re-processing the same string. We use a `visited` set to track strings we've already processed.

## Optimal Solution

The BFS solution systematically explores all possible removal combinations level by level, ensuring we find all valid strings with the minimum number of removals.

<div class="code-group">

```python
# Time: O(2^n) in worst case, but much better with pruning | Space: O(n * 2^n)
from collections import deque

def removeInvalidParentheses(s: str):
    """
    Returns all unique valid strings with minimum parentheses removed.
    Uses BFS to explore removal levels, ensuring minimum removals.
    """

    def is_valid(string):
        """Check if a string has balanced parentheses."""
        count = 0
        for char in string:
            if char == '(':
                count += 1
            elif char == ')':
                count -= 1
                # More closing than opening at any point is invalid
                if count < 0:
                    return False
        # Valid if all parentheses are balanced
        return count == 0

    # Handle edge case: empty string is valid
    if not s:
        return [""]

    result = []
    visited = set()
    queue = deque([s])
    found = False  # Flag to stop when we find valid strings at current level

    while queue:
        level_size = len(queue)

        # Process all strings at current level (same number of removals)
        for _ in range(level_size):
            current = queue.popleft()

            # Check if current string is valid
            if is_valid(current):
                result.append(current)
                found = True

            # If we haven't found valid strings yet, generate next level
            if not found:
                # Try removing each parenthesis from current string
                for i in range(len(current)):
                    # Skip non-parenthesis characters
                    if current[i] not in '()':
                        continue

                    # Create new string by removing character at position i
                    new_str = current[:i] + current[i+1:]

                    # Only process if we haven't seen this string before
                    if new_str not in visited:
                        visited.add(new_str)
                        queue.append(new_str)

        # If we found valid strings at this level, stop searching
        # (these have minimum removals)
        if found:
            break

    # If no valid strings found (e.g., all letters), return list with letters only
    if not result:
        # Remove all parentheses to get letters only
        letters = ''.join([c for c in s if c not in '()'])
        return [letters] if letters else [""]

    return result
```

```javascript
// Time: O(2^n) in worst case, but much better with pruning | Space: O(n * 2^n)
function removeInvalidParentheses(s) {
  /**
   * Returns all unique valid strings with minimum parentheses removed.
   * Uses BFS to explore removal levels, ensuring minimum removals.
   */

  // Helper function to check if a string has balanced parentheses
  const isValid = (str) => {
    let count = 0;
    for (let char of str) {
      if (char === "(") {
        count++;
      } else if (char === ")") {
        count--;
        // More closing than opening at any point is invalid
        if (count < 0) {
          return false;
        }
      }
    }
    // Valid if all parentheses are balanced
    return count === 0;
  };

  // Handle edge case: empty string is valid
  if (!s) {
    return [""];
  }

  const result = [];
  const visited = new Set();
  const queue = [s];
  let found = false; // Flag to stop when we find valid strings at current level

  while (queue.length > 0) {
    const levelSize = queue.length;

    // Process all strings at current level (same number of removals)
    for (let j = 0; j < levelSize; j++) {
      const current = queue.shift();

      // Check if current string is valid
      if (isValid(current)) {
        result.push(current);
        found = true;
      }

      // If we haven't found valid strings yet, generate next level
      if (!found) {
        // Try removing each parenthesis from current string
        for (let i = 0; i < current.length; i++) {
          // Skip non-parenthesis characters
          if (current[i] !== "(" && current[i] !== ")") {
            continue;
          }

          // Create new string by removing character at position i
          const newStr = current.slice(0, i) + current.slice(i + 1);

          // Only process if we haven't seen this string before
          if (!visited.has(newStr)) {
            visited.add(newStr);
            queue.push(newStr);
          }
        }
      }
    }

    // If we found valid strings at this level, stop searching
    // (these have minimum removals)
    if (found) {
      break;
    }
  }

  // If no valid strings found (e.g., all letters), return list with letters only
  if (result.length === 0) {
    // Remove all parentheses to get letters only
    const letters = s
      .split("")
      .filter((c) => c !== "(" && c !== ")")
      .join("");
    return letters ? [letters] : [""];
  }

  return result;
}
```

```java
// Time: O(2^n) in worst case, but much better with pruning | Space: O(n * 2^n)
import java.util.*;

public class Solution {
    public List<String> removeInvalidParentheses(String s) {
        /**
         * Returns all unique valid strings with minimum parentheses removed.
         * Uses BFS to explore removal levels, ensuring minimum removals.
         */

        List<String> result = new ArrayList<>();

        // Handle edge case: empty string is valid
        if (s == null || s.isEmpty()) {
            result.add("");
            return result;
        }

        // Helper function to check if a string has balanced parentheses
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        queue.offer(s);
        visited.add(s);
        boolean found = false;  // Flag to stop when we find valid strings at current level

        while (!queue.isEmpty()) {
            int levelSize = queue.size();

            // Process all strings at current level (same number of removals)
            for (int i = 0; i < levelSize; i++) {
                String current = queue.poll();

                // Check if current string is valid
                if (isValid(current)) {
                    result.add(current);
                    found = true;
                }

                // If we haven't found valid strings yet, generate next level
                if (!found) {
                    // Try removing each parenthesis from current string
                    for (int j = 0; j < current.length(); j++) {
                        char c = current.charAt(j);
                        // Skip non-parenthesis characters
                        if (c != '(' && c != ')') {
                            continue;
                        }

                        // Create new string by removing character at position j
                        String newStr = current.substring(0, j) + current.substring(j + 1);

                        // Only process if we haven't seen this string before
                        if (!visited.contains(newStr)) {
                            visited.add(newStr);
                            queue.offer(newStr);
                        }
                    }
                }
            }

            // If we found valid strings at this level, stop searching
            // (these have minimum removals)
            if (found) {
                break;
            }
        }

        // If no valid strings found (e.g., all letters), return list with letters only
        if (result.isEmpty()) {
            // Remove all parentheses to get letters only
            StringBuilder letters = new StringBuilder();
            for (char c : s.toCharArray()) {
                if (c != '(' && c != ')') {
                    letters.append(c);
                }
            }
            String lettersStr = letters.toString();
            result.add(lettersStr.isEmpty() ? "" : lettersStr);
        }

        return result;
    }

    private boolean isValid(String s) {
        /** Check if a string has balanced parentheses. */
        int count = 0;
        for (char c : s.toCharArray()) {
            if (c == '(') {
                count++;
            } else if (c == ')') {
                count--;
                // More closing than opening at any point is invalid
                if (count < 0) {
                    return false;
                }
            }
        }
        // Valid if all parentheses are balanced
        return count == 0;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity**: O(n × 2^n) in the worst case, where n is the length of the string. However, in practice it's much better because:

- We stop as soon as we find valid strings
- We prune duplicates using the visited set
- The branching factor decreases as we remove characters

**Space Complexity**: O(n × 2^n) in the worst case for the queue and visited set. Each string in the queue can be up to length n, and in the worst case we might store many strings.

**Why the worst case is exponential**: Consider a string like `"(((((((("` - we might need to explore removing various combinations of parentheses before finding a valid string (which would require removing all of them).

## Common Mistakes

1. **Not handling duplicates**: Candidates often forget that removing different parentheses can produce the same string. For example, removing the first or second `')'` from `"())"` both yield `"()"`. Always use a visited set.

2. **Continuing search after finding valid strings**: Some candidates continue BFS after finding valid strings at a level, which adds strings with more removals than necessary. Use a `found` flag to stop once you find valid strings at the current level.

3. **Incorrect validation function**: The validation must check for two conditions: 1) Never have more closing than opening parentheses at any point, and 2) End with balanced parentheses (count == 0). Missing either condition leads to wrong results.

4. **Forgetting non-parenthesis characters**: The string can contain letters. These should never be removed, only parentheses. Always skip non-parenthesis characters when generating new strings.

## When You'll See This Pattern

The BFS approach for finding minimum removals/transformations appears in several problems:

1. **Word Ladder (LeetCode 127)**: Find shortest transformation sequence from one word to another. Like this problem, it uses BFS to find the minimum number of changes.

2. **Open the Lock (LeetCode 752)**: Find minimum turns to open a combination lock. BFS explores all possible combinations level by level.

3. **Minimum Genetic Mutation (LeetCode 433)**: Similar to Word Ladder but with genetic sequences.

The pattern is: when you need to find the **minimum number of operations** to transform something, and operations can be applied in different orders/positions, BFS is often the right approach because it explores all possibilities with k operations before exploring k+1 operations.

## Key Takeaways

1. **BFS finds minimum transformations**: When you need the minimum number of operations (removals, changes, etc.), BFS ensures you explore all possibilities with k operations before k+1 operations.

2. **Prune duplicates aggressively**: In combinatorial search problems, the same state can be reached multiple ways. Always track visited states to avoid exponential blowup.

3. **Level-by-level processing is key**: Process all nodes at the current level before moving to the next. This ensures when you find a solution, it has the minimum operations.

Related problems: [Valid Parentheses](/problem/valid-parentheses), [Minimum Number of Swaps to Make the String Balanced](/problem/minimum-number-of-swaps-to-make-the-string-balanced)
