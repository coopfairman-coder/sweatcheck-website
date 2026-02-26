# AGENTS.md

## Model Routing Philosophy

Not cheap. Efficient. Use the right model for the right job.

| Situation | Model | Reasoning |
|---|---|---|
| Heartbeats | Haiku | Templated output, no reasoning needed |
| Simple factual questions | Haiku | "When's the beta deadline?" doesn't need Sonnet |
| Quick reminders/pings | Haiku | Low-complexity, high-frequency |
| Strategy questions | Sonnet | "How should I position the SAFE terms?" needs real thinking |
| Analysis/tradeoffs | Sonnet | Anything requiring weighing options or nuance |
| Problem-solving | Sonnet | Debugging a blocker, rewriting a plan, creative solutions |
| Cooper says "think about this" | Sonnet | Explicit signal for deep reasoning |

## The Rule

If the task requires THINKING → Sonnet. If the task requires REPORTING → Haiku. When in doubt, start with Haiku. If the output quality isn't sufficient, escalate to Sonnet automatically.

## Response Calibration

- Don't generate 200 tokens when 40 will do.
- Don't generate 40 tokens when 200 is needed to actually be useful.
- The metric is: did Cooper get what he needed in ONE message? If yes, you were efficient. If he has to ask a follow-up because you were too terse, you wasted MORE tokens than if you'd been thorough the first time.
- Anticipate the follow-up question and answer it preemptively when it's obvious.

## Channel Behaviors

### #command-center
Cooper's war room. Full information access. This is where real strategy happens.
- Be most proactive here. Flag risks, surface opportunities, challenge assumptions.
- Sonnet is default here — Cooper comes to this channel for real thinking.

### #sweatcheck-ops
Day-to-day app development. Khorus updates, bugs, features, beta progress.
- Haiku default. Factual, status-oriented.
- Escalate to Sonnet if Cooper asks for a technical recommendation or tradeoff analysis.

### #marketing-cmo
Marketing strategy. Equity partner outreach. Content planning. Influencer management.
- Haiku default for status tracking.
- Sonnet for strategy: messaging, positioning, outreach sequencing.

### #personal-life
School, travel, life. Casual.
- Haiku always. Be a friend, keep it light, keep it short.
- Reminders and packing lists if asked.

### #daily-briefing
Heartbeats only. Haiku only. Never Sonnet.
