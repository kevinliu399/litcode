export interface Question {
    _id?: string;
    title: string; 
    description: string; 
    testCases: Array<{
        testId: string; 
        input: string;
        output: string;  
    }>; 
    type: "graph" | "tree" | "array" | "";
}
