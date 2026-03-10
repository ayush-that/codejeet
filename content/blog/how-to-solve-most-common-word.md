---
title: "How to Solve Most Common Word — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Most Common Word. Easy difficulty, 45.0% acceptance rate. Topics: Array, Hash Table, String, Counting."
date: "2027-06-13"
category: "dsa-patterns"
tags: ["most-common-word", "array", "hash-table", "string", "easy"]
---

# How to Solve Most Common Word

This problem asks us to find the most frequent word in a paragraph that isn't in a banned list. While it sounds straightforward, the challenge lies in the text processing details: we need to handle case-insensitivity, punctuation, and efficiently track word frequencies while excluding banned words. The key insight is that this is fundamentally a counting problem where we need to filter out certain items.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
paragraph = "Bob hit a ball, the hit BALL flew far after it was hit."
banned = ["hit"]
```

**Step-by-step process:**

1. **Normalize the paragraph:** Convert to lowercase and split into words, ignoring punctuation
   - "Bob hit a ball, the hit BALL flew far after it was hit." →
   - ["bob", "hit", "a", "ball", "the", "hit", "ball", "flew", "far", "after", "it", "was", "hit"]

2. **Count frequencies while filtering banned words:**
   - Create a frequency map (hash table)
   - Skip "hit" because it's in the banned list
   - Count all other words:
     - bob: 1
     - a: 1
     - ball: 2
     - the: 1
     - flew: 1
     - far: 1
     - after: 1
     - it: 1
     - was: 1

3. **Find the maximum frequency:**
   - Scan through the frequency map
   - "ball" has frequency 2, which is the highest
   - Return "ball"

The tricky part is handling punctuation correctly. Notice how "ball," (with comma) and "BALL" (uppercase) both become "ball" in our normalized form.

## Brute Force Approach

A naive approach might involve:

1. Splitting the paragraph by spaces
2. For each word, manually strip punctuation by checking each character
3. For each cleaned word, check if it's banned by scanning the banned array
4. Count frequencies by scanning previously seen words
5. Finally, scan all counts to find the maximum

This approach has several inefficiencies:

- **O(n × m)** time for banned word checking (where n is number of words, m is banned list size)
- **O(n²)** time for frequency counting if we use nested loops
- Manual punctuation handling is error-prone

The main issue is the repeated linear scans through the banned list and previously seen words. We can optimize this by using hash sets for O(1) lookups and hash maps for O(1) frequency updates.

## Optimal Solution

The optimal solution uses:

1. A **hash set** for banned words for O(1) lookup
2. A **hash map** to count word frequencies
3. **Regular expressions or character filtering** to handle punctuation
4. **One pass** through the words to build frequencies, then another to find the max (or track max during the pass)

Here's the complete implementation:

<div class="code-group">

```python
# Time: O(n + m) where n is length of paragraph, m is length of banned list
# Space: O(n + m) for the hash map and hash set
import re
from collections import defaultdict

def mostCommonWord(paragraph, banned):
    # Step 1: Convert banned list to a set for O(1) lookups
    banned_set = set(banned)

    # Step 2: Normalize the paragraph - convert to lowercase and split by non-word characters
    # \W+ matches one or more non-word characters (punctuation, spaces, etc.)
    words = re.findall(r'\w+', paragraph.lower())

    # Step 3: Count frequencies of non-banned words
    freq_map = defaultdict(int)
    max_freq = 0
    most_common = ""

    for word in words:
        # Skip banned words
        if word in banned_set:
            continue

        # Update frequency
        freq_map[word] += 1

        # Track the maximum frequency word in the same pass
        if freq_map[word] > max_freq:
            max_freq = freq_map[word]
            most_common = word

    return most_common
```

```javascript
// Time: O(n + m) where n is length of paragraph, m is length of banned list
// Space: O(n + m) for the hash map and hash set
function mostCommonWord(paragraph, banned) {
  // Step 1: Convert banned array to a Set for O(1) lookups
  const bannedSet = new Set(banned);

  // Step 2: Normalize the paragraph - convert to lowercase and split by non-word characters
  // \w matches word characters (letters, digits, underscore)
  // + means one or more occurrences
  const words = paragraph.toLowerCase().match(/\w+/g);

  // Step 3: Count frequencies of non-banned words
  const freqMap = new Map();
  let maxFreq = 0;
  let mostCommon = "";

  for (const word of words) {
    // Skip banned words
    if (bannedSet.has(word)) {
      continue;
    }

    // Update frequency
    const count = (freqMap.get(word) || 0) + 1;
    freqMap.set(word, count);

    // Track the maximum frequency word in the same pass
    if (count > maxFreq) {
      maxFreq = count;
      mostCommon = word;
    }
  }

  return mostCommon;
}
```

```java
// Time: O(n + m) where n is length of paragraph, m is length of banned list
// Space: O(n + m) for the hash map and hash set
import java.util.*;

class Solution {
    public String mostCommonWord(String paragraph, String[] banned) {
        // Step 1: Convert banned array to a Set for O(1) lookups
        Set<String> bannedSet = new HashSet<>(Arrays.asList(banned));

        // Step 2: Normalize the paragraph - convert to lowercase and replace non-letter characters with spaces
        String normalizedStr = paragraph.toLowerCase().replaceAll("[^a-z]", " ");

        // Step 3: Split by one or more whitespace characters
        String[] words = normalizedStr.split("\\s+");

        // Step 4: Count frequencies of non-banned words
        Map<String, Integer> freqMap = new HashMap<>();
        int maxFreq = 0;
        String mostCommon = "";

        for (String word : words) {
            // Skip empty strings that might result from splitting
            if (word.isEmpty()) {
                continue;
            }

            // Skip banned words
            if (bannedSet.contains(word)) {
                continue;
            }

            // Update frequency
            int count = freqMap.getOrDefault(word, 0) + 1;
            freqMap.put(word, count);

            // Track the maximum frequency word in the same pass
            if (count > maxFreq) {
                maxFreq = count;
                mostCommon = word;
            }
        }

        return mostCommon;
    }
}
```

</div>

**Key implementation details:**

1. **Banned words as a set:** Converting the banned list to a hash set allows O(1) lookups instead of O(m) linear scans.

2. **Text normalization:** We convert to lowercase first for case-insensitive comparison. The regex `\w+` matches sequences of word characters (letters, digits, underscore), automatically skipping punctuation.

3. **Single pass optimization:** Instead of building the frequency map then finding the max, we track the maximum frequency word as we build the map. This saves a second pass through the map.

4. **Edge case handling:** The Java solution includes a check for empty strings that might result from splitting, which is a common edge case.

## Complexity Analysis

**Time Complexity: O(n + m)**

- **O(n)** to process the paragraph: converting to lowercase, splitting into words, and iterating through words
- **O(m)** to build the banned set from the array
- The single pass through words does O(1) operations per word (set lookup and map update)

**Space Complexity: O(n + m)**

- **O(m)** for the banned words hash set
- **O(n)** for the frequency hash map (in worst case, all words are unique)
- **O(n)** for the list of words (though this could be optimized to O(1) with a streaming approach)

## Common Mistakes

1. **Forgetting case-insensitivity:** Not converting to lowercase before comparison. Words like "Ball" and "ball" should be treated as the same word.

2. **Incorrect punctuation handling:** Simply splitting by spaces without removing punctuation. For example, "ball," and "ball" would be treated as different words. Always use regex or manual punctuation stripping.

3. **Using array.includes() for banned checks:** In JavaScript, using `banned.includes(word)` inside the loop gives O(n × m) time instead of O(n + m). Always convert to a Set first.

4. **Missing edge cases:**
   - Paragraphs with multiple punctuation marks in a row
   - Empty words from splitting (common in Java's `split()`)
   - Words that consist only of punctuation (should be ignored)

5. **Two-pass when one-pass suffices:** Some candidates build the entire frequency map first, then scan it to find the max. You can track the max during the initial pass.

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Frequency counting with hash maps:** Used in problems like:
   - **Top K Frequent Elements** (LeetCode 347) - similar counting but with heap for top K
   - **First Unique Character in a String** (LeetCode 387) - count frequencies then find first with count 1

2. **Text processing with regex/splitting:** Used in:
   - **Reverse Words in a String** (LeetCode 151) - similar splitting and processing
   - **Valid Palindrome** (LeetCode 125) - similar normalization (lowercase, remove non-alphanumeric)

3. **Filtering with hash sets:** Used in:
   - **Two Sum** (LeetCode 1) - using hash set/map for O(1) lookups
   - **Contains Duplicate** (LeetCode 217) - checking existence in a set

The core pattern is: when you need to count things while excluding certain items, use a hash set for exclusion and a hash map for counting.

## Key Takeaways

1. **Hash sets transform O(n) lookups into O(1):** Whenever you need to check if an item is in a collection repeatedly, convert the collection to a hash set first.

2. **Text normalization is crucial for string comparison problems:** Always consider case sensitivity, punctuation, and whitespace. Lowercasing and regex are your friends.

3. **You can often combine passes:** Instead of counting then finding max, track the maximum during counting. This optimization applies to many "find the max/min while counting" problems.

4. **Regular expressions simplify text processing:** Learn basic regex patterns like `\w` (word characters), `\d` (digits), and `\s` (whitespace) for interview problems.

[Practice this problem on CodeJeet](/problem/most-common-word)
