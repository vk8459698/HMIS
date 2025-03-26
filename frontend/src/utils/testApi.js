export const createTest = async (testData) => {
    try {
        
      const response = await fetch(`${API_BASE_URL}/test/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating test:", error);
      return { error: "Network error" };
    }
  };