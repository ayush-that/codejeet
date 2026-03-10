---
title: "Two Pointers Questions at Atlassian: What to Expect"
description: "Prepare for Two Pointers interview questions at Atlassian — patterns, difficulty breakdown, and study tips."
date: "2029-02-24"
category: "dsa-patterns"
tags: ["atlassian", "two-pointers", "interview prep"]
---

# Two Pointers Questions at Atlassian: What to Expect

Atlassian's coding interview landscape reveals an interesting pattern: out of 62 total questions in their tagged problem set, only 5 are explicitly Two Pointers problems. That's about 8% — not a dominant category, but one that appears consistently enough that you'll likely encounter it. The real insight isn't in the quantity but in the _quality_ of these questions. Atlassian doesn't ask Two Pointers as filler; they use it to assess fundamental algorithmic thinking and clean implementation skills. When it appears, it's often as part of a multi-step problem where recognizing the pattern saves crucial time.

In my experience interviewing candidates at Atlassian and similar companies, Two Pointers questions serve as excellent filters. They're deceptively simple in concept but reveal a lot about a candidate's ability to manipulate indices, handle edge cases, and write bug-free code under pressure. The 8% occurrence rate means you might not see it in every interview loop, but if you do, it's usually in the early technical screening where they're testing core competency.

## Specific Patterns Atlassian Favors

Atlassian's Two Pointers problems tend to cluster around two specific patterns rather than covering the entire spectrum:

1. **Opposite-direction pointers for array/string manipulation** — Classic problems where you start with pointers at both ends and move them toward each other. Atlassian favors variations that involve conditional pointer movement based on comparisons. You'll rarely see the most basic "Two Sum" implementation; instead, they prefer problems like **Container With Most Water (LeetCode #11)** where the pointer movement logic requires understanding a non-obvious invariant (the shorter height determines capacity).

2. **Fast-slow pointers for cycle detection** — This appears in linked list contexts, particularly in problems about detecting cycles or finding middle nodes. What makes Atlassian's approach interesting is they often combine this with other concepts. For example, you might get a problem that starts as a cycle detection question but evolves into modifying the list structure once the cycle is found.

The company tends to avoid "sliding window" variations under the Two Pointers category — those usually get classified under their own heading. Their Two Pointers questions are pure pointer manipulation problems that test your ability to reason about indices and termination conditions.

<div class="code-group">

```python
# Atlassian-style opposite-direction pointers
# Problem: Remove duplicates from sorted array in-place (LeetCode #26 variant)
# Time: O(n) | Space: O(1)
def remove_duplicates(nums):
    if not nums:
        return 0

    # Slow pointer tracks position for next unique element
    # Fast pointer explores the array
    slow = 0

    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]

    return slow + 1  # Length of unique portion

# Atlassian often tests if you understand why this is O(1) space
# (modifying input array in-place, not creating new array)
```

```javascript
// Atlassian-style opposite-direction pointers
// Problem: Remove duplicates from sorted array in-place (LeetCode #26 variant)
// Time: O(n) | Space: O(1)
function removeDuplicates(nums) {
  if (!nums || nums.length === 0) return 0;

  // Slow pointer tracks position for next unique element
  // Fast pointer explores the array
  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1; // Length of unique portion
}

// Atlassian interviewers often ask: "What's the space complexity?"
// Correct answer: O(1) because we're modifying in-place
```

```java
// Atlassian-style opposite-direction pointers
// Problem: Remove duplicates from sorted array in-place (LeetCode #26 variant)
// Time: O(n) | Space: O(1)
public int removeDuplicates(int[] nums) {
    if (nums == null || nums.length == 0) return 0;

    // Slow pointer tracks position for next unique element
    // Fast pointer explores the array
    int slow = 0;

    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }

    return slow + 1;  // Length of unique portion
}

// Atlassian interviewers might follow up with:
// "How would you handle at most 2 duplicates allowed?"
// (That's LeetCode #80 - Remove Duplicates from Sorted Array II)
```

</div>

## How to Prepare

The key to Atlassian's Two Pointers questions is recognizing that they're testing _conceptual understanding_ more than pattern memorization. Here's how to prepare effectively:

**Master the invariant reasoning** — For opposite-direction pointers, you need to articulate _why_ moving a particular pointer is correct. In Container With Most Water, the invariant is: "Moving the pointer at the shorter height might increase area; moving the pointer at the taller height cannot." Practice stating these invariants aloud.

**Implement from first principles** — Don't just memorize solutions. Implement each pattern from scratch multiple times until you can write bug-free code without referencing anything. Atlassian interviewers watch for off-by-one errors and termination condition mistakes.

**Practice the fast-slow pointer variations** — Beyond basic cycle detection, practice finding the cycle starting point (LeetCode #142), palindrome checking in linked lists (LeetCode #234), and finding the middle node. Atlassian sometimes combines these with other operations.

<div class="code-group">

```python
# Fast-slow pointers for cycle detection and finding start
# Problem: Linked List Cycle II (LeetCode #142)
# Time: O(n) | Space: O(1)
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

def detectCycle(head):
    if not head or not head.next:
        return None

    # Phase 1: Determine if cycle exists
    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

        if slow == fast:
            # Phase 2: Find cycle start
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow

    return None

# Atlassian might ask: "Why does this algorithm work?"
# Be prepared to explain the mathematical reasoning
```

```javascript
// Fast-slow pointers for cycle detection and finding start
// Problem: Linked List Cycle II (LeetCode #142)
// Time: O(n) | Space: O(1)
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function detectCycle(head) {
  if (!head || !head.next) return null;

  // Phase 1: Determine if cycle exists
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      // Phase 2: Find cycle start
      slow = head;
      while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
      }
      return slow;
    }
  }

  return null;
}

// Atlassian interviewers love asking for the proof
// Practice explaining why the second phase works
```

```java
// Fast-slow pointers for cycle detection and finding start
// Problem: Linked List Cycle II (LeetCode #142)
// Time: O(n) | Space: O(1)
public class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public ListNode detectCycle(ListNode head) {
    if (head == null || head.next == null) return null;

    // Phase 1: Determine if cycle exists
    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow == fast) {
            // Phase 2: Find cycle start
            slow = head;
            while (slow != fast) {
                slow = slow.next;
                fast = fast.next;
            }
            return slow;
        }
    }

    return null;
}

// Be ready to explain: When slow and fast meet,
// resetting slow to head and moving both one step
// will make them meet at cycle start
```

</div>

## How Atlassian Tests Two Pointers vs Other Companies

Atlassian's approach to Two Pointers differs from other tech companies in subtle but important ways:

**Compared to FAANG companies:** Google and Facebook tend to ask more complex Two Pointers problems, often combined with other data structures. Atlassian keeps them relatively pure but focuses on implementation correctness. While Google might ask "3Sum" (LeetCode #15) with follow-ups about optimization, Atlassian is more likely to ask a cleaner problem like "Merge Sorted Array" (LeetCode #88) but expect perfect edge case handling.

**Difficulty level:** Atlassian's Two Pointers questions are typically medium difficulty, rarely hard. But don't be fooled — they expect flawless implementation. I've seen candidates solve hard dynamic programming problems but fail Atlassian interviews on medium Two Pointers questions because of off-by-one errors or unclear reasoning.

**Interview style:** Atlassian interviewers often ask you to "think aloud" more than other companies. They want to hear your reasoning about pointer movement. They might also give you a problem that seems like it needs a hash map, then ask: "Can you solve this with O(1) space using two pointers?" This tests your ability to optimize beyond the obvious solution.

## Study Order

1. **Basic opposite-direction pointers** — Start with the simplest pattern: pointers at both ends moving toward each other. Master problems like "Two Sum II" (LeetCode #167) where the array is sorted. This builds intuition for pointer movement.

2. **Fast-slow pointers for linked lists** — Learn cycle detection and middle node finding. These are conceptually different from array two pointers and require separate practice.

3. **In-place array manipulation** — Practice problems where you use two pointers to modify an array without extra space. "Remove Element" (LeetCode #27) and "Move Zeroes" (LeetCode #283) are perfect here.

4. **Conditional pointer movement** — This is where Atlassian's questions live. Practice problems where pointer movement depends on comparisons between values at both pointers. "Container With Most Water" (LeetCode #11) is the canonical example.

5. **Multi-step problems** — Finally, practice problems where Two Pointers is part of a larger solution. For example, problems that require sorting first, then using two pointers.

This order works because it builds from simple mechanical understanding to complex reasoning. You need to automate the basic patterns before you can focus on the conditional logic that Atlassian tests.

## Recommended Practice Order

1. **Two Sum II** (LeetCode #167) — Basic opposite-direction pointers with sorted input
2. **Valid Palindrome** (LeetCode #125) — String manipulation with two pointers
3. **Remove Duplicates from Sorted Array** (LeetCode #26) — In-place modification practice
4. **Linked List Cycle** (LeetCode #141) — Basic fast-slow pointer introduction
5. **Container With Most Water** (LeetCode #11) — Conditional pointer movement (Atlassian favorite)
6. **Trapping Rain Water** (LeetCode #42) — Advanced opposite-direction with min/max tracking
7. **Merge Sorted Array** (LeetCode #88) — Working from the end backward (common Atlassian pattern)
8. **Linked List Cycle II** (LeetCode #142) — Finding cycle start (tests deeper understanding)

After completing these, search for Atlassian-tagged Two Pointers problems on LeetCode to see their specific variations. Remember: Atlassian values clean, correct implementation over clever but buggy solutions. Practice writing your code with proper variable names, clear comments in your mind (if not on paper), and thorough testing of edge cases.

[Practice Two Pointers at Atlassian](/company/atlassian/two-pointers)
