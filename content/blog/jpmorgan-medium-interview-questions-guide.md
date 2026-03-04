---
title: "Medium JPMorgan Interview Questions: Strategy Guide"
description: "How to tackle 45 medium difficulty questions from JPMorgan — patterns, time targets, and practice tips."
date: "2032-06-18"
category: "tips"
tags: ["jpmorgan", "medium", "interview prep"]
---

Medium questions at JPMorgan typically assess a candidate's ability to implement core algorithms, manipulate data structures, and apply logical reasoning to problems that are one step beyond foundational concepts. They form the bulk of their technical question pool, making proficiency here critical. These problems often resemble standard LeetCode Mediums but may be framed within contexts like transaction processing, data validation, or scheduling, reflecting the company's domain.

## Common Patterns

JPMorgan's Medium questions frequently test specific algorithmic patterns. Mastering these will allow you to recognize and solve most problems efficiently.

**Array & String Manipulation:** Problems often involve in-place operations, sliding windows, or two-pointer techniques to optimize for time or space.

<div class="code-group">
```python
# Two-pointer: Remove duplicates from sorted array in-place
def removeDuplicates(nums):
    if not nums:
        return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read-1]:
            nums[write] = nums[read]
            write += 1
    return write
```
```javascript
// Two-pointer: Remove duplicates from sorted array in-place
function removeDuplicates(nums) {
    if (nums.length === 0) return 0;
    let write = 1;
    for (let read = 1; read < nums.length; read++) {
        if (nums[read] !== nums[read - 1]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}
```
```java
// Two-pointer: Remove duplicates from sorted array in-place
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int write = 1;
    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[read - 1]) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}
```
</div>

**Hash Map for Frequency & Lookup:** Many problems require counting elements, checking for anagrams, or finding pairs/sums.
**Tree & Graph Traversal:** Expect questions on breadth-first search (BFS) for level-order operations or depth-first search (DFS) for pathfinding.
**Dynamic Programming:** Common for optimization problems, such as finding minimum/maximum paths or ways to make change.

## Time Targets

In a typical 45-60 minute interview, you may be given 1-2 Medium problems. Your target should be to fully solve one Medium problem within 25-30 minutes. This includes:

- 2-3 minutes: Clarify the problem and edge cases.
- 10-12 minutes: Explain your approach and write the code.
- 3-5 minutes: Test with examples and discuss complexity.
  Leaving adequate time for discussion is crucial. Practice under timed conditions to build the necessary speed and confidence.

## Practice Strategy

Do not randomly solve questions. Use a targeted approach:

1. **Pattern-First Practice:** Group and solve problems by the patterns listed above. Aim for 15-20 questions per pattern to build deep recognition.
2. **Simulate Interview Conditions:** Time every practice session. Use a whiteboard or plain text editor without autocomplete.
3. **Prioritize JPMorgan's List:** Focus on the company's tagged Medium questions. They indicate the exact problem style and difficulty you will encounter.
4. **Master One Language:** Be prepared to code in your chosen language fluently. Write syntactically correct code without relying on an IDE.

[Practice Medium JPMorgan questions](/company/jpmorgan/medium)
