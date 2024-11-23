export interface Question {
    _id?: string;
    title: string; 
    description: string; 
    testCases: Array<{
        testId: string; 
        output: string; 
        hidden?: boolean; 
    }>; 
    elo: number;
    type: "graph" | "tree" | "array" | "";
}
