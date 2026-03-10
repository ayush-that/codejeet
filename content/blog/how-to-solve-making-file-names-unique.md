---
title: "How to Solve Making File Names Unique — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Making File Names Unique. Medium difficulty, 38.4% acceptance rate. Topics: Array, Hash Table, String."
date: "2028-12-01"
category: "dsa-patterns"
tags: ["making-file-names-unique", "array", "hash-table", "string", "medium"]
---

# How to Solve Making File Names Unique

You're given an array of filenames, and whenever a filename already exists, you need to append `(k)` to it where `k` is the smallest positive integer that makes the name unique. The tricky part is that these newly created names can themselves conflict with existing names, creating a chain reaction that requires careful tracking.

## Visual Walkthrough

Let's trace through `names = ["gta","gta(1)","gta","avalon"]`:

1. **"gta"** - First time seen. Output: `["gta"]`
2. **"gta(1)"** - Not seen before. Output: `["gta", "gta(1)"]`
3. **"gta"** - Already exists. Try `"gta(1)"` - exists! Try `"gta(2)"` - doesn't exist. Output: `["gta", "gta(1)", "gta(2)"]`
4. **"avalon"** - First time seen. Output: `["gta", "gta(1)", "gta(2)", "avalon"]`

Notice the chain: When we tried to add the second `"gta"`, `"gta(1)"` already existed from step 2, so we had to skip to `"gta(2)"`.

Another example: `names = ["kaido","kaido(1)","kaido","kaido(1)"]`:

1. **"kaido"** → `["kaido"]`
2. **"kaido(1)"** → `["kaido", "kaido(1)"]`
3. **"kaido"** → exists, try `"kaido(1)"` exists, try `"kaido(2)"` → `["kaido", "kaido(1)", "kaido(2)"]`
4. **"kaido(1)"** → exists, try `"kaido(1)(1)"` → `["kaido", "kaido(1)", "kaido(2)", "kaido(1)(1)"]`

The key insight: We need to track not just original names, but also the next available number for each name pattern.

## Brute Force Approach

A naive approach would be: for each name, check if it exists in our output list. If it does, try appending `(1)`, then `(2)`, etc., until we find a name not in the output list. Then add it.

The problem? This is extremely inefficient - O(n²) in the worst case. For each of n names, we might need to check against all previous names multiple times. With n up to 10⁵, this would time out.

Even worse: consider `names = ["a","a","a","a","a","a","a","a","a","a"]`. For the 10th "a", we'd try "a", "a(1)", "a(2)"... up to "a(9)", checking each against all previous names.

## Optimized Approach

The key insight is that we need to track **two things**:

1. Which names are already taken
2. For each base name, what's the next available number we should try

We can use a hash map (dictionary) to store both:

- The map tracks all names we've used so far
- For each base name, we also track the next available suffix number

When we see a name:

1. If it's not in our map, we can use it as-is
2. If it is in our map, we need to find the next available number
   - Start from the stored next number for this base name
   - Generate candidate names like `name + "(" + k + ")"`
   - Increment k until we find an unused name
3. Add the new name to our map
4. Update the next available number for the base name

But wait - what if the name already has parentheses, like `"gta(1)"`? We need to handle this carefully. The problem states that if a name with parentheses already exists, we treat it as that exact name - we don't parse the parentheses.

## Optimal Solution

We'll use a hash map to track used names and their next available numbers. The clever part is that when we generate a new name like `"name(k)"`, we need to:

1. Add it to our used names set
2. Update the next available number for the **base name** (not the generated name)

<div class="code-group">

```python
# Time: O(n * L) where n is number of names, L is average length of generated names
# Space: O(n * L) for storing all unique names
def getFolderNames(names):
    """
    Generate unique folder names by appending (k) when names conflict.

    Args:
        names: List of original folder names

    Returns:
        List of unique folder names
    """
    # Dictionary to track used names and next available number for each base name
    used = {}
    result = []

    for name in names:
        # If name is not used yet, use it as-is
        if name not in used:
            used[name] = 1  # Next available number for this base name
            result.append(name)
        else:
            # Name already exists, need to find next available number
            k = used[name]

            # Generate candidate names until we find an unused one
            while f"{name}({k})" in used:
                k += 1

            # Found an unused name
            new_name = f"{name}({k})"
            used[new_name] = 1  # This new name might be used as a base later
            used[name] = k + 1  # Update next available number for the base name
            result.append(new_name)

    return result
```

```javascript
// Time: O(n * L) where n is number of names, L is average length of generated names
// Space: O(n * L) for storing all unique names
function getFolderNames(names) {
  /**
   * Generate unique folder names by appending (k) when names conflict.
   *
   * @param {string[]} names - Array of original folder names
   * @return {string[]} Array of unique folder names
   */
  // Map to track used names and next available number for each base name
  const used = new Map();
  const result = [];

  for (const name of names) {
    // If name is not used yet, use it as-is
    if (!used.has(name)) {
      used.set(name, 1); // Next available number for this base name
      result.push(name);
    } else {
      // Name already exists, need to find next available number
      let k = used.get(name);

      // Generate candidate names until we find an unused one
      while (used.has(`${name}(${k})`)) {
        k++;
      }

      // Found an unused name
      const newName = `${name}(${k})`;
      used.set(newName, 1); // This new name might be used as a base later
      used.set(name, k + 1); // Update next available number for the base name
      result.push(newName);
    }
  }

  return result;
}
```

```java
// Time: O(n * L) where n is number of names, L is average length of generated names
// Space: O(n * L) for storing all unique names
import java.util.*;

class Solution {
    public String[] getFolderNames(String[] names) {
        /**
         * Generate unique folder names by appending (k) when names conflict.
         *
         * @param names Array of original folder names
         * @return Array of unique folder names
         */
        // Map to track used names and next available number for each base name
        Map<String, Integer> used = new HashMap<>();
        String[] result = new String[names.length];

        for (int i = 0; i < names.length; i++) {
            String name = names[i];

            // If name is not used yet, use it as-is
            if (!used.containsKey(name)) {
                used.put(name, 1);  // Next available number for this base name
                result[i] = name;
            } else {
                // Name already exists, need to find next available number
                int k = used.get(name);

                // Generate candidate names until we find an unused one
                while (used.containsKey(name + "(" + k + ")")) {
                    k++;
                }

                // Found an unused name
                String newName = name + "(" + k + ")";
                used.put(newName, 1);  // This new name might be used as a base later
                used.put(name, k + 1);  // Update next available number for the base name
                result[i] = newName;
            }
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × L) where n is the number of names and L is the average length of generated names. In the worst case, we might need to try many numbers for each name, but each check is O(1) hash map lookup. The while loop might seem expensive, but notice that each number k is tried at most once across the entire algorithm - once we use `name(k)`, we never check it again.

**Space Complexity:** O(n × L) for storing all unique names in the hash map and result array. Each name could be up to length L, and we store n of them.

## Common Mistakes

1. **Not updating the base name's next available number:** After finding `name(k)`, you must update `used[name]` to `k+1`. Otherwise, you'll start from 1 every time, causing O(n²) behavior.

2. **Forgetting to add generated names to the map:** When you create `name(k)`, you need to add it to the map with value 1, because it could be used as a base name later (e.g., if you see `"name(k)"` in the input).

3. **Trying to parse parentheses from input names:** The problem states that if `"name(1)"` appears in the input, it should be treated as the literal string `"name(1)"`, not as `name` with suffix 1. Only add parentheses when you need to make a name unique.

4. **Starting k from 1 every time:** This causes the algorithm to re-check already used names. By tracking the next available number in the map, we skip directly to the first potentially available number.

## When You'll See This Pattern

This problem combines hash maps with incremental generation - a pattern seen in:

1. **Design Underground System (LeetCode 1396):** Uses nested hash maps to track cumulative data and compute averages efficiently.

2. **Logger Rate Limiter (LeetCode 359):** Uses a hash map to track timestamps of messages, similar to how we track names and their next numbers.

3. **Design Authentication Manager (LeetCode 1797):** Uses hash maps to manage token expiration with efficient renewal operations.

The core pattern is using hash maps not just for existence checks, but to store additional metadata (like next available numbers) that enables efficient incremental operations.

## Key Takeaways

1. **Hash maps can store more than just existence:** They can track metadata (like next available numbers) that makes algorithms more efficient by avoiding redundant work.

2. **Incremental generation benefits from state tracking:** When generating sequential items (like numbered suffixes), track where you left off to avoid restarting from the beginning each time.

3. **Watch for chain reactions:** In this problem, generated names can themselves become base names. Always consider how your solution handles derived data that might be reused.

[Practice this problem on CodeJeet](/problem/making-file-names-unique)
