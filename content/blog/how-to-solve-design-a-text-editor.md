---
title: "How to Solve Design a Text Editor — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Design a Text Editor. Hard difficulty, 50.1% acceptance rate. Topics: Linked List, String, Stack, Design, Simulation."
date: "2028-11-09"
category: "dsa-patterns"
tags: ["design-a-text-editor", "linked-list", "string", "stack", "hard"]
---

# How to Solve "Design a Text Editor"

Designing a text editor might seem straightforward at first glance, but the challenge lies in efficiently handling cursor operations. The problem requires implementing four core operations: adding text, deleting text (backspace), and moving the cursor left or right. The tricky part is that all operations must be efficient—specifically O(1) or O(k) where k is the number of characters added/deleted—not O(n) where n is the total text length. This rules out simple string manipulation and requires a clever data structure choice.

## Visual Walkthrough

Let's trace through a concrete example to build intuition. We'll start with an empty editor and perform these operations:

1. `addText("hello")` → Text: "hello", Cursor at position 5 (end)
2. `moveCursorLeft(2)` → Cursor moves to position 3 (after "hel")
3. `deleteText(1)` → Deletes "l", Text: "helo", Cursor at position 2 (after "he")
4. `addText("p")` → Inserts "p", Text: "heplo", Cursor at position 3 (after "hep")
5. `moveCursorRight(3)` → Cursor moves to end, position 5
6. `deleteText(5)` → Deletes last 3 chars ("plo"), Text: "he"

The key observation: the cursor splits the text into two parts—left of cursor and right of cursor. When we add text, we insert at the end of the left part. When we delete, we remove from the end of the left part. Moving the cursor transfers characters between the left and right parts.

Think of it like this: `left = "he"`, `right = "plo"` (cursor between them). After `addText("x")`: `left = "hex"`, `right = "plo"`. After `moveCursorLeft(1)`: `left = "he"`, `right = "xplo"`.

## Brute Force Approach

A naive approach would use a single string and an integer cursor position:

- **Add text**: Use string slicing: `text = text[:cursor] + new_text + text[cursor:]`, then move cursor right by length of new_text. This is O(n) where n is text length.
- **Delete text**: `text = text[:max(0, cursor-k)] + text[cursor:]`, adjust cursor. Also O(n).
- **Move cursor**: Simply adjust the integer position. O(1).

The problem? Operations can be called up to 2×10⁴ times with text up to 2×10⁴ characters total. O(n) operations would lead to O(n²) worst-case time, which is too slow. We need O(1) or O(k) operations.

## Optimized Approach

The key insight is that **the cursor naturally divides the text into two stacks**:

- **Left stack**: Characters to the left of cursor (with cursor at the top of this stack)
- **Right stack**: Characters to the right of cursor (with first right character at the top)

Why stacks? Because:

1. Adding text pushes onto the left stack → O(1) per character
2. Deleting text pops from the left stack → O(1) per character
3. Moving left pops from left stack and pushes to right stack → O(1) per move
4. Moving right pops from right stack and pushes to left stack → O(1) per move

For `cursorLeft(k)` and `cursorRight(k)` that need to return the last min(10, left_length) characters, we can simply peek at the last up to 10 characters from the left stack.

This two-stack approach gives us O(k) time for all operations where k is the number of characters added/deleted/moved, independent of total text length.

## Optimal Solution

Here's the complete implementation using two stacks (or arrays acting as stacks):

<div class="code-group">

```python
class TextEditor:
    # Time: O(k) per operation where k is chars added/deleted/moved
    # Space: O(n) where n is total characters in editor

    def __init__(self):
        # Left stack: characters left of cursor, cursor is at end of left
        # Right stack: characters right of cursor
        self.left = []
        self.right = []

    def addText(self, text: str) -> None:
        # Add each character to the left stack
        # This simulates typing at cursor position
        for ch in text:
            self.left.append(ch)

    def deleteText(self, k: int) -> int:
        # Delete up to k characters from left stack
        # Return actual number deleted (might be less if left has < k chars)
        deleted = 0
        while k > 0 and self.left:
            self.left.pop()
            deleted += 1
            k -= 1
        return deleted

    def cursorLeft(self, k: int) -> str:
        # Move cursor left by k characters
        # Move characters from left stack to right stack
        while k > 0 and self.left:
            # Pop from left, push to right
            self.right.append(self.left.pop())
            k -= 1

        # Return last up to 10 chars left of cursor
        return self._get_last_chars()

    def cursorRight(self, k: int) -> str:
        # Move cursor right by k characters
        # Move characters from right stack to left stack
        while k > 0 and self.right:
            # Pop from right, push to left
            self.left.append(self.right.pop())
            k -= 1

        # Return last up to 10 chars left of cursor
        return self._get_last_chars()

    def _get_last_chars(self) -> str:
        # Helper to get last min(10, len(left)) characters
        # These are the characters immediately left of cursor
        start = max(0, len(self.left) - 10)
        # Join last up to 10 characters from left stack
        return ''.join(self.left[start:])
```

```javascript
class TextEditor {
  constructor() {
    // Left stack: characters left of cursor
    // Right stack: characters right of cursor
    this.left = [];
    this.right = [];
  }

  // Time: O(k) where k is text length
  // Space: O(1) additional space
  addText(text) {
    // Add each character to left stack (cursor at end)
    for (let ch of text) {
      this.left.push(ch);
    }
  }

  // Time: O(k) where k is min(k, left.length)
  // Space: O(1)
  deleteText(k) {
    let deleted = 0;
    // Delete from end of left stack (backspace)
    while (k > 0 && this.left.length > 0) {
      this.left.pop();
      deleted++;
      k--;
    }
    return deleted;
  }

  // Time: O(k) where k is min(k, left.length)
  // Space: O(1)
  cursorLeft(k) {
    // Move k characters from left to right stack
    while (k > 0 && this.left.length > 0) {
      this.right.push(this.left.pop());
      k--;
    }
    return this._getLastChars();
  }

  // Time: O(k) where k is min(k, right.length)
  // Space: O(1)
  cursorRight(k) {
    // Move k characters from right to left stack
    while (k > 0 && this.right.length > 0) {
      this.left.push(this.right.pop());
      k--;
    }
    return this._getLastChars();
  }

  // Helper to get last up to 10 chars from left stack
  _getLastChars() {
    const start = Math.max(0, this.left.length - 10);
    // Return last up to 10 characters as string
    return this.left.slice(start).join("");
  }
}
```

```java
class TextEditor {
    // Use StringBuilder for efficient stack-like operations
    private StringBuilder left;
    private StringBuilder right;

    // Time: O(1) initialization
    // Space: O(n) for storing characters
    public TextEditor() {
        left = new StringBuilder();
        right = new StringBuilder();
    }

    // Time: O(k) where k is text length
    // Space: O(1) additional
    public void addText(String text) {
        // Append to left (cursor at end of left)
        left.append(text);
    }

    // Time: O(k) where k is min(k, left.length())
    // Space: O(1)
    public int deleteText(int k) {
        int deleted = 0;
        // Delete from end of left (backward from cursor)
        while (k > 0 && left.length() > 0) {
            left.deleteCharAt(left.length() - 1);
            deleted++;
            k--;
        }
        return deleted;
    }

    // Time: O(k) where k is min(k, left.length())
    // Space: O(1)
    public String cursorLeft(int k) {
        // Move characters from left to right
        while (k > 0 && left.length() > 0) {
            // Take last char from left, add to beginning of right
            right.append(left.charAt(left.length() - 1));
            left.deleteCharAt(left.length() - 1);
            k--;
        }
        return getLastChars();
    }

    // Time: O(k) where k is min(k, right.length())
    // Space: O(1)
    public String cursorRight(int k) {
        // Move characters from right to left
        while (k > 0 && right.length() > 0) {
            // Take last char from right, add to end of left
            left.append(right.charAt(right.length() - 1));
            right.deleteCharAt(right.length() - 1);
            k--;
        }
        return getLastChars();
    }

    // Helper to get last up to 10 chars from left
    private String getLastChars() {
        int start = Math.max(0, left.length() - 10);
        // Return substring of last up to 10 characters
        return left.substring(start);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `addText(text)`: O(k) where k is the length of text being added. We append each character to the left stack.
- `deleteText(k)`: O(k) where k is the number of characters to delete (or fewer if left stack has fewer characters).
- `cursorLeft(k)` and `cursorRight(k)`: O(k) where k is the number of positions to move (or fewer if we hit the boundary).
- `_getLastChars()`: O(1) for string building since we only look at up to 10 characters.

**Space Complexity:** O(n) where n is the total number of characters currently in the editor, stored across both stacks.

The key advantage: all operations scale with the number of characters being manipulated (k), not with total text length (n). This makes it efficient even for large numbers of operations.

## Common Mistakes

1. **Using a single string with slicing**: This leads to O(n) operations and O(n²) worst-case time. Candidates might think string concatenation is cheap, but creating new strings each time is expensive.

2. **Forgetting to handle boundary conditions**: When moving cursor left/right or deleting, you must check if there are enough characters. For example, `cursorLeft(100)` when left has only 5 characters should move only 5.

3. **Incorrect stack management**: The cursor is between the two stacks. A common error is to reverse the order when transferring between stacks. Remember: when moving left, the last character of left becomes the first character of right (so we use LIFO order).

4. **Inefficient last 10 characters retrieval**: Some candidates try to maintain a separate string of last 10 chars. This adds complexity. Simply slicing the left stack when needed is cleaner and still O(1) since we only look at up to 10 chars.

## When You'll See This Pattern

The two-stack cursor pattern appears in several editor and text processing problems:

1. **Browser History (LeetCode 1472)**: Similar to having back/forward stacks for URLs. The current page is between two stacks.

2. **Implement Queue using Stacks (LeetCode 232)**: While not exactly the same, it uses two stacks to achieve FIFO order from LIFO structures.

3. **Minimum Add to Make Parentheses Valid (LeetCode 921)**: Uses stack to track unmatched parentheses, similar to how we track characters around cursor.

4. **Removing Stars From a String (LeetCode 2390)**: Uses stack to process backspace-like operations, similar to our delete operation.

The core pattern: **When you need efficient insertion/deletion at a cursor/middle point with bidirectional movement, consider two stacks.**

## Key Takeaways

1. **Cursor as divider**: A cursor naturally splits data into two parts—left and right. Stacks are perfect because cursor operations (add/delete at cursor, move cursor) map to stack operations (push/pop on left, transfer between stacks).

2. **Amortized efficiency matters**: Even though individual operations might be O(k), the total across all operations is O(total characters processed), which is optimal. This is better than O(n) per operation.

3. **Problem decomposition**: Break complex operations into primitive stack operations. Adding text = push to left stack. Deleting = pop from left stack. Moving = pop from one stack, push to the other.

[Practice this problem on CodeJeet](/problem/design-a-text-editor)
