---
title: "Medium PhonePe Interview Questions: Strategy Guide"
description: "How to tackle 63 medium difficulty questions from PhonePe — patterns, time targets, and practice tips."
date: "2032-05-11"
category: "tips"
tags: ["phonepe", "medium", "interview prep"]
---

PhonePe’s interview coding questions are known for being practical and leaning heavily on real-world data structures. Of their 102 tagged problems, 63 are rated Medium. This isn’t just a random distribution—it’s a signal. PhonePe uses Medium problems as the primary filter to assess if you can move beyond textbook examples and handle the nuanced logic required for building scalable financial systems. The key separator at this difficulty isn’t esoteric algorithms, but the ability to cleanly manage multiple logical constraints and state changes within common data structures like arrays, strings, hash maps, and trees. You’re not being asked to invent a novel algorithm; you’re being tested on implementing a known pattern with precision while handling the friction of additional rules or optimization requirements.

## Common Patterns and Templates

PhonePe’s Medium problems heavily favor a few core patterns that mirror backend transaction logic: **Sliding Window** for contiguous data analysis (e.g., fraud detection in transaction streams), **Hash Map / Set for frequency and state tracking** (e.g., managing user session idempotency), and **Tree / Graph Traversal with modifications** (e.g., hierarchical data processing). The most frequent pattern you’ll encounter is the **"Sliding Window with a Hash Map Counter."** This template solves a whole class of problems where you need to find a subarray or substring subject to a constraint based on character or element counts.

<div class="code-group">

```python
def sliding_window_template(s, k):
    """
    Template: Find the longest substring with at most k distinct characters.
    Problem variant: PhonePe Medium problems often add constraints like
    'at most k replacements' or 'longest subarray with sum <= target'.
    """
    char_count = {}
    left = 0
    max_length = 0

    for right in range(len(s)):
        # 1. Expand window: add right char to counter
        right_char = s[right]
        char_count[right_char] = char_count.get(right_char, 0) + 1

        # 2. Shrink window while constraint is violated
        # Constraint: more than k distinct chars
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # 3. Update answer after ensuring window is valid
        max_length = max(max_length, right - left + 1)

    return max_length

# Time: O(n) - Each character processed at most twice (by right and left)
# Space: O(k) - Hash map stores at most k+1 distinct characters
```

```javascript
function slidingWindowTemplate(s, k) {
  // Template: Find longest substring with at most k distinct characters
  const charCount = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    // 1. Expand window
    const rightChar = s[right];
    charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);

    // 2. Shrink while constraint violated
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++;
    }

    // 3. Update answer
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
// Time: O(n) | Space: O(k)
```

```java
public int slidingWindowTemplate(String s, int k) {
    // Template: Find longest substring with at most k distinct characters
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        // 1. Expand window
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);

        // 2. Shrink while constraint violated
        while (charCount.size() > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) == 0) {
                charCount.remove(leftChar);
            }
            left++;
        }

        // 3. Update answer
        maxLength = Math.max(maxLength, right - left + 1);
    }
    return maxLength;
}
// Time: O(n) | Space: O(k)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a PhonePe Medium problem, you should aim to have a working, optimal solution within 25-30 minutes. This includes 5-7 minutes for clarifying questions and edge cases, 15-18 minutes for coding, and 3-5 minutes for testing with examples. The interviewer isn’t just a correctness checker; they’re evaluating your **engineering judgment**. Key signals they watch for:

1.  **Constraint-first thinking:** Do you immediately ask about input size and constraints? Mentioning that an O(n²) solution is unacceptable for n=10⁵ shows foresight.
2.  **Clean state management:** In problems involving transactions or sequences, how you name your variables (`currentBalance`, `pendingTransactionIds`) matters. Avoid single-letter names except for simple loop indices.
3.  **Proactive edge case handling:** Don’t wait for the interviewer to ask. Verbally flag and handle cases like empty input, all identical elements, single-element arrays, or integer overflow (rare in Python/JS, but critical in Java).
4.  **Communication of trade-offs:** If you implement a solution with O(n) space, briefly note that it could be done in O(1) space with a more complex two-pass approach, but you’re prioritizing readability.

## Key Differences from Easy Problems

The jump from Easy to Medium at PhonePe is defined by two skill shifts:

1.  **Managing two simultaneous constraints:** Easy problems often have one primary condition (e.g., "find the missing number"). Medium problems layer conditions (e.g., "find the longest subarray with sum ≤ S and length ≥ L"). This requires you to track multiple variables in your loop or use auxiliary data structures.
2.  **Knowing when to pre-process:** Easy solutions are usually one-pass. Medium solutions often require a pre-processing step—like building a frequency hash map or a prefix sum array—to transform the problem into something simpler. Recognizing this need is 80% of the battle.

The mindset shift is from **"find the obvious operation"** to **"what transformation reduces this to a known pattern?"** For example, many "subarray sum" problems become "find two points in a prefix sum array" after pre-processing.

## Specific Patterns for Medium

Beyond the sliding window template, watch for these two patterns:

**1. Tree Path Problems with Global State**
Problems like "Binary Tree Maximum Path Sum" (LeetCode #124) appear in variations. The pattern involves a DFS traversal that returns one value (e.g., the maximum path sum _ending_ at the current node) while updating a global variable for the actual answer (the maximum path sum _anywhere_ in the tree).

**2. HashMap for Difference Tracking**
A classic is "Subarray Sum Equals K" (LeetCode #560). The pattern uses a hash map to store the frequency of prefix sums. For a current prefix sum `prefix`, you check if `prefix - k` exists in the map. This transforms an O(n²) nested loop problem into O(n).

<div class="code-group">

```python
def subarraySumEqualsK(nums, k):
    prefix_sum_count = {0: 1}  # base case: empty subarray has sum 0
    current_sum = 0
    count = 0

    for num in nums:
        current_sum += num
        # Check if (current_sum - k) exists
        count += prefix_sum_count.get(current_sum - k, 0)
        # Update map with current prefix sum
        prefix_sum_count[current_sum] = prefix_sum_count.get(current_sum, 0) + 1

    return count
# Time: O(n) | Space: O(n)
```

</div>

## Practice Strategy

Don’t just solve all 63 problems sequentially. Group them by pattern and build muscle memory.

1.  **Week 1-2: Pattern Foundation (15 problems)**
    - Target 2 problems per day.
    - Focus: Sliding Window (5 problems), Hash Map for prefix/difference (5 problems), Tree DFS with state (5 problems).
    - For each problem, implement the solution, then immediately write the template from memory. If you can’t, you haven’t internalized it.

2.  **Week 3: Mixed Practice & Constraints (20 problems)**
    - Target 3 problems per day in random order.
    - Specifically seek out PhonePe problems that add a "twist" to a base pattern (e.g., sliding window with a second constraint on minimum length).
    - Time yourself: 30 minutes max per problem, including writing test cases.

3.  **Week 4: Mock Interviews & Review (Full sessions)**
    - Do 2-3 full mock interviews per week using only PhonePe Medium problems.
    - Record yourself explaining your thought process. Play it back to check for clarity and logical jumps.
    - Re-solve any problem you struggled with more than 48 hours later to test retention.

The goal is to reach a point where you read a new PhonePe Medium problem and can say, "This is a sliding window problem with a hash map counter, and the constraint is on the frequency of the most common character." That pattern recognition is what gets you the offer.

[Practice Medium PhonePe questions](/company/phonepe/medium)
