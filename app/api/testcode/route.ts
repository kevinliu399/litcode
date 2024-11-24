import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate the input
        if (!body.scriptName || !Array.isArray(body.args)) {
            return NextResponse.json(
                { error: "Invalid input. Provide 'scriptName' and 'args'." },
                { status: 400 }
            );
        }

        const scriptPath = path.resolve("scripts", body.scriptName);

        // Command to execute the Python script
        const command = `python3 ${scriptPath} ${body.args.join(" ")}`;

        // Execute the Python script
        const result = await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject({ error: stderr || "Error executing script." });
                } else {
                    resolve(stdout);
                }
            });
        });

        return NextResponse.json({ result }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "An error occurred." }, { status: 500 });
    }
}
