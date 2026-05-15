import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllQuizParams, getCourseBySlug, getQuiz } from "@/lib/learn/loader";
import { QuizWorkspace } from "@/components/learn/QuizWorkspace";

export async function generateStaticParams() {
  return getAllQuizParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; quiz: string }>;
}): Promise<Metadata> {
  const { course, quiz } = await params;
  const data = await getQuiz(course, quiz);
  if (!data) return { title: "Quiz Not Found" };
  return {
    title: `${data.title} — Quiz`,
    description: data.description,
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ course: string; quiz: string }>;
}) {
  const { course, quiz } = await params;
  const [quizData, courseData] = await Promise.all([
    getQuiz(course, quiz),
    getCourseBySlug(course),
  ]);
  if (!quizData || !courseData) notFound();
  return (
    <QuizWorkspace
      quiz={quizData}
      courseTitle={courseData.title}
      courseHref={`/learn/${courseData.slug}`}
    />
  );
}
