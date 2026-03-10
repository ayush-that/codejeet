---
title: "How to Solve Linked List Cycle — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Linked List Cycle. Easy difficulty, 53.9% acceptance rate. Topics: Hash Table, Linked List, Two Pointers."
date: "2026-02-24"
category: "dsa-patterns"
tags: ["linked-list-cycle", "hash-table", "linked-list", "two-pointers", "easy"]
---

# How to Solve Linked List Cycle

Detecting cycles in linked lists is a classic interview problem that tests your understanding of pointer manipulation and cycle detection algorithms. While the problem seems simple—just check if a node repeats—the challenge comes from not knowing the list's length and needing to detect cycles efficiently without extra memory. The clever solution uses two pointers moving at different speeds, a pattern that appears in many cycle-related problems.

## Visual Walkthrough

Let's trace through an example: `3 → 2 → 0 → -4 → back to node 2`

We'll use Floyd's Cycle-Finding Algorithm (tortoise and hare):

1. Start both `slow` and `fast` at node 3
2. `slow` moves 1 step: 3 → 2
3. `fast` moves 2 steps: 3 → 0 → -4
4. `slow` moves 1 step: 2 → 0
5. `fast` moves 2 steps: -4 → 2 → 0
6. Now both pointers are at node 0 → cycle detected!

The key insight: if there's a cycle, the fast pointer will eventually "lap" the slow pointer because it moves twice as fast. If there's no cycle, the fast pointer will reach `null`.

## Brute Force Approach

The most intuitive approach is to track visited nodes using a hash set:

1. Traverse the list node by node
2. For each node, check if it's already in our visited set
3. If yes → cycle detected
4. If we reach `null` → no cycle

While this works, it requires O(n) extra space for the hash set. Interviewers expect the O(1) space solution for this problem.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def hasCycle(head):
    """
    Brute force solution using hash set.
    Works but uses extra O(n) space.
    """
    visited = set()
    current = head

    while current:
        if current in visited:
            return True
        visited.add(current)
        current = current.next

    return False
```

```javascript
// Time: O(n) | Space: O(n)
function hasCycle(head) {
  /**
   * Brute force solution using Set.
   * Works but uses extra O(n) space.
   */
  const visited = new Set();
  let current = head;

  while (current !== null) {
    if (visited.has(current)) {
      return true;
    }
    visited.add(current);
    current = current.next;
  }

  return false;
}
```

```java
// Time: O(n) | Space: O(n)
public boolean hasCycle(ListNode head) {
    /**
     * Brute force solution using HashSet.
     * Works but uses extra O(n) space.
     */
    Set<ListNode> visited = new HashSet<>();
    ListNode current = head;

    while (current != null) {
        if (visited.contains(current)) {
            return true;
        }
        visited.add(current);
        current = current.next;
    }

    return false;
}
```

</div>

## Optimal Solution

Floyd's Cycle-Finding Algorithm (tortoise and hare) solves this in O(n) time with O(1) space. The algorithm uses two pointers moving at different speeds. If there's a cycle, they'll eventually meet.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def hasCycle(head):
    """
    Floyd's Cycle-Finding Algorithm (tortoise and hare).
    Uses two pointers moving at different speeds.
    """
    # Edge case: empty list has no cycle
    if not head:
        return False

    # Initialize two pointers at the head
    slow = head  # Moves 1 step at a time
    fast = head  # Moves 2 steps at a time

    # Traverse until fast reaches the end (no cycle)
    # or fast catches up to slow (cycle detected)
    while fast and fast.next:
        slow = slow.next        # Move slow one step
        fast = fast.next.next   # Move fast two steps

        # If they meet, there's a cycle
        if slow == fast:
            return True

    # If fast reached None, there's no cycle
    return False
```

```javascript
// Time: O(n) | Space: O(1)
function hasCycle(head) {
  /**
   * Floyd's Cycle-Finding Algorithm (tortoise and hare).
   * Uses two pointers moving at different speeds.
   */
  // Edge case: empty list has no cycle
  if (!head) {
    return false;
  }

  // Initialize two pointers at the head
  let slow = head; // Moves 1 step at a time
  let fast = head; // Moves 2 steps at a time

  // Traverse until fast reaches the end (no cycle)
  // or fast catches up to slow (cycle detected)
  while (fast !== null && fast.next !== null) {
    slow = slow.next; // Move slow one step
    fast = fast.next.next; // Move fast two steps

    // If they meet, there's a cycle
    if (slow === fast) {
      return true;
    }
  }

  // If fast reached null, there's no cycle
  return false;
}
```

```java
// Time: O(n) | Space: O(1)
public boolean hasCycle(ListNode head) {
    /**
     * Floyd's Cycle-Finding Algorithm (tortoise and hare).
     * Uses two pointers moving at different speeds.
     */
    // Edge case: empty list has no cycle
    if (head == null) {
        return false;
    }

    // Initialize two pointers at the head
    ListNode slow = head;  // Moves 1 step at a time
    ListNode fast = head;  // Moves 2 steps at a time

    // Traverse until fast reaches the end (no cycle)
    // or fast catches up to slow (cycle detected)
    while (fast != null && fast.next != null) {
        slow = slow.next;        // Move slow one step
        fast = fast.next.next;   // Move fast two steps

        // If they meet, there's a cycle
        if (slow == fast) {
            return true;
        }
    }

    // If fast reached null, there's no cycle
    return false;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case without a cycle, we traverse the entire list once (fast pointer visits each node)
- With a cycle, the fast pointer will meet the slow pointer within one cycle traversal
- The number of steps before meeting is proportional to the number of nodes

**Space Complexity: O(1)**

- We only use two pointers (slow and fast), regardless of list size
- No additional data structures like hash sets are needed

## Common Mistakes

1. **Not checking for null pointers before accessing `next`**: Always check `fast` and `fast.next` in the while condition. If you only check `fast.next`, you'll get a NullPointerException when `fast` is null.

2. **Starting slow and fast at different positions**: Both pointers must start at the head. If you start fast at `head.next`, you might get false positives or miss cycles.

3. **Infinite loop in cycle-free lists**: Forgetting to check `fast.next` in the while condition can cause infinite loops when the list has an even number of nodes.

4. **Comparing values instead of nodes**: The cycle is determined by node references/pointers, not their values. Two different nodes could have the same value.

## When You'll See This Pattern

The two-pointer technique with different speeds appears in several problems:

1. **Linked List Cycle II (Medium)**: After detecting a cycle, you need to find where the cycle begins. The solution extends Floyd's algorithm with additional pointer manipulation.

2. **Happy Number (Easy)**: The "tortoise and hare" concept applies to detecting cycles in number sequences. Instead of linked list nodes, you track computed values.

3. **Find the Duplicate Number (Medium)**: Treat the array as a linked list where each value points to the next index. The duplicate creates a cycle, solvable with Floyd's algorithm.

4. **Middle of the Linked List (Easy)**: Use slow/fast pointers where when fast reaches the end, slow is at the middle.

## Key Takeaways

1. **Floyd's Cycle-Finding Algorithm is the standard solution**: When you need to detect cycles with O(1) space, think "tortoise and hare" with slow and fast pointers.

2. **The pattern generalizes beyond linked lists**: Any sequence where each element determines the next (like in Happy Number) can use this cycle detection approach.

3. **Always handle edge cases**: Empty lists, single nodes, and two-node cycles need special consideration in your implementation.

Related problems: [Linked List Cycle II](/problem/linked-list-cycle-ii), [Happy Number](/problem/happy-number)
