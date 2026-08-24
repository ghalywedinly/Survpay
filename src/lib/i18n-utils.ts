import { Locale, LocalizedText, Transaction, Survey } from './types';

export function pick(text: LocalizedText, locale: Locale): string {
  return text[locale] || text.en;
}

/**
 * Transactions store a plain-English description (often a copy of the
 * related survey's English title). Prefer resolving the live, localized
 * survey title when we can; otherwise fall back to a translated label for
 * the transaction type (passed in by the caller via `typeLabel`).
 */
export function localizeTransactionDescription(
  tx: Pick<Transaction, 'type' | 'relatedSurveyId' | 'description'>,
  surveysById: Record<string, Survey>,
  locale: Locale,
  typeLabel?: string
): string {
  if (tx.relatedSurveyId) {
    const survey = surveysById[tx.relatedSurveyId];
    if (survey) return pick(survey.title, locale);
  }
  return typeLabel ?? tx.description;
}
