---
title: "How to Solve Sender With Largest Word Count — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Sender With Largest Word Count. Medium difficulty, 59.5% acceptance rate. Topics: Array, Hash Table, String, Counting."
date: "2028-09-28"
category: "dsa-patterns"
tags: ["sender-with-largest-word-count", "array", "hash-table", "string", "medium"]
---

# How to Solve Sender With Largest Word Count

This problem asks us to find which sender sent the most words across all their messages. While it seems straightforward, the challenge lies in efficiently counting words per sender and handling tie-breakers where multiple senders have the same word count—in which case we return the lexicographically largest sender name. The combination of counting, comparison, and string handling makes this a practical test of hash table usage and attention to detail.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
messages = ["Hello userTwooo","How are you doing today","I love this product"]
senders = ["Alice","Bob","Alice"]
```

**Step-by-step processing:**

1. **Initialize tracking:** We'll create a dictionary to store word counts per sender.

2. **Process first message:**
   - Sender: "Alice"
   - Message: "Hello userTwooo"
   - Word count: 2 (split by spaces)
   - Update: Alice's total = 2

3. **Process second message:**
   - Sender: "Bob"
   - Message: "How are you doing today"
   - Word count: 5
   - Update: Bob's total = 5

4. **Process third message:**
   - Sender: "Alice"
   - Message: "I love this product"
   - Word count: 4
   - Update: Alice's total = 2 + 4 = 6

5. **Final counts:**
   - Alice: 6 words
   - Bob: 5 words

6. **Find maximum:** Alice has the highest count (6 > 5), so we return "Alice".

**Tie-breaker scenario:**
If Alice had 5 words and Bob had 5 words, we'd compare "Alice" and "Bob" lexicographically. Since "Bob" > "Alice" (B comes after A), we'd return "Bob".

## Brute Force Approach

A naive approach might involve:

1. Creating a list of unique senders
2. For each sender, scanning through all messages to count their words
3. Tracking the maximum count and corresponding sender
4. Handling ties by comparing sender names

**Why this is inefficient:**

- For `n` messages and `k` unique senders, we'd process each message `k` times
- This gives us O(k × n) time complexity, which becomes O(n²) in the worst case when each message is from a different sender
- We're doing redundant work by repeatedly scanning the same messages

**What candidates might try and fail:**

- Trying to track only the current maximum without storing all counts (fails when a later sender exceeds the current maximum)
- Forgetting to accumulate counts for senders with multiple messages
- Incorrectly handling tie-breakers by returning the first sender instead of the lexicographically largest

## Optimized Approach

The key insight is that we need to **accumulate word counts per sender** as we process each message exactly once. This calls for a hash table (dictionary/map) where:

- Keys are sender names
- Values are their total word counts

**Step-by-step reasoning:**

1. **Initialize a hash table** to store sender → word count mappings.

2. **Iterate through all messages once:**
   - For each index `i`, get the sender and message
   - Count words in the message (split by spaces and get length)
   - Add this count to the sender's running total in the hash table

3. **Find the sender with maximum word count:**
   - Initialize variables to track the maximum count and best sender
   - Iterate through the hash table entries
   - For each sender:
     - If their count > current maximum: update both maximum and best sender
     - If their count == current maximum: compare sender names lexicographically, keep the larger one

4. **Return the best sender.**

**Why this works:**

- Each message is processed exactly once: O(n) time
- Hash table operations (insert, update, lookup) are O(1) on average
- We handle tie-breakers correctly by comparing strings
- The space used is proportional to the number of unique senders

## Optimal Solution

Here's the complete implementation with detailed comments:

<div class="code-group">

```python
# Time: O(n * w) where n is number of messages, w is average words per message
# Space: O(s) where s is number of unique senders
def largestWordCount(messages, senders):
    """
    Find the sender with the largest total word count across all their messages.
    In case of a tie, return the lexicographically largest sender name.
    """
    # Step 1: Initialize hash table to store word counts per sender
    word_count = {}

    # Step 2: Process each message and accumulate word counts
    for i in range(len(messages)):
        sender = senders[i]
        message = messages[i]

        # Count words in current message (split by spaces)
        # len(message.split()) handles empty strings correctly
        words_in_message = len(message.split())

        # Update sender's total word count
        # Use get() with default 0 for first occurrence
        word_count[sender] = word_count.get(sender, 0) + words_in_message

    # Step 3: Find sender with maximum word count
    max_words = 0
    best_sender = ""

    # Iterate through all senders and their word counts
    for sender, count in word_count.items():
        # Case 1: Found a new maximum
        if count > max_words:
            max_words = count
            best_sender = sender

        # Case 2: Tie with current maximum
        elif count == max_words:
            # Keep the lexicographically larger sender
            # Python string comparison uses lexicographic order
            if sender > best_sender:
                best_sender = sender

    # Step 4: Return the sender with maximum word count
    return best_sender
```

```javascript
// Time: O(n * w) where n is number of messages, w is average words per message
// Space: O(s) where s is number of unique senders
function largestWordCount(messages, senders) {
  /**
   * Find the sender with the largest total word count across all their messages.
   * In case of a tie, return the lexicographically largest sender name.
   */
  // Step 1: Initialize hash map to store word counts per sender
  const wordCount = new Map();

  // Step 2: Process each message and accumulate word counts
  for (let i = 0; i < messages.length; i++) {
    const sender = senders[i];
    const message = messages[i];

    // Count words in current message (split by spaces)
    // trim() ensures no leading/trailing spaces affect count
    // filter(Boolean) handles multiple spaces correctly
    const wordsInMessage = message.split(" ").filter((word) => word.length > 0).length;

    // Update sender's total word count
    // Get current count or 0 if sender not in map yet
    const currentCount = wordCount.get(sender) || 0;
    wordCount.set(sender, currentCount + wordsInMessage);
  }

  // Step 3: Find sender with maximum word count
  let maxWords = 0;
  let bestSender = "";

  // Iterate through all senders and their word counts
  for (const [sender, count] of wordCount.entries()) {
    // Case 1: Found a new maximum
    if (count > maxWords) {
      maxWords = count;
      bestSender = sender;
    }
    // Case 2: Tie with current maximum
    else if (count === maxWords) {
      // Keep the lexicographically larger sender
      // localeCompare returns negative if sender > bestSender
      if (sender.localeCompare(bestSender) > 0) {
        bestSender = sender;
      }
    }
  }

  // Step 4: Return the sender with maximum word count
  return bestSender;
}
```

```java
// Time: O(n * w) where n is number of messages, w is average words per message
// Space: O(s) where s is number of unique senders
import java.util.HashMap;
import java.util.Map;

class Solution {
    public String largestWordCount(String[] messages, String[] senders) {
        /**
         * Find the sender with the largest total word count across all their messages.
         * In case of a tie, return the lexicographically largest sender name.
         */
        // Step 1: Initialize hash map to store word counts per sender
        Map<String, Integer> wordCount = new HashMap<>();

        // Step 2: Process each message and accumulate word counts
        for (int i = 0; i < messages.length; i++) {
            String sender = senders[i];
            String message = messages[i];

            // Count words in current message (split by spaces)
            // trim() ensures no leading/trailing spaces affect count
            // "\\s+" handles multiple spaces correctly
            String[] words = message.trim().split("\\s+");
            int wordsInMessage = words.length;

            // Update sender's total word count
            // getOrDefault handles first occurrence with default 0
            wordCount.put(sender, wordCount.getOrDefault(sender, 0) + wordsInMessage);
        }

        // Step 3: Find sender with maximum word count
        int maxWords = 0;
        String bestSender = "";

        // Iterate through all senders and their word counts
        for (Map.Entry<String, Integer> entry : wordCount.entrySet()) {
            String sender = entry.getKey();
            int count = entry.getValue();

            // Case 1: Found a new maximum
            if (count > maxWords) {
                maxWords = count;
                bestSender = sender;
            }
            // Case 2: Tie with current maximum
            else if (count == maxWords) {
                // Keep the lexicographically larger sender
                // compareTo returns > 0 if sender > bestSender
                if (sender.compareTo(bestSender) > 0) {
                    bestSender = sender;
                }
            }
        }

        // Step 4: Return the sender with maximum word count
        return bestSender;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × w)**

- `n`: number of messages
- `w`: average number of words per message
- We iterate through all messages once: O(n)
- For each message, we split it to count words: O(w) per message
- We then iterate through unique senders: O(s) where s ≤ n
- Total: O(n × w + s) → O(n × w) since w ≥ 1

**Space Complexity: O(s)**

- `s`: number of unique senders
- We store a hash table entry for each unique sender
- Each entry stores a string (sender name) and an integer (count)
- In worst case, each message is from a different sender: O(n)

## Common Mistakes

1. **Incorrect word counting:** Using `len(message)` instead of `len(message.split())` counts characters, not words. Always split by spaces to count words.

2. **Forgetting to accumulate counts:** When a sender appears multiple times, you must add to their existing total, not overwrite it. Use `+=` not `=`.

3. **Wrong tie-breaking logic:** When counts are equal, you need the lexicographically _largest_ sender, not the first one found. Compare strings using `>` in Python, `localeCompare()` in JavaScript, or `compareTo()` in Java.

4. **Not handling empty messages:** An empty message should contribute 0 words. `"".split()` returns `['']` in some languages, so use `filter` or check length to handle this edge case.

5. **Inefficient maximum finding:** Don't sort the entire hash table—that's O(s log s). Instead, track the maximum while iterating for O(s) time.

## When You'll See This Pattern

This problem combines several common patterns:

1. **Frequency Counting with Hash Tables:** Like "Top K Frequent Elements" (#347), but with custom counting logic (words per sender instead of element frequency).

2. **String Processing with Splitting:** Similar to "Reverse Words in a String" (#151) where you need to split and process words.

3. **Maximum Finding with Custom Comparison:** Like "Top K Frequent Words" (#692) where you find maximums with tie-breaking rules.

**Related problems:**

- **Top K Frequent Elements (Medium):** Count element frequencies, find top k. Same hash table counting pattern.
- **Top K Frequent Words (Medium):** Count word frequencies with alphabetical tie-breaking. Very similar logic.
- **Most Common Word (Easy):** Count word frequencies while ignoring banned words. Similar word counting pattern.

## Key Takeaways

1. **Hash tables are ideal for grouping and counting:** When you need to accumulate values by key (like words per sender), a hash table provides O(1) lookups and updates.

2. **Process data in a single pass when possible:** Instead of multiple scans, accumulate results as you go. This often turns O(n²) solutions into O(n).

3. **Pay attention to comparison logic in maximum finding:** When ties have special rules (lexicographic order, secondary keys), implement the comparison carefully during iteration.

4. **String splitting has language-specific nuances:** Know how your language handles empty strings and multiple spaces when splitting.

**Related problems:** [Top K Frequent Elements](/problem/top-k-frequent-elements), [Top K Frequent Words](/problem/top-k-frequent-words)
