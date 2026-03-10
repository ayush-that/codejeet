---
title: "How to Solve Linked List Cycle II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Linked List Cycle II. Medium difficulty, 57.3% acceptance rate. Topics: Hash Table, Linked List, Two Pointers."
date: "2026-06-02"
category: "dsa-patterns"
tags: ["linked-list-cycle-ii", "hash-table", "linked-list", "two-pointers", "medium"]
---

# How to Solve Linked List Cycle II

This problem asks us to detect a cycle in a linked list and return the node where the cycle begins. If there's no cycle, we return `null`. What makes this problem interesting is that while detecting a cycle is straightforward with Floyd's Tortoise and Hare algorithm, finding the exact starting point requires additional mathematical insight. Many candidates can detect a cycle but struggle to prove why the two-pointer approach correctly identifies the cycle's entry point.

## Visual Walkthrough

Let's trace through an example: `[3,2,0,-4]` with a cycle where node at index 3 (value -4) points back to node at index 1 (value 2).

**Step 1: Initial Setup**

- We have nodes: 3 → 2 → 0 → -4 → (back to 2)
- The cycle begins at node with value 2

**Step 2: Detecting a Cycle (Floyd's Algorithm)**

- Slow pointer moves 1 step at a time, fast pointer moves 2 steps
- They start at node 3
- Step 1: Slow at 2, Fast at 0
- Step 2: Slow at 0, Fast at 2 (fast caught up to slow)
- We've detected a cycle!

**Step 3: Finding the Cycle Start**

- Reset slow pointer to head (node 3)
- Keep fast pointer where it is (node 2)
- Move both pointers one step at a time
- Step 1: Slow at 2, Fast at 0
- Step 2: Slow at 0, Fast at 2 (they meet!)
- The meeting point is node 2, which is exactly where the cycle begins

The key insight: When the two pointers meet during cycle detection, the distance from the head to the cycle start equals the distance from the meeting point to the cycle start (when moving forward through the list).

## Brute Force Approach

The most straightforward approach is to use a hash table to track visited nodes:

1. Traverse the linked list from head to tail
2. For each node, check if we've seen it before
3. If yes, that's the cycle start
4. If we reach `null`, there's no cycle

This works but requires O(n) space. While acceptable for many problems, interviewers often expect the O(1) space solution for linked list cycle problems.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def detectCycle(head):
    """
    Brute force solution using hash table.
    Simple but uses O(n) extra space.
    """
    visited = set()
    current = head

    while current:
        if current in visited:
            return current  # Found cycle start
        visited.add(current)
        current = current.next

    return None  # No cycle
```

```javascript
// Time: O(n) | Space: O(n)
function detectCycle(head) {
  /**
   * Brute force solution using hash table.
   * Simple but uses O(n) extra space.
   */
  const visited = new Set();
  let current = head;

  while (current) {
    if (visited.has(current)) {
      return current; // Found cycle start
    }
    visited.add(current);
    current = current.next;
  }

  return null; // No cycle
}
```

```java
// Time: O(n) | Space: O(n)
public ListNode detectCycle(ListNode head) {
    /**
     * Brute force solution using hash table.
     * Simple but uses O(n) extra space.
     */
    Set<ListNode> visited = new HashSet<>();
    ListNode current = head;

    while (current != null) {
        if (visited.contains(current)) {
            return current;  // Found cycle start
        }
        visited.add(current);
        current = current.next;
    }

    return null;  // No cycle
}
```

</div>

## Optimized Approach

The optimal solution uses Floyd's Tortoise and Hare algorithm with O(1) space. Here's the step-by-step reasoning:

1. **Phase 1: Detect if a cycle exists**
   - Use two pointers: `slow` moves 1 step, `fast` moves 2 steps
   - If they meet, a cycle exists
   - If `fast` reaches `null`, no cycle exists

2. **Phase 2: Find the cycle start**
   - This is the tricky part that requires mathematical insight
   - Let:
     - `x` = distance from head to cycle start
     - `y` = distance from cycle start to meeting point
     - `z` = distance from meeting point back to cycle start
   - When slow and fast meet:
     - Slow has traveled: `x + y`
     - Fast has traveled: `x + y + z + y` = `x + 2y + z`
   - Since fast moves twice as fast as slow: `2(x + y) = x + 2y + z`
   - Simplifying: `2x + 2y = x + 2y + z` → `x = z`
   - This means the distance from head to cycle start equals the distance from meeting point to cycle start!

3. **Phase 3: Find the entry point**
   - Reset one pointer to head
   - Move both pointers one step at a time
   - They will meet at the cycle start

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def detectCycle(head):
    """
    Optimal solution using Floyd's Tortoise and Hare algorithm.
    Uses O(1) space by employing two pointers.
    """
    # Edge case: empty list or single node without cycle
    if not head or not head.next:
        return None

    # Phase 1: Detect if cycle exists
    slow = head
    fast = head

    # Move pointers until they meet or fast reaches end
    while fast and fast.next:
        slow = slow.next        # Move slow by 1
        fast = fast.next.next   # Move fast by 2

        # If pointers meet, cycle detected
        if slow == fast:
            # Phase 2: Find cycle start
            # Reset slow to head, keep fast at meeting point
            slow = head

            # Move both one step at a time until they meet
            # According to Floyd's proof, they'll meet at cycle start
            while slow != fast:
                slow = slow.next
                fast = fast.next

            return slow  # This is the cycle start node

    # If we exit the while loop, fast reached None = no cycle
    return None
```

```javascript
// Time: O(n) | Space: O(1)
function detectCycle(head) {
  /**
   * Optimal solution using Floyd's Tortoise and Hare algorithm.
   * Uses O(1) space by employing two pointers.
   */
  // Edge case: empty list or single node without cycle
  if (!head || !head.next) {
    return null;
  }

  // Phase 1: Detect if cycle exists
  let slow = head;
  let fast = head;

  // Move pointers until they meet or fast reaches end
  while (fast && fast.next) {
    slow = slow.next; // Move slow by 1
    fast = fast.next.next; // Move fast by 2

    // If pointers meet, cycle detected
    if (slow === fast) {
      // Phase 2: Find cycle start
      // Reset slow to head, keep fast at meeting point
      slow = head;

      // Move both one step at a time until they meet
      // According to Floyd's proof, they'll meet at cycle start
      while (slow !== fast) {
        slow = slow.next;
        fast = fast.next;
      }

      return slow; // This is the cycle start node
    }
  }

  // If we exit the while loop, fast reached null = no cycle
  return null;
}
```

```java
// Time: O(n) | Space: O(1)
public ListNode detectCycle(ListNode head) {
    /**
     * Optimal solution using Floyd's Tortoise and Hare algorithm.
     * Uses O(1) space by employing two pointers.
     */
    // Edge case: empty list or single node without cycle
    if (head == null || head.next == null) {
        return null;
    }

    // Phase 1: Detect if cycle exists
    ListNode slow = head;
    ListNode fast = head;

    // Move pointers until they meet or fast reaches end
    while (fast != null && fast.next != null) {
        slow = slow.next;        // Move slow by 1
        fast = fast.next.next;   // Move fast by 2

        // If pointers meet, cycle detected
        if (slow == fast) {
            // Phase 2: Find cycle start
            // Reset slow to head, keep fast at meeting point
            slow = head;

            // Move both one step at a time until they meet
            // According to Floyd's proof, they'll meet at cycle start
            while (slow != fast) {
                slow = slow.next;
                fast = fast.next;
            }

            return slow;  // This is the cycle start node
        }
    }

    // If we exit the while loop, fast reached null = no cycle
    return null;
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- In the worst case, we traverse the list twice
- First pass: detect cycle (up to n steps)
- Second pass: find cycle start (up to n steps)
- Total: O(2n) = O(n)

**Space Complexity: O(1)**

- We only use two pointers (`slow` and `fast`)
- No additional data structures that grow with input size
- This is the key advantage over the hash table approach

## Common Mistakes

1. **Not checking for `fast.next` before accessing `fast.next.next`**
   - This causes null pointer exceptions
   - Always check `fast && fast.next` (or equivalent) in the while condition

2. **Forgetting to handle edge cases**
   - Empty list (`head = null`)
   - Single node without cycle
   - Always check these at the beginning

3. **Incorrect pointer reset in phase 2**
   - Some candidates reset both pointers to head
   - You must keep `fast` at the meeting point and only reset `slow` to head
   - This is crucial for the mathematical proof to work

4. **Assuming the meeting point is the cycle start**
   - The first meeting point is NOT necessarily the cycle start
   - You need the second phase to find the actual entry point
   - This is the most common conceptual mistake

## When You'll See This Pattern

The Floyd's Tortoise and Hare algorithm appears in several problems:

1. **Linked List Cycle (Easy)** - The simpler version where you only need to detect if a cycle exists, not find its start.

2. **Find the Duplicate Number (Medium)** - This problem can be solved by treating the array as a linked list where each value points to the index at that value. The duplicate creates a cycle, and finding the duplicate is equivalent to finding the cycle start.

3. **Happy Number (Easy)** - While not exactly the same, it uses the cycle detection concept to determine if you'll eventually reach 1 or enter a cycle.

The pattern is useful whenever you need to detect cycles in a sequence of transformations, especially when you have O(1) space constraints.

## Key Takeaways

1. **Floyd's algorithm has two phases**: detection and localization. Don't stop after detecting the cycle if you need to find where it starts.

2. **The mathematical relationship** `x = z` (distance from head to cycle start equals distance from meeting point to cycle start) is the key insight. Understanding this helps explain your solution convincingly.

3. **This pattern transforms a "find duplicate" problem into a "find cycle start" problem** when you can model the data as a linked list. Look for problems where values can be interpreted as pointers to other indices.

Related problems: [Linked List Cycle](/problem/linked-list-cycle), [Find the Duplicate Number](/problem/find-the-duplicate-number)
