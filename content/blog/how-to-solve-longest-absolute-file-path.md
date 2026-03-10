---
title: "How to Solve Longest Absolute File Path — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Longest Absolute File Path. Medium difficulty, 49.2% acceptance rate. Topics: String, Stack, Depth-First Search."
date: "2026-03-31"
category: "dsa-patterns"
tags: ["longest-absolute-file-path", "string", "stack", "depth-first-search", "medium"]
---

# How to Solve Longest Absolute File Path

This problem asks us to find the length of the longest absolute file path in a simulated file system represented by a string. The tricky part is parsing the special string format where `\t` indicates nesting depth and `\n` separates entries. We need to track directory depths and calculate absolute path lengths efficiently.

## Visual Walkthrough

Let's trace through a concrete example:  
Input: `"dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext"`

This represents:

```
dir
    subdir1
    subdir2
        file.ext
```

**Step-by-step parsing:**

1. Start with `"dir"` (depth 0, length 3) - it's a directory
2. `"\n\t"` signals new entry at depth 1: `"subdir1"` (total length = depth 0 length + 1 slash + 7 = 3 + 1 + 7 = 11)
3. `"\n\t"` signals new entry at depth 1: `"subdir2"` (total length = 3 + 1 + 8 = 12)
4. `"\n\t\t"` signals new entry at depth 2: `"file.ext"` (total length = depth 1 length + 1 slash + 8 = 12 + 1 + 8 = 21)

Since `"file.ext"` is a file (contains `.`), we check if 21 > current max. It is, so max = 21.

The key insight: when we see a new entry, we need to know the total length of its parent directory's path. We can track this using a stack or array where `stack[depth]` stores the cumulative path length up to that depth.

## Brute Force Approach

A naive approach might try to:

1. Split the input by `\n` to get all entries
2. For each entry, count tabs to determine depth
3. Reconstruct the full path by finding all ancestors
4. Calculate the length if it's a file

This would require O(n²) time in the worst case because for each file, we'd need to traverse back through all previous entries to find its ancestors. For deeply nested structures with many files, this becomes inefficient.

The main issue is repeatedly recalculating path lengths. Each time we process an entry, we shouldn't need to recompute everything from scratch.

## Optimized Approach

The optimal solution uses a **depth-length tracking array**:

**Key Insight:** The total path length to any entry at depth `d` equals:

```
length_to_parent_at_depth_(d-1) + 1 (for '/') + length_of_current_name
```

We can maintain an array `lengths` where `lengths[depth]` stores the total path length up to that depth (including slashes between components).

**Algorithm:**

1. Split the input by `\n` to process each entry separately
2. For each entry:
   - Count leading tabs to determine depth (each `\t` = depth + 1)
   - Calculate the actual name length (total length minus tabs)
   - If it's a file (contains `.`), calculate total path length:
     - `lengths[depth-1] + name_length + depth` (the `+ depth` accounts for slashes between components)
     - Update max length if larger
   - If it's a directory:
     - Store `lengths[depth] = lengths[depth-1] + name_length`
     - This becomes the base for deeper entries

**Why this works:**  
Directories establish the base path for their contents. When we finish processing a directory's contents, deeper entries will overwrite the `lengths` array at their depth, which correctly reflects that we've moved to a different branch of the file system.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n) where n is the length of the input string
# Space: O(d) where d is the maximum depth of the file system
def lengthLongestPath(input: str) -> int:
    """
    Calculate the longest absolute path to a file in the given string representation.

    The input uses '\t' for indentation (depth) and '\n' to separate entries.
    We track cumulative path lengths at each depth using a list.
    """
    # Split the input by newlines to process each file/directory separately
    entries = input.split('\n')

    # Store cumulative path lengths at each depth
    # lengths[depth] = total length of path up to that depth
    lengths = [0] * (len(entries) + 1)  # +1 to handle depth 0 safely
    max_length = 0

    for entry in entries:
        # Count tabs to determine depth (each \t = one level deeper)
        # last_tab_index finds the last occurrence of \t, +1 gives us the depth
        depth = entry.count('\t')

        # Actual name length (excluding tabs)
        # Each \t is one character we need to exclude from length calculation
        name_length = len(entry) - depth

        if '.' in entry:  # It's a file
            # Total path length = parent directory length + name length + slashes
            # The '+ depth' accounts for '/' between each directory level
            current_length = lengths[depth] + name_length + depth
            max_length = max(max_length, current_length)
        else:  # It's a directory
            # Store the cumulative length for this depth
            # This will be used by files/subdirectories inside this directory
            # +1 accounts for the slash that will be added before the next component
            lengths[depth + 1] = lengths[depth] + name_length

    return max_length
```

```javascript
// Time: O(n) where n is the length of the input string
// Space: O(d) where d is the maximum depth of the file system
function lengthLongestPath(input) {
  /**
   * Calculate the longest absolute path to a file in the given string representation.
   *
   * The input uses '\t' for indentation (depth) and '\n' to separate entries.
   * We track cumulative path lengths at each depth using an array.
   */

  // Split the input by newlines to process each file/directory separately
  const entries = input.split("\n");

  // Store cumulative path lengths at each depth
  // lengths[depth] = total length of path up to that depth
  const lengths = new Array(entries.length + 1).fill(0); // +1 to handle depth 0 safely
  let maxLength = 0;

  for (const entry of entries) {
    // Count tabs to determine depth (each \t = one level deeper)
    // lastIndexOf('\t') finds the last occurrence, +1 gives us the depth
    const depth = (entry.match(/\t/g) || []).length;

    // Actual name length (excluding tabs)
    // Each \t is one character we need to exclude from length calculation
    const nameLength = entry.length - depth;

    if (entry.includes(".")) {
      // It's a file
      // Total path length = parent directory length + name length + slashes
      // The '+ depth' accounts for '/' between each directory level
      const currentLength = lengths[depth] + nameLength + depth;
      maxLength = Math.max(maxLength, currentLength);
    } else {
      // It's a directory
      // Store the cumulative length for this depth
      // This will be used by files/subdirectories inside this directory
      // +1 accounts for the slash that will be added before the next component
      lengths[depth + 1] = lengths[depth] + nameLength;
    }
  }

  return maxLength;
}
```

```java
// Time: O(n) where n is the length of the input string
// Space: O(d) where d is the maximum depth of the file system
class Solution {
    public int lengthLongestPath(String input) {
        /**
         * Calculate the longest absolute path to a file in the given string representation.
         *
         * The input uses '\t' for indentation (depth) and '\n' to separate entries.
         * We track cumulative path lengths at each depth using an array.
         */

        // Split the input by newlines to process each file/directory separately
        String[] entries = input.split("\n");

        // Store cumulative path lengths at each depth
        // lengths[depth] = total length of path up to that depth
        int[] lengths = new int[entries.length + 1]; // +1 to handle depth 0 safely
        int maxLength = 0;

        for (String entry : entries) {
            // Count tabs to determine depth (each \t = one level deeper)
            // lastIndexOf('\t') finds the last occurrence, +1 gives us the depth
            int depth = 0;
            while (depth < entry.length() && entry.charAt(depth) == '\t') {
                depth++;
            }

            // Actual name length (excluding tabs)
            // Each \t is one character we need to exclude from length calculation
            int nameLength = entry.length() - depth;

            if (entry.contains(".")) { // It's a file
                // Total path length = parent directory length + name length + slashes
                // The '+ depth' accounts for '/' between each directory level
                int currentLength = lengths[depth] + nameLength + depth;
                maxLength = Math.max(maxLength, currentLength);
            } else { // It's a directory
                // Store the cumulative length for this depth
                // This will be used by files/subdirectories inside this directory
                // +1 accounts for the slash that will be added before the next component
                lengths[depth + 1] = lengths[depth] + nameLength;
            }
        }

        return maxLength;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We split the string by `\n`, which takes O(n) time
- We process each entry once, performing constant-time operations (counting tabs, checking for `.`, updating arrays)
- The total operations are proportional to the input length

**Space Complexity: O(d)** where d is the maximum depth

- We maintain a `lengths` array of size O(d)
- In the worst case, d could be O(n) if every entry is at a new depth, but typically d is much smaller than n
- The split array also uses O(n) space, but this is for processing and could be optimized to O(1) with careful parsing

## Common Mistakes

1. **Forgetting to account for slashes in path length calculation**  
   Many candidates calculate `parent_length + name_length` but forget that between each directory level, there's a `/` character. That's why we need `+ depth` when calculating file paths.

2. **Incorrect depth calculation**  
   Using `entry.count('\t')` is correct, but some try `entry.lastIndexOf('\t') + 1` which works but can be error-prone with edge cases. The count approach is more straightforward.

3. **Not resetting lengths array for different branches**  
   When we move from one directory branch to another at the same depth, we need to overwrite the old value. Our solution handles this correctly because `lengths[depth + 1]` is reassigned for each new directory at that depth.

4. **Assuming all entries with '.' are files**  
   While the problem states that files contain `.` and an extension, and directories don't contain `.`, in a real interview you might want to clarify this assumption. For this problem, it's safe to use `.` as the file indicator.

## When You'll See This Pattern

This problem uses **depth tracking with cumulative values**, a pattern seen in:

1. **Simplify Path (LeetCode 71)** - Also processes path strings with directory navigation, though it uses a stack for different operations.

2. **Decode String (LeetCode 394)** - Uses similar depth tracking for nested structures, but with brackets instead of tabs.

3. **Basic Calculator (LeetCode 224)** - Tracks nesting depth for parentheses, maintaining context at each level.

The core pattern is maintaining context (in this case, path length) at each depth level, updating it as we traverse, and using it to compute results for nested elements.

## Key Takeaways

1. **When processing hierarchical/nested structures**, consider using an array or stack to track state at each depth level. The index represents depth, and the value represents cumulative information up to that point.

2. **For string parsing problems with special delimiters**, carefully count the delimiters (like `\t`) to determine structure, then process the actual content separately.

3. **The "+ depth" trick for counting separators** is a useful pattern: when you have N components, you need N-1 separators between them. For files at depth d, there are d slashes in the full path.

[Practice this problem on CodeJeet](/problem/longest-absolute-file-path)
