/**
 * Tween Manager
 *
 * Centralized management for all TWEEN.js animations.
 * Handles the update loop and provides utility functions.
 */

import { update as tweenUpdate, removeAll, getAll, Tween, Easing } from '@tweenjs/tween.js';

export class TweenManager {
  private static instance: TweenManager | null = null;
  private animationFrameId: number | null = null;
  private isRunning = false;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): TweenManager {
    if (!TweenManager.instance) {
      TweenManager.instance = new TweenManager();
    }
    return TweenManager.instance;
  }

  /**
   * Start the tween update loop
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  /**
   * Stop the tween update loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Animation loop for tweens
   */
  private animate = (): void => {
    if (!this.isRunning) return;
    this.animationFrameId = requestAnimationFrame(this.animate);
    tweenUpdate();
  };

  /**
   * Update all tweens (call this if not using the internal loop)
   */
  update(time?: number): void {
    tweenUpdate(time);
  }

  /**
   * Remove all active tweens
   */
  removeAll(): void {
    removeAll();
  }

  /**
   * Get count of active tweens
   */
  getActiveCount(): number {
    return getAll().length;
  }

  /**
   * Create a simple fade animation
   */
  static createFade(
    target: { opacity: number },
    toOpacity: number,
    duration: number,
    onComplete?: () => void
  ): Tween<{ opacity: number }> {
    return new Tween(target)
      .to({ opacity: toOpacity }, duration)
      .easing(Easing.Quadratic.Out)
      .onComplete(() => onComplete?.())
      .start();
  }

  /**
   * Create a position animation
   */
  static createMove(
    target: { x: number; y: number; z: number },
    to: { x?: number; y?: number; z?: number },
    duration: number,
    onComplete?: () => void
  ): Tween<{ x: number; y: number; z: number }> {
    return new Tween(target)
      .to(to, duration)
      .easing(Easing.Quadratic.Out)
      .onComplete(() => onComplete?.())
      .start();
  }

  /**
   * Create a scale animation
   */
  static createScale(
    target: { x: number; y: number; z: number },
    to: { x?: number; y?: number; z?: number },
    duration: number,
    onComplete?: () => void
  ): Tween<{ x: number; y: number; z: number }> {
    return new Tween(target)
      .to(to, duration)
      .easing(Easing.Elastic.Out)
      .onComplete(() => onComplete?.())
      .start();
  }

  /**
   * Dispose the manager
   */
  dispose(): void {
    this.stop();
    this.removeAll();
    TweenManager.instance = null;
  }
}

// Re-export Easing for convenience
export { Easing };
