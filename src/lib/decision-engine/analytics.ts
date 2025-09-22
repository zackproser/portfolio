'use client';

import { Persona } from './types';

export interface AnalyticsEvent {
  type: 'index_filter' | 'tool_selection' | 'comparison_start' | 'verdict_view' | 'persona_change' | 'evidence_click' | 'outbound_click' | 'decision_made';
  timestamp: number;
  sessionId: string;
  data: Record<string, any>;
}

export interface DecisionOutcome {
  tool1: string;
  tool2: string;
  winner: string;
  persona: Persona;
  timeToDecision: number; // seconds
  evidenceClicks: number;
  outboundClicks: number;
  verdictAgreement: boolean; // did user agree with verdict?
}

export class DecisionAnalytics {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private startTime: number;
  private decisionStartTime?: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }

  /**
   * Track filter usage on index page
   */
  trackIndexFilter(filterType: string, filterValue: string | boolean) {
    this.trackEvent('index_filter', {
      filterType,
      filterValue,
      page: 'index'
    });
  }

  /**
   * Track tool selection for comparison
   */
  trackToolSelection(toolId: string, selected: boolean) {
    this.trackEvent('tool_selection', {
      toolId,
      selected,
      totalSelected: this.getSelectedTools().length
    });
  }

  /**
   * Track when user starts a comparison
   */
  trackComparisonStart(tool1: string, tool2: string, persona: Persona) {
    this.decisionStartTime = Date.now();
    this.trackEvent('comparison_start', {
      tool1,
      tool2,
      persona,
      timeToCompare: this.getTimeToCompare()
    });
  }

  /**
   * Track verdict page views
   */
  trackVerdictView(tool1: string, tool2: string, winner: string, persona: Persona) {
    this.trackEvent('verdict_view', {
      tool1,
      tool2,
      winner,
      persona,
      scrollDepth: this.getScrollDepth()
    });
  }

  /**
   * Track persona changes
   */
  trackPersonaChange(oldPersona: Persona, newPersona: Persona, tool1: string, tool2: string) {
    this.trackEvent('persona_change', {
      oldPersona,
      newPersona,
      tool1,
      tool2,
      timeOnPage: this.getTimeOnPage()
    });
  }

  /**
   * Track evidence source clicks
   */
  trackEvidenceClick(sourceUrl: string, toolId: string, field: string) {
    this.trackEvent('evidence_click', {
      sourceUrl,
      toolId,
      field,
      timeOnPage: this.getTimeOnPage()
    });
  }

  /**
   * Track outbound clicks to vendor sites
   */
  trackOutboundClick(destination: string, toolId: string, context: 'verdict' | 'detail' | 'comparison') {
    this.trackEvent('outbound_click', {
      destination,
      toolId,
      context,
      timeOnPage: this.getTimeOnPage()
    });
  }

  /**
   * Track when user makes a decision (clicks winner's docs or copies snippet)
   */
  trackDecisionMade(outcome: DecisionOutcome) {
    this.trackEvent('decision_made', {
      ...outcome,
      totalSessionTime: this.getTotalSessionTime(),
      eventsBeforeDecision: this.events.length
    });
  }

  /**
   * Track verdict disagreement
   */
  trackVerdictDisagreement(tool1: string, tool2: string, userChoice: string, verdictWinner: string, reason: string) {
    this.trackEvent('verdict_disagreement', {
      tool1,
      tool2,
      userChoice,
      verdictWinner,
      reason,
      timeOnPage: this.getTimeOnPage()
    });
  }

  /**
   * Get analytics summary for current session
   */
  getSessionSummary() {
    const filterEvents = this.events.filter(e => e.type === 'index_filter');
    const comparisonEvents = this.events.filter(e => e.type === 'comparison_start');
    const decisionEvents = this.events.filter(e => e.type === 'decision_made');
    
    return {
      sessionId: this.sessionId,
      totalTime: this.getTotalSessionTime(),
      filtersUsed: filterEvents.length,
      comparisonsStarted: comparisonEvents.length,
      decisionsMade: decisionEvents.length,
      timeToFirstDecision: this.getTimeToFirstDecision(),
      evidenceEngagement: this.getEvidenceEngagement(),
      personaSwitching: this.getPersonaSwitching()
    };
  }

  /**
   * Export events for analysis
   */
  exportEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  private trackEvent(type: AnalyticsEvent['type'], data: Record<string, any>) {
    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      data
    };
    
    this.events.push(event);
    
    // Send to analytics service (replace with your preferred analytics)
    this.sendToAnalytics(event);
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // Replace with your analytics service (Google Analytics, Mixpanel, etc.)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.type, {
        event_category: 'decision_engine',
        event_label: JSON.stringify(event.data),
        value: event.timestamp
      });
    }
    
    // Also send to your backend for detailed analysis
    fetch('/api/analytics/decision-engine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    }).catch(error => {
      console.warn('Failed to send analytics event:', error);
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSelectedTools(): string[] {
    const selectionEvents = this.events.filter(e => e.type === 'tool_selection');
    const selected = new Set<string>();
    
    selectionEvents.forEach(event => {
      if (event.data.selected) {
        selected.add(event.data.toolId);
      } else {
        selected.delete(event.data.toolId);
      }
    });
    
    return Array.from(selected);
  }

  private getTimeToCompare(): number {
    if (!this.decisionStartTime) return 0;
    return (this.decisionStartTime - this.startTime) / 1000;
  }

  private getTimeOnPage(): number {
    return (Date.now() - this.startTime) / 1000;
  }

  private getTotalSessionTime(): number {
    return (Date.now() - this.startTime) / 1000;
  }

  private getScrollDepth(): number {
    // This would need to be implemented with scroll tracking
    return 0;
  }

  private getTimeToFirstDecision(): number {
    const firstDecision = this.events.find(e => e.type === 'decision_made');
    return firstDecision ? (firstDecision.timestamp - this.startTime) / 1000 : 0;
  }

  private getEvidenceEngagement(): number {
    return this.events.filter(e => e.type === 'evidence_click').length;
  }

  private getPersonaSwitching(): number {
    return this.events.filter(e => e.type === 'persona_change').length;
  }
}

// Global analytics instance
let analyticsInstance: DecisionAnalytics | null = null;

export function getAnalytics(): DecisionAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new DecisionAnalytics();
  }
  return analyticsInstance;
}

// React hook for analytics
export function useDecisionAnalytics() {
  return getAnalytics();
}

// Utility functions for tracking specific interactions
export function trackFilterUsage(filterType: string, value: string | boolean) {
  getAnalytics().trackIndexFilter(filterType, value);
}

export function trackToolSelection(toolId: string, selected: boolean) {
  getAnalytics().trackToolSelection(toolId, selected);
}

export function trackComparisonStart(tool1: string, tool2: string, persona: Persona) {
  getAnalytics().trackComparisonStart(tool1, tool2, persona);
}

export function trackVerdictView(tool1: string, tool2: string, winner: string, persona: Persona) {
  getAnalytics().trackVerdictView(tool1, tool2, winner, persona);
}

export function trackPersonaChange(oldPersona: Persona, newPersona: Persona, tool1: string, tool2: string) {
  getAnalytics().trackPersonaChange(oldPersona, newPersona, tool1, tool2);
}

export function trackEvidenceClick(sourceUrl: string, toolId: string, field: string) {
  getAnalytics().trackEvidenceClick(sourceUrl, toolId, field);
}

export function trackOutboundClick(destination: string, toolId: string, context: 'verdict' | 'detail' | 'comparison') {
  getAnalytics().trackOutboundClick(destination, toolId, context);
}

export function trackDecisionMade(outcome: DecisionOutcome) {
  getAnalytics().trackDecisionMade(outcome);
}

export function trackVerdictDisagreement(tool1: string, tool2: string, userChoice: string, verdictWinner: string, reason: string) {
  getAnalytics().trackVerdictDisagreement(tool1, tool2, userChoice, verdictWinner, reason);
}

// Declare global gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

