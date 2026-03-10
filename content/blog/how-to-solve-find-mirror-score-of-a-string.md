---
title: "How to Solve Find Mirror Score of a String — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Mirror Score of a String. Medium difficulty, 35.4% acceptance rate. Topics: Hash Table, String, Stack, Simulation."
date: "2029-08-14"
category: "dsa-patterns"
tags: ["find-mirror-score-of-a-string", "hash-table", "string", "stack", "medium"]
---

# How to Solve Find Mirror Score of a String

This problem asks us to calculate a "mirror score" for a string by pairing each character with its mirror equivalent (a↔z, b↔y, etc.) while tracking which characters have been used. The tricky part is that we need to find the _closest_ unmarked mirror character to the left for each character we process, which creates a dependency on previous characters' states. This makes it more complex than a simple character mapping problem.

## Visual Walkthrough

Let's trace through an example: `s = "aczz"`

**Step 1:** Process 'a' (index 0)

- Mirror of 'a' is 'z'
- Look left for unmarked 'z' → none found (no characters to the left)
- Mark 'a' as used
- Score remains 0

**Step 2:** Process 'c' (index 1)

- Mirror of 'c' is 'x'
- Look left for unmarked 'x' → none found ('a' is not 'x')
- Mark 'c' as used
- Score remains 0

**Step 3:** Process 'z' (index 2)

- Mirror of 'z' is 'a'
- Look left for unmarked 'a' → found at index 0 (marked as used? No, it's unmarked!)
- Distance = 2 - 0 = 2
- Add 2 to score (score = 2)
- Mark both 'z' (index 2) and 'a' (index 0) as used

**Step 4:** Process 'z' (index 3)

- Mirror of 'z' is 'a'
- Look left for unmarked 'a' → none found (the 'a' at index 0 is already marked)
- Mark 'z' as used
- Score remains 2

**Final score:** 2

The key insight: we need to quickly find the _closest unmarked_ mirror character to the left for each character we process.

## Brute Force Approach

A naive approach would be:

1. Create a mirror mapping (a↔z, b↔y, etc.)
2. For each character in the string (left to right):
   - Find its mirror character
   - Scan leftwards from current position to find the closest unmarked occurrence of that mirror character
   - If found: calculate distance, mark both characters, add to score
   - If not found: mark current character only

The brute force code would look like this:

```python
def mirrorScoreBruteForce(s):
    # Create mirror mapping
    mirror = {}
    for i in range(26):
        mirror[chr(ord('a') + i)] = chr(ord('z') - i)

    n = len(s)
    marked = [False] * n
    score = 0

    for i in range(n):
        if marked[i]:
            continue

        target = mirror[s[i]]

        # Scan leftwards for closest unmarked target
        closest = -1
        for j in range(i-1, -1, -1):
            if not marked[j] and s[j] == target:
                closest = j
                break

        if closest != -1:
            distance = i - closest
            score += distance
            marked[i] = True
            marked[closest] = True
        else:
            marked[i] = True

    return score
```

**Why this is inefficient:**

- Time complexity: O(n²) in worst case (scanning left for each character)
- For each of n characters, we might scan up to n positions to the left
- With n up to 10⁵ (typical constraint), O(n²) is far too slow (~10¹⁰ operations)

## Optimized Approach

The key optimization is realizing we need to quickly find the _closest unmarked_ mirror character to the left. This is a perfect use case for a stack-like structure, but with a twist: we need to track characters by type.

**Optimal Insight:**
For each character type (a-z), maintain a stack of indices where that character appears and is still unmarked. When we process a character:

1. Get its mirror character
2. Check if there are any unmarked occurrences of that mirror character to the left
3. If yes: use the most recent one (closest), calculate distance, mark both
4. If no: add current character to its stack for potential future use

This gives us O(1) access to the closest unmarked mirror character!

**Why stacks work:**

- Last-In-First-Out (LIFO) ensures we always use the _closest_ unmarked mirror
- When we mark a character, we remove it from its stack
- Each character is pushed and popped at most once

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def mirrorScore(s: str) -> int:
    """
    Calculate the mirror score of a string.

    The mirror score is calculated by pairing each character with its
    closest unmarked mirror character to the left, and summing the
    distances between paired characters.

    Args:
        s: Input string consisting of lowercase English letters

    Returns:
        The total mirror score
    """
    # Step 1: Create mirror character mapping
    # a↔z, b↔y, c↔x, etc.
    mirror = {}
    for i in range(26):
        mirror[chr(ord('a') + i)] = chr(ord('z') - i)

    # Step 2: Initialize stacks for each character (a-z)
    # Each stack will store indices of unmarked occurrences of that character
    stacks = [[] for _ in range(26)]

    score = 0

    # Step 3: Process each character in the string
    for i, ch in enumerate(s):
        # Get the mirror character for current character
        target = mirror[ch]
        target_idx = ord(target) - ord('a')

        # Step 4: Check if there's an unmarked mirror character to the left
        if stacks[target_idx]:
            # Found a match! Use the closest one (last in stack)
            j = stacks[target_idx].pop()  # Remove from unmarked pool
            distance = i - j
            score += distance
            # Current character 'ch' is implicitly marked by not being pushed to stack
        else:
            # No match found, add current character to its stack for potential future use
            ch_idx = ord(ch) - ord('a')
            stacks[ch_idx].append(i)

    return score
```

```javascript
// Time: O(n) | Space: O(n)
/**
 * Calculate the mirror score of a string.
 *
 * The mirror score is calculated by pairing each character with its
 * closest unmarked mirror character to the left, and summing the
 * distances between paired characters.
 *
 * @param {string} s - Input string consisting of lowercase English letters
 * @return {number} The total mirror score
 */
function mirrorScore(s) {
  // Step 1: Create mirror character mapping
  // a↔z, b↔y, c↔x, etc.
  const mirror = {};
  for (let i = 0; i < 26; i++) {
    const from = String.fromCharCode("a".charCodeAt(0) + i);
    const to = String.fromCharCode("z".charCodeAt(0) - i);
    mirror[from] = to;
  }

  // Step 2: Initialize stacks for each character (a-z)
  // Each stack will store indices of unmarked occurrences of that character
  const stacks = Array(26)
    .fill()
    .map(() => []);

  let score = 0;

  // Step 3: Process each character in the string
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    // Get the mirror character for current character
    const target = mirror[ch];
    const targetIdx = target.charCodeAt(0) - "a".charCodeAt(0);

    // Step 4: Check if there's an unmarked mirror character to the left
    if (stacks[targetIdx].length > 0) {
      // Found a match! Use the closest one (last in stack)
      const j = stacks[targetIdx].pop(); // Remove from unmarked pool
      const distance = i - j;
      score += distance;
      // Current character 'ch' is implicitly marked by not being pushed to stack
    } else {
      // No match found, add current character to its stack for potential future use
      const chIdx = ch.charCodeAt(0) - "a".charCodeAt(0);
      stacks[chIdx].push(i);
    }
  }

  return score;
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.Stack;

class Solution {
    /**
     * Calculate the mirror score of a string.
     *
     * The mirror score is calculated by pairing each character with its
     * closest unmarked mirror character to the left, and summing the
     * distances between paired characters.
     *
     * @param s Input string consisting of lowercase English letters
     * @return The total mirror score
     */
    public int mirrorScore(String s) {
        // Step 1: Create mirror character mapping
        // a↔z, b↔y, c↔x, etc.
        char[] mirror = new char[26];
        for (int i = 0; i < 26; i++) {
            mirror[i] = (char)('z' - i);
        }

        // Step 2: Initialize stacks for each character (a-z)
        // Each stack will store indices of unmarked occurrences of that character
        Stack<Integer>[] stacks = new Stack[26];
        for (int i = 0; i < 26; i++) {
            stacks[i] = new Stack<>();
        }

        int score = 0;

        // Step 3: Process each character in the string
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            // Get the mirror character for current character
            char target = mirror[ch - 'a'];
            int targetIdx = target - 'a';

            // Step 4: Check if there's an unmarked mirror character to the left
            if (!stacks[targetIdx].isEmpty()) {
                // Found a match! Use the closest one (last in stack)
                int j = stacks[targetIdx].pop();  // Remove from unmarked pool
                int distance = i - j;
                score += distance;
                // Current character 'ch' is implicitly marked by not being pushed to stack
            } else {
                // No match found, add current character to its stack for potential future use
                int chIdx = ch - 'a';
                stacks[chIdx].push(i);
            }
        }

        return score;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n)

- We process each character exactly once
- Each character either:
  - Gets pushed to a stack (O(1))
  - Causes a pop from a stack (O(1))
- Mirror mapping creation is O(26) = O(1)
- Total: O(n) operations

**Space Complexity:** O(n)

- In worst case, all characters might be pushed to stacks (if no matches)
- Stacks store indices, so maximum n indices total
- Mirror mapping uses O(26) = O(1) space
- Total: O(n) space

## Common Mistakes

1. **Forgetting that characters become "marked" after being used**
   - Once a character is paired, it cannot be used again
   - Solution: Remove paired characters from their respective stacks

2. **Using the wrong data structure for finding closest match**
   - Using a simple list or array requires O(n) search per character
   - Solution: Use stacks for O(1) access to most recent unmarked character

3. **Incorrect mirror mapping**
   - 'a' maps to 'z', not 'a' itself
   - Must handle all 26 letters correctly
   - Solution: Use formula `mirror[ch] = chr(ord('z') - (ord(ch) - ord('a')))`

4. **Not handling the case where no match is found**
   - Characters without matches to the left should be added to stack for potential future matches
   - Solution: Always push current character to stack when no match found

## When You'll See This Pattern

This "closest matching pair" pattern with stacks appears in several problems:

1. **Valid Parentheses (LeetCode 20)** - Uses stack to match opening with closing brackets
   - Similar: Need to find matching pairs, but here distance matters

2. **Remove All Adjacent Duplicates In String (LeetCode 1047)** - Uses stack to remove adjacent duplicates
   - Similar: Process characters sequentially, use stack to track state

3. **Daily Temperatures (LeetCode 739)** - Find next warmer temperature using stack
   - Similar: Need to find closest element satisfying a condition to the right

The core pattern: When you need to find the _closest_ element satisfying some condition relative to current position, and elements become "unavailable" after being used, consider using stacks.

## Key Takeaways

1. **Stacks are ideal for "closest match" problems** - When you need to pair elements with their nearest eligible partner, stacks give you O(1) access to the most recent candidate.

2. **Implicit state tracking** - By only pushing unmatched characters to stacks, we implicitly track which characters are "available" for matching. This avoids needing separate marked/unmarked arrays.

3. **Precompute mappings for efficiency** - Creating the mirror mapping once at the beginning is more efficient than calculating it for each character.

[Practice this problem on CodeJeet](/problem/find-mirror-score-of-a-string)
