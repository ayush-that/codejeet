---
title: "Medium Intuit Interview Questions: Strategy Guide"
description: "How to tackle 47 medium difficulty questions from Intuit — patterns, time targets, and practice tips."
date: "2032-06-22"
category: "tips"
tags: ["intuit", "medium", "interview prep"]
---

Medium questions at Intuit are the core of their technical screen. With 47 out of 71 total questions rated Medium, this is the battleground where most interviews are won or lost. Unlike Easy questions, which often test basic syntax and single-concept application, Intuit's Medium problems are designed to simulate the kind of work you'd do on their financial and tax platforms: transforming, validating, and connecting real-world data. The jump in difficulty isn't about obscure algorithms; it's about cleanly orchestrating 2-3 fundamental concepts under time pressure and with production-level code clarity.

## Common Patterns and Templates

Intuit's Medium problems heavily favor **array/string manipulation**, **hash map applications for counting/grouping**, and **simulation-based matrix traversal**. You'll rarely see complex graph theory or dynamic programming puzzles. Instead, you'll get problems that feel like data processing tasks: find duplicate transactions, validate a sequence of operations, or reconcile two sets of records.

The most common template is the **"Single Pass with Auxiliary Data Structure"** pattern. You traverse the input once, using a hash map, set, or stack to track state, make decisions, and build the output. This pattern is the workhorse for problems like "Find All Duplicates in an Array" or "Group Anagrams."

<div class="code-group">

```python
# Template: Single Pass with Hash Map for Counting/Grouping
# Time: O(n) | Space: O(n)
def intuit_medium_template(arr):
    """
    Common pattern: Process data in one pass, using a dict to
    track counts, indices, or groups for immediate lookup.
    """
    result = []
    seen = {}  # or defaultdict, Counter

    for i, value in enumerate(arr):
        # Decision logic based on what we've seen
        if value in seen:
            # e.g., found a duplicate, can reconcile
            result.append(value)
        else:
            # Store state for future comparison
            seen[value] = i  # or count, or list of indices

    return result
```

```javascript
// Template: Single Pass with Hash Map for Counting/Grouping
// Time: O(n) | Space: O(n)
function intuitMediumTemplate(arr) {
  /**
   * Common pattern: Process data in one pass, using a Map or object to
   * track counts, indices, or groups for immediate lookup.
   */
  const result = [];
  const seen = new Map(); // or {}

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    // Decision logic based on what we've seen
    if (seen.has(value)) {
      // e.g., found a duplicate, can reconcile
      result.push(value);
    } else {
      // Store state for future comparison
      seen.set(value, i); // or count, or array of indices
    }
  }
  return result;
}
```

```java
// Template: Single Pass with Hash Map for Counting/Grouping
// Time: O(n) | Space: O(n)
import java.util.*;

public List<Integer> intuitMediumTemplate(int[] arr) {
    /**
     * Common pattern: Process data in one pass, using a HashMap to
     * track counts, indices, or groups for immediate lookup.
     */
    List<Integer> result = new ArrayList<>();
    Map<Integer, Integer> seen = new HashMap<>(); // or Map for other value types

    for (int i = 0; i < arr.length; i++) {
        int value = arr[i];
        // Decision logic based on what we've seen
        if (seen.containsKey(value)) {
            // e.g., found a duplicate, can reconcile
            result.add(value);
        } else {
            // Store state for future comparison
            seen.put(value, i); // or count, or list of indices
        }
    }
    return result;
}
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot, you should aim to solve a Medium problem in **25-30 minutes**. This leaves 10-15 minutes for introduction, problem clarification, and follow-up questions. The clock starts when the problem statement is given.

Beyond correctness, Intuit interviewers are trained to watch for specific signals:

1.  **Code Quality First:** They read your code as if reviewing a PR. Use meaningful variable names (`transactionMap`, not `tm`). Write small, single-responsibility functions if the problem allows. Comment to explain _why_, not _what_.
2.  **Edge Case Hunting:** Explicitly call out edge cases _before_ you code. For financial data, this means empty input, large values, negative numbers, duplicate entries, and sorted vs. unsorted data. Saying "Assuming the input isn't null, but in production we'd check..." shows foresight.
3.  **Trade-off Communication:** When you choose a hash map over an array for lookups, verbally note the trade-off: "This gives us O(1) lookups but uses O(n) space." This demonstrates you understand the cost of your tools.

## Key Differences from Easy Problems

The leap from Easy to Medium at Intuit isn't about knowing more algorithms; it's about **orchestration and constraint management**. An Easy problem might ask you to find if a value exists (a one-line `in` check). A Medium problem asks you to find _all_ values that appear _exactly twice_ in an array _without extra space_ (LeetCode #442). This requires:

- **Pattern Recognition:** You must see that the "no extra space" constraint points to using the input array itself for marking, often via negation or index manipulation.
- **Multi-Step Logic:** The solution isn't a single operation. It's a loop to mark, then a second loop to collect results.
- **State Management:** You need to track what you've seen and what you've already reported, ensuring you don't double-count.

The mindset shift is from "What's the right function to call?" to "How can I transform this data step-by-step to reveal the answer?"

## Specific Patterns for Medium

1.  **In-Place Array Marking (for "no extra space" constraints):** Used in problems like "Find All Duplicates in an Array" (#442). Since values are `1 ≤ a[i] ≤ n`, you can use the sign of the number at index `abs(value)-1` as a visited flag.

    <div class="code-group">

    ```python
    # Find All Duplicates in an Array - In-Place Marking
    # Time: O(n) | Space: O(1) excluding output
    def findDuplicates(nums):
        res = []
        for num in nums:
            idx = abs(num) - 1
            if nums[idx] < 0:
                res.append(abs(num))
            else:
                nums[idx] *= -1
        return res
    ```

    ```javascript
    // Find All Duplicates in an Array - In-Place Marking
    // Time: O(n) | Space: O(1) excluding output
    function findDuplicates(nums) {
      const res = [];
      for (const num of nums) {
        const idx = Math.abs(num) - 1;
        if (nums[idx] < 0) {
          res.push(Math.abs(num));
        } else {
          nums[idx] *= -1;
        }
      }
      return res;
    }
    ```

    ```java
    // Find All Duplicates in an Array - In-Place Marking
    // Time: O(n) | Space: O(1) excluding output
    public List<Integer> findDuplicates(int[] nums) {
        List<Integer> res = new ArrayList<>();
        for (int num : nums) {
            int idx = Math.abs(num) - 1;
            if (nums[idx] < 0) {
                res.add(Math.abs(num));
            } else {
                nums[idx] *= -1;
            }
        }
        return res;
    }
    ```

    </div>

2.  **Simulation with Direction Vectors:** For matrix problems like "Spiral Matrix" (#54), you don't need complex recursion. Use a direction array `[(0,1), (1,0), (0,-1), (-1,0)]` and update boundaries (`top`, `bottom`, `left`, `right`) as you traverse each row/column. This is a systematic, bug-resistant approach that interviewers appreciate for its clarity.

## Practice Strategy

Don't just solve all 47 questions. Practice with intent:

1.  **First Pass (Pattern Identification):** Spend 15 minutes _only_ identifying the pattern and sketching the approach. If it's a hash map problem, what's the key? If it's in-place, what are you marking? If you can't see it, check the solution's _approach_, not the code.
2.  **Daily Target:** 2-3 problems per day, but with full interview simulation. Timebox yourself to 25 minutes of coding per problem, including verbal explanation.
3.  **Recommended Order:** Start with high-frequency patterns:
    - Array manipulation with hash maps (e.g., "Two Sum" #1, "Group Anagrams" #49)
    - In-place array marking ("Find All Duplicates" #442)
    - Matrix simulation ("Spiral Matrix" #54)
    - String parsing and validation ("Basic Calculator II" #227)
4.  **Second Pass (Optimization):** Revisit problems you solved but whose code was messy. Refactor for readability. Can you reduce the number of variables? Can you make the loop logic more obvious?

The goal isn't to memorize 47 solutions. It's to internalize the 5-6 templates Intuit uses so that when you see a new Medium problem, you recognize the underlying data processing task and can assemble a clean solution under pressure.

[Practice Medium Intuit questions](/company/intuit/medium)
