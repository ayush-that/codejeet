---
title: "How to Solve Number of Atoms — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Number of Atoms. Hard difficulty, 65.1% acceptance rate. Topics: Hash Table, String, Stack, Sorting."
date: "2026-07-19"
category: "dsa-patterns"
tags: ["number-of-atoms", "hash-table", "string", "stack", "hard"]
---

# How to Solve Number of Atoms

This problem asks you to parse a chemical formula string and count all atoms, handling parentheses and multipliers just like real chemical formulas. What makes this tricky is the nested structure — parentheses can contain other parentheses, and numbers outside parentheses multiply everything inside. It's essentially a parsing problem with recursion or stack-based evaluation, similar to evaluating arithmetic expressions with parentheses.

## Visual Walkthrough

Let's trace through `"K4(ON(SO3)2)2"` step by step:

1. Start with empty counts: `{}`
2. Parse `K4` → `K: 4` → `{K:4}`
3. Encounter `(` → push current counts to stack, start fresh parsing inside parentheses
   - Stack: `[{K:4}]`, current: `{}`
4. Parse `ON` → `O:1, N:1` → `{O:1, N:1}`
5. Encounter `(` → push again
   - Stack: `[{K:4}, {O:1, N:1}]`, current: `{}`
6. Parse `SO3` → `S:1, O:3` → `{S:1, O:3}`
7. Encounter `)` with `2` after it → multiply current by 2: `{S:2, O:6}`
8. Pop from stack and merge: current = `{O:1, N:1, S:2, O:6}` → `{O:7, N:1, S:2}`
9. Encounter `)` with `2` after it → multiply current by 2: `{O:14, N:2, S:4}`
10. Pop from stack and merge: `{K:4, O:14, N:2, S:4}`

Final sorted result: `"K4N2O14S4"`

## Brute Force Approach

A naive approach might try to parse linearly without handling nested parentheses correctly. For example, someone might:

1. Scan for elements and their counts
2. When encountering `(`, try to find matching `)` and recursively parse
3. Multiply counts by any following number

The challenge is that without proper stack management, you'll lose track of which counts belong to which level. A truly brute force solution would involve repeatedly scanning the string to find matching parentheses and manually tracking nesting levels, which becomes O(n²) in worst case with deeply nested formulas.

The main issue with naive approaches is they don't properly handle:

- Multiple levels of nesting
- Merging counts from different branches
- Multipliers that apply to entire groups

## Optimized Approach

The key insight is to use a **stack** to track counts at different nesting levels, similar to how we evaluate arithmetic expressions. Here's the step-by-step reasoning:

1. **Parse elements**: When we see an uppercase letter, it's the start of an element. Collect the element name (uppercase + optional lowercase letters).

2. **Parse counts**: After an element or closing parenthesis, there may be a number. Parse it fully (could be multi-digit).

3. **Handle opening parentheses**: Push current counts onto stack and start fresh counts for inside the parentheses.

4. **Handle closing parentheses**:
   - Parse any multiplier after the `)`
   - Multiply all counts in current scope by that multiplier
   - Pop from stack and merge with parent scope

5. **Merge counts**: When exiting a scope, add its counts to the parent scope.

6. **Sort output**: Finally, sort elements alphabetically and format with counts (omit `1`).

This approach processes the string in a single left-to-right pass (O(n)) using a stack to manage scope, making it optimal.

## Optimal Solution

<div class="code-group">

```python
# Time: O(n log n) where n is length of formula (sorting dominates)
# Space: O(n) for the stack and count dictionaries
def countOfAtoms(formula: str) -> str:
    stack = [{}]  # Stack of dictionaries, each representing counts at a level
    i = 0
    n = len(formula)

    while i < n:
        if formula[i] == '(':
            # Start new scope
            stack.append({})
            i += 1
        elif formula[i] == ')':
            # Close current scope, apply multiplier if any
            current = stack.pop()
            i += 1

            # Parse multiplier after ')'
            start = i
            while i < n and formula[i].isdigit():
                i += 1
            multiplier = int(formula[start:i]) if start < i else 1

            # Multiply all counts in current scope
            for element in current:
                current[element] *= multiplier

            # Merge with parent scope
            parent = stack[-1]
            for element in current:
                parent[element] = parent.get(element, 0) + current[element]
        else:
            # Parse element name
            start = i
            i += 1
            while i < n and formula[i].islower():
                i += 1
            element = formula[start:i]

            # Parse count after element
            start = i
            while i < n and formula[i].isdigit():
                i += 1
            count = int(formula[start:i]) if start < i else 1

            # Add to current scope
            current = stack[-1]
            current[element] = current.get(element, 0) + count

    # Get final counts from root scope
    counts = stack[0]

    # Sort elements alphabetically and format
    result = []
    for element in sorted(counts.keys()):
        result.append(element)
        if counts[element] > 1:
            result.append(str(counts[element]))

    return ''.join(result)
```

```javascript
// Time: O(n log n) where n is length of formula (sorting dominates)
// Space: O(n) for the stack and count maps
function countOfAtoms(formula) {
  const stack = [new Map()]; // Stack of maps for counts at each level
  let i = 0;
  const n = formula.length;

  while (i < n) {
    if (formula[i] === "(") {
      // Start new scope
      stack.push(new Map());
      i++;
    } else if (formula[i] === ")") {
      // Close current scope, apply multiplier if any
      const current = stack.pop();
      i++;

      // Parse multiplier after ')'
      let start = i;
      while (i < n && /[0-9]/.test(formula[i])) {
        i++;
      }
      const multiplier = start < i ? parseInt(formula.substring(start, i), 10) : 1;

      // Multiply all counts in current scope
      for (const [element, count] of current.entries()) {
        current.set(element, count * multiplier);
      }

      // Merge with parent scope
      const parent = stack[stack.length - 1];
      for (const [element, count] of current.entries()) {
        parent.set(element, (parent.get(element) || 0) + count);
      }
    } else {
      // Parse element name (uppercase + optional lowercase)
      let start = i;
      i++;
      while (i < n && /[a-z]/.test(formula[i])) {
        i++;
      }
      const element = formula.substring(start, i);

      // Parse count after element
      start = i;
      while (i < n && /[0-9]/.test(formula[i])) {
        i++;
      }
      const count = start < i ? parseInt(formula.substring(start, i), 10) : 1;

      // Add to current scope
      const current = stack[stack.length - 1];
      current.set(element, (current.get(element) || 0) + count);
    }
  }

  // Get final counts from root scope
  const counts = stack[0];

  // Sort elements alphabetically and format
  const sortedElements = Array.from(counts.keys()).sort();
  const result = [];
  for (const element of sortedElements) {
    result.push(element);
    if (counts.get(element) > 1) {
      result.push(counts.get(element).toString());
    }
  }

  return result.join("");
}
```

```java
// Time: O(n log n) where n is length of formula (sorting dominates)
// Space: O(n) for the stack and count maps
import java.util.*;

class Solution {
    public String countOfAtoms(String formula) {
        Deque<Map<String, Integer>> stack = new ArrayDeque<>();
        stack.push(new HashMap<>()); // Root level counts
        int i = 0;
        int n = formula.length();

        while (i < n) {
            if (formula.charAt(i) == '(') {
                // Start new scope
                stack.push(new HashMap<>());
                i++;
            } else if (formula.charAt(i) == ')') {
                // Close current scope, apply multiplier if any
                Map<String, Integer> current = stack.pop();
                i++;

                // Parse multiplier after ')'
                int start = i;
                while (i < n && Character.isDigit(formula.charAt(i))) {
                    i++;
                }
                int multiplier = start < i ? Integer.parseInt(formula.substring(start, i)) : 1;

                // Multiply all counts in current scope
                for (String element : current.keySet()) {
                    current.put(element, current.get(element) * multiplier);
                }

                // Merge with parent scope
                Map<String, Integer> parent = stack.peek();
                for (Map.Entry<String, Integer> entry : current.entrySet()) {
                    String element = entry.getKey();
                    int count = entry.getValue();
                    parent.put(element, parent.getOrDefault(element, 0) + count);
                }
            } else {
                // Parse element name (uppercase + optional lowercase)
                int start = i;
                i++;
                while (i < n && Character.isLowerCase(formula.charAt(i))) {
                    i++;
                }
                String element = formula.substring(start, i);

                // Parse count after element
                start = i;
                while (i < n && Character.isDigit(formula.charAt(i))) {
                    i++;
                }
                int count = start < i ? Integer.parseInt(formula.substring(start, i)) : 1;

                // Add to current scope
                Map<String, Integer> current = stack.peek();
                current.put(element, current.getOrDefault(element, 0) + count);
            }
        }

        // Get final counts from root scope
        Map<String, Integer> counts = stack.pop();

        // Sort elements alphabetically
        List<String> elements = new ArrayList<>(counts.keySet());
        Collections.sort(elements);

        // Format result
        StringBuilder result = new StringBuilder();
        for (String element : elements) {
            result.append(element);
            int count = counts.get(element);
            if (count > 1) {
                result.append(count);
            }
        }

        return result.toString();
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n log n) where n is the length of the formula. We make a single pass through the string (O(n)), but the final sorting of element names takes O(k log k) where k is the number of unique elements. In worst case, k could be O(n) (if every character is a different element), so overall O(n log n).

**Space Complexity:** O(n) for the stack and count dictionaries. In worst case with deeply nested formulas, the stack could contain O(n) levels, and each level's dictionary could contain O(n) entries total across all levels.

## Common Mistakes

1. **Not handling multi-digit numbers correctly**: Candidates often parse only one digit after elements or parentheses. Remember numbers like `123` should be parsed as `123`, not `1`, then `2`, then `3`.

2. **Forgetting to multiply counts when exiting parentheses**: When you see `)2`, you need to multiply ALL counts from inside the parentheses by 2, not just the last element.

3. **Incorrect element name parsing**: Element names are uppercase letter followed by zero or more lowercase letters. `Mg` is one element, not `M` and `g`. `He` is helium, not `H` and `e`.

4. **Not sorting output alphabetically**: The problem requires output in alphabetical order. Many candidates forget this final step after counting.

## When You'll See This Pattern

This stack-based parsing pattern appears in many problems involving nested structures:

1. **Decode String (LeetCode 394)**: Similar concept of parsing multipliers and nested content, but with strings instead of chemical formulas.

2. **Basic Calculator (LeetCode 224)**: Evaluating arithmetic expressions with parentheses uses similar stack-based scope management.

3. **Parse Lisp Expression (LeetCode 736)**: More complex but same core idea of parsing nested expressions with different evaluation contexts.

The pattern is: when you need to evaluate something with nested scopes (parentheses, brackets, etc.), use a stack to track the state at each level.

## Key Takeaways

1. **Stack for nested scopes**: Whenever you see parentheses or brackets creating nested evaluation contexts, think about using a stack to manage state at each level.

2. **Incremental parsing**: Parse the string left-to-right, handling different token types (elements, numbers, parentheses) as you encounter them.

3. **Merge on scope exit**: When closing a scope, apply any operations (like multiplication) to that scope's results before merging with the parent scope.

Related problems: [Decode String](/problem/decode-string), [Encode String with Shortest Length](/problem/encode-string-with-shortest-length), [Parse Lisp Expression](/problem/parse-lisp-expression)
