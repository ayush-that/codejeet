---
title: "How to Solve Reorder Data in Log Files — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Reorder Data in Log Files. Medium difficulty, 56.9% acceptance rate. Topics: Array, String, Sorting."
date: "2027-07-21"
category: "dsa-patterns"
tags: ["reorder-data-in-log-files", "array", "string", "sorting", "medium"]
---

# How to Solve Reorder Data in Log Files

This problem asks us to reorder an array of log entries according to specific rules. The challenge lies in implementing a custom sorting comparator that handles two different log types with different sorting rules, while maintaining stable sorting within each type. What makes this interesting is that we can't just use a standard sort - we need to parse each log, classify it, and apply different comparison logic based on its type.

## Visual Walkthrough

Let's trace through a small example to build intuition:

**Input:** `logs = ["a1 9 2 3 1","g1 act car","zo4 4 7","ab1 off key dog","a8 act zoo"]`

**Step 1: Classify logs**

- `"a1 9 2 3 1"` → After identifier "a1", we see "9" (digit) → **Digit-log**
- `"g1 act car"` → After identifier "g1", we see "act" (letters) → **Letter-log**
- `"zo4 4 7"` → After identifier "zo4", we see "4" (digit) → **Digit-log**
- `"ab1 off key dog"` → After identifier "ab1", we see "off" (letters) → **Letter-log**
- `"a8 act zoo"` → After identifier "a8", we see "act" (letters) → **Letter-log**

**Step 2: Separate logs**

- Letter-logs: `["g1 act car", "ab1 off key dog", "a8 act zoo"]`
- Digit-logs: `["a1 9 2 3 1", "zo4 4 7"]`

**Step 3: Sort letter-logs**
Rule: Sort by contents first, then by identifier if contents are equal.

1. Compare `"g1 act car"` vs `"ab1 off key dog"`:
   - Contents: `"act car"` vs `"off key dog"` → `"act car"` comes first (lexicographically)
   - Result: `"g1 act car"` comes before `"ab1 off key dog"`

2. Compare `"g1 act car"` vs `"a8 act zoo"`:
   - Contents: `"act car"` vs `"act zoo"` → `"act car"` comes first
   - Result: `"g1 act car"` comes before `"a8 act zoo"`

3. Compare `"ab1 off key dog"` vs `"a8 act zoo"`:
   - Contents: `"off key dog"` vs `"act zoo"` → `"act zoo"` comes first
   - Result: `"a8 act zoo"` comes before `"ab1 off key dog"`

Sorted letter-logs: `["g1 act car", "a8 act zoo", "ab1 off key dog"]`

**Step 4: Combine results**

- Letter-logs (sorted) come first: `["g1 act car", "a8 act zoo", "ab1 off key dog"]`
- Digit-logs (original order) come after: `["a1 9 2 3 1", "zo4 4 7"]`

**Final output:** `["g1 act car","a8 act zoo","ab1 off key dog","a1 9 2 3 1","zo4 4 7"]`

## Brute Force Approach

A naive approach might try to sort everything in one pass with a complex comparator. However, the real "brute force" thinking here would be:

1. Iterate through all logs and separate them into letter-logs and digit-logs
2. For letter-logs, extract identifier and content for each
3. Try to sort letter-logs by comparing each pair (O(n²) comparison sort)
4. Append digit-logs in original order

The problem with this thinking is that if we implement our own O(n²) sort (like bubble sort), it would be too slow for large inputs. More importantly, the real challenge isn't the sorting algorithm itself (we'll use built-in sort), but implementing the correct comparator logic.

What makes the brute force insufficient isn't performance but correctness - candidates often get the comparator logic wrong by:

- Not properly identifying log types
- Not handling the "contents then identifier" rule correctly
- Not preserving the original order of digit-logs

## Optimized Approach

The key insight is that we need to:

1. **Separate** letter-logs from digit-logs because they have different sorting requirements
2. **Sort** only the letter-logs with a custom comparator
3. **Preserve** the original relative order of digit-logs (stable sorting)

Here's the step-by-step reasoning:

**Step 1: Classify each log**
We need to check if a log is a letter-log or digit-log. The rule says: look at the first character after the identifier and the first space. If it's a digit (0-9), it's a digit-log; otherwise, it's a letter-log.

**Step 2: Separate the logs**
We'll create two lists: one for letter-logs and one for digit-logs. This separation is crucial because:

- Letter-logs need custom sorting
- Digit-logs need to maintain original order

**Step 3: Sort letter-logs with custom comparator**
For letter-logs, we need to sort by:

1. The content (everything after identifier)
2. If contents are equal, then by identifier

We can achieve this by:

- Extracting identifier and content for each letter-log
- Creating a comparator that compares content first, then identifier

**Step 4: Combine results**
Append all sorted letter-logs first, then all digit-logs (in their original order).

## Optimal Solution

<div class="code-group">

```python
# Time: O(M * N * logN) where N = number of logs, M = average log length
# Space: O(M * N) for storing separated logs
def reorderLogFiles(logs):
    """
    Reorders logs according to the rules:
    1. Letter-logs come before digit-logs
    2. Letter-logs are sorted lexicographically by their contents
       If contents are identical, sort by identifier
    3. Digit-logs maintain their original relative ordering
    """

    # Step 1: Separate letter-logs and digit-logs
    letter_logs = []
    digit_logs = []

    for log in logs:
        # Find the first space to separate identifier from content
        first_space_idx = log.find(' ')

        # Check the first character after the identifier and space
        # If it's a digit, it's a digit-log
        if log[first_space_idx + 1].isdigit():
            digit_logs.append(log)
        else:
            letter_logs.append(log)

    # Step 2: Sort letter-logs with custom comparator
    # We need to sort by content first, then by identifier
    def sort_key(log):
        # Split into identifier and content
        first_space_idx = log.find(' ')
        identifier = log[:first_space_idx]
        content = log[first_space_idx + 1:]

        # Return a tuple for sorting: (content, identifier)
        # This ensures we sort by content first, then identifier
        return (content, identifier)

    # Sort using our custom key function
    letter_logs.sort(key=sort_key)

    # Step 3: Combine results - letter-logs first, then digit-logs
    return letter_logs + digit_logs
```

```javascript
// Time: O(M * N * logN) where N = number of logs, M = average log length
// Space: O(M * N) for storing separated logs
function reorderLogFiles(logs) {
  /**
   * Reorders logs according to the rules:
   * 1. Letter-logs come before digit-logs
   * 2. Letter-logs are sorted lexicographically by their contents
   *    If contents are identical, sort by identifier
   * 3. Digit-logs maintain their original relative ordering
   */

  // Step 1: Separate letter-logs and digit-logs
  const letterLogs = [];
  const digitLogs = [];

  for (const log of logs) {
    // Find the first space to separate identifier from content
    const firstSpaceIdx = log.indexOf(" ");

    // Check the first character after the identifier and space
    // If it's a digit, it's a digit-log
    if (/\d/.test(log[firstSpaceIdx + 1])) {
      digitLogs.push(log);
    } else {
      letterLogs.push(log);
    }
  }

  // Step 2: Sort letter-logs with custom comparator
  letterLogs.sort((a, b) => {
    // Find the first space in each log
    const aSpaceIdx = a.indexOf(" ");
    const bSpaceIdx = b.indexOf(" ");

    // Extract identifier and content for comparison
    const aId = a.substring(0, aSpaceIdx);
    const aContent = a.substring(aSpaceIdx + 1);

    const bId = b.substring(0, bSpaceIdx);
    const bContent = b.substring(bSpaceIdx + 1);

    // First compare contents
    if (aContent < bContent) return -1;
    if (aContent > bContent) return 1;

    // If contents are equal, compare identifiers
    if (aId < bId) return -1;
    if (aId > bId) return 1;

    return 0; // They're completely equal
  });

  // Step 3: Combine results - letter-logs first, then digit-logs
  return [...letterLogs, ...digitLogs];
}
```

```java
// Time: O(M * N * logN) where N = number of logs, M = average log length
// Space: O(M * N) for storing separated logs
class Solution {
    public String[] reorderLogFiles(String[] logs) {
        /**
         * Reorders logs according to the rules:
         * 1. Letter-logs come before digit-logs
         * 2. Letter-logs are sorted lexicographically by their contents
         *    If contents are identical, sort by identifier
         * 3. Digit-logs maintain their original relative ordering
         */

        // Step 1: Separate letter-logs and digit-logs
        List<String> letterLogs = new ArrayList<>();
        List<String> digitLogs = new ArrayList<>();

        for (String log : logs) {
            // Find the first space to separate identifier from content
            int firstSpaceIdx = log.indexOf(' ');

            // Check the first character after the identifier and space
            // If it's a digit, it's a digit-log
            if (Character.isDigit(log.charAt(firstSpaceIdx + 1))) {
                digitLogs.add(log);
            } else {
                letterLogs.add(log);
            }
        }

        // Step 2: Sort letter-logs with custom comparator
        letterLogs.sort((a, b) -> {
            // Find the first space in each log
            int aSpaceIdx = a.indexOf(' ');
            int bSpaceIdx = b.indexOf(' ');

            // Extract identifier and content for comparison
            String aId = a.substring(0, aSpaceIdx);
            String aContent = a.substring(aSpaceIdx + 1);

            String bId = b.substring(0, bSpaceIdx);
            String bContent = b.substring(bSpaceIdx + 1);

            // First compare contents
            int contentCompare = aContent.compareTo(bContent);
            if (contentCompare != 0) {
                return contentCompare;
            }

            // If contents are equal, compare identifiers
            return aId.compareTo(bId);
        });

        // Step 3: Combine results - letter-logs first, then digit-logs
        List<String> result = new ArrayList<>();
        result.addAll(letterLogs);
        result.addAll(digitLogs);

        // Convert back to array
        return result.toArray(new String[0]);
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(M × N × logN)**

- **N** is the number of logs
- **M** is the average length of each log
- We iterate through all logs once to separate them: O(N × M) for string operations
- We sort letter-logs: O(K × logK) comparisons where K is number of letter-logs
- Each comparison takes O(M) time for string comparison
- Total: O(N × M + K × M × logK) = O(M × N × logN) in worst case

**Space Complexity: O(M × N)**

- We create two separate lists storing all logs: O(N) elements
- Each log string has length M: O(M × N) total space
- Sorting may require additional O(N) space for the algorithm

## Common Mistakes

1. **Incorrect log classification**: Checking the wrong character for digit detection. Some candidates check `log.split()[1][0]` without considering multi-word identifiers. Our approach using `find(' ')` is more reliable.

2. **Forgetting to preserve digit-log order**: The problem states digit-logs should maintain their original relative ordering. Some candidates try to sort everything together, which would reorder digit-logs.

3. **Wrong sorting priority for letter-logs**: The rule is "sort by contents, then by identifier if contents are equal." A common mistake is to sort by identifier first or to concatenate identifier and content and sort that string.

4. **Not handling empty logs or edge cases**: While the problem guarantees at least one word, in interviews you should mention handling cases like empty input or logs with only identifiers.

## When You'll See This Pattern

This problem teaches **custom sorting with multiple criteria**, a pattern that appears in many interview problems:

1. **Sort Characters By Frequency (LeetCode 451)** - Sort characters by frequency, then alphabetically for ties. Similar custom comparator needed.

2. **Custom Sort String (LeetCode 791)** - Sort string based on custom order defined by another string. Requires understanding of comparator functions.

3. **Meeting Rooms II (LeetCode 253)** - While not exactly sorting, it involves processing intervals in a specific order, which requires understanding how to order data based on multiple attributes.

The core pattern is: when you need to sort elements based on multiple criteria with different priorities, think about:

- Separating elements into groups if they have fundamentally different sorting rules
- Creating a comparator function that checks criteria in priority order
- Using stable sort properties when order matters for certain groups

## Key Takeaways

1. **Separate and conquer**: When different groups of data have different sorting requirements, separate them first, sort only what needs sorting, then recombine.

2. **Multi-level sorting**: For sorting by multiple criteria, implement comparators that check criteria in priority order (most important first, break ties with next criterion).

3. **Stable sort matters**: Understand when you need to preserve original order (digit-logs in this case) and use stable sorting algorithms or manual separation to achieve this.

[Practice this problem on CodeJeet](/problem/reorder-data-in-log-files)
