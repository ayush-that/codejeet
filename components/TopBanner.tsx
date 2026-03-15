export default function TopBanner() {
  return (
    <div className="bg-[#FACC15] text-black py-2.5 px-4 text-center text-sm font-medium">
      <div className="mx-auto max-w-5xl">
        <span>
          Typing code is easy. Explaining it out loud is hard. Pass the verbal technical screen with
          Crackr&apos;s Live AI Interviewer. 🎙️{" "}
        </span>
        <a
          href="https://crackr.dev/?utm_source=codejeet&utm_medium=top_banner&utm_campaign=1week_test"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="ml-1 inline-block rounded-md bg-black px-3 py-0.5 text-sm font-semibold text-[#FACC15] transition-opacity hover:opacity-80"
        >
          Start Free Mock
        </a>
      </div>
    </div>
  );
}
