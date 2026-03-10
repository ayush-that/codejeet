---
title: "Medium Oracle Interview Questions: Strategy Guide"
description: "How to tackle 205 medium difficulty questions from Oracle — patterns, time targets, and practice tips."
date: "2032-01-24"
category: "tips"
tags: ["oracle", "medium", "interview prep"]
---

Oracle's interview coding questions have a distinct flavor, especially at the Medium difficulty. With 205 Medium problems in their tagged set, they form the core of their technical assessment. Unlike some companies where Mediums can be thinly disguised Hards, Oracle's Mediums are typically well-defined problems that test your ability to implement a standard algorithm or pattern _correctly and robustly_ under interview pressure. The jump from Easy isn't about discovering a novel, obscure algorithm; it's about managing increased complexity in state, handling multiple moving parts, and writing production-ready code that doesn't just pass sample tests but is resilient.

## Common Patterns and Templates

Oracle's Medium problems heavily favor practical, real-world adjacent algorithms. You'll see a lot of **String Manipulation** (parsing, validation, transformation), **Array/Matrix Traversal** with conditions, **Tree/Graph Traversal** (BFS/DFS) for hierarchical data, and **Greedy Algorithms** with sorting. A very common template, especially for array and string problems, is the **"Sliding Window with Condition Check"** pattern. This isn't just the basic two-pointer sum; it's often a variable-sized window where you need to maintain a data structure (like a hash map or a set) to track the window's state and decide when to shrink it.

Here is a generalized template for this common pattern, as seen in problems like "Longest Substring Without Repeating Characters" (#3) or "Minimum Window Substring" (#76):

<div class="code-group">

```python
def sliding_window_template(s: str, t: str = "") -> int:
    # Initialize pointers and tracking structures
    left = 0
    # freq_map often tracks characters in the target or current window
    freq_map = {}
    # Variables for the answer (e.g., max_len, min_len, count)
    result = 0
    condition_met = 0  # e.g., number of unique chars, or chars matched

    for right in range(len(s)):
        # 1. EXPAND: Add the character at 'right' to the window/state
        char_right = s[right]
        freq_map[char_right] = freq_map.get(char_right, 0) + 1
        # Update condition_met if adding this char meets a new criterion

        # 2. SHRINK: While the current window violates the condition
        while condition_met > k or window_invalid(freq_map, t):  # Example condition
            char_left = s[left]
            freq_map[char_left] -= 1
            if freq_map[char_left] == 0:
                del freq_map[char_left]  # Clean up for some conditions
            # Update condition_met as we remove chars
            left += 1

        # 3. UPDATE ANSWER: Window is now valid, record its property
        # e.g., result = max(result, right - left + 1)
        result = max(result, right - left + 1)

    return result
# Time: O(n) - Each character processed at most twice (by right and left)
# Space: O(k) - For the frequency map, where k is the size of the character set
```

```javascript
function slidingWindowTemplate(s, t = "") {
    let left = 0;
    let freqMap = new Map();
    let result = 0;
    let conditionMet = 0;

    for (let right = 0; right < s.length; right++) {
        // 1. EXPAND
        const charRight = s[right];
        freqMap.set(charRight, (freqMap.get(charRight) || 0) + 1);
        // Update conditionMet

        // 2. SHRINK
        while (/* condition is broken, e.g., conditionMet > k */) {
            const charLeft = s[left];
            freqMap.set(charLeft, freqMap.get(charLeft) - 1);
            if (freqMap.get(charLeft) === 0) {
                freqMap.delete(charLeft);
            }
            // Update conditionMet
            left++;
        }

        // 3. UPDATE ANSWER
        result = Math.max(result, right - left + 1);
    }
    return result;
}
// Time: O(n) | Space: O(k)
```

```java
public int slidingWindowTemplate(String s, String t) {
    int left = 0, result = 0, conditionMet = 0;
    Map<Character, Integer> freqMap = new HashMap<>();

    for (int right = 0; right < s.length(); right++) {
        // 1. EXPAND
        char cRight = s.charAt(right);
        freqMap.put(cRight, freqMap.getOrDefault(cRight, 0) + 1);
        // Update conditionMet

        // 2. SHRINK
        while (/* condition is broken */) {
            char cLeft = s.charAt(left);
            freqMap.put(cLeft, freqMap.get(cLeft) - 1);
            if (freqMap.get(cLeft) == 0) {
                freqMap.remove(cLeft);
            }
            // Update conditionMet
            left++;
        }

        // 3. UPDATE ANSWER
        result = Math.max(result, right - left + 1);
    }
    return result;
}
// Time: O(n) | Space: O(k)
```

</div>

## Time Benchmarks and What Interviewers Look For

For a 45-minute interview slot, you should aim to solve a single Medium problem in **25-30 minutes**. This includes understanding the problem, discussing your approach, writing the code, and walking through test cases. The remaining time is for follow-ups or a second, simpler question.

Beyond a correct solution, Oracle interviewers are keenly watching for:

- **Code Quality and Readability:** Use meaningful variable names (`left`, `right`, not `i`, `j`). Write small, clear functions if logic gets complex. Comment on the _why_ of non-obvious steps.
- **Edge Case Handling:** Don't wait for the interviewer to ask "What if the string is empty?" Proactively state these during your approach discussion and handle them in your code (e.g., early returns).
- **Communication of Trade-offs:** Be prepared to explain _why_ you chose a hash map over an array, or why your solution is O(n) time and O(k) space. This shows you understand the tools, not just the syntax.
- **Testing Your Own Code:** Verbally run through a small, non-trivial example using your written code. This catches off-by-one errors and demonstrates thoroughness.

## Key Differences from Easy Problems

The leap from Easy to Medium at Oracle is defined by three key shifts:

1.  **State Management:** Easy problems often require tracking one or two variables (e.g., a sum, a max). Medium problems require you to manage a more complex _state_, like the character frequency in a sliding window, the nodes at a current BFS level, or the balance of parentheses in a stack.
2.  **Multiple Algorithm Phases:** An Easy might be "traverse and compare." A Medium often involves "sort first, then apply a greedy pass" or "DFS to build a graph, then BFS to find the shortest path." You need to correctly sequence these steps.
3.  **Corner Cases Multiply:** For an Easy array problem, the edge case might be an empty input. For a Medium tree problem, edge cases include a skewed tree (linked list), a tree with duplicate values, or operations on the root node. You must systematically identify these.

## Specific Patterns for Medium

1.  **Modified BFS for Level Order or Shortest Path:** Used in problems like "Binary Tree Level Order Traversal" (#102) or finding the shortest path in a grid with obstacles. The key is using the queue's size to process nodes level-by-level.

    ```python
    from collections import deque
    def bfs_level_order(root):
        if not root: return []
        queue = deque([root])
        result = []
        while queue:
            level_size = len(queue)
            current_level = []
            for _ in range(level_size):
                node = queue.popleft()
                current_level.append(node.val)
                if node.left: queue.append(node.left)
                if node.right: queue.append(node.right)
            result.append(current_level)
        return result
    # Time: O(n) | Space: O(n)
    ```

2.  **Greedy with Sorting or a Heap:** A classic pattern for scheduling or interval problems (e.g., "Meeting Rooms II" #253). You often sort by one dimension (like start time) and then use a min-heap to track the "most readily available resource" (like the earliest ending meeting).
    ```javascript
    // Example: Find minimum number of conference rooms needed
    function minMeetingRooms(intervals) {
      if (!intervals.length) return 0;
      intervals.sort((a, b) => a[0] - b[0]); // Sort by start time
      let endTimes = new MinPriorityQueue(); // Min-heap of end times
      endTimes.enqueue(intervals[0][1]);
      for (let i = 1; i < intervals.length; i++) {
        // If the earliest ending meeting is done by the time this one starts
        if (intervals[i][0] >= endTimes.front().element) {
          endTimes.dequeue();
        }
        endTimes.enqueue(intervals[i][1]);
      }
      return endTimes.size();
    }
    // Time: O(n log n) | Space: O(n)
    ```

## Practice Strategy

Don't just solve problems randomly. Use the 205 Medium questions strategically.

- **First Pass by Pattern:** Group and solve problems by the patterns above (Sliding Window, BFS/DFS, Greedy, etc.). Do 3-5 of each pattern until the template feels automatic.
- **Daily Target:** Aim for 2-3 Medium problems per day under timed conditions (30 minutes max per problem). Spend an equal amount of time reviewing optimal solutions and analyzing your mistakes.
- **Oracle-Focused Set:** After building pattern recognition, filter to only Oracle-tagged Medium questions. Pay special attention to problems involving strings, arrays, and trees, as these are their most common data structures.
- **Mock Interviews:** The final week before your interview, do at least 3-5 full mock interviews with a friend or using a platform, strictly enforcing the 30-minute limit for the coding portion.

The goal is to make the common patterns so familiar that you can dedicate your mental energy during the interview to the unique twist of the problem and to communicating clearly.

[Practice Medium Oracle questions](/company/oracle/medium)
