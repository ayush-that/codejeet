---
title: "How to Solve Find the Most Common Response — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find the Most Common Response. Medium difficulty, 75.0% acceptance rate. Topics: Array, Hash Table, String, Counting."
date: "2029-01-13"
category: "dsa-patterns"
tags: ["find-the-most-common-response", "array", "hash-table", "string", "medium"]
---

## How to Solve "Find the Most Common Response"

This problem asks us to find the most frequently occurring response across multiple days of survey data, but with a twist: we must first remove duplicate responses _within each day_ before counting frequencies across days. The challenge lies in correctly handling the two-level deduplication and counting, while also managing tie-breakers lexicographically. What makes this interesting is that it combines set operations for deduplication with frequency counting and sorting logic—a common pattern in data processing tasks.

## Visual Walkthrough

Let's trace through a concrete example:

**Input:**

```
responses = [
    ["yes", "no", "yes"],      # Day 1
    ["no", "no", "maybe"],     # Day 2
    ["yes", "maybe", "yes"]    # Day 3
]
```

**Step 1: Remove duplicates within each day**

- Day 1: `["yes", "no", "yes"]` → unique responses: `{"yes", "no"}`
- Day 2: `["no", "no", "maybe"]` → unique responses: `{"no", "maybe"}`
- Day 3: `["yes", "maybe", "yes"]` → unique responses: `{"yes", "maybe"}`

**Step 2: Count occurrences across all days**

- "yes": appears in Day 1 and Day 3 → count = 2
- "no": appears in Day 1 and Day 2 → count = 2
- "maybe": appears in Day 2 and Day 3 → count = 2

**Step 3: Handle tie-breaking**
All three responses have count = 2. We need the lexicographically smallest: comparing "maybe", "no", and "yes", "maybe" comes first alphabetically.

**Result:** `"maybe"`

This walkthrough reveals the core tasks: deduplication per day, global counting, and tie-breaking logic.

## Brute Force Approach

A naive approach might try to process everything in one pass without proper deduplication:

1. Flatten all responses into a single list
2. Count frequencies of each string
3. Return the string with highest frequency (with tie-breaking)

**Why this fails:** It doesn't remove duplicates within each day first! In our example, this would incorrectly count "yes" 4 times (twice in Day 1, twice in Day 3) instead of 2 times. The problem specifically states we must remove duplicates _within each day_ before counting across days.

Even if we implement the correct logic, a suboptimal approach might use nested loops: for each day, check each response against previous responses in that day to deduplicate, then count globally. This could work but would be O(n\*m²) where n is days and m is responses per day—inefficient for large inputs.

## Optimized Approach

The key insight is that we need **two-level processing**:

1. **Per-day deduplication**: Use a set to remove duplicates within each day efficiently
2. **Global counting**: Use a hash map to count how many days each unique response appears

**Why sets work well for deduplication:**

- Sets automatically remove duplicates in O(1) average time per insertion
- Converting each day's array to a set gives us unique responses for that day

**Why hash maps work well for counting:**

- We can increment counts for each unique response from each day's set
- This gives us O(1) average time per count update

**Tie-breaking strategy:**

- Track both the maximum count and the corresponding response
- When we find a response with the same count as current maximum, compare lexicographically and keep the smaller one

This approach gives us O(total_responses) time complexity, which is optimal since we need to examine each response at least once.

## Optimal Solution

<div class="code-group">

```python
# Time: O(N) where N is total number of responses across all days
# Space: O(U) where U is number of unique responses across all days
def mostCommonResponse(responses):
    """
    Find the most common response after removing duplicates within each day.

    Steps:
    1. For each day, get unique responses using a set
    2. Count how many days each unique response appears
    3. Track the response with highest count, breaking ties lexicographically
    """
    count_map = {}  # Hash map to store response -> count of days it appears

    # Process each day's responses
    for day_responses in responses:
        # Step 1: Get unique responses for this day using set
        unique_in_day = set(day_responses)

        # Step 2: Update global counts for each unique response in this day
        for response in unique_in_day:
            count_map[response] = count_map.get(response, 0) + 1

    # Step 3: Find response with highest count, handling ties
    max_count = 0
    most_common = ""

    for response, count in count_map.items():
        if count > max_count:
            # New maximum found
            max_count = count
            most_common = response
        elif count == max_count and response < most_common:
            # Tie: keep lexicographically smaller response
            most_common = response

    return most_common
```

```javascript
// Time: O(N) where N is total number of responses across all days
// Space: O(U) where U is number of unique responses across all days
function mostCommonResponse(responses) {
  /**
   * Find the most common response after removing duplicates within each day.
   *
   * Steps:
   * 1. For each day, get unique responses using a Set
   * 2. Count how many days each unique response appears
   * 3. Track the response with highest count, breaking ties lexicographically
   */
  const countMap = new Map(); // Map to store response -> count of days it appears

  // Process each day's responses
  for (const dayResponses of responses) {
    // Step 1: Get unique responses for this day using Set
    const uniqueInDay = new Set(dayResponses);

    // Step 2: Update global counts for each unique response in this day
    for (const response of uniqueInDay) {
      countMap.set(response, (countMap.get(response) || 0) + 1);
    }
  }

  // Step 3: Find response with highest count, handling ties
  let maxCount = 0;
  let mostCommon = "";

  for (const [response, count] of countMap) {
    if (count > maxCount) {
      // New maximum found
      maxCount = count;
      mostCommon = response;
    } else if (count === maxCount && response < mostCommon) {
      // Tie: keep lexicographically smaller response
      mostCommon = response;
    }
  }

  return mostCommon;
}
```

```java
// Time: O(N) where N is total number of responses across all days
// Space: O(U) where U is number of unique responses across all days
import java.util.*;

public class Solution {
    public String mostCommonResponse(String[][] responses) {
        /**
         * Find the most common response after removing duplicates within each day.
         *
         * Steps:
         * 1. For each day, get unique responses using a HashSet
         * 2. Count how many days each unique response appears
         * 3. Track the response with highest count, breaking ties lexicographically
         */
        Map<String, Integer> countMap = new HashMap<>();

        // Process each day's responses
        for (String[] dayResponses : responses) {
            // Step 1: Get unique responses for this day using HashSet
            Set<String> uniqueInDay = new HashSet<>(Arrays.asList(dayResponses));

            // Step 2: Update global counts for each unique response in this day
            for (String response : uniqueInDay) {
                countMap.put(response, countMap.getOrDefault(response, 0) + 1);
            }
        }

        // Step 3: Find response with highest count, handling ties
        int maxCount = 0;
        String mostCommon = "";

        for (Map.Entry<String, Integer> entry : countMap.entrySet()) {
            String response = entry.getKey();
            int count = entry.getValue();

            if (count > maxCount) {
                // New maximum found
                maxCount = count;
                mostCommon = response;
            } else if (count == maxCount && response.compareTo(mostCommon) < 0) {
                // Tie: keep lexicographically smaller response
                mostCommon = response;
            }
        }

        return mostCommon;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(N)**

- We process each response exactly once when converting each day's array to a set: O(N) where N is total responses
- We then process each unique response per day when updating counts: O(U) where U is unique responses across days
- In worst case, all responses are unique, so U = N, giving us O(N)
- Finding the maximum from the count map takes O(U) = O(N)

**Space Complexity: O(U)**

- We store each unique response in the count map: O(U)
- For each day, we create a set of unique responses for that day, but this is temporary and doesn't accumulate across days
- In worst case, all responses are unique, so U = N, giving us O(N)

## Common Mistakes

1. **Forgetting to deduplicate within each day first**: This is the most common error. Candidates might count all occurrences across all days without removing duplicates per day. Always read the problem statement carefully—"after removing duplicate responses within each responses[i]" is crucial.

2. **Incorrect tie-breaking logic**: When two responses have the same count, we need the lexicographically smallest. Common errors include:
   - Returning the first one encountered (which depends on iteration order)
   - Using `>` instead of `<` when comparing strings
   - Not handling the initial case when `mostCommon` is empty

3. **Inefficient deduplication**: Using nested loops to check for duplicates within each day gives O(m²) per day instead of O(m) with a set. Remember that sets provide O(1) average insertion and lookup.

4. **Edge case handling**: What if all responses are empty? What if there's only one day? Good solutions should handle:
   - Empty input (though constraints likely prevent this)
   - Single day with all duplicates (should return that response)
   - All responses having count 1 (return lexicographically smallest)

## When You'll See This Pattern

This problem combines several fundamental patterns:

1. **Frequency counting with hash maps**: Like [Majority Element](https://leetcode.com/problems/majority-element/), but with tie-breaking logic added.

2. **Two-level data processing**: Similar to [Word Pattern II](https://leetcode.com/problems/word-pattern-ii/) where you need to match patterns at different levels, or [Group Anagrams](https://leetcode.com/problems/group-anagrams/) where you process each string then group them.

3. **Set operations for deduplication**: Appears in problems like [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays/) where you need unique common elements.

The core technique—using a set for deduplication followed by a map for counting—is widely applicable to data cleaning and aggregation tasks common in real-world data processing.

## Key Takeaways

1. **Read carefully for processing order**: Many problems require specific ordering of operations (like deduplicate then count vs. count then deduplicate). Underline key phrases in the problem statement.

2. **Sets are your friend for deduplication**: Whenever you need to remove duplicates from a collection, consider converting to a set. The O(1) average operations are much faster than manual duplicate checking.

3. **Tie-breaking requires careful comparison logic**: When multiple items could be "winners," implement comparison logic that handles all cases: new winner, tie with different ordering, and initial state.

4. **Two-level problems often need two data structures**: Here we used sets (per-day) and maps (global). Recognizing when you need different structures for different scopes is key to solving complex counting problems.

Related problems: [Majority Element](/problem/majority-element)
