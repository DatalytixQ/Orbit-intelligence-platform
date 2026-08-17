import sys

with open("orbitlink/engine.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i in range(74, 181):
    if lines[i].strip() != "":
        lines[i] = "    " + lines[i]

with open("orbitlink/engine.py", "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Indentation fixed.")
