---
title: "How to Solve Word Frequency — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Word Frequency. Medium difficulty, 28.4% acceptance rate. Topics: Shell."
date: "2027-12-23"
category: "dsa-patterns"
tags: ["word-frequency", "shell", "medium"]
---

# How to Solve Word Frequency

This problem asks you to write a bash script that counts how many times each word appears in a text file. While the concept is straightforward, the challenge lies in using shell scripting tools effectively to process text data. What makes this interesting is that you need to chain together Unix commands to achieve what would be multiple lines of code in other languages.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose `words.txt` contains:

```
the day is sunny the the
the sunny is is
```

**Step 1: Read all words**  
We need to extract individual words from this text. The file has words separated by spaces, so we can split on spaces to get: `the`, `day`, `is`, `sunny`, `the`, `the`, `the`, `sunny`, `is`, `is`

**Step 2: Count occurrences**  
Now we count how many times each word appears:

- `the`: appears 4 times (positions 1, 5, 6, 7)
- `day`: appears 1 time
- `is`: appears 3 times (positions 3, 9, 10)
- `sunny`: appears 2 times (positions 4, 8)

**Step 3: Sort by frequency**  
The problem requires output in descending order of frequency:

1. `the 4`
2. `is 3`
3. `sunny 2`
4. `day 1`

**Step 4: Format output**  
Finally, we output each word and its count on a separate line.

## Brute Force Approach

In a traditional programming language, a brute force approach might involve:

1. Reading the entire file
2. Splitting by spaces into an array of words
3. Creating a dictionary/hashmap to count frequencies
4. Sorting the dictionary by values
5. Printing the results

However, in bash, we don't have the same data structures readily available. A naive bash approach might try to process the file line by line with nested loops, but this would be extremely inefficient for large files. Each word would require scanning the entire file to count its occurrences, resulting in O(n²) time complexity where n is the number of words.

The key insight is that we need to leverage Unix command-line tools that are optimized for text processing rather than writing manual loops in bash.

## Optimized Approach

The optimal solution uses a pipeline of Unix commands, each performing one specific task efficiently:

1. **`cat words.txt`** or **`< words.txt`** - Read the file content
2. **`tr -s ' ' '\n'`** - Convert spaces to newlines, squeezing multiple spaces (`-s` flag)
3. **`sort`** - Sort the words alphabetically (required for `uniq -c` to work correctly)
4. **`uniq -c`** - Count consecutive identical lines
5. **`sort -rn`** - Sort numerically in reverse order (`-n` for numeric, `-r` for reverse)
6. **`awk '{print $2, $1}'`** - Swap columns to get "word count" format

The `tr` command is crucial because it converts the space-separated words into newline-separated words, which is what `sort` and `uniq` expect. The `sort` before `uniq` is necessary because `uniq` only detects consecutive duplicates.

## Optimal Solution

<div class="code-group">

```bash
#!/bin/bash

# Read the file and process it
# Time: O(n log n) for sorting | Space: O(n) for storing words
cat words.txt |           # Step 1: Read the file content
tr -s ' ' '\n' |         # Step 2: Replace spaces with newlines (-s squeezes multiple spaces)
sort |                   # Step 3: Sort words alphabetically (required for uniq to work)
uniq -c |                # Step 4: Count occurrences of each unique word
sort -rn |               # Step 5: Sort by count in descending order (-n numeric, -r reverse)
awk '{print $2, $1}'     # Step 6: Format output as "word count" instead of "count word"
```

```bash
#!/bin/bash

# Alternative solution using here-string and avoiding cat
# Time: O(n log n) | Space: O(n)
tr -s ' ' '\n' < words.txt |  # Step 1-2: Read file and convert spaces to newlines
sort |                        # Step 3: Sort alphabetically
uniq -c |                     # Step 4: Count unique words
sort -rn |                    # Step 5: Sort by frequency
awk '{print $2" "$1}'         # Step 6: Format output
```

```bash
#!/bin/bash

# Another variation using xargs for those familiar with it
# Time: O(n log n) | Space: O(n)
cat words.txt | xargs -n1 |  # Step 1-2: xargs -n1 puts each word on separate line
sort |                       # Step 3: Sort
uniq -c |                    # Step 4: Count
sort -rn |                   # Step 5: Sort by count
awk '{print $2, $1}'         # Step 6: Format
```

</div>

**Line-by-line explanation:**

1. **`cat words.txt`** - Reads the entire file. Some prefer `< words.txt` which is more efficient as it doesn't create a separate process.
2. **`tr -s ' ' '\n'`** - The `tr` (translate) command replaces spaces with newlines. The `-s` flag squeezes multiple consecutive spaces into one, handling the "one or more spaces" requirement.
3. **`sort`** - Alphabetically sorts the words. This is necessary because `uniq` only removes consecutive duplicates.
4. **`uniq -c`** - Counts occurrences of each unique word. The `-c` flag adds a count prefix to each line.
5. **`sort -rn`** - Sorts the output numerically (`-n`) in reverse order (`-r`), so highest counts come first.
6. **`awk '{print $2, $1}'`** - Swaps the columns. After `uniq -c`, we have "count word", but we need "word count".

## Complexity Analysis

**Time Complexity:** O(n log n)  
The dominant operation is sorting. Both `sort` commands have O(n log n) time complexity where n is the number of words. The `tr`, `uniq`, and `awk` operations are O(n). Since O(n log n) dominates O(n), the overall complexity is O(n log n).

**Space Complexity:** O(n)  
We need to store all words in memory for sorting. The `sort` command typically requires O(n) space, though some implementations use external sorting for very large files.

## Common Mistakes

1. **Forgetting to sort before `uniq`** - The `uniq` command only removes consecutive duplicates. Without sorting first, identical words that aren't adjacent won't be counted together.

2. **Not handling multiple spaces** - The problem states "one or more spaces" separate words. Using simple space splitting without the `-s` flag in `tr` would create empty "words" when there are multiple spaces.

3. **Incorrect output order** - The problem requires descending frequency order. Forgetting the `-r` (reverse) flag in the final sort or using `sort -n` without `-r` gives ascending order.

4. **Wrong column order in output** - After `uniq -c`, the format is "count word". The problem wants "word count". Forgetting the `awk` command to swap columns gives incorrect output.

5. **Using inefficient file reading** - While `cat words.txt |` works, `< words.txt` is more efficient as it avoids creating a separate `cat` process. This is a subtle but good practice in shell scripting.

## When You'll See This Pattern

This pattern of chaining Unix commands for text processing appears in many shell scripting problems and real-world data processing tasks:

1. **Log file analysis** - Counting error types, finding most frequent IP addresses, or analyzing access patterns.

2. **Data cleaning pipelines** - Processing CSV or text data before loading into databases or analysis tools.

3. **System administration tasks** - Monitoring disk usage, analyzing process lists, or checking system logs.

4. **Similar LeetCode problems**:
   - **Top K Frequent Elements** - Same counting and sorting concept, just in a general programming context.
   - **Sort Characters By Frequency** - Very similar problem but with characters instead of words.
   - **First Unique Character in a String** - Uses frequency counting as a foundational step.

## Key Takeaways

1. **Unix pipelines are powerful** - Complex text processing can often be done by chaining simple, single-purpose commands. Each command in a pipeline runs concurrently, processing data as it flows through.

2. **Know your text processing tools** - `tr`, `sort`, `uniq`, `awk`, and `sed` are essential for shell scripting problems. Understanding their flags and options is crucial.

3. **Sorting enables efficient counting** - The pattern of "sort then count with uniq" is a classic Unix idiom for frequency analysis. This works because sorting brings identical items together, allowing linear-time counting.

4. **Always test edge cases** - Empty files, single words, all identical words, and words with special characters (though not in this problem) should all be considered.

Related problems: [Top K Frequent Elements](/problem/top-k-frequent-elements)
