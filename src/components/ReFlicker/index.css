.point {
  width: var(--point-width);
  height: var(--point-height);
  background: var(--point-background);
  position: relative;
  border-radius: var(--point-border-radius);
}

.point-flicker:after {
  background: var(--point-background);
}

.point-flicker:before,
.point-flicker:after {
  content: "";
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  border-radius: var(--point-border-radius);
  animation: flicker 1.2s ease-out infinite;
}

@keyframes flicker {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  100% {
    transform: scale(var(--point-scale));
    opacity: 0;
  }
}
