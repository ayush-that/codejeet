---
title: "How to Solve Report Spam Message — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Report Spam Message. Medium difficulty, 48.5% acceptance rate. Topics: Array, Hash Table, String."
date: "2028-05-17"
category: "dsa-patterns"
tags: ["report-spam-message", "array", "hash-table", "string", "medium"]
---

# How to Solve Report Spam Message

This problem asks us to determine if a message is spam based on whether it contains at least two banned words. While the concept is straightforward, the challenge lies in efficiently checking for multiple matches between two arrays of strings. The key insight is recognizing that repeated lookups in the banned words list make this a classic "lookup optimization" problem.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
message = ["hello", "world", "offer", "free", "money"]
bannedWords = ["free", "winner", "prize", "money"]
```

**Step-by-step process:**

1. Convert `bannedWords` into a set for O(1) lookups: `{"free", "winner", "prize", "money"}`
2. Initialize a counter for banned words found: `count = 0`
3. Check each word in message:
   - "hello" → not in banned set → `count = 0`
   - "world" → not in banned set → `count = 0`
   - "offer" → not in banned set → `count = 0`
   - "free" → IS in banned set → `count = 1`
   - "money" → IS in banned set → `count = 2`
4. Since `count >= 2`, return `true`

The message is spam because it contains two banned words ("free" and "money").

## Brute Force Approach

A naive solution would compare each word in the message against every word in the banned list:

1. For each word in `message`
2. For each word in `bannedWords`
3. If they match exactly, increment a counter
4. If counter reaches 2, return `true`
5. If we finish checking all words, return `false`

**Why this is inefficient:**

- Time complexity: O(n × m) where n = message length, m = bannedWords length
- For large inputs (e.g., 10,000 words in each array), this becomes 100 million comparisons
- We're doing repeated linear searches through `bannedWords` for each message word

While this approach would technically work, it fails efficiency requirements for larger inputs that are common in interview settings.

## Optimized Approach

The key insight is that we need to perform many lookups (checking if each message word is banned), and lookups in arrays are O(m) while lookups in hash sets are O(1) on average.

**Optimization strategy:**

1. Convert `bannedWords` to a hash set for O(1) lookups
2. Iterate through `message` words once
3. For each word, check if it exists in the banned set
4. Count matches and return `true` as soon as we find 2 matches
5. If we finish without finding 2 matches, return `false`

**Why this works:**

- The set gives us instant word existence checking
- We only need to scan the message once
- We can exit early as soon as we find 2 banned words
- The space tradeoff (storing banned words in a set) is minimal compared to the time savings

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n + m) where n = len(message), m = len(bannedWords)
# Space: O(m) for the banned words set
def isSpam(message, bannedWords):
    """
    Determines if a message is spam by checking if it contains
    at least two banned words.

    Args:
        message: List of words in the message
        bannedWords: List of banned words to check against

    Returns:
        True if message contains >= 2 banned words, False otherwise
    """
    # Step 1: Convert bannedWords to a set for O(1) lookups
    # This is the key optimization - checking if a word is in a set
    # is much faster than checking if it's in a list
    banned_set = set(bannedWords)

    # Step 2: Initialize counter for banned words found
    banned_count = 0

    # Step 3: Iterate through each word in the message
    for word in message:
        # Step 4: Check if current word is in the banned set
        if word in banned_set:
            # Step 5: Increment counter when we find a banned word
            banned_count += 1

            # Step 6: Early exit - if we've found 2 banned words,
            # we can return immediately without checking the rest
            if banned_count >= 2:
                return True

    # Step 7: If we finish the loop without finding 2 banned words,
    # the message is not spam
    return False
```

```javascript
// Time: O(n + m) where n = message.length, m = bannedWords.length
// Space: O(m) for the banned words set
function isSpam(message, bannedWords) {
  /**
   * Determines if a message is spam by checking if it contains
   * at least two banned words.
   *
   * @param {string[]} message - Array of words in the message
   * @param {string[]} bannedWords - Array of banned words to check against
   * @return {boolean} True if message contains >= 2 banned words
   */

  // Step 1: Convert bannedWords to a Set for O(1) lookups
  // JavaScript Sets provide efficient membership testing
  const bannedSet = new Set(bannedWords);

  // Step 2: Initialize counter for banned words found
  let bannedCount = 0;

  // Step 3: Iterate through each word in the message
  for (const word of message) {
    // Step 4: Check if current word is in the banned set
    if (bannedSet.has(word)) {
      // Step 5: Increment counter when we find a banned word
      bannedCount++;

      // Step 6: Early exit - return true as soon as we find 2 matches
      if (bannedCount >= 2) {
        return true;
      }
    }
  }

  // Step 7: If loop completes without finding 2 banned words
  return false;
}
```

```java
// Time: O(n + m) where n = message.length, m = bannedWords.length
// Space: O(m) for the banned words set
import java.util.HashSet;
import java.util.Set;

class Solution {
    public boolean isSpam(String[] message, String[] bannedWords) {
        /**
         * Determines if a message is spam by checking if it contains
         * at least two banned words.
         *
         * @param message Array of words in the message
         * @param bannedWords Array of banned words to check against
         * @return True if message contains >= 2 banned words, false otherwise
         */

        // Step 1: Convert bannedWords to a HashSet for O(1) lookups
        // HashSets provide constant-time contains() operations on average
        Set<String> bannedSet = new HashSet<>();
        for (String word : bannedWords) {
            bannedSet.add(word);
        }

        // Step 2: Initialize counter for banned words found
        int bannedCount = 0;

        // Step 3: Iterate through each word in the message
        for (String word : message) {
            // Step 4: Check if current word is in the banned set
            if (bannedSet.contains(word)) {
                // Step 5: Increment counter when we find a banned word
                bannedCount++;

                // Step 6: Early exit - return true as soon as we find 2 matches
                if (bannedCount >= 2) {
                    return true;
                }
            }
        }

        // Step 7: If loop completes without finding 2 banned words
        return false;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- `O(m)` to convert `bannedWords` to a set (where m = number of banned words)
- `O(n)` to iterate through the message (where n = number of words in message)
- Each lookup in the set is O(1) on average
- Total: O(n + m), which is linear in the total number of words

**Space Complexity: O(m)**

- We store all banned words in a hash set
- In the worst case, this uses O(m) space
- The message array is not copied, so we don't count it in additional space

**Why this is optimal:**

- We must at least look at each word once to check it → Ω(n) lower bound
- We need to know what words are banned → must process bannedWords somehow
- Hash sets give us the best possible lookup time for exact string matching

## Common Mistakes

1. **Using lists instead of sets for lookups**: Candidates often check `if word in bannedWords` (O(m) per word) instead of converting to a set first. This turns an O(n + m) solution into O(n × m).

2. **Forgetting early exit**: Some candidates count all banned words first, then check if count ≥ 2. While this works, early exit when count reaches 2 is more efficient, especially for long messages with banned words early on.

3. **Case sensitivity misunderstanding**: The problem says "exactly match," which implies case-sensitive comparison. Some candidates incorrectly convert to lowercase or uppercase, which would match "Free" with "free" when they shouldn't.

4. **Off-by-one with the count check**: Using `bannedCount > 2` instead of `bannedCount >= 2` would require 3 banned words to return true. Always double-check inequality signs against the problem statement.

5. **Not handling empty inputs**: While the problem doesn't specify edge cases, good solutions should handle empty messages (return false) and empty bannedWords lists (return false).

## When You'll See This Pattern

This "convert to set for fast lookups" pattern appears in many problems where you need to check membership efficiently:

1. **Two Sum (LeetCode 1)**: Store seen numbers in a hash map/set to find complements in O(1) time instead of searching the array.

2. **Contains Duplicate (LeetCode 217)**: Convert array to set and compare sizes, or use set to track seen elements.

3. **Intersection of Two Arrays (LeetCode 349)**: Convert one array to set, then check which elements from the other array exist in the set.

4. **Word Break (LeetCode 139)**: Store dictionary words in a set for O(1) lookups while checking if a string can be segmented.

The core pattern: When you need to perform many "contains" checks, convert your lookup list to a hash-based structure (set or map) first.

## Key Takeaways

1. **Hash sets transform O(n) lookups into O(1)**: Whenever you need to check if elements exist in a collection multiple times, consider converting to a set first. The upfront O(m) cost pays off with O(1) lookups.

2. **Early exit optimization**: When you only need to know if a condition is met (like "at least 2"), return as soon as you know the answer. Don't process unnecessary data.

3. **Exact string matching is case-sensitive**: Unless specified otherwise, "exact match" means identical strings including case. Read problem statements carefully for matching requirements.

[Practice this problem on CodeJeet](/problem/report-spam-message)
