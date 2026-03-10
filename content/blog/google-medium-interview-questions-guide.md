---
title: "Medium Google Interview Questions: Strategy Guide"
description: "How to tackle 1153 medium difficulty questions from Google — patterns, time targets, and practice tips."
date: "2031-12-07"
category: "tips"
tags: ["google", "medium", "interview prep"]
---

# Medium Google Interview Questions: Strategy Guide

Google has 1,153 Medium questions out of 2,217 total — that's over half their problem set. This isn't an accident. Medium difficulty represents the sweet spot where interviewers can assess both your fundamental algorithmic knowledge and your problem-solving process under realistic constraints. While Easy questions test basic syntax and simple patterns, and Hard questions often require specialized optimization, Medium questions at Google specifically test your ability to recognize patterns, implement clean solutions, and communicate trade-offs.

What separates Medium problems at Google from other companies is their emphasis on **practical algorithms with real-world applications**. You won't find purely academic puzzles here. Instead, you'll encounter problems that mirror actual Google engineering challenges: processing streams of data, optimizing search operations, managing system resources, or designing efficient data structures for specific use cases.

## Common Patterns and Templates

Google's Medium problems heavily favor certain patterns that appear repeatedly across different domains. The most common by far is the **modified binary search** pattern. Unlike textbook binary search that finds exact matches, Google problems often require finding boundaries, ranges, or applying binary search to transformed data. Here's the template you need to internalize:

<div class="code-group">

```python
def binary_search_template(nums, target):
    """
    Generalized binary search for finding insertion position,
    first/last occurrence, or boundary conditions.
    """
    left, right = 0, len(nums)  # Note: right is exclusive bound

    while left < right:
        mid = left + (right - left) // 2

        # This condition varies by problem
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid

    return left  # Could be left or left-1 depending on problem

# Time: O(log n) | Space: O(1)
```

```javascript
function binarySearchTemplate(nums, target) {
  // Generalized binary search for Google-style problems
  let left = 0;
  let right = nums.length; // Exclusive bound

  while (left < right) {
    const mid = Math.floor(left + (right - left) / 2);

    // This condition varies by problem
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left; // Could be left or left-1 depending on problem
}

// Time: O(log n) | Space: O(1)
```

```java
public int binarySearchTemplate(int[] nums, int target) {
    // Generalized binary search for Google-style problems
    int left = 0;
    int right = nums.length; // Exclusive bound

    while (left < right) {
        int mid = left + (right - left) / 2;

        // This condition varies by problem
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left; // Could be left or left-1 depending on problem
}

// Time: O(log n) | Space: O(1)
```

</div>

This template appears in problems like **Find First and Last Position of Element in Sorted Array (#34)** and **Search in Rotated Sorted Array (#33)**. The key insight is using exclusive bounds and the `while (left < right)` loop, which avoids infinite loops and handles edge cases cleanly.

## Time Benchmarks and What Interviewers Look For

For a 45-minute Google interview with a Medium problem, here's the timeline you should aim for:

- **0-5 minutes**: Understand the problem, ask clarifying questions, discuss edge cases
- **5-15 minutes**: Develop approach, discuss trade-offs, get interviewer buy-in
- **15-30 minutes**: Write clean, working code
- **30-35 minutes**: Test with examples, including edge cases
- **35-45 minutes**: Discuss optimizations, time/space complexity, and potential follow-ups

Beyond correctness, Google interviewers watch for specific signals:

1. **Communication of trade-offs**: Can you explain why you chose approach A over B?
2. **Edge case identification**: Do you think about empty inputs, duplicates, overflow, or negative numbers?
3. **Code readability**: Is your code self-documenting with meaningful variable names?
4. **Testing methodology**: Do you walk through examples systematically?

The biggest mistake I see candidates make is rushing to code without aligning with the interviewer. Spend those first 5 minutes well — it saves 10 minutes of debugging later.

## Key Differences from Easy Problems

The jump from Easy to Medium at Google requires three specific mindset shifts:

1. **From single-pass to multi-phase thinking**: Easy problems often have linear solutions. Medium problems require you to combine multiple passes or data structures. For example, **Two Sum (#1)** is Easy (one pass with hash map), while **3Sum (#15)** is Medium (requires sorting plus two-pointer technique).

2. **From obvious to non-obvious patterns**: In Easy problems, the pattern is usually stated or immediately obvious. In Medium problems, you need to transform the problem to recognize the pattern. **Product of Array Except Self (#238)** looks like it needs division until you realize the prefix/suffix product pattern.

3. **From implementation to optimization**: Easy problems accept the brute force solution. Medium problems require you to optimize time or space. **Longest Substring Without Repeating Characters (#3)** has an O(n²) brute force, but the O(n) sliding window is expected.

## Specific Patterns for Medium

Beyond binary search, two other patterns dominate Google's Medium problems:

**Sliding Window with Hash Map**: Used for substring problems where you need to track character frequencies. The template involves two pointers and a hash map/dictionary to track window state.

**DFS/BFS on Modified Graphs**: Many Google problems involve traversing grids or implicit graphs. The twist is usually in the state representation or movement rules. **Number of Islands (#200)** is the classic, but variations like **Rotting Oranges (#994)** add time dimensions.

Here's the sliding window pattern that appears in problems like **Longest Substring with At Most K Distinct Characters (#340)**:

<div class="code-group">

```python
def sliding_window_template(s, k):
    char_count = {}
    left = 0
    max_length = 0

    for right in range(len(s)):
        # Add current character to window
        char_count[s[right]] = char_count.get(s[right], 0) + 1

        # Shrink window while condition violated
        while len(char_count) > k:
            char_count[s[left]] -= 1
            if char_count[s[left]] == 0:
                del char_count[s[left]]
            left += 1

        # Update answer
        max_length = max(max_length, right - left + 1)

    return max_length

# Time: O(n) | Space: O(k)
```

```javascript
function slidingWindowTemplate(s, k) {
  const charCount = new Map();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    // Add current character to window
    charCount.set(s[right], (charCount.get(s[right]) || 0) + 1);

    // Shrink window while condition violated
    while (charCount.size > k) {
      charCount.set(s[left], charCount.get(s[left]) - 1);
      if (charCount.get(s[left]) === 0) {
        charCount.delete(s[left]);
      }
      left++;
    }

    // Update answer
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}

// Time: O(n) | Space: O(k)
```

```java
public int slidingWindowTemplate(String s, int k) {
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        // Add current character to window
        char current = s.charAt(right);
        charCount.put(current, charCount.getOrDefault(current, 0) + 1);

        // Shrink window while condition violated
        while (charCount.size() > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) == 0) {
                charCount.remove(leftChar);
            }
            left++;
        }

        // Update answer
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

// Time: O(n) | Space: O(k)
```

</div>

## Practice Strategy

Don't just solve problems randomly. Here's a targeted approach:

1. **Pattern-first learning**: Group problems by pattern, not difficulty. Solve 5-7 binary search problems in a row until the template becomes muscle memory.

2. **Daily targets**: Aim for 2-3 Medium problems daily, but with depth. For each problem:
   - Solve it in 30 minutes (simulated interview)
   - Write clean code with comments
   - Analyze time/space complexity
   - Identify 3-5 test cases including edge cases

3. **Recommended order**:
   - Week 1: Binary search variations
   - Week 2: Sliding window problems
   - Week 3: DFS/BFS on grids
   - Week 4: Dynamic programming (start with 1D, move to 2D)
   - Week 5: Mixed pattern practice under time pressure

4. **The 80/20 rule**: Focus on the patterns above — they cover 80% of Google's Medium problems. Don't get bogged down in obscure graph algorithms or exotic data structures early on.

Remember: Medium problems are where Google separates competent programmers from exceptional problem-solvers. It's not about knowing every algorithm — it's about applying fundamental patterns creatively to new situations.

[Practice Medium Google questions](/company/google/medium)
