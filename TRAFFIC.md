# Bringing traffic

Goal: about 600 visitors per variant (1,800 in total) within 4 weeks, from sources that cover all three audiences — AI/agent builders, B2B SaaS teams and developers/DevOps.

Two rules for every link and every text:

1. **Link to the root, tagged per source.** The page picks the variant; a link with `?v=` leaves the A/B test (see [Search test](#search-test-forced-variants)).
2. **Keep the text neutral.** A visitor sees one of three positionings at random. A post that promises "audit logs" sends two thirds of its readers to a page about something else, and they leave because of the post, not the positioning. Write about the problem space (logs, what happened in production, proving it later), not about one pitch.

## Links

| Where | Link |
|---|---|
| Reddit ads | `https://bunderlog.com/?utm_source=reddit-ads&utm_medium=cpc` |
| r/SaaS feedback thread | `https://bunderlog.com/?utm_source=reddit&utm_campaign=r-saas` |
| r/startups / r/SideProject | `https://bunderlog.com/?utm_source=reddit&utm_campaign=r-sideproject` |
| r/devops | `https://bunderlog.com/?utm_source=reddit&utm_campaign=r-devops` |
| r/AI_Agents / r/LocalLLaMA | `https://bunderlog.com/?utm_source=reddit&utm_campaign=r-ai-agents` |
| Hacker News | `https://bunderlog.com/?utm_source=hn` |
| Indie Hackers | `https://bunderlog.com/?utm_source=indiehackers` |
| LinkedIn post | `https://bunderlog.com/?utm_source=linkedin` |
| X post | `https://bunderlog.com/?utm_source=x` |
| Direct messages | `https://bunderlog.com/?utm_source=dm` |
| Discord / Slack communities | `https://bunderlog.com/?utm_source=community&utm_campaign=<community-name>` |

Each source shows up as its own row on `/stats`. Compare variants within a row: sources differ far more from each other than variants do.

## Reddit ads (the backbone, $300–500)

Target developer, DevOps and machine-learning interests and communities, broad rather than niche. Run one ad set with two texts and let Reddit pick; don't make a text per variant.

> **Headline:** What really happened in production?
> **Body:** We're building a new way to keep and search the record of what your systems — and your AI agents — did. Early access is free; tell us which problem hurts most.

> **Headline:** Logs are easy to write and hard to trust
> **Body:** Exploring a tool for keeping a complete, searchable record of events. Joining the waitlist takes 10 seconds.

Check after the first $50: all three variants should get roughly a third of the visitors, and the cost per click should be under ~$2.

## Community posts

Most subreddits and communities ban self-promotion: post only where the rules allow it (weekly feedback threads, "share your project" threads), say plainly that it's your project, and answer every comment.

**Feedback thread (r/SaaS, r/startups, r/SideProject, Indie Hackers):**

> I'm validating an idea before writing the product: a tool for keeping a complete, trustworthy record of what happened in your systems. The landing page shows one of a few different angles — I'm measuring which problem people actually care about.
> Would love 30 seconds of feedback: does the page make sense, and is it a problem you have? <link>

**Question post (r/devops, r/ExperiencedDevs — only where links are allowed, else put it in a comment when asked):**

> How do you answer "what exactly happened?" a month after an incident? Traces get sampled, logs rotate, and audit requirements keep growing. What do you use today, and what's missing?

The question post is the more valuable one even without a single click: the answers are material for the interviews.

## Hacker News

"Show HN" is for things people can try; a waitlist doesn't qualify. An "Ask HN" works if it is a real question:

> Ask HN: How do you keep a record of what your AI agents actually did?

It leans toward variant A, so its row on `/stats` says something about A's audience, not about which variant wins overall.

## LinkedIn and X

> I'm testing an idea before building it: a way to keep a complete, searchable record of what your systems and AI agents did. The page shows one of three angles at random — I want to learn which problem matters most.
> If you run production systems, 30 seconds of your feedback would help a lot: <link>

## Direct messages (20–30 CTOs and leads you know)

> Hi <name>, quick one: I'm validating a product idea around logs and audit trails before building it. Could you look at <link> and tell me in one line whether it's a problem your team has? Honest "no" is just as useful.

These bring few visitors but the best interviews. Ask everyone who answers for a 15-minute call.

## Search test (forced variants)

A separate, small test (~$100–150 on Google Search): each keyword group gets the variant that matches it. It measures how well each niche converts people who are already looking for it — often a stronger signal than the A/B test. On `/stats` it shows under the **Forced** filter and never mixes into the A/B numbers.

| Keyword group | Examples | Link |
|---|---|---|
| AI agent record | ai agent audit log, llm agent observability, agent run replay | `https://bunderlog.com/?v=a&utm_source=google&utm_campaign=agents` |
| Audit log API | audit log api, audit trail saas, soc 2 audit logs | `https://bunderlog.com/?v=b&utm_source=google&utm_campaign=audit` |
| Unified logs | centralized logging, log aggregation, opentelemetry logs | `https://bunderlog.com/?v=c&utm_source=google&utm_campaign=logs` |

Here the ad text *should* match its variant (the visitor was looking for exactly that).

## Weekly routine

1. Open `/stats`: check the split is even and every source is tagged.
2. Read the survey answers ("In their own words").
3. Write to new signups and book calls.
4. Don't pick a winner before the finish line: 600 visitors per variant or 4 weeks.
