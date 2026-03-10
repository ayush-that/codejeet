---
title: "How to Solve Simplify Path — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Simplify Path. Medium difficulty, 50.0% acceptance rate. Topics: String, Stack."
date: "2026-08-19"
category: "dsa-patterns"
tags: ["simplify-path", "string", "stack", "medium"]
---

# How to Solve Simplify Path

This problem asks us to convert an absolute Unix-style file path into its simplest canonical form. What makes this interesting is that while the rules are straightforward (`.` means current directory, `..` means parent directory, multiple slashes should be reduced), implementing them correctly requires careful parsing and handling of edge cases. The challenge lies in processing the path components in the correct order while maintaining directory hierarchy.

## Visual Walkthrough

Let's trace through an example: `/a/./b/../../c/`

1. **Split by `/`**: We get `["", "a", ".", "b", "..", "..", "c", ""]`
   - The empty strings at start/end come from leading/trailing slashes
   - We'll ignore empty strings and single dots

2. **Process each component**:
   - `"a"` → valid directory name, keep it
   - `"."` → current directory, ignore it
   - `"b"` → valid directory name, keep it
   - `".."` → go up one level, remove `"b"` from our path
   - `".."` → go up another level, remove `"a"` from our path
   - `"c"` → valid directory name, keep it

3. **Current path**: `["c"]`

4. **Reconstruct**: Join with `/` and add leading slash → `/c`

The key insight: when we encounter `..`, we need to remove the most recent directory we added. This suggests a **stack** data structure would be perfect for this problem.

## Brute Force Approach

A naive approach might try to manipulate the string directly without using a stack. For example:

1. Replace all `//` with `/` repeatedly
2. Replace `/./` with `/` repeatedly
3. When encountering `/../`, try to find and remove the preceding directory

The problem with this string manipulation approach is that it becomes complex to handle nested `..` operations correctly. For `/a/b/../c/../../d`:

- First `..` should remove `b` → `/a/c/../../d`
- Next `..` should remove `c` → `/a/../d`
- Final `..` should remove `a` → `/d`

Trying to do this with string operations requires repeatedly scanning and modifying the string, which is inefficient (O(n²) in worst case) and error-prone. The main issue is that we need to track the directory hierarchy in LIFO (Last-In-First-Out) order, which string operations don't naturally support.

## Optimized Approach

The optimal solution uses a **stack** to track the directory hierarchy:

1. **Split the path** by `/` to get individual components
2. **Process each component**:
   - If it's empty or `.`, skip it (no effect on path)
   - If it's `..`, pop from stack if stack isn't empty (go up one level)
   - Otherwise, it's a valid directory name → push onto stack
3. **Reconstruct** the path by joining stack elements with `/`

Why a stack works perfectly:

- Directories are nested hierarchically
- `..` needs to remove the most recently added directory (LIFO)
- We can easily ignore irrelevant components (`.` and empty strings)
- At the end, we simply join what remains in proper order

The stack gives us O(1) operations for adding/removing directories and maintains the correct order for reconstruction.

## Optimal Solution

Here's the complete implementation using a stack approach:

<div class="code-group">

```python
# Time: O(n) where n is the length of the path
# Space: O(n) for the stack in worst case
def simplifyPath(path: str) -> str:
    """
    Simplify a Unix-style absolute path to its canonical form.

    Steps:
    1. Split the path by '/' to get individual components
    2. Use a stack to track valid directory names
    3. Process each component:
       - Skip empty strings and '.' (current directory)
       - For '..', go up one level by popping from stack if possible
       - Otherwise, treat as directory name and push onto stack
    4. Join stack contents with '/' and add leading slash
    """
    # Split the path into components
    components = path.split('/')
    stack = []

    for component in components:
        # Skip empty strings and current directory markers
        if component == '' or component == '.':
            continue

        # Handle parent directory navigation
        if component == '..':
            # Go up one level by removing last directory if stack isn't empty
            if stack:
                stack.pop()
        else:
            # Valid directory name, add to path
            stack.append(component)

    # Reconstruct the canonical path
    # Join with '/' and ensure leading slash
    return '/' + '/'.join(stack)
```

```javascript
// Time: O(n) where n is the length of the path
// Space: O(n) for the stack in worst case
/**
 * Simplify a Unix-style absolute path to its canonical form.
 *
 * Steps:
 * 1. Split the path by '/' to get individual components
 * 2. Use a stack to track valid directory names
 * 3. Process each component:
 *    - Skip empty strings and '.' (current directory)
 *    - For '..', go up one level by popping from stack if possible
 *    - Otherwise, treat as directory name and push onto stack
 * 4. Join stack contents with '/' and add leading slash
 */
function simplifyPath(path) {
  // Split the path into components
  const components = path.split("/");
  const stack = [];

  for (const component of components) {
    // Skip empty strings and current directory markers
    if (component === "" || component === ".") {
      continue;
    }

    // Handle parent directory navigation
    if (component === "..") {
      // Go up one level by removing last directory if stack isn't empty
      if (stack.length > 0) {
        stack.pop();
      }
    } else {
      // Valid directory name, add to path
      stack.push(component);
    }
  }

  // Reconstruct the canonical path
  // Join with '/' and ensure leading slash
  return "/" + stack.join("/");
}
```

```java
// Time: O(n) where n is the length of the path
// Space: O(n) for the stack in worst case
import java.util.*;

class Solution {
    /**
     * Simplify a Unix-style absolute path to its canonical form.
     *
     * Steps:
     * 1. Split the path by '/' to get individual components
     * 2. Use a stack to track valid directory names
     * 3. Process each component:
     *    - Skip empty strings and '.' (current directory)
     *    - For '..', go up one level by popping from stack if possible
     *    - Otherwise, treat as directory name and push onto stack
     * 4. Join stack contents with '/' and add leading slash
     */
    public String simplifyPath(String path) {
        // Split the path into components
        String[] components = path.split("/");
        Deque<String> stack = new ArrayDeque<>();

        for (String component : components) {
            // Skip empty strings and current directory markers
            if (component.equals("") || component.equals(".")) {
                continue;
            }

            // Handle parent directory navigation
            if (component.equals("..")) {
                // Go up one level by removing last directory if stack isn't empty
                if (!stack.isEmpty()) {
                    stack.pop();
                }
            } else {
                // Valid directory name, add to path
                stack.push(component);
            }
        }

        // Reconstruct the canonical path
        StringBuilder result = new StringBuilder();

        // Since we used a stack (LIFO), we need to reverse to get correct order
        // Or we can use the stack as a list by iterating in reverse
        List<String> directories = new ArrayList<>(stack);
        Collections.reverse(directories);

        // Build the result path
        for (String dir : directories) {
            result.append("/").append(dir);
        }

        // Handle case where stack was empty - should return "/"
        return result.length() > 0 ? result.toString() : "/";
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- Splitting the string takes O(n) where n is the length of the path
- Processing each component takes O(n) in total
- Joining the final result takes O(n)
- Overall linear time complexity

**Space Complexity: O(n)**

- The stack can contain up to O(n) elements in worst case (e.g., no `..` operations)
- The split components array also uses O(n) space
- In practice, we could process components without storing all of them, but the stack still needs O(n) space

## Common Mistakes

1. **Forgetting to handle consecutive slashes**: When splitting by `/`, consecutive slashes produce empty strings. These must be ignored, not treated as directory names.

2. **Incorrect handling of `..` at root**: When at root directory `/`, `..` should have no effect (can't go above root). Some implementations incorrectly try to pop from an empty stack, causing errors.

3. **Wrong order when reconstructing path**: If using a true stack (LIFO), the directories come out in reverse order. Need to reverse them or use a list/array as a stack by appending to end and popping from end.

4. **Missing leading slash**: The canonical path must start with `/`. Forgetting to add it when the stack is empty results in empty string instead of `/`.

5. **Overcomplicating with regex**: Some candidates try to use complex regex patterns to handle all cases at once. This is fragile and harder to debug than the simple stack approach.

## When You'll See This Pattern

The stack-based approach for processing hierarchical structures appears in several problems:

1. **Valid Parentheses (LeetCode 20)**: Similar concept of using a stack to match opening/closing brackets, where `(` is like entering a directory and `)` is like `..`.

2. **Decode String (LeetCode 394)**: Uses stacks to handle nested structures and repetition, similar to how we handle nested directory navigation.

3. **Basic Calculator II (LeetCode 227)**: While not identical, it uses stacks to handle operator precedence, which is analogous to processing operations in correct order.

4. **File system traversal problems**: Any problem involving directory navigation, path validation, or tree traversal can benefit from similar stack-based thinking.

## Key Takeaways

1. **Stacks are ideal for LIFO operations**: When you need to process elements in reverse order of addition (like `..` removing the most recent directory), think stack.

2. **Split and process is cleaner than string manipulation**: For path/string parsing problems, splitting into tokens and processing each one is often cleaner and less error-prone than complex string operations.

3. **Edge cases matter**: Empty paths, root directory, multiple slashes, and trailing slashes are common pitfalls. Always test with: `/`, `/../`, `/home//foo/`, and `/a/./b/../../c/`.

[Practice this problem on CodeJeet](/problem/simplify-path)
