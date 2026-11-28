# PostHog event tracking

This inventory reflects explicit `posthog.capture(...)` calls in application source. Property names and locations refer to the call sites; PostHog may also add its standard event properties. “None” means the call supplies no custom properties.

### Cookie consent and navigation

| Event | Custom properties | Location |
|---|---|---|
| `cookies_accepted` | None | [`CookieBanner.tsx`](../src/components/postHog/CookieBanner.tsx:39) |
| `cookies_declined` | None | [`CookieBanner.tsx`](../src/components/postHog/CookieBanner.tsx:45) |
| `language_changed` | `locale` | [`AppRouterChangeLanguage.tsx`](../src/components/ui/AppRouterChangeLanguage.tsx:24) |

### Review submission and spam detection

| Event | Custom properties | Location |
|---|---|---|
| `create_review_started` | None | [`ReviewForm.tsx`](../src/components/createReview/ReviewForm.tsx:85) |
| `create_review_submission_attempted` | `landlord`, `country`, `state`, `city` | [`ReviewForm.tsx`](../src/components/createReview/ReviewForm.tsx:152) |
| `create_review_submission_failed` | Recaptcha failure: `stage` (`recaptcha`), `landlord`, `country`, `state`, `city`. Submission exception: `stage` (`submission`), `error`, `landlord`, `country`, `state`, `city`. | [`ReviewForm.tsx`](../src/components/createReview/ReviewForm.tsx:169), [`ReviewForm.tsx`](../src/components/createReview/ReviewForm.tsx:239) |
| `create_review_submission_succeeded` | `landlord`, `country`, `state`, `city` | [`ReviewForm.tsx`](../src/components/createReview/ReviewForm.tsx:220) |
| `spam_review_detected` | `method`, `landlord`, `state`, `country`, `city` | [`ReviewForm.tsx`](../src/components/createReview/ReviewForm.tsx:67) |
| `spam_modal_viewed` | `landlord` | [`SpamReviewModal.tsx`](../src/components/modal/SpamReviewModal.tsx:19) |
| `review_spam_detectect_BE` | None | [`reviewDataLayer.ts`](../src/lib/review/models/reviewDataLayer.ts:35). Event name is spelled this way in the source. |
| `review_created_BE` | `ai_flagged` (boolean) | [`reviewDataLayer.ts`](../src/lib/review/models/reviewDataLayer.ts:111) |

### Review browsing, filters, and map

| Event | Custom properties | Location |
|---|---|---|
| `reviews_filter_applied` | `source` (`desktop` or `mobile`), `filter_types` (array containing changed `city` and/or `zip`), `active_filter_count` (number) | [`Review.tsx`](../src/components/reviews/Review.tsx:188) |
| `reviews_filter_cleared` | `source` (`desktop` or `mobile`), `filter_types` (array containing cleared `city`, `zip`, `search`, and/or `sort`) | [`Review.tsx`](../src/components/reviews/Review.tsx:225) |
| `reviews_search_performed` | `source` (`desktop` or `mobile`), `search_type` (`reviews`) | [`Review.tsx`](../src/components/reviews/Review.tsx:197) |
| `reviews_sort_changed` | `source` (`desktop` or `mobile`), `sort_option` | [`Review.tsx`](../src/components/reviews/Review.tsx:204) |
| `reviews_map_viewed` | `source` (`reviews`), `tab` (`map`) | [`Review.tsx`](../src/components/reviews/Review.tsx:151) |
| `reviews_map_loaded` | `marker_count` (number) | [`Map.tsx`](../src/components/map/Map.tsx:131) |
| `reviews_map_marker_clicked` | `source` (`reviews_map`) | [`CustomMarker.tsx`](../src/components/map/CustomMarker.tsx:18) |

### Analytics

| Event | Custom properties | Location |
|---|---|---|
| `reviews_analytics_viewed` | `source` (`reviews`), `tab` (`analytics`) | [`Review.tsx`](../src/components/reviews/Review.tsx:158) |
| `reviews_analytics_metric_selected` | `metric` (`rating` or `median`) | [`Analytics.tsx`](../src/components/analytics/Analytics.tsx:86) |
| `reviews_analytics_load_error` | `main_request_failed` (boolean), `chart_request_failed` (boolean) | [`Analytics.tsx`](../src/components/analytics/Analytics.tsx:94) |
| `reviews_analytics_loaded` | `has_rating_data` (boolean), `has_rent_data` (boolean) | [`Analytics.tsx`](../src/components/analytics/Analytics.tsx:102) |
| `analytics_side_bar_toggled` | `open` (boolean) | [`Sidebar.tsx`](../src/components/analytics/components/Sidebar.tsx:17) |

### Review management and sharing

| Event | Custom properties | Location |
|---|---|---|
| `user_code.incorrect_code_entry` | `landlord`, `message` | [`UserEditReviewModal.tsx`](../src/components/modal/UserEditReviewModal.tsx:95), [`UserRemoveReviewModal.tsx`](../src/components/modal/UserRemoveReviewModal.tsx:75) |
| `user_code.review_edited` | `landlord` | [`UserEditReviewModal.tsx`](../src/components/modal/UserEditReviewModal.tsx:90) |
| `user_code.review_deleted` | `landlord` | [`UserRemoveReviewModal.tsx`](../src/components/modal/UserRemoveReviewModal.tsx:69) |
| `user_clicked_share` | `share` (`email`, `facebook`, `pinterest`, `reddit`, `tumblr`, `twitter`, or `bluesky`) | [`SuccessModal.tsx`](../src/components/modal/SuccessModal.tsx:43), also emitted for the other six share buttons in the same file |

## Tracking setup

PostHog is initialized in [`PHProvider.tsx`](../src/components/postHog/PHProvider.tsx:8) with the public key and host environment variables. Cookie consent changes persistence between `localStorage+cookie` and `memory` in [`CookieBanner.tsx`](../src/components/postHog/CookieBanner.tsx:32).
