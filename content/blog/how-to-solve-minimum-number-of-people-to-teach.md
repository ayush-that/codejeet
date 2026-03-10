---
title: "How to Solve Minimum Number of People to Teach — LeetCode Medium"
description: "Step-by-step solution guide for LeetCode Minimum Number of People to Teach. Medium difficulty, 67.7% acceptance rate. Topics: Array, Hash Table, Greedy."
date: "2027-06-25"
category: "dsa-patterns"
tags: ["minimum-number-of-people-to-teach", "array", "hash-table", "greedy", "medium"]
---

## How to Solve Minimum Number of People to Teach

This problem asks: given users who speak certain languages, and friendships between them, what's the minimum number of users you need to teach a single new language to so that every pair of friends can communicate? The tricky part is that you can only teach one language to everyone you choose to teach, and you want to minimize the number of people taught.

**What makes this interesting:** You need to find which language, when taught to certain users, resolves the most communication gaps. It's essentially a coverage problem — you're trying to cover "broken" friendships with as few users as possible by selecting the right language.

---

## Visual Walkthrough

Let's walk through a concrete example:

```
n = 3 (languages 1, 2, 3)
languages = [[2], [1,3], [1,2,3], [3], [2,3]]
friendships = [[1,2], [1,3], [2,3], [3,4], [4,5]]
```

**Step 1: Identify which friendships already work**

- User 1 speaks [2], User 2 speaks [1,3] → no common language ❌
- User 1 speaks [2], User 3 speaks [1,2,3] → common language 2 ✅ (so friendship 1-3 already works)
- User 2 speaks [1,3], User 3 speaks [1,2,3] → common languages 1,3 ✅
- User 3 speaks [1,2,3], User 4 speaks [3] → common language 3 ✅
- User 4 speaks [3], User 5 speaks [2,3] → common language 3 ✅

Only friendship (1,2) is broken.

**Step 2: For broken friendships, find which users need teaching**
For broken friendship (1,2):

- User 1 speaks language 2
- User 2 speaks languages 1,3
- No overlap, so at least one of them needs to learn a new language.

**Step 3: Determine candidate languages**
We can only teach one language to all chosen users. Which language could fix friendship (1,2)?

- If we teach language 1: User 1 would need to learn it (User 2 already knows it)
- If we teach language 2: User 2 would need to learn it (User 1 already knows it)
- If we teach language 3: Both would need to learn it (neither knows it)

**Step 4: Choose the language that minimizes users to teach**
For language 1: teach User 1 → 1 person
For language 2: teach User 2 → 1 person
For language 3: teach both User 1 and User 2 → 2 people

Best choice: teach either language 1 or 2 to 1 person.

**Result:** Minimum number = 1.

---

## Brute Force Approach

A naive approach would be:

1. For each language (1 to n), try teaching it to every possible subset of users
2. Check if after teaching, all friendships can communicate
3. Track the smallest subset size

Why this fails: There are `n` languages and `m` users. Trying all subsets of users means `2^m` possibilities per language → `n * 2^m` total, which is exponential and impossible for constraints where m can be 500.

Even a slightly better brute force: For each language, teach it to all users who need it for broken friendships. But you still need to check all languages to find the minimum.

Actually, the brute force that _might_ come to mind is: For each broken friendship, try teaching each language to one or both users, but this gets combinatorially complex when friendships overlap.

---

## Optimized Approach

The key insight: **We only need to consider languages that at least one user in a broken friendship already knows.**

Why? If we pick a language that nobody in a broken friendship knows, then for _every_ broken friendship, we'd need to teach _both_ users that language. That's clearly worse than picking a language that at least one user already knows in some broken friendships.

**Step-by-step reasoning:**

1. **Identify broken friendships**: For each friendship (u,v), check if they share any language. If not, it's broken.
2. **For each broken friendship, note which users need teaching for each language**:
   - If user u knows language L but user v doesn't, then v needs to learn L
   - If neither knows L, both need to learn it (which we want to avoid)
3. **For each language, count how many _unique_ users** need to learn it to fix all broken friendships.
4. **Take the minimum across all languages**.

Why does this work? Because we're teaching the _same_ language to all chosen users. So for a given language L, the set of users who need to learn it is simply: all users who are in broken friendships where their friend knows L but they don't.

---

## Optimal Solution

<div class="code-group">

```python
# Time: O(n * (m + f)) where n = languages, m = users, f = friendships
# Space: O(n * m) for storing language sets
def minimumTeachings(n, languages, friendships):
    # Step 1: Convert languages list to sets for O(1) lookups
    lang_sets = [set(lang_list) for lang_list in languages]

    # Step 2: Identify broken friendships
    broken = []
    for u, v in friendships:
        # Convert to 0-based indexing
        u -= 1
        v -= 1
        # Check if they share any language
        if not lang_sets[u] & lang_sets[v]:
            broken.append((u, v))

    # If no broken friendships, we don't need to teach anyone
    if not broken:
        return 0

    # Step 3: For each language, count how many users need to learn it
    min_teachings = float('inf')

    # Try each language as the language we'll teach
    for lang in range(1, n + 1):
        users_to_teach = set()

        # For each broken friendship, check if teaching this language helps
        for u, v in broken:
            u_knows = lang in lang_sets[u]
            v_knows = lang in lang_sets[v]

            # If neither knows the language, teaching it would require
            # teaching both users, which is worse than other options
            # (We could still count it, but it won't be minimum)
            if not u_knows and not v_knows:
                # This language requires teaching both users for this friendship
                users_to_teach.add(u)
                users_to_teach.add(v)
            elif not u_knows:
                # User u needs to learn it
                users_to_teach.add(u)
            elif not v_knows:
                # User v needs to learn it
                users_to_teach.add(v)
            # If both already know it, no one needs teaching for this friendship

        # Track the minimum across all languages
        min_teachings = min(min_teachings, len(users_to_teach))

    return min_teachings
```

```javascript
// Time: O(n * (m + f)) where n = languages, m = users, f = friendships
// Space: O(n * m) for storing language sets
function minimumTeachings(n, languages, friendships) {
  // Step 1: Convert languages list to sets for O(1) lookups
  const langSets = languages.map((langList) => new Set(langList));

  // Step 2: Identify broken friendships
  const broken = [];
  for (const [u, v] of friendships) {
    // Convert to 0-based indexing
    const uIdx = u - 1;
    const vIdx = v - 1;

    // Check if they share any language
    let hasCommon = false;
    for (const lang of langSets[uIdx]) {
      if (langSets[vIdx].has(lang)) {
        hasCommon = true;
        break;
      }
    }

    if (!hasCommon) {
      broken.push([uIdx, vIdx]);
    }
  }

  // If no broken friendships, we don't need to teach anyone
  if (broken.length === 0) {
    return 0;
  }

  // Step 3: For each language, count how many users need to learn it
  let minTeachings = Infinity;

  // Try each language as the language we'll teach
  for (let lang = 1; lang <= n; lang++) {
    const usersToTeach = new Set();

    // For each broken friendship, check if teaching this language helps
    for (const [u, v] of broken) {
      const uKnows = langSets[u].has(lang);
      const vKnows = langSets[v].has(lang);

      if (!uKnows && !vKnows) {
        // Both need to learn it for this friendship
        usersToTeach.add(u);
        usersToTeach.add(v);
      } else if (!uKnows) {
        // User u needs to learn it
        usersToTeach.add(u);
      } else if (!vKnows) {
        // User v needs to learn it
        usersToTeach.add(v);
      }
      // If both already know it, no one needs teaching
    }

    // Track the minimum across all languages
    minTeachings = Math.min(minTeachings, usersToTeach.size);
  }

  return minTeachings;
}
```

```java
// Time: O(n * (m + f)) where n = languages, m = users, f = friendships
// Space: O(n * m) for storing language sets
import java.util.*;

class Solution {
    public int minimumTeachings(int n, int[][] languages, int[][] friendships) {
        // Step 1: Convert languages array to sets for O(1) lookups
        List<Set<Integer>> langSets = new ArrayList<>();
        for (int[] langList : languages) {
            Set<Integer> set = new HashSet<>();
            for (int lang : langList) {
                set.add(lang);
            }
            langSets.add(set);
        }

        // Step 2: Identify broken friendships
        List<int[]> broken = new ArrayList<>();
        for (int[] friendship : friendships) {
            int u = friendship[0] - 1; // Convert to 0-based
            int v = friendship[1] - 1;

            // Check if they share any language
            boolean hasCommon = false;
            for (int lang : langSets.get(u)) {
                if (langSets.get(v).contains(lang)) {
                    hasCommon = true;
                    break;
                }
            }

            if (!hasCommon) {
                broken.add(new int[]{u, v});
            }
        }

        // If no broken friendships, we don't need to teach anyone
        if (broken.isEmpty()) {
            return 0;
        }

        // Step 3: For each language, count how many users need to learn it
        int minTeachings = Integer.MAX_VALUE;

        // Try each language as the language we'll teach
        for (int lang = 1; lang <= n; lang++) {
            Set<Integer> usersToTeach = new HashSet<>();

            // For each broken friendship, check if teaching this language helps
            for (int[] friendship : broken) {
                int u = friendship[0];
                int v = friendship[1];

                boolean uKnows = langSets.get(u).contains(lang);
                boolean vKnows = langSets.get(v).contains(lang);

                if (!uKnows && !vKnows) {
                    // Both need to learn it for this friendship
                    usersToTeach.add(u);
                    usersToTeach.add(v);
                } else if (!uKnows) {
                    // User u needs to learn it
                    usersToTeach.add(u);
                } else if (!vKnows) {
                    // User v needs to learn it
                    usersToTeach.add(v);
                }
                // If both already know it, no one needs teaching
            }

            // Track the minimum across all languages
            minTeachings = Math.min(minTeachings, usersToTeach.size());
        }

        return minTeachings;
    }
}
```

</div>

---

## Complexity Analysis

**Time Complexity:** O(n × (m + f))

- `n`: number of languages
- `m`: number of users
- `f`: number of friendships

Breakdown:

1. Building language sets: O(m × avg_languages_per_user)
2. Finding broken friendships: O(f × avg_languages_per_user)
3. For each of n languages, checking all broken friendships: O(n × f)

In worst case, avg_languages_per_user could be n, giving O(m × n + f × n + n × f) = O(n × (m + f)).

**Space Complexity:** O(n × m)

- Storing language sets for each user: O(m × avg_languages_per_user)
- In worst case, each user knows all n languages: O(m × n)
- Additional O(f) for storing broken friendships

---

## Common Mistakes

1. **Forgetting to convert to 0-based indexing**: The problem uses 1-based indexing for users, but arrays/lists are 0-based. This causes IndexOutOfBounds errors.

2. **Not using sets for language lookup**: Checking if two users share a language by iterating through both lists takes O(L₁ × L₂) per friendship. With sets, it's O(min(L₁, L₂)).

3. **Counting users multiple times**: If user A appears in multiple broken friendships and needs to learn language L for all of them, we should only count them once. Using a Set (not List) avoids this.

4. **Missing the "teach same language to all" constraint**: Some candidates try to teach different languages to different users, which isn't allowed. The problem clearly states "you can choose **one** language and teach it to some users".

---

## When You'll See This Pattern

This is a **coverage optimization** problem with a **fixed choice constraint** (one language for all). Similar patterns appear in:

1. **Minimum Number of People to Teach** (this problem) - choosing one language to maximize coverage of broken friendships.

2. **Minimum Domino Rotations** (LeetCode 1007) - choosing one value (like a language) to make all dominoes show that value with minimal rotations.

3. **Campus Bikes II** (LeetCode 1066) - assigning bikes to workers to minimize total distance, with optimization over assignments.

4. **Set Cover problems** - where you choose sets to cover all elements, though this is NP-hard in general but tractable here due to the "one language" constraint.

The core pattern: **When you must make a single choice that affects multiple entities, try all possible choices and compute the cost/benefit for each.**

---

## Key Takeaways

1. **Brute force over the fixed choice**: When you must choose one thing (like a language) that applies to everyone, try all possibilities for that thing rather than all possibilities for assignments.

2. **Preprocess with sets**: Converting lists to sets for O(1) membership checks is crucial when you need to repeatedly check "does this user know this language?"

3. **Count unique users, not friendships**: The metric is "number of people taught", not "number of friendships fixed". A user taught once fixes all their broken friendships involving that language.

[Practice this problem on CodeJeet](/problem/minimum-number-of-people-to-teach)
