# Voice

The UI talks like a calm, competent colleague: plain words, specific, short.

- **Sentence case** everywhere ("Create item", not "Create Item"). Lowercase wordmark.
- **Verbs on buttons**, naming the outcome: "Run now", "Save", "Delete", "Add recurring task" — not "Submit", "OK", "Yes".
- **Say what happened and what to do.** Errors: the server's reason + the next step ("The upstream API returned 503. It retries at 09:00, or run it now."). Never just "Something went wrong".
- **Empty states explain the emptiness**: "No items match. Clear the search or a filter." / "Nothing waiting. Anything that needs your decision shows up here."
- **Absent is not zero**: "Nothing finished yet", "never", "—".
- **Confirmations name the thing and the cost**: "Delete nightly-report? Its history goes too. This can't be undone."
- **Status words over codes**: "Waiting for you" beats "pending_approval"; show codes only as secondary detail ("Failed · 1").
- **Toasts are past tense and short**: "Settings saved", "Queued run-42".
- **Hints are one line** under the field, describing effect, not mechanics: "In your time zone.", "After its last command it stays awake this long."
- Avoid jargon the user didn't introduce, exclamation marks, "please", "successfully", and emoji in the UI.
- Use "you/your" for the operator; name things by what the user calls them.
