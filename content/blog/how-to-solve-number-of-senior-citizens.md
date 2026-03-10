---
title: "How to Solve Number of Senior Citizens — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Number of Senior Citizens. Easy difficulty, 81.3% acceptance rate. Topics: Array, String."
date: "2028-01-13"
category: "dsa-patterns"
tags: ["number-of-senior-citizens", "array", "string", "easy"]
---

# How to Solve Number of Senior Citizens

This problem asks you to count how many passengers in a list are senior citizens based on a compressed string format. While conceptually simple, it tests your ability to work with string slicing and understand fixed-width data formats—a common scenario when processing structured text data. The tricky part is correctly extracting the age information from the right positions in each string.

## Visual Walkthrough

Let's walk through an example to build intuition. Suppose we have:

```
details = ["7868190130M7522", "5303914400F9211", "9273338290F4010"]
```

Each string is exactly 15 characters long with this structure:

- Characters 0-9: Phone number (irrelevant for our task)
- Character 10: Gender (irrelevant for our task)
- Characters 11-12: Age (the two characters we care about)
- Characters 13-14: Seat number (irrelevant for our task)

Let's process each passenger:

1. **First passenger**: `"7868190130M7522"`
   - Characters 11-12: `"75"` (positions 11 and 12 in the string)
   - Convert to integer: 75
   - Is 75 > 60? Yes → Senior citizen
   - Count: 1

2. **Second passenger**: `"5303914400F9211"`
   - Characters 11-12: `"92"` (positions 11 and 12)
   - Convert to integer: 92
   - Is 92 > 60? Yes → Senior citizen
   - Count: 2

3. **Third passenger**: `"9273338290F4010"`
   - Characters 11-12: `"40"` (positions 11 and 12)
   - Convert to integer: 40
   - Is 40 > 60? No → Not a senior citizen
   - Count: 2

Final answer: 2 senior citizens.

## Brute Force Approach

For this problem, there's essentially only one reasonable approach since we must examine every passenger's age. However, a "brute force" way to think about it would be to process each string without leveraging the fixed-width structure knowledge.

A naive candidate might try to:

1. Split each string by some delimiter (but there are none)
2. Search for age patterns using regular expressions (overkill)
3. Manually parse each character looking for digits (inefficient)

The optimal approach is straightforward: iterate through each string, extract the age substring using the known positions, convert it to an integer, and compare with 60.

## Optimal Solution

The solution is simple but requires careful attention to string indexing. We iterate through each passenger's details string, extract the age substring (characters at indices 11 and 12), convert it to an integer, and check if it's greater than 60.

<div class="code-group">

```python
# Time: O(n) where n is number of passengers
# Space: O(1) - only using a counter variable
def countSeniors(details):
    """
    Counts the number of senior citizens (age > 60) in the details list.

    Args:
        details: List of strings, each 15 characters long with format:
                 Phone(10) + Gender(1) + Age(2) + Seat(2)

    Returns:
        Integer count of senior citizens
    """
    senior_count = 0  # Initialize counter

    # Iterate through each passenger's details
    for passenger in details:
        # Extract age substring: characters at indices 11 and 12
        # In Python, string slicing is [start:end] where end is exclusive
        age_str = passenger[11:13]

        # Convert the age string to integer
        age = int(age_str)

        # Check if age is greater than 60
        if age > 60:
            senior_count += 1  # Increment counter

    return senior_count
```

```javascript
// Time: O(n) where n is number of passengers
// Space: O(1) - only using a counter variable
function countSeniors(details) {
  /**
   * Counts the number of senior citizens (age > 60) in the details list.
   *
   * @param {string[]} details - Array of strings, each 15 characters long with format:
   *                             Phone(10) + Gender(1) + Age(2) + Seat(2)
   * @return {number} Integer count of senior citizens
   */
  let seniorCount = 0; // Initialize counter

  // Iterate through each passenger's details
  for (let passenger of details) {
    // Extract age substring: characters at indices 11 and 12
    // JavaScript substring(start, end) extracts up to but not including end
    const ageStr = passenger.substring(11, 13);

    // Convert the age string to integer
    const age = parseInt(ageStr, 10);

    // Check if age is greater than 60
    if (age > 60) {
      seniorCount++; // Increment counter
    }
  }

  return seniorCount;
}
```

```java
// Time: O(n) where n is number of passengers
// Space: O(1) - only using a counter variable
class Solution {
    public int countSeniors(String[] details) {
        /**
         * Counts the number of senior citizens (age > 60) in the details array.
         *
         * @param details Array of strings, each 15 characters long with format:
         *                Phone(10) + Gender(1) + Age(2) + Seat(2)
         * @return Integer count of senior citizens
         */
        int seniorCount = 0;  // Initialize counter

        // Iterate through each passenger's details
        for (String passenger : details) {
            // Extract age substring: characters at indices 11 and 12
            // Java substring(start, end) extracts from start to end-1
            String ageStr = passenger.substring(11, 13);

            // Convert the age string to integer
            int age = Integer.parseInt(ageStr);

            // Check if age is greater than 60
            if (age > 60) {
                seniorCount++;  // Increment counter
            }
        }

        return seniorCount;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through the list of passengers once, where `n` is the number of passengers (length of `details` array)
- For each passenger, we perform constant-time operations: string slicing (O(2) = O(1)), integer conversion (O(2) = O(1)), and comparison (O(1))
- Therefore, total time is O(n)

**Space Complexity: O(1)**

- We only use a single integer variable (`senior_count`/`seniorCount`) to track the count
- No additional data structures that grow with input size
- Even the temporary variables for age string and integer are constant space

## Common Mistakes

1. **Off-by-one errors with string indices**: The most common mistake is using wrong indices for the age substring. Remember that string indices start at 0, so the 11th character is at index 10, 12th at index 11, etc. The age is at indices 11 and 12 (the 12th and 13th characters).

2. **Forgetting to convert string to integer**: Comparing strings lexicographically instead of numerically. For example, `"75" > "60"` is true, but `"7" > "60"` would be false (since `"7"` < `"60"` lexicographically). Always convert to integer before numerical comparison.

3. **Incorrect comparison operator**: Using `>=` instead of `>`. The problem specifies "strictly greater than 60" for senior citizens. Age 60 is not considered senior.

4. **Assuming variable-length strings**: The problem guarantees each string is exactly 15 characters, but some candidates might add unnecessary length checks or handle edge cases that don't exist.

## When You'll See This Pattern

This problem uses **fixed-width string parsing**, a common pattern in data processing:

1. **LeetCode 2490: Circular Sentence** - Similar string parsing with fixed positions or patterns
2. **LeetCode 2129: Capitalize the Title** - Processing strings based on their content and positions
3. **LeetCode 2042: Check if Numbers Are Ascending in a Sentence** - Extracting and comparing numerical values from within strings

The core technique of extracting specific substrings from fixed positions appears in:

- Processing log files with consistent formats
- Reading data from fixed-width file formats (common in legacy systems)
- Parsing structured messages in networking protocols

## Key Takeaways

1. **Fixed-width data parsing**: When data has a consistent structure, use string slicing with known indices rather than searching or splitting. This is more efficient and less error-prone.

2. **Always validate your indices**: When working with string slicing, double-check your start and end indices. A good practice is to write them down or comment them in your code.

3. **Convert before comparing**: When dealing with numerical values embedded in strings, always convert to the appropriate numeric type before performing comparisons or arithmetic operations.

[Practice this problem on CodeJeet](/problem/number-of-senior-citizens)
