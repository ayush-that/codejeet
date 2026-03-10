---
title: "Medium Visa Interview Questions: Strategy Guide"
description: "How to tackle 72 medium difficulty questions from Visa — patterns, time targets, and practice tips."
date: "2032-04-17"
category: "tips"
tags: ["visa", "medium", "interview prep"]
---

## Medium Visa Interview Questions: Strategy Guide

Visa’s coding interview questions are heavily weighted toward the Medium difficulty level—72 out of 124 total problems. This isn’t an accident. Medium questions are the company’s sweet spot for assessing whether you can handle the kind of real-world engineering problems their teams face daily. Unlike Easy questions, which often test basic syntax and single-step logic, Medium problems at Visa typically require you to combine 2-3 fundamental concepts, manage more complex state, and make non-obvious optimizations under time pressure. The jump isn’t about raw difficulty; it’s about **orchestration**. You’re no longer just writing a function—you’re designing a small system.

## Common Patterns and Templates

Visa’s Medium problems frequently test **array/string manipulation, hash maps for frequency/counting, and sliding window or two-pointer techniques**. A very common pattern is the “categorize-then-process” approach: you first transform or group the input data (often with a hash map or sort), then apply a greedy or iterative algorithm to find the solution.

Here’s a template for one of the most recurrent patterns: **Sliding Window with a Hash Map for tracking characters or frequencies**. This pattern solves problems like finding the longest substring with at most K distinct characters, or the smallest subarray with a sum target.

<div class="code-group">

```python
# Template: Sliding Window with HashMap for Frequency
# Time: O(n) | Space: O(k) where k is number of distinct keys in map
def sliding_window_template(s, k):
    char_count = {}
    left = 0
    max_len = 0

    for right in range(len(s)):
        # 1. Expand window: add right char to map
        right_char = s[right]
        char_count[right_char] = char_count.get(right_char, 0) + 1

        # 2. Shrink window if condition violated (e.g., more than k distinct chars)
        while len(char_count) > k:
            left_char = s[left]
            char_count[left_char] -= 1
            if char_count[left_char] == 0:
                del char_count[left_char]
            left += 1

        # 3. Update answer (e.g., max window length)
        max_len = max(max_len, right - left + 1)

    return max_len
```

```javascript
// Template: Sliding Window with HashMap for Frequency
// Time: O(n) | Space: O(k) where k is number of distinct keys in map
function slidingWindowTemplate(s, k) {
  const charCount = new Map();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // 1. Expand window: add right char to map
    const rightChar = s[right];
    charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);

    // 2. Shrink window if condition violated
    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar) - 1);
      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }
      left++;
    }

    // 3. Update answer
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}
```

```java
// Template: Sliding Window with HashMap for Frequency
// Time: O(n) | Space: O(k) where k is number of distinct keys in map
public int slidingWindowTemplate(String s, int k) {
    Map<Character, Integer> charCount = new HashMap<>();
    int left = 0;
    int maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        // 1. Expand window: add right char to map
        char rightChar = s.charAt(right);
        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);

        // 2. Shrink window if condition violated
        while (charCount.size() > k) {
            char leftChar = s.charAt(left);
            charCount.put(leftChar, charCount.get(leftChar) - 1);
            if (charCount.get(leftChar) == 0) {
                charCount.remove(leftChar);
            }
            left++;
        }

        // 3. Update answer
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a Medium problem at Visa, you should aim to reach a working, reasonably optimized solution within **20-25 minutes**. This includes understanding the problem, discussing your approach, writing code, and walking through test cases. The interviewer isn’t just watching for a correct answer; they’re evaluating your **problem-solving process**. Key signals they look for:

1. **Clarity in trade-off discussions**: Can you explain why you chose a hash map over an array for lookups, or why O(n log n) sorting is acceptable?
2. **Edge case identification**: Do you immediately consider empty input, single element, duplicate values, or integer overflow?
3. **Code readability**: Use meaningful variable names, avoid overly clever one-liners that sacrifice clarity, and include brief inline comments for complex logic.
4. **Progressive optimization**: Start with a brute force solution if stuck, then refine. Saying “A naive approach would be O(n²), but we can improve to O(n) with a sliding window” shows structured thinking.

## Key Differences from Easy Problems

The leap from Easy to Medium at Visa introduces three critical skill requirements:

1. **State management**: Easy problems often have a single loop or condition. Medium problems require you to maintain multiple pieces of state simultaneously—like a hash map tracking frequencies _and_ a sliding window boundary _and_ a running result. Keeping this state consistent is the core challenge.
2. **Algorithm composition**: You’ll frequently need to combine a sort (O(n log n)) with a linear pass (O(n)), or use a hash map to preprocess data before applying a greedy algorithm. The solution is no longer a single step.
3. **Optimization awareness**: For Easy problems, the straightforward solution is usually optimal. For Medium, the first solution you think of often has a glaring inefficiency (like O(n²) time or O(n) space where O(1) is possible). You must learn to spot these and refine.

## Specific Patterns for Medium

Beyond the sliding window template above, watch for these patterns in Visa’s Medium problems:

**Pattern 1: Two-Pointer with Sorted Input**
When the input array is sorted (or can be sorted), two-pointer techniques often yield O(n) solutions for problems that seem O(n²). Classic example: finding a pair with a target sum in a sorted array.

**Pattern 2: Hash Map for Prefix Calculations**
For problems involving subarray sums or contiguous sequences, maintain a running sum and use a hash map to store previous sums (or remainders). This turns O(n²) brute force into O(n). Example: finding a subarray with sum divisible by K.

## Practice Strategy

Don’t just solve problems randomly. Here’s a targeted 3-week plan:

1. **Week 1: Pattern Recognition**  
   Group problems by pattern (sliding window, two-pointer, hash map, etc.). Solve 2-3 of each type daily. Focus on Visa’s tagged Medium problems first.

2. **Week 2: Timed Simulations**  
   Set a 25-minute timer for each problem. Practice explaining your approach out loud as you code. After solving, analyze: Where did you hesitate? Which edge cases did you miss?

3. **Week 3: Mixed Review**  
   Shuffle problems from different patterns. This mimics the interview where you won’t know the category upfront. Aim for 4-5 problems daily, mixing new attempts with revisiting previously solved ones.

Always track your time and accuracy. If you consistently solve a pattern type in under 15 minutes, deprioritize it. Focus on patterns where you struggle or exceed 25 minutes.

[Practice Medium Visa questions](/company/visa/medium)
