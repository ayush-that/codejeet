---
title: "How to Solve Count Items Matching a Rule — LeetCode Easy"
description: "Step-by-step solution guide for LeetCode Count Items Matching a Rule. Easy difficulty, 85.3% acceptance rate. Topics: Array, String."
date: "2028-02-16"
category: "dsa-patterns"
tags: ["count-items-matching-a-rule", "array", "string", "easy"]
---

# How to Solve Count Items Matching a Rule

This problem asks us to count how many items in a list match a given rule. Each item is represented as a list of three strings: `[type, color, name]`. The rule is defined by a `ruleKey` (either "type", "color", or "name") and a `ruleValue` (the string to match). While conceptually simple, this problem tests your ability to handle string comparisons, array indexing, and conditional logic cleanly—skills that form the foundation of many real-world data filtering tasks.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:**

```
items = [["phone","blue","pixel"], ["computer","silver","lenovo"], ["phone","gold","iphone"]]
ruleKey = "color"
ruleValue = "silver"
```

**Step-by-step process:**

1. **First item** `["phone","blue","pixel"]`:
   - `ruleKey = "color"` means we check the color field (index 1)
   - Item's color is `"blue"`
   - Compare `"blue" == "silver"` → **false** (no match)

2. **Second item** `["computer","silver","lenovo"]`:
   - Check color field (index 1)
   - Item's color is `"silver"`
   - Compare `"silver" == "silver"` → **true** (match!)
   - Increment count to 1

3. **Third item** `["phone","gold","iphone"]`:
   - Check color field (index 1)
   - Item's color is `"gold"`
   - Compare `"gold" == "silver"` → **false** (no match)

**Result:** Only 1 item matches, so we return `1`.

The key insight is that we need to map each `ruleKey` string to the correct array index: `"type"` → index 0, `"color"` → index 1, `"name"` → index 2.

## Brute Force Approach

For this problem, there's essentially only one reasonable approach: iterate through all items and count those that match. Any "brute force" would be the same as the optimal solution since we must examine every item at least once to determine if it matches.

However, a naive implementation might use a series of `if-elif-else` statements without first mapping the ruleKey to an index, which leads to repetitive code:

```python
# Inefficient approach with repeated comparisons
count = 0
for item in items:
    if ruleKey == "type" and item[0] == ruleValue:
        count += 1
    elif ruleKey == "color" and item[1] == ruleValue:
        count += 1
    elif ruleKey == "name" and item[2] == ruleValue:
        count += 1
```

While this works, it performs three string comparisons per item instead of one. More importantly, it's error-prone because you might forget to update all conditions if the problem changes (e.g., adding a fourth attribute).

## Optimal Solution

The optimal approach maps the `ruleKey` to an index once, then uses that index for all comparisons. This eliminates redundant string comparisons and makes the code cleaner and more maintainable.

<div class="code-group">

```python
# Time: O(n) | Space: O(1)
def countMatches(items, ruleKey, ruleValue):
    """
    Counts items matching the given rule.

    Args:
        items: List of lists, each containing [type, color, name]
        ruleKey: String, either "type", "color", or "name"
        ruleValue: String value to match against the specified field

    Returns:
        Integer count of matching items
    """
    # Step 1: Map ruleKey to the corresponding index in each item
    # This avoids checking ruleKey for every single item
    key_to_index = {"type": 0, "color": 1, "name": 2}
    index = key_to_index[ruleKey]

    # Step 2: Initialize counter for matching items
    count = 0

    # Step 3: Iterate through all items
    for item in items:
        # Step 4: Compare the value at the determined index with ruleValue
        if item[index] == ruleValue:
            # Step 5: Increment count if values match
            count += 1

    # Step 6: Return the final count
    return count
```

```javascript
// Time: O(n) | Space: O(1)
function countMatches(items, ruleKey, ruleValue) {
  /**
   * Counts items matching the given rule.
   *
   * @param {string[][]} items - Array of arrays, each containing [type, color, name]
   * @param {string} ruleKey - Either "type", "color", or "name"
   * @param {string} ruleValue - Value to match against the specified field
   * @return {number} Count of matching items
   */

  // Step 1: Create mapping from ruleKey to array index
  // Using an object as a dictionary for O(1) lookups
  const keyToIndex = {
    type: 0,
    color: 1,
    name: 2,
  };

  // Step 2: Get the index corresponding to the ruleKey
  const index = keyToIndex[ruleKey];

  // Step 3: Initialize counter
  let count = 0;

  // Step 4: Iterate through all items
  for (let i = 0; i < items.length; i++) {
    // Step 5: Compare value at the determined index with ruleValue
    if (items[i][index] === ruleValue) {
      // Step 6: Increment count if values match
      count++;
    }
  }

  // Step 7: Return final count
  return count;
}
```

```java
// Time: O(n) | Space: O(1)
class Solution {
    public int countMatches(List<List<String>> items, String ruleKey, String ruleValue) {
        /**
         * Counts items matching the given rule.
         *
         * @param items List of lists, each containing [type, color, name]
         * @param ruleKey Either "type", "color", or "name"
         * @param ruleValue Value to match against the specified field
         * @return Count of matching items
         */

        // Step 1: Map ruleKey to the corresponding index
        // Using a HashMap for clean mapping (could also use switch statement)
        Map<String, Integer> keyToIndex = new HashMap<>();
        keyToIndex.put("type", 0);
        keyToIndex.put("color", 1);
        keyToIndex.put("name", 2);

        // Step 2: Get the index for the given ruleKey
        int index = keyToIndex.get(ruleKey);

        // Step 3: Initialize counter
        int count = 0;

        // Step 4: Iterate through all items
        for (List<String> item : items) {
            // Step 5: Compare value at the determined index with ruleValue
            if (item.get(index).equals(ruleValue)) {
                // Step 6: Increment count if values match
                count++;
            }
        }

        // Step 7: Return final count
        return count;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity: O(n)**

- We iterate through all `n` items exactly once
- Each iteration performs a constant-time array access and string comparison
- The initial dictionary lookup is O(1)
- Overall: O(n) where n is the number of items

**Space Complexity: O(1)**

- We use a fixed-size dictionary with 3 entries (constant space)
- We use a few integer variables (count, index)
- No additional data structures that grow with input size
- Overall: O(1) auxiliary space

## Common Mistakes

1. **Hardcoding indices without mapping**: Some candidates write `if ruleKey == "type": index = 0` inside the loop, which repeats the string comparison for every item. This is inefficient and harder to maintain.

2. **Using the wrong comparison operator in Java**: In Java, using `==` for string comparison checks reference equality, not content equality. Always use `.equals()` for comparing string values.

3. **Forgetting to handle case sensitivity**: The problem states the items contain strings, but doesn't specify case sensitivity. In interviews, always ask if comparisons should be case-sensitive. For this problem, we assume exact matches.

4. **Not initializing the counter**: Forgetting to set `count = 0` at the beginning will lead to undefined behavior or compilation errors in some languages.

5. **Assuming items always have exactly 3 elements**: While the problem guarantees this, in real interviews it's good to mention this assumption or add a check if the format isn't guaranteed.

## When You'll See This Pattern

This problem demonstrates the **index mapping** and **filtering/counting** patterns that appear in many data processing tasks:

1. **Filtering with multiple criteria**: Similar to SQL `WHERE` clauses or filtering API responses. The core idea of mapping field names to indices or properties appears in database queries and object-relational mapping.

2. **Two Sum (LeetCode 1)**: While more complex, it also involves iterating through data and checking conditions—though it uses a hash map for O(1) lookups instead of linear scanning.

3. **Find Words Containing Character (LeetCode 2942)**: Another counting/filtering problem where you check each element against a condition and count matches.

4. **Group Anagrams (LeetCode 49)**: Uses mapping (character counts to groups) similar to how we map ruleKey to index, though with more complex keys.

## Key Takeaways

1. **Map once, use many times**: When you have a mapping that doesn't change during iteration (like ruleKey to index), compute it once before the loop rather than inside the loop. This is a simple but effective optimization.

2. **Clean code beats clever code**: The dictionary mapping approach is more readable and maintainable than nested if-else statements. Interviewers appreciate code that's easy to understand and modify.

3. **Recognize O(n) scanning patterns**: Many "easy" array problems involve scanning once and performing constant-time operations per element. If you can solve it with one pass, that's often optimal.

[Practice this problem on CodeJeet](/problem/count-items-matching-a-rule)
