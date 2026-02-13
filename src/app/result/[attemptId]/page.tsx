export default function ResultPage({ params }: { params: { attemptId: string } }) {
  return (
    <div>
      <h1>Result Page - Attempt ID: {params.attemptId}</h1>
    </div>
  );
}
