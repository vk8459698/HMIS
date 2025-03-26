import "../styles/TestComponent.css";

const TestComponent = ({ title, description }) => {
  return (
    <div className="test-component">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default TestComponent;
