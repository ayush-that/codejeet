---
title: "How to Solve Subdomain Visit Count — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Subdomain Visit Count. Medium difficulty, 77.2% acceptance rate. Topics: Array, Hash Table, String, Counting."
date: "2028-04-13"
category: "dsa-patterns"
tags: ["subdomain-visit-count", "array", "hash-table", "string", "medium"]
---

# How to Solve Subdomain Visit Count

This problem asks us to count visits to website domains and all their parent subdomains. Given a list of visit counts paired with domains (like `["9001 discuss.leetcode.com"]`), we need to return the total visits for every subdomain in the domain hierarchy. What makes this interesting is that a single visit string generates multiple counting operations across different domain levels, requiring careful string parsing and aggregation.

## Visual Walkthrough

Let's trace through a concrete example to build intuition:

**Input:** `["9001 discuss.leetcode.com", "50 leetcode.com"]`

**Step 1:** Process `"9001 discuss.leetcode.com"`

- Parse count: `9001`
- Parse domain: `"discuss.leetcode.com"`
- Extract all subdomains:
  1. Full domain: `"discuss.leetcode.com"` → add 9001
  2. Parent: `"leetcode.com"` → add 9001
  3. Top-level: `"com"` → add 9001

**Step 2:** Process `"50 leetcode.com"`

- Parse count: `50`
- Parse domain: `"leetcode.com"`
- Extract all subdomains:
  1. Full domain: `"leetcode.com"` → add 50 (now 9001 + 50 = 9051)
  2. Parent: `"com"` → add 50 (now 9001 + 50 = 9051)

**Final counts:**

- `"discuss.leetcode.com": 9001`
- `"leetcode.com": 9051`
- `"com": 9051`

**Output:** `["9001 discuss.leetcode.com", "9051 leetcode.com", "9051 com"]`

The key insight: each domain visit contributes its count to itself and every parent domain in its hierarchy.

## Brute Force Approach

A naive approach might try to process each visit independently without aggregation, but that wouldn't meet the problem requirements. The real "brute force" thinking here would be to:

1. Create a list to store all (count, subdomain) pairs
2. For each visit string:
   - Parse count and domain
   - Split domain by dots
   - For each possible subdomain (full domain, parent, grandparent, etc.):
     - Add (count, subdomain) to the list
3. Group identical subdomains and sum their counts
4. Format the results

The inefficiency comes from step 3—grouping and summing after collecting all pairs would require sorting or nested loops. If we have `n` visit strings and each generates up to `k` subdomains (where `k` is the number of dots + 1), we'd have `O(n*k)` pairs to group, which could be `O(n²)` in the worst case if we use naive grouping.

## Optimized Approach

The key insight is to use a **hash map (dictionary)** for aggregation while processing. This gives us constant-time lookups and updates for each subdomain count.

**Step-by-step reasoning:**

1. Initialize an empty hash map to store `subdomain → total_count`
2. For each visit string:
   - Split by space to separate count and full domain
   - Convert count to integer
   - Split domain by dots to identify all subdomain levels
   - For each subdomain level (starting from the full domain, then removing the leftmost part):
     - Build the current subdomain string
     - Add the count to that subdomain's total in the hash map
3. Convert the hash map entries to the required output format

**Why this works efficiently:**

- Each subdomain update is O(1) with the hash map
- We process each visit string once
- We build subdomains incrementally by removing prefix parts
- No need for expensive grouping operations later

## Optimal Solution

Here's the complete solution with detailed comments:

<div class="code-group">

```python
# Time: O(n * k) where n = number of visit strings, k = max subdomains per string
# Space: O(n * k) for the hash map storing all unique subdomains
def subdomainVisits(cpdomains):
    """
    Count visits for all domains and their parent subdomains.

    Args:
        cpdomains: List of strings in format "count domain"

    Returns:
        List of strings in format "count subdomain"
    """
    # Step 1: Initialize hash map to store subdomain counts
    count_map = {}

    # Step 2: Process each visit string
    for entry in cpdomains:
        # Split "9001 discuss.leetcode.com" into ["9001", "discuss.leetcode.com"]
        count_str, domain = entry.split()
        count = int(count_str)  # Convert string count to integer

        # Step 3: Split domain by dots to get all parts
        # "discuss.leetcode.com" -> ["discuss", "leetcode", "com"]
        parts = domain.split('.')

        # Step 4: Generate all subdomains for this domain
        # For i from 0 to len(parts)-1, join parts[i:] with dots
        for i in range(len(parts)):
            # Build subdomain by joining remaining parts
            # i=0: "discuss.leetcode.com"
            # i=1: "leetcode.com"
            # i=2: "com"
            subdomain = '.'.join(parts[i:])

            # Step 5: Update count in hash map
            # Use get() with default 0 to handle first occurrence
            count_map[subdomain] = count_map.get(subdomain, 0) + count

    # Step 6: Convert hash map to required output format
    result = []
    for subdomain, total_count in count_map.items():
        result.append(f"{total_count} {subdomain}")

    return result
```

```javascript
// Time: O(n * k) where n = number of visit strings, k = max subdomains per string
// Space: O(n * k) for the hash map storing all unique subdomains
function subdomainVisits(cpdomains) {
  /**
   * Count visits for all domains and their parent subdomains.
   *
   * @param {string[]} cpdomains - Array of strings in format "count domain"
   * @return {string[]} Array of strings in format "count subdomain"
   */

  // Step 1: Initialize hash map to store subdomain counts
  const countMap = new Map();

  // Step 2: Process each visit string
  for (const entry of cpdomains) {
    // Split "9001 discuss.leetcode.com" into ["9001", "discuss.leetcode.com"]
    const [countStr, domain] = entry.split(" ");
    const count = parseInt(countStr, 10); // Convert string count to integer

    // Step 3: Split domain by dots to get all parts
    // "discuss.leetcode.com" -> ["discuss", "leetcode", "com"]
    const parts = domain.split(".");

    // Step 4: Generate all subdomains for this domain
    // For i from 0 to len(parts)-1, join parts[i:] with dots
    for (let i = 0; i < parts.length; i++) {
      // Build subdomain by joining remaining parts
      // i=0: "discuss.leetcode.com"
      // i=1: "leetcode.com"
      // i=2: "com"
      const subdomain = parts.slice(i).join(".");

      // Step 5: Update count in hash map
      // Get current count or 0 if not exists, then add new count
      const currentCount = countMap.get(subdomain) || 0;
      countMap.set(subdomain, currentCount + count);
    }
  }

  // Step 6: Convert hash map to required output format
  const result = [];
  for (const [subdomain, totalCount] of countMap.entries()) {
    result.push(`${totalCount} ${subdomain}`);
  }

  return result;
}
```

```java
// Time: O(n * k) where n = number of visit strings, k = max subdomains per string
// Space: O(n * k) for the hash map storing all unique subdomains
import java.util.*;

class Solution {
    public List<String> subdomainVisits(String[] cpdomains) {
        /**
         * Count visits for all domains and their parent subdomains.
         *
         * @param cpdomains Array of strings in format "count domain"
         * @return List of strings in format "count subdomain"
         */

        // Step 1: Initialize hash map to store subdomain counts
        Map<String, Integer> countMap = new HashMap<>();

        // Step 2: Process each visit string
        for (String entry : cpdomains) {
            // Split "9001 discuss.leetcode.com" into ["9001", "discuss.leetcode.com"]
            String[] parts = entry.split(" ");
            int count = Integer.parseInt(parts[0]);  // Convert string count to integer
            String domain = parts[1];

            // Step 3: Split domain by dots to get all parts
            // "discuss.leetcode.com" -> ["discuss", "leetcode", "com"]
            String[] domainParts = domain.split("\\.");

            // Step 4: Generate all subdomains for this domain
            // For i from 0 to len(domainParts)-1, join domainParts[i:] with dots
            StringBuilder subdomainBuilder = new StringBuilder();
            for (int i = 0; i < domainParts.length; i++) {
                // Clear or reset the builder for new subdomain
                if (i > 0) {
                    subdomainBuilder.insert(0, ".");
                }
                // Build from right to left for efficiency
                subdomainBuilder.insert(0, domainParts[domainParts.length - 1 - i]);

                // Get the current subdomain
                String subdomain = subdomainBuilder.toString();

                // Step 5: Update count in hash map
                // Get current count or 0 if not exists, then add new count
                countMap.put(subdomain, countMap.getOrDefault(subdomain, 0) + count);
            }
        }

        // Step 6: Convert hash map to required output format
        List<String> result = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : countMap.entrySet()) {
            result.add(entry.getValue() + " " + entry.getKey());
        }

        return result;
    }
}
```

</div>

## Complexity Analysis

**Time Complexity:** O(n × k)

- `n` is the number of visit strings in the input array
- `k` is the maximum number of subdomains per domain (number of dots + 1)
- We process each visit string once: O(n)
- For each visit, we generate up to `k` subdomains: O(k) per visit
- Each hash map operation (get/put) is O(1) on average
- Total: O(n × k)

**Space Complexity:** O(n × k)

- The hash map stores counts for all unique subdomains
- In the worst case, if all domains are completely different, we store up to n × k entries
- The output list also takes O(n × k) space

## Common Mistakes

1. **Forgetting to convert count to integer:** The count comes as a string, and adding strings concatenates them instead of summing numerically. Always use `int()`, `parseInt()`, or `Integer.parseInt()`.

2. **Incorrect subdomain generation:** Some candidates try to build subdomains from left to right instead of right to left. For `"a.b.c"`, we need `["a.b.c", "b.c", "c"]`, not `["a", "a.b", "a.b.c"]`. The loop should remove the leftmost part each time.

3. **Not using a hash map for aggregation:** Trying to use arrays or lists and searching for duplicates is O(n²). The hash map's O(1) lookups are essential for efficiency.

4. **Missing edge cases:**
   - Single-part domains like `"com"` (should return just `"com"`)
   - Multiple dots like `"a.b.c.d"` (should generate 4 subdomains)
   - Large counts that might overflow (use appropriate integer types)

## When You'll See This Pattern

This problem combines **string parsing**, **hierarchical decomposition**, and **frequency counting**—a common pattern in many coding problems:

1. **Word Pattern (LeetCode 290):** Similar string parsing and mapping, but with bi-directional constraints.

2. **Group Anagrams (LeetCode 49):** Uses hash maps to group related items (anagrams) by a common key, just like we group subdomains.

3. **Find Duplicate File in System (LeetCode 609):** Involves parsing strings with multiple components and using hash maps to group files by content.

4. **Most Common Word (LeetCode 819):** Requires parsing text and counting frequencies with special handling for punctuation.

The core pattern: **Parse complex strings into components → Transform components into keys → Use hash maps for aggregation → Format results.**

## Key Takeaways

1. **Hash maps are perfect for frequency counting:** When you need to count occurrences or aggregate values by key, reach for a hash map/dictionary first.

2. **Hierarchical data often requires processing all levels:** When dealing with parent-child relationships (domains, file paths, organizational charts), consider what happens at each level of the hierarchy.

3. **String parsing is a multi-step process:** Break it down: split, convert types, process components, then combine results. Don't try to do everything in one complex operation.

[Practice this problem on CodeJeet](/problem/subdomain-visit-count)
