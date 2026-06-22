import { spawn } from "child_process";
import path from "path";

export const predictHalfLife = (rHistory, tHistory, pHistory, difficulty) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "src", "ml", "predict.py");

    console.log("=== PREDICT INPUT ===");
    console.log({
      rHistory,
      tHistory,
      pHistory,
      difficulty,
    });

    const python = spawn("python", [
      scriptPath,
      rHistory,
      tHistory,
      pHistory,
      difficulty.toString(),
    ]);

    let output = "";
    let error = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("error", (err) => {
      console.error("SPAWN ERROR:", err);
      reject(err);
    });

    python.on("close", (code) => {
      console.log("=== PYTHON CLOSED ===");
      console.log("Exit Code:", code);
      console.log("Output:", output);
      console.log("Error:", error);

      if (code !== 0) {
        reject(new Error(error || `Python process exited with code ${code}`));
        return;
      }

      try {
        const result = JSON.parse(output);

        resolve(result.predictedHalfLife);
      } catch (err) {
        console.error("JSON PARSE ERROR");
        console.error(output);
        reject(err);
      }
    });
  });
};
