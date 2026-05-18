/**
 * Input Controller
 *
 * Handles all user input events (mouse, touch, keyboard) and
 * translates them into carousel actions.
 */

import type { Carousel } from '../carousel/Carousel';

export interface InputControllerConfig {
  enableKeyboard?: boolean;
  enableTouch?: boolean;
  enableMouse?: boolean;
  dragThreshold?: number;
}

export class InputController {
  private carousel: Carousel;
  private container: HTMLElement;
  private config: Required<InputControllerConfig>;
  private isMouseDown = false;
  private startX = 0;
  private startY = 0;
  private hasMoved = false;
  private boundHandlers: Map<string, EventListener> = new Map();

  constructor(
    carousel: Carousel,
    container: HTMLElement,
    config: InputControllerConfig = {}
  ) {
    this.carousel = carousel;
    this.container = container;
    this.config = {
      enableKeyboard: config.enableKeyboard ?? true,
      enableTouch: config.enableTouch ?? true,
      enableMouse: config.enableMouse ?? true,
      dragThreshold: config.dragThreshold ?? 5
    };

    this.setupEventListeners();
  }

  /**
   * Setup all event listeners
   */
  private setupEventListeners(): void {
    // Mouse events
    if (this.config.enableMouse) {
      this.addListener(this.container, 'mousedown', this.onMouseDown);
      this.addListener(window, 'mousemove', this.onMouseMove);
      this.addListener(window, 'mouseup', this.onMouseUp);
      this.addListener(this.container, 'click', this.onClick);
    }

    // Touch events
    if (this.config.enableTouch) {
      this.addListener(this.container, 'touchstart', this.onTouchStart, { passive: false });
      this.addListener(window, 'touchmove', this.onTouchMove, { passive: false });
      this.addListener(window, 'touchend', this.onTouchEnd);
    }

    // Keyboard events
    if (this.config.enableKeyboard) {
      this.addListener(window, 'keydown', this.onKeyDown);
    }
  }

  /**
   * Helper to add and track event listeners
   */
  private addListener(
    target: EventTarget,
    type: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    const boundHandler = handler.bind(this);
    this.boundHandlers.set(`${type}-${target === window ? 'window' : 'container'}`, boundHandler);
    target.addEventListener(type, boundHandler, options);
  }

  /**
   * Mouse down handler
   */
  private onMouseDown = (e: Event): void => {
    const event = e as MouseEvent;
    this.isMouseDown = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.hasMoved = false;
    this.carousel.onDragStart(event.clientX, event.clientY);
  };

  /**
   * Mouse move handler
   */
  private onMouseMove = (e: Event): void => {
    const event = e as MouseEvent;

    // Check if we've moved enough to be considered a drag
    if (this.isMouseDown) {
      const dx = event.clientX - this.startX;
      const dy = event.clientY - this.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > this.config.dragThreshold) {
        this.hasMoved = true;
      }
    }

    if (this.isMouseDown) {
      this.carousel.onDragMove(event.clientX, event.clientY);
    } else {
      // Hover effect
      this.carousel.onMouseMove(
        event.clientX,
        event.clientY,
        this.container.clientWidth,
        this.container.clientHeight
      );
    }
  };

  /**
   * Mouse up handler
   */
  private onMouseUp = (): void => {
    this.isMouseDown = false;
    this.carousel.onDragEnd();
  };

  /**
   * Click handler
   */
  private onClick = (e: Event): void => {
    const event = e as MouseEvent;

    console.log('InputController click - hasMoved:', this.hasMoved);

    // Only handle click if we haven't dragged
    if (!this.hasMoved) {
      console.log('InputController calling carousel.onClick at:', event.clientX, event.clientY);
      this.carousel.onClick(
        event.clientX,
        event.clientY,
        this.container.clientWidth,
        this.container.clientHeight
      );
    }
  };

  /**
   * Touch start handler
   */
  private onTouchStart = (e: Event): void => {
    const event = e as TouchEvent;
    if (event.touches.length !== 1) return;

    const touch = event.touches[0];
    this.isMouseDown = true;
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.hasMoved = false;
    this.carousel.onDragStart(touch.clientX, touch.clientY);
  };

  /**
   * Touch move handler
   */
  private onTouchMove = (e: Event): void => {
    const event = e as TouchEvent;
    if (event.touches.length !== 1 || !this.isMouseDown) return;

    const touch = event.touches[0];

    // Check drag threshold
    const dx = touch.clientX - this.startX;
    const dy = touch.clientY - this.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.config.dragThreshold) {
      this.hasMoved = true;
      event.preventDefault(); // Prevent scroll when dragging
    }

    this.carousel.onDragMove(touch.clientX, touch.clientY);
  };

  /**
   * Touch end handler
   */
  private onTouchEnd = (e: Event): void => {
    const event = e as TouchEvent;

    if (!this.hasMoved && event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];
      this.carousel.onClick(
        touch.clientX,
        touch.clientY,
        this.container.clientWidth,
        this.container.clientHeight
      );
    }

    this.isMouseDown = false;
    this.carousel.onDragEnd();
  };

  /**
   * Keyboard handler
   */
  private onKeyDown = (e: Event): void => {
    const event = e as KeyboardEvent;

    switch (event.key) {
      case 'Escape':
        if (this.carousel.hasActiveProject()) {
          this.carousel.resetView();
        }
        break;
      case 'ArrowLeft':
        // Could implement carousel navigation
        break;
      case 'ArrowRight':
        // Could implement carousel navigation
        break;
    }
  };

  /**
   * Dispose of all event listeners
   */
  dispose(): void {
    // Remove mouse events
    if (this.config.enableMouse) {
      this.removeListener(this.container, 'mousedown');
      this.removeListener(window, 'mousemove');
      this.removeListener(window, 'mouseup');
      this.removeListener(this.container, 'click');
    }

    // Remove touch events
    if (this.config.enableTouch) {
      this.removeListener(this.container, 'touchstart');
      this.removeListener(window, 'touchmove');
      this.removeListener(window, 'touchend');
    }

    // Remove keyboard events
    if (this.config.enableKeyboard) {
      this.removeListener(window, 'keydown');
    }

    this.boundHandlers.clear();
  }

  /**
   * Helper to remove event listeners
   */
  private removeListener(target: EventTarget, type: string): void {
    const key = `${type}-${target === window ? 'window' : 'container'}`;
    const handler = this.boundHandlers.get(key);
    if (handler) {
      target.removeEventListener(type, handler);
    }
  }
}
