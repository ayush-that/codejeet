---
title: "Array Questions at Atlassian: What to Expect"
description: "Prepare for Array interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-10"
category: "dsa-patterns"
tags: ["atlassian", "array", "interview prep"]
---

# Array Questions at Atlassian: What to Expect

If you're preparing for an Atlassian interview, you've probably noticed something striking: out of their 62 most frequently asked coding questions, a staggering 40 of them involve arrays. That's nearly 65% of their problem set. This isn't a coincidence or a statistical anomaly—it's a deliberate signal about what Atlassian values in their technical interviews.

Atlassian builds collaboration tools like Jira, Confluence, and Trello that handle massive amounts of structured data. Arrays represent ordered collections, which mirror how these tools organize issues, tasks, and content. When you're working on a Jira board, you're essentially manipulating arrays of tickets with various properties. This practical connection means array problems aren't just abstract algorithm exercises at Atlassian—they're directly relevant to the company's core engineering challenges.

In real interviews, you're almost guaranteed to encounter at least one array problem, often as your first technical question. These problems serve as excellent filters: they test fundamental data structure understanding, problem decomposition skills, and the ability to write clean, efficient code under pressure.

## Specific Patterns Atlassian Favors

Atlassian's array problems tend to cluster around three specific patterns that reflect real-world software engineering at scale:

1. **In-place transformations with multiple pointers** - Atlassian loves problems where you need to manipulate arrays without extra space. This mirrors optimizing memory usage in their high-traffic applications. Look for problems like removing duplicates, moving zeros, or partitioning arrays.

2. **Subarray problems with sliding windows** - Many Atlassian features involve analyzing contiguous data segments (think of analyzing user activity logs or processing batches of issues). The sliding window pattern appears frequently in their interviews.

3. **Array transformations with hash maps** - Atlassian often tests problems that seem to require nested loops but can be optimized with clever data structure choices. This tests whether candidates can identify when to trade space for time.

Here's a concrete example of the sliding window pattern that appears in variations across Atlassian interviews:

<div class="code-group">

```python
# Time: O(n) | Space: O(k) where k is character set size
def length_of_longest_substring(s: str) -> int:
    """
    LeetCode #3: Longest Substring Without Repeating Characters
    Atlassian variation: Find longest contiguous subarray with unique elements
    """
    char_index = {}  # Tracks last seen index of each character
    left = 0
    max_length = 0

    for right in range(len(s)):
        # If character seen before and within current window
        if s[right] in char_index and char_index[s[right]] >= left:
            # Move left pointer past the duplicate
            left = char_index[s[right]] + 1

        # Update character's last seen index
        char_index[s[right]] = right

        # Update maximum length
        max_length = max(max_length, right - left + 1)

    return max_length
```

```javascript
// Time: O(n) | Space: O(k) where k is character set size
function lengthOfLongestSubstring(s) {
  // LeetCode #3: Longest Substring Without Repeating Characters
  // Atlassian variation: Find longest contiguous subarray with unique elements
  const charIndex = new Map(); // Tracks last seen index of each character
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    // If character seen before and within current window
    if (charIndex.has(s[right]) && charIndex.get(s[right]) >= left) {
      // Move left pointer past the duplicate
      left = charIndex.get(s[right]) + 1;
    }

    // Update character's last seen index
    charIndex.set(s[right], right);

    // Update maximum length
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

```java
// Time: O(n) | Space: O(k) where k is character set size
public int lengthOfLongestSubstring(String s) {
    // LeetCode #3: Longest Substring Without Repeating Characters
    // Atlassian variation: Find longest contiguous subarray with unique elements
    Map<Character, Integer> charIndex = new HashMap<>();
    int left = 0;
    int maxLength = 0;

    for (int right = 0; right < s.length(); right++) {
        char currentChar = s.charAt(right);

        // If character seen before and within current window
        if (charIndex.containsKey(currentChar) && charIndex.get(currentChar) >= left) {
            // Move left pointer past the duplicate
            left = charIndex.get(currentChar) + 1;
        }

        // Update character's last seen index
        charIndex.put(currentChar, right);

        // Update maximum length
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}
```

</div>

## How to Prepare

The key to Atlassian array problems is recognizing that they're testing engineering judgment, not just algorithm knowledge. Here's my recommended approach:

1. **Master the three-pointer dance** - Many Atlassian problems involve partitioning arrays or processing from both ends. Practice Dutch National Flag variations and two-sum type problems with sorted arrays.

2. **Think in terms of invariants** - Atlassian interviewers often ask about loop invariants. Be prepared to explain what stays true at each iteration of your solution.

3. **Optimize incrementally** - Start with a brute force solution, then optimize. Atlassian wants to see your thought process, not just your final answer.

Here's another common pattern—the in-place array partition:

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def move_zeroes(nums):
    """
    LeetCode #283: Move Zeroes
    Atlassian loves this pattern for testing in-place operations
    """
    # Pointer for the next non-zero position
    next_non_zero = 0

    # Move all non-zero elements to the front
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[next_non_zero] = nums[i]
            next_non_zero += 1

    # Fill remaining positions with zeroes
    for i in range(next_non_zero, len(nums)):
        nums[i] = 0

    return nums
```

```javascript
// Time: O(n) | Space: O(1)
function moveZeroes(nums) {
  // LeetCode #283: Move Zeroes
  // Atlassian loves this pattern for testing in-place operations
  // Pointer for the next non-zero position
  let nextNonZero = 0;

  // Move all non-zero elements to the front
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[nextNonZero] = nums[i];
      nextNonZero++;
    }
  }

  // Fill remaining positions with zeroes
  for (let i = nextNonZero; i < nums.length; i++) {
    nums[i] = 0;
  }

  return nums;
}
```

```java
// Time: O(n) | Space: O(1)
public void moveZeroes(int[] nums) {
    // LeetCode #283: Move Zeroes
    // Atlassian loves this pattern for testing in-place operations
    // Pointer for the next non-zero position
    int nextNonZero = 0;

    // Move all non-zero elements to the front
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            nums[nextNonZero] = nums[i];
            nextNonZero++;
        }
    }

    // Fill remaining positions with zeroes
    for (int i = nextNonZero; i < nums.length; i++) {
        nums[i] = 0;
    }
}
```

</div>

## How Atlassian Tests Array vs Other Companies

Atlassian's array questions differ from other tech companies in several key ways:

**Compared to Google**: Google's array problems often involve clever mathematical insights or require recognizing non-obvious patterns. Atlassian's problems are more straightforward but test implementation quality more rigorously. While Google might ask "can you find the trick?", Atlassian asks "can you write clean, efficient, maintainable code?"

**Compared to Facebook/Meta**: Meta leans heavily toward graph and tree problems for their product-focused roles. Atlassian, despite building collaboration tools, surprisingly favors arrays over graphs. This suggests they value fundamental data structure mastery over domain-specific algorithms.

**Compared to Amazon**: Amazon's array problems often involve system design elements or trade-off discussions. Atlassian stays closer to pure algorithm implementation but with a focus on code clarity and testability.

What's unique about Atlassian is their emphasis on **code quality under time pressure**. They want to see that you can produce production-ready code in an interview setting. This means proper variable names, clear comments on complex logic, and handling edge cases gracefully.

## Study Order

Here's the optimal sequence for mastering Atlassian's array problems:

1. **Basic array operations** - Start with traversal, insertion, deletion. Understand how arrays work at a fundamental level before tackling complex algorithms.

2. **Two-pointer techniques** - Master opposite-direction and same-direction pointers. These form the foundation for many Atlassian problems.

3. **Sliding window patterns** - Learn fixed-size and variable-size windows. This is crucial for subarray problems.

4. **In-place transformations** - Practice modifying arrays without extra space. Atlassian frequently tests space optimization.

5. **Prefix sum and running calculations** - Learn to precompute running totals to answer range queries efficiently.

6. **Hash map optimizations** - Master using dictionaries/maps to reduce time complexity from O(n²) to O(n).

This order works because each concept builds on the previous one. Two-pointer techniques teach you to think about multiple indices, which prepares you for sliding windows. In-place transformations force you to understand array mutation deeply, which helps with more complex algorithms.

## Recommended Practice Order

Solve these problems in sequence to build up your Atlassian array skills:

1. **Two Sum (#1)** - The classic hash map problem. Master this before anything else.
2. **Best Time to Buy and Sell Stock (#121)** - Simple one-pass solution that teaches you to track minimums.
3. **Move Zeroes (#283)** - Perfect for practicing in-place operations.
4. **Container With Most Water (#11)** - Excellent two-pointer problem that appears in Atlassian interviews.
5. **Longest Substring Without Repeating Characters (#3)** - Master the sliding window pattern.
6. **Product of Array Except Self (#238)** - Tests your ability to think about prefix and suffix calculations.
7. **Merge Intervals (#56)** - Common in real-world data processing scenarios.
8. **Find All Duplicates in an Array (#442)** - Tests clever in-place marking techniques.
9. **Trapping Rain Water (#42)** - Combines two-pointer with running calculations.
10. **Sliding Window Maximum (#239)** - Advanced sliding window with deque.

After completing these, focus on Atlassian's company-specific problems, which often combine these patterns in novel ways.

Remember: Atlassian isn't just testing whether you can solve array problems—they're testing whether you can write the kind of clean, efficient code that would survive code review in their codebase. Every variable name, every comment, and every edge case matters.

[Practice Array at Atlassian](/company/atlassian/array)
