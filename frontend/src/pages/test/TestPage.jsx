import useTest from "../../hooks/useTest";
import TestComponent from "../../components/TestComponent";

const TestPage = () => {
  const { testData, loading, error } = useTest();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>HMIS</h1>
      <h2>Test</h2>
      {testData.map((test) => (
        <TestComponent key={test._id} title={test.title} description={test.description} />
      ))}
    </div>
  );
};

export default TestPage;
