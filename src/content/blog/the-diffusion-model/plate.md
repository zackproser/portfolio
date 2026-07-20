# Generative Image Process Poster

Drawing: TDD-013  
Artifact: BP-013 — Generative Image Process Poster  
Format: A2 wall poster · PDF

## Coordinate-consistent process

Use one matched seed and one coordinate system across every panel:

`clean data x₀ → forward Gaussian marginals xₜ → terminal prior xₜ → reverse / probability-flow path → generated x̂₀`

Show the same 2D teaching distribution beside the image-latent circuit. Label the toy as illustrative and never as image-model output.

## Forward diffusion

- Data: `x₀ ∈ ℝᵈ`
- Schedule: `βₜ ∈ (0,1)`, `αₜ = 1 − βₜ`, `ᾱₜ = ∏ₛ₌₁ᵗ αₛ`
- One step: `q(xₜ|xₜ₋₁) = 𝒩(xₜ; √αₜxₜ₋₁, βₜI)`
- Direct sample: `xₜ = √ᾱₜx₀ + √(1−ᾱₜ)ε`, `ε ∼ 𝒩(0,I)`
- Noise schedule controls signal-to-noise allocation across time; it does not learn image content.

## Reverse predictions

| Parameterization | Network target | Conversion fact | Same shape as |
|---|---|---|---|
| epsilon | injected `ε` | `x̂₀ = [xₜ−√(1−ᾱₜ)ε̂]/√ᾱₜ` | `xₜ` |
| clean sample | `x₀` | scheduler derives epsilon / mean | `xₜ` |
| velocity | `v = √ᾱₜε−√(1−ᾱₜ)x₀` | time-dependent rotation of signal/noise | `xₜ` |
| score | `∇ₓ log pₜ(x)` | enters reverse SDE / probability-flow ODE | `xₜ` |

Training objective: `Lsimple = 𝔼[‖ε−εθ(xₜ,t,c)‖²₂]`

## Conditioning and guidance paths

`text → tokenizer / text encoder → conditioning c → cross-attention or adaptive modulation → U-Net / DiT`

Classifier-free guidance:

`εCFG = εuncond + w(εcond − εuncond)`

- `w = 1`: conditional estimate
- larger `w`: stronger extrapolation toward the condition
- trade: adherence versus diversity, saturation, distortion, and field stiffness
- matched comparison holds seed, prompt, model, VAE, resolution, sampler, and steps fixed

## VAE and denoiser roles

`image x ∈ ℝᴴˣᵂˣ³ → VAE encoder E → latent z ∈ ℝʰˣʷˣᶜ → U-Net or DiT field → VAE decoder D → image x̂ ∈ ℝᴴˣᵂˣ³`

| Component | Owns | Does not own |
|---|---|---|
| VAE encoder | pixel-to-latent compression | reverse path |
| U-Net | multi-scale convolutional field estimate | pixel decoding |
| DiT | transformer field estimate over latent patches | the diffusion/flow definition |
| text encoder | conditioning representation | numerical integration |
| VAE decoder | latent-to-pixel reconstruction | prompt guidance |

## Latent dimension ledger

| Quantity | Symbol / shape | Poster annotation |
|---|---|---|
| pixel image | `H × W × 3` | decoded view |
| spatial factor | `f` | `h=H/f`, `w=W/f` |
| latent | `h × w × c` | diffusion / flow coordinates |
| latent patches | `(hw/p²) × (p²c)` before projection | DiT tokenization |
| field output | `h × w × c` | same shape as latent state |

Compression lowers spatial work and can discard detail. Record the actual VAE, scale factor, channel count, normalization, and decoder with every experiment.

## Sampler comparison

| Family | Typical field evaluations | Stochastic path? | Strength | Cost / risk |
|---|---:|---|---|---|
| Euler / first order | 1 per step | optional | cheap, transparent | larger local error |
| Heun / second order | often 2 per step | optional | averages two slopes | extra network call |
| ancestral | usually 1+ per step | yes | path variation | seed contract includes every draw |
| DDIM / deterministic diffusion | usually 1+ per step | no after start | repeatability, time subsequences | discretization choices matter |
| probability-flow ODE | solver-dependent | no after start | continuous deterministic view | numerical tolerance / stiffness |

Count network evaluations, not step labels alone. Record time grid, solver order, stochasticity, prediction parameterization, guidance, wall time, and hardware.

## Diffusion and flow matching

Probability-flow ODE:

`dx = [f(x,t) − ½g(t)²∇ₓlog pₜ(x)]dt`

Flow-matching objective:

`LFM = 𝔼[‖vθ(xₜ,t) − uₜ(xₜ)‖²₂]`

| Fixed part | Diffusion path | Flow-matching path |
|---|---|---|
| endpoints | simple prior ↔ data | simple prior ↔ data |
| learned field | score / noise / equivalent target | velocity |
| representation | pixels or VAE latent | pixels or VAE latent |
| network | U-Net or DiT | U-Net or DiT |
| conditioning | text / class / other | text / class / other |
| integration | reverse SDE or ODE sampler | ODE solver |

## Matched-seed contact sheet

Build a wall-readable grid from one archived initial tensor.

### Columns — sampling progress

- Start / terminal prior
- 4 evaluations
- 8 evaluations
- 16 evaluations
- 32 evaluations
- Final VAE decode

### Rows — one variable at a time

- Baseline: solver A, guidance `w₁`
- Same seed: solver B, guidance `w₁`
- Same seed: solver A, guidance `w₂`
- Same seed: solver A, guidance `w₃`
- Same seed and settings: alternate prompt condition

Print under the grid: model revision · VAE revision · prompt · negative condition · initial-tensor hash · dimensions · scheduler · time grid · solver · field evaluations · guidance · precision · hardware · elapsed time.

## Durable comparison checklist

- Source and target distributions declared
- Pixel or latent coordinate system declared
- Time direction and probability path declared
- Network prediction target declared
- Conditioning and guidance equation declared
- Solver, time grid, stochasticity, and field-evaluation count declared
- Matched initial tensor archived
- Toy diagrams labeled as teaching models
