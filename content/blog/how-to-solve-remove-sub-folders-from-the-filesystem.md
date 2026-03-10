---
title: "How to Solve Remove Sub-Folders from the Filesystem — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Remove Sub-Folders from the Filesystem. Medium difficulty, 78.6% acceptance rate. Topics: Array, String, Depth-First Search, Trie."
date: "2028-04-01"
category: "dsa-patterns"
tags: ["remove-sub-folders-from-the-filesystem", "array", "string", "depth-first-search", "medium"]
---

# How to Solve Remove Sub-Folders from the Filesystem

You're given a list of folder paths, and you need to remove any folder that's a sub-folder of another folder in the list. A folder is a sub-folder if it starts with another folder's path followed by a "/". The tricky part is that folders can be deeply nested, and you need an efficient way to check these prefix relationships without comparing every pair of folders.

## Visual Walkthrough

Let's trace through an example: `["/a","/a/b","/c/d","/c/d/e","/c/f"]`

1. **Sort the folders**: `["/a","/a/b","/c/d","/c/d/e","/c/f"]`
   - Sorting brings parent folders before their children when they share the same prefix

2. **Process each folder**:
   - Start with result = `[]`
   - Add `/a` to result → result = `["/a"]`
   - Check `/a/b`: Does it start with `/a/`? Yes → skip it (it's a sub-folder)
   - Check `/c/d`: Does it start with `/a/`? No → add to result → result = `["/a","/c/d"]`
   - Check `/c/d/e`: Does it start with `/c/d/`? Yes → skip it
   - Check `/c/f`: Does it start with `/c/d/`? No → add to result → result = `["/a","/c/d","/c/f"]`

3. **Final result**: `["/a","/c/d","/c/f"]`

The key insight: after sorting, if a folder is a sub-folder, its parent must appear earlier in the sorted list, and we can check this with a simple prefix comparison.

## Brute Force Approach

The most straightforward approach is to compare every pair of folders:

1. For each folder `folder[i]`, check if it's a sub-folder of any other folder `folder[j]`
2. A folder `folder[i]` is a sub-folder of `folder[j]` if:
   - `folder[i]` starts with `folder[j]`
   - The next character after `folder[j]` in `folder[i]` is "/" (or `folder[i]` equals `folder[j]`)

This requires O(n²) comparisons where n is the number of folders. For each comparison, we need to check string prefixes, which takes O(min(len(folder[i]), len(folder[j]))) time. In the worst case, this becomes O(n² \* L) where L is the average folder length.

The brute force is too slow for large inputs (n up to 4×10⁴ in LeetCode constraints), as 4×10⁴² = 1.6×10⁹ operations is infeasible.

## Optimized Approach

The optimal solution uses sorting and linear scanning:

1. **Sort the folders lexicographically**
   - This ensures that if folder A is a parent of folder B, then A comes before B in the sorted list
   - Example: `/a`, `/a/b`, `/a/b/c` will be in this order after sorting

2. **Maintain a current parent folder**
   - Keep track of the last folder added to the result
   - For each new folder, check if it starts with the current parent folder followed by "/"
   - If yes, it's a sub-folder → skip it
   - If no, add it to the result and update the current parent

3. **Why this works**
   - After sorting, all sub-folders appear immediately after their parent (or somewhere later with the same prefix)
   - By keeping only non-sub-folders in our result, we ensure we always compare against valid parent candidates
   - The "/" check is crucial: `/a/b` is NOT a sub-folder of `/a/bc` even though `/a/b` starts with `/a/b`

Alternative approach: Use a Trie (prefix tree) where each node represents a folder name. Insert all folders, then collect only folders where no ancestor is also a folder in the list. While the Trie approach has the same time complexity, the sorting approach is simpler to implement.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * L * log n) where n = number of folders, L = average folder length
# Space: O(n * L) for storing the result (or O(L) if we don't count output)
def removeSubfolders(folders):
    """
    Removes all sub-folders from the given list of folders.

    Args:
        folders: List of folder paths starting with '/'

    Returns:
        List of folders with all sub-folders removed
    """
    # Step 1: Sort the folders lexicographically
    # This ensures parent folders come before their children
    folders.sort()

    # Step 2: Initialize result with the first folder
    # The first folder cannot be a sub-folder since it's first
    result = [folders[0]]

    # Step 3: Iterate through remaining folders
    for i in range(1, len(folders)):
        # Get the last folder added to result (current potential parent)
        last_folder = result[-1]

        # Get current folder to check
        current_folder = folders[i]

        # Check if current_folder is a sub-folder of last_folder
        # We need to check if current_folder starts with last_folder + "/"
        # The "/" is crucial to avoid false matches like /a/b vs /a/bc
        if not current_folder.startswith(last_folder + "/"):
            # Not a sub-folder, so add it to result
            result.append(current_folder)

    return result
```

```javascript
// Time: O(n * L * log n) where n = number of folders, L = average folder length
// Space: O(n * L) for storing the result (or O(L) if we don't count output)
function removeSubfolders(folders) {
  /**
   * Removes all sub-folders from the given list of folders.
   *
   * @param {string[]} folders - Array of folder paths starting with '/'
   * @return {string[]} - Array of folders with all sub-folders removed
   */

  // Step 1: Sort the folders lexicographically
  // This ensures parent folders come before their children
  folders.sort();

  // Step 2: Initialize result with the first folder
  // The first folder cannot be a sub-folder since it's first
  const result = [folders[0]];

  // Step 3: Iterate through remaining folders
  for (let i = 1; i < folders.length; i++) {
    // Get the last folder added to result (current potential parent)
    const lastFolder = result[result.length - 1];

    // Get current folder to check
    const currentFolder = folders[i];

    // Check if currentFolder is a sub-folder of lastFolder
    // We need to check if currentFolder starts with lastFolder + "/"
    // The "/" is crucial to avoid false matches like /a/b vs /a/bc
    if (!currentFolder.startsWith(lastFolder + "/")) {
      // Not a sub-folder, so add it to result
      result.push(currentFolder);
    }
  }

  return result;
}
```

```java
// Time: O(n * L * log n) where n = number of folders, L = average folder length
// Space: O(n * L) for storing the result (or O(L) if we don't count output)
import java.util.*;

class Solution {
    public List<String> removeSubfolders(String[] folders) {
        /**
         * Removes all sub-folders from the given list of folders.
         *
         * @param folders - Array of folder paths starting with '/'
         * @return List of folders with all sub-folders removed
         */

        // Step 1: Sort the folders lexicographically
        // This ensures parent folders come before their children
        Arrays.sort(folders);

        // Step 2: Initialize result with the first folder
        // The first folder cannot be a sub-folder since it's first
        List<String> result = new ArrayList<>();
        result.add(folders[0]);

        // Step 3: Iterate through remaining folders
        for (int i = 1; i < folders.length; i++) {
            // Get the last folder added to result (current potential parent)
            String lastFolder = result.get(result.size() - 1);

            // Get current folder to check
            String currentFolder = folders[i];

            // Check if currentFolder is a sub-folder of lastFolder
            // We need to check if currentFolder starts with lastFolder + "/"
            // The "/" is crucial to avoid false matches like /a/b vs /a/bc
            if (!currentFolder.startsWith(lastFolder + "/")) {
                // Not a sub-folder, so add it to result
                result.add(currentFolder);
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n × L × log n)**

- Sorting takes O(n × L × log n) time because comparing two strings of length L takes O(L) time, and we do this O(n log n) times during sorting
- The linear scan takes O(n × L) time because for each of n folders, we do a startsWith check which takes O(L) time in the worst case
- Dominated by the sorting step: O(n × L × log n)

**Space Complexity: O(n × L)** if we count the output space, or **O(L)** auxiliary space if we don't

- The result can contain up to n folders, each of length L → O(n × L)
- The sorting algorithm typically uses O(log n) to O(n) space for the recursion stack or temporary arrays, but this is smaller than the output
- If we don't count the output space (as is common in complexity analysis), we use only O(L) extra space for string comparisons

## Common Mistakes

1. **Forgetting the "/" in the prefix check**
   - Wrong: `if current_folder.startswith(last_folder):`
   - Right: `if current_folder.startswith(last_folder + "/"):`
   - Why: Without "/", `/a/b` would be incorrectly identified as a sub-folder of `/a/bc` since `/a/b` starts with `/a/b`

2. **Not sorting the folders first**
   - If folders aren't sorted, a child might appear before its parent
   - Example: `["/a/b", "/a"]` - `/a/b` would be added first, then `/a` wouldn't be recognized as its parent
   - Solution: Always sort first to ensure parent-child ordering

3. **Using the wrong comparison order**
   - Some candidates check if the last folder is a sub-folder of the current one
   - This doesn't work because after sorting, the current folder is always lexicographically >= the last folder
   - Always check if current is a sub-folder of last, not vice versa

4. **Not handling empty input**
   - The code assumes at least one folder exists
   - Add a guard clause: `if not folders: return []`
   - This is good practice even if the problem guarantees non-empty input

## When You'll See This Pattern

This "sort and scan for prefixes" pattern appears in several problems where you need to find hierarchical relationships:

1. **Longest Word in Dictionary (LeetCode 720)**
   - Find the longest word that can be built one letter at a time from other words in the dictionary
   - Similar pattern: sort words by length, then check if shorter prefixes exist

2. **Replace Words (LeetCode 648)**
   - Replace words with their shortest root form from a dictionary
   - Uses a Trie to efficiently check prefixes, similar to how we could use a Trie here

3. **Word Squares (LeetCode 425)**
   - Find all word squares where prefixes match suffixes
   - Uses prefix matching with Tries, which is the alternative approach to this problem

The key insight is recognizing when sorting can bring related items together, allowing linear-time processing instead of pairwise comparisons.

## Key Takeaways

1. **Sorting can reveal structure**: When dealing with hierarchical or prefix relationships, sorting often brings parents and children together, enabling efficient linear scans.

2. **The "/" matters in path comparisons**: Always include the path separator when checking if one path is a sub-folder of another to avoid false matches.

3. **Trade-offs between approaches**: The sorting approach (O(n log n)) is often simpler than the Trie approach (O(n × L)) for implementation, though both have their uses. Know when to choose each.

[Practice this problem on CodeJeet](/problem/remove-sub-folders-from-the-filesystem)
