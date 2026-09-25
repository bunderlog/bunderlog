# bunderlog glossary

A landing page that tests which of three positionings makes developers join a waitlist, before any product is built.

## Experiment

**Variant**:
One arm of the experiment, labelled A, B or C. A Visitor is shown exactly one and keeps it.
_Avoid_: message, version
_In code_: `variant`

**Positioning**:
The pitch a Variant presents to one Audience: which problem it claims to solve and how. Today each Variant carries exactly one Positioning.
_Avoid_: message, angle
_In code_: the Variant's entry in `COPY` (`copy.ts`), named by its `label`

**Audience**:
The group of people a Positioning is aimed at, such as teams running AI agents in production. Who actually signs up can differ from it; the Survey shows who did.
_Avoid_: niche, segment
_In code_: stated on the page by the Variant's `eyebrow` in `COPY`

**Visitor**:
A browser that has opened the landing page, recognised by an id it keeps. Not a person: the same person on a laptop and a phone is two Visitors, and clearing site data makes a new one.
_Avoid_: user, session
_In code_: `visitor`, `bl_vid`

**Assignment**:
How a Visitor got their Variant: **Random** (the A/B split) or **Forced** (a new Visitor arriving through a `?v=` link). The first Assignment is final; only an Internal browser can be reassigned.
_In code_: `forced`, the stats filter `assign`

**Source**:
Where a Visitor first came from: `utm_source`, `?ref=` or the referrer's domain, otherwise direct. Captured on the first visit and never changed.
_Avoid_: channel
_In code_: `source` (with `medium` and `campaign`, the `Attribution`)

**Internal**:
A browser marked with `?notrack` as the team's own: it sends no events, its Signups are kept but left out of every number, and `?v=` switches its Variant freely.
_Avoid_: test
_In code_: `noTrack`, `bl_nt`, the `test` column

**Engaged**:
A Visitor who focused the email field or clicked a call to action, whether or not they signed up.
_In code_: the `engage` event

**Conversion**:
Signups divided by Visitors for one Variant, counting neither Internal Signups nor the other Assignment. A Signup counts only when its Visitor was seen (sent a `view`) under the same filter; the rest are listed as unseen.
_Avoid_: signup rate
_In code_: `unseenSignups` for the Signups left out

**Finish line**:
The point, fixed before the test starts, at which the result is read: 600 Visitors per Variant or 4 weeks, whichever comes first, counted within the current Period from its start. Numbers read earlier are progress, not a result.
_Avoid_: stopping point, deadline
_In code_: `TARGET_VISITORS` (`StatsApp.vue`); the 4 weeks are not enforced by code

**Period**:
The part of the experiment from a chosen date on; changing a Variant's copy starts a new one, and only numbers within one Period compare. A new Period restarts the Finish line.
_In code_: the stats filter "Since" (`from`)

## Waitlist

**Signup**:
An email address put on the waitlist from the landing page; what Conversion counts. One per address: a second attempt with the same address is a duplicate, not a new Signup. On a deletion request it becomes an **Erased** Signup: the email and Current approach are removed, while the visitor id, Variant, Source, role and team size stay, so it still counts toward Conversion.
_Avoid_: join, waitlist entry, lead
_In code_: `Signup`, table `waitlist`, `JOIN_LIMIT`, `markJoined`

**Survey**:
The optional questions shown right after a new Signup: role, team size and Current approach.
_Avoid_: profile, questionnaire
_In code_: `Profile`, `/api/profile`, `profiles`

**Current approach**:
The Survey answer, in the person's own words, on how they handle the problem today; the question is worded per Variant.
_Avoid_: pain
_In code_: `pain`, `painQuestion`
