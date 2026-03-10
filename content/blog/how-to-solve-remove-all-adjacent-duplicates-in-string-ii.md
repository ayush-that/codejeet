---
title: "How to Solve Remove All Adjacent Duplicates in String II — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove All Adjacent Duplicates in String II. Medium difficulty, 60.9% acceptance rate. Topics: String, Stack."
date: "2027-07-18"
category: "dsa-patterns"
tags: ["remove-all-adjacent-duplicates-in-string-ii", "string", "stack", "medium"]
---

# How to Solve Remove All Adjacent Duplicates in String II

This problem asks us to repeatedly remove groups of `k` identical adjacent characters from a string until no more removals are possible. What makes this tricky is that removals can create new adjacent duplicates — for example, removing "aaa" from "baaab" leaves "bb", which might then need to be removed. The challenge is to efficiently handle these chain reactions.

## Visual Walkthrough

Let's trace through `s = "deeedbbcccbdaa"` with `k = 3`:

1. Start: `"deeedbbcccbdaa"`
2. First pass: Remove "eee" → `"ddbbcccbdaa"`
3. Second pass: Remove "ccc" → `"ddbbbdaa"`
4. Third pass: Remove "bbb" → `"ddddaa"`
5. Fourth pass: Remove "ddd" (first 3) → `"daa"`
6. Fifth pass: Remove "aa" (not enough for k=3) → `"daa"` (no change)
7. Result: `"daa"`

But here's the catch — if we process left to right naively, we might miss chain reactions. A better approach is to track counts as we go. Let's simulate with a stack approach:

We'll process each character and track how many consecutive occurrences we've seen:

- `d`: count 1
- `e`: count 1
- `e`: count 2
- `e`: count 3 → remove all 3 e's, go back to `d` with count 1
- `d`: count 2
- `b`: count 1
- `b`: count 2
- `c`: count 1
- `c`: count 2
- `c`: count 3 → remove all 3 c's, go back to `b` with count 2
- `b`: count 3 → remove all 3 b's, go back to `d` with count 2
- `d`: count 3 → remove all 3 d's, string is now `"aa"`
- `a`: count 1
- `a`: count 2 (not enough for removal)

Final result: `"aa"` (Wait, this is different from our step-by-step above! Actually, our step-by-step was wrong — let's verify: After removing "eee": `"ddbbcccbdaa"`, then "ccc": `"ddbbbdaa"`, then "bbb": `"ddddaa"`, then "ddd": `"daa"`... but we still have "aa" at the end. So `"daa"` is correct, not `"aa"`. The stack approach gives us the right answer.)

## Brute Force Approach

The most straightforward approach is to repeatedly scan the string, find groups of `k` identical characters, remove them, and repeat until no more removals are possible.

```python
def removeDuplicatesBrute(s: str, k: int) -> str:
    changed = True
    while changed:
        changed = False
        i = 0
        result = []

        while i < len(s):
            # Check if we have k identical characters starting at i
            if i + k <= len(s) and all(s[i] == s[i+j] for j in range(k)):
                i += k  # Skip these k characters
                changed = True
            else:
                result.append(s[i])
                i += 1

        s = ''.join(result)

    return s
```

**Why this is inefficient:**

- Time complexity: O(n²) in worst case. Consider `s = "aaaaaaaaab"` with `k = 2`. Each pass removes only 2 characters, requiring O(n) passes.
- Space complexity: O(n) for the result string, which is acceptable, but the time makes this impractical for large inputs.

The brute force fails because it doesn't efficiently handle chain reactions — each pass requires a full scan, and we might need many passes.

## Optimized Approach

The key insight is that we need to track **consecutive counts** as we process characters. When we see a character that matches the previous one, we increment its count. When the count reaches `k`, we remove that character group. This naturally handles chain reactions because after removal, we're back to the character before the removed group, which might now form a new group with subsequent characters.

A **stack** is perfect for this:

- Store pairs of `(character, consecutive_count)`
- For each new character:
  - If stack is empty or top character ≠ current character: push `(char, 1)`
  - Else (top character = current character): increment count
    - If count = k: pop from stack (remove the group)
- Finally, reconstruct string from stack

This processes the string in **one pass** while efficiently handling removals and chain reactions.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) - we process each character once
# Space: O(n) - stack stores up to n elements in worst case
def removeDuplicates(s: str, k: int) -> str:
    # Stack stores pairs of (character, consecutive_count)
    stack = []

    for char in s:
        # If stack not empty and current char matches top of stack
        if stack and stack[-1][0] == char:
            # Increment the count for this character
            stack[-1][1] += 1

            # If we've reached k consecutive occurrences
            if stack[-1][1] == k:
                stack.pop()  # Remove the entire group
        else:
            # New character or different from top of stack
            stack.append([char, 1])

    # Reconstruct the result string from the stack
    result = []
    for char, count in stack:
        result.append(char * count)  # Append 'char' repeated 'count' times

    return ''.join(result)
```

```javascript
// Time: O(n) - we process each character once
// Space: O(n) - stack stores up to n elements in worst case
function removeDuplicates(s, k) {
  // Stack stores pairs of [character, consecutive_count]
  const stack = [];

  for (let char of s) {
    // If stack not empty and current char matches top of stack
    if (stack.length > 0 && stack[stack.length - 1][0] === char) {
      // Increment the count for this character
      stack[stack.length - 1][1]++;

      // If we've reached k consecutive occurrences
      if (stack[stack.length - 1][1] === k) {
        stack.pop(); // Remove the entire group
      }
    } else {
      // New character or different from top of stack
      stack.push([char, 1]);
    }
  }

  // Reconstruct the result string from the stack
  let result = "";
  for (let [char, count] of stack) {
    result += char.repeat(count); // Append 'char' repeated 'count' times
  }

  return result;
}
```

```java
// Time: O(n) - we process each character once
// Space: O(n) - stack stores up to n elements in worst case
public String removeDuplicates(String s, int k) {
    // Stack stores pairs of character and consecutive count
    // Using int[] where [0] = char, [1] = count
    Stack<int[]> stack = new Stack<>();

    for (char c : s.toCharArray()) {
        // If stack not empty and current char matches top of stack
        if (!stack.isEmpty() && stack.peek()[0] == c) {
            // Increment the count for this character
            stack.peek()[1]++;

            // If we've reached k consecutive occurrences
            if (stack.peek()[1] == k) {
                stack.pop();  // Remove the entire group
            }
        } else {
            // New character or different from top of stack
            stack.push(new int[]{c, 1});
        }
    }

    // Reconstruct the result string from the stack
    StringBuilder result = new StringBuilder();
    for (int[] pair : stack) {
        char c = (char) pair[0];
        int count = pair[1];
        for (int i = 0; i < count; i++) {
            result.append(c);
        }
    }

    return result.toString();
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We process each character exactly once when iterating through the string
- Stack operations (push/pop) are O(1) amortized
- Reconstructing the final string takes O(n) in the worst case

**Space Complexity: O(n)**

- In the worst case (no removals possible), the stack stores all n characters
- The result string also requires O(n) space
- Overall linear space usage

The stack approach is optimal because we must at least examine each character once (Ω(n)), and we use only linear additional space.

## Common Mistakes

1. **Forgetting chain reactions**: Candidates might implement a one-pass solution that doesn't handle cases where removals create new removable groups. Example: `"abbaca"` with `k=2` — removing "bb" creates "aa" which should also be removed. The stack approach naturally handles this.

2. **Incorrect count resetting**: When seeing a different character, it's crucial to reset the count to 1, not continue from the previous count. The stack approach handles this by starting a new stack entry.

3. **Inefficient string reconstruction**: Some candidates modify the original string in-place or use string concatenation in a loop (which is O(n²) in some languages due to string immutability). Always build the result efficiently (list + join in Python, StringBuilder in Java).

4. **Off-by-one errors with k**: Remember that we remove when count _equals_ k, not when it exceeds k. Also, k=1 is a valid input (though trivial — it would remove all characters).

## When You'll See This Pattern

The "stack with counts" pattern appears in problems where you need to process elements while maintaining context about previous elements, especially when removals/merges can chain:

1. **Remove All Adjacent Duplicates In String (Easy)**: The simpler version with k=2. Same stack approach works.
2. **Decode String (Medium)**: Uses stack to handle nested repetitions like `3[a2[c]]`.
3. **Simplify Path (Medium)**: Uses stack to process directory components and handle ".." operations.
4. **Asteroid Collision (Medium)**: Uses stack to simulate collisions where asteroids cancel each other out.

The pattern is: when processing sequential data where the result depends on recent history and operations can cascade, consider a stack.

## Key Takeaways

- **Stack with auxiliary data** is powerful: When you need to track not just elements but also metadata (like counts), store pairs/tuples in the stack.
- **One-pass is possible with the right DS**: Problems that seem to require multiple passes can often be solved in one pass with a stack or similar structure.
- **Chain reactions are natural with stacks**: The LIFO property of stacks makes them ideal for problems where operations affect the most recent elements and can trigger further operations.

Related problems: [Remove All Adjacent Duplicates In String](/problem/remove-all-adjacent-duplicates-in-string), [Replace Non-Coprime Numbers in Array](/problem/replace-non-coprime-numbers-in-array), [Minimize String Length](/problem/minimize-string-length)
