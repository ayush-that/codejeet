"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { capitalizeWords } from "@/utils/utils";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import TopicDropdown from "@/components/TopicDropdown";

const LEETCODE_BASE_URL = "https://leetcode.com";

export interface Question {
  id: number;
  slug: string;
  title: string;
  difficulty: string;
  acceptance_rate: number;
  link: string;
  company: string;
  frequency: number;
  timeframe: string;
  topics: string[];
  ID: string;
  Title: string;
  URL: string;
  Difficulty: string;
  "Acceptance %": string;
  "Frequency %": string;
  "Is Premium": string;
  Topics: string;
}

interface LeetCodeDashboardProps {
  questions: Question[];
  companies: string[];
  loading?: boolean;
}

const LeetCodeDashboard: React.FC<LeetCodeDashboardProps> = ({
  questions = [],
  companies = [],
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [selectedCompany] = useState("");
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(() => {
    if (typeof window === "undefined") return {};

    const savedItems = localStorage.getItem("leetcode-checked-items");
    if (!savedItems) return {};

    try {
      const parsed = JSON.parse(savedItems);
      return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      localStorage.removeItem("leetcode-checked-items");
      return {};
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [frequencySort, setFrequencySort] = useState<"asc" | "desc" | null>(null);
  const [acceptanceSort, setAcceptanceSort] = useState<"asc" | "desc" | null>(null);
  const [premiumFilter, setPremiumFilter] = useState("free");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  const handleCheckboxChange = (id: string, value: boolean) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: value };
      localStorage.setItem("leetcode-checked-items", JSON.stringify(next));
      return next;
    });
  };

  const companyStats = useMemo(() => {
    return companies
      .map((company) => ({
        name: company,
        count: questions.filter((q) => q.company === company).length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [questions, companies]);

  const uniqueTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    questions.forEach((question) => {
      question.Topics.split(",").forEach((topic) => {
        const trimmedTopic = topic.trim();
        if (trimmedTopic) {
          topicsSet.add(trimmedTopic);
        }
      });
    });
    return Array.from(topicsSet);
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const queryWords = searchQuery.trim().toLowerCase().split(/\s+/);
    return questions.filter((question) => {
      const matchesSearch = queryWords.every(
        (word) =>
          question.Title.toLowerCase().includes(word) ||
          question.company.toLowerCase().includes(word) ||
          question.Topics.toLowerCase()
            .split(",")
            .some((topic) => topic.trim().includes(word))
      );
      const matchesDifficulty =
        difficultyFilter.length === 0 || difficultyFilter.includes(question.Difficulty);
      const matchesCompany = !selectedCompany || question.company === selectedCompany;
      const matchesTopic =
        selectedTopics.length === 0 ||
        selectedTopics.every((topic) =>
          question.Topics.split(",")
            .map((t) => t.trim())
            .includes(topic)
        );
      const matchesPremium =
        premiumFilter === "all" ||
        (premiumFilter === "free" && question["Is Premium"] !== "Y") ||
        (premiumFilter === "premium" && question["Is Premium"] === "Y");

      return matchesSearch && matchesDifficulty && matchesCompany && matchesTopic && matchesPremium;
    });
  }, [questions, searchQuery, difficultyFilter, selectedCompany, selectedTopics, premiumFilter]);

  const filteredAndSortedQuestions = useMemo(() => {
    const result = [...filteredQuestions];

    result.sort((a, b) => {
      if (frequencySort) {
        const freqA = parseFloat(a["Frequency %"]);
        const freqB = parseFloat(b["Frequency %"]);
        const freqResult = frequencySort === "asc" ? freqA - freqB : freqB - freqA;
        if (freqResult !== 0) return freqResult;
      }

      if (acceptanceSort) {
        const accA = parseFloat(a["Acceptance %"]);
        const accB = parseFloat(b["Acceptance %"]);
        const accResult = acceptanceSort === "asc" ? accA - accB : accB - accA;
        if (accResult !== 0) return accResult;
      }

      return 0;
    });

    return result;
  }, [filteredQuestions, frequencySort, acceptanceSort]);

  const handleFrequencySort = () => {
    setFrequencySort((prev) => {
      if (prev === null) return "desc";
      if (prev === "desc") return "asc";
      return null;
    });
  };

  const handleAcceptanceSort = () => {
    setAcceptanceSort((prev) => {
      if (prev === null) return "desc";
      if (prev === "desc") return "asc";
      return null;
    });
  };

  const statistics = useMemo(() => {
    const uniqueQuestions = Array.from(new Set(filteredQuestions.map((q) => q.ID)));
    const total = uniqueQuestions.length;

    const solvedQuestions = new Set(
      filteredQuestions.filter((q) => checkedItems[q.ID]).map((q) => q.ID)
    );

    const totalSolved = solvedQuestions.size;

    const easyQuestions = new Set(
      filteredQuestions.filter((q) => q.Difficulty === "Easy").map((q) => q.ID)
    );
    const mediumQuestions = new Set(
      filteredQuestions.filter((q) => q.Difficulty === "Medium").map((q) => q.ID)
    );
    const hardQuestions = new Set(
      filteredQuestions.filter((q) => q.Difficulty === "Hard").map((q) => q.ID)
    );

    const easySolved = new Set(
      filteredQuestions
        .filter((q) => q.Difficulty === "Easy" && checkedItems[q.ID])
        .map((q) => q.ID)
    ).size;

    const mediumSolved = new Set(
      filteredQuestions
        .filter((q) => q.Difficulty === "Medium" && checkedItems[q.ID])
        .map((q) => q.ID)
    ).size;

    const hardSolved = new Set(
      filteredQuestions
        .filter((q) => q.Difficulty === "Hard" && checkedItems[q.ID])
        .map((q) => q.ID)
    ).size;

    return {
      total,
      totalSolved,
      easy: easyQuestions.size,
      easySolved,
      medium: mediumQuestions.size,
      mediumSolved,
      hard: hardQuestions.size,
      hardSolved,
    };
  }, [filteredQuestions, checkedItems]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / itemsPerPage));
  const currentPageToUse = Math.min(currentPage, totalPages);

  const currentItems = useMemo(() => {
    const startIndex = (currentPageToUse - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedQuestions.slice(startIndex, endIndex);
  }, [filteredAndSortedQuestions, currentPageToUse, itemsPerPage]);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  const handleDifficultyChange = (options: string[]) => {
    setDifficultyFilter(options);
    setCurrentPage(1);
  };

  const handleTopicChange = (options: string[]) => {
    setSelectedTopics(options);
    setCurrentPage(1);
  };

  const handlePremiumChange = (value: string) => {
    setPremiumFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => {
      const base = Math.min(prev, totalPages);
      return Math.min(base + 1, totalPages);
    });
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(Math.min(prev, totalPages) - 1, 1));
  };

  return (
    <div className="p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Practice Questions</CardTitle>
          <CardDescription>
            Browse through {filteredQuestions.length.toLocaleString()} DSA questions asked in
            technical interviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-background/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold">{statistics.totalSolved}</div>
                    <div className="text-sm text-muted-foreground">/ {statistics.total}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Total Solved</div>
                  <div className="mt-2">
                    <Progress
                      value={(statistics.totalSolved / statistics.total) * 100}
                      className="h-2 bg-muted [&>div]:bg-primary"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {statistics.easySolved}
                    </div>
                    <div className="text-sm text-muted-foreground">/ {statistics.easy}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Easy</div>
                  <div className="mt-2">
                    <Progress
                      value={(statistics.easySolved / statistics.easy) * 100}
                      className="h-2 [&>div]:bg-green-600 dark:[&>div]:bg-green-400 bg-green-200 dark:bg-green-950"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {statistics.mediumSolved}
                    </div>
                    <div className="text-sm text-muted-foreground">/ {statistics.medium}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                  <div className="mt-2">
                    <Progress
                      value={(statistics.mediumSolved / statistics.medium) * 100}
                      className="h-2 [&>div]:bg-yellow-600 dark:[&>div]:bg-yellow-400 bg-yellow-200 dark:bg-yellow-950"
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-background/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {statistics.hardSolved}
                    </div>
                    <div className="text-sm text-muted-foreground">/ {statistics.hard}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">Hard</div>
                  <div className="mt-2">
                    <Progress
                      value={(statistics.hardSolved / statistics.hard) * 100}
                      className="h-2 [&>div]:bg-red-600 dark:[&>div]:bg-red-400 bg-red-200 dark:bg-red-950"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div
                className="md:w-[260px] relative"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setShowCompanyDropdown(false);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowCompanyDropdown(false);
                }}
              >
                <Input
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowCompanyDropdown(true);
                    setCurrentPage(1);
                  }}
                  onFocus={() => setShowCompanyDropdown(true)}
                  className="w-full"
                />
                {searchQuery && showCompanyDropdown && (
                  <div className="absolute left-0 right-0 mt-1 z-20 rounded-md border bg-popover text-popover-foreground shadow-md max-h-64 overflow-y-auto">
                    <ul className="py-1 text-sm">
                      {companyStats
                        .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, 10)
                        .map((c) => (
                          <li
                            key={c.name}
                            className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setSearchQuery(c.name);
                              setShowCompanyDropdown(false);
                              setCurrentPage(1);
                            }}
                          >
                            {c.name}{" "}
                            <span className="text-xs text-muted-foreground">({c.count})</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              <TopicDropdown
                options={["Easy", "Medium", "Hard"]}
                selectedOptions={difficultyFilter}
                setSelectedOptions={handleDifficultyChange}
                placeholder="Difficulty"
              />

              <TopicDropdown
                options={uniqueTopics}
                selectedOptions={selectedTopics}
                setSelectedOptions={handleTopicChange}
                placeholder="Topics"
              />

              <Select value={premiumFilter} onValueChange={handlePremiumChange}>
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="all">All Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <>
                <div className="rounded-md border hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-4"></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Topics</TableHead>
                        <TableHead className="text-center">Acceptance</TableHead>
                        <TableHead className="text-center">Frequency</TableHead>
                        <TableHead className="w-14" aria-hidden="true"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(itemsPerPage)].map((_, i) => (
                        <TableRow key={`skeleton-${i}`}>
                          <TableCell className="w-4">
                            <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="w-32 h-4 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="w-20 h-4 bg-muted animate-pulse rounded" />
                          </TableCell>
                          <TableCell>
                            <div className="w-16 h-6 bg-muted animate-pulse rounded-full" />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <div className="w-16 h-5 bg-muted animate-pulse rounded-full" />
                              <div className="w-20 h-5 bg-muted animate-pulse rounded-full" />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="w-12 h-4 bg-muted animate-pulse rounded mx-auto" />
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="w-12 h-4 bg-muted animate-pulse rounded mx-auto" />
                          </TableCell>
                          <TableCell className="flex items-center gap-2" aria-hidden="true">
                            <div className="h-9 w-9 opacity-0" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="hidden md:flex flex-col sm:flex-row items-center justify-between py-4 px-2 gap-4">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <p className="text-sm text-muted-foreground whitespace-nowrap">
                        Items per page
                      </p>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={handleItemsPerPageChange}
                      >
                        <SelectTrigger className="w-[70px]">
                          <SelectValue placeholder={itemsPerPage} />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 20, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
                      <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                      <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                      <div className="w-16 h-4 bg-muted animate-pulse rounded" />
                      <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                      <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:hidden">
                  {[...Array(itemsPerPage)].map((_, i) => (
                    <Card key={`skeleton-mobile-${i}`} className="p-4 bg-background/50 border">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-muted animate-pulse rounded" />
                          <div>
                            <div className="w-32 h-4 bg-muted animate-pulse rounded mb-2" />
                            <div className="w-20 h-3 bg-muted animate-pulse rounded" />
                          </div>
                        </div>
                        <div className="w-16 h-6 bg-muted animate-pulse rounded-full" />
                      </div>
                      <div className="mt-3 flex gap-1">
                        <div className="w-16 h-5 bg-muted animate-pulse rounded-full" />
                        <div className="w-20 h-5 bg-muted animate-pulse rounded-full" />
                      </div>
                    </Card>
                  ))}
                  <div className="flex md:hidden items-center justify-center py-4 px-2 gap-4 w-full">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                      <div className="w-16 h-4 bg-muted animate-pulse rounded" />
                      <div className="w-8 h-8 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </div>
              </>
            ) : filteredQuestions.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No questions found , try some other filters?
              </div>
            ) : (
              <>
                <div className="rounded-md border hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-4"></TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Topics</TableHead>
                        <TableHead
                          className="text-center cursor-pointer hover:text-primary transition-colors"
                          onClick={handleAcceptanceSort}
                        >
                          <div className="flex items-center justify-center gap-1">
                            Acceptance
                            {acceptanceSort === "desc" && <ChevronDown className="h-4 w-4" />}
                            {acceptanceSort === "asc" && <ChevronUp className="h-4 w-4" />}
                            {acceptanceSort === null && (
                              <ChevronDown className="h-4 w-4 opacity-30" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead
                          className="text-center cursor-pointer hover:text-primary transition-colors"
                          onClick={handleFrequencySort}
                        >
                          <div className="flex items-center justify-center gap-1">
                            Frequency
                            {frequencySort === "desc" && <ChevronDown className="h-4 w-4" />}
                            {frequencySort === "asc" && <ChevronUp className="h-4 w-4" />}
                            {frequencySort === null && (
                              <ChevronDown className="h-4 w-4 opacity-30" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="w-14" aria-hidden="true"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((question) => {
                        const topics = question.Topics.split(",")
                          .map((topic) => topic.trim())
                          .filter(Boolean);

                        return (
                          <TableRow
                            key={`${question.id}-${question.company}-${question.timeframe || "unknown"}`}
                          >
                            <TableCell className="w-4">
                              <Checkbox
                                checked={checkedItems[question.ID] || false}
                                onCheckedChange={(value) =>
                                  handleCheckboxChange(question.ID, Boolean(value))
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <a
                                href={`${LEETCODE_BASE_URL}${question.URL}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground hover:text-primary hover:underline"
                              >
                                {question.Title}
                              </a>
                            </TableCell>
                            <TableCell>
                              <div className="capitalize">{capitalizeWords(question.company)}</div>
                            </TableCell>
                            <TableCell>
                              <DifficultyBadge
                                difficulty={question.Difficulty as "Easy" | "Medium" | "Hard"}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {topics.length === 0 ? (
                                  <span className="text-muted-foreground">-</span>
                                ) : (
                                  topics.map((topic, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-700 dark:text-blue-400"
                                    >
                                      {topic}
                                    </span>
                                  ))
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {question["Acceptance %"]}
                            </TableCell>
                            <TableCell className="text-center">{question["Frequency %"]}</TableCell>
                            <TableCell className="flex items-center gap-2" aria-hidden="true">
                              <div className="h-9 w-9 opacity-0" />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                  <div className="hidden md:flex flex-col sm:flex-row items-center justify-between py-4 px-2 gap-4">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <p className="text-sm text-muted-foreground whitespace-nowrap">
                        Items per page
                      </p>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={handleItemsPerPageChange}
                      >
                        <SelectTrigger className="w-[70px]">
                          <SelectValue placeholder={itemsPerPage} />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 20, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToFirstPage}
                        disabled={currentPageToUse === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPageToUse === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Previous</span>
                      </Button>
                      <div className="text-sm font-medium whitespace-nowrap">
                        {currentPageToUse} / {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPageToUse === totalPages}
                      >
                        <span className="hidden sm:inline mr-2">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToLastPage}
                        disabled={currentPageToUse === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:hidden">
                  {currentItems.map((question) => {
                    const topics = question.Topics.split(",")
                      .map((topic) => topic.trim())
                      .filter(Boolean);

                    return (
                      <Card
                        key={`${question.id}-${question.company}-${question.timeframe || "unknown"}`}
                        className="p-4 bg-background/50 border"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={checkedItems[question.ID] || false}
                              onCheckedChange={(value) =>
                                handleCheckboxChange(question.ID, Boolean(value))
                              }
                            />
                            <div>
                              <a
                                href={`${LEETCODE_BASE_URL}${question.URL}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline"
                              >
                                {question.Title}
                              </a>
                              <div className="capitalize text-xs text-muted-foreground">
                                {capitalizeWords(question.company)}
                              </div>
                            </div>
                          </div>
                          <DifficultyBadge
                            difficulty={question.Difficulty as "Easy" | "Medium" | "Hard"}
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {topics.length === 0 ? (
                            <span className="text-muted-foreground">-</span>
                          ) : (
                            topics.map((topic, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-700 dark:text-blue-400"
                              >
                                {topic}
                              </span>
                            ))
                          )}
                        </div>
                      </Card>
                    );
                  })}

                  <div className="flex md:hidden items-center justify-center py-4 px-2 gap-4 w-full">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPageToUse === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-sm font-medium whitespace-nowrap">
                        {currentPageToUse} / {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPageToUse === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeetCodeDashboard;
