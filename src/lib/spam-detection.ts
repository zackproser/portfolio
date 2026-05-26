/**
 * Server-side spam detection for the consultation form.
 *
 * Targets the bot pattern seen in the wild: gibberish name / company fields
 * (e.g. "ullQErJBxvCWUmXhHc"), random strings embedded in the message body,
 * and instant form submissions.
 */

// ── helpers ────────────────────────────────────────────────────────────

const VOWELS = new Set("aeiouAEIOU");

/** Shannon entropy of a string (bits per character). */
function shannonEntropy(s: string): number {
	const freq = new Map<string, number>();
	for (const ch of s) freq.set(ch, (freq.get(ch) ?? 0) + 1);
	let h = 0;
	for (const count of freq.values()) {
		const p = count / s.length;
		h -= p * Math.log2(p);
	}
	return h;
}

/** Longest run of consonant (non-vowel, alphabetic) characters. */
function longestConsonantRun(s: string): number {
	let max = 0;
	let cur = 0;
	for (const ch of s) {
		if (/[a-zA-Z]/.test(ch) && !VOWELS.has(ch)) {
			cur++;
			if (cur > max) max = cur;
		} else {
			cur = 0;
		}
	}
	return max;
}

/** Count of upper↔lower transitions (e.g. "aB" or "Ba" = 1 each). */
function caseTransitions(s: string): number {
	let t = 0;
	for (let i = 1; i < s.length; i++) {
		const prev = s[i - 1];
		const curr = s[i];
		if (
			(/[a-z]/.test(prev) && /[A-Z]/.test(curr)) ||
			(/[A-Z]/.test(prev) && /[a-z]/.test(curr))
		) {
			t++;
		}
	}
	return t;
}

// ── public API ─────────────────────────────────────────────────────────

/**
 * Returns `true` when `text` looks like machine-generated gibberish
 * rather than a human name / company / phrase.
 *
 * Tuned against the observed spam pattern: single-token mixed-case random
 * strings 10-25 chars long with no spaces.
 */
export function isGibberish(text: string): boolean {
	const trimmed = text.trim();
	if (trimmed.length < 6) return false; // too short to judge

	// Strip non-alpha for the letter-level checks.
	const alpha = trimmed.replace(/[^a-zA-Z]/g, "");
	if (alpha.length < 6) return false;

	// 1. Single "word" longer than 12 alpha chars with no space → suspicious.
	const words = trimmed.split(/\s+/);
	const longSingleWord = words.length === 1 && alpha.length > 12;

	// 2. High Shannon entropy (random chars → ≈ 4+ bits/char for these lengths).
	const entropy = shannonEntropy(alpha);
	const highEntropy = entropy > 3.8 && alpha.length > 8;

	// 3. Abnormally long consonant run (> 4 in a row is rare in real names).
	const consonantRun = longestConsonantRun(alpha);
	const longConsonants = consonantRun > 4;

	// 4. Too many case transitions for the string length.
	//    Real "Title Case" names have 1-2 transitions per word. Random strings
	//    average one every ~2 chars.
	const transitions = caseTransitions(alpha);
	const transitionRate = transitions / alpha.length;
	const chaotiCase = transitionRate > 0.3 && alpha.length > 8;

	// 5. Very low vowel ratio (< 20% in alpha chars).
	const vowelCount = [...alpha].filter((ch) => VOWELS.has(ch)).length;
	const lowVowels = vowelCount / alpha.length < 0.2 && alpha.length > 8;

	// Require at least 2 signals to flag — a single marginal hit might catch
	// legitimate unusual names (e.g. Eastern European surnames).
	const signals = [
		longSingleWord,
		highEntropy,
		longConsonants,
		chaotiCase,
		lowVowels,
	].filter(Boolean).length;

	return signals >= 2;
}

/**
 * Scans a message body for embedded gibberish tokens — random strings the
 * bots pad their messages with (e.g. "NZsEncWmvzsxgBhXtcFZlz").
 */
export function messageContainsGibberish(message: string): boolean {
	// Split on whitespace + common punctuation and check each token.
	const tokens = message.split(/[\s,;:!?()\[\]{}]+/).filter(Boolean);
	for (const token of tokens) {
		// Only check tokens that are purely alphabetic and long enough.
		if (/^[a-zA-Z]{8,}$/.test(token) && isGibberish(token)) {
			return true;
		}
	}
	return false;
}

/** Minimum milliseconds a human would need to fill the form. */
const MIN_SUBMIT_MS = 3_000;

/**
 * Top-level spam check for the consultation / contact form.
 *
 * Returns `null` when the submission looks legitimate, or a short reason
 * string (for server logging only — never expose to the client).
 */
export function detectSpam(body: {
	name?: string;
	email?: string;
	company?: string;
	message?: string;
	hp?: string;
	_t?: number; // client-side timestamp when form was rendered
}): string | null {
	// 1. Honeypot filled.
	if (typeof body.hp === "string" && body.hp.trim().length > 0) {
		return "honeypot";
	}

	// 2. Timing check — form submitted faster than a human can type.
	if (typeof body._t === "number") {
		const elapsed = Date.now() - body._t;
		if (elapsed < MIN_SUBMIT_MS) {
			return "timing";
		}
	}

	// 3. Gibberish name.
	if (body.name && isGibberish(body.name)) {
		return "gibberish-name";
	}

	// 4. Gibberish company.
	if (body.company && isGibberish(body.company)) {
		return "gibberish-company";
	}

	// 5. Gibberish tokens inside the message.
	if (body.message && messageContainsGibberish(body.message)) {
		return "gibberish-message";
	}

	return null;
}
