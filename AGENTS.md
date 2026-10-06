<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep academic scenario data in a browser-safe shared module; no scenario value should be presented as live monitoring.
- Use content leaf routes for tides, route consultation and sources, with the shared dashboard header in a reusable shell.
- Route consultation is a scenario comparison with an external routing referral, not a validated navigation or flood-prediction engine.
- Citizen reports accept only structured neighborhood and issue fields, remain private pending review, and never change official or scenario risk levels; this avoids publishing unverified claims or personal details.

- Fetch public tide feeds through a bounded-time public server function, validate the provider schema and keep station-specific measurements separate from academic risk scenarios; this prevents fabricated readings and unsafe risk inference.
