---
title: "Linked List Interview Questions: Patterns and Strategies"
description: "Master Linked List problems for coding interviews — common patterns, difficulty breakdown, which companies ask them, and study tips."
date: "2028-04-24"
category: "dsa-patterns"
tags: ["linked-list", "dsa", "interview prep"]
---

# Linked List Interview Questions: Patterns and Strategies

Linked lists are one of those fundamental data structures that seem simple until you're in the hot seat. I've seen senior engineers stumble on what should be straightforward linked list problems because they underestimated the edge cases or missed the pattern. The data tells the story: with 66 questions on CodeJeet, linked lists appear in 18% easy, 71% medium, and 11% hard problems. This distribution is telling — interviewers love linked lists for medium-difficulty questions that test your attention to detail and pointer manipulation skills.

One problem that consistently catches candidates off guard is **"Reorder List" (LeetCode #143)**. It seems straightforward: reorder a linked list L0 → L1 → … → Ln-1 → Ln to L0 → Ln → L1 → Ln-1 → … But when you're trying to do this in-place with O(1) extra space, suddenly you need to combine multiple patterns: finding the middle, reversing a sublist, and merging two lists. Candidates who haven't practiced the patterns often get lost in pointer manipulation.

## Common Patterns

### 1. Fast and Slow Pointers (Tortoise and Hare)

This is arguably the most important linked list pattern. The intuition is simple: move two pointers at different speeds to find specific positions in the list. The fast pointer moves two nodes at a time while the slow pointer moves one. When the fast pointer reaches the end, the slow pointer will be at the middle.

**Key applications:**

- Finding the middle of a linked list (LeetCode #876: Middle of the Linked List)
- Detecting cycles (LeetCode #141: Linked List Cycle)
- Finding the cycle entry point if a cycle exists (LeetCode #142: Linked List Cycle II)

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def has_cycle(head):
    """
    Detect if a linked list has a cycle using Floyd's Tortoise and Hare algorithm.
    """
    if not head or not head.next:
        return False

    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next          # Move one step
        fast = fast.next.next     # Move two steps

        if slow == fast:          # They meet if there's a cycle
            return True

    return False                  # Fast reached the end, no cycle
```

```javascript
// Time: O(n) | Space: O(1)
function hasCycle(head) {
  /**
   * Detect if a linked list has a cycle using Floyd's Tortoise and Hare algorithm.
   */
  if (!head || !head.next) return false;

  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next; // Move one step
    fast = fast.next.next; // Move two steps

    if (slow === fast) {
      // They meet if there's a cycle
      return true;
    }
  }

  return false; // Fast reached the end, no cycle
}
```

```java
// Time: O(n) | Space: O(1)
public boolean hasCycle(ListNode head) {
    /**
     * Detect if a linked list has a cycle using Floyd's Tortoise and Hare algorithm.
     */
    if (head == null || head.next == null) return false;

    ListNode slow = head;
    ListNode fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;          // Move one step
        fast = fast.next.next;     // Move two steps

        if (slow == fast) {        // They meet if there's a cycle
            return true;
        }
    }

    return false;                  // Fast reached the end, no cycle
}
```

</div>

### 2. Reversal Patterns

Linked list reversal appears in many problems, either as the main task or as a subproblem. The intuition is to change the direction of pointers iteratively while keeping track of previous, current, and next nodes.

**Key applications:**

- Reversing a linked list (LeetCode #206: Reverse Linked List)
- Reversing nodes in k-group (LeetCode #25: Reverse Nodes in k-Group)
- Palindrome checking (LeetCode #234: Palindrome Linked List)

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def reverse_list(head):
    """
    Reverse a linked list iteratively.
    Maintain three pointers: prev, curr, and next_temp.
    """
    prev = None
    curr = head

    while curr:
        next_temp = curr.next  # Store next node
        curr.next = prev       # Reverse the pointer
        prev = curr           # Move prev forward
        curr = next_temp      # Move curr forward

    return prev  # New head of reversed list
```

```javascript
// Time: O(n) | Space: O(1)
function reverseList(head) {
  /**
   * Reverse a linked list iteratively.
   * Maintain three pointers: prev, curr, and nextTemp.
   */
  let prev = null;
  let curr = head;

  while (curr) {
    const nextTemp = curr.next; // Store next node
    curr.next = prev; // Reverse the pointer
    prev = curr; // Move prev forward
    curr = nextTemp; // Move curr forward
  }

  return prev; // New head of reversed list
}
```

```java
// Time: O(n) | Space: O(1)
public ListNode reverseList(ListNode head) {
    /**
     * Reverse a linked list iteratively.
     * Maintain three pointers: prev, curr, and nextTemp.
     */
    ListNode prev = null;
    ListNode curr = head;

    while (curr != null) {
        ListNode nextTemp = curr.next;  // Store next node
        curr.next = prev;               // Reverse the pointer
        prev = curr;                    // Move prev forward
        curr = nextTemp;                // Move curr forward
    }

    return prev;  // New head of reversed list
}
```

</div>

### 3. Dummy Head Technique

When you need to modify a linked list and return the new head, but the head might change, use a dummy node. This eliminates special cases for head updates and makes your code cleaner.

**Key applications:**

- Removing elements (LeetCode #203: Remove Linked List Elements)
- Merging sorted lists (LeetCode #21: Merge Two Sorted Lists)
- Partition lists (LeetCode #86: Partition List)

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def remove_elements(head, val):
    """
    Remove all nodes with value equal to val.
    Using dummy head to handle edge case where head needs to be removed.
    """
    dummy = ListNode(0)
    dummy.next = head

    prev = dummy
    curr = head

    while curr:
        if curr.val == val:
            prev.next = curr.next  # Skip the node to remove
        else:
            prev = curr  # Only move prev if we didn't remove

        curr = curr.next

    return dummy.next  # New head (might be different from original)
```

```javascript
// Time: O(n) | Space: O(1)
function removeElements(head, val) {
  /**
   * Remove all nodes with value equal to val.
   * Using dummy head to handle edge case where head needs to be removed.
   */
  const dummy = new ListNode(0);
  dummy.next = head;

  let prev = dummy;
  let curr = head;

  while (curr) {
    if (curr.val === val) {
      prev.next = curr.next; // Skip the node to remove
    } else {
      prev = curr; // Only move prev if we didn't remove
    }

    curr = curr.next;
  }

  return dummy.next; // New head (might be different from original)
}
```

```java
// Time: O(n) | Space: O(1)
public ListNode removeElements(ListNode head, int val) {
    /**
     * Remove all nodes with value equal to val.
     * Using dummy head to handle edge case where head needs to be removed.
     */
    ListNode dummy = new ListNode(0);
    dummy.next = head;

    ListNode prev = dummy;
    ListNode curr = head;

    while (curr != null) {
        if (curr.val == val) {
            prev.next = curr.next;  // Skip the node to remove
        } else {
            prev = curr;  // Only move prev if we didn't remove
        }

        curr = curr.next;
    }

    return dummy.next;  // New head (might be different from original)
}
```

</div>

## When to Use Linked List vs Alternatives

Linked list problems often have array or hash map alternatives. Knowing when to choose which approach is crucial.

**Use linked list techniques when:**

1. **The problem explicitly mentions a linked list** — this seems obvious, but I've seen candidates try to convert to arrays unnecessarily.
2. **You need O(1) insertions/deletions at known positions** — arrays require O(n) shifting.
3. **Memory is fragmented or you can't allocate large contiguous blocks** — linked lists use scattered memory.
4. **You're doing multiple passes and need to modify structure in-place** — arrays often require extra O(n) space.

**Consider alternatives when:**

1. **You need random access** — arrays provide O(1) access by index; linked lists require O(n) traversal.
2. **Memory overhead matters** — linked lists have extra pointer overhead per node.
3. **Cache performance is important** — arrays have better locality of reference.

**Decision criteria:**

- If the problem says "in-place with O(1) extra memory," linked list manipulation is likely required.
- If you need to frequently search for elements, consider converting to a hash set first (O(n) time, O(n) space tradeoff).
- For palindrome checking, you could copy to an array (O(n) space) or use slow/fast pointers with reversal (O(1) space).

## Edge Cases and Gotchas

Interviewers love testing these edge cases. Miss one, and you've failed the question.

### 1. Empty List or Single Node

Always check `if not head` or `if not head.next` at the beginning. Many operations (like finding the middle or reversing) have special cases for empty or single-node lists.

### 2. Off-by-One Errors in Pointer Movement

When using fast and slow pointers, the termination condition matters. Use `while fast and fast.next` (Python/JS) or `while fast != null && fast.next != null` (Java) to avoid null pointer exceptions. If you use `while fast.next and fast.next.next`, you might miss the last node in even-length lists.

### 3. Modifying Pointers Incorrectly During Reversal

The classic mistake in reversal is losing the reference to the next node. Always store `next_temp = curr.next` before modifying `curr.next`. I've seen candidates write `curr.next = prev` and then try to move forward with `curr = curr.next` (which now points backward).

### 4. Not Handling the Tail Properly

When doing operations that might change the last node's `next` pointer (like partitioning or reordering), ensure the new tail points to `null`. Otherwise, you create cycles unintentionally. Always ask: "What should the last node point to?"

## Difficulty Breakdown

The 12 easy problems (18%) are mostly about basic traversal and simple modifications. These are warm-ups. The 47 medium problems (71%) are where the real interview questions live — they combine patterns and test your ability to manage multiple pointers. The 7 hard problems (11%) often involve complex pointer manipulation or combining linked lists with other data structures.

**Study prioritization:**

1. **Master all medium problems** — this is where most interview questions come from.
2. **Use easy problems for pattern recognition practice** — do them quickly to build confidence.
3. **Attempt hard problems last** — they're less common in interviews but excellent for deepening understanding.

## Which Companies Ask Linked List

- **Google** (/company/google) often asks linked list problems that combine with other concepts, like "LRU Cache" (LeetCode #146) which combines hash map and doubly linked list.
- **Amazon** (/company/amazon) favors practical problems like "Copy List with Random Pointer" (LeetCode #138) that test object manipulation skills.
- **Meta** (/company/meta) asks linked list questions that involve multiple passes and pointer manipulation, like "Reorder List" (LeetCode #143).
- **Microsoft** (/company/microsoft) tends toward cleaner algorithmic problems like "Add Two Numbers" (LeetCode #2).
- **Bloomberg** (/company/bloomberg) frequently asks linked list questions in phone screens, often focusing on edge cases and clean implementation.

Each company has its style: Google tests your ability to combine data structures, Amazon tests practical implementation, Meta tests complex pointer manipulation, Microsoft tests algorithmic thinking, and Bloomberg tests attention to detail.

## Study Tips

1. **Draw before you code** — Seriously, get a whiteboard or paper. Draw the initial state, each step of your algorithm, and the final state. This prevents pointer errors that are hard to debug mentally.

2. **Practice the patterns separately first** — Before tackling combination problems, master each pattern in isolation. Can you write reversal, cycle detection, and finding the middle without thinking?

3. **Follow this problem order:**
   - Start with: Reverse Linked List (#206), Middle of the Linked List (#876), Merge Two Sorted Lists (#21)
   - Then: Linked List Cycle (#141), Remove Nth Node From End of List (#19), Palindrome Linked List (#234)
   - Finally: Reorder List (#143), Copy List with Random Pointer (#138), LRU Cache (#146)

4. **Time box your practice** — Give yourself 25 minutes per problem, just like a real interview. If you can't solve it, study the solution, wait a day, then try again without looking.

Remember: linked list questions are less about raw algorithmic complexity and more about careful pointer manipulation and handling edge cases. The patterns are limited, but mastering them requires deliberate practice.

[Practice all Linked List questions on CodeJeet](/topic/linked-list)
