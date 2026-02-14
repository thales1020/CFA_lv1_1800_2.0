export default function ExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex flex-col bg-[#DFE7EB] font-sans select-none overflow-hidden">
      {children}
    </div>
  );
}
