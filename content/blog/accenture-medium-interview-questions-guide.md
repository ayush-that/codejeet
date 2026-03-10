---
title: "Medium Accenture Interview Questions: Strategy Guide"
description: "How to tackle 68 medium difficulty questions from Accenture — patterns, time targets, and practice tips."
date: "2032-03-24"
category: "tips"
tags: ["accenture", "medium", "interview prep"]
---

Medium questions at Accenture represent a critical inflection point in their technical interviews. While Easy problems often test basic syntax and simple logic, and Hard problems might involve advanced algorithms or heavy optimization, the Medium tier is where you prove you can be a productive software engineer. Accenture's 68 Medium questions (nearly half their total) focus on practical, real-world adjacent problems involving data manipulation, business logic implementation, and system simulation. The key separator is complexity: these problems require you to manage multiple steps, handle non-trivial state, and make thoughtful trade-offs between readability and efficiency. You're no longer just writing a function; you're designing a small solution.

## Common Patterns and Templates

Accenture's Medium problems heavily favor **array/string transformation** and **simulation** patterns. You'll rarely see pure algorithmic puzzles like dynamic programming on a grid. Instead, you'll process logs, format reports, validate sequences, or implement a simplified version of a real business rule. The most common pattern is the **multi-pass aggregation with hash map tracking**.

Here’s the core template you'll adapt repeatedly:

<div class="code-group">

```python
def accenture_medium_template(data):
    """
    Common pattern: Process data in stages using auxiliary data structures.
    """
    # First pass: gather counts or positions
    frequency = {}
    for item in data:
        frequency[item] = frequency.get(item, 0) + 1

    # Second pass: apply logic using gathered info
    result = []
    for item in data:
        if some_condition_based_on(frequency, item):
            result.append(transform(item))

    # Sometimes a third pass for formatting
    return format_result(result)

# Time: O(n) for passes | Space: O(n) for auxiliary storage
```

```javascript
function accentureMediumTemplate(data) {
  // First pass: gather counts or positions
  const frequency = {};
  for (const item of data) {
    frequency[item] = (frequency[item] || 0) + 1;
  }

  // Second pass: apply logic using gathered info
  const result = [];
  for (const item of data) {
    if (someConditionBasedOn(frequency, item)) {
      result.push(transform(item));
    }
  }

  // Sometimes a third pass for formatting
  return formatResult(result);
}

// Time: O(n) for passes | Space: O(n) for auxiliary storage
```

```java
import java.util.*;

public List<String> accentureMediumTemplate(List<String> data) {
    // First pass: gather counts
    Map<String, Integer> frequency = new HashMap<>();
    for (String item : data) {
        frequency.put(item, frequency.getOrDefault(item, 0) + 1);
    }

    // Second pass: apply logic
    List<String> result = new ArrayList<>();
    for (String item : data) {
        if (someConditionBasedOn(frequency, item)) {
            result.add(transform(item));
        }
    }

    // Format if needed
    return formatResult(result);
}

// Time: O(n) for passes | Space: O(n) for auxiliary storage
```

</div>

## Time Benchmarks and What Interviewers Look For

You should aim to fully solve (understand, code, test, explain) a typical Accenture Medium problem in **25-30 minutes**. This includes 5 minutes for clarification and edge case discussion, 15 minutes for coding, and 5-10 minutes for testing and walkthrough.

Beyond correctness, interviewers are evaluating:

1. **Code as communication**: They want to see if another engineer could pick up your code. Use descriptive variable names (`customerCounts` not `cc`). Write short, clear comments for non-obvious logic.
2. **Defensive edge case handling**: Explicitly check for null/empty inputs, overflow potential, and boundary conditions. State these out loud: "I'm assuming the input list isn't null, but in production I'd add a guard clause."
3. **Trade-off articulation**: When you use extra space for speed, explain why: "I'm using a HashMap for O(1) lookups, which gives us O(n) time instead of O(n²), at the cost of O(n) space."
4. **Incremental testing mindset**: Don't write all your code then test. Write a few lines, then say "Let me verify this intermediate step with a small example." This shows engineering discipline.

## Key Differences from Easy Problems

Easy problems at Accenture often have a single, straightforward transformation. Medium problems introduce **multiple constraints that interact**. For example, an Easy problem might ask you to filter a list. A Medium problem will ask you to filter, then group, then sort the groups by size, then format the output—all while maintaining O(n) time if possible.

The new techniques required are:

- **Intermediate data structure design**: You'll need to choose between arrays, hash maps, sets, or custom objects to track state.
- **Multi-step algorithm design**: Breaking the problem into clear, sequential phases becomes essential.
- **Efficiency awareness**: While brute force might pass, you're expected to recognize when O(n log n) is acceptable versus when O(n) is needed.

The mindset shift is from "What's the answer?" to "What's the cleanest path to a maintainable, efficient solution?"

## Specific Patterns for Medium

**1. Index Mapping for Rearrangement**
Problems like reordering items based on a rule (e.g., "move all zeros to the end while maintaining relative order of non-zeros") use a write pointer. This is more common than two-pointer at Accenture.

<div class="code-group">

```python
def move_zeros(nums):
    """Move zeros to end preserving order (similar to many Accenture problems)."""
    write = 0
    # First pass: write all non-zero elements
    for num in nums:
        if num != 0:
            nums[write] = num
            write += 1
    # Second pass: fill remaining with zeros
    for i in range(write, len(nums)):
        nums[i] = 0
    return nums
# Time: O(n) | Space: O(1)
```

```javascript
function moveZeros(nums) {
  let write = 0;
  for (let num of nums) {
    if (num !== 0) {
      nums[write++] = num;
    }
  }
  while (write < nums.length) {
    nums[write++] = 0;
  }
  return nums;
}
// Time: O(n) | Space: O(1)
```

```java
public void moveZeroes(int[] nums) {
    int write = 0;
    for (int num : nums) {
        if (num != 0) {
            nums[write++] = num;
        }
    }
    while (write < nums.length) {
        nums[write++] = 0;
    }
}
// Time: O(n) | Space: O(1)
```

</div>

**2. Frequency Map with Custom Sorting**
Many problems involve counting occurrences, then sorting or filtering based on those counts. Think "find the top K frequent items" or "group anagrams."

## Practice Strategy

Don't just solve randomly. Follow this progression:

1. **First 10 problems**: Focus on **pattern recognition**. Sort Accenture's Medium problems by acceptance rate and solve the highest first. For each, identify which template it matches. Time yourself loosely (40 minutes max).

2. **Next 20 problems**: Focus on **speed and articulation**. Set a strict 30-minute timer. Practice explaining your approach out loud before coding. After solving, review the most elegant community solution and note one improvement you could adopt.

3. **Remaining problems**: Focus on **robustness**. Intentionally break your solutions. What if the input is empty? Contains duplicates? Is extremely large? Add defensive checks and document assumptions.

Aim for **2-3 Medium problems daily** in the final weeks before your interview. Always solve in your interview language (Python, JavaScript, or Java). Mix in a few Easy problems as warm-ups and a few Hards to stretch your thinking, but spend 70% of your time on Medium.

The goal isn't to memorize 68 solutions—it's to internalize the 5-6 patterns that cover 80% of them, so you can adapt under pressure.

[Practice Medium Accenture questions](/company/accenture/medium)
