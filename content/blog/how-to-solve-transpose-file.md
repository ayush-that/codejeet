---
title: "How to Solve Transpose File — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Transpose File. Medium difficulty, 30.7% acceptance rate. Topics: Shell."
date: "2028-11-14"
category: "dsa-patterns"
tags: ["transpose-file", "shell", "medium"]
---

# How to Solve Transpose File

This problem asks you to transpose the contents of a text file, converting rows to columns and columns to rows. While conceptually simple, this becomes tricky in a shell environment where you can't easily use two-dimensional arrays or matrix operations. The challenge lies in manipulating text streams and fields using only basic Unix tools like `awk`, `sed`, and `wc`.

## Visual Walkthrough

Let's trace through a small example to build intuition. Suppose `file.txt` contains:

```
name age city
alice 21 nyc
bob 25 la
```

Visually, we want to transform this into:

```
name alice bob
age 21 25
city nyc la
```

Here's what's happening step by step:

1. The original file has 3 rows and 3 columns
2. After transposition, we'll have 3 rows and 3 columns (since it's square)
3. The first column `[name, alice, bob]` becomes the first row `name alice bob`
4. The second column `[age, 21, 25]` becomes the second row `age 21 25`
5. The third column `[city, nyc, la]` becomes the third row `city nyc la`

The key insight is that we need to read the file column by column instead of row by row, which is the natural way files are processed.

## Brute Force Approach

A naive approach might try to read the entire file into memory, parse it into a 2D array, then write it out transposed. In shell scripting, this would be extremely inefficient and complex. You might try:

1. Read all lines into an array
2. Split each line into words
3. Create a new 2D structure to hold transposed data
4. Print the new structure

However, shell scripting doesn't have convenient 2D arrays, and this approach would require complex nested loops with lots of temporary variables. More importantly, it wouldn't handle files of arbitrary size well since you'd need to know the dimensions upfront.

## Optimized Approach

The optimal solution uses `awk` with a two-pass approach:

1. **First pass**: Count the number of columns by examining the first line
2. **Second pass**: For each column index, collect all values in that column

The key insight is that we can process the file column-wise by:

- Storing all values in arrays indexed by their column position
- Using `awk`'s associative arrays to collect column values
- Printing column by column after reading all rows

Alternatively, we can use a more elegant single-pass approach that:

1. Reads each line and splits it into fields
2. For each field, appends it to a string for that column
3. After processing all lines, prints each column's accumulated string

This works because `awk` processes the file line by line (row by row), but we can accumulate column data as we go.

## Optimal Solution

Here's the complete solution using `awk`:

<div class="code-group">

```bash
#!/bin/bash
# Time: O(n * m) where n = rows, m = columns | Space: O(n * m)
awk '
{
    # Process each line (row)
    for (i = 1; i <= NF; i++) {
        # If this is the first row, initialize the column string
        if (NR == 1) {
            cols[i] = $i
        } else {
            # Append to existing column string with space separator
            cols[i] = cols[i] " " $i
        }
    }
}
END {
    # After processing all rows, print each column
    for (i = 1; i <= NF; i++) {
        print cols[i]
    }
}
' file.txt
```

```bash
#!/bin/bash
# Alternative solution using NR and arrays
# Time: O(n * m) where n = rows, m = columns | Space: O(n * m)
awk '
{
    for (i = 1; i <= NF; i++) {
        # Store each field in a 2D-like structure: array[column][row]
        a[i][NR] = $i
    }
}
END {
    for (i = 1; i <= NF; i++) {
        # Build the output line for column i
        line = a[i][1]
        for (j = 2; j <= NR; j++) {
            line = line " " a[i][j]
        }
        print line
    }
}
' file.txt
```

</div>

**Line-by-line explanation of the first solution:**

1. `{` starts the main processing block that runs for each line
2. `for (i = 1; i <= NF; i++)` loops through each field (column) in the current line
3. `NF` is a built-in `awk` variable containing the number of fields in the current line
4. `if (NR == 1)` checks if this is the first row (NR = record number = line number)
5. `cols[i] = $i` initializes the column string with the first value (no leading space)
6. `cols[i] = cols[i] " " $i` appends subsequent values with a space separator
7. `END {` starts the block that runs after all lines are processed
8. `for (i = 1; i <= NF; i++)` loops through each column (NF from the last line processed)
9. `print cols[i]` outputs the complete column string

## Complexity Analysis

**Time Complexity:** O(n × m) where n is the number of rows and m is the number of columns. We process each field exactly once when reading the file, and then we process each column once when printing.

**Space Complexity:** O(n × m) in the worst case. We store all field values in memory in the `cols` array. Each column's string contains all values from that column, so we're essentially storing the entire transposed matrix.

Note: The space complexity could be reduced to O(m) if we processed and printed one column at a time, but this would require reading the file m times (once per column), trading space for time.

## Common Mistakes

1. **Assuming square matrix**: The problem states "each row has the same number of columns," but this doesn't guarantee a square matrix. Your solution should handle rectangular matrices (more rows than columns or vice versa).

2. **Incorrect field separator handling**: Using the wrong field separator or not handling multiple spaces correctly. The problem specifies single space separation, but robust solutions should handle variations.

3. **Off-by-one errors in loops**: In `awk`, field indices start at 1, not 0. A common mistake is `for (i = 0; i < NF; i++)` which misses the first field and causes issues.

4. **Not handling the first row specially**: If you always add a space before appending values, the first column value will have a leading space. The solution needs special handling for the first row.

5. **Using bash arrays inefficiently**: While possible with pure bash, using nested loops with bash arrays is much slower and more complex than using `awk`.

## When You'll See This Pattern

This transpose pattern appears in various forms across different problem domains:

1. **Matrix Transposition (LeetCode 867)**: The 2D array version of this problem, where you need to transpose a matrix in memory.

2. **Text Processing Problems**: Any problem requiring column-wise processing of tabular data, like computing column sums or applying operations to columns.

3. **Data Reshaping Problems**: Similar to SQL PIVOT operations or pandas DataFrame transformations where you need to reshape data from long to wide format or vice versa.

The core technique of accumulating data by position/index while iterating in one dimension (rows) to produce output in another dimension (columns) is widely applicable.

## Key Takeaways

1. **Think in terms of data flow**: When processing structured data, consider whether row-wise or column-wise processing is more natural for the task, and use appropriate accumulation strategies.

2. **Leverage language strengths**: Shell scripting excels at text stream processing with tools like `awk`. Know when to use these specialized tools rather than forcing a general-purpose approach.

3. **Pay attention to initialization**: When accumulating data, the first element often needs special handling (no separator before it), while subsequent elements need separators.

4. **Understand your tools**: `awk` provides built-in variables like `NF` (number of fields) and `NR` (record/line number) that are essential for text processing tasks.

[Practice this problem on CodeJeet](/problem/transpose-file)
