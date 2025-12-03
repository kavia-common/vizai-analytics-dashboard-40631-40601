/**
 * Shared model types via JSDoc typedefs to help editors.
 */

/**
 * @typedef {'Pacing'|'Recumbent'|'Scratching'|'Self-directed'} BehaviorType
 */

/**
 * @typedef {Object} BehaviorSummary
 * @property {BehaviorType} behavior_type
 * @property {number} count
 * @property {number} total_duration_seconds
 * @property {number} avg_duration_seconds
 * @property {number} pct_of_period
 */

/**
 * @typedef {Object} BehaviorEvent
 * @property {string} id
 * @property {BehaviorType} behavior_type
 * @property {string} start_timestamp
 * @property {string} end_timestamp
 * @property {number} duration_seconds
 * @property {string} camera_source
 * @property {string} video_url
 * @property {string} thumbnail_url
 * @property {number} confidence_score
 * @property {Record<string,any>} environmental_context
 */

/**
 * @typedef {Object} AnimalProfile
 * @property {string} id
 * @property {string} name
 * @property {string} species
 * @property {string} photo_url
 * @property {'Normal'|'Alert'|'Review'} status
 * @property {string} last_updated
 */
