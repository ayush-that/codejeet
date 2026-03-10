---
title: "How to Solve Uncommon Words from Two Sentences — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Uncommon Words from Two Sentences. Easy difficulty, 75.6% acceptance rate. Topics: Hash Table, String, Counting."
date: "2027-10-30"
category: "dsa-patterns"
tags: ["uncommon-words-from-two-sentences", "hash-table", "string", "counting", "easy"]
---

# How to Solve Uncommon Words from Two Sentences

This problem asks us to find words that appear exactly once across two sentences and don't appear in the other sentence. While the problem seems straightforward, the subtlety lies in properly understanding what "uncommon" means: a word must appear exactly once in total across both sentences, not just once in each sentence separately. This distinction trips up many candidates who don't carefully read the problem statement.

## Visual Walkthrough

Let's trace through an example to build intuition:

**Input:**

```
s1 = "this apple is sweet"
s2 = "this apple is sour"
```

**Step 1: Split both sentences into words**

- s1 words: ["this", "apple", "is", "sweet"]
- s2 words: ["this", "apple", "is", "sour"]

**Step 2: Count occurrences of each word across both sentences**

- "this": appears in both sentences → count = 2
- "apple": appears in both sentences → count = 2
- "is": appears in both sentences → count = 2
- "sweet": appears only in s1 → count = 1
- "sour": appears only in s2 → count = 1

**Step 3: Identify uncommon words**
Uncommon words are those with total count = 1:

- "sweet" (count = 1, only in s1)
- "sour" (count = 1, only in s2)

**Output:** ["sweet", "sour"]

Notice that words like "this", "apple", and "is" appear in both sentences, so they have count = 2 and are NOT uncommon. The key insight is that we need to count occurrences across the combined word list, not separately for each sentence.

## Brute Force Approach

A naive approach would be to:

1. Get all words from both sentences
2. For each word, check if it appears exactly once in its own sentence and zero times in the other sentence
3. Collect all such words

This approach requires nested loops: for each word in the combined list, we scan both sentences to count occurrences. This gives us O(n²) time complexity where n is the total number of words, which is inefficient for large inputs.

The brute force fails because:

- It repeatedly scans the same sentences for each word
- String comparisons are expensive when done repeatedly
- It doesn't leverage the fact that we just need frequency counts

## Optimal Solution

The optimal solution uses a hash map (dictionary) to count word frequencies across both sentences. Here's the step-by-step reasoning:

1. **Combine and split**: Concatenate both sentences (with a space separator) and split into words
2. **Count frequencies**: Use a hash map to count how many times each word appears
3. **Filter uncommon words**: Return only words with frequency = 1

This works because:

- Words that appear in both sentences will have count ≥ 2
- Words that appear exactly once in one sentence and not in the other will have count = 1
- The hash map gives us O(1) lookups and updates

<div class="code-group">

```python
# Time: O(n + m) where n and m are lengths of s1 and s2
# Space: O(n + m) for storing word frequencies
def uncommonFromSentences(s1: str, s2: str) -> List[str]:
    # Step 1: Combine both sentences into one string
    # We add a space between them to ensure proper splitting
    combined = s1 + " " + s2

    # Step 2: Split into individual words
    words = combined.split()

    # Step 3: Count frequency of each word using a dictionary
    freq = {}
    for word in words:
        # Increment count if word exists, otherwise set to 1
        freq[word] = freq.get(word, 0) + 1

    # Step 4: Collect words that appear exactly once
    result = []
    for word, count in freq.items():
        if count == 1:
            result.append(word)

    return result
```

```javascript
// Time: O(n + m) where n and m are lengths of s1 and s2
// Space: O(n + m) for storing word frequencies
function uncommonFromSentences(s1, s2) {
  // Step 1: Combine both sentences into one string
  // We trim to handle edge case where one sentence might be empty
  const combined = (s1 + " " + s2).trim();

  // Step 2: Split into individual words
  // If combined is empty string, split returns [""], so we handle that
  const words = combined === "" ? [] : combined.split(" ");

  // Step 3: Count frequency of each word using a Map
  const freq = new Map();
  for (const word of words) {
    // Increment count if word exists, otherwise set to 1
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  // Step 4: Collect words that appear exactly once
  const result = [];
  for (const [word, count] of freq) {
    if (count === 1) {
      result.push(word);
    }
  }

  return result;
}
```

```java
// Time: O(n + m) where n and m are lengths of s1 and s2
// Space: O(n + m) for storing word frequencies
public String[] uncommonFromSentences(String s1, String s2) {
    // Step 1: Combine both sentences into one string
    String combined = s1 + " " + s2;

    // Step 2: Split into individual words
    // Using regex "\\s+" handles multiple spaces if they exist
    String[] words = combined.split("\\s+");

    // Step 3: Count frequency of each word using a HashMap
    Map<String, Integer> freq = new HashMap<>();
    for (String word : words) {
        // Increment count if word exists, otherwise set to 1
        freq.put(word, freq.getOrDefault(word, 0) + 1);
    }

    // Step 4: Collect words that appear exactly once
    List<String> resultList = new ArrayList<>();
    for (Map.Entry<String, Integer> entry : freq.entrySet()) {
        if (entry.getValue() == 1) {
            resultList.add(entry.getKey());
        }
    }

    // Convert List to array for return type
    return resultList.toArray(new String[0]);
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n + m)**

- Splitting the strings takes O(n + m) where n and m are the lengths of s1 and s2
- Building the frequency map requires one pass through all words: O(k) where k is the number of words
- Filtering for uncommon words requires one pass through the map: O(k)
- Overall: O(n + m + k) = O(n + m) since k ≤ n + m

**Space Complexity: O(n + m)**

- The words array stores all words: O(k) space
- The frequency map stores each unique word with its count: O(u) where u is the number of unique words
- In worst case, all words are unique, so u = k
- Overall: O(n + m) space

## Common Mistakes

1. **Misunderstanding the definition of "uncommon"**: Some candidates think a word is uncommon if it appears exactly once in EACH sentence separately. Actually, it must appear exactly once TOTAL across both sentences. Always re-read the problem statement carefully.

2. **Not handling empty sentences properly**: If one sentence is empty, you need to handle the splitting correctly. In JavaScript, `"".split(" ")` returns `[""]`, not an empty array. Always test edge cases.

3. **Forgetting to trim combined string**: When combining sentences with `s1 + " " + s2`, if s1 is empty, you get `" sentence2"` with a leading space. This creates an empty first word when split. The Java solution handles this with `split("\\s+")`, but other languages need similar care.

4. **Using separate maps for each sentence**: Some candidates create two frequency maps (one for each sentence) and then do complex comparisons. The simpler approach is to combine first, then count. KISS principle applies.

## When You'll See This Pattern

This frequency counting pattern appears in many string and array problems:

1. **Two Sum** (Easy): While Two Sum uses a hash map to store complements, the core idea of using a hash structure for O(1) lookups is similar.

2. **First Unique Character in a String** (Easy): Count character frequencies, then find the first with count = 1. Exactly the same pattern but with characters instead of words.

3. **Intersection of Two Arrays** (Easy): Use hash maps/sets to track which elements appear in both arrays. The frequency counting technique is fundamental to many "find common/uncommon elements" problems.

The pattern is: when you need to track occurrences or check membership efficiently, reach for a hash map/set.

## Key Takeaways

1. **Frequency counting with hash maps** is a fundamental technique for problems involving counting occurrences. The pattern is: iterate through items, update counts in a hash map, then process based on frequencies.

2. **Read problem statements carefully**, especially definitions. The subtle difference between "exactly once in each" vs "exactly once total" changes the entire solution approach.

3. **Combine before processing** when dealing with multiple inputs that need unified treatment. Instead of handling s1 and s2 separately, combining them first often simplifies the logic.

Related problems: [Count Common Words With One Occurrence](/problem/count-common-words-with-one-occurrence)
