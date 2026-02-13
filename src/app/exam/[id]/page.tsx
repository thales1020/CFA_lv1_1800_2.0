export default function ExamPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Exam Page - ID: {params.id}</h1>
    </div>
  );
}
