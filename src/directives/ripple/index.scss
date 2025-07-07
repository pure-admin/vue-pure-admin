/* stylelint-disable-next-line scss/dollar-variable-colon-space-after */
$ripple-animation-transition-in:
  transform 0.4s cubic-bezier(0, 0, 0.2, 1),
  opacity 0.2s cubic-bezier(0, 0, 0.2, 1) !default;
$ripple-animation-transition-out: opacity 0.5s cubic-bezier(0, 0, 0.2, 1) !default;
$ripple-animation-visible-opacity: 0.25 !default;

.v-ripple {
  &__container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    contain: strict;
    overflow: hidden;
    pointer-events: none;
    border-radius: inherit;
  }

  &__animation {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    pointer-events: none;
    background: currentcolor;
    border-radius: 50%;
    opacity: 0;
    will-change: transform, opacity;

    &--enter {
      opacity: 0;
      transition: none;
    }

    &--in {
      opacity: $ripple-animation-visible-opacity;
      transition: $ripple-animation-transition-in;
    }

    &--out {
      opacity: 0;
      transition: $ripple-animation-transition-out;
    }
  }
}
