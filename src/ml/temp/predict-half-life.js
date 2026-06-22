import { spawn } from "child_process";
import path from "path";

export const predictHalfLife = (rHistory, tHistory, pHistory) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "src", "ml", "predict.py");

    const python = spawn("python", [scriptPath, rHistory, tHistory, pHistory]);

    let output = "";
    let error = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", () => {
      if (error) {
        reject(new Error(error));
        return;
      }

      try {
        const result = JSON.parse(output);

        resolve(result.predictedHalfLife);
      } catch (err) {
        reject(err);
      }
    });
  });
};
