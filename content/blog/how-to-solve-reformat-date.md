---
title: "How to Solve Reformat Date — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Reformat Date. Easy difficulty, 68.3% acceptance rate. Topics: String."
date: "2027-07-20"
category: "dsa-patterns"
tags: ["reformat-date", "string", "easy"]
---

# How to Solve Reformat Date

At first glance, this problem seems straightforward: convert a date string from one format to another. However, what makes it interesting is the need to handle multiple string parsing challenges simultaneously—extracting the day number from an ordinal suffix, converting month abbreviations to numbers, and ensuring proper zero-padding. This tests your attention to detail with string manipulation and mapping data.

## Visual Walkthrough

Let's trace through the example `"20th Oct 2052"`:

1. **Split the string**: We get three parts: `["20th", "Oct", "2052"]`
2. **Extract day**: Take `"20th"` and remove the last two characters (`"th"`), leaving `"20"`. Since this is a single-digit day, we need to pad it: `"20"` → `"20"` (already two digits)
3. **Convert month**: Map `"Oct"` to its month number. October is the 10th month, so we get `"10"`
4. **Year**: `"2052"` is already in the correct format
5. **Reformat**: Combine as `"2052-10-20"`

For another example `"6th Jun 1933"`:

- Split: `["6th", "Jun", "1933"]`
- Day: Remove `"th"` → `"6"` → pad to `"06"`
- Month: `"Jun"` → `"06"` (June is 6th month)
- Year: `"1933"`
- Result: `"1933-06-06"`

## Brute Force Approach

While there's no "brute force" in the traditional algorithmic sense for this problem, a naive approach might involve:

1. Writing extensive if-else chains for month conversion
2. Manually checking each possible ordinal suffix ("st", "nd", "rd", "th")
3. Hardcoding month mappings without using a dictionary

This approach would work but would be verbose, error-prone, and difficult to maintain. The code would be cluttered with repetitive logic and would require careful handling of edge cases.

## Optimal Solution

The clean solution uses:

1. **String splitting** to separate day, month, and year
2. **Dictionary mapping** for month abbreviations to numbers
3. **String slicing** to remove ordinal suffixes
4. **String formatting** to ensure proper zero-padding

<div class="code-group">

```python
# Time: O(1) | Space: O(1)
def reformatDate(date: str) -> str:
    # Step 1: Split the input string into day, month, and year components
    # Example: "20th Oct 2052" -> ["20th", "Oct", "2052"]
    parts = date.split()

    # Step 2: Extract day by removing the last 2 characters (ordinal suffix)
    # "20th" -> "20" (slicing from start to -2 excludes last 2 chars)
    day = parts[0][:-2]

    # Step 3: Pad single-digit days with leading zero
    # "6" -> "06", "20" -> "20"
    day = day.zfill(2)

    # Step 4: Map month abbreviation to its two-digit number
    month_map = {
        "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
        "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
        "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
    }
    month = month_map[parts[1]]

    # Step 5: Year is already in correct format
    year = parts[2]

    # Step 6: Combine in YYYY-MM-DD format
    return f"{year}-{month}-{day}"
```

```javascript
// Time: O(1) | Space: O(1)
function reformatDate(date) {
  // Step 1: Split the input string into day, month, and year components
  // Example: "20th Oct 2052" -> ["20th", "Oct", "2052"]
  const parts = date.split(" ");

  // Step 2: Extract day by removing the last 2 characters (ordinal suffix)
  // "20th" -> "20" (substring from 0 to length-2)
  const dayStr = parts[0];
  const dayNum = dayStr.substring(0, dayStr.length - 2);

  // Step 3: Pad single-digit days with leading zero
  // "6" -> "06", "20" -> "20"
  const day = dayNum.padStart(2, "0");

  // Step 4: Map month abbreviation to its two-digit number
  const monthMap = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  const month = monthMap[parts[1]];

  // Step 5: Year is already in correct format
  const year = parts[2];

  // Step 6: Combine in YYYY-MM-DD format
  return `${year}-${month}-${day}`;
}
```

```java
// Time: O(1) | Space: O(1)
import java.util.Map;
import java.util.HashMap;

class Solution {
    public String reformatDate(String date) {
        // Step 1: Split the input string into day, month, and year components
        // Example: "20th Oct 2052" -> ["20th", "Oct", "2052"]
        String[] parts = date.split(" ");

        // Step 2: Extract day by removing the last 2 characters (ordinal suffix)
        // "20th" -> "20" (substring from 0 to length-2)
        String dayStr = parts[0];
        String dayNum = dayStr.substring(0, dayStr.length() - 2);

        // Step 3: Pad single-digit days with leading zero
        // "6" -> "06", "20" -> "20"
        String day = dayNum.length() == 1 ? "0" + dayNum : dayNum;

        // Step 4: Map month abbreviation to its two-digit number
        Map<String, String> monthMap = new HashMap<>();
        monthMap.put("Jan", "01");
        monthMap.put("Feb", "02");
        monthMap.put("Mar", "03");
        monthMap.put("Apr", "04");
        monthMap.put("May", "05");
        monthMap.put("Jun", "06");
        monthMap.put("Jul", "07");
        monthMap.put("Aug", "08");
        monthMap.put("Sep", "09");
        monthMap.put("Oct", "10");
        monthMap.put("Nov", "11");
        monthMap.put("Dec", "12");

        String month = monthMap.get(parts[1]);

        // Step 5: Year is already in correct format
        String year = parts[2];

        // Step 6: Combine in YYYY-MM-DD format
        return year + "-" + month + "-" + day;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(1)**

- Splitting the string: O(n) where n is the length of the string, but since date strings have a fixed maximum length (e.g., "31st Dec 2100" is 13 characters), this is effectively O(1)
- Dictionary lookup: O(1) for hash map access
- String operations (slicing, padding): O(1) for fixed-length strings

**Space Complexity: O(1)**

- We use a constant amount of extra space for the month map (12 entries)
- The output string has fixed length (10 characters: "YYYY-MM-DD")
- Temporary variables for day, month, year don't scale with input size

## Common Mistakes

1. **Forgetting to handle single-digit days**: Not padding days like "6" to "06" results in "1933-06-6" instead of "1933-06-06". Always use `.zfill(2)` in Python, `.padStart(2, '0')` in JavaScript, or manual checking in Java.

2. **Incorrect string slicing for day extraction**: Using `parts[0][:-1]` instead of `parts[0][:-2]` would only remove the last character ("20t" instead of "20"). Remember ordinal suffixes are always 2 characters ("st", "nd", "rd", "th").

3. **Case sensitivity with month abbreviations**: The problem guarantees proper capitalization, but in real scenarios, you might need to handle `.capitalize()` or `.toLowerCase()` if input format varies.

4. **Using arrays instead of hash maps for month lookup**: While you could use an array and search linearly, this would be O(n) instead of O(1). Hash maps provide constant-time lookup.

## When You'll See This Pattern

This problem teaches **string parsing with mapping**, a common pattern in:

1. **Roman to Integer (LeetCode 13)**: Similar mapping of symbols to values, though with more complex rules for subtraction cases.
2. **Integer to Roman (LeetCode 12)**: The inverse problem, converting numbers to formatted strings with specific rules.
3. **Excel Sheet Column Title (LeetCode 168)**: Converting between numbering systems with string manipulation.
4. **Valid Phone Numbers (bash)**: Parsing and reformatting strings according to specific patterns.

These problems all involve breaking down a formatted string, converting components using mappings or rules, and reassembling in a new format.

## Key Takeaways

1. **Use dictionaries/hash maps for lookup tables**: When converting between representations (like month names to numbers), a dictionary provides clean, readable, and efficient O(1) lookups.

2. **Pay attention to string slicing indices**: Problems with fixed-format strings often require precise substring extraction. Remember that negative indices count from the end in Python.

3. **Always handle padding for fixed-width formats**: When output requires specific formatting (like two-digit days/months), use built-in padding functions rather than manual conditionals for cleaner code.

[Practice this problem on CodeJeet](/problem/reformat-date)
