# Modelling assumptions (read before using)

The model is a **design and discussion aid**, not a forecasting, financial or actuarial model. All parameters are invented for an entertaining, responsive interactive demo. The outputs must not be presented as research-backed conversion estimates for real pension scheme members.

## Definitions

- `population`: messages/contacts, not distinct persons.
- `reach`: probability that a sent communication is engaged with in this simplified model.
- `understood`: probability an engaged message is understood.
- `acted`: probability an understood message leads to an action.
- The total action rate is the product of the three conditional probabilities.

## Implementation

The full source is in `assets/js/model.js` (`compute`). The relationships are intentionally straightforward, e.g.:

```
reach = (0.27 + 0.35 * relevance + 0.14 * timing + 0.09 * simplicity)
          * cohortReach * channelReach * repetitionModifier

understandingGivenReach = (0.28 + 0.58 * simplicity)
                          * cohortUnderstanding * channelUnderstanding

actionGivenUnderstanding = (0.10 + 0.48 * CTA + 0.19 * relevance)
                           * (0.67 + 0.33 * timing)
                           * cohortAction * channelAction

acted = population * reach * understandingGivenReach * actionGivenUnderstanding
```

Here the 0–100 sliders are divided by 100; intermediary probabilities are bounded before counts are rounded. Channel and cohort multipliers are visible and editable in the source. Frequency improves reach modestly before a made-up fatigue penalty above four contacts. Nothing in the source estimates uncertainty or is calibrated against observed outcomes.

## CSV lab

The CSV lab (`assets/js/signals.js`) supports the fields `cohort, channel, sent, opened, understood, acted`, with nonnegative integer counts obeying `sent >= opened >= understood >= acted`. Pasted/uploaded CSVs are parsed locally. Quoted commas and double quotes are supported. The included sample CSV is fictional and generated deterministically. Rate denominators are messages sent, not unique members. Be careful when using a single member in multiple rows.

## Message foundry

Text scoring checks sentence length, action words, a small built-in jargon dictionary, and potential passive voice; it is not a validated reading-age or comprehension measure. Use human review and user testing for real member communications.
