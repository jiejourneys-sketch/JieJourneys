# Planner SerpAPI safety

Planner SerpAPI searches are disabled everywhere unless the dedicated switch is
explicitly enabled. Keeping `SERPAPI_API_KEY` or `TRIP_SEARCH_PROVIDER=serpapi`
in a copied `.env.local` is not enough to spend credits.

- `SERPAPI_PLANNER_ENABLED=false` is the emergency kill switch.
- `SERPAPI_PLANNER_ENABLED=true` explicitly enables metered planner discovery.

Every metered search is checked against SerpAPI's free Account API. Defaults:

- `SERPAPI_PLANNER_MAX_REQUESTS_PER_HOUR=20`
- `SERPAPI_PLANNER_MIN_CREDITS_RESERVE=25`

The account check fails closed. `SERPAPI_PLANNER_ACCOUNT_GUARD_ENABLED=false`
exists for mocked automated tests only and must not be used in production.

One newly saved hotel can make at most one Maps identity search, two Google
Hotels searches, and one final organic Trip search. Matching direct Trip links,
verified local identities, and Agoda's local catalogue spend no SerpAPI credit.
Opening an existing planner, restoring it after a deploy, or visiting a shared
planner never starts paid identity or affiliate searches.
