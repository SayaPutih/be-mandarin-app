import torch

model = torch.jit.load("./model.pt")

model.eval()

for difficulty in range(1,11):

    difficulty_norm = difficulty / 10.0

    sample = torch.tensor([
        [[0,0,0.86,difficulty_norm]],
        [[1,1,0.88,difficulty_norm]]
    ], dtype=torch.float32)

    hidden = torch.zeros(1,1,16)

    with torch.no_grad():
        output, hidden = model(sample, hidden)

    print(
        f"Difficulty {difficulty:2d} -> Half-Life {output.item():.4f}"
    )