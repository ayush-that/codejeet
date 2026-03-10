---
title: "How to Solve Design Browser History — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Design Browser History. Medium difficulty, 78.2% acceptance rate. Topics: Array, Linked List, Stack, Design, Doubly-Linked List."
date: "2027-11-07"
category: "dsa-patterns"
tags: ["design-browser-history", "array", "linked-list", "stack", "medium"]
---

## How to Solve Design Browser History

This problem asks you to implement a browser history system that supports visiting new URLs, going back a certain number of steps, and going forward a certain number of steps. What makes this interesting is that when you visit a new URL after going back in history, all forward history should be cleared — exactly like real browser behavior. The challenge is designing a data structure that efficiently handles these operations while maintaining the correct history state.

## Visual Walkthrough

Let's trace through an example to build intuition:

```
1. Start at "leetcode.com"
2. Visit "google.com"       → History: ["leetcode.com", "google.com"], current index: 1
3. Visit "facebook.com"     → History: ["leetcode.com", "google.com", "facebook.com"], current index: 2
4. Visit "youtube.com"      → History: ["leetcode.com", "google.com", "facebook.com", "youtube.com"], current index: 3
5. Back 2 steps            → Go to "google.com", current index: 1
6. Visit "linkedin.com"     → Clear forward history, add new URL
   History becomes: ["leetcode.com", "google.com", "linkedin.com"], current index: 2
7. Forward 2 steps         → Can only go forward 0 steps (no forward history), stay at "linkedin.com"
8. Back 2 steps            → Go to "leetcode.com", current index: 0
9. Forward 1 step          → Go to "google.com", current index: 1
```

The key insight: when we visit a new URL after going back, we need to discard all URLs that were ahead of our current position. This is why a simple array with a current index works well — we can truncate the array at the current position when adding a new URL.

## Brute Force Approach

A naive approach might use two stacks: one for back history and one for forward history. When visiting a new page, push the current page to the back stack. When going back, pop from back stack and push to forward stack. However, this becomes problematic when we need to go back/forward multiple steps — we'd need to pop/push multiple times, making those operations O(steps) instead of O(1).

Another naive approach: store all visited URLs in a list and track current index. For `visit(url)`, append the URL and update index. For `back(steps)` and `forward(steps)`, move the index accordingly. This seems reasonable, but the issue is memory — we never remove URLs even when they're no longer reachable. More importantly, it doesn't correctly handle the requirement that visiting a new URL should clear forward history. We'd need to somehow mark or remove those forward URLs.

## Optimized Approach

The optimal solution uses a simple array (or list) with a current index and a maximum valid index. Here's the key insight:

1. **Use a list to store history** and an integer `curr` to track current position
2. **Maintain a `max` variable** that tracks the last valid index in history
3. **When visiting a new URL**:
   - If we're at the end of history (`curr == max`), simply append and increment both
   - If we're in the middle of history (after going back), set `curr += 1`, overwrite `history[curr]` with the new URL, and set `max = curr` (this discards forward history)
4. **When going back/forward**: simply adjust `curr` within bounds [0, max]

This approach gives us O(1) time for all operations and O(n) space where n is the number of visited pages. The clever part is that we reuse the array slots when overwriting forward history, avoiding expensive array resizing or shifting.

## Optimal Solution

Here's the complete implementation using the array approach:

<div class="code-group">

```python
class BrowserHistory:
    # Time: O(1) for all operations | Space: O(n) where n is number of visited pages
    def __init__(self, homepage: str):
        # Initialize history with homepage as the first page
        self.history = [homepage]
        # Current page index
        self.curr = 0
        # Last valid index in history (forward history beyond this is cleared)
        self.max = 0

    def visit(self, url: str) -> None:
        # Move to next position for new URL
        self.curr += 1

        # If we're within bounds, overwrite current position (clears forward history)
        if self.curr < len(self.history):
            self.history[self.curr] = url
        else:
            # Otherwise append to end
            self.history.append(url)

        # Update max to current position (forward history is now empty)
        self.max = self.curr

    def back(self, steps: int) -> str:
        # Calculate new position, ensuring we don't go below 0
        self.curr = max(0, self.curr - steps)
        return self.history[self.curr]

    def forward(self, steps: int) -> str:
        # Calculate new position, ensuring we don't go beyond max
        self.curr = min(self.max, self.curr + steps)
        return self.history[self.curr]
```

```javascript
class BrowserHistory {
  // Time: O(1) for all operations | Space: O(n) where n is number of visited pages
  constructor(homepage) {
    // Initialize history with homepage as the first page
    this.history = [homepage];
    // Current page index
    this.curr = 0;
    // Last valid index in history (forward history beyond this is cleared)
    this.max = 0;
  }

  visit(url) {
    // Move to next position for new URL
    this.curr++;

    // If we're within bounds, overwrite current position (clears forward history)
    if (this.curr < this.history.length) {
      this.history[this.curr] = url;
    } else {
      // Otherwise append to end
      this.history.push(url);
    }

    // Update max to current position (forward history is now empty)
    this.max = this.curr;
  }

  back(steps) {
    // Calculate new position, ensuring we don't go below 0
    this.curr = Math.max(0, this.curr - steps);
    return this.history[this.curr];
  }

  forward(steps) {
    // Calculate new position, ensuring we don't go beyond max
    this.curr = Math.min(this.max, this.curr + steps);
    return this.history[this.curr];
  }
}
```

```java
class BrowserHistory {
    // Time: O(1) for all operations | Space: O(n) where n is number of visited pages
    private List<String> history;
    private int curr;
    private int max;

    public BrowserHistory(String homepage) {
        // Initialize history with homepage as the first page
        history = new ArrayList<>();
        history.add(homepage);
        // Current page index
        curr = 0;
        // Last valid index in history (forward history beyond this is cleared)
        max = 0;
    }

    public void visit(String url) {
        // Move to next position for new URL
        curr++;

        // If we're within bounds, overwrite current position (clears forward history)
        if (curr < history.size()) {
            history.set(curr, url);
        } else {
            // Otherwise append to end
            history.add(url);
        }

        // Update max to current position (forward history is now empty)
        max = curr;
    }

    public String back(int steps) {
        // Calculate new position, ensuring we don't go below 0
        curr = Math.max(0, curr - steps);
        return history.get(curr);
    }

    public String forward(int steps) {
        // Calculate new position, ensuring we don't go beyond max
        curr = Math.min(max, curr + steps);
        return history.get(curr);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:**

- `visit(url)`: O(1) — we either append to the array or overwrite an existing position
- `back(steps)`: O(1) — we just calculate and update the current index
- `forward(steps)`: O(1) — same as back operation

**Space Complexity:** O(n) where n is the maximum number of pages in history at any point. In the worst case, if we never go back and only visit new pages, we store all visited URLs.

## Common Mistakes

1. **Forgetting to clear forward history on visit**: After going back and then visiting a new URL, candidates often append without removing forward history. This violates browser behavior. The fix: when visiting after going back, overwrite the next position instead of appending.

2. **Using two stacks incorrectly**: Some candidates implement with two stacks but struggle with multiple steps. Going back k steps requires popping k times, making it O(k) instead of O(1). The array approach gives constant time regardless of steps.

3. **Off-by-one errors with indices**: When calculating new positions for back/forward, it's easy to miscalculate bounds. Always test with edge cases: back more steps than available, forward more steps than available.

4. **Not handling the max bound correctly**: The `max` variable must be updated on every visit. Forgetting this means forward() might allow going to invalid positions that were previously cleared.

## When You'll See This Pattern

This "array with current pointer and max valid index" pattern appears in several scenarios:

1. **Undo/Redo functionality**: Similar to browser history, text editors need to support undo (back) and redo (forward) operations, with new actions clearing the redo stack.

2. **Media players with seek/playlist navigation**: Moving through a playlist while being able to add new songs (which clears forward queue).

3. **Related LeetCode problems**:
   - **1472. Design Browser History**: This exact problem
   - **716. Max Stack**: Maintaining maximum element with stack operations
   - **1381. Design a Stack With Increment Operation**: Custom stack with special operations
   - **Design Video Sharing Platform**: A harder variant with additional features

## Key Takeaways

1. **Arrays with pointers are powerful**: When you need random access with a current position and the ability to truncate, an array with index tracking is often simpler than linked lists or stacks.

2. **Overwriting instead of deleting**: When you need to "clear forward history," overwriting array positions is more efficient than actually removing elements, which would require shifting.

3. **Test edge cases thoroughly**: Always test: visiting after going back, going back/forward more steps than available, and consecutive visits without navigation.

Related problems: [Design Video Sharing Platform](/problem/design-video-sharing-platform)
