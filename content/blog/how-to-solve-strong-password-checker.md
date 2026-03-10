---
title: "How to Solve Strong Password Checker — LeetCode Hard"
description: "Step-by-step solution guide for LeetCode Strong Password Checker. Hard difficulty, 15.5% acceptance rate. Topics: String, Greedy, Heap (Priority Queue)."
date: "2028-06-06"
category: "dsa-patterns"
tags: ["strong-password-checker", "string", "greedy", "heap-(priority-queue)", "hard"]
---

## How to Solve Strong Password Checker

This problem asks us to find the **minimum number of changes** needed to make a password "strong" according to three rules: length between 6-20 characters, containing at least one lowercase letter, one uppercase letter, and one digit, and having no three identical characters in a row. What makes this problem **hard** is that these requirements interact in complex ways—fixing one issue (like length) can affect others (like repeating characters), and we need to find the globally optimal sequence of edits.

---

## Visual Walkthrough

Let's trace through `"aaaabbbbccccddeed"` (length 18):

**Step 1: Check missing character types**

- Has lowercase? Yes (`a`, `b`, `c`, `d`, `e`)
- Has uppercase? No → need to add 1 uppercase or change a character
- Has digit? No → need to add 1 digit or change a character  
  Missing types count = 2

**Step 2: Find repeating sequences of 3+ identical characters**

- `"aaaa"` → length 4 → one sequence of 4
- `"bbbb"` → length 4 → one sequence of 4
- `"cccc"` → length 4 → one sequence of 4
- `"dd"` → length 2 (ok)
- `"ee"` → length 2 (ok)

We have three sequences of length 4. Each sequence of length `L` needs `floor(L/3)` replacements to break repeats (changing every third character).

**Step 3: Handle length issues**  
Current length = 18 (within 6-20, so no length adjustment needed).

**Step 4: Resolve conflicts**  
We need at least 2 changes for missing types, and at least `floor(4/3) + floor(4/3) + floor(4/3) = 1+1+1 = 3` changes for repeats.  
But wait—each replacement can also fix a missing type! If we change an `'a'` to `'A'` and a `'b'` to `'1'`, we fix both repeats AND missing types simultaneously.  
So we prioritize using replacements to kill two birds with one stone.

**Step 5: Calculate minimum**  
We need max(missing_types, total_replacements_needed) = max(2, 3) = 3 changes.  
Let's verify: Change 3rd `'a'` to `'A'`, 3rd `'b'` to `'1'`, 3rd `'c'` to `'D'`. Result: `"aaAab1bccDddeed"` — now has uppercase, digit, and no triple repeats.

---

## Brute Force Approach

A brute force would try all possible edit sequences: insert, delete, or replace at any position. For length `n`, there are roughly `3^n` possibilities—completely infeasible. Even a smarter brute force that tries to satisfy each constraint independently fails because edits affect multiple constraints simultaneously.

The key difficulty is that **deletions** are cheap for fixing repeats when the password is too long, but **replacements** are better when we also need to add missing character types. We need a **priority-based approach** that handles length adjustments and repeat-breaking optimally.

---

## Optimized Approach

The optimal solution uses **greedy prioritization** with these steps:

1. **Count missing character types** (lowercase, uppercase, digit).
2. **Find all sequences of 3+ identical characters**, record their lengths.
3. **Handle three length cases separately**:
   - **Too short** (<6): We need inserts. Each insert can also fix a missing type or break a repeat.
   - **Too long** (>20): We need deletions. Each deletion is most effective when it breaks a long repeat sequence.
   - **Just right** (6-20): We only need replacements/inserts for missing types and repeats.

**The tricky part**: When too long, we should delete characters from the **longest repeat sequences first**, because:

- Deleting from a sequence of length `L` reduces needed replacements by 1 if `L % 3 == 0` (most efficient).
- Next best is `L % 3 == 1`, then `L % 3 == 2`.

**Why?**  
A sequence of length `L` needs `floor(L/3)` replacements. If `L % 3 == 0`, deleting one character makes it `L-1`, and now it needs `floor((L-1)/3) = floor(L/3) - 1` replacements—we saved one replacement with one deletion!  
If `L % 3 == 1`, we need to delete 2 characters to save one replacement.  
If `L % 3 == 2`, we need to delete 3 characters to save one replacement.

So we **prioritize deletions from sequences where `L % 3 == 0`** to maximize efficiency.

---

## Optimal Solution

We implement this with a priority queue (min-heap) keyed by `L % 3` to handle deletions optimally when password is too long.

<div class="code-group">

```python
# Time: O(n) | Space: O(n)
def strongPasswordChecker(password: str) -> int:
    n = len(password)

    # Step 1: Check missing character types
    missing_types = 3
    if any('a' <= c <= 'z' for c in password):
        missing_types -= 1
    if any('A' <= c <= 'Z' for c in password):
        missing_types -= 1
    if any(c.isdigit() for c in password):
        missing_types -= 1

    # Step 2: Find all sequences of 3+ identical characters
    repeats = []
    i = 0
    while i < n:
        j = i
        while j < n and password[j] == password[i]:
            j += 1
        length = j - i
        if length >= 3:
            repeats.append(length)
        i = j

    # Step 3: Handle three cases based on length
    if n < 6:
        # Too short: we need inserts
        # Each insert can fix a missing type or break a repeat
        # Minimum changes = max(missing_types, 6 - n) because:
        # - We need at least (6-n) inserts to reach length 6
        # - Each insert can also satisfy a missing type
        return max(missing_types, 6 - n)

    elif n <= 20:
        # Length is okay, only need replacements
        # Each replacement can fix a missing type AND break a repeat
        total_replacements = 0
        for length in repeats:
            total_replacements += length // 3  # floor division

        # We can use replacements to fix missing types too
        return max(missing_types, total_replacements)

    else:
        # Too long: need deletions
        deletions_needed = n - 20
        deletions_done = 0

        # Use priority queue (min-heap) keyed by L % 3
        # Python's heapq is min-heap, so we use L % 3 as key
        import heapq
        heap = []
        for length in repeats:
            heapq.heappush(heap, (length % 3, length))

        # Apply deletions optimally
        while heap and deletions_done < deletions_needed:
            mod, length = heapq.heappop(heap)
            if mod == 0:
                # Most efficient: delete 1 char saves 1 replacement
                deletions_done += 1
                length -= 1
                if length >= 3:
                    heapq.heappush(heap, ((length) % 3, length))
            elif mod == 1 and deletions_done + 2 <= deletions_needed:
                # Delete 2 chars to save 1 replacement
                deletions_done += 2
                length -= 2
                if length >= 3:
                    heapq.heappush(heap, ((length) % 3, length))
            elif mod == 2 and deletions_done + 3 <= deletions_needed:
                # Delete 3 chars to save 1 replacement
                deletions_done += 3
                length -= 3
                if length >= 3:
                    heapq.heappush(heap, ((length) % 3, length))
            else:
                # Can't delete more from this sequence efficiently
                heapq.heappush(heap, (mod, length))
                break

        # Calculate remaining replacements after optimal deletions
        total_replacements = 0
        for mod, length in heap:
            total_replacements += length // 3

        # Remaining deletions (if any) don't help with repeats
        remaining_deletions = deletions_needed - deletions_done

        # Total changes = deletions + max(missing_types, remaining_replacements)
        # Because replacements can also fix missing types
        return deletions_needed + max(missing_types, total_replacements)
```

```javascript
// Time: O(n) | Space: O(n)
function strongPasswordChecker(password) {
  const n = password.length;

  // Step 1: Check missing character types
  let missingTypes = 3;
  if (/[a-z]/.test(password)) missingTypes--;
  if (/[A-Z]/.test(password)) missingTypes--;
  if (/[0-9]/.test(password)) missingTypes--;

  // Step 2: Find all sequences of 3+ identical characters
  const repeats = [];
  let i = 0;
  while (i < n) {
    let j = i;
    while (j < n && password[j] === password[i]) j++;
    const length = j - i;
    if (length >= 3) repeats.push(length);
    i = j;
  }

  // Step 3: Handle three cases based on length
  if (n < 6) {
    // Too short: need inserts
    return Math.max(missingTypes, 6 - n);
  } else if (n <= 20) {
    // Length okay, only need replacements
    let totalReplacements = 0;
    for (const length of repeats) {
      totalReplacements += Math.floor(length / 3);
    }
    return Math.max(missingTypes, totalReplacements);
  } else {
    // Too long: need deletions
    const deletionsNeeded = n - 20;
    let deletionsDone = 0;

    // Use priority queue (min-heap) keyed by L % 3
    const heap = new MinHeap();
    for (const length of repeats) {
      heap.insert(length % 3, length);
    }

    // Apply deletions optimally
    while (!heap.isEmpty() && deletionsDone < deletionsNeeded) {
      const { mod, length } = heap.extractMin();
      if (mod === 0 && deletionsDone + 1 <= deletionsNeeded) {
        // Delete 1 char saves 1 replacement
        deletionsDone += 1;
        const newLength = length - 1;
        if (newLength >= 3) heap.insert(newLength % 3, newLength);
      } else if (mod === 1 && deletionsDone + 2 <= deletionsNeeded) {
        // Delete 2 chars to save 1 replacement
        deletionsDone += 2;
        const newLength = length - 2;
        if (newLength >= 3) heap.insert(newLength % 3, newLength);
      } else if (mod === 2 && deletionsDone + 3 <= deletionsNeeded) {
        // Delete 3 chars to save 1 replacement
        deletionsDone += 3;
        const newLength = length - 3;
        if (newLength >= 3) heap.insert(newLength % 3, newLength);
      } else {
        // Can't delete more efficiently
        heap.insert(mod, length);
        break;
      }
    }

    // Calculate remaining replacements after optimal deletions
    let totalReplacements = 0;
    const remaining = heap.getAll();
    for (const { length } of remaining) {
      totalReplacements += Math.floor(length / 3);
    }

    // Remaining deletions don't help with repeats
    const remainingDeletions = deletionsNeeded - deletionsDone;

    // Total changes = deletions + max(missingTypes, remaining_replacements)
    return deletionsNeeded + Math.max(missingTypes, totalReplacements);
  }
}

// Min-heap implementation for JavaScript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(mod, length) {
    this.heap.push({ mod, length });
    this._bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._sinkDown(0);
    }
    return min;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  getAll() {
    return [...this.heap];
  }

  _bubbleUp(index) {
    const node = this.heap[index];
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIdx];
      if (node.mod >= parent.mod) break;
      this.heap[parentIdx] = node;
      this.heap[index] = parent;
      index = parentIdx;
    }
  }

  _sinkDown(index) {
    const length = this.heap.length;
    const node = this.heap[index];
    while (true) {
      let leftChildIdx = 2 * index + 1;
      let rightChildIdx = 2 * index + 2;
      let swap = null;
      let leftChild, rightChild;

      if (leftChildIdx < length) {
        leftChild = this.heap[leftChildIdx];
        if (leftChild.mod < node.mod) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.heap[rightChildIdx];
        if (
          (swap === null && rightChild.mod < node.mod) ||
          (swap !== null && rightChild.mod < leftChild.mod)
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = node;
      index = swap;
    }
  }
}
```

```java
// Time: O(n) | Space: O(n)
import java.util.*;

class Solution {
    public int strongPasswordChecker(String password) {
        int n = password.length();

        // Step 1: Check missing character types
        int missingTypes = 3;
        if (password.chars().anyMatch(c -> 'a' <= c && c <= 'z')) missingTypes--;
        if (password.chars().anyMatch(c -> 'A' <= c && c <= 'Z')) missingTypes--;
        if (password.chars().anyMatch(Character::isDigit)) missingTypes--;

        // Step 2: Find all sequences of 3+ identical characters
        List<Integer> repeats = new ArrayList<>();
        int i = 0;
        while (i < n) {
            int j = i;
            while (j < n && password.charAt(j) == password.charAt(i)) j++;
            int length = j - i;
            if (length >= 3) repeats.add(length);
            i = j;
        }

        // Step 3: Handle three cases based on length
        if (n < 6) {
            // Too short: need inserts
            return Math.max(missingTypes, 6 - n);
        } else if (n <= 20) {
            // Length okay, only need replacements
            int totalReplacements = 0;
            for (int length : repeats) {
                totalReplacements += length / 3;
            }
            return Math.max(missingTypes, totalReplacements);
        } else {
            // Too long: need deletions
            int deletionsNeeded = n - 20;
            int deletionsDone = 0;

            // Use priority queue (min-heap) keyed by L % 3
            PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
            for (int length : repeats) {
                heap.offer(new int[]{length % 3, length});
            }

            // Apply deletions optimally
            while (!heap.isEmpty() && deletionsDone < deletionsNeeded) {
                int[] pair = heap.poll();
                int mod = pair[0];
                int length = pair[1];

                if (mod == 0 && deletionsDone + 1 <= deletionsNeeded) {
                    // Delete 1 char saves 1 replacement
                    deletionsDone += 1;
                    length -= 1;
                    if (length >= 3) heap.offer(new int[]{length % 3, length});
                } else if (mod == 1 && deletionsDone + 2 <= deletionsNeeded) {
                    // Delete 2 chars to save 1 replacement
                    deletionsDone += 2;
                    length -= 2;
                    if (length >= 3) heap.offer(new int[]{length % 3, length});
                } else if (mod == 2 && deletionsDone + 3 <= deletionsNeeded) {
                    // Delete 3 chars to save 1 replacement
                    deletionsDone += 3;
                    length -= 3;
                    if (length >= 3) heap.offer(new int[]{length % 3, length});
                } else {
                    // Can't delete more efficiently
                    heap.offer(pair);
                    break;
                }
            }

            // Calculate remaining replacements after optimal deletions
            int totalReplacements = 0;
            for (int[] pair : heap) {
                totalReplacements += pair[1] / 3;
            }

            // Remaining deletions don't help with repeats
            int remainingDeletions = deletionsNeeded - deletionsDone;

            // Total changes = deletions + max(missingTypes, remaining_replacements)
            return deletionsNeeded + Math.max(missingTypes, totalReplacements);
        }
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity: O(n)**

- Finding missing types: O(n)
- Finding repeat sequences: O(n)
- Processing repeats with priority queue: O(k log k) where k = number of repeat sequences (k ≤ n/3)
- Overall O(n) since k ≤ n/3 and log k ≤ log n

**Space Complexity: O(n)**

- Storing repeat sequences: O(k) where k ≤ n/3
- Priority queue: O(k)
- Overall O(n)

---

## Common Mistakes

1. **Treating constraints independently** — Fixing length first, then repeats, then missing types. This misses opportunities where one edit solves multiple problems. Always consider combined effects.

2. **Wrong deletion priority** — Deleting randomly from long passwords instead of targeting sequences with `L % 3 == 0` first. This wastes deletions that could have saved replacements.

3. **Forgetting that replacements fix missing types** — Counting missing types and repeats separately then adding them. Actually, each replacement can satisfy a missing type requirement too, so we take `max(missing_types, replacements_needed)`.

4. **Off-by-one in repeat calculations** — A sequence of length 3 needs 1 replacement (change the third character), length 6 needs 2, etc. The formula is `floor(length / 3)`, not `ceil(length / 3)` or `length - 2`.

---

## When You'll See This Pattern

This **greedy optimization with priority queues** pattern appears when:

1. Multiple constraints interact (like length, character types, repeats).
2. Different operations (insert/delete/replace) have different costs and side effects.
3. You need to minimize total operations while satisfying all constraints.

**Related problems:**

- **Task Scheduler** (LeetCode 621) — Similar prioritization: execute most frequent tasks first to minimize idle time.
- **Rearrange String k Distance Apart** (LeetCode 358) — Use heap to schedule characters with spacing constraints.
- **Minimum Deletions to Make Character Frequencies Unique** (LeetCode 1647) — Greedy deletion with frequency tracking.

---

## Key Takeaways

1. **Break complex constraints into independent counts** (missing types, repeat sequences, length deviation), then handle their interactions systematically.

2. **When multiple edit operations exist, analyze their efficiency** — replacements fix repeats AND missing types, deletions are most efficient on sequences where `L % 3 == 0`.

3. **Use priority queues when you need to repeatedly select the "most beneficial" item** — here, sequences where deletion saves the most replacements.

---

Related problems: [Strong Password Checker II](/problem/strong-password-checker-ii)
