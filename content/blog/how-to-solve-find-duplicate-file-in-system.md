---
title: "How to Solve Find Duplicate File in System — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Find Duplicate File in System. Medium difficulty, 67.6% acceptance rate. Topics: Array, Hash Table, String."
date: "2026-05-09"
category: "dsa-patterns"
tags: ["find-duplicate-file-in-system", "array", "hash-table", "string", "medium"]
---

# How to Solve Find Duplicate File in System

This problem asks us to identify duplicate files across a file system based on their content, not just their names. Given a list of directory paths with their contained files and content, we need to return groups of files that have identical content. The challenge lies in efficiently grouping files by their content across potentially thousands of files and directories.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:**

```
paths = [
    "root/a 1.txt(abcd) 2.txt(efgh)",
    "root/c 3.txt(abcd)",
    "root/c/d 4.txt(efgh)",
    "root 5.txt(efgh)"
]
```

**Step 1: Parse the first directory "root/a"**

- Directory path: "root/a"
- Files:
  - "1.txt" with content "abcd" → Full path: "root/a/1.txt"
  - "2.txt" with content "efgh" → Full path: "root/a/2.txt"

**Step 2: Parse the second directory "root/c"**

- Directory path: "root/c"
- Files:
  - "3.txt" with content "abcd" → Full path: "root/c/3.txt"

**Step 3: Parse the third directory "root/c/d"**

- Directory path: "root/c/d"
- Files:
  - "4.txt" with content "efgh" → Full path: "root/c/d/4.txt"

**Step 4: Parse the fourth directory "root"**

- Directory path: "root"
- Files:
  - "5.txt" with content "efgh" → Full path: "root/5.txt"

**Step 5: Group by content**

- Content "abcd": ["root/a/1.txt", "root/c/3.txt"]
- Content "efgh": ["root/a/2.txt", "root/c/d/4.txt", "root/5.txt"]

**Step 6: Filter groups with at least 2 files**
Both groups have at least 2 files, so we return both.

**Output:**

```
[
    ["root/a/1.txt", "root/c/3.txt"],
    ["root/a/2.txt", "root/c/d/4.txt", "root/5.txt"]
]
```

## Brute Force Approach

A naive approach would be to compare every file's content with every other file's content. For each file, we could:

1. Extract its content string
2. Compare it with all other files' content strings
3. Group files with identical content

The problem with this approach is efficiency. If we have `n` files, we'd need to make `O(n²)` comparisons. Additionally, comparing content strings directly could be expensive if files are large (though in this problem, content is given as a string in parentheses).

Even worse, we'd need to store all content strings and repeatedly compare them. This becomes impractical with thousands of files. The brute force approach doesn't leverage the fact that we can use content as a key to group files efficiently.

## Optimized Approach

The key insight is that we can use a **hash map** to group files by their content. Instead of comparing each file with every other file, we can:

1. **Parse each path string** to extract:
   - The directory path
   - Each file name and its content
2. **Build the full file path** by combining directory path and file name

3. **Use content as a key** in a hash map to group files:
   - Key: file content string
   - Value: list of full file paths with that content

4. **Filter the results** to only include groups with at least 2 files (duplicates)

This approach is efficient because:

- Parsing each path is O(length of path string)
- Hash map operations (insert and lookup) are O(1) on average
- We only need to process each file once

The critical realization is that content acts as a natural grouping key. Files with identical content will hash to the same value, allowing us to collect them together without expensive pairwise comparisons.

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * m) where n is number of paths, m is average length of each path
# Space: O(n * m) for storing the file paths in the hash map
def findDuplicate(paths):
    """
    Finds duplicate files in the system based on their content.

    Args:
        paths: List of strings where each string contains directory path
               followed by file names with content in parentheses

    Returns:
        List of lists, where each inner list contains paths of files
        with identical content (only groups with at least 2 files)
    """
    # Step 1: Create a hash map to group files by content
    # Key: file content (string inside parentheses)
    # Value: list of full file paths with that content
    content_map = {}

    # Step 2: Process each directory info string
    for path_info in paths:
        # Split the string into parts: first part is directory, rest are files
        parts = path_info.split()

        # The first part is always the directory path
        directory = parts[0]

        # Process each file in this directory
        for file_info in parts[1:]:
            # Find the position of '(' which separates filename from content
            # Example: "1.txt(abcd)" -> split at '('
            open_paren_idx = file_info.find('(')

            # Extract filename (everything before '(')
            filename = file_info[:open_paren_idx]

            # Extract content (everything between '(' and ')')
            # We use -1 to exclude the closing parenthesis
            content = file_info[open_paren_idx + 1:-1]

            # Build the full file path: directory + '/' + filename
            full_path = directory + '/' + filename

            # Step 3: Group files by content in the hash map
            # If this content hasn't been seen before, create a new list
            if content not in content_map:
                content_map[content] = []

            # Add the full path to the list for this content
            content_map[content].append(full_path)

    # Step 4: Filter and return only groups with at least 2 files (duplicates)
    # We use list comprehension to filter the hash map values
    return [group for group in content_map.values() if len(group) > 1]
```

```javascript
// Time: O(n * m) where n is number of paths, m is average length of each path
// Space: O(n * m) for storing the file paths in the hash map
function findDuplicate(paths) {
  /**
   * Finds duplicate files in the system based on their content.
   *
   * @param {string[]} paths - Array of strings where each string contains
   *                          directory path followed by file names with content
   * @return {string[][]} - Array of arrays, where each inner array contains
   *                       paths of files with identical content
   */

  // Step 1: Create a Map to group files by content
  // Key: file content (string inside parentheses)
  // Value: array of full file paths with that content
  const contentMap = new Map();

  // Step 2: Process each directory info string
  for (const pathInfo of paths) {
    // Split the string into parts: first part is directory, rest are files
    const parts = pathInfo.split(" ");

    // The first part is always the directory path
    const directory = parts[0];

    // Process each file in this directory (skip the first element which is directory)
    for (let i = 1; i < parts.length; i++) {
      const fileInfo = parts[i];

      // Find the position of '(' which separates filename from content
      const openParenIdx = fileInfo.indexOf("(");

      // Extract filename (everything before '(')
      const filename = fileInfo.substring(0, openParenIdx);

      // Extract content (everything between '(' and ')')
      // We exclude the closing parenthesis by using length - 1
      const content = fileInfo.substring(openParenIdx + 1, fileInfo.length - 1);

      // Build the full file path: directory + '/' + filename
      const fullPath = directory + "/" + filename;

      // Step 3: Group files by content in the Map
      // If this content hasn't been seen before, create a new array
      if (!contentMap.has(content)) {
        contentMap.set(content, []);
      }

      // Add the full path to the array for this content
      contentMap.get(content).push(fullPath);
    }
  }

  // Step 4: Filter and return only groups with at least 2 files (duplicates)
  // Convert Map values to array and filter by length
  const result = [];
  for (const group of contentMap.values()) {
    if (group.length > 1) {
      result.push(group);
    }
  }

  return result;
}
```

```java
// Time: O(n * m) where n is number of paths, m is average length of each path
// Space: O(n * m) for storing the file paths in the hash map
import java.util.*;

class Solution {
    public List<List<String>> findDuplicate(String[] paths) {
        /**
         * Finds duplicate files in the system based on their content.
         *
         * @param paths: Array of strings where each string contains directory path
         *              followed by file names with content in parentheses
         * @return List of lists, where each inner list contains paths of files
         *         with identical content (only groups with at least 2 files)
         */

        // Step 1: Create a hash map to group files by content
        // Key: file content (string inside parentheses)
        // Value: list of full file paths with that content
        Map<String, List<String>> contentMap = new HashMap<>();

        // Step 2: Process each directory info string
        for (String pathInfo : paths) {
            // Split the string into parts: first part is directory, rest are files
            String[] parts = pathInfo.split(" ");

            // The first part is always the directory path
            String directory = parts[0];

            // Process each file in this directory (skip the first element which is directory)
            for (int i = 1; i < parts.length; i++) {
                String fileInfo = parts[i];

                // Find the position of '(' which separates filename from content
                int openParenIdx = fileInfo.indexOf('(');

                // Extract filename (everything before '(')
                String filename = fileInfo.substring(0, openParenIdx);

                // Extract content (everything between '(' and ')')
                // We exclude the closing parenthesis
                String content = fileInfo.substring(openParenIdx + 1, fileInfo.length() - 1);

                // Build the full file path: directory + '/' + filename
                String fullPath = directory + "/" + filename;

                // Step 3: Group files by content in the hash map
                // If this content hasn't been seen before, create a new list
                contentMap.putIfAbsent(content, new ArrayList<>());

                // Add the full path to the list for this content
                contentMap.get(content).add(fullPath);
            }
        }

        // Step 4: Filter and return only groups with at least 2 files (duplicates)
        List<List<String>> result = new ArrayList<>();
        for (List<String> group : contentMap.values()) {
            if (group.size() > 1) {
                result.add(group);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × m)**

- `n` is the number of paths in the input array
- `m` is the average length of each path string
- We process each character in the input exactly once when splitting and parsing
- Hash map operations (insert and lookup) are O(1) on average for each file

**Space Complexity: O(n × m)**

- We store all file paths in the hash map
- In the worst case, if all files have unique content, we store `f` entries where `f` is the total number of files
- Each entry stores the full file path, which has average length proportional to `m`
- Additional space for the result list, but this is included in the output and doesn't count toward auxiliary space in most interview contexts

## Common Mistakes

1. **Incorrect path concatenation**: Forgetting to add the '/' separator between directory and filename, or adding it when the directory already ends with '/'. The problem guarantees directory paths don't end with '/', so we need to add it ourselves.

2. **Improper content extraction**: Not correctly handling the parentheses when extracting content. Common errors include:
   - Including the parentheses in the content string
   - Using `split('(')` which fails if filenames contain parentheses (though the problem guarantees they don't)
   - Not finding the correct index of '('

3. **Not filtering single-file groups**: Returning all groups from the hash map instead of only those with at least 2 files. The problem specifies "duplicate files" means at least two files with the same content.

4. **Inefficient data structures**: Using lists instead of hash maps for grouping, which leads to O(n²) comparisons. Some candidates try to compare each file with every other file directly.

## When You'll See This Pattern

This problem uses the **"group by key"** pattern, which is fundamental to many hash table problems:

1. **Group Anagrams (LeetCode 49)**: Group strings by their sorted version or character frequency count.
2. **Find Duplicate Subtrees (LeetCode 652)**: Group tree nodes by their serialized representation.
3. **Brick Wall (LeetCode 554)**: Group edge positions by their cumulative sum to find where most edges align.

The pattern appears whenever you need to:

- Group items based on some computed property
- Find duplicates or collisions
- Aggregate data by a common characteristic

## Key Takeaways

1. **Hash maps are perfect for grouping**: When you need to group items by a common property, a hash map with the property as key and a list as value is often the right approach.

2. **Parse carefully before processing**: String manipulation problems require careful attention to indices and boundary conditions. Always trace through examples to verify your parsing logic.

3. **Consider what makes items "equivalent"**: The core challenge is identifying the right "key" for grouping. Here it's file content; in other problems it might be sorted strings, tree structures, or mathematical properties.

Related problems: [Delete Duplicate Folders in System](/problem/delete-duplicate-folders-in-system)
