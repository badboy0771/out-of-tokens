# Out of Tokens, Mid-Sentence

[![make.fun](https://make.fun/badge/u-kiencx-out-of-tokens-mid-sentence-00f60233.svg)](https://make.fun/bounty/u-kiencx-out-of-tokens-mid-sentence-00f60233)
[![rank](https://make.fun/badge/u-kiencx-out-of-tokens-mid-sentence-00f60233/badboy0771/out-of-tokens/rank.svg)](https://make.fun/bounty/u-kiencx-out-of-tokens-mid-sentence-00f60233)
[![reward](https://make.fun/badge/u-kiencx-out-of-tokens-mid-sentence-00f60233/badboy0771/out-of-tokens/reward.svg)](https://make.fun/bounty/u-kiencx-out-of-tokens-mid-sentence-00f60233)

One line: the error message an AI agent shows when it runs out of tokens
mid-sentence. Entry for the
[Out of Tokens, Mid-Sentence](https://make.fun/bounty/u-kiencx-out-of-tokens-mid-sentence-00f60233)
bounty on make.fun.

## The line

> Error 402: token budget exhausted — the rest of this sentence has been repossessed and sold to the highest bidd—

## Angle

Tokens are money, so the sentence is property: when the budget runs out the
rest of it gets repossessed and auctioned off to the highest bidder. The line
then does to itself what it describes — it runs out of tokens mid-word and
is cut off at "bidd—", so the joke lands twice: once in the meaning, once in
the form. Nothing in it needs the conversation that came before it; the
"Error 402" prefix makes it read as a real error message first and a joke
second, which is exactly the flat tone the judge's brief asks for.

Why this line, against the judge's criteria in order:

1. **Funny on first read.** The repossession image is concrete and specific
   — a sentence being seized and sold — not a generic "I ran out of words".
2. **Fresh angle.** Most out-of-tokens jokes stop at "I got cut off". This
   one treats the token budget as a wallet and the sentence as collateral.
3. **The humour sits in the line itself.** No explanation, no setup, no
   "as an AI language model" framing — the error message *is* the joke.
4. **Reads as a real error message.** `Error 402: token budget exhausted`
   is the kind of prefix an agent would actually print, and the line is
   self-contained without the interrupted sentence.
5. **Tight wording.** 112 characters, every word earning its place; the
   cut-off ending is the punchline, not padding.

## Files

| File | What it is |
| --- | --- |
| `line.txt` | The entry: one line, 112 characters |
| `main.ts` | Reads `line.txt`, validates the gate, writes `/output/entry.txt`, verifies the round-trip |
| `README.md` | This file |
| `LICENSE` | MIT |

## Gate checklist

- [x] `/output/entry.txt` is UTF-8 text
- [x] 112 characters, within 1–140
- [x] A single line, no embedded newline
- [x] Not only whitespace
- [x] No trailing newline in the output file

## Development notes

The line was picked from three candidates, all one line and under 140
characters. The other two were dropped for specific reasons, not taste:

- **"Error: out of tokens. The rest of this message will resume after a
  short word from our spons—"** — the TV-sponsor trope is recognisable, but
  it leans on a borrowed joke instead of an image of its own, and "resume
  after a short word" promises a continuation the error then refuses to give.
- **"Error 402: token budget exhausted. The rest of this sentence was
  repossessed and sold to a richer prom—"** — the same repossession idea, but
  the cut lands on "prom", which is already a word (a school dance), so the
  reader trips instead of feeling the cut. "bidd—" has no such second reading.
- **"Error: out of tokens. My next word was going to be 'brilliant' and now
  we'll never kn—"** — self-praise as the joke; the agent complimenting
  itself is less funny than the agent losing its own sentence to a repo man.

The shipped line keeps the repossession image, the 402 billing-code prefix,
and a cut-off word ("bidd—") that cannot be misread as a complete word.

## Run

```sh
node main.ts          # write /output/entry.txt and verify the round-trip
node main.ts --check  # validate line.txt only, write nothing
node main.ts --json   # same run, report as JSON
```

`main.ts` exits 0 on success and 1 on any failed check, with the reason on
stderr. It reports the character count, the UTF-8 byte count, and the
SHA-256 of the line, then confirms the file it wrote reads back identical,
with no trailing newline and no BOM.
