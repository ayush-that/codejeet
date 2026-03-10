---
title: "How to Solve Find the K-th Character in String Game II — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Find the K-th Character in String Game II. Hard difficulty, 48.5% acceptance rate. Topics: Math, Bit Manipulation, Recursion."
date: "2027-09-11"
category: "dsa-patterns"
tags: ["find-the-k-th-character-in-string-game-ii", "math", "bit-manipulation", "recursion", "hard"]
---

# How to Solve Find the K-th Character in String Game II

This problem presents a game where Alice starts with the string `"a"` and performs a series of operations defined by an integer array. Each operation either appends a new character or transforms the entire string by incrementing each character. The challenge is to find the k-th character (1-indexed) in the final string after all operations, without actually building the potentially massive string. The difficulty lies in the exponential growth of the string length and the need to work backwards from the target position.

## Visual Walkthrough

Let's trace through a small example: `operations = [1, 2, 1]` and `k = 4`.

**Initial state:** `word = "a"`

**Operation 1 (type 1):** Append `"a"` to the string

- Current string: `"a" + "a" = "aa"`
- Length: 2

**Operation 2 (type 2):** Increment each character by 1

- `'a'` becomes `'b'`, so `"aa"` becomes `"bb"`
- Length remains: 2

**Operation 3 (type 1):** Append `"a"` to the string

- Current string: `"bb" + "a" = "bba"`
- Length: 3

The 4th character doesn't exist since the final string has only 3 characters. This shows us that `k` must be ≤ the final length.

Now let's try `k = 3` with the same operations:

**Final string:** `"bba"`

- Position 1: `'b'`
- Position 2: `'b'`
- Position 3: `'a'`

So the answer would be `'a'`.

The key insight is that we can work backwards from the final position to determine which original character it came from, without building the entire string.

## Brute Force Approach

The most straightforward approach would be to simulate the entire process:

1. Start with `word = "a"`
2. For each operation:
   - If type 1: append `"a"` to `word`
   - If type 2: increment each character in `word` by 1 (with wrap-around from `'z'` to `'a'`)
3. Return the k-th character of the final string

However, this approach fails because:

- The string can grow exponentially (each type 1 operation doubles the length)
- With up to 50 operations, the final string could have 2^50 characters (~1 quadrillion characters)
- This is far too large to store in memory or process directly
- Even with optimization, processing each character would take impossibly long

The brute force approach is only useful for understanding the problem, not for solving it within constraints.

## Optimized Approach

The key insight is that we can work **backwards** from the target position `k` to determine which original character it corresponds to. Here's the reasoning:

1. **Type 2 operations** (increment all characters) don't change the length, only the character values. If we know a character's original value, we can determine how many increments it has undergone.

2. **Type 1 operations** (append "a") double the length. When working backwards:
   - If `k` is in the second half of the string (after a type 1 operation), it came from the appended "a"
   - If `k` is in the first half, it came from the original string before the append

3. **Working backwards algorithm**:
   - Start with the final position `k` and track how many increments have been applied to it
   - Process operations in reverse order:
     - For type 2: increment the count (tracking how many times this character has been incremented)
     - For type 1:
       - If `k` > current_length/2: the character came from an appended "a", so we can return it immediately (adjusted for increments)
       - If `k` ≤ current_length/2: the character came from the original part, so we continue searching with the same `k`

4. **Character calculation**: Once we find the origin of our character (either an original "a" or an appended "a"), we calculate:
   - Start with `'a'`
   - Apply all accumulated increments (mod 26 to handle wrap-around)
   - Return the final character

This approach is efficient because we only process each operation once, regardless of the string length.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the number of operations
# Space: O(1) as we only use a few variables
def kthCharacter(self, k: int, operations: List[int]) -> str:
    """
    Find the k-th character after applying all operations.

    Approach: Work backwards from the target position k to determine
    which original character it corresponds to, tracking how many
    increments have been applied to that character.
    """
    # Track the current length of the string
    # Start with "a" which has length 1
    length = 1

    # Track how many increments have been applied to our target character
    increments = 0

    # Process operations in reverse order
    # We need to know the length at each step, so first calculate final length
    for op in operations:
        if op == 1:
            # Type 1: append "a" - doubles the length
            length *= 2
        # Type 2 doesn't change length, only increments characters

    # Now work backwards from the final state
    for op in reversed(operations):
        if op == 2:
            # Type 2: all characters were incremented
            # If our target character exists at this point, it gets incremented
            increments += 1
        else:  # op == 1
            # Type 1: string was formed by original + appended "a"
            half = length // 2

            if k > half:
                # Our character is in the second half (appended part)
                # It started as 'a' and has received all increments so far
                # Apply increments modulo 26 (for wrap-around 'z' -> 'a')
                return chr(ord('a') + (increments % 26))
            else:
                # Our character is in the first half (original part)
                # Continue searching in the original string
                # The length is now halved
                length = half

    # If we've processed all operations and haven't returned,
    # our character must be from the original single "a"
    # Apply all accumulated increments
    return chr(ord('a') + (increments % 26))
```

```javascript
// Time: O(n) where n is the number of operations
// Space: O(1) as we only use a few variables
function kthCharacter(k, operations) {
  /**
   * Find the k-th character after applying all operations.
   *
   * Approach: Work backwards from the target position k to determine
   * which original character it corresponds to, tracking how many
   * increments have been applied to that character.
   */

  // Track the current length of the string
  // Start with "a" which has length 1
  let length = 1;

  // Track how many increments have been applied to our target character
  let increments = 0;

  // Process operations in forward order to calculate final length
  for (const op of operations) {
    if (op === 1) {
      // Type 1: append "a" - doubles the length
      length *= 2;
    }
    // Type 2 doesn't change length, only increments characters
  }

  // Now work backwards from the final state
  for (let i = operations.length - 1; i >= 0; i--) {
    const op = operations[i];

    if (op === 2) {
      // Type 2: all characters were incremented
      // If our target character exists at this point, it gets incremented
      increments++;
    } else {
      // op === 1
      // Type 1: string was formed by original + appended "a"
      const half = Math.floor(length / 2);

      if (k > half) {
        // Our character is in the second half (appended part)
        // It started as 'a' and has received all increments so far
        // Apply increments modulo 26 (for wrap-around 'z' -> 'a')
        return String.fromCharCode("a".charCodeAt(0) + (increments % 26));
      } else {
        // Our character is in the first half (original part)
        // Continue searching in the original string
        // The length is now halved
        length = half;
      }
    }
  }

  // If we've processed all operations and haven't returned,
  // our character must be from the original single "a"
  // Apply all accumulated increments
  return String.fromCharCode("a".charCodeAt(0) + (increments % 26));
}
```

```java
// Time: O(n) where n is the number of operations
// Space: O(1) as we only use a few variables
class Solution {
    public char kthCharacter(int k, int[] operations) {
        /**
         * Find the k-th character after applying all operations.
         *
         * Approach: Work backwards from the target position k to determine
         * which original character it corresponds to, tracking how many
         * increments have been applied to that character.
         */

        // Track the current length of the string
        // Start with "a" which has length 1
        long length = 1; // Use long to avoid overflow with many operations

        // Track how many increments have been applied to our target character
        int increments = 0;

        // Process operations in forward order to calculate final length
        for (int op : operations) {
            if (op == 1) {
                // Type 1: append "a" - doubles the length
                length *= 2;
            }
            // Type 2 doesn't change length, only increments characters
        }

        // Now work backwards from the final state
        for (int i = operations.length - 1; i >= 0; i--) {
            int op = operations[i];

            if (op == 2) {
                // Type 2: all characters were incremented
                // If our target character exists at this point, it gets incremented
                increments++;
            } else { // op == 1
                // Type 1: string was formed by original + appended "a"
                long half = length / 2;

                if (k > half) {
                    // Our character is in the second half (appended part)
                    // It started as 'a' and has received all increments so far
                    // Apply increments modulo 26 (for wrap-around 'z' -> 'a')
                    return (char) ('a' + (increments % 26));
                } else {
                    // Our character is in the first half (original part)
                    // Continue searching in the original string
                    // The length is now halved
                    length = half;
                }
            }
        }

        // If we've processed all operations and haven't returned,
        // our character must be from the original single "a"
        // Apply all accumulated increments
        return (char) ('a' + (increments % 26));
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n) where n is the number of operations

- We make two passes through the operations array
- First pass (forward): O(n) to calculate the final length
- Second pass (backward): O(n) to trace back to the character's origin
- Each operation is processed in constant time

**Space Complexity:** O(1)

- We only use a few variables: `length`, `increments`, loop counters
- No additional data structures that grow with input size
- The input operations array is given, not counted in our space usage

## Common Mistakes

1. **Attempting to build the entire string**: This is the most common mistake. With up to 50 operations, the string could have 2^50 characters (~1.1 quadrillion), which is impossible to store or process. Always check constraints before implementing a simulation approach.

2. **Forgetting about modulo 26 for character increments**: When a character reaches 'z', the next increment should wrap around to 'a'. Failing to use `% 26` will result in invalid characters or index out of bounds errors.

3. **Incorrect handling of type 1 operations when working backwards**: When `k` is in the first half after a type 1 operation, you need to continue searching with the same `k` (not halve it). Only the length halves, not the position.

4. **Using integer overflow for length calculation**: With 50 type 1 operations, the length becomes 2^50 which exceeds 32-bit integer limits. Use 64-bit integers (long in Java/C++, long long in C) to avoid overflow.

## When You'll See This Pattern

This "work backwards" pattern appears in several problems where direct simulation is impossible due to exponential growth:

1. **Shifting Letters (LeetCode 848)**: Similar character shifting with wrap-around, though simpler as it doesn't involve exponential string growth.

2. **K-th Symbol in Grammar (LeetCode 779)**: Finding the k-th character in a recursively defined sequence without building the entire sequence. The pattern of checking which half `k` falls into is very similar.

3. **Find Winner on a Tic Tac Toe Game (LeetCode 1275)**: While not about strings, it shares the "work backwards from final state" approach to determine game outcomes efficiently.

4. **Bulb Switcher (LeetCode 319)**: Another problem where simulating all steps is too slow, requiring mathematical insight to work backwards from the final state.

## Key Takeaways

1. **When faced with exponential growth, think backwards**: If building the entire structure is impossible, consider tracing back from the final result to its origin. This often turns exponential problems into linear ones.

2. **Track transformations separately from structure**: In this problem, we tracked character increments separately from position calculations. This separation of concerns simplifies complex transformations.

3. **Modular arithmetic is key for cyclic operations**: Whenever you have wrap-around behavior (like 'z' to 'a'), remember to use modulo arithmetic to keep values within bounds.

4. **Always verify your approach against constraints**: Before coding, mentally test if your solution can handle the maximum input size. If not, you need a more efficient approach.

Related problems: [Shifting Letters](/problem/shifting-letters)
