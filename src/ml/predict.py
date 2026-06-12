import sys
import json
import torch
import os

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model.pt"
)

model = torch.jit.load(MODEL_PATH)
model.eval()

r_history = sys.argv[1].split(",")
t_history = sys.argv[2].split(",")
p_history = sys.argv[3].split(",")

sample = torch.zeros(len(r_history), 1, 3)

for i in range(len(r_history)):
    sample[i][0][0] = float(r_history[i])
    sample[i][0][1] = float(t_history[i])
    sample[i][0][2] = float(p_history[i])

hidden = torch.zeros(1, 1, 16)

with torch.no_grad():
    halflife, _ = model.forward(sample, hidden)

result = {
    "predictedHalfLife": float(halflife)
}

print(json.dumps(result))

#python predict.py "1,1,1,0" "0,1,3,7" "0.86,0.88,0.91,0.72"