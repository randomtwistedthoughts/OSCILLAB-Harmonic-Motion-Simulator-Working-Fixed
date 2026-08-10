# OSCILLAB

## Interactive Harmonic Motion Laboratory

> **Physics 11 Project — Interactive Web-Based Simulation of Simple Harmonic Motion**

OSCILLAB is an interactive virtual physics laboratory designed to visualize and explore **Simple Harmonic Motion (SHM)** based on the Grade 11 Physics curriculum.

Instead of presenting harmonic motion as static formulas or a simple animation, OSCILLAB connects the **mathematical model, real-time simulation, graphs, virtual experiments, prediction tasks, and data analysis** into one interactive learning environment.

---

## 1. Project Goals

### 1.1 Visualize Grade 11 Physics

The project models simple harmonic motion using:

```text
x = A cos(ωt + φ)

v = -Aω sin(ωt + φ)

a = -Aω² cos(ωt + φ)
```

where:

- `A` — amplitude
- `T` — period
- `f` — frequency
- `ω` — angular frequency
- `φ` — initial phase
- `x` — displacement
- `v` — velocity
- `a` — acceleration

### 1.2 Make Motion Visual

Users can observe:

- Position
- Velocity
- Acceleration
- Direction of motion
- Equilibrium position
- Extreme positions

### 1.3 Connect Theory with Experiment

Users can change:

```text
A, T, φ
```

and immediately observe how each parameter affects the motion.

### 1.4 Turn Learning into an Interactive Experiment

The system is designed around:

- Simulation
- Real-Time Graph
- Virtual Experiment
- Prediction Mode
- Graph Analyzer
- Physics Challenge
- Data Analysis

---

# 2. Key Features

## Physics Engine

OSCILLAB does not rely on a pre-recorded animation.

At every simulation step, the system calculates the physical state from the SHM equations:

```text
t
│
├── phase = ωt + φ
│
├── x(t)
├── v(t)
└── a(t)
     │
     ▼
  Simulation
     │
     ├── Object
     ├── Vectors
     └── Graphs
```

This keeps the animation, vectors, and graphs mathematically synchronized with the physics model.

---

## 2.1 Interactive Simulation

The simulation provides:

- Play
- Pause
- Reset
- Time control
- Amplitude control
- Period control
- Initial-phase control

---

## 2.2 Physics Engine

### Displacement

```text
x = A cos(ωt + φ)
```

### Velocity

```text
v = -Aω sin(ωt + φ)
```

### Acceleration

```text
a = -Aω² cos(ωt + φ)
```

### Angular Frequency

```text
ω = 2π / T
```

### Frequency

```text
f = 1 / T
```

### Maximum Velocity

```text
v_max = Aω
```

### Maximum Acceleration

```text
a_max = Aω²
```

---

# 3. Velocity and Acceleration Vectors

OSCILLAB visualizes velocity and acceleration vectors directly on the moving object.

```text
                 v →
             ●──────────

                 ↓
                 ↓ a
```

### At the equilibrium position

```text
x = 0
|v| = v_max
a = 0
```

### At an extreme position

```text
|x| = A
v = 0
|a| = a_max
```

---

# 4. Real-Time Graphs

OSCILLAB generates three synchronized graphs:

- `x-t` — displacement vs. time
- `v-t` — velocity vs. time
- `a-t` — acceleration vs. time

All three graphs share the same simulation time.

When the oscillator reaches a specific state, the corresponding point on each graph can be identified simultaneously.

---

# 5. Virtual Experiment Lab

The Virtual Experiment Lab turns OSCILLAB from a visualization tool into an interactive physics laboratory.

## Experiment 01 — Changing Amplitude

Change:

```text
A₁ → A₂
```

Observe:

- Maximum displacement
- Period
- Frequency
- Maximum velocity
- Maximum acceleration

## Experiment 02 — Changing Period

Change:

```text
T
```

Observe:

```text
T ↑  →  f ↓
T ↑  →  ω ↓
```

## Experiment 03 — Changing Initial Phase

Change:

```text
φ
```

and observe how the initial state of the oscillator changes.

---

# 6. Prediction Mode

The simulation can pause at a selected time.

Example:

```text
t = 1.37 s

          ●
──────────┼──────────
```

The user predicts:

```text
x = ?
v = ?
a = ?
```

After submission, OSCILLAB reveals the calculated values and provides an explanation.

The learning process becomes:

```text
Predict → Simulate → Compare → Explain
```

---

# 7. Graph Analyzer

OSCILLAB can generate an SHM system with randomized parameters.

The user must determine:

- Amplitude `A`
- Period `T`
- Frequency `f`
- Angular frequency `ω`
- Initial phase `φ`

The system automatically evaluates the answer.

---

# 8. Physics Challenge

Physics Challenge generates questions based on the current state of the simulation.

Example:

> An oscillator is passing through its equilibrium position. Which quantity reaches its maximum magnitude?

Instead of only displaying `CORRECT` or `INCORRECT`, the system provides a physics-based explanation connected to the current simulation state.

---

# 9. Data Analysis

OSCILLAB can record simulation data such as:

```csv
time,x,v,a
0.00,...
0.01,...
0.02,...
...
```

The dataset can be used for:

- Motion analysis
- Formula verification
- Theory vs. simulation comparison
- Error calculation
- CSV export

---

# 10. System Architecture

```text
                    OSCILLAB
                       │
              ┌────────┴────────┐
              │                 │
        User Controls       Physics Engine
              │                 │
       A / T / φ / t       x(t), v(t), a(t)
              │                 │
              └────────┬────────┘
                       │
                Simulation State
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      Animation      Vectors       Graphs
          │            │            │
          └────────────┼────────────┘
                       │
              ┌────────┴────────┐
              │                 │
          Experiment          Quiz
              │                 │
              └────────┬────────┘
                       ▼
                Data Analysis
```

---

# 11. Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | UI/UX and responsive design |
| JavaScript | Application logic and Physics Engine |
| Canvas API | Real-time motion rendering |
| Chart.js | Interactive graphs |
| Git | Version control |
| GitHub Pages | Deployment |

---

# 12. Project Structure

```text
oscilla-lab/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   │
│   ├── physics/
│   │   └── physics.js
│   │
│   ├── simulation/
│   │   ├── animation.js
│   │   ├── vectors.js
│   │   └── state.js
│   │
│   ├── graph/
│   │   └── graph.js
│   │
│   ├── experiments/
│   │   └── experiments.js
│   │
│   ├── quiz/
│   │   └── quiz.js
│   │
│   └── data/
│       └── data.js
│
├── tests/
│   └── physics-test.js
│
└── docs/
    ├── physics.md
    ├── architecture.md
    └── wireframe.png
```

---

# 13. Getting Started

## Option 1 — Open Directly

Open:

```text
index.html
```

in a modern web browser.

## Option 2 — Run a Local Server

Using Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

A local server is recommended during development.

---

# 14. Testing

## Physics Tests

Test:

- Small and large amplitudes
- Small and large periods
- `φ = 0`
- `φ = π/2`
- `φ = π`
- Negative phase
- Phase values greater than `2π`

## Special States

At an extreme position:

```text
v = 0
```

At equilibrium:

```text
a = 0
```

Maximum velocity:

```text
|v| = Aω
```

Maximum acceleration:

```text
|a| = Aω²
```

## UI Tests

Test:

- Play / Pause
- Reset
- Sliders
- Numeric inputs
- Graph synchronization
- Responsive layout
- Mobile interface

---

# 15. Development Roadmap

The project is organized into **116 tasks**.

## Week 1 — Foundation

- Physics Engine
- `x(t)`, `v(t)`, `a(t)`
- `A`, `T`, `φ` inputs
- Basic animation

**Milestone:** A mathematically correct oscillator can be controlled and animated.

## Week 2 — Core Visualization

- Velocity vector
- Acceleration vector
- State detection
- `x-t`, `v-t`, `a-t` graphs
- Real-time synchronization

**Milestone:** The simulation clearly demonstrates the relationship between `x`, `v`, and `a`.

## Week 3 — Differentiating Features

- Virtual Experiment Lab
- Prediction Mode
- Two-oscillator comparison
- Graph Analyzer
- Physics Challenge
- Quiz system

**Milestone:** OSCILLAB becomes a virtual laboratory rather than a simple animation.

## Week 4 — Finalization

- Data Analysis
- Testing
- UI/UX refinement
- Documentation
- Deployment
- QR code
- Presentation and defense preparation

**Milestone:** Stable v1.0 ready for demonstration and project evaluation.

---

# 16. Educational Value

OSCILLAB is designed around a complete learning cycle:

```text
Theory
   ↓
Mathematical Model
   ↓
Code
   ↓
Simulation
   ↓
Data
   ↓
Verification
```

The project demonstrates how a Grade 11 Physics concept can be transformed into a computational model and then used as an interactive experiment.

---

# 17. Future Development

Possible future versions may include:

- Damped oscillation
- Forced oscillation
- Resonance
- Spring oscillator
- Simple pendulum
- Mechanical energy
- Kinetic and potential energy graphs
- Multiple-oscillator comparison
- 3D visualization
- Teacher / student modes
- Experiment result storage
- Automatic exercise generation
- Advanced data analysis

---

# 18. Project Status

**Current status:** 🚧 In Development

**Target version:** `v1.0`

**Project type:** Grade 11 Physics / Educational Technology / Interactive Simulation

**Primary topic:** Simple Harmonic Motion

---

# 19. License

This project is developed for **educational, research, and academic project demonstration purposes**.
