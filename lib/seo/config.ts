/**
 * SEO Configuration
 * Centralized configuration for programmatic SEO system
 */

export const seoConfig = {
  // Site identity
  siteName: "CodeJeet",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://codejeet.vercel.app",
  siteDescription:
    "Master coding interviews with 8000+ company-wise LeetCode questions. Practice DSA problems asked at Google, Amazon, Meta, Microsoft, and 265+ tech companies.",
  defaultImage: "/og-default.png",
  twitterHandle: "@shydev69",
  locale: "en_US",

  // Organization info
  organization: {
    name: "CodeJeet",
    logo: "/icon.svg",
    github: "https://github.com/ayush-that/codejeet",
    twitter: "https://twitter.com/shydev69",
  },

  // Page type configurations
  pageTypes: {
    home: {
      titleTemplate: "CodeJeet - Master Coding Interviews with 8000+ Company-Wise Questions",
      descriptionTemplate:
        "Practice LeetCode interview questions from Google, Amazon, Meta, Microsoft and 265+ companies. Free, open-source DSA preparation platform.",
      revalidate: 86400, // 24 hours
      priority: 1.0,
    },
    companies: {
      titleTemplate: "Company Interview Questions - {count} Tech Companies | CodeJeet",
      descriptionTemplate:
        "Browse coding interview questions from {count} tech companies including Google, Amazon, Meta, Microsoft. Filter by difficulty and topics.",
      revalidate: 86400,
      priority: 0.9,
    },
    topics: {
      titleTemplate: "DSA Topics - {count} Algorithm & Data Structure Categories | CodeJeet",
      descriptionTemplate:
        "Master {count} algorithm and data structure topics. Practice problems by category: Arrays, Trees, Dynamic Programming, Graphs, and more.",
      revalidate: 86400,
      priority: 0.9,
    },
    problems: {
      titleTemplate: "LeetCode Problems - {count}+ Coding Questions | CodeJeet",
      descriptionTemplate:
        "Browse {count}+ LeetCode coding problems with company frequency data. Find questions asked at top tech companies.",
      revalidate: 86400,
      priority: 0.9,
    },
    company: {
      titleTemplate: "{name} Interview Questions - {count} LeetCode Problems | CodeJeet",
      descriptionTemplate:
        "Practice {count} {name} coding interview questions. {hard} Hard, {medium} Medium, {easy} Easy problems with frequency data. Top topics: {topics}.",
      schemaTypes: ["BreadcrumbList", "ItemList"],
      minContentThreshold: 3,
      revalidate: 86400,
      priority: 0.8,
    },
    topic: {
      titleTemplate: "{name} Problems - {count} LeetCode Questions | CodeJeet",
      descriptionTemplate:
        "Master {name} with {count} practice problems. {hard} Hard, {medium} Medium, {easy} Easy questions. Top companies: {companies}.",
      schemaTypes: ["BreadcrumbList", "ItemList"],
      minContentThreshold: 3,
      revalidate: 86400,
      priority: 0.8,
    },
    problem: {
      titleTemplate: "{title} - LeetCode {difficulty} | CodeJeet",
      descriptionTemplate:
        "{title} is a {difficulty} LeetCode problem with {acceptance}% acceptance rate. Asked by {companies}. Topics: {topics}.",
      schemaTypes: ["BreadcrumbList", "FAQPage"],
      revalidate: 604800, // 7 days
      priority: 0.7,
    },
    companyTopic: {
      titleTemplate: "{company} {topic} Questions - {count} Problems | CodeJeet",
      descriptionTemplate:
        "Practice {count} {topic} problems asked at {company}. {hard} Hard, {medium} Medium, {easy} Easy questions with frequency data.",
      schemaTypes: ["BreadcrumbList", "ItemList"],
      minContentThreshold: 3,
      revalidate: 604800,
      priority: 0.6,
    },
    difficulty: {
      titleTemplate: "{level} LeetCode Problems - {count} Questions | CodeJeet",
      descriptionTemplate:
        "Practice {count} {level} difficulty LeetCode problems. Browse by company or topic to find the perfect practice questions.",
      revalidate: 86400,
      priority: 0.7,
    },
    systemDesign: {
      titleTemplate: "{title} - System Design Guide | CodeJeet",
      descriptionTemplate:
        "Learn {title} with our comprehensive system design guide. Includes diagrams, examples, and interview tips.",
      schemaTypes: ["BreadcrumbList", "LearningResource"],
      revalidate: 604800,
      priority: 0.8,
    },
  },

  // Internal linking configuration
  internalLinking: {
    maxLinksPerPage: 15,
    relatedContentCount: 6,
    minRelevanceScore: 0.3,
    hubPages: ["/companies", "/topics", "/problems", "/system-design"],
    alwaysLinkTo: ["/companies", "/topics"],
  },

  // Thin content protection thresholds
  thinContentThresholds: {
    company: 3,
    topic: 3,
    companyTopic: 3,
    problem: 1,
  },

  // ISR and caching configuration
  caching: {
    // Pages to pre-generate at build time
    staticGeneration: {
      topCompanies: 100,
      topTopics: 50,
      topQuestions: 500,
      topCrossRefs: 500,
    },
    // Revalidation times (seconds)
    revalidate: {
      hub: 86400, // 24 hours
      entity: 86400, // 24 hours
      crossRef: 604800, // 7 days
      question: 604800, // 7 days
    },
  },

  // Canonical URL patterns
  canonicalPatterns: {
    home: "/",
    companies: "/companies",
    topics: "/topics",
    problems: "/problems",
    company: "/company/{slug}",
    topic: "/topic/{slug}",
    problem: "/problem/{slug}",
    companyTopic: "/company/{company}/{topic}",
    difficulty: "/difficulty/{level}",
    systemDesign: "/system-design/{slug}",
  },
} as const;

// Helper to generate canonical URL
export function getCanonicalUrl(
  pageType: keyof typeof seoConfig.canonicalPatterns,
  params: Record<string, string> = {}
): string {
  let pattern = seoConfig.canonicalPatterns[pageType] as string;
  for (const [key, value] of Object.entries(params)) {
    pattern = pattern.replace(`{${key}}`, value);
  }
  return `${seoConfig.siteUrl}${pattern}`;
}

// Helper to format display name from slug
export function formatDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((word) => {
      // Handle common abbreviations
      const abbrevs: Record<string, string> = {
        aws: "AWS",
        ibm: "IBM",
        jpmorgan: "JPMorgan",
        ml: "ML",
        ai: "AI",
        dfs: "DFS",
        bfs: "BFS",
        dp: "DP",
        sql: "SQL",
        api: "API",
      };
      if (abbrevs[word.toLowerCase()]) {
        return abbrevs[word.toLowerCase()];
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// Topic descriptions for unique content
export const topicDescriptions: Record<string, string> = {
  array:
    "Arrays are fundamental data structures that store elements in contiguous memory locations. Master array manipulation, two-pointer techniques, and sliding window algorithms.",
  "hash-table":
    "Hash tables provide O(1) average-case lookups. Essential for frequency counting, deduplication, and mapping problems.",
  string:
    "String manipulation is crucial for coding interviews. Practice parsing, pattern matching, and character counting algorithms.",
  "dynamic-programming":
    "Dynamic Programming breaks complex problems into overlapping subproblems. Master memoization, tabulation, and state transitions.",
  math: "Mathematical problems test number theory, combinatorics, and arithmetic algorithms. Essential for optimization problems.",
  sorting:
    "Sorting algorithms are foundational. Understand QuickSort, MergeSort, and when to use built-in sorting functions.",
  greedy:
    "Greedy algorithms make locally optimal choices. Learn to identify when greedy approaches guarantee global optimums.",
  "depth-first-search":
    "DFS explores as far as possible along each branch. Essential for tree traversals and graph exploration.",
  "breadth-first-search":
    "BFS explores neighbors level by level. Perfect for shortest path problems in unweighted graphs.",
  "binary-search":
    "Binary search achieves O(log n) lookups in sorted data. Master variations like lower_bound and upper_bound.",
  tree: "Tree data structures model hierarchical relationships. Practice traversals, BST operations, and balanced trees.",
  matrix:
    "Matrix problems involve 2D array manipulation. Master traversal patterns, rotations, and dynamic programming on grids.",
  "two-pointers":
    "Two-pointer technique efficiently processes sorted arrays. Essential for pair-finding and partition problems.",
  "bit-manipulation":
    "Bit manipulation enables efficient low-level operations. Learn XOR properties, bit counting, and bitmasking.",
  "binary-tree":
    "Binary trees have at most two children per node. Practice recursive and iterative traversal algorithms.",
  heap: "Heaps maintain partial ordering for efficient min/max operations. Essential for priority queues and top-K problems.",
  "prefix-sum":
    "Prefix sums enable O(1) range queries after O(n) preprocessing. Crucial for subarray sum problems.",
  simulation:
    "Simulation problems require careful step-by-step implementation. Practice following complex instructions precisely.",
  stack:
    "Stacks follow LIFO ordering. Essential for expression parsing, nested structures, and monotonic stack problems.",
  counting:
    "Counting problems involve frequency analysis and combinatorics. Master counting techniques for complex enumerations.",
  "sliding-window":
    "Sliding window maintains a moving window over data. Perfect for substring and subarray optimization problems.",
  "linked-list":
    "Linked lists use pointer-based node connections. Practice reversal, cycle detection, and merge operations.",
  graph:
    "Graphs model connections between entities. Master representations, traversals, and shortest path algorithms.",
  backtracking:
    "Backtracking systematically explores solution spaces. Essential for permutations, combinations, and constraint satisfaction.",
  "binary-search-tree":
    "BSTs maintain sorted order for efficient operations. Practice insertion, deletion, and balance maintenance.",
  "union-find":
    "Union-Find efficiently tracks connected components. Essential for dynamic connectivity and cycle detection.",
  "ordered-set":
    "Ordered sets maintain sorted elements with efficient operations. Useful for range queries and neighbor finding.",
  recursion:
    "Recursion solves problems by breaking them into smaller instances. Master base cases and recursive relations.",
  trie: "Tries efficiently store and search strings. Essential for autocomplete and prefix matching problems.",
  "divide-and-conquer":
    "Divide and conquer breaks problems into independent subproblems. Foundation for MergeSort and QuickSort.",
  "monotonic-stack":
    "Monotonic stacks maintain ordered elements. Perfect for next-greater-element and histogram problems.",
  design:
    "Design problems test system and data structure design skills. Practice LRU cache, iterators, and custom structures.",
  "number-theory":
    "Number theory involves properties of integers. Master GCD, primality testing, and modular arithmetic.",
  geometry:
    "Geometry problems involve coordinates and shapes. Practice distance calculations and convex hull algorithms.",
  "segment-tree":
    "Segment trees enable efficient range queries and updates. Essential for advanced competitive programming.",
  "topological-sort":
    "Topological sort orders directed acyclic graphs. Essential for dependency resolution and course scheduling.",
  "binary-indexed-tree":
    "Binary Indexed Trees (Fenwick Trees) support efficient prefix operations. Alternative to segment trees for simpler cases.",
  "shortest-path":
    "Shortest path algorithms find optimal routes. Master Dijkstra's, Bellman-Ford, and Floyd-Warshall.",
  bitmask:
    "Bitmask DP uses bits to represent subsets. Enables efficient subset enumeration and state tracking.",
  queue:
    "Queues follow FIFO ordering. Essential for BFS, task scheduling, and level-order traversals.",
  combinatorics:
    "Combinatorics counts arrangements and selections. Master permutations, combinations, and inclusion-exclusion.",
  "rolling-hash":
    "Rolling hash enables efficient string comparison. Essential for pattern matching and duplicate detection.",
  "minimum-spanning-tree":
    "MST connects all vertices with minimum total edge weight. Master Kruskal's and Prim's algorithms.",
  "strongly-connected-component":
    "SCCs are maximal strongly connected subgraphs. Essential for graph decomposition and 2-SAT.",
  "eulerian-circuit":
    "Eulerian circuits visit every edge exactly once. Apply to path-finding with edge constraints.",
};

// Company tier classification for prioritization
export const companyTiers: Record<string, number> = {
  google: 1,
  amazon: 1,
  meta: 1,
  facebook: 1,
  microsoft: 1,
  apple: 1,
  netflix: 1,
  uber: 2,
  airbnb: 2,
  linkedin: 2,
  twitter: 2,
  salesforce: 2,
  adobe: 2,
  oracle: 2,
  nvidia: 2,
  stripe: 2,
  square: 2,
  paypal: 2,
  bloomberg: 2,
  snap: 2,
  spotify: 2,
  lyft: 2,
  doordash: 2,
  instacart: 2,
  coinbase: 2,
  robinhood: 2,
  databricks: 2,
  snowflake: 2,
  palantir: 2,
  splunk: 2,
};

export function getCompanyTier(slug: string): number {
  return companyTiers[slug.toLowerCase()] || 3;
}
